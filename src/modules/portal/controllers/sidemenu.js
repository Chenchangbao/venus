angular.module("sncd").controller('SideMenuCtrl', ["$rootScope", "$state","$scope","UserService", function ($rootScope, $state,$scope,UserService) {
    var vm = this;

    $scope.menus = [];
    $rootScope.menuShrink = false;
    var menus = [
        {code: "0", name: "概览", icon: "fa icon-overview", state: "Home"},
        {code: "1", name: "操作中心", icon: "fa icon-dashboard"},
        {code: "2", name: "我的系统", icon: "fa icon-system", state: "SystemManage"},
        {code: "3", name: "我的版本", icon: "fa icon-edition", state: "VersionProcessMenu"},
        {code: "4", name: "我的组件", icon: "fa icon-assembly",state:"CommonComponent",href:"newSystem/getMySysByPage.htm?sysType=2"},
        {code: "17", name: "部门文档库", icon: "fa icon-document", state: "DocumentManage",href:"documentReposMgt/getDocumentReposMgtListByPage.htm"},
        {code: "0-5", name: "代码评审", icon: "fa icon-jurisdiction", state: "SvnCodeReview"},
        {code: "5", name: "质量中心", icon: "fa icon-template"},
      //  {code: "6", name: "质量管理", icon: "fa fa-assurance",state:"QualityManage"},
        {code: "7", name: "质量对比", icon: "fa icon-contrast",state:"QualityCompare"},
        {code: "8", name: "我的质量", icon: "fa icon-assurance",state:"MyQuality"},
       // {code: "30", name: "系统质量导出", icon: "fa icon-assurance",state:"QualityExport"},
       // {code: "31", name: "版本质量导出", icon: "fa icon-assurance",state:"VersionQualityExport"},
        {code: "28", name: "公司级质量配置", icon: "fa icon-contrast",state:"CompanyQualityConfig"},
        {code: "29", name: "中心级质量配置", icon: "fa icon-contrast",state:"QualityConfig"},
        {code: "9", name: "查询中心", icon: "fa icon-dashboard"},
        {code: "10", name: "发布查询", icon: "fa icon-release",state:"DeployReqList"},
        {code: "11", name: "构件查询", icon: "fa icon-structure",state:"MyComponentList"},
        {code: "12", name: "系统查询", icon: "fa icon-querySys",state:"QuerySystem",href:"newSystem/getSysByPage.htm?sysType=0"},
        {code: "13", name: "组件查询", icon: "fa icon-queryAssembly", state: "QueryComponent",href:"newSystem/getSysByPage.htm?sysType=2"},
        // {code: "14", name: "日志查询", icon: "fa fa-heartbeat",state:"Dynamic"},
        {code: "15", name: "SVN权限查询", icon: "fa icon-jurisdiction", state: "QuerySVNPower",href:"svnPermission/queryPermissionSelfPage.htm"},
        {code: "16", name: "数据中心", icon: "fa icon-dashboard"},
        // {code: "18", name: "运维管理", icon: "fa fa-cloud"},
        // {code: "19", name: "脚本管理", icon: "fa fa-umbrella", state: "Scripts",href:"showScripts.htm"},
        // {code: "20", name: "脚本升级", icon: "fa fa-stethoscope", state: "",href:""},
        // {code: "21", name: "环境管理", icon: "fa fa-stethoscope", state: "SysEnv",href:"SysEnvManage/showSys.htm"},
        // {code: "22", name: "SAP系统配置", icon: "fa fa-cubes",state:""},
        // {code: "23", name: "生产自动化管理", icon: "fa fa-cubes",state:""},
        
        
        
        
        // {code: "24", name: "SAP自动化部署", icon: "fa fa-cubes",state:"SAPDeployManage",href:"sapDeployMgt/getSapDeployListByPage.htm"},
        
        
        // {code: "25", name: "动态", icon: "fa fa-heartbeat",state:"Dynamic"},
        // {code: "26", name: "系统空间", icon: "fa fa-cubes",state:"SystemSpace",href:"newSystem/getSysByPage.htm?sysType=0"},
       
       // {code: "12", name: "工具视图", icon: "fa fa-cubes", state: ""},

//        {parent: "2", code: "2-0", name: "创建版本", icon: "fa fa-anchor", state: "CreateSysVersion"},
        // {parent: "2", code: "2-1", name: "进行中版本", icon: "fa fa-hdd-o", state: "VersionProcess"},
        // {parent: "2", code: "2-2", name: "已结束版本", icon: "fa fa-anchor", state: "VersionFinish"},
//        {parent: "2", code: "2-3", name: "我的发布单", icon: "fa fa-hdd-o", state: "ReleaseList"},

       // {parent: "3", code: "3-2", name: "质量对比", icon: "fa fa-umbrella", state: "QualityCompare"},
        
      //  {code: "27", name: "我的质量", icon: "fa fa-stethoscope", state: "MyQuality"},
        {parent: "10", code: "10-0",name: "非SAP发布", icon: "fa fa-umbrella", state:"DeployReqList"},
        {parent: "10", code: "10-1", name: "SAP发布", icon: "fa fa-umbrella"},
        {parent: "10-1", code:"10-1-0", name: "请求号", icon: "fa fa-umbrella", state: "sapDeployMgt",href:"sapRequestNumMgt/getSapRequestNumsByPage.htm"},
        {parent: "10-1", code:"10-1-1", name: "发布单", icon: "fa fa-stethoscope", state: "sapDeployMgt",href:"sapDeployMgt/getSapDeployListByPage.htm"},

    ];

    
    function getRoles(){
	    var roles={};
	    roles =JSON.parse(sessionStorage.getItem("roles"));
	    if(null==roles){
	    	 UserService.getUserinfo().then(function(result){
	    	        vm.username = result.data.userName;
	    	        vm.role=result.data.role;
	    	        roles =result.data.roles;
	    	        sessionStorage.setItem("userName",result.data.userName);
	    	        sessionStorage.setItem("role",result.data.role);
	    	        sessionStorage.setItem("roles",JSON.stringify(result.data.roles));
	    	        addRoles(roles);
	    	 });
	    }else{
	    	addRoles(roles);
	    }
        console.log($scope.menus);
    }
    
          
    
    getRoles();

	function addRoles(roles){
		 if(null!=roles && (null !=roles.ROLE_ADMIN || null!= roles.ROLE_CMO)){
		    // menus.push( {code: "11", name: "平台管理", icon: "fa fa-cloud",state:"JumpOld",href:"index.htm"});
		     menus.push({code: "27", name: "运维管理", icon: "fa fa-cloud",state:"OperationManage",href:"SysEnvManage/showSys.htm"});
		     menus.push({parent: "27", code: "27-0", name: "脚本管理", icon: "fa icon-administrationSc", state: "Scripts",href:"showScripts.htm"});
		     menus.push({parent: "27", code: "27-1", name: "操作日志", icon: "fa icon-journal", state: "Operation",href:"platform/operationInfo.htm"});
		     menus.push({parent: "27", code: "27-3", name: "环境管理", icon: "fa icon-environment", state: "SysEnv",href:"SysEnvManage/showSys.htm"});
			 menus.push({parent: "27", code: "27-4", name: "脚本升级", icon: "fa icon-upgrade", state: "Scripts",href:"upgrade/showScripts.htm"});  
		 }else if(null!=roles &&  null!=roles.ROLE_DEPLOYER){
			 menus.push({code: "27", name: "运维管理", icon: "fa fa-cloud",state:"OperationManage",href:"SysEnvManage/showSys.htm"});
		     menus.push({parent: "27", code: "27-0", name: "脚本管理", icon: "fa icon-administrationSc", state: "Scripts",href:"showScripts.htm"});
		     menus.push({parent: "27", code: "27-1", name: "操作日志", icon: "fa icon-journal", state: "Operation",href:"platform/operationInfo.htm"});
		     menus.push({parent: "27", code: "27-3", name: "环境管理", icon: "fa icon-environment", state: "SysEnv",href:"SysEnvManage/showSys.htm"});
			 menus.push({parent: "27", code: "27-4", name: "脚本升级", icon: "fa icon-upgrade", state: "Scripts",href:"upgrade/showScripts.htm"});     
		 } 
		 if(null!=roles &&  null!=roles.ROLE_QUALITY){
			 menus.splice(9,0,{code: "30", name: "系统质量导出", icon: "fa icon-assurance",state:"QualityExport"});
			 menus.splice(10,0,{code: "31", name: "版本质量导出", icon: "fa icon-assurance",state:"VersionQualityExport"});
			 menus.splice(11,0,{code: "32", name: "发布统计", icon: "fa icon-assurance",state:"DeployQualityExport"});
			 menus.splice(12,0,{code: "33", name: "质量统计", icon: "fa icon-assurance",state:"QualityAccess"});
		 }   	
		 if(null!=roles &&  null!=roles.ROLE_QUALITY_AUTH_CONTROL){
			 menus.splice(16,0,{code: "34", name: "发布整合权限控制", icon: "fa icon-contrast",state:"QualityAuthControl"});
		 }   	

		//  if(null!=roles &&  null!=roles.ROLE_CQC){
		// 	  menus.push( {parent: "3", code: "3-2", name: "质量对比", icon: "fa fa-umbrella", state: "QualityCompare"});
		//  }
		 getMenus();
	}
	
    function getMenus(){
    var menuMap = {};
  
    for (var i=0; i<menus.length; i++) {
        var menuItem = menus[i];
        menuMap[menuItem.code] = menuItem;

        if (!menuItem.parent) {
        	$scope.menus.push(menuItem);
        }
        else {
            var parent = menuMap[menuItem.parent];
            if (!parent.children) {
                parent.children = [];
            }
           menuItem.parentMenu = parent;
            
            if(!menuItem.isHide){
              parent.children.push(menuItem); 
            }
        }
    }

  }



  

    this.selectedMenu = null;

    this.selectMenu1 = function (menu) {
//        if (menu.state != $state.current.name) {
//            this.selectedMenu = menu;
//            if(menu.state){
//                if(menu.href){
//                    $state.go(menu.state, {href: menu.href}, {reload: true});
//                }else{
//                    $state.go(menu.state, {}, {reload: true});
//                }
//            }
//        }
//        else {
//            this.selectedMenu = menu;
//        }
    	 if (menu != this.selectedMenu) {
             this.selectedMenu = menu;
         }
         if(menu.state){
             if(menu.href){
                 $state.go(menu.state, {href: menu.href}, {reload: true});
	         }else{
                 $state.go(menu.state, {}, {reload: true});
	         }
         }
    };

    this.selectMenu2 = function (evt, menu) {
        if (menu.state != $state.current.name) {
            this.selectedMenu = menu;
        }
        if(menu.state){
            if(menu.href){
                $state.go(menu.state, {href: menu.href}, {reload: true});
            }else{
                $state.go(menu.state, {}, {reload: true});
            }
        }
        evt.stopPropagation();
        evt.preventDefault();
    };
     this.selectMenu3 = function (evt, menu) {
        if (menu.state != $state.current.name) {
            this.selectedMenu = menu;
        }
        if(menu.state){
            if(menu.href){
                $state.go(menu.state, {href: menu.href}, {reload: true});
            }else{
                $state.go(menu.state, {}, {reload: true});
            }
        }
        evt.stopPropagation();
        evt.preventDefault();
    };

    this.isMenuSelected = function(menuItem) {
        if (this.selectedMenu) {
            if (this.selectedMenu.code.indexOf(menuItem.code) == 0) {
                return true;
            }
        }
        else {
            return false;
        }
    };

    $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
//        menus.forEach(function(it) {
//            if (it.state == toState.name) {
//                vm.selectedMenu = it;
//                console.log(it.state);
//                return false;
//                
//            }
//        });
    });
}]);