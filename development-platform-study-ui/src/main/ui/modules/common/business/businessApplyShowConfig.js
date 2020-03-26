/**
 * 业务申报配置
 * Created by WangXG on 2018/1/05.
 */
'use strict';
angular.module('hrss.si.enterprise.businessModule')
  .factory('BusinessApplyShowConfig', ['$log','BusinessApplyConfig',
    function ($log,BusinessApplyConfig) {
      var factory = {};
        /**
         * 获取配置文件
         * @type {*}
         */
      var applyTypeList=BusinessApplyConfig.getAllBusiness();

      //操作模板
      var operateTmplate =
        '<div class="btn-group pull-center">' +
        '<a class="btn btn-info" ng-click="grid.appScope.gridItemDetail(row.entity)" title="详情">' +
        '<i class="glyphicon glyphicon-info-sign">详情</i></a>' +
        '<a class="btn btn-warning"  ng-click="grid.appScope.attachments(row.entity)"title="附件">' +
        '<i class="glyphicon glyphicon glyphicon-level-up">附件</i></a>' +
        '<a class="btn btn-danger" ng-click="grid.appScope.deleteApply(row.entity)" title="删除">' +
        '<i class="glyphicon glyphicon-remove">删除</i></a>' +
        '</div>';

      var operateCol={ field: 'button',displayName: '操作功能',cellTemplate: operateTmplate, cellClass: 'ngCellCenter', width: 205};
      //tab标题显示--增员
      var personBaseInfoCol1 = [
        { field: 'applicantName', displayName: '姓名', headerCellClass: 'ngCellCenter',cellClass: 'ngCellCenter',width: 180},
        { field: 'applicantIDNumber', displayName: '证件号码', headerCellClass: 'ngCellCenter',cellClass: 'ngCellCenter',width: 240},
        { field: 'applicantSex', displayName: '性别', cellFilter: 'selectCodeName:\'AAC004\'', headerCellClass: 'ngCellCenter',cellClass: 'ngCellCenter',width:120},
        { field: 'createDate', displayName: '申报创建日期', cellFilter: 'SecondLongToDateFilter', sortable:'true', headerCellClass: 'ngCellCenter',cellClass: 'ngCellCenter',
          width: 220}
      ];
      //tab标题显示--年度工资
      var employeeSalaryYearInfoCol2 = [
          { field: 'applicantName', displayName: '姓名', headerCellClass: 'ngCellCenter',cellClass: 'ngCellCenter',width: 80},
          { field: 'applicantIDNumber', displayName: '证件号码', headerCellClass: 'ngCellCenter',cellClass: 'ngCellCenter',width: 200},
          { field: 'applicantSex', displayName: '性别', cellFilter: 'selectCodeName:\'AAC004\'', headerCellClass: 'ngCellCenter',cellClass: 'ngCellCenter',width:80},
          { field: 'businessApplyItem[0].num001', displayName: '工资', headerCellClass: 'ngCellCenter',cellClass: 'ngCellCenter', width: 90},
          { field: 'createDate', displayName: '申报创建日期', cellFilter: 'SecondLongToDateFilter', sortable:'true', headerCellClass: 'ngCellCenter',cellClass: 'ngCellCenter',
              width: 180}
      ];
      var getColumDefs = function (type, businessType) {
        var baseInfo;
        switch (businessType) {
          case "1204":
              baseInfo = employeeSalaryYearInfoCol2;
              break;
          default:
            if(type==='update'){
              baseInfo = personBaseInfoCol1;
            }else if (type==='list'){
                angular.forEach(applyTypeList, function (item) {
                  if(item.value===businessType){
                      baseInfo = personBaseInfoCol1;
                  }
                });
                if(!baseInfo){
                  return;
                }

            }
        }
        //??
        switch (type) {
          case "list":
            var listDefs= angular.copy(baseInfo);
            listDefs.unshift(operateCol);
            return listDefs;
          case "update":
              var listDefs= angular.copy(baseInfo);
              listDefs.unshift(operateCol);
              return listDefs;
          case "err":
            return angular.copy(baseInfo);
          default:
            return angular.copy(baseInfo);
        }
      }

      /**
       * 获取表格显示配置
       * 用于待提交，审核结果查询
       * @param businessType
       * @returns {*}
       */
      factory.getListColumnDefs = function (businessType) {
        return getColumDefs('list', businessType);
      }

      /**
       * 获取批量错误表格显示配置
       * @param businessType
       * @returns {*}
       */
      factory.getErrColumnDefs = function (businessType) {
        return getColumDefs('err', businessType);
      }

        /**
         * 用于显示已申报界面，修改功能
         * @param businessType
         * @returns {*}
         */
        factory.getUnSubListColumnDefs = function (businessType) {
            return getColumDefs('update', businessType);
        }
      return factory;
    }]);
