//系统应用包controller
angular.module('sncd').controller('SystemDetailCtrl', ['$scope', 'SystemService', '$state', '$stateParams', 'HomeService','VersionManageService' ,'AlertService',
  function ($scope, SystemService, $state, $stateParams, HomeService,VersionManageService,AlertService) {
		'use strict';
		var oldsysType="";
		var formData = $scope.formData = {},
			pager = $scope.pager = {
                pageNumber: 1,
                totalCount: 0, //总条数
                pageSize: 5
            },
						//版本的所有状态
				statusList = $scope.statusList = [
				{code: '', name: '全部'},
    		{'code': "059", 'name': "开发中"},
    		{'code': "060", 'name': "已封版"},
   		{'code': "063", 'name': "已合并"},
   		{'code': "178", 'name': "已废弃"},
//    		{'code': "061", 'name': "PRE封版"},
//    		{'code': "062", 'name': "PRD封版"},
    		{ code: "0591", name:'测试中'}
            ];
		
		var userData =$scope.userData={submitter:{value:null}};
	     $scope.userLable=[{
	             	model:userData.submitter
	                }];
///////////////////functions//////////////////
    function init() {
			var sysId = $stateParams.sysId;
			var params = { sysId: sysId };
			qualityTrend();
			sysDetailInfo(params);
			getAllSysType();
			getVersionBySys(params);
			//获取用户数据
			HomeService.getAllUsers().then(function (result) {
				$scope.userList = result.allUsers;
			});
    }

		//查询系统类型
		function getAllSysType() {
			SystemService.getAllSysType().then(function (result) {
    		  $scope.sysTypelist = result;
      });
		}

    // 查询系统
    function sysDetailInfo(params) {
			SystemService.sysDetailInfo(params).then(function (result) {
				$scope.system = result.system;
				$scope.relateSysList = result.relateSysList;
				oldsysType=result.system.sysType;
      });
    }

    $scope.editSystem = function (orgId) {
    	$scope.changeSysTypeNotice();
				$scope.type = "edit";

    };
    $scope.editSystemCmo = function (orgId) {
		$scope.cmo = "edit";

};
	$scope.changeSysTypeNotice=function(){
		var message ="\t可选系统类型(6种)："+
				"Java-snf,安卓(android),IOS,C语言系统,SAP系统,其他;\n"+
				" \t其中:"+
				"【Java-snf支持】: "+
				"代码托管SVN(snf框架),版本管理,构件仓库,质量分析,单元测试,安全扫描,在线评审,打包配置Maven,ant,发布管理was,jboss,nginxjboss,静态(其中一级系统约束必须质量分析,单元测试);"+
				"【安卓(android)支持】:"+
				"代码托管SVN,版本管理,构件仓库,打包配置gradle;"+
				"【IOS支持】:"+
				"代码托管SVN,版本管理,构件仓库,打包配置shell;"+
				"【C语言系统支持】:"+
				"代码托管SVN,版本管理,构件仓库,打包配置ant-C,发布管理C-Serevr(tar包+自定义脚本);"+
				"【SAP系统支持】:"+
				"发布管理-测试SAP,请求号管理;"+
				"【其他支持】:"+
				"代码托管SVN,版本管理,构件仓库,质量分析,单元测试,安全扫描,在线评审,打包配置Maven,ant,发布管理was,jboss,nginxjboss,静态;";
		AlertService.alert({
			title: "提示",
			content: message
		});
	}

		//修改系统类型
    $scope.updateSystem = function () {
			//var sysCmo = $scope.userLable[0].model.value;
			//  var orgTwoId = $scope.system.newOrgTwo ;
			//var orgTwoId = $scope.system.orgTwoId
    	
    	if($scope.system.sysType==oldsysType){
    		AlertService.alert({
				title: "提示",
				content: "您未对系统类型进行修改,请修改后点击 '修改',或者点击 '取消' 取消本次操作！"
			});
    		return false;
    	}
			var params = {
				sysId: $scope.system.sysId,
				sysType: $scope.system.sysType
			};
			SystemService.updateSystem(params).then(function (result) {
				if(result.errCode == "0"&&  $scope.system.sysType != "1"){
					AlertService.alert({
                title: "修改成功",
                content: "系统类型修改成功！"
            }).then(function() {
						location.reload(true);   
					});
				}else if (result.errCode == "0"&&  $scope.system.sysType == "1"){
					AlertService.alert({
						title: "修改成功",
						content: "系统类型修改成功！,您当前的系统为sap系统，新版暂不支持sap系统，请到旧版本进行相关操作！"
					}).then(function() {
						location.reload(true) ;  
					});
				
				}else{
					AlertService.alert({
                title: "修改失败",
                content: result.errMsg
            }).then(function() {
						init();	
						$scope.type = null;
					});
				}
			})
    };
    //修改系统管理员(CMO)
    $scope.updateSystemManager = function () {
    	//var sysCmo = $scope.userLable[0].model.value;
    	//  var orgTwoId = $scope.system.newOrgTwo ;
    	//var orgTwoId = $scope.system.orgTwoId
    	if($scope.userLable[0].model.value == undefined){
    		AlertService.alert({
				title: "提示",
				content: "系统管理员不能为空！"
			});
    		return false;
    	}
    	
    	
    	var params = {
    			sysId: $scope.system.sysId,
    			sysCmo: $scope.userLable[0].model.value
    	};
    	SystemService.updateSystemManager(params).then(function (result) {
    		if(result.errCode == "0"){
    			AlertService.alert({
    				title: "修改成功",
    				content: "系统管理员修改成功！"
    			}).then(function() {
    				init();	
    				$scope.cmo = null;
    			});
    		}else{
    			AlertService.alert({
    				title: "修改失败",
    				content: result.errMsg
    			}).then(function() {
    				init();	
    				$scope.cmo = null;
    			});
    		}
    	})
    }
		
		function qualityTrend() {
      var params = {sysId:$stateParams.sysId}; 
      HomeService.getStatistics(params).then(function (result) {
    	  				if(null==result.versionStatusNums['0591']){
    	  						$scope.testing=0;  
    	  					}else{
    	  						$scope.testing = result.versionStatusNums['0591'];
    	  				}
    	  				if(null==result.versionStatusNums['060']){
    	  					$scope.closed=0;  
    	  				}else{
    	  					$scope.closed = result.versionStatusNums['060'];
    	  				}
    	  				if(null==result.versionStatusNums['059']){
    	  					$scope.developing=0;  
    	  				}else{
    	  					$scope.developing = result.versionStatusNums['059'];
    	  				}
						
						$scope.option = {
							eventHandles: {
                        click: function (param) {
                            if (param.name == "测试中") {
                                $state.go("VersionProcess", {
                                    status: "0591",
                                    sysId: $stateParams.sysId
                                });
                            } else if (param.name == "开发中") {
                                $state.go("VersionProcess", {
                                    status: "059",
                                    sysId: $stateParams.sysId
                                });
                            } else {
                                $state.go("VersionProcess", {
                                    status: "060",
                                    sysId: $stateParams.sysId
                                });
                            }
                        }
                    },
							tooltip: {
									trigger: 'item',
									formatter: "{b}: <br/> {c} ({d}%)"
							},
							series: [
									{
											type: 'pie',
											radius: [40, 80],
											center: [160, 150],
											avoidLabelOverlap: false,
											label: {
													normal: {
															show: false,
															position: 'center'
													},
													emphasis: {
															show: true,
															textStyle: {
																	fontSize: '16',
																	fontWeight: 'bold'
															}
													}
											},
											
											 itemStyle : {
													normal : {
															label : {
																	show : false
															},
															labelLine : {
																	show : false
															}
													}
											 },
											labelLine: {
													normal: {
															show: false
													}
											},
											data: [
													{ value: result.versionStatusNums['0591'], name: '测试中', itemStyle:{
																normal:{color:'#93A2CB'}}  },
													{ value: result.versionStatusNums['059'], name: '开发中', itemStyle:{
																normal:{color:'#72BEAC'}}  },
													{ value: result.versionStatusNums['060'], name: '已封板', itemStyle:{
																normal:{color:'#E5B87C'}}  }
											]
									}
							]
					};
        });
       }
		
		
    $scope.exitEdit = function () {
			$scope.type = null;
			init();
    }
    $scope.exitEditCmo = function () {
		$scope.cmo = null;
		init();
}
		
		// 查询系统下分支
    function getVersionBySys(params){
    	params.pageSize = pager.pageSize;
			params.versionStatus = (formData.selectedStatus||{}).code||'';
    	VersionManageService.getVersionBySys(params).then(function(result){
    			$scope.sysId = $stateParams.sysId;
    		    $scope.versionList=result.datas;
    		    $scope.pager.totalCount = result.totalDataCount;
						$scope.pager.pageNumber = result.pageNumber;
						$scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);
      });
    }
		  
		$scope.statusFilter = function(status) {
			 var params = { sysId: $stateParams.sysId };
       formData.selectedStatus = status;
       getVersionBySys(params);
    };
    ///////////////////Events//////////////////
   
    //分页
    $scope.$on('sn.controls.pager:pageIndexChanged', function (evt, page) { // 分页操作
        evt.stopPropagation();
        var params = { sysId: $stateParams.sysId,pageNumber:page.pageIndex + 1 };
        getVersionBySys(params);
    });
		
    init();


    //鼠标点击选择下拉用户
    $scope.selectUser = function (user, index) {
			$scope.userLable[index].model.value = user;
    };


    $scope.queryByUser = function (index) {
			var reg = /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-（）]*[/(]?[0-9]{0,8}[/)]?$/;
			if (!reg.test($scope.userLable[index].model.value)) {
				$scope.userLable[index].model.value = null;
			}
    };

    $scope.getUser = function (index) {
    	 var reg = /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-\u4E00-\u9FA5\uF900-\uFA2D（）]*[/(]*[0-9]{0,8}[/)]*$/;
			if (!reg.test($scope.userLable[index].model.value)) {
				$scope.userLable[index].model.value = null;
    		} else {
				if (null != $scope.userLable[index].model.value && $scope.userLable[index].model.value != '') {
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

  }
]);
