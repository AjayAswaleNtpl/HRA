

mainModule.controller('approvalTimesheetEmployeeDailyListCtrl', function ($scope, $rootScope, commonService, $ionicHistory, $window,
    $rootScope, $ionicPopup, $state, $http, $q, $filter, $ionicLoading, addTravelApplicationService, $timeout,
    $ionicNavBarDelegate, getTravelRuleService) {


    $rootScope.navHistoryPrevPage = "approvalsNew"
    $scope.empId = sessionStorage.getItem("empId")
    $scope.companyId = sessionStorage.getItem("companyId")
    $scope.timeSheetDataMap = {};
    $scope.listYear;
    $scope.listMonth;
    $scope.index = 0;
    $scope.index1 = 0;
    $scope.headerList = [];

    $scope.selectedValue = {};
    $scope.selectedCheckboxIndex = [];
    $scope.employeeCodes = [];
    $scope.multiSendList = [];
    $scope.multiApproveList = [];
    $scope.multiRejectList = [];
    $scope.multiRejectList2 = [];
    $scope.jsonMultiSendList;
    $scope.jsonMultiApproveList;
    $scope.jsonMultiRejectList;
    $scope.jsonMultiApproveList2;


    $scope.selectedMonth = ""
    $scope.selectedYear = ""

    $scope.init = function () {
        $ionicLoading.show()
        $timeout(function () {
            var fd = new FormData();
            fd.append("companyId", $scope.companyId)
            fd.append("empId", $scope.empId)

            fd.append("menuId", "3305")

            if ($scope.selectedMonth == "") {
                var today;
                //date todays month and yezar
                // var elemMonth = document.getElementById("month");
                // elemMonth.options[elemMonth.selectedIndex].value="8";
                if ($rootScope.dateTransferFromTimesheetList) {
                    // var today = new Date($rootScope,niTransferFromTimesheetList)
                    var d = $rootScope.dateTransferFromTimesheetList.split("-");
                    var t = d[2] + "-" + d[1] + "-" + d[0]
                    today = new Date(t);
                    $rootScope.dateTransferFromTimesheetList = null
                } else {
                    var today = new Date()
                }

                var currentMonth = (today.getMonth() + 1) + ""
                // var currentYear = (today.getFullYear())+""
                $scope.selectedValue.selectedMonth = currentMonth;

                // $scope.selectedValue.selectedYear=currentYear
                $scope.selectedMonth = currentMonth;

            }
            if ($scope.selectedYear == "") {
                var today = new Date();
                var currentYear = (today.getFullYear()) + ""

                $scope.selectedYear = currentYear;
                $scope.selectedValue.selectedYear = currentYear
                //
            }

            fd.append("monthId", $scope.selectedMonth)
            fd.append("year", $scope.selectedYear)
            fd.append("changeMonth", "approveTab")

            
            $.ajax({
                url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/viewTimeSheetEmployeeDaily.spr'),
                data: fd,
                type: 'POST',
                async: true,
                timeout: commonRequestTimeout,
                contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                processData: false, // NEEDED, DON'T OMIT THIS
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                },
                success: function (success) {
                    //alert("scuc")
                    if (!(success.clientResponseMsg == "OK")) {
                        console.log(success.clientResponseMsg)
                        handleClientResponse(success.clientResponseMsg, "viewTimeSheetEmployeeDaily")
                        $ionicLoading.hide()
                        showAlert("Something went wrong. Please try later.")
                        //$scope.redirectOnBack();
                        return
                    }
                    $scope.employees = success.empToTHrs;
                    $scope.approverTimeSheetDataMap = success.approverTimeSheetDataMap;
                    $scope.approverTimeSheetDataMapTemp = success.approverTimeSheetDataMap;


                    //    if (!$scope.$$phase)
                    //     $scope.$apply()

                    //     $timeout(function () {
                    //         $scope.fillData();
                    //         $ionicLoading.hide()
                    //     }, 500)
                    $scope.listYear = success.listYear;
                    //alert(success.listYear[0].value)
                    $scope.listMonth = success.listMonth;

                    $scope.size = success.size;

                    $scope.headerList = new Array($scope.size);

                    //if (!$scope.$$phase)
                    //    $scope.$apply()
                    $ionicLoading.hide()
                    $timeout(function () {
                        $scope.fillData();
                        

                    }, 1000)



                    /*
                                            $scope.headerList[0].date = "01-08-2020";
                                            $scope.headerList[0].status = "SAVED";
                                            $scope.headerList[0].totHrs = "3:14";
                                            $scope.headerList[0].day = "Mon";
                
                                            $scope.headerList[1].date = "02-08-2020";
                                            $scope.headerList[1].status = "SENT FOR APPROVAL";
                                            $scope.headerList[1].totHrs = "5:14"
                
                                            $scope.headerList[2].date = "03-08-2020";
                                            $scope.headerList[2].status = "CANCELLED";
                                            $scope.headerList[2].totHrs = "6:14"
                
                */






                },
                error: function (e) { //alert("Server error - " + e);
                    //alert(e.status)
                    $ionicLoading.hide()
                    $scope.data_return = { status: e };
                    commonService.getErrorMessage($scope.data_return);

                }
            });
        }, 1000)

    }
    /*
    $scope.setTotalNoOfHours=function(){
        for (var i = 1;i <= $scope.size;i++){
            

                            var dtpart;
                            var mpart;
                            var dtformat;
                            var d= new Date();
                            var tot=0;
                            var hrsArr;
                            var hours;

                            
                            
                            if (i <= 9)    ddpart = "0"+ i;
                            else   ddpart = i + ""

                            if (Number($scope.selectedMonth) <= 9)    mpart = "0"+ $scope.selectedMonth;
                            else   mpart = $scope.selectedMonth

                            dtformat = ddpart + "-" + mpart + "-" + $scope.selectedYear
                            for(k=0;k<$scope.timeSheetDataMap[dtformat].length;k++){
                                hours = $scope.timeSheetDataMap[dtformat][k].noOfHrs;
                                
                                hrsArr = hours.split(':');
                                hours = Number(hrsArr[0]) * 60 + Number(hrsArr[1]);
                                tot = tot + hours;

                            }
                            
                            for(timesheet in $scope.timeSheetDataMap[dtformat]){
                             hours = timesheet.noOfHrs;
                                hrsArr = hours.split(':');
                                hours = Number(hrsArr[0]) * 60 + Number(hrsArr[1]);
                                 tot = tot + hrs;
                            }
                            
                            var m = tot % 60;
                            var h = (tot - m) / 60;
                            var HHMM = h.toString() + ":" + (m < 10 ? "0" : "") + m.toString();
                            return HHMM
        }

    }
    */
    $scope.goToRequisitions = function () {
        $state.go("requestTimesheetEmployeeDailyList")
    }
    $scope.fillData = function () {

        
        for (let k of Object.keys($scope.employees)) {

            var ifAnyRecordIsSentFor = "false"
            for (let key of Object.keys($scope.approverTimeSheetDataMap[k])) {
                if ($scope.approverTimeSheetDataMap[k][key][0] === undefined){
                    continue;
                }
                val = $scope.approverTimeSheetDataMap[k][key][0].status
                if (val == "APPROVED") {
                    document.getElementById("header_" + k + "_" + key).style.backgroundColor = "#ccffcc"

                    document.getElementById("remSubTabApprove_" + k + "_" + key).style.display = "none";
                    document.getElementById("appRejButton_" + k + "_" + key).style.display = "none";
                }
                else if (val == "REJECTED") {
                    document.getElementById("header_" + k + "_" + key).style.backgroundColor = "#ff9999"
                    document.getElementById("remSubTabReject_" + k + "_" + key).style.display = "none";
                    document.getElementById("appRejButton_" + k + "_" + key).style.display = "none";
                }
                else if (val == "SENT FOR APPROVAL") {
                    ifAnyRecordIsSentFor = "true"
                }

            }
            if (ifAnyRecordIsSentFor == "true") {
                document.getElementById("EmpNameHeader_" + k).style.backgroundColor = "#ffffb3"

            } else {
                document.getElementById("EmpNameHeader_" + k).style.backgroundColor = "#5cb85c"
            }
        }
        $ionicLoading.hide()
    }
    // $scope.selectAll = function(){
    //     for(i=0;i<$scope.size;i++){
    //         var stat = document.getElementById("status_"+i).innerHTML
    //         if(stat=="SAVED"){
    //             document.getElementById("approve_"+i).checked = true
    //             $scope.selectedCheckboxIndex.push(i);
    //         }
    //     }
    //     console.log($scope.selectedCheckboxIndex);
    // }
    $scope.selectAll = function () {
        if (!(document.getElementById("selectAll").checked)) {
            for (let key in $scope.employees) {
                document.getElementById("checkbox_" + key).checked = false

            }
            $scope.employeeCodes = [];
        } else {

            for (let key in $scope.employees) {
                var counter = 0;
                document.getElementById("checkbox_" + key).checked = true
                for (i = 0; i < $scope.employeeCodes.length; i++) {
                    if ($scope.employeeCodes[i] == key) {
                        counter++
                    }
                }
                if (counter < 1) {
                    $scope.employeeCodes.push(key);
                } else {

                }

            }
        }


    }
    $scope.deselectCheckbox = function (k) {

        if (!(document.getElementById("checkbox_" + k).checked)) {

            for (i = 0; i < $scope.employeeCodes.length; i++) {
                if ($scope.employeeCodes[i] == k) {
                    $scope.employeeCodes.splice(i, 1);
                }

            }
            console.log($scope.employeeCodes);

        }
        else {
            var count = 0;
            for (i = 0; i < $scope.employeeCodes.length; i++) {
                if ($scope.employeeCodes[i] == k) {
                    count++
                }

            }
            if (count < 1) {
                $scope.employeeCodes.push(k)
            } else {

            }


            console.log($scope.employeeCodes);
        }

    }
    $scope.openOnTapColor = function () {
        if (document.getElementById("colorCodeInner").style.display == 'none') {
            document.getElementById("colorCodeInner").style.display = 'inline-block';
            document.getElementById("colorCode").innerHTML = "Hide Color Codes"
        } else {
            document.getElementById("colorCodeInner").style.display = 'none'
            document.getElementById("colorCode").innerHTML = "Show Color Codes"
        }
    }
    $scope.openDateListForEmp = function (k) {
        if (document.getElementById("empDateList_" + k).style.display == 'none') {
            document.getElementById("empDateList_" + k).style.display = 'inline-block'
        } else {
            document.getElementById("empDateList_" + k).style.display = 'none'
        }
    }
    $scope.openDetailInfo = function (e, k) {
        if (document.getElementById("inner_div_" + e + "_" + k).style.display == 'none') {
            document.getElementById("inner_div_" + e + "_" + k).style.display = 'inline-block'
            document.getElementById("minusIcon_" + e + "_" + k).style.display = ''
            document.getElementById("plusIcon_" + e + "_" + k).style.display = 'none'
        } else {
            document.getElementById("inner_div_" + e + "_" + k).style.display = 'none'
            document.getElementById("minusIcon_" + e + "_" + k).style.display = 'none'
            document.getElementById("plusIcon_" + e + "_" + k).style.display = ''
        }
    }
    $scope.showRemarkDivApprove = function (employee, dateOfList) {

        if (document.getElementById("remSubTabApprove_" + employee + "_" + dateOfList).style.display == 'none') {
            document.getElementById("remSubTabApprove_" + employee + "_" + dateOfList).style.display = ''
            if (document.getElementById("remSubTabReject_" + employee + "_" + dateOfList).style.display == '') {
                document.getElementById("remSubTabReject_" + employee + "_" + dateOfList).style.display = 'none'
            }
        } else if (document.getElementById("remSubTabApprove_" + employee + "_" + dateOfList).style.display == '') {
            document.getElementById("remSubTabApprove_" + employee + "_" + dateOfList).style.display = 'none'
        }


    }
    $scope.showRemarkDivReject = function (employee, dateOfList) {

        if (document.getElementById("remSubTabReject_" + employee + "_" + dateOfList).style.display == 'none') {
            document.getElementById("remSubTabReject_" + employee + "_" + dateOfList).style.display = ''
            if (document.getElementById("remSubTabApprove_" + employee + "_" + dateOfList).style.display == '') {
                document.getElementById("remSubTabApprove_" + employee + "_" + dateOfList).style.display = 'none'
            }
        } else if (document.getElementById("remSubTabReject_" + employee + "_" + dateOfList).style.display == '') {
            document.getElementById("remSubTabReject_" + employee + "_" + dateOfList).style.display = 'none'
        }


    }
    $scope.approve = function (emplCode, dateOfList) {
        //var approverRemarks = documen.getElementById("approverRemark__"+emplCode+"_"+dateOfList).text;
        //var transId = document.getElementById("employeeId_"+emplCode+"_"+dateOfList);
        $scope.multiApproveList = new Array($scope.approverTimeSheetDataMap[emplCode][dateOfList].length);
        for (i = 0; i < $scope.approverTimeSheetDataMap[emplCode][dateOfList].length; i++) {
            $scope.multiApproveList[i] = {}
            $scope.multiApproveList[i].tranid = $scope.approverTimeSheetDataMap[emplCode][dateOfList][0].employeeId;
            $scope.multiApproveList[i].empid = emplCode;
            $scope.multiApproveList[i].remarks = document.getElementById("approverRemark_" + emplCode + "_" + dateOfList).value;
            $scope.multiApproveList[i].menuId = "3305"
        }
        $scope.jsonMultiApproveList = JSON.stringify($scope.multiApproveList);

        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure?',
            template: 'Do you want to  Approve', //Message
        });
        confirmPopup.then(function (res) {
            $ionicLoading.show()
            $timeout(function () {
                if (res) {
                    var fd = new FormData();
                    //  fd.append("tranid",timesheetEmployeeId);
                    // fd.append("menuid","3305");
                    // fd.append("remarks","1"); // this is hardcoded 
                    // fd.append("companyId",$scope.companyId); // later from session
                    //fd.append("isMultipleReq","Y")    
                    fd.append("reqJson", $scope.jsonMultiApproveList)

                    $.ajax({
                        url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/approve.spr'),
                        data: fd,
                        type: 'POST',
                        async: false,
                        timeout: commonRequestTimeout,
                        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                        processData: false, // NEEDED, DON'T OMIT THIS
                        headers: {
                            'Authorization': 'Bearer ' + jwtByHRAPI
                        },
                        success: function (success) {
                            //alert("scuc")
                            if ((success.includes("ERROR"))) {
                                console.log(success.clientResponseMsg)
                                handleClientResponse(success.clientResponseMsg, "uploadFileReviewerAjax")
                                $ionicLoading.hide()
                                //showAlert(success.clientResponseMsg)
                                //alert("ERROR")
                                showAlert("Something went wrong. Please try later.")
                                //$scope.redirectOnBack();
                                return
                            }
                            $ionicLoading.hide()
                            showAlert("Approved sucessfully")
                            document.getElementById("header_" + emplCode + "_" + dateOfList).style.backgroundColor = "#ccffcc";
                            document.getElementById("remSubTabApprove_" + emplCode + "_" + dateOfList).style.display = "none";
                            document.getElementById("appRejButton_" + emplCode + "_" + dateOfList).style.display = "none";
                            $scope.init();

                        },
                        error: function (e) { //alert("Server error - " + e);
                            //alert(e.status)
                            $ionicLoading.hide()
                            $scope.data_return = { status: e };
                            commonService.getErrorMessage($scope.data_return);

                        }
                    });
                } else {
                    $ionicLoading.hide();
                }
            }, 200)

        });

    }
    $scope.reject = function (emplCode, dateOfList) {
        $scope.multiRejectList = new Array($scope.approverTimeSheetDataMap[emplCode][dateOfList].length);
        for (i = 0; i < $scope.approverTimeSheetDataMap[emplCode][dateOfList].length; i++) {
            $scope.multiRejectList[i] = {}
            $scope.multiRejectList[i].tranid = $scope.approverTimeSheetDataMap[emplCode][dateOfList][0].employeeId;
            $scope.multiRejectList[i].empid = emplCode;
            // $scope.multiRejectList[i].remarks =  document.getElementById("rejectRemark_"+emplCode+"_"+dateOfList).value;
            $scope.multiRejectList[i].remarks = "testHardCoded"
            $scope.multiRejectList[i].menuId = "3305"
        }
        $scope.jsonMultiRejectList = JSON.stringify($scope.multiRejectList);
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure?',
            template: 'Do you want to  Reject', //Message
        });
        confirmPopup.then(function (res) {

            $ionicLoading.show()
            $timeout(function () {
                if (res) {
                    var fd = new FormData();
                    //  fd.append("tranid",timesheetEmployeeId);
                    // fd.append("menuid","3305");
                    // fd.append("remarks","1"); // this is hardcoded 
                    // fd.append("companyId",$scope.companyId); // later from session
                    //fd.append("isMultipleReq","Y")    
                    fd.append("reqJson", $scope.jsonMultiRejectList)

                    $.ajax({
                        url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/reject.spr'),
                        data: fd,
                        type: 'POST',
                        async: false,
                        timeout: commonRequestTimeout,
                        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                        processData: false, // NEEDED, DON'T OMIT THIS
                        headers: {
                            'Authorization': 'Bearer ' + jwtByHRAPI
                        },
                        success: function (success) {
                            //alert("scuc")
                            if (success.includes("ERROR")) {
                                console.log(success.clientResponseMsg)
                                handleClientResponse(success.clientResponseMsg, "uploadFileReviewerAjax")
                                $ionicLoading.hide()
                                //showAlert(success.clientResponseMsg)
                                //alert("ERROR")
                                showAlert("Something went wrong. Please try later.")
                                //$scope.redirectOnBack();
                                return
                            }
                            $ionicLoading.hide()
                            showAlert("Rejected sucessfully")
                            document.getElementById("header_" + emplCode + "_" + dateOfList).style.backgroundColor = "#ff9999";
                            document.getElementById("remSubTabReject_" + emplCode + "_" + dateOfList).style.display = "none";
                            document.getElementById("appRejButton_" + emplCode + "_" + dateOfList).style.display = "none";
                            $scope.init();
                        },
                        error: function (e) { //alert("Server error - " + e);
                            //alert(e.status)
                            $ionicLoading.hide()
                            $scope.data_return = { status: e };
                            commonService.getErrorMessage($scope.data_return);

                        }
                    });
                } else {
                    $ionicLoading.hide();
                }
            }, 200)

        });
    }
    $scope.goMultiApprove = function () {

        if ($scope.employeeCodes.length == 0) {
            showAlert("Please select atleast one record")
            return
        }
        var totalDatesOfAllEmployees = 0;


        for (k = 0; k < $scope.employeeCodes.length; k++) {
            totalDatesOfAllEmployees = totalDatesOfAllEmployees + Object.keys($scope.approverTimeSheetDataMap[$scope.employeeCodes[k]]).length;
        }
        $scope.multiApproveList2 = new Array(totalDatesOfAllEmployees);
        var ctr = 0;
        for (i = 0; i < $scope.employeeCodes.length; i++) {



            for (let key of Object.keys($scope.approverTimeSheetDataMap[$scope.employeeCodes[i]])) {
                if ($scope.approverTimeSheetDataMap[$scope.employeeCodes[i]][key][0] === undefined){
                    continue
                }
                $scope.multiApproveList2[ctr] = {}
                $scope.multiApproveList2[ctr].tranid = $scope.approverTimeSheetDataMap[$scope.employeeCodes[i]][key][0].employeeId;
                $scope.multiApproveList2[ctr].menuId = "3305"
                $scope.multiApproveList2[ctr].empid = $scope.employeeCodes[i]
                $scope.multiApproveList2[ctr].remarks = ""
                ctr++
            }

        }
        $scope.multiApproveList2.length = ctr;
        $scope.jsonMultiApproveList2 = JSON.stringify($scope.multiApproveList2)
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure?',
            template: 'Do you want to  Approve', //Message
        });
        confirmPopup.then(function (res) {
            $ionicLoading.show()
            $timeout(function () {
                if (res) {
                    var fd = new FormData();
                    //  fd.append("tranid",timesheetEmployeeId);
                    // fd.append("menuid","3305");
                    // fd.append("remarks","1"); // this is hardcoded 
                    // fd.append("companyId",$scope.companyId); // later from session
                    //fd.append("isMultipleReq","Y")    

                    fd.append("reqJson", $scope.jsonMultiApproveList2)
                    //$ionicLoading.hide()
                    //alert("sending for approva")
                    //return

                    $.ajax({
                        url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/approve.spr'),
                        data: fd,
                        type: 'POST',
                        async: false,
                        timeout: commonRequestTimeout,
                        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                        processData: false, // NEEDED, DON'T OMIT THIS
                        headers: {
                            'Authorization': 'Bearer ' + jwtByHRAPI
                        },
                        success: function (success) {
                            //alert("scuc")
                            if ((success.includes("ERROR"))) {
                                console.log(success.clientResponseMsg)
                                handleClientResponse(success.clientResponseMsg, "uploadFileReviewerAjax")
                                $ionicLoading.hide()
                                //showAlert(success.clientResponseMsg)
                                //alert("ERROR")
                                showAlert("Something went wrong. Please try later.")
                                //$scope.redirectOnBack();
                                return
                            }
                            $ionicLoading.hide()
                            showAlert("Approved Successfully")
                            document.getElementById("selectAll").checked = false
                            $scope.selectAll();
                            // document.getElementById("header_"+emplCode+"_"+dateOfList).style.backgroundColor="#ff9999";
                            // document.getElementById("appRejButton_"+emplCode+"_"+dateOfList).style.display="none";
                            $scope.init();
                        },
                        error: function (e) { //alert("Server error - " + e);

                            $ionicLoading.hide()
                            $scope.data_return = { status: e };
                            commonService.getErrorMessage($scope.data_return);

                        }
                    });
                } else {
                    $ionicLoading.show()
                }
            }, 200)

        });


    }
    $scope.goMultiReject = function () {
        if ($scope.employeeCodes.length == 0) {
            showAlert("Please select atleast one record")
            return
        }
        var totalDatesOfAllEmployees = 0;


        for (k = 0; k < $scope.employeeCodes.length; k++) {
            totalDatesOfAllEmployees = totalDatesOfAllEmployees + Object.keys($scope.approverTimeSheetDataMap[$scope.employeeCodes[k]]).length;
        }
        $scope.multiRejectList2 = new Array(totalDatesOfAllEmployees);
        var ctr = 0;
        for (i = 0; i < $scope.employeeCodes.length; i++) {



            for (let key of Object.keys($scope.approverTimeSheetDataMap[$scope.employeeCodes[i]])) {
                $scope.multiRejectList2[ctr] = {}
                $scope.multiRejectList2[ctr].tranid = $scope.approverTimeSheetDataMap[$scope.employeeCodes[i]][key][0].employeeId;
                $scope.multiRejectList2[ctr].menuId = "3305"
                $scope.multiRejectList2[ctr].empid = $scope.employeeCodes[i]
                $scope.multiRejectList2[ctr].remarks = ""
                ctr++
            }

        }
        $scope.jsonMultiRejectList2 = JSON.stringify($scope.multiRejectList2)
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure?',
            template: 'Do you want to  Reject?', //Message
        });
        confirmPopup.then(function (res) {
            $ionicLoading.show()
            $timeout(function () {
                if (res) {
                    var fd = new FormData();
                    //  fd.append("tranid",timesheetEmployeeId);
                    // fd.append("menuid","3305");
                    // fd.append("remarks","1"); // this is hardcoded 
                    // fd.append("companyId",$scope.companyId); // later from session
                    //fd.append("isMultipleReq","Y")    
                    fd.append("reqJson", $scope.jsonMultiRejectList2)

                    $.ajax({
                        url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/reject.spr'),
                        data: fd,
                        type: 'POST',
                        async: false,
                        timeout: commonRequestTimeout,
                        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                        processData: false, // NEEDED, DON'T OMIT THIS
                        headers: {
                            'Authorization': 'Bearer ' + jwtByHRAPI
                        },
                        success: function (success) {
                            //alert("scuc")
                            if ((success.includes("ERROR"))) {
                                console.log(success.clientResponseMsg)
                                handleClientResponse(success.clientResponseMsg, "uploadFileReviewerAjax")
                                $ionicLoading.hide()
                                //showAlert(success.clientResponseMsg)
                                //alert("ERROR")
                                showAlert("Something went wrong. Please try later.")
                                //$scope.redirectOnBack();
                                return
                            }
                            $ionicLoading.hide()
                            showAlert("Rejected Successfully")
                            document.getElementById("selectAll").checked = false
                            $scope.selectAll();
                            // document.getElementById("header_"+emplCode+"_"+dateOfList).style.backgroundColor="#ff9999";
                            // document.getElementById("appRejButton_"+emplCode+"_"+dateOfList).style.display="none";
                            $scope.init();
                        },
                        error: function (e) { //alert("Server error - " + e);
                            //alert(e.status)
                            $ionicLoading.hide()
                            $scope.data_return = { status: e };
                            commonService.getErrorMessage($scope.data_return);

                        }
                    });
                } else {
                    $ionicLoading.hide()
                }
            }, 200)


        });

    }
    //add button
    $scope.goAddRecord = function (idx, value) {
        var ddpart;
        var mpart;
        if (idx < 9) ddpart = "0" + (idx + 1);
        else ddpart = (idx + 1) + ""

        if (Number($scope.selectedMonth) <= 9) mpart = "0" + $scope.selectedMonth;
        else mpart = $scope.selectedMonth

        dtformat = ddpart + "-" + mpart + "-" + $scope.selectedYear


        $rootScope.dateTransferFromTimesheetList = dtformat;
        $rootScope.empIdTransferFromTimesheetList = $scope.empId;
        $rootScope.companyIdTransferFromTimesheetList = $scope.companyId;
        $rootScope.editFlagTransferFromTimesheetList = "fromAdd"
        $state.go('timesheetAdd')
    }

    //update 
    $scope.goUpdate = function (idx) {
        var ddpart;
        var mpart;
        if (idx < 9) ddpart = "0" + (idx + 1);
        else ddpart = (idx + 1) + ""

        if (Number($scope.selectedMonth) <= 9) mpart = "0" + $scope.selectedMonth;
        else mpart = $scope.selectedMonth

        dtformat = ddpart + "-" + mpart + "-" + $scope.selectedYear
        $rootScope.dateTransferFromTimesheetList = dtformat;
        $rootScope.empIdTransferFromTimesheetList = $scope.empId;
        $rootScope.companyIdTransferFromTimesheetList = $scope.companyId;
        $rootScope.editFlagTransferFromTimesheetList = "Y"
        $state.go('timesheetAdd')


    }

    //send for approval
    $scope.sendForApproval = function (idx, value) {
        var timesheetEmployeeId = document.getElementById("employeeId_" + idx).innerHTML;
        var confirmPopup = $ionicPopup.confirm({
            title: '',
            template: 'Do you want to Send For Approval?', //Message
        });
        confirmPopup.then(function (res) {
            if (res) {
                var fd = new FormData();
                fd.append("tranid", timesheetEmployeeId);
                fd.append("menuid", "3305");
                fd.append("remarks", "1"); // this is hardcoded 
                fd.append("companyId", $scope.companyId); // later from session
                fd.append("isMultipleReq", "N")

                $.ajax({
                    url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/sendForApprovalAjax.spr'),
                    data: fd,
                    type: 'POST',
                    async: false,
                    timeout: commonRequestTimeout,
                    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                    processData: false, // NEEDED, DON'T OMIT THIS
                    headers: {
                        'Authorization': 'Bearer ' + jwtByHRAPI
                    },
                    success: function (success) {
                        //alert("scuc")
                        if (!(success.clientResponseMsg == "OK")) {
                            console.log(success.clientResponseMsg)
                            handleClientResponse(success.clientResponseMsg, "uploadFileReviewerAjax")
                            $ionicLoading.hide()
                            //showAlert(success.clientResponseMsg)
                            //alert("ERROR")
                            showAlert("Something went wrong. Please try later.")
                            //$scope.redirectOnBack();
                            return
                        }
                        showAlert("sent for approval sucessfully")
                        $scope.init();
                    },
                    error: function (e) { //alert("Server error - " + e);
                        //alert(e.status)
                        $ionicLoading.hide()
                        $scope.data_return = { status: e };
                        commonService.getErrorMessage($scope.data_return);

                    }
                });
            }
        });

    }

    //multiple send for approval 
    $scope.goMultiSendForApproval = function () {
        $scope.multiSendList = new Array($scope.selectedCheckboxIndex.length);

        for (i = 0; i < $scope.selectedCheckboxIndex.length; i++) {
            $scope.multiSendList[i] = {};
            $scope.multiSendList[i].tranid = $scope.headerList[$scope.selectedCheckboxIndex[i]].employeeId;
            $scope.multiSendList[i].menuId = "3305";
            $scope.multiSendList[i].remarks = 1;
        }
        $scope.jsonMultiSendList = JSON.stringify($scope.multiSendList);
        var confirmPopup = $ionicPopup.confirm({
            title: '',
            template: 'Do you want to Send For Approval?', //Message
        });
        confirmPopup.then(function (res) {
            if (res) {
                var fd = new FormData();
                //  fd.append("tranid",timesheetEmployeeId);
                // fd.append("menuid","3305");
                // fd.append("remarks","1"); // this is hardcoded 
                // fd.append("companyId",$scope.companyId); // later from session
                fd.append("isMultipleReq", "Y")
                fd.append("reqJson", $scope.jsonMultiSendList)

                $.ajax({
                    url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/sendForApprovalAjax.spr'),
                    data: fd,
                    type: 'POST',
                    async: false,
                    timeout: commonRequestTimeout,
                    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                    processData: false, // NEEDED, DON'T OMIT THIS
                    headers: {
                        'Authorization': 'Bearer ' + jwtByHRAPI
                    },
                    success: function (success) {
                        //alert("scuc")
                        if (!(success.clientResponseMsg == "OK")) {
                            console.log(success.clientResponseMsg)
                            handleClientResponse(success.clientResponseMsg, "uploadFileReviewerAjax")
                            $ionicLoading.hide()
                            //showAlert(success.clientResponseMsg)
                            //alert("ERROR")
                            showAlert("Something went wrong. Please try later.")
                            //$scope.redirectOnBack();
                            return
                        }
                        showAlert("sent for approval sucessfully")
                        $scope.init();
                    },
                    error: function (e) { //alert("Server error - " + e);
                        //alert(e.status)
                        $ionicLoading.hide()
                        $scope.data_return = { status: e };
                        commonService.getErrorMessage($scope.data_return);

                    }
                });
            }
        });

    }
    //deleted saved data

    $scope.goDelete = function (idx, value) {
        var timesheetEmployeeId = document.getElementById("employeeId_" + idx).innerHTML;
        var confirmPopup = $ionicPopup.confirm({
            title: '',
            template: 'Do you want to Delete?', //Message
        });
        confirmPopup.then(function (res) {
            if (res) {
                var fd = new FormData();
                fd.append("timeSheetEmployeeId", timesheetEmployeeId);
                $.ajax({
                    url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/deleteData.spr'),
                    data: fd,
                    type: 'POST',
                    async: false,
                    timeout: commonRequestTimeout,
                    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                    processData: false, // NEEDED, DON'T OMIT THIS
                    headers: {
                        'Authorization': 'Bearer ' + jwtByHRAPI
                    },
                    success: function (success) {
                        //alert("scuc")
                        if (!(success.clientResponseMsg == "OK")) {
                            console.log(success.clientResponseMsg)
                            handleClientResponse(success.clientResponseMsg, "uploadFileReviewerAjax")
                            $ionicLoading.hide()
                            //showAlert(clientResponseMsg)
                            //alert("ERROR")
                            showAlert("Something went wrong. Please try later.")
                            //$scope.redirectOnBack();
                            return
                        }

                        showAlert("Deleted Successfully");
                        $scope.init();
                    },
                    error: function (e) { //alert("Server error - " + e);
                        //alert(e.status)
                        $ionicLoading.hide()
                        $scope.data_return = { status: e };
                        commonService.getErrorMessage($scope.data_return);

                    }
                });
            }
        })
    }
    //send approved timesheet for cancellation

    $scope.sentForCancellation = function (idx, value) {
        var timesheetEmployeeId = document.getElementById("employeeId_" + idx).innerHTML;
        var confirmPopup = $ionicPopup.confirm({
            title: '',
            template: 'Do you want to Send For Canellation?', //Message
        });
        confirmPopup.then(function (res) {
            if (res) {
                var fd = new FormData();
                fd.append("tranid", timesheetEmployeeId);
                fd.append("menuId", "3305");
                fd.append("remarks", "1"); // this is hardcoded 
                fd.append("cpmanyId", $scope.companyId); // later from session


                $.ajax({
                    url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/sentForCancellationAjax.spr'),
                    data: fd,
                    type: 'POST',
                    async: false,
                    timeout: commonRequestTimeout,
                    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                    processData: false, // NEEDED, DON'T OMIT THIS
                    headers: {
                        'Authorization': 'Bearer ' + jwtByHRAPI
                    },
                    success: function (success) {
                        //alert("scuc")
                        if (!(success.clientResponseMsg == "OK")) {
                            console.log(success.clientResponseMsg)
                            handleClientResponse(success.clientResponseMsg, "uploadFileReviewerAjax")
                            $ionicLoading.hide()
                            //showAlert(success.clientResponseMsg)
                            //alert("ERROR")
                            showAlert("Something went wrong. Please try later.")
                            //$scope.redirectOnBack();
                            return
                        }
                        showAlert("Cancelled");
                        $scope.init();
                    },
                    error: function (e) { //alert("Server error - " + e);
                        //alert(e.status)
                        $ionicLoading.hide()
                        $scope.data_return = { status: e };
                        commonService.getErrorMessage($scope.data_return);

                    }
                });
            }
        });

    }


    //cancel send fot approval
    $scope.cancel = function (idx, value) {
        var timesheetEmployeeId = document.getElementById("employeeId_" + idx).innerHTML;
        var confirmPopup = $ionicPopup.confirm({
            title: '',
            template: 'Do you want to Send For Canellation?', //Message
        });
        confirmPopup.then(function (res) {
            if (res) {
                var fd = new FormData();
                fd.append("tranid", timesheetEmployeeId);
                fd.append("menuId", "3305");
                fd.append("remarks", "1"); // this is hardcoded 
                //fd.append("cpmanyId",$scope.companyId); // later from session


                $.ajax({
                    url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/cancel.spr'),
                    data: fd,
                    type: 'POST',
                    async: false,
                    timeout: commonRequestTimeout,
                    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                    processData: false, // NEEDED, DON'T OMIT THIS
                    headers: {
                        'Authorization': 'Bearer ' + jwtByHRAPI
                    },
                    success: function (success) {
                        //alert("scuc")
                        if (!(success.clientResponseMsg == "OK")) {
                            console.log(success.clientResponseMsg)
                            handleClientResponse(success.clientResponseMsg, "uploadFileReviewerAjax")
                            $ionicLoading.hide()
                            //showAlert(success.clientResponseMsg)
                            //alert("ERROR")
                            showAlert("Something went wrong. Please try later.")
                            //$scope.redirectOnBack();
                            return
                        }
                        showAlert("sent for approval sucessfully");
                        $scope.init();
                    },
                    error: function (e) { //alert("Server error - " + e);
                        alert(e.status)
                        $ionicLoading.hide()
                        $scope.data_return = { status: e };
                        commonService.getErrorMessage($scope.data_return);

                    }
                });
            }
        });

    }

    $scope.refreshTimeSheetList = function () {
        $scope.init();
    }
    $scope.redirectOnBack = function () {
        $state.go('app.approvalsMenu')
    }
    $scope.onTapTimesheetList = function () {
        if (document.getElementById("timesheetList").style.display == 'none') {
            document.getElementById("timesheetList").style.display = 'inline-block'
        } else {
            document.getElementById("timesheetList").style.display = 'none'
        }
    }
    $scope.doChangeMonth = function () {
        $ionicLoading.show()
        var elemMonth = document.getElementById("month");
        var month = elemMonth.options[elemMonth.selectedIndex].value;
        $scope.selectedMonth = month;
        document.getElementById("selectAll").checked = false;

        $scope.init();


        // elemSubAct = document.getElementById("subactivityMasterId_" + size)
        // nameSubAct = elemSubAct.options[elemSubAct.selectedIndex].text
    }
    $scope.doChangeYear = function () {
        var elemYear = document.getElementById("year");
        var year = elemYear.options[elemYear.selectedIndex].text;
        $scope.selectedYear = year;
        document.getElementById("selectAll").checked = false
        $scope.init();
    }
    $scope.openOnTap = function (idx) {
        if (document.getElementById("inner_div_" + idx).style.display == 'none') {
            document.getElementById("inner_div_" + idx).style.display = 'inline-block'
        } else {
            document.getElementById("inner_div_" + idx).style.display = 'none'
        }

    }
    $scope.dateFormat = function (idx) {
        var ddpart;
        var mpart;
        var dtFormat;
        if (idx < 8) {
            ddpart = "0" + (idx + 1)
        } else {
            ddpart = (idx + 1) + ""
        }
        if (Number($scope.selectedMonth) <= 9) mpart = "0" + $scope.selectedMonth;
        else mpart = $scope.selectedMonth

        dtFormat = ddpart + "-" + mpart + $scope.selectedYear;
        return dtformat

    }



    // $scope.deselectCheckBox=function(idx) {
    //     var favorite = [];
    //     var favorite1 = [];

    //     $.each($("input[name='approve']:enabled"), function() {
    //         favorite.push($(this).val());
    //     });
    //     $.each($("input[name='approve']:checked"), function() {
    //         favorite1.push($(this).val());
    //     });
    //     if (!(favorite.length < favorite1.length)) {
    //         $("#selectall").prop("checked", false);
    //     }
    // }
    // $scope.selectAll=function() {
    //     $('input[type="checkbox"]')
    //             .not("[disabled]").prop('checked',
    //                     this.checked);
    // }
    $scope.init();
});