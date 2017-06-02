
angular.module('sncd').controller('PackageUrlDialogCtrl', ['$scope', 'VersionManageService', 'DialogService','$timeout',"baseUrl","$location",
    function ($scope, VersionManageService, DialogService,$timeout,baseUrl,$location) {

        $scope.viewData = {}

        $scope.close = function () {
            DialogService.dismiss('version.packageUrlDialog');
        };


        //页面数据初始化
        init();
        
        function  init() {
        	getPackageUrl($scope.version);
        }
        
        //打包地址初始化
        function getPackageUrl(version){
        	
        	VersionManageService.packageVersionDialog({sysId:version.sysId}).then(function (result){
        	        
        	        $scope.sitpara = result.sitpara;
        	        $scope.prepara = result.prepara;
        	        $scope.prdpara = result.prdpara;
        	        
        	        $scope.sitPackageUrl = "#/version-info/"+version.sysId+"/"+version.branchId+"/info/packageVersion/019?vtab=9";
            		$scope.prePackageUrl = "#/version-info/"+version.sysId+"/"+version.branchId+"/info/packageVersion/020?vtab=10";
            		if(version.branchStatus  != '060'){
            			$scope.prdPackageUrl = 	"该分支未封版，无法显示生产环境打包链接。封版可联系：技术总监、技术负责人、技术经理、测试经理、系统管理员。请封版后做好相应的测试工作再发布生产，保证生产发布的质量。";
            		}else{
            			$scope.prdPackageUrl = "#/version-info/"+version.sysId+"/"+version.branchId+"/info/packageVersion/021?vtab=11";
            		}
        	})
        		
        }
        
        
    }
])