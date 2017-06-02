angular.module("sncd").service("UserService", ["HttpService","$q",'AlertService', function(HttpService,$q,AlertService) {
	 'use strict';

     
	return {
        "getUserinfo": function(params) {
        	 //// 获取用户数据，对接后台接口
            return HttpService.get("/angular/home/getCustomerInfo.htm", params);
        },
		"logout": function() {
	   	 //// 获取用户数据，对接后台接口
//	       return HttpService.get("/j_spring_security_logout");
	       return HttpService.get("/cdlogout.htm");
	   }
    };
}]);