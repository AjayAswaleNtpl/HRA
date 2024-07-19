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
mainModule.controller('projectConfigApplicationCtrl', function ($timeout,$scope,$rootScope, commonService, $ionicHistory, $rootScope, $ionicPopup, getFindWorkFlowService, getSetService, getSelfLeaveService, getValidateLeaveService, $state, $http, $q, $filter, $ionicLoading, getBalanceLeaveCountService, getLeaveMasterService,
$ionicNavBarDelegate) {
	
	
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
	$scope.listOfLocations={}
	$scope.selectedLocations=[];
	$scope.sDate;
	$scope.eDate;
	$scope.pageType=$rootScope.pageTypeFromProjConfig
	if($scope.pageType == "editPage"|| $scope.pageType=="addPage"){
		$rootScope.navHistoryPrevPage='projectConfigList'
	}else{
		$rootScope.navHistoryPrevPage='projectConfigListApprovals'
	}
	
	$scope.companyId = sessionStorage.getItem('companyId')
	//alert($scope.pageType)
	
	
	$scope.init = function(){
		$ionicLoading.show();
		var fd = new FormData();
		if($scope.pageType=="editPage"){
			fd.append("companyId",$rootScope.companyIdFromProjConfig)
			fd.append("tranId",$rootScope.tranidFromProjConfig)
			fd.append("pageType",$scope.pageType)
			fd.append("selfGrid",$rootScope.selfGridFromProjConfig)
			fd.append("menuId","3303")
		}
		else if($scope.pageType=="approvePage"){
			fd.append("companyId",$rootScope.companyIdFromProjConfig)
			fd.append("tranId",$rootScope.tranidFromProjConfig)
			
			fd.append("selfGrid",$rootScope.selfGridFromProjConfig)
			fd.append("menuId","3303")
		}
		else{
		$("#hrsId").empty();
		var hr= document.getElementById("hrsId")
		let newOp = new Option("Select",-1);
		hr.add(newOp,undefined)
		document.getElementById("hrsId").selectedIndex = -1;
		$("#projectTypeMasterId").empty();	
		var pid = document.getElementById("projectTypeMasterId")
		let pd = new Option("Select",-1)
		pid.add(pd,undefined)
		document.getElementById("projectTypeMasterId").selectedIndex = -1;

        
		
        fd.append("companyId",$scope.companyId)
        fd.append("date",$scope.date)
        fd.append("editFlag",$rootScope.editFlagTransf)
        fd.append("menuId","3303")
        //fd.append("onBehalfFlag","N")
		}
		
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

				
				
				
				$scope.listOfLocations = success.locationList
				$scope.hoursDistributionType = success.Orglevel;
				$scope.projectConfig = success.projectConfig;
				if (!success.projectConfig)
				{
					$ionicLoading.hide()
					showAlert("Some error occurred while fetching data. Please try again.")
					$scope.redirectOnBack()
					return;
				}
				$scope.projectTypeMasterList = success.projectConfig.projectTypeMasterList;
				document.getElementById("companyName").innerHTML = success.compName
				var hourType = document.getElementById("hrsId")
				var projectType = document.getElementById("projectTypeMasterId")
				for(let key of Object.keys($scope.hoursDistributionType)){
					var optText = $scope.hoursDistributionType[key];
					var optValue = key;
					let newOption = new Option(optText,optValue);
					hourType.add(newOption,undefined)
				}
				for(var i=0;i<$scope.projectTypeMasterList.length;i++){
					var optionText = $scope.projectTypeMasterList[i].projectTypeName;
					var optionValue = $scope.projectTypeMasterList[i].projectTypeId;
					let newOption = new Option(optionText,optionValue)
					projectType.add(newOption,undefined)

				}
				if($scope.pageType=="addPage"){
					document.getElementById("approverRemarks").readOnly = true
				}
				if (!$scope.$$phase)
					$scope.$apply()
				
				$ionicLoading.hide()
				if($scope.pageType=="editPage" || $scope.pageType=="approvePage"){
					
					$timeout(function(){
					$scope.projectMaster = success.projectConfig;
					$scope.projectTypeInSucc = success.projectConfig.projectTypeMaster;
					$scope.hourTypeInSucc = success.hoursType;
					$scope.team = success.teamList
					$scope.locMap = success.projectConfig.locMap;
					$scope.statusFromEdit = $scope.projectMaster.status

					$scope.projectMaster.approverRemarks = $scope.projectMaster.approverRemarks.replaceAll("!#!","\n")
					
					if(($scope.pageType=="editPage" && ($scope.projectMaster.status=="SENT FOR APPROVAL" || $scope.projectMaster.status=="SENT FOR CANCELLATION")) || ($scope.pageType=="approvePage" && ($scope.projectMaster.status=="APPROVED" || $scope.projectMaster.status=="REJECTED"))){
						document.getElementById("projectName").readOnly = true;
						document.getElementById("projectCode").readOnly=true;
						
						
						document.getElementById("budgetHours").readOnly = true;
						document.getElementById("approvHours").readOnly = true
						
						document.getElementById("projectValue").readOnly = true
						document.getElementById("clientName").readOnly = true
						document.getElementById("clientLocation").readOnly = true
						document.getElementById("clientAddress").readOnly = true
						document.getElementById("clientPhoneNo").readOnly = true
						document.getElementById("clientPanNo").readOnly = true
						document.getElementById("clientGstNo").readOnly = true
						document.getElementById("keyContactPersonId").readOnly = true
						document.getElementById("projectManager").readOnly = true
						document.getElementById("accountmanager").readOnly = true
						document.getElementById("projectManagerId").readOnly = true
						document.getElementById("accountManagerId").readOnly = true
						document.getElementById("keyContactPerson").readOnly = true
						document.getElementById("approverRemarks").readOnly = true
						document.getElementById("applicantRemarks").readOnly = true
						document.getElementById("locationId").disabled = true
						document.getElementById("hrsId").disabled = true
						document.getElementById("projectTypeMasterId").disabled = true
						document.getElementById("teamList").disabled = true

					}
					
					if(success.projectConfig.projectMasterList){
						$scope.filePresent = 'true'
						$scope.filename = success.projectConfig.projectMasterList[0].fileName
						document.getElementById("fileName").innerHTML = $scope.filename
						
					}
					if($scope.projectMaster.visivility=="y"){
						document.getElementById("visibilityPublic").checked=true
					}else{
						document.getElementById("visibilityPrivate").checked=true
					}
					document.getElementById("header").innerHTML = $scope.projectMaster.projectName +"("+$scope.projectMaster.projectCode+")" + "-" + $scope.projectMaster.status
					
					var startDate	 = new Date(success.projectConfig.startDate)		
					document.getElementById("startDate").value = $filter('date')(startDate, 'dd/MM/yyyy');
					if($scope.projectMaster.keyContactPersonID){
						document.getElementById("keyContactPerson").value = $scope.projectMaster.keyContactPersonID
					}
					
					var endDate	 = new Date(success.projectConfig.startDate)		
					document.getElementById("endDate").value = $filter('date')(endDate, 'dd/MM/yyyy');
					document.getElementById("projectManager").value = $scope.projectMaster.projectManagerName
					document.getElementById("accountmanager").value = $scope.projectMaster.accountmanagerName
					document.getElementById("budgetHours").value = $scope.projectMaster.budgetHours;
					document.getElementById("approvHours").value = $scope.projectMaster.approvHours;
					var hrType = document.getElementById("hrsId")
					var projType = document.getElementById("projectTypeMasterId")
					var loc = document.getElementById("locationId")
					for(i=0;i<hrType.options.length;i++){
						if(parseInt(hrType.options[i].value) == $scope.hourTypeInSucc){
							document.getElementById("hrsId").options[i].selected = true;
						}
					}
					for(i=0;i<projType.options.length;i++){
						
						if(parseInt(projType.options[i].value) == $scope.projectTypeInSucc.projectTypeId){
							document.getElementById("projectTypeMasterId").options[i].selected = true
						}
					}
					for(let key of Object.keys($scope.locMap)){
						for(i=0;i<loc.options.length;i++){
							var val=loc.options[i].value
							var valSplit = val.split(":")
							var locId = parseInt(valSplit[1])
							if(locId==key){
								//alert("inside"+key)
								document.getElementById("locationId").options[i].selected = true
							}
						}
					}
				
					$scope.doChangeLoc();
					
					
				

				},500);
					

				}


			
				//alert("succ add")
					
		
			},
			error: function (e) { //alert("Server error - " + e);
            alert(e.status)
                    $ionicLoading.hide()
                   $scope.data_return = {status: e};
                commonService.getErrorMessage($scope.data_return);
                
                   }				
            });			

			}

			$scope.addRow = function(){
				if (document.getElementById("keyContactPersonId").value == "")
				{
					showAlert("Please search contact person first.")
					retrun
				}
				var tab = document.getElementById("tableContactPerson");
				var rowCount = tab.rows.length;
				var row = tab.insertRow(rowCount);
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);
				var elementDelete = document.createElement("input");
				elementDelete.type="button"
				var btnName = "delete"+(rowCount +1)
				elementDelete.name = btnName
				elementDelete.value = "Delete"
				elementDelete.onclick = function(){
					$scope.removeRow(rowCount)
				}


				cell2.innerHTML = document.getElementById("keyContactPerson").value
				cell1.innerHTML = document.getElementById("keyContactPersonId").value
				cell3.appendChild(elementDelete);

				document.getElementById("keyContactPerson").value = ""
				document.getElementById("keyContactPersonId").value = ""
				
			}
			$scope.removeRow = function(idx){
				try {  
					 	var table = document.getElementById("tableContactPerson");
							table.deleteRow(idx);  
							
						
					 
				} catch (e) {  
					showAlert(e);  
				}  
			}
	
  $scope.redirectOnBack = function () {
		//$ionicNavBarDelegate.back();
        //$scope.resultObj.check = "Leave";
		//getSetService.set($scope.resultObj);
		if($scope.pageType == "editPage"|| $scope.pageType=="addPage"){
			$state.go('projectConfigList')
		}else{
			$state.go('projectConfigListApprovals')
		}
        
    }

	// This function  allow only number and  only one dot(.)  compatible with all browser
	function isNumberKey(evt, element) {

        var charCode = (evt.which) ? evt.which : event.keyCode

        if((charCode != 46 || $(element).val().indexOf('.') != -1) &&      // . CHECK DOT, AND ONLY ONE.
            (charCode < 48 || charCode > 57)&&charCode>8)
        	
        	 return false;
       
        return true;
        
	} 
	$scope.isAlfaNumeric1 = function(s){
		var isAlfaNumReg=/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
		var validate=isAlfaNumReg.test(s);
		
		if(!validate) {
			return false;
		} else {
			return true;
		}
	}
	
	$scope.validate=function(){
		var validFlag = true;
			var errorMsg = '';
			var count = 0;
		
			
			var budgetHrs= document.getElementById("budgetHours").value;
			var projectName = document.getElementById("projectName").value;
			var projectCode = document.getElementById("projectCode").value;
			
			var projectTypeMasterId = document.getElementById("projectTypeMasterId").selectedIndex;
			var hrsId = document.getElementById("hrsId").selectedIndex;
			var approvHours = document.getElementById("approvHours").value;
			var startDate = document.getElementById("startDate").value;
			var endDate = document.getElementById("endDate").value;
			var projectManager = document.getElementById("projectManager").value;
			var accountmanager = document.getElementById("accountmanager").value;
			var team= ""+document.getElementById("teamList").selectedIndex
			var clientPanNo= document.getElementById("clientPanNo").value; 
			var clientGstNo= document.getElementById("clientGstNo").value; 
		
			var fmt = $("#DateFormat").val();
			
			 if(projectName.trim()==''){
				 errorMsg +="Project name should not be blank\n" ;
				 validFlag = false;
					count++;
			}
			if(projectCode.trim()==''){
				errorMsg +="Project code should not be blank\n" ;
				validFlag = false;
				count++;
			}
			
			
			if(projectTypeMasterId==-1 || projectTypeMasterId==0){
				errorMsg +="Project type should not be blank\n" ;
				validFlag = false;
				count++;
			}
			if(hrsId==-1 || hrsId==0){
				errorMsg +="Hours type should not be blank\n" ;
				validFlag = false;
				count++;
			}
			if(startDate==''){
				errorMsg +="Start date should not be blank\n" ;
				validFlag = false;
				count++;
			}
			if(endDate==''){
				errorMsg +="End date should not be blank\n" ;
				validFlag = false;
				count++;
			}
			if(startDate>endDate){
				errorMsg +="End date should not be less than Start date\n" ;
				validFlag = false;
				count++;
		}
				if(projectManager.trim()==''){
					errorMsg +="Project manager should not be blank\n" ;
					validFlag = false;
					count++;
			}
				if(accountmanager.trim()==''){
					errorMsg +="Account manager should not be blank\n" ;
					validFlag = false;
					count++;
			}
				if(budgetHrs==''){
					errorMsg +="Budget hours should not be blank\n" ;
					validFlag = false;
					count++;
				}
				if(approvHours==''){
					errorMsg +="Approver hours should not be blank\n" ;
					validFlag = false;
					count++;
				}
				if(parseInt(budgetHrs) < parseInt(approvHours)){
					errorMsg +="Approver hours should not be greater than budget hours\n" ;
					validFlag = false;
					count++;
				}
				/*if(parseInt(budgetHrs) < parseInt(approvHours)){
					errorMsg +="Approver hours should not be greater than budget hours\n" ;
					validFlag = false;
					count++;
				}*/
				if(clientPanNo!=''){
					if(clientPanNo.trim().length != 10){
						errorMsg +="PAN No. should be of length 10\n";
						validFlag = false;
						count++;
			   		}else if(!$scope.isAlfaNumeric1(clientPanNo)){
			   			errorMsg +="Please enter only alpha-numeric value for PAN No\n";
			   			validFlag = false;
						count++;
			   		} 
				}
				 if(clientGstNo!=''){
					if(clientGstNo.trim().length != 15){
						errorMsg +="Gst No. should be of length 15\n";
			   			validFlag = false;
						count++;
			   		}else if(!$scope.isAlfaNumeric1(clientGstNo)){
			   			errorMsg +="Please enter only alpha-numeric value for Gst No\n";
			   			validFlag = false;
						count++;
			   		} 
				} 
				
			if($scope.pageType=="addPage"){
				if(document.getElementById("tableContactPerson").rows.length==0){
					errorMsg+="Please select atleast 1 key contact person"
				}
			}
			if(team=="-1"){
				errorMsg+="Team should not be blank "
			}
			 

			 
			 return errorMsg;	 

	}
	
	$scope.doChangeLoc = function () {
		$ionicLoading.show();
		$timeout(function(){

		
		locIds = $scope.getSelectedIds();
		var teamBox = document.getElementById("teamList")
		$("#teamList").empty();
		var fd=new FormData();
		fd.append("locationId",locIds);
		fd.append("companyId",sessionStorage.getItem("companyId"));
		fd.append("menuId","3305")
		
		$.ajax({
            url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/getEmployeeListByLocationId.spr'),
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
				
				
					for(var i = 0;i<success.length;i++){
						
						var optText = success[i].empName
						var optValue = success[i].empId
						let newOption = new Option(optText,optValue);
						teamBox.add(newOption,undefined)
	
					}
					if (!$scope.$$phase)
					$scope.$apply()
					$timeout(function(){
					if($rootScope.pageTypeFromProjConfig=="editPage"|| $rootScope.pageTypeFromProjConfig=="approvePage"){
						var tlist = document.getElementById("teamList")
					for(let key of Object.keys($scope.team)){
						for(i=0;i<tlist.options.length;i++){
							if(tlist.options[i].text == $scope.team[key]){
								document.getElementById("teamList").options[i].selected = true
							}
						}
					}
					}
				},500);

					
					$ionicLoading.hide()
				
				
				



				//alert("succ add")
				    
			},
			error: function (e) { //alert("Server error - " + e);
            alert(e.status)
                    $ionicLoading.hide()
                   $scope.data_return = {status: e};
                commonService.getErrorMessage($scope.data_return);
                
                   }				
            });	
		},500);
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
    
	$scope.getSelectedIds =  function (){

			var locations = document.getElementById("locationId")
			$scope.selectedLocations = new Array();
			var count=0;
			for(var i=0;i<locations.options.length;i++){
				if(locations.options[i].selected){
					var val=locations.options[i].value
					var valSplit = val.split(":")
					var locId = parseInt(valSplit[1])
					$scope.selectedLocations[count]=locId
					count++
				}
			}
		 	return $scope.selectedLocations;
	}
	$scope.getSelectedLocationsMap =  function (){

		var locations = document.getElementById("locationId")
		$scope.selectedLocationsMap = new Map();
		
		for(var i=0;i<locations.options.length;i++){
			if(locations.options[i].selected){
				var val=locations.options[i].value
				var valSplit = val.split(":")
				var locId = parseInt(valSplit[1])
				$scope.selectedLocationsMap.set(locId,locations.options[i].text)
				
			}
		}
		 return JSON.stringify([...$scope.selectedLocationsMap]);
}
	$scope.getSelectedTeamList = function(){
		var teams = document.getElementById("teamList")
		$scope.selectedTeamLists = new Array();
		var count=0;
		for(var i=0;i<teams.options.length;i++){
			if(teams.options[i].selected){
				var val = teams.options[i].value
				$scope.selectedTeamLists[count]=val;
				count++
			}
		}
		return $scope.selectedTeamLists;
	}
	$scope.selectAll = function(){
		var locations = document.getElementById("locationId");
		for(var i=0;i<locations.options.length;i++){
			locations.options[i].selected = true;
		}
		$scope.doChangeLoc();
	}
	$scope.deSelectAll = function(){
		var locations = document.getElementById("locationId");
		for(var i=0;i<locations.options.length;i++){
			locations.options[i].selected = false;
		}
		$scope.doChangeLoc();
	}
	$scope.setStartDate=function(){
		var date;

        if ($scope.sDate == null) {
            date = new Date();
        }
        else {
            date = $scope.sDate;
        }

        var options = {date: date, mode: 'date', titleText: 'Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {

                $scope.sDate = date;
				document.getElementById('startDate').value = $filter('date')(date, 'dd/MM/yyyy');
				
                $scope.sDate =$filter('date')(date, 'yyyy-MM-dd');
                

				if (!$scope.$$phase)
                    $scope.$apply()

            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
	}
	$scope.setEndDate=function(){
		var date;

        if ($scope.eDate == null) {
            date = new Date();
        }
        else {
            date = $scope.eDate;
        }

        var options = {date: date, mode: 'date', titleText: 'Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {

                $scope.eDate = date;
                document.getElementById('endDate').value = $filter('date')(date, 'dd/MM/yyyy');
                $scope.eDate = $filter('date')(date, 'yyyy-MM-dd');
               
				if (!$scope.$$phase)
                    $scope.$apply()

            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
	}
	$scope.sendForApproval=function(flag){
		var projectName = document.getElementById("projectName").value;
		var projectCode = document.getElementById("projectCode").value;
		var visbibility
		if(document.getElementById("visibilityPublic").checked){
			visbibility=document.getElementById("visibilityPublic").value
		}else{
			visbibility=document.getElementById("visibilityPrivate").value
		}
		var projectTypeMasterId = document.getElementById("projectTypeMasterId").options[document.getElementById("projectTypeMasterId").selectedIndex].value
		var projectTypeMasterName = document.getElementById("projectTypeMasterId").options[document.getElementById("projectTypeMasterId").selectedIndex].text
		var hoursType = document.getElementById("hrsId").options[document.getElementById("hrsId").selectedIndex].value
		var budgetHours = document.getElementById("budgetHours").value;
		var approvHours = document.getElementById("approvHours").value
		var startDate = $scope.sDate;
		var endDate = $scope.eDate;
		
		var projectValue = document.getElementById("projectValue").value
		var clientName = document.getElementById("clientName").value
		var clientLocation = document.getElementById("clientLocation").value
		var clientAddress = document.getElementById("clientAddress").value
		var clientPhoneNo = document.getElementById("clientPhoneNo").value
		var clientPanNo = document.getElementById("clientPanNo").value
		var clientGstNo = document.getElementById("clientGstNo").value
		//var keyContactPersonID = document.getElementById("keyContactPersonId").value
		var projectManager = document.getElementById("projectManager").value
		var accountManager = document.getElementById("accountmanager").value
		var projectManagerId = document.getElementById("projectManagerId").value
		var accountManagerId = document.getElementById("accountManagerId").value
		var locationIdsMap = $scope.getSelectedLocationsMap();
		
		var teamList = [];
		teamList = JSON.stringify($scope.getSelectedTeamList());
		var applicantRemarks = document.getElementById("applicantRemarks").value
		var valid = $scope.validate();
		if(valid==""){

		}else{
			showAlert(valid);
			return
		} 

		var fd = new FormData();
		fd.append("projectName",projectName)
		fd.append("projectCode",projectCode)
		fd.append("visibility",visbibility)
		fd.append("projectTypeMasterId",projectTypeMasterId)
		fd.append("projectTypeMasterName",projectTypeMasterName)
		fd.append("budgetHours",budgetHours)
		fd.append("approvHours",approvHours)
		fd.append("hoursType",hoursType)
		fd.append("projectValue",projectValue)
		fd.append("startDate",startDate)
		fd.append("endDate",endDate)
		fd.append("clientName",clientName)
		fd.append("clientLocation",clientLocation)
		fd.append("clientAddress",clientAddress)
		fd.append("clientPhoneNo",clientPhoneNo)
		fd.append("clientPanNo",clientPanNo)
		fd.append("clientGstNo",clientGstNo)
		fd.append("projectManager",projectManager)
		fd.append("accountmanager",accountManager)
		fd.append("applicantRemark",applicantRemarks)

		var table = document.getElementById("tableContactPerson")
		var keyContactCsv = "";
		for(i=1;i<=table.rows.length-1;i++){
			if(i==table.rows.length-1){
				keyContactCsv += table.rows[i].cells[1].innerHTML 
			}else{
				keyContactCsv += table.rows[i].cells[1].innerHTML +", "
			}
			
		}
		//alert(keyContactCsv)
		fd.append("keyContactPersonID",keyContactCsv) //  but aapne banaya hua field hai na ye 
		fd.append("projectManagerId",projectManagerId)
		fd.append("accountmanagerId",accountManagerId)
		fd.append("jsonLocMap",locationIdsMap)
		fd.append("jsonTeamList",teamList)
		fd.append("menuId","3303")
		fd.append("companyId",sessionStorage.getItem('companyId'))
		fd.append("level","1")
		if($scope.pageType=="addPage" || ($scope.pageType=="editPage" && !($scope.projectMaster.status=="SENT FOR APPROVAL" || $scope.projectMaster.status=="SENT FOR CANCELLATION"))){
			if (document.getElementById('inputFileUpload').files[0] ){
						
				var base64result = $scope.imageData.split(',')[1];
				$scope.fileUploadName = document.getElementById('inputFileUpload').files[0].name
				$scope.fileUploadType = document.getElementById('inputFileUpload').files[0].type
				
				var blob = base64toBlob(base64result, $scope.fileUploadType,$scope.fileUploadName)
				fd.append('file', blob,$scope.fileUploadName)
				
				if (document.getElementById('inputFileUpload').files[0].size/(1024*1024)>1)
				{
					showAlert("Maximum file size is limited to  1 Mb, Please try another file of lesser size. ")
					$ionicLoading.hide()
					return
				}
				
			}else if (document.getElementById('showImg').src.indexOf("data:image") > -1){
				//scope.imageData is the src of camera image 
				var base64result = $scope.imageData.split(',')[1];
				
				var ts = new Date();
				ts = ts.getFullYear() +""+ ts.getMonth() +""+ ts.getDate() + "" + ts.getHours() +""+ ts.getMinutes() +""+ ts.getSeconds()

				$scope.fileUploadName = "camPic"+ts+".jpeg"
				$scope.fileUploadType = "image/jpeg"
				
				var blob = base64toBlob(base64result, $scope.fileUploadType,$scope.fileUploadName)
				fd.append('file', blob,$scope.fileUploadName)
				
			}
		}
		if($scope.pageType=="approvePage"){
			fd.append("approverRemarks",document.getElementById("approverRemarks").value)
		}
		if(flag=="sendForApproval"){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Are you sure',
				template: 'Do you want to Send For Approval?', //Message
			});
		}else{
			//for approve
			var confirmPopup = $ionicPopup.confirm({
				title: 'Are you sure',
				template: 'Do you want to  Approve?', //Message
			});
		}
		
		confirmPopup.then(function(res){
            if(res){
				if(flag=="approve"){
					fd.append("fromView","Y")
					fd.append("transId",$rootScope.tranidFromProjConfig)
					var urlToCall = '/timeSheet/projectMaster/approve.spr'
				}else{
					var urlToCall = '/timeSheet/projectMaster/sendForApproval.spr'
				}
				
				$.ajax({
					url: (baseURL + urlToCall),
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
						
						
                        if (success.indexOf("ERROR")==0){
							console.log(success)
							handleClientResponse(success,urlToCall)
							$ionicLoading.hide()
							showAlert("Something went wrong. Please try later.")
							//showAlert(success)
							//$scope.redirectOnBack();
							return
						}	
                                $ionicLoading.hide()
								showAlert(success)
								
                                $scope.redirectOnBack();
                               
                                
                                //fill data
                                
                    },
                    error: function (e) { //alert("Server error - " + e);
                    alert(e.status)
                            $ionicLoading.hide()
                           $scope.data_return = {status: e};
                        commonService.getErrorMessage($scope.data_return);
                        
                           }				
                    });	
    
                
            }
        })


	}
	
	$scope.goReject = function(){
		
		

		var confirmPopup = $ionicPopup.confirm({
			title: 'Are you sure',
			template: 'Do you want Reject?', //Message
		});
		confirmPopup.then(function(res){
            if(res){
				var fd = new FormData();
				fd.append("transId",$rootScope.tranidFromProjConfig);
				fd.append("companyId",$rootScope.companyIdFromProjConfig);
				fd.append("menuId","3303");
				fd.append("fromEmail","")
				fd.append("fromView","Y")

				
				
                $.ajax({
                    url: (baseURL + '/timeSheet/projectMaster/reject.spr'),
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
						
						
                        if (success.indexOf("ERROR")==0){
                                    console.log(success)
                                    handleClientResponse(success,"/timeSheet/projectMaster/reject.spr")
									$ionicLoading.hide()
									showAlert("Something went wrong. Please try later.")
                                    //showAlert(success)
                                    //$scope.redirectOnBack();
                                    return
                                }	
                                $ionicLoading.hide()
                                showAlert(success)
                                $scope.redirectOnBack();
                               
                                
                                //fill data
                                
                    },
                    error: function (e) { //alert("Server error - " + e);
                    alert(e.status)
                            $ionicLoading.hide()
                           $scope.data_return = {status: e};
                        commonService.getErrorMessage($scope.data_return);
                        
                           }				
                    });	
    
                
            }
        })
	}

	$scope.SelectedFile = function(){
		
		var imgcontrolName= "showImg"
		var image = document.getElementById(imgcontrolName);
		image.src=""
		image.style.visibility="hidden"
		$scope.imageData = $scope.fileChange()
		

	}
	$scope.fileChange  = function (){
		//alert("11")
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
	  
	  if (document.getElementById('inputFileUpload').files[0]){	
		var f = document.getElementById('inputFileUpload').files[0]
		$scope.selectedFileNameFromDevice = document.getElementById('inputFileUpload').files[0].name
		//alert(f.name)
		reader.readAsDataURL(f);
	  }else{
		  $scope.imageData = ""
		  $scope.selectedFileNameFromDevice = ""
	  }
	  
	  
	}
	$scope.cameraTakePicture = 	function (mode) { 
		var imgcontrolName= "showImg"
		
	if (mode=="file"){
   
		navigator.camera.getPicture(onSuccess, onFail, { quality: 25,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY
			});
		function onSuccess(imageData) {
			var image = document.getElementById(imgcontrolName);
			image.style.visibility="visible"
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
           // $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;

			//image.src = "data:image/jpeg;base64," + imageData;
			//$scope.imageData = "data:image/jpeg;base64," + imageData;
			
			
			
			
		}

		function onFail(message) {
			showAlert(message);
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
			image.style.visibility="visible"
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
           // $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;

			//image.src = "data:image/jpeg;base64," + imageData;
			//$scope.imageData = "data:image/jpeg;base64," + imageData;
			document.getElementById("inputFileUpload").value = ""	
			$scope.selectedFileNameFromDevice = ""
			if (!$scope.$$phase)
                $scope.$apply()			
			
			
			
		}

		function onFail(message) {
			showAlert(message);
		}
	}

	
	}
	$scope.downloadAttachmnent = function (od){
		
		var strData=od.uploadFile
		//var strUrlPrefix='data:"application/pdf;base64,'
		var strUrlPrefix='data:'+ od.uploadContentType +";base64,"
		var url=strUrlPrefix + strData
		var blob = base64toBlob(strData,od.uploadContentType)
		downloadFileFromData(od.uploadFileName,blob,od.uploadContentType)
		event.stopPropagation();
	}
		//  $scope.SelectAllList = function (CONTROL,functionCall){
		// 	   $('#locationId_chosen .chosen-choices').addClass('selectOffice');
		// 		  $("#"+CONTROL+" option").each(function()
		// 				  {
		// 			  $(this).prop('selected', true)
					 
		// 				  });
		// 		  $("#"+CONTROL).trigger('chosen:updated');
		// 		   	functionCall();
		// 		   }

		//   $scope.DeselectAllList = function (CONTROL,functionCall){
		// 			   $("#"+CONTROL+" option").each(function()
		// 						  {
		// 					  $(this).prop('selected', false)
		// 						  });
		// 			   $("#"+CONTROL).trigger('chosen:updated');
		// 		   	functionCall();
		// 		   }

$scope.init();	

});
