

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

mainModule.directive('myCal', function ($rootScope) {
    return {
        restrict: 'E',
        transclude: true,
        require: 'display',
        scope: {display: "=", dateformat: "=", getColours: "=", setFn: "&"},
        controller: ['$scope', '$filter', function ($scope, $filter) {
          
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
                    $scope.dislayMonth = month;
                    selectedMonth = month;
                    $scope.displayMonthCalendar();
                    $scope.UICalendarDisplay.Date = true;
                    $scope.UICalendarDisplay.Month = false;
                    $scope.UICalendarDisplay.Year = false;
                    $scope.displayCompleteDate();
                }

                $scope.selectedDateClick = function (date) {
                    $scope.displayDate = date.date;
                    selectedDate = date.date;
                    if (date.type == 'newMonth') {
                        var mnthDate = new Date(selectedYear, selectedMonth, 32)
                        selectedMonth = mnthDate.getMonth();
                        selectedYear = mnthDate.getFullYear();
                        $scope.displayMonthCalendar();
                    } else if (date.type == 'oldMonth') {
                        var mnthDate = new Date(selectedYear, selectedMonth, 0);
                        selectedMonth = mnthDate.getMonth();
                        selectedYear = mnthDate.getFullYear();
                        $scope.displayMonthCalendar();
                    }
                    else
                    {
                        $scope.temp.displayDate = $scope.displayDate;
                        $scope.temp.check = '1';
                        $scope.getColours($scope.temp);
                    }
                    $scope.displayCompleteDate($scope.displayDate);
                }

                $scope.displayMonthCalendar = function () {      
                    sessionStorage.setItem('selectedMonth', selectedMonth)
                    $scope.temp.empId = sessionStorage.getItem('empId');
                    $scope.temp.month = selectedMonth;
                    $scope.temp.year = selectedYear;
                    $scope.temp.displayDate = selectedDate
                    $scope.temp.check = '0';
                    $scope.getColours($scope.temp);                   // call back function                   
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
                                    $scope.datesDisp[i][j] = {"type": "oldMonth", "date": (prevMonthLastDates - startDay + 1) + j};
                                } else {
                                    $scope.datesDisp[i][j] = {"type": "currentMonth", "date": countDatingStart++};
                                }
                            }
                        } else {
                            for (k = 0; k < 7; k++) {
                                if (countDatingStart <= endingDateLimit) {
                                    $scope.datesDisp[i][k] = {"type": "currentMonth", "date": countDatingStart++};
                                } else {
                                    $scope.datesDisp[i][k] = {"type": "newMonth", "date": nextMonthStartDates++};
                                }
                            }
                        }
                    }

                }

                $scope.assignCalendarColors = function (colourDateMap) {

                    if (Object.keys(colourDateMap).length != 0) {
                        for (var i = 0; i < $scope.datesDisp.length; i++) {

                            for (var j = 0; j < $scope.datesDisp[i].length; j++) {
                                if (colourDateMap[$scope.datesDisp[i][j].date.toString()] !== "null") {
                                    if ($scope.datesDisp[i][j].type == "currentMonth") {
                                        $scope.datesDisp[i][j].backColor = colourDateMap[$scope.datesDisp[i][j].date.toString()];
                                        if ($scope.datesDisp[i][j].backColor == "#ffffff") {

                                            $scope.datesDisp[i][j].fontColor = "#000000";
                                        }
                                        else {

                                            $scope.datesDisp[i][j].fontColor = "white";
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                $scope.setFn({theDirFn: $scope.assignCalendarColors});
                $scope.displayMonthCalendar();
            }
        ],
        template: '<style>'
                + '.ionic_Calendar .calendar_Date .row.Daysheading {text-align:center;}'
                + '.ionic_Calendar .txtCenter {text-align:center;}'
                + '.ionic_Calendar .col.selMonth { background-color: #04BDD7; color:white; }'
                + '.ionic_Calendar .col.selYear { background-color: #04BDD7; color:white;  }'
                + '.ionic_Calendar .col.fadeDateDisp, .col.fadeYear { background-color: #E9E9E9; color:#D5D5D5 }'
                + '.ionic_Calendar .DaysDisplay .col{ border: 1px solid #F3F3F3; padding-top: 10px; font-weight: bolder; height: 40px;}'
                + '.ionic_Calendar .col.selDate {border: 3px solid green;}'
                + '.ionic_Calendar .DaysDisplay.row{ padding-left: 0px; padding-right: 0px; }'
                + '.ionic_Calendar .MonthsDisplay.row{ padding-left: 0px; padding-right: 0px; }'
                + '.ionic_Calendar .MonthsDisplay .col{ border: 1px solid #F3F3F3; padding-top: 30px; font-size: 18px;  height: 80px;}'
                + '.ionic_Calendar .YearsDisplay.row{ padding-left: 0px; padding-right: 0px; }'
                + '.ionic_Calendar .YearsDisplay .col{ border: 1px solid #F3F3F3; padding-top: 30px; font-size: 18px; height: 80px;}'
                + '.ionic_Calendar .marginTop0 { margin-top: 0px !important;}'
                + '.ionic_Calendar .paddingBottom0 { padding-bottom: 0px !important;}'
                + '.ionic_Calendar .Daysheading_Label .col { padding-bottom: 0px !important;}'
                + '</style>'
                + '<div class="ionic_Calendar">'
                + '	<div class="calendar_Date" ng-show="UICalendarDisplay.Date">'
                + '		<div class="row"  style=" background-color:white;  color: grey;font-size: 15px;padding-left:5%;padding-right:5%;">'
                + '		  <div class="col col-30 txtCenter" ng-click="selectedMonthPrevClick()"><i class="icon ion-chevron-left"></i></div>'
                + '		  <div class="col col-40 txtCenter" ><span ng-click="UIdisplayDatetoMonth()">{{dislayMonth}} {{displayYear}} </span></div>'
                + '		  <div class="col col-30 txtCenter" ng-click="selectedMonthNextClick()"><i class="icon ion-chevron-right"></i></div>'
                + '		</div>'
                + '     </div>'
                + '   <div class = "calendar_Month" ng-show = "UICalendarDisplay.Month" > '
                + '		<div class="row" style=" background-color:white;  color: grey;font-size: 15px;padding-left:5%;padding-right:5%;">'
                + '		  <div class="col col-30 txtCenter" ng-click="selectedMonthYearPrevClick()"><i class="icon ion-chevron-left"></i></div>'
                + '		  <div class="col col-40 txtCenter"><span ng-click="UIdisplayMonthtoYear()">{{displayYear}}</span></div>'
                + '		  <div class="col col-30 txtCenter" ng-click="selectedMonthYearNextClick()"><i class="icon ion-chevron-right"></i></div>'
                + '		</div>'
                + '		<div class="row txtCenter MonthsDisplay" ng-repeat = "rowVal in calMonths  track by $index" ng-class="{\'marginTop0\':$first}">'
                + '		  <div class="col" ng-repeat = "colVal in rowVal  track by $index"  ng-class="(colVal.name == shortMonth) ? \'selMonth\' : \'NonSelMonth\'"  ng-click="selectedMonthClick(colVal.id)" >{{colVal.name}}</div>'
                + '		</div>'
                + '   </div>'
                + '   <div class="calendar_Year" ng-show="UICalendarDisplay.Year">'
                + '		<div class="row" style=" background-color:white;  color: grey;font-size: 15px;padding-left:5%;padding-right:5%;">'
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