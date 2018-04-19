/* Function returns true iff object is iterable */
export default object =>
  object != null && typeof object[Symbol.iterator] === 'function';
