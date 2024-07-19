// mainModule.factory("getFindWorkFlowService", function ($resource) {
//   return $resource((baseURL + '/api/leaveApplication/findWorkFlowApprover.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout}}, {});
// });


mainModule.factory("addClaimFormService", function ($resource) {
    return $resource((baseURL + '/api/claimForm/addClaimForm.spr'), {}, {'save': {method: 'POST',
     timeout: commonRequestTimeout,
     headers: {
      'Authorization': 'Bearer ' + jwtByHRAPI
      }}}, {});
  });

  mainModule.factory("approvePendingClaimService", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/claimForm/approveRequest.spr'), {}, {
      'save': {
        method: 'POST', timeout: commonRequestTimeout,
        headers: {
          'Authorization': 'Bearer ' + jwtByHRAPI
          }
      }
    }, {});
  }]);  

  mainModule.factory("viewClaimApprove", function ($resource) {
    return $resource((baseURL + '/api/claimForm/viewClaimApprove.spr'), {}, 
    {'save': {method: 'POST', timeout: commonRequestTimeout,
    headers: {
      'Authorization': 'Bearer ' + jwtByHRAPI
      }
  }}, {});
  });

  mainModule.controller('approvalCTCdetailsCtrl', function ($scope,$rootScope, commonService, $ionicHistory, $rootScope, $ionicPopup, getValidateLeaveService, $state, $http, $q, $filter, $ionicLoading,addClaimFormService, 
    getLeaveMasterService,$timeout, viewClaimApprove, approvePendingClaimService ) {
  
  $rootScope.navHistoryPrevPage="approveClaimList"
  //$rootScope.navHistoryCurrPage="leave_application"
  $rootScope.navHistoryPrevTab="CLAIM_CTC"	
  //alert($rootScope.ctcclaimApplForApprove.status) 
 
  
    // $ionicLoading.show();
    $scope.resultObj = {}
    $scope.selectedFileName = ''
  
    $scope.init = function () {
      $ionicLoading.show()
  
  
      $scope.FileNames = new Array(10)
      $scope.FileTypes = new Array(10)	
      $scope.FileContents = new Array(10)
  
  
      if ( getMyHrapiVersionNumber() >= 32){
        $scope.utf8Enabled = 'true'    
      }else{
        $scope.utf8Enabled = 'false'    
      }
      

      $scope.resultObj.menuId = '2009'
      $scope.resultObj.buttonRights = 'Y-Y-Y-Y'
      $scope.resultObj.claimFlag = 'CTC';
      $scope.resultObj.empId = sessionStorage.getItem("empId");
      $scope.resultObj.trackerId = $rootScope.ctcclaimApplForApprove.trackerId;
      $scope.resultObj.status =  $rootScope.ctcclaimApplForApprove.status
      //$scope.resultObj.aprvrOrcc = 
      $scope.resultObj.mail = 'N';
      //$scope.resultObj.custClaimsFlag = 
      //$scope.resultObj.claimFlag = 
      $scope.resultObj.userAprvEnd =  '';
      $scope.resultObj.tranId =  $rootScope.ctcclaimApplForApprove.ctcClaimId;
      //$scope.resultObj.save = 
      //$scope.resultObj.fYearId = $rootScope.claimPeriodSelected
      
      
      //$scope.resultObj.ctcPayHeadName='Compensation Claim (CTC)'
      $scope.claimListApplicationForm = {}
      $scope.selectedValues={}

      $scope.viewClaimApprove = new viewClaimApprove();
      $scope.viewClaimApprove.$save($scope.resultObj, function (data) {
              if (!(data.clientResponseMsg=="OK")){
                  console.log(data.clientResponseMsg)
              handleClientResponse(data.clientResponseMsg,"addClaimFormService")
              showAlert("Something went wrong. Please try later.")
              $ionicLoading.hide()
              return
              }
          $scope.CTCClaimList = []
          var ctc = JSON.parse(data.form);
          $scope.claimForm_Form = ctc;
           console.log("ctc"+ctc);
            
            $scope.periodfromDt = $scope.claimForm_Form.ctcPeriodVO.fromDt
            $scope.periodtoDt = $scope.claimForm_Form.ctcPeriodVO.toDt

            document.getElementById("month").value = $scope.claimForm_Form.month
            document.getElementById("paymentMonth").value = $scope.claimForm_Form.month
            $timeout(function () {
            for(var i=0;i<document.getElementById("yearId").options.length;i++){
              if (document.getElementById("yearId").options[i].innerHTML == $scope.claimForm_Form.yearId  ){
                document.getElementById("yearId").options[i].selected = true
                $ionicLoading.hide()
                  break;
                  }
              }
            },1000)
 
          }, function (data, status) {
              autoRetryCounter = 0
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
          });
    }
  
  
  /*
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
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
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
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              success : function(result1){
                if (result1.str=="") {
  
                    $.ajax({
                      url: (baseURL + '/api/claimForm/sendForApprove.spr'),
                      data: formData,
                      timeout: commonRequestTimeout,
                      type: 'POST',
                      contentType: false,
                      processData: false,
  
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
              image.src = "data:image/jpeg;base64," + imageData;
              
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
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
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
          */
    $scope.init();


    $scope.setDate = function () {
      var date;
      if ($scope.fDate == null) {
          date = new Date();
      }
      else {
          date = $scope.fDate;
      }
      var options = {date: date, mode: 'date', titleText: 'Date', androidTheme: 4};
      datePicker.show(options, function (date) {
          if (date == undefined) {

          }
          else {
              $scope.fDate = date;
        document.getElementById("disburseDate").value = $filter('date')(date, 'dd/MM/yyyy');

      if (!$scope.$$phase)
                  $scope.$apply()

          }
      }, function (error, status) {
          $ionicLoading.hide();
      });
  }
  
  
/*
  $scope.goApprove function()
  {
    $('.popover').css({"visibility":"hidden"});
    
     if('${claimForm_Form.claimflag}'=='NONCTC')
     {	
    var textErr = "";
    var isFromMail = "${mail}";
    var claimAmount=document.getElementById("claimAmount1").value;
  
    $(":input[id^=approvedBillAmount]").each(function(outerLoop){
      if(document.getElementById("monthId"+outerLoop).value == -1){
        textErr +="Please Select Month at "+ctcPayHeadNameCust+"\n";
           
         }
         if(document.getElementById("yearId"+outerLoop).value == -1){
           textErr +="Please Select Year at "+ctcPayHeadNameCust+"\n";   			
         }		
      var aprvdBillAmnt = $(":input[id^=approvedBillAmount]").eq(outerLoop).val();
      if(aprvdBillAmnt <= 0.0){	
        var ctcPayHeadNameCust = $("#ctcPayHeadName"+outerLoop).val();
        textErr += "Approved Amount should be Greater than 0.0 at "+ctcPayHeadNameCust+"\n";										
      }
      var claimAmountCust = $("#claimAmount"+outerLoop).val();
      if(parseFloat(aprvdBillAmnt) > parseFloat(claimAmountCust)){
        var ctcPayHeadNameCust = $("#ctcPayHeadName"+outerLoop).val();
        textErr += "Approved Amount should not be more than Claim Amount at "+ctcPayHeadNameCust+"\n";										
      }		
    });	
    var lLcheck= $("#lastLevelCheck").val();
    if(lLcheck == 'last')
    {
      var pmntMde= $("#paymentMode").val();
      if(pmntMde == -1)
      {
        textErr += "Please Select Payment Mode \n";
      }
    }		
    if(textErr != "")
    {
      warningMessageAlert(textErr,'${alertHeader}');
      return;
    }
    confirmInfoAlert("${alertHeader}",document.getElementById("approve").value,"NO","YES",function(r) 
    {	
      if(r){	
        
        
        if(isFromMail != null && isFromMail == 'Y'){
          document.form1.action="approveRequest.spr?isFromMail=Y";
          document.form1.submit();
        }else{
          document.form1.action="approveRequest.spr?isFromMail=N";
          document.form1.submit();
        }
        window.parent.$("#preloader").show(); 
      }
    });
     }
     if('${claimForm_Form.claimflag}'=='CTC')
     {
       var isFromMail = "${mail}";
      var text="";
      if(document.getElementById("month").value == -1){
        text +="Please Select Month \n";
           
         }
         if(document.getElementById("yearId").value == -1){
           text +="Please Select Year \n";   			
         }			
      var aprvdBillAmnt = $("#revisedClaimAmount").val();
      if(aprvdBillAmnt <= 0.0)
      {					
        text += "Approved Amount should be greater than 0.0 \n";										
      }
      var claimAmountCust = $("#claimAmount").val();
      if(parseFloat(aprvdBillAmnt) > parseFloat(claimAmountCust))
      {				
        text += "Approved Amount should not be more than Claim Amount.\n";										
      }
      if(${claimForm_Form.lastLevel eq 'last'}){
      var disamnt = $("#disburseAmount").val();
      var balamnt = $("#balanceAmount").val();
      if(disamnt>balamnt){
        text += "Claim amount cannot be greater than balance amount. \n";
      }
      if(document.getElementById("paymentMode").value == -1){
        text += "Select Payment Mode \n";
        }
      if(document.getElementById("paymentMode").value == "Disburse By Cash"){
        if(document.getElementById("disburseYear").value == -1){
          text += "Select Year of Payment Mode \n";
        }
        if(document.getElementById("disburseMonth").value == -1){
          text += "Select Month of Payment Mode \n";
        }
        if(document.getElementById("disburseAmount").value == "0.0"){
          text += "Select Amount of Payment Mode \n";
        }
      }
      if(document.getElementById("paymentMode").value == "Disburse By Payroll"){
        if(document.getElementById("disburseDate").value == ""){
          text += "Select Date of Payment Mode \n";
        }
        if(document.getElementById("disburseAmount").value == "0.0"){
          text += "Select Amount of Payment Mode \n";
        }
      }
        }
      if(text ==''){
        confirmInfoAlert("${alertHeader}",document.getElementById("approve").value,"NO","YES",function(r) {	
        if(r){
          
          if(isFromMail != null && isFromMail == 'Y'){
              document.form1.action="approveRequest.spr?isFromMail=Y";
              document.form1.submit();
            }else{
              document.form1.action="approveRequest.spr?isFromMail=N";
              document.form1.submit();	
            }
          window.parent.$("#preloader").show(); 
        }
      });
      }
      else
        {
        warningMessageAlert(text, "${alertHeader}");
        }	   
     }
     if('${claimForm_Form.claimflag}'=='LTACLAIM')
     {
       var isFromMail = "${mail}";
      var text="";
      text=validate();
      if(text ==''){
        confirmInfoAlert("${alertHeader}",document.getElementById("approve").value,"NO","YES",function(r) {	
        if(r){
          if(isFromMail != null && isFromMail == 'Y'){
              document.form1.action="approveRequest.spr?isFromMail=Y";
              document.form1.submit();
            }else{
              document.form1.action="approveRequest.spr?isFromMail=N";
              document.form1.submit();	
            }
          window.parent.$("#preloader").show();
        }
      });
      }
      else
        {
        warningMessageAlert(text, "${alertHeader}");
        }	   
     }
  }
        
  $scope.goReject = function()
  {
    $('.popover').css({"visibility":"hidden"});
  
        if('${claimForm_Form.claimflag}'=='NONCTC')
        {	
         //====================================================================
          var flag=0;
          var errorTxt="";
          var counter=0;
           $(":input[id^=appvrRemarks_]").each(function(outerLoop){
            $('#appvrRemarks_'+outerLoop).css("border", "1px solid #CCC");
               if($(this).val().trim().length == 0){
                 errorTxt= "Approver remarks is mandatory.";
                 flag=1;
                 counter=outerLoop;
                 return false;
               }
          });	
          
          if(flag ==1){
            warningMessageAlert(errorTxt, "${alertHeader}");
            $('#appvrRemarks_'+counter).focus();
            //$('html, body').scrollTop($('#advAmountByAccountant'+counter).offset().top);
            $('#appvrRemarks_'+counter).css("border", "1px solid red");
          }else{
        //====================================================================
        var isFromMail = "${mail}";
        confirmInfoAlert("${alertHeader}",document.getElementById("reject").value,"NO","YES",function(r) {
          if(r){
            
            if(isFromMail != null && isFromMail == 'Y'){
              document.form1.action="rejectRequest.spr?isFromMail=Y";	
              document.form1.submit();
                       }else{
                         document.form1.action="rejectRequest.spr?isFromMail=N";
                         document.form1.submit();     							
                       }
              window.parent.$("#preloader").show(); 
            
                  }
          });	
          }
        }
        if('${claimForm_Form.claimflag}'=='CTC' || '${claimForm_Form.claimflag}'=='LTACLAIM')
        {
        var approverRmks= $("#appRemarks").val();
        if(approverRmks.trim().length >0){
          var isFromMail = "${mail}";
          confirmInfoAlert("${alertHeader}",document.getElementById("reject").value,"NO","YES",function(r) {
            if(r){
              if(isFromMail != null && isFromMail == 'Y'){
                document.form1.action="rejectRequest.spr?isFromMail=Y";	
                document.form1.submit();
                }else{
                  document.form1.action="rejectRequest.spr?isFromMail=N";
                  document.form1.submit();						
                }
              window.parent.$("#preloader").show(); 
               }
          }); 
        }else{
          $('#appRemarks').css("border", "1px solid #CCC");
          warningMessageAlert("Approver remarks is mandatory.", "${alertHeader}"); 
          $('#appRemarks').focus();
          //$('html, body').scrollTop($('#advAmountByAccountant'+counter).offset().top);
          $('#appRemarks').css("border", "1px solid red");
        }
        }
  }
  
  */

  $scope.approveOrRejectPendingCClaim = function (type) {

    //$rootScope.ctcclaimApplForApprove.approvedClaimAmount = document.getElementById("amount").value
    claimFormVO = {};
    var fd = new FormData();
    $scope.claimPendingCObject = {};//ctcclaimApp
    //$scope.claimPendingCObject.claimFormVO = {}

    claimFormVO.disburseYear =  document.getElementById("disburseYear").value
    claimFormVO.disburseYear =  parseInt(claimFormVO.disburseYear.replace("number:",""));
    claimFormVO.disburseMonth = parseInt(document.getElementById("disburseMonth").value)
    if (document.getElementById("disburseDate").value != ""){
      claimFormVO.disburseDate = document.getElementById("disburseDate").value 
    }
    claimFormVO.disburseRemark = document.getElementById("disburseRemark").value 
    if (document.getElementById("disburseAmount").value != ""){
      claimFormVO.disburseAmount = document.getElementById("disburseAmount").value 
    }else{
      claimFormVO.disburseAmount = 0
    }
    revisedClaimAmount = document.getElementById("revisedClaimAmount").value 
    fd.append("revisedClaimAmount",revisedClaimAmount)
    fd.append("month",$("#month").val()) 
    fd.append("paymentMonth",$("#paymentMonth").val()) 
    
    // $scope.claimPendingCObject.disburseYear =  document.getElementById("disburseYear").value
    // $scope.claimPendingCObject.disburseYear =  claimFormVO.disburseYear.replace("number:","");
    // $scope.claimPendingCObject.disburseMonth = document.getElementById("disburseMonth").value
    
    // $scope.claimPendingCObject.disburseDate = document.getElementById("disburseDate").value 
    // $scope.claimPendingCObject.disburseRemark = document.getElementById("disburseRemark").value 
    // $scope.claimPendingCObject.disburseAmount = document.getElementById("disburseAmount").value 

    //$rootScope.ctcclaimApplForApprove.claimFormVO =  claimFormVO;
    //$scope.claimPendingCObject.claimFormVO = claimFormVO;

    if (type == "APPROVE") {
      $scope.data = {}
      ctcclaimApp =  $rootScope.ctcclaimApplForApprove
      
      $scope.claimPendingCObject.claimId = ctcclaimApp.claimFormId;
      fd.append("claimId", ctcclaimApp.claimFormId)
      $scope.claimPendingCObject.empId = sessionStorage.getItem("empId");//ctcclaimApp.empId // sessionStorage.getItem('empId');
      fd.append("empId",sessionStorage.getItem("empId"))
      $scope.claimPendingCObject.menuId = '2009';
      fd.append("menuId",'2009')
      $scope.claimPendingCObject.buttonRights = "Y-Y-Y-Y";
      fd.append("buttonRights",'Y-Y-Y-Y')
      $scope.claimPendingCObject.remark = "";
      fd.append("remark", "")
      $scope.claimPendingCObject.isFromMail = "N";
      fd.append("isFromMail","N")
      $scope.claimPendingCObject.mail = "N";
      fd.append("mail","N")
      $scope.claimPendingCObject.status = ctcclaimApp.status;
      fd.append("status",ctcclaimApp.status)
      $scope.claimPendingCObject.claimFlag = 'CTC';
      fd.append("claimFlag","CTC")
      $scope.claimPendingCObject.claimFormId = parseInt(ctcclaimApp.ctcClaimId);
      fd.append("claimFormId", ctcclaimApp.ctcClaimId)
      $scope.claimPendingCObject.tranId = parseInt(ctcclaimApp.claimFormId);
      fd.append("tranId",ctcclaimApp.tranId)
      
      $scope.claimPendingCObject.trackerId = ctcclaimApp.trackerId;
      fd.append("trackerId",ctcclaimApp.trackerId)
      //$scope.claimPendingCObject.transAssignEmpId = 0;
      $scope.claimPendingCObject.transAssignEmpId = "";
      fd.append("transAssignEmpId", "")
      $scope.claimPendingCObject.claimAmount = $scope.claimForm_Form.claimFormVOList[0].claimAmount
      fd.append("claimAmount",$scope.claimForm_Form.claimFormVOList[0].claimAmount)
      $scope.claimPendingCObject.billAmount = $scope.claimForm_Form.claimFormVOList[0].billAmount
      fd.append("billAmount",$scope.claimForm_Form.claimFormVOList[0].billAmount)
      //$scope.claimPendingCObject.approvedAmount = parseInt(ctcclaimApp.approvedClaimAmount)
      //$scope.claimPendingCObject.reimbursedAmount = parseInt(ctcclaimApp.reimburseAmt)
      $scope.claimDate = ctcclaimApp.attDate;
      fd.append("userAprvEnd","")
      $scope.claimPendingCObject.userAprvEnd = ""

      if ($scope.claimPendingCObject.isFromMail != "" || $scope.claimPendingCObject.isFromMail == "N") {
        //$scope.claimPendingCObject.revisedClaimAmount = $scope.claimPendingCObject.claimAmount
        $scope.claimPendingCObject.revisedClaimAmount = 0
        var myPopup = $ionicPopup.show({
          template: '',
          title: 'Do you want to approve  ?',
          scope: $scope,
          buttons: [
            {
              text: 'Cancel'
            }, {
              text: '<b>Approve</b>',
              type: 'button-positive',
              onTap: function (e) {
                return true;
              }
            }
          ]
        });
        myPopup.then(function (res) {
          if (res) {
            
            $ionicLoading.show();
            // $scope.claimPendingCObject.paymentMonth = "08";
            $scope.claimPendingCObject.paymentMode = ""

            $scope.claimPendingCObject.paymentMonth = $("#paymentMonth").val();
            if ($("#paymentMode").val()){
              $scope.claimPendingCObject.paymentMode = $("#paymentMode").val();
              $scope.claimPendingCObject.paymentMode  =  $scope.claimPendingCObject.paymentMode.replace("string:","");
            }
            
            fd.append("paymentMode",$scope.claimPendingCObject.paymentMode)
            
            
            // alert("Month :" +$scope.claimPendingCObject.paymentMonth);
            $scope.claimPendingCObject.revisedClaimAmount = parseInt($scope.claimPendingCObject.revisedClaimAmount)
            $scope.claimPendingCObject.appRemarks = $scope.claimPendingCObject.remark;

            // if ($scope.claimPendingCObject.claimFormVO.disburseAmount <= 0.0) {
            //   showAlert("Approved Amount should be greater than 0.0");
            //   $ionicLoading.hide()
            //   return
            // }
            // if ($scope.claimPendingCObject.claimFormVO.disburseAmount > $scope.claimPendingCObject.claimAmount) {
            //   showAlert("Approved Amount should not be more than Claim Amount");
            //   $ionicLoading.hide()
            //   return
            // }

            //////////////// changing to ajax 
            
            //fd.append("claim_form",JSON.stringify($scope.claimPendingCObject));
            claimFormVO.appRemarks = document.getElementById("remarks").value;

            if ($scope.utf8Enabled == 'true' ){
              if (claimFormVO.appRemarks){
                claimFormVO.appRemarks = encodeURI(claimFormVO.appRemarks)
              }
              if (claimFormVO.disburseRemark){
                claimFormVO.disburseRemark = encodeURI(claimFormVO.disburseRemark)
              }
            }
            fd.append("appRemarks",claimFormVO.appRemarks)            
            fd.append("vo",JSON.stringify(claimFormVO));

            for(var i=0;i<document.getElementById("yearId").options.length;i++){
              if (document.getElementById("yearId").options[i].selected == true  ){
                fd.append("yearId",document.getElementById("yearId").options[i].innerHTML);
                //alert("YEARID" + document.getElementById("yearId").options[i].innerHTML)
                  break;
                  }
              }

            $.ajax({
              url: baseURL + '/api/claimForm/approveRequest.spr',
              data: fd,
              type: 'POST',
              timeout: commonRequestTimeout,
              contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
              processData: false, // NEEDED, DON'T OMIT THIS
              headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
                },
              success: function (result) {
                if (!(result.clientResponseMsg == "OK")) {
                  console.log(result.clientResponseMsg)
                  handleClientResponse(result.clientResponseMsg, "openFileByCtcClaimId")
                  $ionicLoading.hide()
                  showAlert("Something went wrong. Please try later. not ok")
                  return
                }
                $scope.redirectOnBack();
                showAlert("Claim application", "Claim approved successfully");
                $ionicLoading.hide()
              },
              error: function (res) {
                $ionicLoading.hide()
                showAlert("Something went wrong while approving the claim.");
              }
        
            });

            //////////////////////////
            // $scope.approvePendingClaimService = new approvePendingClaimService();
            // $scope.approvePendingClaimService.$save(fd, function () {
            //   //getMenuInfoOnLoad(function () { });
            //   showAlert("Claim application", "Claim approved successfully");
            //   $scope.redirectOnBack();
            //   //$scope.ctcClaimlistFetched = false
            //   //$scope.getCtcClaimApprovalList();
            //   $ionicLoading.hide()
            // }, function (data) {
            //   $ionicLoading.hide()
            //   showAlert("Something went wrong. Please try later.");
            //   commonService.getErrorMessage(data);
            // });
            // return
          } else {
            $ionicLoading.hide()
            return;
          }
        });
      }
    }
    if (type == "REJECT") {

      $scope.data = {}
      $scope.claimPendingCObject = ctcclaimApp;
      $scope.claimPendingCObject.claimId = ctcclaimApp.claimFormId;
      $scope.claimPendingCObject.empId = sessionStorage.getItem('empId');
      $scope.claimPendingCObject.menuId = '2009';
      $scope.claimPendingCObject.buttonRights = "Y-Y-Y-Y";
      $scope.claimPendingCObject.remark = "";
      $scope.claimPendingCObject.isFromMail = "Y";
      $scope.claimPendingCObject.mail = "Y";
      $scope.claimPendingCObject.status = ctcclaimApp.status;
      $scope.claimPendingCObject.claimFlag = 'CTC';
      $scope.claimPendingCObject.claimFormId = parseInt(ctcclaimApp.ctcClaimId);
      $scope.claimPendingCObject.tranId = parseInt(ctcclaimApp.claimFormId);
      $scope.claimPendingCObject.trackerId = ctcclaimApp.trackerId;
      //$scope.claimPendingCObject.transAssignEmpId = 0;
      $scope.claimPendingCObject.transAssignEmpId = "";
      $scope.claimAmount = parseInt(ctcclaimApp.claimAmount)
      $scope.approvedAmount = parseInt(ctcclaimApp.approvedClaimAmount)
      $scope.reimbursedAmount = parseInt(ctcclaimApp.reimburseAmt)
      $scope.claimPendingCObject.userAprvEnd = ""
      if ($scope.claimPendingCObject.isFromMail != "" || $scope.claimPendingCObject.isFromMail == "Y") {
        var myPopup = $ionicPopup.show({
          template: '<label>Approver Remarks<form name="myRejectForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" rows="3" name="myRejectBox" ng-model="claimPendingCObject.remark" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myRejectForm.myRejectBox.$error.maxlength">No more text can be added.</span></form></label>',
          title: 'Do you want to reject?',
          scope: $scope,
          buttons: [
            { text: 'Cancel' }, {
              text: '<b>Reject</b>',
              type: 'button-positive',
              onTap: function (e) {
                return $scope.claimPendingCObject.remark || true;
              }
            }
          ]
        });
        myPopup.then(function (res) {
          if (res) {
            $ionicLoading.show();
            // $scope.claimPendingCObject.remarks = res;
            $scope.claimPendingCObject.remark = document.getElementById("remarks");
            $scope.claimPendingCObject.appRemarks = $scope.claimPendingCObject.remark;
            
            $scope.rejectPendingClaimService = new rejectPendingClaimService();
            $scope.rejectPendingClaimService.$save($scope.claimPendingCObject, function () {
              //$scope.ctcClaimlistFetched = false
              //$scope.getCtcClaimApprovalList();
              //getMenuInfoOnLoad(function () { });
              $ionicLoading.hide()
              showAlert("Claim application", "Claim rejected successfully");
              
              $scope.redirectOnBack();
            }, function (data) {
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
            });
            return
          } else {
            $ionicLoading.hide()
            return;
          }
        });
      }
    }
  }
  
  $scope.getMonthValue = function(mnthName){
      if (mnthName == "January"){
        return "01";
      }
      if (mnthName == "February"){
        return "02";
      }
      if (mnthName == "March"){
        return "03";
      }
      if (mnthName == "April"){
        return "04";
      }
      if (mnthName == "May"){
        return "05";
      }
      if (mnthName == "June"){
        return "06";
      }
      if (mnthName == "July"){
        return "07";
      }
      if (mnthName == "August"){
        return "08";
      }
      if (mnthName == "September"){
        return "09";
      }
      if (mnthName == "October"){
        return "10"
      }
      if (mnthName == "November"){
        return "11";
      }
      if (mnthName == "December"){
        return "12";
      }
      return "-1";
  }

  $scope.onChangePayMode = function(elem){
    var str = $(document.getElementById("paymentMode")).children("option:selected").val().replace("string:","")
    if (str == "Disburse By Cash"){
        $scope.paymode = "cash"
    }
    if (str == "Disburse By Payroll"){
      $scope.paymode = "payroll"
    }
  }

  
  $scope.redirectOnBack = function () {
		$state.go('approvalClaimList');
	}

  });
  