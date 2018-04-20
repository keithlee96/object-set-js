const { cloneDeep, isEqual } = require('lodash');
const objectHash = require('object-hash');
const assert = require('assert');
const isIterable = require('./helpers/isIterable');
/* eslint-disable no-restricted-syntax */
// Note: never return objects to the user, until they are removed
// Whenever an object is inserted into the set, a deep copy of it is made.
// Once hashed, the copied object is never exposed to the outside world

module.exports = class ObjectSet {
  /* Constructor accepts an array of objects to add and deepCopy is a boolean to determine
  if it's necessary to deepCopy all inserted objects */
  constructor(arg = [], { cloneDeep } = { cloneDeep: true }) {
    if (!isIterable(arg)) {
      throw new Error('ObjectSet constructor recieved a non iterable argument');
    }
    this.size = 0;
    this.innerMap = new Map();
    this.cloneDeep = cloneDeep;

    for (const obj of arg) {
      this.add(obj);
    }
  }
  /* Allows users to add objects to set */
  add(obj, ...extraObj) {
    const objClone = this.cloneDeep ? cloneDeep(obj) : obj;
    const hash = objectHash(objClone);
    const objArr = this.innerMap.get(hash);
    if (objArr === undefined) {
      this.innerMap.set(hash, [objClone]);
      this.size++;
    } else {
      assert(Array.isArray(objArr));
      let alreadyInserted = false;
      for (const insertedObj of objArr) {
        if (isEqual(objClone, insertedObj)) {
          alreadyInserted = true;
          break;
        }
      }
      if (!alreadyInserted) {
        objArr.push(objClone);
        this.size++;
      }
    }
    extraObj.forEach(o => this.add(o));
    return this;
  }

  /* Returns true if this object contains another */
  has(obj) {
    const hash = objectHash(obj);
    const objArr = this.innerMap.get(hash);
    if (objArr === undefined) {
      return false;
    }
    for (const insertedObj of objArr) {
      if (isEqual(obj, insertedObj)) {
        return true;
      }
    }
    return false;
  }

  delete(obj) {
    const hash = objectHash(obj);
    const objArr = this.innerMap.get(hash);
    if (objArr === undefined) {
      return false;
    }
    for (let i = 0; i < objArr.length; i++) {
      if (isEqual(obj, objArr[i])) {
        // remove the object
        const [objRef] = objArr.splice(i, 1);
        this.size--;
        if (objArr.length === 0) {
          // If the array is empty, remove it from the map
          this.innerMap.delete(objectHash(objRef));
        }
        return true;
      }
    }
    return false;
  }

  clear() {
    this.innerMap.clear();
    this.size = 0;
    return this;
  }

  entries() {
    return [...this]
      .map(obj => [this.cloneDeep ? cloneDeep(obj) : obj, this.cloneDeep ? cloneDeep(obj) : obj]);
  }

  forEach(callback, thisArg) {
    const cb = callback.bind(thisArg || this);
    for (const obj of this) {
      cb(this.cloneDeep ? cloneDeep(obj) : obj);
    }
  }

  keys() {
    return this.values();
  }

  values() {
    return this[Symbol.iterator]();
  }

  * [Symbol.iterator]() {
    for (const [, objArr] of this.innerMap) {
      for (const obj of objArr) {
        yield this.cloneDeep ? cloneDeep(obj) : obj;
      }
    }
  }

  toString() {
    return `ObjectSet(${[...this]})`;
  }
};
