/**
 *档案控件
 *
 * @author WangXG
 * @date 2018/6/4
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule')
    .directive('batchAttachment', [function () {
        var directive = {
            templateUrl: 'modules/common/directives/batch-attachment/batchAttachment.html',
            restrict: 'E',
            scope: {
                applyData: '=applyData',//申报数据 （batchNumber、attachmentList,matter）
                matterInit: '=matter',//申报事项(不需要了，记录在applyData)
                readOnly: '=',
                uploadUrl: '='
            },
            controller: 'batchAttachmentController'
        };
        return directive;
    }])
    .controller('batchAttachmentController', ['$scope', '$log', '$http', 'girderConfig', '$uibModal',
        function ($scope, $log, $http, appConfig, $uibModal) {
            /**
             * 页面
             */
            $scope.batchDetail = function () {
                var modalInstance = $uibModal.open({
                    backdrop: true,
                    keyboard: true,
                    modalFade: true,
                    size: 'lg',
                    templateUrl: 'modules/common/directives/batch-attachment/batchAttachmentDetail.html',
                    controller: 'batchAttachmentDetailController',
                    resolve: {
                        dossierInfo: {
                            headerText: '电子材料批量上传：',
                            applyData: $scope.applyData,
                            readOnly: $scope.readOnly,
                            uploadUrl: $scope.uploadUrl,
                            batchNumber:$scope.batchNumber
                        }
                    }
                });
                modalInstance.result.then(function () {

                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            }

        }])
    .controller('batchAttachmentDetailController', ['$rootScope','HRSS_APP_USER_DETAILS_CACHE','$scope', '$log', '$http', 'girderConfig', 'messageBox', 'SystemIssue', 'CompanyService', 'DossierService', '$uibModalInstance', 'dossierInfo', 'IMG_CHECK_UPDATE',
        function ($rootScope,HRSS_APP_USER_DETAILS_CACHE,$scope, $log, $http, appConfig, messageBox, SystemIssue, CompanyService, DossierService, $uibModalInstance, dossierInfo, IMG_CHECK_UPDATE) {
            $scope.colOption = {name: 'name', value: 'value', child: 'child'};
            $scope.dossierInfo = dossierInfo;
            $scope.readOnly = $scope.dossierInfo.readOnly;
            $scope.batchNumber = $scope.dossierInfo.applyData.batchNumber;
            $scope.uploadUrl= $scope.dossierInfo.uploadUrl;

            /**
             * 初始化/重置
             */
            $scope.init = function () {
                $scope.attachmentList = [];
                var data = {};
                if ($scope.dossierInfo && $scope.dossierInfo.applyData) {
                    data = $scope.dossierInfo.applyData;
                }
                $scope.applyId = data.applyId;
                $scope.attachmentList = data.attachmentList;
                $scope.matter = data.matter;
                if($scope.attachmentList===undefined || $scope.attachmentList===null || $scope.attachmentList.length===0){
                    $uibModalInstance.close();
                    messageBox.showInfo('此事项不需要上传材料');
                }else{
                    var flag=true;
                    angular.forEach(data.attachmentList, function (attachment) {
                        if (attachment && (attachment.type === 'SUB' || attachment && attachment.type === 'MASTER')) {
                            flag=false;
                        }
                    })

                    if(flag){
                        $uibModalInstance.close();
                        messageBox.showInfo('此事项不需要上传材料');
                    }
                }
            };


            /**
             * 确认提交
             */
            $scope.update = function () {
                $scope.$broadcast(IMG_CHECK_UPDATE.update);
            };

            /**
             * 材料上传完成回调
             */
            $scope.saveOptionData = function () {
                if ($scope.applyId === 'replenishFile') {
                    var submitOriginalDTO = {};
                    submitOriginalDTO.pid = $scope.dossierInfo.applyData.pid;
                    submitOriginalDTO.zsb001 = $scope.dossierInfo.applyData.zsb001;
                    submitOriginalDTO.attachmentList = $scope.attachmentList;
                    DossierService.submitOriginal(submitOriginalDTO).$promise.then(function (data) {
                        $uibModalInstance.close();
                        return;
                    }, function (err) {
                        messageBox.showInfo(err.data.detail + '，不允许补扫电子材料');
                        $uibModalInstance.close();
                        return;
                    });
                    return;
                }

                var attachmentList = {};
                attachmentList.applyId = $scope.applyId;
                // attachmentList.attachmentList = $scope.attachmentList;
                var failMaterials = '';
                attachmentList.attachmentList = $scope.attachmentList.map(function (item) {
                    if (item.imgDataUrl != null) {
                        var canSave = item.imgDataUrl.every(function (t) {
                            return !!t || t !== 'null';
                        });
                        if (!canSave) {
                            item.imgDataUrl = null;
                            item.page = 0;
                            failMaterials += item.name + ',';
                        }
                    }
                    return item;
                });
                if (failMaterials) {
                    messageBox.showError(failMaterials.slice(0, -1) + '上传失败，请尝试重新上传');
                }
                DossierService.update(attachmentList).$promise.then(function (data) {
                    var flag = true;
                    //更新校验电子材料是否齐全
                    if (data.attachmentList) {
                        angular.forEach(data.attachmentList, function (attachment) {
                            if (attachment && attachment.type !== 'SUB') {
                                /**
                                 * 过滤掉业务申报表
                                 */
                                if (attachment.recordDefineId !== 'ff808081666bfa1501666d4fbc3102d9') {
                                    if (attachment.page < attachment.minPage) {
                                        flag = false;
                                    }
                                }
                            }
                        })
                    }
                    $scope.dossierInfo.applyData.attachmentStatus = flag;

                    if (!flag) {
                        /**
                         *如果上传不全
                         */
                        messageBox.showInfo('档案信息保存成功，提交前请补齐材料!').then(function () {
                            $uibModalInstance.close();
                            $scope.save();
                        });
                    } else {
                        /**
                         * 上传全
                         */
                        // messageBox.showInfo('档案信息保存成功。').then(function () {
                        $uibModalInstance.close();
                        $scope.save();
                        // });
                    }
                });
            };

            /**
             * 取消
             */
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.save=function () {
                $log.debug('==============$scope.attachmentList:'+$scope.attachmentList);
                var userDetail = JSON.parse(localStorage.getItem(HRSS_APP_USER_DETAILS_CACHE.appUserDetailCache));
                $http({
                    method: 'POST',
                    url: $scope.uploadUrl,
                    isArray: true,
                    data: {
                        companyId: userDetail.companyId,
                        batchNumber: $scope.batchNumber,
                        attachmentList: $scope.attachmentList,
                        applyType: $scope.dossierInfo.applyData.applyType,
                        applyId:$scope.applyId
                    }
                }).success(function (dataresult) {
                    messageBox.showInfo('上传电子材料成功，系统正在处理您提交的文件，<处理详情>列表可以查看处理进度');
                    //发布上传申报成功事件
                    raiseAttachUploadCompleteEvent(dataresult);
                }).error(function (err) {
                    $log.debug(' error...');
                    messageBox.showError('上传电子材料失败：'+err.data.detail);
                });

            };


            /**
             * 广播文件上传完成事件
             * @param user
             */
            function raiseAttachUploadCompleteEvent(result) {
                $rootScope.$broadcast('attachUploadComplete', result);
            }

        }]);