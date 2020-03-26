/**
 * 申报快捷通道组件
 *
 * Created by congshu on 2018/1/10.
 */
'use strict';

angular.module('hrss.si.enterprise.homeModule')
    .directive('quickLaunch', [function () {
        var directive = {
            templateUrl: 'modules/common/home/directives/quickLaunch/quickLaunch.html',
            restrict: 'AE',
            scope: {
                menutype: '=menutype'
            },
            controller: 'quickLaunchController'
        };
        return directive;
    }])
    //菜单控制动作
    .controller('quickLaunchController', ['$scope', '$log', '$location', 'messageService', 'quickLaunchService', 'AuthService',
        function ($scope, $log, $location, messageService, quickLaunchService, authService) {
            $scope.initMenu = function () {
                //查询初始化配置
                $scope.quickLaunchs = [
                    {id: '1', path: '/company', label: '单位业务'},
                    {id: '2', path: '/declare/on', label: '在职人员业务'},
                    {id: '3', path: '/declare/off', label: '退休人员业务'},
                    {id: '4', path: '/search', label: '查询打印'},
                    {id: '5', path: '/review/reviewed', label: '办理进度查询'}
                ];
                var absUrl = $location.absUrl();
                absUrl.indexOf('sid=') !== -1 && $scope.quickLaunchs.push({id: '6', path: '/oneNet2', label: '一网通办'});
            };
            var getQuickLaunch = function (partyType, partyId, menutype) {
                quickLaunchService.getQuickLaunch(partyType, partyId, menutype).$promise.then(function (data) {
                    $scope.data = data;
                    $scope.quickLaunchList = data.children;
                    $log.debug('查出菜单', $scope.quickLaunchList);
                    //获取labe、path等信息
                    $scope.quickLaunchs = [];
                    var cycleMenu = function (id, menudata, checkdata) {
                        angular.forEach(menudata, function (data) {
                            // $scope.declarechilds=data.children;
                            angular.forEach(data.children, function (child, index) {
                                if (child.id === id) {
                                    var childId = '#' + id;
                                    checkdata.push(data.children[index]);
                                }
                            });
                        });
                    };
                    angular.forEach($scope.quickLaunchList, function (item) {
                        cycleMenu(item.id, $scope.professions, $scope.quickLaunchs);
                    });
                    $log.debug('匹配的菜单', $scope.quickLaunchs);
                });
            };
            //本月无变更btn访问
            $scope.goShortcut = function (path) {
                $log.debug('快捷键路径path', path);
                $location.replace();
                $location.path(path);
            };
            $scope.addQuickLaunch = function () {
                var modalDefaults = {
                    backdrop: true,
                    scope: $scope,
                    keyboard: true,
                    modalFade: true,
                    size: 'lg',
                    templateUrl: 'modules/common/home/directives/quickLaunch/quickLaunchView.html',
                    controller: 'quickLaunchCtrl'
                };
                var modalOptions = {
                    // declaresMenu: $scope.declares
                    // personType: $scope.person.personType,
                    // eventId: $scope.person.id
                };
                messageService.showModal(modalDefaults, modalOptions).then(function (data) {
                });
            };
        }])
    .controller('quickLaunchCtrl', ['$scope', '$log', 'modalOptions', '$uibModalInstance', '$timeout', 'messageBox', 'quickLaunchService',
        function ($scope, $log, modalOptions, $uibModalInstance, $timeout, messageBox, quickLaunchService) {
            $scope.modalOptions = modalOptions;
            //取消
            $scope.modalOptions.close = function () {
                $uibModalInstance.dismiss('cancel');
            };
            $scope.toggle = function (scope) {
                scope.toggle();
            };

            //初始化
            $timeout(function () {
                $log.debug('菜单', $scope.quickLaunchs);
                angular.forEach($scope.quickLaunchs, function (item) {
                    var itemid = '#' + item.id;
                    angular.forEach($scope.professions, function () {
                        angular.element(itemid).prop('checked', true);
                        $log.debug('checked', itemid);
                    });
                });
            }, 500);
            //获取快捷菜单index
            $scope.itemindex = null;
            $scope.getitemIndex = function (itemId) {
                angular.forEach($scope.quickLaunchs, function (item, index) {
                    if (itemId === item.id) {
                        $log.debug('选中的脚标', index);
                        $scope.itemindex = index;
                    }
                });
            };
            //选择业务
            $scope.checkthis = function (event, id) {
                var ida = '#' + id;
                var item = angular.element(ida).scope().$modelValue;
                var checked = event.target.checked;
                if (checked) {
                    $scope.quickLaunchs.push(item);
                } else {
                    $scope.getitemIndex(id);
                    $scope.quickLaunchs.splice($scope.itemindex, 1);
                }
            };
            // $scope.checkQuickLaunchs = function () {
            //     if ($scope.quickLaunchs.length > 9) {
            //         messageBox.showInfo('最多只能配置九项快捷菜单');
            //         return;
            //     }
            // };
            //删除业务
            $scope.deletecheck = function (id) {
                var idx = '#' + id;
                angular.forEach($scope.professions, function () {
                    angular.element(idx).prop('checked', false);
                });
                $scope.getitemIndex(id);
                $scope.quickLaunchs.splice($scope.itemindex, 1);
            };
            //提交配置
            $scope.updateQuickLaunch = function () {
                if ($scope.quickLaunchs.length > 9) {
                    messageBox.showInfo('最多只能配置九项快捷菜单');
                    return;
                }
                $scope.data.children = [];
                $log.debug('获取全部', $scope.data);
                angular.forEach($scope.quickLaunchs, function (data) {
                    $scope.data.children.push(data.id);
                })
                $log.debug('修改全部', $scope.data);
                var postData = $scope.data;
                quickLaunchService.updateQuickLaunch(postData).$promise.then(function (data) {
                    $log.debug('保存成功', data);
                    messageBox.showInfo('保存成功！');
                }, function (err) {
                    messageBox.showError('提交失败');
                });
            };
        }]);

