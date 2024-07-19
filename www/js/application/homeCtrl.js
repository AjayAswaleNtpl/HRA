/*
 1.This controller is used to show only the header part of the Home page.
 2.It only shows Emp-name,designation,department,profile-photo.
 */

mainModule.controller("homeCtrl", function ($scope, $state, $rootScope, 
    $timeout,$ionicLoading,homeService) {
	$scope.clockInFloatingButton = function () {
        homeService.getResult("SIGNIN", function (length, data) {
            if (length > 0) {
                $scope.hideCheckIn = '1';
            } else {
                $scope.hideCheckIn = '0';
            }
        }, function (data) {
            $ionicLoading.hide();
        })
    }

    if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.overlaysWebView(false)
        //StatusBar.styleDefault();
        StatusBar.backgroundColorByHexString('#000000');
        StatusBar.hide()
        $timeout(function () {StatusBar.show()},50)
    }
    $scope.clockInFloatingButton();
	$scope.IsClockInAccessible = sessionStorage.getItem('IsClockInAccessible');
	
    sessionStorage.setItem('selectedMonth', null);
    $scope.attendanceDetail = {};
    $scope.attendanceDetail.SelfService = true;
    $scope.attendanceDetail.HomeDashBoard = false;
    $scope.attendanceDetail.photoFileName = sessionStorage.getItem('photoFileName')
    $scope.attendanceDetail.image1 = sessionStorage.getItem('profilePhoto');
    $scope.attendanceDetail.name = sessionStorage.getItem('empName');
    $scope.attendanceDetail.designation = sessionStorage.getItem('designation');
	
    if (sessionStorage.getItem('department') && (sessionStorage.getItem('displayDeptName') == '"Department"'))
        $scope.attendanceDetail.department = sessionStorage.getItem('department')
	
    if ($rootScope.HomeDashBoard)
        $scope.attendanceDetail.HomeDashBoard = true;
	
	
	if (sessionStorage.getItem('isGroupMasterReportee') == true)
		$scope.attendanceDetail.HomeDashBoard = true;
	
    $ionicLoading.hide();
	
		
})
