//发布单相关Service
angular.module('sncd').service('DeployReqManageService', ['mockService', 'HttpService', '$q', 'AlertService',
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
    
    
  //返回数据处理
    function handleRsp(data) {
        var defer = $q.defer(),
            errCode = data.errCode,
            errMsg = data.errMsg || '系统出了点小问题，请稍后重试！';

        switch (errCode) {
            case '0':
                defer.resolve(data);
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
    	//检查是否能够发布
    	checkDeployReq:function (params){
    		   return HttpService.post("/angular/deployReq/checkDeployReq.htm", params).then(function(data) {
                   return handleRspData(data);
               });
    	},
    	//检查生产发布(新版)
    	checkNewPrdDeployReq :function (params){
    		return HttpService.post("/angular/deployReq/checkNewPrdDeployReq.htm", params).then(function(data) {
                return handleRspData(data);
            });
    	},
    	//检查是否可发布
    	getCheckDeployResult :function (params){
    		return HttpService.post("/angular/deployReq/getCheckDeployResult.htm", params).then(function(data) {
                return handleRspData(data);
            });
    	},
    	//检查生产发布
    	checkPrdDeployReq :function (params){
    		return HttpService.post("/angular/deployReq/checkPrdDeployReq.htm", params).then(function(data) {
                return handleRspData(data);
            });
    	},
    	//进入发布单页面之前，验证发布单
    	verifyApplyDeployReq:function(params){
    		 return HttpService.post("/angular/deployReq/verifyApplyDeployReq.htm", params).then(function(data) {
                 return handleRspData(data);
             });
    	},
    	//是否是共享环境
    	checkIfShareEnv:function(params){
   		 return HttpService.post("/angular/deployReq/checkIfShareEnv.htm", params).then(function(data) {
                return handleRspData(data);
            });
    	},
    	//prd是否有发布限制
    	checkPromotion:function(params){
   		 return HttpService.post("/angular/deployReq/checkPromotion.htm", params).then(function(data) {
                return handleRspData(data);
            });
    	},
    	//是否有发布限制
    	checkPromotionByLimiteType:function(params){
   		 return HttpService.post("/angular/deployReq/checkPromotionByLimiteType.htm", params).then(function(data) {
                return handleRspData(data);
            });
    	},
    	//检查静态发布专员权限
    	checkStaticDeploy:function(params){
   		 return HttpService.post("/angular/deployReq/checkStaticDeploy.htm", params).then(function(data) {
                return handleRspData(data);
            });
    	},
    	// 新建发布单
        createDeployReq: function (params) {
            return HttpService.post("/angular/deployReq/createDeployReq.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //保存普通发布单
        saveDeployReq :function (params){
        	 return HttpService.post("/angular/deployReq/saveDeployReq.htm", params).then(function(data) {
                 return handleRspData(data);
             });
        },
        //发布单列表
        getDeployReqList :function(params){
        	return HttpService.post("/angular/deployReq/deployReqList.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //发布单详情
        getDeployReqDetail:function (params){
        	return HttpService.post("/angular/deployReq/getDeployReqDetail.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //运维一键发布
        prdDeploy:function (params){
        	return HttpService.post("/angular/deployReq/prdDeploy.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //发布监控
        getDeployMonitor:function (params){
        	return HttpService.post("/angular/deployReq/prdDeploy.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //ngjboss部署
        publishNgJboss:function(params){
        	return HttpService.post("/angular/deploy/publish.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //轮循日志及发布状态
        getMonitorInit:function(params){
        	return HttpService.post("/angular/deploy/monitorInit.htm", params,{unrestricted: true}).then(function(data) {
                return handleRspData(data);
            });
        },
        //轮循日志及发布状态
        getMonitorLog:function(params){
        	return HttpService.post("/angular/deploy/monitor.htm", params,{unrestricted: true}).then(function(data) {
                return handleRspData(data);
            });
        },
        //获取日志详情
        getMonitorDetail:function(params){
        	return HttpService.post("/angular/deploy/monitorDetail.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //跳过失败步骤
        passFailureAction:function(params){
        	return HttpService.post("/angular/deploy/passFailureAction.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //切换发布组
        changeGroup:function(params){
        	return HttpService.post("/angular/deploy/changeGroup.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //结束发布
        deployOver:function(params){
        	return HttpService.post("/angular/deploy/deployOver.htm", params).then(function(data) {
                return handleRspData(data);
            });
        }
    };

}]);
