angular.module('sncd').controller('VersionSysCtrl', ['$scope', '$state','$stateParams','SystemService',
    function ($scope, $state, $stateParams,SystemService) {

		
		var selectedTab = $scope.selectedTab || 1;
		var tab = $stateParams.tab ;
		if(tab == null){
			tab=selectedTab;
		}
		
        $scope.selectedTab = tab;
        
        if(tab == 1){
        	$state.go("SysDetail");
        }else if (tab ==2){
        	$state.go('VersionDetail');	
        }else if (tab ==3){
        	
        }else if (tab ==4){
        	$state.go('SystemPackage');	
        }else if (tab ==5){
        	$state.go('PackageConfig');
        }else if(tab ==6){
        	$state.go('SystemEnv');
        }else if(tab ==7){
        	$state.go('SystemTeamDetail');
        }else{
        	$scope.selectedTab = 1;
        	$state.go('SysDetail');	
        }
        
        
        var sysId =  $stateParams.sysId;
    	var params = { sysId: sysId };
        SystemService.sysDetailInfo(params).then(function(result){
		    $scope.sys=result.system;
		    $scope.repos= result.repos;
        });
        
        
        
        $scope.open = function (sysId,type){
        	if(type == '1'){
        		window.open("repository/getReposPermission.htm?sysId="+sysId,'', 'height=800, width=900');
        	}else{
        		window.open("codeRepos/toCreateCodeReposPage.htm?sysId="+sysId,'', 'height=800, width=900');
        	}
        }
        
    }]);