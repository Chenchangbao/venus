//代码库
angular.module('sncd').controller('CreateCodeRepositoryCtrl', ['$scope', 'SystemService','$state','$stateParams','HomeService','AlertService',
  function($scope, SystemService,$state,$stateParams,HomeService,AlertService) {
	'use strict';
	 var vm = $scope;
	 init();
	 var userData =$scope.userData={submitter:{value:null}};
     $scope.userLable=[{
             	model:userData.submitter
                }];
	 function init(){
		 var params={sysId:$stateParams.sysId};
		 sysDetailInfo(params);
		 $scope.issubmit=false;
		 //获取开发语言列表
//		 getDictItemListByType();
		 $scope.step = '1';
//		 $scope.nextDesc  = "完成";
     	//获取用户数据
     	HomeService.getAllUsers().then(function(result){
             $scope.userList = result.allUsers;
           });
	 }
	 
	 function sysDetailInfo(params){
		 SystemService.sysDetailInfo(params).then(function(result){
			 $scope.system= result.system;
			 $scope.system.svnServerFlag='0';//默认选择普通代码库
			 if($scope.system.sysType!='0'){
				 $scope.nextDesc  = "完成";
			 }else{
				 $scope.nextDesc  = "下一步";
			 }
		 });
	 }
	 
	 
	 //开发语言列表
	 function getDictItemListByType(){
		 SystemService.getDictItemListByType({"kind":"17"}).then(function (result){
			 $scope.dictItemList = result.dictItemList;
		 });
	 }
	 
//	 vm.changeNextDesc  = function (){
//		 if( vm.userData.devTech != "JAVA_WEB"){
//			 $scope.nextDesc  = "完成";
//		 }else{
//			 $scope.nextDesc  = "下一步";
//		 }
//	 }
	 
	 vm.goBack = function (){
		 $state.go("SystemManage");
		 
	 }
	 
	 //保存代码库
	 vm.createCodeRepository = function (invalid){
		 $scope.issubmit=true;
//		 swal("确认", "为您创建代码库中，请稍后", "success");  
		 var devTech = "";
		 
		 var sysCmo=$scope.system.sysCmo;
		 if($scope.system.sysCmo==null||$scope.system.sysCmo==""){
			 sysCmo=vm.userData.submitter.value;
		 }
		 if($scope.system.sysType=='0'){
			  devTech='JAVA_WEB';
		 }
		 SystemService.initSystem({devTech:devTech,sysCmo:sysCmo,sysId:$stateParams.sysId}).then(function (){
			 var svnServerFlagvalue=$scope.system.svnServerFlag;
//			 if(devTech == 'JAVA_WEB'){//SNF代码库
			 if($scope.system.sysType=='0'){//系统类型为0，默认为是java snf框架
				//保存系统基本信息
//				 SystemService.initSystem({devTech:'JAVA_WEB',sysCmo:sysCmo,sysId:$stateParams.sysId}).then(function (){
					//跳转创建SNF框架
//					window.open('codeRepos/toCreateCodeReposPage.htm?sysId='+$stateParams.sysId+"&from=new",'','width=620,height=600,left=150,top=150 toolbar=no,menubar=no,scrollbars=yes, resizable=yes,location=no, status=yes')
					$scope.step = '2';
					$scope.url = 'codeRepos/toCreateCodeReposPage.htm?sysId='+$stateParams.sysId+"&from=new"+"&svnServerFlag="+svnServerFlagvalue;
//				 })
			 }else{
				//普通代码库，svnServerFlag：0普通代码库 svnServerFlag：1安全加强代码库
				 SystemService.saveCommonCodeRepos({sysCnname:$scope.sys.sysCnname,sysId:$stateParams.sysId,svnServerFlag:svnServerFlagvalue,reposName:$scope.sys.sysName}).then(function (result){
					 if(result.isSuccess){
							AlertService.alert({
				                title: "创建成功",
				                content: '创建代码库成功!'}).then(function (){
							 $state.go("CodeRepository",{sysId:$stateParams.sysId,tab:'CodeRepository'});	 
						 })
					 }else{
						 AlertService.alert({
				                title: "创建失败",
				                content: '创建代码库失败!请联系朱文静(11010068)'});
					 }
				 });
			 }
	 }); 

	 }
	 
	 
	 //鼠标点击选择下拉用户
     $scope.selectUser = function(user,index){
     	$scope.userLable[index].model.value = user;
     };
       
     
     $scope.queryByUser = function(index){
     	var reg =  /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-（）]*[/(]?[0-9]{0,8}[/)]?$/; 
 		if(!reg.test($scope.userLable[index].model.value)){
 			$scope.userLable[index].model.value=null;
 		}
     };
     
     $scope.getUser = function(index){
    	 var reg = /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-\u4E00-\u9FA5\uF900-\uFA2D（）]*[/(]*[0-9]{0,8}[/)]*$/;
         	if(!reg.test($scope.userLable[index].model.value)){
         		$scope.userLable[index].model.value=null;
     		}else{
     			if($scope.userLable[index].model.value ==null ){
     				return ;
     			}
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
     };
    
	  
	  return vm;
	}

	
]);
