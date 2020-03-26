/**
 * Created by wuyf on 2014/5/22.
 * simis 数据服务类
 *
 * CompanyService 表示单位数据服务，用来操作在单位下已经投保的人员
 * $log.debug('获取当前单位',CompanyService.getCompany());
 * $log.debug('获取当前单位Id',CompanyService.getCompanyId());
 */
'use strict';
angular.module('hrss.si.enterprise.simisModule')
  .factory('CompanyService', ['$log', '$resource', 'girderConfig', 'HRSS_APP_USER_DETAILS_CACHE', function ($log, $resource, appConfig, HRSS_APP_USER_DETAILS_CACHE) {

    //单位资源对象
    var companyResource = $resource(appConfig.baseUrl + '/api/simis/companys', {companyId: '@companyId'},
      {
        findByNumber: {method: 'Get', params: {companyId: 0}}
      });

    //定义工厂对象
    var factory = {
      company: {}
    };

    /**
     * 从缓存中恢复
     */
    var restoreCompany = function () {
      var userDetail = localStorage.getItem(HRSS_APP_USER_DETAILS_CACHE.appUserDetailCache);
      if (userDetail !== undefined && userDetail !== null) {
        $log.debug('从缓存载入用户详情', userDetail);
        factory.company = JSON.parse(userDetail);
      }
    };

    //获取当前登录的单位信息
    factory.getCompany = function () {
      if (angular.isUndefined(factory.company.id)) {
        //暂时patch
        restoreCompany();
      }
      return factory.company;
    };

    //获取当前登录的单位ID
    factory.getCompanyId = function () {
      if (angular.isUndefined(factory.company.id)) {
        //暂时patch
        restoreCompany();
      }
      return factory.company.id;
    };

    //按单位编号查询单位
    factory.queryCompany = function (companyNumber) {
      $log.debug('按单位编号查询单位', companyNumber);
      return companyResource.findByNumber({companyId: companyNumber}, function (data) {
        $log.debug('按单位编号查询单位返回结果', data);
        factory.company = data;
        return data;
      });
    };

    /**
     * 获取单位下人员默认参保范围
     */
    factory.getEmpDefaultInsRange = function (insCodeArray) {
      //查询单位信息
      var company = factory.getCompany();
      //险种数组
      var unitInsList = [];
      //单位险种条数
      var count = company.companyInsurances.length;
      var unitType = company.unitType;
      //设置页面显示险种中文含义
      for (var k = 0; k < insCodeArray.length; k++) {
        for (var i = 0; i < count; i++) {
          var unitIns = company.companyInsurance[i].insuranceCode;
          var insState = company.companyInsurance[i].paymentState;
          if (insState === '1') {// 正常参保
            if (unitIns === insCodeArray[k].value) {
              var insurance = {insuranceCode: unitIns, insuranceName: insCodeArray[k].name, enable: false, check: true};
              //单位可能同时参保机关事业养老和企业养老。
              //如果单位是机关事业单位，并且参保企业养老，则前台需要显示企业养老，只是默认不选，不可编辑。
              // if (unitIns === '110' && (unitType.substr(0, 1) === '3' || unitType.substr(0, 1) === '5')) {
              //   unitInsList.push(insurance);
              //   insurance.check = false;
              //   continue;
              // }
              unitInsList.push(insurance);
            }
          }
        }
      }
      return unitInsList;
    };

    //获取单位参保
    factory.existsAae140 = function (aae140, aab051) {
      //查询单位信息
      var company = factory.getCompany();
      var exists = false;
      angular.forEach(company.companyInsurances, function (item) {
        if (item.aae140 === aae140) {
          if (aab051) {
            if (item.aab051 === aab051) {
              exists = true;
            }
          } else {
            exists = true;
          }
        }
      })
      return exists;
    };

    //获取材料
    var materialResource = $resource(appConfig.baseUrl + '/api/material', {},
      {
        getMaterial: {method: 'Get', isArray: false}
      });

    //获取材料
    factory.getMaterial = function (zsa001) {
      return materialResource.getMaterial({zsa001: zsa001}, function (data) {
        $log.debug('按事项编号获取材料', data);
        return data;
      });

    };
    return factory;
  }]);
