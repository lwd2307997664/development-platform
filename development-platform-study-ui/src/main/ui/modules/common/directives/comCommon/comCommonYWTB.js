/**
 *档案控件
 *
 * @author WangXG
 * @date 2018/6/4
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule')
    .directive('comcommonywmb', [function () {
        var directive = {
            templateUrl: 'modules/common/directives/comCommon/comCommonYWTB.html',
            restrict: 'E',
            controller: 'comCommonYWTBController'
        };
        return directive;
    }])
    .controller('comCommonYWTBController', ['$scope', '$log', '$http', 'girderConfig', '$uibModal',
        function ($scope, $log, $http, appConfig, $uibModal) {

            $scope.company=$scope.userDetail;

        }])
   ;
