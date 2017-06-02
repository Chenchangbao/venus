angular.module('sncd').controller('JumpOldCtrl', ['$scope', 'baseUrl', '$state','$stateParams',
    function ($scope,baseUrl,$state,$stateParams) {
        'use strict';

        var vm = $scope;
       
       
        /////////////functions///////////////

       

        function init() {
        	
        	
        	
        	$scope.url=baseUrl + '/' + decodeURIComponent($stateParams.href);
        }
        
        
        
                
       
        ////////////////$scope functions/////////////////

       
        
        ///////////////////watches//////////////////////////////

        ///////////////////Events///////////////////

        init();

        return vm;

    }
]);
