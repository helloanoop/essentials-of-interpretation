const Environment = require("./environment");

/**
 * Eva Interpreter
 */
class Eva {
  /**
   * Creates an Eva instance with a global environment
   */
  constructor(global = new Environment()) {
    this.global = global;
  }

  /**
   * Evaluates an expression in the given environment
   * 
   * @param {string} exp 
   * @returns 
   */
  eval(exp, env = this.global) {
    // Self evaluation expressions
    if(isNumber(exp)) {
      return exp;
    }

    if(isString(exp)) {
      return exp.slice(1, -1);
    }

    // Math operations
    if(exp[0] === '+') {
      return this.eval(exp[1], env) + this.eval(exp[2], env);
    }

    if(exp[0] === '*') {
      return this.eval(exp[1], env) * this.eval(exp[2], env);
    }

    // block
    if(exp[0] === 'begin') {
      const blockEnv = new Environment({}, env);
      return this._evalBlock(exp, blockEnv);
    }

    // variable declaration
    if(exp[0] === 'var') {
      const [_, name, value] = exp;

      return env.define(name, this.eval(value, env));
    }

    // variable assignment
    if(exp[0] === 'set') {
      const [_, name, value] = exp;

      return env.assign(name, value);
    }

    // variable access/lookup
    if(isVariableName(exp)) {
      return env.lookup(exp);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }

  _evalBlock(block, env) {
    let result;

    const [_tag, ...expressions] = block;
    expressions.forEach(exp => {
      result = this.eval(exp, env);
    });

    return result;
  }
}

function isVariableName(exp) {
  return typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
}

function isNumber(exp) {
  return typeof exp === 'number';
}

function isString(exp) {
  return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}


module.exports = Eva;