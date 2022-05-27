global.String.prototype.type = function(prop, def) {
 if(typeof prop !== this.toLowerCase()) {
  throw new TypeError('Invalid Type "' + typeof prop + '"'))
 }
 if(def) prop = prop || def;
 return null
}

global.String.prototype.instance = function(prop, def) {
 if(eval('prop instanceof ' + this) !== true) {
  throw new TypeError('Invalid Type "' + typeof prop + '"'))
 }
 if(def) prop = prop || def;
 return null
}
