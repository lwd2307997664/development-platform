/*
 *  Author:  Erwin
 *  Create time: 2018-08-11 17:20 
 *  Description:
 */

'use strict';
angular.module('hrss.si.enterprise.directivesModule')
    .controller('childCompanyToggleCtrl', ['$log', '$scope', '$uibModalInstance', 'childCompanys',
        function ($log, $scope, $uibModalInstance, childCompanys) {
            $log.debug('childCompanys:',childCompanys);
            $scope.childCompanys = childCompanys;

            $scope.select = function (item) {
                $uibModalInstance.close(item);
            };
        }]);