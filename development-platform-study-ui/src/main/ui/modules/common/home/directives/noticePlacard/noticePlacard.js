/**
 * Created by congshu on 2017/12/29.
 */
'use strict';

angular.module('hrss.si.enterprise.homeModule')
    .directive('noticePlacard', [function () {
        var directive = {
            templateUrl: 'modules/common/home/directives/noticePlacard/noticePlacard.html',
            restrict: 'E',
            scope: true,
            controller: 'noticePlacardController'
        };
        return directive;
    }])
    //菜单控制动作
    .controller('noticePlacardController', ['$uibModal','selectCodeService','noticeService', '$scope', '$log', 'messageService',
        function ($uibModal,selectCodeService,noticeService, $scope, $log, messageService) {
            $scope.title = [
                {"list": "通知公告"},
                {"list": "资料下载"}
            ];
            $scope.notice=[];
            // $scope.notice = [
            //     {"type":"公告","con": "河南省人力资源和社会保障厅2018年第三季度网站抽查情况报告", "time": "2018-09-11", "txt": "1"},
            //     {"type":"公告","con": "2018年 “中原青年博士后创新人才”拟入选人员公示", "time": "2018-09-07", "txt": "2"},
            // ];
            $scope.download=[];
            // $scope.download = [
            //     {"type":"资料","con": "河南省省直机关2017年考试录用高层次紧缺职位公务员报名表", "time": "2018-09-11", "txt": "33333"}
            // ];
            $scope.show = function (index) {
                $scope.selected = index;
            };
            /**
             * 显示协议
             */
            $scope.showAgree = function (show) {
                if(show.txt==='3'){
                    /**
                     * 通知单
                     */
                    $scope.viewNotice(show);
                    return;
                }else if (show.txt === '1') {
                    var modalDefaults = {
                        backdrop: true,
                        keyboard: true,
                        modalFade: true,
                        size: 'lg',
                        scope: $scope,
                        templateUrl: 'modules/common/home/directives/noticePlacard/noticeCommon.html'
                        // templateUrl: 'modules/common/home/directives/noticePlacard/noticeDetail.html'
                    };
                } else {
                    var modalDefaults = {
                        backdrop: true,
                        keyboard: true,
                        modalFade: true,
                        size: 'lg',
                        scope: $scope,
                        templateUrl: 'modules/common/home/directives/noticePlacard/noticeDetail2.html'
                    };
                }

                var modalOptions = {
                    headerText: show.con,
                    txt: show.txt,
                    show:show
                };
                return messageService.showModal(modalDefaults, modalOptions);
            };

            /**
             *查询通知信息列表
             * @param cbb001
             */
            var queryNoticeList = function (cbb001) {
                // noticeService.queryNoticeList(cbb001).$promise.then(function (data) {
                //     $log.debug('查出通知', data);
                //     if(data.noticeSetOutDTOS.length!==0){
                //         angular.forEach(data.noticeSetOutDTOS, function (dataitem) {
                //            if(dataitem.txt==='1'){
                //                if(dataitem.linkAddress===null || dataitem.linkAddress===''){
                //                    dataitem.showFlag=false;
                //                }else{
                //                    dataitem.showFlag=true;
                //                }
                //                $scope.notice.push(dataitem);
                //            }else if(dataitem.txt==='2'){
                //                $scope.download.push(dataitem);
                //            }
                //         });
                //     }
                //     angular.forEach(data.noticeOutDTOS, function (item) {
                //         var singleCodeName = selectCodeService.getCodeName('CBA002', item.cba002);
                //         var detail={
                //             type:'通知',
                //             con:singleCodeName+"("+item.cba001+")",
                //             time:DateToString(new Date(item.cba008)),
                //             txt:'3',
                //             cba003:item.cba003,
                //             caa001:item.caa001,
                //             cba009:item.cba009
                //         };
                //         $scope.notice.push(detail);
                //     });
                //
                // });
            };

            $scope.queryNotice=function () {
                // queryNoticeList('419900122297');
                // if($scope.userDetail.aab003===undefined || $scope.userDetail.aab003===null || $scope.userDetail.aab003===''){
                    queryNoticeList($scope.userDetail.aab001);//暂时属于假数据
                // }else{
                //     queryNoticeList($scope.userDetail.aab003);
                // }
            };
            $scope.queryNotice();
            /**
             * 查看当前选中条目的通知单
             * @param row
             */
            $scope.viewNotice = function (row) {
                // row.cba003='ff80808166fbb43c01672f34b9f90ac5';//假数据
                var modalInstance = $uibModal.open({
                    backdrop: true,
                    keyboard: true,
                    modalFade: true,
                    templateUrl: 'modules/common/home/directives/noticePlacard/noticeForPdf.html',
                    controller: 'receiptDetailController',
                    size: 'lg',
                    resolve: {
                        applyData: function () {
                            return {
                                url:'/api/dossier/attachment/viewNotice',
                                applyId:row.cba003,
                                caa001: row.caa001,
                                cba009: row.cba009
                            };
                        }
                    }
                });

                modalInstance.result.then(function (rtnVal) {

                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            //补零
            var padString = function padString(i) {
                return i < 10 ? '0' + i : '' + i;
            };

            /**
             * 时间转换为'MM-dd'
             * @param input
             * @returns {*}
             */
            var DateToString = function (input) {
                if (!input || input === undefined) {
                    return input;
                }
                var dateStr =padString(input.getFullYear())+'-'+padString(1 + input.getMonth())+'-' + padString(input.getDate());
                return dateStr;
            };
        }]);
