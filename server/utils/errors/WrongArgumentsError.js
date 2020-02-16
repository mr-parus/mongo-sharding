/**
 * @param {string} [argName] - The argument name
 * @param {*}      [value] - The argument value
 * @constructor
 * */
class WrongArgumentError extends Error {
  constructor(argName, value) {
    super();
    Error.captureStackTrace(this, WrongArgumentError);
    this.argName = argName;
    this.argValue = value;
    this.message = `An invalid argument \`${argName}\` with a value \`${value}\``;
  }
}

export default WrongArgumentError;
