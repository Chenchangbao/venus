angular.module('sncd').controller('QualityCompareCtrl', ['$scope', 'QuaService','$state','$stateParams',
    function ($scope, QuaService, $state, $stateParams) {
    'use strict';

    var vm = $scope;
    var formData = $scope.formData = {},
    pager = vm.pager = {
            pageNumber: 1,
            totalCount: 0, //总条数
            pageSize: 5
          };
   
    /////////////functions///////////////

    

    function init() {
    	 formData.quaLevel = 0;
    	 qualityCompare(formData.quaLevel);
    }
    
    function qualityCompare (type,name,backType,orgId){
    	var params = {
    			type:type,
    			name:name,
    			orgId:orgId
            };
    	QuaService.getQualityCompare(params).then(function (result) {
    		$scope.codeQualityList=result.codeQualityList;
    		if("back"==backType){
    			if( type==1){
    				formData.quaLevel = 2;
    			}else if (type==0){
    				formData.quaLevel = 1;
    			}
    		}else{
	    		if( formData.quaLevel==0){
	    			 formData.quaLevel = 1;
	    		}else if( formData.quaLevel==1){
	    			 formData.quaLevel = 2;
	    			 formData.orgFirId = name;
	    		}else if(formData.quaLevel == 2) {
	    			 formData.quaLevel = 3;
	    		}
    		}
    	});
    };
    ////////////////$scope functions/////////////////


    $scope.getDetail = function(cq){
    	var name;
    	var orgId;
    	if(formData.quaLevel==1){
    		name=cq.orgId;
    		orgId=cq.orgId;
    	}else if(formData.quaLevel==2){
    		name=cq.techChief;
    		orgId=cq.orgId;
    	}
    	qualityCompare(formData.quaLevel,name,null,orgId);
    };

    $scope.backQuaComp = function() {
    	if(formData.quaLevel == 3) {
            qualityCompare(1,formData.orgFirId,"back",formData.orgFirId);
        }else if(formData.quaLevel == 2) {
            qualityCompare(0,null,"back");
        }
    };

    

 
    
    ///////////////////watches//////////////////////////////

    ///////////////////Events///////////////////


    init();

    return vm;

}]);
