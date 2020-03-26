/**
 * Created by congshu on 2018/1/17.
 */
'use strict';
angular.module('hrss.si.enterprise.homeModule')
    .factory('quickLaunchService', ['$log', 'girderConfig', '$resource',
        function ($log, appConfig, $resource) {
            var factory = {};
            var quickLaunchResource = $resource(appConfig.baseUrl + '/api/shortcutMenu', {},
                {
                    getQuickLaunch: {method: 'GET', isArray: false},
                    updateQuickLaunch: {method: 'PUT'}
                }
            );
            //查询快捷菜单
            factory.getQuickLaunch = function (partyType,partyId,menutype) {
                return quickLaunchResource.getQuickLaunch({partyType: partyType,partyId:partyId,menuType:menutype});
            };
            //提交配置菜单
            factory.updateQuickLaunch=function(obj){
                return quickLaunchResource.updateQuickLaunch(obj);
            }
        return factory;
    }]);