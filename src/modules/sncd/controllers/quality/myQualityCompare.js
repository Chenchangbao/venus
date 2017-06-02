angular.module('sncd').controller('MyQualityCompareCtrl', ['$scope', 'QuaService','$state','$stateParams',
    function ($scope, QuaService, $state, $stateParams) {
    'use strict';

    var vm = $scope;
    var formData = $scope.formData = {},
    pager = vm.pager = {
            pageNumber: 1,
            totalCount: 0, //总条数
            pageSize: 10
          },
    systemPage = $scope.systemPage = 1,
    versionPage = $scope.versionPage = 1;
   
    /////////////functions///////////////

    
//1:系统 2：版本 3:每次构建
    function init() {
    	var type= $stateParams.type;
    	if(type==2){
    		formData.quaLevel = 2;
	    	var sysId = $stateParams.sysId;
	    	getNewMyQuality($scope.pager.pageNumber,$scope.pager.pageSize,sysId);
    	}else{
    		formData.quaLevel = 1;
    	 	getNewMyQuality($scope.pager.pageNumber,$scope.pager.pageSize);
    	}
    }
    
    function getNewMyQuality (pageNumber,pageSize,sysId,versionId){
    	var params = {
    			pageNumber: pageNumber,
    			pageSize: pageSize,
    			sysId:sysId,
    			versionId:versionId,
    			type:formData.quaLevel
            };
    	QuaService.getNewMyQuality(params).then(function (result) {
    		formData.currentPageNumber=result.pageNumber;
          	$scope.pager.totalCount = result.totalDataCount;
            $scope.pager.pageNumber = result.pageNumber;
    		$scope.sonarAnalyseResultBo=result.datas;
    		$scope.sonarUrl=result.sonarUrl;
    		$scope.jenkinsUrl=result.jenkinsUrl;
    		$scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);
    	});
    };
    ////////////////$scope functions/////////////////

    $scope.getVersionSAResult = function (sysId){
    	formData.sysId=sysId;
    	formData.quaLevel=2;
    	systemPage=$scope.pager.pageNumber;
    	getNewMyQuality(1,$scope.pager.pageSize,formData.sysId,null);
    };
  
    $scope.getVersionDetailSAResult = function (versionId){
    	formData.versionId=versionId;
    	formData.quaLevel=3;
    	versionPage=$scope.pager.pageNumber;
    	getNewMyQuality(1,$scope.pager.pageSize,formData.sysId,formData.versionId);
    };
    
    
    $scope.buildCodeQuality = function (sysId,buildId,type){
		  $state.go("CodeBuild", {
			  sysId:sysId,
			  buildId:buildId,
			  type:'myQuality'
	      });
    }
    $scope.backQuaComp = function() {
    	if(formData.quaLevel == 2) {
    		formData.quaLevel=1;
    		getNewMyQuality(systemPage,$scope.pager.pageSize,formData.sysId,formData.versionId);
        }else if(formData.quaLevel == 3) {
        	formData.quaLevel=2;
    		getNewMyQuality(versionPage,$scope.pager.pageSize,formData.sysId,formData.versionId);
        }
    };
    
    ///////////////////watches//////////////////////////////

    ///////////////////Events///////////////////

    vm.$on('sn.controls.pager:pageIndexChanged', function(evt, page) { // 分页操作
        evt.stopPropagation();
        	getNewMyQuality(page.pageIndex + 1,$scope.pager.pageSize,formData.sysId,formData.versionId);
      });
    init();

    return vm;

}]);
