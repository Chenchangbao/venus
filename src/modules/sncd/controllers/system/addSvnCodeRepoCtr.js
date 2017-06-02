
angular.module('sncd').controller('addSvnCodeRepoCtr', ['$scope', 'SystemService', 'DialogService','$timeout','$stateParams','HomeService','AlertService','baseUrl','$location',
    function ($scope, SystemService, DialogService,$timeout,$stateParams,HomeService,AlertService,baseUrl,$location) {
	
	var userData =$scope.userData={submitter:{value:null}};
    $scope.userLable=[{
            	model:userData.submitter
               }];

        $scope.close = function () {
            DialogService.dismiss('system.addNewSvnCodeRepo');
        };


        //页面数据初始化
        init();
        
        function  init() {
        	$scope.type="0";
        	$scope.checkvalue=false;
        	$scope.reposrepeat=false;
        	$scope.des="下一步"
        	$scope.svnServerFlag="0";
            $scope.submit=false;
        	getAllSysType();
        	
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
//        //进入下一步
//        $scope.nextStep =function (invalid){
//        	if(invalid){
//        		return false;
//        	}
//        	$scope.step = '2';
//        }
		   //鼠标点击选择下拉用户
	    $scope.selectUser = function (user, index) {
				$scope.userLable[index].model.value = user;
	    };


	    $scope.queryByUser = function (index) {
				var reg = /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D]*[a-zA-Z-（）]*[/(]?[0-9]{0,8}[/)]?$/;
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
	    $scope.addSvnCodeRepos=function(invalid){
	    	if(invalid){
	    		$scope.checkvalue=true;
				return;
	    	}
	    	var paramsrepo={
	    			"reposName": $scope.sysName+"_"+$scope.repo	
	    	}
	    	SystemService.checkReposNameRepeat(paramsrepo).then(
	    		function(result){
	    			if(result.isRepeat){
	    				$scope.reposrepeat=true;
						return;
	    			}else{
	    		    	if($scope.type=='0'){
	    		    		//下一步
	    		    		$scope.type='1';
	    		    		$scope.des="完成"
	    		    		$scope.username=$scope.userLable[0].model.value;
	    		    	}else{
	    		    		var params={
	    		    				"sysId": $scope.sysId,
	    		    				"sysType": $scope.system.sysType,
	    		    				"reposName": $scope.sysName+"_"+$scope.repo,
	    		    				"svnServerFlag": $scope.svnServerFlag,
	    		    				"sysCmo": $scope.userLable[0].model.value
	    		    		};
	    		    	$scope.submit=true;
	    		    	SystemService.addNewCommonCodeRepos(params).then(function(result){
	    		    		var message="";
	    		    		if(result.isSuccess){
	    		    			message="创建成功！";
	    		    		}else{
	    		    			message="创建失败！";
	    		    		}
	    		    		alert(message);
	    		    		DialogService.accept('system.addNewSvnCodeRepo');
	    		    	})
	    		    }
	    			}
	    			
	    		}	
	    	
	    	
	    	)

	   }
    }
]);