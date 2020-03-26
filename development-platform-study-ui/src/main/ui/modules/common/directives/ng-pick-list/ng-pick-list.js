/**
 * ngPickList
 * @author yuanmzh
 * @date 2018-05-19
 * @description 依赖ui-grid，左右侧用同一列定义。
 */
"use strict";

angular.module('hrss.si.enterprise.directivesModule')
    .directive('ngPickList', [
        function () {
            return {
                templateUrl: 'modules/common/directives/ng-pick-list/ng-pick-list.html',
                scope: {
                    // 左侧数据
                    lData: '=leftData',
                    // 右侧数据
                    rData: '=rightData',
                    // 向左侧移动事件
                    moveLeftCallBack: '&moveLeft',
                    // 向右侧移动事件
                    moveRightCallBack: '&moveRight',
                    // 全局过滤文本
                    filterText: '=',
                    // grid编辑离开事件
                    cellEditAfter: '&',
                    // 是否允许左右移动
                    isDisabled: '=',
                    pageLeftCallBack: '&pageLeft',
                    pageRightCallBack: '&pageRight'
                    // 数据加载状态
                    // dataLoadState:'='
                },
                controller: 'pickListCtrl'
            };
        }
    ])
    .controller('pickListCtrl', ['$scope', 'pickListService', 'i18nService',
        function (scope, pickListService, i18nService) {

            // 列定义
            var dataColumn = pickListService.getDataColumn();

            /**
             * 移动事件
             * @param direction
             */
            scope.move = function (direction) {
                if (direction === 'left') {
                    scope.moveLeftCallBack({obj: scope.gridRightApi.selection.getSelectedRows()});
                } else if (direction === 'right') {
                    scope.moveRightCallBack({obj: scope.gridLeftApi.selection.getSelectedRows()});
                }
            };


            // 检查列定义是否输入
            if (!dataColumn) {
                throw 'PickList列定义绑定异常，请检查输入项“dataColumn”';
            }

            /**
             * pickList grid 通用配置
             * @type {{columnDefs: Array, enableColumnMenus: boolean, enableSorting: boolean, showGridFooter: boolean, enableGridEdit: boolean, enableColumnResize: boolean, enableRowSelection: boolean, enableFullRowSelection: boolean, allowCellFocus: boolean, enableCellEditOnFocus: boolean, modifierKeysToMultiSelect: boolean, multiSelect: boolean, enableGridMenu: boolean}}
             */
            var gridCommonOption = {
                columnDefs: dataColumn,
                enableColumnMenus: false,
                useExternalPagination: true,
                paginationPageSizes: [100, 500, 1000, 5000],
                paginationPageSize: 500,
                enablePagination: true,
                enableSorting: true,
                showGridFooter: false,//grid footer,sum data condition
                enableColumnResize: true,//ref ui-grid-resize-columns ui-grid-move-columns in html
                enableRowSelection: true,
                enableFullRowSelection: false,
                allowCellFocus: true,//cell focus
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                multiSelect: true,
                enableGridMenu: false
            };

            /**
             * 左侧grid配置
             */
            scope.groupGridLeft = angular.extend({
                data: 'lData.persons',
                totalItems: scope.lData.total,
                enableGridEdit: true,
                onRegisterApi: function (gridApi) {
                    scope.gridLeftApi = gridApi;
                    scope.gridLeftApi.grid.registerRowsProcessor(scope.singleFilter, 200);

                    scope.gridLeftApi.edit.on.afterCellEdit(scope, function (rowEntity, colDef, newValue, oldValue) {

                        scope.cellEditAfter({
                            obj: {
                                'rowEntity': rowEntity,
                                'colDef': colDef,
                                'newValue': newValue,
                                'oldValue': oldValue
                            }
                        });
                    });

                    scope.gridLeftApi.pagination.on.paginationChanged(scope, function (newPage, pageSize) {
                        console.log('左侧grid分页：', newPage, pageSize);
                        scope.pageLeftCallBack({
                            obj: {
                                'newPage': newPage,
                                'pageSize': pageSize
                            }
                        });
                    });
                }
            }, gridCommonOption);
            /**
             * 右侧grid配置
             */
            scope.groupGridRight = angular.extend({
                data: 'rData.persons',
                totalItems: scope.rData.total,
                enableGridEdit: true,
                onRegisterApi: function (gridApi) {
                    scope.gridRightApi = gridApi;
                    scope.gridRightApi.edit.on.afterCellEdit(scope, function (rowEntity, colDef, newValue, oldValue) {

                        scope.cellEditAfter({
                            obj: {
                                'rowEntity': rowEntity,
                                'colDef': colDef,
                                'newValue': newValue,
                                'oldValue': oldValue
                            }
                        });
                    });

                    scope.gridRightApi.pagination.on.paginationChanged(scope, function (newPage, pageSize) {
                        console.log('右侧grid分页：', newPage, pageSize);
                        scope.pageRightCallBack({
                            obj: {
                                'newPage': newPage,
                                'pageSize': pageSize
                            }
                        });
                    });
                }
            }, gridCommonOption);

            // grid总页数刷新
            scope.$watch('lData.total', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    scope.groupGridLeft.totalItems = newVal;
                }
            });

            scope.$watch('rData.total', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    scope.groupGridRight.totalItems = newVal;
                }
            });
            i18nService.setCurrentLang('zh-cn');

            scope.filter = {filterValue: ''};
            scope.filter = function () {
                scope.gridLeftApi.grid.refresh();
            };

            scope.singleFilter = function (renderableRows) {
                var matcher = new RegExp(scope.filter.filterValue);
                renderableRows.forEach(function (row) {
                    var match = false;
                    ['aac003', 'aac147'].forEach(function (field) {
                        if (row.entity[field] !== null && row.entity[field].match(matcher)) {
                            match = true;
                        }
                    });
                    if (!match) {
                        row.visible = false;
                    }
                });
                return renderableRows;
            };

        }])
    .factory('pickListService', ['$log', function ($log) {

        var factory = {};
        var dataColumn = null;

        factory.getDataColumn = function () {
            return dataColumn;
        };

        factory.setDataColumn = function (dc) {
            dataColumn = dc;
        };

        return factory;

    }])
    .directive('enhenceUiGrid', ['gridUtil', function (gridUtil) {
        var directives = {
            restrict: 'A',
            require: 'uiGrid',
            scope: false,
            link: function (scope, ele, attr, uiGridCtrl) {
                var data = uiGridCtrl.grid.options.data;
                scope.$watch(data, function (newVal) {
                    newVal && uiGridCtrl.grid.modifyRows(newVal).then(function () {
                        uiGridCtrl.grid.refresh();
                    });
                });
            }
        };
        return directives;
    }]);
