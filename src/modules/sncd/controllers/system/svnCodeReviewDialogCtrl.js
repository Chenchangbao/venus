
angular.module('sncd').controller('svnCodeReviewDialogCtrl', ['$scope', 'SystemService', 'DialogService','$timeout','$stateParams','HomeService','AlertService','baseUrl','$location',
    function ($scope, SystemService, DialogService,$timeout,$stateParams,HomeService,AlertService,baseUrl,$location) {
	

        $scope.close = function () {
            DialogService.dismiss('system.svnCodeReivew');
        };


        //页面数据初始化
        init();
        
        function  init() {
        	$scope.reviewStatus="GREEN";
        	$scope.submit=false;
        };
        
        $scope.commitReviewResult=function(invalid){
	    	
	    	if(invalid && $scope.reviewStatus == 'RED' ){
	    		swal({   title: "必填项不能为空!",   text: "本提示会在2秒内关闭.",   timer: 2000 });
				return;
	    	}
	    	var params={
	    			"reviewStatus": $scope.reviewStatus,
	    			"reviewLog": $scope.reviewLog,
	    			"reviewIdList": $scope.reivewId
	    	};
	    	$scope.submit=true;
	    	SystemService.updateReviewResult(params).then(
	    	  function(result){
	    		if(result.isSuc){
	    			alert("评审成功！");
	    			DialogService.accept('system.svnCodeReivew');
	    		}else{
	    			$scope.submit=false;
	    			alert("提交失败,本次评审失败!");
	    		}
	    		
	    	});
	   };
    }
]);