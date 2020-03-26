/**
 * Created by y_zhang.neu on 2015/11/5.
 * 个人中心相关服务
 */
'use strict';
angular.module('hrss.si.enterprise.simisModule')
  .factory('loginFormService', ['$http', '$resource', '$log', function ($http, $resource, $log) {
    var FACTORY = [];
    //重置密码URL
    var REST_PASSWORD_URL = '/api/security/ws/password/reset';


    //密码重置验证码
    var codeResource = $resource(SEND_MOBILE_CODE_URL, {mobilenumber: '@mobilenumber'},
      {
        CodePost: {method: 'POST', param: {mobilenumber: 0}, isArray: true}
      });
    //密码重置发送短信获得验证码
    FACTORY.CodePostMethod = function (mobilenumber) {
      $log.info('发送短信传参', mobilenumber);
      return codeResource.CodePost({mobilenumber: mobilenumber});
    };
    //密码重置
    FACTORY.restPasswordMethod = function (passWordResetDetailDTO, mobileInfo) {
      //向PUT请求中定义headers
      return $http({method: 'PUT', url: REST_PASSWORD_URL, headers: mobileInfo, data: passWordResetDetailDTO});
    };
    //手机号码修改
    FACTORY.modifyMobileMethod = function (mobileDetails, mobileInfo) {
      //向PUT请求中定义headers
      return $http({method: 'PUT', url: MOBILE_MODIFY_URL, headers: mobileInfo, data: mobileDetails});
    };
    //进行实名认证，处理了平行权限
    FACTORY.doAuthed = function (RealNameAuthedDTO) {
      return $http({method: 'PUT', url: REAL_NAME_AUTHED_URL, data: RealNameAuthedDTO});
    };
    return FACTORY;
  }])
  //验证码服务类
  .factory('CaptchaService', ['$log', '$resource',
    function ($log, $resource) {
      //验证码地址
      var url = '/uaa/captcha/img';
      var Resource = $resource(url, {}, {
        getCaptcha: {
          method: 'GET',
          url: url,
          isArray: false
        }
      });
      Resource.prototype.getImageUrl = function () {
        return url + '/' + this.id;
      };
      //定义工厂对象
      var factory = {
        //
      };
      /**
       * 获取下一个验证码
       * 返回对象{id,url}
       */
      factory.getNextCaptcha = function () {
        return Resource.getCaptcha();
      };
      return factory;
    }]);
