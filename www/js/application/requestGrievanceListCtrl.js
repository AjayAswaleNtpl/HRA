mainModule.factory("viewGrievanceSuggestion", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/adminHelpDesk/grievanceSuggestion/viewGrievanceSuggestion.spr'), {}, {
      'save': {
        method: 'POST',
        timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
      }
    }, {});
  }]);

  mainModule.controller('requestGrievanceListCtrl', function ($scope, $rootScope,  commonService, 
    $state,    viewGrievanceSuggestion, $ionicLoading     
          ){
      $rootScope.navHistoryPrevPage = "requisitionNew" 
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

        $scope.refreshList = function () {
            $scope.GrievanceListFetched = false
            $scope.getRequestList()
        
          }

        $scope.redirectOnBack = function () {
            $state.go('app.requestMenu');
            //$ionicNavBarDelegate.back();
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

          $scope.getRequestList = function () {
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
            $scope.requesObject.returnListType= "REQUEST"
            $scope.requesObject.buttonRights = "Y-Y-Y-Y"

            var fd = new FormData()
            fd.append("SelfRequestListFlag",1)
            fd.append("menuId",2715)
            fd.append("returnListType","REQUEST")
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
              
              
              $scope.requestList = []
              if (data.reqList == undefined) {
                $ionicLoading.hide();
              } else if (data.reqList.length == 0) {
                $ionicLoading.hide();
              } else {
                $scope.requestList = data.reqList
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
                    handleClientResponse(data.clientResponseMsg, "viewLeaveApplicationService")
                    showAlert("Something went wrong. Please try later.")
                    return;
                  }
                  
                  
                  $scope.requestList = []
                  if (data.reqList == undefined) {
                    $ionicLoading.hide();
                  } else if (data.reqList.length == 0) {
                    $ionicLoading.hide();
                  } else {
                    $scope.requestList = data.reqList
                  }
                  $ionicLoading.hide()
                  return;
    
                },
                error: function (e) { //alert("Server error - " + e);
                  $ionicLoading.hide()
                  commonService.getErrorMessage($scope.data_return);
                     }				
                });			
           
          }


          $scope.getRequestList_OLD = function () {
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
            $scope.requesObject.returnListType= "REQUEST"
            $scope.requesObject.buttonRights = "Y-Y-Y-Y"
            $ionicLoading.show();
            $scope.viewGrievanceSuggestion = new viewGrievanceSuggestion();
            $scope.viewGrievanceSuggestion.$save($scope.requesObject, function (data) {
              if (!(data.clientResponseMsg == "OK")) {
                handleClientResponse(data.clientResponseMsg, "viewLeaveApplicationService")
                showAlert("Something went wrong. Please try later.")
                return;
              }
              
              
              $scope.requestList = []
              if (data.reqList == undefined) {
                $ionicLoading.hide();
              } else if (data.reqList.length == 0) {
                $ionicLoading.hide();
              } else {
                $scope.requestList = data.reqList
              }
              $ionicLoading.hide()
              return
              for (var i = 0; i < $scope.requestList.length; i++) {
                $scope.leaveFromFormatedDate = $scope.requestList[i].leaveFromDate.split('/')
                $scope.requestList[i].leaveFromDate = new Date($scope.leaveFromFormatedDate[2] + '/' + $scope.leaveFromFormatedDate[1] + '/' + $scope.leaveFromFormatedDate[0])
                $scope.leaveToFormatedDate = $scope.requestList[i].leaveToDate.split('/')
                $scope.requestList[i].leaveToDate = new Date($scope.leaveToFormatedDate[2] + '/' + $scope.leaveToFormatedDate[1] + '/' + $scope.leaveToFormatedDate[0])
                if ($scope.requestList[i].leaveFromDate.getTime() == $scope.requestList[i].leaveToDate.getTime()) {
                  $scope.requestList[i].leaveDate = $scope.requestList[i].leaveFromDate;
                }
                
                if ($scope.requestList[i].approverRemark) {
                  $scope.requestList[i].approverRemark = $scope.requestList[i].approverRemark.replace(/<br>/g, "\n")
                  $scope.requestList[i].approverRemark = $scope.requestList[i].approverRemark.replace(/<BR>/g, "\n")
                  $scope.requestList[i].approverRemark = $scope.requestList[i].approverRemark.replace(/&#13;/g, "\n")
                  $scope.requestList[i].approverRemark = $scope.requestList[i].approverRemark.replace(/&#10;/g, "\n")
                }
                
              }
              for (var i = 0; i < $scope.requestList.length; i++) {
                $scope.requestList[i].designation = sessionStorage.getItem('designation')
                $scope.requestList[i].department = sessionStorage.getItem('department');
                $scope.requestList[i].empName = sessionStorage.getItem('empName');
                $scope.requestList[i].name = sessionStorage.getItem('empName');
                if (sessionStorage.getItem('photoFileName')) {
                  $scope.requestList[i].photoFileName = sessionStorage.getItem('photoFileName')
                  $scope.requestList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
                }
                else {
                  $scope.requestList[i].photoFileName = ''
                  $scope.requestList[i].profilePhoto = ''
                }
        
        
              }
              $ionicLoading.hide()
              
            }, function (data, status) {
                alert(data.url)
              autoRetryCounter = 0
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
        
            });
          }

          $scope.refreshList = function () {
            $scope.GrievanceListFetched = false
            $scope.getRequestList()
        
          }
          $scope.reDirectToFreshGrievancePage = function () {
            $state.go('grievanceApplication')
          }
          $scope.selfDetailsFun = function (obj) {
            $rootScope.grievanceObject = obj
            $state.go('grievanceApplicationDetails')
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
            
            $scope.getRequestList();
            
          }
          Initialize();

    });