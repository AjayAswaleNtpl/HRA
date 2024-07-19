mainModule.controller('addTrainingRequestCtrl', function ($scope, $rootScope, $timeout, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading) {
    

    $rootScope.navHistoryPrevPage = "requestTrainingRequestList"
    $scope.empId = sessionStorage.getItem("empId")
    
    $scope.selectedValues = {}
    $scope.selectedValues.tt = "-1"
    $scope.init = function () {
        $ionicLoading.show();

        $timeout(function () {
            var fd = new FormData();

            //fd.append("empId",$scope.employeeId)
            fd.append("buttonRights", "Y-Y-Y-Y")
            fd.append("menuId", "637")

            $.ajax({
                url: (baseURL + '/training/trainingRequest/addTrainingRequest.spr'),
                data: fd,
                type: 'POST',
                async: false,
                timeout: commonRequestTimeout,
                contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
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
                        $scope.redirectOnBack();
                        return
                    }
                    $timeout(function () {
                    $scope.trainingTypeList = success.trainingTypeList
                    
                    $scope.lndYearId = success.lndYearId
                    $scope.companyId = success.companyId
                    $scope.bandDetailId = success.bandDetailId[0]
                    $scope.gradeId = success.gradeId[0]
                    $scope.locationId = success.locationId
                    $ionicLoading.hide();
                    document.getElementById("trainingTypeId").text = "Please select"

                    $scope.trainingTypeId = "-1"
                    $scope.trainingSubCategary = "-1"
                    $scope.training ="-1"
                    
                }, 500);

                    
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


    $scope.redirectOnBack = function () {
        $state.go('requestTrainingRequestList')
    }

    $scope.init();


    $scope.doOnChangeType = function () {
        $("#trainingCategary").empty();
        $("#trainingSubCategary").empty();
        var e = document.getElementById("trainingTypeId");
        var selected = e.options[e.selectedIndex].value;
        selected = selected.replace("string:","")
        $scope.trainingTypeId = selected

        $.ajax({
            url: baseURL+"/onBoarding/onBoardingFeedback/getCatListByTypeId.spr",
            data: { 'traininTypeId': selected },
            type: 'POST',
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
            },
            success: function (result) {
                if (result != '') {
                    $("#trainingCategary").append($('<option></option>').val('-1').html("--Select--"));
                    $.each(result, function (val, text) {

                        $("#trainingCategary").append($('<option></option>').val(val).html(text));
                    });
                    $("#trainingCategary").trigger("chosen:updated");
                }
            }
        });

    }

    $scope.doOnChangeCat = function () {
        $("#trainingSubCategary").empty();
        /* var select = $("#traininSubCatId"+idx)[0];
        var selectedCat = document.getElementById("traininCatId_"+idx).value; */
        var e = document.getElementById("trainingCategary");
        var selectedCat = e.options[e.selectedIndex].value;
        selectedCat = selectedCat.replace("string:","")
        $scope.trainingCategary = selectedCat

        $.ajax({
            url: baseURL+"/onBoarding/onBoardingFeedback/getSubCatListByCatId.spr",
            data: { 'traininCatId': selectedCat },
            type: 'POST',
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
            },
            success: function (result) {
                if (result != '') {
                    $("#trainingSubCategary").append($('<option></option>').val('-1').html("--Select--"));
                    $.each(result, function (val, text) {
                        $("#trainingSubCategary").append($('<option></option>').val(val).html(text));
                    });

                    $("#trainingSubCategary").trigger("chosen:updated");
                }
            }
        });

    }



    $scope.sendForApproval = function () {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure',
        template: 'Do you want to send for Approval?', //Message
        });
        confirmPopup.then(function (res) {
            if (res) {
                $ionicLoading.show()
                $scope.submitForm()            
            } else {
                
            return;
        }
        });
    }



    $scope.submitForm = function(){
        var empId = sessionStorage.getItem("empId");
        var menuId = "637"

        

        var e = document.getElementById("trainingSubCategary");
        var selected = e.options[e.selectedIndex].value;
        selected = selected.replace("string:","")
        $scope.training = selected


        var applicantRemarks = document.getElementById("applicantRmks").value;


        if ($scope.trainingTypeId == -1) {
            showAlert("Please select Training Type ");
            $ionicLoading.hide()
            return;
        } else if ($scope.trainingCategary == -1) {
            $ionicLoading.hide()
            showAlert("Please select Training Category ");
            return;
        } else if ($scope.training == -1) {
            $ionicLoading.hide()
            showAlert("Please select Training  ");
            return;            
        } else if (applicantRemarks == "") {
            $ionicLoading.hide()
            showAlert("Please enter Applicant Remark ");
            return;
        } else {
            
            var empId = $scope.empId;
            var flag = false;
            var menuId = "637";
            var today =  new Date();;
            today = today.getDate() +"/"+ today.getMonth() +"/"+ today.getFullYear() 
                

                // $.ajax({
                //     url: baseURL +"/masters/groupMaster/findWorkFlowIsDefined.spr",
                //     data: {
                //         'empId': empId,
                //         'menuId': menuId,
                //         'applicationDate': today
                //     },
                //     type: 'POST',
                //     async: false,
                //     dataType: 'text',
                //headers: {
                  //  'Authorization': 'Bearer ' + jwtByHRAPI
                //},
                //     success: function (result) {
                //         if (result != "" && result != null) {
                //             showAlert(result );
                //             flag = false;
                //              return       
                //         } else {

                //             flag = true;
                //         }
                //     },

                // });
                var fd = new FormData()
                fd.append("companyId",$scope.companyId)
                fd.append("lndYearId",$scope.lndYearId)
                fd.append("employeeId","[" + $scope.empId + "]")
                fd.append("trainingTypeId",$scope.trainingTypeId)
                fd.append("applicantRemarks",applicantRemarks)
                fd.append("trainingCategary",$scope.trainingCategary)
                fd.append("trainingSubCategary",$scope.training)
                fd.append("bandDetailId",$scope.bandDetailId)
                fd.append("gradeId",$scope.gradeId)

                fd.append("buttonRights", "Y-Y-Y-Y")
                fd.append("menuId", "637")
                fd.append("level", "1")

                $.ajax({
                    url: baseURL + '/training/trainingRequest/sendForApprove.spr',
                    data: fd,
                    type: 'POST',
                    async: false,
                    timeout: commonRequestTimeout,
                    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                    processData: false, // NEEDED, DON'T OMIT THIS
                    headers: {
                        'Authorization': 'Bearer ' + jwtByHRAPI
                    },
                    success: function (success) {
                        //alert("scuc")
                        // if (!(success.clientResponseMsg == "OK")) {
                        //     console.log(success.clientResponseMsg)
                        //     handleClientResponse(success.clientResponseMsg, "/training/trainingRequest/sendForApprove.spr")
                        //     $ionicLoading.hide()
                        //     showAlert("Something went wrong. Please try later.")
                        //     //$scope.redirectOnBack();
                        //     return
                        // }
                        if (success =="ERROR"){
                            showAlert("Something went wrong. Please try later.")
                        }else{
                            showAlert(success)
                        }
                        $scope.redirectOnBack()
                        $ionicLoading.hide()
                    },
                    error: function (e) { //alert("Server error - " + e);
                        //alert(e.status)
                        $ionicLoading.hide()
                        $scope.data_return = { status: e };
                        commonService.getErrorMessage($scope.data_return);
    
                    }
                });

            
        }
    }





})