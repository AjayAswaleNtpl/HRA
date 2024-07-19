
mainModule.factory("validDOBService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/ChangePasswordController/validDOB.spr'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("updatetPasswordService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/ChangePasswordController/updatePassword.spr'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("forgotPasswordService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/ChangePasswordController/forgotPassword.spr'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("getLoginCompanyLogo", function ($resource) {
    return $resource((baseURL + '/api/eis/eisPersonal/mobileLoginLogo.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});

mainModule.controller("loginCtrl", function ($scope, $rootScope, $window, commonService, getLoginCompanyLogo, $ionicPopup, $location, $filter, validDOBService, forgotPasswordService, updatetPasswordService, loginCommService, $ionicLoading, $ionicModal) {
	
	
	var firstClickTime = Date.now();
	
	//StatusBar.styleDefault();
    StatusBar.backgroundColorByHexString('#000000');
	StatusBar.show()
    

    $scope.regex = /(?:http(s)?\:\/\/)/i;
    $scope.loginDetails = {};
    $scope.resultObj = {};
    $scope.forgotPassword = {}
    $scope.urlFlag = false;
    $scope.showLink = false;
    $scope.resultObject = {}
    $scope.resultObject.companyId = ''
    if (localStorage.getItem("BaseUrl")) {
        baseURL = localStorage.getItem("BaseUrl");
    }
    $scope.resultObj.BaseUrl = baseURL;
    $scope.resultObj.appVersion = appVersion;
    showAlert = function (title, template) {
        $ionicPopup.alert({
            title: title,
            template: template
        })
    };
    if ($scope.loginDetails.username) {
        $scope.showLink = true;
    }
	
	$scope.eyeClosed = true
    //$scope.loginDetails.username = ""
    //$scope.loginDetails.password = ""
    $scope.onLoad = function () {
		$scope.loginDetails.rememberMeFlag=true;
    }

    if (localStorage.getItem("loginPageLogoImg")) {
		
		if (localStorage.getItem("loginPageLogoImg").length < 15){
			$scope.defaultLognLogo = false;
		}else{
			$scope.loginPageLogoImg = localStorage.getItem("loginPageLogoImg")
			$scope.defaultLognLogo = true;
		}
    }
    else {
        $scope.defaultLognLogo = false;
    }

	
	
	
    $scope.getLoginCompanyLogoOnload = function () {
        $scope.resultObject.companyId = localStorage.getItem('companyId')
        if ($scope.resultObject.companyId != null) {
            //$scope.getLoginCompanyLogo = new getLoginCompanyLogo();
            //$scope.getLoginCompanyLogo.$save($scope.resultObject, function (data) {
                
                $.ajax({
                    url: (baseURL + '/api/eis/eisPersonal/mobileLoginLogo.spr'),
                    data: $scope.resultObject,
                    type: 'POST',
                    async:false,
                    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                    processData: false, // NEEDED, DON'T OMIT THIS
                    headers: {
                        'Authorization': 'Bearer ' + jwtByHRAPI
                     },
                    success:function(data){
    
                if (!data.ImagePath) {
                    $scope.defaultLognLogo = false;
                }
                else {
                    $scope.loginPageLogoImg = data.ImagePath;
                    localStorage.setItem('loginPageLogoImg', $scope.loginPageLogoImg)
                    $scope.defaultLognLogo = true;
                }
                if (data.MSG != null) {
                    $scope.defaultLognLogo = false;
                }
            }, error: function(err) {
                //alert(err.status)
                console.log("ERROR in url ")
            }
        });
            // unction (data) {
            //     $ionicLoading.hide()
            // });
        }
    }
    //$scope.getLoginCompanyLogoOnload();

    $scope.onLoad();
    $scope.showPopup = function () {
        if ($scope.resultObj.BaseUrl == "" || $scope.resultObj.BaseUrl == null || $scope.urlFlag == true) {
            var myPopup = $ionicPopup.show({
                template: '<label>Please enter connection URL<form name="myForm"><input style="background-color:white;border: 1px solid #b3b3b3;" type="text" name="mybox" ng-model="resultObj.BaseUrl" ng-pattern="regex" size="10" cols="100" /><span class="error" style="color:red" ng-show="myForm.mybox.$invalid">Please enter proper URL</span></form></label>',
                title: 'Connection URL',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'}, {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.resultObj.BaseUrl) {
                                e.preventDefault();
                            }
                            else {
                                $window.location = '';
								localStorage.setItem('rememberMeFlag', 0);
								$scope.loginDetails.rememberMeFlag=false;
                                $scope.closeModal();
                                window.plugins.toast.showWithOptions(
                                        {
                                            message: "URL saved successfully",
                                            duration: "long",
                                            position: "center",
                                            addPixelsY: -40
                                        }
                                )
                                
                                baseURL = $scope.resultObj.BaseUrl;
                                return localStorage.setItem("BaseUrl", $scope.resultObj.BaseUrl);
                            }
                        }
                    }
                ]
            });
        }
    }
    $scope.showPopup();
    $scope.validDOB = function () {
        $ionicLoading.show({});
        $scope.forgotPassword.dob = $scope.resultObj.birthDate;
        $scope.forgotPassword.userName = $scope.loginDetails.username;
        if ($scope.forgotPassword.dob != "") {
            $scope.forgotPasswordService = new forgotPasswordService();
            $scope.forgotPasswordService.$save($scope.forgotPassword, function (data) {
				if (!(data.clientResponseMsg=="OK")){
					console.log(data.clientResponseMsg)
					handleClientResponse(data.clientResponseMsg,"forgotPasswordService")
				}	
			
                $scope.forgotPassword.empCode = data.empCode;
                $scope.validDOBService = new validDOBService();
                $scope.validDOBService.$save($scope.forgotPassword, function (data) {
					if (!(data.clientResponseMsg=="OK")){
						console.log(data.clientResponseMsg)
						handleClientResponse(data.clientResponseMsg,"validDOBService")
					}		


                    if (data.isValidDob == "") {
						$ionicLoading.hide();
                        showAlert("", "Please enter proper username")
                        return;
                    }
                    if (data.isValidDob == 'Failed') {
                        $ionicLoading.hide()
                        showAlert("Invalid dob", "Date of birth is invalid")
                    }
                    if (data.isValidDob == 'Success') {
                        $scope.updatetPasswordService = new updatetPasswordService();
                        $scope.updatetPasswordService.$save($scope.forgotPassword, function (data) {
                            $scope.forgotPasswordService = new forgotPasswordService();
                            $scope.forgotPasswordService.$save($scope.forgotPassword, function (data) {
								if (!(data.clientResponseMsg=="OK")){
									console.log(data.clientResponseMsg)
									handleClientResponse(data.clientResponseMsg,"forgotPasswordService")
								}	
								
                                $ionicLoading.hide()
                                $ionicPopup.alert({
                                    title: "Mail sent",
                                    template: "Password is sent to your company email successfully"
                                }).then(function (res) {
                                    $scope.redirect();
                                });
                                $scope.redirect = function () {
                                    $scope.closeModal(1)
                                }
                            }, function (error, data) {
                                showAlert("Mail sent failed", "Mail not send try again")
                                $ionicLoading.hide()
                            });
                        }, function (error, data) {
                            $ionicLoading.hide()
                            showAlert("Try again", "Password not updated try again")
                        });
                    }
                }, function (error, data) {
                    $ionicLoading.hide()
                    showAlert("Invalid dob", "Date of birth is invalid")
                });
            }, function (error, data) {
                $ionicLoading.hide()
                showAlert("Loding failed", "Try again")
            });
        }
        else {
            showAlert("Insert dob", "Date of birth should not be empty")
        }
    }

    $scope.setFromDate = function () {
        var options = {date: new Date(), mode: 'date', titleText: 'From Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                $scope.resultObj.birthDate = $filter('date')(date, 'dd/MM/yyyy');
                //alert($scope.resultObj.birthDate)
                $scope.$apply();
            }
        }, function (error) {
            $scope.resultObj.birthDate = ''
        });
    }
	
		
	
	$scope.tpinput = function () {
		var clickedTime = Date.now();
		if ((clickedTime -firstClickTime)/1000 >0.5){
			var elem = document.getElementById('password')
			if (elem.type=="text"){
				elem.type="password"
				$scope.eyeClosed = true
			}else {
				elem.type="text"
				$scope.eyeClosed = false
			}
		

		firstClickTime = clickedTime
		}
		
		
		
	}
	
    $scope.Login = function () {
    
        if (navigator.connection.type == Connection.NONE) {
            showAlert("Error", "No network connection");
            return;
        }
        if ($scope.loginDetails.username == "" && $scope.loginDetails.password == "") {
            showAlert("", "Enter login credentials");
            return;
        }
        if ($scope.loginDetails.username == "") {
            showAlert("", "Enter username");
            return;
        }
        if ($scope.loginDetails.password == "") {
            showAlert("", "Enter password");
            return;
        }

        if ($scope.resultObj.BaseUrl == "" || $scope.resultObj.BaseUrl == null) {
            $scope.showPopup();
            $scope.resultObj.BaseUrl = '';
            return;
        }
			$ionicLoading.show();
		
		if ($scope.loginDetails.rememberMeFlag==true){
				localStorage.setItem('rememberMeFlag', 1);
		}else
		{
				localStorage.setItem('rememberMeFlag', 0);
		}
			//localStorage.setItem('rememberMeFlag', 0);
        loginCommService.userLogin($scope.loginDetails,
                function () {
                }, function (data) {
                    
            if ((data.status == -1) || (data.status == 0) || (data.status == 404)) {
                $scope.urlFlag = true;
                $scope.showPopup();
                $ionicLoading.hide();
                showAlert("URL error ", "Please enter proper URL. Error: " + data.status);
                return;
            } else {
                if (data.status == 401) {
                    $ionicLoading.hide();
                    showAlert("Login failed", "Incorrect user name or password");
                }
                else if (data.status == 500) {
                    $ionicLoading.hide();
                    showAlert("Error(500)", "Something went wrong, please try again");
                }
				else if (data.status == 403) {
                    $ionicLoading.hide();
                    showAlert("Error(403)", "Something went wrong, please try again");
                }
				else if (data.status === undefined) {
                    $ionicLoading.hide();
					$scope.urlFlag = true;
					$scope.showPopup();
                    showAlert("URL error ", "Please enter proper URL. Error: ");
					return;
                }
                else {
                    $ionicLoading.hide();
                    showAlert("Error("+data.status+")", "Please try again.");
                }
            }
            $ionicLoading.hide();
        });
		    
    };
	
    $scope.setRememberMeFlag = function () {
		
        if ($scope.loginDetails.rememberMeFlag) {
            $scope.loginDetails.rememberMeFlag = false;
        }
        else {
            $scope.loginDetails.rememberMeFlag = true;
        }
		
		
    }

// Modal Code
    $ionicModal.fromTemplateUrl('forgotPassword.html', {
        id: '1', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.oModal1 = modal;
    });
    $scope.openModalCustom = function (index) {
        if (index == 1){
            $scope.oModal1.show();
			$rootScope.helpModalOpened = true
		}
    };
    $scope.closeModal = function (index) {
        if (index == 1){
            $scope.oModal1.hide();
			
		}
    };
    $scope.$on('modal.shown', function (event, modal) {
    });
    $scope.$on('modal.hidden', function (event, modal) {
		$rootScope.helpModalOpened = false
    });
    $scope.$on('$destroy', function () {
        $scope.oModal1.remove();
    });
	
    $scope.showPopup = function () {
		$scope.InputBaseURL=baseURL
            var myPopup = $ionicPopup.show({
                template: '<label>Please enter connection URL<form><input type="text" style="background-color:white;border: 1px solid #b3b3b3;" ng-model="$parent.InputBaseURL" ng-pattern="regex" size="10" cols="100" /><span class="error" style="color:red" ng-show="myForm.mybox.$invalid">Please enter proper URL</span></form></label>',
                title: 'Connection URL',
                scope: $scope,
                buttons: [
                    {text: 'Cancel',
                     onTap: function(e){
						//$state.go('login');
                     }
                    }, {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
							
                            if (!$scope.InputBaseURL) {
                                e.preventDefault();
                            }
                            else {
                                $window.location = '';
								localStorage.setItem('rememberMeFlag', 0);
								$scope.loginDetails.rememberMeFlag=false;
								baseURL = $scope.InputBaseURL;
								$scope.resultObj.BaseUrl = baseURL;
                                localStorage.setItem("BaseUrl", $scope.InputBaseURL);
								
                                $scope.closeModal(1);
                                window.plugins.toast.showWithOptions(
                                        {
                                            message: "URL saved successfully",
                                            duration: "long",
                                            position: "center",
                                            addPixelsY: -40
                                        }
                                )
                                
                                //$state.go('login');
                                //return $scope.InputBaseURL;
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
	
	
	$scope.openPP = function () {
		//$window.location.href='www.google.com'
		//$window.location.href = 'https://netersontech.com/privacy_policy.html';
        $window.location.href = 'https://maverikhcm.com/privacy-policy/';
        
	}
	

	
	
    $scope.changeUrl = function () {
		$('#exampleModal').modal('hide');
		
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
							$scope.loginDetails.rememberMeFlag=false;
							
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
