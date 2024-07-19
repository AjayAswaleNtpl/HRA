/*
 1.This controller is used for applying leaves.
 */

mainModule.controller('projectConfigListApprovalsCtrl', function ($scope,$rootScope, commonService, $timeout,$ionicHistory, $rootScope, $ionicPopup, getFindWorkFlowService, getSetService, getSelfLeaveService, getValidateLeaveService, $state, $http, $q, $filter, $ionicLoading, getBalanceLeaveCountService, getLeaveMasterService,
    $ionicNavBarDelegate) {
        $rootScope.navHistoryPrevPage="approvalsNew"
        
        
        $scope.pageValuesObject = {}
        $scope.pageValuesObject.menuId="3303"
        $scope.pageValuesObject.buttonRights="Y-Y-Y-Y"
        
        
        function init(){
        $ionicLoading.show()
        $timeout(function () {
            var fd = new FormData()
            fd.append('menuId',$scope.pageValuesObject.menuId)
            fd.append('buttonRights',$scope.pageValuesObject.buttonRights)
            fd.append('selfListOrReporteeList',"REPORTEE")
            
            $.ajax({
                    url: (baseURL + '/timeSheet/projectMaster/viewProjectMaster.spr'),
                    data: fd,
                    type: 'POST',
                    async:false,
                    timeout:40000,
                    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                    processData: false, // NEEDED, DON'T OMIT THIS
                    headers: {
                        'Authorization': 'Bearer ' + jwtByHRAPI
                     },
                    success : function(success) {
    
                        if (success.repoteeList){
                            $scope.repoteeList = success.repoteeList;
                        }
                        for(var i=0;i<$scope.repoteeList.length;i++){
							if ($scope.repoteeList[i].approverRemarks){
								$scope.repoteeList[i].approverRemarks =  $scope.repoteeList[i].approverRemarks.replaceAll("!#!","\n");
							}
						}			
                        $ionicLoading.hide()
    
                        //$state.go('app.requestMenu')
                    },
                    error: function (e) { //alert("Server error - " + e);
                        //showAlert(e.status)
                        $ionicLoading.hide()
                           $scope.data_return = {status: e};
                        commonService.getErrorMessage($scope.data_return);
                        $ionicLoading.hide()
                           }				
                    });			
 
        },200)
    
                
        }
        
        
      $scope.redirectOnBack = function () {
            //$ionicNavBarDelegate.back();
            //$scope.resultObj.check = "Leave";
            //getSetService.set($scope.resultObj);
             $state.go('app.approvalsMenu')
        }
        $scope.goToRequisitions = function(){
            $state.go("projectConfigList")
        }
    
    $scope.redirectToProjConfigDetails = function (projMaster) {
        $rootScope.tranidFromProjConfig = projMaster.projectConfigurationId;
	    $rootScope.selfGridFromProjConfig = "N"
	    $rootScope.pageTypeFromProjConfig = "approvePage"
	    $rootScope.companyIdFromProjConfig = sessionStorage.getItem("companyId");
        $state.go('projectConfigApplication')
      }	


      $scope.openFile = function(projmaster){
		
		
		//event.stopPropagation();
		$scope.reqObj = {}
		$scope.reqObj.projectConfigId = projmaster.projectMasterList[0].uploadFileId
		//alert(fileId)
		var fd = new FormData();
		fd.append("projectConfigId",$scope.reqObj.projectConfigId)
		
		
		$.ajax({
				url: baseURL + '/timeSheet/projectMaster/openFile.spr',
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
								handleClientResponse(result.clientResponseMsg,"openFileMobile")
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
	$scope.downloadAttachmnent = function (travel) {

		var strData = travel.uploadFile
		//var strUrlPrefix='data:"application/pdf;base64,'
		var strUrlPrefix = 'data:' + travel.uploadContentType + ";base64,"
		var url = strUrlPrefix + strData
		var blob = base64toBlob(strData, travel.uploadContentType)
		downloadFileFromData(travel.uploadFileName, blob, travel.uploadContentType)
		
	  }
      
      
        init()
    });
    
    
    