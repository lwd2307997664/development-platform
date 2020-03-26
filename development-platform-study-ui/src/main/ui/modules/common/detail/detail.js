/**
 * Created by juan_wang on 2014/8/12.
 *
 */
'use strict';
angular.module('hrss.si.enterprise.submitModule')
  .controller('ApplyDetailCtrl', ['$scope', '$log', '$timeout', function ($scope, $log, $timeout) {
    $log.debug('readonly', $scope.modalOptions.readonly);
    $scope.onlyRead = function () {
      $log.debug('加载完毕');

      // 如果模块内声明加载完成事件，则调用
      if($scope.modalOptions.hasOwnProperty('pageLoad')){
          $scope.modalOptions.pageLoad();
      }

      if ($scope.modalOptions.readonly) {

        //补充按钮
        var detailContentEle = document.getElementById('detailContent');
        var btnEles = detailContentEle.getElementsByTagName('BUTTON');
        for (var iBtn = 0; iBtn < btnEles.length; iBtn++) {
          if (btnEles[iBtn].name !== undefined && btnEles[iBtn].name !== 'closeBtn') {
            if(btnEles[iBtn].lastElementChild === null){
              btnEles[iBtn].style.display = 'none';
            }else{
              btnEles[iBtn].setAttribute('disabled',true);
            }
          }
        }
        //延时
        $timeout(function () {
          $log.debug('设置只读');

          //要区分处理type="button"的
          var inputEles = detailContentEle.getElementsByTagName('INPUT');
          for (var iInput = 0; iInput < inputEles.length; iInput++) {
            $log.debug('input type', inputEles[iInput].type);
            if (inputEles[iInput].type === 'button') {
              inputEles[iInput].style.display = 'none';
            } else {
              inputEles[iInput].setAttribute('disabled', true);
            }
          }
          //
          // var inputEles1 = detailContentEle.getElementsByTagName('BUTTON');
          // for (var iInput1 = 0; iInput < inputEles1.length; iInput1++) {
          //   $log.debug('input type', inputEles1[iInput1].type);
          //   if (inputEles1[iInput1].type === 'button') {
          //     inputEles1[iInput1].style.display = 'none';
          //   } else {
          //     inputEles1[iInput1].setAttribute('disabled', true);
          //   }
          // }

          //如果是下拉框设置为不可用
          var selectEles = detailContentEle.getElementsByTagName('SELECT');
          for (var i = 0; i < selectEles.length; i++) {
            selectEles[i].setAttribute('disabled', true);
          }

        }, 10);
      }
    };
  }])
  .directive('applydetail', ['$log', 'APPLY_TYPE','BusinessApplyConfig', function ($log, APPLY_TYPE,BusinessApplyConfig) {
    return {
      restrict: 'E',
      link: function (scope) {
        scope.getContentUrl = function () {
          for (var key in APPLY_TYPE) {
            if (scope.modalOptions.applyType === APPLY_TYPE[key].value) {
              return APPLY_TYPE[key].detailUrl;
            }
          }
          var business=  BusinessApplyConfig.getBusiness(scope.modalOptions.applyType);
          if(business){
            return business.detailUrl;
          }
          return '';
        };
      },
      template: '<div ng-include="getContentUrl()" autoscroll="onlyRead()"></div>'
    };
  }]);
