/*
 1.This controller is used for applying leaves.
 */

mainModule.factory("detailsTravelClaim", function ($resource) {
	return $resource((baseURL + '/api/travelClaim/detailsTravelClaim.spr'), {}, 
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
mainModule.controller('claimApplicationDetailsCtrl', function ($scope, $rootScope, commonService, $ionicHistory,$window,
	$rootScope, $ionicPopup, $state, $http, $q, $filter, $ionicLoading, addTravelClaimAplication ,$timeout ,
	$ionicNavBarDelegate,getTravelRuleService,detailsTravelClaim) {
	
		
	$rootScope.navHistoryPrevPage = "requestClaimList"
	$rootScope.navHistoryCurrPage = "travel_application"
	$rootScope.navHistoryPrevTab="CLAIM_TRAVEL"	

	$scope.empDetailslist={}
	$scope.travelApplDataObject = {}	
	$scope.travelAppVo = {}
	$scope.travelClaimForm = {}
	$scope.travelClaimForm.travelClaimExpense = []
	
	
	$scope.requestObject={}
	$scope.requestObject.dateFormat = "dd/MM/yyyy"
	$scope.reslutObject={}
	$scope.selectedValues={}
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
	$scope.shownTab8 = null
	$scope.shownTab9 = null
	
	$scope.countGrid1 = 1
	$scope.countGrid2 = 1 //stay location
	$scope.countGrid3 = 1 //LB
	$scope.countGrid4= 1 //LC
	$scope.countGrid5 = 1// da
	$scope.countGrid6 = 1 //Curr wise total

	$ionicLoading.show()
	
	$timeout(function () {
		document.getElementById('apprRejButtons').style.visibility='hidden'
	},500)
	$scope.getCurrencyName = function(currid){
	
		for(var i=0;i<$scope.travelClaimForm.listTravelCurrency.length;i++){
				if($scope.travelClaimForm.listTravelCurrency[i].currencyId==currid){
				
					return $scope.travelClaimForm.listTravelCurrency[i].currencyName;
				}
			}
		}
		
	$scope.getExpenseName = function(expId){
	
		for(var i=0;i<$scope.travelClaimForm.travelClaimExpense.length;i++){
				if($scope.travelClaimForm.travelClaimExpense[i].expenseId==expId){
				
					return $scope.travelClaimForm.travelClaimExpense[i].expenseName;
				}
			}
		}
		
		
	$scope.getLocalConvName = function(convId){
	
		for(var i=0;i<$scope.travelClaimForm.listTravelLocalConveyance.length;i++){
				if($scope.travelClaimForm.listTravelLocalConveyance[i].travelLocalConveyanceId==convId){
				
					return $scope.travelClaimForm.listTravelLocalConveyance[i].localCoveyanceName;
				}
			}
		}	
		

		
	$scope.init = function(){
	$scope.requestObject.menuId='2607'
	$scope.requestObject.buttonRights="Y-Y-Y-Y"
	
	//trans id to be gotten from the prev travel details page via local storaged.
	$scope.requestObject.travelTransId = $rootScope.travelTransIdForClaimApply;
	$scope.requestObject.claimId = $rootScope.claimIdForClaimDetials;
	
	
	
	$scope.detailsTravelClaim = new detailsTravelClaim();
	$scope.detailsTravelClaim.$save($scope.requestObject, function (data) {
		if (!(data.clientResponseMsg=="OK")){
			console.log(data.clientResponseMsg)
			handleClientResponse(data.clientResponseMsg,"detailsTravelClaim")
		}	
			
		$ionicLoading.hide();
		if (data.empDetailslist!=null){
			
			$scope.empDetailslist = data.empDetailslist
			$scope.requestObject.empId=$scope.empDetailslist[0].empId
			//alert($scope.requestObject.empId)
		}
		$scope.countGrid1 = data.travelClaimForm.gridSize
		$scope.countGrid2 = data.travelClaimForm.gridSize1
		
		
		$scope.travelClaimForm = data.travelClaimForm
		$scope.travelClaimForm.travelClaimExpense = data.travelClaimForm.travelClaimExpense
		$scope.travelClaimForm.travelExpenseGridvoList = data.travelClaimForm.travelExpenseGridvoList
		$scope.travelClaimForm.travelClaimDAChildList = data.travelClaimForm.travelClaimDAChildList 
		$scope.travelClaimForm.travelLocalConveyanceGridvoList = data.travelClaimForm.travelLocalConveyanceGridvoList
		$scope.travelClaimForm.travelClaimPaymentDetailsVO = {}
		$scope.travelClaimForm.travelClaimPaymentDetailsVO	 = data.paymentDetailsVO
		
		
		
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
		
		
		$scope.countGrid6 = data.travelClaimForm.travelClaimCurrencyWiseTotalVOList.length
		
		
		
		
		
		for(var i=0; i<	$scope.travelClaimForm.travelRuleGridChildVOList.length;i++){
		
			$scope.travelClaimForm.travelRuleGridChildVOList[i].currencyName=$scope.getCurrencyName($scope.travelClaimForm.travelRuleGridChildVOList[i].currencyTypeId)
		
		}

		for(var i=0; i<	$scope.travelClaimForm.travelExpenseGridvoList.length;i++){
		
			$scope.travelClaimForm.travelExpenseGridvoList[i].expenseName=$scope.getExpenseName($scope.travelClaimForm.travelExpenseGridvoList[i].expenseTypeId)
									
		}
		
		for(var i=0; i<	$scope.travelClaimForm.travelRuleGridChildVOList.length;i++){
		
			$scope.travelClaimForm.travelRuleGridChildVOList[i].currencyName=$scope.getCurrencyName($scope.travelClaimForm.travelRuleGridChildVOList[i].currencyTypeId)
		
		}
		
		for(var i=0; i<	$scope.travelClaimForm.travelClaimCurrencyWiseTotalVOList.length;i++){
			if($scope.travelClaimForm.travelClaimCurrencyWiseTotalVOList[i].currencyId != null){
				$scope.travelClaimForm.travelClaimCurrencyWiseTotalVOList[i].currencyName=$scope.getCurrencyName($scope.travelClaimForm.travelClaimCurrencyWiseTotalVOList[i].currencyId)
			}
		
		}
		
		for(var i=0; i<	$scope.travelClaimForm.travelLocalConveyanceGridvoList.length;i++){
		
			$scope.travelClaimForm.travelLocalConveyanceGridvoList[i].localConvName=$scope.getLocalConvName($scope.travelClaimForm.travelLocalConveyanceGridvoList[i].travelModeTypeId)
									
		}

		for(var i=0; i<	$scope.travelClaimForm.travelLocalConveyanceGridvoList.length;i++){
		
			$scope.travelClaimForm.travelLocalConveyanceGridvoList[i].currencyName=$scope.getCurrencyName($scope.travelClaimForm.travelLocalConveyanceGridvoList[i].currencyTypeId)
									
		}
		
		$scope.travelClaimForm.travelClaimVo.approverAllRemarks = $scope.travelClaimForm.travelClaimVo.approverAllRemarks.replace(/<BR>/g, "\n")
		$scope.travelClaimForm.travelClaimVo.approverAllRemarks = $scope.travelClaimForm.travelClaimVo.approverAllRemarks.replace(/<br>/g, "\n")
		$scope.travelClaimForm.travelClaimVo.approverAllRemarks = $scope.travelClaimForm.travelClaimVo.approverAllRemarks.replace(/<br\/>/g, "\n")
		
	$timeout(function () {$scope.defaultTabs1Open='Y'},500)
	$timeout(function () {
			$scope.defaultTabs2Open='Y'
		},500)
	$timeout(function () {
		
			$scope.defaultTabs3Open='Y'
		
		},500)
	$timeout(function () { 
		if ($scope.countGrid2 > 0){
		$scope.defaultTabs4Open='Y'
		}
		},500)
	$timeout(function () {
		if ($scope.countGrid3 >0){
			$scope.defaultTabs5Open='Y'
			}
		},500)
	$timeout(function () {
		if ($scope.countGrid4 >0){
		$scope.defaultTabs6Open='Y'
		}
		},500)
	$timeout(function () {
		if ($scope.countGrid5 >0){
		$scope.defaultTabs7Open='Y'
		}
		},500)
	$timeout(function () {
		$scope.defaultTabs8Open='Y'
		},500)
	$timeout(function () {$scope.defaultTabs9Open='Y'},500)
	
	if (1==1)return
		
		
		//for purpose of visit drop down
	/*
		$scope.listMasterPOV.push({"povId":"-1","pov":"- Select -"})	
		for(var i=0;i<data.listMasterPOV.length;i++){
			$scope.listMasterPOV.push({"povId":data.listMasterPOV[i].povId.toString(),"pov":data.listMasterPOV[i].pov.toString()})	
		}

		$scope.listDestination.unshift({"fromPlaceId":"-1","fromPlace":"- Select -"})			
		$scope.travelApplicationForm.listDestinationTOPlace.unshift({"destinationId":"-1","destinationName":"- Select -"})					
		$scope.listMasterTravelType.unshift({"travelModeId":"-1","travelMode":"- Select -"})			
		$scope.travelApplicationForm.listTravelCurrency.unshift({"currencyId":"-1","currencyName":"- Select -"})			
		
		if ($scope.travelApplicationForm.listTravelClass != null){
			$scope.travelApplicationForm.listTravelClass.unshift({"travelModeClassId":"-1","travelModeClassName":"- Select -"})					
		}
		else
		{
			$scope.travelApplicationForm.listTravelClass = []
			$scope.travelApplicationForm.listTravelClass.push({"travelModeClassId":"-1","travelModeClassName":"- Select -"})					
		}
		
		
		
		$timeout(function () {
			for(var i=0;i<10;i++){
				sel = document.getElementById("fromPlace"+i)
				if(sel!=null    )
				sel.options[0].selected = true
				
				sel = document.getElementById("toPlace"+i)
				if(sel!=null )
				sel.options[0].selected = true
				
				sel = document.getElementById("travelMode"+i)
				if(sel!=null )
				sel.options[0].selected = true
				
				sel = document.getElementById("travelClassTypeId"+i)
				sel.options.length=0
				sel.add(new Option("- Select -",-1));
				sel.options[0].selected = true

				sel = document.getElementById("currencyTypeId"+i)
				if(sel!=null || sel.optons.length==0){
					sel.options[0].selected = true
				}
				$scope.toggleYesNo(i,'N')
			}
			
			
	/*document.getElementById("travelDate0").value="28/03/2019"
	document.getElementById("fromPlace0").options[1].selected=true
	document.getElementById("toPlace0").options[2].selected=true
	document.getElementById("travelMode0").options[1].selected=true
	
	document.getElementById("travelDate1").value="29/03/2019"
	document.getElementById("fromPlace0").options[3].selected=true
	document.getElementById("toPlace0").options[4].selected=true
	document.getElementById("travelMode0").options[2].selected=true
	
	document.getElementById("stayLocation0").value="loc1"
	document.getElementById("fDate0").value="28/03/2018"
	document.getElementById("tDate0").value="28/03/2018"
	document.getElementById("remarks0").value="Rem 1"
	
	
	document.getElementById("stayLocation1").value="loc2"
	document.getElementById("fDate1").value="29/03/2018"
	document.getElementById("tDate1").value="29/03/2018"
	document.getElementById("remarks1").value="Rem 2"
						

            }, 500)
		
		*/
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
    
      

	$scope.toggleTab8 = function (tab) {
        if ($scope.isTab8Shown(tab) || $scope.defaultTabs8Open=='Y') {
            $scope.shownTab8 = null;
			$scope.defaultTabs8Open='N'
        } else {
            $scope.shownTab8 = tab;
        }
    };
    $scope.isTab8Shown = function (tab) {
        return $scope.shownTab8  === tab;
    };



	$scope.toggleTab9 = function (tab) {
        if ($scope.isTab9Shown(tab) || $scope.defaultTabs9Open=='Y') {
            $scope.shownTab9 = null;
			$scope.defaultTabs9Open='N'
        } else {
            $scope.shownTab9 = tab;
        }
    };
    $scope.isTab9Shown = function (tab) {
        return $scope.shownTab9  === tab;
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
			showAlert("Something went wrong. Please try later.");
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
	
/*	$scope.selectedToT=document.getElementById('typeOfTravel').value
		sel = document.getElementById("travelDate2")
			alert(sel.value)
		sel = document.getElementById("fromPlace2")
			 alert(sel.options[sel.selectedIndex].text);
		sel = document.getElementById("toPlace2")
			 alert(sel.options[sel.selectedIndex].text);
		return;
	*/	
	
		/*
		$http({
			url: (baseURL + '/api/travelApplication/getTravelRule.spr'),
			method: 'POST',
			timeout: commonRequestTimeout,
			transformRequest: jsonTransformRequest,
			data: {'traveltype' :$scope.selectedToT,'empId': $scope.empId},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).
				success(function (data_return) {
				if (data_return	== ""){
					//do nothing
					alert("nothing")
					
				}
				else{
					alert("msg")
					showAlert(data_return)	
				}
					
				}).error(function (data_return, status) {
			$scope.data_return = {status: status};
			commonService.getErrorMessage($scope.data_return);
			$ionicLoading.hide()
		})		*/
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
		$state.go('requestClaimList');
		//$ionicNavBarDelegate.back();
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
					
					showAlert(alert_header ,data_return.msg)	
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
			showAlert( alert_header,"Please enter Travel Type");
			return;
		}
		var travelDate = document.getElementById('travelDate'+rowno).value; 
		
		if(travelDate==""){
			showAlert( alert_header,'Please enter proper Travel Date');
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
	
	
	
	$scope.validateGrid1ValuesOLD = function(){
	 var grid1Valid = true
	
		for (var i=0;i<$scope.countGrid1;i++){
			
			elem = document.getElementById("istentative"+i)
			isTentative = elem.checked
			$scope.travelApplicationForm.travelRuleGridChildVOList[i].isTentative = isTentative

			elem = document.getElementById("travelDate"+i)
			travelDate = elem.value
			

			$scope.travelApplicationForm.travelRuleGridChildVOList[i].travelDate = travelDate
			
			
			if (travelDate!=""){
				
				elem = document.getElementById("fromPlace"+i)
				fromPlace = elem.options[elem.selectedIndex].text
				$scope.travelApplicationForm.travelRuleGridChildVOList[i].fromPlaceId = $scope.listDestination[elem.selectedIndex].fromPlaceId
				
				elem = document.getElementById("toPlace"+i)
				toPlace = elem.options[elem.selectedIndex].text
				$scope.travelApplicationForm.travelRuleGridChildVOList[i].toPlaceId = $scope.travelApplicationForm.listDestinationTOPlace[elem.selectedIndex].destinationId
				
				elem = document.getElementById("travelMode"+i)
				travelMode = elem.options[elem.selectedIndex].text				
				$scope.travelApplicationForm.travelRuleGridChildVOList[i].travelModeId = $scope.listMasterTravelType[elem.selectedIndex].travelModeId
				
				elem = document.getElementById("travelClassTypeId"+i)
				travelClassTypeId = elem.options[elem.selectedIndex].value
				travelClassTypeName = elem.options[elem.selectedIndex].text
				$scope.travelApplicationForm.travelRuleGridChildVOList[i].travelClassTypeId = travelClassTypeId
				
				
				if(fromPlace == "- Select -"){
					//var rect = elem.getBoundingClientRect(); 
					document.getElementById("travelDate"+i).scrollIntoView()
					
					showAlert(alert_header,"Please enter From Place");    
					grid1Valid = false
					$ionicLoading.hide()
					return false; 
				}
				

				if(toPlace == "- Select -"){
					document.getElementById("fromPlace"+i).scrollIntoView()
					showAlert(alert_header,"Please enter To Place" );    
					grid1Valid = false
					$ionicLoading.hide()
					return false; 
				}
				

				if(travelMode == "- Select -"){
					document.getElementById("toPlace"+i).scrollIntoView()
					showAlert(alert_header,"Please enter Mode of Travel");    
					grid1Valid = false
					$ionicLoading.hide()
					return false; 
				}
				

				if(travelClassTypeName == "- Select -"){
					document.getElementById("travelMode"+i).scrollIntoView()
					showAlert(alert_header,"Please enter Travel Class");    
					grid1Valid = false
					$ionicLoading.hide()
					return false; 
				} 
			
				if (isTentative){
					if (compareDate(travelDate,getTodaysDate(), $scope.requestObject.dateFormat)== -1){
						showAlert(alert_header,"Please enter proper Travel Date as Is Tentative is selected");    
						grid1Valid = false
						$ionicLoading.hide()
						return false
					}
				}
			
			
			$scope.g1Object={}
			$scope.g1Object.traveltype = $scope.selectedToT
			$scope.g1Object.empId = $scope.requestObject.empId
			$scope.g1Object.travelDate = travelDate
			$scope.g1Object.menuId = $scope.requestObject.menuId
			$scope.g1Object.st = 'SendForApproval'
			
			var stra=""

			$http({
			url: (baseURL + '/api/travelApplication/getDateValidate.spr'),
			method: 'POST',
			timeout: commonRequestTimeout,
			transformRequest: jsonTransformRequest,
			data: $scope.g1Object,
			async:false,
			headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI,
             	'Content-Type': 'application/x-www-form-urlencoded'
			}
			}).
				success(function (data_return) {
				if (data_return.msg	== ""){
					//do nothing

			/////////////////////////
			$http({
			url: (baseURL + '/api/travelApplication/getTravelDateExist.spr'),
			method: 'POST',
			timeout: commonRequestTimeout,
			transformRequest: jsonTransformRequest,
			data: $scope.g1Object,
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
					$scope.validateMsg1 = data_return.msg
					grid1Valid = false
					$ionicLoading.hide()
					showAlert(alert_header,data_return.msg)	
					return false
				}
					
				}).error(function (data_return, status) {
					$scope.data_return = {status: status};
					grid1Valid = false
					commonService.getErrorMessage($scope.data_return);
					$ionicLoading.hide()
				})									
			////////////////////////
					
				}
				else{
					grid1Valid = false
					showAlert(alert_header,data_return.msg)	
					$ionicLoading.hide()
					return false
				}
					
				}).error(function (data_return, status) {
			$scope.data_return = {status: status};
			grid1Valid = false
			commonService.getErrorMessage($scope.data_return);
			$ionicLoading.hide()
			});	

			}		
		}
		
		//now check grid2values
		
		$timeout(function () { 
		if (grid1Valid == true){
				$scope.validateGrid2Values()
		}else{
			$ionicLoading.hide()
			//alert("grid 1 fail")
		}
			
			},5000)
		
	}
	
	
	$scope.validateGrid1Values = function(){
	 var grid1Valid = true
	
		for (var i=0;i<$scope.countGrid1;i++){
			
			elem = document.getElementById("istentative"+i)
			isTentative = elem.checked
			$scope.travelApplicationForm.travelRuleGridChildVOList[i].isTentative = isTentative

			elem = document.getElementById("travelDate"+i)
			travelDate = elem.value
			

			$scope.travelApplicationForm.travelRuleGridChildVOList[i].travelDate = travelDate
			
			
			if (travelDate!=""){
				
				elem = document.getElementById("fromPlace"+i)
				fromPlace = elem.options[elem.selectedIndex].text
				$scope.travelApplicationForm.travelRuleGridChildVOList[i].fromPlaceId = $scope.listDestination[elem.selectedIndex].fromPlaceId
				
				elem = document.getElementById("toPlace"+i)
				toPlace = elem.options[elem.selectedIndex].text
				$scope.travelApplicationForm.travelRuleGridChildVOList[i].toPlaceId = $scope.travelApplicationForm.listDestinationTOPlace[elem.selectedIndex].destinationId
				
				elem = document.getElementById("travelMode"+i)
				travelMode = elem.options[elem.selectedIndex].text				
				$scope.travelApplicationForm.travelRuleGridChildVOList[i].travelModeId = $scope.listMasterTravelType[elem.selectedIndex].travelModeId
				
				elem = document.getElementById("travelClassTypeId"+i)
				travelClassTypeId = elem.options[elem.selectedIndex].value
				travelClassTypeName = elem.options[elem.selectedIndex].text
				$scope.travelApplicationForm.travelRuleGridChildVOList[i].travelClassTypeId = travelClassTypeId
				
				
				if(fromPlace == "- Select -"){
					//var rect = elem.getBoundingClientRect(); 
					document.getElementById("travelDate"+i).scrollIntoView()
					
					showAlert(alert_header,"Please enter From Place");    
					grid1Valid = false
					$ionicLoading.hide()
					return false; 
				}
				

				if(toPlace == "- Select -"){
					document.getElementById("fromPlace"+i).scrollIntoView()
					showAlert(alert_header,"Please enter To Place" );    
					grid1Valid = false
					$ionicLoading.hide()
					return false; 
				}
				

				if(travelMode == "- Select -"){
					document.getElementById("toPlace"+i).scrollIntoView()
					showAlert(alert_header,"Please enter Mode of Travel");    
					grid1Valid = false
					$ionicLoading.hide()
					return false; 
				}
				

				if(travelClassTypeName == "- Select -"){
					document.getElementById("travelMode"+i).scrollIntoView()
					showAlert(alert_header,"Please enter Travel Class");    
					grid1Valid = false
					$ionicLoading.hide()
					return false; 
				} 
			
				if (isTentative){
					if (compareDate(travelDate,getTodaysDate(), $scope.requestObject.dateFormat)== -1){
						showAlert(alert_header,"Please enter proper Travel Date as Is Tentative is selected");    
						grid1Valid = false
						$ionicLoading.hide()
						return false
					}
				}
			
			
			$scope.g1Object={}
			$scope.g1Object.traveltype = $scope.selectedToT
			$scope.g1Object.empId = $scope.requestObject.empId
			$scope.g1Object.travelDate = travelDate
			$scope.g1Object.menuId = $scope.requestObject.menuId
			$scope.g1Object.st = 'SendForApproval'
			
			var stra=""

			$.ajax({
			async: false,
			url: (baseURL + '/api/travelApplication/getDateValidate.spr'),
			type: 'POST',
			data: $scope.g1Object,
			ContentType: 'application/x-www-form-urlencoded',
			headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
             },
			success : function (data_return) {
				if (data_return.msg	== ""){
					//do nothing

			/////////////////////////
			$http({
			url: (baseURL + '/api/travelApplication/getTravelDateExist.spr'),
			method: 'POST',
			timeout: commonRequestTimeout,
			transformRequest: jsonTransformRequest,
			data: $scope.g1Object,
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
					$scope.validateMsg1 = data_return.msg
					grid1Valid = false
					$ionicLoading.hide()
					showAlert(alert_header,data_return.msg)	
					return false
				}
					
				}).error(function (data_return, status) {
					$scope.data_return = {status: status};
					grid1Valid = false
					commonService.getErrorMessage($scope.data_return);
					$ionicLoading.hide()
				})									
			////////////////////////
					
				}
				else{
					grid1Valid = false
					
					showAlert(alert_header,data_return.msg)	
					$ionicLoading.hide()
					return false
				}
			},		
			 error :function (data_return, status) {
			 $scope.data_return = {status: status};
			 grid1Valid = false
			 commonService.getErrorMessage($scope.data_return);
			 $ionicLoading.hide()
			 }	

			 });
		}
		}
		//now check grid2values
		
		$timeout(function () { 
		if (grid1Valid == true){
				$scope.validateGrid2Values()
		}else{
			$ionicLoading.hide()
			//alert("grid 1 fail")
		}
			
			},2000)
		
	}	
	
	$scope.validateGrid2Values = function(){	
		var firstTravelDate = document.getElementById('travelDate0').value;
		var smallTravelDate = ""
		var largeTravelDate = ""
		var firstTravelDate = ""
		
		var grid2Valid = true
		
		for (var i=0;i<$scope.countGrid2;i++){
			
			 smallTravelDate = document.getElementById("smallestTravelDate").value;	
			 largeTravelDate = document.getElementById("largeTravelDate").value;	
			var z = 0;
			 firstTravelDate = document.getElementById('travelDate'+z).value;

			elem = document.getElementById("stayLocation"+i)
			stayLocation = elem.value
			$scope.travelApplicationForm.travelRuleGridChildVOList1[i].stayLocation = stayLocation
			
			//alert(stayLocation)
			
			elem = document.getElementById("fDate"+i)
			fdate = elem.value
			$scope.travelApplicationForm.travelRuleGridChildVOList1[i].travelFromDate = fdate
			//alert(fdate)
			
			elem = document.getElementById("tDate"+i)
			tdate = elem.value
			$scope.travelApplicationForm.travelRuleGridChildVOList1[i].travelToDate = tdate
			//alert(tdate)
			
			elem = document.getElementById("remarks"+i)
			remarks = elem.value
			$scope.travelApplicationForm.travelRuleGridChildVOList1[i].remarks = remarks
			
			if(stayLocation != ""){
				if(fdate == ""){
					$ionicLoading.hide()
					showAlert(alert_header,'Please enter From Date in Stay Arrangement');
					grid2Valid = false
					return false;
				}
				
				if(tdate == ""){
					$ionicLoading.hide()
					showAlert(alert_header,'Please enter To Date in Stay Arrangement');
					grid2Valid = false
					return false;
				}
				
					if(compareDate(firstTravelDate, document.getElementById('travelDate'+i).value, $scope.requestObject.dateFormat) != 1){
						smallTravelDate = document.getElementById('travelDate'+i).value;
					}
					document.getElementById("smallestTravelDate").value = smallTravelDate;
			
				
					if(compareDate(largeTravelDate, document.getElementById('travelDate'+i).value, $scope.requestObject.dateFormat)!= -1){
						largeTravelDate = document.getElementById('travelDate'+i).value;
						
					}
					document.getElementById("largeTravelDate").value = largeTravelDate;
				
				if(fdate != ""){
				
					if (compareDate(fdate, smallTravelDate,  $scope.requestObject.dateFormat)== 1){
						$ionicLoading.hide()
						showAlert(alert_header,"From Date is less than Travel Date in Stay Arrangement");
	                    //document.getElementById('fDate'+i).value = "";
						grid2Valid = false
	  				  return false;     	
	           		}	
				}
				
				if(fdate != "" && tdate != ""){
					if (compareDate(fdate, tdate, $scope.requestObject.dateFormat )== -1){
						$ionicLoading.hide()
					      showAlert(alert_header,"To Date must not be less than From Date in Stay Arrangement");
                          //document.getElementById('tDate'+i).value="";
						  grid2Valid = false
        				  return false;     	
                 }	
				}
			}
		}
				$scope.smallTravelDate = smallTravelDate
				$scope.largeTravelDate = largeTravelDate
				$timeout(function () { 
				if (grid2Valid == true){
					$scope.validateGrid3Values()
				
					}else{
						$ionicLoading.hide()
						//alert("grid 2 fail")
					}
			
			},1000)
				
				//return true		
	}
	
	
	$scope.validateGrid3Values = function(){	
	//alert("g3")
	var grid3Valid = true
		for (var i=0;i<$scope.countGrid3;i++){
			
			elem = document.getElementById("yes"+i);
			var radioYes =  elem.checked;
			if (radioYes){
				$scope.travelApplicationForm.travelRuleGridChildVOList2[i].yesRadio = "Y"
			}else{
				$scope.travelApplicationForm.travelRuleGridChildVOList2[i].yesRadio = "N"
			}
			
			elem = document.getElementById("no"+i);
			var radioNo =  elem.checked;
			
			
			elem = document.getElementById("currencyTypeId"+i)
			currencyTypeName = elem.options[elem.selectedIndex].text
			currencyTypeId = $scope.travelApplicationForm.listTravelCurrency[elem.selectedIndex].currencyId
			$scope.travelApplicationForm.travelRuleGridChildVOList2[i].currencyTypeId = currencyTypeId
			
			
			
			elem = document.getElementById("amount"+i)
			if (isNaN(elem.value) ==false && elem.value!=""){
				amount = Number(elem.value)
				$scope.travelApplicationForm.travelRuleGridChildVOList2[i].advAmount = amount
			}else{
				amount=0
			}
				
				
			if (radioYes==true)	{
				if(currencyTypeId == '-1'){
					$ionicLoading.hide()
					showAlert(alert_header,"Please Select the currency ");
					grid3Valid = false
					return false;
				}
				if(amount == 0){
					$ionicLoading.hide()
					showAlert(alert_header,"Please enter the amount ");
					grid3Valid = false
					return false;
				}
			}

		}	
		
			$timeout(function () { 
				if (grid3Valid == true){
					$scope.afterGridsValidation()
					}else{
						$ionicLoading.hide()
						//alert("grid 3 fail")
					}
			
			},500)
		

		//return true;
	}
	
	
	$scope.submitForm = function(witDates){
			
		// here all validation over
		
		$scope.travelAppVo.empId= $scope.requestObject.empId
		$scope.travelAppVo.travelType = $scope.selectedValues.selectedToT
		$scope.travelAppVo.povId = $scope.selectedValues.selectedPOV.povId
		$scope.travelAppVo.costBorneBy = $scope.selectedValues.selectedCBB		
		$scope.travelAppVo.additionalInfo = document.getElementById("addi").value
		$scope.travelApplicationForm.travelAppVo = $scope.travelAppVo
		
		
		
		//$scope.sfaReqObject= {}
		
		//$scope.sfaReqObject.menuId = $scope.requestObject.menuId
		//$scope.sfaReqObject.level=1
		//$scope.sfaReqObject.buttonRights = $scope.requestObject.buttonRights
		
		$scope.travelApplicationForm.menuId = $scope.requestObject.menuId
		$scope.travelApplicationForm.level=1
		$scope.travelApplicationForm.buttonRights = $scope.requestObject.buttonRights
		
		$scope.travelApplicationForm.travelRuleGridChildVOList.length = $scope.countGrid1	
		$scope.travelApplicationForm.travelRuleGridChildVOList1.length = $scope.countGrid2	
		$scope.travelApplicationForm.travelRuleGridChildVOList2.length = $scope.countGrid3	
		

		if (witDates){
			$scope.sfaReqObject.smallTravelDate = $scope.smallTravelDate
			$scope.sfaReqObject.largeTravelDate = $scope.largeTravelDate
		}
		
		
		$http({
			url: (baseURL + '/api/travelApplication/sendForApprove.spr'),
			method: 'POST',
			dataType:'json',
			timeout: commonRequestTimeout,
			transformRequest: jsonTransformRequest,
			data:$scope.travelApplicationForm,
			headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI,
             	'Content-Type': 'application/x-www-form-urlencoded'
			}
			}).
				success(function (result) {
					//result is path
					$ionicLoading.hide()
					showAlert(alert_header,result.msg)	
					$state.go('app.RequisitionTravelAndClaim');
					return
				

				}).error(function (result, status) {
					$ionicLoading.hide()
					commonService.getErrorMessage(result);
					$ionicLoading.hide()
			})											
		
	}
		
		
		
	$scope.goSendForApproval = function(){
		//alert("sfa")	
		document.getElementById("myFile").
		
		$scope.validateMsg1 = ""
		$scope.validateMsg2 = ""
		$scope.validateMsg3 = ""
		
		if($scope.selectedValues.selectedToT=="-1"){
			showAlert(alert_header,"Please enter Travel Type." );
			return;
		}
		if($scope.selectedValues.selectedPOV.povId=="-1"){
			showAlert(alert_header,"Please enter Purpose Of Visit." );
			return;
		}
		if($scope.selectedValues.selectedCBB =="-1"){
			showAlert(alert_header,"Please enter Cost Borne By." );
			return;
		}	
		var n=0
		if(document.getElementById('travelDate'+n).value == ""){
			showAlert(alert_header,"Please enter Travel Data -> Travel Date.");    
			return; 
		}		
		
		var grid1Valid = false
		var grid2Valid = false
		var grid3Valid = false
		
		//remove items 
		
		//grid1
		
		$ionicLoading.show()
		grid1Valid = $scope.validateGrid1Values() // this method will be called for grid 2 and grid 3 subsequently
		
		/* (grid1Valid ){
			//grid2
			grid2Valid = $scope.validateGrid2Values()
		}
		if (grid1Valid && grid2Valid ){
			//grid3
			grid3Valid = $scope.validateGrid3Values()
		}	

		if (!(grid1Valid && grid2Valid && grid3Valid ))
		{
			return
		}*/
		
	
	}	
	
	

	$scope.approveClaim = function (){
		var confirmPopup = $ionicPopup.confirm({
						title: alert_header,
					template: 'Do you want to send for approval?', //Message
					});
		confirmPopup.then(function (res) {
						if (res) {
						$ionicLoading.show()
						$scope.submitForm()
						return
						} else {
						return;
					}
					});											
									
	}


	$scope.submitForm = function(){
		$scope.travelClaimForm.menuId = $scope.requestObject.menuId
		$scope.travelClaimForm.level=1
		$scope.travelClaimForm.buttonRights = $scope.requestObject.buttonRights
		
		$http({
			url: (baseURL + '/api/travelClaim/approveTravelClaim.spr'),
			method: 'POST',
			dataType:'json',
			timeout: commonRequestTimeout,
			transformRequest: jsonTransformRequest,
			data:$scope.travelClaimForm,
			headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI,
             	'Content-Type': 'application/x-www-form-urlencoded'
			}
			}).
				success(function (result) {
					//result is path
					$ionicLoading.hide()
					if (result.clientResponseMsg=="OK"){
						showAlert(alert_header,result.msg)		
					}else{
						showAlert(alert_header,"Something went wrong" +"\n"+ result.clientResponseMsg)		
					}
					$state.go('app.RequisitionTravelAndClaim');
					return
				

				}).error(function (result, status) {
					$ionicLoading.hide()
					commonService.getErrorMessage(result);
					$ionicLoading.hide()
			})	
	}
	
	
	$scope.openFileTd = function(event){
		
		var fname = $scope.selectedValues.fileToDownload.innerHTML
		var idx = $scope.selectedValues.elem.id.substring(0,$scope.selectedValues.elem.id.indexOf("_"))
		
		var fileId 
		
		event.stopPropagation();
		
		for (var i=0;i<10000;i++){
			if ($scope.travelClaimForm.travelRuleGridChildVOList[idx].fileTdList[i] == fname.trim())
			{
				fileId = i;
				break;
			}
		}
		//alert(fileId)
		var fd = new FormData();
		fd.append("tdMultiFileId",fileId)
		
		
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
				success : function(result) {
					if (!(result.clientResponseMsg=="OK")){
								console.log(result.clientResponseMsg)
								handleClientResponse(result.clientResponseMsg,"saveWithFile")
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
				error : function(res){
							$ionicLoading.hide()
							showAlert("Something went wrong while fetching the file.");
				}
				
				});
	}
	
	
	$scope.openFileEx = function(event){
		
		var fname = $scope.selectedValues.fileToDownload.innerHTML
		var idx = $scope.selectedValues.elem.id.substring(0,$scope.selectedValues.elem.id.indexOf("_"))
		
		var fileId 
		
		event.stopPropagation();
		
		for (var i=0;i<10000;i++){
			if ($scope.travelClaimForm.travelExpenseGridvoList[idx].fileExList[i] == fname.trim())
			{
				fileId = i;
				break;
			}
		}
		//alert(fileId)
		var fd = new FormData();
		fd.append("exMultiFileId",fileId)
		
		
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
				success : function(result) {
					if (!(result.clientResponseMsg=="OK")){
								console.log(result.clientResponseMsg)
								handleClientResponse(result.clientResponseMsg,"saveWithFile")
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
				error : function(res){
							$ionicLoading.hide()
							showAlert("Something went wrong while fetching the file.");
				}
				
				});
	}	




	$scope.openFileLc = function(event){
		
		var fname = $scope.selectedValues.fileToDownload.innerHTML
		var idx = $scope.selectedValues.elem.id.substring(0,$scope.selectedValues.elem.id.indexOf("_"))
		
		var fileId 
		
		event.stopPropagation();
		
		for (var i=0;i<10000;i++){
			if ($scope.travelClaimForm.travelLocalConveyanceGridvoList[idx].fileLCList[i] == fname.trim())
			{
				fileId = i;
				break;
			}
		}
		//alert(fileId)
		var fd = new FormData();
		fd.append("lcMultiFileId",fileId)
		
		
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
				success : function(result) {
					if (!(result.clientResponseMsg=="OK")){
								console.log(result.clientResponseMsg)
								handleClientResponse(result.clientResponseMsg,"saveWithFile")
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
				error : function(res){
							$ionicLoading.hide()
							showAlert("Something went wrong while fetching the file.");
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

	
	$scope.init();

	
	
	
});
