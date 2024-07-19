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
  mainModule.factory("getPhotoService", function ($resource) {
    return $resource((baseURL + '/api/eisCompany/checkProfilePhoto.spr'), {}, { 'save': { method: 'POST', 
    timeout: commonRequestTimeout,
    headers: {
      'Authorization': 'Bearer ' + jwtByHRAPI
      } } }, {});
  });
  mainModule.factory("viewLeaveApplicationService", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/leaveApplication/viewLeaveApplication.spr'), {}, {
      'save': {
        method: 'POST', timeout: 200000,
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

mainModule.controller('approvalLeaveListCtrl', function ($scope, viewClaimFormService, getPhotoService,
    $filter, getTravelApplicationReporteeListService, $ionicLoading, $ionicModal, homeService,
    getRequisitionCountService, singleApproveTravelAppService, singleRejectTravelAppService, viewTravelClaim,
    getSetService, $rootScope, commonService, $ionicPopup, $http, viewAttendaceRegularisationService,
    getRequisitionCountService, viewShiftChangeApprovalService, viewODPendingApplicationService,
    rejectPendingODService, approvePendingODService, $ionicLoading, $ionicModal, viewLeaveApplicationService,
    approvePendingClaimService, rejectPendingClaimService,
    detailsService, homeService, $timeout, $state){

      $rootScope.navHistoryPrevPage = "approvalsNew"
        $scope.navigateToPageWithCount = true
		$scope.approvePageLastTab = ""

        console.log ("HRAPI VERSION:  " + getMyHrapiVersionNumber())
  
    

          $scope.IsLeaveAccessible = sessionStorage.getItem('IsLeaveAccessible');
          if ($rootScope.myAppVersion>=20){
            $scope.showPunchDetailsFeature='true'
        }else{
            $scope.showPunchDetailsFeature='false'
        }
        if ( getMyHrapiVersionNumber() >= 30){
          $scope.utf8Enabled = 'true'    
        }else{
          $scope.utf8Enabled = 'false'    
        }
        
        //$scope.showPunchDetailsFeature='false'
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
        $scope.claimPendingCObject = {}
        $scope.claimPendingLObject = {}
        $scope.claimPendingNObject = {}
        $scope.detailResObject = {}
        $scope.attendanceObject = {}
        $scope.approveAtendanceObject = {}
        $scope.resultobj = {}
        var d = new Date();

        $scope.searchObj = ''

        $scope.redirectOnBack = function(){
            $state.go('app.approvalsMenu')
        }

        if (sessionStorage.getItem('department') && (sessionStorage.getItem('displayDeptName') == '"Department"')) {
            $scope.resultobj.department = sessionStorage.getItem('department');
          }

          $scope.getLeaveList = function () {
            homeService.updateInboxEmailList("", function () { }, function (data) { })
        
            $scope.searchObj = ''
           
         
            
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
                  $scope.leaveApplList[i].approverRemark = $scope.leaveApplList[i].approverRemark.replace(/<br>/g, "\n")
                  $scope.leaveApplList[i].approverRemark = $scope.leaveApplList[i].approverRemark.replace(/&#13;/g, "\n")
                  $scope.leaveApplList[i].approverRemark = $scope.leaveApplList[i].approverRemark.replace(/&#10;/g, "\n")
                }

                if ($scope.leaveApplList[i].afterBalance){
                  $scope.leaveApplList[i].afterBalance = parseFloat($scope.leaveApplList[i].afterBalance).toFixed(2)
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
              if (getMyHrapiVersionNumber() >= 33){
                $scope.approvResObject.leaveAppVo.afterBalance = data.leaveAppVo.afterBalance;
                $scope.approvResObject.leaveAppVo.currentBalance = data.leaveAppVo.currentBalance;
                $scope.approvResObject.leaveAppVo.empId = data.leaveAppVo.empId;
                $scope.approvResObject.leaveAppVo.leastCount = data.leaveAppVo.leastCount;
                $scope.approvResObject.leaveAppVo.leaveApproved = data.leaveAppVo.leaveApproved;
                $scope.approvResObject.leaveAppVo.leaveBalBefore = data.leaveAppVo.leaveBalBefore;
                $scope.approvResObject.leaveAppVo.leaveFromDate = data.leaveAppVo.leaveFromDate;
                $scope.approvResObject.leaveAppVo.leaveInProcess = data.leaveAppVo.leaveInProcess;
                $scope.approvResObject.leaveAppVo.leaveReason = data.leaveAppVo.leaveReason;
                $scope.approvResObject.leaveAppVo.leaveStatus = data.leaveAppVo.leaveStatus;
                $scope.approvResObject.leaveAppVo.leaveToDate = data.leaveAppVo.leaveToDate;
                $scope.approvResObject.leaveAppVo.leaveTransId = data.leaveAppVo.leaveTransId;
                $scope.approvResObject.leaveAppVo.name = data.leaveAppVo.name;
                $scope.approvResObject.leaveAppVo.phone = data.leaveAppVo.phone;
                $scope.approvResObject.leaveAppVo.fromLeaveType = data.leaveAppVo.fromLeaveType;
                $scope.approvResObject.leaveAppVo.leaveTypeId = data.leaveAppVo.leaveTypeId;
                $scope.approvResObject.leaveAppVo.mailType = "";
                $scope.approvResObject.leaveAppVo.noDaysCounted = data.leaveAppVo.noDaysCounted;
                $scope.approvResObject.leaveAppVo.noOfDays = data.leaveAppVo.noOfDays;
                $scope.approvResObject.leaveAppVo.toLeaveType = data.leaveAppVo.toLeaveType;
              }
              else{
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
            }
              
              if ($scope.utf8Enabled == 'true'){
                if (remarks){
                  $scope.approvResObject.remarks  = encodeURI(remarks)
                }else{
                  $scope.approvResObject.remarks = remarks;  
                }
              }else{
                $scope.approvResObject.remarks = remarks;
              }

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
                  'Authorization': 'Bearer ' + jwtByHRAPI,
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              }).
                success(function (data) {
                  getMenuInfoOnLoad(function () {
                  });
        
                  if (data.msg == "" || data.msg.substring(0, 5) == "ERROR") {
                    showAlert("Something went wrong. Please try again.");
                  } else {
                    showAlert("Leave Application",data.msg);
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
              if (getMyHrapiVersionNumber() >= 33){
                $scope.rejectResObject.leaveAppVo.afterBalance = data.leaveAppVo.afterBalance;
                $scope.rejectResObject.leaveAppVo.currentBalance = data.leaveAppVo.currentBalance;
                $scope.rejectResObject.leaveAppVo.empId = data.leaveAppVo.empId;
                $scope.rejectResObject.leaveAppVo.leastCount = data.leaveAppVo.leastCount;
                $scope.rejectResObject.leaveAppVo.leaveApproved = data.leaveAppVo.leaveApproved;
                $scope.rejectResObject.leaveAppVo.leaveBalBefore = data.leaveAppVo.leaveBalBefore;
                $scope.rejectResObject.leaveAppVo.leaveFromDate = data.leaveAppVo.leaveFromDate;
                $scope.rejectResObject.leaveAppVo.leaveInProcess = data.leaveAppVo.leaveInProcess;
                $scope.rejectResObject.leaveAppVo.leaveReason = data.leaveAppVo.leaveReason;
                $scope.rejectResObject.leaveAppVo.leaveStatus = data.leaveAppVo.leaveStatus;
                $scope.rejectResObject.leaveAppVo.leaveToDate = data.leaveAppVo.leaveToDate;
                $scope.rejectResObject.leaveAppVo.leaveTransId = data.leaveAppVo.leaveTransId;
                $scope.rejectResObject.leaveAppVo.name = data.leaveAppVo.name;
                $scope.rejectResObject.leaveAppVo.phone = data.leaveAppVo.phone;
                $scope.rejectResObject.leaveAppVo.fromLeaveType = data.leaveAppVo.fromLeaveType;
                $scope.rejectResObject.leaveAppVo.leaveTypeId = data.leaveAppVo.leaveTypeId;
                $scope.rejectResObject.leaveAppVo.mailType = "";
                $scope.rejectResObject.leaveAppVo.noDaysCounted = data.leaveAppVo.noDaysCounted;
                $scope.rejectResObject.leaveAppVo.noOfDays = data.leaveAppVo.noOfDays;
                $scope.rejectResObject.leaveAppVo.toLeaveType = data.leaveAppVo.toLeaveType;
              }
              else{
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
              }
              if ($scope.utf8Enabled == 'true' ){
                if (onreject){
                  $scope.rejectResObject.remarks  = encodeURI(onreject)
                }else{
                  $scope.rejectResObject.remarks = onreject;  
                }
              }else{
                $scope.rejectResObject.remarks = onreject;
              }

              
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
                  'Authorization': 'Bearer ' + jwtByHRAPI,
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              }).
                success(function (data) {
                  getMenuInfoOnLoad(function () {
                  });
                  showAlert("Leave Application", "Application rejected successfully");
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
              if (getMyHrapiVersionNumber() >= 33){  
                  if (data.leaveAppVo.fileNm) {
                    $scope.fileName = data.leaveAppVo.fileNm
                  }
                  $scope.resultObject.empId = data.leaveAppVo.empId
                  $scope.leaveType = leaveObj.leaveType;
                  $scope.leaveApplyDetail = data.leaveAppVo;
                  $scope.leaveReason = data.leaveAppVo.leaveReason;
                  $scope.status = leaveObj.leaveStatus;
                  $scope.title = data.leaveAppVo;
                  $scope.name = data.leaveAppVo.name;
                  $scope.leaveFromDate = data.leaveAppVo.leaveFromDate.split('/')
                  $scope.leaveFromDate = new Date($scope.leaveFromDate[2] + '/' + $scope.leaveFromDate[1] + '/' + $scope.leaveFromDate[0])
                  $scope.leaveToDate = data.leaveAppVo.leaveToDate.split('/')
                  $scope.leaveToDate = new Date($scope.leaveToDate[2] + '/' + $scope.leaveToDate[1] + '/' + $scope.leaveToDate[0])
                  if ($scope.leaveFromDate.getTime() == $scope.leaveToDate.getTime()) {
                    $scope.leaveDate = $scope.leaveFromDate;
                  }
                  else {
                    $scope.leaveDate = null;
                  }
                  $scope.phoneNo = data.leaveAppVo.phone != "null" ? data.leaveAppVo.phone : "";
                  $scope.toLeaveType = data.leaveAppVo.toLeaveType;
                  $scope.fromLeaveType = data.leaveAppVo.fromLeaveType;
                  $scope.noOfDaysCounted = data.leaveAppVo.noDaysCounted;
                  $scope.noOfHours = parseInt(data.leaveAppVo.toLvHr) - parseInt(data.leaveAppVo.fromLvHr);
                  $scope.fromLeaveType = $scope.fromLeaveType.charAt(0).toUpperCase() + $scope.fromLeaveType.slice(1)
                  $scope.fromLeaveType = $scope.fromLeaveType.replace(/([a-z](?=[A-Z]))/g, '$1 ')
            }else{
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
            }
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
                  if ($scope.data.onApprove === undefined){
                    $scope.data.onApprove = ""
                  }
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
                  if ($scope.data.onreject === undefined){
                    $scope.data.onreject = ""
                  }
                  $scope.rejectLeave(status, leaveTransId, leaveFromDate, leaveToDate, $scope.data.onreject,leaveObj)
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
              if (getMyHrapiVersionNumber() >= 33){
                $scope.approvCancelLeaveObject.leaveAppVo.afterBalance = data.leaveAppVo.afterBalance;
                $scope.approvCancelLeaveObject.leaveAppVo.currentBalance = data.leaveAppVo.currentBalance;
                $scope.approvCancelLeaveObject.leaveAppVo.empId = data.leaveAppVo.empId;
                $scope.approvCancelLeaveObject.leaveAppVo.leastCount = data.leaveAppVo.leastCount;
                $scope.approvCancelLeaveObject.leaveAppVo.leaveApproved = data.leaveAppVo.leaveApproved;
                $scope.approvCancelLeaveObject.leaveAppVo.leaveBalBefore = data.leaveAppVo.leaveBalBefore;
                $scope.approvCancelLeaveObject.leaveAppVo.leaveFromDate = data.leaveAppVo.leaveFromDate;
                $scope.approvCancelLeaveObject.leaveAppVo.leaveToDate = data.leaveAppVo.leaveToDate;
                $scope.approvCancelLeaveObject.leaveAppVo.leaveInProcess = data.leaveAppVo.leaveInProcess;
                $scope.approvCancelLeaveObject.leaveAppVo.leaveReason = data.leaveAppVo.leaveReason;
                $scope.approvCancelLeaveObject.leaveAppVo.leaveTransId = data.leaveAppVo.leaveTransId;
                $scope.approvCancelLeaveObject.leaveAppVo.name = data.leaveAppVo.name;
                $scope.approvCancelLeaveObject.leaveAppVo.phone = data.leaveAppVo.phone;
                $scope.approvCancelLeaveObject.leaveAppVo.fromLeaveType = data.leaveAppVo.fromLeaveType;
                $scope.approvCancelLeaveObject.leaveAppVo.leaveTypeId = data.leaveAppVo.leaveTypeId;
                $scope.approvCancelLeaveObject.leaveAppVo.mailType = "APPROVER";
                $scope.approvCancelLeaveObject.leaveAppVo.noDaysCounted = data.leaveAppVo.noDaysCounted;
                $scope.approvCancelLeaveObject.leaveAppVo.noOfDays = data.leaveAppVo.noOfDays;
                $scope.approvCancelLeaveObject.leaveAppVo.toLeaveType = data.leaveAppVo.toLeaveType;
                $scope.approvCancelLeaveObject.leaveAppVo.remarks = remarks;
                $scope.approvCancelLeaveObject.leaveAppVo.leaveLeastCountMsg = "";
                $scope.approvCancelLeaveObject.leaveAppVo.trackerId = data.leaveAppVo.trackerId;
                $scope.approvCancelLeaveObject.leaveAppVo.fromLvHr = data.leaveAppVo.fromLvHr;
                $scope.approvCancelLeaveObject.leaveAppVo.toLvHr = data.leaveAppVo.toLvHr;
                $scope.approvCancelLeaveObject.leaveAppVo.RaisedBy = data.leaveAppVo.RaisedBy;
                $scope.approvCancelLeaveObject.leaveAppVo.fromEmail = data.leaveAppVo.fromEmail;
                $scope.approvCancelLeaveObject.leaveAppVo.address = data.leaveAppVo.address;
                $scope.approvCancelLeaveObject.leaveAppVo.email = data.leaveAppVo.email;
                $scope.approvCancelLeaveObject.leaveAppVo.requiesitionDate = data.leaveAppVo.requiesitionDate;
                
              }else{
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
                }
        
                if ($scope.utf8Enabled == 'true'){
                  if (remarks){
                    $scope.approvCancelLeaveObject.remarks  = encodeURI(remarks)
                  }else{
                    $scope.approvCancelLeaveObject.remarks = remarks;  
                  }
                }else{
                  $scope.approvCancelLeaveObject.remarks = remarks;
                }

              $http({
                url: (baseURL + '/api/leaveApplication/approveLeaveCan.spr'),
                method: 'POST',
                timeout: commonRequestTimeout,
                transformRequest: jsonTransformRequest,
                data: $scope.approvCancelLeaveObject,
                headers: {
                  'Authorization': 'Bearer ' + jwtByHRAPI,
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
              if (getMyHrapiVersionNumber() >= 33){
                $scope.rejectResObject.leaveAppVo.afterBalance = data.leaveAppVo.afterBalance;
                $scope.rejectResObject.leaveAppVo.currentBalance = data.leaveAppVo.currentBalance;
                $scope.rejectResObject.leaveAppVo.empId = data.leaveAppVo.empId;
                $scope.rejectResObject.leaveAppVo.leastCount = data.leaveAppVo.leastCount;
                $scope.rejectResObject.leaveAppVo.leaveApproved = data.leaveAppVo.leaveApproved;
                $scope.rejectResObject.leaveAppVo.leaveBalBefore = data.leaveAppVo.leaveBalBefore;
                $scope.rejectResObject.leaveAppVo.leaveFromDate = data.leaveAppVo.leaveFromDate;
                $scope.rejectResObject.leaveAppVo.leaveToDate = data.leaveAppVo.leaveToDate;
                $scope.rejectResObject.leaveAppVo.leaveInProcess = data.leaveAppVo.leaveInProcess;
                $scope.rejectResObject.leaveAppVo.leaveReason = data.leaveAppVo.leaveReason;
                $scope.rejectResObject.leaveAppVo.leaveTransId = data.leaveAppVo.leaveTransId;
                $scope.rejectResObject.leaveAppVo.name = data.leaveAppVo.name;
                $scope.rejectResObject.leaveAppVo.phone = data.leaveAppVo.phone;
                $scope.rejectResObject.leaveAppVo.fromLeaveType = data.leaveAppVo.fromLeaveType;
                $scope.rejectResObject.leaveAppVo.leaveTypeId = data.leaveAppVo.leaveTypeId;
                $scope.rejectResObject.leaveAppVo.mailType = "APPROVER";
                $scope.rejectResObject.leaveAppVo.noDaysCounted = data.leaveAppVo.noDaysCounted;
                $scope.rejectResObject.leaveAppVo.noOfDays = data.leaveAppVo.noOfDays;
                $scope.rejectResObject.leaveAppVo.toLeaveType = data.leaveAppVo.toLeaveType;
                $scope.rejectResObject.leaveAppVo.remarks = onreject;
                $scope.rejectResObject.leaveAppVo.leaveLeastCountMsg = "";
                $scope.rejectResObject.leaveAppVo.trackerId = data.leaveAppVo.trackerId;
                $scope.rejectResObject.leaveAppVo.fromLvHr = data.leaveAppVo.fromLvHr;
                $scope.rejectResObject.leaveAppVo.toLvHr = data.leaveAppVo.toLvHr;
                $scope.rejectResObject.leaveAppVo.RaisedBy = data.leaveAppVo.RaisedBy;
                $scope.rejectResObject.leaveAppVo.fromEmail = data.leaveAppVo.fromEmail;
                $scope.rejectResObject.leaveAppVo.address = data.leaveAppVo.address;
                $scope.rejectResObject.leaveAppVo.email = data.leaveAppVo.email;
                $scope.rejectResObject.leaveAppVo.requiesitionDate = data.leaveAppVo.requiesitionDate;
              }else{
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
              }
              
              if ($scope.utf8Enabled == 'true' ){
                if (onreject){
                  $scope.rejectResObject.remarks  = encodeURI(onreject)
                  $scope.rejectResObject.leaveAppVo.remarks = encodeURI(onreject);
                }else{
                  $scope.rejectResObject.remarks = onreject;  
                  $scope.rejectResObject.leaveAppVo.remarks = onreject;
                }
              }else{
                $scope.rejectResObject.remarks = onreject;
                $scope.rejectResObject.leaveAppVo.remarks = onreject;
              }

              $http({
                url: (baseURL + '/api/leaveApplication/rejectLeavecancel.spr'),
                method: 'POST',
                timeout: commonRequestTimeout,
                transformRequest: jsonTransformRequest,
                data: $scope.rejectResObject,
                headers: {
                  'Authorization': 'Bearer ' + jwtByHRAPI,
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
          $scope.goToRequisitions = function () {
            //alert("RequestListCombined");
            $state.go('RequestListCombined');
        
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
    
          function Initialize() {
            $rootScope.travel = 0;
            $rootScope.claim = 0;
            
            
            getMenuInfoOnLoad(function () {
                      });
        
            if ($scope.navigateToPageWithCount == true) {
              $scope.navigateToPageWithCount = false
              //check if rootscope has tab value
                  if ($rootScope.approvePageLastTab != ""){
                      // if ($rootScope.approvePageLastTab == "LEAVE"){
                          // $scope.getLeaveList();
                      // }
                      
                      //return
                  }
                  
        
              if ($scope.IsLeaveAccessible == 'true' &&
                $rootScope.leave == "0" && $rootScope.attendance == "0" && $rootScope.shift == "0" && $rootScope.od == "0" && $rootScope.travel == "0" && $rootScope.claim == "0") {
                $scope.getLeaveList();
              }
              else if ($scope.IsLeaveAccessible == 'true' && $rootScope.leave > 0) {
                $scope.getLeaveList();
              }
              
              else{
                  //above fail because of access rights or counts 0
                  //above fail .. it may be for access rights are counts are 0
                    if ($scope.IsLeaveAccessible == 'true'){
                        $scope.getLeaveList();
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
        $scope.downloadAttachmnent = function (travel) {

          var strData = travel.uploadFile
          //var strUrlPrefix='data:"application/pdf;base64,'
          var strUrlPrefix = 'data:' + travel.uploadContentType + ";base64,"
          var url = strUrlPrefix + strData
          var blob = base64toBlob(strData, travel.uploadContentType)
          downloadFileFromData(travel.uploadFileName, blob, travel.uploadContentType)
          event.stopPropagation();
        }
        $scope.goToRequisitions = function(){
          $state.go("requestLeaveList")
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
					processData: false, // NEEDED, DON'T OMIT THIS,
          headers: {
            'Authorization': 'Bearer ' + jwtByHRAPI
            },
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

        $timeout(function () {  Initialize() }, 500)
        

    });