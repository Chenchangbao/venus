angular.module('sncd').controller('SystemManageCtrl', ['$scope', 'SystemService', '$state', '$stateParams','DialogService',
    function ($scope, SystemService, $state, $stateParams, DialogService) {

        'use strict';

        var vm = $scope,
            formData = vm.formData = {},
            sysMap = {},
            pager = vm.pager = {
                pageNumber: 1,
                totalCount: 0, //总条数
                pageSize: 10
            };
        //系统的所有状态
        vm.statusList = [
            {'code': "", 'name': "请选择"},
            {'code': "102", 'name': "运行中"},
            {'code': "296", 'name': "未启用"}
        ];
        formData.selectedStatus = {'code': "", 'name': "请选择"};

        //$scope.currWorkNo = $rootScope.currUser && $rootScope.currUser.workNo;

        ////////////////functions/////////////////
        function init() {
            getMySystemList(0);
            //获取系统权限
            SystemService.hasPermissionMap({sysId:''}).then(function (result){
            	$scope.hasPermissionMap  = result.hasPermissionMap;//授权map
            });
        }

        // 查询系统列表
        function getMySystemList(pageNumber) {

            var params = {
                pageNum: pageNumber,
                keyword: $scope.keyword,
                sysStat: (formData.selectedStatus||{}).code|| $stateParams.status ||''
            };

            SystemService.getMySystem(params).then(function (result) {
                $scope.pager.totalCount = result.totalDataCount;
                $scope.pager.pageNumber = result.pageNumber;
                $scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);
                $scope.sysList = result.datas;
                if($stateParams.status){
                    formData.selectedStatus = $stateParams.status;
                }
//        for(var i = 0; i < $scope.sysList.length; i++){
//            sysMap[$scope.sysList[i].id] = $scope.sysList[i];
//        }
//
//        SystemService.getVersionNum().then(function(result){
//            $scope.sysPart = result.datas;
//            for(var j = 0; j < $scope.sysPart.length; j++){
//              sysMap[$scope.sysPart[j].id].trend = $scope.sysPart[j].trend;
//            }
//          })
            });
        }
        
        //状态过滤
        vm.statusFilter = function(status) {
           formData.selectedStatus = status;
           getMySystemList(0);
        };
        /////////////////$scope functions/////////////////

        $scope.getSystemVersions = function (sys, type) {
            $state.go("VersionManage", {
                sysId: sys.sysId,
                type: type
            });
        };

        //搜索
        $scope.search = function () {
            getMySystemList(0);
        }


        $scope.createVersion = function (sys) {
            $state.go("CreateVersion", {
                id: sys.sysId
            });
        };
        //旧页面
        $scope.pCSystemJump = function (sys) {
            $state.go("PCSystemJump", {
            	href : 'branch/getBranchBySysId.htm?sysId='+sys.sysId
            });
        };
        $scope.sAPSystemJump = function (sys) {
            $state.go("SAPSystemJump", {
            	href : 'newSystem/sapSystemDetailInfo.htm?sysId='+sys.sysId
            });
        };

        //跳转打包配置
        $scope.goPackageConfig = function (system) {
            SystemService.createOrDetail({"sysId": system.sysId}).then(function (result) {
                if (result.showType == "1") {//进入详情
                    $state.go("PackageConfig", {
                        sysId: system.sysId
                    });
                } else {//进入新建
                    $state.go("AddPackageConfig", {
                        sysId: system.sysId
                    });
                }
            });
        }
        
        
        
        $scope.open = function (sysId,type){
        	if(type == '1'){
        		window.open("repository/getReposPermission.htm?sysId="+sysId,'', 'height=800, width=1000,left=200');
        	}else{
        		window.open("codeRepos/toCreateCodeReposPage.htm?sysId="+sysId,'', 'height=800, width=1000,left=200');
        	}
        }
        
        //激活系统
        $scope.activeSystem=function (system){
        	DialogService.modal({
                key: "system.systemActiveDialog",
                url: "modules/sncd/templates/system/system-active-dialog.html"
            },{
            	type:"1",
            	sysId:system.sysId
            });
        }
        
        $scope.addSvnRepo=function(sysId,sysName){
        	DialogService.modal({
        		key: "system.addNewSvnCodeRepo",
        		url:"modules/sncd/templates/system/add-svn-coderepo.html",
        		accept:function(result){
        			//刷新页面
                	location.reload(true);
        		}
        		
        	},{
        		sysId: sysId,
        		sysName:sysName
        	});
        	
        }

        ///////////////////Events//////////////////
        //分页
        vm.$on('sn.controls.pager:pageIndexChanged', function (evt, page) { // 分页操作
            evt.stopPropagation();
            getMySystemList(page.pageIndex + 1);
        });

        init();
        return vm;


    }]);