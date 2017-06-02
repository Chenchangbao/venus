angular.module('sncd').controller('publishDialogCtrl', ['$scope', 'DialogService','$timeout',"baseUrl","$location",
    function ($scope, DialogService,$timeout,baseUrl,$location) {

        $scope.viewData = {}

        $scope.deployResult=150;
        $scope.coments="";
        $scope.close = function () {
            DialogService.dismiss('deploy.deployOver');
        };
        
        $scope.closeSuccess = function () {
            DialogService.dismiss('deploy.success');
            window.location.reload();
        };
        
        //页面数据初始化
        init();
        
        function init() {
        	
        }
        
        $scope.deployOver = function(){
        	var coments = $scope.coments;
        	if(coments.length == 0){
        		alert("请填写备注信息!");
        		return false;
        	}
        	
        	if(coments.length>200){
        		alert("备注字数请控制在200个字符以内!");
        		return false;
        	}
        	if($scope.deployResult!="150"
        		|| $scope.deployResult!="151"
        		|| $scope.deployResult!="152"){
        		$scope.deployResult = 150;
        	}
        	
        	var data = {
                    "coments" :coments,
                    "deployResult": $scope.deployResult
                };
        	
        	DialogService.accept('deploy.deployOver',data);
        }
        
    }
])
