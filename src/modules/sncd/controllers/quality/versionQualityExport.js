angular.module('sncd').controller('VersionQualityExportCtrl', ['AlertService','$scope', 'QuaService','$state','$stateParams','SystemService',
    function (AlertService,$scope, QuaService, $state, $stateParams,SystemService) {
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
		SystemService.getOrgList().then(function (result) {
            $scope.orgs = result;
        })
		$scope.search();
	}
	function dateCheck(dateStart,dateEnd){
		if(typeof(dateStart)=="undefined" || typeof(dateEnd)=="undefined"){
			return true;
		}
		var date1=new Date(dateStart);
		var date2=new Date(dateEnd);
		if (date1 > date2) {
			AlertService.alert({
				title : '提示信息',
				content : '结束时间不能早于开始时间'
			});
			return false;
		} else if (date1.getMonth() != date2.getMonth()
				|| date1.getFullYear() != date2
						.getFullYear()) {
			AlertService.alert({
				title : '提示信息',
				content : '时间不能跨月'
			});
			return false;
		} else {
			return true;
		}
	}
    $scope.search=  function(){
    	$scope.button_clicked = false;
    	var type= $stateParams.type;
		formData.quaLevel = 2;
		var	sysId = $stateParams.sysId;
		if(dateCheck($scope.buildTimeStart,$scope.buildTimeEnd)){
			getQualityExport($scope.pager.pageNumber,$scope.pager.pageSize,sysId,
					$scope.sysCnname,$scope.sysName,$scope.buildTimeStart,$scope.buildTimeEnd,$scope.orgId);
		};
	
    }
    
    function getQualityExport (pageNumber,pageSize,sysId,
    		sysCnname,sysName,buildTimeStart,buildTimeEnd,orgId){
    	$scope.isWaiting = true;
    	var params = {
    			pageNumber: pageNumber,
    			pageSize: pageSize,
    			type:formData.quaLevel,
    			sysId:sysId,
    			sysCnname:sysCnname,
    			sysName:sysName,
    			buildTimeStart:buildTimeStart,
    			buildTimeEnd:buildTimeEnd,
    			orgId:orgId
            };
    	QuaService.getQualityExport(params).then(function (result) {
    		formData.currentPageNumber=result.pageNumber;
          	$scope.pager.totalCount = result.totalDataCount;
            $scope.pager.pageNumber = result.pageNumber;
    		$scope.sonarAnalyseResultBo=result.datas;
    		$scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);
            $scope.buildTimeStart = result.buildTimeStart;
            $scope.buildTimeEnd = result.buildTimeEnd;
            $scope.isWaiting = false;
    	});
    };
    
	//导出
	$scope.button_clicked = false;

	$scope.exportVerExcel=function (){
		var	orgId=vm.orgId,
		sysName=vm.sysName,
		buildTimeStart=vm.buildTimeStart,
		buildTimeEnd=vm.buildTimeEnd;
		
		if(typeof(orgId)=="undefined" || orgId === null){
			orgId="";
		}
		if(typeof(sysName)=="undefined" || sysName === null){
			sysName="";
		}
		if(typeof(buildTimeStart)=="undefined" || buildTimeStart === null){
			buildTimeStart="";
		}
		if(typeof(buildTimeEnd)=="undefined" || buildTimeEnd === null){
			buildTimeEnd="";
		}
		$scope.button_clicked = true;
		document.location.href="angular/quality/ExportVerExcel.htm?orgId="+orgId+"&sysName="+sysName+"&buildTimeStart="+buildTimeStart+"&buildTimeEnd="+buildTimeEnd;
	}

    ///////////////////Events///////////////////

    vm.$on('sn.controls.pager:pageIndexChanged', function(evt, page) { // 分页操作
        evt.stopPropagation();
        getQualityExport(page.pageIndex + 1,$scope.pager.pageSize,formData.sysId,
				$scope.sysCnname,$scope.sysName,$scope.buildTimeStart,$scope.buildTimeEnd,$scope.orgId);
      });
    init();

    return vm;

}]);
