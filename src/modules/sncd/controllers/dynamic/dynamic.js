angular.module('sncd').controller('DynamicManageCtrl', ['$scope', 'HomeService', 'DynamicService','$filter',
    function ($scope, HomeService,DynamicService, $filter) {
        'use strict';

        var vm = $scope;
        var formData = $scope.formData = {},
        pager = vm.pager = {
                pageNumber: 1,
                totalCount: 0, //总条数
                pageSize: 10
              };
       
        /////////////functions///////////////

       
        function init() {
        	//默认展示我的动态	
            $scope.selecteddynamic = 3;
            getMyDynamicState($scope.pager.pageNumber);
        }
     
        
        function getMyDynamicState(pageNumber){
          
        	var params = {
                    pageNumber:pageNumber,
       			 	pageSize: $scope.pager.pageSize,
       			 	startTime:$filter('date')(formData.startTime, 'yyyy-MM-dd HH:mm:ss'),
    			 	endTime: $filter('date')(formData.endTime, 'yyyy-MM-dd HH:mm:ss'),
    			 	keyWord:formData.keyWord
        	};
            HomeService.getMyDynamicState(params).then(function (result) {
            	 $scope.pager.totalCount = result.totalDataCount;
                 $scope.pager.pageNumber = result.pageNumber;
                 $scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber); 
            	$scope.dynamicState = result.datas;
            });
        };
        
        
        function getMySystemDynamicState(pageNumber){
            
        	var params = {
                    pageNumber:pageNumber,
       			 	pageSize: $scope.pager.pageSize,
       			 	day:7,
       			 	startTime:$filter('date')(formData.startTime, 'yyyy-MM-dd HH:mm:ss'),
    			 	endTime: $filter('date')(formData.endTime, 'yyyy-MM-dd HH:mm:ss'),
    			 	keyWord:formData.keyWord
        	};
        	DynamicService.getMySystemDynamicState(params).then(function (result) {
        		 $scope.pager.totalCount = result.totalDataCount;
                 $scope.pager.pageNumber = result.pageNumber;
                 $scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);
        		$scope.dynamicState = result.datas;
            });
        };
        
        function getDynamicState(pageNumber){
            
        	var params = {
                    pageNumber:pageNumber,
       			 	pageSize: $scope.pager.pageSize,
       			 	startTime:$filter('date')(formData.startTime, 'yyyy-MM-dd HH:mm:ss'),
       			 	endTime: $filter('date')(formData.endTime, 'yyyy-MM-dd HH:mm:ss'),
       			 	keyWord:formData.keyWord
        	};
        	DynamicService.getDynamicState(params).then(function (result) {
        		 $scope.pager.totalCount = result.totalDataCount;
                 $scope.pager.pageNumber = result.pageNumber;
                 $scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber); 
        		 $scope.dynamicState = result.datas;
            });
        };
      
        ////////////////$scope functions/////////////////

        $scope.dynamic = function (tabNo) {
            $scope.selecteddynamic = tabNo;
            $scope.pager.pageNumber=1;
            if (tabNo === 1) {
            	getMySystemDynamicState($scope.pager.pageNumber);
            } else if (tabNo === 2) {
            	getDynamicState($scope.pager.pageNumber);
            } else {
            	getMyDynamicState($scope.pager.pageNumber);
            }
        };

        
        $scope.search = function(){
        	 $scope.pager.pageNumber=1;
        	 if($scope.selecteddynamic===1){
        		 getMySystemDynamicState($scope.pager.pageNumber);
             }else if($scope.selecteddynamic===2){
             	getDynamicState($scope.pager.pageNumber);
             }else {
             	getMyDynamicState($scope.pager.pageNumber);
             }
        }
        
        ///////////////////watches//////////////////////////////

        ///////////////////Events///////////////////

        vm.$on('sn.controls.pager:pageIndexChanged', function(evt, page) { // 分页操作
            evt.stopPropagation();
            if($scope.selecteddynamic===1){
            	getMySystemDynamicState(page.pageIndex + 1);
            }else if($scope.selecteddynamic===2){
            	getDynamicState(page.pageIndex + 1);
            }else {
            	getMyDynamicState(page.pageIndex + 1);
            }
          });
        init();

        return vm;

    }
]);
