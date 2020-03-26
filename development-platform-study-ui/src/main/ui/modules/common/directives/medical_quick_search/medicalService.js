/**
 * Created by xuml on 2015/6/4.
 *
 */
'use strict';
// app/modules/login/authservice.js
angular.module('hrss.si.enterprise.directivesModule')
    .factory('MedicalOrgService', ['$log', '$resource', 'girderConfig', function ($log, $resource, appConfig) {
        //医院资源对象
        var medicalResource = $resource(appConfig.baseUrl, {},
            {
                findMedicalInfo: {
                    method: 'POST',
                    url: appConfig.baseUrl+'/api/apply/injure/registerApply/appointedHospital',
                    isArray: false}
            });

        //定义工厂对象
        var factory = {
            //
        };

        //定点医疗机构快速查询
        factory.getMedicalOrgInfo = function (data) {
            return medicalResource.findMedicalInfo(data, function (data) {
                    return data;
                });
        };
        return factory;
    }]);
