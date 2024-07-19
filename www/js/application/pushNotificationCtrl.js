/*
 1.This controller is used to send push-notifications.
 2.Departments list has been get through Api.
 */

mainModule.factory("getDepartmentsService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/securityUsers/getDepartments.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("savePushNotfMsgService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/securityUsers/savePushNotfMsg.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.controller('pushNotificationCtrl', function ($scope, commonService, $ionicPopup, $ionicLoading, getDepartmentsService, savePushNotfMsgService) {
    var statusOfCheckBox = false
    $scope.departments = {}
    $scope.selectDepartmentList = []
    $scope.sendNotificationObj = {}
    $scope.sendNotificationObj.title = ""
    $scope.sendNotificationObj.message = ""

    $scope.devList = [
        {text: "HTML5", checked: true},
        {text: "CSS3", checked: false},
        {text: "JavaScript", checked: false}
    ];
    $scope.onLoadDepartmentList = function () {
        $ionicLoading.show({});
        $scope.reqDepartmentObj = {}
        $scope.reqDepartmentObj.companyId = sessionStorage.getItem('companyId')
        $scope.getDepartmentsService = new getDepartmentsService();
        $scope.getDepartmentsService.$save($scope.reqDepartmentObj, function (data) {
			if(data.departments===undefined){
				//do nothing
			}else{
				$scope.departments = data.departments
			}
            $ionicLoading.show({});
            $scope.resetAll();
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
    $scope.onLoadDepartmentList();
    $scope.resetAll = function () {
        for (var i = 0; i < $scope.departments.length; i++) {
            $scope.departments[i].checked = false;
        }
    }
    $scope.selectAll = function () {
        if (statusOfCheckBox == false) {
            statusOfCheckBox = true
        } else {
            statusOfCheckBox = false
        }
        $scope.setAll(statusOfCheckBox);
        $scope.selectAllChecked = statusOfCheckBox;
        $scope.sendNotificationButtonState();
    }
    $scope.setAll = function (state) {
        for (var i = 0; i < $scope.departments.length; i++) {
            $scope.departments[i].checked = state;
        }
    }

//    $scope.deSetAll = function (state) {
//        for (var i = 0; i < $scope.departments.length; i++) {
//            $scope.departments[i].checked = false;
//        }
//        $scope.selectAllChecked = false;
//        statusOfCheckBox = false;
//    }

    $scope.sendNotificationButtonState = function () {
        $scope.sendNotificationButtonActive = true
        for (var i = 0; i < $scope.departments.length; i++) {
            if ($scope.departments[i].checked == true) {
                $scope.sendNotificationButtonActive = false
            }
        }
    }
    $scope.sencPushNotification = function () {
        $scope.selectDepartmentList = []
        for (var i = 0; i < $scope.departments.length; i++) {
            if ($scope.departments[i].checked == true) {
                $scope.selectDepartmentList.push($scope.departments[i].id)
            }
        }

        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure',
            template: 'Do you want to send?', //Message
        });
        confirmPopup.then(function (res) {
            if (res) {
                $scope.sendNotificationObj.deptIds = $scope.selectDepartmentList
                //$ionicLoading.show();
                $scope.savePushNotfMsgService = new savePushNotfMsgService();
                $scope.savePushNotfMsgService.$save($scope.sendNotificationObj, function (data) {
					
                    $ionicLoading.hide()
					if (data.msg =="Not Sent"){
						showAlert("Push notification", "Could not sent")
					}else{
						//showAlert("Push notification",data.msg);
						//showAlert("Push notification", "Sent Successfully")
					}
                    
                    //$scope.sendNotificationObj.title = ''
                    //$scope.sendNotificationObj.message = ''
                    // $scope.deSetAll();
                    //statusOfCheckBox = true
                    //$scope.selectAll();
                }, function (data) {
                    //autoRetryCounter = 0
                    //$ionicLoading.hide()
                    //commonService.getErrorMessage(data);
                });
				showAlert("Push notification", "Notifications sent for processing successfully.")
				statusOfCheckBox = true
				$scope.sendNotificationObj.title = ''
                $scope.sendNotificationObj.message = ''
                $scope.selectAll();
                return
            } else {
                showAlert("Push notification", "Notification couldn't send");
                return;
            }
        });
    }
});