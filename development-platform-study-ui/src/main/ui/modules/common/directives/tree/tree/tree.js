/**
 * Created by Erwin on 2017/4/4 0004.
 * tree组件
 * TODO 性能优化
 * modify: 修改数据结构
 */
"use strict";

angular.module('hrss.si.enterprise.directivesModule')
  .constant('neuTree', {
      parentCheck: 'PARENT_CHECK'
  })
  .directive('neuTree', [
      function () {
          return {
              templateUrl: 'modules/common/directives/tree/tree/tree.html',
              scope: {
                  treeData: '=data',  //UI绘制数据
                  isCheckbox: '@',    //是否多选
                  isExtend: '=',    //是否展开
                  selectNodeCallBack: '&getSelectNode', //选中回调函数
                  icons: '@icon',   //ICON样式,可省略
                  max: '@',           //最大选中数量
                  clear: '='
              },
              link: function (scope, element) {

                  //默认icon样式
                  var defaultIcon = {
                      parentIconOpen: 'glyphicon glyphicon-folder-open',
                      parentIconClose: 'glyphicon glyphicon-folder-close',
                      childrenIcon: 'glyphicon glyphicon-list-alt'
                  };
                  scope.iconObj = angular.isDefined(scope.icons) ? JSON.parse(scope.icons) : defaultIcon;
                  //清除选中标识中间值
                  var clearData;

                  scope.$watch('clear', function (oldV, newV) {
                      if (oldV !== newV) {
                          // console.log('触发值清空方法');
                          clearData = angular.copy(scope.treeData);
                          delCheckState(clearData);
                          scope.unitCheckArray = [];
                          scope.treeData = clearData;
                      }
                  });

                  /**
                   * 获取当前节点
                   * @param currentNode
                   * @param evt
                   */
                  scope.selectOne = function (currentNode, evt) {
                      console.log('当前点击节点为：', currentNode);
                      angular.element(evt.target).parentsUntil('.neu-tree-div').parent().find("span.neu-tree-unit-title").removeClass("active");
                      if (angular.element(evt.target).parentsUntil('.neu-tree-unit').length == 0) {
                          angular.element(evt.target).addClass("active");
                      } else {
                          angular.element(evt.target).parentsUntil('.neu-tree-unit').parent().children('.neu-tree-unit-title').addClass("active");
                      }

                      //如果开启多选则取消单选方法
                      if (scope.isCheckbox === 'true') {
                          return;
                      }

                      //回调callback
                      var callBackData = angular.copy(currentNode);
                      delete callBackData.isCheck;
                      scope.selectNodeCallBack({value: {'currentNode': callBackData}});


                      evt.stopPropagation();
                  };


                  //是否存在多选
                  if (scope.isCheckbox === 'true') {

                      //根据多选数组变化callback
                      scope.unitCheckArray = [];
                      scope.$watch('unitCheckArray', function (newValue, oldValue) {
                          if (newValue !== oldValue) {

                              var callBackData = angular.copy(scope.unitCheckArray);
                              angular.forEach(callBackData, function (data) {
                                  delete data.isCheck;
                              });
                              // 第一次初始化避免回调
                              if(!oldValue.length){
                                  return;
                              }
                              scope.selectNodeCallBack({value: {'currentNode': callBackData}});
                          }
                      }, true);
                  }


                  //删除check标志
                  function delCheckState(data) {

                      function delCheck(currentNode) {
                          if (currentNode.hasOwnProperty('isCheck')) {
                              // console.log('currentNodecurrentNodecurrentNode', currentNode);
                              delete currentNode.isCheck;
                          }
                      }

                      for (var k = 0; k < data.length; k++) {
                          delCheck(data[k]);
                          // console.log('childData', data[k]);
                          for (var i = 0; i < data[k].children.length; i++) {
                              delCheck(data[k].children[i]);
                              if (data[k].children[i].children.length !== 0) {
                                  delCheckState(data[k].children);
                              }
                          }
                      }


                  }

                  // addCheckState(scope.treeData);


              }
          };
      }
  ]);
