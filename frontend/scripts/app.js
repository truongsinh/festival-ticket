'use strict';

angular.module('festivalTicketApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/ticket', {
        templateUrl: 'views/ticket.html',
        controller: 'ticket'
      })
      .when('/about', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/contact', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/ticket'
      });
  })
  // stupid angular currency filter
  // @todo file a bug report
  .filter('currency2', function currencyFilter($filter) {
    return function (amount, currencySymbol) {
      var raw = $filter('currency')(amount, currencySymbol);
      var raw2 = raw.split('\u00a0');
      var res = (raw2[0].split(','))[0] + ' ' + raw2[1];
      return res;
    };
  })
;
