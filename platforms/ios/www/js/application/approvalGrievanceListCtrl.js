mainModule.factory("viewGrievanceSuggestion", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/adminHelpDesk/grievanceSuggestion/viewGrievanceSuggestion.spr'), {}, {
      'save': {
        method: 'POST',
        timeout: commonRequestTimeout
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

  mainModule.controller('approvalGrievanceListCtrl', function ($scope, $rootScope, $filter, commonService, $state, getYearListService, $ionicPopup, viewODApplicationService, sendODRequestService, getSetService, $ionicLoading, $ionicModal, cancelODRequestService, viewLeaveApplicationService, detailsService, viewMissPunchApplicationService,
    viewGrievanceSuggestion, getTravelApplicationListService, addClaimFormService, travelClaimDataService, viewClaimFormService, viewRequisitionApprovalService, sendForCancellation){
      $rootScope.navHistoryPrevPage = "approvalsNew" 
      $scope.requesObject = {}
        $scope.requesObjectForMonth = {};
        $scope.requesObjectForYear = {};
        $scope.requesObjectForMonth.month = ''
        $scope.requesObjectForYear.yearId = ''
        $scope.searchObj = {}
        $scope.searchObj.searchQuery = '';
        $scope.searchObj.searchRegular = ''
        $scope.searchObj.searchOD = ''
        $scope.searchObj.searchShift = ''
  
        $scope.requesObject1 = {};
        $scope.sendrequesObject = {}
        $scope.requesObject = {}
        $scope.selectedValues = {}
        $scope.IsGrievanceAccessible = sessionStorage.getItem('IsGrievanceAccessible');

        $scope.refreshLeaveList = function () {
            $scope.GrievanceListFetched = false
            $scope.getApproveList()
        
          }

        $scope.redirectOnBack = function () {
            $state.go('app.approvalsMenu');
            //$ionicNavBarDelegate.back();
        }

        $scope.approvalDetailsFun = function (obj) {
          $rootScope.grievanceObject = obj
          $state.go('grievanceApplicationDetailsApprove')
        }
        
        $scope.GrievanceListFetched = false
        if (sessionStorage.getItem('IsGrievanceAccessible') != false) {
            
            $scope.requesObject.menuId = 2715
            //alert("leave " + $scope.requesObject.menuId)
            $scope.requesObject.buttonRights = "Y-Y-Y-Y"
            
            
            
          }
          if ($scope.IsGrievanceAccessible != false) {
            
            $scope.requesObject.menuId = 2715
            $scope.requesObject.buttonRights = "Y-Y-Y-Y"
            
            
            
          }
          $scope.getApproveList = function () {
            $scope.searchObj = '';
             $ionicLoading.show();
            $rootScope.reqestPageLastTab = "GRIEVANCE"
        
            if ($scope.GrievanceListFetched == true) {
                $ionicLoading.hide()
              return;
            }
        
              
            $scope.GrievanceListFetched = true
            
            $scope.requesObject.SelfRequestListFlag = 1;
            
            $scope.requesObject.menuId = 2715
            $scope.requesObject.returnListType= "APPROVE"
            $scope.requesObject.buttonRights = "Y-Y-Y-Y"

            var fd = new FormData()
            fd.append("SelfRequestListFlag",1)
            fd.append("menuId",2715)
            fd.append("returnListType","APPROVE")
            fd.append("buttonRights","Y-Y-Y-Y")

            $ionicLoading.show();
            /*
            $scope.viewGrievanceSuggestion = new viewGrievanceSuggestion();
            $scope.viewGrievanceSuggestion.$save($scope.requesObject, function (data) {
              if (!(data.clientResponseMsg == "OK")) {
                handleClientResponse(data.clientResponseMsg, "viewLeaveApplicationService")
                showAlert("Something went wrong. Please try later.")
                return;
              }
              
              
              $scope.approveList = []
              if (data.approveList == undefined) {
                $ionicLoading.hide();
              } else if (data.approveList.length == 0) {
                $ionicLoading.hide();
              } else {
                $scope.approveList = data.approveList
              }
              $ionicLoading.hide()
              */
              
              $.ajax({
                url: (baseURL + '/api/adminHelpDesk/grievanceSuggestion/viewGrievanceSuggestion.spr'),
                data: fd,
                type: 'POST',
                async:false,
                timeout:40000,
                contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                processData: false, // NEEDED, DON'T OMIT THIS
                headers: {
                  'Authorization': 'Bearer ' + jwtByHRAPI
                 },
                 success : function(data) {
                  if (!(data.clientResponseMsg == "OK")) {
                    handleClientResponse(data.clientResponseMsg, "viewGrievanceSuggestion")
                    showAlert("Something went wrong. Please try later.")
                    return;
                  }
                  
                  
                  $scope.approveList = []
                  if (data.approveList == undefined) {
                    $ionicLoading.hide();
                  } else if (data.approveList.length == 0) {
                    $ionicLoading.hide();
                  } else {
                    $scope.approveList = data.approveList
                  }
                  $ionicLoading.hide()
                  return;
    
              
            }, function (data, status) {
                alert(data.url)
              autoRetryCounter = 0
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
            }
        
            });
          
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
          $scope.refreshLeaveList = function () {
            $scope.GrievanceListFetched = false
            $scope.getApproveList()
        
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
         
          function Initialize() {
	
            $ionicLoading.show();
            
            $scope.getApproveList();
            
          }
          Initialize();

    });