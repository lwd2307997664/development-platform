/**
 * progressSign 进度标志
 * Created by Erwin on 2016/5/10.
 */
'use strict';

angular.module('hrss.si.enterprise.directivesModule')
    .directive('progressItem', [function () {
        var directive = {
            templateUrl: 'modules/common/directives/progressSign/progressItem.html',
            restrict: 'E',
            scope: {
                uiControl: '=',
                direction: '='
            },
            controller: 'progressItemController'
        };
        return directive;
    }])
    .controller('progressItemController', ['$scope', '$templateCache',
        function ($scope, $templateCache) {

            /**
             * 进度处理(色环、标志)
             * @param type
             * @param currentState
             * @returns {*}
             */
            $scope.progressFun = function (type, currentState) {
                //分别为成功、正在进行、未开始、失败 四种标记样式类
                var CLASS_SIGN_SUCCESS = '';
                var CLASS_SIGN_CONDUCT = 'card_progress_inProgressColor';
                var CLASS_SIGN_WAIT = 'card_progress_unStartColor';
                var CLASS_SIGN_FAILE = 'card_progress_faileColor';

                var CLASS_RING_SUCCESS = 'card_progress_btn_success';
                var CLASS_RING_CONDUCT = 'card_progress_btn_conduct';
                var CLASS_RING_WAIT = 'card_progress_btn_wait';
                var CLASS_RING_FAILE = 'card_progress_btn_faile';

                if (type === 'sign') {
                    switch (currentState) {
                        case '0':
                            return CLASS_SIGN_WAIT;
                            break;
                        case '1':
                            return CLASS_SIGN_CONDUCT;
                            break;
                        case '2':
                            return CLASS_SIGN_SUCCESS;
                            break;
                        default:
                            return CLASS_SIGN_FAILE;
                    }
                } else if (type === 'ring') {
                    switch (currentState) {
                        case '0':
                            return CLASS_RING_WAIT;
                            break;
                        case '1':
                            return CLASS_RING_CONDUCT;
                            break;
                        case '2':
                            return CLASS_RING_SUCCESS;
                            break;
                        default:
                            return CLASS_RING_FAILE;
                    }
                }

            };

            //初始化popover配置
            $scope.popoverIsOpen = false;
            //初始化popover模板
            var tipTemplate = '<div class="card_progress_popover_title" >经办人：<span ng-bind="uiControl.user" ng-if="uiControl.user!=\'null\'"></span></div>' +
                '<div  class="card_progress_popover_content"  ng-if="uiControl.comments !== \'\'">明细：<span ng-bind="uiControl.comments" ng-if="uiControl.comments!=\'null\'"></span></div>';
            //将popover模板放入$templateCache队列
            $templateCache.put('progressTooltip.html', tipTemplate);


            $scope.popoverImg = function (evt, value) {
                console.log('popover方法已触发', evt, value);
                evt.stopPropagation();
                if ($scope.uiControl.user === '' && $scope.uiControl.comments === '') {
                    return;
                }
                $scope.popoverIsOpen = value;
            };

            $scope.progressRingFun = function (currentState) {

            };

        }]);

