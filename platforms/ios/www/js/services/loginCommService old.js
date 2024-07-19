mainModule.factory("loginService", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/j_spring_security_check'), {}, {
        'save': {
            method: 'POST',
            timeout: commonRequestTimeout
        }
    }, {});
}]);
mainModule.factory("getLoginDataService", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/eisCompany/getOnLoginData.spr'), {}, {
        'save': {
            method: 'POST',
            timeout: commonRequestTimeout
        }
    }, {});
}]);
mainModule.factory("getDonutDataService", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/homeDashboard/getDoughnutChartData.spr'), {}, {
        'save': {
            method: 'POST'

        }
    }, {});
}]);

mainModule.factory("getCountService", ['$resource', function ($resource) {
    return $resource((baseURL +"/api/portal/viewRequisitionApprovalJson.spr"), {}, {
        'save': {
            method: 'POST'

        }
    }, {});
}]);



mainModule.factory("loginCommService", function ($rootScope, $filter, 
    $ionicPopup, getDonutDataService, $ionicLoading, $state, loginService, 
    getLoginDataService, commonService, ionicLoadingService,getCountService,$http) {
	
	var ref;
	var  loadStartCallBack = function (event) {
	// Close InAppBrowser if loading the predefined close URL
	

		
        if(event.url == $rootScope.myLink+'portal/hrportal.spr')  {
			ref.close();
			//alert("close")
		}
		
        if(event.url == $rootScope.myLink+'portal/hrportal.spr#')  {
			ref.close();
			//alert("close candidate")
			navigator.app.exitApp();
		}
		
          if(event.url.indexOf($rootScope.myLink+'login.spr')>-1)  {
			ref.close();
			//alert("close1 candidate")
			navigator.app.exitApp();
		}
		
        if(event.url == $rootScope.myLink+'portal/login.spr')  {            
			ref.close();
			//alert("close1 candidate")
			navigator.app.exitApp();
		}
	};
	

	getRequisitionApproval=function(){
        if (gb_processTimeRec == "true"){
            console.log("getRequisitionApproval start "+ $filter('date')(new Date(), 'hh:mm:ss'))
        }
        var data={};
        var countServ = new getCountService();
        countServ.$save(data, function (response) {

                requisitionApprovalForm=response;
                var count = 0;
                if(requisitionApprovalForm.listLeaveTrackerVO && requisitionApprovalForm.listLeaveTrackerVO[0])
                   {
                    //$rootScope.gIntLeaveRequestCount = parseInt(requisitionApprovalForm.listLeaveTrackerVO[0].inProcess);
                   }
                
            //    if(listCompOffTrackerVORights == "Comp Off Application")
            //        {
            //         count += parseInt(requisitionApprovalForm.compOfflistLeaveTrackerVO[0].inProcess);
            //        }
                
                if(requisitionApprovalForm.listTransactionTrackerVO && requisitionApprovalForm.listTransactionTrackerVO[0])
                   {
                    $rootScope.gIntTransactionRequestCount = parseInt(requisitionApprovalForm.listTransactionTrackerVO[0].inProcess);
                    //$rootScope.gIntTransactionRequestCount = parseInt(requisitionApprovalForm.listTransactionTrackerVO[0].inProcess);
                   }
                // if(listODTrackerVORights == "OD Application")
                //    {
                //     count += parseInt(requisitionApprovalForm.listODTrackerVO[0].inProcess);
                //    }
                // if(listClaimTrackerVORights == "Claim Form")
                //    {
                //     count +=parseInt(requisitionApprovalForm.listClaimTrackerVO[0].inProcess);
                //    }
                // if(listCtcClaimTrackerVORights == "Claim Form")
                //    {
                //     count +=parseInt(requisitionApprovalForm.listCtcClaimTrackerVO[0].inProcess);
                //    }
                // if(listLtaClaimTrackerVORights == "Claim Form")
                //    {
                //     count +=parseInt(requisitionApprovalForm.listLtaClaimTrackerVO[0].inProcess);
                //    }
                // if(listTravelTrackerVORights == "Travel Application")
                //    {
                //     count +=parseInt(requisitionApprovalForm.listTravelTrackerVO[0].inProcess);
                //    }	
                // if(listMusterTrackerVORights == "My Attendance Record")
                //    {
                //     count +=parseInt(requisitionApprovalForm.listMusterTrackerVO[0].inProcess);
                //    }	
                // if(listShiftChangeTrackerVORights == "Shift Change")
                //    {
                //     count +=parseInt(requisitionApprovalForm.listShiftChangeTrackerVO[0].inProcess);
                //    }	
                // if(listTravelClaimTrackerVORights == "Travel Claim Requisition")
                //    {
                //     count +=parseInt(requisitionApprovalForm.listTravelClaimTrackerVO[0].inProcess);
                //    }
                if (requisitionApprovalForm.listVacancyRequisitionVO.length > 0){
                if(requisitionApprovalForm.listVacancyRequisitionVO[0])
                   {
                    $rootScope.gIntVacancyRequestCount = parseInt(requisitionApprovalForm.listVacancyRequisitionVO[0].inProcess);
                   }
                }

                //pendingCount=parseInt(requisitionApprovalForm.listLeaveTrackerVO[0].inProcess)+parseInt(requisitionApprovalForm.listTransactionTrackerVO[0].inProcess)+parseInt(requisitionApprovalForm.listODTrackerVO[0].inProcess)+parseInt(requisitionApprovalForm.listClaimTrackerVO[0].inProcess)+parseInt(requisitionApprovalForm.listTravelTrackerVO[0].inProcess)+parseInt(requisitionApprovalForm.listMusterTrackerVO[0].inProcess)+parseInt($scope.requisitionApprovalForm.listShiftChangeTrackerVO[0].inProcess)+parseInt($scope.requisitionApprovalForm.listTravelClaimTrackerVO[0].inProcess);
  //	    	  $scope.$apply();
          }, function myError(response) {
              //alert(response)
              console.log(response.data)
          });
          if (gb_processTimeRec == "true"){
            console.log("getRequisitionApproval end "+ $filter('date')(new Date(), 'hh:mm:ss'))
        }
    }

    
    showAlert = function (title, template) {
        $ionicPopup.alert({
            title: title,
            template: template
        });
    };
    var object = {};
    var odApplicationInProcessCount = 0
    var leaveAppliInProcessCount = 0
    var attendRegularInProcessCount = 0
    var shiftChangeCount = 0


	
	
var appAvailability = {
    
    check: function(urlScheme, successCallback, errorCallback) {
        cordova.exec(
            successCallback,
            errorCallback,
            "AppAvailability",
            "checkAvailability",
            [urlScheme]
        );
    },
    
    checkBool: function(urlScheme, callback) {
        cordova.exec(
            function(success) { callback(success); },
            function(error) { callback(error); },
            "AppAvailability",
            "checkAvailability",
            [urlScheme]
        );
    }
    
};



var chcekIfInstalledAppLatest = function (acvList, domainVersion) {
 
 // this method will check if the installed version is latest for the domain
 // if not, it will prompt user to download lateest version
	/*var foundCompatibility = false;
    for (var i = 0; i < acvList.length; i++) {
        if (acvList[i].mobileVersion == appVersion &&
            acvList[i].domainVersion == domainVersion) {
            foundCompatibility = true
            return "COMPATIBLE"
        }
    }
	*/

    
    //find latest appversion for the domain
    compatipleMobileAppVersions = []
    for (var i = 0; i < acvList.length; i++) {


        if (device.platform === 'iOS') {
            if (domainVersion == acvList[i].domainVersion &&
                acvList[i].appStoreBuildId != null) {
                compatipleMobileAppVersions.push(acvList[i])
            }
        }
        if (device.platform === 'Android') {
            if (domainVersion == acvList[i].domainVersion &&
                acvList[i].playStoreBuildId != null) {
                compatipleMobileAppVersions.push(acvList[i])
            }
        }
    }

    if (compatipleMobileAppVersions.length==0){
        return "NO_NEW_VERSION_AVAILABLE"
    }

    //sort to get the latest app for domain
    compatipleMobileAppVersions.sort(dynamicSort("releaseDate"));

    if (device.platform === 'Android') {
        if (compatipleMobileAppVersions[compatipleMobileAppVersions.length - 1].playStoreUrl === undefined) {
            showAlert(alert_header,"This version of app is not supported,\r\nPlease contact app admin.")
            return "NO_NEW_VERSION_AVAILABLE"
        } else {
            sessionStorage.setItem("NEWAPPURL",
                compatipleMobileAppVersions[compatipleMobileAppVersions.length - 1].playStoreUrl)
			sessionStorage.setItem("NEWAPPVER",
                compatipleMobileAppVersions[compatipleMobileAppVersions.length - 1].mobileVersion)	
        }
    }
    if (device.platform === 'iOS') {
        if (compatipleMobileAppVersions[compatipleMobileAppVersions.length - 1].appStoreUrl === undefined) {
            showAlert(alert_header,"This version of app is not supported,\r\nPlease contact app admin.")
            return "NO_NEW_VERSION_AVAILABLE"
        } else {
            sessionStorage.setItem("NEWAPPURL",
                compatipleMobileAppVersions[compatipleMobileAppVersions.length - 1].appStoreUrl)
			sessionStorage.setItem("NEWAPPVER",
                compatipleMobileAppVersions[compatipleMobileAppVersions.length - 1].mobileVersion)	
        }
    }

	//check if the latest version is same as insatlled version if yes do nothing otherwise send 
	// user to download latest version 
	
    if (appVersion ==  compatipleMobileAppVersions[compatipleMobileAppVersions.length - 1].mobileVersion){
		return "YES"
	}
	else{
		return "NO"
	}
}




var checkPrevVerAppAvailable = function (data,i) {
	var avcList=[]
	avcList = data.avcList
		if (avcList[i].mobileVersion != appVersion) {
            if (device.platform === "Android"){
				//avcList[i].playStoreBuildId
                appAvailability.check(avcList[i].playStoreBuildId, function () {
                    // is available
                    sessionStorage.setItem("old_version_build_url", avcList[i].playStoreUrl)
					sessionStorage.setItem("old_version_data", avcList[i])
						$ionicLoading.hide()
                        $state.go('uninstallOldAppVersion')
                    return "AVAILABLE"
                }, function () {
                    // not available
					if (i<avcList.length-1){
						i++;
						return checkPrevVerAppAvailable(data,i)
					}else{
						onLoginData(data.presonalInfo.Gender);
					}
					
                });
            }else if (device.platform==="iOS"){
                appAvailability.check(avcList[i].appStoreBuildId, function () {
                    // is available
                    sessionStorage.setItem("old_version_build_url", avcList[i].appStoreUrl)
                    return "AVAILABLE"
                }, function () {
					if (i<avcList.length-1){
						i++;
						return checkPrevVerAppAvailable(data,i)
					}else{
						onLoginData(data.presonalInfo.Gender);
					}
                });
            }
        }else{
					// this build is itself
					if (i<avcList.length-1){
						i++;
						return checkPrevVerAppAvailable(data,i)
					}else if (i ==avcList.length-1){
						//this is last element
						onLoginData(data.presonalInfo.Gender);
					}
		}



/*
    for (var i = 0; i < avcList.length; i++) {
		
        if (avcList[i].mobileVersion != appVersion) {

            if (device.platform === "Android"){
				//avcList[i].playStoreBuildId
                appAvailability.check('com.neterson.hralign91_6', function () {
                    // is available
					alert("111")
                    sessionStorage.setItem("old_version_build_url", avcList[i].playStoreUrl)
                    return "AVAILABLE"
                }, function () {
                    // not available
                });
            }else if (device.platform==="iOS"){
                appAvailability.check(avcList[i].appStoreBuildId, function () {
                    // is available
                    sessionStorage.setItem("old_version_build_url", avcList[i].appStoreUrl)
                    return "AVAILABLE"
                }, function () {
                    // not available
                });
            }
        }
    }*/
	
    return "NOTAVAILABLE"
}


var saveGeoTrackingConsent = function (empId,empCode,if_agreed) {
	var fd = new FormData();
	
	fd.append("gtcId", 0);
	fd.append("empId", empId);
	fd.append("empCode",empCode);
	fd.append("if_agreed", if_agreed);
	

	
	$.ajax({
		url: baseURL + '/api/signin/saveGeoTrackingConsent.spr',
		data: fd,
		processData: false,
		contentType: false,
		type: 'POST',
		success: function (success) {
			if (success.clientResponseMsg != "OK") {
				console.log(" Consent Saving error : " + success.clientResponseMsg)
				return "false"
			} else {
				console.log( " Consent saved")
				return "true"
			}


		},
		error(err) {
			$ionicLoading.hide()
			console.log("GTC saving error")
		}
	});
}





var getGeoTrackingConsent =  function (empId) {
    var fd = new FormData();
	fd.append("empId",empId)
    
    $.ajax({
      url: baseURL + '/api/signin/getGeoTrackingConsent.spr',
      data: fd,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (success) {
        if (success.clientResponseMsg != "OK") {
          //console.log(ptime + " Location Saving error : " + success.clientResponseMsg)
        } else {
          //console.log(ptime + " Location saved")
          //alert("data got: " + success.listGTPojo.length)
		  if (success.listGTCPojo.length == 0){
            getGeoTrackingConsentMatter();
            
            
		    //        var confirmPopup = $ionicPopup.confirm({
            //         title: "GeoTracking Consent",  //Message
            //         template: "For Geo Tracking, you have to keep app alive, it can be in background. Do you agree to track your location periodically?"
            //     });
            //     confirmPopup.then(function (popupRes) {
            //         if (popupRes) {
            //             saveGeoTrackingConsent(sessionStorage.getItem("empId"),sessionStorage.getItem("empCode"),"Y")
            //         }else{
            //             $rootScope.exitPopupConsentDenied()
            //         }
            // });
        
		  }else{
			return 	success.listGTCPojo[0].createdDate
        }
	}
             
      },
      error(err) {
        $ionicLoading.hide()
        console.log("getting conset error")
      }
    });

  }



  var getGeoTrackingConsentMatter =  function (empId) {
    var fd = new FormData();
	//fd.append("empId",empId)
    
    $.ajax({
      url: baseURL + '/api/signin/getGeoTrackingConsentContent.spr',
      data: fd,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (success) {
        if (success.clientResponseMsg != "OK") {
          //console.log(ptime + " Location Saving error : " + success.clientResponseMsg)
        } else {
          //console.log(ptime + " Location saved")
          //alert("data got: " + success.listGTPojo.length)
		  if (success.listGTCCPojo.length == 0){

            
        
		  }else{
			//alert(success.listGTCCPojo[0].contentMatter1)
            $rootScope.contentMatter1 = success.listGTCCPojo[0].contentMatter1
            $rootScope.contentMatter1 = $rootScope.contentMatter1.replace("<empname>",sessionStorage.getItem('empName'))
            $rootScope.ConfirmPopupConsent()
        }
	}
             
      },
      error(err) {
        $ionicLoading.hide()
        console.log("getting conset error")
      }
    });

  }

function dynamicSort(property) {
    var sortOrder = 1;

    if (property[0].toString() === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a, b) {
        if (sortOrder == -1) {
            return b[property].toString().localeCompare(a[property]).toString();
        } else {
            return a[property].toString().localeCompare(b[property].toString());
        }
    }
}
	
	
    //////////// app exit pop up in case of no updated version available ///////////////
	$rootScope.appVersion = appVersion;
    $rootScope.exitPopupNoUpdateAvlbl = function () {
        var exitPopupNoUpdateAvlbl = $ionicPopup.show({
            template:
                '<p style="white-space: pre-wrap !important;word-wrap: break-word;padding:3px;" ><strong>Quitting...</strong></p><p style="white-space: pre-wrap !important;word-wrap: break-word;">This version ({{appVersion}})of app is no longer supported. Please contact admin for support.</p>',
            title: '',
            scope: $rootScope,
            buttons: [
                {
                    text: '<b>Exit App</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        localStorage.setItem('rememberMeFlag', 0);
                        navigator.app.exitApp();
                    }
                }
            ]
        });
    }
    $rootScope.closeModal = function (index) {
        if (index == 1)
            $rootScope.exitPopupNoUpdateAvlbl.hide();
    };
    /////////////////////////////////////////////////			                


    

    $rootScope.ConfirmPopupConsent = function () {
        var t = '<p style="white-space: pre-wrap !important;word-wrap: break-word;padding:3px;" ></p><div style="overflow:scroll;height:atuo;max-height:400px;"><p style="white-space: pre-wrap !important;word-wrap: break-word;">'+ $rootScope.contentMatter1 + '</p><div>'
        var ConfirmPopupConsent = $ionicPopup.show({
            template: t,
            title: '',
            scope: $rootScope,
            buttons: [
                {
                    text: '<b>I Agree</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        saveGeoTrackingConsent(sessionStorage.getItem("empId"),sessionStorage.getItem("empCode"),"Y")
                    }
                },
                {
                    text: '<b>Exit App</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        navigator.app.exitApp();
                    }
                }
            ]
        });
    }
    $rootScope.closeModal = function (index) {
        if (index == 1)
            $rootScope.ConfirmPopupConsent.hide();
        if (index == 0)
            $rootScope.ConfirmPopupConsent.hide();

    };



    $rootScope.exitPopupConsentDenied = function () {
        var exitPopupConsentDenied = $ionicPopup.show({
            template:
                '<p style="white-space: pre-wrap !important;word-wrap: break-word;padding:3px;" ><strong>Quitting...</strong></p><p style="white-space: pre-wrap !important;word-wrap: break-word;">"Geo Tracking Consent" is required to use this app. If you intent to provide consent, please re-run the app.</p>',
            title: '',
            scope: $rootScope,
            buttons: [
                {
                    text: '<b>Exit App</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        localStorage.setItem('rememberMeFlag', 0);
                        navigator.app.exitApp();
                    }
                }
            ]
        });
    }
    $rootScope.closeModal = function (index) {
        if (index == 1)
            $rootScope.exitPopupConsentDenied.hide();
    };

    object.userLogin = function (loginDetails, success, error) {
    //alert("d1 "+ new Date())
        $rootScope.loggedInNew = "Y"
		if (gb_processTimeRec == "true"){
            console.log("userLogin start "+ $filter('date')(new Date(), 'hh:mm:ss'))
        }
          st = new Date()
           //alert(new date())
        var LoginService = new loginService();
        LoginService.$save(loginDetails, function (data) {
            ed = new Date()
			//alert((ed - st )/1000)
            //alert("d1 "+ new Date())
            $rootScope.myLink = data.myLink;
            showOnBoarding ='false'
            if (getMyHrapiVersionNumber>=27){
                if (data.showOnBoardingPagesInMobile == 'Y'){
                    showOnBoarding ='true'
                }else{
                    showOnBoarding ='false'
                }
            }
            //alert(showOnBoarding)
            
            
            var urlOnBoarding = $rootScope.myLink + 'customLoginMobile.spr?username='+loginDetails.username+'&password='+loginDetails.password
            
            //alert(data.userStatus)
			if (showOnBoarding=='true'){
				if (data.userStatus=="CANDIDATE"){
					//alert(loginDetails.username)
					//alert(loginDetails.password)
					localStorage.setItem('rememberMeFlag', 0);
					$rootScope.userStatus="CANDIDATE"
					
					//alert("this is candidate");

					ref = cordova.InAppBrowser.open(urlOnBoarding, '_blank', 'location=no,zoom=no');
					
			
                        $ionicLoading.hide()
						ref.addEventListener('loadstart', loadStartCallBack);
						return
			
					}
			}
			
            if (data.portalModule.length == 0) {                                     // to check if user has at-least one access rights.
                $ionicLoading.hide();
                showAlert("", "You are not authorized to Login");
                localStorage.setItem('rememberMeFlag', 0);
            } else {
				
				
			/// call here for userStatus
			if (showOnBoarding=='true'){
			var tmpObj = {};
			tmpObj.empId=data.presonalInfo.EmpId
				$.ajax({
				url: baseURL + '/api/eis/eisPersonal/getUserStatus.spr',
				data: tmpObj,
				async:false,
				type: 'POST',
				contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
				processData: false, // NEEDED, DON'T OMIT THIS
				success : function(result) {
					
					$rootScope.userStatus = result.userStatus;
					//alert(loginDetails.username)
					//alert(loginDetails.password)
					
					
					//alert($rootScope.userStatus)
					
					if ($rootScope.userStatus=="CONFIRM_NOT_CLICKED"){
						localStorage.setItem('rememberMeFlag', 0);
							//alert("confirm not clicked")
							ref = cordova.InAppBrowser.open(urlOnBoarding, '_blank', 'location=no,zoom=no');
							
							
							ref.addEventListener('loadstart', loadStartCallBack);
							return
						}
					
				}
				
				});
			}
				
			
			/*
			var getUserStatusService = new getUserStatusService();
            getUserStatusService.$save(tmpObj, function (data) {
                alert(data)
                
            }, function (data) {
                alert(data)
                commonService.getErrorMessage(data);
                $ionicLoading.hide();

            });
				*/

                $rootScope.connectionErrorCounter = 0;
				
				///////// chech latest version w.r.t. Play store
						//check if app is latest.
						
				//saveBaseUrlToFile("hraUrl.txt",baseURL)
				
                sessionStorage.setItem('appVersion', data.appVersion);
				if (data.product_version === undefined){
					sessionStorage.setItem('product_version', "-1");
				}else{
					sessionStorage.setItem('product_version', data.product_version);
				}
				
                if (data.tenantId === undefined){
					sessionStorage.setItem('tenantId', "-1");
				}else{
					sessionStorage.setItem('tenantId', data.tenantId);

				}
                
				
                //session appversion and session domainversion are samething
                //and appVersion (non session, defined in config.js) is mobile app version
                sessionStorage.setItem('domainVersion', data.appVersion);
                sessionStorage.setItem('dbVersion', data.dbVersion);

                sessionStorage.setItem('IsARTorFRT', data.presonalInfo.IsARTorFRT)
                if (data.presonalInfo.isGroupMasterReportee === undefined) {
                    sessionStorage.setItem('isGroupMasterReportee', false)
                } else {
                    sessionStorage.setItem('isGroupMasterReportee', data.presonalInfo.isGroupMasterReportee)
                }

				
				sessionStorage.setItem('reporteeCount', data.reporteeCount)
				if (data.reporteeCount === undefined ) {
                    sessionStorage.setItem('isGroupMasterReportee', false)
                } else if ( parseInt(data.reporteeCount) > 1  ){
                    sessionStorage.setItem('isGroupMasterReportee', true)
                }
				
                sessionStorage.setItem('phoneNumber', data.presonalInfo.phoneNumber)
                //below changes replacing data.authentication.principal. to  presonalInfo 
                //sessionStorage.setItem('empCode', data.authentication.principal.empCode);
                sessionStorage.setItem('empCode', data.presonalInfo.EmpCode);

                //sessionStorage.setItem('companyId', data.authentication.principal.companyId);
                sessionStorage.setItem('companyId', data.presonalInfo.CompanyId);
				console.log("compayId:"+ data.presonalInfo.CompanyId)


				
                sessionStorage.setItem('googleMapAppApiKey', data.googleMapAppApiKey);
				//alert("google api key" + data.googleMapAppApiKey)
				console.log(data.googleMapAppApiKey)
                //localStorage.setItem('companyId', data.authentication.principal.companyId);
                localStorage.setItem('companyId', data.presonalInfo.CompanyId);

                //sessionStorage.setItem('locationId', data.authentication.principal.locationId);
                sessionStorage.setItem('locationId', data.presonalInfo.LocationId);
                //sessionStorage.setItem('empName', data.authentication.principal.empName);
                sessionStorage.setItem('empName', data.presonalInfo.FullName);
                //sessionStorage.setItem('empId', data.authentication.principal.empId);
                sessionStorage.setItem('empId', data.presonalInfo.EmpId);
				$rootScope.myEmpId = data.presonalInfo.EmpId;

                sessionStorage.setItem('portalModule', JSON.stringify(data.portalModule));
                sessionStorage.setItem('displayDeptName', JSON.stringify(data.displayDeptName));
                var IsLeaveAccessible = false;
                IsLeaveAccessible = MenuRightsCheck(data.portalModule, "Leave Management", "Leave Application");
                sessionStorage.setItem('IsLeaveAccessible', IsLeaveAccessible);

                var IsPayslipAccessible = false;
                IsPayslipAccessible = MenuRightsCheck(data.portalModule, "Mobile", "Payslip");
                sessionStorage.setItem('IsPayslipAccessible', IsPayslipAccessible);


                var IsClockInAccessible = false;
                IsClockInAccessible = MenuRightsCheck(data.portalModule, "Mobile", "Clock In");
                sessionStorage.setItem('IsClockInAccessible', IsClockInAccessible);

                var IsPushNotificationsAccessible = false;
                IsPushNotificationsAccessible = MenuRightsCheck(data.portalModule, "Mobile", "Push Notifications");
                sessionStorage.setItem('IsPushNotificationsAccessible', IsPushNotificationsAccessible);

                var IsShiftChangeAccessible = false;
				IsShiftChangeAccessible = MenuRightsCheck(data.portalModule, "Attendance Management", "Shift Change");
                sessionStorage.setItem('IsShiftChangeAccessible', IsShiftChangeAccessible);
                
				
				var IsODAccessible = false;
                IsODAccessible = MenuRightsCheck(data.portalModule, "Attendance Management", "OD Application");
                sessionStorage.setItem('IsODAccessible', IsODAccessible);
				
                var IsRegularizationAccessible = false;
                IsRegularizationAccessible = MenuRightsCheck(data.portalModule, "Attendance Management", "My Attendance Record");
                sessionStorage.setItem('IsRegularizationAccessible', IsRegularizationAccessible);
				// 21 is no for this in play store
				if (getMyHrapiVersionNumber() >=19){	
					var IsTravelAccessible = false;
					IsTravelAccessible = MenuRightsCheck(data.portalModule, "Travel Management", "Travel Application");
					sessionStorage.setItem('IsTravelAccessible', IsTravelAccessible);
					
					
					var IsClaimAccessible = false;
					IsClaimAccessible = MenuRightsCheck(data.portalModule,  "Travel Management","Travel Claim Requisition");
					sessionStorage.setItem('IsClaimAccessible', IsClaimAccessible);
					
					var IsExpenseClaimAccessible = false;
					IsExpenseClaimAccessible = MenuRightsCheck(data.portalModule,  "Claim Management","Claim Form");
					sessionStorage.setItem('IsExpenseClaimAccessible', IsExpenseClaimAccessible);
				}else{
					sessionStorage.setItem('IsTravelAccessible', 'false');
					sessionStorage.setItem('IsClaimAccessible', 'false');
					sessionStorage.setItem('IsExpenseClaimAccessible', 'false');
				}

                    var IsSettingConfiguration = false;
					IsSettingConfiguration = MenuRightsCheck(data.portalModule, "Miscellaneous", "Setting Configuration");
					sessionStorage.setItem('IsSettingConfiguration', IsSettingConfiguration);
				 
				//sessionStorage.setItem('IsExpenseClaimAccessible', 'false');
                sessionStorage.setItem('profilePhoto', baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + sessionStorage.getItem('empId') + '');
                if (getMyHrapiVersionNumber() >=22){	
                    var IsTimesheetAccessible
                    IsTimesheetAccessible = MenuRightsCheck(data.portalModule, "TimeSheet", "Employee TimeSheet");
                    sessionStorage.setItem('IsTimesheetAccessible', IsTimesheetAccessible);
                    
                    var IsProjectConfigAccessible
                    IsProjectConfigAccessible = MenuRightsCheck(data.portalModule, "TimeSheet", "Project configuration");
					sessionStorage.setItem('IsProjectConfigAccessible', IsProjectConfigAccessible);

                }else{
					sessionStorage.setItem('IsTimesheetAccessible', 'false');
					sessionStorage.setItem('IsProjectConfigAccessible', 'false');
				}
                
                if (getMyHrapiVersionNumber() >=23){	
                    var IsInvestmentDeclaration 
                    IsInvestmentDeclaration = MenuRightsCheck(data.portalModule, "CTC", "Investment Declaration");
                    sessionStorage.setItem('IsInvestmentDeclaration', IsInvestmentDeclaration);
                }else{
                    sessionStorage.setItem('IsInvestmentDeclaration', 'false');
                }
                
                if (getMyHrapiVersionNumber() >=24){	
                    var IsTransactionAccessible
                    IsTransactionAccessible = MenuRightsCheck(data.portalModule, "Transaction Management", "Transaction Requisition");
                    sessionStorage.setItem('IsTransactionAccessible', IsTransactionAccessible);
                    
                    var IsVacancyAccessible
                    IsVacancyAccessible = MenuRightsCheck(data.portalModule, "Recruitment Management", "Vacancy Requisition Form");
                    sessionStorage.setItem('IsVacancyAccessible', IsVacancyAccessible);
                    
                    var IsOfferAccessible
                    IsOfferAccessible = MenuRightsCheck(data.portalModule, "Recruitment Management", "Offer Letter Generation");
                    sessionStorage.setItem('IsOfferAccessible', IsOfferAccessible);
                    
                    var IsTrainingRequestAccessible
                    IsTrainingRequestAccessible = MenuRightsCheck(data.portalModule, "Learning & Development", "Training Request");
                    sessionStorage.setItem('IsTrainingRequestAccessible', IsTrainingRequestAccessible);
                    
                    var IsStationeryRequestAccessible
                    IsStationeryRequestAccessible = MenuRightsCheck(data.portalModule, "Admin Help Desk", "Stationary Requisition");
					sessionStorage.setItem('IsStationeryRequestAccessible', IsStationeryRequestAccessible);
                    
                }else{
					sessionStorage.setItem('IsTransactionAccessible', 'false');
                    sessionStorage.setItem('IsVacancyAccessible', 'false');
                    sessionStorage.setItem('IsOfferAccessible', 'false');
                    sessionStorage.setItem('IsTrainingRequestAccessible', 'false');
                    sessionStorage.setItem('IsStationeryRequestAccessible', 'false');
				}
                if (getMyHrapiVersionNumber() >=26){
                    sessionStorage.setItem("isPanelMember","Y")
                    var IsGrievanceAccessible
                    IsGrievanceAccessible = MenuRightsCheck(data.portalModule, "Admin Help Desk", "Grievance Suggestion Application");
					sessionStorage.setItem('IsGrievanceAccessible', IsGrievanceAccessible);
                }else{
                    sessionStorage.setItem("isPanelMember","N")
                    sessionStorage.setItem('IsGrievanceAccessible',"false")
                }

                if (getMyHrapiVersionNumber() >=27){
                    var IsExitInterviewAccessible
                    IsExitInterviewAccessible = MenuRightsCheck(data.portalModule, "Transaction Management", "Exit Interview");
					sessionStorage.setItem('IsExitInterviewAccessible', IsExitInterviewAccessible);
                }else{
              		sessionStorage.setItem('IsExitInterviewAccessible', "false");
                }

                if (getMyHrapiVersionNumber() >=35){
                    var IsGeoTrackReportAccessible 
                    IsGeoTrackReportAccessible = MenuRightsCheck(data.portalModule, "Attendance Management", "Geo Tracking Report");
					sessionStorage.setItem('IsExitInterviewAccessible', IsGeoTrackReportAccessible);
                }else{
              		sessionStorage.setItem('IsExitInterviewAccessible', "false");
                }


                //alert("geo report " + IsGeoTrackReportAccessible)
                
				// as checkPrevVerAppAvailable method is asynch 
				// shifted below line onLoginData to that function or if applyAppVersionCompatibiliyModule="N" then
				//  call onLoginData
				//onLoginData(data.presonalInfo.Gender);
                //
				
                ///// app version compatibility module start 
                if (applyAppVersionCompatibiliyModule == "Y") {
					
                    var isInstalledAppLatest = chcekIfInstalledAppLatest(data.avcList, data.appVersion) //passing list and domain version
                    if (isInstalledAppLatest == "NO") {
                        $ionicLoading.hide()
                        $state.go('getNewAppVersion')
                        return
                    } else if (isInstalledAppLatest == "NO_NEW_VERSION_AVAILABLE") {
                        $ionicLoading.hide()
                        $rootScope.exitPopupNoUpdateAvlbl()
                        return
                    }else if (isInstalledAppLatest == "YES") {
                        $ionicLoading.hide()
						checkPrevVerAppAvailable(data,0)
					}
					
                }else{
                    //alert("ra3 "new Date())
					onLoginData(data.presonalInfo.Gender);
				//alert("ra4 " + new date())
				}
                ///// app version compatibility module over
				

				$rootScope.myAppVersion = getMyHrapiVersionNumber()
		
                localStorage.setItem('userName', loginDetails.username);
                localStorage.setItem('password', loginDetails.password);

                if (loginDetails.rememberMeFlag) {
                    localStorage.setItem('userName', loginDetails.username);
                    localStorage.setItem('password', loginDetails.password);
                    localStorage.setItem('rememberMeFlag', 1);
                }
				myHrapiVersion = getMyHrapiVersionNumber();
               // alert("ra 5 " + new Date())
				getRequisitionApproval()
               // alert("ra 6 " + new Date())
                
				
            }
        }, function (data) {
            error(data);
            $ionicLoading.hide();
        });
        
        if (gb_processTimeRec == "true"){
            console.log("userLogin start "+ $filter('date')(new Date(), 'hh:mm:ss'))
        }
    };

    function MenuRightsCheck(portalModule, moduleName, menuName) {
        var modules = $.grep(portalModule, function (v) {
            return v.moduleName === moduleName;
        });

        if (modules.length <= 0) {
            return false;
        }
        var menus = $.grep(modules[0].masterMenuBeanList, function (v) {
            return v.menuName === menuName;
        });
        if (menus.length > 0) {
            if (menus[0].isAdd === "Y") {
                return true;
            }
        }
        return false;
    }

    function processDonutData(tmpData) {
        if (tmpData == "") {
            data = $rootScope.donutData
        }
        else {
            data = tmpData
            $rootScope.donutData = data
        }
        sessionStorage.setItem('PresentCount', data[0].PresentCount);
        sessionStorage.setItem('AbsentCount', data[0].AbsentCount);
        sessionStorage.setItem('ODCount', data[0].ODCount);
        sessionStorage.setItem('LeaveCount', data[0].LeaveCount);
        sessionStorage.setItem('WeeklyOffCount', data[0].WeeklyOffCount);
        sessionStorage.setItem('HolidayCount', data[0].HolidayCount);
        sessionStorage.setItem('NACount', data[0].NACount);
        sessionStorage.setItem('OthersCount', data[0].OthersCount);
        if ((parseInt(data[0].PresentCount) + parseInt(data[0].AbsentCount) + parseInt(data[0].ODCount) + parseInt(data[0].LeaveCount) + parseInt(data[0].WeeklyOffCount) + parseInt(data[0].HolidayCount) + parseInt(data[0].NACount) + parseInt(data[0].OthersCount)) == 1) {
            $rootScope.HomeDashBoard = false;
            $state.go('app.home.selfService');

        } else {
			// this else was empty .. check in future
			// if below lines are required

			$rootScope.HomeDashBoard = true;

            //$state.go('app.approvalsTC');
			//$state.go('claimApplication');
			//$state.go('app.RequisitionTravelAndClaim');

			//$state.go('odApplication');
			//$state.go('app.RequestList');
            
           //$state.go('app.home.dashboard');

        }
        $ionicLoading.hide();
    }



    function onLoginData(gender) {
        //   ionicLoadingService.showLoading();
        if (gb_processTimeRec == "true"){
            console.log("onLoginData start "+ $filter('date')(new Date(), 'hh:mm:ss'))
        }
			$ionicLoading.show();
        var requestObject = {};
        var pushRegisterFirebase = function () {
             if (window.device.platform == "Android"){
                 cordova.plugins.firebase.messaging.getToken().then(function(token) {
                     console.log("NEW CORDOVA Got device token: ", token);
                     //alert("TOKEN " + token)
                     if (token == null) {
                         pushRegisterFirebase();
                     } else {
                         localStorage.setItem('fireBasePushRegKey', token);
                         localStorage.setItem('empId', sessionStorage.getItem('empId'));
                         requestObject.username = sessionStorage.getItem('empId');
                     }
                 });
                    
                 }
                if (window.device.platform == "iOS"){
                window.FirebasePlugin.getInstanceId(function (token) {
                    
                    if (token == null) {
                        pushRegisterFirebase();
                    } else {
                        //alert("got ios token " + token)
                        console.log("NEW CORDOVA Got device token for IOS: ", token);
                        localStorage.setItem('fireBasePushRegKey', token);
                        localStorage.setItem('empId', sessionStorage.getItem('empId'));
                        requestObject.username = sessionStorage.getItem('empId');
                    }
                }, function (error) {
                });
                }
        }
		
        if (!localStorage.getItem('fireBasePushRegKey') || !(localStorage.getItem('empId') == sessionStorage.getItem('empId'))) {
            pushRegisterFirebase();
        }
        requestObject.pushRegKey = localStorage.getItem('fireBasePushRegKey');
		
        //alert(requestObject.pushRegKey)
		console.log(requestObject.pushRegKey)
        requestObject.empId = sessionStorage.getItem('empId');
        requestObject.companyId = sessionStorage.getItem('companyId');
        requestObject.locationId = sessionStorage.getItem('locationId');
        requestObject.fromDate = $filter('date')(new Date(), 'dd/MM/yyyy');
        requestObject.toDate = $filter('date')(new Date(), 'dd/MM/yyyy');
		var st = new Date()



        $rootScope.getLoginDataService = new getLoginDataService();
        $rootScope.getLoginDataService.$save(requestObject, function (success) {
			var endd = new Date()
			//alert("gld "+(endd - st)/1000 )
		
            //////////// app exit pop up  ///////////////
            $rootScope.exitPopup = function () {
                var exitPopup = $ionicPopup.show({
                    template:
                        '<p style="white-space: pre-wrap !important;word-wrap: break-word;padding:3px;" ><strong>Quitting...</strong></p><p style="white-space: pre-wrap !important;word-wrap: break-word;">Please change password from web to continue using Mobile App.</p>',
                    title: '',
                    scope: $rootScope,
                    buttons: [
                        {
                            text: '<b>Exit App</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                localStorage.setItem('rememberMeFlag', 0);
                                navigator.app.exitApp();
                            }
                        }
                    ]
                });
            }
            $rootScope.closeModal = function (index) {
                if (index == 1)
                    $rootScope.exitPopup.hide();
            };
            /////////////////////////////////////////////////		
			
            if (success.isNewEmployee == "Y") {
                //alert that he has to login first into web
                //exit from app.
                $ionicLoading.hide();
                //$rootScope.exitPopup()
                //return;
            }
			
			if (success.ifOutOfFencePunchValid) {
                $rootScope.ifOutOfFencePunchValid = success.ifOutOfFencePunchValid
            }
			console.log("OOFPV " + $rootScope.ifOutOfFencePunchValid)
			
            sessionStorage.setItem('photoFileName', success.MenuInfo.photoFileName);
            if (!success.MenuInfo.photoFileName) {
                if (gender == 'M') {
                    sessionStorage.setItem('photoFileName', "Male-Default.png");
                    sessionStorage.setItem('profilePhoto', "./img/Male.png");
                }
                else {
                    sessionStorage.setItem('photoFileName', "Female-Default.png");
                    sessionStorage.setItem('profilePhoto', "./img/Female.png");
                }
            }
            sessionStorage.setItem('designation', success.MenuInfo.designationName);
            if (success.MenuInfo.departmentName)
                sessionStorage.setItem('department', success.MenuInfo.departmentName);
            sessionStorage.setItem('holidayCategoryId', success.MenuInfo.holidayCategoryId);
            sessionStorage.setItem('holidayCategoryName', success.MenuInfo.holidayCategoryName);
            sessionStorage.setItem('employeeCategoryId', success.MenuInfo.employeeCategoryId);
            sessionStorage.setItem('employeeCategoryName', success.MenuInfo.employeeCategoryName);
            sessionStorage.setItem('employeeCategoryName', success.MenuInfo.employeeCategoryName);
            sessionStorage.setItem('dateOfJoining', success.MenuInfo.dateOfJoining);
			
            // For Requisition Count :
            
                if (success.RequisitionCount.odApplication && (sessionStorage.getItem('IsRegularizationAccessible') == 'true')) {
                    attendRegularInProcessCount = success.RequisitionCount.odApplication.inProcess;
                } else {
                    attendRegularInProcessCount = '0'
                }
                if (success.RequisitionCount.leaveApplication && (sessionStorage.getItem('IsLeaveAccessible') == 'true')) {
                    leaveAppliInProcessCount = success.RequisitionCount.leaveApplication.inProcess;
                } else {
                    leaveAppliInProcessCount = '0'
                }
                if (success.RequisitionCount.attendanceRegularisation && (sessionStorage.getItem('IsODAccessible') == 'true')) {
                    odApplicationInProcessCount = success.RequisitionCount.attendanceRegularisation.inProcess;
                } else {
                    odApplicationInProcessCount = '0'
                }
                if (success.RequisitionCount.shiftChange && (sessionStorage.getItem('IsShiftChangeAccessible') == 'true')) {
                    shiftChangeCount = success.RequisitionCount.shiftChange.inProcess;
                } else {
                    shiftChangeCount = '0'
                }
				
				/*
				if (success.RequisitionCount.travelApplCount && (sessionStorage.getItem('IsTravelAccessible') == 'true')){
                    travelApplicationCount = success.RequisitionCount.travelApplCount.inProcess;
                } else {
                    travelApplicationCount = '0'
                }				
				
				if (success.RequisitionCount.travelClaimApplCount){
                    travelClaimApplCount = success.RequisitionCount.travelClaimApplCount.inProcess;
                } else {
                    travelClaimApplCount = '0'
                }				

				if (success.RequisitionCount.claimCTCApplCount){
                    claimCTCApplCount = success.RequisitionCount.claimCTCApplCount.inProcess;
                } else {
                    claimCTCApplCount = '0'
                }				
				
				if (success.RequisitionCount.claimNONCTCApplCount){
                    claimNONCTCApplCount = success.RequisitionCount.claimNONCTCApplCount.inProcess;
                } else {
                    claimNONCTCApplCount = '0'
                }				
				
				if (success.RequisitionCount.claimLTACLAIMApplCount){
                    claimLTACLAIMApplCount = success.RequisitionCount.claimLTACLAIMApplCount.inProcess;
                } else {
                    claimLTACLAIMApplCount = '0'
                }				
                
				*/
				$rootScope.totalRequestCount = parseInt(attendRegularInProcessCount) + parseInt(leaveAppliInProcessCount) + parseInt(odApplicationInProcessCount) + parseInt(shiftChangeCount);
                $rootScope.attendance = attendRegularInProcessCount;
                $rootScope.leave = leaveAppliInProcessCount;
                $rootScope.od = odApplicationInProcessCount;
                $rootScope.shift = shiftChangeCount;
				
				/*
				$rootScope.travelApplicationCount = travelApplicationCount
				$rootScope.travelClaimApplCount = travelClaimApplCount
				$rootScope.claimCTCApplCount = claimCTCApplCount
				$rootScope.claimNONCTCApplCount = claimNONCTCApplCount
				$rootScope.claimLTACLAIMApplCount = claimLTACLAIMApplCount
				*/
//            
            //for Locking Peroid:
			if (success.lockingPeroid.list === undefined){
				
			}else{
				sessionStorage.setItem('lockingPeriod', success.lockingPeroid.list);
			}
			
			
			
            //For Inbox Count:
			
			$rootScope.UnreadMessages = success.cntInbox;
			//alert("inbox\n"+ success.cntInbox)
            if (success.emailList) {
                //alert("into emaillist")
                $rootScope.inboxList = success.emailList;
                $rootScope.UnreadMessages = 0;
                for (var i = 0; i < $rootScope.inboxList.length; i++) {
                    if ($rootScope.inboxList[i].status == 'N') {
                        $rootScope.UnreadMessages++;
                    }
                }
            }
				
            //For Doughnut Chart :
            if (success.attendanceCount[0] == undefined) {
                //$state.go('app.home.selfService');
                //$rootScope.HomeDashBoard = false;
                alert("Exiting App..\n\nError getting attendance data.")
                navigator.app.exitApp();
                return;
            } else {
                sessionStorage.setItem('AbsentCount', success.attendanceCount[0].AbsentCount);
                sessionStorage.setItem('ODCount', success.attendanceCount[0].ODCount);
                sessionStorage.setItem('PresentCount', success.attendanceCount[0].PresentCount);
                sessionStorage.setItem('LeaveCount', success.attendanceCount[0].LeaveCount);

                var doj = new Date(success.MenuInfo.dateOfJoining);
                var todayDate = new Date();


                 ///////////////////////////// store geo tracking params
                 

                 if (getMyHrapiVersionNumber() >= 35 ){
                     /*alert(success.GeoTrackingEnabledForClient)
                     alert(success.GeoTrackingTnterval)
                     alert(success.heartBeatIntervalInMinutes)*/
                     //alert(success.GeoTrackingEnabledForUser)
                    
                    if (success.GeoTrackingEnabledForClient == "Yes"){
                        GeoTrackingFeatureEnabledForClient = "true"
                        localStorage.setItem('GeoTrackingEnabledForClient',"true");
                    }else{
                        GeoTrackingFeatureEnabledForClient  = "false"
                        localStorage.setItem('GeoTrackingEnabledForClient',"false");
                    }

                    if (success.GeoTrackingEnabledForUser == "Y"){
                        GeoTrackingEnabledForUser = "true"
                        localStorage.setItem('GeoTrackingEnabledForUser', "true");
                    }else{
                        GeoTrackingEnabledForUser = "false"
                        localStorage.setItem('GeoTrackingEnabledForUser', "false");
                    }
                    
                                        
                    localStorage.setItem('GeoTrackingTnterval', success.GeoTrackingTnterval);
                    GeoTrackingIntervalInMinutes = success.GeoTrackingTnterval
                    
                    localStorage.setItem('HeartBeatInterval', success.heartBeatIntervalInMinutes);
                    gi_heartBeatIntervalInMinutes = success.heartBeatIntervalInMinutes


                    //GeoTrackingFeatureEnabledForClient = "true"
                    GeoTrackingEnabledForUser = "true"
                    //GeoTrackingIntervalInMinutes = 30
                    gi_heartBeatIntervalInMinutes = 5


                }

                if (GeoTrackingFeatureEnabledForClient == "true" && 
                    GeoTrackingEnabledForUser == "true"   ){
                        createSlotsOfMinutes(GeoTrackingIntervalInMinutes)
                        getGeoTrackingConsent(sessionStorage.getItem("empId"))
                }
                

                //////////////////////////////////////////////

                //////////////////////////////////////////////

                //call for counts

                // for date of joining as future , dasboard not to be shown
                    //alert("d2 "+ new Date())
                if (((parseInt(success.attendanceCount[0].PresentCount) + parseInt(success.attendanceCount[0].AbsentCount) + parseInt(success.attendanceCount[0].ODCount) + parseInt(success.attendanceCount[0].LeaveCount)) == 1) || doj > todayDate) {

                    $rootScope.HomeDashBoard = false;
                    $state.go('app.home.selfService');

                } else {
					
                    $rootScope.HomeDashBoard = true;
				
					//$state.go('projectConfigApplication');
                    $state.go('app.home.dashboard');
                }
            }
            
			
			
        }, function (data) {
            //            ionicLoadingService.hideLoading(1);
            $ionicLoading.hide();
            commonService.getErrorMessage(data);
        });
        object.getDoNutChartCount = function (dateDetails, success, error) {
            var obj = {};
            //            obj.fromDate = $filter('date')(dateDetails.fromDate, 'dd/MM/yyyy');
            obj.fromDate = dateDetails.fromDate;
            obj.presentDayFlag = dateDetails.presentDayFlag;
            obj.doughnutChartCountOrListFlag = dateDetails.doughnutChartCountOrListFlag;
            obj.offset = 0;
            obj.maxData = 0;
            obj.searchData = "";

            // below commented as donut data should always retrieve

            if (obj.fromDate == $rootScope.DonutDataDate) {

            } else {
                $rootScope.DonutDataDate = obj.fromDate
            }

            var GetDonutDataService = new getDonutDataService();
            GetDonutDataService.$save(obj, function (data) {
                processDonutData(data)
                success();
            }, function (data) {
                commonService.getErrorMessage(data);
                $ionicLoading.hide();

            });
            return object;
        }

		/*
        object.getDoNutChartCount = function (dateDetails, success, error) {
            var obj = {};
//            obj.fromDate = $filter('date')(dateDetails.fromDate, 'dd/MM/yyyy');
            obj.fromDate = dateDetails.fromDate;
            obj.presentDayFlag = dateDetails.presentDayFlag;
            obj.doughnutChartCountOrListFlag = dateDetails.doughnutChartCountOrListFlag;
            obj.offset =0;
            obj.maxData = 0;
            obj.searchData = "";
            var GetDonutDataService = new getDonutDataService();
            GetDonutDataService.$save(obj, function (data) {
                sessionStorage.setItem('PresentCount', data[0].PresentCount);
                sessionStorage.setItem('AbsentCount', data[0].AbsentCount);
                sessionStorage.setItem('ODCount', data[0].ODCount);
                sessionStorage.setItem('LeaveCount', data[0].LeaveCount);
                sessionStorage.setItem('WeeklyOffCount', data[0].WeeklyOffCount);
                sessionStorage.setItem('HolidayCount', data[0].HolidayCount);
                sessionStorage.setItem('NACount', data[0].NACount);
                sessionStorage.setItem('OthersCount', data[0].OthersCount);
                if ((parseInt(data[0].PresentCount) + parseInt(data[0].AbsentCount) + parseInt(data[0].ODCount) + parseInt(data[0].LeaveCount) + parseInt(data[0].WeeklyOffCount) + parseInt(data[0].HolidayCount) + parseInt(data[0].NACount) + parseInt(data[0].OthersCount)) == 1)
                {
                    $state.go('app.home.selfService');
                    $rootScope.HomeDashBoard = false;
                } else
                {
                    $state.go('app.home.dashboard');
                    $rootScope.HomeDashBoard = true;
                }
                success();
            }, function (data) {
                commonService.getErrorMessage(data);
                $ionicLoading.hide();
            });
            return object;
        }*/
        if (gb_processTimeRec == "true"){
            console.log("onLoginData end "+ $filter('date')(new Date(), 'hh:mm:ss'))
        }
    };

    return object;
});
