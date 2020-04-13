# Demo for @pscraper/taskm, Task Manager
This lib is for a managing a large number of tasks, by adding each task into queue, and digesting each of them one by one. These are the the resaon why using `taskm`:
 - you got a large number of task to handle, an execption may cause the script to restart from the first
 - you got a large number of task to handle, and needed to know how many is `pending`, `finished` and `fail`
 - you got a large number of task to handle, and those task could be digested by more than one computer 



**(`sqlite` is used to manage queue)**


## Install
```
$ yarn add @pscraper/taskm

or 


$ npm install @pscraper/taskm
```

## Example-1 (FIFO)
More Example: [https://github.com/wahengchang/pscraper/tree/master/packages/demo/taskm](https://github.com/wahengchang/pscraper/tree/master/packages/demo/taskm)

adding new task to queue (FIFO)
![@pscraper_taskm-fifo](https://user-images.githubusercontent.com/5538753/72214782-e6d4ad00-3543-11ea-8e8e-1082e0343ca4.jpg)


```js

const TM = require('@pscraper/taskm')
const taskm = new TM()
await taskm.init()

const uniqueId = "amazingId"
const options = {
    title: 'amazingTitle',
    meta: JSON.stringify({key: "key1"})
}
await taskm.add(uniqueId, options)
```

consumming task from queue
```js
const TM = require('@pscraper/taskm')
const taskm = new TM()
await taskm.init()

const item = await taskm.getFirst()
// do something
await taskm.markFinished(item.id)
```

## Example-2 (Task Distribution)
![@pscraper_taskm-multiple](https://user-images.githubusercontent.com/5538753/72214774-b725a500-3543-11ea-8f28-8386ea09181d.jpg)

adding new task to queue
```js

const TM = require('@pscraper/taskm')
const taskm = new TM()
await taskm.init()

for(let i =0 ; i<999999; i++) {
    const id = `mockId${new Date().getTime()}-${i}`
    const title = `${id}-title-${i}`
    inputList.push({id, title})
    await taskm.add(id, {title})
}

```

consumming task from queue, usually is run on more than one PC parallelly
```js
const TM = require('@pscraper/taskm')
const taskm = new TM()
await taskm.init()

const item = await taskm.getFirstRandom()
// do something
await taskm.markFinished(item.id)
```


## Usage

| Function   |      Description      |
|----------|:-------------:|
| `init()`| init DB connection|
| `purge()`| remove all existed ada |
| `add(uniqueId = ''`, body = {}) |  adding a new task to queue |
| `getFirst(condition={})` |    getting one task from queue, default FIFO   |
| `getFirstRandom(condition={})`| getting one task from queue randomly |
| `getTaskById(id)`| getting one task by given id |
| `listAllTasks(condition={})`| return all created and fail tasks |
| `markFinished(id)`| mark task as finished, would appear in getFirst()|
| `markFail(id)`| mark task as fail, would appear in getFirst()|
    

## Reference:
 - https://www.freertos.org/Embedded-RTOS-Queues.html