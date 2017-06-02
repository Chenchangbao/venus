angular.module('sncd').controller('PackageVersionCtrl', ['$scope', 'VersionManageService', '$state', '$stateParams', '$timeout', 'ComponentService','SystemService','DialogService', 'baseUrl' ,'$location',
  function ($scope, VersionManageService, $state, $stateParams, $timeout, ComponentService, SystemService,DialogService, baseUrl, $location) {
    'use strict';
		var packageStatus = 'ready';
		var baseURL = location.protocol + '//'
			+ location.host + location.pathname;
		var hasPermissionMap = $scope.$parent.hasPermissionMap;
		var paramEnvType = $stateParams.envType || '';
		var vm = $scope,
    	formData = vm.formData = {},
    	pager = vm.pager = {
    	       pageNumber: 1,
    	       totalCount: 0, //总条数
    	       pageSize: 10
    	   }
    ///////////////////functions//////////////////
    var envTypes = $scope.envTypes = [{ envType: "019", envName: "集成测试环境" }, { envType: "020", envName: "预生产环境" }, { envType: "021", envName: "生产环境" }, { envType: "171", envName: "本地测试环境" }]
    var postData = $scope.postData = {};
    var sysId = $stateParams.sysId;
    $scope.selectedChildTab='1';

    function init() {
    		if($stateParams.packageType!=undefined){
    			$scope.selectedChildTab='2';
    		}
			var envType = $stateParams.envType || '019';
			$scope.postData.envType = envType;
			packageVersionInit(envType).then(function (bmBuildHis) {
				var buildId = bmBuildHis.buildId;
				if (!!buildId) {
					setPackageStatus(true);
					setTips(bmBuildHis);
					if(bmBuildHis.buildFlg==null){
						getPackageLog($scope.jobname,buildId,"");
					}
				}
			});
			getEnvConfig(envType);
    }



    function getEnvConfig(envType) {
			var envParams = [];
			SystemService.getEnvConfig({ "sysId": sysId, "envType": envType }).then(function (result) {
				var envParam = result.envParaStrs;
				if (envParam != null && envParam.length > 0) {
					var envParams = envParam.split(",");
					$scope.envParams = envParams;
					if (envType == '021') {
						$scope.postData.envParam = envParam;
					} else {
						$scope.postData.envParam = envParams[0];
					}

					getPackageUrl($scope.postData.envParam);
					//    			$scope.envParams = envParams;
				}
			});
    }

    $scope.changeEnv = function () {
			packageVersionInit($scope.postData.envType);
			getEnvConfig($scope.postData.envType);
    }

    function getPackageUrl() {
			var port = $location.port();
			if (port != '80') {
				$scope.pageVersionUrl = "http://" + $location.host() + ":" + port + "/udmp-web-in/index.html#" + "/packageVersion/" + $stateParams.sysId + "/" + $stateParams.versionId + "/" + $scope.postData.envType
			} else {
				$scope.pageVersionUrl = "http://" + $location.host() + "/udmp-web-in/index.html#" + "/packageVersion/" + $stateParams.sysId + "/" + $stateParams.versionId + "/" + $scope.postData.envType
			}
    }

		//http://localhost:8080/udmp-web-in/index.html#/version-info/1/4910/packageVersion/?vtab=PackageVersion
		//生成打包
		$scope.genPackageURL = function genPackageURL(item) {
			return baseURL + '#/packageVersion/' + $stateParams.sysId + '/' + item.branchId + '/' + item.deployEnv + '/' + item.envParam;
		}
		$scope.genDeployPackageURL = function genPackageURL(item) {
			if(item.envParam==undefined || item.envParam==""){
				return baseURL +"#/deploy-prd/"+item.systemId+"/"+item.branchId+"/0/0/"+item.svnRevision;
			}
			return baseURL +"#/deploy-prd/"+item.systemId+"/"+item.branchId+"/"+item.envParam+"/0/"+item.svnRevision;
		}




    $scope.cpoyUrl = function () {
			var clipBoardContent = $scope.pageVersionUrl;
			window.clipboardData.setData("Text", clipBoardContent);
			alert("复制成功!");
    }

    // 获取打包详情
    function packageVersionInit(envType) {  
    	$scope.freezeMsg = '';
    	var params = {
    			versionId: $stateParams.versionId,
    			sysId: $stateParams.sysId,
    			envId: paramEnvType,
    			pageNumber : $scope.pager.pageNumber
    	};

    	$scope.envType = envType;
		return VersionManageService.packageVersionInit(params).then(function (result) {
			$scope.freezeMsg = result.freezeMsg;
			$scope.message = result.message;
			$scope.branch = result.branch;
			$scope.queryResult = result.queryResult;
			$scope.lastProdComponent = result.lastProdComponent;
//			$scope.componentList=result.componentList;
			
			$scope.pager.totalCount = result.componentList.totalSize;
	        $scope.pager.pageNumber = result.componentList.currentPage;
	        $scope.componentList=result.componentList.searchResultList;
	        $scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);
			
			$scope.packageType = result.packageType;
			$scope.systemBean = result.systemBean;
			$scope.bmBuildHis = result.bmBuildHis;
			$scope.jobname = result.jobname;
			$scope.paraStat = result.paraStat;
			$scope.bmBuildHisParamList = result.bmBuildHisParamList || [];
			if(result.lastProdComponent != undefined && result.bmBuildHis!= undefined){
				$scope.lastProdPath =  location.origin + baseUrl+'/index.html#/deploy-prd/'+result.lastProdComponent.addressId+'/'+result.bmBuildHis.branchId;
			}
			$scope.jeckinsPath=result.jeckinsPath;
			return result.bmBuildHis || {};
		});
    }


    init();

		$scope.showPackageBtn = function (item, bmBuildHis) {
			var deployEnv = item.deployEnv || '',
				ret = false;

			switch (deployEnv) {
				case '171':
				case '019':
				case '020':
					ret = true;
					break;
				case '021':
					ret =  !$scope.freezeMsg;
					break;
				default:
					break;
			}
			return ret;
		};
		
	//打包测试	
	$scope.packageVersionTest = function (bmBuildHis, system, packageType) {
		bmBuildHis.packageUrl="packageVersionTest";
		this.packageVersion(bmBuildHis, system, packageType);
	}
		
    //打包  
    $scope.packageVersion = function (bmBuildHis, system, packageType) {
    	
			var packFlag = true;
			if (bmBuildHis.sysId == '12') {
				packFlag = VersionManageService.checkReview({ sysId: bmBuildHis.sysId, versionId: bmBuildHis.branchId, envId: bmBuildHis.deployEnv }).then(function (result) {
					if (result.flag) {
						alert(result.info + ",无法打包！");
						packFlag = false;
						return false;
					} else {
						if (bmBuildHis.deployEnv == '021') {//生产环境
							packFlag = VersionManageService.checkFrozen({ versionId: bmBuildHis.branchId }).then(function (result) {
    	        			if (!result.flag) {
									alert("分支状态为未封板，仅封板分支可进行生产发布，请您联系有此分支封板权限的人员，进行封板测试，测试通过后发布生产。");
									packFlag = false;
									return false;
    	        			} else {
									VersionManageService.checkBuild({ sysId: bmBuildHis.sysId }).then(function (result) {
										if (result.flag) {
											var msg = ""
											if (packageType == 'MAVEN') {
												msg = "注意：打包测试仅验证是否能正常打包，不能生成发布包！平台即将根据您所选择的环境参数自动化打包，请确认构建命令是否正确，如果对此项配置有疑问，请联系技术人员或平台支持人员朱文静(11010068)，继续请按“确定”，否则请按“取消”进行配置检查。";
											} else {
												msg = "注意：打包测试仅验证是否能正常打包，不能生成发布包！平台即将根据您在打包配置页面所设置的环境参数或者工程build.xml文件中的环境参数进行自动化打包，请确认配置是否正确，如果对此项配置有疑问，请联系系统技术负责人或平台支持人员朱文静(11010068)，继续请按“确定”，否则请按“取消”进行配置检查。";
											}
											if (confirm(msg)) {
												packageVersion(bmBuildHis);

											}

										} else {
											alert("此系统有环境正在打包，请稍后再尝试！");
											return false;
										}
									})
    	        			}
							})
						} else {
							VersionManageService.checkBuild({ sysId: bmBuildHis.sysId }).then(function (result) {
    	    	    		if (result.flag) {
									var msg = ""
									if (packageType == 'MAVEN') {
										msg = "注意：打包测试仅验证是否能正常打包，不能生成发布包！平台即将根据您所选择的环境参数自动化打包，请确认构建命令是否正确，如果对此项配置有疑问，请联系技术人员或平台支持人员朱文静(11010068)，继续请按“确定”，否则请按“取消”进行配置检查。";
									} else {
										msg = "注意：打包测试仅验证是否能正常打包，不能生成发布包！平台即将根据您在打包配置页面所设置的环境参数或者工程build.xml文件中的环境参数进行自动化打包，请确认配置是否正确，如果对此项配置有疑问，请联系系统技术负责人或平台支持人员朱文静(11010068)，继续请按“确定”，否则请按“取消”进行配置检查。";
									}
									if (confirm(msg)) {
										//执行打包
										packageVersion(bmBuildHis);
									}
    	    	    		} else {
									alert("此系统有环境正在打包，请稍后再尝试！");
									return false;
    	    	    		}
							})

						}
					}
				})
			} else {

				if (bmBuildHis.deployEnv == '021') {//生产环境
					packFlag = VersionManageService.checkFrozen({ versionId: bmBuildHis.branchId }).then(function (result) {
						if (!result.flag) {
							alert("分支状态为未封板，仅封板分支可进行生产发布，请您联系有此分支封板权限的人员，进行封板测试，测试通过后发布生产。");
							packFlag = false;
							return false;
						} else {
							VersionManageService.checkBuild({ sysId: bmBuildHis.sysId }).then(function (result) {
								if (result.flag) {
									var msg = ""
									if (packageType == 'MAVEN') {
										msg = "注意：打包测试仅验证是否能正常打包，不能生成发布包！平台即将根据您所选择的环境参数自动化打包，请确认构建命令是否正确，如果对此项配置有疑问，请联系技术人员或平台支持人员朱文静(11010068)，继续请按“确定”，否则请按“取消”进行配置检查。";
									} else {
										msg = "注意：打包测试仅验证是否能正常打包，不能生成发布包！平台即将根据您在打包配置页面所设置的环境参数或者工程build.xml文件中的环境参数进行自动化打包，请确认配置是否正确，如果对此项配置有疑问，请联系系统技术负责人或平台支持人员朱文静(11010068)，继续请按“确定”，否则请按“取消”进行配置检查。";
									}
									if (confirm(msg)) {
										//执行打包
										packageVersion(bmBuildHis);
									}

								} else {
									alert("此系统有环境正在打包，请稍后再尝试！");
									return false;
								}
							})
						}
        		})
				} else {
       			VersionManageService.checkBuild({ sysId: bmBuildHis.sysId }).then(function (result) {
						if (result.flag) {
							var msg = ""
							if (packageType == 'MAVEN') {
								msg = "注意：打包测试仅验证是否能正常打包，不能生成发布包！平台即将根据您所选择的环境参数自动化打包，请确认构建命令是否正确，如果对此项配置有疑问，请联系技术人员或平台支持人员朱文静(11010068)，继续请按“确定”，否则请按“取消”进行配置检查。";
							} else {
								msg = "注意：打包测试仅验证是否能正常打包，不能生成发布包！平台即将根据您在打包配置页面所设置的环境参数或者工程build.xml文件中的环境参数进行自动化打包，请确认配置是否正确，如果对此项配置有疑问，请联系系统技术负责人或平台支持人员朱文静(11010068)，继续请按“确定”，否则请按“取消”进行配置检查。";
							}
							if (confirm(msg)) {
								//执行打包
								packageVersion(bmBuildHis);
							}
						} else {
							alert("此系统有环境正在打包，请稍后再尝试！");
							return false;
						}
    	    	})

				}


			}
    }
    
    $scope.selectChildTab = function(state){
        $scope.selectedChildTab = state;
    }
    
	//生成构件
    $scope.generateComponent = function(bmBuildHis){
    	
      	if (bmBuildHis.deployEnv == '021') {//生产环境
      	VersionManageService.checkFrozen({ versionId: bmBuildHis.branchId }).then(function (result) {
      			if (!result.flag) {
					alert("分支状态为未封板，仅封板分支可进行生产发布，请您联系有此分支封板权限的人员，进行封板测试，测试通过后发布生产。");
					return false;
      			}else{
      				$state.go("Component", {
      		    		branchId: bmBuildHis.branchId,
      		    		envParam: bmBuildHis.deployEnv,
      		    		envName: bmBuildHis.envParam
      		        });
      			}
      		});
      	}else{
      	
    	$state.go("Component", {
    		branchId: bmBuildHis.branchId,
    		envParam: bmBuildHis.deployEnv,
    		envName: bmBuildHis.envParam
        });
      	}
	}

	function setTips(bmBuildHis) {
		$scope.currentBuildBM = bmBuildHis;
	}

	function setPackageStatus(flag) {
		if (flag) {
			$scope.packagePending = true;
			packageStatus = 'pending';
		} else {
			$scope.packagePending = false;
			packageStatus = 'ready';
		}

	}
	//执行打包
    function packageVersion(bmBuildHis) {
//			var envParam = '';
//			if ($scope.postData.envParam != null) {
//				envParam = $scope.postData.envParam;
//			}
    	$scope.selectedChildTab='2';
		if (packageStatus === 'ready') {
			setPackageStatus(true);
			setTips(bmBuildHis);
			VersionManageService.packageVersion({ bmBuildHis: JSON.stringify(bmBuildHis), envParam: bmBuildHis.envParam }).then(function (result) {
				//打包结果
				$scope.queryResult = result.queryResult;
				$scope.bmBuildHis = result.bmBuildHis;
				//日志获取
				if ($scope.packageType == 'PC') {
					getPcPackageLog($scope.bmBuildHis.buildId)
				}

				getPackageLog($scope.jobname, $scope.bmBuildHis.buildId, "");

			});
		}
    }


    var getPcPackageLog = function (buildId) {
			VersionManageService.getPcPackageLog({ "buildId": buildId }).then(function (result) {
				if (result.pcDeployStatus != null) {

					if (result.pcDeployStatus.packLogUrl != null && result.pcDeployStatus.packLogUrl != "") {
						$scope.packLogUrl = '打包详情请见:<a href="' + result.pcDeployStatus.packLogUrl + '" target="_blank">' + result.pcDeployStatus.packLogUrl + '</a><br/>';
					}

					//打包输出地址
					if (result.pcDeployStatus.packageUrl != null && result.pcDeployStatus.packageUrl != "") {
						$scope.packageUrl = '包输出地址请见:<a href="' + result.pcDeployStatus.packageUrl + '" target="_blank">' + result.pcDeployStatus.packageUrl + '</a><br/>';
					}

					$timeout((function () {
        				getPcPackageLog(buildId);
					}), 10000);
				}
			})
    }



    var getPackageLog = function (jobName, buildId, jenkinsPath) {
			VersionManageService.getPackageLog({ jobName: jobName, "buildId": buildId, "jenkinsPath": jenkinsPath }).then(function (result) {
				if (result.flag != '1') {

					$scope.jenkinsPath = result.jenkinsPath;
					if(result.buildNumber!=undefined && result.buildNumber!=""){
						$scope.queryResult[0].buildNumber = result.buildNumber;
					}
					$timeout((function () {
						getPackageLog(jobName, buildId, result.jenkinsPath);
					}), 10000);
				} else {//修改结果
					$scope.queryResult[0].buildFlg = result.result;
					$scope.queryResult[0].ftpPath = result.ftppath;
					$scope.queryResult[0].buildNumber = result.buildNumber;
					setPackageStatus(false);
					
					ComponentService.componentPackageList({ "versionId": $scope.queryResult[0].branchId }).then(function (result) {
						$scope.componentList=result.componentList;
						if(result.lastProdComponent != undefined){
							$scope.lastProdComponent=result.lastProdComponent;
						}
					});
				}
			})
    }

    //复制按钮成功的提示信息
    $scope.doSomething = function (envType,envParam,revision) {
    	if(envType=="021"){
    		SystemService.getSystemEnv({sysId:$stateParams.sysId}).then(function (result) {
        		$scope.envPrdList=[];
    			for(var i=0;i<result.envList.length;i++){
    				if(result.envList[i].envType=="021"){
    					$scope.envPrdList.push(result.envList[i]);
    				}
    			}
    			if($scope.envPrdList.length>1){
    				var url="";
    				var key="";
    				if(revision!=undefined){
    					key="envDeploy.Dialog";
    					url="modules/sncd/templates/version/env-deploy-dialog.html";
    				}else{
    					key="envlist.Dialog";
    					url="modules/sncd/templates/version/env-list-dialog.html";
    				}
    				DialogService.modal({
    		            key: key,
    		            url: url
    		        },{
    		        	envPrdList:$scope.envPrdList,
    		        	sysId:$stateParams.sysId,
    		        	versionId:$scope.bmBuildHis.branchId,
    		        	envPrdParam:envParam,
    		        	revision:revision
    		        });
    	    	}else{
    	    		alert("复制成功");
    	    	}
    		});
    	}else{
    		alert("复制成功");
    	}
    }
    
    $scope.prdPath  = function (branchId) {
    	
    	DialogService.modal({
            key: "component.componentDialog",
            url: "modules/sncd/templates/component/component-dialog.html"
        },{
        	branchId:branchId
        });
    }
    
  //分页
    vm.$on('sn.controls.pager:pageIndexChanged', function (evt, page) { // 分页操作
      evt.stopPropagation();
      pager.pageNumber = page.pageIndex + 1;
      //queryList(pager.pageNumber);
      packageVersionInit($scope.envType);
    });
    
    $scope.download = function (param) {
    	window.location.href = baseUrl +'/angular/component/download.htm?id='+ param.id+'&appName='+param.appName;
	}

	}
]);
