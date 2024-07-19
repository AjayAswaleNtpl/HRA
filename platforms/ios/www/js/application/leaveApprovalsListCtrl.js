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
mainModule.controller('leaveApprovalsListCtrl', function ($scope, $filter, loginCommService, $http, $ionicPopup, getRequisitionCountService, commonService, $rootScope, $ionicLoading, $ionicModal, detailsService, viewLeaveApplicationService) {
    console.log(0)
    $scope.detailResObject = {}
    $scope.searchObj = {}
    $scope.searchObj.searchLeave = '';


    function getMenuInfoOnLoad() {
        $rootScope.getRequisitionCountService = new getRequisitionCountService();
        $rootScope.getRequisitionCountService.$save(function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"  ")
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

//            loginCommService.getDoNutChartCountOnLoad();
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
    getMenuInfoOnLoad();

    $scope.getLeaveList = function () {
        $scope.searchObj = ''
        $ionicLoading.show({});
        $scope.requesObject = {}
        var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
        $scope.requesObject.menuId = leaveMenuInfo.menuId;
        $scope.requesObject.buttonRights = "Y-Y-Y-Y"
        $scope.requesObject.formName = "Leave"
        $scope.viewLeaveApplicationService = new viewLeaveApplicationService();
        $scope.viewLeaveApplicationService.$save($scope.requesObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"  ")
			}	
            console.log(1)
            $scope.leaveApplList = []
            $scope.leaveApplList = data.reporteeLeaveList
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
    $scope.getLeaveList();

    $scope.detailInfoReporty = function (transid) {
        $ionicLoading.show({
        });

        var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");

        $scope.detailResObject.leaveTransId = transid
        $scope.detailResObject.menuId = leaveMenuInfo.menuId;
        $scope.detailResObject.buttonRights = "Y-Y-Y-Y"
        $scope.detailResObject.fromEmail = "N"
        $scope.detailsService = new detailsService();
        $scope.detailsService.$save($scope.detailResObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"detailsService")
			}		
			
            $scope.leaveType = data.leanobj.leaveTypeList[0].leaveType

            $scope.leaveApplyDetail = data.form.leaveAppVo;
            $scope.leaveReason = data.form.leaveAppVo.leaveReason;
            $scope.status = data.form.leaveAppVo.leaveStatus;
            $scope.title = data.form.leaveAppVo;
            $scope.name = data.form.leaveAppVo.name;
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
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    $scope.$on('modal.hidden', function () {
    });
    $scope.$on('modal.removed', function () {
    });

    $scope.onConfirm = function (status, type, leaveTransId, leaveFromDate, leaveToDate) {
        console.log('onconfirm')
        $scope.data = {}
        if (type == 1) {
            var myPopup = $ionicPopup.show({
                template: '<label>Approver Remarks<textarea rows="3" ng-model="data.onApprove" cols="100"></textarea></label>',
                title: 'Do you want to approve?',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'}, {
                        text: '<b>Approve</b>',
                        type: 'button-positive',
                        onTap: function (e) {

                            return $scope.data.onApprove || true;

                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                if (res) {
                    $scope.approvedLeave(status, leaveTransId, leaveFromDate, leaveToDate, $scope.data.onApprove)
                    return
                } else {
                    return;
                }
            });
        } else if (type == 2)
        {
            var myPopup = $ionicPopup.show({
                template: '<label>Approver Remarks<textarea rows="3" ng-model="data.onreject" cols="100"></textarea></label>',
                title: 'Do you want to reject?',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'}, {
                        text: '<b>Reject</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            return $scope.data.onreject || true;
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                if (res) {
                    $scope.rejectLeave(status, leaveTransId, leaveFromDate, leaveToDate, $scope.data.onreject)
                    return
                } else {
                    return;
                }
            });

            $scope.rejectLeave = function (status, leaveTransId, leaveFromDate, leaveToDate, onreject) {
                $ionicLoading.show({
                });

                $scope.detailResObject.leaveTransId = leaveTransId

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
					
                    $scope.rejectResObject = {}
                    $scope.rejectResObject.leaveAppVo = {}
                    $scope.rejectResObject.menuId = leaveMenuInfo.menuId;
                    $scope.rejectResObject.buttonRights = "Y-Y-Y-Y";
                    $scope.rejectResObject.fromEmail = "N";
                    $scope.rejectResObject.leaveAppVo.afterBalance = data.form.leaveAppVo.afterBalance;
                    $scope.rejectResObject.leaveAppVo.currentBalance = data.form.leaveAppVo.currentBalance;
                    $scope.rejectResObject.leaveAppVo.empId = data.form.leaveAppVo.empId;
                    $scope.rejectResObject.leaveAppVo.leastCount = data.form.leaveAppVo.leastCount;
                    $scope.rejectResObject.leaveAppVo.leaveApproved = data.form.leaveAppVo.leaveApproved;
                    $scope.rejectResObject.leaveAppVo.leaveBalBefore = data.form.leaveAppVo.leaveBalBefore;
                    $scope.rejectResObject.leaveAppVo.leaveFromDate = data.form.leaveAppVo.leaveFromDate;
                    $scope.rejectResObject.leaveAppVo.leaveInProcess = data.form.leaveAppVo.leaveInProcess;
                    $scope.rejectResObject.leaveAppVo.leaveReason = data.form.leaveAppVo.leaveReason;
                    $scope.rejectResObject.leaveAppVo.leaveStatus = data.form.leaveAppVo.leaveStatus;
                    $scope.rejectResObject.leaveAppVo.leaveToDate = data.form.leaveAppVo.leaveToDate;
                    $scope.rejectResObject.leaveAppVo.leaveTransId = data.form.leaveAppVo.leaveTransId;
                    $scope.rejectResObject.leaveAppVo.name = data.form.leaveAppVo.name;
                    $scope.rejectResObject.leaveAppVo.phone = data.form.leaveAppVo.phone;
                    $scope.rejectResObject.leaveAppVo.fromLeaveType = data.form.leaveAppVo.fromLeaveType;
                    $scope.rejectResObject.leaveAppVo.leaveTypeId = data.form.leaveAppVo.leaveTypeId;
                    $scope.rejectResObject.leaveAppVo.mailType = "";
                    $scope.rejectResObject.leaveAppVo.noDaysCounted = data.form.leaveAppVo.noDaysCounted;
                    $scope.rejectResObject.leaveAppVo.noOfDays = data.form.leaveAppVo.noOfDays;
                    $scope.rejectResObject.leaveAppVo.toLeaveType = data.form.leaveAppVo.toLeaveType;
                    $scope.rejectResObject.leaveAppVo.remarks = onreject;
                    if (status == 'show') {
                        $scope.modal.hide()
                    }
                    $http({
                        url: (baseURL + '/api/leaveApplication/rejectLeaveApp.spr'),
                        method: 'POST',
                        timeout: commonRequestTimeout,
                        transformRequest: jsonTransformRequest,
                        data: $scope.rejectResObject,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Bearer ' + jwtByHRAPI
                            }
                    }).
                            success(function (data) {
                                getMenuInfoOnLoad();
                                showAlert(JSON.stringify(data.msg));
                                $scope.getLeaveList()
                                $ionicLoading.hide();
                            }).error(function (data) {
                        $ionicLoading.hide();
                        showAlert("Leave couldn't be rejected!!!!!", "Try again");
                    });
                }, function (data) {
                    autoRetryCounter = 0
                    $ionicLoading.hide()
                    commonService.getErrorMessage(data);
                });
            }
        }
    }



    $scope.approvedLeave = function (status, leaveTransId, leaveFromDate, leaveToDate, remarks) {
        $ionicLoading.show({
        });
        $scope.detailResObject.leaveTransId = leaveTransId

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

            $scope.approvResObject = {}
            $scope.approvResObject.leaveAppVo = {}
            $scope.approvResObject.menuId = leaveMenuInfo.menuId;
            ;
            $scope.approvResObject.buttonRights = "Y-Y-Y-Y";
            $scope.approvResObject.fromEmail = "N";
            $scope.approvResObject.leaveAppVo.afterBalance = data.form.leaveAppVo.afterBalance;
            $scope.approvResObject.leaveAppVo.currentBalance = data.form.leaveAppVo.currentBalance;
            $scope.approvResObject.leaveAppVo.empId = data.form.leaveAppVo.empId;
            $scope.approvResObject.leaveAppVo.leastCount = data.form.leaveAppVo.leastCount;
            $scope.approvResObject.leaveAppVo.leaveApproved = data.form.leaveAppVo.leaveApproved;
            $scope.approvResObject.leaveAppVo.leaveBalBefore = data.form.leaveAppVo.leaveBalBefore;
            $scope.approvResObject.leaveAppVo.leaveFromDate = data.form.leaveAppVo.leaveFromDate;
            $scope.approvResObject.leaveAppVo.leaveInProcess = data.form.leaveAppVo.leaveInProcess;
            $scope.approvResObject.leaveAppVo.leaveReason = data.form.leaveAppVo.leaveReason;
            $scope.approvResObject.leaveAppVo.leaveStatus = data.form.leaveAppVo.leaveStatus;
            $scope.approvResObject.leaveAppVo.leaveToDate = data.form.leaveAppVo.leaveToDate;
            $scope.approvResObject.leaveAppVo.leaveTransId = data.form.leaveAppVo.leaveTransId;
            $scope.approvResObject.leaveAppVo.name = data.form.leaveAppVo.name;
            $scope.approvResObject.leaveAppVo.phone = data.form.leaveAppVo.phone;
            $scope.approvResObject.leaveAppVo.fromLeaveType = data.form.leaveAppVo.fromLeaveType;
            $scope.approvResObject.leaveAppVo.leaveTypeId = data.form.leaveAppVo.leaveTypeId;
            $scope.approvResObject.leaveAppVo.mailType = "";
            $scope.approvResObject.leaveAppVo.noDaysCounted = data.form.leaveAppVo.noDaysCounted;
            $scope.approvResObject.leaveAppVo.noOfDays = data.form.leaveAppVo.noOfDays;
            $scope.approvResObject.leaveAppVo.toLeaveType = data.form.leaveAppVo.toLeaveType;
            $scope.approvResObject.leaveAppVo.remarks = remarks;
            if (status == 'show') {
                $scope.modal.hide()
            }
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
                        getMenuInfoOnLoad();
                        showAlert(JSON.stringify(data.msg));
                        $scope.getLeaveList()
                        $ionicLoading.hide()
                    }).error(function (data) {
                $ionicLoading.hide()
                showAlert("Leave couldn't be approved!!!!!", "Try again");
            });
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

});
