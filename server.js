const childProcess = require('child_process')
const path = require('path')
const dotenv = require('dotenv')
const { promisify } = require('util')

const { triggerFailover } = require('./hooks')
const { sendEmail, fetchUserRepos, getAddress } = require('./superface')

const exec = promisify(childProcess.exec)

async function main() {
    // load enviroment variables
    dotenv.config()

    // Require the fastify framework and instantiate it
    const server = require('fastify')({
        // set this to true for detailed logging:
        logger: false,
    })

    // Setup our static files
    await server.register(require('fastify-static'), {
        root: path.join(__dirname, 'public'),
        prefix: '/', // optional: default '/'
    })

    // fastify-formbody lets us parse incoming forms
    await server.register(require('fastify-formbody'))

    // point-of-view is a templating manager for fastify
    await server.register(require('point-of-view'), {
        engine: {
            handlebars: require('handlebars'),
        },
    })

    // load and parse SEO data
    const seo = require('./src/seo.json')
    if (seo.url === 'glitch-default') {
        seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`
    }

    // Our home page route, this pulls from src/pages/index.hbs
    server.get('/', function (request, reply) {
        let params = { seo: seo }
        reply.view('/src/pages/index.hbs', params)
    })

    // A POST route to handle form submissions
    server.post('/', async function (request, reply) {
        const { email, type, doFailover } = request.body

        // "Validate form input"
        let errorMessage
        if (!email || email === '') {
            errorMessage = 'please enter your email'
        } else if (!type) {
            errorMessage = 'please choose one type of usecase'
        }

        switch (type) {
            case 'classic':
                if (!request.body.subject) {
                    errorMessage = 'please enter some subject'
                } else if (!request.body.text) {
                    errorMessage = 'please enter your message'
                }
                break

            case 'user-repos':
                if (!request.body.user) {
                    errorMessage = 'please enter username'
                } else if (!request.body.service) {
                    errorMessage = 'please select a provider'
                }
                break

            case 'address':
                if (!request.body.latitude || !request.body.longitude) {
                    errorMessage = 'please enter latitude and longitude'
                } else if (!request.body.service) {
                    errorMessage = 'please select a provider'
                }
        }

        triggerFailover(doFailover === 'on')

        // Do the business
        let to, subject, mailBody, success, message, log, repos, failoverInfo
        if (!errorMessage) {
            to = request.body.email

            switch (type) {
                case 'classic':
                    // Inject the email subject & body from request
                    subject = request.body.subject
                    mailBody = request.body.text
                    success = true
                    break

                case 'user-repos':
                    // Use superface to fetch the user repositories
                    ;({ success, message, repos, log } = await fetchUserRepos(
                        request.body.user,
                        request.body.service
                    ))

                    if (success) {
                        // Format the email subject & body
                        subject = 'List of VCS repositories'
                        mailBody = `Hi,\n\nhere is the list of repositories for ${request.body.user}:\n\n`

                        // Format recieved repositories
                        if (repos && repos.length) {
                            repos.forEach((entry) => {
                                mailBody += entry.name + '\n'
                            })
                        } else {
                            mailBody += 'no repositories found'
                        }

                        mailBody += '\n\n– Yours, https://superface.ai'
                    }
                    break

                case 'address':
                    const { latitude, longitude } = request.body

                    // Use Superface to get information about given location
                    ;({ success, message, log } = await getAddress(
                        latitude,
                        longitude,
                        request.body.service
                    ))

                    if (success) {
                        // Format the email subject & body
                        subject = 'Formatted address'
                        mailBody = `Hi,\n\naddress for given latitude: ${latitude} and longitude: ${longitude} is:\n\n${message}\n\n- Yours, https://superface.ai`
                    }
                    break
            }

            if (success) {
                // Use superface to send out the email
                ;({ failoverInfo, success, message, log } = await sendEmail(
                    to,
                    subject,
                    mailBody
                ))
            }
        }

        let resultLog
        if (log) {
            if (
                typeof log.toString === 'function' &&
                log.toString() !== '[object Object]'
            ) {
                resultLog = log.toString()
            } else {
                resultLog = JSON.stringify(log, null, 2)
            }
        }

        // Fills parametres for the view
        let params = {
            seo,
            message,
            errorMessage,
            success,
            resultLog,
            failoverInfo,
        }

        reply.view('/src/pages/index.hbs', params)
    })

    // webhook route for synchronization with github repository
    // https://github.com/superfaceai/email-example
    server.post('/git', async function (request, reply) {
        if (process.env.SECRET === undefined) {
            await reply.status(500)
        }

        const commitPushed = request.headers['x-github-event'] === 'push'
        const refArray = commitPushed ? request.body.ref.split('/') : []
        const branch = refArray[refArray.length - 1]

        const pushedToMaster = commitPushed && branch === 'main'
        const pullRequestMerged =
            request.headers['x-github-event'] === 'pullrequest' &&
            request.body.action === 'closed' &&
            request.body.pull_request.merged

        const hmac = crypto.createHmac('sha1', process.env.SECRET)
        const sig =
            'sha1=' + hmac.update(JSON.stringify(request.body)).digest('hex')

        if (
            (pushedToMaster || pullRequestMerged) &&
            sig === request.headers['x-hub-signature']
        ) {
            {
                const { stdout, stderr } = await exec('chmod 777 git.sh')
                server.log.info(stdout)
                server.log.error(stderr)
            }
            {
                const { stdout, stderr } = await exec('./git.sh')
                server.log.info(stdout)
                server.log.error(stderr)
            }
            {
                const { stdout, stderr } = await exec('refresh')
                server.log.info(stdout)
                server.log.error(stderr)
            }

            server.log.info('> [GIT] Updated with origin/main')
        }

        reply.status(200)
        reply.send('webhook completed')
    })

    // Run the server and report out to the logs
    server.listen(process.env.PORT ?? 64187, (err, address) => {
        if (err) {
            server.log.error(err)
            process.exit(1)
        }

        console.log(`Your app is listening on ${address}`)
        server.log.info(`server listening on ${address}`)
    })
}

main()
