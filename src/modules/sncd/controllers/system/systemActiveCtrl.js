
angular.module('sncd').controller('SystemActiveCtrl', ['$scope', 'SystemService', 'DialogService','$timeout',"baseUrl","$location",
    function ($scope, SystemService, DialogService,$timeout,baseUrl,$location) {

        $scope.viewData = {}

        $scope.close = function () {
            DialogService.dismiss('system.systemActiveDialog');
        };


        //页面数据初始化
        init();
        
        function  init() {
        	
        	SystemService.activeSysInit().then(function (result){
        		$scope.devTechList = result.devTechList;
        		$scope.devFwList = result.devFwList;
        		$scope.step = '1';
        		$scope.sapSysEnv = "";
        		
        		SystemService.sysDetailInfo({"sysId":$scope.sysId}).then(function(result){
        		    $scope.system=result.system;
        		});
        	})
        }
        
        
        //进入下一步
        $scope.nextStep =function (invalid){
        	if(invalid){
        		return false;
        	}
        	$scope.step = '2';
        }
        
        
        
        $scope.activeSystem = function (invalid){
        	
        	if(invalid){
        		return false;
        	}

        	var devTech = $scope.devTech;
        	var sysCmo = $scope.sysCmo;
        	var devFw = $scope.devFw;
        	var sapSysEnv = $scope.sapSysEnv;
        	var params={
        			sysId:$scope.sysId,
        			devTech:devTech,
        			sysCmo:sysCmo,
        			devFw:devFw,
        			sapSysEnv:JSON.stringify(sapSysEnv) 
        	};
        	
        	SystemService.saveActiveSys(params).then(function (result){
        		alert("激活成功!");
        		location.reload();
        	})
        	
        }
    }
])