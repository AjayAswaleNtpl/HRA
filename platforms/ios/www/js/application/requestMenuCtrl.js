/*
 1.This controller is used to Approve / Reject for Leave,Shift,Attendance,OD.
 2.Sent for cancellation requests are also Approved / Reject for Leave,Shift,Attendance,OD.
 3.Detailed view can be seen while opening modal by clicking on the list.
 */
mainModule.factory("viewRequisitionApprovalService", ['$resource', function ($resource) {
	return $resource((baseURL + '/api/attendanceReportApi/viewRequisitionApproval.spr'), {}, { 'save': { method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 } } }, {});
  }]);

mainModule.controller('requestMenuCtrl', function ($scope,$rootScope,$timeout,$state,$ionicLoading,viewRequisitionApprovalService) {

	console.log("HRAPI:"+ getMyHrapiVersionNumber())
	
 
 $rootScope.navHistoryCurrPage = "requisition"
 if ($rootScope.HomeDashBoard){
	$rootScope.navHistoryPrevPage = "dashboard"
  }else{
	$rootScope.navHistoryPrevPage = "selfservices"
  }


  if (GeoTrackingEnabledForUser == "true" && GeoTrackingFeatureEnabledForClient =="true"){
	//enableGeoTrackingInBackground()
	}

	
function Initialize(){
	$scope.getRequestCounts();
}
$scope.openLeavePage=function(){
	$state.go('requestLeaveList')
}
$scope.openODPage = function(){
	$state.go('requestODList')
}
$scope.openAttendancePage = function(){
	$state.go('requestRegularizationList')
}
$scope.openShiftChangePage = function(){
	$state.go('requestShiftChangeList')
}
$scope.openTravelPage = function(){
	$state.go('requestTravelApplicationID')
}
$scope.openClaimPage = function(){
	$state.go('requestClaimList')
}
$scope.openTimesheetPage = function(){
	$state.go('requestTimesheetEmployeeDailyList')
}
$scope.openInvestmentList = function(){
	$rootScope.fromWhichPage = "first";
	$state.go('requestInvestmentList')
}
$scope.openTransactionList = function(){
	$state.go('requestTransactionList')
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
		$scope.isShiftChangeAccessible = 'true'
        $scope.shiftChangeInProcess = data.listShiftObj.inProcess
        $scope.shiftChangeInProcessApproval = data.approvalShiftObj.inProcess
      } else {
		$scope.isShiftChangeAccessible = 'false'  
        $scope.shiftChangeInProcess = '0';
        $scope.shiftChangeInProcessApproval = '0';
      }
      if (sessionStorage.getItem('IsLeaveAccessible') == 'true') {
		$scope.isLeaveAccessible = 'true'
        $scope.approvalLeave = data.approvalLeave.inProcess;
        $scope.leaveInprocessCount = data.leaveApllication.totalInProcess
      } else {
        $scope.approvalLeave = '0';
        $scope.leaveInprocessCount = '0';
      }
      if (sessionStorage.getItem('IsODAccessible') == 'true') {
		$scope.isODAccessible = 'true'
        $scope.approvalOdApplication = data.approvalOdApplication.inProcess;
        $scope.odprocessInprocess = data.odApplication.inProcess
      } else {
        $scope.approvalOdApplication = '0';
        $scope.odprocessInprocess = '0';
      }
      if (sessionStorage.getItem('IsRegularizationAccessible') == 'true') {
		$scope.isRegularizationAccessible = 'true'
        $scope.approvalAttendanceApplication = data.approvalAttendanceApplication.inProcess;
        $scope.attendanceInprocessCount = data.attendanceRegularization.inProcess
      } else {
		$scope.isRegularizationAccessible = 'false'
        $scope.approvalAttendanceApplication = '0';
        $scope.attendanceInprocessCount = '0';
      }
	  
	  ////// new modules
	  			//////// new modules
			if (getMyHrapiVersionNumber() >= 18){
				if (sessionStorage.getItem('IsTravelAccessible') == 'true')
				{
					$scope.isTravelAccessible = 'true'
					$scope.travelInInProcess = data.listTravel.inProcess
					$scope.travelInProcessApproval = data.approvalTravel.inProcess
				} else{
					$scope.isTravelAccessible = 'false'
					$scope.travelInInProcess = '0';
					$scope.travelInProcessApproval = '0';
				}
				if (sessionStorage.getItem('IsClaimAccessible') == 'true')
				{
					$scope.isClaimAccessible = 'true'
					$scope.travelClaimInProcess = data.listTravelClaim.inProcess
					$scope.travelClaimInProcessApproval = data.approvalTravelClaim.inProcess
				} else
				{
					$scope.isClaimAccessible = 'false'
					$scope.travelClaimInProcess = '0';
					$scope.travelClaimInProcessApproval = '0';
				}
				//expense claim
				if (sessionStorage.getItem('IsExpenseClaimAccessible') == 'true')
				{
					$scope.isExpenseClaimAccessible = 'true'
					$scope.ctcInProcess = data.listClaimCTC.inProcess
					$scope.ctcInProcessApproval = data.approvalClaimCTC.inProcess
					
					$scope.nonCtcInProcess = data.listClaimNONCTC.inProcess
					$scope.nonCtcInProcessApproval = data.approvalClaimNONCTC.inProcess
					
					$scope.ltaInProcess = data.listClaimLTA.inProcess
					$scope.ltaInProcessApproval = data.approvalClaimLTA.inProcess
					
				} else{
					$scope.isExpenseClaimAccessible = 'false'
					$scope.ctcInProcess = '0';
					$scope.ctcInProcessApproval = '0';
					
					$scope.nonCtcInProcess = '0';
					$scope.nonCtcInProcessApproval = '0';
					
					$scope.ltaInProcess = '0';
					$scope.ltaInProcessApproval = '0';
				}
            
			}
			
			if (getMyHrapiVersionNumber() >= 22){
			
				$scope.isTimesheetAccessible = sessionStorage.getItem('IsTimesheetAccessible')
				$scope.isProjectConfigAccessible = sessionStorage.getItem('IsProjectConfigAccessible')
			}
			if (getMyHrapiVersionNumber() >= 23){
			
				$scope.isInvestmentDeclaration = sessionStorage.getItem('IsInvestmentDeclaration')
			}
			if (getMyHrapiVersionNumber() >= 24){
			
				
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
  
			  if (getMyHrapiVersionNumber() >= 25){
			  	$scope.IsTransactionAccessible = sessionStorage.getItem('IsTransactionAccessible')
				$scope.transactionRequests = data.approvaTransaction.inProcess
			  }else{
				$scope.IsTransactionAccessible = 'false'
				$scope.transactionRequests = 0
			  }

			if (getMyHrapiVersionNumber() >= 26){
				$scope.IsGrievanceAccessible = sessionStorage.getItem('IsGrievanceAccessible')
			}else{
			  $scope.IsGrievanceAccessible = 'false'
			}

			if (getMyHrapiVersionNumber() >= 27){
				$scope.IsExitInterviewAccessible = sessionStorage.getItem('IsExitInterviewAccessible')
			}else{
			  $scope.IsExitInterviewAccessible = 'false'
			}
			  

			if (getMyHrapiVersionNumber() >= 30){
				$scope.IsPerfDiary = sessionStorage.getItem('IsGrievanceAccessible')
				$scope.perfDiaryFeature = 'true'
			}else{
				$scope.IsPerfDiary = 'false'
				$scope.perfDiaryFeature = 'false'
			}

			$scope.IsPerfDiary = "true"
			$scope.perfDiaryFeature = "true"
      sessionStorage.setItem('LeaveRequests', $scope.leaveInprocessCount);
      sessionStorage.setItem('ODRequests', $scope.odprocessInprocess);
      sessionStorage.setItem('AttRegRequests', $scope.attendanceInprocessCount);
      sessionStorage.setItem('SCRequests', $scope.shiftChangeInProcessApproval);

	  
	  $scope.LeaveRequests = sessionStorage.getItem('LeaveRequests');
      $scope.ODRequests = sessionStorage.getItem('ODRequests');
      $scope.AttRegRequests = sessionStorage.getItem('AttRegRequests');
      $scope.SCRequests = sessionStorage.getItem('SCRequests');
	
	  
	  $rootScope.totalRequistionCountForMenu = parseInt($scope.LeaveRequests) + parseInt($scope.ODRequests) + parseInt($scope.AttRegRequests)
	  + parseInt($scope.SCRequests) + parseInt($scope.transactionRequests)
	  
	  
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
	  $ionicLoading.hide();
	  
	},
      
	  
      
     function (data) {
      autoRetryCounter = 0
      $ionicLoading.hide()
      commonService.getErrorMessage(data, "app.home.dashboard");
    });
}
 

$scope.openProjectConfigList = function(){
	
	//$state.go('projectConfigApplication')
	$state.go('projectConfigList')
}

$scope.openGrievanceList = function(){
	
	//$state.go('projectConfigApplication')
	$state.go('requestGrievanceList')
}
$scope.openExitInterviewPage = function(){
	
	//$state.go('projectConfigApplication')
	$state.go('showExitInterview')
}

$scope.openTrainingRequestList = function(){

	$state.go('requestTrainingRequestList')
  }

  $scope.openPerfDiaryPage = function(){

	$state.go('perfDiaryCtrl')
  }

$timeout(function () {  Initialize() }, 500) 

});
