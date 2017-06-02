angular.module('sncd').controller('CodeReviewCtrl', ['$scope', '$state','$filter','$stateParams', 'QuaService','HomeService',
    function ($scope, $state,$filter, $stateParams,QuaService,HomeService) {

		var formData = $scope.formData = {};
        $scope.pager = {
            pageNumber: 1,
            totalCount: 0, //总条数
            pageSize: 10
        };

        var userData =$scope.userData={submitter:{value:null},reviewer:{value:null}};
        $scope.userLable=[{
                	name:"代码提交人",
                	model:userData.submitter
                   },
                   {
                	 name:"代码评审人",
                	 model:userData.reviewer
                   }];
        
       
        
        /////////////functions///////////////
        function init() {
        	$scope.pager.pageNumber=1;
        	getReviewDetailList($scope.pager.pageNumber);
        	
        	//获取用户数据
        	HomeService.getAllUsers().then(function(result){
                $scope.userList = result.allUsers;
              });
        }

        
        // 查询质量列表
        function getReviewDetailList(pageNumber){
        	formData.sysId =$stateParams.sysId;
        	var branchId =$stateParams.branchId;
        	var pageSize=$scope.pager.pageSize;
        	var params = { 
        			branchId:branchId,
        			pageNumber:pageNumber,
        			pageSize:pageSize,
        			status:formData.status,
        			startTime:$filter('date')(formData.startTime, 'yyyy-MM-dd'),
        			endTime: $filter('date')(formData.endTime, 'yyyy-MM-dd'),
        			submitter:userData.submitter.value,
        			reviewer:userData.reviewer.value
        		};
            QuaService.getReviewDetailList(params).then(function(result){
                $scope.pager.totalCount = result.totalDataCount;
                $scope.pager.pageNumber = result.pageNumber;
                $scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);
                $scope.branch = result.branch;
                $scope.reviewRequestList=result.datas;
                $scope.notReviewNumbers=result.notReviewNumbers;
                $scope.haveReviewedNumbers=result.haveReviewedNumbers;
            });
        }
 
    
    

        ////////////////$scope functions/////////////////

        $scope.searchReview = function () {
        	formData.queryParam={};
        	formData.queryParam.pageNumber = 1;
        	getReviewDetailList(formData.queryParam.pageNumber);
        };
        

        $scope.states = [ {
            status: 'p',
            name: '待评审'
          },
          {
            status: 'c',
            name: '已评审'
          }];
        
        //鼠标点击选择下拉用户
        $scope.selectUser = function(user,index){
        	$scope.userLable[index].model.value = user;
        };
          
        
        $scope.queryByUser = function(index){
        	var reg =  /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D]*[a-zA-Z-（）]*[/(]?[0-9]{0,8}[/)]?$/; 
    		if(!reg.test($scope.userLable[index].model.value)){
    			$scope.userLable[index].model.value=null;
    		}
        };
        
        $scope.getUser = function(index){
        	var reg = /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-\u4E00-\u9FA5\uF900-\uFA2D（）]*[/(]*[0-9]{0,8}[/)]*$/;
            	if(!reg.test($scope.userLable[index].model.value) || !$scope.userLable[index].model.value){
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
       
       
        ///////////////////watches//////////////////////////////

        ///////////////////Events///////////////////
        //分页
        $scope.$on('sn.controls.pager:pageIndexChanged', function(evt, page) { // 分页操作
            evt.stopPropagation();
            getReviewDetailList(page.pageIndex + 1);
        });

        init();


    }
]);
