/**
 * Created by truongsinh on 1/2/14.
 */
(function () {
  'use strict';
  var sample = require('./settings.sample');
  var settings = require('./settings');

  var sampleKeyList = Object.keys(sample);
  var settingsKeyList = Object.keys(settings);

  if (sampleKeyList.length === settingsKeyList.length && sampleKeyList.every(function (u, i) {
    return u === settingsKeyList[i];
  })) {
    module.exports = settings;
  } else {
    throw new Error('Incomplete settings');
  }
})();
