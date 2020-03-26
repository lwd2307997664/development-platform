/**
 *个人网厅申报提交
 *
 * @author linwd
 * @date 2018/7/12
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule')
  .directive('submitapply', [function () {
    var directive = {
      templateUrl: 'modules/common/directives/submitapply/submitapply.html',
      restrict: 'E',
      scope: {
        applyData: '=applyData',//申报数据 （applyId、attachmentList）
        applyType:'=applyType'
      },
      controller: 'SubmitApplyController'
    };
    return directive;
  }])
  .controller('SubmitApplyController', ['messageBox','confirmBox','$scope', '$log', '$http', 'girderConfig', 'messageService', 'SubmitApplyService',
    function (messageBox,confirmBox,$scope, $log, $http, appConfig, messageService, SubmitApplyService) {

      /**
       * 页面
       */
      $scope.submitDetail = function () {
          $scope.submitApplyDTO={};
          $scope.submitApplyDTO.applyIdList=[];
          $scope.submitApplyDTO.applyIdList.push($scope.applyData.applyId);
          confirmBox.showInfo('提交前请确定已上传电子材料，否则将不再允许修改！确认提交？').then(function (result) {
              angular.element('#submitApplyDetailButton').attr('disabled', true);
              SubmitApplyService.submitApplyList($scope.applyType,$scope.submitApplyDTO).$promise.then(function (data) {
                      $log.debug('申报提交成功', data);
                  messageBox.showInfo('申报提交成功！');
                  }, function (err) {
                      angular.element('#submitApplyDetailButton').attr('disabled', false);
                  messageBox.showInfo('申报提交失败！' + err.data.detail);
                  }
              );
          });

      }


    }])
 ;
