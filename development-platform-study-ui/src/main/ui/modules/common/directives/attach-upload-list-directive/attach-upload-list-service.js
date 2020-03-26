'use strict';
angular.module('hrss.si.enterprise.directivesModule')
  .factory('AttachService', ['ApplyResourceFactory','$log', '$resource', 'girderConfig', function (ApplyResourceFactory,$log, $resource, appConfig) {
      /**
       * 构建申报Resource对象
       * @param applyResource  APPLY_RESOURCE 常量
       * @returns {*}
       */
      function buildResource(applyResource) {
          $log.log('传入resource常量', applyResource);
          var url = applyResource.url;
          $log.log('构建resource路径', url);
          var rs = $resource(url, {id: '@id'},
              {
                  //文件上传Session查询处理
                  listUploadSessions: {
                      method: 'Get',
                      param: {companyId: '@companyId', applyType: applyResource.applyType},
                      url: buildUploadSessionListUrl(applyResource),
                      isArray: true
                  },
                  //文件上传处理结果查询
                  queryUploadResult: {method: 'Get', url: buildUploadResultUrl(applyResource)},
                  //刷新某条处理结果
                  queryUploadFileSession: {method: 'Get', url: buildQueryUploadFileSessionUrl(applyResource)},
                  //删除某条处理结果
                  deleteUploadFileSession: {method: 'DELETE', url: buildDeleteUploadFileSessionUrl(applyResource)}
              });
          /**
           * 文件上传Session查询处理
           * @param companyId
           * @param applyType
           * @returns {*}
           */
          rs.queryApplyFileUploadList = function (companyId, applyType) {
              return rs.listUploadSessions({companyId: companyId, applyType: applyType},
                  function (data) {
                      return data;
                  });
          };
          /**
           * 刷新某条处理结果
           * @param sessionId
           * @returns {*}
           */
          rs.queryUploadSession = function (sessionId) {
              return rs.queryUploadFileSession({sessionId: sessionId},
                  function (data) {
                      return data;
                  });
          };
          /**
           * 删除某条处理结果
           * @param sessionId
           * @returns {*}
           */
          rs.deleteUploadSession = function (sessionId) {
              return rs.deleteUploadFileSession({sessionId: sessionId},
                  function (data) {
                      return data;
                  });
          };

          /**
           * 文件上传Session查询处理 url
           * @param applyResource
           * @returns {string}
           */
          function buildUploadSessionListUrl(applyResource) {
              var url = applyResource.url;
              return appConfig.baseUrl + url + '/upload/uploadSessions';
          }

          /**
           * 文件上传处理结果查询 url
           * @param applyResource
           * @returns {string}
           */
          function buildUploadResultUrl(applyResource) {
              var url = applyResource.url;
              return appConfig.baseUrl + url + '/upload/uploadSessions/:sessionId/result';
          }

          /**
           * 刷新某个处理结果 url
           * @param applyResource
           * @returns {string}
           */
          function buildQueryUploadFileSessionUrl(applyResource) {
              var url = applyResource.url;
              return appConfig.baseUrl + url + '/upload/uploadSessions/:sessionId';
          }

          /**
           * 删除某个处理结果 url
           * @param applyResource
           * @returns {string}
           */
          function buildDeleteUploadFileSessionUrl(applyResource) {
              var url = applyResource.url;
              return appConfig.baseUrl + url + '/upload/uploadSessions/:sessionId';
          }
          return rs;
      }
    //定义工厂对象
    var factory = {};



      //获取申报资源对象
      factory.crtResource = function (applyResource) {
          return buildResource(applyResource);
      };

      return factory;
  }]);
