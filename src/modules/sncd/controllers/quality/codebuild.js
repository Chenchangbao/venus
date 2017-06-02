angular.module('sncd').controller('CodeBuildCtrl', ['$scope', '$state','$stateParams','$timeout','QuaService',
    function ($scope, $state,$stateParams, $timeout,QuaService) {

		var formData = $scope.formData = {};
        $scope.pager = {
            pageNumber: 1,
            totalCount: 0, //总条数
            pageSize: 10
        };

       
        /////////////functions///////////////
        function init() {
        	codeBuild();
        	formData.count=0;
        	formData.sonarCount=0;
        }

        
        function codeBuild(){
        	formData.sysId =$stateParams.sysId;
        	formData.buildId =$stateParams.buildId;
        	var buildId =$stateParams.buildId;
        	$scope.type =$stateParams.type;
        	var params = { 
        			buildId:buildId
        		};
        	 QuaService.codeBuild(params).then(function(result){
                 $scope.flag = result.flag;
                 $scope.branchBuildInfoBo=result.branchBuildInfoBo;
                 var id=null;
                 if(null!=$scope.branchBuildInfoBo.branchBuildTaskBo){
                	 id =result.branchBuildInfoBo.branchBuildTaskBo.id;
                 }
                 var packageType =$scope.branchBuildInfoBo.packageType;
                 var branchVersion =$scope.branchBuildInfoBo.branchversion;
                 var jobName=$scope.branchBuildInfoBo.jobName;
                 var sonarUrl=result.sonarUrl;
                 if(result.flag){
                	 //等待36秒后进入日志查看
                	 $scope.analyse=[];
                	 $scope.analyse.push("请耐心等待，构建队列在排队中........");
                	 $timeout((function (){
           				getConsole2(buildId,id,sonarUrl,packageType,jobName,branchVersion,null);
           			}), 6000);
                	 //getConsole(buildId,id,sonarUrl,packageType,jobName,branchVersion,1);
                 }
             });
        }
       
        
        var getConsole2= function(buildId,lastId,sonarUrl,packageType,jobName,branchVersion,buildNumber){
        	var analyseResult=[];
           	//因为任务构建发起入库存在时间差，
        	QuaService.getSonarLog({"buildId":buildId,"jobName":jobName,"buildNumber":buildNumber}).then(function(result){
        		branchBuildTashBoTemp =result.branchBuildTaskBo;
        		$scope.buildNumber=branchBuildTashBoTemp.buildNumber;
        		//如果当前id与最后一次结束的任务id非同一个，说明任务正在构建中
        		if(typeof(branchBuildTashBoTemp)!='undefined' && typeof(branchBuildTashBoTemp.id)!='undefined' && branchBuildTashBoTemp.id!=lastId) {
        			//判断当前执行次数是否已经超过200次
        			if(formData.count>200){
        				$scope.analyse.push("ANALYSIS TIMEOUT：分析超时,监控结束,具体请查看分析地址！");
        				analyseResult.push('分析超时,监控结束！');
        				analyseResult.push("jenkins地址:");
        				analyseResult.push(branchBuildTashBoTemp.jenkinsLogUrl);
    				}else{
    					if(formData.count==0){
    						$scope.analyse.push("请耐心等待，构建队列正在构建中........");
    					}
    					//1：执行中，2：执行完毕,3:构建sonar分析中,4:jenkins构建失败,5:sonar分析失败
    					if(branchBuildTashBoTemp.buildStatus=="2"){
    						$scope.analyse.push("ANALYSIS SUCCESSFUL：执行结束！");
            				analyseResult.push("分析成功！sonar地址：");
            				if(packageType=="MAVEN"){
            					sonarUrl+=branchBuildTashBoTemp.groupId+":"+branchBuildTashBoTemp.artifactId+":"+branchVersion;
            				}else{
            					sonarUrl+=branchBuildTashBoTemp.groupId+":"+branchVersion;
            				}
            				 analyseResult.push(sonarUrl);
            				 $scope.sonarUrl=sonarUrl;
            				 analyseResult.push("jenkins地址:");
            				 analyseResult.push(branchBuildTashBoTemp.jenkinsLogUrl);
		                	$scope.jenkinsUrl=branchBuildTashBoTemp.jenkinsLogUrl;
    					}else if(branchBuildTashBoTemp.buildStatus=="3"){
    						if(formData.sonarCount==0){
    							$scope.analyse.push("sonar分析中......");
    						}
    						formData.sonarCount=formData.sonarCount+1;
    						analyseResult.push("sonar分析中！");
    						analyseResult.push("jenkins地址:");
    						analyseResult.push(branchBuildTashBoTemp.jenkinsLogUrl);
    						updateAnalyse();
    						//递归调用
    						$timeout((function (){
	        					formData.count=formData.count+1;
	              				getConsole2(buildId,lastId,sonarUrl,packageType,jobName,branchVersion,$scope.buildNumber);
	              			}), 10000);
    						
    					}else if(branchBuildTashBoTemp.buildStatus=="1"){
    						//analyse.push("请耐心等待，构建队列正在构建中........");
    						analyseResult.push("jenkins构建中！");
    						analyseResult.push("jenkins地址:");
    						analyseResult.push(branchBuildTashBoTemp.jenkinsLogUrl);
    						//递归调用
    						$timeout((function (){
	        					formData.count=formData.count+1;
	              				getConsole2(buildId,lastId,sonarUrl,packageType,jobName,branchVersion,$scope.buildNumber);
	              			}), 6000);
    						
    					}else  if(branchBuildTashBoTemp.buildStatus=="4"){
    						$scope.analyse.push("ANALYSIS FAIL：执行结束！");
    						analyseResult.push('分析失败！');
    						analyseResult.push("jenkins地址:");
    						analyseResult.push(branchBuildTashBoTemp.jenkinsLogUrl);
    					}else  if(branchBuildTashBoTemp.buildStatus=="5"){
    						$scope.analyse.push("ANALYSIS FAIL：执行结束！");
    						analyseResult.push('jenkins构建成功，sonar分析失败！');
    						analyseResult.push("jenkins地址:");
    						analyseResult.push(branchBuildTashBoTemp.jenkinsLogUrl);
    					}
    				}
        		}else{
        			//任务在jenkins排队中，需要稍后重试
        			$scope.analyse.push("请耐心等待，构建队列正在排队中,请稍后刷新重试");
    			}
        		//$scope.analyse=analyse;
        		updateAnalyse();
    			$scope.analyseResult=analyseResult;
           	});
        };
        
        function updateAnalyse(){
    		$("#analyse").html("");
        	var outdoc="";
    		$scope.analyse.forEach(function(item, index){
    			if(item.indexOf('http')==-1){
    				outdoc += '<span>'+item+'</br></span>';
    			}else{
    				outdoc += '<a href="'+item+'target="_blank">'+item+'</a></br>';
    			}
        	});
    		$("#analyse").html(outdoc);
        }
        
        
        var getConsole =  function (buildId,lastId,sonarUrl,packageType,jobName,branchVersion,isFirst){
        	console.log("lastId is"+lastId);
        	var analyseResult=[];
        	  var analyse=[];
        	 if(isFirst==1){
        		 analyse.push("请耐心等待，构建队列在排队中........");
        		 $scope.analyse=analyse;
				$timeout((function (){
      				getConsole(buildId,lastId,sonarUrl,packageType,jobName,branchVersion,2);
      			}), 36000);
			}else{
	        	analyse.push("请耐心等待，构建队列在排队中........");
	        	var branchBuildTashBoTemp={};
	        	QuaService.getSonarLog({"buildId":buildId,"jobName":jobName}).then(function(result){
	        		branchBuildTashBoTemp =result.branchBuildTaskBo;
	        		console.log("lastId is"+lastId+",id 当前id is:"+branchBuildTashBoTemp.id);
	        		//执行未结束
	        		if(typeof(branchBuildTashBoTemp)!='undefined' && typeof(branchBuildTashBoTemp.id)!='undefined' && branchBuildTashBoTemp.id!=lastId) {
	        			analyse.push("请耐心等待，构建队列正在构建中........");
	        				if(formData.count>200){
	        					analyse.push("ANALYSIS TIMEOUT：分析超时,监控结束,具体请查看分析地址！");
                				analyseResult.push('分析超时,监控结束！');
	                			analyse.push("详情请见:");
	                			analyse.push(branchBuildTashBoTemp.jenkinsLogUrl);
	                			$scope.jenkinsUrl=branchBuildTashBoTemp.jenkinsLogUrl;
	        				}else{
	        				
        						
		            			if(branchBuildTashBoTemp.buildResult=="1"||branchBuildTashBoTemp.buildResult=="2"){
		                			if(branchBuildTashBoTemp.buildResult=="1"){//分析成功
		                				analyse.push("ANALYSIS SUCCESSFUL：执行结束！");
		                				analyseResult.push("分析成功！sonar地址：");
		                				if(packageType=="MAVEN"){
		                					sonarUrl+=branchBuildTashBoTemp.groupId+":"+branchBuildTashBoTemp.artifactId+":"+branchVersion;
		                				}else{
		                					sonarUrl+=branchBuildTashBoTemp.groupId+":"+branchVersion;
		                				}
		                				 analyseResult.push(sonarUrl);
		                				 $scope.sonarUrl=sonarUrl;
		                			}else{//执行失败
		                				analyse.push("ANALYSIS ERROR：执行结束！");
		                				analyseResult.push('分析失败！');
		                			}
		                			analyse.push("详情请见:");
		                			analyse.push(branchBuildTashBoTemp.jenkinsLogUrl);
		                			$scope.jenkinsUrl=branchBuildTashBoTemp.jenkinsLogUrl;
			        			}else{
			        				$timeout((function (){
			        					formData.count=formData.count+1;
			              				getConsole(buildId,lastId,sonarUrl,packageType,jobName,branchVersion,2);
			              			}), 6000);
			        			}
	        				}
	        			}else{
	        				analyse.push("请耐心等待，构建队列正在排队中,请稍后刷新重试");
	        			}
	        			$scope.analyse=analyse;
	        			$scope.analyseResult=analyseResult;
	        	});
			}
          }
        ////////////////$scope functions/////////////////


        
        ///////////////////watches//////////////////////////////

        ///////////////////Events///////////////////
    


        init();


    }
]);
