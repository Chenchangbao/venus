//系统应用包controller
angular.module('sncd').controller('PackageConfigCtrl', ['$scope', 'SystemService','$state','$stateParams','$timeout',
  function($scope, SystemService,$state,$stateParams,$timeout) {
	'use strict';
    
    // /////////////////functions//////////////////
    function init() {
    	var sysId =  $stateParams.sysId;
    	createOrDetail(sysId);
    }
    
    function createOrDetail(sysId){
    	SystemService.createOrShowBuildConfig({sysId:sysId}).then(function (result){
    		$scope.showType = result.showType;
    		if(result.showType == '1'){//详情
    			getPackageConfigDetail({sysId:sysId});
    		}else if (result.showType == '2' ){//新增
    			$state.go("AddPackageConfig",{sysId:sysId});
    		}else{//提示
    			$scope.tips = result.tips;
    		}
    	})
    }
    

    // 查询包
    function getPackageConfigDetail(params){
    	SystemService.createOrShowBuildConfig(params).then(function(result){
    		    $scope.lasthistory = result.lasthistory;
    		    $scope.system=result.system;
    		    $scope.jenkinsConfigItem=result.jenkinsConfigItem;
    		    $scope.jenkinsConfigItem.sysType= $scope.system.sysType
    		    $scope.jenkinsPath=result.jenkinsPath;
    		    if(result.lasthistory.buildFlg=='W'){
    		    	$scope.testing=true;
    		    }else{
    		    	$scope.testing=false;
    		    }
      });
    }
    
    // 编辑配置
    $scope.editPackageConfig=function (){
    		SystemService.checkbuild({sysId:$stateParams.sysId}).then(function (result){
    			if(!result.flag){
    				swal("正在打包中...请稍后再试")
    				return false;
    			}else{
    				$state.go("EditPackageConfig",{"sysId":$stateParams.sysId,"editType":"1"})
    			}
    		})
    	
    }
    
    	  // 删除配置
        $scope.deletePackageConfig=function (jenkinsConfigItem){
        	
        	SystemService.checkbuild({sysId:$stateParams.sysId}).then(function (result){
    			if(!result.flag){
    				swal({   title: "正在打包中...请稍后再试!",   text: "本提示会在 2秒内关闭.",   timer: 2000 });
    				return false;
    			}else{
    				swal({   title: "确定删除?",   text: "一旦删除配置不可恢复!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Deleted!",   closeOnConfirm: false }, function(){  
    				SystemService.deletePackageConfig({"jenkinsConfigItem":jenkinsConfigItem}).then(function(result){
    					if(result.message == 'SUCCESS'){
    						swal("已删除!", "当前配置已删除", "success");
    						// 跳转创建
    						$state.go("AddPackageConfig", {
    							sysId: $stateParams.sysId
    						});
    					}else{
    						swal("删除失败!", "result.message", "success");
    					}
    				});
    				});
    			}
    		})
        	
        	
        }
        
        // 测试打包
        $scope.testPackageConfig=function(jenkinsConfigItem){
        	$scope.testing=true;
        	SystemService.checkbuild({sysId:$stateParams.sysId}).then(function (result){
    			if(!result.flag){
    				swal("正在打包中...请稍后再试");
    				return false;
    			}else{
		        	SystemService.testPackageConfig({"jenkinsConfigItem":jenkinsConfigItem}).then(function (result){
		        		swal("开始打包!", "你点击了打包按钮，正在打包中，请稍后~");
		        		$scope.jenkinsPath = result.jenkinsPath;
		        		$scope.lasthistory = result.lasthistory;
		     		    $scope.system=result.system;
		     		    $scope.jenkinsConfigItem=result.jenkinsConfigItem;
		     		    getConsole(result.jenkinsConfigItem.lastBmBuildHis.buildId);
		        	})
    			}
    		});
        }
        
        
      
        
    init();
    
    
  var getConsole =  function (buildId){
    	SystemService.getPackageConfigConsole({"buildId":buildId}).then(function(result){
    		if(result.flag=='0') {
    			$timeout((function (){
    				getConsole(buildId);
    			}), 10000);
    		}else{//修改结果
    			$scope.lasthistory.buildFlg=result.result;
    			$scope.testing=false;
    		}
    	})
    }
  }
]);
