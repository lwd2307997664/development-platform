/**
 * 新闻轮播组件
 *
 * @author yuanmzh
 * @date 2015-11-04
 * 
 * 
 * 知识中心查询公告信息
 * @author y_zhang.neu
 * @date 20160401
 */
'use strict';

angular.module('hrss.si.enterprise.homeModule')
  .directive('noticeBoard', [function () {
    var directive = {
      templateUrl: 'modules/common/home/directives/noticeBoard/noticeBoard.html',
      restrict: 'E',
      scope: true,
      controller: 'noticeBoardController'
    };
    return directive;
  }])
  //菜单控制动作
  .controller('noticeBoardController', ['$scope','noticeService','$log',
    function ($scope,noticeService,$log) {
      //获取轮播消息(ID=5)数据
//       $scope.folder_id='5';
//      messageBoardService.getsMessageBoard($scope.folder_id).$promise.then(function (data) {
//        $scope.businessNews = data;
//      }, function (err) {
//        $log.debug('查询失败', err.data);
//      });
      //假数据
      $scope.businessNews = [];
      $scope.getBusinessNews = function () {
        noticeService.getBusinessNews().then(function(result){
          $log.info('知识中心查询结果',result);
          $scope.businessNews=result.data;
        },function(error){
//          $log.info('知识中心查询失败！',error.data());
        });
      };
      $scope.getBusinessNews();
    }])
  .factory('noticeService',['$http','$log',function($http,$log){
    var FACTORY=[];
    var GET_BUSINESS_NEWS='/pile-knowledgebase/api/consult/suggest/query/420101198001010099?startDate=1&endDate=2';
    //查询投诉、建议、意见接口，知识中心
    FACTORY.getBusinessNews=function(){
      $log.log('noticeService.getBusinessNews');
      return $http.get(GET_BUSINESS_NEWS);
    };
    return FACTORY;
  }]);
