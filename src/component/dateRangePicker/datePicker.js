import moment from 'moment'
import 'lib/bootstrap-daterangepicker';
import 'lib/bootstrap-daterangepicker/daterangepicker.css'

import './datePicker.css';
import datePickerTmpl from './datePicker.html';           //单点到单点事件选择
import smallDateTmpl from './dateRangePicker-sm.html';    //单个日期选择
import largeDateTmpl from './dateRangePicker-lg.html';    //日期时间段选择
import dateRangePickerTmpl from './dateRangePicker.html'; //带自定义标签名称的日期选择

export default app => {
    app.directive("snDatePicker", ["LazyLoader", "$compile", function (LazyLoader, $compile) {

        const DEFAULT_LOCALE_PARAMS = {
            "separator": " 至 ",
            "applyLabel": "确定",
            "fromLabel": "开始",
            "toLabel": "到",
            "customRangeLabel": "自定义",
            "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
            "monthNames": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
        };

        const DEFAULT_PRAMS = {
            isolateRange: false,
            startLabel: '起点',
            endLabel: '终点',
            customDateLabel: '日期输入框',
            isCustomDateLabel: false,
            isDatePickerDisabled: false,
        };

        //初始化参数和模版
        function init(scope, element, e) {
            let template;

            scope.isolateRange = DEFAULT_PRAMS.isolateRange;
            scope.isCustomDateLabel = DEFAULT_PRAMS.isCustomDateLabel;
            scope.isDatePickerDisabled = DEFAULT_PRAMS.isDatePickerDisabled;

            let locale = {
                "format": scope.snDatePicker.format
            };
            scope.snDatePicker.locale = angular.extend(DEFAULT_LOCALE_PARAMS, locale);

            //日期组件是否disabled
            if (typeof scope.snDatePicker.isDatePickerDisabled === 'boolean') {
                scope.isDatePickerDisabled = scope.snDatePicker.isDatePickerDisabled;
            }

            //是否为单点到单点
            if (typeof scope.snDatePicker.isolateRange === 'boolean') {
                scope.isolateRange = scope.snDatePicker.isolateRange;
            }

            //是否需要自定义标签名
            if (typeof scope.snDatePicker.isCustomDateLabel === 'boolean') {
                scope.isCustomDateLabel = scope.snDatePicker.isCustomDateLabel;
            }


           /* //设置input宽度

            if(scope.isolateRange){
                $(this).find("div[name='date']").css('width', scope.snWidth);
            } else {
                element[0].style.width = scope.snWidth + 'px';
            }*/

            scope.clickIcon = function ($event) {
                if (scope.stopPropagation) {
                    $event.stopPropagation();
                }
                element.find("input[name='selectDate']").focus();
                /*selectDate(scope, element, e);*/
            };

            if (scope.snDatePicker.isCustomDateLabel) {
                scope.customDateLabel = scope.snDatePicker.customDateLabel ? scope.snDatePicker.customDateLabel : DEFAULT_PRAMS.customDateLabel;
                template = dateRangePickerTmpl;
            }

            else {
                if (scope.snDatePicker.singleDatePicker) {

                    if (scope.isolateRange) {
                        //确定起止的标签名称
                        scope.startLabel = scope.snDatePicker.startLabel ? scope.snDatePicker.startLabel : DEFAULT_PRAMS.startLabel;
                        scope.endLabel = scope.snDatePicker.endLabel ? scope.snDatePicker.endLabel : DEFAULT_PRAMS.endLabel;
                        template = angular.element(datePickerTmpl);
                    } else {
                        template = smallDateTmpl;
                    }
                }
                else {
                    template = largeDateTmpl;
                    //template = dateRangePickerTmpl;
                }
            }

            //日期组件是否disabled
            if (typeof scope.snDatePicker.isDatePickerDisabled === 'boolean') {
                scope.isDatePickerDisabled = scope.snDatePicker.isDatePickerDisabled;
            }

            template = angular.element(template);
            element.append(template);
            $compile(template)(scope);
        }

        //非单点到单点日期选择事件
        function selectDate(scope, element, e) {



            //扩展一个设置输入框内容的方法供control调用
            scope.snDatePicker.setInputValue = function (startDate, endDate) {
                if (startDate && endDate) {
                    element.val(moment(startDate).format(scope.snDatePicker.locale.format) + scope.snDatePicker.locale.separator + moment(endDate).format(scope.snDatePicker.locale.format));
                } else {
                    element.val('');
                }
            };

            //监听日期选择事件
            element.on('apply.daterangepicker', function (ev, picker) {
                //如果是单点时间
                if (picker.singleDatePicker) {
                    $(this).find("input[name='selectDate']").val(picker.startDate.format(scope.snDatePicker.format));
                }
                else {
                    $(this).find("input[name='selectDate']").val(picker.startDate.format(scope.snDatePicker.format) + scope.snDatePicker.locale.separator + picker.endDate.format(scope.snDatePicker.format));
                }
                //scope.$emit(e, { 'start': picker.startDate, 'end': picker.endDate });separator



                scope.$emit(e, {'start': picker.startDate.format(scope.snDatePicker.format), 'end': picker.endDate.format(scope.snDatePicker.format)});
            });

            //调用daterangepicker插件
            element.find("input[name='selectDate']").daterangepicker(scope.snDatePicker);
        }

        //单点到单点的日期选择事件
        function selectIsolateDateRange(scope, element, e) {
            //选择起点
            scope.selectStartDate = function () {
                scope.params.isStart = true;

                if (scope.params.maxDate != null) {
                    //如果起止时间都不为空，则重置
                    if (scope.params.minDate != null) {
                        scope.snDatePicker.minDate = false;
                    }
                    scope.snDatePicker.maxDate = scope.params.maxDate;

                    //如果终止时间是今天,将起始日期的今天按钮置灰
                    moment().startOf('day').isSame(moment(scope.params.selectEndDate)) ? scope.snDatePicker.isTodayEnable = false : scope.snDatePicker.isTodayEnable = true;

                }
                //scope.snDatePicker.locale = angular.extend(DEFAULT_LOCALE_PARAMS, scope.snDatePicker.locale);

                element.find("input[name='startDate']").daterangepicker(scope.snDatePicker);
            };

            //选择终点
            scope.selectEndDate = function () {
                scope.params.isStart = false;

                if (scope.params.minDate != null) {
                    //如果起止时间都不为空，则重置
                    if (scope.params.maxDate != null) {
                        scope.snDatePicker.maxDate = false;
                    }

                    scope.snDatePicker.minDate = scope.params.minDate;
                    //如果起始时间是今天,将终止日期的今天按钮置灰
                    moment().startOf('day').isSame(moment(scope.params.selectStartDate)) ? scope.snDatePicker.isTodayEnable = false : scope.snDatePicker.isTodayEnable = true;

                }
                //scope.snDatePicker.locale = angular.extend(DEFAULT_LOCALE_PARAMS, scope.snDatePicker.locale);

                element.find("input[name='endDate']").daterangepicker(scope.snDatePicker);
            };

            element.on('apply.daterangepicker', function (ev, picker) {

                let startDate = null,
                    endDate = null;
                if (scope.params.isStart) {

                    $(this).find("input[name='startDate']").val(picker.startDate.format(scope.snDatePicker.format));
                    startDate = angular.copy(picker.startDate);
                    scope.params.minDate = startDate.add(1, 'days').format(scope.snDatePicker.format); //当前日也不可选
                    scope.params.selectStartDate = picker.startDate.format(scope.snDatePicker.format);

                } else {
                    $(this).find("input[name='endDate']").val(picker.startDate.format(scope.snDatePicker.locale.format));

                    endDate = angular.copy(picker.startDate);
                    scope.params.maxDate = endDate.subtract(1, 'days').format(scope.snDatePicker.format);
                    scope.params.selectEndDate = picker.startDate.format(scope.snDatePicker.format);

                   // console.log("start and end:" + scope.params.minDate + ',' +scope.params.maxDate);
                }

                //当起点和终点选定后触发事件
                if(scope.params.selectStartDate != null && scope.params.selectEndDate != null){
                    scope.$emit(e, { 'start': scope.params.selectStartDate, 'end': scope.params.selectEndDate});
                }
                //scope.$emit(e, { 'start': picker.startDate, 'end': picker.endDate});
            });
        }

        function dateSelect(scope, element, e) {
            if (scope.snDatePicker.isolateRange) {
                //单点到单点
                scope.params = {
                    isStart: true,
                    minDate: null,
                    maxDate: null,
                    selectStartDate: null,
                    selectEndDate: null,
                };

                selectIsolateDateRange(scope, element, e);
            } else {

                scope.selectDate = function () {
                    selectDate(scope, element, e);
                }
            }
        }

        //指令定义
        return {
            restrict: "A",
            scope: {
                snDatePicker: "=",
                snWidth: '=',
            },
            replace: true,
            link: function (scope, element, attrs) {
                var key = scope.snDatePicker.key || '';
                var e = "dateRangePicker" + (key ? (':' + key) : '');

                init(scope, element, e);

                try {

                    dateSelect(scope, element, e);

                } catch (exception) {
                    console.log(exception);
                }
            }
        }
    }]);
}