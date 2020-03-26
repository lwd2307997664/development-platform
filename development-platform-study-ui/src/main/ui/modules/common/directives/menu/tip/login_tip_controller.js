angular.module('hrss.si.enterprise.directivesModule')
  .controller('loginTipCtrl', ['$scope', 'items', '$log', '$uibModalInstance', function ($scope, items, $log, $uibModalInstance) {

    console.info('父界面传值：', items);
    //页面赋值
    $scope.pageObject = items;
    //存放选中数据
    $scope.selection = [];

    //选择切换
    $scope.toggleSelection = function (item) {
      $log.debug('点击选择', item);
      $uibModalInstance.close(item.companyNumber);
    };
    /**
     * 界面取消按钮
     */
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }])

