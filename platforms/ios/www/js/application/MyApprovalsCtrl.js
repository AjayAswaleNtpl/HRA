/*
 1.This controller is used to Approve / Reject for Leave,Shift,Attendance,OD.
 2.Sent for cancellation requests are also Approved / Reject for Leave,Shift,Attendance,OD.
 3.Detailed view can be seen while opening modal by clicking on the list.
 */

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
mainModule.factory("viewAttendaceRegularisationService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/attendance/missPunch/viewApprove.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
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
mainModule.factory("getPhotoService", function ($resource) {
    return $resource((baseURL + '/api/eisCompany/checkProfilePhoto.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout}}, {});
});
mainModule.controller('MyApprovalsCtrl', function ($scope, getPhotoService, $filter, getSetService, $rootScope, commonService, $ionicPopup, $http, viewAttendaceRegularisationService, getRequisitionCountService, viewShiftChangeApprovalService, viewODPendingApplicationService, rejectPendingODService, approvePendingODService, $ionicLoading, $ionicModal, viewLeaveApplicationService, 
detailsService,homeService,$timeout) {
	
    $scope.requesObjectForMonth = {};
    $scope.requesObjectForYear = {};
    $scope.requesObjectForMonth.month = ''
    $scope.requesObjectForYear.year = ''
    $scope.attendPendingObject = {}
    $scope.createdDate = [];
    $scope.resultObject = {}
    $scope.requesObject1 = {}
    $scope.searchObj = {}
    $scope.leaveType = {}
    $scope.searchObj.searchLeave = '';
    $scope.searchObj.searchODManager = ''
    $scope.searchObj.searchQueryAttRegularisationManager = ''
    $scope.searchObj.searchShiftManager = ''
    $scope.ODPendingObject = {}
    $scope.detailResObject = {}
    $scope.attendanceObject = {}
    $scope.approveAtendanceObject = {}
    $scope.resultobj = {}
    var d = new Date();
    $scope.IsLeaveAccessible = sessionStorage.getItem('IsLeaveAccessible');
    $scope.IsODAccessible = sessionStorage.getItem('IsODAccessible');
    $scope.IsRegularizationAccessible = sessionStorage.getItem('IsRegularizationAccessible');
    $scope.IsShiftChangeAccessible = sessionStorage.getItem('IsShiftChangeAccessible');

    if (sessionStorage.getItem('department') && (sessionStorage.getItem('displayDeptName') == '"Department"')) {
        $scope.resultobj.department = sessionStorage.getItem('department');
    }

	
	$scope.leaveListFetched = false
	$scope.odListFetched = false
	$scope.attListFetched = false
	$scope.scListFetched = false
	
    $scope.getLeaveList = function ()
    {
    		
		homeService.updateInboxEmailList("", function () {}, function (data) {})
		
        $scope.searchObj = ''
        $("#ShiftChangeApplicationID").hide();
        $("#leavePendingApplicationID").show();
        $("#ODPendingApplicationID").hide();
        $("#AttendanceApplicationID").hide()
        $("#tabShiftChange").removeClass("active");
        $("#tabLeave").addClass("active");
        $("#tabOD").removeClass("active");
        $("#tabRegularization").removeClass("active");

		
		if ($scope.leaveListFetched==true){
			return;
		}
		$scope.leaveListFetched=true
		
        $ionicLoading.show();
        $scope.requesObject = {}
        var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
        $scope.requesObject.menuId = leaveMenuInfo.menuId;
        $scope.requesObject.buttonRights = "Y-Y-Y-Y"
        $scope.requesObject.formName = "Leave";
        $scope.requesObject.SelfRequestListFlag = 0;
		$ionicLoading.show()
        $scope.viewLeaveApplicationService = new viewLeaveApplicationService();
        $scope.viewLeaveApplicationService.$save($scope.requesObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewLeaveApplicationService")
				$ionicLoading.show()
			}	
			if (data.msg=="ERROR"){
				$ionicLoading.hide()
				showAlert("Error","Something went wrong");
				return;
			}				
            if (data.reporteeLeaveList.length != 0) {
                $scope.createDate = data.reporteeLeaveList[0].createDate;
            }
			
			$scope.leaveApplList = []
			if (data.reporteeLeaveList === undefined){
				//do nothing
			}else{
				$scope.leaveApplList = data.reporteeLeaveList;
			}
            
            for (var i = 0; i < $scope.leaveApplList.length; i++) {
                $scope.leaveStatus = $scope.leaveApplList[i].leaveStatus
                $scope.leaveFromFormatedDate = $scope.leaveApplList[i].leaveFromDate.split('/')
                $scope.leaveApplList[i].leaveFromDate = new Date($scope.leaveFromFormatedDate[2] + '/' + $scope.leaveFromFormatedDate[1] + '/' + $scope.leaveFromFormatedDate[0])
                $scope.leaveToFormatedDate = $scope.leaveApplList[i].leaveToDate.split('/')
                $scope.leaveApplList[i].leaveToDate = new Date($scope.leaveToFormatedDate[2] + '/' + $scope.leaveToFormatedDate[1] + '/' + $scope.leaveToFormatedDate[0])
                if ($scope.leaveApplList[i].leaveFromDate.getTime() == $scope.leaveApplList[i].leaveToDate.getTime()) {
                    $scope.leaveApplList[i].leaveDate = $scope.leaveApplList[i].leaveFromDate;
                }
            }

            var index = 0
            while (index != $scope.leaveApplList.length) {
                $scope.getLeavePhotos(index)
                index++
            }
            $scope.requesObjectForYear.year = ''
            $scope.requesObjectForMonth.month = ''
			$timeout(function () {$ionicLoading.hide()},1500)
            
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

    $scope.getLeavePhotos = function (index) {
        $scope.resultObjectForLeavePic = {}
        $scope.resultObjectForLeavePic.empId = $scope.leaveApplList[index].empId

        $scope.getPhotoService = new getPhotoService();
        $scope.getPhotoService.$save($scope.resultObjectForLeavePic, function (success) {
			
            if (success.profilePhoto != null && success.profilePhoto != "")
            {
                $scope.leaveApplList[index].imageFlag = "0"
                $scope.leaveApplList[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=';
            }

            else
            {
                $scope.leaveApplList[index].imageFlag = "1"
                $scope.leaveApplList[index].profilePhoto = ""
            }
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }


    $scope.getODApplicationList = function () {
		    
		homeService.updateInboxEmailList("", function () {}, function (data) {})
		
        $("#leavePendingApplicationID").hide();
        $("#ShiftChangeApplicationID").hide();
        $("#ODPendingApplicationID").show();
        $("#AttendanceApplicationID").hide()
        $scope.searchObj = ''
        $("#tabShiftChange").removeClass("active");
        $("#tabOD").addClass("active");
        $("#tabLeave").removeClass("active");
        $("#tabRegularization").removeClass("active");
		
		if ($scope.odListFetched==true){
			return;
		}
		$scope.odListFetched=true
		
        $ionicLoading.show();
        var odMenuInfo = getMenuInformation("Attendance Management", "OD Application");
        $scope.requesObject1.menuId = odMenuInfo.menuId;
        $scope.viewODPendingApplicationService = new viewODPendingApplicationService();
        $scope.viewODPendingApplicationService.$save($scope.requesObject1, function (data) {
			$scope.ODPendingApplList = []
            if (data.odApplicationVoList == null) {
                $ionicLoading.hide()
                return;
            }
            
            $scope.ODPendingApplList = data.odApplicationVoList;
            for (var i = 0; i < $scope.ODPendingApplList.length; i++) {
                $scope.odFormatedFromDate = $scope.ODPendingApplList[i].travelDate.split('/')
                $scope.ODPendingApplList[i].odFromDate = new Date($scope.odFormatedFromDate[2] + '/' + $scope.odFormatedFromDate[1] + '/' + $scope.odFormatedFromDate[0])
                $scope.odFormatedToDate = $scope.ODPendingApplList[i].travelDate_new.split('/')
                $scope.ODPendingApplList[i].odToDate = new Date($scope.odFormatedToDate[2] + '/' + $scope.odFormatedToDate[1] + '/' + $scope.odFormatedToDate[0])
                if ($scope.ODPendingApplList[i].odFromDate.getTime() == $scope.ODPendingApplList[i].odToDate.getTime()) {
                    $scope.ODPendingApplList[i].odDate = $scope.ODPendingApplList[i].odFromDate;
                }
            }

            var index = 0
            while (index != $scope.ODPendingApplList.length) {
                $scope.getODPhotos(index)
                index++
            }
            $scope.requesObjectForYear.year = ''
            $scope.requesObjectForMonth.month = ''
            $ionicLoading.hide()
        }
        , function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

    $scope.getODPhotos = function (index) {
        $scope.resultObjectForODPic = {}
        $scope.resultObjectForODPic.empId = $scope.ODPendingApplList[index].empId
        $scope.getPhotoService = new getPhotoService();
        $scope.getPhotoService.$save($scope.resultObjectForODPic, function (success) {
            if (success.profilePhoto != null && success.profilePhoto != "")
            {
                $scope.ODPendingApplList[index].imageFlag = "0"
                $scope.ODPendingApplList[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=';
            }

            else {
                $scope.ODPendingApplList[index].imageFlag = "1"
                $scope.ODPendingApplList[index].profilePhoto = ""
            }
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

	
    $scope.getAttendanceApplicationListForCurrentYear = function () {
		$scope.requesObjectForYear.year = null;
		$scope.attListFetched = false
		$scope.getAttendanceApplicationList()
	}
    $scope.getAttendanceApplicationListForPrevYear = function () {
		if ($scope.requesObjectForYear.year < new Date().getFullYear()){
			return
		}
		$scope.requesObjectForYear.year = new Date().getFullYear()
		$scope.requesObjectForYear.year = $scope.requesObjectForYear.year - 1
		$scope.attListFetched = false
		$scope.getAttendanceApplicationList()
	}

    $scope.getAttendanceApplicationList = function () {
	    
		homeService.updateInboxEmailList("", function () {}, function (data) {})
		
        $scope.attendanceObject = {}
        var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");
        $scope.attendanceObject.menuId = attendanceMenuInfo.menuId;
        $scope.attendanceObject.buttonRights = "Y-Y-Y-Y"
        if (!$scope.requesObjectForYear.year) {
            $scope.attendanceObject.year = new Date().getFullYear();
            $scope.requesObjectForYear.year = $scope.attendanceObject.year.toString()
        } else {
            $scope.attendanceObject.year = $scope.requesObjectForYear.year;
            $scope.requesObjectForYear.year = $scope.attendanceObject.year
            $scope.requesObjectForMonth.month.month = ''
        }
        if ($scope.requesObjectForMonth.month == undefined || $scope.requesObjectForMonth.month == "") {
            $scope.attendanceObject.monthId = parseInt(new Date().getMonth()) + 1;
            $scope.requesObjectForMonth.month = $scope.attendanceObject.monthId
        } else {
            $scope.attendanceObject.monthId = $scope.requesObjectForMonth.month;
        }
		//sending monthid as 0 to fetch whole year data
		$scope.attendanceObject.monthId = 0
		if( $scope.requesObjectForYear.year  == new Date().getFullYear()){
			//current year
			$scope.yearInfo="CURRENT"
			
		}else if( new Date().getFullYear()- $scope.requesObjectForYear.year==1  ){
					//prev year
					$scope.yearInfo="PREVIOUS"
		}
		
        $("#leavePendingApplicationID").hide();
        $("#ODPendingApplicationID").hide();
        $("#ShiftChangeApplicationID").hide();
        $("#AttendanceApplicationID").show()
        $scope.searchObj = ''
        $("#tabShiftChange").removeClass("active");
        $("#tabRegularization").addClass("active");
        $("#tabOD").removeClass("active");
        $("#tabLeave").removeClass("active");
		
		if ($scope.attListFetched==true){
			return;
		}
		$scope.attListFetched=true
        
		$ionicLoading.show();
        $scope.viewAttendaceRegularisationService = new viewAttendaceRegularisationService();
        $scope.viewAttendaceRegularisationService.$save($scope.attendanceObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewAttendaceRegularisationService")
				
			}	
			if (data.listMonth === undefined){
				$ionicLoading.hide()
				return;
			}
            $scope.monthList = data.listMonth;
            $scope.yearListforAtt = data.missedPunchForm.listYear;
			
			$scope.AttendanceApplList = []
			if(data.missedPunchVOList===undefined){
			//do nothing
			}else{
				$scope.AttendanceApplList = data.missedPunchVOList;
			}
            
            
            for (var i = 0; i < $scope.AttendanceApplList.length; i++) {
                $scope.outTimeDate = $scope.AttendanceApplList[i].outTimeDateStr.split('/')
                $scope.AttendanceApplList[i].outTimeDateStr = new Date($scope.outTimeDate[2] + '/' + $scope.outTimeDate[1] + '/' + $scope.outTimeDate[0])
            }

            var index = 0
            while (index != $scope.AttendanceApplList.length) {
                $scope.getAttendancePhotos(index)
                index++
            }

            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

    $scope.getAttendancePhotos = function (index) {
        $scope.resultObjectForAttendancePic = {}
        $scope.resultObjectForAttendancePic.empId = $scope.AttendanceApplList[index].empId

        $scope.getPhotoService = new getPhotoService();
        $scope.getPhotoService.$save($scope.resultObjectForAttendancePic, function (success) {
            if (success.profilePhoto != null && success.profilePhoto != "")
            {
                $scope.AttendanceApplList[index].imageFlag = "0"
                $scope.AttendanceApplList[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=';
            }

            else {
                $scope.AttendanceApplList[index].imageFlag = "1"
                $scope.AttendanceApplList[index].profilePhoto = ""
            }
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }


    $scope.shiftChangeDetail = function (shiftDet) {
		    $ionicLoading.show();
		homeService.updateInboxEmailList("", function () {}, function (data) {})
		
        
        $scope.shiftChangeObject1 = shiftDet;
        $scope.shiftChangeDetailObject = {};
        $scope.shiftModalResultObject = {};
        $scope.shiftModalResultObject.empId = shiftDet.empId;
        $scope.genderDetails = shiftDet.gender;
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
        $scope.getShiftModalPic();
    }

    $scope.getShiftModalPic = function () {
        $ionicLoading.show({});
        $scope.getPhotoService = new getPhotoService();
        $scope.getPhotoService.$save($scope.shiftModalResultObject, function (success) {
            if (success.profilePhoto)
            {
                $scope.profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + $scope.shiftModalResultObject.empId + '';
                $ionicLoading.hide();
            }
            else
            {
                if ($scope.genderDetails == 'M')
                {
                    $scope.gender = ('profilePhoto', "./img/Male.png");
                }
                else
                {
                    $scope.gender = ('profilePhoto', "./img/Female.png");
                }

                $scope.profilePhoto = ''
                $ionicLoading.hide();
            }
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

    $scope.getShiftChangeApplicationList = function () {
		
        $scope.shiftChangeObject = {}
        var shiftChangeMenuInfo = getMenuInformation("Attendance Management", "Shift Change");
        $scope.shiftChangeObject.menuId = shiftChangeMenuInfo.menuId;
        $scope.shiftChangeObject.buttonRights = "Y-Y-Y-Y"
        $scope.shiftChangeObject.empId = sessionStorage.getItem('empId');
        $scope.shiftChangeObject.status = 'SENT FOR APPROVAL';
        $("#leavePendingApplicationID").hide();
        $("#ODPendingApplicationID").hide();
        $("#AttendanceApplicationID").hide();
        $("#ShiftChangeApplicationID").show();
        $scope.searchObj = ''
        $("#tabShiftChange").addClass("active");
        $("#tabRegularization").removeClass("active");
        $("#tabOD").removeClass("active");
        $("#tabLeave").removeClass("active");
		
		if ($scope.scListFetched==true){
			return;
		}
		$scope.scListFetched=true
		
		
        $ionicLoading.show();
        $scope.viewShiftChangeApprovalService = new viewShiftChangeApprovalService();
        $scope.viewShiftChangeApprovalService.$save($scope.shiftChangeObject, function (data) {
			
            $scope.shiftChangeApprovalApplList = [];
			if(data.shiftChangeForm===undefined){
				//do nothing
			}else{
				$scope.shiftChangeApprovalApplList = data.shiftChangeForm;
			}

            $scope.requestDateList = [];
            for (var i = 0; i < $scope.shiftChangeApprovalApplList.length; i++) {
                $scope.requestDate = $scope.shiftChangeApprovalApplList[i].reqDate.split('/')
                $scope.shiftChangeApprovalApplList[i].reqDate = new Date($scope.requestDate[2] + '/' + $scope.requestDate[1] + '/' + $scope.requestDate[0])

               // $scope.createdDate = $scope.shiftChangeApprovalApplList[i].createdDate.split('-')
               // $scope.shiftChangeApprovalApplList[i].createdDate = new Date($scope.createdDate[2] + '-' + $scope.createdDate[1] + '-' + $scope.createdDate[0])
            }

            var index = 0
            while (index != $scope.shiftChangeApprovalApplList.length) {
                $scope.getShiftPhotos(index)
                index++
            }
            $scope.requesObjectForYear.year = ''
            $scope.requesObjectForMonth.month = ''
            $ionicLoading.hide()
        }, function (data) {
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

    $scope.getShiftPhotos = function (index) {
        $scope.resultObjectForShiftPic = {}
        $scope.resultObjectForShiftPic.empId = $scope.shiftChangeApprovalApplList[index].empId

        $scope.getPhotoService = new getPhotoService();
        $scope.getPhotoService.$save($scope.resultObjectForShiftPic, function (success) {
            if (success.profilePhoto != null && success.profilePhoto != "")
            {
                $scope.shiftChangeApprovalApplList[index].imageFlag = "0"
                $scope.shiftChangeApprovalApplList[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=';
            }

            else {
                $scope.shiftChangeApprovalApplList[index].imageFlag = "1"
                $scope.shiftChangeApprovalApplList[index].profilePhoto = ""
            }
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }



    $scope.approveAttendanceApplicationList = function (Attendance, type) {
        $scope.approveAtendanceObject = {}
        $scope.attendPendingObject.remark = "";
        $scope.data = {}
        var temp = {}
        $scope.approveAtendanceObject.missedPunchVOList1 = []
        var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");
        $scope.approveAtendanceObject.menuId = attendanceMenuInfo.menuId;
        $scope.approveAtendanceObject.buttonRights = 'Y-Y-Y-Y'
        var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
        $scope.approveAtendanceObject.leaveAppId = leaveMenuInfo.menuId;
        var odMenuInfo = getMenuInformation("Attendance Management", "OD Application");
        $scope.approveAtendanceObject.odAppId = odMenuInfo.menuId;
        $scope.approveAtendanceObject.year = d.getFullYear();
        $scope.approveAtendanceObject.monthId = d.getMonth()
        temp.attDate = Attendance.attDate
        temp.fhOLStatus = Attendance.fhOLStatus
        temp.shOLStatus = Attendance.shOLStatus
        temp.isODPresent = Attendance.isODPresent
        temp.isLeavePresent = Attendance.isLeavePresent
        temp.isAssign1 = true
        temp.firstHalf = Attendance.firstHalf
        temp.secondHalf = Attendance.secondHalf
        temp.actualInTimeStr = Attendance.actualInTimeStr
        temp.lateComming = Attendance.lateComming
        temp.inTimeStr = Attendance.inTimeStr
        temp.actualOutTimeStr = Attendance.actualOutTimeStr
        temp.earlyGoing = Attendance.earlyGoing
        temp.outTimeStr = Attendance.outTimeStr
        temp.outTimeDateStr = $filter('date')(Attendance.outTimeDateStr, 'dd/MM/yyyy');
        temp.shiftMasterChild = Attendance.shiftMasterChild
        temp.workedHrs = Attendance.workedHrs
        temp.remarks = Attendance.remarks
        temp.status = Attendance.status
        temp.transId = Attendance.transId
        temp.appRemarks = Attendance.appRemarks
        temp.othRemarks = Attendance.othRemarks
        temp.trackerId = Attendance.trackerId

        $scope.approveAtendanceObject.missedPunchVOList1.push(temp)
        if (type == "APPROVE") {
			$scope.attendPendingObject.remark = ""
            var myPopup = $ionicPopup.show({
                template: '<label>Approver Remarks<form name="myForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" name="mybox" rows="3" ng-model="attendPendingObject.remark" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
                title: 'Do you want to approve?',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'}, {
                        text: '<b>Approve</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            return $scope.attendPendingObject.remark || true;
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                if (res) {
                    $ionicLoading.show({
					
                    });
					$scope.approveAtendanceObject.appRemarks = $scope.attendPendingObject.remark
                    $http({
                        url: (baseURL + '/api/attendance/missPunch/approveMissedPunchApp.spr'),
                        method: 'POST',
                        timeout: commonRequestTimeout,
                        transformRequest: jsonTransformRequest,
                        data: $scope.approveAtendanceObject,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Bearer ' + jwtByHRAPI
                            }
                    }).
                            success(function (data) {
                                getMenuInfoOnLoad(function () {
                                });
                                showAlert("Attendance application", "Attendance approved successfully");
								$ionicLoading.show()
								$scope.attListFetched = false
                                $scope.getAttendanceApplicationList();
								
                            }).error(function (data, status) {
                        $scope.data = {status: status};
                        commonService.getErrorMessage($scope.data);
                        $ionicLoading.hide()
                    })
                } else {
                    autoRetryCounter = 0
                    $ionicLoading.hide()
                    return;
                }
            });
        }
        if (type == "REJECT") {
            var myPopup = $ionicPopup.show({
                template: '<label>Approver Remarks<form name="myRejectForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" name="myRejectBox" rows="3" ng-model="data.attendReject" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
                title: 'Do you want to reject?',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'}, {
                        text: '<b>Reject</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            return $scope.data.attendReject || true;
                        }
                    }
                ]
            });
            myPopup.then(function (res) {

                if (res) {
                    $ionicLoading.show({
                    });
					$scope.approveAtendanceObject.remark =  $scope.data.attendReject
                    $http({
                        url: (baseURL + '/api/attendance/missPunch/rejectMissedPunchApp.spr'),
                        method: 'POST',
                        timeout: commonRequestTimeout,
                        transformRequest: jsonTransformRequest,
                        data: $scope.approveAtendanceObject,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Bearer ' + jwtByHRAPI
                            }
                    }).
                            success(function (data) {
                                getMenuInfoOnLoad(function () {
                                });
                                showAlert("Attendance application", "Attendance rejected successfully");
								$ionicLoading.show()
								$scope.attListFetched = false
                                $scope.getAttendanceApplicationList();
								$ionicLoading.hide()
                            }).error(function (data, status) {
                        $ionicLoading.hide()
                        $scope.data = {status: status};
                        commonService.getErrorMessage($scope.data);
                    })
                } else {
                    $ionicLoading.hide()
                    return;
                }
            });
        }
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
    $scope.approvedLeave = function (status, leaveTransId, leaveFromDate, leaveToDate, remarks) {
        $ionicLoading.show();
        $scope.detailResObject.leaveTransId = leaveTransId
        var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
        $scope.detailResObject.menuId = leaveMenuInfo.menuId;
        $scope.detailResObject.buttonRights = "Y-Y-Y-Y"
        $scope.detailResObject.fromEmail = "N"
        $scope.detailsService = new detailsService();
        $scope.detailsService.$save($scope.detailResObject, function (data) {
            $scope.approvResObject = {}
            $scope.approvResObject.leaveAppVo = {}
            $scope.approvResObject.menuId = leaveMenuInfo.menuId;
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
	
            $scope.approvResObject.remarks = remarks;
            if (status == 'show') {
                $scope.modal.hide()
            }
			$ionicLoading.show()
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
                        getMenuInfoOnLoad(function () {
                        });
						
                        if (data.msg=="" || data.msg.substring(0, 5) =="ERROR"){
							showAlert("Something went wrong. Please try again.");
						}else{
							showAlert(data.msg);
						}
						
						$scope.leaveListFetched = false
                        $scope.getLeaveList()
						
						
                    }).error(function (data, status) {
                $ionicLoading.hide()
                $scope.data = {status: status};
                commonService.getErrorMessage($scope.data);
            });
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

    $scope.rejectLeave = function (status, leaveTransId, leaveFromDate, leaveToDate, onreject) {
        $ionicLoading.show();
        $scope.detailResObject.leaveTransId = leaveTransId
        var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
        $scope.detailResObject.menuId = leaveMenuInfo.menuId;
        $scope.detailResObject.buttonRights = "Y-Y-Y-Y"
        $scope.detailResObject.fromEmail = "N"

        $scope.detailsService = new detailsService();
        $scope.detailsService.$save($scope.detailResObject, function (data) {
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
			$ionicLoading.show()
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
                        getMenuInfoOnLoad(function () {
                        });
                        showAlert("", "Application rejected successfully");
						$scope.leaveListFetched=false
                        $scope.getLeaveList()
                        
                    }).error(function (data, status) {
                $ionicLoading.hide();
                $scope.data = {status: status};
                commonService.getErrorMessage($scope.data);
            });
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            $scope.data = {status: status};
            commonService.getErrorMessage($scope.data);
        });
    }

    $scope.detailInfoReporty = function (transid, leaveObj) {
        $scope.empCode = leaveObj.empCode;
        $scope.genderDetails = leaveObj.gender;
        $ionicLoading.show({});
        var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
        $scope.detailResObject.leaveTransId = transid
        $scope.detailResObject.menuId = leaveMenuInfo.menuId;
        $scope.detailResObject.buttonRights = "Y-Y-Y-Y"
        $scope.detailResObject.fromEmail = "N"
        $scope.detailsService = new detailsService();
        $scope.detailsService.$save($scope.detailResObject, function (data) {
            if (data.form.leaveAppVo.fileNm) {
                $scope.fileName = data.form.leaveAppVo.fileNm
            }
            $scope.resultObject.empId = data.form.leaveAppVo.empId
            $scope.leaveType = leaveObj.leaveType;
            $scope.leaveApplyDetail = data.form.leaveAppVo;
            $scope.leaveReason = data.form.leaveAppVo.leaveReason;
            $scope.status = leaveObj.leaveStatus;
            $scope.title = data.form.leaveAppVo;
            $scope.name = data.form.leaveAppVo.name;
            $scope.leaveFromDate = data.form.leaveAppVo.leaveFromDate.split('/')
            $scope.leaveFromDate = new Date($scope.leaveFromDate[2] + '/' + $scope.leaveFromDate[1] + '/' + $scope.leaveFromDate[0])
            $scope.leaveToDate = data.form.leaveAppVo.leaveToDate.split('/')
            $scope.leaveToDate = new Date($scope.leaveToDate[2] + '/' + $scope.leaveToDate[1] + '/' + $scope.leaveToDate[0])
            if ($scope.leaveFromDate.getTime() == $scope.leaveToDate.getTime()) {
                $scope.leaveDate = $scope.leaveFromDate;
            }
            else {
                $scope.leaveDate = null;
            }
            $scope.phoneNo = data.form.leaveAppVo.phone != "null" ? data.form.leaveAppVo.phone : "";
            $scope.toLeaveType = data.form.leaveAppVo.toLeaveType;
            $scope.fromLeaveType = data.form.leaveAppVo.fromLeaveType;
            $scope.noOfDaysCounted = data.form.leaveAppVo.noDaysCounted;
            $scope.noOfHours = parseInt(data.form.leaveAppVo.toLvHr) - parseInt(data.form.leaveAppVo.fromLvHr);
            $scope.fromLeaveType = $scope.fromLeaveType.charAt(0).toUpperCase() + $scope.fromLeaveType.slice(1)
            $scope.fromLeaveType = $scope.fromLeaveType.replace(/([a-z](?=[A-Z]))/g, '$1 ')
            $scope.openModal();
            $ionicLoading.hide()
            $scope.getPic();
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
        $scope.fileName = ''
    }

    $scope.downloadedFile = function () {
        $ionicLoading.show({
        });
        var uri;
        var fileURL;
        if (ionic.Platform.isAndroid()) {
            uri = baseURL + "/api/leaveApplication/openFile.spr?transId=" + $scope.detailResObject.leaveTransId;
            fileURL = cordova.file.externalDataDirectory + $scope.fileName;

            var fileTransfer = new FileTransfer();
            fileTransfer.download(
                    uri,
                    fileURL,
                    function (success) {
                        $ionicLoading.show({
                        });
                        $ionicLoading.hide();
                        showAlert("", "File downloaded successfully.")
                        cordova.plugins.fileOpener2.open(
                                fileURL,
                                '*/*',
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
                        if (error.http_status == 406)
                        {
                            showAlert("", "File is not available");
                        }
                        else if (error.code == 1)
                        {
                            showAlert("", "Please give storage permission");
                        }
                        else if (error.code == 3)
                        {
                            $ionicLoading.hide()
                            commonService.getErrorMessage(error);
                        }
                        $ionicLoading.hide()
                    });
        }
        else
        {
            $ionicLoading.hide()
            uri = baseURL + "/api/leaveApplication/openFile.spr?transId=" + $scope.detailResObject.leaveTransId;
            if (window.XMLHttpRequest)
            {
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

    $scope.getPic = function () {
        $ionicLoading.show({});
        $scope.getPhotoService = new getPhotoService();
        $scope.getPhotoService.$save($scope.resultObject, function (success) {
            if (success.profilePhoto)
            {
                $scope.profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + $scope.resultObject.empId + '';
                $ionicLoading.hide();
            }
            else
            {
                if ($scope.genderDetails == 'M')
                {
                    $scope.gender = ('profilePhoto', "./img/Male.png");
                }
                else
                {
                    $scope.gender = ('profilePhoto', "./img/Female.png");
                }

                $scope.profilePhoto = ''
                $ionicLoading.hide();
            }
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

    $scope.approveOrRejectPendingOD = function (odPending, type) {
        $scope.data = {}
        $scope.ODPendingObject.odIds = odPending.odID;
        $scope.ODPendingObject.empId = sessionStorage.getItem('empId');
        $scope.ODPendingObject.menuId = $scope.requesObject1.menuId;
        $scope.ODPendingObject.buttonRights = "Y-Y-Y-Y";
        $scope.ODPendingObject.remark = "";
        $scope.ODPendingObject.code = "notEmail";
        if (type == "APPROVE") {
            var myPopup = $ionicPopup.show({
                template: '<label>Approver Remarks<form name="myForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" rows="3" name="mybox" ng-model="ODPendingObject.remark" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
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
                    $ionicLoading.show();
                    $scope.approvePendingODService = new approvePendingODService();
                    $scope.approvePendingODService.$save($scope.ODPendingObject, function (data) {
						if (!(data.clientResponseMsg=="OK")){
							console.log(data.clientResponseMsg)
							handleClientResponse(data.clientResponseMsg,"approvePendingODService")
							$ionicLoading.hide()
						}
                        getMenuInfoOnLoad(function () {
                        });
						
                        showAlert("OD application", "OD approved successfully");
						$scope.odListFetched = false
                        $scope.getODApplicationList();
						$ionicLoading.hide()
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
                template: '<label>Approver Remarks<form name="myRejectForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" rows="3" name="myRejectBox" ng-model="data.odReject" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myRejectForm.myRejectBox.$error.maxlength">No more text can be added.</span></form></label>',
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
							$ionicLoading.hide()
						}	
						$scope.odListFetched = false
                        $scope.getODApplicationList();
                        getMenuInfoOnLoad(function () {
                        });
						$ionicLoading.hide()
                        showAlert("OD application", "OD rejected successfully");
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
    $scope.onConfirm = function (status, type, leaveTransId, leaveFromDate, leaveToDate)
    {
        $scope.data = {}
        if (type == 1)
        {
            var myPopup = $ionicPopup.show({
                template: '<label>Approver Remarks<form name="myApproveForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" name="mybox" rows="3" ng-model="data.onApprove" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myApproveForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
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
					$ionicLoading.show()
                    $scope.approvedLeave(status, leaveTransId, leaveFromDate, leaveToDate, $scope.data.onApprove)
                    return
                } else {
                    return;
                }
            });
        } else if (type == 2)
        {
            var myPopup = $ionicPopup.show({
                template: '<label>Approver Remarks<form name="myRejectForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" name="mybox" rows="3" ng-model="data.onreject" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
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
					$ionicLoading.show()
                    $scope.rejectLeave(status, leaveTransId, leaveFromDate, leaveToDate, $scope.data.onreject)
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
        $scope.approvalRequestObject.shiftChangeVOList.push($scope.temp);
        if (status == 'show') {
            $scope.modalShift.hide()
        }
		$ionicLoading.show()
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
        }).success(function (data) {
			$ionicLoading.hide()
            showAlert("Successfully approved")
            getMenuInfoOnLoad(function () {
            });
			$scope.scListFetched = false
            $scope.getShiftChangeApplicationList()
            $ionicLoading.hide()
        }).error(function (data, status) {
            autoRetryCounter = 0
            var data = {};
            data.status = status;
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
    $scope.rejectShiftChange = function (status, shiftObject, remarks) {
        $ionicLoading.show({});
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
        $scope.rejectionRequestObject.shiftChangeVOList.push($scope.temp);
        if (status == 'show') {
            $scope.modalShift.hide()
        }
		$ionicLoading.show()
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
                    getMenuInfoOnLoad(function () {
                    });
                    showAlert("Application rejected")
					$scope.scListFetched = false
                    $scope.getShiftChangeApplicationList()
                    $ionicLoading.hide()
                }).error(function (data, status) {
            var data = {};
            data.status = status;
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

    $scope.onConfirmShift = function (status, type, shiftObject)
    {
        $scope.dataShift = {}
        if (type == 1)
        {
            var myPopup = $ionicPopup.show({
                template: '<label>Approver Remarks<form name="myForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" name="mybox" rows="3" ng-model="dataShift.onApprove" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
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
                template: '<label>Approver Remarks<form name="myForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" name="mybox" rows="3" ng-model="dataShift.onreject" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
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

    $scope.cancelApproveLeave = function (status, leaveTransId, leaveFromDate, leaveToDate, remarks) {
        $ionicLoading.show({});
        $scope.detailResObject.leaveTransId = leaveTransId
        var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
        $scope.detailResObject.menuId = leaveMenuInfo.menuId;
        $scope.detailResObject.buttonRights = "Y-Y-Y-Y"

        $scope.detailsService = new detailsService();
        $scope.detailsService.$save($scope.detailResObject, function (data) {
            $scope.approvCancelLeaveObject = {}
            $scope.approvCancelLeaveObject.leaveAppVo = {}
            $scope.approvCancelLeaveObject.menuId = leaveMenuInfo.menuId;
            $scope.approvCancelLeaveObject.buttonRights = "Y-Y-Y-Y";
            $scope.approvCancelLeaveObject.leaveAppVo.afterBalance = data.form.leaveAppVo.afterBalance;
            $scope.approvCancelLeaveObject.leaveAppVo.currentBalance = data.form.leaveAppVo.currentBalance;
            $scope.approvCancelLeaveObject.leaveAppVo.empId = data.form.leaveAppVo.empId;
            $scope.approvCancelLeaveObject.leaveAppVo.leastCount = data.form.leaveAppVo.leastCount;
            $scope.approvCancelLeaveObject.leaveAppVo.leaveApproved = data.form.leaveAppVo.leaveApproved;
            $scope.approvCancelLeaveObject.leaveAppVo.leaveBalBefore = data.form.leaveAppVo.leaveBalBefore;
            $scope.approvCancelLeaveObject.leaveAppVo.leaveFromDate = data.form.leaveAppVo.leaveFromDate;
            $scope.approvCancelLeaveObject.leaveAppVo.leaveToDate = data.form.leaveAppVo.leaveToDate;
            $scope.approvCancelLeaveObject.leaveAppVo.leaveInProcess = data.form.leaveAppVo.leaveInProcess;
            $scope.approvCancelLeaveObject.leaveAppVo.leaveReason = data.form.leaveAppVo.leaveReason;
            $scope.approvCancelLeaveObject.leaveAppVo.leaveTransId = data.form.leaveAppVo.leaveTransId;
            $scope.approvCancelLeaveObject.leaveAppVo.name = data.form.leaveAppVo.name;
            $scope.approvCancelLeaveObject.leaveAppVo.phone = data.form.leaveAppVo.phone;
            $scope.approvCancelLeaveObject.leaveAppVo.fromLeaveType = data.form.leaveAppVo.fromLeaveType;
            $scope.approvCancelLeaveObject.leaveAppVo.leaveTypeId = data.form.leaveAppVo.leaveTypeId;
            $scope.approvCancelLeaveObject.leaveAppVo.mailType = "APPROVER";
            $scope.approvCancelLeaveObject.leaveAppVo.noDaysCounted = data.form.leaveAppVo.noDaysCounted;
            $scope.approvCancelLeaveObject.leaveAppVo.noOfDays = data.form.leaveAppVo.noOfDays;
            $scope.approvCancelLeaveObject.leaveAppVo.toLeaveType = data.form.leaveAppVo.toLeaveType;
            $scope.approvCancelLeaveObject.leaveAppVo.remarks = remarks;
            $scope.approvCancelLeaveObject.leaveAppVo.leaveLeastCountMsg = "";
            $scope.approvCancelLeaveObject.leaveAppVo.trackerId = data.form.leaveAppVo.trackerId;
            $scope.approvCancelLeaveObject.leaveAppVo.fromLvHr = data.form.leaveAppVo.fromLvHr;
            $scope.approvCancelLeaveObject.leaveAppVo.toLvHr = data.form.leaveAppVo.toLvHr;
            $scope.approvCancelLeaveObject.leaveAppVo.RaisedBy = data.form.leaveAppVo.RaisedBy;
            $scope.approvCancelLeaveObject.leaveAppVo.fromEmail = data.form.leaveAppVo.fromEmail;
            $scope.approvCancelLeaveObject.leaveAppVo.address = data.form.leaveAppVo.address;
            $scope.approvCancelLeaveObject.leaveAppVo.email = data.form.leaveAppVo.email;
            $scope.approvCancelLeaveObject.leaveAppVo.requiesitionDate = data.form.leaveAppVo.requiesitionDate;


            $http({
                url: (baseURL + '/api/leaveApplication/approveLeaveCan.spr'),
                method: 'POST',
                timeout: commonRequestTimeout,
                transformRequest: jsonTransformRequest,
                data: $scope.approvCancelLeaveObject,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + jwtByHRAPI
                    }
            }).
                    success(function (data) {
                        getMenuInfoOnLoad(function () {
                        });
                        showAlert("", "Application approved successfully");
						$scope.leaveListFetched=false
                        $scope.getLeaveList()
                        
                    }).error(function (data, status) {
                $ionicLoading.hide()
                $scope.data = {status: status};
                commonService.getErrorMessage($scope.data);
            });
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

    $scope.rejectApproveLeave = function (status, leaveTransId, leaveFromDate, leaveToDate, onreject) {
        $ionicLoading.show({
        });
        $scope.detailResObject.leaveTransId = leaveTransId
        var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
        $scope.detailResObject.menuId = leaveMenuInfo.menuId;
        $scope.detailResObject.buttonRights = "Y-Y-Y-Y"

        $scope.detailsService = new detailsService();
        $scope.detailsService.$save($scope.detailResObject, function (data) {
            $scope.rejectResObject = {}
            $scope.rejectResObject.leaveAppVo = {}
            $scope.rejectResObject.menuId = leaveMenuInfo.menuId;
            $scope.rejectResObject.buttonRights = "Y-Y-Y-Y";
            $scope.rejectResObject.leaveAppVo.afterBalance = data.form.leaveAppVo.afterBalance;
            $scope.rejectResObject.leaveAppVo.currentBalance = data.form.leaveAppVo.currentBalance;
            $scope.rejectResObject.leaveAppVo.empId = data.form.leaveAppVo.empId;
            $scope.rejectResObject.leaveAppVo.leastCount = data.form.leaveAppVo.leastCount;
            $scope.rejectResObject.leaveAppVo.leaveApproved = data.form.leaveAppVo.leaveApproved;
            $scope.rejectResObject.leaveAppVo.leaveBalBefore = data.form.leaveAppVo.leaveBalBefore;
            $scope.rejectResObject.leaveAppVo.leaveFromDate = data.form.leaveAppVo.leaveFromDate;
            $scope.rejectResObject.leaveAppVo.leaveToDate = data.form.leaveAppVo.leaveToDate;
            $scope.rejectResObject.leaveAppVo.leaveInProcess = data.form.leaveAppVo.leaveInProcess;
            $scope.rejectResObject.leaveAppVo.leaveReason = data.form.leaveAppVo.leaveReason;
            $scope.rejectResObject.leaveAppVo.leaveTransId = data.form.leaveAppVo.leaveTransId;
            $scope.rejectResObject.leaveAppVo.name = data.form.leaveAppVo.name;
            $scope.rejectResObject.leaveAppVo.phone = data.form.leaveAppVo.phone;
            $scope.rejectResObject.leaveAppVo.fromLeaveType = data.form.leaveAppVo.fromLeaveType;
            $scope.rejectResObject.leaveAppVo.leaveTypeId = data.form.leaveAppVo.leaveTypeId;
            $scope.rejectResObject.leaveAppVo.mailType = "APPROVER";
            $scope.rejectResObject.leaveAppVo.noDaysCounted = data.form.leaveAppVo.noDaysCounted;
            $scope.rejectResObject.leaveAppVo.noOfDays = data.form.leaveAppVo.noOfDays;
            $scope.rejectResObject.leaveAppVo.toLeaveType = data.form.leaveAppVo.toLeaveType;
            $scope.rejectResObject.leaveAppVo.remarks = onreject;
            $scope.rejectResObject.leaveAppVo.leaveLeastCountMsg = "";
            $scope.rejectResObject.leaveAppVo.trackerId = data.form.leaveAppVo.trackerId;
            $scope.rejectResObject.leaveAppVo.fromLvHr = data.form.leaveAppVo.fromLvHr;
            $scope.rejectResObject.leaveAppVo.toLvHr = data.form.leaveAppVo.toLvHr;
            $scope.rejectResObject.leaveAppVo.RaisedBy = data.form.leaveAppVo.RaisedBy;
            $scope.rejectResObject.leaveAppVo.fromEmail = data.form.leaveAppVo.fromEmail;
            $scope.rejectResObject.leaveAppVo.address = data.form.leaveAppVo.address;
            $scope.rejectResObject.leaveAppVo.email = data.form.leaveAppVo.email;
            $scope.rejectResObject.leaveAppVo.requiesitionDate = data.form.leaveAppVo.requiesitionDate;
            $http({
                url: (baseURL + '/api/leaveApplication/rejectLeavecancel.spr'),
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
                        getMenuInfoOnLoad(function () {
                        });
                        showAlert("", "Application rejected successfully");
						$scope.leaveListFetched=false
                        $scope.getLeaveList()

                    }).error(function (data, status) {
                $ionicLoading.hide();
                $scope.data = {status: status};
                commonService.getErrorMessage($scope.data);
            });
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            $scope.data = {status: status};
            commonService.getErrorMessage($scope.data);
        });
    }

    $scope.onConfirmLeaveCancel = function (type, status, leaveTransId, leaveFromDate, leaveToDate)
    {
        $scope.data = {}
        if (type == 1)
        {
            var myPopup = $ionicPopup.show({
                template: '<label>Approver Remarks<form name="myApproveForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" name="mybox" rows="3" ng-model="data.onApproveLeave" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myApproveForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
                title: 'Do you want to approve?',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'}, {
                        text: '<b>Approve</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            return $scope.data.onApproveLeave || true;
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                if (res) {
                    $scope.cancelApproveLeave(status, leaveTransId, leaveFromDate, leaveToDate, $scope.data.onApproveLeave)
                    return
                } else {
                    return;
                }
            });
        } else if (type == 2)
        {
            var myPopup = $ionicPopup.show({
                template: '<label>Approver Remarks<form name="myRejectForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" name="mybox" rows="3" ng-model="data.onApprovereject" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
                title: 'Do you want to reject?',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'}, {
                        text: '<b>Reject</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            return $scope.data.onApprovereject || true;
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                if (res) {
                    $scope.rejectApproveLeave(status, leaveTransId, leaveFromDate, leaveToDate, $scope.data.onApprovereject)
                    return
                } else {
                    return;
                }
            });
        }
    }

    function getMenuInfoOnLoad(success) {
        $rootScope.getRequisitionCountService = new getRequisitionCountService();
        $rootScope.getRequisitionCountService.$save(function (data) {
            if (data.odApplication && (sessionStorage.getItem('IsRegularizationAccessible') == 'true'))
            {
                attendRegularInProcessCount = data.odApplication.inProcess;
            } else
            {
                attendRegularInProcessCount = '0'
            }
            if (data.leaveApplication && (sessionStorage.getItem('IsLeaveAccessible') == 'true'))
            {
                leaveAppliInProcessCount = data.leaveApplication.inProcess;
            } else
            {
                leaveAppliInProcessCount = '0'
            }
            if (data.attendanceRegularisation && (sessionStorage.getItem('IsODAccessible') == 'true'))
            {
                odApplicationInProcessCount = data.attendanceRegularisation.inProcess;
            } else
            {
                odApplicationInProcessCount = '0'
            }
            if (data.shiftChange && (sessionStorage.getItem('IsShiftChangeAccessible') == 'true'))
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
            success();
        }, function (data) {
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
	
	
	$scope.refreshLeaveList = function(){
		$scope.leaveListFetched = false
		$scope.getLeaveList()
	
	}		
	
	$scope.refreshODList = function(){
		$scope.odListFetched = false
		$scope.getODApplicationList()
	
	}		
	
	$scope.refreshAttList = function(){
		$scope.attListFetched = false
		$scope.getAttendanceApplicationList()
	
	}		
	
	$scope.refreshSCList = function(){
		$scope.scListFetched = false
		$scope.getShiftChangeApplicationList()
	
	}		


	
    function Initialize() {
        getMenuInfoOnLoad(function (data) {
            if (!angular.equals({}, getSetService.get())) {
                $scope.result = getSetService.get()
                $scope.emptyObject = {};
                if ($scope.result.check == "Leave") {
                    getSetService.set($scope.emptyObject)
                    $scope.getLeaveList();
                    return;
                }
                else if ($scope.result.check == "OD") {
                    $scope.getODApplicationList();
                    getSetService.set($scope.emptyObject)
                    return;
                }
                else if ($scope.result.check == "Regularization") {
                    $scope.getAttendanceApplicationList();
                    getSetService.set($scope.emptyObject)
                    return;
                }
                else if ($scope.result.check == "ShiftChange") {
                    $scope.getShiftChangeApplicationList();
                    getSetService.set($scope.emptyObject)
                    return;
                }
                else {
                    getSetService.set($scope.emptyObject)
                }
				} 
				})
			
			if ($rootScope.redirectApprovalTabName=="" || $rootScope.redirectApprovalTabName=== undefined ){
				if ($scope.IsLeaveAccessible == 'true')
				{
					$scope.getLeaveList();
					return;
				}
				if ($scope.IsODAccessible == 'true')
				{
					$scope.getODApplicationList();
					return;
				}
				if ($scope.IsRegularizationAccessible == 'true')
				{
					$scope.getAttendanceApplicationList();
					return;
				}
				if ($scope.IsShiftChangeAccessible == 'true')
				{
					$scope.getShiftChangeApplicationList();
					return;
				}
			}
			
				if ($rootScope.redirectApprovalTabName == 'LEAVE')
				{
					$scope.getLeaveList();
				}
				if ($rootScope.redirectApprovalTabName == 'OD')
				{
					$scope.getODApplicationList();
				}
				if ($rootScope.redirectApprovalTabName == 'ATT_REG')
				{
					$scope.getAttendanceApplicationList();
				}
				if ($rootScope.redirectApprovalTabName == 'SHIFT_CH')
				{
					$scope.getShiftChangeApplicationList();
				}				
			

			$rootScope.redirectApprovalTabName=""
		
       
    }
	
	/*$scope.clearSearch = function()
	{
		alert("")
			$scope.searchObj.searchLeave="";
	}*/
    Initialize();
});
