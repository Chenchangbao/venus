//代码库
angular.module('sncd').controller('CodeRepositoryCtrl', ['$scope', 'SystemService','$state','$stateParams','HomeService','AlertService',
  function($scope, SystemService,$state,$stateParams,HomeService,AlertService) {
	'use strict';
	 var vm = $scope;
	  
	 init();
	 
	 
	 var newrUsers =$scope.newrUsers= {
		        filterList: [], // 备选列表,
		        filterValue: null, // 备选列表元素为对象时备选列表显示的属性，
		        pickedList: [], // 已选内容列表,
		        filterNumber: 20, // 备选列表显示条数 
		        validFunction: validFunction, // 输入框校验
		        canDirectInput: true,// 是否允许输入框直接输入
	  };
	 
	 function init(){
		 $scope.type = 'show';
		 
		 var params = {
				sysId:$stateParams.sysId
		 }
		 
		 
		 SystemService.getCodeRepository(params).then(function (result){
			 var svnUserList = result.svnUserList;
			 
			 var rUsers = '';
			 var rwUsers = '';
			 
			 if(svnUserList!=null && svnUserList.length >0){
				 for(var i = 0;i<svnUserList.length ; i++){
					 if(svnUserList[i].currentPermission == 'r'){
						 if(rUsers == ''){
							 rUsers = svnUserList[i].fullName + "("+svnUserList[i].userName+")";
						 }else{
							 rUsers = rUsers +","+svnUserList[i].fullName+"("+svnUserList[i].userName+")";
						 }
					 }
					 if(svnUserList[i].currentPermission == 'rw'){
						 if(rwUsers == ''){
							 rwUsers = svnUserList[i].fullName+"("+svnUserList[i].userName+")";
						 }else{
							 rwUsers = rwUsers +","+svnUserList[i].fullName + "("+svnUserList[i].userName+")";
						 }
					 }
				 }
			 }
			 
			 $scope.oldrUser = rUsers;
			 
			 $scope.rUsers = rUsers;
			 $scope.rwUsers = rwUsers;
			 $scope.repos = result.repos;
			 $scope.svnURL = result.repos.url;
			 $scope.rootSvnURL = result.repos.url;
			 vm.areaData= [{
				 id:result.repos.svnServerId + "/"+result.repos.reposName+"/",
				 pId:"0",
				 $collapsed:true,
				 name:result.repos.reposName,
				 svnURL:result.repos.url,
				 parent:true
			 }]
			 
		 })
		 
		 
		//获取用户数据
	    	HomeService.getAllUsers().then(function(result){
	    		newrUsers.filterList = result.allUsers;
	          });
		 
	 }
	 
	function updateShowPermission(params){
		  SystemService.getPermissionByUrl(params).then(function (result){
			  	var rUserList  = result.rUserList;
			  	var rwUserList = result.rwUserList;
			  
			  	var rUsers = '';
			  	var rwUsers = '';
				for(var i = 0;i<rUserList.length && rUserList != null ; i++){
						 if(rUsers == ''){
							 rUsers = rUserList[i].fullName + "("+rUserList[i].userName+")";
						 }else{
							 rUsers = rUsers +","+rUserList[i].fullName+"("+rUserList[i].userName+")";
						 }
				}
			 
				for(var i = 0;i<rwUserList.length && rwUserList != null ; i++){
					 if(rwUsers == ''){
						 rwUsers = rwUserList[i].fullName + "("+rwUserList[i].userName+")";
					 }else{
						 rwUsers = rwUsers +","+rwUserList[i].fullName+"("+rwUserList[i].userName+")";
					 }
				}
				 
				vm.rUsers = rUsers;
				vm.rwUsers = rwUsers;
				
			  
		  });
	} 
	 
	 
	  //点击节点
	  vm.$on('sn.controls.tree:selectedNodeChanged', function(e,d){
		  var params={url:d.currentNode.svnURL};
			 updateShowPermission(params);
//			 vm.svnURL = d.newNode.svnURL;
//		  SystemService.getPermissionByUrl({"url": vm.svnURL}).then(function (result){
//			  	var rUserList  = result.rUserList;
//			  	var rwUserList = result.rwUserList;
//			  
//			  	var rUsers = '';
//			  	var rwUsers = '';
//				for(var i = 0;i<rUserList.length && rUserList != null ; i++){
//						 if(rUsers == ''){
//							 rUsers = rUserList[i].fullName + "("+rUserList[i].userName+")";
//						 }else{
//							 rUsers = rUsers +","+rUserList[i].fullName+"("+rUserList[i].userName+")";
//						 }
//				}
//			 
//				for(var i = 0;i<rwUserList.length && rwUserList != null ; i++){
//					 if(rwUsers == ''){
//						 rwUsers = rwUserList[i].fullName + "("+rwUserList[i].userName+")";
//					 }else{
//						 rwUsers = rwUsers +","+rwUserList[i].fullName+"("+rwUserList[i].userName+")";
//					 }
//				}
//				 
//				vm.rUsers = rUsers;
//				vm.rwUsers = rwUsers;
//				
//			  
//		  })
		  
	  });
	  
	  //点击图标
	  vm.$on('sn.controls.tree:nodeIconClicked', function(e,d){
		  vm.svnURL=d.currentNode.svnURL;
		  if(!d.currentNode.$collapsed && (d.currentNode.children==null  ||  d.currentNode.children.length == 0) ){//第一次展开时请求后台
			  var data = vm.areaData;
			  SystemService.getCodeRepositoryTree({svnURL:d.currentNode.svnURL}).then(function (result){
				  var reposTree = result.reposTree;
				  d.currentNode.children =  result.reposTree;
			  });
		  }
		 var params={url:d.currentNode.svnURL};
		 updateShowPermission(params);
	  });
	  
	  $scope.edit = function (){
		  $scope.type = 'edit';
		  
		//获取已选用户数据TODO
		if($scope.oldrUser!=null && $scope.oldrUser.length > 0){
			newrUsers.pickedList = $scope.oldrUser.split(",");	
		}
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
	    	if(!reg.test(item)){
	    		return $q.reject();
			}else{
				 var params ={
						 "userFullName":item
				 };
				 return HomeService.validateUser(params).then(function(result){
			   		 if(!result.flag){
			   			 if(null!=result.allUsers){
			   				 staticDeployer.filterList=deployer.filterList=newrwUsers.filterList = newrUsers.filterList = result.allUsers;
			   			 }
			   			return $q.reject();	
			   		 }
		         });
			}
	    	 
	    }
	   
	  
	  
	  $scope.exitEdit = function (){
		  init();
	  }
	  
	  
	  $scope.updatePermission = function (){
		  var rUser =  '';
		  var newrUser = newrUsers.pickedList;
		  if(newrUser !=null && newrUser.length > 0 ){
			  for(var i = 0;i<newrUser.length;i++){
				  if(i == 0){
					  rUser = newrUser[i];  
				  }else{
					  rUser = rUser +  ","+newrUser[i];
				  }
			  }
		  }
		  
		  var params = {
				 sysId:$stateParams.sysId,
				 svnUrl : $scope.repos.url,
				 rUser: rUser,
				 oldrUser:$scope.oldrUser,
				 reposName:$scope.repos.reposName
		  }
		  
		  SystemService.saveCodeRepositoryPermission(params).then(function (){
			  AlertService.alert({
	                title: "更新成功",
	                content: '更新代码库权限成功!'
	            }).then(function() {
	            	init();
	            });
		  })
	  }
	  
	  return vm;
	}

	
]);
