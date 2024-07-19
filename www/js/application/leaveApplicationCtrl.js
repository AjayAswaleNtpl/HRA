/*
 1.This controller is used for applying leaves.
 */

mainModule.factory("getBalanceLeaveCountService", function ($resource) {
    return $resource((baseURL + '/api/leaveApplication/getLeaveBal.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("getValidateLeaveService", function ($resource) {
    return $resource((baseURL + '/api/leaveApplication/validateForLeaveApplication.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("getLeaveMasterService", function ($resource) {
    return $resource((baseURL + '/api/leaveApplication/getLeaveMaster.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("getSelfLeaveService", function ($resource) {
    return $resource((baseURL + '/api/leaveApplication/addSelfLeaveApplication.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("getFindWorkFlowService", function ($resource) {
    return $resource((baseURL + '/api/leaveApplication/findWorkFlowApprover.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.controller('leaveApplicationCtrl', function ($scope,$rootScope, commonService, $ionicHistory, $rootScope, $ionicPopup, getFindWorkFlowService, getSetService, getSelfLeaveService, getValidateLeaveService, $state, $http, $q, $filter, $ionicLoading, getBalanceLeaveCountService, getLeaveMasterService,
$ionicNavBarDelegate) {
	$rootScope.navHistoryPrevPage="requestLeaveList"

	$rootScope.reqestPageLastTab = "LEAVE"

    $ionicLoading.show();
    $scope.selectedFileName = ''
    $scope.resultObj = {}
    $scope.dataBuffer = {}
    $scope.dataBuffer.leaveReason = ''
    $scope.dataBuffer.phone = ''
    $scope.resultObj.fromLeaveType = 'fullDay'
    $scope.resultObj.toLeaveType = 'fullDay'
    $scope.resultObj.leaveTypeId = ''
    $scope.dataBuffer.afterBalance = ''
    $scope.dataBuffer.noDaysCounted = ''
    if (sessionStorage.getItem('phoneNumber') && sessionStorage.getItem('phoneNumber') != 'null') {
        $scope.dataBuffer.phone = parseInt(sessionStorage.getItem('phoneNumber'))
    }
    $scope.getTotalTimeDiff = ''
    $scope.resultObj.empId = sessionStorage.getItem('empId');
    var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
    $scope.resultObj.menuId = leaveMenuInfo.menuId;
    $scope.resultObj.fromLvHr = "HH:MM"
    $scope.resultObj.toLvHr = "HH:MM"
    $scope.resultObj.leaveTransId = '';
    $scope.isValidateForLeave = false
    $scope.listOfdays = []
    //FOR SAVE API PARAMETERS
    $scope.resultSaveObj = {}
    $scope.resultSaveObj.leaveAppVo = {}
    //FOR SEND FOR APPROVAL API PARAMETERS
    $scope.resultSentForApproveObj = {}
    $scope.resultSentForApproveObj.leaveAppVo = {}
    $scope.fDate = new Date()
    $scope.tDate = new Date()
    $scope.listOfLeave = [];
	$scope.selectedFileNameFromDevice = ""
	
	

	
	if  ($rootScope.app_product_name =="QUBE"){
		//if product is qube
		$scope.fileUploadFeatureIncluded = 'false'
	}
	else{
		if ( getMyHrapiVersionNumber() >= 18){

			$scope.fileUploadFeatureIncluded = 'true'
		}else{
			$scope.fileUploadFeatureIncluded = 'false'
        }
        if ( getMyHrapiVersionNumber() >= 24){
            $scope.hourlyLeaveFeature = 'true'
		}else{
			$scope.hourlyLeaveFeature = 'false'
        }
        if ( getMyHrapiVersionNumber() >= 30){
            $scope.utf8Enabled = 'true'    
        }else{
            $scope.utf8Enabled = 'false'    
        }

	}

	
    $scope.fromToTypeCondition = function (type, flag) {
        if (!$scope.resultObj.leaveFromDate && !$scope.resultObj.leaveToDate) {
            $scope.resultObj.toLeaveType = type
            return;
        }
        if ($scope.resultObj.leaveFromDate || $scope.resultObj.leaveToDate) {
            $scope.resultObj.toLeaveType = type
            return;
        }
        if ($scope.resultObj.leaveFromDate == $scope.resultObj.leaveToDate) {
            $scope.resultObj.toLeaveType = type
            $scope.getMasterListOnload();
            $scope.getShiftOnDate()
        }
    }

    $scope.tempFunction = function () {
        if ($scope.resultObj.fromLeaveType == 'shortLeave' && $scope.resultObj.toLeaveType != 'shortLeave' || $scope.resultObj.fromLeaveType != 'shortLeave' && $scope.resultObj.toLeaveType == 'shortLeave') {
            showAlert("", "From date and to date must be short leave")
            $scope.resultObj.leaveToDate = ''
        }
        if ($scope.resultObj.leaveFromDate && $scope.resultObj.leaveToDate && $scope.resultObj.fromLeaveType) {
            $scope.getMasterListOnload();
            $scope.getShiftOnDate()
            return;
        }
    }
    $scope.getValidateLeaveOnload = function (success) {
        $scope.validObj = {};
        $scope.validObj.empId = sessionStorage.getItem('empId')
        $scope.validObj.menuId = leaveMenuInfo.menuId;
        $ionicLoading.show({});
        $scope.getValidateLeaveService = new getValidateLeaveService();
        $scope.getValidateLeaveService.$save($scope.validObj, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"getValidateLeaveService")
			}

            if (!data.msg) {
                $scope.isValidateForLeave = true;
                success();
                $scope.getSelfLeaveOnload();
                $ionicLoading.hide()
            } else {
                showAlert("Error", data.msg);
                $ionicLoading.hide()
                //$state.go('app.RequestList');
                $scope.redirectOnBack()
            }
        }, function (data) {
            autoRetryCounter = 0
            $scope.isValidateForLeave = false
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    };

    $scope.getSelfLeaveOnload = function () {
        $scope.selfObj = {}
        $scope.selfObj.empId = sessionStorage.getItem('empId')
        $scope.selfObj.buttonRights = 'Y-Y-Y-Y'
        $scope.selfObj.formName = 'Leave Application'
        $scope.selfObj.leaveflag = ''

        //        var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
        $scope.selfObj.menuId = leaveMenuInfo.menuId;
        $scope.selfObj.inTime = ''
        $scope.selfObj.outTime = ''
        $ionicLoading.show({
        });
        $scope.getSelfLeaveService = new getSelfLeaveService();
        $scope.getSelfLeaveService.$save($scope.selfObj, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"getSelfLeaveService")
			}
			$scope.listOfdays = []
			if (data.leaveList === undefined)
			{
				//do nothing
			}else{
				$scope.listOfdays = data.leaveList
			}
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    };
    $scope.setFromDate = function () {
        var date;

        if ($scope.resultObj.leaveFromDate == undefined) {

            $scope.resultObj.leaveFromDate = "";
        }
        else if ($scope.resultObj.leaveFromDate != "") {
            var parts = $scope.resultObj.leaveFromDate.split('/');
            $scope.fDate = new Date(parts[2], parts[1] - 1, parts[0]);
        }
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
                $scope.fDate = date
                $scope.Dat = $filter('date')(date, 'dd/MM/yyyy');
                var compTimeForFrom = $scope.fDate.getTime() - new Date().getTime()
                if ($scope.resultObj.leaveToDate) {
                    var compTime = $scope.tDate.getTime() - date.getTime();
                    if (compTime < 0) {
                        showAlert("Set from date", "Leave from date must be less than to date")
                        $scope.resultObj.leaveFromDate = $scope.resultObj.leaveToDate = ''
                        $scope.dataBuffer.noDaysCounted = ''
                        $scope.getTotalTimeDiff = ''
                        $scope.fromToTypeCondition($scope.resultObj.fromLeaveType)
                        return
                    }
                    $scope.resultObj.leaveFromDate = $filter('date')(date, 'dd/MM/yyyy');
                    $scope.$apply();
                    if ($scope.resultObj.leaveFromDate && $scope.resultObj.leaveToDate) {
                        $scope.getMasterListOnload()
                        $scope.getShiftOnDate()
                    }
                } else {
                    $scope.resultObj.leaveFromDate = $filter('date')(date, 'dd/MM/yyyy');
                    $scope.$apply();
                    if ($scope.resultObj.leaveFromDate && $scope.resultObj.leaveToDate) {
                        $scope.getMasterListOnload()
                        $scope.getShiftOnDate()
                    }
                }
                if ($scope.resultObj.leaveToDate && $scope.resultObj.leaveFromDate) {
                    if ($scope.resultObj.fromLeaveType == 'shortLeave' && $scope.resultObj.toLeaveType == 'shortLeave' && $scope.resultObj.leaveToDate != $scope.resultObj.leaveFromDate) {
                        showAlert("Leave type", "From and to date should be same for short leave")
                        $scope.resultObj.leaveFromDate = ''
                        return
                    } else if ($scope.resultObj.fromLeaveType == 'shortLeave' && $scope.resultObj.leaveFromDate != $scope.resultObj.leaveToDate) {
                        showAlert("Leave Type", "From and to date should be same for short leave")
                        $scope.resultObj.leaveFromDate = ''
                        return
                    }
                }
                $scope.fromToTypeCondition($scope.resultObj.fromLeaveType)
            }
        }, function (error) {
        });
    }
    $scope.setToDate = function () {
        var date;
        if ($scope.resultObj.leaveToDate == undefined) {
            $scope.resultObj.leaveToDate = "";
        }
        else if ($scope.resultObj.leaveToDate != "") {
            var parts = $scope.resultObj.leaveToDate.split('/');
            $scope.tDate = new Date(parts[2], parts[1] - 1, parts[0]);
        }
        if ($scope.tDate == null) {
            date = new Date();
        }
        else {
            date = $scope.tDate;
        }
        $scope.DiffDays = {}

        var options = {date: date, mode: 'date', titleText: 'To Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                $scope.tDate = date
                if ($scope.resultObj.leaveFromDate) {
                    $scope.resultObj.leaveToDate = $filter('date')(date, 'dd/MM/yyyy');
                    var compTime = $scope.fDate.getTime() - date.getTime();
                    if (compTime > 0) {
                        showAlert("Error!!", "Leave From Date must be less than leave To Date !")
                        $scope.resultObj.leaveToDate = ''
                        $scope.dataBuffer.noDaysCounted = ''
                        $scope.fromToTypeCondition($scope.resultObj.fromLeaveType)
                        return
                    }
                    if ($scope.resultObj.leaveToDate && $scope.resultObj.leaveFromDate) {
                        if ($scope.resultObj.fromLeaveType == 'shortLeave' && $scope.resultObj.toLeaveType == 'shortLeave' && $scope.resultObj.leaveToDate != $scope.resultObj.leaveFromDate) {
                            showAlert("Leave type", "From and to date should be same for short leave")
                            $scope.resultObj.leaveToDate = ''
                            return
                        } else if ($scope.resultObj.toLeaveType == 'shortLeave' && $scope.resultObj.leaveFromDate != $scope.resultObj.leaveToDate) {
                            showAlert("Leave type", "From and to date should be same for short leave")
                            $scope.resultObj.leaveToDate = ''
                            return
                        } else if ($scope.resultObj.fromLeaveType != $scope.resultObj.toLeaveType && $scope.resultObj.leaveFromDate == $scope.resultObj.leaveToDate) {
                            showAlert("Leave Period", "Leave Period should be same for the same 'from Date' and 'to Date'.")
                            $scope.resultObj.leaveToDate = ''
                            //$scope.resultObj.toLeaveType = $scope.resultObj.fromLeaveType
                            return
                        }
                    }
                    $scope.resultObj.leaveToDate = $filter('date')(date, 'dd/MM/yyyy');
                    $scope.$apply();
                    if ($scope.resultObj.leaveFromDate && $scope.resultObj.leaveToDate) {
                        $scope.getMasterListOnload()
                        $scope.getShiftOnDate()
                    }
                    if ($scope.resultObj.leaveToDate && $scope.resultObj.leaveFromDate && $scope.resultObj.leaveTypeId) {
                        $scope.getBalLeave()
                    }
                } else {
                    showAlert("Set to date", "Please select from date first")
                    return
                }
            }
        }, function (error) {
        });
        $scope.selectedFileName = ''
    }
    $scope.setFromTime = function () {
        var options = {date: new Date(), mode: 'time', titleText: 'From Time', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                $scope.resultObj.fromLvHr = $filter('date')(date, 'HH:mm');
				$scope.getTimeDifference()
                $scope.fromTimeObj = date
                $scope.$apply();
            }
        })
    }

    $scope.setToTime = function () {
        var options = {date: new Date(), mode: 'time', titleText: 'To Time', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                if ($scope.resultObj.fromLvHr) {
                    if (date < $scope.fromTimeObj) {
                        showAlert("", "From time should be less than to time")
                        $scope.getTotalTimeDiff = ''
                        return
                    }
                    if ($scope.resultObj.leaveFromDate && $scope.resultObj.leaveToDate) {
                        $scope.getMasterListOnload()
                        $scope.getShiftOnDate()
                    }
                }
                $scope.resultObj.toLvHr = $filter('date')(date, 'HH:mm');
                $scope.getTimeDifference();
                $scope.$apply();
            }
        })
    }

    $scope.getTimeDifference = function () {
        /*var timeDiffInFloat1 =  parseFloat($scope.resultObj.toLvHr.replace(":", ".")) - parseFloat($scope.resultObj.fromLvHr.replace(":", "."));

        var timeDiffInFloat = timeDiffInFloat1.toFixed(2).toString();

		$scope.getTotalTimeDiff = timeDiffInFloat;
        if(parseInt(timeDiffInFloat.split('.')[1]) < 30){
            $scope.getTotalTimeDiff = parseInt(timeDiffInFloat.split('.')[0]);
        }else{
            $scope.getTotalTimeDiff = parseInt(timeDiffInFloat.split('.')[0]) + 1;
        }
		*/
		var fromHH,toHH,fromMin,toMin, minutesDiff
		fromHH = $scope.resultObj.fromLvHr.replace(":", ".").split('.')[0]
		toHH = $scope.resultObj.toLvHr.replace(":", ".").split('.')[0]
		fromMin = $scope.resultObj.fromLvHr.replace(":", ".").split('.')[1]
		toMin = $scope.resultObj.toLvHr.replace(":", ".").split('.')[1]



		if (toMin >= fromMin){
			minutesDiff = (toHH - fromHH)*60 + (toMin - fromMin)
		}
		else{
			minutesDiff = (toHH - fromHH -1)*60 + (60-( fromMin - toMin))
		}

		if ((minutesDiff % 60) < 10){
			$scope.getTotalTimeDiff = parseInt(minutesDiff/60) + ".0" + (minutesDiff % 60)
			if (isNaN($scope.getTotalTimeDiff)){
                $scope.getTotalTimeDiff = ''
            }
		}else{
			$scope.getTotalTimeDiff = parseInt(minutesDiff/60) + "." + (minutesDiff % 60)
			if (isNaN($scope.getTotalTimeDiff)){
                $scope.getTotalTimeDiff = ''
            }
		}

    }

    $scope.getBalLeave = function () {

        if (!$scope.resultObj.leaveFromDate || !$scope.resultObj.leaveToDate) {
            showAlert("", "Please select from date/to date")
            return
        }
        if ($scope.resultObj.toLeaveType == 'shortLeave' && $scope.resultObj.fromLeaveType == 'shortLeave') {
            if ($scope.resultObj.leaveToDate > $scope.resultObj.leaveFromDate) {
                showAlert("", "For short leave ,Date should be of same Day")
                return
            }
            else if ($scope.resultObj.leaveToDate < $scope.resultObj.leaveFromDate) {
                showAlert("", "For short leave ,Date should be of same Day")
                return
            }
            else if ($scope.resultObj.fromLvHr == "HH:MM" || $scope.resultObj.toLvHr == "HH:MM") {
                showAlert("", "please select Time");
                $scope.resultObj.leaveTypeId = '';
                return
            }
        }
        if (!$scope.resultObj.leaveTypeId) {
            return
        }
        $ionicLoading.show({});
        $scope.getBalanceLeaveCountService = new getBalanceLeaveCountService();
        $scope.getBalanceLeaveCountService.$save($scope.resultObj, function (success) {
			if (!(success.clientResponseMsg=="OK")){
				console.log(success.clientResponseMsg)
				handleClientResponse(success.clientResponseMsg,"getBalanceLeaveCountService")
			}

            if (success.leaveApplicationVO == null || success.leaveApplicationVO === undefined ) {
                $scope.dataBuffer.leaveBalance = 0
                $scope.dataBuffer.noDaysCounted = ''
                $ionicLoading.hide();
                return;
            }
            if (success.leaveApplicationVO.msg) {
                $ionicLoading.show({});
                showAlert(" ", success.leaveApplicationVO.msg)
                $scope.resultObj.leaveTypeId = ''
                $ionicLoading.hide()
                return
            }
            $scope.isUpload = success.leaveApplicationVO.isUpload;
            $scope.fromDatee = success.leaveApplicationVO.leaveFromDate;
            $scope.toDatee = success.leaveApplicationVO.leaveToDate;


            if(success.leaveApplicationVO.isPrifix || success.leaveApplicationVO.isSuffix)
            {
                showAlert("Applied leave period has been changed as per HR policies.", "Original leave applied From" + " " + $scope.resultObj.leaveFromDate + " " + "to" + " " + $scope.resultObj.leaveToDate + " " + "date which is changed to From" + " " + $scope.fromDatee + " " + "to" + " " + $scope.toDatee + " " + "date.");
                $scope.resultObj.leaveFromDate = $scope.fromDatee;
                $scope.resultObj.leaveToDate = $scope.toDatee;
            }

            if(success.leaveApplicationVO.isLeastCountFlag != null){
                if(success.leaveApplicationVO.leastCount != 0) {
                if(success.leaveApplicationVO.leaveFromDate != null){
                    showAlert("Applied leave period has been changed as per HR policies.", "Original leave applied From" + " " + $scope.resultObj.leaveFromDate + " " + "to" + " " + $scope.resultObj.leaveToDate + " " + "date which is changed to From" + " " + $scope.fromDatee + " " + "to" + " " + $scope.toDatee + " " + "date.");
                    $scope.resultObj.leaveFromDate = $scope.fromDatee;
                }
                if(success.leaveApplicationVO.leaveToDate != null){
                    showAlert("Applied leave period has been changed as per HR policies.", "Original leave applied From" + " " + $scope.resultObj.leaveFromDate + " " + "to" + " " + $scope.resultObj.leaveToDate + " " + "date which is changed to From" + " " + $scope.fromDatee + " " + "to" + " " + $scope.toDatee + " " + "date.");
                    $scope.resultObj.leaveToDate = $scope.toDatee;
                }
                }
            }
            // if ($scope.fromDatee != $scope.toDatee && $scope.fromDatee != $scope.toDatee) {
            //     showAlert("Applied leave period has been changed as per HR policies.", "Original leave applied From" + " " + $scope.resultObj.leaveFromDate + " " + "to" + " " + $scope.resultObj.leaveToDate + " " + "date which is changed to From" + " " + $scope.fromDatee + " " + "to" + " " + $scope.toDatee + " " + "date.");
            //     $scope.resultObj.leaveFromDate = $scope.fromDatee;
            //     $scope.resultObj.leaveToDate = $scope.toDatee;
            // }

            $ionicLoading.show({});
            if (!success.leaveApplicationVO) {
                showAlert(" ", "No data avalable,Please try again")
                $scope.resultObj.leaveTypeId = ''
                $ionicLoading.hide()
                return
            }
            else if (success.leaveApplicationVO.warningMsg) {
                //Adding dialogue box
                var confirmPopup = $ionicPopup.confirm({
                    title: success.leaveApplicationVO.warningMsg  //Message
                });
                $ionicLoading.hide();
                confirmPopup.then(function (res) {
                    if (res) {
                        $ionicLoading.show({
                        });
                        $scope.dataBuffer.noOfDays = success.leaveApplicationVO.noOfDays
                        $scope.dataBuffer.leaveBalance = success.leaveApplicationVO.leaveBalance
						$scope.dataBuffer.leaveBalance =  $scope.dataBuffer.leaveBalance.toFixed(1)
                        $scope.dataBuffer.noDaysCounted = success.leaveApplicationVO.noDaysCounted
                        $scope.dataBuffer.leaveLeastCountMsg = success.leaveApplicationVO.leaveLeastCountMsg
                        $scope.dataBuffer.leaveBalBefore = success.leaveApplicationVO.leaveBalBefore
                        $scope.dataBuffer.fromLeaveType = $scope.resultObj.fromLeaveType
                        $scope.dataBuffer.toLeaveType = $scope.resultObj.toLeaveType
                        $scope.dataBuffer.fromLvHr = $scope.resultObj.fromLvHr
                        $scope.dataBuffer.toLvHr = $scope.resultObj.toLvHr
                        $scope.dataBuffer.leaveToDate = $scope.resultObj.leaveToDate
                        $scope.dataBuffer.leaveTypeId = $scope.resultObj.leaveTypeId
                        $scope.dataBuffer.leaveFromDate = $scope.resultObj.leaveFromDate
                        $scope.dataBuffer.leaveInProcess = success.leaveApplicationVO.leaveApproved
                        $scope.dataBuffer.currentBalance = success.leaveApplicationVO.currentBalance
                        $scope.dataBuffer.afterBalance = success.leaveApplicationVO.afterBalance
                        $scope.dataBuffer.address = success.leaveApplicationVO.address
                        $scope.dataBuffer.email = success.leaveApplicationVO.email
                        $scope.dataBuffer.remarks = success.leaveApplicationVO.remarks
                        $scope.isUpload = success.leaveApplicationVO.isUpload
                        $scope.timeDiff = Math.abs($scope.tDate.getTime() - $scope.fDate.getTime());
                        $scope.DiffDays = Math.ceil($scope.timeDiff / (1000 * 3600 * 24));
                        $ionicLoading.hide()
                    } else {
                        $scope.isValidateForLeave = true
                        $scope.resultObj.leaveTypeId = '';
                        return;
                    }
                });
            }
            else {
                $ionicLoading.show({
                });
                $scope.dataBuffer.noOfDays = success.leaveApplicationVO.noOfDays
                $scope.dataBuffer.leaveBalance = success.leaveApplicationVO.leaveBalance
				$scope.dataBuffer.leaveBalance =  $scope.dataBuffer.leaveBalance.toFixed(1)
                $scope.dataBuffer.noDaysCounted = success.leaveApplicationVO.noDaysCounted
                $scope.dataBuffer.leaveLeastCountMsg = success.leaveApplicationVO.leaveLeastCountMsg
                $scope.dataBuffer.leaveBalBefore = success.leaveApplicationVO.leaveBalBefore
                $scope.dataBuffer.fromLeaveType = $scope.resultObj.fromLeaveType
                $scope.dataBuffer.toLeaveType = $scope.resultObj.toLeaveType
                $scope.dataBuffer.fromLvHr = $scope.resultObj.fromLvHr
                $scope.dataBuffer.toLvHr = $scope.resultObj.toLvHr
                $scope.dataBuffer.leaveToDate = $scope.resultObj.leaveToDate
                $scope.dataBuffer.leaveTypeId = $scope.resultObj.leaveTypeId
                $scope.dataBuffer.leaveFromDate = $scope.resultObj.leaveFromDate
                $scope.dataBuffer.leaveInProcess = success.leaveApplicationVO.leaveApproved
                $scope.dataBuffer.currentBalance = success.leaveApplicationVO.currentBalance
                $scope.dataBuffer.afterBalance = success.leaveApplicationVO.afterBalance
                $scope.dataBuffer.address = success.leaveApplicationVO.address
                $scope.dataBuffer.email = success.leaveApplicationVO.email
                $scope.dataBuffer.remarks = success.leaveApplicationVO.remarks
                $scope.isUpload = success.leaveApplicationVO.isUpload
                $scope.timeDiff = Math.abs($scope.tDate.getTime() - $scope.fDate.getTime());
                $scope.DiffDays = Math.ceil($scope.timeDiff / (1000 * 3600 * 24));
                $ionicLoading.hide()
            }

        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
        $scope.selectedFileName = ''
    }
    $scope.getMasterListOnload = function () {
        $ionicLoading.show({});
        $scope.getLeaveMasterService = new getLeaveMasterService();
        $scope.getLeaveMasterService.$save($scope.resultObj, function (data) {

            if (data.AlertMessage[0].warningMsg == "NoClockIn") {
                $scope.resultObj.leaveFromDate = '';
                $scope.resultObj.leaveToDate = '';
                $scope.resultObj.fromLvHr = '';
                $scope.resultObj.toLvHr = '';
                $scope.listOfLeave = [];
                $ionicLoading.hide();
                showAlert("You can apply short leave only if there are punches on the selected date");
                return;
            }
            $scope.listOfLeave = [];
            if (!data.appVoList[0]) {
                $ionicLoading.hide();
                showAlert("Leave Types not available. Please contact HR.");
                //$scope.getMasterListOnload()
                //$scope.getShiftOnDate()
                return;
            }
            if (data.appVoList[0].warningMsg) {
                showAlert("", data.appVoList[0].warningMsg)
                //Bug#8465
                // $scope.resultObj.leaveFromDate = '';
                // $scope.resultObj.leaveToDate = '';
                // $scope.resultObj.fromLvHr = '';
                // $scope.resultObj.toLvHr = '';
                // $scope.listOfLeave = [];
            }
            if (!data.appVoList[0].msg || data.appVoList[0].msg == null) {
                $scope.isValidateForLeave = false
                for (var i = 1; i < data.appVoList.length; i++) {
                    var temp = {};
                    temp.leaveType = data.appVoList[i].leaveType
                    temp.leaveTypeId = data.appVoList[i].leaveTypeId
                    $scope.listOfLeave.push(temp);
                }
                $ionicLoading.hide()
            }
            else {
                showAlert("", data.appVoList[0].msg)
                $scope.isValidateForLeave = true
                $ionicLoading.hide()
                return
            }
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    };

    $scope.openFilePicker = function () {
        navigator.camera.getPicture(onSuccess, onFail, {
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: navigator.camera.MediaType.ALLMEDIA
        });
        function onSuccess(imageURL) {
            $scope.sampleURL = imageURL
            $scope.selectedFileName = $scope.sampleURL.substr($scope.sampleURL.lastIndexOf('/') + 1);
            $scope.firstChar = $scope.selectedFileName;
            $scope.$apply();
        }
        function onFail(message) {
            console.log('Failed because: ' + message);
        }
    }

    $scope.save = function () {
        $ionicLoading.show({});

        if ($scope.isUpload == true) {
            var win = function (r) {
                $scope.resultSaveObj.check = 'SaveApproval'
                getSetService.set($scope.resultSaveObj)
                //$state.go('app.RequestList')
                $scope.redirectOnBack()
                showAlert("Save leave application", "Your application has saved successfully")
                $ionicLoading.hide()
            }
            var fail = function (error) {
                console.log(error)
            }
            var options = new FileUploadOptions();
            options.fileKey = "medFile";
            options.fileName = $scope.selectedFileName
            options.chunkedMode = "false";

            options.params = {
                menuId: parseInt($scope.resultObj.menuId),
                buttonRights: 'Y-Y-Y-Y',
                formName: '',
                reasonForLeaveReq: 'yes',
                mobileNumberRequired: 'yes',
                'leaveAppVo.name': sessionStorage.getItem('empName'),
                'leaveAppVo.empId': parseInt(sessionStorage.getItem('empId')),
                'leaveAppVo.address': $scope.dataBuffer.address == null ? $scope.dataBuffer.address = "" : $scope.dataBuffer.address,
                'leaveAppVo.fromLeaveType': $scope.dataBuffer.fromLeaveType,
                'leaveAppVo.fromLvHr': $scope.dataBuffer.fromLvHr,
                'leaveAppVo.leaveBalance': $scope.dataBuffer.leaveBalance,
                'leaveAppVo.leaveFromDate': $scope.dataBuffer.leaveFromDate,
                'leaveAppVo.leaveInProcess': $scope.dataBuffer.leaveInProcess,
                'leaveAppVo.leaveReason': $scope.dataBuffer.leaveReason,
                'leaveAppVo.leaveToDate': $scope.dataBuffer.leaveToDate,
                'leaveAppVo.leaveTypeId': $scope.dataBuffer.leaveTypeId,
                'leaveAppVo.noDaysCounted': $scope.dataBuffer.noDaysCounted,
                'leaveAppVo.noOfDays': $scope.dataBuffer.noOfDays,
                'leaveAppVo.phone': $scope.dataBuffer.phone,
                'leaveAppVo.toLeaveType': $scope.dataBuffer.toLeaveType,
                'leaveAppVo.toLvHr': $scope.dataBuffer.toLvHr
            }

            var ft = new FileTransfer();
            ft.upload($scope.sampleURL, encodeURI(baseURL + '/api/leaveApplication/saveLeaveApplication.spr'), win, fail, options);
        }
        else {
            $scope.resultSaveObj = {}
            $scope.resultSaveObj.leaveAppVo = {}
            $scope.resultSaveObj.menuId = parseInt($scope.resultObj.menuId)
            $scope.resultSaveObj.buttonRights = 'Y-Y-Y-Y'
            $scope.resultSaveObj.formName = ''
            $scope.resultSaveObj.reasonForLeaveReq = 'yes'
            $scope.resultSaveObj.mobileNumberRequired = 'yes'
            $scope.resultSaveObj.medFile = $scope.sampleURL
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
            }).success(function (data) {
                $scope.resultSaveObj.check = 'SaveApproval'
                getSetService.set($scope.resultSaveObj)
                //$state.go('app.RequestList')
                $scope.redirectOnBack()
                showAlert("Save leave application", data.message)
                $ionicLoading.hide()
            }).error(function (error, status) {
                $scope.data = {message: error, status: status};
                autoRetryCounter = 0
                commonService.getErrorMessage($scope.data);
                $ionicLoading.hide()
            })
        }
    }

    $scope.sendForApproval = function () {
        $ionicLoading.show({});
		$scope.isUpload	 = false
        if ($scope.isUpload == true) {
            var win = function (r) {
                $scope.resultSaveObj.check = 'SaveApproval'
                getSetService.set($scope.resultSaveObj)
                //$state.go('app.RequestList')
                $scope.redirectOnBack()
                showAlert("Save leave application", "Your application has been sent for approval successfully")
                $ionicLoading.hide()
            }
            var fail = function (error) {
                console.log(error)
            }
            var options = new FileUploadOptions();
            options.fileKey = "medFile";
            options.fileName = $scope.selectedFileName;
            options.chunkedMode = "false";

            options.params = {
                menuId: parseInt($scope.resultObj.menuId),
                buttonRights: 'Y-Y-Y-Y',
                formName: '',
                reasonForLeaveReq: 'yes',
                mobileNumberRequired: 'yes',
                level: '1',
                'leaveAppVo.name': sessionStorage.getItem('empName'),
                'leaveAppVo.empId': parseInt(sessionStorage.getItem('empId')),
                'leaveAppVo.address': $scope.dataBuffer.address,
                'leaveAppVo.fromLeaveType': $scope.dataBuffer.fromLeaveType,
                'leaveAppVo.fromLvHr': $scope.dataBuffer.fromLvHr,
                'leaveAppVo.leaveBalance': $scope.dataBuffer.leaveBalance,
                'leaveAppVo.leaveFromDate': $scope.dataBuffer.leaveFromDate,
                'leaveAppVo.leaveInProcess': $scope.dataBuffer.leaveInProcess,
                'leaveAppVo.leaveReason': $scope.dataBuffer.leaveReason,
                'leaveAppVo.leaveToDate': $scope.dataBuffer.leaveToDate,
                'leaveAppVo.leaveTypeId': $scope.dataBuffer.leaveTypeId,
                'leaveAppVo.noDaysCounted': $scope.dataBuffer.noDaysCounted,
                'leaveAppVo.noOfDays': $scope.dataBuffer.noOfDays,
                'leaveAppVo.phone': $scope.dataBuffer.phone,
                'leaveAppVo.toLeaveType': $scope.dataBuffer.toLeaveType,
                'leaveAppVo.toLvHr': $scope.dataBuffer.toLvHr
            }
            var ft = new FileTransfer();
            ft.upload($scope.sampleURL, encodeURI(baseURL + '/api/leaveApplication/sendForApprove.spr'), win, fail, options);
        }
        else {
            $ionicLoading.show({});
            $scope.resultSentForApproveObj = {}
            $scope.resultSentForApproveObj.leaveAppVo = {}
            $scope.resultSentForApproveObj.menuId = parseInt($scope.resultObj.menuId)
            $scope.resultSentForApproveObj.buttonRights = 'Y-Y-Y-Y'
            $scope.resultSentForApproveObj.formName = ''
            $scope.resultSentForApproveObj.reasonForLeaveReq = 'yes'
            $scope.resultSentForApproveObj.mobileNumberRequired = 'yes'
            $scope.resultSentForApproveObj.level = '1'
            $scope.resultSentForApproveObj.leaveAppVo = $scope.dataBuffer
            $scope.resultSentForApproveObj.leaveAppVo.name = sessionStorage.getItem('empName')
            $scope.resultSentForApproveObj.leaveAppVo.empId = parseInt(sessionStorage.getItem('empId'));

			if ($scope.resultSentForApproveObj.leaveAppVo.fromLvHr=="HH:MM"){
				$scope.resultSentForApproveObj.leaveAppVo.fromLvHr = null
			}
			if ($scope.resultSentForApproveObj.leaveAppVo.toLvHr == "HH:MM"){
				$scope.resultSentForApproveObj.leaveAppVo.toLvHr = null
			}
			if ($scope.hourlyLeaveFeature =='true'){
                $scope.resultSentForApproveObj.leaveAppVo.shiftTypeAndOutTime = $scope.shiftType_shiftOuttime
            }
			
			if ($scope.fileUploadFeatureIncluded == 'true')	{
				// changes for save leave Balannce at applyTime
				$scope.resultSentForApproveObj.leaveAppVo.currentBalance = $scope.dataBuffer.noDaysCounted
				$scope.resultSentForApproveObj.leaveAppVo.afterBalance = $scope.dataBuffer.leaveBalance - $scope.dataBuffer.noDaysCounted
			}
			

			/*if ($scope.dataBuffer.fromLvHr=="HH:MM"){
				$scope.resultSentForApproveObj.leaveAppVo..fromLvHr = ""
			}
			if ($scope.dataBuffer.toLvHr == "HH:MM"){
				$scope.dataBuffer.toLvHr = ""
			}
			*/
			
			/*
			if ($scope.fileUploadFeatureIncluded=='true' && document.getElementById('inputFileUpload').files[0]){
				$scope.imageData = $scope.fileChange()
			}
			*/
			if ($scope.fileUploadFeatureIncluded == 'true')	{
						//take the file stream from file.
					var jsonVO =  JSON.stringify($scope.resultSentForApproveObj.leaveAppVo);
						
					var formData = new FormData();
					formData.append('menuId', $scope.resultSentForApproveObj.menuId);
					formData.append('buttonRights', $scope.resultSentForApproveObj.buttonRights);
					formData.append('formName', '');
					formData.append('reasonForLeaveReq', 'yes');
					formData.append('mobileNumberRequired', 'yes');
					formData.append('level','1');
					formData.append('leaveAppVoTmp',jsonVO);
					
					// Attach file
					//1. check file input tag has selected file.
					//2. check if image that is from camera pic is avlbl
					
					
					if (document.getElementById('inputFileUpload').files[0] ){
						
						var base64result = $scope.imageData.split(',')[1];
						$scope.fileUploadName = document.getElementById('inputFileUpload').files[0].name
						$scope.fileUploadType = document.getElementById('inputFileUpload').files[0].type
						
						var blob = base64toBlob(base64result, $scope.fileUploadType,$scope.fileUploadName)
						formData.append('medFile', blob,$scope.fileUploadName)
						
						if (document.getElementById('inputFileUpload').files[0].size/(1024*1024)>1)
						{
							showAlert("Maximum file size is limited to  1 Mb, Please try another file of lesser size. ")
							$ionicLoading.hide()
							//return
						}
						
					}else if (document.getElementById('showImg').src.indexOf("data:image") > -1){
						//scope.imageData is the src of camera image 
						var base64result = $scope.imageData.split(',')[1];
						
						var ts = new Date();
						ts = ts.getFullYear() +""+ (ts.getMonth()+1) +""+ ts.getDate()  + "" + ts.getHours() +""+ ts.getMinutes() +""+ ts.getSeconds()

						$scope.fileUploadName = "camPic"+ts+".jpeg"
						$scope.fileUploadType = "image/jpeg"
						
						var blob = base64toBlob(base64result, $scope.fileUploadType,$scope.fileUploadName)
						formData.append('medFile', blob,$scope.fileUploadName)
						
					}
				
                
				$.ajax({
				url: baseURL + '/api/leaveApplication/sendForApproveWithFile.spr',
				data: formData,
                type: 'POST',
                timeout: commonRequestTimeout,
				contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
				processData: false, // NEEDED, DON'T OMIT THIS
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                 },
				success : function(success) {
					//alert(success.clientResponseMsg)
					if (success.clientResponseMsg){
						if (!(success.clientResponseMsg=="OK")){
								console.log(success.clientResponseMsg)
								handleClientResponse(success.clientResponseMsg,"sendForApproveWithFile")
								$ionicLoading.hide()
								showAlert("Something went wrong. Please try later.")
								$scope.redirectOnBack()
								//$ionicNavBarDelegate.back();
								return
							}	
					}
							$ionicLoading.hide()
							if (success.msg) {
								showAlert(success.msg)
							}
							$scope.redirectOnBack()
				},
				error(res)
				{
					$ionicLoading.hide()
					showAlert(res.status)
					
				}
				
				});
			
			}else{
			//file feature not available
            $http({
                url: (baseURL + '/api/leaveApplication/sendForApprove.spr'),
                method: 'POST',
                timeout: commonRequestTimeout,
                transformRequest: jsonTransformRequest,
                data: $scope.resultSentForApproveObj,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + jwtByHRAPI
                    }
            }).
                    success(function (data) {
                        $scope.resultSentForApproveObj.check = 'sendApproval'
                        getSetService.set($scope.resultSentForApproveObj)
                        //$state.go('app.RequestList')
                        $scope.redirectOnBack()
                        $ionicLoading.hide()
                        if (data.msg) {
                            showAlert("Send leave application", data.msg)
                        }
                    }).error(function (error, status) {
                        autoRetryCounter = 0
                $scope.data = {message: error, status: status};
                commonService.getErrorMessage($scope.data);
                $ionicLoading.hide()
            })
			
		}
			
        }
    }

    $scope.getFindWorkFlowOnload = function (type) {
        $scope.WorkFlow = {}
        $scope.WorkFlow.empId = sessionStorage.getItem('empId')
        $scope.WorkFlow.menuId = leaveMenuInfo.menuId;
        $ionicLoading.show({});
        $scope.getFindWorkFlowService = new getFindWorkFlowService();
        $scope.getFindWorkFlowService.$save($scope.WorkFlow, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"getFindWorkFlowService")
			}

            if ($scope.resultObj.leaveTypeId == "" || $scope.resultObj.leaveTypeId == null) {
                showAlert("", "Please enter leave type")
                $ionicLoading.hide();
                return;
            }
            if ($scope.dataBuffer.phone == "") {
                showAlert("", "Please enter phone no")
                $ionicLoading.hide();
                return;
            }
            if ($scope.resultObj.fromLeaveType != $scope.resultObj.toLeaveType && $scope.resultObj.leaveFromDate == $scope.resultObj.leaveToDate) {
                showAlert("Leave Period", "Leave Period should be same for the same 'from Date' and 'to Date'.")
                //$scope.resultObj.toLeaveType = $scope.resultObj.fromLeaveType
                $scope.resultObj.leaveToDate = ''
                $ionicLoading.hide();
                return
         }

            if ($scope.dataBuffer.leaveReason == undefined || $scope.dataBuffer.leaveReason == "" || $scope.dataBuffer.leaveReason == null) {
                showAlert("", "Please enter applicant remark")
                $ionicLoading.hide();
                return;
            }else{
                if ($scope.utf8Enabled == 'true' && $scope.dataBuffer){
                    if ($scope.dataBuffer.leaveReason){
                        $scope.dataBuffer.leaveReason = encodeURI($scope.dataBuffer.leaveReason)
                    }
                }
            }

            if ($scope.isUpload == true ){
				if (document.getElementById('inputFileUpload').files[0] || 
				    document.getElementById('showImg').src.indexOf("data:image") > -1){
						//file attached
					}else{
						showAlert("", "Please attach relevant document !")
						$ionicLoading.hide();
						return;
				}
			}
            if (data.msg == '' || data.msg == null) {
                $scope.isValidateForLeave = false
                if (type == 1) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Are you sure',
                        template: 'Do you want to save?', //Message
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            $scope.save()
                            return
                        } else {
                            $ionicLoading.hide();
                            return;
                        }
                    });
                }
                else if (type == 2) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Are you sure',
                        template: 'Do you want to send for approval?', //Message
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            $scope.sendForApproval()
                            return
                        } else {
                            $ionicLoading.hide();
                            return;
                        }
                    });
                }
            } else {
                $scope.isValidateForLeave = true
                $ionicLoading.hide();
                showAlert("", data.msg);
                return
            }
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    };
    $scope.$watchGroup(['resultObj.fromLeaveType', 'resultObj.toLeaveType'], function () {
        $scope.getValidateLeaveOnload(function success() {
            if (!angular.equals({}, getSetService.get())) {
                $scope.result = getSetService.get()
                if ($scope.result.selectedCalDate) {
                    $scope.resultObj.leaveFromDate = $filter('date')($scope.result.selectedCalDate, 'dd/MM/yyyy');
                    $scope.resultObj.leaveToDate = $filter('date')($scope.result.selectedCalDate, 'dd/MM/yyyy');
                    $scope.fDate = new Date($scope.result.selectedCalDate)
                    $scope.tDate = new Date($scope.result.selectedCalDate)
                    if ($scope.resultObj.leaveFromDate && $scope.resultObj.leaveToDate) {
                        $scope.getMasterListOnload();
                        $scope.getShiftOnDate()
                    }
                }
                getSetService.set({});
            }
            else {
                $ionicLoading.show();
                $scope.resultObj.fromLvHr = '';
                $scope.resultObj.toLvHr = '';
                $scope.listOfLeave = [];
                $scope.resultObj.leaveTypeId = ''
                $scope.dataBuffer.afterBalance = ''
                $scope.dataBuffer.noDaysCounted = ''
                $scope.dataBuffer.leaveBalance = ''
                if ($scope.resultObj.fromLeaveType == 'shortLeave' || $scope.resultObj.fromLeaveType == 'shortLeave') {
                    $scope.resultObj.fromLeaveType = $scope.resultObj.fromLeaveType = 'shortLeave'
                }
                if ($scope.resultObj.leaveFromDate && $scope.resultObj.leaveToDate && $scope.resultObj.fromLeaveType == 'shortLeave' && $scope.resultObj.toLeaveType == 'shortLeave') {
                    if ($scope.resultObj.leaveFromDate != $scope.resultObj.leaveToDate) {
                        $scope.resultObj.leaveToDate = $scope.resultObj.leaveFromDate
                        showAlert("Leave type", "from and to date should be same for short leave")
                    }
                }
                else {
                    if ($scope.resultObj.leaveFromDate && $scope.resultObj.leaveToDate) {
                        $scope.getMasterListOnload();
                        $scope.getShiftOnDate()
                    }
                }
                $ionicLoading.hide();
            }
        });
    })

	
	$scope.fileChange  = function (){
		var reader = new FileReader();

      // Closure to capture the file information.
	  var fileData ;
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
		  
		  $scope.imageData = e.target.result;
		  //$scope.fileToUpload = (<HTMLInputElement>e.target.files[0])
          //alert($scope.imageData)
        };
      })(f);
	  
		$ionicLoading.hide()
		
      // Read in the image file as a data URL.
	  if (document.getElementById('inputFileUpload').files[0]){	
		var f = document.getElementById('inputFileUpload').files[0]
		$scope.selectedFileNameFromDevice = document.getElementById('inputFileUpload').files[0].name
	  
		reader.readAsDataURL(f);
	  }else{
		  $scope.selectedFileNameFromDevice = ""
	  }
	  
	  
	}
	
    
    $scope.getShiftOnDate = function(){
        
        if ($scope.hourlyLeaveFeature =='false'){
                return
        }

 				
        //$("#shiftAbbr").empty();
    
        var leaveFromDate = $scope.resultObj.leaveFromDate //$("#fromDate").val();
        var leaveToDate = $scope.resultObj.leaveToDate
        var fromLeaveType = $scope.resultObj.fromLeaveType
        
        //var fmt = $("#DateFormat").val();
        var empId = $scope.resultObj.empId//$("#empId").val();
        var msg = '';
        var warningMsg = '';
        var menuId = $scope.resultObj.menuId
        
        $.ajax({
            
            url: baseURL + "/api/leaveApplication/getShiftOnDate.spr",
            data: {'leaveFromDate': leaveFromDate, 'leaveToDate': leaveToDate,'fromLeaveType':fromLeaveType,
            'toLeaveType':fromLeaveType,'empId':empId,'leaveTransId':'','menuId':menuId},
            type: 'POST',
            timeout: commonRequestTimeout,
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
             },
            success:function(result){
                
                    if(result!=null){
                    console.log(result);
                    //$("#shiftAbbr").append("");
                    
                    for(var count=0; count<result.length ;count++){
                        
                        var inputHtmlDate = "<ul><li>"+result[count].shiftDate+"</li>";
                        inputHtmlDate = inputHtmlDate+ "<li>"+result[count].shiftAbbr+"</li>";//shiftAbbr shiftType =shiftDetails
                        inputHtmlDate = inputHtmlDate +"<li>"+result[count].shiftInTime+" - "+result[count].shiftOutTime+"</li>";
                
                        //$("#shiftAbbr").append(inputHtmlDate)
                        if(count ==0){
                            $scope.shiftType_shiftOuttime= result[count].shiftDetails+"##"+result[count].shiftOutTime;
                            $("#shiftTypeAndOutTime").val($scope.shiftType_shiftOuttime);
                        }
                        //alert($scope.shiftType_shiftOuttime)
                        
                    }
                    
                    }else{
                        $("#shiftAbbr").append("Shift not assigned");
                        $scope.shiftType_shiftOuttime = "Shift not assigned";
                    }
                
            }    	
   
       });
}
	$scope.SelectedFile = function(){
	
		var imgcontrolName= "showImg"
		var image = document.getElementById(imgcontrolName);
		image.src=""
		image.style.display="none"
		$scope.imageData = $scope.fileChange()

	}


	$scope.removeAttachment = function (){
		var confirmPopup = $ionicPopup.confirm({
						title: '',
					template: 'Do you want to remove image?', //Message
					});
					confirmPopup.then(function (res) {
						if (res) {
							var imgcontrolName= "showImg"
							var image = document.getElementById(imgcontrolName);
							image.src=""
							image.style.visibility="hidden"
				}
					});	
	}
	
	
	
	$scope.cameraTakePicture = 	function (mode) { 
		var imgcontrolName= "showImg"
		

		if (mode=="camera"){

			navigator.camera.getPicture(onSuccess, onFail, { quality: 25,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				correctOrientation: true
				
				});
			function onSuccess(imageData) {
			var image = document.getElementById(imgcontrolName);
			image.style.visibility="visible"
			image.style.display = "inline-block"
            if (window.device.platform != "Android"){
                image.src = "data:image/jpeg;base64," + imageData;
                $scope.imageData = "data:image/jpeg;base64," + imageData;
            }else{
                var thisResult = JSON.parse(imageData);
                // convert json_metadata JSON string to JSON Object 
                //var metadata = JSON.parse(thisResult.json_metadata);
                image.src = "data:image/jpeg;base64," + thisResult.filename;
                $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;
            }
           // var thisResult = JSON.parse(imageData);
            // convert json_metadata JSON string to JSON Object 
            //var metadata = JSON.parse(thisResult.json_metadata);
            //image.src = "data:image/jpeg;base64," + thisResult.filename;
            //$scope.imageData = "data:image/jpeg;base64," + thisResult.filename;

			//image.src = "data:image/jpeg;base64," + imageData;
			//$scope.imageData = "data:image/jpeg;base64," + imageData;
			document.getElementById("inputFileUpload").value = ""			
			$scope.selectedFileNameFromDevice = ""
			if (!$scope.$$phase)
                $scope.$apply()
			
			
			
			
		}

		function onFail(message) {
			showAlert(message);
		}
	}
	
	}
	


	
  $scope.redirectOnBack = function () {
		//$ionicNavBarDelegate.back();
        //$scope.resultObj.check = "Leave";
        //getSetService.set($scope.resultObj);
         $state.go('requestLeaveList')
    }
});
