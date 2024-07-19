/*
 1.This controller is used to Approve/Reject Attendance Regularisation.
 */

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


mainModule.controller('attendanceApprovalsListCtrl', function ($scope, $http, viewAttendaceRegularisationService, $ionicPopup, getRequisitionCountService, commonService, $rootScope, $ionicLoading, $ionicModal, detailsService, viewLeaveApplicationService) {
    /*
        
    
        $scope.getAttendanceApplicationList = function () {
            
            $scope.attendanceObject = {}
            var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");
            $scope.attendanceObject.menuId = attendanceMenuInfo.menuId;
            $scope.attendanceObject.buttonRights = "Y-Y-Y-Y"
    //        $("#leavePendingApplicationID").hide();
    //        $("#ODPendingApplicationID").hide();
    //        $("#ShiftChangeApplicationID").hide();
    //        $("#AttendanceApplicationID").show()
            $scope.searchObj = ''
    //        $("#tabShiftChange").removeClass("active");
    //        $("#tabRegularization").addClass("active");
    //        $("#tabOD").removeClass("active");
    //        $("#tabLeave").removeClass("active");
            $ionicLoading.show({
            });
            $scope.viewAttendaceRegularisationService = new viewAttendaceRegularisationService();
            $scope.viewAttendaceRegularisationService.$save($scope.attendanceObject, function (data) {
            	
                if (!(data.clientResponseMsg=="OK")){
                    console.log(data.clientResponseMsg)
                    handleClientResponse(data.clientResponseMsg,"viewAttendaceRegularisationService")
                }				
    
                $scope.AttendanceApplList = []
                $scope.AttendanceApplList = data.missedPunchVOList;
                $ionicLoading.hide()
            }, function (data) {
                autoRetryCounter = 0
                $ionicLoading.hide()
                commonService.getErrorMessage(data);
            });
        }
        $scope.getAttendanceApplicationList();
    
        $scope.approveAttendanceApplicationList = function (Attendance, type) {
            $scope.approveAtendanceObject = {}
            $scope.attendPendingObject.remark = "";
            $scope.data = {}
            var temp = {}
            $scope.approveAtendanceObject.missedPunchVOList = []
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
            temp.isAssign = true
            temp.firstHalf = Attendance.firstHalf
            temp.secondHalf = Attendance.secondHalf
            temp.actualInTimeStr = Attendance.actualInTimeStr
            temp.lateComming = Attendance.lateComming
            temp.inTimeStr = Attendance.inTimeStr
            temp.actualOutTimeStr = Attendance.actualOutTimeStr
            temp.earlyGoing = Attendance.earlyGoing
            temp.outTimeStr = Attendance.outTimeStr
            temp.outTimeDateStr = Attendance.outTimeDateStr
            temp.shiftMasterChild = Attendance.shiftMasterChild
            temp.workedHrs = Attendance.workedHrs
            temp.remarks = Attendance.remarks
            temp.status = Attendance.status
            temp.transId = Attendance.transId
            temp.appRemarks = Attendance.appRemarks
            temp.othRemarks = Attendance.othRemarks
            temp.trackerId = Attendance.trackerId
    
            $scope.approveAtendanceObject.missedPunchVOList.push(temp)
            if (type == "APPROVE") {
                var myPopup = $ionicPopup.show({
                    template: '<label>Approver Remarks<textarea rows="3" ng-model="attendPendingObject.remark" cols="100"></textarea></label>',
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
                        $http({
                            url: (baseURL + '/api/attendance/missPunch/approveMissedPunchApp.spr'),
                            method: 'POST',
                            timeout: commonRequestTimeout,
                            transformRequest: jsonTransformRequest,
                            data: $scope.approveAtendanceObject,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        }).
                                success(function (data) {
                                    getMenuInfoOnLoad();
                                    showAlert("Attendance pending application", "Attendance approved successsfully");
                                    $scope.getAttendanceApplicationList();
                                }).error(function (status) {
                            $scope.data = {status: status};
                            commonService.getErrorMessage($scope.data);
                            $ionicLoading.hide()
                        })
                    } else {
                        $ionicLoading.hide()
                        return;
                    }
                });
            }
            if (type == "REJECT") {
                var myPopup = $ionicPopup.show({
                    template: '<label>Approver Remarks<textarea rows="3" ng-model="data.attendReject" cols="100"></textarea></label>',
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
                        $http({
                            url: (baseURL + '/api/attendance/missPunch/rejectMissedPunchApp.spr'),
                            method: 'POST',
                            timeout: commonRequestTimeout,
                            transformRequest: jsonTransformRequest,
                            data: $scope.approveAtendanceObject,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        }).
                                success(function (data) {
                                    getMenuInfoOnLoad();
                                    $ionicLoading.hide()
                                    showAlert("Attendance pending application", "Attendance rejected successsfully");
                                    $scope.getAttendanceApplicationList();
                                }).error(function (data) {
                            $ionicLoading.hide()
                            commonService.getErrorMessage(data);
                        })
                    } else {
                        $ionicLoading.hide()
                        return;
                    }
                });
            }
        }
    */
});/*
 1.This controller is used for applying Attendance Regularisation with Edit functionality.
 */

mainModule.factory("getShiftTimeService", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/attendance/missPunch/getShiftTime.spr'), {}, {
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
mainModule.controller('attendanceRegularCtrl', function ($scope, $rootScope, commonService, $state, $ionicPopup, $ionicLoading, $http, $filter, viewMissPunchByDateService, $ionicLoading, getSetService, getShiftTimeService, $ionicNavBarDelegate) {
    $rootScope.navHistoryPrevPage = "requestRegularizationList"
    //$rootScope.navHistoryCurrPage="attendance_regularisation"
    $scope.attendanceObject = {}
    //$rootScope.navHistoryPrevTab="ATTREG"	
    $rootScope.reqestPageLastTab = "ATTREG"
    var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");
    $scope.attendanceObject.menuId = attendanceMenuInfo.menuId;

    $scope.attendanceRegularObj = {}
    $scope.result = {};
    $scope.onloadRequestObj = {}
    $scope.onloadResponseObj = {}
    $scope.fDate = new Date()
    var tym = new Date();
    $scope.inTimeStr = ""
    $scope.outTimeStr = ""
    $scope.hidebutton = false
    $scope.currenttime = $filter('date')(tym, 'shortTime');
    $scope.selectedValues = {}
    $scope.selectedValues.nextDayVal = false
    $scope.attendanceRegularObj.selectedDate = $filter('date')(new Date(), 'dd/MM/yyyy');
    $scope.attendanceRegularObj.actualTimeIn = "";
    $scope.attendanceRegularObj.timeIn = "";
    $scope.attendanceRegularObj.actualTimeOut = "";
    $scope.attendanceRegularObj.timeOut = "";
    $scope.editable = true;

    $scope.possiblyNightShit = "false"
    $scope.filterLeave = {
        member: 'sickLeave'
    }


    if (getMyHrapiVersionNumber() >= 30) {
        $scope.utf8Enabled = 'true'
    } else {
        $scope.utf8Enabled = 'false'
    }

    if (getMyHrapiVersionNumber() >= 37) {
        $scope.nextDayFeature = 'true'
    } else {
        $scope.nextDayFeature = 'false'
    }

    if (getMyHrapiVersionNumber() >= 37) {
        $scope.defaultShitTimeFeature = 'true'
    } else {
        $scope.defaultShitTimeFeature = 'false'
    }

    //$scope.nextDayFeature = 'true'    


    $scope.getPunches = function (fromDate, toDate, empId, idx, module) {

        var tmfd = new FormData();
        tmfd.append('fromDate', fromDate)
        tmfd.append('empId', sessionStorage.getItem('empId'))
        tmfd.append('toDate', toDate)
        //url: "${pageContext.request.contextPath}/attendance/odApplication/getAppliedOdDetails.spr",
        $.ajax({
            url: baseURL + '/api/signin/getPunchDetails.spr',
            data: tmfd,
            type: 'POST',
            dataType: 'json',
            timeout: commonRequestTimeout,
            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
            },
            success: function (result1) {
                // alert(result1)
                result1.htmlPunchesStr = result1.htmlPunchesStr.replace("<br>", "")
                $scope.punchStr = result1.htmlPunchesStr.replace(/<br>/g, "\n")

                if (!$scope.$$phase)
                    $scope.$apply()

            },
            error: function (res) {

                console.log(res.status);


            }
        });
    }

    if (!angular.equals({}, getSetService.get())) {
        $scope.result = getSetService.get()
        if ($scope.result.selectedCalDate) {
            $scope.attendanceRegularObj.selectedDate = $filter('date')($scope.result.selectedCalDate, 'dd/MM/yyyy');
            $scope.onloadRequestObj.attendanceDate = $filter('date')($scope.result.selectedCalDate, 'MM/dd/yyyy');
            //call for get punches
            if ($rootScope.myAppVersion >= 19) {
                $scope.getPunches($scope.attendanceRegularObj.selectedDate, $scope.attendanceRegularObj.selectedDate, sessionStorage.getItem('empId'), '', '')
            }

        }
        $scope.emptyObject = {}
        getSetService.set($scope.emptyObject)
    }


    if ($rootScope.myAppVersion >= 19) {
        $scope.showPunchDetailsFeature = 'true'
    } else {
        $scope.showPunchDetailsFeature = 'false'
    }


    $scope.onload = function () {
        $scope.hidebutton = false;
        $ionicLoading.show({});
        $scope.applyingLeaves = []
        $scope.onloadRequestObj.buttonRights = "Y-Y-Y-Y"

        var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");
        $scope.onloadRequestObj.menuId = attendanceMenuInfo.menuId;
        $scope.onloadRequestObj.fromEmail = "N"
        $scope.onloadRequestObj.listYear = $scope.result.year
        $scope.onloadRequestObj.monthId = $scope.result.month

        $scope.inTimeStr = ""
        $scope.outTimeStr = ""

        $scope.viewMissPunchByDateService = new viewMissPunchByDateService()
        $scope.viewMissPunchByDateService.$save($scope.onloadRequestObj, function (data) {
            if (!data.missedPunchForm) {
                showAlert("Some error occurred, Please try later.")
                $ionicLoading.hide()
                $scope.redirectOnBack()
                return;
            }


            if ($scope.utf8Enabled == 'true') {
                if ($scope.temp) {
                    if ($scope.temp.appRemarks) {
                        $scope.temp.appRemarks = encodeURI($scope.temp.appRemarks)
                    }
                }
            }

            $scope.applyingLeaves = data.missedPunchForm.remarksList

            if (data.missedPunchForm.missedPunchVOList.length == 0) {
                $scope.inTimeStr = ""
                $scope.outTimeStr = ""
                $ionicLoading.hide()
            }
            var lbfound = false;

            if (data.newDayFlag) {
                $rootScope.newDayFlag = data.newDayFlag.toUpperCase();
            } else {
                $rootScope.newDayFlag = "No"
            }


            if (data.missedPunchForm.missedPunchVOList.length > 0) {
                // data recived
                /////////////////////
                $scope.lbfound = false;
                for (var i = 0; i < data.missedPunchForm.missedPunchVOList.length; i++) {
                    if ($scope.lbfound) {
                        break;
                    }
                    if (!(data.missedPunchForm.missedPunchVOList[i].attDate.substring(0, 10) == $scope.attendanceRegularObj.selectedDate)) {

                        continue;
                    }
                    else {
                        $scope.lbfound = true;
                    }
                    ///////////////////  
                    $scope.onloadResponseObj.status = data.missedPunchForm.missedPunchVOList[i].status
                    $scope.onloadResponseObj.attDate = data.missedPunchForm.missedPunchVOList[i].attDate
                    $scope.onloadResponseObj.fhOLStatus = data.missedPunchForm.missedPunchVOList[i].fhOLStatus
                    $scope.onloadResponseObj.shOLStatus = data.missedPunchForm.missedPunchVOList[i].shOLStatus
                    $scope.onloadResponseObj.isODPresent = data.missedPunchForm.missedPunchVOList[i].isODPresent
                    $scope.onloadResponseObj.isLeavePresent = data.missedPunchForm.missedPunchVOList[i].isLeavePresent
                    $scope.onloadResponseObj.lateComming = data.missedPunchForm.missedPunchVOList[i].lateComming
                    $scope.onloadResponseObj.earlyGoing = data.missedPunchForm.missedPunchVOList[i].earlyGoing
                    $scope.onloadResponseObj.shiftMasterChild = data.missedPunchForm.missedPunchVOList[i].shiftMasterChild
                    $scope.onloadResponseObj.shiftType = data.missedPunchForm.missedPunchVOList[i].shiftType
                    $scope.onloadResponseObj.workedHrs = data.missedPunchForm.missedPunchVOList[i].workedHrs
                    $scope.onloadResponseObj.remarks = data.missedPunchForm.missedPunchVOList[i].remarks
                    $scope.onloadResponseObj.othRemarks = data.missedPunchForm.missedPunchVOList[i].othRemarks
                    $scope.onloadResponseObj.appRemarks = data.missedPunchForm.missedPunchVOList[i].appRemarks
                    $scope.onloadResponseObj.isAssign = data.missedPunchForm.missedPunchVOList[i].isAssign
                    $scope.onloadResponseObj.transId = data.missedPunchForm.missedPunchVOList[i].transId
                    $scope.onloadResponseObj.firstHalf = data.missedPunchForm.missedPunchVOList[i].firstHalf
                    $scope.onloadResponseObj.secondHalf = data.missedPunchForm.missedPunchVOList[i].secondHalf
                    $scope.onloadResponseObj.inTimeStr = data.missedPunchForm.missedPunchVOList[i].inTimeStr
                    $scope.onloadResponseObj.outTimeStr = data.missedPunchForm.missedPunchVOList[i].outTimeStr
                    $scope.onloadResponseObj.actualInTimeStr = data.missedPunchForm.missedPunchVOList[i].actualInTimeStr
                    $scope.onloadResponseObj.actualOutTimeStr = data.missedPunchForm.missedPunchVOList[i].actualOutTimeStr;

                    //default set shift time
                    if ($scope.defaultShitTimeFeature == 'true') {
                        if (data.missedPunchForm.missedPunchVOList[i].shiftInOutTime) {
                            var shiftInOutTime = data.missedPunchForm.missedPunchVOList[i].shiftInOutTime;

                            $scope.inTimeStr = shiftInOutTime.substring(1, 6)
                            $scope.outTimeStr = shiftInOutTime.substring(9, 14)

                            if ($scope.inTimeStr.indexOf("(") != -1 ){
                                $scope.inTimeStr = ""
                            }
                            if ($scope.outTimeStr.indexOf("(") != -1 ){
                                $scope.outTimeStr = ""
                            }

                        }
                        if (data.missedPunchForm.missedPunchVOList[i].shiftAbbr) {
                            $scope.shiftAbbr = data.missedPunchForm.missedPunchVOList[i].shiftAbbr;
                        }
                    }
                    if ($scope.onloadResponseObj.status == "SENT FOR APPROVAL") {
                        window.plugins.toast.showWithOptions(
                            {
                                message: "Already sent for approval for date" + " " + $scope.onloadResponseObj.attDate,
                                duration: "long",
                                position: "center",
                                addPixelsY: -40
                            }
                        )
                        $scope.attendanceRegularObj.selectedDate = ''
                        $scope.hidebutton = true
                        $ionicLoading.hide()
                        return
                    } else if ($scope.onloadResponseObj.status == "APPROVED") {
                        window.plugins.toast.showWithOptions(
                            {
                                message: "Already  approved for date" + " " + $scope.onloadResponseObj.attDate,
                                duration: "long",
                                position: "center",
                                addPixelsY: -40
                            }
                        )
                        //$scope.attendanceRegularObj.selectedDate = ''
                        // $scope.hidebutton = true
                        $scope.hidebutton = false;
                        $ionicLoading.hide()
                        return
                    } else if ($scope.onloadResponseObj.status == "REJECTED") {
                        window.plugins.toast.showWithOptions(
                            {
                                message: "Already  rejected for date" + " " + $scope.onloadResponseObj.attDate,
                                duration: "long",
                                position: "center",
                                addPixelsY: -40
                            }
                        )
                        $scope.hidebutton = false;
                        $ionicLoading.hide()
                        return
                    } else if ($scope.onloadResponseObj.firstHalf == "On Leave" || $scope.firstHalf == "On Leave") {
                        window.plugins.toast.showWithOptions(
                            {
                                message: "Leave applied for date" + " " + $scope.onloadResponseObj.attDate,
                                duration: "long",
                                position: "center",
                                addPixelsY: -40
                            }
                        )
                        //$scope.attendanceRegularObj.selectedDate = ''
                        //$scope.hidebutton = true
                        $ionicLoading.hide()
                        return
                    } else if ($scope.onloadResponseObj.firstHalf == "On Duty" || $scope.firstHalf == "On Duty") {
                        window.plugins.toast.showWithOptions(
                            {
                                message: "OD applied for date" + " " + $scope.onloadResponseObj.attDate,
                                duration: "long",
                                position: "center",
                                addPixelsY: -40
                            }
                        )
                        //$scope.attendanceRegularObj.selectedDate = ''
                        //$scope.hidebutton = true
                        $ionicLoading.hide()
                        return
                    }
                }
            }
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
    if (!angular.equals({}, $scope.result)) {
        $scope.onload();
    }
    else {
        $scope.hidebutton = true;
        $scope.attendanceRegularObj.selectedDate = '';
    }
    $scope.apply = function () {
        if ($scope.selectedValues.nextDayVal == false) {
            if ($scope.inTimeStr > $scope.outTimeStr) {
                if ($scope.possiblyNightShit == "false") {
                    showAlert("“To time” should be greater than “from time”")
                    return;
                }
            }
        }

        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure',
            template: 'Do you want to send for approval?', //Message
        });
        confirmPopup.then(function (res) {
            if (res) {
                if ($scope.nextDayFeature == 'true') {
                    $scope.validateNextDay();
                    return
                }
                if (getMyHrapiVersionNumber() >= 24) {
                    $scope.validateData();
                } else {
                    $scope.sendForApproval()
                }
                //$scope.sendForApproval()
                return
            } else {
                $scope.attendanceRegularObj.timeIn = ''
                $scope.attendanceRegularObj.timeOut = ''
                return;
            }
        });
    }

    $scope.setNextDay = function () {

        if ($scope.selectedValues.nextDayVal) {
            $scope.selectedValues.nextDayVal = false;
        }
        else {
            $scope.selectedValues.nextDayVal = true;
        }
        //alert(    $scope.selectedValues.nextDayVal)


    }



    /*
    $scope.validate = function (){
        //var rows=document.form1.checkDateCode;
       
       var lengthNew = data.missedPunchForm.missedPunchVOList.length 
       var count=0;
       var text="";
       
  
       
                 var lastRecord = lengthNew - 1;
                  var currentdate = new Date();
                  var selectedMonthId = document.getElementById("monthId").value;
                  var currentMonthId = currentdate.getMonth()+1;
                  
                  for(var i=selfRecordsDataInfo.start;i<selfRecordsDataInfo.end;i++){
    
                      if(document.getElementById("checkDateCode"+i).value == 'true'){
    
                          var attDate = $("#attDate"+i).val();
                          if($("#shiftType"+i).val() == "Night"){
                              
             
                          var outTimeDate = $("#outTimeDateStr"+i).val();
                  
                      var from = outTimeDate.split("/")
                  var outTimeDateFormatted = new Date(from[2], from[1] - 1, from[0])
                  var outTimeDateMilli = outTimeDateFormatted.setDate(outTimeDateFormatted.getDate()+ 1);
                    var fomatMilli = new Date(outTimeDateMilli);
                var dd="";
                var mm="";
                 // fomatMilli.setMonth(fomatMilli.getMonth()+1)
                  if (fomatMilli.getDate() < 10) {
                    dd = '0' + fomatMilli.getDate();
                  }
                                  else{
                                      dd = fomatMilli.getDate();
                                  }
  //				alert(fomatMilli.getMonth()+1 )
                  if (fomatMilli.getMonth()+1 < 10) {
                      mm = '0' + (parseInt(fomatMilli.getMonth())+1);
                  }
                  else{
                      mm = parseInt(fomatMilli.getMonth())+1;
                  }
                  
                    outTimeDate =  dd +"/"+ mm +"/"+ fomatMilli.getFullYear();
                          }
                          else{
                          var outTimeDate = $("#outTimeDateStr"+i).val();
                          }
                         
                         var fmt = $("#DateFormat").val();
                     //	document.getElementById("inTimeStr"+i).disabled = false;
                     //	document.getElementById("outTimeStr"+i).disabled = false;
                     //	document.getElementById("outTimeDateStr"+i).disabled = false;
                // alert(outTimeDate)
                         if(isValidDateFormatNew(outTimeDate) == false){
                            text+="Please enter proper Out Time Date for Date\n"+$("#attDate"+i).val(); 
                        } 
                      else{	 
                            if(compareDate(attDate.substring(0, 10),outTimeDate,fmt) != -1){
                            var flag=0;	
                                
                          $.ajax({
                                   url: "${pageContext.request.contextPath}/attendance/missPunch/validateForOD.spr",
                                type: 'POST',
                                data: {'empId': $("#loginEmpId").val(),'attDate':attDate.substring(0, 10)},
                                dataType: 'text',
                                async: false,
                                success:function(result){
                                      if(result==''){ 
                                          flag=1;
                                      }
                                }
                               }); 
                          if(flag !=1){
                              var enterdInTime = document.getElementById("inTimeStr"+i).value;
                                    var enterdOutTime = document.getElementById("outTimeStr"+i).value;
                              if((enterdInTime != "") && (enterdOutTime != "")){
                                       if(compareDate(attDate.substring(0, 10),outTimeDate,fmt) == 0){
                                           if(compareTime(enterdInTime,enterdOutTime) == 0){
                                               text += "\n Time In should be less than Time Out for Date "+$("#attDate"+i).val();
                                           }
                                       }
                                   }
                              else if((enterdInTime == '') && (enterdOutTime == '')){
                                       text += "\n Please enter Time In and Time Out for Date "+$("#attDate"+i).val();
                                  }
                                   else if((enterdInTime == "") && (enterdOutTime != "")){
                                      text += "\n Please enter Time In for Date "+$("#attDate"+i).val();
                                  }
                                   else if((enterdInTime != "") && (enterdOutTime == "")){
                                      text += "\n Please enter Time Out for Date "+$("#attDate"+i).val();
                                  }
                          }
                                if(flag ==1 && daydiff(attDate.substring(0, 10),outTimeDate) <= 31){
                                    var fs = $("#firstHalf"+i).val();
                                   var ss = $("#secondHalf"+i).val();
                                     var enterdInTime = document.getElementById("inTimeStr"+i).value;
                                        var enterdOutTime = document.getElementById("outTimeStr"+i).value;
                                       var actualInTimeStr = document.getElementById("actualInTimeStr"+i).value;
                                       var actualOutTimeStr = document.getElementById("actualOutTimeStr"+i).value;
                                       if((actualInTimeStr != "--:--") && (actualOutTimeStr != "--:--")){
                                          if(compareDate(attDate.substring(0, 10),outTimeDate,fmt) == 0){
                                               if(compareTime(actualInTimeStr,enterdInTime) == 1 && (fs =='Absent' || fs =='Present' )){
                                                   text += "\n Time In(Modified) should be less than Actual Time In for Date "+$("#attDate"+i).val();
                                               }
                                               if(compareTime(actualOutTimeStr,enterdOutTime) == 0 && (ss =='Absent' || ss =='Present' )){
                                                   text += "\n Time Out(Modified) should be greater than Actual Time Out for Date "+$("#attDate"+i).val();
                                               }
                                           }
                                      }
                                       if((enterdInTime != "") && (enterdOutTime != "")){
                                           if(compareDate(attDate.substring(0, 10),outTimeDate,fmt) == 0){
                                               if(compareTime(enterdInTime,enterdOutTime) == 0){
                                                   text += "\n Time In should be less than Time Out for Date "+$("#attDate"+i).val();
                                               }
                                           }
                                       }
                                       else if((enterdInTime == '') && (enterdOutTime == '')){
                                           text += "\n Please enter Time In and Time Out for Date "+$("#attDate"+i).val();
                                      }
                                       else if((enterdInTime == "") && (enterdOutTime != "")){
                                          text += "\n Please enter Time In for Date "+$("#attDate"+i).val();
                                      }
                                       else if((enterdInTime != "") && (enterdOutTime == "")){
                                          text += "\n Please enter Time Out for Date "+$("#attDate"+i).val();
                                      }
                                      else{
                                      
                                           if((enterdInTime == "") && (actualInTimeStr == "")){
                                               text += "\n Please enter Time In For Date "+$("#attDate"+i).val();
                                           }
                                           else if((enterdOutTime == "") && (actualOutTimeStr == "")){
                                               text += "\n Please enter Time Out For Date "+$("#attDate"+i).val();	
                                           }
                                           else if(enterdOutTime == ""){
                                                if(compareDate(attDate.substring(0, 10),outTimeDate,fmt) == 0){
                                                   if(compareTime(enterdInTime,actualOutTimeStr)==0){
                                                       text += "\n Time In should be less than Actual Time Out for Date "+$("#attDate"+i).val();
                                                   }
                                               }
                                           }
                                           else if(enterdInTime == ""){
                                               if(compareDate(attDate.substring(0, 10),outTimeDate,fmt) == 0){
                                                   if(compareTime(actualInTimeStr,enterdOutTime)==0){
                                                       text += "\n Time Out should be greater than Actual Time In for Date "+$("#attDate"+i).val();
                                                   }
                                               }
                                           }
                                       }
                                       
                                   if(enterdInTime == actualInTimeStr && enterdOutTime == actualOutTimeStr ){
                                  text += "\n Modified In/Out Time and Actual In/out Time can not be same for the Date "+$("#attDate"+i).val();
                              }	
                              //	alert("hjhjj -- "+$("#status"+i).val())
                              if($("#status"+i).val() == 'SENT FOR APPROVAL'){
                                  //alert("in in")
                                  text += "\n Already Sent For Approval for Date "+$("#attDate"+i).val();
                              }
                          }// else{
                           //   text += "\n Out Time Date can not be more than one day of Date "+$("#attDate"+i).val();
                          //} 
                      }else{
                          text += "\n Out Time Date can not be less than Date "+$("#attDate"+i).val();
                      }
                  }
                     if(compareTime(document.getElementById("inTimeStr"+i).value,document.getElementById("outTimeStr"+i).value)==2)
                     {
                         text += "\n In and Out Time can not be same ";
                     }
                  var remarks = $("#purpose"+i).val();
                  if(remarks == -1){
                      text += "\n Please select remarks for Date "+$("#attDate"+i).val();
                  }
                  if(remarks == 'OTH'){
                      if($("#othRemarks"+i).val() == ''){
                          $("#othRemarks"+i).val('OTH');
                      }
                  }
                  if(document.getElementById("inTimeStr"+i).value != "" && document.getElementById("inTimeStr"+i).value != "--:--"){
                      if(isValidTime(document.getElementById("inTimeStr"+i).value) == false){
                          text+="\n Please enter proper time in for Date "+$("#attDate"+i).val();
                      }
                  }
              
                  if(document.getElementById("outTimeStr"+i).value != "" && document.getElementById("outTimeStr"+i).value != "--:--"){
                      if(isValidTime(document.getElementById("outTimeStr"+i).value) == false){
                          text+="\n Please enter proper time out for Date "+$("#attDate"+i).val();
                      }
                      }	
              }
              
          }
      
      //alert("return -- "+text)
      return text;
  }

*/


    $scope.validateData = function () {
        ////////////////////// validate here ////////////////
        var fd = new FormData();
        fd.append("empId", sessionStorage.getItem('empId'))
        fd.append("menuId", $scope.attendanceObject.menuId)
        fd.append("attDate", $scope.attendanceRegularObj.selectedDate)

        $.ajax({
            url: (baseURL + '/api/attendance/missPunch/validateAttRule.spr'),
            data: fd,
            type: 'POST',
            async: false,
            timeout: 40000,
            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
            },
            success: function (success) {
                //alert("rajesh "+ success)
                if (!(success.clientResponseMsg == "OK")) {
                    console.log(data.clientResponseMsg)
                    handleClientResponse(data.clientResponseMsg, "validateAttRule")
                    showAlert("Something went wrong. Please try later.")
                    return
                }
                if (success.msg == "") {
                    //this is success
                    $scope.sendForApproval()
                } else {
                    $ionicLoading.hide()
                    showAlert(success.msg)
                    return
                }
            },
            error: function (e) { //alert("Server error - " + e);
                alert(e.status)
                $ionicLoading.hide()
                $scope.data_return = { status: e };
                commonService.getErrorMessage($scope.data_return);
                return;
            }
        });
        ////////////////////////////////////

    }




    $scope.validateNextDay = function () {
        var isNextDay = $scope.selectedValues.nextDayVal;
        var flag = null;
        var attDateObj = document.getElementById("toDate");
        var attDate = "";
        attDate = attDateObj.value
        var eid = sessionStorage.getItem('empId')

        var fd = new FormData()
        fd.append("empId", eid)
        fd.append("attDate", attDate)

        //=====
        // alert(baseURL + '/api/attendance/missPunch/validateForNextDay.spr')
        $.ajax({
            url: baseURL + '/api/attendance/missPunch/validateForNextDay.spr',
            data: fd,
            dataType: 'json',
            timeout: commonRequestTimeout,
            type: 'POST',
            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
            }, success: function (result) {
                if (!(result.clientResponseMsg == "OK")) {
                    console.log(result.clientResponseMsg)
                    handleClientResponse(result.clientResponseMsg, "validateAttRule")
                    showAlert("Something went wrong. Please try later.")
                    return
                }


                if (result.result == 'Y') {
                    flag = 1;
                }
                if ((isNextDay != null && isNextDay == true) || flag == 1) {
                    nextDay = "Y";
                } else {
                    nextDay = "N";
                }

                if (nextDay == "N") {
                    //var text = validate();
                    var text = '';
                } else {
                    var text = '';
                }
                var attDate = "";
                var resultArr = ['Your Attendance Regularization is Auto Approved', 'WorkFlow is not defined']

                if (text == '') {
                    //alert("goSendForApproveAjax -- "+text);

                    //var rows=document.form1.checkDateCode;
                    var lengthNew = 1
                    //  var selfRecordsDataInfo = selfRecordsData.page.info();
                    // for(var i=selfRecordsDataInfo.start;i<selfRecordsDataInfo.end;i++){
                    //  	if((document.getElementById("checkDateCode"+i).checked)){
                    //  	document.getElementById("inTimeStr"+i).disabled = false;
                    //  	document.getElementById("outTimeStr"+i).disabled = false;
                    //  	document.getElementById("outTimeDateStr"+i).disabled = false;

                    //  	}
                    // }
                    // for(var i=selfRecordsDataInfo.start;i<selfRecordsDataInfo.end;i++){
                    // 	if(document.getElementById("checkDateCode"+i).value == 'true'){
                    //  	 		 attDate = $("#attDate"+i).val();
                    // 	}
                    // }
                    // alert("dfdgdg")
                    var arr = [];
                    //alert(document.getElementById("buttonRights").value)
                    var fd = new FormData()
                    var missPunch = new Object();

                    missPunch.attDate = $scope.attendanceRegularObj.selectedDate  //$scope.onloadRequestObj.attDate


                    missPunch.menuId = attendanceMenuInfo.menuId
                    missPunch.level = 1; // consider as a level value 
                    missPunch.inTimeStr = $scope.inTimeStr
                    missPunch.outTimeStr = $scope.outTimeStr
                    missPunch.empId = sessionStorage.getItem('empId')
                    missPunch.buttonRights = 'Y-Y-Y-Y'
                    /*missPunch.navigation =$("#param"+id).val(); */
                    missPunch.IsAssign = 'Y'
                    missPunch.shiftMasterChild = $scope.onloadResponseObj.shiftMasterChild
                    missPunch.shiftType = $scope.onloadResponseObj.shiftType
                    missPunch.outTimeDateStr = $scope.attendanceRegularObj.selectedDate
                    missPunch.actualInTimeStr = $scope.onloadResponseObj.actualInTimeStr
                    missPunch.actualOutTimeStr = $scope.onloadResponseObj.actualOutTimeStr
                    missPunch.year = $scope.result.year
                    missPunch.remark = ""
                    missPunch.fromEmail = "N";
                    //missPunch.firstHalfStatus=   // web has data
                    //missPunch.secondHalfStatus=$("#secondHalf"+index).val();

                    if ($scope.selectedValues.nextDayVal) {
                        missPunch.newDay = "Y";
                    }
                    else {
                        missPunch.newDay = "N";
                    }


                    var status = $scope.onloadResponseObj.status
                    //alert(status)

                    missPunch.OthRemark = ""

                    missPunch.applicantComments = ""
                    //arr.push(missPunch);
                    //alert(JSON.stringify(arr))
                    var resultStr = "";
                    fd.append("form", JSON.stringify(missPunch))
                    //********************************* validation time **********************************************

                    //var pageUrl= "${pageContext.request.contextPath}/attendance/missPunch/isValidTime.spr";
                    var pageUrl = baseURL + "/api/attendance/missPunch/isValidTime.spr";
                    $.ajax({
                        url: pageUrl, method: "post",
                        data: fd,
                        type: 'POST',
                        dataType: 'json',
                        timeout: commonRequestTimeout,
                        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                        processData: false, // NEEDED, DON'T OMIT THIS
                        headers: {
                            'Authorization': 'Bearer ' + jwtByHRAPI
                        },
                        success: function (result) {
                            //alert(result)
                            if (!(result.clientResponseMsg == "OK")) {
                                console.log(result.clientResponseMsg)
                                handleClientResponse(result.clientResponseMsg, "validateAttRule")
                                showAlert("Something went wrong. Please try later.")
                                return
                            }


                            if (result.isValidTime == '') {
                                //alert("")
                                $scope.sendForApproval();

                            } else {

                                result = result.isValidTime + " Still you want to continue?"
                                var confirmPopup = $ionicPopup.confirm({
                                    title: 'Are you sure',
                                    template: result, //Message
                                });
                                confirmPopup.then(function (res) {
                                    if (res) {
                                        $scope.sendForApproval()
                                    } else {
                                        return
                                    }
                                });
                            }




                        }// **************************************** valid time code ************************************
                    });
                } else {
                    showAlert(text)
                }

                //**************************************** valid time code end ************************************
            },

            error: function (res) {
                alert(res.data)
                console.log(res.status);


            }
        });
    }



    $scope.sendForApproval = function () {
        $ionicLoading.show({});

        $scope.sendForApproveRequestObject = {}
        $scope.sendForApproveRequestObject.missedPunchVOList = []
        var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");
        $scope.sendForApproveRequestObject.menuId = attendanceMenuInfo.menuId;
        $scope.sendForApproveRequestObject.buttonRights = "Y-Y-Y-Y"
        var temp = {}
        //data send for anpproved
        if (!$scope.onloadResponseObj.attDate) {
            $ionicLoading.hide()
            showAlert("Attendance regularization ", "Either shift not available or locking period passed away for selected criteria");
            return;
        }
        temp.attDate = $scope.onloadResponseObj.attDate
        temp.fhOLStatus = $scope.onloadResponseObj.fhOLStatus
        temp.shOLStatus = $scope.onloadResponseObj.shOLStatus
        temp.isODPresent = $scope.onloadResponseObj.isODPresent
        temp.isLeavePresent = $scope.onloadResponseObj.isLeavePresent
        temp.firstHalf = $scope.onloadResponseObj.firstHalf
        temp.secondHalf = $scope.onloadResponseObj.secondHalf
        temp.actualInTimeStr = $scope.onloadResponseObj.actualInTimeStr
        temp.actualOutTimeStr = $scope.onloadResponseObj.actualOutTimeStr
        temp.lateComming = $scope.onloadResponseObj.lateComming
        temp.inTimeStr = $scope.inTimeStr
        temp.outTimeStr = $scope.outTimeStr
        temp.earlyGoing = $scope.onloadResponseObj.earlyGoing
        temp.outTimeDateStr = $scope.attendanceRegularObj.selectedDate
        temp.shiftMasterChild = $scope.onloadResponseObj.shiftMasterChild


        temp.remarks = $scope.attendanceRegularObj.remarks
        temp.status = $scope.onloadResponseObj.status
        temp.transId = $scope.onloadResponseObj.transId

        temp.shiftType = $scope.onloadResponseObj.shiftType

        temp.isAssign = true
        temp.appRemarks = " ";
        temp.othRemarks = ""
        temp.applicantComments = ""

        if ($scope.attendanceRegularObj.othRemarks) {
            temp.othRemarks = $scope.attendanceRegularObj.othRemarks;
        } else {
            temp.othRemarks = "OTH"
        }



        //if (!$scope.attendanceRegularObj.applicantComments === undefined){
        //	temp.applicantComments = $scope.attendanceRegularObj.applicantComments;
        //}
        temp.applicantComments = $scope.attendanceRegularObj.applicantComments;

        if ($scope.utf8Enabled == 'true' && $scope.attendanceRegularObj) {
            if ($scope.attendanceRegularObj.remarks) {
                $scope.attendanceRegularObj.remarks = encodeURI($scope.attendanceRegularObj.remarks)
            }
            if ($scope.attendanceRegularObj.applicantComments) {
                $scope.attendanceRegularObj.applicantComments = encodeURI($scope.attendanceRegularObj.applicantComments)
            }
            if ($scope.attendanceRegularObj.othRemarks) {
                $scope.attendanceRegularObj.othRemarks = encodeURI($scope.attendanceRegularObj.othRemarks)
            }
        }
        temp.remarks = $scope.attendanceRegularObj.remarks
        temp.applicantComments = $scope.attendanceRegularObj.applicantComments;
        temp.remarothRemarksks = $scope.attendanceRegularObj.othRemarks
        temp.workedHrs = $scope.onloadResponseObj.workedHrs

        if ($scope.selectedValues.nextDayVal) {
            temp.newDay = "Y"
        }
        else {
            temp.newDay = "N"
        }



        $scope.sendForApproveRequestObject.missedPunchVOList.push(temp)
        $scope.sendForApproveRequestObject.leaveAppId = 216
        $scope.sendForApproveRequestObject.odAppId = 212
        $scope.sendForApproveRequestObject.year = $scope.result.year
        $scope.sendForApproveRequestObject.monthId = $scope.result.month
        $scope.sendForApproveRequestObject.sendForApp = "YES"
        $scope.sendForApproveRequestObject.level = 1






        $http({
            url: (baseURL + '/api/attendance/missPunch/sendForApprove.spr'),
            method: 'POST',
            timeout: commonRequestTimeout,
            transformRequest: jsonTransformRequest,
            data: $scope.sendForApproveRequestObject,
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).
            success(function (data) {
                var masgBefore = data.msg
                var masgAfter = masgBefore.replace(/\\n/g, "");
                $ionicLoading.hide()
                showAlert("Attendance regularization ", masgAfter)
                // removed following 3 lines, because after regularisation, if we come
                // again on this page , connection error was showing.
                //$scope.resultSaveObj = {}
                //$scope.resultSaveObj.check = "Regularization";
                //getSetService.set($scope.resultSaveObj)

                //$state.go('app.RequestList')
                $scope.redirectOnBack()
            }).error(function (data, status) {
                $scope.data = { status: status };
                commonService.getErrorMessage($scope.data);
                $ionicLoading.hide()
            })
    }
    $scope.editAttendanceRegularization = function () {
        if ($scope.onloadResponseObj.actualInTimeStr == "--:--" && $scope.onloadResponseObj.actualOutTimeStr == "--:--") {
            $scope.requestObject = {}
            $scope.requestObject.shiftChildId = $scope.onloadResponseObj.shiftMasterChild;
            $scope.requestObject.attDate = $scope.onloadResponseObj.attDate;
            $scope.getShiftTimeService = new getShiftTimeService();
            $scope.getShiftTimeService.$save($scope.requestObject, function (data) {
                //$scope.inTimeStr = data.missedPunchVO.inTimeStr
                //$scope.outTimeStr = data.missedPunchVO.outTimeStr

                $scope.actualInTimeStr = data.missedPunchVO.inTimeStr
                $scope.actualOutTimeStr = data.missedPunchVO.outTimeStr

                $scope.actualTimeInStr = data.missedPunchVO.actualInTimeStr
                $scope.actualTimeOutStr = data.missedPunchVO.actualOutTimeStr
                //for making them blank
                //$scope.inTimeStr = ""
                //$scope.outTimeStr = ""

                if ($scope.actualInTimeStr > $scope.actualOutTimeStr) {
                    $scope.possiblyNightShit = "true"
                } else {
                    $scope.possiblyNightShit = "false"
                }

            }, function (data) {
                autoRetryCounter = 0
                $ionicLoading.hide()
                commonService.getErrorMessage(data);
            });
        }
        $scope.editable = false;
    }
    $scope.setFromDate = function () {
        var date;
        if ($scope.attendanceRegularObj.selectedDate == undefined) {
            $scope.attendanceRegularObj.selectedDate = "";
        }
        if ($scope.attendanceRegularObj.selectedDate != "") {
            var parts = $scope.attendanceRegularObj.selectedDate.split('/');
            $scope.fDate = new Date(parts[2], parts[1] - 1, parts[0]);
        }
        if ($scope.fDate == null) {
            date = new Date();
        }
        else {
            date = $scope.fDate;
        }
        var options = { date: date, mode: 'date', titleText: 'Date', androidTheme: 4 };
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                $scope.filteredSelectedCalDate = new Date(date)
                $scope.lockingPeriod = sessionStorage.getItem('lockingPeriod');
                $scope.todaysDate = new Date();
                $scope.filteredtodaysDat = new Date($scope.todaysDate)
                $scope.lockingPeriodDate = $scope.todaysDate.setMonth($scope.todaysDate.getMonth() - $scope.lockingPeriod);
                $scope.filteredLockingDate = new Date($scope.lockingPeriodDate)

                if (($scope.filteredSelectedCalDate <= $scope.filteredLockingDate)) {

                    $scope.hidebutton = true;
                    $scope.attendanceRegularObj.selectedDate = '';
                    showAlert("Either shift not available or locking period passed away for selected criteria");
                    $ionicLoading.hide()
                }
                else if (($scope.filteredtodaysDat < $scope.filteredSelectedCalDate)) {

                    $scope.hidebutton = true;
                    $scope.attendanceRegularObj.selectedDate = '';
                    showAlert("You cannot apply attendance regularization for future date");
                    $ionicLoading.hide()
                }
                else if (($filter('date')($scope.filteredtodaysDat, 'yyyy/MM/dd')) == ($filter('date')($scope.filteredSelectedCalDate, 'yyyy/MM/dd'))) {

                    $scope.hidebutton = true;
                    $scope.attendanceRegularObj.selectedDate = '';
                    showAlert("You cannot regularization for current date");
                    $ionicLoading.hide()
                }
                else {
                    $scope.fDate = date

                    $scope.attendanceRegularObj.selectedDate = $filter('date')(date, 'dd/MM/yyyy');
                    $scope.onloadRequestObj.attendanceDate = $filter('date')(date, 'MM/dd/yyyy');
                    $scope.result.year = date.getFullYear();
                    $scope.result.month = date.getMonth() + 1;
                    $scope.hidebutton = false;
                    if ($scope.showPunchDetailsFeature == 'true') {
                        $scope.getPunches($scope.attendanceRegularObj.selectedDate, $scope.attendanceRegularObj.selectedDate, sessionStorage.getItem('empId'), '', '')
                    }

                    $scope.$apply();
                    $scope.onload();


                }
            }
        }, function (error) {
        });
        $scope.inTimeStr = '';
        $scope.outTimeStr = '';
        $scope.editable = true;
    }
    $scope.setTimeIn = function () {
        var date = new Date();
        if ($scope.inTimeStr != "") {
            var timePart = $scope.inTimeStr.split(':');
            date.setHours(timePart[0]);
            date.setMinutes(timePart[1]);
        }
        var options = { date: date, mode: 'time', titleText: 'Time In', androidTheme: 4 };
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                $scope.inTimeStr = $filter('date')(date, 'HH:mm');
                $scope.onloadResponseObj.inTimeStr = $scope.inTimeStr
                $scope.TimeInObj = date
                $scope.$apply();
            }
        }, function (error) {
        });
    }
    $scope.setTimeOut = function () {
        var date = new Date();
        if ($scope.outTimeStr != "") {
            var timePart = $scope.outTimeStr.split(':');
            date.setHours(timePart[0]);
            date.setMinutes(timePart[1]);
        }
        var options = { date: date, mode: 'time', titleText: 'Time Out', androidTheme: 4 };
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                if ($scope.inTimeStr) {
                    if (date < $scope.TimeInObj) {
                        if ($scope.possiblyNightShit == "false") {
                            //showAlert("“To time” should be greater than “from time”")
                            //return
                        }
                    }
                }
                $scope.outTimeStr = $filter('date')(date, 'HH:mm');
                $scope.onloadResponseObj.outTimeStr = $scope.outTimeStr
                $scope.TimeOutObj = date
                $scope.$apply();
            }
        }, function (error) {
        });
    }


    $scope.redirectOnBack = function () {

        $rootScope.monthForAttRegList = $scope.result.month
        $rootScope.yearForAttRegList = $scope.result.year
        $state.go('requestRegularizationList')

        //$ionicNavBarDelegate.back();
        //$scope.result.check = "Regularization";
        //getSetService.set($scope.result);
        //$state.go('app.RequestList');
    }


});

