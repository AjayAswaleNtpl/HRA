/*
 1.This controller is used to show Approve/Reject OD-Application which is sent for approval/sent for cancellation.
 */

mainModule.factory("viewODPendingApplicationService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/odApplication/getPendingODApplication.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("approvePendingODService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/odApplication/approve.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("rejectPendingODService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/odApplication/reject.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.controller('ODApprovalsListCtrl', function ($scope, $http, $ionicPopup, rejectPendingODService, approvePendingODService, viewODPendingApplicationService, commonService, $rootScope, $ionicLoading, $ionicModal, detailsService, viewLeaveApplicationService) {
    $scope.requesObject = {}
    var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
    $scope.requesObject.menuId = leaveMenuInfo.menuId;
    $scope.requesObject.buttonRights = "Y-Y-Y-Y"
    $scope.requesObject.formName = "Leave"

    $scope.searchObj = {}
    $scope.searchObj.searchODManager = ''
    $scope.requesObject1 = {}
    $scope.ODPendingObject = {}
    $scope.getODApplicationList = function () {
        $scope.searchObj = ''
        $ionicLoading.show({});
        var odMenuInfo = getMenuInformation("Attendance Management", "OD Application");
        $scope.requesObject1.menuId = odMenuInfo.menuId;
        $scope.viewODPendingApplicationService = new viewODPendingApplicationService();
        $scope.viewODPendingApplicationService.$save($scope.requesObject1, function (data) {
            $scope.ODPendingApplList = []
			if(data.odApplicationVoList===undefined){
				//do nothing
			}else{
				$scope.ODPendingApplList = data.odApplicationVoList;
			}
            
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
    $scope.getODApplicationList()
    $scope.approveOrRejectPendingOD = function (odPending, type) {
        $scope.data = {}
        $scope.ODPendingObject.odIds = odPending.odID;
        $scope.ODPendingObject.empId = sessionStorage.getItem('empId');
        $scope.ODPendingObject.menuId = $scope.requesObject1.menuId;
        $scope.ODPendingObject.buttonRights = $scope.requesObject.buttonRights;
        $scope.ODPendingObject.remark = "";
        $scope.ODPendingObject.code = "notEmail";
        if (type == "APPROVE") {
            var myPopup = $ionicPopup.show({
                template: '<label>Approver Remarks<textarea rows="3" ng-model="ODPendingObject.remark" cols="100"></textarea></label>',
                title: 'Do you want to approve?',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'}, {
                        text: '<b>Approve</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            return $scope.ODPendingObject.remark || true;
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                if (res) {
                    $ionicLoading.show({
                    });
                    $scope.approvePendingODService = new approvePendingODService();
                    $scope.approvePendingODService.$save($scope.ODPendingObject, function (data) {
						if (!(data.clientResponseMsg=="OK")){
							console.log(data.clientResponseMsg)
							handleClientResponse(data.clientResponseMsg,"approvePendingODService")
						}	
                        getMenuInfoOnLoad();

                        showAlert("OD pending application", "OD approved successfully");
                        $scope.getODApplicationList();
                    }, function (data) {
                        $ionicLoading.hide()
                        commonService.getErrorMessage(data);
                    });
                    return
                } else {
                    $ionicLoading.hide()
                    return;
                }
            });
        }
        if (type == "REJECT") {
            var myPopup = $ionicPopup.show({
                template: '<label>Approver Remarks<textarea rows="3" ng-model="data.odReject" cols="100"></textarea></label>',
                title: 'Do you want to reject?',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'}, {
                        text: '<b>Reject</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            return $scope.data.odReject || true;
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                if (res) {
                    $ionicLoading.show({
                    });
                    $scope.rejectPendingODService = new rejectPendingODService();
                    $scope.rejectPendingODService.$save($scope.ODPendingObject, function (data) {
						if (!(data.clientResponseMsg=="OK")){
							console.log(data.clientResponseMsg)
							handleClientResponse(data.clientResponseMsg,"rejectPendingODService")
						}	

                        $scope.getODApplicationList();
                        getMenuInfoOnLoad();
                        showAlert("OD pending application detail", "OD rejected successfully");
                    }, function (data) {
                        $ionicLoading.hide()
                        commonService.getErrorMessage(data);
                    });
                    return
                } else {
                    $ionicLoading.hide()
                    return;
                }
            });
        }
    }

});