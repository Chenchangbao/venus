//系统应用包controller
angular.module('sncd').controller('SystemBuildConfigCtrl', ['$scope', 'SystemService', '$filter', '$state', '$stateParams', 'HomeService','VersionManageService' ,'AlertService',
  function ($scope, SystemService, $filter, $state, $stateParams, HomeService,VersionManageService,AlertService) {
		'use strict';
		var vm = $scope,
				selectedTab = vm.selectedTab = 2,
				isOpen = vm.isOpen = 1,
			    sysId  =  $stateParams.sysId,
				referVersionId = '',
				referBuildTime = '',
				baseLines = vm.baseLines = [],
				dateFormat = 'yyyy-MM-dd',//时间格式
				temp = [];
				vm.edit = true;
				vm.buildTimeDate={};
///////////////////functions//////////////////

	

		function init() {
			queryVersionList();
			versionJob();
			getSystemQualityConfig1();
//			getSystemQualityConfig2();
//			getSystemQualityConfig3();
//			getSystemQualityConfig4();
			
			getSysEnableEnv();
		}
		
		
		//获取版本名称列表
		function queryVersionList() {
			var param = {sysId: sysId};
			SystemService.queryVersionList(param).then(function (result) {
				vm.versionList = result;
			})
		}
		
	 //根据版本获取基线列表
		vm.queryBaseLineByVersion = function (version) {
			var param = {versionId: version.branchId};
			SystemService.queryBaseLineByVersion(param).then(function (result) {
				vm.baseLines = result;
			})
		}
		//根据时间获取基线列表
		function getQBaseLineByBuildTime() {
			var buildTime = $filter('date')(vm.buildTimeDate.buildTime, dateFormat) || '';
			var param = {sysId: sysId,buildTime: buildTime};
			SystemService.getQBaseLineByBuildTime(param).then(function (result) {
				if(result.flag){
					vm.baseLines = result.baseLines;
				}else{
					AlertService.confirm({
                title: "确认",
                content: result.message
            }).then(function() {
            	vm.baseLines = result.baseLines;
							vm.buildTimeDate.buildTime = result.realBuildTime;
            });
				}
				
			})
		}
		
		function versionJob() {
			var param = {sysId: sysId};
			//获取基线列表
			SystemService.versionJob(param).then(function(result){
				var majoronCount=0;
				var k=0;
				var majoron = null;
				var majoronP = null;
				var codeLines = 0;
				for(var i=0;i<result.baseLines.length;i++){
					if(result.baseLines[i].paramKey=="BLOCKER_VIOLATIONS"
						|| result.baseLines[i].paramKey=="CRITICAL_VIOLATIONS"
						|| result.baseLines[i].paramKey=="MAJOR_VIOLATIONS"){
						majoronCount+=Number(result.baseLines[i].paramValue);
						k++;
					}
					if(result.baseLines[i].paramKey=="MAJORON_VIOLATIONS"){
						majoron = result.baseLines[i];
						result.baseLines[i].disabled = true;
						k++;
					}
					if(result.baseLines[i].paramKey=="CODE_LINES"){
						codeLines=result.baseLines[i].paramValue;
					}
					if(result.baseLines[i].paramKey=="MAJORON_VIOLATIONS_PERMILLAGE"){
						majoronP = result.baseLines[i];
						result.baseLines[i].disabled = true;
						k++;
					}
					if(k==5){
						break;
					}
				}
				majoron.paramValue = majoronCount;
				k=0;
				
				
				for(var i=0;i<result.baseLines.length;i++){
					
					if(result.baseLines[i].disabled==undefined){
						baseLines[k]=result.baseLines[i];
						k++;
					}
				}
				for(var i=0;i<result.baseLines.length;i++){
					if(result.baseLines[i].disabled==true){
						baseLines[k]=result.baseLines[i];
						k++;
					}
				}
				if(codeLines!=0){
					var a=majoronCount/codeLines*1000;
					majoronP.paramValue=a.toFixed(2);
					
				}else{
					majoronP.paramValue=majoronCount;
				}
				vm.baseLines = baseLines;
				temp = baseLines;
				vm.edit = result.isEdit;
			});
		};
		
		vm.editStatic = function () {
			vm.edit = true;	
		};
		
		//计算千行代码bug率
		function countBug() {
			var length = vm.baseLines.length;
			var num = parseInt(vm.baseLines[0].paramValue) + parseInt(vm.baseLines[1].paramValue)
							 + parseInt(vm.baseLines[2].paramValue);
			vm.baseLines[length-1].paramValue = num / parseInt(vm.baseLines[length-2].paramValue)*1000;
		}
		//确认修改
		vm.changeStatic = function () {
			//countBug();
			if(vm.isOpen == 1 && vm.version){
				referVersionId = vm.version.branchId || '';
			}else{
				referBuildTime = vm.buildTimeDate.buildTime;
			}
			temp = vm.baseLines;
			var param = {
				sysId: sysId,
				referVersionId: referVersionId,
				referbuildTime: referBuildTime,
				baseLines: JSON.stringify(vm.baseLines)
			};
			SystemService.saveQBaseLine(param).then(function(result){
				if(result.errCode == '0'){
					AlertService.alert({
						title: '成功',
						content: "基线修改成功"
					})
					vm.edit = false;
				}else{
					AlertService.alert({
							title: '提示信息',
							content: result.errMsg
					});
				}
			
			})	
			
		}
		
		$scope.totalCount = function(item,dcDetailBoList){
			var majoronCount=0;
			var majoron=null;
			var majoronP=null;
			var codeLines=0;
			for(var i=0;i<dcDetailBoList.length;i++){
				if(dcDetailBoList[i].paramKey=="BLOCKER_VIOLATIONS"
					|| dcDetailBoList[i].paramKey=="CRITICAL_VIOLATIONS"
					|| dcDetailBoList[i].paramKey=="MAJOR_VIOLATIONS"){
					majoronCount+=Number(dcDetailBoList[i].paramValue);
				}
				if(dcDetailBoList[i].paramKey=="MAJORON_VIOLATIONS"){
					majoron = dcDetailBoList[i];
				}
				
				if(dcDetailBoList[i].paramKey=="CODE_LINES"){
					codeLines = dcDetailBoList[i].paramValue;
				}
				
				if(dcDetailBoList[i].paramKey=="MAJORON_VIOLATIONS_PERMILLAGE"){
					majoronP= dcDetailBoList[i];
				}
			}
			
			if(majoronCount>0 && majoron != null){
				majoron.paramValue = majoronCount;
			}
			
			if(codeLines!=0 && majoronCount>0){
				var a=majoronCount/codeLines*1000;
				majoronP.paramValue=a.toFixed(2);
			}else{
				majoronP.paramValue=majoronCount
			}
		}
		
		
		//取消
		vm.cancleEdit = function () {
			vm.baseLines = temp;
			init();
			vm.edit = false;
		}
		
		$scope.$watch('buildTimeDate.buildTime', function(newVal){
			if(newVal){
				getQBaseLineByBuildTime();
			}
		});
		init();
		
		///16072437
				
		//点击修改静态指标
		$scope.editStatic1 = function () {
			$scope.staticEdit1 = true;
		}
		//修改静态指标
		$scope.changeStatic1 = function () {
			var params={systemConfigs : JSON.stringify($scope.systemQualityConfigBos),
					systemConfigs2 : JSON.stringify($scope.systemQualityConfigBos2),
					systemConfigs3 : JSON.stringify($scope.systemQualityConfigBos3),
					systemConfigs4 : JSON.stringify($scope.systemQualityConfigBos4)};
			$scope.staticEdit1 = false;
			SystemService.saveSystemQualityConfig(params).then(function(result){
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
					getSystemQualityConfig1();
//					getSystemQualityConfig2();
//					getSystemQualityConfig3();
//					getSystemQualityConfig4();
				}
			});
		}
		//取消标准修改
		$scope.cancleEdit1 = function () {
			$scope.staticEdit1 = false;
			getSystemQualityConfig1();
//			getSystemQualityConfig2();
//			getSystemQualityConfig3();
//			getSystemQualityConfig4();
		};
		
		
		function getSystemQualityConfig1(){
			var params={
					analysisType : "2799,282,303,300",
					sysId : sysId,
					paramType : "1"
              };
			SystemService.querySystemQualityConfig(params).then(function (result) {
				vm.systemQualityConfigBos = result.systemQualityConfigBos;
				vm.systemQualityConfigBos2 = result.systemQualityConfigBos2;
				vm.systemQualityConfigBos3 = result.systemQualityConfigBos3;
				vm.systemQualityConfigBos4 = result.systemQualityConfigBos4;
			});
		}
//		function getSystemQualityConfig2(){
//			var params={
//					analysisType : "282",
//					//envType : "019",
//					sysId : sysId,
//					paramType : "1"
//	          };
//			SystemService.querySystemQualityConfig(params).then(function (result) {
//				vm.systemQualityConfigBos2 = result.systemQualityConfigBos;
//			});
//		}
//		function getSystemQualityConfig3(){
//			var params={
//					analysisType : "303",
//					//envType : "020",
//					sysId : sysId,
//					paramType : "1"
//	          };
//			SystemService.querySystemQualityConfig(params).then(function (result) {
//				vm.systemQualityConfigBos3 = result.systemQualityConfigBos;
//			});
//		}
//		function getSystemQualityConfig4(){
//			var params={
//					analysisType : "300",
//					//envType : "020",
//					sysId : sysId,
//					paramType : "1"
//		      };
//			SystemService.querySystemQualityConfig(params).then(function (result) {
//				vm.systemQualityConfigBos4 = result.systemQualityConfigBos;
//			});
//		}
	
		function getSysEnableEnv(){
			var params = {
					sysId: sysId
			};
			SystemService.getSysEnableEnv(params).then(function(result){
				$scope.envList=result.envList;
				$scope.selectedTab2 = "urlSet";
			});
			
		}
		
		function getEnvPackUrl(envId){
			var params={
					sysId:sysId,
					envId:envId
			};
			SystemService.getEnvPackUrl(params).then(function(result){
				$scope.sysEnvPakcUrls=result.sysEnvPakcUrls;
				$scope.sysEnvPakcUrls.forEach(function(item, index){
					item.show="true";
				});
			});
		}
		function saveEnvPackUrl(item){
			var params={
				envId:item.envId,
				packageId:item.packageId,
				url:item.url,
				loginUrl:item.loginUrl,
				userName:item.userName,
				passWord:item.passWord
			};
			SystemService.saveEnvPackUrl(params).then(function (result) {
				item.show=true;
			});
		}
		//切换发布前发布后tab
		$scope.selectTab = function (tabNo) {
				$scope.selectedTab = tabNo;
				var envList=$scope.envList;
				if($scope.selectedTab=="urlSet"){
					if($scope.selectedTab2=="urlSet"){
						if(null!=envList && envList.length>0){
							$scope.selectedTab2=envList[0].envId;
							$scope.envName=envList[0].envName;
							getEnvPackUrl(envList[0].envId);
						}
					}
				}
		};
		
		//切换环境类型tab
		$scope.selectTab2 = function (tabNo) {
				$scope.selectedTab2 = tabNo;
		};
		
		$scope.getEnvPackUrl=function(envId,envName){
			$scope.envName=envName;
			getEnvPackUrl(envId);
		};
		
		$scope.saveEnvPackUrl=function (index,item){
			console.log(index,item);
			saveEnvPackUrl(item);
		};
		
	}]);
