/**
 * Created by xuml on 2015/5/28.
 * 医疗机构快速查询组件
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule')
//定义的时候注意开头小写
    .directive('medicalQuickSearch', function () {
        return {
            restrict: 'E',
            templateUrl: 'modules/common/directives/medical_quick_search/medical_quick_search_input.html',
            scope: {
                medicalSelectCallback: '&',       //回调方法
                medicalNumber: '=',           //medicalNumber 双向绑定
                isEnable: '=', //是否可用
                toWhere: '=', //取医疗还是工伤的数据
                isEnter: '=', //是否可输入
                sxbm: '=matter',//事项编码
                personId: '=idNumber' //个人编号
            },
            require: ['?ngModel'],
            controller: 'MedicalOrgSearchCtrl'
        };
    })
    .controller('MedicalOrgSearchCtrl', ['HRSS_APP_USER_DETAILS_CACHE', '$scope', '$log', 'messageBox', '$uibModal', 'MedicalOrgService',
        function (HRSS_APP_USER_DETAILS_CACHE, $scope, $log, messageBox, $uibModal, MedicalOrgService) {
            /**
             * 显示医疗机构快速查询窗口
             */
            $scope.showMedicalOrgQuickSearch = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'modules/common/directives/medical_quick_search/medical_quick_search_dialog_view.html',
                    controller: 'MedicalOrgQuickSearchDialogCtrl',
                    size: 'lg',
                    resolve: {
                        toWhere: function () {
                            return angular.copy($scope.toWhere);
                        },
                        sxbm: function () {
                            return angular.copy($scope.sxbm);
                        },
                        personId: function () {
                            return angular.copy($scope.personId);
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                    $log.debug('MedicalOrgQuickSearchDialogCtrl快速选择定位医院:', data, $scope.medicalSelectCallback);
                    $scope.medicalSelectCallback({medical: data});
                });
            };

            /**
             * 按机构名称查询
             * @param medicalNumber
             */
            $scope.search = function (hospitalName) {
                if (hospitalName === null || angular.isUndefined(hospitalName) || hospitalName === '') {
                    return;
                }
                $scope.tcq = $scope.getTcq();
                var detail = {
                    hospitalName: hospitalName,
                    hospitalNumber: null,
                    pageIndex: 0,
                    pageSize: 10,
                    tcq: $scope.tcq,
                    sxbm: $scope.sxbm,
                    personId: $scope.personId
                };
                MedicalOrgService.getMedicalOrgInfo(detail).$promise.then(function (result) {
                    if (result === null || result.total === 0) {
                        var result = {};
                        result.hospitalName = hospitalName;
                        $scope.medicalSelectCallback({medical: result});
                        return;
                    }
                    $log.debug('查询结果条数是' + result.total);
                    $scope.medicalSelectCallback({medical: result.result[0]});
                }, function (err) {
                    var result = {};
                    result.hospitalName = hospitalName;
                    $scope.medicalSelectCallback({medical: result});
                    return;
                });

            };
            /**
             * 获取当前单位统筹区
             */
            $scope.getTcq = function () {
                var userDetail = JSON.parse(localStorage.getItem(HRSS_APP_USER_DETAILS_CACHE.appUserDetailCache));
                var companyInsurances = userDetail.companyInsurances;
                for (var i = 0; i < companyInsurances.length; i++) {
                    if (companyInsurances[i].aae140 === '410' && companyInsurances[i].aab051 === '1') {
                        return companyInsurances[i].aaa027;
                    }
                }
            }
        }
    ])
    /**
     * 快速查询Dialog控制器
     */
    .controller('MedicalOrgQuickSearchDialogCtrl', ['HRSS_APP_USER_DETAILS_CACHE', '$scope', '$uibModalInstance', '$log', 'MedicalOrgService', 'messageBox', 'selectCodeLoader', 'toWhere', 'sxbm', 'personId',
        function (HRSS_APP_USER_DETAILS_CACHE, $scope, $uibModalInstance, $log, MedicalOrgService, messageBox, selectCodeLoader, toWhere, sxbm, personId) {
            $scope.toWhere = toWhere;
            $scope.codeList = selectCodeLoader.loadCodeList();
            //查询参数对象
            var crtQueryParam = function () {
                return {
                    hospitalName: '',
                    hospitalNumber: '',
                    //是否录入查询条件.
                    hasInput: function () {
                        for (var item in this) {
                            if (angular.isFunction(this[item])) {
                                continue;
                            }
                            if (this[item] !== null && this[item] !== '' && this[item] !== 'undefined') {
                                return true;
                            }
                        }
                        return false;
                    },
                    toString: function () {
                        return '名称=' + this.hospitalName + '编号=' + this.hospitalNumber;
                    }
                };
            };

            //定义每页大小
            $scope.pageSize = 10;

            //选择提示警告
            $scope.warningMsg = null;

            //已经选中
            $scope.selection = [];
            //选择切换
            $scope.toggleSelection = function (item) {
                $log.debug('点击选择', item);
                var idx = $scope.selection.indexOf(item);
                // is currently selected
                if (idx > -1) {
                    $scope.selection.splice(idx, 1);
                }
                // is newly selected
                else {
                    $scope.selection = [];
                    $scope.selection.push(item);
                }
                $uibModalInstance.close($scope.selection[0]);
            };
            //是否被选择
            $scope.isSelected = function (item) {
                return $scope.selection.indexOf(item) >= 0;
            };
            //获得被选择的css class
            $scope.getSelectedClass = function (item) {
                return $scope.isSelected(item) ? 'success' : '';
            };
            //关闭提示警告
            $scope.closeWaring = function () {
                $scope.warningMsg = null;
            };

            //页面显示清单
            $scope.pageObject = [];

            //查询条件
            $scope.queryParam = crtQueryParam();

            $scope.totalItems = 0;

            //当前页面（初始化为第一页）
            $scope.currentPage = 1;

            $scope.searchApply = function () {
                //重置错误提示
                $scope.warningMsg = null;
                //如果没有录入查询条件
                /*if (!$scope.queryParam.hasInput()) {
                 $scope.warningMsg = '请至少录入一项查询条件';
                 return;
                 }*/
                $log.debug('-----------------' + $scope.queryParam);
                $scope.tcq = $scope.getTcq();
                var detail = {
                    hospitalName: $scope.queryParam.medicalName,
                    hospitalNumber: null,
                    pageIndex: $scope.currentPage - 1,
                    pageSize: $scope.pageSize,
                    tcq: $scope.tcq,
                    sxbm: sxbm,
                    personId: personId
                };
                MedicalOrgService.getMedicalOrgInfo(detail).$promise.then(function (result) {
                    $log.debug('查询结果条数是' + result.length);
                    if (result.length === 0) {
                        $scope.pageObject = '';
                        $scope.totalItems = 0;
                        $scope.warningMsg = '未查询到定点医疗机构信息';
                        return;
                    }
                    $scope.pageObject = result.result;
                    $scope.totalItems = result.total;
                }, function (err) {
                    $scope.warningMsg = '未查询到定点医疗机构信息';
                });
            };

            /**
             * 确定
             */
            $scope.ok = function () {
                if ($scope.selection.length !== 1) {
                    $scope.warningMsg = '请选择需要的机构信息';
                    return;
                }
                $uibModalInstance.close($scope.selection[0]);
            };

            /**
             * 取消
             */
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            /**
             * 获取当前单位统筹区
             */
            $scope.getTcq = function () {
                var userDetail = JSON.parse(localStorage.getItem(HRSS_APP_USER_DETAILS_CACHE.appUserDetailCache));
                var companyInsurances = userDetail.companyInsurances;
                for (var i = 0; i < companyInsurances.length; i++) {
                    if (companyInsurances[i].aae140 === '410' && companyInsurances[i].aab051 === '1') {
                        return companyInsurances[i].aaa027;
                    }
                }
            }
        }]);
