//-----------------------CALENDAR-DIRECTIVE-------------//
//    <!--    <script id="templates/home.html" type="text/ng-template">
//            <ion-view view-title="Calendar">
//            <ion-header-bar class="bar-assertive">
//            <div class="h1 title headerTitle">Calendar</div>
//            </ion-header-bar>
//            <ion-content scroll="true" has-bouncing="false">
//    
//            <div class="list">
//            <label class="item item-input">
//            <input type="text" placeholder="First Name" ng-model="dateValue" disabled>
//            </label>
//            </div> 
//    
//             
//            display : used for ngmodel to fetch the selected date.
//            dateformat : used to put the Format for display 
//            
//            <my-calendar display="dateValue" dateformat="'dd-MMM-yyyy'"></my-calendar>
//            </ion-content>
//            </ion-view>
//        </script>-->
mainModule.filter('rangecal', function () {
    return function (input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++) {
            input.push(i);
        }
        return input;
    };
})
mainModule.directive('myCalendar', function ($rootScope, $ionicLoading, $ionicPopup, $ionicPopover, getSetService) {
    return {
        restrict: 'E',
        transclude: true,
        require: 'display',
        scope: {display: "=", dateformat: "=", getColours: "=", setFn: "&"},
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
                // these are the days of the week for each month, in order
                var calDaysForMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                var selectedYear, selectedMonth, selectedDate, shortMonth;
                var CurrentDate = new Date();
                $scope.calMonths = [[{'id': 0, 'name': 'Jan'}, {'id': 1, 'name': 'Feb'}, {'id': 2, 'name': 'Mar'}, {'id': 3, 'name': 'Apr'}], [{'id': 4, 'name': 'May'}, {'id': 5, 'name': 'Jun'}, {'id': 6, 'name': 'Jul'}, {'id': 7, 'name': 'Aug'}], [{'id': 8, 'name': 'Sep'}, {'id': 9, 'name': 'Oct'}, {'id': 10, 'name': 'Nov'}, {'id': 11, 'name': 'Dec'}]];
                selectedYear = CurrentDate.getFullYear();
                if (sessionStorage.getItem('selectedMonth') != 'null') {
                    selectedMonth = sessionStorage.getItem('selectedMonth');
                }
                else {
                    selectedMonth = CurrentDate.getMonth();
                }
                selectedDate = CurrentDate.getDate();
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
                    $scope.temp.check = '2';
                    $scope.getColours($scope.temp);
                }

                $scope.UIdisplayMonthtoYear = function () {
                    $scope.UICalendarDisplay.Date = false;
                    $scope.UICalendarDisplay.Month = false;
                    $scope.UICalendarDisplay.Year = true;
                    $scope.temp.check = '2';
                    $scope.getColours($scope.temp);
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
                    $scope.dislayMonth = month;
                    selectedMonth = month;
                    $scope.UICalendarDisplay.Date = true;
                    $scope.UICalendarDisplay.Month = false;
                    $scope.UICalendarDisplay.Year = false;
                    $scope.displayMonthCalendar();
                    $scope.displayCompleteDate();
                }

                $scope.selectedDateClick = function (date) {
                    if (date.type == 'newMonth' || date.type == 'oldMonth') {
                        //nothing to do
                    }
                    else {
                        $scope.displayDate = date.date;
                        $scope.temp.displayDate = $scope.displayDate;
                        $scope.temp.check = '1';
                        $scope.getColours($scope.temp);
                    }
//                    selectedDate = date.date;
//                    if (date.type == 'newMonth') {
////                        var mnthDate = new Date(selectedYear, selectedMonth, 32)
////                        selectedMonth = mnthDate.getMonth();
////                        selectedYear = mnthDate.getFullYear();
////                        $scope.displayMonthCalendar();
//                    } else if (date.type == 'oldMonth') {
////                        var mnthDate = new Date(selectedYear, selectedMonth, 0);
////                        selectedMonth = mnthDate.getMonth();
////                        selectedYear = mnthDate.getFullYear();
////                        $scope.displayMonthCalendar();
//                    }
//                    else
//                    {
//                        
//                    }
//                    $scope.displayCompleteDate($scope.displayDate);
                }

                $scope.displayMonthCalendar = function () {

                    sessionStorage.setItem('selectedMonth', selectedMonth)
                    if (sessionStorage.getItem('individualempId'))
                    {
                        $scope.temp.empId = sessionStorage.getItem('individualempId');
                    } else
                    {
                        $scope.temp.empId = sessionStorage.getItem('empId');
                    }
                    if ($scope.temp.empId == -1){
                        showAlert("Please select employee from list.")
                        return
                    }
                    $scope.temp.month = selectedMonth;
                    $scope.temp.year = selectedYear;
                    $scope.temp.displayDate = selectedDate

                    $scope.temp.check = $scope.UICalendarDisplay.Date == true ? '0' : '2';      // 2 is to hide des tab ; 0 is to show the tab
                    $scope.getColours($scope.temp); // call back function
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
                    var dateObj = new Date();
                    dateObj.setHours(0,0,0,0);
                    $scope.todayCalDate = dateObj;
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
// longKeyPress start
                $scope.itemOnLongPress = function ($event) {
                    $scope.messages.unshift('Long press: ' + event);
                    $scope.openPopover($event);
                };
                $ionicPopover.fromTemplateUrl('homePopup.html', {
                    scope: $scope

                }).then(function (popover) {
                    $scope.popover = popover;
                });
                $scope.openPopover = function ($event, dateobj, month, year) {
					if (sessionStorage.getItem('showCalendarContextMenu')=="NO"){
						return;
					}
                    if (dateobj.type == 'currentMonth') {
                        $scope.AttendanceRegulObj = {}
                        $scope.month = month
                        $scope.IsLeaveAccessible = sessionStorage.getItem('IsLeaveAccessible');
                        $scope.IsODAccessible = sessionStorage.getItem('IsODAccessible');
                        $scope.IsRegularizationAccessible = sessionStorage.getItem('IsRegularizationAccessible');
                        $scope.lockingPeriod = sessionStorage.getItem('lockingPeriod');
						$scope.IsShiftChangeAccessible = sessionStorage.getItem('IsShiftChangeAccessible');
                        $scope.month = $scope.month[0] + $scope.month[1] + $scope.month[2]
                        $scope.monthListString = "JanFebMarAprMayJunJulAugSepOctNovDec"
                        $scope.month = $scope.monthListString.indexOf($scope.month.toString()) / 3
                        $scope.showAttenRegular = false
                        $scope.showOD = false
                        $scope.showLeave = false
                        $scope.selCalDate = new Date(year, $scope.month, dateobj.date);
                        $scope.selCalDate = $filter('date')($scope.selCalDate, 'yyyy/MM/dd');
                        $scope.todayDate = $filter('date')(new Date(), 'yyyy/MM/dd');
                        $scope.todaysDate = new Date();
                        $scope.lockingPeriodDate = $scope.todaysDate.setMonth($scope.todaysDate.getMonth() - $scope.lockingPeriod);
                        $scope.filteredLockingDate = new Date($scope.lockingPeriodDate)
                        $scope.AttendanceRegulObj.selectedCalDate = new Date(year, $scope.month, dateobj.date);
                        $scope.filteredSelectedCalDate = new Date($scope.AttendanceRegulObj.selectedCalDate)
                        $scope.AttendanceRegulObj.year = year
                        $scope.AttendanceRegulObj.check = 'cal'
                        $scope.AttendanceRegulObj.month = 1 + $scope.month
                        if (sessionStorage.getItem('isManager') == 1) {
                            if ($scope.filteredSelectedCalDate > $scope.filteredLockingDate) {

                                if (($scope.IsRegularizationAccessible == 'true') && ($scope.selCalDate < $scope.todayDate)) {
                                    $scope.popover.show($event);
									if (dateobj.calColor === undefined){
										$scope.showAttenRegular = true
										if ($scope.IsLeaveAccessible == 'true') {
                                            $scope.showLeave = true
                                        }
                                        if ($scope.IsODAccessible == 'true') {
                                            $scope.showOD = true
                                        }
									}
									else
									{
										dateobj.calColor= dateobj.calColor.trim();
									
                                    if (($scope.selCalDate < $scope.todayDate) && (dateobj.calColor == '#00CDCD' || dateobj.calColor == '#FFFF00' || dateobj.calColor == '#D7F187' || dateobj.calColor == '#FFA07A' || dateobj.calColor == '#6666FF')) {
                                        $scope.showAttenRegular = true
                                    }
                                    if (dateobj.calColor == '#f37076') {
                                        $scope.showAttenRegular = true
                                        if (!$scope.description)
                                        {
                                            $scope.AttendanceRegulObj.firstHalf = 'Absent'
                                        }
                                    }
                                    if (dateobj.calColor != '#6666FF' || dateobj.calColor == '#00CDCD' || dateobj.calColor == '#6666FF') {
                                        if ($scope.IsLeaveAccessible == 'true') {
                                            $scope.showLeave = true
                                        }
                                        if ($scope.IsODAccessible == 'true') {
                                            $scope.showOD = true
                                        }
                                    }
								  }
                                }
                                else if (($scope.selCalDate >= $scope.todayDate)) {
                                    $scope.popover.show($event);
                                    if ($scope.IsLeaveAccessible == 'true') {
                                        $scope.showLeave = true
                                    }
                                    if ($scope.IsODAccessible == 'true') {
                                        $scope.showOD = true
                                    }
                                }
								//added on 2
								if ($scope.IsShiftChangeAccessible=='true'){
									$scope.showShift = true
								}else{
									$scope.showShift = false
								}
                                getSetService.set($scope.AttendanceRegulObj);

                            }
                            else {

                                $ionicLoading.hide()
                                showAlert("", "Either shift not available or locking period passed away for selected criteria")
                            }
                        }
                    }
                };
                $scope.closePopover = function () {
                    $scope.popover.hide();
                };
                //Cleanup the popover when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.popover.remove();
                });
                // Execute action on hide popover
                $scope.$on('popover.hidden', function () {
                    // Execute action
                });
                // Execute action on remove popover
                $scope.$on('popover.removed', function () {
                    // Execute action
                });
//  longKeyPress end

                // before 09/05
                // $scope.assignCalendarColors = function (colourDateMap) {
                //     if (Object.keys(colourDateMap).length != 0) {
                //         for (var i = 0; i < $scope.datesDisp.length; i++) {

                //             for (var j = 0; j < $scope.datesDisp[i].length; j++) {
                //                 if (colourDateMap[$scope.datesDisp[i][j].date.toString()] !== "null") {
                //                     if ($scope.datesDisp[i][j].type == "currentMonth") {
                //                         $scope.datesDisp[i][j].backColor = colourDateMap[$scope.datesDisp[i][j].date.toString()];
                //                         if ($scope.datesDisp[i][j].backColor == "#ffffff") {

                //                             $scope.datesDisp[i][j].fontColor = "#000000";
                //                         }
                //                         else {
                //                             $scope.datesDisp[i][j].fontColor = "#000000";
                //                         }
                //                     }
                //                 }
                //             }
                //         }
                //     }
                // }

                //After 09/05
                $scope.assignAttCalendarColors = function (colourDateMap) {
                    if (Object.keys(colourDateMap.attendanceTypeDWColour).length != 0) {
                        for (var i = 0; i < $scope.datesDisp.length; i++) {

                            for (var j = 0; j < $scope.datesDisp[i].length; j++) {
                                if (colourDateMap.attendanceTypeDWColour[$scope.datesDisp[i][j].date.toString()] !== "null") {
                                    if ($scope.datesDisp[i][j].type == "currentMonth") {
                                        var d = new Date(selectedYear,selectedMonth,1,0,0,0,0);
                                        d.setDate($scope.datesDisp[i][j].date);
                                        $scope.datesDisp[i][j].dateString = d;
                                        $scope.datesDisp[i][j].backColor = colourDateMap.attendanceTypeDWColour[$scope.datesDisp[i][j].date.toString()];
                                        $scope.datesDisp[i][j].calColor =  colourDateMap.attendanceTypeColour[$scope.datesDisp[i][j].date.toString()]; 
                                        $scope.datesDisp[i][j].fontColor = "#000000";
                                    }
                                }
                            }
                        }
                    }
                }
                $scope.setFn({theDirFn: $scope.assignAttCalendarColors});//to set the call back function from selfService page
                $scope.displayMonthCalendar();
            }
        ],
        template: '<style>'
                + '.ionic_Calendar .calendar_Date .row.Daysheading {text-align:center;}'
                + '.ionic_Calendar .txtCenter {text-align:center;}'
                + '.ionic_Calendar .col.selMonth { background-color: #04BDD7; color:white; }'
                + '.ionic_Calendar .col.selYear { background-color: #04BDD7; color:white;  }'
                + '.ionic_Calendar .col.fadeDateDisp, .col.fadeYear { background-color: #F8F8F8; color:#D5D5D5 }'
                + '.ionic_Calendar .DaysDisplay .col{ border: 3px solid #F8F8F8; padding-top: 10px; font-weight: bolder; height: 40px;}'
                + '.ionic_Calendar .col.selDate {border: 3px solid {{selDatetheme}};}'
                + '.ionic_Calendar .DaysDisplay.row{ padding-left: 0px; padding-right: 0px; }'
                + '.ionic_Calendar .MonthsDisplay.row{ padding-left: 0px; padding-right: 0px; }'
                + '.ionic_Calendar .MonthsDisplay .col{ border: 1px solid #F3F3F3; padding-top: 30px; font-size: 18px;  height: 80px;}'
                + '.ionic_Calendar .YearsDisplay.row{ padding-left: 0px; padding-right: 0px; }'
                + '.ionic_Calendar .YearsDisplay .col{ border: 1px solid #F3F3F3; padding-top: 30px; font-size: 18px; height: 80px;}'
                + '.ionic_Calendar .marginTop0 { margin-top: 0px !important;}'
                + '.ionic_Calendar .paddingBottom0 { padding-bottom: 0px !important;}'
                + '.ionic_Calendar .Daysheading_Label .col { padding-bottom: 0px !important;}'
                + '.ionic_Calendar .stripColor { padding-left: 0px;padding-right: 0px;}'
                + '.cal-item { border-color: #ddd; background-color: #F8F8F8; color: #444;position: relative;z-index: 2;display: block;margin: -1px;padding: 16px;border-width: 1px;border-style: solid;font-size: 16px;}'
                + '</style>'
                + '<div class="ionic_Calendar">'
                + '	<div class="calendar_Date" ng-show="UICalendarDisplay.Date">'
                + '		<div class="row" style="color: grey;">'
                + '		  <div class="col col-30 txtCenter" ng-click="selectedMonthPrevClick()"><i class="icon ion-chevron-left"></i></div>'
                + '		  <div class="col col-40 txtCenter" ><span ng-click="UIdisplayDatetoMonth()">{{dislayMonth}} {{displayYear}} </span></div>'
                + '		  <div class="col col-30 txtCenter" ng-click="selectedMonthNextClick()"><i class="icon ion-chevron-right"></i></div>'
                + '		</div>'
                + '		<div class="row Daysheading Daysheading_Label" style="color: black;">'
                + '		  <div class="col">S</div><div class="col">M</div><div class="col">T</div><div class="col">W</div><div class="col">T</div><div class="col">F</div><div class="col">S</div>'
                + '		</div>'
                + '		<div class="row Daysheading DaysDisplay" ng-repeat = "rowVal in datesDisp  track by $index" ng-class="{\'marginTop0\':$first}">'
                + '		  <div class="col stripColor" ng-repeat = "colVal in rowVal  track by $index" ng-class="{\'fadeDateDisp\':(colVal.type == \'oldMonth\' || colVal.type == \'newMonth\'), \'selDate\':(colVal.date == displayDate && colVal.type == \'currentMonth\')}" ng-style="{\'background-color\':colVal.backColor, \'color\':colVal.fontColor}" on-hold="openPopover($event,colVal,dislayMonth,displayYear)" ng-click="selectedDateClick(colVal)">{{colVal.date}}'
               
               
                //PRESENT AND ABSENT
                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'PRESENT\') !== -1 && colVal.backColor.indexOf(\'ABSENT\') !== -1 && colVal.backColor.indexOf(\'PRESENT_ABSENT\') === -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') === -1 && colVal.backColor.indexOf(\'PRESENT\') < colVal.backColor.indexOf(\'ABSENT\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
            
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#D7F187;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'
                +'</div>  '
                
                 // ABSENT AND PRESENT
                 + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'PRESENT\') !== -1 && colVal.backColor.indexOf(\'ABSENT\') !== -1 && colVal.backColor.indexOf(\'PRESENT_ABSENT\') === -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') === -1 && colVal.backColor.indexOf(\'PRESENT\') > colVal.backColor.indexOf(\'ABSENT\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
            
                 + '<span style="display: inline-block;height: 6px;width: 100%;background:#f37076;"></span>'
                 + '<span style="display: inline-block;height: 6px;width: 100%;background: #D7F187"></span>'
                 +'</div>  '
                 // Only Present
                 + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'PRESENT\') !== -1 && colVal.backColor.indexOf(\'ABSENT\') === -1 && colVal.backColor.indexOf(\'WEEKLYOFF\') === -1 && colVal.backColor.indexOf(\'OUT_DOOR\') === -1 && colVal.backColor.indexOf(\'LEAVE\') === -1 && colVal.backColor.indexOf(\'PRESENT_ABSENT\') === -1" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
             
                 + '<span style="display: inline-block;height: 6px;width: 100%;background:#D7F187;"></span>'
                 +'</div>  '
 
                 // Only Absent
                 + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'ABSENT\') !== -1 && '
                 + ' colVal.backColor.indexOf(\'LEAVE\') === -1 && colVal.backColor.indexOf(\'PRESENT\') === -1 && colVal.backColor.indexOf(\'WORK_FROM_HOME\') === -1 && '
                 + ' colVal.backColor.indexOf(\'PRESENT_ABSENT\') === -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') === -1 && colVal.backColor.indexOf(\'OUT_DOOR\') === -1 && colVal.backColor.indexOf(\'WEEKLYOFF\') === -1" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                 + '<span ng-if="todayCalDate<colVal.dateString" style="display: inline-block;height: 6px;width: 100%;background: #F8F8F8"></span>'
                 + '<span ng-if="todayCalDate>colVal.dateString" style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'
                 + '<span ng-if="(todayCalDate| date:\'dd/MM/yyyy\') == (colVal.dateString| date:\'dd/MM/yyyy\')" style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'   
                 +'</div>  '
 
                  // Only Weeklyoff             
                  + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'WEEKLYOFF\') !== -1 && colVal.backColor.indexOf(\'LEAVE\') === -1 && colVal.backColor.indexOf(\'OUT_DOOR\') === -1 && colVal.backColor.indexOf(\'PRESENT\') === -1 && colVal.backColor.indexOf(\'ABSENT\') === -1" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
             
                  + '<span style="display: inline-block;height: 6px;width: 100%;background:#FFA07A;"></span>'
                  +'</div>  '
                   
                  //Present and weeklyoff
                  + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'WEEKLYOFF\') !== -1 && colVal.backColor.indexOf(\'PRESENT\') !== -1 && colVal.backColor.indexOf(\'LEAVE\') === -1 && colVal.backColor.indexOf(\'ABSENT\') === -1 && colVal.backColor.indexOf(\'PRESENT_ABSENT\') === -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') === -1 && colVal.backColor.indexOf(\'OUT_DOOR\') === -1 && colVal.backColor.indexOf(\'WEEKLYOFF\')  > colVal.backColor.indexOf(\'PRESENT\') " style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                  + '<span ng-if="todayCalDate<colVal.dateString" style="display: inline-block;height: 6px;width: 100%;background: #F8F8F8"></span>'
                  + '<span ng-if="todayCalDate>colVal.dateString" style="display: inline-block;height: 6px;width: 100%;background: #D7F187"></span>'
                  + '<span ng-if="(todayCalDate| date:\'dd/MM/yyyy\') == (colVal.dateString| date:\'dd/MM/yyyy\')" style="display: inline-block;height: 6px;width: 100%;background: #D7F187"></span>'   
                  + '<span style="display: inline-block;height: 6px;width: 100%;background:#FFA07A;"></span>'
                  +'</div>  '

                  // WEEKLYOFF and Present
                  + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'WEEKLYOFF\') !== -1 && colVal.backColor.indexOf(\'PRESENT\') !== -1 && colVal.backColor.indexOf(\'LEAVE\') === -1 && colVal.backColor.indexOf(\'ABSENT\') === -1 && colVal.backColor.indexOf(\'PRESENT_ABSENT\') === -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') === -1 && colVal.backColor.indexOf(\'OUT_DOOR\') === -1 && colVal.backColor.indexOf(\'WEEKLYOFF\') < colVal.backColor.indexOf(\'PRESENT\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                  + '<span style="display: inline-block;height: 6px;width: 100%;background:#FFA07A;"></span>'
                  + '<span ng-if="todayCalDate<colVal.dateString" style="display: inline-block;height: 6px;width: 100%;background: #F8F8F8"></span>'
                  + '<span ng-if="todayCalDate>colVal.dateString" style="display: inline-block;height: 6px;width: 100%;background: #D7F187"></span>'
                  + '<span ng-if="(todayCalDate| date:\'dd/MM/yyyy\') == (colVal.dateString| date:\'dd/MM/yyyy\')" style="display: inline-block;height: 6px;width: 100%;background: #D7F187"></span>'   
                  +'</div>  '

                  //Absent and weeklyoff
                  + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'WEEKLYOFF\') !== -1 && colVal.backColor.indexOf(\'ABSENT\') !== -1 && colVal.backColor.indexOf(\'LEAVE\') === -1 && colVal.backColor.indexOf(\'PRESENT\') === -1 && colVal.backColor.indexOf(\'PRESENT_ABSENT\') === -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') === -1 && colVal.backColor.indexOf(\'OUT_DOOR\') === -1 && colVal.backColor.indexOf(\'WEEKLYOFF\')  > colVal.backColor.indexOf(\'ABSENT\') " style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                  + '<span ng-if="todayCalDate<colVal.dateString" style="display: inline-block;height: 6px;width: 100%;background: #F8F8F8"></span>'
                  + '<span ng-if="todayCalDate>colVal.dateString" style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'
                  + '<span ng-if="(todayCalDate| date:\'dd/MM/yyyy\') == (colVal.dateString| date:\'dd/MM/yyyy\')" style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'   
                  + '<span style="display: inline-block;height: 6px;width: 100%;background:#FFA07A;"></span>'
                  +'</div>  '

                  // WEEKLYOFF and ABSENT
                  + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'WEEKLYOFF\') !== -1 && colVal.backColor.indexOf(\'ABSENT\') !== -1 && colVal.backColor.indexOf(\'LEAVE\') === -1 && colVal.backColor.indexOf(\'PRESENT\') === -1 && colVal.backColor.indexOf(\'PRESENT_ABSENT\') === -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') === -1 && colVal.backColor.indexOf(\'OUT_DOOR\') === -1 && colVal.backColor.indexOf(\'WEEKLYOFF\') < colVal.backColor.indexOf(\'ABSENT\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                  + '<span style="display: inline-block;height: 6px;width: 100%;background:#FFA07A;"></span>'
                  + '<span ng-if="todayCalDate<colVal.dateString" style="display: inline-block;height: 6px;width: 100%;background: #F8F8F8"></span>'
                  + '<span ng-if="todayCalDate>colVal.dateString" style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'
                  + '<span ng-if="(todayCalDate| date:\'dd/MM/yyyy\') == (colVal.dateString| date:\'dd/MM/yyyy\')" style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'   
                  +'</div>  '

                  // Only OD
                  + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'OUT_DOOR\') !== -1 && colVal.backColor.indexOf(\'PRESENT\') === -1 && colVal.backColor.indexOf(\'LEAVE\') === -1 && colVal.backColor.indexOf(\'ABSENT\') === -1 && colVal.backColor.indexOf(\'WEEKLYOFF\') === -1" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
             
                  + '<span style="display: inline-block;height: 6px;width: 100%;background:#ffff00;"></span>'
                  +'</div>  '

                    //Only Travel
                    + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'TRAVEL\') !== -1" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
             
                    + '<span style="display: inline-block;height: 6px;width: 100%;background:#9ACD32;"></span>'
                    +'</div>  '

                   // Only Holiday
                   + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'HOLIDAY\') !== -1" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                   + '<span style="display: inline-block;height: 6px;width: 100%;background:#ff75d0;"></span>'
                   +'</div>  '
                // Present and OD
                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'PRESENT\') !== -1 && colVal.backColor.indexOf(\'OUT_DOOR\') !== -1 && colVal.backColor.indexOf(\'PRESENT\') < colVal.backColor.indexOf(\'OUT_DOOR\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
            
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#D7F187;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #ffff00"></span>'
                +'</div>  '
                // OD and Present
                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'PRESENT\') !== -1 && colVal.backColor.indexOf(\'OUT_DOOR\') !== -1 && colVal.backColor.indexOf(\'PRESENT\') > colVal.backColor.indexOf(\'OUT_DOOR\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
            
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#ffff00;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #D7F187"></span>'
                +'</div>  '

                 // Leave and OD
                 + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'LEAVE\') !== -1 && colVal.backColor.indexOf(\'OUT_DOOR\') !== -1 &&  colVal.backColor.indexOf(\'SHORT_LEAVE\') === -1  && colVal.backColor.indexOf(\'LEAVE\') < colVal.backColor.indexOf(\'OUT_DOOR\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
            
                 + '<span style="display: inline-block;height: 6px;width: 100%;background:#6666FF;"></span>'
                 + '<span style="display: inline-block;height: 6px;width: 100%;background: #ffff00"></span>'
                 +'</div>  '
                // OD and Leave
                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'LEAVE\') !== -1 && colVal.backColor.indexOf(\'OUT_DOOR\') !== -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') === -1 && colVal.backColor.indexOf(\'LEAVE\') > colVal.backColor.indexOf(\'OUT_DOOR\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
            
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#ffff00;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #6666FF"></span>'
                +'</div>  '

                 // FH Absent and SH OD
                 + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'ABSENT\') !== -1 && colVal.backColor.indexOf(\'OUT_DOOR\') !== -1 && colVal.backColor.indexOf(\'ABSENT\') < colVal.backColor.indexOf(\'OUT_DOOR\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
            
                 + '<span ng-if="todayCalDate<colVal.dateString" style="display: inline-block;height: 6px;width: 100%;background: #F8F8F8"></span>'
                + '<span ng-if="todayCalDate>colVal.dateString" style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'
                + '<span ng-if="(todayCalDate| date:\'dd/MM/yyyy\') == (colVal.dateString| date:\'dd/MM/yyyy\')" style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'
                 + '<span style="display: inline-block;height: 6px;width: 100%;background: #ffff00"></span>'
                 +'</div>  '
                // OD AND ABSENT
                 + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'ABSENT\') !== -1 && colVal.backColor.indexOf(\'OUT_DOOR\') !== -1 && colVal.backColor.indexOf(\'ABSENT\') > colVal.backColor.indexOf(\'OUT_DOOR\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
            
                 + '<span style="display: inline-block;height: 6px;width: 100%;background:#ffff00;"></span>'
                 + '<span ng-if="todayCalDate<colVal.dateString" style="display: inline-block;height: 6px;width: 100%;background: #F8F8F8"></span>'
                 + '<span ng-if="todayCalDate>colVal.dateString" style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'
                 + '<span ng-if="(todayCalDate| date:\'dd/MM/yyyy\') == (colVal.dateString| date:\'dd/MM/yyyy\')" style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'
                 +'</div>  '
                // Weeklyoff and OD
                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'WEEKLYOFF\') !== -1 && colVal.backColor.indexOf(\'OUT_DOOR\') !== -1 && colVal.backColor.indexOf(\'WEEKLYOFF\') < colVal.backColor.indexOf(\'OUT_DOOR\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
            
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#FFA07A;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #ffff00"></span>'
                +'</div>  '

                // OD and Weeklyoff
                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'WEEKLYOFF\') !== -1 && colVal.backColor.indexOf(\'OUT_DOOR\') !== -1 && colVal.backColor.indexOf(\'WEEKLYOFF\') > colVal.backColor.indexOf(\'OUT_DOOR\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
            
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#ffff00;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #FFA07A"></span>'
                +'</div>  '
                // Present and leave
                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'PRESENT\') !== -1 && colVal.backColor.indexOf(\'LEAVE\') !== -1 && colVal.backColor.indexOf(\'PRESENT_ABSENT\') === -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') === -1 && colVal.backColor.indexOf(\'PRESENT\') < colVal.backColor.indexOf(\'LEAVE\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#D7F187;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #6666FF"></span>'
                +'</div>  '
                // leave and present
                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'PRESENT\') !== -1 && colVal.backColor.indexOf(\'LEAVE\') !== -1 && colVal.backColor.indexOf(\'PRESENT_ABSENT\') === -1 &&  colVal.backColor.indexOf(\'SHORT_LEAVE\') === -1 && colVal.backColor.indexOf(\'PRESENT\') > colVal.backColor.indexOf(\'LEAVE\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#6666FF;"></span>'
                + '<span ng-if="colVal.backColor.indexOf(\'ABSENT\') !== -1" style="display: inline-block;height: 6px;width: 100%;background:#f37076;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #D7F187"></span>'
                +'</div>  '

                // Absent and leave
                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'ABSENT\') !== -1 && colVal.backColor.indexOf(\'LEAVE\') !== -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') === -1 && colVal.backColor.indexOf(\'PRESENT_ABSENT\') === -1 && colVal.backColor.indexOf(\'ABSENT\') < colVal.backColor.indexOf(\'LEAVE\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span ng-if="todayCalDate < colVal.dateString" style="display: inline-block;height: 6px;width: 100%;background: #F8F8F8"></span>'
                + '<span ng-if="todayCalDate > colVal.dateString" style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'
                + '<span ng-if="(todayCalDate| date:\'dd/MM/yyyy\') == (colVal.dateString | date:\'dd/MM/yyyy\')" style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #6666FF"></span>'
                +'</div>  '

                 //rajesh advani
                // short leave and leave
                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'F_HF_SHORT_LEAVE_S_HF_LEAVE\') !== -1 " style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span  style="display: inline-block;height: 6px;width: 100%;background: #D7F187"></span>'
                + '<span  style="display: inline-block;height: 6px;width: 100%;background: #6666FF"></span>'
                
                +'</div>  '

               

                // Leave and Absent(todayDate < dateStringFormated(P))
                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'ABSENT\') !== -1 && colVal.backColor.indexOf(\'LEAVE\') !== -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') === -1 && colVal.backColor.indexOf(\'PRESENT_ABSENT\') === -1 && colVal.backColor.indexOf(\'ABSENT\') > colVal.backColor.indexOf(\'LEAVE\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#6666FF;"></span>'
                + '<span ng-if="todayCalDate < colVal.dateString" style="display: inline-block;height: 6px;width: 100%;background: #F8F8F8"></span>'
                + '<span ng-if="todayCalDate > colVal.dateString" style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'
                + '<span ng-if="(todayCalDate| date:\'dd/MM/yyyy\' ) == (colVal.dateString| date:\'dd/MM/yyyy\' )" style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'
                +'</div>  '

                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'ABSENT\') !== -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') !== -1 && colVal.backColor.indexOf(\'PRESENT_ABSENT\') === -1 && colVal.backColor.indexOf(\'PRESENT\') === -1 && colVal.backColor.indexOf(\'ABSENT\')< colVal.backColor.indexOf(\'SHORT_LEAVE\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#f37076;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #D7F187"></span>'
                +'</div>  '

                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'ABSENT\') !== -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') !== -1 && colVal.backColor.indexOf(\'PRESENT_ABSENT\') === -1 && colVal.backColor.indexOf(\'PRESENT\') === -1 && colVal.backColor.indexOf(\'ABSENT\') > colVal.backColor.indexOf(\'SHORT_LEAVE\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#D7F187;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'
                +'</div>  '

                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'PRESENT\') !== -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') !== -1 && colVal.backColor.indexOf(\'ABSENT\') === -1 " style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#D7F187;"></span>'
                +'</div>  '

                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'ABSENT_ABSENT\') !== -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') !== -1 && colVal.backColor.indexOf(\'PRESENT\') === -1  " style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#f37076;"></span>'
                +'</div>  '   

                // shortleave present absent
                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'PRESENT\') !== -1 && colVal.backColor.indexOf(\'ABSENT\') !== -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') !== -1 && colVal.backColor.indexOf(\'PRESENT\') < colVal.backColor.indexOf(\'ABSENT\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#D7F187;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'
                +'</div>  '
                // shortleave absent present
                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'PRESENT\') !== -1 && colVal.backColor.indexOf(\'ABSENT\') !== -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') !== -1 && colVal.backColor.indexOf(\'PRESENT\') > colVal.backColor.indexOf(\'ABSENT\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#f37076;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #D7F187"></span>'
                +'</div>  '

                //only leave
                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'LEAVE\') !== -1 &&  colVal.backColor.indexOf(\'WEEKLYOFF\') === -1 && colVal.backColor.indexOf(\'ABSENT\') === -1 && colVal.backColor.indexOf(\'PRESENT\') ===-1 && colVal.backColor.indexOf(\'PRESENT_ABSENT\') === -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') === -1 && colVal.backColor.indexOf(\'OUT_DOOR\') === -1" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#6666FF;"></span>'
                +'</div>  ' 
                
				
				// leave and weeklyoff
				+ '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'LEAVE\') !== -1 && colVal.backColor.indexOf(\'WEEKLYOFF\') !== -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') === -1 && colVal.backColor.indexOf(\'PRESENT_ABSENT\') === -1 && colVal.backColor.indexOf(\'LEAVE\') < colVal.backColor.indexOf(\'WEEKLYOFF\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#6666FF;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #FFA07A"></span>'
                +'</div>  '
				
				//ATT_REG
				+ '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'ATT_REG\') !== -1"   style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#1418c9;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #1418c9"></span>'
                +'</div>  '

                //WORK_FROM_HOME
				+ '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor == \'WORK_FROM_HOME\' "  style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#00BAC6;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #00BAC6"></span>'
                +'</div>  '

                //F_HF_WORK_FROM_HOME_S_HF_ABSENT
				+ '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'F_HF_WORK_FROM_HOME_S_HF_ABSENT\') !== -1"  style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#00BAC6;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'
                +'</div>  '

                //F_HF_WORK_FROM_HOME_S_HF_LEAVE
                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'F_HF_WORK_FROM_HOME_S_HF_LEAVE\') !== -1"  style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#00BAC6;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #6666FF"></span>'
                +'</div>  '


				// weeklyoff and leave
				+ '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'LEAVE\') !== -1 && colVal.backColor.indexOf(\'WEEKLYOFF\') !== -1 && colVal.backColor.indexOf(\'SHORT_LEAVE\') === -1 && colVal.backColor.indexOf(\'PRESENT_ABSENT\') === -1 && colVal.backColor.indexOf(\'LEAVE\') > colVal.backColor.indexOf(\'WEEKLYOFF\')" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#FFA07A;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #6666FF"></span>'
                +'</div>  '

                // leave ,prsent and absent 
                + '<div ng-if="colVal.date && colVal.backColor != undefined && colVal.backColor.indexOf(\'LEAVE\') !== -1 && colVal.backColor.indexOf(\'PRESENT_ABSENT\') !== -1 && colVal.backColor.indexOf(\'OUT_DOOR\') === -1 &&  colVal.backColor.indexOf(\'SHORT_LEAVE\') === -1" style="display: flex;width: 100%;bottom: 0;align-items: flex-end;margin-top: -3px;">'
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#6666FF;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background:#D7F187;"></span>'
                + '<span style="display: inline-block;height: 6px;width: 100%;background: #f37076"></span>'
                +'</div>  '


                +'</div> '


                + '		</div>'
                + '     </div>'

                + '      <div class="calendar_Month" ng-show="UICalendarDisplay.Month">'
                + '		<div class="row" style="color: grey;">'
                + '		  <div class="col col-30 txtCenter" ng-click="selectedMonthYearPrevClick()"><i class="icon ion-chevron-left"></i></div>'
                + '		  <div class="col col-40 txtCenter"><span ng-click="UIdisplayMonthtoYear()">{{displayYear}}</span></div>'
                + '		  <div class="col col-30 txtCenter" ng-click="selectedMonthYearNextClick()"><i class="icon ion-chevron-right"></i></div>'
                + '		</div>'
                + '		<div class="row txtCenter MonthsDisplay" ng-repeat = "rowVal in calMonths  track by $index" ng-class="{\'marginTop0\':$first}">'
                + '		  <div class="col" ng-repeat = "colVal in rowVal  track by $index"  ng-class="(colVal.name == shortMonth) ? \'selMonth\' : \'NonSelMonth\'"  ng-click="selectedMonthClick(colVal.id)" >{{colVal.name}}</div>'
                + '		</div>'
                + '	</div>'
                + '	<div class="calendar_Year" ng-show="UICalendarDisplay.Year">'
                + '		<div class="row" style="color: grey;">'
                + '		  <div class="col col-30 txtCenter" ng-click="selectedDecadePrevClick()"><i class="icon ion-chevron-left"></i></div>'
                + '		  <div class="col col-40 txtCenter">{{startYearDisp+1}}-{{endYearDisp-1}}</div>'
                + '		  <div class="col col-30 txtCenter" ng-click="selectedDecadeNextClick()"><i class="icon ion-chevron-right"></i></div>'
                + '		</div>'
                + '		<div class="row txtCenter YearsDisplay" ng-repeat = "nx in []| rangecal:3" ng-class="{\'marginTop0\':$first}">'
                + '		  <div class="col" ng-repeat="n in [] | rangecal:4"  ng-class="{ \'fadeYear\': (((startYearDisp+nx+nx+nx+nx+n) == startYearDisp)||((startYearDisp+nx+nx+nx+nx+n) == endYearDisp)), \'selYear\': ((startYearDisp+nx+nx+nx+nx+n) == displayYear) }" ng-click="selectedYearClick((startYearDisp+nx+nx+nx+nx+n))">{{startYearDisp+nx+nx+nx+nx+n}}</div>'
                + '		</div>'
                + '	</div>'
                + '</div>'
    };
})