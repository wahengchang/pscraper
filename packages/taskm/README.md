# Demo for @pscraper/taskm, Task Manager
This lib is for a managing a large number of tasks, by adding each task into queue, and digesting each of them one by one. These are the the resaon why using `taskm`:
 - you got a large number of task to handle, and needed to know how many is `pending`, `finished` and `fail`
 - you got a large number of task to handle, and those task could be digested by more than one computer 



**(`sqlite` is used to manage queue)**


## Install
```
$ yarn add @pscraper/taskm

or 


$ npm install @pscraper/taskm
```

## Usage



| Function   |      Description      |
|----------|:-------------:|-
| init()| init DB connection|
| purge()| remove all existed ada |
| add(uniqueId = '', body = {}) |  adding a new task to queue |
| getFirst(condition={}) |    getting one task from queue, default FIFO   |
| getFirstRandom(condition={})| getting one task from queue randomly |
| markFinished(id)| mark task as finished, would appear in getFirst()|
| markFail(id)| mark task as fail, would appear in getFirst()|
    

## Example-1 (FIFO)
adding new task to queue (FIFO)
```js

const TM = require('taskm')
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
const TM = require('taskm')
const taskm = new TM()
await taskm.init()

const item = await taskm.getFirst()
// do something
await taskm.finished(item.id)
```

## Example-2 (Task Distribution)

adding new task to queue (FIFO)
```js

const TM = require('taskm')
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
const TM = require('taskm')
const taskm = new TM()
await taskm.init()

const item = await taskm.getFirstRandom()
// do something
await taskm.finished(item.id)
```


## Reference:
 - https://www.freertos.org/Embedded-RTOS-Queues.html