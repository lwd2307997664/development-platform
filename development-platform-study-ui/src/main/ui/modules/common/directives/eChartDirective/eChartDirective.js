/**
 * eChart组件封装
 * @author Erwin
 * @date 2016/4/5
 */
'use strict';

angular.module('hrss.si.enterprise.directivesModule')
  .directive('eChart', function ($log) {
    return {
      scope: {
        id: '@',
        option: '=',
        eClick: '&',
        changeValue: '=',
        canvasHeight: '='
      },
      restrict: 'E',
      template: '<div id="eChartCanvas" style="width:100%;height:inherit;max-width: 800px"></div>',
      replace: true,
      link: function ($scope, element, attrs, controller) {

        var myChart = echarts.init(document.getElementById($scope.id), 'macarons');

        $scope.$watch('changeValue', function (newValue, oldValue) {
          myChart.setOption($scope.option);
        });

        $log.debug('eChartCanvas', angular.element('#eChartCanvas'));

        // var setHeight=function () {
        //   element.style.height=$scope.canvasHeight;
        // };
        //
        // setTimeout(setHeight,3000);



        //eChart点击事件
        myChart.on('click', function (param) {
          $scope.eClick({param: param});
        });


      }
    };
  });
