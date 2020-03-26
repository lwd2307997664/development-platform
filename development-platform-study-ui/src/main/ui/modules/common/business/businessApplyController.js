/**
 * 业务申报
 * Created by WangXg on 2017/12/25.
 */
'use strict';
angular.module('hrss.si.enterprise.businessModule')
  .controller('BusinessApplyModuleCtrl', ['$scope', '$log', '$routeParams', '$rootScope', '$timeout', 'APPLY_APP_EVENT', 'APPLY_TYPE', 'BusinessApplyConfig',
    function ($scope, $log, $routeParams, $rootScope, $timeout, APPLY_APP_EVENT, APPLY_TYPE, BusinessApplyConfig) {

      $scope.tabs = {apply: true, upload: false, applyList: false};
      $scope.activeApplyView = function () {
        $scope.tabs = {apply: true, upload: false, applyList: false};
      };

      //申报类型
      $scope.applyType = $routeParams.applyType;
      $scope.businessConfig = BusinessApplyConfig.getBusiness($scope.applyType);
      $scope.viewPath = $scope.businessConfig.detailUrl;
      $scope.viewTitle = $scope.businessConfig.name;
      $scope.showTab = $scope.businessConfig.showTab;

      /**
       * 广播增加申报事件
       * @param apply
       */
      $scope.raiseCreateApplyEvent = function raiseCreateApplyEvent(apply) {
        $log.log('广播增加申报事件', apply);
        $rootScope.$broadcast(APPLY_APP_EVENT.createNewApply, apply);
      }

      /**
       * 广播申报修改完成事件
       * @param apply
       */
      $scope.raiseModifyCompleteApplyEvent = function raiseModifyCompleteApplyEvent(apply) {
        $log.log('广播申报修改成功事件', apply);
        $rootScope.$broadcast(APPLY_APP_EVENT.modifyApplyComplete, apply);
      }

      /**
       * 日期控件
       */
      $scope.datePicker = {isOpen1: false, isOpen2: false, isOpen3: false, isOpen4: false,isOpen5: false,isOpen6: false,isOpen7: false,isOpen8: false };
      $scope.open = function ($event, isOpen) {
        $event.preventDefault();
        $event.stopPropagation();
        $timeout(function () {
          $scope.datePicker[isOpen] = !$scope.datePicker[isOpen];
        }, 50);
      };


    }])
  /**
   * 批量新增申报上传控制器
   */
  .controller('BusinessApplyUploadCtrl', ['$scope', 'BusinessApplyService', 'APPLY_TYPE',
    function ($scope, BusinessApplyService, APPLY_TYPE) {
      //设置文件上传Url参数
      $scope.uploadUrl = BusinessApplyService.getUploadUrl($scope.businessConfig.applyResource);
      //指定申报事件类型
      $scope.applyTypeValue = $scope.businessConfig.value;
    }])
  /**
   * 批量新增申报结果控制器
   */
  .controller('BusinessApplyUploadListCtrl', ['$scope', 'APPLY_TYPE', 'APPLY_RESOURCE', 'i18nService','BusinessApplyShowConfig',
    function ($scope, APPLY_TYPE, APPLY_RESOURCE, i18nService,BusinessApplyShowConfig) {
      //显示条数
      $scope.listRowCount = 0;
      //指定申报事件类型
      $scope.applyType = $scope.businessConfig.applyResource;
      $scope.applyTypeValue = $scope.businessConfig.value;
      //设置错误消息定义
      $scope.errColumnDefs = BusinessApplyShowConfig.getErrColumnDefs($scope.businessConfig.applyResource);
      //grid中文显示
      i18nService.setCurrentLang('zh-cn');
    }])
  /**
   * TAB3申报列表
   */
  .controller('BusinessApplyListCtrl', ['$scope','BusinessApplyShowConfig',
    function ($scope,BusinessApplyShowConfig) {
      //显示条数
      $scope.listRowCount = 0;
      //指定申报事件类型
      $scope.applyType = $scope.businessConfig.applyResource;
      //描述申报清单显示方式
      $scope.listColumnDefs = BusinessApplyShowConfig.getUnSubListColumnDefs($scope.businessConfig.value);
    }]);