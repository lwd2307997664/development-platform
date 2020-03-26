/**
 * Created by juan_wang on 2016/10/24.
 */
'use strict';
angular.module('hrss.si.enterprise.searchModule')
  .filter('jxGridFilter', ['selectCodeService', function (selectCodeService) {
    return function (col, codeType, value) {
      switch (col.field) {
        case 'idCardNumber':
          if (value.substring(17).toLocaleUpperCase() !== 'X') {
            value = '="' + value + '"';
          }
          break;
        default:
          if (codeType !== null && codeType !== '' && codeType !== undefined) {
            value = selectCodeService.getCodeName(codeType, value)
          }
          break;
      }
      return value;
    }
  }]);
