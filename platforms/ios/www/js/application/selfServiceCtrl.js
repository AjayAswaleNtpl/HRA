/*
 1.This controller is used to show the calendar view.
 2.One can apply leave,attendance-regularisation,shift and Od by long-pressing particular date.
 3.Count for working,present,absent etc are shown.
 */


mainModule.factory("getCalendarAttTypeService", function ($resource) {
    return $resource((baseURL + '/api/SelfService/getPresentationList.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("getPunchTimings", function ($resource) {
    return $resource((baseURL + '/api/signin/clockInOutDataForDateRange.spr'), {}, 
	{'save': {method: 'POST', timeout: 60000,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
	}}, {});
});
mainModule.factory("getReporteeEmployeeDirectoryList", function ($resource) {
    return $resource((baseURL + '/api/homeDashboard/getReporteeEmployeeDirectoryList.spr'),
	 {}, {'save': {method: 'POST', timeout: 60000,
	 headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
	}}, {});
});
mainModule.factory("getPunchTimingsForEmp", function ($resource) {
    return $resource((baseURL + '/api/signin/clockInOutDataForDateRangeFormEmp.spr'), {},
	 {'save': {method: 'POST', timeout: 60000,
	 headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("viewRequisitionApprovalService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/attendanceReportApi/viewRequisitionApproval.spr'), {}, 
		{'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
    }]);

mainModule.controller("selfServiceCtrl", function ($scope, $rootScope, $state, $ionicLoading, commonService, $filter, getCalendarAttTypeService, homeService,
$anchorScroll,$location,$window,getPunchTimings,$timeout,homeService,getReporteeEmployeeDirectoryList,$rootScope,
getPunchTimingsForEmp ,viewRequisitionApprovalService) {
	$rootScope.navHistoryPrevPage="selfservices"
	$rootScope.navHistoryCurrPage="selfservices"
	$rootScope.lastPageBeforeMenu="selfservices"
    
    $timeout(function () {
		document.getElementById("jwtt").value = jwtByHRAPI
	  },1000)

	//saveGeoTrackingLocationDirect();
      //  return;

	homeService.updateInboxEmailList("", function () {}, function (data) {})
	$scope.showOverlayHint = localStorage.getItem("showOverlayHint")	
	$scope.myEmpId = sessionStorage.getItem("empId")
	$scope.companyId = 	sessionStorage.getItem("companyId")
	document.getElementById("companyId").value = $scope.companyId
		
	if ($rootScope.app_product_name =="QUBE"){
		//if product is qube
		$scope.showEmployeeDropDown = 'false'
	}
	else{
		if ($rootScope.myAppVersion >= 13 && $rootScope.myAppVersion < 24){
			if (sessionStorage.getItem('isGroupMasterReportee') == 'true'){
				$scope.showEmployeeDropDown = 'true'
			}else{
				$scope.showEmployeeDropDown = 'false'
			}
		}else{
			$scope.showEmployeeDropDown = 'false'
		}
		if ($rootScope.myAppVersion>=24){
			if (sessionStorage.getItem('isGroupMasterReportee') == 'true'){
				$scope.showEmployeeSearchPopupFeature = 'true'
				
			}else{
				$scope.showEmployeeSearchPopupFeature = 'false'
			}
		}else{
			$scope.showEmployeeSearchPopupFeature = 'false'
		}
	}
	if ($rootScope.myAppVersion >= 25){
		$scope.selfieInPunchesFeature = 'true'
	}else{
		$scope.selfieInPunchesFeature = 'false'
	}
	
	

	$scope.selectedEmpPicSrc = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + sessionStorage.getItem("empId") + '';
	
	var dtStartTyping = new Date()
	
	$scope.selectSelfInDropDown = 'false'
	


	$timeout(function () {

		if (GeoTrackingEnabledForUser == "true" && GeoTrackingFeatureEnabledForClient =="true"){
			enableGeoTrackingInBackground()
		}
		
	  },1000)


	
	var d = new Date();
		$scope.clockInFloatingButton = function () {
        homeService.getResult("SIGNIN", function (length, data) {
            if (length > 0) {
                $scope.hideCheckIn = '1';
            } else {
                $scope.hideCheckIn = '0';
            }
        }, function (data) {
            //$ionicLoading.hide();
        })
    }
	$scope.clockInFloatingButton()	
	$scope.IsClockInAccessible = sessionStorage.getItem('IsClockInAccessible');
	
	
	/////// for card space
	sessionStorage.setItem('selectedMonth', null);
	$scope.attendanceDetail = {};
	$scope.selectedValues = {}
	$scope.modelSelEmpId = ""
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
	
    sessionStorage.setItem('selectedMonth', new Date().getMonth())
    sessionStorage.setItem('isManager', 1);
    $scope.IsLeaveAccessible = sessionStorage.getItem('IsLeaveAccessible');
    //$scope.IsClockInAccessible = sessionStorage.getItem('IsClockInAccessible');
    $scope.listOfTitle = []
    $scope.calenderHideandShow = false
    $scope.calendarDataObj = {};
    $rootScope.setPartialDirective = false
    $scope.attendenceManagement = ["Present", "Absent", "Leave", "Holiday", "OD", "Weekly Off","Att. Reg.", "WFH"];
    $scope.attendenceType = ["Working", "Present", "Holiday", "WeeklyOff", "Leaves", "Absent"];
    $scope.timeFormat = "days";
    $scope.selectedCalDate = "";
    $scope.ReporteeList = [];
    $scope.description = {};
    $scope.showWhenDateView=false;
	
	$scope.selectedValues = {}
	//$scope.selectedValues.selectedEmp = "-- Self --"
	//$scope.selectedValues.selectedEmp = sessionStorage.getItem('empName') + " " + sessionStorage.getItem('empCode')	
	
	$scope.empDdChangeEnable = "YES"
	
	//for loading counts for menu of requistion and approval
	
	
    $scope.clockInButton = function () {
        homeService.getResult("SIGNIN", function (length, data) {
            if (length > 0) {
                $scope.hideCheckIn = '1';
            } else {
                $scope.hideCheckIn = '0';
            }
        }, function (data) {
            //$ionicLoading.hide();
        })
    }
	

	$scope.checkIfSelectedDateHasTravel = function(dayNumberPart){
		if ($scope.traveDatelOList)	{
		for(var j=0;j<$scope.traveDatelOList.length;j++){
			var d = new Date($scope.traveDatelOList[j][0])
			if (d.getDate() == dayNumberPart){
				return "true";
			}	
			}
		}
			return "false" ;
	}
	


	$scope.getReporteeList = function(){
		
		$ionicLoading.show();
			$scope.tmp = {}
            $scope.getReporteeEmployeeDirectoryList = new getReporteeEmployeeDirectoryList();
            $scope.getReporteeEmployeeDirectoryList.$save($scope.tmp, function (success) {
				if (!(success.clientResponseMsg=="OK")){
						console.log(success.clientResponseMsg)
						handleClientResponse(success.clientResponseMsg,"getReporteeEmployeeDirectoryList")
				}	
				
				if (success.empList === undefined || success.empList== null){
					$scope.showEmployeeDropDown = "false"
					
					$scope.empList = []
					return;
				}else{
					
					$scope.empList = success.empList;
					
					//alert($scope.myEmpId)
					var mempid = $scope.myEmpId
					//$scope.empList.unshift({"empId": "-1","name":"-- Self --","empCode":""})	
					
					$scope.fullEmpList=[]
					$scope.empList.forEach((v, i) => {
						const val = (typeof v === 'object') ? Object.assign({}, v) : v;
						$scope.fullEmpList.push(val);
					});
					
					for (var k=0;k<$scope.empList.length;k++){
						if ($scope.empList[k].name == sessionStorage.getItem('empName')){
							$scope.myNameIndexInDropdown = k;
							break;
						}
					}
					
				}
				
			}, function (data) {
                autoRetryCounter = 0
                $ionicLoading.hide()
                commonService.getErrorMessage(data, "app.homeDashboard");
            });
	}
	
	
	$scope.showMyCalendar = function(){
		if ($scope.showEmployeeDropDown =='false'){
			return
		}
			$ionicLoading.show()
			document.getElementById("searchEmpTxt").value=""
			$scope.selectSelfInDropDown = 'true'
			$scope.searchEmpChange()
			
			
	}

	$scope.showMyCalendarWithPopupFeature = function(){
		
		$ionicLoading.show()
		document.getElementById("selectedEmpIdFromPopUp").value=$scope.myEmpId	
		document.getElementById("search_emp").value=""
		$scope.empChangedByPopUpSelection()
}

	
	$scope.searchEmpChange = function(){
		if ($scope.showEmployeeDropDown =='false'){
				return
		}
		//apply time logic
		$scope.nowTimeEmpChange = new Date()
		$timeout(function () {
			$scope.empDdChangeEnable = "NO"
			if ((new Date() - $scope.nowTimeEmpChange)/1000 > 0.8){
				
				var searchTxt  =  document.getElementById("searchEmpTxt").value.trim()
			
				if (!$scope.$$phase)
                    $scope.$apply()
			
				if (searchTxt==""){
				//$scope.empList =null
				$scope.empList = []
				
				//if ($scope.fullEmpList	=== undefined) return
				
				$scope.fullEmpList.forEach((v, i) => {
					const val = (typeof v === 'object') ? Object.assign({}, v) : v;
					$scope.empList.push(val);
				});
		
				sel = document.getElementById("reporteeList")
				
				$scope.empList.unshift({"empId": "-1","name":"Select from the list","empCode":" Complete "})	
				if (!$scope.$$phase)
				$scope.$apply()
				//if (sel.options[0].innerHTML.indexOf(" Complete ") > -1){
				//		sel.options[0].remove() // to remove complete walla option
				//}
				if (sel.options[0].innerHTML == ""){
						sel.options[0].remove() // to remove blank option
				}
				
				if(sel!=null && $scope.empList.length > 0 ){
					if (!$scope.$$phase)
					$scope.$apply()
					if ($scope.selectSelfInDropDown == 'true'){
								//alert("self")
								sel.options[$scope.myNameIndexInDropdown+1].selected = true
								$scope.selectedEmpPicSrc = sessionStorage.getItem('profilePhoto')
								$scope.empChanged()
					}else{
								sel.options[0].selected = true
					}
					$scope.selectSelfInDropDown = 'false'
				}	
					$ionicLoading.hide()

				
			}else{
				//filter list according to search text 
				
				$scope.empList = []
				
					$scope.fullEmpList.forEach((v, i) => {
						const val = (typeof v === 'object') ? Object.assign({}, v) : v;
						$scope.empList.push(val);
					});
				
					$scope.empList = $scope.empList.filter(obj => obj.name.toLowerCase().includes(searchTxt.toLowerCase()));
				
				//try with empCode if not found
				if ($scope.empList.length==0){
					
					$scope.empList = []
					
					$scope.fullEmpList.forEach((v, i) => {
						const val = (typeof v === 'object') ? Object.assign({}, v) : v;
						$scope.empList.push(val);
					});
					
					$scope.empList = $scope.empList.filter(function(obj){
						return obj.empCode.toLowerCase().includes(searchTxt.toLowerCase());
					})
				}
				
				if (!$scope.$$phase)
				$scope.$apply()
				sel = document.getElementById("reporteeList")
					$ionicLoading.show()
					$ionicLoading.hide()
					if(sel!=null && $scope.empList.length > 0 ){
						
						$scope.empList.unshift({"empId": "-1","name":"Select from the list","empCode":" Filtered "})	
						if (!$scope.$$phase)
						$scope.$apply()
						if (sel.options[0].innerHTML == ""){
							sel.options[0].remove() // to remove blank option
						}

						sel.options[0].selected = true
					
					}
					
					$ionicLoading.hide()
				
			}
			if(sel!=null && $scope.empList.length == 0 ){
				//alert("no data")
			}
		
			
			
			
			
			
			/*
			for (var i = 0;i<$scope.fullEmpList.length;i++){
				if ($scope.fullEmpList[i].name.indexOf(searchTxt) <>-1){
					$scope.empList.push($scope.fullEmpList[i])	
					return
				}
			}*/
			}else{
				//typing not over
			}
			$scope.empDdChangeEnable = "YES"
		}, 1000)
		
	}

	$ionicLoading.show()
	$scope.clockInButton();
	if ($scope.showEmployeeDropDown == 'true' ){
		$scope.getReporteeList();
	}
	$ionicLoading.show()
	
	if ($scope.showEmployeeDropDown == 'true'){
		$timeout(function () {
			$scope.showMyCalendar()
		}, 1500)
					
			$timeout(function () {
				$ionicLoading.hide(0)
			   }, 2500)
			   
	}
	
	if ($scope.showEmployeeSearchPopupFeature == 'true'){
		$timeout(function () {
			$scope.showMyCalendarWithPopupFeature()
		}, 1500)
					
			$timeout(function () {
				$ionicLoading.hide(0)
			   }, 2500)
			   
	}

    $scope.listView = function () {
        if ($scope.calenderHideandShow == true) {
            $rootScope.setPartialDirective = false
            $scope.calenderHideandShow = false
        } else {
            $scope.calenderHideandShow = true
            $rootScope.setPartialDirective = true
        }
    }

	
	$scope.empChanged = function(){

		if ($scope.empDdChangeEnable == "NO"){
			$scope.empDdChangeEnable = "YES"
			return;
		}
		$ionicLoading.show()
		sel = document.getElementById("reporteeList")
		if(sel!=null )
		{
			
			//alert($scope.empList[sel.selectedIndex ].name + " " + $scope.empList[sel.selectedIndex].empId
			//+"   " + $scope.empList[sel.selectedIndex].empCode)
			var val= {}
			//if (sel.options[sel.selectedIndex].text == "-- Self --"){
				
			//if (sel.selectedIndex].text ){
				//val.empId = $scope.myEmpId
			//}else{
				if ($scope.empList[sel.selectedIndex]=== undefined){
					return
				}else{
					val.empId = $scope.empList[sel.selectedIndex].empId
				}
			//}
			
			if (val.empId=="-1"){
				$ionicLoading.hide()
				//alert(val.empId)
				return
			}
			
			$scope.selectedEmpId=val.empId
			val.year =$scope.valSslectedYear  
			val.month =$scope.valSslectedMonth 
			val.displayDate = $scope.valSslectedDisplayDate 
			val.check = "0"
			val.manualCall = true
			$scope.getLeaveColours(val)
			$scope.showTodaysClockInOutData(val.displayDate,val.month,val.year)
			//enable disable calendar context menu
			if (val.empId == sessionStorage.getItem("empId")){
				
				$scope.selectedEmpPicSrc = sessionStorage.getItem('profilePhoto')
				sessionStorage.setItem('showCalendarContextMenu',"YES")
			
			}else{
				
				sessionStorage.setItem('showCalendarContextMenu',"NO")
				$scope.selectedEmpPicSrc = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + val.empId + '';
				
			}
			
			
			//alert($scope.selectedEmpPicSrc)
			$ionicLoading.hide()
		
		}
		
	}

	
    $scope.getLeaveColours = function (val) {
		if ($scope.selectedEmpId){
			val.empId = $scope.selectedEmpId
		}
		
		if ($rootScope.app_product_name=="HRAlign" &&  getMyHrapiVersionNumber() >=14 ){
			//alert(val.empId + " " + val.manualCall)
			if (val.manualCall == false){
				if ($scope.selectedEmpId){
					val.empId = $scope.selectedEmpId
					}
				}
			val.manualCall =false
			//alert(val.empId + " " + val.manualCall)
			}	
		
		$scope.valSslectedYear = val.year
		$scope.valSslectedMonth = val.month
		$scope.valSslectedDisplayDate = val.displayDate
        $scope.selectedCalDate = new Date(val.year, val.month, val.displayDate);
		//alert($scope.selectedCalDate)
        var tempFilteredSelectedCalDate = $scope.selectedCalDate
//        Locking period validation start
        $scope.filteredSelectedCalDate = $filter('date')(new Date(tempFilteredSelectedCalDate), 'yyyy/MM/dd');
        $scope.lockingPeriod = sessionStorage.getItem('lockingPeriod');
        $scope.todaysDate = new Date();
        $scope.lockingPeriodDate = $scope.todaysDate.setMonth($scope.todaysDate.getMonth() - $scope.lockingPeriod);
        $scope.filteredLockingDate = $filter('date')(new Date($scope.lockingPeriodDate), 'yyyy/MM/dd');
//        Locking period validation End
        $scope.clickedCalFlag = false;
		
		//alert(val.empId)
	
		
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
				 }

                $scope.calendarDataObj.attendanceTypeColour = success.colourMap;
                $scope.calendarDataObj.attendanceTypeDWColour = success.attendancTypeMap;
                $scope.listOfTitle = []
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
					
   				$scope.displayLeaveColours($scope.calendarDataObj);
				
				//adding punch timings
				if ($scope.setPartialDirective == true){
					var mnth 
					if (val.month<10 ) mnth = "0" + val.month
					else mnth = val.month
					$rootScope.punchDataAvlblAtMobile_yyyymm = val.year + mnth
					if ($rootScope.app_product_name=="HRAlign" &&  getMyHrapiVersionNumber() >=14 ){
						$scope.getPunchTimingsForMonthForEmp(val)
					}else{
						$scope.getPunchTimingsForMonth(val)
					}
					/*
					if ($rootScope.punchDataAvlblAtMobile_yyyymm==val.year + mnth){
						//dont call punch timing only display them
						$scope.displayPunchTimings("")
						$ionicLoading.hide()
					}else{
						$rootScope.punchDataAvlblAtMobile_yyyymm = val.year + mnth
						$scope.getPunchTimingsForMonth(val)
					}
					*/
				}else{
					$ionicLoading.hide()
				}
				
            }, function (data) {
                autoRetryCounter = 0
                $ionicLoading.hide()
                commonService.getErrorMessage(data, "app.homeDashboard");
            });
        }
        else if (val.check == '1') {
            $scope.showDescription = true;
            $scope.day = val.displayDate;
			$scope.userSelectedDate = val.displayDate+"/"+(parseInt(val.month) + 1)+"/"+val.year
            $scope.description.AttDesc = $scope.listOfTitle[val.displayDate - 1].AttDesc == '' ? 'No Data' : $scope.listOfTitle[val.displayDate - 1].AttDesc;
			if ( $scope.checkIfSelectedDateHasTravel($scope.day) =="true"){
				$scope.description.AttDesc += " (Travel)"
			}
			$scope.showTodaysClockInOutData(val.displayDate,val.month,val.year)
        }
        else if(val.check == '2'){
            $scope.showWhenDateView = false;
        }
        if ($scope.isLongPress == true) {
            $scope.openPopover($event);
            $ionicLoading.hide();
        }
		
    };

    $scope.setDirectiveFn = function (displayLeaveColours) {
        $ionicLoading.show();
        $scope.displayLeaveColours = displayLeaveColours;
    };

    $scope.openCheckIn = function () {
        $state.go('app.checkIn');
    }

    $scope.openRequisitions = function () {
        //$state.go('leaveApplication')
		$state.go('app.RequestListCombined')
    }
	
	
	
	$scope.displayPunchTimings = function(list){
				if (list=="") 
				{
					// we have to use old data that is available with us.
				}else{
					puchList= []
					punchList = list
				}
				for (var i = 0; i < punchList.length; i++) {
					if (punchList[i].inTimeHourStr.length == 1){
						punchList[i].inTimeHourStr = '0' + punchList[i].inTimeHourStr
					}
					if (punchList[i].inTimeMinStr.length == 1){
						punchList[i].inTimeMinStr = '0' + punchList[i].inTimeMinStr
					}

					
				}
					//////// ADDING PUNCH TIMES
					var punchSource
					
					punchList.sort(function(a,b) {return (a.attDate.substr(0, 2) + a.inTimeHourStr + a.inTimeMinStr  > b.attDate.substr(0, 2) + b.inTimeHourStr + b.inTimeMinStr) ? 1 : ((b.attDate.substr(0, 2) + b.inTimeHourStr + b.inTimeMinStr  > a.attDate.substr(0, 2) + a.inTimeHourStr + a.inTimeMinStr) ? -1 : 0);} );
					
							
						// arrange punch timing day wise.
						var ctr = 0
						for(var i=0;i < $scope.listOfTitle.length;i++){	
							$scope.listOfTitle[i].PunchTimings = "Punch Timings: "
							$scope.listOfTitle[i].PunchTimingsList = new Array(punchList.length);
							$scope.listOfTitle[i].PunchSelfieSrcList = new Array(punchList.length);

							$scope.listOfTitle[i].PunchTimingsList[0] = "Punch Timings: "
							ctr = ctr + 1
							var punchListDayCtr = 0
							for(var j=0;j < punchList.length;j++){
								
								dateOfMonth =	punchList[j].attDate.substr(0, 2);
								if (Number(dateOfMonth) == Number($scope.listOfTitle[i].Date)){
									punchListDayCtr++
									if (punchList[j].source=="WEB" && punchList[j].capturingMode !="OD"){
										punchSource="(D)  "
									}else if (punchList[j].source=="WEB" && punchList[j].capturingMode =="OD"){
										punchSource="(OD)  "
									}else if(punchList[j].source=="WEB" && punchList[j].capturingMode =="AR"){
										punchSource="(AR)  "
									}										
									if (punchList[j].source=="MOBILE") punchSource="(M)  "
									if (punchList[j].source=="Swipe Card") punchSource="(B)  "
									
									//$scope.listOfTitle[i].PunchTimings = $scope.listOfTitle[i].PunchTimings + 
									//punchList[j].inTimeHourStr + ":" + punchList[j].inTimeMinStr + punchSource;
									
									//below with address
									if (punchList[j].source=="MOBILE" && punchList[j].geoLocationAddress != ""){
										$scope.listOfTitle[i].PunchTimings = $scope.listOfTitle[i].PunchTimings + "\n" +
										punchList[j].inTimeHourStr + ":" + punchList[j].inTimeMinStr + punchSource +"["+ punchList[j].geoLocationAddress +"]\n";

										$scope.listOfTitle[i].PunchTimingsList[punchListDayCtr] = 
										punchList[j].inTimeHourStr + ":" + punchList[j].inTimeMinStr + punchSource +"["+ punchList[j].geoLocationAddress +"]\n";
										if ($scope.selfieInPunchesFeature == "true"){	
											$scope.listOfTitle[i].PunchSelfieSrcList[punchListDayCtr] = baseURL + "/api/attendance/missPunch/viewPhoto.spr?apdAppId="+ punchList[j].apdAppId
										}
										
									}else{
										$scope.listOfTitle[i].PunchTimings = $scope.listOfTitle[i].PunchTimings + "\n" +
										punchList[j].inTimeHourStr + ":" + punchList[j].inTimeMinStr + punchSource;

										$scope.listOfTitle[i].PunchTimingsList[punchListDayCtr] = 
										punchList[j].inTimeHourStr + ":" + punchList[j].inTimeMinStr + punchSource;
									}

									
									//selfie src
									

								}
							}
						}
					//alert("len " + $scope.listOfTitle.length)
					for(var i=0;i < $scope.listOfTitle.length;i++){
						if($scope.listOfTitle[i].PunchTimings == "Punch Timings: ")  $scope.listOfTitle[i].PunchTimings =''
						if($scope.listOfTitle[i].PunchTimingsList[1] === undefined)  $scope.listOfTitle[i].PunchTimingsList[0] =''
						
						}
						$ionicLoading.hide()
					////////////////////

					$timeout(function () {
						
					for(var i=0;i <= 30;i++){ //days of month
						for(var j=0;j <= 12;j++){
							if (document.getElementById("img"+j+i) != null  && 
							 	document.getElementById("img"+j+i).style.display != "none" && 
								 $scope.selfieInPunchesFeature == 'true' ){
								//image is there
							}else{
								//no selfie
									if (document.getElementById("punch"+j+i)){
									document.getElementById("punch"+j+i).style.width="100%";
									}
								}
						}
				}	
					},500)
					
					// adding legend at the end of list
					/*var obj = {};
					obj.AttDesc = "Legend:\nM: Mobile     D: Desktop     \nSC: SwipeCard     \nI: In     O: Out     T: Total";
					$scope.listOfTitle.push(obj);		
					*/
	}		
	
	
	$scope.closeOverLay = function () {
		$("#ol_help").hide();		
		$scope.showOverlayHint = localStorage.getItem("showOverlayHint")
		$rootScope.loggedInNew = "N"
		if ($rootScope.HomeDashBoard == true){
			 $state.go('app.home.dashboard');
		}

    }
	
	
	
	$scope.getPunchTimingsForMonth = function (val) {	
	

		$ionicLoading.show();
        $scope.getPunchTimings = new getPunchTimings();
		var befCallTime = new Date();
        $scope.getPunchTimings.$save(val,function (success) {
			if (!(success.clientResponseMsg=="OK")){
				console.log(success.clientResponseMsg)
				handleClientResponse(success.clientResponseMsg,"getPunchTimings")
			}	
			var stTime = new Date();
			
			$scope.listOfClockInOut = []
			//alert(success.listOfClockInOut.length)
			if (success.msg=="ERROR"){
				//
			}else{
				if (success.listOfClockInOut.length > 0){
					punchList = []
					punchList= success.listOfClockInOut
					$scope.displayPunchTimings(punchList)
				}else{
					$ionicLoading.hide()			
					if (!$scope.$$phase)
                    $scope.$apply()
					
				}
			}
			
			$ionicLoading.hide()			
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
			if (!$scope.$$phase)
            $scope.$apply()

        })
		
	}
	
	
$scope.getPunchTimingsForMonthForEmp = function (val) {	
	//alert("rrrr" + val.empId)
	//alert("ssss" + $scope.selectedEmpId)
	if ($scope.selectedEmpId){
		val.empId = $scope.selectedEmpId
	}
	
	
		$ionicLoading.show();
        $scope.getPunchTimingsForEmp = new getPunchTimingsForEmp();
		var befCallTime = new Date();
        $scope.getPunchTimingsForEmp.$save(val,function (success) {
			if (!(success.clientResponseMsg=="OK")){
				console.log(success.clientResponseMsg)
				handleClientResponse(success.clientResponseMsg,"getPunchTimings")
			}	
			var stTime = new Date();
			
			$scope.listOfClockInOut = []
			//alert(success.listOfClockInOut.length)
			if (success.msg=="ERROR"){
				//
			}else{
				if (success.listOfClockInOut.length > 0){
					punchList = []
					punchList= success.listOfClockInOut
					$scope.displayPunchTimings(punchList)
				}else{
					$ionicLoading.hide()			
					if (!$scope.$$phase)
                    $scope.$apply()
					
				}
			}
			
			$ionicLoading.hide()			
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
			if (!$scope.$$phase)
            $scope.$apply()

        })
		
	}	

	$scope.toggleShowHint = function(){
		
		var tmpSh = $scope.showOverlayHint
		if (tmpSh=="true"){
			 tmpSh="false" 
		}else{
			tmpSh ="true" 
		}
		
		localStorage.setItem("showOverlayHint",tmpSh) 
		
	}		
	
	
$scope.onLoadGetCounts = function () {
        $ionicLoading.show();
        $scope.viewRequisitionApprovalService = new viewRequisitionApprovalService();
        $scope.viewRequisitionApprovalService.$save(function (data) {
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

				if (getMyHrapiVersionNumber() >= 25){
					$scope.IsTransactionAccessible = sessionStorage.getItem('IsTransactionAccessible')
				  $scope.transactionRequests = data.approvaTransaction.inProcess
				}else{
				  $scope.IsTransactionAccessible = 'false'
				  $scope.transactionRequests = 0
				}

            $scope.totalInProcess = parseInt($scope.approvalOdApplication) + parseInt($scope.shiftChangeInProcess) + parseInt($scope.approvalAttendanceApplication) + parseInt($scope.approvalLeave);
			$scope.totalInProcess  = $scope.totalInProcess + parseInt($scope.travelInInProcess) + parseInt($scope.travelClaimInProcess) + parseInt($scope.ctcInProcess)+ parseInt($scope.nonCtcInProcess) + parseInt($scope.ltaInProcess)
			
            $scope.totalApproval = parseInt($scope.attendanceInprocessCount) + parseInt($scope.shiftChangeInProcessApproval) + parseInt($scope.leaveInprocessCount) + parseInt($scope.odprocessInprocess);
			$scope.totalApproval = $scope.totalApproval  + parseInt($scope.travelInProcessApproval ) + parseInt($scope.travelClaimInProcessApproval) + parseInt($scope.ctcInProcessApproval) + parseInt($scope.nonCtcInProcessApproval) + parseInt($scope.ltaInProcessApproval) 
			}
			
			$rootScope.totalRequistionCountForMenu = $scope.totalApproval + parseInt($scope.transactionRequests)
			$rootScope.totalApprovalCountForMenu = $scope.totalInProcess
			//alert($rootScope.totalRequistionCountForMenu)
			//alert($rootScope.totalApprovalCountForMenu)
			//for transactin count
			
			
           
			
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data, "app.home.dashboard");
        });
    }


	
	$scope.empChangedByPopUpSelection = function(){
		
		$ionicLoading.show()
			var val= {}
			
			if (!document.getElementById("selectedEmpIdFromPopUp").value){
				return
			}

			val.empId = document.getElementById("selectedEmpIdFromPopUp").value
			if (val.empId=="-1" || val.empId== ""){
				$ionicLoading.hide()
				return
			}
			
			$scope.selectedEmpId=val.empId
			$scope.selectedEmpPicSrc = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + val.empId + '';
			document.getElementById("popufeatureImag").src = $scope.selectedEmpPicSrc
			val.year =$scope.valSslectedYear  
			val.month =$scope.valSslectedMonth 
			val.displayDate = $scope.valSslectedDisplayDate 
			val.check = "0"
			val.manualCall = true
			$scope.getLeaveColours(val)
			$scope.showTodaysClockInOutData(val.displayDate,val.month,val.year)
			//enable disable calendar context menu
			if (val.empId == sessionStorage.getItem("empId")){
				$scope.selectedEmpPicSrc = sessionStorage.getItem('profilePhoto')
				document.getElementById("popufeatureImag").src = $scope.selectedEmpPicSrc
				sessionStorage.setItem('showCalendarContextMenu',"YES")
			
			}else{
				sessionStorage.setItem('showCalendarContextMenu',"NO")
				$scope.selectedEmpPicSrc = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + val.empId + '';
				document.getElementById("popufeatureImag").src = $scope.selectedEmpPicSrc
			}
			
			
			//alert($scope.selectedEmpPicSrc)
			$ionicLoading.hide()
	}

// 	$scope.$watch('modelSelEmpId', function(value) {
//         if(value)
//             {
// 			if(value!=""){

// 				}
//              }
            
        
        
// 		 });
		 
 	$scope.onLoadGetCounts()	

	 $scope.showTodaysClockInOutData = function(dd,mm,yyyy){

		var val = {}
		
		var isTodaysData = false
		
		/*val.year =   dt.getFullYear()
		val.month =   dt.getMonth()
		val.displayDate = dt.getDate()
		*/
		
		val.year =   yyyy
		val.month =   mm
		val.displayDate = dd

		var dtstr = (eval(mm) + 1)+"/"+dd+"/"+yyyy

		var dt = new Date(dtstr);

		
		
		var todayDate = new Date();
		 if (val.year == todayDate.getFullYear() &&
			 val.month == todayDate.getMonth() &&
			 val.displayDate == todayDate.getDate())
			 {
				 isTodaysData = true
			 }
		
		
		val.check = '0'
		val.manualCall = false
		if ($scope.selectedEmpId){
			val.empId = $scope.selectedEmpId
		}else{
			val.empId = sessionStorage.getItem("empId")
		}
		
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
				$ionicLoading.hide()
				return
		}

		$scope.responseList = []
		$scope.listOfClockInOutForTable = []

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
						$scope.listOfClockInOutForTable[$scope.listOfClockInOutForTable.length] = $scope.responseList[i]
						if (GeoTrackingEnabledForUser == "true" && GeoTrackingFeatureEnabledForClient =="true"){
							if ($scope.listOfClockInOutForTable[$scope.listOfClockInOutForTable.length - 1].source == "MOBILE"){
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
							//alert("getting location")
							getManualLocation()
						}
						
						},1000)					 

				}
			 }


			if ($scope.listOfClockInOutForTable.length==0){
				
				$("#todaysClockInOutDataDiv").hide();
				document.getElementById("todayText").style.dispay="none"
			
			}
			else{
				$("#todaysClockInOutDataDiv").show();
				document.getElementById("todayText").style.dispay="inline-block"
			
			}


//////////
				if (!$scope.$$phase)
				$scope.$apply()
            }
            // $timeout(function () {
			// 	$ionicLoading.hide()
			// 	},1200)
			$ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
			$("#todaysClockInOutDataDiv").hide();
			document.getElementById("todayText").style.dispay="none"
            commonService.getErrorMessage(data);
        })
	}



	var tdt = new Date()
	$scope.showTodaysClockInOutData(tdt.getDate(), tdt.getMonth(),tdt.getFullYear() )
 })


