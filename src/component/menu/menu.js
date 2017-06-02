import './menu.less';
import menuTmpl from './menu.html';
import menuItemTmpl from './menuItem.html';
import menuItem2Tmpl from './menuItem2.html';
import menuItem3Tmpl from './menuItem3.html';

export default app => {
    function stateGoFactory(scope, state) {
        return event => {
            if (scope.uiState && !scope.readonly) {
                event.preventDefault();
                event.stopPropagation();
                state.go(scope.uiState, scope.uiStateParam);
            }
        }
    }

    app.directive('snMenu', [() => {
        let ctrl = function ($scope, $state) {
            let menus = $scope.$menus = [];
            // 路由切换后，定位菜单是否被命中
            $scope.$on('router:state:change', (evt, toState) => {
                locateMenu(toState);
            });
            // 菜单变更后，定位菜单是否被命中
            $scope.$on('sn-menu:menu-change', evt => {
                locateMenu($state.current);
            });

            this.addMenu = menu => {
                menus.push(menu);
                locateMenu($state.current);
            };

            function locateMenu(toState) {
                let state = toState.name;
                for (let menu of menus) {
                    menu.active = isMenuActive(menu, state)
                }
            }

            function isMenuActive(menu, state) {
                let active = false;
                let menuState = /.*(?=\()/.exec(menu.uiState);
                active = menu.uiState == state;
                if (!active && menu.relations) {
                    for (let relation of menu.relations) {
                        active = active || ((relation instanceof RegExp) ? relation.test(state) : relation == state);
                    }
                };
                if (menu.children && menu.children.length > 0) {
                    active = menu.children.filter(item => {
                        return isMenuActive(item, state);
                    }).length || active;
                }
                menu.active = active;
                return active;
            }
        };
        ctrl.$inject = ['$scope', '$state'];

        let link = function (scope, element, attrs) {
            element.addClass('sn-menu');
            // 如果是竖式菜单，并且包含主菜单标记main-menu，则需要监听事件，动态调整页面高度
            if (attrs.hasOwnProperty('mainMenu') && element.hasClass('vertical')) {
                scope.$on('router:state:change', (evt, toState) => {
                    if ($.AdminLTE) {
                        $.AdminLTE.layout.fix();
                        $.AdminLTE.layout.fixSidebar();
                    }
                });

                scope.$on('sn-menu:menu-change', evt => {
                    if ($.AdminLTE) {
                        $.AdminLTE.layout.fix();
                        $.AdminLTE.layout.fixSidebar();
                    }
                });
            }
        };
        return {
            restrict: 'AE',
            transclude: true,
            scope: true,
            controller: ctrl,
            link: link,
            template: menuTmpl
        }
    }]);

    app.directive('snMenuItem', [() => {
        let ctrl = function ($scope, $element, $timeout, $state) {
            $scope.children = [];
            this.addMenu = menu => {
                $scope.children.push(menu);
                $scope.$emit('sn-menu:menu-change');
            };
            let gotoState = $scope.gotoState = stateGoFactory($scope, $state);
            // 横向菜单的垂直2级菜单排布时，进行一些特殊处理
            let snMenu = $element.parent().parent().parent();
            if ($element.hasClass('vertical') && snMenu.hasClass('horizontal')) {
                $timeout(() => {
                    let ul = $element.find('> ul');
                    let liFirst = ul.find('> li:first-child');
                    let liList = ul.find('> li');
                    let ulist = ul.find('> li > ul');

                    // active样式控制
                    $element.mouseenter(() => {
                        liList.removeClass('active');
                        liFirst.addClass('active');
                    });
                    liList.mouseenter(function () {
                        liList.removeClass('active');
                        $(this).addClass('active');
                    });

                    // 计算容器高度 宽度
                    let maxHeight = Math.max.apply(null, Array.from(ulist).map(item => angular.element(item).height()).concat(ul.height()));
                    let maxWidth = Math.max.apply(null, Array.from(ulist).map(item => angular.element(item).width()));
                    // ul有border，占用2px的高度，所以+2补内容的高度
                    ul.height(maxHeight + 3);
                    ulist.height(maxHeight);
                    ulist.width(maxWidth);

                    // 右对齐特殊处理
                    if ($element.hasClass('right-align')) {
                        // jquery获取的宽度不包含margin、padding，这里根据less的设置进行补足
                        ul.css('right', maxWidth + 60);
                    }
                }, 0);
            }

            // 竖式菜单的1级菜单特殊处理
            if (snMenu.hasClass('vertical')) {
                let needCalcHeight = snMenu.attr('main-menu') !== undefined;
                $scope.gotoState = function (event) {
                    $scope.open = !$scope.open;
                    if (needCalcHeight && $.AdminLTE) {
                        $timeout(() => {
                            $.AdminLTE.layout.fix();
                            $.AdminLTE.layout.fixSidebar();
                        });
                    }
                    gotoState(event);
                }
            }
        };
        ctrl.$inject = ['$scope', '$element', '$timeout', '$state'];

        let link = function (scope, element, attrs, snMenu, transcludeFn) {
            element.addClass('sn-menu-item');
            snMenu.addMenu(scope);
            scope.open = element.hasClass('open');
            let a = element.find('> a');
            a.append(element.find('> ul > t').remove());
            attrs.$observe('target', value => {
                a.attr('target', value);
            });
        };
        return {
            restrict: 'AE',
            transclude: true,
            replace: true,
            require: '^snMenu',
            scope: {
                href: '@',
                uiState: '@',
                readonly: '=',
                uiStateParam: '=',
                relations: '='
            },
            controller: ctrl,
            compile: (element, attrs, transcludeFn) => {
                let parent = element.parent();
                if (parent.hasClass('horizontal')) {
                    element.addClass('dropdown');
                    element.find('> ul').addClass('dropdown-menu');
                }
                let a = element.find('> a');
                return {
                    post: link
                }
            },
            template: menuItemTmpl
        }
    }]);

    app.directive('snMenuItem2', [() => {
        let ctrl = function ($scope, $state) {
            $scope.children = [];
            this.addMenu = menu => {
                $scope.children.push(menu);
                $scope.$emit('sn-menu:menu-change');
            };
            $scope.gotoState = stateGoFactory($scope, $state);
        };
        ctrl.$inject = ['$scope', '$state'];

        let link = function (scope, element, attrs, snMenuItem, transcludeFn) {
            element.addClass('sn-menu-item2');
            snMenuItem.addMenu(scope);
            let a = element.find('> a');
            a.append(element.find('> ul > t').remove());
            attrs.$observe('target', value => {
                a.attr('target', value);
            });
        };
        return {
            restrict: 'AE',
            transclude: true,
            replace: true,
            require: '^snMenuItem',
            scope: {
                href: '@',
                uiState: '@',
                readonly: '=',
                uiStateParam: '=',
                relations: '='
            },
            controller: ctrl,
            compile: (element, attrs, transcludeFn) => {
                let a = element.find('a');
                return {
                    post: link
                }
            },
            template: menuItem2Tmpl
        }
    }]);

    app.directive('snMenuItem3', [() => {
        let ctrl = function ($scope, $state) {
            $scope.gotoState = stateGoFactory($scope, $state);
        };
        ctrl.$inject = ['$scope', '$state'];

        let link = function (scope, element, attrs, snMenuItem2, transcludeFn) {
            element.addClass('sn-menu-item3');
            snMenuItem2.addMenu(scope);
            let a = element.find('> a');
            a.append(element.find('> .menu3-detail > t').remove());
            attrs.$observe('target', value => {
                a.attr('target', value);
            });
        }

        return {
            restrict: 'AE',
            transclude: true,
            replace: true,
            require: '^snMenuItem2',
            scope: {
                href: '@',
                uiState: '@',
                readonly: '=',
                uiStateParam: '=',
                relations: '='
            },
            controller: ctrl,
            link: link,
            template: menuItem3Tmpl
        }
    }]);
}