mainModule.controller('showExitInterviewCtrl', function ($scope, $rootScope, commonService, $ionicHistory, $window,
    $rootScope, $ionicPopup, $state, $http, $q, $filter, $ionicLoading, addTravelClaimAplication, $timeout,
    $ionicNavBarDelegate, getTravelRuleService, $window) {

     $rootScope.navHistoryPrevPage = "requisitionNew"
    
    $scope.companyId = sessionStorage.getItem('companyId');
    
    $scope.init = function (){
        var fd = new FormData()

        fd.append("companyId",$scope.companyId)
        fd.append("buttonRights","Y-Y-Y-Y")
        fd.append("conMsg","")
        fd.append("menuId","1006")
        fd.append("empId",sessionStorage.getItem("empId"))
        

        $.ajax({
            url: (baseURL + '/transaction/exitInterview/showExitInterview.spr'),
            data: fd,
            type: 'POST',
            async:false,
            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
             },
            success : function(success) {
                //alert("scuc")
                if (!(success.clientResponseMsg=="OK")){
                            console.log(success.clientResponseMsg)
                            handleClientResponse(success.clientResponseMsg,"uploadFileReviewerAjax")
                            $ionicLoading.hide()
                            showAlert("Something went wrong. Please try later.")
                            $scope.redirectOnBack();
                            return
                        }	
                        $scope.eisPersonalVOListCount = success.eisPersonalVOListCount
                        $scope.isHR = success.isHR
                        //alert("LEN  " + success.eisPersonalVOListCount)
                }, 
                error: function (e) { //alert("Server error - " + e);
                    alert(e.status)
                            $ionicLoading.hide()
                           $scope.data_return = {status: e};
                        commonService.getErrorMessage($scope.data_return);
                        
                           }				
                    });	
                }		     


    $scope.show = function()
                {
                       if ($scope.isHR == "N" || $scope.isHR == "" || $scope.isHR === undefined) {
                            $state.go('exitInterviewApplication')
                        }
                        if ($scope.isHR != '' && $scope.isHR == 'No') {
                            $state.go('exitInterviewApplication')
            
                        }
            }
                     
$scope.init();

$scope.redirectOnBack = function(){
    $state.go('app.requestMenu');
};





});