/**
 * 申报列表显示组件
 * -----------------
 * 使用方式
 * ----------
 *
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule')
//定义的时候注意开头小写
  .directive('sipubApplyList', function () {
    return {
      restrict: 'E',
      templateUrl: 'modules/common/directives/applylist-directive/apply-list-view.html',
      scope: {
        applyTypeValue: '=',       //APPLY_TYPE 后台资源类型
        listColumnDefs: '=',      //Grid Column定义
        applyType: '=',            //APPLY_TYPE 后台资源类型
        rowCount: '=',             //总条数
        applyTypeFilter: '=',     //业务类型过滤条件
        editable: '@',              //是否可编辑
        empsalarydtolist: '=',
        issubmitflag:'='
      },
      controller: 'SipubApplyListCtrl'
    };
  })
  /**
   *业务类型过滤器
   * applyRange=[] 业务类型数组
   */
  .filter('ApplyListTypeFilter', [function () {
    //判断业务类型是否包含
    return function (item, applyRange) {
      if (!item) {
        return item;
      }
      for (var i = 0; i < applyRange.length; i++) {
        if (applyRange[i] === item.applyType) {
          return item;
        }
      }
      return null;
    };
  }])
  /**
   * 申报列表控制器
   */
  .controller('SipubApplyListCtrl', ['EmpSalaryService','$timeout','$scope', '$log', 'APPLY_APP_EVENT', 'ApplyResourceFactory',
    'messageBox', '$rootScope', '$filter', 'HRSS_APP_USER_DETAILS_CACHE',
    function (EmpSalaryService,$timeout,$scope, $log, APPLY_APP_EVENT, ApplyResourceFactory, messageBox, $rootScope, $filter, HRSS_APP_USER_DETAILS_CACHE) {
      var ApplyResource = ApplyResourceFactory.crtResource($scope.applyType);
      //删除控件模板
      var deleteTemplete = '<a class=\'btn btn-delet mar_r10p\' ng-click=\'grid.appScope.delete(row.entity)\' title=\'删除\'>' +
        '<i class=\'glyphicon glyphicon-remove\'>删除</i></a>';

      //编辑控件模板
      var editTemplete = '<a class=\'btn btn-blue\' ng-click=\'grid.appScope.edit(row.entity)\' title=\'修改\'>' +
        '<i class=\'glyphicon glyphicon-pencil\'>修改</i></a>';

        //删除控件模板--工资申报删除
        var deleteTempleteforEmpSalary = '<a class=\'btn btn-delet mar_r10p\' ng-click=\'grid.appScope.deleteForEmpSalary(row.entity)\' title=\'删除\'>' +
            '<i class=\'glyphicon glyphicon-remove\'>删除</i></a>';


        //显示清单
      $scope.applyList = [];

      // // 响应时间事件
      // $scope.$on('theDetail', function (event, apply) {
      //     $scope.theDetail = apply;
      // });

      /**
       * 按业务类型过滤
       * @param data
       */
      var filterApplyList = function (data) {
        if ($scope.applyTypeFilter === null || angular.isUndefined($scope.applyTypeFilter)) {
          return data;
        } else {
          var result = [];
          angular.forEach(data, function (item) {
            var obj = $filter('ApplyListTypeFilter')(item, $scope.applyTypeFilter);
            if (obj !== null) {
              result.push(item);
            }
          });
          return result;
        }
      };

      /**
       * 按业务类型过滤
       * @param data
       * @returns {*}
       */
      var filterApply = function (data) {
        if ($scope.applyTypeFilter === null || angular.isUndefined($scope.applyTypeFilter)) {
          return data;
        } else {
          return $filter('ApplyListTypeFilter')(data, $scope.applyTypeFilter);
        }
      };

      var setApplyList = function (list) {
        $scope.applyList = filterApplyList(list);
        $scope.rowCount = $scope.getRowCount();
      };

      //申报清单Grid定义
      $scope.applyListOptions = {
        data: 'applyList',
        enableColumnMenus: false,
        enableSorting: false,
        rowHeight: 35,
        columnDefs: $scope.listColumnDefs,
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          $scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 200);
        }
      };

      $scope.filter = function () {
        $scope.gridApi.grid.refresh();
      };

      $scope.singleFilter = function (renderableRows) {
        var matcher = new RegExp($scope.filterValue);
        $log.debug('过滤值', $scope.filterValue);
        renderableRows.forEach(function (row) {
          var match = false;
          if($scope.applyTypeValue==='1103' || $scope.applyTypeValue==='1117'){
              ['aac002', 'aac003'].forEach(function (field) {
                if (row.entity[field] !== null && row.entity[field].match(matcher)) {
                  match = true;
                }
              });
          }else if ($scope.applyTypeValue==='1110') {
              match = true;
          }else{
              ['name', 'idNumber'].forEach(function (field) {
                  if (row.entity[field] !== null && row.entity[field].match(matcher)) {
                      match = true;
                  }
              });
          }
          if (!match) {
            row.visible = false;
          }
        });
        return renderableRows;
      };

      /**
       * 获取总条数
       * @returns {Number}
       */
      $scope.getRowCount = function () {
        return $scope.applyList.length;
      };

      /**
       * 返回可操作列表定义
       * @returns {{field: string, displayName: string, cellTemplate: string, width: string}}
       */
      $scope.getOperations = function () {
            return {
                field: 'button',
                displayName: '操作功能',
                cellTemplate:  '<div class=\'btn-group\'>' +
                ($scope.editable === 'true' ? editTemplete : '') + //修改按钮
                '</div>'+'<div class=\'btn-group\'>' +
                  deleteTemplete + //删除按钮
                '</div>',
                headerCellClass: 'ngCellCenter',
                cellClass: 'ngCellCenter',
                width: "*"
            };
        };
        $scope.getOperationsForEmpSalary = function () {
            return {
                field: 'button',
                displayName: '操作功能',
                cellTemplate:  '<div class=\'btn-group pull-left\'>' +
                ($scope.editable === 'true' ? editTemplete : '') + //修改按钮
                '</div>'+'<div class=\'btn-group pull-left\'>' +
                ($scope.editable === 'false' ? deleteTempleteforEmpSalary : '') + //删除按钮
                '</div>',
                headerCellClass: 'ngCellCenter',
                cellClass: 'ngCellCenter',
                width: "*"
            };
        };
      if($scope.applyTypeValue==='1103'){
          $scope.applyListOptions.columnDefs.push($scope.getOperationsForEmpSalary());
          //职工工资申报不允许修改
      }else if($scope.applyTypeValue==='1117'){
      }else{
          //初始化操作区
          $scope.applyListOptions.columnDefs.push($scope.getOperations());
      }
      //过滤条件添加回车事件
      $scope.myKeyup = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode === 13) {
          $scope.filter();
        }
      };
      //响应文件上传成功事件
      $rootScope.$on(APPLY_APP_EVENT.fileUploadComplete ,function(){
        $timeout(function(){
          $scope.getApplyList();
        },100);
      });
      //查询当月已申报清单
      $scope.getApplyList = function () {
        var userDetail = JSON.parse(localStorage.getItem(HRSS_APP_USER_DETAILS_CACHE.appUserDetailCache));
        if($scope.issubmitflag===true && ($scope.applyTypeValue==='1103' || $scope.applyTypeValue==='1117')){//如果是已提交的，获取已提交数据
            setApplyList($scope.empsalarydtolist);
        }else{

            //获取单位编号
            ApplyResource.queryUnsubmitApply(userDetail.companyId).$promise.then(function (data) {
                $log.debug('查询申报列表结果', data);
                //如果是职工工资收入申报，这里显示的是职工的信息
                if($scope.applyTypeValue==='1103'){
                    if(data!==undefined && data!==null && data.length!==0){
                        for(var i=0;i<data[0].empSalaryDTOList.length;i++){
                            data[0].empSalaryDTOList[i].createDate=data[0].createDate;
                            data[0].empSalaryDTOList[i].submitStatus=data[0].submitStatus;
                            data[0].empSalaryDTOList[i].applyId=data[0].applyId;
                        }
                        setApplyList(data[0].empSalaryDTOList);
                        $rootScope.$broadcast('eventIdForSpotCheck',data[0].applyId);
                    }
                }else if($scope.applyTypeValue==='1117'){
                    if(data!==undefined && data!==null && data.length!==0){
                        for(var i=0;i<data[0].enterRecordDetailDTOList.length;i++){
                            data[0].enterRecordDetailDTOList[i].createDate=data[0].createDate;
                            data[0].enterRecordDetailDTOList[i].submitStatus=data[0].submitStatus;
                            data[0].enterRecordDetailDTOList[i].applyId=data[0].applyId;
                        }
                        setApplyList(data[0].enterRecordDetailDTOList);
                    }
                }else{
                    setApplyList(data);
                }
            }, function (err) {
                messageBox.showError('查询当月已申报清单失败，原因：' + err.data);
            });
        }
      };

      //删除申报记录
      $scope.delete = function (apply) {
        $log.info('删除申报', apply);
        apply.$delete({id: apply.applyId}).then(function () {
          //从列表当中删除
          $scope.applyList.splice($scope.applyList.indexOf(apply), 1);
          $scope.rowCount = $scope.getRowCount();
          messageBox.showInfo('删除申报成功！');
        });
      };

        //删除工资一条人员信息申报记录
        $scope.deleteForEmpSalary = function (data) {

            $log.info('删除申报', data);
            var item = EmpSalaryService.createApply(data);
            EmpSalaryService.deleteApply(item).$promise.then(function () {
                $scope.applyList.splice($scope.applyList.indexOf(data), 1);
                $scope.rowCount = $scope.getRowCount();
                //发布新增申报成功事件
                messageBox.showInfo('职工工资申报删除成功！');
                // $scope.tabs = {apply: false, upload: false, applyList: true};
            }, function (err) {
                messageBox.showError('职工工资申报删除失败！' + err.data.detail);
            });
        };

      /**
       * 修改申报
       * @param apply
       */
      $scope.edit = function (row) {
        $log.debug('修改申报');
        raiseEditApplyEvent(angular.copy(row));
      };

      /**
       * 响应增加申报事件
       */
      $scope.$on(APPLY_APP_EVENT.createNewApply, function (event, apply) {
        $log.debug('SipubApplyListClr接收到createNewApply事件', apply);
        //添加到已经申报清单
        if (filterApply(apply) !== null) {
          $scope.applyList.push(apply);
          $scope.rowCount = $scope.getRowCount();
        }
      });
        /**
         * 响应修改申报事件
         */
        $scope.$on(APPLY_APP_EVENT.modifyApplyComplete, function (event, apply) {
            $log.debug('SipubApplyListClr接收到createNewApply事件', apply);
            //添加到已经申报清单
            if (filterApply(apply) !== null) {
              angular.forEach($scope.applyList,function (item,i) {
                if(item.applyId===apply.applyId){
                    $scope.applyList[i]=apply;
                }
              });
                $scope.rowCount = $scope.getRowCount();
            }
        });

      /**
       * 响应报盘完成事件
       */
      $scope.$on(APPLY_APP_EVENT.fileUploadSessionFinish, function () {
        $log.debug('SipubApplyListClr接收到fileUploadSessionFinish事件');
        //刷新清单
        $scope.getApplyList();
        $scope.rowCount = $scope.getRowCount();
      });

      /**
       * 广播修改事件
       * @param apply
       */
      function raiseEditApplyEvent(apply) {
        $log.log('广播修改申报事件', apply);
        $rootScope.$broadcast(APPLY_APP_EVENT.modifyApply, apply);
      }
    }]);
