
angular.module('sncd').controller('deliveryCheckCtrl', ['$scope', 'QuaService', 'DialogService','$timeout','$stateParams','HomeService','AlertService','baseUrl','$location',
    function ($scope, QuaService, DialogService,$timeout,$stateParams,HomeService,AlertService,baseUrl,$location) {
	
		$scope.continueDep=1;
        $scope.close = function () {
            DialogService.dismiss('deploy.deliveryCheck');
        };
	    $scope.saveDeComments=function(invalid,commentsInfo){
	    	if(invalid){
				return;
	    	}
	    	var deployNo=$scope.deployNo;
	    	if($scope.continueDep==1){
		    	var params={
		    			deployNo:deployNo,
		    			comments:""
		    			//comments:this.deliveryCheckForm.commentsInfo.$$rawModelValue
		    	};
		    	QuaService.updateDelivery(params);
	    	}
	    	DialogService.accept('deploy.deliveryCheck',{
	    		continueDep:$scope.continueDep
	    	});
	    };
    }
]);