mainModule.controller('approvalsTrainingRequestListCtrl', function($scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading) {

    //$scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading
    $rootScope.navHistoryPrevPage = "approvalsNew"
    $scope.searchObj = {}    
    $scope.init = function(){
            $ionicLoading.show();
            $timeout(function () {
            var fd = new FormData();
           
            //fd.append("empId",$scope.employeeId)
            fd.append("buttonRights","Y-Y-Y-Y")
            fd.append("fromRequestOrApprove","APPROVE")
            
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
                           
                            $scope.reporteeEmpList = success.reporteeEmpList
                            //$scope.navigation = success.navigation
                            
                                   
    
                                    $timeout(function () {
                                        // for(i=0;i<$scope.reporteeVacReqList.length;i++){
                                            
                
                                        //   //  $scope.getPhoto(i)
                                                
                  
                                        // }
                                    },200)
                           
                           
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
            $rootScope.FromTrainingRequestList = "false"
            $rootScope.reporteeTrainingToSend = reporteeTraining
            $state.go('approvalsViewTrainingRequestDetails')
        }
        $scope.getPhoto = function (index) {
            
            if ($scope.reporteeEmpList[index] === undefined) {
              return
            }
        
            $scope.reporteeEmpList[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + $scope.reporteeVacReqList[index].empId
            return
          }
        
        
          $scope.redirectOnBack = function(){
              $state.go('app.approvalsMenu')
          }
    
        $scope.init();
    })