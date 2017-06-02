angular.module('sncd').controller('SvnCodeReviewCtrl',['$scope','HomeService','SystemService','$state','$stateParams','DialogService',
function ($scope,HomeService,SystemService,$state,$stateParams,DialogService) {
    'use strict';
 var vm=$scope,
     pager=vm.pager = {
        pageNumber: 1,
        totalCount: 0, // 总条数
        pageSize: 10
    };
 var userData =$scope.userData={submitter:{value:null}};
 $scope.userLable=[{
 	model:userData.submitter
    }];
 
function init() {
	var currName = $state.current.name;
	if(currName == "SvnCodeReviewBranch"){
		vm.sysName=$stateParams.sysName;
		vm.version=$stateParams.version;
		vm.branchId= $stateParams.branchId || '';
	}else{
		vm.branchId='';
		
	}
	vm.reviewStatus="";
	vm.waitToReviewNum=0;
	vm.submit=true;
	HomeService.getCurentUserId().then(function(result){
		$scope.curentuserid=result.userid;
	});
	HomeService.getAllUsers().then(function (result) {
		$scope.userList = result.allUsers;
		// 获取当前用户下所有系统的代码评审记录
		getSystemCodeReviewDatas($scope.pager.pageNumber);
	});
}

    // 获取当前用户下所有系统的代码评审记录
function getSystemCodeReviewDatas(pageNumber) {
    var params={
        pageNum: pageNumber,
        sysName: vm.sysName,
        version: vm.version,
        author: $scope.userLable[0].model.value,
        reviewStatus: vm.reviewStatus,
        branchId: $stateParams.branchId || ''
    };
    SystemService.getReviewDataByPage(params).then(function (result) {
    	$scope.pager.totalCount=result.totalDataCount;
    	$scope.pager.pageNumber=result.pageNumber;
        vm.reviewList=result.datas;
        //全选按钮置空
        $scope.select_all = false;
        $scope.checked = [];
        vm.submit=true;
//        for (var i=0 ; i < vm.reviewList.length ; i++ ){
//        	if( vm.reviewList[i].reviewStatus == 'GREEN' || vm.reviewList[i].reviewStatus == 'red' ) {
//        		vm.waitToReviewNum += 1;
//        	}
//        	
//        }
        //统计待评审的总数量 待评审或者评审不通过且提交人不是当前用户
        angular.forEach(vm.reviewList,function(reivew){
        	if( ( reivew.reviewStatus == 'YELLOW' || reivew.reviewStatus == 'RED' ) && reivew.author != $scope.curentuserid ){
        	vm.waitToReviewNum += 1;
        }
        });
        
        $scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);
        }
    );
}

// 搜索
vm.search=function(){
	getSystemCodeReviewDatas($scope.pager.pageNumber);
};

// 提交评审记录
// vm.updateReviewResult=function () {
// var params={
//       
// }
// SystemService.updateReviewResult(params).then(function (result) {
//        
// })
// }

// 单个评审页面
vm.ReviewOneVersion=function(reivewId){
	DialogService.modal({
	key: "system.svnCodeReivew",
	url: "modules/sncd/templates/system/svn-code-review-dialog.html",
	accept:function(result){
//		location.reload(true);
		 getSystemCodeReviewDatas($scope.pager.pageNumber);
	}},
	{
		reivewId: reivewId
	});
}
//批量评审
vm.ReviewSomeVersion=function(){
	var branchSum=$scope.checked.length;
	//没有选择给出提示
	if(branchSum<1){
		alert("您当前没有选择评审数据，请选择后再评审！");
	}else{
		var reivewIds="";
		for(var i = 0;i< branchSum ;i++){
			if(i != branchSum - 1 ){
				reivewIds = reivewIds+$scope.checked[i]+",";
			} else {
				reivewIds += $scope.checked[i];
			}
		}
		vm.ReviewOneVersion(reivewIds);
		
	}
	
}

///////点击全选动作//////////////
$scope.checkedversionId = [];
$scope.checked = [];
//全选
$scope.selectAll = function () {
    if($scope.select_all) {
        $scope.checked = [];
        angular.forEach($scope.reviewList, function (review) {
        	//当符合条件时才放入
        	if (( review.reviewStatus == "YELLOW" || review.reviewStatus == "RED" )&&review.author != $scope.curentuserid ) {
        	review.checked = true;
            $scope.checked.push(review.id);
            vm.submit=false;
        	}
        });
    }else {
        angular.forEach($scope.reviewList, function (review) {
        	review.checked = false;
            $scope.checked = [];
        	vm.submit=true;
        });
    }
    console.log($scope.checked);
};
$scope.selectOne = function () {
    angular.forEach($scope.reviewList , function (review) {
        var index = $scope.checked.indexOf(review.id);
        if(review.checked && index === -1) {
            $scope.checked.push(review.id);
        } else if (!review.checked && index !== -1){
            $scope.checked.splice(index, 1);
        };
    });
    if($scope.checked.length == 0){
    	$scope.select_all = false;
    	vm.submit=true;
    }
    //已选的和待评审(red/yellow)数量一致，全选勾选
    if($scope.checked.length == vm.waitToReviewNum ){
    	$scope.select_all = true;
    }else{
    	$scope.select_all = false;
    }
    if($scope.checked.length > 0){
    	vm.submit=false;
    }

//    if ($scope.list.length === $scope.checked.length) {
//        $scope.select_all = true;
//    } else {
//        $scope.select_all = false;
//    }
    console.log($scope.checked);
}



    init();



    // ////////用户信息展示//////////////
    //鼠标点击选择下拉用户
    $scope.selectUser = function (user, index) {
			$scope.userLable[index].model.value = user;
    };


    $scope.queryByUser = function (index) {
			var reg = /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-（）]*[/(]?[0-9]{0,8}[/)]?$/;
			if (!reg.test($scope.userLable[index].model.value)) {
				$scope.userLable[index].model.value = null;
			}
    };

    $scope.getUser = function (index) {
    	 var reg = /^[a-zA-Z-（）,\s]*\s*[\u4E00-\u9FA5\uF900-\uFA2D_（）]*[a-zA-Z-\u4E00-\u9FA5\uF900-\uFA2D（）]*[/(]*[0-9]{0,8}[/)]*$/;
			if (!reg.test($scope.userLable[index].model.value)) {
				$scope.userLable[index].model.value = null;
    		} else {
				if (null != $scope.userLable[index].model.value && $scope.userLable[index].model.value != '') {
					var params = {
						"userFullName": $scope.userLable[index].model.value
					};
					HomeService.validateUser(params).then(function (result) {
						if (!result.flag) {
    			   			 if (null != result.allUsers) {
								$scope.userList = result.allUsers;
    			   			 }
						}
					});
				}
    		}
    };


    // //////////分页////////////
    vm.$on('sn.controls.pager:pageIndexChanged', function(evt, page) { // 分页操作
        evt.stopPropagation();
        $scope.pager.pageNumber = page.pageIndex + 1;
        getSystemCodeReviewDatas($scope.pager.pageNumber);
    });

}]);