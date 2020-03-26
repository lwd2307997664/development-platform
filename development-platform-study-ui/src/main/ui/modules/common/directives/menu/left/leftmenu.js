/**
 * 页面顶端(TopMenu)菜单组件
 *
 * @author congshu
 * @date 2018-01-08
 */
'use strict';

angular.module('hrss.si.enterprise.directivesModule')
    .directive('hrssEnterpriseLeftMainMenu', ['AuthService', function (authService) {
        var directive = {
            templateUrl: 'modules/common/directives/menu/left/left-menu.html',
            restrict: 'E',
            scope: {
                toggleLeft: '&'
            },
            controller: 'hrssAgentMainMenuController',
            //F5以后重新载入菜单
            link: function link(scope) {
                if (authService.isAuthenticated()) {
                    //scope.isAuthenticated()) {
                    scope.menus = authService.getMenus();
                }
            }
        };
        return directive;
    }])
    .controller('hrssAgentMainMenuController', ['$scope', '$log', '$location', 'AuthService', 'AUTH_EVENTS',
        '$window', 'girderConfig', '$rootScope',
        function ($scope, $log, $location, authService, AUTH_EVENTS, $window, appConfig, $rootScope) {
            //初始化菜单
            $scope.quickLaunchs = [
                {id: '0', path: '/home', label: '首页'},
                {id: '1', path: '/company', label: '单位业务'},
                {id: '2', path: '/declare/on', label: '在职人员业务'},
                {id: '3', path: '/declare/off', label: '退休人员业务'},
                {id: '4', path: '/search', label: '查询打印'},
                {id: '5', path: '/review/reviewed', label: '办理进度查询'}//,
                // {id: '6', path: '/oneNet2', label: '一网通办'}
            ];
            var absUrl = $location.absUrl();
            absUrl.indexOf('sid=') !== -1 && $scope.quickLaunchs.push({id: '6', path: '/oneNet2', label: '一网通办'});
            //本月无变更btn访问
            $scope.goShortcut = function (path) {
                $log.debug('快捷键路径path', path);
                $location.replace();
                $location.path(path);
            };

            //响应用户成功登录事件
            $scope.$on(AUTH_EVENTS.loginSuccess, function (event, user) {
                $log.debug('girderTopMenuController接收到loginSuccess事件', user);
                $scope.menus = authService.getMenus();
            });

            /**
             * fixme
             * changed by jiachw
             * 优化切换路由，左侧导航栏状态保持问题
             * */
            $rootScope.$on('$routeChangeStart', function (event, next, current) {
                if (!next.hasOwnProperty('$$route') || !current.hasOwnProperty('$$route')) {
                    return;
                }
                var regxRoute = /^\/login$|^\/home$/;
                var currentPath = current.$$route.originalPath;
                var nextPath = next.$$route.originalPath;
                //当前路由和将要进入路由都不是 '\login' 或 '\home'，则不进行左侧导航栏显示/隐藏变换
                if (!regxRoute.test(currentPath) && !regxRoute.test(nextPath)) {
                    return;
                }
                $scope.toggleLeft({obj: regxRoute.test(nextPath) ? 'off' : 'on'});
            });
        }]);