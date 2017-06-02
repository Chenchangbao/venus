
angular.module('sncd').controller('VersionJobCtrl', ['$scope', 'VersionManageService','SystemService','$stateParams','AlertService',
    function ($scope, VersionManageService,SystemService,$stateParams,AlertService) {

	//废弃的js
		var versionId =  $stateParams.versionId;
		var sysId =  $stateParams.sysId;
		var frequencyRates=  $scope.frequencyRates =  [{frequencyRate:"8",frequencyRateDesc:'每日三次'},
                                                        {frequencyRate:"24",frequencyRateDesc:'每日一次'},
                                                        {frequencyRate:"3",frequencyRateDesc:'每三小时一次'},
                                                        {frequencyRate:"1",frequencyRateDesc:'每小时一次'},
                                                        /*{frequencyRate:"3600",frequencyRateDesc:'每一分钟一次'},*/
																											{frequencyRate: "-1", frequencyRateDesc:"自定义"}
																									];
		var projectTypes = $scope.projectTypes = [{projectType:"1",projectDesc:"单工程"},{projectType:"2",projectDesc:"多工程"}];
       
		
		
		init();
        
        function  init() {
        	VersionManageService.versionJob({versionId:versionId}).then(function(result){
        		$scope.type = result.type;
        		$scope.version = result.branchBo;
        		
        		if(null!=result.branchBo.branchBuildInfoBo){
        			if(null!=result.branchBo.branchBuildInfoBo.mailRoleRecipent){
        				$scope.recipentList=result.branchBo.branchBuildInfoBo.mailRoleRecipent.split(",");
        			}
        			if(null!=result.branchBo.branchBuildInfoBo.mailRoleCc){
        				$scope.ccList=result.branchBo.branchBuildInfoBo.mailRoleCc.split(",");
        			}
        			if(null!=result.branchBo.branchBuildInfoBo.mailTrigger){
        				$scope.mailTriggerList=result.branchBo.branchBuildInfoBo.mailTrigger.split(",");
        			}
	        		if(null!=result.branchBo.branchBuildInfoBo.analysisExt){
	        			$scope.analysisExtList=result.branchBo.branchBuildInfoBo.analysisExt.split(",");
	        		}
        		}
        		$scope.dtmListTrigger=result.mailTriggerList;
        		$scope.dtmListAnalysisExt=result.analysisExtList;
        		
        		 
            	//获取所有角色
            	 SystemService.getSystemTeam({sysId:sysId}).then(function(result){
            		 $scope.dtmListRecipent=result.dtmList;
            		 var length = result.dtmList.length;
            		 $scope.dtmListRecipent[length]={roleName:"261"};
                     $scope.dtmListCc=[];
                     angular.copy($scope.dtmListRecipent, $scope.dtmListCc);
                   //角色
                	 var recipentList=$scope.recipentList;
                	 if(recipentList!=null && recipentList.length>0 && $scope.dtmListRecipent!=null && $scope.dtmListRecipent.length >0){
                		 for(var i = 0;i<$scope.dtmListRecipent.length;i++){
                			 for(var j=0;j<recipentList.length; j++){
                				if($scope.dtmListRecipent[i].roleName==recipentList[j]){
                					$scope.dtmListRecipent[i].checked=true;
                				}
                			 }
                		 }
                	 }
                	 
                	 var ccList=$scope.ccList;
                	 if(ccList!=null && ccList.length>0 && $scope.dtmListCc!=null && $scope.dtmListCc.length >0){
                		 for(var i = 0;i<$scope.dtmListCc.length;i++){
                			 for(var j=0;j<ccList.length; j++){
                				if($scope.dtmListCc[i].roleName==ccList[j]){
                					$scope.dtmListCc[i].checked=true;
                				}
                			 }
                		 }
                	 }
                	 
                	 
                	 var mailTriggerList = $scope.mailTriggerList;
                	 if(mailTriggerList!=null && mailTriggerList.length>0 &&  $scope.dtmListTrigger!=null &&  $scope.dtmListTrigger.length >0){
                		 for(var i = 0;i< $scope.dtmListTrigger.length;i++){
                			 for(var j=0;j<mailTriggerList.length; j++){
                				if($scope.dtmListTrigger[i].itemCode==mailTriggerList[j]){
                					 $scope.dtmListTrigger[i].checked=true;
                				}
                			 }
                		 }
                	 }
                	 
                	 var analysisExtList = $scope.analysisExtList;
                	 if(analysisExtList!=null && analysisExtList.length>0 &&  $scope.dtmListAnalysisExt!=null &&  $scope.dtmListAnalysisExt.length >0){
                		 for(var i = 0;i< $scope.dtmListAnalysisExt.length;i++){
                			 for(var j=0;j<analysisExtList.length; j++){
                				if($scope.dtmListAnalysisExt[i].itemCode==analysisExtList[j]){
                					 $scope.dtmListAnalysisExt[i].checked=true;
                				}
                			 }
                		 }
                	 }
                  });
        	});
        	
        }
        
   
        
     //---------------------------------scope function-------------------------------
        $scope.saveVersionJob = function (invalid){
        	if(invalid){
        		return ;
        	}

        	var recipent='';
        	var cc='';
        	var mailTrigger='';
        	var analysisExt='';
        	var dtmListRecipent = $scope.dtmListRecipent;
	       	 if( dtmListRecipent!=null && dtmListRecipent.length >0){
	       		 for(var i = 0;i<dtmListRecipent.length;i++){
	       			if( dtmListRecipent[i].checked==true){
	       				if(recipent==''){
	       					recipent=dtmListRecipent[i].roleName;
	       				}else{
	       					recipent+=","+dtmListRecipent[i].roleName;
	       				}
	       			 }
	       		 }
	       		 $scope.recipentList=recipent.split(",");
	       	 }
	       	 
	       	var dtmListCc = $scope.dtmListCc;
	       	 if( dtmListCc!=null && dtmListCc.length >0){
	       		 for(var i = 0;i<dtmListCc.length;i++){
	       			if( dtmListCc[i].checked==true){
	       				if(cc==''){
	       					cc=dtmListCc[i].roleName;
	       				}else{
	       					cc+=","+dtmListCc[i].roleName;
	       				}
	       			 }
	       		 }
	       		 $scope.ccList=cc.split(",");
	       	 }
	       var dtmListTrigger=	$scope.dtmListTrigger;
	       if( dtmListTrigger!=null && dtmListTrigger.length >0){
	       		 for(var i = 0;i<dtmListTrigger.length;i++){
	       			if( dtmListTrigger[i].checked==true){
	       				if(mailTrigger==''){
	       					mailTrigger=dtmListTrigger[i].itemCode;
	       				}else{
	       					mailTrigger+=","+dtmListTrigger[i].itemCode;
	       				}
	       			 }
	       		 }
	       		 $scope.mailTriggerList=mailTrigger.split(",");
	       	 }
	       
	       var dtmListAnalysisExt=	$scope.dtmListAnalysisExt;
	       if( dtmListAnalysisExt!=null && dtmListAnalysisExt.length >0){
	       		 for(var i = 0;i<dtmListAnalysisExt.length;i++){
	       			if( dtmListAnalysisExt[i].checked==true){
	       				if(analysisExt==''){
	       					analysisExt=dtmListAnalysisExt[i].itemCode;
	       				}else{
	       					analysisExt+=","+dtmListAnalysisExt[i].itemCode;
	       				}
	       			 }
	       		 }
	       		 $scope.analysisExtList=analysisExt.split(",");
	       	 }
        	//
        	if($scope.version.packaageType == 'ANT' && version.branchBuildInfoBo.projectType=='2'){
        		if(version.branchBuildInfoBo.projectNames==null ||version.branchBuildInfoBo.projectNames ==''){
        			alert("请填写工程名称！");
        		}
        		return ;
        	}
        	

			var rate =  $scope.version.branchBuildInfoBo.frequencyRate;
			var frequencyExpression = "";
			if(rate=="1"){
				frequencyExpression = "H * * * *";
			}else if(rate=="3"){
				frequencyExpression = "H H/3 * * *";
			}else if(rate =="8"){
				frequencyExpression = "H H/8 * * *";
			}else if(rate=="24"){
				frequencyExpression = "H H * * *";
			}else if(rate=="3600"){
				frequencyExpression = "H * * * *";
			} else if(rate === '-1'){
				frequencyExpression = $scope.version.branchBuildInfoBo.frequencyRateCustom||'';
			}
			
			// 自定义表达式验证
			if(rate === '-1'){
				if(frequencyExpression  === ''){
					alert("请填写自定义定时计划表达式");
					return;
				}
				
				if(frequencyExpression.split(" ").length!==5){
					alert("自定义定时计划表达式有误");
					return;
				}
			}
			

    		
        	//保存
        	VersionManageService.saveVersionJob({versionId:versionId,frequencyRate:$scope.version.branchBuildInfoBo.frequencyRate,frequencyExpression:frequencyExpression,analysisExt:analysisExt,recipent:recipent,cc:cc,mailTrigger:mailTrigger}).then(function (result){
//        		alert("修改成功！")
//        		$scope.type = "show";
//        		$scope.version.branchBuildInfoBo.frequencyRate = $scope.version.branchBuildInfoBo.frequencyRate;
//        		
        		AlertService.alert({
                    title: "修改成功",
                    content: '修改质量分析成功!'
                }).then(function() {
                	init();
                });
        	});
        
        }
        
        
        $scope.editVersionJob= function (){
        	 $scope.type = 'edit';
        	 //默认选中质量分析
        	 for(var i = 0;i<$scope.frequencyRates.length ;i++){
        		 if($scope.version.branchBuildInfoBo.frequencyRate == $scope.frequencyRates[i].frequencyRate){
        			 $scope.version.branchBuildInfoBo.frequencyRate =  $scope.frequencyRates[i].frequencyRate;
        			 break;
        		 }
        	 }
        };
        
        
        
        $scope.exitEdit = function (){
//        	$scope.type ='show';
        	init();
        };
        
    }
]);