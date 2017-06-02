import {
    Inject
} from 'business/decorator/decorator';

@Inject
class overview {
    constructor($scope, DialogService,ReposService,$state,$stateParams) {
        let vm = $scope;
      
    }
}

export default app =>app.controller('overview', overview)

