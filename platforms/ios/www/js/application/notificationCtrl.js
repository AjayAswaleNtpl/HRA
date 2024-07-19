mainModule.factory("viewLeaveApplicationService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/leaveApplication/viewLeaveApplication.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("detailsService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/leaveApplication/details.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);

mainModule.controller('notificationsCtrl', function ($scope, $http, commonService, $ionicLoading, $ionicModal, viewLeaveApplicationService, detailsService) {
    $scope.requesObject = {}

    var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
    $scope.requesObject.menuId = leaveMenuInfo.menuId;

    $scope.requesObject.buttonRights = "Y-Y-Y-Y"
    $scope.requesObject.formName = "Leave"
    $scope.ManagerRequestList = function ()
    {
        $ionicLoading.show({
        });
        $scope.viewLeaveApplicationService = new viewLeaveApplicationService();
        $scope.viewLeaveApplicationService.$save($scope.requesObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewLeaveApplicationService")
			}

			$scope.leaveApplList = []			
			if(data.reporteeLeaveList===undefined){
				//do nothing
			}else{
				$scope.leaveApplList = data.reporteeLeaveList
			}
            
            
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
    $scope.ManagerRequestList()
// -------------ionic modal start--------------
    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });
//    -------------ionic modal end------------------

    $scope.approvedLeave = function (leaveTransId) {
        $ionicLoading.show({
        });
        $scope.approvResObject = {}
        $scope.approvResObject.leaveAppVo = {}

        var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
        $scope.approvResObject.menuId = leaveMenuInfo.menuId;

        $scope.approvResObject.buttonRights = "Y-Y-Y-Y"
//        $scope.approvResObject.leaveAppVo.afterBalance = -15
//        $scope.approvResObject.fromEmail = "N"
//        $scope.approvResObject.leaveAppVo.currentBalance = 4
//        $scope.approvResObject.leaveAppVo.empId = 166
//        $scope.approvResObject.leaveAppVo.leastCount = 0
//        $scope.approvResObject.leaveAppVo.leaveApproved = 2.5
//        $scope.approvResObject.leaveAppVo.leaveBalBefore = 9
//        $scope.approvResObject.leaveAppVo.leaveFromDate = "16/11/2017"-
//        $scope.approvResObject.leaveAppVo.leaveInProcess = 17.5
//        $scope.approvResObject.leaveAppVo.leaveReason = "Chutti Pe ja raha hoon"
//        $scope.approvResObject.leaveAppVo.leaveStatus = "SENT FOR APPROVAL"-
//        $scope.approvResObject.leaveAppVo.leaveToDate = "20/11/2017"-
        $scope.approvResObject.leaveAppVo.leaveTransId = leaveTransId
//        $scope.approvResObject.leaveAppVo.name = "arjun nair"-
//        $scope.approvResObject.leaveAppVo.phone = 9999955555
//        $scope.approvResObject.leaveAppVo.fromLeaveType = "fullDay"
//        $scope.approvResObject.leaveAppVo.leaveTypeId = 1-
//        $scope.approvResObject.leaveAppVo.mailType = ""
//        $scope.approvResObject.leaveAppVo.noDaysCounted = 4-
//        $scope.approvResObject.leaveAppVo.noOfDays = 5-
//        $scope.approvResObject.leaveAppVo.toLeaveType = "fullDay"-

        $http({
            url: (baseURL + '/api/leaveApplication/approveLeaveApp.spr'),
            method: 'POST',
            timeout: commonRequestTimeout,
            transformRequest: jsonTransformRequest,
            data: $scope.approvResObject,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + jwtByHRAPI
                }
        }).
                success(function (data) {
                    showAlert(JSON.stringify(data.msg));
                })
                .error(function (status) {
                    autoRetryCounter = 0
                    $scope.data = {status: status};
                    commonService.getErrorMessage($scope.data);
                    $ionicLoading.hide()
                })
    }

    $scope.rejectLeave = function (leaveTransId) {
        $scope.rejectResObject = {}
        $scope.rejectLeaveService = new rejectLeaveService();
        $scope.rejectLeaveService.$save($scope.rejectResObject, function (data) {
            alert('Function call' + JSON.stringify(data))
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

    $scope.detailInfoReporty = function (transid) {
        $scope.detailResObject = {}
        $scope.detailResObject.leaveTransId = transid

        var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
        $scope.detailResObject.menuId = leaveMenuInfo.menuId;

        $scope.detailResObject.buttonRights = "Y-Y-Y-Y"
        $scope.detailResObject.fromEmail = "N"

        $scope.detailsService = new detailsService();
        $scope.detailsService.$save($scope.detailResObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"detailsService")
			}
			
            $scope.leaveApplyDetail = data.form.leaveAppVo
            $scope.leaveReason = data.form.leaveAppVo.leaveReason
            $scope.status = data.form.leaveAppVo.leaveStatus
            $scope.title = data.form.leaveAppVo
            $scope.name = data.form.leaveAppVo.name
            $scope.leaveFromDate = data.form.leaveAppVo.leaveFromDate
            $scope.leaveToDate = data.form.leaveAppVo.leaveToDate
            $scope.phoneNo = data.form.leaveAppVo.phone
            $scope.toLeaveType = data.form.leaveAppVo.toLeaveType
            $scope.fromLeaveType = data.form.leaveAppVo.fromLeaveType

            $scope.openModal();
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
});
