/**
 * 系统概览
 */
angular.module("sncd").service('HomeService', ['mockService', 'HttpService', '$q', 'AlertService',
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
        	getAllUsers: function(params){
        		  return HttpService.post("/angular/home/getAllUsers.htm", params).then(function (data) {
                      return handleRspData(data);
                  });
        	},
        	
        	validateUser: function(params){
      		  return HttpService.post("/angular/home/validateUser.htm", params).then(function (data) {
                  return handleRspData(data);
              });
        	},
            getTrend: function (params) {

                /*var mockData = {
                 errCode: '0',
                 errMsg: '',
                 data: {
                 totalLine: [120000, 150000, 170000, 21000, 160000, 221000, 270000],
                 repeatedLine: [10000, 13000, 21000, 23000, 17000, 25000, 28000],
                 tbdLine: [8300, 9800, 7000, 9200, 8000, 7800, 10000]
                 }
                 }
                 return handleRspData(mockData);*/

                //// 获取质量趋势数据，对接后台接口
                return HttpService.post("/angular/quality/getTrend.htm", params).then(function (data) {
                    return handleRspData(data);
                });
            },
            getStatistics: function (params) {

                //// 获取系统和版本统计，对接后台接口
                return HttpService.post("/angular/home/getMySVStatusNum.htm", params).then(function (data) {
                    return handleRspData(data);
                });
            },
            getNotifyLast: function (params) {
                //// 获取系统和版本统计，对接后台接口
                return HttpService.post("/angular/home/getActiveNotify.htm", params).then(function (data) {
                    return handleRspData(data);
                });
            },
            getCustomerInfo: function (params) {
                //// 获取用户数据，对接后台接口
                return HttpService.post("/angular/home/getCustomerInfo.htm", params).then(function (data) {
                    return handleRspData(data);
                });
            },
            getSysBranchInfo: function (params) {
                //// 获取用户数据，对接后台接口
                return HttpService.post("/angular/home/getSysBranchInfo.htm", params).then(function (data) {
                    return handleRspData(data);
                });
            },
            getMyDynamicState: function (params) {

               /* var mockData = {
                    errCode: '0',
                    errMsg: '',
                    data: [
                        {
                            operator: 'suning001',
                            sysCnname: 'SNCD',
                            operation: '修复缺陷分支',
                            updateTime: 1440056486854
                        },
                        {
                            operator: 'suning002',
                            sysCnname: 'SNCD',
                            operation: '修复缺陷分支',
                            updateTime: 1442592000000
                        },
                        {
                            operator: 'suning003',
                            sysCnname: 'SNCD',
                            operation: '修复缺陷分支',
                            updateTime: 1442692000000
                        },
                        {
                            operator: 'suning002',
                            sysCnname: 'SNCD',
                            operation: '修复缺陷分支',
                            updateTime: 1442592000000
                        },
                        {
                            operator: 'suning003',
                            sysCnname: 'SNCD',
                            operation: '修复缺陷分支',
                            updateTime: 1442692000000
                        }
                    ]
                }
                return handleRspData(mockData);*/

                // 获取用户数据，对接后台接口
                return HttpService.post("/angular/home/getMyDynamicState.htm", params).then(function (data) {
                    return handleRspData(data);
                });
            },

            getQualityCompare: function (params) {
                //// 获取系统质量对比数据，对接后台接口
                return HttpService.post("/angular/quality/getQualityCompare.htm", params).then(function (data) {
                    return handleRspData(data);
                });
            },

            getOption2: function (params) {
                /* var mockData = {
                 errCode: '0',
                 errMsg: '',
                 data: [
                 {value:335, name:'阻塞原因1'},
                 {value:310, name:'阻塞原因2'},
                 {value:234, name:'阻塞原因3'},
                 {value:135, name:'阻塞原因4'},
                 {value:1548, name:'阻塞原因5'},
                 {value:345, name:'阻塞原因6'}
                 ]
                 }
                 return handleRspData(mockData);*/
                return HttpService.post("/angular/quality/getQualityAnalysis.htm", params).then(function (data) {
                    return handleRspData(data);
                });
            },

            getOption3: function (params) {
                /* var mockData = {
                 errCode: '0',
                 errMsg: '',
                 data: [12,21,10,4,12]
                 }
                 return handleRspData(mockData);*/
                return HttpService.post("/angular/quality/getQualityAnalysis.htm", params).then(function (data) {
                    return handleRspData(data);
                });
            },
            getCurentUserId:function(params){
            	return HttpService.post("/angular/common/getCurentUserId.htm",params).then(function(data){
            		return handleRspData(data);
            	});
            }
            
        };

    }]);

