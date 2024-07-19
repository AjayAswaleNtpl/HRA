mainModule.controller('requestTimesheetEmployeeDailyListCtrl', function ($scope, $rootScope, commonService, $ionicHistory,$window,
	$rootScope, $ionicPopup, $state, $http, $q, $filter, $ionicLoading, addTravelApplicationService ,$timeout ,
	$ionicNavBarDelegate,getTravelRuleService){


        $rootScope.navHistoryPrevPage = "requisitionNew"
        $scope.empId = sessionStorage.getItem("empId")
        $scope.companyId = sessionStorage.getItem("companyId")
        $scope.timeSheetDataMap={};
        $scope.listYear;
        $scope.listMonth;
        $scope.index = 0;
        $scope.index1=0;
        $scope.headerList=[];

        $scope.selectedValue = {};
        $scope.selectedCheckboxIndex = [];
        $scope.multiSendList = [];
        $scope.jsonMultiSendList;
        
    

        $scope.selectedMonth = ""
        $scope.selectedYear = ""
        //alert("raj time sheet list")
        $scope.init = function(){
        $ionicLoading.show()
            $timeout(function () {
                var fd = new FormData();
                fd.append("companyId",$scope.companyId)
                fd.append("empId",$scope.empId)
                
                fd.append("menuId","3305")
                if ($rootScope.monthTransferFromTimesheetList === undefined || 
                    $rootScope.monthTransferFromTimesheetList == "" ||
                    $rootScope.monthTransferFromTimesheetList == null ){
                
                if ($scope.selectedMonth =="")
                {
                    var today ;
                    //date todays month and yezar
                    // var elemMonth = document.getElementById("month");
                    // elemMonth.options[elemMonth.selectedIndex].value="8";
                    if ($rootScope.dateTransferFromTimesheetList){
                        // var today = new Date($rootScope,niTransferFromTimesheetList)
                        var d = $rootScope.dateTransferFromTimesheetList.split("-");
                        var t = d[2] + "-"+d[1]+"-"+d[0]
                        today = new Date(t);
                        $rootScope.dateTransferFromTimesheetList = null
                    }else{
                        var today = new Date()
                    }
                    
                    var currentMonth = (today.getMonth()+1)+""
                   // var currentYear = (today.getFullYear())+""
                    $scope.selectedValue.selectedMonth = currentMonth;
    
                   // $scope.selectedValue.selectedYear=currentYear
                    $scope.selectedMonth =currentMonth;
                    
                }
                if($scope.selectedYear==""){
                    var today = new Date();
                    var currentYear = (today.getFullYear())+""
                    
                    $scope.selectedYear =currentYear;
                    $scope.selectedValue.selectedYear=currentYear
                    //
                }

                
    
            }else{
                //there has been to add timesheet flow
                //so this is return from timesheet add
                if ($rootScope.monthTransferFromTimesheetList.charAt(0) == "0"){
                    $rootScope.monthTransferFromTimesheetList = $rootScope.monthTransferFromTimesheetList.replace("0","")
                }
                $scope.selectedValue.selectedMonth = $rootScope.monthTransferFromTimesheetList;
                $scope.selectedValue.selectedYear =  $rootScope.yearTransferFromTimesheetList
                $scope.selectedMonth =  $rootScope.monthTransferFromTimesheetList
                $scope.selectedYear = $rootScope.yearTransferFromTimesheetList

                $rootScope.monthTransferFromTimesheetList = ""
                $rootScope.yearTransferFromTimesheetList = ""
               
    
            }
                
            fd.append("monthId",$scope.selectedMonth)
            fd.append("year",$scope.selectedYear)
                
            $rootScope.monthTransferFromTimesheetList = ""
            $rootScope.yearTransferFromTimesheetList = ""
            $rootScope.dateTransferFromTimesheetList = null
                
                $.ajax({
                    url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/viewTimeSheetEmployeeDaily.spr'),
                    data: fd,
                    type: 'POST',
                    async:false,
                    timeout: commonRequestTimeout,
                    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                    processData: false, // NEEDED, DON'T OMIT THIS
                    headers: {
                        'Authorization': 'Bearer ' + jwtByHRAPI
                     },
                    success : function(success) {
                        //alert("scuc")
                        if (!(success.clientResponseMsg=="OK")){
                                    console.log(success.clientResponseMsg)
                                    handleClientResponse(success.clientResponseMsg,"viewTimeSheetEmployeeDaily")
                                    $ionicLoading.hide()
                                    showAlert("Something went wrong. Please try later.")
                                    //$scope.redirectOnBack();
                                    return
                                }	
    
                                $scope.timeSheetDataMap = success.timeSheetDataMap;
                                $scope.listYear = success.listYear;
                                $scope.dayShiftHolidayLeaveStatus =  success.getShiftHolidayLeaveData
                                //alert(success.listYear[0].value)
                                $scope.listMonth = success.listMonth;
    
                                $scope.size  = success.size;
    
                                $scope.headerList = new Array($scope.size);  
        
                                if (!$scope.$$phase)
                                $scope.$apply()
    
                                $timeout(function () {
                                    $scope.fillData();
                                    
                                },1000)
         
    
                                 
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
                    
                            $ionicLoading.hide()
                           $scope.data_return = {status: e};
                        commonService.getErrorMessage($scope.data_return);
                        
                           }				
                    });	
            },200);

  
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
        $scope.fillData=function(){
            for (var i = 1;i <= $scope.size;i++){
                $scope.headerList[i-1] = {}

                var dtpart;
                var mpart;
                var dtformat;
                var d= new Date();
                var tot=0;
                var hrsArr;
                var hours;
                var dtDayFormat;
                
                
                if (i <= 9)    ddpart = "0"+ i;
                else   ddpart = i + ""

                if (Number($scope.selectedMonth) <= 9)    mpart = "0"+ $scope.selectedMonth;
                else   mpart = $scope.selectedMonth

                dtformat = ddpart + "-" + mpart + "-" + $scope.selectedYear
                dtDayFormat = $scope.selectedYear+"-"+mpart+"-"+ddpart;
                dayNumber = new Date(dtDayFormat).getDay();

                        if(dayNumber == 0){
                            $scope.headerList[i-1].day = "Sunday" 
                        }
                        else if(dayNumber == 1){
                            $scope.headerList[i-1].day = "Monday" 
                        }
                        else if(dayNumber == 2){
                            $scope.headerList[i-1].day = "Tuesday" 
                        }
                        else if(dayNumber == 3){
                            $scope.headerList[i-1].day = "Wednesday" 
                        }
                        else if(dayNumber == 4){
                            $scope.headerList[i-1].day = "Thursday" 
                        }
                        else if(dayNumber == 5){
                            $scope.headerList[i-1].day = "Friday" 
                        }
                        else if(dayNumber == 6){
                            $scope.headerList[i-1].day = "Saturday" 
                        }else{}
                if($scope.timeSheetDataMap[dtformat][0]){   
                        $scope.headerList[i-1].date = $scope.timeSheetDataMap[dtformat][0].date
                        // d =  $scope.timeSheetDataMap[dtformat][0].date
                        $scope.headerList[i-1].status = $scope.timeSheetDataMap[dtformat][0].status
                        $scope.headerList[i-1].pendingFrom = $scope.timeSheetDataMap[dtformat][0].approvePendingFrom
                        if($scope.headerList[i-1].pendingFrom=="NA"){
                            //$scope.headerList[i-1].pendingFrom = ""
                           
                        }
                        $scope.headerList[i-1].employeeId = $scope.timeSheetDataMap[dtformat][0].employeeId
                        //$scope.setTotalNoOfHours();
                        

                        for(k=0;k<$scope.timeSheetDataMap[dtformat].length;k++){
                            hours = $scope.timeSheetDataMap[dtformat][k].noOfHrs;
                            
                            hrsArr = hours.split(':');
                            hours = Number(hrsArr[0]) * 60 + Number(hrsArr[1]);
                            tot = tot + hours;

                        }
                        /*
                        for(timesheet in $scope.timeSheetDataMap[dtformat]){
                         hours = timesheet.noOfHrs;
                            hrsArr = hours.split(':');
                            hours = Number(hrsArr[0]) * 60 + Number(hrsArr[1]);
                             tot = tot + hrs;
                        }
                        */
                        var m = tot % 60;
                        var h = (tot - m) / 60;
                        var HHMM = h.toString() + ":" + (m < 10 ? "0" : "") + m.toString();
                        $scope.headerList[i-1].totHrs = HHMM;

                        
                        if($scope.headerList[i-1].status=="SENT FOR APPROVAL"){
                            document.getElementById("timesheetHeaderCard_"+(i-1)).style.backgroundColor ="#ffffb3";
                        }
                        else if($scope.headerList[i-1].status=="SAVED"){
                            document.getElementById("timesheetHeaderCard_"+(i-1)).style.backgroundColor ="#b3e6ff";
                        }
                        else if($scope.headerList[i-1].status=="REJECTED" || $scope.headerList[i-1].status=="CANCELLED" || $scope.headerList[i-1].status=="CANCELLATION REJECTED"){
                            document.getElementById("timesheetHeaderCard_"+(i-1)).style.backgroundColor ="#ff9999";
                        }
                        else if($scope.headerList[i-1].status=="APPROVED" || $scope.headerList[i-1].status=="CANCELLATION APPROVED"){
                            document.getElementById("timesheetHeaderCard_"+(i-1)).style.backgroundColor ="#ccffcc";
                        }
                        else if($scope.headerList[i-1].status=="LEAVE" ){
                            document.getElementById("timesheetHeaderCard_"+(i-1)).style.backgroundColor ="#8A2BE2";
                        }
                        else if($scope.headerList[i-1].status=="HOLIDAY" ){
                            document.getElementById("timesheetHeaderCard_"+(i-1)).style.backgroundColor ="#ff75d0";
                        }
                        else if($scope.headerList[i-1].status=="WEEKOFF"){
                            document.getElementById("timesheetHeaderCard_"+(i-1)).style.backgroundColor ="#ffd6c6";
                        }
                        else{
                            document.getElementById("timesheetHeaderCard_"+(i-1)).style.backgroundColor ="#FFA07A";
                        }
                        
                        // for(i=0;i<$scope.dayShiftHolidayLeaveStatus;i++){
                            
                        // }
                       

                        
                        

                }
                
                // if($scope.dayShiftHolidayLeaveStatus != null){
                //     for(let key of Object.keys($scope.dayShiftHolidayLeaveStatus)){
                //         $scope.weekLeaveStatus
                //         // if (i <= 9)    ddpart = "0"+ i;
                //         // else   ddpart = i + ""
        
                //         // if (Number($scope.selectedMonth) <= 9)    mpart = "0"+ $scope.selectedMonth;
                //         // else   mpart = $scope.selectedMonth
        
                //         // dtformat = ddpart + "-" + mpart + "-" + $scope.selectedYear
                //         // if($scope.dayShiftHolidayLeaveStatus[dtformat]=="W"){
                //         //     document.getElementById("timesheetHeaderCard_"+i).style.backgroundColor ="#ffd6c6";
                //         // }
                //         // else if($scope.dayShiftHolidayLeaveStatus[dtformat]=="L"){
                //         //     document.getElementById("timesheetHeaderCard_"+i).style.backgroundColor ="#8A2BE2";
                //         // }
                //         // else{}
                //     }
                // }

                


            }
            if($scope.dayShiftHolidayLeaveStatus){
                const statusValue = Object.values($scope.dayShiftHolidayLeaveStatus);
                for(i=0;i<statusValue.length;i++){
                    if(statusValue[i]=="W"){
                        document.getElementById("timesheetHeaderCard_"+i).style.backgroundColor ="#ffd6c6";
                    }
                    else if(statusValue[i]=="L"){
                        document.getElementById("timesheetHeaderCard_"+i).style.backgroundColor ="#8A2BE2";
                    }
                    else if(statusValue[i]=="H"){
                        document.getElementById("timesheetHeaderCard_"+i).style.backgroundColor ="#ff75d0";
                    }
                    else{}
                }
            }
            $ionicLoading.hide()
        }
        $scope.goToApprovals = function(){
            $state.go("approvalTimesheetEmployeeDailyList")
        }
        $scope.openOnTapColor = function(){
            if(document.getElementById("colorCodeInner").style.display=='none'){
                document.getElementById("colorCodeInner").style.display='inline-block';
                document.getElementById("colorCode").innerHTML = "Hide Color Codes"
            }else{
                document.getElementById("colorCodeInner").style.display='none'
                document.getElementById("colorCode").innerHTML = "Show Color Codes"
            }
        }
        //add button
        $scope.goAddRecord = function(idx,value){
            var ddpart;
            var mpart;
            if (idx < 9)    ddpart = "0"+ (idx+1);
            else   ddpart = (idx+1) + ""

            if (Number($scope.selectedMonth) <= 9)    mpart = "0"+ $scope.selectedMonth;
             else   mpart = $scope.selectedMonth

            dtformat = ddpart + "-" + mpart + "-" + $scope.selectedYear

            
            $rootScope.dateTransferFromTimesheetList=dtformat;
            $rootScope.monthTransferFromTimesheetList=mpart;
            $rootScope.yearTransferFromTimesheetList=$scope.selectedYear;

            $rootScope.empIdTransferFromTimesheetList = $scope.empId;
            $rootScope.companyIdTransferFromTimesheetList = $scope.companyId;
            $rootScope.editFlagTransferFromTimesheetList = "fromAdd"
            $state.go('timesheetAdd')
        }

        //update 
        $scope.goUpdate = function(idx){
            var ddpart;
            var mpart;
            if (idx < 9)    ddpart = "0"+ (idx+1);
            else   ddpart = (idx+1) + ""

            if (Number($scope.selectedMonth) <= 9)    mpart = "0"+ $scope.selectedMonth;
             else   mpart = $scope.selectedMonth

            dtformat = ddpart + "-" + mpart + "-" + $scope.selectedYear
            $rootScope.dateTransferFromTimesheetList=dtformat;
            $rootScope.empIdTransferFromTimesheetList = $scope.empId;
            $rootScope.companyIdTransferFromTimesheetList = $scope.companyId;
            $rootScope.editFlagTransferFromTimesheetList = "Y"
            $state.go('timesheetAdd')


        }

        //send for approval
        $scope.sendForApproval=function(idx,value){
            var timesheetEmployeeId = document.getElementById("employeeId_"+idx).innerHTML;
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to Send For Approval?', //Message
            });
            confirmPopup.then(function(res){
                $ionicLoading.show();

                $timeout(function () {
                    if(res){

                        var fd = new FormData();
                         fd.append("tranid",timesheetEmployeeId);
                        fd.append("menuid","3305");
                        fd.append("remarks","1"); // this is hardcoded 
                        fd.append("companyId",$scope.companyId); // later from session
                        fd.append("isMultipleReq","N")                  
    
                        $.ajax({
                            url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/sendForApprovalAjax.spr'),
                            data: fd,
                            type: 'POST',
                            async:false,
                            timeout: commonRequestTimeout,
                            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                            processData: false, // NEEDED, DON'T OMIT THIS
                            headers: {
                                'Authorization': 'Bearer ' + jwtByHRAPI
                             },
                            success : function(success) {
                                //alert("scuc")
                                if (!(success.clientResponseMsg=="OK")){
                                            console.log(success.clientResponseMsg)
                                            handleClientResponse(success.clientResponseMsg,"uploadFileReviewerAjax")
                                            $ionicLoading.hide()
                                            //showAlert(success.clientResponseMsg)
                                            showAlert("Something went wrong. Please try later.")
                                            //$scope.redirectOnBack();
                                            return
                                        }	
                                        $ionicLoading.hide()
                                        showAlert("Sent for approval sucessfully")
                                        
                                        $scope.init();
                            },
                            error: function (e) { //alert("Server error - " + e);
                            alert(e.status)
                            $ionicLoading.hide()
                            $scope.data_return = {status: e};
                            commonService.getErrorMessage($scope.data_return);
                        
                           }				
                    });	
                }else{
                    $ionicLoading.hide();
                }
                },200)
                
            });

        }

        //multiple send for approval 
        $scope.goMultiSendForApproval = function(){
            if($scope.selectedCheckboxIndex.length==0){
                showAlert("Please select atleast one record");
                return
            }
            $scope.multiSendList = new Array($scope.selectedCheckboxIndex.length);

            for(i=0;i<$scope.selectedCheckboxIndex.length;i++){
                $scope.multiSendList[i]={};
                $scope.multiSendList[i].tranid = $scope.headerList[$scope.selectedCheckboxIndex[i]].employeeId;
                $scope.multiSendList[i].menuId = "3305";
                $scope.multiSendList[i].remarks = 1;
            }
            $scope.jsonMultiSendList =  JSON.stringify($scope.multiSendList);
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to Send For Approval?', //Message
            });
            confirmPopup.then(function(res){
                $ionicLoading.show();
                $timeout(function () {
                    if(res){
                        var fd = new FormData();
                        //  fd.append("tranid",timesheetEmployeeId);
                        // fd.append("menuid","3305");
                        // fd.append("remarks","1"); // this is hardcoded 
                        // fd.append("companyId",$scope.companyId); // later from session
                        fd.append("isMultipleReq","Y")    
                        fd.append("reqJson",$scope.jsonMultiSendList)              
    
                        $.ajax({
                            url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/sendForApprovalAjax.spr'),
                            data: fd,
                            type: 'POST',
                            async:false,
                            timeout: commonRequestTimeout,
                            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                            processData: false, // NEEDED, DON'T OMIT THIS
                            headers: {
                                'Authorization': 'Bearer ' + jwtByHRAPI
                             },
                            success : function(success) {
                                //alert("scuc")
                                if (!(success.clientResponseMsg=="OK")){
                                            console.log(success.clientResponseMsg)
                                            handleClientResponse(success.clientResponseMsg,"sendForApprovalAjax")
                                            $ionicLoading.hide()
                                            //showAlert(success.clientResponseMsg)
                                            //alert("ERROR")
                                            showAlert("Something went wrong. Please try later.")
                                            //$scope.redirectOnBack();
                                            return
                                        }	
                                        $ionicLoading.hide();
                                        showAlert("Sent for approval sucessfully")
                                        document.getElementById("selectAll").checked = false
                                        $scope.selectAll();
    
                                        $scope.init();
                            },
                            error: function (e) { //alert("Server error - " + e);
                            alert(e.status)
                            $ionicLoading.hide()
                            $scope.data_return = {status: e};
                            commonService.getErrorMessage($scope.data_return);
                        
                           }				
                    });	
                }else{
                    $ionicLoading.hide();
                }
                },200)
                
            });

        }
        //deleted saved data
        
        $scope.goDelete=function(idx,value){
            var timesheetEmployeeId = document.getElementById("employeeId_"+idx).innerHTML;
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to Delete?', //Message
            });
            confirmPopup.then(function(res){
                $ionicLoading.show();
                $timeout(function () {
                    if(res){
                        var fd = new FormData();
                        fd.append("timeSheetEmployeeId",timesheetEmployeeId);
                        $.ajax({
                            url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/deleteData.spr'),
                            data: fd,
                            type: 'POST',
                            async:false,
                            timeout: commonRequestTimeout,
                            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                            processData: false, // NEEDED, DON'T OMIT THIS
                            headers: {
                                'Authorization': 'Bearer ' + jwtByHRAPI
                             },
                            success : function(success) {
                                //alert("scuc")
                                if (!(success.clientResponseMsg=="OK")){
                                            console.log(success.clientResponseMsg)
                                            handleClientResponse(success.clientResponseMsg,"uploadFileReviewerAjax")
                                            $ionicLoading.hide()
                                            //showAlert(clientResponseMsg)
                                            //alert("ERROR")
                                            showAlert("Something went wrong. Please try later.")
                                            //$scope.redirectOnBack();
                                            return
                                        }	
                                $ionicLoading.hide()
                                showAlert("Deleted Successfully");
                                document.getElementById("timesheetHeaderCard_"+idx).style.backgroundColor="#fff"
                                $scope.init();
                            },
                            error: function (e) { //alert("Server error - " + e);
                            alert(e.status)
                            $ionicLoading.hide()
                            $scope.data_return = {status: e};
                            commonService.getErrorMessage($scope.data_return);
                        
                           }				
                    });	
                    }else{
                        $ionicLoading.hide();
                    }
                },200);
                
            })
        }
        //send approved timesheet for cancellation
        
        $scope.sentForCancellation=function(idx,value){
            var timesheetEmployeeId = document.getElementById("employeeId_"+idx).innerHTML;
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to Send For Canellation?', //Message
            });
            confirmPopup.then(function(res){
                $ionicLoading.show();
                $timeout(function () {
                    if(res){
                        var fd = new FormData();
                         fd.append("tranid",timesheetEmployeeId);
                        fd.append("menuId","3305");
                        fd.append("remarks","1"); // this is hardcoded 
                        fd.append("cpmanyId",$scope.companyId); // later from session
                        
    
                        $.ajax({
                            url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/sentForCancellationAjax.spr'),
                            data: fd,
                            type: 'POST',
                            async:false,
                            timeout: commonRequestTimeout,
                            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                            processData: false, // NEEDED, DON'T OMIT THIS
                            headers: {
                                'Authorization': 'Bearer ' + jwtByHRAPI
                             },
                            success : function(success) {
                                //alert("scuc")
                                if (!(success.clientResponseMsg=="OK")){
                                            console.log(success.clientResponseMsg)
                                            handleClientResponse(success.clientResponseMsg,"uploadFileReviewerAjax")
                                            $ionicLoading.hide()
                                            //showAlert(success.clientResponseMsg)
                                            //alert("ERROR")
                                            showAlert("Something went wrong. Please try later.")
                                            //$scope.redirectOnBack();
                                            return
                                        }	
                                        $ionicLoading.hide()
                                        showAlert("Cancelled");
                                        $scope.init();
                            },
                            error: function (e) { //alert("Server error - " + e);
                            //alert(e.status)
                            $ionicLoading.hide()
                            $scope.data_return = {status: e};
                            commonService.getErrorMessage($scope.data_return);
                        
                           }				
                    });	
                }else{
                    $ionicLoading.hide();
                }
                },200)
                
            });

        }


        //cancel send fot approval
        $scope.cancel=function(idx,value){
            var timesheetEmployeeId = document.getElementById("employeeId_"+idx).innerHTML;
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to Send For Canellation?', //Message
            });
            confirmPopup.then(function(res){
                $ionicLoading.show()
                $timeout(function () {
                    if(res){
                        //ee
                        var fd = new FormData();
                         fd.append("tranid",timesheetEmployeeId);
                        fd.append("menuId","3305");
                        fd.append("remarks","1"); // this is hardcoded 
                        //fd.append("cpmanyId",$scope.companyId); // later from session
                        
    
                        $.ajax({
                            url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/cancel.spr'),
                            data: fd,
                            type: 'POST',
                            async:false,
                            timeout: commonRequestTimeout,
                            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                            processData: false, // NEEDED, DON'T OMIT THIS
                            headers: {
                                'Authorization': 'Bearer ' + jwtByHRAPI
                             },
                            success : function(success) {
                                //alert("scuc")
                                if (!(success.clientResponseMsg=="OK")){
                                            console.log(success.clientResponseMsg)
                                            handleClientResponse(success.clientResponseMsg,"uploadFileReviewerAjax")
                                            $ionicLoading.hide()
                                            //showAlert(success.clientResponseMsg)
                                            //alert("ERROR")
                                            showAlert("Something went wrong. Please try later.")
                                            //$scope.redirectOnBack();
                                            return
                                        }	
                                        $ionicLoading.hide()
                                        showAlert("sent for cancellation sucessfully");
                                        $scope.init();
                            },
                            error: function (e) { //alert("Server error - " + e);
                            //alert(e.status)
                            $ionicLoading.hide()
                            $scope.data_return = {status: e};
                            commonService.getErrorMessage($scope.data_return);
                        
                           }				
                    });	
                }else{
                    $ionicLoading.hide();
                }
                })
               
            });

        }

        $scope.refreshTimeSheetList=function(){
            $scope.init();
        }
        $scope.redirectOnBack = function(){
            $state.go('app.requestMenu')
        }
        $scope.doChangeMonth=function(){
            var elemMonth = document.getElementById("month");
            var month = elemMonth.options[elemMonth.selectedIndex].value;
            $scope.selectedMonth = month;
            document.getElementById("selectAll").checked=false;
            $scope.init();


            // elemSubAct = document.getElementById("subactivityMasterId_" + size)
            // nameSubAct = elemSubAct.options[elemSubAct.selectedIndex].text
        }
        $scope.doChangeYear=function(){
            var elemYear = document.getElementById("year");
            var year = elemYear.options[elemYear.selectedIndex].text;
            $scope.selectedYear = year;
            document.getElementById("selectAll").checked=false
            $scope.init();
        }
        $scope.openOnTap = function(idx){
            if(document.getElementById("inner_div_"+idx).style.display=='none'){
                document.getElementById("inner_div_"+idx).style.display='inline-block'
            }else{
                document.getElementById("inner_div_"+idx).style.display='none'
            }

        }
        $scope.dateFormat = function(idx){
            var ddpart;
            var mpart;
            var dtFormat;
            if(idx<8){
                ddpart = "0"+(idx+1)
            }else{
                ddpart = (idx+1)+""
            }
            if (Number($scope.selectedMonth) <= 9)    mpart = "0"+ $scope.selectedMonth;
             else   mpart = $scope.selectedMonth

            dtFormat = ddpart + "-"+mpart + $scope.selectedYear;
            return dtformat

        }
        $scope.deselectCheckBox = function(idx){
            var stat = document.getElementById("status_"+idx).innerHTML
            if(stat != "SAVED"){
                document.getElementById("approve_"+idx).checked = false
                return;
            }
           
            if(!(document.getElementById("approve_"+idx).checked)){
               
                for(i=0;i<$scope.selectedCheckboxIndex.length;i++){
                    if($scope.selectedCheckboxIndex[i]==idx){
                        $scope.selectedCheckboxIndex.splice(i,1);
                    }
                    
                }
                console.log($scope.selectedCheckboxIndex);

            }
            else{
                var count = 0 ;
                for(i=0;i<$scope.selectedCheckboxIndex.length;i++){
                    if($scope.selectedCheckboxIndex[i]==idx){
                        count++;
                    }
                }
                if(count<1){
                    
                    $scope.selectedCheckboxIndex.push(idx);
                }
                
                console.log($scope.selectedCheckboxIndex);
            }

        }
        $scope.selectAll = function(){
            if(!(document.getElementById("selectAll").checked)){
                for(i=0;i<$scope.size;i++){
                    document.getElementById("approve_"+i).checked = false
                }
                $scope.selectedCheckboxIndex = []
            }
            else{
                
                for(i=0;i<$scope.size;i++){
                    var stat = document.getElementById("status_"+i).innerHTML
                    var count =0;
                    if(stat=="SAVED"){
                        for(k=0;k<$scope.selectedCheckboxIndex;k++){
                            if($scope.selectedCheckboxIndex[k]==i){
                                count++;
                            }
                        }
                        if(count<1){
                            document.getElementById("approve_"+i).checked = true
                            $scope.selectedCheckboxIndex.push(i);
                        }else{}
                    }
                }
                console.log($scope.selectedCheckboxIndex);
            }
            
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