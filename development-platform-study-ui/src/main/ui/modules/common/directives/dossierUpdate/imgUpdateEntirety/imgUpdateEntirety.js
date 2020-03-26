/**
 * 图片上传（业务概况+材料整体）
 *
 * @author Erwin
 * @date 2016/2/4
 */
'use strict';

angular.module('hrss.si.enterprise.directivesModule')
    .constant('IMG_CHECK_UPDATE', {
        update: 'image-update'
    })
    .directive('imgUpdateEntirety', [function () {
        var directive = {
            templateUrl: 'modules/common/directives/dossierUpdate/imgUpdateEntirety/imgUpdateEntirety.html',
            restrict: 'E',
            scope: {
                materialData: '=configData',
                saveBussFunction: '&saveFun',
                checkResult: '&checkResult',
                isView:'=readOnly'
            },
            controller: 'imgUpdateEntiretyController'
        };
        return directive;
    }])
    .controller('imgUpdateEntiretyController', ['$scope', '$log', '$http', 'girderConfig', '$templateCache', '$timeout', 'messageBox',
        function ($scope, $log, $http, appConfig, $templateCache, $timeout, messageBox) {
            //页面控制数组
            $scope.viewState = [];
            //默认按钮的值为详细
            $scope.detailedValue = '详细';
            //初始化fileWebServerUrl
            $scope.fileWebServerUrl = {url: 'http://' + window.location.host};
            // 材料确认回调次数
            var callbackIndex = 0;
            // 材料初始化次数（因有隐藏材料，所以初始化可能不为0）
            var initIndex = 0;


            // 获取fileWebServerUrl
            // $http.get(appConfig.baseUrl + '/api/pile/dossier/upload/fileWebServerUrl', {
            //   headers: {'Content-Type': undefined}//,
            // })
            // // $http.get('/pile-dossier-app/api/upload/fileWebServerUrl', {
            // //     headers: {'Content-Type': undefined}//,
            // // })
            //   .success(function (data) {
            //     $log.debug('获取fileWebServerUrl成功');
            //     $scope.fileWebServerUrl = data;
            //     //初始化界面
            //     init();
            //   })
            //   .error(function () {
            //     $log.debug('获取fileWebServerUrl失败');
            //   });


            /**
             * 根据材料数组生成页面控制数组（viewState）
             */
            var init = function () {
                angular.forEach($scope.materialData, function (data) {
                    if (!(data.type === 'APPLY_RECEIPT'||data.type === 'APPLY_OTHER')) {//过滤掉申报单
                        //默认展开第一个材料
                        if (data.index === 0) {
                            $scope.viewState.push({'index': data.index, 'state': null, 'isExtend': true});
                        } else {
                            $scope.viewState.push({'index': data.index, 'state': null, 'isExtend': false});
                        }
                    } else {
                        initIndex++;
                    }
                });
                callbackIndex = initIndex;
            };
            //初始化界面
            init();

            //详细视图切换
            $scope.detailedOperation = function () {
                if ($scope.detailedValue === '详细') {
                    $scope.detailedValue = '概览';
                }
                else {
                    $scope.detailedValue = '详细';
                }
                //展开所有子项
                angular.forEach($scope.viewState, function (data) {
                    data.isExtend = $scope.detailedValue === '概览';
                });
            };

            /**
             * 单个展开动作
             * @param obj
             */
            $scope.moreAction = function (obj) {
                angular.forEach($scope.viewState, function (data) {
                    if (data.index === obj.index) {
                        data.isExtend = !data.isExtend;
                        $log.debug('当前点击的index为', obj.index, '状态为：', data.isExtend);
                    } else {
                        data.isExtend = false;
                    }
                });
            };


            //上传后回写配置数据且调用saveBussFunction
            $scope.writeBack = function (data) {
                $log.debug('收到的data为：', data);
                // angular.forEach($scope.materialData, function (materialData) {
                //     if (materialData.index === data.index) {
                //         materialData = data;
                //     }
                // });
                // $scope.saveBussFunction({obj: data});
            };


            // 接收上传结果
            $scope.updateResultMaterial = function (result) {

                // if (result === 'fail') {
                //     callbackIndex = 0;
                //     messageBox.showError('材料上传失败。');
                //     return;
                // }

                callbackIndex++;
                if (callbackIndex === $scope.materialData.length) {
                    $timeout(function () {
                        $scope.saveBussFunction();
                        callbackIndex = initIndex;
                    }, 40);
                }
            };
        }]);
