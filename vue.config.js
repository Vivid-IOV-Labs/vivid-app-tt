module.exports = {
  // chainWebpack: config => {
  //   config.plugins.delete("prefetch");
  // },
  publicPath: process.env.NODE_ENV === "production" ? "/vivid-app-tt/" : "/",
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/css/variables.scss";`
      }
    }
  }
};
