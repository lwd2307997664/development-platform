/**
 * Created by y_zhang.neu on 2015/9/24
 * function：
 * 1.password modify controller
 * 2.password modify service
 */
'use strict';
angular.module('hrss.si.enterprise.simisModule')
  .controller('PasswordModifyCtrl', ['$scope', 'CaptchaService', 'passwordService', '$log', 'messageBox', 'passwordChangeDialog', '$uibModalInstance', 'Session',
    function ($scope, CaptchaService, passwordService, $log, messageBox, passwordChangeDialog, $uibModalInstance, Session) {
      $scope.init = function () {
        $scope.tabs = {modify: true, info: false};
        $scope.pwdChangeDetails = {oldPassword: null, newPassword: null};
        $scope.operator = Session.getUser();
        $scope.userChangeDetails = {
          name: $scope.operator.name,
          idNumber: $scope.operator.idNumber,
          mobile: $scope.operator.mobile
        };
        $scope.MobileDTO = {};
        $scope.MobileInfo ={};
        $scope.getCaptcha();
      }
      //图形验证码
      $scope.captcha = {
        'captchaUrl': '',
        'captchaId': '',
        'captchaWord': ''
      };

      $scope.getCaptcha = function () {
        CaptchaService.getNextCaptcha().$promise.then(function (data) {
          $log.info('loginCtrl获取到验证码', data.id);
          $scope.captchaUrl = data.getImageUrl() + "?" + Math.random();
          $scope.captcha.captchaId = data.id;
        });
      };


      /**
       *密码修改确认
       */
      $scope.confirmChangePassword = function () {
        if (!$scope.pwdChangeDetails.oldPassword) {
            messageBox.showInfo('请输入原密码');
            return;
        }
          if (!$scope.pwdChangeDetails.newPassword) {
              messageBox.showInfo('密码不合法，请输入8位到15位的密码，至少包含数字、字母和特殊字符中的两项！');
              return;
          }
          //重复密码
          if (angular.element('#pwdConfirm').val() !== $scope.pwdChangeDetails.newPassword) {
              messageBox.showInfo('设置密码与重复密码不匹配');
              return;
          }
          if ($scope.pwdChangeDetails.oldPassword === $scope.pwdChangeDetails.newPassword) {
              messageBox.showInfo('新密码不能和原密码相同！');
              return;
          }

        if (!$scope.captcha.captchaWord) {
          messageBox.showInfo('请输入验证码');
          return;
        }
        var MobileInfo = {};
        MobileInfo.captchaId = $scope.captcha.captchaId;
        MobileInfo.captchaWord = $scope.captcha.captchaWord;
        passwordService.changePassword($scope.pwdChangeDetails, MobileInfo).then(function (rs) {
          $log.debug('PasswordModifyCtrl', rs);
          if (rs.data.result) {
            $uibModalInstance.dismiss('cancel');
            messageBox.showInfo('密码修改成功');
          } else {
            if (rs.data.message) {
              messageBox.showInfo('密码修改失败' + rs.data.message);
            } else {
              messageBox.showInfo('密码修改失败');
            }
          }

        }, function (err) {
          $log.error('PasswordModifyCtrl', err);
          messageBox.showInfo('密码修改失败');
        });
      };

      /**
       *信息修改确认
       */
      $scope.confirmChangeInfo = function () {
        if (!$scope.captcha.captchaWord) {
          messageBox.showInfo('请输入验证码');
          return;
        }
        var MobileInfo = {};
        MobileInfo.captcha = $scope.MobileInfo.captcha;
        MobileInfo.mobilenumber = $scope.userChangeDetails.mobile;
        passwordService.changeAdminInfo($scope.userChangeDetails, MobileInfo).then(function (rs) {
          $log.debug('PasswordModifyCtrl', rs);
          if (rs.data.result) {
            $uibModalInstance.dismiss('cancel');
            messageBox.showInfo('信息修改成功，请重新登陆后生效');
          } else {
            if (rs.data.message) {
              messageBox.showInfo('信息修改失败' + rs.data.message);
            } else {
              messageBox.showInfo('信息修改失败');
            }
          }

        }, function (err) {
          $log.error('PasswordModifyCtrl', err);
          messageBox.showInfo('信息修改失败');
        });
      };

      /**
       *下发短信
       */
      var INTERVALOBJ = null; //timer变量，控制时间
      var COUNT = 60; //间隔函数，1秒执行
      var CURCOUNT;//当前剩余秒数
      window.clearInterval(INTERVALOBJ);
      //短信验证码
      $scope.sendRegisterMessage = function () {
        //添加字段元素验证
        if ($scope.validateCode()) {
          return;
        } else {
          $scope.MobileDTO.title = '单位管理员密码修改';
          $scope.MobileDTO.mobile = $scope.userChangeDetails.mobile;
          // $scope.MobileDTO.webacc = $scope.companyUser.idNumber;
          $scope.MobileDTO.idNumber = $scope.userChangeDetails.idNumber;
          $scope.MobileDTO.name = $scope.userChangeDetails.name;

          $scope.BatchMsgDto = {
            msglst: [$scope.MobileDTO],
            msgType: 'Sms',
            userType: 'ENTERPRISE',
            businessType: 'Register',
            clientType: 'PC',
            systemType: 'Enterprise'
          };

          //向后台发送处理数据
          passwordService.CodePostMethod({mobile: $scope.userChangeDetails.mobile}, $scope.captcha).then(function (rs) {
            $log.debug("手机验证码发送响应", rs)
            if (!(rs.data.result)) {
              $scope.getCaptcha();
              messageBox.showInfo('手机验证码发送失败！' + rs.data.message);
            } else {
              CURCOUNT = COUNT;
              //设置button效果，开始计时
              angular.element('#btnRegisterSendCode').attr("disabled", "true");
              angular.element('#btnRegisterSendCode').val(CURCOUNT + '秒后重发');
              INTERVALOBJ = window.setInterval(
                function () {
                  if (CURCOUNT === 0) {
                    window.clearInterval(INTERVALOBJ);//停止计时器
                    angular.element('#btnRegisterSendCode').removeAttr("disabled");//启用按钮
                    angular.element('#btnRegisterSendCode').val('重新发送');
                    angular.element('#registerMobileNumber').removeAttr("disabled");
                    $scope.getCaptcha();
                  }
                  else {
                    CURCOUNT--;
                    angular.element('#btnRegisterSendCode').val(CURCOUNT + '秒后重发');
                    angular.element('#registerMobileNumber').attr('disabled', 'true');
                  }
                }, 1000); //启动计时器，1秒执行一次
            }
          }, function (err) {
            $scope.getCaptcha();
            if (err.data.hasOwnProperty('detail')) {
              messageBox.showInfo('手机验证码发送失败！' + err.data.detail);
            } else if (err.data.hasOwnProperty('message')) {
              messageBox.showInfo(err.data.message);
            } else {
              messageBox.showInfo('手机验证码发送失败！');
            }
          });
        }
      };
      //发送手机验证码之前进行验证
      $scope.validateCode = function () {
        // if (undefined === $scope.companyUser.name || 1 > $scope.companyUser.name.length) {
        //   messageBox.showInfo('请输入单位名称！');
        //   return true;
        // }
        // //证件号码
        // if ($scope.registerForm.idNumber.$invalid) {
        //   if (null === $scope.registerForm.idNumber.$viewValue || '' === $scope.registerForm.idNumber.$viewValue) {
        //     messageBox.showInfo('请输入统一社会信用代码！');
        //   } else {
        //     messageBox.showInfo('请输入正确位数的证件号码！');
        //   }
        //   return true;
        // }
        // if (undefined === $scope.MobileInfo.mobilenumber || 11 > $scope.MobileInfo.mobilenumber.length) {
        //   messageBox.showInfo('请输入正确位数的手机号码！');
        //   return true;
        // }
        // if (!$scope.validatePhone()) {
        //   messageBox.showInfo('手机号码不合法，请修改！');
        //   return true;
        // }
        // if (undefined === $scope.captcha.captchaWord || '' === $scope.captcha.captchaWord) {
        //   messageBox.showInfo('请输入图形验证码！');
        //   return true;
        // }
        return false;
      };

    }])

  .factory('passwordService', ['$log', '$http', 'girderConfig', function ($log, $http, girderConfig) {
    var factory = {};
    var passwordURL = '/api/security/password';
    factory.changePassword = function (pwdChangeDetails, mobileInfo) {
      $log.info('PasswordModifyCtrl密码修改', pwdChangeDetails);
      return $http({method: 'PUT', url: passwordURL, headers: mobileInfo, data: pwdChangeDetails});
    };
    var adminInfoURL = '/api/security/adminInfo';
    factory.changeAdminInfo = function (userChangeDetails, mobileInfo) {
      $log.info('PasswordModifyCtrl信息修改', userChangeDetails);
      return $http({method: 'PUT', url: adminInfoURL, headers: mobileInfo, data: userChangeDetails});
    };
    //发送短信URL
    var SEND_MOBILE_CODE_URL = '/uaa/' + 'captcha/sm/code';
    //发送密码重置短信获得验证码
    factory.CodePostMethod = function (MobileDTO, captcha) {
      return $http({method: 'POST', url: SEND_MOBILE_CODE_URL, headers: captcha, data: MobileDTO});
    };
    return factory;
  }])

  .factory('passwordChangeDialog', ['$log', '$uibModal', function ($log, $uibModal) {
    var factory = {};
    factory.showDialog = function () {
      var modalInstance = $uibModal.open({
        templateUrl: 'modules/common/unemp/views/passwordModify.html',
        controller: 'PasswordModifyCtrl',
        resolve: {
          // operator: $scope.operator
        }
      });
      modalInstance.opened.then(function () {//模态窗口打开之后执行的函数
        $log.info('密码修改modal is opened');
      });
      modalInstance.result.then(function (result) {
        $log.info('模式窗口Result', result);
      }, function (reason) {
        console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel
        // $log.info('Modal dismissed at: ' + new Date($scope.operator.serverDateTime));
      });
    };
    return factory;
  }]);
