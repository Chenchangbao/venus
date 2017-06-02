angular.module('sncd').controller('QualityCenterCtrl', ['$scope', 'QuaService', '$state','$stateParams',
    function ($scope, QuaService, $state,$stateParams) {

		var formData = $scope.formData = {};
	    $scope.pager = {
	        pageNumber: 1,
	        totalCount: 0, //总条数
	        pageSize: 10
	    };
	
	    
	    /////////////functions///////////////
	    function init() {
	    	var type=$stateParams.type;
	    	formData.branchId =null;
	    	if(null==type || 0==type){
	    		formData.type=0;
	    		//进入质量管理
		    	formData.sysId = null;
	    	}else if(type==1){
	    		//我的系统进入质量管理
	    		formData.sysId = $stateParams.sysId;
	    		formData.sysTemp = $stateParams.sysId;
	    	}else if(type==2){
	    		//版本进入质量管理
	    		formData.sysId = $stateParams.sysId;
	    		formData.sysTemp = $stateParams.sysId;
	    		formData.branchId = $stateParams.branchId;
	    	}else if(type==4){
	    		//代码质量查看、评审，编译，返回
	    		formData.type=4;
	    		formData.sysId = $stateParams.sysId;
	    	}
	    	queryQuaList($scope.pager.pageNumber);
	    }
	
	    
	    // 查询质量列表
	    function queryQuaList(pageNumber){
	    	 var params = {
	          		pageNumber: pageNumber,
	          		searchName:formData.queryParam,
	          		sysId:formData.sysId,
	          		branchId:formData.branchId
	          };
	        QuaService.getMyQuality(params).then(function(result){
	            $scope.pager.totalCount = result.totalDataCount;
	            $scope.pager.pageNumber = result.pageNumber;
	            $scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);
	            $scope.quaList = result.datas;
	            $scope.trunkBuildInfo = result.trunkBuildInfo;
	        });
	    }
	
	    ////////////////$scope functions/////////////////
	
	    $scope.search = function () {
	    	formData.queryParam.pageNumber = 1;
	    	queryQuaList(formData.queryParam.pageNumber);
	    };
	    
	    $scope.branchAnalysis = function (sysId){
	    	formData.branchParam={};
	    	formData.branchParam.pageNumber=1;
	    	formData.sysId=sysId;
	    	queryQuaList(formData.branchParam.pageNumber);
	    };
	    
	    $scope.getCodeQualityDetail = function (branch,type){
        	if(type=="1"){//进入编译
			  $state.go("CodeBuild", {
				  sysId:branch.sysId,
				  buildId:branch.buildId
  	      });
		  }else if(type=="2"){//进入质量列表查看
			  $state.go("CodeQualityList", {
				  sysId:branch.sysId,
				  buildId: branch.buildId,
				  branchId:branch.branchId
    	      });
		  }else if(type=="3"){//进入代码评审质量查看
			  $state.go("CodeReviewList", {
				  sysId:branch.sysId,
				  branchId: branch.branchId
			  });
		  }
        };
	  

	    ///////////////////watches//////////////////////////////
	
	    ///////////////////Events///////////////////
	    //分页
	    $scope.$on('sn.controls.pager:pageIndexChanged', function(evt, page) { // 分页操作
	        evt.stopPropagation();
	        queryQuaList(page.pageIndex + 1);
	    });
	
	
	    init();
	

    }]);
