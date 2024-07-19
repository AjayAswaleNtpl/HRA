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

  mainModule.factory("viewTravelApplicationListService", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/travelApplication/viewTravelApplication.spr'), {}, {
      'save': {
        method: 'POST',
        timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
      }
    }, {});
  }]);

mainModule.controller('requestTravelApplicationIDCtrl', function ($scope, $rootScope, $filter, commonService, $state, getYearListService, $ionicPopup, viewODApplicationService, sendODRequestService,
   getSetService, $ionicLoading, $timeout, getTravelApplicationListService, addClaimFormService, travelClaimDataService, viewClaimFormService, viewRequisitionApprovalService, sendForCancellation,viewTravelApplicationListService){
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

        $scope.travelListFetched = false;
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


          $scope.getTravelRequestList = function () {
            $scope.requesObject = {}
            $scope.searchObj = '';
            
            $rootScope.reqestPageLastTab = "TRAVEL"
        
            if ($scope.travelListFetched == true) {
              $ionicLoading.hide()
              return;
            }
            $scope.travelListFetched = true;
            var travelMenuInfo = getMenuInformation("Travel Management", "Travel Application");
            //$scope.requesObject.menuId = travelMenuInfo.menuId;
            $scope.requesObject.menuId = '2607'
            $scope.requesObject.buttonRights = "Y-Y-Y-Y"
            $scope.requesObject.formName = "Travel"
            $scope.requesObject.SelfRequestListFlag = 1;
            $ionicLoading.show({});
        
        
            $scope.getTravelApplicationListService = new viewTravelApplicationListService();
            $scope.getTravelApplicationListService.$save($scope.requesObject, function (data) {
              if (!(data.clientResponseMsg == "OK")) {
                console.log(data.clientResponseMsg)
                $ionicLoading.hide()
                handleClientResponse(data.clientResponseMsg, "getTravelApplicationListService")
              }
              
              $scope.travelApplList = []
              /*
              if (data.selfTravelList == undefined) {
                $ionicLoading.hide();
              } else if (data.selfTravelList.length == 0) {
                $ionicLoading.hide();
              } else {
                $scope.travelApplList = data.selfTravelList
                $scope.createDate = data.selfTravelList[0].reqDate;
              }
             */

             //below change as data from SP 
              if (data.selfTravelApplicationList == undefined) {
                $ionicLoading.hide();
              } else if (data.selfTravelApplicationList.length == 0) {
                $ionicLoading.hide();
              } else {
                $scope.travelApplList = data.selfTravelApplicationList
                $scope.createDate = data.selfTravelApplicationList[0].reqDate;
              }
            
              
              
              for (var i = 0; i < $scope.travelApplList.length; i++) {
                if ($scope.travelApplList[i].travelDate.length == 10) {
                  $scope.travelFromFormatedDate = $scope.travelApplList[i].travelDate.split('/')
                  $scope.travelApplList[i].travelDate = new Date($scope.travelFromFormatedDate[2] + '/' + $scope.travelFromFormatedDate[1] + '/' + $scope.travelFromFormatedDate[0])
                  $scope.travelApplList[i].sortTravelDate = $scope.travelFromFormatedDate[2] + '/' + $scope.travelFromFormatedDate[1] + '/' + $scope.travelFromFormatedDate[0]
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
                    $scope.travelApplList[i].approvalRemarks = $scope.travelApplList[i].approvalRemarks.replace(/&#13;/g, "\n")
                    $scope.travelApplList[i].approvalRemarks = $scope.travelApplList[i].approvalRemarks.replace(/&#10;/g, "\n")
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

          $scope.goToApprovals = function () {
            $state.go('MyApprovalsCombined')
          }
          $scope.goToApprovals = function(){
            $state.go("approvalTravelList")
          }
          $scope.refreshTraList = function () {

            $scope.travelListFetched = false;
            $ionicLoading.show()
            $timeout(function () {
              
              $scope.getTravelRequestList();
            },200)
            
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
                $ionicLoading.hide()
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
                          //$('.center').slick('slickGoTo', 4);
                          $ionicLoading.show()
                          $timeout(function () {
                            
                            $scope.getTravelRequestList();
                          },200)
                          
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
                      //alert("this hde")
                      //$ionicLoading.hide()
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
                  //$('.center').slick('slickGoTo', 4);
                  $ionicLoading.show()
                  $timeout(function () {
                    
                    $scope.getTravelRequestList();
                  },200)
                  
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
                      $ionicLoading.show()
                      $timeout(function () {
                        
                        $scope.getTravelRequestList();
                      },200)
                        
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
            $ionicLoading.show()
            $timeout(function () {
              
              $scope.getTravelRequestList();
            },200)
          
            //$scope.getShiftChangeRequestList();
            //$scope.getRegularizationRequestList();
            
          }
          Initialize();

    });