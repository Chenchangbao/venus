angular.module('sncd').controller('VersionInfoCtrl', ['$scope', '$state','$stateParams','VersionManageService','SystemService',
    function ($scope, $state, $stateParams,VersionManageService,SystemService) {

		
		var vtab = $stateParams.vtab ;
		//切换标签
		$scope.selectTab = function(state){
			$scope.selectedTab = state;
			vtab = $stateParams.vtab = state;
			
			$state.go(state,{vtab:state});
			
		}
		init();
		function init(params) {
			initVersion();
			if(vtab == null){
			vtab='VersionDetail';
			}
			$state.go(vtab,{vtab:vtab});
			$scope.selectedTab = vtab;
		}
		
		function initVersion() {
			//版本详情
	    	var params = { sysId: $stateParams.sysId ,versionId:$stateParams.versionId};
	        VersionManageService.getVersionDetail(params).then(function(result){
	      	  	$scope.version= result.version;
	      	  	var versionStatus = result.version.status;
					
			    //详情应该将权限信息传过来
				$scope.hasPermissionMap = result.version.hasPermissionMap;
				if(result.system.sitCanDeploy != '1'){
					$scope.sitCanDeploy = true;
				}else{
					$scope.sitCanDeploy = false;
				}
				if(result.system.preCanDeploy != '1'){
					$scope.preCanDeploy = true;
				}else{
					$scope.preCanDeploy = false;
				}
				if(result.system.prdCanDeploy != '1'){
					$scope.prdCanDeploy = true;
				}else{
					$scope.prdCanDeploy = false;
				}
				
	      	  	if(versionStatus == '059' || versionStatus == '0591' ||versionStatus == '060') {
	      	  		$scope.isVersionActive = true;
	      	  		if(versionStatus == '060'){
	      	  			$scope.isVersionFreezen = true;
	      	  		}else{
	      	  			$scope.isVersionFreezen = false;
	      	  		}
	      	  	}else{
	      	  		$scope.isVersionActive = false;
	      	  		$scope.isVersionFreezen = false;
	      	  	}
	        });
	        
	    	//系统详情
	        SystemService.sysDetailInfo(params).then(function(result){
			    $scope.sys=result.system;
			    $scope.repos= result.repos;
			    $scope.packageConfig= result.packageConfig;
	        });
	        
		}
		
			
	        /*//获取系统权限
	         SystemService.hasPermissionMap({sysId:$stateParams.sysId}).then(function (result){
	         	$scope.hasSysPermissionMap  = result.hasPermissionMap;//授权map
	         });*/
	        
	       
    }]);