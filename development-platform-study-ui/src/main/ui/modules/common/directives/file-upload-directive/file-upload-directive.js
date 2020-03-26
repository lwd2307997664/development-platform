/**
 * 文件上传页面组件
 * --------------------
 * 使用方式
 * ------------
 * <tab heading="批量减员申报" active=tabs.upload>
 *   <div ng-controller="DimissionUploadCtrl">
 *   <sipub-file-upload
 *        upload-url = "{{uploadUrl}}"    设置上传url
 *        excel-templete="../modules/apply/person/dimission/dimission.xls"  设置报盘模板下载
 *    </div>
 *</tab>
 *
 * Created by wuyf on 2015/6/28.
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule')
//定义的时候注意开头小写
    .directive('sipubFileUpload', function () {
        return {
            restrict: 'E',
            templateUrl: 'modules/common/directives/file-upload-directive/file-upload-view.html',
            scope: {
                applyTypeValue: '=',       //APPLY_TYPE 后台资源类型
                excelTemplete: '@',        //excel 模板地址
                uploadUrl: '@',              //上传文件服务url
                matter: '='
            },
            controller: 'SipubFileUploadCtrl'
        };
    })

    /**
     * 批量报盘申报组件
     */
    .controller('SipubFileUploadCtrl', ['confirmBox','CURRENT_ISSUE', '$http', '$scope', '$log', 'FileUploader', 'messageBox', '$window',
        'APPLY_APP_EVENT', '$rootScope', 'HRSS_APP_USER_DETAILS_CACHE', 'girderConfig', 'LoginUserGroupService',
        function (confirmBox,CURRENT_ISSUE, $http, $scope, $log, FileUploader, messageBox, $window,
                  APPLY_APP_EVENT, $rootScope, HRSS_APP_USER_DETAILS_CACHE, appConfig, LoginUserGroupService) {

            // //更新apply，为电子材料
            // $scope.applyData=null;
            // 响应时间事件
            $scope.$on('empRegisterBatchHead', function (event, apply) {
                var array = $scope.uploadUrl.split('?');
                $scope.modelType = apply.modelType;
                $scope.replenishFlag = apply.replenishFlag;//是否补收标志
                $scope.matterName = apply.matterName;//机关事项
                if ($scope.modelType === '11001' || $scope.modelType === '11002') {
                    uploader.url = array[0] + '?the110or120Flag=' + $scope.modelType + '&aab034=' + $scope.replenishFlag;
                } else if ($scope.modelType === '12001' || $scope.modelType === '12002') {
                    uploader.url = array[0] + '?the110or120Flag=' + $scope.modelType + '&aab034=' + $scope.matterName;
                }
            });
            // 响应时间事件
            $scope.$on('empForInsuranceList', function (event, apply, the110or120Flag) {
                $scope.the110or120Flag = the110or120Flag;
                var array = $scope.uploadUrl.split('?');
                $log.debug("响应时间事件参数" + array[0]);
                uploader.url = array[0] + '?' + apply;
            });
            //人员分配
            $scope.$on('urlChange', function (event, newUrl) {
                $log.debug("group发生改变响应" + newUrl);
                uploader.url = newUrl;
            });

            //文件上传对象
            var uploader = $scope.uploader = new FileUploader({
                progress: '100',
                autoUpload: false,
                method: 'POST',
                queueLimit: 1,//上传文件队列大小
                url: $scope.uploadUrl,
                headers: {
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
                    group: LoginUserGroupService.getGroup().number
                }
            });
            $log.debug("上传路径" + uploader.url);
            //上传汇总情况
            $scope.uploadSummary = null;

            //如果是工资和特殊工种申报,需要从后台下载模板
            if ($scope.applyTypeValue === '1117' ||$scope.applyTypeValue === '1202' || $scope.applyTypeValue === '1203' || $scope.applyTypeValue === '1205' || $scope.applyTypeValue === '1208' || $scope.applyTypeValue === '1103' || $scope.applyTypeValue === '1110' || $scope.applyTypeValue === '1114') {
                $scope.showType = '1';
            }
            /**
             * 设置文件上传的formData单位编号
             * @param item
             */
            uploader.onBeforeUploadItem = function (item) {
                var userDetail = JSON.parse(localStorage.getItem(HRSS_APP_USER_DETAILS_CACHE.appUserDetailCache));
                var param = {companyId: userDetail.companyId};
                item.formData = [param];
            };

            /**
             * 上传成功
             * @param item
             * @param result
             */
            uploader.onSuccessItem = function (item, result) {
                $log.debug('文件上传成功返回', result);
                $scope.uploadSummary = result;
                $scope.uploadErrMsg = result.errorList;
                //如果上传成功
                if (result.total - result.errCount > 0) {
                    //发布上传申报成功事件
                    raiseFileUploadCompleteEvent(result);
                }

                messageBox.showInfo('上传文件成功，系统正在处理您提交的文件，<处理详情>列表可以查看处理进度');
            };

            /**
             * 上传失败
             * @param item
             * @param response
             */
            uploader.onErrorItem = function (item, response) {
                $log.debug('上传失败', response);
                if (response.detail) {
                    messageBox.showError('上传文件失败:' + response.detail);
                } else {
                    messageBox.showError('上传文件未能正常处理，请稍后重试!');
                }
            };

            /**
             * 文件上传操作
             */
            $scope.upload = function () {
                if ($scope.applyTypeValue === '1103') {//工资报盘情况
                    if ($scope.the110or120Flag === '2') {
                        // if (uploader.queue.length > 0) {
                        //     angular.element('#uploadButton').attr('disabled', true);
                        //     $log.debug('开始上传报盘处理', uploader.queue[0]);
                        //     uploader.queue[0].upload();
                        // }
                        messageBox.showError('申报险种范围选择【机关事业险种】的不允许网上上传信息，请到相应经办机构办理！');
                        return;
                    } else {
                        if (uploader.queue.length > 0) {
                            angular.element('#uploadButton').attr('disabled', true);
                            $log.debug('开始上传报盘处理', uploader.queue[0]);
                            uploader.queue[0].upload();
                        }
                    }
                } if ($scope.applyTypeValue === '1117') {//所属中小微企业备案
                    confirmBox.showInfo('【所属中小微企业备案】申报每个单位只能申报一次，【提交】请谨慎，确保您单位所有需要备案的人员信息都已申报?').then(function (result) {
                        if (uploader.queue.length > 0) {
                            angular.element('#uploadButton').attr('disabled', true);
                            $log.debug('开始上传报盘处理', uploader.queue[0]);
                            uploader.queue[0].upload();
                        }
                    },function (err) {
                        //否
                        angular.element('#saveButton').attr('disabled', true);
                    });


                } else {//其他情况
                    if ($rootScope.isAble === true) {//如果此单位未做过到账时间采集，上传按钮禁用
                        angular.element('#uploadButton').attr('disabled', true);
                    } else {
                        if (uploader.queue.length > 0) {
                            angular.element('#uploadButton').attr('disabled', true);
                            $log.debug('开始上传报盘处理', uploader.queue[0]);
                            uploader.queue[0].upload();
                        }
                    }
                }
            };

            /**
             * 清屏处理
             */
            $scope.reset = function () {
                $scope.uploadSummary = null;
                $scope.uploadErrMsg = [];
                uploader.clearQueue();
                //清屏
                angular.forEach(
                    angular.element('input[type="file"]'),
                    function (inputElem) {
                        angular.element(inputElem).val(null);
                    });
            };

            /**
             * 重要:因为每次选中文件都是添加到文件上传队列，因此这里需要重置文件上传队列
             */
            $scope.onFileSelect = function () {
                $log.debug('队列情况', uploader.queue);
                if (uploader.queue.length > 0) {
                    uploader.clearQueue();
                }
            };

            /**
             * 模板下载操作
             */
            $scope.downLoadTemplete = function () {
                $log.debug("业务类型applyTypeValue" + $scope.applyTypeValue);
                if ($scope.showType === '1') {
                    var userDetail = JSON.parse(localStorage.getItem(HRSS_APP_USER_DETAILS_CACHE.appUserDetailCache));
                    var url = '';
                    if ($scope.applyTypeValue === '1103') {
                        //职工工资收入申报
                        var array = uploader.url.split('?');
                        $log.debug("职工工资收入申报参数" + array[1]);
                        $http({
                            method: 'GET',
                            url: appConfig.baseUrl + '/api/apply/company/empsalaryApply/checkTotal?companyId=' + userDetail.aab001 + '&' + array[1],
                            isArray: true
                        }).success(function (total) {
                            if (total > 65500) {
                                messageBox.showError('当前单位申报人数过大，已超出网络传输限制，请到所属经办机构办理该业务!');
                                return;
                            } else {
                                var url = appConfig.baseUrl + '/api/apply/company/empsalaryApply/downloadExcel?companyId=' + userDetail.aab001 + '&' + array[1];
                                $window.open(url);
                                $http({
                                    method: 'GET',
                                    url: appConfig.baseUrl + '/api/apply/company/empsalaryApply/queryList?companyId=' + userDetail.aab001 + '&' + array[1],
                                    isArray: true
                                }).success(function (dataresult) {
                                    if (dataresult !== null && dataresult.returnForDataFlag) {
                                        if (dataresult.list !== null && dataresult.list.length !== 0) {
                                            for (var i = 0; i < dataresult.list.length; i++) {
                                                dataresult.list[i].modelType = dataresult.modelType;
                                            }
                                            $rootScope.$broadcast('modelTypeFlag', dataresult.modelType);
                                            $log.info('modelTypeFlag', dataresult.modelType);
                                            if ($scope.the110or120Flag === '2') {
                                                $rootScope.$broadcast('returnForDataFlag', false);
                                                // // 机关也可以显示啦
                                                // $rootScope.$broadcast('returnForSalaryList',dataresult.list);
                                                // $rootScope.$broadcast('returnForDataFlag',true);
                                            } else {
                                                // 广播险种变化时间事件
                                                $rootScope.$broadcast('returnForSalaryList', dataresult.list);
                                                $rootScope.$broadcast('returnForDataFlag', true);
                                            }
                                        } else {
                                            $rootScope.$broadcast('returnForDataFlag', false);
                                            messageBox.showError('未获取到单位下当前年度职工职工工资收入申报信息！');
                                            return;
                                        }
                                    }

                                }).error(function (err) {
                                    $log.debug(' error...');
                                    messageBox.showError(err.data.detail);
                                });
                            }

                        }).error(function (err) {
                            $log.debug(' error...');
                            messageBox.showError(err.data.detail);
                        });

                    }
                    if ($scope.applyTypeValue === '1117') {
                        url = appConfig.baseUrl + '/api/apply/company/enterrecord/downloadExcel?companyId=' + userDetail.aab001;
                        $window.open(url);
                    }
                    if ($scope.applyTypeValue === '1202') {
                        url = appConfig.baseUrl + '/api/apply/employee/registerApply/downloadExcel?companyId=' + userDetail.aab001 + '&modelType=' + $scope.modelType;
                        $window.open(url);
                    }
                    if ($scope.applyTypeValue === '1203') {
                        url = appConfig.baseUrl + '/api/applys/employee/dimissionApply/downloadExcel?companyId=' + userDetail.aab001;
                        $window.open(url);
                    }
                    if ($scope.applyTypeValue === '1205') {
                        url = appConfig.baseUrl + '/api/applys/employee/salaryApply/exportExcel?companyId=' + userDetail.aab001;
                        $window.open(url);
                    }
                    if ($scope.applyTypeValue === '1208') {
                        url = appConfig.baseUrl + '/api/applys/employee/specialwork/exportExcel?companyId=' + userDetail.aab001;
                        $window.open(url);
                    }
                    if ($scope.applyTypeValue === '1110') {
                        url = appConfig.baseUrl + '/api/apply/company/empPlace/exportExcel?companyId=' + userDetail.aab001;
                        $window.open(url);
                    }
                    if ($scope.applyTypeValue === '1114') {
                        url = appConfig.baseUrl + '/api/applys/combasic/empInfoCollect/exportExcel?companyId=' + userDetail.aab001;
                        $window.open(url);
                    }
                } else {
                    if ($scope.applyTypeValue === '1241') {
                        var url = "modules/business/custom/employee/injureRegister/exportEmpInjureRegister.xls";
                        $window.open(url);
                        return;
                    }
                    $window.open($scope.excelTemplete);
                }
            };

            /**
             * 广播文件上传完成事件
             * @param user
             */
            function raiseFileUploadCompleteEvent(result) {
                $rootScope.$broadcast(APPLY_APP_EVENT.fileUploadComplete, result);
            }

        }]);
