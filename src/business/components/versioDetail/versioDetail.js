import {
    Inject
} from 'business/decorator/decorator';

@Inject
class versioDetail {
    constructor($scope, HttpService, DialogService,ReposService,$state,$stateParams, userService,$q, $filter) {
        let vm = $scope;

        //头部链接
        vm.crumbBaseData = [
            { href: "/#/version", title: "版本管理" },
            { href: "", title: "版本详情" }
        ];

        init();
        function init() {
            //取得所有用户
            userService.getSelectUsers().then(function (result) {
                vm.users = result;

                vm.users.forEach(e => {
                    e.text = e.name;
                    e.id = e.code
                })
            })
            let select2option = {
                ajax: {
                    processResults: (data) => {
                        data = (data || []);
                        return {
                            results: data
                        };
                    },
                    transport: function (params, success, failure) {
                        var deferred = $q.defer();
                        var p = deferred.promise
                        if (!params.data.term || params.data.term.length < 8) {
                            if (params.data.term == undefined) { params.data.term = 1 };
                            let filterList1 = $filter('filterEmpty')(vm.users, params.data.term);
                            let filterList2 = $filter('filter')(filterList1, params.data.term);
                            let filterList3 = $filter('numberLimit')(filterList2, 6);
                            deferred.resolve(filterList3);
                        } else {
                            let user = vm.users.find(n => n.id === params.data.term)
                            if (user) {
                                deferred.resolve([user])
                            } else {
                                if (/^\d{8,12}$/.test(params.data.term)) {

                                    userService.getAndUpdateUser(params.data.term).then(e => {
                                        let user = e.find(n => n.code === params.data.term);
                                        if (!user) {
                                            deferred.resolve([])
                                        } else {
                                            deferred.resolve([user]);
                                        }
                                        e.forEach(e => {
                                            e.text = e.name;
                                            e.id = e.code;
                                        })
                                        vm.users = e;
                                    })
                                } else {
                                    deferred.resolve([])
                                }
                            }
                        }
                        return p.then(success, failure)
                    }
                }
            }

            vm.names = ['master', 'developer', 'codeReivew', 'mergeApprover']
            vm.names.forEach(e => {
            vm[e + 'select2option'] = angular.copy(select2option)
            })
            vm.selectList = [{ "name": "管理组", "ename": vm["masterselect2option"] }, { "name": "开发组", "ename": vm["developerselect2option"] }, { "name": "评审组", "ename": vm["codeReivewselect2option"] }, { "name": "配置组", "ename": vm["mergeApproverselect2option"] }]
            $('select[select2]').on('select2:open', e => {
                $('select[select2]+span.select2 input.select2-search__field').attr('maxlength', 12)
            })

            getVersionDetail();

        }
        
        function getVersionDetail() {
            HttpService.get('version/getVersionDetail/'+$stateParams.id).then(function (result) {
                vm.versionDetail = result;
            })
        }
      
    }
}

export default app =>app.controller('versioDetail', versioDetail)

