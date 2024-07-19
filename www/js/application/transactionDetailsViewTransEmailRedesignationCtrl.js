
mainModule.controller('transactionDetailsViewTransEmailRedesignationCtrl', function($scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading) {
    $rootScope.navHistoryPrevPage = "approvalsTransactionList"
    $scope.nameSearch = {}
    $scope.selectedValues = {}
   
    $scope.init=function(){
        $ionicLoading.show();
        $timeout(function () {
            var tran = $rootScope.transDetailToSend
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
                url: (baseURL + '/transaction/transactionRequisition/viewTransEmailReDesignation.spr'),
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
                            //[ut
                            $timeout(function () {
                                console.log(new Date()+"starting")
                            $scope.buttonRights = success.buttonRights
                            $scope.close = success.close
                            $scope.menuId = success.menuId
                            $scope.updatedIdName = success.updatedIdName
                            $scope.transRequisitionForm = success.transRequisitionForm
                            $scope.getCountOfLevel = success.getCountOfLevel
                            $scope.getCountOfAppNme = success.getCountOfAppNme
                            $scope.getCountOfComments = success.getCountOfComments
                            $scope.currentWkFlwLevel = success.currentWkFlwLevel
                            $scope.listDesignation = success.listDesignation
                            $scope.listJobProfile = success.listJobProfile
                            $scope.companyId = success.companyId
                            $scope.listEmployeeType = success.listEmployeeType
                            $scope.transactionTypeId = success.transactionTypeId
                            $scope.listcountry = success.listcountry
                            $scope.canellation = success.cancellation
                            $scope.countryNameOld = success.countryNameOld
                                console.log("ART FRT ")
                            console.log(success.ArtEmps.length)
                            console.log(success.FrtEmps.length)

                           // $scope.art = success.ArtEmps
                         //   $scope.frt = success.FrtEmps


                          //  $scope.transactionHistory = success.transactionHistory

                           
                           // $scope.transRequisitionForm.transVO.company.companyId =$scope.transRequisitionForm.transVO.company.companyId+""
                            $scope.transRequisitionForm.transVO.jpId.jpIdTo = $scope.transRequisitionForm.transVO.jpId.jpId+""
                            $scope.transRequisitionForm.transVO.location.locationId=$scope.transRequisitionForm.transVO.location.locationId+""
                            $scope.transRequisitionForm.transVO.designation.designationId =$scope.transRequisitionForm.transVO.designation.designationId+""
                            $scope.transRequisitionForm.transVO.employeeCategory.employeeCategoryId=$scope.transRequisitionForm.transVO.employeeCategory.employeeCategoryId+""
                            $scope.transRequisitionForm.transVO.employeeType.employeeTypeId = $scope.transRequisitionForm.transVO.employeeType.employeeTypeId+""
                            $scope.transRequisitionForm.transVO.leaveCategory.leaveCategoryId = $scope.transRequisitionForm.transVO.leaveCategory.leaveCategoryId+""
                            $scope.transRequisitionForm.transVO.holidayCategory.holidayCategoryId = $scope.transRequisitionForm.transVO.holidayCategory.holidayCategoryId+""
                            $scope.transRequisitionForm.artCompanyId = $scope.transRequisitionForm.artCompanyId+""
                            $scope.transRequisitionForm.artEmpId =$scope.transRequisitionForm.artEmpId+""
                            $scope.transRequisitionForm.frtCompanyId = $scope.transRequisitionForm.frtCompanyId+""
                            $scope.transRequisitionForm.frtEmpId = $scope.transRequisitionForm.frtEmpId+""
                            // for(i=0;i<$scope.transRequisitionForm.filteredLevelesAsPerTransaction.length;i++){
                            //     $scope.transRequisitionForm.filteredLevelesAsPerTransaction[i] = $scope.transRequisitionForm.filteredLevelesAsPerTransaction[i]+""
                            // }
                            document.getElementById("jpHead").innerHTML = $scope.transRequisitionForm.transVO.jpId.jpName
                            document.getElementById("jpGradeHead").innerHTML = $scope.transRequisitionForm.jpGradeName
                            document.getElementById("designationHead").innerHTML = $scope.transRequisitionForm.designation
                            document.getElementById("countryHead").innerHTML = $scope.countryNameOld

                            for(i=0;i<success.ArtEmps.length;i++){
                                var artOpt = document.getElementById("ART")
                                if($scope.transRequisitionForm.artEmpId == success.ArtEmps[i].empId){
                                    var opt = new Option(success.ArtEmps[i].fullName+success.ArtEmps[i].empCode,success.ArtEmps[i].empId,true,true)

                                }else{
                                    var opt = new Option(success.ArtEmps[i].fullName+success.ArtEmps[i].empCode,success.ArtEmps[i].empId)

                                }
                                artOpt.add(opt);
                            }
                            for(i=0;i<success.FrtEmps.length;i++){
                                var frtOpt = document.getElementById("FRT")
                                if($scope.transRequisitionForm.frtEmpId == success.FrtEmps[i].empId){
                                    var opt = new Option(success.FrtEmps[i].fullName+success.FrtEmps[i].empCode,success.FrtEmps[i].empId,true,true)

                                }else{
                                    var opt = new Option(success.FrtEmps[i].fullName+success.FrtEmps[i].empCode,success.FrtEmps[i].empId)

                                }
                                frtOpt.add(opt);
                            }
                            for(i=0;i<document.getElementById("ART").options.length;i++){
                                if(document.getElementById("ART").options[i].value == $scope.transRequisitionForm.artEmpId+""){
                                    document.getElementById("ART").selectedIndex = i
                                }
                            }
                            for(i=0;i<document.getElementById("FRT").options.length;i++){
                                if(document.getElementById("FRT").options[i].value == $scope.transRequisitionForm.frtEmpId+""){
                                    document.getElementById("FRT").selectedIndex = i
                                }
                            }
                            if($scope.canellation=='SENT FOR CANCELLATION'){
                                document.getElementById("cancellationDiv").style.display=''
                            }
                            
                            
                               


                            if($scope.transRequisitionForm.transAuthVO.status != 'S'){
                                $('select').prop("disabled", true);

                            }
                           


                            // if (!$scope.$$phase){
                            //     $scope.$apply()
                            // }
                            $ionicLoading.hide();
                            //document.getElementById("mainDiv").style.visibility = "visible"
                            console.log(new Date()+"ending")
                        },200)

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

    $scope.goSave = function(appOrRej){
        var text = ""
       
        if(text==""){
            var empId = $scope.transRequisitionForm.eisPersonal.empId+""
            var jp = document.getElementById("jpList").value.split(":")
            var jpId = parseInt(jp)+""

            $timeout(function () {
           
            
                var fd = new FormData();
               
                //fd.append("empId",$scope.employeeId)
                fd.append("jobProfileId",jpId)
                fd.append("empId",empId)
                //fd.append("buttonRights","Y-Y-Y-Y")
                //fd.append("msg","0")
              // fd.append("message","")
                
               
                $.ajax({
                    url: (baseURL + '/transaction/transaction/checkForPositionCodeAvailabilityWithEmp.spr'),
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
                        if(!(success.clientResponseMsg=="OK")){
                            console.log(success.clientResponseMsg)
                            handleClientResponse(success.clientResponseMsg,"uploadFileReviewerAjax")
                            $ionicLoading.hide()
                            showAlert("Something went wrong. Please try later.")
                            //$scope.redirectOnBack();
                            return
                        }
                        //alert("scuc")
                       if(success.msg == "No"){
                        showAlert("Position's is not Available for the selected Job Profile");
                        return
                       }else{
                           if(appOrRej=='A'){
                            $scope.approve("A")
                           }else{
                               $scope.approve("R")
                           }
                            
                       }
                                
                                    
                    },
                    error: function (e) { //alert("Server error - " + e);
                    //alert(e.status)
                            $ionicLoading.hide()
                           $scope.data_return = {status: e};
                        commonService.getErrorMessage($scope.data_return);
                        
                           }				
                    });	
                },500);		
        

        }else{
            showAlert(text);
            return
        }



    }
    $scope.redirectOnBack=function(){
        $state.go('approvalTransactionList')
    }

    $scope.approve = function(appOrRej){

        
        var fd = new FormData()
        fd.append("menuId","1005")
        fd.append("buttonRights","Y-Y-Y-Y")
        //alert($scope.transRequisitionForm.eisPersonal.empId +""+typeof($scope.transRequisitionForm.eisPersonal.empId))
        fd.append("empId", parseInt($scope.transRequisitionForm.eisPersonal.empId))
        
        fd.append("transactionTypeId",$scope.transRequisitionForm.transactionTypeId)
        fd.append("wefDate",$scope.wefDate)
        fd.append("wef",$scope.wefDate)
        
        var jp = document.getElementById("jpList").value.split(":")
        var jpId = parseInt(jp)
        fd.append("jpId",jpId)
        fd.append("jobProfileIdFrom",""+$scope.transRequisitionForm.eisPersonal.eisCompany.jobProfile.jpId)
        var jpGd = document.getElementById("gradeList").value
        var jpGrade = parseInt(jpGd)
        fd.append("jpGradeId",jpGrade)
        
        var loc = document.getElementById("locationList").value.split(":")
        var locId = parseInt(loc[1])
        fd.append("locationId",locId)
        var des = document.getElementById("designationList").value
        var desId = parseInt(des)
        fd.append("designationId",desId)
       
       
        fd.append("ctc",$scope.transRequisitionForm.eisPersonal.eisCompany.presentCTC)
        fd.append("transAuthId",$scope.transRequisitionForm.transAuthVO.transAuthId)
        //works proper 
        var artEmp = document.getElementById("ART").value
        var artEmpId = artEmp
        fd.append("artEmp",artEmpId)
        var frtEmp = document.getElementById("FRT").value
        var frtEmpId = frtEmp
        fd.append("frtEmp",frtEmpId)
        fd.append("transactionId",$scope.transRequisitionForm.transactionId)
        //fd.append("leaveMasterId",$scope.transRequisitionForm.leaveMasterId)
       // fd.append("creditDays",$scope.transRequisitionForm.creditDays)
        
       
        for(var i=0;i<$scope. transRequisitionForm.empLevelsAppliVOList.length;i++){
            var div = document.getElementById("departmentList_"+i).value.split(":")
         var divId = parseInt(div)
         if(document.getElementById("levelName_"+i)){
        if(document.getElementById("levelName_"+i).innerHTML=="Division"){
           
            fd.append("divisionId",divId)
        }
        if(document.getElementById("levelName_"+i).innerHTML=="Department"){
           
            fd.append("departmentId",divId)
        }
        if(document.getElementById("levelName_"+i).innerHTML=="Sub Department"){
           
            fd.append("subDepartmentId",divId)
        }
        if(document.getElementById("levelName_"+i).innerHTML=="Function"){
           
            fd.append("functionId",divId)
        }
        if(document.getElementById("levelName_"+i).innerHTML=="Sub Function"){
           
            fd.append("subFunctionId",divId)
        }
        if(document.getElementById("levelName_"+i).innerHTML=="Section"){
           
            fd.append("sectionId",divId)
        }
        if(document.getElementById("levelName_"+i).innerHTML=="Sub Section"){
           
            fd.append("subSectionId",divId)
        }
        if(document.getElementById("levelName_"+i).innerHTML=="Zone"){
           
            fd.append("zoneId",divId)
        }
        if(document.getElementById("levelName_"+i).innerHTML=="Region"){
           
            fd.append("regionId",divId)
        }
        if(document.getElementById("levelName_"+i).innerHTML=="Branch"){
           
            fd.append("branchId",divId)
        }
        if(document.getElementById("levelName_"+i).innerHTML=="Plant"){
           
            fd.append("plantId",divId)
        }
        
        if(document.getElementById("levelName_"+i).innerHTML=="Sub Division"){
           
            fd.append("subDivisionId",divId)
        }
    }
        }
        
        var transVO = $scope.transRequisitionForm.transVO
     
        transVO.remarks = $scope.transRequisitionForm.transVO.remarks
       // alert($scope.transRequisitionForm.transVO.ctc)
        transVO.ctc = $scope.transRequisitionForm.eisPersonal.eisCompany.presentCTC
       // transVO.toDate = $scope.transRequisitionForm.transVO.toDate
        transVO.status = "A"
       fd.append("transVOtemp",JSON.stringify(transVO))
       

        var transAuthVO = {}
        transAuthVO.transAuthId = $scope.transRequisitionForm.transAuthVO.transAuthId
        transAuthVO.comments = document.getElementById("comments").value
        if(appOrRej=="A"){
            transAuthVO.status = "A"
        }
        if(appOrRej=="R"){
            transAuthVO.status = "R"
        }
       

        fd.append("transAuthVOtemp",JSON.stringify(transAuthVO))
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
            url: (baseURL + '/transaction/transactionRequisition/processReDesignationRequisition.spr'),
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
           // alert(e.status)
                    $ionicLoading.hide()
                   $scope.data_return = {status: e};
                commonService.getErrorMessage($scope.data_return);
                
                   }				
            });	
        }
        });






    }

    $scope.goCancel=function(apprOrReject){
        var fd = new FormData()
        fd.append("mode","forApproval")
        fd.append("aprvRjct",apprOrReject)
        fd.append("buttonRights","Y-Y-Y-Y")
        fd.append("menuId","1005")
        fd.append("transactionId",$scope.transRequisitionForm.transactionId + "")
        fd.append("transactionTypeId",$scope.transRequisitionForm.transactionTypeId)
        if(apprOrReject=="A"){
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
    // $scope.checkStatus = function(status){

    // }
    $scope.changeFRTList = function(){
        if(document.getElementById("frtCheck").checked){
            document.getElementById("FRT").disabled = true
        }else{
            document.getElementById("FRT").disabled = false
        }
    }
    $scope.changeARTList = function(){
        if(document.getElementById("artCheck").checked){
            document.getElementById("ART").disabled = true
        }else{
            document.getElementById("ART").disabled = false
        }
    }
    $scope.getContractDate1=function(){
        var val = document.getElementById("employeeTypeList").value.split(":")
        var valToSend = val[1];
        $timeout(function () {
           
            
            var fd = new FormData();
           
            //fd.append("empId",$scope.employeeId)
            fd.append("isContract",valToSend)
            fd.append("menuId","1005")
            fd.append("buttonRights","Y-Y-Y-Y")
            //fd.append("msg","0")
          // fd.append("message","")
            
           
            $.ajax({
                url: (baseURL + '/transaction/transactionRequisition/getContract.spr'),
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
                    if(!(success.clientResponseMsg=="OK")){
                        console.log(success.clientResponseMsg)
                        handleClientResponse(success.clientResponseMsg,"uploadFileReviewerAjax")
                        $ionicLoading.hide()
                        showAlert("Something went wrong. Please try later.")
                        //$scope.redirectOnBack();
                        return
                    }
                    //alert("scuc")
                   if(success.msg != ""){
                    document.getElementById("contractEisComLabels").style.display = ''
                    document.getElementById("contractEisComLabelsTo").style.display = ''
                   }else{
                    document.getElementById("contractEisComLabels").style.display = 'none'
                    document.getElementById("contractEisComLabelsTo").style.display = 'none'
                   }
                            
                                
                },
                error: function (e) { //alert("Server error - " + e);
               // alert(e.status)
                        $ionicLoading.hide()
                       $scope.data_return = {status: e};
                    commonService.getErrorMessage($scope.data_return);
                    
                       }				
                });	
            },500);		
    
    }
    $scope.getContractCheck = function(typeId){
        
        
           
            
            var fd = new FormData();
           
            //fd.append("empId",$scope.employeeId)
            fd.append("isContract",typeId)
            fd.append("menuId","1005")
            fd.append("buttonRights","Y-Y-Y-Y")
            //fd.append("msg","0")
          // fd.append("message","")
            
           
            $.ajax({
                url: (baseURL + '/transaction/transaction/getContract.spr'),
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
                    if(!(success.clientResponseMsg=="OK")){
                        console.log(success.clientResponseMsg)
                        handleClientResponse(success.clientResponseMsg,"uploadFileReviewerAjax")
                        $ionicLoading.hide()
                        showAlert("Something went wrong. Please try later.")
                        //$scope.redirectOnBack();
                        return
                    }
                    //alert("scuc")
                   if(success.msg != ""){
                    $scope.typeIdNameFromAjax = "Contract"
                   }else{
                    $scope.typeIdNameFromAjax = "NotContract"
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
    $scope.setDate = function (docid) {
        var date;

        // if ($scope.fDate == null) {
        //     date = new Date();
        // }
        // else {
        //     date = $scope.fDate;
        // }
        date = new Date();

        var options = {date: date, mode: 'date', titleText: 'Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {

                if(docid="contractStartDateTo"){
                    document.getElementById('contractStartDateTo').value = $filter('date')(date, 'dd/MM/yyyy');
                }
                if(docid="contractFromDateTo"){
                    document.getElementById('contractFromDateTo').value = $filter('date')(date, 'dd/MM/yyyy');
                }
                if(docid="contractRenewDateTo"){
                    document.getElementById('contractRenewDateTo').value = $filter('date')(date, 'dd/MM/yyyy');
                }
                if(docid="contractEndDateTo"){
                    document.getElementById('contractEndDateTo').value = $filter('date')(date, 'dd/MM/yyyy');
                }
               
               // $scope.date = $filter('date')(date, 'dd-MM-yyyy');
                // document.getElementById('totalHrs').value = ""
                // $scope.init();

				// if (!$scope.$$phase)
                //     $scope.$apply()

            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
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