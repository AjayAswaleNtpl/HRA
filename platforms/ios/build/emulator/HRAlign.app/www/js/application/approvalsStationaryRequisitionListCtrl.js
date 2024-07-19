mainModule.controller('approvalsStationaryRequisitionListCtrl', function($scope,$filter,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading) {

    //$scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading
    $rootScope.navHistoryPrevPage = "approvalsNew"
    $scope.searchObj = {}    
    $scope.init = function(){
            $ionicLoading.show();
            $timeout(function () {
            var fd = new FormData();
           
            //fd.append("empId",$scope.employeeId)
            fd.append("buttonRights","Y-Y-Y-Y")
            //fd.append("msg","0")
         //  fd.append("message","")
            fd.append("menuId","2710")
            //fd.append("rejectConfirm","")
           // fd.append("disableHeader","")
           //fd.append("workFlowApprovalFlag","")
          // fd.append("workFlowRequestFlag","")
            $.ajax({
                url: (baseURL + '/adminHelpDesk/stationaryRequisition/viewStationaryRequisition.spr'),
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
                           
                            $scope.stationaryRequisitionForm = success.stationaryRequisitionForm
                            for(i=0;i<$scope.stationaryRequisitionForm.length;i++){
                                for(j=0;j<$scope.stationaryRequisitionForm[i].stationaryRequisitionItems.length;j++){
                                    $scope.stationaryRequisitionForm[i].stationaryRequisitionItems[j].dateNeeded = $scope.toDateStringForm( $scope.stationaryRequisitionForm[i].stationaryRequisitionItems[j].dateNeeded)
                                }
                            }
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
              $state.go('app.approvalsMenu')
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
                tclaim.stationaryRequisitionItems[i].dateNeededStr = document.getElementById("dateNeeded_"+idx+"_"+i).value
                tclaim.stationaryRequisitionItems[i].dateNeeded = null // new Date(document.getElementById("dateNeeded_"+idx+"_"+i).value)
                tclaim.stationaryRequisitionItems[i].approverRemarks = document.getElementById("appRemarks_"+idx+"_"+i).value
                tclaim.stationaryRequisitionItems[i].itemApprovalStatus = document.getElementById("action_"+idx+"_"+i).value
            }
            var dateee = tclaim.requiesitionDate.split("-")
            tclaim.requiesitionDateStr = dateee[2]+"/"+dateee[1]+"/"+dateee[0]
            tclaim.requiesitionDate = null
            var fd = new FormData();
            fd.append("menuId","2710")
            fd.append("buttonRights","Y-Y-Y-Y")
            fd.append("stForm",JSON.stringify(tclaim));
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to Approve ?', //Message
            });
            confirmPopup.then(function(res){
                if(res){
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
                        showAlert("Approved Successfully")
                       
                       $scope.init();
                                
                                    
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
        $scope.goReject = function(idx,tclaim){
            $timeout(function () {
            for(i=0;i<tclaim.stationaryRequisitionItems.length;i++){

                tclaim.stationaryRequisitionItems[i].quantity = parseInt(document.getElementById("quantity_"+idx+"_"+i).value);
                tclaim.stationaryRequisitionItems[i].dateNeededStr = document.getElementById("dateNeeded_"+idx+"_"+i).value
                tclaim.stationaryRequisitionItems[i].dateNeeded = null // new Date(document.getElementById("dateNeeded_"+idx+"_"+i).value)
                tclaim.stationaryRequisitionItems[i].approverRemarks = document.getElementById("appRemarks_"+idx+"_"+i).value
                tclaim.stationaryRequisitionItems[i].itemApprovalStatus = document.getElementById("action_"+idx+"_"+i).value
            }
            var dateee = tclaim.requiesitionDate.split("-")
            tclaim.requiesitionDateStr = dateee[2]+"/"+dateee[1]+"/"+dateee[0]
            tclaim.requiesitionDate = null
            var fd = new FormData();
            fd.append("menuId","2710")
            fd.append("buttonRights","Y-Y-Y-Y")
            fd.append("stForm",JSON.stringify(tclaim));
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to Reject ?', //Message
            });
            confirmPopup.then(function(res){
                if(res){
                $.ajax({
                    url: (baseURL + '/adminHelpDesk/stationaryRequisition/rejectAllStationaryRequisition.spr'),
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
                       
                       $scope.init();
                                
                                    
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
        $scope.setDate = function (outer,inner) {
            var date;
    
            
                date = new Date();
           
    
            var options = {date: date, mode: 'date', titleText: 'Date', androidTheme: 4};
            datePicker.show(options, function (date) {
                if (date == undefined) {
    
                }
                else {
    
                    $scope.fDate = date;
                    document.getElementById('dateNeeded_'+outer+'_'+inner).value = $filter('date')(date, 'dd/MM/yyyy');
                    $scope.date = $filter('date')(date, 'dd-MM-yyyy');
                   // document.getElementById('totalHrs').value = ""
                    //$scope.init();
    
                    if (!$scope.$$phase)
                        $scope.$apply()
    
                }
            }, function (error, status) {
                $ionicLoading.hide();
            });
        }

        $scope.init();
    })