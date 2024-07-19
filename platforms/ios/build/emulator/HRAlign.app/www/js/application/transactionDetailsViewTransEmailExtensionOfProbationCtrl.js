mainModule.controller('transactionDetailsViewTransEmailExtensionOfProbationCtrl', function($scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading,$filter) {
    $rootScope.navHistoryPrevPage = "approvalsTransactionList"
    $scope.selectedValues = {}
    var tran = $rootScope.transDetailToSend
    var transactionId = ""+tran.transactionId
    var companyId = ""+tran.companyId
    var transactionTypeId = ""+tran.transTypeId
    var status = tran.status
    $scope.canellation = status
     $scope.wefDate = tran.wefDate
     $scope.init=function(){
        $ionicLoading.show();
        $timeout(function () {
            var tran = $rootScope.transDetailToSend
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
                url: (baseURL + '/transaction/transactionRequisition/viewTransEmailExtensionofProbation.spr'),
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
                                $scope.transRequisitionForm = success.transRequisitionForm
                                
                               
                                $scope.getCountOfLevel = success.getCountOfLevel
                                $scope.getCountOfAppNme = success.getCountOfAppNme
                                $scope.getCountOfComments = success.getCountOfComments
                                $scope.currentWkFlwLevel = success.currentWkFlwLevel
                                $scope.cancellation = success.cancellation
                                document.getElementById("probationDays").value = $scope.transRequisitionForm.transVO.probationDays
                                document.getElementById("extendDate").value = $scope.transRequisitionForm.extendDate
                                
                                $ionicLoading.hide();
                               // $scope.AprvlwdStrCon = success.AprvlwdStrCon


                            },200)
                           

                            
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
    $scope.goSave=function(apprOrRej){
        var fd  = new FormData()
        fd.append("menuId","1005")
        fd.append("buttonRights","Y-Y-Y-Y")
        if(apprOrRej=='A'){
            fd.append("status","A")

        }else{
            fd.append("status","R")
        }
        fd.append("probCompDate",$scope.transRequisitionForm.probCompDate)
        fd.append("extendDate",document.getElementById("extendDate").value);
        fd.append("probationDays",document.getElementById("probationDays").value + "")
        fd.append("empId",$scope.transRequisitionForm.eisPersonal.empId);
        fd.append("transactionTypeId",$scope.transRequisitionForm.transactionTypeId)
        fd.append("transactionId",$scope.transRequisitionForm.transactionId)
        fd.append("wef",$scope.toDateStringForm($scope.transRequisitionForm.transVO.wef))
        fd.append("transAuthId",$scope.transRequisitionForm.transAuthVO.transAuthId)
       // fd.append("getTotalCTC",parseFloat(document.getElementById("payableAmount").value))

        var transVOToSend = {}
        transVOToSend.remarks = $scope.transRequisitionForm.transVO.remarks
        fd.append("transVOtemp",JSON.stringify(transVOToSend))

        var transAuthVOToSend = {}
        transAuthVOToSend.transAuthId = $scope.transRequisitionForm.transAuthVO.transAuthId
        transAuthVOToSend.comments = document.getElementById("comments").value 
        if(apprOrRej=="A"){
            transAuthVOToSend.status = "A"
        }else{
            transAuthVOToSend.status = "R"
        }
        fd.append("transAuthVOTemp",JSON.stringify(transAuthVOToSend))
        
        if(apprOrRej == "A"){
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to Approve ?', //Message
            });
        }else{
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure',
                template: 'Do you want to Reject ?', //Message
            });
        }
        confirmPopup.then(function(res){
            if(res){
            $.ajax({
                url: (baseURL + '/transaction/transactionRequisition/processExtensionofProbationRequisition.spr'),
                data: fd,
                type: 'POST',
                async:false,
                timeout: 120000,
                contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                processData: false, // NEEDED, DON'T OMIT THIS
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                 },
                success : function(success) {
                    if(!(success.clientResponseMsg=="OK")){
                        console.log(success.clientResponseMsg)
                        handleClientResponse(success.clientResponseMsg,"uploadFileReviewerAjax")
                        $ionicLoading.hide()
                        
                        showAlert("Something went wrong. Please try later.")
                        //$scope.redirectOnBack();
                        return
                    }
                    //alert("scuc")
                    if(apprOrRej=="A"){
                        showAlert("Approved Successfully")
                    }else{
                        showAlert("Rejected Successfully")
                    }
                   
                   $state.go('approvalTransactionList')
                            
                                
                },
                error: function (e) { //alert("Server error - " + e);
                //alert(e.status)
                        $ionicLoading.hide()
                       $scope.data_return = {status: e};
                    commonService.getErrorMessage($scope.data_return);
                    
                       }				
                });	
            }
            });
    



    }
    $scope.redirectOnBack=function(){
        $state.go('approvalTransactionList')
    }
     $scope.calculateRevLwd = function(){
         var probationDays = document.getElementById("probationDays").value
        var probComDays = $scope.transRequisitionForm.probCompDate
        if(probationDays !=''){
            dd1 = probComDays.substring(0,2)
            mm1 = probComDays.substring(3,5)
            yy1 = probComDays.substring(6,10)
            var date1 = new Date(mm1+"/"+dd1+"/"+yy1);
            
           var  totalDays = parseInt(date1.getDate()) + parseInt(probationDays);
            
           // date1.setDate(totalDays);
            var todayMonth = date1.getMonth() + 1;
            var todayDay = date1.getDate();
            var todayYear = date1.getFullYear();
            if(todayDay < 10){
                today = '0'+todayDay
            }
            if(todayMonth < 10){
                todayMonth = '0'+todayMonth
            }
            var todayDateText = todayDay + "/" + todayMonth + "/" + todayYear;
            
            document.getElementById("extendDate").value=todayDateText;
        }
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
    $scope.setDate = function () {
        var date;

        
            date = new Date();
       

        var options = {date: date, mode: 'date', titleText: 'Date', androidTheme: 4};
        datePicker.show(options, function (date) {
            if (date == undefined) {

            }
            else {

                $scope.fDate = date;
                document.getElementById('extendDate').value = $filter('date')(date, 'dd/MM/yyyy');
                $scope.date = $filter('date')(date, 'dd-MM-yyyy');
               // document.getElementById('totalHrs').value = ""
                //$scope.init();

                if (!$scope.$$phase)
                    $scope.$apply()

            }
        }, function (error, status) {
            $ionicLoading.hide();
        });
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