 mainModule.factory("getProfileViewMOBService", function ($resource) {
    return $resource((baseURL + '/api/eis/eisPersonal/viewEisPersonalMobile.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("loginService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/j_spring_security_check'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);

    mainModule.factory("updatePasswordFromMobile", function ($resource) {
        return $resource((baseURL + '/api/ChangePasswordController/updatePasswordFromMobile.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
        headers: {
            'Authorization': 'Bearer ' + jwtByHRAPI
         }}}, {});
    });

    
mainModule.controller('changePasswordCtrl', function ($scope,$rootScope, commonService, $ionicHistory, $rootScope, $ionicPopup, getFindWorkFlowService, getSetService, getSelfLeaveService, getValidateLeaveService, $state, $http, $q, $filter, $ionicLoading, getBalanceLeaveCountService, getLeaveMasterService,
updatePasswordFromMobile,loginService) {
	$rootScope.navHistoryPrevPage="requestLeaveList"

	$scope.loginDetails = {}
	$scope.passwordObj = {};
	$scope.passwordObj.oldp  =""
	$scope.passwordObj.newp  =""
	$scope.passwordObj.confp =""
	
	$scope.eyeClosedOP = true
	$scope.eyeClosedNP = true
	$scope.eyeClosedCP = true
	var firstClickTimeOP = Date.now();
	var firstClickTimeNP = Date.now();
	var firstClickTimeCP = Date.now();


    
	$scope.opInput = function () {
		
		var clickedTime = Date.now();
		if ((clickedTime - firstClickTimeOP)/1000 > 0.5){
			var elem = document.getElementById('txtoldp')
			
			if (elem.type=="text"){
				elem.type="password"
				$scope.eyeClosedOP = true
			}else {
				elem.type="text"
				$scope.eyeClosedOP = false
			}
		firstClickTimeOP = clickedTime
		}
		
	}
	
	
	$scope.npInput = function () {
		var clickedTime = Date.now();
		if ((clickedTime - firstClickTimeNP)/1000 > 0.5){
			var elem = document.getElementById('txtnewp')
			
			if (elem.type=="text"){
				elem.type="password"
				$scope.eyeClosedNP = true
			}else {
				elem.type="text"
				$scope.eyeClosedNP = false
			}
		firstClickTimeNP = clickedTime
		}
		
	}	

	
	$scope.cpInput = function () {
		var clickedTime = Date.now();
		if ((clickedTime - firstClickTimeCP)/1000 > 0.5){
			var elem = document.getElementById('txtconfp')
			
			if (elem.type=="text"){
				elem.type="password"
				$scope.eyeClosedCP = true
			}else {
				elem.type="text"
				$scope.eyeClosedCP = false
			}
		firstClickTimeCP = clickedTime
		}
		
	}	


    	
	$scope.changePasswordNow = function(){
		
		//$scope.$apply();
		
		if ($scope.passwordObj.oldp =="" || $scope.passwordObj.newp =="" ||$scope.passwordObj.confp =="" )
		{
			showAlert("All fields are mandatory\n")
			return;
		}
		if (!($scope.passwordObj.confp == $scope.passwordObj.newp  ))
		{
			showAlert("New password and confirm password are not same.")
			return;
		}

	  re = /[0-9]/g;
	  
      if(!re.test($scope.passwordObj.newp)) {
        showAlert(" Password must contain at least one number (0-9)!");
        
        return ;
      }
      re = /[a-z]/g;
      if(!re.test($scope.passwordObj.newp)) {
        showAlert(" Password must contain at least one lowercase letter (a-z)!");
        
        return ;
      }
      re = /[A-Z]/g;
      if(!re.test($scope.passwordObj.newp)) {
        showAlert(" Password must contain at least one uppercase letter (A-Z)!");
        return ;
      }		

	  re = /[!@#$%^&*()_\-+={}[]|;:"<>.,\/?]/g;
      if(!re.test($scope.passwordObj.newp)) {
        showAlert(" Password must contain at least one Special charaters (!@#$%^&*()_-+={}[]|;:\"<>.,/?)");
        return ;
      }			  
	  
		$ionicLoading.show();
		$scope.loginDetails.password = $scope.passwordObj.oldp
		$scope.loginDetails.newp = $scope.passwordObj.newp;
		$scope.loginDetails.username = localStorage.getItem("userName")
		
		var LoginService = new loginService();
        LoginService.$save($scope.loginDetails, function (data) {
				
			// old password is correct, now update password
				var UpdatePasswordFromMobile = new updatePasswordFromMobile();
				UpdatePasswordFromMobile.$save($scope.loginDetails, function (success) {
					showAlert("Change Password!","Password changed successfully, Please re-login .")
                    $state.go("login")
					$scope.passwordObj.oldp = ""
					$scope.passwordObj.newp = ""
					$scope.passwordObj.confp = ""
					$scope.shownGroup = null;
					localStorage.setItem("password",$scope.loginDetails.newp)
                    //navigator.app.exitApp();
                return;
                    return;
				}, function (success) {
					showAlert(success)
					$ionicLoading.hide();
				});
				$ionicLoading.hide();
        }, function (data) {
			if(data.status="401"){
				showAlert("Change Password!","Old password is incorrect.")
			}else{
				showAlert("Change Password!",data.data)
			}
			$ionicLoading.hide();
        });
			
}
  $scope.redirectOnBack = function () {
		$ionicNavBarDelegate.back();
        //$scope.resultObj.check = "Leave";
        //getSetService.set($scope.resultObj);
         
    }

    $scope.exitApp = function(){
        navigator.app.exitApp();
    }
    
});
