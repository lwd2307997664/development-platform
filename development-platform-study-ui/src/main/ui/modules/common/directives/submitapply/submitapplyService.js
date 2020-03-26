'use strict';
angular.module('hrss.si.enterprise.directivesModule')
  .factory('SubmitApplyService', ['ApplyTypeResourceResolvor','$log', '$resource', 'girderConfig',
      function (ApplyTypeResourceResolvor,$log, $resource, appConfig) {
      //定义工厂对象
      var factory = {
      };

      //提交申报信息
      factory.submitApplyList = function (applyType, submitApplyDTO) {
          //获取资源对象
          var rs = ApplyTypeResourceResolvor.getResource(applyType);
          // //提交DTO对象
          // var submitApplyDTO = {applyIdList: []};
          // for (var i = 0; i < selectedApplyList.length; i++) {
          //     submitApplyDTO.applyIdList.push(selectedApplyList[i].applyId);
          // }
          return rs.submitApply(submitApplyDTO);
      };

    return factory;
  }]);
