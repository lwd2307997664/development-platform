'use strict';
angular.module('hrss.si.enterprise.submitModule')
  .controller('ApplyDataDetailCtrl', ['$scope', '$log', '$timeout', function ($scope, $log, $timeout) {
    $log.debug('readonly', $scope.modalOptions.readonly);
    $scope.onlyRead = function () {
      $log.debug('加载完毕');
      $scope.apply=$scope.modalOptions.applyEventInfo;
      $scope.applyData=$scope.apply;
      $log.debug('ApplyDataDetailCtrl $scope.apply',$scope.apply);
      if ($scope.modalOptions.readonly) {

      }
    };
  }]);
