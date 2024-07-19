/*
 1.This controller is used for applying shift-change.
 */

mainModule.factory("getShiftListService", function ($resource) {
    return $resource((baseURL + '/api/attendance/shiftChange/viewShiftChange.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});

mainModule.factory("sendForApproveService", function ($resource) {
    return $resource((baseURL + '/api/attendance/shiftChange/sendForApprove.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});

mainModule.controller('shiftChangeCtrl', function ($scope,$rootScope, commonService, $ionicPopup, getShiftListService, getSetService, $ionicPopup, $state, $http, $filter, $ionicLoading,$ionicNavBarDelegate) {
	$rootScope.navHistoryPrevPage="requestShiftChangeList"
	$rootScope.navHistoryCurrPage="shift_change_application"

    $scope.rosterShiftId = {}
    $scope.rosterShiftName = {}
    $scope.shiftMasterChildId = {}
    $scope.resultShiftObj = {}
    $scope.result = {}
    $scope.redirectToShift = {};
    $scope.selectShiftChangeApprovalsList = [];
    $scope.shiftList = []
    $scope.fDate = new Date()
    $scope.tDate = new Date()
	
	$rootScope.reqestPageLastTab = "SC"	
	
    if (getMyHrapiVersionNumber() >= 30) {
        $scope.utf8Enabled = 'true'
      } else {
        $scope.utf8Enabled = 'false'
      }
             
		
		
    $scope.setFromDate = function () {
        if ($scope.resultShiftObj.shiftToDate) {
            $scope.resultShiftObj.shiftToDate = ''
        }
        var date;
        if ($scope.fDate == null) {
            date = new Date();
        }
        else {
            date = $scope.fDate;
        }
        var options = {date: date, mode: 'date', titleText: 'From Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                $scope.fDate = date;
                $scope.selectShiftChangeApprovalsList = [];
                if ($scope.resultShiftObj.toDate) {
                    $scope.resultShiftObj.fromDate = $filter('date')(date, 'dd/MM/yyyy');
                    var compTime = date.getTime() - $scope.tDate.getTime();
                    if (compTime > 0) {
                        showAlert("Set from date", "From date should not be greater than to date")
                        $scope.resultShiftObj.toDate = ""
                        $scope.shiftList = []
                        return
                    }
//                $scope.resultShiftObj.fromDate = $filter('date')(date, 'dd/MM/yyyy');
                    $scope.$apply();
                }
                $scope.resultShiftObj.fromDate = $filter('date')(date, 'dd/MM/yyyy');
                $scope.$apply();
                if ($scope.resultShiftObj.fromDate && $scope.resultShiftObj.toDate)
                {
                    $scope.getShiftListOnload()
                }
            }
        }, function (error) {
        });
    }
	
    $scope.setToDate = function () {
        var date;
        if ($scope.tDate == null) {
            date = new Date();
        }
        else {
            date = $scope.tDate;
        }
        var options = {date: date, mode: 'date', titleText: 'To Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                $scope.tDate = date
                $scope.selectShiftChangeApprovalsList = [];
                if ($scope.resultShiftObj.fromDate) {
                    $scope.resultShiftObj.toDate = $filter('date')(date, 'dd/MM/yyyy');
                    var compTime = $scope.fDate.getTime() - date.getTime();
                    if (compTime > 0) {
                        showAlert("Set to date", "To Date should be greater than or equal to From Date")
                        $scope.resultShiftObj.toDate = ""
                        $scope.shiftList = []
                        return
                    }
                    $scope.resultShiftObj.toDate = $filter('date')(date, 'dd/MM/yyyy');
                    $scope.$apply();
                } else {
                    showAlert("Set to date", "Please select from date first")
                    return
                }
                if ($scope.resultShiftObj.fromDate && $scope.resultShiftObj.toDate)
                {
                    $scope.getShiftListOnload()
                }
            }
        }, function (error) {
        });
    }

    $scope.getShiftListOnload = function () {
        $ionicLoading.show({});
        $scope.shiftList = []
        $scope.lockingPeriod = sessionStorage.getItem('lockingPeriod');
        $scope.todaysDate = new Date();
        $scope.lockingPeriodDate = $scope.todaysDate.setMonth($scope.todaysDate.getMonth() - $scope.lockingPeriod);
        $scope.filteredLockingDate = $filter('date')(new Date($scope.lockingPeriodDate), 'dd/MM/yyyy');
        var shiftChangeMenuInfo = getMenuInformation("Attendance Management", "Shift Change");
        $scope.resultShiftObj.menuId = shiftChangeMenuInfo.menuId;
        $scope.resultShiftObj.empId = sessionStorage.getItem('empId')
        $scope.resultShiftObj.companyId = sessionStorage.getItem('companyId')
        $scope.resultShiftObj.locationId = sessionStorage.getItem('locationId')
        $scope.resultShiftObj.buttonRights = "Y-Y-Y-Y"

        $scope.getShiftListService = new getShiftListService();
        $scope.getShiftListService.$save($scope.resultShiftObj, function (data) {
			
			if(data.shiftList===undefined){
				//do nothing
			}else{
				$scope.shiftList = data.shiftList;
			}
            
            for (var i = 0; i < $scope.shiftList.length; i++) {
                var shift = $scope.shiftList[i];
                if (shift.shiftMasterChildId != shift.rosterShiftId)
                {
                    shift.shiftMasterChildId = "" + shift.shiftMasterChildId;
                }
                else
                {
                    shift.shiftMasterChildId = null;
                }
            }

            var filterDateParts = $scope.filteredLockingDate.split("/");
            var filterDateObject = new Date(filterDateParts[2], filterDateParts[1] - 1, filterDateParts[0]);

            var toDateParts = $scope.resultShiftObj.toDate.split("/");
            var toDateObject = new Date(toDateParts[2], toDateParts[1] - 1, toDateParts[0]);
            if (filterDateObject >= toDateObject || $scope.shiftList.length ==0) {
                showAlert("", "Shift not assigned for selected employee")
                $scope.resultShiftObj.toDate = ""
            }
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    };

    $scope.save = function () {
        $ionicLoading.show({
        });
        $scope.resultSaveObj = {}
        $scope.resultSaveObj.leaveAppVo = {}
        $scope.resultSaveObj.menuId = parseInt($scope.resultObj.menuId)
        $scope.resultSaveObj.buttonRights = 'Y-Y-Y-Y'
        $scope.resultSaveObj.formName = ''
        $scope.resultSaveObj.reasonForLeaveReq = 'yes'
        $scope.resultSaveObj.mobileNumberRequired = 'yes'
        $scope.resultSaveObj.medFile = ''
        $scope.resultSaveObj.leaveAppVo = $scope.dataBuffer
        $scope.resultSaveObj.leaveAppVo.name = sessionStorage.getItem('empName')
        $scope.resultSaveObj.leaveAppVo.empId = parseInt(sessionStorage.getItem('empId'));
        $http({
            url: (baseURL + '/api/leaveApplication/saveLeaveApplication.spr'),
            method: 'POST',
            timeout: commonRequestTimeout,
            transformRequest: jsonTransformRequest,
            data: $scope.resultSaveObj,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + jwtByHRAPI
                }
        }).
                success(function (data) {

                    $scope.resultSaveObj.check = 'SaveApproval'
                    getSetService.set($scope.resultSaveObj)
                    //$state.go('app.RequestList')
                    $scope.redirectOnBack()
                    $ionicLoading.hide()
                    showAlert("Save leave application", "Data saved successfully")
                }).error(function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        })
    };

    $scope.selectShiftChangeApprovals = function (approvals, result)
    {
        var idx2 = $scope.selectShiftChangeApprovalsList.indexOf(approvals);
        if (idx2 > -1) {
            $scope.selectShiftChangeApprovalsList.splice(idx2, 1);
        } else {
            approvals.isAssign = 'true';
            $scope.selectShiftChangeApprovalsList.push(approvals);
        }
    }
    $scope.redirectOnBack = function ()
    {
		$state.go('requestShiftChangeList')
		//$ionicNavBarDelegate.back();
        //$scope.redirectToShift.check = "ShiftChange";
        //getSetService.set($scope.redirectToShift)
        //$state.go('app.RequestList')
    }
    $scope.sendForApproval = function () {
        $ionicLoading.show({});
        $scope.shiftChangeSentForApproveObj = {}
        $scope.shiftChangeSentForApproveObj.shiftChangeVOList = []

        if ($scope.selectShiftChangeApprovalsList.length == 0) {
            $ionicLoading.hide()
            showAlert(" ", "Please select atleast one record")
            $ionicLoading.hide()
            return;
        }

        var shiftChangeMenuInfo = getMenuInformation("Attendance Management", "Shift Change");
        $scope.shiftChangeSentForApproveObj.menuId = shiftChangeMenuInfo.menuId;
        $scope.shiftChangeSentForApproveObj.buttonRights = 'Y-Y-Y-Y'
        $scope.shiftChangeSentForApproveObj.companyId = sessionStorage.getItem('companyId')
        $scope.shiftChangeSentForApproveObj.level = '1'
        $scope.shiftChangeSentForApproveObj.empId = parseInt(sessionStorage.getItem('empId'));
        $scope.shiftChangeSentForApproveObj.toDate = $scope.resultShiftObj.toDate;
        $scope.shiftChangeSentForApproveObj.fromDate = $scope.resultShiftObj.fromDate;
        for (var i = 0; i < $scope.selectShiftChangeApprovalsList.length; i++)
        {
            var temp = {}
            temp.isAssign = $scope.selectShiftChangeApprovalsList[i].isAssign;
            temp.shiftMasterChildId = $scope.selectShiftChangeApprovalsList[i].shiftMasterChildId;
            if (temp.shiftMasterChildId == "" || temp.shiftMasterChildId == null) {
                $ionicLoading.hide()
                showAlert(" ", "Please select shift-change-to for date " + $scope.selectShiftChangeApprovalsList[i].reqDate)
                $ionicLoading.hide()
                return;
            }
            
            temp.reasonToChange = $scope.selectShiftChangeApprovalsList[i].reasonToChange;
            if ($scope.utf8Enabled == "true" && temp){
                if ( temp.reasonToChange){
                    temp.reasonToChange = encodeURI(temp.reasonToChange)
                }
            }


            if (temp.reasonToChange == "" || temp.reasonToChange == null) {
                $ionicLoading.hide()
                showAlert(" ", "Please enter reason for shift change for date " + $scope.selectShiftChangeApprovalsList[i].reqDate)
                $ionicLoading.hide()
                return;
            }
            temp.rosterShiftId = $scope.selectShiftChangeApprovalsList[i].rosterShiftId;
            if (temp.rosterShiftId == temp.shiftMasterChildId)
            {
                $ionicLoading.hide()
                showAlert(" ", "'Roster shift name' and 'Shift change to' can't be same for date" + " " + $scope.selectShiftChangeApprovalsList[i].reqDate)
                $ionicLoading.hide()
                return;
            }
            temp.empId = $scope.selectShiftChangeApprovalsList[i].empId
            temp.reqDate = $scope.selectShiftChangeApprovalsList[i].reqDate
            temp.rosterShiftName = $scope.selectShiftChangeApprovalsList[i].rosterShiftName
            $scope.shiftChangeSentForApproveObj.shiftChangeVOList.push(temp)
        }
        $ionicLoading.hide()
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure',
            template: 'Do you want to send for approval?', //Message
        }
        );
        confirmPopup.then(function (res) {
            if (res) {
                $ionicLoading.show();
                $http({
                    url: (baseURL + '/api/attendance/shiftChange/sendForApprove.spr'),
                    method: 'POST',
                    timeout: commonRequestTimeout,
                    transformRequest: jsonTransformRequest,
                    data: $scope.shiftChangeSentForApproveObj,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer ' + jwtByHRAPI
                        }
                }).
                        success(function (data) {
							if (!(data.clientResponseMsg=="OK")){
								console.log(data.clientResponseMsg)
								handleClientResponse(data.clientResponseMsg,"sendForApprove")
							}
                            $ionicLoading.hide()
                            $scope.message = data.msg;
                            $scope.shiftChangeSentForApproveObj.check = 'sendApproval'
                            //getSetService.set($scope.shiftChangeSentForApproveObj)
                            $ionicLoading.hide()
                            showAlert($scope.message)
                            $ionicLoading.hide()
                            //$scope.redirectOnBackToShift.check = "ShiftChange";
                            //getSetService.set($scope.redirectToShift)
                            $scope.redirectOnBack() 

                        }).error(function (data, status) {
                    var data = {};
                    data.status = status;
                    $ionicLoading.hide()
                    autoRetryCounter = 0
                    commonService.getErrorMessage(data);
                })
                return
            } else {
                return;
            }
        });
    }

	
	
	if (!angular.equals({}, getSetService.get())) {
            $scope.result = getSetService.get()
            if ($scope.result.selectedCalDate) {
                $scope.resultShiftObj.fromDate = $filter('date')($scope.result.selectedCalDate, 'dd/MM/yyyy');
                $scope.resultShiftObj.toDate = $filter('date')($scope.result.selectedCalDate, 'dd/MM/yyyy');
				$scope.getShiftListOnload()
				
				
				
                //$scope.resultObj.year = $scope.result.year;
				//$scope.resultObj.leaveODFromDate = $scope.resultObj.leaveODToDate
				//$scope.fillInTimesInCaseOfAutoDateFill()
            }
        }
		
		
		
    $scope.saveShiftChangeApplication = function () {
        $ionicLoading.show({});
        $scope.shiftChangeSaveObj = {}
        $scope.shiftChangeSaveObj.shiftChangeVOList = []

        if ($scope.selectShiftChangeApprovalsList.length == 0) {
            $ionicLoading.hide()
            showAlert(" ", "Please select atleast one record")
            $ionicLoading.hide()
            return;
        }

        var shiftChangeMenuInfo = getMenuInformation("Attendance Management", "Shift Change");
        $scope.shiftChangeSaveObj.menuId = shiftChangeMenuInfo.menuId;
        $scope.shiftChangeSaveObj.buttonRights = 'Y-Y-Y-Y'
        $scope.shiftChangeSaveObj.companyId = sessionStorage.getItem('companyId')
        $scope.shiftChangeSaveObj.level = '1'
        $scope.shiftChangeSaveObj.empId = parseInt(sessionStorage.getItem('empId'));
        for (var i = 0; i < $scope.selectShiftChangeApprovalsList.length; i++)
        {
            var temp = {}
            temp.isAssign = $scope.selectShiftChangeApprovalsList[i].isAssign;
            temp.shiftMasterChildId = $scope.selectShiftChangeApprovalsList[i].shiftMasterChildId;
            if (temp.shiftMasterChildId == "" || temp.shiftMasterChildId == null) {
                $ionicLoading.hide()
                showAlert(" ", "Please select shift-change-to for date " + $scope.selectShiftChangeApprovalsList[i].reqDate)
                $ionicLoading.hide()
                return;
            }
            temp.reasonToChange = $scope.selectShiftChangeApprovalsList[i].reasonToChange;
            if (temp.reasonToChange == "" || temp.reasonToChange == null) {
                $ionicLoading.hide()
                showAlert(" ", "Please enter reason for shift change for date " + $scope.selectShiftChangeApprovalsList[i].reqDate)
                $ionicLoading.hide()
                return;
            }
            temp.rosterShiftId = $scope.selectShiftChangeApprovalsList[i].rosterShiftId;
            if (temp.rosterShiftId == temp.shiftMasterChildId)
            {
                $ionicLoading.hide()
                showAlert(" ", "'Roster shift name' and 'Shift change to' can't be same for date" + " " + $scope.selectShiftChangeApprovalsList[i].reqDate)
                $ionicLoading.hide()
                return;
            }
            temp.empId = $scope.selectShiftChangeApprovalsList[i].empId
            temp.reqDate = $scope.selectShiftChangeApprovalsList[i].reqDate
            temp.rosterShiftName = $scope.selectShiftChangeApprovalsList[i].rosterShiftName
            $scope.shiftChangeSaveObj.shiftChangeVOList.push(temp)

        }
        $ionicLoading.hide()
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure',
            template: 'Do you want to save?', //Message
        }
        );
        confirmPopup.then(function (res) {
            if (res) {
                $ionicLoading.show();
                $http({
                    url: (baseURL + '/api/attendance/shiftChange/save.spr'),
                    method: 'POST',
                    timeout: commonRequestTimeout,
                    transformRequest: jsonTransformRequest,
                    data: $scope.shiftChangeSaveObj,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer ' + jwtByHRAPI
                        }
                }).
                        success(function (data) {
                            $ionicLoading.hide()
                            $scope.message = data.msg;
                            $scope.shiftChangeSaveObj.check = 'save'
                            getSetService.set($scope.shiftChangeSaveObj)
                            $ionicLoading.hide()
                            showAlert("Save shift change", $scope.message)
                            $ionicLoading.hide()
                            $scope.redirectToShift.check = "ShiftChange";
                            getSetService.set($scope.redirectToShift)
                            $scope.redirectOnBack() 

                        }).error(function (data, status) {
                    var data = {};
                    data.status = status;
                    $ionicLoading.hide()
                    autoRetryCounter = 0
                    commonService.getErrorMessage(data);
                })
                return
            } else {
                return;
            }
        });
    }
	/*
	//in case of edit needed
	//get the roosScope variables and put in the following date vars.
	$scope.resultShiftObj.fromDate = "14/02/2019"
	$scope.resultShiftObj.toDate = "14/02/2019"
	$scope.getShiftListOnload()
	*/
});
