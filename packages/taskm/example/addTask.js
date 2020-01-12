(async ()=>{
    const TM = require('../index.js')
    const taskm = new TM()
    await taskm.init()

    const aLotOfTask = [
        {uniqueId: (new Date()).getTime()},
        {uniqueId: (new Date()).getTime()},
        {uniqueId: (new Date()).getTime()},
        {uniqueId: (new Date()).getTime()},
    ]

    for(let i=0 ;i< aLotOfTask.length; i++) {
        const {uniqueId} = aLotOfTask[i]
        const options = {
            title: `${uniqueId}-title`,   //optional
            meta: JSON.stringify({  //optional
                secret: `i am secret ${uniqueId}`
            })
        }
        await taskm.add(uniqueId, options)
    }
})()