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
    return $resource((baseURL + '/api/eisCompany/checkProfilePhoto.spr'), {}, { 'save': { method: 'POST',
     timeout: commonRequestTimeout,
     headers: {
      'Authorization': 'Bearer ' + jwtByHRAPI
      }
     } }, {});
  });
  mainModule.controller('approvalShiftChangeListCtrl', function ($scope, viewClaimFormService, getPhotoService,
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
        $scope.IsShiftChangeAccessible = sessionStorage.getItem('IsShiftChangeAccessible');
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
        $scope.isARTorFRT = sessionStorage.getItem('IsARTorFRT');
        $scope.isGroupMasterReportee = sessionStorage.getItem('isGroupMasterReportee');

        $scope.redirectOnBack = function(){
            $state.go('app.approvalsMenu')
        }
        $scope.goToRequisitions = function(){
          $state.go("requestShiftChangeList")
      }
        
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
        $scope.detailResObject = {}
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

            $scope.searchObj = ''
          
        
        
        
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

            if ($scope.utf8Enabled == 'true' && $scope.temp){
              if ($scope.temp.appRemarks){
                $scope.temp.appRemarks  = encodeURI($scope.temp.appRemarks)
              }
            }

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
                'Authorization': 'Bearer ' + jwtByHRAPI,
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).success(function (data) {
              //$ionicLoading.hide()
              showAlert("Successfully approved")
              getMenuInfoOnLoad(function () {
              });
              $scope.scListFetched = false
              $scope.getShiftChangeApplicationList()
              //$ionicLoading.hide()
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

            if ($scope.utf8Enabled == 'true' && $scope.temp){
              if ($scope.temp.appRemarks){
                $scope.temp.appRemarks  = encodeURI($scope.temp.appRemarks)
              }
            }

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
                'Authorization': 'Bearer ' + jwtByHRAPI,
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).
              success(function (data) {
                getMenuInfoOnLoad(function () {
                });
                showAlert("Application rejected")
                $scope.scListFetched = false
                $scope.getShiftChangeApplicationList()
                //$ionicLoading.hide()
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
          $scope.refreshSCList = function () {
            $scope.scListFetched = false
            $scope.getShiftChangeApplicationList()
        
          }

          function Initialize() {
            $rootScope.travel = 0;
            $rootScope.claim = 0;
            
            
            getMenuInfoOnLoad(function () {
                      });
        
            if ($scope.navigateToPageWithCount == true) {
              $scope.navigateToPageWithCount = false
              //check if rootscope has tab value
                
        
              
              if ($scope.IsShiftChangeAccessible == 'true' && $rootScope.shift > 0) {
                $scope.getShiftChangeApplicationList();
              }
              
              
              else{
                  //above fail because of access rights or counts 0
                  //above fail .. it may be for access rights are counts are 0
                   
                    if ($scope.IsShiftChangeAccessible == 'true'){
                        $scope.getShiftChangeApplicationList();
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