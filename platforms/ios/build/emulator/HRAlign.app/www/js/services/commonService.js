mainModule.factory("commonService", function ($rootScope, $ionicPopup, $state) {

    var object = {};
    var autoRetryCounter = '';
    object.getErrorMessage = function (data, navigateToPage) {
		if($state.current.name=="login")
		{
			//instead of general error page we will show toast.
			// as general error page has button to go home. As error is on
			// login page we should not send uer to home page.
			window.plugins.toast.showWithOptions(
                            {
                                message: "ERROR CODE:"+ data.status + "\nSeems some issues at the moment, Please try after some time.",
                                duration: "long",
                                position: "center",
                                addPixelsY: -40
                            }
                    )
					return;
					
		}
        if ((data.status == -1) || (data.status == 0)) {
            if (navigateToPage) {
                sessionStorage.setItem('currentstatename', navigateToPage)
            }
            else {
                if ($state.current.name != 'RetryPage') {
                    sessionStorage.setItem('currentstatename', $state.current.name)
                }
            }
            if (autoRetryCounter == 0 && navigator.connection.type != Connection.NONE) {
                if (sessionStorage.getItem('currentstatename') == 'app.myTeamDetail') {
                    autoRetryCounter = 0
                    sessionStorage.setItem('autoRetryCounter', autoRetryCounter)
                    $state.go('RetryPage')
                }
                else {
                    window.plugins.toast.showWithOptions(
                            {
                                message: "Seems some network change, reloading it...",
                                duration: "long",
                                position: "center",
                                addPixelsY: -40
                            }
                    )
                    autoRetryCounter = 1
                    sessionStorage.setItem('autoRetryCounter', autoRetryCounter)
                    $state.go(sessionStorage.getItem('currentstatename'));
                }
            }
            else {
                autoRetryCounter = 0
                sessionStorage.setItem('autoRetryCounter', autoRetryCounter)
                $state.go('RetryPage')
            }

        }
        else if (data.status == 401) {
            //showAlert("Session time-out", "Please login again");
            $rootScope.logout(1);
        }
        else if (data.status == 500) {
            showAlert("ERROR", "Something went wrong, please try again");
        }
        else {
            if ($state.current.name != 'RetryPage') {
                sessionStorage.setItem('currentstatename', $state.current.name)
            }
            $state.go('RetryPage')
        }
    }
    return object;
});
