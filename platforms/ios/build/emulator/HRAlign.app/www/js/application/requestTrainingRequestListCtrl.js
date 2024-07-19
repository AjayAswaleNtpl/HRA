mainModule.controller('requestTrainingRequestListCtrl', function($scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading) {

    //$scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading
    $rootScope.navHistoryPrevPage = "requisitionNew"
    $scope.searchObj = {}    
    $scope.init = function(){
            $ionicLoading.show();
            $timeout(function () {
            var fd = new FormData();
           
            //fd.append("empId",$scope.employeeId)
            fd.append("buttonRights","Y-Y-Y-Y")
            fd.append("fromRequestOrApprove","REQUEST")
            //fd.append("msg","0")
         //  fd.append("message","")
            fd.append("menuId","637")
            //fd.append("rejectConfirm","")
           // fd.append("disableHeader","")
           //fd.append("workFlowApprovalFlag","")
          // fd.append("workFlowRequestFlag","")
            $.ajax({
                url: (baseURL + '/training/trainingRequest/viewTrainingRequest.spr'),
                data: fd,
                type: 'POST',
                async:false,
                timeout: commonRequestTimeout,
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
                                //$scope.redirectOnBack();
                                return
                            }	
                           
                            $scope.selfList = success.empTrainingListSP
                            //$scope.navigation = success.navigation
                    
                            $ionicLoading.hide();
    
                },
                error: function (e) { //alert("Server error - " + e);
                alert(e.status)
                        $ionicLoading.hide()
                       $scope.data_return = {status: e};
                    commonService.getErrorMessage($scope.data_return);
                    
                       }				
                });	
            },500);		
    
        }
        
        $scope.openTrainingRequestDetails = function(idx,reporteeTraining){
            $rootScope.reporteeTrainingToSend = reporteeTraining
            $rootScope.FromTrainingRequestList = 'true'
            $state.go('approvalsViewTrainingRequestDetails')
        }
        $scope.getPhoto = function (index) {
            
            if ($scope.selfList[index] === undefined) {
              return
            }
        
            $scope.selfList[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + $scope.reporteeVacReqList[index].empId
            return
          }
        
        
          $scope.redirectOnBack = function(){
              $state.go('app.requestMenu')
          }

          $scope.reDirectToFreshTrainingPage   = function(){
            $state.go('addTrainingRequest')
          }
    
        $scope.init();
    })