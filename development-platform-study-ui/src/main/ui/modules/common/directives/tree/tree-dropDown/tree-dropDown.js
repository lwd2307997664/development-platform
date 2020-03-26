/**
 * Created by Erwin on 2017/4/7.
 * 下拉树，一个神奇的交互方式
 */
"use strict";

angular.module('hrss.si.enterprise.directivesModule')
    .directive('neuTreeDropdown', ['$timeout',
        function ($timeout) {
            return {
                templateUrl: 'modules/common/directives/tree/tree-dropDown/tree-dropDown.html',
                scope: {
                    treeData: '=data',
                    separator: '@',
                    max:'=',
                    isFullname:'@',
                    dropdownNodeCallback:'&getDropdownNode',
                    clear:'=',
                    selectArray:'='
                },
                // controller:'neuTreeDropdownCtrl',
                link:function (scope) {

                    scope.selectArray = [];

                    scope.isAppear = true;

                    scope.getSelectNode=function (currentNode) {
                        scope.selectArray=currentNode;
                        console.log('currentNode',currentNode);
                        scope.dropdownNodeCallback({value: {'currentNode': currentNode}});
                    };


                    scope.toggleDrop=function () {
                        $timeout(function () {
                            scope.isAppear=!scope.isAppear;
                        },100);
                    };

                }
            };
        }
    ]);
