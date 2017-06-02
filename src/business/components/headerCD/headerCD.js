import {
    Inject
} from 'business/decorator/decorator'

@Inject
class headerCD {
    constructor($scope, DialogService) {
        let vm = $scope;
        vm.user = ''

    }
}
@Inject
class ControlSidebarCtrl {
    constructor($scope, DialogService) {
        let vm = $scope;
        vm.user = ''

    }
}
@Inject
class HeaderCtrl {
    constructor($scope, LoginService, $rootScope, UserService) {
        let vm = $scope;
        $scope.doLogout = function () {
            // if (ENVIRONMENT == 'development') {
            //     window.location.href = 'https://ssopre.cnsuning.com/ids/logout?loginTheme=' + LoginService.config.loginTheme + '&service=' + encodeURIComponent(window.location.href)
            // } else if (ENVIRONMENT == 'sit') {
            //     window.location.href = 'https://ssosit.cnsuning.com/ids/logout?service=http://odindev.cnsuning.com:8888/index.html'
            // } else {
            //     window.location.href = 'https://sso.cnsuning.com/ids/logout?service=http://snds.cnsuning.com/'
            // }
            sessionStorage.removeItem("userName");
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("roles");
            if (location.host.match('pre')) {
                window.location.href = 'https://ssopre.cnsuning.com/ids/logout?loginTheme=' + LoginService.config.loginTheme + '&service=' + encodeURIComponent(window.location.href)
            } else if (location.host.match('dev') || location.host.match('sit')) {
                window.location.href = 'https://ssosit.cnsuning.com/ids/logout?loginTheme=' + LoginService.config.loginTheme + '&service=' + encodeURIComponent(window.location.href)
            } else {
                window.location.href = 'https://sso.cnsuning.com/ids/logout?loginTheme=' + LoginService.config.loginTheme + '&service=' + encodeURIComponent(window.location.href)
            }
        };

        // $rootScope.$on('$locationChangeSuccess', function (evt, newUrl, oldUrl) {
        //     console.log("newURL：" + newUrl);
        //     var url = $location.url();
        //     if (url.indexOf("#loginSuccess:") >= 0 && (url.indexOf("#loginSuccess:") == url.length - 14)) {
        //         LoginService.loginSuccess();
        //         var newPath = url.slice(0, url.indexOf("#loginSuccess:"));
        //         console.log(newPath);

        //         //因需一个被拦截的请求,初始化后台session,故此写法

        //         UserService.getUserinfo().then(function (result) {
        //             vm.username = result.data.userName;
        //             sessionStorage.setItem("userName", result.data.userName);
        //             sessionStorage.setItem("role", result.data.role);
        //             sessionStorage.setItem("roles", JSON.stringify(result.data.roles));
        //         });

        //         $location.url(newPath);
        //     } else if (url.indexOf("#close:") >= 0 && (url.indexOf("#close:") == url.length - 7)) {
        //         LoginService.closeContainer();
        //         var newPath = url.slice(0, url.indexOf("#close:"));
        //         console.log(newPath);
        //         $location.url(newPath);
        //     } else if (url.indexOf("#resize:") >= 0) {
        //         LoginService.resizeContainer(url.slice(url.indexOf("#resize:") + 8));
        //         var newPath = url.slice(0, url.indexOf("#resize:"));
        //         console.log(newPath);
        //         $location.url(newPath);
        //     }
        //     // Halt state change from even starting
        //     evt.preventDefault();
        //     // Perform custom logic
        // });
        // /****passport end***/

        vm.username = sessionStorage.getItem("userName");
        if (null == vm.username || vm.role == null) {
            UserService.getUserinfo().then(function (result) {
                vm.username = result.data.userName;
                sessionStorage.setItem("userName", result.data.userName);
                sessionStorage.setItem("role", result.data.role);
                sessionStorage.setItem("roles", JSON.stringify(result.data.roles));
                vm.$apply()
            });
        }

        // vm.baseUrl = baseUrl;

        vm.toggleSidebar = function () {
            $rootScope.menuShrink = !$rootScope.menuShrink;
            $rootScope.sidebarCollapsed = !$rootScope.sidebarCollapsed;
        };

        vm.toggleControlSidebar = function () {
            $rootScope.controlSidebarOpened = !$rootScope.controlSidebarOpened;
        };

        vm.logout = function () {
            sessionStorage.removeItem("userName");
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("roles");
            UserService.logout().then(function () {
                location.reload();
            });

        };

    }
}
@Inject
class SideBarCtrl {
    constructor($scope, DialogService) {
        let vm = $scope;
        vm.user = ''

    }
}
@Inject
class SideMenuCtrl {
    constructor($rootScope, $state, $scope, UserService, $q) {
        //跳转url
        var cdHref;
        var venusHref;
        if (location.hostname.match('sit')) {
            cdHref = "cdsit.cnsuning.com";
            venusHref = "venussit.cnsuning.com";
        } else if (location.hostname.match("dev")) {
            cdHref = "cddev.cnsuning.com";
            venusHref = "venusdev.cnsuning.com:80";
        } else if (location.hostname.match('pre')) {
            cdHref = "cdpre.cnsuning.com";
            venusHref = "venuspre.cnsuning.com";
        } else {
            cdHref = "cd.cnsuning.com";
            venusHref = "venus.cnsuning.com";
        }
        var cdUrl = 'http://' + cdHref;
        var venusUrl = 'http://' + venusHref;
        var vm = this;
        $scope.menus = [];
        $rootScope.menuShrink = false;
        var menus = [
		    {
                code: "18",
                name: "概述",
                icon: "fa icon-document"
            }, {
                code: "18-0",
                name: "版本管理",
                icon: "fa fa-umbrella",
                state: "Header.Versio",
                href: venusUrl + '/#/version'
            }, {
                code: "18-1",
                name: "版本详情",
                icon: "fa fa-umbrella",
                state: "Header.VersioDetail",
                href: venusUrl + '/#/versioDetail'
            }
        ];


        function getRoles() {
            var roles = {};
            roles = JSON.parse(sessionStorage.getItem("roles"));
            if (null == roles) {
                let p1 = UserService.getUserinfo().then(function (result) {
                    vm.username = result.data.userName;
                    vm.role = result.data.role;
                    roles = result.data.roles;
                    sessionStorage.setItem("userName", result.data.userName);
                    sessionStorage.setItem("role", result.data.role);
                    sessionStorage.setItem("roles", JSON.stringify(result.data.roles));
                    //addRoles(roles);
                });
                $q.all([p1]).then(addRoles(roles));
            } else {
                addRoles(roles);
            }
            console.log($scope.menus);
        }

        vm.getMenusIndex = (code) => {
            var index = -1;
            var i = -1;
            index = menus.findIndex(function (value, index, arr) {
                i++;
                return arr[i].code == code;
            });
            return index + 1;
        }

        getRoles();

        function addRoles(roles) {
     
            getMenus();
        }

        function getMenus() {
            var menuMap = {};

            for (var i = 0; i < menus.length; i++) {
                var menuItem = menus[i];
                menuMap[menuItem.code] = menuItem;

                if (!menuItem.parent) {
                    $scope.menus.push(menuItem);
                } else {
                    var parent = menuMap[menuItem.parent];
                    if (!parent.children) {
                        parent.children = [];
                    }
                    menuItem.parentMenu = parent;

                    if (!menuItem.isHide) {
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
            if (menu.name==='持续集成'&&menu.children) {
                let lis = document.querySelectorAll('#sidebarmenu>li')
                let target = Array.prototype.filter.call(lis, e => {
                    return e.innerText.match('持续集成')
                })
                if (target && target.length) {
                    target[0].classList.toggle('active');
                    return;
                }
            }
            if (menu != this.selectedMenu) {
                this.selectedMenu = menu;
            }
            location.href = menu.href
            // if (menu.state) {
            //     if (menu.href) {
            //         $state.go(menu.state, {
            //             href: menu.href
            //         }, {
            //             reload: true
            //         });
            //     } else {
            //         $state.go(menu.state, {}, {
            //             reload: true
            //         });
            //     }
            // }
        };

        this.selectMenu2 = function (evt, menu) {
            if (menu.state != $state.current.name) {
                this.selectedMenu = menu;
            }
            location.href = menu.href
            
            // if (menu.state) {
            //     if (menu.href) {
            //         $state.go(menu.state, {
            //             href: menu.href
            //         }, {
            //             reload: true
            //         });
            //     } else {
            //         $state.go(menu.state, {}, {
            //             reload: true
            //         });
            //     }
            // }
            evt.stopPropagation();
            evt.preventDefault();
        };
        this.selectMenu3 = function (evt, menu) {
            if (menu.state != $state.current.name) {
                this.selectedMenu = menu;
            }
            //            if (menu.state) {
            //                if (menu.href) {
            //                    $state.go(menu.state, {
            //                        href: menu.href
            //                    }, {
            //                            reload: true
            //                        });
            //                } else {
            //                    $state.go(menu.state, {}, {
            //                        reload: true
            //                    });
            //                }
            //            }
            evt.stopPropagation();
            evt.preventDefault();
            location.href = menu.href
        };

        this.isMenuSelected = function (menuItem) {
            if (this.selectedMenu) {
                if (this.selectedMenu.code.indexOf(menuItem.code) == 0) {
                    return true;
                }
            } else {
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
    }
}

export default app => {
    app.service("UserService", ["HttpService", "$q", function (HttpService, $q) {
        'use strict';

        return {
            "getUserinfo": function (params) {
                let userName, roles, role
                let p1 = HttpService.get("user/getFullName", params).then(d => {
                    userName = d
                });
                let p2 = HttpService.get("user/getRoles", params).then(d => {
                    roles = d.roles
                    role = d.role
                });
                return Promise.all([p1, p2]).then(() => {
                    return {
                        "errMsg": "success",
                        "data": {
                            "roles": roles,
                            "role": role,
                            "userName": userName
                        },
                        "errCode": "0"
                    }
                })
                // return new Promise((resolve) => {
                //     resolve({
                //         "errMsg": "success",
                //         "data": {
                //             "roles": {
                //                 "116": "产品负责人",
                //                 "117": "技术负责人",
                //                 "ROLE_ADMIN": "平台管理员",
                //                 "055": "产品顾问",
                //                 "045": "技术总监",
                //                 "044": "产品经理",
                //                 "ROLE_CMO": "配置管理员",
                //                 "047": "开发工程师",
                //                 "046": "产品总监",
                //                 "ROLE_CQC": "中心质量管控者",
                //                 "ROLE_DEPLOYER": "发布员",
                //                 "ROLE_COMPANY": "公司管理者",
                //                 "299": "游客",
                //                 "ROLE_QUALITY_AUTH_CONTROL": "ROLE_QUALITY_AUTH_CONTROL",
                //                 "050": "测试经理",
                //                 "257": "静态发布专员",
                //                 "ROLE_DEPLOYCONFIGER": "发布配置执行角色",
                //                 "043": "技术经理",
                //                 "ROLE_CENTER": "中心管理者",
                //                 "054": "系统管理员",
                //                 "256": "发布专员",
                //                 "ROLE_QUALITY": "ROLE_QUALITY"
                //             },
                //             "role": "技术总监",
                //             "userName": "陈军(10111065)"
                //         },
                //         "errCode": "0"
                //     })
                // })
            },
            "logout": function () {
                //// 获取用户数据，对接后台接口
                //	       return HttpService.get("/j_spring_security_logout");
                return HttpService.get("/cdlogout.htm");
            }
        };
    }]);
    app.controller('headerCD', headerCD)
    app.controller('ControlSidebarCtrl', ControlSidebarCtrl)
    app.controller('HeaderCtrl', HeaderCtrl)
    app.controller('SideBarCtrl', SideBarCtrl)
    app.controller('SideMenuCtrl', SideMenuCtrl)
    app.directive('scrollBar', ['LazyLoader', '$q', function (LazyLoader, $q) {
        var cssCache = {};
        return {
            restrict: 'A',
            scope: {
                marginTopOffset: '@marginTopOffset',
                suppressScrollX: '@suppressScrollX',
                suppressScrollY: '@suppressScrollY'
            },
            link: function (scope, element, attrs) {
                var cssUrl = 'styles/scrollbar/perfect-scrollbar.min.css',
                    scriptUrl = 'lib/scrollbar/perfect-scrollbar.js',
                    marginTopOffset = scope.marginTopOffset || 0,
                    seed = 10,
                    elem = element[0];
                if (!elem) {
                    return;
                }

                function getElementHeight() {
                    var defer = $q.defer();

                    function calcHeight() {
                        var windowClientHeight = document.documentElement.clientHeight,
                            h = windowClientHeight - marginTopOffset - seed;
                        element.css('height', h + 'px');
                        defer.resolve('calc height success');
                    }
                    calcHeight();
                    return defer.promise;
                }

                function createCssLink(url) {
                    if (cssCache[url]) {
                        return $q.when('css is loaded return cache');
                    }
                    var defer = $q.defer(),
                        head = document.querySelector('head'),
                        link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = url;
                    link.onload = function () {
                        defer.resolve('css is loaded');
                    };
                    link.onerror = function () {
                        defer.reject('css is loaded error');
                    };
                    head.appendChild(link);
                    cssCache[url] = true;
                    return defer.promise;
                }
                $q.all([getElementHeight(), createCssLink(cssUrl), LazyLoader.load(scriptUrl)]).then(function () {
                    /* global Ps */
                    Ps.initialize(elem, {});
                });
                angular.element(window).on('resize', function () {
                    getElementHeight().then(function () {
                        Ps.update(elem);
                    });
                });
            }
        }
    }]);
    app.filter('filterEmpty', function () {
        return function (list, value) {

            return value ? list : [];
        };
    });
    app.filter("numberLimit", function() {
        return function(list, number) {
            ;
            list = list || [];
            if (list.length > number) {
                list.splice(number, list.length);
            }
            return list;
            }
    });
};