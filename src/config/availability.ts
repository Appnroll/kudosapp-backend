export default {
  slackApi: process.env.KUDOS_SLACK_API,
  slackClientId: process.env.AVAILABILITY_SLACK_CLIENT_ID,
  slackClientSecret: process.env.AVAILABILITY_SLACK_CLIENT_SECRET,
  slackRedirectUri: process.env.AVAILABILITY_SLACK_REDIRECT_URI,
  slackOAuthToken: process.env.AVAILABILITY_SLACK_AUTH_TOKEN,
  slackAfterLoginRedirect: process.env.KUDOS_SLACK_AFTER_LOGIN_REDIRECT
};
