angular.module("sncd").controller("SideBarCtrl", ["$scope", "$rootScope", "UserService", function($scope, $rootScope,UserService) {
    var vm = $scope;
    vm.username = sessionStorage.getItem("userName");
    vm.role=sessionStorage.getItem("role");
    if(null ==vm.username || vm.role==null){
	    UserService.getUserinfo().then(function(result){
	        vm.username = result.data.userName;
	        vm.role=result.data.role;
	        sessionStorage.setItem("userName",result.data.userName);
	        sessionStorage.setItem("role",result.data.role);
	        sessionStorage.setItem("roles",JSON.stringify(result.data.roles));
		});
    }
}]);