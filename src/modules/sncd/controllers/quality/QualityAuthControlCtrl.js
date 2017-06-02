angular.module('sncd').controller('QualityAuthControlCtrl',['$scope','AlertService','QuaService','DialogService','$state','$stateParams',
    function ($scope,AlertService,QuaService,DialogService,$state,$stateParams) {
        'use strict';
        var vm=$scope,
            pager=vm.pager = {
                pageNumber: 1,
                totalCount: 0, // 总条数
                pageSize: 10
            };


        function init() {
        	$scope.show = "0";
        	var roles=JSON.parse(sessionStorage.getItem("roles"));
        	if(roles!=undefined && null!=roles && null!=roles.ROLE_QUALITY_AUTH_CONTROL){
        		$scope.show = "1";
        	}
            //获取当前系统下的白名单信息
            getWhileList(1);
        }

        // 获取当前用户下所有系统的代码评审记录
        function getWhileList(pageNumber) {
            var params={
                pageNum: pageNumber,
                sysName: $scope.sysName,
            };
            QuaService.getWhileList(params).then(function (result) {
                    $scope.pager.totalCount=result.totalDataCount;
                    $scope.pager.pageNumber=result.pageNumber;
                    $scope.whitelist=result.datas;
                    $scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);
                }
            );
        }

        // 搜索
        $scope.search=function(){
            getWhileList($scope.pager.pageNumber);
        };

        //增加或者删除白名单信息
        $scope.updateWhitelist=function (sysId,isValid) {
            var params={
                sysId: sysId,
                isValid: isValid
            }
            QuaService.updateWhitelist(params).then(function (result) {
                    AlertService.alert({
                        title: "提示",
                        content: result
                    });
                    $scope.search();
                }
            )
        }



        init();


        ///////////增加白名单//////
        $scope.addWhitelist=function(){
        	DialogService.modal({
        	key: "quality.whitelist",
        	url: "modules/sncd/templates/quality/add-quality-white-dialog.html",
        	accept:function(result){
        		getWhileList($scope.pager.pageNumber);
        	}},null);
        }


        // //////////分页////////////
        $scope.$on('sn.controls.pager:pageIndexChanged', function(evt, page) { // 分页操作
            evt.stopPropagation();
            $scope.pager.pageNumber = page.pageIndex + 1;
            getWhileList($scope.pager.pageNumber);
        });

    }]);