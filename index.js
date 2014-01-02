/**
 * Created by truongsinh on 1/2/14.
 */
(function () {
  'use strict';
  require('./lib');
  var config = require('./config');
  var q = require('q');
  var express = require('express');
  var Spreadsheet = require('edit-google-spreadsheet');

  var spreadsheetPromise = (function () {
    var d = q.defer();
    Spreadsheet.create({
      debug: true,
      username: config.GOOGLE_USERNAME,
      password: config.GOOGLE_PASSWORD,
      spreadsheetId: config.SPREADSHEET_ID,
      worksheetId: config.WORKSHEET_ID,
      callback: d.denodify
    });
    return d.promise;
  })();

  var data = [1,2,4,8,16,32,64,128,256,512,1024,2048,4096, 5000, 6000, 7000];
  spreadsheetPromise
    .then(function (spreadsheet) {
      var d = q.defer();
      spreadsheet.receive(function (err, rows, info) {
        if (err) {
          d.reject(err);
          return;
        }
        console.log(rows);
        var nextRow = info.nextRow;
        var sheetObject = {};
        var rowObject = sheetObject[nextRow] = {};
        rowObject[1] = nextRow - 1;
        for( var i = 2; i <= 12; i++){
          rowObject[i] = {
            name: '' + i,
            val: data[i-2]
          };
        }
        rowObject[14] ={ name: 14, val: '=SUM({{ 3 }}:{{ 8 }})'};
        rowObject[15] ={ name: 15, val: '={{ 14 }}*50'};
        console.log(sheetObject);
        spreadsheet.add(sheetObject);
        spreadsheet.send({autoSize: true}, d.denodify);
      });
      return d.promise;
    })
    .then(function success(){
      console.log('scc');
    }, function(err){
      console.log('err', err);
    })
    .done();

  var app = express();

  app.get('/', function(req, res){
    res.send('hello world');
  });

  app.listen(3000);
})();
