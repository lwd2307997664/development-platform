/**
 * 图片上传（上传容器部分）
 *
 * @author Erwin
 * @date 2016/2/4
 */
'use strict';

angular.module('hrss.si.enterprise.directivesModule')
  .directive('imgUpdateWidget', [function () {
    var directive = {
      templateUrl: 'modules/common/directives/dossierUpdate/imgUpdateWidget/imgUpdateWidget.html',
      restrict: 'E',
      scope: {
        widgetData: '=',
        deleteWidgetCallBack: '&deleteWidget',
        changeWidgetValueCallBack: '&changeWidgetValue',
        isAllowDelete: '=isAllowDelete',
        isView: '='
      },
      controller: 'imgUpdateWidgetController'
    };
    return directive;
  }])
  .controller('imgUpdateWidgetController', ['$scope', '$log', 'imageViewBox', '$uibModal', 'messageBox','imageCropperService',
    function ($scope, $log, imageViewBox, $uibModal, messageBox,imageCropper) {
      //初始化容器显示对象
      $scope.widget = {'compressed': {'dataURL': null}};
      $scope.widget.compressed.dataURL = $scope.widgetData.dataURL;
      //缩略图后缀
      var THUMBNAIL_SUFFIX = '_150x150';
      //是否是pdf
      $scope.isPdf = false;
      // isLoad ,为了避免img标签加载pdf流
      $scope.isLoad = false;

      $log.debug('widgetData', $scope.widgetData);

      /**
       * 根据字体长度和颜色生成ICON
       * @param fontStr
       * @param color
       * @returns {*|string}
       */
      function createCanvasImg(fontStr, color) {
        var canvas = document.createElement('canvas');

        var context = canvas.getContext('2d');
        canvas.width = 90;
        canvas.height = 90;
        context.font = 'bold 22px Arial Black';
        context.fillStyle = color;
        context.fillRect(0, 0, 90, 90);
        context.fillStyle = "#fff";
        context.fillText(fontStr, 20, 53);
        return canvas.toDataURL("image/png");
      }

      function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]); else byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {type: mimeString});
      }

      /**
       * 监听图片容器的值是否改变
       */
      $scope.$watch('widget.compressed.dataURL', function (newValue, oldValue) {

          // pdf文件长度校验
          if (newValue && $scope.isPdf) {
              if (angular.isDefined($scope.widget.file) && $scope.widget.file.size > 1024 * 1024) {
                $scope.isPdf = false;
                $scope.isLoad = false;
                messageBox.showError('上传PDF格式的电子材料不能超过1M');
                return;
              }
          }

          if (newValue !== oldValue) {

            if (oldValue != null && oldValue.substring(0, 4) === 'http') {
              $log.debug('您变更的图片为原有赋值图片');
              $scope.changeWidgetValueCallBack({obj: {name: $scope.widgetData.name, isDelete: true}});
            }
            if (angular.isDefined(newValue) && angular.isDefined($scope.widget.file)) {
              if (angular.isDefined($scope.widget.compressed.getBlob()) && $scope.widget.compressed.getBlob() != null) {
                $scope.changeWidgetValueCallBack({
                  obj: {
                    name: $scope.widgetData.name,
                    'dataURL': $scope.widget.compressed.dataURL,
                    blob: $scope.widget.compressed.getBlob(),
                    fileName: $scope.widget.file.name,
                    'isUpload': true
                  }
                });
              }
            } else if (angular.isDefined(newValue) && angular.isUndefined($scope.widget.file)) {
              // 接高拍仪
              $scope.changeWidgetValueCallBack({
                obj: {
                  name: $scope.widgetData.name,
                  'dataURL': $scope.widget.compressed.dataURL,
                  blob: dataURItoBlob($scope.widget.compressed.dataURL),
                  fileName: 'camera.png',
                  'isUpload': true
                }
              });
            } else {
              $log.debug('图片已经删除');
              $scope.changeWidgetValueCallBack({
                obj: {
                  name: $scope.widgetData.name,
                  'dataURL': null,
                  blob: null,
                  fileName: null,
                  'isUpload': false
                }
              });
            }
          }
          $scope.isLoad = true;

          // 根据当前的资源，判断当前的文件是否未pdf
          if (newValue) {
            if (newValue.substring(0, 4) === 'http') {
              var splitArr = newValue.split('.');
              $scope.isPdf = splitArr[splitArr.length - 1].toLocaleUpperCase() === 'PDF';
            }
          }

          if ($scope.isPdf) {
            $scope.pdfImg = createCanvasImg('PDF', '#ff654b');
          }
        }
      );

      /**
       * 监听descript的值是否改变
       */
      $scope.$watch('widgetData.descript', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          $log.debug('hehehehe:', $scope.widgetData);
          $scope.widgetData.descript = newValue.replace($scope.widgetData.desc.pattern, '')
        }
      });

      /**
       * 删除图片和容器
       * @param evt
       */
      $scope.imgDelete = function (evt) {
        //是否可以删除
        if ($scope.isAllowDelete === true) {
          $log.debug('该材料为固定页数');
          return;
        }
        //选中的图片
        var selectImgData;
        //当前选中容器中的图片
        selectImgData = angular.element(evt.target).parent().children()[2].getAttribute('ng-src');
        $log.debug('您要删除的图片为：', $scope.widget.compressed.dataURL, $scope.widgetData.name);
        if (selectImgData != null && selectImgData.substring(0, 7) === 'http://') {
          $log.debug('您删除的图片为原有赋值图片');
          $scope.changeWidgetValueCallBack({obj: {name: $scope.widgetData.name, isDelete: true}});
        }
        delete $scope.widget.compressed.dataURL;
        $scope.deleteWidgetCallBack({obj: {name: $scope.widgetData.name}});
      };


      /**
       * 图片弹出显示
       * @param event
       */
      $scope.imgShow = function (event) {
        $log.debug('页面弹出啦：', event);
        /**
         * 根据文件展示文件
         * @param URI
         * @returns {*}
         */
        var showFile = function (URI) {
          return $scope.isPdf ? imageCropper.showPDF(null, URI) : imageCropper.showImage(null, URI);
        };

        // 文件资源
        var dataURL = $scope.isPdf ? $scope.widget.compressed.dataURL : angular.element(event.target).attr('ng-src');
        if (angular.isUndefined(dataURL) || dataURL === null || dataURL === '') {
          return;
        }

        if (dataURL.indexOf('http://') !== -1) {
          showFile(dataURL.replace(THUMBNAIL_SUFFIX, ''));
        } else {
          showFile(dataURL);
        }
      };


      /**
       * 打开上传页
       */
      $scope.openPage = function () {

        $uibModal.open({
          templateUrl: 'modules/common/directives/dossierUpdate/imgUpdateCamera/imgUpdateCamera.html',
          controller: 'imgUpdateCameraController',
          size: 'lg',
          backdrop: 'static',
          resolve: {
            widgetId: function () {
              return angular.copy($scope.widgetData.name);
            }
          }
        }).result.then(function (photoData) {
          $log.debug('返回页面结果：', photoData);
          $scope.widget.compressed.dataURL = photoData;
        }, function (reason) {
          console.log('弹出页已关闭', reason);
          $log.info('Modal dismissed at: ' + new Date());

        });

      };


      ////接收图片弹出广播
      //$scope.$on('imgUpdateImgShow', function (obj, event) {
      //  if($scope.widgetData.name===event.id){
      //    $log.debug('接收到弹出广播：');
      //    $scope.imgShow(event);
      //  }
      //});
    }]);
