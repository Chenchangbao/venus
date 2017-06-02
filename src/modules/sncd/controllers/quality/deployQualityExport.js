angular.module('sncd').controller('DeployQualityExportCtrl', ['$scope', 'QuaService','$state','$stateParams','SystemService',
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

    
//1:全部系统 2：某系统所有版本 
	function init(){
		vm.search_button_clicked=false;
		SystemService.getOrgList().then(function (result) {
            $scope.orgs = result;
        })
        var today=new Date();
    	vm.buildTimeStart=new Date(today.getFullYear(),today.getMonth()-1,1);
    	vm.buildTimeEnd=new Date(today.getFullYear(),today.getMonth(),0);
		$scope.search();
	}
    $scope.search=  function(){
    	
    	$scope.button_clicked = false;
    	var type= $stateParams.type;
		formData.quaLevel = 1;
		var	sysId = $stateParams.sysId
		if(dateCheck($scope.buildTimeStart,$scope.buildTimeEnd)){
		getDeployQuality($scope.pager.pageNumber,$scope.pager.pageSize,sysId);
		}
    }
    /**
     * 查找所有中心下所有系统的发布信息，计算出发布成功率
     */
    function getDeployQuality(pageNumber,pageSize,sysId){
    	var params = {
    			type:formData.quaLevel,
    			pageNumber: pageNumber,
    			pageSize: pageSize,
    			sysId: sysId,
    			orgId:$scope.orgId,
    			sysName:$scope.sysName,
    			reposName:$scope.reposName,
    			buildTimeStart:$scope.buildTimeStart,
    			buildTimeEnd:$scope.buildTimeEnd
    	};
    	vm.search_button_clicked=true;
    	QuaService.getAllDeployinfoQuality(params).then(function(result){
    		vm.search_button_clicked=false;
    		formData.currentPageNumber=result.pageNumber;
          	$scope.pager.totalCount = result.totalDataCount;
            $scope.pager.pageNumber = result.pageNumber;
    		$scope.deployqualitybo=result.datas;
    		$scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);
    	})
    }
    
	//导出
	$scope.button_clicked = false;
	$scope.exportDeployExcel=function (){
		
		if(dateCheck($scope.buildTimeStart,$scope.buildTimeEnd)){
			var	orgId=vm.orgId,
			sysName=vm.sysName,
			reposName=vm.reposName,
			buildTimeStart=vm.buildTimeStart,
			buildTimeEnd=vm.buildTimeEnd;
			if(typeof(orgId)=="undefined" || orgId ==null){
				orgId="";
			}
			if(typeof(reposName)=="undefined"){
				reposName="";
			}
			if(typeof(sysName)=="undefined"){
				sysName="";
			}
			if(typeof(buildTimeStart)=="undefined"){
				buildTimeStart="";
			}
			if(typeof(buildTimeEnd)=="undefined"){
				buildTimeEnd="";
			}
			$scope.button_clicked = true;
			document.location.href="angular/quality/ExportDeployExcel.htm?orgId="+orgId+"&reposName="+reposName+"&sysName="+sysName+"&buildTimeStart="+buildTimeStart+"&buildTimeEnd="+buildTimeEnd;
		}
		
		}

	function dateCheck(dateStart,dateEnd){
		if(typeof(dateStart)=="undefined" || typeof(dateEnd)=="undefined"){
			alert("时间不能为空！请选择起始和终止时间！");
			return false;
		}
		var date1=new Date(dateStart);
		var date2=new Date(dateEnd);
		if(date1.getMonth()!=date2.getMonth() || date1.getFullYear()!=date2.getFullYear()){
			alert("时间不能跨月，注意结束之间不能早于开始时间！");
			return false;
		}else{			
			return true;
		}
	}
	
    ////////////////$scope functions/////////////////

    $scope.getSysVersionQualityInfo = function (sysId){
    	$scope.button_clicked = false;
    	formData.sysId=sysId;
    	formData.quaLevel=2;
    	getDeployQuality($scope.pager.pageNumber,$scope.pager.pageSize,formData.sysId);
    };
  /**
   * 返回
   */
    $scope.backQuaComp = function() {
    	$scope.button_clicked = false;
    		formData.quaLevel=1;
    		getDeployQuality(formData.currentPageNumber,$scope.pager.pageSize,null);
    };
    
    $scope.getMouthLimit=function(timevalue){
    	timevalue=timevalue.replace(/-/g,"/");
    	formData.firstDayOfMouth = new Date(date.getFullYear(),date.getMonth(),1);
    	formData.lastDayOfMouth = new Date(date.getFullYear(),date.getMonth()+1,0);
    }
    /*
    function getMouthEndLimit(){
    	var timevalue=$scope.buildTimeStart;
    	vm.lastDayOfMouth = new Date(timevalue.getFullYear(),timevalue.getMonth()+1,0);
    }
    function getMouthStartLimit(){
    	var timevalue=$scope.buildTimeEnd;
    	vm.firstDayOfMouth = new Date(timevalue.getFullYear(),timevalue.getMonth(),1);
    }
    ///////////////////watches//////////////////////////////
    
	$scope.$watch('buildTimeStart', function(newVal){
		if(newVal){
			getMouthEndLimit();
		}
	});
	$scope.$watch('buildTimeEnd', function(newVal){
		if(newVal){
			getMouthStartLimit();
		}
	});
*/
    ///////////////////Events///////////////////

    vm.$on('sn.controls.pager:pageIndexChanged', function(evt, page) { // 分页操作
        evt.stopPropagation();
        getDeployQuality(page.pageIndex + 1,$scope.pager.pageSize,formData.sysId);
      });
    init();

    return vm;

}]);
