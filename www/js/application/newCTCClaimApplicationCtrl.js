
mainModule.factory("addClaimFormService", function ($resource) {
  return $resource((baseURL + '/api/claimForm/addClaimForm.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});

mainModule.controller('newCTCClaimApplicationCtrl', function ($scope,$rootScope, commonService, $ionicHistory, $rootScope, $ionicPopup, getValidateLeaveService, $state, $http, $q, $filter, $ionicLoading,addClaimFormService, 
  getLeaveMasterService,$timeout, $ionicNavBarDelegate) {

$rootScope.navHistoryPrevPage="requestClaimList"
//$rootScope.navHistoryCurrPage="leave_application"
$rootScope.navHistoryPrevTab="CLAIM_CTC"	

  // $ionicLoading.show();
  $scope.resultObj = {}
  $scope.selectedFileName = ''

  //document.getElementById("payHeadDtls").style.visibility="hidden"
  document.getElementById("payHeadDtls").style.display="none"   

  if ( getMyHrapiVersionNumber() >= 32){
		$scope.utf8Enabled = 'true'    
	}else{
		$scope.utf8Enabled = 'false'    
	}

  
  $scope.init = function () {
	$ionicLoading.show()
    //$scope.resultObj.remarks = ''
    //$scope.resultObj.billAmount = ''
    //$scope.resultObj.claimYear = ''
    //$scope.resultObj.claimMonth = ''
    //$scope.resultObj.claimAmount = ''
    //$scope.resultObj.payhead = ''

    $scope.FileNames = new Array(10)
	$scope.FileTypes = new Array(10)	
	$scope.FileContents = new Array(10)


    $scope.resultObj.menuId = '2009'
    $scope.resultObj.buttonRights = 'Y-Y-Y-Y'
    $scope.resultObj.claimFlag = 'CTC';
	$scope.resultObj.fYearId = $rootScope.claimPeriodSelected
	
    //$scope.resultObj.fYearId='1'
	
    
    $scope.resultObj.ctcPayHeadName='Compensation Claim (CTC)'
    $scope.claimListApplicationForm = {}
    $scope.selectedValues={}
    $scope.addClaimFormService = new addClaimFormService();
    $scope.addClaimFormService.$save($scope.resultObj, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
			handleClientResponse(data.clientResponseMsg,"addClaimFormService")
			//showAlert("Something went wrong. Please try later.")
			//$ionicLoading.hide()
			//return
			}
        $scope.CTCClaimList = []
        var ctc = JSON.parse(data.form);
         console.log("ctc"+ctc);
        // if (ctc.claimFormVOList!=null){
          // $scope.claimFormVOList = ctc.claimFormVOList
          // $scope.resultObj.empId=$scope.claimFormVOList[0].empId
          $scope.listCtcPayHeadList = ctc.listCtcPayHead
          $scope.listClaimPayhead = ctc.listCtcPayHead.ctcPayHeadName
          // $scope.listClaimFormId = $scope.claimFormVOList.claimFormId
         $scope.listMonth = ctc.monthList
        //  var sorted = Object.keys($scope.listMonth)
        //     .sort(function(a,b) { return +b - +a })
        //     .map(function(k) { return $scope.listMonth[k] });
        //   alert(sorted)
          $scope.listYear = ctc.yearList
          $scope.periodfromDt = data.ctcPeriodVO.fromDt
          $scope.periodtoDt = data.ctcPeriodVO.toDt

        // }

        $ionicLoading.hide()
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
  }



  $scope.sendCTCForm = function (status) {
    
    $scope.claimApplicationVoList = [];
    $scope.nonCTCList = {};
	
	$scope.requestState = 'Send for Approval'

    
    //$scope.resultObj.fYearId = '1'
    $scope.resultObj.empId = parseInt(sessionStorage.getItem('empId'))

		var payhead = document.getElementById("payhead")
		if (payhead.selectedIndex==0){
			showAlert("Please select pay head.")
			return
		}
	
        //payhead = document.getElementById("payhead")
        payHeadName = payhead.options[payhead.selectedIndex].text
        // payheadId = parseInt(payhead.options[payhead.selectedIndex].value)
        payHeadId = $scope.listCtcPayHeadList[payhead.selectedIndex-1].ctcPayHeadId
        
        // ctc.listCtcPayHead.ctcPayHeadName
        month = document.getElementById("month")
		if (month.selectedIndex==0){
			showAlert("Please select month.")
			return
		}
        monthName = month.options[month.selectedIndex].text
        year = document.getElementById("year")
		if (year.selectedIndex==0){
			showAlert("Please select year.")
			return
		}
        yearName = year.options[year.selectedIndex].text
        //this is only way i found to iterate through map listYear.
        for(var i=0;i<10000;i++){
            if ($scope.listYear[i] == yearName  ){
                $scope.nonCTCList.yearId = i
                break;
                }
            }
			
		
        $scope.nonCTCList.ctcPayHeadName = payHeadName
        $scope.nonCTCList.ctcPayHeadId = payHeadId
        $scope.nonCTCList.monthId = month.options[month.selectedIndex].value
        
        $scope.nonCTCList.claimAmount  = document.getElementById("claimAmount").value
        $scope.nonCTCList.billAmount =  document.getElementById("billAmount").value

        $scope.nonCTCList.remarks = document.getElementById("remarks").value
        
        

		//validations
		
		var text = ""
			if(document.getElementById("claimAmount").value == 0.0){
	   			text +="\n Please enter Claim Amount. "
	   			
	   		}   		
	   		else if( document.getElementById("claimAmount").value == 'NaN')
				{
				text +="\n Please enter Claim Amount greater than zero. "
				}	
	   		else if( document.getElementById("claimAmount").value < 0)
	   			{
	   			text +="\n Please enter Claim Amount greater than zero."
	   			}
	   		else if(document.getElementById("claimAmount").value == 0 ){
	   			text +="\n Please enter Claim Amount greater than zero."
	   		}
			
			if (text !=""){
				showAlert(text)
				return
			}
		
		
		text = ""
			if(document.getElementById("billAmount").value == 0.0){
	   			text +="\n Please enter Bill Amount. "
	   			
	   		}   		
	   		else if( document.getElementById("billAmount").value == 'NaN')
				{
				text +="\n Please enter Bill Amount greater than zero. "
				}	
	   		else if( document.getElementById("billAmount").value < 0)
	   			{
	   			text +="\n Please enter Bill Amount greater than zero."
	   			}
	   		else if(document.getElementById("billAmount").value == 0 ){
	   			text +="\n Please enter Bill Amount greater than zero."
	   		}
			
			if (text !=""){
				showAlert(text)
				return
			}
				
    var confirmPopup = $ionicPopup.confirm({
      title: 'Are you sure',
      template: 'Do you want to ' + $scope.requestState + ' ?', //Message
  });
  confirmPopup.then(function (res) {
      if (res) {
        $ionicLoading.show()
    var base64result;
    var fileType;
    var blob;
 


        $scope.jsonList =  JSON.stringify($scope.nonCTCList);
        var formData = new FormData();
		  formData.append('empId', parseInt(sessionStorage.getItem('empId')));
		  formData.append('menuId', parseInt($scope.resultObj.menuId));
		  formData.append('status', "SENT FOR APPROVAL");
          formData.append('level', 1);
          formData.append('claimFlag', $scope.resultObj.claimFlag);
          formData.append('fYearId', $scope.resultObj.fYearId);
          formData.append('yearId', $scope.nonCTCList.yearId);
          formData.append('claimAmount', $scope.nonCTCList.claimAmount);
          formData.append('billAmount', $scope.nonCTCList.billAmount);

          if ($scope.utf8Enabled == 'true' ){
            if ($scope.nonCTCList.remarks){
              $scope.nonCTCList.remarks = encodeURI($scope.nonCTCList.remarks)
            }
          }
          formData.append('remarks', $scope.nonCTCList.remarks);
          formData.append('ctcPayHeadName', $scope.nonCTCList.ctcPayHeadName);
          formData.append('ctcPayHeadId', $scope.nonCTCList.ctcPayHeadId);
          formData.append('month', $scope.nonCTCList.monthId);
          formData.append('monthId', $scope.nonCTCList.monthId);

          
          formData.append('buttonRights',  $scope.resultObj.buttonRights);
          formData.append('claimFormVOList',$scope.jsonList);

          var elemFile
            var fileData
            var fileType
            var fileName
          //appending files
           for (var i=1;i<=10;i++){
            elemFile = document.getElementById("file_"+i)
               if (elemFile.value!="") {
                    //file is there
                    fileData = $scope.FileContents[i-1];
                    fileName = $scope.FileNames[i-1]
                    base64result = fileData.split(',')[1];
			        fileType = fileData.split(',')[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0]
			        blob = base64toBlob(base64result, fileType,fileName)
			        formData.append('multiUploadedFileList[0]', blob,fileName)
               }
           } 
          
           //appending images
           
           var elemImage
           var imgSrc
           
           for (var i=1;i<=10;i++){
               
            elemImage = document.getElementById("img_"+i)
            if (elemImage.style.display != "none"){
                 //image is there
				imgSrc = elemImage.src
                var fileData = imgSrc

				var ts = new Date();
				ts = ts.getFullYear() +""+ ts.getMonth() +""+ ts.getDate() + " " + ts.getHours() +""+ ts.getMinutes() +""+ ts.getSeconds()
                fileName = "camPic"+ts+".jpeg"

                base64result = fileData.split(',')[1];
			    fileType = fileData.split(',')[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0]
			    blob = base64toBlob(base64result, fileType,fileName)
                formData.append('multiUploadedFileList[0]', blob,fileName)

                
            }
        } 
       
        $ionicLoading.show()
    $.ajax({
      url: (baseURL + '/api/claimForm/isValidClaimAmount.spr'),
      method: 'POST',
      timeout: commonRequestTimeout,
      transformRequest: jsonTransformRequest,
      data: {'fYearId': $scope.resultObj.fYearId,'ctcPayHeadId': $scope.resultObj.ctcPayHeadId,
      'claimAmount': $scope.resultObj.claimAmount,'empId': $scope.resultObj.empId},
      headers: {
        'Authorization': 'Bearer ' + jwtByHRAPI,
       'Content-Type': 'application/x-www-form-urlencoded'},
      async : false,
      success: function (result) {

        
        
        // if(result.msg){
        //   // alert("Result"+result.msg);
        // }
        if (result.msg == ""){
            
          $.ajax({
            url: (baseURL + '/masters/groupMaster/findWorkFlowIsDefined.spr'),
            method: 'POST',
            timeout: commonRequestTimeout,
            transformRequest: jsonTransformRequest,
            data: {'empId':$scope.resultObj.empId,'menuId':$scope.resultObj.menuId},
            headers: {
              'Authorization': 'Bearer ' + jwtByHRAPI,
             'Content-Type': 'application/x-www-form-urlencoded'},
            success : function(result1){
              if (result1.str=="") {

                  $.ajax({
                    url: (baseURL + '/api/claimForm/sendForApprove.spr'),
                    data: formData,
                    timeout: commonRequestTimeout,
                    type: 'POST',
                    contentType: false,
                    processData: false,
                    headers: {
                      'Authorization': 'Bearer ' + jwtByHRAPI
                   },
                      success : function(result2){
                        $ionicLoading.hide()
                        if(result2.clientResponseMsg =="OK"){
							$ionicLoading.hide();
                          showAlert("Application sent successfully.")  
                          $scope.redirectOnBack()      
                        }else{
							$ionicLoading.hide();
                          showAlert("Something went wrong. Please try later.")      
                          return
                        }
                        
                        
                      },

                      error : function(error){
                        $ionicLoading.hide()
                        showAlert(result1.str)    
                      }
                    });
                }else{
                    $ionicLoading.hide()
                    showAlert("Something went wrong. Please try later.")
                    return
                }
              },
              error : function(result){
                  $ionicLoading.hide()
                  showAlert("Something went wrong. Please try later.")
              }
             //}
          });
        }else{
			$ionicLoading.hide();
          shhowAlert(result.msg);
        }
      }
    
    });
    }
 
    });
   
  }








  $scope.cameraTakePicture = 	function (mode,module) { 
	var lbFoundPlace = false
	var iPlaceIndex = -1
    if (module=='CLAIM'){
		//multip file not working in web also 
		//so commenting loopo
		//find place where to add image
		/*
		for(var i=1; i <=10 ; i++){
			elem = document.getElementById("img_"+i+"")
			if (elem.src.indexOf('file:///') > -1){
				lbFoundPlace = true
				iPlaceIndex = i
				break;
			}
		}
		*/
	
		iPlaceIndex = 1
		lbFoundPlace = true
		
		if (iPlaceIndex==-1)
		{
			showAlert("Max Limit reached for uploading images")
			return
		}
		imgcontrolName= "img_"+ (iPlaceIndex ) 
	}
	
	
  
  if (mode=="camera"){

   navigator.camera.getPicture(onSuccess, onFail, { quality: 25,
    destinationType: Camera.DestinationType.DATA_URL,
	sourceType: Camera.PictureSourceType.CAMERA,
	correctOrientation: true
		});

		function onSuccess(imageData) {
			var image = document.getElementById(imgcontrolName);
			//image.style.visibility="visible"
			image.style.display="inline-block"
      if (window.device.platform != "Android"){
        image.src = "data:image/jpeg;base64," + imageData;
       // $scope.imageData = "data:image/jpeg;base64," + imageData;
    }else{
        var thisResult = JSON.parse(imageData);
        // convert json_metadata JSON string to JSON Object 
        //var metadata = JSON.parse(thisResult.json_metadata);
        image.src = "data:image/jpeg;base64," + thisResult.filename;
       // $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;
    }
     // var thisResult = JSON.parse(imageData);
      // convert json_metadata JSON string to JSON Object 
      //var metadata = JSON.parse(thisResult.json_metadata);
     // image.src = "data:image/jpeg;base64," + thisResult.filename;
      
		//	image.src = "data:image/jpeg;base64," + imageData;
			
			document.getElementById("file_1").value = ""
			document.getElementById("file_1").style.display = "none" 
			document.getElementById("rowFile_1").style.display = "none" 
			
			document.getElementById("delIconClaim_1").style.display = "none"
		}

		function onFail(message) {
			//alert('Failed because: ' + message);
		}
	}
   
}	



$scope.removeFile = function(module,elemId,arrIdx){
		
		var confirmPopup = $ionicPopup.confirm({
						title: '',
					template: 'Do you want to remove file?', //Message
					});
					confirmPopup.then(function (res) {
						if (res) {
							
							if (module=="CLAIM"){
								document.getElementById(elemId).value=""
								//document.getElementById(elemId).style.visibility="hidden"
								document.getElementById(elemId).style.display="none"
								//document.getElementById("delIconClaim_"+arrIdx).style.visibility="hidden"
								document.getElementById("delIconClaim_"+arrIdx).style.display="none"
								document.getElementById("rowFile_"+arrIdx).style.display="none"
								$scope.FileNames[arrIdx - 1] = ""
								$scope.FileTypes[arrIdx - 1] = ""
								$scope.FileContents[arrIdx - 1] = ""
						
								
						} else {
						return;
					}
					}
					});						
	
}


$scope.removePic = function (module,img,idx){
	var confirmPopup = $ionicPopup.confirm({
						title: '',
					template: 'Do you want to remove image?', //Message
					});
					confirmPopup.then(function (res) {
						if (res) {
						//do nothing
							document.getElementById(img).src=""
							//document.getElementById(img).style.visibility="hidden"
							document.getElementById(img).style.display="none"
						} else {
						return;
					}
					});						
	
}


  // $scope.redirectOnCtcClaim = function () {
  //   $ionicNavBarDelegate.back();
  // }
  $scope.redirectOnBack = function(){
	//$ionicNavBarDelegate.back();
    $state.go('requestClaimList');
  }




  $scope.SelectedFile = function( e ){
			
    var f
    var arr2Idx
    var reader = new FileReader();

      // Closure to capture the file information.
      var fileData ;
      reader.onload = (function(theFile) {
        return function(e) {
            $scope.FileContents[arr2Idx] =  e.target.result;
        };
      })(f);
      
   

    
    var lbFoundSpace = false; 
    f = $scope.selectedValues.elem.files[0]
    
	// single attachment
	//no need of loop
	arr2Idx = 0;
	$scope.FileNames[arr2Idx] = e.target.files[0].name
    $scope.FileTypes[arr2Idx] = e.target.files[0].type            
    reader.readAsDataURL(f);
	document.getElementById("file_1").value = $scope.FileNames[arr2Idx]
	document.getElementById("file_1").style.display="inline-block" 
	document.getElementById("rowFile_1").style.display="inline-block" 
	document.getElementById("delIconClaim_1").style.display = "inline-block"
	
	document.getElementById("img_1").style.display = "none"
	document.getElementById("img_1").src = ""
	
	
	return		
	
	/*
    for (var k=1;k<=10;k++){
        if (document.getElementById("file_"+k).value==""){
            document.getElementById("file_"+k).value = e.target.files[0].name

            //document.getElementById("file_"+k).style.visibility = "visible"
			document.getElementById("file_"+k).style.display = "inline-block"
            //document.getElementById("delIconClaim_"+k).style.visibility = "visible"
			document.getElementById("delIconClaim_"+k).style.display = "inline-block"
            arr2Idx = k-1;
            $scope.FileNames[arr2Idx] = e.target.files[0].name
            $scope.FileTypes[arr2Idx] = e.target.files[0].type            
            reader.readAsDataURL(f);
            lbFoundSpace = true
            break;
        }
    }
	*/
    

    if (lbFoundSpace==false)	{
        showAlert("Max Limit reached for uploading files")
    }
}

  

$scope.payHeadChanged = function (){
  
  $scope.getBalanceOfPayHead()
  //$timeout(function () {},500)

}

$scope.getBalanceOfPayHead = function()
		{
      
     $scope.tmpobj = {}
	 var payhead = document.getElementById("payhead")
     if (payhead.selectedIndex==0){
      //document.getElementById("payHeadDtls").style.visibility="hidden"   
      document.getElementById("payHeadDtls").style.display="none"   
      return
     }
     
     $scope.tmpobj.claimFlag = "CTC"
     $scope.tmpobj.payHeadId = $scope.listCtcPayHeadList[payhead.selectedIndex-1].ctcPayHeadId
     $scope.tmpobj.fYearId = $scope.resultObj.fYearId
     $scope.tmpobj.empId = parseInt(sessionStorage.getItem('empId'))
     
     $ionicLoading.show()
     $.ajax({
      url: (baseURL + '/api/claimForm/getBalanceOfPayHead.spr'),
      method: 'POST',
      timeout: commonRequestTimeout,
      transformRequest: jsonTransformRequest,
      data: {'ctcPayHeadId': $scope.tmpobj.payHeadId, 'fYearId': $scope.tmpobj.fYearId,
      'empId': $scope.tmpobj.empId,'claimFlag':$scope.tmpobj.claimFlag},
      headers: {
        'Authorization': 'Bearer ' + jwtByHRAPI,
        'Content-Type': 'application/x-www-form-urlencoded'},
      async : false,
      success: function (data) {
        
        if (!(data.clientResponseMsg=="OK")){
          console.log(data.clientResponseMsg)
          handleClientResponse(data.clientResponseMsg,"getBalanceOfPayHead")
  
        }
          $scope.balanceList = []
          if (data.balanceList.length==0){
              $ionicLoading.hide()
                  //document.getElementById("payHeadDtls").style.visibility="hidden"
                  document.getElementById("payHeadDtls").style.display="none"   
                  return;
          }
          //document.getElementById("payHeadDtls").style.visibility="visible"
          document.getElementById("payHeadDtls").style.display="inline-block"   

          $scope.balanceList = data.balanceList;
          $scope.phdYearlyClaim = $scope.balanceList[0].toFixed(2);
          $scope.phdIpCA = $scope.balanceList[1].toFixed(2);
          $scope.phdAppCA = $scope.balanceList[2].toFixed(2);
          $scope.phdRiCA = $scope.balanceList[3].toFixed(2);
          $scope.phdAB = $scope.balanceList[4].toFixed(2);
          $scope.phdBforY = $scope.balanceList[5].toFixed(2);
          $scope.actualYearlyClaim = $scope.balanceList[6].toFixed(2);
          

          
          $ionicLoading.hide()
        
      },error(err)
      {
          showAlert("Something wennt wrong, Please select payhead again.")
      }
    });

	    
		}
  $scope.init();
});
