
angular.module('sncd').controller('packageQuaCheckCtrl', ['$scope', 'QuaService', 'DialogService','$timeout','$stateParams','HomeService','AlertService','baseUrl','$location',
    function ($scope, QuaService, DialogService,$timeout,$stateParams,HomeService,AlertService,baseUrl,$location) {
	
		$scope.continuePack=1;
        $scope.close = function () {
            DialogService.dismiss('package.packageQuaCheck');
        };
        
        
	    $scope.continueBuild=function(){
	    	DialogService.accept('package.packageQuaCheck',{
	    		continuePack:$scope.continuePack
	    	});
	    };
    }
]);