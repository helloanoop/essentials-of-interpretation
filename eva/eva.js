const Environment = require("./environment");

/**
 * Eva Interpreter
 */
class Eva {
  /**
   * Creates an Eva instance with a global environment
   */
  constructor(global = GlobalEnvironment) {
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
    if(this._isNumber(exp)) {
      return exp;
    }

    if(this._isString(exp)) {
      return exp.slice(1, -1);
    }

    // block
    if(exp[0] === 'begin') {
      const blockEnv = new Environment({}, env);
      return this._evalBlock(exp, blockEnv);
    }

    // if cond
    if(exp[0] === 'if') {
      const [_tag, condition, consequent, alternate] = exp;
      if(this.eval(condition, env)) {
        return this.eval(consequent, env)
      } else {
        return this.eval(alternate, env)
      }
    }

    // while loop
    if(exp[0] === 'while') {
      const [_tag, condition, body] = exp;
      let result;

      while(this.eval(condition, env)) {
        result = this.eval(body, env);
      }

      return result;
    }

    // variable declaration
    if(exp[0] === 'var') {
      const [_, name, value] = exp;

      return env.define(name, this.eval(value, env));
    }

    // variable assignment
    if(exp[0] === 'set') {
      const [_, name, value] = exp;

      return env.assign(name, this.eval(value, env));
    }

    // lambda expression
    if(exp[0] === 'lambda')  {
      const [_, params, body] = exp;

      const fn = {
        params,
        body,
        env // closure
      };

      return fn;
    }

    // function declaration
    if(exp[0] === 'def') {
      const [_, name, params, body] = exp;

      const fn = {
        params,
        body,
        env // closure
      };

      return env.define(name, fn);
    }

    // variable access/lookup
    if(this._isVariableName(exp)) {
      return env.lookup(exp);
    }

    // function calls
    if(Array.isArray(exp)) {
      const fn = this.eval(exp[0], env);
      const args = exp.slice(1).map(arg => this.eval(arg, env));

      // native function
      if(typeof fn === 'function') {
        return fn(...args);
      }

      const activationRecord = {};
      fn.params.forEach((param, index) => {
        activationRecord[param] = args[index];
      });

      const activationEnv = new Environment(
        activationRecord,
        fn.env
      );

      return this._evalBody(fn.body, activationEnv);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }

  _evalBody(body, env) {
    if(body[0] === 'begin') {
      return this._evalBlock(body, env);
    }

    return this.eval(body, env);
  }

  _evalBlock(block, env) {
    let result;

    const [_tag, ...expressions] = block;
    expressions.forEach(exp => {
      result = this.eval(exp, env);
    });

    return result;
  }
  
  _isVariableName(exp) {
    return typeof exp === 'string' && /^[+\-*/<>=a-zA-Z0-9_]+$/.test(exp);
  }

  _isNumber(exp) {
    return typeof exp === 'number';
  }

  _isString(exp) {
    return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
  }
}

const GlobalEnvironment = new Environment({
  null: null,
  true: true,
  false: false,

  VERSION: '0.1',

  // Operators
  '+'(op1, op2) {
    return op1 + op2;
  },

  '*'(op1, op2) {
    return op1 * op2;
  },

  '-'(op1, op2 = null) {
    if (op2 == null) {
      return -op1;
    }
    return op1 - op2;
  },

  '/'(op1, op2) {
    return op1 / op2;
  },

  // Comparison:
  '>'(op1, op2) {
    return op1 > op2;
  },

  '<'(op1, op2) {
    return op1 < op2;
  },

  '>='(op1, op2) {
    return op1 >= op2;
  },

  '<='(op1, op2) {
    return op1 <= op2;
  },

  '='(op1, op2) {
    return op1 === op2;
  },

  // Console output:
  print(...args) {
    console.log(...args);
  }
});

module.exports = Eva;