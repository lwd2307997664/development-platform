/**
 *@expression 左侧导航栏控制
 *@author jiachw
 *@Date   create in 2019/06/26
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule')
    .directive('leftMenuController', [function () {
        return {
            restrict: 'E',
            scope: {
                isExpand: '=',
                toggleLeft: '&'
            },
            templateUrl: 'modules/common/directives/menu/menuController/menu-controller.html',
            controller: 'menuControllerCtrl'
        }
    }])
    .controller('menuControllerCtrl', ['$scope', '$location', function ($scope, $location) {
        //根据当前页面路由判断 控制按钮是否渲染
        $scope.rendered = ($location.path() !== '/home' && $location.path() !== '/login');

        $scope.switchToggle = function () {
            $scope.toggleLeft({obj: $scope.isExpand ? 'off' : 'on'});
        };
        //检测路由变换
        $scope.$on('$routeChangeStart', function (event, next, current) {
            if (next.hasOwnProperty('$$route')) {
                var nextPath = next.$$route.originalPath;
                $scope.rendered = !(nextPath === '/login' || nextPath === '/home');
            }
        });
    }]);