/**
 * Created by wuyf on 2014/5/22.
 * simis 数据服务类
 *
 * PersonService 表示人员数据服务，用来操作所有未死亡、未合并的参保人
 * $log.debug("-按证件类型查询",PersonService.findPersonByCertificateNumber('01','460200196101200532'));
 * $log.debug("-按个人编号查询",PersonService.findByPersonNumber('3501809229'));
 *
 * ------------注意异步回调的写法
 * var person = PersonService.findByPersonNumber('3501809229');
 * 检查是否在其他单位参保
 * person.$promise.then(function(result){
 *    $log.debug('测试----------',result.isInsuredInOtherCompany(223232));
 * });
 *
 */
'use strict';
angular.module('hrss.si.enterprise.simisModule')
  .factory('PersonService', ['$log', '$resource', 'girderConfig', function ($log, $resource, appConfig) {
      //单位资源对象
      var personResource = $resource(appConfig.baseUrl + '/api/simis/persons/:personId', {personId: '@personId'},
        {
          findPersonByCertificateNumber: {
            method: 'Get',
            params: {certificateType: 0, aac147: 0},
            isArray: false
          },
          findPersonById: {method: 'Get', url: appConfig.baseUrl + '/api/simis/person/personId'},
          findPerson: {
            method: 'Get', params: {aab001: 0, aac999: 0, aac003: '', aac147: '', isAll: ''},
            url: appConfig.baseUrl + '/api/simis/person', isArray: true
          }
        });

      //定义工厂对象
      var factory = {
        //
      };

      //按证件类型，证件号码查询单位下人员(适用于人员新参保和续保，在后台已控制只可查询出一条人员信息)
      factory.findPersonByCertificateNumber = function (certificateType, aac147) {
        return personResource.findPersonByCertificateNumber(
          {
            certificateType: certificateType,
            aac147: aac147
          }, function (data) {
            $log.debug('按证件类型、证件号码查询单位下人员aac147=', aac147, data);
            return data;
          });
      };

      //按个人id查询下人员信息(搜索范围为全库)
      factory.findByPersonId = function (personId) {
        return personResource.findPersonById({personId: personId}, function (data) {
          $log.debug('按个人ID查询人员信息', data);
          return data;
        });
      };

      //快速查询单位下人员
      factory.findPerson = function (aab001, aac999, aac003, aac147, isAll) {
        $log.debug('按快速查询单位下人员aab001=[' + aab001 + '],aac999=[' + aac999 + '],aac003=[' + aac003 + '],aac147=[' + aac147 + '],isAll=[' + isAll+ ']');
        return personResource.findPerson(
          {
            findType: '1',
            aab001: aab001,
            aac999: aac999,
            aac003: aac003,
            aac147: aac147,
            isAll: isAll
          }, function (data) {
            return data;
          });
      };


      //aab001传入当前单位id
      personResource.prototype.isInsuredInOtherCompany = function (aab001) {
        var flag = false;
        for (var i = 0; i < this.personInsurance.length; i++) {
          var ins = this.personInsurance[i];
          if (ins.insuranceCode !== '15' && ins.insuranceCode !== '38') {
            if (aab001 !== ins.insurantOrgId && '1' === ins.paymentState) { //参保状态
              flag = true;
              break;
            }
          }
        }
        return flag;
      };

      //判断在其它单位是否所有险种都已停保
      personResource.prototype.isPauseInOtherCompany = function (aab001) {
        var flag = false;
        for (var i = 0; i < this.personInsurance.length; i++) {
          var ins = this.personInsurance[i];
          if (ins.insuranceCode !== '15' && ins.insuranceCode !== '38') {
            if ('2' === ins.paymentState) {
              flag = true;
              break;
            }
          }
        }
        return flag;
      };

      //判断是否已在本单位参保
      personResource.prototype.isInsuredInthisCompany = function (aab001) {
        var flag = false;
        for (var i = 0; i < this.personInsurance.length; i++) {
          var ins = this.personInsurance[i];
          if (aab001 === ins.insurantOrgId && '1' === ins.paymentState) { //参保状态
            flag = true;
            break;
          }
        }
        return flag;
      };

      //判断是否有终止参保的险种
      personResource.prototype.isStopInOtherCompany = function () {
        var flag = false;
        for (var i = 0; i < this.personInsurance.length; i++) {
          var ins = this.personInsurance[i];
          if (ins.insuranceCode !== '15' && ins.insuranceCode !== '38') {
            if ('3' === ins.paymentState) {
              flag = true;
              break;
            }
          }
        }
        return flag;
      };

      //判断人员是否已经退休
      personResource.prototype.isRetired = function () {
        return (this.retireStatus !== '11');
      };

      //未参保城职参保城乡的情况
      // personResource.prototype.isInsuredCountry = function () {
      //   var flag = false;
      //   for (var i=0; i<this.personInsurance.length; i++) {
      //     var ins = this.personInsurance[i];
      //     if ('15' === ins.insuranceCode || '38' === ins.insuranceCode) {
      //       flag = true;
      //       break;
      //     }
      //   }
      //   return flag;
      // };

      //判断此人是否满足参保条件(用于职工新增)
      factory.IsPersonInsured = function (result, aab001) {
        var validateResult = {isValid: 'true', message: '', changeType: '', changeReason: ''};
        if (result.isRetired()) {
          validateResult = {isValid: 'false', message: '此人为离退休人员,不允许办理该业务'};
        } else if (result.isInsuredInOtherCompany(aab001)) {
          validateResult = {isValid: 'false', message: '此人已在其它单位参保,不允许办理该业务'};
        } else if (result.isInsuredInthisCompany(aab001)) {
          validateResult = {isValid: 'false', message: '此人已在本单位参保,不允许办理该业务'};
        } else if (result.isStopInOtherCompany()) {
          validateResult = {isValid: 'false', message: '此人存在终止参保险种,不允许办理该业务'};
        } else if (result.isPauseInOtherCompany(aab001)) {
          validateResult = {isValid: 'true', message: '', changeType: '21'};
        } else {
          validateResult = {isValid: 'true', message: '', changeType: '11'};
        }
        // } else if(result.isInsuredCountry()){
        //   validateResult = {isValid: 'true', message: ''};
        // }
        return validateResult;
      };

      return factory;
    }]
  );
