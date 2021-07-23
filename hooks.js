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
 * Variable representing whether user wants to trigger failover or not.
 */
let failover = false;

function triggerFailover(check) {
  failover = check;
}

/**
 * Triggers fake failover on email provider sendgrid
 * and adds context information to local failover info object
 */
client.on(
  "pre-fetch",
  { priority: 6, filter: { profile: "communication/send-email" } },
  (context, args) => {
    console.log(`PRE-FETCH: current provider: ${context.provider}`);
    addFailoverInfo(context.usecase, context.provider);

    if (failover) {
      if (context.provider === "sendgrid") {
        return {
          kind: "modify",
          newArgs: ["https://localhost.unavailable", args[1]]
        };
      }
    }

    return { kind: "continue" };
  }
);

function getFailoverInfo(usecase) {
  if (!usecase) {
    return failoverInfo;
  }

  if (!failoverInfo[usecase]) {
    return [];
  }

  return {
    happened: failoverInfo[usecase].length > 1,
    info: failoverInfo[usecase]
  };
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
  addFailoverInfo,
  triggerFailover
};
