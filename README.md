
# Object Set JS

  

## Overview

ObjectSet is identical to JavaScript's built-in Set, but performs a deep comparison of its elements when comparing elements, instead of comparing object references (strict equality). Hence, this is the Set datastructure, but designed to handle objects. It shares the same interface as Set, so the standard Set operations, such as add, delete, has, clear, entries, forEach, etc, will all work on ObjectSet.

## Installation
Using npm:
 ```
 npm i -S object-set-js
 ```
In node.js:
```
var ObjectSet = require('object-set-js');
```
or in ES6:
```
import ObjectSet from 'object-set-js';
```

## Examples

### Basic usage
```

// Creating an empty set
const set = new ObjectSet();
console.log(set.has({a: 'a'})); // false
set.add({ a: 'a' });
console.log(set.has({a: 'a'})); // true
console.log(set.size); // 1

```

```

// Creating a non-empty set and logging the contents out
const set = new ObjectSet([{ a: 'a' }, { b: 'b' }]);
set.add({ c: 'c' });
console.log(set.has({a: 'a'})); // true
for(let obj of set){
  console.log(obj); // logs out { a: 'a'}, then {b: 'b'}, then { c: 'c'}
}

```

### Adding multiple elements
```

// Creating a non-empty set and logging the contents out
const set = new ObjectSet();
// set accepts multiple arguments and adds them all in-order
set.add({ a: 'a' }, { b: 'b' }, { c: 'c' });
console.log(set.has({a: 'a'})); // true
set.forEach(console.log); // logs out { a: 'a'}, then {b: 'b'}, then { c: 'c'}

```

### Handling duplicates

```

const set = new ObjectSet();
// add can be chained, same as Set.prototype.add()
set.add({a: 'a'}).add({b: 'b'});
console.log(set.size); // 2
set.add({a: 'a'}); // does nothing, since ObjectSet already contains {a: 'a'}
console.log(set.size); // 2
set.add({a: 'b'}); // different, so it gets added
console.log(set.size); // 3

```

### Removing elements

```
const set = new ObjectSet([{ a: 'a' }, { b: 'b' }]);
console.log(set.size); // 2
let res1 = set.remove({a: 'a'});
console.log(res1); // true
console.log(set.has({a: 'a'})); // false
let res2 = set.remove({a: 'a'}); // does nothing
console.log(res2); // false

```



### Iteration methods

```
const set = new ObjectSet([{ a: 'a' }, { b: 'b' }]);
// 4 different ways to log out the contents of an ObjectSet
set.forEach(console.log);
for(const obj of set){ console.log(obj); }
for(const obj of set.keys()){ console.log(obj); }
for(const obj of set.entries()){ console.log(obj); }
// All of these statements will log out {a: 'a'}, then { b: 'b'}
```

### Even works with objects modified after insertion!
```
const obj1 = { a: 'a' };
const obj2 = { a: 'a' };
const obj3 = { a: 'a', b: 'b' };

const set = new ObjectSet();
set.add(obj1);

console.log(set.has(obj2)); // true

obj1.b = 'b';

console.log(set.has(obj1)); // false, since obj1 has been modified
console.log(set.has(obj2)); // still true, since obj1 was inserted before it was modified
console.log(set.has(obj3)); // false

set.add(obj1);

console.log(set.has(obj1)); // true
console.log(set.has(obj2)); // true
console.log(set.has(obj3)); // true
```

## Documentation
  

As ObjectSet was designed to share the same interface as the Set datastructure, the [official mozilla Set documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) is applicable to ObjectSet. All operations defined in the Set documentation have been implemented in ObjectSet. As you can see below, the documentation for ObjectSet is almost identical to that of Set, with ObjectSet having a little extra functionality. The primary differnce is that ObjectSet uses a deep object comparison to detemine equality, instead of reference equality in the native Set implementation. The primary disadvantage of the ObjectSet implementation over the native Set implementation is that **ObjectSet is not garenteed keep track of insertion order**, which was an acceptable tradeoff.
  

### ObjectSet Properties

#### ObjectSet.prototype.constructor(iterableObject [, options])

Creates an ObjectSet containing all iterable elements in the iterableObject, the iterable object would usually take the form of an Array. This also accepts an optional options object, the options are listed below.

| Option | Description | 
| :----------: |:-------------|
| deepCopy | Defaults to true. If true, the Set will create and reference a deep copy of inserted objects instead of storing a reference to the inserted object. We reccomend leaving this option set to true, since it's much less error prone and allows objects to be modified after insertion (as in the last example). However, if the memory overhead of deep copying objects is not acceptable, you may set this to false, but you must ensure that any inserted objects are not modified after insertion. Because any inserted object that has been modified will not be found by ObjectSet.prototype.has(), due to a mismatch between object hashes and inserted objects.|


#### ObjectSet.prototype.size

Returns the number of values in the ObjectSet object.

### ObjectSet Methods

#### ObjectSet.prototype.add(value [, value [,value[,....]]])

Adds a copy of all values passed as arguments to the ObjectSet object, in-order (unless deepCopy is false, which means the object is added by reference). Returns the ObjectSet object. This can be used in the same way as Set.prototype.add() for the native Set object, the only difference being that we allow for multiple values to be inserted at once.

**Warning: If you call ObjectSet.prototype.add() with no arguments, it will add *undefined* to the ObjectSet object**. This was to mimic the behaviour of Set.prototype.add(), which when called with no arguments, will also insert *undefined* into a Set object. If you use ObjectSet.prototype.add() with exactly 1 argument like you would use Set.prototype.add(), you have nothing to worry about. Just be careful if you run an operation like ObjectSet.prototype.add(...arr). If the array is non-empty, it will work as expected, inserting all elements of the array to ObjectSet. However, if arr is an empty array, it will insert *undefined* into the set.

#### ObjectSet.prototype.clear()

Removes all elements from the ObjectSet object.

#### ObjectSet.prototype.delete(value)

Removes the element associated to the value and returns the value that ObjectSet.prototype.has(value) would have previously returned. ObjectSet.prototype.has(value) will return false afterwards.

#### ObjectSet.prototype.entries()

Returns a new Iterator object that contains an array of [value, value] for each element in the ObjectSet object, in insertion order. This is kept similar to the Map object, so that each entry has the same value for its key and value here.

#### ObjectSet.prototype.forEach(callbackFn[, thisArg])

Calls callbackFn once for each value present in the ObjectSet object ~~in insertion order~~. If a thisArg parameter is provided to forEach, it will be used as the this value for each callback.

#### ObjectSet.prototype.has(value)

Returns a boolean asserting whether an element is present with the given value in the ObjectSet object or not.

#### ObjectSet.prototype.keys()

Is the same function as the values() function and returns a new Iterator object that contains the values for each element in the ObjectSet object ~~in insertion order~~.

#### ObjectSet.prototype.values()

Returns a new Iterator object that contains the values for each element in the ObjectSet object ~~in insertion order~~.

#### ObjectSet.prototype\[@@iterator]()

Returns a new Iterator object that contains the values for each element in the ObjectSet object ~~in insertion order~~.
