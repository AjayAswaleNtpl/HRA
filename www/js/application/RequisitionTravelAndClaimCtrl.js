 
mainModule.factory("getTravelApplicationListService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/travelApplication/getTravelApplicationList.spr'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("travelClaimDataService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/travelClaim/travelClaimData.spr'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);	
	

mainModule.controller('RequisitionTravelAndClaimCtrl', function ($scope,$rootScope, commonService,$filter,  $state, $ionicPopup,  $ionicLoading, $ionicModal,
						getTravelApplicationListService ,travelClaimDataService) {

					
        //$rootScope.navHistoryPrevPage=$rootScope.navHistoryCurrPage
        //$rootScope.navHistoryCurrPage="ReqTrCl"						        
		$scope.IsTravelAccessible =sessionStorage.getItem('IsTravelAccessible')
		$scope.IsClaimAccessible =sessionStorage.getItem('IsClaimAccessible')
		$scope.IsClaimAccessible='true'
		$scope.IsTravelAccessible='true'

    $scope.getTravelRequestList = function () {
		$scope.requesObject = {}
        $scope.searchObj = '';
        $("#travelApplicationIDReq").show();
		$("#tabTravelReq").addClass("active");
		$("#claimApplicationIDReq").hide();
		$("#tabClaimReq").removeClass("active");

		var travelMenuInfo = getMenuInformation("Travel Management", "Travel Application");
		/*if (travelMenuInfo==false){
			$rootScope.IsTravelAccessible ='false'
			$rootScope.IsClaimAccessible ='false'
			return;
		}
		*/
        $scope.requesObject.menuId = travelMenuInfo.menuId;
		$scope.requesObject.menuId='2607'
        $scope.requesObject.buttonRights = "Y-Y-Y-Y"
        $scope.requesObject.formName = "Travel"		
        $scope.requesObject.SelfRequestListFlag = 1;
        $ionicLoading.show({});

		
        $scope.getTravelApplicationListService = new getTravelApplicationListService();
        $scope.getTravelApplicationListService.$save($scope.requesObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"getTravelApplicationListService")
			}	
			
            $ionicLoading.hide();
            $scope.travelApplList = []
            if (data.selfTravelList == undefined)
            {
                $ionicLoading.hide();
            }else if (data.selfTravelList.length == 0 ){
				$ionicLoading.hide();
			}else{
				$scope.travelApplList = data.selfTravelList
				$scope.createDate = data.selfTravelList[0].reqDate;
			}

            for (var i = 0; i < $scope.travelApplList.length; i++) {
				if ( $scope.travelApplList[i].travelDate.length ==10){
					$scope.travelFromFormatedDate = $scope.travelApplList[i].travelDate.split('/')
					$scope.travelApplList[i].travelDate = new Date($scope.travelFromFormatedDate[2] + '/' + $scope.travelFromFormatedDate[1] + '/' + $scope.travelFromFormatedDate[0])
				}
				
            }
			
            for (var i = 0; i < $scope.travelApplList.length; i++)
            {
                $scope.travelApplList[i].designation = sessionStorage.getItem('designation')
                $scope.travelApplList[i].department = sessionStorage.getItem('department');
                $scope.travelApplList[i].empName = sessionStorage.getItem('empName');
                $scope.travelApplList[i].name = sessionStorage.getItem('empName');
                if (sessionStorage.getItem('photoFileName'))
                {
                    $scope.travelApplList[i].photoFileName = sessionStorage.getItem('photoFileName')
                    $scope.travelApplList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
                }
                else
                {
                    $scope.travelApplList[i].photoFileName = ''
                    $scope.travelApplList[i].profilePhoto = ''
                }
            }
			
            $ionicLoading.hide()
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);

        });
		
    }
	

	
	$scope.getClaimRequestList = function () {
		
        $scope.searchObj = '';
        $("#travelApplicationIDReq").hide();
		$("#tabTravelReq").removeClass("active");
		$("#claimApplicationIDReq").show();
		$("#tabClaimReq").addClass("active");
		
		var travelMenuInfo = getMenuInformation("Travel Management", "Travel Application");
		/*if (travelMenuInfo==false){
			$rootScope.IsTravelAccessible ='false'
			$rootScope.IsClaimAccessible ='false'
			return;
		}
		*/
		$scope.requesObject = {}
        $scope.requesObject.menuId = travelMenuInfo.menuId;
		$scope.requesObject.menuId='2609'
        $scope.requesObject.buttonRights = "Y-Y-Y-Y"
        //$scope.requesObject.formName = "Travel"		
        //$scope.requesObject.SelfRequestListFlag = 1;
        $ionicLoading.show({});

		
        $scope.travelClaimDataService = new travelClaimDataService();
        $scope.travelClaimDataService.$save($scope.requesObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewTravelClaimService")
			}	
			
            $ionicLoading.hide();
            $scope.claimApplList = []
			$scope.claimApplList = data.travelClaimForm.travelClaimVO
			
            for (var i = 0; i < $scope.claimApplList.length; i++) {
                $scope.apprDate = $scope.claimApplList[i].apprDate.split('/')
                $scope.claimApplList[i].apprDate = new Date($scope.apprDate[2] + '/' + $scope.apprDate[1] + '/' + $scope.apprDate[0])
            }
			
            /*for (var i = 0; i < $scope.travelApplList.length; i++)
            {
                $scope.travelApplList[i].designation = sessionStorage.getItem('designation')
                $scope.travelApplList[i].department = sessionStorage.getItem('department');
                $scope.travelApplList[i].empName = sessionStorage.getItem('empName');
                $scope.travelApplList[i].name = sessionStorage.getItem('empName');
                if (sessionStorage.getItem('photoFileName'))
                {
                    $scope.travelApplList[i].photoFileName = sessionStorage.getItem('photoFileName')
                    $scope.travelApplList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
                }
                else
                {
                    $scope.travelApplList[i].photoFileName = ''
                    $scope.travelApplList[i].profilePhoto = ''
                }
            }*/
			
            $ionicLoading.hide()
        }, function (data, status) {
			
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);

        });

	}		
	

     
	
	Init = function (){
		if ($rootScope.redirectTravelClaimTabName=="" || $rootScope.redirectTravelClaimTabName=== undefined ){
			//$scope.getTravelRequestList()
			$scope.getClaimRequestList()
		}
	}
	

	$scope.reDirectToFreshTravelPage = function(){
		
		$state.go('travelApplication');
		
	}		
	$scope.reDirectToFreshClaimPage = function(claim){
		
		if (claim.travelClaimStatus==null)
		{
			
			// claim not applied yet
			//show travel details
			$rootScope.travelTransIdForClaimApply = claim.travelTransId;
			$rootScope.gv_travelShowDetailsFrom = "CLAIM_LIST";
			$state.go('claimTravelDetails');
		}else{
			//claim applied, show claim details
			//alert("claim details will be shown")
			$rootScope.travelTransIdForClaimApply = claim.travelTransId;
				$rootScope.claimIdForClaimDetials = claim.travelClaimId;
			$rootScope.gv_travelShowDetailsFrom = "CLAIM_LIST";
			$state.go('claimApplicationDetails');

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
	


	$scope.showTravelDetailForm = function( travelObj){
		//alert(travelObj.travelTransId);
		$rootScope.travelTransIdForClaimApply = travelObj.travelTransId;
		$rootScope.gv_travelShowDetailsFrom = "REQ_TRAVEL_LIST";
		$rootScope.gv_travelShowDetailsStaus = travelObj.travelStatus;
		$state.go('claimTravelDetails');
		
	}
	
	Init();
});
