mainModule.controller('requestTransactionWithdrawlResignationFormCtrl', function($scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading,$filter) {
    $rootScope.navHistoryPrevPage = "requestTransactionList"
    $scope.selectedValue={}
    $scope.resultObj = {}
    $scope.init=function(){
        $ionicLoading.show();
        $timeout(function () {
           
            
            var fd = new FormData();
           
            //fd.append("empId",$scope.employeeId)
            fd.append("buttonRights","Y-Y-Y-Y")
            //fd.append("msg","0")
          // fd.append("message","")
            fd.append("menuId","1005")
            //fd.append("transactionId",transactionId)
            //fd.append("companyId",sessionStorage.getItem(""))
            fd.append("transactionTypeId",15)
            fd.append("empId",sessionStorage.getItem("empId"));
            fd.append("companyId",sessionStorage.getItem("companyId"))
            var dt = new Date();
            var day = dt.getDate();
            var month = dt.getMonth()+1;
            var year = dt.getFullYear();
            if(day < 10){
                day = "0"+day
            }
            if(month < 9){
                month = "0"+month
            }
            var datee = day +"/"+month+"/"+year
            fd.append("wef",datee)
            //fd.append("cancellation",status)
           
            $.ajax({
                url: (baseURL + '/transaction/transactionRequisition/viewTransAbsconding.spr'),
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
                                $scope.transRequisitionForm = success.transRequisitionForm
                                
                              
                                // for(let key of Object.keys($scope.transRequisitionForm.approverList)){
                                //     document.getElementById("approvers").value += $scope.transRequisitionForm.approverList[key].value
                                // }
                               // $scope.requestedLwdDate = success.requestedLwdDate
                             //   $scope.revisedNticePrd = success.revisedNticePrd
                              //  $scope.AllowLeaveNticePrd = success.AllowLeaveNticePrd
                              //  $scope.recvrDays = success.recvrDays
                             //   $scope.LeaveBalanceCheck = success.LeaveBalanceCheck
                             
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
    $scope.redirectOnBack=function(){
        $state.go('requestTransactionList')
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
    $scope.goSave=function(){
        var checks = 'save'
        var text1 = ""
        if(document.getElementById("remarks").value == ''){
            showAlert("Remarks cannot be empty")
            return
        }
        var fd = new FormData();
        fd.append("menuId","1005")
        fd.append("buttonRights","Y-Y-Y-Y")
             
        fd.append("empId",$scope.transRequisitionForm.eisPersonal.empId)
        fd.append("wef",$scope.transRequisitionForm.wef)
       // fd.append("lwd",$scope.transRequisitionForm.lwd)
       // fd.append("revlwd",document.getElementById("revlwd").value)
        fd.append("transactionTypeId",$scope.transRequisitionForm.transactionTypeId)
        fd.append("transactionId",$scope.transRequisitionForm.transactionId)
        fd.append("transAuthId",$scope.transRequisitionForm.transAuthVO.transAuthId)
        fd.append("remarks",document.getElementById("remarks").value)
      //  fd.append("recdays",document.getElementById("recdays").value)
      //  fd.append("days",document.getElementById("days").value)
        if (document.getElementById('inputFileUpload').files[0] ){
						
            var base64result = $scope.imageData.split(',')[1];
            $scope.fileUploadName = document.getElementById('inputFileUpload').files[0].name
            $scope.fileUploadType = document.getElementById('inputFileUpload').files[0].type
            
            var blob = base64toBlob(base64result, $scope.fileUploadType,$scope.fileUploadName)
            fd.append('file', blob,$scope.fileUploadName)
            
            if (document.getElementById('inputFileUpload').files[0].size/(1024*1024)>1)
            {
                showAlert("Maximum file size is limited to  1 Mb, Please try another file of lesser size. ")
                $ionicLoading.hide()
                return
            }
            
        }else if (document.getElementById('showImg').src.indexOf("data:image") > -1){
            //scope.imageData is the src of camera image 
            var base64result = $scope.imageData.split(',')[1];
            
            var ts = new Date();
            ts = ts.getFullYear() +""+ ts.getMonth() +""+ ts.getDate() + "" + ts.getHours() +""+ ts.getMinutes() +""+ ts.getSeconds()

            $scope.fileUploadName = "camPic"+ts+".jpeg"
            $scope.fileUploadType = "image/jpeg"
            
            var blob = base64toBlob(base64result, $scope.fileUploadType,$scope.fileUploadName)
            fd.append('file', blob,$scope.fileUploadName)
            
        }
       
        
        
     
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to Send For Approval ?', //Message
            });
        confirmPopup.then(function(res){
            if(res){
            $.ajax({
                url: (baseURL + '/transaction/transactionRequisition/saveAbsconding.spr'),
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
                    showAlert("Application Sent For Approval Successfully")
                   
                   $state.go('requestTransactionList')
                            
                                
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
        var lwd = $scope.transRequisitionForm.lwd
        var revlwd = document.getElementById("revlwd").value

        var wef = $scope.transRequisitionForm.wef
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
                //document.getElementById("dbRecDaysLbl").textContent = ""
                //$("#dbRecDaysLbl").text("");
                //document.getElementById("dbRevNoticePrd").textContent = ""
                //$("#dbRevNoticePrd").text("");
                
                if (msg == 'save') {
					//$("#recdaysAdj").val(modifiedDays);
				} else {
                  //  document.getElementById("recdaysAdj").value = modifiedDays
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
                var incrDays = (parseInt($scope.ExistNoticePeriod) + parseInt(modifiedDays));
               // $("#days").val(incrDays);
                document.getElementById("days").value = incrDays
               // $("#daysLbl").text(incrDays + " Days");
                document.getElementById("daysLbl").textContent = incrDays + " Days"
                //$("#recdays").val(0);
                document.getElementById("recdays").value = 0
               // $("#recdaysLbl").text(0 + " Days");
                document.getElementById("recdaysLbl").textContent = 0+" Days"
               // $("#recdaysAdj").val(0);
               // document.getElementById("recdaysAdj").value = 0
               // $("#dbRecDaysLbl").text("");
                //document.getElementById("dbRecDaysLbl").textContent = ""
               // $("#dbRevNoticePrd").text("");
                //document.getElementById("dbRevNoticePrd").textContent = ""
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




      //file methods 
      $scope.SelectedFile = function(){
		
		var imgcontrolName= "showImg"
		var image = document.getElementById(imgcontrolName);
		image.src=""
		image.style.visibility="hidden"
		$scope.imageData = $scope.fileChange()
		

	}
	$scope.fileChange  = function (){
		//alert("11")
		var reader = new FileReader();

      // Closure to capture the file information.
	  var fileData ;
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
		  
		  $scope.imageData = e.target.result;
		  //$scope.fileToUpload = (<HTMLInputElement>e.target.files[0])
          //alert($scope.imageData)
        };
      })(f);
	  
		$ionicLoading.hide()
		
      // Read in the image file as a data URL.
	  
	  if (document.getElementById('inputFileUpload').files[0]){	
		var f = document.getElementById('inputFileUpload').files[0]
		$scope.selectedFileNameFromDevice = document.getElementById('inputFileUpload').files[0].name
		//alert(f.name)
		reader.readAsDataURL(f);
	  }else{
		  $scope.imageData = ""
		  $scope.selectedFileNameFromDevice = ""
	  }
	  
	  
	}
	$scope.cameraTakePicture = 	function (mode) { 
		var imgcontrolName= "showImg"
		
	if (mode=="file"){
   
		navigator.camera.getPicture(onSuccess, onFail, { quality: 25,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY
			});
		function onSuccess(imageData) {
			var image = document.getElementById(imgcontrolName);
			image.style.visibility="visible"
            if (window.device.platform != "Android"){
                image.src = "data:image/jpeg;base64," + imageData;
                $scope.imageData = "data:image/jpeg;base64," + imageData;
            }else{
                var thisResult = JSON.parse(imageData);
                // convert json_metadata JSON string to JSON Object 
                //var metadata = JSON.parse(thisResult.json_metadata);
                image.src = "data:image/jpeg;base64," + thisResult.filename;
                $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;
            }
           // var thisResult = JSON.parse(imageData);
            // convert json_metadata JSON string to JSON Object 
            //var metadata = JSON.parse(thisResult.json_metadata);
          //  image.src = "data:image/jpeg;base64," + thisResult.filename;
          //  $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;

			//image.src = "data:image/jpeg;base64," + imageData;
			//$scope.imageData = "data:image/jpeg;base64," + imageData;
			
			
			
			
		}

		function onFail(message) {
			showAlert(message);
		}
	}
   
		if (mode=="camera"){

			navigator.camera.getPicture(onSuccess, onFail, { quality: 25,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				correctOrientation: true
				
				});
			function onSuccess(imageData) {
			var image = document.getElementById(imgcontrolName);
			image.style.visibility="visible"
            if (window.device.platform != "Android"){
                image.src = "data:image/jpeg;base64," + imageData;
                $scope.imageData = "data:image/jpeg;base64," + imageData;
            }else{
                var thisResult = JSON.parse(imageData);
                // convert json_metadata JSON string to JSON Object 
                //var metadata = JSON.parse(thisResult.json_metadata);
                image.src = "data:image/jpeg;base64," + thisResult.filename;
                $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;
            }
           // var thisResult = JSON.parse(imageData);
            // convert json_metadata JSON string to JSON Object 
            //var metadata = JSON.parse(thisResult.json_metadata);
           // image.src = "data:image/jpeg;base64," + thisResult.filename;
          //  $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;

			//image.src = "data:image/jpeg;base64," + imageData;
			//$scope.imageData = "data:image/jpeg;base64," + imageData;
			document.getElementById("inputFileUpload").value = ""	
			$scope.selectedFileNameFromDevice = ""
			if (!$scope.$$phase)
                $scope.$apply()			
			
			
			
		}

		function onFail(message) {
			showAlert(message);
		}
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
    $scope.init();
})