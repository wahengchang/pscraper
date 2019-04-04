const {onlyCharDigit, urlFileName} = require('../../lib/string')
// const {resourceType} = require('./const')

class Interceptor {
  constructor(config= {}){
    const {isDownloadResource = false, dir = '', downloadResourceType = []} = config
    this.order = 0
    this.reqIdList = []
    this.reqObj = {}
    this.isDownloadResource = isDownloadResource
    this.dir = dir
    this.downloadResourceType = downloadResourceType
  }

  saveRequest(request) {
    const url = request.url();
    const headers = request.headers()
    const method = request.method()
    const reqId = onlyCharDigit(url)
    const resourceType = request.resourceType()
    const fileName = urlFileName(url)

    this.reqIdList.push(reqId);
    this.reqObj[reqId] = {
      order: this.order,
      url,
      resourceType,
      request: {method, headers},
      startedAt: new Date(),
      fileName,
      finishedAt: null,
      size: null,
      spendTime: null
    }
    this.order +=1 
  }

  saveReponse(response, cb) {
    const {isDownloadResource, dir} = this

    const request = response.request();
    const url = request.url();
    const status = response.status();
    const headers = response.headers()
    const size = headers['content-length']
    const res = {
      status, headers
    }

    const reqId = onlyCharDigit(url)
    const {reqObj: reqRoot, downloadResourceType} = this

    const {startedAt = new Date(), resourceType} = reqRoot[reqId] || {}
    const finishedAt = new Date()
    const spendTime = finishedAt - startedAt

    reqRoot[reqId]  = {
      ...reqRoot[reqId],
      response: {...res},
      spendTime,
      finishedAt,
      size
    }

    if(status === 302) return cb? cb() : null
    
    if(!isDownloadResource) return cb? cb() : null

    if(downloadResourceType.length <=0 || downloadResourceType.find(type => type === resourceType)) {
      response.buffer().then( (buffer) => {
        const fileName = urlFileName(url) || `${new Date().getTime()}.${resourceType}`

        reqRoot[reqId]  = {
          ...reqRoot[reqId],
          fileName,
          size: buffer.length,
        }
  
        require('fs').writeFileSync( `./${dir}${fileName}`, buffer)
  
        if(cb) {
          cb(this.reqIdList, this.reqObj)
        }
      })
    }
  }

  toJson(){
    const{reqIdList, reqObj} = this
    return { reqIdList, reqObj }
  }
}

const register = async (page, config) => {
  page.locals = {}
  page.locals['reqIdList'] = []
  page.locals['reqObj'] = {}
  const ir = new Interceptor(config)

  await page.setRequestInterception(true);
  page.on("request", request => {
    ir.saveRequest(request)
    request.continue();
  });
  page.on("requestfailed", request => {
    const url = request.url();
    console.log("\nrequest failed url:", url);
  });
  page.on("response", response => {
		// if (url === page.url()) {
		// 	mainUrlStatus = status;
    // }
    ir.saveReponse(response, (reqIdList, reqObj) => {
      page.locals['reqIdList'] = reqIdList
      page.locals['reqObj'] = reqObj
    })
  });
}


module.exports = register