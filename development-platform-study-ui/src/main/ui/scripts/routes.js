'use strict';
// scripts/insure.js
angular.module('HRSSEnterpriseApp').config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'modules/common/home/views/home.html',
            controller: 'HomeCtrl'
        })
        .when('/login', {
            templateUrl: 'modules/common/login/login.html',
            controller: 'LoginCtrl'
        })
        //---------------默认路由
        .otherwise({
            redirectTo: '/login'
        });
}]);


angular.module('HRSSEnterpriseApp')
    .run(function ($log, $rootScope, Session, $location, messageBox) {
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            // 增加路由变换时权限检查,在portal下刷新恢复
            $log.log('路由变换检查', event, next);

            if (!next.hasOwnProperty('$$route')) {
                return;
            }

            if (!next.$$route || next.$$route.originalPath === '/login') {
                return;
            }

            $rootScope.isHome = next.$$route.originalPath === '/home';


            // 需要清除sessionStorage的路由列表
            var clearPathList = ['/company', '/home', '/declare/on', '/declare/off', '/submit/pending', '/submit/agent', '/review/reviewed', '/oneNet2'];

            var menusStr = JSON.stringify(Session.getMenus());

            if (menusStr && !menusStr.match("\"" + next.$$route.originalPath + "\"")) {
                messageBox.showInfo('您目前没有该业务权限! ');
                $location.path("/home");
            }

            // 清除申报缓存
            if (clearPathList.indexOf(next.$$route.originalPath) !== -1) {
                sessionStorage.clear();
            }

        });
    });

