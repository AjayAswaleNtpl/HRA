/*
 1.This controller is used to Approve / Reject for Leave,Shift,Attendance,OD.
 2.Sent for cancellation requests are also Approved / Reject for Leave,Shift,Attendance,OD.
 3.Detailed view can be seen while opening modal by clicking on the list.
 */

mainModule.factory("getTravelApplicationReporteeListService", function ($resource) {
    return $resource((baseURL + '/api/travelApplication/getTravelApplicationReporteeList.spr'), {}, 
    {'save': {method: 'POST', timeout: commonRequestTimeout,
    headers: {
        'Authorization': 'Bearer ' + jwtByHRAPI
        }
}}, {});
});
mainModule.factory("singleApproveTravelAppService", function ($resource) {
    return $resource((baseURL + '/api/travelApplication/singleApproveTravelApp.spr'), {}, 
    {'save': {method: 'POST', timeout: commonRequestTimeout,
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
mainModule.factory("getPhotoService", function ($resource) {
    return $resource((baseURL + '/api/eisCompany/checkProfilePhoto.spr'), {}, 
    {'save': {method: 'POST', timeout: commonRequestTimeout,
    headers: {
        'Authorization': 'Bearer ' + jwtByHRAPI
        }}}, {});
});

mainModule.factory("viewTravelClaim", function ($resource) {
    return $resource((baseURL + '/api/travelClaim/viewTravelClaim.spr'), {}, 
    {'save': {method: 'POST', timeout: commonRequestTimeout,
    headers: {
        'Authorization': 'Bearer ' + jwtByHRAPI
        }}}, {});
});


mainModule.controller('approvalsTCCtrl', function ($scope, getPhotoService, $filter, getSetService, $rootScope, commonService, $ionicPopup, $http, getTravelApplicationReporteeListService ,$ionicLoading, $ionicModal, homeService,getRequisitionCountService,singleApproveTravelAppService,singleRejectTravelAppService,viewTravelClaim,$state) {
	
    $rootScope.navHistoryPrevPage = "approvalsNew"
	$scope.IsTravelAccessible =sessionStorage.getItem('IsTravelAccessible')
	$scope.IsClaimAccessible =sessionStorage.getItem('IsClaimAccessible')

		$scope.IsTravelAccessible = 'true'
		$scope.IsClaimAccessible = 'true'
	
	//$scope.travelCount = 52
	
    $scope.requestObjectTravel = {}
    $scope.searchObj = {}
    $scope.leaveType = {}
    $scope.searchObj.searchTravel = '';
    
    var d = new Date();
    
    

    $scope.getTravelList = function ()
    {
		homeService.updateInboxEmailList("", function () {}, function (data) {})
		
        $scope.searchObj = ''
        $("#ClaimPendingApplicationID").hide();
        $("#TravelPendingApplicationID").show();
        $("#tabClaim").removeClass("active");
        $("#tabTravel").addClass("active");

        $ionicLoading.show({});
        $scope.requesObject = {}
        //var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
        //$scope.requesObject.menuId = leaveMenuInfo.menuId;
		$scope.requesObject.menuId = 2607
        $scope.requesObject.buttonRights = "Y-Y-Y-Y"
        //$scope.requesObject.formName = "Leave";
        //$scope.requesObject.SelfRequestListFlag = 0;
		$scope.requesObject.status=""
        $scope.getTravelApplicationReporteeListService = new getTravelApplicationReporteeListService();
        $scope.getTravelApplicationReporteeListService.$save($scope.requesObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewLeaveApplicationService")
				$ionicLoading.hide()
				showAlert("Something went wrong. Please try later.")
				return
			}	
			$scope.travelAppList = []
			if (data.reporteeList.length==0){
				$ionicLoading.hide()
				return;
			}
				$scope.travelAppList = data.reporteeList
				
			
            /*if (data.aaData.length != 0) {
                $scope.createDate = data.aaData[0].createDate;
            }
			
			
			if (data.aaData === undefined){
				//do nothing
			}else{
				$scope.travelAppList = data.aaData;
			}
            */
            for (var i = 0; i < $scope.travelAppList.length; i++) {
                $scope.travelFromFormatedDate = $scope.travelAppList[i].reqDate.split('/')
                $scope.travelAppList[i].reqDate = new Date($scope.travelFromFormatedDate[2] + '/' + $scope.travelFromFormatedDate[1] + '/' + $scope.travelFromFormatedDate[0])
            }

            var index = 0
            while (index != $scope.travelAppList.length) {
                $scope.getTravelPhotos(index)
                index++
            }
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

    $scope.getTravelPhotos = function (index) {

		if ($scope.travelAppList[index] === undefined)
		{
			return
		}
		
		$scope.travelAppList[index].photoFileName=baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + $scope.travelAppList[index].empId 
		return		
		
		
    }


    $scope.getClaimList = function () {
		
		homeService.updateInboxEmailList("", function () {}, function (data) {})
		$scope.requesObject1 = {}
		
    

		
		$scope.searchObj = ''
        $("#tabTravel").removeClass("active");
        $("#tabClaim").addClass("active");
		$("#TravelPendingApplicationID").hide();
        $("#ClaimPendingApplicationID").show();
        
        $ionicLoading.show();
		var clMenuInfo = getMenuInformation("Travel Management", "Travel Claim Requisition");
        $scope.requesObject1.menuId = clMenuInfo.menuId
		$scope.requesObject1.buttonRights = "Y-Y-Y-Y"
		
		$scope.requesObject1.menuId='2609'
        $scope.viewTravelClaim = new viewTravelClaim();
        $scope.viewTravelClaim.$save($scope.requesObject1, function (data) {
			
            
			$ionicLoading.hide()
			$scope.reporteeList = data.reporteeList
			 var index = 0
            while (index != $scope.reporteeList.length) {
                $scope.getClaimPhotos(index)
                index++
            }
            
        }
        , function (data) {
			alert(data.status)
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

    $scope.getClaimPhotos = function (index) {
		
		if ($scope.reporteeList[index] === undefined)
		{
			return
		}
		
		$scope.reporteeList[index].photoFileName=baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + $scope.reporteeList[index].empId
		return
		
	
    }

	
	$scope.showClaimlDetailForm = function(claim){
		$rootScope.travelTransIdForClaimApply = claim.travelTransId
		$rootScope.claimIdForClaimDetials = claim.travelClaimId
		$rootScope.statusForClaimDetials = claim.travelClaimStatus
		
		$state.go('claimApplicationDetailsApprove');
	}
	

	
    $scope.approveTravel = function (status, travelTransId, remarks) {
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
		$scope.detailResObject.remarks=remarks
		
        $scope.singleApproveTravelAppService = new singleApproveTravelAppService();
        $scope.singleApproveTravelAppService.$save($scope.detailResObject, function (data) {
				$ionicLoading.hide()
				showAlert(data.msg)
				$scope.getTravelList()
				
				return
            
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

    $scope.rejectTravel = function (status, travelTransId, remarks) {
		
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
		$scope.detailResObject.remarks=remarks
		
        $scope.singleRejectTravelAppService = new singleRejectTravelAppService();
        $scope.singleRejectTravelAppService.$save($scope.detailResObject, function (data) {
				$ionicLoading.hide()
				//showAlert(alert_header,data.msg)
				showAlert(data.msg)
				$scope.getTravelList()
				
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
                template: '<label>Approver Remarks<form name="myApproveForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" name="mybox" rows="3" ng-model="travelPopUpData.travelApproveRemarks" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myApproveForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
                title: 'Do you want to approve?',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'}, {
                        text: '<b>Approve</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            return $scope.travelPopUpData.travelApproveRemarks || true;
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                if (res) {
                    $scope.approveTravel(status, travelTransId, $scope.travelPopUpData.travelApproveRemarks)
                    return
                } else {
                    return;
                }
            });
        } else if (type == 2)
        {
            var myPopup = $ionicPopup.show({
                template: '<label>Approver Remarks<form name="myRejectForm"><textarea style="background-color:white;border: 1px solid #b3b3b3;" name="mybox" rows="3" ng-model="travelPopUpData.traveRejectRemarks" ng-maxlength="3000" cols="100"></textarea><span class="error" style="color:red" ng-show="myForm.mybox.$error.maxlength">No more text can be added.</span></form></label>',
                title: 'Do you want to reject?',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'}, {
                        text: '<b>Reject</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            return $scope.travelPopUpData.traveRejectRemarks || true;
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                if (res) {
                    $scope.rejectTravel(status, travelTransId, $scope.travelPopUpData.traveRejectRemarks)
                    return
                } else {
                    return;
                }
            });
        }
    }
	


    function Initialize() {
			if ($rootScope.redirectApprovalTabName=="" || $rootScope.redirectApprovalTabName=== undefined ){
				if ($scope.IsTravelAccessible == 'true')
				{
					//$scope.getTravelList();
					$scope.getClaimList()
					return;
				}
				

			}
			
			

			$rootScope.redirectApprovalTabName=""
		
       
    }
	
	


	$scope.showTravelDetailForm = function( travelObj){
		//alert(travelObj.travelTransId);
		$rootScope.travelTransIdForClaimApply = travelObj.travelTransId;
		$rootScope.gv_travelShowDetailsFrom = "APPROVAL_TRAVEL_LIST";
		$rootScope.gv_travelShowDetailsStaus = travelObj.travelStatus;
		$state.go('claimTravelDetails');
		
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
    
	/*$scope.clearSearch = function()
	{
		alert("")
			$scope.searchObj.searchLeave="";
	}*/
    Initialize();
});
