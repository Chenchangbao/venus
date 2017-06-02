import './breadcrumb.less';
import template from './breadcrumb.html';

export default app => {
    app.directive('snBreadcrumb', [
        function() {
            return {
                restrict: 'E',
                template: template,
                //replace: true,
                scope: {
                    datalist: '='
                },
                link: (scope, elem, attrs) => {
                    scope.reset = (idx) => {
                        if (scope.datalist.length > (1 + idx)) {
                            if (!!scope.datalist[idx].disable) return;
                            scope.datalist.splice(1 + idx, scope.datalist.length - idx);
                        }
                    };
                }
            };
        }
    ]);
};
