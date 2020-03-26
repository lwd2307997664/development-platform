/**
 * 公司信息组件
 *
 * @author yuanmzh
 * @date 2015-11-04
 */
'use strict';
angular.module('hrss.si.enterprise.homeModule')
    .directive('companyProfile', [function () {
        var directive = {
            templateUrl: 'modules/common/home/directives/companyProfile/companyProfile.html',
            restrict: 'E',
            scope: {
                operator: '=',
                isHome: '=',
                userDetail: '='
            },
            controller: 'companyProfileController'
        };
        return directive;
    }])
    //菜单控制动作
    .controller('companyProfileController', ['$scope', 'CURRENT_ISSUE', '$log', '$location', 'homeService', 'AuthService', 'LoginUserGroupService',
        function ($scope, CURRENT_ISSUE, $log, $location, homeService, AuthService, LoginUserGroupService) {

            // 是否初始化完成
            var isInitComplete = false;

            $scope.companyName = null;

            //信息修改跳转
            $scope.goShortcut = function (path) {
                $log.debug('快捷键路径path', path);
                $location.replace();
                $location.path(path);
            };

            $scope.manageOption = [
                {name: '操作员管理', path: '/manage/operator', iconClass: ''},
                {name: '内部单位管理', path: '/manage/subCompany', iconClass: ''},
                {name: '人员内部分配', path: '/manage/groupPerson', iconClass: ''},
                {name: '人员内部调动', path: '/manage/groupPersonManage', iconClass: ''}
            ];


            /**
             * 初始化
             * @param users
             */
            var init = function (users) {
                // 是否已经初始化
                if (isInitComplete) {
                    return;
                }
                //  当前userDetail是否存在
                if (!users) {
                    return;
                }
                var companyName = users.aab004;
                if (LoginUserGroupService.getSID().number && LoginUserGroupService.getSID().number !== 0) {
                    companyName = companyName + " 【一网通办认证】";
                } else if ($scope.operator && $scope.operator.loginChannel === '1') {
                    companyName = companyName + " 【CA认证】";
                } else if ($scope.operator && $scope.operator.loginChannel === '2') {
                    companyName = companyName + " 【免数字证书认证】";
                } else {
                    companyName = companyName;
                }

                $scope.companyName = companyName;

                $scope.companyId = users.companyId;
                if (!$scope.companyId) {
                    return;
                }
                homeService.queryActualInfo($scope.companyId).$promise.then(function (data) {
                    $scope.unSubmit = data.unSubmit;
                    $scope.approve = data.approve;
                    $scope.underRecheck = data.underRecheck;
                    $log.debug('companyProfile 中间栏申报统计量', data);
                }, function () {
                    // messageBox.showError('未查询到申报情况信息');
                });

                //菜单权限
                $scope.menus = AuthService.getMenus();
                $scope.hasEnterprise3 = false;
                $scope.hasEnterprise7 = false;
                angular.forEach($scope.menus, function (data) {
                    if (data.id === 'enterprise7') {
                        $scope.hasEnterprise7 = true;
                    }
                    if (data.id === 'enterprise3') {
                        $scope.hasEnterprise3 = true;
                    }
                });

                isInitComplete = true;
            };

            $scope.$watch('isHome', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    isInitComplete = false;
                    if (newVal) {
                        init($scope.userDetail);
                    }
                }
            });

            $scope.$on('loadUserDetail', function (evt, data) {
                $log.debug('接受信息组件数据加载完成', data);
                init(JSON.parse(data));
            });


        }]);
