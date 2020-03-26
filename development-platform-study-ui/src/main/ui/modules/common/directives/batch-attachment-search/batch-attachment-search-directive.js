/**
 * 批量申报列表显示组件
 * -----------------
 * 使用方式
 * ----------
 * Created by wuyf on 2015/6/28.
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule')
//定义的时候注意开头小写
    .directive('batchAttachmentSearch', function () {
        return {
            restrict: 'E',
            templateUrl: 'modules/common/directives/batch-attachment-search/batch-attachment-search-view.html',
            scope: {
                applyType: '=',            //APPLY_TYPE 后台资源类型
                applyTypeValue: '='      //APPLY_TYPE 后台资源类型

            },
            controller: 'BatchUploadListCtrl'
        };
    })
    /**
     * 申报事件列表控制器
     */
    .controller('BatchUploadListCtrl', ['$window','HRSS_APP_USER_DETAILS_CACHE', '$scope', 'ApplyResourceFactory', 'APPLY_RESOURCE', '$log', 'girderConfig',
        function ($window,HRSS_APP_USER_DETAILS_CACHE, $scope, ApplyResourceFactory, APPLY_RESOURCE, $log, appConfig) {
            var userDetail = JSON.parse(localStorage.getItem(HRSS_APP_USER_DETAILS_CACHE.appUserDetailCache));
            var ApplyResource = ApplyResourceFactory.crtResource($scope.applyType);
            $scope.paySalaryData = [];
            $scope.batchNumber = null;
            $scope.matter = '';
            $scope.applyData = null;
            $scope.uploadUrl = appConfig.baseUrl + '/api/batch/attachment/upload';
            $scope.query = function () {
                $scope.paySalaryData = [];
                //获取单位编号
                ApplyResource.queryUnsubmitApply(userDetail.companyId).$promise.then(function (data) {
                    $log.debug('查询申报列表结果', data);
                    if (data !== undefined && data !== null && data.length !== 0) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].applyType === $scope.applyTypeValue && $scope.batchNumber !== undefined
                                && $scope.batchNumber !== null && $scope.batchNumber !== ''
                                && $scope.batchNumber === data[i].batchNumber) {
                                $scope.paySalaryData.push(data[i]);
                            }
                        }
                    }

                    if ($scope.paySalaryData.length !== 0) {
                        $scope.matter = $scope.paySalaryData[0].matter;
                        $scope.applyData = $scope.paySalaryData[0];
                    }
                }, function (err) {
                    messageBox.showError('查询当月已申报清单失败，原因：' + err.data);
                });
            };

            //描述申报清单显示方式
            $scope.listColumnDefs = [
                {
                    field: 'name',
                    displayName: '姓名',
                    headerCellClass: 'ngCellCenter',
                    cellClass: 'ngCellCenter',
                    width: 100
                },
                {
                    field: 'idNumber',
                    displayName: '证件号码',
                    headerCellClass: 'ngCellCenter',
                    cellClass: 'ngCellCenter',
                    width: 220
                },
                {
                    field: 'sex',
                    displayName: '性别',
                    cellFilter: 'selectCodeName:\'AAC004\'',
                    headerCellClass: 'ngCellCenter',
                    cellClass: 'ngCellCenter',
                    width: 100
                },
                {
                    field: 'createDate',
                    displayName: '申报创建日期',
                    cellFilter: 'SecondLongToDateFilter',
                    headerCellClass: 'ngCellCenter',
                    cellClass: 'ngCellCenter',
                    width: 200
                },
                {
                    field: 'submitStatus',
                    displayName: '申报状态',
                    cellFilter: 'selectCodeName:\'SUBMIT_STATUS\'',
                    headerCellClass: 'ngCellCenter',
                    cellClass: 'ngCellCenter',
                    width: 200
                },
                {
                    field: 'batchNumber',
                    displayName: '批次编号',
                    headerCellClass: 'ngCellCenter',
                    cellClass: 'ngCellCenter',
                    width: 270
                }
            ];

            $scope.batchInfo = {
                data: 'paySalaryData',
                columnDefs: $scope.listColumnDefs,
                enableColumnMenus: false,
                enableSorting: false,
                paginationPageSizes: [10, 15, 20, 30],//define sizes per page
                paginationPageSize: 10,//ref  ui-grid-pagination   in html
                showGridFooter: false,//grid footer,sum data condition
                enableGridEdit: true,//ref  ui-grid-edit="" in html
                enableColumnResize: true,//ref ui-grid-resize-columns ui-grid-move-columns in html
                enableRowSelection: false,//ref ui-grid-selection in html
                allowCellFocus: true,//cell focus
                enableCellEditOnFocus: true,
                enableGridMenu: false, //默认true
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                }
            };


            /**
             * 打印
             */
            $scope.printPDF = function () {
                $log.debug("业务类型applyTypeValue" + $scope.applyTypeValue);
                $log.debug("业务类型$scope.applyType" + $scope.applyType);
                var url='';
                if ($scope.applyTypeValue === '1203') {
                    url = appConfig.baseUrl + $scope.applyType.url+'/report?batchNumber=' + $scope.batchNumber;
                    $window.open(url);
                    return;
                }else{//默认
                    url = appConfig.baseUrl + $scope.applyType.url+'/report?batchNumber=' + $scope.batchNumber;
                    $window.open(url);
                    return;
                }
            };

        }]);