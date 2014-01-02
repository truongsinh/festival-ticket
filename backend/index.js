/**
 * Created by truongsinh on 1/2/14.
 */
(function () {
  'use strict';
  require('./lib');
  var config = require('./config');
  var q = require('q');
  var express = require('express');
  var path = require('path');
  var util = require('./util');
  var Spreadsheet = require('edit-google-spreadsheet');

  var rootPath = path.join(__dirname, '..');
  var spreadsheetPromise = (function () {
    var d = q.defer();
    Spreadsheet.create({
      debug: false,
      username: config.GOOGLE_USERNAME,
      password: config.GOOGLE_PASSWORD,
      spreadsheetId: config.SPREADSHEET_ID,
      worksheetId: config.WORKSHEET_ID,
      callback: d.denodify
    });
    return d.promise;
  })();

  var app = express();

  app.put('/rest/ticket', express.json(), function (req, res) {
    var body = req.body;

    spreadsheetPromise
      .then(function (spreadsheet) {
        var d = q.defer();
        spreadsheet.receive(function (err, rows, info) {
          if (err) {
            d.reject(err);
            return;
          }
          var nextRow = info.nextRow;
          var sheetObject = {};
          var rowObject = sheetObject[nextRow] = {};
          rowObject[1] = nextRow - 1;
          var data = [
            body.place, // 02
            body.red,   // 03
            body.blue,  // 04
            body.green, // 05
            body.yellow,// 06
            body.pink,  // 07
            body.any,   // 08
            body.name,  // 09
            body.email, // 11
            body.phone, // 10
            body.note   // 12
          ];
          for (var i = 2; i <= 12; i++) {
            rowObject[i] = {
              name: '' + i,
              val: data[i - 2]
            };
          }
          rowObject[14] = { name: 14, val: '=SUM({{ 3 }}:{{ 8 }})'};
          rowObject[15] = { name: 15, val: '={{ 14 }}*50'};
          spreadsheet.add(sheetObject);
          spreadsheet.send({autoSize: true}, function (err) {
            if (err) {
              return d.reject(err);
            }
            var res = {
              no: rowObject[1],
              total: rowObject[3].val + rowObject[4].val + rowObject[5].val + rowObject[6].val + rowObject[7].val + rowObject[8].val,
            };
            res.money = res.total * 50000;
            return d.resolve(res);
          });
        });
        return d.promise;
      })
      .then(function success(r) {
        res.send(r);
        // no waiting
        var context = {
          email: body.email,
          name: body.name,
          place: body.place,
          no: r.no,
          total: r.total,
          money: r.money
        };
        util.sendTicketConfirmEmail(context);
      }, function (err) {
        res.send(500, err);
      })
      .done();
  });
  app.configure('production', function () {
    app.use(express.staticCache());
    app.use(express.static(path.join(rootPath, 'dist')));
  });
  app.configure('development', function () {
    app.use(express.static(path.join(rootPath, 'frontend')));
    app.use(express.static(path.join(rootPath, '.tmp')));
  });

  var PORT = Number(process.env.NODE_APP_PORT);
  if (!PORT) {
    throw new Error('no NODE_APP_PORT');
  }
  app.listen(PORT, function (err) {
    if (err) {
      throw err;
    }
    console.log('Listening on %s, environment %s', PORT, process.env.NODE_ENV);
  });
})
  ();
