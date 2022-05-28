require('../core/Prototype.js')
const DEF_TABLE = require('../constant.js')
const DB = require('../core/Implement.js')
const sanitize = require('../sanitize.js')

module.exports = class RowManager {
  _database = DB
  constructor(db) {
    if(!(db instanceof DB)) {
      throw new TypeError('Invalid Parameter Type "' + (db.name || typeof db) + '"')
    }
    this._database = db 
  }
  
  insertRowByKey(key, value, table) {
    'string'.type(key)
    'string'.type(table)
    const val = value !== 'string' ? JSON.stringify(value) : value;
    return this._database._raw.prepare('INSERT INTO ' + table + ' (ID,Json) VALUES (?,?)').run(key, value)
  }
  
  updateRowByKey(key, value, table) {
    'string'.type(key)
    'string'.type(table)
    const val = value !== 'string' ? JSON.stringify(value) : value;
    return this._database._raw.prepare('UPDATE ' + table + ' SET Json = (?) WHERE ID = (?)').run(key, value)
  }
  
  findRowByKey(key, table) {
    'string'.type(key)
    'string'.type(table)
    const val = this._database._raw.prepare('SELECT Json FROM ' + table + ' WHERE ID = (?)').run(key);
    return val !== null ? JSON.parse(val.Json) : null;
  }
  
  getAllRows(table) {
    'string'.type(table)
    const val = this._datavase._raw.prepare('SELECT * FROM ' + table).iterate()
    const data = []
    for(const i of val) {
      data.push({
        ID: i.ID, JSON: i.Json, TABLE: table
      })
    }
    return data
  }
  destroy(table, key) {
    'string'.type(table)
    key = 'string'.type(key, Symbol('noValueTag'))
    return this._datatabase._raw.prepare('DELETE FROM ' + table + (key === Symbol('noValueTag') ? '' : 'WHERE ID = @key')).run({ key }).changes
  }
}
