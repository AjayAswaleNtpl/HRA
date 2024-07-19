mainModule.controller('transactionDetailsViewTransEmailConfirmationCtrl', function($scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading) {
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
                url: baseURL + '/transaction/transactionRequisition/viewTransEmailConfirmation.spr',
                data: fd,
                type: 'POST',
                dataType: 'json',
                timeout:commonRequestTimeout,
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
                            $scope.art = success.ArtEmps
                            $scope.frt = success.FrtEmps
                            $scope.oldCtc = success.oldCTC
                            $scope.listCountry = success.listCountry
                            $scope.oldCountryName = success.countryNameOld
                            $scope.listDesignation = success.listDesignation
                            $scope.transRequisitionForm.transVO.company.companyId =$scope.transRequisitionForm.transVO.company.companyId+""
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

                            $scope.pastCostCenterList = success.pastCostCenter
                            $scope.presentCostCenterList = success.presentCostCenter
                          
                            if($scope.canellation=='SENT FOR CANCELLATION'){
                                document.getElementById("cancellationDiv").style.display=''
                            }
                            
                            
                                $timeout(function () {
                                    var des = document.getElementById("designationList")
                                    for(var i=0;i<des.options.length;i++){
                                        if(des.options[i].value==$scope.transRequisitionForm.transVO.designation.designationId){
                                            document.getElementById("designationList").options[i].selected = true
                                        }
                                    }
                                for(var i = 0;i<$scope.transRequisitionForm.empLevelsAppliVOList;i++){
                                   
                                    document.getElementById("departmentList_"+i).options.selectedIndex = 1
                                }
                            },200)

                            if($scope.transRequisitionForm.transAuthVO.status != 'S'){
                                $('select').prop("disabled", true);

                            }
                           


                            // if (!$scope.$$phase){
                            //     $scope.$apply()
                            // }
                            $ionicLoading.hide();
                            //document.getElementById("mainDiv").style.visibility = "visible"
                            console.log(new Date()+"ending")
                        },2000)

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
        var company = document.getElementById("companyList")
        if(company.options[company.selectedIndex].text == "Please Select" || company.options[company.selectedIndex].text == ""){
            text += "Please select at least one Company \n"
        }
        var jp = document.getElementById("jpList")
        if(jp.options[jp.selectedIndex].text == "Please Select" || jp.options[jp.selectedIndex].text == ""){
            text += "Please select at least one Job Profile \n"
        }
        var grd = document.getElementById("gradeList")
        if(grd.options[grd.selectedIndex].text == "Please Select" || grd.options[grd.selectedIndex].text == ""){
            text += "Please select at least one Grade \n"
        }
        var loc = document.getElementById("locationList")
        if(loc.options[loc.selectedIndex].text == "Please Select" || loc.options[loc.selectedIndex].text == ""){
            text += "Please select at least one Office \n"
        }
        var desig = document.getElementById("designationList")
        if(desig.options[desig.selectedIndex].text == "Please Select" || desig.options[desig.selectedIndex].text == ""){
            text += "Please select at least one Designation \n"
        }
        var ecat = document.getElementById("empCatList")
        if(ecat.options[ecat.selectedIndex].text == "Please Select" || ecat.options[ecat.selectedIndex].text == ""){
            text += "Please select at least one Employee Category \n"
        }
        var etype =document.getElementById("employeeTypeList")
        if(etype.options[etype.selectedIndex].text == "Please Select" || etype.options[etype.selectedIndex].text == ""){
            text += "Please select at least one Employee Type \n"
        }
        if($scope.transRequisitionForm.transactionTypeId == 3){
            if(document.getElementById("noticePeriod").value == ""){
                text += "Notice Period Cannot be Blank \n"
            }
            if(document.getElementById("noticePeriod").value != ""){
                if(document.getElementById("noticePeriod").value == 0){
                    text += "Notice Period Cannot be 0 \n"
                }
            }
        }
        var leaveCat = document.getElementById("leaveCategoryTypeList")
        if(leaveCat.options[leaveCat.selectedIndex].text == "Please Select" || leaveCat.options[leaveCat.selectedIndex].text == ""){
            text += "Please select at least one Leave Category \n"
        }
        var holidayCat = document.getElementById("holidayList")
        if(holidayCat.options[holidayCat.selectedIndex].text == "Please Select" || holidayCat.options[holidayCat.selectedIndex].text == ""){
            text += "Please select at least one Holiday Category \n"
        }
        if($scope.transRequisitionForm.transactionName == 'Confirmation'){
            if($scope.transRequisitionForm.transTrainingVOList.length > 0){
                for(var i=0;i<10;i++){
                    var lnd = document.getElementById("lnd_"+i)
                    if(lnd.options[lnd.selectedIndex].text != "Please Select"){
                        var tt = document.getElementById("trainingType_"+i)
                        
                        if(tt.options[tt.selectedIndex].text == "Please Select"){
                            text += "Training Type can not be blank for row "+i +"\n"
                        }
                        var tc = document.getElementById("trainingCategory_"+i)
                        if(tc.options[tc.selectedIndex].text == "Please Select"){
                            text += "Training Category can not be blank for row "+i +"\n"
                        }

                        tsc = document.getElementById("trainingSubCategory_"+i)
                        if(tsc.options[tsc.selectedIndex].text == "Please Select"){
                            text += "Training Sub Category can not be blank for row "+i +"\n"
                        }
                    }
                }
            }
        }
        
       // var message = $scope.checkStatus(msg);
        var val = document.getElementById("employeeTypeList").value.split(":")
        
        var typeId = val[1]
         $scope.getContractCheck(typeId)
        if($scope.typeIdNameFromAjax=="Contract"){
            if(document.getElementById("contractStartDateTo")!=null || document.getElementById("contractStartDateTo")!=undefined){
            if(document.getElementById("contractStartDateTo").value != undefined){
                var contractStartDate = document.getElementById("contractStartDateTo").value
                var contractRenewDate = document.getElementById("contractRenewDateTo").value
                if(contractRenewDate == null || contractRenewDate == "undefined"){
                    showAlert("Please enter the Contract Renewal Date in the appropriate format\n")
                    return
                }
                var contractEndDate = document.getElementById("contractEndDateTo").value
                var eisComEndDt  = $scope.transRequisitionForm.contractEndtDateHist


                var eisDD = eisComEndDt.substring(0, 2);
			    var eisMonthStart = eisComEndDt.substring(3, 5);
		        var eisYearStart = eisComEndDt.substring(6, 10);
                var eisCompanyEndDate = new Date(eisYearStart, eisMonthStart - 1, eisDD);
                
                var dateStart = contractStartDate.substring(0, 2);
                var monthStart = contractStartDate.substring(3, 5);
                var yearStart = contractStartDate.substring(6, 10);
                var contractStartDateNew = new Date(yearStart, monthStart - 1, dateStart);
                
                var dateRenew = contractRenewDate.substring(0, 2);
                var monthRenew = contractRenewDate.substring(3, 5);
                var yearRenew = contractRenewDate.substring(6, 10);
                var contractRenewDateNew = new Date(yearRenew, monthRenew - 1, dateRenew);
                
                var dateEnd = contractEndDate.substring(0, 2);
                var monthEnd = contractEndDate.substring(3, 5);
                var yearEnd = contractEndDate.substring(6, 10);
                var contractEndDateNew = new Date(yearEnd, monthEnd - 1, dateEnd);

                if(contractEndDateNew < contractStartDateNew){
			  					
                    showAlert('Contract End Date must be greater than the Contract Start Date\n');
            
                    return;
                
                }
                if(contractEndDateNew < contractRenewDateNew){
                        
                    showAlert('Contract End Date must be greater than Contract Renewal Date\n');
            
                    return;
            
                }
    
            }else{
                showAlert("Please Contact Your HR, To Add Contract Start Date & Contract End Date.")
                return
            }
        }else{
            showAlert("Please Contact Your HR, To Add Contract Start Date & Contract End Date.")
                return
        }
        }
        if(text==""){
            var empId = $scope.transRequisitionForm.eisPersonal.empId
            var jp = document.getElementById("jpList").value.split(":")
            var jpId = jp[1]

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
                   // alert(e.status)
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

    $scope.approve = function(appOrRej){

        
        var fd = new FormData()
        fd.append("menuId","1005")
        fd.append("buttonRights","Y-Y-Y-Y")
        //alert($scope.transRequisitionForm.eisPersonal.empId +""+typeof($scope.transRequisitionForm.eisPersonal.empId))
        fd.append("empId", parseInt($scope.transRequisitionForm.eisPersonal.empId))

        fd.append("transactionId",$scope.transRequisitionForm.transactionId)
        
        fd.append("transactionTypeId",$scope.transRequisitionForm.transactionTypeId)
        fd.append("wefDate",$scope.wefDate)
        fd.append("wef",$scope.wefDate)
        var com = document.getElementById("companyList").value.split(":")
        var compId = com[1]
        fd.append("newCompanyId",compId)
        var jp = document.getElementById("jpList").value.split(":")
        var jpId = parseInt(jp[1])
        fd.append("jpId",jpId)
        fd.append("jobProfileIdFrom",""+$scope.transRequisitionForm.transVO.jpId.jpId)
        var jpGd = document.getElementById("gradeList").value
        var jpGrade = parseInt(jpGd)
        fd.append("jpGradeId",jpGrade)
        
        var loc = document.getElementById("locationList").value.split(":")
        var locId = parseInt(loc[1])
        fd.append("locationId",locId)
        var des = document.getElementById("designationList").value
        var desId = parseInt(des)
        fd.append("designationId",desId)
        var ecat = document.getElementById("empCatList").value.split(":")
        var ecatId = parseInt(ecat[1])
        fd.append("employeeCategoryId",ecatId)
        var etype = document.getElementById("employeeTypeList").value.split(":")
        var etypeId = parseInt(etype[1])
        fd.append("employeeTypeId",etypeId)
        var leaveCat = document.getElementById("leaveCategoryTypeList").value.split(":")
        var leaveCatId = parseInt(leaveCat[1])
        fd.append("leaveCategoryId",leaveCatId)
        var holCat = document.getElementById("holidayList").value
        var holCatId = parseInt(holCat)
        fd.append("holidatCategoryId",holCatId)
        fd.append("ctc",$scope.oldCtc)
        fd.append("transAuthId",$scope.transRequisitionForm.transAuthVO.transAuthId)
        //works proper 
        var artEmp = document.getElementById("ART").value
        var artEmpId = artEmp
        fd.append("artEmp",artEmpId)
        var frtEmp = document.getElementById("FRT").value
        var frtEmpId = frtEmp
        fd.append("frtEmp",frtEmpId)
        fd.append("leaveMasterId",$scope.transRequisitionForm.leaveMasterId)
       // fd.append("creditDays",$scope.transRequisitionForm.creditDays)
        
        if(document.getElementById("contractEisComLabelsTo").style.display!="none"){
            if(document.getElementById("contractFromDateTo")!=null){
                var conFromDate = document.getElementById("contractFromDateTo").value
                fd.append("contractFromDate",conFromDate)
            }
            if(document.getElementById("contractRenewDateTo")!=null){
                var conRenewDate = document.getElementById("contractRenewDateTo").value
                fd.append("contractRenewDateTo",conRenewDate)
            }
            if(document.getElementById("contractEndDateTo")!=null){
                var conEndDate = document.getElementById("contractEndDateTo").value
                fd.append("contractEndDateTo",conEndDate)
            }
        }
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
        transVO.transferRecommended = document.getElementById("transfer1").checked ? document.getElementById("transfer1").value : document.getElementById("transfer2").value
        transVO.relocation = document.getElementById("relocation1").checked ? document.getElementById("relocation1").value : document.getElementById("relocation2").value
        transVO.relocationBond = document.getElementById("relocationBond1").checked ? document.getElementById("relocationBond1").value : document.getElementById("relocationBond2").value
        transVO.travelArrangement = document.getElementById("travelArrangement1").checked ? document.getElementById("travelArrangement1").value : document.getElementById("travelArrangement2").value
        transVO.travelArrangementDetail = document.getElementById("travelArrangementDetail").value
        transVO.relocationQuotationSubm = document.getElementById("relocationQuotationSubm").value
        transVO.qaName1 = document.getElementById("qaName1").value
        transVO.qaName2 = document.getElementById("qaName2").value
        transVO.qaName3 = document.getElementById("qaName3").value
        transVO.qaValue1 = document.getElementById("qaValue1").value
        transVO.qaValue2 = document.getElementById("qaValue2").value
        transVO.qaValue3 = document.getElementById("qaValue3").value
        transVO.remarks = $scope.transRequisitionForm.transVO.remarks
       // alert($scope.transRequisitionForm.transVO.ctc)
        transVO.ctc = $scope.oldCtc
       // transVO.toDate = $scope.transRequisitionForm.transVO.toDate

       fd.append("transVOtemp",JSON.stringify(transVO))
        var trainingList = new Array(10);
        for(i=0;i<10;i++){
            if(document.getElementById("lnd_"+i)){
                trainingList[i]={}
                trainingList[i].lndYearId = parseInt(document.getElementById("lnd_"+i).value.split(":")[1])
                trainingList[i].trainingTypeId = parseInt(document.getElementById("trainingType_"+i).value.split(":")[1])
                trainingList[i].trainingCategoryId = parseInt(document.getElementById("trainingCategory_"+i).value.split(":")[1])
                trainingList[i].trainingSubCategoryId = parseInt(document.getElementById("trainingSubCategory_"+i).value.split(":")[1])

            }else{
                break
            }
        }
        if(document.getElementById("trainingDiv")){
            fd.append("transTrainingVOList",trainingList)
        }
        //fd.append("transTrainingVOList",trainingList)


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
            url: (baseURL + '/transaction/transactionRequisition/processConfirmationRequisition.spr'),
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
    $scope.redirectOnBack=function(){
        $state.go('approvalTransactionList')
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