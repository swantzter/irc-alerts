export default function ChallengeMiddleware () {
  return function constructor (client, rawEvents, parsedEvents) {
    rawEvents.use(ratboxRespond)
    parsedEvents.use(startChallenge)

    client.on('connected', event => {
      const raw = client.rawString('CHALLENGE', process.env.CHALLENGE_USERNAME)
      client.raw(raw)
    })
  }

  function startChallenge (command, event, client, next) {
    next()
  }

  function ratboxRespond (command, event, raw, client, next) {
    // console.log(command, event.params)
    if (command === '740') { // RPL_RSACHALLENGE2
      console.log(event.params)
      // this.challenge += event.params[1]
    } else if (command === '741') { // RPL_ENDOFRSACHALLENGE2

    } else if (command === '491') {
      throw Error('Cannot Op')
    }

    next()
  }
}
