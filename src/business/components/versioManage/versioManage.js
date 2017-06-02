import {
    Inject
} from 'business/decorator/decorator';

@Inject
class versioManage {
    constructor($scope, DialogService, $state, $stateParams, userService, $q, $filter, HttpService,$timeout) {
        let vm = $scope;
        vm.names = [];
        // vm.state = "";
        vm.versionNum = "";
        vm.showStep = 1;
        vm.selectedUser = {};
        vm.versionBO = {};
        vm.userList1 = [];
        
        vm.dateOption3 = {
            singleDatePicker: true,//日期单选
            timePicker: true,
            locale:{
                format: 'YYYY-MM-DD HH:mm:ss'
            }
        };
        vm.dateOption = {
            // locale: {
            //     format: 'YYYY-MM-DD HH:mm:ss'
            // },
            timePicker: true,
            singleDatePicker: false,
            locale:{
                format: 'YYYY-MM-DD HH:mm:ss'
            },
            // "timePicker": true,
            // "timePicker24Hour": true,
            // "timePickerSeconds": true,

            eventHandlers: {
                'apply.daterangepicker': function (ev, picker) {
                    var startdate = new Date($scope.date.startDate);
                    var enddate = new Date($scope.date.endDate);
                    //获取操作记录
                    var start=$filter('date')(startdate, 'yyyy-MM-dd HH:mm:ss');
                    var end=$filter('date')(enddate, 'yyyy-MM-dd HH:mm:ss');
                    getOptions(start,end);
                }
            }
        };
        init();
        function init() {

            //取得所有用户
           var deferA = $q.defer();
           let p1 = userService.getSelectUsers().then(function (result) {
                vm.users = result;

                vm.users.forEach(e => {
                    e.text = e.name;
                    e.id = e.code
                })
                deferA.resolve('this is DATA A')  
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
            vm["versionselect2option"] = angular.copy(select2option)
          

            vm.versionTest ={
                "version": "1.0.0",
                "name": "过程管理版本1",
                "sysId": 10,
                "sysName": "VENUS",
                "status": 1,
                "description": "描述",
                "lead": "曹杰（16072437）",
                "source": "门户",
                "startTime": "Jun 2, 2017 2:11:27 PM",
                "deployPlanTime": "Jun 2, 2017 2:11:27 PM",
                "deployTime": "Jun 2, 2017 2:11:27 PM",
                "createTime": "Jun 2, 2017 2:11:27 PM",
                "updateTime": "Jun 2, 2017 2:11:27 PM",
                "reposList": [{
                    "reposId": 111,
                    "reposName": "代码库A",
                    "reposType": "SVN",
                    "isNewBranch": 1,
                    "branchBO": {
                        "branchId": 100,
                        "branchName": "分支1",
                        "readWriteUser": ["16072437",
                            "16072448"],
                        "readOnlyUser": ["16072437",
                            "16072448"]
                    },
                    "check": false,
                    "branchList": [{
                        "branchId": 100,
                        "branchName": "分支1",
                        "readWriteUser": ["16072437",
                            "16072448"],
                        "readOnlyUser": ["16072437",
                            "16072448"]
                    }]
                }],
                "versionRoleBOList": [{
                    "role": "技术经理",
                    "userList": ["12080204",
                        "12080222"]
                },
                    {
                        "role": "产品经理",
                        "userList": ["12080204",
                            "12080222"]
                    }],
                "epicCount": 12,
                "taskCount": 6,
                "bugCount": 3,
                "completeRate": "20%",
                "epicBOList": [{
                    "epicName": "需求1",
                    "id": "10000",
                    "description": "需求描述1",
                    "assignee": "16072437",
                    "status": 1
                },
                    {
                        "epicName": "需求1",
                        "id": "10000",
                        "description": "需求描述1",
                        "assignee": "16072437",
                        "status": 1
                    }],
                "bugBOList": [{
                    "id": "111",
                    "summary": "缺陷1",
                    "description": "缺陷描述1",
                    "assignee": "16072437",
                    "status": 2
                },
                    {
                        "id": "111",
                        "summary": "缺陷1",
                        "description": "缺陷描述1",
                        "assignee": "16072437",
                        "status": 2
                    }]
            };
            $q.all([p1]).then(initSelect);
            function initSelect(){
                    var  i= 0;
                    vm.versionTest.versionRoleBOList.forEach(e => {
                        e.userList.forEach(f =>{
                            vm.users.forEach(g => {
                                if(g.id == f){
                                    let obj = {"id":f,"name":g.name}
                                    vm.userList1.push(obj);
                                }
                            })
                            
                        });
                        vm['select2option'+i] = angular.copy(select2option);
                        e["ename"] = vm['select2option'+i];
                        e["userList1"] = vm.userList1;
                        vm.userList1 = [];
                        i++;
                    })
            }
             var  i= 0;
             $timeout(() => {
                	//console.log(e);

                    vm['select2option'+i].reset();
                    i++;
            },100);
          
            vm.names = ['master', 'developer', 'codeReivew', 'mergeApprover']
            vm.names.forEach(e => {
                vm[e + 'select2option'] = angular.copy(select2option)
            })
            vm.selectList = [{ "name": "管理组", "ename": vm["masterselect2option"] }, { "name": "开发组", "ename": vm["developerselect2option"] }, { "name": "评审组", "ename": vm["codeReivewselect2option"] }, { "name": "配置组", "ename": vm["mergeApproverselect2option"] }]
            //  vm.selectList.forEach(e =>{

            //      vm.names.push(e.ename);
            //  })
            //select2赋值
            // vm.names.forEach(e => {
            //     let repeat = vm[e + 'Repeat'] = []
            //     vm.reposDto[e + 'List'] && vm.reposDto[e + 'List'].forEach(d => {
            //         repeat.push(vm.users.find(n => n.code === d))
            //     })
            //     vm[e + 'List'] = angular.copy(repeat)
            //     $scope.$watch(e + 'List', (newValue, oldValue) => {
            //         vm.reposDto[e + 'List'] = []
            //         newValue && newValue.forEach(d => {
            //             vm.reposDto[e + 'List'].push(d.id)
            //         })
            //     }, true)
            //     $timeout(() => {
            //     	console.log(e);
            //         vm[e + 'select2option'].reset();
            //     })
            // })


            $('select[select2]').on('select2:open', e => {
                $('select[select2]+span.select2 input.select2-search__field').attr('maxlength', 12)
            })

            getMySystem();
        }
        //执行一次深拷贝
        vm.fn = 1;
        vm.once =()=>{
            if(vm.fn == 1){
                vm.branchName = angular.copy(vm.versionNum);
            }
            vm.fn = null;
        }
        //步骤进度
        vm.name = ['基本信息', '版本团队管理', '选择代码库'];
        vm.cStep = 0;
        vm.curr = function (currStep) {
            vm.cStep = currStep;
        };
        vm.nextStep = (step) => {
            vm.once();
            vm.cStep = Math.min(3, ++vm.cStep);
            vm.showStep = step;
        };
        vm.previousStep = (step) => {
            vm.cStep = Math.min(3, --vm.cStep);
            vm.showStep = step;
        };

        //头部链接
        vm.crumbBaseData = [
            { href: "/#/component/nav/horizontal-menu", title: "版本管理" },
            { href: "", title: "新增版本" }
        ];

        //多选
        vm.resetCheckedNum = (check,index)=>{
            vm.reposList[index].check = check;
        }

        vm.chooseBranch = (branch,index)=>{
            vm.reposList[index].branchBO = branch;
        }

        vm.getSystemRepos = d =>{
            if(typeof d === 'undefined'){
                vm.versionBO.sysId = '';
                vm.versionBO.sysName = '';
                vm.reposList = [];
                return;
            }
            vm.versionBO.sysId = d.sysId;
            vm.versionBO.sysName = d.jiraKey;
            HttpService.get('version/getSystemUserRoleAndRepos/'+d.sysId).then(function (result) {
                vm.reposList = result.reposList;
            })
        }

        vm.commit = () => {
            vm.versionBO.reposList = vm.reposList;
            vm.versionBO.lead =vm.selectedUser.name;
            HttpService.post('version/create',vm.versionBO).then(function (result) {
                alert("添加成功");
                $state.go('version');
            })
        }

        function getMySystem(){
            HttpService.get('version/getSystemListByVersionManager').then(function (result) {
                vm.systemList = result;
            })
        }

        // $scope.reposList = [{
        //     "reposId": 111,
        //     "reposName": "name",
        //     "reposType": "git",
        //     "gitProjectId": 112,
        //     "isNewBranch": null,
        //     "branchBO": null,
        //     "branchList": [{
        //         "branchId": 1,
        //         "branchName": "分支1",
        //         "newBranchName": null,
        //         "newBranchDescription": null,
        //         "readWriteUser": null,
        //         "readOnlyUser": null
        //     },
        //         {
        //             "branchId": 2,
        //             "branchName": "分支2",
        //             "newBranchName": null,
        //             "newBranchDescription": null,
        //             "readWriteUser": null,
        //             "readOnlyUser": null
        //         },
        //         {
        //             "branchId": 3,
        //             "branchName": "master",
        //             "newBranchName": null,
        //             "newBranchDescription": null,
        //             "readWriteUser": null,
        //             "readOnlyUser": null
        //         }]
        // },
        //     {
        //         "reposId": 112,
        //         "reposName": "name2",
        //         "reposType": "svn",
        //         "gitProjectId": null,
        //         "isNewBranch": null,
        //         "branchBO": null,
        //         "branchList": [{
        //             "branchId": 1,
        //             "branchName": "分支1",
        //             "newBranchName": null,
        //             "newBranchDescription": null,
        //             "readWriteUser": null,
        //             "readOnlyUser": null
        //         },
        //             {
        //                 "branchId": 2,
        //                 "branchName": "分支2",
        //                 "newBranchName": null,
        //                 "newBranchDescription": null,
        //                 "readWriteUser": null,
        //                 "readOnlyUser": null
        //             },
        //             {
        //                 "branchId": 3,
        //                 "branchName": "trunk",
        //                 "newBranchName": null,
        //                 "newBranchDescription": null,
        //                 "readWriteUser": null,
        //                 "readOnlyUser": null
        //             }]
        //     }]
        //
        // $scope.tabelInfos = [
        //         {
        //         ip:'127.0.0.1',
        //         host:'苏宁易购',
        //         state:'运行正常',
        //         check:true,
        //         modify:true
        //         },
        //         {
        //         ip:'127.0.0.2',
        //         host:'苏宁易购',
        //         state:'运行正常',
        //         check:false,
        //         modify:true
        //         },{
        //         ip:'127.0.0.3',
        //         host:'苏宁易购',
        //         state:'运行正常',
        //         check:true,
        //         modify:true
        //         },
        //         {
        //         ip:'127.0.0.4',
        //         host:'苏宁易购',
        //         state:'运行正常',
        //         check:false,
        //         modify:true
        //         },
        //         {
        //         ip:'127.0.0.5',
        //         host:'苏宁易购',
        //         state:'运行正常',
        //         check:false,
        //         modify:true
        //         }
        //     ];


   }
}

export default app => app.controller('versioManage', versioManage)

