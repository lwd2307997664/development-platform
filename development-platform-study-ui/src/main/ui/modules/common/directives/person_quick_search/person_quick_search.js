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
  .directive('sipubPersonQuickSearch', function () {
    return {
      restrict: 'E',
      templateUrl: 'modules/common/directives/person_quick_search/person_quick_search_input.html',
      scope: {
        personSelectCallback: '&',    //回调方法
        idNumber: '=',                  //idNumber 双向绑定
        isEnable: '=',                   //是否可用
        isAll: '=',                      // 是否查询单位下所有人员
        isDeclareMapFlag: '='        //是否是从人员二级界面跳转过来的
      },
      controller: 'SipubPersonQuickSearchCtrl'
    };
  })
  /**
   * 快速查询控件控制器
   */
  .controller('SipubPersonQuickSearchCtrl', ['$rootScope','HRSS_APP_USER_DETAILS_CACHE', '$scope', '$log', 'messageBox',
    'PersonService', '$uibModal',
    function ($rootScope,HRSS_APP_USER_DETAILS_CACHE, $scope, $log, messageBox, PersonService, $uibModal) {
      //缓存重复性判断idnumber
      $scope.cacheIdNumber = null;
      // $scope.isEnable = true;

      /**
       * 如果enable变化，重置缓存
       */
      $scope.$watch('isEnable', function (newValue, oldValue) {
        if (oldValue === newValue) {
          return;
        }
        $scope.cacheIdNumber = null;
      }, true);

      $scope.$watch('idNumber', function (newValue) {
        if (null === newValue || undefined === newValue) {
          $scope.cacheIdNumber = null;
        }
      }, true);


      /**
       * 显示人员快速查询窗口
       */
      $scope.showPersonQuickSearch = function () {
        var modalInstance = $uibModal.open({
          templateUrl: 'modules/common/directives/person_quick_search/person_quick_search_dialog_view.html',
          controller: 'PersonQuickSearchDialogCtrl',
          size: 'lg',
          resolve: {
            Condition: function () {
              return {isAll: $scope.isAll}
            }
          }
        });
        modalInstance.result.then(function (data) {
          $log.debug('SipubPersonQuickSearchCtrl:', data, $scope.personSelectCallback);
          $scope.personSelectCallback({person: data});
        });
      };
      /**
       * 按身份证号查询
       * @param idNumber
       */
      $scope.search = function (idNumber) {
        $log.debug('SipubPersonQuickSearchCtrl按证件号码查询:', idNumber);
        if (idNumber === null || angular.isUndefined(idNumber) || idNumber === '') {
            $rootScope.$broadcast('isDeclareMapFlag', $scope.isDeclareMapFlag);
          return;
        }
        if ($scope.cacheIdNumber === idNumber) {
          return;
        }
        //缓存只查询一次
        $scope.cacheIdNumber = idNumber;
        var userDetail = JSON.parse(localStorage.getItem(HRSS_APP_USER_DETAILS_CACHE.appUserDetailCache));
        var companyId = userDetail.companyId;
        PersonService.findPerson(companyId, null,
          null, $scope.idNumber,$scope.isAll).$promise.then(function (result) {
            $log.debug('查询到人员信息', result);
            if (result.length > 1) {
              messageBox.showInfo('查询到多条人员信息');
              return;
            } else {
              $scope.personSelectCallback({person: result[0]});
            }
          }, //失败回调
          function (err) {
              $rootScope.$broadcast('isDeclareMapFlag', $scope.isDeclareMapFlag);
              if(err.data.detail){
                  messageBox.showInfo(err.data.detail);
              }else{
                  messageBox.showInfo("查询人员信息失败");
              }
            // $scope.personSelectCallback({person: {aac147:idNumber}});
          });
      };
    }])
  /**
   * 快速查询Dialog控制器
   */
  .controller('PersonQuickSearchDialogCtrl', ['$scope', '$uibModalInstance', '$log', 'HRSS_APP_USER_DETAILS_CACHE', 'messageBox', 'PersonService','Condition',
    function ($scope, $uibModalInstance, $log, HRSS_APP_USER_DETAILS_CACHE, messageBox, PersonService,Condition) {
      //查询参数对象
      var crtQueryParam = function () {
        return {
          aac999: null,
          aac147: null,
          aac003: null,
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
            return '编号=' + this.aac999 + '证件号=' + this.aac147 + '姓名=' + this.aac003;
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
        var companyId = userDetail.companyId;
        //如果没有录入查询条件
        if (!$scope.queryParam.hasInput()) {
          $scope.warningMsg = '请至少录入一项查询条件';
          return;
        }
        $log.debug('查询条件 companyId=' + companyId + $scope.queryParam.toString());
        angular.element('#searchApply').attr('disabled', true);
        angular.element('#searchApply').attr('value', "查询中...");
        PersonService.findPerson(companyId, $scope.queryParam.aac999,
          $scope.queryParam.aac003, $scope.queryParam.aac147,Condition.isAll).$promise.then(function (data) {
          $scope.warningMsg = null;
          $log.info('查询结果', data);
          $scope.pageObject = data;
          $scope.totalItems = data.length;
          angular.element('#searchApply').attr('disabled', false);
          angular.element('#searchApply').attr('value', "查询");
        }, function (err) {
          $scope.pageObject = '';
          $scope.totalItems = 0;
          $log.debug('错误信息', err);
          $scope.warningMsg = err.data.detail;
          angular.element('#searchApply').attr('disabled', false);
          angular.element('#searchApply').attr('value', "查询");
        });
      };

      /**
       * 确定
       */
      $scope.ok = function () {
        if ($scope.selection.length !== 1) {
          $scope.warningMsg = '请选择需要的人员信息';
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
