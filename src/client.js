import IRC from 'irc-framework'
import { readFileSync } from 'fs'

const packageJson = JSON.parse(readFileSync('./package.json', { encoding: 'utf-8' }))

export default new IRC.Client({
  host: process.env.HOST,
  port: process.env.PORT ?? 6697,
  tls: process.env.TLS ?? true,
  username: process.env.SERVER_USERNAME,
  password: process.env.SERVER_PASSWORD,

  nick: process.env.NICK,
  gecos: packageJson.name,
  version: `${packageJson.name}@${packageJson.version} (by ${packageJson.author})`,
  encoding: 'utf8',

  auto_reconnect: true,
  auto_reconnect_wait: 4000,
  auto_reconnect_max_retries: 3,
  ping_interval: 30,
  ping_timeout: 120,
  account: {
    account: process.env.SASL_USERNAME ?? process.env.SERVER_USERNAME,
    password: process.env.SASL_PASSWORD ?? process.env.SERVER_PASSWORD
  }
})
