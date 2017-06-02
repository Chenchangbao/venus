
angular.module('sncd').controller('addQualityWhiteDialogCtrl', ['$scope', 'QuaService', 'DialogService','$timeout','$stateParams','HomeService','AlertService','baseUrl','$location',
    function ($scope, QuaService, DialogService,$timeout,$stateParams,HomeService,AlertService,baseUrl,$location) {


        $scope.close = function () {
            DialogService.accept('quality.whitelist');
        };


        //页面数据初始化
        init();

        function  init() {
        	$scope.message="";
            //获取未在白名单中的系统
        	getSysInfo();
        };

        function getSysInfo(){
        	 QuaService.getSysInfo().then(function(result){
                 $scope.systemList=result;
             });
        }
        
        $scope.chooseSysinfo=function(){
        	$scope.message="";
        }

        $scope.updateWhitelist=function (sysName,sysId,isValid) {
            var params={
                sysId: sysId,
                isValid: isValid
            }
            QuaService.updateWhitelist(params).then(function (result) {
//                    AlertService.alert({
//                        title: "提示",
//                        content: result
//                    });
                    $scope.message="执行结果:"+sysName+" "+result;
                    getSysInfo();
                }
            )
        }


    }
]);