/*
 1.This controller is used to show only individual's calender with color codes as per leave,holiday etc.
 */

mainModule.factory("viewRequisitionApprovalService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/attendanceReportApi/viewRequisitionApproval.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("getCalendarAttendanceTypeService", function ($resource) {
    return $resource((baseURL + '/api/SelfService/getPresentationList.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});

mainModule.controller('individualCalenderViewCtrl', function ($scope, $rootScope, commonService, $state, $ionicLoading, getCalendarAttendanceTypeService, getSetService,$ionicNavBarDelegate) {
	$rootScope.navHistoryPrevPage=$rootScope.navHistoryCurrPage
	$rootScope.navHistoryCurrPage="individual_cal"			
	
    $scope.AttendanceRegulObj = {}
    $scope.clickedCalFlag = true;
    $scope.fDate = new Date()
    $scope.tDate = new Date()
    var d = new Date()
    $scope.currDate = new Date()
    $scope.resultObj = {}
    $scope.listOfTitle = []
    $scope.calendarDataObj = {};
    $scope.day = ''
    $scope.description = ''
    $scope.attendenceManagement = ["Present", "Absent", "Leave", "Holiday", "OD", "Weekly Off"];
    $scope.attendenceType = ["Working", "Present", "Holiday", "WeeklyOff", "Leaves", "Absent"];
    $scope.timeFormat = "days";
    var funcIndex = '0'
    $scope.ReporteeList = []

    $scope.empName = sessionStorage.getItem('calendarEmpName');
    $scope.calendarEmpCode = sessionStorage.getItem('calendarEmpCode');

    $ionicLoading.show({
    });

    $scope.resultObject = {}
    $scope.resultObj = {}
    $scope.resultObject.empId = sessionStorage.getItem('empId')
    $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.attendanceTypeColour = {}
    $scope.attendanceTypeCount = {}
    $scope.timeFormat = "days";
    $scope.getLeaveColours = function (val) {
        $scope.selectedCalDate = new Date(val.year, val.month, val.displayDate);
        $scope.AttendanceRegulObj.selectedCalDate = $scope.selectedCalDate
        $scope.AttendanceRegulObj.year = val.year
        $scope.AttendanceRegulObj.month = 1 + parseInt(val.month)
        $scope.AttendanceRegulObj.firstHalf = $scope.description
        $scope.clickedCalFlag = false;
        if (val.check == '0')
        {
            $ionicLoading.show({
            });
            $scope.getCalendarAttendanceTypeService = new getCalendarAttendanceTypeService();
            $scope.getCalendarAttendanceTypeService.$save(val, function (success) {
				
				if (!(success.clientResponseMsg=="OK")){
				console.log(success.clientResponseMsg)
				handleClientResponse(success.clientResponseMsg,"getCalendarAttendanceTypeService")
				}			
				
                $scope.attendanceTypeCount = success.countMap;
                $scope.attendanceTypeColour = success.colourMap;
                $scope.attendanceTypeDWColour = success.attendancTypeMap;

                $scope.calendarDataObj.attendanceTypeColour = success.colourMap;
                $scope.calendarDataObj.attendanceTypeDWColour = success.attendancTypeMap;

                $scope.listOfTitle = []
				if (success.descMap === undefined){
					//do nothing
				}else{
					$scope.listOfTitle = success.descMap
				}
                if (val.displayDate)
                {
                    $scope.day = val.displayDate

                    if ($scope.listOfTitle && !$scope.listOfTitle[parseInt(val.displayDate)])
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

                $scope.displayLeaveColours($scope.calendarDataObj);
                $ionicLoading.hide();

            }, function (data) {
                autoRetryCounter = 0
                $ionicLoading.hide()
                commonService.getErrorMessage(data);
            });
        }
        if (val.check == '1')
        {
            $scope.day = val.displayDate
            $scope.description = $scope.listOfTitle[val.displayDate]
            if (!$scope.description)
            {
                $scope.description = 'No Data Available'
            }
        }

    };
    $scope.setDirectiveFn = function (displayLeaveColours) {
        $scope.displayLeaveColours = displayLeaveColours;
    };

    if (!angular.equals({}, getSetService.get())) {
        $scope.result = getSetService.get()

        $scope.emptyObject = {}
        getSetService.set($scope.emptyObject)
    }
    $scope.redirectOnBack = function () {
        //sessionStorage.setItem('individualempId', "")
        $state.go('app.myTeamDetail')
		//$ionicNavBarDelegate.back();
    };

});
