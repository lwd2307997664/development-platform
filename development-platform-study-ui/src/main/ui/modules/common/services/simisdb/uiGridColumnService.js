/**
 * Created by xuml on 2016/6/23.
 *
 */
'use strict';
angular.module('hrss.si.enterprise.simisModule')
    .factory('UiGridColumnService', ['messageService','ApplyResourceFactory','$log','$resource', 'girderConfig',
        function(messageService,ApplyResourceFactory,$log,$resource,appConfig) {
            //定义工厂对象
            var factory = {
            };

            //grid列左对齐
            factory.floatLeft = function () {
                var str = "<div class=\"ui-grid-cell-contents\" title=\"TOOLTIP\" style='text-align: left;'>{{COL_FIELD CUSTOM_FILTERS}}</div>";
                return str;
            };

            //grid列左对齐
            factory.floatRight = function () {
                var str = "<div class=\"ui-grid-cell-contents\" title=\"TOOLTIP\" style='text-align: right;'>{{COL_FIELD CUSTOM_FILTERS}}</div>";
                return str;
            };

            return factory;
        }]);