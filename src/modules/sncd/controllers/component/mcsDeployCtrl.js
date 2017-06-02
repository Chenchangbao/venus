angular.module('sncd').controller('McsDeployCtrl', ['$http','$scope', 'ComponentService','VersionManageService','HomeService','SystemService','DeployReqManageService','AlertService','DialogService', '$state','baseUrl','$stateParams','$q',
    function ($http,$scope,ComponentService,VersionManageService,HomeService,SystemService,DeployReqManageService,AlertService,DialogService,$state,baseUrl,$stateParams,$q) {
        'use strict';
        
        var selectedTab = $scope.selectedTab = 1;
        
        var specChar = /[%'\^]/;
        var plusInteger = /^[1-9]\d*$/;
        var versionExp = /^\d+(\.\d+)*$/;
        var maxFileSize = 100;

        $scope.id = $stateParams.id;
        $scope.appName = $stateParams.appName;
        
        init();
	        
        /////////////functions///////////////
        function init() {
        	queryDetail($scope.id);
        	ComponentService.getFormalAppList().then(function (result) {
                $scope.apps = result;
            })
        }
        
        function queryDetail(id){
        	var params = {
        			id: id,
    		      };
        	ComponentService.componentDetail(params).then(function (result) {
    	        $scope.component = result.componentInfo;
        	});
        }
        
        function splitCheck(value) {
        	var flag = true;
        	var items = value.split(",");
        	for(var i=0; i<items.length; i++) {
        		if (items[i] != "") {
        			if (! versionExp.test($.trim(items[i]))) {
        				flag = false;
        				break;
        			}
        		}
        	}
        	return flag;
        }
        
        function checkFileIPA(file) {
            var exp = /\.apk/i;
            if (exp.test(file)) { //验证格式 
               return true;
            } 
           return false;
        }
        
        function checkIconFileChange(file) {
            var exp = /..png|..png/i;
            if (exp.test(file)) { //验证格式 
               return true;
            } 
           return false;
        }
        
        function checkIcon(){
        	var iconFile = $("#iconFiles").val();
        	$("#validatorPic").hide();
        	$("#validatorPic2").hide();
        	if(iconFile =='') {
				return false;
			}else if(!checkIconFileChange(iconFile)){
					AlertService.alert({
						title: '提示信息',
						content: '请选择png文件'
					});
					$("#iconFiles").val('');
					return false;
				 }
        	$("#validatorPic").show();
        	$("#validatorPic2").show();
		};
		
		function checkFileChange() {
		    var exp = /..apk|..ipa/i,
		    	file=$scope.appName;
		    if (exp.test(file)) { //验证格式 
		       return true;
		    } 
		    AlertService.alert({
				title: '提示信息',
				content: '只能上传apk或者ipa文件'
			});
		   return false;
		};
		
		function checkFormalFileChange() {
		    var exp = /..apk|..ipa|..zip/i,
		    	file=$scope.appName;
		    if (exp.test(file)) { //验证格式 
		       return true;
		    } 
		    AlertService.alert({
				title: '提示信息',
				content: '只能上传apk或者ipa或者zip文件'
			});
		   return false;
		}
		
        /////////////scope functions///////////////
		
        $scope.uploadIcon = function(){
        	$('#iconFiles').click();
        	$('#iconFiles').change(function(){
        		checkIcon();
        	});
        }
        
        $scope.selectTab = function (tabNo) {
			$scope.selectedTab = tabNo;
			if(1==tabNo){
				ComponentService.getFormalAppList().then(function (result) {
	                $scope.apps = result;
	            })
			}else if(2==tabNo){
				ComponentService.getGrayAppList().then(function (result) {
	                $scope.apps = result;
	            })
			}else{
				ComponentService.getPlugAppList().then(function (result) {
	                $scope.apps = result;
	            })
			}
        };
        
        $scope.getPlugfun = function (appid){
        	var params = {
        			appid: appid,
    		      };
        	ComponentService.getPlugfun(params).then(function (result) {
                $scope.plugfuns = result;
            })
        };
        
        $scope.checkAppid=function(){
			if (this.appForm.appid.$error.required) {
				$scope.appidErrorMsg="应用名称不能为空";
				return false;
			}else{
				$scope.appidErrorMsg="";
				return true;
			}
		};
		
		$scope.checkPlugfunid=function(){
			if (this.appForm.plugfunid.$error.required) {
				$scope.plugfunidErrorMsg="功能名称不能为空";
				return false;
			}else{
				$scope.plugfunidErrorMsg="";
				return true;
			}
		};
		
		$scope.checkPackversion=function(){
			if (this.appForm.packversion.$error.required) {
				$scope.packversionErrorMsg="包版本不能为空";
				return false;
			}else if (! versionExp.test($.trim($scope.packversion))) {
				$scope.packversionErrorMsg="版本号不合法";
				return false;
			}else{
				$scope.packversionErrorMsg="";
				return true;
			}
		};
		
		$scope.checkPacknversion=function(){
			if (this.appForm.packnversion.$error.required) {
				$scope.packnversionErrorMsg="包内版本不能为空";
				return false;
			}else if (! plusInteger.test($.trim($scope.packnversion))) {
				$scope.packnversionErrorMsg="包内版本号不合法";
				return false;
			}else{
				$scope.packnversionErrorMsg="";
				return true;
			}
		};
		
		$scope.checkQuantitynum=function(){
			if ($scope.quantitynum == "" || typeof($scope.quantitynum) == "undefined") {
				$scope.quantitynumErrorMsg="灰度量不能为空";
				return false;
			}else if(! plusInteger.test($.trim($scope.quantitynum))){
				$scope.quantitynumErrorMsg="灰度量必须为整数";
				return false;
			}else{
				$scope.quantitynumErrorMsg="";
				return true;
			}
		};
		
		$scope.checkRemark=function(){
			if ($scope.remark == "" || typeof($scope.remark) == "undefined") {
				$scope.remarkErrorMsg="更新说明不能为空";
				return false;
			}else if (specChar.test($scope.remark)) {
				$scope.remarkErrorMsg="更新说明不能有特殊字符";
				return false;
			}else if ($scope.remark.length>200) {
				$scope.remarkErrorMsg="更新说明长度不能大于200";
				return false;
			}else{
				$scope.remarkErrorMsg="";
				return true;
			}
		};
		
		$scope.checkUpgradeversion=function(){
			if ($scope.upgradeversion == "" || typeof($scope.upgradeversion) == "undefined") {
				$scope.remarkErrorMsg="";
				return true;
			}else if (! splitCheck($scope.upgradeversion)) {
				$scope.upgradeversionErrorMsg="格式错误";
				return false;
			}else{
				$scope.upgradeversionErrorMsg="";
				return true;
			}
		}
		
		$scope.checkBIdentifier=function(){
			if(!checkFileIPA($scope.appName)) {
				if($scope.bIdentifier == "" || typeof($scope.bIdentifier) == "undefined") {
					$scope.bIdentifierValueErrorMsg="请填写PLIST（bundle-identifier）";
					return false;
				}else{
					$scope.bIdentifierValueErrorMsg="";
					return true;
				}
			}else{
				return true;
			}
		}
		
		$scope.checkBVersion=function(){
			if(!checkFileIPA($scope.appName)) {
				if($scope.bVersion == "" || typeof($scope.bVersion) == "undefined") {
					$scope.bVersionValueErrorMsg="请填写PLIST（bundle-version）";
					return false;
				}else{
					$scope.bVersionValueErrorMsg="";
					return true;
				}
			}else{
				return true;
			}
		}
		
		
		
		//保存正式包
		$scope.save = function(){
			var fd = new FormData();
	        var file = document.querySelector('input[type=file]').files[0];
	        if(typeof(file) == "undefined"){
	        	$scope.iconErrorMsg="未选择任何文件";
	        	return false;
	        }else if(angular.lowercase(file.name.substring(1+file.name.lastIndexOf('.'))) !='png'){
	        	$scope.iconErrorMsg="必须选择png文件";
	        	return false;
	        }else{
	        	$scope.iconErrorMsg="";
	        }
			if(checkFormalFileChange() && $scope.checkAppid() && $scope.checkPackversion() && $scope.checkPacknversion() && $scope.checkRemark() && $scope.checkUpgradeversion()){
		        var id = $scope.id,
	        		appName = $scope.appName,
		        	appid=$scope.appid,
					packversion=$scope.packversion,
					packnversion=$scope.packnversion,
					plist=$scope.plist,
					bIdentifier=$scope.bIdentifier,
					bVersion=$scope.bVersion,
					remark=$scope.remark,
					quantitynum=$scope.quantitynum,
					upgradeversion=$scope.upgradeversion;
		        if(typeof(bIdentifier) == "undefined"){
		        	bIdentifier="";
		        }
		        if(typeof(bVersion) == "undefined"){
		        	bVersion="";
		        }
		        if(typeof(quantitynum) == "undefined"){
		        	quantitynum="";
		        }
		        if(typeof(upgradeversion) == "undefined"){
		        	upgradeversion="";
		        }
		        if(typeof(plist) == "undefined"){
		        	plist="";
		        }
		        fd.append('icon', file); 
		        $scope.isWaiting = true;
		         $http({
		              method:'POST',
		              url:"/udmp-web-in/angular/component/addPackageInfo.htm?id="+id+"&appName="+appName+"&packtype=1&appid="+appid+"&packversion="+packversion+"&packnversion="+packnversion+"&packid=0&actionType=1&plist="+plist+"&bIdentifier="+bIdentifier+"&bVersion="+bVersion+"&remark="+remark+"&quantitynum="+quantitynum+"&upgradeversion="+upgradeversion,
		              data: fd,
		              headers: {'Content-Type':undefined},
		              transformRequest: angular.identity 
		               })   
		              .success( function ( result )
		                       {
		            	  $scope.isWaiting = false;
	          	  		if(result.errCode==0){
	        	  			AlertService.alert({
	    						title: '提示信息',
	    						content: '操作成功'
	    					}).then(function () {
	    						$scope.goBack();
	    					});
	        	  		}else{
	        	  			AlertService.alert({
	    						title: '提示信息',
	    						content: result.errMsg
	    					});
	        	  		}
	                   }); 
			
			}else{
				return false;
			}
		};
		
		//保存灰度包
		$scope.saveGrayPackage = function (){
			var fd = new FormData();
	        var file = document.querySelector('input[type=file]').files[0];
	        if(typeof(file) == "undefined"){
	        	$scope.iconErrorMsg="未选择任何文件";
	        	return false;
	        }else if(angular.lowercase(file.name.substring(1+file.name.lastIndexOf('.'))) !='png'){
	        	$scope.iconErrorMsg="必须选择png文件";
	        	return false;
	        }else{
	        	$scope.iconErrorMsg="";
	        }
			if(checkFileChange() && $scope.checkAppid() && $scope.checkPackversion() && $scope.checkPacknversion() && $scope.checkRemark() && $scope.checkQuantitynum() && $scope.checkUpgradeversion() && $scope.checkBIdentifier() && $scope.checkBVersion()){
		        var id = $scope.id,
	        		appName = $scope.appName,
		        	appid=$scope.appid,
					packversion=$scope.packversion,
					packnversion=$scope.packnversion,
					plist=$scope.plist,
					bIdentifier=$scope.bIdentifier,
					bVersion=$scope.bVersion,
					remark=$scope.remark,
					quantitynum=$scope.quantitynum,
					upgradeversion=$scope.upgradeversion;
		        if(typeof(bIdentifier) == "undefined"){
		        	bIdentifier="";
		        }
		        if(typeof(bVersion) == "undefined"){
		        	bVersion="";
		        }
		        if(typeof(quantitynum) == "undefined"){
		        	quantitynum="";
		        }
		        if(typeof(upgradeversion) == "undefined"){
		        	upgradeversion="";
		        }
		        if(typeof(plist) == "undefined"){
		        	plist="";
		        }
		        fd.append('icon', file); 
		        $scope.isWaiting = true;
		         $http({
		              method:'POST',
		              url:"/udmp-web-in/angular/component/addPackageInfo.htm?id="+id+"&appName="+appName+"&packtype=2&appid="+appid+"&packversion="+packversion+"&packnversion="+packnversion+"&packid=0&actionType=1&plist="+plist+"&bIdentifier="+bIdentifier+"&bVersion="+bVersion+"&remark="+remark+"&quantitynum="+quantitynum+"&upgradeversion="+upgradeversion,
		              data: fd,
		              headers: {'Content-Type':undefined},
		              transformRequest: angular.identity 
		               })   
		              .success( function ( result )
		                       {
		            	  $scope.isWaiting = false;
	          	  		if(result.errCode==0){
	        	  			AlertService.alert({
	    						title: '提示信息',
	    						content: '操作成功'
	    					}).then(function () {
	    						$scope.goBack();
	    					});
	        	  		}else{
	        	  			AlertService.alert({
	    						title: '提示信息',
	    						content: result.errMsg
	    					});
	        	  		}
	                   }); 
			
			}else{
				return false;
			}
		};
		
		//保存插件包
		$scope.savePlugPackage = function (){
			if(checkFileChange() && $scope.checkAppid() && $scope.checkPlugfunid() && $scope.checkPackversion() && $scope.checkPacknversion() && $scope.checkUpgradeversion()){
		        var id = $scope.id,
		        	appName = $scope.appName,
		        	appid=$scope.appid,
					packversion=$scope.packversion,
					packnversion=$scope.packnversion,
					upgradeversion=$scope.upgradeversion,
					plugfunid=$scope.plugfunid;
		        if(typeof(upgradeversion) == "undefined"){
		        	upgradeversion="";
		        }
		        var params = {
		        		id:id,
		        		appName:appName,
		        		appid:appid,
		        		packversion:packversion,
		        		packnversion:packnversion,
		        		upgradeversion:upgradeversion,
		        		plugfunid:plugfunid,
		        		packid:0,
		        		actionType:1
		        };
		        $scope.isWaiting = true;
		        ComponentService.savePlugPackage(params)   
		              .then(function(result){
		            	  $scope.isWaiting = false;
	          	  		if(result.errCode==0){
	        	  			AlertService.alert({
	    						title: '提示信息',
	    						content: '操作成功'
	    					}).then(function () {
	    						$scope.goBack();
	    					});
	        	  		}else{
	        	  			AlertService.alert({
	    						title: '提示信息',
	    						content: result.errMsg
	    					});
	        	  		}
	                   }); 
			}else{
				return false;
			}
		};
		
		 $scope.goBack = function(sysId,branchId){
	        	$state.go("MyComponentList");
	        }
	}
]);
