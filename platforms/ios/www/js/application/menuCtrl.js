/*
 1.This controller is used to show side menu icons with data.
 2.Side menu's particular tab is shown/hide as per access given.
 */
mainModule.factory("getDashboardCompanyLogo", function ($resource) {
    return $resource((baseURL + '/api/eis/eisPersonal/mobileDashboardLogo.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});

mainModule.controller("menuCtrl", function ($scope, commonService, $rootScope, $state, getDashboardCompanyLogo, $ionicLoading) {
	
  //   $scope.IsShiftChangeAccessible = true;
     $scope.IsLeaveAccessible = sessionStorage.getItem('IsLeaveAccessible');
     $scope.IsODAccessible = sessionStorage.getItem('IsODAccessible');
     $scope.IsRegularizationAccessible = sessionStorage.getItem('IsRegularizationAccessible');
     $scope.IsShiftChangeAccessible = sessionStorage.getItem('IsShiftChangeAccessible');

     $scope.tenantId =  sessionStorage.getItem('tenantId')
     $scope.IsSettingConfiguration = sessionStorage.getItem('IsSettingConfiguration')
     
     

	 
	 if (getMyHrapiVersionNumber() >=18){
		$scope.IsTravelAccessible = sessionStorage.getItem('IsTravelAccessible');
		$scope.IsClaimAccessible = sessionStorage.getItem('IsClaimAccessible');
		$scope.IsExpenseClaimAccessible = sessionStorage.getItem('IsExpenseClaimAccessible'); //for ctc nonctc and lta
	}else{
		$scope.IsTravelAccessible = 'false'
		$scope.IsClaimAccessible = 'false'
		$scope.IsExpenseClaimAccessible = 'false'
	}
     $scope.IsPayslipAccessible = sessionStorage.getItem('IsPayslipAccessible');
     $scope.IsClockInAccessible = sessionStorage.getItem('IsClockInAccessible');
	 
	 if ($rootScope.myAppVersion>=20){
		$scope.myRemunerationFeature='true'
	}else{
		$scope.myRemunerationFeature='false'
	}
	 
    if ($rootScope.myAppVersion>=35){
       if (GeoTrackingFeatureEnabledForClient =="true"){
            $scope.geoTrackReport = "true"
         }
    }
  //scope.IsClaimAccessible = sessionStorage.getItem('IsClaimAccessible');

  /*$scope.IsShiftChangeAccessible = 'true';
    $scope.IsLeaveAccessible = 'true';
    $scope.IsODAccessible = 'true';
    $scope.IsRegularizationAccessible = 'true';
    $scope.IsShiftChangeAccessible = 'true';
    $scope.IsPayslipAccessible = 'true';
    $scope.IsClockInAccessible = 'true';
	$scope.IsTravelAccessible = 'true';
	$scope.IsClaimAccessible = 'true';
	*/


    console.log("IsClockInAccessible:",$scope.IsClockInAccessible);
    $scope.IsPushNotificationsAccessible = sessionStorage.getItem('IsPushNotificationsAccessible');
    $scope.resultobj = {}
    $scope.departmentToHide=false;

    $scope.isARTorFRT = sessionStorage.getItem('IsARTorFRT');
    $scope.isGroupMasterReportee = sessionStorage.getItem('isGroupMasterReportee');
    $scope.isPanelMember = sessionStorage.getItem('isPanelMember');
	console.log("isARTorFRT:",$scope.isARTorFRT);
	console.log("isGroupMasterReportee:",$scope.isGroupMasterReportee);

	if ( getMyHrapiVersionNumber() <= 11){

			$scope.IsTravelAccessible = 'false'
			$scope.IsClaimAccessible = 'false'
	}


	// $scope.IsTravelAccessible = 'true'
  // $scope.IsClaimAccessible ='true'
  // $scope.IsLeaveAccessible = 'true'
  // $scope.IsODAccessible = 'true'
  // $scope.IsRegularizationAccessible = 'true'
  // $scope.IsShiftChangeAccessible = 'true'





    $scope.hrefApprovalNew = '';
    if ($scope.IsLeaveAccessible == 'true') {
        $scope.hrefApprovalNew = "#/app/MyApprovalsNew/leaveApprovalsList";
    }
    else if ($scope.IsODAccessible == 'true') {
        $scope.hrefApprovalNew = "#/app/MyApprovalsNew/ODApprovalsList";
    }
    else if ($scope.IsRegularizationAccessible == 'true')
    {
        $scope.hrefApprovalNew = "#/app/MyApprovalsNew/attendanceApprovalsList";
    }
    else if ($scope.IsShiftChangeAccessible == 'true')
    {
        $scope.hrefApprovalNew = "#/app/MyApprovalsNew/shiftChangeApprovalsList";
    }
    else {
        $scope.hrefApprovalNew = "#/app/MyApprovalsNew";
    }
    $scope.reDirectToInboxPage = function ()
    {
        //$state.go('app.Inbox')
		$rootScope.viewNotifications=true;
		$state.go('app.NotiInbox')
    }
    $scope.hrefRequestNew = '';
    if ($scope.IsLeaveAccessible == 'true') {
        $scope.hrefRequestNew = "#/app/RequestListNew/leaveReqList";
    }
    else if ($scope.IsODAccessible == 'true') {
        $scope.hrefRequestNew = "#/app/RequestListNew/ODReqList";
    }
    else if ($scope.IsRegularizationAccessible == 'true')
    {
        $scope.hrefRequestNew = "#/app/RequestListNew/attendanceReqList";
    }
    else if ($scope.IsShiftChangeAccessible == 'true')
    {
        $scope.hrefRequestNew = "#/app/RequestListNew/shiftChangeReqList";
    }
    else {
        $scope.hrefRequestNew = "#/app/RequestListNew";
    }

    $scope.goToHomeDashboardAndSelfService = function () {

		if ($rootScope.HomeDashBoard == false)
		{
			$state.go('app.home.selfService')
		}else{
			$state.go('app.home.dashboard')
		}
		/*$scope.IsARTorFRT = sessionStorage.getItem('IsARTorFRT')
        if ($scope.IsARTorFRT == 'true') {
            $state.go('app.home.dashboard')
        }
        else {
            $state.go('app.home.selfService')
        }*/
    }

    $scope.getCompanyLogoOnload = function () {
        $scope.resultObject = {}
        $scope.resultObject.companyId = sessionStorage.getItem('companyId')
        $scope.getDashboardCompanyLogo = new getDashboardCompanyLogo();
        $scope.getDashboardCompanyLogo.$save($scope.resultObject, function (data) {
            if (data.ImagePath) {
                $scope.companylogo = data.ImagePath;
                $rootScope.defaultCompanyLogo = true;
            }
            else {
                $rootScope.defaultCompanyLogo = false;
            }

            if (data.MSG != null) {
                $rootScope.defaultCompanyLogo = false;
            }
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
    $scope.getCompanyLogoOnload();

    $scope.init = function () {
        $scope.resultobj.empCode = sessionStorage.getItem('empCode');
        $scope.resultobj.empName = sessionStorage.getItem('empName');
        $scope.resultobj.designation = sessionStorage.getItem('designation');
//        $scope.resultobj.department = sessionStorage.getItem('department');
        if (sessionStorage.getItem('department') && (sessionStorage.getItem('displayDeptName') == '"Department"')) {
            $scope.resultobj.department = sessionStorage.getItem('department');
        }
        $scope.resultobj.imageUrl = sessionStorage.getItem('profilePhoto');
        $scope.resultobj.photoFileName = sessionStorage.getItem('photoFileName');
    };

    if (sessionStorage.getItem('OD') === "undefined" && sessionStorage.getItem('AbsentFullDay') === "undefined" && sessionStorage.getItem('Leave') === "undefined" && sessionStorage.getItem('WeeklyOff') === "undefined" && sessionStorage.getItem('Holiday') === "undefined") {

        $scope.requestTag = false;
    }
    else {

        $scope.requestTag = true;
    }
    $scope.init();
});
