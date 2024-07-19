mainModule.factory("addClaimFormService", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/claimForm/addClaimForm.spr'), {}, {
      'save': {
        method: 'POST',
        timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
      }
    }, {});
  }]);
  mainModule.factory("travelClaimDataService", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/travelClaim/travelClaimData.spr'), {}, {
      'save': {
        method: 'POST',
        timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
      }
    }, {});
  }]);
  mainModule.factory("viewClaimFormService", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/claimForm/viewClaimForm.spr'), {}, {
      'save': {
        method: 'POST',
        timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
      }
    }, {});
  }]);

  mainModule.factory("viewTravelClaimService", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/travelClaim/viewTravelClaim.spr'), {}, {
      'save': {
        method: 'POST',
        timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
      }
    }, {});
  }]);

mainModule.controller('requestClaimListCtrl', function ($scope, $rootScope,
  $timeout, $filter, commonService, $state, getYearListService, $ionicPopup, viewODApplicationService, sendODRequestService, getSetService, $ionicLoading, $ionicModal, cancelODRequestService, viewLeaveApplicationService, detailsService, viewMissPunchApplicationService,
    viewShiftChangeApplicationService, getTravelApplicationListService,
     addClaimFormService, travelClaimDataService, viewClaimFormService, viewRequisitionApprovalService, viewTravelClaimService){
      $rootScope.navHistoryPrevPage = "requisitionNew"  
      if (getMyHrapiVersionNumber() >=20){
            $scope.IsTravelAccessible = sessionStorage.getItem('IsTravelAccessible');
            $scope.IsClaimAccessible = sessionStorage.getItem('IsClaimAccessible');
            $scope.IsExpenseClaimAccessible = sessionStorage.getItem('IsExpenseClaimAccessible'); //for ctc nonctc and lta
        }else{
            $scope.IsTravelAccessible = 'false'
            $scope.IsClaimAccessible = 'false'
            $scope.IsExpenseClaimAccessible = 'false'
        }

        $scope.navigateToPageWithCount = true
		

        $scope.greyArrowForNextMonth = true
        $scope.requesObjectForMonth = {};
        $scope.requesObjectForYear = {};
        $scope.requesObjectForMonth.month = ''
        $scope.requesObjectForYear.yearId = ''
        $scope.shiftChangeAppliList = [];
        $scope.repoteeShiftChangeVOList = [];
        $scope.createdDate = [];
        $scope.missPunchAppliList = [];
        $scope.searchObj = {}
        $scope.searchObj.searchQuery = '';
        $scope.searchObj.searchRegular = ''
        $scope.searchObj.searchOD = ''
        $scope.searchObj.searchShift = ''
        
        $scope.requesObject1 = {};
        $scope.sendrequesObject = {}
        $scope.requesObject = {}
        $scope.selectedValues = {}
        $scope.selectedValues.claimType = '';

        $scope.ctcclaimListFetched = false
        $scope.nctcclaimListFetched = false
        $scope.ltaclaimListFetched = false
        $scope.travelListFetched = false;
        $scope.travelClaimListFetched = false;
        $scope.listCtcPeriodVO = [];
        $scope.goToApprovals = function(){
          $state.go("approvalClaimList")
        }
        $scope.redirectOnBack = function(){
            $state.go('app.requestMenu')
        }
        $scope.diff_HrsMin = function (dt2, dt1) {
            var msec = dt1 - dt2;
            var mins = Math.floor(msec / 60000);
            var hrs = Math.floor(mins / 60);
        
            mins = Math.floor(mins % 60)
            if (hrs < 10) hrs = "0" + hrs
            if (mins < 10) mins = "0" + mins
            return hrs + ":" + mins
        
          }

          $scope.getClaimRequestList = function () {

            $("#tabRegularizationReq").removeClass("active");
            $("#tabClaimApplicationReq").addClass("active");
            $("#tabTravelReq").removeClass("active");
            $("#tabLeaveReq").removeClass("active");
            $("#tabODReq").removeClass("active");
            $("#tabShiftApplicationReq").removeClass("active");
            $("#tabTravelApplicationReq").removeClass("active");
            
            
        
        
            $("#claimApplicationIDReq").show();
            
            $("#ctcClaimListCard").hide();
            $("#nonCtcClaimListCard").hide();
            $("#ltaClaimListCard").hide();
            
            $("#claimApplicationReq").hide();
            $("#travelApplicationIDReq").hide();
            $("#leaveApplicationIDReq").hide();
            $("#ODApplicationIDReq").hide();
            $("#ShiftChangeRequestIDReq").hide();
            $("#RegularizationApplicationIDReq").hide();
            
          
            $scope.searchObj = '';
            $("#travelApplicationIDReq").hide();
            $("#tabTravelReq").removeClass("active");
            $("#claimApplicationIDReq").show();
            $("#tabClaimReq").addClass("active");
        
            $("#ctcClaimListCard").hide();
            $("#nonCtcClaimListCard").hide();
            $("#ltaClaimListCard").hide();
            $("#claimApplicationReq").show();
        
            $("#nonCtcSelect").css({ color: "#3B5998", background: "transparent" });
            $("#ctcSelect").css({ color: "#3B5998", background: "transparent" });
            $("#ltaSelect").css({ color: "#3B5998", background: "transparent" });
            $("#travelSelect").css({ color: "white", background: "#3B5998" });
        
            $rootScope.reqestPageLastTab = "CLAIM_TRAVEL"
                
            document.getElementById("periodDD").style.visibility = "hidden"
            if ($scope.travelClaimListFetched == true) {
              $ionicLoading.hide()
              return;
            }
            $scope.travelClaimListFetched = true;
        
            var travelMenuInfo = getMenuInformation("Travel Management", "Travel Application");
        
            $scope.requesObject = {}
            $scope.requesObject.menuId = travelMenuInfo.menuId;
            $scope.requesObject.menuId = '2609'
            $scope.requesObject.buttonRights = "Y-Y-Y-Y"
            $ionicLoading.show({});
            //$scope.travelClaimDataService = new travelClaimDataService();
            $scope.travelClaimDataService = new viewTravelClaimService();
            $scope.travelClaimDataService.$save($scope.requesObject, function (data) {
              if (!(data.clientResponseMsg == "OK")) {
                console.log(data.clientResponseMsg)
                handleClientResponse(data.clientResponseMsg, "viewTravelClaimService")
              }
        
              $ionicLoading.hide();
              $scope.claimApplList = []
              //$scope.claimApplList = data.travelClaimForm.travelClaimVO
              $scope.claimApplList = data.selfTravelList;
        
              for (var i = 0; i < $scope.claimApplList.length; i++) {
                if ($scope.claimApplList[i].apprDate){
                  $scope.apprDate = $scope.claimApplList[i].apprDate.split('/')
                  $scope.claimApplList[i].apprDate = new Date($scope.apprDate[2] + '/' + $scope.apprDate[1] + '/' + $scope.apprDate[0])
                }
                if ($scope.claimApplList[i].reqDate){
                  $scope.reqDate = $scope.claimApplList[i].reqDate.split('/')
                  $scope.claimApplList[i].claimDate = new Date($scope.reqDate[2] + '/' + $scope.reqDate[1] + '/' + $scope.reqDate[0])
                }

      				if ($scope.claimApplList[i].approvalRemarks)
                $scope.claimApplList[i].approvalRemarks = $scope.claimApplList[i].approvalRemarks.replace(/<br>/g, "\n")
                $scope.claimApplList[i].approvalRemarks = $scope.claimApplList[i].approvalRemarks.replace(/<BR>/g, "\n")
                $scope.claimApplList[i].approvalRemarks = $scope.claimApplList[i].approvalRemarks.replace(/&#13;/g, "\n")
                $scope.claimApplList[i].approvalRemarks = $scope.claimApplList[i].approvalRemarks.replace(/&#10;/g, "\n")
                
              }
              $ionicLoading.hide()
            }, function (data, status) {
        
              autoRetryCounter = 0
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
            });
          }
        
          $scope.getNonCtcClaimApplicationList = function () {
            $("#claimApplicationIDReq").show();
            $("#applyClaim").show();
            $("#claimApproval").removeClass("active");
            $("#claimApplication").addClass("active");
            $("#ctcClaimListCard").hide();
            $("#nonCtcClaimListCard").show();
            $("#ltaClaimListCard").hide();
            $("#claimApplicationReq").hide();
            $("#travelApplicationIDReq").hide();
            // $("#claimApplicationIDReq").show();
            $("#tabClaimApplicationReq").addClass("active");
            $("#tabTravelReq").removeClass("active");
            $("#tabClaimReq").removeClass("active");
            $("#leaveApplicationIDReq").hide();
            $("#ODApplicationIDReq").hide();
            $("#ShiftChangeRequestIDReq").hide();
            $("#RegularizationApplicationIDReq").hide();
            $("#tabLeaveReq").removeClass("active");
            $("#tabODReq").removeClass("active");
            $("#tabShiftApplicationReq").removeClass("active");
            $("#tabTravelApplicationReq").removeClass("active");
            document.getElementById("periodDD").style.visibility = "visible"
            if ($scope.nctcclaimListFetched == true) {
                $ionicLoading.hide()
              return;
            }
            $scope.nctcclaimListFetched = true;
           
            //For NON CTC
            $scope.requesObject.ctcPayHeadId = '2';
            $scope.requesObject.reqApp = 'false';
            $scope.requesObject.reqRequest = 'false';
            //$scope.requesObject.fYearId = '1';
            $scope.requesObject.SelfRequestListFlag = 1;
            $scope.requesObject.menuId = '2004';
            $scope.requesObject.buttonRights = 'Y-Y-Y-Y';
            $scope.requesObject.claimFlags = 'NONCTC';
        
            $ionicLoading.show();
            $scope.viewClaimFormService = new viewClaimFormService();
            $scope.viewClaimFormService.$save($scope.requesObject, function (data) {
              if (!(data.clientResponseMsg == "OK")) {
                console.log(data.clientResponseMsg)
                handleClientResponse(data.clientResponseMsg, "viewClaimFormService")
              }
              $scope.nonCTCClaimApplList = []
              if (data.selfClaimList === undefined) {
                $ionicLoading.hide();
              } else if (data.selfClaimList.length == 0) {
                $ionicLoading.hide();
              } else {
                $scope.nonCTCClaimApplList = data.selfClaimList;
                for (var i = 0; i < $scope.nonCTCClaimApplList.length; i++) {
                  if ($scope.nonCTCClaimApplList[i].fileName.length == 0) {
                    $scope.nonCTCClaimApplList[i].fileName == "NA"
                  }
                }
              }
                $ionicLoading.hide();
         
            }, function (data, status) {
              autoRetryCounter = 0
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
            });
          }
        
          $scope.getLtaClaimApplicationList = function () {
            $("#claimApplicationIDReq").show();
            $("#applyClaim").show();
            $("#claimApproval").removeClass("active");
            $("#claimApplication").addClass("active");
            $("#travelApplicationIDReq").hide();
            $("#tabClaimApplicationReq").addClass("active");
            $("#tabTravelReq").removeClass("active");
            $("#tabClaimReq").removeClass("active");
            $("#ctcClaimListCard").hide();
            $("#nonCtcClaimListCard").hide();
            $("#ltaClaimListCard").show();
            $("#claimApplicationReq").hide();
            $("#leaveApplicationIDReq").hide();
            $("#ODApplicationIDReq").hide();
            $("#ShiftChangeRequestIDReq").hide();
            $("#RegularizationApplicationIDReq").hide();
            $("#tabLeaveReq").removeClass("active");
            $("#tabODReq").removeClass("active");
            $("#tabShiftApplicationReq").removeClass("active");
            $("#tabTravelApplicationReq").removeClass("active");
            
            document.getElementById("periodDD").style.visibility = "visible"
            if ($scope.ltaclaimListFetched == true) {
              $ionicLoading.hide()
              return;
            }
            $scope.ltaclaimListFetched = true;
            document.getElementById("periodDD").style.visibility = "visible"
          
            //For LTA
            $scope.requesObject.ctcPayHeadId = '3';
            $scope.requesObject.reqApp = 'false';
            $scope.requesObject.reqRequest = 'false';
            //$scope.requesObject.fYearId = '1';
            $scope.requesObject.SelfRequestListFlag = 1;
            $scope.requesObject.menuId = '2009';
            $scope.requesObject.buttonRights = 'Y-Y-Y-Y';
            $scope.requesObject.claimFlags = 'LTACLAIM';
            
              
        
              
            $ionicLoading.show();
            $scope.viewClaimFormService = new viewClaimFormService();
            $scope.viewClaimFormService.$save($scope.requesObject, function (data) {
              if (!(data.clientResponseMsg == "OK")) {
                console.log(data.clientResponseMsg)
                handleClientResponse(data.clientResponseMsg, "viewClaimFormService")
              }
              $scope.ltaClaimApplList = []
              if (data.selfClaimList === undefined) {
                $ionicLoading.hide();
              } else if (data.selfClaimList.length == 0) {
                $ionicLoading.hide();
              } else {
                $scope.ltaClaimApplList = data.selfClaimList;
                for (var i = 0; i < $scope.ltaClaimApplList.length; i++) {
                  if ($scope.ltaClaimApplList[i].fileName.length == 0) {
                    $scope.ltaClaimApplList[i].fileName == "NA"
                  }
                }
                $ionicLoading.hide();
                return;
        
                $scope.createDate = data.selfClaimList[0].createDate;
              }
              for (var i = 0; i < $scope.ltaClaimApplList.length; i++) {
                $scope.ltaClaimApplList[i].designation = sessionStorage.getItem('designation')
                $scope.ltaClaimApplList[i].department = sessionStorage.getItem('department');
                $scope.ltaClaimApplList[i].empName = sessionStorage.getItem('empName');
                $scope.ltaClaimApplList[i].name = sessionStorage.getItem('empName');
                if (sessionStorage.getItem('photoFileName')) {
                  $scope.ltaClaimApplList[i].photoFileName = sessionStorage.getItem('photoFileName')
                  $scope.ltaClaimApplList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
                }
                else {
                  $scope.ltaClaimApplList[i].photoFileName = ''
                  $scope.ltaClaimApplList[i].profilePhoto = ''
                }
              }
              $ionicLoading.hide()
            }, function (data, status) {
              autoRetryCounter = 0
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
            });
          }
        
          $scope.getCtcClaimApplicationList = function () {
            $ionicLoading.show();
              
            $("#claimApplicationIDReq").show();
            $("#applyClaim").show();
            $("#ctcClaimListCard").show();
            $("#nonCtcClaimListCard").hide();
            $("#ltaClaimListCard").hide();
            $("#claimApproval").removeClass("active");
            $("#claimApplication").addClass("active");
            $("#tabRegularizationReq").removeClass("active");
            $("#claimApplicationReq").hide();
            $("#travelApplicationIDReq").hide();
            $("#tabClaimApplicationReq").addClass("active");
            $("#tabTravelReq").removeClass("active");
            $("#leaveApplicationIDReq").hide();
            $("#ODApplicationIDReq").hide();
            $("#ShiftChangeRequestIDReq").hide();
            $("#RegularizationApplicationIDReq").hide();
            $("#tabLeaveReq").removeClass("active");
            $("#tabODReq").removeClass("active");
            $("#tabShiftApplicationReq").removeClass("active");
            $("#tabTravelApplicationReq").removeClass("active");
            document.getElementById("periodDD").style.visibility = "visible"
            if ($scope.ctcclaimListFetched == true) {
                $ionicLoading.hide()
              return;
            }
            
                  
            document.getElementById("periodDD").style.visibility = "visible"
            $scope.ctcclaimListFetched = true;
            $scope.requesObject.SelfRequestListFlag = 1;
            $scope.requesObject.reqRequest = 'false';
            //For CTC
            $scope.requesObject.ctcPayHeadId = '1';
            $scope.requesObject.reqApp = 'false';
            //$scope.requesObject.fYearId = '1';
            $scope.requesObject.menuId = '2009';
            $scope.requesObject.buttonRights = 'Y-Y-Y-Y';
            $scope.requesObject.claimFlags = 'CTC';
            
            
            $scope.viewClaimFormService = new viewClaimFormService();
            $scope.viewClaimFormService.$save($scope.requesObject, function (data) {
              if (!(data.clientResponseMsg == "OK")) {
                console.log(data.clientResponseMsg)
                handleClientResponse(data.clientResponseMsg, "viewClaimFormService")
              }
              
              $scope.ctcClaimApplList = []
              if (data.selfClaimList === undefined) {
                ////$ionicLoading.hide();
              } else if (data.selfClaimList.length == 0) {
                ////$ionicLoading.hide();
              } else {
                $scope.ctcClaimApplList = data.selfClaimList;
                for (var i = 0; i < $scope.ctcClaimApplList.length; i++) {
                  if ($scope.ctcClaimApplList[i].fileName.length == 0) {
                    $scope.ctcClaimApplList[i].fileName == "NA"
                  }
                  
                  if ($scope.ctcClaimApplList[i].month && parseInt($scope.ctcClaimApplList[i].month) > 0){
                      $scope.ctcClaimApplList[i].monthName = $scope.getMonthName($scope.ctcClaimApplList[i].month)
                  }
                }
                
                $ionicLoading.hide();
                
                return;
        
                $scope.createDate = data.selfClaimList[0].createDate;
              }
              for (var i = 0; i < $scope.ctcClaimApplList.length; i++) {
                $scope.ctcClaimApplList[i].designation = sessionStorage.getItem('designation')
                $scope.ctcClaimApplList[i].department = sessionStorage.getItem('department');
                $scope.ctcClaimApplList[i].empName = sessionStorage.getItem('empName');
                $scope.ctcClaimApplList[i].name = sessionStorage.getItem('empName');
                if (sessionStorage.getItem('photoFileName')) {
                  $scope.ctcClaimApplList[i].photoFileName = sessionStorage.getItem('photoFileName')
                  $scope.ctcClaimApplList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
                }
                else {
                  $scope.ctcClaimApplList[i].photoFileName = ''
                  $scope.ctcClaimApplList[i].profilePhoto = ''
                }
              }
              $ionicLoading.hide()
            }, function (data, status) {
              autoRetryCounter = 0
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
            });
          }
          $scope.getCClaimList = function () {
            $scope.getCtcClaimApplicationList();
            $("#claimApplicationIDReq").show();
            $("#ctcClaimListCard").show();
            $("#nonCtcClaimListCard").hide();
            $("#ltaClaimListCard").hide();
        
            $("#nonCtcSelect").css({ color: "#3B5998", background: "transparent" });
            $("#travelSelect").css({ color: "#3B5998", background: "transparent" });
            $("#ltaSelect").css({ color: "#3B5998", background: "transparent" });
            $("#ctcSelect").css({ color: "white", background: "#3B5998" });
            
            $rootScope.reqestPageLastTab = "CLAIM_CTC"
          }
          
          $scope.getNClaimList = function () {
            $scope.getNonCtcClaimApplicationList();
            $("#claimApplicationIDReq").show();
            $("#ctcClaimListCard").hide();
            $("#nonCtcClaimListCard").show();
            $("#ltaClaimListCard").hide();
        
            $("#ctcSelect").css({ color: "#3B5998", background: "transparent" });
            $("#travelSelect").css({ color: "#3B5998", background: "transparent" });
            $("#ltaSelect").css({ color: "#3B5998", background: "transparent" });
            $("#nonCtcSelect").css({ color: "white", background: "#3B5998" });
            
            $rootScope.reqestPageLastTab = "CLAIM_NONCTC"
                
          }
          
          $scope.getLClaimList = function () {
            $scope.getLtaClaimApplicationList();
            $("#claimApplicationIDReq").show();
            $("#ctcClaimListCard").hide();
            $("#nonCtcClaimListCard").hide();
            $("#ltaClaimListCard").show();
        
            $("#nonCtcSelect").css({ color: "#3B5998", background: "transparent" });
            $("#ctcSelect").css({ color: "#3B5998", background: "transparent" });
            $("#travelSelect").css({ color: "#3B5998", background: "transparent" });
            $("#ltaSelect").css({ color: "white", background: "#3B5998" });
            
            $rootScope.reqestPageLastTab = "CLAIM_LTA"
            
          }
        
          $scope.getClaimList = function () {
        
            if ($scope.selectedValues.claimType == "ctcSelect") {
              $scope.getCtcClaimApplicationList();
              $("#ctcClaimListCard").show();
              $("#nonCtcClaimListCard").hide();
              $("#ltaClaimListCard").hide();
              $("#claimApplicationIDReq").hide();
            } else if ($scope.selectedValues.claimType == "nonCtcSelect") {
              $scope.getNonCtcClaimApplicationList();
        
              $("#ctcClaimListCard").hide();
              $("#nonCtcClaimListCard").show();
              $("#ltaClaimListCard").hide();
              $("#claimApplicationIDReq").hide();
        
            }
        
            else if ($scope.selectedValues.claimType == "travelSelect") {
              $scope.getClaimRequestList();
        
              $("#ctcClaimListCard").hide();
              $("#nonCtcClaimListCard").hide();
              $("#ltaClaimListCard").hide();
              $("#claimApplicationIDReq").show();
              $("#claimApplicationReq").show();
              
        
            }
        
            else if ($scope.selectedValues.claimType == "ltaSelect") {
              $scope.getLtaClaimApplicationList();
        
              $("#ctcClaimListCard").hide();
              $("#nonCtcClaimListCard").hide();
              $("#ltaClaimListCard").show();
              $("#claimApplicationIDReq").hide();
            } else {
                
            }
          }
          
          $scope.reDirectToNewCTCClaimPage = function () {
            $rootScope.claimPeriodSelected = $scope.requesObject.fYearId  
            $state.go('newCTCClaimApplication')
          }
        
          $scope.reDirectToNewNonCTCClaimPage = function () {
            $rootScope.claimPeriodSelected = $scope.requesObject.fYearId  
            $state.go('newNonCTCClaimApplication')
          }
        
          $scope.reDirectToNewLTAClaimPage = function () {
            $rootScope.claimPeriodSelected = $scope.requesObject.fYearId  
            $state.go('newLTAClaimApplication')
          }
        
          // $scope.goToApprovals = function () {
          //   $state.go('MyApprovalsCombined')
          // }

          $scope.refreshCTCList = function () {
            $scope.ctcclaimListFetched = false;
            $scope.getCtcClaimApplicationList();
        
          }
          $scope.refreshNCTCList = function () {
            $scope.nctcclaimListFetched = false;
            $scope.getNonCtcClaimApplicationList();
        
          }
          $scope.refreshLTAList = function () {
            $scope.ltaclaimListFetched = false;
            $scope.getLtaClaimApplicationList();
          }
          $scope.refreshTraList = function () {
        
            $scope.travelListFetched = false;
            $scope.getTravelRequestList();
          }
          $scope.refreshTraClaimList = function () {
        
            $scope.travelClaimListFetched = false;
            $scope.getClaimRequestList();
          }
          $scope.getRequestCounts = function () {
            $ionicLoading.show();
            $scope.viewRequisitionApprovalService = new viewRequisitionApprovalService();
            $scope.viewRequisitionApprovalService.$save(function (data) {
              if (!(data.clientResponseMsg == "OK")) {
                $ionicLoading.hide();
                console.log(data.clientResponseMsg)
                handleClientResponse(data.clientResponseMsg, "viewRequisitionApprovalService")
              }
              //document.getElementById('fullPage').style.display = "visible"
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


                
                  
          $scope.claimTabClicked()
          
				  return
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
              $ionicLoading.hide();
              
            }, function (data) {
              autoRetryCounter = 0
              $ionicLoading.hide()
              commonService.getErrorMessage(data, "app.home.dashboard");
            });
          }

          $scope.reDirectToFreshClaimPage = function (claim) {

            if (claim.travelClaimStatus == null || claim.travelClaimStatus == "NOT INITIATED" ) {
              $rootScope.travelTransIdForClaimApply = claim.travelTransId;
              $rootScope.gv_travelShowDetailsFrom = "CLAIM_LIST";
              $state.go('claimTravelDetails');
            } else {
              $rootScope.travelTransIdForClaimApply = claim.travelTransId;
              $rootScope.claimIdForClaimDetials = claim.travelClaimId;
              $rootScope.gv_travelShowDetailsFrom = "CLAIM_LIST";
              $state.go('claimApplicationDetails');
            }
          }

          $scope.redirectToNonCtcDetails = function (nonctcclaimApp) {
            $rootScope.nonCtcObjectForApprovalRejection = nonctcclaimApp
            $state.go('nonCTCClaimApproval');
          }

          $scope.claimTabClicked  = function () {
	
            $scope.requesObject.menuId = '2004';
            $scope.requesObject.buttonRights = 'Y-Y-Y-Y';
            
            $scope.viewClaimFormService = new viewClaimFormService();
            $scope.viewClaimFormService.$save($scope.requesObject, function (data) {
              if (!(data.clientResponseMsg == "OK")) {
                console.log(data.clientResponseMsg)
                handleClientResponse(data.clientResponseMsg, "viewClaimFormService")
                return
              }	  
              if (data.ctcPeriodVOList){
                $scope.ctcPeriodVOList = data.ctcPeriodVOList;
                
                sel = document.getElementById('periodDD')
                if (sel.options.length > 0){
                    sel.options[0].selected = true
                }
                
                if(sel!=null && $scope.ctcPeriodVOList.length>0){
                    $scope.selectedValues.periodId = $scope.ctcPeriodVOList[0].periodId
                    $scope.requesObject.fYearId  = $scope.selectedValues.periodId
                    
                }
              }


              
              
              if ($rootScope.reqestPageLastTab == "CLAIM_CTC"){
                  
                  $scope.getCClaimList();
              }else if ($rootScope.reqestPageLastTab == "CLAIM_NONCTC"){
                  
                  $scope.getNClaimList();
              }else if ($rootScope.reqestPageLastTab == "CLAIM_LTA"){
                  
                  $scope.getLClaimList();
              }else if ($rootScope.reqestPageLastTab == "CLAIM_TRAVEL"){
                  
                  $scope.getClaimRequestList();
              }else{
                  //this is first time here , totoalclaim count >  0
                  if ($scope.IsExpenseClaimAccessible=='true'){
                      //defualt to ctc
                    //$('.center').slick('slickGoTo', 5);
                    $scope.getCClaimList();
                  }else{
                    //$('.center').slick('slickGoTo', 5);
                    $scope.getClaimRequestList();
                  }
              }
              
              
              //$scope.selectedValues.claimType = "ctcSelect"
              ////$scope.getClaimList()
              //$scope.getCClaimList()
              
              
          }, function (data, status) {
              autoRetryCounter = 0
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
            });
          }

          $scope.periodChange = function(){
            
            elem = document.getElementById('periodDD')
            $scope.requesObject.fYearId  = $scope.ctcPeriodVOList[elem.selectedIndex].periodId
            if (elem.selectedIndex != 0 ){
              $scope.ctcRequests = 0
              $scope.nonCtcRequests = 0
            }else{
              $scope.getRequestCounts();
            }

            $scope.ctcclaimListFetched = false
            $scope.nctcclaimListFetched = false
            $scope.ltaclaimListFetched = false
            $scope.travelListFetched = false;
    
            
            if ($rootScope.reqestPageLastTab == "CLAIM_CTC"){
                $scope.ctcclaimListFetched  = false
                $scope.getCClaimList();
            }else if ($rootScope.reqestPageLastTab == "CLAIM_NONCTC"){
                $scope.nctcclaimListFetched = false
                $scope.getNClaimList();
            }else if ($rootScope.reqestPageLastTab == "CLAIM_LTA"){
                $scope.ltaclaimListFetched = false
                $scope.getLClaimList();
            }else if ($rootScope.reqestPageLastTab == "CLAIM_TRAVEL"){
                $scope.travelListFetched = false;
                $scope.getClaimRequestList();
            }else{
                $scope.travelClaimListFetched = false;
                $scope.getCClaimList();
            }
        }


        $scope.getTravelRequestList = function () {
            $scope.requesObject = {}
            $scope.searchObj = '';
            
            $rootScope.reqestPageLastTab = "TRAVEL"
            document.getElementById("periodDD").style.visibility = "hidden"
            if ($scope.travelListFetched == true) {
              $ionicLoading.hide()
              return;
            }
            
            $scope.travelListFetched = true;
            var travelMenuInfo = getMenuInformation("Travel Management", "Travel Application");
            $scope.requesObject.menuId = travelMenuInfo.menuId;
            $scope.requesObject.menuId = '2607'
            $scope.requesObject.buttonRights = "Y-Y-Y-Y"
            $scope.requesObject.formName = "Travel"
            $scope.requesObject.SelfRequestListFlag = 1;
            $ionicLoading.show({});
        
        
            $scope.getTravelApplicationListService = new getTravelApplicationListService();
            $scope.getTravelApplicationListService.$save($scope.requesObject, function (data) {
              if (!(data.clientResponseMsg == "OK")) {
                console.log(data.clientResponseMsg)
                handleClientResponse(data.clientResponseMsg, "getTravelApplicationListService")
              }
              $ionicLoading.hide();
              $scope.travelApplList = []
              if (data.selfTravelList == undefined) {
                $ionicLoading.hide();
              } else if (data.selfTravelList.length == 0) {
                $ionicLoading.hide();
              } else {
                $scope.travelApplList = data.selfTravelList
                $scope.createDate = data.selfTravelList[0].reqDate;
              }
        
              for (var i = 0; i < $scope.travelApplList.length; i++) {
                if ($scope.travelApplList[i].travelDate.length == 10) {
                  $scope.travelFromFormatedDate = $scope.travelApplList[i].travelDate.split('/')
                  $scope.travelApplList[i].travelDate = new Date($scope.travelFromFormatedDate[2] + '/' + $scope.travelFromFormatedDate[1] + '/' + $scope.travelFromFormatedDate[0])
                }
              }
              for (var i = 0; i < $scope.travelApplList.length; i++) {
                $scope.travelApplList[i].designation = sessionStorage.getItem('designation')
                $scope.travelApplList[i].department = sessionStorage.getItem('department');
                $scope.travelApplList[i].empName = sessionStorage.getItem('empName');
                $scope.travelApplList[i].name = sessionStorage.getItem('empName');
                
                if($scope.travelApplList[i].approvalRemarks){
                    $scope.travelApplList[i].approvalRemarks = $scope.travelApplList[i].approvalRemarks.replace(/<br>/g, "\n")
                    $scope.travelApplList[i].approvalRemarks = $scope.travelApplList[i].approvalRemarks.replace(/<BR>/g, "\n")
                    $scope.travelApplList[i].approvalRemarks = $scope.travelApplList[i].approvalRemarks.replace(/&#10;/g, "\n")
                    $scope.travelApplList[i].approvalRemarks = $scope.travelApplList[i].approvalRemarks.replace(/&#13;/g, "\n")
                }
                
                if (sessionStorage.getItem('photoFileName')) {
                  $scope.travelApplList[i].photoFileName = sessionStorage.getItem('photoFileName')
                  $scope.travelApplList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
                }
                else {
                  $scope.travelApplList[i].photoFileName = ''
                  $scope.travelApplList[i].profilePhoto = ''
                }
              }
        
              $ionicLoading.hide()
            }, function (data, status) {
              autoRetryCounter = 0
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
        
            });
        
          }
      
        $scope.redirectToLtaApproval = function (ltaclaimApp) {
          $rootScope.SourcePage = "request_page"
          $rootScope.ltaObjectForApprovalRejection = ltaclaimApp
          $state.go('ltaClaimApproval');
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
        $scope.openFileCTCClaim = function(idx,claimObj){
		
            var fd = new FormData();
            fd.append("additionalId",claimObj.ctcClaimId)
            fd.append("file",idx )
            
            
            $.ajax({
                    url: baseURL + '/api/claimForm/openFileByCtcClaimId.spr',
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
                                    handleClientResponse(result.clientResponseMsg,"openFileByCtcClaimId")
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

		$scope.reDirectToFreshTravelPage = function () {

			$state.go('travelApplication');

		}
		
		
        function Initialize() {
            $("#claimApplicationIDReq").show();
            $("#ctcClaimListCard").hide();
            $("#nonCtcClaimListCard").hide();
            $("#ltaClaimListCard").hide();
            $ionicLoading.show();
            $timeout(function () {
              $scope.getRequestCounts();
            //$scope.getTravelRequestList();
            //$scope.getShiftChangeRequestList();
            //$scope.getRegularizationRequestList();
            
            },500)
            

          }
          Initialize();



    });