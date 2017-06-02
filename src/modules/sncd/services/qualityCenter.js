angular.module('sncd').service('QuaService', ['mockService', 'HttpService', '$q', 'AlertService',
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

            getMyQuality: function (params) {
                //// 获取我的质量
                return HttpService.post("/angular/quality/getMyQuality.htm", params).then(function (data) {
                    return handleRspData(data);
                });

            },

            getQualityCompare: function (params) {
                //// 获取系统质量对比数据，对接后台接口
                return HttpService.post("/angular/quality/getQualityCompare.htm", params).then(function (data) {
                    return handleRspData(data);
                });
            },
            getQualityComparePageBo: function (params) {
                //// 获取系统质量对比数据，对接后台接口
                return HttpService.post("/angular/quality/getQualityComparePageBo.htm", params).then(function (data) {
                    return handleRspData(data);
                });
            },
           
            getQuaDetailList: function(params){
            	//// 获取我的质量
            	return HttpService.post("/angular/quality/getQuaDetailList.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },
            getReviewDetailList: function(params){
            	//// 获取我的质量
            	return HttpService.post("/angular/quality/getReviewDetailList.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },
            
            codeBuild: function(params){
            	//// 获取我的质量
            	return HttpService.post("/angular/quality/codeBuild.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },
            getSonarLog: function(params){
            	//// 获取我的质量
            	return HttpService.post("/angular/quality/getSonarLog.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },

            getNewMyQuality: function(params){
            	//// 获取我的质量
            	return HttpService.post("/angular/quality/getNewMyQuality.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },
            getNewMyVersionQuality: function(params){
            	//// 获取我的质量
            	return HttpService.post("/angular/quality/getNewMyVersionQuality.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },
            getQualityExport: function(params){
            	//// 质量导出
            	return HttpService.post("/angular/quality/getQualityExport.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },
            getQualityAccess: function(params){
            	//// 质量接入
            	return HttpService.post("/angular/quality/getQualityAccess.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },
            getVerQuaExcelList: function(params){
            	//// 准备版本质量导出数据
            	return HttpService.post("/angular/quality/getVerQuaExcelList.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },
            supportCodeBuild: function(params){
            	//// 获取我的质量
            	return HttpService.post("/angular/quality/supportCodeBuild.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },
            getCheckResult:function(params){
            	//检查构建结果
            	return HttpService.post("/angular/quality/getCheckResult.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },
            
            deployCheckResult:function(params){
            	//发布检查阀值控制
            	return HttpService.post("/angular/quality/deployCheckResult.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },
            getBuildId:function(params){
            	//发布检查阀值控制
            	return HttpService.post("/angular/quality/getBuildId.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },
            
            updateDelivery:function(params){
            	//发布检查阀值控制
            	return HttpService.post("/angular/delivery/updateDelivery.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },
            getAllDeployinfoQuality:function(params){
            	//当月构建质量到处
            	return HttpService.post("/angular/quality/getAllDeployinfoQuality.htm",params).then(function(data){
            		return handleRspData(data);
            	})
            },
            packageQuaCheck:function(params){
            	//发布检查阀值控制
            	return HttpService.post("/angular/quality/packageQuaCheck.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },
            savePackageQua:function(params){
            	//发布检查阀值控制
            	return HttpService.post("/angular/quality/savePackageQua.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },
            getSysInfo:function(params){
            	//获取待加入白名单的系统信息
            	return HttpService.post("/angular/qualityWhitelist/getSysInfo.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },
            getWhileList:function(params){
            	//获取当前白名单 信息
            	return HttpService.post("/angular/qualityWhitelist/getWhileList.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },
            updateWhitelist:function(params){
            	//更新白名单信息
            	return HttpService.post("/angular/qualityWhitelist/updateWhitelist.htm", params).then(function(data) {
            		return handleRspData(data);
            	});
            },
        };

    }]);

