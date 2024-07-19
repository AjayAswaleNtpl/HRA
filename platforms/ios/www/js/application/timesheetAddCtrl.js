mainModule.controller('timesheetAddCtrl', function ($scope, $rootScope, commonService, $ionicHistory, $window,
    $rootScope, $ionicPopup, $state, $http, $q, $filter, $ionicLoading, addTravelClaimAplication, $timeout,
    $ionicNavBarDelegate, getTravelRuleService, $window) {

     $rootScope.navHistoryPrevPage = "requestTimesheetEmployeeDailyList"
    $scope.empId = $rootScope.empIdTransferFromTimesheetList;    
    $scope.date = $rootScope.dateTransferFromTimesheetList;
    $scope.companyId = sessionStorage.getItem('companyId');
    $scope.dataFilledOver = false

    document.getElementById("date").value = $scope.date
     $scope.initList = function(){
        $scope.timeSheetEmployeeChildGridList = new Array(10);  
    
        for (var i = 0;i<10;i++){
            $scope.timeSheetEmployeeChildGridList[i] = {}
        }
    
        $scope.timeSheetEmployeeChildGridList[0].activityMaster = {}
        $scope.timeSheetEmployeeChildGridList[0].projectMaster = {} 
        $scope.timeSheetEmployeeChildGridList[0].subActivityMaster = {} 
        $scope.timeSheetEmployeeChildGridList[0].noOfHours =""
        $scope.timeSheetEmployeeChildGridList[0].remaks = ""
        
    
        //$scope.selectedValues.timeSheetEmployeeChildGridList = [0,1]
        // $scope.timeSheetEmployeeChildGridList = [1];
        $scope.timeSheetEmployeeChildGridList[1].activityMaster = {}
        $scope.timeSheetEmployeeChildGridList[1].projectMaster = {}
        $scope.timeSheetEmployeeChildGridList[1].subActivityMaster = {} 
        $scope.timeSheetEmployeeChildGridList[1].noOfHours =""
        $scope.timeSheetEmployeeChildGridList[1].remaks = ""
        //$scope.size = timeSheetEmployeeChildGridList.length()
        $scope.timeSheetEmployeeChildGridList[2].activityMaster = {}
        $scope.timeSheetEmployeeChildGridList[2].projectMaster = {}
        $scope.timeSheetEmployeeChildGridList[2].subActivityMaster = {} 
        $scope.timeSheetEmployeeChildGridList[2].noOfHours =""
        $scope.timeSheetEmployeeChildGridList[2].remaks = ""
    
        $scope.timeSheetEmployeeChildGridList[3].activityMaster = {}
        $scope.timeSheetEmployeeChildGridList[3].projectMaster = {}
        $scope.timeSheetEmployeeChildGridList[3].subActivityMaster = {} 
        $scope.timeSheetEmployeeChildGridList[3].noOfHours =""
        $scope.timeSheetEmployeeChildGridList[3].remaks = ""
    
        $scope.timeSheetEmployeeChildGridList[4].activityMaster = {}
        $scope.timeSheetEmployeeChildGridList[4].projectMaster = {}
        $scope.timeSheetEmployeeChildGridList[4].subActivityMaster = {} 
        $scope.timeSheetEmployeeChildGridList[4].noOfHours =""
        $scope.timeSheetEmployeeChildGridList[4].remaks = ""
    
        $scope.timeSheetEmployeeChildGridList[5].activityMaster = {}
        $scope.timeSheetEmployeeChildGridList[5].projectMaster = {}
        $scope.timeSheetEmployeeChildGridList[5].subActivityMaster = {} 
        $scope.timeSheetEmployeeChildGridList[5].noOfHours =""
        $scope.timeSheetEmployeeChildGridList[5].remaks = ""
    
        $scope.timeSheetEmployeeChildGridList[6].activityMaster = {}
        $scope.timeSheetEmployeeChildGridList[6].projectMaster = {}
        $scope.timeSheetEmployeeChildGridList[6].subActivityMaster = {} 
        $scope.timeSheetEmployeeChildGridList[6].noOfHours =""
        $scope.timeSheetEmployeeChildGridList[6].remaks = ""
    
        $scope.timeSheetEmployeeChildGridList[7].activityMaster = {}
        $scope.timeSheetEmployeeChildGridList[7].projectMaster = {}
        $scope.timeSheetEmployeeChildGridList[7].subActivityMaster = {} 
        $scope.timeSheetEmployeeChildGridList[7].noOfHours =""
        $scope.timeSheetEmployeeChildGridList[7].remaks = ""
    
        $scope.timeSheetEmployeeChildGridList[8].activityMaster = {}
        $scope.timeSheetEmployeeChildGridList[8].projectMaster = {}
        $scope.timeSheetEmployeeChildGridList[8].subActivityMaster = {} 
        $scope.timeSheetEmployeeChildGridList[8].noOfHours =""
        $scope.timeSheetEmployeeChildGridList[8].remaks = ""
    
        $scope.timeSheetEmployeeChildGridList[9].activityMaster = {}
        $scope.timeSheetEmployeeChildGridList[9].projectMaster = {}
        $scope.timeSheetEmployeeChildGridList[9].subActivityMaster = {} 
        $scope.timeSheetEmployeeChildGridList[9].noOfHours =""
        $scope.timeSheetEmployeeChildGridList[9].remaks = ""
    
        //$scope.serverlist.timeSheetEmployeeChildGridList = [0,1,2,3,4,5,6,7,8,9];  
            
        $scope.editFlag = 'N';
        ////
        
        $scope.projectMasterList = {}
        $scope.activityMasterList = {}
        $scope.subActivityMaster = {}
    
    
     }   
    $scope.init = function (){
        //timeSheet/TimeSheetEmployeeDaily/add
        //get all init data  amd popul;ate dropdowns and hidden files.
        $scope.initList();
        $scope.size = 1
        $scope.ts_row = 1
    
        var fd = new FormData()

        fd.append("companyId",$scope.companyId)
        fd.append("date",$scope.date)
        fd.append("editFlag",$rootScope.editFlagTransferFromTimesheetList)
        fd.append("menuId","3305")
        fd.append("onBehalfFlag","N")
        

        $.ajax({
            url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/add.spr'),
            data: fd,
            type: 'POST',
            async:false,
            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
             },
            success : function(success) {
                //alert("scuc")
                if (!(success.clientResponseMsg=="OK")){
                            console.log(success.clientResponseMsg)
                            handleClientResponse(success.clientResponseMsg,"uploadFileReviewerAjax")
                            $ionicLoading.hide()
                            showAlert("Something went wrong. Please try later.")
                            //$scope.redirectOnBack();
                            return
                        }	
                        
                        $scope.timeSheetEmployeeChildGridListFromServer = success.timeSheetEmployeeChildGridList
                        if($scope.timeSheetEmployeeChildGridListFromServer != null && $scope.timeSheetEmployeeChildGridListFromServer.length > 0 ){
                         //nothing here
                        }else{
                            $scope.ts_row = 1;
                            $scope.editFlag = "N";
                            $scope.initList()
                        }
                        //document.getElementById('menuId ').value = success.menuId;
                        $scope.menuId =  success.menuId;
                        //document.getElementById('companyId ').value  = success.compId;
                        $scope.companyId =  success.compId;
                        //document.getElementById('size').value  = success.size;
                        //document.getElementById('gridSize').value  = success.gridSize;
                        $scope.projectMasterList = success.projectMasterList;
                        $scope.activityMasterList = success.activityMasterList;
                        $scope.attHours = success.attHours;
                        $scope.requiredHours = success.requiredHours;
                        $scope.status = success.status
                        $scope.compName =  success.compName;
                        
                        $scope.requiredHours = success.requiredHours;
                        $scope.timeSheetEmployeeId = success.timeSheetEmployeeId;
                        //it will have 10 records if not saed may be
                        
                        // document.getElementById("companyName").value = $scope.compName;
                        
                        // if($scope.attHours != null){
                        //     document.getElementById("attHours").value = $scope.attHours
                        // }else{
                        //     document.getElementById("attHours").value ="00:00"

                        // }
                        // if($scope.requiredHours != null){
                        //     document.getElementById("reqHrs").value = $scope.requiredHours;
                        // }else{
                        //     document.getElementById("reqHrs").value = "00:00"
                        // }

                        // document.getElementById("status").value = $scope.status;
                        
                            
                            document.getElementById("companyName").innerHTML = $scope.compName;
                            
                            if($scope.attHours != null){
                                document.getElementById("attHours").innerHTML = $scope.attHours
                            }else{
                                document.getElementById("attHours").innerHTML ="00:00"
    
                            }
                            if($scope.requiredHours != null){
                                document.getElementById("reqHrs").innerHTML = $scope.requiredHours;
                            }else{
                                document.getElementById("reqHrs").innerHTML = "00:00"
                            }
    
                            document.getElementById("status").innerHTML = $scope.status;
                        

                        
                        if($scope.timeSheetEmployeeChildGridListFromServer != null && $scope.timeSheetEmployeeChildGridListFromServer.length > 0 ){
                            $scope.editFlag = "Y";
                           $timeout(function () {
                                $scope.fillData();

                            }, 500)
                            
                        }else{
                            $scope.dataFilledOver = true
                            $ionicLoading.hide()
                        }

                        // if($scope.editFlag=="Y"){
                        //     for(var i=0;i<$scope.timeSheetEmployeeChildGridListFromServer.length;i++){
                        //         document.getElementById("removebutton").disabled = true
                        //     }
                            
                        // }else{
                        //     document.getElementById("removebutton").disabled = false
                        // }
                        // )
                        // filldata(){
                        //     rec 1 - call ajax with activity id from list ,fill subactivity listNth
                        //     select all dd to the gottend ids 
                        // }

                        

                        ////$scope.timeSheetEmployeeChildGridList = success.timeSheetEmployeeChildGridList
                        
                        //showAlert(success.msg)
                        
            },
            error: function (e) { //alert("Server error - " + e);
            
                    $ionicLoading.hide()
                   $scope.data_return = {status: e};
                commonService.getErrorMessage($scope.data_return);
                
                   }				
            });			



    }    

    $scope.fillData = function(){
        $scope.ts_row = $scope.timeSheetEmployeeChildGridListFromServer.length
        $scope.oldNoOfRows = $scope.timeSheetEmployeeChildGridListFromServer.length
        document.getElementById("removebutton").disabled = true
        if (!$scope.$$phase)
        $scope.$apply()

        for(size=0;size<$scope.timeSheetEmployeeChildGridListFromServer.length;size++){

			selPro = document.getElementById("childId_" + size)
				if(selPro!=null){
                    //for child id
					selPro.value = $scope.timeSheetEmployeeChildGridListFromServer[size].childId
                }		
            
			selPro = document.getElementById("projectMasterId_" + size)
				if(selPro!=null){
                    //for project list
                    for(i=0;i<$scope.projectMasterList.length;i++){
                        if ($scope.projectMasterList[i].projectConfigurationId == $scope.timeSheetEmployeeChildGridListFromServer[size].projectMasterId)
                        selPro.options[i+1].selected = true
                    }
                }

            selAct = document.getElementById("activityMasterId_" + size)
            if(selAct != null){
                for(i=0;i<$scope.activityMasterList.length;i++){
                    if($scope.activityMasterList[i].activityMasterId == $scope.timeSheetEmployeeChildGridListFromServer[size].activityMasterId){
                        selAct.options[i+1].selected = true
                    }
                }
            }
            selSubAct = document.getElementById("subactivityMasterId_" + size)
            if ($scope.companyId != "-1") {

                $.ajax({
                        url: (baseURL + "/timeSheet/TimeSheetEmployeeDaily/getsubActivityByActivity.spr"),
                        data: {
                            'companyId': $scope.companyId,
                            'activityId': $scope.timeSheetEmployeeChildGridListFromServer[size].activityMasterId,
                            'menuId': $scope.menuId,
                        },
                        type: 'POST',
                        dataType: 'json',
                        async: false,
                        headers: {
                            'Authorization': 'Bearer ' + jwtByHRAPI
                         },
                        success: function (result) {
                            
                            //alert(result)
                            var tmpList;
                            tmpList = result.subActivityMasterList;
                            if (size==0){
                                $scope.subActivityMasterList0 = result.subActivityMasterList
                            }
                            if (size==1){
                                $scope.subActivityMasterList1 = result.subActivityMasterList
                            }
                            if (size==2){
                                $scope.subActivityMasterList2 = result.subActivityMasterList
                            }
                            if (size==3){
                                $scope.subActivityMasterList3 = result.subActivityMasterList
                            }
                            if (size==4){
                                $scope.subActivityMasterList4 = result.subActivityMasterList
                            }
                            if (size==5){
                                $scope.subActivityMasterList5 = result.subActivityMasterList
                            }
                            if (size==6){
                                $scope.subActivityMasterList6 = result.subActivityMasterList
                            }
                            if (size==7){
                                $scope.subActivityMasterList7 = result.subActivityMasterList
                            }
                            if (size==8){
                                $scope.subActivityMasterList8 = result.subActivityMasterList
                            }
                            if (size==9){
                                $scope.subActivityMasterList9 = result.subActivityMasterList
                            }
                            
                            if (!$scope.$$phase)
                            $scope.$apply()

                            if(selSubAct != null){
                                for(i=0;i<tmpList.length;i++){
                                    if(tmpList[i].subActivityMasterId == $scope.timeSheetEmployeeChildGridListFromServer[size].subActivityMasterId){
                                        selSubAct.options[i+1].selected = true
                                    }
                                }
                            }
                
                            

                            
         
    
                            /*var isEmpty = (Object.keys(result).length === 0);
    
    
                            if (!isEmpty) {
                                $("#sub" + curID).find('option').remove().end().append('<option value="-1">---Select subactivity---</option>').val('-1');
                                $.each(result, function (val, text) {
                                    $("#sub" + idx).append($('<option value=' + val + '>' + text + '</option>'));
                                    $("#sub" + idx).attr('disabled', false).trigger('chosen:updated');
                                });
                            } else {
                                $("#sub" + idx).attr('disabled', true).trigger('chosen:updated');
                            }
    
                            $("#sub" + idx).html($("#sub" + idx + " option").sort(function (a, b) {
                                return a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1
                            }))
                            $("select#sub" + idx).val('-1');
                            $("#sub" + idx).trigger('chosen:updated');*/
    
    
                        },
                        error: function (e) { //alert("Server error - " + e);
                        alert(e.status)
                        $ionicLoading.hide()
                        $scope.data_return = {status: e};
                        commonService.getErrorMessage($scope.data_return);
                    
                       }	
                    });
                   


            }
           // document.getElementById("noOfHoursForRow_"+size).value = "02:20"
            document.getElementById("noOfHoursForRow_"+size).value = $scope.timeSheetEmployeeChildGridListFromServer[size].noOfHrs;
            document.getElementById("remark_"+size).value = $scope.timeSheetEmployeeChildGridListFromServer[size].remarks;
           
        }
        if (!$scope.$$phase)
            $scope.$apply()
        
        $scope.dataFilledOver = true
    }

    $scope.validate = function () {
       var text = "";
        //var size = document.getElementById("gridSize").value;
        $scope.noOfRows = 0;
        for (var size = 0; size < 10; size++) {
            if (document.getElementById("projectMasterId_" + size) == null) {
                break;
            }
            $scope.noOfRows++;
            elem = document.getElementById("projectMasterId_" + size)
			name = elem.options[elem.selectedIndex].text
            projectMasterId= $scope.getProjectMasterId(name)
          //  $scope.timeSheetEmployeeChildGridList[size].projectMaster.projectConfigurationId = projectMasterId
           
            elemAct = document.getElementById("activityMasterId_" + size)
            nameAct = elemAct.options[elemAct.selectedIndex].text
            activityMasterId= $scope.getActivityMasterId(nameAct)
           // $scope.timeSheetEmployeeChildGridList[size].activityMaster.activityMasterId = activityMasterId

            elemSubAct = document.getElementById("subactivityMasterId_" + size)
            nameSubAct = elemSubAct.options[elemSubAct.selectedIndex].text
            subActivityMasterId = $scope.getSubActivityMasterId(size,nameSubAct)
           // $scope.timeSheetEmployeeChildGridList[size].subActivityMaster.subActivityMasterId = subActivityMasterId

            $scope.noOfHours = document.getElementById("noOfHoursForRow_" + size).value;
            if ($scope.noOfHours.match(/^(\d{1,2}):(\d{2})([ap]m)?$/) == null) {
                //text = "no Of hours should be in HH:MM format in row no \n" + (size+1);
                 text = "Please enter all details for record no. " + (size+1);
                
            } 
            $scope.remarks= document.getElementById("remark_"+size).value;
			$scope.childId= document.getElementById("childId_"+size).value;
			

            if(projectMasterId=='' || projectMasterId=='undefined'){
                if(size==0){
                    text ="Please enter atleast one record \n"
                }
                else{
                    //text+="Please enter Project name for "+(size+1)+"\n"
                    text = "Please enter all details for record no. " + (size+1);
                
                }
            }
            else{
                if(activityMasterId == '' || $scope.noOfHours=='' ||  subActivityMasterId=='zero'){
                    text ="Please enter all details for record no" + (size+1)+"\n"
                }
                else{
                    $scope.timeSheetEmployeeChildGridList[size].projectMaster.projectConfigurationId = projectMasterId
                    $scope.timeSheetEmployeeChildGridList[size].activityMaster.activityMasterId = activityMasterId
                    $scope.timeSheetEmployeeChildGridList[size].subActivityMaster.subActivityMasterId = subActivityMasterId
                    $scope.timeSheetEmployeeChildGridList[size].noOfHrs = $scope.noOfHours
                    $scope.timeSheetEmployeeChildGridList[size].remaks = $scope.remarks
					if ($scope.childId !="") {
						$scope.timeSheetEmployeeChildGridList[size].timeSheetEmployeeChildId = $scope.childId
					}
                     
                    // alert($scope.timeSheetEmployeeChildGridList[size].activityMaster.activityMasterId)
                    // alert($scope.timeSheetEmployeeChildGridList[size].subActivityMaster.subActivityMasterId)
                    // alert($scope.timeSheetEmployeeChildGridList[size].noOfHrs)
                }
            }
           

            // if (size == 0) {
            //     if (projectMasterId ==''){
            //         // SE
            //         text+="\n Please select project name on record " + (size+1)
            //     }
            //     else{
                    
            //     }
            //     elem = document.getElementById("projectMasterId_" + size)
			// 	name = elem.options[elem.selectedIndex].text
            //     projectMasterId= $scope.getProjectMasterId( name)
            //     $scope.timeSheetEmployeeChildGridList[size].projectMaster.projectConfigurationId = projectMasterId
            //     //$scope.timeSheetEmployeeChildGridList[size].projectMaster.projectName = name
                
                

            //     if (projectMasterId != '') {
            //         elemAct = document.getElementById("activityMasterId_" + size)
			// 	    nameAct = elemAct.options[elemAct.selectedIndex].text
            //         activityMasterId= $scope.getActivityMasterId( nameAct)
            //         $scope.timeSheetEmployeeChildGridList[size].activityMaster.activityMasterId = activityMasterId
            //         //$scope.timeSheetEmployeeChildGridList[size].activityMaster.activityMasterName = nameAct
            //         $scope.noOfHrs = document.getElementById("noOfHours_" + size).value;
            //         // $scope.activityname = document.getElementById("activityMasterId_" + size).value;
            //         if (nameAct == '' && $scope.noOfHrs == '') {
            //             text += "\n Please select atleast on record";
            //         } else {

            //             if (nameAct != '' && $scope.noOfHrs != '') {
            //                 text += "\n Please select project name for record no. " + (size + 1);
            //             }
            //             if ($scope.activityname != '-1') {
            //                 elemSubAct = document.getElementById("subActivityMasterId_" + size)
            //                 nameSubAct = elemSubAct.options[elemSubAct.selectedIndex].text
            //                 subActivityMasterId = $scope.getSubActivityMasterId(nameSubAct)
            //                 $scope.timeSheetEmployeeChildGridList[size].subActivityMaster.subActivityMasterId = subActivityMasterId
            //                 $scope.timeSheetEmployeeChildGridList[size].subActivityMaster.subActivityname = nameSubAct
            //                // $scope.subActivityname = document.getElementById("subactivityMasterId" + size).value;

            //                 if (nameSubAct == '')
            //                     text += "\n Please select subactivity name for record no. " + (size + 1);
            //             }
            //             if (nameAct == '' && $scope.noOfHrs != '') {
            //                 text += "\n Please select project name and activity for record no. " + (size + 1);
            //             }
            //             if ($scope.noOfHrs == '') {
            //                 text += "\n Please select no Of Hours for record no. " + (size + 1);
            //             }
            //         }

            //     } else { //else if ($scope.projectMasterId != '') {
            //         text += "\n Please select at least one record . " + (size + 1);
                    
            //         $scope.activityname = document.getElementById("activityMasterId_" + size).value;
            //         if ($scope.activityname == '-1') {
            //             text += "\n Please select activity name for record no. " + (size + 1);
            //         }
            //         if ($scope.activityname != '-1') {
            //             $scope.subActivityname = document.getElementById("subactivityMasterId_" + size).value;

            //             if ($scope.subActivityname == '-1' || $scope.subActivityname == '')
            //                 $scope.text += "\n Please select subactivity name for record no. " + (size + 1);
            //         }
            //         $scope.noOfHrs = document.getElementById("noOfHours_" + size).value;
            //         if ($scope.noOfHrs == '') {
            //             $scope.text += "\n Please select no Of Hours for record no. " + (size + 1);
            // 
                }
                return text;/*
        //         }
        //     } else {
        //         elem = document.getElementById("projectMasterId_" + size)
		// 		name = elem.options[elem.selectedIndex].text
        //         projectMasterId= $scope.getProjectMasterId( name)
        //         $scope.timeSheetEmployeeChildGridList[size].projectMaster.projectConfigurationId = projectMasterId
        //         $scope.timeSheetEmployeeChildGridList[size].projectMaster.projectName = name
                
        //         if (elem) {
        //             // $scope.projectMasterId = projectMasterId
        //             $scope.noOfHrs = document.getElementById("noOfHours_" + size).value;
        //             elemAct = document.getElementById("activityMasterId_" + size)
		// 		    nameAct = elemAct.options[elemAct.selectedIndex].text
        //             activityMasterId= $scope.getActivityMasterId( nameAct)
        //             $scope.timeSheetEmployeeChildGridList[size].activityMaster.activityMasterId = activityMasterId
        //             $scope.timeSheetEmployeeChildGridList[size].activityMaster.activityMasterName = nameAct
                    
        //             if (activityMasterId != '') {

        //                 elemSubAct = document.getElementById("subActivityMasterId_" + size)
        //                 nameSubAct = elemSubAct.options[elemSubAct.selectedIndex].text
        //                 subActivityMasterId = $scope.getSubActivityMasterId(nameSubAct)
        //                 $scope.timeSheetEmployeeChildGridList[size].subActivityMaster.subActivityMasterId = subActivityMasterId
        //                 $scope.timeSheetEmployeeChildGridList[size].subActivityMaster.subActivityname = nameSubAct

                        
        //                 if (subActivityname == '')
        //                     $scope.text += "\n Please select subactivity name for record no. " + (size + 1);
        //             }
        //             if ($scope.projectMasterId != '') {

        //                 if ($scope.activityname == '') {
        //                     $scope.text += "\n Please select activity name for record no. " + (size + 1);
        //                 }
        //                 if ($scope.activityname != '' && $scope.projectMasterId != '' && $scope.noOfHrs == '') {
        //                     $scope.text += "\n Please select no Of Hours for record no. " + (size + 1);
        //                 }
        //             }
        //             if ($scope.activityname != '') {
        //                 if ($scope.projectMasterId == '')
        //                     $scope.text += "\n Please select project name for record no. " + (size + 1);
        //             }
        //         }
        //     }
        // }*/
    }
    $scope.validation = function () {
        var text = "";
        var text = $scope.validate();
        if (text !=""){
            showAlert(text)
            return
        }
        
        var size = $scope.ts_row;

/////


        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure',
            template: 'Do you want to save?', //Message
        });
        confirmPopup.then(function(res){
            if(res){
                var fd = new FormData();
                fd.append("menuId",$scope.menuId)
                fd.append("companyId",$scope.companyId)
                fd.append("reporteeId",$scope.empId)
                fd.append("date",$scope.date)
                $scope.timeSheetEmployeeChildGridList.length = $scope.ts_row;

                $scope.jsonList =  JSON.stringify($scope.timeSheetEmployeeChildGridList);
                fd.append("timeSheetEmployeeChildGridList",$scope.jsonList)
                
               // $.ajax
               $.ajax({
                url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/save.spr'),
                data: fd,
                type: 'POST',
                async:false,
                contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                processData: false, // NEEDED, DON'T OMIT THIS
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                 },
                success : function(success) {
                    //alert("scuc")
                    if (!(success.clientResponseMsg=="OK")){
                                console.log(success.clientResponseMsg)
                                handleClientResponse(success.clientResponseMsg,"uploadFileReviewerAjax")
                                $ionicLoading.hide()
                                showAlert("Something went wrong. Please try later.")
                                //$scope.redirectOnBack();
                                return
                            }	
                            $ionicLoading.hide()
                            showAlert("Application saved successfully")

                            $scope.menuId =  success.menuId;
                            $scope.companyId =  success.compId;

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
        // for(i=0;i<size;i++){
        //     elem = aaa    

        //     $scope.projectMasterId = $scope.timeSheetEmployeeChildGridList[size].projectMaster.projectConfigurationId
        //     $scope.activityMasterId = $scope.timeSheetEmployeeChildGridList[size].activityMaster.activityMasterId
        //     $scope.activityName = $scope.timeSheetEmployeeChildGridList[size].activityMaster.activityMasterName
        //     $scope.subActivityMasterId = $scope.timeSheetEmployeeChildGridList[size].subActivityMaster.subActivityMasterId
        //     $scope.noOfHours = document.getElementById("noOfHours_"+size).value
        //     $scope.remark = document.getElementById("remark_"+size).value


        //     alert($scope.projectMasterId,$scope.activityMasterId,$scope.activityMasterName,$scope.noOfHours,$scope.remark)
        // }
        
        
        
        /*var text = $scope.validate();

        if (text == "") {
            showAlert("[[${@environment.getProperty(alertHeader)}]]", document.getElementById("saveMsg").value, "NO", "YES", function (r) {
                if (r) {
                    document.timeSheetEmployeeDailyForm.action = "save.spr?&onBehalfFlag=" + $('#onBehalfFlag').val() + "&reporteeId=" + $("#reporteeId").val();
                    document.timeSheetEmployeeDailyForm.submit();
                    window.parent.$("#preloader").show(); //$("#preloader").show();
                }
            });
        } else {
            showAlert(text, '[[${@environment.getProperty(alertHeader)}]]')
        }*/
    }

    $scope.update = function () {
        //timeSheetEmployeeId
        var text = "";
        text = $scope.validate();
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure',
            template: 'Do you want to update?', //Message
        });
        confirmPopup.then(function(res){
            if(res){
                var fd = new FormData();
                fd.append("menuId",$scope.menuId)
                fd.append("companyId",$scope.companyId)
                fd.append("date",$rootScope.dateTransferFromTimesheetList)
                fd.append("editFlag",$rootScope.editFlagTransferFromTimesheetList)
                fd.append("onBehalfFlag","N")
                fd.append("reporteeId",$scope.empId)
                fd.append("timeSheetEmployeeId",$scope.timeSheetEmployeeId)
                
                $scope.timeSheetEmployeeChildGridList.length = $scope.noOfRows
                $scope.jsonList =  JSON.stringify($scope.timeSheetEmployeeChildGridList);
                fd.append("timeSheetEmployeeChildGridList",$scope.jsonList)
               // $.ajax
               $.ajax({
                url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/update.spr'),
                data: fd,
                type: 'POST',
                async:false,
                contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                processData: false, // NEEDED, DON'T OMIT THIS
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                 },
                success : function(success) {
                    //alert("scuc")
                    if (!(success.clientResponseMsg=="OK")){
                                console.log(success.clientResponseMsg)
                                handleClientResponse(success.clientResponseMsg,"uploadFileReviewerAjax")
                                $ionicLoading.hide()
                                showAlert("Something went wrong. Please try later.")
                                //$scope.redirectOnBack();
                                return
                            }	
                            $ionicLoading.hide()
                            showAlert(success.msg)
                            $scope.menuId =  success.menuId;
                            $scope.companyId =  success.compId;
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
            }else{
                $ionicLoading.hide()
            }
        });

        /*
        if (text == "") {
            showAlert("[[${@environment.getProperty(alertHeader)}]]", document.getElementById("updateMsg").value, "NO", "YES", function (r) {
                if (r) {
                    document.timeSheetEmployeeDailyForm.action = "update.spr?&onBehalfFlag=" + $('#onBehalfFlag').val() + "&reporteeId=" + $("#reporteeId").val();
                    document.timeSheetEmployeeDailyForm.submit();
                    window.parent.$("#preloader").show(); //$("#preloader").show();
                }
            });
        } else {
            showAlert(text, '[[${@environment.getProperty(alertHeader)}]]');
        }*/
    }


    $scope.getProjectMasterId = function(name){
	
		for(var i=0;i<$scope.projectMasterList.length;i++){
				if($scope.projectMasterList[i].projectName.trim()==name.trim()){
					return $scope.projectMasterList[i].projectConfigurationId;
				}
			}
        }

    $scope.getActivityMasterId = function(name){
        for(var i=0;i<$scope.activityMasterList.length;i++){
            if($scope.activityMasterList[i].activityMasterName.trim()==name.trim()){
                return $scope.activityMasterList[i].activityMasterId;
            }
        }
    }
    $scope.getSubActivityMasterId = function(idx,name){
        var tmpLIST
        if (idx==0){
            tmpLIST = $scope.subActivityMasterList0 
        }
        if (idx==1){
            tmpLIST = $scope.subActivityMasterList1
        }
        if (idx==2){
            tmpLIST = $scope.subActivityMasterList2 
        }
        if (idx==3){
            tmpLIST = $scope.subActivityMasterList3 
        }
        if (idx==4){
            tmpLIST = $scope.subActivityMasterList4 
        }
        if (idx==5){
            tmpLIST = $scope.subActivityMasterList5 
        }
        if (idx==6){
            tmpLIST = $scope.subActivityMasterList6 
        }
        if (idx==7){
            tmpLIST = $scope.subActivityMasterList7 
        }
        if (idx==8){
            tmpLIST = $scope.subActivityMasterList8 
        }
        if (idx==9){
            tmpLIST = $scope.subActivityMasterList9 
        }
        var count = 0;
        if(tmpLIST){
        for(var i=0;i<tmpLIST.length;i++){
            if(tmpLIST[i].subActivityMasterName.trim()==name.trim()){
                count++;
                return tmpLIST[i].subActivityMasterId
            }
        }
        }
        if(count==0){
            return "zero";
        }
    }
        

    $scope.doChangeProject = function (idx) {
        
        
        elem = document.getElementById("projectMasterId_"+idx)
				name = elem.options[elem.selectedIndex].text
                var  projectConfigurationId= $scope.getProjectMasterId( name)
                //alert(idx+ "    "  +projectConfigurationId)
                return
				
				/*
        var res = str.split("_");

        if (n == '-1') {
            $("#projectMasterId_" + res[1]).val("-1");
            $("#projectMasterId_" + res[1]).trigger('chosen:updated');
            $("#activityMasterId_" + res[1]).val("-1");
            $("#activityMasterId_" + res[1]).trigger('chosen:updated');
            $("#subactivityMasterId_" + res[1]).val("-1");
            $("#subactivityMasterId_" + res[1]).attr('disabled', true).trigger('chosen:updated');
            $("#subactivityMasterId_" + res[1]).trigger('chosen:updated');
            $("#noOfHours" + res[1]).val("");
            $("#remark" + res[1]).val("");
        }
        */
    }
    $scope.doChangeActivity = function (idx) {
        elem = document.getElementById("activityMasterId_"+idx)
				name = elem.options[elem.selectedIndex].text
                var  activityMasterId = $scope.getActivityMasterId(name)
                // alert(activityMasterId)
                
        //$("#empId").empty();
        //$("#sub" + idx).empty().trigger('chosen:updated');
        if ($scope.companyId != "-1") {

            $.ajax({
                    url: (baseURL + "/timeSheet/TimeSheetEmployeeDaily/getsubActivityByActivity.spr"),
                    data: {
                        'companyId': $scope.companyId,
                        'activityId': activityMasterId,
                        'menuId': $scope.menuId,
                    },
                    type: 'POST',
                    dataType: 'json',
                    //async: true,
                    headers: {
                        'Authorization': 'Bearer ' + jwtByHRAPI
                     },
                    success: function (result) {
                        //alert(result)
                        if (idx==0){
                            $scope.subActivityMasterList0 = result.subActivityMasterList
                        }
                        if (idx==1){
                            $scope.subActivityMasterList1 = result.subActivityMasterList
                        }
                        if (idx==2){
                            $scope.subActivityMasterList2 = result.subActivityMasterList
                        }
                        if (idx==3){
                            $scope.subActivityMasterList3 = result.subActivityMasterList
                        }
                        if (idx==4){
                            $scope.subActivityMasterList4 = result.subActivityMasterList
                        }
                        if (idx==5){
                            $scope.subActivityMasterList5 = result.subActivityMasterList
                        }
                        if (idx==6){
                            $scope.subActivityMasterList6 = result.subActivityMasterList
                        }
                        if (idx==7){
                            $scope.subActivityMasterList7 = result.subActivityMasterList
                        }
                        if (idx==8){
                            $scope.subActivityMasterList8 = result.subActivityMasterList
                        }
                        if (idx==9){
                            $scope.subActivityMasterList9 = result.subActivityMasterList
                        }
                        
                        if (!$scope.$$phase)
                        $scope.$apply()
     

                        /*var isEmpty = (Object.keys(result).length === 0);


                        if (!isEmpty) {
                            $("#sub" + curID).find('option').remove().end().append('<option value="-1">---Select subactivity---</option>').val('-1');
                            $.each(result, function (val, text) {
                                $("#sub" + idx).append($('<option value=' + val + '>' + text + '</option>'));
                                $("#sub" + idx).attr('disabled', false).trigger('chosen:updated');
                            });
                        } else {
                            $("#sub" + idx).attr('disabled', true).trigger('chosen:updated');
                        }

                        $("#sub" + idx).html($("#sub" + idx + " option").sort(function (a, b) {
                            return a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1
                        }))
                        $("select#sub" + idx).val('-1');
                        $("#sub" + idx).trigger('chosen:updated');*/


                    }
                });
        }
    }
    $scope.doChangesubActivity = function (idx) {
        /*
        //elem = document.getElementById("subActivityMasterId_"+idx)
       // name = elem.options[elem.selectedIndex].text
       // var  subActivityMasterId = $scope.getSubActivityMasterId(name)
       // alert(subActivityMasterId)
       // return
        var t = $("#subactivityMasterId" + curID).val();
        if (t != null && t != '' && t != '-1') {
            $("#noOfHours_" + curID).removeAttr("readonly");
        } else {
            $("#noOfHours_" + curID).attr('readonly', 'readonly');
        }
        */
    }

    $scope.doChangeNoOfhrs = function () {
        //alert("called hours")
        var size = $scope.ts_row;
        var finalStatus = document.getElementById("status").innerHTML;
        var attHrs = document.getElementById("attHours").innerHTML
        var flag = $scope.editFlag;
        var timeSheetEmpId = $scope.timeSheetEmployeeId
        var noOfHours;
        var hrsArr;
        var attArr;
        var text = "";
        var tot = 0;
        var atttot = 0;

        for (var i = 0; i < size; i++) {
            noOfHours = document.getElementById("noOfHoursForRow_"+i).value;
            if (noOfHours != '') {
                // alert(noOfHours.match(/^(\d{1,2}):(\d{2})([ap]m)?$/))
                if (noOfHours.match(/^(\d{1,2}):(\d{2})([ap]m)?$/) == null) {
                    //text = "no Of hours should be in HH:MM format";
                    showAlert("Enter time correctly in the record no. " + idx+1)
                    //showAlert(text);
                } else {
                    var s = noOfHours.split(':');
                    if (23 < s[0] || s[0] < 00 || s[0].length < 2 || 59 < s[1] || s[1] < 00 || s[1].length < 2) {
                        //text += "\n noOfhours should be not be more than 23:59.";
                        showAlert("Enter time correctly in the record no. " + idx+1)
                        //showAlert(text);
                    }
                    if (s[0] == 00 && s[1] == 00) {
                        //text += "\n noOfhours should be not be more than 23:59.";
                        //showAlert(text);
                        showAlert("Enter time correctly in the record no. " + idx+1)
                    }
                }
            }
            if (noOfHours.length > 0) {
                hrsArr = noOfHours.split(':');
                noOfHours = Number(hrsArr[0]) * 60 + Number(hrsArr[1]);
                tot = tot + noOfHours;
            }
        }
        if (attHrs.length > 0) {
            attArr = attHrs.split(':');
            attHrs = Number(attArr[0]) * 60 + Number(attArr[1]);
            atttot = atttot + attHrs;
        }
        var m = tot % 60;
        var h = (tot - m) / 60;
        var HHMM = h.toString() + ":" + (m < 10 ? "0" : "") + m.toString();
        if (text == '' && (tot != 0 || flag == 'Y')) {
            if (atttot >= tot) {
                document.getElementById("totalHrs").value = HHMM;
                if (flag == 'Y' || timeSheetEmpId == '0') {
                    $("#updateBtn").show();
                    $("#sendBtn").show();

                } else {
                    $("#saveBtn").show();
                }
                $("#totalHrs").css('border-color', '');
                $("#warningID").hide();
            } else {
                document.getElementById("totalHrs").value = HHMM;
                $("#warningID").show();
                $("#warningID").html("<div class='alert alert-warning'><strong><i class='glyphicon glyphicon-warning-sign'></i></strong> Total hours should be less than or equal to actual attendance hours.</div>");
                if (flag == 'Y' && (finalStatus == 'APPROVED' || finalStatus == 'REJECTED' || finalStatus == 'CANCELLED') && finalStatus != '') {

                    // 						$("#updateBtn").hide();
                    // 						$("#sendBtn").hide();
                } else if (flag == 'Y' && finalStatus != 'APPROVED' && finalStatus != 'CANCELLATION APPROVED' && finalStatus != 'REJECTED' && finalStatus != 'CANCELLATION REJECTED' && finalStatus != 'CANCELLED' && finalStatus == 'SAVED') {

                    $("#updateBtn").show();
                    $("#sendBtn").show();
                } else {

                    $("#saveBtn").show();
                }

                $("#totalHrs").css('border-color', 'red');
            }
        } else {
            if (text != '') {

            }
        }

    }
    $scope.addGrid = function () {

        document.getElementById("removebutton").disabled = false
        //var no = parseInt(document.getElementById("countGrid").value);
        //$scope.timeSheetEmployeeChildGridList.push($scope.ts_row + 1);
        //$scope.timeSheetEmployeeChildGridList[$scope.ts_row + 1].activityMaster = {}
        //$scope.timeSheetEmployeeChildGridList[$scope.ts_row + 1].projectMaster = {}
        no = $scope.ts_row;
        $scope.ts_row++;

        // document.getElementById("projectMasterId_" + no-1).value = "-1";
        // document.getElementById("activityMasterId_" + no).value = "-1";
        // document.getElementById("subactivityMasterId_" + no).value = "-1";
        // document.getElementById("noOfHours_" + no).value = "";
        // document.getElementById("remark_" + no).value = "";
        // document.getElementById("tr" + no).style.display = '';
        // document.getElementById("countGrid").value = no + 1;
        // document.getElementById("size").value = no+1;
        $('#removebutton').attr('disabled', false);
    }
    $scope.removeGrid = function () {
        //var no = parseInt(document.getElementById("countGrid").value);
        //$scope.timeSheetEmployeeChildGridList.pop()
        //no=$scope.ts_row;
        
        if($scope.ts_row == 1 || $scope.ts_row <= $scope.oldNoOfRows){
            
        }
        
        else{

           
            $scope.ts_row--;
            if($scope.ts_row == 1 || $scope.ts_row <= $scope.oldNoOfRows){
                document.getElementById("removebutton").disabled = true
            }
            //var grisSize = parseInt(document.getElementById("size").value);
            // var n = parseInt(no) - 1;
            $scope.timeSheetEmployeeChildGridList.pop()
        }

        
       
        
        /* if (no >= n) {
             document.getElementById("projectMasterId_" + no).value = "-1";
             document.getElementById("activityMasterId_" + no).value = "-1";
             document.getElementById("subactivityMasterId_" + no).value = "-1";
             document.getElementById("noOfHours_" + no).value = "";
             document.getElementById("remark_" + no).value = "";
             document.getElementById("tr_" + no).style.display = 'none';
             no = parseInt(no) - 1;
             document.getElementById("countGrid").value = no;
             if (grisSize == no)
                 $('#removebutton').attr('disabled', 'disabled');
         } else {
             $('#removebutton').attr('disabled', 'disabled');
 
         }*/
    }

    $scope.sendForApproval = function (sendfrom) {
        var text = "";
       
        text = $scope.validate();
        if(text != ""){
            showAlert(text)
            return;
        }
        
        var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to Send For Approval?', //Message
        });
        confirmPopup.then(function(res){
            $ionicLoading.show()
            $timeout(function () {
                if(res){
                    var fd = new FormData();
                    fd.append("menuId",$scope.menuId)
                    fd.append("companyId",$scope.companyId)
                    fd.append("reporteeId",$scope.empId)
                    fd.append("date",$scope.date)
                    
                    if(sendfrom=='add'){
                        fd.append("fromEditPage","add")
                    }else if(sendfrom=='edit'){
    
                        fd.append("fromEditPage","Y")
                        fd.append("timeSheetEmployeeId",$scope.timeSheetEmployeeId)
                    }
                    fd.append("onBehalfFlag","N")
                    fd.append("level","1")
                    $scope.timeSheetEmployeeChildGridList.length = $scope.ts_row;
                    $scope.jsonList =  JSON.stringify($scope.timeSheetEmployeeChildGridList);
                    fd.append("timeSheetEmployeeChildGridList",$scope.jsonList);
                    $.ajax({
                        url: (baseURL + '/timeSheet/TimeSheetEmployeeDaily/sendForApproval.spr'),
                        data: fd,
                        type: 'POST',
                        async:false,
                        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                        processData: false, // NEEDED, DON'T OMIT THIS
                        headers: {
                            'Authorization': 'Bearer ' + jwtByHRAPI
                         },
                        success : function(success) {
                            //alert("scuc")
                            if (!(success.clientResponseMsg=="OK")){
                                        console.log(success.clientResponseMsg)
                                        handleClientResponse(success.clientResponseMsg,"uploadFileReviewerAjax")
                                        $ionicLoading.hide()
                                        showAlert(success.clientResponseMsg)
                                        //$scope.redirectOnBack();
                                        return
                                    }	
                                    $ionicLoading.hide()
                                    showAlert("Sent for approval successfully")
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
        
                    
                }else{
                    $ionicLoading.hide();
                }
            },200)
            
        })
        
    } 

    $scope.setDate = function () {
        var date;

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
                document.getElementById('date').value = $filter('date')(date, 'dd/MM/yyyy');
                $scope.date = $filter('date')(date, 'dd-MM-yyyy');
                document.getElementById('totalHrs').value = ""
                $scope.init();

				if (!$scope.$$phase)
                    $scope.$apply()

            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
    }
    $scope.redirectOnBack = function(){
        $rootScope.dateTransferFromTimesheetList = $scope.date
        $state.go('requestTimesheetEmployeeDailyList')
    }

    $scope.timeFormat = function(idx){
       //alert("raj change")
        if($scope.dataFilledOver == false){
            //return
        }
        var filledTime = document.getElementById("noOfHoursForRow_"+idx).value
        var fillSplit = filledTime.split('')
        if(fillSplit.length > 2){
            if(!(fillSplit.includes(":"))){
               fillSplit.splice(2,0,":")
               var formattedTime = fillSplit.join('')
               document.getElementById("noOfHoursForRow_"+idx).value = formattedTime
                
            }
        }
       
    }



    $scope.timeLostFocus = function(idx){
        //alert("raj change")
        
         var filledTime = document.getElementById("noOfHoursForRow_"+idx).value
         hh = filledTime.substring(0,2);
         mm =filledTime.substring(3,5)
         //alert(hh+ "   " +mm)
         if (filledTime.length != 5 || isNaN(hh)  || isNaN(mm) ){
            showAlert("Enter time correctly in the record no. " + idx+1)
            return
         }
         if(hh > "23"  || mm > "59")
         {
            showAlert("Enter time correctly in the record no. " + idx+1)
            return
         }
        
     }
 
 
$scope.init();

});