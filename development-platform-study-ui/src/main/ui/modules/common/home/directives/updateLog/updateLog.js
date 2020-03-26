/**
 * 待提交业务管理
 *
 * @author congshu
 * @date 2017-12-28
 */
'use strict';

angular.module('hrss.si.enterprise.homeModule')
  // .factory('UpdateInfoService', ['$log', '$http', function ($log, $http) {
  //   var factory = {};
  //   factory.getUpdateInfoDetail = function (date) {
  //     var path = 'modules/home/directives/updateLog/' + date + '.json';
  //     $log.debug('getUpdateInfoDetail path is ' + path);
  //     var updates = $http.get(path).then(function (resp) {
  //       $log.debug('getUpdateInfoDetail data is ' + resp.data);
  //       return resp.data;
  //     });
  //     return updates;
  //   };
  //   return factory;
  // }])
  // .filter('updateDateFormat', function () {
  //   return function (input) {
  //     var string1 = input.substring(0, 4);
  //     var string2 = input.substring(4, 6);
  //     var string3 = input.substring(6, 8);
  //     var inputString = string1 + '-' + string2 + '-' + string3;
  //     return inputString;
  //   };
  // })
  .directive('updateLog', [function () {
    var directive = {
      templateUrl: 'modules/common/home/directives/updateLog/views/updateLog.html',
      restrict: 'E',
      scope: true,
      controller: 'updateLogController'
    };
    return directive;
  }])
  //菜单控制动作
  .controller('updateLogController', ['$scope', '$log', 'messageService',
    function ($scope, $log, messageService) {
      //获取JSON详细
      $scope.updates = [];

      $scope.updateInfoDetail = function (date) {
        $log.debug('update date is ' + date);
        var modalDefaults = {
          backdrop: true,
          keyboard: true,
          modalFade: true,
          size: 'lg',
          scope: $scope,
          templateUrl: 'modules/home/directives/updateLog/views/update-info-detail.html'
        };
        UpdateInfoService.getUpdateInfoDetail(date).then(function (data) {
          $scope.updates = data;
        });
        $log.debug('updates is ' + $scope.updates);
        var modalOptions = {
          updates: $scope.updates
        };
        return messageService.showModal(modalDefaults, modalOptions);
      };

      $scope.configureData = [
        // {'date': '20150317', 'descript': '更新说明'},
        // {'date': '20150119', 'descript': '更新说明'},
        // {'date': '20141226', 'descript': '更新说明'}
      ];

    }]);

