/*import 'bootstrap-daterangepicker';*/
import './daterangepicker.less';
import moment from 'moment';

import 'lib/bootstrap-daterangepicker';

export default app => {

  app.constant('dateRangePickerConfig', {
    clearLabel: '清空',
    locale: {
        //format: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD',
        separator: ' 至 ',
        applyLabel: '确定',
        cancelLabel: '取消',
        fromLabel: '从',
        toLabel: '到',
        customRangeLabel: '自定义',
        lastMonthLabel: '上个月',
        daysOfWeek: ['日', '一', '二', '三', '四', '五','六'],
        monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        firstDay: 1,
    },
    applyClass: 'btn btn-primary'
  }).directive('snDateRangePicker', ['$compile', '$timeout', '$parse', 'dateRangePickerConfig', function($compile, $timeout, $parse, dateRangePickerConfig) {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        min: '=',
        max: '=',
        model: '=ngModel',
        opts: '=options',
        clearable: '='
      },
      link: function($scope, element, attrs, modelCtrl) {
        var _clear, _init, _initBoundaryField, _mergeOpts, _picker, _setDatePoint, _setEndDate, _setStartDate, _validate, _validateMax, _validateMin, customOpts, el, opts;
        
        _mergeOpts = function() {
          var extend, localeExtend;
          localeExtend = angular.extend.apply(angular, Array.prototype.slice.call(arguments).map(function(opt) {
            return opt != null ? opt.locale : void 0;
          }).filter(function(opt) {
            return !!opt;
          }));
          extend = angular.extend.apply(angular, arguments);
          extend.locale = localeExtend;
          return extend;
        };

        el = $(element);
        customOpts = $scope.opts;
        opts = _mergeOpts({locale: {}}, dateRangePickerConfig, customOpts);

        if ($scope.clearable || opts.clearable) {
            opts = _mergeOpts(opts, {
              locale: {
                cancelLabel: opts.clearLabel
              }
            });
        }

        _picker = null;
        _clear = function() {
          _picker.setStartDate();
          return _picker.setEndDate();
        };

        _setDatePoint = function(setter) {
          return function(newValue) {
            if (_picker && newValue) {
              return setter(moment(newValue));
            }
          };
        };
        _setStartDate = _setDatePoint(function(m) {
          if (_picker.endDate < m) {
            _picker.setEndDate(m);
          }
          opts.startDate = m;
          return _picker.setStartDate(m);
        });
        _setEndDate = _setDatePoint(function(m) {
          if (_picker.startDate > m) {
            _picker.setStartDate(m);
          }
          opts.endDate = m;
          return _picker.setEndDate(m);
        });

        _validate = function(validator) {
          return function(boundary, actual) {
            if (boundary && actual) {
              return validator(moment(boundary), moment(actual));
            } else {
              return true;
            }
          };
        };
        _validateMin = _validate(function(min, start) {
          return min.isBefore(start) || min.isSame(start, 'day');
        });
        _validateMax = _validate(function(max, end) {
          return max.isAfter(end) || max.isSame(end, 'day');
        });

        modelCtrl.$formatters.push(function(objValue) {
          var f;
          f = function(date) {
            if (!moment.isMoment(date)) {
              return moment(date).format(opts.locale.format);
            } else {
              return date.format(opts.locale.format);
            }
          };

          if (objValue) {
            if (opts.singleDatePicker) {
              return f(objValue);
            } else if (objValue.startDate) {
              return [f(objValue.startDate), f(objValue.endDate)].join(opts.locale.separator);
            }
          } 
          return '';
        });

        modelCtrl.$render = function() {
          if (modelCtrl.$modelValue && modelCtrl.$modelValue.startDate) {
            _setStartDate(modelCtrl.$modelValue.startDate);
            _setEndDate(modelCtrl.$modelValue.endDate);
          } else {
            _clear();
          }
          return el.val(modelCtrl.$viewValue);
        };

        modelCtrl.$parsers.push(function(val) {
          var f, objValue, x;
          f = function(value) {
            return moment(value, opts.locale.format);
          };
          objValue = {
            startDate: null,
            endDate: null
          };
          if (angular.isString(val) && val.length > 0) {
            if (opts.singleDatePicker) {
              objValue = f(val);
            } else {
              x = val.split(opts.locale.separator).map(f);
              objValue.startDate = x[0];
              objValue.endDate = x[1];
            }
          }
          return objValue;
        });
        modelCtrl.$isEmpty = function(val) {
          return !(angular.isString(val) && val.length > 0);
        };

        _init = function() {
          var eventType, results;
          el.daterangepicker(angular.extend(opts, {
            autoUpdateInput: false
          }));
          el.on('apply.daterangepicker', function(evt, picker) {
            $scope.$apply(function() {
              return $scope.model = opts.singleDatePicker ? picker.startDate : {
                startDate: picker.startDate,
                endDate: picker.endDate
              };
            });
          });

          if ($scope.clearable || opts.clearable) {
            el.on('cancel.daterangepicker', function() {
              return $scope.$apply(function() {
                return $scope.model = opts.singleDatePicker ? null : {
                  startDate: null,
                  endDate: null
                };
              });
            });
          }

          _picker = el.data('daterangepicker');
          results = [];
          for (eventType in opts.eventHandlers) {
            results.push(el.on(eventType, function(e) {
              var eventName;
              eventName = e.type + '.' + e.namespace;
              return $scope.$evalAsync(opts.eventHandlers[eventName]);
            }));
          }
          return results;
        };

        _init();

        if (opts.singleDatePicker) {
          $scope.$watch('model', function(n) {
            return _setStartDate(n);
          });
        } else {
          $scope.$watch('model.startDate', function(n) {
            return _setStartDate(n);
          });
          $scope.$watch('model.endDate', function(n) {
            return _setEndDate(n);
          });

        }
        

        _initBoundaryField = function(field, validator, modelField, optName) {
          if (attrs[field]) {
            modelCtrl.$validators[field] = function(value) {
              return value && validator(opts[optName], opts.singleDatePicker ? value : value[modelField]);
            };
            return $scope.$watch(field, function(date) {
              opts[optName] = date ? moment(date) : false;
              //手动调一次校验
              modelCtrl.$validate();
              return _init();
            });
          }
        };
        _initBoundaryField('min', _validateMin, 'startDate', 'minDate');
        _initBoundaryField('max', _validateMax, 'endDate', 'maxDate');

        if (attrs.options) {
          $scope.$watch('opts', function(newOpts) {
            opts = _mergeOpts(opts, newOpts);
            return _init();
          }, true);
        }

        return $scope.$on('$destroy', function() {
          return _picker != null ? _picker.remove() : void 0;
        });
      }
    };
  }]);
};

