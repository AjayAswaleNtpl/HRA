mainModule.factory("getTravelApplicationReporteeListService", function ($resource) {
    return $resource((baseURL + '/api/travelApplication/getTravelApplicationReporteeList.spr'), {}, 
    { 'save': { method: 'POST', timeout: commonRequestTimeout,
    headers: {
      'Authorization': 'Bearer ' + jwtByHRAPI
      } } }, {});
  });
  mainModule.factory("singleApproveTravelAppService", function ($resource) {
    return $resource((baseURL + '/api/travelApplication/singleApproveTravelApp.spr'), {}, 
    { 'save': { method: 'POST', timeout: commonRequestTimeout,
    headers: {
      'Authorization': 'Bearer ' + jwtByHRAPI
      } } }, {});
  });
  mainModule.factory("singleRejectTravelAppService", function ($resource) {
    return $resource((baseURL + '/api/travelApplication/singleRejectTravelApp.spr'), {}, 
    { 'save': { method: 'POST', timeout: commonRequestTimeout,
    headers: {
      'Authorization': 'Bearer ' + jwtByHRAPI
      } } }, {});
  });
  mainModule.factory("getPhotoService", function ($resource) {
    return $resource((baseURL + '/api/eisCompany/checkProfilePhoto.spr'), {}, 
    { 'save': { method: 'POST', timeout: commonRequestTimeout,
    headers: {
      'Authorization': 'Bearer ' + jwtByHRAPI
      } } }, {});
  });
  
  mainModule.factory("viewTravelClaim", function ($resource) {
    return $resource((baseURL + '/api/travelClaim/viewTravelClaim.spr'), {},
     { 'save': { method: 'POST', timeout: commonRequestTimeout,
     headers: {
      'Authorization': 'Bearer ' + jwtByHRAPI
      } } }, {});
  });
  
  
  mainModule.factory("getRequisitionCountService", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/eisCompany/viewRequestCount.spr'), {}, {
      'save': {
        method: 'POST',
        timeout: commonRequestTimeout,
        headers: {
          'Authorization': 'Bearer ' + jwtByHRAPI
          }
      }
    }, {});
  }]);

  mainModule.factory("viewTravelApplication", function ($resource) {
    return $resource((baseURL + '/api/travelApplication/viewTravelApplication.spr'), {}, 
    { 'save': { method: 'POST', timeout: commonRequestTimeout,
    headers: {
      'Authorization': 'Bearer ' + jwtByHRAPI
      } } }, {});
  });

  mainModule.controller('approvalTravelListCtrl', function ($scope, viewClaimFormService, getPhotoService,
    $filter, getTravelApplicationReporteeListService, $ionicLoading, $ionicModal, homeService,
    getRequisitionCountService, singleApproveTravelAppService, singleRejectTravelAppService, viewTravelClaim,
    getSetService, $rootScope, commonService, $ionicPopup, $http, viewAttendaceRegularisationService,
    getRequisitionCountService, viewShiftChangeApprovalService, viewODPendingApplicationService,
    rejectPendingODService, approvePendingODService, $ionicLoading, $ionicModal, viewLeaveApplicationService,
    approvePendingClaimService, rejectPendingClaimService,viewTravelApplication,
    detailsService, homeService, $timeout, $state){
      $rootScope.navHistoryPrevPage = "approvalsNew"
        $scope.navigateToPageWithCount = true
		$scope.approvePageLastTab = ""
		
        if (getMyHrapiVersionNumber() >=20){
            $scope.IsTravelAccessible = sessionStorage.getItem('IsTravelAccessible');
            $scope.IsClaimAccessible = sessionStorage.getItem('IsClaimAccessible');
            $scope.IsExpenseClaimAccessible = sessionStorage.getItem('IsExpenseClaimAccessible'); //for ctc nonctc and lta
        }else{
            $scope.IsTravelAccessible = 'false'
            $scope.IsClaimAccessible = 'false' // travel claim
            $scope.IsExpenseClaimAccessible = 'false'
        }
        if ($rootScope.myAppVersion>=20){
            $scope.showPunchDetailsFeature='true'
        }else{
            $scope.showPunchDetailsFeature='false'
        }
        $scope.isARTorFRT = sessionStorage.getItem('IsARTorFRT');
        $scope.isGroupMasterReportee = sessionStorage.getItem('isGroupMasterReportee');
	
        $scope.selectedValues = {}
        
        $scope.requesObjectForMonth = {};
        $scope.requesObjectForYear = {};
        $scope.requesObjectForMonth.month = ''
        $scope.requesObjectForYear.year = ''
        $scope.attendPendingObject = {}
        $scope.createdDate = [];
        $scope.resultObject = {}
        $scope.requesObject = {}
        $scope.requesObject1 = {}
        $scope.searchObj = {}
        $scope.leaveType = {}
        $scope.searchObj.searchLeave = '';
        $scope.searchObj.searchODManager = ''
        $scope.searchObj.searchQueryAttRegularisationManager = ''
        $scope.searchObj.searchShiftManager = ''
        $scope.resultobj = {}

        var d = new Date();

        if (sessionStorage.getItem('department') && (sessionStorage.getItem('displayDeptName') == '"Department"')) {
            $scope.resultobj.department = sessionStorage.getItem('department');
          }
          $scope.redirectOnBack = function(){
              $state.go('app.approvalsMenu')
          }

          $scope.getTravelList = function () {
            homeService.updateInboxEmailList("", function () { }, function (data) { })
        
            $scope.searchObj = ''
            $("#ClaimPendingApplicationID").hide();
            $("#TravelPendingApplicationID").show();
            $("#tabClaim").removeClass("active");
            $("#tabTravel").addClass("active");
            $("#claimApplicationID").hide();
            $("#ShiftChangeApplicationID").hide();
            $("#leavePendingApplicationID").hide();
            $("#ODPendingApplicationID").hide();
            $("#AttendanceApplicationID").hide()
            $("#tabShiftChange").removeClass("active");
            $("#tabLeave").removeClass("active");
            $("#tabOD").removeClass("active");
            $("#tabRegularization").removeClass("active");
            $("#tabClaim").removeClass("active");
            $("#ClaimPendingApplicationID").hide();
        
            
            $rootScope.approvePageLastTab = "TRAVEL"
        
            if ($scope.travelListFetched == true) {
              return;
            }
            $scope.travelListFetched = true
        
        
            $ionicLoading.show({});
            $scope.requesObject = {}
            $scope.requesObject.menuId = 2607
            $scope.requesObject.buttonRights = "Y-Y-Y-Y"
            $scope.requesObject.status = ""
            //$scope.getTravelApplicationReporteeListService = new getTravelApplicationReporteeListService();
            //$scope.getTravelApplicationReporteeListService.$save($scope.requesObject, function (data) {
            $scope.viewTravelApplication = new viewTravelApplication();
            $scope.viewTravelApplication.$save($scope.requesObject, function (data) {
              
              if (!(data.clientResponseMsg == "OK")) {
                console.log(data.clientResponseMsg)
                handleClientResponse(data.clientResponseMsg, "viewLeaveApplicationService")
                showAlert("Something went wrong. Please try later.")
                $ionicLoading.hide()
                showAlert("Something went wrong. Please try later.")
                return
              }
              $scope.travelAppList = []
              
              if (data.travelApplicationForm.reporteeTravelApplicationList.length == 0) {
                $ionicLoading.hide()
                return;
              }
              $scope.travelAppList = data.travelApplicationForm.reporteeTravelApplicationList
              // if (data.reporteeList.length == 0) {
              //   $ionicLoading.hide()
              //   return;
              // }
              // $scope.travelAppList = data.reporteeList
        
              for (var i = 0; i < $scope.travelAppList.length; i++) {
                $scope.travelFromFormatedDate = $scope.travelAppList[i].reqDate.split('/')
                $scope.travelAppList[i].reqDate = new Date($scope.travelFromFormatedDate[2] + '/' + $scope.travelFromFormatedDate[1] + '/' + $scope.travelFromFormatedDate[0])
                
                if($scope.travelAppList[i].approvalRemarks != null){
                  $scope.travelAppList[i].approvalRemarks = $scope.travelAppList[i].approvalRemarks.replace(/<br>/g, "\n")
                  $scope.travelAppList[i].approvalRemarks = $scope.travelAppList[i].approvalRemarks.replace(/<BR>/g, "\n")
                  $scope.travelAppList[i].approvalRemarks = $scope.travelAppList[i].approvalRemarks.replace(/&#13;/g, "\n")
                  $scope.travelAppList[i].approvalRemarks = $scope.travelAppList[i].approvalRemarks.replace(/&#10;/g, "\n")
                }
                
            
                if($scope.travelAppList[i].approvedReason != null){
                  $scope.travelAppList[i].approvedReason = $scope.travelAppList[i].approvedReason.replace(/<br>/g, "\n")
                  $scope.travelAppList[i].approvedReason = $scope.travelAppList[i].approvedReason.replace(/<BR>/g, "\n")
                  $scope.travelAppList[i].approvedReason = $scope.travelAppList[i].approvedReason.replace(/&#13;/g, "\n")
                  $scope.travelAppList[i].approvedReason = $scope.travelAppList[i].approvedReason.replace(/&#10;/g, "\n")
                }
                
            
            
                //$scope.travelAppList[i].
              }
        
              var index = 0
              while (index != $scope.travelAppList.length) {
                $scope.getTravelPhotos(index)
                index++
              }
              $ionicLoading.hide()
            }, function (data) {
              autoRetryCounter = 0
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
            });
          }
        
          $scope.getTravelPhotos = function (index) {
        
            if ($scope.travelAppList[index] === undefined) {
              return
            }
        
            $scope.travelAppList[index].photoFileName = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + $scope.travelAppList[index].empId
            return
        
        
          }
          $scope.goToRequisitions = function(){
            $state.go("requestTravelApplicationID")
        }
          $scope.getPic = function () {
            $ionicLoading.show({});
            $scope.getPhotoService = new getPhotoService();
            $scope.getPhotoService.$save($scope.resultObject, function (success) {
              if (success.profilePhoto) {
                $scope.profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + $scope.resultObject.empId + '';
                $ionicLoading.hide();
              }
              else {
                if ($scope.genderDetails == 'M') {
                  $scope.gender = ('profilePhoto', "./img/Male.png");
                }
                else {
                  $scope.gender = ('profilePhoto', "./img/Female.png");
                }
        
                $scope.profilePhoto = ''
                $ionicLoading.hide();
              }
            }, function (data) {
              autoRetryCounter = 0
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
            });
          }

          $scope.refreshtraveList = function () {
            $scope.travelListFetched = false
            $scope.getTravelList()
          }

          // $scope.goToRequisitions = function () {
          //   //alert("RequestListCombined");
          //   $state.go('RequestListCombined');
        
          // }

          function Initialize() {
            //$rootScope.travel = 0;
            //$rootScope.claim = 0;
            
            
            getMenuInfoOnLoad(function () {
                      });
        
            if ($scope.navigateToPageWithCount == true) {
              $scope.navigateToPageWithCount = false
              //check if rootscope has tab value
              
              if ($scope.IsTravelAccessible == 'true' && $rootScope.travel > 0) {
                
                $scope.getTravelList();
              }
              
              else{
                  //above fail because of access rights or counts 0
                  //above fail .. it may be for access rights are counts are 0
                    
                    if ($scope.IsTravelAccessible == 'true'){
                        $scope.getTravelList();
                        //$rootScope.redirectApprovalTabName = ""
                        return
                    }
                    
              }
            }
        
           /* if ($rootScope.redirectApprovalTabName == 'LEAVE') {
              $scope.getLeaveList();
            }
            if ($rootScope.redirectApprovalTabName == 'OD') {
              $scope.getODApplicationList();
            }
            if ($rootScope.redirectApprovalTabName == 'ATT_REG') {
              $scope.getAttendanceApplicationList();
            }
            if ($rootScope.redirectApprovalTabName == 'SHIFT_CH') {
              $scope.getShiftChangeApplicationList();
            }*/
        
                          
        
          }
          function getMenuInfoOnLoad(success) {
            $rootScope.getRequisitionCountService = new getRequisitionCountService();
            $rootScope.getRequisitionCountService.$save(function (data) {
              if (data.odApplication && (sessionStorage.getItem('IsRegularizationAccessible') == 'true')) {
                attendRegularInProcessCount  = data.odApplication.inProcess;
              } else {
                  attendRegularInProcessCount = 0
              }
              if (data.leaveApplication && (sessionStorage.getItem('IsLeaveAccessible') == 'true')) {
                leaveAppliInProcessCount = data.leaveApplication.inProcess;
              } else {
                leaveAppliInProcessCount = '0'
              }
              if (data.attendanceRegularisation && (sessionStorage.getItem('IsODAccessible') == 'true')) {
                 odApplicationInProcessCount = data.attendanceRegularisation.inProcess;
              } else {
                  odApplicationInProcessCount = '0'
                
              }
              if (data.shiftChange && (sessionStorage.getItem('IsShiftChangeAccessible') == 'true')) {
                shiftChangeCount = data.shiftChange.inProcess;
              } else {
                shiftChangeCount = '0'
              }
              
              if (getMyHrapiVersionNumber() >= 18){
                  if (data.travelApplCount && $scope.IsTravelAccessible == 'true') {
                    travelApplCount = data.travelApplCount.inProcess;
                  } else {
                    travelApplCount = '0'
                  }
                  
                  if (data.travelClaimApplCount && $scope.IsClaimAccessible == 'true') {
                    travelClaimApplCount = data.travelClaimApplCount.inProcess;
                  } else {
                    travelClaimApplCount = '0'
                  }
                  
                  if ( $scope.IsExpenseClaimAccessible == 'true') {
                    claimCTCApplCount = data.claimCTCApplCount.inProcess;
                    claimNONCTCApplCount = data.claimNONCTCApplCount.inProcess;
                    claimLTACLAIMApplCount = data.claimLTACLAIMApplCount.inProcess;
                  } else {
                    claimCTCApplCount = 0
                    claimNONCTCApplCount = 0
                    claimLTACLAIMApplCount = 0
                  }
              }
              
              
              $rootScope.totalRequestCount = parseInt(attendRegularInProcessCount) + parseInt(leaveAppliInProcessCount) + parseInt(odApplicationInProcessCount) + parseInt(shiftChangeCount);
              $rootScope.attendance = attendRegularInProcessCount;
              $rootScope.leave = leaveAppliInProcessCount;
              $rootScope.od = odApplicationInProcessCount;
              $rootScope.shift = shiftChangeCount;
              
              if (getMyHrapiVersionNumber() >= 18){
                  
                  $scope.travelCount = travelApplCount;
                  $scope.travelClaimCount = travelClaimApplCount;
                  $scope.ctcCount = claimCTCApplCount;
                  $scope.nonCtcCount = claimNONCTCApplCount;
                  $scope.ltaCtcCount = claimLTACLAIMApplCount;
                  
                  $scope.totalClaimCount = parseInt($scope.travelClaimCount) + parseInt($scope.ctcCount) + parseInt($scope.nonCtcCount) + parseInt($scope.ltaCtcCount)
                  
                  $rootScope.totalRequestCount = $rootScope.totalRequestCount + parseInt($scope.travelCount) + $scope.totalClaimCount 
                  
              }
        
            }
              //success();
            , function (data) {
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
            });
          }

          $scope.showTravelDetailForm = function (travelObj) {
            $rootScope.travelTransIdForClaimApply = travelObj.travelTransId;
            $rootScope.gv_travelShowDetailsFrom = "APPROVAL_TRAVEL_LIST";
            $rootScope.gv_travelShowDetailsStaus = travelObj.travelStatus;
            $state.go('claimTravelDetails');
          }

          $scope.downloadAttachmnent = function (travel) {
            var strData = travel.uploadFile
            var strUrlPrefix = 'data:' + travel.uploadContentType + ";base64,"
            var url = strUrlPrefix + strData
            var blob = base64toBlob(strData, travel.uploadContentType)
            downloadFileFromData(travel.uploadFileName, blob, travel.uploadContentType)
            event.stopPropagation();
          }

          $scope.getMonthName = function(mid){
            if (parseInt(mid) ==1 ) return "January"
            if (parseInt(mid) ==2 ) return "February"
            if (parseInt(mid) ==3 ) return "March"
            if (parseInt(mid) ==4 ) return "April"
            if (parseInt(mid) ==5 ) return "May"
            if (parseInt(mid) ==6 ) return "June"
            if (parseInt(mid) ==7 ) return "July"
            if (parseInt(mid) ==8 ) return "August"
            if (parseInt(mid) ==9 ) return "September"
            if (parseInt(mid) ==10 ) return "October"
            if (parseInt(mid) ==11 ) return "November"
            if (parseInt(mid) ==12 ) return "December"
            
            
        }	
        $timeout(function () {  Initialize() }, 500)  
        
    });