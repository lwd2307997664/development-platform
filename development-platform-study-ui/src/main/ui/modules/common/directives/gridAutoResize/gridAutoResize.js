/**
 *@expression 重写angular-grid-ui 的自动计算大小功能
 *@author jiachw
 *@Date   create in 2019/07/04
 */
'use strict';
var module = angular.module('hrss.si.enterprise.directivesModule');


module.directive('uiGridAutoResize', ['$timeout', 'gridUtil', function ($timeout, gridUtil) {
    return {
        require: 'uiGrid',
        scope: false,
        link: function ($scope, $elm, $attrs, uiGridCtrl) {
            var prevGridWidth, prevGridHeight;

            function getDimensions() {
                prevGridHeight = gridUtil.elementHeight($elm);
                prevGridWidth = gridUtil.elementWidth($elm);
            }

            // Initialize the dimensions
            getDimensions();

            var resizeTimeoutId;

            function startTimeout() {
                clearTimeout(resizeTimeoutId);

                resizeTimeoutId = setTimeout(function () {
                    var newGridHeight = gridUtil.elementHeight($elm);
                    var newGridWidth = gridUtil.elementWidth($elm);

                    if (newGridHeight !== prevGridHeight || newGridWidth !== prevGridWidth) {
                        uiGridCtrl.grid.gridHeight = newGridHeight;
                        uiGridCtrl.grid.gridWidth = newGridWidth;
                        uiGridCtrl.grid.api.core.raise.gridDimensionChanged(prevGridHeight, prevGridWidth, newGridHeight, newGridWidth);

                        $scope.$apply(function () {
                            getDimensions();
                            uiGridCtrl.grid.refreshCanvas(true);
                            startTimeout();
                        });
                    }
                    else {
                        startTimeout();
                    }
                }, 250);
            }

            startTimeout();

            $scope.$on('$destroy', function () {
                clearTimeout(resizeTimeoutId);
            });
        }
    };
}]);