/**
 * 审核反馈组件
 *
 * @author yuanmzh
 * @date 2015-11-04
 * @modify date 2016-4-22
 */
'use strict';

angular.module('hrss.si.enterprise.homeModule')
    .directive('reviewFeedback', [function () {
        var directive = {
            templateUrl: 'modules/common/home/directives/reviewFeedback/reviewFeedback.html',
            restrict: 'E',
            scope: true,
            controller: 'reviewFeedbackController'
        };
        return directive;
    }])
    //菜单控制动作
    .controller('reviewFeedbackController', ['$scope', '$log', '$location', 'homeService',
        function ($scope, $log, $location, homeService) {


            //审核统计
            $scope.reviewedStatus = [
                {'type': 0, 'count': 0, 'name': '审核中业务', 'color': 'blue', 'image': '1'},
                {'type': 1, 'count': 0, 'name': '审核通过业务', 'color': 'green', 'image': '2'},
                {'type': 3, 'count': 0, 'name': '审核退回业务', 'color': 'red', 'image': '3'},
                // {'type': 3, 'count': 0, 'name': '待复核业务', 'color': 'red', 'image': '4'}
            ];
            //初始化（获取审核结果）
            $scope.getReviewedInfo = function () {
                $log.info('获取审核反馈情况..');
                // $scope.companyId = $scope.userDetail.companyId;
                // homeService.queryActualInfo($scope.companyId).$promise.then(function (data) {
                //     $log.debug('reviewFeedback 首页申报统计量', data);
                //     $scope.register = data.register;
                //     $scope.dimission = data.dimission;
                //     $scope.reviewedStatus[0].count = data.unReviewed;
                //     $scope.reviewedStatus[1].count = data.reviewedPass;
                //     $scope.reviewedStatus[2].count = data.reviewedFail;
                // }, function () {
                //     // $scope.messageBox.showError('未查询到申报情况信息');
                // })

            }
            //跳转
            $scope.goShortcut = function (path) {
                $log.debug('快捷键路径path', path);
                $location.replace();
                $location.url(path);
            };

            //跳转到相应状态的审核详细
            $scope.reviewDetailed = function (type) {
                switch (type) {
                    case 0:
                        localStorage.setItem('hrss-review-state-cache', '0');
                        break;
                    case 1:
                        localStorage.setItem('hrss-review-state-cache', '1');
                        break;
                    case 2:
                        localStorage.setItem('hrss-review-state-cache', '2');
                        break;
                    case 3:
                        localStorage.setItem('hrss-review-state-cache', '3');
                        break;
                }
                $location.replace();
                $location.path('/review/reviewed');
            };
//图表
//             $scope.payable1 = $scope.userDetail.account.payable1;
//             $scope.payable2 = $scope.userDetail.account.payable2;
//             $scope.payable3 = $scope.userDetail.account.payable3;
//             $scope.payable4 = $scope.userDetail.account.payable4;
//             $scope.payable5 = $scope.userDetail.account.payable5;
//             $scope.payable6 = $scope.userDetail.account.payable6;
//             $scope.payable7 = $scope.userDetail.account.payable7;
            //初始化chart更新值
            $scope.changeValue = 0;
            $log.debug('wretry', $scope.userDetail);
            $scope.currentlyPayable = $scope.userDetail.account.currentlyPayable;
            $scope.historicalArrears = $scope.userDetail.account.historicalArrears;
            console.log('当前Echart数据为：', $scope.currentlyPayable, $scope.historicalArrears);

            $scope.option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}<br/>{c} 元"
                },
                series: [
                    {
                        name: '当期应缴金额',
                        type: 'pie',
                        radius: ['45%', '65%'],
                        avoidLabelOverlap: false,
                        label: {
                            textStyle: {
                                color: '#b8b8b8'
                            },
                            labelLine: {
                                length: 50,
                                length2: 50,
                                smooth: false,
                                lineStyle: {
                                    color: 'gray'
                                }
                            },
                            normal: {
                                formatter: '{b} \n {c} 元',
                                position: 'outside',
                                fontSize: 18,
                                borderWidth: 0,
                                borderRadius: 4,
                                rich: {
                                    b: {
                                        color: '#b8b8b8',
                                        fontSize: 16,
                                        lineHeight: 33
                                    },
                                    c: {
                                        color: '#6da2f9',
                                        fontSize: 16,
                                        lineHeight: 33
                                    }
                                }
                            }
                        },
                        data: [
                            {
                                value: $scope.historicalArrears,
                                name: '历史欠费累计金额',
                                itemStyle: {
                                    normal: {color: '#98bffb'},

                                },
                                textStyle: {
                                    color: '#6da2f9'
                                },
                            },
                            {
                                value: $scope.currentlyPayable,
                                name: '当期应缴金额',
                                itemStyle: {
                                    normal: {color: '#4496df'}
                                }
                            }

                        ]
                    }
                ]
            };
            //点击事件
            $scope.eClick = function (param) {
                $log.debug('点击事件：', param);
            };

            //鼠标移入事件
            $scope.eMouseover = function (param) {
                $log.debug('鼠标移入事件：', param);
            };

            //鼠标移出事件
            $scope.eMouseout = function (param) {
                $log.debug('鼠标移出事件：', param);
            };
        }]);
