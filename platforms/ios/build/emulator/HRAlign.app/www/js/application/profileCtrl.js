/*
 1.This controller is used to show only the profile related data.
 2.It basically shows Personal-details,Educational-details and Job-details.
 */

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
mainModule.controller('profileCtrl', function ($scope, commonService, $ionicLoading, $filter, getProfileViewMOBService,loginService,updatePasswordFromMobile) {
    $scope.personalDetails = {}
    $scope.jobDetails = {}
    $scope.gender = {}
    $scope.educationDetails = {}

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

    $scope.displayDeptName = 0;
    if (sessionStorage.getItem('displayDeptName') == '"Department"')
        $scope.displayDeptName = 1;
    $scope.photoFileName = sessionStorage.getItem('photoFileName');
	$scope.designation = sessionStorage.getItem('designation');
    $scope.image = sessionStorage.getItem('profilePhoto')
    $scope.ShowNodataFlag = false
    $scope.toggleGroup = function (personalDetails) {
        if ($scope.isGroupShown(personalDetails)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = personalDetails;
        }
    };
    $scope.isGroupShown = function (personalDetails) {
        return $scope.shownGroup === personalDetails;
    };
    $scope.eduGroup = function (educationDetails) {
        if ($scope.isGroupShown(educationDetails)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = educationDetails;
        }
    };
    $scope.iseduShown = function (educationDetails) {
        return $scope.shownGroup === educationDetails;
    };
    $scope.jobGroup = function (jobDetails) {
        if ($scope.isGroupShown(jobDetails)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = jobDetails;
        }
    };
    $scope.isjobShown = function (jobDetails) {
        return $scope.shownGroup === jobDetails;
    };
	$scope.changepassgrp = function (changepass) {
        if ($scope.isGroupShown(changepass)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = changepass;
        }    };
    $scope.isChangePassShown = function (changepass) {
        return $scope.shownGroup === changepass;
    };

	$scope.shownGroup = null;


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
					showAlert("Change Password!","Password changed successfully.")
					$scope.passwordObj.oldp = ""
					$scope.passwordObj.newp = ""
					$scope.passwordObj.confp = ""
					$scope.shownGroup = null;
					localStorage.setItem("password",$scope.loginDetails.newp)
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

    $scope.getProfileOnload = function () {
        $ionicLoading.show({});
        $scope.resultObject = {}
        $scope.resultObject.empCode = sessionStorage.getItem('empCode')
        $scope.resultObject.companyId = sessionStorage.getItem('companyId')
        $scope.resultObject.empIdForARTFRTDetails = sessionStorage.getItem('empId');
        $scope.getProfileViewMOBService = new getProfileViewMOBService();
        $scope.getProfileViewMOBService.$save($scope.resultObject, function (success) {
			if (!(success.clientResponseMsg=="OK")){
				console.log(success.clientResponseMsg)
				handleClientResponse(success.clientResponseMsg,"getProfileViewMOBService")
			}					
			
            $scope.personalDetails = success;
            $scope.gender = $scope.personalDetails.Gender;
            if ($scope.personalDetails.DateOfBirth)
            {
                $scope.personalDetails.DateOfBirth = $filter('date')($scope.personalDetails.DateOfBirth, 'dd/MM/yyyy');
            }
            if (!$scope.personalDetails.QualiInstitute && !$scope.personalDetails.QualiUniversity && !$scope.personalDetails.QualiGrade && !$scope.personalDetails.QualiQualificationPercent && !$scope.personalDetails.QualiSpecialization)
            {
                $scope.ShowNodataFlag = true
            }
            $scope.artName = success.ARTDetails;
            $scope.frtName = success.FRTDetails;
            $scope.dateOfJoining = $filter('date')(new Date(success.dateOfJoining), 'dd/MM/yyyy');
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
    $scope.getProfileOnload();
});