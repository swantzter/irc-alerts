import { readFileSync } from 'fs'
import path from 'path'
import { createPrivateKey, privateDecrypt, createHash } from 'crypto'

export default function ChallengeMiddleware () {
  let challenge, key

  return function constructor (client, rawEvents, parsedEvents) {
    rawEvents.use(ratboxRespond)

    client.on('connected', event => {
      startChallenge(client)
    })
  }

  function startChallenge (client) {
    challenge = ''

    const keyfile = readFileSync(path.join(process.cwd(), path.normalize(process.env.CHALLENGE_PATH)), { encoding: 'utf-8' })
    key = createPrivateKey({ key: keyfile, passphrase: process.env.CHALLENGE_PASS })

    client.raw(`CHALLENGE ${process.env.CHALLENGE_USERNAME}`)
  }

  function ratboxRespond (command, event, raw, client, next) {
    if (command === '740') { // RPL_RSACHALLENGE2
      challenge += event.params[1]
    } else if (command === '741') { // RPL_ENDOFRSACHALLENGE2
      // reset first to prevent garbage in the buffer on error
      const ct = Buffer.from(challenge, 'base64')
      challenge = ''

      const decryptedChallenge = privateDecrypt(key, ct)
      const hash = createHash('sha1').update(decryptedChallenge).digest('base64')

      client.raw(`CHALLENGE :+${hash}`)
    } else if (command === '491') {
      throw Error(raw)
    }

    next()
  }
}
