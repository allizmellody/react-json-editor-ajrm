/**
 * @author Andrew Redican <andrew.redican.mejia@gmail.com>
 */

/**
 * Performs deep search on object tree, removes all properties with matching key, returns a new identity without the specified property
 * @param {Any} identity
 * @param {string} keyName
 * @param {Optional Number} maxDepth
 * @return {Any} identity
 */
export function deepRemoveAll_Key(
  identity: any,
  keyName: string,
  maxDepth?: number,
) {
  if (getType(keyName) !== "string") return undefined;
  if (keyName === "") return undefined;
  let clonedIdentity = deepClone(identity);
  var paths: any = locateAll_Key(clonedIdentity, keyName, maxDepth);
  if (!paths.lenght || paths === false) return clonedIdentity;
  paths.forEach((path: any) => {
    if (path === "") path = keyName;
    else path += "." + keyName;
    path = path.split(".");
    var ref = clonedIdentity;
    if (!Array.isArray(path)) delete ref[path];
    for (var i = 0; i < path.length; i++) {
      var key = path[i];
      if (key in ref) {
        if (i < path.length - 1) ref = ref[key];
        else delete ref[key];
      } else break;
    }
  });
  return clonedIdentity;
}

/**
 * Performs deep search on object tree, removes the first property with matching key, returns a new identity without the specified property
 * @param {Any} identity
 * @param {string} keyName
 * @param {Optional Number} maxDepth
 * @return {Any} identity
 */
export function deepRemove_Key(identity: any, keyName: any, maxDepth: any) {
  if (getType(keyName) !== "string") return undefined;
  if (keyName === "") return undefined;
  let clonedIdentity = deepClone(identity);
  var path = locate_Key(clonedIdentity, keyName, maxDepth);
  if (path === false) return clonedIdentity;
  if (path === "") path = keyName;
  else path += "." + keyName;
  path = path.split(".");
  var ref = clonedIdentity;
  if (!Array.isArray(path)) delete ref[path];
  path.forEach((key: any, i: any) => {
    if (i < path.length - 1) ref = ref[key];
    else delete ref[key];
  });
  return clonedIdentity;
}

/**
 * Performs deep search on object tree, and renames the all matching keys
 * @param {Any} identity
 * @param {string} keyName
 * @param {string} newKeyName
 * @param {Optional Number} maxDepth
 * @return {Any} identity
 */
export function renameKeys(
  identity: any,
  keyName: any,
  newKeyName: any,
  maxDepth?: any,
) {
  if (getType(keyName) !== "string") return undefined;
  if (getType(newKeyName) !== "string") return undefined;
  if (keyName === "") return undefined;
  if (newKeyName === "") return undefined;
  function _renameKeys(
    identity: any,
    keyName: any,
    newKeyName: any,
    maxDepth: any,
    currentDepth = 0,
  ) {
    let keys;
    switch (getType(identity)) {
      case "array":
        var Arr: any = [];
        keys = Object.keys(identity);
        for (var i = 0, l = keys.length; i < l; i++) {
          let key = keys[i],
            subIdentity = identity[key];
          Arr[key] = _renameKeys(
            subIdentity,
            keyName,
            newKeyName,
            maxDepth,
            currentDepth + 1,
          );
        }
        return Arr;
      case "object":
        var Obj: any = {};
        keys = Object.keys(identity);
        for (var i = 0, l = keys.length; i < l; i++) {
          let key = keys[i],
            subIdentity = identity[key];
          if (maxDepth !== null ? currentDepth < maxDepth : true)
            if (key === keyName) key = newKeyName;
          Obj[key] = _renameKeys(
            subIdentity,
            keyName,
            newKeyName,
            maxDepth,
            currentDepth + 1,
          );
        }
        return Obj;
      case "string":
        return "" + identity;
      case "number":
        return 0 + identity;
      case "boolean":
        if (identity) return true;
        return false;
      case "null":
        return null;
      case "undefined":
        return undefined;
    }
  }
  return _renameKeys(identity, keyName, newKeyName, maxDepth, 0);
}

/**
 * Performs deep search on object tree, then renames the first matching key
 * @param {Any} identity
 * @param {string} keyName
 * @param {string} newKeyName
 * @param {Optional Number} maxDepth
 * @return {Any} identity
 */
export function renameKey(
  identity: any,
  keyName: any,
  newKeyName: any,
  maxDepth: any,
) {
  if (getType(keyName) !== "string") return undefined;
  if (getType(newKeyName) !== "string") return undefined;
  if (keyName === "") return undefined;
  if (newKeyName === "") return undefined;
  var applied = false;
  function _renameKey(
    identity: any,
    keyName: any,
    newKeyName: any,
    maxDepth: any,
    currentDepth = 0,
  ) {
    let keys;
    switch (getType(identity)) {
      case "array":
        var Arr: any = [];
        keys = Object.keys(identity);
        for (var i = 0, l = keys.length; i < l; i++) {
          let key = keys[i],
            subIdentity = identity[key];
          Arr[key] = _renameKey(
            subIdentity,
            keyName,
            newKeyName,
            maxDepth,
            currentDepth + 1,
          );
        }
        return Arr;
      case "object":
        var Obj: any = {};
        keys = Object.keys(identity);
        for (var i = 0, l = keys.length; i < l; i++) {
          let key = keys[i],
            subIdentity = identity[key];
          if (maxDepth !== null ? currentDepth < maxDepth : true)
            if (!applied)
              if (key === keyName) {
                key = newKeyName;
                applied = true;
              }
          Obj[key] = _renameKey(
            subIdentity,
            keyName,
            newKeyName,
            maxDepth,
            currentDepth + 1,
          );
        }
        return Obj;
      case "string":
        return "" + identity;
      case "number":
        return 0 + identity;
      case "boolean":
        if (identity) return true;
        return false;
      case "null":
        return null;
      case "undefined":
        return undefined;
    }
  }
  return _renameKey(identity, keyName, newKeyName, maxDepth, 0);
}

/**
 * Creates a non-reference clone that is an exact copy to the identity provided.
 * @param {Any} identity
 * @param {Optional Number} maxDepth
 * @param {Optional Number} startDepth
 * @return {Any} identity
 */
export function deepClone(identity: any, maxDepth = 0, startDepth = 0) {
  var R: any = [];
  function _deepClone(
    identity: any,
    maxDepth: any,
    startDepth: any,
    currentDepth = 0,
  ) {
    let keys;
    if (startDepth !== null ? currentDepth < startDepth : false) {
      if (isIterable(identity)) {
        keys = Object.keys(identity);
        keys.forEach((key) => {
          _deepClone(identity[key], maxDepth, startDepth, currentDepth + 1);
        });
      }
      return;
    }
    if (startDepth !== null ? currentDepth == startDepth : false) {
      if (startDepth == 0) {
        R = _deepClone(identity, maxDepth, null, currentDepth);
        return;
      }
      if (isIterable(identity))
        R.push(_deepClone(identity, maxDepth, startDepth, currentDepth + 1));
      return;
    }
    switch (getType(identity)) {
      case "array":
        var Arr: any = [];
        keys = Object.keys(identity);
        if (maxDepth !== null ? currentDepth < maxDepth : true)
          for (var i = 0, l = keys.length; i < l; i++) {
            const key = keys[i],
              subIdentity = identity[key];
            Arr[key] = _deepClone(
              subIdentity,
              maxDepth,
              startDepth,
              currentDepth + 1,
            );
          }
        return Arr;
      case "object":
        var Obj: any = {};
        keys = Object.keys(identity);
        if (maxDepth !== null ? currentDepth < maxDepth : true)
          for (var i = 0, l = keys.length; i < l; i++) {
            const key = keys[i],
              subIdentity = identity[key];
            Obj[key] = _deepClone(
              subIdentity,
              maxDepth,
              startDepth,
              currentDepth + 1,
            );
          }
        return Obj;
      case "string":
        return "" + identity;
      case "number":
        return 0 + identity;
      case "boolean":
        if (identity) return true;
        return false;
      case "null":
        return null;
      case "undefined":
        return undefined;
    }
  }
  if (startDepth === null) return _deepClone(identity, maxDepth, startDepth, 0);
  _deepClone(identity, maxDepth, startDepth, 0);
  return R;
}

/**
 * Performs deep search on collection to find all matches to the key name, and returns a list of identities containing the matched instances. If no matches found, it returns `undefined`.
 * @param {Any} collection
 * @param {Any} keyName
 * @param {Optional Number} maxDepth
 * @return {Array || undefined} Identities
 */
export function deepFilter_Key(collection: any, keyName: any, maxDepth = 0) {
  if (getType(keyName) !== "string") return undefined;
  if (keyName === "") return undefined;
  var paths = locateAll_Key(collection, keyName, maxDepth);
  if (paths === false) return undefined;
  const results = paths.map((path) => {
    if (path === false) return undefined;
    if (path === "") path = keyName;
    else path += "." + keyName;
    path = path.split(".");
    var result = collection;
    if (!Array.isArray(path)) return result[path];
    path.forEach((key) => {
      result = result[key];
    });
    return result;
  });
  return results;
}

/**
 * Performs deep search on collection to find all matches to the key name, returns the location of each match in a string array. If no matches found, it returns `false`.
 * @param {Any} collection
 * @param {Any} keyName
 * @param {Optional Number} maxDepth
 * @return {Array || false} Paths
 */
export function locateAll_Key(
  collection: any,
  keyName: string,
  maxDepth?: number,
) {
  if (getType(keyName) !== "string") return undefined;
  if (keyName === "") return undefined;
  var R: any[] = [];
  function _locateAll_Key(
    collection: any,
    keyName: string,
    xKey = "",
    path = "",
    maxDepth?: number,
    currentDepth = 0,
  ) {
    if (xKey === keyName) R[R.length] = path;
    var result = false;
    if (maxDepth !== null) if (currentDepth >= maxDepth) return result;
    if (isIterable(collection))
      for (
        var i = 0, keys = Object.keys(collection), l = keys.length;
        i < l;
        i++
      ) {
        const key = keys[i],
          subcollection = collection[key];
        _locateAll_Key(
          subcollection,
          keyName,
          key,
          (path === "" ? path : path + ".") + key,
          maxDepth,
          currentDepth + 1,
        );
      }
  }
  _locateAll_Key(collection, keyName, "", "", maxDepth);
  R = R.map((path) => {
    if (getType(path) === "boolean") return path;
    if (path === "") return path;
    path = path.split(".");
    path.pop();
    path = path.join(".");
    return path;
  });
  return R.length === 0 ? false : R;
}

/**
 * Performs deep search on collection to find a match to the key name, and returns the first identity containing the match. If no match found, it returns `undefined`.
 * @param {Any} collection
 * @param {Any} keyName
 * @param {Optional number} maxDepth
 * @return {Identity || undefined} identity
 */
export function deepGet_Key(
  collection: any,
  keyName: string,
  maxDepth?: number,
) {
  if (getType(keyName) !== "string") return undefined;
  if (keyName === "") return undefined;
  var path = locate_Key(collection, keyName, maxDepth);
  if (path === false) return undefined;
  if (path === "") path = keyName;
  else path += "." + keyName;
  path = path.split(".");
  var result = collection;
  if (!Array.isArray(path)) return result[path];
  path.forEach((key) => {
    result = result[key];
  });
  return result;
}

/**
 * Performs deep search on collection to find a match to the key name, will return the path of the first instance matched. If no match found, it returns `false`.
 * @param {Any} collection
 * @param {Any} keyName
 * @param {Optional number} maxDepth
 * @return {String || false} Path
 */
export function locate_Key(
  collection: any,
  keyName: string,
  maxDepth?: number,
) {
  if (getType(keyName) !== "string") return undefined;
  if (keyName === "") return undefined;
  function _locate_Key(
    collection: any,
    keyName: string,
    path = "",
    maxDepth?: number,
    currentDepth = 0,
  ) {
    if (path === keyName) return path;
    var result: any = false;
    if (maxDepth !== null) if (currentDepth >= maxDepth) return result;
    if (isIterable(collection))
      for (
        var i = 0, keys = Object.keys(collection), l = keys.length;
        i < l;
        i++
      ) {
        const key = keys[i],
          subcollection = collection[key],
          res = _locate_Key(
            subcollection,
            keyName,
            key,
            maxDepth,
            currentDepth + 1,
          );
        if (res) {
          path = path === "" ? path : path + ".";
          result = path + res;
          break;
        }
      }
    return result;
  }
  var path = _locate_Key(collection, keyName, "", maxDepth, 0);
  if (getType(path) === "boolean") return path;
  if (path === "") return path;
  path = path.split(".");
  path.pop();
  path = path.join(".");
  return path;
}

/**
 * Performs deep search for identity on collection to return the location's depth of the first match. If no match found, it returns `false`.
 * @param {Any} collection
 * @param {Any} identity
 * @param {Optional Number} maxDepth
 * @return {boolean}
 */
export function matchDepth(collection: any, identity: any, maxDepth?: number) {
  var path = locate(collection, identity, maxDepth);
  if (path === false) return false;
  if (path === "") return 0;
  path = path.split(".");
  return path.length;
}

/**
 * Walks through the entire object tree to return the maximum number of layers it contains.
 * @param {Any} identity
 * @param {Optional Number} maxLayer
 */
export function maxDepth(identity: any, maxLayer?: number) {
  let R = 0;
  function _maxDepth(identity: any, maxLayer?: number, currentDepth = 0) {
    if (R < currentDepth) R = currentDepth;
    if (maxLayer !== null) if (currentDepth >= maxLayer) return;
    if (isIterable(identity)) {
      var keys = Object.keys(identity);
      keys.forEach((key) => {
        var subIdentity = identity[key];
        _maxDepth(subIdentity, maxLayer, currentDepth + 1);
      });
    }
  }
  _maxDepth(identity, maxLayer);
  return R;
}

/**
 * Performs deep search for identity on collection, returns the number of matches found.
 * @param {Any} collection
 * @param {Any} identity
 * @param {Number} nthDepth
 * @param {Optional Number} maxDepth
 * @return {Any} Returns number of matches found.
 */
export function countMatches(
  collection: any,
  identity: any,
  nthDepth?: number,
  maxDepth?: number,
) {
  var depth,
    nthDepth_isNull = nthDepth === null,
    maxDepth_isNull = maxDepth === null;
  if (nthDepth_isNull && maxDepth_isNull) depth = null;
  else if (!nthDepth_isNull && !maxDepth_isNull)
    if (nthDepth < maxDepth) depth = nthDepth;
    else depth = maxDepth;
  else if (nthDepth) depth = nthDepth;
  else depth = maxDepth;
  var paths = locateAll(collection, identity, depth);
  if (paths === false) return 0;
  if (nthDepth === null) return paths.length;
  if (getType(nthDepth) === "number") {
    let count = 0;
    paths.forEach((path: any) => {
      path = path.split(".");
      if (path.length === nthDepth) count++;
    });
    return count;
  }
  return undefined;
}

/**
 * Performs deep search for each identity on collection, to shorten the identities to those that meets the match criteria
 * @param {Any} collection
 * @param {Any} identities
 * @param {Any} property
 * @param {Optional Number} maxDepth
 * @return {Any} Returns a collection of the same type as the 'identities' parameter provided with only the identities that matched.
 */
export function onlyFalsy(
  collection: any,
  identities: any,
  property: any,
  maxDepth?: number,
) {
  if (getType(identities) === "array") {
    let result: any[] = [];
    identities.forEach((identity: any) => {
      const subCollection = deepFilter(collection, identity);
      if (isTruthy(subCollection))
        if (foundFalsy(subCollection, property, maxDepth))
          result.push(identity);
    });
    return result;
  }
  if (getType(identities) === "object") {
    let result: any = {};
    Object.keys(identities).forEach((key) => {
      const identity = identities[key],
        subCollection = deepFilter(collection, identity);
      if (isTruthy(subCollection))
        if (foundFalsy(subCollection, property, maxDepth))
          result[key] = identity;
    });
    return result;
  }
  if (foundFalsy(collection, property, maxDepth)) return identities;
}

/**
 * Performs deep search on collection to find any match to the property and evalutates if truthy
 * @param {Any} collection
 * @param {Property} identity
 * @param {Optional Number} maxDepth
 * @return {boolean} If match confirmed and truthy will return true, otherwise false
 */
export function foundFalsy(collection: any, identity: any, maxDepth?: any) {
  identity = singleProperty(identity);
  if (isFalsy(identity)) return undefined;
  function _foundFalsy(
    collection: any,
    identity: any,
    maxDepth?: number,
    currentDepth = 0,
  ) {
    if (containsKeys(collection, [identity]))
      return isFalsy(collection[identity]);
    if (maxDepth !== null) if (currentDepth >= maxDepth) return false;
    if (isIterable(collection))
      for (
        var i = 0, keys = Object.keys(collection), l = keys.length;
        i < l;
        i++
      ) {
        const key = keys[i],
          subcollection = collection[key],
          res = _foundFalsy(
            subcollection,
            identity,
            maxDepth,
            currentDepth + 1,
          );
        if (res) return true;
      }
    return false;
  }
  return _foundFalsy(collection, identity, maxDepth);
}

/**
 * Performs deep search for each identity on collection, to shorten the identities to those that meets the match criteria
 * @param {Any} collection
 * @param {Any} identities
 * @param {Any} property
 * @param {Optional Number} maxDepth
 * @return {Any} Returns a collection of the same type as the 'identities' parameter provided with only the identities that matched.
 */
export function onlyTruthy(
  collection: any,
  identities: any,
  property: any,
  maxDepth?: number,
) {
  if (getType(identities) === "array") {
    let result: any = [];
    identities.forEach((identity: any) => {
      const subCollection = deepFilter(collection, identity);
      if (isTruthy(subCollection))
        if (foundTruthy(subCollection, property, maxDepth))
          result.push(identity);
    });
    return result;
  }
  if (getType(identities) === "object") {
    let result: any = {};
    Object.keys(identities).forEach((key) => {
      const identity = identities[key],
        subCollection = deepFilter(collection, identity);
      if (isTruthy(subCollection))
        if (foundTruthy(subCollection, property, maxDepth))
          result[key] = identity;
    });
    return result;
  }
  if (foundTruthy(collection, property, maxDepth)) return identities;
}

/**
 * Performs deep search on collection to find any match to the property and evalutates if truthy
 * @param {Any} collection
 * @param {Property} identity
 * @param {Optional Number} maxDepth
 * @return {boolean} If match confirmed and truthy will return true, otherwise false
 */
export function foundTruthy(collection: any, identity: any, maxDepth?: number) {
  identity = singleProperty(identity);
  if (isFalsy(identity)) return undefined;
  function _foundTruthy(
    collection: any,
    identity: any,
    maxDepth?: number,
    currentDepth = 0,
  ) {
    if (containsKeys(collection, [identity]))
      return isTruthy(collection[identity]);
    if (maxDepth !== null) if (currentDepth >= maxDepth) return false;
    if (isIterable(collection))
      for (
        var i = 0, keys = Object.keys(collection), l = keys.length;
        i < l;
        i++
      ) {
        const key = keys[i],
          subcollection = collection[key],
          res = _foundTruthy(
            subcollection,
            identity,
            maxDepth,
            currentDepth + 1,
          );
        if (res) return true;
      }
    return false;
  }
  return _foundTruthy(collection, identity, maxDepth, 0);
}

/**
 * Validates if identity is equal to a property definition or contains a single property key.
 * @param {Property} identity
 * @return {String || boolean} If criteria matched will return property name as string, otherwise false
 */
export function singleProperty(identity: any) {
  const propCount = getLength(identity);
  if (propCount > 1) return false;
  if (propCount === 1) return Object.keys(identity)[0];
  if (propCount === 0)
    if (["string", "number"].indexOf(getType(identity)) > -1) return identity;
  return false;
}

/**
 * Determines if identity is non-falsy
 * @param {Any} identity
 * @return {boolean} Returns true if criteria matched, otherwise false.
 */
export function isTruthy(identity: any) {
  return !isFalsy(identity);
}

/**
 * Determines if identity is falsy
 * @param {Any} identity
 * @return {boolean} Returns true if criteria matched, otherwise false.
 */
export function isFalsy(identity: any) {
  if (falser(identity) === false) return true;
  return false;
}

/**
 * Converts false-like values into actual boolean value of false
 * @param {Any} identity
 * @return {Any || boolean} Returns false is value is falsy, otherwise returns original value.
 */
export function falser(identity: any) {
  if (isIterable(identity)) return identity;
  if (["null", "undefined"].indexOf(getType(identity)) > -1) return false;
  if (["", 0, false].indexOf(identity) > -1) return false;
  return identity;
}

/**
 * Check the length of the top-most depth of the identity
 * @param {Any} identity
 * @return {integer} Greater than or equal to 0.
 */
export function getLength(identity: any): any {
  if (["array", "object"].indexOf(getType(identity)) === -1) return 0;
  return Object.keys(identity).length;
}

/**
 * Performs deep search for each identity on collection, to shorten the identities to those that does meets the match criteria
 * @param {Any} collection
 * @param {Any} identities
 * @param {Optional Number} maxDepth
 * @return {Any} Returns a collection of the same type as the 'identities' parameter provided with only the identities that were not matched.
 */
export function onlyMissing(
  collection: any,
  identities: any,
  maxDepth?: number,
) {
  if (getType(identities) === "array") {
    let result: any = [];
    identities.forEach((identity: any) => {
      if (!exists(collection, identity, maxDepth)) result.push(identity);
    });
    return result;
  }
  if (getType(identities) === "object") {
    let result: any = {};
    Object.keys(identities).forEach((key) => {
      let identity = identities[key];
      if (!exists(collection, identity, maxDepth)) result[key] = identity;
    });
    return result;
  }
  if (!exists(collection, identities, maxDepth)) return identities;
}

/**
 * Performs deep search for each identity on collection, to shorten the identities to those that meets the match criteria
 * @param {Any} collection
 * @param {Any} identities
 * @param {Optional Number} maxDepth
 * @return {Any} Returns a collection of the same type as the 'identities' parameter provided with only the identities that matched.
 */
export function onlyExisting(collection: any, identities: any, maxDepth?: any) {
  if (getType(identities) === "array") {
    let result: any = [];
    identities.forEach((identity: any) => {
      if (exists(collection, identity, maxDepth)) result.push(identity);
    });
    return result;
  }
  if (getType(identities) === "object") {
    let result: any = {};
    Object.keys(identities).forEach((key) => {
      let identity = identities[key];
      if (exists(collection, identity, maxDepth)) result[key] = identity;
    });
    return result;
  }
  if (exists(collection, identities, maxDepth)) return identities;
}

/**
 * Performs deep search on collection to find any match to the identity
 * @param {Any} collection
 * @param {Any} identity
 * @param {Optional Number} maxDepth
 * @param {Optional Number} currentDepth
 * @return {boolean} If a match is confirmed will return true, otherwise false
 */
export function exists(
  collection: any,
  identity: any,
  maxDepth?: any,
  currentDepth = 0,
) {
  if (identical(collection, identity)) return true;
  if (isIterable(identity))
    if (sameType(collection, identity))
      if (containsKeys(collection, Object.keys(identity))) {
        const trimmed = trim(collection, Object.keys(identity));
        if (identical(trimmed, identity)) return true;
      }
  if (maxDepth === null ? true : currentDepth < maxDepth)
    if (isIterable(collection))
      for (
        var i = 0, keys = Object.keys(collection), l = keys.length;
        i < l;
        i++
      ) {
        const key = keys[i],
          subcollection = collection[key],
          res = exists(subcollection, identity, maxDepth, currentDepth + 1);
        if (res) return true;
      }
  return false;
}

/**
 * Performs deep search on collection to find all matches to the identity, will return a list of identities containing the match. If no matches found, it returns `undefined`.
 * @param {Any} collection
 * @param {Any} identity
 * @param {Optional Number} maxDepth
 * @return {Array || undefined} identities
 */
export function deepFilter(collection: any, identity: any, maxDepth?: any) {
  var paths = locateAll(collection, identity, maxDepth);
  if (paths === false) return undefined;
  const results = paths.map((path: any) => {
    if (path === "") return collection;
    path = path.split(".");
    if (["array", "object"].indexOf(getType(identity)) === -1)
      path.splice(-1, 1);
    var result = collection;
    if (!Array.isArray(path)) return result[path];
    path.forEach((key) => {
      result = result[key];
    });
    return result;
  });
  return results;
}

/**
 * Performs deep search on collection to find all matches to the identity, returns a string array containing the location of all matches. If no matches found, it returns `false`.
 * @param {Any} collection
 * @param {Any} identity
 * @param {Optional Number} maxDepth
 * @return {Array || false} Paths
 */
export function locateAll(collection: any, identity: any, maxDepth?: number) {
  var R: any = [];
  function _locateAll(
    collection: any,
    identity: any,
    path = "",
    maxDepth?: number,
    currentDepth = 0,
  ) {
    if (isIterable(identity))
      if (sameType(collection, identity))
        if (containsKeys(collection, Object.keys(identity))) {
          const trimmed = trim(collection, Object.keys(identity));
          if (identical(trimmed, identity)) R[R.length] = path;
        }
    if (identical(collection, identity)) R[R.length] = path;
    var result = false;
    if (maxDepth !== null) if (currentDepth >= maxDepth) return result;
    if (isIterable(collection))
      for (
        var i = 0, keys = Object.keys(collection), l = keys.length;
        i < l;
        i++
      ) {
        const key = keys[i],
          subcollection = collection[key];
        _locateAll(
          subcollection,
          identity,
          (path === "" ? path : path + ".") + key,
          maxDepth,
          currentDepth + 1,
        );
      }
  }
  _locateAll(collection, identity, "", maxDepth, 0);
  return R.length === 0 ? false : R;
}

/**
 * Performs deep search on collection to find a match to the identity, will return the identity containing of the first instance matched. If no matches found, it returns `undefined`.
 * @param {Any} collection
 * @param {Any} identity
 * @param {Optional Number} maxDepth
 * @return {identity || undefined} identity
 */
export function deepGet(collection: any, identity: any, maxDepth?: any) {
  var path = locate(collection, identity, maxDepth);
  if (path === false) return undefined;
  if (path === "") return collection;
  path = path.split(".");
  if (["array", "object"].indexOf(getType(identity)) === -1) path.splice(-1, 1);
  var result = collection;
  if (!Array.isArray(path)) return result[path];
  path.forEach((key) => {
    result = result[key];
  });
  return result;
}

/**
 * Performs deep search on collection to find a match to the identity, will return the path of the first instance matched as string. If no matches found, returns `false`.
 * @param {Any} collection
 * @param {Any} identity
 * @param {Optional number} maxDepth
 * @return {string || false} path
 */
export function locate(collection: any, identity: any, maxDepth?: any) {
  function _locate(
    collection: any,
    identity: any,
    path = "",
    maxDepth?: any,
    currentDepth = 0,
  ) {
    if (isIterable(identity))
      if (sameType(collection, identity))
        if (containsKeys(collection, Object.keys(identity))) {
          const trimmed = trim(collection, Object.keys(identity));
          if (identical(trimmed, identity)) return path;
        }
    if (identical(collection, identity)) return path;
    var result: any = false;
    if (maxDepth !== null) if (currentDepth >= maxDepth) return result;

    if (isIterable(collection))
      for (
        var i = 0, keys = Object.keys(collection), l = keys.length;
        i < l;
        i++
      ) {
        const key = keys[i],
          subcollection = collection[key],
          res = _locate(
            subcollection,
            identity,
            key,
            maxDepth,
            currentDepth + 1,
          );
        if (res) {
          path = path === "" ? path : path + ".";
          result = path + res;
          break;
        }
      }
    return result;
  }
  return _locate(collection, identity, "", maxDepth, 0);
}

/**
 * Trims an identity to only contain the specified properties.
 * @param {Any} identity
 * @param {Any} keyList
 * @return {Object or Array} Returns , otherwise false
 */
export function trim(identity: any, keyList: any) {
  const identityType = getType(identity);
  if (["array", "object"].indexOf(identityType) === -1) return undefined;
  const keyCount = keyList.length;
  if (keyCount === 0) return undefined;
  var newIdentity;
  switch (identityType) {
    case "object":
      newIdentity = {};
      keyList.forEach((key: any) => {
        if (key in identity) newIdentity[key] = identity[key];
      });
      break;
    case "array":
      newIdentity = [];
      keyList.forEach((key: any) => {
        if (key in identity) newIdentity.push(identity[key]);
      });
      break;
  }
  return newIdentity;
}

/**
 * Check if identity contains all of the specified keys
 * @param {Any} identity
 * @param {Array} keyList
 * @return {boolean} true || false
 */
export function containsKeys(identity: any, keyList: any) {
  const keyCount = keyList.length;
  if (keyCount === 0 || !isIterable(identity)) return false;
  const identitykeys = Object.keys(identity);
  var result = true;
  for (var i = 0; i < keyCount; i++) {
    const key = "" + keyList[i];
    if (identitykeys.indexOf(key) === -1) {
      result = false;
      break;
    }
  }
  return result;
}

/**
 * Check if identity has one or more keys to iterate
 * @param {Any} identity
 * @return {boolean} true || false
 */
export function isIterable(identity: any) {
  if (["array", "object"].indexOf(getType(identity)) === -1) return false;
  if (Object.keys(identity).length === 0) return false;
  return true;
}

/**
 * Compares two identities, will return either true if identical, otherwise false.
 * @param {Any} identityA
 * @param {Any} identityB
 * @return {boolean} true || false
 */
export function identical(identityA: any, identityB: any): any {
  const structureMatch: any = sameStructure(identityA, identityB);
  if (structureMatch === false) return structureMatch;
  if (["array", "object"].indexOf(structureMatch) === -1)
    return identityA === identityB;
  const Keys = Object.keys(identityA),
    KeyCount = Keys.length;
  var childMatch = true;
  for (var i = 0; i < KeyCount; i++) {
    const Key = Keys[i],
      identicalMatch = identical(identityA[Key], identityB[Key]);
    if (identicalMatch === false) {
      childMatch = identicalMatch;
      break;
    }
  }
  return childMatch;
}

/**
 * Compares data structure of two identities, will return either the dataType or true/false.
 * @param {Any} identityA
 * @param {Any} identityB
 * @return {String || False} DataType as string for positive match, otherwise false
 */
export function sameStructure(identityA: any, identityB: any) {
  const typeMatch = sameType(identityA, identityB);
  if (typeMatch === false) return false;
  if (["array", "object"].indexOf(typeMatch) > -1) {
    const AKeys = Object.keys(identityA),
      BKeys = Object.keys(identityB),
      AKeyCount = AKeys.length,
      BKeyCount = BKeys.length;
    if (!(AKeyCount === BKeyCount)) return false;
    if (AKeyCount === 0) return true;
    for (var i = 0; i < AKeyCount; i++) {
      if (AKeys[i] !== BKeys[i]) return false;
    }
  }
  return typeMatch;
}

/**
 * Compares data type of two identities, will dataType if true.
 * @param {Any} identityA
 * @param {Any} identityB
 * @return {boolean} true || false
 */
export function sameType(identityA: any, identityB: any) {
  const typeA = getType(identityA);
  return typeA === getType(identityB) ? typeA : false;
}

/**
 * Gets data type; makes distintion between object, array, and null.
 * @param {Any} identity
 * @return {String} dataType
 */
export function getType(identity: any) {
  if (identity === null) return "null";
  const it = typeof identity;
  if (it === "object") if (Array.isArray(identity)) return "array";
  return it;
}
