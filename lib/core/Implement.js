// (core)
require('./Prototype.js')
const ByteError = require('./Error.js')
const DB = require('better-sqlite3')
const { set, get } = require('lodash')
const chalk = require('chalk')
const rowSymbol = Symbol('row')

// (structures)
const Row = require('../structures/RowManager.js')
const DEF_TABLE = require('../constant.js')

// (constructor)

module.exports = class ByteDatabase extends (require('node:events')) {  
  /**
   * 
   * @property raw
   * access property "raw" which contains our base database, better-sqlite3.
   * as of Wednesday, 11th may 2022, this property is now accessible by the public.
   * @examples
   * ByteDatabase.raw.prepare("SQL STRING").run()
   * 
   */
  raw = DB.Database
  /**
   * @private
   * @property rows
   * row handler for the database
   */
   [rowSymbol] = new Row()
   
   constructor(path, props) {
     super()
     'string'.type(path, ':memory:')
     'object'.instance(props, {})
     this.raw = new DB(path, props)
   }
   
   find(key, table) {
     'string'.type(key)
     'string'.type(table, DEF_TABLE)
     if(typeof key !== "string") throw new ByteError('INVALID_TYPE', `Expected a type of string in method "INSERT". Recieved a type of ${typeof key} instead. \n If you need help, consider joining our Discord Server!: https://join.cloudteam.me`);
       if(!key.includes('.')) {
          let result = this.rows.findRowByKey(key, table);
          let _ = get(result, key);
          return _
        } else {
          let splitted = key.split('.');
          let ParentKey = splitted[0];

          const result = this.rows.findRowByKey(ParentKey, table);
          let _ = get(result, splitted.slice(1).join('.'));
          return _
        }
     }
   }
