//新建发布单
angular.module('sncd').controller('selectComponentDialogCtrl', ['$scope', 'ComponentService','$state', 'baseUrl','$stateParams','$q','SystemService','DialogService',
    function ($scope, ComponentService,$state, baseUrl,$stateParams,$q,SystemService,DialogService) {

		//页面数据初始化
	    init();
	    var hasValue = false;
	    function  init() {
	    	//数据初始化话
	    	$scope.packages = {};    	
	    	ComponentService.componentAppList({ branchId: $stateParams.versionId,envType: $stateParams.envType,selPackage:$scope.selPackage,envParam:$scope.envParam}).then(function (result) {
	    		$scope.packagesSign=false;
	    		$scope.packageList = result.packages;
	    		if(result.packages.length==1){
	    			$scope.packagesSign=true;
	    		}else{
	    			$scope.packages.item = result.packages[0].packageName;
	    		}
	    		$scope.list = result.list;
    		});
	    }

	    $scope.close = function () {
	    	if(hasValue){
	    		delete $scope.packages["item"];
	    		DialogService.accept('selectComponentDialog',$scope.packages);
	    	}else{
	    		DialogService.accept('selectComponentDialog',null);
	    	}
        };

        $scope.selected = function (componentId,appName,componentPath) {
        	$scope.packages["id"]=componentId;
        	$scope.packages[appName]=componentPath;
        	hasValue = true;
        };
        
        $scope.confirm = function (appName,componentPath) {
        	this.close();
        };
        
        $scope.packageChange = function(){
        	var packageName = $scope.packages.item;
        	ComponentService.componentAppList({ branchId: $stateParams.versionId,envType: $stateParams.envType,packageName:packageName}).then(function (result) {
        		$scope.list = result.list;
    		});
        }
        
        $scope.download = function (param) {
        	window.location.href = baseUrl +'/angular/component/download.htm?id='+ param.id+'&appName='+param.appName;
		}
    }
])