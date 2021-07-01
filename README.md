# Hello Superface
### 8 lines of code to connect to 12 APIs

This project showcases the use of <https://superface.ai> to seamlessly integrate APIs without worrying about how they are implemented or even knowing what API and therefore provider do you use!

## The Demo

The demo application allows you to fetch the names of repositores for a specified GitHub or Gitlab user. The list is then sent to the email entered in the form.

To see how to fetch the repositories or send email using Superface's [OneSDK](https://github.com/superfaceai/one-sdk-js) check out the `fetchUserRepos()` and `sendEmail()` fuctions in the `superface.js` file.

## What's in this project?

← `superface.js`: This folder holds the main template for your site along with some basic data files.

← `public/`, `src/`: Folders from the remixed from the Glitch Node.js starter project, it is safe to ignore those for the puprose of learning about Superface

← `server.js`: The main server script of the demo site, it does not contain an Superface-specific code only a boiler plate to make the demo work

← `superface/`: Superface folder that contains the configuration of the [OneSDK](https://github.com/superfaceai/one-sdk-js) for the capabilities and providers used in the demo

← `superface/super.json`: The actual configuration of the capabilties and providers

← `.env`: Secrets such as API keys for the used providers

## More Examples

Besides sending email and fetching GIT VCS user repositories you can find the following examples in the `superface.js`:

### Send SMS

The `sendSMS()` functions sends a single text message to single recipient. Can you spot in the code what provider is used?

### Geocoding

The `geocode()` functions showcases conversion of a postal address into geographical coordinates and then sending those coordinates as an SMS

## 8 lines of code to connect to 12 APIs

Four (4) capabilities, twelve (12) providers (=APIs), eight (8) lines of code

### Send Email

```js
const profile = await sdk.getProfile("communication/send-email");
const result = await profile.getUseCase("SendEmail").perform({ ... })
```

### Get user's git repositories

```js
const profile = await sdk.getProfile("vcs/user-repos");
const result = await profile.getUseCase("UserRepos").perform({ ... })
```

### Send SMS

```js
const profile = await sdk.getProfile("communication/send-sms");
const result = await profile.getUseCase("SendMessage").perform({ ... })
```

### Geocode Postal Address

```js
const profile = await sdk.getProfile("address/geocoding");
const result = await profile.getUseCase("Geocode").perform({ ... })
```



## Get in touch

We would ❤️ to hear you feedback! Please get it touch either to Vrata (<a href="mailto:v@superface.ai">v@superface.ai</a>) or Z (<a href="mailto:z@superface.ai">z@superface.ai</a>).

If you haven't already, sign up at [https://superface.ai](https://superface.ai). 

You can also follow us at Twitter [@superfaceai](https://twitter.com/superfaceai).
