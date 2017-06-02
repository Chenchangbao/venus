//系统应用包controller
angular.module('sncd').controller('SystemEnvCtrl', ['$scope', 'SystemService','$state','$stateParams',
  function($scope, SystemService,$state,$stateParams) {
	'use strict';
    
    ///////////////////functions//////////////////
    function init() {
    	var sysId =  $stateParams.sysId;
    	var params = { sysId: sysId };
    	getSystemEnv(params,'019');
    	
    	$scope.selectedTab='1';
    }
    

    // 查询系统
    function getSystemEnv(params,envType){
    	SystemService.getSystemEnv(params).then(function(result){
    		  $scope.system=result.system;
    		  var envList = result.envList;
    		  if(envList!=null && envList.length > 0 ){
    			  var showEnvList =  new Array();
        		  
        		  for(var i=0;i<envList.length ;i++){
        			  if(envList[i].envType == envType){
        				  showEnvList.push(envList[i]);
        			  }
        		  }
        		  $scope.envList =showEnvList;
        		  
        		  if(showEnvList.length > 0 ){
        		    //获取SIT环境具体信息
            		  SystemService.showDmConfigByEnvId({envId:showEnvList[0].envId}).then(function (data){
            			  	$scope.appServerType = showEnvList[0].appServerType;
            		        $scope.dmList = data.dmList;
            		        $scope.projectGroupPackageInfoList = data.projectGroupPackageInfoList;
            		  })
            		  $scope.message='';
        		  }else{//无环境
        			$scope.dmList = '';
      		        $scope.projectGroupPackageInfoList = "";
      		        $scope.message="您的系统暂未维护"+getEnvName(envType)+"环境！";
        		  }
    		  }else{
    			  $scope.dmList = '';
    		        $scope.projectGroupPackageInfoList = "";
    		        $scope.message="您的系统暂未维护"+getEnvName(envType)+"环境！";
    		  }
      });
    }
    
    function getEnvName(envType){
    	if(envType == '019'){
    		return "集成测试";
    	}else if(envType == '020'){
    		return "预生产";
    	}else if(envType == '021'){
    		return "生产";
    	}else if(envType == '171'){
    		return "本地测试";
    	}
    }
    
    
    $scope.showDMConfig = function (envId,appServerType){
    	 SystemService.showDmConfigByEnvId({envId:envId}).then(function (data){
			  	$scope.appServerType = appServerType;
		        $scope.dmList = data.dmList;
		        $scope.projectGroupPackageInfoList = data.projectGroupPackageInfoList;
		  })
    }
    
    
    $scope.showEnvConfig = function (envType){
    	getSystemEnv({ sysId:  $stateParams.sysId },envType);
    }
    init();

  }
]);
