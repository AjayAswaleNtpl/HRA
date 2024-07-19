/*
 1.This controller is used for applying leaves.
 */

mainModule.factory("addTravelApplicationService", function ($resource) {
	return $resource((baseURL + '/api/travelApplication/addTravelApplication.spr'), {}, { 'save': { method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 } } }, {});
});
mainModule.factory("getTravelRuleService", function ($resource) {
	return $resource((baseURL + '/api/travelApplication/getTravelRule.spr'), {}, { 'save': { method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 } } }, {});
});
mainModule.controller('travelApplicationCtrl', function ($scope, $rootScope, commonService, $ionicHistory,$window,
	$rootScope, $ionicPopup, $state, $http, $q, $filter, $ionicLoading, addTravelApplicationService ,$timeout ,
	$ionicNavBarDelegate,getTravelRuleService) {



	$rootScope.navHistoryPrevPage = "requestTravelApplicationID"
	//$rootScope.navHistoryCurrPage = "travel_application"

	$rootScope.navHistoryPrevTab="TRAVEL"

	$scope.empDetailslist={}
	$scope.travelApplDataObject = {}
	$scope.travelAppVo = {}
	$scope.travelApplicationForm = {}
	//$scope.travelApplicationForm = new FormData()
	$scope.travelApplicationForm.travelRuleGridChildVOList = []

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
	$scope.countGrid1 = 1
	$scope.countGrid2 = 1
	$scope.countGrid3 = 1

	$scope.radioTypeSelected = ""
	$scope.selectedFileNameFromDevice = ""

	if ( getMyHrapiVersionNumber() >= 31){
		$scope.utf8Enabled = 'true'    
	}else{
		$scope.utf8Enabled = 'false'    
	}

	
	$ionicLoading.show()
	$timeout(function () {$scope.defaultTabs1Open='Y'},1000)
	$timeout(function () {$scope.defaultTabs2Open='Y'},1000)
	$timeout(function () {$scope.defaultTabs3Open='Y'},1000)
	$timeout(function () {$scope.defaultTabs4Open='Y'},1000)
	$timeout(function () {$scope.defaultTabs5Open='Y'},1000)
	$timeout(function () {$scope.defaultTabs6Open='Y'},1000)

	
	$timeout(function () {$ionicLoading.hide()},1000)
	


	$scope.init = function(){
	$scope.requestObject.menuId='2607' //travel
	//$scope.requestObject.menuId='2609'//claim
	$scope.requestObject.buttonRights="Y-Y-Y-Y"
	$scope.addTravelApplicationService = new addTravelApplicationService();
	$scope.addTravelApplicationService.$save($scope.requestObject, function (data) {
		if (!(data.clientResponseMsg=="OK")){
			console.log(data.clientResponseMsg)
			handleClientResponse(data.clientResponseMsg,"addTravelApplicationService")
		}

		$ionicLoading.hide();
		if (data.empDetailslist!=null){
			$scope.empDetailslist = data.empDetailslist
			$scope.requestObject.empId=$scope.empDetailslist[0].empId
			//alert($scope.requestObject.empId)
		}
		$scope.listDestination = data.listDestination

		$scope.listMasterTravelType = data.listMasterTravelType
		$scope.listTravelModeClass = data.listTravelModeClass
		$scope.travelApplicationForm = data.travelApplicationForm
		$scope.travelApplicationForm.listTravelCurrency = data.travelApplicationForm.listTravelCurrency

		if (data.travelApplicationForm!=null){
			if (data.travelApplicationForm.travelRuleGridChildVOList!=null){
				$scope.travelApplicationForm.travelRuleGridChildVOList = data.travelApplicationForm.travelRuleGridChildVOList
			}
			if (data.travelApplicationForm.travelRuleGridChildVOList1!=null){
				$scope.travelApplicationForm.travelRuleGridChildVOList1 = data.travelApplicationForm.travelRuleGridChildVOList1
			}

			if (data.travelApplicationForm.travelRuleGridChildVOList2!=null){
				$scope.travelApplicationForm.travelRuleGridChildVOList2 = data.travelApplicationForm.travelRuleGridChildVOList2
			}

			if (data.travelApplicationForm.listDestinationTOPlace!=null){
				$scope.travelApplicationForm.listDestinationTOPlace =  data.travelApplicationForm.listDestinationTOPlace
			}
			if (data.travelApplicationForm.listTravelClass!=null){
				$scope.travelApplicationForm.listTravelClass = data.travelApplicationForm.listTravelClass
			}
			if (data.travelApplicationForm.listTravelCurrency!=null){
        $scope.travelApplicationForm.listTravelCurrency = data.travelApplicationForm.listTravelCurrency
        for(var i=0;i<$scope.travelApplicationForm.listTravelCurrency.length;i++){
          if ($scope.travelApplicationForm.listTravelCurrency[i].currencyName.indexOf('8377')>-1){
            $scope.travelApplicationForm.listTravelCurrency[i].currencyName = '₹'
          }
        }

    }
  }



		//for purpose of visit drop down

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
				if(sel!=null || sel.options.length==0){
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
	*/

            }, 500)

		//$scope.selectedValues.selectedToT = "International"
		//$scope.selectedValues.selectedCBB = "Company"

		$scope.selectedValues.selectedPOV = $scope.listMasterPOV[0]

		$ionicLoading.hide()
	}, function (data, status) {
		autoRetryCounter = 0
		$ionicLoading.hide()
		commonService.getErrorMessage(data);

	});

	}





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



	$scope.getTravelRule = function() {

	$scope.selectedToT=document.getElementById('typeOfTravel').value

	if ($scope.selectedToT == "Local"){
		for(var i=0 ; i< $scope.countGrid2 ; i++){
			document.getElementById('stayLocation'+i).disabled  = true
			document.getElementById('fDate'+i).disabled  = true
			document.getElementById('tDate'+i).disabled  = true
			document.getElementById('remarks'+i).disabled  = true
		}
		document.getElementById('btnAddRowGrid2').disabled  = true
		document.getElementById('btnRemRowGrid2').disabled  = true

		$scope.grid2 = 0
		
	}else{
		for(var i=0 ; i< $scope.countGrid2 ; i++){
			document.getElementById('stayLocation'+i).disabled  = false
			document.getElementById('fDate'+i).disabled  = false
			document.getElementById('tDate'+i).disabled  = false
			document.getElementById('remarks'+i).disabled  = false
		}
		document.getElementById('btnAddRowGrid2').disabled  = false
		document.getElementById('btnRemRowGrid2').disabled  = false
		$scope.grid2 = 1
	}
	$scope.tObject={}
	$scope.tObject.traveltype = $scope.selectedToT
	$scope.tObject.empId = $scope.requestObject.empId

	$scope.getTravelRuleService = new getTravelRuleService();
	$scope.getTravelRuleService.$save($scope.tObject, function (data_return) {
		if (!(data_return.clientResponseMsg=="OK")){
			console.log(data_return.clientResponseMsg)
			handleClientResponse(data_return.clientResponseMsg,"getTravelRuleService")
			showAlert("Something went wrong. Please try later.");
			//$state.go('app.travelApplication')
			return;
		}
		if (data_return.msg	== ""){
					//do nothing


				}
				else{
					showAlert(data_return.msg)
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


				isTentative = $scope.travelApplicationForm.travelRuleGridChildVOList[selIndex].isTentative
				if (isTentative){
					if (compareDate($scope.travelApplicationForm.travelRuleGridChildVOList[selIndex].travelDate,getTodaysDate(), $scope.requestObject.dateFormat)== 1){
						showAlert("Please enter proper Travel Date as Is Tentative is selected");
						grid1Valid = false
						$ionicLoading.hide()
						return false
					}
				}

				$scope.getTravelRuleByDate(selIndex)

            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
    }


	$scope.setToDateG1 = function (grid1) {
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
                $scope.tDate = date;

				document.getElementById('toTravelDate'+selIndex).value = $filter('date')(date, 'dd/MM/yyyy');
				if (!$scope.$$phase)
                    $scope.$apply()

				//$scope.dateValidator(selIndex)

            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
    }

	$scope.redirectOnBack = function () {
		$state.go('requestTravelApplicationID')
		//$ionicNavBarDelegate.back();

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

				//$scope.dateValidate(selIndex)
				$scope.dateValidator(selIndex)
				res = $scope.stayArrdateValidateFromTravelDate(document.getElementById('fDate'+selIndex).value)
				if (res == false){
					document.getElementById('fDate'+selIndex).value = ""
				}

            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
    }



	$scope.setToDate = function (grid2) {
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
                $scope.tDate = date;


				document.getElementById('tDate'+selIndex).value = $filter('date')(date, 'dd/MM/yyyy');
				if (!$scope.$$phase)
                    $scope.$apply()

				$scope.dateValidator(selIndex)
				res = $scope.stayArrdateValidateFromTravelDate(document.getElementById('tDate'+selIndex).value)
				if (res == false){
					document.getElementById('tDate'+selIndex).value = ""
				}

            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
    }

	$scope.redirectOnBack = function () {
		$state.go('app.RequestListCombined')
		//$ionicNavBarDelegate.back();

	}

	$scope.addRowGrid1 = function () {
		if ($scope.countGrid1<10){
			$scope.countGrid1++
			btnAdd = document.getElementById("btnAddRowGrid1")
			btnRem = document.getElementById("btnRemRowGrid1")
			//btnAdd.style.marginTop = (-50 + ($scope.countGrid1 * 5)).toString() + "%"
			//btnRem.style.marginTop = (-50 + ($scope.countGrid1 * 5)).toString() + "%"
			//document.getElementById("trGrid1_"+$scope.countGrid1).style.height="auto"
		}

	}
	$scope.remRowGrid1 = function () {
		if ($scope.countGrid1>1)
		$scope.countGrid1--
			btnAdd = document.getElementById("btnAddRowGrid1")
			btnRem = document.getElementById("btnRemRowGrid1")
			//btnAdd.style.marginTop = (-50 + ($scope.countGrid1 * 5)).toString() + "%"
			//btnRem.style.marginTop = (-50 + ($scope.countGrid1 * 5)).toString() + "%"
	}


	$scope.addRowGrid2 = function () {
		if ($scope.countGrid2<10){
			$scope.countGrid2++
			btnAdd = document.getElementById("btnAddRowGrid2")
			btnRem = document.getElementById("btnRemRowGrid2")
			//btnAdd.style.marginTop = (-50 + ($scope.countGrid2 * 5)).toString() + "%"
			//btnRem.style.marginTop = (-50 + ($scope.countGrid2 * 5)).toString() + "%"


		}

	}
	$scope.remRowGrid2 = function () {
		if ($scope.countGrid2>1)
		$scope.countGrid2--
			btnAdd = document.getElementById("btnAddRowGrid2")
			btnRem = document.getElementById("btnRemRowGrid2")
			//btnAdd.style.marginTop = (-50 + ($scope.countGrid2 * 5)).toString() + "%"
			//btnRem.style.marginTop = (-50 + ($scope.countGrid2 * 5)).toString() + "%"

	}

	$scope.addRowGrid3 = function () {
		if ($scope.countGrid3<10){
			$scope.countGrid3++
			btnAdd = document.getElementById("btnAddRowGrid3")
			btnRem = document.getElementById("btnRemRowGrid3")
			//btnAdd.style.marginTop = (-50 + ($scope.countGrid3 * 5)).toString() + "%"
			//btnRem.style.marginTop = (-50 + ($scope.countGrid3 * 5)).toString() + "%"

		}

	}
	$scope.remRowGrid3 = function () {
		if ($scope.countGrid3>1)
		$scope.countGrid3--
			btnAdd = document.getElementById("btnAddRowGrid3")
			btnRem = document.getElementById("btnRemRowGrid3")
			//btnAdd.style.marginTop = (-50 + ($scope.countGrid3 * 5)).toString() + "%"
			//btnRem.style.marginTop = (-50 + ($scope.countGrid3 * 5)).toString() + "%"
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




		/*$.ajax({
				type : 'POST',	//Request method: GET, POST
				url: (baseURL + '/api/travelApplication/getDateValidate.spr'),
				data: $scope.donReqObject,
				timeout: commonRequestTimeout,
				async:false,
				success:function(data) {
        //Here you will receive data from server
        //Do what you want to do with data
				//console.log(data)	 //This is a example, like we want to print the result
				alert("ajax " + data.msg)
		}
		})*/



		$http({
			url: (baseURL + '/api/travelApplication/getDateValidate.spr'),
			method: 'POST',
			timeout: commonRequestTimeout,
			transformRequest: jsonTransformRequest,
			data: $scope.donReqObject,

			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Bearer ' + jwtByHRAPI
				}
			}).
				success(function (data_return) {

				if (data_return.msg	== ""){
					//do nothing

				}
				else{
					showAlert(data_return.msg)
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
			showAlert("Please enter Type of Travel");
			return;
		}
		var travelDate = document.getElementById('travelDate'+rowno).value;

		if(travelDate==""){
			showAlert('Please enter proper Travel Date');
			return;
		}

		$scope.gtrReqObject={}
		$scope.gtrReqObject.empId = $scope.requestObject.empId
		$scope.gtrReqObject.travelDate = travelDate
		$scope.gtrReqObject.travelType = typeOfTravel.options[typeOfTravel.selectedIndex].value

		
    //alert($scope.gtrReqObject.travelType)
		$http({
			url: (baseURL + '/api/travelApplication/getTravelRuleByDate.spr'),
			method: 'POST',
			timeout: commonRequestTimeout,
			transformRequest: jsonTransformRequest,
			data: $scope.gtrReqObject,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Bearer ' + jwtByHRAPI
				}
			}).
				success(function (data_return) {
				if (data_return.msg	== ""){
					//do nothing
          			$ionicLoading.hide()
				}
				else{

					showAlert(data_return.msg)
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
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Bearer ' + jwtByHRAPI
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
			showAlert("Please enter Type of Travel." );
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
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Bearer ' + jwtByHRAPI
				}
			}).
				success(function (result) {
				if (result.msg	== ""){
					//do nothing

				}
				else{
					showAlert(result.msg)
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
				showAlert("aaPlease Enter Travel Date");
				 document.getElementById('tDate'+i).value = "";
				 document.getElementById('fDate'+i).value = "";
 				  return;
			}
			var listSize = $scope.countGrid3

			for(var j=0; j<=listSize; j++){
				var firstTravelDatee = document.getElementById('travelDate'+j)
				if(compareDate(firstTravelDatee, fromDate,  document.getElementById("DateFormat").value)== 1 || compareDate(firstTravelDatee, fromDate, document.getElementById("DateFormat").value) == 0){
					//smallTravelDate = document.getElementById('travelDate'+j).value;
					if(compareDate(document.getElementById('toTravelDate'+j).value,fromDate,  document.getElementById("DateFormat").value) != 1){
						flag = "true";
					}
					
				}
				// if(compareDate(firstTravelDate, document.getElementById('travelDate'+j).value, $scope.requestObject.dateFormat )!= 1){
				// 	smallTravelDate = document.getElementById('travelDate'+j).value;
				// }

			}
			document.getElementById("smallestTravelDate").value = smallTravelDate;

			if(fromDate != ""){
				if (compareDate(fromDate, smallTravelDate,  $scope.requestObject.dateFormat)== 1){
					document.getElementById('fDate'+i).value = "";
					showAlert("From Date must not be less than Travel Date in Stay Arrangement");
  				  return;
           }

			}
		}



		$scope.dateValidator = function (i){
			var fromDate = document.getElementById('fDate'+i).value;
			var toDate = document.getElementById('tDate'+i).value;

			if(fromDate != "" && toDate != ""){

				if (compareDate(fromDate, toDate,  $scope.requestObject.dateFormat)== -1){
					showAlert("To Date must not be less than From Date in Stay Arrangement");
                          document.getElementById('tDate'+i).value = "";
        				  return;
                 }
			}

		}



		$scope.stayArrdateValidateFromTravelDate = function (dt){
			//if all looop rows fail then only fail., if any one is pass return success
			for (var j=0;j<$scope.countGrid1;j++){
				var traFdate = document.getElementById('travelDate'+j).value;
				var traTdate = document.getElementById('toTravelDate'+j).value;
				if (compareDate(traFdate,dt,  $scope.requestObject.dateFormat) >= 0 &&
					compareDate(dt, traTdate,  $scope.requestObject.dateFormat) >= 0 ){
					return	true	
					}
			}
			//if control comes here means all fails
			//so the error
			showAlert("Date must be between Trael Date Range");
			return false
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

			//elem = document.getElementById("istentative"+i)
			//isTentative = elem.checked
			//$scope.travelApplicationForm.travelRuleGridChildVOList[i].isTentative = isTentative
			isTentative = $scope.travelApplicationForm.travelRuleGridChildVOList[i].isTentative


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

				if (toTravelDate ==""){
					showAlert("Please enter To Travel Date");
					grid1Valid = false
					$ionicLoading.hide()
					return false;
				}
				if(fromPlace == "- Select -"){
					//var rect = elem.getBoundingClientRect();
					document.getElementById("travelDate"+i).scrollIntoView()

					showAlert("Please enter From Place");
					grid1Valid = false
					$ionicLoading.hide()
					return false;
				}


				if(toPlace == "- Select -"){
					document.getElementById("fromPlace"+i).scrollIntoView()
					showAlert("Please enter To Place" );
					grid1Valid = false
					$ionicLoading.hide()
					return false;
				}


				if(travelMode == "- Select -"){
					document.getElementById("toPlace"+i).scrollIntoView()
					showAlert("Please enter Travel Mode");
					grid1Valid = false
					$ionicLoading.hide()
					return false;
				}


				if(travelClassTypeName == "- Select -"){
					document.getElementById("travelMode"+i).scrollIntoView()
					showAlert("Please enter Travel Class");
					grid1Valid = false
					$ionicLoading.hide()
					return false;
				}

				if (isTentative){
					if (compareDate(travelDate,getTodaysDate(), $scope.requestObject.dateFormat)== -1){
						showAlert("Please enter proper Travel Date as Is Tentative is selected");
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
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Bearer ' + jwtByHRAPI
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
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Bearer ' + jwtByHRAPI
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
					showAlert(data_return.msg)
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
					showAlert(data_return.msg)
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
			
			elem = document.getElementById("toTravelDate"+i)
			toTravelDate = elem.value
			$scope.travelApplicationForm.travelRuleGridChildVOList[i].toTravelDate = toTravelDate
			
			
			


			if (travelDate!=""){

				elem = document.getElementById("fromPlace"+i)
				fromPlace = elem.options[elem.selectedIndex].text
				$scope.travelApplicationForm.travelRuleGridChildVOList[i].fromPlaceId = $scope.listDestination[elem.selectedIndex].fromPlaceId

				elem = document.getElementById("toPlace"+i)
				toPlace = elem.options[elem.selectedIndex].text
				$scope.travelApplicationForm.travelRuleGridChildVOList[i].toPlaceId = $scope.travelApplicationForm.listDestinationTOPlace[elem.selectedIndex].destinationId
					
				///// other places
				if (fromPlace == 'Others'){
					elem = document.getElementById("fromPlacesOther"+i)
					fromPlaceOthers = elem.value
					$scope.travelApplicationForm.travelRuleGridChildVOList[i].fromPlacesOther = fromPlaceOthers
					$scope.travelApplicationForm.travelRuleGridChildVOList[i].fromPlaceId = -2
				}
				if (toPlace == 'Others'){
					elem = document.getElementById("toPlacesOther"+i)
					toPlaceOthers = elem.value
					$scope.travelApplicationForm.travelRuleGridChildVOList[i].toPlacesForOther = toPlaceOthers
					$scope.travelApplicationForm.travelRuleGridChildVOList[i].toPlaceId = -2
				}
				////////////

				elem = document.getElementById("travelMode"+i)
				travelMode = elem.options[elem.selectedIndex].text
				$scope.travelApplicationForm.travelRuleGridChildVOList[i].travelModeId = $scope.listMasterTravelType[elem.selectedIndex].travelModeId

				elem = document.getElementById("travelClassTypeId"+i)
				travelClassTypeId = elem.options[elem.selectedIndex].value
				travelClassTypeName = elem.options[elem.selectedIndex].text
				$scope.travelApplicationForm.travelRuleGridChildVOList[i].travelClassTypeId = travelClassTypeId

				if (toTravelDate ==""){
					showAlert("Please enter To Travel Date");
					grid1Valid = false
					$ionicLoading.hide()
					return false;
				}
				
				if(fromPlace == "- Select -"){
					//var rect = elem.getBoundingClientRect();
					document.getElementById("travelDate"+i).scrollIntoView()

					showAlert("Please enter From Place");
					grid1Valid = false
					$ionicLoading.hide()
					return false;
				}


				if(toPlace == "- Select -"){
					document.getElementById("fromPlace"+i).scrollIntoView()
					showAlert("Please enter To Place" );
					grid1Valid = false
					$ionicLoading.hide()
					return false;
				}
				/// other places if any
				if(fromPlace == "Others"){
					if (document.getElementById("fromPlace"+i).value ="")
					document.getElementById("fromPlace"+i).scrollIntoView()
					showAlert("Please enter From Place");
					grid1Valid = false
					$ionicLoading.hide()
					return false;
				}
				if(toPlace == "Others"){
					if (document.getElementById("toPlace"+i).value ="")
					document.getElementById("toPlace"+i).scrollIntoView()
					showAlert("Please enter To Place");
					grid1Valid = false
					$ionicLoading.hide()
					return false;
				}
				///////////////

				if(travelMode == "- Select -"){
					document.getElementById("toPlace"+i).scrollIntoView()
					showAlert("Please enter Travel Mode");
					grid1Valid = false
					$ionicLoading.hide()
					return false;
				}


				if(travelClassTypeName == "- Select -"){
					document.getElementById("travelMode"+i).scrollIntoView()
					showAlert("Please enter Travel Class");
					grid1Valid = false
					$ionicLoading.hide()
					return false;
				}

				if (isTentative){
					if (compareDate(travelDate,getTodaysDate(), $scope.requestObject.dateFormat)== -1){
						showAlert("Please enter proper Travel Date as Is Tentative is selected");
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
			timeout: commonRequestTimeout,
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
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Bearer ' + jwtByHRAPI
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
					showAlert(data_return.msg)
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

					showAlert(data_return.msg)
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
			if ($scope.utf8Enabled == 'true' ){
				if (remarks){
					remarks = encodeURI(remarks)
				}
			}
			$scope.travelApplicationForm.travelRuleGridChildVOList1[i].remarks = remarks

			if(stayLocation != ""){
				if(fdate == ""){
					$ionicLoading.hide()
					showAlert('Please enter From Date in Stay Arrangement');
					grid2Valid = false
					return false;
				}

				if(tdate == ""){
					$ionicLoading.hide()
					showAlert('Please enter To Date in Stay Arrangement');
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
						showAlert("From Date is less than Travel Date in Stay Arrangement");
	                    //document.getElementById('fDate'+i).value = "";
						grid2Valid = false
	  				  return false;
	           		}
				}

				if(fdate != "" && tdate != ""){
					if (compareDate(fdate, tdate, $scope.requestObject.dateFormat )== -1){
						$ionicLoading.hide()
					      showAlert("To Date must not be less than From Date in Stay Arrangement");
                          //document.getElementById('tDate'+i).value="";
						  grid2Valid = false
        				  return false;
                 }
				}
			}
		}
				$scope.travelApplicationForm.travelRuleGridChildVOList1.length = $scope.countGrid2;

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
					showAlert("Please Select the currency ");
					grid3Valid = false
					return false;
				}
				if(amount == 0){
					$ionicLoading.hide()
					showAlert("Please enter the amount ");
					grid3Valid = false
					return false;
				}
			}

		}
		$scope.travelApplicationForm.travelRuleGridChildVOList2.length = $scope.countGrid3;	
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

	/*$scope.typeAttach = function(tp){
		$scope.radioTypeSelected = tp

		if (tp=="file"){
			document.getElementById("btncamera").style.disabled=true
			document.getElementById("inputFileUpload").style.disabled=false
		}else{
			document.getElementById("inputFileUpload").style.disabled=true
			document.getElementById("btncamera").style.disabled=false
			$scope.selectedFileNameFromDevice = ""
		}

	}*/

	$scope.cameraTakePicture = 	function (mode) {
		var imgcontrolName= "showImg"

	if (mode=="file"){

		navigator.camera.getPicture(onSuccess, onFail, { quality: 25,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY
			});
		function onSuccess(imageData) {
			var image = document.getElementById(imgcontrolName);
      //image.style.visibility="visible"
	  image.style.display="block"
      image.style.height="50px"
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
	//  $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;

			//image.src = "data:image/jpeg;base64," + imageData;
			//$scope.imageData = "data:image/jpeg;base64," + imageData;


		}

		function onFail(message) {
			//alert('Failed because: ' + message);
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
      //image.style.visibility="visible"
	  image.style.display="block"
      image.style.height="50px"
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
	 // var thisResult = JSON.parse(imageData);
	  // convert json_metadata JSON string to JSON Object 
	  //var metadata = JSON.parse(thisResult.json_metadata);
	//  image.src = "data:image/jpeg;base64," + thisResult.filename;
	//  $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;

			//image.src = "data:image/jpeg;base64," + imageData;
			//$scope.imageData = "data:image/jpeg;base64," + imageData;
			document.getElementById("inputFileUpload").value = ""
			$scope.selectedFileNameFromDevice = ""
			if (!$scope.$$phase)
                $scope.$apply()			
			




		}

		function onFail(message) {
			//alert('Failed because: ' + message);
		}
	}

	}



	$scope.fileChange  = function (){
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
	  var f = document.getElementById('inputFileUpload').files[0]
	  $scope.selectedFileNameFromDevice = document.getElementById('inputFileUpload').files[0].name
      reader.readAsDataURL(f);


	}




	$scope.submitForm = function(witDates){

		// here all validation over


		$scope.travelAppVo.empId= $scope.requestObject.empId
		$scope.travelAppVo.travelType = $scope.selectedValues.selectedToT
		$scope.travelAppVo.povId = $scope.selectedValues.selectedPOV.povId
		$scope.travelAppVo.costBorneBy = $scope.selectedValues.selectedCBB
		$scope.travelAppVo.additionalInfo = document.getElementById("addi").value
		if ($scope.utf8Enabled == 'true' ){
			if ($scope.travelAppVo.additionalInfo){
				$scope.travelAppVo.additionalInfo = encodeURI($scope.travelAppVo.additionalInfo)
			}
		}
		$scope.travelAppVo.applicantRemarks = document.getElementById("applicantRemarks").value
		if ($scope.utf8Enabled == 'true' ){
			if ($scope.travelAppVo.applicantRemarks){
				$scope.travelAppVo.applicantRemarks = encodeURI($scope.travelAppVo.applicantRemarks)
			}
		}
		
		$scope.travelApplicationForm.travelAppVo = $scope.travelAppVo



		//$scope.sfaReqObject= {}

		//$scope.sfaReqObject.menuId = $scope.requestObject.menuId
		//$scope.sfaReqObject.level=1
		//$scope.sfaReqObject.buttonRights = $scope.requestObject.buttonRights

		$scope.travelApplicationForm.menuId = $scope.requestObject.menuId
		$scope.travelApplicationForm.level=1
		$scope.travelApplicationForm.buttonRights = $scope.requestObject.buttonRights

		$scope.travelApplicationForm.travelRuleGridChildVOList.length = $scope.countGrid1
		if ($scope.selectedValues.selectedToT == "Local"){
			$scope.countGrid2 = 0
		}else{
			$scope.countGrid2 =  1 //$scope.travelApplicationForm.travelRuleGridChildVOList1.length
		}
		
		$scope.travelApplicationForm.travelRuleGridChildVOList1.length = $scope.countGrid2
		$scope.travelApplicationForm.travelRuleGridChildVOList2.length = $scope.countGrid3


		if (witDates){
			$scope.sfaReqObject.smallTravelDate = $scope.smallTravelDate
			$scope.sfaReqObject.largeTravelDate = $scope.largeTravelDate
		}


		///attaching file/imnage  start //////////
		var formData = new FormData()

		//if (document.getElementById('inputFileUpload').files[0] && $scope.radioTypeSelected == "file"){
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
				//return
			}

			//}else if (document.getElementById('showImg').src.indexOf("data:image") > -1 &&  $scope.radioTypeSelected == "camera"){
      }else if (document.getElementById('showImg').src.indexOf("data:image") > -1 ){
			//scope.imageData is the src of camera image
			var base64result = $scope.imageData.split(',')[1];

			var ts = new Date();
			ts = ts.getFullYear() +""+ ts.getMonth() +""+ ts.getDate() + "" + ts.getHours() +""+ ts.getMinutes() +""+ ts.getSeconds()

			$scope.fileUploadName = "camPic"+ts+".jpeg"
			$scope.fileUploadType = "image/jpeg"

			var blob = base64toBlob(base64result, $scope.fileUploadType,$scope.fileUploadName)
			formData.append('file', blob,$scope.fileUploadName)
			
			}
			$ionicLoading.hide()
			$scope.jsonFrom =  JSON.stringify($scope.travelApplicationForm);

			formData.append("menuId", $scope.requestObject.menuId)
			formData.append("level",1)
			formData.append("buttonRights",$scope.requestObject.buttonRights)
			formData.append("jsonForm",$scope.jsonFrom)
			/*dataType:'json',
			headers:
				'Content-Type': 'application/x-www-form-urlencoded'
				}*/
		//////////// attaching over
		$.ajax({
			url: (baseURL + '/api/travelApplication/sendForApproveWithFile.spr'),
			data: formData,
			type: 'POST',  
			timeout: commonRequestTimeout,
			
			contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
			processData: false, // NEEDED, DON'T OMIT THIS
			headers: {
				'Authorization': 'Bearer ' + jwtByHRAPI
			 },
			success : function(success) {
				if (!(success.clientResponseMsg=="OK")){
							console.log(success.clientResponseMsg)
							handleClientResponse(success.clientResponseMsg,"sendForApproveWithFile")
							$ionicLoading.hide()
							showAlert("Something went wrong. Please try later.")
							$scope.redirectOnBack()
							return
						}
						$ionicLoading.hide()
						$scope.redirectOnBack()
						showAlert(success.msg)

			}

			});


		// $http({
		// 	url: (baseURL + '/api/travelApplication/sendForApprove.spr'),
		// 	method: 'POST',
		// 	dataType:'json',
		// 	headers: {
		// 		'Content-Type': 'application/x-www-form-urlencoded'
		// 		},
		// 	timeout: commonRequestTimeout,
		// 	transformRequest: jsonTransformRequest,
		// 	data:$scope.travelApplicationForm
		// 	}).
		// 		success(function (result) {
		// 			//result is path
		// 			$ionicLoading.hide()
		// 			showAlert(result.msg)
		// 			//$state.go('app.RequisitionTravelAndClaim');
		// 			return


		// 		}).error(function (result, status) {
		// 			$ionicLoading.hide()
		// 			commonService.getErrorMessage(result);
		// 			$ionicLoading.hide()
		// 	})

	}



	$scope.goSendForApproval = function(){
		//alert("sfa")

		$scope.validateMsg1 = ""
		$scope.validateMsg2 = ""
		$scope.validateMsg3 = ""

		if($scope.selectedValues.selectedToT=="-1"){
			showAlert("Please enter Type of Travel." );
			return;
		}
		if($scope.selectedValues.selectedPOV.povId=="-1"){
			showAlert("Please enter Purpose Of Visit." );
			return;
		}
		if($scope.selectedValues.selectedCBB =="-1"){
			showAlert("Please enter Cost Borne By." );
			return;
		}
		var n=0
		if(document.getElementById('travelDate'+n).value == ""){
			showAlert("Please enter value in : \nTravel Details -> Travel Date.");
			return;
		}

		var grid1Valid = false
		var grid2Valid = false
		var grid3Valid = false

		//remove items

		//grid1

		$ionicLoading.show()
		$timeout(function () {
			// this method will be
			//called for grid 2 and grid 3 subsequently
			grid1Valid = $scope.validateGrid1Values()
		},500)
		 

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

	$scope.afterGridsValidation = function (){

		if ( document.getElementById('inputFileUpload').files[0]){
			$scope.imageData = $scope.fileChange()
		}
		$scope.ialodReqObject={}
		$scope.ialodReqObject.empId = $scope.requestObject.empId
		$scope.ialodReqObject.menuId = $scope.requestObject.menuId
		$scope.ialodReqObject.smallTravelDate = $scope.smallTravelDate
		$scope.ialodReqObject.largeTravelDate = $scope.largeTravelDate


		$http({
			url: (baseURL + '/api/travelApplication/getIsAnyLeaveOrDA.spr'),
			method: 'POST',
			timeout: commonRequestTimeout,
			transformRequest: jsonTransformRequest,
			data: $scope.ialodReqObject,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Bearer ' + jwtByHRAPI
				}
			}).
				success(function (result) {
				$ionicLoading.hide()
				if (result.msg	== ""){

					var confirmPopup = $ionicPopup.confirm({
						title: 'Are you sure',
					template: 'Do you want to send for approval?', //Message
					});
					confirmPopup.then(function (res) {
						if (res) {
						$ionicLoading.show()
						$scope.submitForm(false)
						return
						} else {
						return;
					}
					});


				}
				else{
					$ionicLoading.hide()
					var confirmPopup = $ionicPopup.confirm({
						title: '',
						template: result.msg + '<br>Do you still want to send for approval?', //Message
					});
					confirmPopup.then(function (res) {
						if (res) {
						$ionicLoading.show()
						$scope.submitForm(false)
						return
						} else {
						return;
					}
					});

				}
				}).error(function (data_return, status) {
					$scope.data_return = {status: status};
					commonService.getErrorMessage($scope.data_return);
					$ionicLoading.hide()
			})

	}




	$scope.SelectedFile = function(){

		var imgcontrolName= "showImg"
		var image = document.getElementById(imgcontrolName);
		image.src=""
		image.style.display="none"
		$scope.fileChange()

	}


	$scope.removeAttachment = function (){
		var confirmPopup = $ionicPopup.confirm({
						title: '',
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

	
	$scope.onChangeFromPlace = function(event){
		elem = $scope.selectedValues.elem 
		idx = elem.id.replace("fromPlace","")
		
		
		fromPlace = elem.options[elem.selectedIndex].text
		if (fromPlace == "Others"){
			document.getElementById("fromPlacesOther"+idx).style.display = "block" 
		}else{
			document.getElementById("fromPlacesOther"+idx).style.display = "none" 
		}
	}

	$scope.onChangeToPlace = function(idx){

		elem = $scope.selectedValues.elem 
		idx = elem.id.replace("toPlace","")
	
		toPlace = elem.options[elem.selectedIndex].text
		if (toPlace == "Others"){
			document.getElementById("toPlacesOther"+idx).style.display = "block" 
		}else{
			document.getElementById("toPlacesOther"+idx).style.display = "none" 
		}
	}


	$scope.travelTypeChange = function(){
		typeOfTravel = document.getElementById("typeOfTravel")
		var tot = typeOfTravel.options[typeOfTravel.selectedIndex].value
	
		if (tot == 'Local'){
			$scope.listDestination.push({"fromPlaceId":"-2","fromPlace":"Others"})
			$scope.travelApplicationForm.listDestinationTOPlace.push({"destinationId":"-2","destinationName":"Others"})
		}else{
			if ($scope.listDestination[$scope.listDestination.length -1].fromPlace =="Others"){
				$scope.listDestination.pop()
				$scope.travelApplicationForm.listDestinationTOPlace.pop()
			}
		}

		if (tot == "Local"){
			$scope.countGrid2 = 0
		}else{
			$scope.countGrid2 =  1// $scope.travelApplicationForm.travelRuleGridChildVOList1.length
		}
		$timeout(function () {
		for(var i=0;i<10;i++){
				sel = document.getElementById("fromPlace"+i)
				if(sel!=null    )
				sel.options[0].selected = true

				sel = document.getElementById("toPlace"+i)
				if(sel!=null )
				sel.options[0].selected = true

				document.getElementById("fromPlacesOther"+i).style.display = "none"
				document.getElementById("toPlacesOther"+i).style.display = "none"
		}
	},1000)		
	}

  $scope.init();



});
