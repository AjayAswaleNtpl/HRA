
mainModule.controller('uninstallOldAppVersionCtrl', function ($scope, $window,$rootScope,$timeout) {
    $rootScope.navHistoryPrevPage = "UNINSTALL_OLD_APP"
	var old_version_data = sessionStorage.getItem("old_version_data")
    
    $scope.uninstallApp = function () {
        if (sessionStorage.getItem("old_version_build_url")=="UNPUBLISHED"){
               showAlert("Old version present","Please manually uninstall old version of HRAlign App") 
        }else{
            $window.location.href = sessionStorage.getItem("old_version_build_url")
			
        }
		
    }

    $scope.extiFromApp = function () {
        navigator.app.exitApp();
    }
});
