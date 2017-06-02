angular.module('sncd').controller('DeployReqDetailCtrl', ['$scope', 'DeployReqManageService','$stateParams', '$interval','DialogService',
  function($scope, DeployReqManageService,$stateParams,$interval,DialogService) {
    'use strict';

    var vm = $scope;
    $scope.btnState = {};
    $scope.webServerPublish = false;

    /////////////functions///////////////
    function init() {
    	var hashParam = window.location.hash;
    	var startIndex = hashParam.lastIndexOf("=");
    	$scope.deployId = hashParam.substring(startIndex+1,hashParam.length);
    	monitorInit($scope.deployId);
    }
    
    $scope.close = function () {
    	$("#mainBody").show();
    	$("#detailBody").hide();
    };
    
    $scope.getConsoleDetial = function(packageName,deployAction,serverCount,groupId){
    	$("#mainBody").hide();
    	$("#detailBody").show();
    	var actionName = deployAction.actionName;
    	$scope.currentAction = deployAction;
    	$scope.currentAction.serverCount = serverCount;
    	DeployReqManageService.getMonitorDetail({"deployId":$scope.deployId,"packageName":packageName,"actionName":actionName,"groupId":groupId}).then(function (result){
    		$scope.serverList = result.serverList;
    		$scope.actionName = actionName;
    	});
    }

    $scope.ngJbossPublish = function (){
    	var packageNames="";
    	for(var i=0;i<$scope.packageNames.length;i++){
    		packageNames+=$scope.packageNames[i];
    		if(i<$scope.packageNames.length-1){
    			packageNames+=",";
    		}
    	}
    	DeployReqManageService.publishNgJboss({"deployId":$scope.deployId,"packages":packageNames,"deployType":"一键发布"}).then(function (data){});
    }
    
    $scope.ngJbossPublishStep = function(packageName,actionName){
    	DeployReqManageService.publishNgJboss({"deployId":$scope.deployId,"packages":packageName,"deployType":"TURN","actionName":actionName}).then(function (data){
    		monitorInit($scope.deployId);
    	});
    }
    
    $scope.showLogDetail = function(row){
    	if($("#detail_"+row).attr("style")=="" 
    		|| $("#detail_"+row).attr("style")=="display: table-row;"){
    		$("#detail_"+row).hide();
    	}else{
    		$("#detail_"+row).show();
    	}
    }
    
    $scope.showWebLogDetail = function(row){
    	if($("#web_detail_"+row).attr("style")=="" 
    		|| $("#web_detail_"+row).attr("style")=="display: table-row;"){
    		$("#web_detail_"+row).hide();
    	}else{
    		$("#web_detail_"+row).show();
    	}
    }
    
    $scope.passFailureAction = function(actionName,packageName,groupId){
    	DeployReqManageService.passFailureAction({"deployId":$scope.deployId,"actionName":actionName,"packageName":packageName,"groupId":groupId}).then(function (data){
    		monitorInit($scope.deployId);
    	});
    }
    
    $scope.changeGroup = function(groupId,packageName){
    	DeployReqManageService.changeGroup({"deployId":$scope.deployId,"groupId":groupId,"packageName":packageName}).then(function (data){
    		for(var key in $scope.currentGroups){
    			if(data[key] != null){
    				$scope.currentGroups[key] = data[key];
    				var obj = $scope.currentGroups[key].deployActionMap;
					for(var i=0;i<obj.length;i++){
						if(obj[i].totalTime == undefined && obj[i].endTime!=undefined){
							obj[i].totalTime = diffTime(obj[i].startTime,obj[i].endTime);
						}
					}
					$scope.currentGroups[key].deployActionMap = obj;
    			}
			}
    	});
    }
    
    $scope.deployOver = function(){

    	$scope.isDeployIng = "N";
    	DialogService.modal({
			key:"deploy.deployOver",
			url:"modules/sncd/templates/publish/publish-over.html",
			accept:function(result){
				DeployReqManageService.deployOver({"deployId":$scope.deployId,"coments":result.coments,"deployResult":result.deployResult}).then(function (data){
					monitorInit($scope.deployId);
		    	});
			}
		});
    }

    ////////////////$scope functions/////////////////
    function monitorInit(deployId){   	
		DeployReqManageService.getMonitorInit({deployId:deployId}).then(function (result){
			$scope.deployHis = result.deployHis;
			$scope.user = result.user;
			$scope.system = result.system;
			$scope.packageNames = result.packages;
			$scope.allPackageNames = result.allPackages;
			$scope.mapNodes = result.stepNode;
			$scope.isMackepackage = result.isMakepackage;
			$scope.webServerList = result.webServerList;
			$scope.deployId = result.deployId;
			$scope.currentGroups = result.currentGroups;
			$scope.isDeployIng = result.isDeployIng;
			$scope.isFinish = result.isFinish;
			
			if(result.isFinish){
				monitor(result.deployHis.deployId,true);
			}else{
				monitor(result.deployHis.deployId,false);
			}
		});
	};
	
    function monitor(deployId,isView){
    	var intervalId = setInterval(getConsole, 1000);
    	function getConsole() {
    		var packageNames="";
        	for(var i=0;i<$scope.packageNames.length;i++){
        		packageNames+=$scope.packageNames[i];
        		if(i<$scope.packageNames.length-1){
        			packageNames+=",";
        		}
        	}
    		DeployReqManageService.getMonitorLog({deployId:deployId,packageNames:packageNames}).then(function (result){
    			$scope.deployType = result.deployType;
    			$scope.isDeployIng = result.isDeployIng;
    			if($scope.isMackepackage && $scope.buildTotalTime == undefined){
    				if(result.buildAction.endTime != null){
        				$scope.buildTotalTime = diffTime(result.buildAction.startTime,result.buildAction.endTime);
        			}
        			$scope.buildAction = result.buildAction;
        			$scope.ftppath = result.ftppath;
        			$scope.jenkinsConsole = result.jenkinsConsole;
    			}
    			if(!$scope.webServerPublish){
    				$scope.webServerList = result.webServerList;
    				if($scope.webServerList != undefined){
    					var obj;
    					var webPublishHas = true;
        				for(var i=0;i< $scope.webServerList.length;i++){
        					obj = $scope.webServerList[i];
        					if(obj.endTime != undefined){
        						obj.totalTime = diffTime(obj.startTime,obj.endTime);
        					}else{
        						webPublishHas = false;
        					}
        				}
        				if(webPublishHas){
        					$scope.webServerPublish = true;
        				}
        			}else{
        				$scope.webServerPublish = true;
        			}
    			}
    			
    			
    			
    			if(result.stepNode != undefined){
    				$scope.mapNodes = result.stepNode;
    				var playStart;
    				for(var key in result.stepNode){
    					if($scope.currentGroups[key]!=null){
    						for(var n=0;n<result.stepNode[key].length;n++){
    							if(result.stepNode[key][n].groupId == $scope.currentGroups[key].groupId){
    								var currentObj = $scope.currentGroups[key];
    								var resultObj = result.stepNode[key][n];
    								//如果本地与服务器不一致，更新
    								if(currentObj.groupStatus != resultObj.groupStatus){
    									$scope.currentGroups[key] = result.stepNode[key][n];
    								}else{
    									for(var i=0;i<currentObj.deployActionMap.length;i++){
    										if(currentObj.deployActionMap[i].actionStatus != resultObj.deployActionMap[i].actionStatus
    												|| currentObj.deployActionMap[i].actionStatus != resultObj.deployActionMap[i].actionStatus
    												|| currentObj.deployActionMap[i].actionStatus != resultObj.deployActionMap[i].actionStatus){
    											$scope.currentGroups[key] = result.stepNode[key][n];
    											break;
    										}
    									}
    								}
    								
    								break;
    							}
    						}
    					
	    					var obj = $scope.currentGroups[key].deployActionMap;
	    					for(var i=0;i<obj.length;i++){
	    						if(obj[i].totalTime == undefined && obj[i].endTime!=undefined){
	    							obj[i].totalTime = diffTime(obj[i].startTime,obj[i].endTime);
	    						}

	    						if(result.deployType=="TURN" && $scope.isFinish==false){
	    							if(i > 0 && obj[i-1].actionStatus == "150"){
		    							playStart = true;
		    						}else{
		    							playStart = false;
		    						}
	    							
		    						if(obj[i].actionStatus == "W" && obj[i].startTime == null && playStart==true){
		    							obj[i].playStart = true;
		    						}else{
		    							obj[i].playStart = false;
		    						}
	    						}else{
	    							obj[i].playStart = false;
	    						}
	    					}
	    					$scope.currentGroups[key].deployActionMap = obj;
    					}
    				}
    			} 
    			if(result.isFinish){
    				if(!isView){
    					isView = true;
    					DialogService.modal({
        		            key: "deploy.success",
        		            url: "modules/sncd/templates/publish/publish-success.html"
        		        });
    				}
    		    	clearInterval(intervalId);
    			}
    		});
    	};
	};
	
	function btnState(packageName){
		$scope.btnState[packageName] = false;
	}
	
	function setIconStatus(){
		
	}

	
	function diffTime(startDate,endDate) {
		var diff=endDate - startDate;//时间差的毫秒数

		//计算出相差天数
		var days=Math.floor(diff/(24*3600*1000));
		 
		//计算出小时数
		var leave1=diff%(24*3600*1000);    //计算天数后剩余的毫秒数
		var hours=Math.floor(leave1/(3600*1000));
		//计算相差分钟数
		var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
		var minutes=Math.floor(leave2/(60*1000));
		 
		//计算相差秒数
		var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
		var seconds=Math.round(leave3/1000);
		
		var returnStr = seconds + "秒";
		if(minutes>0) {
			returnStr = minutes + "分" + returnStr;
		}
		if(hours>0) {
			returnStr = hours + "小时" + returnStr;
		}
		if(days>0) {
			returnStr = days + "天" + returnStr;
		}
		return returnStr;
	}


    ///////////////////watches//////////////////////////////


    ///////////////////Events///////////////////


    init();

    return vm;

  }
]);
