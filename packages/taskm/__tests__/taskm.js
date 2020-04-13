const TM = require('../index.js')
const taskm = new TM()

beforeAll(async () => {
    await taskm.init()
});
beforeEach(async () => {
    await taskm.purge()
});

test('should return getFirst() after add()', async()=>{
    const id = `mockId${new Date().getTime()}`
    const title = `${id}-title`

    await taskm.add(id, {title})
    const firstData = await taskm.getFirst()

    expect(firstData.sourceId).toEqual(id);
    expect(firstData.title).toEqual(title);
})

test('should return null after markFinished(data.id)', async()=>{
    const id = `mockId${new Date().getTime()}`
    const title = `${id}-title`

    await taskm.add(id, {title})
    const firstData = await taskm.getFirst()

    expect(firstData.sourceId).toEqual(id);
    expect(firstData.title).toEqual(title);

    await taskm.markFinished(firstData.id)
    const res1 = await taskm.getFirst()
    expect(res1).toBeNull();
})

test('should return null after markFinished(sourceId)', async()=>{
    const sourceId = `mockId${new Date().getTime()}`
    const title = `${sourceId}-title`

    await taskm.add(sourceId, {title})
    const firstData = await taskm.getFirst()

    expect(firstData.sourceId).toEqual(sourceId);
    expect(firstData.title).toEqual(title);

    await taskm.markFinished(sourceId)
    const res1 = await taskm.getFirst()
    expect(res1).toBeNull();
})

test('should getFirst() return same data when task is not finished', async()=>{
    const inputList = []
    for(let i =0 ; i<99; i++) {
        const id = `mockId${new Date().getTime()}-${i}`
        const title = `${id}-title-${i}`
        inputList.push({id, title})
        await taskm.add(id, {title})
    }

    const data1st = await taskm.getFirst()
    expect(data1st.sourceId).toEqual(inputList[0].id);
    expect(data1st.title).toEqual(inputList[0].title);

    const data2nd = await taskm.getFirst()
    expect(data2nd.sourceId).toEqual(inputList[0].id);
    expect(data2nd.title).toEqual(inputList[0].title);
})

test('should getFirstRandom() return differnt data', async()=>{    const inputList = []
    for(let i =0 ; i<99; i++) {
        const id = `mockId${new Date().getTime()}-${i}`
        const title = `${id}-title-${i}`
        inputList.push({id, title})
        await taskm.add(id, {title})
    }

    const data1st = await taskm.getFirstRandom()
    expect(data1st.sourceId).not.toEqual(inputList[0].id);
    expect(data1st.title).not.toEqual(inputList[0].title);

    const data2nd = await taskm.getFirstRandom()
    expect(data2nd.sourceId).not.toEqual(inputList[0].id);
    expect(data2nd.title).not.toEqual(inputList[0].title);
})

test('should return null after markFail(sourceId)', async()=>{
    const sourceId = `mockId${new Date().getTime()}`
    const title = `${sourceId}-title`

    await taskm.add(sourceId, {title})
    const firstData = await taskm.getFirst()

    expect(firstData.sourceId).toEqual(sourceId);
    expect(firstData.title).toEqual(title);

    await taskm.markFail(sourceId)
    const res1 = await taskm.getFirst()
    expect(res1).toBeNull();
})

test('should return correct Obj by given correct Id, getTaskById(id)', async()=>{
    const sourceId = `mockId${new Date().getTime()}`
    const title = `${sourceId}-title`

    await taskm.add(sourceId, {title})
    const firstData = await taskm.getFirst()

    expect(firstData.sourceId).toEqual(sourceId);
    expect(firstData.title).toEqual(title);

    const getTaskById = await taskm.getTaskById(firstData.id)
    expect(getTaskById.sourceId).toEqual(sourceId);
    expect(getTaskById.title).toEqual(title);
})

test('should return both ok and fail task, listAllTasks(id)', async()=>{
    const failSourceId = `mockId1${new Date().getTime()}`
    const titleFail = `${failSourceId}-title`
    const okSourceId = `mockId2${new Date().getTime()}`
    const titleOk = `${okSourceId}-title`

    // create two task
    await taskm.add(failSourceId, {title: titleFail})
    await taskm.add(okSourceId, {title: titleOk})

    // mark one to fail
    await taskm.getFirst()
    await taskm.markFail(failSourceId)

    const listallTasks = await taskm.listAllTasks()

    // expect to see both fail and ok objects
    expect(listallTasks.length).toBeGreaterThan(1)
    expect(listallTasks.find(item => item.sourceId === failSourceId)).not.toBeNull()
    expect(listallTasks.find(item => item.sourceId === failSourceId).title).toEqual(titleFail)
    expect(listallTasks.find(item => item.sourceId === okSourceId)).not.toBeNull()
    expect(listallTasks.find(item => item.sourceId === okSourceId).title).toEqual(titleOk)
})
