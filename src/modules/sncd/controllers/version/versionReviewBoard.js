
angular.module('sncd').controller('VersionReviewBoardCtrl', ['$scope', 'VersionManageService','$stateParams','HomeService','AlertService',
    function ($scope, VersionManageService,$stateParams,HomeService,AlertService) {

	
		var versionId  =  $stateParams.versionId;
		init();
		$scope.postData={'codereviewOpen':0}; //默认不实用ReviewBoard评审
		
        function  init() {
        	VersionManageService.versionReviewBoard({versionId:versionId}).then(function(result){
        		$scope.type = result.type;
        		$scope.branchCfgInfo = result.branchCfgInfo;
        		$scope.reviewerAndDevelopersBoList = result.reviewerAndDevelopersBoList;
        		
        		if(result.type == 'edit'){
        			editCodeView();
        		}
        		
        	});
        }
        
        //编辑代码评审        
        $scope.editCodeView= function (){
        	editCodeView();
        }
        
        function editCodeView(){
        	
        	
        	if($scope.branchCfgInfo !=null){
        		$scope.postData.codereviewOpen= $scope.branchCfgInfo.codereviewOpen;	
        	}
        	
        	
        	var reviewerAndDevelopersBoList = $scope.reviewerAndDevelopersBoList ;
        	
        	if(reviewerAndDevelopersBoList!=null){
        		for(var i = 0;i<reviewerAndDevelopersBoList.length ;i++){
        			var newDevelopers = reviewerAndDevelopersBoList[i].developers;
        			reviewerAndDevelopersBoList[i].newDevelopers = newDevelopers;
        		}
        	}
        	
        	$scope.reviewerAndDevelopersBoList= reviewerAndDevelopersBoList ;

        	$scope.type = 'edit';
        	
        	//获取用户数据
        	HomeService.getAllUsers().then(function(result){
                $scope.userList = result.allUsers;
              });
        
        }
        
        
        $scope.saveReviewBoard = function (invalid){
        	if(invalid){
        		return false;
        	}
        	var codereviewOpen = $scope.postData.codereviewOpen;
        	
			if(codereviewOpen ==null){
				return false;
			} 	
        	
        	$scope.errorMsg="";
        	var versionId = $stateParams.versionId;
        	var reviewerAndDevelopersBoList = $scope.reviewerAndDevelopersBoList;
        	var reviewerAndDevelopersStr = "";//提交的 字符串
        	//使用评审
        	if(codereviewOpen == '1'){//使用评审
        		//开发为空，提示维护分支读写权限
        		if(reviewerAndDevelopersBoList[0].newDevelopers==null || reviewerAndDevelopersBoList[0].newDevelopers.length == 0){
        			$scope.errorMsg = "开发人员不能为空，请先维护分支读写权限！";
        			return false;
        		}
        		//为每一个开发增加评审
        		var flag = true;
        		if(reviewerAndDevelopersBoList!=null && reviewerAndDevelopersBoList.length > 0){
        			var allSelDevelopers ="";//所有已选开发
        			var allSelReviewers = "";//所有已选的评审人
        			for(var i =0;i<reviewerAndDevelopersBoList.length ; i++){
        				var newDevelopers = "";
        				var review = reviewerAndDevelopersBoList[i].reviewer.userName;
        				for(var j =0;j<reviewerAndDevelopersBoList[i].newDevelopers.length ; j++){
        					if(reviewerAndDevelopersBoList[i].newDevelopers[j].checked){
        						if(newDevelopers !=''){
        							newDevelopers = newDevelopers + ","+reviewerAndDevelopersBoList[i].newDevelopers[j].userName;
        						}else{
        							newDevelopers  =  reviewerAndDevelopersBoList[i].newDevelopers[j].userName;
        						}
        						if(allSelDevelopers==''|| allSelDevelopers.indexOf(reviewerAndDevelopersBoList[i].newDevelopers[j].userName)  < 0 ){
        							if(allSelDevelopers==''){
        								allSelDevelopers = reviewerAndDevelopersBoList[i].newDevelopers[j].userName	
        							}else{
        								allSelDevelopers =  allSelDevelopers  +","+reviewerAndDevelopersBoList[i].newDevelopers[j].userName	
        							}
        							
        						}
        					}
        				}
        				if(newDevelopers==''||newDevelopers.length == 0){
        					$scope.errorMsg = "每行请至少勾选一个开发人员！";
        					return false;
        				}
        				
        				if(newDevelopers.indexOf(review)>=0){
        					flag = false;
        					$scope.errorMsg = "不能评审自己的代码！";
        					return false;
        				}
        				if(allSelReviewers!='' && allSelReviewers.indexOf(review)>=0){
        					$scope.errorMsg = "代码评审人员不能重复！";
        					return false;
        				}else{
        					allSelReviewers = allSelReviewers+","	
        				}
        				//组装提交的字符串
        				if(reviewerAndDevelopersStr ==''){
        					reviewerAndDevelopersStr = review+":"+newDevelopers;
        				}else{
        					reviewerAndDevelopersStr = reviewerAndDevelopersStr +";"+review+":"+newDevelopers;
        				}
        			}
        		}
        		//是否评审了全部开发人员
        		if(allSelDevelopers.split(",").length  != reviewerAndDevelopersBoList[0].newDevelopers.length ){
        			$scope.errorMsg = "请为每个开发人员指定评审人员！";
					return false;
        		}
        	}
        	//保存
        	var params ={
            		versionId:versionId,
    	        	codereviewOpen:codereviewOpen,
    	        	reviewerAndDevelopersStr:reviewerAndDevelopersStr,
            	};
            	
            	VersionManageService.saveCodeReview(params).then(function (result){
            		AlertService.alert({
                        title: "修改成功",
                        content: '修改在线代码评审成功!'
                    }).then(function() {
                    	init();
                    });
            	});
      }
        
        //添加一行
        $scope.add = function (){
        	
        	var reviewerAndDevelopersBoList = $scope.reviewerAndDevelopersBoList;
        	
        	var tempReviewerAndDevelopersBo = {};
        	tempReviewerAndDevelopersBo.reviewer = "";
        	tempReviewerAndDevelopersBo.newDevelopers = [];
        	if(reviewerAndDevelopersBoList[0].newDevelopers!=null &&  reviewerAndDevelopersBoList[0].newDevelopers.length >0 ){
        		for(var i = 0;i<reviewerAndDevelopersBoList[0].newDevelopers.length ; i++){
        			var tempDevelopers = {};
        			tempDevelopers.checked =false;
        			tempDevelopers.fullName = reviewerAndDevelopersBoList[0].newDevelopers[i].fullName;
        			tempDevelopers.userName = reviewerAndDevelopersBoList[0].newDevelopers[i].userName;
        			tempReviewerAndDevelopersBo.newDevelopers.push(tempDevelopers);
        		}
        	}
        	
        	
        	reviewerAndDevelopersBoList.push(tempReviewerAndDevelopersBo);
        	console.log(reviewerAndDevelopersBoList);
        }
        //删除本行
        $scope.del = function (index){
        	$scope.reviewerAndDevelopersBoList.splice(index,1);
        }
        
        
        $scope.removeDeployer = function (pindex,index){
        	$scope.reviewerAndDevelopersBoList[pindex].newDevelopers.splice(index,1)
        }
        
        
        $scope.exitEdit = function (){
//        	$scope.type ='show';
        	init();
        }
        
        
        
        //鼠标点击选择下拉用户
        $scope.selectUser = function(user,index){
        	
        	
        	$scope.reviewerAndDevelopersBoList[index].reviewer.fullName = user;
        	$scope.reviewerAndDevelopersBoList[index].reviewer.userName = user.substring(user.length - 10).substring(1, 9);
        	
        };
          
        
        $scope.queryByUser = function(index){
        	var reg =  /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D]*[a-zA-Z-（）]*[/(]?[0-9]{0,8}[/)]?$/; 
    		if(!reg.test($scope.reviewerAndDevelopersBoList[index].reviewer.fullName)){
    			$scope.reviewerAndDevelopersBoList[index].reviewer.fullName=null;
    		}
        };
        
        $scope.getUser = function(index){
        	var reg = /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-\u4E00-\u9FA5\uF900-\uFA2D（）]*[/(]*[0-9]{0,8}[/)]*$/;
            	if(!reg.test($scope.reviewerAndDevelopersBoList[index].reviewer.fullName)){
            		$scope.reviewerAndDevelopersBoList[index].reviewer.fullName=null;
        		}else{
        			if(null != $scope.reviewerAndDevelopersBoList[index].reviewer.fullName && $scope.reviewerAndDevelopersBoList[index].reviewer.fullName != ''){
        				 var params ={
            					 "userFullName":$scope.reviewerAndDevelopersBoList[index].reviewer.fullName
            			 };
            			 HomeService.validateUser(params).then(function(result){
        			   		 if(!result.flag){
        			   			$scope.reviewerAndDevelopersBoList[index].reviewer.fullName=null;
        			   			 if(null!=result.allUsers){
        			   				 $scope.userList = result.allUsers;
        			   			 }
        			   		 }
        		         });
        			}
        		}
        };
    }
])