'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.hasPath = hasPath;
exports.genHasPath = genHasPath;
exports.shortestPath = shortestPath;
exports.genShortestPath = genShortestPath;
exports.shortestPathLength = shortestPathLength;
exports.genShortestPathLength = genShortestPathLength;

var _internalsDelegate = require('..\\..\\_internals\\delegate');

var _internalsDelegate2 = _interopRequireDefault(_internalsDelegate);

var _exceptions = require('../../exceptions');

var _unweighted = require('./unweighted');

var _weighted = require('./weighted');

/**
 * Return `true` if `G` has a path from `source to `target`, `false` otherwise.
 *
 * @param {Graph} G
 * @param {{source: Node, target: node}} parameters
 *   - source: Starting node for path
 *   - target: Ending node for path
 * @return {boolean}
 */
'use strict';

function hasPath(G, _ref) {
  var source = _ref.source;
  var target = _ref.target;

  try {
    shortestPath(G, { source: source, target: target });
  } catch (error) {
    if (error instanceof _exceptions.JSNetworkXNoPath) {
      return false;
    }
    throw error;
  }
  return true;
}

/**
 * Compute shortest paths in the graph.
 *
 * ### Examples
 *
 * ```
 * var G = jsnx.pathGraph(5);
 * jsnx.shortestPath(G, {source: 0, target: 4});
 * // [0, 1, 2, 3, 4]
 * var paths = jsnx.shortestPath(G, {source: 0}); // target not specified
 * paths.get(4);
 * // [0, 1, 2, 3, 4]
 * paths = jsnx.shortestPath(G {target: 4}); // source not specified
 * paths.get(0);
 * // [0, 1, 2, 3, 4]
 * paths = jsnx.shortestPath(G); // source, target not specified
 * paths.get(0).get(4);
 * // [0, 1, 2, 3, 4]
 * ```
 *
 * ### Notes
 *
 * There may be more than one shortest path between a source and a target.
 * This returns only one of them.
 *
 * @see allPairsShortestPath
 * @see allPairsDijkstraPath
 * @see singleSourceShortestPath
 * @see singleSourceDijkstraPath
 *
 * @param {Graph} G
 * @param {?{source: ?Node, target: ?Node, weight: ?string}=} optParameters
 *   - source: Starting node for path.
 *     If not specified, compute the shortest paths using all nodes as source
 *     nodes.
 *   - target: Ending node for path.
 *     If not specified, compute the shortest paths using all nodes as target
 *     nodes.
 *   - weight:
 *     If not specified, every edge has weight/distance/cost of 1.
 *     If a string, use this edge attribute as the edge weight. Any edg
 *     attribute not present defaults to 1.
 * @return {(Array|Map)} All returned paths include both the source and the
 *   target in the path.
 *
 *   If the `source` and `target` are both specified, return a single list
 *   of nodes in a shortest path from the source to the target.
 *
 *   If only the `source` is specified, return a Map keyed by
 *   targets with a list of nodes in a shortest path from the source
 *   to one of the targets.
 *
 *   If only the `target` is specified, return a Map keyed by
 *   sources with a list of nodes in a shortest path from one of the
 *   sources to the target.
 *
 *   If neither the `source` nor `target` are specified return a Map
 *   of Maps with `Map {source: Map {target: [list of nodes in path] }}`.
 */

function genHasPath(G, _source$target) {
  return (0, _internalsDelegate2['default'])('hasPath', [G, _source$target]);
}

function shortestPath(G) {
  var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var source = _ref2.source;
  var target = _ref2.target;
  var weight = _ref2.weight;

  var paths;

  if (source == null) {
    if (target == null) {
      // find paths between all pairs
      if (weight == null) {
        paths = (0, _unweighted.allPairsShortestPath)(G);
      } else {
        paths = (0, _weighted.allPairsDijkstraPath)(G, { weight: weight });
      }
    } else {
      // find paths from all nodes co-accessibly to the target
      var directed = G.isDirected();
      try {
        if (directed) {
          G.reverse(false);
        }
        if (weight == null) {
          paths = (0, _unweighted.singleSourceShortestPath)(G, target);
        } else {
          paths = (0, _weighted.singleSourceDijkstraPath)(G, { target: target, weight: weight });
        }

        // now flip the paths so they go from a source to the target
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _getIterator(paths), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2);

            var _target = _step$value[0];
            var path = _step$value[1];

            paths.set(_target, path.reverse());
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
      } finally {
        if (directed) {
          G.reverse(false);
        }
      }
    }
  } else {
    if (target == null) {
      // find paths to all nodes accessible from the source
      if (weight == null) {
        paths = (0, _unweighted.singleSourceShortestPath)(G, source);
      } else {
        paths = (0, _weighted.singleSourceDijkstraPath)(G, { source: source, weight: weight });
      }
    } else {
      // find shortest source-target path
      if (weight == null) {
        paths = (0, _unweighted.bidirectionalShortestPath)(G, source, target);
      } else {
        paths = (0, _weighted.dijkstraPath)(G, { source: source, target: target, weight: weight });
      }
    }
  }

  return paths;
}

/**
 * Compute shortest path lengths in the graph.
 *
 * ### Examples
 *
 * ```
 * var G = jsnx.pathGraph(5);
 * jsnx.shortestPathLength(G, {source: 0, target: 4});
 * // 4
 * var paths = jsnx.shortestPathLength(G, {source: 0}); // target not specified
 * paths.get(4);
 * // 4
 * paths = jsnx.shortestPathLength(G {target: 4}); // source not specified
 * paths.get(0);
 * // 4
 * paths = jsnx.shortestPathLength(G); // source, target not specified
 * paths.get(0).get(4);
 * // 4
 * ```
 *
 * ### Notes
 *
 * The length of the path is always 1 less than the number of nodes involved in
 * the path since the length measures the number of edges followed.
 *
 * For digraphs this returns the shortest directed path length. To find path
 * lengths in the reverse directio, use `G.reverse(false)` first to flip the
 * edge orientation.
 *
 * @see allPairsShortestPathLength
 * @see allPairsDijkstraPathLength
 * @see singleSourceShortestPathLength
 * @see singleSourceDijkstraPathLength
 *
 * @param {Graph} G
 * @param {?{source: ?Node, target: ?Node, weight: ?string}=} optParameters
 *   - source: Starting node for path.
 *     If not specified, compute the shortest path lengths using all nodes as
 *     source nodes.
 *   - target: Ending node for path.
 *     If not specified, compute the shortest path length using all nodes as
 *     target nodes.
 *   - weight:
 *     If not specified, every edge has weight/distance/cost of 1.
 *     If a string, use this edge attribute as the edge weight. Any edg
 *     attribute not present defaults to 1.
 * @return {(number|Map)}
 *   If the `source` and `target` are both specified, return the length of the
 *   shortest path from the source to the target.
 *
 *   If only the `source` is specified, return a Map keyed by
 *   targets whose values are the lengths of the shortest path from the source
 *   to one of the targets.
 *
 *   If only the `target` is specified, return a Map keyed by
 *   sources whose values are the lengths of the shortest path from one of the
 *   sources to the target.
 *
 *   If neither the `source` nor `target` are specified return a Map
 *   of Maps with path[source][target]=L, where L is the length of the shortest
 *   path from source to target.
 */

function genShortestPath(G, _source$target$weight) {
  return (0, _internalsDelegate2['default'])('shortestPath', [G, _source$target$weight]);
}

function shortestPathLength(G) {
  var _ref3 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var source = _ref3.source;
  var target = _ref3.target;
  var weight = _ref3.weight;

  var paths;

  if (source == null) {
    if (target == null) {
      // find paths between all pairs
      if (weight == null) {
        paths = (0, _unweighted.allPairsShortestPathLength)(G);
      } else {
        paths = (0, _weighted.allPairsDijkstraPathLength)(G, { weight: weight });
      }
    } else {
      // find paths from all nodes co-accessibly to the target
      var directed = G.isDirected();
      try {
        if (directed) {
          G.reverse(false);
        }
        if (weight == null) {
          paths = (0, _unweighted.singleSourceShortestPathLength)(G, target);
        } else {
          paths = (0, _weighted.singleSourceDijkstraPathLength)(G, { target: target, weight: weight });
        }
      } finally {
        if (directed) {
          G.reverse(false);
        }
      }
    }
  } else {
    if (target == null) {
      // find paths to all nodes accessible from the source
      if (weight == null) {
        paths = (0, _unweighted.singleSourceShortestPathLength)(G, source);
      } else {
        paths = (0, _weighted.singleSourceDijkstraPathLength)(G, { source: source, weight: weight });
      }
    } else {
      // find shortest source-target path
      if (weight == null) {
        paths = (0, _unweighted.bidirectionalShortestPath)(G, source, target);
        paths = paths.length - 1;
      } else {
        paths = (0, _weighted.dijkstraPathLength)(G, { source: source, target: target, weight: weight });
      }
    }
  }

  return paths;
}

// TODO averageShortestPathLength
// TODO allShortestPaths

function genShortestPathLength(G, _source$target$weight2) {
  return (0, _internalsDelegate2['default'])('shortestPathLength', [G, _source$target$weight2]);
}