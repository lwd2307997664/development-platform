'use strict';
angular.module('hrss.si.enterprise.businessModule')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/business/:applyType', {
        templateUrl: 'modules/common/business/views/businessApplyModule.html',
        controller: 'BusinessApplyModuleCtrl'
      });
  }]);
