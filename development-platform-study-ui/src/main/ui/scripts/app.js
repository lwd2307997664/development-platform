'use strict';

// Define all your modules with no dependencies
angular.module('hrss.si.enterprise.homeModule', []);//首页
angular.module('hrss.si.enterprise.loginModule', []);//登录
angular.module('hrss.si.enterprise.directivesModule', []);//自定义标签
angular.module('hrss.si.enterprise.simisModule', []);//simis 数据服务组件
angular.module('hrss.si.enterprise.resourceModule', []); //资源组件

angular.module('hrss.si.enterprise.declareModule', []);//申报管理模块
angular.module('hrss.si.enterprise.companyModule', []);//单位管理模块
angular.module('hrss.si.enterprise.employeeModule', []); //职工申报
angular.module('hrss.si.enterprise.injuryModule', []); //工伤申报
angular.module('hrss.si.enterprise.medicareModule', []); //医疗申报
angular.module('hrss.si.enterprise.searchModule', []); //查询
angular.module('hrss.si.enterprise.reportModule', []); //打印
angular.module('hrss.si.enterprise.submitModule', []); //提交申请
angular.module('hrss.si.enterprise.reviewModule', []); //审核结果

angular.module('hrss.si.enterprise.businessModule', []); //审核结果
angular.module('hrss.si.enterprise.oneNetModule', []); //一网通办


// Lastly, define your "main" module and inject all other modules as dependencies
angular.module('HRSSEnterpriseApp',
  [
    'ngRoute',
    'ngResource',
    'ngCookies',
    'ngSanitize',
    'ui.bootstrap',
    'ui.select',         //ui-select下拉代码依赖
    'ngSanitize',      //ui-select下拉代码依赖
    'ui.tree',
    'angularBootstrapNavTree',
    'angularFileUpload',
    'ui.grid',
    'ui.grid.selection',
    'ui.grid.pagination',
    'ui.grid.edit',
    'ui.grid.exporter',
    'ui.grid.cellNav',
    'ui.grid.draggable-rows',
    'ui.grid.pinning',
    // 'ui.grid.autoResize',
    'ui.mask',
    //modules for framework
    'girder',
    'ui.grid.resizeColumns',
    'toggle-switch',
    //modules for app
    'hrss.si.enterprise.directivesModule',
    'hrss.si.enterprise.loginModule',
    'hrss.si.enterprise.homeModule',
    'hrss.si.enterprise.declareModule',
    'hrss.si.enterprise.simisModule',
    'hrss.si.enterprise.resourceModule'
  ]);

//配置girder框架
angular.module('girder').config(['girderConfigProvider', function (girderConfigProvider) {
  girderConfigProvider.baseUrl = '/ehrss-si-enterprise';
  girderConfigProvider.logoutSuccessUrl = '/calogin/#/calogin';  //登出后转向路径
  girderConfigProvider.logLevel = 'ALL';
  girderConfigProvider.divisionId = 'root';
  girderConfigProvider.leaf = '80';
  girderConfigProvider.loginAndLogoutService = 'GirderPortalLoginService';
  girderConfigProvider.authServerUrl = '';
  girderConfigProvider.ssoAppId = 'ehrss-si-enterprise';
  girderConfigProvider.userDetail = {
    url: '/api/simis/companys',
    paramName: 'companyId'
  };
}]);

// UIC相关配置的provider
angular.module('girder.config')
  .value('dossierContext', 'ehrss-si-enterprise/')
  .provider('girderUicConfig', {
    //可以配置的属性
    baseUrl: 'please config baseUrl before use this frameWork', //全局后台服务路径 示例 /sipub
    $get: [function () {
      var service = {
        baseUrl: this.baseUrl
      };
      return service;
    }]
  });
//配置UIC
angular.module('girder').config(['girderUicConfigProvider', function (girderConfigProvider) {
  girderConfigProvider.baseUrl = '/uic-app';
}]);

// YWTB相关配置的provider
angular.module('girder.config')
  .provider('girderYwtbConfig', {
    //可以配置的属性
    baseUrl: 'please config baseUrl before use this frameWork', //全局后台服务路径 示例 /sipub
    $get: [function () {
      var service = {
        baseUrl: this.baseUrl
      };
      return service;
    }]
  });
//配置YWTB
angular.module('girder').config(['girderYwtbConfigProvider', function (girderConfigProvider) {
  girderConfigProvider.baseUrl = '/ywtb-app';
}]);

/**
 * 登陆操作组
 */
angular.module('girder.security.authorize.authService')
  .factory('LoginUserGroupService', ['$log', function ($log) {

    var factory = {
      group: {number: 0},
      SID: {number: 0},
      ssoSessionId: {number: 0},
    };

    factory.setGroup = function (groupData) {
      factory.group = groupData;
      localStorage.setItem('girder_group', JSON.stringify(groupData));
    };

    factory.setSID = function (SID) {
      $log.debug("保存一网通办标识" + SID)
      factory.SID.number = SID;
      localStorage.setItem('girder_sid', JSON.stringify({number: SID}));
    };

    factory.setSsoSessionId = function (SID) {
      $log.debug("setSsoSessionId" + SID)
      factory.ssoSessionId.number = SID;
      localStorage.setItem('girder_ssoSessionId', JSON.stringify({number: SID}));
    };
    //内部单位
    factory.getGroup = function () {
      var groupReturn = {};
      if (factory.group.number !== 0) {
        groupReturn = factory.group;
      } else {
        var group = localStorage.getItem('girder_group');
        if (group !== undefined && group !== null) {
          group = JSON.parse(group);
          groupReturn = group;
        }
      }
      return groupReturn;
    };
    //一网通办标识
    factory.getSID = function () {
      var groupReturn = {};
      if (factory.SID.number !== 0) {
        groupReturn = factory.SID;
      } else {
        var SID = localStorage.getItem('girder_sid');
        if (SID !== undefined && SID !== null) {
          SID = JSON.parse(SID);
          groupReturn = SID;
        }
      }
      return groupReturn;
    }
    //认证session
    factory.getSsoSessionId = function () {
      var groupReturn = {};
      if (factory.ssoSessionId.number !== 0) {
        groupReturn = factory.ssoSessionId;
      } else {
        var SID = localStorage.getItem('girder_ssoSessionId');
        if (SID !== undefined && SID !== null) {
          SID = JSON.parse(SID);
          groupReturn = SID;
        }
      }
      return groupReturn;
    };

    return factory;
  }
  ])
  // This http interceptor listens for authentication failures
  .factory('GirderSecuritySessionInjector', ['$q', '$rootScope', '$log', 'GirderUserLoginEventService', 'LoginUserGroupService', function ($q, $rootScope, $log, userLoginEvent, LoginUserGroupService) {
    var interceptor = {
      request: function (config) {
        config.headers = config.headers || {};
        // config.headers.systemType = '01 ';
        config.headers.group = LoginUserGroupService.getGroup().number;
        config.headers.SID = LoginUserGroupService.getSID().number;
        config.headers.ssoSessionId = LoginUserGroupService.getSsoSessionId().number;
        return config;
      },
      //无权限访问时要求用户重新登录
      responseError: function responseError(rejection) {
        if (rejection.status === 401) {
          $log.debug('GirderSecuritySessionInjector 401 error:', rejection);
          //发布重定向到登录页面事件
          // userLoginEvent.raiseRedirectToLoginEvent();
          $rootScope.$broadcast("auth-redirect-to-login-401", null);
          return $q.reject({data: '没有权限，请重新登录', status: 401});
        }
        return $q.reject(rejection);
      }
    };
    return interceptor;
  }]);

//集成portal需要配置cookie path
// angular.module('girder')
//   .config(['$cookiesProvider', function ($cookiesProvider) {
//     $cookiesProvider.defaults.path = '/';
//   }]);

// 配置spinner过滤清单
angular.module('girder.ui.spinner')
  .constant('GIRDER_SPINNER', {
    'URL_ARRAY': ['/api/simis/companys', '/api/apply/profile', 'ui-grid']
  });

// 重写登陆逻辑 先获取getSSoSession
angular.module('girder.security.authorize.logon').service('GirderPortalLoginService', ['$log', '$q', 'GirderAuthServerService', 'GirderUserService', 'GirderMenusService', 'GirderUserLoginEventService', 'Session', '$cookies','LoginUserGroupService', function ($log, $q, authServer, userService, menusService, loginEvent, Session, $cookies,LoginUserGroupService) {

  /**
   * Portal用户虚拟登录
   * 成功返回用户信息
   */
  this.login = function () {
    $log.debug('Portal用户登录实现-GirderPortalLoginService');
    return authServer.getSSoSession().then(function (result0) {//获取session
        var token = result0.data.ssoSessionId;
        $log.debug('GirderPortalLoginService 集成调用token', token);
      LoginUserGroupService.setSsoSessionId(token);
      return $q.all([
          userService.getUser().$promise, //获取用户信息
          menusService.getUserMenusByApp().$promise //根据应用获取用户菜单
        ]).then(function (result) {
          $log.debug('GirderPortalLoginService 集成调用', result);
          var user = result[0];
          var menus = result[1];
          $log.debug('session=' + token, 'user=', user, 'menus', menus);
          Session.create(token, user, menus);
          $log.log('登录验证成功', Session);
          loginEvent.raiseUserLoginEvent(Session.user);
          return Session.user;
        }, function (err) {
          $log.error('GirderPortalLoginService获取用户登录信息失败', err);
          if (err.status === 400) {
            loginEvent.raiseUserLoginFailedEvent('获取用户登录信息失败:' + err.data.message);
            return;
          }
          //其他未知错误
          loginEvent.raiseUserLoginFailedEvent('系统正在维护，请稍后再试..');
        })
      }, function (err) {
        $log.error('GirderPortalLoginService获取用户登录信息失败getSSoSession', err);
        if (err.status === 400) {
          loginEvent.raiseUserLoginFailedEvent('获取用户登录信息失败:' + err.data.message);
          return;
        }
        //其他未知错误
        loginEvent.raiseUserLoginFailedEvent('系统正在维护，请稍后再试..');
      }
    );
  };

  /**
   * 用户登出
   * @returns {*}
   */
  this.logout = function () {
    var account = Session.getUserAccount();
    $log.log('向服务端发起退出请求..', account);
    var sessionId = Session.getSessionId();
    //注销前台session
    Session.destroySession();
    return authServer.logoutSSO(sessionId).then(function () {
      $log.log('退出登录成功');
      loginEvent.raiseUserLogOutEvent();
    }, function (err) {
      loginEvent.raiseUserLogOutEvent();
    });
  };
}]);