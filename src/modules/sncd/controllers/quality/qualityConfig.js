angular.module('sncd').controller('QualityConfigCtrl', ['$scope', 'SystemService', 'UserService', '$state', '$stateParams','$timeout', '$filter', 'HomeService', '$q', 'AlertService',
    function ($scope, SystemService, UserService, $state, $stateParams,$timeout, $filter, HomeService, $q, AlertService) {

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

	$scope.selectedTab = '1';
	
//	$scope.option_array = [
//			           		{"key" : "中台研发中心"            ,"value" : "1002"},
//			           		{"key" : "大数据中心"              ,"value" : "1007"},
//			           		{"key" : "互联网门店研发中心"      ,"value" : "1009"},
//			           		{"key" : "家庭互联网研发中心"      ,"value" : "1011"},
//			           		{"key" : "开放平台研发中心"        ,"value" : "1012"},
//			           		{"key" : "北京分部"                ,"value" : "1013"},
//			           		{"key" : "物流研发中心"            ,"value" : "1014"},
//			           		{"key" : "虚拟运营商研发中心"      ,"value" : "1015"},
//			           		{"key" : "支付产品管理中心"        ,"value" : "1016"},
//			           		{"key" : "信息管理中心"            ,"value" : "1017"},
//			           		{"key" : "金融公司"                ,"value" : "1018"},
//			           		{"key" : "消费者平台研发中心"      ,"value" : "3001"},
//			           		{"key" : "供应商及商户平台研发中心","value" : "3002"},
//			           		{"key" : "员工平台研发中心"        ,"value" : "3003"},
//			           		{"key" : "后台服务研发中心"        ,"value" : "3005"},
//			           		{"key" : "数据中心"                ,"value" : "3006"},
//			           		{"key" : "广告及搜索研发中心"      ,"value" : "3008"},
//			           		{"key" : "北研-消费者北京研发中心" ,"value" : "3009"},
//			           		{"key" : "北研-搜索北京研发中心"   ,"value" : "3011"},
//			           		{"key" : "金融研发中心"            ,"value" : "3012"},
//			           		{"key" : "金融账务核心产品中心"    ,"value" : "3014"},
//			           		{"key" : "清结算中心"              ,"value" : "3015"},
//			           		{"key" : "风险管理中心"            ,"value" : "3016"},
//			           		{"key" : "美国硅谷研究院"          ,"value" : "3017"},
//			           		{"key" : "消费金融公司"            ,"value" : "3021"},
//			           		{"key" : "置业研发中心"            ,"value" : "3024"},
//			           		{"key" : "金服集团大数据中心"      ,"value" : "3025"},
//			           		{"key" : "云事业部"                ,"value" : "3026"},
//			           		{"key" : "创新产品研发中心"        ,"value" : "3027"},
//		];

/*	//切换SIT,PRE,PRD
	$scope.selectTab = function (tabNo) {
		$scope.selectedTab = tabNo;
	}
*/	
	//代码静态检查SIT
	//点击修改静态指标
	$scope.editStatic = function () {
		$scope.staticEdit = true;
	}
	//修改静态指标
	$scope.changeStatic = function (current_option) {
		var params={centerConfigs : JSON.stringify($scope.centerQualityConfigBos),
				centerConfigs2 : JSON.stringify($scope.centerQualityConfigBos2),
				centerConfigs3 : JSON.stringify($scope.centerQualityConfigBos3),
				centerConfigs4 : JSON.stringify($scope.centerQualityConfigBos4)};
		$scope.staticEdit = false;
    	SystemService.saveCenterQualityConfig(params).then(function(result){
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
				$scope.getCQconfig(current_option);
			}
		});
	}
	//取消标准修改
	$scope.cancleEdit = function (current_option) {
		$scope.staticEdit = false;
		$scope.getCQconfig(current_option);
	}
	

	
	//获取配置
	$scope.getCQconfig = function(current_option){

		$scope.getCenterConfig1(current_option);
//		$scope.getCenterConfig2(current_option);
//		$scope.getCenterConfig3(current_option);
//		getCenterConfig4(current_option);
		$scope.staticEdit = false;
    }
		
	$scope.getCenterConfig1 = function(current_option){
		var params= {
				analysisType : "2799,282,303,300",
				orgId : current_option,
				paramType : "1"
		};
		SystemService.getCenterQualityConfig(params).then(function(result){
			$scope.centerQualityConfigBos = result.centerQualityConfigBos;
			$scope.centerQualityConfigBos2 = result.centerQualityConfigBos2;
			$scope.centerQualityConfigBos3 = result.centerQualityConfigBos3;
			$scope.centerQualityConfigBos4 = result.centerQualityConfigBos4;
		});		
	}
//	$scope.getCenterConfig2 = function(current_option){
//		var params= {
//				analysisType : "282",
//				orgId : current_option.value,
//				paramType : "1"
//		};
//		SystemService.getCenterQualityConfig(params).then(function(result){
//			$scope.centerQualityConfigBos2 = result.centerQualityConfigBos;
//		});
//	}
//	$scope.getCenterConfig3=function (current_option){
//		var params= {
//				analysisType : "303",
//				orgId : current_option.value,
//				paramType : "1"
//		};
//		SystemService.getCenterQualityConfig(params).then(function(result){
//			$scope.centerQualityConfigBos3 = result.centerQualityConfigBos;
//		});
//	}
//	function getCenterConfig4(current_option){
//		var params= {
//				analysisType : "300",
//				orgId : current_option.value,
//				paramType : "1"
//		};
//		SystemService.getCenterQualityConfig(params).then(function(result){
//			$scope.centerQualityConfigBos4 = result.centerQualityConfigBos;
//		});
//	}
	
	function init() {
		getRoles();
		SystemService.getOrgList().then(function (result) {
            $scope.orgs = result;
        });
	}
	init();
}]);