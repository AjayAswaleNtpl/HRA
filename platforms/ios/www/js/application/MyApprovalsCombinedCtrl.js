/*
 1.This controller is used to Approve / Reject for Leave,Shift,Attendance,OD.
 2.Sent for cancellation requests are also Approved / Reject for Leave,Shift,Attendance,OD.
 3.Detailed view can be seen while opening modal by clicking on the list.
 */
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
mainModule.factory("getTravelApplicationReporteeListService", function ($resource) {
  return $resource((baseURL + '/api/travelApplication/getTravelApplicationReporteeList.spr'), {}, { 'save': { method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 } } }, {});
});
mainModule.factory("singleApproveTravelAppService", function ($resource) {
  return $resource((baseURL + '/api/travelApplication/singleApproveTravelApp.spr'), {}, { 'save': { method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 } } }, {});
});
mainModule.factory("singleRejectTravelAppService", function ($resource) {
  return $resource((baseURL + '/api/travelApplication/singleRejectTravelApp.spr'), {}, { 'save': { method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 } } }, {});
});
mainModule.factory("getPhotoService", function ($resource) {
  return $resource((baseURL + '/api/eisCompany/checkProfilePhoto.spr'), {}, { 'save': { method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 } } }, {});
});

mainModule.factory("viewTravelClaim", function ($resource) {
  return $resource((baseURL + '/api/travelClaim/viewTravelClaim.spr'), {}, { 'save': { method: 'POST', timeout: commonRequestTimeout,
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
mainModule.factory("viewLeaveApplicationService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/leaveApplication/viewLeaveApplication.spr'), {}, {
    'save': {
      method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
    }
  }, {});
}]);
mainModule.factory("detailsService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/leaveApplication/details.spr'), {}, {
    'save': {
      method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
    }
  }, {});
}]);
mainModule.factory("viewODPendingApplicationService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/odApplication/getPendingODApplication.spr'), {}, {
    'save': {
      method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
    }
  }, {});
}]);
mainModule.factory("approvePendingODService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/odApplication/approve.spr'), {}, {
    'save': {
      method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
    }
  }, {});
}]);
mainModule.factory("rejectPendingODService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/odApplication/reject.spr'), {}, {
    'save': {
      method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
    }
  }, {});
}]);

mainModule.factory("approvePendingClaimService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/claimForm/approveRequest.spr'), {}, {
    'save': {
      method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
    }
  }, {});
}]);
mainModule.factory("rejectPendingClaimService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/claimForm/rejectRequest.spr'), {}, {
    'save': {
      method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
    }
  }, {});
}]);
mainModule.factory("viewAttendaceRegularisationService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/attendance/missPunch/viewApprove.spr'), {}, {
    'save': {
      method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
    }
  }, {});
}]);
mainModule.factory("viewShiftChangeApprovalService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/attendance/shiftChange/viewShiftChangeApprove.spr'), {}, {
    'save': {
      method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
    }
  }, {});
}]);
mainModule.factory("getPhotoService", function ($resource) {
  return $resource((baseURL + '/api/eisCompany/checkProfilePhoto.spr'), {}, { 'save': { method: 'POST', timeout: commonRequestTimeout } }, {});
});
mainModule.controller('MyApprovalsCombinedCtrl', function ($scope, viewClaimFormService, getPhotoService,
  $filter, getTravelApplicationReporteeListService, $ionicLoading, $ionicModal, homeService,
  getRequisitionCountService, singleApproveTravelAppService, singleRejectTravelAppService, viewTravelClaim,
  getSetService, $rootScope, commonService, $ionicPopup, $http, viewAttendaceRegularisationService,
  getRequisitionCountService, viewShiftChangeApprovalService, viewODPendingApplicationService,
  rejectPendingODService, approvePendingODService, $ionicLoading, $ionicModal, viewLeaveApplicationService,
  approvePendingClaimService, rejectPendingClaimService,
  detailsService, homeService, $timeout, $state) {

  $state.go("app.approvalsMenu")
  return
  
  if ($rootScope.navHistoryCurrPage == "requisition")
  {
	  if ($rootScope.HomeDashBoard){
		$rootScope.navHistoryPrevPage = "dashboard"
	  }else{
		  $rootScope.navHistoryPrevPage = "selfservices"
	  }
	  $rootScope.navHistoryCurrPage = "approvals"
  }else{
	$rootScope.navHistoryPrevPage = $rootScope.navHistoryCurrPage
	$rootScope.navHistoryCurrPage = "approvals"
  }
  
  $scope.navigateToPageWithCount = true

  console.log ("HRAPI VERSION:  " + getMyHrapiVersionNumber())
  
    

  	$scope.IsLeaveAccessible = sessionStorage.getItem('IsLeaveAccessible');
	$scope.IsODAccessible = sessionStorage.getItem('IsODAccessible');
	$scope.IsRegularizationAccessible = sessionStorage.getItem('IsRegularizationAccessible');
	$scope.IsShiftChangeAccessible = sessionStorage.getItem('IsShiftChangeAccessible');
	
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
	
	//$scope.showPunchDetailsFeature='false'
	$scope.isARTorFRT = sessionStorage.getItem('IsARTorFRT');
    $scope.isGroupMasterReportee = sessionStorage.getItem('isGroupMasterReportee');
	
	$scope.selectedValues = {}
	
	
/* for testing
  $scope.IsLeaveAccessible = 'true'
  $scope.IsODAccessible = 'true'
  $scope.IsRegularizationAccessible = 'true'
  $scope.IsShiftChangeAccessible = 'true'
  $scope.IsTravelAccessible = 'false'
  $scope.IsClaimAccessible = 'false' // travel claim
  $scope.IsExpenseClaimAccessible = 'false'
*/
  
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
  $scope.ODPendingObject = {}
  $scope.claimPendingCObject = {}
  $scope.claimPendingLObject = {}
  $scope.claimPendingNObject = {}
  $scope.detailResObject = {}
  $scope.attendanceObject = {}
  $scope.approveAtendanceObject = {}
  $scope.resultobj = {}
  var d = new Date();
  $("#claimApplicationID").hide();

  $('#ctcSelect1').css({ 'color': 'white', 'background': '#3B5998' });
  $("#ShiftChangeApplicationID").hide();
  $("#ODPendingApplicationID").hide();
  $("#AttendanceApplicationID").hide()
  $("#tabShiftChange").removeClass("active");
  $("#tabOD").removeClass("active");
  $("#tabRegularization").removeClass("active");
  $scope.searchObj = ''
  $("#ClaimPendingApplicationID").hide();
  $("#TravelPendingApplicationID").hide();
  $("#tabClaim").removeClass("active");
  $("#tabTravel").removeClass("active");
  $("#tabClaim").removeClass("active");
  $("#ClaimPendingApplicationID").hide();

  if (sessionStorage.getItem('department') && (sessionStorage.getItem('displayDeptName') == '"Department"')) {
    $scope.resultobj.department = sessionStorage.getItem('department');
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
    $scope.getTravelApplicationReporteeListService = new getTravelApplicationReporteeListService();
    $scope.getTravelApplicationReporteeListService.$save($scope.requesObject, function (data) {
      if (!(data.clientResponseMsg == "OK")) {
        console.log(data.clientResponseMsg)
        handleClientResponse(data.clientResponseMsg, "viewLeaveApplicationService")
		showAlert("Something went wrong. Please try later.")
        $ionicLoading.hide()
        showAlert("Something went wrong. Please try later.")
        return
      }
      $scope.travelAppList = []
      if (data.reporteeList.length == 0) {
        $ionicLoading.hide()
        return;
      }
      $scope.travelAppList = data.reporteeList

      for (var i = 0; i < $scope.travelAppList.length; i++) {
        $scope.travelFromFormatedDate = $scope.travelAppList[i].reqDate.split('/')
        $scope.travelAppList[i].reqDate = new Date($scope.travelFromFormatedDate[2] + '/' + $scope.travelFromFormatedDate[1] + '/' + $scope.travelFromFormatedDate[0])
		
		if($scope.travelAppList[i].approvalRemarks != null)
        $scope.travelAppList[i].approvalRemarks = $scope.travelAppList[i].approvalRemarks.replace(/<br>/g, "\n")
	
		if($scope.travelAppList[i].approvedReason != null)
        $scope.travelAppList[i].approvedReason = $scope.travelAppList[i].approvedReason.replace(/<br>/g, "\n")
	
	
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

  $scope.getNonCtcClaimApprovalList = function () {
    $("#claimApplicationID").show();
    $("#applyClaim").show();
    $("#claimApproval").removeClass("active");
    $("#claimApplication").addClass("active");

    $("#ctcClaimApprovalCard").hide();
    $("#nonCtcClaimApprovalCard").show();
    $("#ltaClaimApprovalCard").hide();
    $("#leavePendingApplicationID").hide();
    $("#ODPendingApplicationID").hide();
    $("#AttendanceApplicationID").hide();
    $("#ShiftChangeApplicationID").hide();
    $scope.searchObj = ''
    $("#tabShiftChange").removeClass("active");
    $("#tabRegularization").removeClass("active");
    $("#tabOD").removeClass("active");
    $("#tabLeave").removeClass("active");

    $scope.searchObj = ''
    $("#ClaimPendingApplicationID").hide();
    $("#TravelPendingApplicationID").hide();
    $("#tabClaim").addClass("active");
    $("#tabTravel").removeClass("active");


    if ($scope.nonctcClaimlistFetched == true) {
      return;
    }
    $scope.nonctcClaimlistFetched = true

    //For NON CTC
    $scope.requesObject.ctcPayHeadId = '2';
    $scope.requesObject.reqApp = 'false';
    $scope.requesObject.reqRequest = 'false';
    $scope.requesObject.fYearId = '1';
    $scope.requesObject.SelfRequestListFlag = 1;
    $scope.requesObject.menuId = '2004';
    $scope.requesObject.buttonRights = 'Y-Y-Y-Y';
    $scope.requesObject.claimFlags = 'NONCTC';

    $ionicLoading.show();
    $scope.viewClaimFormService = new viewClaimFormService();
    $scope.viewClaimFormService.$save($scope.requesObject, function (data) {
      if (!(data.clientResponseMsg == "OK")) {
        console.log(data.clientResponseMsg)
		showAlert("Something went wrong. Please try later.")
        handleClientResponse(data.clientResponseMsg, "viewClaimFormService")
      }
      $scope.nonCTCClaimApprList = []
      if (data.claimReportList === undefined) {
        $ionicLoading.hide();
      } else if (data.claimReportList.length == 0) {
        $ionicLoading.hide();
      } else {
        $scope.nonCTCClaimApprList = data.claimReportList;
        for (var i = 0; i < $scope.nonCTCClaimApprList.length; i++) {
          if ($scope.nonCTCClaimApprList[i].fileName.length == 0) {
            $scope.nonCTCClaimApprList[i].fileName == "NA"
          }
		  if ($scope.nonCTCClaimApprList[i].monthId && parseInt($scope.nonCTCClaimApprList[i].monthId) > 0){
			  $scope.nonCTCClaimApprList[i].monthName = $scope.getMonthName($scope.nonCTCClaimApprList[i].monthId)
		  }
        }
        $ionicLoading.hide();
        return;

        $scope.createDate = data.claimReportList[0].createDate;
      }
      for (var i = 0; i < $scope.nonCTCClaimApprList.length; i++) {
        $scope.nonCTCClaimApprList[i].designation = sessionStorage.getItem('designation')
        $scope.nonCTCClaimApprList[i].department = sessionStorage.getItem('department');
        $scope.nonCTCClaimApprList[i].empName = sessionStorage.getItem('empName');
        $scope.nonCTCClaimApprList[i].name = sessionStorage.getItem('empName');
        if (sessionStorage.getItem('photoFileName')) {
          $scope.nonCTCClaimApprList[i].photoFileName = sessionStorage.getItem('photoFileName')
          $scope.nonCTCClaimApprList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
        }
        else {
          $scope.nonCTCClaimApprList[i].photoFileName = ''
          $scope.nonCTCClaimApprList[i].profilePhoto = ''
        }
      }
      $ionicLoading.hide()
    }, function (data, status) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
  }

  $scope.getLtaClaimApprovalList = function () {
    $("#claimApplicationID").show();
    $("#noData").show();
    $("#applyClaim").show();
    $("#claimApproval").removeClass("active");
    $("#claimApplication").addClass("active");

    $("#ctcClaimApprovalCard").hide();
    $("#nonCtcClaimApprovalCard").hide();
    $("#ltaClaimApprovalCard").show();
    $("#leavePendingApplicationID").hide();
    $("#ODPendingApplicationID").hide();
    $("#AttendanceApplicationID").hide();
    $("#ShiftChangeApplicationID").hide();
    $scope.searchObj = ''
    $("#tabShiftChange").removeClass("active");
    $("#tabRegularization").removeClass("active");
    $("#tabOD").removeClass("active");
    $("#tabLeave").removeClass("active");
    $scope.searchObj = ''
    $("#ClaimPendingApplicationID").hide();
    $("#TravelPendingApplicationID").hide();
    $("#tabClaim").addClass("active");
    $("#tabTravel").removeClass("active");

    if ($scope.ltaClaimlistFetched == true) {
      return;
    }
    $scope.ltaClaimlistFetched = true

    //For LTA
    $scope.requesObject.ctcPayHeadId = '3';
    $scope.requesObject.reqApp = 'false';
    $scope.requesObject.reqRequest = 'false';
    $scope.requesObject.fYearId = '1';
    $scope.requesObject.SelfRequestListFlag = 1;
    $scope.requesObject.menuId = '2009';
    $scope.requesObject.buttonRights = 'Y-Y-Y-Y';
    $scope.requesObject.claimFlags = 'LTACLAIM';

    $ionicLoading.show();
    $scope.viewClaimFormService = new viewClaimFormService();
    $scope.viewClaimFormService.$save($scope.requesObject, function (data) {
      if (!(data.clientResponseMsg == "OK")) {
        console.log(data.clientResponseMsg)
		showAlert("Something went wrong. Please try later.")
        handleClientResponse(data.clientResponseMsg, "viewClaimFormService")
      }
      $scope.ltaClaimApprList = []
      if (data.claimReportList === undefined) {
        $ionicLoading.hide();
      } else if (data.claimReportList.length == 0) {
        $ionicLoading.hide();
      } else {
        $scope.ltaClaimApprList = data.claimReportList;
        for (var i = 0; i < $scope.ltaClaimApprList.length; i++) {
          if ($scope.ltaClaimApprList[i].fileName.length == 0) {
            $scope.ltaClaimApprList[i].fileName == "NA"
          }
        }
        $ionicLoading.hide();
        return;

        $scope.createDate = data.claimReportList[0].createDate;
      }
      for (var i = 0; i < $scope.ltaClaimApprList.length; i++) {
        $scope.ltaClaimApprList[i].designation = sessionStorage.getItem('designation')
        $scope.ltaClaimApprList[i].department = sessionStorage.getItem('department');
        $scope.ltaClaimApprList[i].empName = sessionStorage.getItem('empName');
        $scope.ltaClaimApprList[i].name = sessionStorage.getItem('empName');
        if (sessionStorage.getItem('photoFileName')) {
          $scope.ltaClaimApprList[i].photoFileName = sessionStorage.getItem('photoFileName')
          $scope.ltaClaimApprList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
        }
        else {
          $scope.ltaClaimApprList[i].photoFileName = ''
          $scope.ltaClaimApprList[i].profilePhoto = ''
        }
      }
      $ionicLoading.hide()
    }, function (data, status) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
  }

  $scope.getCtcClaimApprovalList = function () {
    $("#claimApplicationID").show();
    $("#applyClaim").show();
    $("#ctcClaimApprovalCard").show();
    $("#nonCtcClaimApprovalCard").hide();
    $("#ltaClaimApprovalCard").hide();
    $("#claimApproval").removeClass("active");
    $("#leavePendingApplicationID").hide();
    $("#ODPendingApplicationID").hide();
    $("#AttendanceApplicationID").hide();
    $("#ShiftChangeApplicationID").hide();
    $scope.searchObj = ''
    $("#tabShiftChange").removeClass("active");
    $("#tabRegularization").removeClass("active");
    $("#tabOD").removeClass("active");
    $("#tabLeave").removeClass("active");

    $scope.searchObj = ''
    $("#ClaimPendingApplicationID").hide();
    $("#TravelPendingApplicationID").hide();
    $("#trClaimApprovalCard").hide();
    $("#tabClaim").addClass("active");
    $("#tabTravel").removeClass("active");

    if ($scope.ctcClaimlistFetched == true) {
		$ionicLoading.hide()
      return;
    }
    $scope.ctcClaimlistFetched = true

	
	$rootScope.approvePageLastTab = "CLAIM_CTC"
	
	
    $scope.requesObject.SelfRequestListFlag = 1;
    $scope.requesObject.reqRequest = 'false';
    //For CTC
    $scope.requesObject.ctcPayHeadId = '1';
    $scope.requesObject.reqApp = 'false';
    $scope.requesObject.fYearId = '1';
    $scope.requesObject.menuId = '2009';
    $scope.requesObject.buttonRights = 'Y-Y-Y-Y';
    $scope.requesObject.claimFlags = 'CTC';

    $ionicLoading.show();
    $scope.viewClaimFormService = new viewClaimFormService();
    $scope.viewClaimFormService.$save($scope.requesObject, function (data) {
      if (!(data.clientResponseMsg == "OK")) {
        console.log(data.clientResponseMsg)
		showAlert("Something went wrong. Please try later.")
        handleClientResponse(data.clientResponseMsg, "viewClaimFormService")
      }
      $scope.ctcClaimApprList = []
      if (data.claimReportList === undefined) {
        $ionicLoading.hide();
      } else if (data.claimReportList.length == 0) {
        $ionicLoading.hide();
      } else {
        $scope.ctcClaimApprList = data.claimReportList;
        for (var i = 0; i < $scope.ctcClaimApprList.length; i++) {
          if ($scope.ctcClaimApprList[i].fileName.length == 0) {
            $scope.ctcClaimApprList[i].fileName == "NA"
          }
		  if ($scope.ctcClaimApprList[i].month && parseInt($scope.ctcClaimApprList[i].month) > 0){
			  $scope.ctcClaimApprList[i].monthName = $scope.getMonthName($scope.ctcClaimApprList[i].month)
		  }
        }
        $ionicLoading.hide();
        return;

        $scope.createDate = data.claimReportList[0].createDate;
      }
      for (var i = 0; i < $scope.ctcClaimApprList.length; i++) {
        if (sessionStorage.getItem('photoFileName')) {
        }
        else {
          $scope.ctcClaimApprList[i].photoFileName = ''
          $scope.ctcClaimApprList[i].profilePhoto = ''
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
	//scope.ctcClaimlistFetched = false
    $scope.getCtcClaimApprovalList();
    $("#claimApplicationID").show();
    $("#ctcClaimApprovalCard").show();
    $("#trClaimApprovalCard").hide();
    $("#nonCtcClaimApprovalCard").hide();
    $("#ltaClaimApprovalCard").hide();
	
	$("#nonCtcSelect1").css({ color: "#3B5998", background: "transparent" });
    $("#travelSelect1").css({ color: "#3B5998", background: "transparent" });
    $("#ltaSelect1").css({ color: "#3B5998", background: "transparent" });
    $("#ctcSelect1").css({ color: "white", background: "#3B5998" });
	
	
	$rootScope.approvePageLastTab = "CLAIM_CTC"
  }
  $scope.getNClaimList = function () {
    //$scope.nonctcClaimlistFetched = false;
    $scope.getNonCtcClaimApprovalList();
    $("#claimApplicationID").show();
    $("#trClaimApprovalCard").hide();
    $("#ctcClaimApprovalCard").hide();
    $("#nonCtcClaimListCard").show();
    $("#ltaClaimApprovalCard").hide();
	
	$("#ctcSelect1").css({ color: "#3B5998", background: "transparent" });
    $("#travelSelect1").css({ color: "#3B5998", background: "transparent" });
    $("#ltaSelect1").css({ color: "#3B5998", background: "transparent" });
    $("#nonCtcSelect1").css({ color: "white", background: "#3B5998" });
	
	
	$rootScope.approvePageLastTab = "CLAIM_NONCTC"
  }
  $scope.getLClaimList = function () {
	 //$scope.ltaClaimlistFetched = false
    $scope.getLtaClaimApprovalList();
    $("#claimApplicationID").show();
    $("#trClaimApprovalCard").hide();
    $("#ctcClaimApprovalCard").hide();
    $("#nonCtcClaimListCard").hide();
    $("#ltaClaimApprovalCard").show();
	
	$("#nonCtcSelect1").css({ color: "#3B5998", background: "transparent" });
    $("#ctcSelect1").css({ color: "#3B5998", background: "transparent" });
    $("#travelSelect1").css({ color: "#3B5998", background: "transparent" });
    $("#ltaSelect1").css({ color: "white", background: "#3B5998" });
	
	
	$rootScope.approvePageLastTab = "CLAIM_LTA"
  }
  $scope.getTrClaimList = function () {
	//$scope.trClaimlistFetched = false 
    $scope.getTrClaimApprovalList();
    $("#claimApplicationID").show();
    $("#ctcClaimApprovalCard").hide();
    $("#nonCtcClaimApprovalCard").hide();
    $("#ltaClaimApprovalCard").hide();
    $("#trClaimApprovalCard").show();
	
	
	$("#nonCtcSelect1").css({ 'color': '#3B5998', 'background': 'transparent' });
    $("#ctcSelect1").css({ 'color': '#3B5998', 'background': 'transparent' });
    $("#ltaSelect1").css({ 'color': '#3B5998', 'background': 'transparent' });
    $("#travelSelect1").css({ 'color': 'white', 'background': '#3B5998' });
    
	
	$rootScope.approvePageLastTab = "CLAIM_TRAVEL"
  }

  $scope.leaveListFetched = false
  $scope.odListFetched = false
  $scope.attListFetched = false
  $scope.travelListFetched = false
  $scope.scListFetched = false
  $scope.ctcClaimlistFetched = false
  $scope.nonctcClaimlistFetched = false
  $scope.ltaClaimlistFetched = false
  $scope.trClaimlistFetched = false

  $scope.getLeaveList = function () {
    homeService.updateInboxEmailList("", function () { }, function (data) { })

    $scope.searchObj = ''
    $("#ShiftChangeApplicationID").hide();
    $("#leavePendingApplicationID").show();
    $("#ODPendingApplicationID").hide();
    $("#AttendanceApplicationID").hide()
    $("#tabShiftChange").removeClass("active");
    $("#tabLeave").addClass("active");
    $("#tabOD").removeClass("active");
    $("#tabRegularization").removeClass("active");
    $scope.searchObj = ''
    $("#ClaimPendingApplicationID").hide();
    $("#TravelPendingApplicationID").hide();
    $("#tabClaim").removeClass("active");
    $("#tabTravel").removeClass("active");
    $("#tabClaim").removeClass("active");
    $("#claimApplicationID").hide();
    
	
	$rootScope.approvePageLastTab = "LEAVE"
	
	
    if ($scope.leaveListFetched == true) {
      return;
    }
    $scope.leaveListFetched = true
    $ionicLoading.show();
    $scope.requesObject = {}
    var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
    $scope.requesObject.menuId = leaveMenuInfo.menuId;
    $scope.requesObject.buttonRights = "Y-Y-Y-Y"
    $scope.requesObject.formName = "Leave";
    $scope.requesObject.SelfRequestListFlag = 0;
    $ionicLoading.show()
    $scope.viewLeaveApplicationService = new viewLeaveApplicationService();
    $scope.viewLeaveApplicationService.$save($scope.requesObject, function (data) {
      if (!(data.clientResponseMsg == "OK")) {
        console.log(data.clientResponseMsg)
		showAlert("Something went wrong. Please try later.")
        handleClientResponse(data.clientResponseMsg, "viewLeaveApplicationService")
        $ionicLoading.show()
      }
      if (data.msg == "ERROR") {
        $ionicLoading.hide()
        showAlert("Error", "Something went wrong");
        return;
      }
      if (data.reporteeLeaveList.length != 0) {
        $scope.createDate = data.reporteeLeaveList[0].createDate;
      }

      $scope.leaveApplList = []
      if (data.reporteeLeaveList === undefined) {
        //do nothing
      } else {
        $scope.leaveApplList = data.reporteeLeaveList;
      }

      for (var i = 0; i < $scope.leaveApplList.length; i++) {
        $scope.leaveStatus = $scope.leaveApplList[i].leaveStatus
        $scope.leaveFromFormatedDate = $scope.leaveApplList[i].leaveFromDate.split('/')
        $scope.leaveApplList[i].leaveFromDate = new Date($scope.leaveFromFormatedDate[2] + '/' + $scope.leaveFromFormatedDate[1] + '/' + $scope.leaveFromFormatedDate[0])
        $scope.leaveToFormatedDate = $scope.leaveApplList[i].leaveToDate.split('/')
        $scope.leaveApplList[i].leaveToDate = new Date($scope.leaveToFormatedDate[2] + '/' + $scope.leaveToFormatedDate[1] + '/' + $scope.leaveToFormatedDate[0])
        if ($scope.leaveApplList[i].leaveFromDate.getTime() == $scope.leaveApplList[i].leaveToDate.getTime()) {
          $scope.leaveApplList[i].leaveDate = $scope.leaveApplList[i].leaveFromDate;
        }
		if ($scope.leaveApplList[i].approverRemark){
			$scope.leaveApplList[i].approverRemark = $scope.leaveApplList[i].approverRemark.replace(/<BR>/g, "\n")
		}
      }

      var index = 0
      while (index != $scope.leaveApplList.length) {
        $scope.getLeavePhotos(index)
        index++
      }

      $scope.requesObjectForYear.year = ''
      $scope.requesObjectForMonth.month = ''
      $timeout(function () { $ionicLoading.hide() }, 1500)
    }, function (data) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
  }

  $scope.getLeavePhotos = function (index) {
    $scope.resultObjectForLeavePic = {}
    $scope.resultObjectForLeavePic.empId = $scope.leaveApplList[index].empId
    $scope.getPhotoService = new getPhotoService();
    $scope.getPhotoService.$save($scope.resultObjectForLeavePic, function (success) {

      if (success.profilePhoto != null && success.profilePhoto != "") {
        $scope.leaveApplList[index].imageFlag = "0"
        $scope.leaveApplList[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=';
      }
      else {
        $scope.leaveApplList[index].imageFlag = "1"
        $scope.leaveApplList[index].profilePhoto = ""
      }
    }, function (data) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
  }





  $scope.getTrClaimApprovalList = function () {

    $("#claimApplicationID").show();
    $("#applyClaim").show();
    $("#ctcClaimApprovalCard").hide();
    $("#nonCtcClaimApprovalCard").hide();
    $("#ltaClaimApprovalCard").hide();
    $("#trClaimApprovalCard").show();
    $("#claimApproval").removeClass("active");
    $("#leavePendingApplicationID").hide();
    $("#ODPendingApplicationID").hide();
    $("#AttendanceApplicationID").hide();
    $("#ShiftChangeApplicationID").hide();
    $scope.searchObj = ''
    $("#tabShiftChange").removeClass("active");
    $("#tabRegularization").removeClass("active");
    $("#tabOD").removeClass("active");
    $("#tabLeave").removeClass("active");

    $scope.searchObj = ''
    $("#ClaimPendingApplicationID").hide();
    $("#TravelPendingApplicationID").hide();
    $("#tabClaim").addClass("active");
    $("#tabTravel").removeClass("active");


    if ($scope.trClaimlistFetched == true) {
      return;
    }
    $scope.trClaimlistFetched = true

    homeService.updateInboxEmailList("", function () { }, function (data) { })
    $scope.requesObject1 = {}

    $ionicLoading.show();
    var clMenuInfo = getMenuInformation("Travel Management", "Travel Claim Requisition");
    $scope.requesObject1.menuId = clMenuInfo.menuId
    $scope.requesObject1.buttonRights = "Y-Y-Y-Y"

    $scope.requesObject1.menuId = '2609'
    $scope.viewTravelClaim = new viewTravelClaim();
    $scope.viewTravelClaim.$save($scope.requesObject1, function (data) {


      $ionicLoading.hide()
      $scope.reporteeList = data.reporteeList
      var index = 0
      while (index != $scope.reporteeList.length) {
        $scope.getClaimPhotos(index)
        index++
      }

    }
      , function (data) {
        alert(data.status)
        autoRetryCounter = 0
        $ionicLoading.hide()
        commonService.getErrorMessage(data);
      });

  }


  $scope.getClaimPhotos = function (index) {

    if ($scope.reporteeList[index] === undefined) {
      return
    }

    $scope.reporteeList[index].photoFileName = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + $scope.reporteeList[index].empId
    return
  }


  $scope.showClaimlDetailForm = function (claim) {
    $rootScope.travelTransIdForClaimApply = claim.travelTransId
    $rootScope.claimIdForClaimDetials = claim.travelClaimId
    $rootScope.statusForClaimDetials = claim.travelClaimStatus
    $state.go('claimApplicationDetailsApprove');
  }

  $scope.getODApplicationList = function () {

    homeService.updateInboxEmailList("", function () { }, function (data) { })
    $("#leavePendingApplicationID").hide();
    $("#ShiftChangeApplicationID").hide();
    $("#ODPendingApplicationID").show();
    $("#AttendanceApplicationID").hide()
    $scope.searchObj = ''
    $("#tabShiftChange").removeClass("active");
    $("#tabOD").addClass("active");
    $("#tabLeave").removeClass("active");
    $("#tabRegularization").removeClass("active");
    $scope.searchObj = ''
    $("#ClaimPendingApplicationID").hide();
    $("#TravelPendingApplicationID").hide();
    $("#tabClaim").removeClass("active");
    $("#tabTravel").removeClass("active");
    $("#claimApplicationID").hide();
    $("#tabClaim").removeClass("active");
    
	
	$rootScope.approvePageLastTab = "OD"

    if ($scope.odListFetched == true) {
      return;
    }
    $scope.odListFetched = true
    $ionicLoading.show();
    var odMenuInfo = getMenuInformation("Attendance Management", "OD Application");
    $scope.requesObject1.menuId = odMenuInfo.menuId;
    $scope.viewODPendingApplicationService = new viewODPendingApplicationService();
    $scope.viewODPendingApplicationService.$save($scope.requesObject1, function (data) {
      $scope.ODPendingApplList = []
      if (data.odApplicationVoList == null) {
        $ionicLoading.hide()
        return;
      }
      $scope.ODPendingApplList = data.odApplicationVoList;
      for (var i = 0; i < $scope.ODPendingApplList.length; i++) {
        $scope.odFormatedFromDate = $scope.ODPendingApplList[i].travelDate.split('/')
        $scope.ODPendingApplList[i].odFromDate = new Date($scope.odFormatedFromDate[2] + '/' + $scope.odFormatedFromDate[1] + '/' + $scope.odFormatedFromDate[0])
        $scope.odFormatedToDate = $scope.ODPendingApplList[i].travelDate_new.split('/')
        $scope.ODPendingApplList[i].odToDate = new Date($scope.odFormatedToDate[2] + '/' + $scope.odFormatedToDate[1] + '/' + $scope.odFormatedToDate[0])
		if ($scope.ODPendingApplList[i].odFromDate.getDate() == $scope.ODPendingApplList[i].odToDate.getDate()) {
        //if ($scope.ODPendingApplList[i].odFromDate.getTime() == $scope.ODPendingApplList[i].odToDate.getTime()) {
          $scope.ODPendingApplList[i].odDate = $scope.ODPendingApplList[i].odFromDate;
		  $scope.ODPendingApplList[i].odToDate = null
        }
		
		dtHrapiFormatFromDateOD = $scope.odFormatedFromDate[0] + '/' + $scope.odFormatedFromDate[1] + '/' + $scope.odFormatedFromDate[2]
		$scope.ODPendingApplList[i].dtHrapiFormatFromDateOD = dtHrapiFormatFromDateOD
		dtHrapiFormatToDateOD = $scope.odFormatedToDate[0] + '/' + $scope.odFormatedToDate[1] + '/' + $scope.odFormatedToDate[2]
		$scope.ODPendingApplList[i].dtHrapiFormatToDateOD = dtHrapiFormatToDateOD
		
      }
      var index = 0
      while (index != $scope.ODPendingApplList.length) {
        $scope.getODPhotos(index)
        index++
      }
      $scope.requesObjectForYear.year = ''
      $scope.requesObjectForMonth.month = ''
      $ionicLoading.hide()
    }
      , function (data) {
        autoRetryCounter = 0
        $ionicLoading.hide()
        commonService.getErrorMessage(data);
      });
  }

  $scope.getODPhotos = function (index) {
    $scope.resultObjectForODPic = {}
    $scope.resultObjectForODPic.empId = $scope.ODPendingApplList[index].empId
    $scope.getPhotoService = new getPhotoService();
    $scope.getPhotoService.$save($scope.resultObjectForODPic, function (success) {
      if (success.profilePhoto != null && success.profilePhoto != "") {
        $scope.ODPendingApplList[index].imageFlag = "0"
        $scope.ODPendingApplList[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=';
      }
      else {
        $scope.ODPendingApplList[index].imageFlag = "1"
        $scope.ODPendingApplList[index].profilePhoto = ""
      }
    }, function (data) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
  }

  $scope.getAttendanceApplicationListForCurrentYear = function () {
    $scope.requesObjectForYear.year = null;
    $scope.attListFetched = false
    $scope.getAttendanceApplicationList()
  }
  $scope.getAttendanceApplicationListForPrevYear = function () {
    if ($scope.requesObjectForYear.year < new Date().getFullYear()) {
      return
    }
    $scope.requesObjectForYear.year = new Date().getFullYear()
    $scope.requesObjectForYear.year = $scope.requesObjectForYear.year - 1
    $scope.attListFetched = false
    $scope.getAttendanceApplicationList()
  }

  $scope.getAttendanceApplicationList = function () {
    homeService.updateInboxEmailList("", function () { }, function (data) { })
    $scope.attendanceObject = {}
    $("#leavePendingApplicationID").hide();
    $("#ShiftChangeApplicationID").hide();
    $("#ODPendingApplicationID").hide();
    $("#AttendanceApplicationID").show()
    $scope.searchObj = ''
    $("#tabShiftChange").removeClass("active");
    $("#tabOD").removeClass("active");
    $("#tabLeave").removeClass("active");
    $("#tabRegularization").addClass("active");

    $scope.searchObj = ''
    $("#ClaimPendingApplicationID").hide();
    $("#TravelPendingApplicationID").hide();
    $("#tabClaim").removeClass("active");
    $("#tabTravel").removeClass("active");
    $("#claimApplicationID").hide();
    $("#tabClaim").removeClass("active");
    
	
	$rootScope.approvePageLastTab = "ATTREG"

    var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");
    $scope.attendanceObject.menuId = attendanceMenuInfo.menuId;
    $scope.attendanceObject.buttonRights = "Y-Y-Y-Y"
    if (!$scope.requesObjectForYear.year) {
      $scope.attendanceObject.year = new Date().getFullYear();
      $scope.requesObjectForYear.year = $scope.attendanceObject.year.toString()
    } else {
      $scope.attendanceObject.year = $scope.requesObjectForYear.year;
      $scope.requesObjectForYear.year = $scope.attendanceObject.year
      $scope.requesObjectForMonth.month.month = ''
    }
    if ($scope.requesObjectForMonth.month == undefined || $scope.requesObjectForMonth.month == "") {
      $scope.attendanceObject.monthId = parseInt(new Date().getMonth()) + 1;
      $scope.requesObjectForMonth.month = $scope.attendanceObject.monthId
    } else {
      $scope.attendanceObject.monthId = $scope.requesObjectForMonth.month;
    }
    //sending monthid as 0 to fetch whole year data
    $scope.attendanceObject.monthId = 0
    if ($scope.requesObjectForYear.year == new Date().getFullYear()) {
      //current year
      $scope.yearInfo = "CURRENT"

    } else if (new Date().getFullYear() - $scope.requesObjectForYear.year == 1) {
      //prev year
      $scope.yearInfo = "PREVIOUS"
    }

    $("#leavePendingApplicationID").hide();
    $("#ODPendingApplicationID").hide();
    $("#ShiftChangeApplicationID").hide();
    $("#AttendanceApplicationID").show()
    $scope.searchObj = ''
    $("#tabShiftChange").removeClass("active");
    $("#tabRegularization").addClass("active");
    $("#tabOD").removeClass("active");
    $("#tabLeave").removeClass("active");

    $scope.searchObj = ''
    $("#ClaimPendingApplicationID").hide();
    $("#TravelPendingApplicationID").hide();
    $("#tabClaim").removeClass("active");
    $("#tabTravel").removeClass("active");
    $("#claimApplicationID").hide();
    $("#tabClaim").removeClass("active");
    

    if ($scope.attListFetched == true) {
      return;
    }
    $scope.attListFetched = true

    $ionicLoading.show();
    $scope.viewAttendaceRegularisationService = new viewAttendaceRegularisationService();
    $scope.viewAttendaceRegularisationService.$save($scope.attendanceObject, function (data) {
      if (!(data.clientResponseMsg == "OK")) {
        console.log(data.clientResponseMsg)
		showAlert("Something went wrong. Please try later.")
        handleClientResponse(data.clientResponseMsg, "viewAttendaceRegularisationService")
      }
	  $scope.AttendanceApplList = []
      if (data.listMonth === undefined) {
        $ionicLoading.hide()
        return;
      }
      $scope.monthList = data.listMonth;
      $scope.yearListforAtt = data.missedPunchForm.listYear;
      
      if (data.missedPunchVOList === undefined) {
        //do nothing
      } else {
        $scope.AttendanceApplList = data.missedPunchVOList;
      }

  	  
      for (var i = 0; i < $scope.AttendanceApplList.length; i++) {
        $scope.outTimeDate = $scope.AttendanceApplList[i].outTimeDateStr.split('/')
        $scope.AttendanceApplList[i].outTimeDateStr = new Date($scope.outTimeDate[2] + '/' + $scope.outTimeDate[1] + '/' + $scope.outTimeDate[0])
		
		if ($scope.AttendanceApplList[i].lastAppRemarks){	
			$scope.AttendanceApplList[i].lastAppRemarks = $scope.AttendanceApplList[i].lastAppRemarks.replace(/<br>/g, "\n")
		}
		
		if ($scope.AttendanceApplList[i].appRemarks){
			$scope.AttendanceApplList[i].appRemarks = $scope.AttendanceApplList[i].appRemarks.replace(/&#13;/g, "\n")
			$scope.AttendanceApplList[i].appRemarks = $scope.AttendanceApplList[i].appRemarks.replace(/&#10;/g, "")
		}
			// get punches
			
			dtHrapiFormat = $scope.outTimeDate[0] + '/' + $scope.outTimeDate[1] + '/' + $scope.outTimeDate[2]
			$scope.AttendanceApplList[i].dtHrapiFormat = dtHrapiFormat
			
		
		}

      var index = 0
      while (index != $scope.AttendanceApplList.length) {
        $scope.getAttendancePhotos(index)
        index++
      }
      $ionicLoading.hide()
    }, function (data) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
  }

  $scope.getAttendancePhotos = function (index) {
    $scope.resultObjectForAttendancePic = {}
    $scope.resultObjectForAttendancePic.empId = $scope.AttendanceApplList[index].empId

    $scope.getPhotoService = new getPhotoService();
    $scope.getPhotoService.$save($scope.resultObjectForAttendancePic, function (success) {
      if (success.profilePhoto != null && success.profilePhoto != "") {
        $scope.AttendanceApplList[index].imageFlag = "0"
        $scope.AttendanceApplList[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=';
      }

      else {
        $scope.AttendanceApplList[index].imageFlag = "1"
        $scope.AttendanceApplList[index].profilePhoto = ""
      }
    }, function (data) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
  }


  $scope.shiftChangeDetail = function (shiftDet) {
    $ionicLoading.show();
    homeService.updateInboxEmailList("", function () { }, function (data) { })


    $scope.shiftChangeObject1 = shiftDet;
    $scope.shiftChangeDetailObject = {};
    $scope.shiftModalResultObject = {};
    $scope.shiftModalResultObject.empId = shiftDet.empId;
    $scope.genderDetails = shiftDet.gender;
    $scope.shiftChangeDetailObject.empName = shiftDet.empName;
    $scope.shiftChangeDetailObject.reqDate = shiftDet.reqDate;
    $scope.shiftChangeDetailObject.rosterShiftName = shiftDet.rosterShiftName;
    $scope.shiftChangeDetailObject.changedShiftName = shiftDet.changedShiftName;
    $scope.shiftChangeDetailObject.reasonToChange = shiftDet.reasonToChange;
    $scope.shiftChangeDetailObject.status = shiftDet.status;
    $scope.shiftChangeDetailObject.empCode = shiftDet.empCode;
    $scope.shiftChangeDetailObject.deptName = shiftDet.deptName;
    $scope.shiftChangeDetailObject.appRemarks = shiftDet.appRemarks;
    $scope.shiftChangeDetailObject.lastAppRemarks = shiftDet.lastAppRemarks;
    $scope.shiftChangeDetailObject.raisedBy = shiftDet.raisedBy;
    $scope.openModalShift();
    $ionicLoading.hide()
    $scope.getShiftModalPic();
  }

  $scope.getShiftModalPic = function () {
    $ionicLoading.show({});
    $scope.getPhotoService = new getPhotoService();
    $scope.getPhotoService.$save($scope.shiftModalResultObject, function (success) {
      if (success.profilePhoto) {
        $scope.profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + $scope.shiftModalResultObject.empId + '';
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

  $scope.getShiftChangeApplicationList = function () {

    $scope.shiftChangeObject = {}
    var shiftChangeMenuInfo = getMenuInformation("Attendance Management", "Shift Change");
    $scope.shiftChangeObject.menuId = shiftChangeMenuInfo.menuId;
    $scope.shiftChangeObject.buttonRights = "Y-Y-Y-Y"
    $scope.shiftChangeObject.empId = sessionStorage.getItem('empId');
    $scope.shiftChangeObject.status = 'SENT FOR APPROVAL';
    $("#leavePendingApplicationID").hide();
    $("#ODPendingApplicationID").hide();
    $("#AttendanceApplicationID").hide();
    $("#ShiftChangeApplicationID").show();
    $scope.searchObj = ''
    $("#tabShiftChange").addClass("active");
    $("#tabRegularization").removeClass("active");
    $("#tabOD").removeClass("active");
    $("#tabLeave").removeClass("active");

    $scope.searchObj = ''
    $("#ClaimPendingApplicationID").hide();
    $("#TravelPendingApplicationID").hide();
    $("#tabClaim").removeClass("active");
    $("#tabTravel").removeClass("active");

    $("#claimApplicationID").hide();
    // $("#tabClaim").removeClass("active");
    $("#tabClaim").removeClass("active");
    $("#ClaimPendingApplicationID").hide();
    
	
	$rootScope.approvePageLastTab = "SC"

    if ($scope.scListFetched == true) {
      return;
    }
    $scope.scListFetched = true


    $ionicLoading.show();
    $scope.viewShiftChangeApprovalService = new viewShiftChangeApprovalService();
    $scope.viewShiftChangeApprovalService.$save($scope.shiftChangeObject, function (data) {

      $scope.shiftChangeApprovalApplList = [];
      if (data.shiftChangeForm === undefined) {
        //do nothing
      } else {
        $scope.shiftChangeApprovalApplList = data.shiftChangeForm;
      }

      $scope.requestDateList = [];
      for (var i = 0; i < $scope.shiftChangeApprovalApplList.length; i++) {
        $scope.requestDate = $scope.shiftChangeApprovalApplList[i].reqDate.split('/')
        $scope.shiftChangeApprovalApplList[i].reqDate = new Date($scope.requestDate[2] + '/' + $scope.requestDate[1] + '/' + $scope.requestDate[0])
      }

      var index = 0
      while (index != $scope.shiftChangeApprovalApplList.length) {
        $scope.getShiftPhotos(index)
        index++
      }
      $scope.requesObjectForYear.year = ''
      $scope.requesObjectForMonth.month = ''
      $ionicLoading.hide()
    }, function (data) {
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
  }

  $scope.getShiftPhotos = function (index) {
    $scope.resultObjectForShiftPic = {}
    $scope.resultObjectForShiftPic.empId = $scope.shiftChangeApprovalApplList[index].empId

    $scope.getPhotoService = new getPhotoService();
    $scope.getPhotoService.$save($scope.resultObjectForShiftPic, function (success) {
      if (success.profilePhoto != null && success.profilePhoto != "") {
        $scope.shiftChangeApprovalApplList[index].imageFlag = "0"
        $scope.shiftChangeApprovalApplList[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=';
      }

      else {
        $scope.shiftChangeApprovalApplList[index].imageFlag = "1"
        $scope.shiftChangeApprovalApplList[index].profilePhoto = ""
      }
    }, function (data) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
  }



  $scope.approveAttendanceApplicationList = function (Attendance, type) {
    $scope.approveAtendanceObject = {}
    $scope.attendPendingObject.remark = "";
    $scope.data = {}
    var temp = {}
    $scope.approveAtendanceObject.missedPunchVOList1 = []
    var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");
    $scope.approveAtendanceObject.menuId = attendanceMenuInfo.menuId;
    $scope.approveAtendanceObject.buttonRights = 'Y-Y-Y-Y'
    var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
    $scope.approveAtendanceObject.leaveAppId = leaveMenuInfo.menuId;
    var odMenuInfo = getMenuInformation("Attendance Management", "OD Application");
    $scope.approveAtendanceObject.odAppId = odMenuInfo.menuId;
    $scope.approveAtendanceObject.year = d.getFullYear();
    $scope.approveAtendanceObject.monthId = d.getMonth()
    temp.attDate = Attendance.attDate
    temp.fhOLStatus = Attendance.fhOLStatus
    temp.shOLStatus = Attendance.shOLStatus
    temp.isODPresent = Attendance.isODPresent
    temp.isLeavePresent = Attendance.isLeavePresent
    temp.isAssign1 = true
    temp.firstHalf = Attendance.firstHalf
    temp.secondHalf = Attendance.secondHalf
    temp.actualInTimeStr = Attendance.actualInTimeStr
    temp.lateComming = Attendance.lateComming
    temp.inTimeStr = Attendance.inTimeStr
    temp.actualOutTimeStr = Attendance.actualOutTimeStr
    temp.earlyGoing = Attendance.earlyGoing
    temp.outTimeStr = Attendance.outTimeStr
    temp.outTimeDateStr = $filter('date')(Attendance.outTimeDateStr, 'dd/MM/yyyy');
    temp.shiftMasterChild = Attendance.shiftMasterChild
    temp.workedHrs = Attendance.workedHrs
    temp.remarks = Attendance.remarks
    temp.status = Attendance.status
    temp.transId = Attendance.transId
    temp.appRemarks = Attendance.appRemarks
    temp.othRemarks = Attendance.othRemarks
    temp.trackerId = Attendance.trackerId

    $scope.approveAtendanceObject.missedPunchVOList1.push(temp)
    if (type == "APPROVE") {
      $scope.attendPendingObject.remark = ""
      var myPopup = $ionicPopup.show({
        template: '<label>Approver Remarks<form name="myForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" name="mybox" rows="3" ng-model="attendPendingObject.remark" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
        title: 'Do you want to approve?',
        scope: $scope,
        buttons: [
          { text: 'Cancel' }, {
            text: '<b>Approve</b>',
            type: 'button-positive',
            onTap: function (e) {
              return $scope.attendPendingObject.remark || true;
            }
          }
        ]
      });
      myPopup.then(function (res) {
        if (res) {
          $ionicLoading.show({

          });
          $scope.approveAtendanceObject.appRemarks = $scope.attendPendingObject.remark
          $http({
            url: (baseURL + '/api/attendance/missPunch/approveMissedPunchApp.spr'),
            method: 'POST',
            timeout: commonRequestTimeout,
            transformRequest: jsonTransformRequest,
            data: $scope.approveAtendanceObject,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).
            success(function (data) {
              getMenuInfoOnLoad(function () {
              });
              showAlert("Attendance application", "Attendance approved successfully");
			  
              $ionicLoading.show()
              //$scope.attListFetched = false
			  $scope.getAttendanceApplicationList();
			  
			   $ionicLoading.hide()
			   Attendance.lastAppRemarks = Attendance.lastAppRemarks + $scope.attendPendingObject.remark
			   if (Attendance.status == "SENT FOR APPROVAL"){
				 Attendance.status = "APPROVED"
               }else{
				   Attendance.status = "CANCELLATION APPROVED"
			   }
			  	
            }).error(function (data, status) {
              $scope.data = { status: status };
              commonService.getErrorMessage($scope.data);
              $ionicLoading.hide()
            })
        } else {
          autoRetryCounter = 0
          $ionicLoading.hide()
          return;
        }
      });
    }
    if (type == "REJECT") {
      var myPopup = $ionicPopup.show({
        template: '<label>Approver Remarks<form name="myRejectForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" name="myRejectBox" rows="3" ng-model="data.attendReject" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
        title: 'Do you want to reject?',
        scope: $scope,
        buttons: [
          { text: 'Cancel' }, {
            text: '<b>Reject</b>',
            type: 'button-positive',
            onTap: function (e) {
              return $scope.data.attendReject || true;
            }
          }
        ]
      });
      myPopup.then(function (res) {

        if (res) {
          $ionicLoading.show({
          });
          $scope.approveAtendanceObject.remark = $scope.data.attendReject
          $http({
            url: (baseURL + '/api/attendance/missPunch/rejectMissedPunchApp.spr'),
            method: 'POST',
            timeout: commonRequestTimeout,
            transformRequest: jsonTransformRequest,
            data: $scope.approveAtendanceObject,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).
            success(function (data) {
              getMenuInfoOnLoad(function () {
              });
              showAlert("Attendance application", "Attendance rejected successfully");
              $ionicLoading.show()
              //$scope.attListFetched = false
              $scope.getAttendanceApplicationList();
			  
  			   $ionicLoading.hide()
			   Attendance.lastAppRemarks = Attendance.lastAppRemarks + $scope.approveAtendanceObject.remark
			  
			   if (Attendance.status == "SENT FOR APPROVAL"){
				 Attendance.status = "REJECTED"
			   }else{
				   Attendance.status = "CANCELLATION REJECTED"
			   }

            }).error(function (data, status) {
              $ionicLoading.hide()
              $scope.data = { status: status };
              commonService.getErrorMessage($scope.data);
            })
        } else {
          $ionicLoading.hide()
          return;
        }
      });
    }
  }
  $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function () {
    $scope.modal.show();
  };
  $scope.closeModal = function () {
    $scope.modal.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });
  $scope.$on('modal.hidden', function () {
  });
  $scope.$on('modal.removed', function () {
  });
  $ionicModal.fromTemplateUrl('my-modal-shift.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modalShift) {
    $scope.modalShift = modalShift;
  });
  $scope.openModalShift = function () {
    $scope.modalShift.show();
  };
  $scope.closeModalShift = function () {
    $scope.modalShift.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.modalShift.remove();
  });
  $scope.$on('modalShift.hidden', function () {
  });
  $scope.$on('modalShift.removed', function () {
  });
  $scope.approvedLeave = function (status, leaveTransId, leaveFromDate, leaveToDate, remarks,leaveObj) {
    $ionicLoading.show();
    $scope.detailResObject.leaveTransId = leaveTransId
    var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
    $scope.detailResObject.menuId = leaveMenuInfo.menuId;
    $scope.detailResObject.buttonRights = "Y-Y-Y-Y"
    $scope.detailResObject.fromEmail = "N"
    $scope.detailsService = new detailsService();
    $scope.detailsService.$save($scope.detailResObject, function (data) {
      $scope.approvResObject = {}
      $scope.approvResObject.leaveAppVo = {}
      $scope.approvResObject.menuId = leaveMenuInfo.menuId;
      $scope.approvResObject.buttonRights = "Y-Y-Y-Y";
      $scope.approvResObject.fromEmail = "N";
      $scope.approvResObject.leaveAppVo.afterBalance = data.form.leaveAppVo.afterBalance;
      $scope.approvResObject.leaveAppVo.currentBalance = data.form.leaveAppVo.currentBalance;
      $scope.approvResObject.leaveAppVo.empId = data.form.leaveAppVo.empId;
      $scope.approvResObject.leaveAppVo.leastCount = data.form.leaveAppVo.leastCount;
      $scope.approvResObject.leaveAppVo.leaveApproved = data.form.leaveAppVo.leaveApproved;
      $scope.approvResObject.leaveAppVo.leaveBalBefore = data.form.leaveAppVo.leaveBalBefore;
      $scope.approvResObject.leaveAppVo.leaveFromDate = data.form.leaveAppVo.leaveFromDate;
      $scope.approvResObject.leaveAppVo.leaveInProcess = data.form.leaveAppVo.leaveInProcess;
      $scope.approvResObject.leaveAppVo.leaveReason = data.form.leaveAppVo.leaveReason;
      $scope.approvResObject.leaveAppVo.leaveStatus = data.form.leaveAppVo.leaveStatus;
      $scope.approvResObject.leaveAppVo.leaveToDate = data.form.leaveAppVo.leaveToDate;
      $scope.approvResObject.leaveAppVo.leaveTransId = data.form.leaveAppVo.leaveTransId;
      $scope.approvResObject.leaveAppVo.name = data.form.leaveAppVo.name;
      $scope.approvResObject.leaveAppVo.phone = data.form.leaveAppVo.phone;
      $scope.approvResObject.leaveAppVo.fromLeaveType = data.form.leaveAppVo.fromLeaveType;
      $scope.approvResObject.leaveAppVo.leaveTypeId = data.form.leaveAppVo.leaveTypeId;
      $scope.approvResObject.leaveAppVo.mailType = "";
      $scope.approvResObject.leaveAppVo.noDaysCounted = data.form.leaveAppVo.noDaysCounted;
      $scope.approvResObject.leaveAppVo.noOfDays = data.form.leaveAppVo.noOfDays;
      $scope.approvResObject.leaveAppVo.toLeaveType = data.form.leaveAppVo.toLeaveType;

      $scope.approvResObject.remarks = remarks;
      if (status == 'show') {
        $scope.modal.hide()
      }
      $ionicLoading.show()
      $http({
        url: (baseURL + '/api/leaveApplication/approveLeaveApp.spr'),
        method: 'POST',
        timeout: commonRequestTimeout,
        transformRequest: jsonTransformRequest,
        data: $scope.approvResObject,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).
        success(function (data) {
          getMenuInfoOnLoad(function () {
          });

          if (data.msg == "" || data.msg.substring(0, 5) == "ERROR") {
            showAlert("Something went wrong. Please try again.");
          } else {
            showAlert(data.msg);
          }

          $scope.leaveListFetched = false
          $scope.getLeaveList()
		  	
		  
        }).error(function (data, status) {
          $ionicLoading.hide()
          $scope.data = { status: status };
          commonService.getErrorMessage($scope.data);
        });
    }, function (data) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
  }

  $scope.rejectLeave = function (status, leaveTransId, leaveFromDate, leaveToDate, onreject,leaveObj) {
    $ionicLoading.show();
    $scope.detailResObject.leaveTransId = leaveTransId
    var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
    $scope.detailResObject.menuId = leaveMenuInfo.menuId;
    $scope.detailResObject.buttonRights = "Y-Y-Y-Y"
    $scope.detailResObject.fromEmail = "N"

    $scope.detailsService = new detailsService();
    $scope.detailsService.$save($scope.detailResObject, function (data) {
      $scope.rejectResObject = {}
      $scope.rejectResObject.leaveAppVo = {}
      $scope.rejectResObject.menuId = leaveMenuInfo.menuId;
      $scope.rejectResObject.buttonRights = "Y-Y-Y-Y";
      $scope.rejectResObject.fromEmail = "N";
      $scope.rejectResObject.leaveAppVo.afterBalance = data.form.leaveAppVo.afterBalance;
      $scope.rejectResObject.leaveAppVo.currentBalance = data.form.leaveAppVo.currentBalance;
      $scope.rejectResObject.leaveAppVo.empId = data.form.leaveAppVo.empId;
      $scope.rejectResObject.leaveAppVo.leastCount = data.form.leaveAppVo.leastCount;
      $scope.rejectResObject.leaveAppVo.leaveApproved = data.form.leaveAppVo.leaveApproved;
      $scope.rejectResObject.leaveAppVo.leaveBalBefore = data.form.leaveAppVo.leaveBalBefore;
      $scope.rejectResObject.leaveAppVo.leaveFromDate = data.form.leaveAppVo.leaveFromDate;
      $scope.rejectResObject.leaveAppVo.leaveInProcess = data.form.leaveAppVo.leaveInProcess;
      $scope.rejectResObject.leaveAppVo.leaveReason = data.form.leaveAppVo.leaveReason;
      $scope.rejectResObject.leaveAppVo.leaveStatus = data.form.leaveAppVo.leaveStatus;
      $scope.rejectResObject.leaveAppVo.leaveToDate = data.form.leaveAppVo.leaveToDate;
      $scope.rejectResObject.leaveAppVo.leaveTransId = data.form.leaveAppVo.leaveTransId;
      $scope.rejectResObject.leaveAppVo.name = data.form.leaveAppVo.name;
      $scope.rejectResObject.leaveAppVo.phone = data.form.leaveAppVo.phone;
      $scope.rejectResObject.leaveAppVo.fromLeaveType = data.form.leaveAppVo.fromLeaveType;
      $scope.rejectResObject.leaveAppVo.leaveTypeId = data.form.leaveAppVo.leaveTypeId;
      $scope.rejectResObject.leaveAppVo.mailType = "";
      $scope.rejectResObject.leaveAppVo.noDaysCounted = data.form.leaveAppVo.noDaysCounted;
      $scope.rejectResObject.leaveAppVo.noOfDays = data.form.leaveAppVo.noOfDays;
      $scope.rejectResObject.leaveAppVo.toLeaveType = data.form.leaveAppVo.toLeaveType;
	  $scope.rejectResObject.remarks = onreject;
      if (status == 'show') {
        $scope.modal.hide()
      }
      $ionicLoading.show()
      $http({
        url: (baseURL + '/api/leaveApplication/rejectLeaveApp.spr'),
        method: 'POST',
        timeout: commonRequestTimeout,
        transformRequest: jsonTransformRequest,
        data: $scope.rejectResObject,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).
        success(function (data) {
          getMenuInfoOnLoad(function () {
          });
          showAlert("", "Application rejected successfully");
          $scope.leaveListFetched = false
          $scope.getLeaveList()

        }).error(function (data, status) {
          $ionicLoading.hide();
          $scope.data = { status: status };
          commonService.getErrorMessage($scope.data);
        });
    }, function (data, status) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      $scope.data = { status: status };
      commonService.getErrorMessage($scope.data);
    });
  }

  $scope.detailInfoReporty = function (transid, leaveObj) {
    $scope.empCode = leaveObj.empCode;
    $scope.genderDetails = leaveObj.gender;
    $ionicLoading.show({});
    var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
    $scope.detailResObject.leaveTransId = transid
    $scope.detailResObject.menuId = leaveMenuInfo.menuId;
    $scope.detailResObject.buttonRights = "Y-Y-Y-Y"
    $scope.detailResObject.fromEmail = "N"
    $scope.detailsService = new detailsService();
    $scope.detailsService.$save($scope.detailResObject, function (data) {
      if (data.form.leaveAppVo.fileNm) {
        $scope.fileName = data.form.leaveAppVo.fileNm
      }
      $scope.resultObject.empId = data.form.leaveAppVo.empId
      $scope.leaveType = leaveObj.leaveType;
      $scope.leaveApplyDetail = data.form.leaveAppVo;
      $scope.leaveReason = data.form.leaveAppVo.leaveReason;
      $scope.status = leaveObj.leaveStatus;
      $scope.title = data.form.leaveAppVo;
      $scope.name = data.form.leaveAppVo.name;
      $scope.leaveFromDate = data.form.leaveAppVo.leaveFromDate.split('/')
      $scope.leaveFromDate = new Date($scope.leaveFromDate[2] + '/' + $scope.leaveFromDate[1] + '/' + $scope.leaveFromDate[0])
      $scope.leaveToDate = data.form.leaveAppVo.leaveToDate.split('/')
      $scope.leaveToDate = new Date($scope.leaveToDate[2] + '/' + $scope.leaveToDate[1] + '/' + $scope.leaveToDate[0])
      if ($scope.leaveFromDate.getTime() == $scope.leaveToDate.getTime()) {
        $scope.leaveDate = $scope.leaveFromDate;
      }
      else {
        $scope.leaveDate = null;
      }
      $scope.phoneNo = data.form.leaveAppVo.phone != "null" ? data.form.leaveAppVo.phone : "";
      $scope.toLeaveType = data.form.leaveAppVo.toLeaveType;
      $scope.fromLeaveType = data.form.leaveAppVo.fromLeaveType;
      $scope.noOfDaysCounted = data.form.leaveAppVo.noDaysCounted;
      $scope.noOfHours = parseInt(data.form.leaveAppVo.toLvHr) - parseInt(data.form.leaveAppVo.fromLvHr);
      $scope.fromLeaveType = $scope.fromLeaveType.charAt(0).toUpperCase() + $scope.fromLeaveType.slice(1)
      $scope.fromLeaveType = $scope.fromLeaveType.replace(/([a-z](?=[A-Z]))/g, '$1 ')
      $scope.openModal();
      $ionicLoading.hide()
      $scope.getPic();
    }, function (data) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
    $scope.fileName = ''
  }

  $scope.downloadedFile = function () {
    $ionicLoading.show({
    });
    var uri;
    var fileURL;
    if (ionic.Platform.isAndroid()) {
      uri = baseURL + "/api/leaveApplication/openFile.spr?transId=" + $scope.detailResObject.leaveTransId;
      fileURL = cordova.file.externalDataDirectory + $scope.fileName;

      var fileTransfer = new FileTransfer();
      fileTransfer.download(
        uri,
        fileURL,
        function (success) {
          $ionicLoading.show({
          });
          $ionicLoading.hide();
          showAlert("", "File downloaded successfully.")
          cordova.plugins.fileOpener2.open(
            fileURL,
            '*/*',
            {
              error: function (e) {
                console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
              },
              success: function () {
                console.log('File opened successfully');
              }
            }
          );
        },
        function (error) {
          if (error.http_status == 406) {
            showAlert("", "File is not available");
          }
          else if (error.code == 1) {
            showAlert("", "Please give storage permission");
          }
          else if (error.code == 3) {
            $ionicLoading.hide()
            commonService.getErrorMessage(error);
          }
          $ionicLoading.hide()
        });
    }
    else {
      $ionicLoading.hide()
      uri = baseURL + "/api/leaveApplication/openFile.spr?transId=" + $scope.detailResObject.leaveTransId;
      if (window.XMLHttpRequest) {
        var oReq = new XMLHttpRequest();
        oReq.open("GET", uri);
        oReq.send();
        oReq.onload = function () {
          if (oReq.status == "406" || oReq.status != "200") {
            showAlert("", "File is not available");
          }
          else {
            var ref = cordova.InAppBrowser.open(uri, '_blank', 'location=yes,toolbarposition=top');
          }
        };
      }
    }

  };

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

  $scope.approveOrRejectPendingOD = function (odPending, type) {
    $scope.data = {}
    $scope.ODPendingObject.odIds = odPending.odID;
    $scope.ODPendingObject.empId = sessionStorage.getItem('empId');
    $scope.ODPendingObject.menuId = $scope.requesObject1.menuId;
    $scope.ODPendingObject.buttonRights = "Y-Y-Y-Y";
    $scope.ODPendingObject.remark = "";
    $scope.ODPendingObject.code = "notEmail";
    if (type == "APPROVE") {
      var myPopup = $ionicPopup.show({
        template: '<label>Approver Remarks<form name="myForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" rows="3" name="mybox" ng-model="ODPendingObject.remark" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
        title: 'Do you want to approve?',
        scope: $scope,
        buttons: [
          { text: 'Cancel' }, {
            text: '<b>Approve</b>',
            type: 'button-positive',
            onTap: function (e) {
              return $scope.ODPendingObject.remark || true;
            }
          }
        ]
      });
      myPopup.then(function (res) {
        if (res) {
          $ionicLoading.show();
          $scope.approvePendingODService = new approvePendingODService();
          $scope.approvePendingODService.$save($scope.ODPendingObject, function (data) {
            if (!(data.clientResponseMsg == "OK")) {
              console.log(data.clientResponseMsg)
			  showAlert("Something went wrong. Please try later.")
              handleClientResponse(data.clientResponseMsg, "approvePendingODService")
              $ionicLoading.hide()
            }
            getMenuInfoOnLoad(function () {
            });

            showAlert("OD application", "OD approved successfully");
            //$scope.odListFetched = false
            $scope.getODApplicationList();
			 if ($scope.ODPendingObject.remark){
				 odPending.appRemarks = $scope.ODPendingObject.remark + odPending.appRemarks 
			 }
			 if (odPending.status == "SENT FOR APPROVAL" ){
				 odPending.status = "APPROVED"
			 }else{
				 odPending.status = "CANCELLATION APPROVED"
			 }
             $ionicLoading.hide()
          }, function (data) {
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
          });
          return
        } else {
          $ionicLoading.hide()
          return;
        }
      });
    }
    if (type == "REJECT") {
      var myPopup = $ionicPopup.show({
        template: '<label>Approver Remarks<form name="myRejectForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" rows="3" name="myRejectBox" ng-model="ODPendingObject.remark" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myRejectForm.myRejectBox.$error.maxlength">No more text can be added.</span></form></label>',
        title: 'Do you want to reject?',
        scope: $scope,
        buttons: [
          { text: 'Cancel' }, {
            text: '<b>Reject</b>',
            type: 'button-positive',
            onTap: function (e) {
              return $scope.ODPendingObject.remark || true;
            }
          }
        ]
      });
      myPopup.then(function (res) {
        if (res) {
          $ionicLoading.show({
          });
          $scope.rejectPendingODService = new rejectPendingODService();
          $scope.rejectPendingODService.$save($scope.ODPendingObject, function (data) {
            if (!(data.clientResponseMsg == "OK")) {
              console.log(data.clientResponseMsg)
			  showAlert("Something went wrong. Please try later.")
              handleClientResponse(data.clientResponseMsg, "rejectPendingODService")
              $ionicLoading.hide()
            }
            //$scope.odListFetched = false
            $scope.getODApplicationList();
			 if ($scope.ODPendingObject.remark){
				 odPending.appRemarks = $scope.ODPendingObject.remark + odPending.appRemarks 
			 }
			 if (odPending.status == "SENT FOR APPROVAL" ){
				 odPending.status = "REJECTED"
			 }else{
				 odPending.status = "CANCELLATION REJECTED"
			 }
			
            getMenuInfoOnLoad(function () {
            });
            $ionicLoading.hide()
            showAlert("OD application", "OD rejected successfully");
          }, function (data) {
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
          });
          return
        } else {
          $ionicLoading.hide()
          return;
        }
      });
    }
  }
  $scope.onConfirm = function (status, type, leaveTransId, leaveFromDate, leaveToDate,leaveObj) {
    $scope.data = {}
    if (type == 1) {
      var myPopup = $ionicPopup.show({
        template: '<label>Approver Remarks<form name="myApproveForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" name="mybox" rows="3" ng-model="data.onApprove" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myApproveForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
        title: 'Do you want to approve?',
        scope: $scope,
        buttons: [
          { text: 'Cancel' }, {
            text: '<b>Approve</b>',
            type: 'button-positive',
            onTap: function (e) {
              return $scope.data.onApprove || true;
            }
          }
        ]
      });
      myPopup.then(function (res) {
        if (res) {
          $ionicLoading.show()
          $scope.approvedLeave(status, leaveTransId, leaveFromDate, leaveToDate, $scope.data.onApprove,leaveObj)
          return
        } else {
          return;
        }
      });
    } else if (type == 2) {
      var myPopup = $ionicPopup.show({
        template: '<label>Approver Remarks<form name="myRejectForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" name="mybox" rows="3" ng-model="data.onreject" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
        title: 'Do you want to reject?',
        scope: $scope,
        buttons: [
          { text: 'Cancel' }, {
            text: '<b>Reject</b>',
            type: 'button-positive',
            onTap: function (e) {
              return $scope.data.onreject || true;
            }
          }
        ]
      });
      myPopup.then(function (res) {
        if (res) {
          $ionicLoading.show()
          $scope.rejectLeave(status, leaveTransId, leaveFromDate, leaveToDate, $scope.data.onreject,leaveObj)
          return
        } else {
          return;
        }
      });
    }
  }
  $scope.approveShiftChange = function (status, shiftObject, remarks) {
    $ionicLoading.show({
    });
    $scope.approvalRequestObject = {};
    $scope.temp = {};
    $scope.approvalRequestObject.shiftChangeVOList = [];
    var shiftChangeMenuInfo = getMenuInformation("Attendance Management", "Shift Change");
    $scope.approvalRequestObject.menuId = shiftChangeMenuInfo.menuId;
    $scope.approvalRequestObject.buttonRights = "Y-Y-Y-Y";
    $scope.approvalRequestObject.empId = shiftObject.empId;
    $scope.approvalRequestObject.status = shiftObject.status;
    $scope.approvalRequestObject.trackerId = shiftObject.trackerId;
    $scope.temp.transId = shiftObject.transId;
    $scope.temp.trackerId = shiftObject.trackerId;
    $scope.temp.isAssign = "true";
    $scope.temp.empCode = shiftObject.empCode;
    $scope.temp.empName = shiftObject.empName;
    $scope.temp.deptName = shiftObject.deptName;
    $scope.temp.status = shiftObject.status;
    $scope.temp.reqDate = shiftObject.reqDate;
    $scope.temp.rosterShiftName = shiftObject.rosterShiftName;
    $scope.temp.changedShiftName = shiftObject.changedShiftName;
    $scope.temp.reasonToChange = shiftObject.reasonToChange;
    $scope.temp.appRemarks = remarks;
    $scope.approvalRequestObject.shiftChangeVOList.push($scope.temp);
    if (status == 'show') {
      $scope.modalShift.hide()
    }
    $ionicLoading.show()
    $http({
      url: (baseURL + '/api/attendance/shiftChange/approveRequest.spr'),
      method: 'POST',
      timeout: commonRequestTimeout,
      transformRequest: jsonTransformRequest,
      data: $scope.approvalRequestObject,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function (data) {
      $ionicLoading.hide()
      showAlert("Successfully approved")
      getMenuInfoOnLoad(function () {
      });
      $scope.scListFetched = false
      $scope.getShiftChangeApplicationList()
      $ionicLoading.hide()
    }).error(function (data, status) {
      autoRetryCounter = 0
      var data = {};
      data.status = status;
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
  }
  $scope.rejectShiftChange = function (status, shiftObject, remarks) {
    $ionicLoading.show({});
    $scope.rejectionRequestObject = {};
    $scope.temp = {};
    $scope.rejectionRequestObject.shiftChangeVOList = [];
    var shiftChangeMenuInfo = getMenuInformation("Attendance Management", "Shift Change");
    $scope.rejectionRequestObject.menuId = shiftChangeMenuInfo.menuId;
    $scope.rejectionRequestObject.buttonRights = "Y-Y-Y-Y";
    $scope.rejectionRequestObject.empId = shiftObject.empId;
    $scope.rejectionRequestObject.status = shiftObject.status;
    $scope.rejectionRequestObject.trackerId = shiftObject.trackerId;
    $scope.temp.transId = shiftObject.transId;
    $scope.temp.trackerId = shiftObject.trackerId;
    $scope.temp.isAssign = "true";
    $scope.temp.empCode = shiftObject.empCode;
    $scope.temp.empName = shiftObject.empName;
    $scope.temp.deptName = shiftObject.deptName;
    $scope.temp.status = shiftObject.status;
    $scope.temp.reqDate = shiftObject.reqDate;
    $scope.temp.rosterShiftName = shiftObject.rosterShiftName;
    $scope.temp.changedShiftName = shiftObject.changedShiftName;
    $scope.temp.reasonToChange = shiftObject.reasonToChange;
    $scope.temp.appRemarks = remarks;
    $scope.rejectionRequestObject.shiftChangeVOList.push($scope.temp);
    if (status == 'show') {
      $scope.modalShift.hide()
    }
    $ionicLoading.show()
    $http({
      url: (baseURL + '/api/attendance/shiftChange/rejectRequest.spr'),
      method: 'POST',
      timeout: commonRequestTimeout,
      transformRequest: jsonTransformRequest,
      data: $scope.rejectionRequestObject,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).
      success(function (data) {
        getMenuInfoOnLoad(function () {
        });
        showAlert("Application rejected")
        $scope.scListFetched = false
        $scope.getShiftChangeApplicationList()
        $ionicLoading.hide()
      }).error(function (data, status) {
        var data = {};
        data.status = status;
        $ionicLoading.hide()
        commonService.getErrorMessage(data);
      });
  }

  $scope.onConfirmShift = function (status, type, shiftObject) {
    $scope.dataShift = {}
    if (type == 1) {
      var myPopup = $ionicPopup.show({
        template: '<label>Approver Remarks<form name="myForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" name="mybox" rows="3" ng-model="dataShift.onApprove" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
        title: 'Do you want to approve?',
        scope: $scope,
        buttons: [
          { text: 'Cancel' }, {
            text: '<b>Approve</b>',
            type: 'button-positive',
            onTap: function (e) {
              return $scope.dataShift.onApprove || true;
            }
          }
        ]
      });
      myPopup.then(function (res) {
        if (res) {
          $scope.approveShiftChange(status, shiftObject, $scope.dataShift.onApprove)
          return
        } else {
          return;
        }
      });
    } else if (type == 2) {
      var myPopup = $ionicPopup.show({
        template: '<label>Approver Remarks<form name="myForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" name="mybox" rows="3" ng-model="dataShift.onreject" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
        title: 'Do you want to reject?',
        scope: $scope,
        buttons: [
          { text: 'Cancel' }, {
            text: '<b>Reject</b>',
            type: 'button-positive',
            onTap: function (e) {
              return $scope.dataShift.onreject || true;
            }
          }
        ]
      });
      myPopup.then(function (res) {
        if (res) {
          $scope.rejectShiftChange(status, shiftObject, $scope.dataShift.onreject)
          return
        } else {
          return;
        }
      });
    }
  }

  $scope.cancelApproveLeave = function (status, leaveTransId, leaveFromDate, leaveToDate, remarks,leaveObj) {
    $ionicLoading.show({});
    $scope.detailResObject.leaveTransId = leaveTransId
    var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
    $scope.detailResObject.menuId = leaveMenuInfo.menuId;
    $scope.detailResObject.buttonRights = "Y-Y-Y-Y"

    $scope.detailsService = new detailsService();
    $scope.detailsService.$save($scope.detailResObject, function (data) {
      $scope.approvCancelLeaveObject = {}
      $scope.approvCancelLeaveObject.leaveAppVo = {}
      $scope.approvCancelLeaveObject.menuId = leaveMenuInfo.menuId;
      $scope.approvCancelLeaveObject.buttonRights = "Y-Y-Y-Y";
      $scope.approvCancelLeaveObject.leaveAppVo.afterBalance = data.form.leaveAppVo.afterBalance;
      $scope.approvCancelLeaveObject.leaveAppVo.currentBalance = data.form.leaveAppVo.currentBalance;
      $scope.approvCancelLeaveObject.leaveAppVo.empId = data.form.leaveAppVo.empId;
      $scope.approvCancelLeaveObject.leaveAppVo.leastCount = data.form.leaveAppVo.leastCount;
      $scope.approvCancelLeaveObject.leaveAppVo.leaveApproved = data.form.leaveAppVo.leaveApproved;
      $scope.approvCancelLeaveObject.leaveAppVo.leaveBalBefore = data.form.leaveAppVo.leaveBalBefore;
      $scope.approvCancelLeaveObject.leaveAppVo.leaveFromDate = data.form.leaveAppVo.leaveFromDate;
      $scope.approvCancelLeaveObject.leaveAppVo.leaveToDate = data.form.leaveAppVo.leaveToDate;
      $scope.approvCancelLeaveObject.leaveAppVo.leaveInProcess = data.form.leaveAppVo.leaveInProcess;
      $scope.approvCancelLeaveObject.leaveAppVo.leaveReason = data.form.leaveAppVo.leaveReason;
      $scope.approvCancelLeaveObject.leaveAppVo.leaveTransId = data.form.leaveAppVo.leaveTransId;
      $scope.approvCancelLeaveObject.leaveAppVo.name = data.form.leaveAppVo.name;
      $scope.approvCancelLeaveObject.leaveAppVo.phone = data.form.leaveAppVo.phone;
      $scope.approvCancelLeaveObject.leaveAppVo.fromLeaveType = data.form.leaveAppVo.fromLeaveType;
      $scope.approvCancelLeaveObject.leaveAppVo.leaveTypeId = data.form.leaveAppVo.leaveTypeId;
      $scope.approvCancelLeaveObject.leaveAppVo.mailType = "APPROVER";
      $scope.approvCancelLeaveObject.leaveAppVo.noDaysCounted = data.form.leaveAppVo.noDaysCounted;
      $scope.approvCancelLeaveObject.leaveAppVo.noOfDays = data.form.leaveAppVo.noOfDays;
      $scope.approvCancelLeaveObject.leaveAppVo.toLeaveType = data.form.leaveAppVo.toLeaveType;
      $scope.approvCancelLeaveObject.leaveAppVo.remarks = remarks;
      $scope.approvCancelLeaveObject.leaveAppVo.leaveLeastCountMsg = "";
      $scope.approvCancelLeaveObject.leaveAppVo.trackerId = data.form.leaveAppVo.trackerId;
      $scope.approvCancelLeaveObject.leaveAppVo.fromLvHr = data.form.leaveAppVo.fromLvHr;
      $scope.approvCancelLeaveObject.leaveAppVo.toLvHr = data.form.leaveAppVo.toLvHr;
      $scope.approvCancelLeaveObject.leaveAppVo.RaisedBy = data.form.leaveAppVo.RaisedBy;
      $scope.approvCancelLeaveObject.leaveAppVo.fromEmail = data.form.leaveAppVo.fromEmail;
      $scope.approvCancelLeaveObject.leaveAppVo.address = data.form.leaveAppVo.address;
      $scope.approvCancelLeaveObject.leaveAppVo.email = data.form.leaveAppVo.email;
      $scope.approvCancelLeaveObject.leaveAppVo.requiesitionDate = data.form.leaveAppVo.requiesitionDate;


      $http({
        url: (baseURL + '/api/leaveApplication/approveLeaveCan.spr'),
        method: 'POST',
        timeout: commonRequestTimeout,
        transformRequest: jsonTransformRequest,
        data: $scope.approvCancelLeaveObject,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).
        success(function (data) {
          getMenuInfoOnLoad(function () {
          });
          showAlert("", "Application approved successfully");
          $scope.leaveListFetched = false
          $scope.getLeaveList()

        }).error(function (data, status) {
          $ionicLoading.hide()
          $scope.data = { status: status };
          commonService.getErrorMessage($scope.data);
        });
    }, function (data) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
  }

  $scope.rejectApproveLeave = function (status, leaveTransId, leaveFromDate, leaveToDate, onreject,leaveObj) {
    $ionicLoading.show({
    });
    $scope.detailResObject.leaveTransId = leaveTransId
    var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
    $scope.detailResObject.menuId = leaveMenuInfo.menuId;
    $scope.detailResObject.buttonRights = "Y-Y-Y-Y"

    $scope.detailsService = new detailsService();
    $scope.detailsService.$save($scope.detailResObject, function (data) {
      $scope.rejectResObject = {}
      $scope.rejectResObject.leaveAppVo = {}
      $scope.rejectResObject.menuId = leaveMenuInfo.menuId;
      $scope.rejectResObject.buttonRights = "Y-Y-Y-Y";
      $scope.rejectResObject.leaveAppVo.afterBalance = data.form.leaveAppVo.afterBalance;
      $scope.rejectResObject.leaveAppVo.currentBalance = data.form.leaveAppVo.currentBalance;
      $scope.rejectResObject.leaveAppVo.empId = data.form.leaveAppVo.empId;
      $scope.rejectResObject.leaveAppVo.leastCount = data.form.leaveAppVo.leastCount;
      $scope.rejectResObject.leaveAppVo.leaveApproved = data.form.leaveAppVo.leaveApproved;
      $scope.rejectResObject.leaveAppVo.leaveBalBefore = data.form.leaveAppVo.leaveBalBefore;
      $scope.rejectResObject.leaveAppVo.leaveFromDate = data.form.leaveAppVo.leaveFromDate;
      $scope.rejectResObject.leaveAppVo.leaveToDate = data.form.leaveAppVo.leaveToDate;
      $scope.rejectResObject.leaveAppVo.leaveInProcess = data.form.leaveAppVo.leaveInProcess;
      $scope.rejectResObject.leaveAppVo.leaveReason = data.form.leaveAppVo.leaveReason;
      $scope.rejectResObject.leaveAppVo.leaveTransId = data.form.leaveAppVo.leaveTransId;
      $scope.rejectResObject.leaveAppVo.name = data.form.leaveAppVo.name;
      $scope.rejectResObject.leaveAppVo.phone = data.form.leaveAppVo.phone;
      $scope.rejectResObject.leaveAppVo.fromLeaveType = data.form.leaveAppVo.fromLeaveType;
      $scope.rejectResObject.leaveAppVo.leaveTypeId = data.form.leaveAppVo.leaveTypeId;
      $scope.rejectResObject.leaveAppVo.mailType = "APPROVER";
      $scope.rejectResObject.leaveAppVo.noDaysCounted = data.form.leaveAppVo.noDaysCounted;
      $scope.rejectResObject.leaveAppVo.noOfDays = data.form.leaveAppVo.noOfDays;
      $scope.rejectResObject.leaveAppVo.toLeaveType = data.form.leaveAppVo.toLeaveType;
      $scope.rejectResObject.leaveAppVo.remarks = onreject;
      $scope.rejectResObject.leaveAppVo.leaveLeastCountMsg = "";
      $scope.rejectResObject.leaveAppVo.trackerId = data.form.leaveAppVo.trackerId;
      $scope.rejectResObject.leaveAppVo.fromLvHr = data.form.leaveAppVo.fromLvHr;
      $scope.rejectResObject.leaveAppVo.toLvHr = data.form.leaveAppVo.toLvHr;
      $scope.rejectResObject.leaveAppVo.RaisedBy = data.form.leaveAppVo.RaisedBy;
      $scope.rejectResObject.leaveAppVo.fromEmail = data.form.leaveAppVo.fromEmail;
      $scope.rejectResObject.leaveAppVo.address = data.form.leaveAppVo.address;
      $scope.rejectResObject.leaveAppVo.email = data.form.leaveAppVo.email;
      $scope.rejectResObject.leaveAppVo.requiesitionDate = data.form.leaveAppVo.requiesitionDate;
	  $scope.rejectResObject.remarks = onreject;
      $http({
        url: (baseURL + '/api/leaveApplication/rejectLeavecancel.spr'),
        method: 'POST',
        timeout: commonRequestTimeout,
        transformRequest: jsonTransformRequest,
        data: $scope.rejectResObject,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).
        success(function (data) {
          getMenuInfoOnLoad(function () {
          });
          showAlert("", "Application rejected successfully");
          $scope.leaveListFetched = false
          $scope.getLeaveList()

        }).error(function (data, status) {
          $ionicLoading.hide();
          $scope.data = { status: status };
          commonService.getErrorMessage($scope.data);
        });
    }, function (data, status) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      $scope.data = { status: status };
      commonService.getErrorMessage($scope.data);
    });
  }

  $scope.onConfirmLeaveCancel = function (type, status, leaveTransId, leaveFromDate, leaveToDate,leaveObj) {
    $scope.data = {}
    if (type == 1) {
      var myPopup = $ionicPopup.show({
        template: '<label>Approver Remarks<form name="myApproveForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" name="mybox" rows="3" ng-model="data.onApproveLeave" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myApproveForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
        title: 'Do you want to approve?',
        scope: $scope,
        buttons: [
          { text: 'Cancel' }, {
            text: '<b>Approve</b>',
            type: 'button-positive',
            onTap: function (e) {
              return $scope.data.onApproveLeave || true;
            }
          }
        ]
      });
      myPopup.then(function (res) {
        if (res) {
          $scope.cancelApproveLeave(status, leaveTransId, leaveFromDate, leaveToDate, $scope.data.onApproveLeave,leaveObj)
          return
        } else {
          return;
        }
      });
    } else if (type == 2) {
      var myPopup = $ionicPopup.show({
        template: '<label>Approver Remarks<form name="myRejectForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" name="mybox" rows="3" ng-model="data.onApprovereject" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
        title: 'Do you want to reject?',
        scope: $scope,
        buttons: [
          { text: 'Cancel' }, {
            text: '<b>Reject</b>',
            type: 'button-positive',
            onTap: function (e) {
              return $scope.data.onApprovereject || true;
            }
          }
        ]
      });
      myPopup.then(function (res) {
        if (res) {
          $scope.rejectApproveLeave(status, leaveTransId, leaveFromDate, leaveToDate, $scope.data.onApprovereject,leaveObj)
          return
        } else {
          return;
        }
      });
    }
  }



  $scope.refreshLeaveList = function () {
    $scope.leaveListFetched = false
    $scope.getLeaveList()

  }

  $scope.refreshODList = function () {
    $scope.odListFetched = false
    $scope.getODApplicationList()

  }

  $scope.refreshAttList = function () {
    $scope.attListFetched = false
    $scope.getAttendanceApplicationList()
  }
  $scope.refreshtraveList = function () {
    $scope.travelListFetched = false
    $scope.getTravelList()
  }

  $scope.refreshSCList = function () {
    $scope.scListFetched = false
    $scope.getShiftChangeApplicationList()

  }

  $scope.refresCTCClaimList = function () {
    $scope.ctcClaimlistFetched = false
    $scope.getCtcClaimApprovalList()

  }
  $scope.goToRequisitions = function () {
    //alert("RequestListCombined");
    $state.go('RequestListCombined');

  }


  $scope.refresNONCTCClaimList = function () {
    $scope.nonctcClaimlistFetched = false
    $scope.getNonCtcClaimApprovalList();
  }


  $scope.refresLTAClaimList = function () {
    $scope.ltaClaimlistFetched = false
    $scope.getLtaClaimApprovalList()
  }

  $scope.refresTRClaimList = function () {
    $scope.trClaimlistFetched = false
    $scope.getTrClaimApprovalList()

  }



  function Initialize() {
    //$rootScope.travel = 0;
    //$rootScope.claim = 0;
    
	
	getMenuInfoOnLoad(function () {
              });

    if ($scope.navigateToPageWithCount == true) {
      $scope.navigateToPageWithCount = false
	  //check if rootscope has tab value
		  if ($rootScope.approvePageLastTab != ""){
			  if ($rootScope.approvePageLastTab == "LEAVE"){
				  $scope.getLeaveList();
			  }
			  if ($rootScope.approvePageLastTab == "OD"){
				  $scope.getODApplicationList();
			  }
			  if ($rootScope.approvePageLastTab == "ATTREG"){
				  $scope.getAttendanceApplicationList();
			  }
			  if ($rootScope.approvePageLastTab == "SC"){
				  $scope.getShiftChangeApplicationList();
			  }
			  if ($rootScope.approvePageLastTab == "TRAVEL"){
				  $('.center1').slick('slickGoTo', 4);
				  $scope.getTravelList();
			  }
			  if ($rootScope.approvePageLastTab == "CLAIM_CTC"){
				  $('.center1').slick('slickGoTo', 5);
				  $scope.getCClaimList();
			  }
			  if ($rootScope.approvePageLastTab == "CLAIM_NONCTC"){
				  $('.center1').slick('slickGoTo', 5);
				  $scope.getNClaimList();
			  }
			  if ($rootScope.approvePageLastTab == "CLAIM_LTA"){
				  $('.center1').slick('slickGoTo', 5);
				  $scope.getLClaimList();
				  
			  }
			  if ($rootScope.approvePageLastTab == "CLAIM_TRAVEL"){
				  $('.center1').slick('slickGoTo', 5);
				  $scope.getTrClaimList()
			  }
			  
			  return
		  }
		  

      if ($scope.IsLeaveAccessible == 'true' &&
        $rootScope.leave == "0" && $rootScope.attendance == "0" && $rootScope.shift == "0" && $rootScope.od == "0" && $rootScope.travel == "0" && $rootScope.claim == "0") {
        $scope.getLeaveList();
      }
      else if ($scope.IsLeaveAccessible == 'true' && $rootScope.leave > 0) {
        $scope.getLeaveList();
      }
      else if ($scope.IsODAccessible == 'true' && $rootScope.od > 0) {
        $scope.getODApplicationList();
      }
      else if ($scope.IsShiftChangeAccessible == 'true' && $rootScope.shift > 0) {
        $scope.getShiftChangeApplicationList();
      }
      else if ($scope.IsRegularizationAccessible == 'true' && $rootScope.attendance > 0) {
        $scope.getAttendanceApplicationList();
      }
      else if ($scope.IsTravelAccessible == 'true' && $rootScope.travel > 0) {
		  $('.center1').slick('slickGoTo', 4);
        $scope.getTravelList();
      }
      else if ($scope.IsClaimAccessible == 'true' && $rootScope.claim > 0) {
		  $('.center1').slick('slickGoTo', 5);
        $scope.getCtcClaimApprovalList();
      }
	  else{
		  //above fail because of access rights or counts 0
		  //above fail .. it may be for access rights are counts are 0
			if ($scope.IsLeaveAccessible == 'true'){
				$scope.getLeaveList();
				//$rootScope.redirectApprovalTabName = ""
				return
			}
			if ($scope.IsODAccessible == 'true'){
				$scope.getODApplicationList();
				//$rootScope.redirectApprovalTabName = ""
				return
			}
			if ($scope.IsRegularizationAccessible == 'true'){
				$scope.getAttendanceApplicationList();
				//$rootScope.redirectApprovalTabName = ""
				return
			}
			if ($scope.IsShiftChangeAccessible == 'true'){
				$scope.getShiftChangeApplicationList();
				//$rootScope.redirectApprovalTabName = ""
				return
			}
			if ($scope.IsTravelAccessible == 'true'){
				$scope.getTravelList();
				//$rootScope.redirectApprovalTabName = ""
				return
			}
			if ($scope.IsClaimAccessible == 'true' || $scope.IsExpenseClaimAccessible == 'true' ){
				$scope.getCtcClaimApprovalList();
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













  $scope.approveOrRejectPendingNClaim = function (nonctcclaimApp, type) {
    if (type == "APPROVE") {
      $scope.data = {}
      $scope.claimPendingNObject = nonctcclaimApp
      //$scope.claimPendingNObject.claimId = nonctcclaimApp.claimFormId;
      $scope.claimPendingNObject.empId = sessionStorage.getItem('empId');
      $scope.claimPendingNObject.menuId = '2004';
      $scope.claimPendingNObject.buttonRights = "Y-Y-Y-Y";
      $scope.claimPendingNObject.remarks = "";
      $scope.claimPendingNObject.isFromMail = "N";
      $scope.claimPendingNObject.mail = "N";
      $scope.claimPendingNObject.status = nonctcclaimApp.status;
      $scope.claimPendingNObject.claimFlag = 'NONCTC';
      $scope.claimPendingNObject.claimFormId = parseInt(nonctcclaimApp.claimFormId);
      $scope.claimPendingNObject.tranId = parseInt(nonctcclaimApp.claimFormId);
      $scope.claimPendingNObject.trackerId = nonctcclaimApp.trackerId;
      //$scope.claimPendingNObject.transAssignEmpId = 0;
      $scope.claimPendingNObject.transAssignEmpId = "";
      $scope.claimPendingNObject.claimAmount = parseInt(nonctcclaimApp.claimAmount)
      $scope.billAmount = parseInt(nonctcclaimApp.billAmount)
      $scope.claimPendingNObject.approvedAmount = parseInt(nonctcclaimApp.approvedclaimAmount)
      $scope.reimbursedAmount = parseInt(nonctcclaimApp.reimburseAmt)
      $scope.claimPendingNObject.userAprvEnd = ""
      $scope.reimbursedAmount = parseInt(nonctcclaimApp.reimburseAmt)
      $scope.claimDate = nonctcclaimApp.attDate;
      $scope.claimPendingNObject.transAssignToEmpId = nonctcclaimApp.transAssignToEmpId

      if ($scope.claimPendingNObject.isFromMail != "" || $scope.claimPendingNObject.isFromMail == "N") {
        $scope.claimPendingNObject.revisedClaimAmount = $scope.claimPendingNObject.claimAmount
        var myPopup = $ionicPopup.show({
          template: '<div><p><span style="padding-right: 10px;"><b>Bill Amount   : </b></span><span>&#x20b9;' + $scope.billAmount + '</span></p><p><span style="padding-right: 10px;"><b>Claim Date   : </b></span><span>' + $scope.claimDate + '</span></p><p><span style="padding-right: 10px;"><b>Claim Amount   : </b></span><span>&#x20b9;' + $scope.claimPendingNObject.claimAmount + '</span></p><span><b>Payment Mode      :</b></span><select id="paymentMode" name="paymentMode" ng-model="claimPendingNObject.paymentMode"><option value="-1" selected="selected">--Select--</option>	<option value="Disburse By Cash">Disburse By Cash</option><option value="Disburse By Payroll">Disburse By Payroll</option><option value="Disburse By Online">Disburse By Online</option></select></div><form name="myForm"><span>Approved Amount</span><input style="border: 1px solid #b3b3b3;" type="number" name="mybox" ng-model="claimPendingNObject.revisedClaimAmount"/><label>Approver Remarks</label><textarea style="border: 1px solid #b3b3b3;" rows="3" name="mybox" ng-model="claimPendingNObject.remark" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myForm.mybox.$error.maxlength">No more text can be added.</span></form>',
          title: 'Do you want to approve?',
          scope: $scope,
          buttons: [
            {
              text: 'Cancel'
            }, {
              text: '<b>Approve</b>',
              type: 'button-positive',
              onTap: function (e) {
                return true;
              }
            }
          ]
        });
        myPopup.then(function (res) {
          if (res) {
            $ionicLoading.show();
            $scope.claimPendingNObject.revisedClaimAmount = parseInt($scope.claimPendingNObject.revisedClaimAmount)
            $scope.claimPendingNObject.appRemarks = $scope.claimPendingNObject.remark;
            $scope.claimPendingNObject.paymentMode = $("#paymentMode").val();
            //alert("pm" + $scope.claimPendingNObject.paymentMode)

            if ($scope.claimPendingNObject.revisedClaimAmount <= 0.0) {
              showAlert("Approved Amount should be greater than 0.0");
              $ionicLoading.hide()
              return
            }
            if ($scope.claimPendingNObject.revisedClaimAmount > $scope.claimPendingNObject.claimAmount) {
              showAlert("Approved Amount should not be more than Claim Amount");
              $ionicLoading.hide()
              return
            }

            $scope.approvePendingClaimService = new approvePendingClaimService();
            $scope.approvePendingClaimService.$save($scope.claimPendingNObject, function () {
              getMenuInfoOnLoad(function () { });
              showAlert("Claim application", "Claim approved successfully");
              $scope.nonctcClaimlistFetched = false
              $scope.getNonCtcClaimApprovalList();
              $ionicLoading.hide()
            }, function (data) {
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
            });
            return
          } else {
            $ionicLoading.hide()
            return;
          }
        });
      }
    }
    if (type == "REJECT") {

      $scope.data = {}
      $scope.claimPendingNObject = nonctcclaimApp
      $scope.claimPendingNObject.claimId = nonctcclaimApp.claimFormId;
      $scope.claimPendingNObject.empId = sessionStorage.getItem('empId');
      $scope.claimPendingNObject.menuId = '2004';
      $scope.claimPendingNObject.buttonRights = "Y-Y-Y-Y";
      $scope.claimPendingNObject.remark = "";
      $scope.claimPendingNObject.isFromMail = "Y";
      $scope.claimPendingNObject.mail = "Y";
      $scope.claimPendingNObject.status = nonctcclaimApp.status;
      $scope.claimPendingNObject.claimFlag = 'NONCTC';
      $scope.claimPendingNObject.claimFormId = parseInt(nonctcclaimApp.claimFormId);
      $scope.claimPendingNObject.tranId = parseInt(nonctcclaimApp.claimFormId);
      $scope.claimPendingNObject.trackerId = nonctcclaimApp.trackerId;
      $scope.claimPendingNObject.transAssignEmpId = 0;
      $scope.claimAmount = parseInt(nonctcclaimApp.claimAmount)
      $scope.approvedAmount = parseInt(nonctcclaimApp.approvedClaimAmount)
      $scope.reimbursedAmount = parseInt(nonctcclaimApp.reimburseAmt)
      $scope.claimPendingNObject.userAprvEnd = ""
      if ($scope.claimPendingNObject.isFromMail != "" || $scope.claimPendingNObject.isFromMail == "Y") {
        var myPopup = $ionicPopup.show({
          template: '<label>Approver Remarks<form name="myRejectForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" rows="3" name="myRejectBox" ng-model="claimPendingNObject.remark" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myRejectForm.myRejectBox.$error.maxlength">No more text can be added.</span></form></label>',
          title: 'Do you want to reject?',
          scope: $scope,
          buttons: [
            { text: 'Cancel' }, {
              text: '<b>Reject</b>',
              type: 'button-positive',
              onTap: function (e) {
                return $scope.claimPendingNObject.remark || true;
              }
            }
          ]
        });
        myPopup.then(function (res) {
          if (res) {
            $ionicLoading.show();
            $scope.claimPendingNObject.appRemarks = $scope.claimPendingNObject.remark;
            $scope.rejectPendingClaimService = new rejectPendingClaimService();
            $scope.rejectPendingClaimService.$save($scope.claimPendingNObject, function () {
              $scope.nonctcClaimlistFetched = false
              $scope.getNonCtcClaimApprovalList();
              getMenuInfoOnLoad(function () { });
              $ionicLoading.hide()
              showAlert("Claim application", "Claim rejected successfully");
            }, function (data) {
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
            });
            return
          } else {
            $ionicLoading.hide()
            return;
          }
        });
      }
    }
  }

  $scope.approveOrRejectPendingCClaim = function (ctcclaimApp, type) {
    if (type == "APPROVE") {
      $scope.data = {}
      $scope.claimPendingCObject = ctcclaimApp
      $scope.claimPendingCObject.claimId = ctcclaimApp.claimFormId;
      $scope.claimPendingCObject.empId = ctcclaimApp.empId // sessionStorage.getItem('empId');
      $scope.claimPendingCObject.menuId = '2009';
      $scope.claimPendingCObject.buttonRights = "Y-Y-Y-Y";
      $scope.claimPendingCObject.remark = "";
      $scope.claimPendingCObject.isFromMail = "N";
      $scope.claimPendingCObject.mail = "N";
      $scope.claimPendingCObject.status = ctcclaimApp.status;
      $scope.claimPendingCObject.claimFlag = 'CTC';
      $scope.claimPendingCObject.claimFormId = parseInt(ctcclaimApp.ctcClaimId);
      $scope.claimPendingCObject.tranId = parseInt(ctcclaimApp.claimFormId);
      $scope.claimPendingCObject.trackerId = ctcclaimApp.trackerId;
      //$scope.claimPendingCObject.transAssignEmpId = 0;
      $scope.claimPendingCObject.transAssignEmpId = "";
      $scope.claimPendingCObject.claimAmount = parseInt(ctcclaimApp.claimAmount)
      $scope.claimPendingCObject.billAmount = parseInt(ctcclaimApp.billAmount)
      $scope.claimPendingCObject.approvedAmount = parseInt(ctcclaimApp.approvedClaimAmount)
      $scope.claimPendingCObject.reimbursedAmount = parseInt(ctcclaimApp.reimburseAmt)
      $scope.claimDate = ctcclaimApp.attDate;
      $scope.claimPendingCObject.userAprvEnd = ""

      if ($scope.claimPendingCObject.isFromMail != "" || $scope.claimPendingCObject.isFromMail == "N") {
        //$scope.claimPendingCObject.revisedClaimAmount = $scope.claimPendingCObject.claimAmount
		$scope.claimPendingCObject.revisedClaimAmount = 0
        var myPopup = $ionicPopup.show({
          template: '<div><p><span style="padding-right: 10px;"><b>Bill Amount   : </b></span><span>&#x20b9;' + $scope.claimPendingCObject.billAmount + '</span></p><p><span style="padding-right: 10px;"><b>Claim Date   : </b></span><span>' + $scope.claimDate + '</span></p><p><span style="padding-right: 10px;"><b>Claim Amount   : </b></span><span>&#x20b9;' + $scope.claimPendingCObject.claimAmount + '</span></p><span><b>Payment Month      :</b></span><select id="paymentMonth"><option>--Select--</option><option value="01">January</option><option value="02">February</option><option value="03">March</option><option value="04">April</option><option value="05">May</option><option value="06">June</option><option value="07">July</option><option value="08">August</option><option value="09">September</option><option value="10">October</option><option value="11">November</option><option value="12">December</option></select></div><form name="myForm"><span>Approved Amount</span><input style="border: 1px solid #b3b3b3;" type="number" name="mybox" ng-model="claimPendingCObject.revisedClaimAmount"/><label>Approver Remarks</label><textarea style="border: 1px solid #b3b3b3;" rows="3" name="mybox" ng-model="claimPendingCObject.remark" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myForm.mybox.$error.maxlength">No more text can be added.</span></form>',
          title: 'Do you want to approve?',
          scope: $scope,
          buttons: [
            {
              text: 'Cancel'
            }, {
              text: '<b>Approve</b>',
              type: 'button-positive',
              onTap: function (e) {
                return true;
              }
            }
          ]
        });
        myPopup.then(function (res) {
          if (res) {
            $ionicLoading.show();
            // $scope.claimPendingCObject.paymentMonth = "08";
            $scope.claimPendingCObject.paymentMonth = $("#paymentMonth").val();
            $scope.claimPendingCObject.paymentMode = $("#paymentMode").val();
            // alert("Month :" +$scope.claimPendingCObject.paymentMonth);
            $scope.claimPendingCObject.revisedClaimAmount = parseInt($scope.claimPendingCObject.revisedClaimAmount)
            $scope.claimPendingCObject.appRemarks = $scope.claimPendingCObject.remark;

            if ($scope.claimPendingCObject.revisedClaimAmount <= 0.0) {
              showAlert("Approved Amount should be greater than 0.0");
              $ionicLoading.hide()
              return
            }
            if ($scope.claimPendingCObject.revisedClaimAmount > $scope.claimPendingCObject.claimAmount) {
              showAlert("Approved Amount should not be more than Claim Amount");
              $ionicLoading.hide()
              return
            }
            $scope.approvePendingClaimService = new approvePendingClaimService();
            $scope.approvePendingClaimService.$save($scope.claimPendingCObject, function () {
              getMenuInfoOnLoad(function () { });
              showAlert("Claim application", "Claim approved successfully");
              $scope.ctcClaimlistFetched = false
              $scope.getCtcClaimApprovalList();
              $ionicLoading.hide()
            }, function (data) {
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
            });
            return
          } else {
            $ionicLoading.hide()
            return;
          }
        });
      }
    }
    if (type == "REJECT") {

      $scope.data = {}
      $scope.claimPendingCObject = ctcclaimApp;
      $scope.claimPendingCObject.claimId = ctcclaimApp.claimFormId;
      $scope.claimPendingCObject.empId = sessionStorage.getItem('empId');
      $scope.claimPendingCObject.menuId = '2009';
      $scope.claimPendingCObject.buttonRights = "Y-Y-Y-Y";
      $scope.claimPendingCObject.remark = "";
      $scope.claimPendingCObject.isFromMail = "Y";
      $scope.claimPendingCObject.mail = "Y";
      $scope.claimPendingCObject.status = ctcclaimApp.status;
      $scope.claimPendingCObject.claimFlag = 'CTC';
      $scope.claimPendingCObject.claimFormId = parseInt(ctcclaimApp.ctcClaimId);
      $scope.claimPendingCObject.tranId = parseInt(ctcclaimApp.claimFormId);
      $scope.claimPendingCObject.trackerId = ctcclaimApp.trackerId;
      //$scope.claimPendingCObject.transAssignEmpId = 0;
      $scope.claimPendingCObject.transAssignEmpId = "";
      $scope.claimAmount = parseInt(ctcclaimApp.claimAmount)
      $scope.approvedAmount = parseInt(ctcclaimApp.approvedClaimAmount)
      $scope.reimbursedAmount = parseInt(ctcclaimApp.reimburseAmt)
      $scope.claimPendingCObject.userAprvEnd = ""
      if ($scope.claimPendingCObject.isFromMail != "" || $scope.claimPendingCObject.isFromMail == "Y") {
        var myPopup = $ionicPopup.show({
          template: '<label>Approver Remarks<form name="myRejectForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" rows="3" name="myRejectBox" ng-model="claimPendingCObject.remark" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myRejectForm.myRejectBox.$error.maxlength">No more text can be added.</span></form></label>',
          title: 'Do you want to reject?',
          scope: $scope,
          buttons: [
            { text: 'Cancel' }, {
              text: '<b>Reject</b>',
              type: 'button-positive',
              onTap: function (e) {
                return $scope.claimPendingCObject.remark || true;
              }
            }
          ]
        });
        myPopup.then(function (res) {
          if (res) {
            $ionicLoading.show();
            // $scope.claimPendingCObject.remarks = res;
            $scope.claimPendingCObject.appRemarks = $scope.claimPendingCObject.remark;
            $scope.rejectPendingClaimService = new rejectPendingClaimService();
            $scope.rejectPendingClaimService.$save($scope.claimPendingCObject, function () {
              $scope.ctcClaimlistFetched = false
              $scope.getCtcClaimApprovalList();
              getMenuInfoOnLoad(function () { });
              $ionicLoading.hide()
              showAlert("Claim application", "Claim rejected successfully");
            }, function (data) {
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
            });
            return
          } else {
            $ionicLoading.hide()
            return;
          }
        });
      }
    }
  }

  $scope.approveOrRejectPendingLClaim = function (ltaclaimApp, type) {
    if (type == "APPROVE") {
      $scope.data = {}
      $scope.claimPendingCObject = ltaclaimApp
      $scope.claimPendingLObject.claimId = ltaclaimApp.claimFormId;
      $scope.claimPendingLObject.empId = sessionStorage.getItem('empId');
      $scope.claimPendingLObject.menuId = '2009';
      $scope.claimPendingLObject.buttonRights = "Y-Y-Y-Y";
      $scope.claimPendingLObject.remark = "";
      $scope.claimPendingLObject.isFromMail = "N";
      $scope.claimPendingLObject.mail = "N";
      $scope.claimPendingLObject.status = ltaclaimApp.status;
      $scope.claimPendingLObject.claimFlag = 'LTACLAIM';
      $scope.claimPendingLObject.claimFormId = parseInt(ltaclaimApp.claimFormId);
      $scope.claimPendingLObject.tranId = parseInt(ltaclaimApp.claimFormId);
      $scope.claimPendingLObject.trackerId = ltaclaimApp.trackerId;
      $scope.claimPendingLObject.transAssignEmpId = 0;
      $scope.reimbursedAmount = parseInt(ltaclaimApp.reimburseAmt)
      $scope.claimDate = ltaclaimApp.attDate;
      $scope.claimPendingLObject.claimAmount = parseInt(ltaclaimApp.claimAmount)
      $scope.claimPendingLObject.billAmount = parseInt(ltaclaimApp.billAmount)
      $scope.claimPendingLObject.approvedAmount = parseInt(ltaclaimApp.approvedClaimAmount)
      $scope.claimPendingLObject.userAprvEnd = ""

      if ($scope.claimPendingLObject.isFromMail != "" || $scope.claimPendingLObject.isFromMail == "N") {
        $scope.claimPendingLObject.revisedClaimAmount = $scope.claimPendingLObject.claimAmount
        var myPopup = $ionicPopup.show({
          template: '<div><p><span style="padding-right: 10px;"><b>Bill Amount   : </b></span><span>' + $scope.claimPendingLObject.billAmount + '</span></p><p><span style="padding-right: 10px;"><b>Claim Date   : </b></span><span>' + $scope.claimDate + '</span></p><p><span style="padding-right: 10px;"><b>Claim Amount   : </b></span><span>&#x20b9;' + $scope.claimPendingLObject.claimAmount + '</span></p><span><b>Payment Mode      :</b></span><select id="paymentMode" name="paymentMode"><option value="-1" selected="selected">--Select--</option>	<option value="Disburse By Cash">Disburse By Cash</option><option value="Disburse By Payroll">Disburse By Payroll</option><option value="Disburse By Online">Disburse By Online</option></select></div><form name="myForm"><span>Approved Amount</span><input style="border: 1px solid #b3b3b3;" type="number" name="mybox" ng-model="claimPendingLObject.revisedClaimAmount"/><label>Approver Remarks</label><textarea style="border: 1px solid #b3b3b3;" rows="3" name="mybox" ng-model="claimPendingLObject.remark" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myForm.mybox.$error.maxlength">No more text can be added.</span></form>',
          title: 'Do you want to approve?',
          scope: $scope,
          buttons: [
            {
              text: 'Cancel'
            }, {
              text: '<b>Approve</b>',
              type: 'button-positive',
              onTap: function (e) {
                return true;
              }
            }
          ]
        });
        myPopup.then(function (res) {
          if (res) {
            $ionicLoading.show();
            $scope.claimPendingLObject.remarks = res;
            $scope.claimPendingLObject.revisedClaimAmount = parseInt($scope.claimPendingLObject.revisedClaimAmount);
            $scope.claimPendingLObject.appRemarks = $scope.claimPendingLObject.remark;
            if ($scope.claimPendingLObject.revisedClaimAmount <= 0.0) {
              showAlert("Approved Amount should be greater than 0.0");
              $ionicLoading.hide()
              return
            }
            if ($scope.claimPendingLObject.revisedClaimAmount > $scope.claimPendingLObject.claimAmount) {
              showAlert("Approved Amount should not be more than Claim Amount");
              $ionicLoading.hide()
              return
            }
            $scope.approvePendingClaimService = new approvePendingClaimService();
            $scope.approvePendingClaimService.$save($scope.claimPendingLObject, function () {
              getMenuInfoOnLoad(function () { });
              showAlert("Claim application", "Claim approved successfully");
              $scope.ltaClaimlistFetched = false
              $scope.getLtaClaimApprovalList();
              $ionicLoading.hide()
            }, function (data) {
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
            });
            return
          } else {
            $ionicLoading.hide()
            return;
          }
        });
      }
    }
    if (type == "REJECT") {

      $scope.data = {}
      $scope.claimPendingLObject.claimId = ltaclaimApp.claimFormId;
      $scope.claimPendingLObject.empId = sessionStorage.getItem('empId');
      $scope.claimPendingLObject.menuId = '2009';
      $scope.claimPendingLObject.buttonRights = "Y-Y-Y-Y";
      $scope.claimPendingLObject.remark = "";
      $scope.claimPendingLObject.isFromMail = "Y";
      $scope.claimPendingLObject.mail = "Y";
      $scope.claimPendingLObject.status = ltaclaimApp.status;
      $scope.claimPendingLObject.claimFlag = 'LTACLAIM';
      $scope.claimPendingLObject.claimFormId = parseInt(ltaclaimApp.claimFormId);
      $scope.claimPendingLObject.tranId = parseInt(ltaclaimApp.claimFormId);
      $scope.claimPendingLObject.trackerId = ltaclaimApp.trackerId;
      $scope.claimPendingLObject.transAssignEmpId = 0;
      $scope.claimAmount = parseInt(ltaclaimApp.claimAmount)
      $scope.approvedAmount = parseInt(ltaclaimApp.approvedClaimAmount)
      $scope.reimbursedAmount = parseInt(ltaclaimApp.reimburseAmt)
      $scope.claimPendingLObject.userAprvEnd = ""
      if ($scope.claimPendingLObject.isFromMail != "" || $scope.claimPendingLObject.isFromMail == "Y") {
        var myPopup = $ionicPopup.show({
          template: '<label>Approver Remarks<form name="myRejectForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" rows="3" name="myRejectBox" ng-model="claimPendingLObject.remark" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myRejectForm.myRejectBox.$error.maxlength">No more text can be added.</span></form></label>',
          title: 'Do you want to reject?',
          scope: $scope,
          buttons: [
            { text: 'Cancel' }, {
              text: '<b>Reject</b>',
              type: 'button-positive',
              onTap: function (e) {
                return $scope.claimPendingLObject.remark || true;
              }
            }
          ]
        });
        myPopup.then(function (res) {
          if (res) {
            $ionicLoading.show();
            $scope.claimPendingLObject.remarks = res;
            $scope.rejectPendingClaimService = new rejectPendingClaimService();
            $scope.rejectPendingClaimService.$save($scope.claimPendingLObject, function () {
              $scope.ltaClaimlistFetched = false
              $scope.getLtaClaimApprovalList();
              getMenuInfoOnLoad(function () { });
              $ionicLoading.hide()
              showAlert("Claim application", "Claim rejected successfully");
            }, function (data) {
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
            });
            return
          } else {
            $ionicLoading.hide()
            return;
          }
        });
      }
    }
  }
  $scope.redirectToNonCtcApproval = function (nonctcclaimApp) {
    $rootScope.nonCtcObjectForApprovalRejection = nonctcclaimApp
    $state.go('nonCTCClaimApproval');
  }
  $scope.redirectToLtaApproval = function (ltaclaimApp) {
    $rootScope.ltaObjectForApprovalRejection = ltaclaimApp
    $state.go('ltaClaimApproval');
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

	$scope.getPunches = function(fromDate,toDate,empId,idx,module)
		{

			 var tmfd = new FormData();
			 tmfd.append('fromDate',fromDate)
			 tmfd.append('empId',empId)
			 tmfd.append('toDate',toDate)
			//url: "${pageContext.request.contextPath}/attendance/odApplication/getAppliedOdDetails.spr",
			$.ajax({
				url: baseURL + '/api/signin/getPunchDetails.spr',
		        data: tmfd,
		            type: 'POST',
		            dataType: 'json',
					timeout: commonRequestTimeout,
					contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
					processData: false, // NEEDED, DON'T OMIT THIS
		            success:function(result1){
						result1.htmlPunchesStr = result1.htmlPunchesStr.replace("<br>", "")
						$scope.punchStr = result1.htmlPunchesStr.replace(/<br>/g, "\n")
						if (module=="ATTREG"){
							$scope.AttendanceApplList[idx].punchStr = $scope.punchStr
						}
						if (module=="OD"){
							$scope.ODPendingApplList[idx].punchStr = $scope.punchStr
						}
						
	                   if (!$scope.$$phase)
						$scope.$apply()				

		            },
					error : function(res){
						console.log(res.status);
						
					}
		        });
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
	
	
$timeout(function () {  Initialize() }, 500)  
  
});
