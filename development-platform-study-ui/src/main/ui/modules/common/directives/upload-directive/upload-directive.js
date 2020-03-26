/**
 * 材料上传组件
 * Created by congshu on 2018/4/19
 * -----------------
 * 使用方式
 * ----------
 *
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule')
//定义的时候注意开头小写
    .directive('uploadDirective', function () {
        return {
            restrict: 'E',
            templateUrl: 'modules/common/directives/upload-directive/upload-directive.html',
            scope: {
                applyType: '=',            //APPLY_TYPE 后台资源类型
                optionData:'=',
                matterList:'=',
            },
            controller: 'uploadDirectiveCtrl'
        };
    })
    /**
     * 材料上传控制器
     */
    .controller('uploadDirectiveCtrl', ['$timeout','$scope', '$log', 'APPLY_APP_EVENT', 'ApplyResourceFactory',
        'messageBox', '$rootScope', '$filter', 'HRSS_APP_USER_DETAILS_CACHE',
        function ($timeout,$scope, $log, APPLY_APP_EVENT, ApplyResourceFactory, messageBox, $rootScope, $filter, HRSS_APP_USER_DETAILS_CACHE) {
            //点击确定后的回调函数
            $scope.selectCallback = function (item, names) {
                $log.debug('item:', item, 'names', names);
                CompanyService.getMaterial(item.value).$promise.then(function (data) {
                    $scope.optionData = [];
                    for(var i=0;i<data.items.length;i++){
                        var detail={
                            name:data.items[i].name,
                            fixPage:data.items[i].fixPage,
                            index:i,
                            descript:data.items[i].descript,
                            page: data.items[i].page,
                            samplePath:null,
                            imgDataUrl:[]
                        };
                        $scope.optionData.push(detail);
                    }
                });
            };
        }]);
