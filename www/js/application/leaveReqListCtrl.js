/*
 1.This controller is used to show only the applied leaves.
 2.Modal has been opened on click.
 */


mainModule.factory("getYearListService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/odApplication/getYearList.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
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

mainModule.controller('leaveReqListCtrl', function ($scope, $state, getYearListService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading) {

    $scope.requesObject = {}
    $scope.sendrequesObject = {}
    var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
    $scope.requesObject.menuId = leaveMenuInfo.menuId;
    $scope.requesObject.buttonRights = "Y-Y-Y-Y"
    $scope.requesObject.formName = "Leave"
    $scope.searchObj = {}
    $scope.searchObj.searchQuery = '';
    $scope.getLeaveRequestList = function () {
        $scope.searchObj = '';
        $("#ShiftChangeRequestID").hide();
        $("#ODApplicationID").hide();
        $("#RegularizationApplicationID").hide();
        $("#leaveApplicationID").show();
        $("#tabLeave").addClass("active");
        $("#tabOD").removeClass("active");
        $("#tabRegularization").removeClass("active");
        $("#tabShiftApplication").removeClass("active");
        $ionicLoading.show({template: 'Loading'});
        $scope.getYearListService = new getYearListService();
        $scope.getYearListService.$save(function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"getYearListService")
			}	
			$scope.yearList = []
			if (data.yearList === undefined){
				//do nothing
			}else{
				$scope.yearList = data.yearList
			}
            
        }, function (data, status) {
            $ionicLoading.hide()
            showAlert("Approval list couldn't be fetch!!!!!", "Try again");
        });
        $scope.viewLeaveApplicationService = new viewLeaveApplicationService();
        $scope.viewLeaveApplicationService.$save($scope.requesObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewLeaveApplicationService")
			}	
			
			$scope.leaveApplList = []
			if (data.yearList === undefined){
				//do nothing
			}else{
				$scope.leaveApplList = data.selfLeaveList
			}

            for (var i = 0; i < $scope.leaveApplList.length; i++)
            {
                $scope.leaveApplList[i].designation = sessionStorage.getItem('designation')
                $scope.leaveApplList[i].department = sessionStorage.getItem('department');
                $scope.leaveApplList[i].empName = sessionStorage.getItem('empName');
                $scope.leaveApplList[i].name = sessionStorage.getItem('empName');
                if (sessionStorage.getItem('photoFileName'))
                {
                    $scope.leaveApplList[i].photoFileName = sessionStorage.getItem('photoFileName')
                    $scope.leaveApplList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
                }
                else
                {
                    $scope.leaveApplList[i].photoFileName = ''
                    $scope.leaveApplList[i].profilePhoto = ''
                }
            }
            $ionicLoading.hide()
        }, function (data, status) {
            $ionicLoading.hide()
            showAlert("Approval list couldn't be fetch!!!!!", "Try again");
        });
    }
    $scope.getLeaveRequestList();
    $scope.detailInfoReporty = function (transid, leaveOBJ) {
        $ionicLoading.show({template: 'Loading'});
        $scope.leaveOBJ = leaveOBJ
        $scope.detailResObject = {}
        $scope.detailResObject.leaveTransId = transid

        var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
        $scope.detailResObject.menuId = leaveMenuInfo.menuId;

        $scope.detailResObject.buttonRights = "Y-Y-Y-Y"
        $scope.detailsService = new detailsService();
        $scope.detailsService.$save($scope.detailResObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"detailsService")
			}	
			
            $scope.sendrequesObject.leaveApplyDetail = data.form.leaveAppVo
            $scope.sendrequesObject.leaveReason = data.form.leaveAppVo.leaveReason
            $scope.sendrequesObject.status = data.form.leaveAppVo.leaveStatus
            $scope.sendrequesObject.title = data.form.leaveAppVo
            $scope.sendrequesObject.name = data.form.leaveAppVo.name
            $scope.sendrequesObject.leaveFromDate = data.form.leaveAppVo.leaveFromDate
            $scope.sendrequesObject.leaveToDate = data.form.leaveAppVo.leaveToDate
            $scope.sendrequesObject.phoneNo = data.form.leaveAppVo.phone
            $scope.sendrequesObject.toLeaveType = data.form.leaveAppVo.toLeaveType
            $scope.sendrequesObject.fromLeaveType = data.form.leaveAppVo.fromLeaveType
            $scope.sendrequesObject.address = $scope.sendrequesObject.leaveApplyDetail.address
            $scope.sendrequesObject.phoneNo = sessionStorage.getItem('phoneNumber')
            $scope.sendrequesObject.leaveTransId = transid
            $scope.sendrequesObject.empId = sessionStorage.getItem('empId')
            $scope.sendrequesObject.name = $scope.sendrequesObject.leaveApplyDetail.name
            $scope.sendrequesObject.remarks = $scope.sendrequesObject.leaveApplyDetail.remarks
            var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
            $scope.sendrequesObject.menuId = leaveMenuInfo.menuId;
            $scope.sendrequesObject.leaveTypeId = $scope.sendrequesObject.leaveApplyDetail.leaveTypeId
            $scope.sendrequesObject.leaveBalBefore = $scope.sendrequesObject.leaveApplyDetail.leaveBalBefore
            $scope.sendrequesObject.noDaysCounted = $scope.sendrequesObject.leaveApplyDetail.noDaysCounted
            $scope.sendrequesObject.leaveType = $scope.leaveOBJ.leaveType
            $scope.sendrequesObject.fromLvHr = $scope.sendrequesObject.leaveApplyDetail.fromLvHr
            $scope.sendrequesObject.toLvHr = $scope.sendrequesObject.leaveApplyDetail.toLvHr
            $scope.sendrequesObject.noOfDays = $scope.sendrequesObject.leaveApplyDetail.noOfDays
            $scope.sendrequesObject.leaveLeastCountMsg = $scope.sendrequesObject.leaveApplyDetail.leaveLeastCountMsg
            $scope.sendrequesObject.leaveApproved = $scope.sendrequesObject.leaveApplyDetail.leaveApproved
            $scope.sendrequesObject.leaveInProcess = $scope.sendrequesObject.leaveApplyDetail.leaveInProcess
            $scope.sendrequesObject.currentBalance = $scope.sendrequesObject.leaveApplyDetail.currentBalance
            $scope.sendrequesObject.afterBalance = $scope.sendrequesObject.leaveApplyDetail.afterBalance
            $scope.sendrequesObject.email = $scope.sendrequesObject.leaveApplyDetail.email
            getSetService.set($scope.sendrequesObject)
            $state.go('LeaveDetailPage')
            $ionicLoading.hide()
        }, function (data, status) {
            $ionicLoading.hide()
            showAlert("Leave detail couldn't be fetch!!!!!", "Try again");
        });
    }
    $scope.reDirectToFreshLeavePage = function ()
    {
        $state.go('leaveApplication')
    }
});