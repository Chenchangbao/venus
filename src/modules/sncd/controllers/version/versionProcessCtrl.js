angular.module('sncd').controller('VersionProcessCtrl', ['$scope', 'VersionManageService','DeployReqManageService','DialogService','$state','$stateParams','SystemService','QuaService','$timeout',
  function($scope, VersionManageService,DeployReqManageService,DialogService,$state,$stateParams,SystemService,QuaService,$timeout) {
    'use strict';

    var vm = $scope,
      formData = vm.formData = {},
      pager = vm.pager = {
        pageNumber: 1,
        totalCount: 0, //总条数
        pageSize: 10
      },
			//版本的所有状态
			statusList = vm.statusList = [
				{code: '', name: '全部'},
    		{'code': "059", 'name': "开发中"},
    		{'code': "060", 'name': "已封版"},
//    		{'code': "063", 'name': "已合并"},
//    		{'code': "178", 'name': "已废弃"},
//    		{'code': "061", 'name': "PRE封版"},
//    		{'code': "062", 'name': "PRD封版"},
    		{ code: "0591", name:'测试中'}
   ],
	 sysNameList = ["全部"];
    ///////////////////functions//////////////////
    function init() {
			formData.selectedStatus =statusList[0];
			formData.selectedSysName =sysNameList[0];
			querySysNameList();
    	queryMyVersion($scope.pager.pageNumber);
    	   //获取系统权限
         SystemService.hasPermissionMap({sysId:''}).then(function (result){
         	$scope.hasPermissionMap  = result.hasPermissionMap;//授权map
         });
    	
    }
    
		//查询系统名列表
		function querySysNameList(){
//			VersionManageService.getSysNameList().then(function(result){
//				sysNameList = sysNameList.concat(result);
//				vm.sysNameList = sysNameList;
//			});
			SystemService.mySystemNameList().then(function(result){
				sysNameList = sysNameList.concat(result);
				vm.sysNameList = sysNameList;
			});
		}

    // 查询版本列表  methodType:1说明是查询 我的系统页的版本信息
    function queryMyVersion(pageNumber){

      var params = {
        type: 1,
        pageNumber: pageNumber,
        sysName:(formData.selectedSysName||""),
        sysId:(formData.selectedSysName||{}).sysId || $stateParams.sysId || '',
        keyword:$scope.keyword,
        versionStatus: (formData.selectedStatus||{}).code|| $stateParams.status || ''
				// sysName:formData.selectedSysName ||''
      };

      VersionManageService.getMyVersion(params).then(function(result){
        $scope.pager.totalCount = result.totalDataCount;
        $scope.pager.pageNumber = result.pageNumber;
        $scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);

        $scope.userId = result.userId;
        $scope.versList = result.datas;
        $scope.type =  1;
        $scope.operationBoMap = result.operationBoMap;
        $scope.sysId= $stateParams.sysId;
				if($stateParams.status){
					formData.selectedStatus = $stateParams.status;
				}
      });
    }

    
    function buildJobCheck(version,envType,index){
    	QuaService.packageQuaCheck({ sysId:version.sysId,versionId:version.branchId,envType:envType }).then(function (result) {
    		$scope.system=result.system;
    		$scope.sysType=$scope.system.sysType;
    		var vqTrendInfos=result.vqTrendInfos;
    		var codeReviewInfo=result.codeReviewInfo;
    		var sonarUrl =result.sonarUrl;
    		var buildEndTime=result.buildEndTime;
    		var buildId = result.buildId;
    		var newCodeLines=result.newCodeLines;
    		var qualityResult=result.qualityResult;
    		var jenkinsUrl=result.jenkinsUrl;
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
		    					//封板只提示
		    					var systemGrade=$scope.system.systemGrade;
		    					$timeout(function(){confirmFreezen(version,index);})
		    				}
		    			}
		    		},{
		    			vqTrendInfos:vqTrendInfos,
		    			reviewResult:$scope.reviewResult,
		    			envType:envType,
		    			systemGrade:$scope.system.systemGrade,
		    			buildStatus:buildStatus,
    	    			sysName:$scope.system.sysName,
    	    			codeReviewInfo:codeReviewInfo,
    	    			sonarUrl:sonarUrl,
    	    			buildEndTime:buildEndTime,
    	    			branchId:version.branchId,
    	    			sysId:$scope.system.sysId,
    	    			buildId:buildId,
    	    			newCodeLines:newCodeLines,
    	    			qualityResult:qualityResult,
    	    			jenkinsUrl:jenkinsUrl,
    	    			sysCnname:$scope.system.sysCnname,
    	    			version:version.version,
    	    			type:"freezen"
		    		});
				 
				} else {
					//构建成功
					confirmFreezen(version,index);
				}
		});
    }
    
    function confirmFreezen(version,index){
    	if(confirm("封版后所有人员将不能往SVN服务器提交代码\u000d确定要封版吗？")){
    		var params={
    				versionId:version.branchId,
    				sysId:version.sysId,
    				versionUrl:version.branchUrl
    		};
    		
    		VersionManageService.freezenVersion(params).then(function(result){
        		if(result.isFrezenSuc){
        			alert("封版成功!");
        			$scope.versList[index].status = '060';
        		}else{
        			alert("封版失败，请联系朱文静(11010068)!");
        		}
        	})
    	}
    }
    

    
    
    /////////////////$scope functions/////////////////
    $scope.search=function (){
    	queryMyVersion(0);
    }
    
    //旧页面
    $scope.pCSystemJump = function (version) {
        $state.go("PCSystemJump", {
        	href : 'branch/getBranchBySysId.htm?sysId='+version.sysId
        });
    };
    $scope.sAPSystemJump = function (version) {
        $state.go("SAPSystemJump", {
        	href : 'newSystem/sapSystemDetailInfo.htm?sysId='+version.sysId
        });
    };

   
    $scope.validateSysPack=function(sysId,buildId,versionId){
    	var params={
    		sysId:sysId
    	};
    	QuaService.supportCodeBuild(params).then(function(result){
    		$state.go("CodeBuild", {
				  sysId:sysId,
				  buildId:buildId,
				  type:'version'
		      });
    	});
    };
    vm.statusFilter = function(status) {
       formData.selectedStatus = status;
       queryMyVersion(0);
    };
		
		//系统筛选
		vm.sysNameFilter = function(sysName) {
       formData.selectedSysName = sysName;
       queryMyVersion(0);
    };
    ///////////////////Events//////////////////
    //分页
    vm.$on('sn.controls.pager:pageIndexChanged', function(evt, page) { // 分页操作
      evt.stopPropagation();
      pager.pageNumber = page.pageIndex + 1;
      queryMyVersion(pager.pageNumber);
    });

    init();
    
    //封板
    $scope.freezen = function (version,index){
    	if(version.backMerged == '0'){
    		alert("该分支尚未完成代码回合，无法封版。请联系技术负责人或分支技术经理，确认代码回合后，再进行封版操作。");
    		return false;
    	}
    	
    	buildJobCheck(version,"021",index);
    }
    
    
    //确认已回合
    $scope.backMerged = function(version,index){
		if(confirm("请确定已经线下完成该分支的代码回合工作。确认回合后，可对分支进行封版、打包及发布操作。")){
			VersionManageService.backMergedVersion({versionId:version.branchId}).then(function (result){
				if(result.flag){
					alert("确认回合成功!");
					$scope.versList[index].backMerged = '1';
				}else{
					alert("确认回合失败，请联系朱文静(11010068)!");
					return false;
				}
				
			})
		}
	}
    
    //解版
    $scope.unFreezen = function (version){

    	VersionManageService.isBranchHasUnFinishRequest({versionId:version.branchId}).then(function (result){
    		if(result.isHas){
    			alert("此分支有尚未结束的生产发布单【"+result.requestNo+"】，请与申请人【"+result.userName+"】联系,生产单关闭前，不能解版!");
    			return false;
    		}else{//跳转解版页面
    			$state.go("UnfreezenVersion",{sysId:version.sysId,versionId:version.branchId,vtab:'UnfreezenVersion'})
    		}
    	})
    }
    
    //废弃
    $scope.abandonVersion=function (versionId){
    	if(confirm("废弃后，系统将自动关闭该分支，收回分支写权限。确定废弃？")){
    		VersionManageService.abandonVersion({versionId:versionId}).then(function (result){
    			if(result.flag){
    				alert("废弃成功!");
    				// $state.go("VersionFinish");
						init();
    			}else{
    				alert("分支废弃失败，请确认分支路径是否正确，如有疑问，请联系朱文静(11010068)!");
    			}
    		})
    	}
    }
    
    
    //合并分支
    $scope.mergeVersion=function (version){
    	if(confirm("请确认分支内容是否已成功发布到生产，\n如果没有，请成功发布生产后再合并分支。\n分支合并后，将被关闭，不能解版或继续使用，是否仍然需要合并分支?\n如继续执行“合并主干”则点击“确认”，反之则点击“取消”按钮")){
    		DialogService.modal({
                key: "version.mergeVersionInfoDialog",
                url: "modules/sncd/templates/version/merge-version-dialog.html"
            },{
            	version:version,
            	type:"1"
            });
    	}
    }

    //合并分支详情
    $scope.mergeVersionInfo=function (version){
    	DialogService.modal({
            key: "version.mergeVersionInfoDialog",
            url: "modules/sncd/templates/version/merge-version-dialog.html"
        },{
        	version:version,
        	type:"2"
        });
    }
    
    //打包地址
    $scope.packageUrl=function (version){
    	//判断是否配置打包
    	VersionManageService.isPackageConfig({sysId:version.sysId}).then(function (result){
    		if(result.jobName ==''){
    			alert("打包配置未完整，请完成配置！");
    			return false;
    		}else{
    	    	DialogService.modal({
    	            key: "version.packageUrlDialog",
    	            url: "modules/sncd/templates/version/package-url-dialog.html"
    	        },{
    	        	version:version
    	        });
    		}
    		
    	})	
    }

    //类型创建
    $scope.createSimilarVersion = function (sysId,versionId){
    	
    		$state.go("CreateVersion",{
	    		id:sysId,
	    		versionId:versionId
    		})
    	};
  
    $scope.publish =function (envType ,version){
    	//检查是否能够发布
    	DeployReqManageService.checkDeployReq({"versionId":version.branchId}).then(function (result){
    		if(result.result=='4'){
    	    	alert("此分支尚未维护分支发布包信息，请点击分支名称，进入分支基本信息维护发布包，若没有发布包，请联系技术负责人先维护系统发布包配置。");
    	    	return false;
    		}else{
    			if(result.isStaticDeployOnly=='21'){
    				//alert
    				alert("您非发布文员，请联系发布人员进行发布");
    				return false;
    			}else{
    				//仅是静态发布专员
    				if(result.isStaticDeployOnly=='23'){
    					if(result.result=='13'){//有静态包
    						
    					}else{//无静态包
    						
    					}
    				}
    				if(envType == '021'){//生产环境
    					DeployReqManageService.checkPrdDeployReq({versionId:version.branchId,sysId:version.sysId}).then(function(result){
    						if(result.flag){
    							if(result.verifyFlag){//增加豆芽Im发布
    								if(!result.staticDeploy){
    						 			alert("静态发布人员仅能发布静态发布包，请检查分支发布包");
    						 			return false;
    						 		}else{
    						 			//进入发布
    						 			$state.go("CreateDeployReq", {
    	    		         				sysId: version.sysId,
    	    		         				versionId:version.branchId,
    	    		         				envType:envType
    	    		         	        });
    								}
    							}else{
    								alert("无法生产发布，原因如下：\n"+result.message);
    							}
    						}
    					});
    				}else{
    					//进入发布
			 			$state.go("CreateDeployReq", {
	         				versionId:version.branchId,
	         				envType:envType
	         	        });
    				}
    			}
    		}
    	})
    	
    }	
    	
    	
    
    return vm;
  }
]);
