/*
 1.This controller is used to show the Doughnut chart.
 */

mainModule.factory("viewRequisitionApprovalService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/attendanceReportApi/viewRequisitionApproval.spr'), {}, 
        {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
    
    }}, {});
    }]);
mainModule.factory("getCalendarAttTypeService", function ($resource) {
    return $resource((baseURL + '/api/SelfService/getPresentationList.spr'), {},
     {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("getClockInOutData", function ($resource) {
    return $resource((baseURL + '/api/signin/clockInOutData.spr'), {}, 
    {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("getPunchTimingsForEmp", function ($resource) {
    return $resource((baseURL + '/api/signin/clockInOutDataForDateRangeFormEmp.spr'), {}, 
    {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});


mainModule.controller("dashboardCtrl", function ($scope, $state, $rootScope, $filter, $ionicLoading, loginCommService, viewRequisitionApprovalService, getSetService, 
    commonService,homeService,$timeout,getCalendarAttTypeService,getClockInOutData,getPunchTimingsForEmp) {
        if (gb_processTimeRec == "true"){
            console.log("dashboard  start "+ $filter('date')(new Date(), 'hh:mm:ss'))
        }
	homeService.updateInboxEmailList("", function () {}, function (data) {})
	$scope.emptyObject= {}
	getSetService.set($scope.emptyObject)
	
	  google.charts.load('current', {'packages':['corechart']});
      //google.charts.setOnLoadCallback(drawChart);

        

	$scope.clockInFloatingButton = function () {
        homeService.getResult("SIGNIN", function (length, data) {
            if (length > 0) {
                $scope.hideCheckIn = '1';
            } else {
                $scope.hideCheckIn = '0';
            }
        }, function (data) {
            $ionicLoading.hide();
        })
    }

	if ($rootScope.ifOutOfFencePunchValid)
	{
		$scope.ifOutOfFencePunchValidLocalVar =  $rootScope.ifOutOfFencePunchValid
	}else{
		$scope.ifOutOfFencePunchValidLocalVar =  'N'
	}
	
    if ($rootScope.myAppVersion >= 25){
		$scope.selfieInPunchesFeature = 'true'
	}else{
		$scope.selfieInPunchesFeature = 'false'
	}
    
	$scope.clockInFloatingButton()
	$scope.IsClockInAccessible = sessionStorage.getItem('IsClockInAccessible');
	
	
	$scope.isARTorFRT = sessionStorage.getItem('IsARTorFRT');
    $scope.isGroupMasterReportee = sessionStorage.getItem('isGroupMasterReportee');
	//$scope.description.AttDesc="ykuykugghgj";

	if (localStorage.getItem("showOverlayHint")==null){
		localStorage.setItem("showOverlayHint","true");
	}
	
	
	$scope.showOverlayHint = localStorage.getItem("showOverlayHint");
	
    $scope.resultObj = {}
	
	if ($rootScope.navHistoryCurrPage=="my_team_detail" ){
		$scope.navigationFromTeamDetailPage =true;
	}
	$rootScope.navHistoryPrevPage="dashboard"
	$rootScope.navHistoryCurrPage="dashboard"
	$rootScope.lastPageBeforeMenu="dashboard"
	
	sessionStorage.removeItem('individualempId')

	/////// for card space
	sessionStorage.setItem('selectedMonth', null);
    $scope.attendanceDetail = {};
    $scope.attendanceDetail.SelfService = true;
    $scope.attendanceDetail.HomeDashBoard = false;
    $scope.attendanceDetail.photoFileName = sessionStorage.getItem('photoFileName')
    $scope.attendanceDetail.image1 = sessionStorage.getItem('profilePhoto');
    $scope.attendanceDetail.name = sessionStorage.getItem('empName');
    $scope.attendanceDetail.designation = sessionStorage.getItem('designation');
    if (sessionStorage.getItem('department') && (sessionStorage.getItem('displayDeptName') == '"Department"'))
        $scope.attendanceDetail.department = sessionStorage.getItem('department')
    if ($rootScope.HomeDashBoard)
        $scope.attendanceDetail.HomeDashBoard = true;
    //$ionicLoading.hide();	
	////// card space over
	
    $scope.redirectTomyApprovalRegularization = {};
    $scope.redirectTomyApprovalLeave = {};
    $scope.redirectTomyApprovalOD = {};
    $scope.redirectTomyApprovalShift = {};
    $scope.redirectToRegularization = {};
    $scope.redirectToLeave = {};
    $scope.redirectToOD = {};
    $scope.redirectToShift = {};
    $scope.donatChartNoData = false
    $scope.fDate = new Date()
    $scope.showngroupMyRequision = null;
    $scope.shownGroup = null;

    $scope.IsLeaveAccessible = sessionStorage.getItem('IsLeaveAccessible');
    $scope.IsODAccessible = sessionStorage.getItem('IsODAccessible');
    $scope.IsRegularizationAccessible = sessionStorage.getItem('IsRegularizationAccessible');
    $scope.IsShiftChangeAccessible = sessionStorage.getItem('IsShiftChangeAccessible');
	
	if (getMyHrapiVersionNumber() >=18){
		$scope.IsTravelAccessible = sessionStorage.getItem('IsTravelAccessible');
		$scope.IsClaimAccessible = sessionStorage.getItem('IsClaimAccessible');
		$scope.IsExpenseClaimAccessible = sessionStorage.getItem('IsExpenseClaimAccessible'); //for ctc nonctc and lta
	}else{
		$scope.IsTravelAccessible = 'false'
		$scope.IsClaimAccessible = 'false'
		$scope.IsExpenseClaimAccessible = 'false'
	}


    var date = new Date();
    var todaysDate = new Date();
	
	if(!($scope.navigationFromTeamDetailPage ==true)){
		$scope.resultObj.fromDate = $filter('date')(todaysDate, 'dd/MM/yyyy');
		$scope.resultObj.presentDayFlag = 1;
		sessionStorage.setItem('PresentDayFlag', 1);
		
	}else
	{
		//if control comes to dashboard but from teamdetail... 
		//then date should not be changed to today's , it should remain while
		// user went to teamdetail page from dashboard	

		$scope.resultObj.fromDate = $rootScope.DonutDataDate
		
				if ($scope.resultObj.fromDate == $filter('date')(todaysDate, 'dd/MM/yyyy')) {
                    $scope.resultObj.presentDayFlag = 1;
                    sessionStorage.setItem('PresentDayFlag', 1);
                }
                else {
                    $scope.resultObj.presentDayFlag = 0;
                    sessionStorage.setItem('PresentDayFlag', 0);
                }	
    }
    
	$scope.resultObj.doughnutChartCountOrListFlag = 0; // 0 - for count
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


		$ionicLoading.show()
    $timeout(function () {
		$ionicLoading.show()

        $scope.getDonutData()
        $scope.getDataForDayStrip(new Date())
        $scope.showTodaysClockInOutData(new Date())
                $scope.onLoadReporteeCheck()
                
		},100)


        $timeout(function () {
            
            if (GeoTrackingEnabledForUser == "true" && GeoTrackingFeatureEnabledForClient =="true"){
                enableGeoTrackingInBackground()
            }
            
          },500)
    

		
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

            }
            else {
                $scope.fDate = date;
                $scope.resultObj.fromDate = $filter('date')(date, 'dd/MM/yyyy');
                if (!$scope.$$phase)
                    $scope.$apply()
                if ($filter('date')(date, 'dd/MM/yyyy') == $filter('date')(todaysDate, 'dd/MM/yyyy')) {
                    $scope.resultObj.presentDayFlag = 1;
                    sessionStorage.setItem('PresentDayFlag', 1);
                }
                else {
                    $scope.resultObj.presentDayFlag = 0;
                    sessionStorage.setItem('PresentDayFlag', 0);
                    sessionStorage.setItem('DateForDoughnutList', $scope.resultObj.fromDate);
                }
                $ionicLoading.show();
				$scope.getDonutData()
				$scope.getDataForDayStrip($scope.fDate)		
				$scope.showTodaysClockInOutData($scope.fDate)
            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
    }

    function drawChart(PresentCount, AbsentCount, LeaveCount, ODCount, WeeklyOffCount, HolidayCount, NACount, OthersCount) {
        if (gb_processTimeRec == "true"){
            console.log("draw chart start "+ $filter('date')(new Date(), 'hh:mm:ss'))
        }
        if ($scope.resultObj.presentDayFlag == 1) {
            var data = google.visualization.arrayToDataTable([
                ['Attendance', 'per Day'],
                ['In' + ' (' + PresentCount + ')', parseInt(PresentCount)],
                ['Out' + ' (' + AbsentCount + ')', parseInt(AbsentCount)],
                ['Leave' + ' (' + LeaveCount + ')', parseInt(LeaveCount)],
                ['OD' + ' (' + ODCount + ')', parseInt(ODCount)]
            ]);
        }
        else {
			var totalChartItems ;
			totalChartItems = parseInt(PresentCount) + parseInt(AbsentCount) + parseInt(LeaveCount) + parseInt(ODCount) 
			totalChartItems =  totalChartItems + parseInt(WeeklyOffCount) + parseInt(HolidayCount) + parseInt(NACount) + parseInt(OthersCount)
			
			/*
			PresentCount = 5
			AbsentCount = 20
			LeaveCount=22
			ODCount = 17
			WeeklyOffCount =138
			HolidayCount =2
			NACount=12
			OthersCount = 15
			*/
			
            var data = google.visualization.arrayToDataTable([
                ['Attendance', 'per Day'],
                ['Present' + ' (' + PresentCount + ')', parseInt(PresentCount)],
                ['Absent' + ' (' + AbsentCount + ')', parseInt(AbsentCount)],
                ['Leave' + ' (' + LeaveCount + ')', parseInt(LeaveCount)],
                ['OD' + ' (' + ODCount + ')', parseInt(ODCount)],
                ['Weekly-Off' + ' (' + WeeklyOffCount + ')', parseInt(WeeklyOffCount)],
                ['Holiday' + ' (' + HolidayCount + ')', parseInt(HolidayCount)],
                ['No Data' + ' (' + NACount + ')', parseInt(NACount)],
                ['Others' + ' (' + OthersCount + ')', parseInt(OthersCount)]
            ]);

        }

        var options = {
            colors: ['#99E320', '#F7362A', '#812AF7', '#F7EB2A', '#F7842A', '#fd62f1', '#ffffff', '#D7BDE2'],
            chartArea: {
                left: 5,
				right:5,
                top: 25,
				textStyle: {fontSize: 14},
                width: '200%',
                height: '75%'
            },
            legend: {
                position: 'labeled',
                alignment: 'center',
				textStyle: {fontSize: 12,bold:true}
            },
            backgroundColor: '#f2f3f4',
            pieHole: 0.5,
            pieSliceTextStyle: {
                color: 'black', fontSize: 14
            },
            pieSliceText: 'none',
            sliceVisibilityThreshold: 0.0000001
        };
        
		function fetchReporteeOnload() {
            autoRetryCounter = 0;
			var selectedItem = chart.getSelection()[0];
			if ($scope.resultObj.presentDayFlag==1){
				
				switch(selectedItem.row) {
				case 0:
				sessionStorage.setItem('SelectedPiePieceFromDoughnut',"P");
				break;
				case 1:
				sessionStorage.setItem('SelectedPiePieceFromDoughnut',"A");
				break;
				case 2:
				sessionStorage.setItem('SelectedPiePieceFromDoughnut',"L");
				break;
				case 3:
				sessionStorage.setItem('SelectedPiePieceFromDoughnut',"OD");
				break;

				}
				
			}else{
				//NOT PRESENT DAY
				switch(selectedItem.row) {
				case 0:
				sessionStorage.setItem('SelectedPiePieceFromDoughnut',"P");
				break;
				case 1:
				sessionStorage.setItem('SelectedPiePieceFromDoughnut',"A,NA");
				break;
				case 2:
				sessionStorage.setItem('SelectedPiePieceFromDoughnut',"L");
				break;
				case 3:
				sessionStorage.setItem('SelectedPiePieceFromDoughnut',"OD");
				break;
				case 4:
				sessionStorage.setItem('SelectedPiePieceFromDoughnut',"W");
				break;
				case 5:
				sessionStorage.setItem('SelectedPiePieceFromDoughnut',"H");
				break;
				case 6:
				sessionStorage.setItem('SelectedPiePieceFromDoughnut',"NA");
				break;
				case 7:
				sessionStorage.setItem('SelectedPiePieceFromDoughnut',"OTHERS");
				break;
				}
			}
			//$ionicHistory.clearCache().then(function(){ $state.go('app.myTeamDetail') })
			//alert(sessionStorage.getItem('SelectedPiePieceFromDoughnut'));
            $state.go('app.myTeamDetail')
			return;
        }
		
        if (document.getElementById('donutchart')) {
            var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
            google.visualization.events.addListener(chart, 'select', fetchReporteeOnload);
            chart.draw(data, options);
        }
        $(window).resize(function () {
            if (document.getElementById('donutchart')) {
                var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
                google.visualization.events.addListener(chart, 'select', fetchReporteeOnload);
                chart.draw(data, options);
            }
        });
        $ionicLoading.hide()
        if (gb_processTimeRec == "true"){
            console.log("draw chart end "+ $filter('date')(new Date(), 'hh:mm:ss'))
        }
        
    }

    $scope.CheckDrawChart = function ()
    {
        if ($scope.attendanceDetail.LeaveCount == 0 && $scope.attendanceDetail.ODCount == 0 && $scope.attendanceDetail.PresentCount == 0 && $scope.attendanceDetail.AbsentCount == 0 && $scope.attendanceDetail.WeeklyOffCount == 0 && $scope.attendanceDetail.HolidayCount == 0 && $scope.attendanceDetail.NACount == 0 && $scope.attendanceDetail.OthersCount == 0)
        {
            drawChart(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
            $scope.donatChartNoData = true;
            //$ionicLoading.hide();
        } else
        {
            $scope.totalNoOfEmployees = parseInt($scope.attendanceDetail.PresentCount) + parseInt($scope.attendanceDetail.AbsentCount) + parseInt($scope.attendanceDetail.LeaveCount) + parseInt($scope.attendanceDetail.ODCount) + parseInt($scope.attendanceDetail.WeeklyOffCount) + parseInt($scope.attendanceDetail.HolidayCount) + parseInt($scope.attendanceDetail.NACount) + parseInt($scope.attendanceDetail.OthersCount);
            sessionStorage.setItem('totalNoOfEmployees',  $scope.totalNoOfEmployees);
            drawChart($scope.attendanceDetail.PresentCount, $scope.attendanceDetail.AbsentCount, $scope.attendanceDetail.LeaveCount, $scope.attendanceDetail.ODCount, $scope.attendanceDetail.WeeklyOffCount, $scope.attendanceDetail.HolidayCount, $scope.attendanceDetail.NACount, $scope.attendanceDetail.OthersCount);
        }
    }

    $scope.getDonutData = function () {
		
        loginCommService.getDoNutChartCount($scope.resultObj, function () {
            $scope.attendanceDetail.PresentCount = sessionStorage.getItem('PresentCount');
            $scope.attendanceDetail.AbsentCount = sessionStorage.getItem('AbsentCount');
            $scope.attendanceDetail.LeaveCount = sessionStorage.getItem('LeaveCount');
            $scope.attendanceDetail.ODCount = sessionStorage.getItem('ODCount');
            $scope.attendanceDetail.WeeklyOffCount = sessionStorage.getItem('WeeklyOffCount');
            $scope.attendanceDetail.HolidayCount = sessionStorage.getItem('HolidayCount');
            $scope.attendanceDetail.NACount = sessionStorage.getItem('NACount');
            $scope.attendanceDetail.OthersCount = sessionStorage.getItem('OthersCount');
            $scope.CheckDrawChart()
        }, function (status) {
            showAlert("Fail", "Try again");
            $ionicLoading.hide();
        })
    }

    $scope.onLoadReporteeCheck = function () {
        //$ionicLoading.show();
        //alert("d3 " + new Date())
        $scope.viewRequisitionApprovalService = new viewRequisitionApprovalService();
        $scope.viewRequisitionApprovalService.$save(function (data) {
			//alert("d4 " + new Date())
            if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				showAlert("Sometihng went wrong fetching request counts.")
				handleClientResponse(data.clientResponseMsg,"viewRequisitionApprovalService")
				$ionicLoading.hide();
				return;
			}		

            if (sessionStorage.getItem('IsShiftChangeAccessible') == 'true')
            {
                $scope.shiftChangeInProcess = data.listShiftObj.inProcess
                $scope.shiftChangeInProcessApproval = data.approvalShiftObj.inProcess
            } else
            {
                $scope.shiftChangeInProcess = '0';
                $scope.shiftChangeInProcessApproval = '0';
            }
            if (sessionStorage.getItem('IsLeaveAccessible') == 'true')
            {
                $scope.approvalLeave = data.approvalLeave.inProcess;
                $scope.leaveInprocessCount = data.leaveApllication.totalInProcess
            } else
            {
                $scope.approvalLeave = '0';
                $scope.leaveInprocessCount = '0';
            }
            if (sessionStorage.getItem('IsODAccessible') == 'true')
            {
                $scope.approvalOdApplication = data.approvalOdApplication.inProcess;
                $scope.odprocessInprocess = data.odApplication.inProcess
            } else
            {
                $scope.approvalOdApplication = '0';
                $scope.odprocessInprocess = '0';
            }
            if (sessionStorage.getItem('IsRegularizationAccessible') == 'true')
            {
                $scope.approvalAttendanceApplication = data.approvalAttendanceApplication.inProcess;
                $scope.attendanceInprocessCount = data.attendanceRegularization.inProcess
            } else
            {
                $scope.approvalAttendanceApplication = '0';
                $scope.attendanceInprocessCount = '0';
            }
			if (sessionStorage.getItem('IsShiftChangeAccessible') == 'true')
            {
                $scope.shiftChangeInProcess = data.listShiftObj.inProcess
                $scope.shiftChangeInProcessApproval = data.approvalShiftObj.inProcess
            } else
            {
                $scope.shiftChangeInProcess = '0';
                $scope.shiftChangeInProcessApproval = '0';
            }
			$scope.totalInProcess = parseInt($scope.approvalOdApplication) + parseInt($scope.shiftChangeInProcess) + parseInt($scope.approvalAttendanceApplication) + parseInt($scope.approvalLeave);
            $scope.totalApproval = parseInt($scope.attendanceInprocessCount) + parseInt($scope.shiftChangeInProcessApproval) + parseInt($scope.leaveInprocessCount) + parseInt($scope.odprocessInprocess);
			
			//////// new modules
			if (getMyHrapiVersionNumber() >= 18){
				if (sessionStorage.getItem('IsTravelAccessible') == 'true')
				{
					$scope.travelInInProcess = data.listTravel.inProcess
					$scope.travelInProcessApproval = data.approvalTravel.inProcess
				} else{
				
					$scope.travelInInProcess = '0';
					$scope.travelInProcessApproval = '0';
				}
				if (sessionStorage.getItem('IsClaimAccessible') == 'true')
				{
					$scope.travelClaimInProcess = data.listTravelClaim.inProcess
					$scope.travelClaimInProcessApproval = data.approvalTravelClaim.inProcess
				} else
				{
					$scope.travelClaimInProcess = '0';
					$scope.travelClaimInProcessApproval = '0';
				}
				//expense claim
				if (sessionStorage.getItem('IsExpenseClaimAccessible') == 'true')
				{
					$scope.ctcInProcess = data.listClaimCTC.inProcess
					$scope.ctcInProcessApproval = data.approvalClaimCTC.inProcess
					
					$scope.nonCtcInProcess = data.listClaimNONCTC.inProcess
					$scope.nonCtcInProcessApproval = data.approvalClaimNONCTC.inProcess
					
					$scope.ltaInProcess = data.listClaimLTA.inProcess
					$scope.ltaInProcessApproval = data.approvalClaimLTA.inProcess
					
				} else
				{
					$scope.ctcInProcess = '0';
					$scope.ctcInProcessApproval = '0';
					
					$scope.nonCtcInProcess = '0';
					$scope.nonCtcInProcessApproval = '0';
					
					$scope.ltaInProcess = '0';
					$scope.ltaInProcessApproval = '0';
				}

            $scope.totalInProcess = parseInt($scope.approvalOdApplication) + parseInt($scope.shiftChangeInProcess) + parseInt($scope.approvalAttendanceApplication) + parseInt($scope.approvalLeave);
			$scope.totalInProcess  = parseInt($scope.totalInProcess) + parseInt($scope.travelInInProcess) + parseInt($scope.travelClaimInProcess) + parseInt($scope.ctcInProcess)+ parseInt($scope.nonCtcInProcess) + parseInt($scope.ltaInProcess)
			
            $scope.totalApproval = parseInt($scope.attendanceInprocessCount) + parseInt($scope.shiftChangeInProcessApproval) + parseInt($scope.leaveInprocessCount) + parseInt($scope.odprocessInprocess);
			$scope.totalApproval = parseInt($scope.totalApproval)  + parseInt($scope.travelInProcessApproval ) + parseInt($scope.travelClaimInProcessApproval) + parseInt($scope.ctcInProcessApproval) + parseInt($scope.nonCtcInProcessApproval) + parseInt($scope.ltaInProcessApproval) 
			}
			
			if (getMyHrapiVersionNumber() >= 30){
				$scope.transaInprocess = parseInt(data.listTransaction.inProcess)
                $scope.transaInprocessApproval = parseInt(data.approvaTransaction.inProcess)
                $rootScope.gIntVacancyRequestCount = parseInt(data.approvalTravelClaim.inProcess)
                
            }else{
				$scope.transaInprocess = 0
                $scope.transaInprocessApproval = 0
                $rootScope.gIntVacancyRequestCount = 0

            }

            $scope.totalInProcess = $scope.totalInProcess + parseInt($scope.transaInprocess)+ $rootScope.gIntVacancyRequestCount
            $scope.totalApproval = $scope.totalApproval + parseInt($scope.transaInprocessApproval)

			$rootScope.totalRequistionCountForMenu = $scope.totalApproval 		
            $rootScope.totalApprovalCountForMenu = $scope.totalInProcess 
            $rootScope.totalRequestCount = $rootScope.totalApprovalCountForMenu
            $rootScope.totalRequistionCountForMenu = $rootScope.totalRequistionCountForMenu
			
            
            //alert($rootScope.totalRequistionCountForMenu)
			//alert($rootScope.totalApprovalCountForMenu)
            
			// $scope.getDonutData()
			// $scope.getDataForDayStrip(new Date())
			// $scope.showTodaysClockInOutData(new Date())
			
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data, "app.home.dashboard");
        });
    }
	
	
	  
	

    $scope.getReporteeOnload = function () {
        //$state.go('app.teamCalendar')
    };

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

    $scope.myApprovalRegularization = function () {
        $scope.redirectTomyApprovalRegularization.check = "Regularization";
        getSetService.set($scope.redirectTomyApprovalRegularization)
        $state.go('app.MyApprovals')
        
    }

    $scope.myApprovalLeave = function () {
        $scope.redirectTomyApprovalLeave.check = "Leave";
        getSetService.set($scope.redirectTomyApprovalLeave)
        $state.go('app.MyApprovals')
    }

    $scope.myApprovalOD = function () {
        $scope.redirectTomyApprovalOD.check = "OD";
        getSetService.set($scope.redirectTomyApprovalOD)
        $state.go('app.MyApprovals')
    }

    $scope.redirectmyApprovalShift = function () {
        $scope.redirectTomyApprovalShift.check = "ShiftChange";
        getSetService.set($scope.redirectTomyApprovalShift)
        $state.go('app.MyApprovals')
    }

    $scope.myReqRegularization = function () {
        $scope.redirectToRegularization.check = "Regularization";
        getSetService.set($scope.redirectToRegularization)
        $state.go('app.RequestList')
    }

    $scope.myReqLeave = function () {
        $scope.redirectToLeave.check = "Leave";
        getSetService.set($scope.redirectToLeave)
        $state.go('app.RequestList')
    }

    $scope.myReqOD = function () {
        $scope.redirectToOD.check = "OD";
        getSetService.set($scope.redirectToOD)
        $state.go('app.RequestList')
    }

    $scope.closeOverLay = function () {
		$("#ol_help").hide();		
    }

	
	
    $scope.redirectToShiftReq = function () {
        $scope.redirectToShift.check = "ShiftChange";
        getSetService.set($scope.redirectToShift)
        //$state.go('app.RequestList')
        $state.go('app.requestMenu')
    }
	
	$scope.getDataForDayStrip = function(dt){
		var val = {}
		val.year =   dt.getFullYear()
		val.month =   dt.getMonth()
		val.displayDate = dt.getDate()
		
		val.check = '0'
		val.manualCall = false
		val.empId = sessionStorage.getItem("empId")
		
		  if (val.check == '0') {
            $scope.showWhenDateView = true;
            $ionicLoading.show();
            $scope.getCalendarAttTypeService = new getCalendarAttTypeService();
            $scope.getCalendarAttTypeService.$save(val, function (success) {
				if (!(success.clientResponseMsg=="OK")){
						console.log(success.clientResponseMsg)
						handleClientResponse(success.clientResponseMsg,"getCalendarAttTypeService")
				}	
			
                $scope.attendanceTypeCount = success.countMap;
                $scope.attendanceTypeColour = success.colourMap;
                $scope.attendanceTypeDWColour = success.attendancTypeMap;
                if (success.traveDatelOList){
                   $scope.traveDatelOList = success.traveDatelOList;
                    //alert($scope.traveDatelOList.length)
                }
                
	
                
                $scope.listOfTitle = []
				$scope.description={}
                for (var x in success.descMap) {     // here x gets key
                    var obj = {};
                    obj.Date = x;
                    obj.AttDesc = "";
					//null handled 
					if (success.descMap[x]==null){
						continue;
					}
					var descArray = success.descMap[x].split(/\n/g);
                    for(var i=0;i<descArray.length;i++)
                    {
                        if(obj.AttDesc=="")
                        {
                            obj.AttDesc=descArray[i] ;
                         }
                         else{
                             if(descArray[i] && descArray[i]!=" " &&  descArray[i]!=",")
                             {
                                descArray[i] =  descArray[i].replace(/^,|,$/g, '');
                                obj.AttDesc= obj.AttDesc + ","+ descArray[i] ;

                             }
                           
                         }
                    }
					obj.AttDesc = obj.AttDesc.replace(/^,|,$/g, '');
					//remove last spaces
					obj.AttDesc = obj.AttDesc.trim();
					if (obj.AttDesc.substring(obj.AttDesc.length - 1 ,obj.AttDesc.length)==","){
						obj.AttDesc = obj.AttDesc.substring(0, obj.AttDesc.length-1)
					}	
					
					if (obj.AttDesc.substring(obj.AttDesc.length - 2 ,obj.AttDesc.length)==", "){
						obj.AttDesc = obj.AttDesc.substring(0, obj.AttDesc.length-2)
					}	
					if (obj.AttDesc.substring(obj.AttDesc.length - 3 ,obj.AttDesc.length)==",  "){
						obj.AttDesc = obj.AttDesc.substring(0, obj.AttDesc.length-3)
					}						
                    $scope.listOfTitle.push(obj);					
                    
                }
			
				// var keys = Object.keys(success.descMap);
                var lastElement = ($scope.listOfTitle.length == 0) ? 0 : $scope.listOfTitle[$scope.listOfTitle.length - 1].Date;
                var lastIndex = $scope.listOfTitle.length - 1;
                var daysInMonth = 32 - new Date(val.year, val.month, 32).getDate();
                if (daysInMonth > lastElement) {
                    for (var i = ++lastElement; i <= daysInMonth; i++) {
                        var dateRecord = {Date: '', AttDesc: ''};
                        dateRecord.Date = i;
                        $scope.listOfTitle.splice(++lastIndex, 0, dateRecord);
                    }
                }
                if (Object.keys(success.descMap).length != 0) {
                    for (var i = 1; i < lastElement; i++) {
                        if ($scope.listOfTitle[i - 1].Date != i) {
                            var obj = {Date: '', AttDesc: ''};
                            obj.Date = i;
                            $scope.listOfTitle.splice(i - 1, 0, obj);
                        }
                    }
                }
                
                if(new Date().getMonth() == val.month && $scope.listOfTitle[new Date().getDate()-1].AttDesc == '' && $scope.attendanceTypeColour[new Date().getDate()-1] =="#D7F187" )
                {
                    $scope.attendanceTypeColour[new Date().getDate()-1] = "#ffffff";
                }
                $scope.showDescription = true
                if (val.displayDate) {
                    $scope.showDescription = true;
                    $scope.day = val.displayDate;
					$scope.userSelectedDate = val.displayDate+"/"+(parseInt(val.month) + 1)+"/"+val.year
                    $scope.description.AttDesc = $scope.listOfTitle[val.displayDate - 1].AttDesc == '' ? 'No Data' : $scope.listOfTitle[val.displayDate - 1].AttDesc;
					
					

                } else {                                    // at the time of
                    if ($scope.description.AttDesc == '')
                    {
                        $scope.description.AttDesc = 'No Data';
                    } else
                    {
                        $scope.description.AttDesc = $scope.listOfTitle[0].AttDesc;
                    }
                }
				
				if ($scope.description.AttDesc.substring($scope.description.AttDesc.length - 1 ,$scope.description.AttDesc.length)==","){
						$scope.description.AttDesc = $scope.description.AttDesc.substring(0, $scope.description.AttDesc.length-1)
					}
				if ($scope.description.AttDesc.substring($scope.description.AttDesc.length - 2 ,$scope.description.AttDesc.length)==", " ){
						$scope.description.AttDesc = $scope.description.AttDesc.substring(0, $scope.description.AttDesc.length-2)
					}
				
            }, function (data) {
                autoRetryCounter = 0
                $ionicLoading.hide()
                commonService.getErrorMessage(data, "app.homeDashboard");
            });
        }
	}
	
	
	
	
	

	$scope.showTodaysClockInOutData = function(dt){
		var val = {}
		
		var isTodaysData = false
		
		val.year =   dt.getFullYear()
		val.month =   dt.getMonth()
		val.displayDate = dt.getDate()
		
		
		var todayDate = new Date();
		 if (val.year == todayDate.getFullYear() &&
			 val.month == todayDate.getMonth() &&
			 val.displayDate == todayDate.getDate())
			 {
				 isTodaysData = true
			 }
		
		
		val.check = '0'
		val.manualCall = false
		val.empId = sessionStorage.getItem("empId")
		
		$ionicLoading.show()
		$scope.nothing = "";
		//$scope.getClockInOutData = new getClockInOutData();
		//$scope.getClockInOutData.$save($scope.nothing,function (success) {
		$scope.getPunchTimingsForEmp = new getPunchTimingsForEmp();
		$scope.getPunchTimingsForEmp.$save(val,function (success) {

		//$ionicLoading.hide()
		if (!(success.clientResponseMsg=="OK")){
				console.log(success.clientResponseMsg)
				handleClientResponse(success.clientResponseMsg,"getClockInOutData")
		}

		$scope.responseList = []
		$scope.listOfClockInOut = []

            if (success.listOfClockInOut.length > 0)
            {
				$scope.todaysRecordCount = success.listOfClockInOut.length

				//for buttons
				$scope.todaysRecordCount = 0;
				for(var abc=0;abc<success.listOfClockInOut.length;abc++){
					if (success.listOfClockInOut[abc].capturingMode != "OD"){
						$scope.todaysRecordCount++
					}
                    if ($scope.selfieInPunchesFeature =="true"){
                        success.listOfClockInOut[abc].selfieSrc = baseURL + "/api/attendance/missPunch/viewPhoto.spr?apdAppId="+success.listOfClockInOut[abc].apdAppId
                    }
                    
				}

				if ($scope.todaysRecordCount % 2 ==  0) {
                //$scope.hideCheckIn = '1';
					//document.getElementById("divOut").innerHTML  ="Clock In"
				}else{
                //$scope.hideCheckIn = '0';
				//document.getElementById("divOut").innerHTML ="Clock Out"
				}
				/////////////////

                $scope.responseList = success.listOfClockInOut
//////////
				$scope.displayLegentPending = 'false'
			for (var i = 0; i < $scope.responseList.length; i++) {
				
					if ($scope.responseList[i].inTimeHourStr.length == 1){
						$scope.responseList[i].inTimeHourStr = '0' + $scope.responseList[i].inTimeHourStr
					}
					if ($scope.responseList[i].inTimeMinStr.length == 1){
						$scope.responseList[i].inTimeMinStr = '0' + $scope.responseList[i].inTimeMinStr
					}
					
					if ($scope.responseList[i].fenceType == "OUT" && isTodaysData == true &&  $scope.ifOutOfFencePunchValidLocalVar=='N'){
						$scope.responseList[i].inTimeMinStr =  $scope.responseList[i].inTimeMinStr + "(P)"
						$scope.displayLegentPending = 'true'
						
					}
					
				
            }
            var noOfMobilePunches = 0
			for (var i = 0; i < $scope.responseList.length; i++) {
				
					if ($scope.responseList[i].capturingMode=="OD" ||
					    $scope.responseList[i].attDate != $filter('date')(dt, 'dd/MM/yyyy')){
						//dont need to include in new list
					}else{
						$scope.listOfClockInOut[$scope.listOfClockInOut.length] = $scope.responseList[i]
                        if (GeoTrackingEnabledForUser == "true" && GeoTrackingFeatureEnabledForClient =="true"){
                            if ($scope.listOfClockInOut[$scope.listOfClockInOut.length - 1].source == "MOBILE"){
                                noOfMobilePunches++;
                            }
                        }
    
					}				
            }
			
            if (GeoTrackingEnabledForUser == "true" && GeoTrackingFeatureEnabledForClient =="true"){
                if(noOfMobilePunches % 2 == 0) {
                    gstr_odd_even_punches = "EVEN"
                     makeGeoTrackingLocCaptureON_OFF("OFF")
                }else{
                    gstr_odd_even_punches = "ODD"
                     makeGeoTrackingLocCaptureON_OFF("ON")   
                     $timeout(function () {	
                        if (GeoTrackingEnabledForUser == "true" && GeoTrackingFeatureEnabledForClient =="true"){
                           // alert("getting location")
                            getManualLocation()
                        }
                        
                        },1000)
                    
            
                }
             }

             
			if ($scope.listOfClockInOut.length==0){
				
				//$("#todaysClockInOutDataDiv").hide();
				//document.getElementById("todayText").style.dispay="none"
			
			}
			else{
				//$("#todaysClockInOutDataDiv").show();
				//document.getElementById("todayText").style.dispay="inline-block"
			
			}


//////////
				if (!$scope.$$phase)
				$scope.$apply()
            }
            // $timeout(function () {
			// 	$ionicLoading.hide()
			// 	},1200)
            //alert("d5 " + new Date())
		
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
			$("#todaysClockInOutDataDiv").hide();
			document.getElementById("todayText").style.dispay="none"
            commonService.getErrorMessage(data);
        })
	}


    //onerror="this.style.display='none'" 
	
})
