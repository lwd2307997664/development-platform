/**
 * 申报统计
 *
 * @author yuanmzh
 * @date 2016-4
 */
'use strict';

angular.module('hrss.si.enterprise.homeModule')
  .directive('questionBoard', [function () {
    var directive = {
      templateUrl: 'modules/common/home/directives/questionBoard/questionBoard.html',
      restrict: 'E',
      scope: true,
      controller: 'questionBoardController'
    };
    return directive;
  }])
  //菜单控制动作
  .controller('questionBoardController', ['$scope', '$log', '$location', 'ReviewedService', 'pendingService',
    function ($scope, $log, $location, ReviewedService, pendingService) {

      // $scope.template='<div style="width:100%;height:260px;max-width: 800px"></div>';

      //eChart应用数据源
      var applyData = [];

      //设置可选结算期跨度（限制范围2-23）
      var issueLength = 3;

      //结算期Array
      $scope.issueArray = [];

      //生成结算期Array
      for (var i = 0; i < issueLength; i++) {
        $log.debug('$scope.issue.substring(3,5)', $scope.issue.toString().substring(4, 6));
        if (parseInt($scope.issue.toString().substring(4, 6)) - i + 1 > 1) {
          $scope.issueArray.push($scope.issue - i);
        } else {
          $scope.issueArray.push($scope.issue - 88 - i);
        }
      }

      //设置图表高度
      $scope.canvasHeight = '360px';

      //刷新数据初始值
      $scope.changeValue = 0;

      //记录翻页页数
      var recodePage = issueLength - 1;

      //codeList申报类型整合对象
      var codeTotal = {
        'register': ['1202'],
        'dimission': ['1203'],
        'salary': ['1204'],
        'makeupbalance': ['1205', '1219']
      };


      /**
       * 申报数据处理
       * @param finishedState
       * @param returnData
       */
      var applyDataHandle = function (finishedState, returnData) {

        var detailReviewData = returnData[0].children;

        angular.forEach(detailReviewData, function (drData) {
          angular.forEach(codeTotal, function (codeValue, codeKey) {
            angular.forEach(codeValue, function (codeChildData) {
              if (drData.data.applyType === codeChildData) {
                switch (codeKey) {
                  case 'register':
                    finishedState[4] += drData.data.count;
                    break;
                  case 'dimission':
                    finishedState[3] += drData.data.count;
                    break;
                  case 'makeupbalance':
                    finishedState[2] += drData.data.count;
                    break;
                  case 'salary':
                    finishedState[1] += drData.data.count;
                    break;
                  default :
                    finishedState[0] += drData.data.count;
                }
              }
            });
          });
        });
      };

      /**
       *  图表更新数据fun
       * @param data
       */
      var evaluation = function (data) {
        $scope.option.title.text = data.text;
        $scope.option.series[0].data = data.finished;
        $scope.option.series[1].data = data.Unfinished;
        //更新数据
        $scope.changeValue++;
      };

      /**
       * 获取后台数据，并初始化当前结算期图表
       * @type {account|*|create.user.account}
       */
      var companyId = $scope.getCurrentUserSimisID();
      angular.forEach($scope.issueArray, function (issueDate) {

        var applyObj = {'text': '月份：', 'finished': [0, 0, 0, 0, 0], 'Unfinished': [0, 0, 0, 0, 0]};

        ReviewedService.getReviewedApplyTree(companyId, issueDate, null).then(function (returnData) {
          applyObj.text += issueDate;
          applyDataHandle(applyObj.finished, returnData);
          //如果是当前结算期，则装入未提交数据
          if (issueDate === $scope.issue) {
            pendingService.getPendingApplyTree(companyId).then(function (data) {
              applyDataHandle(applyObj.Unfinished, data);
              evaluation(applyData[issueLength - 1]);
            });
          }
          applyData.push(applyObj);
          //如果最后一个url响应完毕，则根据时间排序
          if (applyData.length === issueLength) {
            applyData.sort(function (a, b) {
              return parseInt(a.text.substring(3, 9)) - parseInt(b.text.substring(3, 9));
            });
            evaluation(applyData[issueLength - 1]);
          }
        });

      });


      //申报统计假数据，特别假的数据.......
      // var applyData = [
      //   {'text': '月份：201601', 'finished': [320, 302, 301, 334, 390], 'Unfinished': [120, 132, 101, 134, 90]},
      //   {'text': '月份：201602', 'finished': [124, 112, 132, 154, 119], 'Unfinished': [43, 32, 32, 33, 46]},
      //   {'text': '月份：201603', 'finished': [222, 231, 254, 238, 216], 'Unfinished': [231, 256, 219, 246, 277]},
      //   {'text': '月份：201604', 'finished': [124, 112, 132, 154, 119], 'Unfinished': [43, 32, 32, 33, 46]}
      // ];


      //配置数据
      $scope.option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        title: {
          text: '当前月暂无数据',
          textStyle: {
            color: '#333',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            fontSize: 15
          },
          left: 13,
          top: 7
        },
        legend: {
          data: ['已提交', '未提交'],
          top: 7,
          right: 10
          // orient:'vertical'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '4%',
          top: 40,
          containLabel: true,
          backgroundColor: '#ccc',
          borderColor: '#fff'
        },
        xAxis: {
          type: 'value',
          splitLine: {
            show: true,
            interval: 'auto',
            lineStyle: {
              color: ['#EDEDED']
            }
          },
          axisLine: {
            show: true,
            onZero: true,
            lineStyle: {
              color: '#cacaca',
              width: 1,
              type: 'solid'
            }
          },
          axisTick: {
            show: true,
            interval: 'auto',
            inside: false,
            length: 4,
            lineStyle: {
              color: '#cacaca',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontFamily: 'sans-serif',
              fontSize: 12
            }
          }
        },
        yAxis: {
          type: 'category',
          data: ['其它申报', '工资申报', '补缴申报', '减员申报', '增员申报'],
          nameGap: 15,
          nameTextStyle: {
            color: '#666',
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontFamily: 'sans-serif',
            fontSize: 14
          },
          splitLine: {
            show: true,
            interval: 'auto',
            lineStyle: {
              color: ['#EDEDED']
            }
          },
          axisLine: {
            show: true,
            onZero: true,
            lineStyle: {
              color: '#cacaca',
              width: 1,
              type: 'solid'
            }
          },
          axisTick: {
            show: true,
            interval: 'auto',
            inside: false,
            length: 4,
            lineStyle: {
              color: '#cacaca',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontFamily: 'sans-serif',
              fontSize: 12
            }
          }
        },
        color: ['#87C838', '#FFA334'],
        series: [
          {
            name: '已提交',
            type: 'bar',
            stack: 'all',
            barWidth: 17,
            label: {
              normal: {
                show: true,
                position: 'inside',
                textStyle: {
                  color: '#fff',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontSize: 12
                },
                formatter: function (value) {
                  if (value.data === 0) {
                    return '';
                  } else {
                    return value.data;
                  }
                }
              }
            },
            data: [0, 0, 0, 0, 0]
          },
          {
            name: '未提交',
            type: 'bar',
            stack: 'all',
            barWidth: 17,
            label: {
              normal: {
                show: true,
                position: 'inside',
                textStyle: {
                  color: '#fff',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontSize: 12
                },
                formatter: function (value) {
                  if (value.data === 0) {
                    return '';
                  } else {
                    return value.data;
                  }
                }
              }
            },
            data: [0, 0, 0, 0, 0]
          }
        ],
        textStyle: {
          color: '#666',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontFamily: '微软雅黑',
          fontSize: 12
        }
      };


      //翻页
      $scope.turnClick = function (id) {
        if (id === '0') {
          if (recodePage > 0) {
            recodePage--;
            angular.forEach(applyData, function (data, index) {
              if (recodePage === index) {
                evaluation(data);
              }
            });
          }
        } else {
          if (recodePage < issueLength - 1) {
            recodePage++;
            angular.forEach(applyData, function (data, index) {
              if (recodePage === index) {
                evaluation(data);
              }
            });
          }
        }
      };


    }]);

