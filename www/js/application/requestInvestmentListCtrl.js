mainModule.controller('requestInvestmentListCtrl', function ($scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading) {
    $rootScope.navHistoryPrevPage = "requisitionNew"

    if($rootScope.fromWhichPage == "edit"){
        $scope.financialYear=$rootScope.financialYearSelected;
   }else{
    $rootScope.financialYearSelected="";
    $scope.financialYear=""
   }
   $scope.selectedValues = {}
   
    $scope.init = function(){
        $ionicLoading.show();
        $timeout(function () {
        var fd = new FormData();
       
        //fd.append("empId",$scope.employeeId)
        fd.append("buttonRights","Y-Y-Y-Y")
        fd.append("msg","0")
        fd.append("message","0")
        fd.append("menuId","1411")
        if($scope.financialYear){
            fd.append("financialYear",$scope.financialYear)
        }
        $.ajax({
            url: (baseURL + '/ctc/paySlip/viewInvestment.spr'),
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
                            showAlert("Something went wrong. Please try later.")
                            //$scope.redirectOnBack();
                            return
                        }	
                        
                       
                       $scope.listYear = success.listYear
                       $scope.employeeName = success.empFullName
                       $scope.employeeCode = success.empCode
                       if($scope.financialYear){
                        $scope.investmentForm = success.investmentForm
                        $scope.investmentVOList = success.investmentForm.investmentVOList
                        
                        $scope.employeeRentPaidList = success.investmentForm.employeeRentPaidList
                        var count = -1
                        $timeout(function () {
                            for(var i=0;i<$scope.employeeRentPaidList.length;i++){
                                
                                if($scope.employeeRentPaidList[i]){
                                    count++
                                    
                                    document.getElementById("remark123_"+count).value = $scope.employeeRentPaidList[i].remark
                                }
                                
                            }
                        },500)
                        
                        if(!($scope.employeeRentPaidList)){
                            $scope.noDataRent ="No Data"
                        }
                        if(!($scope.investmentVOList)){
                            $scope.noData = "No Data"
                        }
                        $scope.showActualContribution = success.showActualContribution
                        
                        $scope.isExemption =success.isExemption
                        $scope.currentFy = success.currentFY
                        $scope.listMonth = success.listMonth
                        $scope.financialYearFromSucess = success.financialYear
                        $scope.buttonRights = success.buttonRights
                        
                       }
                       $ionicLoading.hide();
                       


                        
                        
            },
            error: function (e) { //alert("Server error - " + e);
            alert(e.status)
                    $ionicLoading.hide()
                   $scope.data_return = {status: e};
                commonService.getErrorMessage($scope.data_return);
                
                   }				
            });	
        },500);		

    }
    $scope.goUpdate = function(id,idx){
        var deductionAmount = document.getElementById("deductionAmount_"+idx).value;
        var proposedAmount = document.getElementById("proposedAmount_"+idx).value;
        var investmentAmount = document.getElementById("MaxDeductionAllowed_"+idx).value;

        if(deductionAmount==""){
            showAlert("Please enter all details for the record ");
            return
        }
        if(investmentAmount!=""){
            if(parseInt(investmentAmount) > parseInt(deductionAmount)){
                showAlert("Amount cannot be greater then deduction amount ")
            }
        }
        if(investmentAmount==""){
            investmentAmount = parseFloat("0")
        }
        if(proposedAmount==""){
            investmentAmount=parseFloat("0")
        }

        var fd = new FormData();

        var res1 = $scope.attachFiles(fd,idx)
        if (res1 == false){
            showAlert("No changes to update.")
            return;
        }

        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure',
            template: 'Do you want to Update ?', //Message
        });
        confirmPopup.then(function(res){
            $ionicLoading.show()
            $timeout(function () {
                if(res){
                
           
                    fd.append("employeeInvestmentID",id)
                    fd.append("investmentAmount",investmentAmount)
                    fd.append("proposedAmount",proposedAmount)
                    fd.append("financialYear",$scope.financialYearFromSucess);
                    fd.append("buttonRights","Y-Y-Y-Y")
                    fd.append("index",idx)
                    $scope.listToSend = new Array($scope.investmentForm.investmentVOList.length)
                    for(var i=0;i<$scope.investmentForm.investmentVOList.length;i++){
                        $scope.listToSend[i] = {}
                        $scope.listToSend[i].employeeInvestmentID = $scope.investmentForm.investmentVOList[i].employeeInvestmentID
                        $scope.listToSend[i].supportingDocumentFile = null
                    }
                    fd.append("investmentVOListJson",JSON.stringify($scope.listToSend))
                    
    
                    $.ajax({
                        url: (baseURL + '/ctc/paySlip/update.spr'),
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
                                        showAlert("Something went wrong. Please try later.")
                                        //$scope.redirectOnBack();
                                        return
                                    }	
                                    $ionicLoading.hide();
                                    showAlert("Updated Successfully")
                                    $scope.financialYear = $scope.financialYearFromSucess
                                    $scope.init();
            
                                    
                                    
                        },
                        error: function (e) { //alert("Server error - " + e);
                        alert(e.status)
                                $ionicLoading.hide()
                                showAlert("Something went wrong. Please try later.")
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
    $scope.goUpdateEmployeeRent = function(id,idx){

        $scope.employeeRent = new Array(12);
        for(i=0;i<12;i++){
            if($scope.employeeRentPaidList[i]){
                $scope.employeeRent[i]={}
            $scope.employeeRent[i].rentPaidId = $scope.employeeRentPaidList[i].rentPaidId
            $scope.employeeRent[i].amount = $scope.employeeRentPaidList[i].amount
            $scope.employeeRent[i].remark = $scope.employeeRentPaidList[i].remark
            $scope.employeeRent[i].fromDt = $scope.employeeRentPaidList[i].fromDt
            $scope.employeeRent[i].toDt = $scope.employeeRentPaidList[i].toDt
            $scope.employeeRent[i].fileName = $scope.employeeRentPaidList[i].fileName
            //$scope.employeeRent[i].logoFile = $scope.employeeRentPaidList[i].logoFile
            //$scope.employeeRent[i].contentType = $scope.employeeRentPaidList[i].contentType
            $scope.employeeRent[i].proffRecieved = $scope.employeeRentPaidList[i].proffRecieved
            $scope.employeeRent[i].sanction = $scope.employeeRentPaidList[i].sanction
            }
            else{
                $scope.employeeRent[i]={}
                $scope.employeeRent[i].rentPaidId = ""
            $scope.employeeRent[i].amount = 0
            $scope.employeeRent[i].remark = ""
            $scope.employeeRent[i].fromDt = ""
            $scope.employeeRent[i].toDt = ""
            $scope.employeeRent[i].fileName = ""
            //$scope.employeeRent[i].logoFile = $scope.employeeRentPaidList[i].logoFile
            //$scope.employeeRent[i].contentType = $scope.employeeRentPaidList[i].contentType
            $scope.employeeRent[i].proffRecieved = ""
            $scope.employeeRent[i].sanction = ""
            }
            
        }
        var amount = document.getElementById("amount_"+idx).value;
        var remarks = document.getElementById("remark123_"+idx).value;
        var idx = ""+idx
        //var investmentAmount = document.getElementById("MaxDeductionAllowed_"+idx).value;

        if(amount ==""){
            showAlert("Please enter Monthly Contribution");
            return
        }
        if(remarks ==""){
            showAlert("Please enter Remarks");
            return
        }
        
        var amountFloat = parseFloat(amount)
        var fd = new FormData();

        if ($scope.attachFilesRent(fd,idx) == false){
            return;
        }
        

        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure',
            template: 'Do you want to Update ?', //Message
        });
        confirmPopup.then(function(res){
            $ionicLoading.show()
            $timeout(function () {
                if(res){
                
           
                    fd.append("rentPaidId",id)
                    fd.append("amount",amountFloat)
                    fd.append("remark",remarks)
                    fd.append("financialYear",$scope.financialYearFromSucess);
                    fd.append("buttonRights","Y-Y-Y-Y")
                    fd.append("index",idx)
                    fd.append("employeeRentPaidListaaa",JSON.stringify($scope.employeeRent))

                    
    
                    $.ajax({
                        url: (baseURL + '/ctc/paySlip/updateEmployeeRent.spr'),
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
                                        showAlert("Something went wrong. Please try later.")
                                        //$scope.redirectOnBack();
                                        return
                                    }	
                                    $ionicLoading.hide();
                                    showAlert("Updated Successfully")
                                    $scope.financialYear = $scope.financialYearFromSucess
                                    $scope.init();
            
                                    
                                    
                        },
                        error: function (e) { //alert("Server error - " + e);
                        alert(e.status)
                                $ionicLoading.hide()
                                showAlert("Something went wrong. Please try later.")
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


    $scope.goDelete = function(id){
       

        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure',
            template: 'Do you want to Delete ?', //Message
        });
        confirmPopup.then(function(res){
            $ionicLoading.show()
            $timeout(function () {
                if(res){
                    var fd = new FormData();
           
                    fd.append("employeeInvestmentID",id)
                    
                    fd.append("financialYear",$scope.financialYearFromSucess);
                    fd.append("buttonRights","Y-Y-Y-Y")
    
                    $.ajax({
                        url: (baseURL + '/ctc/paySlip/delete.spr'),
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
                                        showAlert("Something went wrong. Please try later.")
                                        //$scope.redirectOnBack();
                                        return
                                    }	
                                    $ionicLoading.hide();
                                    showAlert("Deleted Successfully")
                                    $scope.financialYear = $scope.financialYearFromSucess
                                    $scope.init();
            
                                    
                                    
                        },
                        error: function (e) { //alert("Server error - " + e);
                        alert(e.status)
                                $ionicLoading.hide()
                                showAlert("Something went wrong. Please try later.")
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
    $scope.goDeleteEmployeeRent = function(id){
       var rentPaidId = ""+id

        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure',
            template: 'Do you want to Delete ?', //Message
        });
        confirmPopup.then(function(res){
            $ionicLoading.show()
            $timeout(function () {
                if(res){
                    var fd = new FormData();
           
                    fd.append("rentPaidId",rentPaidId)
                    
                    fd.append("financialYear",$scope.financialYearFromSucess);
                    fd.append("buttonRights","Y-Y-Y-Y")
    
                    $.ajax({
                        url: (baseURL + '/ctc/paySlip/deleteEmployeeRent.spr'),
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
                                        showAlert("Something went wrong. Please try later.")
                                        //$scope.redirectOnBack();
                                        return
                                    }	
                                    $ionicLoading.hide();
                                    showAlert("Deleted Successfully")
                                    $scope.financialYear = $scope.financialYearFromSucess
                                    $scope.init();
            
                                    
                                    
                        },
                        error: function (e) { //alert("Server error - " + e);
                        alert(e.status)
                                $ionicLoading.hide()
                                showAlert("Something went wrong. Please try later.")
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
    $scope.deleteFile = function(id){
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure',
            template: 'Do you want to Delete File ?', //Message
        });
        confirmPopup.then(function(res){
            $ionicLoading.show()
            $timeout(function () {
                if(res){
                    var fd = new FormData();
           
                    fd.append("employeeInvestmentID",id)
                    
                    fd.append("financialYear",$scope.financialYearFromSucess);
                    fd.append("buttonRights","Y-Y-Y-Y")
    
                    $.ajax({
                        url: (baseURL + '/ctc/paySlip/uploadInvFileDelete.spr'),
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
                                        showAlert("Something went wrong. Please try later.")
                                        //$scope.redirectOnBack();
                                        return
                                    }	
                                    $ionicLoading.hide();
                                    showAlert("File Deleted Successfully")
                                    $scope.financialYear = $scope.financialYearFromSucess
                                    $scope.init();
            
                                    
                                    
                        },
                        error: function (e) { //alert("Server error - " + e);
                        alert(e.status)
                                $ionicLoading.hide()
                                showAlert("Something went wrong. Please try later.")
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

    $scope.deleteFileRent = function(id){
        var rentPaidId = ""+id
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure',
            template: 'Do you want to Delete File ?', //Message
        });
        confirmPopup.then(function(res){
            $ionicLoading.show()
            $timeout(function () {
                if(res){
                    var fd = new FormData();
           
                    fd.append("rentPaidId",rentPaidId)
                    
                    fd.append("financialYear",$scope.financialYearFromSucess);
                    fd.append("buttonRights","Y-Y-Y-Y")
    
                    $.ajax({
                        url: (baseURL + '/ctc/paySlip/uploadRentFileDelete.spr'),
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
                                        showAlert("Something went wrong. Please try later.")
                                        //$scope.redirectOnBack();
                                        return
                                    }	
                                    $ionicLoading.hide();
                                    showAlert("File Deleted Successfully")
                                    $scope.financialYear = $scope.financialYearFromSucess
                                    $scope.init();
            
                                    
                                    
                        },
                        error: function (e) { //alert("Server error - " + e);
                        alert(e.status)
                                $ionicLoading.hide()
                                showAlert("Something went wrong. Please try later.")
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
    $scope.reloadForm = function(){
        var financialYear = document.getElementById("financialYear").options[document.getElementById("financialYear").selectedIndex].text
        if(financialYear=="Please Select"){

        }else{
            $scope.financialYear = financialYear;
            $scope.init();
        }
        
    }
    $scope.openAddInvestment = function(){
      $rootScope.financialYearSelected = document.getElementById("financialYear").options[document.getElementById("financialYear").selectedIndex].text
      if($rootScope.financialYearSelected=="Please Select"){
          showAlert("Please Select Financial Year")
          return
      }else{
        $state.go('addInvestment')
      }
       
    }
    $scope.openAddEmployeeRent = function(){
        $rootScope.financialYearSelected = document.getElementById("financialYear").options[document.getElementById("financialYear").selectedIndex].text
        if($rootScope.financialYearSelected=="Please Select"){
            showAlert("Please Select Financial Year")
            return
        }else{
          $state.go('addEmployeeRent')
        }
         
      }

    //File related methods 
    $scope.SelectedFile = function(event){
        var elemId = $scope.selectedValues.elem.id
        
        idx =  elemId.replace("inputFileUpload_","")
		var imgcontrolName= "showImg_"+idx
		var image = document.getElementById(imgcontrolName);
		image.src=""
        image.style.visibility="hidden"
        
		$scope.imageData   = $scope.fileChange(idx)
		

    }
    $scope.fileChange  = function (idx){
		//alert("11")oila 
		var reader = new FileReader();

      // Closure to capture the file information.
	  var fileData ;
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
		  
          //$scope.imageData = e.target.result;
          $scope.imageData = e.target.result
		  //$scope.fileToUpload = (<HTMLInputElement>e.target.files[0])
          //alert($scope.imageData)
        };
      })(f);
	  
		$ionicLoading.hide()
		
      // Read in the image file as a data URL.
	  
	  if (document.getElementById('inputFileUpload_'+idx).files[0]){	
		var f = document.getElementById('inputFileUpload_'+idx).files[0]
        //$scope.selectedFileNameFromDevice = document.getElementById('inputFileUpload_'+idx).files[0].name
        document.getElementById("fileName_"+idx).innerHTML = document.getElementById('inputFileUpload_'+idx).files[0].name
		//alert(f.name)
		reader.readAsDataURL(f);
	  }else{
		  $scope.imageData = ""
		  $scope.selectedFileNameFromDevice = ""
	  }
	  
	  
    }
    $scope.cameraTakePicture = 	function (mode,idx) { 
		var imgcontrolName= "showImg_"+idx
		
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
           // image.src = "data:image/jpeg;base64," + thisResult.filename;
           // $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;

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
           // $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;

			//image.src = "data:image/jpeg;base64," + imageData;
			//$scope.imageData = "data:image/jpeg;base64," + imageData;
			document.getElementById("inputFileUpload_"+idx).value = ""	
			$scope.selectedFileNameFromDevice = ""
			if (!$scope.$$phase)
                $scope.$apply()			
			
			
			
		}

		function onFail(message) {
			showAlert(message);
		}
	}
	
    }
    $scope.removeAttachment = function (idx){
		var confirmPopup = $ionicPopup.confirm({
					title: alert_header,
					template: 'Do you want to remove image?', //Message
					});
					confirmPopup.then(function (res) {
						if (res) {
							var imgcontrolName= "showImg_"+idx
							var image = document.getElementById(imgcontrolName);
							image.src=""
							image.style.visibility="hidden"
				}
					});	
	}

    $scope.attachFiles = function(fd,i){

          if (document.getElementById('inputFileUpload_'+i).files[0] ){
						
            var base64result = $scope.imageData.split(',')[1];
            $scope.fileUploadName = document.getElementById('inputFileUpload_'+i).files[0].name
            $scope.fileUploadType = document.getElementById('inputFileUpload_'+i).files[0].type
            
            var blob = base64toBlob(base64result, $scope.fileUploadType,$scope.fileUploadName)
            fd.append('file', blob,$scope.fileUploadName)
            
            if (document.getElementById('inputFileUpload_'+i).files[0].size/(1024*1024)>1)
            {
                showAlert("Maximum file size is limited to  1 Mb, Please try another file of lesser size. ")
                $ionicLoading.hide()
                return
            }
            
        }else if (document.getElementById('showImg_'+i).src.indexOf("data:image") > -1){
            //scope.imageData is the src of camera image 
            var base64result = $scope.imageData.split(',')[1];
            
            var ts = new Date();
            ts = ts.getFullYear() +""+ ts.getMonth() +""+ ts.getDate() + "" + ts.getHours() +""+ ts.getMinutes() +""+ ts.getSeconds()

            $scope.fileUploadName = "camPic"+ts+".jpeg"
            $scope.fileUploadType = "image/jpeg"
            
            var blob = base64toBlob(base64result, $scope.fileUploadType,$scope.fileUploadName)
            fd.append('file', blob,$scope.fileUploadName)
            
        }else{
            return false;
            //fd.append('file', null,"nofile.txt")
        }
        return true;
   
    }

    //File Related Methods Update Rent 
    $scope.SelectedFileRent = function(event){
        var elemId = $scope.selectedValues.elem.id
        
        idx =  elemId.replace("inputFileUploadRent_","")
        var imgcontrolName= "showImgRent_"+idx
        var image = document.getElementById(imgcontrolName);
        image.src=""
        image.style.visibility="hidden"
        
        $scope.imageData   = $scope.fileChangeRent(idx)
        

    }
    $scope.fileChangeRent  = function (idx){
        //alert("11")oila 
        var reader = new FileReader();

      // Closure to capture the file information.
      var fileData ;
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          
          //$scope.imageData = e.target.result;
          $scope.imageDataRent = e.target.result
          //$scope.fileToUpload = (<HTMLInputElement>e.target.files[0])
          //alert($scope.imageData)
        };
      })(f);
      
        $ionicLoading.hide()
        
      // Read in the image file as a data URL.
      
      if (document.getElementById('inputFileUploadRent_'+idx).files[0]){	
        var f = document.getElementById('inputFileUploadRent_'+idx).files[0]
        //$scope.selectedFileNameFromDevice = document.getElementById('inputFileUpload_'+idx).files[0].name
        document.getElementById("fileNameRent_"+idx).innerHTML = document.getElementById('inputFileUploadRent_'+idx).files[0].name
        //alert(f.name)
        reader.readAsDataURL(f);
      }else{
          $scope.imageDataRent = ""
          $scope.selectedFileNameFromDeviceRent = ""
      }
      
      
    }
    $scope.cameraTakePictureRent = 	function (mode,idx) { 
        var imgcontrolName= "showImgRent_"+idx
        
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
           // image.src = "data:image/jpeg;base64," + thisResult.filename;
           // $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;

            //image.src = "data:image/jpeg;base64," + imageData;
           // $scope.imageDataRent = "data:image/jpeg;base64," + imageData;
            
            
            
            
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
           // $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;

           // image.src = "data:image/jpeg;base64," + imageData;
           // $scope.imageDataRent = "data:image/jpeg;base64," + imageData;
            document.getElementById("inputFileUpload_"+idx).value = ""	
            $scope.selectedFileNameFromDeviceRent = ""
            if (!$scope.$$phase)
                $scope.$apply()			
            
            
            
        }

        function onFail(message) {
            showAlert(message);
        }
    }
    
    }
    $scope.removeAttachmentRent = function (idx){
        var confirmPopup = $ionicPopup.confirm({
                    title: alert_header,
                    template: 'Do you want to remove image?', //Message
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            var imgcontrolName= "showImgRent_"+idx
                            var image = document.getElementById(imgcontrolName);
                            image.src=""
                            image.style.visibility="hidden"
                }
                    });	
    }

    $scope.attachFilesRent = function(fd,i){
        
        if (document.getElementById('inputFileUploadRent_'+i)){

          if (document.getElementById('inputFileUploadRent_'+i).files[0]){
                        
            var base64result = $scope.imageDataRent.split(',')[1];
            $scope.fileUploadName = document.getElementById('inputFileUploadRent_'+i).files[0].name
            $scope.fileUploadType = document.getElementById('inputFileUploadRent_'+i).files[0].type
            
            var blob = base64toBlob(base64result, $scope.fileUploadType,$scope.fileUploadName)
            
            
            if (document.getElementById('inputFileUploadRent_'+i).files[0].size/(1024*1024)>1)
            {
                showAlert("Maximum file size is limited to  1 Mb, Please try another file of lesser size. ")
                $ionicLoading.hide()
                return
            }
            fd.append('file1', blob,$scope.fileUploadName)
            
        }else if (document.getElementById('showImgRent_'+i).src.indexOf("data:image") > -1){
            //scope.imageData is the src of camera image 
            var base64result = $scope.imageData.split(',')[1];
            
            var ts = new Date();
            ts = ts.getFullYear() +""+ ts.getMonth() +""+ ts.getDate() + "" + ts.getHours() +""+ ts.getMinutes() +""+ ts.getSeconds()

            $scope.fileUploadName = "camPic"+ts+".jpeg"
            $scope.fileUploadType = "image/jpeg"
            
            var blob = base64toBlob(base64result, $scope.fileUploadType,$scope.fileUploadName)
            fd.append('file1', blob,$scope.fileUploadName)
            
        }else{
            //var base64result = "";

            //var blob = base64toBlob(base64result, "application/octet-stream","")
            //fd.append('file1', blob, "")
        }
    }
    
    
    }
  
    $scope.redirectOnBack = function () {
        $state.go('app.requestMenu')
      }
    
    $scope.init();
})