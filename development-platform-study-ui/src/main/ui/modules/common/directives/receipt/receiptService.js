'use strict';
angular.module('hrss.si.enterprise.directivesModule')
  .factory('receiptService', ['$log', '$resource', 'girderConfig', 'HRSS_APP_USER_DETAILS_CACHE', function ($log, $resource, appConfig, HRSS_APP_USER_DETAILS_CACHE) {
    //单位资源对象
    var receiptResource = $resource(appConfig.baseUrl + '/api/receipt/attachment', {},
      {
        findByNumber: {method: 'Get', params: {receiptNumber: 0}},
        update: {method: 'Post',}
      });

    //定义工厂对象
    var factory = {
      receipt: {}
    };

    //按单位编号查询单位
    factory.update = function (attachmentLis) {
      $log.debug('业务材料管理', attachmentLis);
      return receiptResource.update(attachmentLis, function (data) {
        $log.debug('业务材料管理', data);
        factory.receipt = data;
        return data;
      });
    };

    factory.getMatter = function () {
      $log.debug('获取事项编号');
      var matter = null;
      if (receipt.attachmentList && receipt.attachmentList.length > 0) {
        matter = receipt.attachmentList[0].matter;
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
    return factory;
  }]);
