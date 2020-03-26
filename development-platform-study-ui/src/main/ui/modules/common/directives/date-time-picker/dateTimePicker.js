/**
 *@expression 日期时间选择器
 *@author jiachw
 *@Date   create in 2019/5/13
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule')
    .directive('dateTimePicker', [function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/common/directives/date-time-picker/dateTimePicker.html',
            scope: {
                isOpen: '=?',
                dateTimeValue: '=?',
                timeFormat: '@',
                timeWidth: '@',
                valueChange: '&',
                max: '=maxDay'
            },
            controller: 'dateTimePickerCtrl',
            link: function (scope, element, attrs, ctrls) {
                scope.hw = +scope.timeWidth || 40;
                scope.isOpen1 = false;
                scope.init();
            }
        }
    }])
    .controller('dateTimePickerCtrl', ['$scope', '$uibPosition', '$timeout', function ($scope, $position, $timeout) {
        var HOUR_ELE = '[role="hour"]';
        var MINUTE_ELE = '[role="minute"]';
        var SECOND_ELE = '[role="second"]';
        $scope.hours = [];
        $scope.minutes = [];
        $scope.seconds = [];
        $scope.dateOptions = {
            'year-format': '"yyyy"',
            'starting-day': 1,
            'datepicker-mode': '"day"',
            'min-mode': 'day'
        };
        $scope.$watch('isOpen', function (newVal) {
            ( $scope.isOpen1 = !!$scope.dateValue);
        });
        $scope.init = function () {
            createDate();
            var x = $position.offset(angular.element('[name="date-time-picker"]'));
            $scope.top = x.height;
        };
        $scope.initTime = function () {
            bindSelectEvent(HOUR_ELE);
            bindSelectEvent(MINUTE_ELE);
            bindSelectEvent(SECOND_ELE);
            $timeout(scrollToNow, 0);
        };
        var bindSelectEvent = function (selector) {
            var ele = angular.element(selector);
            ele && ele.on('mouseleave', function (evt) {
                var index = Math.floor((16 + ele.scrollTop()) / 32);
                update(selector, index);
                $scope.$apply();
            });
        };
        var update = function (selector, index) {
            var prop = selector === HOUR_ELE ? 'hIndex' : selector === MINUTE_ELE ? 'mIndex' : selector === SECOND_ELE ? 'sIndex' : '';
            if (prop) {
                $scope[prop] = index;
                angular.element(selector).scrollTop(32 * index);
            }
        };
        var createDate = function () {
            for (var h1 = 0; h1 < 3; h1++) {
                for (var h2 = 0; h2 < 10; h2++) {
                    if (h1 === 2 && h2 > 3) {
                        break;
                    }
                    $scope.hours.push(h1 + '' + h2);
                }
            }
            for (var m1 = 0; m1 < 6; m1++) {
                for (var m2 = 0; m2 < 10; m2++) {
                    $scope.minutes.push(m1 + '' + m2);
                    $scope.seconds.push(m1 + '' + m2);
                }
            }
        };
        var scrollToNow = function () {
            var hour = 0, min = 0, sec = 0;
            if ($scope.dateTimeValue != null) {
                hour = $scope.hours.indexOf($scope.dateTimeValue.slice(8, 10));
                min = $scope.minutes.indexOf($scope.dateTimeValue.slice(10, 12));
                sec = $scope.seconds.indexOf($scope.dateTimeValue.slice(12, 14));
            } else {
                var now = new Date();
                hour = now.getHours();
                min = now.getMinutes();
                sec = now.getSeconds();
            }
            update(HOUR_ELE, hour !== -1 ? hour : 0);
            update(MINUTE_ELE, min !== -1 ? min : 0);
            update(SECOND_ELE, sec !== -1 ? sec : 0);
        };
        $scope.selectHour = function (index) {
            update(HOUR_ELE, index);
        };
        $scope.selectMinute = function (index) {
            update(MINUTE_ELE, index);
        };
        $scope.selectSecond = function (indx) {
            update(SECOND_ELE, indx);
        };
        $scope.close = function () {
            var time = $scope.hours[$scope.hIndex];
            time += /hhmm/i.test($scope.timeFormat) ? $scope.minutes[$scope.mIndex] : '';
            time += /hhmmss$/i.test($scope.timeFormat) ? $scope.seconds[$scope.sIndex] : '';
            $scope.dateTimeValue = $scope.dateValue + time;
            $scope.isOpen1 = false;
            $timeout(function () {
                angular.isFunction($scope.valueChange) && $scope.valueChange();
            }, 0);
        };
    }]);