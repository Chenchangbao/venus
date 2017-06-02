angular.module('sncd').controller('PackageAndDeployCtrl', ['$scope', 'VersionManageService','$state','$stateParams','$timeout','SystemService','DeployReqManageService','QuaService','DialogService',
  function($scope, VersionManageService,$state,$stateParams,$timeout,SystemService,DeployReqManageService,QuaService,DialogService) {
    'use strict';

		var stateEnvParam = $stateParams.envParam ||'';
    ///////////////////functions//////////////////
    var envTypes = $scope.envTypes = [{envType:"019",envName:"集成测试环境"},{envType:"020",envName:"预生产环境"},{envType:"021",envName:"生产环境"},{envType:"171",envName:"本地测试环境"}]
    var postData = $scope.postData = {};
    var sysId = $stateParams.sysId;
    var envId = $stateParams.envId;
    function init() {
    	
    	//是维护，继续
    	var envType  = $stateParams.envType || '019';
    	$scope.postData.envType = envType;
    	packageVersionInit(envType);
    	getEnvConfig(envType);
    }
    function buildJobCheck(bmBuildHis){
    	var envType=bmBuildHis.deployEnv;
    	QuaService.packageQuaCheck({ sysId: bmBuildHis.sysId,versionId:bmBuildHis.branchId,envType:envType }).then(function (result) {
    		$scope.sysType=$scope.systemBean.sysType;
    		var vqTrendInfos=result.vqTrendInfos;
    		var codeReviewInfo=result.codeReviewInfo;
    		var sonarUrl =result.sonarUrl;
    		var buildEndTime=result.buildEndTime;
    		var buildId = result.buildId;
    		var newCodeLines=result.newCodeLines;
    		var qualityResult=result.qualityResult;
    		var jenkinsUrl=result.jenkinsUrl;
    		$scope.isQuaWhite=result.isQuaWhite;
			$scope.reviewResult=result.reviewResult;
			$scope.checkResult=result.flag;
			$scope.utPassedRate="";
			$scope.newCoverage="";
			if(vqTrendInfos.length>0){
    			for(var i=0;i<vqTrendInfos.length;i++){
    				if(vqTrendInfos[i].paramKey=="TEST_SUCCESS_DENSITY"){
    					$scope.utPassedRate=vqTrendInfos[i].paramValue;
    				}
    				if(vqTrendInfos[i].paramKey=="NEW_COVERAGE"){
    					$scope.newCoverage=vqTrendInfos[i].paramValue;
    				}
    			}
			}
    		if (!result.flag) {
				var buildStatus=result.buildStatus;
		    		//弹出页面用户
		    		DialogService.modal({
		    			key:"package.packageQuaCheck",
		    			url:"modules/sncd/templates/quality/package-qua-check.html",
		    			accept:function(result){
		    				var continuePack=result.continuePack;
		    				if(continuePack==1){
		    					//一级系统、pre、prd发布直接关闭
		    					var systemGrade=$scope.systemBean.systemGrade;
		    					if(!$scope.isQuaWhite &&"一级"==systemGrade && ("020"==envType || "021"==envType) && buildStatus!=4&& buildStatus!=5){
		    						return;
		    					}else{
		    						$timeout(function(){confirmBuildJob(bmBuildHis)})
		    					}
		    				}
		    			}
		    		},{
		    			vqTrendInfos:vqTrendInfos,
		    			reviewResult:$scope.reviewResult,
		    			envType:envType,
		    			systemGrade:$scope.systemBean.systemGrade,
		    			buildStatus:buildStatus,
    	    			sysName:$scope.systemBean.sysName,
    	    			codeReviewInfo:codeReviewInfo,
    	    			sonarUrl:sonarUrl,
    	    			buildEndTime:buildEndTime,
    	    			branchId:bmBuildHis.branchId,
    	    			sysId:$scope.systemBean.sysId,
    	    			buildId:buildId,
    	    			newCodeLines:newCodeLines,
    	    			qualityResult:qualityResult,
    	    			jenkinsUrl:jenkinsUrl,
    	    			sysCnname:$scope.systemBean.sysCnname,
    	    			version:$scope.branch.version,
    	    			isQuaWhite:$scope.isQuaWhite
		    		});
				 
				} else {
					//构建成功
					confirmBuildJob(bmBuildHis);
				}
		});
    }
    
    function confirmBuildJob(bmBuildHis){
    	var msg = ""
			if ($scope.packageType == 'MAVEN') {
				msg = "平台即将根据您所选择的环境参数自动化打包，请确认构建命令是否正确，如果对此项配置有疑问，请联系技术人员或平台支持人员朱文静(11010068)，继续请按“确定”，否则请按“取消”进行配置检查。";
			} else {
				msg = "平台即将根据您在打包配置页面所设置的环境参数或者工程build.xml文件中的环境参数进行自动化打包，请确认配置是否正确，如果对此项配置有疑问，请联系系统技术负责人或平台支持人员朱文静(11010068)，继续请按“确定”，否则请按“取消”进行配置检查。";
			}
			if (confirm(msg)) {
				//执行打包
				packageVersion(bmBuildHis);
				
			}
    }
    
	
	function savePackageQua(bmBuildHis){
		var param={
				sysId:bmBuildHis.sysId,
				versionId:bmBuildHis.branchId,
				envType:bmBuildHis.deployEnv,
				checkResult:$scope.checkResult,
				reviewResult:$scope.reviewResult,
				utPassedRate:$scope.utPassedRate,
				newCoverage:$scope.newCoverage,
				buildId:bmBuildHis.buildId
		}
		QuaService.savePackageQua(param).then(function (result) {
		});
	}
    
    
    function getEnvConfig(envType){
    	var envParams = [];
    	SystemService.getEnvConfig({"sysId":sysId,"envType":envType}).then(function(result){
    		var envParam =  result.envParaStrs ;
    		if(envParam  != null && envParam.length >0){
    			var envParams = envParam.split(",");
    			$scope.envParams = envParams;
    			if(envType=='021'){
    				$scope.postData.envParam =  envParam;
    			}else{
    				$scope.postData.envParam =  envParams[0];
    			}
    			
//    			$scope.envParams = envParams;
    		}
    	})
    }
    
 
    
    
    
    
    
    $scope.changeEnv = function (){
    	packageVersionInit($scope.postData.envType);
    	getEnvConfig($scope.postData.envType);
    }
    

    
    // 获取打包详情
    function packageVersionInit(envType){
    	
      $scope.freezeMsg= '';
      var params = {
        versionId: $stateParams.versionId,
        sysId:$stateParams.sysId,
        envType:envType,
		envParam: stateEnvParam,
		envId:$stateParams.envId
		
      };
      $scope.envId=$stateParams.envId;
      $scope.envType = envType;
    	  VersionManageService.packageVersionInit(params).then(function(result){
    		  	$scope.freezeMsg = result.freezeMsg;
    		  	$scope.message = result.message;
    	        $scope.branch=result.branch;
    	        $scope.queryResult=result.queryResult;
    	        $scope.packageType=result.packageType;
    	        $scope.systemBean=result.systemBean;
    	        $scope.bmBuildHis=(result.bmBuildHisParamList||[])[0];
    	        $scope.jobname=result.jobname;
    	        $scope.paraStat = result.paraStat;
    	        if(result.environment!=undefined){
    	        	$scope.environment=result.environment;
    	        }
    	        if(result.environmentList!=undefined){
    	        	$scope.envId=result.environmentList[0].envId;
    	        	$scope.environmentList=result.environmentList;
    	        	
    	        }
    	        $scope.usable = result.usable;
    	        if(result.useMsg!=null){
    	        	$scope.useMsg = result.useMsg.replace("<br>","\n");	
    	        }
    	        
    	      });
    }
    

    init();
    
    $scope.changeEnv = function(envId){
    	$scope.envId = envId;
    	$scope.freezeMsg= '';
        var params = {
    		versionId: $stateParams.versionId,
          	sysId:$stateParams.sysId,
          	envType:"021",
  			envParam: stateEnvParam,
  			envId:envId
  		
        };
        $scope.envId=$stateParams.envId;
      	VersionManageService.packageVersionInit(params).then(function(result){
		  	$scope.freezeMsg = result.freezeMsg;
		  	$scope.message = result.message;
	        
	        $scope.usable = result.usable;
	        if(result.useMsg!=null){
	        	$scope.useMsg = result.useMsg.replace("<br>","\n");	
	        }
	     });
    }
    
    $scope.oneKeyDeploy = function (){
    	if(($scope.environmentList != undefined && $scope.environmentList.length>0)
    			&&( $scope.envId==undefined || $scope.envId=="")){
    		alert("请选择发布环境名称");
    		return false;
    	}
//    	alert($scope.envId);
//    	return false;
    	DeployReqManageService.prdDeploy({sysId:$stateParams.sysId,branchId:$stateParams.versionId,envId:$scope.envId,envParam:$stateParams.envParam}).then(function (data){
			if(data.flag){	
				if(data.verifyFlag){
					if(data.deployFlag){
						if(data.systemType=="ngjboss"){
							window.open("publish.html#/publish-monitor?deployId="+data.deployId);
						}else{
							window.open("deployReq/deploymonitorpage.htm?deployid="+data.deployId,"_blank");
						}
					}else{
						 alert(data.message);
					}
				}else{
					alert(data.message);
				}
			}else{
				alert("程序异常");
			} 
    	})
    	
    }
    
    
    
    //打包  
    $scope.packageVersion=function (bmBuildHis,system,packageType){
    	
    	var  packFlag = true;
    	if(bmBuildHis.sysId == '12'){
    		packFlag = 	VersionManageService.checkReview({sysId:bmBuildHis.sysId,versionId:bmBuildHis.branchId,envId:bmBuildHis.deployEnv}).then(function (result){
    			if(result.flag){
    				alert(result.info+",无法打包！");
    				packFlag = false;
    				return false;
    			}else{
    				if(bmBuildHis.deployEnv == '021'){//生产环境
    	    			packFlag =	VersionManageService.checkFrozen({versionId:bmBuildHis.branchId}).then(function (result){
    	        			if(!result.flag){
    	        				alert("该分支未封版，不能打包，封版请联系以下角色：技术总监、技术负责人、系统管理员、分支技术经理、分支测试经理。");
    	        				packFlag = false;
    	            			return false;	
    	        			}else{
    	        				VersionManageService.checkBuild({sysId:bmBuildHis.sysId}).then(function (result){
    	            	    		if(result.flag){
    	            	    			buildJobCheck(bmBuildHis);
    	            	    			
    	            	    		}else{
    	            	    			alert("此系统有环境正在打包，请稍后再尝试！");
    	            	    			return false;
    	            	    		}
    	            	    	})
    	        			}
    	        		})
    	       		}else{
    	       			VersionManageService.checkBuild({sysId:bmBuildHis.sysId}).then(function (result){
    	    	    		if(result.flag){
    	    	    			buildJobCheck(bmBuildHis);
    	    	    		}else{
    	    	    			alert("此系统有环境正在打包，请稍后再尝试！");
    	    	    			return false;
    	    	    		}
    	    	    	})
    	       			
    	       		}
    			}
    		})
    	}else{

			if(bmBuildHis.deployEnv == '021'){//生产环境
    			packFlag =	VersionManageService.checkFrozen({versionId:bmBuildHis.branchId}).then(function (result){
        			if(!result.flag){
        				alert("该分支未封版，不能打包，封版请联系以下角色：技术总监、技术负责人、系统管理员、分支技术经理、分支测试经理。");
        				packFlag = false;
            			return false;	
        			}else{
        				VersionManageService.checkBuild({sysId:bmBuildHis.sysId}).then(function (result){
            	    		if(result.flag){
            	    			buildJobCheck(bmBuildHis);
            	    		}else{
            	    			alert("此系统有环境正在打包，请稍后再尝试！");
            	    			return false;
            	    		}
            	    	})
        			}
        		})
       		}else{
       			VersionManageService.checkBuild({sysId:bmBuildHis.sysId}).then(function (result){
    	    		if(result.flag){
    	    			buildJobCheck(bmBuildHis);
    	    		}else{
    	    			alert("此系统有环境正在打包，请稍后再尝试！");
    	    			return false;
    	    		}
    	    	})
       			
       		}
		
    		
    	}
    }

  //执行打包
    function packageVersion(bmBuildHis){
    	var envParam  = '';
    	if($scope.postData.envParam != null){
    		envParam = $scope.postData.envParam;
    	}  
    	
    	
		VersionManageService.packageVersion({bmBuildHis:JSON.stringify(bmBuildHis),envParam:envParam}).then(function(result){
			//打包结果
			 $scope.queryResult=result.queryResult;
			 $scope.bmBuildHis=result.bmBuildHis;
			//日志获取
			if($scope.packageType=='PC'){
				getPcPackageLog($scope.bmBuildHis.buildId)
			}
			
			getPackageLog( $scope.jobname,$scope.bmBuildHis.buildId);
			savePackageQua(result.bmBuildHis);
		});
    }
    
    
    var getPcPackageLog =  function (buildId){
    	VersionManageService.getPcPackageLog({"buildId":buildId}).then(function(result){
    			if(result.pcDeployStatus!=null){
            		
            		if(result.pcDeployStatus.packLogUrl!=null && result.pcDeployStatus.packLogUrl!=""){
            			$scope.packLogUrl  =  '打包详情请见:<a href="'+result.pcDeployStatus.packLogUrl+'" target="_blank">'+result.pcDeployStatus.packLogUrl+'</a><br/>';
            		}
            		
            		//打包输出地址
            		if(result.pcDeployStatus.packageUrl!=null && result.pcDeployStatus.packageUrl!=""){
            			$scope.packageUrl =  '包输出地址请见:<a href="'+result.pcDeployStatus.packageUrl+'" target="_blank">'+result.pcDeployStatus.packageUrl+'</a><br/>';
            		}
            		
            		$timeout((function (){
        				getPcPackageLog(buildId);
        			}), 10000);
    		}
    	})
    }
    
    
    
    var getPackageLog =  function (jobName,buildId){
    	VersionManageService.getPackageLog({jobName:jobName,"buildId":buildId}).then(function(result){
    		if(result.flag!='1') {
    			
    			$scope.jenkinsPath = result.jenkinsPath;
    			
    			$timeout((function (){
    				getPackageLog(jobName,buildId);
    			}), 10000);
    		}else{//修改结果
    			$scope.queryResult[0].buildFlg = result.result;
    			$scope.queryResult[0].ftpPath = result.ftppath;
    			
    		}
    	})
    }
}
    
]);
