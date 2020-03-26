/**
 *档案控件
 *
 * @author WangXG
 * @date 2018/6/4
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule')
    .directive('dossier', [function () {
        var directive = {
            templateUrl: 'modules/common/directives/dossier/dossier.html',
            restrict: 'E',
            scope: {
                applyData: '=applyData',//申报数据 （applyId、attachmentList,matter）
                matterInit: '=matter',//申报事项(不需要了，记录在applyData)
                readOnly: '='
            },
            controller: 'dossierController'
        };
        return directive;
    }])
    .controller('dossierController', ['$scope', '$log', '$http', 'girderConfig', '$uibModal',
        function ($scope, $log, $http, appConfig, $uibModal) {
            /**
             * 页面
             */
            $scope.dossierDetail = function () {
                var modalInstance = $uibModal.open({
                    backdrop: true,
                    keyboard: true,
                    modalFade: true,
                    size: 'lg',
                    templateUrl: 'modules/common/directives/dossier/dossierDetail.html',
                    controller: 'dossierDetailController',
                    resolve: {
                        dossierInfo: {
                            headerText: '申报电子材料上传：',
                            applyData: $scope.applyData,
                            readOnly: $scope.readOnly
                        }
                    }
                });
                modalInstance.result.then(function () {

                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            }

        }])
    .controller('dossierDetailController', ['$scope', '$log', '$http', 'girderConfig', 'messageBox', 'SystemIssue', 'CompanyService', 'DossierService', '$uibModalInstance', 'dossierInfo', 'IMG_CHECK_UPDATE',
        function ($scope, $log, $http, appConfig, messageBox, SystemIssue, CompanyService, DossierService, $uibModalInstance, dossierInfo, IMG_CHECK_UPDATE) {
            $scope.colOption = {name: 'name', value: 'value', child: 'child'};
            $scope.dossierInfo = dossierInfo;
            $scope.readOnly = $scope.dossierInfo.readOnly;

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
                        });
                    } else {
                        /**
                         * 上传全
                         */
                        // messageBox.showInfo('档案信息保存成功。').then(function () {
                        $uibModalInstance.close();
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

        }]);
