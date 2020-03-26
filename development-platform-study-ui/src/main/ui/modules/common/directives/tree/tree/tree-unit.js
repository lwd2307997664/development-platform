/**
 * Created by Erwin on 2017/4/4.
 * 树形控件子单元
 * 在angular1.4.7中，CheckBox不需要 ng-model="unitData.isCheck"。
 */
"use strict";

angular.module('hrss.si.enterprise.directivesModule')
  .directive('neuTreeUnit', [
      function () {
          return {
              templateUrl: 'modules/common/directives/tree/tree/tree-unit.html',
              replace: true,
              transclude: true,
              scope: {
                  unitData: '=',  //当前单元数据
                  unitIndex: '@', //当前是第几层
                  unitCheck: '@',  //当前层是否有复选框
                  unitExtend: '=',  //是否展开
                  unitCheckArray: '=', //复选数组
                  unitIcon: '=',     //icon样式
                  unitMax: '@'
              },
              controller: 'treeUnitCtrl'
          };
      }
  ])
  .controller('treeUnitCtrl', ['$scope', '$timeout', '$log', 'neuTree', function ($scope, $timeout, $log, neuTree) {
      //是否展开
      $scope.isExtend = $scope.unitExtend;
      //默认显示父级check
      $scope.appearParentCheck = true;
      //父元素数据
      var unitParent = angular.copy($scope.unitParent);

      //如果未设定最大选中数量
      if ($scope.unitMax === '') {
          $scope.appearParentCheck = false;
          $scope.unitMax = 10000;
      }


      /**
       *  是否允许添加元素
       * @returns {boolean}
       */
      function isAllowAdd() {
          return $scope.unitCheckArray.length < $scope.unitMax;
      }

      /**
       * 切换选中元素
       */
      function toogleSelectCheck() {
          //控制选中数组
          var isExistence = false;
          var delSign = null;


          angular.forEach($scope.unitCheckArray, function (ca, index) {
              if (ca === $scope.unitData) {
                  isExistence = true;
                  delSign = index;
              }
          });

          //控制callback数组
          if (isExistence) {
              $scope.unitCheckArray.splice(delSign, 1);
          } else {
              if ($scope.appearParentCheck) {
                  if (!isAllowAdd()) {
                      return;
                  }
              }
              $scope.unitCheckArray.push($scope.unitData);
          }
      }

      /**
       * 增加/删除 当前元素
       */
      function changeSelectCheck(flag) {
          //控制选中数组
          var isExistence = false;
          var delSign = null;


          angular.forEach($scope.unitCheckArray, function (ca, index) {
              if (ca === $scope.unitData) {
                  isExistence = true;
                  delSign = index;
              }
          });

          // true为增加 ，false为删除
          if (flag) {
              if(!isExistence){
                  if ($scope.appearParentCheck) {
                      if (!isAllowAdd()) {
                          return;
                      }
                  }
                  $scope.unitCheckArray.push($scope.unitData);
              }
          } else {
              if(isExistence){
                  $scope.unitCheckArray.splice(delSign, 1);
              }
          }

      }

      /**
       * 检查当前兄弟元素的状态，并判断父级状态是否需要改变（自下而上）
       * ********** 这个方法死的很惨，想一晚上，发现以前写的代码直接watch“unitData.children”就可以。
       * ********** 暂时不删除，留作以后性能优化用的吧。
       */
      function checkCurrentChange() {
          // 当前父级节点选中状态（currentParentCheckStatus,'1' 为全部或部分选中 ， '0' 为未选中）
          var cpcs = unitParent.isCheck ? '1' : '0';
          // 选中状态的数组
          var selectedArray = [];
          // 当前层级所有元素选中状态（0 未选中，1 全部选中，2 部分选中）
          var selectedStatus = '0';


          // 提取选中元素
          angular.forEach(unitParent.children, function (unit) {
              if (unit.isCheck) {
                  selectedArray.push(unit);
              }
          });

          // 判断选中状态
          switch (selectedArray.length) {
            // 当前级别所有元素都未选中
              case 0:
                  selectedStatus = '0';
                  break;
            // 当前级别所有元素都选中
              case unitParent.length:
                  selectedStatus = '1';
                  break;
            // 当前级别部分元素选中
              default:
                  selectedStatus = '2';
                  break;
          }


          // 为什么不去掉部分选中状态直接等值比较？方便以后扩展
          if (selectedStatus === '1' || selectedStatus === '2') {
              // 如果当前级别有选中，则父级应该选中

              if (cpcs !== '1') {
                  // 如果父级未选中，需改变状态，且通知父级进行状态检查
                  unitParent.isCheck = true;
                  // 通知父级检查
                  $scope.$emit(neuTree.parentCheck);
              }

          } else if (selectedStatus === '0') {
              // 如果当前级别无选中，则父级应该未选中

              if (cpcs !== '0') {
                  // 如果父级选中，需改变状态，且通知父级进行状态检查
                  unitParent.isCheck = false;
                  // 通知父级检查
                  $scope.$emit(neuTree.parentCheck);
              }
          }

      }
      /**
       * 接收子集检查通知
       */
      $scope.$on(neuTree.parentCheck, function (event) {
          // 如果父节点为根节点，则不检查
          if ($scope.unitParent !== 'root') {
              console.log('当前接到广播的节点:', $scope.unitData, $scope.unitIndex);
              checkCurrentChange()
          }
      });


      /**
       * check选中事件
       * @param evt
       */
      $scope.changeCheck = function (evt) {

          if ($scope.appearParentCheck) {
              if (!isAllowAdd() && !$scope.unitData.isCheck) {
                  return;
              }
          }


          /**
           * 取出所有子集，并改变check状态（自上而下）
           * @param data
           */
          var getAllChildElement = function (data) {
              //存储子集中转
              var midArray = [];

              for (var i = 0; i < data.children.length; i++) {
                  if (data.children[i].children.length === 0) {
                      midArray.push(data.children[i]);
                      data.children[i].isCheck = $scope.unitData.isCheck;
                  } else {
                      getAllChildElement(data.children[i]);
                  }
                  data.isCheck = $scope.unitData.isCheck;
              }

              if ($scope.unitData.isCheck) {
                  angular.forEach(midArray, function (maData) {
                      //将要添加到callback队列的数组是否已经存在（默认不存在）
                      var elsInArray = false;

                      angular.forEach($scope.unitCheckArray, function (uaData) {
                          if (maData === uaData) {
                              elsInArray = true;
                          }
                      });

                      //如果不存在则添加到callback队列(增加)
                      if (!elsInArray) {
                          if ($scope.appearParentCheck) {
                              if (!isAllowAdd()) {
                                  return;
                              }
                          }
                          $scope.unitCheckArray.push(maData);
                      }

                  });
              } else {
                  angular.forEach(midArray, function (maData) {
                      angular.forEach($scope.unitCheckArray, function (uaData, uaIndex) {
                          if (maData === uaData) {
                              $scope.unitCheckArray.splice(uaIndex, 1);
                          }
                      });
                  });
              }
          };


          if ($scope.unitData.children.length === 0) {
              //子级元素操作
              toogleSelectCheck();
          } else {
              //父级元素操作
              getAllChildElement($scope.unitData);
              $log.debug('$scope.unitData:', $scope.unitData);
          }

          // 检查当前级别改变
          // checkCurrentChange();

          //防止click冒泡
          evt.stopPropagation();
      };


      // 是否带有默认选中
      if ($scope.unitData.hasOwnProperty('isCheck')) {
          if ($scope.unitData.isCheck === true) {
              // if ($scope.unitData.children.length === 0) {
                  changeSelectCheck(true);
              // }
          } else {
              $scope.unitData.isCheck = false;
          }
      } else {
          $scope.unitData.isCheck = false;
      }

      // 监听子级选中状态，并作出相应改变
      $scope.$watch('unitData.children', function (newValue, oldValue) {
          var isCheckAll = false;
          if (newValue !== oldValue) {
              angular.forEach($scope.unitData.children, function (data) {
                  if (data.isCheck === true) {
                      isCheckAll = true;
                  }
              });
              $scope.unitData.isCheck = isCheckAll;
              changeSelectCheck(isCheckAll);
          }

      }, true);

      //监听父级展开
      $scope.$watch('unitExtend', function () {
          $scope.isExtend = $scope.unitExtend;
      });

  }])
  //防止事件冒泡，阻止当前dom元素上的click
  .directive('stopPropagation', function () {
      return {
          link: function (scope, elem) {
              elem.on('click', function (e) {
                  e.stopPropagation();
              });
          }
      };
  });
