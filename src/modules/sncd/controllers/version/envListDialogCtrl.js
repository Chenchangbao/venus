
angular.module('sncd').controller('EnvListDialogCtrl', ['$scope','$stateParams', 'DialogService','$timeout',"baseUrl","$location",
    function ($scope,$stateParams, DialogService,$timeout,baseUrl,$location) {

        $scope.close = function () {
            DialogService.dismiss('envlist.Dialog');
        };
        $scope.deployClose = function () {
            DialogService.dismiss('envDeploy.Dialog');
        };

        //页面数据初始化
        init();
        function  init() {
        	if($stateParams.sysId!=null){
        		$scope.sysId = $stateParams.sysId;
        	}
        	if($stateParams.versionId){
        		$scope.versionId = $stateParams.versionId;
        	}
        	
        }

        $scope.envChange = function(){
        	if($scope.envId==""){
        		alert("请选择环境");
        	}else{
        		$scope.envPrdPath=window.location.origin+baseUrl+"/index.html#/packageVersion/"+$scope.sysId+"/"+$scope.versionId+"/021/"+$scope.envPrdParam+"/"+$scope.envId;
        	}
        }
        $scope.envDeployChange = function(){
        	if($scope.envId==""){
        		alert("请选择环境");
        	}else{
        		$scope.envDeployPrdPath=window.location.origin+baseUrl+"/index.html#/deploy-prd/"+$scope.sysId+"/"+$scope.versionId+"/"+$scope.envPrdParam+"/"+$scope.envId+"/"+$scope.revision;
        	}
        }
        $scope.genPackageURL = function genPackageURL(item) {
			return $scope.envPrdPath;
		}
        $scope.genDeployPackageURL = function genDeployPackageURL(item) {
			return $scope.envDeployPrdPath;
		}
        $scope.clipCopyPath = function(){
        	$scope.close();
        	alert("复制成功");
        }
        $scope.clipCopyDeployPath = function(){
        	$scope.deployClose();
        	alert("复制成功");
        }
    }
])