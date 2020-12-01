module.exports = {
  chainWebpack: config => {
    config.plugins.delete("prefetch");
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/css/variables.scss";`
      }
    }
  }
};
