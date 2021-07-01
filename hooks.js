const { getClient } = require("./client");

// get superface client
const client = getClient();

/**
 * Object filled by client event hook on prefetch
 * containing usecase names as keys
 * and array of provider names as values.
 *
 * failoverInfo = {
 *   SendEmail: ['sendgrid', 'mailgun']
 *   UserRepos: ['github']
 * }
 */
let failoverInfo = {};

/**
 * Triggers fake failover on email provider sendgrid
 * and adds context information to local failover info object
 */
client.on(
  "pre-fetch",
  { priority: 10, filter: { profile: "communication/send-email" } },
  (context, args) => {
    addFailoverInfo(context.usecase, context.provider);

    if (context.provider === "sendgrid") {
      console.log(
        "Modifying original base url of provider sendgrid to trigger failover"
      );

      return {
        kind: "modify",
        newArgs: ["https://localhost.unavailable", args[1]]
      };
    } else {
      return { kind: "continue" };
    }
  }
);

function getFailoverInfo(usecase) {
  if (!usecase) {
    return failoverInfo;
  }

  return failoverInfo[usecase];
}

function addFailoverInfo(usecase, provider) {
  if (failoverInfo[usecase]) {
    if (failoverInfo[usecase].includes(provider)) {
      failoverInfo[usecase] = [];
    }

    failoverInfo[usecase].push(provider);
  } else {
    failoverInfo[usecase] = [provider];
  }
}

module.exports = {
  getFailoverInfo,
  addFailoverInfo
};
