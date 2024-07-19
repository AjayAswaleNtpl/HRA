mainModule.controller('addInvestmentCtrl', function ($scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading) {

$scope.showActualContribution = "false"
$scope.employeeId = sessionStorage.getItem("empId");
$scope.selectedValues = {};
$scope.selectedFileNameFromDevice = ""
$scope.imageData1 = new Array(5);
$scope.investmentVOListToSend =[];

$rootScope.navHistoryPrevPage='requestInvestmentList'
    $scope.init = function(){
        $ionicLoading.show();
        
        $timeout(function () {
        var fd = new FormData();
        fd.append("financialYear",$rootScope.financialYearSelected);
        fd.append("empId",$scope.employeeId)
        fd.append("buttonRights","Y-Y-Y-Y")
        //fd.append("message","")
        //fd.append("save","")
        $.ajax({
            url: (baseURL + '/ctc/paySlip/addInvestment.spr'),
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
                        $scope.investmentList = success.investmentForm.investmentVOList
                        $scope.listInvestment = success.listInvestment
                        $scope.showActualContribution = success.showActualContribution
                        


                        
                        
            },
            error: function (e) { //alert("Server error - " + e);
            alert(e.status)
                    $ionicLoading.hide()
                    showAlert("Something went wrong. Please try later.")
                   $scope.data_return = {status: e};
                commonService.getErrorMessage($scope.data_return);
                
                   }				
            });	
        },200);		

    }
    $scope.redirectOnBack = function(){
        $state.go('requestInvestmentList')
    }
    $scope.getInvestmentId = function(idx){
        var inv = document.getElementById("investmentDropdown_"+idx).options[document.getElementById("investmentDropdown_"+idx).selectedIndex].text
        for(let key of Object.keys($scope.listInvestment )){
            var obj = $scope.listInvestment[key]
            if(obj.displayName.trim() == inv.trim()){
                
                    return obj.investmentId;
                
                
            }
        }
    }

    $scope.doOnChange=function(idx){
        $ionicLoading.show();
        $timeout(function () {
        if(document.getElementById("investmentDropdown_"+idx).options[document.getElementById("investmentDropdown_"+idx).selectedIndex].text == "Please Select"){
            document.getElementById("investmentSectionId_"+i).value = ""
            document.getElementById("deductionAmount_"+i).value = ""
            return
        }
        var investmentId = $scope.getInvestmentId(idx);
        var fd = new FormData();
        fd.append("investmentId",investmentId)
        $.ajax({
            url: (baseURL + '/api/portal/getInvestmentSection.spr'),
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
                        
                        var investmentVO = success.InvestmentVO
                        document.getElementById("investmentSectionId_"+idx).value = investmentVO.investmentSectionName;

                        $scope.doOnChange1(investmentId,idx);
                        $ionicLoading.hide();
                        
                        
            },
            error: function (e) { //alert("Server error - " + e);
            alert(e.status)
                    $ionicLoading.hide()
                    showAlert("Something went wrong. Please try later.")
                   $scope.data_return = {status: e};
                commonService.getErrorMessage($scope.data_return);
                
                   }				
            });	
        },200)		

    }
    $scope.doOnChange1 = function(inv, idx){
        var investmentId = inv

        var fd = new FormData();
        fd.append("investmentId",investmentId)
        $.ajax({
            url: (baseURL + '/api/portal/getInvestmentAmount.spr'),
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
                        
                        var investmentVO = success.InvestmentVO
                        
                        
                        document.getElementById("deductionAmount_"+idx).value = investmentVO.deductionAmount;

                        
                        
            },
            error: function (e) { //alert("Server error - " + e);
            alert(e.status)
                    $ionicLoading.hide()
                    showAlert("Something went wrong. Please try later.")
                   $scope.data_return = {status: e};
                commonService.getErrorMessage($scope.data_return);
                
                   }				
            });			

    }
    $scope.validate = function(){
        var count = 0;
        var text = ""
        var repeat = false
        for(var i=0;i<5;i++){
            if(document.getElementById("investmentDropdown_"+i).options[document.getElementById("investmentDropdown_"+i).selectedIndex].text == "Please Select"){
                count++;
            }
            // else if(repeat == false){
            
            //     prevRecord = document.getElementById("investmentDropdown_"+i).options[document.getElementById("investmentDropdown_"+i).selectedIndex].text
            //     for(j=i+1;j<5;j++){
            //         nextRec = document.getElementById("investmentDropdown_"+j).options[document.getElementById("investmentDropdown_"+i).selectedIndex].text
            //         if(prevRecord == nextRec){
            //             if(prevRecord != "Please Select" && nextRec != "Please Select"){
            //                 text+="Duplicate record in "+(j + 1)+"\n"
            //             }else{
            //               continue
            //             }
                        
            //         }
            //     }
            // }
            if(document.getElementById("investmentDropdown_"+i).options[document.getElementById("investmentDropdown_"+i).selectedIndex].text != "Please Select"){
                if($scope.showActualContribution=="true" && document.getElementById("MaxDeductionAllowed_"+i).value==""){
                    text+="Please enter Actual Amount in record "+(i+1)+"\n"
                }
                else if($scope.showActualContribution=="false" && document.getElementById("proposedAmount_"+i).value==""){
                    text+="Please enter proposed amount in record "+(i+1)+"\n"
                }
                else if($scope.showActualContribution=="true" && document.getElementById("MaxDeductionAllowed_"+i).value !=""){
                    if(parseInt(document.getElementById("MaxDeductionAllowed_"+i).value) > parseInt(document.getElementById("deductionAmount"+i).value)){
                        text+="Amount Can Not Be Greater Than Deduction Amount In Record "+(i+ 1)+"\n"
                    }
                }
            }
        }
        if(count==5){
            text+="Please enter atleast one record"
        }


        return text;
        
        
    }

    $scope.goSave=function(){
        var txt = $scope.validate();
        if(txt != ""){
            showAlert(txt);
            return
        }
        
        //get files

        //
        $scope.investmentVOListToSend = new Array(5);
        var count=0;
        var fd = new FormData();
                    
        for(i=0;i<5;i++){
            if(document.getElementById("investmentDropdown_"+i).options[document.getElementById("investmentDropdown_"+i).selectedIndex].text != "Please Select"){
                
                $scope.investmentVOListToSend[count]={}
                $scope.investmentVOListToSend[count].investmentId = $scope.getInvestmentId(i);
                if($scope.showActualContribution=="false"){
                    $scope.investmentVOListToSend[count].proposedAmount = document.getElementById("proposedAmount_"+i).value
                    $scope.investmentVOListToSend[count].investmentAmount = ""
                }else{
                    $scope.investmentVOListToSend[count].proposedAmount = ""
                    $scope.investmentVOListToSend[count].investmentAmount = document.getElementById("MaxDeductionAllowed_"+i).value
                }
                count++;
            }else{
                continue;
            }
        }
        $scope.attachFiles(fd)
        //alert($scope.investmentVOListToSend.length)
        $scope.investmentVOListToSend.length = count; //meanwhile hard coding then build logic
        //alert($scope.investmentVOListToSend.length)
        $scope.investmentVOList=JSON.stringify($scope.investmentVOListToSend);
        var confirmPopup = $ionicPopup.confirm({
            title: '',
            template: 'Do you want to Save ?', //Message
        });
        confirmPopup.then(function(res){
            $ionicLoading.show()
            $timeout(function () {
                if(res){
                    
           
                    fd.append("investmentVOListJson",$scope.investmentVOList)
                    fd.append("result","")
    
                    fd.append("financialYear",$rootScope.financialYearSelected)
                    
    
                    $.ajax({
                        url: (baseURL + '/ctc/paySlip/save.spr'),
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
                                    showAlert("Saved Successfully")
                                    $rootScope.fromWhichPage = "edit";
                                    $state.go('requestInvestmentList')
            
                                    
                                    
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
    //Files related methods

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
          $scope.imageData1[idx] = e.target.result
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
            //var thisResult = JSON.parse(imageData);
            // convert json_metadata JSON string to JSON Object 
            //var metadata = JSON.parse(thisResult.json_metadata);
            //image.src = "data:image/jpeg;base64," + thisResult.filename;
            //$scope.imageData = "data:image/jpeg;base64," + thisResult.filename;


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
                $scope.imageData1[idx] = "data:image/jpeg;base64," + imageData;
            }else{
                var thisResult = JSON.parse(imageData);
                // convert json_metadata JSON string to JSON Object 
                //var metadata = JSON.parse(thisResult.json_metadata);
                image.src = "data:image/jpeg;base64," + thisResult.filename;
                $scope.imageData1[idx] = "data:image/jpeg;base64," + thisResult.filename;
            }
            //var thisResult = JSON.parse(imageData);
            // convert json_metadata JSON string to JSON Object 
            //var metadata = JSON.parse(thisResult.json_metadata);
            //image.src = "data:image/jpeg;base64," + thisResult.filename;
            //$scope.imageData1[idx] = "data:image/jpeg;base64," + thisResult.filename;

			//image.src = "data:image/jpeg;base64," + imageData;
           // $scope.imageData1[idx] = "data:image/jpeg;base64," + imageData;
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

    $scope.attachFiles = function(fd){
        for(i=0;i<5;i++){
        if(document.getElementById("investmentDropdown_"+i).options[document.getElementById("investmentDropdown_"+i).selectedIndex].text != "Please Select"){

          if (document.getElementById('inputFileUpload_'+i).files[0] ){
						
            var base64result = $scope.imageData1[i].split(',')[1];
            $scope.fileUploadName = document.getElementById('inputFileUpload_'+i).files[0].name
            $scope.fileUploadType = document.getElementById('inputFileUpload_'+i).files[0].type
            
            var blob = base64toBlob(base64result, $scope.fileUploadType,$scope.fileUploadName)
            
            
            if (document.getElementById('inputFileUpload_'+i).files[0].size/(1024*1024)>1)
            {
                showAlert("Maximum file size is limited to  1 Mb, Please try another file of lesser size. ")
                $ionicLoading.hide()
                return
            }
            fd.append('file', blob,$scope.fileUploadName)
            
        }else if (document.getElementById('showImg_'+i).src.indexOf("data:image") > -1){
            //scope.imageData is the src of camera image 
            var base64result = $scope.imageData1[i].split(',')[1];
            
            var ts = new Date();
            ts = ts.getFullYear() +""+ ts.getMonth() +""+ ts.getDate() + "" + ts.getHours() +""+ ts.getMinutes() +""+ ts.getSeconds()

            $scope.fileUploadName = "camPic"+ts+".jpeg"
            $scope.fileUploadType = "image/jpeg"
            
            var blob = base64toBlob(base64result, $scope.fileUploadType,$scope.fileUploadName)
            fd.append('file', blob,$scope.fileUploadName)
            
        }else{
            var base64result = "null";
            var blob = base64toBlob(base64result, "NOFILE","NOFILE.txt123")
            fd.append('file', blob, "NOFILE.txt123")
        }
    }
    }
    }

    $scope.init();
})