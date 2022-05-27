require('../core/Prototype.js')
const DEF_TABLE = require('../constant.js')
const DB = require('../core/Implement.js')
const sanitize = require('../sanitize.js')

module.exports = class RowManager {
  constructor(db) {
    if(!(db instanceof DB)) {
      throw new TypeError('Invalid Parameter Type "' + (db.name || typeof db) + '"')
    }
    this.database = db 
  }
  
}
