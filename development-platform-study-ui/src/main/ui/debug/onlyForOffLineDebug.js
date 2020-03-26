/**
 * [仅仅开发环境使用！！！]
 *
 * 支持开发离线测试使用，构建的时候注意不要打包到正式发布的项目当中
 */
'use strict';

//配置girder框架 开发环境
angular.module('girder')
    .config(['girderConfigProvider', function (girderConfigProvider) {
        //配置日志框架
        girderConfigProvider.baseUrl = '';
        girderConfigProvider.logoutSuccessUrl = '/#enterpriseLogin';  //登出后转向路径
        girderConfigProvider.logLevel = 'ALL';               //开启所有日志
        //配置行政区划范围及叶子等级
        girderConfigProvider.divisionId = 'root';
        girderConfigProvider.leaf = '80';
        girderConfigProvider.loginAndLogoutService = 'OffLineDevLoginService'; //GirderPortalLoginService
        girderConfigProvider.authServerUrl = 'http://localhost';
        girderConfigProvider.ssoAppId = "ehrss-si-enterprise";
    }])
    .config(['girderUicConfigProvider', function (girderConfigProvider) {
        girderConfigProvider.baseUrl = '';
    }]);

// UIC相关配置的provider
angular.module('girder.config')
  .value('dossierContext','');

//集成portal测试环境需要配置cookie path，否则cookie无法写入
//非portal环境下不需要这个配置
//angular.module('girder').config(['$cookiesProvider', function ($cookiesProvider) {
//  $cookiesProvider.defaults.path = '/';
//}]);
