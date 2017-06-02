angular.module('sncd').controller('VersionFinishCtrl', ['$scope', 'VersionManageService', 'DeployReqManageService', 'DialogService', '$state', '$stateParams', 'SystemService',
  function ($scope, VersionManageService, DeployReqManageService, DialogService, $state, $stateParams, SystemService) {
    'use strict';

    var vm = $scope,
      formData = vm.formData = {},
      pager = vm.pager = {
        pageNumber: 1,
        totalCount: 0, //总条数
        pageSize: 10
      },
    //版本的所有状态
    statusList = vm.statusList = [
          {code: '', name: '全部'},
    		// { 'code': "059", 'name': "进行中" },
    		// { 'code': "060", 'name': "已封版" },
            
         		{'code': "063", 'name': "已合并"},
         		{'code': "178", 'name': "已废弃"},
      //    		{'code': "061", 'name': "PRE封版"},
      //    		{'code': "062", 'name': "PRD封版"},
    		// { code: "0591", name: '测试中' }
    ],
    sysNameList = ["全部"];
    ///////////////////functions//////////////////
    function init() {
      formData.selectedStatus = statusList[0];
      formData.selectedSysName =sysNameList[0];
      querySysNameList();
      queryMyVersion($scope.pager.pageNumber);
      //获取系统权限
      // SystemService.hasPermissionMap({ sysId: '' }).then(function (result) {
      //   $scope.hasPermissionMap = result.hasPermissionMap;//授权map
      // });
    }

    //查询系统名列表
		function querySysNameList(){
//			VersionManageService.getSysNameList().then(function(result){
//				sysNameList = sysNameList.concat(result);
//				vm.sysNameList = sysNameList;
//			});
			SystemService.mySystemNameList().then(function(result){
				sysNameList = sysNameList.concat(result);
				vm.sysNameList = sysNameList;
			});
		}
    
    // 查询版本列表
    function queryMyVersion(pageNumber) {

      var params = {
        type: 2,
        pageNumber: pageNumber,
        sysName:(formData.selectedSysName||""),
        sysId:(formData.selectedSysName||{}).sysId || $stateParams.sysId || '',
        versionStatus: (formData.selectedStatus||{}).code|| $stateParams.status || '',
        keyword: $scope.keyword
      };

      VersionManageService.getMyVersion(params).then(function (result) {
        $scope.pager.totalCount = result.totalDataCount;
        $scope.pager.pageNumber = result.pageNumber;
        $scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);

        $scope.userId = result.userId;
        $scope.versList = result.datas;
        $scope.type = 2;
        $scope.operationBoMap = result.operationBoMap;
        $scope.sysId = $stateParams.sysId;
      });
    }

    /////////////////$scope functions/////////////////
    $scope.search=function (){
    	queryMyVersion(0);
    }
    
     vm.statusFilter = function(status) {
       formData.selectedStatus = status;
       queryMyVersion(0);
    };
    
    //系统筛选
		vm.sysNameFilter = function(sysName) {
       formData.selectedSysName = sysName;
       queryMyVersion(0);
    };
    ///////////////////Events//////////////////
    //分页
    vm.$on('sn.controls.pager:pageIndexChanged', function (evt, page) { // 分页操作
      evt.stopPropagation();
      pager.pageNumber = page.pageIndex + 1;
      queryMyVersion(pager.pageNumber);
    });

    init();


    return vm;
  }
]);
