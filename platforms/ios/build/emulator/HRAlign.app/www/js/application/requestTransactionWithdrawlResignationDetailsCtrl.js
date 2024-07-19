mainModule.controller('requestTransactionWithdrawlResignationDetailsCtrl', function($scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading,$filter) {
    $rootScope.navHistoryPrevPage = "requestTransactionList"
    $scope.selectedValue={}
    $scope.init=function(){
        $ionicLoading.show();
        $timeout(function () {
            var tran = $rootScope.requestTransDetailToSend
            var transactionId = ""+tran.transactionId
            var companyId = ""+tran.companyId
            var transactionTypeId = ""+tran.transTypeId
            var status = tran.status
            $scope.canellation = status
             $scope.wefDate = tran.wefDate

            
            var fd = new FormData();
           
            //fd.append("empId",$scope.employeeId)
            fd.append("buttonRights","Y-Y-Y-Y")
            //fd.append("msg","0")
          // fd.append("message","")
            fd.append("menuId","1005")
            fd.append("transactionId",transactionId)
            fd.append("companyId",companyId)
            fd.append("transactionTypeId",transactionTypeId)
            fd.append("cancellation",status)
           
            $.ajax({
                url: (baseURL + '/transaction/transactionRequisition/viewTransEmailAbscondingDetails.spr'),
                data: fd,
                type: 'POST',
                async:false,
                timeout:10000,
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
                            $timeout(function () {
                               // $scope.transRequisitionForm = success.transRequisitionForm
                               $scope.transaction = success.transRequisitionForm
                             
                            //    document.getElementById("lwd").innerHTML = $scope.toDateStringForm($scope.transaction.lwd)
                            //    if(document.getElementById("initialLwdDate")){
                            //     document.getElementById("initialLwdDate").innerHTML = $scope.toDateStringForm($scope.transaction.initialLwdDate)

                            //    }
                            //    if($scope.transaction.requestedDate){
                            //     document.getElementById("requestedDate").innerHTML = $scope.toDateStringForm($scope.transaction.requestedDate)

                            //    }

                                $ionicLoading.hide();
                               // $scope.AprvlwdStrCon = success.AprvlwdStrCon


                            },200)



                            //[ut
                        //     $timeout(function () {
                        //         console.log(new Date()+"starting")
                        //     $scope.buttonRights = success.buttonRights
                        //     $scope.close = success.close
                        //     $scope.menuId = success.menuId
                        //     $scope.updatedIdName = success.updatedIdName
                        //     $scope.transRequisitionForm = success.transRequisitionForm
                        //     $scope.art = success.ArtEmps
                        //     $scope.frt = success.FrtEmps
                        //     $scope.oldCtc = success.oldCTC
                        //     $scope.listCountry = success.listCountry
                        //     $scope.oldCountryName = success.countryNameOld
                        //     $scope.listDesignation = success.listDesignation
                        //     $scope.transRequisitionForm.transVO.company.companyId =$scope.transRequisitionForm.transVO.company.companyId+""
                        //     $scope.transRequisitionForm.transVO.jpId.jpIdTo = $scope.transRequisitionForm.transVO.jpId.jpId+""
                        //     $scope.transRequisitionForm.transVO.location.locationId=$scope.transRequisitionForm.transVO.location.locationId+""
                        //     $scope.transRequisitionForm.transVO.designation.designationId =$scope.transRequisitionForm.transVO.designation.designationId+""
                        //     $scope.transRequisitionForm.transVO.employeeCategory.employeeCategoryId=$scope.transRequisitionForm.transVO.employeeCategory.employeeCategoryId+""
                        //     $scope.transRequisitionForm.transVO.employeeType.employeeTypeId = $scope.transRequisitionForm.transVO.employeeType.employeeTypeId+""
                        //     $scope.transRequisitionForm.transVO.leaveCategory.leaveCategoryId = $scope.transRequisitionForm.transVO.leaveCategory.leaveCategoryId+""
                        //     $scope.transRequisitionForm.transVO.holidayCategory.holidayCategoryId = $scope.transRequisitionForm.transVO.holidayCategory.holidayCategoryId+""
                        //     $scope.transRequisitionForm.artCompanyId = $scope.transRequisitionForm.artCompanyId+""
                        //     $scope.transRequisitionForm.artEmpId =$scope.transRequisitionForm.artEmpId+""
                        //     $scope.transRequisitionForm.frtCompanyId = $scope.transRequisitionForm.frtCompanyId+""
                        //     $scope.transRequisitionForm.frtEmpId = $scope.transRequisitionForm.frtEmpId+""
                          
                               
                            
                            
                        //         $timeout(function () {
                        //             var des = document.getElementById("designationList")
                        //             for(var i=0;i<des.options.length;i++){
                        //                 if(des.options[i].value==$scope.transRequisitionForm.transVO.designation.designationId){
                        //                     document.getElementById("designationList").options[i].selected = true
                        //                 }
                        //             }
                        //         for(var i = 0;i<$scope.transRequisitionForm.empLevelsAppliVOList;i++){
                        //             document.getElementById("departmentList_"+i).options.selectedIndex = 1
                        //         }
                        //     },200)
                           


                        //     // if (!$scope.$$phase){
                        //     //     $scope.$apply()
                        //     // }
                        //     $ionicLoading.hide();
                        //     //document.getElementById("mainDiv").style.visibility = "visible"
                        //     console.log(new Date()+"ending")
                        // },2000)

                            // $timeout(function () {
                            //     for(let key of Object.keys($scope.transRequisitionForm.companyList)){
                            //         if($scope.transRequisitionForm.eisPersonal.company.companyName ==$scope.transRequisitionForm.companyList[key] ){
                            //             document.getElementById("companyList").options.selectedValue = key
                            //         }
                            //     }
                            // },200)
                            
                           
                           
                            
    
                           
                         
                           
    
    
                            
                            
                },
                error: function (e) { //alert("Server error - " + e);
                //alert(e.status)
                        $ionicLoading.hide()
                       $scope.data_return = {status: e};
                    commonService.getErrorMessage($scope.data_return);
                    
                       }				
                });	
            },500);		
    
    }
    $scope.redirectOnBack=function(){
        $state.go('requestTransactionList')
    }
    $scope.toDateStringForm=function(datee){
        var date = new Date(datee);
        var day = date.getDate();
        var month = date.getMonth()+1;
        var year = date.getFullYear()
        if(day<10){
            day = '0'+day
        }
        if(month < 10){
            month = '0'+month
        }
        var finalDate = day + "/" + month + "/" + year
        return finalDate;

    }
   

    $scope.openFile1 = function(transRequi){
		
		
        //event.stopPropagation();
       
        //alert(fileId)
        var fd = new FormData();
        fd.append("transactionId",transRequi.transactionId+"")
        
        
        $.ajax({
                url: baseURL + '/transaction/transactionRequisition/downloadFile.spr',
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
   
    $scope.openFile2 = function(transRequi){
		
		
        //event.stopPropagation();
        
        //alert(fileId)
        var fd = new FormData();
        fd.append("transactionId",transRequi.transactionId+"")
        
        
        $.ajax({
                url: baseURL + '/transaction/transactionRequisition/openFile.spr',
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
        event.stopPropagation();
      }
    $scope.init();
})