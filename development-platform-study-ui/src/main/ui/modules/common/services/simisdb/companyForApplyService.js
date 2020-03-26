/**
 * Created by xuml on 2016/6/23.
 *
 */
'use strict';
angular.module('hrss.si.enterprise.simisModule')
    .factory('ComppanyForApplyService', ['messageService','ApplyResourceFactory','$log','$resource', 'girderConfig',
        function(messageService,ApplyResourceFactory,$log,$resource,appConfig) {
            //定义工厂对象
            var factory = {
            };

            //查询结算期
            factory.getCompanyForApply = function (applyInitData,applyResource,applyType,issue,callBack) {
                var  requiredValidateResult = {data:'',isValid: 'true', message: ''};
                var rs=ApplyResourceFactory.crtResource(applyResource);
                // var reviewedStatus = '0';//审核中
                var submitType = '1';//已提交
                $log.log('获取单位信息',applyInitData);
                var detail={
                    representativeId:applyInitData.aab001,
                    applicantId:applyInitData.aab001,
                    applyType: applyType,
                    issue:issue,
                    submitType:submitType
                };
                //获取正在审核中的数据
                rs.querySubmitApply(detail).$promise.then(function (submitApplyData) {
                    if(submitApplyData.length>0){
                        requiredValidateResult = {data:'',isValid: false, message: '查询到存在正在审核中的申报,不予办理！'};
                        callBack(requiredValidateResult);
                    }else {
                        //获取申报数据
                        rs.queryUnsubmitApply(applyInitData.aab001).$promise.then(function (data) {
                            if(data.length>0){
                                requiredValidateResult = {data:data[0],isValid: false, message: '查询到已保存申请信息，可修改！'};
                                callBack(requiredValidateResult);
                            }else{
                                requiredValidateResult = {data:'',isValid: true, message: ''};
                                callBack(requiredValidateResult);
                            }
                        },function (err) {
                            requiredValidateResult = {data:'',isValid: true, message:err.detail.data};
                            callBack(requiredValidateResult);
                        });
                    }
                },function (err) {
                    requiredValidateResult = {data:'',isValid:true, message:err.detail.data};
                    callBack(requiredValidateResult);
                });

            };


            return factory;
        }]);