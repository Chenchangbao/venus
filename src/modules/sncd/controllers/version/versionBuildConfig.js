angular.module('sncd').controller('UpdateVersionBuildCtrl', ['$scope','$timeout','SystemService', 'VersionManageService', '$state', '$stateParams','$filter','HomeService','$q','AlertService',
    function ($scope,$timeout, SystemService,VersionManageService, $state, $stateParams,$filter,HomeService,$q,AlertService) {
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
        var sysId  =  $stateParams.sysId,
					  dateFormat = 'yyyy-MM-dd hh:mm:ss';//时间格式;
        
        var userData = $scope.postData={
        		selectPackage:"",
            	rUser:"",
            	oldrUser:"",
            	rwUser:"",
            	oldrwUser:"",
            	versionCmo:'',
            	techManager:'',
            	testManager:'',
            	codereviewOpen: 0
            };
        var steplist = [],
						stepLength = vm.stepLength = 0;
				var nextstep = 0;
				
				vm.selectedTab = 1;
				var query = vm.query = {
					selectedRate:undefined
				};
		    var frequencyRates=  $scope.frequencyRates =  [/*{frequencyRate:"8",frequencyRateDesc:'每日三次',frequencyExpression:"H H/8 * * *"},
	                                                        {frequencyRate:"24",frequencyRateDesc:'每日一次',frequencyExpression:"H H * * *"},
	                                                        {frequencyRate:"3",frequencyRateDesc:'每三小时一次',frequencyExpression:"H H/3 * * *"},
	                                                        {frequencyRate:"1",frequencyRateDesc:'每小时一次',frequencyExpression:"H * * * *"},
	                                                        {frequencyRate:"3600",frequencyRateDesc:'每一分钟一次',frequencyExpression:"* * * * *"},
	                                                        {frequencyRate:"-1",frequencyRateDesc:'自定义',frequencyExpression:""}*/
		                                                   	{frequencyRate:"10",frequencyRateDesc:'每十分钟一次',frequencyExpression:"H/10 * * * *"},
		                                                    {frequencyRate:"-2",frequencyRateDesc:'立即构建',frequencyExpression:""}
															];
		    $scope.projectTypes = [{ projectType: "1", projectDesc: "单工程" }, { projectType: "2", projectDesc: "多工程" }];
		    
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
					if(newStep.code == 1){
						envType = '020';
					}else if(newStep.code == 2){
						envType = '021';
					}
					var param = {
						sysId: $stateParams.sysId,
						versionId:$stateParams.versionId,
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
//												majoronTemp = obj.dcDetailBo[i].dcDetailBoList[j];
												//continue;
											}
//											if(obj.dcDetailBo[i].dcDetailBoList[j].paramKey=="BLOCKER_VIOLATIONS"
//												|| obj.dcDetailBo[i].dcDetailBoList[j].paramKey=="CRITICAL_VIOLATIONS"
//												|| 	obj.dcDetailBo[i].dcDetailBoList[j].paramKey=="MAJOR_VIOLATIONS"){
//												majoronCount+=Number(obj.dcDetailBo[i].dcDetailBoList[j].paramValue);
//												continue;
//											}									
										}
//										if(majoronTemp != null){
//											majoronTemp.paramValue = majoronCount;
//										}
									}
									//break;
								//}
							}
							
							if(obj.deployType == '1'){
								if(obj.isOpen == '1'){
									vm.isBeforeOpen = true;
								}else{
									vm.isBeforeOpen = false;
								}
								analysObj.beforeObj = {
									sysId: obj.sysId,
									versionId: obj.versionId,
									envType: obj.envType,
									deployType:'1',
									isOpen: obj.isOpen,
									dcDetailBo: obj.dcDetailBo
								};
								
							}else{
								if(obj.isOpen == '1'){
									vm.isAfterOpen = true;
								}else{
									vm.isAfterOpen = false;
								}
								analysObj.afterObj = {
									sysId: obj.sysId,
									versionId: obj.versionId,
									envType: obj.envType,
									deployType:'2',
									isOpen: obj.isOpen,
									dcDetailBo: obj.dcDetailBo
								};
							}
							
					})
					if(result[0].envType=="019"){
						dataList[0]=analysObj;
					}
					if(result[0].envType=="020"){
						dataList[1]=analysObj;
					}
					if(result[0].envType=="021"){
						dataList[2]=analysObj;
					}
					dataList.push(analysObj);
				})
			}
				
				
				
        function init() {
        	vm.disableComplete=false;
        	//初始化
        	vm.step = 3;
        	vm.saveJob = false;//是否保存质量分析
        	vm.saveCodeView = false;//是否保存代码评审 
					var processList = [];
        	var param = {
                sysId: $stateParams.sysId,
                versionId:$stateParams.versionId
            };
        	
        	//获取系统级别以及的阀值信息
        	queryInitBuildInfoAboveSys();
            VersionManageService.createVersion(param).then(function(result){
                $scope.version = result.branchBo;
                $scope.dtmList= result.dtmList;
                $scope.postData.reposId = result.branchBo.reposId;
								$scope.postData.rwUser = result.rwUser;
								processList = result.branchBo.deployProcess;
								processList.forEach(function (e) {
									if(e.envType == '019'){
										e.code = 0;
									}else if (e.envType == '020'){
										e.code = 1;
									}else{
										e.code = 2;
									}
								})
								vm.environmentlist = environmentlist = processList;
								//初始化交付构建配置
								environmentlist.forEach(function (newstep) {
									//获取系统级以上数据为标准
									queryInitBuildInfo(newstep);
								})
                initDtmList();
								initBuild();
            })
          //获取用户数据
        	HomeService.getAllUsers().then(function(result){
                $scope.userList = result.allUsers;
              });
					
					//获取基线信息
					VersionManageService.versionJob({versionId:$stateParams.versionId}).then(function(result){
						console.log(result);
						vm.baseLines = baseLines = result.baseLines;
						$scope.version = result.branchBo;
		        // $scope.selectedRate = result.branchBo.branchBuildInfoBo.frequencyRate;
						for (var i=0;i<frequencyRates.length;i++)
						{
							if(result.branchBo.branchBuildInfoBo && result.branchBo.branchBuildInfoBo.frequencyRate && frequencyRates[i].frequencyRate == result.branchBo.branchBuildInfoBo.frequencyRate){
								$scope.query.selectedRate = frequencyRates[i];
							}
						}
		        		if(null!=result.branchBo.branchBuildInfoBo){
		        			if(null!=result.branchBo.branchBuildInfoBo.mailRoleRecipent){
		        				$scope.recipentList=result.branchBo.branchBuildInfoBo.mailRoleRecipent.split(",");
		        			}
		        			if(null!=result.branchBo.branchBuildInfoBo.mailRoleCc){
		        				$scope.ccList=result.branchBo.branchBuildInfoBo.mailRoleCc.split(",");
		        			}
		        			if(null!=result.branchBo.branchBuildInfoBo.mailTrigger){
		        				$scope.mailTriggerList=result.branchBo.branchBuildInfoBo.mailTrigger.split(",");
		        			}
			        		if(null!=result.branchBo.branchBuildInfoBo.analysisExt){
			        			$scope.analysisExtList=result.branchBo.branchBuildInfoBo.analysisExt.split(",");
			        		}
		        		}
					});
					
        }
				
				//初始化交付流程步骤
				function initBuild() {
					var stepnum = 4;
					var numOfCheckedItems = vm.environmentlist.filter(function (it) {
						return it.checked;
					});
					numOfCheckedItems.forEach(function (e) {
						e.step = stepnum+1;
						stepnum++;
					});
					vm.steplist = numOfCheckedItems;
					vm.stepLength = vm.steplist.length;
					steplist = vm.steplist;
				}
        
				
				
				//切换发布前发布后tab
        $scope.selectTab = function (tabNo) {
            $scope.selectedTab = tabNo;
        }
        //跳转步骤条
				vm.stepJump = function (step) {
					if(step.step){
						vm.step = step.step;
					}else{
						vm.step = step;
					}
				}
				//点击修改静态指标
				vm.editStatic = function (newStep,config) {
					config.staticEdit = true;
				}
				
        //修改静态指标
				vm.changeStatic = function (newStep,config) {
					config.staticEdit = false;
				}
				
				//取消标准修改
				$scope.cancleEdit = function (newStep,config) {
					config.staticEdit = false;
				}
				
				function initDtmList() {
						 //获取词典信息
			           	SystemService.getDictItemListByType({"kind":"72"}).then(function (result){
			           		$scope.dtmListTrigger=result.dictItemList;
									  $scope.triggerLength = result.dictItemList.length;
			           	});
	
			           	SystemService.getDictItemListByType({"kind":"73"}).then(function (result){
			           		$scope.dtmListAnalysisExt=result.dictItemList;
			           	 //默认设置为已勾选并且置灰
			               	if( $scope.dtmListAnalysisExt!=null &&  $scope.dtmListAnalysisExt.length >0){
			             		 for(var i = 0;i< $scope.dtmListAnalysisExt.length;i++){
			             			if($scope.dtmListAnalysisExt[i].itemCode=='2799'||$scope.dtmListAnalysisExt[i].itemCode=='282'){
				              			$scope.dtmListAnalysisExt[i].checked=true;
				              			$scope.dtmListAnalysisExt[i].disabled=true;
			             			}
			             		 }
			             	 }
			           	});
					//进入质量分析
        		//获取所有角色
           	 SystemService.getSystemTeam({sysId:sysId}).then(function(result){
           		 $scope.dtmListRecipent=result.dtmList;
                    $scope.dtmListCc=[];
                    angular.copy($scope.dtmListRecipent, $scope.dtmListCc);
                  //角色
               	 var recipentList=$scope.recipentList;
               	 if(recipentList!=null && recipentList.length>0 && $scope.dtmListRecipent!=null && $scope.dtmListRecipent.length >0){
               		 for(var i = 0;i<$scope.dtmListRecipent.length;i++){
               			 for(var j=0;j<recipentList.length; j++){
               				if($scope.dtmListRecipent[i].roleName==recipentList[j]){
               					$scope.dtmListRecipent[i].checked=true;
               				}
               			 }
               		 }
               	 }
               	 
               	 var ccList=$scope.ccList;
               	 if(ccList!=null && ccList.length>0 && $scope.dtmListCc!=null && $scope.dtmListCc.length >0){
               		 for(var i = 0;i<$scope.dtmListCc.length;i++){
               			 for(var j=0;j<ccList.length; j++){
               				if($scope.dtmListCc[i].roleName==ccList[j]){
               					$scope.dtmListCc[i].checked=true;
               				}
               			 }
               		 }
               	 }
               	 
               	 var mailTriggerList = $scope.mailTriggerList;
               	 if(mailTriggerList!=null && mailTriggerList.length>0 &&  $scope.dtmListTrigger!=null &&  $scope.dtmListTrigger.length >0){
               		 for(var i = 0;i< $scope.dtmListTrigger.length;i++){
               			 for(var j=0;j<mailTriggerList.length; j++){
               				if($scope.dtmListTrigger[i].itemCode==mailTriggerList[j]){
               					 $scope.dtmListTrigger[i].checked=true;
               				}
               			 }
               		 }
               	 }
               	//数据库获取当前保存的数据 
//               	 var analysisExtList = $scope.analysisExtList;
               	
//               	 if(analysisExtList!=null && analysisExtList.length>0 &&  $scope.dtmListAnalysisExt!=null &&  $scope.dtmListAnalysisExt.length >0){
//               		 for(var i = 0;i< $scope.dtmListAnalysisExt.length;i++){
//               			 for(var j=0;j<analysisExtList.length; j++){
//               				if($scope.dtmListAnalysisExt[i].itemCode==analysisExtList[j]){
//               					 $scope.dtmListAnalysisExt[i].checked=true;
//               				}
//               				if($scope.dtmListAnalysisExt[i].itemName=="依赖jar包安全扫描" ||
//               						$scope.dtmListAnalysisExt[i].itemName=="安全扫描检查" ||
//               						$scope.dtmListAnalysisExt[i].itemName=="前端性能检测" ||
//               						$scope.dtmListAnalysisExt[i].itemName=="蛙测"){
//               					$scope.dtmListAnalysisExt[i].disabled=true;
//               					$scope.dtmListAnalysisExt[i].itemName +="(开发中...)"; 
//               				}
//               			 }
//               		 }
//               	 }
                 });
        		
           	
           	
           	//代码评审数据组装
           	VersionManageService.versionReviewBoard({versionId:$stateParams.versionId}).then(function(result){
        		$scope.type = result.type;
        		if ($scope.postData.rwUser != null && $scope.postData.rwUser.length > 0) {
        			$scope.postData.codereviewOpen=1;
        		}
        		$scope.branchCfgInfo = result.branchCfgInfo;
        		$scope.reviewerAndDevelopersBoList = result.reviewerAndDevelopersBoList;
        		for(var i=0;i<$scope.reviewerAndDevelopersBoList.length;i++){
        			var newDevelopers = [];
        			$scope.reviewerAndDevelopersBoList[i].newDevelopers=$scope.reviewerAndDevelopersBoList[i].developers;
        		}
        	});
		}
					
				// }
        //进入权限下一步
        $scope.nextStep = function (step,invalid){
					if(step.step){
						step = step.step+1 ;
						nextstep = nextstep+1;
					
        	}else if(step == '3'){//校验权限
					
        		
        	}else if(step == '4'){//校验质量分析计划
        		if (invalid) {
							return;
						}
						$scope.errorMsg = "";
						$scope.saveJob = true;
						//代码评审数据组装
//						var reviewerAndDevelopersBoList = [];
//						if($scope.reviewerAndDevelopersBoList != undefined){
//							reviewerAndDevelopersBoList = $scope.reviewerAndDevelopersBoList;
//						}
//						if ($scope.postData.rwUser != null && $scope.postData.rwUser.length > 0) {
//							var reviewerAndDevelopersBo = {};
//							var newDevelopers = [];
//							var rwUsers = $scope.postData.rwUser.split(",");
//							for (var i = 0; i < rwUsers.length; i++) {
//								var newDeveloper = {};
//								newDeveloper.fullName = rwUsers[i];
//								newDeveloper.userName = rwUsers[i].substring(rwUsers[i].length - 10).substring(1, 9);
//								newDeveloper.checked=true;
//								newDevelopers.push(newDeveloper);
//							}
//							reviewerAndDevelopersBo.newDevelopers = newDevelopers;
//							reviewerAndDevelopersBoList.push(reviewerAndDevelopersBo);
//						}
//						$scope.reviewerAndDevelopersBoList = reviewerAndDevelopersBoList;
        	}else if(step == '5'){
						var result = saveReview(1,invalid,5);
						if(!result && result != undefined){
							$scope.step = 4;
							return;
						}
					}
        	$scope.step = step ;
        }
				
				//交付配置上一步
        vm.beforeStep = function (step) {
					if(step.step){
						step = step.step+1 ;
						nextstep = nextstep+1;
					}
				}
        
        $scope.lastStep = function (step){
        	$scope.step = step;
        	if(step == '4'){
        		$scope.saveJob = false;
        	}
        }
        
        // function  validFunction(item,option){
        //  	//去重
        // 	for(var i=0;i<option.pickedList.length;i++){
        // 		if(option.pickedList[i]==item){
        // 			return $q.reject();
        // 		}
        // 	}
        // 	//canDirectInput 为true 验证
        //var reg =  /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-（）]*[/(]*[0-9]{0,8}[/)]*$/; 
        // 	if(!reg.test(item)){
        // 		return $q.reject();
    		// }else{
    		// 	 var params ={
    		// 			 "userFullName":item
    		// 	 };
    		// 	 return HomeService.validateUser(params).then(function(result){
    		//    		 if(!result.flag){
    		//    			 if(null!=result.allUsers){
    		//    				 staticDeployer.filterList=deployer.filterList=newrwUsers.filterList = newrUsers.filterList = result.allUsers;
    		//    			 }
    		//    			return $q.reject();	
    		//    		 }
    	  //        });
    		// }
        	 
        // }
				

        $scope.exitCreateVersion = function(){
        	AlertService.confirm({
                title: "确定退出吗？",
                content: '确定退出交付流程配置吗？',
								button1:"确定",
        				button2:"取消"
            }).then(function() {
            	 $state.go('SystemManage');
            });
           
        }
        
				//构建配置数据整合
				function saveBuildData(step) {
					 deliveryConfigBoList = [];
					 var code = 0;
					 step = step-4;
					 for (var i = 0 ;i < step ; i++){
						 code = steplist[i].code;
						 deliveryConfigBoList.push(dataList[code].beforeObj);
						 deliveryConfigBoList.push(dataList[code].afterObj);
					 }
				}
				
       //完成
       $scope.saveVersion = function (type,invalid,step){
				 //需要保存交付构建配置数据
				 if(step > 4){
					saveBuildData(step);
					// deliveryConfigBoList.forEach(function(e){
					// 	e.dcDetailBo.forEach(function(item){
					// 		item.createTime = $filter('date')(item.createTime, dateFormat) || '';
					// 	})
					// })	
				 }
    	   var reviewerAndDevelopersStr = "";//提交的 字符串
    		 var codereviewOpen = $scope.postData.codereviewOpen;
    		
    		
    	   if(type == '1'){//创建
    		   if(invalid && $scope.versionErrorMsg != ''){
    			   return ;
    		   }
    		   //校验
    			$scope.errorMsg="";
    			if(codereviewOpen === null  || codereviewOpen === ''){
    				$scope.errorMsg = "请选择是否使用ReviewBoard评审";
	       			return false;
    			}
    			
    	       	var reviewerAndDevelopersBoList = $scope.reviewerAndDevelopersBoList;
    	       	//使用评审
    	       	if(codereviewOpen == '1'){//使用评审
    	       		//开发为空，提示维护分支读写权限
    	       		if(typeof(reviewerAndDevelopersBoList)=='undefined' || !reviewerAndDevelopersBoList ||  typeof(reviewerAndDevelopersBoList[0])=='undefined' ||  typeof(reviewerAndDevelopersBoList[0].newDevelopers)=='undefined'|| reviewerAndDevelopersBoList[0].newDevelopers==null || reviewerAndDevelopersBoList[0].newDevelopers.length == 0){
    	       			$scope.errorMsg = "开发人员不能为空，请先维护分支读写权限！";
    	       			return false;
    	       		}
    	       		//为每一个开发增加评审
    	       		var flag = true;
    	       		if(null!=reviewerAndDevelopersBoList && reviewerAndDevelopersBoList.length > 0){
    	       			var allSelDevelopers ="";//所有已选开发
    	       			var allSelReviewers = "";//所有已选的评审人
    	       			for(var i =0;i<reviewerAndDevelopersBoList.length ; i++){
    	       				var newDevelopers = "";
    	       				var reviewFullName = reviewerAndDevelopersBoList[i].reviewer.fullName;
    	       				var review =  reviewFullName.substring(reviewFullName.length - 10).substring(1, 9);
    	       				for(var j =0;j<reviewerAndDevelopersBoList[i].newDevelopers.length ; j++){
    	       					if(reviewerAndDevelopersBoList[i].newDevelopers[j].checked){
    	       						if(newDevelopers !=''){
    	       							newDevelopers = newDevelopers + ","+reviewerAndDevelopersBoList[i].newDevelopers[j].userName;
    	       						}else{
    	       							newDevelopers  =  reviewerAndDevelopersBoList[i].newDevelopers[j].userName;
    	       						}
    	       						if(allSelDevelopers==''|| allSelDevelopers.indexOf(reviewerAndDevelopersBoList[i].newDevelopers[j].userName)  < 0 ){
    	       							if(allSelDevelopers==''){
    	       								allSelDevelopers = reviewerAndDevelopersBoList[i].newDevelopers[j].userName	
    	       							}else{
    	       								allSelDevelopers =  allSelDevelopers  +","+reviewerAndDevelopersBoList[i].newDevelopers[j].userName	
    	       							}
    	       							
    	       						}
    	       					}
    	       				}
    	       				if(newDevelopers==''||newDevelopers.length == 0){
    	       					$scope.errorMsg = "每行请至少勾选一个开发人员！";
    	       					return false;
    	       				}
    	       				
    	       				if(newDevelopers.indexOf(review)>=0){
    	       					flag = false;
    	       					$scope.errorMsg = "不能评审自己的代码！";
    	       					return false;
    	       				}
    	       				if(allSelReviewers!='' && allSelReviewers.indexOf(review)>=0){
    	       					$scope.errorMsg = "代码评审人员不能重复！";
    	       					return false;
    	       				}else{
    	       					allSelReviewers = allSelReviewers+","	
    	       				}
    	       				//组装提交的字符串
    	       				if(reviewerAndDevelopersStr ==''){
    	       					reviewerAndDevelopersStr = review+":"+newDevelopers;
    	       				}else{
    	       					reviewerAndDevelopersStr = reviewerAndDevelopersStr +";"+review+":"+newDevelopers;
    	       				}
    	       			}
    	       		}
    	       		//是否评审了全部开发人员
    	       		if(allSelDevelopers.split(",").length  != reviewerAndDevelopersBoList[0].newDevelopers.length ){
    	       			$scope.errorMsg = "请为每个开发人员指定评审人员！";
    						return false;
    	       		}
    	       	}
    	      //创建代码评审
	       		$scope.saveCodeView = true;
    	   }else{//跳过代码评审创建
    		   $scope.saveCodeView = false;
    	   }
				 
				 vm.environmentlist.forEach(function(item){
						var date = $filter('date')(item.endDate, dateFormat) || '';
						item.endDate = date;
						item.date = date;
				 })
    	   var params = 
					 	{
							sysId:sysId,
							versionId: $stateParams.versionId,
              versionInfo: '',
							versionPermission:'',
							deliveryConfigBoList: JSON.stringify(deliveryConfigBoList),
							deployProcess: JSON.stringify(vm.environmentlist)
            };
				 
		    //置灰按钮
			vm.disableComplete=true;
    	   //保存版本信息
         	VersionManageService.saveVersion(params).then(function (result) {
	         		$scope.count = 0;
					var ccount=0;
					$scope.saveJobFlag=true;
					$scope.saveReviewFlag=true;
                       if(result.errCode == '0'){
                   		//保存代码评审和质量分析
                    	   var versionId = result.data.versionId;
                    	//如果需要保存质量分析
                    	if($scope.saveJob){
                    		saveVersionJob(versionId);
                    		ccount =ccount+1;
                    	}
                    	   
                    	//如果需要保存代码评审
                    	if($scope.saveCodeView){
                        	saveReviewBoard(versionId,codereviewOpen,reviewerAndDevelopersStr);
                        	ccount =ccount+1;
                    	}
                    	if(!$scope.saveJob && ! $scope.saveCodeView){
	                    	 var msg = "创建版本成功";
	                    	 if(result.data != undefined && result.data.message != undefined && result.data.message!=""){
	                    		 msg = result.data.message;
	                    	 }
	                    	 
	                    	 AlertService.alert({
	                             title: '成功！',
	                             content: msg
	                         }).then(function(){
	                        	 //$state.go("UpdateVersionBuild",{sysId:$stateParams.sysId,versionId:versionId});
	                        	 window.location.reload();
	                         });
                    	}else{
    						$timeout((function (){
    							getSaveVersionResult(ccount,versionId);
    						}), 1000);
                    	}
                    	
                       }else{
                         AlertService.alert({
                           title: '提交出错',
                           content: result.errMsg || '系统出错'
                         });
                       }
               });
    	   
       };
       
       function getSaveVersionResult(ccount,versionId){
			var content="交付流程设置完成";
			if(ccount==$scope.count){
				if(!$scope.saveJobFlag){
					content=content+",工具检查设置失败:"+$scope.saveJobMessage;
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
					 window.location.reload();
				});
			}else{
				$timeout((function (){
					getSaveVersionResult(ccount,versionId);
				}), 1000);
			}
		}
       //保存质量分析
       function saveVersionJob(versionId){

       	var recipent = '',
				recipentArr = [];
				var cc = '',
				ccArr = [];
				var mailTrigger = '',
				mailTriggerArr = [];
				var analysisExt = '',
				analysisExtArr = [];
       	var dtmListRecipent = $scope.dtmListRecipent;
	       	 if( dtmListRecipent!=null && dtmListRecipent.length >0){
	       		 for(var i = 0;i<dtmListRecipent.length;i++){
	       			if( dtmListRecipent[i].checked==true){
	       				if(recipent==null && recipent=='' ){
	       					recipent=dtmListRecipent[i].roleName;
	       				}else{
	       					recipent+=","+dtmListRecipent[i].roleName;
									recipentArr.push(dtmListRecipent[i].roleName);
	       				}
	       			 }
	       		 }
	       		 $scope.recipentList=recipent.split(",");
						 recipent = recipentArr.join(",");
	       	 }
	       	 
	       	var dtmListCc = $scope.dtmListCc;
	       	 if( dtmListCc!=null && dtmListCc.length >0){
	       		 for(var i = 0;i<dtmListCc.length;i++){
	       			if( dtmListCc[i].checked==true){
	       				if(cc==null && cc == ''){
	       					cc=dtmListCc[i].roleName;
	       				}else{
	       					cc+=","+dtmListCc[i].roleName;
									ccArr.push(dtmListCc[i].roleName);
	       				}
	       			 }
	       		 }
	       		 $scope.ccList=cc.split(",");
						 cc = ccArr.join(",");
	       	 }
	       var dtmListTrigger=	$scope.dtmListTrigger;
	       if( dtmListTrigger!=null && dtmListTrigger.length >0){
	       		 for(var i = 0;i<dtmListTrigger.length;i++){
	       			if( dtmListTrigger[i].checked==true){
	       				if(mailTrigger==null && mailTrigger == ''){
	       					mailTrigger=dtmListTrigger[i].itemCode;
	       				}else{
	       					mailTrigger+=","+dtmListTrigger[i].itemCode;
									mailTriggerArr.push(dtmListTrigger[i].itemCode);
	       				}
	       			 }
	       		 }
	       		 $scope.mailTriggerList=mailTrigger.split(",");
						 mailTrigger = mailTriggerArr.join(",");
	       	 }
	       
	       var dtmListAnalysisExt=	$scope.dtmListAnalysisExt;
	       if( dtmListAnalysisExt!=null && dtmListAnalysisExt.length >0){
	       		 for(var i = 0;i<dtmListAnalysisExt.length;i++){
	       			if( dtmListAnalysisExt[i].checked==true){
	       				if(analysisExt==null && analysisExt==''){
	       					analysisExt=dtmListAnalysisExt[i].itemCode;
	       				}else{
	       					analysisExt+=","+dtmListAnalysisExt[i].itemCode;
							analysisExtArr.push(dtmListAnalysisExt[i].itemCode);
	       				}
	       			 }
	       		 }
	       		 $scope.analysisExtList=analysisExt.split(",");
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
			
		//console.log(vm.query.selectedRate);
       	params = {
					 versionId:versionId,
					 frequencyRate:vm.query.selectedRate.frequencyRate,
					 frequencyExpression:vm.query.selectedRate.frequencyExpression,
					 analysisExt:analysisExt,
					 recipent:recipent,cc:cc,
					 mailTrigger:mailTrigger,
					 baseLines: JSON.stringify(vm.baseLines),
					 packageType:packageType,
					 projectType:projectType,
					 projectNames:projectNames
					};
       	//保存
       	VersionManageService.saveVersionJob(params).then(function (result) {
	       	$scope.saveJobFlag=result.flag;
	       	$scope.count = $scope.count+1;
	       	$scope.saveJobMessage=result.errMsg;
      	});
      }
       
		  //代码评审信息
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
						if (typeof(reviewerAndDevelopersBoList)=='undefined' || !reviewerAndDevelopersBoList || reviewerAndDevelopersBoList.length == 0 ||  typeof(reviewerAndDevelopersBoList[0])=='undefined' ||  typeof(reviewerAndDevelopersBoList[0].newDevelopers)=='undefined' || reviewerAndDevelopersBoList[0].newDevelopers == null || reviewerAndDevelopersBoList[0].newDevelopers.length == 0) {
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
			 
       //保存代码评审
      function  saveReviewBoard(versionId,codereviewOpen,reviewerAndDevelopersStr){
       	var params ={
           		versionId:versionId,
   	        	codereviewOpen:codereviewOpen,
   	        	reviewerAndDevelopersStr:reviewerAndDevelopersStr,
           	};
    	VersionManageService.saveCodeReview(params).then(function (result) {
	       		 $scope.saveReviewFlag=result.flag;
		       	$scope.count = $scope.count+1;
    	});
     }
       
       

        ///////////////////Events//////////////////

      
      
      //添加一行
      $scope.add = function (){
      	
      	var reviewerAndDevelopersBoList = $scope.reviewerAndDevelopersBoList;
      	
      	var tempReviewerAndDevelopersBo = {};
      	tempReviewerAndDevelopersBo.reviewer = "";
      	tempReviewerAndDevelopersBo.newDevelopers = [];
      	if(reviewerAndDevelopersBoList[0].newDevelopers!=null &&  reviewerAndDevelopersBoList[0].newDevelopers.length >0 ){
      		for(var i = 0;i<reviewerAndDevelopersBoList[0].newDevelopers.length ; i++){
      			var tempDevelopers = {};
      			tempDevelopers.checked =false;
      			tempDevelopers.fullName = reviewerAndDevelopersBoList[0].newDevelopers[i].fullName;
      			tempDevelopers.userName = reviewerAndDevelopersBoList[0].newDevelopers[i].userName;
      			tempReviewerAndDevelopersBo.newDevelopers.push(tempDevelopers);
      		}
      	}
      	
      	
      	reviewerAndDevelopersBoList.push(tempReviewerAndDevelopersBo);
      	console.log(reviewerAndDevelopersBoList);
      }
      //删除本行
      $scope.del = function (index){
      	$scope.reviewerAndDevelopersBoList.splice(index,1);
      }
      
      
      $scope.removeDeployer = function (pindex,index){
      	$scope.reviewerAndDevelopersBoList[pindex].newDevelopers.splice(index,1)
      }
      
      
        //选人控件
        //鼠标点击选择下拉用户
        $scope.selectUser = function(user,index){
        	if($scope.step == '4'){
        		$scope.reviewerAndDevelopersBoList[index].reviewer.fullName = user;
            	$scope.reviewerAndDevelopersBoList[index].reviewer.userName = user.substring(user.length - 10).substring(1, 9);
        	}else{
        		$scope.userLable[index].model.value = user;	
        	}
        };
          
        
        $scope.queryByUser = function(index){
        	var reg =  /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D]*[a-zA-Z-（）]*[/(]?[0-9]{0,8}[/)]?$/; 
        	if($scope.step == '4'){
        		if(!reg.test($scope.reviewerAndDevelopersBoList[index].reviewer.fullName)){
        			$scope.reviewerAndDevelopersBoList[index].reviewer.fullName=null;
        		}
        	}else{
        		if(!reg.test($scope.userLable[index].model.value)){
        			$scope.userLable[index].model.value=null;
        		}
        	}
        };
        
        $scope.getUser = function(index){
        	var reg = /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-\u4E00-\u9FA5\uF900-\uFA2D（）]*[/(]*[0-9]{0,8}[/)]*$/; 
        	 
        	 if($scope.step == '4'){
        		  if(!reg.test($scope.reviewerAndDevelopersBoList[index].reviewer.fullName)){
              		$scope.reviewerAndDevelopersBoList[index].reviewer.fullName=null;
          		}else{
          			if(null != $scope.reviewerAndDevelopersBoList[index].reviewer.fullName && $scope.reviewerAndDevelopersBoList[index].reviewer.fullName != ''){
          				 var params ={
              					 "userFullName":$scope.reviewerAndDevelopersBoList[index].reviewer.fullName
              			 };
              			 HomeService.validateUser(params).then(function(result){
          			   		 if(!result.flag){
          			   			$scope.reviewerAndDevelopersBoList[index].reviewer.fullName=null;
          			   			 if(null!=result.allUsers){
          			   				 $scope.userList = result.allUsers;
          			   			 }
          			   		 }
          		         });
          			}
          		}
        	 }else{
        		 if(!reg.test($scope.userLable[index].model.value) || $scope.userLable[index].model.value ==null ||$scope.userLable[index].model.value == ''){
             		$scope.userLable[index].model.value=null;
         		}else{
         			 var params ={
         					 "userFullName":$scope.userLable[index].model.value
         			 };
         			 HomeService.validateUser(params).then(function(result){
   			   		 if(!result.flag){
   			   			 if(null!=result.allUsers){
   			   				 $scope.userList = result.allUsers;
   			   			 }
   			   		 }
   		         });
         		}
        	 }
        };
       
        $scope.obj.totalCount = function(item,dcDetailBoList,event){
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
