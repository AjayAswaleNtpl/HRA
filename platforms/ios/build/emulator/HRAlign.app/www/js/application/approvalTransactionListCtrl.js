mainModule.controller('approvalTransactionListNewCtrl', function($scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading) {

/* 4=EarlySeparation,5=Termination,6=Resignation,7=Retirement,8=Death,13=VRS,18=TerminationofContract */
/* 17=Absconding,15=WithdrawalofResignation */
/* 11=ExtensionofProbation */
/* 10=SalaryRevision */
/* 1=Promotion,2=Transfer,3=Confirmation,9=Secondment,14=TemporaryTransfer,16=ReHire 0=Joining */ /* add by shilpa */
//$scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading
$scope.searchObj = {}    
$rootScope.navHistoryPrevPage = "approvalsNew"
$scope.init = function(){
        $ionicLoading.show();
        $timeout(function () {
        var fd = new FormData();
       
        //fd.append("empId",$scope.employeeId)
        fd.append("buttonRights","Y-Y-Y-Y")
        //fd.append("msg","0")
       fd.append("message","")
        fd.append("menuId","1005")
        fd.append("rejectConfirm","")
        fd.append("disableHeader","")
       fd.append("workFlowApprovalFlag","")
       fd.append("workFlowRequestFlag","")
        $.ajax({
            url: (baseURL + '/transaction/transactionRequisition/viewTransactionRequisition.spr'),
            data: fd,
            type: 'POST',
            async:false,
            timeout: commonRequestTimeout,
            contentType: false,
             // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
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
                       
                        $scope.transRequi = success.reporteeTransRequiList

                        if (!$scope.$$phase){
                            $scope.$apply()
                        }
                               

                                $timeout(function () {
                                    for(i=0;i<$scope.transRequi.length;i++){
                                        var remark = $scope.transRequi[i].comment
                                        remark = $scope.transRequi[i].comment.replace(/&#13;/g, "\n")
                                        remark = $scope.transRequi[i].comment.replace(/&#10;/g, "\n")
                                        remark = $scope.transRequi[i].comment.replace(/<br>/g, "\n")
                                       remark = $scope.transRequi[i].comment.replace(/<BR>/g, "\n") 
                                       document.getElementById("comment_"+i).innerHTML = remark
                                       var emp = document.getElementById("emp_"+i).innerHTML
                                       document.getElementById("emp_"+i).innerHTML = emp +$scope.transRequi[i].empCode
                                       var index = 0
            
                                        $scope.getPhoto(i)
                                            
              
                                    }
                                },200)
                       
                       
                        $ionicLoading.hide();

                       
                     
                       


                        
                        
            },
            error: function (e) { //alert("Server error - " + e);
            alert(e.status)
                    $ionicLoading.hide()
                   $scope.data_return = {status: e};
                commonService.getErrorMessage($scope.data_return);
                
                   }				
            });	
        },500);		

    }
    
    $scope.openTransactionDetails = function(idx,transaction){
        var transactionId = transaction.transactionId
        var companyId = transaction.companyId
        var transactionTypeId = transaction.transTypeId 
        var empId = transaction.empId
        var wefDate = transaction.wefDate
        var status = transaction.status

        if(transactionTypeId==6 || transactionTypeId==7 || transactionTypeId==8 || transactionTypeId==5 || transactionTypeId==4
            || transactionTypeId==13 || transactionTypeId==18)
           {
            $rootScope.transDetailToSend = transaction
            $state.go('transactionDetailsViewTransEmailResignation')
               
           }
           else if(transactionTypeId==1 || transactionTypeId==2 || transactionTypeId==3 || transactionTypeId==9 || transactionTypeId==14 || transactionTypeId==16 ||  transactionTypeId==20  ||  transactionTypeId==21){
            $rootScope.transDetailToSend = transaction
            $state.go('transactionDetailsViewTransEmailConfirmation')
           }
           else if(transactionTypeId==15  || transactionTypeId==17){
            $rootScope.transDetailToSend = transaction
            $state.go('transactionDetailsViewTransEmailAbsconding')
           }
           else if(transactionTypeId==11){
            $rootScope.transDetailToSend = transaction
            $state.go('transactionDetailsViewTransEmailExtensionOfProbation')
           }
           else if(transactionTypeId==12){
            $rootScope.transDetailToSend = transaction
            $state.go('transactionDetailsViewTransEmailRedesignation')
           }
           else if(transactionTypeId==10){
            $rootScope.transDetailToSend = transaction
            $state.go('transactionDetailsViewTransEmailSalaryRevisionDetails')
           }

    }
    $scope.getPhoto = function (index) {
        
        if ($scope.transRequi[index] === undefined) {
          return
        }
    
        $scope.transRequi[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + $scope.transRequi[index].empId
        return
      }
    
    $scope.redirectOnBack = function(){
        $state.go('app.approvalsMenu')
    }


    $scope.init();
})