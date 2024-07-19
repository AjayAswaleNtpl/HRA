mainModule.controller('requestTransactionDetailsResignationCtrl', function($scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading,$filter) {
    $rootScope.navHistoryPrevPage = "requestTransactionList"
    $scope.selectedValue={}
    $scope.init=function(){
        $ionicLoading.show();
        $timeout(function () {
            var tran = $rootScope.requestTransDetailToSend
            var transactionId = ""+tran.transactionId
            var companyId = ""+tran.companyId
            var transactionTypeId = ""+tran.transTypeId
            var status = tran.status
            $scope.canellation = status
             $scope.wefDate = tran.wefDate

            
            var fd = new FormData();
           
            //fd.append("empId",$scope.employeeId)
            fd.append("buttonRights","Y-Y-Y-Y")
            //fd.append("msg","0")
          // fd.append("message","")
            fd.append("menuId","1005")
            fd.append("transactionId",transactionId)
            fd.append("companyId",companyId)
            fd.append("transactionTypeId",transactionTypeId)
            fd.append("cancellation",status)
           
            $.ajax({
                url: (baseURL + '/transaction/transactionRequisition/viewTransEmailResignationDetails.spr'),
                data: fd,
                type: 'POST',
                async:false,
                timeout:10000,
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
                                showAlert("Something went wrong. Please try later.")
                                //$scope.redirectOnBack();
                                return
                            }	
                            $timeout(function () {
                               // $scope.transRequisitionForm = success.transRequisitionForm
                               $scope.transaction = success.transaction
                               $scope.transaction.lwd = $scope.toDateStringForm($scope.transaction.lwd)
                               if($scope.transaction.initialLwdDate){
                                $scope.transaction.initialLwdDate = $scope.toDateStringForm($scope.transaction.initialLwdDate)

                               }
                               if($scope.transaction.requestedDate){
                                $scope.transaction.requestedDate = $scope.toDateStringForm($scope.transaction.requestedDate)
                               }
                               $scope.transactionTypeId = success.transactionTypeId
                               $scope.empId = success.empId
                               if(success.updatedIdName){
                                $scope.updatedIdName = success.updatedIdName
                               }

                            //    document.getElementById("lwd").innerHTML = $scope.toDateStringForm($scope.transaction.lwd)
                            //    if(document.getElementById("initialLwdDate")){
                            //     document.getElementById("initialLwdDate").innerHTML = $scope.toDateStringForm($scope.transaction.initialLwdDate)

                            //    }
                            //    if($scope.transaction.requestedDate){
                            //     document.getElementById("requestedDate").innerHTML = $scope.toDateStringForm($scope.transaction.requestedDate)

                            //    }

                                $ionicLoading.hide();
                               // $scope.AprvlwdStrCon = success.AprvlwdStrCon


                            },200)



                            //[ut
                        //     $timeout(function () {
                        //         console.log(new Date()+"starting")
                        //     $scope.buttonRights = success.buttonRights
                        //     $scope.close = success.close
                        //     $scope.menuId = success.menuId
                        //     $scope.updatedIdName = success.updatedIdName
                        //     $scope.transRequisitionForm = success.transRequisitionForm
                        //     $scope.art = success.ArtEmps
                        //     $scope.frt = success.FrtEmps
                        //     $scope.oldCtc = success.oldCTC
                        //     $scope.listCountry = success.listCountry
                        //     $scope.oldCountryName = success.countryNameOld
                        //     $scope.listDesignation = success.listDesignation
                        //     $scope.transRequisitionForm.transVO.company.companyId =$scope.transRequisitionForm.transVO.company.companyId+""
                        //     $scope.transRequisitionForm.transVO.jpId.jpIdTo = $scope.transRequisitionForm.transVO.jpId.jpId+""
                        //     $scope.transRequisitionForm.transVO.location.locationId=$scope.transRequisitionForm.transVO.location.locationId+""
                        //     $scope.transRequisitionForm.transVO.designation.designationId =$scope.transRequisitionForm.transVO.designation.designationId+""
                        //     $scope.transRequisitionForm.transVO.employeeCategory.employeeCategoryId=$scope.transRequisitionForm.transVO.employeeCategory.employeeCategoryId+""
                        //     $scope.transRequisitionForm.transVO.employeeType.employeeTypeId = $scope.transRequisitionForm.transVO.employeeType.employeeTypeId+""
                        //     $scope.transRequisitionForm.transVO.leaveCategory.leaveCategoryId = $scope.transRequisitionForm.transVO.leaveCategory.leaveCategoryId+""
                        //     $scope.transRequisitionForm.transVO.holidayCategory.holidayCategoryId = $scope.transRequisitionForm.transVO.holidayCategory.holidayCategoryId+""
                        //     $scope.transRequisitionForm.artCompanyId = $scope.transRequisitionForm.artCompanyId+""
                        //     $scope.transRequisitionForm.artEmpId =$scope.transRequisitionForm.artEmpId+""
                        //     $scope.transRequisitionForm.frtCompanyId = $scope.transRequisitionForm.frtCompanyId+""
                        //     $scope.transRequisitionForm.frtEmpId = $scope.transRequisitionForm.frtEmpId+""
                          
                               
                            
                            
                        //         $timeout(function () {
                        //             var des = document.getElementById("designationList")
                        //             for(var i=0;i<des.options.length;i++){
                        //                 if(des.options[i].value==$scope.transRequisitionForm.transVO.designation.designationId){
                        //                     document.getElementById("designationList").options[i].selected = true
                        //                 }
                        //             }
                        //         for(var i = 0;i<$scope.transRequisitionForm.empLevelsAppliVOList;i++){
                        //             document.getElementById("departmentList_"+i).options.selectedIndex = 1
                        //         }
                        //     },200)
                           


                        //     // if (!$scope.$$phase){
                        //     //     $scope.$apply()
                        //     // }
                        //     $ionicLoading.hide();
                        //     //document.getElementById("mainDiv").style.visibility = "visible"
                        //     console.log(new Date()+"ending")
                        // },2000)

                            // $timeout(function () {
                            //     for(let key of Object.keys($scope.transRequisitionForm.companyList)){
                            //         if($scope.transRequisitionForm.eisPersonal.company.companyName ==$scope.transRequisitionForm.companyList[key] ){
                            //             document.getElementById("companyList").options.selectedValue = key
                            //         }
                            //     }
                            // },200)
                            
                           
                           
                            
    
                           
                         
                           
    
    
                            
                            
                },
                error: function (e) { //alert("Server error - " + e);
                //alert(e.status)
                        $ionicLoading.hide()
                       $scope.data_return = {status: e};
                    commonService.getErrorMessage($scope.data_return);
                    
                       }				
                });	
            },500);		
    
    }
    $scope.toDateStringForm=function(datee){
        var date = new Date(datee);
        var day = date.getDate();
        var month = date.getMonth()+1;
        var year = date.getFullYear()
        if(day<10){
            day = '0'+day
        }
        if(month < 10){
            month = '0'+month
        }
        var finalDate = day + "/" + month + "/" + year
        return finalDate;

    }
    $scope.goSave=function(appOrRej){
        var checks = 'save'
        var text1 = ""
        if($scope.transRequisitionForm.transactionTypeId != 8){
            if($scope.transRequisitionForm.transactionTypeId != 5){
                text1 += $scope.findModifiedNoticePeriodDays(checks)
            }
        }
        if(document.getElementById("revlwd").value == ""){
            text1+="\n Approved Last Working Day Cannot Be Blank.\n"
        }
        if(text1!=""){
            showAlert(text1);
            return
        }
        if(appOrRej == 'A'){
            if($scope.listArtEmps != null){
                var val = document.getElementById("artEmpId").value
                if(val == -1){
                    showAlert("Please Select ART employee for Existing Reportees.")
                    return
                }
            }
            if($scope.listFrtEmps != null){
                var val = document.getElementById("frtEmpId").value
                if(val == -1){
                    showAlert("Please Select ART employee for Existing Reportees.")
                    return
                }
            }
        }

        if($scope.transRequisitionForm.transactionTypeId == 18){
            var contractStartDate = document.getElementById("contractStartDate").value
            var contractEndDate = document.getElementById("contractEndDate").value
            
            var dateStart = contractStartDate.substring(0, 2);
			var monthStart = contractStartDate.substring(3, 5);
			var yearStart = contractStartDate.substring(6, 10);
			var contractStartDateNew = new Date(yearStart, monthStart - 1,
                    dateStart);
                    
            var dateEnd = contractEndDate.substring(0, 2);
            var monthEnd = contractEndDate.substring(3, 5);
            var yearEnd = contractEndDate.substring(6, 10);
            var contractEndDateNew = new Date(yearEnd, monthEnd - 1, dateEnd);

            if(document.getElementById("contractEndDate").value != ''){
              
                    if (contractEndDateNew < contractStartDateNew){
                        showAlert("Contract End Date must be greater than the Contract Start Date\n")
                        return
                    }
                
            }else{
                showAlert("Please enter the Contract End Date\n")
                return
            }
        }

        var lwd = document.getElementById("revlwd").value
        var wef  = $scope.toDateStringForm($scope.transRequisitionForm.transVO.wef)

        if($scope.transRequisitionForm.transactionTypeId == 5){
            var revlwd =document.getElementById("revlwd").value
			var parts = wef.split("/");
			var dtWEF = new Date(parseInt(parts[2], 10),
					parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));

			var parts = revlwd.split("/");
			var lwdDte = new Date(parseInt(parts[2], 10),
                    parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
                    
            if (lwdDte > dtWEF){
                showAlert("Approved Last Working Date Should not be Greater then With Effective From Date in Termination \n")
                return
            }
        }
        if($scope.transRequisitionForm.transactionTypeId == 18){
            var revlwd = document.getElementById("revlwd").value
			var parts = wef.split("/");
			var dtWEF = new Date(parseInt(parts[2], 10),
					parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));

			var parts = revlwd.split("/");
			var lwdDte = new Date(parseInt(parts[2], 10),
                    parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
            
            if (lwdDte > dtWEF){
                showAlert("Approved Last Working Date Should not be Greater then With Effective From Date in Termination Of Contract\n")
            }

        }
        var fd = new FormData();
        fd.append("menuId","1005")
        fd.append("buttonRights","Y-Y-Y-Y")
        fd.append("days",document.getElementById("days").value)
        fd.append("amount",document.getElementById("amount").value + "")
        fd.append("revlwd",document.getElementById("revlwd").value)
        fd.append("recdaysAdj",document.getElementById("recdaysAdj").value + "")
        if(document.getElementById("allowLeave").checked){
            fd.append("allowLeavecheck","on")
        }else{
            fd.append("allowLeavecheck","")
        }
        
        fd.append("recdays",document.getElementById("recdays").value + "")
        if(document.getElementById("rehire1").checked){
            fd.append("rehire","on")

        }else{
            fd.append("rehire","")
        }
        
        if(document.getElementById("artEmpId")){
            fd.append("artEmpId",document.getElementById("artEmpId").value)
        fd.append("frtEmpId",document.getElementById("frtEmpId").value)

        }
        fd.append("empId",$scope.transRequisitionForm.eisPersonal.empId)
        fd.append("wef",$scope.toDateStringForm($scope.transRequisitionForm.transVO.wef))
        fd.append("lwd",$scope.toDateStringForm($scope.transRequisitionForm.transVO.initialLwdDate))
        fd.append("transactionTypeId",$scope.transRequisitionForm.transactionTypeId)
        fd.append("transactionId",$scope.transRequisitionForm.transactionId)
        fd.append("transAuthId",$scope.transRequisitionForm.transAuthVO.transAuthId)

        var transVOtoSend = {}
        transVOtoSend.remarks = $scope.transRequisitionForm.transVO.remarks
        fd.append("transVOtemp",JSON.stringify(transVOtoSend))
        var transAuthVOtoSend = {}
        if(appOrRej == 'A'){
            transAuthVOtoSend.status = "A"
        }else{
            transAuthVOtoSend.status = "R"
        }
        fd.append("transAuthVOTemp",JSON.stringify(transAuthVOtoSend))
        
        
        if(appOrRej == "A"){
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to Approve ?', //Message
            });
        }else{
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to Reject ?', //Message
            });
        }
        confirmPopup.then(function(res){
            if(res){
            $.ajax({
                url: (baseURL + '/transaction/transactionRequisition/processResignationRequisition.spr'),
                data: fd,
                type: 'POST',
                async:false,
                timeout: 120000,
                contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                processData: false, // NEEDED, DON'T OMIT THIS
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                 },
                success : function(success) {
                    if(!(success.clientResponseMsg=="OK")){
                        console.log(success.clientResponseMsg)
                        handleClientResponse(success.clientResponseMsg,"uploadFileReviewerAjax")
                        $ionicLoading.hide()
                        
                        showAlert("Something went wrong. Please try later.")
                        //$scope.redirectOnBack();
                        return
                    }
                    //alert("scuc")
                    if(appOrRej=="A"){
                        showAlert("Approved Successfully")
                    }else{
                        showAlert("Rejected Successfully")
                    }
                   
                   $state.go('approvalTransactionList')
                            
                                
                },
                error: function (e) { //alert("Server error - " + e);
                //alert(e.status)
                        $ionicLoading.hide()
                       $scope.data_return = {status: e};
                    commonService.getErrorMessage($scope.data_return);
                    
                       }				
                });	
            }
            });
    
    

    }
    $scope.redirectOnBack=function(){
        $state.go('requestTransactionList')
    }
    $scope.goCancel=function(apprOrReject){
        var fd = new FormData()
        fd.append("mode","forApproval")
        fd.append("aprvRjct",apprOrReject)
        fd.append("buttonRights","Y-Y-Y-Y")
        fd.append("menuId","1005")
        fd.append("transactionId",$scope.transRequisitionForm.transactionId + "")
        fd.append("transactionTypeId",$scope.transRequisitionForm.transactionTypeId)
        if(appOrRej=="A"){
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to Approve ?', //Message
            });
        }else{
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to Reject?', //Message
            });
        }
        confirmPopup.then(function(res){
            if(res){

            
        $.ajax({
            url: (baseURL + '/transaction/transactionRequisition/cancelTransaction.spr'),
            data: fd,
            type: 'POST',
            async:false,
            timeout: 120000,
            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
             },
            success : function(success) {
                if(!(success.clientResponseMsg=="OK")){
                    console.log(success.clientResponseMsg)
                    handleClientResponse(success.clientResponseMsg,"uploadFileReviewerAjax")
                    $ionicLoading.hide()
                    
                    showAlert("Something went wrong. Please try later.")
                    //$scope.redirectOnBack();
                    return
                }
                //alert("scuc")
                if(apprOrReject=="A"){
                    showAlert("Cancellation Approved Successfully")
                }else{
                    showAlert("Cancellation Rejected Successfully")
                }
               
               $state.go('approvalTransactionList')
                        
                            
            },
            error: function (e) { //alert("Server error - " + e);
            //alert(e.status)
                    $ionicLoading.hide()
                   $scope.data_return = {status: e};
                commonService.getErrorMessage($scope.data_return);
                
                   }				
            });	
        }
        });



    }
    $scope.enableLeaveBalance = function(){
        if(document.getElementById("leaveBalanceDiv").style.display=="none"){
            document.getElementById("leaveBalanceDiv").style.display=""
        }else{
            document.getElementById("leaveBalanceDiv").style.display = "none"
        }
    }

    $scope.getArtEmployeeList = function(){
        $("#artEmpId").empty();
        var select = document.getElementById("artEmpId")
        select.add(new Option("Please Select",-1))
        var fd=new FormData();
        fd.append("empId",$scope.transRequisitionForm.eisPersonal.empId);
        fd.append("jobProfileId", document.getElementById("jobProfileId").value)
        fd.append("artCompanyId",document.getElementById("artCompanyId").value)
        $.ajax({
            url: (baseURL + '/transaction/transaction/getArtEmployeeList.spr'),
            data: fd,
            type: 'POST',
            async:false,
            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
             },
            success : function(success) {
            
                for(var count=0;count<success.length;count++){
                    select.add(new Option(success[count].fullName + '('+ success[count].empCode+')',success[count].empId))
                }
                      
                           
                        
                  
                        
            },
            error: function (e) { //alert("Server error - " + e);
            //alert(e.status)
                    $ionicLoading.hide()
                   $scope.data_return = {status: e};
                commonService.getErrorMessage($scope.data_return);
                
                   }				
            });	
   
    }

    $scope.getArtEmployeeList = function(){
        $("#frtEmpId").empty();
        var select = document.getElementById("frtEmpId")
        select.add(new Option("Please Select",-1))
        var fd=new FormData();
        fd.append("empId",$scope.transRequisitionForm.eisPersonal.empId);
        fd.append("jobProfileId", document.getElementById("jobProfileId").value)
        fd.append("artCompanyId",document.getElementById("artCompanyId").value)
        $.ajax({
            url: (baseURL + '/transaction/transaction/getArtEmployeeList.spr'),
            data: fd,
            type: 'POST',
            async:false,
            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
             },
            success : function(success) {
            
                for(var count=0;count<success.length;count++){
                    select.add(new Option(success[count].fullName + '('+ success[count].empCode+')',success[count].empId))
                }
                      
                           
                        
                  
                        
            },
            error: function (e) { //alert("Server error - " + e);
           // alert(e.status)
                    $ionicLoading.hide()
                   $scope.data_return = {status: e};
                commonService.getErrorMessage($scope.data_return);
                
                   }				
            });	
   
    }
    $scope.viewTotalApps = function(){
        if(document.getElementById("allAppsApprovals").style.display=='none'){
            document.getElementById("allAppsApprovals").style.display = ''
        }else{
            document.getElementById("allAppsApprovals").style.display = ''
        }
    }
    $scope.setDate = function () {
        var date;

        
            date = new Date();
       

        var options = {date: date, mode: 'date', titleText: 'Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {

               
                document.getElementById('revlwd').value = $filter('date')(date, 'dd/MM/yyyy');
                $scope.findWeekOffHoliday();
                if (!$scope.$$phase)
                    $scope.$apply()
               

				

            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
    }
    $scope.findWeekOffHoliday = function(){
        var empId = $scope.transRequisitionForm.eisPersonal.empId
        var revlwd = document.getElementById("revlwd").value
        var fd = new FormData();
        fd.append("lastWrkDay",revlwd)
        fd.append("empId",empId)

        $.ajax({
            url: (baseURL + '/transaction/transaction/getArtEmployeeList.spr'),
            data: fd,
            type: 'POST',
            async:false,
            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
             },
            success : function(success) {
            
                if(success != ''){
                    var text = success
                    text = text.split("@")
                    document.getElementById("lableWeekHoli").innerHTML = text[0]
                    document.getElementById("revlwd").value = text[1]
                }
                      
                    $scope.findModifiedNoticePeriodDays('nonsave');    
                        
                  
                        
            },
            error: function (e) { //alert("Server error - " + e);
           // alert(e.status)
                    $ionicLoading.hide()
                   $scope.data_return = {status: e};
                commonService.getErrorMessage($scope.data_return);
                
                   }				
            });	
   

    }
    $scope.findModifiedNoticePeriodDays = function(msg){
        var text = ""
        var lwd = $scope.toDateStringForm($scope.transRequisitionForm.transVO.initialLwdDate)
        var revlwd = document.getElementById("revlwd").value

        var wef = $scope.toDateStringForm($scope.transRequisitionForm.transVO.wef)
        if($scope.transRequisitionForm.transactionTypeId != 5){
            if(revlwd != ''){
                var parts = wef.split("/");
				var dtWEF = new Date(parseInt(parts[2], 10), parseInt(parts[1],
						10) - 1, parseInt(parts[0], 10));

				var parts = lwd.split("/");
				var lwddtWEF = new Date(parseInt(parts[2], 10), parseInt(
						parts[1], 10) - 1, parseInt(parts[0], 10));
				var parts = revlwd.split("/");
				var revlwddtWEF = new Date(parseInt(parts[2], 10), parseInt(
						parts[1], 10) - 1, parseInt(parts[0], 10));

                var modifiedDays = $scope.days_between(revlwddtWEF, lwddtWEF);
                
                //$("#recdays").val(modifiedDays);
                document.getElementById("recdays").value = modifiedDays
                $("#recdaysLbl").text(modifiedDays + " Days");
                document.getElementById("recdaysLbl").textContent = modifiedDays + " Days"
                document.getElementById("dbRecDaysLbl").textContent = ""
                //$("#dbRecDaysLbl").text("");
                document.getElementById("dbRevNoticePrd").textContent = ""
                //$("#dbRevNoticePrd").text("");
                
                if (msg == 'save') {
					//$("#recdaysAdj").val(modifiedDays);
				} else {
                    document.getElementById("recdaysAdj").value = modifiedDays
					//$("#recdaysAdj").val(modifiedDays);
                }
                var diffDays = (parseInt($scope.ExistNoticePeriod) - parseInt(modifiedDays));
                document.getElementById("days").value = diffDays
                document.getElementById("daysLbl").textContent = diffDays + " Days"
               // $("#daysLbl").text(diffDays + " Days");
               if (revlwddtWEF < dtWEF) {
                if (msg == 'save') {
                    text += "Approved Last Working Date cannot be less than the With Effect From Date";
                } else {
                    showAlert("Approved Last Working Date cannot be less than the With Effect From Date")
                   
                }
            }
            if (revlwddtWEF > lwddtWEF) {
                var incrDays = (parseInt('${ExistNoticePeriod}') + parseInt(modifiedDays));
               // $("#days").val(incrDays);
                document.getElementById("days").value = incrDays
               // $("#daysLbl").text(incrDays + " Days");
                document.getElementById("daysLbl").textContent = incrDays + " Days"
                //$("#recdays").val(0);
                document.getElementById("recdays").value = 0
               // $("#recdaysLbl").text(0 + " Days");
                document.getElementById("recdaysLbl").textContent = 0+" Days"
               // $("#recdaysAdj").val(0);
                document.getElementById("recdaysAdj").value = 0
               // $("#dbRecDaysLbl").text("");
                document.getElementById("dbRecDaysLbl").textContent = ""
               // $("#dbRevNoticePrd").text("");
                document.getElementById("dbRevNoticePrd").textContent = ""
            }
            }
            if (msg == 'save') {
				return text;
			}
        }

    }
    $scope.days_between = function(date1, date2){
        var ONE_DAY = 1000 * 60 * 60 * 24;
		var date1_ms = date1.getTime();
		var date2_ms = date2.getTime();
		var difference_ms = Math.abs(date1_ms - date2_ms);
		return Math.round(difference_ms / ONE_DAY);
    }
    // $scope.changeFilter = function(values){
    //     var radioVal = ""
    //     if(values == ''){
    //         radioVal = 
    //     }
    // }
    $scope.onAllTrackerCust=function(values) {
		var text = "";
		var transactionEmployeeEmpId = $("#assignToOneEmpId").val();
		var matchCheck = $("#matchFoundAllTrackerVO").val();
		if (matchCheck == "Found") {
			if (transactionEmployeeEmpId != '0') {
				$("#matchFoundAllTrackerVO").val("Found");
			}
		} else {
			if (transactionEmployeeEmpId == '0') {
				text += "\n Please Enter Employee Name or Code.";
			}
			if (transactionEmployeeEmpId != '0') {
				text += "\n Entered Employee Name or Code is Incorrect.";
			}
			$("#matchFoundAllTrackerVO").val("NotFound");
			showAlert("\nEntered Employee Name or Code is Incorrect.")
		}
		if (values == 'save') {
			return text;
		}
    }
    
    $scope.onLeaveCust=function(values) {
		var text = "";
		var transactionEmployeeEmpId = $("#leaveAprvEmpId").val();
		var matchCheck = $("#matchFoundLeaveTrackerVO").val();
		if (matchCheck == "Found") {
			if (transactionEmployeeEmpId != '0') {
				$("#matchFoundLeaveTrackerVO").val("Found");
			}
		} else {
			if (transactionEmployeeEmpId == '0') {
				text += "\n Please Enter Employee Name or Code.";
			}
			if (transactionEmployeeEmpId != '0') {
				text += "\n Entered Employee Name or Code is Incorrect.";
			}
			$("#matchFoundLeaveTrackerVO").val("NotFound");
			showAlert("\n Entered Employee Name or Code is Incorrect.")
		}
		if (values == 'save') {
			return text;
		}
    }
     $scope.onTransactionCust = function(values) {
		var text = "";
		var transactionEmployeeEmpId = $("#transApprvEmpIdEmpId").val();
		var matchCheck = $("#matchFoundTransactionTrackerVO").val();
		if (matchCheck == "Found") {
			if (transactionEmployeeEmpId != '0') {
				$("#matchFoundTransactionTrackerVO").val("Found");
			}
		} else {
			if (transactionEmployeeEmpId == '0') {
				text += "\n Please Enter Employee Name or Code.";
			}
			if (transactionEmployeeEmpId != '0') {
				text += "\n Entered Employee Name or Code is Incorrect.";
			}
			$("#matchFoundTransactionTrackerVO").val("NotFound");
			showAlert("\n Entered Employee Name or Code is Incorrect.")
		}
		if (values == 'save') {
			return text;
		}
    }
    $scope.onOdCust = function(values) {
		var text = "";
		var transactionEmployeeEmpId = $("#odApprvEmpId").val();
		var matchCheck = $("#matchFoundODTrackerVO").val();
		if (matchCheck == "Found") {
			if (transactionEmployeeEmpId != '0') {
				$("#matchFoundODTrackerVO").val("Found");
			}
		} else {
			if (transactionEmployeeEmpId == '0') {
				text += "\n Please Enter Employee Name or Code.";
			}
			if (transactionEmployeeEmpId != '0') {
				text += "\n Entered Employee Name or Code is Incorrect.";
			}
			$("#matchFoundODTrackerVO").val("NotFound");
			showAlert("\n Entered Employee Name or Code is Incorrect.")
		}
		if (values == 'save') {
			return text;
		}
    }
    $scope.onClaimCust = function(values) {
		var text = "";
		var transactionEmployeeEmpId = $("#expenceAppApprvEmpId").val();
		var matchCheck = $("#matchFoundClaimTrackerVO").val();
		if (matchCheck == "Found") {
			if (transactionEmployeeEmpId != '0') {
				$("#matchFoundClaimTrackerVO").val("Found");
			}
		} else {
			if (transactionEmployeeEmpId == '0') {
				text += "\n Please Enter Employee Name or Code.";
			}
			if (transactionEmployeeEmpId != '0') {
				text += "\n Entered Employee Name or Code is Incorrect.";
			}
			$("#matchFoundClaimTrackerVO").val("NotFound");
			showAlert("\n Entered Employee Name or Code is Incorrect.")

		}
		if (values == 'save') {
			return text;
		}
    }
    $scope.onTravelTrackCust = function(values) {
		var text = "";
		var transactionEmployeeEmpId = $("#travelAppApprvEmpId").val();
		var matchCheck = $("#matchFoundTravelTrackerVO").val();
		if (matchCheck == "Found") {
			if (transactionEmployeeEmpId != '0') {
				$("#matchFoundTravelTrackerVO").val("Found");
			}
		} else {
			if (transactionEmployeeEmpId == '0') {
				text += "\n Please Enter Employee Name or Code.";
			}
			if (transactionEmployeeEmpId != '0') {
				text += "\n Entered Employee Name or Code is Incorrect.";
			}
			$("#matchFoundTravelTrackerVO").val("NotFound");
			showAlert("Entered Employee Name or Code is Incorrect.")
		}
		if (values == 'save') {
			return text;
		}
    }
    $scope.onMusterCust = function(values) {
		var text = "";
		var transactionEmployeeEmpId = $("#attRecApprvEmpId").val();
		var matchCheck = $("#matchFoundMusterTrackerVO").val();
		if (matchCheck == "Found") {
			if (transactionEmployeeEmpId != '0') {
				$("#matchFoundMusterTrackerVO").val("Found");
			}
		} else {
			if (transactionEmployeeEmpId == '0') {
				text += "\n Please Enter Employee Name or Code.";
			}
			if (transactionEmployeeEmpId != '0') {
				text += "\n Entered Employee Name or Code is Incorrect.";
			}
			$("#matchFoundMusterTrackerVO").val("NotFound");
			showAlert("\n Entered Employee Name or Code is Incorrect.")
		}
		if (values == 'save') {
			return text;
		}
    }
    $scope.onShiftCust = function(values) {
		var text = "";
		var transactionEmployeeEmpId = $("#shiftChgApprvEmpId").val();
		var matchCheck = $("#matchFoundShiftChangeTrackerVO").val();
		if (matchCheck == "Found") {
			if (transactionEmployeeEmpId != '0') {
				$("#matchFoundShiftChangeTrackerVO").val("Found");
			}
		} else {
			if (transactionEmployeeEmpId == '0') {
				text += "\n Please Enter Employee Name or Code.";
			}
			if (transactionEmployeeEmpId != '0') {
				text += "\n Entered Employee Name or Code is Incorrect.";
			}
			$("#matchFoundShiftChangeTrackerVO").val("NotFound");
			showAlert("\n Entered Employee Name or Code is Incorrect.")
		}
		if (values == 'save') {
			return text;
		}
    }
    $scope.onTravelClaimCust = function(values) {
		var text = "";
		var transactionEmployeeEmpId = $("#travelClaimApprvEmpId").val();
		var matchCheck = $("#matchFoundTravelClaimTrackerVO").val();
		if (matchCheck == "Found") {
			if (transactionEmployeeEmpId != '0') {
				$("#matchFoundTravelClaimTrackerVO").val("Found");
			}
		} else {
			if (transactionEmployeeEmpId == '0') {
				text += "\n Please Enter Employee Name or Code.";
			}
			if (transactionEmployeeEmpId != '0') {
				text += "\n Entered Employee Name or Code is Incorrect.";
			}
			$("#matchFoundTravelClaimTrackerVO").val("NotFound");
			showAlert("\n Entered Employee Name or Code is Incorrect.")
		}
		if (values == 'save') {
			return text;
		}
    }
    $scope.openFile1 = function(transRequi){
		
		
        //event.stopPropagation();
       
        //alert(fileId)
        var fd = new FormData();
        fd.append("transactionId",transRequi.transactionId+"")
        
        
        $.ajax({
                url: baseURL + '/transaction/transactionRequisition/downloadFile.spr',
                data: fd,
                type: 'POST',
                timeout: commonRequestTimeout,
                contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                processData: false, // NEEDED, DON'T OMIT THIS
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                 },
                success : function(result) {
                    if (!(result.clientResponseMsg=="OK")){
                                console.log(result.clientResponseMsg)
                                handleClientResponse(result.clientResponseMsg,"openFileMobile")
                                $ionicLoading.hide()
                                showAlert("Something went wrong. Please try later.")
                                return
                            }	
                            $scope.FileParmsObject = {}
                            $scope.FileParmsObject.uploadFile = result.uploadFile
                            $scope.FileParmsObject.uploadContentType = result.uploadContentType
                            $scope.FileParmsObject.uploadFileName = result.uploadFileName
                            
                            
                            $scope.downloadAttachmnent($scope.FileParmsObject)
                            $ionicLoading.hide()
                },
                error : function(res){
                            $ionicLoading.hide()
                            showAlert("Something went wrong while fetching the file.");
                }
                
                });
    }
   
    $scope.openFile2 = function(transRequi){
		
		
        //event.stopPropagation();
        
        //alert(fileId)
        var fd = new FormData();
        fd.append("transactionId",transRequi.transactionId+"")
        
        
        $.ajax({
                url: baseURL + '/transaction/transactionRequisition/openFile.spr',
                data: fd,
                type: 'POST',
                timeout: commonRequestTimeout,
                contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                processData: false, // NEEDED, DON'T OMIT THIS
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                 },
                success : function(result) {
                    if (!(result.clientResponseMsg=="OK")){
                                console.log(result.clientResponseMsg)
                                handleClientResponse(result.clientResponseMsg,"openFileMobile")
                                $ionicLoading.hide()
                                showAlert("Something went wrong. Please try later.")
                                return
                            }	
                            $scope.FileParmsObject = {}
                            $scope.FileParmsObject.uploadFile = result.uploadFile
                            $scope.FileParmsObject.uploadContentType = result.uploadContentType
                            $scope.FileParmsObject.uploadFileName = result.uploadFileName
                            
                            
                            $scope.downloadAttachmnent($scope.FileParmsObject)
                            $ionicLoading.hide()
                },
                error : function(res){
                            $ionicLoading.hide()
                            showAlert("Something went wrong while fetching the file.");
                }
                
                });
    }
    $scope.downloadAttachmnent = function (travel) {

        var strData = travel.uploadFile
        //var strUrlPrefix='data:"application/pdf;base64,'
        var strUrlPrefix = 'data:' + travel.uploadContentType + ";base64,"
        var url = strUrlPrefix + strData
        var blob = base64toBlob(strData, travel.uploadContentType)
        downloadFileFromData(travel.uploadFileName, blob, travel.uploadContentType)
        event.stopPropagation();
      }
    $scope.init();
})