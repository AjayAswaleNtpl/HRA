/*
 1.This controller is used for applying leaves.
 */

mainModule.factory("detailTravelApplicationForClaim", function ($resource) {
	return $resource((baseURL + '/api/travelClaim/detailTravelApplicationForClaim.spr'), {}, 
	{ 'save': { method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
	 } }, {});
});
mainModule.factory("detailTravelApplication", function ($resource) {
	return $resource((baseURL + '/api/travelApplication/detailsTravel.spr'), {}, 
	{ 'save': { method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
	 } }, {});

});


mainModule.factory("getTravelRuleService", function ($resource) {
	return $resource((baseURL + '/api/travelApplication/getTravelRule.spr'), {}, 
	{ 'save': { method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
	 } }, {});
});

mainModule.factory("sendForCancellationService", function ($resource) {
	return $resource((baseURL + '/api/travelApplication/sendForCancellation.spr'), {}, 
	{ 'save': { method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
	 } }, {});
});
mainModule.factory("singleApproveTravelAppService", function ($resource) {
    return $resource((baseURL + '/api/travelApplication/singleApproveTravelApp.spr'), {}, 
	{'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("approveTravelAppService", function ($resource) {
    return $resource((baseURL + '/api/travelApplication/approveTravelApp.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("approveSentForCancelTravelAppService", function ($resource) {
    return $resource((baseURL + '/api/travelApplication/cancelTravelApp.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("singleRejectTravelAppService", function ($resource) {
    return $resource((baseURL + '/api/travelApplication/singleRejectTravelApp.spr'), {}, 
	{'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});

/*mainModule.factory("detailTravelApplicaiton", function ($resource) {
    return $resource((baseURL + '/api/travelApplication/travelApplicaiton.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout}}, {});
});
*/

mainModule.controller('claimTravelDetailsCtrl', function ($scope, $rootScope, commonService, $ionicHistory,$window,
	$rootScope, $ionicPopup, $state, $http, $q, $filter, $ionicLoading, $timeout ,
	$ionicHistory,getTravelRuleService,detailTravelApplicationForClaim ,$q ,$ionicNavBarDelegate,sendForCancellationService,
	singleApproveTravelAppService, detailTravelApplication,singleRejectTravelAppService
	,singleApproveTravelAppService,approveTravelAppService,approveSentForCancelTravelAppService) {


	
	if(  $rootScope.navHistoryCurrPage == "requisition"){
		if ($rootScope.gv_travelShowDetailsFrom == "CLAIM_LIST"){
			$rootScope.reqestPageLastTab = "CLAIM_TRAVEL"
			$rootScope.navHistoryPrevPage ="requestClaimList"
		}else{
			
			$rootScope.navHistoryPrevPage ="requestTravelApplicationID"
		}

		
	}else{
		$rootScope.navHistoryPrevPage ="approvalTravelList"
	}
	//$rootScope.navHistoryCurrPage = "ClaimTravelDetails"
	$rootScope.navHistoryPrevTab="TRAVEL"

	if ( getMyHrapiVersionNumber() >= 31){
		$scope.utf8Enabled = 'true'    
	}else{
		$scope.utf8Enabled = 'false'    
	}

	$scope.utf8Enabled = 'true'    
	
	$scope.empDetailslist={}
	$scope.travelApplDataObject = {}
	$scope.travelAppVo = {}
	$scope.travelApplicationForm = {}
	$scope.travelApplicationForm.travelRuleGridChildVOList = []

	$scope.requestObject={}
	$scope.requestObject.dateFormat = "dd/MM/yyyy"
	$scope.reslutObject={}
	$scope.selectedValues={}
	$scope.selectedValues.isTentative = []
	$scope.selValues={}
	$scope.listMasterPOV = []
	$scope.listDestination = []
	//$scope.selectedValues.fromPlace=[]


	$scope.empId=""
    $scope.shownTab1 = null
    $scope.shownTab2 = null
    $scope.shownTab3 = null
    $scope.shownTab4 = null
    $scope.shownTab5 = null
	$scope.shownTab6 = null
	$scope.shownTab7 = null
	$scope.countGrid1 = 0
	$scope.countGrid2 = 0
	$scope.countGrid3 = 0

	$scope.appremDisabled='true'
	$ionicLoading.show()



	//alert($rootScope.gv_travelShowDetailsFrom)
	$timeout(function () {
		if ($rootScope.gv_travelShowDetailsFrom=='CLAIM_LIST'){

				document.getElementById('btnSave').style.display="inline-block";
		}
		},500)

	$timeout(function () {

	if ($rootScope.gv_travelShowDetailsFrom=='REQ_TRAVEL_LIST'){

      if ($rootScope.gv_travelShowDetailsStaus=="SENT FOR APPROVAL" ||
      $rootScope.gv_travelShowDetailsStaus=="APPROVED" ){

				document.getElementById('btnCancleTA').style.display="inline-block";
		}}
	}
		,500)


	$timeout(function () {

		if ($rootScope.gv_travelShowDetailsFrom=='APPROVAL_TRAVEL_LIST'){

			if ($rootScope.gv_travelShowDetailsStaus=="SENT FOR APPROVAL" || $rootScope.gv_travelShowDetailsStaus=="SENT FOR CANCELLATION"){

				//document.getElementById('btnCancleTA').style.visibility="visible";
				document.getElementById('btnApproveTravel').style.display="inline-block";
				document.getElementById('btnRejectTravel').style.display="inline-block";

				$scope.appremDisabled='false'
				document.getElementById('apprem').disabled=false;
				document.getElementById('apprem').style.backgroundColor = "white"
		}}
	}
		,500)





	//APPROVAL_TRAVEL_LIST

	$scope.init = function(){

	//$scope.requestObject.menuId='2609' //this is form travelclaim
	$scope.requestObject.menuId='2607' //this is for travelapplication
	$scope.requestObject.buttonRights="Y-Y-Y-Y"
	$scope.requestObject.travelTransId=$rootScope.travelTransIdForClaimApply

	$scope.detailTravelApplicationForClaim = new detailTravelApplication();
	$scope.detailTravelApplicationForClaim.$save($scope.requestObject, function (data) {
		if (!(data.clientResponseMsg=="OK")){
			$ionicLoading.hide()
			console.log(data.clientResponseMsg)
			handleClientResponse(data.clientResponseMsg,"detailTravelApplicationForClaim")
			showAlert("Something went wrong. Please try later.")	
			return
		}

		if (data.empDetailslist!=null){
			$scope.empDetailslist = data.empDetailslist
			$scope.requestObject.empId=$scope.empDetailslist[0].empId
			//alert($scope.requestObject.empId)
		}
		$scope.listDestination = data.listDestination

		$scope.listMasterTravelType = data.listMasterTravelType
		$scope.listTravelModeClass = data.listTravelModeClass
		//$scope.travelClaimForm = data.travelClaimForm
		//$scope.travelClaimForm  = JSON.parse(data.travelApplicationForm);
		$scope.travelClaimForm = data.travelApplicationForm



		for(var i = 0;i<$scope.travelClaimForm.travelRuleGridChildVOList.length;i++){
			if ($scope.travelClaimForm.travelRuleGridChildVOList[i].fromPlace!="" &&
			    !($scope.travelClaimForm.travelRuleGridChildVOList[i].fromPlace==null)){
				$scope.countGrid1 ++;
			}
		}

		for(var i = 0;i<$scope.travelClaimForm.travelRuleGridChildVOList1.length;i++){
			if ($scope.travelClaimForm.travelRuleGridChildVOList1[i].stayLocation!="" &&
			    !($scope.travelClaimForm.travelRuleGridChildVOList1[i].stayLocation==null)){
				$scope.countGrid2 ++;
			}
		}
		for(var i = 0;i<$scope.travelClaimForm.travelRuleGridChildVOList2.length;i++){
			
			if ($scope.travelClaimForm.travelRuleGridChildVOList2[i].currencyType!="" &&
			    !($scope.travelClaimForm.travelRuleGridChildVOList2[i].currencyType==null)){
					
				//document.getElementById('approvedAmt'+i).value= $scope.travelClaimForm.travelRuleGridChildVOList2[i].issuedAmount
				//if ($scope.travelClaimForm.travelRuleGridChildVOList2[i].currencyType=='&#8377')	
					//$scope.travelClaimForm.travelRuleGridChildVOList2[i].currencyType ='&#x20B9'
				
				$scope.countGrid3 ++;
			}
		}

		$scope.travelClaimForm.travelRuleGridChildVOList.length=$scope.countGrid1;
		$scope.travelClaimForm.travelRuleGridChildVOList1.length=$scope.countGrid2;
		$scope.travelClaimForm.travelRuleGridChildVOList2.length=$scope.countGrid3;

	$timeout(function () {$scope.defaultTabs1Open='Y'},500)
	$timeout(function () {$scope.defaultTabs2Open='Y'},500)
	$timeout(function () {$scope.defaultTabs3Open='Y'},500)
	$timeout(function () {$scope.defaultTabs4Open='Y'},500)
	$timeout(function () {$scope.defaultTabs5Open='Y'},500)
	$timeout(function () {$scope.defaultTabs6Open='Y'},500)
	$timeout(function () {$scope.defaultTabs7Open='Y'},500)
	$timeout(function () {
		for(var i = 0;i<$scope.travelClaimForm.travelRuleGridChildVOList.length;i++){
			if ($scope.travelClaimForm.travelRuleGridChildVOList[i].fromPlace!="" &&
			    !($scope.travelClaimForm.travelRuleGridChildVOList[i].fromPlace==null)){
					document.getElementById('istentative'+i).checked = $scope.travelClaimForm.travelRuleGridChildVOList[i].isTentative
					$scope.selectedValues.isTentative[i] = $scope.travelClaimForm.travelRuleGridChildVOList[i].isTentative
			}
		}
		
		for(var i = 0;i<$scope.travelClaimForm.travelRuleGridChildVOList2.length;i++){
			
			if ($scope.travelClaimForm.travelRuleGridChildVOList2[i].currencyType!="" &&
			    !($scope.travelClaimForm.travelRuleGridChildVOList2[i].currencyType==null)){
				document.getElementById('approvedAmt'+i).value= $scope.travelClaimForm.travelRuleGridChildVOList2[i].issuedAmount
				if ($rootScope.gv_travelShowDetailsFrom=='REQ_TRAVEL_LIST'){
					document.getElementById('approvedAmt'+i).readOnly = true
				}
		}}
		},500)
	
		$ionicLoading.hide()
	}, function (data, status) {
		autoRetryCounter = 0
		$ionicLoading.hide()
		commonService.getErrorMessage(data);

	});

	}

	$scope.prevTab = function (tabId) {
		if ($scope.tab != 1) {
			$scope.tab--;
		}

	};
	$scope.nextTab = function (tabId) {
		if ($scope.tab != 6) {
			$scope.tab++
		}

	};


    $scope.toggleTab1 = function (tab) {
        if ($scope.isTab1Shown(tab)|| $scope.defaultTabs1Open=='Y') {
            $scope.shownTab1 = null;
			$scope.defaultTabs1Open='N'
        } else {
            $scope.shownTab1 = tab;
        }
    };
    $scope.isTab1Shown = function (tab) {
        return $scope.shownTab1  === tab;
    };

    $scope.toggleTab2 = function (tab) {

        if ($scope.isTab2Shown(tab) || $scope.defaultTabs2Open=='Y') {
            $scope.shownTab2 = null;
			$scope.defaultTabs2Open='N'
        } else {
            $scope.shownTab2 = tab;
        }
    };
    $scope.isTab2Shown = function (tab) {
        return $scope.shownTab2  === tab;
    };


    $scope.toggleTab3 = function (tab) {
        if ($scope.isTab3Shown(tab)|| $scope.defaultTabs3Open=='Y') {
            $scope.shownTab3 = null;
			$scope.defaultTabs3Open='N'
        } else {
            $scope.shownTab3 = tab;
        }
    };
    $scope.isTab3Shown = function (tab) {
        return $scope.shownTab3  === tab;
    };


    $scope.toggleTab4 = function (tab) {
        if ($scope.isTab4Shown(tab) || $scope.defaultTabs4Open=='Y') {
            $scope.shownTab4 = null;
			$scope.defaultTabs4Open='N'
        } else {
            $scope.shownTab4 = tab;
        }
    };
    $scope.isTab4Shown = function (tab) {
        return $scope.shownTab4  === tab;
    };



    $scope.toggleTab5 = function (tab) {
        if ($scope.isTab5Shown(tab) || $scope.defaultTabs5Open=='Y') {
            $scope.shownTab5 = null;
			$scope.defaultTabs5Open='N'
        } else {
            $scope.shownTab5 = tab;
        }
    };
    $scope.isTab5Shown = function (tab) {
        return $scope.shownTab5  === tab;
    };



    $scope.toggleTab6 = function (tab) {
        if ($scope.isTab6Shown(tab) || $scope.defaultTabs6Open=='Y') {
            $scope.shownTab6 = null;
			$scope.defaultTabs6Open='N'
        } else {
            $scope.shownTab6 = tab;
        }
    };
    $scope.isTab6Shown = function (tab) {
        return $scope.shownTab6  === tab;
    };


	$scope.toggleTab7 = function (tab) {
        if ($scope.isTab7Shown(tab) || $scope.defaultTabs7Open=='Y') {
            $scope.shownTab7 = null;
			$scope.defaultTabs7Open='N'
        } else {
            $scope.shownTab7 = tab;
        }
    };
    $scope.isTab7Shown = function (tab) {
        return $scope.shownTab7  === tab;
    };


	$scope.getTravelRule = function() {
	return
	$scope.selectedToT=document.getElementById('typeOfTravel').value
	$scope.tObject={}
	$scope.tObject.traveltype = $scope.selectedToT
	$scope.tObject.empId = $scope.requestObject.empId


	$scope.getTravelRuleService = new getTravelRuleService();
	$scope.getTravelRuleService.$save($scope.tObject, function (data_return) {
		if (!(data_return.clientResponseMsg=="OK")){
			console.log(data_return.clientResponseMsg)
			handleClientResponse(data_return.clientResponseMsg,"getTravelRuleService")
			showAlert(alert_header,"Something went wrong. Please try later.");
			$state.go('app.travelApplication')
			return;
		}
		if (data_return.msg	== ""){
					//do nothing


				}
				else{
					showAlert(alert_header,data_return.msg)
				}
		}, function (data, status) {
		autoRetryCounter = 0
		$ionicLoading.hide()
		commonService.getErrorMessage(data);

	});


	};

	$scope.showVisaDetails = function() {
		//var url="../../eis/eisVisa/viewEisVisaDetails.spr?fromTravel=Y&empId="+empId+"&empCode="+empCode+"&empName="+empName;
		//tb_open_new(url+'&menuId='+document.getElementById('menuId').value+'&buttonRights='+document.getElementById('buttonRights').value+'&height='+550+'&width='+900+'&TB_iframe=true&modal=true');
			showAlert("visa details","")
	}


    $scope.setDate = function (grid1) {
        var date;
		var selIndex = $scope.travelApplicationForm.travelRuleGridChildVOList.indexOf(grid1)

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
				$scope.travelApplicationForm.travelRuleGridChildVOList[selIndex].travelDate = $filter('date')(date, 'dd/MM/yyyy');

				if (!$scope.$$phase)
                    $scope.$apply()

				$scope.doOnChgDate(selIndex)
				$scope.getTravelRuleByDate(selIndex)

            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
    }



$scope.setFromDate = function (grid2) {
        var date;
		var selIndex = $scope.travelApplicationForm.travelRuleGridChildVOList1.indexOf(grid2)

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
				document.getElementById('fDate'+selIndex).value = $filter('date')(date, 'dd/MM/yyyy');

				if (!$scope.$$phase)
                    $scope.$apply()

				$scope.dateValidate(selIndex)

            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
    }



$scope.setToDate = function (grid2) {
        var date;
		var selIndex = $scope.travelApplicationForm.travelRuleGridChildVOList1.indexOf(grid2)

        if ($scope.tDate == null) {
            date = new Date();
        }
        else {
            date = $scope.tDate;
        }

        var options = {date: date, mode: 'date', titleText: 'Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                $scope.tDate = date;


				document.getElementById('tDate'+selIndex).value = $filter('date')(date, 'dd/MM/yyyy');
				if (!$scope.$$phase)
                    $scope.$apply()

				$scope.dateValidator(selIndex)

            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
    }

	$scope.redirectOnBack = function () {
		if(  $rootScope.navHistoryCurrPage == "requisition"){
			if ($rootScope.gv_travelShowDetailsFrom == "CLAIM_LIST"){
				$rootScope.reqestPageLastTab = "CLAIM_TRAVEL"
				$state.go('requestClaimList')
			}else{
				$state.go('requestTravelApplicationID')
			}
			//$state.go('requestTravelApplicationID')
		}else{
			$state.go("approvalTravelList")
		}
		//$ionicNavBarDelegate.back();
		//$state.go("app.MyApprovalsCombined")
	}

	$scope.addRowGrid1 = function () {
		if ($scope.countGrid1<10){
			$scope.countGrid1++
			btnAdd = document.getElementById("btnAddRowGrid1")
			btnRem = document.getElementById("btnRemRowGrid1")
			btnAdd.style.marginTop = (-50 + ($scope.countGrid1 * 5)).toString() + "%"
			btnRem.style.marginTop = (-50 + ($scope.countGrid1 * 5)).toString() + "%"
			//document.getElementById("trGrid1_"+$scope.countGrid1).style.height="auto"
		}

	}
	$scope.remRowGrid1 = function () {
		if ($scope.countGrid1>1)
		$scope.countGrid1--
			btnAdd = document.getElementById("btnAddRowGrid1")
			btnRem = document.getElementById("btnRemRowGrid1")
			btnAdd.style.marginTop = (-50 + ($scope.countGrid1 * 5)).toString() + "%"
			btnRem.style.marginTop = (-50 + ($scope.countGrid1 * 5)).toString() + "%"
	}


	$scope.addRowGrid2 = function () {
		if ($scope.countGrid2<10){
			$scope.countGrid2++
			btnAdd = document.getElementById("btnAddRowGrid2")
			btnRem = document.getElementById("btnRemRowGrid2")
			btnAdd.style.marginTop = (-50 + ($scope.countGrid2 * 5)).toString() + "%"
			btnRem.style.marginTop = (-50 + ($scope.countGrid2 * 5)).toString() + "%"

		}

	}
	$scope.remRowGrid2 = function () {
		if ($scope.countGrid2>1)
		$scope.countGrid2--
			btnAdd = document.getElementById("btnAddRowGrid2")
			btnRem = document.getElementById("btnRemRowGrid2")
			btnAdd.style.marginTop = (-50 + ($scope.countGrid2 * 5)).toString() + "%"
			btnRem.style.marginTop = (-50 + ($scope.countGrid2 * 5)).toString() + "%"
	}

	$scope.addRowGrid3 = function () {
		if ($scope.countGrid3<10){
			$scope.countGrid3++
			btnAdd = document.getElementById("btnAddRowGrid3")
			btnRem = document.getElementById("btnRemRowGrid3")
			btnAdd.style.marginTop = (-50 + ($scope.countGrid3 * 5)).toString() + "%"
			btnRem.style.marginTop = (-50 + ($scope.countGrid3 * 5)).toString() + "%"

		}

	}
	$scope.remRowGrid3 = function () {
		if ($scope.countGrid3>1)
		$scope.countGrid3--
			btnAdd = document.getElementById("btnAddRowGrid3")
			btnRem = document.getElementById("btnRemRowGrid3")
			btnAdd.style.marginTop = (-50 + ($scope.countGrid3 * 5)).toString() + "%"
			btnRem.style.marginTop = (-50 + ($scope.countGrid3 * 5)).toString() + "%"
	}


	$scope.test = function () {
		//alert(document.getElementById("fromPlace0").options[document.getElementById("fromPlace0").selectedIndex].text)
	}

	$scope.doOnChgDate = function (rowno) {

		var travelDate = document.getElementById('travelDate'+rowno).value;

		$scope.donReqObject={}
		$scope.donReqObject.empId = $scope.requestObject.empId
		$scope.donReqObject.travelDate = travelDate
		$scope.donReqObject.menuId = $scope.requestObject.menuId
		$scope.donReqObject.st = ''


		$http({
			url: (baseURL + '/api/travelApplication/getDateValidate.spr'),
			method: 'POST',
			timeout: commonRequestTimeout,
			transformRequest: jsonTransformRequest,
			data: $scope.donReqObject,			
			headers: {
				'Authorization': 'Bearer ' + jwtByHRAPI,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
			}).
				success(function (data_return) {
				if (data_return.msg	== ""){
					//do nothing

				}
				else{

					showAlert(alert_header,data_return.msg)
					$ionicLoading.hide()
					return false
				}

				}).error(function (data_return, status) {
			$scope.data_return = {status: status};
			commonService.getErrorMessage($scope.data_return);
			$ionicLoading.hide()
			})

	}





	$scope.getTravelRuleByDate = function (rowno) {

		typeOfTravel = document.getElementById("typeOfTravel")

		if(typeOfTravel.options[typeOfTravel.selectedIndex].value=='-1'){
			showAlert(alert_header,"Please enter Travel Type");
			return;
		}
		var travelDate = document.getElementById('travelDate'+rowno).value;

		if(travelDate==""){
			showAlert(alert_header,'Please enter proper Travel Date');
			return;
		}

		$scope.gtrReqObject={}
		$scope.gtrReqObject.empId = $scope.requestObject.empId
		$scope.gtrReqObject.travelDate = travelDate
		$scope.gtrReqObject.travelType = typeOfTravel.options[typeOfTravel.selectedIndex].value

		$http({
			url: (baseURL + '/api/travelApplication/getTravelRuleByDate.spr'),
			method: 'POST',
			timeout: commonRequestTimeout,
			transformRequest: jsonTransformRequest,
			data: $scope.gtrReqObject,
			headers: {
				'Authorization': 'Bearer ' + jwtByHRAPI,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
			}).
				success(function (data_return) {
				if (data_return.msg	== ""){
					//do nothing

				}
				else{

					showAlert(alert_header,data_return.msg)
					$ionicLoading.hide()
					return false
				}

				}).error(function (data_return, status) {

				$scope.data_return = {status: status};
				commonService.getErrorMessage($scope.data_return);
				$ionicLoading.hide()
			})


	}



	$scope.getTravelClass = function (grid1) {

		var selIndex = $scope.travelApplicationForm.travelRuleGridChildVOList.indexOf(grid1)
		travelMode = document.getElementById("travelMode"+selIndex)
		var optionSelIndex = travelMode.selectedIndex
		var travelModeId = $scope.listMasterTravelType[travelMode.selectedIndex ].travelModeId

		$scope.gtcReqObject={}
		$scope.gtcReqObject.travelModeId = travelModeId
		$scope.gtcReqObject.menuId = $scope.requestObject.menuId

		$http({
			url: (baseURL + '/api/travelApplication/getTravelClass.spr'),
			method: 'POST',
			timeout: commonRequestTimeout,
			transformRequest: jsonTransformRequest,
			data: $scope.gtcReqObject,
			headers: {
				'Authorization': 'Bearer ' + jwtByHRAPI,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
			}).
				success(function (result) {
					travelClassObject = document.getElementById('travelClassTypeId'+selIndex);

					travelClassObject.options.length=0
					travelClassObject.add(new Option("- Select -",-1));
					for(var count=0; count<result.length ;count++){
						travelClassObject.add(new Option(result[count].travelModeClassName,result[count].travelModeClassId));
						travelClassObject.options[0].selected=true
			        }
					//ng-options="tc as tc.travelModeClassName for tc in travelApplicationForm.listTravelClass track by $index"

					if (!$scope.$$phase)
                    $scope.$apply()


				}).error(function (data_return, status) {
					$scope.data_return = {status: status};
					commonService.getErrorMessage($scope.data_return);
					$ionicLoading.hide()
			})
	}



	$scope.getTravelRuleByMode = function(grid1){

		var i = $scope.travelApplicationForm.travelRuleGridChildVOList.indexOf(grid1)

		if($scope.selectedValues.selectedToT=="-1"){
			showAlert(alert_header,"Please enter Travel Type." );
			return;
		}

		travelMode = document.getElementById("travelMode"+i)
		var travelModeId = $scope.listMasterTravelType[travelMode.selectedIndex ].travelModeId

		travelClassType = document.getElementById("travelClassTypeId"+i)
		var travelClassTypeId = travelClassType.options[travelClassType.selectedIndex].value
		if (travelClassTypeId ==-1){

			return
		}

		var travelDate = document.getElementById('travelDate'+i).value;


		$scope.gtrmReqObject={}
		$scope.gtrmReqObject.traveltype = $scope.selectedValues.selectedToT
		$scope.gtrmReqObject.empId = $scope.requestObject.empId
		$scope.gtrmReqObject.travelModeId = travelModeId
		$scope.gtrmReqObject.menuId = $scope.requestObject.menuId
		$scope.gtrmReqObject.travelClassTypeId =  travelClassTypeId
		$scope.gtrmReqObject.travelDate = travelDate

		$http({
			url: (baseURL + '/api/travelApplication/getTravelRuleByMode.spr'),
			method: 'POST',
			timeout: commonRequestTimeout,
			transformRequest: jsonTransformRequest,
			data: $scope.gtrmReqObject,
			headers: {
				'Authorization': 'Bearer ' + jwtByHRAPI,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
			}).
				success(function (result) {
				if (result.msg	== ""){
					//do nothing

				}
				else{
					showAlert(alert_header,result.msg)
					$ionicLoading.hide()
					return false
				}

				}).error(function (data_return, status) {
					$scope.data_return = {status: status};
					commonService.getErrorMessage($scope.data_return);
					$ionicLoading.hide()
			})

			return true
		}


		$scope.dateValidate = function(i){
			var smallTravelDate = document.getElementById("smallestTravelDate").value;
			var fromDate = document.getElementById('fDate'+i).value;
			var toDate = document.getElementById('tDate'+i).value;

			var z = 0;
			var firstTravelDate = document.getElementById('travelDate'+z).value;
			if(firstTravelDate == ""){
				showAlert(alert_header,"Please Enter Travel Date");
				 document.getElementById('tDate'+i).value = "";
				 document.getElementById('fDate'+i).value = "";
 				  return;
			}
			var listSize = $scope.countGrid3

			for(var j=0; j<=listSize; j++){

				if(compareDate(firstTravelDate, document.getElementById('travelDate'+j).value, $scope.requestObject.dateFormat )!= 1){
					smallTravelDate = document.getElementById('travelDate'+j).value;
				}
			}
			document.getElementById("smallestTravelDate").value = smallTravelDate;

			if(fromDate != ""){
				if (compareDate(fromDate, smallTravelDate,  $scope.requestObject.dateFormat)== 1){
					document.getElementById('fDate'+i).value = "";
					showAlert(alert_header,"From Date must not be less than Travel Date in Stay Arrangement");
  				  return;
           }
			}
		}



		$scope.dateValidator = function (i){
			var fromDate = document.getElementById('fDate'+i).value;
			var toDate = document.getElementById('tDate'+i).value;

			if(fromDate != "" && toDate != ""){

				if (compareDate(fromDate, toDate,  $scope.requestObject.dateFormat)== -1){
					showAlert(alert_header, "To Date must not be less than From Date in Stay Arrangement");
                          document.getElementById('tDate'+i).value = "";
        				  return;
                 }
			}
		}



	$scope.setIsTentative = function(idx){
		if ($scope.travelApplicationForm.travelRuleGridChildVOList[idx].isTentative == null){
			$scope.travelApplicationForm.travelRuleGridChildVOList[idx].isTentative = true
		}else{
			$scope.travelApplicationForm.travelRuleGridChildVOList[idx].isTentative
			= !$scope.travelApplicationForm.travelRuleGridChildVOList[idx].isTentative
		}
	}


	$scope.toggleYesNo = function(idx,strVal){
		return;
		if (strVal=="Y"){
			document.getElementById("yes"+idx).checked=true
			document.getElementById("no"+idx).checked=false

			document.getElementById('currencyTypeId'+idx).disabled=false;
	      	document.getElementById('amount'+idx).disabled=false;
			document.getElementById('currencyTypeId'+idx).style.backgroundColor="white";
			document.getElementById('amount'+idx).style.backgroundColor="white";

		}else{
			document.getElementById("yes"+idx).checked=false
			document.getElementById("no"+idx).checked=true

			document.getElementById('currencyTypeId'+idx).disabled=true;
	      	document.getElementById('amount'+idx).disabled=true;
			document.getElementById('currencyTypeId'+idx).style.backgroundColor="gainsboro";
			document.getElementById('amount'+idx).style.backgroundColor="gainsboro";
		}

		/*
		if ($scope.travelApplicationForm.travelRuleGridChildVOList2[idx].isTentative == null){
			$scope.travelApplicationForm.travelRuleGridChildVOList[idx].isTentative = true
		}else{
			$scope.travelApplicationForm.travelRuleGridChildVOList[idx].isTentative
			= !$scope.travelApplicationForm.travelRuleGridChildVOList[idx].isTentative
		}
		*/
	}




	$scope.cancleTravelApplication = function (){
		  var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to cancel?',
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $scope.cancleTravelApplicationNow()
                    return
                } else {
                    return;
                }
            });
	}


	$scope.cancleTravelApplicationNow = function(){

		var firstTravelDt = $scope.travelClaimForm.travelRuleGridChildVOList[0].travelDate
		var g1size = $scope.travelClaimForm.travelRuleGridChildVOList.length - 1
		var lastTravelDt =$scope.travelClaimForm.travelRuleGridChildVOList[g1size].travelDate
		var level=1

		$scope.requestObject = {}
		//$scope.requestObject.menuId='2609'
		$scope.requestObject.menuId='2607'
		$scope.requestObject.buttonRights="Y-Y-Y-Y"
		$scope.requestObject.level = level
		$scope.requestObject.status = $rootScope.gv_travelShowDetailsStaus
		$scope.requestObject.firstTravelDt = firstTravelDt
		$scope.requestObject.lastTravelDt = lastTravelDt
		$scope.requestObject.empName = $scope.empDetailslist[0].empName
		$scope.requestObject.travelTransId = $rootScope.travelTransIdForClaimApply
		$scope.requestObject.transId = $rootScope.travelTransIdForClaimApply


		$scope.sendForCancellationService = new sendForCancellationService();
		$scope.sendForCancellationService.$save($scope.requestObject, function (data) {
		if (!(data.clientResponseMsg=="OK")){
			console.log(data.clientResponseMsg)
			handleClientResponse(data.clientResponseMsg,"sendForCancellation")
		}
		showAlert(data.msg)
		$scope.redirectOnBack()
		$ionicLoading.hide()
		}, function (data, status) {

		showAlert(data)
		autoRetryCounter = 0
		$ionicLoading.hide()
		commonService.getErrorMessage(data);

	});




	}




	$scope.approveTravel = function (status, travelTransId) {

		
		$scope.detailResObject = {}
        $ionicLoading.show({});
        $scope.detailResObject.travelTransId = travelTransId
        var travelMenuInfo = getMenuInformation("Travel Management", "Travel Application");
        //$scope.detailResObject.menuId = travelMenuInfo.menuId;
		$scope.detailResObject.menuId = '2607'
        $scope.detailResObject.buttonRights = "Y-Y-Y-Y"
        $scope.detailResObject.fromEmail = "N"
		$scope.detailResObject.travelTransIdList=[]
		$scope.detailResObject.travelTransIdList[0]=travelTransId
		$scope.detailResObject.remarks=document.getElementById('apprem').value
		if ($scope.utf8Enabled == 'true' ){
			if ($scope.detailResObject.remarks){
				$scope.detailResObject.remarks = encodeURI($scope.detailResObject.remarks)
			}
		}
		
		if ($rootScope.gv_travelShowDetailsStaus == "SENT FOR APPROVAL"){
		for (var i=0;i<$scope.travelClaimForm.travelRuleGridChildVOList2.length;i++){
			
			apprAmt = document.getElementById('approvedAmt'+i).value;
			if (apprAmt == "" || isNaN(apprAmt)){
				$ionicLoading.hide()
				showAlert("Please enter Approved Amount");
				return;
			
			}	
			$scope.travelClaimForm.travelRuleGridChildVOList2[i].advAmountByAccountant = apprAmt
			}
		}
		$scope.detailResObject.volist2 = JSON.stringify($scope.travelClaimForm.travelRuleGridChildVOList2)


        //$scope.singleApproveTravelAppService = new singleApproveTravelAppService();
        //$scope.singleApproveTravelAppService.$save($scope.detailResObject, function (data) {
		if ($rootScope.gv_travelShowDetailsStaus == "SENT FOR APPROVAL"){
			$scope.approveTravelAppService = new approveTravelAppService();
		}else{
			//$scope.approveTravelAppService = new approveTravelAppService();	
			$scope.approveTravelAppService = new approveSentForCancelTravelAppService();
		}
		

		$scope.approveTravelAppService.$save($scope.detailResObject, function (data) {
		

			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"detailTravelApplicationForClaim")
				showAlert("Something went wrong. Please try later.")
				$scope.redirectOnBack()
				return
			}
				$ionicLoading.hide()
				showAlert(data.msg)
				$scope.redirectOnBack()
				return

        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

    $scope.rejectTravel = function (status, travelTransId) {

        $ionicLoading.show({
        });
		$scope.detailResObject = {}
        $ionicLoading.show({});
        $scope.detailResObject.travelTransId = travelTransId
        var travelMenuInfo = getMenuInformation("Leave Management", "Leave Application");
        //$scope.detailResObject.menuId = travelMenuInfo.menuId;
		$scope.detailResObject.menuId = 2607
        $scope.detailResObject.buttonRights = "Y-Y-Y-Y"
        $scope.detailResObject.fromEmail = "N"

		$scope.detailResObject.travelTransIdList=[]
		$scope.detailResObject.travelTransIdList[0]=travelTransId
		$scope.detailResObject.remarks=document.getElementById('apprem').value
		if ($scope.utf8Enabled == 'true' ){
			if ($scope.detailResObject.remarks){
				$scope.detailResObject.remarks = encodeURI($scope.detailResObject.remarks)
			}
		}

		if ($scope.detailResObject.remarks == ""){
			$ionicLoading.hide();
			showAlert("Please enter Remarks")
			return
		}

        $scope.singleRejectTravelAppService = new singleRejectTravelAppService();
        $scope.singleRejectTravelAppService.$save($scope.detailResObject, function (data) {
				$ionicLoading.hide()
				//showAlert(alert_header,data.msg)
				showAlert(data.msg)
				$scope.redirectOnBack()


				return

        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }



    $scope.onConfirmTravel = function (status, type, travelTransId)
    {
		event.stopPropagation();
        $scope.travelPopUpData = {}

        if (type == 1)
        {
            var myPopup = $ionicPopup.show({
                template: '<form name="myApproveForm"></form>',
                title: 'Do you want to approve?',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'}, {
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
                    $scope.approveTravel(status, travelTransId)
                    return
                } else {
                    return;
                }
            });
        } else if (type == 2)
        {
            var myPopup = $ionicPopup.show({
                template: '<form name="myApproveForm"></form>',
                title: 'Do you want to reject?',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'}, {
                        text: '<b>Reject</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            return true;
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                if (res) {
                    $scope.rejectTravel(status, travelTransId)
                    return
                } else {
                    return;
                }
            });
        }
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


	$scope.applyForClaim = function(){

		$ionicHistory.goBack();
		$state.go('claimApplication');
		return;
	}


  $scope.goCancel  = function (){
    var firstTravelDt = document.getElementById('travelDate'+0).value;
    var listSize = $scope.countGrid3
    var lastTravelDt = document.getElementById('travelDate'+listSize).value;

      $.ajax({
             url: "${pageContext.request.contextPath}/masters/groupMaster/findWorkFlowIsDefined.spr",
            data: {'empId':$("#empId").val(),'menuId':$("#menuId").val(),'applicationDate':firstTravelDt},
              type: 'POST',
			  dataType: 'text',
			  timeout: commonRequestTimeout,
              async:false,
			  headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
             },
              success:function(result){
                if(result != "" && result != null){
                  warningMessageAlert(result, "${alertHeader}");

                }else{//else start
                  $.ajax({
                   url: "${pageContext.request.contextPath}/travel/travelApplication/validateForTravelOd.spr",
                  data: {'empId':$("#empId").val(),'menuId':$("#menuId").val(),'applicationDate':firstTravelDt,'transId':$("#transId").val()},
                    type: 'POST',
					dataType: 'text',
					timeout: commonRequestTimeout,
                    async:false,
					headers: {
						'Authorization': 'Bearer ' + jwtByHRAPI
					 },
                    success:function(result){
                      if(result != "" && result != null){
                        confirmInfoAlert("${alertHeader}",result+ "\n Do you want to cancel?","NO","YES",function(r) {
                    if(r){
                      document.form1.action="sendForCancellation.spr?level=1&firstTravelDt="+firstTravelDt + "&lastTravelDt=" +lastTravelDt;
                      document.form1.submit();
                         }
                        });
                      }
                      else{
                    confirmInfoAlert("${alertHeader}","Your Travel Application status is " + $("#travelStatus").val()+ "\n Do you want to cancel?","NO","YES",function(r) {
                      if(r){
                        document.form1.action="sendForCancellation.spr?level=1&firstTravelDt="+firstTravelDt + "&lastTravelDt=" +lastTravelDt;
                        document.form1.submit();
                           }
                    });
                      }
                    }
                  });
           }//else end
           }
      });

  }

	$scope.init();




});
