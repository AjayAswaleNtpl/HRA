/*
 1.This controller is used to view the Approved/Rejected list for Leave,Shift,Attendance,OD.
 2.Sent for cancellation requests are also Approved/Reject for Leave.
 3.Detailed view can be seen while opening modal by clicking on the list.
 */
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
mainModule.factory("viewODApplicationService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/odApplication/getODApplication.spr'), {}, {
    'save': {
      method: 'POST',
      timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
    }
  }, {});
}]);
mainModule.factory("getYearListService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/odApplication/getYearList.spr'), {}, {
    'save': {
      method: 'POST',
      timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
    }
  }, {});
}]);
mainModule.factory("cancelODRequestService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/odApplication/cancellationProcess.spr'), {}, {
    'save': {
      method: 'POST',
      timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
    }
  }, {});
}]);
mainModule.factory("sendODRequestService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/odApplication/send.spr'), {}, {
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
mainModule.factory("viewMissPunchApplicationService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/attendance/missPunch/viewMissPunch.spr'), {}, {
    'save': {
      method: 'POST',
      timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
    }
  }, {});
}]);
mainModule.factory("viewShiftChangeApplicationService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/attendance/shiftChange/viewShiftChangeAcordingToStatus.spr'), {}, {
    'save': {
      method: 'POST',
      timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
    }
  }, {});
}]);
mainModule.factory("viewRequisitionApprovalService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/attendanceReportApi/viewRequisitionApproval.spr'), {}, { 'save': { method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 } } }, {});
}]);
mainModule.factory("sendForCancellation", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/attendance/missPunch/sendForCancellation.spr'), {}, { 'save': { method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 } } }, {});
}]);

mainModule.controller('RequestListCombinedCtrl', function ($scope, $rootScope, $filter, commonService, $state, getYearListService, $ionicPopup, viewODApplicationService, sendODRequestService, getSetService, $ionicLoading, $ionicModal, cancelODRequestService, viewLeaveApplicationService, detailsService, viewMissPunchApplicationService,
  viewShiftChangeApplicationService, getTravelApplicationListService, addClaimFormService, travelClaimDataService, viewClaimFormService, viewRequisitionApprovalService, sendForCancellation) {
  $state.go("app.requestMenu");
 return
  if ($rootScope.navHistoryCurrPage == "approvals")
  {
	if ($rootScope.HomeDashBoard){
		$rootScope.navHistoryPrevPage = "dashboard"
	  }else{
		$rootScope.navHistoryPrevPage = "selfservices"
	  }
	$rootScope.navHistoryCurrPage = "requisition"
  }else{
	$rootScope.navHistoryPrevPage = $rootScope.navHistoryCurrPage
	$rootScope.navHistoryCurrPage = "requisition"
  }
  
	//alert($rootScope.reqestPageLastTab)
	//$rootScope.reqestPageLastTab = "LEAVE"
	//document.getElementById('initialPage').value = '2'
	
  
	$scope.IsLeaveAccessible = sessionStorage.getItem('IsLeaveAccessible');
	$scope.IsODAccessible = sessionStorage.getItem('IsODAccessible');
	$scope.IsRegularizationAccessible = sessionStorage.getItem('IsRegularizationAccessible');
	$scope.IsShiftChangeAccessible = sessionStorage.getItem('IsShiftChangeAccessible');
	//console.log ("HRAPI VERSION:  " + getMyHrapiVersionNumber())
	if (getMyHrapiVersionNumber() >=20){
		$scope.IsTravelAccessible = sessionStorage.getItem('IsTravelAccessible');
		$scope.IsClaimAccessible = sessionStorage.getItem('IsClaimAccessible');
		$scope.IsExpenseClaimAccessible = sessionStorage.getItem('IsExpenseClaimAccessible'); //for ctc nonctc and lta
	}else{
		$scope.IsTravelAccessible = 'false'
		$scope.IsClaimAccessible = 'false'
		$scope.IsExpenseClaimAccessible = 'false'
	}
 	if ($rootScope.myAppVersion>=20){
		$scope.showPunchDetailsFeature='true'
	}else{
		$scope.showPunchDetailsFeature='false'
	}
		
	//$scope.showPunchDetailsFeature='false'
  $scope.navigateToPageWithCount = true
  /*
  if (document.getElementById('mainTabLeave') != null){
	  if ($scope.IsLeaveAccessible == 'true'){
		  document.getElementById('mainTabLeave').style.display='block'
	  }
  }
  if (document.getElementById('mainTabOD') != null){
	  if ($scope.IsODAccessible == 'true'){
		  document.getElementById('mainTabOD').style.display='block'
	  }
  }
  if (document.getElementById('mainTabAttReg') != null){
	  if ($scope.IsRegularizationAccessible == 'true'){
		  document.getElementById('mainTabAttReg').style.display='block'
	  }
  }
  if (document.getElementById('mainTabSC') != null){
	  if ($scope.IsShiftChangeAccessible == 'true'){
		  document.getElementById('mainTabSC').style.display='block'
	  }
  }
  if (document.getElementById('mainTabTravel') != null){  
	  if ($scope.IsTravelAccessible == 'true'){
		  document.getElementById('mainTabTravel').style.display='block'
	  }
  }
  if (document.getElementById('mainTabClaim') != null){
	  if ($scope.IsExpenseClaimAccessible == 'true' || $scope.IsClaimAccessible == 'true'){
		  document.getElementById('mainTabClaim').style.display='block'
	  }
  }
  
  */
  /*  for testing
  $scope.IsLeaveAccessible = 'true'
  $scope.IsODAccessible = 'true'
  $scope.IsRegularizationAccessible = 'true'
  $scope.IsShiftChangeAccessible = 'true'
  $scope.IsTravelAccessible = 'false'
  $scope.IsClaimAccessible = 'false' // travel claim
  $scope.IsExpenseClaimAccessible = 'false'
    */
	
	
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
  $scope.leaveListFetched = false
  $scope.odListFetched = false
  $scope.attListFetched = false
  $scope.scListFetched = false
  $scope.listCtcPeriodVO = []

  if ($rootScope.app_product_name == "QUBE") {
    $scope.cancelAttReg = 'false'
    $scope.editOD = 'false'
  }
  else {
    if ($rootScope.myAppVersion >= 15) {
      $scope.cancelAttReg = 'true'
      $scope.editOD = 'true'
    } else {
      $scope.cancelAttReg = 'false'
      $scope.editOD = 'false'
    }
  }
  

  /*$scope.downloadAttachmnent = function (od) {
    var strData = od.uploadFile
    var strUrlPrefix = 'data:' + od.uploadContentType + ";base64,"
    var url = strUrlPrefix + strData
    var blob = base64toBlob(strData, od.uploadContentType)
    downloadFileFromData(od.uploadFileName, blob, od.uploadContentType)
    event.stopPropagation();
  }*/

  if (sessionStorage.getItem('IsLeaveAccessible') != false) {
    var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
    $scope.requesObject.menuId = leaveMenuInfo.menuId;
	//alert("leave " + $scope.requesObject.menuId)
    $scope.requesObject.buttonRights = "Y-Y-Y-Y"
    $scope.requesObject.formName = "Leave"
	
	//$scope.IsLeaveAccessible = 'true'
  }
  if (sessionStorage.getItem('IsODAccessible') != false) {
    var odMenuInfo = getMenuInformation("Attendance Management", "OD Application");
	//alert("od " + $scope.requesObject.menuId)
    $scope.requesObject1.menuId = odMenuInfo.menuId;
    $scope.requesObject1.year = "" + new Date().getFullYear();
    $scope.requesObject1.level = 1
	
	//$scope.IsODAccessible = 'true'
  }
  
  if ($scope.IsLeaveAccessible != false) {
    var leaveMenuInfo = getMenuInformation("Attendance Management", "Leave Application");
    $scope.requesObject.menuId = leaveMenuInfo.menuId;
    $scope.requesObject.buttonRights = "Y-Y-Y-Y"
    $scope.requesObject.formName = "Leave"
	
	
  }
  if ($scope.IsODAccessible != false) {
    var odMenuInfo = getMenuInformation("Attendance Management", "OD Application");
    $scope.requesObject1.menuId = odMenuInfo.menuId;
    $scope.requesObject1.year = "" + new Date().getFullYear();
    $scope.requesObject1.level = 1
  }

  $scope.cancelObject = {};
  $scope.result = {}
  $scope.sendODRequestObject = {};


  $scope.getODApplicationList = function () {
    $scope.requesObjectForYear.yearId = ''
    $scope.searchObj = '';
    $("#ShiftChangeRequestIDReq").hide();
    $("#leaveApplicationIDReq").hide();
    $("#claimApplicationIDReq").hide();
    $("#RegularizationApplicationIDReq").hide();
    $("#travelApplicationIDReq").hide();
    $("#ODApplicationIDReq").show();
    $("#tabODReq").addClass("active");
    $("#tabTravelApplicationReq").removeClass("active");
    $("#tabLeaveReq").removeClass("active");
    $("#tabRegularizationReq").removeClass("active");
    $("#tabShiftApplicationReq").removeClass("active");
	
	$rootScope.reqestPageLastTab = "OD"

    if ($scope.odListFetched == true) {
      $ionicLoading.hide()
      return;
    }

    $scope.odListFetched = true

    $ionicLoading.show();
    $scope.getYearListService = new getYearListService();
    $scope.getYearListService.$save(function (data) {
      $scope.yearList = []
      if (data.yearList === undefined) {
      } else {
        $scope.yearList = data.yearList
      }

      $scope.viewOdApplication();
    }, function (data, status) {
      $scope.viewOdApplication();
    });

  };
  $scope.viewOdApplication = function () {
    //alert("view od st " + new Date())
    $ionicLoading.show();
    $scope.viewODApplicationService = new viewODApplicationService();
    $scope.viewODApplicationService.$save($scope.requesObject1, function (data) {

      $scope.requesObjectForMonth.month = ''
      $scope.ODlList = []

      if (data.odApplicationVoList === undefined) {
        //do nothing
      }
      else {
        $scope.ODlList = data.odApplicationVoList
      }

      $("#ODApplicationIDReq").show();

      for (var i = 0; i < $scope.ODlList.length; i++) {
        $scope.travelFormatedDate = $scope.ODlList[i].travelDate.split('/')
        $scope.ODlList[i].travelDate = new Date($scope.travelFormatedDate[2] + '/' + $scope.travelFormatedDate[1] + '/' + $scope.travelFormatedDate[0])

        $scope.travelFormatedDate_new = $scope.ODlList[i].travelDate_new.split('/')
        $scope.ODlList[i].travelDate_new = new Date($scope.travelFormatedDate_new[2] + '/' + $scope.travelFormatedDate_new[1] + '/' + $scope.travelFormatedDate_new[0])
        if ($scope.ODlList[i].travelDate.getTime() == $scope.ODlList[i].travelDate_new.getTime()) {
          $scope.ODlList[i].odDate = $scope.ODlList[i].travelDate;
        }
        
		//approvalRemarks comes in array
		dtHrapiFormatFromDateOD = $scope.travelFormatedDate[0] + '/' + $scope.travelFormatedDate[1] + '/' + $scope.travelFormatedDate[2]
		$scope.ODlList[i].dtHrapiFormatFromDateOD = dtHrapiFormatFromDateOD
		dtHrapiFormatToDateOD = $scope.travelFormatedDate_new[0] + '/' + $scope.travelFormatedDate_new[1] + '/' + $scope.travelFormatedDate_new[2]
		$scope.ODlList[i].dtHrapiFormatToDateOD = dtHrapiFormatToDateOD
		

      }
      for (var i = 0; i < $scope.ODlList.length; i++) {
        $scope.ODlList[i].designation = sessionStorage.getItem('designation')
        $scope.ODlList[i].department = sessionStorage.getItem('department');
        $scope.ODlList[i].empName = sessionStorage.getItem('empName');
        $scope.ODlList[i].name = sessionStorage.getItem('empName');
        if (sessionStorage.getItem('photoFileName')) {
          $scope.ODlList[i].photoFileName = sessionStorage.getItem('photoFileName')
          $scope.ODlList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
        }
        else {
          $scope.ODlList[i].photoFileName = ''
          $scope.ODlList[i].profilePhoto = ''
        }

      }
      $ionicLoading.hide()
    }, function (data, status) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
  };

  $scope.viewOdApplicationForPrevYear = function () {
    $ionicLoading.show();
    $scope.getYearListService = new getYearListService();
    $scope.getYearListService.$save(function (data) {
      $scope.yearList = []
      $scope.yearList = data.yearList
    }, function (data, status) {
    });

    $scope.requesObject1.year = parseInt(Number($scope.requesObject1.year) - 1)

    $scope.viewODApplicationService = new viewODApplicationService();
    $scope.viewODApplicationService.$save($scope.requesObject1, function (data) {
      $scope.requesObjectForMonth.month = ''
      
      $("#ODApplicationIDReq").show();
      var prevYrODListCount = $scope.ODlList.length

      if (data.odApplicationVoList === undefined) {
        //do nothing
      } else {
        $scope.ODlList = $scope.ODlList.concat(data.odApplicationVoList)
      }

      for (var i = prevYrODListCount; i < $scope.ODlList.length; i++) {
        $scope.travelFormatedDate = $scope.ODlList[i].travelDate.split('/')
        $scope.ODlList[i].travelDate = new Date($scope.travelFormatedDate[2] + '/' + $scope.travelFormatedDate[1] + '/' + $scope.travelFormatedDate[0])

        $scope.travelFormatedDate_new = $scope.ODlList[i].travelDate_new.split('/')
        $scope.ODlList[i].travelDate_new = new Date($scope.travelFormatedDate_new[2] + '/' + $scope.travelFormatedDate_new[1] + '/' + $scope.travelFormatedDate_new[0])
        if ($scope.ODlList[i].travelDate.getTime() == $scope.ODlList[i].travelDate_new.getTime()) {
          $scope.ODlList[i].odDate = $scope.ODlList[i].travelDate;
        }
      }
      for (var i = 0; i < $scope.ODlList.length; i++) {
        $scope.ODlList[i].designation = sessionStorage.getItem('designation')
        $scope.ODlList[i].department = sessionStorage.getItem('department');
        $scope.ODlList[i].empName = sessionStorage.getItem('empName');
        $scope.ODlList[i].name = sessionStorage.getItem('empName');
        if (sessionStorage.getItem('photoFileName')) {
          $scope.ODlList[i].photoFileName = sessionStorage.getItem('photoFileName')
          $scope.ODlList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
        }
        else {
          $scope.ODlList[i].photoFileName = ''
          $scope.ODlList[i].profilePhoto = ''
        }
      }
      //$scope.getRequestCounts()
	  $ionicLoading.hide()
      
      //alert("for prev over " + new Date())
    }, function (data, status) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
    $scope.requesObject1.year = parseInt(Number($scope.requesObject1.year) + 1)
  };
  $scope.getLeaveRequestList = function () {
    $scope.searchObj = '';
	 $ionicLoading.show();
    $scope.requesObjectForYear.yearId = ''
    $("#ShiftChangeRequestIDReq").hide();
    $("#ODApplicationIDReq").hide();
    $("#RegularizationApplicationIDReq").hide();
    $("#travelApplicationIDReq").hide();
    $("#leaveApplicationIDReq").show();
    $("#claimApplicationIDReq").hide();
    $("#tabClaimApplicationReq").removeClass("active");
    $("#tabLeaveReq").addClass("active");
    $("#tabODReq").removeClass("active");
    $("#tabRegularizationReq").removeClass("active");
    $("#tabShiftApplicationReq").removeClass("active");
    $("#tabTravelApplicationReq").removeClass("active");
	
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
  $scope.reDirectToFreshLeavePage = function () {
    $state.go('leaveApplication')
  }
  $scope.reDirectToODApplictaionPage = function () {
    $rootScope.dataExchForODEdit = 'false'
    $state.go('odApplication')
  }
  $scope.reDirectToShiftChangePage = function () {
    $state.go('shiftChange')
  }
  $scope.reDirectToAttendanceRegularizationPage = function () {
    $state.go('attendanceRegularisation')
  }
  $scope.cancelODRequest = function (status, ID, travelDate) {
    $ionicLoading.show();
    $scope.cancelObject.menuId = $scope.requesObject1.menuId
    $scope.cancelObject.buttonRights = $scope.requesObject.buttonRights
    $scope.cancelObject.odId = ID
    //$scope.cancelObject.status = status
	$scope.cancelObject.status = "SENT FOR APPROVAL"
    $scope.traveleDate = travelDate
    $scope.cancelObject.travel = $filter('date')($scope.traveleDate, 'dd/MM/yyyy');
    $scope.cancelObject.level = $scope.requesObject1.level
    $scope.cancelODRequestService = new cancelODRequestService();
    $scope.cancelODRequestService.$save($scope.cancelObject, function (data) {
      if (!(data.clientResponseMsg == "OK")) {
        console.log(data.clientResponseMsg)
        handleClientResponse(data.clientResponseMsg, "cancelODRequestService")
      }

      $ionicLoading.hide();
      if (data.message != null) {
        $ionicLoading.hide()
        showAlert("OD", data.message);
      }
      $ionicLoading.show();
      $scope.odListFetched = false
      $scope.getODApplicationList();
      $ionicLoading.hide();
      $("#leaveApplicationIDReq").hide();
      $("#travelApplicationIDReq").hide();
      $("#ShiftChangeRequestIDReq").hide();
      $("#RegularizationApplicationIDReq").hide();
      $("#ODApplicationIDReq").show();
      $("#tabODReq").addClass("active");
      $("#tabRegularizationReq").removeClass("active");
      $("#tabShiftApplicationReq").removeClass("active");
      $("#tabTravelApplicationReq").removeClass("active");
      $("#tabLeaveReq").removeClass("active");
    }, function (data, status) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    })
  }
  $scope.sendODRequest = function (status, ID, travelDate) {
    $ionicLoading.show({});
    $scope.sendODRequestObject.menuId = $scope.requesObject1.menuId
    $scope.sendODRequestObject.buttonRights = $scope.requesObject.buttonRights
    $scope.sendODRequestObject.empId = sessionStorage.getItem('empId')
    $scope.sendODRequestObject.year = $scope.requesObject1.year
    $scope.sendODRequestObject.odId = ID
    $scope.sendODRequestObject.status = status
    $scope.sendODRequestObject.travel = travelDate
    $scope.sendODRequestObject.level = $scope.requesObject1.level
    $scope.sendODRequestService = new sendODRequestService();
    $scope.sendODRequestService.$save($scope.sendODRequestObject, function (data) {
      if (!(data.clientResponseMsg == "OK")) {
        console.log(data.clientResponseMsg)
        handleClientResponse(data.clientResponseMsg, "sendODRequestService")
      }

      if (data.msgAuto == "" || data.msgAuto === undefined) showAlert("OD", "Something went wrong.")
      else {
        showAlert("OD", data.msgAuto)
      }
      $scope.odListFetched = false
      $scope.getODApplicationList();
      $ionicLoading.hide()
      $("#RegularizationApplicationIDReq").hide();
      $("#leaveApplicationIDReq").hide();
      $("#ShiftChangeRequestIDReq").hide();
      $("#travelApplicationIDReq").hide();
      $("#ODApplicationIDReq").show();
      $("#tabODReq").addClass("active");
      $("#tabRegularizationReq").removeClass("active");
      $("#tabShiftApplicationReq").removeClass("active");
      $("#tabTravelApplicationReq").removeClass("active");
      $("#tabLeaveReq").removeClass("active");
    }, function (data, status) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    })
  }
  $scope.onConfirm = function (type, status, odID, travelDate) {
    if (type == 1) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Are you sure',
        template: 'Do you want to send for approval?',
      });
      confirmPopup.then(function (res) {
        if (res) {
          $scope.sendODRequest(status, odID, travelDate)
          return
        } else {
          return;
        }
      });
    }
    else if (type == 2) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Are you sure',
        template: 'Do you want to cancel?',
      });
      confirmPopup.then(function (res) {
        if (res) {
          $scope.cancelODRequest(status, odID, travelDate)
          return
        } else {
          return;
        }
      });
    }
  }
  $scope.missPunchdetailInfo = function (missPunchAppliList) {
    $scope.missPunchDetails = missPunchAppliList
    $scope.missPunchDetails.remarks = missPunchAppliList.remarks;
    if ($scope.missPunchDetails.remarks == "FSISO") {
      $scope.fullRemarks = "Forgot to Sign in Sign Out (FSISO)"
    }
    else if ($scope.missPunchDetails.remarks == "FSI") {
      $scope.fullRemarks = "Forgot to Sign in (FSI)"
    }
    else if ($scope.missPunchDetails.remarks == "FSO") {
      $scope.fullRemarks = "Forgot to Sign Out (FSO)"
    }
    else if ($scope.missPunchDetails.remarks == "MSISO") {
      $scope.fullRemarks = "Modify Sign in Sign Out (MSISO)"
    }
    else if ($scope.missPunchDetails.remarks == "NEWEMP") {
      $scope.fullRemarks = "New Employee (NEWEMP)"
    }
    else if ($scope.missPunchDetails.remarks == "UNPLANHD") {
      $scope.fullRemarks = "Unplanned Holiday (UNPLANHD)"
    }
    else if ($scope.missPunchDetails.remarks == "EG") {
      $scope.fullRemarks = "Early Going (EG)"
    }
    else if ($scope.missPunchDetails.remarks == "LC") {
      $scope.fullRemarks = "Late Coming (LC)"
    }
    else if ($scope.missPunchDetails.remarks == "OTH") {
      $scope.fullRemarks = "Other (OTH)"
    }

    dt1 = new Date("October 13, 2014 " + $scope.missPunchDetails.inTimeStr + ":00");
    dt2 = new Date("October 13, 2014 " + $scope.missPunchDetails.outTimeStr + ":00");
    var diffHrsMin = $scope.diff_HrsMin(dt1, dt2)
    $scope.missPunchDetails.workedHrs = diffHrsMin
    $scope.openModalAttend();
    $ionicLoading.hide()
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

  $scope.getRegularizationRequestListPrevMonth = function () {

    if ($scope.requesObjectForMonth.month == 1) {
      $scope.requesObjectForMonth.month = 12
      $scope.requesObjectForYear.yearId = Number($scope.requesObjectForYear.yearId) - 1
    } else {
      $scope.requesObjectForMonth.month = Number($scope.requesObjectForMonth.month) - 1
    }
    $scope.greyArrowForNextMonth = false
    $scope.attListFetched = false
    $scope.getRegularizationRequestList()
  }
  $scope.getRegularizationRequestListNextMonth = function () {

    if ($scope.requesObjectForMonth.month == 12) {
      $scope.requesObjectForMonth.month = 1
      $scope.requesObjectForYear.yearId = Number($scope.requesObjectForYear.yearId) + 1
    } else {
      $scope.requesObjectForMonth.month = Number($scope.requesObjectForMonth.month) + 1

    }
    $scope.attListFetched = false
    $scope.getRegularizationRequestList()


    todayYR = new Date().getFullYear()
    todayMON = Number(new Date().getMonth()) + 1
    tmpMon = $scope.requesObjectForMonth.month
    if (todayMON < 10) { todayMON = "0" + todayMON }
    if (tmpMon < 10) { tmpMon = "0" + tmpMon }

    if ($scope.requesObjectForYear.yearId + tmpMon + "" == todayYR.toString() + todayMON.toString()) {
      $scope.greyArrowForNextMonth = true
      return;
    }
  }
  $scope.getTravelRequestList = function () {
    $scope.requesObject = {}
    $scope.searchObj = '';
    $("#travelApplicationIDReq").show();
    $("#claimApplicationIDReq").hide();
    $("#tabClaimReq").removeClass("active");
    $("#tabClaimApplicationReq").removeClass("active");
    $("#tabRegularizationReq").removeClass("active");
    $("#leaveApplicationIDReq").hide();
    $("#ODApplicationIDReq").hide();
    $("#ShiftChangeRequestIDReq").hide();
    $("#RegularizationApplicationIDReq").hide();
    $("#tabLeaveReq").removeClass("active");
    $("#tabODReq").removeClass("active");
    $("#tabShiftApplicationReq").removeClass("active");
    $("#tabTravelApplicationReq").addClass("active");
	
	$rootScope.reqestPageLastTab = "TRAVEL"

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
    $scope.travelClaimDataService = new travelClaimDataService();
    $scope.travelClaimDataService.$save($scope.requesObject, function (data) {
      if (!(data.clientResponseMsg == "OK")) {
        console.log(data.clientResponseMsg)
        handleClientResponse(data.clientResponseMsg, "viewTravelClaimService")
      }

      $ionicLoading.hide();
      $scope.claimApplList = []
      $scope.claimApplList = data.travelClaimForm.travelClaimVO

      for (var i = 0; i < $scope.claimApplList.length; i++) {
        $scope.apprDate = $scope.claimApplList[i].apprDate.split('/')
        $scope.claimApplList[i].apprDate = new Date($scope.apprDate[2] + '/' + $scope.apprDate[1] + '/' + $scope.apprDate[0])
		$scope.claimApplList[i].approvalRemarks = $scope.claimApplList[i].approvalRemarks.replace(/<br>/g, "\n")
		
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
	
	  
    if ($scope.ltaclaimListFetched == true) {
	  $ionicLoading.hide()
      return;
    }
    $scope.ltaclaimListFetched = true;
	
  
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
    if ($scope.ctcclaimListFetched == true) {
		$ionicLoading.hide()
      return;
    }
	
		  
	
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

  $scope.goToApprovals = function () {
    $state.go('MyApprovalsCombined')
  }

  $scope.getRegularizationRequestList = function () {
    $scope.searchObj = '';
    $("#leaveApplicationIDReq").hide();
    $("#travelApplicationIDReq").hide();
    $("#ODApplicationIDReq").hide();
    $("#ShiftChangeRequestIDReq").hide();
    $("#RegularizationApplicationIDReq").show();
    $("#tabLeaveReq").removeClass("active");
    $("#tabODReq").removeClass("active");
    $("#tabShiftApplicationReq").removeClass("active");
    $("#tabRegularizationReq").addClass("active");
    $("#claimApplicationIDReq").hide();
    $("#tabClaimApplicationReq").removeClass("active");
    $("#tabTravelApplicationReq").removeClass("active");
    var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");
    $scope.requesObject.menuId = attendanceMenuInfo.menuId;
    $scope.requesObject.fromEmail = "N"

	$rootScope.reqestPageLastTab = "ATTREG"
	
    if ($scope.attListFetched == true) {
	  $ionicLoading.hide({});
      return;
    }
    $scope.attListFetched = true

    if (!$scope.requesObjectForYear.yearId) {
      $scope.requesObject.year = new Date().getFullYear();
      $scope.requesObjectForYear.yearId = $scope.requesObject.year.toString()
    } else {
      $scope.requesObject.year = $scope.requesObjectForYear.yearId
      $scope.requesObjectForYear.yearId = $scope.requesObjectForYear.yearId
    }
    if (!$scope.requesObjectForMonth.month) {
      $scope.requesObject.monthId = parseInt(new Date().getMonth()) + 1;
      $scope.requesObjectForMonth.month = $scope.requesObject.monthId
    } else {
      $scope.requesObject.monthId = $scope.requesObjectForMonth.month;
    }
    $scope.monthName = monthNumToName($scope.requesObject.monthId)
    $ionicLoading.show({});
    $scope.viewMissPunchApplicationService = new viewMissPunchApplicationService();
    $scope.viewMissPunchApplicationService.$save($scope.requesObject, function (data) {
      if (!(data.clientResponseMsg == "OK")) {
        console.log(data.clientResponseMsg)
        handleClientResponse(data.clientResponseMsg, "viewMissPunchApplicationService")
		$ionicLoading.hide()
      }
		
	  if (data.missedPunchForm){
		$scope.yearListforAtt = data.missedPunchForm.listYear;
	  }else{
		  $ionicLoading.hide()
		 showAlert("Something went wrong. Please try later.")
		 console.log("List year for att reg. undefined, Line 1235 of request list")
		 return
	  }

      $scope.lockingPeriod = sessionStorage.getItem('lockingPeriod');
      if (!$scope.lockingPeriod) {
        $ionicLoading.hide()
        showAlert("", "Either shift not available or locking period passed away for selected criteria");

        //return;
      }
      $scope.monthList = data.listMonth;
      $scope.missPunchAppliList = data.missedPunchForm.missedPunchVOList;
      if (Object.keys(data).length > 0) {
        if ($scope.missPunchAppliList.length > 0) {
          $scope.missPunchAppliList = data.missedPunchForm.missedPunchVOList;
          for (var i = 0; i < $scope.missPunchAppliList.length; i++) {
            $scope.attDateFormated = $scope.missPunchAppliList[i].outTimeDateStr.split('/')
            $scope.missPunchAppliList[i].outTimeDateStr = new Date($scope.attDateFormated[2] + '/' + $scope.attDateFormated[1] + '/' + $scope.attDateFormated[0])

            $scope.missPunchAppliList[i].appRemarks = $scope.missPunchAppliList[i].appRemarks.replace(/<br>/g, "\n")
			
		
			dtHrapiFormatDate = $scope.attDateFormated[0] + '/' + $scope.attDateFormated[1] + '/' + $scope.attDateFormated[2]
			$scope.missPunchAppliList[i].dtHrapiFormatDate = dtHrapiFormatDate

          }
        }
        $("#attendanceRegularisationID").show();
      }
      //$scope.getRequestCounts()
	  
      $ionicLoading.hide()
    }, function (data, status) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
  }

  $scope.shiftChangeDetailInfo = function (shiftChangeAppliList) {
    var detailShiftChangeObject = {};
    detailShiftChangeObject.fromDate = shiftChangeAppliList.fromDate;
    detailShiftChangeObject.status = shiftChangeAppliList.status;
    detailShiftChangeObject.toDate = shiftChangeAppliList.toDate;
    detailShiftChangeObject.rosterShiftName = shiftChangeAppliList.rosterShiftName;
    detailShiftChangeObject.changedShiftName = shiftChangeAppliList.changedShiftName;
    detailShiftChangeObject.reasonToChange = shiftChangeAppliList.reasonToChange;
    detailShiftChangeObject.appRemarks = shiftChangeAppliList.appRemarks;
    detailShiftChangeObject.lastAppRemarks = shiftChangeAppliList.lastAppRemarks;
    detailShiftChangeObject.approvalPendingFrom = shiftChangeAppliList.approvalPendingFrom;
    $scope.shiftChangeDetails = detailShiftChangeObject
    $scope.openModalShiftChange();
    $ionicLoading.hide()
  }
  $ionicModal.fromTemplateUrl('my-modal-shift-change.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modalShiftChange) {
    $scope.modalShiftChange = modalShiftChange;
  });
  $scope.openModalShiftChange = function () {
    $scope.modalShiftChange.show();
  };
  $scope.closeModalShiftChange = function () {
    $scope.modalShiftChange.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.modalShiftChange.remove();
  });
  $scope.$on('modalShiftChange.hidden', function () {
  });
  $scope.$on('modalShiftChange.removed', function () {
  });
  $ionicModal.fromTemplateUrl('my-modal-attend.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modalAttend) {
    $scope.modalAttend = modalAttend;
  });
  $scope.openModalAttend = function () {
    $scope.modalAttend.show();
  };
  $scope.closeModalAttend = function () {
    $scope.modalAttend.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.modalAttend.remove();
  });
  $scope.$on('modalAttend.hidden', function () {
  });
  $scope.$on('modalAttend.removed', function () {
  });

  $scope.getShiftChangeRequestList = function () {
    $scope.requesObjectForYear.yearId = ''
    $scope.searchObj = '';
    $("#leaveApplicationIDReq").hide();
    $("#claimApplicationIDReq").hide();
    $("#tabClaimApplicationReq").removeClass("active");
    $("#ODApplicationIDReq").hide();
    $("#RegularizationApplicationIDReq").hide();
    $("#travelApplicationIDReq").hide();
    $("#ShiftChangeRequestIDReq").show();
    $("#tabLeaveReq").removeClass("active");
    $("#tabODReq").removeClass("active");
    $("#tabRegularizationReq").removeClass("active");
    $("#tabShiftApplicationReq").addClass("active");
    $("#tabTravelApplicationReq").removeClass("active");
	
	$rootScope.reqestPageLastTab = "SC"
	
    if ($scope.scListFetched == true) {
	  $ionicLoading.hide()
      return;
    }
    $scope.scListFetched = true

    var shiftChangeMenuInfo = getMenuInformation("Attendance Management", "Shift Change");
    $scope.requesObject.menuId = shiftChangeMenuInfo.menuId;

    $scope.requesObject.empCode = sessionStorage.getItem('empCode');
    $scope.requesObject.buttonRights = "Y-Y-Y-Y";
    $ionicLoading.show({});
    $scope.viewShiftChangeApplicationService = new viewShiftChangeApplicationService();
    $scope.viewShiftChangeApplicationService.$save($scope.requesObject, function (data) {
      $scope.requesObjectForMonth.month = ''
      if (data.form.shiftChangeVOList.length == 0) {
        $ionicLoading.hide()
        return;
      }

      if (Object.keys(data).length > 0) {
        if (data.form.shiftChangeVOList.length > 0) {
          $scope.shiftChangeAppliList = data.form.selfShiftChangeVOList;
          for (var i = 0; i < $scope.shiftChangeAppliList.length; i++) {

            $scope.shiftFromDateFormated = $scope.shiftChangeAppliList[i].reqDate.split('/')
            $scope.shiftChangeAppliList[i].fromDate = new Date($scope.shiftFromDateFormated[2] + '/' + $scope.shiftFromDateFormated[1] + '/' + $scope.shiftFromDateFormated[0])

            if ($scope.shiftChangeAppliList[i].reqDate != null) {
              $scope.createdDate = $scope.shiftChangeAppliList[i].reqDate.split('/')
              $scope.shiftChangeAppliList[i].reqDate = new Date($scope.createdDate[2] + '/' + $scope.createdDate[1] + '/' + $scope.createdDate[0])
            }

            if (!(data.form.selfShiftChangeVOList === undefined)) {
              $scope.shiftChangeAppliList[i].approvalPendingFrom = data.form.selfShiftChangeVOList[i].approvalPendingFrom;
            }
            if ($scope.shiftChangeAppliList[i].appRemarks != null) {
              if ($scope.shiftChangeAppliList[i].appRemarks.indexOf("<br>") > -1) {
                $scope.shiftChangeAppliList[i].appRemarks = $scope.shiftChangeAppliList[i].appRemarks.replace(/<br>/g, "\n")
              }
            }
          }
        }
      }
      //$scope.getRequestCounts()
      $ionicLoading.hide()
	  $("#ShiftChangeRequestIDReq").show();
    }, function (data, status) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
  }
  function Initialize() {
	
    $ionicLoading.show();
    $scope.getRequestCounts()
    //$ionicLoading.hide();
  }
  $scope.refreshLeaveList = function () {
    $scope.leaveListFetched = false
    $scope.getLeaveRequestList()

  }

  $scope.refreshODList = function () {

    $scope.odListFetched = false
    $scope.getODApplicationList()
  }
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

  $scope.refreshAttList = function () {

    $scope.attListFetched = false
    $scope.getRegularizationRequestList()
  }

  $scope.refreshSCList = function () {

    $scope.scListFetched = false
    $scope.getShiftChangeRequestList()
  }


  $scope.goSendForCancelation = function (selItem) {

  var confirmPopup = $ionicPopup.confirm({
        title: 'Are you sure',
        template: 'Do you want to send for cancellation ?',
      });
      confirmPopup.then(function (res) {
        if (res) {
		
			$ionicLoading.show();
			$scope.tmpSendObject = {}

			var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");
			$scope.tmpSendObject.menuId = attendanceMenuInfo.menuId;
			$scope.tmpSendObject.buttonRights = "Y-Y-Y-Y"
			$scope.tmpSendObject.transId = selItem.transId
			$scope.tmpSendObject.empName = selItem.empName

			$scope.sendForCancellation = new sendForCancellation();
			$scope.sendForCancellation.$save($scope.tmpSendObject, function (data) {
			  showAlert(data.msg)
			  $scope.attListFetched = false
			  $scope.getRegularizationRequestList();

			}, function (data, status) {
			  $scope.attListFetched = false
			  $scope.getRegularizationRequestList();
			});
		} else {
		  return;
		}
	 });
			
    
  }

  $scope.showDetails = function (status, odId) {
    $rootScope.dataExchOdId = odId
    $rootScope.dataExchStatus = status
    $rootScope.dataExchForODEdit = 'true'
    $state.go('odApplication')

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


  
  function monthNumToName(monthnum) {
    var months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May',
      'Jun', 'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec'
    ];

    return months[monthnum - 1] || '';
  }
  $scope.reDirectToFreshTravelPage = function () {

    $state.go('travelApplication');

  }
  $scope.reDirectToFreshClaimPage = function (claim) {

    if (claim.travelClaimStatus == null) {
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
  $scope.downloadAttachmnent = function (travel) {

    var strData = travel.uploadFile
    //var strUrlPrefix='data:"application/pdf;base64,'
    var strUrlPrefix = 'data:' + travel.uploadContentType + ";base64,"
    var url = strUrlPrefix + strData
    var blob = base64toBlob(strData, travel.uploadContentType)
    downloadFileFromData(travel.uploadFileName, blob, travel.uploadContentType)
    event.stopPropagation();
  }

  $scope.showTravelDetailForm = function (travelObj) {
    $rootScope.travelTransIdForClaimApply = travelObj.travelTransId;
    $rootScope.gv_travelShowDetailsFrom = "REQ_TRAVEL_LIST";
    $rootScope.gv_travelShowDetailsStaus = travelObj.travelStatus;
    $state.go('claimTravelDetails');
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
		  $('.center').slick('slickGoTo', 5);
		  $scope.getCClaimList();
	  }else if ($rootScope.reqestPageLastTab == "CLAIM_NONCTC"){
		  $('.center').slick('slickGoTo', 5);
		  $scope.getNClaimList();
	  }else if ($rootScope.reqestPageLastTab == "CLAIM_LTA"){
		  $('.center').slick('slickGoTo', 5);
		  $scope.getLClaimList();
	  }else if ($rootScope.reqestPageLastTab == "CLAIM_TRAVEL"){
		  $('.center').slick('slickGoTo', 5);
		  $scope.getClaimRequestList();
	  }else{
		  //this is first time here , totoalclaim count >  0
		  if ($scope.IsExpenseClaimAccessible=='true'){
			  //defualt to ctc
			$('.center').slick('slickGoTo', 5);
			$scope.getCClaimList();
		  }else{
			$('.center').slick('slickGoTo', 5);
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
	  
	  if ($rootScope.reqestPageLastTab == "CLAIM_CTC"){
		  $('.center').slick('slickGoTo', 5);
		  $scope.ctcclaimListFetched  = false
		  $scope.getCClaimList();
	  }else if ($rootScope.reqestPageLastTab == "CLAIM_NONCTC"){
		  $('.center').slick('slickGoTo', 5);
		  $scope.nctcclaimListFetched = false
		  $scope.getNClaimList();
	  }else if ($rootScope.reqestPageLastTab == "CLAIM_LTA"){
		  $('.center').slick('slickGoTo', 5);
		  $scope.ltaclaimListFetched = false
		  $scope.getLClaimList();
	  }else if ($rootScope.reqestPageLastTab == "CLAIM_TRAVEL"){
		  $('.center').slick('slickGoTo', 5);
		  $scope.travelListFetched = false;
		  $scope.getClaimRequestList();
	  }else{
		  $('.center').slick('slickGoTo', 5);
		  $scope.travelClaimListFetched = false;
		  $scope.getCClaimList();
	  }
  }

  $scope.redirectToLtaApproval = function (ltaclaimApp) {
	$rootScope.SourcePage = "request_page"
    $rootScope.ltaObjectForApprovalRejection = ltaclaimApp
    $state.go('ltaClaimApproval');
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
			 tmfd.append('empId',sessionStorage.getItem('empId'))
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
							$scope.missPunchAppliList[idx].punchStr = $scope.punchStr
						}
						if (module=="OD"){
							$scope.ODlList[idx].punchStr = $scope.punchStr
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
  
  Initialize();
  
});
