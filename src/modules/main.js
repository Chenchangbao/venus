angular.module("sncd", ["ui.router", "sn.controls", "ngSanitize", "ngClipboard"]);

angular.module("sncd").value('baseUrl', '/udmp-web-in');

angular.module('sncd').constant('Utils', {})
.run(['Utils','UserRoleService',
   function(Utils, UserRoleService){

	Utils.cacheKeys = {
	  userRoles: 'User.roles'
	};
	  
	//获取当前用户权限
	UserRoleService.getUserAllRoles(angular.noop);
}]);

//添加ng-clip的相关配置
angular.module("sncd").config(['ngClipProvider', function(ngClipProvider) { 
	ngClipProvider.setPath("libs/zeroclipboard/ZeroClipboard.swf"); 
	}]);

angular.module("sncd").config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/dashboard");

    $stateProvider
        //控制台主界面
        .state("DashBoard", {
            url: "/dashboard",
            templateUrl: 'modules/sncd/templates/home/home.html',
            controller: 'HomeCtrl'
        })

        //系统概览
        .state('Home', {
            url: '/home',
            templateUrl: 'modules/sncd/templates/home/home.html',
            controller: 'HomeCtrl'
        })


        /**
         * 系统相关state
         */
         //系统列表
        .state('SystemManage', {
            url: '/system-manage?status',
            templateUrl: 'modules/sncd/templates/system/system-manage.html',
            controller: 'SystemManageCtrl'
        })
        
        //系统信息公用头部
        .state('SystemInfo',{
        	  url: '/system-info/:sysId?tab',
              templateUrl: 'modules/sncd/templates/system/system-info.html',
              controller: 'SystemInfoCtrl'
        })
        
        //系统详情
        .state('SysDetail', {
            parent: 'SystemInfo',
            url: '/detail',
            templateUrl: 'modules/sncd/templates/system/system-detail.html',
            controller: 'SystemDetailCtrl'
        })
        //应用包
        .state('SystemPackage',{
        	parent: 'SystemInfo',
            url: '/package',
            templateUrl: 'modules/sncd/templates/system/system-package.html',
        	controller: 'SystemPackageCtrl'
        })
         //增加系统的应用包
        .state('SystemPackageAdd', {
          parent: 'SystemInfo',
          url: '/package/add?packageId',
          templateUrl: 'modules/sncd/templates/system/system-package-add.html',
          controller: 'SystemPackageAddCtrl'
        })
        
        //打包配置
        .state("PackageConfig",{
        	 parent: 'SystemInfo',
             url: '/packageconfig',
             templateUrl: 'modules/sncd/templates/system/package-config-detail.html',
             controller: 'PackageConfigCtrl'
        })
        
          //新建打包配置
        .state("AddPackageConfig",{
        	 parent: 'SystemInfo',
             url: '/packageconfig/add',
             templateUrl: 'modules/sncd/templates/system/package-config-add.html',
             controller: 'PackageConfigAddCtrl'
        })
        
         //编辑打包配置
        .state("EditPackageConfig",{
        	 parent: 'SystemInfo',
             url: '/packageconfig/add/:editType',
             templateUrl: 'modules/sncd/templates/system/package-config-add.html',
             controller: 'PackageConfigAddCtrl'
        })
        
        //系统环境
        .state("SystemEnv",{
        	 parent: 'SystemInfo',
             url: '/envConfig',
             templateUrl: 'modules/sncd/templates/system/system-env-config.html',
             controller: 'SystemEnvCtrl'
        })
        //代码库
        .state("CodeRepository",{
        	parent: 'SystemInfo',
            url: '/codeRepository',
            templateUrl: 'modules/sncd/templates/system/system-code-repository.html',
            controller: 'CodeRepositoryCtrl'
        })
        
        //代码库
        .state("CreateCodeRepository",{
        	parent: 'SystemInfo',
            url: '/createCodeRepository',
            templateUrl: 'modules/sncd/templates/system/create-code-repository.html',
            controller: 'CreateCodeRepositoryCtrl'
        })
        
        
        //系统团队
      .state('SystemTeamDetail', {
	      parent: 'SystemInfo',
	      url: '/team',
	      templateUrl: 'modules/sncd/templates/system/system-team-detail.html',
	      controller: 'SystemTeamCtrl'
      })
      
      //系统权限
      .state('SystemPermission',{
    	  parent: 'SystemInfo',
	      url: '/systemPermission?roleName',
	      templateUrl: 'modules/sncd/templates/system/system-role-permission.html',
	      controller: 'SystemPermissionCtrl'
      })
      
       //系统下版本列表
      .state('SystemVersion',{
    	  parent: 'SystemInfo',
	      url: '/version',
	      templateUrl: 'modules/sncd/templates/system/system-version-list.html',
	      controller: 'SystemVersionCtrl'
      })
        
        .state('CodeInfo', {
            parent: 'VersionDetail',
            url: '/code-info',
            templateUrl: 'modules/sncd/templates/sysAndVersInfo/code.html',
            controller: 'CodeInfoCtrl'
        })
        
        //系统基线配置
        .state('SystemBuildConfig', {
            parent: 'SystemInfo',
            url: '/SystemBuildConfig',
            templateUrl: 'modules/sncd/templates/system/build-config.html',
            controller: 'SystemBuildConfigCtrl'
        })
       
		        
		/**
		 * 版本相关模块
		 */
           //创建版本
	      .state("CreateVersion", {
	    	  parent: 'SystemInfo',
		      url: "/createVersion?versionId",
		      templateUrl: "modules/sncd/templates/version/create-version.html",
		      controller: "CreateVersionCtrl"
	      })
	      //我的版本-创建版本
	      .state("CreateSysVersion",{
		      url: "/createVersion",
		      templateUrl: "modules/sncd/templates/version/create-sys-version.html",
		      controller: "CreateSysVersionCtrl"
	      })
	       //修改交付流程配置 
          .state("UpdateVersionBuild", {
	    	  parent: 'VersionInfo',
		      url: "/updateVersionBuild?versionId",
		      templateUrl: "modules/sncd/templates/version/version-build-config.html",
		      controller: "UpdateVersionBuildCtrl"
	      })
	      
	      //中心级质量配置
        .state('QualityConfig', {
            url: '/quality-config',
            templateUrl: 'modules/sncd/templates/quality/quality-config.html',
            controller: 'QualityConfigCtrl'
        })

	      //公司级质量配置
        .state('CompanyQualityConfig', {
            url: '/company-quality-config',
            templateUrl: 'modules/sncd/templates/quality/company-quality-config.html',
            controller: 'CompanyQualityConfigCtrl'
        })

        //我的版本
        .state('VersionProcessMenu', {
              parent: 'versionTab',
	          url: '/versionProcess',
	          templateUrl: 'modules/sncd/templates/version/my-version-list.html',
	          controller: 'VersionProcessCtrl'
        })
        
         //进行中版本
        .state('VersionProcess', {
              parent: 'versionTab',
	          url: '/version-process?sysId/:status',
	          templateUrl: 'modules/sncd/templates/version/my-version-list.html',
	          controller: 'VersionProcessCtrl'
        })
        //已结束版本
        .state('VersionFinish', {
             parent: 'versionTab',
        	 url: '/version-finish?sysId',
   	          templateUrl: 'modules/sncd/templates/version/my-version-list.html',
   	          controller: 'VersionFinishCtrl'
        })
        .state('versionTab',{
        	 url: '/version-tab?vtab',
             templateUrl: 'modules/sncd/templates/version/version-tab.html',
             controller: 'VersionTabCtrl'
        })
//        
//        //系统、版本头部
//        .state('VersionSysInfo',{
//        	 url: '/version-info/:sysId/:versionId?tab?vtab?',
//             templateUrl: 'modules/sncd/templates/version/version-sys-info.html',
//             controller: 'VersionSysCtrl'
//        })
        
        //版本公共头部
        .state('VersionInfo',{
        	 url: '/version-info/:sysId/:versionId?vtab',
             templateUrl: 'modules/sncd/templates/version/version-info.html',
             controller: 'VersionInfoCtrl'
        })
        
         //版本详情
        .state('VersionDetail',{
     	   parent: 'VersionInfo',
            url: '/detail',
            templateUrl: 'modules/sncd/templates/version/version-detail.html',
            controller: 'VersionDetailCtrl'
        })
        
        //分支权限
        .state('VersionBranchAuth', {
            parent: 'VersionInfo',
            url: '/version-branch-auth',
            templateUrl: 'modules/sncd/templates/version/version-branch-auth.html',
            controller: 'VersionAuthCtrl'
        })
//        //分支发布人员
//        .state('VersionBranchPerson', {
//            parent: 'VersionInfo',
//            url: '/version-branch-person',
//            templateUrl: 'modules/sncd/templates/version/version-branch-person.html',
//            controller: 'VersionDetailCtrl'
//        })
        
        
        //解版
        .state('UnfreezenVersion',{
        	 parent: 'VersionInfo',
             url: '/unfreezen',
             templateUrl: 'modules/sncd/templates/version/unfreezen-version.html',
             controller: 'UnfreezenVersionCtrl'
        })
        
        //打包地址
        .state("PackageVersion",{
        	 parent: 'VersionInfo',
             url: '/packageVersion/:envType',
             templateUrl: 'modules/sncd/templates/version/package-version.html',
             controller: 'PackageVersionCtrl'
        })
        //打包地址
        .state("PackageVersionComponent",{
        	 parent: 'VersionInfo',
             url: '/packageVersion/:envType/:packageType',
             templateUrl: 'modules/sncd/templates/version/package-version.html',
             controller: 'PackageVersionCtrl'
        })
        
         //版本发布单
        .state('VersionDeploy',{
        	 parent: 'VersionInfo',
             url: '/versionDeploy',
             templateUrl: 'modules/sncd/templates/version/version-deploy.html',
             controller: 'VersionDeployCtrl'
        })
        
         //普通发布
        .state("CreateDeployReq",{
        	parent: 'VersionInfo',
            url: '/deployReq/:envType/:componentId',
            templateUrl: 'modules/sncd/templates/version/create-deploy-req.html',
            controller: 'CreateDeployReqCtrl'
        })
        
        //代码质量分析
        .state("VersionJob",{
        	parent: 'VersionInfo',
            url: '/versionJob',
            templateUrl: 'modules/sncd/templates/version/version-job.html',
            controller: 'VersionJobCtrl'
        })
        
        //在线代码评审ReviewBoard
        .state("VersionReviewBoard",{
        	parent: 'VersionInfo',
            url: '/reviewBoard',
            templateUrl: 'modules/sncd/templates/version/version-review-board.html',
            controller: 'VersionReviewBoardCtrl'
        })
        
        //合并分支
        .state("MergeVersion",{
        	 parent: 'VersionInfo',
             url: '/merge',
             templateUrl: 'modules/sncd/templates/version/merge-version.html',
             controller: 'MergeVersionCtrl'
        })
        
        
       
        .state("VersionQuaCheck",{
        	 parent: 'VersionInfo',
             url: '/quaCheck/:sysId/:buildId/:versionId',
             templateUrl: 'modules/sncd/templates/version/version-qua-check.html',
             controller: 'VersionQuaCheckCtrl'
        })

    //    //版本报告
    //     .state('VersionReport', {
    //          parent: 'VersionInfo',
    //     	url: '/versionReport?versionId',
    //     	templateUrl: 'modules/sncd/templates/version/version-report.html',
    //     	controller: 'VersionReportCtrl'
    //     })
//        .state('EndedVersion', {
//            url: '/ended-version',
//            templateUrl: 'modules/sncd/templates/version/ended-version.html',
//            controller: 'EndedVersionCtrl'
//        })
//        .state('ReleaseList', {
//            url: '/release-list',
//            templateUrl: 'modules/sncd/templates/version/release-list.html',
//            controller: 'ReleaseListCtrl'
//        })
//        .state('VersionDetail', {
//            url: '/version-detail',
//            templateUrl: 'modules/sncd/templates/version/version-detail.html',
//            controller: 'VersionDetailCtrl'
//        })

        
        
       /* //质量中心
        .state('QualityManage', {
            url: '/quality-manage',
            templateUrl: 'modules/sncd/templates/quality/my-quality-compare.html',
            controller: 'QualityCenterCtrl'
        })*/
        //质量对比
        .state('QualityCompare', {
            url: '/quality-compare',
            templateUrl: 'modules/sncd/templates/quality/quality-compare.html',
            controller: 'QualityCompareCtrl'
        })
        //我的质量
         .state('MyQuality', {
            url: '/my-quality-compare/:sysId/:versionId/:type',
            templateUrl: 'modules/sncd/templates/quality/my-quality-compare.html',
            controller: 'MyQualityCompareCtrl'
        })
        //系统质量导出
         .state('QualityExport', {
            url: '/quality-export',
            templateUrl: 'modules/sncd/templates/quality/quality-export.html',
            controller: 'QualityExportCtrl'
        })
        //版本质量导出
         .state('VersionQualityExport', {
            url: '/version-quality-export',
            templateUrl: 'modules/sncd/templates/quality/version-quality-export.html',
            controller: 'VersionQualityExportCtrl'
        })
        //质量接入
         .state('QualityAccess', {
            url: '/quality-access',
            templateUrl: 'modules/sncd/templates/quality/quality-access.html',
            controller: 'QualityAccessCtrl'
        })
        //质量管理
        /*.state('QualityCenter', {
            url: '/my-quality?sysId?branchId?type',
            templateUrl: 'modules/sncd/templates/quality/quality-center.html',
            controller: 'QualityCenterCtrl'
        })*/
         //发布统计-质量导出
         .state('DeployQualityExport', {
            url: '/deploy-quality-export',
            templateUrl: 'modules/sncd/templates/quality/deploy-quality-export.html',
            controller: 'DeployQualityExportCtrl'
        })     
         .state('CodeQualityList',{
          url:'/codeQualityList/:sysId/:buildId/:branchId',
          templateUrl: 'modules/sncd/templates/quality/code-quality-list.html',
          controller: 'CodeQualityCtrl'
        })
        
        .state('CodeReviewList',{
          url:'/codeReviewList/:sysId/:branchId',
          templateUrl: 'modules/sncd/templates/quality/code-review-list.html',
          controller: 'CodeReviewCtrl'
        })
        
          .state('CodeBuild',{
          url:'/codeBuild/:sysId/:buildId/:type',
          templateUrl: 'modules/sncd/templates/quality/code-build.html',
          controller: 'CodeBuildCtrl'
        })

         //我的动态
	    .state('Dynamic',{
	  	  url:'/dynamic',
	  	  templateUrl: 'modules/sncd/templates/dynamic/dynamic.html',
	  	  controller: 'DynamicManageCtrl'
	    })
	    
        //发布
        .state('DeployReqList', {
            url: '/deploy-list',
            templateUrl: 'modules/sncd/templates/publish/publish-list.html',
            controller: 'DeployReqListCtrl'
        })
        
        
        //运维打包发布
        .state ('PackageAndDeploy',{
        	url: '/packageVersion/:sysId/:versionId/:envType/:envParam',
            templateUrl: 'modules/sncd/templates/packageVersion/package-and-deploy.html',
            controller: 'PackageAndDeployCtrl'
        })
        
        .state ('PackageAndDeployEnvId',{
        	url: '/packageVersion/:sysId/:versionId/:envType/:envParam/:envId',
            templateUrl: 'modules/sncd/templates/packageVersion/package-and-deploy.html',
            controller: 'PackageAndDeployCtrl'
        })
        
        .state('SAPDeployManage', {
            url: '/jump-old?href',
            templateUrl: 'modules/sncd/templates/old/old.html',
            controller: 'JumpOldCtrl'
        })
        .state('CommonComponent', {
            url: '/jump-old?href',
            templateUrl: 'modules/sncd/templates/old/old.html',
            controller: 'JumpOldCtrl'
        })
        .state('DocumentManage', {
            url: '/jump-old?href',
            templateUrl: 'modules/sncd/templates/old/old.html',
            controller: 'JumpOldCtrl'
        })
        .state('SystemSpace', {
            url: '/jump-old?href',
            templateUrl: 'modules/sncd/templates/old/old.html',
            controller: 'JumpOldCtrl'
        })
        .state('SAPRequest', {
            url: '/jump-old?href',
            templateUrl: 'modules/sncd/templates/old/old.html',
            controller: 'JumpOldCtrl'
        })
        .state('SAPRequestNumMgt', {
            url: '/jump-old?href',
            templateUrl: 'modules/sncd/templates/old/old.html',
            controller: 'JumpOldCtrl'
        })
        .state('sapDeployMgt', {
            url: '/jump-old?href',
            templateUrl: 'modules/sncd/templates/old/old.html',
            controller: 'JumpOldCtrl'
        })
        
         .state('SAPDeploy', {
            url: '/jump-old?href',
            templateUrl: 'modules/sncd/templates/old/old.html',
            controller: 'JumpOldCtrl'
        })
         .state('QuerySystem', {
            url: '/jump-old?href',
            templateUrl: 'modules/sncd/templates/old/old.html',
            controller: 'JumpOldCtrl'
        })
        
           .state('QueryComponent', {
            url: '/jump-old?href',
            templateUrl: 'modules/sncd/templates/old/old.html',
            controller: 'JumpOldCtrl'
        })
        
        
        .state('QuerySVNPower', {
            url: '/jump-old?href',
            templateUrl: 'modules/sncd/templates/old/old.html',
            controller: 'JumpOldCtrl'
        })
        

        .state('OperationManage', {
            url: '/jump-old?href',
            templateUrl: 'modules/sncd/templates/old/old.html',
            controller: 'JumpOldCtrl'
        })
       
        .state('Scripts', {
            url: '/jump-old?href',
            templateUrl: 'modules/sncd/templates/old/old.html',
            controller: 'JumpOldCtrl'
        })
        
        .state('Operation', {
            url: '/jump-old?href',
            templateUrl: 'modules/sncd/templates/old/old.html',
            controller: 'JumpOldCtrl'
        })
        
         .state('SysEnv', {
            url: '/jump-old?href',
            templateUrl: 'modules/sncd/templates/old/old.html',
            controller: 'JumpOldCtrl'
        })
        
         .state('SAPSystemJump', {
            url: '/jump-old?href',
            templateUrl: 'modules/sncd/templates/old/old.html',
            controller: 'JumpOldCtrl'
        })
        
         .state('PCSystemJump', {
            url: '/jump-old?href',
            templateUrl: 'modules/sncd/templates/old/old.html',
            controller: 'JumpOldCtrl'
        })

        .state('Component',{
        	url: '/component-manage/:branchId/:envParam/:envName',
        	templateUrl: 'modules/sncd/templates/component/component-generate.html',
        	controller: 'ComponentCtrl'
        })
        
        .state('ComponentList',{
        	url: '/component-list',
        	templateUrl: 'modules/sncd/templates/component/my-component-list.html',
        	controller: 'ComponentCtrl'
        })
        
        .state('MyComponentList',{
        	url: '/my-component-list',
        	templateUrl: 'modules/sncd/templates/component/my-component-list.html',
        	controller: 'ComponentCtrl'
        })
        
        .state('ComponentListRevision',{
        	url: '/component-list-revision/:revision/:envType',
        	templateUrl: 'modules/sncd/templates/component/component-list-revision.html',
        	controller: 'ComponentCtrl'
        })
        
        .state('ComponentDetail',{
        	url: '/component-detail?id',
        	templateUrl: 'modules/sncd/templates/component/component-detail.html',
        	controller: 'ComponentCtrl'
        })  
        
        .state('VisualizationManage',{
        	url: '/visualization',
        	templateUrl: 'modules/sncd/templates/operation/visualization-manage-list.html',
        	controller: 'VisualizationManageCtrl'
        })
        
        .state('DeployPrd',{
        	url: '/deploy-prd/:sysId/:branchId/:envParam/:envId/:revision',
        	templateUrl: 'modules/sncd/templates/component/component-deploy-list.html',
        	controller: 'ComponentCtrl'
        })
        
        .state('PublishMonitor',{
        	url: '/publish-monitor?deployId',
        	templateUrl: 'modules/sncd/templates/publish/publish-monitor.html',
        	controller: 'DeployReqDetailCtrl'
        })
        //mcs打包
        .state('McsDeploy',{
        	url: '/mcs-deploy/:id/:appName               ',
        	templateUrl: 'modules/sncd/templates/component/mcs-deploy.html',
        	controller: 'McsDeployCtrl'
        })

     
        //具体分支的代码评审
        .state('SvnCodeReview',{
        	url:'/svn-code-review-list',
        	templateUrl: 'modules/sncd/templates/system/svn-code-review-list.html',
        	controller: 'SvnCodeReviewCtrl'
        })
        //具体分支的代码评审
        .state('SvnCodeReviewBranch',{
        	url:'/svn-code-review-branch-list/:branchId/:version/:sysName',
        	templateUrl: 'modules/sncd/templates/system/svn-code-review-list.html',
        	controller: 'SvnCodeReviewCtrl'
        })
         //质量对比
        .state('QualityAuthControl', {
            url: '/quality-auth-control',
            templateUrl: 'modules/sncd/templates/quality/quality-auth-control.html',
            controller: 'QualityAuthControlCtrl'
        })
});

angular.module("sncd").factory('noCacheInterceptor', function() {
    return {
        request: function(config) {
            if (config.method == 'GET') {
                var separator = config.url.indexOf('?') === -1 ? '?' : '&';
                config.url = config.url + separator + 'noCache=' + new Date().getTime();
            }
            return config;
        }
    };
});

angular.module("sncd").config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('noCacheInterceptor');
}]);

$(window).resize(function () {
	var neg = $('.main-header').outerHeight() + $('.main-footer').outerHeight();
    var window_height = $(window).height();
    var sidebar_height = $(".sidebar").height();
    //Set the min-height of the content and sidebar based on the
    //the height of the document.
    if ($("body").hasClass("fixed")) {
      $(".content-wrapper, .right-side").css('min-height', window_height - $('.main-footer').outerHeight());
    } else {
      var postSetWidth;
      if (window_height >= sidebar_height) {
        $(".content-wrapper, .right-side").css('min-height', window_height - neg);
        postSetWidth = window_height - neg;
      } else {
        $(".content-wrapper, .right-side").css('min-height', sidebar_height);
        postSetWidth = sidebar_height;
      }

    }
  });
