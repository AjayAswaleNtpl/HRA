/*
 1.This controller is used to show the calendar view of all Reportee.
 2.Count for absent are shown.
 */

mainModule.filter('rangecal', function () {
    return function (input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++) {
            input.push(i);
        }
        return input;
    };
})

mainModule.directive('teamCalendar', function ($rootScope) {
    return {
        restrict: 'E',
        transclude: true,
        require: 'display',
        scope: {display: "=", dateformat: "=", getColours: "=", setFn: "&", getCount: "=", setCn: "&"},
        controller: ['$scope', '$filter', function ($scope, $filter) {
                if ($rootScope.theme == "navyTheme.css")
                {
                    $scope.selDatetheme = "#3B5998";
                }
                else if ($rootScope.theme == "greenTheme.css")
                {
                    $scope.selDatetheme = "green";
                }
                else if ($rootScope.theme == "redTheme.css")
                {
                    $scope.selDatetheme = "red";
                }
                else if ($rootScope.theme == "tealTheme.css")
                {
                    $scope.selDatetheme = "teal";
                }
                else if ($rootScope.theme == "orangeTheme.css")
                {
                    $scope.selDatetheme = "yellow";
                }
                $scope.temp = {};
                var calMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                var calDaysForMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                var selectedYear, selectedMonth, selectedDate, shortMonth;
                var CurrentDate = new Date();
                $scope.calMonths = [[{'id': 0, 'name': 'Jan'}, {'id': 1, 'name': 'Feb'}, {'id': 2, 'name': 'Mar'}, {'id': 3, 'name': 'Apr'}], [{'id': 4, 'name': 'May'}, {'id': 5, 'name': 'Jun'}, {'id': 6, 'name': 'Jul'}, {'id': 7, 'name': 'Aug'}], [{'id': 8, 'name': 'Sep'}, {'id': 9, 'name': 'Oct'}, {'id': 10, 'name': 'Nov'}, {'id': 11, 'name': 'Dec'}]];
                selectedYear = CurrentDate.getFullYear(), selectedMonth = CurrentDate.getMonth(), selectedDate = CurrentDate.getDate();
                $scope.UICalendarDisplay = {};
                $rootScope.setPartialDirective = false
                $scope.UICalendarDisplay.Date = true;
                $scope.UICalendarDisplay.Month = false;
                $scope.UICalendarDisplay.Year = false;
                $scope.displayCompleteDate = function () {
                    var timeStamp = new Date(selectedYear, selectedMonth, selectedDate).getTime();
                    if (angular.isUndefined($scope.dateformat)) {
                        var format = "dd - MMM - yy";
                    } else {
                        var format = $scope.dateformat;
                    }
                }

                //Onload Display Current Date
                $scope.displayCompleteDate();

                $scope.UIdisplayDatetoMonth = function () {
                    $scope.UICalendarDisplay.Date = false;
                    $scope.UICalendarDisplay.Month = true;
                    $scope.UICalendarDisplay.Year = false;
                    $scope.temp.dateView = $scope.UICalendarDisplay.Date;
                    $scope.getCount($scope.temp);
                }

                $scope.UIdisplayMonthtoYear = function () {
                    $scope.UICalendarDisplay.Date = false;
                    $scope.UICalendarDisplay.Month = false;
                    $scope.UICalendarDisplay.Year = true;
                }

                $scope.UIdisplayYeartoMonth = function () {
                    $scope.UICalendarDisplay.Date = false;
                    $scope.UICalendarDisplay.Month = true;
                    $scope.UICalendarDisplay.Year = false;
                }

                $scope.UIdisplayMonthtoDate = function () {
                    $scope.UICalendarDisplay.Date = true;
                    $scope.UICalendarDisplay.Month = false;
                    $scope.UICalendarDisplay.Year = false;
                }

                $scope.selectedMonthPrevClick = function () {
                    selectedDate = 1;
                    if (selectedMonth == 0) {
                        selectedMonth = 11;
                        selectedYear--;
                    } else {
                        $scope.dislayMonth = selectedMonth--;
                    }

                    $scope.displayMonthCalendar();
                }

                $scope.selectedMonthNextClick = function () {

                    selectedDate = 1;
                    if (selectedMonth == 11) {
                        selectedMonth = 0;
                        selectedYear++;
                    }
                    else {
                        $scope.dislayMonth = selectedMonth++;
                    }
                    $scope.displayMonthCalendar();
                }

                $scope.selectedMonthYearPrevClick = function () {
                    selectedYear--;
                    $scope.displayYear = selectedYear;
                    $scope.displayMonthCalendar();
                }

                $scope.selectedMonthYearNextClick = function () {
                    selectedYear++;
                    $scope.displayYear = selectedYear;
                    $scope.displayMonthCalendar();
                }

                $scope.selectedDecadePrevClick = function () {
                    selectedYear -= 10;
                    $scope.displayMonthCalendar();
                }

                $scope.selectedDecadeNextClick = function () {
                    selectedYear += 10;
                    $scope.displayMonthCalendar();
                }

                $scope.selectedYearClick = function (year) {
                    $scope.displayYear = year;
                    selectedYear = year;
                    $scope.displayMonthCalendar();
                    $scope.UICalendarDisplay.Date = false;
                    $scope.UICalendarDisplay.Month = true;
                    $scope.UICalendarDisplay.Year = false;
                    $scope.displayCompleteDate();
                }

                $scope.selectedMonthClick = function (month) {
                    $scope.UIdisplayMonthtoDate();
                    $scope.dislayMonth = month;
                    selectedMonth = month;
                    $scope.displayMonthCalendar();
                    $scope.UICalendarDisplay.Date = true;
                    $scope.UICalendarDisplay.Month = false;
                    $scope.UICalendarDisplay.Year = false;
                    $scope.displayCompleteDate();
                }

                $scope.selectedDateClick = function (date) {
                    
//                    selectedDate = date.date;
                    if (date.type == 'newMonth' || date.type == 'oldMonth') {
                        //nothing to do
                    }
                    else
                    {
                        $scope.displayDate = date.date;
                        $scope.temp.displayDate = $scope.displayDate;
                        $scope.temp.check = '1';
                        $scope.temp.dateView = $scope.UICalendarDisplay.Date;
                        $scope.getCount($scope.temp);
                    }
//                    $scope.displayCompleteDate($scope.displayDate);
                }
                $scope.displayMonthCalendar = function () {

                    if (sessionStorage.getItem('individualempId'))
                    {
                        $scope.temp.empId = sessionStorage.getItem('individualempId');
                    } else
                    {
                        $scope.temp.empId = sessionStorage.getItem('empId');
                    }
                    $scope.temp.month = selectedMonth;
                    $scope.temp.year = selectedYear;
                    $scope.temp.displayDate = selectedDate
                    $scope.temp.check = '0';
                    $scope.temp.dateView = $scope.UICalendarDisplay.Date;
                    $scope.getCount($scope.temp);
                    //  $scope.getColours($scope.temp);                   // call back function
                    /*Year Display Start*/                     $scope.startYearDisp = (Math.floor(selectedYear / 10) * 10) - 1;
                    $scope.endYearDisp = (Math.floor(selectedYear / 10) * 10) + 10;
                    /*Year Display End*/
                    $scope.datesDisp = [[], [], [], [], [], []];
                    countDatingStart = 1;
                    if (calMonths[selectedMonth] === 'February') {
                        if (selectedYear % 4 === 0) {
                            endingDateLimit = 29;
                        } else {
                            endingDateLimit = 28;
                        }
                    } else {
                        endingDateLimit = calDaysForMonth[selectedMonth];
                    }
                    startDay = new Date(selectedYear, selectedMonth, 1).getDay();
                    $scope.displayYear = selectedYear;
                    $scope.dislayMonth = calMonths[selectedMonth];
                    $scope.shortMonth = calMonths[selectedMonth].slice(0, 3);
                    $scope.displayDate = selectedDate;
                    var nextMonthStartDates = 1;
                    var prevMonthLastDates = new Date(selectedYear, selectedMonth, 0).getDate();
                    for (i = 0; i < 6; i++) {
                        if (typeof $scope.datesDisp[0][6] === 'undefined') {
                            for (j = 0; j < 7; j++) {
                                if (j < startDay) {
                                    $scope.datesDisp[i][j] = {"type": "oldMonth", "date": ""};
                                } else {
                                    $scope.datesDisp[i][j] = {"type": "currentMonth", "date": countDatingStart++};
                                }
                            }
                        } else {
                            for (k = 0; k < 7; k++) {
                                if (countDatingStart <= endingDateLimit) {
                                    $scope.datesDisp[i][k] = {"type": "currentMonth", "date": countDatingStart++};
                                } else {
                                    $scope.datesDisp[i][k] = {"type": "newMonth", "date": ""};
                                }
                            }
                        }
                    }
                }

                $scope.setCountToDates = function (countDateMap) {

                    if (countDateMap == undefined) {
                        return;
                    }

                    if (Object.keys(countDateMap).length != 0) {
                        for (var i = 0; i < $scope.datesDisp.length; i++) {

                            for (var j = 0; j < $scope.datesDisp[i].length; j++) {
                                if (countDateMap[$scope.datesDisp[i][j].date.toString()] !== "null") {
                                    if ($scope.datesDisp[i][j].type == "currentMonth") {
                                        if (countDateMap[$scope.datesDisp[i][j].date.toString()])
                                        {
                                            $scope.datesDisp[i][j].topCount = countDateMap[$scope.datesDisp[i][j].date.toString()];
                                        }
                                        else {
                                            $scope.datesDisp[i][j].topCount = 0
                                        }
                                        if ($scope.datesDisp[i][j].topCount > 0) {
                                            $scope.datesDisp[i][j].backColor = "#ff6666";
                                            $scope.datesDisp[i][j].fontColor = "white";
                                            $scope.datesDisp[i][j].totCounts = "darkturquoise";
                                        }
                                        else {
                                            $scope.datesDisp[i][j].fontColor = "grey";
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                $scope.setCn({theDirFn: $scope.setCountToDates});
                $scope.displayMonthCalendar();

            }
        ],
        template: '<style>'
                + '.ionic_Calendar .calendar_Date .row.Daysheading {text-align:center;}'
                + '.ionic_Calendar .txtCenter {text-align:center;}'
                + '.ionic_Calendar .col.selMonth { background-color: #04BDD7; color:white; }'
                + '.ionic_Calendar .col.selYear { background-color: #04BDD7; color:white;  }'
                + '.ionic_Calendar .col.fadeDateDisp, .col.fadeYear { background-color: transparent; color:#D5D5D5 }'
                + '.ionic_Calendar .DaysDisplay .col{ border: 1px solid #F3F3F3; padding-top: 10px; font-weight: bolder; height: 40px;}'
                + '.ionic_Calendar .col.selDate {border: 3px solid {{selDatetheme}};}'
                + '.ionic_Calendar .DaysDisplay.row{ padding-left: 0px; padding-right: 0px; }'
                + '.ionic_Calendar .MonthsDisplay.row{ padding-left: 0px; padding-right: 0px; }'
                + '.ionic_Calendar .MonthsDisplay .col{ border: 1px solid #F3F3F3; padding-top: 30px; font-size: 15px;  height: 80px;}'
                + '.ionic_Calendar .YearsDisplay.row{ padding-left: 0px; padding-right: 0px; }'
                + '.ionic_Calendar .YearsDisplay .col{ border: 1px solid #F3F3F3; padding-top: 30px; font-size: 15px; height: 80px;}'
                + '.ionic_Calendar .marginTop0 { margin-top: 0px !important;}'
                + '.ionic_Calendar .paddingBottom0 { padding-bottom: 0px !important;}'
                + '.ionic_Calendar .Daysheading_Label .col { padding-bottom: 0px !important;}'

                + '.cal-item { border-color: #ddd; background-color: #fff; color: #444;position: relative;z-index: 2;display: block;margin: -1px;padding: 16px;border-width: 1px;border-style: solid;font-size: 16px;}'
                + '</style>'
                + '<div class="ionic_Calendar" style="padding: 0% 6% 0% 6%">'
                + '	<div class="calendar_Date" ng-show="UICalendarDisplay.Date">'
                + '		<div class="row" style="color: grey; margin:2% 0% 2% 0%;">'
                + '		  <div class="col txtCenter" ng-click="selectedMonthPrevClick()"><i class="icon ion-chevron-left"></i></div>'
                + '		  <div class="col col-75 txtCenter" ><span ng-click="UIdisplayDatetoMonth()">{{dislayMonth}} {{displayYear}} </span></div>'
                + '		  <div class="col txtCenter" ng-click="selectedMonthNextClick()"><i class="icon ion-chevron-right"></i></div>'
                + '	 </div>'
                + '		<div class="row Daysheading Daysheading_Label" style="color: black; margin:2% 0% 2% 0%;">'
                + '		  <div class="col">S</div><div class="col">M</div><div class="col">T</div><div class="col">W</div><div class="col">T</div><div class="col">F</div><div class="col">S</div>'
                + '		</div>'
                + '		<div class="row Daysheading DaysDisplay" ng-repeat = "rowVal in datesDisp  track by $index" ng-class="{\'marginTop0\':$first}">'
                + '                 <div class="col" ng-repeat = "colVal in rowVal  track by $index" ng-class="{\'fadeDateDisp\':(colVal.type == \'oldMonth\' || colVal.type == \'newMonth\'), \'selDate\':(colVal.date == displayDate && colVal.type == \'currentMonth\')}" ng-style="{\'background-color\':colVal.backColor, \'color\':colVal.fontColor}" ng-click="selectedDateClick(colVal)">'
                + '			<div ng-if="colVal.topCount!=0" style="font-size:18px;margin-top:-10px;float:right;color:#d9d9d9" >{{colVal.topCount}}</div><div style="font-size:14px;vertical-align: text-bottom;text-align:left;color:grey;margin-top:7px" ng-style="{ \'color\':colVal.fontColor}">{{colVal.date}}</div>'
                + '                 </div>'
                + '             </div>'
                + '     </div>'

                + '      <div class="calendar_Month" ng-show="UICalendarDisplay.Month">'
                + '		<div class="row" style=" background-color: #3F3F3F;  color: white;">'
                + '		  <div class="col txtCenter" ng-click="selectedMonthYearPrevClick()"><i class="icon ion-chevron-left"></i></div>'
                + '		  <div class="col col-75 txtCenter"><span ng-click="UIdisplayMonthtoYear()">{{displayYear}}</span></div>'
                + '		  <div class="col txtCenter" ng-click="selectedMonthYearNextClick()"><i class="icon ion-chevron-right"></i></div>'
                + '		</div>'
                + '		<div class="row txtCenter MonthsDisplay" ng-repeat = "rowVal in calMonths  track by $index" ng-class="{\'marginTop0\':$first}">'
                + '		  <div class="col" ng-repeat = "colVal in rowVal  track by $index"  ng-class="(colVal.name == shortMonth) ? \'selMonth\' : \'NonSelMonth\'"  ng-click="selectedMonthClick(colVal.id)" >{{colVal.name}}</div>'
                + '		</div>'
                + '	</div>'
                + '	<div class="calendar_Year" ng-show="UICalendarDisplay.Year">'
                + '		<div class="row" style=" background-color: #3F3F3F;  color: white;">'
                + '		  <div class="col txtCenter" ng-click="selectedDecadePrevClick()"><i class="icon ion-chevron-left"></i></div>'
                + '		  <div class="col col-75 txtCenter">{{startYearDisp+1}}-{{endYearDisp-1}}</div>'
                + '		  <div class="col txtCenter" ng-click="selectedDecadeNextClick()"><i class="icon ion-chevron-right"></i></div>'
                + '		</div>'
                + '		<div class="row txtCenter YearsDisplay" ng-repeat = "nx in []| rangecal:3" ng-class="{\'marginTop0\':$first}">'
                + '		  <div class="col" ng-repeat="n in [] | rangecal:4"  ng-class="{ \'fadeYear\': (((startYearDisp+nx+nx+nx+nx+n) == startYearDisp)||((startYearDisp+nx+nx+nx+nx+n) == endYearDisp)), \'selYear\': ((startYearDisp+nx+nx+nx+nx+n) == displayYear) }" ng-click="selectedYearClick((startYearDisp+nx+nx+nx+nx+n))">{{startYearDisp+nx+nx+nx+nx+n}}</div>'
                + ' 	</div>'
                + '	</div>'
                + '</div>'
    };
})

mainModule.factory("getDaysCountService", function ($resource) {
    return $resource((baseURL + '/api/leaveApplication/getTeamCalDetails.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("getMemberAttendanceDetailsService", function ($resource) {
    return $resource((baseURL + '/api/leaveApplication/getLeaveDetails.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
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
mainModule.controller('teamCalendarCtrl', function ($scope, commonService, getPhotoService, $ionicLoading, getDaysCountService, getMemberAttendanceDetailsService) {

    $scope.getTeamAttCount = function (data) {
        if (data.dateView == false) {
            $scope.showMemberDtls = data.dateView;
            if (!$scope.$$phase) {
                $scope.$apply()
            }
            return;
        }
        $scope.currMonthObj = {};
        $scope.currMonthObj.month = data.month + 1;
        $scope.currMonthObj.year = data.year;
        $ionicLoading.show({
        });
        if (data.check == '0')
        {
            $scope.getDaysCountService = new getDaysCountService();
            $scope.getDaysCountService.$save($scope.currMonthObj, function (data1) {

                if (!data1.count) {
                    $ionicLoading.hide();
                }
				if (data1.count=== undefined){
					$scope.attendanceCount=0;
					$scope.memberList.length=0;
				}else{
					$scope.attendanceCount = data1.count;
				}
				
                $scope.leaveTransIds = data1.daysWithIds;
                $scope.displayLeaveCount($scope.attendanceCount);
                $scope.getMemberAttendanceDetails(data);
            }, function (data) {
                autoRetryCounter = 0
                $ionicLoading.hide()
                commonService.getErrorMessage(data);
            });
        }
        if (data.check == '1')
        {
            $scope.getMemberAttendanceDetails(data);
        }
    }

    $scope.getMemberAttendanceDetails = function (data)
    {
        $scope.showMemberDtls = true;
        $ionicLoading.show({
        });
        if ($scope.leaveTransIds != undefined) {
            $scope.memberList = $scope.leaveTransIds[data.displayDate]
			
			for (var i=0;i<$scope.memberList.length;i++){
				$scope.memberList[i].fdt = $scope.memberList[i].fromDate.substring(0,2);
				$scope.memberList[i].tdt = $scope.memberList[i].toDate.substring(0,2);
			}
			$scope.selectedDate = data.displayDate
            var index = 0
            while (index < $scope.memberList.length) {
                $scope.getReporteePic(index)
                index++
            }
        }
        if (!$scope.$$phase)
            $scope.$apply();
        $ionicLoading.hide();
    }

    $scope.getReporteePic = function (index) {

        $scope.resultObjectForPic = {}
        $scope.resultObjectForPic.empId = $scope.memberList[index].empId
        $scope.getPhotoService = new getPhotoService();
        $scope.getPhotoService.$save($scope.resultObjectForPic, function (success) {
            if (success.profilePhoto != null && success.profilePhoto != "")
            {
                $scope.memberList[index].imageFlag = "0"
                $scope.memberList[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=';
            }

            else
            {
                $scope.memberList[index].imageFlag = "1"
                $scope.memberList[index].profilePhoto = ""
            }
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

    $scope.setDrctiveFn = function (displayLeaveCount) {
        $ionicLoading.show({});
        $scope.displayLeaveCount = displayLeaveCount;
    };
});
