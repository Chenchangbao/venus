angular.module('sncd').controller('CreateVersionCtrl', ['$scope', 'SystemService', 'VersionManageService', '$state', '$stateParams','$timeout', '$filter', 'HomeService', '$q', 'AlertService',
	function ($scope, SystemService, VersionManageService, $state, $stateParams,$timeout, $filter, HomeService, $q, AlertService) {
		//        'use strict';
		$scope.obj={};
		var vm = $scope,
			formData = vm.formData = {},
			pager = vm.pager = {
				pageNumber: 1,
				totalCount: 0, //总条数
				pageSize: 10
			};
		environmentlist = vm.environmentlist = [
			// {code:0,name:'SIT设置'},
			// {code:1,name:'PRE设置'},
			// {code:2,name:'PRD设置'},
		],
						dataList = vm.dataList = [],
						sysNameList = vm.sysNameList = [],
						baseLines = vm.baseLines = [],
						// sitConfig = vm.sitConfig = [],
						// preConfig = vm.preConfig = [],
						// prdConfig = vm.prdConfig = [],
						deployProcess = [],
						deliveryConfigBoList = [],
						permissionList = vm.permissionList = [],
						roleList = vm.roleList = [];
		analysList = vm.analysList = [];

				var defaultStart = new Date;
				defaultStart.setHours(0);
				defaultStart.setMinutes(0);
				defaultStart.setSeconds(0);
				defaultStart.setMilliseconds(0);
				var defaultEnd = new Date(+defaultStart + 24 * 3600000 - 1);
				var now = new Date;
		var sysId = $stateParams.sysId,
			dateFormat = 'yyyy-MM-dd hh:mm:ss';//时间格式
		var userData = $scope.postData = {
			sysId: sysId,
			selectPackage: "",
						rUser: "",
						oldrUser: "",
						rwUser: "",
						oldrwUser: "",
						// versionCmo:'',
						// techManager:'',
						// testManager:'',
						codereviewOpen: 0
		};
		var codereviewOpen = '',
		reviewerAndDevelopersStr = '';
		var steplist = [];
				var nextstep = 0,
						stepLength = vm.stepLength = 0;

		$scope.userLable = [{
			name: "版本CMO",
			model: userData.versionCmo
		},
			{
				name: "技术经理",
				model: userData.techManager
			}, {
				name: "测试经理",
				model: userData.testManager
			}],
			vm.selectedTab = 1;

		var newrUsers = $scope.newrUsers = {
			filterList: [], // 备选列表,
			filterValue: null, // 备选列表元素为对象时备选列表显示的属性，
			pickedList: [], // 已选内容列表,
			filterNumber: 20, // 备选列表显示条数 
			validFunction: validFunction, // 输入框校验
			canDirectInput: true,// 是否允许输入框直接输入
		};
		var newrwUsers = $scope.newrwUsers = {
			filterList: [], // 备选列表,
			filterValue: null, // 备选列表元素为对象时备选列表显示的属性，
			pickedList: [], // 已选内容列表,
			filterNumber: 20, // 备选列表显示条数 
			validFunction: validFunction, // 输入框校验
			canDirectInput: true,// 是否允许输入框直接输入
		};
	
		// var deployer = $scope.deployer= {
		//         filterList: [], // 备选列表,
		//         filterValue: null, // 备选列表元素为对象时备选列表显示的属性，
		//         pickedList: [], // 已选内容列表,
		//         filterNumber: 20, // 备选列表显示条数 
		//         validFunction: validFunction, // 输入框校验
		//         canDirectInput: true,// 是否允许输入框直接输入
		//     };

		// var staticDeployer = $scope.staticDeployer= {
		//         filterList: [], // 备选列表,
		//         filterValue: null, // 备选列表元素为对象时备选列表显示的属性，
		//         pickedList: [], // 已选内容列表,
		//         filterNumber: 20, // 备选列表显示条数 
		//         validFunction: validFunction, // 输入框校验
		//         canDirectInput: true,// 是否允许输入框直接输入
		//     };

		var frequencyRates = $scope.frequencyRates = [/*{frequencyRate:"8",frequencyRateDesc:'每日三次',frequencyExpression:"H H/8 * * *"},
	                                                        {frequencyRate:"24",frequencyRateDesc:'每日一次',frequencyExpression:"H H * * *"},
	                                                        {frequencyRate:"3",frequencyRateDesc:'每三小时一次',frequencyExpression:"H H/3 * * *"},
	                                                        {frequencyRate:"1",frequencyRateDesc:'每小时一次',frequencyExpression:"H * * * *"},
	                                                        {frequencyRate:"3600",frequencyRateDesc:'每一分钟一次',frequencyExpression:"* * * * *"},
	                                                        {frequencyRate:"-1",frequencyRateDesc:'自定义',frequencyExpression:""}*/
															{frequencyRate:"10",frequencyRateDesc:'每十分钟一次',frequencyExpression:"H/10 * * * *"},
	                                                        {frequencyRate:"-2",frequencyRateDesc:'立即构建',frequencyExpression:""}
															];
		$scope.projectTypes = [{ projectType: "1", projectDesc: "单工程" }, { projectType: "2", projectDesc: "多工程" }];

		var query = vm.query = {
						selectedRate:frequencyRates[1]
				};
		////////////////functions/////////////////
		 function queryInitBuildInfoAboveSys(){
				var param = {
						sysId: $stateParams.sysId
					};
				
				VersionManageService.queryAboveSysBuildInfo(param).then(function (result) {
					$scope.analysListAboveSys = result;
				});
		}
		function queryInitBuildInfo(newStep) {
			var envType = '019';
			var analysObj = {
								beforeObj: {},
								afterObj: {}
			};
			if (newStep.code == 1) {
				envType = '020';
			} else if (newStep.code == 2) {
				envType = '021';
			}
			var param = {
				sysId: $stateParams.sysId,
				versionId: $stateParams.versionId,
				envType: envType
			};
			
			
			VersionManageService.queryBuildInfo(param).then(function (result) {
				analysList = result;
				
				var sysBaseMap=$scope.analysListAboveSys;
				analysList.forEach(function (obj) {
					for(var i=0;i<obj.dcDetailBo.length;i++){
						//if(obj.dcDetailBo[i].analysisType=="2799"){
						var deliveryDetailmap =sysBaseMap[obj.dcDetailBo[i].analysisType];
							if(obj.dcDetailBo[i].dcDetailBoList != null){
								var majoronCount=0;
								var majoronTemp=null;
								
								for(var j=0;j<obj.dcDetailBo[i].dcDetailBoList.length;j++){
									
									var paramKey=obj.dcDetailBo[i].dcDetailBoList[j].paramKey;
									
									obj.dcDetailBo[i].dcDetailBoList[j].oldParamValue=deliveryDetailmap[paramKey];
										
									//设置系统级以上入口条件不可修改
									if(obj.dcDetailBo[i].dcDetailBoList[j].isEntrance!=null && obj.dcDetailBo[i].dcDetailBoList[j].isEntrance==1){
										obj.dcDetailBo[i].dcDetailBoList[j].isEntranceDisabled=true;
									}
									if(paramKey=="MAJORON_VIOLATIONS" || paramKey=="MAJORON_VIOLATIONS_PERMILLAGE"){
										obj.dcDetailBo[i].dcDetailBoList[j].disabled=true;
									/*	majoronTemp = obj.dcDetailBo[i].dcDetailBoList[j];*/
									//	continue;
									}
									
									/*if(obj.dcDetailBo[i].dcDetailBoList[j].paramKey=="BLOCKER_VIOLATIONS"
										|| obj.dcDetailBo[i].dcDetailBoList[j].paramKey=="CRITICAL_VIOLATIONS"
										|| 	obj.dcDetailBo[i].dcDetailBoList[j].paramKey=="MAJOR_VIOLATIONS"){
										majoronCount+=Number(obj.dcDetailBo[i].dcDetailBoList[j].paramValue);
										continue;
									}	*/								
								}
								/*if(majoronTemp != null){
									majoronTemp.paramValue = majoronCount;
								}*/
							}
							//break;
						//}
						
					/*	if(obj.dcDetailBo[i].analysisType=="282"){
							if(obj.dcDetailBo[i].dcDetailBoList != null){
								for(var j=0;j<obj.dcDetailBo[i].dcDetailBoList.length;j++){
									if(obj.dcDetailBo[i].dcDetailBoList[j].isEntrance!=null && obj.dcDetailBo[i].dcDetailBoList[j].isEntrance==1){
										obj.dcDetailBo[i].dcDetailBoList[j].isEntranceDisabled=true;
									}
								}
							}
						}*/
						
						
					}
					
					if (obj.deployType == '1') {
						if (obj.isOpen == 1) {
							vm.isBeforeOpen = true;
						} else {
							vm.isBeforeOpen = false;
						}
						// vm.preDcDetailBo = obj.dcDetailBo;
						// vm.preDcDetailBo.staticEdit = false;
						analysObj.beforeObj = {
							sysId: obj.sysId,
							versionId: obj.versionId,
							envType: obj.envType,
							deployType: '1',
							isOpen: obj.isOpen,
							dcDetailBo: obj.dcDetailBo
						};
						// analysObj.beforeObj.preDcDetailBo.staticEdit = false;
					} else {
						if (obj.isOpen == 1) {
							vm.isAfterOpen = true;
						} else {
							vm.isAfterOpen = false;
						}
						// vm.afterDcDetailBo = obj.dcDetailBo;
						analysObj.afterObj = {
							sysId: obj.sysId,
							versionId: obj.versionId,
							envType: obj.envType,
							deployType: '2',
							isOpen: obj.isOpen,
							dcDetailBo: obj.dcDetailBo
						};
						// analysObj.afterObj.afterDcDetailBo.staticEdit = false;
					}

				})
				dataList.push(analysObj);
			})
		}




		function init() {
			//完成按钮是否置灰
			vm.disableComplete=false;
			//初始化
			vm.step = 1;
			vm.saveJob = false;//是否保存质量分析
			vm.saveCodeView = false;//是否保存代码评审 
			// vm.staticEdit = false;
			// vm.unitEdit = false;
			var processList = [];
			
			var param = {
				sysId: $stateParams.sysId,
				versionId: $stateParams.versionId
			};
			//获取系统级别以及的阀值信息
			queryInitBuildInfoAboveSys();
			
			$q.all([HomeService.getAllUsers(), VersionManageService.createVersion(param)]).then(function(results){
				$scope.userList = results[0].allUsers;
				newrwUsers.filterList = newrUsers.filterList = $scope.userList;
				var result = results[1];
				$scope.version = result.branchBo;
				$scope.dtmList = result.dtmList;
				$scope.postData.reposId = result.branchBo.reposId;
				processList = result.branchBo.deployProcess;
				processList.forEach(function (e) {
					if (e.envType == '019') {
						e.code = 0;
					} else if (e.envType == '020') {
						e.code = 1;
					} else {
						e.code = 2;
					}
				})
				vm.environmentlist = environmentlist = processList;
				vm.checkItem();
				//初始化交付构建配置
				environmentlist.forEach(function (newstep) {
					//获取系统级以上数据为标准
					queryInitBuildInfo(newstep);
					
				})
				var permissionUsers = result.permissionUsers;

				for (var item in permissionUsers) {
					permissionList.push({ name: item, value: permissionUsers[item] });
				}
				//整合权限信息
				permissionList.forEach(function (permission) {
					var obj = {
						name: permission.name,
						filterList: $scope.userList, // 备选列表,
						filterValue: null, // 备选列表元素为对象时备选列表显示的属性，
						pickedList: permission.value, // 已选内容列表,
						filterNumber: 20, // 备选列表显示条数 
						validFunction: validFunction, // 输入框校验
						canDirectInput: true,// 是否允许输入框直接输入
					};
					vm.roleList.push(obj);
				})

				//类似创建
				if (result.branchBo.branchId != null && result.branchBo.branchId != 0) {
					
					//发布包  
					var deployPackages = result.branchBo.deployPackages;
					if (deployPackages != null && result.branchBo.sysPackageList != null && result.branchBo.sysPackageList.length > 0) {
						for (var i = 0; result.branchBo.sysPackageList && i < result.branchBo.sysPackageList.length; i++) {
							if (deployPackages.indexOf(result.branchBo.sysPackageList[i].packageId) >= 0) {
								result.branchBo.sysPackageList[i].selectPack = true;
							}
						}
					}
					$scope.sysPackageList = result.branchBo.sysPackageList;

					//分支权限
					var rwUser = result.rwUser;
					if (rwUser != null && rwUser.length > 0) {
						newrwUsers.pickedList = rwUser.split(",");
					}
					var rUser = result.rUser;
					if (rUser != null && rUser.length > 0) {
						newrUsers.pickedList = rUser.split(",");
					}

				} else {

					for (var i = 0; result.branchBo.sysPackageList && i < result.branchBo.sysPackageList.length; i++) {
						result.branchBo.sysPackageList[i].selectPack = true;
					}
					$scope.sysPackageList = result.branchBo.sysPackageList;
				}

				//                $scope.postData.versionCmo = $scope.sys.sysCmo;
				if (result.branchBo.rwUser != null && result.branchBo.rwUser != '') {
					$scope.postData.rwUsers = result.branchBo.rwUser.split(",");
				}
				if (result.branchBo.rUsers != null && result.branchBo.rUsers != '') {
					$scope.postData.rUsers = result.branchBo.rUser.split(",");
				}
			})
			//初始化第三步质量分析数据
			initAnalysisInfo();

			//获取基线信息
			VersionManageService.versionJob({sysId: sysId, versionId: $stateParams.versionId }).then(function (result) {

				vm.baseLines = baseLines = result.baseLines;
				for (var i=0;i<frequencyRates.length;i++)
						{
							if(result.branchBo.branchBuildInfoBo && result.branchBo.branchBuildInfoBo.frequencyRate && frequencyRates[i].frequencyRate == result.branchBo.branchBuildInfoBo.frequencyRate){
								$scope.query.selectedRate = frequencyRates[i];
							}
						}
			})

		}

		//初始化第三步质量分析数据
		function initAnalysisInfo() {
			//获取
			SystemService.getDictItemListByType({ "kind": "72" }).then(function (result) {
				$scope.dtmListTrigger = result.dictItemList;
						  $scope.triggerLength = result.dictItemList.length;
			});
			SystemService.getDictItemListByType({ "kind": "73" }).then(function (result) {
				$scope.dtmListAnalysisExt = result.dictItemList;
			});
			//进入质量分析
			//获取所有角色
			SystemService.getSystemTeam({ sysId: sysId }).then(function (result) {
				$scope.dtmListRecipent = result.dtmList;
				$scope.dtmListCc = [];
				angular.copy($scope.dtmListRecipent, $scope.dtmListCc);
				//角色
				var recipentList = $scope.recipentList;
				if (recipentList != null && recipentList.length > 0 && $scope.dtmListRecipent != null && $scope.dtmListRecipent.length > 0) {
					for (var i = 0; i < $scope.dtmListRecipent.length; i++) {
						for (var j = 0; j < recipentList.length; j++) {
							if ($scope.dtmListRecipent[i].roleName == recipentList[j]) {
								$scope.dtmListRecipent[i].checked = true;
							}
						}
					}
				}
				var ccList = $scope.ccList;
				if (ccList != null && ccList.length > 0 && $scope.dtmListCc != null && $scope.dtmListCc.length > 0) {
					for (var i = 0; i < $scope.dtmListCc.length; i++) {
						for (var j = 0; j < ccList.length; j++) {
							if ($scope.dtmListCc[i].roleName == ccList[j]) {
								$scope.dtmListCc[i].checked = true;
							}
						}
					}
				}
				var mailTriggerList = $scope.mailTriggerList;
				if (mailTriggerList != null && mailTriggerList.length > 0 && $scope.dtmListTrigger != null && $scope.dtmListTrigger.length > 0) {
					for (var i = 0; i < $scope.dtmListTrigger.length; i++) {
						for (var j = 0; j < mailTriggerList.length; j++) {
							if ($scope.dtmListTrigger[i].itemCode == mailTriggerList[j]) {
								$scope.dtmListTrigger[i].checked = true;
							}
						}
					}
				}
				//var analysisExtList = $scope.analysisExtList;
				//if (analysisExtList != null && analysisExtList.length > 0 && $scope.dtmListAnalysisExt != null && $scope.dtmListAnalysisExt.length > 0) {
					for (var i = 0; i < $scope.dtmListAnalysisExt.length; i++) {
						if($scope.dtmListAnalysisExt[i].itemCode=='2799'||$scope.dtmListAnalysisExt[i].itemCode=='282')
						//for (var j = 0; j < analysisExtList.length; j++) {
							//if ($scope.dtmListAnalysisExt[i].itemCode == analysisExtList[j]) {
								$scope.dtmListAnalysisExt[i].checked = true;
						//全部置灰
								$scope.dtmListAnalysisExt[i].disabled=true;
							//}
						//}
					}
				//}
			});
			


		}
		//选中环境配置
		vm.checkItem = function (item) {
			var stepnum = 4;
			var numOfCheckedItems = vm.environmentlist.filter(function (it) {
				return it.checked;
			});
			numOfCheckedItems.forEach(function (e) {
				//初始化交付构建配置
				// queryInitBuildInfo(e);
				e.step = stepnum + 1;
				stepnum++;
			});
			vm.steplist = numOfCheckedItems;
			steplist = vm.steplist;
			vm.stepLength = vm.steplist.length;
		};

				//切换发布前发布后tab
		$scope.selectTab = function (tabNo) {
			$scope.selectedTab = tabNo;
		}
		//跳转步骤条
				vm.stepJump = function (step) {
			if (step.step) {
				//	saveBuildConfig(step);
				//	queryInitBuildInfo(step);
				vm.step = step.step;
			} else {
				vm.step = step;
			}
				}
				//点击修改静态指标
				vm.editStatic = function (newStep, config) {
			// vm.staticEdit = true;
			config.staticEdit = true;
				}

		//修改静态指标
				vm.changeStatic = function (newStep, config) {

			config.staticEdit = false;
				}

				//取消标准修改
		$scope.cancleEdit = function (newstep,config) {
			//queryInitBuildInfo(newStep);
			config.staticEdit = false;
		}

		$scope.isVersionExist = function (version) {
			if (this.versionForm.version.$error.required) {
				$scope.versionErrorMsg="版本号不能为空";
				return false;
			}
			if(checkVersionReg()==undefined){
				VersionManageService.isVersionExist({ 'versionInfo': JSON.stringify($scope.postData) }).then(function (result) {
					if (result.isExist) {
						$scope.versionErrorMsg = "版本号已存在";
						return false;
					} else {
						$scope.versionErrorMsg = "";
						return true;
					}
				});
			}else{
				$scope.versionErrorMsg = "";
				return true;
			}
		};
		
		$scope.checkVersionName=function(){
			if (this.versionForm.branchName.$error.required) {
				$scope.branchNameErrorMsg="版本名称不能为空";
				return false;
			}else{
				$scope.branchNameErrorMsg="";
				return true;
			}
		};
		
		function checkVersionReg(){
			if ($scope.postData.version != null && $scope.postData.version != '') {
				var version = $scope.postData.version;
				var versionReg = /([0-9]{1,}.){1,}[0-9]{1,}$/;
				if (!versionReg.test(version)) {
					$scope.versionErrorMsg = "版本号格式不正确";
					return false;
				}
			}else{
				return false;
			}
		}

		//保存交付配置信息
		function saveBuildConfig(step) {
			if (step.code == 1) {
				sitConfig = analysList;
			} else if (step.code == 2) {
				preConfig = analysList;
			} else {
				prdConfig = analysList;
			}

			// var selectedAnalysisList = vm.dtmListAnalysisExt.filter(function (it) {
			// 	return it.checked;
			// });
			// var selectedUnitList = vm.unitlist.filter(function (it) {
			// 	return it.checked;
			// });
			// var selectedStaticlist = vm.staticlist.filter(function (it) {
			// 	return it.checked;
			// });
			// //如果是sit的配置
			// if(step.code == 1){
			// 	sitConfig.staticlist = vm.selectedStaticlist;
			// 	sitConfig.unitlist = vm.selectedUnitList;
			// 	sitConfig.selectedAnalysisList = selectedAnalysisList;
			// }else if(step.code == 2){
			// 	preConfig.staticlist = vm.selectedStaticlist;
			// 	preConfig.unitlist = vm.selectedUnitList;
			// 	preConfigonfig.selectedAnalysisList = selectedAnalysisList;
			// }else{
			// 	prdConfig.staticlist = vm.selectedStaticlist;
			// 	prdConfig.unitlist = vm.selectedUnitList;
			// 	prdConfig.selectedAnalysisList = selectedAnalysisList;
			// }
		}

		//进入权限下一步
		$scope.nextStep = function (step, invalid) {
			if (step.step) {
				//saveBuildConfig(step);
				step = step.step + 1;
				nextstep = nextstep + 1;
				//queryInitBuildInfo(steplist[nextstep]);
			}
			else if (step == '2') {//校验版本基本信息
				 if($scope.postData.branchName==undefined || $scope.postData.branchName==""){
				 	$scope.branchNameErrorMsg="版本名称不能为空";
				 }else{
				 	$scope.branchNameErrorMsg="";						
				 }
				
				 if($scope.postData.version==undefined || $scope.postData.version==""){
				 	$scope.versionErrorMsg="版本号不能为空";
				 }else{
				 	$scope.versionErrorMsg="";
				 }
				if(checkVersionReg()!=undefined){
					return false;
				}
				if (invalid){
					return false;
				}
				VersionManageService.isVersionExist({ 'versionInfo': JSON.stringify($scope.postData) }).then(function (result) {
					if (result.isExist) {
						$scope.versionErrorMsg = "版本号已存在";
						return false;
					} else {
						$scope.versionErrorMsg = "";
						//数据整理
						var packList = $scope.sysPackageList;
						$scope.postData.selectPackage = '';
						for (var i = 0; packList && i < packList.length; i++) {
							if (packList[i].selectPack) {
								if ($scope.postData.selectPackage == '' || $scope.postData.selectPackage == null) {
									$scope.postData.selectPackage = packList[i].packageId;
								} else {
									$scope.postData.selectPackage = $scope.postData.selectPackage + "," + packList[i].packageId;
								}
							}
						}

						$scope.postData.sysId = $stateParams.sysId;
						var users = $scope.userLable;
						$scope.step = step;
					}
				});
				
				
				
				// $scope.postData.versionCmo = users[0].model.value;
				// $scope.postData.techManager = users[1].model.value;
				// $scope.postData.testManager = users[2].model.value;
				//初始化版本权限

				// newrwUsers.filterList = newrUsers.filterList = $scope.userList;

				// if($scope.version.deployer!=null ){
				//   deployer.pickedList = $scope.version.deployer.split(",");
				// }

				// if($scope.version.staticDeployer!=null){
				//   staticDeployer.pickedList =  $scope.version.staticDeployer.split(",");
				// }
				return false;
			} else if (step == '3') {//校验权限
				vm.permissionList = [];
				//权限数据整理
				vm.roleList.forEach(function (obj) {
					if (obj.name == '7016' && obj.pickedList.length == 0) {
						AlertService.alert({
							title: '非空警告',
							content: "版本基本信息管理人员不能为空！"
						})
						vm.step = step = 2;
					}
					vm.permissionList[obj.name] = obj.pickedList;
				})

				setSvnPermission();
				// vm.postData.versionPermission = vm.permissionList;
				
				// $scope.postData.deployer = deployerUser;
				// $scope.postData.staticDeployer = staticDeployerUser;

			} else if (step == '4') {//校验质量分析计划
				if (invalid) {
					return;
				}
				$scope.errorMsg = "";
				$scope.saveJob = true;
				//代码评审数据组装
				var reviewerAndDevelopersBoList = [];
				if ($scope.postData.rwUser != null && $scope.postData.rwUser.length > 0) {
					var reviewerAndDevelopersBo = {};
					var newDevelopers = [];
					var rwUsers = $scope.postData.rwUser.split(",");
					for (var i = 0; i < rwUsers.length; i++) {
						var newDeveloper = {};
						newDeveloper.fullName = rwUsers[i];
						newDeveloper.userName = rwUsers[i].substring(rwUsers[i].length - 10).substring(1, 9);
						newDeveloper.checked=true;
						newDevelopers.push(newDeveloper)
					}
					reviewerAndDevelopersBo.newDevelopers = newDevelopers;
					reviewerAndDevelopersBoList.push(reviewerAndDevelopersBo);
					
				}
				$scope.reviewerAndDevelopersBoList = reviewerAndDevelopersBoList;
			}else if(step == '5'){
				var result = saveReview(1,invalid,5);
				if(!result && result != undefined){
					$scope.step = 4;
					return;
				}
			}
			$scope.step = step;
		}

				//交付配置上一步
		vm.beforeStep = function (step) {
			if (step.step) {
				//saveBuildConfig(step);
				step = step.step + 1;
				nextstep = nextstep + 1;
				// queryInitBuildInfo(steplist[nextstep]);
			}
				}

		$scope.lastStep = function (step) {
			$scope.step = step;
			if (step == '4') {
				$scope.saveJob = false;
			}
		}


		function validFunction(item, option) {
			//去重
			for (var i = 0; i < option.pickedList.length; i++) {
				if (option.pickedList[i] == item) {
					return $q.reject();
				}
			}
			//canDirectInput 为true 验证
			var reg = /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-（）]*[/(]*[0-9]{0,8}[/)]*$/;
			if (!reg.test(item)) {
				return $q.reject();
    		} else {
    			 var params = {
    					 "userFullName": item
    			 };
    			 return HomeService.validateUser(params).then(function (result) {
					if (!result.flag) {
						if (null != result.allUsers) {
    		   				 newrwUsers.filterList = newrUsers.filterList = result.allUsers;
						}
    		   			return $q.reject();
					}
				});
    		}

		}

		//保存代码评审信息
		function saveReview(type,invalid,step) {
			reviewerAndDevelopersStr = "";//提交的 字符串
			codereviewOpen = $scope.postData.codereviewOpen;


			if (type == '1') {//创建
				if (invalid && $scope.versionErrorMsg != '') {
    			   return;
				}
				//校验
				$scope.errorMsg = "";
				if (codereviewOpen === null || codereviewOpen === '') {
					$scope.errorMsg = "请选择是否使用ReviewBoard评审";
					return false;
				}

				var reviewerAndDevelopersBoList = $scope.reviewerAndDevelopersBoList;
				//使用评审
				if (codereviewOpen == '1') {//使用评审
					//开发为空，提示维护分支读写权限
					if (typeof(reviewerAndDevelopersBoList)=='undefined' || !reviewerAndDevelopersBoList || reviewerAndDevelopersBoList.length == 0 ||  typeof(reviewerAndDevelopersBoList[0])=='undefined' ||  typeof(reviewerAndDevelopersBoList[0].newDevelopers)=='undefined'|| reviewerAndDevelopersBoList[0].newDevelopers == null || reviewerAndDevelopersBoList[0].newDevelopers.length == 0) {
						$scope.errorMsg = "开发人员不能为空，请先维护分支读写权限！";
						return false;
					}
					//为每一个开发增加评审
					var flag = true;
					if (reviewerAndDevelopersBoList != null && reviewerAndDevelopersBoList.length > 0) {
						var allSelDevelopers = "";//所有已选开发
						var allSelReviewers = "";//所有已选的评审人
						for (var i = 0; i < reviewerAndDevelopersBoList.length; i++) {
							var newDevelopers = "";
							var review = reviewerAndDevelopersBoList[i].reviewer.userName;
							for (var j = 0; j < reviewerAndDevelopersBoList[i].newDevelopers.length; j++) {
								if (reviewerAndDevelopersBoList[i].newDevelopers[j].checked) {
    	       						if (newDevelopers != '') {
										newDevelopers = newDevelopers + "," + reviewerAndDevelopersBoList[i].newDevelopers[j].userName;
    	       						} else {
										newDevelopers = reviewerAndDevelopersBoList[i].newDevelopers[j].userName;
    	       						}
    	       						if (allSelDevelopers == '' || allSelDevelopers.indexOf(reviewerAndDevelopersBoList[i].newDevelopers[j].userName) < 0) {
										if (allSelDevelopers == '') {
											allSelDevelopers = reviewerAndDevelopersBoList[i].newDevelopers[j].userName
										} else {
											allSelDevelopers = allSelDevelopers + "," + reviewerAndDevelopersBoList[i].newDevelopers[j].userName
										}

    	       						}
								}
							}
							if (newDevelopers == '' || newDevelopers.length == 0) {
								$scope.errorMsg = "每行请至少勾选一个开发人员！";
								return false;
							}

							if (newDevelopers.indexOf(review) >= 0) {
								flag = false;
								$scope.errorMsg = "不能评审自己的代码！";
								return false;
							}
							if (allSelReviewers != '' && allSelReviewers.indexOf(review) >= 0) {
								$scope.errorMsg = "代码评审人员不能重复！";
								return false;
							} else {
								allSelReviewers = allSelReviewers + ","
							}
							//组装提交的字符串
							if (reviewerAndDevelopersStr == '') {
								reviewerAndDevelopersStr = review + ":" + newDevelopers;
							} else {
								reviewerAndDevelopersStr = reviewerAndDevelopersStr + ";" + review + ":" + newDevelopers;
							}
						}
					}
					//是否评审了全部开发人员
					if (allSelDevelopers.split(",").length != reviewerAndDevelopersBoList[0].newDevelopers.length) {
						$scope.errorMsg = "请为每个开发人员指定评审人员！";
						return false;
					}
				}
				//创建代码评审
				$scope.saveCodeView = true;
			} else {//跳过代码评审创建
				$scope.saveCodeView = false;
			}
		}

		$scope.exitCreateVersion = function () {
			AlertService.confirm({
				title: "确定退出吗？",
				content: '确定退出创建新版本吗？',
				button1:"确定",
        button2:"取消"
			}).then(function () {
				$state.go('SystemManage');
			});

		}

		//构建配置数据整合
		function saveBuildData(step) {
			deliveryConfigBoList = [];
			var code = 0;
			step = step - 4;
			for (var i = 0; i < step; i++) {
				code = steplist[i].code;
				deliveryConfigBoList.push(dataList[code].beforeObj);
				deliveryConfigBoList.push(dataList[code].afterObj);
			}
		}

		function setSvnPermission(){
			var rUser = '';
			var rwUser = '';
			var deployerUser = '';
			var staticDeployerUser = '';
			//读写用户
			if (newrwUsers.pickedList != null && newrwUsers.pickedList.length > 0) {
				for (var i = 0; i < newrwUsers.pickedList.length; i++) {
					if (rwUser == '') {
						rwUser = newrwUsers.pickedList[i];
					} else {
						rwUser = rwUser + "," + newrwUsers.pickedList[i];
					}
				}
			}
			//只读用户
			if (newrUsers.pickedList != null && newrUsers.pickedList.length > 0) {
				for (var i = 0; i < newrUsers.pickedList.length; i++) {
					if (rUser == '') {
						rUser = newrUsers.pickedList[i];
					} else {
						rUser = rUser + "," + newrUsers.pickedList[i];
					}
				}
			}

			$scope.postData.rUser = rUser;
			$scope.postData.rwUser = rwUser;
		}
		//完成
		$scope.saveVersion = function (type, invalid, step) {
			if(invalid){
				return false;
			}
			setSvnPermission();
			if(step == 2){
				vm.permissionList = [];
				//权限数据整理
				vm.roleList.forEach(function (obj) {
					if (obj.name == '7016' && obj.pickedList.length == 0) {
						AlertService.alert({
							title: '非空警告',
							content: "版本基本信息管理人员不能为空！"
						})
						vm.step = step = 2;
					}
					vm.permissionList[obj.name] = obj.pickedList;
				})
			}else if(step == 3){
				$scope.saveJob = true;
			}
			
			
			//需要保存交付构建配置数据
			if (step > 4) {
				saveBuildData(step);
				// $scope.postData.deliveryConfigBoList = deliveryConfigBoList;
				// deliveryConfigBoList.forEach(function(e){
				// 	e.dcDetailBo.forEach(function(item){
				// 		item.createTime = $filter('date')(item.createTime, dateFormat) || '';
				// 	})
				// })
				// console.log(deliveryConfigBoList);
			}else{
				deliveryConfigBoList = '';
			}
			// saveReview(type,invalid,step);
			var reviewerAndDevelopersStr = "";//提交的 字符串
			var codereviewOpen = $scope.postData.codereviewOpen;


			if (type == '1') {//创建
				if (invalid && $scope.versionErrorMsg != '') {
    			   return;
				}
				//校验
				$scope.errorMsg = "";
				if (codereviewOpen === null || codereviewOpen === '') {
					$scope.errorMsg = "请选择是否使用ReviewBoard评审";
					return false;
				}

				var reviewerAndDevelopersBoList = $scope.reviewerAndDevelopersBoList;
				//使用评审
				if (codereviewOpen == '1') {//使用评审
					//开发为空，提示维护分支读写权限
					if (typeof(reviewerAndDevelopersBoList)=='undefined'|| !reviewerAndDevelopersBoList ||  typeof(reviewerAndDevelopersBoList[0])=='undefined'|| typeof(reviewerAndDevelopersBoList[0].newDevelopers)=='undefined'|| reviewerAndDevelopersBoList[0].newDevelopers == null || reviewerAndDevelopersBoList[0].newDevelopers.length == 0) {
						$scope.errorMsg = "开发人员不能为空，请先维护分支读写权限！";
						return false;
					}
					//为每一个开发增加评审
					var flag = true;
					if (reviewerAndDevelopersBoList != null && reviewerAndDevelopersBoList.length > 0) {
						var allSelDevelopers = "";//所有已选开发
						var allSelReviewers = "";//所有已选的评审人
						for (var i = 0; i < reviewerAndDevelopersBoList.length; i++) {
							var newDevelopers = "";
							var review = reviewerAndDevelopersBoList[i].reviewer.userName;
							for (var j = 0; j < reviewerAndDevelopersBoList[i].newDevelopers.length; j++) {
								if (reviewerAndDevelopersBoList[i].newDevelopers[j].checked) {
    	       						if (newDevelopers != '') {
										newDevelopers = newDevelopers + "," + reviewerAndDevelopersBoList[i].newDevelopers[j].userName;
    	       						} else {
										newDevelopers = reviewerAndDevelopersBoList[i].newDevelopers[j].userName;
    	       						}
    	       						if (allSelDevelopers == '' || allSelDevelopers.indexOf(reviewerAndDevelopersBoList[i].newDevelopers[j].userName) < 0) {
										if (allSelDevelopers == '') {
											allSelDevelopers = reviewerAndDevelopersBoList[i].newDevelopers[j].userName
										} else {
											allSelDevelopers = allSelDevelopers + "," + reviewerAndDevelopersBoList[i].newDevelopers[j].userName
										}

    	       						}
								}
							}
							if (newDevelopers == '' || newDevelopers.length == 0) {
								$scope.errorMsg = "每行请至少勾选一个开发人员！";
								return false;
							}

							if (newDevelopers.indexOf(review) >= 0) {
								flag = false;
								$scope.errorMsg = "不能评审自己的代码！";
								return false;
							}
							if (allSelReviewers != '' && allSelReviewers.indexOf(review) >= 0) {
								$scope.errorMsg = "代码评审人员不能重复！";
								return false;
							} else {
								allSelReviewers = allSelReviewers + ","
							}
							//组装提交的字符串
							if (reviewerAndDevelopersStr == '') {
								reviewerAndDevelopersStr = review + ":" + newDevelopers;
							} else {
								reviewerAndDevelopersStr = reviewerAndDevelopersStr + ";" + review + ":" + newDevelopers;
							}
						}
					}
					//是否评审了全部开发人员
					if (allSelDevelopers.split(",").length != reviewerAndDevelopersBoList[0].newDevelopers.length) {
						$scope.errorMsg = "请为每个开发人员指定评审人员！";
						return false;
					}
				}
				//创建代码评审
				$scope.saveCodeView = true;
			} else {//跳过代码评审创建
				$scope.saveCodeView = false;
			}

			//    	   saveVersionJob(versionId);
			var versionPermission = [];
			for (var item in vm.permissionList) {
				versionPermission.push({ rolePermission: item, userNos: vm.permissionList[item] });
			}
			vm.environmentlist.forEach(function (item) {
				var date = $filter('date')(item.date, dateFormat) || '';
				item.date = date;
				item.endDate = date;
			})
			//保存版本信息
				 	var params =
				{
					versionInfo: JSON.stringify($scope.postData),
					versionPermission: JSON.stringify(versionPermission),
					// deliveryConfigBoList: JSON.stringify(deliveryConfigBoList),
					deployProcess: JSON.stringify(vm.environmentlist)
				};
				if(deliveryConfigBoList == ''){
					params.deliveryConfigBoList = '';
				}else{
					params.deliveryConfigBoList = JSON.stringify(deliveryConfigBoList);
				}
				//按钮置灰
			vm.disableComplete=true;
			VersionManageService.saveVersion(params).then(function (result) {
				
				$scope.count = 0;
				var ccount=0;
				$scope.saveJobFlag=true;
				$scope.saveReviewFlag=true;
				if (result.errCode == '0') {
					//保存代码评审和质量分析
					var versionId = result.data.versionId;
					//如果需要保存质量分析
					if ($scope.saveJob) {
						saveVersionJob(versionId);
						ccount =ccount+1;
					}

					//如果需要保存代码评审
					if ($scope.saveCodeView) {
						saveReviewBoard(versionId, codereviewOpen, reviewerAndDevelopersStr);
						ccount =ccount+1;
					}
					
					if(!$scope.saveJob && ! $scope.saveCodeView){
						AlertService.alert({
    						title: '成功！',
    						content: "创建版本成功"
    					}).then(function () {
    						$state.go("VersionDetail", { sysId: $stateParams.sysId, versionId: versionId });
    					});
					}else{
					
						$timeout((function (){
							getSaveVersionResult(ccount,versionId);
						}), 3000);
					}
				} else {
					AlertService.alert({
						title: '提交出错',
						content: result.errMsg || '系统出错'
					});
				}
			});
			
		};
		
		function getSaveVersionResult(ccount,versionId){
			var content="创建版本成功";
			if(ccount==$scope.count){
				if(!$scope.saveJobFlag){
					content=content+",工具检查设置失败:"+$scope.saveJobMessage;;
				}
				if(!$scope.saveReviewFlag){
					content=content+",评审设置失败";
				}
				if(!$scope.saveJobFlag||!$scope.saveReviewFlag){
					content=content+",请联系平台管理员朱文静(11010068)";
				}
				AlertService.alert({
					title: '成功！',
					content:content
				}).then(function () {
					$state.go("VersionDetail", { sysId: $stateParams.sysId, versionId: versionId });
				});
			}else{
				$timeout((function (){
					getSaveVersionResult(ccount,versionId);
				}), 3000);
			}
		}

		//保存质量分析
		function saveVersionJob(versionId) {

			var recipent = '',
			recipentArr = [];
			var cc = '',
			ccArr = [];
			var mailTrigger = '',
			mailTriggerArr = [];
			var analysisExt = '',
			analysisExtArr = [];
			var params = {};
			var dtmListRecipent = $scope.dtmListRecipent;
			if (dtmListRecipent != null && dtmListRecipent.length > 0) {
				for (var i = 0; i < dtmListRecipent.length; i++) {
					if (dtmListRecipent[i].checked == true) {
	       				if (recipent == null && recipent == '') {
							recipent = dtmListRecipent[i].roleName;
	       				} else {
							recipent += "," + dtmListRecipent[i].roleName;
							recipentArr.push(dtmListRecipent[i].roleName);
	       				}
					}
				}
				$scope.recipentList = recipent.split(",");
				recipent = recipentArr.join(",");
			}

			var dtmListCc = $scope.dtmListCc;
			if (dtmListCc != null && dtmListCc.length > 0) {
				for (var i = 0; i < dtmListCc.length; i++) {
					if (dtmListCc[i].checked == true) {
	       				if (cc == null && cc == '') {
							cc = dtmListCc[i].roleName;
	       				} else {
							cc += "," + dtmListCc[i].roleName;
							ccArr.push(dtmListCc[i].roleName);
	       				}
					}
				}
				$scope.ccList = cc.split(",");
				cc = ccArr.join(",");
			}
			var dtmListTrigger = $scope.dtmListTrigger;
			if (dtmListTrigger != null && dtmListTrigger.length > 0) {
				for (var i = 0; i < dtmListTrigger.length; i++) {
					if (dtmListTrigger[i].checked == true) {
	       				if (mailTrigger == null && mailTrigger == '') {
							mailTrigger = dtmListTrigger[i].itemCode;
	       				} else {
							mailTrigger += "," + dtmListTrigger[i].itemCode;
							mailTriggerArr.push(dtmListTrigger[i].itemCode);
	       				}
					}
				}
				$scope.mailTriggerList = mailTrigger.split(",");
				mailTrigger = mailTriggerArr.join(",");
			}

			var dtmListAnalysisExt = $scope.dtmListAnalysisExt;
			if (dtmListAnalysisExt != null && dtmListAnalysisExt.length > 0) {
				for (var i = 0; i < dtmListAnalysisExt.length; i++) {
					if (dtmListAnalysisExt[i].checked == true) {
	       				if (analysisExt == null && analysisExt == '') {
							analysisExt = dtmListAnalysisExt[i].itemCode;
	       				} else {
							analysisExt += "," + dtmListAnalysisExt[i].itemCode;
							analysisExtArr.push(dtmListAnalysisExt[i].itemCode);
	       				}
					}
				}
				$scope.analysisExtList = analysisExt.split(",");
				analysisExt = analysisExtArr.join(",");
			}
			 //ANT 打包
			var packageType=$scope.version.packageType;
			var projectType=null;
			var projectNames=null;
			if (packageType == 'ANT' ) {
				projectType=$scope.version.branchBuildInfoBo.projectType;
				if(projectType == '2'){
					projectNames=$scope.version.branchBuildInfoBo.projectNames;
					if (projectNames == null || projectNames == '') {
						alert("请填写工程名称！");
						return;
					}
				}
			}
			
			params = {
				versionId: versionId,
				frequencyRate:vm.query.selectedRate.frequencyRate,
				frequencyExpression:vm.query.selectedRate.frequencyExpression,
				analysisExt: analysisExt,
				recipent: recipent, cc: cc,
				mailTrigger: mailTrigger,
				baseLines: JSON.stringify(vm.baseLines),
				projectType:projectType,
				projectNames:projectNames
			};
			//保存
			VersionManageService.saveVersionJob(params).then(function (result) {
				$scope.saveJobFlag=result.flag;
				$scope.count = $scope.count+1;
			 	$scope.saveJobMessage=result.errMsg;
			});
			// .then(function (result) {
			// 	if(result.flag && vm.step == 3){
			// 		AlertService.alert({
			// 				title: '成功！',
			// 				content: "创建版本成功"
			// 			}).then(function () {
			// 				$state.go("VersionDetail", { sysId: $stateParams.sysId, versionId: versionId });
			// 			});
			// 	}else{
			// 		return;
			// 	}
			// })
				
		}

		//保存代码评审
		function saveReviewBoard(versionId, codereviewOpen, reviewerAndDevelopersStr) {
			var params = {
				versionId: versionId,
				codereviewOpen: codereviewOpen,
				reviewerAndDevelopersStr: reviewerAndDevelopersStr,
			};

			VersionManageService.saveCodeReview(params).then(function (result) {
				$scope.saveReviewFlag=result.flag;
				$scope.count = $scope.count+1;
			});
		}



		///////////////////Events//////////////////



		//添加一行
		$scope.add = function () {

			var reviewerAndDevelopersBoList = $scope.reviewerAndDevelopersBoList;

			var tempReviewerAndDevelopersBo = {};
			tempReviewerAndDevelopersBo.reviewer = "";
			tempReviewerAndDevelopersBo.newDevelopers = [];
			if (reviewerAndDevelopersBoList[0].newDevelopers != null && reviewerAndDevelopersBoList[0].newDevelopers.length > 0) {
      		for (var i = 0; i < reviewerAndDevelopersBoList[0].newDevelopers.length; i++) {
					var tempDevelopers = {};
					tempDevelopers.checked = false;
					tempDevelopers.fullName = reviewerAndDevelopersBoList[0].newDevelopers[i].fullName;
					tempDevelopers.userName = reviewerAndDevelopersBoList[0].newDevelopers[i].userName;
					tempReviewerAndDevelopersBo.newDevelopers.push(tempDevelopers);
      		}
			}


			reviewerAndDevelopersBoList.push(tempReviewerAndDevelopersBo);
			console.log(reviewerAndDevelopersBoList);
		}
		//删除本行
		$scope.del = function (index) {
			$scope.reviewerAndDevelopersBoList.splice(index, 1);
		}

		$scope.removeDeployer = function (pindex, index) {
			$scope.reviewerAndDevelopersBoList[pindex].newDevelopers.splice(index, 1)
		}


		//选人控件
		//鼠标点击选择下拉用户
		$scope.selectUser = function (user, index) {
			if ($scope.step == '4') {
				$scope.reviewerAndDevelopersBoList[index].reviewer.fullName = user;
				$scope.reviewerAndDevelopersBoList[index].reviewer.userName = user.substring(user.length - 10).substring(1, 9);
			} else {
				$scope.userLable[index].model.value = user;
			}
		};


		$scope.queryByUser = function (index) {
			var reg = /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-（）]*[/(]?[0-9]{0,8}[/)]?$/;
			if ($scope.step == '4') {
				if (!reg.test($scope.reviewerAndDevelopersBoList[index].reviewer.fullName)) {
					$scope.reviewerAndDevelopersBoList[index].reviewer.fullName = null;
				}
			} else {
				if (!reg.test($scope.userLable[index].model.value)) {
					$scope.userLable[index].model.value = null;
				}
			}
		};

		$scope.getUser = function (index) {
			var reg = /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-\u4E00-\u9FA5\uF900-\uFA2D（）]*[/(]*[0-9]{0,8}[/)]*$/;

			if ($scope.step == '4') {
				if (!reg.test($scope.reviewerAndDevelopersBoList[index].reviewer.fullName)) {
					$scope.reviewerAndDevelopersBoList[index].reviewer.fullName = null;
				} else {
					if (null != $scope.reviewerAndDevelopersBoList[index].reviewer.fullName && $scope.reviewerAndDevelopersBoList[index].reviewer.fullName != '') {
						var params = {
							"userFullName": $scope.reviewerAndDevelopersBoList[index].reviewer.fullName
						};
						HomeService.validateUser(params).then(function (result) {
							if (!result.flag) {
								$scope.reviewerAndDevelopersBoList[index].reviewer.fullName = null;
								if (null != result.allUsers) {
									$scope.userList = result.allUsers;
								}
							}
						});
					}
				}
			} else {
				if (!reg.test($scope.userLable[index].model.value) || $scope.userLable[index].model.value == null || $scope.userLable[index].model.value == '') {
					$scope.userLable[index].model.value = null;
				} else {
					var params = {
						"userFullName": $scope.userLable[index].model.value
					};
					HomeService.validateUser(params).then(function (result) {
   			   		 if (!result.flag) {
							if (null != result.allUsers) {
								$scope.userList = result.allUsers;
							}
   			   		 }
					});
				}
			}
		};

		$scope.obj.totalCount = function(item,dcDetailBoList){
			if(event.keyCode=='13' || event.type=='blur'){
				var majoronCount=0;
				var majoron=null;
				var majoronP=null;
				for(var i=0;i<dcDetailBoList.length;i++){
					//修改值不能比系统以上设置的值低，根据比较值来
					//if(dcDetailBoList[i].paramKey=="NEW_COVERAGE" || dcDetailBoList[i].paramKey=="TEST_SUCCESS_DENSITY"){
					if(dcDetailBoList[i].isEntrance!=null && dcDetailBoList[i].isEntrance==1){
						var oldParamValue=Number(dcDetailBoList[i].oldParamValue);
						/*if(dcDetailBoList[i].paramKey=="NEW_COVERAGE"){
							var oldParamValue=Number($scope.oldNewCoverageValue);
						}else{
							var oldParamValue=Number($scope.oldTestSuccessDValue);
						}*/
						var paramValue=Number(dcDetailBoList[i].paramValue);
						//if(oldParamValue!="undefiend" && oldParamValue!=null){
							//"1": ">=", "2": "<="
							if(dcDetailBoList[i].isGreaterLess=="1"){
								if(paramValue<oldParamValue){
									alert("不能比系统设置的阀值低,系统值为:"+oldParamValue);
									dcDetailBoList[i].paramValue=oldParamValue;
									return;
								}
							}else if(dcDetailBoList[i].isGreaterLess=="2"){
								if(paramValue>oldParamValue){
									alert("不能比系统设置的阀值高,系统值为:"+oldParamValue);
									dcDetailBoList[i].paramValue=oldParamValue;
									return;
								}
							}
							
						//}
					}
					//}
					
					//累加计算数据
					if(dcDetailBoList[i].paramKey=="BLOCKER_VIOLATIONS"
						|| dcDetailBoList[i].paramKey=="CRITICAL_VIOLATIONS"
						|| dcDetailBoList[i].paramKey=="MAJOR_VIOLATIONS"){
						majoronCount+=Number(dcDetailBoList[i].paramValue);
					}
					if(dcDetailBoList[i].paramKey=="MAJORON_VIOLATIONS"){
						majoron = dcDetailBoList[i];
					}
					if(dcDetailBoList[i].paramKey=="MAJORON_VIOLATIONS_PERMILLAGE"){
						majoronP=dcDetailBoList[i];
					}
				}
				
				if(majoronCount>0 && majoron != null){
					majoron.paramValue = majoronCount;
					majoronP.paramValue=majoron.paramValue;
				}
			}
		};
		
		$scope.replaceContent=function(){
			var projectName=$scope.version.branchBuildInfoBo.projectNames;
			projectName=projectName.replace(/[ ]/g,"").replace(/[\r\n]/g,""); //去掉空格
			$scope.version.branchBuildInfoBo.projectNames=projectName;
		};

		//获取页面初始化信息
		init();
		return vm;
	}
]);
