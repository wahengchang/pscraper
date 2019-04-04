# Demo for @pscraper/scraper

## Install
```
$ yarn add @pscraper/scraper

or 


$ npm install @pscraper/scraper
```

## Run
```
$ npx @pscraper/scraper --config='./yourConfigName.js'

```

#### `./yourConfigName.js`
 - must have `./`

 ```js
const scrollDown = async function(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          // implement browser javascript 
          window.scrollBy(0, 100);
        })
    });
  }

module.exports = {
  name: `yahoo-${new Date().getTime()}`,
  url: 'https://yahoo.com/',
  isDownloadResource: true, //save to  ./name/file.css
  isDownloadCookies: true,  //save to  ./name/cookies.json
  isReport: true,           //save to  ./name/report.json
  downloadResourceType: ['document','stylesheet','script','image','font','xhr','other'],
  afterPageLoad: scrollDown, 
  afterHtmlLoad: async function(html){
    // console.log(html)
  },
}
```