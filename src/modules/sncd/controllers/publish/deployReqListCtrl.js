angular.module('sncd').controller('DeployReqListCtrl', ['$scope', 'DeployReqManageService','SystemService','$filter','baseUrl','$state',
       function($scope, DeployReqManageService,SystemService,$filter,baseUrl,$state) {
          'use strict';
          var vm = $scope,
          formData = vm.formdata = {},
          pager = vm.pager = {
              pageNumber: 1,
              totalCount: 0, //总条数
              pageSize: 10
          };

          /////////////functions///////////////

        var envTypes =  $scope.envTypes =  [{envType:'019',envName:'集成测试'},{envType:'020',envName:'预生产'},{envType:'021',envName:'生产'}];
        var deployReqStatuss =  $scope.deployReqStatuss =  [
        	{status:"132",statusDesc:'待发布'},{status:"144",statusDesc:"应用发布中"},{status:"145",statusDesc:"发布单结束"}
        ];
        		
		function init() {
			
			
			$scope.deployParam = {};
			
			$scope.baseUrl = baseUrl;
			
			
			//获取研发中心下拉  
            SystemService.getOrgList().then(function (result) {
                $scope.orgs = result;
            })
			
            
            
			queryDeployReqList();
		}

		//查询发布单
		function queryDeployReqList(){
			
			DeployReqManageService.getDeployReqList($scope.deployParam).then(function (result) {
                $scope.pager.totalCount = result.totalDataCount;
                $scope.pager.pageNumber = result.pageNumber;
                $scope.$broadcast('sn.controls.pager:toPage', $scope.pager.pageNumber);
                
                $scope.deployReqList = result.datas;
                $scope.isRoleDeployer = result.isRoleDeployer;
                
                $scope.deployParam.planTimeStart = result.planTimeStart;
                $scope.deployParam.planTimeEnd = result.planTimeEnd;
            });
		}
		//导出发布单
		$scope.button_clicked = false;
		$scope.exportExcel=function (){
			var	orgId=vm.deployParam.orgId,
			envType=vm.deployParam.envType,
			sysCnname=vm.deployParam.sysCnname,
			sysName=vm.deployParam.sysName,
			requestNo=vm.deployParam.requestNo,
			deployStatus=vm.deployParam.deployStatus,
			planTimeStart=vm.deployParam.planTimeStart,
			planTimeEnd=vm.deployParam.planTimeEnd;
			
			if(typeof(orgId)=="undefined" || orgId === null){
				orgId="";
			}
			if(typeof(envType)=="undefined" || envType === null){
				envType="";
			}
			if(typeof(sysCnname)=="undefined" || sysCnname === null){
				sysCnname="";
			}
			if(typeof(sysName)=="undefined" || sysName === null){
				sysName="";
			}
			if(typeof(requestNo)=="undefined" || requestNo === null){
				requestNo="";
			}
			if(typeof(deployStatus)=="undefined" || deployStatus === null){
				deployStatus="";
			}
			if(typeof(planTimeStart)=="undefined" || planTimeStart === null){
				planTimeStart="";
			}
			if(typeof(planTimeEnd)=="undefined" || planTimeEnd === null){
				planTimeEnd="";
			}
			$scope.button_clicked = true;
			document.location.href="angular/deployReq/deployListExport.htm?orgId="+orgId+"&envType="+envType+"&sysCnname="+sysCnname+"&sysName="+sysName+"&requestNo="+requestNo+"&deployStatus="+deployStatus+"&planTimeStart="+planTimeStart+"&planTimeEnd="+planTimeEnd;
		}
		
		$scope.search=function (){
			$scope.deployParam.opFlag = 'search';
			$scope.button_clicked = false;
			
			if($scope.deployParam.planTimeStart != null ){
				$scope.deployParam.planTimeStart = $filter('date')($scope.deployParam.planTimeStart, 'yyyy-MM-dd');
			}
			
			if($scope.deployParam.planTimeEnd != null ){
				$scope.deployParam.planTimeEnd = $filter('date')($scope.deployParam.planTimeEnd, 'yyyy-MM-dd');
			}
			queryDeployReqList();
		}
		
		
		$scope.showDeployReqDetail = function (requestNo){
			$state.go("DeployReqDetail",{
				requestNo:requestNo
			})
		}
		
        init();

        
        $scope.open = function (requestNo){
        		window.open("deployReq/deployReqDetail.htm?opFlag=detail&requestNo="+requestNo,'', 'height=700, width=900,left=200');
        }
        
        //分页
        vm.$on('sn.controls.pager:pageIndexChanged', function (evt, page) { // 分页操作
            evt.stopPropagation();
            $scope.deployParam.pageNumber = page.pageIndex + 1;
            queryDeployReqList();
        });
        
        return vm;

	}
]);
