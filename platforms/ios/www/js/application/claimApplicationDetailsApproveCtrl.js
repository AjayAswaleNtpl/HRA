/*
 1.This controller is used for applying leaves.
 */

mainModule.factory("viewTravelClaimApprove", function ($resource) {
	return $resource((baseURL + '/api/travelClaim/viewTravelClaimApprove.spr'), {}, 
	{ 'save': { method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
	 } }, {});
});

//mainModule.factory("addTravelClaimAplication", function ($resource) {
//return $resource((baseURL + '/api/travelClaim/addTravelClaimAplication.spr'), {}, { 'save': { method: 'POST', timeout: commonRequestTimeout } }, {});
//});
mainModule.factory("getTravelRuleService", function ($resource) {
	return $resource((baseURL + '/api/travelApplication/getTravelRule.spr'), {},
	 { 'save': { method: 'POST', timeout: commonRequestTimeout,
	 headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
	 } }, {});
});
mainModule.controller('claimApplicationDetailsApproveCtrl', function ($scope, $rootScope, commonService, $ionicHistory, $window,
	$rootScope, $ionicPopup, $state, $http, $q, $filter, $ionicLoading, addTravelClaimAplication, $timeout,
	$ionicNavBarDelegate, getTravelRuleService, viewTravelClaimApprove) {


	$rootScope.navHistoryPrevPage = "approvalClaimList"
	//$rootScope.navHistoryCurrPage = "travel_application"
	$rootScope.navHistoryPrevTab = "CLAIM_TRAVEL"



	$scope.empDetailslist = {}
	$scope.travelApplDataObject = {}
	$scope.travelAppVo = {}
	$scope.travelClaimForm = {}
	$scope.travelClaimForm.travelClaimExpense = []


	$scope.requestObject = {}
	$scope.requestObject.dateFormat = "dd/MM/yyyy"
	$scope.reslutObject = {}
	$scope.selectedValues = {}
	$scope.selValues = {}
	$scope.listMasterPOV = []
	$scope.listDestination = []
	//$scope.selectedValues.fromPlace=[]

	$scope.selectedValues = {}
	//made it true to access elements in this div,
	//later depending on flag from server it will be changed
	$scope.isLevelLast = true


	$scope.empId = ""
	$scope.shownTab1 = null
	$scope.shownTab2 = null
	$scope.shownTab3 = null
	$scope.shownTab4 = null
	$scope.shownTab5 = null
	$scope.shownTab6 = null
	$scope.shownTab7 = null
	$scope.shownTab8 = null
	$scope.shownTab9 = null

	$scope.countGrid1 = 1
	$scope.countGrid2 = 1
	$scope.countGrid3 = 1
	$scope.countGrid4 = 1
	$scope.countGrid5 = 1
	$scope.countGrid6 = 1


	if ( getMyHrapiVersionNumber() >= 31){
		$scope.utf8Enabled = 'true'    
	}else{
		$scope.utf8Enabled = 'false'    
	}


	$ionicLoading.show()




	$scope.getCurrencyName = function (currid) {

		for (var i = 0; i < $scope.listCurrency.length; i++) {
			if ($scope.listCurrency[i].currencyId == currid) {
				if ($scope.listCurrency[i].currencyName.indexOf('8377')) {
					return '₹'
				}
				return $scope.listCurrency[i].currencyName;
			}
		}
	}

	$scope.getCurrencyId = function (currName) {

		for (var i = 0; i < $scope.listCurrency.length; i++) {
			if ($scope.listCurrency[i].currencyName == currName) {

				return $scope.listCurrency[i].currencyId;
			}
		}
	}

	$scope.getExpenseName = function (expId) {

		for (var i = 0; i < $scope.travelClaimForm.travelClaimExpense.length; i++) {
			if ($scope.travelClaimForm.travelClaimExpense[i].expenseId == expId) {

				return $scope.travelClaimForm.travelClaimExpense[i].expenseName;
			}
		}
	}


	$scope.getLocalConvName = function (convId) {

		for (var i = 0; i < $scope.travelClaimForm.listTravelLocalConveyance.length; i++) {
			if ($scope.travelClaimForm.listTravelLocalConveyance[i].travelLocalConveyanceId == convId) {

				return $scope.travelClaimForm.listTravelLocalConveyance[i].localCoveyanceName;
			}
		}
	}



	$scope.init = function () {
		$ionicLoading.show()

		$scope.requestObject.menuId = '2609'
		$scope.requestObject.buttonRights = "Y-Y-Y-Y"

		//trans id to be gotten from the prev travel details page via local storaged.
		$scope.requestObject.travelTransId = $rootScope.travelTransIdForClaimApply;
		$scope.requestObject.travelClaimId = $rootScope.claimIdForClaimDetials;
		$scope.requestObject.empId = sessionStorage.getItem('empId')
		$scope.requestObject.status = $rootScope.statusForClaimDetials



		$scope.viewTravelClaimApprove = new viewTravelClaimApprove();
		$scope.viewTravelClaimApprove.$save($scope.requestObject, function (data) {
			if (!(data.clientResponseMsg == "OK")) {
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg, "viewTravelClaimApprove")
				$ionicLoading.hide()
				showAlert("Something went wrong. Please try later.")
				return
			}
			$scope.isLevelLast = data.isLevelLast;	
			$timeout(function () {
				$scope.fillvaluesAfterInit(data)
			}, 500)

			$timeout(function () { $scope.defaultTabs1Open = 'N' }, 1000)
			$timeout(function () { $scope.defaultTabs2Open = 'N' }, 1000)
			$timeout(function () { $scope.defaultTabs3Open = 'N' }, 1000)
			$timeout(function () { $scope.defaultTabs4Open = 'N' }, 1000)
			$timeout(function () { $scope.defaultTabs5Open = 'N' }, 1000)
			$timeout(function () { $scope.defaultTabs6Open = 'N' }, 1000)
			$timeout(function () { $scope.defaultTabs7Open = 'N' }, 1000)
			$timeout(function () { $scope.defaultTabs8Open = 'N' }, 1000)
			$timeout(function () { $scope.defaultTabs9Open = 'Y' }, 1000)
			$timeout(function () { $ionicLoading.hide() }, 1500)
			/*
			$timeout(function () {
				
				if($rootScope.statusForClaimDetials != "SENT FOR APPROVAL"){
					//document.getElementById('apprRejButtons').style.height="0px";
					//document.getElementById('apprRejButtons').style.visibility='hidden'
					
					//document.getElementById('approverRemarks').disabled=true;
				//	document.getElementById('approverRemarks').style.backgroundColor ="silver"
				document.getElementById('apprRejButtons').style.visibility='visible'
				document.getElementById('apprRejButtons').disabled  = true
				document.getElementById('btnApprove').disabled  = true
				document.getElementById('btnRemove').disabled  = true
				
				document.getElementById("approverRemarks").disabled = true
				
				}else{
					document.getElementById('apprRejButtons').style.visibility='visible'
					document.getElementById('apprRejButtons').disabled  = false
					document.getElementById('btnApprove').disabled  = false
					document.getElementById('btnRemove').disabled  = false
				}
				if (document.getElementById("btnCloseClaim")){
					if ($rootScope.statusForClaimDetials=="APPROVED"){
						document.getElementById("btnCloseClaim").disabled = false					
					}else{
						document.getElementById("btnCloseClaim").disabled = true					
					}
				}	
				},2500)*/


		}, function (data, status) {
			autoRetryCounter = 0
			$ionicLoading.hide()
			commonService.getErrorMessage(data);

		});

	}


	$scope.fillvaluesAfterInit = function (data) {

		if (data.empDetailslist != null) {

			$scope.empDetailslist = data.empDetailslist
			$scope.requestObject.empId = $scope.empDetailslist[0].empId
			//alert($scope.requestObject.empId)
		}

		$scope.countGrid1 = data.travelClaimForm.gridSize
		$scope.countGrid2 = data.travelClaimForm.gridSize1



		$scope.travelClaimForm = data.travelClaimForm
		//$scope.travelClaimForm.approvalRemarks = data.travelClaimVo.approvalRemarks
		$scope.travelClaimForm.travelClaimExpense = data.travelClaimForm.travelClaimExpense
		$scope.travelClaimForm.travelExpenseGridvoList = data.travelClaimForm.travelExpenseGridvoList
		$scope.travelClaimForm.travelClaimDAChildList = data.travelClaimForm.travelClaimDAChildList
		$scope.travelClaimForm.travelLocalConveyanceGridvoList = data.travelClaimForm.travelLocalConveyanceGridvoList
		$scope.travelClaimForm.travelClaimPaymentDetailsVOList = data.travelClaimForm.travelClaimPaymentDetailsVOList
		if ($scope.travelClaimForm.travelClaimPaymentDetailsVOList.length ==0){
			$scope.travelClaimForm.travelClaimPaymentDetailsVOList[0] = {}
		}
		
		$scope.travelClaimForm.approverAllRemarks = $scope.travelClaimForm.approverAllRemarks.replace(/<br>/g, "\n")
		$scope.travelClaimForm.approverAllRemarks = $scope.travelClaimForm.approverAllRemarks.replace(/<br\/>/g, "\n")
		
		//$scope.travelClaimForm.travelClaimPaymentDetailsVO = {}
		//$scope.travelClaimForm.travelClaimPaymentDetailsVO	 = data.paymentDetailsVO
		$scope.paymentTransactionTypeList = data.paymentTransactionTypeList
		$scope.modeOfPaymentList = data.modeOfPaymentList

		for(var i=0;i<data.travelClaimForm.travelExpenseGridvoList.length;i++){
			if (data.travelClaimForm.travelExpenseGridvoList[i].expenseFromDate==null){
				$scope.countGrid3=i
				break;
			}
		}
		
		for(var i=0;i<data.travelClaimForm.travelLocalConveyanceGridvoList.length;i++){
			if (data.travelClaimForm.travelLocalConveyanceGridvoList[i].lcTravelMode==null){
				$scope.countGrid4=i
				break;
			}
		}
		for(var i=0;i<data.travelClaimForm.travelClaimDAChildList.length;i++){
			if (data.travelClaimForm.travelClaimDAChildList[i].dailyAllowance==null){
				$scope.countGrid5=i
				break;
			}
		}

		if (data.listCurrency) {
			$scope.listCurrency = data.listCurrency
			for (var i = 0; i < $scope.listCurrency.length; i++) {
				if ($scope.listCurrency[i].currencyName.indexOf('8377') > -1) {
					$scope.listCurrency[i].currencyName = '₹'
				}
			}
		}



		$scope.countGrid6 = data.travelClaimForm.travelClaimCurrencyWiseTotalVOList.length


		if (!$scope.$$phase)
			$scope.$apply()


		for (var i = 0; i < $scope.travelClaimForm.travelExpenseGridvoList.length; i++) {

			$scope.travelClaimForm.travelExpenseGridvoList[i].expenseName = $scope.getExpenseName($scope.travelClaimForm.travelExpenseGridvoList[i].expenseTypeId)

		}



		//filling drop downs data object
		if ($scope.isLevelLast || $scope.modeOfPaymentList != null) {
			var transTypeElement = document.getElementById('paytransType0');
			if (transTypeElement) {
				transTypeElement.options.length = 0
				transTypeElement.add(new Option("- Select -", -1));
				for (var count = 0; count < $scope.paymentTransactionTypeList.length; count++) {
					transTypeElement.add(new Option($scope.paymentTransactionTypeList[count].toLowerCase(), $scope.paymentTransactionTypeList[count]));

				}
				transTypeElement.options[0].selected = true
			}



			var paymentModeElement = document.getElementById('modeOfPayment0');
			if (paymentModeElement) {
				paymentModeElement.options.length = 0
				paymentModeElement.add(new Option("- Select -", -1));
				for (var count = 0; count < $scope.modeOfPaymentList.length; count++) {
					paymentModeElement.add(new Option($scope.modeOfPaymentList[count].name, $scope.modeOfPaymentList[count].name));

				}
				paymentModeElement.options[0].selected = true
			}


			var currTypeElement = document.getElementById('modeOfPaymentCurrency0');
			if (currTypeElement) {
				currTypeElement.options.length = 0
				currTypeElement.add(new Option("- Select -", -1));
				for (var count = 0; count < $scope.listCurrency.length; count++) {
					currTypeElement.add(new Option($scope.listCurrency[count].currencyName, $scope.listCurrency[count].currencyName));

				}
				currTypeElement.options[0].selected = true
			}

			if (!$scope.$$phase)
				$scope.$apply()



			//populate payment details section
			if ($scope.travelClaimForm.travelClaimPaymentDetailsVOList[0].status) {
				if ($scope.travelClaimForm.travelClaimPaymentDetailsVOList[0].status != "CLOSED") {
					//let buttons be  enabled 
				} else {
					//check if it is closed, disable both buttons
					
					if ($scope.travelClaimForm.travelClaimPaymentDetailsVOList[0].status == "CLOSED") {
						//document.getElementById("btnSave").disabled = true
						document.getElementById("btnCloseClaim").disabled = true
					} else {
						//
						//document.getElementById("btnSave").disabled = false
						document.getElementById("btnCloseClaim").disabled = false
					}
					
					if ($rootScope.statusForClaimDetials == "SENT FOR APPROVAL") {
						document.getElementById("btnCloseClaim").disabled = true
					}
				
				}
			}



			//transTypeElement.text = $scope.travelClaimForm.travelClaimPaymentDetailsVO.paymentTransactionType.toLowerCase()
			for (var i = 0; i < transTypeElement.options.length; i++) {
				if ($scope.travelClaimForm.travelClaimPaymentDetailsVOList[0].status) {
					if ($scope.travelClaimForm.travelClaimPaymentDetailsVOList[0].paymentTransactionType != null) {
						if (transTypeElement.options[i].label == $scope.travelClaimForm.travelClaimPaymentDetailsVOList[0].paymentTransactionType.toLowerCase()) {
							transTypeElement.options[i].selected = true
							//$scope.selectedValues.selectedTransType = transTypeElement.options[i].value		
							break;
						}
					}
				}
			}

			for (var i = 0; i < paymentModeElement.options.length; i++) {
				if ($scope.travelClaimForm.travelClaimPaymentDetailsVOList[0].status) {
					if ($scope.travelClaimForm.travelClaimPaymentDetailsVOList[0].modeOfPayment != null) {
						if (paymentModeElement.options[i].label == $scope.travelClaimForm.travelClaimPaymentDetailsVOList[0].modeOfPayment) {
							paymentModeElement.options[i].selected = true
							//$scope.selectedValues.paymentMode = paymentModeElement.options[i].value		
							break;
						}
					}
				}
			}

			//paymentModeElement.value = $scope.travelClaimForm.travelClaimPaymentDetailsVO.modeOfPayment

			for (var i = 0; i < currTypeElement.options.length; i++) {
				if ($scope.travelClaimForm.travelClaimPaymentDetailsVOList[0].status){
					if ($scope.travelClaimForm.travelClaimPaymentDetailsVOList[0].currencyType != null) {
						if (currTypeElement.options[i].label == "₹" &&
						$scope.travelClaimForm.travelClaimPaymentDetailsVOList[0].currencyType.indexOf('8377') > -1) {
							currTypeElement.options[i].selected = true
							break;
						}
						if (currTypeElement.options[i].label == $scope.travelClaimForm.travelClaimPaymentDetailsVOList[0].currencyType) {
							currTypeElement.options[i].selected = true
							//$scope.selectedValues.currType = currTypeElement.options[i].value		
							break;
						}
					}
				}
			}

			if ($scope.travelClaimForm.travelClaimPaymentDetailsVOList[0].status){
				$scope.selectedValues.accountDetails = $scope.travelClaimForm.travelClaimPaymentDetailsVOList[0].accountDetails
				$scope.selectedValues.chequeNo = $scope.travelClaimForm.travelClaimPaymentDetailsVOList[0].chequeNo
				$scope.selectedValues.amount = $scope.travelClaimForm.travelClaimPaymentDetailsVOList[0].travelClaimAmount
			}

		}
		
		if (!($rootScope.statusForClaimDetials == "SENT FOR APPROVAL")) {
			
			//document.getElementById('apprRejButtons').style.height="0px";
			//document.getElementById('apprRejButtons').style.visibility='hidden'

			//document.getElementById('approverRemarks').disabled=true;
			//	document.getElementById('approverRemarks').style.backgroundColor ="silver"
			document.getElementById('apprRejButtons').style.visibility = 'visible'
			document.getElementById('apprRejButtons').disabled = true
			document.getElementById('btnApprove').disabled = true
			document.getElementById('btnRemove').disabled = true

			document.getElementById("approverRemarks").disabled = true

		} else {
			
			document.getElementById('apprRejButtons').style.visibility = 'visible'
			document.getElementById('apprRejButtons').disabled = false
			document.getElementById('btnApprove').disabled = false
			document.getElementById('btnRemove').disabled = false
		}
		if (document.getElementById("btnCloseClaim")) {
			if ($rootScope.statusForClaimDetials == "APPROVED") {
				document.getElementById("btnCloseClaim").disabled = false
			} else {
				document.getElementById("btnCloseClaim").disabled = true
			}
		}

		if (data.isLevelLast != null) {
			$scope.isLevelLast = data.isLevelLast;
		}
		else {
			$scope.isLevelLast = false;
		}
		$ionicLoading.hide();
	}



	$scope.savePaymentDtls = function () {
		var transType = $scope.selectedValues.selectedTransType
		var modeOfPayment = $scope.selectedValues.paymentMode
		var accountDetails = $scope.selectedValues.accountDetails
		var chequeNo = $scope.selectedValues.chequeNo
		var payAmount = $scope.selectedValues.amount
		var modeOfPaymentCurrency = $scope.selectedValues.currType

		if (modeOfPayment == "-1") {
			showAlert("Please select At least one Mode Of Payment!");
			return;
		}
		if (payAmount == "") {
			showAlert("Please enter Amount!");
			return;
		}
		if (modeOfPaymentCurrency == "-1") {
			showAlert("Please enter Currency!");
			return;
		}

		$scope.payDetlsReqObject = {}
		$scope.payDetlsReqObject.menuId = $scope.requestObject.menuId
		$scope.payDetlsReqObject.buttonRights = $scope.requestObject.buttonRights

		$scope.payDetlsReqObject.transType = transType
		$scope.payDetlsReqObject.modeOfPayment = modeOfPayment
		$scope.payDetlsReqObject.accountDetails = accountDetails
		$scope.payDetlsReqObject.chequeNo = chequeNo
		$scope.payDetlsReqObject.payAmount = payAmount
		$scope.payDetlsReqObject.modeOfPaymentCurrency = modeOfPaymentCurrency
		$scope.payDetlsReqObject.travelTransId = $rootScope.travelTransIdForClaimApply
		$scope.payDetlsReqObject.currencyId = $scope.getCurrencyId(modeOfPaymentCurrency)
		$scope.payDetlsReqObject.claimId = $scope.requestObject.travelClaimId

		var confirmPopup = $ionicPopup.confirm({
			title: '',
			template: 'Do you want to save payment details?', //Message
		});
		confirmPopup.then(function (res) {
			if (res) {
				$ionicLoading.show()
				$scope.submitPaymentForm($scope.payDetlsReqObject)
				return
			} else {
				return;
			}
		});
	}


	$scope.submitPaymentForm = function (reqObject) {

		$http({
			url: (baseURL + '/api/travelClaim/saveApproveTravelClaim.spr'),
			method: 'POST',
			timeout: commonRequestTimeout,
			transformRequest: jsonTransformRequest,
			data: reqObject,
			headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI,
             	'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).
			success(function (data_return) {
				if (data_return.msg == "") {
					//do nothing

				}
				else {
					//success
					showAlert(data_return.msg)
					//document.getElementById("btnSave").disabled = true
					document.getElementById("approverRemarks").disabled = true


					if ($rootScope.statusForClaimDetials == "APPROVED") {
						document.getElementById("btnCloseClaim").disabled = false
					} else {
						document.getElementById("btnCloseClaim").disabled = true
					}

					$ionicLoading.hide()
				}
				$ionicLoading.hide()

			}).error(function (data_return, status) {
				$scope.data_return = { status: status };
				commonService.getErrorMessage($scope.data_return);
				$ionicLoading.hide()
			});
	}


	$scope.goClose = function () {


		// var transType =  $scope.selectedValues.selectedTransType
		var transType
		var transTypeElement = document.getElementById('paytransType0');
		for (var i = 0; i < transTypeElement.options.length; i++) {
			if (transTypeElement.options[i].selected) {
				//transType = transTypeElement.options[i].value
				transType = $scope.paymentTransactionTypeList[i - 1]
				break;
			}
		}

		// var modeOfPayment = $scope.selectedValues.paymentMode
		var modeOfPayment;
		var modeOfPaymentText;
		var paymentModeElement = document.getElementById('modeOfPayment0');
		for (var i = 0; i < paymentModeElement.options.length; i++) {
			if (paymentModeElement.options[i].selected) {
				modeOfPayment = paymentModeElement.options[i].value
				modeOfPaymentText = paymentModeElement.options[i].label
				break;
			}
		}
		
		var accountDetails = $scope.selectedValues.accountDetails
		var chequeNo = $scope.selectedValues.chequeNo
		var payAmount = $scope.selectedValues.amount
		// var modeOfPaymentCurrency = $scope.selectedValues.currType
		var modeOfPaymentCurrency
		var currTypeElement = document.getElementById('modeOfPaymentCurrency0');
		for (var i = 0; i < currTypeElement.options.length; i++) {
			if (currTypeElement.options[i].selected) {
				modeOfPaymentCurrency = currTypeElement.options[i].value
				break;
			}
		}

		if (modeOfPayment == "-1") {
			showAlert("Please select Mode Of Payment!");
			return;
		}
		if (payAmount == "") {
			showAlert("", "Please enter Amount!");
			return;
		}
		if (modeOfPaymentCurrency == "-1") {
			showAlert("", "Please enter Currency!");
			return;
		}

		if (modeOfPaymentText == "CHEQUE"){
			if ($scope.selectedValues.chequeNo === undefined || $scope.selectedValues.chequeNo ==""){
				showAlert("Cheque No can not be blank")
				return
			}
		}

		$scope.payDetlsReqObject = {}
		$scope.payDetlsReqObject.menuId = $scope.requestObject.menuId
		$scope.payDetlsReqObject.buttonRights = $scope.requestObject.buttonRights

		$scope.payDetlsReqObject.transType = transType
		$scope.payDetlsReqObject.modeOfPayment = modeOfPayment
		$scope.payDetlsReqObject.accountDetails = accountDetails
		$scope.payDetlsReqObject.chequeNo = chequeNo
		$scope.payDetlsReqObject.payAmount = payAmount
		$scope.payDetlsReqObject.modeOfPaymentCurrency = modeOfPaymentCurrency
		//$scope.payDetlsReqObject.travelTransId= $rootScope.travelTransIdForClaimApply
		$scope.payDetlsReqObject.travelTransId = $rootScope.claimIdForClaimDetials
		$scope.payDetlsReqObject.currencyId = $scope.getCurrencyId(modeOfPaymentCurrency)
		$scope.payDetlsReqObject.travelClaimId = $rootScope.travelTransIdForClaimApply//$scope.requestObject.travelClaimId

		var confirmPopup = $ionicPopup.confirm({
			title: '',
			template: 'Do you want to close claim?', //Message
		});
		confirmPopup.then(function (res) {
			if (res) {
				$ionicLoading.show()
				$scope.closePaymentForm($scope.payDetlsReqObject)
				return
			} else {
				return;
			}
		});
	}


	$scope.closePaymentForm = function (reqObject) {

		$http({
			url: (baseURL + '/api/travelClaim/closeApproveTravelClaim.spr'),
			method: 'POST',
			timeout: commonRequestTimeout,
			transformRequest: jsonTransformRequest,
			data: reqObject,
			headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI,
             	'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).
			success(function (data) {
				if (!(data.clientResponseMsg == "OK")) {
					console.log(data.clientResponseMsg)
					handleClientResponse(data.clientResponseMsg, "closeApproveTravelClaim")
					$ionicLoading.hide()
					showAlert("Something went wrong. Please try later.")
					return
				}
				//success
				$ionicLoading.hide()
				showAlert(data.msg)
				//document.getElementById("btnSave").disabled = true
				document.getElementById("btnCloseClaim").disabled = true
				$ionicLoading.hide()
				$scope.redirectOnBack()

			}).error(function (data_return, status) {
				$ionicLoading.hide()
				$scope.data_return = { status: status };
				commonService.getErrorMessage($scope.data_return);

			});
	}


	$scope.toggleTab1 = function (tab) {
		if ($scope.isTab1Shown(tab) || $scope.defaultTabs1Open == 'Y') {
			$scope.shownTab1 = null;
			$scope.defaultTabs1Open = 'N'
		} else {
			$scope.shownTab1 = tab;
		}

	}


	$scope.isTab1Shown = function (tab) {
		return $scope.shownTab1 === tab;
	}

	$scope.toggleTab2 = function (tab) {

		if ($scope.isTab2Shown(tab) || $scope.defaultTabs2Open == 'Y') {
			$scope.shownTab2 = null;
			$scope.defaultTabs2Open = 'N'
		} else {
			$scope.shownTab2 = tab;
		}
	}
	$scope.isTab2Shown = function (tab) {
		return $scope.shownTab2 === tab;
	}


	$scope.toggleTab3 = function (tab) {
		if ($scope.isTab3Shown(tab) || $scope.defaultTabs3Open == 'Y') {
			$scope.shownTab3 = null;
			$scope.defaultTabs3Open = 'N'
		} else {
			$scope.shownTab3 = tab;
		}
	}
	$scope.isTab3Shown = function (tab) {
		return $scope.shownTab3 === tab;
	}


	$scope.toggleTab4 = function (tab) {
		if ($scope.isTab4Shown(tab) || $scope.defaultTabs4Open == 'Y') {
			$scope.shownTab4 = null;
			$scope.defaultTabs4Open = 'N'
		} else {
			$scope.shownTab4 = tab;
		}
	}
	$scope.isTab4Shown = function (tab) {
		return $scope.shownTab4 === tab;
	}



	$scope.toggleTab5 = function (tab) {
		if ($scope.isTab5Shown(tab) || $scope.defaultTabs5Open == 'Y') {
			$scope.shownTab5 = null;
			$scope.defaultTabs5Open = 'N'
		} else {
			$scope.shownTab5 = tab;
		}
	}
	$scope.isTab5Shown = function (tab) {
		return $scope.shownTab5 === tab;
	}



	$scope.toggleTab6 = function (tab) {
		if ($scope.isTab6Shown(tab) || $scope.defaultTabs6Open == 'Y') {
			$scope.shownTab6 = null;
			$scope.defaultTabs6Open = 'N'
		} else {
			$scope.shownTab6 = tab;
		}
	}
	$scope.isTab6Shown = function (tab) {
		return $scope.shownTab6 === tab;
	}


	$scope.toggleTab7 = function (tab) {
		if ($scope.isTab7Shown(tab) || $scope.defaultTabs7Open == 'Y') {
			$scope.shownTab7 = null;
			$scope.defaultTabs7Open = 'N'
		} else {
			$scope.shownTab7 = tab;
		}
	}
	$scope.isTab7Shown = function (tab) {
		return $scope.shownTab7 === tab;
	}



	$scope.toggleTab8 = function (tab) {
		if ($scope.isTab8Shown(tab) || $scope.defaultTabs8Open == 'Y') {
			$scope.shownTab8 = null;
			$scope.defaultTabs8Open = 'N'
		} else {
			$scope.shownTab8 = tab;
		}
	}
	$scope.isTab8Shown = function (tab) {
		return $scope.shownTab8 === tab;
	}



	$scope.toggleTab9 = function (tab) {
		if ($scope.isTab9Shown(tab) || $scope.defaultTabs9Open == 'Y') {
			$scope.shownTab9 = null;
			$scope.defaultTabs9Open = 'N'
		} else {
			$scope.shownTab9 = tab;
		}
	}
	$scope.isTab9Shown = function (tab) {
		return $scope.shownTab9 === tab;
	}



	$scope.showVisaDetails = function () {
		//var url="../../eis/eisVisa/viewEisVisaDetails.spr?fromTravel=Y&empId="+empId+"&empCode="+empCode+"&empName="+empName;
		//tb_open_new(url+'&menuId='+document.getElementById('menuId').value+'&buttonRights='+document.getElementById('buttonRights').value+'&height='+550+'&width='+900+'&TB_iframe=true&modal=true');
		showAlert("visa details", "")
	}


	$scope.redirectOnBack = function () {
		$state.go('approvalClaimList');
		//$ionicNavBarDelegate.back();
	}



	$scope.approveClaim = function () {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Are you sure',
			template: 'Do you want to approve claim?', //Message
		});
		confirmPopup.then(function (res) {
			if (res) {
				$ionicLoading.show()
				$scope.submitApproveForm()
				return
			} else {
				return;
			}
		});

	}


	$scope.submitApproveForm = function () {
		$scope.travelClaimForm.menuId = $scope.requestObject.menuId
		$scope.travelClaimForm.level = 1
		$scope.travelClaimForm.buttonRights = $scope.requestObject.buttonRights
		//$scope.travelClaimForm.approvalRemarks = $scope.travelClaimForm.travelClaimVo.approvalRemarks
		$scope.travelClaimForm.travelClaimVo.approvalRemarks = document.getElementById("approverRemarks").value
		if ($scope.utf8Enabled == 'true' ){
			if ($scope.travelClaimForm.travelClaimVo.approvalRemarks){
				$scope.travelClaimForm.travelClaimVo.approvalRemarks = encodeURI($scope.travelClaimForm.travelClaimVo.approvalRemarks)
			}
		}
		

		//$scope.travelClaimForm.approvalRemarks = $scope.travelClaimForm.travelClaimVo.approvalRemarks
		//alert($scope.travelClaimForm.travelClaimVo.approvalRemarks)

		

		$http({
			url: (baseURL + '/api/travelClaim/approveTravelClaim.spr'),
			method: 'POST',
			dataType: 'json',
			timeout: commonRequestTimeout,
			transformRequest: jsonTransformRequest,
			data: $scope.travelClaimForm,
			headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI,
             	'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).
			success(function (result) {
				//result is path
				$ionicLoading.hide()
				if (result.clientResponseMsg == "OK") {
					showAlert(result.msg)
					document.getElementById("btnCloseClaim").disabled = false
				} else {
					showAlert("Something went wrong" + "\n" + result.clientResponseMsg)
				}
				$scope.redirectOnBack()
				//$state.go('app.MyApprovalsCombined')
				return


			}).error(function (result, status) {
				$ionicLoading.hide()
				commonService.getErrorMessage(result);
				$ionicLoading.hide()
			})
	}


	$scope.rejectClaim = function () {
		var confirmPopup = $ionicPopup.confirm({
			title: '',
			template: 'Do you want to reject claim ?', //Message
		});
		confirmPopup.then(function (res) {
			if (res) {
				$ionicLoading.show()
				$scope.submitRejectForm()
				return
			} else {
				return;
			}
		});



	}

	$scope.submitRejectForm = function () {
		$scope.travelClaimForm.menuId = $scope.requestObject.menuId
		$scope.travelClaimForm.buttonRights = $scope.requestObject.buttonRights
		if (document.getElementById('approverRemarks').value == "") {
			showAlert("Please enter Remarks");
			return
		}

		$scope.travelClaimForm.travelClaimVo.approvalRemarks = document.getElementById("approverRemarks").value

		$http({
			url: (baseURL + '/api/travelClaim/reject.spr'),
			method: 'POST',
			dataType: 'json',
			timeout: commonRequestTimeout,
			transformRequest: jsonTransformRequest,
			data: $scope.travelClaimForm,
			headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI,
             	'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).
			success(function (result) {
				//result is path
				$ionicLoading.hide()
				if (result.clientResponseMsg == "OK") {
					showAlert("", result.msg)
				} else {
					showAlert("", "Something went wrong" + "\n" + result.clientResponseMsg)
				}
				$scope.redirectOnBack()
				//$state.go('app.RequisitionTravelAndClaim');
				return


			}).error(function (result, status) {
				$ionicLoading.hide()
				commonService.getErrorMessage(result);
				$ionicLoading.hide()
			})
	}




	$scope.openFileTd = function (event) {

		var fname = $scope.selectedValues.fileToDownload.innerHTML
		var idx = $scope.selectedValues.elem.id.substring(0, $scope.selectedValues.elem.id.indexOf("_"))

		var fileId

		event.stopPropagation();

		for (var i = 0; i < 10000; i++) {
			if ($scope.travelClaimForm.travelRuleGridChildVOList[idx].fileTdList[i] == fname.trim()) {
				fileId = i;
				break;
			}
		}
		//alert(fileId)
		var fd = new FormData();
		fd.append("tdMultiFileId", fileId)


		$.ajax({
			url: baseURL + '/api/travelClaim/openFileTd.spr',
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
					handleClientResponse(result.clientResponseMsg, "saveWithFile")
					$ionicLoading.hide()
					showAlert("Something went wrong. Please try later.")
					return
				}
				$scope.FileParmsObject = {}
				$scope.FileParmsObject.uploadFile = result.uploadFile
				$scope.FileParmsObject.uploadContentType = result.uploadContentType
				$scope.FileParmsObject.uploadFileName = result.uploadFileName


				$scope.downloadAttachmnent($scope.FileParmsObject)
				$ionicLoading.hide()
			},
			error: function (res) {
				$ionicLoading.hide()
				showAlert("Something went wrong while fetching the file.");
			}

		});
	}


	$scope.openFileEx = function (event) {

		var fname = $scope.selectedValues.fileToDownload.innerHTML
		var idx = $scope.selectedValues.elem.id.substring(0, $scope.selectedValues.elem.id.indexOf("_"))

		var fileId

		event.stopPropagation();

		for (var i = 0; i < 10000; i++) {
			if ($scope.travelClaimForm.travelExpenseGridvoList[idx].fileExList[i] == fname.trim()) {
				fileId = i;
				break;
			}
		}
		//alert(fileId)
		var fd = new FormData();
		fd.append("exMultiFileId", fileId)


		$.ajax({
			url: baseURL + '/api/travelClaim/openFile.spr',
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
					handleClientResponse(result.clientResponseMsg, "saveWithFile")
					$ionicLoading.hide()
					showAlert("Something went wrong. Please try later.")
					return
				}
				$scope.FileParmsObject = {}
				$scope.FileParmsObject.uploadFile = result.uploadFile
				$scope.FileParmsObject.uploadContentType = result.uploadContentType
				$scope.FileParmsObject.uploadFileName = result.uploadFileName


				$scope.downloadAttachmnent($scope.FileParmsObject)
				$ionicLoading.hide()
			},
			error: function (res) {
				$ionicLoading.hide()
				showAlert("Something went wrong while fetching the file.");
			}

		});
	}




	$scope.openFileLc = function (event) {

		var fname = $scope.selectedValues.fileToDownload.innerHTML
		var idx = $scope.selectedValues.elem.id.substring(0, $scope.selectedValues.elem.id.indexOf("_"))

		var fileId

		event.stopPropagation();

		for (var i = 0; i < 10000; i++) {
			if ($scope.travelClaimForm.travelLocalConveyanceGridvoList[idx].fileLCList[i] == fname.trim()) {
				fileId = i;
				break;
			}
		}
		//alert(fileId)
		var fd = new FormData();
		fd.append("lcMultiFileId", fileId)


		$.ajax({
			url: baseURL + '/api/travelClaim/openFile1.spr',
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
					handleClientResponse(result.clientResponseMsg, "saveWithFile")
					$ionicLoading.hide()
					showAlert("Something went wrong. Please try later.")
					return
				}
				$scope.FileParmsObject = {}
				$scope.FileParmsObject.uploadFile = result.uploadFile
				$scope.FileParmsObject.uploadContentType = result.uploadContentType
				$scope.FileParmsObject.uploadFileName = result.uploadFileName


				$scope.downloadAttachmnent($scope.FileParmsObject)
				$ionicLoading.hide()
			},
			error: function (res) {
				$ionicLoading.hide()
				showAlert("Something went wrong while fetching the file.");
			}

		});
	}



	$scope.downloadAttachmnent = function (travel) {

		var strData = travel.uploadFile
		//var strUrlPrefix='data:"application/pdf;base64,'
		var strUrlPrefix = 'data:' + travel.uploadContentType + ";base64,"
		var url = strUrlPrefix + strData
		var blob = base64toBlob(strData, travel.uploadContentType)
		downloadFileFromData(travel.uploadFileName, blob, travel.uploadContentType)
		event.stopPropagation();
	}



	$scope.init();



});
