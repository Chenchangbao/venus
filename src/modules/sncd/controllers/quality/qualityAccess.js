angular.module('sncd').controller('QualityAccessCtrl', ['$scope', 'QuaService','$state','$stateParams','SystemService',
    function ($scope, QuaService, $state, $stateParams,SystemService) {
    'use strict';

    var vm = $scope;
    var formData = $scope.formData = {},
    pager = vm.pager = {
            pageNumber: 1,
            totalCount: 0, //总条数
            pageSize: 10
          };

   
    /////////////functions///////////////

    
//1:系统 2：版本 3:每次构建
	
	function init(){
		$scope.search();
	}
    $scope.search = function(){
    	formData.quaLevel = 1;
    	getQualityAccess(null,null,null);
    }
    $scope.getSysQualityAccess = function(orgId){
    	formData.quaLevel=2;
    	formData.orgId=orgId;
    	getQualityAccess($scope.pager.pageNumber,$scope.pager.pageSize,formData.orgId);
    }
    $scope.exportExcel = function(){
    	if(formData.quaLevel==1){
    		document.location.href="angular/quality/exportQuaAccExcel.htm";
    	}else{
    		document.location.href="angular/quality/exportQuaAccExcel.htm?orgId="+formData.orgId;
    	}
    }
    function getQualityAccess(pageNumber,pageSize,orgId){
    	var params = {
    			pageNumber: pageNumber,
    			pageSize: pageSize,
    			type:formData.quaLevel,
    			orgId:orgId
    	};
    	QuaService.getQualityAccess(params).then(function (result) {
    		$scope.sonarAnalyseResultBo=result.datas;
          	$scope.pager.totalCount = result.totalDataCount;
            $scope.pager.pageNumber = result.pageNumber;
    	});
    }
    
    ///////////////////Events///////////////////

    vm.$on('sn.controls.pager:pageIndexChanged', function(evt, page) { // 分页操作
        evt.stopPropagation();
        getQualityAccess(page.pageIndex + 1,$scope.pager.pageSize,formData.orgId);
      });
    init();

    return vm;

}]);
