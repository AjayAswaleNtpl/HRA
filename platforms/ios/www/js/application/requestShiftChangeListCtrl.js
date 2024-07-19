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
  


mainModule.controller('requestShiftChangeListCtrl', function ($scope, $rootScope, $filter, commonService, $state, getYearListService, $ionicPopup, viewODApplicationService, sendODRequestService, getSetService, $ionicLoading, $ionicModal, cancelODRequestService, viewLeaveApplicationService, detailsService, viewMissPunchApplicationService,
    viewShiftChangeApplicationService, getTravelApplicationListService, addClaimFormService, travelClaimDataService, viewClaimFormService, viewRequisitionApprovalService, sendForCancellation){

       $rootScope.navHistoryPrevPage = "requisitionNew"
     
        $scope.IsShiftChangeAccessible = sessionStorage.getItem('IsShiftChangeAccessible');

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
        $scope.scListFetched = false

        $scope.redirectOnBack = function(){
            $state.go('app.requestMenu')
        }
        $scope.goToApprovals = function(){
          $state.go("approvalShiftChangeList")
        }
        $scope.reDirectToShiftChangePage = function () {
            $state.go('shiftChange')
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

        // $scope.goToApprovals = function () {
        //     $state.go('MyApprovalsCombined')
        //   }

          $scope.shiftChangeDetailInfo = function (shiftChangeAppliList) {
            var detailShiftChangeObject = {};
            detailShiftChangeObject.fromDate = shiftChangeAppliList.fromDate;
            detailShiftChangeObject.status = shiftChangeAppliList.status;
            detailShiftChangeObject.toDate = shiftChangeAppliList.toDate;
            detailShiftChangeObject.rosterShiftName = shiftChangeAppliList.rosterShiftName;
            detailShiftChangeObject.changedShiftName = shiftChangeAppliList.changedShiftName;
            detailShiftChangeObject.reasonToChange = shiftChangeAppliList.reasonToChange;
            detailShiftChangeObject.appRemarks = shiftChangeAppliList.appRemarks;
            if(shiftChangeAppliList.appRemarks){
              detailShiftChangeObject.appRemarks = detailShiftChangeObject.appRemarks.replace(/<br>/g, "\n")
              detailShiftChangeObject.appRemarks = detailShiftChangeObject.appRemarks.replace(/<BR>/g, "\n")
              detailShiftChangeObject.appRemarks = detailShiftChangeObject.appRemarks.replace(/&#13;/g, "\n")
              detailShiftChangeObject.appRemarks = detailShiftChangeObject.appRemarks.replace(/&#10;/g, "\n")
            }
            
            detailShiftChangeObject.lastAppRemarks = shiftChangeAppliList.lastAppRemarks;
            if(shiftChangeAppliList.lastAppRemarks){
              detailShiftChangeObject.lastAppRemarks = detailShiftChangeObject.lastAppRemarks.replace(/<br>/g, "\n")
              detailShiftChangeObject.lastAppRemarks = detailShiftChangeObject.lastAppRemarks.replace(/<BR>/g, "\n")
              detailShiftChangeObject.lastAppRemarks = detailShiftChangeObject.lastAppRemarks.replace(/&#13;/g, "\n")
              detailShiftChangeObject.lastAppRemarks = detailShiftChangeObject.lastAppRemarks.replace(/&#10;/g, "\n")
            }
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

          $scope.refreshSCList = function () {

            $scope.scListFetched = false
            $scope.getShiftChangeRequestList()
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
                      headers: {
                        'Authorization': 'Bearer ' + jwtByHRAPI
                     },
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

          function Initialize() {
	
            $ionicLoading.show();
            $scope.getRequestCounts();
            $scope.getShiftChangeRequestList();
            //$scope.getRegularizationRequestList();
            $ionicLoading.hide();
          }
          Initialize();


});