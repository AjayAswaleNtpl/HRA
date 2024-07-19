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
  mainModule.factory("sendForCancellation", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/attendance/missPunch/sendForCancellation.spr'), {}, { 'save': { method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 } } }, {});
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
  mainModule.controller('requestODListCtrl', function ($scope,$timeout, $rootScope, $filter, commonService, $state, getYearListService, $ionicPopup, viewODApplicationService, sendODRequestService, getSetService, $ionicLoading, $ionicModal, cancelODRequestService, viewLeaveApplicationService, detailsService, viewMissPunchApplicationService,
    viewShiftChangeApplicationService, getTravelApplicationListService, addClaimFormService, travelClaimDataService, viewClaimFormService, viewRequisitionApprovalService, sendForCancellation){

      $rootScope.navHistoryPrevPage = "requisitionNew"

      $scope.IsODAccessible = sessionStorage.getItem('IsODAccessible');
        if ($rootScope.myAppVersion>=20){
          $scope.showPunchDetailsFeature='true'
        }else{
          $scope.showPunchDetailsFeature='false'
        }
        //alert($scope.IsODAccessible)
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
        $scope.odListFetched = false

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
          if (sessionStorage.getItem('IsODAccessible') != false) {
            var odMenuInfo = getMenuInformation("Attendance Management", "OD Application");
            //alert("od " + $scope.requesObject.menuId)
            $scope.requesObject1.menuId = odMenuInfo.menuId;
            $scope.requesObject1.year = "" + new Date().getFullYear();
            $scope.requesObject1.level = 1
            
            //$scope.IsODAccessible = 'true'
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
                
               
                dtHrapiFormatFromDateOD = $scope.travelFormatedDate[0] + '/' + $scope.travelFormatedDate[1] + '/' + $scope.travelFormatedDate[2]
                $scope.ODlList[i].dtHrapiFormatFromDateOD = dtHrapiFormatFromDateOD
                dtHrapiFormatToDateOD = $scope.travelFormatedDate_new[0] + '/' + $scope.travelFormatedDate_new[1] + '/' + $scope.travelFormatedDate_new[2]
                $scope.ODlList[i].dtHrapiFormatToDateOD = dtHrapiFormatToDateOD

                $scope.tmpDate = $scope.ODlList[i].reqDate.split('/')
                $scope.ODlList[i].dateObjForSorting = new Date($scope.tmpDate[2] + '/' + $scope.tmpDate[1] + '/' + $scope.tmpDate[0])

                //approvalRemarks
                $scope.ODlList[i].appRemarks = $scope.ODlList[i].appRemarks.replace(/&#13;/g, "\n")
                $scope.ODlList[i].appRemarks = $scope.ODlList[i].appRemarks.replace(/&#10;/g, "\n")
                $scope.ODlList[i].appRemarks = $scope.ODlList[i].appRemarks.replace(/<br>/g, "\n")
                $scope.ODlList[i].appRemarks = $scope.ODlList[i].appRemarks.replace(/<BR>/g, "\n")
                
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
          $scope.redirectOnBack = function(){
              $state.go('app.requestMenu')
          }

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

          $scope.reDirectToODApplictaionPage = function () {
            $rootScope.dataExchForODEdit = 'false'
            $state.go('odApplication')
          }

          $scope.cancelODRequest = function (status, ID, travelDate) {
            $ionicLoading.show();
            $scope.cancelObject.menuId = $scope.requesObject1.menuId
            $scope.cancelObject.buttonRights = "Y-Y-Y-Y"
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
                //showAlert("OD", data.message);
                showAlert("OD", "Cancelled Successfully.");
              }
              $ionicLoading.show();
              $scope.odListFetched = false
              $scope.getODApplicationList();
              $ionicLoading.hide();
              
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

          $scope.refreshODList = function () {

            $scope.odListFetched = false
            $scope.getODApplicationList()
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

          $scope.getPunches = function(fromDate,toDate,empId,idx,obj,module)
          
          {
           $ionicLoading.show();
            // if(document.getElementById("punch_"+idx).style.display=="none"){
            //   document.getElementById("punch_"+idx).innerHTML = "Show Punches"
            //   document.getElementById("punch_"+idx).style.display = ''
            // }else{
            //   document.getElementById("punch_"+idx).innerHTML = "Hide Punches"
            //   document.getElementById("punch_"+idx).style.display = "none"
            // }
            $timeout(function () {
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
                         
                         if(result1.htmlPunchesStr){
                          
                           result1.htmlPunchesStr = result1.htmlPunchesStr.replace(/<br>/g, "")
                   $scope.punchStr = result1.htmlPunchesStr.replace(/<br>/g, "\n")
                   if (module=="ATTREG"){
                     obj.punchStr = $scope.punchStr
                   }
                   if (module=="OD"){
                     $timeout(function () {
                       obj.punchStr = $scope.punchStr
                       //document.getElementById("punchDetails__"+idx).innerHTML = $scope.ODlList[idx].punchStr
                     },200)
                   }
                         }
                         $ionicLoading.hide();
                       },
                 error : function(res){
                   $ionicLoading.hide()
                   console.log(res.status);
                   
                 }
                   });
            },200)
 
                 
          }
          $scope.goToApprovals = function(){
            $state.go("approvalODList")
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

          function Initialize() {
	
            $ionicLoading.show();
            $scope.getRequestCounts();
            $scope.getODApplicationList();
            $ionicLoading.hide();
          }
          Initialize();

    });