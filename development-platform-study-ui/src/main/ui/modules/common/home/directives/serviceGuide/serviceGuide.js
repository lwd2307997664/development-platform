/**
 * 快捷查询
 *
 * @author yuanmzh
 * @date 2016-04
 */
'use strict';

angular.module('hrss.si.enterprise.homeModule')
  .directive('serviceGuide', [function () {
    var directive = {
      templateUrl: 'modules/common/home/directives/serviceGuide/serviceGuide.html',
      restrict: 'E',
      scope: true,
      controller: 'serviceGuideController'
    };
    return directive;
  }])
  //菜单控制动作
  .controller('serviceGuideController', ['$scope', '$log', '$location', '$timeout',
    function ($scope, $log, $location, $timeout) {
      $scope.viewDate = [];

      var viewDate = [
        {'name': '养老个人账户单打印 ', 'icon': 'print_icon1', 'path': '/report/employeey/account'},
        {'name': '工伤征缴明细打印 ', 'icon': 'print_icon2', 'path': '/report/injury/certificate'},
        {'name': '医疗参保缴费凭证 ', 'icon': 'print_icon3', 'path': '/report/medicare/certificate'}
      ];

      /**
       * 初始化方法
       */
      var init = function () {
        // //默认开启动画
        // $scope.isActive = false;
        //默认显示字
        $scope.wordsView=true;
        //初始化页面
        $scope.viewDate = viewDate;
      };
      init();


      /**
       * 链接跳转事件
       * @param index
       */
      // $scope.linkTurn = function (index) {
      //   angular.forEach($scope.viewDate, function (data, arrayIndex) {
      //     if (index === arrayIndex) {
      //       if (data.sign === 'back') {
      //         $scope.wordsView=false;
      //         $scope.isActive = true;
      //         $timeout(init, 195);
      //       } else if (data.sign === 'detail') {
      //         $scope.wordsView=false;
      //         $scope.isActive = true;
      //         var fun = function () {
      //           $scope.viewDate = eval(data.detail);
      //           $scope.isActive = false;
      //           $scope.wordsView=true;
      //         };
      //         $timeout(fun, 195);
      //       } else if (data.sign === null) {
      //         $location.path(data.path);
      //       }
      //     }
      //   });
      // };

    }]);
