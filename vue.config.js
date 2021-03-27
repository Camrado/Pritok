module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/styles/base.scss";'
      }
    }
  },
  devServer: {
    port: 8100,
    historyApiFallback: true
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/pritok/' : '/'
};
