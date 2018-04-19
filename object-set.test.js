/* Object-set package
This uses a map datastructure under the hood.

The interface for ObjectSet should be identical to
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set

Note: this set does not keep track of insertion order
*/

import ObjectSet from './object-set';


describe('constructor', () => {
  // Set can be passed undefined as a constructor arguement
  it('empty constructor arg', () => {
    const set = new ObjectSet();
    expect(set.size).toBe(0);
  });
  // Set can be passed an iterator as a constructor argument
  it('iterator constructor arg', () => {
    const set = new ObjectSet([{ a: 'a' }, { b: 'b' }, { c: 'c' }][Symbol.iterator]());
    expect(set.size).toBe(3);
  });
  // Set can be passed an array as constructor argument
  it('Array constructor arg', () => {
    const set = new ObjectSet([{ a: 'a' }, { b: 'b' }, { c: 'c' }]);
    expect(set.size).toBe(3);
  });
  // Set can be passed a set as a constructor argument

  // Check invalid constructor arguments give useful info
  it('Non iterable constructor arg', () => {
    expect(() => new ObjectSet({})).toThrow('ObjectSet constructor recieved a non iterable argument');
  });
});

describe('size', () => {
  it('Set size after construction is accurate', () => {
    const set = new ObjectSet([{ a: 'a' }, { b: 'b' }, { c: 'c' }]);
    expect(set.size).toBe(3);
  });
  it('Set size is updated correctly when items added', () => {
    const set = new ObjectSet([{ a: 'a' }, { b: 'b' }, { c: 'c' }]);
    expect(set.add({ d: 'd' }).size).toBe(4);
  });

  it('Set size is updated correctly when items deleted', () => {
    const set = new ObjectSet([{ a: 'a' }, { b: 'b' }, { c: 'c' }]);
    set.delete({ a: 'a' });
    expect(set.size).toBe(2);
  });
});

describe('has', () => {
  it('empty set does not identify any elements as being contained', () => {
    const set = new ObjectSet();
    expect(set.has({ a: 'a' })).toBeFalsy();
    expect(set.has({ b: 'b' })).toBeFalsy();
    expect(set.has({ a: 'b' })).toBeFalsy();
    expect(set.has({ c: 'c' })).toBeFalsy();
  });
  it('has identifies elements added in constructor', () => {
    const set = new ObjectSet([{ a: 'a' }, { b: 'b' }, { c: 'c' }]);
    expect(set.has({ a: 'a' })).toBeTruthy();
    expect(set.has({ b: 'b' })).toBeTruthy();
    expect(set.has({ a: 'b' })).toBeFalsy();
    expect(set.has({ d: 'd' })).toBeFalsy();
  });
  it('has identifies elements added in constructor (iterator)', () => {
    const set = new ObjectSet([{ a: 'a' }, { b: 'b' }, { c: 'c' }][Symbol.iterator]());
    expect(set.has({ a: 'a' })).toBeTruthy();
    expect(set.has({ b: 'b' })).toBeTruthy();
    expect(set.has({ a: 'b' })).toBeFalsy();
    expect(set.has({ d: 'd' })).toBeFalsy();
  });
});


describe('add', () => {
  // Set returns a list of contained objects
  it('Basic test', () => {
    const set = new ObjectSet();
    expect(set.size).toBe(0);
    set.add({ a: 'a' });
    expect(set.size).toBe(1);
  });
  it('Works with other types too', () => {
    const set = new ObjectSet();
    expect(set.size).toBe(0);
    set.add('apple');
    expect(set.size).toBe(1);
    set.add('apple');
    expect(set.size).toBe(1);
  });
  it('Does not add duplicates', () => {
    const set = new ObjectSet([{ a: 'a' }, { b: 'b' }]);
    expect(set.size).toBe(2);
    set.add({ a: 'a' });
    expect(set.size).toBe(2);
  });

  it('Does adds after deletes', () => {
    const set = new ObjectSet([{ a: 'a' }, { b: 'b' }]);
    expect(set.size).toBe(2);
    set.add({ c: 'c' });
    expect(set.size).toBe(3);
    set.delete({ b: 'b' });
    expect(set.size).toBe(2);
    set.add({ b: 'b' });
    expect(set.size).toBe(3);
    set.add({ b: 'b' });
    expect(set.size).toBe(3);
  });
});

describe('clear', () => {
  it('clears set sucessfully', () => {
    const set = new ObjectSet([{ a: 'a' }, { b: 'b' }]);
    expect(set.size).toBe(2);
    set.clear();
    expect(set.size).toBe(0);
  });
  it('clear is chainable (returns itself)', () => {
    const set = new ObjectSet([{ a: 'a' }, { b: 'b' }]);
    set.clear().add({ c: 'c' });
    expect(set.size).toBe(1);
  });
});

describe('delete', () => {
  it('failure case', () => {
    const set = new ObjectSet([{ a: 'a' }, { b: 'b' }]);
    expect(set.delete({ c: 'c' })).toBeFalsy();
    expect(set.size).toBe(2);
  });
  it('sucessful delete', () => {
    const set = new ObjectSet([{ a: 'a' }, { b: 'b' }]);
    expect(set.has({ b: 'b' })).toBeTruthy();
    expect(set.delete({ b: 'b' })).toBeTruthy();
    expect(set.has({ b: 'b' })).toBeFalsy();
    expect(set.size).toBe(1);
  });
  it('delete cannot be successful twice on the same object', () => {
    const set = new ObjectSet([{ a: 'a' }, { b: 'b' }]);
    expect(set.has({ b: 'b' })).toBeTruthy();
    expect(set.delete({ b: 'b' })).toBeTruthy();
    expect(set.delete({ b: 'b' })).toBeFalsy();
  });
});

describe('entries', () => {
  it('returns the correct entries object', () => {
    const set = new ObjectSet([{ a: 'a' }, { b: 'b' }, { c: 'c' }]);
    expect([...set.entries()]).toEqual([
      [{ a: 'a' }, { a: 'a' }],
      [{ b: 'b' }, { b: 'b' }],
      [{ c: 'c' }, { c: 'c' }],
    ]);
  });
  it('works on empty objects', () => {
    const set = new ObjectSet();
    expect([...set.entries()]).toEqual([]);
  });
});

// TODO
describe('forEach(callbackFn[, thisArg]', () => {
  it('returns the correct entries object', () => {
    const outArr = [];
    const pushToArr = ({ a }) => {
      outArr.push(a);
    };
    const set = new ObjectSet([{ a: 'a' }, { a: 'b' }, { a: 'c' }]);
    set.forEach(pushToArr);
    expect(outArr).toEqual(['a', 'b', 'c']);
  });

  it('returns the correct entries object', () => {
    const testObj = { outArr: [] };
    const pushToArr = function pushToArr({ a }) {
      this.outArr.push(a);
    };
    const set = new ObjectSet([{ a: 'a' }, { a: 'b' }, { a: 'c' }]);
    set.forEach(pushToArr, testObj);
    expect(testObj.outArr).toEqual(['a', 'b', 'c']);
  });
});


describe('keys', () => {
  it('returns the correct entries object', () => {
    const set = new ObjectSet([{ a: 'a' }, { b: 'b' }, { c: 'c' }]);
    expect([...set.keys()]).toEqual([{ a: 'a' }, { b: 'b' }, { c: 'c' }]);
  });
  it('returns the correct entries object', () => {
    const set = new ObjectSet();
    expect([...set.keys()]).toEqual([]);
  });
});

describe('values', () => {
  it('returns the correct entries object', () => {
    const set = new ObjectSet([{ a: 'a' }, { b: 'b' }, { c: 'c' }]);
    expect([...set.values()]).toEqual([{ a: 'a' }, { b: 'b' }, { c: 'c' }]);
  });
  it('returns the correct entries object', () => {
    const set = new ObjectSet();
    expect([...set.values()]).toEqual([]);
  });
});

describe('[Symbol.iterator]', () => {
  // Returns an array of Symbol iterator objects
  it('returns the correct entries object', () => {
    const set = new ObjectSet([{ a: 'a' }, { b: 'b' }, { c: 'c' }]);
    expect([...set]).toEqual([{ a: 'a' }, { b: 'b' }, { c: 'c' }]);
  });
  it('returns the correct entries object', () => {
    const set = new ObjectSet();
    expect([...set]).toEqual([]);
  });
});
