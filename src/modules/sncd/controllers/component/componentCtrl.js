angular.module('sncd').controller('ComponentCtrl', ['$scope', 'ComponentService','VersionManageService','HomeService','SystemService','DeployReqManageService','AlertService','DialogService', '$state','baseUrl','$stateParams','$q','QuaService','$timeout',
    function ($scope,ComponentService,VersionManageService,HomeService,SystemService,DeployReqManageService,AlertService,DialogService,$state,baseUrl,$stateParams,$q,QuaService,$timeout) {
        'use strict';

        var vm = $scope,
        	formData = vm.formData = {},
        	pager = vm.pager = {
        	       pageNumber: 1,
        	       totalCount: 0, //总条数
        	       pageSize: 10
        	   },
	        //版本的所有状态
	        evnTypeList = vm.evnTypeList = [
	            {code: '', name: '全部'},
				{'code': "171", 'name': "DEV"},
				{'code': "019", 'name': "SIT"},
				{'code': "020", 'name': "PRE"},
				{'code': "021", 'name': "PRD"}
	        ];
        
	        $scope.title = "";
	        $scope.description = "";
	        $scope.prdPath = "";
	        var userData =$scope.userData={submitter:{value:null}};
	        $scope.userLable=[{
	                	model:userData.submitter
	                   }];
	        var newrwUsers = $scope.newrwUsers = {
	    			filterList: [], // 备选列表,
	    			filterValue: null, // 备选列表元素为对象时备选列表显示的属性，
	    			pickedList: [], // 已选内容列表,
	    			filterNumber: 20, // 备选列表显示条数 
	    			validFunction: validFunction, // 输入框校验
	    			canDirectInput: true,// 是否允许输入框直接输入
	    			pickingItem: null
	    		};
	        $scope.addresses={};
	        var envTypes =  $scope.envTypes =  [{envType:'171',envName:'本地测试'},{envType:'019',envName:'集成测试'},{envType:'020',envName:'预生产'},{envType:'021',envName:'生产'}];
	        var deployStatus =  $scope.deployStatus =  [{status:'1',name:'是'},{status:'0',name:'否'}];
	        var deployResult =  $scope.deployResult =  [{status:'150',name:'部署成功'},{status:'151',name:'部署失败'},{status:'152',name:'部署终止'}];
	        $scope.close = function () {
	            DialogService.dismiss('component.componentDialog');
	        };
	        
        /////////////functions///////////////
        function init() {
        	var currName = $state.current.name;
        	if(currName == "Component"){
        		index();
        	}else if(currName == "ComponentDetail"){
        		queryDetail($stateParams.id);
        	}else if(currName == "ComponentList"){
//        		$scope.componentParam = {};
//        		queryList(0);
//        		//获取用户数据
//             	HomeService.getAllUsers().then(function(result){
//                   $scope.userList = result.allUsers;
//                   newrwUsers.filterList = result.allUsers;
//             	});
//        		formData.selectedEnvType = evnTypeList[0];
        		
        	}else if(currName == "MyComponentList"){        		
        		$scope.componentParam = {type:"my"};
        		queryList(0);
        		//获取用户数据
             	HomeService.getAllUsers().then(function(result){
                     $scope.userList = result.allUsers;
                     newrwUsers.filterList = result.allUsers;
                   });
        		formData.selectedEnvType = evnTypeList[0];
        	}else if(currName == "ComponentListRevision"){
        		$scope.componentParam = {revision:$stateParams.revision,envType:$stateParams.envType};
        		queryList(0);
        		//获取用户数据
             	HomeService.getAllUsers().then(function(result){
                     $scope.userList = result.allUsers;
                   });
        		formData.selectedEnvType = evnTypeList[0];
        	}else if(currName == "PackageVersion"){
        		//1、校验是否封版
        		VersionManageService.checkFrozen({ versionId: $stateParams.versionId }).then(function (result) {
	    			if (!result.flag) {
	    				$scope.frozen = false;
	    			}
				});
        		//获取环境列表
    			ComponentService.componentEnvParamList({ sysId: $stateParams.sysId}).then(function (result) {
    				$scope.prdFlag = false;
					var envParam = "";
					if(result.length>0){
						envParam = result[0].paraInfo;
					}
					ComponentService.componentPrdList({ branchId: $stateParams.versionId,envParam:envParam}).then(function (result) {
						if(result["hasData"]){
							$scope.prdFlag = true;
							delete result["hasData"];
							$scope.items=result;
						}
					});
    				
    				$scope.componentEnvParam = "";
    				$scope.componentEnvParamList = "";
//    				
    				if(result.length==1){
    					$scope.componentEnvParam = result[0];
    				}else if(result.length>1){
    					$scope.componentEnvParamList = result;
    					$scope.paraInfo=result[0].paraInfo;
    				}
        		});
        	}else if(currName == "DeployPrd"){
        		ComponentService.componentDeploy({sysId:$stateParams.sysId, 
        			branchId: $stateParams.branchId,envParam:$stateParams.envParam, 
        			envId: $stateParams.envId,revision:$stateParams.revision}).then(function (result) {
    				$scope.prdList = result.prdList;
    				if(result.prdList!=undefined && result.prdList.length>0){
    					$scope.id=result.prdList[0].componentId;
    					$scope.ftpPath=result.prdList[0].componentPath;
    				}
    				$scope.branchInfo = result.branchInfo;
    				$scope.system = result.system;
    				$scope.revision = result.revision;
    				$scope.packages=result.packages;
    				$scope.envId=result.envId;
    				$scope.envParam=result.envParam;
    				$scope.packageList=result.packageList;
        		});
        	}
        }
        
        function buildJobCheck(sysId,branchId,envType,envName,packageType){
        	QuaService.packageQuaCheck({ sysId: sysId,versionId:branchId,envType:envType}).then(function (result) {
        		$scope.sysType=$scope.sysInfo.sysType;
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
    	    					//一级系统、pre、prd（非构建失败）直接关闭
    	    					var systemGrade=$scope.sysInfo.systemGrade;
    	    					console.log(!$scope.isQuaWhite+","+systemGrade+","+envType+","+buildStatus);
    	    					if(!$scope.isQuaWhite && "一级"==systemGrade && ("020"==envType || "021"==envType) && buildStatus!=4&& buildStatus!=5){
    	    						return;
    	    					}else{
    	    						$timeout(function(){buildPackage(sysId, branchId,envType,envName,packageType)})
    	    					}
    	    				}
    	    			}
    	    		},{
    	    			vqTrendInfos:vqTrendInfos,
    	    			reviewResult:$scope.reviewResult,
    	    			envType:envType,
    	    			systemGrade:$scope.sysInfo.systemGrade,
    	    			buildStatus:buildStatus,
    	    			sysName:$scope.sysInfo.sysName,
    	    			codeReviewInfo:codeReviewInfo,
    	    			sonarUrl:sonarUrl,
    	    			buildEndTime:buildEndTime,
    	    			branchId:branchId,
    	    			sysId:$scope.sysInfo.sysId,
    	    			buildId:buildId,
    	    			newCodeLines:newCodeLines,
    	    			qualityResult:qualityResult,
    	    			jenkinsUrl:jenkinsUrl,
    	    			sysCnname:$scope.sysInfo.sysCnname,
    	    			version:$scope.branchInfo.version,
    	    			isQuaWhite:$scope.isQuaWhite
    	    		});
    			
    			} else {
    				//构建成功
    				buildPackage(sysId, branchId, envType,envName,packageType);
    			}
    		});
        }
        
    	
    	function savePackageQua(sysId,branchId,deployEnv,buildId){
    		var param={
    				sysId:sysId,
    				versionId:branchId,
    				envType:deployEnv,
    				reviewResult:$scope.reviewResult,
    				checkResult:$scope.checkResult,
    				utPassedRate:$scope.utPassedRate,
    				newCoverage:$scope.newCoverage,
    				buildId:buildId
    		}
    		QuaService.savePackageQua(param).then(function (result) {
    		});
    	}
        
        function index(){
        	var params = {branchId: $stateParams.branchId,envParam: $stateParams.envParam,envName:$stateParams.envName};
        	ComponentService.index(params).then(function (result) {
        		if(result != undefined){
        			$scope.revision = result.revision;
        			$scope.branchInfo = result.branchInfo;
        			$scope.sysInfo = result.sysInfo;
        			$scope.envParam = result.envParam;
        			$scope.envName = result.envName;
        			$scope.packageType = result.packageType;
        			$scope.description = result.branchInfo.branchDesc;
        			$scope.hasComponent = result.hasComponent;
        			$scope.title = result.branchInfo.branchName;
        		}
            });
        }
        
        function queryList(pageNumber){
        	
        	 var params = {
		        pageNumber: pageNumber
		      };
        	 if($scope.componentParam.sysEnName != undefined && $scope.componentParam.sysEnName != ""){
        		 params["sysEnName"] = $scope.componentParam.sysEnName;
        	 }
        	 if($scope.componentParam.componentVersion != undefined && $scope.componentParam.componentVersion != ""){
        		 params["componentVersion"] = $scope.componentParam.componentVersion;
        	 }
        	 if($scope.componentParam.appName != undefined && $scope.componentParam.appName != ""){
        		 params["appName"] = $scope.componentParam.appName;
        	 }
        	 if($scope.componentParam.envType != undefined && $scope.componentParam.envType != ""){
        		 params["envType"] = $scope.componentParam.envType;
        	 }
        	 if($scope.componentParam.isDeploy != undefined && $scope.componentParam.isDeploy != ""){
        		 params["isDeploy"] = $scope.componentParam.isDeploy;
        	 }
        	 if($scope.componentParam.deployResult != undefined && $scope.componentParam.deployResult != ""){
        		 params["deployResult"] = $scope.componentParam.deployResult;
        	 }
        	 if($scope.componentParam.createTime != undefined && $scope.componentParam.createTime != ""){
        		 params["createTime"] = $scope.componentParam.createTime;
        	 }
        	 if($scope.newrwUsers.pickingItem != null){
        		 var user = $scope.newrwUsers.pickingItem;
        		 if(user.indexOf("(") != -1){
        			 var pa = /.*\((.*)\)/;
        			 user = user.match(pa)[1];
        		 }
        			
        		 params["componentOperator"] = user;
        	 }
        	 if($scope.componentParam.type=="my"){
        		 params["type"] = $scope.componentParam.type;
        	 }
        	 if($scope.componentParam.revision!=undefined && $scope.componentParam.revision!=""){
        		 params["revision"] = $scope.componentParam.revision;
        	 }
        	 
        	ComponentService.componentList(params).then(function (result) {
        		$scope.pager.totalCount = result.totalDataCount;
    	        $scope.pager.pageNumber = result.pageNumber;
    	        $scope.list = result.datas;
    	        $scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);
    	        if(result.datas!=null && result.datas.length>0){
    	        	$scope.revision = result.datas[0].svnRevision;
    	        	$scope.version = result.datas[0].componentVersion;
    	        	$scope.envType = result.datas[0].envType;
    	        	if(result.hasPermissionMap!=null){
    	        		$scope.hasPermissionMap  = result.hasPermissionMap;
    	        	}
    	        	
    	        }
        	});
        }
        
        function queryDetail(id){
        	var params = {
        			id: id,
        			pageNumber:pager.pageNumber
    		      };
        	ComponentService.componentDetail(params).then(function (result) {
    	        $scope.component = result.componentInfo;
    	        $scope.pageNumber = result.pageNumber;
        	});
        }
        
        //查询
        $scope.search = function () {
        	queryList(0);
		}
        
        $scope.deployStatusChange = function(){
        	if($scope.componentParam.isDeploy==0){
        		$scope.componentParam.deployResult="";
        		$scope.deployResultDisable=true;
        	}else{
        		$scope.deployResultDisable=false;
        	}
        }

        //打包  
        $scope.packageVersion = function (sysId, branchId, deployEnv,envName,packageType) {        	
//        	if($scope.title==""){
//        		AlertService.alert({
//                    title: '提示信息',
//                    content: "请输入构件标题。"
//                });
//        		return false;
//        	}
        	if($scope.description !== null && $scope.description.length>200){
        		AlertService.alert({
                    title: '提示信息',
                    content: "构件描述不能大于200个字符。"
                });
        		return false;
        	}
        	//判断此revision是否打过包
        	ComponentService.checkRevision({branchId:branchId, revision: $scope.revision, envType:deployEnv, envParam:$scope.envName}).then(function (result) {
        		if (result > 0) {
//        			var msg = "当前SVNRevison为【"+$scope.revision+"】的【"+$scope.envParam+"】环境，环境参数【"+$scope.envName+"】的版本【"+$scope.branchInfo.version+"】已有构件，且构件未部署，如再次执行生成构件操作，将会清理之前构件结果。";
//        			var msg = "本分支（分支最后提交SVN版本号："+$scope.revision+"），打包参数：已经生成构件，如果继续 则会清除上一条记录！";
        			var packageEnvparam=$scope.envParam;
        			if(null==packageEnvparam || ""==packageEnvparam){
        				packageEnvparam="无";
        			}
        			var msg = "本分支（分支最后提交SVN版本号："+$scope.revision+"），打包参数：【"
        			if(packageEnvparam == "019"){
        				msg+="集成测试";
        			}else if(packageEnvparam == "020"){
        				msg+="预生产测试";
        			}else if(packageEnvparam == "021"){
        				msg+="生产测试";
        			}else{
        				msg+="本地测试";
        			}
        			
        			msg+="】，已经生成构件。";

        			$scope.type='0';
        			AlertService.confirm({
        				title: "消息提示",
        				content: msg,
        				button1:"取消构件",
        				button2:"查看构件"
    				}).then(function () {
//    					buildCheck(sysId, branchId, deployEnv,envName,packageType);
//    					 DialogService.dismiss('component.componentDialog');
    					 goBack($scope.sysInfo.sysId,$scope.branchInfo.branchId);
    				},function () {
    					$state.go("ComponentListRevision", {
    		        		revision: $scope.revision,
    		        		envType:deployEnv
    		            });
    				});

        		}else{
        			buildCheck(sysId, branchId, deployEnv,envName,packageType);
        		}
        	});
		}
        
        $scope.goBack = function(sysId,branchId){
        	$state.go("VersionInfo", {
        		sysId: sysId,
        		versionId: branchId,
        		vtab:"PackageVersionComponent",
        		packageType:"component"
        			
            });
        }
        
        $scope.goRevisionList = function(revision,envType){
        	$state.go("ComponentListRevision", {
        		revision: revision,
        		envType:envType
            });
        }
        
        $scope.download = function (param) {
        	window.location.href = baseUrl +'/angular/component/download.htm?id='+ param.id+'&appName='+param.appName;
		}
        
        $scope.qrcode = function (param) {
        	DialogService.modal({
                key: "component.qrcodeDialog",
                url: "modules/sncd/templates/component/qrcode.html"
            },{
        		id:param.id,
        		appName:param.appName
            });
		}
        
      //mcs打包
        $scope.mcsDeploy = function(param){
        	$state.go("McsDeploy", {
        		id: param.id,
        		appName:param.appName
            });
        }
        
        $scope.prdAddress = function(){
//        	$scope.canCopy = true;
        	//$scope.prdPath = location.origin + baseUrl+'/index.html#/deploy-prd/' + param.systemId + '/' + param.branchId+'/' + param.envParam;
        	var obj = $scope.addresses;
        	ComponentService.componentAddressSave({branchId:$scope.branchId,evnType:$scope.evnType, jsonPackages:JSON.stringify(obj)}).then(function (result) {
        		$scope.canCopy = true;
        		$scope.prdPath = location.origin + baseUrl+'/index.html#/deploy-prd/'+result+'/'+$scope.branchId;
        	});

        }
        
        $scope.selected = function (componentId,appName) {
        	$scope.addresses[appName]=componentId;
        };
        
        function buildCheck(sysId, branchId, deployEnv,envName,packageType){
        	if (sysId == '12') {
				checkReview(sysId, branchId, deployEnv,envName,packageType);
			} else {
				checkFrozen(sysId, branchId, deployEnv,envName,packageType);
			}
        }
        
        function checkReview(sysId, branchId, deployEnv,envName,packageType){
        	var packFlag = VersionManageService.checkReview({ sysId: sysId, versionId: branchId, envId: deployEnv }).then(function (result) {
				if (result.flag) {
					alert(result.info + ",无法打包！");
					packFlag = false;
					return false;
				} else {
					if (deployEnv == '021') {//生产环境
						checkFrozen(sysId, branchId, deployEnv,envName,packageType);
					} else {
						checkBuild(sysId, branchId, deployEnv,envName,packageType);
					}
				}
			});
        }
        
        function checkFrozen(sysId, branchId, deployEnv,envName,packageType){
        	if (deployEnv == '021') {
	        	var packFlag = VersionManageService.checkFrozen({ versionId: branchId }).then(function (result) {
	    			if (!result.flag) {
							alert("分支状态为未封版，仅封版分支可进行生产发布，请您联系有此分支封版权限的人员，并进行封版测试，测试通过后发布生产。");
							packFlag = false;
							return false;
	    			} else {
	    				checkBuild(sysId, branchId, deployEnv,envName,packageType);
					}
				});
        	}else{
        		checkBuild(sysId, branchId, deployEnv,envName,packageType);
        	}
        }
        
        function checkBuild(sysId, branchId, deployEnv,envName,packageType){
        	VersionManageService.checkBuild({ sysId: sysId }).then(function (result) {
				if (result.flag) {
					buildJobCheck(sysId,branchId,deployEnv,envName,packageType);
				} else {
					alert("此系统有环境正在打包，请稍后再尝试！");
					return false;
				}
			});
        }

        function buildPackage(sysId, branchId, deployEnv,envName,packageType){
        	var packageMsg= "";
        	if (packageType == 'MAVEN') {
        		packageMsg = "平台即将根据您所选择的环境参数自动化打包，请确认构建命令是否正确，如果对此项配置有疑问，请联系技术人员或平台支持人员朱文静(11010068)，继续请按“确定”，否则请按“取消”进行配置检查。";
			} else {
				packageMsg = "平台即将根据您在打包配置页面所设置的环境参数或者工程build.xml文件中的环境参数进行自动化打包，请确认配置是否正确，如果对此项配置有疑问，请联系系统技术负责人或平台支持人员朱文静(11010068)，继续请按“确定”，否则请按“取消”进行配置检查。";
			}
        	if (confirm(packageMsg)) {
				packageVersion(sysId, branchId, deployEnv,envName,packageType);
				
			}
        }
        
        //执行打包
        function packageVersion(sysId, branchId, deployEnv, envName,packageType) {
			var title = $scope.title;
			var desc = $scope.description;
			ComponentService.packageVersion({ sysId: sysId, branchId: branchId, deployEnv: deployEnv, 
				packageType: packageType, title:title, desc:desc ,revision:$scope.revision,envName:envName}).then(function (result) {
					savePackageQua(sysId,branchId,deployEnv,result.bmBuildHis.buildId);
					//跳转至打包地址页
					$scope.goBack(sysId, branchId);
			});
        }

///////////////////Events//////////////////
        //分页
        vm.$on('sn.controls.pager:pageIndexChanged', function (evt, page) { // 分页操作
          evt.stopPropagation();
          pager.pageNumber = page.pageIndex + 1;
          queryList(pager.pageNumber);
        });

      //复制按钮成功的提示信息
        $scope.doSomething = function (envType,envParam,revision,sysId,branchId) {
        	if(envType=="021"){
        		SystemService.getSystemEnv({sysId:sysId}).then(function (result) {
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
        				$stateParams.sysId = sysId;
        				$stateParams.versionId = branchId;
        				DialogService.modal({
        		            key: key,
        		            url: url
        		        },{
        		        	envPrdList:$scope.envPrdList,
        		        	sysId:sysId,
        		        	versionId:branchId,
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
        
        $scope.copyPrdPath = function(prdPath){
        	return prdPath;
        }
        
        $scope.envParamChange=function(){
        	alert($scope.paraInfo);
        } 
        
        $scope.genDeployPackageURL = function genPackageURL(item) {
			if(item.envParam==undefined || item.envParam==""){
				return location.origin + baseUrl +"/index.html#/deploy-prd/"+item.systemId+"/"+item.branchId+"/0/0/"+item.svnRevision;
			}
			return location.origin + baseUrl +"/index.html#/deploy-prd/"+item.systemId+"/"+item.branchId+"/"+item.envParam+"/0/"+item.svnRevision;
		}
        
        $scope.saveDeployReq = function (){
	    	//表单校验
	    	if($scope.packagesShow==false){
	    		$scope.packages = "";
	    	}
	    	//prd检查是否有限制

    		DeployReqManageService.checkPromotion({"envType":"021"}).then(function (data){
				if(data.promotionDeployOpen){
    				var selPackage ="";
					if($scope.packageList!= undefined){
						for(var i = 0;i<$scope.packageList.length;i++){
    		    			if(i==0 || selPackage == ''){
			    				selPackage =  $scope.packageList[i].packageId;	
			    			}else{
			    				selPackage = selPackage + "," + $scope.packageList[i].packageId;	
			    			}
						}
					}

    				DeployReqManageService.checkStaticDeploy({versionId:$scope.branchInfo.branchId, packageId:selPackage}).then(function (data){////检查发布单权限，防止静态发布专员发布war包
    					DeployReqManageService.createDeployReq({versionId:$scope.branchInfo.branchId,envType:"021"}).then(function(result){	
    						$scope.process = result.process;
   		    	        	$scope.version = result.version;
    						$scope.deployTime = result.planTime;
    						$scope.requestor = result.requestor;
    						submitDeployReq();
    					});
    	    		});
				}else{
					alert(data.notifyInfoBo["content"]);
					return false;
				}
    		});
        }
        
      //保存发布单
	    function submitDeployReq(){
	    	$scope.envError='';
	    	$scope.warError  = '';
	    	
	    	var selPackage ="";
			if($scope.packageList!= undefined){
				for(var i = 0;i<$scope.packageList.length;i++){
	    			if(i==0 || selPackage == ''){
	    				selPackage =  $scope.packageList[i].packageId;	
	    			}else{
	    				selPackage = selPackage + "," + $scope.packageList[i].packageId;	
	    			}
				}
			}
	    	
	    	//是否选择了环境
	    	if($scope.envId == null){
	    		$scope.envError = "发布环境不存在!";
	    		return false;
	    	}
	    	
	    	//是否选择了war包
	    	if(selPackage== ''){
	    		$scope.warError = "包不存或丢失!";
	    		return false;
	    	}
	    	
	    	
	    	var deployHis = {
	    		//BmDeplpyHis
	    		branchId : $scope.branchInfo.branchId,
	    		deployPattern :"停启Server",//默认停启server
	    		deployType : "TURN",
	    		envId:$scope.envId,
	    		isFreezen : '0',//默认不封版
	    		orgId :$scope.system.orgId,
	    		packageId:selPackage,
	    		planTime :$scope.deployTime,
	    		requestNo : $scope.process.requestNo,
	    		sysId:$scope.system.sysId,
	    		packageEnvParam:$scope.envParam,
	    		envType:"021"
	    	};
	    	
	    	var process={
	    		applyContent:$scope.requestor+"提交了"+$scope.version.branchName+"发布申请",
	    		processStatus:"009",
	    		processType:"121",
	    		requestNo:$scope.process.requestNo
	    	}
	    	var componentPath = "";
	    	var arrPackages={};
	    	arrPackages["id"]=$scope.id;
	    	arrPackages["ftpPath"]=$scope.ftpPath;
	    	var tempPackages = "";
	    	if($scope.packages!=undefined){
	    		for(var i=0;i<$scope.packages.length;i++){
	    			tempPackages += $scope.packages[i].packageName+",";
	    		}
	    		arrPackages["packages"]=tempPackages;
	    		componentPath = JSON.stringify(arrPackages);
	    	}
	    	DeployReqManageService.saveDeployReq({'deployHis':JSON.stringify(deployHis),'process':JSON.stringify(process),'componentPath':componentPath}).then(function (data){
	    		if("1"==data.deployResult){
					alert("发布队列已满,请稍后手动发布!");
					goVersionDeploy();
				}else if("2"==data.deployResult){
					alert("该环境有其他发布使用,发布单号【"+data.requestNo+"】,请与发布单申请人"+data.userName+"联系！");
					goVersionDeploy();
				}else if("5"==data.deployResult){
					alert("此系统正在打包，请稍后再尝试！");
					goVersionDeploy();
				}else if("3"==data.deployResult){
					goVersionDeploy();
					window.open("deployReq/deploymonitorpage.htm?deployid="+data.deployId);
					
				}else if("4"==data.deployResult){
					alert("已提交至发布配置人员执行资源配置项!");
					goVersionDeploy();
				}else if("ngjboss"==data.deployResult){
					ngJbossPublish(data.deployId,data.deployType);
				}else{
					goVersionDeploy();
				}
	    	});
	    	
	    	function goVersionDeploy(){
	    		$state.go("VersionDeploy",{
        		 sysId:$stateParams.sysId,
        		 versionId:$stateParams.branchId,
        		 vtab:"VersionDeploy"
    			});
	    	}
	    	
	    	function ngJbossPublish(deployId,deployType){
	    		var jumpurl = "http://" + window.location.host + "/udmp-web-in/publish.html#/publish-monitor?deployId="+deployId;
	    		window.location.href = jumpurl;
	    	}

	    }
	    
	    function validFunction(item, option) {
			//去重
			for (var i = 0; i < option.pickedList.length; i++) {
				if (option.pickedList[i] == item) {
					return $q.reject();
				}
			}
			//canDirectInput 为true 验证
			var reg =  /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-（）]*[/(]*[0-9]{0,8}[/)]*$/; 
			if (!reg.test(item)) {
				return $q.reject();
    		} else {
    			 var params = {
    					 "userFullName": item
    			 };
    			 return HomeService.validateUser(params).then(function (result) {
					if (!result.flag) {
						if (null != result.allUsers) {
    		   				 staticDeployer.filterList = deployer.filterList = newrwUsers.filterList = newrUsers.filterList = result.allUsers;
						}
    		   			return $q.reject();
					}
				});
    		}

		}
	    
        
        init();
        return vm;

    }
]);
        	 
angular.module('sncd').filter('inputSplitFilter', function () {
    return function (input) {
    	var words = "";
    	if(input!=undefined && input!=""){
    		var words = input.split(',');
    	}
        return words;
    };
});
