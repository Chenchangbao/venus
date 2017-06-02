angular.module('sncd').service('OperationManageService', ['mockService', 'HttpService', '$q', 'AlertService',
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

    //接口
    return {

			//获取可视化操作列表
			getVisualizationList: function (params) {
				return HttpService.get("/operation/visualizationList.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			restartDM: function(params) {
				return HttpService.get("/operation/restartDM.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			restartDMStop: function(params) {
				return HttpService.get("/operation/restartDMStop.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			getConsole: function(params) {
				return HttpService.get("/operation/getConsole.htm", params).then(function (data) {
					return handleRspData(data);
				});
			}
    };
	}]);
