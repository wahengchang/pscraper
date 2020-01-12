const DBClass = require('../db')

describe('[db.js]   db init success', ()=>{
    const db = new DBClass()
    beforeAll(async ()=>{
        await db.init({isPurge: true})
    })

    it('[db.js] should create and found data', async ()=>{
        const Task = db.TaskModel()
        const sourceId = `${new Date().getTime()}`
        const status = 'STATUS_CREATED'
    
        const payload = {sourceId, status}
        await Task.create(payload)
    
        const res = await Task.findOne({where: {sourceId}})
        expect(res.sourceId).toEqual(sourceId);
    })
})

describe('[db.js]   db accept config', ()=>{
    const defaultConfig = {
        dialect: 'sqlite',
        storage: `./${new Date().getTime()}.sql`,
        logging: false
    }
    const db = new DBClass(defaultConfig)
    beforeAll(async ()=>{
        await db.init()
    })
    afterAll(async ()=>{
        require('fs').unlinkSync(defaultConfig.storage)
    })

    it('[db.js] should create *.sql', async ()=>{
        const isExisted = require('fs').existsSync(defaultConfig.storage)
        expect(isExisted).toEqual(true)
    })
})