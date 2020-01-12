const DBClass = require('./db')
const { 
  STATUS_CREATED,
  STATUS_FINISHED,
  STATUS_FAIL
} = require('./const')

class Controller {
  constructor() {
    this.DB = new DBClass()
  }
  add(_sourceId = '', payload = {}) {
    return new Promise((resolve, reject)=> {
      const sourceId = _sourceId || `${new Date().getTime()}`
      const Task = this.DB.TaskModel()
      return Task.findOne({where: {sourceId}})
        .then((res)=>{
          if(!res) {
            console.log(`[INFO] creating task : ${sourceId}`)
            return Task.create({...payload, sourceId, status: STATUS_CREATED})
          } else {
            console.log(`[INFO] task existed skip: ${sourceId}`)
            return 
          }
        }).then((res)=>{
          resolve(res)
        })
    })
  }
  getFirst(condition = {}){
    return this.DB.TaskModel().findOne({ where: {status: STATUS_CREATED, ...condition}})
  }
  getFirstRandom(condition = {}){
    return this.DB.TaskModel().findOne({order: this.DB.sequelize.random() , where: {status: STATUS_CREATED, ...condition}})
  }
  async markFinished (id){
    const res = await this.DB.TaskModel().update({status: STATUS_FINISHED}, {where: {id}})

    if(res[0] !== 1) return this.DB.TaskModel().update({status: STATUS_FINISHED}, {where: {sourceId: id}})
    
    return res
  }
  async markFail(id){
    const res = await this.DB.TaskModel().update({status: STATUS_FAIL}, {where: {id}})

    if(res[0] !== 1) return this.DB.TaskModel().update({status: STATUS_FAIL}, {where: {sourceId: id}})

    return res
  }
  purge(){
    return this.DB.init({isPurge: true})
  }
  init(){
    // return db.connect()
    return this.DB.init()
  }
}

module.exports = Controller

// module.exports = {
//   getFirstTask,
//   create,
//   finishedTask,
//   markFailTask,
//   init
// }