//新建发布单
angular.module('sncd').controller('VisualizationManageCtrl', ['$scope', '$filter', 'OperationManageService','SystemService','DialogService','AlertService','$state', '$stateParams',
    function ($scope, $filter, OperationManageService,SystemService,DialogService,AlertService,$state, $stateParams) {

	 	var vm = $scope,
 		   pager = vm.pager = {
 	       pageNumber: 1,
 	       totalCount: 0, //总条数
 	       pageSize: 10
 	    };
	 	var searchParam = $scope.searchParam={};
		//页面数据初始化
	 	var envTypes =  $scope.envTypes =  [{envType:'171',envName:'本地测试'},{envType:'019',envName:'集成测试'},{envType:'020',envName:'预生产'},{envType:'021',envName:'生产'}];
	 	var sysStatusList =  $scope.sysStatusList =  [{status:'0',name:'已销毁'},{status:'1',name:'使用中'}];
	 	init();
	    function  init() {
	    	//获取研发中心下拉  
            SystemService.getOrgList().then(function (result) {
                $scope.orgs = result;
            })
	    	//数据初始化话
	    	//queryList(0);
	    }

	    $scope.reStartDM = function (obj) {
//	    	AlertService.confirm({
//				title: "消息提示",
//				content: "是否确认重启集群",
//				button1:"确认",
//				button2:"取消"
//			}).then(function () {
				
				DialogService.modal({
	                key: "operation.restartDM",
	                url: "modules/sncd/templates/operation/restart-dm-dialog.html"
	            },{
	        		id:obj.item.dmId,
	        		dmName:obj.item.dmName,
	        		sysCnname:obj.item.sysCnname,
	        		envName:obj.item.envName,
	        		wasType:obj.item.wasType,
	        		envType:obj.item.envType,
	        		appServerType:obj.item.appServerType
	            });
				
//			});
	    }
	    
	    $scope.search = function(){
	    	queryList(0);
	    }
	    
	    function queryList(pageNumber){
	    	var orgId = $scope.searchParam.orgId;
	    	var sysEnName = $scope.searchParam.sysEnName;
	    	var sysStatus = $scope.searchParam.sysStatus;
	    	var envType = $scope.searchParam.envType;
	    	if(orgId == null 
	    			&& (sysEnName == null || sysEnName=="")
	    			&& sysStatus == null
	    			&& envType == null){
	    		alert("请选择查询条件");
	    		return false;
	    	}
	    	var params = {
		        pageNumber: pageNumber,
		        pageSize:10,
		        orgId:orgId,
		        sysEnName:sysEnName,
		        sysStatus:sysStatus,
		        envType:envType
		    };
	    	OperationManageService.getVisualizationList(params).then(function(result){
	    		$scope.pager.totalCount = result.searchResult.totalSize;
	    		$scope.pager.pageNumber = result.searchResult.currentPage;
	    		$scope.list = result.searchResult.searchResultList;
	    	});
	    }
	    
///////////////////Events//////////////////
        //分页
        vm.$on('sn.controls.pager:pageIndexChanged', function (evt, page) { // 分页操作
          evt.stopPropagation();
          pager.pageNumber = page.pageIndex + 1;
          queryList(pager.pageNumber);
        });
    }
]);