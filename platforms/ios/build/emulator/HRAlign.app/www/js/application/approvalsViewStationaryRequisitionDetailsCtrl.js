mainModule.controller('approvalsViewStationaryRequisitionDetailsCtrl', function($scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading) {

    //$scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading
    $scope.searchObj = {}  
    $scope.stat = $rootScope.stationaryObj   
    $scope.init = function(){
            $ionicLoading.show();
            $timeout(function () {
            var fd = new FormData();
           
            //fd.append("empId",$scope.employeeId)
            fd.append("buttonRights","Y-Y-Y-Y")
            //fd.append("msg","0")
         //  fd.append("message","")
            fd.append("menuId","2710")
            fd.append("stationaryRequisitionId",$scope.stat.stationaryRequisitionId+"");
            //fd.append("rejectConfirm","")
           // fd.append("disableHeader","")
           //fd.append("workFlowApprovalFlag","")
          // fd.append("workFlowRequestFlag","")
            $.ajax({
                url: (baseURL + '/adminHelpDesk/stationaryRequisition/detailsStationaryRequisition.spr'),
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
                           $scope.empDetailslist = success.empDetailslist
                            $scope.stationaryRequisitionForm = success.stationaryRequisitionForm
                            // for(i=0;i<$scope.stationaryRequisitionForm.length;i++){
                            //     for(j=0;j<$scope.stationaryRequisitionForm[i].stationaryRequisitionItems.length;j++){
                            //         $scope.stationaryRequisitionForm[i].stationaryRequisitionItems[j].dateNeeded = $scope.toDateStringForm( $scope.stationaryRequisitionForm[i].stationaryRequisitionItems[j].dateNeeded)
                            //     }
                            // }
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
        
        $scope.openStationaryDetails = function(stationary){
            $rootScope.stationaryObj = stationary
            $state.go('approvalsViewStationaryRequisitionDetails')
        }
        $scope.getPhoto = function (index) {
            
            if ($scope.reporteeEmpList[index] === undefined) {
              return
            }
        
            $scope.reporteeEmpList[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + $scope.reporteeVacReqList[index].empId
            return
          }
        
        
          $scope.redirectOnBack = function(){
              $state.go('approvalsMenu')
          }
          $scope.toDateStringForm=function(datee){
            var date = new Date(datee);
            var day = date.getDate();
            var month = date.getMonth()+1;
            var year = date.getFullYear()
            if(day<10){
                day = '0'+day
            }
            if(month < 10){
                month = '0'+month
            }
            var finalDate = day + "/" + month + "/" + year
            return finalDate;
    
        }
        $scope.goApprove = function(idx,tclaim){
            $timeout(function () {
            for(i=0;i<tclaim.stationaryRequisitionItems.length;i++){
                tclaim.stationaryRequisitionItems[i].quantity = parseInt(document.getElementById("quantity_"+idx+"_"+i).value);
                tclaim.stationaryRequisitionItems[i].dateNeeded = new Date(document.getElementById("quantity_"+idx+"_"+i).value)
                tclaim.stationaryRequisitionItems[i].approverRemarks = document.getElementById("appRemarks_"+idx+"_"+i).value
                tclaim.stationaryRequisitionItems[i].itemApprovalStatus = document.getElementById("action_"+idx+"_"+i).value
            }

            fd.append("stForm",tclaim);
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to Approve ?', //Message
            });
            confirmPopup.then(function(res){
                $.ajax({
                    url: (baseURL + '/adminHelpDesk/stationaryRequisition/approveAllStationaryRequisition.spr'),
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
                        if(!(success.clientResponseMsg=="OK")){
                            console.log(success.clientResponseMsg)
                            handleClientResponse(success.clientResponseMsg,"uploadFileReviewerAjax")
                            $ionicLoading.hide()
                            
                            showAlert("Something went wrong. Please try later.")
                            //$scope.redirectOnBack();
                            return
                        }
                        //alert("scuc")
                        $ionicLoading.hide()
                        showAlert("Rejected Successfully")
                       
                       $state.go('approvalsVacancyRequisitionList')
                                
                                    
                    },
                    error: function (e) { //alert("Server error - " + e);
                    //alert(e.status)
                            $ionicLoading.hide()
                           $scope.data_return = {status: e};
                        commonService.getErrorMessage($scope.data_return);
                        
                           }				
                    });	
                });    
            },500)
        }
        $scope.init();
    })