/*
 1.This controller is used to show only the list of applied shift-change in Requestion.
 2.Extra information of applied shift-change is given in modal.
 3.Modal can be opened by clicking on any list.
 */


mainModule.factory("viewShiftChangeApplicationService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/attendance/shiftChange/viewShiftChangeAcordingToStatus.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);


mainModule.controller('shiftChangeReqListCtrl', function ($scope, commonService, $ionicModal, $state, $ionicPopup, getSetService, $ionicLoading, viewShiftChangeApplicationService) {
    $scope.shiftChangeAppliList = [];
    $scope.requesObject = {}
    var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
    $scope.requesObject.menuId = leaveMenuInfo.menuId;

    $scope.shiftChangeDetailInfo = function (shiftChangeAppliList) {
        var detailShiftChangeObject = {};
        detailShiftChangeObject.fromDate = shiftChangeAppliList.fromDate;
        detailShiftChangeObject.status = shiftChangeAppliList.status;
        detailShiftChangeObject.toDate = shiftChangeAppliList.toDate;
        detailShiftChangeObject.rosterShiftName = shiftChangeAppliList.rosterShiftName;
        detailShiftChangeObject.changedShiftName = shiftChangeAppliList.changedShiftName;
        detailShiftChangeObject.reasonToChange = shiftChangeAppliList.reasonToChange;
        detailShiftChangeObject.appRemarks = shiftChangeAppliList.appRemarks;
        detailShiftChangeObject.lastAppRemarks = shiftChangeAppliList.lastAppRemarks;
        $scope.shiftChangeDetails = detailShiftChangeObject
        $scope.openModalShiftChange();
        $ionicLoading.hide()
    }

    $ionicModal.fromTemplateUrl('my-modal-shift-change.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modalShiftChange) {
        $scope.modalShiftChange = modalShiftChange;
    });
    $scope.openModalShiftChange = function () {
        $scope.modalShiftChange.show();
    };
    $scope.closeModalShiftChange = function () {
        $scope.modalShiftChange.hide();
    };
    $scope.$on('$destroy', function () {
        $scope.modalShiftChange.remove();
    });
    $scope.$on('modalShiftChange.hidden', function () {
    });
    $scope.$on('modalShiftChange.removed', function () {
    });


    $scope.getShiftChangeRequestList = function () {
        $scope.searchObj = '';
        $("#leaveApplicationID").hide();
        $("#ODApplicationID").hide();
        $("#RegularizationApplicationID").hide();
        $("#ShiftChangeRequestID").show();
        $("#tabLeave").removeClass("active");
        $("#tabOD").removeClass("active");
        $("#tabRegularization").removeClass("active");
        $("#tabShiftApplication").addClass("active");

        var shiftChangeMenuInfo = getMenuInformation("Attendance Management", "Shift Change");
        $scope.requesObject.menuId = shiftChangeMenuInfo.menuId;

        $scope.requesObject.empCode = sessionStorage.getItem('empCode');
        $scope.requesObject.buttonRights = "Y-Y-Y-Y";
        $ionicLoading.show({template: 'Loading'});
        $scope.viewShiftChangeApplicationService = new viewShiftChangeApplicationService();
        $scope.viewShiftChangeApplicationService.$save($scope.requesObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewShiftChangeApplicationService")
			}
			
            if (Object.keys(data).length > 0) {
                if (data.form.shiftChangeVOList.length > 0) {
                    $scope.shiftChangeAppliList = data.form.shiftChangeVOList;
                }
            }
            $ionicLoading.hide()
        }, function (data) {
            $ionicLoading.hide()
            autoRetryCounter = 0
            commonService.getErrorMessage(data);
        });
    }
    $scope.getShiftChangeRequestList();

});