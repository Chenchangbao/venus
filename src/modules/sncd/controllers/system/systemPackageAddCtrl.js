//修改或者添加 系统包controller
angular.module('sncd').controller('SystemPackageAddCtrl', ['$scope', 'SystemService','$state','$stateParams','AlertService',
  function($scope, SystemService,$state,$stateParams,AlertService) {
    'use strict';

    ///////////////////functions//////////////////
    function init() {
    	var sysId =  $stateParams.sysId;
    	var packageId =  $stateParams.packageId;
    	var params = { sysId: sysId,packageId:packageId };
    	$scope.postData  =  {};
    	addPackageInit(params);
    }

    // 查询版本列表
    function addPackageInit(params){
    	SystemService.addPackageInit(params).then(function(result){
        $scope.packageList = result.packageList;
        $scope.system=result.system;
        $scope.repos = result.repos;
        $scope.sumwar=result.sumwar;
        $scope.sumzip = result.sumzip;
        $scope.isNewSnfremaker= result.isNewSnfremaker;
        //C语言的要求报名中只要有.即可
        if(result.sysPackage == null){
        	//默认选择应用、后台
            $scope.postData.packageType = '163';
            $scope.postData.packageUseType = '184';
            //
            $scope.getPakckgeNumByType();
            $scope.getStaticPakckgeNumByType();
        }else{
        	$scope.postData= result.sysPackage;	
        }
       
        
      });
    }

    init();

    $scope.$watch('postData.packageType', function(nv){
    	if(nv == 164){
    		$scope.postData.packageUseType = 183;
    	}
    });
    
    //校验包名是否已存在
    $scope.isSysPackageExist=function (){
    	
    	$scope.postData.sysId = $stateParams.sysId;
    	SystemService.isSysPackageExist({
        	'packageInfo':JSON.stringify($scope.postData)
        	}).then(function (result) {
                if(result.existFlag){
                	$scope.packageErrorMsg = "包名已存在";
                	return false;
                }else{
                	$scope.packageErrorMsg="";
                	return true;
                }
        });
    };
   //检验自定义报名是否已经存在
   $scope.isPackageTypeExist=function(){
	   $scope.postData.sysId = $stateParams.sysId;
	   SystemService.isPackageTypeExist({
			   'packageInfo':JSON.stringify($scope.postData)	   
	   }).then(function(result){
		   if(result.existFlag){
			   $scope.packageTypeErrorMsg="发布包功能类型已经存在";
			   return false;
		   }else{
			   $scope.packageTypeErrorMsg="";
       	return true;
		   }
	   });
   };
   $scope.getPakckgeNumByType=function(){
	   $scope.postData.sysId = $stateParams.sysId;
	   SystemService.getPackageNumByPkgType({
		   'packageInfo':JSON.stringify($scope.postData)	   
   }).then(function(result){
	   $scope.typefore=false;
	   $scope.typeback=false;
	   $scope.typemidle=false;
	   if(result.fore>0){
		   $scope.typefore=true;
		   
	   }
	   if(result.back>0){
		   $scope.typeback=true;
		   
	   }
	   if(result.midle>0){
		   $scope.typemidle=true;
	   }
	   if(!$scope.typefore){
		   $scope.postData.packageUseType = '183';
	   }else if(!$scope.typeback){
		   $scope.postData.packageUseType = '184';
	   }else if(!$scope.typemidle){
		   $scope.postData.packageUseType = '298';
	   }else{
		   $scope.postData.packageUseType = '294';
	   }
   });
   };
   $scope.getStaticPakckgeNumByType=function(){
	   $scope.postData.sysId = $stateParams.sysId;
	   SystemService.getPackageNumByPkgType({
		   'packageInfo':JSON.stringify($scope.postData)	   
	   }).then(function(result){
		   $scope.typefore=false;
		   $scope.typeback=false;
		   $scope.typemidle=false;
		   if(result.fore>0){
			   $scope.typefore=true;
		   }
		   if(result.back>0){
			   $scope.typeback=true;
		   }
		   if(result.midle>0){
			   $scope.typemidle=true;
		   }
		   if(!$scope.typefore){
			   $scope.postData.packageUseType = '183';
		   }else if(!$scope.typeback){
			   $scope.postData.packageUseType = '184';
		   }else if(!$scope.typemidle){
			   $scope.postData.packageUseType = '298';
		   }else{
			   $scope.postData.packageUseType = '294';
		   }
	   });
   };
    //保存包信息
    $scope.savePackage = function(){
    	
    	
    	//表单校验

    	if($scope.packageForm.$invalid || $scope.packageErrorMsg || $scope.packageTypeErrorMsg ){

            return;
         }
    	
    	/*	if($scope.postData.packageId == null){
    		//如果是添加包，检查包数量
        	var packageType =$scope.postData.packageType;
        
        	if(packageType=="163" && $scope.sumwar >=2 ) {
    			alert("应用发布包个数超过限制，无法添加");
    			return false;
    		}
    		if(packageType=="164" && $scope.sumzip >=1) {
    			alert("静态资源包个数不能超过1个哦");
    			return false;
    		}  
    	}*/
    	
    	//校验包名
	  $scope.postData.sysId = $stateParams.sysId;
    	
  	  
  	  SystemService.savePackage({
        	'packageInfo':JSON.stringify($scope.postData)
        	}).then(function (result) {
        		
        		AlertService.alert({
                    title: "保存成功",
                    content: '保存应用发布包成功!'
                }).then(function() {
                	$state.go("SystemPackage", {
                    	sysId: $stateParams.sysId
                    });
                });
        });
    }

    $scope.goBack = function(){
        $state.go("SystemPackage", {
        	sysId: $stateParams.sysId
          });
    }
    //检测包描述的字符数
    $scope.left = function() {return 100 - $scope.postData.packageDesc.length;}
	$scope.$watch('postData.packageDesc', function(){
		if($scope.postData.packageDesc.length>100){
   		 $scope.packageDesErrorMsg="发布包功能类型描述字符超过限制！";
   	}
	});
  }
]);
