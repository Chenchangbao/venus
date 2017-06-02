//系统应用包controller
angular.module('sncd').controller('SystemPackageCtrl', ['$scope', 'SystemService','$state','$stateParams','AlertService',
  function($scope, SystemService,$state,$stateParams,AlertService) {
    'use strict';
    

    ///////////////////functions//////////////////
    function init() {
    	var sysId =  $stateParams.sysId;
    	var params = { sysId: sysId };
    	getPackageBySys(params);
    }

    // 查询包
    function getPackageBySys(params){
    	SystemService.getPackageBySys(params).then(function(result){
        $scope.packageList = result.datas;
        $scope.sysId = result.sysId;
        $scope.repos = result.repos;
      });
    }

    //编辑包，校验是否能够编辑
    $scope.updatePackage = function (sysId,packageInfo){
    	SystemService.isSysPackageUsing({"packageId":packageInfo.packageId}).then(function(result){
    		if(!result.isSysPackageUsing){
    			alert("该应用包已配置可用发布环境，无法修改。若需修改发布包信息，请联系平台管理员!");
    			return false;
    		}else{
    			//进入其他判断
    			
    			//进入编辑页面
    			$state.go("SystemPackageAdd", {
    				sysId: $stateParams.sysId,
    				packageId:packageInfo.packageId
    	        });
    		}
    	});
    	
    }
    
    
    //删除包
    $scope.delPackage = function(packageInfo,index){
    	var params = {
    		packageId:packageInfo.packageId,
    		sysId:packageInfo.sysId
    	};
    	SystemService.packageIsConfig(params).then(function (data){
    		 var del = "";
		     var branchRelate = "false";
    		 if(data.processStatus){
		        	alert("应用包正在发布中，不可以进行删除操作。");
		        	return false;
		        }else if (data.isConfigDu){
		        	alert("部署单元已经关联云服务器，请销毁云服务器再进行删除操作。");
		        	return false;
		        }
		        	else{
			        //若发布包已经配置环境，但是没有被分支选中
					if(data.isConfig&&data.branchList.length==0){
						del=confirm("该发布包已经登记了配置信息，如果“确认”则一并删除该发布包的配置信息，如新增要重新联系运维工程师登记部署配置，否则请“取消”。");
					}else if(!data.isConfig&&data.branchList.length==0){
						//若发布包没有配置环境，并且没有被系统任何分支选中
						del=confirm("确认删除该发布包?");
					}else if(data.isConfig&&data.branchList.length!=0){
						//若发布包已经配置环境，并且被系统的一个或几个分支选中
						var branchNames = "";
						
						for(var i = 0 ;i<data.branchList.length ; i++){
							branchNames += "“"+data.branchList[i].branchName+"”,";
						}
						
						del=confirm("该发布包已经登记配置信息，并且被以下分支使用:"+branchNames+"删除该包会一并删除配置信息，可能会影响分支发布，删除后需及时维护分支信息");
						branchRelate = "true";
						}else{
							//若发布包没有配置环境，但是已经被系统的一个或几个分支选中
							var branchNames = "";
							for(var i = 0 ;i<data.branchList.length ; i++){
								branchNames += "“"+data.branchList[i].branchName+"”,";
							}
							del=confirm("该发布包已经被以下分支使用:"+branchNames+"删除该包可能会影响分支发布，删除后需及时维护分支信息");
							branchRelate = "true";
						}
						
		        }
    		 
    		 
    		 //执行删除操作
    		 if(del==true){
    			 params ={
        				 "packageInfo":packageInfo
        		 }
        		 
        		 SystemService.makePackageUnActive(params).then(function (data){
        				AlertService.alert({
                            title: "删除成功",
                            content: '删除应用发布包成功!'
                        }).then(function() {
                        		$scope.packageList.splice(index,1);
                        });
        		});
    		 }
    		 
    	});
    	
    }
    
    
    init();

  }
]);
