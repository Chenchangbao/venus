angular.module('sncd').controller('CreateSysVersionCtrl', ['$scope','SystemService', 'VersionManageService', '$state', '$stateParams',
    function ($scope, SystemService,VersionManageService, $state, $stateParams) {
        'use strict';

        var vm = $scope,
            formData = vm.formData = {},
            pager = vm.pager = {
                pageNumber: 1,
                totalCount: 0, //总条数
                pageSize: 10
            };

        ////////////////functions/////////////////
        function init() {
        	//获取我的系统列表
        	
        	
        	
        	
        	
        	
        }
        

        $scope.selectTab = function (tabNo) {
            $scope.selectedTab = tabNo;
        }
        
        //
        $scope.isVersionExist = function (version){
        	if($scope.postData.version!=null && $scope.postData.version != ''){
        		VersionManageService.isVersionExist({'versionInfo':JSON.stringify($scope.postData)}).then(function (result){
            		if(result.isExist){
            			$scope.versionErrorMsg = "版本号已存在";
                    	return false;
            		}else{
            			$scope.versionErrorMsg = "";
                    	return false;
            		}
            	})	
        	}
        }
        

        //保存分支信息
        $scope.saveVersion = function(invalid){
        	
        	if(invalid || $scope.versionErrorMsg != '' ){
                return;
             }
        	
        	var packList =  $scope.sys.sysPackageList;
      	    for(var i = 0; packList  && i < packList.length; i++){
      		  if(packList[i].selectPack){
      			if($scope.postData.selectPackage == '' || $scope.postData.selectPackage == null ){
      				$scope.postData.selectPackage = $scope.sys.sysPackageList[i].packageId
      			}else{
      				$scope.postData.selectPackage =$scope.postData.selectPackage + ","+ $scope.sys.sysPackageList[i].packageId
      			}
      		  }
            }
      	    
      	  $scope.postData.sysId = $stateParams.sysId;
      	  
      	VersionManageService.saveVersion({
            	'versionInfo':JSON.stringify($scope.postData)
            	}).then(function (result) {
                    if(result.errCode == '0'){
                      $state.go('VersionProcess')
                    }else{
                      AlertService.alert({
                        title: '提交出错',
                        content: result.errMsg || '系统出错'
                      });
                    }
            });
        }

        $scope.goBack = function(){
            $state.go('VersionProcess');
        }

        ///////////////////Events//////////////////

        //获取页面初始化信息
        init();
        return vm;
    }
]);
