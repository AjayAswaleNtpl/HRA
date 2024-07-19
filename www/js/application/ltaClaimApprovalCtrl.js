
mainModule.factory("viewClaimApproveService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/claimForm/viewClaimApprove.spr'), {}, {
    'save': {
      method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
    }
  }, {});
}]);

mainModule.controller('ltaClaimApprovalCtrl', function ($scope, $rootScope, commonService, $ionicHistory,
  $rootScope, $ionicPopup, getValidateLeaveService, $state, $http, $q, $filter, $ionicLoading,
  viewClaimApproveService, getLeaveMasterService,
  $ionicNavBarDelegate) {
  
  if ($rootScope.SourcePage == "request_page" ){
    $rootScope.navHistoryPrevPage = "requestClaimList"
	}else{
		$rootScope.navHistoryPrevPage = "approvalClaimList"
	}
  //$rootScope.navHistoryCurrPage = "leave_application"
	$rootScope.navHistoryPrevTab="CLAIM_LTA"	

  $scope.currentLtaObj = $rootScope.ltaObjectForApprovalRejection
  $rootScope.ltaObjectForApprovalRejection = null

  $scope.resultObj = {}
  $scope.selectedFileName = ''

  
  if ($rootScope.SourcePage == "request_page" || 
	  ($scope.currentLtaObj.status != "SENT FOR APPROVAL" &&
	  $scope.currentLtaObj.status != "SENT FOR CANCELLATION")
	 ) {
	document.getElementById('appRejButtons').style.display="none"
	document.getElementById('appremDiv').style.display="none"

  }

  if ( getMyHrapiVersionNumber() >= 32){
		$scope.utf8Enabled = 'true'    
	}else{
		$scope.utf8Enabled = 'false'    
	}


  $scope.init = function () {
    $scope.claimListApplicationForm = {}
    $scope.selectedValues = {}
    $scope.claimPendingLObject = {}

    $scope.claimPendingLObject = $scope.currentLtaObj;
    $scope.claimPendingLObject.empId = $scope.currentLtaObj.empId;
    $scope.claimPendingLObject.menuId = '2009';
    $scope.claimPendingLObject.buttonRights = "Y-Y-Y-Y";
    $scope.claimPendingLObject.claimFlag = 'LTACLAIM';
    $scope.claimPendingLObject.mail = "N";
    $scope.claimPendingLObject.userAprvEnd = "";
    $scope.claimPendingLObject.disableHeader = true;
    $scope.claimPendingLObject.tranId = parseInt($scope.currentLtaObj.ctcClaimId);
	if ($scope.currentLtaObj.trackerId===undefined || $scope.currentLtaObj.trackerId == null) {
		$scope.claimPendingLObject.trackerId=0
	}else{
		$scope.claimPendingLObject.trackerId = $scope.currentLtaObj.trackerId;
	}
    $scope.claimPendingLObject.status = $scope.currentLtaObj.status;
    $ionicLoading.show();
    $scope.viewClaimApproveService = new viewClaimApproveService();
    $scope.viewClaimApproveService.$save($scope.claimPendingLObject, function (data) {
      if (!(data.clientResponseMsg == "OK")) {
        console.log(data.clientResponseMsg)
        handleClientResponse(data.clientResponseMsg, "viewClaimApproveService")
        showAlert("Something went wrong. Please try later")
        return
      }
      var ltaApprForm = JSON.parse(data.form);
      $scope.ltaApprForm = ltaApprForm
      $scope.ctcPeriodVO = data.ctcPeriodVO
      $scope.eisFamily = data.eisFamily
      $scope.files  = data.files

      $scope.ltaClaimApprList = []
      if (ltaApprForm.ltaClaimGridList === undefined) {
        $ionicLoading.hide();
        return

      } else if (ltaApprForm.ltaClaimGridList.length == 0) {
        $ionicLoading.hide();
        return
      } else {
        $scope.ltaClaimApprList = ltaApprForm.ltaClaimGridList
          // setting month name
        for (var i = 0; i < $scope.ltaClaimApprList.length; i++) {
          if ($scope.ltaClaimApprList[i].month == "01") {
            $scope.ltaClaimApprList[i].tempMonthName = "January"
          }
          else if ($scope.ltaClaimApprList[i].month == "02") {
            $scope.ltaClaimApprList[i].tempMonthName = "February"
          }
          else if ($scope.ltaClaimApprList[i].month == "03") {
            $scope.ltaClaimApprList[i].tempMonthName = "March"
          }
          else if ($scope.ltaClaimApprList[i].month == "04") {
            $scope.ltaClaimApprList[i].tempMonthName = "April"
          }
          else if ($scope.ltaClaimApprList[i].month == "05") {
            $scope.ltaClaimApprList[i].tempMonthName = "May"
          }
          else if ($scope.ltaClaimApprList[i].month == "06") {
            $scope.ltaClaimApprList[i].tempMonthName = "June"
          }
          else if ($scope.ltaClaimApprList[i].month == "07") {
            $scope.ltaClaimApprList[i].tempMonthName = "July"
          }
          else if ($scope.ltaClaimApprList[i].month == "08") {
            $scope.ltaClaimApprList[i].tempMonthName = "August"
          }
          else if ($scope.ltaClaimApprList[i].month == "09") {
            $scope.ltaClaimApprList[i].tempMonthName = "September"
          }
          else if ($scope.ltaClaimApprList[i].month == "10") {
            $scope.ltaClaimApprList[i].tempMonthName = "October"
          }
          else if ($scope.ltaClaimApprList[i].month == "11") {
            $scope.ltaClaimApprList[i].tempMonthName = "November"
          }
          else if ($scope.ltaClaimApprList[i].month == "12") {
            $scope.ltaClaimApprList[i].tempMonthName = "December"
          }

          //setting family name
          for(var j=0;j<$scope.eisFamily.length;j++){
            if ($scope.ltaClaimApprList[i].familyId==$scope.eisFamily[j].familyId){
                $scope.ltaClaimApprList[i].familyName = $scope.eisFamily[j].firstName
                break
            }
          }


        }
        $scope.paymentModeList = []

        // for (var i = 0; i < ltaApprForm.paymentModeList .length; i++) {
        //   $scope.paymentModeList.push({ "pmid": i, "pm": ltaApprForm.paymentModeList[i] })
        // }
        $ionicLoading.hide();
      }
      $ionicLoading.hide()
    }, function (data, status) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
  }




  $scope.downloadAttachmnent = function (travel){
		
		var strData=travel.uploadFile
		//var strUrlPrefix='data:"application/pdf;base64,'
		var strUrlPrefix='data:'+ travel.uploadContentType +";base64,"
		var url=strUrlPrefix + strData
		var blob = base64toBlob(strData,travel.uploadContentType)
		downloadFileFromData(travel.uploadFileName,blob,travel.uploadContentType)
		event.stopPropagation();
	}		




  $scope.openAttachment = function (file) {
    event.stopImmediatePropagation()
    var additionalId = $scope.ltaApprForm.transId
    
    file = file +1
    $ionicLoading.show();
    $.ajax({
      url: (baseURL + '/api/claimForm/openFileByCtcClaimIdMobile.spr?additionalId='+additionalId+'&file='+file),
      type: 'POST',
      contentType: false,
      processData: false,
      async:false,
      headers: {
        'Authorization': 'Bearer ' + jwtByHRAPI
     },
      success: function (result) {
        $ionicLoading.hide()
        //save file        
     
          if (!(result.clientResponseMsg=="OK")){
            console.log(result.clientResponseMsg)
            handleClientResponse(result.clientResponseMsg,"saveWithFile")
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
      error : function(error){
        showAlert("Error Occurred while fetching file.");
        $ionicLoading.hide();
        return
      }
    });  
    
    
  }



  


  $scope.setFromDate = function () {
    var date;
    if ($scope.resultObj.leaveFromDate == undefined) {
      $scope.resultObj.leaveFromDate = "";
    }
    else if ($scope.resultObj.leaveFromDate != "") {
      var parts = $scope.resultObj.leaveFromDate.split('/');
      $scope.fDate = new Date(parts[2], parts[1] - 1, parts[0]);
    }
    if ($scope.fDate == null) {
      date = new Date();
    }
    else {
      date = $scope.fDate;
    }
    var options = { date: date, mode: 'date', titleText: 'From Date', androidTheme: 4 };
    datePicker.show(options, function (date) {
      if (date == undefined) {
      }
      else {
        $scope.fDate = date
        $scope.Dat = $filter('date')(date, 'dd/MM/yyyy');
        var compTimeForFrom = $scope.fDate.getTime() - new Date().getTime()
        if ($scope.resultObj.leaveToDate) {
          var compTime = $scope.tDate.getTime() - date.getTime();
          if (compTime < 0) {
            showAlert("Set from date", "Leave from date must be less than to date")
            $scope.resultObj.leaveFromDate = $scope.resultObj.leaveToDate = ''
            $scope.dataBuffer.noDaysCounted = ''
            $scope.getTotalTimeDiff = ''
            $scope.fromToTypeCondition($scope.resultObj.fromLeaveType)
            return
          }
          $scope.resultObj.leaveFromDate = $filter('date')(date, 'dd/MM/yyyy');
          $scope.$apply();
          if ($scope.resultObj.leaveFromDate && $scope.resultObj.leaveToDate) {
            $scope.getMasterListOnload()
          }
        } else {
          $scope.resultObj.leaveFromDate = $filter('date')(date, 'dd/MM/yyyy');
          $scope.$apply();
          if ($scope.resultObj.leaveFromDate && $scope.resultObj.leaveToDate) {
            $scope.getMasterListOnload()
          }
        }
        if ($scope.resultObj.leaveToDate && $scope.resultObj.leaveFromDate) {
          if ($scope.resultObj.fromLeaveType == 'shortLeave' && $scope.resultObj.toLeaveType == 'shortLeave' && $scope.resultObj.leaveToDate != $scope.resultObj.leaveFromDate) {
            showAlert("Leave type", "From and to date should be same for short leave")
            $scope.resultObj.leaveFromDate = ''
            return
          } else if ($scope.resultObj.fromLeaveType == 'shortLeave' && $scope.resultObj.leaveFromDate != $scope.resultObj.leaveToDate) {
            showAlert("Leave Type", "From and to date should be same for short leave")
            $scope.resultObj.leaveFromDate = ''
            return
          }
        }
        $scope.fromToTypeCondition($scope.resultObj.fromLeaveType)
      }
    }, function (error) {
    });
  }

 

  $scope.approveOrRejectPendingLClaim = function (type) {

    for (var i = 0; i < $scope.ltaClaimApprList.length; i++) {
      if(document.getElementById('approvedBillAmount' + i) != null){
        //$scope.ltaApprForm.ltaClaimGridList[i].approvedBillAmount = document.getElementById('approvedBillAmount' + i).value
        $scope.ltaApprForm.ltaClaimGridList[i].approvedClaim = document.getElementById('approvedBillAmount' + i).value
        if (type == "APPROVE") {
          if ($scope.ltaApprForm.ltaClaimGridList[i].approvedClaim <= 0.0) {
            showAlert("Approved Amount should be greater than 0.0");
            $ionicLoading.hide()
            return
          }
          if ($scope.ltaApprForm.ltaClaimGridList[i].approvedClaim > $scope.ltaApprForm.ltaClaimGridList[i].claimAmount) {
            showAlert("Approved Amount should not be more than Claim Amount");
            $ionicLoading.hide()
            return
          }
        }
      }
    }
    var str = JSON.stringify($scope.ltaApprForm.ltaClaimGridList)
    var fd = new FormData()
    fd.append("voList", str)
    fd.append("empId", $scope.ltaApprForm.empId)
    fd.append("menuId", '2014')
    fd.append("buttonRights", "Y-Y-Y-Y")
    fd.append("isFromMail", "N")
    fd.append("mail", "N")
    fd.append("status", $scope.ltaApprForm.status)
    fd.append("claimFlag", 'LTACLAIM')
    fd.append("claimFormId", parseInt($scope.ltaApprForm.transId))
    fd.append("tranId", parseInt($scope.ltaApprForm.transId))
    fd.append("trackerId", parseInt($scope.ltaApprForm.trackerId))
    fd.append("transAssignEmpId", '')
    fd.append("userAprvEnd", '')

    var  claimFormVO = {}
    if (document.getElementById("disburseYear")){
      claimFormVO.disburseYear =  document.getElementById("disburseYear").value
      claimFormVO.disburseYear =  parseInt(claimFormVO.disburseYear.replace("number:",""));
      claimFormVO.disburseMonth = parseInt(document.getElementById("disburseMonth").value)
    
      claimFormVO.disburseDate = document.getElementById("disburseDate").value 
      claimFormVO.disburseRemark = document.getElementById("disburseRemark").value 
      claimFormVO.disburseAmount = document.getElementById("disburseAmount").value 
    }
    
    var appRemakrs = document.getElementById("apprem").value 
      if ($scope.utf8Enabled == 'true' ){
				if (claimFormVO.disburseRemark){
					claimFormVO.disburseRemark = encodeURI(claimFormVO.disburseRemark)
				}
        if (appRemakrs){
          appRemakrs = encodeURI(appRemakrs)
          fd.append("appRemarks",appRemakrs)
        }else{
          fd.append("appRemarks",'')
        }
			}

      
      
      
      //revisedClaimAmount = document.getElementById("revisedClaimAmount").value
      fd.append("vo",JSON.stringify(claimFormVO)); 
			

        
    if (type == "APPROVE") {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Are you sure',
        template: 'Do you want to approve the application?',
      });
      confirmPopup.then(function (res) {
        if (res) {
          // $ionicLoading.show();

          $.ajax({
            url: (baseURL + '/api/claimForm/approveRequest.spr'),
            data: fd,
            type: 'POST',
            contentType: false,
            processData: false,
            headers: {
              'Authorization': 'Bearer ' + jwtByHRAPI
           },
            success: function (success) {
              $ionicLoading.hide()
              showAlert("Claim application", "Claim approved successfully");
              $scope.redirectOnBack()
              return
            },
            error : function(error){
              showAlert("Error Occurred" + error);
              $ionicLoading.hide();
              $scope.redirectOnBack();
              return
            }
          });
          return
        } else {
          return;
        }
      });
    }
    if (type == "REJECT") {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Are you sure',
        template: 'Do you  to reject the application?',
      });
      confirmPopup.then(function (res) {
        if (res) {
          // $ionicLoading.show();
          $.ajax({
            url: (baseURL + '/api/claimForm/rejectRequest.spr'),
            data: fd,
            type: 'POST',
            contentType: false,
            processData: false,
            headers: {
              'Authorization': 'Bearer ' + jwtByHRAPI
           },
            success: function (success) {
              $ionicLoading.hide()
              showAlert("Claim application", "Claim rejected successfully");
              $scope.redirectOnBack()
              return
            },
            error : function(error){
              showAlert("Error Occurred" + error);
              $ionicLoading.hide();
              $scope.redirectOnBack();
              return
            }
          });
        }
      });
      return
    }
  }

  
  

  $scope.redirectOnBack = function () {
	//$ionicNavBarDelegate.back();
	if ($rootScope.SourcePage == "request_page" ){
		$state.go("requestClaimList");
	}else{
		$state.go("approvalClaimPage");
	}
  
  }
  
  
  $scope.init();

});
