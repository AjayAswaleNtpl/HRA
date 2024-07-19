
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
  return $resource((baseURL + '/api/travelApplication/getTravelApplicationReporteeList.spr'), {}, 
  { 'save': { method: 'POST', timeout: commonRequestTimeout,
  headers: {
    'Authorization': 'Bearer ' + jwtByHRAPI
    } } }, {});
});
mainModule.factory("singleApproveTravelAppService", function ($resource) {
  return $resource((baseURL + '/api/travelApplication/singleApproveTravelApp.spr'), {}, { 'save': { 
    method: 'POST', timeout: commonRequestTimeout
  , headers: {
    'Authorization': 'Bearer ' + jwtByHRAPI
    } } }, {});
});
mainModule.factory("singleRejectTravelAppService", function ($resource) {
  return $resource((baseURL + '/api/travelApplication/singleRejectTravelApp.spr'), {}, 
  { 'save': { method: 'POST', timeout: commonRequestTimeout
, headers: {
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
mainModule.controller('approvalClaimListCtrl', function ($scope, viewClaimFormService, getPhotoService,
  $filter, getTravelApplicationReporteeListService, $ionicLoading, $ionicModal, homeService,
  getRequisitionCountService, singleApproveTravelAppService, singleRejectTravelAppService, viewTravelClaim,
  getSetService, $rootScope, commonService, $ionicPopup, $http, viewAttendaceRegularisationService,
  getRequisitionCountService, viewShiftChangeApprovalService, viewODPendingApplicationService,
  rejectPendingODService, approvePendingODService, $ionicLoading, $ionicModal, viewLeaveApplicationService,
  approvePendingClaimService, rejectPendingClaimService,
  detailsService, homeService, $timeout, $state) {
  $rootScope.navHistoryPrevPage = "approvalsNew"
  //$scope.approvePageLastTab = ""

  $scope.navigateToPageWithCount = true
  if (getMyHrapiVersionNumber() >= 20) {
    $scope.IsTravelAccessible = sessionStorage.getItem('IsTravelAccessible');
    $scope.IsClaimAccessible = sessionStorage.getItem('IsClaimAccessible');
    $scope.IsExpenseClaimAccessible = sessionStorage.getItem('IsExpenseClaimAccessible'); //for ctc nonctc and lta
  } else {
    $scope.IsTravelAccessible = 'false'
    $scope.IsClaimAccessible = 'false' // travel claim
    $scope.IsExpenseClaimAccessible = 'false'
  }
  if ($rootScope.myAppVersion >= 20) {
    $scope.showPunchDetailsFeature = 'true'
  } else {
    $scope.showPunchDetailsFeature = 'false'
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

  $scope.claimPendingCObject = {}
  $scope.claimPendingLObject = {}
  $scope.claimPendingNObject = {}
  $scope.detailResObject = {}

  $scope.resultobj = {}
  var d = new Date();
  $scope.goToRequisitions = function () {
    $state.go("requestClaimList")
  }

  if (sessionStorage.getItem('department') && (sessionStorage.getItem('displayDeptName') == '"Department"')) {
    $scope.resultobj.department = sessionStorage.getItem('department');
  }

  $scope.getNonCtcClaimApprovalList = function () {
    $("#claimApplicationID").show();
    $("#applyClaim").show();
    $("#claimApproval").removeClass("active");
    $("#claimApplication").addClass("active");

    $("#ctcClaimApprovalCard").hide();
    $("#nonCtcClaimApprovalCard").show();
    $("#ltaClaimApprovalCard").hide();



    $scope.searchObj = ''
    $("#ClaimPendingApplicationID").hide();
    $("#TravelPendingApplicationID").hide();



    document.getElementById("periodDD").style.visibility = "visible"
    if ($scope.nonctcClaimlistFetched == true) {
      return;
    }
    $scope.nonctcClaimlistFetched = true

    //For NON CTC
    $scope.requesObject.ctcPayHeadId = '2';
    $scope.requesObject.reqApp = 'false';
    $scope.requesObject.reqRequest = 'false';
   // $scope.requesObject.fYearId = '1';
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
          if ($scope.nonCTCClaimApprList[i].monthId && parseInt($scope.nonCTCClaimApprList[i].monthId) > 0) {
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

    $("#ClaimPendingApplicationID").hide();
    $("#TravelPendingApplicationID").hide();
    $("#tabClaim").addClass("active");
    $scope.searchObj = ''
    document.getElementById("periodDD").style.visibility = "visible"
    if ($scope.ltaClaimlistFetched == true) {
      return;
    }
    $scope.ltaClaimlistFetched = true

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


      
      
     /* if ($rootScope.approvePageLastTab == "CLAIM_CTC"){
          
          $scope.getCClaimList();
      }else if ($rootScope.approvePageLastTab == "CLAIM_NONCTC"){
          
          $scope.getNClaimList();
      }else if ($rootScope.approvePageLastTab == "CLAIM_LTA"){
          
          $scope.getLClaimList();
      }else if ($rootScope.approvePageLastTab == "CLAIM_TRAVEL"){
          
          $scope.getTrClaimApprovalList();
      }else{
          //this is first time here , totoalclaim count >  0
          if ($scope.IsExpenseClaimAccessible=='true'){
              //defualt to ctc
            //$('.center').slick('slickGoTo', 5);
            $scope.getCClaimList();
          }else{
            //$('.center').slick('slickGoTo', 5);
            $scope.getTrClaimApprovalList();
          }
      }*/
      
      
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
    $scope.trClaimlistFetched = false;

    
    if ($rootScope.approvePageLastTab == "CLAIM_CTC"){
        $scope.ctcclaimListFetched  = false
        $scope.getCClaimList();
    }else if ($rootScope.approvePageLastTab == "CLAIM_NONCTC"){
        $scope.nctcclaimListFetched = false
        $scope.getNClaimList();
    }else if ($rootScope.approvePageLastTab == "CLAIM_LTA"){
        $scope.ltaclaimListFetched = false
        $scope.getLClaimList();
    }else if ($rootScope.approvePageLastTab == "CLAIM_TRAVEL"){
        $scope.trClaimlistFetched = false;
        $scope.getTrClaimApprovalList();
    }else{
        $scope.trClaimlistFetched = false;
        $scope.getCClaimList();
    }
}

  $scope.getCtcClaimApprovalList = function () {
    $("#claimApplicationID").show();
    $("#applyClaim").show();
    $("#ctcClaimApprovalCard").show();
    $("#nonCtcClaimApprovalCard").hide();
    $("#ltaClaimApprovalCard").hide();
    $("#claimApproval").removeClass("active");


    $scope.searchObj = ''
    $("#ClaimPendingApplicationID").hide();

    $("#trClaimApprovalCard").hide();
    $("#tabClaim").addClass("active");

    document.getElementById("periodDD").style.visibility = "visible"
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
    //$scope.requesObject.fYearId = '1';
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
          if ($scope.ctcClaimApprList[i].month && parseInt($scope.ctcClaimApprList[i].month) > 0) {
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

  $scope.getTrClaimApprovalList = function () {

    $("#claimApplicationID").show();
    $("#applyClaim").show();
    $("#ctcClaimApprovalCard").hide();
    $("#nonCtcClaimApprovalCard").hide();
    $("#ltaClaimApprovalCard").hide();
    $("#trClaimApprovalCard").show();
    $("#claimApproval").removeClass("active");


    $scope.searchObj = ''
    $("#ClaimPendingApplicationID").hide();

    $("#tabClaim").addClass("active");
    $("#tabTravel").removeClass("active");

    document.getElementById("periodDD").style.visibility = "hidden"
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
      for (var i = 0; i < $scope.reporteeList.length; i++) {
        if($scope.reporteeList[i].approvalRemarks){
          $scope.reporteeList[i].approvalRemarks = $scope.reporteeList[i].approvalRemarks.replace(/<br>/g, "\n")
          $scope.reporteeList[i].approvalRemarks = $scope.reporteeList[i].approvalRemarks.replace(/<br\/>/g, "\n")
        }
      }
      

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

  $scope.refresCTCClaimList = function () {
    $scope.ctcClaimlistFetched = false
    $scope.getCtcClaimApprovalList()

  }
  // $scope.goToRequisitions = function () {
  //   //alert("RequestListCombined");
  //   $state.go('RequestListCombined');

  // }


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
    $rootScope.travel = 0;
    $rootScope.claim = 0;

    $scope.claimTabClicked();
    getMenuInfoOnLoad(function () {
    });

    if ($scope.navigateToPageWithCount == true) {
      $scope.navigateToPageWithCount = false
      //check if rootscope has tab value

      if ($rootScope.approvePageLastTab != "") {

        if ($rootScope.approvePageLastTab == "CLAIM_CTC") {
          //$('.center1').slick('slickGoTo', 5);
          $timeout(function () { $scope.getCClaimList() }, 500)
          //$scope.getCClaimList();
        }
        if ($rootScope.approvePageLastTab == "CLAIM_NONCTC") {
          //$('.center1').slick('slickGoTo', 5);
          $timeout(function () { $scope.getNClaimList() }, 500)
          //$scope.getNClaimList();
        }
        if ($rootScope.approvePageLastTab == "CLAIM_LTA") {
          //$('.center1').slick('slickGoTo', 5);
          $timeout(function () { $scope.getLClaimList() }, 500)
          //$scope.getLClaimList();

        }
        if ($rootScope.approvePageLastTab == "CLAIM_TRAVEL") {
          //$('.center1').slick('slickGoTo', 5);
          $timeout(function () { $scope.getTrClaimList() }, 500)
          //$scope.getTrClaimList()
        }

        //return
      }



      if ($scope.IsExpenseClaimAccessible == 'true') {
        $timeout(function () { $scope.getCClaimList() }, 500)

        //$scope.getCtcClaimApprovalList();
      } else if ($scope.IsClaimAccessible == 'true') {
        $timeout(function () { $scope.getTrClaimList() }, 500)
        //$scope.getTrClaimList();
        //$scope.getCtcClaimApprovalList();
      }
      else {
        //above fail because of access rights or counts 0
        //above fail .. it may be for access rights are counts are 0

        if ($scope.IsClaimAccessible == 'true' || $scope.IsExpenseClaimAccessible == 'true') {
          $timeout(function () { $scope.getCClaimList() }, 500)
          //$scope.getCClaimList();
          //$scope.getCtcClaimApprovalList();
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

  function getMenuInfoOnLoad(success) {
    
    $rootScope.getRequisitionCountService = new getRequisitionCountService();
    $rootScope.getRequisitionCountService.$save(function (data) {
      if (data.odApplication && (sessionStorage.getItem('IsRegularizationAccessible') == 'true')) {
        attendRegularInProcessCount = data.odApplication.inProcess;
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

      if (getMyHrapiVersionNumber() >= 18) {
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

        if ($scope.IsExpenseClaimAccessible == 'true') {
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

      if (getMyHrapiVersionNumber() >= 18) {

        $scope.travelCount = travelApplCount;
        $scope.travelClaimCount = travelClaimApplCount;
        $scope.ctcCount = claimCTCApplCount;
        $scope.nonCtcCount = claimNONCTCApplCount;
        $scope.ltaCtcCount = claimLTACLAIMApplCount;

        $scope.totalClaimCount = parseInt($scope.travelClaimCount) + parseInt($scope.ctcCount) + parseInt($scope.nonCtcCount) + parseInt($scope.ltaCtcCount)

        $rootScope.totalRequestCount = $rootScope.totalRequestCount + parseInt($scope.travelCount) + $scope.totalClaimCount
        if ($scope.navigateToPageWithCount == true){
          $scope.claimTabClicked()
        }
      }

    }
      //success();
      , function (data) {
        $ionicLoading.hide()
        commonService.getErrorMessage(data);
      });
  }

  $scope.getMonthName = function (mid) {
    if (parseInt(mid) == 1) return "January"
    if (parseInt(mid) == 2) return "February"
    if (parseInt(mid) == 3) return "March"
    if (parseInt(mid) == 4) return "April"
    if (parseInt(mid) == 5) return "May"
    if (parseInt(mid) == 6) return "June"
    if (parseInt(mid) == 7) return "July"
    if (parseInt(mid) == 8) return "August"
    if (parseInt(mid) == 9) return "September"
    if (parseInt(mid) == 10) return "October"
    if (parseInt(mid) == 11) return "November"
    if (parseInt(mid) == 12) return "December"


  }

  $scope.openFileCTCClaim = function (idx, claimObj) {


    var fd = new FormData();
    fd.append("additionalId", claimObj.ctcClaimId)
    fd.append("file", idx)

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
      success: function (result) {
        if (!(result.clientResponseMsg == "OK")) {
          console.log(result.clientResponseMsg)
          handleClientResponse(result.clientResponseMsg, "openFileByCtcClaimId")
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
      error: function (res) {
        $ionicLoading.hide()
        showAlert("Something went wrong while fetching the file.");
      }

    });
  }

	$scope.openCTCdetails = function(ctcclaimApp){
    $rootScope.ctcclaimApplForApprove = ctcclaimApp;
		$state.go("approvalCTCdetails")
	
		// if(draft=="sent")
		// {
		// 	var url="viewClaimApprove.spr?tranId="+tranId+"&empId="+empId+"&trackerId="+0+"&status="+status+"&isFromMail="+"N"+"&mail=N&disableHeader=true"+"&claimFlag="+claimFlag+"&userAprvEnd="+userAprvEnd;
		// 	tb_open_new(url+'&menuId='+$("#menuId").val()+'&buttonRights='+$("#buttonRights").val()+'&height='+560+'&width='+1300+'&TB_iframe=true&modal=true');				
		// }
	}	

  $scope.redirectOnBack = function () {
    $state.go('app.approvalsMenu')
  }


  $timeout(function () { Initialize() }, 500)

});