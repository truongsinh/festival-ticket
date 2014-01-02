(function () {
  'use strict';


  var doT = require('dot');
  var templateSettings = doT.templateSettings;
  templateSettings.interpolate = /\{\{([\s\S]+?)\}\}/g;
  templateSettings.evaluate = /\{%([\s\S]+?)%\}/g;
  templateSettings.varname = 'ticket';
  //usage: {? condition ?} if {???} else {??}
  templateSettings.conditional = /\{\?(\?)?\s*([\s\S]*?)\s*\?\}/g;


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
})();
