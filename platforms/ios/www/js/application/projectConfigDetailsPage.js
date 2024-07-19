/*
 1.This controller is used for applying leaves.
 */

mainModule.factory("getBalanceLeaveCountService", function ($resource) {
    return $resource((baseURL + '/api/leaveApplication/getLeaveBal.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("getValidateLeaveService", function ($resource) {
    return $resource((baseURL + '/api/leaveApplication/validateForLeaveApplication.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("getLeaveMasterService", function ($resource) {
    return $resource((baseURL + '/api/leaveApplication/getLeaveMaster.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("getSelfLeaveService", function ($resource) {
    return $resource((baseURL + '/api/leaveApplication/addSelfLeaveApplication.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.factory("getFindWorkFlowService", function ($resource) {
    return $resource((baseURL + '/api/leaveApplication/findWorkFlowApprover.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});
mainModule.controller('projectConfigDetailsPage', function ($scope,$rootScope, commonService, $ionicHistory, $rootScope, $ionicPopup, getFindWorkFlowService, getSetService, getSelfLeaveService, getValidateLeaveService, $state, $http, $q, $filter, $ionicLoading, getBalanceLeaveCountService, getLeaveMasterService,
$ionicNavBarDelegate) {
	$rootScope.navHistoryPrevPage=$rootScope.navHistoryCurrPage
	

    //$ionicLoading.show();
    $scope.companyName = "test company"
    $scope.projectName ="second project"
    $scope.status ="APPROVED"
    $scope.projectCode ="00525"
    
    $scope.selectedFileName = ''
    $scope.resultObj = {}
    $scope.dataBuffer = {}
    $scope.dataBuffer.leaveReason = ''
    $scope.dataBuffer.phone = ''
    $scope.resultObj.fromLeaveType = 'fullDay'
    $scope.resultObj.toLeaveType = 'fullDay'
    $scope.resultObj.leaveTypeId = ''
    $scope.dataBuffer.afterBalance = ''
    $scope.dataBuffer.noDaysCounted = ''
	
	$scope.companyId = sessionStorage.getItem('companyId')
	
	$scope.init = function(){		
        var fd = new FormData()

        
		
        fd.append("companyId",$scope.companyIdFromProjConfig)
        //fd.append("date",$scope.date)
        fd.append("pageType",$rootScope.pageTypeFromProjConfig)
        fd.append("menuId","3303")
        fd.append("selfGrid",$rootScope.selfGridFromProjConfig)
        fd.append("tranid",$rootScope.tranidFromProjConfig)
        //fd.append("onBehalfFlag","N")
        
		
        $.ajax({
            url: (baseURL + '/timeSheet/projectMaster/add.spr'),
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
				
                $scope.selfList = success.selfList;

                document.getElementById("projectName").value = $scope.selfList.projectName;
                document.getElementById("projectCode").value = $scope.selfList.projectCode;
                document.getElementById("budgetHours").value = $scope.selfList.getBudgetHours;
                document.getElementById("approvHours").value = $scope.selfList.approvHours;
                document.getElementById("startDate").value = $scope.selfList.startDate;
                document.getElementById("endDate").value = $scope.selfList.endDate;
                document.getElementById("projectValue").value = $scope.selfList.projectValue;
                document.getElementById("clientName").value = $scope.selfList.clientName
                document.getElementById("clientLocation").value = $scope.selfList.clientLocation
                document.getElementById("clientAddress").value = $scope.selfList.clientAddress;
                document.getElementById("clientPhoneNo").value = $scope.selfList.clientPhoneNo
                var visibility = $scope.selfList.visibility;
                if(visibility=="y"){
                    document.getElementById("visibilityPublic").checked = true
                }else{
                    document.getElementById("visibilityPrivate").checked = true
                }
                
				//alert("succ add")
				    $ionicLoading.hide()
			},
			error: function (e) { //alert("Server error - " + e);
            alert(e.status)
                    $ionicLoading.hide()
                   $scope.data_return = {status: e};
                commonService.getErrorMessage($scope.data_return);
                
                   }				
            });			

			}
	
  $scope.redirectOnBack = function () {
		//$ionicNavBarDelegate.back();
        //$scope.resultObj.check = "Leave";
        //getSetService.set($scope.resultObj);
        $state.go('app.requestMenu')
    }

	// This function  allow only number and  only one dot(.)  compatible with all browser
	function isNumberKey(evt, element) {

        var charCode = (evt.which) ? evt.which : event.keyCode

        if((charCode != 46 || $(element).val().indexOf('.') != -1) &&      // . CHECK DOT, AND ONLY ONE.
            (charCode < 48 || charCode > 57)&&charCode>8)
        	
        	 return false;
       
        return true;
        
    } 
	
	$scope.doChangeLoc = function () {
        alert("aa")
        return
		var listLocationIds = getSelectedIds(document.getElementById('locationId'));
		//alert("location "+listLocationIds);
		$("#teamList").empty();
		if (($("#companyId").val() != "-1")) {
			$
					.ajax({
						url : "../TimeSheetEmployeeDaily/getEmployeeListByLocationId.spr?locationId="+listLocationIds,
						data : {
							'companyId' : $("#companyId").val(),
							'menuId' : $("#menuId").val()
						},
						type : 'POST',
						dataType : 'json',
						// contentType: 'application/json'
						success : function(result) {
							if (result != '') {
								if(result != ''){
									// $("#team").append('<option value="-1">---Select Employee---</option>').val('-1');
				            		 $.each(result, function(index) {
			                            var empId = result[index].empId
			                            var empName = result[index].empName;
					            		$("#teamList").append($('<option></option>').val(empId).html(empName));
					            	 });
				            		 $("#teamList").html($("#teamList option").sort(function (a, b) {
				            			 return a.text.toLowerCase() > b.text.toLowerCase() ?  1 : -1
				            			}))
				            			$("select#teamList").val('-1');
				            		
									
				            	}	
							}
							 $("#teamList").trigger('chosen:updated');
						}
					});
		}
    }
    
	$scope.getSelectedIds =  function (select){
			
		 	var result = [];
				  var options = select && select.options;
				  var opt;
				
				  for (var i=0, iLen=options.length; i<iLen; i++) {
				    opt = options[i];

				    if (opt.selected) {
				      result.push(opt.value || opt.text);
				    }
				  }
			return result;
		 }
	
		 $scope.SelectAllList = function (CONTROL,functionCall){
			   $('#locationId_chosen .chosen-choices').addClass('selectOffice');
				  $("#"+CONTROL+" option").each(function()
						  {
					  $(this).prop('selected', true)
					 
						  });
				  $("#"+CONTROL).trigger('chosen:updated');
				   	functionCall();
				   }

		  $scope.DeselectAllList = function (CONTROL,functionCall){
					   $("#"+CONTROL+" option").each(function()
								  {
							  $(this).prop('selected', false)
								  });
					   $("#"+CONTROL).trigger('chosen:updated');
				   	functionCall();
				   }

$scope.init();	

});
