

mainModule.factory("getRequisitionCountService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/eisCompany/viewRequestCount.spr'), {}, {
    'save': {
      method: 'POST',
      timeout: commonRequestTimeout, headers: {
        'Authorization': 'Bearer ' + jwtByHRAPI
    }
    }
  }, {});
}]);
mainModule.factory("getPhotoService", function ($resource) {
  return $resource((baseURL + '/api/eisCompany/checkProfilePhoto.spr'), {}, { 'save': { method: 'POST', 
  timeout: commonRequestTimeout, headers: {
    'Authorization': 'Bearer ' + jwtByHRAPI
} } }, {});
});
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
mainModule.controller('approvalAttendanceListCtrl', function ($scope, viewClaimFormService, getPhotoService,
  $filter, getTravelApplicationReporteeListService, $ionicLoading, $ionicModal, homeService,
  getRequisitionCountService, singleApproveTravelAppService, singleRejectTravelAppService, viewTravelClaim,
  getSetService, $rootScope, commonService, $ionicPopup, $http, viewAttendaceRegularisationService,
  getRequisitionCountService, viewShiftChangeApprovalService, viewODPendingApplicationService,
  rejectPendingODService, approvePendingODService, $ionicLoading, $ionicModal, viewLeaveApplicationService,
  approvePendingClaimService, rejectPendingClaimService,
  detailsService, homeService, $timeout, $state) {

  $scope.navigateToPageWithCount = true
  $scope.approvePageLastTab = ""

  $scope.IsRegularizationAccessible = sessionStorage.getItem('IsRegularizationAccessible');
  if ($rootScope.myAppVersion >= 20) {
    $scope.showPunchDetailsFeature = 'true'
  } else {
    $scope.showPunchDetailsFeature = 'false'
  }

  if (getMyHrapiVersionNumber() >= 30) {
    $scope.utf8Enabled = 'true'
  } else {
    $scope.utf8Enabled = 'false'
  }


  $scope.isARTorFRT = sessionStorage.getItem('IsARTorFRT');
  $scope.isGroupMasterReportee = sessionStorage.getItem('isGroupMasterReportee');
  $rootScope.navHistoryPrevPage = "approvalsNew"
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

  $scope.attendanceObject = {}
  $scope.approveAtendanceObject = {}
  $scope.resultobj = {}
  var d = new Date();

  if (sessionStorage.getItem('department') && (sessionStorage.getItem('displayDeptName') == '"Department"')) {
    $scope.resultobj.department = sessionStorage.getItem('department');
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
  $scope.goToRequisitions = function () {
    $state.go("requestRegularizationList")
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


    $scope.searchObj = ''



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



    $scope.searchObj = ''


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


        $scope.AttendanceApplList[i].outTimeDateStrSort = $scope.outTimeDate[2] + $scope.outTimeDate[1] + $scope.outTimeDate[0]

        var t = new Date($scope.AttendanceApplList[i].createDate); 
        $scope.AttendanceApplList[i].applicationDate = t;
        if ($scope.AttendanceApplList[i].attDate){
          $scope.AttendanceApplList[i].attDate = $scope.AttendanceApplList[i].attDate.substring(0, 10)
        }
        //console.log("SORTED DATE " + $scope.AttendanceApplList[i].outTimeDateStrSort)            
        if ($scope.AttendanceApplList[i].lastAppRemarks) {
          $scope.AttendanceApplList[i].lastAppRemarks = $scope.AttendanceApplList[i].lastAppRemarks.replace(/<br>/g, "\n")
          $scope.AttendanceApplList[i].lastAppRemarks = $scope.AttendanceApplList[i].lastAppRemarks.replace(/<BR>/g, "\n")
          $scope.AttendanceApplList[i].lastAppRemarks = $scope.AttendanceApplList[i].lastAppRemarks.replace(/&#13;/g, "\n")
          $scope.AttendanceApplList[i].lastAppRemarks = $scope.AttendanceApplList[i].lastAppRemarks.replace(/&#10;/g, "\n")
        }

        if ($scope.AttendanceApplList[i].appRemarks) {
          $scope.AttendanceApplList[i].appRemarks = $scope.AttendanceApplList[i].appRemarks.replace(/&#13;/g, "\n")
          $scope.AttendanceApplList[i].appRemarks = $scope.AttendanceApplList[i].appRemarks.replace(/&#10;/g, "\n")
          $scope.AttendanceApplList[i].appRemarks = $scope.AttendanceApplList[i].appRemarks.replace(/<br>/g, "\n")
          $scope.AttendanceApplList[i].appRemarks = $scope.AttendanceApplList[i].appRemarks.replace(/<BR>/g, "\n")
        }
        // document.getElementById("appRemarks__"+i).innerHTML = $scope.AttendanceApplList[i].appRemarks
        // get punches
        // if (!$scope.$$phase)
        // $scope.$apply()

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
              if ($scope.utf8Enabled == 'true' && $scope.attendPendingObject){
                if ($scope.attendPendingObject.remark){
                  $scope.attendPendingObject.remark  = encodeURI($scope.attendPendingObject.remark)
                }
              }
  
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
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer ' + jwtByHRAPI
              }
           
          }).
            success(function (data) {
              getMenuInfoOnLoad(function () {
              });
              showAlert("Attendance Application", "Attendance approved successfully");

              $ionicLoading.show()
              $scope.attListFetched = false
              $scope.getAttendanceApplicationList();

              //$ionicLoading.hide()
              //Attendance.lastAppRemarks = Attendance.lastAppRemarks + $scope.attendPendingObject.remark
              /*if (Attendance.status == "SENT FOR APPROVAL"){
                Attendance.status = "APPROVED"
              }else{
                  Attendance.status = "CANCELLATION APPROVED"
              }
              if (!$scope.$$phase)
              $scope.$apply()				
              */
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
              if ($scope.utf8Enabled == 'true' && $scope.data){
                if ($scope.data.attendReject){
                  $scope.data.attendReject  = encodeURI($scope.data.attendReject)
                }
              }
              
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
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer ' + jwtByHRAPI
              }
          }).
            success(function (data) {
              getMenuInfoOnLoad(function () {
              });
              showAlert("Attendance Application", "Attendance rejected successfully");
              $ionicLoading.show()
              $scope.attListFetched = false
              $scope.getAttendanceApplicationList();

              //$ionicLoading.hide()
              /*Attendance.lastAppRemarks = Attendance.lastAppRemarks + $scope.approveAtendanceObject.remark
             
              if (Attendance.status == "SENT FOR APPROVAL"){
                Attendance.status = "REJECTED"
              }else{
                  Attendance.status = "CANCELLATION REJECTED"
              }
              if (!$scope.$$phase)
              $scope.$apply()				*/
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
    //$scope.modal.remove();
  });
  $scope.$on('modal.hidden', function () {
  });
  $scope.$on('modal.removed', function () {
  });

  $scope.refreshAttList = function () {
    $scope.attListFetched = false
    $scope.getAttendanceApplicationList()
  }

  // $scope.goToRequisitions = function () {
  //   //alert("RequestListCombined");
  //   $state.go('RequestListCombined');

  // }

  function Initialize() {
    $rootScope.travel = 0;
    $rootScope.claim = 0;


    getMenuInfoOnLoad(function () {
    });

    if ($scope.navigateToPageWithCount == true) {
      $scope.navigateToPageWithCount = false
      //check if rootscope has tab value




      if ($scope.IsRegularizationAccessible == 'true' && $rootScope.attendance > 0) {
        $scope.getAttendanceApplicationList();
      }

      else {
        //above fail because of access rights or counts 0
        //above fail .. it may be for access rights are counts are 0

        if ($scope.IsRegularizationAccessible == 'true') {
          $scope.getAttendanceApplicationList();
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

      }

    }
      //success();
      , function (data) {
        $ionicLoading.hide()
        commonService.getErrorMessage(data);
      });
  }

  $scope.getPunches = function (fromDate, toDate, empId, obj, module) {
    $ionicLoading.show();
    $timeout(function () {
      var tmfd = new FormData();
      tmfd.append('fromDate', fromDate)
      tmfd.append('empId', empId)
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

          result1.htmlPunchesStr = result1.htmlPunchesStr.replace("<br>", "")
          $scope.punchStr = result1.htmlPunchesStr.replace(/<br>/g, "\n")
          if (module == "ATTREG") {
            //$scope.AttendanceApplList[idx].punchStr = $scope.punchStr
            obj.punchStr = $scope.punchStr
          }
          if (module == "OD") {
            $scope.ODPendingApplList[idx].punchStr = $scope.punchStr
          }

          if (!$scope.$$phase)
            $scope.$apply()


          $ionicLoading.hide();

        },
        error: function (res) {
          $ionicLoading.show();
          console.log(res.status);

        }
      });

    }, 200)


  }
  $scope.redirectOnBack = function () {
    $state.go('app.approvalsMenu')
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
  $timeout(function () { Initialize() }, 500)

});