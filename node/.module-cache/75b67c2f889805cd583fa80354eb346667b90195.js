'use strict';

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.fastGnpRandomGraph = fastGnpRandomGraph;
exports.genFastGnpRandomGraph = genFastGnpRandomGraph;
exports.gnpRandomGraph = gnpRandomGraph;
exports.genGnpRandomGraph = genGnpRandomGraph;
exports.binomialGraph = binomialGraph;
exports.genBinomialGraph = genBinomialGraph;
exports.erdosRenyiGraph = erdosRenyiGraph;
exports.genErdosRenyiGraph = genErdosRenyiGraph;

var _internalsDelegate = require('..\\_internals\\delegate');

var _internalsDelegate2 = _interopRequireDefault(_internalsDelegate);

var _classesDiGraph = require('../classes/DiGraph');

var _classesDiGraph2 = _interopRequireDefault(_classesDiGraph);

var _classesGraph = require('../classes/Graph');

var _classesGraph2 = _interopRequireDefault(_classesGraph);

var _classic = require('./classic');

var _internals = require('../_internals');

//
//-------------------------------------------------------------------------
//  Some Famous Random Graphs
//-------------------------------------------------------------------------

/**
 * Return a random graph `$G_{n,p}$` (Erdős-Rényi graph, binomial graph).
 *
 * The `$G_{n,p}$` graph algorithm chooses each of the `$[n(n-1)]/2$`
 * (undirected) or `$n(n-1)$` (directed) possible edges with probability `$p$`.
 *
 * This algorithm is `$O(n+m)$` where `$m$` is the expected number of
 * edges `$m = p*n*(n-1)/2$`.
 *
 * It should be faster than `gnpRandomGraph` when `p` is small and
 * the expected number of edges is small (sparse graph).
 *
 * ### References
 *
 * [1] Vladimir Batagelj and Ulrik Brandes,
 *     "Efficient generation of large random networks",
 *     Phys. Rev. E, 71, 036113, 2005.
 *
 * @param {number} n The number of nodes
 * @param {number} p Probability for edge creation
 * @param {boolean} optDirected If true return a directed graph
 * @return {Graph}
 */
'use strict';

function fastGnpRandomGraph(n, p) {
  var optDirected = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var G = (0, _classic.emptyGraph)(n);
  G.name = (0, _internals.sprintf)('fastGnpRandomGraph(%s, %s)', n, p);

  if (p <= 0 || p >= 1) {
    return gnpRandomGraph(n, p, optDirected);
  }
  var v;
  var w = -1;
  var lp = Math.log(1 - p);
  var lr;

  if (optDirected) {
    // Nodes in graph are from 0,n-1 (start with v as the first node index).
    v = 0;
    G = new _classesDiGraph2['default'](G);
    while (v < n) {
      lr = Math.log(1 - Math.random());
      w = w + 1 + Math.floor(lr / lp);
      if (v === w) {
        // avoid self loops
        w = w + 1;
      }
      while (w >= n && v < n) {
        w = w - n;
        v = v + 1;
        if (v === w) {
          // avoid self loops
          w = w + 1;
        }
      }
      if (v < n) {
        G.addEdge(v, w);
      }
    }
  } else {
    v = 1; // Nodes in graph are from 0, n-1 (this is the second node index).
    while (v < n) {
      lr = Math.log(1 - Math.random());
      w = w + 1 + Math.floor(lr / lp);
      while (w >= v && v < n) {
        w = w - v;
        v = v + 1;
      }
      if (v < n) {
        G.addEdge(v, w);
      }
    }
  }
  return G;
}

/**
 * Return a random graph `$G_{n,p}$` (Erdős-Rényi graph, binomial graph).
 *
 * Chooses each of the possible edges with probability `p.
 *
 * This is also called `binomialGraph` and `erdosRenyiGraph`.
 *
 * This is an `$O(n^2)$` algorithm.  For sparse graphs (small `$p$`) see
 * `fastGnpRandomGraph for a faster algorithm.
 *
 * @param {number} n The number of nodes
 * @param {number} p Probability for edge creation
 * @param {boolean} optDirected
 *  If true returns a directed graph
 * @return {Graph}
 */

function genFastGnpRandomGraph(n, p, optDirected) {
  return (0, _internalsDelegate2['default'])('fastGnpRandomGraph', [n, p, optDirected]);
}

function gnpRandomGraph(n, p) {
  var optDirected = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var G = optDirected ? new _classesDiGraph2['default']() : new _classesGraph2['default']();
  var edges;
  var rangeN = (0, _internals.range)(n);

  G.addNodesFrom(rangeN);
  G.name = (0, _internals.sprintf)('gnpRandomGraph(%s, %s)', n, p);
  if (p <= 0) {
    return G;
  }
  if (p >= 1) {
    return (0, _classic.completeGraph)(n, G);
  }

  edges = G.isDirected() ? (0, _internals.genPermutations)(rangeN, 2) : (0, _internals.genCombinations)(rangeN, 2);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _getIterator(edges), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var edge = _step.value;

      if (Math.random() < p) {
        G.addEdge(edge[0], edge[1]);
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

  return G;
}

/**
 * @alias gnpRandomGraph
 */

function genGnpRandomGraph(n, p, optDirected) {
  return (0, _internalsDelegate2['default'])('gnpRandomGraph', [n, p, optDirected]);
}

function binomialGraph(n, p, optDirected) {
  return gnpRandomGraph(n, p, optDirected);
}

/**
 * @alias gnpRandomGraph
 */

function genBinomialGraph(n, p, optDirected) {
  return (0, _internalsDelegate2['default'])('binomialGraph', [n, p, optDirected]);
}

function erdosRenyiGraph(n, p, optDirected) {
  return gnpRandomGraph(n, p, optDirected);
}

//TODO: newman_watts_strogatz_graph
//TODO: watts_strogatz_graph
//TODO: connected_watts_strogatz_graph
//TODO: random_regular_graph
//TODO: _random_subset
//TODO: barabasi_albert_graph
//TODO: powerlaw_cluster_graph
//TODO: random_lobster
//TODO: random_shell_graph
//TODO: random_powerlaw_tree
//TODO: random_powerlaw_tree_sequence

function genErdosRenyiGraph(n, p, optDirected) {
  return (0, _internalsDelegate2['default'])('erdosRenyiGraph', [n, p, optDirected]);
}