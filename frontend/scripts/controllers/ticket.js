'use strict';

angular.module('festivalTicketApp')
  .controller('ticket', function ($scope, $http, $window) {
    var ticket = $scope.ticket = {
      place: 'LHP',
//      name: 'TruongSinh',
//      phone: 123,
//      email: 'i@truongsinh.pro',
      red: 0,
      blue: 0,
      green: 0,
      yellow: 0,
      pink: 0,
      any: 0
    };
    $scope.submitLabel = 'Đặt vé';
    $scope.submit = function submit() {
      $scope.submitLabel = 'Đang đặt vé...';
      $scope.submitted = true;
      if (ticket.red + ticket.blue + ticket.green + ticket.yellow + ticket.pink + ticket.any < 1) {
        return $window.alert('Bạn chưa đặt vé nào cả!');
      }
      $http.put('/rest/ticket', $scope.ticket)
        .then(function (r) {
          var res = r.data;
          $scope.submitLabel = 'Đã đặt vé!';
          $window.alert('Đăng ký vé thành công, mã số của ' + ticket.name + ' là ' + res.no + '. ' +
            'Một email cũng đã được gởi đến ' + ticket.email);
        }, function (err) {
          $scope.submitted = false;
          $scope.submitLabel = 'Đặt vé';
          $window.alert('Có lỗi xảy ra ở máy chủ' + err);
        })
      ;
    };
  });
