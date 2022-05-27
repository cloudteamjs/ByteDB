// (core)
require('./Prototype.js')
const ByteError = require('./Error.js')
const DB = require('better-sqlite3')
const { set, get } = require('lodash')
const chalk = require('chalk')
const rows = Symbol('row')

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
   [rows] = new Row()
   
   constructor(path, props) {
     super()
     path = 'string'.type(path, ':memory:')
     props = 'object'.instance(props, {})
     this.raw = new DB(path, props)
   }
   
   find(key, table) {
     key = 'string'.type(key)
     table = 'string'.type(table, DEF_TABLE)
     if(typeof key !== "string") throw new ByteError('INVALID_TYPE', `Expected a type of string in method "FIND". Recieved a type of ${typeof key} instead. \n If you need help, consider joining our Discord Server!: https://join.cloudteam.me`);
       if(!key.includes('.')) {
          let result = this.rows.findRowByKey(key, table);
          let _ = get(result, key);
          return _
        } else {
          let splitted = key.split('.');
          let ParentKey = splitted.shift();

          const result = this.rows.findRowByKey(ParentKey, table);
          let _ = get(result, splitted.join('.'));
          return _
        }
      }
   }
   
   insert(key, val, table) {
     key = 'string'.type(key)
     val = 'string'.type(val)
     table = 'string'.type(table, DEF_TABLE)
     if(typeof key !== "string") throw new ByteError('INVALID_TYPE', `Expected a type of string in method "INSERT". Recieved a type of ${typeof key} instead. \n If you need help, consider joining our Discord Server!: https://join.cloudteam.me`);
       if(!key.includes('.')) {
          let got = this.find(key);
          let _ = set(got || {}, key, val);
          return this[rows].insertRowByKey(key, _, table);
        } else {
          let splitted = key.split('.');
          let ParentKey = splitted.shift();
          let got = this.find(key, table)
          let _ = get(got || {}, splitted.join('.'), val);
          return this[rows].insertRowByKey(ParentKey, _, table);
        }
     }
   }
   
   wipe(table) {
     table = 'string'.type(table, DEF_TABLE)
     this[rows].deleteAllRows(table)
   }
   
   connect() {
     this.emit('info', chalk.green.bold('[ByteDatabase (Connection)]:') + ' Initializing default table...')
     try {
       const d = this.raw.prepare('CREATE TABLE IF NOT EXISTS ' + DEF_TABLE + ' (ID, Text, Json Text)').run()
       this.emit('info', chalk.green.bold('[ByteDatabase (Connection)]:' + ' Successfully initializing default table.')
       this.emit('success', d.changes)
     } catch(err) {
       this.emit('info', chalk.red.bold('[ByteDatabase (Connection)]:') + ' Failed to initializing table.')
       this.emit('error', err)
     } finally {
       this.emit('info', chalk.yellow.bold('[ByteDatabase (Connection)]:') + ' Completed Initializing default table.')
       this.emit('complete')
     }
   }
}
