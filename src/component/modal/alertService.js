import angular from 'angular';
import alertTmpl from './alertTmpl.html';
import confirmTmpl from './confirmTmpl.html';
import {dialogDrag} from './dialogDrag';

export default app => {
    app.service("AlertService", ["$http", "$document", "$q", "$rootScope", "$compile",
        function ($http, $document, $q, $rootScope, $compile) {
            var zIndex = 1200;
            var dialogCounter = 0;

            // var mask = angular.element('<div class="modal-backdrop fade in"></div>');
            // mask.css("z-index", zIndex);

            var service = {
                alert: function (param) {
                    var defer = $q.defer();
                    var dialog;
                    dialogCounter++;

                    // if (dialogCounter == 1) {
                    //   $document.find("body").append(mask);
                    // }

                    var data = $rootScope.$new();
                    angular.extend(data, param);

                    data.ok = function () {
                        service.dismiss(dialog);
                        defer.resolve("ok");
                    };
                    data.close = function () {
                        service.dismiss(dialog);
                        defer.resolve("ok");
                    };
                    data.type = data.type || 'info';

                    dialog = $compile(angular.element(alertTmpl))(data);

                    $document.find("body").append(dialog);
                    dialog.css("display", "block");
                    dialog.css("z-index", zIndex + dialogCounter);

                    dialogDrag()(dialog);

                    return defer.promise;
                },
                confirm: function (param) {
                    var defer = $q.defer();

                    var dialog;
                    dialogCounter++;

                    // if (dialogCounter == 1) {
                    //   $document.find("body").append(mask);
                    // }

                    var data = $rootScope.$new();
                    angular.extend(data, param);

                    data.ok = function () {
                        service.dismiss(dialog);
                        defer.resolve("ok");
                    };
                    data.cancel = function () {
                        service.dismiss(dialog);
                        defer.reject("cancel");
                    };
                    data.close = function () {
                        service.dismiss(dialog);
                        defer.reject("cancel");
                    };

                    dialog = $compile(confirmTmpl)(data);

                    $document.find("body").append(dialog);
                    dialog.css("display", "block");
                    dialog.css("z-index", zIndex + dialogCounter);

                    dialogDrag()(dialog);

                    return defer.promise;
                },
                dismiss: function (dialog) {
                    dialogCounter--;
                    dialog.remove();

                    if (dialogCounter == 0) {
                        // mask.remove();
                    }
                }
            };

            return service;
        }]);
}