(async ()=>{
    const TM = require('@pscraper/taskm')
    const taskm = new TM()
    await taskm.init()

    const handler = async (taskItem = {}) => {
        try {
            // process taskItem
            const {meta, title} = taskItem
            if(!meta || !title) return console.log('[INFO] no more task')

            await taskm.markFinished(taskItem.id)
            console.log('[INFO] finsihed task', taskItem.id)

            const _taskItem = await taskm.getFirstRandom()
            return handler(_taskItem)
        }
        catch (e) {
            console.log('[ERROR]',e)
            await taskm.markFail(taskItem.id)
        }
    }

    const _taskItem = await taskm.getFirstRandom()
    await handler(_taskItem)
})()