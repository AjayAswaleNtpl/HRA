mainModule.factory("viewMissPunchApplicationService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/attendance/missPunch/viewMissPunch.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                 }
            }
        }, {});
    }]);

mainModule.controller('attendanceReqListCtrl', function ($scope, $state, $ionicModal, $ionicPopup, getSetService, viewMissPunchApplicationService, $ionicLoading) {

    $scope.requesObject = {}
    $scope.requesObject.buttonRights = "Y-Y-Y-Y"
    $scope.requesObject.formName = "Leave"
    $scope.missPunchAppliList = [];
    $scope.missPunchdetailInfo = function (missPunchAppliList) {
        $scope.missPunchDetails = missPunchAppliList
        $scope.missPunchDetails.remarks = missPunchAppliList.remarks;
        if ($scope.missPunchDetails.remarks == "FSISO") {
            $scope.fullRemarks = "Forgot to Sign in Sign Out (FSISO)"
        }
        else if ($scope.missPunchDetails.remarks == "FSI") {
            $scope.fullRemarks = "Forgot to Sign in (FSI)"
        }
        else if ($scope.missPunchDetails.remarks == "FSO") {
            $scope.fullRemarks = "Forgot to Sign Out (FSO)"
        }
        else if ($scope.missPunchDetails.remarks == "MSISO") {
            $scope.fullRemarks = "Modify Sign in Sign Out (MSISO)"
        }
        else if ($scope.missPunchDetails.remarks == "NEWEMP") {
            $scope.fullRemarks = "New Employee (NEWEMP)"
        }
        else if ($scope.missPunchDetails.remarks == "UNPLANHD") {
            $scope.fullRemarks = "Unplanned Holiday (UNPLANHD)"
        }
        else if ($scope.missPunchDetails.remarks == "EG") {
            $scope.fullRemarks = "Early Going (EG)"
        }
        else if ($scope.missPunchDetails.remarks == "LC") {
            $scope.fullRemarks = "Late Coming (LC)"
        }
        else if ($scope.missPunchDetails.remarks == "OTH") {
            $scope.fullRemarks = "Other (OTH)"
        }

        $scope.openModalAttend();
        $ionicLoading.hide()
    }

    $ionicModal.fromTemplateUrl('my-modal-attend.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modalAttend) {
        $scope.modalAttend = modalAttend;
    });
    $scope.openModalAttend = function () {
        $scope.modalAttend.show();
    };
    $scope.closeModalAttend = function () {
        $scope.modalAttend.hide();
    };
    $scope.$on('$destroy', function () {
        $scope.modalAttend.remove();
    });
    $scope.$on('modalAttend.hidden', function () {
    });
    $scope.$on('modalAttend.removed', function () {
    });
    $scope.getRegularizationRequestList = function () {
        $scope.searchObj = '';
        $("#leaveApplicationID").hide();
        $("#ODApplicationID").hide();
        $("#ShiftChangeRequestID").hide();
        $("#RegularizationApplicationID").show();
        $("#tabLeave").removeClass("active");
        $("#tabOD").removeClass("active");
        $("#tabShiftApplication").removeClass("active");
        $("#tabRegularization").addClass("active");
        var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");
        $scope.requesObject.menuId = attendanceMenuInfo.menuId;
        $scope.requesObject.fromEmail = "N"
        $scope.requesObject.listYear = new Date().getFullYear();
        $scope.requesObject.monthId = parseInt(new Date().getMonth()) + 1;
        $ionicLoading.show({template: 'Loading'});
        $scope.viewMissPunchApplicationService = new viewMissPunchApplicationService();
        $scope.viewMissPunchApplicationService.$save($scope.requesObject, function (data) {

			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewMissPunchApplicationService")
			}				
			
            if (Object.keys(data).length > 0) {

                if (data.missedPunchForm.missedPunchVOList.length > 0) {

                    $scope.missPunchAppliList = data.missedPunchForm.missedPunchVOList;
                }
                $("#attendanceRegularisationID").show();
            }
            $ionicLoading.hide()
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            showAlert("List couldn't be fetch!!!!!", "Try again");
        });
    }
    $scope.getRegularizationRequestList();
});