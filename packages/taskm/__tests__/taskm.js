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
