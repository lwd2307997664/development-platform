/**
 * Created by congshu on 2018/1/17.
 */
'use strict';
angular.module('hrss.si.enterprise.homeModule')
    .factory('noticeService', ['$log', 'girderConfig', '$resource',
        function ($log, appConfig, $resource) {
            var factory = {};
            var noticeesource = $resource(appConfig.baseUrl + '/api/simis/notice', {},
                {
                    getNoticeList: {
                        method: 'GET',
                        isArray: false
                    }
                }
            );
            //通知信息查询
            factory.queryNoticeList = function (cbb001) {
                return noticeesource.getNoticeList({cbb001: cbb001});
            };

            return factory;
        }]);