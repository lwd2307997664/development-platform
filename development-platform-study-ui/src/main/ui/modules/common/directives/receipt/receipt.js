/**
 *单据打印
 *
 * @author WangXG
 * @date 2018/6/4
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule')
    .directive('receipt', [function () {
        var directive = {
            templateUrl: 'modules/common/directives/receipt/receipt.html',
            restrict: 'E',
            scope: {
                applyData: '=applyData',//申报数据 （applyId、attachmentList）
                matterInit: '=type'//申报事项
            },
            controller: 'receiptController'
        };
        return directive;
    }])
    .controller('receiptController', ['messageBox', '$scope', '$log', '$http', 'girderConfig', 'messageService', 'SystemIssue', 'CompanyService', 'receiptService', '$uibModal',
        function (messageBox, $scope, $log, $http, appConfig, messageService, SystemIssue, CompanyService, receiptService, $uibModal) {
            if ($scope.matterInit === undefined || $scope.matterInit === null || $scope.matterInit === '') {
                $scope.applyName = '打印申报表';
            } else if ($scope.matterInit.name === '机关事业单位正式待遇申领') {
                $scope.applyName = '打印申领表';
            } else {
                $scope.applyName = '打印申报表';
            }

            $scope.receiptDetail = function () {
                if ((!$scope.applyData) || (!$scope.applyData.applyId)) {
                    messageBox.showInfo('请确认申请后查看申报单!');
                    return;
                }
                $scope.applyData.url = '/api/dossier/attachment/applyReceipt';
                var modalInstance = $uibModal.open({
                    backdrop: true,
                    keyboard: true,
                    modalFade: true,
                    templateUrl: 'modules/common/directives/receipt/receiptDetail.html',
                    controller: 'receiptDetailController',
                    size: 'lg',
                    resolve: {
                        applyData: function () {
                            return $scope.applyData;
                        }
                    }
                });

                modalInstance.result.then(function (rtnVal) {


                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });

            };


            // /**
            //  * 页面
            //  */
            // $scope.receiptDetail = function () {
            //     var modalDefaults = {
            //         backdrop: true,
            //         keyboard: true,
            //         modalFade: true,
            //         controller: 'receiptDetailController',
            //         size: 'lg',
            //         scope: $scope,
            //         templateUrl: 'modules/common/directives/receipt/receiptDetail.html'
            //     };
            //     var modalOptions = {
            //         headerText: '申报单：',
            //         applyData: $scope.applyData,
            //         readonly: true,
            //         submitted: false
            //     };
            //     return messageService.showModal(modalDefaults, modalOptions).then(function (data) {
            //     });
            // }


        }])
    .controller('receiptDetailController', ['$timeout','messageBox', '$scope', '$log', '$http', '$sce', 'girderConfig', 'applyData', '$uibModalInstance',
        function ($timeout,messageBox, $scope, $log, $http, $sce, appConfig, applyData, $uibModalInstance) {

            $scope.name = '正在生成..，请稍等！！';
            $scope.pages = [];
            $scope.click_page = function (index) {
                angular.forEach($scope.pages, function (item) {
                    if (item.index === index) {
                        item.active = true;
                        $scope.printMedReport(index - 1);
                    } else {
                        item.active = false;
                    }
                })
            };
            $scope.everyPDF=null;
            $scope.isShowFlag=true;
            $scope.printMedReport = function (index) {
                $scope.InvokeReportDTO = {reportId: applyData.applyId};
                if (applyData.applyType === '1403') {
                    $scope.InvokeReportDTO.type = '3';
                }
                if (applyData.applyType === '1114') {
                    $scope.InvokeReportDTO.type = '3';
                }
                if (applyData.url === '/api/dossier/attachment/viewNotice') {
                    if (applyData.caa001 !== undefined && applyData.caa001 !== null && applyData.caa001 !== '') {
                        $scope.InvokeReportDTO.caa001 = applyData.caa001;
                    }
                    if (applyData.cba009 !== undefined && applyData.cba009 !== null && applyData.cba009 !== '') {
                        $scope.InvokeReportDTO.cba009 = applyData.cba009;
                    }
                }
                $http({
                    url: appConfig.baseUrl + applyData.url,
                    method: 'POST',
                    data: $scope.InvokeReportDTO,
                    responseType: 'arraybuffer',
                    headers: {'url-index': index}
                }).success(function (response, status, headers, config) {
                    var urlLength = headers("url-length");
                    if (compIE()) {//ie版本大于=10
                        $scope.everyPDF=null;
                        var zip= new JSZip();
                        $scope.everyPDF=zip;
                        if (urlLength && urlLength > 1) {
                            // for(var i=0;i<urlLength;i++){
                            //     $timeout(function () {
                                    $scope.isShowFlag=false;
                                    $scope.downForEveryPDF($scope.everyPDF,0,urlLength);
                            //     }, 1000);
                            // }
                        }else{
                            var file = new Blob([response], {type: 'application/pdf'});
                            var fileURL = URL.createObjectURL(file);
                            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                                window.navigator.msSaveOrOpenBlob(file);
                                $scope.cancel();
                            } else {
                                $scope.reportUrl = $sce.trustAsResourceUrl(fileURL);
                            }

                            if (response.status >= 200 && response.status <= 300 || response.statusText !== 'Bad Request') {
                                $scope.name = '';
                            } else {
                                $scope.name = fileURL.detail;
                            }
                        }
                    } else {

                        if (urlLength && urlLength > 1 && $scope.pages.length < 2) {
                            var pages = [];
                            for (var i = 0; i < urlLength; i++) {
                                if (i === 0) {//第一个默认打开
                                    pages.push({index: i + 1, active: true})
                                } else {
                                    pages.push({index: i + 1, active: false})
                                }
                            }
                            $scope.pages = pages;
                        }

                        var file = new Blob([response], {type: 'application/pdf'});
                        var fileURL = URL.createObjectURL(file);
                        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                            window.navigator.msSaveOrOpenBlob(file);
                            $scope.cancel();
                        } else {
                            $scope.reportUrl = $sce.trustAsResourceUrl(fileURL);
                        }

                        if (response.status >= 200 && response.status <= 300 || response.statusText !== 'Bad Request') {
                            $scope.name = '';
                        } else {
                            $scope.name = fileURL.detail;
                        }
                    }

                }).error(function (data, header, config, status) {
                    debugger
                    //处理响应失败
                    $scope.cancel();
                    if (applyData.url === '/api/dossier/attachment/viewNotice') {
                        messageBox.showInfo('暂无通知！');
                    } else {
                        messageBox.showInfo('暂无单据！');
                        return;
                    }
                })
            };


            // $scope.printMedReport();

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };


            $scope.downForEveryPDF = function (zip,index,urlLength) {
                $scope.InvokeReportDTO = {reportId: applyData.applyId};
                $http({
                    url: appConfig.baseUrl + applyData.url,
                    method: 'POST',
                    data: $scope.InvokeReportDTO,
                    responseType: 'arraybuffer',
                    headers: {'url-index': index}
                }).success(function (response, status, headers, config) {
                    var file = new Blob([response], {type: 'application/pdf'});
                    zip.file("downForPdf"+(index+1)+".pdf", file);
                    $scope.everyPDF=zip;
                    if(index===urlLength-1){

                        $scope.everyPDF.generateAsync({type:"blob"})
                            .then(function(content) {
                                window.navigator.msSaveBlob(content, "downLoadForPDF.zip");
                                $scope.savePDF(content, "downLoadForPDF.zip");
                                $scope.cancel();
                            });
                    }else{
                        $scope.downForEveryPDF(zip,index+1,urlLength);
                    }
                }).error(function (data, header, config, status) {
                    //处理响应失败
                    $scope.cancel();
                })
            };

            $scope.savePDF = function (blob, fileName) {
                var a = document.getElementById("download");
                return function (blob, fileName) {
                    var url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = fileName;
                    a.click();
                };
            };

            //IE浏览器版本检测
            function compIE() {
                var ua = window.navigator.userAgent;
                console.log(ua);
                var versionSplit = /[\/\.]/i;
                var versionRe = /(Version)\/([\w.\/]+)/i; // match for browser version
                var ieRe = /(?:(MSIE) |(Trident)\/.+rv:)([\w.]+)/i; // must not contain 'Opera'
                var match = ua.match(ieRe);
                if (!match) {
                    return false;
                }
                if (Array.prototype.filter) {
                    match = match.filter(function (item) {
                        return (item != null);
                    });
                } else {
                    // Hello, IE8!
                    for (var j = 0; j < match.length; j++) {
                        var matchGroup = match[j];
                        if (matchGroup == null || matchGroup == '') {
                            match.splice(j, 1);
                            j--;
                        }
                    }
                }
                var name = match[1].replace('Trident', 'MSIE');
                var versionMatch = ua.match(versionRe) || match;
                var version = versionMatch[2].split(versionSplit)[0] * 1;
                console.log("IE:" + version);
                if (version >= 10) {
                    return true;
                }
            }
        }]);
