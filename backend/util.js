(function () {
  'use strict';
  require('./lib');
  var config = require('./config');
  var nodemailer = require('nodemailer');
  var q = require('q');
  var doT = require('dot');
  var fs = require('fs');

// create reusable transport method (opens pool of SMTP connections)
  var smtpTransport = nodemailer.createTransport('SMTP', {
    service: config.MAIL_SERVICE,
    auth: {
      user: config.MAIL_USERNAME,
      pass: config.MAIL_PASSWORD,
    }
  });

// setup e-mail data with unicode symbols
  var mailOptionsFrom = 'Festival 2014 ✔ <festival@truongsinh.pro>';

  var emailTicketConfirmTemplate = doT.template(fs.readFileSync(__dirname + '/template/ticketconfirm.html'));

  var exports = module.exports = {
    /**
     *
     * @param {Object} mailOptions
     * @param {String} mailOptions.to
     * @param {String} mailOptions.subject
     * @param {String} mailOptions.html HTML body
     * @returns {promise}
     */
    sendmail: function sendmail(mailOptions) {
      var d = q.defer();
      mailOptions.from = mailOptionsFrom;
      // send mail with defined transport object
      smtpTransport.sendMail(mailOptions, function (err) {
        if (err) {
          return d.reject(err);
        }
        return d.resolve();
      });
      return d.promise;
    },
    /**
     *
     * @param {Object} c
     * @param {String} c.email
     * @param {String} c.name
     * @param {String} c.place
     * @param {Number} c.no
     * @param {Number} c.total
     * @param {Number} c.money
     * @returns {promise}
     */
    sendTicketConfirmEmail: function sendTicketConfirmEmail(c) {
      var context = {
        to: c.name + ' <' + c.email + '>',
        subject: 'Xác nhận đặt vé ✔',
        html: emailTicketConfirmTemplate(c)
      };
      return exports.sendmail(context);
    }
  };
})();
