'use strict';
/**
 * 快速查询封装控件
 * ------------------
 * 使用方式
 * ----------
 *<div class="col-md-3">
 *   <sipub-person-quick-search is-enable="personQuickSearchEnable"
 *   id-number="testNumber" person-select-callback="personSelected(person)">
 *   </sipub-person-quick-search>
 *</div>
 * 属性说明
 * is-enable: 控制控件是否可用
 * id-number:绑定scope中的身份证号变量
 * person-select-callback: 人员选择以后的回调方法(注意方法名可以随意，但是入参必须是 xxx(person) )
 *
 */
angular.module('hrss.si.enterprise.directivesModule')
//定义的时候注意开头小写
  .directive('sipubAdminQuickSearch', function () {
    return {
      restrict: 'E',
      templateUrl: 'modules/common/directives/admin_region_quick_search/admin_region_quick_search_input.html',
      scope: {
        adminSelectCallback: '&',    //回调方法
        adminNumber: '=',                  //adminNumber 双向绑定
        isEnable: '='  ,                 //是否可用
        bae140: '='                 //确定是养老还是医疗的标识，养老（1），医疗（3）
      },
      controller: 'sipubAdminQuickSearchCtrl'
    };
  })
  /**
   * 快速查询控件控制器
   */
  .controller('sipubAdminQuickSearchCtrl', ['$rootScope','$scope', '$log', 'messageBox',
    'PersonService', '$uibModal','HRSS_APP_USER_DETAILS_CACHE',
    function ($rootScope,$scope, $log, messageBox, PersonService, $uibModal,HRSS_APP_USER_DETAILS_CACHE) {
      //缓存重复性判断adminNumber
      $scope.cacheAdminNumber = null;
      // $scope.isEnable = false;
      /**
       * 如果enable变化，重置缓存
       */
      $scope.$watch('isEnable', function (newValue, oldValue) {
        if (oldValue === newValue) {
          return;
        }
        $scope.cacheAdminNumber = null;
      }, true);

      $scope.$watch('adminNumber', function (newValue) {
        if (null === newValue || undefined === newValue) {
          $scope.cacheAdminNumber = null;
        }else{
          $scope.isEnable=true;
        }
      }, true);

      $scope.$watch('bae140', function (newValue) {
          $scope.bae140=newValue;
      }, true);

        $scope.$on('focus', function (event) {
            $log.debug('focus');
            document.getElementById('focus').focus();
        });

      /**
       * 显示人员快速查询窗口
       */
      $scope.showPersonQuickSearch = function () {
        var modalInstance = $uibModal.open({
          templateUrl: 'modules/common/directives/admin_region_quick_search/admin_region_quick_search_dialog_view.html',
          controller: 'AdminQuickSearchDialogCtrl',
          size: 'lg',
          $scope: $scope,
          resolve: {
              bae140: function () {
                  return $scope.bae140;
              }
          }
        });
        modalInstance.result.then(function (data) {
          $log.debug('sipubAdminQuickSearchCtrl:', data, $scope.adminSelectCallback);
          $scope.adminSelectCallback({person: data});
        });
      };

      /**
       * 按行政代码查询
       * @param adminNumber
       */
      $scope.search = function (adminNumber) {
        $log.debug('sipubAdminQuickSearchCtrl按行政代码查询:', adminNumber);
        if (adminNumber === null || angular.isUndefined(adminNumber) || adminNumber === '') {
          return;
        }
        if ($scope.cacheAdminNumber === adminNumber) {
          return;
        }
        //缓存只查询一次
        $scope.cacheAdminNumber = adminNumber;
        var userDetail = JSON.parse(localStorage.getItem(HRSS_APP_USER_DETAILS_CACHE.appUserDetailCache));
        var companyId = userDetail.id;
      };
    }])
  /**
   * 快速查询Dialog控制器
   */
  .controller('AdminQuickSearchDialogCtrl', ['$scope','AdminService','bae140','selectCodeLoader', '$uibModalInstance', '$log', 'HRSS_APP_USER_DETAILS_CACHE', 'messageBox',
    function ($scope,AdminService,bae140,selectCodeLoader, $uibModalInstance, $log, HRSS_APP_USER_DETAILS_CACHE, messageBox) {
    $scope.bae140=bae140;
    //查询参数对象
      var crtQueryParam = function () {
        return {
          originalAgencyState: "",
          originalAgencyStateName: "",
          //是否录入查询条件
          hasInput: function () {
            for (var item in this) {
              if (angular.isFunction(this[item])) {
                continue;
              }
              if (this[item] !== null && this[item] !== '' && this[item] !== 'undefined') {
                return true;
              }
            }
            return false;
          },
          toString: function () {
            return '行政编码=' + this.originalAgencyState+this.originalAgencyStateName;
          }
        };
      };

      //定义每页大小
      $scope.pageSize = 10;
      //选择提示警告
      $scope.warningMsg = null;
      //已经选中
      $scope.selection = [];
      //选择切换
      $scope.toggleSelection = function (item) {
        $log.debug('点击选择', item);
        var idx = $scope.selection.indexOf(item);
        // is currently selected
        if (idx > -1) {
          $scope.selection.splice(idx, 1);
        }
        // is newly selected
        else {
          $scope.selection = [];
          $scope.selection.push(item);
        }
        $uibModalInstance.close($scope.selection[0]);
      };
      //是否被选择
      $scope.isSelected = function (item) {
        return $scope.selection.indexOf(item) >= 0;
      };
      //获得被选择的css class
      $scope.getSelectedClass = function (item) {
        return $scope.isSelected(item) ? 'success' : '';
      };
      //关闭提示警告
      $scope.closeWaring = function () {
        $scope.warningMsg = null;
      };

      //页面显示清单
      $scope.pageObject = [];
      //查询条件
      $scope.queryParam = crtQueryParam();
      $scope.totalItems = 0;
      //当前页面（初始化为第一页）
      $scope.currentPage = 1;
      $scope.searchApply = function () {
        //重置错误提示
        $scope.warningMsg = null;
        var userDetail = JSON.parse(localStorage.getItem(HRSS_APP_USER_DETAILS_CACHE.appUserDetailCache));
        var companyId = userDetail.id;
        //如果没有录入查询条件
        if (!$scope.queryParam.hasInput()) {
          $scope.warningMsg = '请录入您要模糊查询的字段';
          // return;
        }
        $log.debug('查询条件 companyId=' + companyId + $scope.queryParam.toString());
        angular.element('#searchApply').attr('disabled', true);
        angular.element('#searchApply').attr('value', "查询中...");
          AdminService.findAdminInfo($scope.queryParam.originalAgencyState, $scope.queryParam.originalAgencyStateName,$scope.bae140).$promise.then(function (result) {
              $log.debug('查询结果', result);
              var list=result;
              if(list!==null && list.length!==0){
                  $scope.pageObject = list;
                  $scope.totalItems = list.length;
                  angular.element('#searchApply').attr('disabled', false);
                  angular.element('#searchApply').attr('value', "查询");
              }else{
                  $scope.pageObject = '';
                  $scope.totalItems = 0;
                  $scope.warningMsg = "未查询到对应社保机构信息！";
                  angular.element('#searchApply').attr('disabled', false);
                  angular.element('#searchApply').attr('value', "查询");
              }

          },function (err) {

          });
        //       //二级代码
        // selectCodeLoader.loadCodeList().then(function (codeList) {
        //   var list=codeList.codeList.AAB301;
        //   if($scope.queryParam.aab301===null || $scope.queryParam.aab301===''){
        //     if(list!==null && list.length!==0){
        //       $scope.pageObject = list;
        //       $scope.totalItems = list.length;
        //       angular.element('#searchApply').attr('disabled', false);
        //       angular.element('#searchApply').attr('value', "查询");
        //     }else{
        //       $scope.pageObject = '';
        //       $scope.totalItems = 0;
        //       $scope.warningMsg = "未查询到行政区划代码！";
        //       angular.element('#searchApply').attr('disabled', false);
        //       angular.element('#searchApply').attr('value', "查询");
        //     }
        //   }else{
        //     if(list!==null && list.length!==0){
        //       var array=[];
        //       for(var i=0;i<list.length;i++){
        //         if(list[i].name.indexOf($scope.queryParam.aab301)!==-1){
        //           array.push(list[i]);
        //         }
        //       }
        //       $scope.pageObject = array;
        //       $scope.totalItems = array.length;
        //       angular.element('#searchApply').attr('disabled', false);
        //       angular.element('#searchApply').attr('value', "查询");
        //     }else{
        //       $scope.pageObject = '';
        //       $scope.totalItems = 0;
        //       $scope.warningMsg = "未查询到行政区划代码！";
        //       angular.element('#searchApply').attr('disabled', false);
        //       angular.element('#searchApply').attr('value', "查询");
        //     }
        //   }
        // });
      };

      /**
       * 确定
       */
      $scope.ok = function () {
        if ($scope.selection.length !== 1) {
          $scope.warningMsg = '请选择需要的社保机构信息';
          return;
        }
        $uibModalInstance.close($scope.selection[0]);
      };

      /**
       * 取消
       */
      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    }]);
