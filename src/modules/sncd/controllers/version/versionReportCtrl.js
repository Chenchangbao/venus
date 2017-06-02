angular.module('sncd')
	.controller('VersionReportCtrl', ['$scope', '$state', '$stateParams', 'VersionManageService', 'SystemService',
		function ($scope, $state, $stateParams, VersionManageService, SystemService) {
			var vm = $scope,
				globals = {},
				formData = vm.formData = {};

			function queryReport() {
				var params = {
					versionId: $stateParams.versionId || ''
				};
				return VersionManageService.versionReport(params).then(function (data) {
					var detail = vm.detail = data.versionQualityInfoBo || {};
					vm.version = angular.extend({},detail, detail.versionCountInfo || {}, detail.versionDeployCountInfo || {});
					vm.quality = detail.qualityCountInfo || {};
				});
			}

			function init() {
				queryReport();
			}

			init();

		}]);

