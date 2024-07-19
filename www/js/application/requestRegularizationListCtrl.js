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
  return $resource((baseURL + '/api/attendanceReportApi/viewRequisitionApproval.spr'), {}, {
    'save': {
      method: 'POST', timeout: commonRequestTimeout,
      headers: {
        'Authorization': 'Bearer ' + jwtByHRAPI
      }
    }
  }, {});
}]);
mainModule.factory("sendForCancellation", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/attendance/missPunch/sendForCancellation.spr'), {}, {
    'save': {
      method: 'POST', timeout: commonRequestTimeout,
      headers: {
        'Authorization': 'Bearer ' + jwtByHRAPI
      }
    }
  }, {});
}]);
mainModule.factory("sendForCancellationAjax", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/attendance/missPunch/sendForCancellationAjax.spr'), {}, {
    'save': {
      method: 'POST', timeout: commonRequestTimeout,
      headers: {
        'Authorization': 'Bearer ' + jwtByHRAPI
      }
    }
  }, {});
}]);


mainModule.controller('requestRegularizationListCtrl', function ($scope, $rootScope, $filter, commonService, $state, getYearListService, $ionicPopup, viewODApplicationService, sendODRequestService, getSetService, $ionicLoading, $ionicModal, cancelODRequestService,
  $timeout, viewLeaveApplicationService, detailsService, viewMissPunchApplicationService,
  viewShiftChangeApplicationService, getTravelApplicationListService, addClaimFormService, travelClaimDataService, viewClaimFormService,
  viewRequisitionApprovalService, sendForCancellation, sendForCancellationAjax) {
  $rootScope.navHistoryPrevPage = "requisitionNew"
  $scope.IsRegularizationAccessible = sessionStorage.getItem('IsRegularizationAccessible');
  if ($rootScope.myAppVersion >= 20) {
    $scope.showPunchDetailsFeature = 'true'
  } else {
    $scope.showPunchDetailsFeature = 'false'
  }
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
  $scope.attListFetched = false

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
  $scope.redirectOnBack = function () {
    $state.go('app.requestMenu')
  }
  $scope.reDirectToAttendanceRegularizationPage = function () {
    $state.go('attendanceRegularisation')
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


  $scope.getRegularizationRequestList = function () {
    $scope.searchObj = '';

    var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");
    $scope.requesObject.menuId = attendanceMenuInfo.menuId;
    $scope.requesObject.fromEmail = "N"

    $rootScope.reqestPageLastTab = "ATTREG"

    if ($scope.attListFetched == true) {
      $ionicLoading.hide({});
      return;
    }
    $scope.attListFetched = true

    

    if ($rootScope.monthForAttRegList) {
      if ($rootScope.monthForAttRegList != "") {
        //alert("data came " + $rootScope.monthForAttRegList +" " + $rootScope.yearForAttRegList)
        //alert($rootScope.yearForAttRegList + " " + $rootScope.monthForAttRegList)
        $scope.requesObjectForYear.yearId = $rootScope.yearForAttRegList
        $scope.requesObjectForMonth.month = $rootScope.monthForAttRegList

        $rootScope.monthForAttRegList = ""
        $rootScope.yearForAttRegList = ""
      }
    }



    if (!$scope.requesObjectForYear.yearId) {
      $scope.requesObject.year = new Date().getFullYear();
      $scope.requesObjectForYear.yearId = $scope.requesObject.year.toString()
    } else {
      $scope.requesObject.year = $scope.requesObjectForYear.yearId
      $scope.requesObjectForYear.yearId = $scope.requesObject.year.toString()
    }
    if (!$scope.requesObjectForMonth.month) {
      $scope.requesObject.monthId = parseInt(new Date().getMonth()) + 1;
      $scope.requesObjectForMonth.month = $scope.requesObject.monthId
    } else {
      $scope.requesObject.monthId = $scope.requesObjectForMonth.month;
    }

    $scope.monthName = monthNumToName($scope.requesObject.monthId)
    // alert( $scope.monthName + " " + $scope.requesObject.year)
    $ionicLoading.show({});
    $scope.viewMissPunchApplicationService = new viewMissPunchApplicationService();
    $scope.viewMissPunchApplicationService.$save($scope.requesObject, function (data) {
      if (!(data.clientResponseMsg == "OK")) {
        console.log(data.clientResponseMsg)
        handleClientResponse(data.clientResponseMsg, "viewMissPunchApplicationService")
        $ionicLoading.hide()
        return
      }

      if (data.newDayFlag) {
        $rootScope.newDayFlag = data.newDayFlag.toUpperCase();
      } else {
        $rootScope.newDayFlag = "No"
      }
      

      if (data.shift_not_defined_error == "true") {
        $scope.shift_not_defined_error = "true"
        document.getElementById('btnApply').disabled = true
        showAlert("Attendance regularization ", "Either shift is not available or locking period is over or attendance rule is not set for the selected criteria.");
        $ionicLoading.hide()
        return
      } else {
        $scope.shift_not_defined_error = "false"
        document.getElementById('btnApply').disabled = false
      }
      if (data.missedPunchForm) {
        $scope.yearListforAtt = data.missedPunchForm.listYear;
      } else {
        $ionicLoading.hide()
        showAlert("Something went wrong. Please try later.")
        console.log("List year for att reg. undefined, Line 1235 of request list")
        return
      }

      $scope.lockingPeriod = sessionStorage.getItem('lockingPeriod');
      if (!$scope.lockingPeriod) {
        $ionicLoading.hide()
        showAlert("", "Either shift is not available or locking period is over or attendance rule is not set for the selected criteria.");

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
            if ($scope.missPunchAppliList[i].appRemarks) {
              $scope.missPunchAppliList[i].appRemarks = $scope.missPunchAppliList[i].appRemarks.replace(/<br>/g, "\n")
              $scope.missPunchAppliList[i].appRemarks = $scope.missPunchAppliList[i].appRemarks.replace(/<BR>/g, "\n")
              $scope.missPunchAppliList[i].appRemarks = $scope.missPunchAppliList[i].appRemarks.replace(/&#13;/g, "\n")
              $scope.missPunchAppliList[i].appRemarks = $scope.missPunchAppliList[i].appRemarks.replace(/&#10;/g, "\n")

            }




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

  $scope.refreshAttList = function () {

    $scope.attListFetched = false
    $scope.getRegularizationRequestList()
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


  function monthNumToName(monthnum) {
    var months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May',
      'Jun', 'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec'
    ];

    return months[monthnum - 1] || '';
  }

  $scope.getPunches = function (fromDate, toDate, obj, module) {
    $ionicLoading.show()
    // if(document.getElementById("punch_"+idx).style.display=="none"){
    //   document.getElementById("punch_"+idx).innerHTML = "Show Punches"
    //   document.getElementById("punch_"+idx).style.display = ''
    // }else{
    //   document.getElementById("punch_"+idx).innerHTML = "Hide Punches"
    //   document.getElementById("punch_"+idx).style.display = "none"
    // }
    $timeout(function () {
      var tmfd = new FormData();
      tmfd.append('fromDate', fromDate)
      tmfd.append('empId', sessionStorage.getItem('empId'))
      tmfd.append('toDate', toDate)
      //url: "${pageContext.request.contextPath}/attendance/odApplication/getAppliedOdDetails.spr",
      $.ajax({
        url: baseURL + '/api/signin/getPunchDetails.spr',
        data: tmfd,
        type: 'POST',
        dataType: 'json',
        timeout: commonRequestTimeout,
        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        processData: false, // NEEDED, DON'T OMIT THIS
        headers: {
          'Authorization': 'Bearer ' + jwtByHRAPI
        },
        success: function (result1) {
          if (result1.htmlPunchesStr) {
            result1.htmlPunchesStr = result1.htmlPunchesStr.replace(/<br>/g, "")
            $scope.punchStr = result1.htmlPunchesStr.replace(/<br>/g, "\n")
            if (module == "ATTREG") {
              $timeout(function () {
                obj.punchStr = $scope.punchStr
              }, 200)

            }
            if (module == "OD") {
              $timeout(function () {
                obj.punchStr = $scope.punchStr
              }, 500)

            }
          }


          $ionicLoading.hide();
          //  if (!$scope.$$phase)
          //   $scope.$apply()				

        },
        error: function (res) {
          $ionicLoading.hide()
          console.log(res.status);

        }
      });
    }, 200)


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
  $scope.goToApprovals = function () {
    $state.go("approvalAttendanceList")
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
      if (getMyHrapiVersionNumber() >= 18) {
        if (sessionStorage.getItem('IsTravelAccessible') == 'true') {
          $scope.travelInInProcess = data.listTravel.inProcess
          $scope.travelInProcessApproval = data.approvalTravel.inProcess
        } else {

          $scope.travelInInProcess = '0';
          $scope.travelInProcessApproval = '0';
        }
        if (sessionStorage.getItem('IsClaimAccessible') == 'true') {
          $scope.travelClaimInProcess = data.listTravelClaim.inProcess
          $scope.travelClaimInProcessApproval = data.approvalTravelClaim.inProcess
        } else {
          $scope.travelClaimInProcess = '0';
          $scope.travelClaimInProcessApproval = '0';
        }
        //expense claim
        if (sessionStorage.getItem('IsExpenseClaimAccessible') == 'true') {
          $scope.ctcInProcess = data.listClaimCTC.inProcess
          $scope.ctcInProcessApproval = data.approvalClaimCTC.inProcess

          $scope.nonCtcInProcess = data.listClaimNONCTC.inProcess
          $scope.nonCtcInProcessApproval = data.approvalClaimNONCTC.inProcess

          $scope.ltaInProcess = data.listClaimLTA.inProcess
          $scope.ltaInProcessApproval = data.approvalClaimLTA.inProcess

        } else {
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


      if (getMyHrapiVersionNumber() >= 18) {
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

        $scope.totalClaimRequests = parseInt($scope.travelClaimRequests) + parseInt($scope.ctcRequests) + parseInt($scope.nonCtcRequests) + parseInt($scope.ltaRequests)
        $rootScope.totalRequistionCountForMenu = parseInt($rootScope.totalRequistionCountForMenu) + parseInt($scope.travelRequests) + parseInt($scope.totalClaimRequests)
      } else {
        $scope.travelRequests = "0"
        $scope.travelClaimRequests = "0"
        $scope.ctcRequests = "0"
        $scope.nonCtcRequests = "0"
        $scope.ltaRequests = "0"

        $scope.totalClaimRequests = "0"
      }


      if ($scope.navigateToPageWithCount == true) {

        //check if rootscope has tab value

        if ($rootScope.reqestPageLastTab != "") {

          if ($rootScope.reqestPageLastTab == "LEAVE") {
            $scope.getLeaveRequestList();
          }
          if ($rootScope.reqestPageLastTab == "OD") {
            $scope.getODApplicationList();
          }
          if ($rootScope.reqestPageLastTab == "ATTREG") {
            //$scope.attListFetched = false
            $scope.getRegularizationRequestList();
          }
          if ($rootScope.reqestPageLastTab == "SC") {
            $scope.getShiftChangeRequestList();
          }
          if ($rootScope.reqestPageLastTab == "TRAVEL") {
            $('.center').slick('slickGoTo', 4);
            $scope.getTravelRequestList();
          }
          if ($rootScope.reqestPageLastTab == "CLAIM_CTC") {
            $scope.claimTabClicked()
            //$('.center').slick('slickGoTo', 5);
            //$scope.getCClaimList();
          }
          if ($rootScope.reqestPageLastTab == "CLAIM_NONCTC") {
            $scope.claimTabClicked()
            //$('.center').slick('slickGoTo', 5);
            //$scope.getNClaimList();
          }
          if ($rootScope.reqestPageLastTab == "CLAIM_LTA") {
            $scope.claimTabClicked()
            //$('.center').slick('slickGoTo', 5);
            //$scope.getLClaimList();
          }
          if ($rootScope.reqestPageLastTab == "CLAIM_TRAVEL") {
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
        } else {
          //above fail .. it may be for access rights are counts are 0
          if ($scope.IsLeaveAccessible == 'true') {
            $scope.getLeaveRequestList();
            return
          }
          if ($scope.IsODAccessible == 'true') {
            $scope.getODApplicationList();
            return
          }
          if ($scope.IsRegularizationAccessible == 'true') {
            $scope.getRegularizationRequestList();
            return
          }
          if ($scope.IsShiftChangeAccessible == 'true') {
            $scope.getShiftChangeRequestList();
            return
          }
          if ($scope.IsTravelAccessible == 'true') {
            $scope.getTravelRequestList();
            return
          }
          if ($scope.IsClaimAccessible == 'true' || $scope.IsExpenseClaimAccessible == 'true') {
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
    $scope.getRegularizationRequestList();
    $ionicLoading.hide();
  }
  Initialize();

});