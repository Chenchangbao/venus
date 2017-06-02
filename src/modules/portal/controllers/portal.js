angular.module("sncd").controller("PortalCtrl", ["$rootScope", "$timeout", "DialogService", "AlertService", function($rootScope, $timeout, DialogService, AlertService) {

    this.sidebarCollapsed = function() {
        return $rootScope.sidebarCollapsed;
    };

    $rootScope.$on("$stateChangeSuccess", function() {
        DialogService.dismissAll();
        AlertService.dismissAll();
        
        //重新计算右侧主面板的最小高度
        //临时解决方案
        $timeout(function(){

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

            };
        })
    });
}]);