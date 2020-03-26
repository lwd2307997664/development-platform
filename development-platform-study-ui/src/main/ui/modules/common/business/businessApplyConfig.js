/**
 * 业务申报配置
 * Created by WangXG on 2017/12/20.
 */
'use strict';
angular.module('hrss.si.enterprise.businessModule')
  .factory('BusinessApplyConfig', ['$log',
    function ($log) {
      var factory = {};

      var business = [{
        value: '1204',
        name: '个人缴费工资修改',
        detailUrl: 'modules/business/custom/employee/salary/employeeSalaryApplyView.html',//页面Path
        requestPath: 'employeeSalary',//前台请求路径
        showTab: {single: true, batch: false, manage: true},////前台显示TAB页
        applyResource: {url: buildResourceUrl('employeeSalary')}//后台请求路径
      },{
        value: '1231',
        name: '异地居住备案',
        detailUrl: 'modules/business/custom/employee/offSiteRecord/offSiteRecordView.html',//页面Path
        requestPath: 'offSiteRecord',//前台请求路径
        showTab: {single: true, batch: false, manage: true},////前台显示TAB页
        applyResource: {url: buildResourceUrl('offSiteRecord')}//后台请求路径
      },{
          value: '6001',
          name: '未认定职工就医申请',
          detailUrl: '',//页面Path
          requestPath: '',//前台请求路径
          showTab: {single: true, batch: false, manage: true},////前台显示TAB页
          applyResource: {url: '/api/approveAgent/6001'}//后台请求路径
      },{
          value: '6002',
          name: '旧伤复发治疗申请',
          detailUrl: '',//页面Path
          requestPath: '',//前台请求路径
          showTab: {single: true, batch: false, manage: true},////前台显示TAB页
          applyResource: {url: '/api/approveAgent/6002'}//后台请求路径
      },{
          value: '6003',
          name: '职工转诊转院申请',
          detailUrl: '',//页面Path
          requestPath: '',//前台请求路径
          showTab: {single: true, batch: false, manage: true},////前台显示TAB页
          applyResource: {url: '/api/approveAgent/6003'}//后台请求路径
      },{
          value: '6004',
          name: '职工康复申请',
          detailUrl: '',//页面Path
          requestPath: '',//前台请求路径
          showTab: {single: true, batch: false, manage: true},////前台显示TAB页
          applyResource: {url: '/api/approveAgent/6004'}//后台请求路径
      },{
          value: '6005',
          name: '职工辅助器具配置申请',
          detailUrl: '',//页面Path
          requestPath: '',//前台请求路径
          showTab: {single: true, batch: false, manage: true},////前台显示TAB页
          applyResource: {url: '/api/approveAgent/6005'}//后台请求路径
      },{
          value: '6006',
          name: '职工延长就医时间申请',
          detailUrl: '',//页面Path
          requestPath: '',//前台请求路径
          showTab: {single: true, batch: false, manage: true},////前台显示TAB页
          applyResource: {url: '/api/approveAgent/6006'}//后台请求路径
      },{
          value: '6007',
          name: '辅助器具配置费用联网结算',
          detailUrl: '',//页面Path
          requestPath: '',//前台请求路径
          showTab: {single: true, batch: false, manage: true},////前台显示TAB页
          applyResource: {url: '/api/approveAgent/6007'}//后台请求路径
      }];

      /**
       * 拼请求路径 上下文 business
       * @param requestPath
       * @returns {string}
       */
      function buildResourceUrl(requestPath) {
        return '/api/business/' + requestPath;
      }

      /**
       * 获取配置
       * @param key
       * @returns {*}
       */
      factory.getBusiness = function (key) {
        var returnValue;
        angular.forEach(business, function (item) {
          if (item.applyType === key || item.value === key || item.businessType === key || item.requestPath === key) {
            returnValue = item;
          }
        })
        if (!returnValue) {
          $log.error('根据key未获取到配置信息,key：' + key);
        } else {
          $log.debug('获取配置信息：' + returnValue);
        }
        return returnValue;
      }

        /**
         * 获取配置
         * @returns {*}
         */
        factory.getAllBusiness = function () {
            return business;
        };

      return factory;
    }]);
