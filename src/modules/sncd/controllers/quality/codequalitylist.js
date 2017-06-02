angular.module('sncd').controller('CodeQualityCtrl', ['$scope', '$state', '$stateParams','QuaService',
    function ($scope, $state, $stateParams,QuaService) {

		var formData = $scope.formData = {};
        $scope.pager = {
            pageNumber: 1,
            totalCount: 0, //总条数
            pageSize: 10
        };

        
        /////////////functions///////////////
        function init() {
        	$scope.pager.pageNumber=1;
        	getQuaDetailList($scope.pager.pageNumber);
        }

        
        // 查询质量列表
        function getQuaDetailList(pageNumber){
        	formData.sysId =$stateParams.sysId;
        	var buildId =$stateParams.buildId;
        	var branchId =$stateParams.branchId;
        	var pageSize=$scope.pager.pageSize;
        	var params = { 
        			buildId:buildId,
        			pageNumber:pageNumber,
        			pageSize:pageSize
        		};
            QuaService.getQuaDetailList(params).then(function(result){
                $scope.pager.totalCount = result.totalDataCount;
                $scope.pager.pageNumber = result.pageNumber;
                $scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);
                $scope.branchBuildInfoBo = result.branchBuildInfoBo;
                $scope.sonarBaseBoList = result.sonarBaseBoList;
                $scope.quaList = result.datas;
                $scope.sonarUrl=result.sonarUrl; 
                $scope.jenkinsUrl=result.jenkinsUrl;
                $scope.branchId=branchId;
            });
        }

        ////////////////$scope functions/////////////////

       
        $scope.pushQuaList = function(index,sonarBaseId){
        	formData.indexInfo=index;
        	formData.flag=1;
        	$scope.sonarBaseBoList.forEach(function(item, index1){
        		if(sonarBaseId==item.sonarBaseId){
        			$scope.sonarBase=item;
        		}
        	})
        };
        
        
        $scope.hideQuaList = function(index){
        	formData.flag=0;
        };
        
        
        ///////////////////watches//////////////////////////////

        ///////////////////Events///////////////////
        //分页
        $scope.$on('sn.controls.pager:pageIndexChanged', function(evt, page) { // 分页操作
            evt.stopPropagation();
            getQuaDetailList(page.pageIndex + 1);
        });


        init();


    }
]);
