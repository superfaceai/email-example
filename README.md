# Email Example

This project showcases the use of <https://superface.ai> to seamlessly integrate APIs without worrying about how they are implemented or even knowing what API and therefore provider do you use.

## Table of Contents

- [Application](#application)
- [What's in this project?](#whats-in-this-project)
- [Get in touch](#get-in-touch)

## Application

The demo application allows you to choose from 3 use cases, either classic email use case, fetch the names of repositores for a specified GitHub or Gitlab user or fetch the address for a specified coordinates and send these fetched information to the email entered in form.

To see how to fetch the repositories or send email using Superface's [OneSDK](https://github.com/superfaceai/one-sdk-js) check out the `fetchUserRepos()` and `sendEmail()` fuctions in the `superface.js` file.

## What's in this project?

← `superface.js`: This file contains all superface code except superface client code, which should be centralized. It contains functions like `fetchUserRepos()` where profile and provider are set and result from perform is handled

← `client.js`: This file contains centralized Superface client and function to get it

← `hooks.js`: This file contains settings of event hooks for centralized client, they're used to trigger fake failover on `pre-fetch`. It also contains functions to get information about failover.

← `public/`, `src/`: Folders from the remixed Glitch Node.js starter project, it is safe to ignore those for the puprose of learning about Superface

← `server.js`: The main server script of the demo site, it does not contain Superface-specific code, only a boiler plate to make the demo work

← `superface/`: Superface folder that contains the configuration of the [OneSDK](https://github.com/superfaceai/one-sdk-js) for the capabilities and providers used in the demo

← `superface/super.json`: The actual configuration of the capabilties and providers

← `.env`: Secrets such as API keys for the used providers

## Get in touch

We would ❤️ to hear your feedback! Please get in touch either with Vrata (<a href="mailto:v@superface.ai">v@superface.ai</a>) or Z (<a href="mailto:z@superface.ai">z@superface.ai</a>).

If you haven't already, sign up at [https://superface.ai](https://superface.ai). 

You can also follow us at Twitter [@superfaceai](https://twitter.com/superfaceai).
