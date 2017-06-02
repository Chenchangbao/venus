
angular.module('sncd').controller('MergeVersionCtrl', ['$scope', 'VersionManageService', 'DialogService','$timeout','$stateParams',
    function ($scope, VersionManageService, DialogService,$timeout,$stateParams) {

        $scope.viewData = {}


        var versionId = $stateParams.versionId;
        var sysId = $stateParams.sysId;
        
        init();
        
        function  init() {
        	if($scope.type=='1'){//执行合并分支操作
        		 $scope.button_clicked = false;
        		mergeVersion();
        	}else {//查看合并分支详情
        		mergeVersionInfo();	
        	}
        }

        //合并分支
        $scope.mergeVersion=function (){
        	if(confirm("请确认分支内容是否已成功发布到生产，\n如果没有，请成功发布生产后再合并分支。\n分支合并后，将被关闭，不能解版或继续使用，是否仍然需要合并分支?\n如继续执行“合并主干”则点击“确认”，反之则点击“取消”按钮")){
        		mergeVersion();
        		$scope.type = '1';
        	}
        }

        //合并分支详情
        $scope.mergeVersionInfo=function (){
        	mergeVersionInfo();
        }
        
        
        
        //合并分支
        function mergeVersion(){
        	 VersionManageService.mergeVersion({opFlag:"merge",sysId:sysId,versionId:versionId}).then(function(result){
        		
//        		 $scope.versionName = version.branchName;
        		 
        		 if(result.mergeStatus == 'noStart'){
        			 $scope.mergeStatus = result.mergeStatus;
            		 $scope.msgFlag = result.msgFlag;
            		 $scope.msgInfo = result.msgInfo;
            		 if(result.msgFlag==1){
            			 $scope.button_clicked = true;
            		 }else{
            			 $scope.button_clicked = false;
            		 }
        		 }else{
        			//获取最新结果
            		 mergeVersionInfo();	 
        		 }
        		 
        		 
        		 
        		 
        	 });
        }
        
        //合并分支详情
        function mergeVersionInfo(){
        	 VersionManageService.mergeVersionInfo({versionId:versionId,sysId:sysId}).then(function(result){
        		 $scope.mergeStatus = result.mergeStatus;
        		 $scope.msgFlag = result.msgFlag;
        		 $scope.msgInfo = result.msgInfo;
        		 if(result.msgFlag==1){
        			 $scope.button_clicked = true;
        		 }else{
        			 $scope.button_clicked = false;
        		 }
//        		 $scope.versionName = version.branchName;
        		 if($scope.type=='1' &&   $scope.mergeStatus != 'finish'){
        			 $scope.button_clicked = true;
        			 $timeout((function (){
            			 mergeVersionInfo();
         			}), 1000);
        		 }
        	 });
        }
        
        
    }
])