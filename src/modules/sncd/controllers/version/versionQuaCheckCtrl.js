angular.module('sncd')
		.controller('VersionQuaCheckCtrl', ['$scope', '$state','$filter', '$stateParams', 'QuaService','AlertService','SystemService',
			function ($scope, $state,$filter, $stateParams, QuaService,AlertService,SystemService) {

			  var vm = $scope,
		      formData = vm.formData = {},
		      pager = vm.pager = {
		        pageNumber: 1,
		        totalCount: 0, //总条数
		        pageSize: 10
		      }
			  
	 ////////////////functions/////////////////


		 function init() {
		 	//获取我的系统列表
				var sysId =  $stateParams.sysId;
				var versionId =  $stateParams.versionId;
				//获取buildId 根据versionId
				getBuildId(versionId);
			 	var params = {
			 		sysId: sysId,
			 		versionId:versionId,
			 		buildId:$scope.buildId
			 	};
			 	$scope.selectedTab = "unit";
				$scope.selectedTab2 = "sit";
			 	getCheckResult(params);
			 	getSysEnableEnv();
		 }
		 
			  
			  
	    function getBuildId(versionId){
	    	QuaService.getBuildId({"versionId":versionId}).then(function(result){
	    		$scope.buildId=result.buildId;
	    	});
	    }
		function getCheckResult(params,envT){
		    	var anal =$filter("analysisTypeFilter")($scope.selectedTab);
		    	if($scope.selectedTab!='scts' && $scope.selectedTab!="security"){
		    		var envType =$filter("envFilter")($scope.selectedTab2);
		    		params.envType=envType;
		    	}else{
		    		params.envType=envT;
		    	}
		    	params.analysisType=anal;
		    	$scope.analysisType=$scope.selectedTab;
		    	QuaService.getCheckResult(params).then(function(result){
		    		$scope.flag=result.flag;
		    		$scope.message=result.message;
		    		$scope.vqTrendInfos=result.vqTrendInfos;
		    		$scope.deliveryRecords=result.deliveryRecords;
		    		$scope.reportUrl=result.reportUrl;
		    		$scope.deployId=result.deployId;
		    		$scope.result=result.result;
		    	});
		}
		
		function getSysEnableEnv(){
			var params = {
					sysId: $stateParams.sysId
			};
			SystemService.getSysEnableEnv(params).then(function(result){
				$scope.envList=result.envList;
			});
			
		}

	  /////////////////$scope functions/////////////////
		
	   $scope.showCheckResult=function(envId,envType){
		   
		   if(($scope.selectedTab=="scts" ||$scope.selectedTab=="security") && !envId){
				if(null!=$scope.envList && $scope.envList.length>0){
					$scope.selectedTab2=$scope.envList[0].envId;
					envId=$scope.envList[0].envId;
					envType=$scope.envList[0].envType;
					$scope.envName=$scope.envList[0].envName;
				}
			}
	    	var params = {
			 		sysId:  $stateParams.sysId,
			 		versionId:$stateParams.versionId,
			 		buildId:$scope.buildId,
			 		envId:envId
			 	};
	    	getCheckResult(params,envType);
	    };
	    
	    $scope.reCheck=function(){
	    	if($scope.analysisType=='unit'||$scope.analysisType=='staticCheck'){
	    		var params={
	    	    		sysId:$stateParams.sysId
	    	    	};
	    	    	QuaService.supportCodeBuild(params).then(function(result){
	    	    		$state.go("CodeBuild", {
	    					  sysId:$stateParams.sysId,
	    					  buildId:$scope.buildId,
	    					  type:'checkVersion'
	    			      });
	    	    	});
	    	}else{
	    		AlertService.alert({
                    title: "检查失败",
                    content: '功能尚在开发中!'
                }).then(function() {
                	
                });
	    	}
	    };

	    $scope.reCheckST=function(deployId){
	    	if($scope.analysisType=='scts' ||$scope.analysisType=='security'){
	    		var params={
	    	    		deployId:deployId,
	    	    		sysId:$stateParams.sysId,
	    	    		analysisType:$filter("analysisTypeFilter")($scope.analysisType)
	    	    	};
	    		SystemService.reCheckST(params).then(function(result){
	    			$scope.newDeliveryRecord=result.newDeliveryRecord;
	    			$scope.newMessage=result.newMessage;
	    		});
	    	}
	    };

	    //切换分析类型
	    $scope.selectTab = function (tabNo) {
			$scope.selectedTab = tabNo;
			if($scope.selectedTab2=="" && tabNo!='scts' && tabNo!='security' ){
				$scope.selectedTab2 = "sit";
			}
			$scope.newDeliveryRecord=null;
			$scope.newMessage="";
	    };
	    //切换环境类型tab
		$scope.selectTab2 = function (tabNo) {
				$scope.selectedTab2 = tabNo;
				$scope.newDeliveryRecord=null;
				$scope.newMessage="";
		};
	   
		 ///////////////////Events//////////////////
		
		 //获取页面初始化信息
		 init();
		 return vm;
    }
]);