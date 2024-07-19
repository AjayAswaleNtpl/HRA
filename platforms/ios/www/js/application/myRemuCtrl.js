/*
 1.This controller is used to show payslip and tax slip.
 2.Payslip and tax slip are downloaded and opened.
 */

mainModule.factory("myPaySlipRemuService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/ctc/paySlip/myPaySlipRemu.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);

mainModule.factory("paySlipService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/ctc/paySlip/exportPaySlip.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);

mainModule.controller("myRemuCtrl", function ($scope, myPaySlipRemuService, commonService, validateService, $ionicModal, $ionicLoading,
$timeout) {

    $scope.paySlipObj = {};
    $scope.paySlipObj.selMonth = '';
    $scope.paySlipObj.selYear = '';

    $scope.taxSlipObj = {};
    $scope.taxSlipObj.selMonth = '';
    $scope.taxSlipObj.selYear = '';

    $scope.f_year = '';
    $scope.month = '';
    $scope.currYear = new Date().getFullYear();
    $scope.currMonth = new Date().getMonth() + 1;
    $scope.empId = sessionStorage.getItem('empId');
	
	$scope.reqObject = {}
	$scope.reqObject.empId = $scope.empId
	$scope.reqObject.buttonRights = "Y-Y-Y-Y"
	$scope.reqObject.msg = ""
	
	
	
	$scope.getSelectedType = function () {
		var Elem = document.getElementById("typeId");
		for (var i=0;i<100;i++){
			if ($scope.remunerationList[i] == Elem.value.replace("string:","")){
				return i;
				break;
			}
		}
		return -1;
	}
	$scope.getSelectedYear = function () {
		var Elem = document.getElementById("yearId");
		for (var i=0;i<10000;i++){
			if ($scope.f_yearList[i] == Elem.value.replace("string:","")){
				return i;
				break;
			}
		}
		return -1;
	}

    $scope.myPaySlip = function () {
        $scope.myPaySlipRemuService = new myPaySlipRemuService();
        $scope.myPaySlipRemuService.$save($scope.reqObject, function (data) {
			
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"myPaySlipRemuService")
			}
	
            $scope.f_yearList = data.listYear;
			$scope.remunerationList = data.remunerationList;
			
			//$scope.selectedValues.remuType = "Select Remuneration Type"
			
		
			/*
			var dojYr = new Date(parseInt(sessionStorage.getItem('dateOfJoining')));
			$scope.f_yearList =[]
			todayYr = new Date()
			
			
			
			if (dojYr.getFullYear() == todayYr.getFullYear()){
				$scope.f_yearList.push(todayYr.getFullYear());
			}
			else{
				for(var i = dojYr.getFullYear() ; i <= todayYr.getFullYear();i++){
					$scope.f_yearList.push(i)
				}
			}
            $scope.monthList = data.listMonth;
			*/
			
			
        }
        , function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
	
    $scope.myPaySlip();

    $scope.myTaxSlip = function () {
        $scope.myPaySlipService = new myPaySlipService();
        $scope.myPaySlipService.$save($scope.resultShiftObj, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"myPaySlipService")
			}
            $scope.f_yearList = data.listYear;
            $scope.monthList = data.listMonth;
        }
        , function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
    //$scope.myTaxSlip();

    $scope.downloadPaySlip = function (type) {
        if ($scope.paySlipObj.selYear == '' || $scope.paySlipObj.selMonth == '') {
            showAlert("", "Please select month & year");
        }
        else
        {
            if ($scope.paySlipObj.selYear > $scope.currYear)
            {
                showAlert("", "You cannot select future year.");
                return;
            }

            if ($scope.paySlipObj.selYear == $scope.currYear && $scope.paySlipObj.selMonth > $scope.currMonth)
            {
                showAlert("", "You cannot select future month.");
                return;
            }

            $ionicLoading.show({
            });
            var uri;
            var fileURL;
            if (ionic.Platform.isAndroid()) {
                if (type == 1) {
                    uri = baseURL + "/api/ctc/paySlip/exportPaySlip.spr?empId=" + $scope.empId + "&f_year=" + $scope.paySlipObj.selYear + "&month=" + $scope.paySlipObj.selMonth;
                    //  fileURL = "///storage/emulated/0/Download/payslip" + $scope.paySlipObj.selMonth + $scope.paySlipObj.selYear + ".pdf";
                    fileURL = cordova.file.externalDataDirectory + "payslip" + $scope.paySlipObj.selMonth + $scope.paySlipObj.selYear + ".pdf";
                }

                var fileTransfer = new FileTransfer();
                fileTransfer.download(
                        uri,
                        fileURL,
                        function (success) {
                            $ionicLoading.show({
                            });
                            $ionicLoading.hide();
                            showAlert("", "Your payslip is downloaded successfully and is password protected. Please use your DOB(ddmmyyyy) to open the file")
                            $scope.paySlipObj.selMonth = ''
                            $scope.paySlipObj.selYear = ''
                            cordova.plugins.fileOpener2.open(
                                    fileURL,
                                    'application/pdf',
                                    {
                                        error: function (e) {
                                            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                                        },
                                        success: function () {
                                            console.log('File opened successfully');
                                        }
                                    }
                            );
                        },
                        function (error) {
                            if (error.http_status == 406)
                            {
                                showAlert("", "Payslip is not available");
                            }
                            else if (error.code == 1)
                            {
                                showAlert("", "Please give storage permission");
                            }
                            else if (error.code == 3)
                            {
                                autoRetryCounter = 0
                                $ionicLoading.hide()
                                commonService.getErrorMessage(error);
                            }
                            $scope.paySlipObj.selMonth = ''
                            $scope.paySlipObj.selYear = ''
                            $ionicLoading.hide()
                        });
            }
            else
            {
                $ionicLoading.hide()
                uri = baseURL + "/api/ctc/paySlip/exportPaySlip.spr?empId=" + $scope.empId + "&f_year=" + $scope.paySlipObj.selYear + "&month=" + $scope.paySlipObj.selMonth;
                if (window.XMLHttpRequest)
                {
                    var oReq = new XMLHttpRequest();
                    oReq.open("GET", uri);
                    oReq.send();
                    oReq.onload = function () {
                        if (oReq.status == "406" || oReq.status != "200") {
                            showAlert("", "Payslip is not available");
                        }
                        else {
                            var ref = cordova.InAppBrowser.open(uri, '_blank', 'location=yes,toolbarposition=top');
                        }
                    };
                }
                $scope.paySlipObj.selMonth = ''
                $scope.paySlipObj.selYear = ''
            }
        }
    };



    $scope.downloadTaxSlip = function (type) {
        if ($scope.taxSlipObj.selYear == '' || $scope.taxSlipObj.selMonth == '') {
            showAlert("", "Please select month & year");
        }
        else
        {
            if ($scope.taxSlipObj.selYear > $scope.currYear)
            {
                showAlert("", "You cannot select future year.");
                return;
            }

            if ($scope.taxSlipObj.selYear == $scope.currYear && $scope.taxSlipObj.selMonth > $scope.currMonth)
            {
                showAlert("", "You cannot select future month.");
                return;
            }

            $ionicLoading.show({
            });
            var uri;
            var fileURL;
            if (ionic.Platform.isAndroid()) {
                if (type == 2)
                {
                    uri = baseURL + "/api/ctc/taxSlip/exportTaxForecast.spr?empId=" + $scope.empId + "&f_year=" + $scope.taxSlipObj.selYear + "&month=" + $scope.taxSlipObj.selMonth;
                    // fileURL = "///storage/emulated/0/Download/taxforecast" + $scope.taxSlipObj.selYear + ".pdf";
                    fileURL = cordova.file.externalDataDirectory + "taxforecast" + $scope.taxSlipObj.selYear + ".pdf";
                }
                var fileTransfer = new FileTransfer();
                fileTransfer.download(
                        uri,
                        fileURL,
                        function (success) {
                            $ionicLoading.show({
                            });
                            $ionicLoading.hide();
                            showAlert("", "File downloaded successfully.")
                            $scope.taxSlipObj.selMonth = ''
                            $scope.taxSlipObj.selYear = ''
                            cordova.plugins.fileOpener2.open(
                                    fileURL,
                                    'application/pdf',
                                    {
                                        error: function (e) {
                                            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                                        },
                                        success: function () {
                                            console.log('File opened successfully');
                                        }
                                    }
                            );
                        },
                        function (error) {

                            if (error.http_status == 406)
                            {
                                showAlert("", "Taxslip is not available");
                            }
                            else if (error.code == 1)
                            {
                                showAlert("", "Please give storage permission");
                            }
                            else if (error.code == 3)
                            {
                                autoRetryCounter = 0
                                $ionicLoading.hide()
                                commonService.getErrorMessage(error);
                            }
                            $scope.taxSlipObj.selMonth = ''
                            $scope.taxSlipObj.selYear = ''
                            $ionicLoading.hide()
                        });
            }
            else
            {
                $ionicLoading.hide()
                uri = baseURL + "/api/ctc/taxSlip/exportTaxForecast.spr?empId=" + $scope.empId + "&f_year=" + $scope.taxSlipObj.selYear + "&month=" + $scope.taxSlipObj.selMonth;
                if (window.XMLHttpRequest)
                {
                    var oReq = new XMLHttpRequest();
                    oReq.open("GET", uri);
                    oReq.send();
                    oReq.onload = function () {
                        if (oReq.status == "406" || oReq.status != "200") {
                            showAlert("", "Taxslip is not available");
                        }
                        else {
                            var ref = cordova.InAppBrowser.open(uri, '_blank', 'location=yes,toolbarposition=top');
                        }
                    };
                }
                $scope.taxSlipObj.selMonth = ''
                $scope.taxSlipObj.selYear = ''
            }
        }
    };
	
	
 $scope.goPaySlip = function(){
	 
	 if ($scope.validateInput() == "false")
	 {
		 return;
	 }
	 
	 var empId = $scope.empId
    	var type = $scope.getSelectedType();
    	var f_year = $scope.getSelectedYear();
    	var month = document.getElementById("monthId").value;
    	var yeartext=$("#yearId option:selected").text();
    	var monthText=$("#monthId option:selected").text();
		
		var fd = new FormData()
		fd.append("empId",empId)
		fd.append("f_year",f_year)
		fd.append("month",month)
		fd.append("type",type)
    	
   	
    	if(document.getElementById("typeId").value == -1)
	  	{
			showAlert("Please select Remuneration Type");
			return;
	  	}
    	
    	if(document.getElementById("typeId").value != 4) {
    		if(document.getElementById("monthId").value == -1)
    	  	{
    			showAlert("Please select Month");
    			return;
    	  	}	
    	}
    	
	  	if(document.getElementById("yearId").value == -1)
		{
	  		showAlert("Please select Financial Year");
		  return;
		}
		//{'empId': empId,'f_year':f_year,'month':month, 'type':type},
		$.ajax({
				url: (baseURL + '/api/ctc/paySlip/validatePaySlip.spr'),
				data: fd,
				type: 'POST',
				async:false,
				contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
				processData: false, // NEEDED, DON'T OMIT THIS
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                 },
		        success:function(result){
		        	if(result.result=="true"){
		        		$scope.submitForm(empId,f_year,month,type,yeartext,monthText)
					}else{
	           			if(type == "1") {
	           				showAlert("Pay slip is not generated for the month of "+monthText+" "+yeartext);
	           			} else if(type == "2"){
	           				showAlert("Gross break is not generated for the month of "+monthText+" "+yeartext);
	           			} else if(type == "3"){
	           				showAlert("Traces is not generated for the month of "+monthText+" "+yeartext);
	           			} else if(type == "4" || type == "7"){
	           				showAlert("Form16 is not generated for the year of "+yeartext);
	           			} else if(type == "5"){
	           				showAlert("Form16(B) is not generated for the month of "+monthText+" "+yeartext);
						} else if(type == "6"){
	           				showAlert("Tax Forecast is not generated for the month of "+monthText+" "+yeartext);
	           			}else if(type == "8"){
                            showAlert("EA pin is not generated for the month of "+monthText+" "+yeartext);
                        }
	           			
	           		}
	            },
		        error: function(err) {
					alert(err.status)
		        }
		    });
    }
    
    $scope.sendPaySlipOnMail = function(){
		
		if ($scope.validateInput() == "false")
		{
			return;
		}
    	var empId = $scope.empId;
    	var type = $scope.getSelectedType();
    	var f_year = $scope.getSelectedYear();
    	var month = document.getElementById("monthId").value;
    	var yeartext=$("#yearId option:selected").text();
    	var monthText=$("#monthId option:selected").text();
		
		var fd = new FormData()
		fd.append("empId",empId)
		fd.append("f_year",f_year)
		fd.append("month",month)
		fd.append("type",type)

    	
    	if(document.getElementById("typeId").value == -1)
	  	{
			showAlert("Please select Type");
			return;
	  	}
		if(document.getElementById("monthId").value == -1)
	  	{
			showAlert("Please select Month");
			return;
	  	}
	  	if(document.getElementById("yearId").value == -1)
		{
	  		showAlert("Please select Year");
		  return;
		}
	  	$.ajax({
				url: (baseURL + '/api/ctc/paySlip/sendPaySlipOnMail.spr'),
				data: fd,
				type: 'POST',
				async:false,
				contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
				processData: false, // NEEDED, DON'T OMIT THIS
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                 },
	        success:function(result){	   
	        if (!(result.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(result.clientResponseMsg,"myPaySlipRemuService")
				showAlert("Something went wrong. Please try later.");
				return
			}
           			showAlert(result.msg);
            },
	        error: function(err) {
					showAlert("Something went wrong. Please try later.")
	        	  console.log("Error in sending by email " + err.status)
	        }
	    });	  	  	
    }

	$scope.hideDiv = function ()	{
	   
	
	   var type = $scope.getSelectedType()
	   if(type == 4 || type == 7 || type == 8){
		   $("#monthDiv").hide();
		   $("#yearDiv").show();
	   }
	   else {
		   $("#monthDiv").show();
		   $("#mailNotSend").show();
		   $("#yearDiv").show();
	   }
   }

$scope.submitForm = function (empId,f_year,month,type,yeartext,monthText)	{
	var fd = new FormData()
		fd.append("empId",empId)
		fd.append("f_year",f_year)
		fd.append("month",month)
		fd.append("type",type)
		fd.append("yeartext",yeartext)
		fd.append("monthText",monthText)
		
      		if(type == "1"){
      			showAlert("Payslip is password protected, please use your Date of Birth (ddmmyyyy) as password to open the payslip");
       		}
	$.ajax({
				url: (baseURL + '/api/ctc/paySlip/exportPaySlipMobile.spr'),
				data: fd,
				type: 'POST',
				async:false,
				contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
				processData: false, // NEEDED, DON'T OMIT THIS
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                 },
		        success:function(result){
				if (result.isFileAvailable=="true"){
					$scope.FileParmsObject = {}
					$scope.FileParmsObject.uploadFile = result.uploadFile
					$scope.FileParmsObject.uploadContentType = result.uploadContentType
					$scope.FileParmsObject.uploadFileName = result.uploadFileName
					
					$scope.downloadAttachmnent($scope.FileParmsObject)
				}
				else{
					showAlert("No file found");
				}
				$ionicLoading.hide()

					
				},
		        error: function(err) {
					showAlert("Something went wrong. Please try later. err:" + err.status)
					console.log("Error in downloading document " + err.status)
		        }
	});
}


	$scope.downloadAttachmnent = function (travel){

		var strData=travel.uploadFile
		//var strUrlPrefix='data:"application/pdf;base64,'
		var strUrlPrefix='data:'+ travel.uploadContentType +";base64,"
		var url=strUrlPrefix + strData
		var blob = base64toBlob(strData,travel.uploadContentType)
		downloadFileFromData(travel.uploadFileName,blob,travel.uploadContentType)
		event.stopPropagation();
	}

$scope.validateInput = function(){
	
		var empId = $scope.empId;
    	var type = $scope.getSelectedType();
    	var f_year = $scope.getSelectedYear();
    	var month = document.getElementById("monthId").value;
    	var yeartext=$("#yearId option:selected").text();
    	var monthText=$("#monthId option:selected").text();
		
		if (type == -1){
			showAlert("Please select Remuneration type.")		
			return "false"
		}
		if (f_year == -1){
			showAlert("Please select year.")		
			return "false"
		}
		if (!(type == 4  || type ==7 || type == 8)){
			if (month=="")
			{
				showAlert("Please select month.")		
				return "false"
			}
		}
		
	return "true";
}
});