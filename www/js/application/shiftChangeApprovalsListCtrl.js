/*
 1.This controller is used to Approve/Reject shift-change.
 2.Modal has been opened by pressing the list and Approve/Reject functionality is given there too.
 */

mainModule.factory("viewShiftChangeApprovalService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/attendance/shiftChange/viewShiftChangeApprove.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("getRequisitionCountService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/eisCompany/viewRequestCount.spr'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.controller('shiftChangeApprovalsListCtrl', function ($scope, $http, $ionicPopup, getRequisitionCountService, viewShiftChangeApprovalService, commonService, $rootScope, $ionicLoading, $ionicModal, detailsService) {

    
    if ( getMyHrapiVersionNumber() >= 30){
        $scope.utf8Enabled = 'true'    
    }else{
        $scope.utf8Enabled = 'false'    
    }
    
    $scope.getShiftChangeApplicationList = function () {
        $scope.shiftChangeObject = {}
        var shiftChangeMenuInfo = getMenuInformation("Attendance Management", "Shift Change");
        $scope.shiftChangeObject.menuId = shiftChangeMenuInfo.menuId;
        $scope.shiftChangeObject.buttonRights = "Y-Y-Y-Y"
        $scope.shiftChangeObject.empId = sessionStorage.getItem('empId');
        $scope.shiftChangeObject.status = 'SENT FOR APPROVAL';
        $scope.searchObj = ''
        $ionicLoading.show();
        $scope.viewShiftChangeApprovalService = new viewShiftChangeApprovalService();
        $scope.viewShiftChangeApprovalService.$save($scope.shiftChangeObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewShiftChangeApprovalService")
			}
			
			$scope.shiftChangeApprovalApplList = [];
			if(data.shiftChangeForm===undefined){
				//do nothing
			}else{
				$scope.shiftChangeApprovalApplList = data.shiftChangeForm;
			}
            
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
    $scope.getShiftChangeApplicationList();

    $scope.shiftChangeDetail = function (shiftDet) {
        $ionicLoading.show({
        });
        $scope.shiftChangeObject1 = shiftDet;
        $scope.shiftChangeDetailObject = {};
        $scope.shiftChangeDetailObject.empName = shiftDet.empName;
        $scope.shiftChangeDetailObject.reqDate = shiftDet.reqDate;
        $scope.shiftChangeDetailObject.rosterShiftName = shiftDet.rosterShiftName;
        $scope.shiftChangeDetailObject.changedShiftName = shiftDet.changedShiftName;
        $scope.shiftChangeDetailObject.reasonToChange = shiftDet.reasonToChange;
        $scope.shiftChangeDetailObject.status = shiftDet.status;
        $scope.shiftChangeDetailObject.empCode = shiftDet.empCode;
        $scope.shiftChangeDetailObject.deptName = shiftDet.deptName;
        $scope.shiftChangeDetailObject.appRemarks = shiftDet.appRemarks;
        $scope.shiftChangeDetailObject.lastAppRemarks = shiftDet.lastAppRemarks;
        $scope.shiftChangeDetailObject.raisedBy = shiftDet.raisedBy;
        $scope.openModalShift();
        $ionicLoading.hide()
    }
    $ionicModal.fromTemplateUrl('my-modal-shift.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modalShift) {
        $scope.modalShift = modalShift;
    });
    $scope.openModalShift = function () {
        $scope.modalShift.show();
    };
    $scope.closeModalShift = function () {
        $scope.modalShift.hide();
    };
    $scope.$on('$destroy', function () {
        $scope.modalShift.remove();
    });
    $scope.$on('modalShift.hidden', function () {
    });
    $scope.$on('modalShift.removed', function () {
    });


    $scope.onConfirmShift = function (status, type, shiftObject) {
        $scope.dataShift = {}
        if (type == 1)
        {
            var myPopup = $ionicPopup.show({
                template: '<label>Approver Remarks<textarea rows="3" ng-model="dataShift.onApprove" cols="100"></textarea></label>',
                title: 'Do you want to approve?',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'}, {
                        text: '<b>Approve</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            return $scope.dataShift.onApprove || true;
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                if (res) {
                    $scope.approveShiftChange(status, shiftObject, $scope.dataShift.onApprove)
                    return
                } else {
                    return;
                }
            });
        } else if (type == 2)
        {
            var myPopup = $ionicPopup.show({
                template: '<label>Approver Remarks<textarea rows="3" ng-model="dataShift.onreject" cols="100"></textarea></label>',
                title: 'Do you want to reject?',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'}, {
                        text: '<b>Reject</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            return $scope.dataShift.onreject || true;
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                if (res) {
                    $scope.rejectShiftChange(status, shiftObject, $scope.dataShift.onreject)
                    return
                } else {
                    return;
                }
            });
        }
    }


    $scope.approveShiftChange = function (status, shiftObject, remarks) {
        $ionicLoading.show({
        });
        $scope.approvalRequestObject = {};
        $scope.temp = {};
        $scope.approvalRequestObject.shiftChangeVOList = [];

        var shiftChangeMenuInfo = getMenuInformation("Attendance Management", "Shift Change");
        $scope.approvalRequestObject.menuId = shiftChangeMenuInfo.menuId;

        $scope.approvalRequestObject.buttonRights = "Y-Y-Y-Y";
        $scope.approvalRequestObject.empId = shiftObject.empId;
        $scope.approvalRequestObject.status = shiftObject.status;
        $scope.approvalRequestObject.trackerId = shiftObject.trackerId;
        $scope.temp.transId = shiftObject.transId;
        $scope.temp.trackerId = shiftObject.trackerId;
        $scope.temp.isAssign = "true";
        $scope.temp.empCode = shiftObject.empCode;
        $scope.temp.empName = shiftObject.empName;
        $scope.temp.deptName = shiftObject.deptName;
        $scope.temp.status = shiftObject.status;
        $scope.temp.reqDate = shiftObject.reqDate;
        $scope.temp.rosterShiftName = shiftObject.rosterShiftName;
        $scope.temp.changedShiftName = shiftObject.changedShiftName;
        $scope.temp.reasonToChange = shiftObject.reasonToChange;
        $scope.temp.appRemarks = remarks;

        if ($scope.utf8Enabled == 'true' ){
            if ($scope.temp.appRemarks){
                $scope.temp.appRemarks  = encodeURI($scope.temp.appRemarks)
            }
          }

        $scope.approvalRequestObject.shiftChangeVOList.push($scope.temp);
        if (status == 'show') {
            $scope.modalShift.hide()
        }
        $http({
            url: (baseURL + '/api/attendance/shiftChange/approveRequest.spr'),
            method: 'POST',
            timeout: commonRequestTimeout,
            transformRequest: jsonTransformRequest,
            data: $scope.approvalRequestObject,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + jwtByHRAPI
                }
        }).
                success(function (data) {
                    showAlert("Successfully approved")
                    getMenuInfoOnLoad();

                    $scope.getShiftChangeApplicationList()
                    $ionicLoading.hide()
                }).error(function (data) {
            $ionicLoading.hide()
            autoRetryCounter = 0
            commonService.getErrorMessage(data);
        });
    }



    $scope.rejectShiftChange = function (status, shiftObject, remarks) {
        $ionicLoading.show({
        });
        $scope.rejectionRequestObject = {};
        $scope.temp = {};
        $scope.rejectionRequestObject.shiftChangeVOList = [];

        var shiftChangeMenuInfo = getMenuInformation("Attendance Management", "Shift Change");
        $scope.rejectionRequestObject.menuId = shiftChangeMenuInfo.menuId;

        $scope.rejectionRequestObject.buttonRights = "Y-Y-Y-Y";
        $scope.rejectionRequestObject.empId = shiftObject.empId;
        $scope.rejectionRequestObject.status = shiftObject.status;
        $scope.rejectionRequestObject.trackerId = shiftObject.trackerId;
        $scope.temp.transId = shiftObject.transId;
        $scope.temp.trackerId = shiftObject.trackerId;
        $scope.temp.isAssign = "true";
        $scope.temp.empCode = shiftObject.empCode;
        $scope.temp.empName = shiftObject.empName;
        $scope.temp.deptName = shiftObject.deptName;
        $scope.temp.status = shiftObject.status;
        $scope.temp.reqDate = shiftObject.reqDate;
        $scope.temp.rosterShiftName = shiftObject.rosterShiftName;
        $scope.temp.changedShiftName = shiftObject.changedShiftName;
        $scope.temp.reasonToChange = shiftObject.reasonToChange;
        $scope.temp.appRemarks = remarks;

        if ($scope.utf8Enabled == 'true' ){
            if ($scope.temp.appRemarks){
                $scope.temp.appRemarks  = encodeURI($scope.temp.appRemarks)
            }
          }

        $scope.rejectionRequestObject.shiftChangeVOList.push($scope.temp);
        if (status == 'show') {
            $scope.modalShift.hide()
        }
        $http({
            url: (baseURL + '/api/attendance/shiftChange/rejectRequest.spr'),
            method: 'POST',
            timeout: commonRequestTimeout,
            transformRequest: jsonTransformRequest,
            data: $scope.rejectionRequestObject,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + jwtByHRAPI
                }
        }).
                success(function (data) {
                    getMenuInfoOnLoad();
                    showAlert("Application rejected")
                    $scope.getShiftChangeApplicationList()
                    $ionicLoading.hide()
                }).error(function (data) {
            $ionicLoading.hide()
            autoRetryCounter = 0
            commonService.getErrorMessage(data);
        });
    }

    function getMenuInfoOnLoad() {
        $rootScope.getRequisitionCountService = new getRequisitionCountService();
        $rootScope.getRequisitionCountService.$save(function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"getRequisitionCountService")
			}
			
            if (data.attendanceRegularisation)
            {
                attendRegularInProcessCount = data.attendanceRegularisation.inProcess;
            } else
            {
                attendRegularInProcessCount = '0'
            }
            if (data.leaveApplication)
            {
                leaveAppliInProcessCount = data.leaveApplication.inProcess;
            } else
            {
                leaveAppliInProcessCount = '0'
            }
            if (data.odApplication)
            {
                odApplicationInProcessCount = data.odApplication.inProcess;
            } else
            {
                odApplicationInProcessCount = '0'
            }
            if (data.shiftChange)
            {
                shiftChangeCount = data.shiftChange.inProcess;
            } else
            {
                shiftChangeCount = '0'
            }
            $rootScope.totalRequestCount = parseInt(attendRegularInProcessCount) + parseInt(leaveAppliInProcessCount) + parseInt(odApplicationInProcessCount) + parseInt(shiftChangeCount);
            $rootScope.attendance = attendRegularInProcessCount;
            $rootScope.leave = leaveAppliInProcessCount;
            $rootScope.od = odApplicationInProcessCount;
            $rootScope.shift = shiftChangeCount;

//            getDoNutChartCountOnLoad()
        }, function (data) {
            $ionicLoading.hide()
            autoRetryCounter = 0
            commonService.getErrorMessage(data);
        });
    }
});


