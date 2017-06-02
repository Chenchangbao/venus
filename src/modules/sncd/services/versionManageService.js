angular.module('sncd').service('VersionManageService', ['mockService', 'HttpService', '$q', 'AlertService',
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

			//获取系统下的版本
			getVersionBySys: function (params) {
				return HttpService.get("/angular/version/getVersionBySys.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},

			//创建分支
			createVersion: function (params) {
				return HttpService.post("/angular/version/createVersion.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},



			//检查版本号是否已经存在
			isVersionExist: function (params) {
				return HttpService.get("/angular/version/isVersionExist.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},

			//保存分支
			saveVersion: function (params) {
				return HttpService.realpost("/angular/version/saveVersion.htm", params).then(function (data) {
					return data;
				});
			},

    	 //// 获取我的版本
			getMyVersion: function (params) {
				return HttpService.post("/angular/version/myversion.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//// 封板
			freezenVersion: function (params) {
				return HttpService.post("/angular/version/freezen.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//是否有未完成的发布单
			isBranchHasUnFinishRequest: function (params) {
				return HttpService.post("/angular/version/isBranchHasUnFinishRequest.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},

      //解版页面数据获取
			unfreezenVersionInit: function (params) {
				return HttpService.post("/angular/version/unfreezenVersionInit.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},

      //解版
			unfreezenVersion: function (params) {
				return HttpService.post("/angular/version/unfreezenVersion.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//封板
			abandonVersion: function (params) {
				return HttpService.post("/angular/version/abandonVersion.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},

			//合并分支
			mergeVersion: function (params) {
				return HttpService.post("/angular/version/mergeVersion.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},

			//合并分支详情
			mergeVersionInfo: function (params) {
				return HttpService.post("/angular/version/mergeVersionInfo.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},

			//确认已回合
			backMergedVersion: function (params) {
				return HttpService.post("/angular/version/backMergedVersion.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},

			isPackageConfig: function (params) {
				return HttpService.post("/angular/version/isPackageConfig.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},

			packageVersionDialog: function (params) {
				return HttpService.post("/angular/version/packageVersionDialog.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},

			//打包地址页面
			packageVersionInit: function (params) {
				return HttpService.get("/angular/version/packageVersionInit.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},

			//checkReview
			checkReview: function (params) {
				return HttpService.post("/angular/version/checkReview.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//checkBuild
			checkBuild: function (params) {
				return HttpService.post("/angular/version/checkBuild.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//checkFrozen
			checkFrozen: function (params) {
				return HttpService.post("/angular/version/checkFrozen.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//执行打包
			packageVersion: function (params) {
				return HttpService.post("/angular/version/packageVersion.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//打包日志
			getPackageLog: function (params) {
				return HttpService.post("/angular/version/getPackageLog.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//PC打包日志
			getPcPackageLog: function (params) {
				return HttpService.post("/angular/version/getPcPackageLog.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//获取版本详情
			getVersionDetail: function (params) {
				return HttpService.post("/angular/version/versionDetail.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},

      //更新版本详情
			updateVersionDetail: function (params) {
				return HttpService.post("/angular/version/updateVersion.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},

			//获取版本读写权限
			getVersionPermission: function (params) {
				return HttpService.post("/angular/version/getVersionPermission.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},

      //保存版本读写权限
			saveVersionUserPermission: function (params) {
				return HttpService.realpost("/angular/version/saveVersionUserPermission.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//获取版本权限信息
			queryPermissionList: function (params) {
				return HttpService.post("/angular/version/getVersionUserPermission.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//代码质量分析JOB设置
			versionJob: function (params) {
				return HttpService.post("/angular/version/versionJob.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//保存质量分析JOB
			saveVersionJob: function (params) {
				return HttpService.realpost("/angular/version/saveVersionJob.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//在线代码评审设置
			versionReviewBoard: function (params) {
				return HttpService.post("/angular/version/versionReviewBoard.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//保存在线代码评审设置
			saveCodeReview: function (params) {
				return HttpService.post("/angular/version/saveCodeReview.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//版本发布单
			versionDeployReq: function (params) {
				return HttpService.post("/angular/version/versionDeploy.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//版本报告
			versionReport: function (params) {
				return HttpService.post("/angular/quality/versionQualityReport.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//获取系统名称列表
			getSysNameList: function (params) {
				return HttpService.post("/angular/system/mySystemList.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//获取交付配置初始化信息
			queryBuildInfo:function (params) {
				return HttpService.post("/angular/delivery/getDelivery.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			//管理员手动点击已完成合并的按钮
			AdminMerge:function (params) {
				return HttpService.post("/angular/version/AdminMerge.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
			queryAboveSysBuildInfo:function (params) {
				return HttpService.post("/angular/delivery/getDeliveryAboveSys.htm", params).then(function (data) {
					return handleRspData(data);
				});
			},
    };
	}]);
