/*
 1.This controller is used for applying Attendance Regularisation with Edit functionality.
 */

mainModule.factory("getShiftTimeService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/attendance/missPunch/getShiftTime.spr'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                 }
            }
        }, {});
    }]);
mainModule.factory("viewMissPunchByDateService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/attendance/missPunch/viewMissPunchByDate.spr'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                 }
            }
        }, {});
    }]);
	//not used
mainModule.controller('attendance___RegularCtrl', function ($scope, $rootScope,commonService, $state, $ionicPopup, $ionicLoading, $http, $filter, viewMissPunchByDateService, $ionicLoading, getSetService, getShiftTimeService,$ionicNavBarDelegate) {


	$rootScope.navHistoryPrevPage=$rootScope.navHistoryCurrPage
	//$rootScope.navHistoryCurrPage="attendance_regularisation"
	$rootScope.navHistoryPrevTab="ATTREG"	
	
	
    $scope.attendanceRegularObj = {}
    $scope.result = {};
    $scope.onloadRequestObj = {}
    $scope.onloadResponseObj = {}
    $scope.fDate = new Date()
    var tym = new Date();
    $scope.inTimeStr = ""
    $scope.outTimeStr = ""
    $scope.hidebutton = false
    $scope.currenttime = $filter('date')(tym, 'shortTime');
    $scope.attendanceRegularObj.selectedDate = $filter('date')(new Date(), 'dd/MM/yyyy');
    $scope.attendanceRegularObj.actualTimeIn = "";
    $scope.attendanceRegularObj.timeIn = "";
    $scope.attendanceRegularObj.actualTimeOut = "";
    $scope.attendanceRegularObj.timeOut = "";
    $scope.editable = true;
    $scope.filterLeave = {
        member: 'sickLeave'
    }
    if (!angular.equals({}, getSetService.get())) {
        $scope.result = getSetService.get()
        if ($scope.result.selectedCalDate) {
            $scope.attendanceRegularObj.selectedDate = $filter('date')($scope.result.selectedCalDate, 'dd/MM/yyyy');
            $scope.onloadRequestObj.attendanceDate = $filter('date')($scope.result.selectedCalDate, 'MM/dd/yyyy');
        }
        $scope.emptyObject = {}
        getSetService.set($scope.emptyObject)
    }
    $scope.onload = function () {
        $scope.hidebutton = false;
        $ionicLoading.show({});
        $scope.applyingLeaves = []
        $scope.onloadRequestObj.buttonRights = "Y-Y-Y-Y"

        var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");
        $scope.onloadRequestObj.menuId = attendanceMenuInfo.menuId;
        $scope.onloadRequestObj.fromEmail = "N"
        $scope.onloadRequestObj.listYear = $scope.result.year
        $scope.onloadRequestObj.monthId = $scope.result.month

        $scope.viewMissPunchByDateService = new viewMissPunchByDateService()
        $scope.viewMissPunchByDateService.$save($scope.onloadRequestObj, function (data) {
			
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewMissPunchByDateService")
			}	
			
            $scope.applyingLeaves = data.missedPunchForm.remarksList

            if (data.missedPunchForm.missedPunchVOList.length == 0) {
                $scope.inTimeStr = ""
                $scope.outTimeStr = ""
                $ionicLoading.hide()
            }

            if (data.missedPunchForm.missedPunchVOList.length > 0) {
                // data recived
                $scope.onloadResponseObj.status = data.missedPunchForm.missedPunchVOList[0].status
                $scope.onloadResponseObj.attDate = data.missedPunchForm.missedPunchVOList[0].attDate
                $scope.onloadResponseObj.fhOLStatus = data.missedPunchForm.missedPunchVOList[0].fhOLStatus
                $scope.onloadResponseObj.shOLStatus = data.missedPunchForm.missedPunchVOList[0].shOLStatus
                $scope.onloadResponseObj.isODPresent = data.missedPunchForm.missedPunchVOList[0].isODPresent
                $scope.onloadResponseObj.isLeavePresent = data.missedPunchForm.missedPunchVOList[0].isLeavePresent
                $scope.onloadResponseObj.lateComming = data.missedPunchForm.missedPunchVOList[0].lateComming
                $scope.onloadResponseObj.earlyGoing = data.missedPunchForm.missedPunchVOList[0].earlyGoing
                $scope.onloadResponseObj.shiftMasterChild = data.missedPunchForm.missedPunchVOList[0].shiftMasterChild
                $scope.onloadResponseObj.workedHrs = data.missedPunchForm.missedPunchVOList[0].workedHrs
                $scope.onloadResponseObj.remarks = data.missedPunchForm.missedPunchVOList[0].remarks
                $scope.onloadResponseObj.othRemarks = data.missedPunchForm.missedPunchVOList[0].othRemarks
                $scope.onloadResponseObj.appRemarks = data.missedPunchForm.missedPunchVOList[0].appRemarks
                $scope.onloadResponseObj.isAssign = data.missedPunchForm.missedPunchVOList[0].isAssign
                $scope.onloadResponseObj.transId = data.missedPunchForm.missedPunchVOList[0].transId
                $scope.onloadResponseObj.firstHalf = data.missedPunchForm.missedPunchVOList[0].firstHalf
                $scope.onloadResponseObj.secondHalf = data.missedPunchForm.missedPunchVOList[0].secondHalf
                $scope.onloadResponseObj.inTimeStr = data.missedPunchForm.missedPunchVOList[0].inTimeStr
                $scope.onloadResponseObj.outTimeStr = data.missedPunchForm.missedPunchVOList[0].outTimeStr
                $scope.onloadResponseObj.actualInTimeStr = data.missedPunchForm.missedPunchVOList[0].actualInTimeStr
                $scope.onloadResponseObj.actualOutTimeStr = data.missedPunchForm.missedPunchVOList[0].actualOutTimeStr;
                if ($scope.onloadResponseObj.status == "SENT FOR APPROVAL") {
                    window.plugins.toast.showWithOptions(
                            {
                                message: "Already sent for approval for date" + " " + $scope.onloadResponseObj.attDate,
                                duration: "long",
                                position: "center",
                                addPixelsY: -40
                            }
                    )
                    $scope.attendanceRegularObj.selectedDate = ''
                    $scope.hidebutton = true
                    $ionicLoading.hide()
                    return
                } else if ($scope.onloadResponseObj.status == "APPROVED") {
                    window.plugins.toast.showWithOptions(
                            {
                                message: "Already  approved for date" + " " + $scope.onloadResponseObj.attDate,
                                duration: "long",
                                position: "center",
                                addPixelsY: -40
                            }
                    )
                    //$scope.attendanceRegularObj.selectedDate = ''
                   // $scope.hidebutton = true
                   $scope.hidebutton = false;
                    $ionicLoading.hide()
                    return
                } else if ($scope.onloadResponseObj.status == "REJECTED") {
                    window.plugins.toast.showWithOptions(
                            {
                                message: "Already  rejected for date" + " " + $scope.onloadResponseObj.attDate,
                                duration: "long",
                                position: "center",
                                addPixelsY: -40
                            }
                    )
                    $scope.hidebutton = false;
                    $ionicLoading.hide()
                    return
                } else if ($scope.onloadResponseObj.firstHalf == "On Leave" || $scope.firstHalf == "On Leave") {
                    window.plugins.toast.showWithOptions(
                            {
                                message: "Leave applied for date" + " " + $scope.onloadResponseObj.attDate,
                                duration: "long",
                                position: "center",
                                addPixelsY: -40
                            }
                    )
                    //$scope.attendanceRegularObj.selectedDate = ''
                    //$scope.hidebutton = true
                    $ionicLoading.hide()
                    return
                } else if ($scope.onloadResponseObj.firstHalf == "On Duty" || $scope.firstHalf == "On Duty") {
                    window.plugins.toast.showWithOptions(
                            {
                                message: "OD applied for date" + " " + $scope.onloadResponseObj.attDate,
                                duration: "long",
                                position: "center",
                                addPixelsY: -40
                            }
                    )
                   //$scope.attendanceRegularObj.selectedDate = ''
                    //$scope.hidebutton = true
                    $ionicLoading.hide()
                    return
                }
            }
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
    if (!angular.equals({}, $scope.result)) {
        $scope.onload();
    }
    else {
        $scope.hidebutton = true;
        $scope.attendanceRegularObj.selectedDate = '';
    }
    $scope.apply = function () {
        if ($scope.inTimeStr > $scope.outTimeStr) {
            showAlert("To time should be greater than from time")
            return;
        }

        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure',
            template: 'Do you want to send for approval?', //Message
        });
        confirmPopup.then(function (res) {
            if (res) {
                $scope.sendForApproval()
                return
            } else {
                $scope.attendanceRegularObj.timeIn = ''
                $scope.attendanceRegularObj.timeOut = ''
                return;
            }
        });
    }
    $scope.sendForApproval = function () {
        $ionicLoading.show({});
        $scope.sendForApproveRequestObject = {}
        $scope.sendForApproveRequestObject.missedPunchVOList = []
        var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");
        $scope.sendForApproveRequestObject.menuId = attendanceMenuInfo.menuId;
        $scope.sendForApproveRequestObject.buttonRights = "Y-Y-Y-Y"
        var temp = {}
        //data send for anpproved
        if(!$scope.onloadResponseObj.attDate)
        {
            $ionicLoading.hide()
            showAlert("Attendance regularization ", "Either shift not available or locking period passed away for selected criteria");
            return;
        }
        temp.attDate = $scope.onloadResponseObj.attDate
        temp.fhOLStatus = $scope.onloadResponseObj.fhOLStatus
        temp.shOLStatus = $scope.onloadResponseObj.shOLStatus
        temp.isODPresent = $scope.onloadResponseObj.isODPresent
        temp.isLeavePresent = $scope.onloadResponseObj.isLeavePresent
        temp.firstHalf = $scope.onloadResponseObj.firstHalf
        temp.secondHalf = $scope.onloadResponseObj.secondHalf
        temp.actualInTimeStr = $scope.onloadResponseObj.actualInTimeStr
        temp.actualOutTimeStr = $scope.onloadResponseObj.actualOutTimeStr
        temp.lateComming = $scope.onloadResponseObj.lateComming
        temp.inTimeStr = $scope.inTimeStr
        temp.outTimeStr = $scope.outTimeStr
        temp.earlyGoing = $scope.onloadResponseObj.earlyGoing
        temp.outTimeDateStr = $scope.attendanceRegularObj.selectedDate
        temp.shiftMasterChild = $scope.onloadResponseObj.shiftMasterChild
        temp.workedHrs = $scope.onloadResponseObj.workedHrs
        temp.remarks = $scope.attendanceRegularObj.remarks
        temp.status = $scope.onloadResponseObj.status
        temp.transId = $scope.onloadResponseObj.transId
        temp.isAssign = true
        temp.appRemarks = " ";
        temp.othRemarks = " ";
        $scope.sendForApproveRequestObject.missedPunchVOList.push(temp)
        $scope.sendForApproveRequestObject.leaveAppId = 216
        $scope.sendForApproveRequestObject.odAppId = 212
        $scope.sendForApproveRequestObject.year = $scope.result.year
        $scope.sendForApproveRequestObject.monthId = $scope.result.month
        $scope.sendForApproveRequestObject.sendForApp = "YES"
        $scope.sendForApproveRequestObject.level = 1
        $http({
            url: (baseURL + '/api/attendance/missPunch/sendForApprove.spr'),
            method: 'POST',
            timeout: commonRequestTimeout,
            transformRequest: jsonTransformRequest,
            data: $scope.sendForApproveRequestObject,
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).
                success(function (data) {
                    var masgBefore = data.msg
                    var masgAfter = masgBefore.replace(/\\n/g, "");
                    $ionicLoading.hide()
                    showAlert("Attendance regularization ", masgAfter)
                    $scope.resultSaveObj = {}
                    $scope.resultSaveObj.check = "Regularization";
                    getSetService.set($scope.resultSaveObj)
                    $state.go('app.RequestList')
                }).error(function (data, status) {
            $scope.data = {status: status};
            commonService.getErrorMessage($scope.data);
            $ionicLoading.hide()
        })
    }
    $scope.editAttendanceRegularization = function () {
        if ($scope.onloadResponseObj.actualInTimeStr == "--:--" && $scope.onloadResponseObj.actualOutTimeStr == "--:--")
        {
            $scope.requestObject = {}
            $scope.requestObject.shiftChildId = $scope.onloadResponseObj.shiftMasterChild;
            $scope.requestObject.attDate = $scope.onloadResponseObj.attDate;
            $scope.getShiftTimeService = new getShiftTimeService();
            $scope.getShiftTimeService.$save($scope.requestObject, function (data) {

			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"getShiftTimeService")
			}				
				
                $scope.inTimeStr = data.missedPunchVO.inTimeStr
                $scope.outTimeStr = data.missedPunchVO.outTimeStr

                $scope.actualInTimeStr = data.missedPunchVO.inTimeStr
                $scope.actualOutTimeStr = data.missedPunchVO.outTimeStr

                $scope.actualTimeInStr = data.missedPunchVO.actualInTimeStr
                $scope.actualTimeOutStr = data.missedPunchVO.actualOutTimeStr
            }, function (data) {
                autoRetryCounter = 0
                $ionicLoading.hide()
                commonService.getErrorMessage(data);
            });
        }
        $scope.editable = false;
    }
    $scope.setFromDate = function () {
        var date;
        if ($scope.attendanceRegularObj.selectedDate == undefined)
        {
            $scope.attendanceRegularObj.selectedDate = "";
        }
        if ($scope.attendanceRegularObj.selectedDate != "") {
            var parts = $scope.attendanceRegularObj.selectedDate.split('/');
            $scope.fDate = new Date(parts[2], parts[1] - 1, parts[0]);
        }
        if ($scope.fDate == null) {
            date = new Date();
        }
        else {
            date = $scope.fDate;
        }
        var options = {date: date, mode: 'date', titleText: 'Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                $scope.filteredSelectedCalDate = new Date(date)
                $scope.lockingPeriod = sessionStorage.getItem('lockingPeriod');
                $scope.todaysDate = new Date();
                $scope.filteredtodaysDat = new Date($scope.todaysDate)
                $scope.lockingPeriodDate = $scope.todaysDate.setMonth($scope.todaysDate.getMonth() - $scope.lockingPeriod);
                $scope.filteredLockingDate = new Date($scope.lockingPeriodDate)

                if (($scope.filteredSelectedCalDate <= $scope.filteredLockingDate)) {

                    $scope.hidebutton = true;
                    $scope.attendanceRegularObj.selectedDate = '';
                    showAlert("Either shift not available or locking period passed away for selected criteria");
                    $ionicLoading.hide()
                }
                else if (($scope.filteredtodaysDat < $scope.filteredSelectedCalDate)) {

                    $scope.hidebutton = true;
                    $scope.attendanceRegularObj.selectedDate = '';
                    showAlert("You cannot apply attendance regularization for future date");
                    $ionicLoading.hide()
                }
                else if (($filter('date')($scope.filteredtodaysDat, 'yyyy/MM/dd')) == ($filter('date')($scope.filteredSelectedCalDate, 'yyyy/MM/dd'))) {

                    $scope.hidebutton = true;
                    $scope.attendanceRegularObj.selectedDate = '';
                    showAlert("You cannot regularization for current date");
                    $ionicLoading.hide()
                }
                else
                {
                    $scope.fDate = date

                    $scope.attendanceRegularObj.selectedDate = $filter('date')(date, 'dd/MM/yyyy');
                    $scope.onloadRequestObj.attendanceDate = $filter('date')(date, 'MM/dd/yyyy');
                    $scope.result.year = date.getFullYear();
                    $scope.result.month = date.getMonth() + 1;
                    $scope.hidebutton = false;
                    $scope.$apply();
                    $scope.onload();
                }
            }
        }, function (error) {
        });
        $scope.inTimeStr = '';
        $scope.outTimeStr = '';
        $scope.editable = true;
    }
    $scope.setTimeIn = function () {
        var date = new Date();
        if ($scope.inTimeStr != "") {
            var timePart = $scope.inTimeStr.split(':');
            date.setHours(timePart[0]);
            date.setMinutes(timePart[1]);
        }
        var options = {date: date, mode: 'time', titleText: 'Time In', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                $scope.inTimeStr = $filter('date')(date, 'HH:mm');
                $scope.onloadResponseObj.inTimeStr = $scope.inTimeStr
                $scope.TimeInObj = date
                $scope.$apply();
            }
        }, function (error) {
        });
    }
    $scope.setTimeOut = function () {
        var date = new Date();
        if ($scope.outTimeStr != "") {
            var timePart = $scope.outTimeStr.split(':');
            date.setHours(timePart[0]);
            date.setMinutes(timePart[1]);
        }
        var options = {date: date, mode: 'time', titleText: 'Time Out', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                if ($scope.inTimeStr) {
                    if (date < $scope.TimeInObj) {
                        showAlert("“To time” should be greater than “from time”")
                        return
                    }
                }
                $scope.outTimeStr = $filter('date')(date, 'HH:mm');
                $scope.onloadResponseObj.outTimeStr = $scope.outTimeStr
                $scope.TimeOutObj = date
                $scope.$apply();
            }
        }, function (error) {
        });
    }
    $scope.redirectOnBack = function ()
    {
		$state.go('app.RequestListCombined')
		//$ionicNavBarDelegate.back();
		
        //$scope.result.check = "Regularization";
        //getSetService.set($scope.result);
        //$state.go('app.RequestList');
    }
});

