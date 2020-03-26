/**
 * 应用级别的控制器，其他的控制器将会继承此控制器
 * 可以将应用级别的全局变量放到这里，而不是放到$rootScope上
 */
'use strict';
angular.module('HRSSEnterpriseApp')
    .controller('ApplicationController', ['$log', '$scope', 'Session', 'selectCodeLoader', '$location', '$timeout',
        'messageBox', 'selectStateLoader', 'GirderEnterKeyDecorativeService', 'GriderUserDetailService', 'AUTH_EVENTS', 'SystemIssue', '$rootScope', '$templateCache', 'GirderUserLoginEventService', 'girderConfig',
        function ($log, $scope, Session, selectCodeLoader, $location, $timeout, messageBox, selectStateLoader, GirderEnterKeyDecorativeService, applyUserDetail,
                  AUTH_EVENTS, SystemIssue, $rootScope, $templateCache, userLoginEvent, girderConfig) {
            // 操作员信息
            $scope.operator = {};
            // 进入时SID
            $scope.SID = "";
            //用户信息
            $scope.userDetail = {account: {}};
            //二级代码
            $scope.codeList = null;
            //行政区划
            $scope.stateList = null;
            //消息提示组件
            $scope.messageBox = messageBox;
            //结算期
            $scope.issue = null;
            //经办事项
            $scope.matterList = null;
            //获取服务端时间
            $scope.systemTime = null;
            //经办事项层级
            $scope.colOption = {name: 'name', value: 'value', child: 'child'};
            //是否显示左侧菜单
            $scope.isViewLeft = false;
            //是否为home页
            $rootScope.isHome = false;

            //在职界面保存项
            $scope.tempForOnWorkPerson =null;
            //在职界面保存项
            $scope.tempForRetirePerson =null;

            //应用程序载入初始化
            $scope.loadApp = function () {
                $log.info('应用程序初始化开始..');
                //按回车键时实现TAB键的效果
                GirderEnterKeyDecorativeService.dotab();
                //试图从cookie当中恢复session
                if (Session.restoreFromCookie()) {
                    $log.info('应用程序初始化,成功恢复session', Session);
                    $scope.setCurrentUser(Session.user);
                    // //二级代码
                    // selectCodeLoader.loadCodeList().then(function (codeList) {
                    //     $scope.setCodeList(codeList);
                    // });
                    // //行政区划
                    // selectStateLoader.loadStateList().then(function (stateList) {
                    //     $scope.setStateList(stateList);
                    // });
                    // //经办事项
                    // SystemIssue.loadMatterList().then(function (matterList) {
                    //   $scope.matterList = matterList;
                    // });
                    // //用户详情
                    // applyUserDetail.loadUserDetail().then(function (userDetail) {
                    //     $scope.setUserDetail(userDetail);
                    // });
                    //系统结算期
                    SystemIssue.loadCurrentIssue().then(function (issue) {
                        $scope.serverTime = issue.systemTime;
                        $scope.setCurrentIssue(issue);
                    });
                    checkSrc();
                } else {
                    $log.info('应用未登录，需要登录');
                    //发布重定向到登录页面事件
                    userLoginEvent.raiseRedirectToLoginEvent();
                }

                // 刷新后判断当前是否需要左侧菜单
                if ($location.path() !== '/home' && $location.path() !== '') {
                    $scope.isViewLeft = true;
                }
            };

            /**
             * 设置当前用户
             * @param user
             */
            $scope.setCurrentUser = function (user) {
                $log.info('ApplicationController设置当前用户信息', user);
                $scope.operator = user;
            };

            /**
             * 设置当前结算期
             * @param issue
             */
            $scope.setCurrentIssue = function (data) {
                $log.info('ApplicationController设置当前结算期', data);
                $scope.issue = data.issue;
                $scope.systemTime = data.systemTime;
                $scope.longTime = data.longTime;
            };

            /**
             * 获取结算期
             * @returns {null|*}
             */
            $scope.getIssue = function () {
                return $scope.issue;
            };

            /**
             * 设置当前操作员所在单位详情
             * @param 单位信息
             */
            $scope.setUserDetail = function (data) {
                $log.info('ApplicationController取得当前用户信息', data);
                $scope.userDetail = data;
                $timeout(function () {
                    // 通知信息组件数据加载完成
                    $log.debug('通知信息组件数据加载完成', data);
                    $rootScope.$broadcast('loadUserDetail', JSON.stringify(data));
                }, 100);

            };

            /**
             * 获得当前操作员单位信息
             * @return
             */
            $scope.getUserDetail = function () {
                return $scope.userDetail;
            };

            /**
             * 设置全局代码表
             * @param data
             */
            $scope.setCodeList = function (data) {
                $log.info('ApplicationController设置当前代码信息', data);
                $scope.codeList = data;
            };

            /**
             * 设置全局行政区划
             * @param data
             */
            $scope.setStateList = function (data) {
                $log.info('ApplicationController设置当前行政区划信息', data);
                $scope.stateList = data;
            };

            /**
             * 设置事项
             * @param data
             */
            $scope.setMatterList = function (data) {
                $log.info('ApplicationController设置事项信息', data);
                $scope.matterList = data;
            };

            /**
             * 获取当前用户simisID(单位ID/个人ID)
             * @returns {account|*|create.user.account}
             */
            $scope.getCurrentUserSimisID = function () {
                return $scope.userDetail.companyId;
            };
            $scope.setSID = function (sid) {
                $scope.SID = sid;
            };

            $scope.setTempForOnWorkPerson = function (tempForOnWorkPerson) {
                $scope.tempForOnWorkPerson = tempForOnWorkPerson;
            };

            $scope.setTempForRetirePerson = function (tempForRetirePerson) {
                $scope.tempForRetirePerson = tempForRetirePerson;
            };

            /**
             * 获取当前用户simisID(单位ID/个人ID)
             * @returns {account|*|create.user.account}
             */
            $scope.getCurrentUserSimisNumber = function () {
                return $scope.userDetail.aab999;
            };

            /**
             * 响应用户成功登录事件
             */
            $scope.$on(AUTH_EVENTS.loginSuccess, function (event, user) {
                $log.debug('ApplicationController接收到loginSuccess事件', user);
                $scope.setCurrentUser(user);
            });

            /**
             * 左侧菜单控制
             * @param flag
             */
            $scope.toggleLeft = function (flag) {
                console.log('左侧菜单控制:', flag);
                $scope.isViewLeft = flag === 'on';
            };
            /**
             * 获取焦点
             */
            $scope.setFocus = function (inputId) {
                document.getElementById(inputId).focus();
            };


            //监听要求用户重新登录消息
            $scope.$on("auth-redirect-to-login-401", function () {
                $log.debug('接收到要求用户重新登录通知');
                $scope.messageBox.showError("会话已过期，请重新登录。").then(function () {
                    redirectToLogin();
                });
            });


            //转向重新登录
            function redirectToLogin() {
                $log.debug('登出后重定向到指定界面', girderConfig.logoutSuccessUrl);
                if("1"===$scope.operator.socialFlag){
                    $window.location.href = '/calogin/#/caloginNoSocial';
                }else{
                    $window.location.href = girderConfig.logoutSuccessUrl;
                }
            }

            var checkSrc = function () {
                //判断登陆来源
                var absUrl = $location.absUrl();
                var indexOf = absUrl.indexOf('sid=');
                if (indexOf == -1) {
                    $scope.setSID("");
                } else {
                    //一网通办
                    // http://222.143.34.52:8002/ehrss/si/person/ui/?sid=1234&logintype=2&code=BZfLUt&state=9527#/login
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
            }
            // global setting
            $templateCache.put("girder/ui/messagebox/messageview.html", '<div class=\"modal-header\">\r\n    <h3>{{modalOptions.headerText}}</h3>\r\n</div>\r\n<div class=\"modal-body\">\r\n     <div  compiler=\"modalOptions.bodyText\"></div>\r\n</div>\r\n<div class=\"modal-footer\">\r\n    <button type=\"button\" class=\"btn\"\r\n            data-ng-click=\"modalOptions.close()\" data-ng-show=\"modalOptions.closeButtonText\">{{modalOptions.closeButtonText}}</button>\r\n    <button class=\"btn btn-success\"\r\n            data-ng-click=\"modalOptions.ok();\">{{modalOptions.actionButtonText}}</button>\r\n</div>');
        }]);
