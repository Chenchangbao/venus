angular.module('sncd').service('ComponentService', ['mockService', 'HttpService', '$q', 'AlertService',
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
    	// 生成构件页
   	 	index: function(params){
	   	 	return HttpService.post("/angular/component/index.htm", params).then(function(data) {
	            return handleRspData(data);
	        });
   	 	},
    	//// 生成构件校验
    	checkRevision: function (params) {
            return HttpService.post("/angular/component/checkRevision.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //执行生成构件动作（打包）
		packageVersion: function (params) {
			return HttpService.post("/angular/component/packageVersion.htm", params).then(function (data) {
				return handleRspData(data);
			});
		},
		//获取全部构件列表
		componentList: function(params){
			return HttpService.post("/angular/component/list.htm", params).then(function (data) {
				return handleRspData(data);
			});
		},
		//获取同resivion号下某个应用包的构件列表
		componentAppList: function(params){
			return HttpService.post("/angular/component/appList.htm", params).then(function (data) {
				return handleRspData(data);
			});
		},
		//获取同t版本号号下某个应用包的构件列表
		componentPackageList: function(params){
			return HttpService.post("/angular/component/packageList.htm", params).then(function (data) {
				return handleRspData(data);
			});
		},
		//获取详情
		componentDetail: function(params){
			return HttpService.post("/angular/component/detail.htm", params).then(function (data) {
				return handleRspData(data);
			});
		},
		//下载
//		componentDownload: function(params){
//			return HttpService.post("/angular/component/download.htm", params).then(function (data) {
//				return handleRspData(data);
//			});
//		},
		//运维页面列表
		componentDeploy: function(params){
			return HttpService.post("/angular/component/deployPrd.htm", params).then(function (data) {
				return handleRspData(data);
			});
			
		},
		//获取生产构件列表
		componentPrdList: function (params) {
            return HttpService.post("/angular/component/prdList.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //获取环境类型
        componentEnvParamList: function (params) {
            return HttpService.post("/angular/component/envParam.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
      //获取环境类型
        componentAddressSave: function (params) {
            return HttpService.post("/angular/component/saveAddress.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
      //获取应用
        getAppList: function () {
        	return HttpService.post("/angular/component/allAppList.htm").then(function (data) {
                return handleRspData(data);
            });
        },
      //获取插件包应用
        getPlugAppList: function () {
        	return HttpService.post("/angular/component/getPlugAppList.htm").then(function (data) {
                return handleRspData(data);
            });
        },
      //获取正式包应用
        getFormalAppList: function () {
        	return HttpService.post("/angular/component/getFormalAppList.htm").then(function (data) {
                return handleRspData(data);
            });
        },
      //获取灰度包应用
        getGrayAppList: function () {
        	return HttpService.post("/angular/component/getGrayAppList.htm").then(function (data) {
                return handleRspData(data);
            });
        },
      //获取插件功能
        getPlugfun: function (params) {
        	return HttpService.post("/angular/component/getPlugfun.htm",params).then(function (data) {
                return handleRspData(data);
            });
        },
      //保存插件包信息
        savePlugPackage: function (params) {
        	return HttpService.post("/angular/component/addPluginPackageInfo.htm",params).then(function (data) {
                return data;
            });
        }
    };
	}]);
