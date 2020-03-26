/**
 * 页面顶端(TopMenu)菜单组件
 *
 * @author congshu
 * @date 2018-01-08
 */
'use strict';

angular.module('hrss.si.enterprise.directivesModule')
  .directive('hrssEnterpriseMainMenu',['AuthService', function (authService) {
    var directive = {
      templateUrl: 'modules/common/directives/menu/top/top-menu.html',
      restrict: 'E',
      scope: true,
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
.controller('hrssAgentMainMenuController', ['$scope', '$log', '$location', 'AuthService','AUTH_EVENTS',
  '$window', 'girderConfig',
  function ($scope, $log, $location, authService, AUTH_EVENTS, $window, appConfig) {
      //初始化菜单
      $scope.menus = null;

      //点击菜单时导航到指定菜单
      $scope.navigate = function (path) {
          if (path !== null) {
              $log.debug('navigating to ' + path);
              $location.path(path);
          }
      };

      //响应用户成功登录事件
      $scope.$on(AUTH_EVENTS.loginSuccess, function (event, user) {
          $log.debug('girderTopMenuController接收到loginSuccess事件', user);
          $scope.menus = authService.getMenus();
      });



    // //退出登录
    // $scope.quitLogin = function () {
    //   authService.logout().then(function(){
    //     redirectToLogin();
    //   });
    // };
    //
    // //转向重新登录
    // function redirectToLogin() {
    //   $log.debug('登出后重定向到指定界面', appConfig.logoutSuccessUrl);
    //   $window.location.href = appConfig.logoutSuccessUrl;
    // }

  }]);