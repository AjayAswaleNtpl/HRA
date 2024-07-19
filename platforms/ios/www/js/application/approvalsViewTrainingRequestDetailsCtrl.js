mainModule.controller('approvalsViewTrainingRequestDetailsCtrl', function($scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading) {

    //$scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading
    $rootScope.navHistoryPrevPage = "approvalsTrainingRequestList"    
    $scope.trainingEmployee = $rootScope.reporteeTrainingToSend
    $scope.init = function(){
            $ionicLoading.show();
            $timeout(function () {
            var fd = new FormData();
           
            //fd.append("empId",$scope.employeeId)
            fd.append("buttonRights","Y-Y-Y-Y")
            fd.append("trainingNeedIdentificationId",$scope.trainingEmployee.trainingNeedIdentificationId+"")
            fd.append("status",$scope.trainingEmployee.status)
            fd.append("mailType","APPROVER")
            //fd.append("msg","0")
         //  fd.append("message","")
            fd.append("menuId","637")
            //fd.append("rejectConfirm","")
           // fd.append("disableHeader","")
           //fd.append("workFlowApprovalFlag","")
          // fd.append("workFlowRequestFlag","")
            $.ajax({
                url: (baseURL + '/training/trainingRequest/viewTrainingRequestApprove.spr'),
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
                           
                            $scope.trainingListPresent = success.ret
                            //$scope.navigation = success.navigation
                            if ($scope.trainingListPresent[0].approverRmks){
                                $scope.trainingListPresent[0].approverRmks = $scope.trainingListPresent[0].approverRmks.replace(/<br>/g, "\n")
                                $scope.trainingListPresent[0].approverRmks = $scope.trainingListPresent[0].approverRmks.replace(/<br\/>/g, "\n")
                            }
                            // if ($scope.trainingListPresent.trainingRequestStatus != "SENT FOR APPROVAL"){
                            //     document.getElementById("approverRmks").disabled = true 
                            // }
                            $timeout(function(){
                            if ($rootScope.FromTrainingRequestList == 'true'){
                                document.getElementById('btns').style.visibility='hidden'
                            }
                            }, 500);
                            $ionicLoading.hide();
               },
                error: function (e) { //alert("Server error - " + e);
                //alert(e.status)
                        $ionicLoading.hide()
                       $scope.data_return = {status: e};
                    commonService.getErrorMessage($scope.data_return);
                    
                       }				
                });	
            },500);		
    
        }
        
       
        $scope.goApprove = function(){

            if(document.getElementById("approverRmks").value == "" && 
            trainingListPresent[0].trainingRequestStatus =='SENT FOR APPROVAL'){
                showAlert("Please enter approver remarks")
                return
            }
            if($scope.approverList){
                if($scope.approverList.length > 0){
                    if(document.getElementById("approverId")){
                    if(document.getElementById("approverId").value =="" || document.getElementById("approverId").value =="-1"){
                        showAlert("Please select Approver on next level!")
                        return
                    }
                }
                }
            }
            $timeout(function () {

                var fd = new FormData();
                fd.append("trainingNeedIdentificationId",parseInt($scope.trainingEmployee.trainingNeedIdentificationId))
                fd.append("buttonRights","Y-Y-Y-Y")
                fd.append("menuId","637")
                fd.append("approverRmks",document.getElementById("approverRmks").value)
                /*fd.append("companyName",$scope.vacancyRequisitionVO.companyName)
                fd.append("locationName",$scope.vacancyRequisitionVO.locationName)
                fd.append("jpName",$scope.vacancyRequisitionVO.jpName)
                fd.append("gradeName",$scope.vacancyRequisitionVO.gradeName)
                fd.append("reqDeptName",$scope.vacancyRequisitionVO.reqDeptName)
                fd.append("empTypeName",$scope.vacancyRequisitionVO.empTypeName)
                fd.append("reportingToName",$scope.vacancyRequisitionVO.reportingToName)
                fd.append("cityName",$scope.vacancyRequisitionVO.cityName)
                fd.append("gender",$scope.vacancyRequisitionVO.gender)
                fd.append("dayByWhichPosNeed",$scope.vacancyRequisitionVO.dayByWhichPosNeed)
                fd.append("proposedDesgName",$scope.vacancyRequisitionVO.proposedDesgName)
                fd.append("addQualifiEssName",$scope.vacancyRequisitionVO.addQualifiEssName)
                fd.append("experReqFrom",$scope.vacancyRequisitionVO.experReqFrom)
                fd.append("experReqTo",$scope.vacancyRequisitionVO.experReqTo)
                fd.append("functExprReq",$scope.vacancyRequisitionVO.functExprReq)
                fd.append("ageRangeFrom",$scope.vacancyRequisitionVO.ageRangeFrom)
                fd.append("ageRangeTo",$scope.vacancyRequisitionVO.ageRangeTo)
                fd.append("ctcFrom",$scope.vacancyRequisitionVO.ctcFrom)
                fd.append("ctcTo",$scope.vacancyRequisitionVO.ctcTo)
                fd.append("noOfPosition",$scope.vacancyRequisitionVO.noOfPosition)
                fd.append("altMenuName",$scope.vacancyRequisitionVO.altMenuName)
                fd.append("remarks1",$scope.vacancyRequisitionVO.remarks1)
                fd.append("remarks2",$scope.vacancyRequisitionVO.remarks2)
                fd.append("remarks3",$scope.vacancyRequisitionVO.remarks3)
                fd.append("remarks4",$scope.vacancyRequisitionVO.remarks4)
                fd.append("remarks5",$scope.vacancyRequisitionVO.remarks5)
                fd.append("approverList",$scope.approverList)
                fd.append("positionReqName",$scope.vacancyRequisitionVO.positionReqName)
                fd.append("empName",$scope.vacancyRequisitionVO.empName)
                fd.append("jobDescOfPosition",$scope.vacancyRequisitionVO.jobDescOfPosition)
                fd.append("fileName",$scope.vacancyRequisitionVO.fileName)
                fd.append("fileName2",$scope.vacancyRequisitionVO.fileName2)
                fd.append("fileName3",$scope.vacancyRequisitionVO.fileName3)
                fd.append("fileName4",$scope.vacancyRequisitionVO.fileName4)
                fd.append("fileName5",$scope.vacancyRequisitionVO.fileName5)
                fd.append("remarks",$scope.vacancyRequisitionVO.remarks)
                fd.append("approverRmks",document.getElementById("approverRmks").value)*/
               // fd.append("jobDescOfPosition",$scope.vacancyRequisitionVO.jobDescOfPosition)
               var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to Approve ?', //Message
            });
            confirmPopup.then(function(res){
                if(res){

                
                $.ajax({
                    url: (baseURL + '/training/trainingRequest/approveApp.spr'),                   
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
                        $ionicLoading.hide();
                        showAlert("Approved Successfully")
                       
                       $state.go('approvalsTrainingRequestList')
                                
                                    
                    },
                    error: function (e) { //alert("Server error - " + e);
                    alert(e.status)
                            $ionicLoading.hide()
                           $scope.data_return = {status: e};
                        commonService.getErrorMessage($scope.data_return);
                        
                           }				
                    });	
                }
                });    

            },500)
        }
        $scope.goReject = function(){
          
            $timeout(function () {

                var fd = new FormData();
                fd.append("trainingNeedIdentificationId",parseInt($scope.trainingEmployee.trainingNeedIdentificationId))
                fd.append("buttonRights","Y-Y-Y-Y")
                fd.append("menuId","637")
                fd.append("approverRmks",document.getElementById("approverRmks").value)
                /*fd.append("companyName",$scope.vacancyRequisitionVO.companyName)
                fd.append("locationName",$scope.vacancyRequisitionVO.locationName)
                fd.append("jpName",$scope.vacancyRequisitionVO.jpName)
                fd.append("gradeName",$scope.vacancyRequisitionVO.gradeName)
                fd.append("reqDeptName",$scope.vacancyRequisitionVO.reqDeptName)
                fd.append("empTypeName",$scope.vacancyRequisitionVO.empTypeName)
                fd.append("reportingToName",$scope.vacancyRequisitionVO.reportingToName)
                fd.append("cityName",$scope.vacancyRequisitionVO.cityName)
                fd.append("gender",$scope.vacancyRequisitionVO.gender)
                fd.append("dayByWhichPosNeed",$scope.vacancyRequisitionVO.dayByWhichPosNeed)
                fd.append("proposedDesgName",$scope.vacancyRequisitionVO.proposedDesgName)
                fd.append("addQualifiEssName",$scope.vacancyRequisitionVO.addQualifiEssName)
                fd.append("experReqFrom",$scope.vacancyRequisitionVO.experReqFrom)
                fd.append("experReqTo",$scope.vacancyRequisitionVO.experReqTo)
                fd.append("functExprReq",$scope.vacancyRequisitionVO.functExprReq)
                fd.append("ageRangeFrom",$scope.vacancyRequisitionVO.ageRangeFrom)
                fd.append("ageRangeTo",$scope.vacancyRequisitionVO.ageRangeTo)
                fd.append("ctcFrom",$scope.vacancyRequisitionVO.ctcFrom)
                fd.append("ctcTo",$scope.vacancyRequisitionVO.ctcTo)
                fd.append("noOfPosition",$scope.vacancyRequisitionVO.noOfPosition)
                fd.append("altMenuName",$scope.vacancyRequisitionVO.altMenuName)
                fd.append("remarks1",$scope.vacancyRequisitionVO.remarks1)
                fd.append("remarks2",$scope.vacancyRequisitionVO.remarks2)
                fd.append("remarks3",$scope.vacancyRequisitionVO.remarks3)
                fd.append("remarks4",$scope.vacancyRequisitionVO.remarks4)
                fd.append("remarks5",$scope.vacancyRequisitionVO.remarks5)
                fd.append("approverList",$scope.approverList)
                fd.append("positionReqName",$scope.vacancyRequisitionVO.positionReqName)
                fd.append("empName",$scope.vacancyRequisitionVO.empName)
                fd.append("jobDescOfPosition",$scope.vacancyRequisitionVO.jobDescOfPosition)
                fd.append("fileName",$scope.vacancyRequisitionVO.fileName)
                fd.append("fileName2",$scope.vacancyRequisitionVO.fileName2)
                fd.append("fileName3",$scope.vacancyRequisitionVO.fileName3)
                fd.append("fileName4",$scope.vacancyRequisitionVO.fileName4)
                fd.append("fileName5",$scope.vacancyRequisitionVO.fileName5)
                fd.append("remarks",$scope.vacancyRequisitionVO.remarks)
                fd.append("approverRmks",document.getElementById("approverRmks").value)*/
               // fd.append("jobDescOfPosition",$scope.vacancyRequisitionVO.jobDescOfPosition)
               var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to Reject ?', //Message
            });
            confirmPopup.then(function(res){
                if(res){
                $.ajax({
                    url: (baseURL + '/training/trainingRequest/rejectApp.spr'),                   
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
                       
                        $state.go('approvalsTrainingRequestList')
                                
                                    
                    },
                    error: function (e) { //alert("Server error - " + e);
                    //alert(e.status)
                            $ionicLoading.hide()
                           $scope.data_return = {status: e};
                        commonService.getErrorMessage($scope.data_return);
                        
                           }				
                    });	
                }
                });    

            },500)
        }
        $scope.getPhoto = function (index) {
            
            if ($scope.reporteeVacReqList[index] === undefined) {
              return
            }
        
            $scope.reporteeVacReqList[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + $scope.reporteeVacReqList[index].empId
            return
          }
        
        
          $scope.redirectOnBack = function(){
            if ($rootScope.FromTrainingRequestList == 'true'){
                $state.go('requestTrainingRequestList')
                return
            }      
              $state.go('approvalsTrainingRequestList')
          }
    
        $scope.init();
        
    })