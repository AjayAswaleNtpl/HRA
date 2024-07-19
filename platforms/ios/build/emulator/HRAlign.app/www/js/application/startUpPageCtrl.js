/*
 1.This controller is used for Connection Settings.
 */

mainModule.controller("startUpPageCtrl", function ($scope, $rootScope, $state, loginCommService, $ionicLoading, $ionicPopup, $window,$timeout) {
    $scope.object = {}
    $scope.regex = /(?:http(s)?\:\/\/)/i;
    $scope.object.BaseURL = baseURL;
	
	/*
	$.ajax({
      url: "https://www.w3.org/TR/PNG/iso_8859-1.txt",
      success: function (data){
            if (data.indexOf("1987") > 0){
				//ok
			}else{
				alert("Please update the app from PlayStore")
				
				$window.location.href = "https://play.google.com/store/apps/details?id=com.neterson.hralign_4_0_0_6&hl=en"
				$timeout(function () {navigator.app.exitApp();},1000)
				
				return
			}
			
		}
		});
		
		*/
    setTimeout(function () {
        $scope.onLoad();
    }, 2500);

    $scope.onLoad = function () {
		
		localStorage.setItem('FirstRunAfterInstall','N')
		
		$rootScope.FirstRunAfterInstall = localStorage.getItem('FirstRunAfterInstall')
		
		$rootScope.app_product_name = app_product_name
		sessionStorage.setItem('showCalendarContextMenu',"YES")
		$rootScope.navHistoryPrevTab = ""
		$rootScope.reqestPageLastTab = ""
		$rootScope.approvePageLastTab = ""
		$rootScope.claimPeriodSelected = ""
	
//////////// latest app checking	
	//this varibale must be N
	gstrVerionCheckAtStoreAndroid = 'N'
   // alert("google")
    //url: 'https://play.google.com/store/apps/details?id=com.neterson.hralign_4_0_0_6&hl=en_IN		',
					
	if (gstrVerionCheckAtStoreAndroid == 'Y'){
		if (device.platform == "Android"){		
			$.ajax({
                    url: 'https://play.google.com/store/apps/details?id=com.neterson.hralign_4_0_0_6&hl=en_IN		',
                    async:false,
					type: 'GET',
					contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
					processData: false, // NEEDED, DON'T OMIT THIS
                    headers: {
                        'Authorization': 'Bearer ' + jwtByHRAPI
                     },
					success : function(result) {
						alert(result);
						if (result.indexOf('HRAlign (4.0.7.5.4.1)') > -1){
							//this is the latest version
							//alert("latest")
							$scope.continueLoading();
						}else{
							$ionicLoading.hide()
							$state.go('getNewAppVersion')
							return
						}
					},
					error : function(err){
						//alert("err" + err.status)
						$scope.continueLoading();
					}
					
				});
			}else{
				$scope.continueLoading();
			}
		/////////version test over		
	}else{
		$scope.continueLoading();
	}
}
	
	$scope.continueLoading = function(){
		if ($rootScope.FirstRunAfterInstall ==null || $rootScope.FirstRunAfterInstall =="Y"){
			//its first run
			localStorage.setItem('FirstRunAfterInstall','N')
			$state.go('intro');
			return;
		}
		if ($rootScope.pushNotiTap == true){
			return;
		}

        //alert("suername "+ localStorage.getItem('userName'))
        if (navigator.connection.type == Connection.NONE) {
            showAlert("Error", "No network connection");
            $state.go('login');
        }
        else if ($scope.object.BaseURL == "" || $scope.object.BaseURL == null) {
            $scope.showPopup();
        }
        else if (localStorage.getItem('rememberMeFlag') == 1 && localStorage.getItem('userName') ) {
			$ionicLoading.show();
            $scope.loginCredentials = {};
            $scope.loginCredentials.username = localStorage.getItem('userName');
            $scope.loginCredentials.password = localStorage.getItem('password');
        
            loginCommService.userLogin($scope.loginCredentials,
                    function () {
                    },
                    function (data) {
                        if ((data.status == -1) || (data.status == 0)) {
                            // baseURL = "";
                            // $scope.object.BaseURL = "";
                            $scope.showPopup();
                            showAlert("URL error ", "Please enter proper URL. " + data.status);
                            $ionicLoading.hide();
//                ionicLoadingService.hideLoading(1);
//                            $state.go('login');
                        } else {
                            if (data.status == 401) {
                                showAlert("Login failed", "Incorrect username or password");
                                $ionicLoading.hide();
                                $state.go('login');
//                    ionicLoadingService.hideLoading(1);
                            }
                            else if (data.status == 500) {
                                showAlert("Error", "Something went wrong, please try again");
                                $ionicLoading.hide();
                                $state.go('login');
//                    ionicLoadingService.hideLoading(1);
                            }
                            else {
                                showAlert("Error", "Please try again.");
                                $ionicLoading.hide();
                                $state.go('login');
//                    ionicLoadingService.hideLoading(1);
                            }
                        }
                        $ionicLoading.hide();
//            ionicLoadingService.hideLoading(1);
                    });
        }
        else {
            $state.go('login');
        }
	}
    $scope.showPopup = function () {
            var myPopup = $ionicPopup.show({
                template: '<label>Please enter connection URL<form name="myForm"><input type="text" name="mybox" ng-model="object.BaseURL" ng-pattern="regex" size="10" cols="100" /><span class="error" style="color:red" ng-show="myForm.mybox.$invalid">Please enter proper URL</span></form></label>',
                title: 'Connection Settings',
                scope: $scope,
                buttons: [
                    {text: 'Cancel',
                     onTap: function(e){
                         $state.go('login');
                     }
                    }, {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.object.BaseURL) {
                                e.preventDefault();
                            }
                            else {
                                $window.location = '';
                                $scope.closeModal();
                                window.plugins.toast.showWithOptions(
                                        {
                                            message: "URL saved successfully",
                                            duration: "long",
                                            position: "center",
                                            addPixelsY: -40
                                        }
                                )
                                baseURL = $scope.object.BaseURL;
                                localStorage.setItem("BaseUrl", $scope.object.BaseURL);
                                $state.go('login');
                                return $scope.object.BaseURL;
                            }
                        }
                    }
                ]
            });
    }
    $scope.closeModal = function (index) {
        if (index == 1)
            $scope.oModal1.hide();
    };
});
