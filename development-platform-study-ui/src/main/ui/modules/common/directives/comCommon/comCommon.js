/**
 *档案控件
 *
 * @author WangXG
 * @date 2018/6/4
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule')
    .directive('comcommon', [function () {
        var directive = {
            templateUrl: 'modules/common/directives/comCommon/comCommon.html',
            restrict: 'E',
            controller: 'comCommonController'
        };
        return directive;
    }])
    .controller('comCommonController', ['$scope', '$log', '$http', 'girderConfig', '$uibModal',
        function ($scope, $log, $http, appConfig, $uibModal) {

            $scope.company=$scope.userDetail;

        }])
   ;
