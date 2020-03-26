/**
 * 批量申报列表显示组件
 * -----------------
 * 使用方式
 * ----------
 * Created by wuyf on 2015/6/28.
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule')
  //定义的时候注意开头小写
  .directive('sipubFileUploadList', function () {
    return {
      restrict: 'E',
      templateUrl: 'modules/common/directives/file-upload-list-directive/file-upload-list-view.html',
      scope: {
        errColumnDefs: '=',       //Grid errColumn定义
        applyType: '=',            //APPLY_TYPE 后台资源类型
        applyTypeValue: '=',      //APPLY_TYPE 后台资源类型
        rowCount: '=',             //总条数
        applyTypeFilter: '=',     //业务类型过滤条件
        editable: '@'              //是否可编辑
      },
      controller: 'SipubUploadFileListClr'
    };
  })
  .filter('fileUploadNameFilter',function () {
    return function (input) {
      return decodeURIComponent(input);
    }
  })
/**
 * 批量申报列表控制器
 */
  .controller('SipubUploadFileListClr', ['$scope', 'messageService', '$log', 'APPLY_APP_EVENT', 'ApplyResourceFactory',
    'messageBox', 'HRSS_APP_USER_DETAILS_CACHE','$interval',
    function ($scope, messageService, $log, APPLY_APP_EVENT, ApplyResourceFactory, messageBox, HRSS_APP_USER_DETAILS_CACHE, $interval) {

      // 定时器
      var timer;
      // 刷新时间间隔
      var times = 2000;
      // 是否启用刷新功能
      $scope.isEnableRefresh = true;
      var ApplyResource = ApplyResourceFactory.crtResource($scope.applyType);
      //查看结果控件模板
      var rltTemplete = '<a class=\'btn btn-primary\' ng-disabled=\'!row.entity.finish\' ng-click=\'grid.appScope.rlt(row.entity)\' title=\'结果\'>' +
        '<i class=\'glyphicon glyphicon-th-list\'>结果</i></a>';

      //单个刷新控件模板
      var refTemplete = '<a class=\'btn btn-warning\' ng-click=\'grid.appScope.refreshOne(row.entity)\' title=\'刷新\'>' +
        '<i class=\'glyphicon glyphicon-refresh\'>刷新</i></a>';

      //删除控件模板
      var delTemplete = '<a class=\'btn btn-danger\' ng-disabled=\'!row.entity.finish\' ng-click=\'grid.appScope.delete(row.entity)\' title=\'删除\'>' +
        '<i class=\'glyphicon glyphicon-remove\'>删除</i></a>';

      //显示清单
      $scope.uploadList = [];

      //描述申报清单显示方式
      $scope.listColumnDefs = [
        { field: 'fileName', displayName: '文件名称',headerCellClass: 'ngCellCenter',cellClass: 'ngCellCenter', width: 150,cellFilter: 'fileUploadNameFilter'},
        { field: 'total', displayName: '数据总量', headerCellClass: 'ngCellCenter',cellClass: 'ngCellCenter',width: 80},
        { field: 'step', displayName: '当前处理步骤', headerCellClass: 'ngCellCenter',cellClass: 'ngCellCenter',width: 120},
        { field: 'errCount', displayName: '错误数量',headerCellClass: 'ngCellCenter',cellClass: 'ngCellCenter', width: 90},
        { field: 'finish', displayName: '是否完成', cellFilter: 'BooleanToStringFilter',headerCellClass: 'ngCellCenter',cellClass: 'ngCellCenter', width: 90},
        { field: 'createDate', displayName: '创建时间', cellFilter: 'DateToStringFilter', headerCellClass: 'ngCellCenter',cellClass: 'ngCellCenter',width: 150},
        { field: 'finishDate', displayName: '处理完成时间', cellFilter: 'DateToStringFilter', headerCellClass: 'ngCellCenter',cellClass: 'ngCellCenter',width: 150}
      ];

      var setUploadList = function (list) {
        $log.debug('uploadList...', list);
        $scope.uploadList = list;
        $scope.rowCount = $scope.getRowCount();
        angular.forEach(list ,function (obj) {
          if(obj.step === 0){
            // 刷新功能
            if($scope.isEnableRefresh){
              $log.debug('刷新代码启用......',obj);
              // $scope.timerRefresh(obj);
            }
          }
        });
      };

      //申报清单Grid定义
      $scope.uploadListOptions = {
        data: 'uploadList',
        showSelectionCheckbox: false,
        multiSelect: false,
        enableColumnMenus: false,
        enableSorting: false,
        // enableGridMenu: true,
        // exporterOlderExcelCompatibility: true,//处理导出数据中文乱码问题
        // exporterMenuPdf: false,//ref ui-grid-exporter in html
        columnDefs: $scope.listColumnDefs
      };

      /**
       * 获取总条数
       * @returns {Number}
       */
      $scope.getRowCount = function () {
        return $scope.uploadList.length;
      };

      /**
       * 返回可操作列表定义
       * @returns {{field: string, displayName: string, cellTemplate: string, width: string}}
       */
      $scope.getOperations = function () {
        return { field: 'button',
          displayName: '操作功能',
          cellTemplate: '<div class=\'btn-group pull-left\'>' +
            refTemplete + //刷新按钮
            rltTemplete + //结果按钮
            delTemplete + //删除按钮
            '</div>',
          headerCellClass: 'ngCellCenter',
          cellClass: 'ngCellCenter',
          width: 240
        };
      };

      //初始化操作区
      $scope.uploadListOptions.columnDefs.push($scope.getOperations());

      //文件上传Session查询处理
      $scope.getUploadList = function () {
        var userDetail =  JSON.parse(localStorage.getItem(HRSS_APP_USER_DETAILS_CACHE.appUserDetailCache));
        //获取单位编号
        $log.debug('$scope.applyTypeValue is ' + $scope.applyTypeValue);
        ApplyResource.queryApplyFileUploadList(userDetail.companyId, $scope.applyTypeValue).$promise.then(function (data) {
          setUploadList(data);
        }, function (err) {
          messageBox.showError('查询当前批量申报清单失败，原因：' + err.data.detail);
        });
      };

      /**
       * 定时刷新
       * @param result
       */
      $scope.timerRefresh = function(result){
        $log.info('准备刷新...');
        // 循环的目的是为了取得Grid列表中的对应信息，从而可更新Grid的数据
        angular.forEach($scope.uploadList,function (obj) {
          // 获取ID相等的结果
          if(result.id === obj.id){
            // 定时器
            timer = $interval(function(){
              // step为当前执行的总数; total为数据总量
              if(obj.step !== obj.total){
                // 触发grid刷新方法
                $scope.refreshOne(obj);
              }else{
                // 停止刷新
                $scope.stopTimer();
              }
            },times);
          }
        });
      };

      $scope.stopTimer = function () {
        $log.info('刷新结束...');
        // 停止定义为“timer”的定时器
        $interval.cancel(timer);
      };

      /**
       * 响应报盘完成事件
       */
      $scope.$on(APPLY_APP_EVENT.fileUploadComplete, function (event,result) {
        $log.debug('接收到fileUploadComplete事件');
        //刷新清单
        $scope.getUploadList();
        $scope.rowCount = $scope.getRowCount();

      });

      //查看处理结果
      $scope.rlt = function (uploadSession) {
        $log.debug('查看处理结果', uploadSession);
        var modalDefaults = {
          backdrop: true,
          keyboard: true,
          modalFade: true,
          size: 'lg',
          scope: $scope,
          templateUrl: 'modules/common/directives/file-upload-result/view/file-upload-result.html'
        };
        var modalOptions = {
          uploadSessionId: uploadSession.id,
          columnDefs: $scope.errColumnDefs
        };
        return messageService.showModal(modalDefaults, modalOptions);
      };

      //查看处理结果
      $scope.refreshOne = function (uploadSession) {
        // 处理完毕
        if(uploadSession.step === uploadSession.total){
          $log.info('刷新结束......');
          $interval.cancel($scope.timer);
          return;
        }
        $log.debug('刷新某个处理结果', uploadSession);
        ApplyResource.queryUploadSession(uploadSession.id).$promise.then(function (data) {
          uploadSession.fileName = data.fileName;
          uploadSession.total = data.total;
          uploadSession.step = data.step;
          uploadSession.errCount = data.errCount;
          uploadSession.finish = data.finish;
          uploadSession.createDate = data.createDate;
          uploadSession.finishDate = data.finishDate;
        }, function (err) {
          messageBox.showError('刷新处理结果失败，原因：' + err.data);
        });
      };

      //删除处理结果
      $scope.delete = function (uploadSession) {
        $log.debug('删除某个处理结果', uploadSession);
        ApplyResource.deleteUploadSession(uploadSession.id).$promise.then(function () {
          //从列表当中删除
          $scope.uploadList.splice($scope.uploadList.indexOf(uploadSession), 1);
          messageBox.showInfo('删除成功！');
        });
      };
    }])
  .filter('DateToStringFilter', ['dateFilter', function (dateFilter) {
    return function (input) {
      return dateFilter(input, 'yyyy-MM-dd HH:mm:ss');
    };
  }])
  .filter('BooleanToStringFilter', function () {
    return function (input) {
      if (input) {
        return '是';
      } else {
        return '否';
      }
    };
  });