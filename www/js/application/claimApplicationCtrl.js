/*
 1.This controller is used for applying leaves.
 */

mainModule.factory("addTravelClaimAplication", function ($resource) {
	return $resource((baseURL + '/api/travelClaim/addTravelClaimAplication.spr'), {}, 
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
mainModule.controller('claimApplicationCtrl', function ($scope, $rootScope, commonService, $ionicHistory,$window,
	$rootScope, $ionicPopup, $state, $http, $q, $filter, $ionicLoading, addTravelClaimAplication ,$timeout ,
	$ionicNavBarDelegate,getTravelRuleService,$window) {

	$rootScope.navHistoryPrevPage = "requestClaimList"
	//$rootScope.navHistoryCurrPage = "claim_application"
	$rootScope.navHistoryPrevTab="CLAIM_TRAVEL"		
	
	$scope.empDetailslist={}
	$scope.travelApplDataObject = {}	
	$scope.travelClaiimVo = {}
	$scope.travelClaimForm = {}
	$scope.travelClaimForm.travelClaimExpense = []
	$scope.listCurrency = []
	
	
	$scope.requestObject={}
	$scope.requestObject.dateFormat = "dd/MM/yyyy"
	$scope.reslutObject={}
	$scope.selectedValues={}
	$scope.selValues={}
	$scope.listMasterPOV = []
	$scope.listDestination = []
	
	$scope.selectedValues={}

	
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
	
	$scope.countGrid1 = 0
	$scope.countGrid2 = 0
	$scope.countGrid3 = 1
	$scope.countGrid4 = 1
	$scope.countGrid5 = 1
	$scope.countGrid6 = 1
	
	if ( getMyHrapiVersionNumber() >= 31){
		$scope.utf8Enabled = 'true'    
	}else{
		$scope.utf8Enabled = 'false'    
	}

	

	$scope.travelFileNames = new Array(10)
	for (var i = 0; i < 10; i++) {
		$scope.travelFileNames[i] = new Array(10);
	}

	$scope.travelFileTypes = new Array(10)	
	for (var i = 0; i < 10; i++) {
		$scope.travelFileTypes[i] = new Array(10);
	}	
	
	$scope.travelFileContents = new Array(10)
	for (var i = 0; i < 10; i++) {
		$scope.travelFileContents[i] = new Array(10);
	}
	
	
	$scope.LBFileNames = new Array(10)	
	for (var i = 0; i < 10; i++) {
		$scope.LBFileNames[i] = new Array(10);
	}

	$scope.LBFileTypes = new Array(10)	
	for (var i = 0; i < 10; i++) {
		$scope.LBFileTypes[i] = new Array(10);
	}	
	
	$scope.LBFileContents = new Array(10)
	for (var i = 0; i < 10; i++) {
		$scope.LBFileContents[i] = new Array(10);
	}	
	
	
	$scope.LCFileNames = new Array(10)	
	for (var i = 0; i < 10; i++) {
		$scope.LCFileNames[i] = new Array(10);
	}

	$scope.LCFileTypes = new Array(10)	
	for (var i = 0; i < 10; i++) {
		$scope.LCFileTypes[i] = new Array(10);
	}	
	
	$scope.LCFileContents = new Array(10)
	for (var i = 0; i < 10; i++) {
		$scope.LCFileContents[i] = new Array(10);
	}	

	
	/*$scope.travelFileNames = ["1","2","3","4","5","6","7","8","9","10"]
	$scope.travelFileTypes = ["1","2","3","4","5","6","7","8","9","10"]
	$scope.travelFileContents = ["1","2","3","4","5","6","7","8","9","10"]
	
	$scope.LBFileNames = ["1","2","3","4","5","6","7","8","9","10"]
	$scope.LBFileTypes = ["1","2","3","4","5","6","7","8","9","10"]
	$scope.LBFileContents = ["1","2","3","4","5","6","7","8","9","10"]
	
	$scope.LCFileNames = ["1","2","3","4","5","6","7","8","9","10"]
	$scope.LCFileTypes = ["1","2","3","4","5","6","7","8","9","10"]
	$scope.LCFileContents = ["1","2","3","4","5","6","7","8","9","10"]
	*/
	
	$ionicLoading.show()
	
	
	//$timeout(function () {$ionicLoading.hide()},1000)
	
		$scope.getCurrencyName = function(currid){
	
		for(var i=0;i<$scope.listCurrency.length;i++){
				if($scope.listCurrency[i].currencyId==currid){
				
					return $scope.listCurrency[i].currencyName;
				}
			}
		}
		
	
	
	$scope.SelectedFile = function( e ){
			
			var f
			var arr2Idx
			var reader = new FileReader();

			  // Closure to capture the file information.
			  var fileData ;
			  reader.onload = (function(theFile) {
				return function(e) {
				  
				  if ($scope.selectedValues.section=="travel"){
					$scope.travelFileContents[idx][arr2Idx] =  e.target.result;
				  }
				  if ($scope.selectedValues.section=="LB"){
					$scope.LBFileContents[idx][arr2Idx] =  e.target.result;
				  }
				  if ($scope.selectedValues.section=="LC"){
					$scope.LCFileContents[idx][arr2Idx] =  e.target.result;
				  }
				};
			  })(f);
			  
			//$ionicLoading.hide()
				
			//var firstUnderScorePlace =	$scope.selectedValues.elem.id.indexOf('_')
			var lastUnderScorePlace =	$scope.selectedValues.elem.id.lastIndexOf('_')
			
			rowNo= $scope.selectedValues.elem.id.substring(lastUnderScorePlace+1,$scope.selectedValues.elem.id.length)
			var idx = rowNo

			
			var lbFoundSpace = false; 
			f = $scope.selectedValues.elem.files[0]
			
			if ($scope.selectedValues.section=="travel"){
				for (var k=1;k<=10;k++){
					if (document.getElementById("fileTravel_"+k+""+idx).value==""){
						document.getElementById("fileTravel_"+k+""+idx).value = e.target.files[0].name

						document.getElementById("fileTravel_"+k+""+idx).style.display = "inline-block"
						document.getElementById("delIconTravel_"+k+""+idx).style.display = "inline-block"
						arr2Idx = k-1;
						$scope.travelFileNames[idx][arr2Idx] = e.target.files[0].name
						$scope.travelFileTypes[idx][arr2Idx] = e.target.files[0].type
						
						reader.readAsDataURL(f);
						lbFoundSpace = true
						break;
					}
				}
			}
			
			if ($scope.selectedValues.section=="LB"){
				for (var k=1;k<=10;k++){
					if (document.getElementById("fileLB_"+k+""+idx).value==""){
						document.getElementById("fileLB_"+k+""+idx).value = e.target.files[0].name

						document.getElementById("fileLB_"+k+""+idx).style.display = "inline-block"
						document.getElementById("delIconLB_"+k+""+idx).style.display = "inline-block"

						arr2Idx = k-1;
						$scope.LBFileNames[idx][arr2Idx] = e.target.files[0].name
						$scope.LBFileTypes[idx][arr2Idx] = e.target.files[0].type
						
						reader.readAsDataURL(f);
						lbFoundSpace = true
						break;
					}
				}
			}

			if ($scope.selectedValues.section=="LC"){
				for (var k=1;k<=10;k++){
					if (document.getElementById("fileLC_"+k+""+idx).value==""){
						document.getElementById("fileLC_"+k+""+idx).value = e.target.files[0].name

						document.getElementById("fileLC_"+k+""+idx).style.display = "inline-block"
						document.getElementById("delIconLC_"+k+""+idx).style.display = "inline-block"
						
						arr2Idx = k-1;
						$scope.LCFileNames[idx][arr2Idx] = e.target.files[0].name
						$scope.LCFileTypes[idx][arr2Idx] = e.target.files[0].type
						
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
		
		
		
		
		
		$scope.getCurrencyId = function(currName){
	
		for(var i=0;i<$scope.listCurrency.length;i++){
				if($scope.listCurrency[i].currencyName.trim()==currName.trim()){
				
					return $scope.listCurrency[i].currencyId;
				}
			}
		}
		$scope.getDestinationId = function(destName){
			for(var i=0;i<$scope.travelClaimForm.listDestinationTOPlace.length;i++){
				if($scope.travelClaimForm.listDestinationTOPlace[i].destinationName.trim()==destName.trim()){
				
					return $scope.travelClaimForm.listDestinationTOPlace[i].destinationId;
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
		
		
		$scope.getExpenseId = function(expName){
	
		for(var i=0;i<$scope.travelClaimForm.travelClaimExpense.length;i++){
				if($scope.travelClaimForm.travelClaimExpense[i].expenseName.trim()==expName.trim()){
					return $scope.travelClaimForm.travelClaimExpense[i].expenseId;
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
		
		$scope.getLocalConvId = function(convName){
	
		for(var i=0;i<$scope.travelClaimForm.listTravelLocalConveyance.length;i++){
				if($scope.travelClaimForm.listTravelLocalConveyance[i].localCoveyanceName.trim()==convName.trim()){
				
					return $scope.travelClaimForm.listTravelLocalConveyance[i].travelLocalConveyanceId;
				}
			}
		}	
		
		

	
	$scope.init = function(){
	$scope.requestObject.menuId='2609'
	$scope.requestObject.buttonRights="Y-Y-Y-Y"
	
	//trans id to be gotten from the prev travel details page via local storaged.
	$scope.requestObject.travelTransId = $rootScope.travelTransIdForClaimApply;
	
	
	//$scope.requestObject.travelTransId = 22
	//alert($scope.requestObject.travelTransId)

	$scope.addTravelClaimAplication = new addTravelClaimAplication();
	$scope.addTravelClaimAplication.$save($scope.requestObject, function (data) {
		if (!(data.clientResponseMsg=="OK")){
			console.log(data.clientResponseMsg)
			handleClientResponse(data.clientResponseMsg,"addTravelClaimAplication")
		}	
		
		$ionicLoading.hide();
		if (data.empDetailslist!=null){
			$scope.empDetailslist = data.empDetailslist
			$scope.requestObject.empId=$scope.empDetailslist[0].empId
			//alert($scope.requestObject.empId)
		}
		if (data.travelClaimForm === undefined){
			showAlert("Data not available")
			$scope.backButtonPressed()
			return;
		}
		
		$scope.listDestination = data.listDestination
		$scope.travelClaimForm = data.travelClaimForm
		$scope.travelClaimForm.approvalRemarks = data.travelClaimVo.approvalRemarks
		$scope.travelClaimForm.travelExpenseGridvoList = data.travelClaimForm.travelExpenseGridvoList
		$scope.travelClaimForm.travelClaimDAChildList = data.travelClaimForm.travelClaimDAChildList 
		$scope.travelClaimForm.travelLocalConveyanceGridvoList = data.travelClaimForm.travelLocalConveyanceGridvoList
		$scope.travelClaimForm.travelClaimPaymentDetailsVO = {}
		$scope.travelClaimForm.travelClaimPaymentDetailsVO	 = data.paymentDetailsVO
		
		$scope.travelClaimForm.listTravelLocalConveyance = data.travelClaimForm.listTravelLocalConveyance
		//$scope.modeOfPaymentList = data.modeOfPaymentList
		$scope.travelClaimForm.listCurrency = data.travelClaimForm.listTravelCurrency
		$scope.listCurrency =$scope.travelClaimForm.listCurrency
		
		for(var i=0;i<$scope.listCurrency.length;i++){
          if ($scope.listCurrency[i].currencyName.indexOf('8377')>-1){
            $scope.listCurrency[i].currencyName = '₹'
          }
        }
		
		for(var i=0;i<$scope.travelClaimForm.listCurrency.length;i++){
          if ($scope.travelClaimForm.listCurrency[i].currencyName.indexOf('8377')>-1){
            $scope.travelClaimForm.listCurrency[i].currencyName = '₹'
          }
        }
		
		
		$scope.travelClaimForm.travelClaimExpense = data.travelClaimForm.travelClaimExpense
		
		$scope.countGrid1 = data.travelClaimForm.gridSize
		
		$scope.countGrid2 = 0
		for(var i=0;i<10;i++){
			if ($scope.travelClaimForm.travelRuleGridChildVOList1[i].stayLocation!=null && 
			    $scope.travelClaimForm.travelRuleGridChildVOList1[i].stayLocation!=""){
				$scope.countGrid2++;
			}
		}
		 
		$scope.countGrid6 = 0 
		for(var i=0;i<10;i++){
			if ($scope.travelClaimForm.travelRuleGridChildVOList2[i].currencyType!=null &&
			    $scope.travelClaimForm.travelRuleGridChildVOList2[i].currencyType!=""){
				$scope.countGrid6++;
			}
		}
		 
		

		$scope.travelClaimForm.listCurrency.unshift({"currencyId":"-1","currencyName":"- Select -"})
		$scope.travelClaimForm.travelClaimExpense.unshift({"expenseId":"-1","expenseName":"- Select -"})
		$scope.travelClaimForm.listTravelLocalConveyance.unshift({"travelLocalConveyanceId":"-1","localCoveyanceName":"- Select -"})
		$timeout(function () {$scope.defaultTabs1Open='Y'},500)
	$timeout(function () {$scope.defaultTabs2Open='Y'},500)
	$timeout(function () {$scope.defaultTabs3Open='Y'},500)
	$timeout(function () {$scope.defaultTabs4Open='Y'},500)
	$timeout(function () {$scope.defaultTabs5Open='Y'},500)
	$timeout(function () {$scope.defaultTabs6Open='Y'},500)
	$timeout(function () {$scope.defaultTabs7Open='Y'},500)
	$timeout(function () {$scope.defaultTabs8Open='Y'},500)
	$timeout(function () {$scope.defaultTabs9Open='Y'},500)

	
		$timeout(function () {
			for(var i=0;i<10;i++){
				sel = document.getElementById("currencyTypeId"+i)
				if(sel!=null || sel.options.length==0){
					sel.options[0].selected = true
				}
				sel = document.getElementById("currencyTypeIdLB"+i)
				if(sel!=null || sel.options.length==0){
					sel.options[0].selected = true
				}
				sel = document.getElementById("currencyTypeIdLC"+i)
				if(sel!=null || sel.options.length==0){
					sel.options[0].selected = true
				}
				sel = document.getElementById("expenseTypeId"+i)
				if(sel!=null || sel.options.length==0){
					sel.options[0].selected = true
				}
				sel = document.getElementById("localConvId"+i)
				if(sel!=null || sel.options.length==0){
					sel.options[0].selected = true
				}
				sel = document.getElementById("currencyTypeIdDA"+i)
				if(sel!=null || sel.options.length==0){
					sel.options[0].selected = true
				}

				if ($scope.travelClaimForm.travelClaimVo.travelType == "Local"){
					$scope.toggleArrangement("own")
					document.getElementById('comparr').disabled = true
					document.getElementById('group1').disabled = true
					document.getElementById('comarrLable').disabled = true
				}
			}
			}, 1000)
			
		

		
		//setting hidden fields
		document.getElementById("expenseListSize").value  = $scope.travelClaimForm.travelExpenseGridvoList.length
		document.getElementById("lcListSize").value  = $scope.travelClaimForm.travelLocalConveyanceGridvoList.length
		
		
		$ionicLoading.hide()
	}, function (data, status) {
		autoRetryCounter = 0
		$ionicLoading.hide()
		commonService.getErrorMessage(data);

	});

	}
	
	
	
	$scope.toggleArrangement = function(comp_own){
		comparr = document.getElementById('comparr')
		ownarr = document.getElementById('ownarr')

		if (comp_own=="comp"){
			if ($scope.travelClaimForm.travelClaimVo.travelType == "Local"){
				return
			}
			comparr.checked=true
			ownarr.checked=false
		}else{
			ownarr.checked=true
			comparr.checked=false
		}
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
	
	


    $scope.setDate = function (grid1) {
        var date;
		var selIndex = $scope.travelClaimForm.travelRuleGridChildVOList.indexOf(grid1)				
			
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
				$scope.travelClaimForm.travelRuleGridChildVOList[selIndex].travelDate = $filter('date')(date, 'dd/MM/yyyy');
				
				if (!$scope.$$phase)
                    $scope.$apply()				
				
				$scope.doOnChgDate(selIndex)
				$scope.getTravelRuleByDate(selIndex)
                
            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
    }
	
	
	
	$scope.setFromDate = function (grid3) {
        var date;
		var selIndex = $scope.travelClaimForm.travelExpenseGridvoList.indexOf(grid3)				
			
        if ($scope.fromDateLB == null) {
            date = new Date();
        }
        else {
            date = $scope.fromDateLB;
        }
		
        var options = {date: date, mode: 'date', titleText: 'Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                $scope.fromDateLB = date;
				document.getElementById('fromDateLB'+selIndex).value = $filter('date')(date, 'dd/MM/yyyy');
				//alert(document.getElementById('fromDateLB'+selIndex).value)
				$scope.travelClaimForm.travelExpenseGridvoList[selIndex].expenseFromDate=date
				
				if (!$scope.$$phase)
                    $scope.$apply()
				
					
				$scope.dateValidator(selIndex)
				$scope.getFromDate1(selIndex)
				$scope.getTodate(selIndex)
				$scope.getTotal(selIndex)
                
            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
    }
	
	
	
	$scope.setToDate = function (grid3) {
        var date;
		var selIndex = $scope.travelClaimForm.travelExpenseGridvoList.indexOf(grid3)				
			
        if ($scope.toDateLB == null) {
            date = new Date();
        }
        else {
            date = $scope.toDateLB;
        }
		
        var options = {date: date, mode: 'date', titleText: 'Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                $scope.tDate = date;
				
				document.getElementById('toDateLB'+selIndex).value = $filter('date')(date, 'dd/MM/yyyy');
				//alert(document.getElementById('toDateLB'+selIndex).value)
				$scope.travelClaimForm.travelExpenseGridvoList[selIndex].expenseToDate = date
				
				if (!$scope.$$phase)
                    $scope.$apply()
				
				$scope.dateValidator(selIndex)
				$scope.getDateValidate(selIndex)
				$scope.getTodate(selIndex)
				$scope.getTotal(selIndex)
				
				
                
            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
    }	

	
	$scope.setFromDateLC = function (grid4) {
        var date;
		var selIndex = $scope.travelClaimForm.travelLocalConveyanceGridvoList.indexOf(grid4)				
			
        if ($scope.fromDateLC == null) {
            date = new Date();
        }
        else {
            date = $scope.fromDateLC;
        }
		
        var options = {date: date, mode: 'date', titleText: 'Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                $scope.fromDateLC = date;
				document.getElementById('fromDateLC'+selIndex).value = $filter('date')(date, 'dd/MM/yyyy');
				
				if (!$scope.$$phase)
                    $scope.$apply()
				
				$scope.dateValidatorLC(selIndex)
				$scope.validateLCDate(selIndex)
                
            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
    }
	
	
	
	$scope.setToDateLC = function (grid4) {
        var date;
		
		var selIndex = $scope.travelClaimForm.travelLocalConveyanceGridvoList.indexOf(grid4)				
			
        if ($scope.toDateLC == null) {
            date = new Date();
        }
        else {
            date = $scope.toDateLC;
        }
		
        var options = {date: date, mode: 'date', titleText: 'Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                $scope.toDateLC = date;
				document.getElementById('toDateLC'+selIndex).value = $filter('date')(date, 'dd/MM/yyyy');
				if (!$scope.$$phase)
                    $scope.$apply()
				
				$scope.dateValidatorLC(selIndex)
				$scope.validateLCToDate(selIndex)
                
            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
    }

	

	$scope.setFromDateDA = function (grid5) {
        var date;
		var selIndex = $scope.travelClaimForm.travelClaimDAChildList.indexOf(grid5)				
			
        if ($scope.fromDateDA == null) {
            date = new Date();
        }
        else {
            date = $scope.fromDateDA;
        }
		
        var options = {date: date, mode: 'date', titleText: 'Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                $scope.fromDateDA = date;
				document.getElementById('fromDateDA'+selIndex).value = $filter('date')(date, 'dd/MM/yyyy');
				
				if (!$scope.$$phase)
                    $scope.$apply()
				
				//$scope.dateValidateDA(selIndex)
				$scope.getSmallestDaFromDate(selIndex)
				$scope.getDaValidate(selIndex)
                
            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
    }
	
	
	
	$scope.setToDateDA = function (grid5) {
        var date;
		
		var selIndex = $scope.travelClaimForm.travelClaimDAChildList.indexOf(grid5)				
			
        if ($scope.toDateDA == null) {
            date = new Date();
        }
        else {
            date = $scope.toDateDA;
        }
		
        var options = {date: date, mode: 'date', titleText: 'Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {
                $scope.toDateDA = date;
				document.getElementById('toDateDA'+selIndex).value = $filter('date')(date, 'dd/MM/yyyy');
				if (!$scope.$$phase)
                    $scope.$apply()
				
				//$scope.dateValidatorDA(selIndex)
				$scope.getDATotal(selIndex)
				$scope.getDaValidate(selIndex)
				
				
                
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
	

	$scope.addRowGrid4 = function () {
		if ($scope.countGrid4<10){
			$scope.countGrid4++			
			btnAdd = document.getElementById("btnAddRowGrid4")
			btnRem = document.getElementById("btnRemRowGrid4")
			//btnAdd.style.marginTop = (-50 + ($scope.countGrid4 * 5)).toString() + "%"
			//btnRem.style.marginTop = (-50 + ($scope.countGrid4 * 5)).toString() + "%"

		}

	}
	$scope.remRowGrid4 = function () {
		if ($scope.countGrid4>1)
		$scope.countGrid4--
			btnAdd = document.getElementById("btnAddRowGrid4")
			btnRem = document.getElementById("btnRemRowGrid4")
			//btnAdd.style.marginTop = (-50 + ($scope.countGrid4 * 5)).toString() + "%"
			//btnRem.style.marginTop = (-50 + ($scope.countGrid4 * 5)).toString() + "%"	
	}		
	


	$scope.addRowGrid5 = function () {
		if ($scope.countGrid5<10){
			$scope.countGrid5++			
			btnAdd = document.getElementById("btnAddRowGrid5")
			btnRem = document.getElementById("btnRemRowGrid5")
			//btnAdd.style.marginTop = (-50 + ($scope.countGrid5 * 5)).toString() + "%"
			//btnRem.style.marginTop = (-50 + ($scope.countGrid5 * 5)).toString() + "%"

		}

	}
	$scope.remRowGrid5 = function () {
		if ($scope.countGrid5>1)
		$scope.countGrid5--
			btnAdd = document.getElementById("btnAddRowGrid5")
			btnRem = document.getElementById("btnRemRowGrid5")
			//btnAdd.style.marginTop = (-50 + ($scope.countGrid5 * 5)).toString() + "%"
			//btnRem.style.marginTop = (-50 + ($scope.countGrid5 * 5)).toString() + "%"	
	}		


	

	
	$scope.showVisaDetails = function() {
		//var url="../../eis/eisVisa/viewEisVisaDetails.spr?fromTravel=Y&empId="+empId+"&empCode="+empCode+"&empName="+empName;
		//tb_open_new(url+'&menuId='+document.getElementById('menuId').value+'&buttonRights='+document.getElementById('buttonRights').value+'&height='+550+'&width='+900+'&TB_iframe=true&modal=true');
			showAlert("visa details","")
	}


	
	
		$scope.dateValidate = function(i){
			var smallTravelDate = document.getElementById("smallestTravelDate").value;	
			var fromDate = document.getElementById('fDate'+i).value;
			var toDate = document.getElementById('tDate'+i).value;
			
			var z = 0;
			var firstTravelDate = document.getElementById('travelDate'+z).value;		
			if(firstTravelDate == ""){
				showAlert("Please Enter Travel Date");
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
					showAlert("From Date must not be less than Travel Date in Stay Arrangement");
  				  return;     	
           }	
			}
		}	
		
		
		
		
		$scope.dateValidator = function (i){
			var fromDate = document.getElementById('fromDateLB'+i).value;
			var toDate = document.getElementById('toDateLB'+i).value;
			
			if(fromDate != "" && toDate != ""){
			
				if (compareDate(fromDate, toDate,  $scope.requestObject.dateFormat)== -1){
					//showAlert( "To Date must not be less than From Date.");
                          document.getElementById('toDateLB'+i).value = "";
        				  return;     	
                 }	
			}
		}		

		
		$scope.dateValidatorLC = function (i){
			var fromDate = document.getElementById('fromDateLC'+i).value;
			var toDate = document.getElementById('toDateLC'+i).value;
			
			if(fromDate != "" && toDate != ""){
			
				if (compareDate(fromDate, toDate,  $scope.requestObject.dateFormat)== -1){
					showAlert("To Date must not be less than From Date.");
                          document.getElementById('toDateLB'+i).value = "";
        				  return;     	
                 }	
			}
		}				
		

		$scope.dateValidatorDA = function (i){
			var fromDate = document.getElementById('fromDateDA'+i).value;
			var toDate = document.getElementById('toDateDA'+i).value;
			
			if(fromDate != "" && toDate != ""){
			
				if (compareDate(fromDate, toDate,  $scope.requestObject.dateFormat)== -1){
					showAlert("To Date must not be less than From Date.");
                          document.getElementById('toDateLB'+i).value = "";
        				  return;     	
                 }	
			}
		}		


	
	$scope.getFromDate1= function (){
		
			var no = $scope.countGrid3
			var  smallest = document.getElementById('fromDateLB'+0).value;
			
			    for(var i=0; i< no; i++)
                {
                         if (compareDate(document.getElementById('fromDateLB'+i).value, smallest,  $scope.requestObject.dateFormat)==1){
                              	smallest = document.getElementById('fromDateLB'+i).value;
                       	}
												
                }
			document.getElementById('smallestFromExpDate').value = smallest;
			
			var smallTravelDate = document.getElementById("smallestTravelDate").value;		
			var z = 0;
			var firstTravelDate = $scope.travelClaimForm.travelRuleGridChildVOList[0].travelDate		
			var listSize = $scope.travelClaimForm.gridSize;
			
			for(var i=0; i<listSize; i++){
				if(compareDate(firstTravelDate, $scope.travelClaimForm.travelRuleGridChildVOList[i].travelDate, $scope.requestObject.dateFormat)!= 1){
					
					smallTravelDate = $scope.travelClaimForm.travelRuleGridChildVOList[i].travelDate
				}
			}
			document.getElementById("smallestTravelDate").value = smallTravelDate;
			
			 if (compareDate(document.getElementById("smallestTravelDate").value, document.getElementById('smallestFromExpDate').value, 
			 $scope.requestObject.dateFormat)== -1){
				 showAlert( "Lodging and Boarding Expense From Date Must Not Be Less Than Travel Date!");
			}	
			var flag = "";
			var toDate = $scope.travelClaimForm.travelRuleGridChildVOList[0].travelToDate
				for(var j=0; j<listSize; j++){
					var firstTravelDate = $scope.travelClaimForm.travelRuleGridChildVOList[j].travelDate
					
					if(compareDate(firstTravelDate, smallest,  document.getElementById("DateFormat").value) == 1 || compareDate(firstTravelDate, smallest,  document.getElementById("DateFormat").value) == 0){
						
						if(compareDate(toDate,smallest, document.getElementById("DateFormat").value) != 1){
							flag = "true";
						}
						
					}
				}
				
				if(flag == ""){
					//document.getElementById('expenseFromDate'+p).value = "";
					showAlert("From Date must be bettween from and To Travel Date in Food, Lodging and Boarding Expense");
					  return; 
				}
	}
	

	
		 
	$scope.getTDTotal = function(i){
		
		
		
		var total = 0;
		for(var n=0; n<=i; n++){
			if(document.getElementById('amt'+n).value){
				total += Number(document.getElementById('amt'+n).value);
			}
		}
		document.getElementById('totalTravelDetailAmt').value = total;
		
		
	}

			
	
	

	
	$scope.getTodate  = function (i){
	
		if(document.getElementById('fromDateLB'+i).value == ""){
			showAlert("Please enter Lodging and Boarding Expense From Date!");
			return;
		}
		
		var cg = $scope.countGrid3
		var  largest = document.getElementById('toDateLB'+0).value;
		var toDate = $scope.travelClaimForm.travelRuleGridChildVOList[0].travelToDate
			
			    for(var i=0; i< cg; i++)
                {
                         if (compareDate(document.getElementById('toDateLB'+i).value, largest, document.getElementById("DateFormat").value )== -1){
                              	largest = document.getElementById('toDateLB'+i).value;
                       	}			
                }
          document.getElementById('largestToExpDate').value = largest;
		
		var smallestFromExpDate = document.getElementById('smallestFromExpDate').value;
		var largestToExpDate = document.getElementById('largestToExpDate').value;
		var no = caldays(document.getElementById('smallestFromExpDate').value,document.getElementById('largestToExpDate').value);
		var toplaceId = 0;
		var listSize = document.getElementById("listSize").value
		var listSize1 = document.getElementById("listSize1").value
	
		var amount =0;
		var travelType = $scope.travelClaimForm.travelClaimVo.travelType ;
		var isActiveComp = ""
		var isActiveOwn =  ""
			if(document.getElementById('ownarr').checked == true){
				isActiveOwn = 'Y';
			}else{
				isActiveOwn = 'N';
			}
		if(document.getElementById('comparr').checked == true){
				isActiveComp = 'Y';
		}else{
				isActiveComp = 'N';
		}
		
		for(var p=0; p<no; p++){
		
					var futureDate = smallestFromExpDate;
					var ds = futureDate.split("/");
					var startDate = new Date(ds[2], ds[1]-1, ds[0]);   
					var daysAhead = p;
					startDate.setTime(startDate.getTime()+(daysAhead*24*60*60*1000));
					futureDate = startDate.getDate()+"/"+(startDate.getMonth()+1)+"/"+startDate.getFullYear();
					futureDate = futureDate.replace(/^(\d{1}\/)/,"0$1").replace(/(\d{2}\/)(\d{1}\/)/,"$10$2");
					
					if(listSize == 1){
						var travelDate = $scope.travelClaimForm.travelRuleGridChildVOList[0].travelDate
						toPlaceId = $scope.travelClaimForm.travelRuleGridChildVOList[0].toPlaceId
						
									
					}else if(listSize > 1){
							for(var n=0; n<listSize; n++){
							var m = n+1;
							var travelDate = $scope.travelClaimForm.travelRuleGridChildVOList[n].travelDate
							
							if($scope.travelClaimForm.travelRuleGridChildVOList[m].travelDate != ""){
							
							if($scope.travelClaimForm.travelRuleGridChildVOList[n].travelDate  == $scope.travelClaimForm.travelRuleGridChildVOList[m].travelDate ){
								if(compareDate(futureDate ,$scope.travelClaimForm.travelRuleGridChildVOList[n].travelDate ,document.getElementById("DateFormat").value ) == 0){
										toPlaceId = $scope.travelClaimForm.travelRuleGridChildVOList[n].toPlaceId
										
										cityGradeId =  $scope.travelClaimForm.travelRuleGridChildVOList[n].cityGradeId
										
										if($scope.travelClaimForm.travelRuleGridChildVOList[n].cityGradeId != $scope.travelClaimForm.travelRuleGridChildVOList[m].cityGradeId){
											$scope.tmpReqObject = {}
											$scope.tmpReqObject.empId = sessionStorage.getItem('empId')
											$scope.tmpReqObject.toPlaceId = toPlaceId
											$scope.tmpReqObject.travelType = travelType
											$scope.tmpReqObject.isActiveComp = isActiveComp
											$scope.tmpReqObject.isActiveOwn = isActiveOwn
											
											$http({
													url: (baseURL + '/api/travelClaim/getTotalForEachDate.spr'),
													method: 'POST',
													timeout: commonRequestTimeout,
													transformRequest: jsonTransformRequest,
													data: $scope.tmpReqObject,
													dataType: 'text',
													headers: {
														'Authorization': 'Bearer ' + jwtByHRAPI,
													 	'Content-Type': 'application/x-www-form-urlencoded'
													}
													}).
														success(function (data_return) {
														if (data_return.clientResponseMsg=="OK"){	//do nothing
															amount += Number(data_return.amt);
															document.getElementById('amountToValidate').value = amount;
															$ionicLoading.hide()
															return
														}
														else{
															//some error
															
															$ionicLoading.hide()
															return ;
														}

														}).error(function (data_return, status) {
													$scope.data_return = {status: status};
													commonService.getErrorMessage($scope.data_return);
													$ionicLoading.hide()
												});
										}	 	
								}else{
										toPlaceId = $scope.travelClaimForm.travelRuleGridChildVOList[m].toPlaceId
								}
							}
							else{
								if(compareDate(futureDate , $scope.travelClaimForm.travelRuleGridChildVOList[n].travelDate,document.getElementById("DateFormat").value ) == -1){
									if(compareDate(futureDate , $scope.travelClaimForm.travelRuleGridChildVOList[m].travelDate,document.getElementById("DateFormat").value ) == 1){
											toPlaceId = $scope.travelClaimForm.travelRuleGridChildVOList[n].toPlaceId 
											
										}							
								}else if(compareDate(futureDate ,$scope.travelClaimForm.travelRuleGridChildVOList[m].travelDate ,document.getElementById("DateFormat").value ) == 0){
											toPlaceId = $scope.travelClaimForm.travelRuleGridChildVOList[m].toPlaceId 
											
								}else if(compareDate(futureDate ,$scope.travelClaimForm.travelRuleGridChildVOList[n].travelDate,document.getElementById("DateFormat").value ) == 0){
											toPlaceId = $scope.travelClaimForm.travelRuleGridChildVOList[n].toPlaceId 
											
										}
							}			
							}else{
									
									toPlaceId = $scope.travelClaimForm.travelRuleGridChildVOList[n].toPlaceId 
							}		
						}
					}
		
					
						$scope.tmpReqObject = {}
						$scope.tmpReqObject.empId = sessionStorage.getItem('empId')
						$scope.tmpReqObject.toPlaceId = toPlaceId
						$scope.tmpReqObject.travelType = travelType
						$scope.tmpReqObject.isActiveComp = isActiveComp
						$scope.tmpReqObject.isActiveOwn = isActiveOwn
						
						$http({
								url: (baseURL + '/api/travelClaim/getTotalForEachDate.spr'),
								method: 'POST',
								timeout: commonRequestTimeout,
								transformRequest: jsonTransformRequest,
								data: $scope.tmpReqObject,
								dataType: 'text',
								headers: {
									'Authorization': 'Bearer ' + jwtByHRAPI,
								 	'Content-Type': 'application/x-www-form-urlencoded'
								}
								}).
									success(function (data_return) {
									if (data_return.clientResponseMsg=="OK"){	//do nothing
										amount += Number(data_return.amt);
										document.getElementById('amountToValidate').value = amount;
										$ionicLoading.hide()
										return
									}
									else{
										//some error
										
										$ionicLoading.hide()
										return ;
									}

									}).error(function (data_return, status) {
								$scope.data_return = {status: status};
								commonService.getErrorMessage($scope.data_return);
								$ionicLoading.hide()
							});
												
		}				
		
	}	
	
	
	
	
	$scope.getTotal  = function (i){
		//alert("in get total")
		var isRulePresent = document.getElementById('isRulePresent');
		var travelType = document.getElementById("travelType").value; 
		var toBeSum = document.getElementById('amountLB'+i);
		
		var total = 0;
			for(var n=0; n<=i; n++){
				
				if(document.getElementById('amountLB'+n).value){
					total += Number(document.getElementById('amountLB'+n).value);
				}
			}
			
			document.getElementById('totalExpenseAmount').value = total;
			document.getElementById('totalExpenseAmt1').value = total;
			
			
			var amount = Number(document.getElementById('amountToValidate').value);
			var total1 = Number(document.getElementById('totalExpenseAmount').value);
			$timeout(function(){
				$scope.tmpReqObject = {}
				$scope.tmpReqObject.empId = sessionStorage.getItem('empId')
				$scope.tmpReqObject.travelType = travelType
				$http({
						url: (baseURL + '/api/travelClaim/getTravelRule.spr'),
						method: 'POST',
						timeout: commonRequestTimeout,
						transformRequest: jsonTransformRequest,
						data: $scope.tmpReqObject,
						dataType: 'text',
						headers: {
							'Authorization': 'Bearer ' + jwtByHRAPI,
						 	'Content-Type': 'application/x-www-form-urlencoded'
						}
						}).
							success(function (data_return) {
							if (data_return.clientResponseMsg=="OK"){	//do nothing
								if(data_return.msg=="")
								{
									isRulePresent.value = 'Y';
									if(amount < total1 && amount != 0){				           			
										showAlert( "Total Amount Exceeds Your Eligible Amount! \n As per Travel Rule Your Eligible Amount is "+amount); 
										$ionicLoading.hide()
										return;
								}else{
									isRulePresent.value = 'N';			   
				           			$ionicLoading.hide()
				           			//showAlert(data_return.msg);
									return;
								}
							}
							}
							else{
								//some error
								showAlert("Something went wrong. Please try later. code=1")
								$ionicLoading.hide()
								return ;
							}

							}).error(function (data_return, status) {
						$scope.data_return = {status: status};
						commonService.getErrorMessage($scope.data_return);
						$ionicLoading.hide()
					});						
			}, 1500);
			
	}

	
	$scope.getDateValidate = function (i){
		var expenseFromDate = document.getElementById('fromDateLB'+i).value;
		var expToDate = document.getElementById('toDateLB'+i).value;
		var toDate = $scope.travelClaimForm.travelRuleGridChildVOList[0].travelToDate
		if(compareDate(expenseFromDate,expToDate,document.getElementById("DateFormat").value ) == -1){
			showAlert( "Lodging and Boarding Expense To Date must not be smaller than Lodging and Boarding Expense From Date!");
			return;
		}
		var listSize = document.getElementById("listSize").value;
		var flag = "";
		for(var j=0; j<listSize; j++){
			var firstTravelDate = $scope.travelClaimForm.travelRuleGridChildVOList[j].travelDate
			
			if(compareDate(firstTravelDate, expenseFromDate, document.getElementById("DateFormat").value) == 1 || compareDate(firstTravelDate, expenseFromDate, document.getElementById("DateFormat").value) == 0){
				//smallTravelDate = document.getElementById('travelDate'+j).value;
				if(compareDate(toDate,expToDate,document.getElementById("DateFormat").value) != 1){
					flag = "true";
				}
				
			}
		}
		//document.getElementById("smallestTravelDate").value = smallTravelDate;
		if(flag == ""){
			document.getElementById('expenseToDate'+i).value = "";
			showAlert("To Date must be bettween from and To Travel Date in Food, Lodging and Boarding Expense");
			  return; 
		}
		
	}


	 $scope.validateLCToDate=function(i){
		var lcDate = document.getElementById('fromDateLC'+i).value;
		var lcToDate = document.getElementById('toDateLC'+i).value;
		
		if(compareDate(document.getElementById('fromDateLC'+i).value, document.getElementById('toDateLC'+i).value, document.getElementById("DateFormat").value) == -1){
			showAlert("Local Conveyance To Date Must Not Be Smaller Than Local Conveyance From Date!", );
			return;
		}
		
		var listSize = document.getElementById("listSize").value;
		var flag = "";
		var toDate = $scope.travelClaimForm.travelRuleGridChildVOList[0].travelToDate
		for(var j=0; j<listSize; j++){
			var firstTravelDate = $scope.travelClaimForm.travelRuleGridChildVOList[j].travelDate
			if(compareDate(firstTravelDate, lcDate,  document.getElementById("DateFormat").value) == 1 || compareDate(firstTravelDate, lcDate,  document.getElementById("DateFormat").value) == 0){
				//smallTravelDate = document.getElementById('travelDate'+j).value;
				if(compareDate(toDate,lcToDate,  document.getElementById("DateFormat").value) != 1){
					flag = "true";
				}
				
			}
		}
		//document.getElementById("smallestTravelDate").value = smallTravelDate;
		if(flag == ""){
			document.getElementById('lcToDate'+i).value = "";
			showAlert("To Date must be bettween from and To Travel Date in Local Conveyance");
			  return; 
		}
	}
	$scope.validateLCDate = function (n){
	
		var smallTravelDate = document.getElementById("smallestTravelDate").value;		
		var z = 0;
		var firstTravelDate = $scope.travelClaimForm.travelRuleGridChildVOList[0].travelDate
		var listSize = document.getElementById("listSize").value;
		var toDate = $scope.travelClaimForm.travelRuleGridChildVOList[0].travelToDate
		
		for(var i=0; i<listSize; i++){
			
			if(compareDate(firstTravelDate, $scope.travelClaimForm.travelRuleGridChildVOList[i].travelDate, document.getElementById("DateFormat").value)!= 1){
				smallTravelDate = $scope.travelClaimForm.travelRuleGridChildVOList[i].travelDate;
			}
		}
		document.getElementById("smallestTravelDate").value = smallTravelDate	
	
		for(var i=0; i<=n; i++){
			var lcDate = document.getElementById('fromDateLC'+n).value;
			var smallTravelDate1 = document.getElementById("smallestTravelDate").value;
			
			if(compareDate(document.getElementById('fromDateLC'+n).value, document.getElementById("smallestTravelDate").value,toDate) == 1){
				showAlert( "Local Conveyance Date Must Not Be Less Than Travel Date!"); 
				return;
			}			
		}
		var flag = "";
		var smallest = document.getElementById('fromDateLC'+n).value;
		for(var j=0; j<listSize; j++){
			var firstTravelDate = $scope.travelClaimForm.travelRuleGridChildVOList[j].travelDate
			if(compareDate(firstTravelDate, smallest,document.getElementById("DateFormat").value) == 1 || compareDate(firstTravelDate, smallest, document.getElementById("DateFormat").value) == 0){
				
				if(compareDate(toDate,smallest, document.getElementById("DateFormat").value) != 1){
					flag = "true";
				}
				
			}
		}
		
		if(flag == ""){
			//document.getElementById('expenseFromDate'+p).value = "";
			showAlert("From Date must be bettween from and To Travel Date in Local Conveyance");
			  return; 
		}
		
	}

	
	$scope.getLCTotal = function (i){
		var total = 0;
		for(var n=0; n<=i; n++){
			if(document.getElementById('amountLC'+n).value){
				total += Number(document.getElementById('amountLC'+n).value);
			}
		}
		document.getElementById('totalLocalCnvnAmount').value = total;
		document.getElementById('totalLocalConvnAmt1').value = total;
		
	}

	

	$scope.getSmallestDaFromDate = function (p){
		
			var no = $scope.countGrid5
			var  smallest = document.getElementById('fromDateDA'+0).value;
			
			    for(var i=0; i< no; i++)
                {
                         if (compareDate(document.getElementById('fromDateDA'+i).value, smallest, $scope.requestObject.dateFormat)==1){
                              	smallest = document.getElementById('fromDateDA'+i).value;
                       		
                       	}		
                }
			document.getElementById('smallestFromDaDate').value = smallest
			
			var smallTravelDate = document.getElementById("smallestFromDaDate").value;		
			var z = 0;
			//var firstTravelDate = document.getElementById('travelDate'+z).value;
			var firstTravelDate   = $scope.travelClaimForm.travelRuleGridChildVOList[0].travelDate	
			var toDate = $scope.travelClaimForm.travelRuleGridChildVOList[0].travelToDate		
			
			var listSize = document.getElementById("listSize").value;
			
			for(var i=0; i<listSize; i++){
				
				if(compareDate(firstTravelDate, $scope.travelClaimForm.travelRuleGridChildVOList[i].travelDate	,  $scope.requestObject.dateFormat)!= 1){
					//smallTravelDate = document.getElementById('travelDate'+i).value;
					smallTravelDate   = $scope.travelClaimForm.travelRuleGridChildVOList[i].travelDate
				}
			}
			document.getElementById("smallestTravelDate").value = smallTravelDate
			 if (compareDate(document.getElementById("smallestTravelDate").value, document.getElementById('smallestFromDaDate').value,   $scope.requestObject.dateFormat)== -1){
				 showAlert("Daily Allowance From Date Must Not Be Less Than Travel Date!");
			}	
			var  smallestFromDateDA = document.getElementById('daFromDate'+p).value;
			var  smallestToDateDA = document.getElementById('daToDate'+p).value;
			 var flag = "";
				for(var j=0; j<listSize; j++){
					var firstTravelDate = $scope.travelClaimForm.travelRuleGridChildVOList[j].travelDate
					if(compareDate(firstTravelDate, smallestFromDateDA, document.getElementById("DateFormat").value) == 1 || compareDate(firstTravelDate, smallestFromDateDA,  $("#DateFormat").val()) == 0){
						
						if(compareDate(toDate,smallestToDateDA,  document.getElementById("DateFormat").value) != 1){
							flag = "true";
						}
						
					}
				}
				
				if(flag == ""){
					//document.getElementById('expenseFromDate'+p).value = "";
					warningMessageAlert("From Date must be bettween from and To Travel Date in Daily Allowance");
					  return; 
				}
	}
	
	
	
	$scope.getDaValidate = function (i){
	
		if(document.getElementById('fromDateDA'+i).value == ""){
			showAlert( "Please enter Daily Allowance From Date!");
		}
		
			var cg = $scope.countGrid5
		
			var  largest = document.getElementById('toDateDA'+0).value;
			    for(var i=0; i< cg; i++)
                {
                         if (compareDate(document.getElementById('toDateDA'+i).value, largest,  $scope.requestObject.dateFormat ) == -1){
                              	largest = document.getElementById('toDateDA'+i).value;
                       	}			
                }
          document.getElementById('largestToDaDate').value = largest;
          
		var travelType = $scope.travelClaimForm.travelClaimVo.travelType ;
		var smallestFromDaDate = document.getElementById('smallestFromDaDate').value;
		var largestToDaDate = document.getElementById('largestToDaDate').value;
		var no = caldays(document.getElementById('smallestFromDaDate').value,document.getElementById('largestToDaDate').value);
		var toplaceId = 0;
		
		var listSize = $scope.countGrid3
		var listSize1 = document.getElementById("listSize1").value
		var amount =0;
		
		for(var p=0; p<no; p++){
					var futureDate = smallestFromDaDate;
					var ds = futureDate.split("/");
					var startDate = new Date(ds[2], ds[1]-1, ds[0]);   
					var daysAhead = p;
					startDate.setTime(startDate.getTime()+(daysAhead*24*60*60*1000));
					futureDate = startDate.getDate()+"/"+(startDate.getMonth()+1)+"/"+startDate.getFullYear();
					futureDate = futureDate.replace(/^(\d{1}\/)/,"0$1").replace(/(\d{2}\/)(\d{1}\/)/,"$10$2");
					
					if(listSize == 1){
						var travelDate = $scope.travelClaimForm.travelRuleGridChildVOList[0].travelDate
						toPlaceId = $scope.travelClaimForm.travelRuleGridChildVOList[0].toPlaceId
						
						$scope.tmpReqObject = {}
						$scope.tmpReqObject.empId = sessionStorage.getItem('empId')
						$scope.tmpReqObject.toPlaceId = toPlaceId
						$scope.tmpReqObject.travelType = travelType
						
						$http({
						url: (baseURL + '/api/travelClaim/getDaTotalForEachDate.spr'),
						method: 'POST',
						timeout: commonRequestTimeout,
						transformRequest: jsonTransformRequest,
						data: $scope.tmpReqObject,
						dataType: 'text',
						headers: {
							'Authorization': 'Bearer ' + jwtByHRAPI,
							'Content-Type': 'application/x-www-form-urlencoded'
						}
						}).
							success(function (data_return) {
							if (data_return.clientResponseMsg=="OK"){	//do nothing
								if(data_return.msg=="")
								{
									
								}else{
									 amount += Number(data_return.msg);									      
									 document.getElementById('amountToValidateDa').value = amount;
									 return;
								}
							}
							else{
								//some error
								showAlert("Something went wrong. Please try later. code=2")
								$ionicLoading.hide()
								return ;
							}

							}).error(function (data_return, status) {
						$scope.data_return = {status: status};
						commonService.getErrorMessage($scope.data_return);
						$ionicLoading.hide()
					});	
				
						/*
						$.ajax({
								 url: "${pageContext.request.contextPath}/travel/travelClaim/getDaTotalForEachDate.spr",
								 type: 'POST',
								 data: {'empId': $("#empId").val(),'toPlaceId': toPlaceId, 'travelType': travelType},
								 async:false,
								 dataType: 'text',
								 success:function(result){
								 if(result == ''){
										           				
								}else{			           				
									 amount += Number(result);									      
									 document.getElementById('amountToValidateDa').value = amount;
									 return;
								 }
							}
						});	*/
									
					}else if(listSize > 1){
							for(var n=0; n<listSize; n++){
							var m = n+1;
							var travelDate = $scope.travelClaimForm.travelRuleGridChildVOList[n].travelDate
							
							
							if($scope.travelClaimForm.travelRuleGridChildVOList[m].travelDate != ""){
							if($scope.travelClaimForm.travelRuleGridChildVOList[n].travelDate == $scope.travelClaimForm.travelRuleGridChildVOList[m].travelDate){
								if(compareDate(futureDate , $scope.travelClaimForm.travelRuleGridChildVOList[n].travelDate, $scope.requestObject.dateFormat ) == 0){
										toPlaceId = $scope.travelClaimForm.travelRuleGridChildVOList[n].toPlaceId
										cityGradeId =  $scope.travelClaimForm.travelRuleGridChildVOList[n].cityGradeId
										
										if(cityGradeId != $scope.travelClaimForm.travelRuleGridChildVOList[m].cityGradeId){
												$scope.tmpReqObject = {}
												$scope.tmpReqObject.empId = sessionStorage.getItem('empId')
												$scope.tmpReqObject.toPlaceId = toPlaceId
												$scope.tmpReqObject.travelType = travelType
												
												$http({
												url: (baseURL + '/api/travelClaim/getDaTotalForEachDate.spr'),
												method: 'POST',
												timeout: commonRequestTimeout,
												transformRequest: jsonTransformRequest,
												data: $scope.tmpReqObject,
												dataType: 'text',
												headers: {
													'Authorization': 'Bearer ' + jwtByHRAPI,
													'Content-Type': 'application/x-www-form-urlencoded'
												}
												}).
													success(function (data_return) {
													if (data_return.clientResponseMsg=="OK"){	//do nothing
														if(data_return.msg=="")
														{
															
														}else{
															 amount += Number(data_return.msg);									      
															 document.getElementById('amountToValidateDa').value = amount;
															 return;
														}
													}
													else{
														//some error
														showAlert("Something went wrong. Please try later.code=3")
														$ionicLoading.hide()
														return ;
													}

													}).error(function (data_return, status) {
												$scope.data_return = {status: status};
												commonService.getErrorMessage($scope.data_return);
												$ionicLoading.hide()
											});												
											/*
											$.ajax({
											       	url: "${pageContext.request.contextPath}/travel/travelClaim/getDaTotalForEachDate.spr",
											        type: 'POST',
											        data: {'empId': $("#empId").val(),'toPlaceId': toPlaceId, 'travelType': travelType},
											        async:false,
											        dataType: 'text',
											        success:function(result){
										           		if(result == ''){
										           				
										           			}else{			           				
										           				amount += Number(result);
										           				document.getElementById('amountToValidateDa').value = amount;
										           				return;
									        				}
										            	}
												 	});	*/
										}	 	
									}else{
											toPlaceId = toPlaceId = $scope.travelClaimForm.travelRuleGridChildVOList[m].toPlaceId
											
												$scope.tmpReqObject = {}
												$scope.tmpReqObject.empId = sessionStorage.getItem('empId')
												$scope.tmpReqObject.toPlaceId = toPlaceId
												$scope.tmpReqObject.travelType = travelType
												
												$http({
												url: (baseURL + '/api/travelClaim/getDaTotalForEachDate.spr'),
												method: 'POST',
												timeout: commonRequestTimeout,
												transformRequest: jsonTransformRequest,
												data: $scope.tmpReqObject,
												dataType: 'text',
												headers: {
													'Authorization': 'Bearer ' + jwtByHRAPI,
												 	'Content-Type': 'application/x-www-form-urlencoded'
												}
												}).
													success(function (data_return) {
													if (data_return.clientResponseMsg=="OK"){	//do nothing
														if(data_return.msg=="")
														{
															
														}else{
															 amount += Number(data_return.msg);									      
															 document.getElementById('amountToValidateDa').value = amount;
															 return;
														}
													}
													else{
														//some error
														showAlert("Something went wrong. Please try later.code=4")
														$ionicLoading.hide()
														return ;
													}

													}).error(function (data_return, status) {
												$scope.data_return = {status: status};
												commonService.getErrorMessage($scope.data_return);
												$ionicLoading.hide()
											});		
												
											/*
											$.ajax({
													 url: "${pageContext.request.contextPath}/travel/travelClaim/getDaTotalForEachDate.spr",
													 type: 'POST',
													 data: {'empId': $("#empId").val(),'toPlaceId': toPlaceId, 'travelType': travelType},
													 async:false,
													 dataType: 'text',
													 success:function(result){
													 if(result == ''){
															           				
													}else{			           				
														 amount += Number(result);									      
														 document.getElementById('amountToValidateDa').value = amount;
														 return;
													 }
												}
											});
*/											
										}
								}else{
									
									if(compareDate(futureDate ,$scope.travelClaimForm.travelRuleGridChildVOList[n].travelDate, $scope.requestObject.dateFormat) == 0){
										toPlaceId = $scope.travelClaimForm.travelRuleGridChildVOList[n].toPlaceId										
									}else if(compareDate(futureDate , $scope.travelClaimForm.travelRuleGridChildVOList[n].travelDate, $scope.requestObject.dateFormat ) == -1){
											if(compareDate(futureDate , $scope.travelClaimForm.travelRuleGridChildVOList[m].travelDate, $scope.requestObject.dateFormat) == 1){
												toPlaceId = $scope.travelClaimForm.travelRuleGridChildVOList[n].toPlaceId
											}else
											 if(compareDate(futureDate , $scope.travelClaimForm.travelRuleGridChildVOList[m].travelDate, $scope.requestObject.dateFormat) <= 0){
														toPlaceId = $scope.travelClaimForm.travelRuleGridChildVOList[m].toPlaceId
											}
									}
									
												$scope.tmpReqObject = {}
												$scope.tmpReqObject.empId = sessionStorage.getItem('empId')
												$scope.tmpReqObject.toPlaceId = toPlaceId
												$scope.tmpReqObject.travelType = travelType
												
												$http({
												url: (baseURL + '/api/travelClaim/getDaTotalForEachDate.spr'),
												method: 'POST',
												timeout: commonRequestTimeout,
												transformRequest: jsonTransformRequest,
												data: $scope.tmpReqObject,
												dataType: 'text',
												headers: {
													'Authorization': 'Bearer ' + jwtByHRAPI,
												 	'Content-Type': 'application/x-www-form-urlencoded'
												}
												}).
													success(function (data_return) {
													if (data_return.clientResponseMsg=="OK"){	//do nothing
														if(data_return.msg=="")
														{
															
														}else{
															 amount += Number(data_return.msg);									      
															 document.getElementById('amountToValidateDa').value = amount;
															 return;
														}
													}
													else{
														//some error
														showAlert("Something went wrong. Please try later.code=5")
														$ionicLoading.hide()
														return ;
													}

													}).error(function (data_return, status) {
												$scope.data_return = {status: status};
												commonService.getErrorMessage($scope.data_return);
												$ionicLoading.hide()
											});		
									/*
									$.ajax({
											 url: "${pageContext.request.contextPath}/travel/travelClaim/getDaTotalForEachDate.spr",
											 type: 'POST',
											 data: {'empId': $("#empId").val(),'toPlaceId': toPlaceId, 'travelType': travelType},
											 async:false,
											 dataType: 'text',
											 success:function(result){										 
										     if(result == ''){
										           				
										     }else{			           				
										        amount += Number(result);									      
										        document.getElementById('amountToValidateDa').value = amount;
										        return;
									        }
										 }
									});	*/
								}
						}
					}
				}
			}
		}
		

		
	$scope.getDATotal = function (i){
	
		var total = 0;
		var travelType = $scope.travelClaimForm.travelClaimVo.travelType ;
		var isRulePresentDA = document.getElementById('isRulePresentDA');
		
		for(var n=0; n<=i; n++){
			if(document.getElementById('amountDA'+n).value){
				total += Number(document.getElementById('amountDA'+n).value);
			}
		}
		document.getElementById('totalDaAmount').value = total;
// 		document.getElementById('totalDaAmt1').value = total;
	
		var amount = Number(document.getElementById('amountToValidateDa').value);
		var total1 = Number(document.getElementById('totalDaAmount').value);
												$scope.tmpReqObject = {}
												$scope.tmpReqObject.empId = sessionStorage.getItem('empId')
											
												$scope.tmpReqObject.travelType = travelType
												
												$http({
												url: (baseURL + '/api/travelClaim/getTravelRuleForDa.spr'),
												method: 'POST',
												timeout: commonRequestTimeout,
												transformRequest: jsonTransformRequest,
												data: $scope.tmpReqObject,
												dataType: 'text',
												headers: {
													'Authorization': 'Bearer ' + jwtByHRAPI,
													'Content-Type': 'application/x-www-form-urlencoded'
												}
												}).
													success(function (data_return) {
													if (data_return.clientResponseMsg=="OK"){	//do nothing
														if(data_return.msg=="")
														{
															isRulePresentDA.value = 'Y';	           		
															if(amount < total1){				           			
																showAlert( "Total Amount Exceeds Your Eligible Amount! \n As per Travel Rule Your Eligible Amount is "+amount); 
																return;
															}
															
														}else{
															isRulePresentDA.value = 'N';			   
															//showAlert(data_return.msg);
															return;	
														}
													}
													else{
														//some error
														showAlert("Something went wrong. Please try later.code=6")
														$ionicLoading.hide()
														return ;
													}

													}).error(function (data_return, status) {
												$scope.data_return = {status: status};
												commonService.getErrorMessage($scope.data_return);
												$ionicLoading.hide()
											});		

			 /*$.ajax({
			       	url: "${pageContext.request.contextPath}/travel/travelClaim/getTravelRuleForDa.spr",
			        type: 'POST',
			        data: {'traveltype': travelType,'empId': $("#empId").val()},
			        dataType:'text',
			        success:function(result){
			       
		           		if(result == ''){
		           			isRulePresentDA.value = 'Y';	           		
		           			if(amount < total1){				           			
		           				warningMessageAlert("Total Amount Exceeds Your Eligible Amount! \n As per Travel Rule Your Eligible Amount is "+amount, 'HRAlign'); 
			    				return;
		           			}
		           		}else{		
		           				isRulePresentDA.value = 'N';			   
		           				var formID_value = $(result).filter('form').attr('id');
			           			if(formID_value =='loginForm'){
			           				doSessionOut();
			           			}else{
			           				warningMessageAlert(result, 'HRAlign');
			           			}
		           				return;	    					
		    				}
			        },
		            statusCode: {
		       		    403: function() {// Only if your server returns a 403
		       		    	doSessionOut();
		       		    },
			          	404: function() {//alert('page not found');
			          		doSessionOut();
			            },
			            400: function() {//alert('bad request');
			            	doSessionOut();
			             }
		       		},
		       		error: function (e) { //alert("Server error - " + e);
		       		doSessionOut();
		       		}
				});*/
	}

	
	
	
	$scope.getDATotalValidate = function (i){
		
		var daFromDate = document.getElementById('fromDateDA'+i).value;
		var daToDate = document.getElementById('toDateDA'+i).value;
		
		if(document.getElementById('fromDateDA'+i).value == ""){
			showAlert( "Please enter Daily Allowance From Date!"); 
			return;
		}else
		if(document.getElementById('toDateDA'+i).value == ""){
			showAlert("Please enter Daily Allowance To Date!"); 
			return;
		}
		
		
	}	
	
	$scope.getTotalValidate = function(i){
		
		//var expenseFromDate = document.getElementById('expenseFromDate'+i).value;
		//var expenseToDate = document.getElementById('expenseToDate'+i).value;
		
		if(document.getElementById('fromDateLB'+i).value == ""){
			showAlert("Please enter Lodging and Boarding Expense From Date!"); 
			return;
		}
		if(document.getElementById('toDateLB'+i).value == ""){
			showAlert("Please enter Lodging and Boarding Expense To Date!"); 
			return;
		}
		
		
	}
	
	$scope.getGrandTotal = function (){
		
		var total = 0;
		var bal = 0;
// 		var totalDaAmt1 = Number(document.getElementById('totalDaAmt1').value);
		var totalTravelDetailAmt =	Number(document.getElementById('totalTravelDetailAmt').value);
		var totalLocalConvnAmt1 = Number(document.getElementById('totalLocalConvnAmt1').value);
		var totalExpenseAmt1 = Number(document.getElementById('totalExpenseAmt1').value);
		var totalAmt = Number(document.getElementById('totalAmt').value);	
		var totalIssuedAmount = Number(document.getElementById('totalIssuedAmount').value);
		var listSize2 = document.getElementById('listSize2').value

			total =   totalTravelDetailAmt + totalLocalConvnAmt1 + totalExpenseAmt1;				
			document.getElementById('totalAmt').value = total;	
		if(total < totalIssuedAmount){
			bal =  	total - totalIssuedAmount;
			document.getElementById('totalPayableFrom').value = Math.abs(bal);
			document.getElementById('totalPayableTo').value = "";	
		}else{
			bal =  	total - totalIssuedAmount;
			document.getElementById('totalPayableTo').value = Math.abs(bal);	
			document.getElementById('totalPayableFrom').value = "";
		}		
	}	
	
	
	
	$scope.sendFilesTD = function(fileData,rowno,fileName){
				
			var travelChTdId = document.getElementById('travelChTdId'+rowno).value;
			/*
			var boundary = 'somethingABCD';
			  $scope.formData = "boundary=" + boundary ;
			  $scope.formData += '--' + boundary + '\r\n'
			  $scope.formData += 'Content-Disposition: form-data; name="tdFiles"; filename="' + "img_td_"+imgsrno+rowno  + '\r\n';
			  $scope.formData += 'Content-Type: ' + 'image/jpeg' + '\r\n\r\n';
			  $scope.formData += fileData
			  $scope.formData += '\r\n';
			  $scope.formData += '--' + boundary + '\r\n';
			  $scope.formData += 'Content-Disposition: form-data; name="travelChTdId"\r\n\r\n';
			  //$scope.formData += 'Content-Type: ' + 'text/plain' + '\r\n\r\n';
			  $scope.formData += travelChTdId + '\r\n'
			  $scope.formData += '--' + boundary + '--\r\n';
			*/

			var fd = new FormData();
			fd.append("travelChTdId",travelChTdId)

			var base64result = fileData.split(',')[1];
			var fileType = fileData.split(',')[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0]
			var blob = base64toBlob(base64result, fileType,fileName)
			fd.append('tdFiles', blob,fileName)

			$.ajax({
				url: (baseURL + '/api/travelClaim/uploadFileReviewerAjax.spr'),
				data: fd,
				type: 'POST',
				async:false,
				timeout: commonRequestTimeout,
				contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
				processData: false, // NEEDED, DON'T OMIT THIS
				headers: {
					'Authorization': 'Bearer ' + jwtByHRAPI
				 },
				success : function(success) {
					if (!(success.clientResponseMsg=="OK")){
								console.log(success.clientResponseMsg)
								handleClientResponse(success.clientResponseMsg,"uploadFileReviewerAjax")
								$ionicLoading.hide()
								showAlert("Something went wrong. Please try later.")
								$scope.redirectOnBack();
								return
							}	
							//$ionicLoading.hide()
							//showAlert(success.msg)
							
				},
				error: function (e) { //alert("Server error - " + e);
		       		$scope.data_return = {status: e};
					commonService.getErrorMessage($scope.data_return);
					$ionicLoading.hide()
		       		}				
				});			

			 /* 
			$http({
			url: (baseURL + '/api/travelClaim/uploadFileReviewerAjax.spr'),
			method: 'POST',
			timeout: commonRequestTimeout,
			data: $scope.formData,
			dataType:'text',
			headers: {
				'Content-Type' : 'multipart/form-data;boundary=somethingABCD'
			}
			}).
				success(function (data_return) {
				if (data_return.clientResponseMsg=="OK"){	//do nothing
					if(data_return.msg=="")
					{
						//send for approval
						
						
						
					}else{
						   
						showAlert( data_return.msg);
						return;	
					}
				}
				else{
					//some error
					showAlert("Something went wrong. Please try later.")
					$ionicLoading.hide()
					return ;
				}

				}).error(function (data_return, status) {
			$scope.data_return = {status: status};
			commonService.getErrorMessage($scope.data_return);
			$ionicLoading.hide()
		});		*/	
	}
	
	
	$scope.saveImageFilesTD= function(rowno){
		var travelChTdId = document.getElementById('travelChTdId'+rowno).value;
		var travelTranId = document.getElementById("wfStsId").value;
		$scope.tmpReqObject ={}
		$scope.tmpReqObject.travelChTdId = travelChTdId
		$scope.tmpReqObject.travelTranId = travelTranId
		$scope.tmpReqObject.menuId = $scope.requestObject.menuId
		$scope.tmpReqObject.buttonRights = $scope.requestObject.buttonRights
		
	
			$http({
				url: (baseURL + '/api/travelClaim/saveMultiFileUpload.spr'),
				method: 'POST',
				timeout: commonRequestTimeout,
				transformRequest: jsonTransformRequest,
				data: $scope.tmpReqObject,
				dataType: 'text',
				headers: {
					'Authorization': 'Bearer ' + jwtByHRAPI,
				 	'Content-Type': 'application/x-www-form-urlencoded'
				}
				}).
					success(function (data_return) {
						if (data_return.msg=="")
						{}
					
					if (data_return.clientResponseMsg=="OK"){	//do nothing
						//$ionicLoading.hide()
						return
					}
					else{
						//some error
						
						//$ionicLoading.hide()
						return ;
					}
					
					}).error(function (data_return, status) {
				$scope.data_return = {status: status};
				commonService.getErrorMessage($scope.data_return);
				$ionicLoading.hide()
			});
	}	


	
	$scope.sendFilesEX = function(fileData,rowno,fileName){
			var travelChTdId = document.getElementById('travelChTdId'+rowno).value;
			var travelTranId = document.getElementById("wfStsId").value;
			
			/*
			  var boundary = 'somethingABCD';
 
				
			  $scope.formData = "boundary=" + boundary ;
			  $scope.formData += '--' + boundary + '\r\n'
			  $scope.formData += 'Content-Disposition: form-data; name="tdFiles"; filename="' + "img_ex_"+imgsrno+rowno + '\r\n';
			  $scope.formData += 'Content-Type: ' + 'image/jpeg' + '\r\n\r\n';
			  $scope.formData += fileData
			  $scope.formData += '\r\n';
			  $scope.formData += '--' + boundary + '\r\n';
			  $scope.formData += 'Content-Disposition: form-data; name="travelChTdId"\r\n\r\n';
			  //$scope.formData += 'Content-Type: ' + 'text/plain' + '\r\n\r\n';
			  $scope.formData += travelChTdId + '\r\n'
			  $scope.formData += '--' + boundary + '--\r\n';
*/

			var fd = new FormData();
			fd.append("travelTranId",travelTranId)
		
			fd.append("index",rowno)
			

			var base64result = fileData.split(',')[1];
			var fileType = fileData.split(',')[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0]
			var blob = base64toBlob(base64result, fileType,fileName)
			fd.append('tdFiles', blob,fileName)

			$.ajax({
				url: (baseURL + '/api/travelClaim/uploadTravelExFileAjax.spr'),
				data: fd,
				type: 'POST',
				async:false,
				timeout: commonRequestTimeout,
				contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
				processData: false, // NEEDED, DON'T OMIT THIS
				headers: {
					'Authorization': 'Bearer ' + jwtByHRAPI
				 },
				success : function(success) {
					if (!(success.clientResponseMsg=="OK")){
								console.log(success.clientResponseMsg)
								handleClientResponse(success.clientResponseMsg,"uploadTravelExFileAjax")
								$ionicLoading.hide()
								showAlert("Something went wrong. Please try later.")
								$scope.redirectOnBack();
								return
							}	
							//$ionicLoading.hide()
							//showAlert(success.msg)
							
				},
				error: function (e) { //alert("Server error - " + e);
		       		$scope.data_return = {status: e};
					commonService.getErrorMessage($scope.data_return);
					$ionicLoading.hide()
		       		}				
				});			


			  /*
			$http({
			url: (baseURL + '/api/travelClaim/uploadTravelExFileAjax.spr'),
			method: 'POST',
			timeout: commonRequestTimeout,
			data: $scope.formData,
			dataType:'text',
			headers: {
				'Content-Type' : 'multipart/form-data;boundary=somethingABCD'
			}
			}).
				success(function (data_return) {
				if (data_return.clientResponseMsg=="OK"){	//do nothing
					if(data_return.msg=="")
					{
						//send for approval
						
						
						
					}else{
						   
						showAlert( data_return.msg);
						return;	
					}
				}
				else{
					//some error
					showAlert("Something went wrong. Please try later.")
					$ionicLoading.hide()
					return ;
				}

				}).error(function (data_return, status) {
			$scope.data_return = {status: status};
			commonService.getErrorMessage($scope.data_return);
			$ionicLoading.hide()
		});		
*/		
	}
	
	
	$scope.saveImageFilesEX= function(rowno){
		var travelChTdId = document.getElementById('travelChTdId'+rowno).value;
		var travelTranId = document.getElementById("wfStsId").value;
		$scope.tmpReqObject ={}
		$scope.tmpReqObject.travelChTdId = travelChTdId
		$scope.tmpReqObject.travelTranId = travelTranId
		$scope.tmpReqObject.index=rowno
		$scope.tmpReqObject.menuId = $scope.requestObject.menuId
		$scope.tmpReqObject.buttonRights = $scope.requestObject.buttonRights
		
	
			$http({
				url: (baseURL + '/api/travelClaim/saveExMultiFileUpload.spr'),
				method: 'POST',
				timeout: commonRequestTimeout,
				transformRequest: jsonTransformRequest,
				data: $scope.tmpReqObject,
				dataType: 'text',
				headers: {
					'Authorization': 'Bearer ' + jwtByHRAPI,
				 	'Content-Type': 'application/x-www-form-urlencoded'
				}
				}).
					success(function (data_return) {
						if (data_return.msg=="")
						{}
					
					if (data_return.clientResponseMsg=="OK"){	//do nothing
						//$ionicLoading.hide()
						return
					}
					else{
						//some error
						//alert("LB \n" + data_return.clientResponseMsg)
						//$ionicLoading.hide()
						return ;
					}
						$ionicLoading.hide()
					}).error(function (data_return, status) {
				$scope.data_return = {status: status};
				commonService.getErrorMessage($scope.data_return);
				$ionicLoading.hide()
			});
	}



		$scope.sendFilesLC = function(fileData,rowno,fileName){
			var travelChTdId = document.getElementById('travelChTdId'+rowno).value;
			var travelTranId = document.getElementById("wfStsId").value;
			
			/*
			  var boundary = 'somethingABCD';
  
		      
			  $scope.formData = "boundary=" + boundary ;
			  $scope.formData += '--' + boundary + '\r\n'
			  $scope.formData += 'Content-Disposition: form-data; name="tdFiles"; filename="' + "img_lc_"+imgsrno+rowno + '\r\n';
			  $scope.formData += 'Content-Type: ' + 'image/jpeg' + '\r\n\r\n';
			  $scope.formData += fileData
			  $scope.formData += '\r\n';
			  $scope.formData += '--' + boundary + '\r\n';
			  $scope.formData += 'Content-Disposition: form-data; name="travelChTdId"\r\n\r\n';
			  //$scope.formData += 'Content-Type: ' + 'text/plain' + '\r\n\r\n';
			  $scope.formData += travelChTdId + '\r\n'
			  $scope.formData += '--' + boundary + '--\r\n';

			*/
			
			var fd = new FormData();
			fd.append("travelChTdId",travelChTdId)
			fd.append("travelTranId",travelTranId)

			var base64result = fileData.split(',')[1];
			var fileType = fileData.split(',')[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0]
			var blob = base64toBlob(base64result, fileType,fileName)
			fd.append('tdFiles', blob,fileName)
			fd.append('index',rowno)

			$.ajax({
				url: (baseURL + '/api/travelClaim/uploadTravelLcFileAjax.spr'),
				data: fd,
				type: 'POST',
				async:false,
				timeout: commonRequestTimeout,
				contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
				processData: false, // NEEDED, DON'T OMIT THIS
				headers: {
					'Authorization': 'Bearer ' + jwtByHRAPI
				 },
				success : function(success) {
					if (!(success.clientResponseMsg=="OK")){
								console.log(success.clientResponseMsg)
								handleClientResponse(success.clientResponseMsg,"uploadTravelLcFileAjax")
								$ionicLoading.hide()
								showAlert("Something went wrong. Please try later.")
								$scope.redirectOnBack();
								return
							}	
							//$ionicLoading.hide()
							//showAlert(success.msg)
							
				},
				error: function (e) { //alert("Server error - " + e);
		       		$scope.data_return = {status: e};
					commonService.getErrorMessage($scope.data_return);
					$ionicLoading.hide()
		       		}				
				});			

			
			/*	
			$http({
			url: (baseURL + '/api/travelClaim/uploadTravelLcFileAjax.spr'),
			method: 'POST',
			timeout: commonRequestTimeout,
			data: $scope.formData,
			dataType:'text',
			headers: {
				'Content-Type' : 'multipart/form-data;boundary=somethingABCD'
			}
			}).
				success(function (data_return) {
				if (data_return.clientResponseMsg=="OK"){	//do nothing
					if(data_return.msg=="")
					{
						//send for approval
						
						
						
					}else{
						   
						showAlert(  data_return.msg);
						return;	
					}
				}
				else{
					//some error
					showAlert("Something went wrong. Please try later.")
					$ionicLoading.hide()
					return ;
				}

				}).error(function (data_return, status) {
			$scope.data_return = {status: status};
			commonService.getErrorMessage($scope.data_return);
			$ionicLoading.hide()
		});	
*/		
	}
	
	
	$scope.saveImageFilesLC = function(rowno){
		var travelChTdId = document.getElementById('travelChTdId'+rowno).value;
		var travelTranId = document.getElementById("wfStsId").value;
		
		$scope.tmpReqObject ={}
		$scope.tmpReqObject.travelChTdId = travelChTdId
		$scope.tmpReqObject.travelTranId = travelTranId
		$scope.tmpReqObject.index=rowno
		$scope.tmpReqObject.menuId = $scope.requestObject.menuId
		$scope.tmpReqObject.buttonRights = $scope.requestObject.buttonRights
		
	
			$http({
				url: (baseURL + '/api/travelClaim/saveLcMultiFileUpload.spr'),
				method: 'POST',
				timeout: commonRequestTimeout,
				transformRequest: jsonTransformRequest,
				data: $scope.tmpReqObject,
				dataType: 'text',
				headers: {
					'Authorization': 'Bearer ' + jwtByHRAPI,
				 	'Content-Type': 'application/x-www-form-urlencoded'
				}
				}).
					success(function (data_return) {
						if (data_return.msg=="")
						{}
					
					if (data_return.clientResponseMsg=="OK"){	//do nothing
						//$ionicLoading.hide()
						return
					}
					else{
						//some error
						//alert("LC \n" + data_return.clientResponseMsg)
						//$ionicLoading.hide()
						return ;
					}
						
					}).error(function (data_return, status) {
				$scope.data_return = {status: status};
				commonService.getErrorMessage($scope.data_return);
				$ionicLoading.hide()
			});
	}
	
	
	
	$scope.goSendForApproval =  function () {
		
					
		//Travel data	grid1
		//stat arr grid 2
		//LB 	grid 3
		//LC	 grid 4
		//DA	 grid 5
		//TA	grid 6
		
		/*var fileName,fileContent,fileType
		fileName = document.getElementById("fileTravel_10").value
		fileType = document.getElementById("fileTravelContentType_10").value
		fileContent = document.getElementById("fileTravelContent_10").value
		
		
		$scope.sendOtherFilesTD($scope.selectedValues.fileData,0,fileName,fileType)
		alert("send over")
		$scope.saveImageFilesTD(0)
		*/
			

		$ionicLoading.show()
		
	
		
		//populate data input by user to objects for sending for approval.
		for(i=0;i<$scope.countGrid3;i++){
			var amt = document.getElementById("amountLB"+i).value
			
			if(isNaN(amt)){
				showAlert("Please enter Lodging Boarding expense amount in digits only")
				$ionicLoading.hide();
				return
			}
		}
		$scope.populateDataInObjectsForGrid1()
		//grid 2 there is not data input by user
		//grid 3, 4,5 will be done in this function
		
		
		var n = 0;
		var no = $scope.countGrid3 //LB grid
		var isActiveComp = 'N'
		var isActiveOwn = 'N'
		if(document.getElementById('comparr').checked == true){
				isActiveComp = 'Y';
				isActiveOwn = 'N'
		}else{
				isActiveComp = 'N';
				isActiveOwn = 'Y'
		}
		
		
		var listSize = $scope.travelClaimForm.gridSize1
		var countGrid2 = $scope.countGrid4	
		var countGrid3= $scope.countGrid5
		
		
		for(var i=0; i<no; i++){
				var expenseFromDate = document.getElementById('fromDateLB'+i).value;
				$scope.travelClaimForm.travelExpenseGridvoList[i].expenseFromDate = expenseFromDate
				
				var expenseToDate = document.getElementById('toDateLB'+i).value;
				$scope.travelClaimForm.travelExpenseGridvoList[i].expenseToDate = expenseToDate
				
				var expenseAmount = document.getElementById('amountLB'+i).value;
				$scope.travelClaimForm.travelExpenseGridvoList[i].expenseAmount = expenseAmount
				
				var expenseRemarks = document.getElementById('remarksLB'+i).value;
				if ($scope.utf8Enabled == 'true' ){
					if (expenseRemarks){
						$scope.travelClaimForm.travelExpenseGridvoList[i].expenseRemarks = encodeURI(expenseRemarks)
					}
				}else{
					$scope.travelClaimForm.travelExpenseGridvoList[i].expenseRemarks = expenseRemarks
				}
				
				
				
				elem = document.getElementById("expenseTypeId"+i)
				expTypeText = elem.options[elem.selectedIndex].text
				var expenseTypeId = $scope.getExpenseId( expTypeText)
				$scope.travelClaimForm.travelExpenseGridvoList[i].expenseTypeId=expenseTypeId
				
				elem = document.getElementById("currencyTypeIdLB"+i)
				currTypeText = elem.options[elem.selectedIndex].text
				var expenseCurrency = $scope.getCurrencyId( currTypeText)
				$scope.travelClaimForm.travelExpenseGridvoList[i].currencyTypeId = expenseCurrency

				elem = document.getElementById("destination"+i)
				desTypeText = elem.options[elem.selectedIndex].text
				var destId = $scope.getDestinationId(desTypeText)
				$scope.travelClaimForm.travelExpenseGridvoList[i].destinationId = destId
			
				
				
				if(expenseTypeId != "-1"){
						
					    if (compareDate(document.getElementById("smallestTravelDate").value, document.getElementById('smallestFromExpDate').value,  
						 $scope.requestObject.dateFormat)== -1){
							 $ionicLoading.hide()
					    	showAlert( "Lodging and Boarding Expense From Date must not be less than Travel Date!");
							 return;
			        	}
					    if(compareDate(document.getElementById('fromDateLB'+i).value, document.getElementById('toDateLB'+i).value,  $scope.requestObject.dateFormat) == -1){
							$ionicLoading.hide()
					    	 showAlert("Lodging and Boarding Expense To Date must not be smaller than Lodging and Boarding Expense From Date!");
							return;
						}
					    if(expenseCurrency == "-1"){
							$ionicLoading.hide()
					    	 showAlert("Please enter Lodging and Boarding Expense Currency!");    
							return;
					    }
						if (desTypeText == ""){
							showAlert("Please seect City in Lodging and Boarding section!");    
							return;
						}
				}else{
					 if(expenseAmount != ""){
						 $ionicLoading.hide()
						  showAlert("Please enter Lodging and Boarding Expense Type !");    
							return; 
					    }
					 if(expenseCurrency != "-1"){
						 $ionicLoading.hide()
						  showAlert("Please enter Lodging and Boarding Expense Type !");       
							return;
					    }
					 if(expenseFromDate != ""){
						 $ionicLoading.hide()
						  showAlert("Please enter Lodging and Boarding Expense Type !");    
							return; 
					    }
					 if(expenseToDate != ""){
						 $ionicLoading.hide()
						  showAlert("Please enter Lodging and Boarding Expense Type !");    
							return; 
					    }
				}
			}
			
			
			
			//local conv data capture is not is jsp
			for(var i=0; i<countGrid2 ; i++){
			
				
				elem = document.getElementById("localConvId"+i)
				conmvText = elem.options[elem.selectedIndex].text
				var convId = $scope.getLocalConvId(conmvText)
				$scope.travelClaimForm.travelLocalConveyanceGridvoList[i].travelModeTypeId = convId
			
			
				$scope.travelClaimForm.travelLocalConveyanceGridvoList[i].lcDate = document.getElementById('fromDateLC'+i).value
	
				$scope.travelClaimForm.travelLocalConveyanceGridvoList[i].lcToDate = document.getElementById('toDateLC'+i).value 
				$scope.travelClaimForm.travelLocalConveyanceGridvoList[i].lcApplicableAmount = document.getElementById('amountLC'+i).value
	
				elem = document.getElementById("currencyTypeIdLC"+i)
				currTypeText = elem.options[elem.selectedIndex].text
				var currId = $scope.getCurrencyId( currTypeText)
	
				$scope.travelClaimForm.travelLocalConveyanceGridvoList[i].currencyTypeId = currId
	
				$scope.travelClaimForm.travelLocalConveyanceGridvoList[i].lcDistance = document.getElementById('travelDistLC'+i).value
			}
				
			
			
			//// local conv data over
			
			//// da data
		
		for(var i=0; i<countGrid3; i++){
			var dAFromDate = document.getElementById('fromDateDA'+i).value;
			$scope.dafdate = dAFromDate
			$scope.travelClaimForm.travelClaimDAChildList[i].daFromDate = dAFromDate
			
			var dAToDate = document.getElementById('toDateDA'+i).value;
			$scope.datdate = dAToDate
			$scope.travelClaimForm.travelClaimDAChildList[i].daToDate = dAToDate
			
			var dAAmount = document.getElementById('amountDA'+i).value;
			$scope.travelClaimForm.travelClaimDAChildList[i].daAmount = dAAmount 
			
			var dailyAllowance = document.getElementById('dailyAllowanceDA'+i).value;
			$scope.travelClaimForm.travelClaimDAChildList[i].dailyAllowance = dailyAllowance
			
			var dARemarks = document.getElementById('remarksDA'+i).value;
			if ($scope.utf8Enabled == 'true' ){
				if (dARemarks){
					$scope.travelClaimForm.travelClaimDAChildList[i].daRemarks = encodeURI(dARemarks)
				}
			}else{
				$scope.travelClaimForm.travelClaimDAChildList[i].daRemarks = dARemarks 
			}
			
			
			elem = document.getElementById("currencyTypeIdDA"+i)
			currTypeText = elem.options[elem.selectedIndex].text
			var dACurrency = $scope.getCurrencyId(currTypeText)
			$scope.travelClaimForm.travelClaimDAChildList[i].currencyTypeId = dACurrency 
			
			if(dailyAllowance != ""){
									
				    if(dAAmount == ""){
						$ionicLoading.hide()
				    	 showAlert("Please Enter Daily Allownce Amount!");    
						 
						return; 
				    }
				    if (compareDate(document.getElementById("smallestTravelDate").value, $scope.dafdate,   $scope.requestObject.dateFormat)== -1){
						$ionicLoading.hide()
				    	 showAlert("Daily Allownce From Date must not be less than Travel Date!");
						 
						 return;
		        	}
				    if(compareDate($scope.dafdate,$scope.datdate,  $scope.requestObject.dateFormat) == -1){
						$ionicLoading.hide()
				    	 showAlert("Daily Allownce To Date must not be smaller than Expense From Date!");

						return;
					}
				    if(dACurrency == "-1"){
						$ionicLoading.hide()
				    	 showAlert("Please enter Daily Allownce Currency!");    
						 
						return;
				    }
			}else{
				if(dACurrency != "-1"){
					$ionicLoading.hide()
					 showAlert("Please enter Daily Allownce !");    
					return;
			    }
				if(dAFromDate != ""){
					$ionicLoading.hide()
					 showAlert("Please enter Daily Allownce !");    
					return;
			    }
				if(dAToDate != ""){
					$ionicLoading.hide()
					 showAlert("Please enter Daily Allownce !");    
					return;
			    }
				 if(dAAmount != ""){
					 $ionicLoading.hide()
					  showAlert("Please enter Daily Allownce !");    
						return; 
				    }
				}
			}
			
		
			for(var p=0; p<countGrid2; p++){
				var lcDate = document.getElementById('fromDateLC'+p).value;
				var lcToDate = document.getElementById('toDateLC'+p).value;
				var lcAmt = document.getElementById('amountLC'+p).value;
				
				
				elem = document.getElementById("currencyTypeIdLC"+p)
				currTypeText = elem.options[elem.selectedIndex].text
				var localConveyanceCurrency = $scope.getCurrencyId(currTypeText)
				
				elem = document.getElementById("localConvId"+p)
				travelModeText = elem.options[elem.selectedIndex].text
				var travelModeTypeId = $scope.getLocalConvId(travelModeText)	
				
				if( travelModeTypeId != "-1"){
					
					if(lcDate == ""){
						$ionicLoading.hide()
						  showAlert("Please enter Local Conveyance From Date!");    
						return; 
				    }
					if(compareDate(lcDate, document.getElementById("smallestTravelDate").value,  $scope.requestObject.dateFormat) == 1){
						$ionicLoading.hide()
						  showAlert("Local Conveyance From Date must not be less than Travel Date!"); 
						return;
					}

					if(lcAmt == ""){
						$ionicLoading.hide()
						  showAlert("Please enter Local Conveyance Amount!");    
						return; 
				    }
				    if(compareDate(lcDate, lcToDate,  $scope.requestObject.dateFormat) == -1){
						$ionicLoading.hide()
					  showAlert("Local Conveyance To Date must not be smaller than Local Conveyance From Date!");
					return;
					}
				    if(localConveyanceCurrency == "-1"){
						$ionicLoading.hide()
				    	  showAlert("Please enter Local Conveyance Currency!");    
						return;
				    }
				}else{
					if(localConveyanceCurrency != "-1"){
						$ionicLoading.hide()
						  showAlert("Please enter Mode of Local Conveyance !");    
						return;
				    }
					if(lcDate != ""){
						$ionicLoading.hide()
						  showAlert("Please enter Mode of Local Conveyance !");    
						return;
				    }
					if(lcToDate != ""){
						$ionicLoading.hide()
						  showAlert("Please enter Mode of Local Conveyance !");    
						return;
				    }
					if(lcAmt != ""){
						$ionicLoading.hide()
						  showAlert("Please enter Mode of Local Conveyance !");    
						return;
				    }
				}
				
			}
				if(document.getElementById('comparr').checked == true){
						isActiveComp.value = 'Y';
					}else{
						isActiveComp.value = 'N';
					}
					
				
				if(document.getElementById('ownarr').checked == true){
						isActiveOwn.value = 'Y';
				}else{
						isActiveOwn.value = 'N';
				}
				var isRuleExceeds = document.getElementById('isRuleExceeds').value;
				var amount = Number(document.getElementById('amountToValidate').value);
				var total1 = Number(document.getElementById('totalExpenseAmount').value);
				var isRulePresent = document.getElementById('isRulePresent').value;
				var isRuleExceedsDA = document.getElementById('isRuleExceedsDA').value;	
				var isRulePresentDA = document.getElementById('isRulePresentDA').value;
				var amountDa = Number(document.getElementById('amountToValidateDa').value);
				var totalDa1 = Number(document.getElementById('totalDaAmount').value);
				
				
				
				if(amount < total1){
					isRuleExceeds.value = 'Y'; 
				}else{
					isRuleExceeds.value = 'N';
				}	
					
				if(amountDa < totalDa1){
					isRuleExceedsDA.value = 'Y'; 
				}else{
					isRuleExceedsDA.value = 'N';
				}
				
						$scope.tmpReqObject = {}
						$scope.tmpReqObject.empId = sessionStorage.getItem('empId')
					
						$scope.tmpReqObject.menuId = $scope.requestObject.menuId
						
						$http({
						url: (baseURL + '/api/travelClaim/getValidate.spr'),
						method: 'POST',
						timeout: commonRequestTimeout,
						transformRequest: jsonTransformRequest,
						data: $scope.tmpReqObject,
						dataType: 'text',
						headers: {
							'Authorization': 'Bearer ' + jwtByHRAPI,
							'Content-Type': 'application/x-www-form-urlencoded'
						}
						}).
							success(function (data_return) {
								$ionicLoading.hide()
							if (data_return.clientResponseMsg=="OK"){	//do nothing
								if(data_return.msg=="")
								{
									//send for approval
									
									$ionicLoading.hide()
									var confirmPopup = $ionicPopup.confirm({
											title: 'Are you sure ?',
											template: 'Do you want to send for approval?', //Message
										});
										confirmPopup.then(function (res) {
											if (res) {
												$ionicLoading.show()
												document.getElementById("btnSave").disabled = true
												$scope.submitForm(isActiveComp,isActiveOwn,isRuleExceeds,amount,isRulePresent,isRulePresentDA,isRuleExceedsDA,amountDa)
											} else {
											return;
										}
										});
										
									/*		
									var confirmPopup = $ionicPopup.confirm({
										title: '',
										template: 'Do you want to send for approval?', //Message
									});
									confirmPopup.then(function (res) {
										if (res) {
										$ionicLoading.show()
										$scope.submitForm(isActiveComp,isActiveOwn,isRuleExceeds,amount,isRulePresent,isRulePresentDA,isRuleExceedsDA,amountDa)
										return
										} else {
										return;
									}
									});
									*/
									///////////////	
									
									
								}else{
									   
									showAlert(data_return.msg);
									return;	
								}
							}
							else{
								//some error
								showAlert("Something went wrong. Please try later.")
								$ionicLoading.hide()
								return ;
							}

							}).error(function (data_return, status) {
						$scope.data_return = {status: status};
						commonService.getErrorMessage($scope.data_return);
						$ionicLoading.hide()
					});	
				/*	
				$.ajax({
				       	url: "${pageContext.request.contextPath}/travel/travelClaim/getValidate.spr",
				        type: 'POST',
				        data: {'empId': $("#empId").val(),'menuId': $("#menuId").val()},
				        dataType: 'text',
				        success:function(result){
			           		if(result == ''){
			           			$(document).ready(function() {
						
										confirmInfoAlert(document.getElementById("sendForApprovalLable").value,"NO","YES",function(r) {	
										if(r){
												document.form1.action = "sendForApprove.spr?level=1&isActiveComp="+isActiveComp+ "&isActiveOwn="+isActiveOwn +"&isRuleExceeds=" +isRuleExceeds +"&amount=" +amount +"&isRulePresent=" +isRulePresent +"&isRulePresentDA=" +isRulePresentDA +"&isRuleExceedsDA=" +isRuleExceedsDA +"&amountDa=" +amountDa;
												document.form1.submit();
												tb_open_new();
			       			 				}
										});
									});
			           			}else{
			           				var formID_value = $(result).filter('form').attr('id');
				           			if(formID_value =='loginForm'){
				           				doSessionOut();
				           			}else{
				           				  showAlert(result);
				           			}
		        					return;   
		        				}
			           },
			            statusCode: {
			       		    403: function() {// Only if your server returns a 403
			       		    	doSessionOut();
			       		    },
				          	404: function() {//alert('page not found');
				          		doSessionOut();
				            },
				            400: function() {//alert('bad request');
				            	doSessionOut();
				             }
			       		},
			       		error: function (e) { //alert("Server error - " + e);
			       		doSessionOut();
			       		}
				});*/
				
	}


	
	$scope.submitForm = function(isActiveComp,isActiveOwn,isRuleExceeds,amount,isRulePresent,isRulePresentDA,isRuleExceedsDA,amountDa){
		
		
		$ionicLoading.show()		
				//TD files and images
		for (var i = 0;i < $scope.travelClaimForm.travelRuleGridChildVOList.length;i++){
			var lbTdfilesOrImagePresent = false
			for (var fileSrno = 1;fileSrno <=10;fileSrno++){
				elem  = document.getElementById('fileTravel_'+fileSrno+""+i)
				if (elem.value != ""){
					//file selected at this location
					var fname = $scope.travelFileNames[i][fileSrno-1]
					var fcontent = $scope.travelFileContents[i][fileSrno-1]
					$scope.sendFilesTD(fcontent,i,fname)
					lbTdfilesOrImagePresent = true
				}
				
				elem  = document.getElementById('imgTravel_'+fileSrno+""+i)
				if (elem.style.display =="inline-block"){
					imgSrc = elem.src
					var imageData = imgSrc
					var ts = new Date();
					ts = ts.getFullYear() +""+ ts.getMonth() +""+ ts.getDate() + "" + ts.getHours() +""+ ts.getMinutes() +""+ ts.getSeconds()

					$scope.sendFilesTD(imageData,i,"img_td_"+fileSrno+"_"+ts+".jpg")
					lbTdfilesOrImagePresent = true
				}
			}
			if (lbTdfilesOrImagePresent){
				$scope.saveImageFilesTD(i)
			}
		}
		
		
		//LB files and images
		for (var i = 0;i < $scope.countGrid3;i++){
			var lbLBfilesOrImagePresent = false
			for (var fileSrno = 1;fileSrno <=10;fileSrno++){
				elem  = document.getElementById('fileLB_'+fileSrno+""+i)
				if (elem.value != ""){
					//file selected at this location
					var fname = $scope.LBFileNames[i][fileSrno-1]
					var fcontent = $scope.LBFileContents[i][fileSrno-1]
					$scope.sendFilesEX(fcontent,i,fname)
					lbLBfilesOrImagePresent = true
				}
				
				elem  = document.getElementById('imgLB_'+fileSrno+""+i)
				if (elem.style.display =="inline-block"){
					imgSrc = elem.src
					var imageData = imgSrc
					var ts = new Date();
					ts = ts.getFullYear() +""+ ts.getMonth() +""+ ts.getDate() + "" + ts.getHours() +""+ ts.getMinutes() +""+ ts.getSeconds()

					$scope.sendFilesEX(imageData,i,"img_lb_"+fileSrno+"_"+ts+".jpg")
					lbLBfilesOrImagePresent = true
				}
			}
			if (lbLBfilesOrImagePresent){
				$scope.saveImageFilesEX(i)
			}
		}
		
		
		
		
		//LC files and images
		for (var i = 0;i < $scope.countGrid4;i++){
			var lbLCfilesOrImagePresent = false
			for (var fileSrno = 1;fileSrno <=10;fileSrno++){
				elem  = document.getElementById('fileLC_'+fileSrno+""+i)
				if (elem.value != ""){
					//file selected at this location
					var fname = $scope.LCFileNames[i][fileSrno-1]
					var fcontent = $scope.LCFileContents[i][fileSrno-1]
					$scope.sendFilesLC(fcontent,i,fname)
					lbLCfilesOrImagePresent = true
				}
				
				elem  = document.getElementById('imgLConv_'+fileSrno+""+i)
				if (elem.style.display =="inline-block"){
					imgSrc = elem.src
					var imageData = imgSrc
					var ts = new Date();
					ts = ts.getFullYear() +""+ ts.getMonth() +""+ ts.getDate() + "" + ts.getHours() +""+ ts.getMinutes() +""+ ts.getSeconds()

					$scope.sendFilesLC(imageData,i,"img_lc_"+fileSrno+"_"+ts+".jpg")
					lbLCfilesOrImagePresent = true
				}
			}
			if (lbLCfilesOrImagePresent){
			
				$scope.saveImageFilesLC(i)
			}
		}

		
		$ionicLoading.show()
		
		var isActiveComp = 'N'
		var isActiveOwn = 'N'
		if(document.getElementById('comparr').checked == true){
				isActiveComp = 'Y';
				isActiveOwn = 'N'
		}else{
				isActiveComp = 'N';
				isActiveOwn = 'Y'
		}
		$scope.reqSendObj = {}
		//$scope.reqSendObj.travelClaimForm = $scope.travelClaimForm
		$scope.travelClaimForm.isActiveComp = isActiveComp
		$scope.travelClaimForm.isActiveOwn = isActiveOwn
		$scope.travelClaimForm.isRuleExceeds = isRuleExceeds
		$scope.travelClaimForm.amount = amount
		$scope.travelClaimForm.isRulePresent = isRulePresent
		$scope.travelClaimForm.isRulePresentDA = isRulePresentDA
		$scope.travelClaimForm.isRuleExceedsDA = isRuleExceedsDA
		$scope.travelClaimForm.amountDa = amountDa
		$scope.travelClaimForm.additionalInfo = $scope.travelClaimForm.travelClaimVo.additionalInfo
		
		
	
		//$scope.reqSendObj.nobj = {}
		//$scope.reqSendObj.nobj.param1 = "VALUEL 1"
		//alert("sending")
		
		//if(1==1) return
				
		if ($scope.utf8Enabled == 'true' && $scope.travelClaimForm.travelClaimVo){
			if ($scope.travelClaimForm.travelClaimVo.applicantRemark){
				$scope.travelClaimForm.travelClaimVo.applicantRemark = encodeURI($scope.travelClaimForm.travelClaimVo.applicantRemark)
			}
		}
		
		
				
				$scope.travelClaimForm.empId = sessionStorage.getItem('empId')
			
				$scope.travelClaimForm.menuId = $scope.requestObject.menuId
				//if (1==1)return

				$http({
					url: (baseURL + '/api/travelClaim/sendForApprove.spr'),
					method: 'POST',
					timeout: commonRequestTimeout,
					transformRequest: jsonTransformRequest,
					data: $scope.travelClaimForm,
					dataType: 'text',
					headers: {
						'Authorization': 'Bearer ' + jwtByHRAPI,
					 	'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).
					success(function (data_return) {
					if (data_return.clientResponseMsg=="OK"){	//do nothing
						//$state.go("app.RequestListCombined")
						$scope.redirectOnBack()
						$ionicLoading.hide()
						document.getElementById("btnSave").disabled = false
						showAlert( data_return.msg);
						
						
					}
					else{
						//some error
						showAlert("Something went wrong. Please try later.")
						document.getElementById("btnSave").disabled = false
						$scope.redirectOnBack()
						$ionicLoading.hide()
						return ;
					}
						$ionicLoading.hide()
						
					}).error(function (data_return, status) {
					showAlert("Something went wrong. Please try later.")
					document.getElementById("btnSave").disabled = false
					
				$scope.data_return = {status: status};
				commonService.getErrorMessage($scope.data_return);
				$ionicLoading.hide()
			});
		
	}
	
	

	$scope.populateDataInObjectsForGrid1 = function(){
		
		for(var i=0;i<$scope.countGrid1;i++){
			$scope.travelClaimForm.travelRuleGridChildVOList[i].travelChTdAmount = document.getElementById('amt'+i).value
			$scope.travelClaimForm.travelRuleGridChildVOList[i].claimRemarks = document.getElementById('claimRemarks'+i).value 

			if ($scope.utf8Enabled == 'true' ){
				if ($scope.travelClaimForm.travelRuleGridChildVOList[i].claimRemarks){
					$scope.travelClaimForm.travelRuleGridChildVOList[i].claimRemarks = encodeURI($scope.travelClaimForm.travelRuleGridChildVOList[i].claimRemarks)
				}
			}

			
			elem = document.getElementById("currencyTypeId"+i)
			currTypeText = elem.options[elem.selectedIndex].text
			$scope.travelClaimForm.travelRuleGridChildVOList[i].currencyTypeId = $scope.getCurrencyId( currTypeText)
		}
	}
	
	

	


$scope.cameraTakePicture = 	function (event) { 
	event.stopPropagation()	
	
	var btnid = $scope.selectedValues.elem.id
	var mode='camera'
	var idx;
	var module;
	if (btnid.indexOf('btncameraTravel')>=0){
		//travel
		module='travel'
		idx= btnid.replace("btncameraTravel","")
	}
	if (btnid.indexOf('btncameraLB')>=0){
		//travel
		module='LB'
		idx= btnid.replace("btncameraLB","")
	}
	if (btnid.indexOf('btncameraLC')>=0){
		//travel
		module='LC'
		idx= btnid.replace("btncameraLC","")
	}
		
	
	var lbFoundPlace = false
	var iPlaceIndex = -1
	
    if (module=='travel'){
		//find place where to add image
		for(var i=1; i <=10 ; i++){
			elem = document.getElementById("imgTravel_"+i+""+idx)
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
		imgcontrolName= "imgTravel_"+ (iPlaceIndex ) +idx
	}
	
	if (module=='LB'){
		//find place where to add image
		for(var i=1; i <=10 ; i++){
			elem = document.getElementById("imgLB_"+i+""+idx)
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
		imgcontrolName= "imgLB_"+ (iPlaceIndex ) +idx
	}
	
	
	
	if (module=='LC'){
		//find place where to add image
		for(var i=1; i <=10 ; i++){
			elem = document.getElementById("imgLConv_"+i+""+idx)
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
		imgcontrolName= "imgLConv_"+ (iPlaceIndex ) +idx
	}
	
	
	

   navigator.camera.getPicture(onSuccess, onFail, { quality: 25,
    destinationType: Camera.DestinationType.DATA_URL,
	sourceType: Camera.PictureSourceType.CAMERA,
	correctOrientation: true
		});

		function onSuccess(imageData) {
			var image = document.getElementById(imgcontrolName);
			image.style.display="inline-block"
			var thisResult = JSON.parse(imageData);
			if (window.device.platform != "Android"){
                image.src = "data:image/jpeg;base64," + imageData;
                //$scope.imageData = "data:image/jpeg;base64," + imageData;
            }else{
                var thisResult = JSON.parse(imageData);
                // convert json_metadata JSON string to JSON Object 
                //var metadata = JSON.parse(thisResult.json_metadata);
                image.src = "data:image/jpeg;base64," + thisResult.filename;
                //$scope.imageData = "data:image/jpeg;base64," + thisResult.filename;
            }
            // convert json_metadata JSON string to JSON Object 
            //var metadata = JSON.parse(thisResult.json_metadata);
            //image.src = "data:image/jpeg;base64," + thisResult.filename;
            
			//image.src = "data:image/jpeg;base64," + imageData;
			if(module=="travel"){
				//$scope.imgCollectionTravel[iPlaceIndex] = "FULL"
				//imgCollTD[iPlaceIndex] = imageData
			}
			if(module=="LB"){
				//$scope.imgCollectionLB[iPlaceIndex] = "FULL"
			}
			if(module=="LConv"){
				//$scope.imgCollectionLConv[iPlaceIndex] = "FULL"
			}
		}

		function onFail(message) {
			//alert('Failed because: ' + message);
		}
	
   
}	

	$scope.removeFile = function(module,elemId,arrIdx,rowno){
		
		var confirmPopup = $ionicPopup.confirm({
						title: 'Are you sure ?',
					template: 'Do you want to remove file?', //Message
					});
					confirmPopup.then(function (res) {
						if (res) {
							
							if (module=="travel"){
								document.getElementById(elemId).value=""
								document.getElementById(elemId).style.display="none"
								document.getElementById("delIconTravel_"+arrIdx+""+rowno).style.display="none"
								$scope.travelFileNames[rowno][arrIdx] = ""
								$scope.travelFileTypes[rowno][arrIdx] = ""
								$scope.travelFileContents[rowno][arrIdx] = ""
							}
							if (module=="LB"){
								document.getElementById(elemId).value=""
								document.getElementById(elemId).style.display="none"
								document.getElementById("delIconLB_"+arrIdx+""+rowno).style.display="none"
								$scope.LBFileNames[rowno][arrIdx] = ""
								$scope.LBFileTypes[rowno][arrIdx] = ""
								$scope.LBFileContents[rowno][arrIdx] = ""
						
							}
							if (module=="LC"){
								document.getElementById(elemId).value=""
								document.getElementById(elemId).style.display="none"
								document.getElementById("delIconLC_"+arrIdx+""+rowno).style.display="none"
								$scope.LCFileNames[rowno][arrIdx] = ""
								$scope.LCFileTypes[rowno][arrIdx] = ""
								$scope.LCFileContents[rowno][arrIdx] = ""
								
						} else {
						return;
					}
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
							
							if (module=="travel"){
								//$scope.imgCollectionTravel[idx-1] = "EMPTY"
								//imgCollTD[idx-1] = null
							}
							if (module=="LB"){
								//$scope.imgCollectionLB[idx-1] = "EMPTY"
							}
							if (module=="LC"){
								//$scope.imgCollectionLConv[idx-1] = "EMPTY"
							}
						} else {
						return;
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

	
	$scope.selectFromDeviceTravelClicked = function(event){
		var lastUnderScorePlace =	$scope.selectedValues.elem.id.lastIndexOf('_')
		rowNo= $scope.selectedValues.elem.id.substring(lastUnderScorePlace+1,$scope.selectedValues.elem.id.length)
		document.getElementById('inputFileTravelUpload_1_'+rowNo).click()
	}	
	$scope.selectFromDeviceLBClicked = function(event){
		var lastUnderScorePlace =	$scope.selectedValues.elem.id.lastIndexOf('_')
		rowNo= $scope.selectedValues.elem.id.substring(lastUnderScorePlace+1,$scope.selectedValues.elem.id.length)
		document.getElementById('inputFileLBUpload_1_'+rowNo).click()
	}	
	$scope.selectFromDeviceLCClicked = function(event){
		var lastUnderScorePlace =	$scope.selectedValues.elem.id.lastIndexOf('_')
		rowNo= $scope.selectedValues.elem.id.substring(lastUnderScorePlace+1,$scope.selectedValues.elem.id.length)
		document.getElementById('inputFileLCUpload_1_'+rowNo).click()
	}	
	

	$scope.init();
	
	
	
	
});