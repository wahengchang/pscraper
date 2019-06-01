(async () => {
  const argv = require('optimist').argv;
  const listener = require('./listener')
  const cmd = require('@pscraper/cmd')
  const {reportGenerator} = require('../lib/reportGenerator')
  const fs = require('fs')
  const puppeteer = require('puppeteer');

  const CONFIG_FILE = argv.config || './config'
  const config = require(`${process.cwd()}/${CONFIG_FILE}`)

  const {
      url,
      name: projectName,
      isDeletTempDir,
      isDownloadResource,
      isDownloadCookies,
      downloadResourceType,
      beforeGotoPage,
      afterPageLoad,
      afterHtmlLoad,
      isReport
    } = config

  const uniqueName = () => {
    return projectName || new Date().getTime()
  }

  try {
    const tp = uniqueName()
    const dir = `${projectName}`
    try {
      fs.mkdirSync(`./${dir}`)
    }
    catch(err){
      console.log('[ERROR] file existed, going to remove')
      await cmd(`rm -R ./${dir}`)
      fs.mkdirSync(`./${dir}`)
    }

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36')

    if(beforeGotoPage) {
      console.log('[INFO] before: Going to page: ', url)
      await beforeGotoPage(page)
    }
      
    await listener.requestInterceptor(page, {
      dir: `${dir}/`,
      isDownloadResource, downloadResourceType
    })

    console.log('[INFO] Going to page: ', url)
    await page.goto(url, {waitUntil: 'networkidle0'});

    if(afterPageLoad)
      await afterPageLoad(page);

    const html = await page.content();
    if(afterHtmlLoad)
      await afterHtmlLoad(html);
    

    fs.writeFileSync(`./${dir}/index.html`, html)
    console.log('[INFO] created index.html')
    fs.writeFileSync(`./${dir}/meta.json`, JSON.stringify(page.locals['reqObj']))
    console.log('[INFO] created meta.json')
    fs.writeFileSync(`./${dir}/config.json`, JSON.stringify(config))
    console.log('[INFO] created config.json')
    await page.screenshot({path: `./${dir}/${tp}-screenshot.png`});

    if(isDownloadCookies) {
      const cookies = await page._client.send('Network.getAllCookies');
      fs.writeFileSync(`./${dir}/cookies.json`, JSON.stringify(cookies))
    }

    await browser.close();
    console.log('[INFO] done, browser closed')

    if(isReport){
      // await cmd(`node script/generateReport.js --meta='${dir}/meta.json' --output='${dir}/report.json'`)
      fs.writeFileSync(`./${dir}/report.json`, JSON.stringify(reportGenerator(page.locals['reqObj'])))
    }

    if(isDeletTempDir) {
      await cmd(`rm -r ./${dir}`)
      console.log(`[INFO] removed dir : ./${dir}`)
    }
  }
  catch(err){
    console.log('[ERROR] scraper base', err)
    throw '[ERROR] scraper base'

  }
})();