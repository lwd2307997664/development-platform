'use strict';
angular.module('hrss.si.enterprise.directivesModule')
  .factory('DossierService', ['$log', '$resource', 'girderConfig', function ($log, $resource, appConfig) {
    //单位资源对象
    var dossierResource = $resource(appConfig.baseUrl + '/api/dossier/attachment', {},
      {
        findByNumber: {method: 'Get', params: {dossierNumber: 0}},
        update: {method: 'Post',},
          submitOriginal: {
              method: 'POST',
              url: appConfig.baseUrl + '/api/pile/dossier/submit/original'
          }
      });

    //定义工厂对象
    var factory = {
      dossier: {}
    };

    factory.update = function (attachmentLis) {
      $log.debug('业务材料管理', attachmentLis);
      return dossierResource.update(attachmentLis, function (data) {
        $log.debug('业务材料管理', data);
        factory.dossier = data;
        return data;
      });
    };

    factory.getMatter = function () {
      $log.debug('获取事项编号');
      var matter = null;
      if (dossier.attachmentList && dossier.attachmentList.length > 0) {
        matter = dossier.attachmentList[0].matter;
      }
      return matter;
    };
    /**
     * 通过attachmentList获取matter
     * @returns {*}
     */
    factory.getMatterByAttachmentList = function (attachmentList) {
      $log.debug('通过attachmentList获取matter',attachmentList);
      var matter = null;
      if (attachmentList && attachmentList.length > 0) {
        matter = attachmentList[0].matter;
      }
      return matter;
    };

      factory.submitOriginal = function (submitOriginalDTO) {
          $log.debug('业务材料管理', submitOriginalDTO);
          return dossierResource.submitOriginal(submitOriginalDTO, function (data) {
              return data;
          });
      };

    return factory;
  }]);
