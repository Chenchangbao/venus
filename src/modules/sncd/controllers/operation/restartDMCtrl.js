//新建发布单
angular.module('sncd').controller('RestartCtrl', ['$scope', '$filter', 'OperationManageService','DialogService','AlertService','$state', '$timeout','$stateParams',
    function ($scope, $filter, OperationManageService,DialogService,AlertService,$state,$timeout, $stateParams) {

		var dmId;
		var params = {};
		var restartEnd = false;
		//页面数据初始化
	    init();
	    function  init() {
	    	dmId = $scope.id;
	    	params["dmId"]=dmId;
	    	getConsole();
	    	updateClock();
	    }
	    
	    $scope.restartDM = function (){
//	    	AlertService.confirm({
//				title: "消息提示",
//				content: "是否确认重启集群",
//				button1:"确认",
//				button2:"取消"
//			}).then(function () {
				$scope.isCanRestart = false;
		    	var restartParams = {
					appServerType:$scope.appServerType,
					dmId:$scope.id,
					deployType:$scope.wasType
				};
		    	
		    	OperationManageService.restartDM(restartParams).then(function(result){
		    		$scope.logMsg = result.msg;
		    		restartEnd = true;
				});
//			});
	    }
	    
	    $scope.restartDMStop = function (){
	    	var restartParams = {
					dmId:$scope.id
				};
	    	OperationManageService.restartDMStop(restartParams).then(function(result){
	    		$scope.isCanRestart = true;
			});
	    	
	    }
	    
	    $scope.close = function () {
            DialogService.dismiss('operation.restartDM');
        };
        
        function updateClock(){
        	
        	if(restartEnd == false){
        		$timeout(function(){
    				getConsole();
    				updateClock();
    			},3000);
        	}else{
        		//最后执行一次
        		getConsole();
        	}
        }
        
        function getConsole(){
        	OperationManageService.getConsole(params).then(function(result){
        		$scope.logMsg = result.msg;
        		$scope.isCanRestart = result.isCanRestart;
    		});
        };
    }
]);