mainModule.factory("getTravelApplicationListService", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/travelApplication/getTravelApplicationList.spr'), {}, {
      'save': {
        method: 'POST',
        timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
      }
    }, {});
  }]);
  mainModule.factory("viewLeaveApplicationService", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/leaveApplication/viewLeaveApplication.spr'), {}, {
      'save': {
        method: 'POST',
        timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
      }
    }, {});
  }]);
  mainModule.factory("detailsService", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/leaveApplication/details.spr'), {}, {
      'save': {
        method: 'POST',
        timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
      }
    }, {});
  }]);
  mainModule.controller('requestLeaveListCtrl', function ($scope, $rootScope, $filter, commonService, $state, getYearListService, $ionicPopup, viewODApplicationService, sendODRequestService, getSetService, $ionicLoading, $ionicModal, cancelODRequestService, viewLeaveApplicationService, detailsService, viewMissPunchApplicationService,
    viewShiftChangeApplicationService, getTravelApplicationListService, addClaimFormService, travelClaimDataService, viewClaimFormService, viewRequisitionApprovalService, sendForCancellation){
      $rootScope.navHistoryPrevPage = "requisitionNew" 
      $scope.requesObject = {}
        $scope.requesObjectForMonth = {};
        $scope.requesObjectForYear = {};
        $scope.requesObjectForMonth.month = ''
        $scope.requesObjectForYear.yearId = ''
        $scope.searchObj = {}
        $scope.searchObj.searchQuery = '';
        $scope.searchObj.searchRegular = ''
        $scope.searchObj.searchOD = ''
        $scope.searchObj.searchShift = ''
  
        $scope.requesObject1 = {};
        $scope.sendrequesObject = {}
        $scope.requesObject = {}
        $scope.selectedValues = {}
        $scope.IsLeaveAccessible = sessionStorage.getItem('IsLeaveAccessible');

        $scope.refreshLeaveList = function () {
            $scope.leaveListFetched = false
            $scope.getLeaveRequestList()
        
          }

        $scope.redirectOnBack = function () {
            $state.go('app.requestMenu');
            //$ionicNavBarDelegate.back();
        }
        
        $scope.leaveListFetched = false
        if (sessionStorage.getItem('IsLeaveAccessible') != false) {
            var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
            $scope.requesObject.menuId = leaveMenuInfo.menuId;
            //alert("leave " + $scope.requesObject.menuId)
            $scope.requesObject.buttonRights = "Y-Y-Y-Y"
            $scope.requesObject.formName = "Leave"
            
            //$scope.IsLeaveAccessible = 'true'
          }
          if ($scope.IsLeaveAccessible != false) {
            var leaveMenuInfo = getMenuInformation("Attendance Management", "Leave Application");
            $scope.requesObject.menuId = leaveMenuInfo.menuId;
            $scope.requesObject.buttonRights = "Y-Y-Y-Y"
            $scope.requesObject.formName = "Leave"
            
            
          }
          $scope.getLeaveRequestList = function () {
            $scope.searchObj = '';
             $ionicLoading.show();
            $scope.requesObjectForYear.yearId = ''
            
            
            $rootScope.reqestPageLastTab = "LEAVE"
        
            if ($scope.leaveListFetched == true) {
                $ionicLoading.hide()
              return;
            }
        
              
            $scope.leaveListFetched = true
            
            $scope.requesObject.SelfRequestListFlag = 1;
            var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
            $scope.requesObject.menuId = leaveMenuInfo.menuId;;
            $ionicLoading.show();
            $scope.viewLeaveApplicationService = new viewLeaveApplicationService();
            $scope.viewLeaveApplicationService.$save($scope.requesObject, function (data) {
              if (!(data.clientResponseMsg == "OK")) {
                handleClientResponse(data.clientResponseMsg, "viewLeaveApplicationService")
              }
        
              $scope.requesObjectForMonth.month = ''
              $scope.leaveApplList = []
              if (data.selfLeaveList == undefined) {
                $ionicLoading.hide();
              } else if (data.selfLeaveList.length == 0) {
                $ionicLoading.hide();
              } else {
                $scope.leaveApplList = data.selfLeaveList
                $scope.createDate = data.selfLeaveList[0].createDate;
              }
              for (var i = 0; i < $scope.leaveApplList.length; i++) {
                $scope.leaveFromFormatedDate = $scope.leaveApplList[i].leaveFromDate.split('/')
                $scope.leaveApplList[i].leaveFromDate = new Date($scope.leaveFromFormatedDate[2] + '/' + $scope.leaveFromFormatedDate[1] + '/' + $scope.leaveFromFormatedDate[0])
                $scope.leaveToFormatedDate = $scope.leaveApplList[i].leaveToDate.split('/')
                $scope.leaveApplList[i].leaveToDate = new Date($scope.leaveToFormatedDate[2] + '/' + $scope.leaveToFormatedDate[1] + '/' + $scope.leaveToFormatedDate[0])
                if ($scope.leaveApplList[i].leaveFromDate.getTime() == $scope.leaveApplList[i].leaveToDate.getTime()) {
                  $scope.leaveApplList[i].leaveDate = $scope.leaveApplList[i].leaveFromDate;
                }
                
                if ($scope.leaveApplList[i].approverRemark) {
                  $scope.leaveApplList[i].approverRemark = $scope.leaveApplList[i].approverRemark.replace(/<br>/g, "\n")
                  $scope.leaveApplList[i].approverRemark = $scope.leaveApplList[i].approverRemark.replace(/<BR>/g, "\n")
                  $scope.leaveApplList[i].approverRemark = $scope.leaveApplList[i].approverRemark.replace(/&#13;/g, "\n")
                  $scope.leaveApplList[i].approverRemark = $scope.leaveApplList[i].approverRemark.replace(/&#10;/g, "\n")
                }
                
              }
              for (var i = 0; i < $scope.leaveApplList.length; i++) {
                $scope.leaveApplList[i].designation = sessionStorage.getItem('designation')
                $scope.leaveApplList[i].department = sessionStorage.getItem('department');
                $scope.leaveApplList[i].empName = sessionStorage.getItem('empName');
                $scope.leaveApplList[i].name = sessionStorage.getItem('empName');
                if (sessionStorage.getItem('photoFileName')) {
                  $scope.leaveApplList[i].photoFileName = sessionStorage.getItem('photoFileName')
                  $scope.leaveApplList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
                }
                else {
                  $scope.leaveApplList[i].photoFileName = ''
                  $scope.leaveApplList[i].profilePhoto = ''
                }
        
        
              }
              $ionicLoading.hide()
              
            }, function (data, status) {
              autoRetryCounter = 0
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
        
            });
          }

          $scope.detailInfoReporty = function (transid, leaveOBJ) {
    
            $ionicLoading.show();
            $scope.leaveOBJ = leaveOBJ
            $scope.detailResObject = {}
            $scope.detailResObject.leaveTransId = transid
        
            var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
            $scope.detailResObject.menuId = leaveMenuInfo.menuId;
        
            $scope.detailResObject.buttonRights = "Y-Y-Y-Y"
            $scope.detailsService = new detailsService();
            $scope.detailsService.$save($scope.detailResObject, function (data) {
              if (!(data.clientResponseMsg == "OK")) {
                console.log(data.clientResponseMsg)
                handleClientResponse(data.clientResponseMsg, "detailsService")
              }
              if (getMyHrapiVersionNumber() >= 33){
                $scope.sendrequesObject.leaveApplyDetail = data.leaveAppVo
              $scope.sendrequesObject.leaveReason = data.leaveAppVo.leaveReason
              $scope.sendrequesObject.status = data.leaveAppVo.leaveStatus
              $scope.sendrequesObject.title = data.leaveAppVo
              $scope.sendrequesObject.name = data.leaveAppVo.name
              $scope.sendrequesObject.leaveFromDate = data.leaveAppVo.leaveFromDate
              $scope.sendrequesObject.leaveToDate = data.leaveAppVo.leaveToDate
              $scope.sendrequesObject.phoneNo = data.leaveAppVo.phone
              $scope.sendrequesObject.toLeaveType = data.leaveAppVo.toLeaveType
              $scope.sendrequesObject.fromLeaveType = data.leaveAppVo.fromLeaveType
              }else{
                $scope.sendrequesObject.leaveApplyDetail = data.form.leaveAppVo
                $scope.sendrequesObject.leaveReason = data.form.leaveAppVo.leaveReason
                $scope.sendrequesObject.status = data.form.leaveAppVo.leaveStatus
                $scope.sendrequesObject.title = data.form.leaveAppVo
                $scope.sendrequesObject.name = data.form.leaveAppVo.name
                $scope.sendrequesObject.leaveFromDate = data.form.leaveAppVo.leaveFromDate
                $scope.sendrequesObject.leaveToDate = data.form.leaveAppVo.leaveToDate
                $scope.sendrequesObject.phoneNo = data.form.leaveAppVo.phone
                $scope.sendrequesObject.toLeaveType = data.form.leaveAppVo.toLeaveType
                $scope.sendrequesObject.fromLeaveType = data.form.leaveAppVo.fromLeaveType
              }
              $scope.sendrequesObject.address = $scope.sendrequesObject.leaveApplyDetail.address
              $scope.sendrequesObject.phoneNo = sessionStorage.getItem('phoneNumber')
              $scope.sendrequesObject.leaveTransId = transid
              $scope.sendrequesObject.empId = sessionStorage.getItem('empId')
              $scope.sendrequesObject.name = $scope.sendrequesObject.leaveApplyDetail.name
              $scope.sendrequesObject.remarks = $scope.sendrequesObject.leaveApplyDetail.remarks
              var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
              $scope.sendrequesObject.menuId = leaveMenuInfo.menuId;
              $scope.sendrequesObject.leaveTypeId = $scope.sendrequesObject.leaveApplyDetail.leaveTypeId
              $scope.sendrequesObject.leaveBalBefore = $scope.sendrequesObject.leaveApplyDetail.leaveBalBefore
              $scope.sendrequesObject.noDaysCounted = $scope.sendrequesObject.leaveApplyDetail.noDaysCounted
              $scope.sendrequesObject.leaveType = $scope.leaveOBJ.leaveType
              $scope.sendrequesObject.fromLvHr = $scope.sendrequesObject.leaveApplyDetail.fromLvHr
              $scope.sendrequesObject.toLvHr = $scope.sendrequesObject.leaveApplyDetail.toLvHr
              $scope.sendrequesObject.noOfDays = $scope.sendrequesObject.leaveApplyDetail.noOfDays
              $scope.sendrequesObject.leaveLeastCountMsg = $scope.sendrequesObject.leaveApplyDetail.leaveLeastCountMsg
              $scope.sendrequesObject.leaveApproved = $scope.sendrequesObject.leaveApplyDetail.leaveApproved
              $scope.sendrequesObject.leaveInProcess = $scope.sendrequesObject.leaveApplyDetail.leaveInProcess
              $scope.sendrequesObject.currentBalance = $scope.sendrequesObject.leaveApplyDetail.currentBalance
              $scope.sendrequesObject.afterBalance = $scope.sendrequesObject.leaveApplyDetail.afterBalance
              $scope.sendrequesObject.email = $scope.sendrequesObject.leaveApplyDetail.email
              getSetService.set($scope.sendrequesObject)
              $state.go('LeaveDetailPage')
              $ionicLoading.hide()
            }, function (data, status) {
              autoRetryCounter = 0
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
            });
          }
          $scope.openFileLeave = function(leave){
		
		
            //event.stopPropagation();
            $scope.reqObj = {}
            $scope.reqObj.leaveTransId = leave.leaveTransId
            //alert(fileId)
            var fd = new FormData();
            fd.append("transId",$scope.reqObj.leaveTransId)
            
            
            $.ajax({
                    url: baseURL + '/api/leaveApplication/openFileMobile.spr',
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
          $scope.refreshLeaveList = function () {
            $scope.leaveListFetched = false
            $scope.getLeaveRequestList()
        
          }
          $scope.reDirectToFreshLeavePage = function () {
            $state.go('leaveApplication')
          }
          $scope.goToApprovals = function(){
            $state.go("approvalLeaveList")
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
          $scope.getRequestCounts = function () {
            $ionicLoading.show();
            $scope.viewRequisitionApprovalService = new viewRequisitionApprovalService();
            $scope.viewRequisitionApprovalService.$save(function (data) {
              if (!(data.clientResponseMsg == "OK")) {
                console.log(data.clientResponseMsg)
                handleClientResponse(data.clientResponseMsg, "viewRequisitionApprovalService")
              }
              if (sessionStorage.getItem('IsShiftChangeAccessible') == 'true') {
                $scope.shiftChangeInProcess = data.listShiftObj.inProcess
                $scope.shiftChangeInProcessApproval = data.approvalShiftObj.inProcess
              } else {
                $scope.shiftChangeInProcess = '0';
                $scope.shiftChangeInProcessApproval = '0';
              }
              if (sessionStorage.getItem('IsLeaveAccessible') == 'true') {
                $scope.approvalLeave = data.approvalLeave.inProcess;
                $scope.leaveInprocessCount = data.leaveApllication.totalInProcess
              } else {
                $scope.approvalLeave = '0';
                $scope.leaveInprocessCount = '0';
              }
              if (sessionStorage.getItem('IsODAccessible') == 'true') {
                $scope.approvalOdApplication = data.approvalOdApplication.inProcess;
                $scope.odprocessInprocess = data.odApplication.inProcess
              } else {
                $scope.approvalOdApplication = '0';
                $scope.odprocessInprocess = '0';
              }
              if (sessionStorage.getItem('IsRegularizationAccessible') == 'true') {
                $scope.approvalAttendanceApplication = data.approvalAttendanceApplication.inProcess;
                $scope.attendanceInprocessCount = data.attendanceRegularization.inProcess
              } else {
                $scope.approvalAttendanceApplication = '0';
                $scope.attendanceInprocessCount = '0';
              }
              
              ////// new modules
                          //////// new modules
                    if (getMyHrapiVersionNumber() >= 18){
                        if (sessionStorage.getItem('IsTravelAccessible') == 'true')
                        {
                            $scope.travelInInProcess = data.listTravel.inProcess
                            $scope.travelInProcessApproval = data.approvalTravel.inProcess
                        } else{
                        
                            $scope.travelInInProcess = '0';
                            $scope.travelInProcessApproval = '0';
                        }
                        if (sessionStorage.getItem('IsClaimAccessible') == 'true')
                        {
                            $scope.travelClaimInProcess = data.listTravelClaim.inProcess
                            $scope.travelClaimInProcessApproval = data.approvalTravelClaim.inProcess
                        } else
                        {
                            $scope.travelClaimInProcess = '0';
                            $scope.travelClaimInProcessApproval = '0';
                        }
                        //expense claim
                        if (sessionStorage.getItem('IsExpenseClaimAccessible') == 'true')
                        {
                            $scope.ctcInProcess = data.listClaimCTC.inProcess
                            $scope.ctcInProcessApproval = data.approvalClaimCTC.inProcess
                            
                            $scope.nonCtcInProcess = data.listClaimNONCTC.inProcess
                            $scope.nonCtcInProcessApproval = data.approvalClaimNONCTC.inProcess
                            
                            $scope.ltaInProcess = data.listClaimLTA.inProcess
                            $scope.ltaInProcessApproval = data.approvalClaimLTA.inProcess
                            
                        } else
                        {
                            $scope.ctcInProcess = '0';
                            $scope.ctcInProcessApproval = '0';
                            
                            $scope.nonCtcInProcess = '0';
                            $scope.nonCtcInProcessApproval = '0';
                            
                            $scope.ltaInProcess = '0';
                            $scope.ltaInProcessApproval = '0';
                        }
                    
                    }
                    
              
              
              
        
              sessionStorage.setItem('LeaveRequests', $scope.leaveInprocessCount);
              sessionStorage.setItem('ODRequests', $scope.odprocessInprocess);
              sessionStorage.setItem('AttRegRequests', $scope.attendanceInprocessCount);
              sessionStorage.setItem('SCRequests', $scope.shiftChangeInProcessApproval);
              
              $scope.LeaveRequests = sessionStorage.getItem('LeaveRequests');
              $scope.ODRequests = sessionStorage.getItem('ODRequests');
              $scope.AttRegRequests = sessionStorage.getItem('AttRegRequests');
              $scope.SCRequests = sessionStorage.getItem('SCRequests');
              
              $rootScope.totalRequistionCountForMenu = parseInt($scope.LeaveRequests) + parseInt($scope.ODRequests) + parseInt($scope.AttRegRequests)
              + parseInt($scope.SCRequests)
              
              
              if (getMyHrapiVersionNumber() >=18){
                  sessionStorage.setItem('travelRequests', $scope.travelInProcessApproval);
                  sessionStorage.setItem('travelClaimRequests', $scope.travelClaimInProcessApproval);
                  sessionStorage.setItem('ctcRequests', $scope.ctcInProcessApproval);
                  sessionStorage.setItem('nonCtcveRequests', $scope.nonCtcInProcessApproval);
                  sessionStorage.setItem('ltaRequests', $scope.ltaInProcessApproval);
        
                  $scope.travelRequests = sessionStorage.getItem('travelRequests');
                  $scope.travelClaimRequests = sessionStorage.getItem('travelClaimRequests');
                  $scope.ctcRequests = sessionStorage.getItem('ctcRequests');
                  $scope.nonCtcRequests = sessionStorage.getItem('nonCtcveRequests');
                  $scope.ltaRequests = sessionStorage.getItem('ltaRequests');
              
                   $scope.totalClaimRequests =  parseInt($scope.travelClaimRequests) + parseInt($scope.ctcRequests) + parseInt($scope.nonCtcRequests) +parseInt($scope.ltaRequests) 
                  $rootScope.totalRequistionCountForMenu = parseInt($rootScope.totalRequistionCountForMenu) + parseInt($scope.travelRequests) +  parseInt($scope.totalClaimRequests)
              }else{
                  $scope.travelRequests = "0"
                  $scope.travelClaimRequests = "0"
                  $scope.ctcRequests = "0"
                  $scope.nonCtcRequests = "0"
                  $scope.ltaRequests = "0"
              
                   $scope.totalClaimRequests =  "0"
              }
              
              
              if ($scope.navigateToPageWithCount == true) {
                  
                  //check if rootscope has tab value
                  
                  if ($rootScope.reqestPageLastTab != ""){
                      
                      if ($rootScope.reqestPageLastTab == "LEAVE"){
                          $scope.getLeaveRequestList();
                      }
                      if ($rootScope.reqestPageLastTab == "OD"){
                          $scope.getODApplicationList();
                      }
                      if ($rootScope.reqestPageLastTab == "ATTREG"){
                          //$scope.attListFetched = false
                          $scope.getRegularizationRequestList();
                      }
                      if ($rootScope.reqestPageLastTab == "SC"){
                          $scope.getShiftChangeRequestList();
                      }
                      if ($rootScope.reqestPageLastTab == "TRAVEL"){
                          $('.center').slick('slickGoTo', 4);
                          $scope.getTravelRequestList();
                      }
                      if ($rootScope.reqestPageLastTab == "CLAIM_CTC"){
                          $scope.claimTabClicked()
                          //$('.center').slick('slickGoTo', 5);
                          //$scope.getCClaimList();
                      }
                      if ($rootScope.reqestPageLastTab == "CLAIM_NONCTC"){
                          $scope.claimTabClicked()
                          //$('.center').slick('slickGoTo', 5);
                          //$scope.getNClaimList();
                      }
                      if ($rootScope.reqestPageLastTab == "CLAIM_LTA"){
                          $scope.claimTabClicked()
                          //$('.center').slick('slickGoTo', 5);
                          //$scope.getLClaimList();
                      }
                      if ($rootScope.reqestPageLastTab == "CLAIM_TRAVEL"){
                          $scope.claimTabClicked()
                          //$('.center').slick('slickGoTo', 5);
                          //$scope.getClaimRequestList();
                      }
                      $scope.navigateToPageWithCount = false
                      $ionicLoading.hide()
                      return
                  }
                  
                
                if ($scope.IsLeaveAccessible == 'true' &&
                  $scope.LeaveRequests == "0" && $scope.ODRequests == "0" &&
                  $scope.AttRegRequests == "0" && $scope.SCRequests == "0" &&
                  $scope.travelRequests == "0" && $scope.totalClaimRequests == "0") {
        
                  $scope.getLeaveRequestList();
                }
                else if ($scope.IsLeaveAccessible == 'true' && $scope.LeaveRequests > 0) {
        
                  $scope.getLeaveRequestList();
                }
                else if ($scope.IsODAccessible == 'true' && $scope.ODRequests > 0) {
                  $scope.getODApplicationList();
                }
                else if ($scope.IsRegularizationAccessible == 'true' && $scope.AttRegRequests > 0) {
                  $scope.getRegularizationRequestList();
                }
                else if ($scope.IsShiftChangeAccessible == 'true' && $scope.SCRequests > 0) {
                  $scope.getShiftChangeRequestList();
                }
                else if ($scope.IsTravelAccessible == 'true' && $scope.travelRequests > 0) {
                  $('.center').slick('slickGoTo', 4);
                  $scope.getTravelRequestList();
                }
                else if ($scope.IsClaimAccessible == 'true' && $scope.totalClaimRequests > 0) {
                  $scope.claimTabClicked()
                }
                else if ($scope.IsExpenseClaimAccessible == 'true' && $scope.totalClaimRequests > 0) {
                  $scope.claimTabClicked()
                }else{
                    //above fail .. it may be for access rights are counts are 0
                    if ($scope.IsLeaveAccessible == 'true'){
                        $scope.getLeaveRequestList();
                        return
                    }
                    if ($scope.IsODAccessible == 'true'){
                        $scope.getODApplicationList();
                        return
                    }
                    if ($scope.IsRegularizationAccessible == 'true'){
                        $scope.getRegularizationRequestList();
                        return
                    }
                    if ($scope.IsShiftChangeAccessible == 'true'){
                        $scope.getShiftChangeRequestList();
                        return
                    }
                    if ($scope.IsTravelAccessible == 'true'){
                        $scope.getTravelRequestList();
                        return
                    }
                    if ($scope.IsClaimAccessible == 'true' || $scope.IsExpenseClaimAccessible == 'true' ){
                        $scope.claimTabClicked();
                        return
                    }
                    
                    
                }
              }
              
              
            }, function (data) {
              autoRetryCounter = 0
              $ionicLoading.hide()
              commonService.getErrorMessage(data, "app.home.dashboard");
            });
          }
          function Initialize() {
	
            $ionicLoading.show();
            $scope.getRequestCounts();
            $scope.getLeaveRequestList();
            $ionicLoading.hide();
          }
          Initialize();

    });