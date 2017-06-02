angular.module('sncd').service('DynamicService', ['mockService', 'HttpService', '$q', 'AlertService',
    function (mockService, HttpService, $q, AlertService) {
        'use strict';

        //返回数据处理
        function handleRspData(data) {
            var defer = $q.defer(),
                errCode = data.errCode,
                errMsg = data.errMsg || '系统出了点小问题，请稍后重试！';

            switch (errCode) {
                case '0':
                    defer.resolve(data.data);
                    break;
                default:
                    AlertService.alert({
                        title: '提示信息',
                        content: errMsg
                    });
                    defer.reject(errMsg);
                    break;
            }

            return defer.promise;
        }

        return {

        	getMySystemDynamicState: function (params) {
            	 //// 获取质量趋势数据，对接后台接口
                return HttpService.post("/angular/dynamic/getMySystemDynamicState.htm", params).then(function (data) {
                  return handleRspData(data);
                });
            },
            
            getDynamicState: function (params) {

            	/*var mockData = {
                    errCode: '0',
                    errMsg: '',
                    data: {
	                        
                    }
                }
                return handleRspData(mockData);*/

            	 //// 获取质量趋势数据，对接后台接口
                return HttpService.post("/angular/dynamic/getAllDynamicState.htm", params).then(function (data) {
                  return handleRspData(data);
                });
            }
           
        };

    }]);
