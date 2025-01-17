'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.singleSourceShortestPathLength = singleSourceShortestPathLength;
exports.genSingleSourceShortestPathLength = genSingleSourceShortestPathLength;
exports.allPairsShortestPathLength = allPairsShortestPathLength;
exports.genAllPairsShortestPathLength = genAllPairsShortestPathLength;
exports.bidirectionalShortestPath = bidirectionalShortestPath;
exports.genBidirectionalShortestPath = genBidirectionalShortestPath;
exports.singleSourceShortestPath = singleSourceShortestPath;
exports.genSingleSourceShortestPath = genSingleSourceShortestPath;
exports.allPairsShortestPath = allPairsShortestPath;
exports.genAllPairsShortestPath = genAllPairsShortestPath;
exports.predecessor = predecessor;
exports.genPredecessor = genPredecessor;

var _internalsDelegate = require('..\\..\\_internals\\delegate');

var _internalsDelegate2 = _interopRequireDefault(_internalsDelegate);

/**
 * @fileoverview Shortest path algorithms for unweighted graphs.
 */

var _exceptions = require('../../exceptions');

var _internals = require('../../_internals');

/**
 * Compute the shortest path lengths from source to all reachable nodes.
 *
 * ### Example
 *
 * ```
 * var G = jsnx.pathGraph(5);
 * var length = jsnx.singleSourceShortestPathLength(G, 0);
 * length.get(4);
 * // 4
 * length
 * // Map {0: 0, 1: 1, 2: 2, 3: 3, 4: 4}
 * ```
 *
 * @see shortestPathLength
 *
 * @param {Graph} G graph
 * @param {Node} source Starting node for path
 * @param {number=} optCutoff
 *    Depth to stop the search. Only paths of length <= cutoff are returned.
 *
 * @return {!Map} Map of shortest path lengths keyed by target.
 */
'use strict';
function singleSourceShortestPathLength(G, source, optCutoff) {
  var seen = new _internals.Map(); // level (number of hops) when seen n BFS
  var level = 0; // the current level
  // map of nodes to check at next level
  var nextlevel = new _internals.Map([[source, 1]]);

  while (nextlevel.size > 0) {
    var thislevel = nextlevel;
    nextlevel = new _internals.Map();
    /*eslint no-loop-func:0*/
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(thislevel.keys()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var v = _step.value;

        if (!seen.has(v)) {
          seen.set(v, level);
          G.get(v).forEach(function (_, n) {
            return nextlevel.set(n, 1);
          });
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (optCutoff != null && optCutoff <= level) {
      break;
    }
    level += 1;
  }
  return seen;
}

/**
 * Compute the shortest path lengths between all nodes in G.
 *
 * The map returned only has keys for reachable node pairs.
 *
 * ### Example
 *
 * ```
 * var G = jsnx.pathGraph(5);
 * var length = jsnx.allPairsShortestPathLength(G);
 * length.get(1).get(4);
 * // 3
 * length.get(1);
 * // Map {0: 1, 1: 0, 2: 1, 3: 2, 4: 3}
 * ```
 *
 * @param {Graph} G
 * @param {number=} optCutoff  depth to stop the search.
 *    Only paths of length <= cutoff are returned.
 *
 * @return {!Map}
 */

function genSingleSourceShortestPathLength(G, source, optCutoff) {
  return (0, _internalsDelegate2['default'])('singleSourceShortestPathLength', [G, source, optCutoff]);
}

function allPairsShortestPathLength(G, optCutoff) {
  var paths = new _internals.Map();
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = _getIterator(G), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var n = _step2.value;

      paths.set(n, singleSourceShortestPathLength(G, n, optCutoff));
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2['return']) {
        _iterator2['return']();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return paths;
}

/**
 * Return a list of nodes in a shortest path between source and target.
 *
 * This algorithm is used by `shortestPath(G, source, target)`.
 *
 * @see shortestPath
 *
 * @param {Graph} G
 * @param {Node} source starting node for path
 * @param {Node} target ending node for path
 *
 * @return {!Array}
 */

function genAllPairsShortestPathLength(G, optCutoff) {
  return (0, _internalsDelegate2['default'])('allPairsShortestPathLength', [G, optCutoff]);
}

function bidirectionalShortestPath(G, source, target) {
  // call helper to do the real work

  var _bidirectionalPredSucc = bidirectionalPredSucc(G, source, target);

  var _bidirectionalPredSucc2 = _slicedToArray(_bidirectionalPredSucc, 3);

  var pred = _bidirectionalPredSucc2[0];
  var succ = _bidirectionalPredSucc2[1];
  var w = _bidirectionalPredSucc2[2];

  // build path from pred+w+succ
  var path = [];
  // from source to w
  while (w != null) {
    path.push(w);
    w = pred.get(w);
  }
  w = succ.get(path[0]);
  path.reverse();
  // from w to target
  while (w != null) {
    path.push(w);
    w = succ.get(w);
  }
  return path;
}

/**
 * Bidirectional shortest path helper.
 *
 * @return {!Array} Returns [pred,succ,w] where
 *    pred is a map of predecessors from w to the source, and
 *    succ is a map of successors from w to the target.
 */

function genBidirectionalShortestPath(G, source, target) {
  return (0, _internalsDelegate2['default'])('bidirectionalShortestPath', [G, source, target]);
}

function bidirectionalPredSucc(G, source, target) {
  // does BFS from both source and target and meets in the middle
  if ((0, _internals.nodesAreEqual)(source, target)) {
    return [new _internals.Map([[source, null]]), new _internals.Map([[target, null]]), source];
  }

  // handle either directed or undirected
  var gpred, gsucc;
  if (G.isDirected()) {
    gpred = G.predecessorsIter.bind(G);
    gsucc = G.successorsIter.bind(G);
  } else {
    gpred = G.neighborsIter.bind(G);
    gsucc = G.neighborsIter.bind(G);
  }

  // predecesssor and successors in search
  var pred = new _internals.Map([[source, null]]);
  var succ = new _internals.Map([[target, null]]);
  //
  // initialize fringes, start with forward
  var forwardFringe = [source];
  var reverseFringe = [target];
  var thisLevel;

  /*jshint newcap:false*/
  while (forwardFringe.length > 0 && reverseFringe.length > 0) {
    if (forwardFringe.length <= reverseFringe.length) {
      thisLevel = forwardFringe;
      forwardFringe = [];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _getIterator(thisLevel), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var v = _step3.value;
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = _getIterator(gsucc(v)), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var w = _step4.value;

              if (!pred.has(w)) {
                forwardFringe.push(w);
                pred.set(w, v);
              }
              if (succ.has(w)) {
                return [pred, succ, w]; // found path
              }
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                _iterator4['return']();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    } else {
        thisLevel = reverseFringe;
        reverseFringe = [];
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = _getIterator(thisLevel), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var v = _step5.value;
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
              for (var _iterator6 = _getIterator(gpred(v)), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var w = _step6.value;

                if (!succ.has(w)) {
                  reverseFringe.push(w);
                  succ.set(w, v);
                }
                if (pred.has(w)) {
                  return [pred, succ, w]; // found path
                }
              }
            } catch (err) {
              _didIteratorError6 = true;
              _iteratorError6 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion6 && _iterator6['return']) {
                  _iterator6['return']();
                }
              } finally {
                if (_didIteratorError6) {
                  throw _iteratorError6;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5['return']) {
              _iterator5['return']();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      }
  }
  throw new _exceptions.JSNetworkXNoPath((0, _internals.sprintf)('No path between `%j` and `%j`.', source, target));
}

/**
 * Compute shortest path between source and all other nodes reachable from
 * source.
 *
 * ### Example
 *
 * ```
 * var G = jsnx.pathGraph(5);
 * var path = jsnx.singleSourceShortestPath(G, 0);
 * path.get(4);
 * // [1, 2, 3, 4]
 * ```
 *
 * ### Notes
 *
 * The shortest path is not necessarily unique. So there can be multiple⋅
 * paths between the source and each target node, all of which have the⋅
 * same 'shortest' length. For each target node, this function returns⋅
 * only one of those paths.
 *
 *
 * @see shortestPath
 *
 * @param {Graph} G
 * @param {Node} source
 * @param {number=} optCutoff Depth to stop the search.
 *    Only paths of `length <= cutoff` are returned.
 *
 * @return {!Map<Array>} Map, keyed by target, of shortest paths.
 */

function singleSourceShortestPath(G, source, optCutoff) {
  var level = 0;
  var nextlevel = new _internals.Map([[source, 1]]);
  var paths = new _internals.Map([[source, [source]]]);
  if (optCutoff === 0) {
    return paths;
  }
  /*jshint loopfunc:true*/
  while (nextlevel.size > 0) {
    var thislevel = nextlevel;
    nextlevel = new _internals.Map();
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = _getIterator(thislevel.keys()), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var v = _step7.value;
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = _getIterator(G.get(v).keys()), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var w = _step8.value;

            if (!paths.has(w)) {
              paths.set(w, paths.get(v).concat([w]));
              nextlevel.set(w, 1);
            }
          }
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8['return']) {
              _iterator8['return']();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError7 = true;
      _iteratorError7 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion7 && _iterator7['return']) {
          _iterator7['return']();
        }
      } finally {
        if (_didIteratorError7) {
          throw _iteratorError7;
        }
      }
    }

    level += 1;
    if (optCutoff != null && optCutoff <= level) {
      break;
    }
  }
  return paths;
}

/**
 * Compute shortest paths between all nodes.
 *
 * ### Example
 *
 * ```
 * var G = jsnx.pathGraph(5);
 * var path = jsnx.allPairsShortestPath(G);
 * path.get(0).get(4);
 * // [0, 1, 2, 3, 4]
 * ```
 *
 * @see floydWarshall
 *
 * @param {Graph} G
 * @param {number=} optCutoff Depth to stop the search.
 *    Only paths of length <= cutoff are returned.
 *
 * @return {!Map} Map, keyed by source and target, of shortest paths.
 */

function genSingleSourceShortestPath(G, source, optCutoff) {
  return (0, _internalsDelegate2['default'])('singleSourceShortestPath', [G, source, optCutoff]);
}

function allPairsShortestPath(G, optCutoff) {
  var paths = new _internals.Map();
  var _iteratorNormalCompletion9 = true;
  var _didIteratorError9 = false;
  var _iteratorError9 = undefined;

  try {
    for (var _iterator9 = _getIterator(G), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
      var n = _step9.value;

      paths.set(n, singleSourceShortestPath(G, n, optCutoff));
    }
  } catch (err) {
    _didIteratorError9 = true;
    _iteratorError9 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion9 && _iterator9['return']) {
        _iterator9['return']();
      }
    } finally {
      if (_didIteratorError9) {
        throw _iteratorError9;
      }
    }
  }

  return paths;
}

/**
 * Returns a map of predecessors for the path from source to all nodes in G.
 *
 * ### Example
 *
 * ```
 * var G = jsnx.pathGraph(4);
 * G.nodes();
 * // [0, 1, 2, 3, 4]
 * jsnx.predecessor(G, 0);
 * // Map {0: [], 1: [0], 2: [1], 3: [2]}
 *
 * @param {Graph} G
 * @param {Node} source Starting node for path
 * @param {{target: Node, cutoff: number, returnSeen: boolean}} optArgs
 *   - `target(=null)`: If provided only predecessors between⋅source and target
 *     are returned
 *   - `cutoff`: Depth to stop the search. Only paths of `length <= cutoff` are
 *     returned
 *   - `returnSeen(=false)`: If `true`, return `(seenNodes, predecessors)`
 *
 * @return {!(Map|Array)} Map, keyed by node, of predecessors in the shortest
 *   path.
 */

function genAllPairsShortestPath(G, optCutoff) {
  return (0, _internalsDelegate2['default'])('allPairsShortestPath', [G, optCutoff]);
}

function predecessor(G, source) {
  var optArgs = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  // TODO: use parameter destructuring
  // {target, cutoff, returnSeen}
  var target = optArgs.target;
  var cutoff = optArgs.cutoff;
  var returnSeen = optArgs.returnSeen;

  var level = 0;
  var nextlevel = [source];
  var seen = new _internals.Map([[source, level]]);
  var pred = new _internals.Map([[source, []]]);

  /*jshint loopfunc:true*/
  while (nextlevel.length > 0) {
    level += 1;
    var thislevel = nextlevel;
    nextlevel = [];
    thislevel.forEach(function (v) {
      G.get(v).forEach(function (_, w) {
        if (!seen.has(w)) {
          pred.set(w, [v]);
          seen.set(w, level);
          nextlevel.push(w);
        } else if (seen.get(w) === level) {
          // add v to predecesssor list if it
          pred.get(w).push(v); // is at the correct level
        }
      });
    });
    if (cutoff != null && cutoff <= level) {
      break;
    }
  }

  if (target != null) {
    if (returnSeen) {
      return pred.has(target) ? [pred.get(target), seen.get(target)] : [[], -1];
    } else {
      return (0, _internals.getDefault)(pred.get(target), []);
    }
  }
  return returnSeen ? [pred, seen] : pred;
}

function genPredecessor(G, source, optArgs) {
  return (0, _internalsDelegate2['default'])('predecessor', [G, source, optArgs]);
}