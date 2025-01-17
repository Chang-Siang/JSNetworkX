'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.findCliques = findCliques;
exports.genFindCliques = genFindCliques;
exports.findCliquesRecursive = findCliquesRecursive;
exports.genFindCliquesRecursive = genFindCliquesRecursive;
exports.graphCliqueNumber = graphCliqueNumber;
exports.genGraphCliqueNumber = genGraphCliqueNumber;
exports.graphNumberOfCliques = graphNumberOfCliques;
exports.genGraphNumberOfCliques = genGraphNumberOfCliques;
exports.numberOfCliques = numberOfCliques;
exports.genNumberOfCliques = genNumberOfCliques;
var marked0$0 = [findCliques, findCliquesRecursive].map(_regeneratorRuntime.mark);

var _internalsDelegate = require('..\\_internals\\delegate');

var _internalsDelegate2 = _interopRequireDefault(_internalsDelegate);

var _internals = require('../_internals');

/**
 * @fileoverview
 * Find and manipulate cliques of graphs.
 *
 * Note that finding the largest clique of a graph has been
 * shown to be an NP-complete problem; the algorithms here
 * could take a long time to run.
 *
 * http://en.wikipedia.org/wiki/Clique_problem
 */

// TODO: enumerate_all_cliques

/**
 * Search for all maximal cliques in a graph.
 *
 * Maximal cliques are the largest complete subgraph containing
 * a given node.  The largest maximal clique is sometimes called
 * the maximum clique.
 *
 *
 * ### Notes
 *
 * Based on the algorithm published by Bron & Kerbosch (1973) ([1][])
 * as adapted by Tomita, Tanaka and Takahashi (2006) ([2][])
 * and discussed in Cazals and Karande (2008) ([3][]).
 *
 * This algorithm ignores self-loops and parallel edges as
 * clique is not conventionally defined with such edges.
 *
 * There are often many cliques in graphs.  This algorithm can
 * run out of memory for large graphs.
 *
 * ### References
 *
 * [1] [Bron, C. and Kerbosch, J. 1973.
 *    Algorithm 457: finding all cliques of an undirected graph.
 *    Commun. ACM 16, 9 (Sep. 1973), 575-577.][1]
 * [1]: http://portal.acm.org/citation.cfm?doid=362342.362367
 *
 * [2] [Etsuji Tomita, Akira Tanaka, Haruhisa Takahashi,
 *    The worst-case time complexity for generating all maximal
 *    cliques and computational experiments,
 *    Theoretical Computer Science, Volume 363, Issue 1,
 *    Computing and Combinatorics,
 *    10th Annual International Conference on
 *    Computing and Combinatorics (COCOON 2004), 25 October 2006,
 *    Pages 28-42][2]
 * [2]: http://dx.doi.org/10.1016/j.tcs.2006.06.015
 *
 * [3] [F. Cazals, C. Karande,
 *    A note on the problem of reporting maximal cliques,
 *    Theoretical Computer Science,
 *    Volume 407, Issues 1-3, 6 November 2008, Pages 564-568][3]
 * [3]: http://dx.doi.org/10.1016/j.tcs.2008.05.010
 *
 * @see findCliquesRecursive
 *
 * @param {Graph} G
 * @return {Iterator<Array<Node>>} Iterator over member lists for each maximal
 *  clique
 */
/*eslint max-len:[1, 94]*/
'use strict';

function findCliques(G) {
  var adj, subgraph, candidates, Q, u, extU, stack, q, adjQ, subgraphQ, candidatesQ, _stack$pop, _stack$pop2;

  return _regeneratorRuntime.wrap(function findCliques$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!(G.numberOfNodes() === 0)) {
          context$1$0.next = 2;
          break;
        }

        return context$1$0.abrupt('return', []);

      case 2:
        adj = new _internals.Map((0, _internals.mapIterator)(G, function (u) {
          var neighbors = new _internals.Set(G.neighborsIter(u));
          neighbors['delete'](u);
          return (0, _internals.tuple2)(u, neighbors);
        }));
        subgraph = new _internals.Set(G);
        candidates = new _internals.Set(G);
        Q = [null];
        u = (0, _internals.max)(subgraph, function (u) {
          return candidates.intersection(adj.get(u)).size;
        });
        extU = candidates.difference(adj.get(u));
        stack = [];

      case 9:
        if (!true) {
          context$1$0.next = 35;
          break;
        }

        if (!(extU.size > 0)) {
          context$1$0.next = 25;
          break;
        }

        q = extU.pop();

        candidates['delete'](q);
        Q[Q.length - 1] = q;
        adjQ = adj.get(q);
        subgraphQ = subgraph.intersection(adjQ);

        if (!(subgraphQ.size === 0)) {
          context$1$0.next = 21;
          break;
        }

        context$1$0.next = 19;
        return Q.slice();

      case 19:
        context$1$0.next = 23;
        break;

      case 21:
        candidatesQ = candidates.intersection(adjQ);

        if (candidatesQ.size > 0) {
          stack.push([subgraph, candidates, extU]);
          Q.push(null);
          subgraph = subgraphQ;
          candidates = candidatesQ;
          /* eslint-disable no-loop-func*/
          u = (0, _internals.max)(subgraph, function (u) {
            return candidates.intersection(adj.get(u)).size;
          });
          /* eslint-enable no-loop-func*/
          extU = candidates.difference(adj.get(u));
        }

      case 23:
        context$1$0.next = 33;
        break;

      case 25:
        if (!(Q.length === 0 || stack.length === 0)) {
          context$1$0.next = 27;
          break;
        }

        return context$1$0.abrupt('break', 35);

      case 27:
        Q.pop();
        _stack$pop = stack.pop();
        _stack$pop2 = _slicedToArray(_stack$pop, 3);
        subgraph = _stack$pop2[0];
        candidates = _stack$pop2[1];
        extU = _stack$pop2[2];

      case 33:
        context$1$0.next = 9;
        break;

      case 35:
      case 'end':
        return context$1$0.stop();
    }
  }, marked0$0[0], this);
}

function genFindCliques(G) {
  return (0, _internalsDelegate2['default'])('findCliques', [G]);
}

;

/**
 * Recursive search for all maximal cliques in a graph.
 *
 * Maximal cliques are the largest complete subgraph containing
 * a given point.  The largest maximal clique is sometimes called
 * the maximum clique.
 *
 * ### Notes
 *
 * Based on the algorithm published by Bron & Kerbosch (1973) ([1][])
 * as adapted by Tomita, Tanaka and Takahashi (2006) ([2][])
 * and discussed in Cazals and Karande (2008) ([3][]).
 *
 * This algorithm ignores self-loops and parallel edges as
 * clique is not conventionally defined with such edges.
 *
 *
 * ### References
 *
 * [1] [Bron, C. and Kerbosch, J. 1973.
 *    Algorithm 457: finding all cliques of an undirected graph.
 *    Commun. ACM 16, 9 (Sep. 1973), 575-577.][1]
 * [1]: http://portal.acm.org/citation.cfm?doid=362342.362367
 *
 * [2] [Etsuji Tomita, Akira Tanaka, Haruhisa Takahashi,
 *    The worst-case time complexity for generating all maximal
 *    cliques and computational experiments,
 *    Theoretical Computer Science, Volume 363, Issue 1,
 *    Computing and Combinatorics,
 *    10th Annual International Conference on
 *    Computing and Combinatorics (COCOON 2004), 25 October 2006, Pages 28-42][2]
 * [2]: http://dx.doi.org/10.1016/j.tcs.2006.06.015
 *
 * [3] [F. Cazals, C. Karande,
 *    A note on the problem of reporting maximal cliques,
 *    Theoretical Computer Science,
 *    Volume 407, Issues 1-3, 6 November 2008, Pages 564-568][3]
 * [3]: http://dx.doi.org/10.1016/j.tcs.2008.05.010
 *
 * @param {Graph} G
 * @return {!Iterator<Array<Node>>} List of members in each maximal clique
 *
 * @see find_cliques
 */

function findCliquesRecursive(G) {
  var marked1$0, adj, Q, expand;
  return _regeneratorRuntime.wrap(function findCliquesRecursive$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        expand = function expand(subgraph, candidates) {
          var u, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, q, adjQ, subgraphQ, candidatesQ;

          return _regeneratorRuntime.wrap(function expand$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                u = (0, _internals.max)(subgraph, function (u) {
                  return candidates.intersection(adj.get(u)).size;
                });
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                context$2$0.prev = 4;
                _iterator = _getIterator(candidates.difference(adj.get(u)));

              case 6:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  context$2$0.next = 24;
                  break;
                }

                q = _step.value;

                candidates['delete'](q);
                Q.push(q);
                adjQ = adj.get(q);
                subgraphQ = subgraph.intersection(adjQ);

                if (!(subgraphQ.size === 0)) {
                  context$2$0.next = 17;
                  break;
                }

                context$2$0.next = 15;
                return Q.slice();

              case 15:
                context$2$0.next = 20;
                break;

              case 17:
                candidatesQ = candidates.intersection(adjQ);

                if (!(candidatesQ.size > 0)) {
                  context$2$0.next = 20;
                  break;
                }

                return context$2$0.delegateYield(expand(subgraphQ, candidatesQ), 't0', 20);

              case 20:
                Q.pop();

              case 21:
                _iteratorNormalCompletion = true;
                context$2$0.next = 6;
                break;

              case 24:
                context$2$0.next = 30;
                break;

              case 26:
                context$2$0.prev = 26;
                context$2$0.t1 = context$2$0['catch'](4);
                _didIteratorError = true;
                _iteratorError = context$2$0.t1;

              case 30:
                context$2$0.prev = 30;
                context$2$0.prev = 31;

                if (!_iteratorNormalCompletion && _iterator['return']) {
                  _iterator['return']();
                }

              case 33:
                context$2$0.prev = 33;

                if (!_didIteratorError) {
                  context$2$0.next = 36;
                  break;
                }

                throw _iteratorError;

              case 36:
                return context$2$0.finish(33);

              case 37:
                return context$2$0.finish(30);

              case 38:
              case 'end':
                return context$2$0.stop();
            }
          }, marked1$0[0], this, [[4, 26, 30, 38], [31,, 33, 37]]);
        };

        marked1$0 = [expand].map(_regeneratorRuntime.mark);

        if (!(G.size === 0)) {
          context$1$0.next = 5;
          break;
        }

        context$1$0.next = 5;
        return [];

      case 5:
        adj = new _internals.Map((0, _internals.mapIterator)(G, function (u) {
          var neighbors = new _internals.Set(G.neighborsIter(u));
          neighbors['delete'](u);
          return (0, _internals.tuple2)(u, neighbors);
        }));
        Q = [];
        return context$1$0.delegateYield(expand(new _internals.Set(G), new _internals.Set(G)), 't0', 8);

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, marked0$0[1], this);
}

function genFindCliquesRecursive(G) {
  return (0, _internalsDelegate2['default'])('findCliquesRecursive', [G]);
}

;

//TODO: make_max_clique_graph
//TODO: make_clique_bipartite
//TODO: project_down
//TODO: project_up

/**
 * Return the clique number (size of the largest clique) for G.
 *
 * An optional list of cliques can be input if already computed.
 *
 * @param {Graph} G graph
 * @param {Iterable=} optCliques
 * @return {number}
 */

function graphCliqueNumber(G, optCliques) {
  if (optCliques == null) {
    optCliques = findCliques(G); // eslint-disable-line no-undef
  }
  return (0, _internals.max)(optCliques, function (c) {
    return c.length;
  }).length;
}

/**
 * Returns the number of maximal cliques in G.
 *
 * An optional list of cliques can be input if already computed.
 *
 * @param {Graph} G graph
 * @param {Iterable=} optCliques
 * @return {number}
 */

function genGraphCliqueNumber(G, optCliques) {
  return (0, _internalsDelegate2['default'])('graphCliqueNumber', [G, optCliques]);
}

function graphNumberOfCliques(G, optCliques) {
  if (optCliques == null) {
    optCliques = findCliques(G); // eslint-disable-line no-undef
  }
  return _Array$from(optCliques).length;
}

//TODO: node_clique_number

/**
 * Returns the number of maximal cliques for each node.
 *
 * Returns a single or list depending on input nodes.
 * Optional list of cliques can be input if already computed.
 *
 * @param {Graph} G graph
 * @param {Iterable=} optNodes List of nodes
 * @param {Iterable=} optCliques List of cliques
 * @return {!(Map|number)}
 */

function genGraphNumberOfCliques(G, optCliques) {
  return (0, _internalsDelegate2['default'])('graphNumberOfCliques', [G, optCliques]);
}

function numberOfCliques(G, optNodes, optCliques) {
  optCliques = _Array$from(optCliques || findCliques(G)); // eslint-disable-line no-undef

  if (optNodes == null) {
    optNodes = G.nodes(); // none, get entire graph
  }

  var numcliq;
  if (!Array.isArray(optNodes)) {
    var v = optNodes;
    numcliq = optCliques.filter(function (c) {
      return new _internals.Set(c).has(v);
    }).length;
  } else {
    optCliques = optCliques.map(function (c) {
      return new _internals.Set(c);
    });
    numcliq = new _internals.Map();
    optNodes.forEach(function (v) {
      numcliq.set(v, optCliques.filter(function (c) {
        return c.has(v);
      }).length);
    });
  }
  return numcliq;
}

//TODO: cliques_containing_node

function genNumberOfCliques(G, optNodes, optCliques) {
  return (0, _internalsDelegate2['default'])('numberOfCliques', [G, optNodes, optCliques]);
}

/*jshint ignore:start*/

/*jshint ignore:end*/

// eslint-disable-line no-unused-expressions
// eslint-disable-line no-unused-expressions