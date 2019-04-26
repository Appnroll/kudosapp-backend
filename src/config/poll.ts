export default {
  slackApi: process.env.KUDOS_SLACK_API,
  slackClientId: process.env.POLL_SLACK_CLIENT_ID,
  slackClientSecret: process.env.POLL_SLACK_CLIENT_SECRET,
  slackRedirectUri: process.env.POLL_SLACK_REDIRECT_URI,
  slackOAuthToken: process.env.POLL_SLACK_AUTH_TOKEN,
  slackAfterLoginRedirect: process.env.POLL_SLACK_AFTER_LOGIN_REDIRECT
};
