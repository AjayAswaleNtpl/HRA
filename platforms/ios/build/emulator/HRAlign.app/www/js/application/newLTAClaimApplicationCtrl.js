mainModule.factory("addClaimFormService", function ($resource) {
  return $resource((baseURL + '/api/claimForm/addClaimForm.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});

mainModule.controller('newLTAClaimApplicationCtrl', function ($scope,$rootScope, commonService, $ionicHistory, $rootScope, $ionicPopup, getValidateLeaveService, $state, $http, $q, $filter, $ionicLoading,addClaimFormService, getLeaveMasterService,
$ionicNavBarDelegate,$timeout) {
$rootScope.navHistoryPrevPage="requestClaimList"
//$rootScope.navHistoryCurrPage="leave_application"
$rootScope.navHistoryPrevTab="CLAIM_LTA"	

  // $ionicLoading.show();
  // $scope.resultObj = {}
    $scope.selectedFileName = ''
    $scope.resultObj = {}
    $scope.resultObj.menuId = '2014'
    $scope.resultObj.buttonRights = 'Y-Y-Y-Y'
    $scope.resultObj.claimFlag = 'LTACLAIM';
    $scope.resultObj.ctcPayHeadId='4'
	$scope.resultObj.ctcPayHeadName='LTA Claim'
	
	$scope.countGrid1 = 1
	
	$scope.FileNames = new Array(10)
	$scope.FileTypes = new Array(10)	
	$scope.FileContents = new Array(10)

	if ( getMyHrapiVersionNumber() >= 32){
		$scope.utf8Enabled = 'true'    
	}else{
		$scope.utf8Enabled = 'false'    
	}

	


    //$scope.resultObj.fYearId='1'
	$scope.resultObj.fYearId = $rootScope.claimPeriodSelected
    // $scope.resultObj.empId = parseInt(sessionStorage.getItem('empId'))
    $scope.claimListApplicationForm = {}
    $scope.selectedValues={}

  $scope.init = function () {

    $scope.addClaimFormService = new addClaimFormService();
    $scope.addClaimFormService.  $save($scope.resultObj, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
        handleClientResponse(data.clientResponseMsg,"addClaimFormService")

			}
        $scope.LTAClaimList = []
        var lta = JSON.parse(data.form);
		$scope.ltaform = lta;
		$scope.eisFamilyList = data.eisFamily;
		
        // if (data.form.claimFormVOList!=null){
          // $scope.claimFormVOList = data.form.claimFormVOList
          // $scope.resultObj.empId=$scope.claimFormVOList[0].empId
          $scope.listLtaCtcPayHeadList = lta.listCtcPayHead
          $scope.listClaimPayhead = lta.listCtcPayHead.ctcPayHeadName
          // $scope.listClaimFormId = $scope.claimFormVOList[0].claimFormId
          $scope.listMonth = lta.monthList
          $scope.listYear = lta.yearList
          $scope.periodfromDt = data.ctcPeriodVO.fromDt
          $scope.periodtoDt = data.ctcPeriodVO.toDt
          $scope.ltalist = lta.ltaClaimGridList
        // }


        $ionicLoading.hide()
		
		
		
				$timeout(function () {
					//elem = document.getElementById("familyElem_0")
					//elem.options[0].selected = true
					//familyId  = elem.options[elem.selectedIndex].value
					//$scope.ltaform.ltaClaimGridList[i].familyId = familyId
				},250)
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
  }
  
  
  $scope.setFromDate = function (object) {
	  var selIndex = $scope.ltaform.ltaClaimGridList.indexOf(object)		
      var date = new Date;

      var options = {date: date, mode: 'date', titleText: 'From Date', androidTheme: 4};
      datePicker.show(options, function (date) {
          if (date == undefined) {

          }
          else {
              $scope.fDate = date
              //$scope.fDate = $filter('date')(date, 'dd/MM/yyyy');
			  
			  $scope.ltalist[selIndex].ctcFromDate = date
			  document.getElementById('fromDate_'+selIndex).value = $filter('date')(date, 'dd/MM/yyyy');

              /*
              var compTimeForFrom = $scope.fDate.getTime() - new Date().getTime()			  
			  if ($scope.resultObj.leaveToDate) {
                  var compTime = $scope.tDate.getTime() - date.getTime();
                  if (compTime < 0) {
                      showAlert("Set from date", "Leave from date must be less than to date")
                      $scope.resultObj.leaveFromDate = $scope.resultObj.leaveToDate = ''
                      $scope.dataBuffer.noDaysCounted = ''
                      $scope.getTotalTimeDiff = ''
                      $scope.fromToTypeCondition($scope.resultObj.fromLeaveType)
                      return
                  }
                  $scope.resultObj.leaveFromDate = $filter('date')(date, 'dd/MM/yyyy');
                  $scope.$apply();
                  if ($scope.resultObj.leaveFromDate && $scope.resultObj.leaveToDate) {
                      $scope.getMasterListOnload()
                  }
              } else {
                  $scope.resultObj.leaveFromDate = $filter('date')(date, 'dd/MM/yyyy');
                  $scope.$apply();
                  if ($scope.resultObj.leaveFromDate && $scope.resultObj.leaveToDate) {
                      $scope.getMasterListOnload()
                  }
              }
              if ($scope.resultObj.leaveToDate && $scope.resultObj.leaveFromDate) {
                  if ($scope.resultObj.fromLeaveType == 'shortLeave' && $scope.resultObj.toLeaveType == 'shortLeave' && $scope.resultObj.leaveToDate != $scope.resultObj.leaveFromDate) {
                      showAlert("Leave type", "From and to date should be same for short leave")
                      $scope.resultObj.leaveFromDate = ''
                      return
                  } else if ($scope.resultObj.fromLeaveType == 'shortLeave' && $scope.resultObj.leaveFromDate != $scope.resultObj.leaveToDate) {
                      showAlert("Leave Type", "From and to date should be same for short leave")
                      $scope.resultObj.leaveFromDate = ''
                      return
                  }
              }
              $scope.fromToTypeCondition($scope.resultObj.fromLeaveType)
			  */
          }
      }, function (error) {
      });
  }




  $scope.setToDate = function (object) {
	var selIndex = $scope.ltaform.ltaClaimGridList.indexOf(object)		
      var date = new Date();

      if ($scope.tDate === undefined)  {
          $scope.tDate = new Date();
      }
      else if ($scope.tDate != "") {
			date = $scope.tDate
		  	
          //var parts = $scope.fDate.split('/');
          //$scope.fDate = new Date(parts[2], parts[1] - 1, parts[0]);
      }
      
		
      var options = {date: date, mode: 'date', titleText: 'To Date', androidTheme: 4};
      datePicker.show(options, function (date) {
          if (date == undefined) {

          }
          else {
              $scope.tDate = date
			  
              if ($scope.tDate) {
                  
				  $scope.ltalist[selIndex].ctcToDate = $filter('date')(date, 'dd/MM/yyyy');
				  document.getElementById('toDate_'+selIndex).value = $filter('date')(date, 'dd/MM/yyyy');

				  if ($scope.fDate && $scope.fDate != "" && $scope.fDate != null){
					
					  var compTime = $scope.fDate.getTime() - $scope.tDate.getTime();
				  if (compTime > 0) {
						  showAlert("Error!!", "Leave From Date must be less than leave To Date !")
						  $scope.tDate = ''
						 document.getElementById('toDate_'+selIndex).value = ''
						 $scope.ltalist[selIndex].ctcToDate = ''
						  return
					  }
				  }
				  
                 
              } else {
                  showAlert("Set to date", "Please select from date first")
                  return
              }
          }
      }, function (error) {
      });
      $scope.selectedFileName = ''
  }
  
  $scope.getTimeDifference = function () {

  var fromHH,toHH,fromMin,toMin, minutesDiff
  fromHH = $scope.resultObj.fromLvHr.replace(":", ".").split('.')[0]
  toHH = $scope.resultObj.toLvHr.replace(":", ".").split('.')[0]
  fromMin = $scope.resultObj.fromLvHr.replace(":", ".").split('.')[1]
  toMin = $scope.resultObj.toLvHr.replace(":", ".").split('.')[1]
  if (toMin >= fromMin){
    minutesDiff = (toHH - fromHH)*60 + (toMin - fromMin)
  }
  else{
    minutesDiff = (toHH - fromHH -1)*60 + (60-( fromMin - toMin))
  }

  if ((minutesDiff % 60) < 10){
    $scope.getTotalTimeDiff = parseInt(minutesDiff/60) + ".0" + (minutesDiff % 60)
  }else{
    $scope.getTotalTimeDiff = parseInt(minutesDiff/60) + "." + (minutesDiff % 60)
  }

  }
  
 

$scope.payHeadChanged = function (){
  
  $scope.getBalanceOfPayHead()

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
     
     $scope.tmpobj.claimFlag = "LTACLAIM"
     $scope.tmpobj.payHeadId = $scope.listLtaCtcPayHeadList[payhead.selectedIndex-1].ctcPayHeadId
     $scope.tmpobj.fYearId =  $rootScope.claimPeriodSelected
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
           document.getElementById("payHeadDtls").style.display="inline-block"  
		   $ionicLoading.hide()
			showAlert("Something wennt wrong, Please select payhead again.")		   
		   return
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
          $scope.phdYearlyClaim = $scope.balanceList[0]
          $scope.phdIpCA = $scope.balanceList[1]
          $scope.phdAppCA = $scope.balanceList[2]
          $scope.phdRiCA = $scope.balanceList[3]
          $scope.phdAB = $scope.balanceList[4].toFixed(2);
          $scope.phdBforY = $scope.balanceList[5]
		  
		  
          

          
          $ionicLoading.hide()
        
      },error(err)
      {
		  $ionicLoading.hide()
          showAlert("Something wennt wrong, Please select payhead again.")
		  document.getElementById("payHeadDtls").style.display="inline-block"  
      }
    });
	}
	
	
	$scope.addRowGrid1 = function () {
		if ($scope.countGrid1<10){
			$timeout(function () {$scope.countGrid1++},250)
			
			
		}

	}
	$scope.remRowGrid1 = function () {
		if ($scope.countGrid1>1)
		$scope.countGrid1--
			
	}
	

	


  $scope.redirectOnBack = function(){
	$state.go('requestClaimList');
	//$ionicNavBarDelegate.back();
    
  }
  
  
	$scope.sendLTAForm = function(){

		text = $scope.validate()
		var text=""
		if (text!=""){
			showAlert(text)
			return
		}
		
		
		
		//var $scope.ltaList = new Array(10);
		//var listObj = {}
	  	var	count = $scope.countGrid1
	   	var num = 0;
	   		for(var i=0; i<=count-1; i++){
	   			if(document.getElementById("familyElem_"+i).value != "")
	   			{
	   				num++;
	   			}
	   		}

	   		if(num != 0)
	   		{
	   		var payHeadMessage='';
			var message = '';
			
			$scope.ltaform.ltaClaimGridList[i].ctcPayHeadId = $scope.tmpobj.payHeadId
			
	   		for(var i=0; i<=num-1; i++){
	   			var j = i+1;
				// populate values of form rows to list
				
				elem = document.getElementById("familyElem_"+i)
				$scope.ltaform.ltaClaimGridList[i].familyId = $scope.eisFamilyList[elem.selectedIndex - 1].familyId
				
				//familyId  = elem.options[elem.selectedIndex].value
				//$scope.ltaform.ltaClaimGridList[i].familyId = familyId
				//listObj.familyId = familyId
				//$scope.ltaClaimGridList[i].familyId = familyId
				
				monthElem = document.getElementById("month_"+i)
				monthId  = monthElem.options[monthElem.selectedIndex].value
				$scope.ltaform.ltaClaimGridList[i].month = monthId
				//listObj.month = monthId
				//$scope.ltaClaimGridList[i].month = monthId


				yearElem = document.getElementById("year_"+i)
				yearName = yearElem.options[yearElem.selectedIndex].text
				for(var k=0;k<10000;k++){
				if ($scope.listYear[k] == yearName  ){
					 yearId = k
					break;
					}
				}
				$scope.ltaform.ltaClaimGridList[i].yearId = yearId
				//listObj.yearId = yearId
				//$scope.ltaClaimGridList[i].yearId = yearId
				

				elem = document.getElementById("fromDate_"+i)
				fromDate  = elem.value
				$scope.ltaform.ltaClaimGridList[i].ctcFromDate = fromDate
				//listObj.ctcFromDate = fromDate
				//$scope.ltaClaimGridList[i].ctcFromDate = fromDate
				
				elem = document.getElementById("fromDate_"+i)
				toDate  = elem.value
				$scope.ltaform.ltaClaimGridList[i].ctcToDate = toDate
				//listObj.ctcToDate = toDate
				//$scope.ltaClaimGridList[i].ctcToDate = toDate
				
				elem = document.getElementById("fromLoc_"+i)
				fromLocation  = elem.value
				$scope.ltaform.ltaClaimGridList[i].fromLocation = fromLocation
				//listObj.fromLocation = fromLocation
				//$scope.ltaClaimGridList[i].fromLocation = fromLocation

				elem = document.getElementById("toLoc_"+i)
				toLocation  = elem.value
				$scope.ltaform.ltaClaimGridList[i].toLocation = toLocation
				//listObj.fromLocation = toLocation
				//$scope.ltaClaimGridList[i].fromLocation = toLocation
				
				elem = document.getElementById("trMode_"+i)
				travelMode  = elem.value
				$scope.ltaform.ltaClaimGridList[i].travelMode = travelMode
				//listObj.travelMode = travelMode
				//$scope.ltaClaimGridList[i].travelMode = travelMode

				
				elem = document.getElementById("claimAmt_"+i)
				claimAmount  = elem.value
				$scope.ltaform.ltaClaimGridList[i].claimAmount = claimAmount
				//listObj.claimAmount = claimAmount
				//$scope.ltaClaimGridList[i].claimAmount = claimAmount

				elem = document.getElementById("billNo_"+i)
				billno  = elem.value
				$scope.ltaform.ltaClaimGridList[i].billno = billno
				//listObj.billno = billno
				//$scope.ltaClaimGridList[i].billno = billno

				
				elem = document.getElementById("billAmt_"+i)
				billAmount  = elem.value
				$scope.ltaform.ltaClaimGridList[i].billAmount = billAmount
				//listObj.billAmount = billAmount
				//$scope.ltaClaimGridList[i].billAmount = billAmount
				
				
				elem = document.getElementById("rem_"+i)
				remarks  = elem.value
				if ($scope.utf8Enabled == 'true' ){
					if (remarks){
						remarks = encodeURI(remarks)
					}
				  }
				$scope.ltaform.ltaClaimGridList[i].remarks = remarks
				

				//listObj.remarks = remarks
				//$scope.ltaClaimGridList[i].remarks = remarks
				///////////
				$scope.ltaform.ltaClaimGridList[i].formObj = null
				$scope.ltaform.ltaClaimGridList[i].claimFormVO = null
				//$scope.ltaform.ltaClaimGridList[i].baseVo = null
				
				//$scope.ltaList.push(listObj)	
	   	}	//for

		
		$scope.sendForm(message)

	  }//if num != 0

	}




  $scope.sendForm = function (msg) {

	$scope.requestState = 'Send for Approval'

    var confirmPopup = $ionicPopup.confirm({
      title: 'Are you sure',
      template: msg + '\nDo you want to ' + $scope.requestState + ' ?', //Message
  });
  confirmPopup.then(function (res) {
      if (res) {
        $ionicLoading.show()
		var formData = new FormData();
    var base64result;
    var fileType;
    var blob;
	var fname;
	var fcontent;
	var ts;

	//// appending fileS
			
			for (var fileSrno = 1;fileSrno <=10;fileSrno++){
				elem  = document.getElementById('file'+fileSrno)
				if (elem.value != ""){
					//file selected at this location
					
					if ($scope.FileContents[fileSrno-1] === undefined){
					}else{
						fcontent = $scope.FileContents[fileSrno-1]
						fname = $scope.FileNames[fileSrno-1]
						
						base64result = fcontent.split(',')[1];
						fileType = fcontent.split(',')[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0]
						blob = base64toBlob(base64result, fileType,fname)
						formData.append('mobileFiles', blob,fname)
					}
					
				}
				
				elem  = document.getElementById('img'+fileSrno)
				if (elem.style.display =="inline-block"){
					imgSrc = elem.src
					imageData = imgSrc
					ts = new Date();
					ts = ts.getFullYear() +""+ ts.getMonth() +""+ ts.getDate() + " " + ts.getHours() +""+ ts.getMinutes() +""+ ts.getSeconds()
					fname="CamPic_"+fileSrno+"_"+ts+".jpg";
					
					base64result = imageData.split(',')[1];
					fileType = imageData.split(',')[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0]
					blob = base64toBlob(base64result, fileType,fname)
					formData.append('mobileFiles', blob,fname)
					
					
				}
			}
			
		
		
        $scope.jsonList =  JSON.stringify($scope.ltaform.ltaClaimGridList);
		//$scope.jsonList =  JSON.stringify($scope.$scope.ltaList);


		  formData.append('empId', parseInt(sessionStorage.getItem('empId')));
		  formData.append('menuId', parseInt($scope.resultObj.menuId));
		  formData.append('status', '');
          formData.append('level', 1);
          formData.append('claimFlag', $scope.resultObj.claimFlag);
          formData.append('fYearId', $scope.resultObj.fYearId);
          formData.append('periodId', $scope.resultObj.fYearId);
		  formData.append('ctcPayHeadId',$scope.resultObj.ctcPayHeadId);
		  
		  //formData.append('accumAmt',$scope.phdAB);
		  //formData.append('balAmt',$scope.phdBforY);
          
          formData.append('remarks', '');
          

          formData.append('buttonRights',  $scope.resultObj.buttonRights);
          formData.append('claimFormVOList',$scope.jsonList);

        $ionicLoading.show()
		$scope.resultObj.ctcPayHeadId = undefined
		$scope.resultObj.empId = parseInt(sessionStorage.getItem('empId'))
		$scope.resultObj.claimAmount = undefined

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

        if (result.msg == ""){

          $.ajax({
            url: (baseURL + '/masters/groupMaster/findWorkFlowIsDefined.spr'),
            method: 'POST',
            timeout: commonRequestTimeout,
            transformRequest: jsonTransformRequest,
            data: {'empId':$scope.resultObj.empId,'menuId':$scope.resultObj.menuId},
			async : false,
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
					async : false,
                    contentType: false,
                    processData: false,
					headers: {
						'Authorization': 'Bearer ' + jwtByHRAPI
					 },
                      success : function(result2){
                        $ionicLoading.hide()
                        if(result2.clientResponseMsg =="OK"){
                          showAlert(result2.msg)
						  $scope.redirectOnBack()

						  return
                        }else{
						 $ionicLoading.hide()
						  showAlert(result2.msg)
                          //showAlert("Something went wrong. Please try later.")
                          return
                        }

                      },

                      error : function(error){
                        $ionicLoading.hide()
                        showAlert("Something went wrong. Please try later.")
                      }
                    });
                }else{
                    $ionicLoading.hide()
                    showAlert(result1.str)
                    return
                }
              },
              error : function(result){
                  $ionicLoading.hide()
                  showAlert("Something went wrong. Please try later.")
              }
            // }
          });
        }else{
			 $ionicLoading.hide()
			 shhowAlert(result.msg);
        }
      }

    });
    }

    });

  }
	

	
	
$scope.validate = function (){
   	
   	var num = 0;
	text = ""
   		num = $scope.countGrid1
   		if(num != 0)
   		{
   		for(var i=0; i<=num-1; i++){
   			var j = i+1;
			if(document.getElementById("familyElem_"+i).value == ""){
	   			text +="\nPlease Select Family Details at row "+j;
				return text
	   		}
	   		if(document.getElementById("fromDate_"+i).value == ''){
	   			text +="\n Please Select From Date at row "+j;
				return text

	   		}
			if(document.getElementById("toDate_"+i).value == ''){
	   			text +="\n Please Select To Date at row "+j;
				return text

	   		}
			if(document.getElementById("fromLoc_"+i).value == ''){
	   			text +="\n Please enter From Location at row "+j;
				return text

	   		}
			if(document.getElementById("toLoc_"+i).value == ''){
	   			text +="\n Please enter To Location at row "+j;
				return text

	   		}
			if(document.getElementById("trMode_"+i).value == ''){
	   			text +="\n Please enter Travel Mode at row "+j;
				return text

	   		}

	   		if(document.getElementById("month_"+i).value == ""){
	   			text +="\nPlease Select Month at row "+j;
				return text

	   		}
	   		if(document.getElementById("year_"+i).value == ""){
	   			text +="\nPlease Select Year at row "+j;
				return text

	   		}
			
			
			if(document.getElementById("billNo_"+i).value == ""){
	   			text +="\nPlease enter Bill Number at row "+j;
				return text

	   		}
			
			
	   		if(document.getElementById("claimAmt_"+i).value == 0.0){
	   			text +="\nPlease enter Claim Amount at row "+j;
				return text

	   		}
	   		else if( isNaN(document.getElementById("claimAmt_"+i).value) )
			{
				text +="<br>Please enter Claim Amount greater than zero at row "+j;
				return text
			}
	   		else if( document.getElementById("claimAmt_"+i).value < 0)
	   			{
	   			text +="\n Please enter Claim Amount greater than zero at row "+j;
				return text
	   			}
	   		else if(document.getElementById("claimAmt_"+i).value == 0 ){
	   			text +="\n Please enter Claim Amount greater than zero at row "+j;
				return text

	   		}

			
			
	   		if(document.getElementById("billAmt_"+i).value == 0.0){
	   			text +="\n Please enter Bill Amount at row "+j;
				return text

	   		}
	   		else if( isNaN(document.getElementById("billAmt_"+i).value) )
				{
				text +="\n Please enter Bill Amount greater than zero at row "+j;
				return text
				}
	   		else if( document.getElementById("billAmt_"+i).value < 0)
	   			{
	   			text +="\n Please enter Bill Amount greater than zero at row "+j;
				return text
	   			}
	   		else if(document.getElementById("billAmt_"+i).value == 0 ){
	   			text +="\n Please enter Bill Amount greater than zero at row "+j;
				return text

	   		}

	   		if(Number(document.getElementById("billAmt_"+i).value)>0 && Number(document.getElementById("claimAmt_"+i).value)>0
			&& Number(document.getElementById("claimAmt_"+i).value)>Number(document.getElementById("billAmt_"+i).value))
	   			{
	   			text +="\n Claim amount can not be greater than Bill Amount";
				return text
	   			}

   		}
   		}
	   	if(num==0){
			text +="\n Please Fill at least one record";
			return text
		}

		return text
	  }
	  

	$scope.selectFromDeviceLTAClicked = function(event){
		document.getElementById('inputFileLBUpload').click()
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
			  
			//$ionicLoading.hide()
			
			
			var lbFoundSpace = false; 
			f = $scope.selectedValues.elem.files[0]
			
			if ($scope.selectedValues.section=="LTA"){
				for (var k=1;k<=10;k++){
					if (document.getElementById("file"+k).value==""){
						document.getElementById("file"+k).value = $scope.selectedValues.elem.files[0].name

						document.getElementById("file"+k).style.display = "inline-block"
						document.getElementById("delIcon"+k).style.display = "inline-block"
						arr2Idx = k-1;
						$scope.FileNames[arr2Idx] = $scope.selectedValues.elem.files[0].name
						$scope.FileTypes[arr2Idx] = $scope.selectedValues.elem.files[0].type
						
						reader.readAsDataURL(f);
						lbFoundSpace = true
						break;
					}
				}
			}
			
			

			if (lbFoundSpace==false)	{
				showAlert("Max Limit reached for uploading files")
			}
		}
		



$scope.cameraTakePicture = 	function (event) { 
	event.stopPropagation()	
	
	var btnid = $scope.selectedValues.elem.id
	var mode='camera'
	var idx;
	var module;
	var imgcontrolName 
	var lbFoundPlace = false
	var iPlaceIndex = -1
	
    
		//find place where to add image
		for(var i=1; i <=10 ; i++){
			elem = document.getElementById("img"+i)
			if (elem.src.indexOf('file:///') > -1){
				lbFoundPlace = true
				iPlaceIndex = i
				break;
			}
		}
	
		if (iPlaceIndex==-1)
		{
			showAlert("Max Limit reached for uploading images")
			return
		}
		imgcontrolName= "img"+ iPlaceIndex
	
	
	

   navigator.camera.getPicture(onSuccess, onFail, { quality: 25,
    destinationType: Camera.DestinationType.DATA_URL,
	sourceType: Camera.PictureSourceType.CAMERA,
	correctOrientation: true
		});

		function onSuccess(imageData) {
			var image = document.getElementById(imgcontrolName);
			image.style.display="inline-block"
			if (window.device.platform != "Android"){
                image.src = "data:image/jpeg;base64," + imageData;
                //$scope.imageData = "data:image/jpeg;base64," + imageData;
            }else{
                var thisResult = JSON.parse(imageData);
                // convert json_metadata JSON string to JSON Object 
                //var metadata = JSON.parse(thisResult.json_metadata);
                image.src = "data:image/jpeg;base64," + thisResult.filename;
               // $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;
            }
			//var thisResult = JSON.parse(imageData);
            // convert json_metadata JSON string to JSON Object 
            //var metadata = JSON.parse(thisResult.json_metadata);
           // image.src = "data:image/jpeg;base64," + thisResult.filename;  
			
			//image.src = "data:image/jpeg;base64," + imageData;

		}

		function onFail(message) {
			//alert('Failed because: ' + message);
		}
   
}	



	$scope.removeFile = function(module,elemId,arrIdx){
		
		var confirmPopup = $ionicPopup.confirm({
						title: '',
					template: 'Do you want to remove file?', //Message
					});
					confirmPopup.then(function (res) {
						if (res) {
							
							if (module=="LTA"){
								document.getElementById(elemId+arrIdx).value=""
								document.getElementById(elemId+arrIdx).style.display="none"
								document.getElementById("delIcon"+arrIdx).style.display="none"
								$scope.FileNames[arrIdx - 1] = ""
								$scope.FileTypes[arrIdx - 1] = ""
								$scope.FileContents[arrIdx- 1] = ""
							}
						} else {
						return;
					}
					
					});						
	
}
		
		

	$scope.removePic = function (module,img,idx){
		var confirmPopup = $ionicPopup.confirm({
						title: 'Are you sure ?',
					template: 'Do you want to remove image?', //Message
					});
					confirmPopup.then(function (res) {
						if (res) {
						//do nothing
							document.getElementById(img).src=""
							document.getElementById(img).style.display="none"
		
						} else {
						return;
					}
					});						
	
		}		
	  
  $scope.init();
});
