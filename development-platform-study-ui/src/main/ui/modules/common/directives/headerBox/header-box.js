/**
 * Created by congshu on 2017/12/29.
 */
'use strict';

angular.module('hrss.si.enterprise.directivesModule')
    .directive('hrssEnterpriseHeaderBox', function () {
        var directive = {
            templateUrl: 'modules/common/directives/headerBox/header-box-view.html',
            restrict: 'E',
            scope: true,
            controller: 'hrssAgentHeaderBoxController'
        };
        return directive;
    })
    .controller('hrssAgentHeaderBoxController', ['$scope', 'CURRENT_ISSUE', '$log', '$location', 'AuthService',
        '$window', 'girderConfig', '$uibModal', '$rootScope', 'LoginUserGroupService', 'passwordChangeDialog', 'SystemIssue', '$http',
        function ($scope, CURRENT_ISSUE, $log, $location, authService, $window, appConfig, $uibModal, $rootScope, LoginUserGroupService, passwordChangeDialog, SystemIssue, $http) {

            $scope.$on('loadUserDetail', function (evt, data) {
                $scope.group = LoginUserGroupService.getGroup();
                checkVirtual(data);
                showWarnTip();
            });
            var showWarnTip = function () {
                $http({
                    url: appConfig.baseUrl + '/api/simis/banner/notice',
                    method: 'Get'
                }).success(function (res) {
                    $scope.banner = res;
                });
                // var issue = angular.fromJson(localStorage.getItem(CURRENT_ISSUE.issueCache));
                // var currentMonth = issue.systemTime.toString();
                // $scope.banner = {
                //     show: /^2019070[1-6]/.test(currentMonth),
                //     notice: '通知：由于2019年企业养老保险、机关事业养老保险退休人员调资工作正在进行中，调资完成前不能办理2019年7月业务，每月定于5日开放业务提交的网报业务本月预计延迟业务提交时间至7号，请及时关注我们恢复业务提交时间的通告。'
                // };
            };
            var checkVirtual = function (data) {
                var user = angular.fromJson(data);
                $scope.virtualAccount = user.aab002 === '1241000075836502X9';
            };
            $scope.group = LoginUserGroupService.getGroup();
            //跳转页面
            $scope.goShortcut = function (path) {
                $log.debug('快捷键路径path', path);
                $location.replace();
                $location.path(path);
            };
            //退出登录
            $scope.quitLogin = function () {
                authService.logout().then(function () {
                    redirectToLogin();
                });
            };

            //转向重新登录
            function redirectToLogin() {
                $log.debug('登出后重定向到指定界面', appConfig.logoutSuccessUrl);
                if("1"===$scope.operator.socialFlag){
                    $window.location.href = '/calogin/#/caloginNoSocial';
                }else{
                    $window.location.href = appConfig.logoutSuccessUrl;
                }
            }

            /**
             * 消息
             */
            $scope.messages = function () {
                $scope.messageBox.showInfo("无新消息");
            };

            /**
             * 切换内部单位
             * @param item
             */
            $scope.toggleChildGroup = function () {

                var modalInstance = $uibModal.open({
                    templateUrl: 'modules/common/directives/headerBox/childCompany/childCompany.html',
                    controller: 'childCompanyToggleCtrl',
                    size: 'md',
                    resolve: {
                        childCompanys: function () {
                            return $scope.operator.associatedOrgs;
                        }
                    }
                });

                modalInstance.result.then(function (item) {
                    // localStorage.setItem('girder_group', JSON.stringify(item))
                    // $rootScope.$broadcast('changeChildCompany');
                    $scope.group = item;
                    LoginUserGroupService.setGroup(item);
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });

            };

            //密码修改
            $scope.changePassword = function () {
                passwordChangeDialog.showDialog();
            };

            //标识--测试库时
            $scope.clssStyle = 'font-test_white';
            $scope.isTestFlag = false;
            //获取是否是测试环境的标识
            SystemIssue.getTestFlag().then(function (data) {

                if (data.testFlag === true) {
                    $scope.isTestFlag = true;
                    $scope.clssStyle = 'font-test_red';
                }
            });
        }])
    /**
     * 文本长度，超出省略号过滤器
     */
    .filter('textLengthSet', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');//'...'可以换成其它文字
        };
    });