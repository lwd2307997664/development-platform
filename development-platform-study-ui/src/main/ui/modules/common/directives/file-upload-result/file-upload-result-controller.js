/**
 * Created by mojf on 2015/1/17.
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule')
  .controller('UploadResultCtrl', ['$scope', '$log', '$timeout', 'ApplyResourceFactory', 'APPLY_APP_EVENT', '$rootScope', 'messageBox',
    function ($scope, $log, $timeout, ApplyResourceFactory, APPLY_APP_EVENT, $rootScope, messageBox) {
      var ApplyResource = ApplyResourceFactory.crtResource($scope.applyType);
      $scope.uploadSummary = {};
      $scope.errMsg = [];
      $scope.uploadResultOptions = {
        data: 'errMsg',
        multiSelect: false,
        selectedItems: [],
        enableColumnMenus: false,
        enableSorting: false,
        enableGridMenu: true,
        exporterOlderExcelCompatibility: true,//处理导出数据中文乱码问题
        exporterMenuPdf: false,//ref ui-grid-exporter in html
        exporterFieldCallback:function( grid, row, col, value ) {
          $log.debug('col',col,value);
          if (col.field === 'certificateNumber' || col.field === 'idNumber' || col.field === 'aac002') {
            if(value.substring(17).toLocaleUpperCase() !== 'X'){
              value='="'+value+'"';
            }
          }
          return value;
        }
      };
      //grid动态赋值
      $scope.uploadResultOptions.columnDefs = $scope.modalOptions.columnDefs;
      $scope.showUploadResult = function () {
        ApplyResource.queryUploadFileResult($scope.modalOptions.uploadSessionId).$promise.then(function (result) {
          $log.debug('处理失败', result.errorList);
          //如果上传成功
          if (result.total - result.errCount > 0) {
            //发布上传申报成功事件
            raiseFileUploadSessionFinishEvent();
          }
          $scope.uploadSummary = result;
          $scope.errMsg = result.errorList;
        }, function (err) {
          messageBox.showError('查看处理结果失败，原因：' + err.data.detail);
        });
      };
      /**
       * 广播文件上传完成事件
       * @param user
       */
      function raiseFileUploadSessionFinishEvent() {
        $log.log('广播报盘处理完成事件');
        $rootScope.$broadcast(APPLY_APP_EVENT.fileUploadSessionFinish);
      }
    }]);
