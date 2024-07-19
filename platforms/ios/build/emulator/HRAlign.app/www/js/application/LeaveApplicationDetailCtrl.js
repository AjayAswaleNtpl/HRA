/*
 1.This controller is used to show the Applied leave details.
 2.Applied leaves can be Cancelled / Send forApproval.
 3.Uploaded document can be downloaded and opened.
 */

mainModule.factory("getLeaveMasterService", function ($resource) {
    return $resource((baseURL + '/api/leaveApplication/getLeaveMaster.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
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
mainModule.factory("getOpenFileService", function ($resource) {
    return $resource((baseURL + '/api/leaveApplication/openFile.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.controller('LeaveApplicationDetailCtrl', function ($scope, $rootScope, getOpenFileService, commonService, getFindWorkFlowService, $state, getSetService, $ionicPopup, $http, $q, $filter, $ionicLoading, getBalanceLeaveCountService, getLeaveMasterService, $ionicNavBarDelegate) {
	
	$rootScope.navHistoryPrevPage=$rootScope.navHistoryCurrPage
	//$rootScope.navHistoryCurrPage="leave_application"
	$rootScope.navHistoryPrevTab="LEAVE"
	
    $scope.resultObj = {}
    $scope.cancelObj = {}
    $scope.isValidateForLeave = false
    if (!angular.equals({}, getSetService.get())) {
        $scope.resultObj = getSetService.get()
        $scope.emptyObject = {}
        getSetService.set($scope.emptyObject)
    }
    $scope.noOfHours = parseInt($scope.resultObj.toLvHr) - parseInt($scope.resultObj.fromLvHr);
    $scope.noOfDaysCounted = $scope.resultObj.noDaysCounted

    $scope.leaveFromDate = $scope.resultObj.leaveFromDate.split('/')
    $scope.leaveFromDate = new Date($scope.leaveFromDate[2] + '/' + $scope.leaveFromDate[1] + '/' + $scope.leaveFromDate[0])
    $scope.leaveToDate = $scope.resultObj.leaveToDate.split('/')
    $scope.leaveToDate = new Date($scope.leaveToDate[2] + '/' + $scope.leaveToDate[1] + '/' + $scope.leaveToDate[0])
    if ($scope.leaveFromDate.getTime() == $scope.leaveToDate.getTime()) {
        $scope.leaveDate = $scope.leaveFromDate;
        $scope.dateComparison = true;
    } else if ($scope.leaveFromDate.getTime() != $scope.leaveToDate.getTime()) {
        $scope.dateComparison = false;
    }
    else {
        $scope.leaveDate = null;
    }
    $scope.fromLeaveType = $scope.resultObj.fromLeaveType
    $scope.fromLeaveType = $scope.fromLeaveType.charAt(0).toUpperCase() + $scope.fromLeaveType.slice(1)
    $scope.Cancel = function () {
        $ionicLoading.show({
        });
        if ($scope.resultObj.status == 'SAVED') {
            $scope.cancelObj = {}
            var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
            $scope.cancelObj.menuId = leaveMenuInfo.menuId;
            $scope.cancelObj.buttonRights = "Y-Y-Y-Y"
            $scope.cancelObj.leaveAppVo = {}
            $scope.cancelObj.leaveAppVo.empId = $scope.resultObj.empId
            $scope.cancelObj.leaveAppVo.leaveTransId = $scope.resultObj.leaveTransId
            $scope.cancelObj.leaveAppVo.leaveReason = $scope.resultObj.leaveReason
            $scope.cancelObj.leaveAppVo.phone = $scope.resultObj.phoneNo
            $scope.cancelObj.leaveAppVo.afterBalance = $scope.resultObj.afterBalance
            $scope.cancelObj.leaveAppVo.currentBalance = $scope.resultObj.currentBalance
            $scope.cancelObj.leaveAppVo.leastCount = $scope.resultObj.leastCount
            $scope.cancelObj.leaveAppVo.leaveApproved = $scope.resultObj.leaveApproved
            $scope.cancelObj.leaveAppVo.leaveBalBefore = $scope.resultObj.leaveBalBefore
            $scope.cancelObj.leaveAppVo.leaveFromDate = $scope.resultObj.leaveFromDate
            $scope.cancelObj.leaveAppVo.leaveToDate = $scope.resultObj.leaveToDate
            $scope.cancelObj.leaveAppVo.name = $scope.resultObj.empName
            $scope.cancelObj.leaveAppVo.leaveStatus = $scope.resultObj.status
            $scope.cancelObj.leaveAppVo.leaveInProcess = $scope.resultObj.leaveInProcess
            $scope.cancelObj.leaveAppVo.leaveTypeId = $scope.resultObj.leaveTypeId
            $scope.cancelObj.leaveAppVo.noDaysCounted = $scope.resultObj.noDaysCounted
            $http({
                url: (baseURL + '/api/leaveApplication/cancel.spr'),
                method: 'POST',
                timeout: commonRequestTimeout,
                transformRequest: jsonTransformRequest,
                data: $scope.cancelObj,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + jwtByHRAPI
                    }
            }).
                    success(function (data) {
                        showAlert("Cancelled", data.msg)
						$scope.redirectOnBack()
                        //$state.go('app.RequestList')
                        $ionicLoading.hide()
                    }).error(function (data, status) {
                $scope.data = {status: status};
                commonService.getErrorMessage($scope.data, "app.RequestList");
                $ionicLoading.hide()
            })
        }
        else {
            $scope.sendForCancelObj = {}
            var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
            $scope.sendForCancelObj.menuId = leaveMenuInfo.menuId;
            $scope.sendForCancelObj.buttonRights = "Y-Y-Y-Y"
            $scope.sendForCancelObj.leaveAppVo = {}
            $scope.sendForCancelObj.leaveAppVo.empId = $scope.resultObj.empId
            $scope.sendForCancelObj.leaveAppVo.leaveTransId = $scope.resultObj.leaveTransId
            $scope.sendForCancelObj.leaveAppVo.leaveReason = $scope.resultObj.leaveReason
            $scope.sendForCancelObj.leaveAppVo.phone = $scope.resultObj.phoneNo
            $scope.sendForCancelObj.leaveAppVo.afterBalance = $scope.resultObj.afterBalance
            $scope.sendForCancelObj.leaveAppVo.currentBalance = $scope.resultObj.currentBalance
            $scope.sendForCancelObj.leaveAppVo.leastCount = $scope.resultObj.leastCount
            $scope.sendForCancelObj.leaveAppVo.leaveApproved = $scope.resultObj.leaveApproved
            $scope.sendForCancelObj.leaveAppVo.leaveBalBefore = $scope.resultObj.leaveBalBefore
            $scope.sendForCancelObj.leaveAppVo.leaveFromDate = $scope.resultObj.leaveFromDate
            $scope.sendForCancelObj.leaveAppVo.leaveToDate = $scope.resultObj.leaveToDate
            $scope.sendForCancelObj.leaveAppVo.name = $scope.resultObj.empName
            $scope.sendForCancelObj.leaveAppVo.leaveStatus = $scope.resultObj.status
            $scope.sendForCancelObj.leaveAppVo.leaveInProcess = $scope.resultObj.leaveInProcess
            $http({
                url: (baseURL + '/api/leaveApplication/sendForCancellation.spr'),
                method: 'POST',
                timeout: commonRequestTimeout,
                transformRequest: jsonTransformRequest,
                data: $scope.sendForCancelObj,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + jwtByHRAPI
                    }
            }).
                    success(function (data) {
                        if ($scope.resultObj.status == 'SENT FOR APPROVAL') {
                            showAlert("", "Your application cancelled successfully!")
                        }
                        else {
                            if(data.SuccessMessage!=null)
                            {
                                showAlert("", data.SuccessMessage);
                            }
                            else{
                            showAlert("", "Application has been sent for cancellation")
                            }
                        }
						$scope.redirectOnBack()
                        //$state.go('app.RequestList')
                        $ionicLoading.hide()
                    }).error(function (data, status) {
                $scope.data = {status: status};
                commonService.getErrorMessage($scope.data, "app.RequestList");
                $ionicLoading.hide()
            })
        }
    }
    if ($scope.resultObj.leaveApplyDetail.fileNm) {
        $scope.fileName = $scope.resultObj.leaveApplyDetail.fileNm;
    }
	
	
	
	$scope.openFile = function(event){
		
		
		event.stopPropagation();
		
		
		//alert(fileId)
		var fd = new FormData();
		fd.append("transId",$scope.resultObj.leaveTransId)
		
		
		$.ajax({
				url: baseURL + '/api/leaveApplication/openFileMobile.spr',
				data: fd,
				type: 'POST',
				timeout: commonRequestTimeout,
				contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
				processData: false, // NEEDED, DON'T OMIT THIS
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                 },
				success : function(result) {
					if (!(result.clientResponseMsg=="OK")){
								console.log(result.clientResponseMsg)
								handleClientResponse(result.clientResponseMsg,"openFileMobile")
								$ionicLoading.hide()
								showAlert("Something went wrong. Please try later.")
								return
							}	
							$scope.FileParmsObject = {}
							$scope.FileParmsObject.uploadFile = result.uploadFile
							$scope.FileParmsObject.uploadContentType = result.uploadContentType
							$scope.FileParmsObject.uploadFileName = result.uploadFileName
							
							
							$scope.downloadAttachmnent($scope.FileParmsObject)
							$ionicLoading.hide()
				},
				error : function(res){
							$ionicLoading.hide()
							showAlert("Something went wrong while fetching the file.");
				}
				
				});
	}	

	
	
	
    $scope.downloadedFile = function () {
        $ionicLoading.show({
        });

        $scope.uploadedFile = {}
        $scope.uploadedFile.transId = $scope.resultObj.leaveTransId
        var uri;
        var Download = 'HrAlign/';
        var fileURL;
        if (ionic.Platform.isAndroid()) {
            uri = baseURL + "/api/leaveApplication/openFile.spr?transId=" + $scope.uploadedFile.transId;
            fileURL = cordova.file.externalRootDirectory + Download + $scope.fileName;
            fileMIMEType = '*/*';

            var fileTransfer = new FileTransfer();
            fileTransfer.download(
                    uri,
                    fileURL,
                    function (success) {
						if (!(success.clientResponseMsg=="OK")){
							console.log(success.clientResponseMsg)
							handleClientResponse(success.clientResponseMsg," leaveapplicationdetailctrl.js  leaveApplication/openFile.spr")
						}	
                        $ionicLoading.show({
                        });
                        $ionicLoading.hide();
                        //showAlert("", "File downloaded successfully.")
						showAlert("File Saved in download folder", $scope.fileName )
						return
                        cordova.plugins.fileOpener2.open(
                                fileURL,
                                fileMIMEType,
                                {
                                    error: function (e) {
                                        console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                                    },
                                    success: function () {
                                        console.log('File opened successfully');
                                    }
                                }
                        );
                    },
                    function (error) {
                        if (error.http_status == 406) {
                            showAlert("", "File is not available");
                        }
                        else if (error.code == 1) {
                            showAlert("", "Please give storage permission");
                        }
                        else if (error.code == 3) {
                            $ionicLoading.hide()
                            commonService.getErrorMessage(error);
                        }
                        $ionicLoading.hide()
                    });
        }
        else {
            $ionicLoading.hide()
            uri = baseURL + "/api/leaveApplication/openFile.spr?transId=" + $scope.uploadedFile.transId;
            if (window.XMLHttpRequest) {
                var oReq = new XMLHttpRequest();
                oReq.open("GET", uri);
                oReq.send();
                oReq.onload = function () {
                    if (oReq.status == "406" || oReq.status != "200") {
                        showAlert("", "File is not available");
                    }
                    else {
                        var ref = cordova.InAppBrowser.open(uri, '_blank', 'location=yes,toolbarposition=top');
                    }
                };
            }
        }

    };

    $scope.sendForApproval = function () {
        $ionicLoading.show({});
        $scope.resultSentForApproveObj = {}
        $scope.resultSentForApproveObj.leaveAppVo = {}
        $scope.resultSentForApproveObj.menuId = parseInt($scope.resultObj.menuId)
        $scope.resultSentForApproveObj.buttonRights = 'Y-Y-Y-Y'
        $scope.resultSentForApproveObj.formName = ''
        $scope.resultSentForApproveObj.reasonForLeaveReq = 'yes'
        $scope.resultSentForApproveObj.mobileNumberRequired = 'yes'
        $scope.resultSentForApproveObj.medFile = ''
        $scope.resultSentForApproveObj.level = '1'
        $scope.resultSentForApproveObj.leaveAppVo.name = sessionStorage.getItem('empName')
        $scope.resultSentForApproveObj.leaveAppVo.empId = parseInt(sessionStorage.getItem('empId'));
        $scope.resultSentForApproveObj.leaveAppVo.leaveTransId = $scope.resultObj.leaveTransId
        $scope.resultSentForApproveObj.leaveAppVo.leaveReason = $scope.resultObj.leaveReason
        $scope.resultSentForApproveObj.leaveAppVo.phone = $scope.resultObj.phoneNo
        $scope.resultSentForApproveObj.leaveAppVo.afterBalance = $scope.resultObj.afterBalance
        $scope.resultSentForApproveObj.leaveAppVo.currentBalance = $scope.resultObj.currentBalance
        $scope.resultSentForApproveObj.leaveAppVo.leastCount = $scope.resultObj.leastCount
        $scope.resultSentForApproveObj.leaveAppVo.leaveApproved = $scope.resultObj.leaveApproved
        $scope.resultSentForApproveObj.leaveAppVo.leaveBalBefore = $scope.resultObj.leaveBalBefore
        $scope.resultSentForApproveObj.leaveAppVo.leaveFromDate = $scope.resultObj.leaveFromDate
        $scope.resultSentForApproveObj.leaveAppVo.leaveToDate = $scope.resultObj.leaveToDate
        $scope.resultSentForApproveObj.leaveAppVo.name = $scope.resultObj.empName
        $scope.resultSentForApproveObj.leaveAppVo.leaveStatus = $scope.resultObj.status
        $scope.resultSentForApproveObj.leaveAppVo.leaveInProcess = $scope.resultObj.leaveInProcess
        $scope.resultSentForApproveObj.leaveAppVo.fromLeaveType = $scope.resultObj.fromLeaveType
        $scope.resultSentForApproveObj.leaveAppVo.toLeaveType = $scope.resultObj.toLeaveType
        $scope.resultSentForApproveObj.leaveAppVo.toLvHr = $scope.resultObj.toLvHr
        $scope.resultSentForApproveObj.leaveAppVo.fromLvHr = $scope.resultObj.fromLvHr
        $scope.resultSentForApproveObj.leaveAppVo.noOfDays = $scope.resultObj.noOfDays
        $scope.resultSentForApproveObj.leaveAppVo.noDaysCounted = $scope.resultObj.noDaysCounted
        $scope.resultSentForApproveObj.leaveAppVo.leaveLeastCountMsg = $scope.resultObj.leaveLeastCountMsg
        $scope.resultSentForApproveObj.leaveAppVo.remarks = $scope.resultObj.remarks
        $scope.resultSentForApproveObj.leaveAppVo.email = $scope.resultObj.email
        $scope.resultSentForApproveObj.leaveAppVo.address = $scope.resultObj.address
        $scope.resultSentForApproveObj.leaveAppVo.leaveTypeId = $scope.resultObj.leaveTypeId
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
                    showAlert("Send leave application", data.msg)
					$scope.redirectOnBack()
                    //$state.go('app.RequestList')
                    $ionicLoading.hide()
                })
                .error(function (data, status) {
                    $scope.data = {status: status};
                    commonService.getErrorMessage($scope.data, "app.RequestList");
                    $ionicLoading.hide()
                })
    };
    $scope.onConfirm = function (type) {
        if (type == 1) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Your leave application status is' + " " + '"' + $scope.resultObj.status + '"',
                template: 'Do you want to cancel?', // Message
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $scope.Cancel()
                    return
                } else {
                    return;
                }
            });
        }
        else if (type == 2) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Your leave application status is' + " " + '"' + $scope.resultObj.status + '"',
                template: 'Do you want to send for approval?', // Message
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $scope.sendForApproval()
                    return
                } else {
                    return;
                }
            });
        }
    }
    $scope.getFindWorkFlowOnload = function () {
        $scope.WorkFlow = {}
        $scope.WorkFlow.empId = sessionStorage.getItem('empId')
        var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
        $scope.WorkFlow.menuId = leaveMenuInfo.menuId;
        $ionicLoading.show({
        });
        $scope.getFindWorkFlowService = new getFindWorkFlowService();
        $scope.getFindWorkFlowService.$save($scope.WorkFlow, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"getFindWorkFlowService")
			}		

            if (data.msg == '' || data.msg == null) {
                $scope.isValidateForLeave = true
                $ionicLoading.hide()
                return
            } else {
                $scope.isValidateForLeave = false
                showAlert("", data.msg)
                $ionicLoading.hide()
                return
            }
            $ionicLoading.hide()
        }, function (data) {
            $ionicLoading.hide()
            commonService.getErrorMessage(data, "app.RequestList");
        });
    };
	
	$scope.downloadAttachmnent = function (travel){
		
		var strData=travel.uploadFile
		//var strUrlPrefix='data:"application/pdf;base64,'
		var strUrlPrefix='data:'+ travel.uploadContentType +";base64,"
		var url=strUrlPrefix + strData
		var blob = base64toBlob(strData,travel.uploadContentType)
		downloadFileFromData(travel.uploadFileName,blob,travel.uploadContentType)
		event.stopPropagation();
	}		

	
    $scope.getFindWorkFlowOnload()
    $scope.redirectOnBack = function () {
		$state.go("app.RequestListCombined")
		//$ionicNavBarDelegate.back();
        //$state.go('app.RequestList')
    }
});