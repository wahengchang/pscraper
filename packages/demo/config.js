
const scrollDown = async function(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
  }

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