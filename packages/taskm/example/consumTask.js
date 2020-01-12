(async ()=>{
    const TM = require('../index.js')
    const taskm = new TM()
    await taskm.init()

    const item = await taskm.getFirst()

    if(!item) return //queue is empty

    try {
        console.log(item)
        // do something with the data
        await taskm.finished(item.id)
    }
    catch (e) {
        await taskm.markFail(item.id)
    }
})()