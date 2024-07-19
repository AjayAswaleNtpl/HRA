
mainModule.controller('getNewAppVersionCtrl', function ($scope, $window,$rootScope,$timeout,$ionicLoading) {
    $rootScope.navHistoryPrevPage = "GET_NEW_APP_PAGE"
	$scope.NewAppVersion = "" // sessionStorage.getItem("NEWAPPVER")
	$scope.CurrAppVersion =appVersion
	$scope.CurrAppVersion = ""
	    $ionicLoading.hide()
		
    $scope.getNewApp = function () {
		
		var storeUrl = "https://play.google.com/store/apps/details?id=com.neterson.hralign_4_0_0_6&hl=en_IN"
			$window.location.href = storeUrl
        /*var storeUrl = sessionStorage.getItem("NEWAPPURL")    
		if (storeUrl.indexOf("UNPUBLISHED") ==-1)
		{
			var storeUrl = "https://play.google.com/store/apps/details?id=com.neterson.hralign_4_0_0_6&hl=en_IN"
			$window.location.href = storeUrl
		}
		else{
			showAlert("New version is not yet published. Please contact admin for support.")
		}
		*/
		}

    $scope.extiFromApp = function () {
        navigator.app.exitApp();
    }
});
