const {scrollDown} = require('./lib/browserHelper')

module.exports = {
  name: `yahoo-${new Date().getTime()}`,
  url: 'https://yahoo.com/',
  isDownloadResource: true,
  isReport: true,
  downloadResourceType: [],
  afterPageLoad: scrollDown,
  afterHtmlLoad: async function(html){
    // console.log(html)
  },
}