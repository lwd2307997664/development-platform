/**
 * 卡进度组件
 * Created by Erwin on 2016/05/01.
 * modify on 2018/07/09.
 */

angular.module('hrss.si.enterprise.directivesModule')
    .directive('progressSign', [function () {
        var directive = {
            templateUrl: 'modules/common/directives/progressSign/progressSign.html',
            restrict: 'E',
            scope: {
                rowData: '=structureData',
                progressUI: '=progressData'
            }
        };
        return directive;
    }]);
