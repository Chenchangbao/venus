angular.module('sncd').controller('UnfreezenVersionCtrl', ['$scope', 'VersionManageService','$state','$stateParams','HomeService','$q',
  function($scope, VersionManageService,$state,$stateParams,HomeService,$q) {
    'use strict';

    var vm = $scope,
      formData = vm.formData = {},
      pager = vm.pager = {
        pageNumber: 1,
        totalCount: 0, //总条数
        pageSize: 10
      };

    
    //封装请求对象
var  unfreezen =    $scope.unfreezen={
    		sysId:"",
    		branchId:"",
    		problemDesc:"",
    		unfrezenReason:"",
    		connactUser:""
    };
    
    
    $scope.userLable=[{
    	name:"解版责任人",
    	model:unfreezen.connactUser
       }];


    var newrwUsers =$scope.newrwUsers= {
            filterList: [], // 备选列表,
            filterValue: null, //v 备选列表元素为对象时备选列表显示的属性，
            pickedList: [], // 已选内容列表,
            filterNumber: 20, // 备选列表显示条数 
            validFunction: validFunction, // 输入框校验
            canDirectInput: true,// 是否允许输入框直接输入
        };
    
    
    ///////////////////functions//////////////////
    function init() {
    	vm.rwinfo=true;
    	unfreezenVersionInit();
    	
    	
        
        
    	//获取用户数据
    	HomeService.getAllUsers().then(function(result){
    		newrwUsers.filterList = result.allUsers;
    		   $scope.userList = result.allUsers;
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
		   				newrwUsers.filterList = result.allUsers;
		   			 }
		   			return $q.reject();	
		   		 }
	         });
		}
    	 
    }
    
    
    //选人控件
    //鼠标点击选择下拉用户
    $scope.selectUser = function(user,index){
    		$scope.userLable[index].model.value = user;	
    };
      
    
    $scope.queryByUser = function(index){
    	var reg =  /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-（）]*[/(]?[0-9]{0,8}[/)]?$/; 
    		if(!reg.test($scope.userLable[index].model.value) && $scope.userLable[index].model.value!=null && $scope.userLable[index].model.value!= ''){
    			$scope.userLable[index].model.value=null;
    		}
    };
    
    $scope.getUser = function(index){
    	var reg = /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-\u4E00-\u9FA5\uF900-\uFA2D（）]*[/(]*[0-9]{0,8}[/)]*$/;
    	 
		 if($scope.userLable[index].model.value== null || $scope.userLable[index].model.value ==''||!reg.test($scope.userLable[index].model.value)){
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
	 
    };
   
    

    // 查询版本列表
    function unfreezenVersionInit(){

      var params = {
        versionId: $stateParams.versionId
      };

      
      
      VersionManageService.unfreezenVersionInit(params).then(function(result){
        $scope.version = result.branchBo;
        $scope.userName=result.userName;
        
        //初始化
        $scope.unfreezen.sysId=result.branchBo.sysId;
        $scope.unfreezen.branchId=result.branchBo.branchId;
        
        $scope.version.userPermissions="";
        //解版原因
        var unfreezenReason =  $scope.unfreezenReasons =  [{id:"155",reasonDesc:'需求不明确'},
                                                          {id:"156",reasonDesc:"代码问题"},
                                                          {id:"157",reasonDesc:"测试问题"},
                                                          {id:"158",reasonDesc:"其他"}];
      });
    }

    /////////////////$scope functions/////////////////

    ///////////////////Events//////////////////
    //分页
    vm.$on('sn.controls.pager:pageIndexChanged', function(evt, page) { // 分页操作
      evt.stopPropagation();
      pager.pageNumber = page.pageIndex + 1;
      queryMyVersion(pager.pageNumber);
    });

    init();

    //解版    
    $scope.unfreezenVersion=function (){
    	//判断是否能够解版
    	VersionManageService.isBranchHasUnFinishRequest({versionId:$stateParams.versionId}).then(function (result){

    		if(result.isHas){
    			alert("此分支有尚未结束的生产发布单【"+result.requestNo+"】，请与申请人【"+result.userName+"】联系,生产单关闭前，不能解版!");
    			return false;
    		}else{//跳转解版页面
    			
    			
    			
    			//表单校验
    	    	if($scope.unfreezenForm.$invalid || newrwUsers.pickedList.length == 0){
    	    		vm.rwinfo=false;
    	            return;
    	        }
    	    	
    	    	$scope.unfreezen.connactUser = $scope.userLable[0].model.value;
    	    	
    	    	
    	    	var userPermissions = newrwUsers.pickedList;
    	    	var tempPermissions = "";
    	    	if(userPermissions.length > 0 ){
    	    		for(var i =0;i<userPermissions.length;i++){
    	    			if(i == 0 ){
    	    				tempPermissions = userPermissions[i] + ":rw"	
    	    			}else{
    	    				tempPermissions = tempPermissions +","+ userPermissions[i] + ":rw"	;
    	    			}
    	    			
    	    		}
    	    	}
    	    	
    	    	$scope.version.userPermissions = tempPermissions;
    	    
    	    	
    	    	
    	    	VersionManageService.unfreezenVersion({unFreezen:$scope.unfreezen,version:$scope.version}).then(function(){
    	    		alert("解版成功!")
    	    		$state.go("VersionProcess");
    	    	});
    		}
    		
    	});
    	}
    
    
    $scope.goBack=function (){
    	$state.go("VersionManage",{type:'1'});
    }
    
    return vm;
  }
]);
