import 'dotenv/config.js'
import client from './client.js'
import ChallengeMiddleware from './challenge.js'
import LoggerMiddleware from './logger.js'

client.use(ChallengeMiddleware())
client.use(LoggerMiddleware())

client.connect()

client.on('connected', event => {
  console.log(event)
  console.log(client.user)
})

client.on('close', function() {
  console.log('Connection close');
});
