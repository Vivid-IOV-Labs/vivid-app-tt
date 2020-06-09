module.exports = {
    publicPath: process.env.HEROKU_DEPLOY === 'true' || process.env.NODE_ENV === "development"
        ? '/' //This is for deployment to Heroku.
        : '/vivid-app-tt/' //This is for deployment to Github Pages.
}