/*
 1.This controller is used to set theme all around the application.
 */

mainModule.controller('settingCtrl', function ($scope, $window, $rootScope, $ionicPopup, $ionicLoading) {
    $scope.resultObj = {}
    $scope.regex = /(?:http(s)?\:\/\/)/i;
    if (localStorage.getItem("BaseUrl")) {
        $scope.baseURL = localStorage.getItem("BaseUrl");
    }

    $scope.appVersion = sessionStorage.getItem('appVersion')
    $scope.dbVersion = sessionStorage.getItem('dbVersion')

    $scope.resultObj.BaseUrl = $scope.baseURL;
    $scope.resultObj.appVersion = appVersion

    $scope.abc = $scope.resultObj.BaseUrl

	
	if (localStorage.getItem("showOverlayHint")==null){
		localStorage.setItem("showOverlayHint","true");
	}
	$scope.showOverlayHint = localStorage.getItem("showOverlayHint");
	if ($scope.showOverlayHint == "true"){
			$scope.toggleHintValue  = true	
	}else{
		$scope.toggleHintValue =false
	}

	
    $rootScope.changeTheme = function (theme) {
        $scope.showConfirm = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Change Theme',
                template: 'Change in theme will re-start. Go ahead?'
            });
            confirmPopup.then(function (res) {
                if (res)
                {
                    $ionicLoading.show({
                    });
                    $window.localStorage.theme = "" + theme;
                    $window.location = '';
                }
            });
        };
        $scope.showConfirm();
    }
	
	$scope.toggleChange = function(){
		
		$scope.toggleHintValue = !($scope.toggleHintValue)
		
		if ($scope.toggleHintValue){
			localStorage.setItem("showOverlayHint","true")
			$rootScope.loggedInNew = 'Y'
		}else{
			localStorage.setItem("showOverlayHint","false")
		}
		
	}
	
	
    $scope.changeUrl = function () {
		$scope.urlInput = $scope.resultObj.BaseUrl
        var myPopup = $ionicPopup.show({
            template: '<label>Please enter connection URL<form name="myForm"><input style="background-color:white;border: 1px solid #b3b3b3;" type="text" name="mybox" ng-model="$parent.urlInput" ng-pattern="regex" size="10" cols="100" /><span class="error" style="color:red" ng-show="myForm.mybox.$invalid">Please enter proper URL</span></form></label>',
            title: 'Connection URL',
            scope: $scope,
            buttons: [
                {text: 'Cancel'}, {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.urlInput) {
                            e.preventDefault();
                        }
                        else {
							$scope.resultObj.BaseUrl = $scope.urlInput
                            if ($scope.abc === $scope.resultObj.BaseUrl) {
                                $ionicLoading.hide({});
                                return;
                            }
                            $window.location = '';
							localStorage.setItem('rememberMeFlag', 0);
                            window.plugins.toast.showWithOptions(
                                    {
                                        message: "URL saved successfully",
                                        duration: "long",
                                        position: "center",
                                        addPixelsY: -40
                                    }
                            )
                            $scope.baseURL = $scope.resultObj.BaseUrl;
                            return localStorage.setItem("BaseUrl", $scope.resultObj.BaseUrl);
                        }
                    }
                }
            ]
        });
    }	
});