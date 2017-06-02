angular.module("sncd").controller("HeaderCtrl", ["$scope", "$rootScope","$location","AlertService", "UserService","LoginService","baseUrl",
                                                 function($scope, $rootScope,$location, AlertService,UserService,LoginService,baseUrl) {
	
	/****passport***/
    $rootScope.$on('$locationChangeSuccess', function(evt, newUrl, oldUrl) {
        console.log("newURL：" + newUrl);
        var url = $location.url();
        if (url.indexOf("#loginSuccess:") >= 0 && (url.indexOf("#loginSuccess:") == url.length - 14)) {
          LoginService.loginSuccess();
          var newPath = url.slice(0, url.indexOf("#loginSuccess:"));
          console.log(newPath);
          
           //因需一个被拦截的请求,初始化后台session,故此写法
          
          UserService.getUserinfo().then(function(result){
  	        vm.username = result.data.userName;
  	        sessionStorage.setItem("userName",result.data.userName);
  	        sessionStorage.setItem("role",result.data.role);
  	        sessionStorage.setItem("roles",JSON.stringify(result.data.roles));
  		});
          
          $location.url(newPath);
        } else if (url.indexOf("#close:") >= 0 && (url.indexOf("#close:") == url.length - 7)) {
          LoginService.closeContainer();
          var newPath = url.slice(0, url.indexOf("#close:"));
          console.log(newPath);
          $location.url(newPath);
        } else if (url.indexOf("#resize:") >= 0) {
          LoginService.resizeContainer(url.slice(url.indexOf("#resize:") + 8));
          var newPath = url.slice(0, url.indexOf("#resize:"));
          console.log(newPath);
          $location.url(newPath);
        }
        // Halt state change from even starting
        evt.preventDefault();
        // Perform custom logic
      });
	/****passport end***/
	
    var vm = $scope;
	vm.username =  sessionStorage.getItem("userName");
	if(null ==vm.username || vm.role==null){
	    UserService.getUserinfo().then(function(result){
	        vm.username = result.data.userName;
	        sessionStorage.setItem("userName",result.data.userName);
	        sessionStorage.setItem("role",result.data.role);
	        sessionStorage.setItem("roles",JSON.stringify(result.data.roles));
		});
    }
	
	vm.baseUrl = baseUrl;
	
    vm.toggleSidebar = function() {
        $rootScope.menuShrink = !$rootScope.menuShrink;
        $rootScope.sidebarCollapsed = !$rootScope.sidebarCollapsed;
    };

    vm.toggleControlSidebar = function() {
        $rootScope.controlSidebarOpened = !$rootScope.controlSidebarOpened;
    };

    vm.logout = function(){
    	sessionStorage.removeItem("userName");
    	sessionStorage.removeItem("role");
    	sessionStorage.removeItem("roles");
        UserService.logout().then(function (){
            location.reload();
        });

    };
}]);