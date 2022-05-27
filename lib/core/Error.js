const chalk = require('chalk')

module.exports = class ByteError extends Error {
  constructor(message, name) {
   super(message)
   if(!name) { name = 'InternalError' })
   this.name = chalk.red('[ByteError]') + chalk.yellow(' => ') + chalk.blue(name)
 }
}
