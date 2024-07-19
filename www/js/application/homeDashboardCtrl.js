mainModule.factory("viewRequisitionApprovalService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/attendanceReportApi/viewRequisitionApproval.spr'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("getMenuInfoService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/eisCompany/viewEisCompany.spr'), {}, {
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
mainModule.factory("getCalendarAttTypeService", function ($resource) {
    return $resource((baseURL + '/api/SelfService/getPresentationList.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("getReporteeListService", function ($resource) {
    return $resource((baseURL + '/api/attendanceReportApi/getReporteeEmployees.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("getPhotoService", function ($resource) {
    return $resource((baseURL + '/api/eisCompany/checkProfilePhoto.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});

mainModule.controller('homeDashboardCtrl', function ($scope, $q, $stateParams, commonService, viewMissPunchByDateService, $ionicModal, getMenuInfoService, getReporteeListService, $ionicPopover, $state, $rootScope, $filter, loginCommService, $ionicLoading, viewRequisitionApprovalService, getPhotoService, getCalendarAttTypeService, getSetService) {

    $scope.obj = {};
    sessionStorage.setItem('selectedMonth', null);
    sessionStorage.setItem('isManager', 1);
    $scope.date = new Date();
    $scope.attendanceDetail = {};
    $scope.AttendanceRegulObj = {}
    $scope.isLongPress = false
    $rootScope.setPartialDirective = false
    $scope.showngroupMyRequision = null;
    $scope.shownGroup = null;
    $scope.showDashboard = 1;
    $scope.selectedCalDate = "";
    $scope.clickedCalFlag = true;
    $scope.calenderHideandShow = false
    $scope.fDate = new Date()
    var d = new Date()
    $scope.currDate = new Date()
    $scope.resultObj = {}
    $scope.listOfTitle = []
    $scope.day = ''
    $scope.description = ''
    $scope.showDescription = false
    var funcIndex = '0'
    $scope.ReporteeList = []
    $scope.IsLeaveAccessible = sessionStorage.getItem('IsLeaveAccessible');
    $scope.IsODAccessible = sessionStorage.getItem('IsODAccessible');
    $scope.IsRegularizationAccessible = sessionStorage.getItem('IsRegularizationAccessible');
    $scope.IsShiftChangeAccessible = sessionStorage.getItem('IsShiftChangeAccessible');
    sessionStorage.setItem('checkempId', sessionStorage.getItem('empId'))
    $scope.onloadRequestObj = {}
    $scope.onloadResponseObj = {}
    $scope.tab1click = "tab-header-active"
    $scope.tab2click = "tab-header-inactive"
    $ionicLoading.show({});
    if ($rootScope.HomeDashBoard)
    {
        $scope.showDashboard = 0;
    }
    $scope.donatChartNoData = false
    $scope.attendanceDetail.name = sessionStorage.getItem('empName');
    $scope.attendanceDetail.designation = sessionStorage.getItem('designation');
    $scope.attendanceDetail.department = sessionStorage.getItem('department');
    if (sessionStorage.getItem('department')) {
        $scope.obj.department = sessionStorage.getItem('department');
    }
    $scope.attendanceDetail.image1 = sessionStorage.getItem('profilePhoto');
    $scope.attendanceDetail.photoFileName = sessionStorage.getItem('photoFileName')
    // values for donut chart start
    $scope.attendanceDetail.RegularizationAppl = sessionStorage.getItem('RegularizationAppl');
    $scope.attendanceDetail.abscent = sessionStorage.getItem('Absent');
    $scope.attendanceDetail.leaveapplied = sessionStorage.getItem('leaveapplied')
    $scope.attendanceDetail.WeeklyOff = sessionStorage.getItem('WeeklyOff');
    $scope.attendanceDetail.Holiday = sessionStorage.getItem('Holiday');
    $scope.attendanceDetail.AbsentFullDay = sessionStorage.getItem('AbsentFullDay');
    $scope.attendanceDetail.OD = sessionStorage.getItem('OD');
    $scope.attendanceDetail.leave = sessionStorage.getItem('Leave')
    $scope.attendanceDetail.Eg = sessionStorage.getItem('Eg');
    $scope.attendanceDetail.Regular = sessionStorage.getItem('Regular');
    $scope.attendanceDetail.Absent2ndHalf = sessionStorage.getItem('Absent2ndHalf');
    $scope.attendanceDetail.Absent1stHalf = sessionStorage.getItem('Absent1stHalf');
    $scope.attendanceDetail.ndHalfSHL = sessionStorage.getItem('2ndHalfSHL');
    $scope.attendanceDetail.stHalfAbsent2ndHalfSHL = sessionStorage.getItem('stHalfAbsent2ndHalfSHL');
    $scope.attendanceDetail.stHalfSHL2ndHalfAbsent = sessionStorage.getItem('stHalfSHL2ndHalfAbsent');
    $scope.attendanceDetail.ODApplied = sessionStorage.getItem('ODApplied');
    var date = new Date();
    $scope.resultObj.fromDate = $filter('date')(date, 'dd/MM/yyyy');
    $scope.resultObj.toDate = $filter('date')(date, 'dd/MM/yyyy');

    // values for donut chart end
    $scope.CheckDrawChart = function ()
    {
        if ($scope.attendanceDetail.leave == 'null' && $scope.attendanceDetail.WeeklyOff == 'null' && $scope.attendanceDetail.Holiday == 'null' && $scope.attendanceDetail.AbsentFullDay == 'null' && $scope.attendanceDetail.OD == 'null')
        {
            drawChart(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)
            $scope.donatChartNoData = true
        } else
        {
            $scope.NaN = null;
            if ($scope.fDate.getTime() > new Date().getTime()) {
                $scope.NaN = parseInt($scope.attendanceDetail.AbsentFullDay);
                $scope.absentcount = null;
                $scope.presentCount = null;
            }
            else {
                $scope.presentCount = parseInt($scope.attendanceDetail.Regular) + parseInt($scope.attendanceDetail.Eg) * 0.5 + parseInt($scope.attendanceDetail.Absent2ndHalf)
                $scope.absentcount = parseInt($scope.attendanceDetail.AbsentFullDay) + parseInt($scope.attendanceDetail.Absent1stHalf) + parseInt($scope.attendanceDetail.Eg) * 0.5
            }
            $scope.totalCountOfReporty = $scope.absentcount + $scope.presentCount + parseInt($scope.attendanceDetail.leave) + parseInt($scope.attendanceDetail.OD) + parseInt($scope.attendanceDetail.WeeklyOff) + parseInt($scope.attendanceDetail.Holiday) + $scope.NaN
            drawChart($scope.presentCount, $scope.attendanceDetail.leave, $scope.attendanceDetail.WeeklyOff, $scope.attendanceDetail.Holiday, $scope.absentcount, $scope.attendanceDetail.OD)
        }
    }
    $scope.CheckDrawChart()
    $scope.resultObject = {}
    $scope.resultObject.empId = sessionStorage.getItem('empId')
    $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
    };
    $scope.toggleGroupMyRequision = function (groupMyRequision) {
        if ($scope.isMyRequision(groupMyRequision)) {
            $scope.showngroupMyRequision = null;
        } else {
            $scope.showngroupMyRequision = groupMyRequision;
        }
    };
    $scope.isMyRequision = function (groupMyRequision) {
        return $scope.showngroupMyRequision === groupMyRequision;
    }
    $scope.tabsOfDashboard = function () {
        $scope.tab1click = "tab-header-active"
        $scope.tab2click = "tab-header-inactive"
        $("#dashboard").addClass("active");
        $("#selfservice").removeClass("active");
        $scope.showDashboard = 1;
    };
    $scope.tabsOfSelfService = function () {
        $scope.tab1click = "tab-header-inactive"
        $scope.tab2click = "tab-header-active"
        $("#selfservice").addClass("active");
        $("#dashboard").removeClass("active");
        $scope.showDashboard = 0;
    };
    $scope.openRequisitions = function () {
        $state.go('leaveApplication')
    }

    $scope.openCheckIn = function () {
        $state.go('app.checkIn');
    }

    $scope.onLoadReporteeCheck = function () {
        $ionicLoading.show({});
        var ViewRequisitionApprovalService = new viewRequisitionApprovalService();
        ViewRequisitionApprovalService.$save(function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"ViewRequisitionApprovalService")
			}	
			
            $scope.approvalOdApplication = data.approvalOdApplication.inProcess;
            $scope.approvalAttendanceApplication = data.approvalAttendanceApplication.inProcess;

            $scope.approvalLeave = data.approvalLeave.inProcess;
            $scope.attendanceInprocessCount = data.attendanceRegularization.inProcess

            $scope.leaveInprocessCount = data.leaveApllication.totalInProcess
            $scope.odprocessInprocess = data.odApplication.inProcess

            $scope.shiftChangeInProcess = data.listShiftObj.inProcess
            $scope.shiftChangeInProcessApproval = data.approvalShiftObj.inProcess

            $scope.totalInProcess = parseInt($scope.approvalOdApplication) + parseInt($scope.shiftChangeInProcess) + parseInt($scope.approvalAttendanceApplication) + parseInt($scope.approvalLeave);
            $scope.totalApproval = parseInt($scope.attendanceInprocessCount) + parseInt($scope.shiftChangeInProcessApproval) + parseInt($scope.leaveInprocessCount) + parseInt($scope.odprocessInprocess);
            funcIndex = '1'
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data, "app.homeDashboard");
        });
    }

    function drawChart(Present, Leave, WeeklyOff, Holiday, AbsentFullDay, OD) {
        var data = google.visualization.arrayToDataTable([
            ['Attendance', 'per Day'],
            ['NA', $scope.NaN],
            ['Present', parseFloat(Present)],
            ['Leave', parseInt(Leave)],
            ['Absent', parseFloat(AbsentFullDay)],
            ['OD', parseInt(OD)],
            ['WeeklyOff', parseInt(WeeklyOff)],
            ['Holiday', parseInt(Holiday)],
        ]);
        var options = {
            colors: ['white', '#D7F187', '#6666FF', '#f37076', '#cc0066'],
            chartArea: {
                left: 10,
                top: 10,
                width: '130%',
                height: '65%'
            },
            legend: {
                position: 'bottom',
                alignment: 'center'
            },
            backgroundColor: '#f2f3f4',
            pieHole: 0.5,
            pieSliceTextStyle: {
                color: 'black', fontSize: 14
            },
            pieSliceText: 'value'
        };
        function fetchReporteeOnload() {
            $state.go('myTeamDetail')
        }
        if (document.getElementById('donutchart')) {
            var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
            google.visualization.events.addListener(chart, 'select', fetchReporteeOnload);
            chart.draw(data, options);
        }
        $(window).resize(function () {
            if (document.getElementById('donutchart') && $scope.showDashboard == 1) {
                var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
                google.visualization.events.addListener(chart, 'select', fetchReporteeOnload);
                chart.draw(data, options);
            }
        });
    }
    // -- calendar part --//
    $scope.name = sessionStorage.getItem('empName');
    $scope.designation = sessionStorage.getItem('designation');
    $scope.department = sessionStorage.getItem('department');

    $scope.attendenceManagement = ["Present", "Absent", "Leave", "Holiday", "Half Day", "Weekly Off"];
    $scope.attendanceTypeColour = {}
    $scope.attendanceTypeCount = {}
    $scope.timeFormat = "days";
    $scope.attendenceType = ["Working", "Present", "Holiday", "WeeklyOff", "Leaves", "Absent"];

    $scope.getLeaveColours = function (val) {

        $scope.selectedCalDate = new Date(val.year, val.month, val.displayDate);
        $scope.AttendanceRegulObj.selectedCalDate = $scope.selectedCalDate
        var tempFilteredSelectedCalDate = $scope.selectedCalDate
        $scope.AttendanceRegulObj.year = val.year
        $scope.AttendanceRegulObj.month = 1 + parseInt(val.month)
        $scope.AttendanceRegulObj.firstHalf = $scope.description
//        Locking period validation start
        $scope.filteredSelectedCalDate = $filter('date')(new Date(tempFilteredSelectedCalDate), 'yyyy/MM/dd');
        $scope.lockingPeriod = sessionStorage.getItem('lockingPeriod');
        $scope.todaysDate = new Date();
        $scope.lockingPeriodDate = $scope.todaysDate.setMonth($scope.todaysDate.getMonth() - $scope.lockingPeriod);
        $scope.filteredLockingDate = $filter('date')(new Date($scope.lockingPeriodDate), 'yyyy/MM/dd');
//        Locking period validation End
        $scope.clickedCalFlag = false;
        if (val.check == '0')
        {
            $ionicLoading.show({
            });
            $scope.getCalendarAttTypeService = new getCalendarAttTypeService();
            $scope.getCalendarAttTypeService.$save(val, function (success) {
			if (!(success.clientResponseMsg=="OK")){
				console.log(success.clientResponseMsg)
				handleClientResponse(success.clientResponseMsg,"getCalendarAttTypeService")
			}					
			
                $scope.attendanceTypeCount = success.countMap;
                $scope.attendanceTypeColour = success.colourMap;
                $scope.listOfTitle = []
				if (success.titleCount === undefined){
					// do nothing
				}else{
					$scope.listOfTitle = success.titleCount
				}
                $scope.showDescription = true
                if (val.displayDate)
                {
                    $scope.showDescription = true
                    $scope.day = val.displayDate
                    if ($scope.listOfTitle[parseInt(val.displayDate)] == '')
                    {
                        $scope.description = 'No Data Available'
                    } else
                    {
                        $scope.description = $scope.listOfTitle[parseInt(val.displayDate)]
                    }
                } else
                {
                    $scope.day = d.getDay()
                    $scope.day = parseInt($scope.day) - 1

                    if (!$scope.description)
                    {
                        $scope.description = 'No Data Available'
                    } else
                    {
                        $scope.description = $scope.listOfTitle[parseInt($scope.day) - 1]
                    }
                }
                $scope.displayLeaveColours($scope.attendanceTypeColour);
                if (funcIndex == '0')
                    $scope.onLoadReporteeCheck()
                else
                    $ionicLoading.hide();
            }, function (data) {
                autoRetryCounter = 0
                $ionicLoading.hide()
                commonService.getErrorMessage(data, "app.homeDashboard");
            });
        }
        if (val.check == '1')
        {
            $scope.showDescription = true
            $scope.day = val.displayDate
            $scope.description = $scope.listOfTitle[val.displayDate]
            if (!$scope.description)
            {
                $scope.description = 'No Data Available'
            }
        }
        if ($scope.isLongPress == true) {
            $scope.openPopover($event);
            $ionicLoading.hide();
        }
    };
    $scope.setDirectiveFn = function (displayLeaveColours) {
        $ionicLoading.show({});
        $scope.displayLeaveColours = displayLeaveColours;
    };
    $scope.setFromDate = function () {
        var date;
        if ($scope.fDate == null) {
            date = new Date();
        }
        else {
            date = $scope.fDate;
        }
        var options = {date: date, mode: 'date', titleText: 'Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {
                //nothing to do.
            }
            else {
                $scope.fDate = date
                $scope.resultObj.fromDate = $filter('date')(date, 'dd/MM/yyyy');
                $scope.resultObj.toDate = $filter('date')(date, 'dd/MM/yyyy');
                $scope.$apply();
                $ionicLoading.show({});
                $scope.getDonutData();
            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
    }

//    $scope.init = function () {
//        $scope.requestObj = {}
//        $scope.requestObj.fromDate = new Date();
//        $scope.requestObj.toDate = new Date()
//        loginCommService.getDoNutChartCount($scope.requestObj, function () {
//            $ionicLoading.hide();
//        }, function () {
//            $ionicLoading.hide();
//        });
//    }
//    $scope.init();

    $scope.getDonutData = function () {
        if (!$scope.$$phase)
            $scope.$apply();
        loginCommService.getDoNutChartCount($scope.resultObj, function ()
        {
            $scope.attendanceDetail.Absent2ndHalf = sessionStorage.getItem('Absent2ndHalf');
            $scope.attendanceDetail.Absent1stHalf = sessionStorage.getItem('Absent1stHalf');
            $scope.attendanceDetail.Eg = sessionStorage.getItem('Eg');
            $scope.attendanceDetail.Regular = sessionStorage.getItem('Regular');
            $scope.attendanceDetail.WeeklyOff = sessionStorage.getItem('WeeklyOff');
            $scope.attendanceDetail.Holiday = sessionStorage.getItem('Holiday');
            $scope.attendanceDetail.AbsentFullDay = sessionStorage.getItem('AbsentFullDay');
            $scope.attendanceDetail.OD = sessionStorage.getItem('OD');
            $scope.attendanceDetail.leave = sessionStorage.getItem('Leave')
            $scope.CheckDrawChart()
            $ionicLoading.hide();
        }, function (status)
        {
            showAlert("Fail", "Try again");
            $ionicLoading.hide();
        })
    }
    $scope.getDonutData()

    $scope.attendanceRegular = function ()
    {
        var object = {};
        object.selectedCalDate = $scope.selectedCalDate;
        getSetService.set(object);
        $state.go('attendanceRegularisation');
    }
    $scope.listView = function ()
    {
        if ($scope.calenderHideandShow == true)
        {
            $rootScope.setPartialDirective = false
            $scope.calenderHideandShow = false
        }
        else
        {
            $scope.calenderHideandShow = true
            $rootScope.setPartialDirective = true
        }
    }
    $scope.checkValidate = function (obj)
    {
        $scope.onloadRequestObj.buttonRights = "Y-Y-Y-Y"

        var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");
        $scope.onloadRequestObj.menuId = attendanceMenuInfo.menuId;

        $scope.onloadRequestObj.fromEmail = "N"
        $scope.onloadRequestObj.listYear = obj.year
        $scope.onloadRequestObj.monthId = obj.month
        $scope.onloadRequestObj.attendanceDate = $filter('date')(obj.selectedCalDate, 'MM/dd/yyyy');
        $scope.viewMissPunchByDateService = new viewMissPunchByDateService()
        $scope.viewMissPunchByDateService.$save($scope.onloadRequestObj, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewMissPunchByDateService")
			}
            $scope.applyingLeaves = data.missedPunchForm.remarksList
            if (!data)
            {
                $scope.onload()
                return;
            }
            if (data.missedPunchForm.missedPunchVOList) {
                if (!data.missedPunchForm.missedPunchVOList[0].status)
                {
                    $scope.onloadResponseObj.status = ''
                }
                else
                {
                    $scope.onloadResponseObj.status = data.missedPunchForm.missedPunchVOList[0].status
                }
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
                $scope.onloadResponseObj.actualOutTimeStr = data.missedPunchForm.missedPunchVOList.actualOutTimeStr
                if ($scope.onloadResponseObj.status == "SENT FOR APPROVAL") {
                    showAlert(" ", "Already sent for approval for " + $scope.onloadResponseObj.attDate)
                    $ionicLoading.hide()
                    return
                } else if ($scope.onloadResponseObj.status == "APPROVED") {
                    showAlert(" ", "Already  approved for " + $scope.onloadResponseObj.attDate)
                    $ionicLoading.hide()
                    return
                } else if ($scope.onloadResponseObj.status == "REJECTED") {
                    showAlert(" ", "Already  rejected for " + $scope.onloadResponseObj.attDate)
                    $ionicLoading.hide()
                    return
                } else if ($scope.onloadResponseObj.firstHalf == "On Leave" || $scope.firstHalf == "On Leave") {
                    showAlert(" ", "Leave applied for date" + $scope.onloadResponseObj.attDate)
                    $ionicLoading.hide()
                    return
                } else if ($scope.onloadResponseObj.firstHalf == "On Duty" || $scope.firstHalf == "On Duty") {
                    showAlert(" ", "OD applied for" + $scope.onloadResponseObj.attDate)
                    $ionicLoading.hide()
                    return
                }
                else if (!$scope.onloadResponseObj.status)
                {
                    getSetService.set($scope.AttendanceRegulObj);
                    $state.go('attendanceRegularisation')
                }
                else if ($scope.onloadResponseObj.status == '-')
                {
                    getSetService.set($scope.AttendanceRegulObj);
                    $state.go('attendanceRegularisation')
                }
            }
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data, "app.homeDashboard");
        });
    }

//    $scope.getPhotos = function (index) {
//        $scope.resultObject = {}
//        $scope.resultObject.empId = $scope.ReporteeList[index].empId
//        $scope.resultObject.companyId = $scope.ReporteeList[index].companyId;
//        $scope.getPhotoService = new getPhotoService();
//        $scope.getPhotoService.$save($scope.resultObject, function (success) {
//			if (!(success.clientResponseMsg=="OK")){
//				console.log(success.clientResponseMsg)
//				handleClientResponse(success.clientResponseMsg,"getPhotoService")
//			}	
//            if (success.profilePhoto != null && success.profilePhoto != "")
//            {
//                $scope.ReporteeList[index].imageFlag = "0"
//                $scope.ReporteeList[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=';
//
//            }
//            else
//            {
//                $scope.ReporteeList[index].imageFlag = "1"
//                $scope.ReporteeList[index].profilePhoto = ""
//
//            }
//        }, function (error, data) {
//        });
//    }
    $scope.redirectToLeave = {};
    $scope.myReqLeave = function () {
        $scope.redirectToLeave.check = "Leave";
        getSetService.set($scope.redirectToLeave)
        $state.go('app.RequestList')
    }
    $scope.redirectToOD = {};
    $scope.myReqOD = function () {
        $scope.redirectToOD.check = "OD";
        getSetService.set($scope.redirectToOD)
        $state.go('app.RequestList')
    }
    $scope.redirectToShift = {};
    $scope.redirectToShiftReq = function () {
        $scope.redirectToShift.check = "ShiftChange";
        getSetService.set($scope.redirectToShift)
        $state.go('app.RequestList')
    }
    $scope.redirectToRegularization = {};
    $scope.myReqRegularization = function () {
        $scope.redirectToRegularization.check = "Regularization";
        getSetService.set($scope.redirectToRegularization)
        $state.go('app.RequestList')
    }

    $scope.redirectTomyApprovalRegularization = {};
    $scope.myApprovalRegularization = function () {
        $scope.redirectTomyApprovalRegularization.check = "Regularization";
        getSetService.set($scope.redirectTomyApprovalRegularization)
        $state.go('app.MyApprovals')
    }
    $scope.redirectTomyApprovalLeave = {};
    $scope.myApprovalLeave = function () {
        $scope.redirectTomyApprovalLeave.check = "Leave";
        getSetService.set($scope.redirectTomyApprovalLeave)
        $state.go('app.MyApprovals')
    }
    $scope.redirectTomyApprovalOD = {};
    $scope.myApprovalOD = function () {
        $scope.redirectTomyApprovalOD.check = "OD";
        getSetService.set($scope.redirectTomyApprovalOD)
        $state.go('app.MyApprovals')
    }

    $scope.redirectTomyApprovalShift = {};
    $scope.redirectmyApprovalShift = function () {
        $scope.redirectTomyApprovalShift.check = "ShiftChange";
        getSetService.set($scope.redirectTomyApprovalShift)
        $state.go('app.MyApprovals')
    }


    $scope.getReporteeOnload = function () {
        $state.go('app.teamCalendar')
    };
    $scope.openAttendanceRegularization = function (type) {
        $scope.onloadRequestObj = {}
        $ionicLoading.show({
        });
        if ($scope.filteredSelectedCalDate <= $scope.filteredLockingDate) {
            showAlert("", "Either shift not available or locking period passed away for selected criteria")
            $ionicLoading.hide()
            return
        }
        if (!type)
        {
            $scope.checkValidate($scope.AttendanceRegulObj)
        }
        else if (type = 'directivecall')
        {
            if (!angular.equals({}, getSetService.get())) {
                $scope.result = getSetService.get()
                if ($scope.result.check == 'cal') {
                    $scope.checkValidate($scope.result)
                }
                $scope.emptyObject = {}
                getSetService.set($scope.emptyObject)
            }
        }
    }

    if (!angular.equals({}, getSetService.get())) {
        $scope.result = getSetService.get()
        if ($scope.result.check == '0') {
            $scope.showDashboard = 0
            $scope.tabsOfSelfService();
        }
        $scope.emptyObject = {}
        getSetService.set($scope.emptyObject)
    }

//// -------------ionic modal start--------------
//    $ionicModal.fromTemplateUrl('my-reporteelist.html', {
//        scope: $scope,
//        animation: 'slide-in-up'
//    }).then(function (modal) {
//        $scope.modal = modal;
//    });
//    $scope.openModal = function () {
//        $scope.modal.show();
//    };
//    $scope.closeModal = function () {
//        $scope.modal.hide();
//    };
//    // Cleanup the modal when we're done with it!
//    $scope.$on('$destroy', function () {
//        $scope.modal.remove();
//    });
//    // Execute action on hide modal
//    $scope.$on('modal.hidden', function () {
//        // Execute action
//    });
//    // Execute action on remove modal
//    $scope.$on('modal.removed', function () {
//        // Execute action
//    });
////    -------------ionic modal end------------------
//    $scope.openMyTeamModal = function ()
//    {
//        $scope.openModal()
//    }
//    $scope.viewEmployeeInfo = function (repobj)
//    {
//        $scope.empName = repobj.empName;
//
//        $scope.closeModal()
//        sessionStorage.setItem('individualempId', repobj.empId)
//        sessionStorage.setItem('calendarEmpName', repobj.empName);
//        sessionStorage.setItem('isManager', 0);
//        $state.go('individualCal')
//    }
});
