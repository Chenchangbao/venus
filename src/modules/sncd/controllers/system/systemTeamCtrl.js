//系统应用包controller
angular.module('sncd').controller('SystemTeamCtrl', ['$scope', 'SystemService','$state','$stateParams','HomeService','AlertService','$q',
  function($scope, SystemService,$state,$stateParams,HomeService,AlertService,$q) {
	'use strict';
    
    ///////////////////functions//////////////////
	  var newRoleName =$scope.newRoleName= {
		        filterList: [], // 备选列表,
		        filterValue: null, // 备选列表元素为对象时备选列表显示的属性，
		        pickedList: [], // 已选内容列表,
		        filterNumber: 20, // 备选列表显示条数 
		        validFunction: validFunction, // 输入框校验
		        canDirectInput: true,// 是否允许输入框直接输入
		    };
	
	
    function init() {
    	var sysId =  $stateParams.sysId;
    	var params = { sysId: sysId };
    	getSystemTeam(params);
    	$scope.selectedTab = '1';
    	$scope.type  = 'show';
			$scope.createflag = false;
    }
    

    // 查询系统
    function getSystemTeam(params){
    	SystemService.getSystemTeam(params).then(function(result){
    		    $scope.system=result.system;
    		    $scope.dtmList=result.dtmList;
      });
    }

    init();

    $scope.selectTab = function (type){
    	$scope.selectedTab = type;
    	
    	if(type == '2'){
    		$state.go('SystemPermission');
    	}
    }
		//跳转权限查询
		$scope.queryPermission = function (type,role){
    	$scope.selectedTab = type;
    	if(type == '2'){
    		$state.go('SystemPermission',{roleName:role.roleName});
    	}
    }
		
		//创建自定义角色
		$scope.createNewRole = function () {
			$scope.createflag = true;
			
		}
		
    //跳转至编辑页面
    $scope.editTeam = function (){
    	$scope.type  = 'edit';
    	
    	var dtmList  = $scope.dtmList ;
    	
    	if(dtmList!=null && dtmList.length >0){
    		for(var i =0;i<dtmList.length;i++){
    			dtmList[i].new_rolename = dtmList[i].dtm_rolename;
    		}
    	}
    	$scope.dtmList = dtmList;
    	
    	//获取用户数据
    	HomeService.getAllUsers().then(function(result){
    		newRoleName.filterList = result.allUsers;
          });
    }
    
    //编辑角色
    $scope.editDeveloper = function (index){
    	if($scope.dtmList[index].dtm_rolename!=''){
    		newRoleName.pickedList =  $scope.dtmList[index].dtm_rolename.split(",");	
    	}else{
    		newRoleName.pickedList =  [];
    	}
    	
    	$scope.index = index;
    	
    }
    
    
   $scope.saveNewRoleName = function (index){
	   var dtmList  =  $scope.dtmList ;
	   
	   var new_rolename = '';
	   
	   
	   if((dtmList[index].roleName == '117' ||dtmList[index].roleName == '116') &&  newRoleName.pickedList!=null && newRoleName.pickedList.length > 1 ){
		   alert("只能添加一位!");
		   return ;
	   }
	   
	   if(newRoleName.pickedList!=null && newRoleName.pickedList.length >0){
		   for(var i = 0;i<newRoleName.pickedList.length ;i++){
			   if(new_rolename == ''){
				   new_rolename = newRoleName.pickedList[i];
			   }else{
				   new_rolename = new_rolename+","+ newRoleName.pickedList[i];
			   }
		   }
	   }
	   dtmList[index].new_rolename = new_rolename;
	   
	   
	   $scope.index  = '-1';
   }
    
   $scope.updateTeam = function (){
	   var roles  = "";
	   var new_rolenames = "";
	   
	   var dtmList = $scope.dtmList;
	   
	   for(var i = 0;i<dtmList.length;i++){
		   //组装角色ID
		  if(roles == ''){
			  roles = dtmList[i].roleName;
		  }else{
			  roles  = roles +","+ dtmList[i].roleName;
		  }
		   //组装角色工号
		   if(i == 0){
			   new_rolenames = dtmList[i].new_rolename
		   }else{
			   new_rolenames = new_rolenames+";"+dtmList[i].new_rolename;
		   }
	   }
	   
	   SystemService.updateTeam({roles:roles,newRolename:new_rolenames,sysId:$stateParams.sysId}).then(function (result){
		   
			AlertService.alert({
                title: "更新成功",
                content: '更新系统团队成功!'
            }).then(function() {
            	location.reload();
            });
		   
	   })
	   
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
    	if(!reg.test(item) || item=='' || item==null){
    		return $q.reject();
		}else{
			 var params ={
					 "userFullName":item
			 };
			 return HomeService.validateUser(params).then(function(result){
		   		 if(!result.flag){
		   			 //选人，如果没有人，从ldap中获取，更新人员信息
		   			 if(null!=result.allUsers){
		   				newRoleName.filterList = result.allUsers;
		   			 }
		   			return $q.reject();	
		   		 }
	         });
		}
    	 
    }
    
  }
]);
