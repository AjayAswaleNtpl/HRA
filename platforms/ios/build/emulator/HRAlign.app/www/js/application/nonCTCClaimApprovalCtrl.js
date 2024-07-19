
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

mainModule.controller('nonCTCClaimApprovalCtrl', function ($scope,$rootScope, commonService, $ionicHistory,
  $rootScope, $ionicPopup, getValidateLeaveService, $state, $http, $q, $filter, $ionicLoading,
  viewClaimApproveService, getLeaveMasterService,
  $ionicNavBarDelegate,approvePendingClaimService ) {
	  
	  
  
  if ($rootScope.navHistoryCurrPage =="approvals"){
    $rootScope.navHistoryPrevPage="approvalClaimList"
  }
  else{
    $rootScope.navHistoryPrevPage="requestClaimList"
  }
  //$rootScope.navHistoryCurrPage="NONCTC_APPROVAL"
  
  $rootScope.navHistoryPrevTab="CLAIM_NONCTC"

  $scope.currentNonCTCObj = $rootScope.nonCtcObjectForApprovalRejection
  $rootScope.nonCtcObjectForApprovalRejection = null

  $scope.resultObj = {}
  $scope.selectedFileName = ''

  if ( getMyHrapiVersionNumber() >= 32){
		$scope.utf8Enabled = 'true'    
	}else{
		$scope.utf8Enabled = 'false'    
	}

  

  $scope.init = function () {
  $scope.claimListApplicationForm = {}
  $scope.selectedValues={}
  $scope.claimPendingNObject = {}

  $scope.claimPendingNObject.empId = $scope.currentNonCTCObj.empId;
  $scope.claimPendingNObject.menuId = '2004';
  $scope.claimPendingNObject.buttonRights = "Y-Y-Y-Y";
  $scope.claimPendingNObject.claimFlag = 'NONCTC';
  $scope.claimPendingNObject.mail = "N";
  $scope.claimPendingNObject.userAprvEnd = "" ;
  $scope.claimPendingNObject.disableHeader = true ;
  $scope.claimPendingNObject.tranId = parseInt($scope.currentNonCTCObj.claimFormId);
  if ($scope.currentNonCTCObj.trackerId === undefined || $scope.currentNonCTCObj.trackerId == null){
	$scope.claimPendingNObject.trackerId = 0
  }else{
	$scope.claimPendingNObject.trackerId = $scope.currentNonCTCObj.trackerId;
  }
  

  if ($scope.currentNonCTCObj.status==null){
    //form is getting opened from requisitions
    $scope.claimPendingNObject.status = $scope.currentNonCTCObj.gridStatus;
    document.getElementById("btnApprove").style.display="none"
    document.getElementById("btnReject").style.display="none"

  }else{
    $scope.claimPendingNObject.status = $scope.currentNonCTCObj.status;
  }
  
  if ($scope.claimPendingNObject.status != "SENT FOR APPROVAL" &&
  $scope.claimPendingNObject.status != "SENT FOR CANCELLATION"){

    document.getElementById("btnApprove").style.display="none"
    document.getElementById("btnReject").style.display="none"
	document.getElementById('divAppRejButtons').style.display="none"

  }  

  
	
  

  $ionicLoading.show();
  $scope.viewClaimApproveService = new viewClaimApproveService();
  $scope.viewClaimApproveService.$save($scope.claimPendingNObject, function (data) {
    if (!(data.clientResponseMsg=="OK")){
      console.log(data.clientResponseMsg)
      handleClientResponse(data.clientResponseMsg,"viewClaimApproveService")
      showAlert("Something went worng. Please try later")
      return
    }
    var nonctcApprForm = JSON.parse(data.form);
    $scope.nonctcApprForm = nonctcApprForm

      $scope.nonCTCClaimApprList = []
      if (nonctcApprForm.claimFormVOList === undefined)
        {
          $ionicLoading.hide();
          return

        }else if (nonctcApprForm.claimFormVOList.length == 0 ){
        $ionicLoading.hide();
        return
      }else{
        $scope.nonCTCClaimApprList = nonctcApprForm.claimFormVOList
		// $scope.paymentModeList=[]
		
	  // if (nonctcApprForm.paymentModeList){
		// for(var i=0;i<nonctcApprForm.paymentModeList.length;i++){
		// 	$scope.paymentModeList.push({"pmid":i,"pm":nonctcApprForm.paymentModeList[i]})
		// }
	  // }
        
        
		
		for(var i=0;i<$scope.nonCTCClaimApprList.length;i++){
      $scope.nonCTCClaimApprList[i].fileNameNew = []
      $scope.nonCTCClaimApprList[i].fileUniqueNo = []
      for(var j=0;j<$scope.nonCTCClaimApprList[i].fileName.length;j++){
        if ($scope.nonCTCClaimApprList[i].fileName[j]  === undefined){
          //do nothing no file
          continue
        }else{
          $scope.nonCTCClaimApprList[i].fileNameNew[j] = $scope.nonCTCClaimApprList[i].fileName[j].substring(0,$scope.nonCTCClaimApprList[i].fileName[j].length -2)
          $scope.nonCTCClaimApprList[i].fileUniqueNo[j] = $scope.nonCTCClaimApprList[i].fileName[j].substring($scope.nonCTCClaimApprList[i].fileName[j].length -2,$scope.nonCTCClaimApprList[i].fileName[j].length)
        }
        if ($scope.claimPendingNObject.status != "SENT FOR APPROVAL" &&
          $scope.claimPendingNObject.status != "SENT FOR CANCELLATION"){

			if (document.getElementById("approvedBillAmount"+i)){
				document.getElementById("approvedBillAmount"+i).disabled = true
			}
            
			if (document.getElementById("apprem"+i)){
				document.getElementById("apprem"+i).disabled = true
			}
        }
      }
      //
    }
    
    ///////////////////////////
    $scope.periodfromDt = $scope.nonctcApprForm.ctcPeriodVO.fromDt
    $scope.periodtoDt = $scope.nonctcApprForm.ctcPeriodVO.toDt

    //document.getElementById("month").value = $scope.nonctcApprForm.month
    //document.getElementById("paymentMonth").value = $scope.nonctcApprForm.month
    // $timeout(function () {
    // for(var i=0;i<document.getElementById("yearId").options.length;i++){
    //   if (document.getElementById("yearId").options[i].innerHTML == $scope.nonctcApprForm.yearId  ){
    //     document.getElementById("yearId").options[i].selected = true
    //     $ionicLoading.hide()
    //       break;
    //       }
    //   }
    // },1000)
    

   
    }
    $ionicLoading.hide()
      }, function (data, status) {
          autoRetryCounter = 0
          $ionicLoading.hide()
          commonService.getErrorMessage(data);
      });
}


$scope.setDate = function () {
  var date;
  if ($scope.fDate == null) {
      date = new Date();
  }
  else {
      date = $scope.fDate;
  }
  var options = {date: date, mode: 'date', titleText: 'Date', androidTheme: 4};
  datePicker.show(options, function (date) {
      if (date == undefined) {

      }
      else {
          $scope.fDate = date;
    document.getElementById("disburseDate").value = $filter('date')(date, 'dd/MM/yyyy');

  if (!$scope.$$phase)
              $scope.$apply()

      }
  }, function (error, status) {
      $ionicLoading.hide();
  });
}


  // $scope.setFromDate = function () {
  //     var date;
  //     if ($scope.resultObj.leaveFromDate == undefined) {
  //       $scope.resultObj.leaveFromDate = "";
  //     }
  //     else if ($scope.resultObj.leaveFromDate != "") {
  //       var parts = $scope.resultObj.leaveFromDate.split('/');
  //       $scope.fDate = new Date(parts[2], parts[1] - 1, parts[0]);
  //     }
  //     if ($scope.fDate == null) {
  //       date = new Date();
  //     }
  //     else {
  //       date = $scope.fDate;
  //     }
  //     var options = {date: date, mode: 'date', titleText: 'From Date', androidTheme: 4};
  //     datePicker.show(options, function (date) {
  //       if (date == undefined) {
  //       }
  //       else {
  //         $scope.fDate = date
  //         $scope.Dat = $filter('date')(date, 'dd/MM/yyyy');
  //         var compTimeForFrom = $scope.fDate.getTime() - new Date().getTime()
  //         if ($scope.resultObj.leaveToDate) {
  //           var compTime = $scope.tDate.getTime() - date.getTime();
  //           if (compTime < 0) {
  //             showAlert("Set from date", "Leave from date must be less than to date")
  //             $scope.resultObj.leaveFromDate = $scope.resultObj.leaveToDate = ''
  //             $scope.dataBuffer.noDaysCounted = ''
  //             $scope.getTotalTimeDiff = ''
  //                     $scope.fromToTypeCondition($scope.resultObj.fromLeaveType)
  //                     return
  //                 }
  //                 $scope.resultObj.leaveFromDate = $filter('date')(date, 'dd/MM/yyyy');
  //                 $scope.$apply();
  //                 if ($scope.resultObj.leaveFromDate && $scope.resultObj.leaveToDate) {
  //                     $scope.getMasterListOnload()
  //                 }
  //             } else {
  //                 $scope.resultObj.leaveFromDate = $filter('date')(date, 'dd/MM/yyyy');
  //                 $scope.$apply();
  //                 if ($scope.resultObj.leaveFromDate && $scope.resultObj.leaveToDate) {
  //                     $scope.getMasterListOnload()
  //                 }
  //             }
  //             if ($scope.resultObj.leaveToDate && $scope.resultObj.leaveFromDate) {
  //                 if ($scope.resultObj.fromLeaveType == 'shortLeave' && $scope.resultObj.toLeaveType == 'shortLeave' && $scope.resultObj.leaveToDate != $scope.resultObj.leaveFromDate) {
  //                     showAlert("Leave type", "From and to date should be same for short leave")
  //                     $scope.resultObj.leaveFromDate = ''
  //                     return
  //                 } else if ($scope.resultObj.fromLeaveType == 'shortLeave' && $scope.resultObj.leaveFromDate != $scope.resultObj.leaveToDate) {
  //                     showAlert("Leave Type", "From and to date should be same for short leave")
  //                     $scope.resultObj.leaveFromDate = ''
  //                     return
  //                 }
  //             }
  //             $scope.fromToTypeCondition($scope.resultObj.fromLeaveType)
  //         }
  //     }, function (error) {
  //     });
  // }

  

  $scope.approveOrRejectPendingNClaim = function (type) {

	  var payModeId = "-1"
	  
    
	  payMode = document.getElementById("paymentMode")
    if (payMode != null){
				payModeText = payMode.options[payMode.selectedIndex].text
			if (payMode.selectedIndex>0){
        payModeId = $scope.selectedValues.paymode
				// for(var k=0;k<100;k++){
				// if ($scope.paymentModeList[k].pm == payModeText  ){
				// 	 payModeId = k
				// 	break;
				// 	}
				// }
				//alert($scope.nonctcApprForm.paymentMode)
			}
    }
    $scope.nonctcApprForm.paymentMode = payModeId

		//make this in loop
		
		for(var i=0;i<$scope.nonCTCClaimApprList.length;i++){
			
			$scope.nonctcApprForm.claimFormVOList[i].approvedBillAmount = document.getElementById('approvedBillAmount'+i).value
			$scope.nonctcApprForm.claimFormVOList[i].revisedClaimAmount = document.getElementById('approvedBillAmount'+i).value
			$scope.nonctcApprForm.claimFormVOList[i].appRemarks = document.getElementById('apprem'+i).value
      if ($scope.utf8Enabled == 'true' ){
        if ($scope.nonctcApprForm.claimFormVOList[i].appRemarks){
          $scope.nonctcApprForm.claimFormVOList[i].appRemarks = encodeURI($scope.nonctcApprForm.claimFormVOList[i].appRemarks)
        }
      }
      
			if (type == "APPROVE") {	
				if ($scope.nonctcApprForm.claimFormVOList[i].approvedBillAmount <= 0.0) {
					  showAlert("Approved Amount should be greater than 0.0");
					  $ionicLoading.hide()
					  return
					}
					if ($scope.nonctcApprForm.claimFormVOList[i].approvedBillAmount > $scope.nonctcApprForm.claimFormVOList[i].claimAmount) {
					  showAlert("Approved Amount should not be more than Claim Amount");
					  $ionicLoading.hide()
					  return
					}

				}
		}
			
		
			var str = JSON.stringify($scope.nonctcApprForm.claimFormVOList)
			var fd = new FormData()
			fd.append("voList",str)
			fd.append("empId",$scope.nonctcApprForm.empId)
			fd.append("menuId",'2004')
			fd.append("buttonRights","Y-Y-Y-Y")
			fd.append("isFromMail","N")
			fd.append("mail","N")
			fd.append("status",$scope.nonctcApprForm.status)
			fd.append("claimFlag",'NONCTC')
			fd.append("claimFormId",parseInt($scope.nonctcApprForm.transId))
			fd.append("tranId",parseInt($scope.nonctcApprForm.transId))
			fd.append("trackerId",parseInt($scope.nonctcApprForm.trackerId))
			fd.append("transAssignEmpId",'')
			fd.append("userAprvEnd",'')
			fd.append("paymentMode",$scope.nonctcApprForm.paymentMode)

      var  claimFormVO = {}
      if ( document.getElementById("disburseYear")){
      claimFormVO.disburseYear =  document.getElementById("disburseYear").value
      claimFormVO.disburseYear =  parseInt(claimFormVO.disburseYear.replace("number:",""));
      claimFormVO.disburseMonth = parseInt(document.getElementById("disburseMonth").value)

      
      claimFormVO.disburseDate = document.getElementById("disburseDate").value 
      claimFormVO.disburseRemark = document.getElementById("disburseRemark").value 
      }
      fd.append("appRemarks",claimFormVO.disburseRemark)
      
      if ( document.getElementById("disburseAmount")){
      
      if (document.getElementById("disburseAmount").value == ""){
        claimFormVO.disburseAmount = 0
      }else
      {
        claimFormVO.disburseAmount = document.getElementById("disburseAmount").value 
      }
    }else{
      claimFormVO.disburseAmount = 0
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
					$ionicLoading.show();
					
						$.ajax({
						url: (baseURL + '/api/claimForm/approveRequest.spr'),
						data: fd,
            type: 'POST',
            timeout: commonRequestTimeout,
						contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
						processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
              'Authorization': 'Bearer ' + jwtByHRAPI
           },
						success : function(success) {
							$ionicLoading.hide()
							showAlert("Claim application", "Claim approved successfully");
							$scope.redirectOnBack()
							return
							/*
							if (!(success.clientResponseMsg=="OK")){
										console.log(success.clientResponseMsg)
										handleClientResponse(success.clientResponseMsg,"sendForApproveWithFile")
										$ionicLoading.hide()
										showAlert("Something went wrong. Please try lat er.")
										$ionicNavBarDelegate.back();
										return
									}
								*/	
									
									
						}

						});
			
			
					/*
					$scope.approvePendingClaimService = new approvePendingClaimService();
					$scope.approvePendingClaimService.$save(fd, function () {
					  //getMenuInfoOnLoad(function () { });
					  showAlert("Claim application", "Claim approved successfully");
					  $scope.nonctcClaimlistFetched = false
					  $scope.getNonCtcClaimApprovalList();
					  $ionicLoading.hide()
					}, function (data) {
					  $ionicLoading.hide()
					  commonService.getErrorMessage(data);
					});
					*/
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
					$ionicLoading.show();
		$.ajax({
						url: (baseURL + '/api/claimForm/rejectRequest.spr'),
						data: fd,
            type: 'POST',
            timeout: commonRequestTimeout,
						contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
						processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
              'Authorization': 'Bearer ' + jwtByHRAPI
           },
						success : function(success) {
							$ionicLoading.hide()
							showAlert("Claim application", "Claim rejected successfully");
							$scope.redirectOnBack()
							return
							/*
							if (!(success.clientResponseMsg=="OK")){
										console.log(success.clientResponseMsg)
										handleClientResponse(success.clientResponseMsg,"sendForApproveWithFile")
										$ionicLoading.hide()
										showAlert("Something went wrong. Please try lat er.")
										$ionicNavBarDelegate.back();
										return
									}
								*/	
									
									
						}

						});
				}
				});
						return

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
              $ionicLoading.hide()
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

  
  
  $scope.downloadAttachmnent = function (travel){
		
		var strData=travel.uploadFile
		//var strUrlPrefix='data:"application/pdf;base64,'
		var strUrlPrefix='data:'+ travel.uploadContentType +";base64,"
		var url=strUrlPrefix + strData
		var blob = base64toBlob(strData,travel.uploadContentType)
		downloadFileFromData(travel.uploadFileName,blob,travel.uploadContentType)
		event.stopPropagation();
	}		




  $scope.openAttachment = function (event) {
	  var idToSend
	  idToSend =  $scope.selectedValues.elem.id.replace("fileName","")
	  //if (idToSend<10){
		//  idToSend= "0"+idToSend
	  //}

    event.stopImmediatePropagation()
    var additionalId = $scope.nonCTCClaimApprList[0].claimFormId
	
    idToSend = idToSend + 1 + ""
    $ionicLoading.show();
    $.ajax({
      url: (baseURL + '/api/claimForm/openFileAdd.spr?additionalId='+additionalId+'&file='+idToSend),
      type: 'POST',
      timeout: commonRequestTimeout,
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
  
  $scope.onChangePayMode = function(elem){
    var str = $(document.getElementById("paymentMode")).children("option:selected").val().replace("string:","")
    if (str == "Disburse By Cash"){
        $scope.paymode = "cash"
    }
    if (str == "Disburse By Payroll"){
      $scope.paymode = "payroll"
    }
  }


  
  $scope.redirectOnBack = function(){
	//$ionicNavBarDelegate.back();
	if ($rootScope.navHistoryCurrPage =="approvals")
    $state.go("approvalClaimList");
	else
	$state.go('requestClaimList');
  }
  
  $scope.init();
});
