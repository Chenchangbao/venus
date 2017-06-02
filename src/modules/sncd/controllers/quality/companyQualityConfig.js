angular.module('sncd').controller('CompanyQualityConfigCtrl', ['$scope', 'SystemService', 'UserService', '$state', '$stateParams','$timeout', '$filter', 'HomeService', '$q', 'AlertService',
    function ($scope, SystemService, UserService,  $state, $stateParams,$timeout, $filter, HomeService, $q, AlertService) {
		
    function getRoles(){
    	$scope.roles =JSON.parse(sessionStorage.getItem("roles"));
	    if(null==$scope.roles){
	    	 UserService.getUserinfo().then(function(result){
	    	        $scope.roles =result.data.roles;
	    	        sessionStorage.setItem("userName",result.data.userName);
	    	        sessionStorage.setItem("role",result.data.role);
	    	        sessionStorage.setItem("roles",JSON.stringify(result.data.roles));
	    	 });
	    }
	    }
        	
	//点击修改静态指标
	$scope.editStatic = function () {
		$scope.staticEdit = true;
	}
	//修改静态指标
	$scope.changeStatic = function () {
		var params={companyQualityConfigBos : JSON.stringify($scope.companyQualityConfigBos),
				companyQualityConfigBos2 : JSON.stringify($scope.companyQualityConfigBos2),
				companyQualityConfigBos3 : JSON.stringify($scope.companyQualityConfigBos3),
				companyQualityConfigBos4 : JSON.stringify($scope.companyQualityConfigBos4)
		};
		$scope.staticEdit = false;
    	SystemService.saveCompanyQualityConfig(params).then(function(result){
			if(result.errCode == '0'){
				AlertService.alert({
					title: '成功',
					content: "修改成功"
				})
			}else{
				AlertService.alert({
					title: '提示信息',
					content: result.errMsg
			});
			getCQconfig();
			}
		});
	}
	//取消标准修改
	$scope.cancleEdit = function () {
		getCQconfig();
		$scope.staticEdit = false;
	}
		
         
    //获取配置
    function getCQconfig(){
		var params= {
				analysisType : "2799,282,303,300",
				paramType : "1"
		};
		SystemService.getCompanyQualityConfig(params).then(function(result){
			$scope.companyQualityConfigBos = result.companyQualityConfigBos;
			$scope.companyQualityConfigBos2 = result.companyQualityConfigBos2;
			$scope.companyQualityConfigBos3 = result.companyQualityConfigBos3;
			$scope.companyQualityConfigBos4 = result.companyQualityConfigBos4;
		});
//		var params= {
//				analysisType : "282",
//				paramType : "1"
//		};
//		SystemService.getCompanyQualityConfig(params).then(function(result){
//			$scope.companyQualityConfigBos2 = result;
//		});
//		var params= {
//				analysisType : "303",
//				paramType : "1"
//		};
//		SystemService.getCompanyQualityConfig(params).then(function(result){
//			$scope.companyQualityConfigBos3 = result;
//		});
//		var params= {
//				analysisType : "300",
//				paramType : "1"
//		};
//		SystemService.getCompanyQualityConfig(params).then(function(result){
//			$scope.companyQualityConfigBos4 = result;
//		});
    }

	//初始化
	function init() {
		getRoles();
		getCQconfig();
	}
	
	init();
}]);