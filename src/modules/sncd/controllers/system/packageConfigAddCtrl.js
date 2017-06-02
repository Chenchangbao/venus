//系统应用包controller
angular
		.module('sncd')
		.controller(
				'PackageConfigAddCtrl',
				[
						'$scope',
						'SystemService',
						'DialogService',
						'$state',
						'$stateParams',
						function($scope, SystemService, DialogService, $state,
								$stateParams) {
							'use strict';

							// /////////////////functions//////////////////
							function init() {
								var editType = $stateParams.editType;
								var sysId = $stateParams.sysId;
								var params = {
									sysId : sysId,
									editType : editType
								};
								// addPackageConfigDetail(params);
								packageConfigDetail(params);
							}
							function packageConfigDetail(params) {
								SystemService
										.createOrShowBuildConfig(params)
										.then(
												function(result) {
													$scope.showType = result.showType;
													$scope.showsysType = '0';
													$scope.selected = []
													if ($stateParams.showType == '3') {
														$scope.tips = result.tips;
														return;
													} else {// 新建或者详情页
														$scope.editType = $stateParams.editType;
														$scope.system = result.system;
														$scope.jenkinsConfigItem = result.jenkinsConfigItem;
														$scope.jenkinsConfigItem.sysId = $stateParams.sysId;
														$scope.jenkinsConfigItem.sysType = $scope.system.sysType;
														$scope.branchs = result.branchs;
														$scope.osMap = result.osMap;
														if (result.showType == "2") {// 新建
															if (result.system.sysType == "0"
																	|| result.system.sysType == "99") {// 打包类型为maven/ant，默认为maven
																$scope.jenkinsConfigItem.packageType = "MAVEN";
																$scope.jenkinsConfigItem.code = "UTF-8";
																$scope.jenkinsConfigItem.mavenCommand = "clean install -Dmaven.test.skip=true -Dfile.encoding=UTF-8";
																$scope.jenkinsConfigItem.parastat = "Y";
															} else if ($scope.system.sysType == "5") {// android-gradle
																$scope.jenkinsConfigItem.packageType = "GRADLE";
																$scope.jenkinsConfigItem.gradlebuildCmd = "clean build aR";
																$scope.jenkinsConfigItem.gradlebuildFilePath = "./build.gradle";
																$scope.jenkinsConfigItem.parastat = "Y";
															} else if ($scope.system.sysType == "6") {// iso-shell
																$scope.jenkinsConfigItem.packageType = "SHELL";
																$scope.jenkinsConfigItem.parastat = "Y";
																$scope.jenkinsConfigItem.code = "UTF-8";
															} else if ($scope.system.sysType == "3") {// pc
																$scope.jenkinsConfigItem.packageType = "PC";
															} else if ($scope.system.sysType == "4") {// c-ant
																$scope.jenkinsConfigItem.parastat = "N";
																$scope.jenkinsConfigItem.packageType = "ANT";
																$scope.jenkinsConfigItem.code = "UTF-8";
																$scope.jenkinsConfigItem.targetOs = "OS_LINUX_REH_63"; // 默认选择操作系统
																$scope.jenkinsConfigItem.targetOses = $scope.jenkinsConfigItem.targetOs
																		.split(",");// 默认选择操作系统
																$scope.selected = $scope.jenkinsConfigItem.targetOses;
															}
															$scope.jenkinsConfigItem.devList = []
															$scope.jenkinsConfigItem.sitList = []
															$scope.jenkinsConfigItem.preList = []
															$scope.jenkinsConfigItem.prdList = []
															if ($scope.jenkinsConfigItem.parastat == "Y") {
																$scope.jenkinsConfigItem.devList
																		.push({
																			paraInfo : "dev",
																			paraDescription : "dev默认参数"
																		})
																$scope.jenkinsConfigItem.sitList
																		.push({
																			paraInfo : "sit",
																			paraDescription : "sit默认参数"
																		})
																$scope.jenkinsConfigItem.preList
																		.push({
																			paraInfo : "pre",
																			paraDescription : "pre默认参数"
																		})
																$scope.jenkinsConfigItem.prdList
																		.push({
																			paraInfo : "prod",
																			paraDescription : "prd默认参数"
																		})
															}
														} else {// 详情页
															$scope.lasthistory = result.lasthistory;
															$scope.selected = $scope.jenkinsConfigItem.targetOses;
															if ($scope.jenkinsConfigItem.parastat == "N") {
																$scope.jenkinsConfigItem.devList = []
																$scope.jenkinsConfigItem.sitList = []
																$scope.jenkinsConfigItem.preList = []
																$scope.jenkinsConfigItem.prdList = []
															}
															//记录老的打包方式。
															$scope.oldPackageType=$scope.jenkinsConfigItem.packageType;
														}
													}
												});
							}
							// // 进入创建页面
							// function addPackageConfigDetail(params){
							//    	
							// SystemService.addPackageConfig(params).then(function(result){
							// $scope.showType=result.showType;
							// if(result.showType == '3'){
							// $scope.tips=result.tips;
							// return ;
							// }
							// $scope.lasthistory = result.lasthistory;
							// $scope.system=result.system;
							// $scope.jenkinsConfigItem=result.jenkinsConfigItem;
							// $scope.branchs=result.branchs;
							// $scope.editType=$stateParams.editType;
							// if($stateParams.editType!="1"){//创建，进行数据初始化
							// $scope.jenkinsConfigItem.mavenCommand="clean
							// install -Dmaven.test.skip=true
							// -Dfile.encoding=UTF-8";
							// $scope.jenkinsConfigItem.parastat="Y";
							//   	   		    
							// $scope.jenkinsConfigItem.mavenSitCommand = "sit";
							// $scope.jenkinsConfigItem.mavenDevCommand = "dev";
							// $scope.jenkinsConfigItem.mavenPreCommand = "pre";
							// $scope.jenkinsConfigItem.mavenPrdCommand =
							// "prod";
							//   	 
							// }
							//   		    
							// if($scope.jenkinsConfigItem.parastat=="Y"){
							// $scope.jenkinsConfigItem.devList=[]
							// $scope.jenkinsConfigItem.sitList=[]
							// $scope.jenkinsConfigItem.preList=[]
							// $scope.jenkinsConfigItem.prdList=[]
							// $scope.jenkinsConfigItem.devList.push({paraInfo:"dev",paraDescription:"dev默认参数"})
							// $scope.jenkinsConfigItem.sitList.push({paraInfo:"sit",paraDescription:"sit默认参数"})
							// $scope.jenkinsConfigItem.preList.push({paraInfo:"pre",paraDescription:"pre默认参数"})
							// $scope.jenkinsConfigItem.prdList.push({paraInfo:"pr0d",paraDescription:"prd默认参数"})
							// }else{
							// $scope.jenkinsConfigItem.devList = ["dev"];
							// $scope.jenkinsConfigItem.sitList = ["sit"];
							// $scope.jenkinsConfigItem.preList = ["pre"];
							// $scope.jenkinsConfigItem.mavenPrdCommand =
							// "prod";
							// }
							// });
							// }

							var updateSelected = function(action, id, name) {
								if (action == 'add'
										&& $scope.selected.indexOf(id) == -1) {
									$scope.selected.push(id);
								}
								if (action == 'remove'
										&& $scope.selected.indexOf(id) != -1) {
									var idx = $scope.selected.indexOf(id);
									$scope.selected.splice(idx, 1);
								}
							};
							$scope.updateSelection = function($event, id) {
								var checkbox = $event.target;
								var action = (checkbox.checked ? 'add'
										: 'remove');
								updateSelected(action, id, checkbox.name);
							};

							// C语言类型的 操作系统是否被选中
							$scope.isSelected = function(key) {
								if(undefined!=$scope.jenkinsConfigItem.targetOs && null!=$scope.jenkinsConfigItem.targetOs){
								return $scope.jenkinsConfigItem.targetOs.indexOf(key) >= 0;
								}else{
									return false;
								}
							};
							// 新建
							$scope.createJob = function(invalid) {
								if (invalid) {
									swal({   title: "必填项不能为空!",   text: "本提示会在2秒内关闭.",   timer: 2000 });
									return;
								}
								// 判断是否重复
								var obj = {};
								function checkNx(list) {
									for (var i = 0; i < list.length; i++) {
										var item = list[i].paraInfo;
										// var item = list[i].newCommand;
										if (obj[item]) {
											return false;
										} else {
											obj[item] = true;
										}
									}
									return true;
								}
								// 表单校验--临时去掉
								// if($scope.packageForm.$invalid){
								// return;
								// }
								if ($scope.jenkinsConfigItem.sysType == "4") {// C的操作系统
									$scope.jenkinsConfigItem.targetOses = $scope.selected;
								}
//								if ($scope.jenkinsConfigItem.packageType == "ANT") {// ant设置为无参数
//									$scope.jenkinsConfigItem.parastat = 'N';
//								}
								// 环境参数设置
								if ($scope.jenkinsConfigItem.parastat == 'N') {
									$scope.jenkinsConfigItem.mavenDevCommand = '';
									$scope.jenkinsConfigItem.mavenSitCommand = '';
									$scope.jenkinsConfigItem.mavenPreCommand = '';
									$scope.jenkinsConfigItem.mavenPrdCommand = '';
									$scope.jenkinsConfigItem.devList = [];
									$scope.jenkinsConfigItem.sitList = [];
									$scope.jenkinsConfigItem.preList = [];
									$scope.jenkinsConfigItem.prdList = [];
								} else if ($scope.jenkinsConfigItem.parastat == 'Y') {
									// 有环境参数
									var devList = $scope.jenkinsConfigItem.devList;
									var sitList = $scope.jenkinsConfigItem.sitList;
									var preList = $scope.jenkinsConfigItem.preList;
									var prdList = $scope.jenkinsConfigItem.prdList;
									if (devList == null || devList.length <= 0
											|| sitList == null
											|| sitList.length <= 0
											|| preList == null
											|| preList.length <= 0
											|| prdList == null
											|| prdList.length <= 0) {
										$scope.errorMsg = "环境参数不能为空!";
										return false;
									} else {

										var flag = checkNx(devList)
												&& checkNx(sitList)
												&& checkNx(preList)
												&& checkNx(prdList);

										if (!flag) {
											$scope.errorMsg = "环境参数不能重复!";
											return false;
										}
									}
								}
							
								if ($stateParams.editType != "1") {
									SystemService
											.createPackageConfigJobNew(
													{
														"jenkinsConfigItem" : $scope.jenkinsConfigItem
													})
											.then(
													function(result) {
														if (result.message == 'SUCCESS') {
															swal({   title: "SUCCESS!",   text: "Job创建成功!",   imageUrl: "images/thumbs-up.jpg" });
															// 进入详情
															$state
																	.go(
																			"PackageConfig",
																			{
																				sysId : $stateParams.sysId
																			});
														} else {
															swal("Job创建失败！ "
																	,result.message);
														}
													});
								} else {//更新
									SystemService
											.updatePackageConfig(
													{
														"jenkinsConfigItem" : $scope.jenkinsConfigItem,
														"oldPakcageType": $scope.oldPackageType
													}).then(function(result) {
												swal(result.message);
												// 进入详情
												$state.go("PackageConfig", {
													sysId : $stateParams.sysId
												});
											});
								}
							}

							$scope.goBack = function() {
								// 进入详情
								$state.go("PackageConfig", {
									sysId : $stateParams.sysId
								});
							}

							// 增加命令
							$scope.addCommand = function(type) {

								if (type == 'sit') {
									var newCommand = $scope.jenkinsConfigItem.newMavenSitCommand;
									var description = $scope.jenkinsConfigItem.newMavenSitDesp;
									var params = {
										paraInfo : newCommand,
										paraDescription : description
									};
									if (newCommand == null || newCommand == ''
											|| isRepeat(newCommand)) {
										return false;
									}

									// $scope.jenkinsConfigItem.sitList.push(newCommand);
									// 这里如果释放，页面中参数也得修改为对象的属性
									$scope.jenkinsConfigItem.sitList
											.push(params);
									$scope.jenkinsConfigItem.newMavenSitCommand = null;
									$scope.jenkinsConfigItem.newMavenSitDesp = null;
								} else if (type == 'pre') {
									var newCommand = $scope.jenkinsConfigItem.newMavenPreCommand;
									var description = $scope.jenkinsConfigItem.newMavenPreDesp;
									var params = {
										paraInfo : newCommand,
										paraDescription : description
									};
									if (newCommand == null || newCommand == ''
											|| isRepeat(newCommand)) {
										return false;
									}
									// $scope.jenkinsConfigItem.preList.push(newCommand);
									// 这里如果释放，页面中参数也得修改为对象的属性
									$scope.jenkinsConfigItem.preList
											.push(params);
									$scope.jenkinsConfigItem.newMavenPreCommand = null;
									$scope.jenkinsConfigItem.newMavenPreDesp = null;
								} else if (type == 'dev') {
									var newCommand = $scope.jenkinsConfigItem.newMavenDevCommand;
									var description = $scope.jenkinsConfigItem.newMavenDevDesp;
									var params = {
										paraInfo : newCommand,
										paraDescription : description
									};
									if (newCommand == null || newCommand == ''
											|| isRepeat(newCommand)) {
										return false ;
									}
									// $scope.jenkinsConfigItem.devList.push(newCommand);
									// 这里如果释放，页面中参数也得修改为对象的属性
									$scope.jenkinsConfigItem.devList
											.push(params);
									$scope.jenkinsConfigItem.newMavenDevCommand = null;
									$scope.jenkinsConfigItem.newMavenDevDesp = null;
								} else if (type == 'prd') {
									var newCommand = $scope.jenkinsConfigItem.newMavenPrdCommand;
									var description = $scope.jenkinsConfigItem.newMavenPrdDesp;
									var params = {
										paraInfo : newCommand,
										paraDescription : description
									};
									if (newCommand == null || newCommand == ''
											|| isRepeat(newCommand)) {
										return false;
									}
									// $scope.jenkinsConfigItem.devList.push(newCommand);
									// 这里如果释放，页面中参数也得修改为对象的属性
									$scope.jenkinsConfigItem.prdList
											.push(params);
									$scope.jenkinsConfigItem.newMavenPrdCommand = null;
									$scope.jenkinsConfigItem.newMavenPrdDesp = null;
								}

							};

							function isRepeat(newCommand) {
								$scope.errorMsg = '';
								if ($scope.jenkinsConfigItem.devList == null) {
									$scope.jenkinsConfigItem.devList = []
								}
								if ($scope.jenkinsConfigItem.sitList == null) {
									$scope.jenkinsConfigItem.sitList = []
								}
								if ($scope.jenkinsConfigItem.preList == null) {
									$scope.jenkinsConfigItem.preList = []
								}
								if ($scope.jenkinsConfigItem.prdList == null) {
									$scope.jenkinsConfigItem.prdList = []
								}
								//判断是否重复
								//有环境参数
								var devList = $scope.jenkinsConfigItem.devList;
								var sitList = $scope.jenkinsConfigItem.sitList;
								var preList = $scope.jenkinsConfigItem.preList;
								var prdList = $scope.jenkinsConfigItem.prdList;
								for (var i = 0; i < devList.length; i++) {
									if (newCommand == devList[i].paraInfo) {
										$scope.errorMsg = "环境参数不能重复!";
										return true;
									}
								}

								for (var i = 0; i < sitList.length; i++) {
									if (newCommand == sitList[i].paraInfo) {
										$scope.errorMsg = "环境参数不能重复!";
										return true;
									}
								}

								for (var i = 0; i < preList.length; i++) {
									if (newCommand == preList[i].paraInfo) {
										$scope.errorMsg = "环境参数不能重复!";
										return true;
									}
								}
								for (var i = 0; i < prdList.length; i++) {
									if (newCommand == prdList[i].paraInfo) {
										$scope.errorMsg = "环境参数不能重复!";
										return true;
									}
								}

								//		if(newCommand == 'prod'){
								//			$scope.errorMsg = "环境参数不能重复!";
								//			return true;
								//		}
								//		
								return false;

							}

							$scope.removeCommand = function(type, index) {
								if (type == 'sit') {
									$scope.jenkinsConfigItem.sitList.splice(
											index, 1);
								} else if (type == 'pre') {
									$scope.jenkinsConfigItem.preList.splice(
											index, 1);
								} else if (type == 'dev') {
									$scope.jenkinsConfigItem.devList.splice(
											index, 1);
								} else if (type == 'prd') {
									$scope.jenkinsConfigItem.prdList.splice(
											index, 1);
								}

							};

							$scope.choosePkgTypeMaven = function() {
//								$scope.jenkinsConfigItem.code = "UTF-8";
								$scope.jenkinsConfigItem.mavenCommand = "clean install -Dmaven.test.skip=true -Dfile.encoding=UTF-8";
								$scope.jenkinsConfigItem.parastat = "Y";
								$scope.paraStatY();
//								$scope.jenkinsConfigItem.devList.push({
//									paraInfo : "dev",
//									paraDescription : "dev默认参数"
//								});
//								$scope.jenkinsConfigItem.sitList.push({
//									paraInfo : "sit",
//									paraDescription : "sit默认参数"
//								});
//								$scope.jenkinsConfigItem.preList.push({
//									paraInfo : "pre",
//									paraDescription : "pre默认参数"
//								});
//								$scope.jenkinsConfigItem.prdList.push({
//									paraInfo : "prod",
//									paraDescription : "prd默认参数"
//								});
							};
							//构建参数选择否，置空所有参数
							$scope.chooseAnt = function() {
								$scope.jenkinsConfigItem.parastat = "Y";
								$scope.paraStatY();
//								$scope.jenkinsConfigItem.devList = [];
//								$scope.jenkinsConfigItem.sitList = [];
//								$scope.jenkinsConfigItem.preList = [];
//								$scope.jenkinsConfigItem.prdList = [];
								$scope.jenkinsConfigItem.code="UTF-8";
							};
							//构建参数选择否，置空所有参数
							$scope.paraStatN = function() {
								$scope.jenkinsConfigItem.devList = [];
								$scope.jenkinsConfigItem.sitList = [];
								$scope.jenkinsConfigItem.preList = [];
								$scope.jenkinsConfigItem.prdList = [];
							};

							//构建参数选择是，提供默认参数
							$scope.paraStatY = function() {
								if($scope.jenkinsConfigItem.devList.length==0){
								$scope.jenkinsConfigItem.devList.push({
									paraInfo : "dev",
									paraDescription : "dev默认参数"
								});
								}
								if($scope.jenkinsConfigItem.sitList.length==0){
								$scope.jenkinsConfigItem.sitList.push({
									paraInfo : "sit",
									paraDescription : "sit默认参数"
								});
								}
								if($scope.jenkinsConfigItem.preList.length==0){
								$scope.jenkinsConfigItem.preList.push({
									paraInfo : "pre",
									paraDescription : "pre默认参数"
								});
								}
								if($scope.jenkinsConfigItem.prdList.length==0){
								$scope.jenkinsConfigItem.prdList.push({
									paraInfo : "prod",
									paraDescription : "prd默认参数"
								});
								}
							};

							init();

						} ]);
