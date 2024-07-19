/*
 1.This controller is used to Approve / Reject for Leave,Shift,Attendance,OD.
 2.Sent for cancellation requests are also Approved / Reject for Leave,Shift,Attendance,OD.
 3.Detailed view can be seen while opening modal by clicking on the list.
 */
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
  
  mainModule.factory("getCountService", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/portal/viewRequisitionApprovalJson.spr'), {}, {
      'save': {
        method: 'POST',
        contentType: 'application/json',
        timeout: commonRequestTimeout,
        headers: {
          'Authorization': 'Bearer ' + jwtByHRAPI
          }
      }
    }, {});
  }]);


mainModule.controller('approvalsMenuCtrl', function ($scope,$rootScope,$timeout,$state,$ionicLoading,
  getRequisitionCountService,getCountService) {

  console.log("HRAPI:"+ getMyHrapiVersionNumber())
  // if ($rootScope.navHistoryCurrPage == "requisitionNew")
  // {
	//   if ($rootScope.HomeDashBoard){
	// 	$rootScope.navHistoryPrevPage = "dashboard"
	//   }else{
	// 	  $rootScope.navHistoryPrevPage = "selfservices"
	//   }
	//   $rootScope.navHistoryCurrPage = "approvalsNew"
  // }else{
	// $rootScope.navHistoryPrevPage = $rootScope.navHistoryCurrPage
	// $rootScope.navHistoryCurrPage = "approvalsNew"
  // }


  if (GeoTrackingEnabledForUser == "true" && GeoTrackingFeatureEnabledForClient =="true"){
    //enableGeoTrackingInBackground()
  }


 $rootScope.navHistoryCurrPage ="approvals"
  if ($rootScope.HomeDashBoard){
  	$rootScope.navHistoryPrevPage = "dashboard"
  }else{
   	  $rootScope.navHistoryPrevPage = "selfservices"
     }

    $scope.isARTorFRT = sessionStorage.getItem('IsARTorFRT');
    $scope.isGroupMasterReportee = sessionStorage.getItem('isGroupMasterReportee');
    if ( $scope.isARTorFRT == 'true' ||  $scope.isGroupMasterReportee == 'true'){
      $scope.showAllMenus =  'true'  
    }else{
      $scope.showAllMenus =  'false'  
    }
    

    $scope.isPanelMember = sessionStorage.getItem('isPanelMember');
    //alert($scope.isPanelMember)

     $scope.isLeaveAccessible =   sessionStorage.getItem('IsLeaveAccessible')
     $scope.isODAccessible =   sessionStorage.getItem('IsODAccessible')
     $scope.isRegularizationAccessible =   sessionStorage.getItem('IsRegularizationAccessible')
     $scope.isShiftChangeAccessible =   sessionStorage.getItem('IsShiftChangeAccessible')

     if (getMyHrapiVersionNumber() >= 18){
      $scope.isTravelAccessible = sessionStorage.getItem('IsTravelAccessible')
      $scope.isClaimAccessible = sessionStorage.getItem('IsClaimAccessible')
      $scope.isExpenseClaimAccessible = sessionStorage.getItem('IsExpenseClaimAccessible')
     }
     if (getMyHrapiVersionNumber() >= 22){
			
      $scope.isTimesheetAccessible = sessionStorage.getItem('IsTimesheetAccessible')
      $scope.isProjectConfigAccessible = sessionStorage.getItem('IsProjectConfigAccessible')
    }
    if (getMyHrapiVersionNumber() >= 23){
    
      $scope.isInvestmentDeclaration = sessionStorage.getItem('IsInvestmentDeclaration')
    }
    
    if (getMyHrapiVersionNumber() >= 26){
      $scope.IsGrievanceAccessible = sessionStorage.getItem('IsGrievanceAccessible')
    }else{
      $scope.IsGrievanceAccessible = 'false'
    }

function Initialize(){
  $ionicLoading.show();
    getMenuInfoOnLoad();
}
$scope.openLeaveApproval = function(){
    $state.go('approvalLeaveList')
}
$scope.openODApproval = function(){
    $state.go('approvalODList')
}
$scope.openAttendanceApproval = function(){
    $state.go('approvalAttendanceList')
}
$scope.openShiftChangeApproval = function(){
    $state.go('approvalShiftChangeList')
}
$scope.openTravelApproval = function(){
    $state.go('approvalTravelList')
}
    
$scope.openClaimApproval = function(){
    $state.go('approvalClaimList')
}
$scope.openProjectConfigList = function(){
    $state.go('projectConfigListApprovals')
}
$scope.openTimesheetApproval = function(){
    $state.go('approvalTimesheetEmployeeDailyList')
}
$scope.openVacancyList = function(){
  $state.go('approvalsVacancyRequisitionList')

}
$scope.openOfferLetterList=function(){
  $state.go('approvalsOfferGenerationList')
}
$scope.openTrainingRequestList = function(){
  $state.go('approvalsTrainingRequestList')
}
$scope.openStationaryRequestList = function(){
  $state.go('approvalsStationaryRequisitionList')
}
$scope.openGrievanceList = function(){
  $state.go('approvalGrievanceList')
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
	  
    if (getMyHrapiVersionNumber() >= 22){
			
      $scope.isTimesheetAccessible = sessionStorage.getItem('IsTimesheetAccessible')
      $scope.isProjectConfigAccessible = sessionStorage.getItem('IsProjectConfigAccessible')
    }else{
      $scope.isTimesheetAccessible = 'false'
      $scope.isProjectConfigAccessible = 'false'
    }

    if (getMyHrapiVersionNumber() >= 24){
			
      $scope.IsTransactionAccessible = sessionStorage.getItem('IsTransactionAccessible')
      $scope.IsVacancyAccessible = sessionStorage.getItem('IsVacancyAccessible')
      $scope.IsOfferAccessible = sessionStorage.getItem('IsOfferAccessible')
      $scope.IsTrainingRequestAccessible = sessionStorage.getItem('IsTrainingRequestAccessible')
      $scope.IsStationeryRequestAccessible = sessionStorage.getItem('IsStationeryRequestAccessible')
    }else{
      $scope.IsTransactionAccessible = 'false'
      $scope.IsVacancyAccessible = 'false'
      $scope.IsOfferAccessible = 'false'
      $scope.IsTrainingRequestAccessible = 'false'
      $scope.IsStationeryRequestAccessible = 'false'
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
		  
      if($scope.IsVacancyAccessible == "true"){
        if (data.vacancyApproveCount){
          $rootScope.gIntVacancyRequestCount = parseInt(data.vacancyApproveCount.inProcess);
        }else{
          $rootScope.gIntVacancyRequestCount = 0
        }
      }else{
        $rootScope.gIntVacancyRequestCount = 0
        
      }
		  $rootScope.totalRequestCount = $rootScope.totalRequestCount + parseInt($scope.travelCount) + $scope.totalClaimCount 
		  $rootScope.totalRequestCount = $rootScope.totalRequestCount +  $rootScope.gIntVacancyRequestCount
	  }

    //extra counts for transaction vacancy and offer
    getRequisitionApproval()

	}
      //success();
    , function (data) {
      $ionicLoading.hide()
      commonService.getErrorMessage(data);
    });
  }


  
  $scope.openTransactionList = function(){
    //alert("in app menu ")
    $state.go('approvalTransactionList')
  }



  getRequisitionApproval=function(){
    
    var data={};
   // var countServ = new getCountService();
    //countServ.$save(data, function (response) {
      $.ajax({
        url: baseURL + '/api/portal/viewRequisitionApprovalJson.spr',
        data: data,
            type: 'POST',
            dataType: 'json',
            timeout: commonRequestTimeout,
            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
              'Authorization': 'Bearer ' + jwtByHRAPI
              },
            success:function(response){
            requisitionApprovalForm=response;
            var count = 0;
             
            if(requisitionApprovalForm.listLeaveTrackerVO && requisitionApprovalForm.listLeaveTrackerVO[0])
               {
                $rootScope.gIntLeaveRequestCount = parseInt(requisitionApprovalForm.listLeaveTrackerVO[0].inProcess);
               }
            
        //    if(listCompOffTrackerVORights == "Comp Off Application")
        //        {
        //         count += parseInt(requisitionApprovalForm.compOfflistLeaveTrackerVO[0].inProcess);
        //        }
            
            if(requisitionApprovalForm.listTransactionTrackerVO && requisitionApprovalForm.listTransactionTrackerVO[0])
               {
                $rootScope.gIntTransactionRequestCount = parseInt(requisitionApprovalForm.listTransactionTrackerVO[0].inProcess);
                $rootScope.totalRequestCount = $rootScope.totalRequestCount + $rootScope.gIntTransactionRequestCount
               }
            // if(listODTrackerVORights == "OD Application")
            //    {
            //     count += parseInt(requisitionApprovalForm.listODTrackerVO[0].inProcess);
            //    }
            // if(listClaimTrackerVORights == "Claim Form")
            //    {
            //     count +=parseInt(requisitionApprovalForm.listClaimTrackerVO[0].inProcess);
            //    }
            // if(listCtcClaimTrackerVORights == "Claim Form")
            //    {
            //     count +=parseInt(requisitionApprovalForm.listCtcClaimTrackerVO[0].inProcess);
            //    }
            // if(listLtaClaimTrackerVORights == "Claim Form")
            //    {
            //     count +=parseInt(requisitionApprovalForm.listLtaClaimTrackerVO[0].inProcess);
            //    }
            // if(listTravelTrackerVORights == "Travel Application")
            //    {
            //     count +=parseInt(requisitionApprovalForm.listTravelTrackerVO[0].inProcess);
            //    }	
            // if(listMusterTrackerVORights == "My Attendance Record")
            //    {
            //     count +=parseInt(requisitionApprovalForm.listMusterTrackerVO[0].inProcess);
            //    }	
            // if(listShiftChangeTrackerVORights == "Shift Change")
            //    {
            //     count +=parseInt(requisitionApprovalForm.listShiftChangeTrackerVO[0].inProcess);
            //    }	
            // if(listTravelClaimTrackerVORights == "Travel Claim Requisition")
            //    {
            //     count +=parseInt(requisitionApprovalForm.listTravelClaimTrackerVO[0].inProcess);
            //    }
            
            //if(requisitionApprovalForm.listVacancyRequisitionVO[0])
              // {
                //$rootScope.gIntVacancyRequestCount = parseInt(requisitionApprovalForm.listVacancyRequisitionVO[0].inProcess);
               //}

               
            //pendingCount=parseInt(requisitionApprovalForm.listLeaveTrackerVO[0].inProcess)+parseInt(requisitionApprovalForm.listTransactionTrackerVO[0].inProcess)+parseInt(requisitionApprovalForm.listODTrackerVO[0].inProcess)+parseInt(requisitionApprovalForm.listClaimTrackerVO[0].inProcess)+parseInt(requisitionApprovalForm.listTravelTrackerVO[0].inProcess)+parseInt(requisitionApprovalForm.listMusterTrackerVO[0].inProcess)+parseInt($scope.requisitionApprovalForm.listShiftChangeTrackerVO[0].inProcess)+parseInt($scope.requisitionApprovalForm.listTravelClaimTrackerVO[0].inProcess);
//	    	  $scope.$apply();
      $timeout(function () { 
        //document.getElementById("menuIconSection").style.visibility="visible"
    	  $ionicLoading.hide();
      }, 500)  
        
      }, 
      error : function(res){
        $ionicLoading.hide();
        showAlert("Something went wrong while getting data")
        console.log(response.data)
        
        
    }
        });
 //function myError(response) {
//         $ionicLoading.hide();
//         showAlert("Something went wrong while getting data")
//         console.log(response.data)
//           //alert(response)
//       });
}


$timeout(function () {  Initialize() }, 500)  
  
});
