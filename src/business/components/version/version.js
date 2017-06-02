import {
    Inject
} from 'business/decorator/decorator'
@Inject
class VersionCtrl{
    constructor($scope, $timeout, HttpService, $state, DialogService, $stateParams) {
        let vm = $scope;

        vm.system=[
            {id:10,value:"TEMSYS"},
        ];

        vm.statusList=[
            {id:1,value:"开发中"},
            {id:2,value:"已封版"},
            {id:3,value:"已发布"},
            {id:4,value:"已归档"},
            {id:0,value:"已删除"},
        ];

        vm.currentPage = 1;
        vm.pageSize = 10;

        init();

        function init(){
            HttpService.get('version/getVersionList',{
                currentPage : vm.currentPage,
                pageSize : vm.pageSize,
                sysId : vm.sysId,
                status : vm.status,
                version : vm.version
            }).then(d => {
                vm.versions = d.data,
                vm.totalCount = d.totalCount
        })
        }

        vm.search = () => {
            HttpService.get('version/getVersionList',{
                currentPage : vm.currentPage,
                pageSize : vm.pageSize,
                sysId : vm.sysId,
                status : vm.status,
                version : vm.version
            }).then(d => {
                vm.versions = d.data,
                vm.totalCount = d.totalCount
        })
        }

        vm.delete = d =>{
            if(confirm("删除版本后关联的需求和缺陷将会移出该版本，确认删除？")){
                HttpService.delete('version/remove',d).then(d => {
                    alert('删除成功');
                    init();
                })
            }
        }

        $scope.paging1 = (pageArg, pageSizeArg, totalArg) => {
            HttpService.get('version/getVersionList',{
                currentPage : pageArg,
                pageSize : pageSizeArg
            }).then(d => {
                vm.versions = d.data,
                vm.currentPage = pageArg,
                vm.pageSize = pageSizeArg,
                vm.totalCount = d.totalCount
        })
            console.log(pageArg, pageSizeArg, totalArg);
        };
    }
}

export default app => {
    app.controller('VersionCtrl', VersionCtrl)
};