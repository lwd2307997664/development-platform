/**
 * 图片上传（材料部分）
 *
 * @author Erwin
 * @date 2016/2/4
 */
'use strict';

angular.module('hrss.si.enterprise.directivesModule')
    .directive('imgUpdateMaterial', [function () {
        var directive = {
            templateUrl: 'modules/common/directives/dossierUpdate/imgUpdateMaterial/imgUpdateMaterial.html',
            restrict: 'E',
            scope: {
                materialDetailData: '=',
                extendState: '=',
                fileWebServerUrl: '=webServerUrl',
                extendDetailCallBack: '&extendDetail',
                writeBackCallBack: '&writeBack',
                updateResultMaterial: '&',
                isView: '='
            },
            controller: 'imgUpdateMaterialController'
        };
        return directive;
    }])

    .controller('imgUpdateMaterialController', ['$scope', '$log', '$http', 'messageBox', 'imageViewBox', 'girderConfig', 'IMG_CHECK_UPDATE', 'dossierContext',
        function ($scope, $log, $http, messageBox, imageViewBox, appConfig, IMG_CHECK_UPDATE, dossierContext) {
            //控件显示数组及组成对象
            $scope.widgetViewData = [];
            var widgetViewObj = {'name': '', 'dataURL': null, 'blob': null, 'fileName': '', 'descript': ''};
            //是否允许上传
            $scope.isAllowUpload = false;
            //原始（回显）图片删除数组
            var willDeleteArray = [];
            //缩略图后缀
            var THUMBNAIL_SUFFIX = '_150x150';
            //上传成功样式控制对象
            $scope.successCtrl = {'isSuccess': false, 'updateCount': 0};
            //初始化上传样式
            $scope.successCtrl = {'isSuccess': false, 'updateCount': 0};
            // dossier服务端上下文
            var dossierContextVal = dossierContext;


            $scope.$on(IMG_CHECK_UPDATE.update, function () {
                // console.log('确认检查：', $scope.widgetViewData);
                // var checkResult = '';
                // // $scope.checkResultMaterial();
                // angular.forEach($scope.widgetViewData, function (item, index) {
                //     // 当前存在新图片
                //     if ((item.dataURL.indexOf('http://') === -1) && (item.dataURL.indexOf('base64') !== -1)) {
                //         checkResult += (index+1+'、');
                //     }
                // });
                //
                // if (checkResult.length !== 0) {
                //     checkResult = '材料:'+$scope.materialDetailData.name + ' 的第'+checkResult+'页还未上传。'
                // }
                if ($scope.isAllowUpload) {
                    $scope.imgUpdate()
                } else {
                    $scope.updateResultMaterial({result: false});
                }

            });

            //组件Item拼装
            var widgetObj = function (value) {

                var widgetSoure = {
                    'name': value,
                    'dataURL': null,
                    'blob': null,
                    'fileName': '',
                    'isUpload': false,
                    'descript': ''
                };

                if (angular.isDefined($scope.materialDetailData.desc)) {
                    widgetSoure.desc = {
                        required: $scope.materialDetailData.desc.required,
                        placeholder: $scope.materialDetailData.desc.placeholder,
                        pattern: $scope.materialDetailData.desc.pattern,
                        descript: ''
                    };
                }

                return widgetSoure;
            };

            /**
             * 容器改动检查
             */
            var isAllowUp = function () {
                //已经选择的图片数
                $scope.haveChosen = 0;

                //判断是否可以上传（是否所有容器都有内容）
                for (var i = 0; i < $scope.widgetViewData.length; i++) {
                    var dataUrl = $scope.widgetViewData[i].dataURL;
                    if (dataUrl === null || dataUrl === '' || angular.isUndefined(dataUrl)) {
                        $scope.isAllowUpload = false;
                        break;
                    } else {
                        if ($scope.materialDetailData.imgDataUrl !== null) {
                            $scope.isAllowUpload = true;
                            $scope.successCtrl.isSuccess = true;
                            $scope.successCtrl.updateCount = $scope.materialDetailData.imgDataUrl.length;
                        } else {
                            $scope.isAllowUpload = true;
                        }
                    }
                }


                //检查是否允许删除（容器是否到最小值）
                if ($scope.materialDetailData.fixPage == 0) {
                    if ($scope.widgetViewData.length === $scope.materialDetailData.minPage) {
                        $scope.isAllowDelete = true;
                        $log.debug('检查是否允许删除：', $scope.isAllowDelete);
                    } else {
                        $scope.isAllowDelete = false;
                        $log.debug('检查是否允许删除：', $scope.isAllowDelete);
                    }
                }

                //检查已上传数
                angular.forEach($scope.widgetViewData, function (data) {
                    if (data.isUpload === true || data.dataURL !== null) {
                        $scope.haveChosen++;
                    }
                });
            };


            /**
             * 初始化容器控制数组
             */
            var widgetCtrl = function (value, key) {
                if (value === 0) {
                    return;
                }
                if (angular.isDefined($scope.fileWebServerUrl) && $scope.fileWebServerUrl !== null) {
                    for (var i = 0; i < value; i++) {
                        //生成容器
                        initWidget(i, key);
                        $scope.widgetViewData.push(widgetViewObj);
                        //清空控件显示对象
                        widgetViewObj = widgetObj('');
                    }
                }
                /**
                 * 通知下级容器是否固定页数(是否可以删除)
                 */
                $scope.isAllowDelete = $scope.materialDetailData.fixPage !== 0;

                isAllowUp();
            };


            /**
             * 生成容器
             * @param i
             * @param key
             */
            var initWidget = function (i, key) {

                /**
                 * 组件对象赋值
                 * @param dataUrl
                 * @param index
                 * @param descript
                 */
                var assignment = function (dataUrl, index, descript) {
                    widgetViewObj = {
                        name: index,
                        dataURL: dataUrl,
                        blob: null,
                        fileName: null,
                        descript: descript
                    };
                    if (angular.isDefined($scope.materialDetailData.desc)) {
                        widgetViewObj.desc = {
                            required: $scope.materialDetailData.desc.required,
                            placeholder: $scope.materialDetailData.desc.placeholder,
                            pattern: $scope.materialDetailData.desc.pattern
                        };
                    }
                };

                /**
                 * 缩略图处理
                 * @param url
                 */
                var thumbnailProcess = function (url) {
                    //缩略图后缀插入位置
                    var insertLoc = null;
                    //前部分URL
                    var frontUrl = null;
                    //后部分URL
                    var backUrl = null;

                    insertLoc = url.lastIndexOf('.');
                    frontUrl = url.substring(0, insertLoc);
                    backUrl = url.substring(insertLoc);

                    var thuUrl = frontUrl + THUMBNAIL_SUFFIX + backUrl;
                    var path = thuUrl.substring(thuUrl.indexOf('external'), thuUrl.length);

                    return $scope.fileWebServerUrl.url + appConfig.baseUrl + '/api/pile/dossier/download?filePath=' + path; //APP分发请求

                    // return frontUrl + THUMBNAIL_SUFFIX + backUrl; // 直连档案服务
                };

                /**
                 * 初始化示例图片
                 */
                $scope.samplePath = function () {
                    //完整的URL
                    var sampleUrl = 'http://' + $scope.fileWebServerUrl.url + '/' + $scope.materialDetailData.samplePath;

                    return thumbnailProcess(sampleUrl);
                };


                //如果存在已经上传页
                if (key === 'page' && $scope.materialDetailData.imgDataUrl) {
                    if (i < $scope.materialDetailData.imgDataUrl.length && $scope.materialDetailData.imgDataUrl[i]) {
                        //完整的URL
                        var assignDataUrl = $scope.materialDetailData.imgDataUrl[i].url;
                        //缩略图URL
                        var thumbnailUrl = thumbnailProcess(assignDataUrl);
                        //原上传页的index
                        var assignIndex = $scope.materialDetailData.imgDataUrl[i].index;

                        assignment(thumbnailUrl, assignIndex, $scope.materialDetailData.imgDataUrl[i].descript);
                    } else {
                        assignment(null, i, '');
                    }
                } else {
                    assignment(null, i, '');
                }

            };

            /**
             * 根据材料对象动态创建图片上传控件
             */
            if ($scope.materialDetailData.page === 0) {
                if ($scope.materialDetailData.fixPage === 0) {
                    widgetCtrl($scope.materialDetailData.minPage, 'minPage');
                }
                widgetCtrl($scope.materialDetailData.fixPage, 'fixPage');
            } else {
                widgetCtrl($scope.materialDetailData.page, 'page');
            }


            /**
             * 上传图片值修改
             * @param obj
             */
            $scope.changeWidgetValue = function (obj) {
                $log.debug('您将要修改的图片信息为：', obj);

                if (obj.isDelete === true) {
                    if (willDeleteArray.indexOf(obj.name) === -1)
                        willDeleteArray.push(obj.name);
                    $log.debug('将原有赋值图片加入到删除队列：', willDeleteArray);
                }
                //将修改的值更新到widgetViewData
                angular.forEach($scope.widgetViewData, function (data) {
                    if (data.name === obj.name) {
                        data.blob = obj.blob;
                        data.fileName = obj.fileName;
                        data.isUpload = obj.isUpload;
                        data.dataURL = obj.dataURL;
                    }
                });
                //判断是否可以上传
                isAllowUp();

                $log.debug('修改后的数组为：', $scope.widgetViewData, '是否可以上传', $scope.isAllowUpload);
            };


            /**
             * 图片容器删除
             * @param obj
             * @param minPage
             * @param fixPage
             */
            $scope.deleteWidget = function (obj, minPage, fixPage) {
                //widget的数量
                var widgetAmount;

                if (fixPage === 0) {
                    //如果容器可以增减（删除容器）
                    widgetAmount = $scope.widgetViewData.length;
                    //如果不是最后一个容器
                    if (widgetAmount > 1) {
                        //删除的容器数量最小值不能小于材料最小页数
                        if (widgetAmount > minPage) {
                            angular.forEach($scope.widgetViewData, function (data, index) {
                                if (data.name === obj.name) {
                                    $scope.widgetViewData.splice(index, 1);
                                }
                            });
                        }
                    } else {
                        angular.forEach($scope.widgetViewData, function (data, index) {
                            if (data.name === obj.name) {
                                $scope.widgetViewData.splice(index, 1);
                            }
                        });
                        $scope.widgetViewData.push(widgetObj(0));
                    }
                }
                //是否允许上传
                isAllowUp();
                $log.debug('删除后的数组为：', $scope.widgetViewData);
                $log.debug('您将要删除的数据的index为：', willDeleteArray);
            };


            /**
             *  图片容器增加
             * @param maxPage
             * @param fixPage
             */
            $scope.imgAdd = function (maxPage, fixPage) {
                //widget的数量
                var widgetAmount;
                //判断连续的前数字
                var numberFront;
                //判断连续的后数字
                var numberBack;
                //断点处位置
                var breakLoc;
                //是否连续
                var isContinuity;

                //如果有固定页数则不触发此方法
                if (fixPage > 0) {
                    return;
                }
                widgetAmount = $scope.widgetViewData.length;
                //确定容器id是否从0开始，并且连续
                if ($scope.widgetViewData[0].name == 0) {
                    for (var i = 0; i < widgetAmount; i++) {
                        if (i != widgetAmount - 1) {
                            var k = i + 1;
                        }
                        //判断k是否存在，不存在说明当前只有一个index=0的容器
                        if (angular.isDefined($scope.widgetViewData[k])) {
                            numberFront = $scope.widgetViewData[i].name;
                            numberBack = $scope.widgetViewData[k].name;
                            //如果不是最后一次比对
                            if (k != i) {
                                if ((numberBack - numberFront) > 1) {
                                    isContinuity = false;
                                    breakLoc = parseInt(numberFront) + 1;
                                    break;
                                }
                            }
                        }
                    }
                    //如果存在断点
                    if (isContinuity === false) {
                        //添加的容器数量最大值不能超过材料最大页数
                        if (widgetAmount < maxPage) {
                            $scope.widgetViewData.splice(breakLoc, 0, widgetObj(breakLoc));
                        }
                        $log.debug('当前的断点为：', breakLoc);
                    } else {
                        if (widgetAmount < maxPage) {
                            $scope.widgetViewData.push(widgetObj(widgetAmount));
                        }
                    }
                } else {
                    if (widgetAmount < maxPage) {
                        $scope.widgetViewData.unshift(widgetObj(0));
                    }
                }
                //是否允许上传
                isAllowUp();


                $log.debug('当前材料的id为：', $scope.widgetViewData, widgetAmount);
            };

            /**
             * 材料展开事件（子项）
             */
            $scope.extendDetail = function (index) {
                $scope.extendDetailCallBack({obj: {index: index}})
            };

            /**
             * 示例图片弹出显示
             * @param event
             */
            $scope.imgShow = function (event) {
                var imgDataURL = angular.element(event.target).attr('ng-src');
                if (angular.isUndefined(imgDataURL) || imgDataURL === null || imgDataURL === '') {
                    return;
                }
                imageViewBox.showImage(null, imgDataURL.replace(THUMBNAIL_SUFFIX, ''));
            };

            /**
             * 图片上传
             */
            $scope.imgUpdate = function () {
                $log.debug('将要上传的数据为：', $scope.widgetViewData, willDeleteArray);
                //记录上传index的数组
                var recordUpdateIndex = [];
                //是否允许上传
                if ($scope.isAllowUpload === false) {
                    return;
                }
                //回显图片删除
                initialImgDelete();
                //初始化formData对象
                var fd = new FormData();
                //上传处理
                angular.forEach($scope.widgetViewData, function (data, index) {
                    if (data.isUpload === true) {
                        recordUpdateIndex.push(data.name);
                        fd.append('file' + index, data.blob, data.fileName);
                    }
                });

                $http.post(appConfig.baseUrl + '/api/pile/dossier/upload/images', fd, {
                    headers: {'Content-Type': undefined}//,
                })
                    .success(function (data) {
                        $log.debug('uploaded ok..', data);
                        //调用上传成功方法
                        updateCompleteSuccess(data, recordUpdateIndex);
                        //打开下一个材料
                        // $scope.extendDetail($scope.materialDetailData.index + 1);
                    })
                    .error(function () {
                        $log.debug('uploaded error...');
                        //调用上传失败方法
                        updateCompleteError();
                        // $scope.updateResultMaterial({result: 'fail'});
                        $scope.successCtrl.isSuccess = false;
                    });
            };

            /**
             * 上传成功
             * @param data
             * @param recordUpdateIndex
             */
            var updateCompleteSuccess = function (data, recordUpdateIndex) {
                //缩略图后缀
                var THUMBNAIL_SUFFIX = '_150x150';
                //回显图片中转数组
                var imgDataUrlArray = [];
                //置空当前材料的imgDataUrl
                $scope.materialDetailData.imgDataUrl = [];
                //用于截取字符串的正则表达式
                var regex = /(\S+?:\/\/\S+?\/)(.+)/;

                if (data.status === true && data.uploadCount === recordUpdateIndex.length) {
                    $log.debug('上传成功且返回值无误', recordUpdateIndex);

                    //改变为上传成功状态
                    $scope.successCtrl = {'isSuccess': true, 'updateCount': $scope.widgetViewData.length};

                    //将控件操作数据分为原始、新增两部分
                    angular.forEach($scope.widgetViewData, function (wData) {
                        var sourceDataObj = {
                            'index': wData.name,
                            'descript': wData.descript,
                            'url': wData.dataURL
                        };

                        if (wData.dataURL.substring(0, 7) === 'http://') {
                            //去掉HTTP的host部分
                            sourceDataObj.url = regex.exec(sourceDataObj.url)[2];
                            //去掉缩略图尾部标记
                            // sourceDataObj.url.replace(THUMBNAIL_SUFFIX,'');
                            var urlObj = sourceDataObj.url.split(THUMBNAIL_SUFFIX);
                            sourceDataObj.url = urlObj[0] + urlObj[1];
                            urlObj = sourceDataObj.url.split(dossierContextVal + 'api/pile/dossier/download?filePath=');
                            sourceDataObj.url = urlObj[0] + urlObj[1];

                            $scope.materialDetailData.imgDataUrl.push(sourceDataObj);
                        } else {
                            imgDataUrlArray.push(sourceDataObj);
                        }
                    });

                    //将返回的相对URL存到中转数组中
                    angular.forEach(data.files, function (fileData, fileIndex) {
                        angular.forEach(imgDataUrlArray, function (newData, newIndex) {
                            if (fileIndex === newIndex) {
                                newData.url = fileData.url;
                                $scope.materialDetailData.imgDataUrl.push(newData);
                            }
                        });
                    });
                } else {
                    $log.debug('上传成功但返回值有误，上传失败项为', data.uploadCount + 1, '容器数量为：', $scope.widgetViewData.length);
                    messageBox.showError('上传失败:' + '第' + (data.uploadCount + 1) + '张图片上传失败，请重新上传');
                }
                //imgDataUrl排序并更新当前材料配置数据
                reSequence();
                //回写UI配置数组
                $scope.writeBackCallBack({materialDetailData: $scope.materialDetailData});
                $scope.updateResultMaterial({result: true});
                $log.debug('添加完的数组为：', $scope.materialDetailData.imgDataUrl);
            };

            /**
             * 将imgDataUrl重新排序并更新当前材料配置数据
             */
            var reSequence = function () {
                $scope.materialDetailData.imgDataUrl.sort(function (a, b) {
                    return a.index - b.index
                });
                $scope.materialDetailData.page = $scope.materialDetailData.imgDataUrl.length;
                $log.debug('重新排序后的imgDataUrl为：', $scope.materialDetailData.imgDataUrl, $scope.materialDetailData.page);
            };

            /**
             * 上传失败
             */
            var updateCompleteError = function () {
                messageBox.showError('材料' + $scope.materialDetailData.name + '上传失败:' + '请检查网络是否正常连接，如无误请联系管理员！');
            };

            /**
             * 初始图片删除
             */
            var initialImgDelete = function () {
                angular.forEach($scope.materialDetailData.imgDataUrl, function (originalData, index) {
                    angular.forEach(willDeleteArray, function (deleteIndex) {
                        if (originalData.index === deleteIndex) {

                            //删除图片存储服务器上的图片
                            $http.post(appConfig.baseUrl + '/pile/dossier/api/upload/images/delete', {
                                headers: {'Content-Type': undefined},
                                body: $scope.materialDetailData.imgDataUrl[index].url
                            })
                                .success(function () {
                                    $log.debug('delete' + $scope.materialDetailData.imgDataUrl[index].url + 'ok..');
                                })
                                .error(function () {
                                    $log.debug('delete error...');
                                });

                            //删除UI控制数组的回显URL
                            delete $scope.materialDetailData.imgDataUrl[index];
                        }
                    })
                });
                //初始化回显图片删除数组
                willDeleteArray = [];
                var aaa = angular.copy($scope.materialDetailData.imgDataUrl);
                $log.debug('删除完的数组为：', aaa);
            };
            $log.debug('imgUpdateMaterialController上传容器配置对象已经生成完毕：', $scope.widgetViewData);
        }]);
