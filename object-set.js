

export default class ObjectSet {
  constructor(arg) {
    this.length = 0;
    // Check if arg is an array, an iterator or nothing
    if (Array.isArray(arg)) {
      this.innerMap = new Map();
    }
  }

  [Symbol.iterator]() {

  }
}
