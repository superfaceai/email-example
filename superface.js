const { getClient } = require('./client')
const { getFailoverInfo } = require('./hooks')

// get centralized superface client
const client = getClient()

// Send Email
//  https://superface.ai/communication/send-email
//
//  available providers: mock, sendgrid, mailchimp, mailgun
//
async function sendEmail(email, subject, body) {
    const profile = await client.getProfile('communication/send-email')
    const result = await profile.getUseCase('SendEmail').perform({
        to: email,
        subject: subject,
        text: body,
    })

    let success = false,
        message,
        log

    if (result.isErr()) {
        message = 'Email failed'
        console.log(message, result.error)
        log = result.error
    } else {
        message = 'Email was sent'
        console.log(message, result.value)
        log = result.value
        success = true
    }

    return {
        failoverInfo: getFailoverInfo('SendEmail'),
        success,
        message,
        log,
    }
}

// Fetch user repositories
//  https://superface.ai/vcs/user-repos
//
//  available providers: mock, github, gitlab, bitbucket
//
async function fetchUserRepos(user, service) {
    const profile = await client.getProfile('vcs/user-repos')
    const provider = await client.getProvider(service)
    const result = await profile
        .getUseCase('UserRepos')
        .perform({ user }, { provider })

    let success = false,
        message,
        repos,
        log

    if (result.isErr()) {
        message = 'Failed to get user repositories'
        log = result.error
        repos = []
        console.log(message)
    } else {
        message = 'User repositories recieved'
        repos = result.value.repos
        log = result.value
        success = true
        console.log(message)
    }

    return {
        success,
        message,
        repos,
        log,
    }
}

// ReverseGeocode
//  https://superface.ai/address/geocoding
//
//  available providers: mock, nominatim, google-apis, opencage
//
async function getAddress(latitude, longitude, service) {
    const profile = await client.getProfile('address/geocoding')
    const provider = await client.getProvider(service) // HINT: if you do not configure provider the first in your super.json is used
    const result = await profile
        .getUseCase('ReverseGeocode')
        .perform({ latitude, longitude }, { provider })

    let success = false,
        message,
        log

    if (result.isErr()) {
        message = 'Getting address failed'
        log = result.error
        console.log(message)
    } else {
        message = result.value[0].formattedAddress
        log = result.value
        success = true
        console.log(result.value[0])
    }

    return {
        success,
        message,
        log,
    }
}

module.exports = {
    sendEmail,
    fetchUserRepos,
    getAddress,
}
