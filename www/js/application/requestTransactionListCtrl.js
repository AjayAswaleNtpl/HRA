mainModule.controller('requestTransactionListCtrl', function ($scope, $rootScope, $timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading) {

    //$scope,$rootScope,$timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading
    $scope.searchObj = {}
    $rootScope.navHistoryPrevPage = "requisitionNew"
    $scope.init = function () {
        $ionicLoading.show();
        $timeout(function () {
            var fd = new FormData();

            //fd.append("empId",$scope.employeeId)
            fd.append("buttonRights", "Y-Y-Y-Y")
            //fd.append("msg","0")
            fd.append("message", "")
            fd.append("menuId", "1005")
            fd.append("rejectConfirm", "")
            fd.append("disableHeader", "")
            fd.append("workFlowApprovalFlag", "")
            fd.append("workFlowRequestFlag", "")
            $.ajax({
                url: (baseURL + '/transaction/transactionRequisition/viewTransactionRequisition.spr'),
                data: fd,
                type: 'POST',
                async: false,
                timeout: commonRequestTimeout,
                contentType: false,
                // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                processData: false, // NEEDED, DON'T OMIT THIS
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                },
                success: function (success) {
                    //alert("scuc")
                    if (!(success.clientResponseMsg == "OK")) {
                        console.log(success.clientResponseMsg)
                        handleClientResponse(success.clientResponseMsg, "uploadFileReviewerAjax")
                        $ionicLoading.hide()
                        showAlert("Something went wrong. Please try later.")
                        //$scope.redirectOnBack();
                        return
                    }

                    $scope.selfTransactionList = success.selfTransactionList

                    // for(i=0;i<$scope.selfTransactionList.length;i++){
                    //     if($scope.selfTransactionList[i].transTypeId==6){
                    //         $scope.resig = "resig"
                    //     }
                    //     else if($scope.selfTransactionList[i].transTypeId==15){
                    //         $scope.withdraw = "withdraw"
                    //         if($scope.selfTransactionList[i].status == "APPROVED"){
                    //             $scope.resig = "noresig"
                    //         }
                    //     }
                    // }

                    if (!$scope.$$phase) {
                        $scope.$apply()
                    }


                    $timeout(function () {
                        for (i = 0; i < $scope.selfTransactionList.length; i++) {
                            var remark = $scope.selfTransactionList[i].comment
                            remark = $scope.selfTransactionList[i].comment.replace(/&#13;/g, "\n")
                            remark = $scope.selfTransactionList[i].comment.replace(/&#10;/g, "\n")
                            remark = $scope.selfTransactionList[i].comment.replace(/<br>/g, "\n")
                            remark = $scope.selfTransactionList[i].comment.replace(/<BR>/g, "\n")
                            document.getElementById("comment_" + i).innerHTML = remark
                            var emp = document.getElementById("emp_" + i).innerHTML
                            document.getElementById("emp_" + i).innerHTML = emp + $scope.selfTransactionList[i].empCode
                            var index = 0

                            $scope.getPhoto(i)


                        }
                    }, 200)

                    $scope.getAllowedTransactions()

                    //$ionicLoading.hide();

                },
                error: function (e) { //alert("Server error - " + e);
                    //alert(e.status)
                    $ionicLoading.hide()
                    $scope.data_return = { status: e };
                    commonService.getErrorMessage($scope.data_return);

                }
            });
        }, 500);

    }

    $scope.getAllowedTransactions = function () {
        var fdata = new FormData();
        var empId = sessionStorage.getItem('empId')
        //fd.append("empId",$scope.employeeId)
        fdata.append("buttonRights", "Y-Y-Y-Y")
        fdata.append("menuId", "1005")
        fdata.append("transEmpId", empId)
        $.ajax({
            url: (baseURL + '/transaction/transactionRequisition/viewTransRequisition.spr'),
            data: fdata,
            type: 'POST',
            async: false,
            timeout: commonRequestTimeout,
            contentType: false,
            // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
            },
            success: function (success) {
                $ionicLoading.hide()
                if (success.transAllowedTransactions[6]) {
                    $scope.showResigButton = 'true'
                } else {
                    $scope.showResigButton = 'false'
                }
                if (success.transAllowedTransactions[15]) {
                    $scope.showWithdrawResigButton = 'true'
                } else {
                    $scope.showWithdrawResigButton = 'false'
                }
            },
            error: function (e) { //alert("Server error - " + e);
                //alert(e.status)
                $ionicLoading.hide()
                $scope.data_return = { status: e };
                commonService.getErrorMessage($scope.data_return);

            }
        });
    }


    $scope.openTransactionDetailss = function (idx, transaction) {
        var transactionId = transaction.transactionId
        var companyId = transaction.companyId
        var transactionTypeId = transaction.transTypeId
        var empId = transaction.empId
        var wefDate = transaction.wefDate
        var status = transaction.status

        if (transactionTypeId == 6) {
            $rootScope.requestTransDetailToSend = transaction
            $state.go('requestTransactionDetailsResignation')

        }
        else if (transactionTypeId == 15) {
            $rootScope.requestTransDetailToSend = transaction
            $state.go('requestTransactionWithdrawlResignationDetails')
        }


    }
    $scope.raiseResignation = function () {
        $state.go('requestTransactionResignationForm')
    }
    $scope.raiseWithdrawl = function () {

        $scope.checkWithdrawalARTAssigned()

    }

    $scope.checkWithdrawalAllowed = function () {

        var fd = new FormData();

        var empId = sessionStorage.getItem('empId')
        fd.append("empId",empId)

        //withdrawal of resignation is 15
        fd.append("transactionTypeId", 15)

        $.ajax({
            url: (baseURL + '/transaction/transactionRequisition/checkExistInprocessTransaction.spr'),
            data: fd,
            type: 'POST',
            async: false,
            timeout: commonRequestTimeout,
            contentType: false,
            // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
            },
            success: function (success) {
                
                if (success) {
                    showAlert("Selected transaction is already in process.")
                } else {
                    $state.go('requestTransactionWithdrawlResignationForm')
                }

            },
            error: function (e) { //alert("Server error - " + e);
                alert(e.status)
                $ionicLoading.hide()
                $scope.data_return = { status: e };
                commonService.getErrorMessage($scope.data_return);

            }
        });
    }


    $scope.checkWithdrawalARTAssigned = function () {

        var fd = new FormData();

        var empId = sessionStorage.getItem('empId')
        fd.append("transactionEmployeeEmpId",empId)

        //withdrawal of resignation is 15
        fd.append("transAllowedTransactionId", 15)

        $.ajax({
            url: (baseURL + '/transaction/transactionRequisition/workflowValidationcheck.spr'),
            data: fd,
            type: 'POST',
            async: false,
            timeout: commonRequestTimeout,
            contentType: false,
            // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
            },
            success: function (success) {
                if (!(success.clientResponseMsg == "OK")) {
                    console.log(success.clientResponseMsg)
                    handleClientResponse(success.clientResponseMsg, "uploadFileReviewerAjax")
                    $ionicLoading.hide()
                    showAlert("Something went wrong. Please try later.")
                    //$scope.redirectOnBack();
                    return
                }
                if (success.msg) {
                    showAlert(success.msg)
                } else {
                    $scope.checkWithdrawalAllowed()
                }

            },
            error: function (e) { //alert("Server error - " + e);
                alert(e.status)
                $ionicLoading.hide()
                $scope.data_return = { status: e };
                commonService.getErrorMessage($scope.data_return);

            }
        });
    }


    $scope.getPhoto = function (index) {

        if ($scope.selfTransactionList[index] === undefined) {
            return
        }

        $scope.selfTransactionList[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + $scope.selfTransactionList[index].empId
        return
    }

    $scope.redirectOnBack = function () {
        $state.go('app.requestMenu')
    }


    $scope.init();
})