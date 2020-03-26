/**
 * Controller For Home Page
 */
'use strict';
angular.module('hrss.si.enterprise.loginModule')
  .controller('LoginCtrl', ['$uibModal','$log', '$scope', 'AuthService', 'selectCodeLoader', 'selectStateLoader',
    'GriderUserDetailService', '$location', 'SystemIssue', 'LoginUserGroupService', 'girderConfig', 'HRSS_APP_USER_DETAILS_CACHE', 'selectCodeService', '$q',
    function ($uibModal,$log, $scope, authService, selectCodeLoader, selectStateLoader, applyUserDetail, $location, SystemIssue, LoginUserGroupService, girderConfig, HRSS_APP_USER_DETAILS, selectCodeService, $q) {

      //首页面路径
      var HOME_PATH = '/home';
      //初始步长
      $scope.step = 0;

      var checkSrc = function () {
        //判断登陆来源
        $log.debug('loginController $location.absUrl()', $location.absUrl());
        var absUrl = $location.absUrl();
        var indexOf = absUrl.indexOf('sid=');
        if (indexOf == -1) {
          $scope.setSID("");
          LoginUserGroupService.setSID("");
        } else {
          // 获取SID
          var absUrlSub = absUrl.substring(indexOf + 4);
          var endIndex = -1;
          var endIndex0 = absUrlSub.indexOf('&');
          var endIndex1 = absUrlSub.indexOf('#');
          if (endIndex0 === -1) {
            endIndex = endIndex1;
          } else if (endIndex1 === -1) {
            endIndex = endIndex0;
          } else {
            endIndex = endIndex0 > endIndex1 ? endIndex1 : endIndex0
          }
          var sid = absUrlSub.substr(0, endIndex);
          $log.debug('loginController sid', sid);
          $scope.setSID(sid);
        }
      };
      /**载入用户详情*/
      var loadUserDetail = function () {
        LoginUserGroupService.setSID($scope.SID);
        var user = $scope.operator;
        addStep('载入用户详情');
        $log.debug('loginController 认证user...', user);

        //判断参保状态
        if (user.associatedCompanys && user.associatedCompanys.length !== 0) {
          var companyId = user.getFirstAssociatedCompany().id;
          var userinfo = applyUserDetail.loadUserDetail(companyId);
          if (user.associatedOrgs) {
            if (user.associatedOrgs.length !== 0) {
              //设置默认组
              LoginUserGroupService.setGroup(user.associatedOrgs[0]);
            }
          }
          return userinfo;
        } else {
          var deferred = $q.defer();
          var userDetail = {id: null, idNumber: user.account, name: user.name, account: {}};
          localStorage.setItem(HRSS_APP_USER_DETAILS.appUserDetailCache, JSON.stringify(userDetail));
          deferred.resolve(userDetail);
          return deferred.promise;
        }
      };


      /**设置用户详情*/
      var setUserDetail = function (userDetail) {
        addStep('设置用户详情');
        $scope.setUserDetail(userDetail);
        return userDetail;
      };

      /**加载代码表*/
      var loadCodeList = function () {
        addStep('载入系统代码表');
        return selectCodeLoader.loadCodeList();
      };

      /**设置代码表*/
      var setCodeList = function (codeList) {
        addStep('设置系统代码表');
        $scope.setCodeList(codeList);
        return codeList;
      };

      /**加载行政区划*/
      var loadStateList = function () {
        addStep('载入行政区划');
        return selectStateLoader.loadStateList();
      };

      /**设置加载行政区划*/
      var setStateList = function (stateList) {
        addStep('设置行政区划');
        $scope.setStateList(stateList);
        return stateList;
      };

      /**加载事项*/
      var loadMatterList = function () {
        addStep('载入事项');
        return SystemIssue.loadMatterList();
      };

      /**设置事项*/
      var setMatterList = function (matterList) {
        addStep('设置事项');
        $scope.setMatterList(matterList);
        return matterList;
      };

      /**载入结算期*/
      var loadIssue = function () {
        addStep('载入系统结算期');
        return SystemIssue.loadCurrentIssue();
      };

      /**设置结算期*/
      var setIssue = function (issue) {
        addStep('设置系统结算期');
        return $scope.setCurrentIssue(issue);
      };

      var loginProcess = function () {
        checkSrc();
        if (true) {//尝试登录系统
          $log.info('应用未登录，进行登录操作..');
          addStep('安全认证');
          //模拟登录操作
          authService.login()         //登录
            .then(function () {
              // $q.all([loadUserDetail().then(setUserDetail), loadCodeList().then(setCodeList), loadStateList().then(setStateList), loadIssue().then(setIssue)])
              //   .then(function () {
                  steeringPath();
              //   }).catch(
              //   function (err) {
              //     $log.error('获取单位信息失败，请重新登录！', err);
              //     var mgs = err.data && err.data.detail ? err.data.detail : '';
              //     if (mgs.indexOf('Could not send Message') != -1) {
              //         mgs = '访问社保核心业务系统网络失败。';
              //     }
              //     $scope.messageBox.showError("初始化加载失败，请稍后重试！" + mgs).then(function () {
              //       $scope.quitLogin();
              //       return;
              //     });
              //   });
            });
        } else {
          steeringPath();
        }
      };
      /**
       * 跳转路径
       */
      var steeringPath = function () {
        var singleCodeName = "";
        if ($scope.SID) {
          $log.info('LoginCtrl系统登录成功,获取到一网通办', $scope.SID);
          singleCodeName = selectCodeService.getCodeName('SID_RESOURCE', $scope.SID);
          $log.info('LoginCtrl系统登录成功,获取到一网通办,singleCodeName', singleCodeName);
          if ($scope.operator) {
            angular.forEach($scope.operator.roles, function (item) {
              if (item === "ROLE_COMPANY_NOT") {
                singleCodeName = selectCodeService.getCodeName('SID_RESOURCE', '698732712GG06208001');
              }
            })
          }
        }
        if (singleCodeName && $scope.SID !== singleCodeName) {
          $log.info('LoginCtrl系统登录成功,转向singleCodeName', singleCodeName);
          $location.path(singleCodeName);
        } else {
          $log.info('LoginCtrl系统登录成功,转向首页');
          $location.path(HOME_PATH);
        }
          // var send = {};
          // var modalInstance = $uibModal.open({
          //     templateUrl: 'modules/common/home/directives/yiqing/tipView.html',
          //     controller: 'socialTipCtrl',
          //     size: 'lg',
          //     resolve: {
          //         items: function () {
          //             return angular.copy(send)
          //         }
          //     }
          // });
      }
      /**
       * 增加操作步长
       */
      var addStep = function (msg) {
        $log.info('$scope.step=', $scope.step, 'LoginCtrl载入进度:', msg);
        if ($scope.step + 12 > 100) {
          $scope.step = 100;
        } else {
          $scope.step = $scope.step + 12;
        }
      };

      //登录系统
      loginProcess();

      //退出登录
      $scope.quitLogin = function () {
        authService.logout().then(function () {
          redirectToLogin();
        });
      };

      //转向重新登录
      function redirectToLogin() {
        $log.debug('登出后重定向到指定界面', girderConfig.logoutSuccessUrl)
          if("1"===$scope.operator.socialFlag){
              $window.location.href = '/calogin/#/caloginNoSocial';
          }else{
              $window.location.href = girderConfig.logoutSuccessUrl;
          }
      }
    }]);

