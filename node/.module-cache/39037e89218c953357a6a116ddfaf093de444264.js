'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.union = union;
exports.genUnion = genUnion;
exports.disjointUnion = disjointUnion;
exports.genDisjointUnion = genDisjointUnion;
exports.intersection = intersection;
exports.genIntersection = genIntersection;
exports.difference = difference;
exports.genDifference = genDifference;
exports.symmetricDifference = symmetricDifference;
exports.genSymmetricDifference = genSymmetricDifference;
exports.compose = compose;
exports.genCompose = genCompose;

var _internalsDelegate = require('..\\..\\_internals\\delegate');

var _internalsDelegate2 = _interopRequireDefault(_internalsDelegate);

var _exceptionsJSNetworkXError = require('../../exceptions/JSNetworkXError');

var _exceptionsJSNetworkXError2 = _interopRequireDefault(_exceptionsJSNetworkXError);

var _relabel = require('../../relabel');

var _classesFunctions = require('../../classes/functions');

var _internalsSet = require('../../_internals/Set');

var _internalsSet2 = _interopRequireDefault(_internalsSet);

var _internals = require('../../_internals');

'use strict';

function assertSameNodes(G, H) {
  var Hnodes = new _internalsSet2['default'](H);
  var Gnodes = new _internalsSet2['default'](G);
  if (Hnodes.size !== Gnodes.size || (0, _internals.someIterator)(Gnodes.values(), function (v) {
    return !Hnodes.has(v);
  })) {
    throw new _exceptionsJSNetworkXError2['default']('Node sets of graphs are not equal.');
  }
}

/**
 * Return the union of graphs `G` and `H`.
 *
 * Graphs `G` and `H` must be disjoint, otherwise an exception is raised.
 *
 * ### Notes
 *
 * To force a disjoint union with node relabeling, use `disjointUnion(G, H)` or
 * `convertNodeLabelsToIntegers()`.
 *
 * Graph, edge and node attributes are propagated from `G` and `H` to the union
 * Graph. If a graph attribute is present in both `G` and `H`, the value from
 * `H` is used.
 *
 * @see #disjointUnion
 *
 * @param {Graph} G
 * @param {Graph} H
 * @param {{rename: ?Array}} optParameters
 *   - rename: Node names `G` and `H` can be changed by specifying the tuple
 *     `['G-', 'H-']` (for example). Node `'u'` in `G` is then renamed to
 *     `'G-u'` and `'v'` in `H` is renamed to `'H-v'`.
 * @return {Graph} A union graph with the same type as G
 */

function union(G, H) {
  var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var _ref$rename = _ref.rename;
  var rename = _ref$rename === undefined ? [null, null] : _ref$rename;

  if (G.isMultigraph() !== H.isMultigraph()) {
    throw new _exceptionsJSNetworkXError2['default']('G and H must both be graphs or multigraphs');
  }

  // Union is same type as G
  var R = new G.constructor();
  R.name = 'union(' + G.name + ', ' + H.name + ')';

  // rename graph to obtain disjoint node labels
  function addPrefix(graph, prefix) {
    if (!prefix) {
      return graph;
    }
    return (0, _relabel.relabelNodes)(graph, function (n) {
      return prefix + n.toString();
    });
  }
  G = addPrefix(G, rename[0]);
  H = addPrefix(H, rename[1]);

  if (new _internalsSet2['default'](G).intersection(new _internalsSet2['default'](H)).size > 0) {
    throw new _exceptionsJSNetworkXError2['default']('The node sets of G and H are not disjoint. Use appropriate ' + '{rename: [Gprefix, Hprefix]} or use disjointUnion({G, H})');
  }

  // add nodes
  R.addNodesFrom(G.nodesIter(true));
  R.addNodesFrom(H.nodesIter(true));
  // add edges
  R.addEdgesFrom(G.isMultigraph() ? G.edgesIter(true, true) : G.edgesIter(true));
  R.addEdgesFrom(H.isMultigraph() ? H.edgesIter(true, true) : H.edgesIter(true));
  // add graph attributes
  _Object$assign(R.graph, G.graph, H.graph);

  return R;
}

/**
 * Return the disjoint union of graphs `G` and `H`.
 *
 * This algorithm forces distinct integer node labels.
 *
 * ### Notes
 *
 * A new graph is created, of the same class as `G`.  It is recommended that `G`
 * and `H` be either both directed or both undirected.
 *
 * The nodes of `G` are relabeled `0` to `numberOfNodes(G) - 1`, and the nodes
 * of `H` are relabeled `numberOfNodes(G)` to
 * `numberOfNodes(G) + numberOfNodes(H) - 1`.
 *
 * Graph, edge, and node attributes are propagated from `G` and `H` to the union
 * graph. If a graph attribute is present in both `G` and `H` the value from `H`
 * is used.
 *
 * @param {Graph} G
 * @param {Graph} H
 * @return {Graph} A union graph with the same type as G.
 */

function genUnion(G, H, _rename) {
  return (0, _internalsDelegate2['default'])('union', [G, H, _rename]);
}

function disjointUnion(G, H) {
  var R1 = (0, _relabel.convertNodeLabelsToIntegers)(G);
  var R2 = (0, _relabel.convertNodeLabelsToIntegers)(H, R1.order());
  var R = union(R1, R2);
  R.name = 'disjointUnion(' + G.name + ', ' + H.name + ')';
  _Object$assign(R.graph, G.graph, H.graph);
  return R;
}

/**
 * Return a new graph that contains only edges that exist in both `G` and `H`.
 *
 * The node set of `H` and `G` must be the same.
 *
 * ### Notes
 *
 * Attributes from the graph, nodes and edges are not copied to the new graph.
 * If you want a new graph of the intersection of `G` and `H` with the
 * attributes, (including edge data) from `G` use `removeNode()` as follows
 *
 * ```
 * var G = jsnx.pathGraph(3);
 * var H = jsnx.pathGraph(5);
 * var R = G.copy();
 * for (var n of G) {
 *   if (!H.hasNode(n)) {
 *     R.removeNode(n);
 *   }
 * }
 * ```
 *
 * @param {Graph} G
 * @param {Graph} H
 * @return {Graph} A new graph with the same types as G
 */

function genDisjointUnion(G, H) {
  return (0, _internalsDelegate2['default'])('disjointUnion', [G, H]);
}

function intersection(G, H) {
  if (G.isMultigraph() !== H.isMultigraph()) {
    throw new _exceptionsJSNetworkXError2['default']('G and H must both be graphs or multigraphs');
  }

  // create new graph
  var R = (0, _classesFunctions.createEmptyCopy)(G);
  R.name = 'Intersection of (' + G.name + ' and ' + H.name + ')';
  assertSameNodes(G, H);

  var graph = G.numberOfEdges() < H.numberOfEdges() ? G : H;
  var otherGraph = graph === G ? H : G;

  var edges = graph.isMultigraph() ? graph.edgesIter(false, true) : graph.edgesIter();
  var hasEdge = otherGraph.hasEdge;
  var addEdge = R.addEdge;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _getIterator(edges), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var e = _step.value;

      if (hasEdge.apply(otherGraph, e)) {
        addEdge.apply(R, e);
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

  return R;
}

/**
 * Return a new graph that contains the edges that exist in `G` but not in `H`.
 *
 * The node sets of `H` and `G` must be the same.
 *
 * ### Notes
 *
 * Attributes from the graph, nodes and edges are not copied to the new graph.
 * If you want a new graph of the difference of `G` and `H` with the attributes
 * (including edge data) from `G`, use `removeNodes()` as follows:
 *
 * ```
 * var G = jsnx.pathGraph(3);
 * var H = jsnx.pathGraph(5);
 * var R = G.copy();
 * for (var n of G) {
 *   if (!H.hasNode(n)) {
 *     R.removeNode(n);
 *   }
 * }
 * ```
 *
 * @param {Graph} G
 * @param {Graph} H
 * @return {Graph} A new graph with the same types as G
 */

function genIntersection(G, H) {
  return (0, _internalsDelegate2['default'])('intersection', [G, H]);
}

function difference(G, H) {
  if (G.isMultigraph() !== H.isMultigraph()) {
    throw new _exceptionsJSNetworkXError2['default']('G and H must both be graphs or multigraphs');
  }
  // create new graph
  var R = (0, _classesFunctions.createEmptyCopy)(G);
  G.name = 'Difference of (' + G.name + ' and ' + H.name + ')';
  assertSameNodes(G, H);

  var edges = G.isMultigraph() ? G.edgesIter(false, true) : G.edgesIter();
  var hasEdge = H.hasEdge;
  var addEdge = R.addEdge;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = _getIterator(edges), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var e = _step2.value;

      if (!hasEdge.apply(H, e)) {
        addEdge.apply(R, e);
      }
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

  return R;
}

/**
 * Return new graph with edges that exit in either `G` or `H` but not both.
 *
 * The node sets of `H` and `G` must be the same.
 *
 * ### Notes
 *
 * Attributes from the graph, nodes and edges are not copied to the new graph.
 *
 * @param {Graph} G
 * @param {Graph} H
 * @return {Graph} A new graph with the same types as G
 */

function genDifference(G, H) {
  return (0, _internalsDelegate2['default'])('difference', [G, H]);
}

function symmetricDifference(G, H) {
  if (G.isMultigraph() !== H.isMultigraph()) {
    throw new _exceptionsJSNetworkXError2['default']('G and H must both be graphs or multigraphs');
  }
  var R = (0, _classesFunctions.createEmptyCopy)(G);
  R.name = 'Symmetric difference of (' + G.name + ' and ' + H.name + ')';

  assertSameNodes(G, H);
  R.addNodesFrom((0, _internalsSet.symmetricDifference)(new _internalsSet2['default'](G), new _internalsSet2['default'](H)));

  var edges = G.isMultigraph() ? G.edgesIter(false, true) : G.edgesIter();
  var addEdge = R.addEdge;
  var hasEdge = H.hasEdge;
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = _getIterator(edges), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var edge = _step3.value;

      if (!hasEdge.apply(H, edge)) {
        addEdge.apply(R, edge);
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

  edges = H.isMultigraph() ? H.edgesIter(false, true) : H.edgesIter();
  hasEdge = H.hasEdge;
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = _getIterator(edges), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var edge = _step4.value;

      if (!hasEdge.apply(G, edge)) {
        addEdge.apply(R, edge);
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

  return R;
}

/**
 * Return a new graph of `G` composed with `H`.
 *
 * Composition is the simple union of the node sets and edge sets. The node sets
 * of `G` and `H` do not need to be disjoint.
 *
 * ### Notes
 *
 * It is recommended that `G` and `H` be either both directed or both
 * undirected. Attributes from `H` take precedent over attributes from `G`.
 *
 * @param {Graph} G
 * @param {Graph} H
 * @return {Graph} A new graph with the same type as G
 */

function genSymmetricDifference(G, H) {
  return (0, _internalsDelegate2['default'])('symmetricDifference', [G, H]);
}

function compose(G, H) {
  if (G.isMultigraph() !== H.isMultigraph()) {
    throw new _exceptionsJSNetworkXError2['default']('G and H must both be graphs or multigraphs');
  }

  var R = new G.constructor();
  R.name = 'compose(' + G.name + ', ' + H.name + ')';
  R.addNodesFrom(G.nodesIter(true));
  R.addNodesFrom(H.nodesIter(true));
  R.addEdgesFrom(G.isMultigraph() ? G.edgesIter(true, true) : G.edgesIter(true));
  R.addEdgesFrom(H.isMultigraph() ? H.edgesIter(true, true) : H.edgesIter(true));

  // add graph attributes
  _Object$assign(R.graph, G.graph, H.graph);

  return R;
}

function genCompose(G, H) {
  return (0, _internalsDelegate2['default'])('compose', [G, H]);
}