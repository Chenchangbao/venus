import {
    Inject
} from 'business/decorator/decorator';

@Inject
class versionReport {
    constructor($scope, HttpService, $state,$stateParams, $q, $filter) {
        let vm = $scope;

        //头部链接
        vm.crumbBaseData = [
            { href: "/#/version", title: "版本管理" },
            { href: "", title: "版本报告" }
        ];

        init();
        
        function init() {
            getVersionDetail();
        }
        
        function getVersionDetail() {
            HttpService.get('version/getVersionDetail/'+$stateParams.id).then(function (result) {
                vm.versionDetail = result;
            })
        }
      
    }
}

export default app =>app.controller('versionReport', versionReport)

