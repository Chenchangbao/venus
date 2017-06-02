angular.module('sncd').controller('VersionTabCtrl', ['$scope', '$state','$stateParams','VersionManageService','SystemService',
    function ($scope, $state, $stateParams,VersionManageService,SystemService) {


		var vtab = $stateParams.vtab ;
		if(vtab == null){
			vtab='VersionProcess';
		}
		
		$state.go(vtab,{vtab:vtab});
		$scope.selectedTab = vtab;
		
		
	        
	        //切换标签
	        $scope.selectTab = function(state){
	            $scope.selectedTab = state;
	            vtab = $stateParams.vtab = state;
	            
	            $state.go(state,{vtab:state});
	        }
    }]);