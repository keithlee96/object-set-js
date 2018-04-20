/* Function returns true iff object is iterable */
module.exports = object =>
  object != null && typeof object[Symbol.iterator] === 'function';
