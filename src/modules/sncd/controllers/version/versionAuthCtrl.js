angular.module('sncd').controller('VersionAuthCtrl', ['$scope','$q', 'VersionManageService','$state','$stateParams','HomeService','AlertService',
  function($scope, $q, VersionManageService,$state,$stateParams,HomeService,AlertService) {
    'use strict';

    ///////////////////functions//////////////////
		var vm = $scope;
    var newrUsers =$scope.newrUsers= {
        filterList: [], // 备选列表,
        filterValue: null, // 备选列表元素为对象时备选列表显示的属性，
        pickedList: [], // 已选内容列表,
        filterNumber: 20, // 备选列表显示条数 
        validFunction: validFunction, // 输入框校验
        canDirectInput: true,// 是否允许输入框直接输入
    };
    var newrwUsers = $scope.newrwUsers= {
            filterList: [], // 备选列表,
            filterValue: null, // 备选列表元素为对象时备选列表显示的属性，
            pickedList: [], // 已选内容列表,
            filterNumber: 20, // 备选列表显示条数 
            validFunction: validFunction, // 输入框校验
            canDirectInput: true,// 是否允许输入框直接输入
        };
    var permissionUsers = vm.permissionUsers= [],
				roleList = vm.roleList = [],
				permission = vm.permission = [],
				allUsers = [];
    
  
    
    function init() {
    	//获取用户数据
    	HomeService.getAllUsers().then(function(result){
    		newrwUsers.filterList = newrUsers.filterList = result.allUsers;
				allUsers = result.allUsers;
				getVersionPermission();
      });
    	
    	
    }
		
    function  validFunction(item,option){
     	//去重
    	for(var i=0;i<option.pickedList.length;i++){
    		if(option.pickedList[i]==item){
    			return $q.reject();
    		}
    	}
    	//canDirectInput 为true 验证
    	var reg =  /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-（）]*[/(]*[0-9]{0,8}[/)]*$/; 
    	if(!reg.test(item) || !item){
    		return $q.reject();
		}else{
			 var params ={
					 "userFullName":item
			 };
			 return HomeService.validateUser(params).then(function(result){
		   		 if(!result.flag){
		   			 if(null!=result.allUsers){
		   				 $scope.userList=newrwUsers.filterList = newrUsers.filterList = result.allUsers;
		   			 }
		   			return $q.reject();	
		   		 }
	         });
		}
    	 
    }
   

    // 查询版本信息
    function getVersionPermission(){
			vm.roleList = [];
      var params = {
        versionId:$stateParams.versionId,
        // sysId:$stateParams.sysId
      };
      VersionManageService.getVersionPermission(params).then(function (result){
    	  $scope.oldrwUser = result.rwUser;
				$scope.oldrUser = result.rUser;
				$scope.authtype = 'show';
				permissionUsers = [];
				vm.permissionList = result.permissionUsers;
					for (var item in result.permissionUsers) {
						permissionUsers.push({ name: item, value: result.permissionUsers[item] });
					}
					vm.permissionUsers = permissionUsers;
					//整合权限信息
					permissionUsers.forEach(function (permission) {
						var obj = {
							name: permission.name,
							filterList: allUsers, // 备选列表,
							filterValue: null, // 备选列表元素为对象时备选列表显示的属性，
							pickedList: permission.value, // 已选内容列表,
							filterNumber: 20, // 备选列表显示条数 
							validFunction: validFunction, // 输入框校验
							canDirectInput: true,// 是否允许输入框直接输入
						};
						vm.roleList.push(obj);
					})
			
	  	});
    }

    
    
    $scope.editVersionAuth = function (){
    	$scope.authtype= 'edit';
    	$scope.viewData = {};
    	//获取已选用户数据TODO
    	if($scope.oldrUser!=''){
    		newrUsers.pickedList = $scope.oldrUser.split(",");	
    	}
    	if($scope.oldrwUser!=''){
    		newrwUsers.pickedList =$scope.oldrwUser.split(",");	
    	}
	    
    }
    
    $scope.removeAuth =function(type,index){
    	if(type == 'rw'){
    		$scope.rwUsers.splice(index,1);
    	}else if (type =='r'){
    		$scope.rUsers.splice(index,1);
    	 }
    }
    
    
    $scope.saveVersionAuth = function (){
    	
    	var rUser = '';
    	var rwUser = '';
    	// var deployerUser = '';
    	// var staticDeployerUser = '';
    	//读写用户
    	if(newrwUsers.pickedList !=null && newrwUsers.pickedList.length >0){
    		for(var i =0;i<newrwUsers.pickedList.length ;i++){
    			if(rwUser == ''){
    				rwUser = newrwUsers.pickedList[i];
    			}else{
    				rwUser = rwUser + ","+ newrwUsers.pickedList[i];
    			}
    		}
    	}
    	//只读用户
    	if(newrUsers.pickedList !=null && newrUsers.pickedList.length >0){
    		if(rwUser!=""){
    			for(var i =0;i<newrUsers.pickedList.length ;i++){
    				for(var j =0;j<newrwUsers.pickedList.length ;j++){
    					if(newrUsers.pickedList[i]==newrwUsers.pickedList[j]){
    						delete newrUsers.pickedList[i];
    						break;
    					}
    				}
        		}
    		}
    		if(newrUsers.pickedList.length >0){
    			for(var i =0;i<newrUsers.pickedList.length ;i++){
    				if(newrUsers.pickedList[i]!=undefined){
	        			if(rUser == ''){
	        				rUser = newrUsers.pickedList[i];
	        			}else{
	        				rUser = rUser + ","+ newrUsers.pickedList[i];
	        			}
    				}
        		}
    			if(rUser==""){
        			newrUsers.pickedList=null;
        		}
    		}
    		
    	}
    	
    	vm.roleList.forEach(function (obj) {
					if (obj.name == '7016' && obj.pickedList.length == 0) {
						AlertService.alert({
							title: '非空警告',
							content: "版本管理人员不能为空！"
						})
					}
					permission[obj.name] = obj.pickedList;
				})
    	var versionPermission = [];
			for (var item in permission) {
				versionPermission.push({ rolePermission: item, userNos: permission[item] });
			}
    	
    	var params = {
    			oldrUser : $scope.oldrUser,
    			oldrwUser:$scope.oldrwUser,
    			rUser:rUser,
    			rwUser:rwUser,
    			// deployer:deployerUser,
    			// staticDeployer:staticDeployerUser,
					versionPermission:JSON.stringify(versionPermission),
    			versionId:$stateParams.versionId,
    			sysId:$stateParams.sysId
    	}
    	
    	
    	VersionManageService.saveVersionUserPermission(params).then(function(){
    		AlertService.alert({
                title: "更新成功",
                content: '更新版本权限成功!'
            }).then(function() {
            	init();
            });
    		
    	})
    	
    }

    $scope.exitEdit =function (){
    	$scope.authtype  ='show'
    }

    init();
    
  }
]);
