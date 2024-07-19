


mainModule.factory("getPhotoService", function ($resource) {
  return $resource((baseURL + '/api/eisCompany/checkProfilePhoto.spr'), {}, { 'save': { method: 'POST',
   timeout: commonRequestTimeout,
   headers: {
    'Authorization': 'Bearer ' + jwtByHRAPI
    } } }, {});
});
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
mainModule.controller('approvalODListCtrl', function ($scope, viewClaimFormService, getPhotoService,
  $filter, getTravelApplicationReporteeListService, $ionicLoading, $ionicModal, homeService,
  getRequisitionCountService, singleApproveTravelAppService, singleRejectTravelAppService, viewTravelClaim,
  getSetService, $rootScope, commonService, $ionicPopup, $http, viewAttendaceRegularisationService,
  getRequisitionCountService, viewShiftChangeApprovalService, viewODPendingApplicationService,
  rejectPendingODService, approvePendingODService, $ionicLoading, $ionicModal, viewLeaveApplicationService,
  approvePendingClaimService, rejectPendingClaimService,
  detailsService, homeService, $timeout, $state) {
  $rootScope.navHistoryPrevPage = "approvalsNew"
  $scope.navigateToPageWithCount = true
  $scope.approvePageLastTab = ""
  $scope.IsODAccessible = sessionStorage.getItem('IsODAccessible');

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
  $scope.ODPendingObject = {}
  $scope.detailResObject = {}

  $scope.resultobj = {}
  var d = new Date();

  $scope.searchObj = ''
  $scope.redirectOnBack = function () {
    $state.go('app.approvalsMenu')
  }

  if (sessionStorage.getItem('department') && (sessionStorage.getItem('displayDeptName') == '"Department"')) {
    $scope.resultobj.department = sessionStorage.getItem('department');
  }
  $scope.leaveListFetched = false
  $scope.odListFetched = false

  if (getMyHrapiVersionNumber() >= 30) {
    $scope.utf8Enabled = 'true'
  } else {
    $scope.utf8Enabled = 'false'
  }

  $scope.getODApplicationList = function () {

    homeService.updateInboxEmailList("", function () { }, function (data) { })


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


        $scope.ODPendingApplList[i].appRemarks = $scope.ODPendingApplList[i].appRemarks.replace(/&#13;/g, "\n")
        $scope.ODPendingApplList[i].appRemarks = $scope.ODPendingApplList[i].appRemarks.replace(/&#10;/g, "\n")
        $scope.ODPendingApplList[i].appRemarks = $scope.ODPendingApplList[i].appRemarks.replace(/<br>/g, "\n")
        $scope.ODPendingApplList[i].appRemarks = $scope.ODPendingApplList[i].appRemarks.replace(/<BR>/g, "\n")

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
  $scope.goToRequisitions = function () {
    $state.go("requestODList")
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
              if ($scope.utf8Enabled == 'true'&& $scope.ODPendingObject) {
                if($scope.ODPendingObject.remark)
                $scope.ODPendingObject.remark = encodeURI($scope.ODPendingObject.remark)
              }

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
            $scope.odListFetched = false
            $scope.getODApplicationList();
            /*
             if ($scope.ODPendingObject.remark){
                 odPending.appRemarks = $scope.ODPendingObject.remark + odPending.appRemarks 
             }
             if (odPending.status == "SENT FOR APPROVAL" ){
                 odPending.status = "APPROVED"
             }else{
                 odPending.status = "CANCELLATION APPROVED"
             }
               if (!$scope.$$phase)
                $scope.$apply()				

             $ionicLoading.hide()
             */
            if (!$scope.$$phase)
              $scope.$apply()
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
              if ($scope.utf8Enabled == 'true' && $scope.ODPendingObject) {
                if ($scope.ODPendingObject.remark){
                  $scope.ODPendingObject.remark = encodeURI($scope.ODPendingObject.remark)
                }
              }
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
            $scope.odListFetched = false
            $scope.getODApplicationList();
            if ($scope.ODPendingObject.remark) {
              odPending.appRemarks = $scope.ODPendingObject.remark + odPending.appRemarks
            }
            if (odPending.status == "SENT FOR APPROVAL") {
              odPending.status = "REJECTED"
            } else {
              odPending.status = "CANCELLATION REJECTED"
            }

            getMenuInfoOnLoad(function () {
            });
            if (!$scope.$$phase)
              $scope.$apply()
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

  $scope.refreshODList = function () {
    $scope.odListFetched = false
    $scope.getODApplicationList()

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




      if ($scope.IsODAccessible == 'true' && $rootScope.od > 0) {
        $scope.getODApplicationList();
      }

      else {
        //above fail because of access rights or counts 0
        //above fail .. it may be for access rights are counts are 0
        if ($scope.IsODAccessible == 'true') {
          $scope.getODApplicationList();
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
              //$ionicLoading.hide()
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

  $scope.getPunches = function (fromDate, toDate, empId, idx, obj, module) {
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
            obj.punchStr = $scope.punchStr
          }
          if (module == "OD") {
            $timeout(function () {
              obj.punchStr = $scope.punchStr
            }, 500)

          }

          //  if (!$scope.$$phase)
          //   $scope.$apply()				
          $ionicLoading.hide()
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
  $timeout(function () { Initialize() }, 500)



});