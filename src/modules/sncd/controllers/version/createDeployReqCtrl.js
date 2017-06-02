//新建发布单
angular.module('sncd').controller('CreateDeployReqCtrl', ['$scope', '$filter', 'DeployReqManageService','AlertService','$state', '$stateParams','$q','SystemService','DialogService','QuaService',
    function ($scope, $filter, DeployReqManageService,AlertService,$state, $stateParams,$q,SystemService,DialogService,QuaService) {
		
	    
	    var envType = $stateParams.envType;
	    var versionId  = $stateParams.versionId;
		var sysId = $stateParams.sysId;
		if(envType=="021"){
			$scope.componentSelected =false;
		}else{
			$scope.componentSelected =true;
		}
		var envTypes = $scope.envTypes = [];
		$scope.manageRole = false;
		var qualitys=$scope.qualitys = [  {"value":303,"checked":false,"name":"蛙测"},
		                     {"value":300,"checked":false,"name":"安全扫描"}
							];  
		//页面数据初始化
	    init();
	        
	    function  init() {
	    	//数据初始化话
	    	$scope.deployParam = {};
	    	$scope.envType = envType;	
	    	
	    	//检查是否能够发布
	    	DeployReqManageService.checkDeployReq({"versionId":versionId}).then(function (result){
	    		if(result.result=='4' && ($stateParams.componentId==null||$stateParams.componentId=="")){
	    	    	$scope.message ="此分支尚未维护分支发布包信息，请点击分支名称，进入分支基本信息维护发布包，若没有发布包，请联系技术负责人先维护系统发布包配置。";
	    	    	return false;
	    		}else{
	    			
	    			
	    			createDeployReqInit();
	    			if(envType!=""){
	    				$scope.deployChange();
	    			}
	    			//if(result.isStaticDeployOnly=='21'){
	    				//alert
	    				//$scope.message ="您非发布文员，请联系发布人员进行发布";
	    				//return false;
	    			//}else{
	    				//仅是静态发布专员
	    				//if(result.isStaticDeployOnly=='23'){
	    					//if(result.result=='13'){//有静态包
	    						
	    					//}else{//无静态包
	    						
	    					//}
	    				//}
	    				//if(envType == '021'){//生产环境
	    					//DeployReqManageService.checkPrdDeployReq({versionId:versionId,sysId:sysId}).then(function(result){
	    						//if(result.flag){
	    							//if(result.verifyFlag){
//	    								if(!result.staticDeploy){
//	    									$scope.message ="静态发布人员仅能发布静态发布包，请检查分支发布包";
//	    						 			return false;
//	    						 		}else{
	    						 			//进入发布
//	    						 			createDeployReqInit();
//	    								}
//	    							}else{
//	    								$scope.message = "无法生产发布，原因如下：\n"+result.message;
//	    							}
//	    						}
//	    					});
//	    				}else{
//	    					//进入发布
//	    					createDeployReqInit();
//	    				}
//	    			}
	    		}
	    	});
	    }	
	    
	    function createDeployReqInit(){
	    	DeployReqManageService.createDeployReq({versionId:versionId,envType:envType,componentId:$stateParams.componentId}).then(function(result){
	    		$scope.envTypes = result.envTypes;
	    		$scope.requestor = result.requestor;
   		 		$scope.branchPlan = result.branchPlan;
   		 		$scope.process = result.process;
   		 		$scope.system = result.system;
   		 		$scope.version = result.version;
   		 		$scope.env = result.env;
   		 		$scope.usablePackageList = result.usablePackageList;
   		 		$scope.branchPackageList = result.branchPackageList;
   		 		$scope.envList = result.envList;
   		 		if(result.envList!=undefined){
   		 			$scope.canDeploy=true;
   		 		}
   		 		$scope.deployParam.deployTime = result.planTime;
   		 		$scope.nowtime=new Date();
   		 		$scope.componentInfo = result.componentInfo;
   		 		if(result.componentInfo!=undefined){
   		 			$scope.deployParam.envParam=result.componentInfo.envParam;
   		 		}
   		 		$scope.componentPackageList = result.componentPackageList;
   		 		//默认包disabe
   		 		if(result.componentPackageList!=undefined){
	    		 		for(var i = 0;i<result.componentPackageList.length;i++){
	    	       		result.componentPackageList[i].disable = true;
	    	       	}
   		 		}
   		 		else{
	    		 		for(var i = 0;i<result.branchPackageList.length;i++){
	    	       		result.branchPackageList[i].disable = true;
	    	       	}
   		 		}
    	        
    	        if(result.component!= undefined){
    	       		$scope.packageName = result.component.appName;
    	       	}
    	        if(result.envList != undefined && $scope.envList.length==1){
		    		setPackageState($scope.envList[0]);
		    	}
    	        $scope.deployParam.deployPattern ='停启Server';
    	        
   		 		if($scope.envType=='021'){
	    	        	$scope.deployPackageList=result.deployPackageList;
	    	        	//生产发布 数据
	    	        	$scope.deployParam.deployType ='TURN';
	    	        	$scope.deployParam.env = {};
	    	        	$scope.deployParam.env.envId  = result.env.envId;
   		 		}else{
   		 			//默认不封版
                	$scope.deployParam.isFreezen = '0';
	    	       	//是否有封板权限
	    	       	$scope.hasFreezenPermission= result.hasFreezenPermission; 
	    	       	$scope.deployParam.deployType ='一键发布';
   		 		}	
       	   	});
	    }
	    $scope.deployEnv="";
	    $scope.deployChange = function (){
	    	envType = $scope.envType;
	    	$scope.canDeploy=false;
	    	$scope.message="";
	    	if(envType==undefined){
	    		$scope.envType="";
	    	}else{
	    		if($scope.envType=='021'){
    	        	$scope.deployParam.deployType ='TURN';
		 		}else{
		 			$scope.deployParam.deployType ='一键发布';
		 		}
	    		//检查是否能发布
		    	DeployReqManageService.verifyApplyDeployReq({versionId:versionId,envType:envType}).then(function(data){
		    		if(data.result==0){//进入发布
		    			//是否有环境参数
		    			$scope.paraStat = data.paraStat;
		    			
		 		    	//生产环境
		    			if(envType == '021' && ($stateParams.componentId==null||$stateParams.componentId=="") ){
		 			    	DeployReqManageService.checkNewPrdDeployReq({versionId:versionId,sysId:sysId}).then(function(result){
		 			    		if(result.flag){
		 							if(result.verifyFlag){
		 								$scope.canDeploy=true;
		 								//查询环境打包参数
		 								getSystemEnv(envType);
		 								getEnvConfig(envType);
		 								 
		 							}else{
		 								$scope.message = "无法生产发布，原因如下：\n"+result.message;
		 							}
		 						}
		 			    	});
		 		    	}else if(envType == '020'){
		 		    		//pre
		 		    		DeployReqManageService.getCheckDeployResult({limiteType:'PRE'}).then(function(result){
		 			    		if(result.flag){
		 							if(result.verifyFlag){
		 								$scope.canDeploy=true;
		 								//查询环境打包参数
		 								getSystemEnv(envType);
		 								getEnvConfig(envType);
		 								 
		 							}else{
		 								$scope.message = "无法PRE发布，原因如下：\n"+result.message;
		 							}
		 						}
		 			    	});
		 		    	}else if(envType == '019'){
		 		    		//sit
		 		    		DeployReqManageService.getCheckDeployResult({limiteType:'SIT'}).then(function(result){
		 			    		if(result.flag){
		 							if(result.verifyFlag){
		 								$scope.canDeploy=true;
		 								//查询环境打包参数
		 								getSystemEnv(envType);
		 								getEnvConfig(envType);
		 								 
		 							}else{
		 								$scope.message = "无法SIT发布，原因如下：\n"+result.message;
		 							}
		 						}
		 			    	});
		 		    	}else{
		 		    		$scope.canDeploy=true;
		 		    		getSystemEnv(envType); 
		 		    		getEnvConfig(envType);
		 		    	} 
		 		    	
		    		}else if(data.result==1 && ($stateParams.componentId==null || $stateParams.componentId=="")){
		                $scope.message = "尚未创建JOB，请联系技术负责人维护打包配置信息！";
		            }else if(data.result==2){
		            	$scope.message = "没有可用的环境，请联系运维人员配置环境后，再申请发布单！";
		            }
		    		var params = { sysId: sysId };
		    		SystemService.getSystemTeam(params).then(function(result){
		    		    $scope.dtmList=result.dtmList;
		    		    var currentUser = result.currentUser;
		    		    for(var i=0;i<result.dtmList.length;i++){
		    		    	if(result.dtmList[i].roleName=="045" && result.dtmList[i].dtm_rolename.indexOf(currentUser)!=-1){
		    		    		$scope.manageRole = true;
		    		    		break;
		    		    	}
		    		    }
		    		});
		    	});
	    		
	    	}
	    }
	    
	    $scope.envChange = function (){
	    	$scope.warError="";
	    	setPackageState($scope.deployParam.env);
	    }
	    
	    function setPackageState(selEnv){
	    	
	    	$scope.componentSelected = true;
	    	if(selEnv != null ){
	    		$scope.envError = "";
	    		//是否有环境共享
		    	DeployReqManageService.checkIfShareEnv({envId:selEnv.envId}).then(function (result){
		    		if(result.flag){//是共享的环境
		    			if(selEnv.envType != "021"){
		    				$scope.shareEnvFlag = true;
		    				$scope.deployParam.deployPattern ='停启应用';
		    			}else{
		    				$scope.shareEnvFlag = false;
		    				$scope.deployParam.deployPattern ='停启Server';
		    			}

		    			//$scope.deployParam.deployType='停启应用';
		    		}else{//非共享的环境
		    			$scope.shareEnvFlag = false;
		    			$scope.deployParam.deployPattern ='停启Server';
		    			//$scope.deployParam.deployType='停启Server';
		    		}
		    	})
		    	
		    	//对war包的影响
		    	$scope.hasPackage = false;
		    	var usablePackageList = $scope.usablePackageList;
		    	var branchPackageList = $scope.branchPackageList;
		    	var componentPackageList = $scope.componentPackageList;
		    	if(componentPackageList==undefined){
			    	for(var m = 0;m<branchPackageList.length;m++){
	    				branchPackageList[m].disable = true;
	    				branchPackageList[m].selectPackage = false;
	    			}
			    	for(var i = 0;i< usablePackageList.length;i++){
			    		if(usablePackageList[i].envId == selEnv.envId){
			    			for(var m = 0;m<branchPackageList.length;m++){
			    				if(getPackageId(branchPackageList[m].packageId,usablePackageList[i].packageId)){
			    					if(envType=="021"){
			    						branchPackageList[m].disable = true;
			    					}else{
			    						branchPackageList[m].disable = false;
			    					}
			    					
			    					branchPackageList[m].selectPackage = true;
			    					$scope.hasPackage = true;
			    				}
		    	        	}
			    		}
			    	}
			    	$scope.branchPackageList = branchPackageList;
		    	}else{
		    		for(var m = 0;m<componentPackageList.length;m++){
		    			componentPackageList[m].disable = true;
		    			componentPackageList[m].selectPackage = false;
	    			}
		    		for(var i = 0;i< usablePackageList.length;i++){
			    		if(usablePackageList[i].envId == selEnv.envId){
			    			for(var m = 0;m<branchPackageList.length;m++){
			    				if(getPackageId(branchPackageList[m].packageId,usablePackageList[i].packageId)){
			    					getComponentPackage(branchPackageList[m],envType);
			    				}
		    	        	}
			    		}
			    	}
		    	}
	    	}else{
	    		//对war包的影响
		    	var branchPackageList = $scope.branchPackageList;
		    	for(var m = 0;m< branchPackageList.length;m++){
    					branchPackageList[m].disable = true;
    					branchPackageList[m].selectPackage = false;
		    		}
		    	$scope.branchPackageList = branchPackageList;
	    	}
	    }
	    
	    function getPackageId(packageId,packages){
	    	var result = false;
	    	var arr = packages.split(',');
	    	for(var i=0;i<arr.length;i++){
	    		if(packageId==arr[i]){
	    			result = true;
	    			break;
	    		}
	    	}
	    	return result;
	    }
	    //匹配包名
	    function getComponentPackage(branchPackageItem,envType){
	    	var packageName = branchPackageItem.packageName;
	    	var result = false;
	    	var componentPackageList = $scope.componentPackageList;
	    	for(var m = 0;m<componentPackageList.length;m++){
	    		//精确比较
    			if(componentPackageList[m].packageName==packageName){
    				result = true;
    			}else{
    				//取后缀名
    				var suffixName = componentPackageList[m].packageName.substring(componentPackageList[m].packageName.lastIndexOf("."),componentPackageList[m].packageName.length);
    				var suffixPackagename = packageName.substring(packageName.lastIndexOf("."),packageName.length);
    				if(suffixName == suffixPackagename){
    					//去除文件名后缀
            			var tempName = componentPackageList[m].packageName.substring(0,componentPackageList[m].packageName.lastIndexOf("."));
            			var tempPackageame = packageName.substring(0,packageName.lastIndexOf("."));
            			var reg=/^-[0-9]*$/;
        		        if(reg.test(tempName.replace(tempPackageame,""))){
        		        	result = true;
        		        }
        		        if(!result){
    	    				reg=/^-[S,s][I,i][T,t]-[0-9]*$/;
    	    		        if(reg.test(tempName.replace(tempPackageame,""))){
    	    		        	result = true;
    	    		        }
        		        }
        		        if(!result){
    	    		        reg=/^-[P,p][R,r][E,e]-[0-9]*$/;
    	    		        if(reg.test(tempName.replace(tempPackageame,""))){
    	    		        	result = true;
    	    		        }
        		        }
        		        if(!result){
    	    		        reg=/^-[P,p][R,r][D,d]-[0-9]*$/;
    	    		        if(reg.test(tempName.replace(tempPackageame,""))){
    	    		        	result = true;
    	    		        }
        		        }
        		        if(!result){
    	    		        reg=/^-[P,p][R,r][O,o][D,d]-[0-9]*$/;
    	    		        if(reg.test(tempName.replace(tempPackageame,""))){
    	    		        	result = true;
    	    		        }
        		        }
    				}
    				
    			}

    			if(result){
    	    		if(envType=="021"){
    	    			componentPackageList[m].disable = true;
    				}else{
    					componentPackageList[m].disable = false;
    				}
    	    		componentPackageList[m].selectPackage = true;
    	    		componentPackageList[m].packageId=branchPackageItem.packageId;
    	    		$scope.hasPackage = true;
    				break;
    	    	}
			}
	    }
	    
	    function getSystemEnv(envType){
	    	SystemService.getSysEnableEnv({sysId:$stateParams.sysId}).then(function (result) {
	    		$scope.envList=[];
    			for(var i=0;i<result.envList.length;i++){
    				if(result.envList[i].envType==envType){
    					$scope.envList.push(result.envList[i]);
    				}
    			}
    			if($scope.envList!=undefined && $scope.envList.length==1){
					setPackageState($scope.envList[0]); 
				}
	    	});
	    }
	    
	    function getEnvConfig(envType){
	    	SystemService.getEnvConfig({"sysId":sysId,"envType":envType}).then(function(result){
	    		var envParam =  result.envParaStrs ;
	    		if(envParam  != null){
	    			var envParams = envParam.split(",");
	    			$scope.envParams = envParams;
	    			if($scope.componentInfo != undefined && $scope.deployParam.envParam!=''){
	    				$scope.deployParam.envParam = $scope.componentInfo.envParam;
	    			}else{
	    				$scope.deployParam.envParam =  envParams[0];
	    			}
	    			
	    		}
	    	});
	    }

	    //保存发布单
	    function submitDeployReq(){
	    	$scope.envError='';
	    	$scope.warError  = '';
	    	
	    	
	    	var selPackage ="";
	    	var componentPath = "";

	    	var packageList = $scope.branchPackageList;
	    	for(var i = 0;i<packageList.length;i++){
	    		if(packageList[i].selectPackage){
	    			if(i==0 || selPackage == ''){
	    				selPackage =  packageList[i].packageId;	
	    			}else{
	    				selPackage = selPackage + "," + packageList[i].packageId;
	    			}
	    		}
	    	}

	    	if($scope.componentInfo!=undefined){
		    	var arrPackages={};
		    	arrPackages["id"]=$scope.componentInfo.componentId;
		    	arrPackages["ftpPath"]=$scope.componentInfo.componentPath;
		    	var tempPackages = "";
		    	if($scope.componentPackageList!=undefined){
		    		for(var i=0;i<$scope.componentPackageList.length;i++){
		    			if($scope.componentPackageList[i].selectPackage){
		    				tempPackages += $scope.componentPackageList[i].packageName+",";
		    				if(selPackage == ''){
			    				selPackage =  $scope.componentPackageList[i].packageId;	
			    			}else{
			    				selPackage = selPackage + "," + $scope.componentPackageList[i].packageId;
			    			}
		    			}
		    		}
		    		arrPackages["packages"]=tempPackages;
		    		componentPath = JSON.stringify(arrPackages);
		    	}
		    	//是否选择了war包
		    	if(tempPackages== ''){
		    		$scope.warError = "请至少选择一个war包!";
		    		return false;
		    	}
	    	}
	    	
	    	var deployParam = $scope.deployParam;
	    	//是否选择了环境
	    	if($scope.envList.length==1){
	    		deployParam.env=$scope.envList[0];
	    	}else if(deployParam.env == null){
	    		$scope.envError = "请选择发布环境!";
	    		return false;
	    	}
	    	
	    	//是否选择了war包
	    	if(selPackage== '' && componentPath== ''){
	    		$scope.warError = "请至少选择一个war包!";
	    		return false;
	    	}
	    	
	    	var deployTimeStr = $filter('date')($scope.deployParam.deployTime,"yyyy-MM-dd HH:mm:ss");
	    	var deployHis = {
	    		//BmDeplpyHis
	    		branchId : $scope.version.branchId,
	    		deployPattern :$scope.deployParam.deployPattern,//默认停启server
	    		deployType : $scope.deployParam.deployType,
	    		envId:deployParam.env.envId,
	    		isFrezen : $scope.deployParam.isFreezen,//默认不封版
	    		orgId :$scope.system.orgId,
	    		packageId:selPackage,
	    		planTime :deployTimeStr ,
	    		requestNo : $scope.process.requestNo,
	    		sysId:$scope.system.sysId,
	    		packageEnvParam:$scope.deployParam.envParam,
	    		analysis:$scope.analysis
	    	};
	    	
	    	var process={
	    		applyContent:$scope.requestor+"提交了"+$scope.version.branchName+"发布申请",
	    		processStatus:"009",
	    		processType:"121",
	    		requestNo:$scope.process.requestNo
	    	}

	    	DeployReqManageService.saveDeployReq({'deployHis':JSON.stringify(deployHis),'process':JSON.stringify(process),'componentPath':componentPath,'analysis':$scope.analysis}).then(function (data){
	    		if("1"==data.deployResult){
					alert("发布队列已满,请稍后手动发布!");
					$state.go("VersionDeploy",{vtab:"VersionDeploy"});
				}else if("2"==data.deployResult){
					//alert("该环境有其他发布使用,发布单号【"+data.requestNo+"】,请与发布单申请人"+data.userName+"联系！");
					//$state.go("VersionDeploy",{vtab:"VersionDeploy"});
					var message = "环境有其他发布使用,发布单号【";
					var arr = data.requestNo.split(',');
					for(var i=0;i<arr.length;i++){
						message+="<a target='_blank' href='deployReq/deployReqDetail.htm?opFlag=detail&requestNo="+arr[i]+"&isnew=true'>"+arr[i]+"</a>";
						if(arr[i]!="" && i<arr[i].length-1){
							message+=",";
						}
					}
					message += "】请与发布单申请人"+data.userName+"联系！";
					$scope.message = message;
				}else if("5"==data.deployResult){
					alert("此系统正在打包，请稍后再尝试！");
					$state.go("VersionDeploy",{vtab:"VersionDeploy"});
				}else if("3"==data.deployResult){
					$state.go("VersionDeploy",{vtab:"VersionDeploy"});
					window.open("deployReq/deploymonitorpage.htm?deployid="+data.deployId);
					
				}else if("4"==data.deployResult){
					alert("已提交至发布配置人员执行资源配置项!");
					$state.go("VersionDeploy",{vtab:"VersionDeploy"});
				}else if("ngjboss"==data.deployResult){
					ngJbossPublish(data.deployId,data.deployType);
				}else{
					$state.go("VersionDeploy",{vtab:"VersionDeploy"});
					
				}
	    	})
	    }
	    
	    function deployCheckResult(params){
	    	QuaService.deployCheckResult(params).then(function (result){
    	    	if(!result.flag){
    	    		//不符合交付流程配置,弹出框让用户提醒用户是否跳过检查,是必须写明原因
    	    		var deliveryResult=result.deliveryResult;
    	    		var deployNo=deliveryResult.deployNo;
    	    		var vqTrendInfos=result.vqTrendInfos;
    	    		if(vqTrendInfos.length<=0){
    	    			vqTrendInfos=null;
    	    		}
    	    		//弹出页面用户
    	    		DialogService.modal({
    	    			key:"deploy.deliveryCheck",
    	    			url:"modules/sncd/templates/quality/deploy-delivery-check.html",
    	    			accept:function(result){
    	    				continueDep=result.continueDep;
    	    				if(continueDep==1){
    	    					submitDeployReq();
    	    				}
    	    			}
    	    		},{
    	    			deployNo:deployNo,
    	    			vqTrendInfos:vqTrendInfos
    	    		});
    	    	}else{
    	    		submitDeployReq();
    	    	}
	    	});
	    }
	    
	    function ngJbossPublish(deployId,deployType){
	    	var selPackage='';
	    	var packageList;
	    	if($scope.componentPackageList != undefined){
	    		packageList = $scope.componentPackageList;
	    	}else{
	    		packageList = $scope.branchPackageList;
	    	}
	    	for(var i = 0;i<packageList.length;i++){
	    		if(packageList[i].selectPackage){
	    			if(selPackage == ''){
	    				selPackage =  packageList[i].packageId;	
	    			}else{
	    				selPackage = selPackage + "," + packageList[i].packageId;
	    			}
	    		}
	    	}
	    	if(selPackage==""){
	    		alert("请选择发布包，若无法选择，请确保环境正确！");
	    		return false;
	    	}
	    	//DeployReqManageService.publishNgJboss({"deployId":deployId,"packages":selPackage,"deployType":deployType}).then(function (data){
	    		var jumpurl = "http://" + window.location.host + "/udmp-web-in/publish.html#/publish-monitor?deployId="+deployId;
	    		window.location.href = jumpurl;
	    	//});
	    }
	    
	    $scope.saveDeployReq = function (){
	    	qualitys.forEach(function(item, index){
	    		if(item.checked){
	    			if(typeof($scope.analysis)!="undefined"){
	    				$scope.analysis=$scope.analysis+","+item.value;
	    			}else{
	    				$scope.analysis=item.value;	
	    			}
	    		}
	    	});
	    	//表单校验
	    	if($scope.packagesShow==false){
	    		$scope.packages = "";
	    	}
	    	
	    	//校验是否符合交付流程
	        var params={
	        	sysId:sysId,
	        	versionId:versionId,
	        	requestNo:$scope.process.requestNo,
	        	envType:$scope.envType
	        };
	    	//prd检查是否有限制
	    	if($scope.envType == '021'){//生产发布
	    		DeployReqManageService.checkPromotion({"envType":envType}).then(function (data){
	    			if(data.promotionDeployOpen){
	    				//deployCheckResult(params);
	    				submitDeployReq();
					}else{
						
						AlertService.alert({
		                    title: '不可发起生产发布',
		                    content: data.notifyInfoBo["content"]
		                });
						return false;
					}
	    		});
	    	}else if ($scope.envType == '019'){
	    		//SIT
	    		DeployReqManageService.checkPromotionByLimiteType({"limiteType":"SIT"}).then(function (data){
	    			if(data.promotionDeployOpen){
	    				deployCheckResult(params);
					}else{
						AlertService.alert({
		                    title: '不可发起SIT发布',
		                    content: data.notifyInfoBo["content"]
		                });
						return false;
					}
	    		});
	    	}else if($scope.envType == '020'){
	    		//SIT
	    		DeployReqManageService.checkPromotionByLimiteType({"limiteType":"PRE"}).then(function (data){
	    			if(data.promotionDeployOpen){
	    				submitDeployReq();
					}else{
						AlertService.alert({
		                    title: '不可发起PRE发布',
		                    content: data.notifyInfoBo["content"]
		                });
						return false;
					}
	    		});
	    	}else{
	    		submitDeployReq();
	    	}
	    }

	    $scope.goBack = function (){
	    	$state.go("VersionManage",{
	    		type:"1"
	    	});
	    } 
	    
	    $scope.selectComponent  = function () {

	    	var packageList = 	$scope.branchPackageList;
	    	var selPackage ="";
	    	for(var i = 0;i<packageList.length;i++){
	    		if(packageList[i].selectPackage){
	    			if(i==0 || selPackage == ''){
	    				selPackage =  packageList[i].packageId;	
	    			}else{
	    				selPackage = selPackage + "," + packageList[i].packageId;	
	    			}
	    		}
	    	}
	    	
	    	if(selPackage==""){
	    		alert("请选择发布包。");
	    		return false;
	    	}
	    	$stateParams.selPackage = selPackage;
	    	DialogService.modal({
	            key: "selectComponentDialog",
	            url: "modules/sncd/templates/version/select-component-dialog.html",
	            accept:function(result){
	            	$scope.packages = result;
	            }
	        },{
//	        	branchId:$stateParams.versionId,
//	        	envType:$stateParams.envType,
	        	envParam:$scope.deployParam.envParam,
	        	selPackage:$stateParams.selPackage 
	        });
	    }
	    
	    $scope.checkComponent = function(ctrl){
	    	$scope.packagesShow = ctrl;
	    }
	    
	    $scope.delPacage = function(key){
	    	delete $scope.packages[key];
	    } 
    }
])