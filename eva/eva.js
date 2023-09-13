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
      const [_, ref, value] = exp;

      if(ref[0] === 'prop') { 
        const [_tag, instance, propName] = ref;
        const instanceEnv = this.eval(instance, env);

        return instanceEnv.define(
          propName,
          this.eval(value, env)
        );
      }

      return env.assign(ref, this.eval(value, env));
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

    // class declaration
    if(exp[0] === 'class') {
      const [_tag, name, parent, body] = exp;

      const parentEnv = this.eval(parent, env) || env;

      const classEnv = new Environment({}, parentEnv);

      // all methods get registered inside the env
      this._evalBody(body, classEnv);

      // class is accessible by name
      return env.define(name, classEnv);
    }

    // class instantiation
    if(exp[0] === 'new') {
      const classEnv = this.eval(exp[[1]], env);
      const instanceEnv = new Environment({}, classEnv);

      const classConstructor = classEnv.lookup('constructor');
      const args = exp.slice(2 ).map(arg => this.eval(arg, env));

      this._callUserDefinedFunction(classConstructor, [instanceEnv, ...args]);

      return instanceEnv;
    }

    // class prop lookup
    if(exp[0] === 'prop') {
      const [_tag, instance, name] = exp;

      const instanceEnv = this.eval(instance, env);

      return instanceEnv.lookup(name);
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

      return this._callUserDefinedFunction(fn, args);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }

  _callUserDefinedFunction(fn, args) {
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