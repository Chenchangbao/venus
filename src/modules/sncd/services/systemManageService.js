//系统相关Service
angular.module('sncd').service('SystemService', ['mockService', 'HttpService', '$q', 'AlertService',
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
    	 //// 获取我的系统
        getMySystem: function (params) {
            return HttpService.post("/angular/system/mySystemPage.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //获取系统详情
        sysDetailInfo: function (params) {
            return HttpService.post("/angular/system/sysDetailInfo.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //更新系统
        initSystem:function (params){
        	return HttpService.post("/angular/system/initSystem.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        
        //更新系统详情
        updateSystem: function (params) {
            return HttpService.post("/angular/system/updateSysType.htm", params).then(function(data) {
                return data;
            });
        },
        //更新系统管理员
        updateSystemManager: function (params) {
            return HttpService.post("/angular/system/updateSysCMO.htm", params).then(function(data) {
                return data;
            });
        },
        
        //获取二级中心
        getOrgTwo:function (params){
        	 return HttpService.post("/angular/system/getOrgTwo.htm",params).then(function(data) {
                 return handleRspData(data);
             });
        },
        
        //获取系统进行中、已结束的版本数量
        getVersionNumByMySystem:function (params) {
            return HttpService.post("/angular/version/getVersionNumByMySystem.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //获取全部系统
        getAllSystem: function (params) {
            return HttpService.post("/angular/system/allSystemPage.htm", params).then(function (data) {
                return handleRspData(data);
            });
        },
        //获取全部中心list
        getOrgList: function () {
        	return HttpService.post("/angular/system/allOrgList.htm").then(function (data) {
                return handleRspData(data);
            });
        },

        //获取系统团队
        getSystemTeam: function (params) {
        	return HttpService.post("/angular/system/team/detail.htm", params).then(function (data) {
                return handleRspData(data);
            });
        },
        
        //更新系统
        updateTeam: function (params) {
        	return HttpService.post("/angular/system/updateTeam.htm", params).then(function (data) {
                return handleRspData(data);
            });
        },
        
        //获取系统类型
        getAllSysType: function (params) {
        	return HttpService.post("/angular/system/getAllSysType.htm",params).then(function (data) {
                return handleRspData(data);
            });
        },
        
        //获取系统所有的权限
        getSystemPermission: function (params) {
        	return HttpService.post("/angular/system/getSystemPermission.htm",params).then(function (data) {
                return handleRspData(data);
            });
        },
        
        //获取权限map
        hasPermissionMap: function (params) {
        	return HttpService.post("/angular/system/hasPermissionMap.htm",params).then(function (data) {
                return handleRspData(data);
            });
        },
        
        //权限判别
        judgeRolePermission: function (params) {
        	return HttpService.post("/angular/system/checkPermissionBySysId.htm",params).then(function (data) {
                return handleRspData(data);
            });
        },
        
        //更新系统权限
        updateSysRolePermission: function (params) {
        	return HttpService.post("/angular/system/updateSysRolePermission.htm",params).then(function (data) {
                return handleRspData(data);
            });
        },
        
        //获取某个词典分类的列表
        getDictItemListByType:function (params){
        	return HttpService.post("/angular/system/getDictItemListByType.htm",params).then(function (data) {
                return handleRspData(data);
            });
        },
        
        
        //获取某一系统的信息
//        getSys: function (params){
//        	return	HttpService.post("/angular/system/sysDetailInfo.htm", params).then(function(data) {
//                return handleRspData(data);
//             });
//        },
        
        //获取系统环境
        getSystemEnv: function (params) {
        	return HttpService.post("/angular/system/getSystemEnv.htm", params).then(function (data) {
                return handleRspData(data);
            });
        },
        //获取系统dm详情
        showDmConfigByEnvId : function (params) {
        	return HttpService.post("/angular/system/showDmConfigByEnvId.htm", params).then(function (data) {
                return handleRspData(data);
            });
        },
        
        //获取系统下的应用包
        getPackageBySys:function (params){
        	return	HttpService.get("/angular/package/getPackageBySys.htm", params).then(function(data) {
                return handleRspData(data);
             });
        },
        //获取系统下的应用包
        addPackageInit:function (params){
        	return	HttpService.get("/angular/package/addPackageInit.htm", params).then(function(data) {
                return handleRspData(data);
             });
        },
        //保存系统包
        savePackage:function (params){
        	return	HttpService.post("/angular/package/savePackage.htm", params).then(function(data) {
                return handleRsp(data);
             });
        },
        //校验包是否已经存在
        isSysPackageExist:function (params){
        	return	HttpService.post("/angular/package/isSysPackageExist.htm", params).then(function(data) {
                return handleRspData(data);
             });
        },
        //校验包自定义功能类型已经存在
        isPackageTypeExist:function (params){
        	return	HttpService.post("/angular/package/isPackageTypeExist.htm", params).then(function(data) {
        		return handleRspData(data);
        	});
        },
        //校验包自定义功能类型已经存在
        getPackageNumByPkgType:function (params){
        	return	HttpService.post("/angular/package/getPackageNumByPkgType.htm", params).then(function(data) {
        		return handleRspData(data);
        	});
        },
        //检查包是否已经配置
        packageIsConfig:function (params){
        	return	HttpService.post("/angular/package/packageIsConfig.htm", params).then(function(data) {
                return handleRspData(data);
             });
        },
        //删除包
        makePackageUnActive:function (params){
        	return HttpService.post("/angular/package/makePackageUnActive.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //校验包是否在使用
        isSysPackageUsing:function (params){
        	return HttpService.post("/angular/package/isSysPackageUsing.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //判断打包配置跳转情况
        createOrDetail:function (params){
        	return HttpService.post("/angular/packageconfig/createOrDetail.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //打包配置详情
        packageConfig:function (params){
        	return HttpService.post("/angular/packageconfig/detail.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //创建打包详情
        addPackageConfig:function (params){
        	return HttpService.post("/angular/packageconfig/add.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //创建or展示打包配置详情
        createOrShowBuildConfig:function (params){
        	return HttpService.post("/angular/build/createOrDetail.htm", params).then(function(data) {
        		return handleRspData(data);
        	});
        },
        //保存打包JOB
        createPackageConfigJob:function (params){
        	return HttpService.post("/angular/packageconfig/createjob.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //保存打包JOB-new
        createPackageConfigJobNew:function (params){
        	return HttpService.post("/angular/build/createJob.htm", params).then(function(data) {
        		return handleRspData(data);
        	});
        },
        //检查是否正在打包中...
        checkbuild:function (params){
        	return HttpService.post("/angular/packageconfig/checkbuild.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //更新打包配置
        updatePackageConfig:function (params){
        	return HttpService.post("/angular/build/updateJob.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //删除打包配置
        deletePackageConfig:function (params){
        	return HttpService.post("/angular/build/deleteJob.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //测试打包
        testPackageConfig:function (params){
        	return HttpService.post("/angular/packageconfig/testPackageConfig.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //获取打包结果
        getPackageConfigConsole:function (params){
        	return HttpService.post("/angular/packageconfig/getconsole.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //激活系统初始化
        activeSysInit:function(){
        	return HttpService.post("/angular/system/activeSysInit.htm").then(function(data) {
                return handleRspData(data);
            });
        },
        //激活系统
        saveActiveSys:function(params){
        	return HttpService.post("/angular/system/saveActiveSys.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //获取代码库
        getCodeRepository:function(params){
        	return HttpService.post("/angular/repository/getCodeRepository.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //获取代码库权限
        getPermissionByUrl:function(params){
        	return HttpService.post("/angular/repository/getPermissionByUrl.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //获取各级代码树
        getCodeRepositoryTree:function(params){
        	return HttpService.post("/angular/repository/getCodeRepositoryTree.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //保存代码库权限
        saveCodeRepositoryPermission:function(params){
        	return HttpService.post("/angular/repository/saveCodeRepositoryPermission.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        
        //获取打包配置环境参数
        getEnvConfig:function(params){
        	return HttpService.post("/angular/packageconfig/getEnvConfig.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        
        //创建普通代码库
        saveCommonCodeRepos:function (params){
        	return HttpService.post("/angular/repository/saveCommonCodeRepos.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        
        
         //获取版本名列表
        queryVersionList:function (params){
        	return HttpService.post("/angular/version/getVersionList.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //根据版本获取
        queryBaseLineByVersion:function (params){
        	return HttpService.post("/angular/delivery/getQBaseLineByVersionId.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
         //根据时间获取
        getQBaseLineByBuildTime:function (params){
        	return HttpService.post("/angular/delivery/getQBaseLineByBuildTime.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //获取系统基线列表
        versionJob:function (params){
        	return HttpService.post("/angular/delivery/getQBaseLine.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //保存基线信息
        saveQBaseLine:function (params){
        	return HttpService.post("/angular/delivery/saveQBaseLine.htm", params).then(function(data) {
                return data;
            });
        },
        //获取系统类型
        getSysTypeBySysId:function (params){
        	return HttpService.post("/angular/system/getSysTypeBySysId.htm", params).then(function(data) {
        		return handleRspData(data);
        	});
        },
        //获取系统级质量配置
        querySystemQualityConfig:function (params){
        	return HttpService.post("/angular/delivery/getSystemQualityConfig.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //保存系统级质量配置
        saveSystemQualityConfig:function (params){
        	return HttpService.realpost("/angular/delivery/saveSystemQualityConfig.htm", params).then(function(data) {
                return data;
            });
        },
        //获取公司级质量配置
    	getCompanyQualityConfig:function (params) {
            return HttpService.post("/angular/delivery/getCompanyQualityConfig.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
        //保存公司级质量配置
    	saveCompanyQualityConfig:function (params) {
            return HttpService.realpost("/angular/delivery/saveCompanyQualityConfig.htm", params).then(function(data) {
                return data;
            });
        },
        //获取中心级质量配置
    	getCenterQualityConfig:function (params) {
            return HttpService.post("/angular/delivery/getCenterQualityConfig.htm", params).then(function(data) {
                return handleRspData(data);
            });
        },
    	//保存中心级质量配置
    	saveCenterQualityConfig:function (params) {
            return HttpService.realpost("/angular/delivery/saveCenterQualityConfig.htm", params).then(function(data) {
                return data;
            });
        },
        //判断代码库是否重名
        checkReposNameRepeat:function(params){
        	return HttpService.post("/angular/repository/checkReposNameRepeat.htm",params).then(function(data){
        		return handleRspData(data);
        	});
        },
        //增加创建代码库和子系统
        addNewCommonCodeRepos:function(params){
        	return HttpService.post("/angular/system/addNewCommonCodeRepos.htm",params).then(function(data){
        		return handleRspData(data);
        	});
        },
        //获取我的所有系统名称
        mySystemNameList:function(){
        	return HttpService.post("/angular/system/mySystemNameList.htm").then(function(data){
        		return handleRspData(data);
        	});
        },
        getSysEnableEnv:function(params){
        	return HttpService.post("/angular/system/getSysEnableEnv.htm",params).then(function(data){
        		return handleRspData(data);
        	});
        },
        getEnvPackUrl:function(params){
        	return HttpService.post("/angular/system/getEnvPackUrl.htm",params).then(function(data){
        		return handleRspData(data);
        	});
        },
        saveEnvPackUrl:function(params){
        	return HttpService.post("/angular/system/saveEnvPackUrl.htm",params).then(function(data){
        		return handleRspData(data);
        	});
        },
        reCheckST:function(params){
        	return HttpService.post("/angular/system/reCheckST.htm",params).then(function(data){
        		return handleRspData(data);
        	});
        },
        getReviewDataByPage:function(params){
        	return HttpService.post("/angular/svnCodeReview/getReviewDataByPage.htm",params).then(function(data){
        		return handleRspData(data);
        	});
        },
        updateReviewResult:function(params){
        	return HttpService.post("/angular/svnCodeReview/updateReviewResult.htm",params).then(function(data){
        		return handleRspData(data);
        	});
        },
        getReviewListByBranchId:function(params){
        	return HttpService.post("/angular/svnCodeReview/getReviewListByBranchId.htm",params).then(function(data){
        		return handleRspData(data);
        	});
        },
    };

}]);
