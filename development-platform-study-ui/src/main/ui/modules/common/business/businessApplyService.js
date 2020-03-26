/**
 * 业务申报
 * Created by WangXG on 2017/12/20.
 */
'use strict';
angular.module('hrss.si.enterprise.businessModule')
  .factory('BusinessApplyService', ['ApplyResourceFactory', 'APPLY_RESOURCE', 'ApplyTypeResourceResolvor', function (ApplyResourceFactory, APPLY_RESOURCE, ApplyTypeResourceResolvor) {

      var factory = {};

      /**
       * 创建申报
       * @param apply
       * @returns {*}
       */
      factory.createApply = function (applyResource, apply) {
        var ApplyResource = ApplyResourceFactory.crtResource(applyResource);
        return new ApplyResource(apply);
      };

      /**
       * 保存/修改申报
       * @param apply
       * @returns {*}
       */
      factory.save = function (apply) {
        if (apply.isNew()) {
          return apply.$save();
        } else {
          return apply.$update();
        }
      };

      /**
       * 校验申报业务相关的信息
       * @param applyType 业务编号 $scope.businessConfig.value
       * @param apply 业务数据
       * @param checkType 校验类型
       * @returns {*|{method, url}}
       */
      factory.check = function (applyType, apply, checkType) {
        apply.requestType = checkType;
        var rs = ApplyTypeResourceResolvor.getResource(applyType);
        return rs.checkBusinessApply(apply,
          function (data) {
            return data;
          });
      };

      /**
       * 查询申报业务相关的信息
       * @param applyType 业务编号 $scope.businessConfig.value
       * @param apply 业务数据
       * @param queryType 查询类型
       * @returns {*|{method, url}}
       */
      factory.query = function (applyType, apply, queryType) {
        apply.requestType = queryType;
        var rs = ApplyTypeResourceResolvor.getResource(applyType);
        return rs.queryBusinessApply(apply,
          function (data) {
            return data;
          });
      };

      /**
       * 批量导盘
       * 获取文件上传地址
       * @returns {*}
       */
      factory.getUploadUrl = function (applyResource) {
        var ApplyResource = ApplyResourceFactory.crtResource(applyResource);
        return ApplyResource.getUploadUrl();
      };

      return factory;

    }]
  );
