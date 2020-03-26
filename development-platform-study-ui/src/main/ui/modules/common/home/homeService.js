/**
 * Created by Administrator on 2018/1/11.
 */
/**
 * home页信息查询
 * Created by congshu.
 */
'use strict';
angular.module('hrss.si.enterprise.homeModule')
    .factory('homeService', ['$resource', 'girderConfig', '$log', function ($resource, appConfig) {
        var factory = {};
        var Resource = $resource(appConfig.baseUrl + '/api/apply/profile',{},
            {
                getActualInfo: {
                    method: 'GET',
                    isArray: false
                }
            }
        );
        /**
         * 查询totalInfo
         *
         *
         */
        factory.queryActualInfo = function (companyId) {
            return Resource.getActualInfo({
                applicantId:companyId,
            });
        };
        return factory;
    }]
);