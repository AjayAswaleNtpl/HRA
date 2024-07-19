/*
 1.This controller is used to view the Approved/Rejected list for Leave,Shift,Attendance,OD.
 2.Sent for cancellation requests are also Approved/Reject for Leave.
 3.Detailed view can be seen while opening modal by clicking on the list.
 */

mainModule.factory("viewLeaveApplicationService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/leaveApplication/viewLeaveApplication.spr'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("viewODApplicationService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/odApplication/getODApplication.spr'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("getYearListService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/odApplication/getYearList.spr'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);

mainModule.factory("cancelODRequestService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/odApplication/cancellationProcess.spr'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);

mainModule.factory("sendODRequestService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/odApplication/send.spr'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("detailsService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/leaveApplication/details.spr'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("viewMissPunchApplicationService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/attendance/missPunch/viewMissPunch.spr'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("viewShiftChangeApplicationService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/attendance/shiftChange/viewShiftChangeAcordingToStatus.spr'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("viewRequisitionApprovalService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/attendanceReportApi/viewRequisitionApproval.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
    }]);

mainModule.factory("sendForCancellation", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/attendance/missPunch/sendForCancellation.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
    }]);

	
	
mainModule.controller('RequestListCtrl', function ($scope,$rootScope, $filter, commonService, $state, getYearListService, $ionicPopup, viewODApplicationService, sendODRequestService, getSetService, $ionicLoading, $ionicModal, cancelODRequestService, viewLeaveApplicationService, detailsService, viewMissPunchApplicationService, 
viewShiftChangeApplicationService, viewRequisitionApprovalService,sendForCancellation) {

	$scope.greyArrowForNextMonth = true
    $scope.requesObjectForMonth = {};
    $scope.requesObjectForYear = {};
    $scope.requesObjectForMonth.month = ''
    $scope.requesObjectForYear.yearId = ''
    $scope.shiftChangeAppliList = [];
	$scope.repoteeShiftChangeVOList = [];
    $scope.createdDate = [];
    $scope.missPunchAppliList = [];
    $scope.searchObj = {}
    $scope.searchObj.searchQuery = '';
    $scope.searchObj.searchRegular = ''
    $scope.searchObj.searchOD = ''
    $scope.searchObj.searchShift = ''
    $scope.requesObject = {}
    $scope.requesObject1 = {};
    $scope.sendrequesObject = {}
	
	$scope.leaveListFetched = false
	$scope.odListFetched = false
	$scope.attListFetched = false
	$scope.scListFetched = false
	
	
	if  ($rootScope.app_product_name =="QUBE"){
		//if product is qube
		$scope.cancelAttReg = 'false'
		$scope.editOD = 'false'
	}
	else{
		if ($rootScope.myAppVersion>=15){
			$scope.cancelAttReg = 'true'
			$scope.editOD = 'true'
		}else{
			$scope.cancelAttReg = 'false'
			$scope.editOD = 'false'
		}
	}
	
	
	$scope.downloadAttachmnent = function (od){
		
		var strData=od.uploadFile
		//var strUrlPrefix='data:"application/pdf;base64,'
		var strUrlPrefix='data:'+ od.uploadContentType +";base64,"
		var url=strUrlPrefix + strData
		var blob = base64toBlob(strData,od.uploadContentType)
		downloadFileFromData(od.uploadFileName,blob,od.uploadContentType)
		event.stopPropagation();
	}		
	
	
    if (sessionStorage.getItem('IsLeaveAccessible') != false) {
        var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
        $scope.requesObject.menuId = leaveMenuInfo.menuId;
        $scope.requesObject.buttonRights = "Y-Y-Y-Y"
        $scope.requesObject.formName = "Leave"
    }
    if (sessionStorage.getItem('IsODAccessible') != false) {
        var odMenuInfo = getMenuInformation("Attendance Management", "OD Application");
        $scope.requesObject1.menuId = odMenuInfo.menuId;
        $scope.requesObject1.year = "" + new Date().getFullYear();
        $scope.requesObject1.level = 1
    }

	
				
    $scope.cancelObject = {};
    $scope.result = {}
    $scope.sendODRequestObject = {};
    $scope.IsLeaveAccessible = sessionStorage.getItem('IsLeaveAccessible');
    $scope.IsODAccessible = sessionStorage.getItem('IsODAccessible');
    $scope.IsRegularizationAccessible = sessionStorage.getItem('IsRegularizationAccessible');
    $scope.IsShiftChangeAccessible = sessionStorage.getItem('IsShiftChangeAccessible');
	

    $scope.getODApplicationList = function () {
		
        $scope.requesObjectForYear.yearId = ''
        $scope.searchObj = '';
        $("#ShiftChangeRequestIDReq").hide();
        $("#leaveApplicationIDReq").hide();
        $("#RegularizationApplicationIDReq").hide();
        $("#ODApplicationIDReq").show();
        $("#tabODReq").addClass("active");
        $("#tabLeaveReq").removeClass("active");
        $("#tabRegularizationReq").removeClass("active");
        $("#tabShiftApplicationReq").removeClass("active");
		
		if ($scope.odListFetched==true){
			$ionicLoading.hide()
			return;
		}
		$scope.odListFetched=true
		
        $ionicLoading.show();
		
		//$scope.getRequestCounts()
        $scope.getYearListService = new getYearListService();
        $scope.getYearListService.$save(function (data) {
			$scope.yearList = []
			if(data.yearList===undefined){
				//do nothing
			}else{
				$scope.yearList = data.yearList
			}
			
            $scope.viewOdApplication();
			
        }, function (data, status) {
			
            $scope.viewOdApplication();
        });
		
    };
    $scope.viewOdApplication = function () {
		//alert("view od st " + new Date())
		$ionicLoading.show();
        $scope.viewODApplicationService = new viewODApplicationService();
        $scope.viewODApplicationService.$save($scope.requesObject1, function (data) {
			
            $scope.requesObjectForMonth.month = ''
			$scope.ODApplList = []
			
			if(data.odApplicationVoList===undefined){
				//do nothing
			}else{
					$scope.ODlList = data.odApplicationVoList
			}
            
            $("#ODApplicationIDReq").show();
            
            for (var i = 0; i < $scope.ODlList.length; i++) {
                $scope.travelFormatedDate = $scope.ODlList[i].travelDate.split('/')
                $scope.ODlList[i].travelDate = new Date($scope.travelFormatedDate[2] + '/' + $scope.travelFormatedDate[1] + '/' + $scope.travelFormatedDate[0])

                $scope.travelFormatedDate_new = $scope.ODlList[i].travelDate_new.split('/')
                $scope.ODlList[i].travelDate_new = new Date($scope.travelFormatedDate_new[2] + '/' + $scope.travelFormatedDate_new[1] + '/' + $scope.travelFormatedDate_new[0])
                if ($scope.ODlList[i].travelDate.getTime() == $scope.ODlList[i].travelDate_new.getTime()) {
                    $scope.ODlList[i].odDate = $scope.ODlList[i].travelDate;
                }
				//approvalRemarks comes in array
				
            }
            for (var i = 0; i < $scope.ODlList.length; i++)
            {
                $scope.ODlList[i].designation = sessionStorage.getItem('designation')
                $scope.ODlList[i].department = sessionStorage.getItem('department');
                $scope.ODlList[i].empName = sessionStorage.getItem('empName');
                $scope.ODlList[i].name = sessionStorage.getItem('empName');
                if (sessionStorage.getItem('photoFileName'))
                {
                    $scope.ODlList[i].photoFileName = sessionStorage.getItem('photoFileName')
                    $scope.ODlList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
                }
                else
                {
                    $scope.ODlList[i].photoFileName = ''
                    $scope.ODlList[i].profilePhoto = ''
                }
				
            }
			//alert("view od over  " + new Date())
			//$scope.viewOdApplicationForPrevYear();
			//if (!$scope.$$phase)
                    //$scope.$apply()	
            $ionicLoading.hide()
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    };
	
    $scope.viewOdApplicationForPrevYear = function () {
		//alert("for prev st" + new Date())
		$ionicLoading.show();
		$scope.getYearListService = new getYearListService();
        $scope.getYearListService.$save(function (data) {
            $scope.yearList = []
            $scope.yearList = data.yearList
            //$scope.viewOdApplication();
			
			//if (!$scope.$$phase)
              //      $scope.$apply()				
				
		
        }, function (data, status) {
            //$scope.viewOdApplication();
        });
		
		$scope.requesObject1.year = parseInt(Number($scope.requesObject1.year) - 1)
		
        $scope.viewODApplicationService = new viewODApplicationService();
        $scope.viewODApplicationService.$save($scope.requesObject1, function (data) {
            $scope.requesObjectForMonth.month = ''
            $scope.ODApplListForPrevYear = []
            $("#ODApplicationIDReq").show();
			var prevYrODListCount = $scope.ODlList.length
			
			if(data.odApplicationVoList===undefined){
				//do nothing
			}else{
				$scope.ODlList = $scope.ODlList.concat(data.odApplicationVoList)
			}
            
            for (var i = prevYrODListCount; i < $scope.ODlList.length; i++) {
                $scope.travelFormatedDate = $scope.ODlList[i].travelDate.split('/')
                $scope.ODlList[i].travelDate = new Date($scope.travelFormatedDate[2] + '/' + $scope.travelFormatedDate[1] + '/' + $scope.travelFormatedDate[0])

                $scope.travelFormatedDate_new = $scope.ODlList[i].travelDate_new.split('/')
                $scope.ODlList[i].travelDate_new = new Date($scope.travelFormatedDate_new[2] + '/' + $scope.travelFormatedDate_new[1] + '/' + $scope.travelFormatedDate_new[0])
                if ($scope.ODlList[i].travelDate.getTime() == $scope.ODlList[i].travelDate_new.getTime()) {
                    $scope.ODlList[i].odDate = $scope.ODlList[i].travelDate;
                }
            }
            for (var i = 0; i < $scope.ODlList.length; i++)
            {
                $scope.ODlList[i].designation = sessionStorage.getItem('designation')
                $scope.ODlList[i].department = sessionStorage.getItem('department');
                $scope.ODlList[i].empName = sessionStorage.getItem('empName');
                $scope.ODlList[i].name = sessionStorage.getItem('empName');
                if (sessionStorage.getItem('photoFileName'))
                {
                    $scope.ODlList[i].photoFileName = sessionStorage.getItem('photoFileName')
                    $scope.ODlList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
                }
                else
                {
                    $scope.ODlList[i].photoFileName = ''
                    $scope.ODlList[i].profilePhoto = ''
                }
            }
			$scope.getRequestCounts()
            $ionicLoading.hide()
			//alert("for prev over " + new Date())
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
		$scope.requesObject1.year = parseInt(Number($scope.requesObject1.year) + 1)
    };	
    $scope.getLeaveRequestList = function () {
        $scope.searchObj = '';
        $scope.requesObjectForYear.yearId = ''
        $("#ShiftChangeRequestIDReq").hide();
        $("#ODApplicationIDReq").hide();
        $("#RegularizationApplicationIDReq").hide();
        $("#leaveApplicationIDReq").show();
        $("#tabLeaveReq").addClass("active");
        $("#tabODReq").removeClass("active");
        $("#tabRegularizationReq").removeClass("active");
        $("#tabShiftApplicationReq").removeClass("active");
		
		if ($scope.leaveListFetched==true){
			return;
		}
		$scope.leaveListFetched=true
			
        $scope.requesObject.SelfRequestListFlag = 1;
        $ionicLoading.show();
		//$scope.getRequestCounts()
        $scope.viewLeaveApplicationService = new viewLeaveApplicationService();
        $scope.viewLeaveApplicationService.$save($scope.requesObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewLeaveApplicationService")
			}	
			
            $scope.requesObjectForMonth.month = ''
            $scope.leaveApplList = []
            if (data.selfLeaveList == undefined)
            {
                $ionicLoading.hide();
            }else if (data.selfLeaveList.length == 0 ){
				$ionicLoading.hide();
			}else{
				$scope.leaveApplList = data.selfLeaveList
				$scope.createDate = data.selfLeaveList[0].createDate;
			}
		
            for (var i = 0; i < $scope.leaveApplList.length; i++) {
                $scope.leaveFromFormatedDate = $scope.leaveApplList[i].leaveFromDate.split('/')
                $scope.leaveApplList[i].leaveFromDate = new Date($scope.leaveFromFormatedDate[2] + '/' + $scope.leaveFromFormatedDate[1] + '/' + $scope.leaveFromFormatedDate[0])
                $scope.leaveToFormatedDate = $scope.leaveApplList[i].leaveToDate.split('/')
                $scope.leaveApplList[i].leaveToDate = new Date($scope.leaveToFormatedDate[2] + '/' + $scope.leaveToFormatedDate[1] + '/' + $scope.leaveToFormatedDate[0])
                if ($scope.leaveApplList[i].leaveFromDate.getTime() == $scope.leaveApplList[i].leaveToDate.getTime()) {
                    $scope.leaveApplList[i].leaveDate = $scope.leaveApplList[i].leaveFromDate;
                }
				if ($scope.leaveApplList[i].approverRemark !=null){
					if ($scope.leaveApplList[i].approverRemark.indexOf("<br>")>-1){
						$scope.leaveApplList[i].approverRemark = $scope.leaveApplList[i].approverRemark.replace(/<br>/g,"\n") 
					}
				}
            }
            for (var i = 0; i < $scope.leaveApplList.length; i++)
            {
                $scope.leaveApplList[i].designation = sessionStorage.getItem('designation')
                $scope.leaveApplList[i].department = sessionStorage.getItem('department');
                $scope.leaveApplList[i].empName = sessionStorage.getItem('empName');
                $scope.leaveApplList[i].name = sessionStorage.getItem('empName');
                if (sessionStorage.getItem('photoFileName'))
                {
                    $scope.leaveApplList[i].photoFileName = sessionStorage.getItem('photoFileName')
                    $scope.leaveApplList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
                }
                else
                {
                    $scope.leaveApplList[i].photoFileName = ''
                    $scope.leaveApplList[i].profilePhoto = ''
                }
				
				
            }
			$scope.getRequestCounts()
            $ionicLoading.hide()
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);

        });
    }
    $scope.detailInfoReporty = function (transid, leaveOBJ) {
        $ionicLoading.show();
        $scope.leaveOBJ = leaveOBJ
        $scope.detailResObject = {}
        $scope.detailResObject.leaveTransId = transid

        var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
        $scope.detailResObject.menuId = leaveMenuInfo.menuId;

        $scope.detailResObject.buttonRights = "Y-Y-Y-Y"
        $scope.detailsService = new detailsService();
        $scope.detailsService.$save($scope.detailResObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"detailsService")
			}	
			
            $scope.sendrequesObject.leaveApplyDetail = data.form.leaveAppVo
            $scope.sendrequesObject.leaveReason = data.form.leaveAppVo.leaveReason
            $scope.sendrequesObject.status = data.form.leaveAppVo.leaveStatus
            $scope.sendrequesObject.title = data.form.leaveAppVo
            $scope.sendrequesObject.name = data.form.leaveAppVo.name
            $scope.sendrequesObject.leaveFromDate = data.form.leaveAppVo.leaveFromDate
            $scope.sendrequesObject.leaveToDate = data.form.leaveAppVo.leaveToDate
            $scope.sendrequesObject.phoneNo = data.form.leaveAppVo.phone
            $scope.sendrequesObject.toLeaveType = data.form.leaveAppVo.toLeaveType
            $scope.sendrequesObject.fromLeaveType = data.form.leaveAppVo.fromLeaveType
            $scope.sendrequesObject.address = $scope.sendrequesObject.leaveApplyDetail.address
            $scope.sendrequesObject.phoneNo = sessionStorage.getItem('phoneNumber')
            $scope.sendrequesObject.leaveTransId = transid
            $scope.sendrequesObject.empId = sessionStorage.getItem('empId')
            $scope.sendrequesObject.name = $scope.sendrequesObject.leaveApplyDetail.name
            $scope.sendrequesObject.remarks = $scope.sendrequesObject.leaveApplyDetail.remarks
            var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
            $scope.sendrequesObject.menuId = leaveMenuInfo.menuId;
            $scope.sendrequesObject.leaveTypeId = $scope.sendrequesObject.leaveApplyDetail.leaveTypeId
            $scope.sendrequesObject.leaveBalBefore = $scope.sendrequesObject.leaveApplyDetail.leaveBalBefore
            $scope.sendrequesObject.noDaysCounted = $scope.sendrequesObject.leaveApplyDetail.noDaysCounted
            $scope.sendrequesObject.leaveType = $scope.leaveOBJ.leaveType
            $scope.sendrequesObject.fromLvHr = $scope.sendrequesObject.leaveApplyDetail.fromLvHr
            $scope.sendrequesObject.toLvHr = $scope.sendrequesObject.leaveApplyDetail.toLvHr
            $scope.sendrequesObject.noOfDays = $scope.sendrequesObject.leaveApplyDetail.noOfDays
            $scope.sendrequesObject.leaveLeastCountMsg = $scope.sendrequesObject.leaveApplyDetail.leaveLeastCountMsg
            $scope.sendrequesObject.leaveApproved = $scope.sendrequesObject.leaveApplyDetail.leaveApproved
            $scope.sendrequesObject.leaveInProcess = $scope.sendrequesObject.leaveApplyDetail.leaveInProcess
            $scope.sendrequesObject.currentBalance = $scope.sendrequesObject.leaveApplyDetail.currentBalance
            $scope.sendrequesObject.afterBalance = $scope.sendrequesObject.leaveApplyDetail.afterBalance
            $scope.sendrequesObject.email = $scope.sendrequesObject.leaveApplyDetail.email
            getSetService.set($scope.sendrequesObject)
            $state.go('LeaveDetailPage')
            $ionicLoading.hide()
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
    $scope.reDirectToFreshLeavePage = function ()
    {
        $state.go('leaveApplication')
    }
    $scope.reDirectToODApplictaionPage = function ()
    {
		$rootScope.dataExchForODEdit='false'
        $state.go('odApplication')
    }
    $scope.reDirectToShiftChangePage = function ()
    {
        $state.go('shiftChange')
    }
    $scope.reDirectToAttendanceRegularizationPage = function ()
    {
        $state.go('attendanceRegularisation')
    }
    $scope.cancelODRequest = function (status, ID, travelDate) {
        $ionicLoading.show();
        $scope.cancelObject.menuId = $scope.requesObject1.menuId
        $scope.cancelObject.buttonRights = $scope.requesObject.buttonRights
        $scope.cancelObject.odId = ID
        $scope.cancelObject.status = status
        $scope.traveleDate = travelDate
        $scope.cancelObject.travel = $filter('date')($scope.traveleDate, 'dd/MM/yyyy');
        $scope.cancelObject.level = $scope.requesObject1.level
        $scope.cancelODRequestService = new cancelODRequestService();
        $scope.cancelODRequestService.$save($scope.cancelObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"cancelODRequestService")
			}
			
            $ionicLoading.hide();
            if(data.message!=null)
            {
				$ionicLoading.hide()
                showAlert("OD", data.message);
            }
            $ionicLoading.show();
			$scope.odListFetched = false
            $scope.getODApplicationList();
			$ionicLoading.hide();
            $("#leaveApplicationIDReq").hide();
            $("#ShiftChangeRequestIDReq").hide();
            $("#RegularizationApplicationIDReq").hide();
            $("#ODApplicationIDReq").show();
            $("#tabODReq").addClass("active");
            $("#tabRegularizationReq").removeClass("active");
            $("#tabShiftApplicationReq").removeClass("active");
            $("#tabLeaveReq").removeClass("active");
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        })
    }
    $scope.sendODRequest = function (status, ID, travelDate) {
        $ionicLoading.show({});
        $scope.sendODRequestObject.menuId = $scope.requesObject1.menuId
        $scope.sendODRequestObject.buttonRights = $scope.requesObject.buttonRights
        $scope.sendODRequestObject.empId = sessionStorage.getItem('empId')
        $scope.sendODRequestObject.year = $scope.requesObject1.year
        $scope.sendODRequestObject.odId = ID
        $scope.sendODRequestObject.status = status
        $scope.sendODRequestObject.travel = travelDate
        $scope.sendODRequestObject.level = $scope.requesObject1.level
        $scope.sendODRequestService = new sendODRequestService();
        $scope.sendODRequestService.$save($scope.sendODRequestObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"sendODRequestService")
			}
			
			//$ionicLoading.hide()
			if (data.msgAuto == "" || data.msgAuto === undefined) showAlert("OD", "Something went wrong.")
            else {
				showAlert("OD", data.msgAuto)
			}
			$scope.odListFetched = false
            $scope.getODApplicationList();
            $ionicLoading.hide()
            $("#RegularizationApplicationIDReq").hide();
            $("#leaveApplicationIDReq").hide();
            $("#ShiftChangeRequestIDReq").hide();
            $("#ODApplicationIDReq").show();
            $("#tabODReq").addClass("active");
            $("#tabRegularizationReq").removeClass("active");
            $("#tabShiftApplicationReq").removeClass("active");
            $("#tabLeaveReq").removeClass("active");
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        })
    }
    $scope.onConfirm = function (type, status, odID, travelDate)
    {
        if (type == 1)
        {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to send for approval?',
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $scope.sendODRequest(status, odID, travelDate)
                    return
                } else {
                    return;
                }
            });
        }
        else if (type == 2)
        {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to cancel?',
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $scope.cancelODRequest(status, odID, travelDate)
                    return
                } else {
                    return;
                }
            });
        }
    }
    $scope.missPunchdetailInfo = function (missPunchAppliList) {
        $scope.missPunchDetails = missPunchAppliList
        $scope.missPunchDetails.remarks = missPunchAppliList.remarks;
        if ($scope.missPunchDetails.remarks == "FSISO") {
            $scope.fullRemarks = "Forgot to Sign in Sign Out (FSISO)"
        }
        else if ($scope.missPunchDetails.remarks == "FSI") {
            $scope.fullRemarks = "Forgot to Sign in (FSI)"
        }
        else if ($scope.missPunchDetails.remarks == "FSO") {
            $scope.fullRemarks = "Forgot to Sign Out (FSO)"
        }
        else if ($scope.missPunchDetails.remarks == "MSISO") {
            $scope.fullRemarks = "Modify Sign in Sign Out (MSISO)"
        }
        else if ($scope.missPunchDetails.remarks == "NEWEMP") {
            $scope.fullRemarks = "New Employee (NEWEMP)"
        }
        else if ($scope.missPunchDetails.remarks == "UNPLANHD") {
            $scope.fullRemarks = "Unplanned Holiday (UNPLANHD)"
        }
        else if ($scope.missPunchDetails.remarks == "EG") {
            $scope.fullRemarks = "Early Going (EG)"
        }
        else if ($scope.missPunchDetails.remarks == "LC") {
            $scope.fullRemarks = "Late Coming (LC)"
        }
        else if ($scope.missPunchDetails.remarks == "OTH") {
            $scope.fullRemarks = "Other (OTH)"
        }
		
		//alert($scope.missPunchDetails.workedHrs)
		//aaaa
		//alert($scope.missPunchDetails.inTimeStr +"   " + $scope.missPunchDetails.outTimeStr)
		
		//if ($scope.missPunchDetails.workedHrs == "00:00"){
			dt1 = new Date("October 13, 2014 "+$scope.missPunchDetails.inTimeStr  +":00");
			dt2 = new Date("October 13, 2014 "+$scope.missPunchDetails.outTimeStr  +":00");
				 var diffHrsMin = $scope.diff_HrsMin(dt1,dt2)
				 $scope.missPunchDetails.workedHrs = diffHrsMin
		//}
		
        $scope.openModalAttend();
        $ionicLoading.hide()
    }
	
	
	$scope.diff_HrsMin = function(dt2, dt1) 
	{
		var msec = dt1 - dt2;
		var mins = Math.floor(msec / 60000);
		var hrs = Math.floor(mins / 60);

		mins = Math.floor(mins%60)		
		if (hrs<10) hrs = "0"+hrs
		if (mins<10) mins = "0"+mins
		
		return hrs +":"+mins
		
	}
	
	
	$scope.getRegularizationRequestListPrevMonth = function () {
				
		 if ($scope.requesObjectForMonth.month ==1){
			 $scope.requesObjectForMonth.month = 12
			 $scope.requesObjectForYear.yearId = Number($scope.requesObjectForYear.yearId) -1
		 }else{
		 $scope.requesObjectForMonth.month = Number($scope.requesObjectForMonth.month) -1
		 }
		 $scope.greyArrowForNextMonth = false
		 $scope.attListFetched = false
		 $scope.getRegularizationRequestList()
	}
	$scope.getRegularizationRequestListNextMonth = function () {
		
		if ($scope.requesObjectForMonth.month ==12){
			 $scope.requesObjectForMonth.month = 1
			 $scope.requesObjectForYear.yearId = Number($scope.requesObjectForYear.yearId) +1
		 }else{
			$scope.requesObjectForMonth.month = Number($scope.requesObjectForMonth.month) + 1

		 }
		 $scope.attListFetched = false
		 $scope.getRegularizationRequestList()
		
		
		todayYR =new Date().getFullYear()
		todayMON = Number(new Date().getMonth() ) + 1
		tmpMon = $scope.requesObjectForMonth.month
		if (todayMON<10 ) {todayMON = "0" +todayMON }
		if (tmpMon<10 ){ tmpMon = "0" +tmpMon }
		
		if ( $scope.requesObjectForYear.yearId+tmpMon+"" == todayYR.toString() +todayMON.toString()) {
			$scope.greyArrowForNextMonth = true
			return;
		}
		
		 
		
	}
	
    $scope.getRegularizationRequestList = function () {
        $scope.searchObj = '';
        $("#leaveApplicationIDReq").hide();
        $("#ODApplicationIDReq").hide();
        $("#ShiftChangeRequestIDReq").hide();
        $("#RegularizationApplicationIDReq").show();
        $("#tabLeaveReq").removeClass("active");
        $("#tabODReq").removeClass("active");
        $("#tabShiftApplicationReq").removeClass("active");
        $("#tabRegularizationReq").addClass("active");
		
		
        var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");
        $scope.requesObject.menuId = attendanceMenuInfo.menuId;
        $scope.requesObject.fromEmail = "N"
		
		if ($scope.attListFetched==true){
			return;
		}
		$scope.attListFetched=true
		
        if (!$scope.requesObjectForYear.yearId) {
            $scope.requesObject.year = new Date().getFullYear();
            $scope.requesObjectForYear.yearId = $scope.requesObject.year.toString()
        } else {
            $scope.requesObject.year = $scope.requesObjectForYear.yearId
            $scope.requesObjectForYear.yearId = $scope.requesObjectForYear.yearId
        }
        if (!$scope.requesObjectForMonth.month) {
            $scope.requesObject.monthId = parseInt(new Date().getMonth()) + 1;
            $scope.requesObjectForMonth.month = $scope.requesObject.monthId
        } else {
            $scope.requesObject.monthId = $scope.requesObjectForMonth.month;
        }
		$scope.monthName = monthNumToName($scope.requesObject.monthId)
        $ionicLoading.show({});
		//$scope.getRequestCounts()
        $scope.viewMissPunchApplicationService = new viewMissPunchApplicationService();
        $scope.viewMissPunchApplicationService.$save($scope.requesObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewMissPunchApplicationService")
			}	
			
            $scope.yearListforAtt = data.missedPunchForm.listYear;

            $scope.lockingPeriod = sessionStorage.getItem('lockingPeriod');
            if (!$scope.lockingPeriod) {
				$ionicLoading.hide()
                showAlert("", "Either shift not available or locking period passed away for selected criteria");
                
                return;
            }
            $scope.monthList = data.listMonth;
            $scope.missPunchAppliList = data.missedPunchForm.missedPunchVOList;
            if (Object.keys(data).length > 0) {
                if ($scope.missPunchAppliList.length > 0) {
                    $scope.missPunchAppliList = data.missedPunchForm.missedPunchVOList;
                    for (var i = 0; i < $scope.missPunchAppliList.length; i++) {
                        $scope.attDateFormated = $scope.missPunchAppliList[i].outTimeDateStr.split('/')
                        $scope.missPunchAppliList[i].outTimeDateStr = new Date($scope.attDateFormated[2] + '/' + $scope.attDateFormated[1] + '/' + $scope.attDateFormated[0])
						
						$scope.missPunchAppliList[i].appRemarks = $scope.missPunchAppliList[i].appRemarks.replace(/<br>/g,"\n") 
                    }
                }
                $("#attendanceRegularisationID").show();
            }
			$scope.getRequestCounts()
            $ionicLoading.hide()
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
	
    $scope.shiftChangeDetailInfo = function (shiftChangeAppliList) {
        var detailShiftChangeObject = {};
        detailShiftChangeObject.fromDate = shiftChangeAppliList.fromDate;
        detailShiftChangeObject.status = shiftChangeAppliList.status;
        detailShiftChangeObject.toDate = shiftChangeAppliList.toDate;
        detailShiftChangeObject.rosterShiftName = shiftChangeAppliList.rosterShiftName;
        detailShiftChangeObject.changedShiftName = shiftChangeAppliList.changedShiftName;
        detailShiftChangeObject.reasonToChange = shiftChangeAppliList.reasonToChange;
        detailShiftChangeObject.appRemarks = shiftChangeAppliList.appRemarks;
        detailShiftChangeObject.lastAppRemarks = shiftChangeAppliList.lastAppRemarks;
		detailShiftChangeObject.approvalPendingFrom = shiftChangeAppliList.approvalPendingFrom;
        $scope.shiftChangeDetails = detailShiftChangeObject
        $scope.openModalShiftChange();
        $ionicLoading.hide()
    }
    $ionicModal.fromTemplateUrl('my-modal-shift-change.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modalShiftChange) {
        $scope.modalShiftChange = modalShiftChange;
    });
    $scope.openModalShiftChange = function () {
        $scope.modalShiftChange.show();
    };
    $scope.closeModalShiftChange = function () {
        $scope.modalShiftChange.hide();
    };
    $scope.$on('$destroy', function () {
        $scope.modalShiftChange.remove();
    });
    $scope.$on('modalShiftChange.hidden', function () {
    });
    $scope.$on('modalShiftChange.removed', function () {
    });
    $ionicModal.fromTemplateUrl('my-modal-attend.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modalAttend) {
        $scope.modalAttend = modalAttend;
    });
    $scope.openModalAttend = function () {
        $scope.modalAttend.show();
    };
    $scope.closeModalAttend = function () {
        $scope.modalAttend.hide();
    };
    $scope.$on('$destroy', function () {
        $scope.modalAttend.remove();
    });
    $scope.$on('modalAttend.hidden', function () {
    });
    $scope.$on('modalAttend.removed', function () {
    });

    $scope.getShiftChangeRequestList = function () {
        $scope.requesObjectForYear.yearId = ''
        $scope.searchObj = '';
        $("#leaveApplicationIDReq").hide();
        $("#ODApplicationIDReq").hide();
        $("#RegularizationApplicationIDReq").hide();
        $("#ShiftChangeRequestIDReq").show();
        $("#tabLeaveReq").removeClass("active");
        $("#tabODReq").removeClass("active");
        $("#tabRegularizationReq").removeClass("active");
        $("#tabShiftApplicationReq").addClass("active");
		
		if ($scope.scListFetched==true){
			return;
		}
		$scope.scListFetched=true

        var shiftChangeMenuInfo = getMenuInformation("Attendance Management", "Shift Change");
        $scope.requesObject.menuId = shiftChangeMenuInfo.menuId;

        $scope.requesObject.empCode = sessionStorage.getItem('empCode');
        $scope.requesObject.buttonRights = "Y-Y-Y-Y";
        $ionicLoading.show({});
		//$scope.getRequestCounts()
        $scope.viewShiftChangeApplicationService = new viewShiftChangeApplicationService();
        $scope.viewShiftChangeApplicationService.$save($scope.requesObject, function (data) {
            $scope.requesObjectForMonth.month = ''
            if (data.form.shiftChangeVOList.length == 0) {
                $ionicLoading.hide()
                return;
            }
            
            if (Object.keys(data).length > 0) {
                if (data.form.shiftChangeVOList.length > 0) {
                    //$scope.shiftChangeAppliList = data.form.shiftChangeVOList;
					$scope.shiftChangeAppliList = data.form.selfShiftChangeVOList;
                    for (var i = 0; i < $scope.shiftChangeAppliList.length; i++) {
                        //$scope.shiftFromDateFormated = $scope.shiftChangeAppliList[i].fromDate.split('/')
                        //$scope.shiftChangeAppliList[i].fromDate = new Date($scope.shiftFromDateFormated[2] + '/' + $scope.shiftFromDateFormated[1] + '/' + //$scope.shiftFromDateFormated[0])
						
						$scope.shiftFromDateFormated = $scope.shiftChangeAppliList[i].reqDate.split('/')
                        $scope.shiftChangeAppliList[i].fromDate = new Date($scope.shiftFromDateFormated[2] + '/' + $scope.shiftFromDateFormated[1] + '/' + $scope.shiftFromDateFormated[0])
						/*
						if ($scope.shiftChangeAppliList[i].createdDate !=null){
							$scope.createdDate = $scope.shiftChangeAppliList[i].createdDate.split('/')
							$scope.shiftChangeAppliList[i].createdDate = new Date($scope.createdDate[2] + '/' + $scope.createdDate[1] + '/' + $scope.createdDate[0]	)
						}
						*/
						if ($scope.shiftChangeAppliList[i].reqDate !=null){
							$scope.createdDate = $scope.shiftChangeAppliList[i].reqDate.split('/')
							$scope.shiftChangeAppliList[i].reqDate = new Date($scope.createdDate[2] + '/' + $scope.createdDate[1] + '/' + $scope.createdDate[0]	)
						}
                        
					   if (!(data.form.selfShiftChangeVOList === undefined))
					   {
							$scope.shiftChangeAppliList[i].approvalPendingFrom = data.form.selfShiftChangeVOList[i].approvalPendingFrom;
					   }
                    }
                }
				
				
            }
			$scope.getRequestCounts()
            $ionicLoading.hide()
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
    function Initialize()
    {
        // var menuInfo = getMenuInformation("Attendance Management","Shift
        // Master");
		$ionicLoading.show();
		$scope.getRequestCounts()
		$ionicLoading.hide();
		
        if (!angular.equals({}, getSetService.get())) {
            $scope.result = getSetService.get()
            $scope.emptyObject = {};
            if ($scope.result.check == "Leave") {
                //getSetService.set($scope.emptyObject)
				$rootScope.navHistoryPrevPage=$rootScope.navHistoryCurrPage
				$rootScope.navHistoryCurrPage="requisition"						
                $scope.getLeaveRequestList();
                return;
            }
            else if ($scope.result.check == "OD") {
                $scope.getODApplicationList();
				$rootScope.navHistoryPrevPage=$rootScope.navHistoryCurrPage
				$rootScope.navHistoryCurrPage="requisition"						
                //getSetService.set($scope.emptyObject)
                return;
            }
            else if ($scope.result.check == "Regularization") {
                $scope.getRegularizationRequestList();
				$rootScope.navHistoryPrevPage=$rootScope.navHistoryCurrPage
				$rootScope.navHistoryCurrPage="requisition"						
                //getSetService.set($scope.emptyObject)
                return;
            }
            else if ($scope.result.check == "ShiftChange") {
                $scope.getShiftChangeRequestList();
				$rootScope.navHistoryPrevPage=$rootScope.navHistoryCurrPage
				$rootScope.navHistoryCurrPage="requisition"						
                //getSetService.set($scope.emptyObject)
                return;
            }
            else {
                getSetService.set($scope.emptyObject)
            }
        }
		
		
		if ($rootScope.navHistoryCurrPage=="leave_application"){
			if ($scope.IsLeaveAccessible == 'true' ){
				$scope.getLeaveRequestList();
				
				$rootScope.navHistoryPrevPage=$rootScope.navHistoryCurrPage
				$rootScope.navHistoryCurrPage="requisition"						
				return;
			}
		}else if ($rootScope.navHistoryCurrPage=="od_application"){
			if ($scope.IsODAccessible == 'true' ){
				$scope.getODApplicationList()
				
				$rootScope.navHistoryPrevPage=$rootScope.navHistoryCurrPage
				$rootScope.navHistoryCurrPage="requisition"						
				return;
			}
			
			
		}else if ($rootScope.navHistoryCurrPage=="attendance_regularisation"){
			if ($scope.IsRegularizationAccessible == 'true' ){
				$scope.getRegularizationRequestList()
				
				$rootScope.navHistoryPrevPage=$rootScope.navHistoryCurrPage
				$rootScope.navHistoryCurrPage="requisition"						
				return;
			}
			
			
		}else if ($rootScope.navHistoryCurrPage=="shift_change_application"){
			if ($scope.IsShiftChangeAccessible == 'true' ){
				$scope.getShiftChangeRequestList()
				
				$rootScope.navHistoryPrevPage=$rootScope.navHistoryCurrPage
				$rootScope.navHistoryCurrPage="requisition"						
				return;
			}
			 
		}else
		{
			if ($scope.IsLeaveAccessible == 'true' ){
				$scope.getLeaveRequestList();
				
				$rootScope.navHistoryPrevPage=$rootScope.navHistoryCurrPage
				$rootScope.navHistoryCurrPage="requisition"						
				return;
			}
		}
		
		$rootScope.navHistoryPrevPage=$rootScope.navHistoryCurrPage
		$rootScope.navHistoryCurrPage="requisition"				
        if ($scope.IsODAccessible == 'true')
        {
            $scope.getODApplicationList();
            return;
        }
        if ($scope.IsRegularizationAccessible == 'true')
        {
            $scope.getRegularizationRequestList();
            return;
        }
        if ($scope.IsShiftChangeAccessible == 'true')
        {
            $scope.getShiftChangeRequestList();
            return;
        }

    }


	$scope.refreshLeaveList = function(){

		$scope.leaveListFetched = false
		$scope.getLeaveRequestList()
		
	}		
	
	$scope.refreshODList = function(){
		
		$scope.odListFetched = false
		$scope.getODApplicationList()
		
	}		
	
	$scope.refreshAttList = function(){

		$scope.attListFetched = false
		$scope.getRegularizationRequestList()
		
	}		
	
	$scope.refreshSCList = function(){

		$scope.scListFetched = false
		$scope.getShiftChangeRequestList()
		
	}		
	
	
	$scope.goSendForCancelation = function(selItem){
		
		$ionicLoading.show();
		$scope.tmpSendObject = {}

		var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");		
		$scope.tmpSendObject.menuId = attendanceMenuInfo.menuId;
        $scope.tmpSendObject.buttonRights = "Y-Y-Y-Y"
		$scope.tmpSendObject.transId = selItem.transId
		$scope.tmpSendObject.empName = selItem.empName
		
		$scope.sendForCancellation = new sendForCancellation();
        $scope.sendForCancellation.$save($scope.tmpSendObject,function (data) {
			showAlert(data.msg)
			$scope.attListFetched = false
            $scope.getRegularizationRequestList();
			
        }, function (data, status) {
			$scope.attListFetched = false
            $scope.getRegularizationRequestList();
        });
	}

	
	$scope.showDetails = function (status, odId) {
		$rootScope.dataExchOdId = odId
		$rootScope.dataExchStatus = status
		$rootScope.dataExchForODEdit = 'true'
		$state.go('odApplication')
		
	}
    $scope.getRequestCounts = function () {
        $ionicLoading.show();
        $scope.viewRequisitionApprovalService = new viewRequisitionApprovalService();
        $scope.viewRequisitionApprovalService.$save(function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewRequisitionApprovalService")
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

            
			
			//alert($scope.leaveInprocessCount + "\n" + $scope.odprocessInprocess +"\n"+ $scope.attendanceInprocessCount +"\n" +$scope.shiftChangeInProcessApproval)
			sessionStorage.setItem('LeaveRequests',$scope.leaveInprocessCount );
			sessionStorage.setItem('ODRequests',$scope.odprocessInprocess);
			sessionStorage.setItem('AttRegRequests',$scope.attendanceInprocessCount);
			sessionStorage.setItem('SCRequests',$scope.shiftChangeInProcessApproval);
			
			$scope.LeaveRequests = sessionStorage.getItem('LeaveRequests');
			$scope.ODRequests =sessionStorage.getItem('ODRequests');
			$scope.AttRegRequests = sessionStorage.getItem('AttRegRequests');
			$scope.SCRequests = sessionStorage.getItem('SCRequests');			
			$ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data, "app.home.dashboard");
        });
    }

	
	function monthNumToName(monthnum) {
		var months = [
			'Jan', 'Feb', 'Mar', 'Apr', 'May',
			'Jun', 'Jul', 'Aug', 'Sep',
			'Oct', 'Nov', 'Dec'
			];

		return months[monthnum - 1] || '';
	}	
	

    Initialize();
});
