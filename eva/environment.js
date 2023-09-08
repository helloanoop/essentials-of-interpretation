class Environment {
  /**
   * Creates an environment with the given record
   * 
   * @param {object} record 
   * @param {object} parent 
   */
  constructor(record = {}, parent) {
    this.record = record;
    this.parent = parent;
  }

  /**
   * Creates a variable with a given name and value
   * 
   * @param {string} name 
   * @param {*} value 
   * @returns 
   */
  define(name, value) {
    this.record[name] = value;

    return value;
  }

  /**
   * Returns the value of the variable if defined 
   * Or throw an error if not defined
   * 
   * @param {string} name 
   * @returns 
   */
  lookup(name) {
    return this.resolve(name).record[name];
  }

  resolve(name) {
    if(this.record.hasOwnProperty(name)) {
      return this;
    }

    if(this.parent) {
      return this.parent.resolve(name);
    }

    throw new ReferenceError(`Variable "${name}" is undefined`);
  }

  assign(name, value) {
    this.resolve(name).record[name] = value;

    return value;
  }
}

module.exports = Environment;