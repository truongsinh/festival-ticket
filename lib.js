(function () {
  'use strict';
  var q = require('q');
  var qDefer = q.defer;
  q.defer = function () {
    var d = qDefer.apply(q, arguments);
    d.denodify = function (err, res) {
      if (err) {
        d.reject(err);
      }
      else {
        d.resolve(res);
      }
    };
    return d;
  };
  return q;
})();
