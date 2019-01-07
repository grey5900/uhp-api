require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  rootURL: environment.isProduction ? 'http://localhost:3040' : 'http://localhost:3030',
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  app: {
    title: 'UHS',
    description: '',
    head: {
      titleTemplate: 'UHS: %s',
      meta: [
        {name: 'description', content: ''},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'UHS'},
        {property: 'og:image', content: 'https://react-redux.herokuapp.com/logo.jpg'},
        {property: 'og:locale', content: 'zh_CN'},
        {property: 'og:title', content: 'UHS'},
        {property: 'og:description', content: 'Universal Health System.'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@lxm'},
        {property: 'og:creator', content: '@lxm'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  },

}, environment);
