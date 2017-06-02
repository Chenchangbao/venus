//系统角色权限
angular.module('sncd').controller('SystemPermissionCtrl', ['$scope', 'SystemService', '$state', '$stateParams', 'AlertService',
  function ($scope, SystemService, $state, $stateParams, AlertService) {
		'use strict';

    ///////////////////functions//////////////////
    function init() {
			$scope.selectedTab = '2';
			$scope.type = 'show';
			$scope.isDisabled = true;
			getSystemTeam($stateParams.sysId);
			getSystemPermission();
    }

    init();
		
		//监听角色下拉框数据变化systemBuildConfigCtrl
		$scope.$watch('roleName', function(newVal){
			$scope.isDisabled=true;
			if(newVal){
				getSystemPermission();
				if($scope.type == 'edit' && newVal !="045" && newVal !="299"){
					$scope.isDisabled = false;
				}
			}
		});
		//查询
		// $scope.getSystemPermission = function () {
		// 	getSystemPermission();
		// 		console.log($scope.roleName);
		// 	if($scope.roleName !="045"){
		// 		$scope.isDisabled = false;
		// 	}
		// }

    // 查询系统
    function getSystemTeam(sysId) {
			SystemService.getSystemTeam
				({ sysId: sysId }).then(function (result) {
    		    $scope.dtmList = result.dtmList;
				});
    }

		//查询权限树
    function getSystemPermission() {
			var params = {};
			params.sysId = $stateParams.sysId;
			params.roleName = $scope.roleName || $stateParams.roleName || '';
			SystemService.getSystemPermission(params).then(function (result) {
				var permissionList = result.sysPermissionboLists;
				//permissionList = [{name:"aa",checked:true,code:1,parent:2},{name:"bb",checked:true,code:2,parent:null}, {name: 'cc', code: 3, parent: 2}];
				var map = {},
				arealist = [];
				permissionList.forEach(function (e) {
					if (e.parent == 0) {
						//如果是父节点
						if (map[e.code]) {
							map[e.code].node = e;
						} else {
							map[e.code] = { node: e, children: [] }
						}
					} else {
						//如果本身为子节点,则讲其push到父节点的children数组中
						map[e.parent] = map[e.parent] || { node: {}, children: [] }
						map[e.parent].children.push(e);
					}
				});
				//转化为需要的结构
				for (var key in map){
					var item = map[key];
					var temp = {
						code:item.node.code,
						name:item.node.name,
						checked:item.node.checked,
						children:item.children
					};
					arealist.push(temp);
				}
				
				$scope.role = result.roleName || "045";
				//赋值给树
				$scope.areaData = arealist;
 
			}
			)
    }
	
    $scope.selectTab = function (type) {
			$scope.selectedTab = type;

			if (type == '1') {
				$state.go('SystemTeamDetail');
			}
    }

		//修改确认
    $scope.editSysRolePermission = function () {
			$scope.type = 'edit';
			console.log($scope.role);
			if($scope.role !="045" && $scope.role !="299" ){
				$scope.isDisabled = false;
			}
			var params = {
				sysId: $stateParams.sysId
			};
			SystemService.judgeRolePermission(params).then(function (result){
				if(!result){
					AlertService.alert({
                title: "无权限",
                content: "您不具有修改权限"
            }).then(function() {
						init();	
					});
				}
			
			})
			
    }


		//点击权限树
		// $scope.$on('sn.controls.tree:nodeIconClicked', function (e, d) {
		// });


    $scope.exitEdit = function () {
			init();	
			$scope.type = 'show';
			$scope.isDisabled = true;
    }

		//修改权限
    $scope.updateSysRolePermission = function () {
			var areaData = $scope.areaData,
			checklist = [];
			areaData.forEach(function(obj){
				var item = {};
				obj.children.forEach(function(e){
					item = {
						code: e.code,
						checked:e.checked	
					};
					checklist.push(item);
				});
				item = {
					code: obj.code,
					checked:obj.checked
				};
				checklist.push(item);
			})

			//提交
			var params ={
				sysId: $stateParams.sysId,
				checklist: checklist,
				roleName: $scope.roleName
			};
			SystemService.updateSysRolePermission(params).then(function (result){
				AlertService.alert({
                title: "修改成功",
                content: "权限修改成功！"
            }).then(function() {
						init();	
					});
			})
    }
  }
]);
