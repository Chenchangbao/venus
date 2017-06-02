angular.module('sncd').controller('SystemInfoCtrl', ['$scope', '$state','$stateParams','SystemService',
    function ($scope, $state, $stateParams,SystemService) {

	
		var tab = $stateParams.tab ;
		if(tab == null){
			tab='SysDetail';
		}
		
	
		$scope.selectedTab = tab;
		
        
        var sysId =  $stateParams.sysId;
    	var params = { sysId: sysId };
        SystemService.sysDetailInfo(params).then(function(result){
		    $scope.sys=result.system;
		    $scope.repos= result.repos;
		    $scope.packageConfig= result.packageConfig;
        });
        
        //获取系统权限
        SystemService.hasPermissionMap({sysId:sysId}).then(function (result){
        	$scope.hasPermissionMap  = result.hasPermissionMap;//授权map
        });
        
        
        
    	$state.go(tab,{tab:tab});
        
        
		$scope.selectTab = function (state){
			$state.go(state,{tab:state});	
			$scope.selectedTab = state;
		}
        
        
    }]);