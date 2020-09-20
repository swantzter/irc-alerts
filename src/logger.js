import { createWriteStream } from 'fs'
import { join as pjoin } from 'path'

export default function LoggerMiddleware () {
  let stream, rotateStream
  return function constructor (client, rawEvents, parsedEvents) {
    rotateStream = createWriteStream(pjoin(process.cwd(), 'logs', `${process.pid}.log`), { encoding: 'utf-8', flags: 'a' })
    stream = createWriteStream(pjoin(process.cwd(), 'logs', 'irc.log'), { encoding: 'utf-8', flags: 'a' })

    console.log('logfile:', pjoin(process.cwd(), 'logs', `${process.pid}.log`))
    rawEvents.use(log)
  }

  function log (command, event, raw, client, next) {
    stream.write(`${command} ${raw}`)
    rotateStream.write(`${command} ${raw}`)

    next()
  }
}
