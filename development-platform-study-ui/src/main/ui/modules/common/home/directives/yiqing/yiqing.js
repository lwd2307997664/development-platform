/**
 * 申报统计
 *
 * @author yuanmzh
 * @date 2016-4
 */
'use strict';

angular.module('HRSSEnterpriseApp')
    /**
     * 社保弹出框控制器
     */
    .controller('socialTipCtrl', ['$scope', 'items', '$log', '$uibModalInstance',
        function ($scope, items, $log, $uibModalInstance) {

            //界面信息
            $scope.applyName = '失业稳岗补贴';
            $scope.notice = items.content;
            $scope.ifRead = false;

            $scope.confirm=function(){
                $uibModalInstance.close();
            }

            $scope.cancel=function(){
                $uibModalInstance.close();
            }
        }]);

