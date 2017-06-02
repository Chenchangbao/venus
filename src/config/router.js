let toStateCache, fromStateCache, cssToBeEnableList = []

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
        mockFn($stateProvider, 'state')
        // $urlRouterProvider.otherwise('/portal');

        let header = 'Header.'
        if(window!=window.top){
            header = ''
        }
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get("$state");
            $state.go(header + 'overview');
        });

        $stateProvider
            .state('Header', {
                abstract: true,
                cssUrl: 'business/components/headerCD/headerCD.css',
                templateUrl: 'business/components/headerCD/headerCD.html',
                controller: 'headerCD'
            })
            .state(header + 'version', {
                url: '/version',
                templateUrl: 'business/components/version/version.html',
                cssUrl: 'business/components/version/version.css',
                controller: 'VersionCtrl'
            })
            .state(header + 'VersioManage', {
                url: '/versioManage',
                templateUrl: 'business/components/versioManage/versioManage.html',
                cssUrl: 'business/components/versioManage/versioManage.css',
                controller: 'versioManage'
            })
            .state(header + 'VersioDetail', {
                url: '/versioDetail/:id',
                templateUrl: 'business/components/versioDetail/versioDetail.html',
                cssUrl: 'business/components/versioDetail/versioDetail.css',
                controller: 'versioDetail'
            })
            .state(header + 'VersionReport', {
                url: '/versionReport/:id',
                templateUrl: 'business/components/versionReport/versionReport.html',
                cssUrl: 'business/components/versionReport/versionReport.css',
                controller: 'versionReport'
            })
    }]);

    app.run(['$rootScope', 'LoginService', '$window', ($rootScope, LoginService, $window) => {
        document.domain = 'cnsuning.com'
        window.parent.ifr1Init && window.parent.ifr1Init($rootScope, $window, LoginService)
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
            toStateCache = toState
            fromStateCache = fromState
            // let params = /\/(\d+)$/.exec(location.href)
            // let projectId = params && params[1]
            $rootScope.projectId = toParams.projectId
        })

        //be careful, the time of removing css file is important, or the screen view would be flashing
        $rootScope.$on('$viewContentLoaded', function (event, viewConfig) {
            if (!toStateCache || !fromStateCache) return
            let sameName = getSameStateName(toStateCache, fromStateCache)
            let exceptName = toStateCache.name || ''
            removeCssList(sameName, exceptName)
            for (let i = 0; i < cssToBeEnableList.length; i++) {
                cssToBeEnableList.pop()()
            }
        })
    }])
}

function addResolve(obj) {
    obj.resolve = {
        css: ['$q', '$state', ($q, $state) => {
            var deferred = $q.defer();

            if (obj.cssUrl) {
                let csslink = document.createElement('link')
                csslink.setAttribute('rel', 'stylesheet')
                csslink.setAttribute('type', 'text/css')
                csslink.setAttribute('href', obj.cssUrl)
                csslink.setAttribute('data-name', obj.name)
                csslink.addEventListener('load', e => {
                    let styleSheet = csslink.sheet || csslink.styleSheet;
                    //如果可以在加载css文件的同时disabled，应该可以避免闪烁
                    styleSheet.disabled = true
                    cssToBeEnableList.push((sheet => {
                        return function () {
                            sheet.disabled = false
                        }
                    })(styleSheet))
                    deferred.resolve()
                })
                document.head.appendChild(csslink)
            } else {
                deferred.resolve()
            }

            return deferred.promise;
        }]
    }
    return obj
}

function mockFn(obj, name) {
    let old = obj[name]
    obj[name] = function () {
        arguments[1].name = arguments[0]
        return old.call(obj, arguments[0], addResolve(arguments[1]))
    }
}

/**
 * 
 */
function removeCssList(sameName, exceptFile) {
    if (!sameName.length) return

    let exceptArr = exceptFile.split('.'),
        exceptStr = '',
        exceptName = ''

    if (exceptFile.match('.')) {
        exceptArr.forEach(e => {
            exceptName += exceptName ? '.' + e : e
            exceptStr += ':not([data-name="' + exceptName + '"])'
        })
    }
    let links = document.querySelectorAll('head>link[data-name]' + exceptStr)
    for (let i = 0; i < links.length; i++) {
        let link = links[i]

        if (sameName.length === 0) {
            document.head.removeChild(link)
        } else {
            let name = ''
            let r = sameName.every(e => {
                name += name ? '.' + e : e
                if (name !== link.dataset.name) {
                    return true
                }
            })
            if (r)
                document.head.removeChild(link)
        }
    }
}

/**
 * get the same part between toState.name and fromState.name
 */
function getSameStateName(toState, fromState) {
    let toStateName = toState.name.split('.'),
        fromStateName = fromState.name.split('.'),
        result = []

    for (let i = 0; i < toStateName.length; i++) {
        if (toStateName[i] === fromStateName[i]) {
            result.push(toStateName[i])
        } else
            break
    }
    return result
}