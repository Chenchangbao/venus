angular.module('sncd').controller('QrcodeCtrl', ['$scope', 'SystemService', 'DialogService','$timeout',"baseUrl","$location",
    function ($scope, SystemService, DialogService,$timeout,baseUrl,$location) {

        $scope.viewData = {}

        $scope.closeqrcode = function () {
            DialogService.dismiss('component.qrcodeDialog');
        };
        
        $scope.close = function () {
            DialogService.dismiss('home.notification');
        };
        
        //页面数据初始化
        init();
        
        function init() {
        	$scope.url = window.location.protocol+window.location.host+baseUrl +'/angular/component/download.htm?id='+ $scope.id+'&appName='+$scope.appName;
        }
        
    }
])
