angular.module('sncd').controller('VersionDeployCtrl', ['$scope', 'VersionManageService','$state','$stateParams',
  function($scope, VersionManageService,$state,$stateParams) {
    'use strict';

    ///////////////////functions//////////////////
   var sysId = $stateParams.sysId;
   var versionId = $stateParams.versionId;
   
   var vm = $scope,
   formData = vm.formData = {},
   sysMap = {},
   pager = vm.pager = {
       pageNumber: 1,
       totalCount: 0, //总条数
       pageSize: 10
   };
   
   init();
    
   //分页
   vm.$on('sn.controls.pager:pageIndexChanged', function(evt, page) { // 分页操作
     evt.stopPropagation();
     pager.pageNumber = page.pageIndex + 1;
     getDeployReq(pager.pageNumber);
   });
   
   
   function init() {
	   getDeployReq( $scope.pager.pageNumber);
   	}
   
   function getDeployReq(pageNumber){
	   VersionManageService.versionDeployReq({sysId:sysId,versionId:versionId,pageNum:pageNumber,flag:$scope.deployReqFlag}).then(function (result){
  		 $scope.pager.totalCount = result.totalDataCount;
  	     $scope.pager.pageNumber = result.pageNumber;
  	     $scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);
  	     
  	     $scope.deployReqList = result.datas;
  	})
	   
   }
   
   
   
   $scope.showDeployReq = function (){
	   var params = {};
	   if($scope.flag){
		   $scope.deployReqFlag = '1';
	   }else{
		   $scope.deployReqFlag = null;
	   }
	   pager.pageNumber = 1;
	   getDeployReq(pager.pageNumber);
	   
   }
   
   
  }
]);
