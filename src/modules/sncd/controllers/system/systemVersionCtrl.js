//系统应用包controller
angular.module('sncd').controller('SystemVersionCtrl', ['$scope', 'VersionManageService','$state','$stateParams',
  function($scope, VersionManageService,$state,$stateParams) {
	'use strict';
	
	var vm = $scope,
    pager = vm.pager = {
        pageNumber: 1,
        totalCount: 0, //总条数
        pageSize: 10
    };
    ///////////////////functions//////////////////
    function init() {
    	var sysId =  $stateParams.sysId;
    	var params = { sysId: sysId };
    	getVersionBySys(params);
    }
    
    //复制按钮的相关方法

    $scope.doSomething = function (){
    	
    	alert("复制成功！");
    };
    
    // 查询系统下分支
    function getVersionBySys(params){
    	VersionManageService.getVersionBySys(params).then(function(result){
    			$scope.sysId = $stateParams.sysId;
    		    $scope.versionList=result.datas;
    		    $scope.pager.totalCount = result.totalDataCount;
                $scope.pager.pageNumber = result.pageNumber;
                $scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);
      });
    }
    
    init();

    
    //分页
    vm.$on('sn.controls.pager:pageIndexChanged', function (evt, page) { // 分页操作
        evt.stopPropagation();
        var params = { sysId: $stateParams.sysId,pageNumber:page.pageIndex + 1 };
        getVersionBySys(params);
    });
    
    return vm;
  }
]);
