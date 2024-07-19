mainModule.controller('approvalsViewOfferGenerationDetailsCtrl', function($scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading) {

    //$scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading
    
    $scope.offer = $rootScope.offerList   
    $scope.init = function(){
            $ionicLoading.show();
            $timeout(function () {
            var fd = new FormData();
           
            //fd.append("empId",$scope.employeeId)
            fd.append("buttonRights","Y-Y-Y-Y")
            fd.append("offerLetterGenId",$scope.offer.offerLetterGenId+"")
            fd.append("status",$scope.offer.status)
            fd.append("mailType","APPROVER")
            //fd.append("msg","0")
         //  fd.append("message","")
            fd.append("menuId","2527")
            //fd.append("rejectConfirm","")
           // fd.append("disableHeader","")
           //fd.append("workFlowApprovalFlag","")
          // fd.append("workFlowRequestFlag","")
            $.ajax({
                url: (baseURL + '/rms/offerLetterGeneration/viewOfferLetterApprove.spr'),
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
                           
                            $scope.offerLetterVO = success.offerLetterVOToFetch.offerLetterVO
                            $scope.approverList = success.approverList
                            $scope.altMenuName = success.altMenuName
                            $scope.companyList = success.companyList
                            //$scope.loginId = success.loginId
                            $scope.status = success.status
                            $scope.mailType = success.mailType
                            $scope.offerLetterVOs = success.offerLetterVOs
                            if(success.navigation){
                                $scope.navigation = success.navigation
                            }
                            if(success.level){
                                $scope.level = success.level
                            }
                            if(success.empIds){
                                $scope.empIds = success.empIds
                            }
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
        $scope.openOfferLetter = function(id){
            var fd = new FormData();
            fd.append("offerLetterGenId1",id+"")
            //fd.append("attachFileName",name)
        
        
        $.ajax({
                url: baseURL + '/rms/candidateOfferStatus/openFileOffer.spr',
                data: fd,
                type: 'POST',
                timeout: commonRequestTimeout,
                contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                processData: false, // NEEDED, DON'T OMIT THIS
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                    },
                success : function(result) {
                    if (!(result.clientResponseMsg=="OK")){
                                console.log(result.clientResponseMsg)
                                handleClientResponse(result.clientResponseMsg,"openFileMobile")
                                $ionicLoading.hide()
                                showAlert("Something went wrong. Please try later.")
                                return
                            }	
                            $scope.FileParmsObject = {}
                            $scope.FileParmsObject.uploadFile = result.uploadFile
                            $scope.FileParmsObject.uploadContentType = result.uploadContentType
                            $scope.FileParmsObject.uploadFileName = result.uploadFileName
                            
                            
                            $scope.downloadAttachmnent($scope.FileParmsObject)
                            $ionicLoading.hide()
                },
                error : function(res){
                            $ionicLoading.hide()
                            showAlert("Something went wrong while fetching the file.");
                }
                
                });
    
        }
        $scope.downloadAttachmnent = function (travel) {

            var strData = travel.uploadFile
            //var strUrlPrefix='data:"application/pdf;base64,'
            var strUrlPrefix = 'data:' + travel.uploadContentType + ";base64,"
            var url = strUrlPrefix + strData
            var blob = base64toBlob(strData, travel.uploadContentType)
            downloadFileFromData(travel.uploadFileName, blob, travel.uploadContentType)
            event.stopPropagation();
          }
        $scope.goApprove = function(){
            if(document.getElementById("approverRmks").value == ""){
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
                fd.append("offerLetterGenId",$scope.offer.offerLetterGenId+"")
                fd.append("buttonRights","Y-Y-Y-Y")
                fd.append("menuId","2527")
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
                    url: (baseURL + '/rms/offerLetterGeneration/approveOfferLetterReq.spr'),                   
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
                       
                       $state.go('approvalsOfferGenerationList')
                                
                                    
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
                fd.append("offerLetterGenId",$scope.offer.offerLetterGenId+"")
                fd.append("buttonRights","Y-Y-Y-Y")
                fd.append("menuId","2527")
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
                    url: (baseURL + '/rms/offerLetterGeneration/rejectOfferLetterReq.spr'),                   
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
                       
                       $state.go('approvalsOfferGenerationList')
                                
                                    
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
              $state.go('approvalsOfferGenerationList')
          }
    
        $scope.init();
        
    })