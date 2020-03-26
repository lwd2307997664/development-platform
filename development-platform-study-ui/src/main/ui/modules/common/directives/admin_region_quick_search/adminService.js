/**
 * 医疗相关快速查询
 *
 * Created by WangXG on 2015/6/4.
 *
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule')
    .factory('AdminService', ['$log', '$resource', 'girderConfig', function ($log, $resource, appConfig) {

        var factory = {};
        var Resource = $resource(appConfig.baseUrl + '/api/search', {},
            {
                findInfo: {
                    url: appConfig.baseUrl + '/api/search/transfer',
                    method: 'GET', isArray: true
                }
            }
        );
        factory.findAdminInfo = function (originalAgencyState, originalAgencyName,bae140) {
            return Resource.findInfo({
                originalAgencyState:originalAgencyState,
                originalAgencyName:originalAgencyName,
                bae140:bae140
            }, function (data) {
                return data;
            });
        };
        return factory;
    }]);
