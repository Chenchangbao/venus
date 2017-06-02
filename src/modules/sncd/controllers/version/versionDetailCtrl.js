angular.module('sncd').controller('VersionDetailCtrl', ['$scope', 'VersionManageService','$state','$stateParams','$filter','HomeService','AlertService','QuaService','DialogService','$timeout',
  function($scope, VersionManageService,$state,$stateParams,$filter,HomeService,AlertService,QuaService,DialogService,$timeout) {
    'use strict';

    ///////////////////functions//////////////////
    var userData = $scope.postData={
    		selectPackage:"",
        	rUser:"",
        	oldrUser:"",
        	rwUser:"",
        	oldrwUser:"",
        	versionCmo:'',
        	techManager:'',
        	testManager:''
        },
    dateFormat = 'yyyy-MM-dd';//时间格式
    $scope.userLable=[{
            	name:"版本CMO",
            	model:userData.versionCmo
               },
               {
            	 name:"技术经理",
            	 model:userData.techManager
               },{
            	   name:"测试经理",
            	   model:userData.testManager
               }];
    
    
    
    
    function init() {
    	getVersionDetail();
    	
    	$scope.type="show";
    	HomeService.getCurentUserId().then(function(result){
    		$scope.curentuserid=result.userid;
    	});
    	//获取用户数据
    	HomeService.getAllUsers().then(function(result){
            $scope.userList = result.allUsers;
          });
    }

    // 查询版本信息
    function getVersionDetail(){

      var params = {
        versionId:$stateParams.versionId,
        sysId:$stateParams.sysId
      };

      VersionManageService.getVersionDetail(params).then(function(result){
    	  $scope.version= result.version;
    	  
    	  $scope.system = result.system;
//    	  $scope.userName = result.userName;
    	  $scope.isDependSystem = result.isDependSystem;
    	  
    	  $scope.free=true;
    	  $scope.abando=true;
    	  $scope.backM=true;
      });
    }

    function buildJobCheck(version,envType){
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
		    					$timeout(function(){confirmFreezen(version);})
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
					confirmFreezen(version);
				}
		});
    }
    
    function confirmFreezen(version){
    	if(confirm("封版后所有人员将不能往SVN服务器提交代码\u000d确定要封版吗？")){
    		var params={
    				versionId:version.branchId,
    				sysId:version.sysId,
    				versionUrl:version.branchUrl
    		};
    		
    		VersionManageService.freezenVersion(params).then(function(result){
        		if(result.isFrezenSuc){
        			alert("封版成功!");
        			$scope.free=false;
        		}else{
        			alert("封版失败，请联系朱文静(11010068)!");
        		}
        	});
    	}
    }
    
    
    /////////////////$scope functions/////////////////

  //复制按钮的相关方法

    $scope.doSomething = function (){
    	
    	alert("复制成功！");
    };
  
    $scope.jumpOld = function (version){
    	//window.open("branch/branchBasicInfo.htm?branchId="+version.branchId);
    	window.open("branch/jumpBranchDetailInfo.htm?branchId="+version.branchId+"&sysId="+version.sysId);
    };

    $scope.editVersion = function (){
    	$scope.type = 'edit';
    	
    	
    	
    	var sysPackageList =  $scope.version.sysPackageList;
    	var deployPackages  =  $scope.version.deployPackages;
    	if(sysPackageList !=null && sysPackageList !='' && deployPackages !=null && deployPackages != ''){
    		var selectpackages = deployPackages.split(",");
        	for(var i = 0; i < sysPackageList.length; i++){
        		if(selectpackages.indexOf(sysPackageList[i].packageId+"") >= 0){
        			sysPackageList[i].selectPackage = true;
        		}else{
        			sysPackageList[i].selectPackage = false;
        		}
            }
    	}
    	
    	var postData =  $scope.postData  = {};
    	postData.sysPackageList = sysPackageList;
    	postData.techManager = $scope.version.techManager;
    	postData.testManager = $scope.version.testManager;
    	postData.versionCmo = $scope.version.versionCmo;
    	postData.branchDesc = $scope.version.branchDesc;
    	postData.version = $scope.version.version;
    	postData.branchName = $scope.version.branchName;
    	postData.branchId =$scope.version.branchId;
    	postData.planId = $scope.version.planId;
    	var model = {value:$scope.version.versionCmo};
    	$scope.userLable[0].model =model ;
    	model = {value:$scope.version.techManager};
    	$scope.userLable[1].model =model ;
    	model  =   {value:$scope.version.testManager};
    	$scope.userLable[2].model =model ;
    }

    
    //更新分支信息
    $scope.updateVersion = function (invalid){
    	if(invalid){
    		return false;
    	}
    	
    	var deployPackages = "";
    	var sysPackageList = $scope.postData.sysPackageList ;
    	if(sysPackageList!=null && sysPackageList!=''){
    		for(var i = 0;i<sysPackageList.length ;i++){
    			if(sysPackageList[i].selectPackage){
    				if(deployPackages == ''){
    					deployPackages =sysPackageList[i].packageId; 
    				}else{
    					deployPackages  = deployPackages+","+ sysPackageList[i].packageId;
    				}
    			}
    		}
    	}
    	$scope.postData.deployPackages = deployPackages;
    	
			$scope.version.deployProcess.forEach(function (obj) {
				obj.date = $filter('date')(obj.date, dateFormat) || '';
				obj.endDate = obj.date;
			})
    	$scope.postData.deployProcess = $scope.version.deployProcess;
    	// $scope.postData.techManager =  $scope.userLable[1].model.value;
    	// $scope.postData.testManager =  $scope.userLable[2].model.value;
    	// $scope.postData.versionCmo = $scope.userLable[0].model.value;
    	
    	var params = {
    		versionInfo: JSON.stringify($scope.postData),
    		deployProcess: JSON.stringify($scope.postData.deployProcess)
    	};
    	VersionManageService.updateVersionDetail(params).then(function (){
    		AlertService.alert({
                title: "更新成功",
                content: '更新版本基本信息成功!'
            }).then(function() {
            	init();
            });
    		
    	});
    		
    	
    	
    	
    	
    	
    }
    init();
 	$scope.$watch('ls', function(newVal){
		 console.log(newVal);
	 });
    
    //选人控件
    //鼠标点击选择下拉用户
    $scope.selectUser = function(user,index){
    	if($scope.step == '4'){
    		$scope.reviewerAndDevelopersBoList[index].reviewer.fullName = user;
        	$scope.reviewerAndDevelopersBoList[index].reviewer.userName = user.substring(user.length - 10).substring(1, 9);
    	}else{
    		$scope.userLable[index].model.value = user;	
    	}
    };
      
    
    $scope.queryByUser = function(index){
    	var reg =  /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-（）]*[/(]?[0-9]{0,8}[/)]?$/; 
    	if($scope.step == '4'){
    		if(!reg.test($scope.reviewerAndDevelopersBoList[index].reviewer.fullName)){
    			$scope.reviewerAndDevelopersBoList[index].reviewer.fullName=null;
    		}
    	}else{
    		if(!reg.test($scope.userLable[index].model.value)){
    			$scope.userLable[index].model.value=null;
    		}
    	}
    };
    
    $scope.getUser = function(index){
    	var reg = /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-\u4E00-\u9FA5\uF900-\uFA2D（）]*[/(]*[0-9]{0,8}[/)]*$/;
    	 
		 if($scope.userLable[index].model.value== null || $scope.userLable[index].model.value ==''||!reg.test($scope.userLable[index].model.value)){
     		$scope.userLable[index].model.value=null;
 		}else{
 			 var params ={
 					 "userFullName":$scope.userLable[index].model.value
 			 };
 			 HomeService.validateUser(params).then(function(result){
		   		 if(!result.flag){
		   			 if(null!=result.allUsers){
		   				 $scope.userList = result.allUsers;
		   			 }
		   		 }
	         });
 		}
	 
    };
   
    
    
    $scope.goBack=function (){
    	$scope.type ='show';
    }
    
    //封板
    $scope.freezen = function (version){
    	if(version.backMerged == '0'){
    		alert("该分支尚未完成代码回合，无法封版。请联系技术负责人，确认代码回合后，再进行封版操作。");
    		return false;
    	}
    	buildJobCheck(version,"021");
    };
    
    
    //废弃
    $scope.abandonVersion=function (versionId){
    	if(confirm("废弃后，系统将自动关闭该分支，收回分支写权限。确定废弃？")){
    		VersionManageService.abandonVersion({versionId:versionId}).then(function (result){
    			if(result.flag){
    				alert("废弃成功!");
    				$scope.abandon=false;
    				// $state.go("VersionFinish");
						init();
    			}else{
    				alert("分支废弃失败，请确认分支路径是否正确，如有疑问，请联系朱文静(11010068)!");
    			}
    		})
    	}
    };
    
  //确认已回合
    $scope.backMerged = function(version){
		if(confirm("请确定已经线下完成该分支的代码回合工作。确认回合后，可对分支进行封版、打包及发布操作。")){
			VersionManageService.backMergedVersion({versionId:version.branchId}).then(function (result){
				if(result.flag){
					alert("确认回合成功!");
					$scope.backM=false;
				}else{
					alert("确认回合失败，请联系朱文静(11010068)!");
					return false;
				}
				
			})
		}
	};
	//管理员手动合并
	$scope.adminMerge = function(version){
		if(confirm("请确定管理员陈玉(11076994)已经线下完成该分支的代码合并工作！")){
			var params={
					versionId:version.branchId,
					sysId:version.sysId,
					branchUrl: version.branchUrl
			};
			VersionManageService.AdminMerge(params).then(function (result){
				if(result.flag){
					alert("关闭已合并分支成功!");
					$scope.backM=false;
				}else{
					alert("关闭已合并分支失败!");
					return false;
				}
				
			})
		}
	};
}

]);
