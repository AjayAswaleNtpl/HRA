/*
 1.This controller is used for applying Od-Application.
 */

mainModule.factory("getShiftTime", function ($resource) {
    return $resource((baseURL + '/api/odApplication/getShiftTime.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("validateService", function ($resource) {
    return $resource((baseURL + '/api/odApplication/validate.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("getAttRuleSetYN", function ($resource) {
    return $resource((baseURL + '/api/odApplication/isAttRuleSet.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});



mainModule.controller('odApplicationCtrl', function ($scope, $rootScope,$ionicHistory, $ionicPopup, odErrorHandlerService, commonService, getSetService, validateService, $state, $http,
 $q, $filter, $ionicLoading, getShiftTime,$ionicNavBarDelegate,$timeout,getAttRuleSetYN) {

	$rootScope.navHistoryPrevPage="requestODList"
	//$rootScope.navHistoryCurrPage="od_application"
	//$rootScope.navHistoryPrevTab="OD"
	$rootScope.reqestPageLastTab = "OD"


    $scope.resultObj = {}
    $scope.resultSaveObj = {}
    $scope.currDate = new Date()
    $scope.validateDataBuffer = {}
    $scope.resultObj.empId = sessionStorage.getItem('empId');
    $scope.fDate = new Date()
    $scope.tDate = new Date()
	$scope.selectedFileNameFromDevice = ""
	
	
	if  ($rootScope.app_product_name =="QUBE"){
		//if product is qube
		$scope.fileUploadFeatureIncluded = 'false'
		$scope.editODFeature = 'false'
	}
	else{
		if ($rootScope.myAppVersion>=15){
		
			$scope.editODFeature = 'true'
			$scope.fileUploadFeatureIncluded = 'true'
		}else{
			
			$scope.editODFeature = 'false'
			$scope.fileUploadFeatureIncluded = 'false'
		}
	}
	
	if ($rootScope.myAppVersion>=20){
		$scope.showPunchDetailsFeature='true'
	}else{
		$scope.showPunchDetailsFeature='false'
	}

	if ( getMyHrapiVersionNumber() >= 30){
		$scope.utf8Enabled = 'true'    
	}else{
		$scope.utf8Enabled = 'false'    
	}
	
	$scope.selectedValues = {}
	
	//takee
	$scope.SelectedFile = function(){
		
		var imgcontrolName= "showImg"
		var image = document.getElementById(imgcontrolName);
		image.src=""
		image.style.visibility="hidden"
		$scope.imageData = $scope.fileChange()
		

	}



    $scope.init = function () {
		
        var odMenuInfo = getMenuInformation("Attendance Management", "OD Application");
        $scope.resultObj.menuId = odMenuInfo.menuId;
        $scope.resultObj.leaveODFromDate = '';
        $scope.resultObj.leaveODToDate = '';
		
//        $scope.resultObj.year = "" + new Date().getFullYear();
        $scope.resultObj.buttonRights = 'Y-Y-Y-Y';
		
		$scope.radioTypeSelected = ""
		

		$scope.checkAttRuleSett()
		
        if (!angular.equals({}, getSetService.get())) {
            $scope.result = getSetService.get()
            if ($scope.result.selectedCalDate) {
                $scope.resultObj.leaveODFromDate = $filter('date')($scope.result.selectedCalDate, 'dd/MM/yyyy');
                $scope.resultObj.leaveODToDate = $filter('date')($scope.result.selectedCalDate, 'dd/MM/yyyy');
                $scope.resultObj.year = $scope.result.year;
				$scope.resultObj.leaveODFromDate = $scope.resultObj.leaveODToDate
				$scope.fillInTimesInCaseOfAutoDateFill()
            }
        }
		
		////////////// if edit then /////
		if ($rootScope.dataExchForODEdit=='true' && $scope.editODFeature=='true'){

			
			$ionicLoading.show()
			$scope.tmpObj = {}
			$scope.tmpObj.menuId= $scope.resultObj.menuId
			$scope.tmpObj.odId= $rootScope.dataExchOdId
			$scope.tmpObj.code= $rootScope.dataExchStatus
			$scope.tmpObj.buttonRights= $scope.resultObj.buttonRights
			
				$http({
                    url: (baseURL + '/api/odApplication/editODApplication.spr'),
                    method: 'POST',
                    timeout: commonRequestTimeout,
					transformRequest: jsonTransformRequest,
                    data: $scope.tmpObj,
                    headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization': 'Bearer ' + jwtByHRAPI
						}
                }).success(function (success) {
                            if (!(success.clientResponseMsg=="OK")){
								console.log(success.clientResponseMsg)
								handleClientResponse(success.clientResponseMsg,"getAttRuleSetYN")
								$ionicLoading.hide()
								showAlert("Something went wrong. Please try later.")
								$ionicNavBarDelegate.back();
								return
							}	
					
					$scope.resultObj.leaveODFromDate = success.travelDate
					$scope.resultObj.leaveODToDate = success.travelDate_new
					$scope.resultObj.year = success.financialYear
					
					
					$scope.resultObj.fromPlace =success.fromPlace
					$scope.resultObj.toPlace =success.toPlace
					$scope.resultObj.remarks =success.remarks
					$scope.resultObj.purpose = success.purpose
					$scope.resultObj.inTime = success.fromTime
					$scope.resultObj.outTime = success.toTime
					$scope.resultObj.uploadFile = success.uploadFile
					$scope.resultObj.uploadFileName = success.uploadFileName
					$scope.resultObj.uploadContentType = success.uploadContentType
					
							

                    }).error(function (status) {
                    autoRetryCounter = 0
                    $scope.data = {status: status};
                    commonService.getErrorMessage(data);
                    $ionicLoading.hide()
                })		
				
				return;
		}
		
		////////////////////////////
		
		/*
		$scope.resultObj.leaveODFromDate = "24/11/2019";
		$scope.resultObj.leaveODToDate = "24/11/2019"
		$scope.resultObj.year = 2019;
		$scope.resultObj.leaveODFromDate = $scope.resultObj.leaveODToDate
		$scope.fillInTimesInCaseOfAutoDateFill()
		$scope.resultObj.fromPlace ="fp"
		$scope.resultObj.toPlace ="tp"
		$scope.resultObj.remarks ="user rema"
		$scope.resultObj.purpose = "Training"
		*/
		
    }
	
	
	
			
				
	
	/*
    $scope.getShiftTimeOnLoad = function () {
        if (!angular.equals({}, getSetService.get())) {
            $scope.result = getSetService.get()
            if ($scope.result.selectedCalDate) {
                $scope.resultObj.leaveODFromDate = $filter('date')($scope.result.selectedCalDate, 'dd/MM/yyyy');
                $scope.resultObj.leaveODToDate = $filter('date')($scope.result.selectedCalDate, 'dd/MM/yyyy');
		}
		}
			$ionicLoading.show();
            $scope.getShiftTime = new getShiftTime();
            $scope.getShiftTime.$save({travelDate: $scope.resultObj.leaveODFromDate}, function (success) {
				if (success.odApplicationVoList.length==0 ) {
					$timeout( function(){
						$ionicLoading.hide();
						$ionicNavBarDelegate.back();
						showAlert("Shift is not assigned!");
					}, 1000 );
					
					return false;
				}
                if (success.odApplicationVoList[0].fromTime != null ) {
                    $scope.resultObj.inTime = success.odApplicationVoList[0].fromTime;
                    $scope.resultObj.outTime = success.odApplicationVoList[0].toTime;
                    $scope.emptyObject = {}
                    getSetService.set($scope.emptyObject);
                    $ionicLoading.hide();
					return true;
                }
                else {
                    $ionicLoading.hide();
                    showAlert("Shift is not assigned!");
					$ionicNavBarDelegate.back();
					return false;
                }
            }, function (data) {
                autoRetryCounter = 0
                $ionicLoading.hide()
                commonService.getErrorMessage(data);
				return false;
            });
        }
		*/
	
	
    $scope.checkAttRuleSett = function () {
			$ionicLoading.show();
			$scope.reqObject = {}
	        //var attendanceMenuInfo = getMenuInformation("Leave Management", "Leave Application");
			//$scope.reqObject.menuId = attendanceMenuInfo.menuId;
			$scope.reqObject.menuId = $scope.resultObj.menuId
            $scope.getAttRuleSetYN = new getAttRuleSetYN();
            $scope.getAttRuleSetYN.$save($scope.reqObject, function (success) {
				if (!(success.clientResponseMsg=="OK")){
					console.log(success.clientResponseMsg)
					handleClientResponse(success.clientResponseMsg,"getAttRuleSetYN")
				}	
				
				$ionicLoading.hide();
				if (success.msg=="false" ) {
					$timeout( function(){
						$ionicLoading.hide();
						$ionicNavBarDelegate.back();
						showAlert("Attendance Rule not Set!");
					}, 1000 );
					return ;
				}else if (success.msg=="" ) {
					$timeout( function(){
						$ionicLoading.hide();
						$ionicNavBarDelegate.back();
						showAlert("Something went wrong!");
					}, 1000 );
					return ;
					
				}else if (success.msg=="true" ) {
					//do nothing
				}

            }, function (data) {
                autoRetryCounter = 0
                $ionicLoading.hide()
                commonService.getErrorMessage(data);
				return;
            });
	}
	
	
	$scope.setInTime = function () {
        var date = new Date();
        if ($scope.resultObj.inTime == undefined)
        {
//            $scope.resultObj.inTime = "";
        }
        else {
            var timePart = $scope.resultObj.inTime.split(':');
            date.setHours(timePart[0]);
            date.setMinutes(timePart[1]);
        }
        var options = {date: date, mode: 'time', titleText: 'In Time', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {
                // nothing to do.
            }
            else {
                $scope.resultObj.inTime = $filter('date')(date, 'HH:mm');
                $scope.fromTimeObj = date
                $scope.$apply();
            }
        })
    }
	
    $scope.setOutTime = function () {
        var date = new Date();
        if ($scope.resultObj.outTime == undefined)
        {
			//            $scope.resultObj.outTime = "";
        }
        else {
            var timePart = $scope.resultObj.outTime.split(':');
            date.setHours(timePart[0]);
            date.setMinutes(timePart[1]);
        }
        var options = {date: date, mode: 'time', titleText: 'Out Time', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {
                //Nothing to do.
            }
            else {
                $scope.resultObj.outTime = $filter('date')(date, 'HH:mm');
                $scope.$apply();
            }
        })
    }

	
    $scope.setFromDate = function () {
		
        var date;
        if ($scope.resultObj.leaveODFromDate == undefined)
        {
            $scope.resultObj.leaveODFromDate = "";
        }

        if ($scope.resultObj.leaveODFromDate != "") {
            var parts = $scope.resultObj.leaveODFromDate.split('/');

            $scope.fDate = new Date(parts[2], parts[1] - 1, parts[0]);

        }
        if ($scope.fDate == null) {
            date = new Date();
        }
        else {
            date = $scope.fDate;
        }

        var options = {date: date, mode: 'date', titleText: 'From Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {
                //Nothing to do.
            }
            else {
                $scope.fDate = date
                $scope.resultObj.year = date.getFullYear();
                $scope.resultObj.leaveODFromDate = $filter('date')(date, 'dd/MM/yyyy');
                if ($scope.resultObj.leaveODToDate)
                {
                    var compTime = $scope.tDate.getTime() - date.getTime();
                    if (compTime < 0) {
                        $scope.resultObj.leaveODFromDate = $filter('date')(date, 'dd/MM/yyyy');
                        showAlert("Set from date", "From date cannot be greater than to date")
                        $scope.resultObj.leaveODToDate = ''
                        return
                    }
                }
                $scope.resultObj.leaveODFromDate = $filter('date')(date, 'dd/MM/yyyy');
                $scope.getShiftTime = new getShiftTime();
                $scope.getShiftTime.$save({travelDate: $scope.resultObj.leaveODFromDate}, function (success) {
					
				if ( (success.odApplicationVoList===undefined ) ){	
					showAlert("Shift is not assigned!");
					$ionicLoading.hide();
					$ionicNavBarDelegate.back();
					return;
				}else if (success.odApplicationVoList.length==0 ) {
					showAlert("Shift is not assigned!");
					$ionicLoading.hide();
					$ionicNavBarDelegate.back();
					return;
				}else if(success.odApplicationVoList[0].fromTime == null){
					$ionicLoading.hide();
                    showAlert("Shift is not assigned!");
					$ionicNavBarDelegate.back();
					return;
				}
			
                    $ionicLoading.hide()
                    $scope.resultObj.inTime = success.odApplicationVoList[0].fromTime;
                    $scope.resultObj.outTime = success.odApplicationVoList[0].toTime;
				
                }, function (data) {
                    autoRetryCounter = 0
                    $ionicLoading.hide()
                    commonService.getErrorMessage(data);
                })
                $scope.$apply();
			}
			
        }, function (error) {
        });
		
	}
	
	
	
    $scope.setToDate = function () {
        var date;
        if ($scope.resultObj.leaveODToDate == undefined)
        {
            $scope.resultObj.leaveODToDate = "";
        }
        if ($scope.resultObj.leaveODToDate != "") {
            var parts = $scope.resultObj.leaveODToDate.split('/');
            $scope.tDate = new Date(parts[2], parts[1] - 1, parts[0]);
        }
        if ($scope.tDate == null) {
            date = new Date();
        }
        else {
            date = $scope.tDate;
        }
        $scope.DiffDays = {}
        var options = {date: date, mode: 'date', titleText: 'To Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {
                //nothing to do.
            }
            else {
                $scope.tDate = date
                if ($scope.resultObj.leaveODFromDate)
                {
                    $scope.resultObj.leaveODToDate = $filter('date')(date, 'dd/MM/yyyy');
                    if ($scope.resultObj.leaveODFromDate > $scope.resultObj.leaveODToDate) {
                        showAlert("Set to date", "From date cannot be greater than to date")
                        return;
                    }
                    $scope.resultObj.leaveODToDate = ''
                    $scope.timeDiff = Math.abs($scope.tDate.getTime() - $scope.fDate.getTime());
                    $scope.DiffDays = Math.ceil($scope.timeDiff / (1000 * 3600 * 24));
                    $scope.resultObj.leaveODToDate = $filter('date')(date, 'dd/MM/yyyy');
					
					frmDt = $scope.resultObj.leaveODFromDate
					toDt = $scope.resultObj.leaveODToDate
					if ($scope.showPunchDetailsFeature=='true'){	
						$scope.getPunches(frmDt,toDt,$scope.resultObj.empId,'','')
					}
					
                    $scope.$apply();
                }
                else
                {
                    showAlert("Set to date", "Please select from date first")
                    return
                }
            }
        }
        , function (error) {
        });
    }
	
	
	
	$scope.getMultiPartFile = function(imageData,empId,menuId,code,level,year,buttonRights,odApplicationVoList){

		var boundary = 'somethingABCD';
			  $scope.formData = "boundary=" + boundary ;
			  $scope.formData += '--' + boundary + '\r\n'
			  $scope.formData += 'Content-Disposition: form-data; name="file"; filename="' + "img_abcd" + '\r\n';
			  $scope.formData += 'Content-Type: ' + 'image/jpeg' + '\r\n\r\n';
			  $scope.formData += imageData
			  $scope.formData += '\r\n';
			  $scope.formData += '--' + boundary + '\r\n';
			  $scope.formData += 'Content-Disposition: form-data; name="empId"\r\n\r\n';
			  $scope.formData += empId + '\r\n'
			  $scope.formData += '--' + boundary + '\r\n';
			  $scope.formData += 'Content-Disposition: form-data; name="menuId"\r\n\r\n';
			  $scope.formData += menuId + '\r\n'
			  $scope.formData += '--' + boundary + '--\r\n';
			  
			  return $scope.formData;
			  
					
	}

	$scope.removeAttachment = function (){
		var confirmPopup = $ionicPopup.confirm({
						title: alert_header,
					template: 'Do you want to remove image?', //Message
					});
					confirmPopup.then(function (res) {
						if (res) {
							var imgcontrolName= "showImg"
							var image = document.getElementById(imgcontrolName);
							image.src=""
							image.style.visibility="hidden"
				}
					});	
	}
	//takee
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
			//var thisResult = JSON.parse(imageData);
            // convert json_metadata JSON string to JSON Object 
            //var metadata = JSON.parse(thisResult.json_metadata);
           // image.src = "data:image/jpeg;base64," + thisResult.filename;
           // $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;

			//image.src = "data:image/jpeg;base64," + imageData;
		//	$scope.imageData = "data:image/jpeg;base64," + imageData;
			
			
			
			
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
			//var thisResult = JSON.parse(imageData);
            // convert json_metadata JSON string to JSON Object 
            //var metadata = JSON.parse(thisResult.json_metadata);
           // image.src = "data:image/jpeg;base64," + thisResult.filename;
           // $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;

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
	

	
    $scope.sendConform = function (status) {
			//take
			if ($scope.fileUploadFeatureIncluded=='true' && document.getElementById('inputFileUpload').files[0]){
				$scope.imageData = $scope.fileChange()
			}
			
		// if edit mode
			if ($rootScope.dataExchForODEdit=='true' && $scope.editODFeature=='true'){

			$ionicLoading.show()
			$scope.tmpObj = {}
			$scope.tmpObj.menuId= $scope.resultObj.menuId
			$scope.tmpObj.buttonRights= $scope.resultObj.buttonRights
			$scope.tmpObj.odId= $rootScope.dataExchOdId
			$scope.tmpObj.status = "SENT FOR APPROVAL"
			$scope.tmpObj.travel= $scope.resultObj.leaveODFromDate
			$scope.tmpObj.year= $scope.resultObj.year
			
			
			$scope.tmpObj.odApplicationVoList = []
			
			
			$scope.voObject = {}
			$scope.voObject.travelDate = $scope.resultObj.leaveODFromDate
			$scope.voObject.travelDate_new = $scope.resultObj.leaveODToDate
			$scope.voObject.financialYear = $scope.resultObj.year
			$scope.voObject.fromPlace = $scope.resultObj.fromPlace
			$scope.voObject.toPlace = $scope.resultObj.toPlace
			$scope.voObject.remarks = $scope.resultObj.remarks
			$scope.voObject.purpose = $scope.resultObj.purpose
			$scope.voObject.fromTime = $scope.resultObj.inTime
			$scope.voObject.toTime = $scope.resultObj.outTime
			$scope.voObject.odID = $rootScope.dataExchOdId
			
			$scope.tmpObj.odApplicationVoList.push($scope.voObject)


			/////////////////////////////////////////
				$scope.resultSaveObj.empId = parseInt(sessionStorage.getItem('empId'));
                $scope.resultSaveObj.menuId = $scope.resultObj.menuId
                $scope.resultSaveObj.code = status;
                $scope.resultSaveObj.level = 1
                $scope.resultSaveObj.year = $scope.resultObj.year
                $scope.resultSaveObj.buttonRights = $scope.resultObj.buttonRights
                
                $scope.resultSaveObj.odApplicationVoList = $scope.tmpObj.odApplicationVoList
                
				if ($scope.fileUploadFeatureIncluded == 'true')	{
						//take the file stream from file.
						$scope.jsonList =  JSON.stringify($scope.resultSaveObj.odApplicationVoList[0]);
						
					var formData = new FormData();
					formData.append('empId', parseInt(sessionStorage.getItem('empId')));
					formData.append('menuId', parseInt($scope.resultObj.menuId));
					formData.append('code', status);
					formData.append('level', 1);
					formData.append('year', $scope.resultObj.year);
					formData.append('buttonRights',  $scope.resultObj.buttonRights);
					formData.append('odApplicationVoList', $scope.jsonList);
					
					// Attach file
					//1. check file input tag has selected file.
					//2. check if image that is from camera pic is avlbl
					
					//takee
					if (document.getElementById('inputFileUpload').files[0] ){
						
						var base64result = $scope.imageData.split(',')[1];
						$scope.fileUploadName = document.getElementById('inputFileUpload').files[0].name
						$scope.fileUploadType = document.getElementById('inputFileUpload').files[0].type
						
						var blob = base64toBlob(base64result, $scope.fileUploadType,$scope.fileUploadName)
						formData.append('file', blob,$scope.fileUploadName)
						
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
						formData.append('file', blob,$scope.fileUploadName)
						
					}
				}
			//////////////////////////////////////////
		
				$http({
                    url: (baseURL + '/api/odApplication/send.spr'),
                    method: 'POST',
                    timeout: commonRequestTimeout,
					transformRequest: jsonTransformRequest,
                    data: formData,
                    headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization': 'Bearer ' + jwtByHRAPI
						}
                }).success(function (success) {
                            if (!(success.clientResponseMsg=="OK")){
								console.log(success.clientResponseMsg)
								handleClientResponse(success.clientResponseMsg," odapplication send")
								$ionicLoading.hide()
								showAlert("Something went wrong. Please try later.")
								$ionicNavBarDelegate.back();
								return
							}	
							$ionicLoading.hide()
							showAlert(success.msgAuto);
							$scope.redirectOnBack()

                        }).error(function (status) {
                    autoRetryCounter = 0
                    $scope.data = {status: status};
                    commonService.getErrorMessage(data);
                    $ionicLoading.hide()
                })		
				
				return;
			}
		
		/////////////////	 
			 
        if (status == 'SENT FOR APPROVAL') {
            $scope.requestState = 'Send for Approval'
        } else {
            $scope.requestState = 'Save'
        }
		if ($scope.resultObj.leaveODFromDate == $scope.resultObj.leaveODToDate){
			if ($scope.resultObj.outTime < $scope.resultObj.inTime)
			{
				showAlert("", "In time cannot be greater than Out time")
				return;
			}
		}
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure',
            template: 'Do you want to ' + $scope.requestState + ' ?', //Message
        });
        confirmPopup.then(function (res) {
            if (res) {
                $scope.save(status)
                return
            } else {
                return;
            }
        });
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
	
	
    $scope.save = function (status) {
		
        $ionicLoading.show({
        });

        $scope.odApplicationVoList = [];
        $scope.saveOrSendapprovalData = {};
        $scope.validateDataBuffer.travelDate = $scope.resultObj.leaveODFromDate;
        $scope.validateDataBuffer.fromPlace = $scope.resultObj.fromPlace;
        $scope.validateDataBuffer.fromTime = $scope.resultObj.inTime;
        $scope.validateDataBuffer.toPlace = $scope.resultObj.toPlace;
        $scope.validateDataBuffer.travelDate_new = $scope.resultObj.leaveODToDate;
        $scope.validateDataBuffer.toTime = $scope.resultObj.outTime;
        $scope.validateDataBuffer.purpose = $scope.resultObj.purpose;
        $scope.validateDataBuffer.remarks = $scope.resultObj.remarks;
        $scope.validateDataBuffer.menuId = parseInt($scope.resultObj.menuId)
        $scope.validateDataBuffer.year = $scope.resultObj.year
        $scope.validateDataBuffer.buttonRights = $scope.resultObj.buttonRights
        $scope.validateDataBuffer.empId = parseInt(sessionStorage.getItem('empId'));
        $scope.saveOrSendapprovalData.travelDate = $scope.resultObj.leaveODFromDate;
        $scope.saveOrSendapprovalData.fromPlace = $scope.resultObj.fromPlace;
        $scope.saveOrSendapprovalData.fromTime = $scope.resultObj.inTime;
        $scope.saveOrSendapprovalData.toPlace = $scope.resultObj.toPlace;
        $scope.saveOrSendapprovalData.travelDate_new = $scope.resultObj.leaveODToDate;
        $scope.saveOrSendapprovalData.toTime = $scope.resultObj.outTime;
        $scope.saveOrSendapprovalData.purpose = $scope.resultObj.purpose;
        $scope.saveOrSendapprovalData.remarks = $scope.resultObj.remarks;
		if ($scope.utf8Enabled == 'true' ){
			if ($scope.saveOrSendapprovalData.remarks){
				$scope.saveOrSendapprovalData.remarks = encodeURI($scope.saveOrSendapprovalData.remarks)
			}
		}
		
		
		////
		
        $scope.validateService = new validateService();
        $scope.validateService.$save($scope.validateDataBuffer, function (success) {
			if (!(success.clientResponseMsg=="OK")){
				console.log(success.clientResponseMsg)
				handleClientResponse(success.clientResponseMsg,"validateService")
			}
			
            if (success.odApplication.msg) {
                showAlert("Validation error", success.odApplication.msg)
                $ionicLoading.hide()
            }
            if (success.odApplication.msg == '' || success.odApplication.msgFlag == "true") {
                $scope.resultSaveObj.empId = parseInt(sessionStorage.getItem('empId'));
                $scope.resultSaveObj.menuId = parseInt($scope.resultObj.menuId)
                $scope.resultSaveObj.code = status;
                $scope.resultSaveObj.level = 1
                $scope.resultSaveObj.year = $scope.resultObj.year
                $scope.resultSaveObj.buttonRights = $scope.resultObj.buttonRights
                $scope.odApplicationVoList.push($scope.saveOrSendapprovalData);
                $scope.resultSaveObj.odApplicationVoList = $scope.odApplicationVoList
                
				if ($scope.fileUploadFeatureIncluded == 'true')	{
						//take the file stream from file.
						$scope.jsonList =  JSON.stringify($scope.resultSaveObj.odApplicationVoList[0]);
						
					var formData = new FormData();
					formData.append('empId', parseInt(sessionStorage.getItem('empId')));
					formData.append('menuId', parseInt($scope.resultObj.menuId));
					formData.append('code', status);
					formData.append('level', 1);
					formData.append('year', $scope.resultObj.year);
					formData.append('buttonRights',  $scope.resultObj.buttonRights);
					formData.append('odApplicationVoList', $scope.jsonList);
					
					// Attach file
					//1. check file input tag has selected file.
					//2. check if image that is from camera pic is avlbl
					
					//takee
					if (document.getElementById('inputFileUpload').files[0] ){
						
						var base64result = $scope.imageData.split(',')[1];
						$scope.fileUploadName = document.getElementById('inputFileUpload').files[0].name
						$scope.fileUploadType = document.getElementById('inputFileUpload').files[0].type
						
						var blob = base64toBlob(base64result, $scope.fileUploadType,$scope.fileUploadName)
						formData.append('file', blob,$scope.fileUploadName)
						
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
						formData.append('file', blob,$scope.fileUploadName)
						
					}
				
				
				$.ajax({
				url: baseURL + '/api/odApplication/saveWithFile.spr',
				data: formData,
				type: 'POST',
				timeout: commonRequestTimeout,
				contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
				processData: false, // NEEDED, DON'T OMIT THIS
				headers: {
					'Authorization': 'Bearer ' + jwtByHRAPI
				 },
				success : function(result) {
					if (!(success.clientResponseMsg=="OK")){
								console.log(success.clientResponseMsg)
								handleClientResponse(success.clientResponseMsg,"saveWithFile")
								$ionicLoading.hide()
								showAlert("Something went wrong. Please try later.")
								$ionicNavBarDelegate.back();
								return
							}	
							$ionicLoading.hide()
							showAlert(result.msg)
							$scope.redirectOnBack()
				}
				
				});
			
	}else{
				  //fileupload feature not there
				  $http({
                    url: (baseURL + '/api/odApplication/save.spr'),
                    method: 'POST',
                    timeout: commonRequestTimeout,
					transformRequest: jsonTransformRequest,
                    data: $scope.resultSaveObj,
                    headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization': 'Bearer ' + jwtByHRAPI
						}
                }).success(function (response) {
                            if (response.ErrorMessage == "" || response.ErrorMessage == undefined) {
                                showAlert(response.msg);
                            } else {
                                //showAlert(response.ErrorMessage);
								showAlert("Something went wrong. Please try later.");
                            }
                            //$scope.resultSaveObj.check = "OD";
                            //getSetService.set($scope.resultSaveObj)
							$scope.redirectOnBack()
                            //$ionicNavBarDelegate.back();
                        }).error(function (status) {
                    autoRetryCounter = 0
                    $scope.data = {status: status};
                    commonService.getErrorMessage(data);
                    $ionicLoading.hide()
                })
			  }
}
		
});
	}

	
	
    $scope.redirectOnBack = function () {
		$rootScope.dataExchForODEdit='false'
		$scope.resultSaveObj={}
		//$ionicNavBarDelegate.back();
		$state.go('requestODList')
		//$state.go('app.RequestList')
		//$ionicNavBarDelegate.back();
		
        //$scope.resultSaveObj.check = "OD";
        //getSetService.set($scope.resultSaveObj)
        //$state.go('app.RequestList')
    }
	
	
	
		$scope.fillInTimesInCaseOfAutoDateFill = function() {
                $scope.getShiftTime = new getShiftTime();
                $scope.getShiftTime.$save({travelDate: $scope.resultObj.leaveODFromDate}, function (success) {
					
				if ( (success.odApplicationVoList===undefined ) ){	
					showAlert("Shift is not assigned!");
					$ionicLoading.hide();
					$ionicNavBarDelegate.back();
					return;
				}else if (success.odApplicationVoList.length==0 ) {
					showAlert("Shift is not assigned!");
					$ionicLoading.hide();
					$ionicNavBarDelegate.back();
					return;
				}else if(success.odApplicationVoList[0].fromTime == null){
					$ionicLoading.hide();
                    showAlert("Shift is not assigned!");
					$ionicNavBarDelegate.back();
					return;
				}
			
                    $ionicLoading.hide()
                    $scope.resultObj.inTime = success.odApplicationVoList[0].fromTime;
                    $scope.resultObj.outTime = success.odApplicationVoList[0].toTime;
				
                }, function (data) {
                    autoRetryCounter = 0
                    $ionicLoading.hide()
                    commonService.getErrorMessage(data);
                });		
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


	$scope.getPunches = function(fromDate,toDate,empId,idx,module)
		{
			 
			 var tmfd = new FormData();
			 tmfd.append('fromDate',fromDate)
			 tmfd.append('empId',sessionStorage.getItem('empId'))
			 tmfd.append('toDate',toDate)
			//url: "${pageContext.request.contextPath}/attendance/odApplication/getAppliedOdDetails.spr",
			$.ajax({
				url: baseURL + '/api/signin/getPunchDetails.spr',
				data: tmfd,
				
		            type: 'POST',
		            dataType: 'json',
					timeout: commonRequestTimeout,
					contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
					processData: false, // NEEDED, DON'T OMIT THIS
					headers: {
						'Authorization': 'Bearer ' + jwtByHRAPI
					 },
		            success:function(result1){
						result1.htmlPunchesStr = result1.htmlPunchesStr.replace("<br>", "")
						$scope.punchStr = result1.htmlPunchesStr.replace(/<br>/g, "\n")
						
	                   if (!$scope.$$phase)
						$scope.$apply()				
		           		
		            },
					error : function(res){
						console.log(res.status);
						
					}
		        });
		}
	
    $scope.init();

});
