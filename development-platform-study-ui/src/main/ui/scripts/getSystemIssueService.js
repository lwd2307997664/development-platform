/**
 * Created by xuml on 2016/6/23.
 *
 */
'use strict';
angular.module('HRSSEnterpriseApp')
  .constant('CURRENT_ISSUE', {
    issueCache: 'issue',
    isTestFlagCache:'isTestFlag'
  })
  .constant('MATTER_LIST', {
      matterList: 'matterList'
  })
  .factory('SystemIssue', ['$log','$resource', 'girderConfig','CURRENT_ISSUE','$q','MATTER_LIST',
  function($log,$resource,appConfig, CURRENT_ISSUE,$q,MATTER_LIST) {
    //系统结算期资源
    var systemIssueResource = $resource(appConfig.baseUrl + '/api/simis/issue',{},
      {
      getIssue: {method: 'Get'}
      });

    //定义工厂对象
    var factory = {
    };

    //查询结算期
    factory.loadCurrentIssue = function () {
      var deferred = $q.defer(); // 生成Deferred对象
      var issue = localStorage.getItem(CURRENT_ISSUE.issueCache);
      if (issue !== undefined && issue !== null) {
        issue = JSON.parse(issue);
        $log.debug('从缓存加载结算期:', issue);
        deferred.resolve(issue); // 改变Deferred对象的执行状态
        return deferred.promise;
      } else {
        return systemIssueResource.getIssue().$promise.then(function (data) {
          $log.info('首次加载结算期', data);
          localStorage.setItem(CURRENT_ISSUE.issueCache, JSON.stringify(data));
          return data;
        });
      }
    };

    //系统经办事项
    var matterResource = $resource(appConfig.baseUrl + '/api/matter',{},
        {
            getMatter: {method: 'Get',isArray:true}
        });

    //查询经办事项
    factory.loadMatterList = function () {
        var deferred = $q.defer(); // 生成Deferred对象
        var issue = localStorage.getItem(MATTER_LIST.matterList);
        if (issue !== undefined && issue !== null) {
            issue = JSON.parse(issue);
            $log.debug('从缓存加载经办事项:', issue);
            deferred.resolve(issue); // 改变Deferred对象的执行状态
            return deferred.promise;
        } else {
            return matterResource.getMatter().$promise.then(function (data) {
                $log.info('首次加载经办事项', data);
                localStorage.setItem(MATTER_LIST.matterList, JSON.stringify(data));
                return data;
            });
        }
    };

      // add by lizheng begin
      //获取测试标识
      var getTestFlagResource = $resource(appConfig.baseUrl + '/api/simis/issue/testflag',{},
          {
              getTestFlag: {method: 'Get',params:{}}
          });

      factory.getTestFlag = function () {
          return getTestFlagResource.getTestFlag({}).$promise.then(function (data) {
              localStorage.setItem(CURRENT_ISSUE.isTestFlagCache, JSON.stringify(data.testFlag));
              return data;
          });
      };
      // add by lizheng end

    return factory;
  }]);