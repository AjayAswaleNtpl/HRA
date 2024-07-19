mainModule.controller('exitInterviewApplicationCtrl', function ($scope, 
    $rootScope, $ionicPopup, $state,$ionicLoading,$timeout ) {

        $rootScope.navHistoryPrevPage = "showExitInterview"
        $scope.selectedValues = {}

        $scope.empId = sessionStorage.getItem('empId');
        $scope.companyId = sessionStorage.getItem('companyId');
        $scope.menuId = 1006

        $scope.init = function(){
        
            fd = new FormData();
            fd.append("companyId",$scope.companyId)
            fd.append("empId",$scope.empId)
            fd.append("buttonRights","Y-Y-Y-Y")
            //fd.append("conMsg","")
            fd.append("menuId","1006")
        
            $.ajax({
                url: baseURL + '/transaction/exitInterview/viewExitInterview.spr',
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
                        handleClientResponse(result.clientResponseMsg,"viewExitInterviewAjaxCall")
                        $ionicLoading.hide()
                        showAlert("Something went wrong. Please try later.")
                        return
                    }	
                    
                    $scope.serverData = result;
                    $scope.srList = $scope.serverData.listReasonForLeaving

                    $ionicLoading.show()
                    $timeout(function () {
                        elemPR = document.getElementById("primaryReason")
                            rid = $scope.serverData.reasonForLeavingNew.primaryReasonId
                            rname = $scope.getReasonName(rid)
                            for(var j =0;j< $scope.serverData.listReasonForLeaving.length;j++){
                                if (rname == $scope.serverData.listReasonForLeaving[j].reasonForLeavingName){
                                    elemPR.options[j].selected = true
                                    $scope.getReasonforLeaving()
                                    break
                                }
                            }
                        
                        
                        $timeout(function () {
                            
                        elem = document.getElementById("secondaryResList")
                        if ($scope.serverData.reasonForLeavingNew.secondaryReasonId == null) {
                            $ionicLoading.hide()
                                return
                        }
                        for(var i =0;i< $scope.serverData.reasonForLeavingNew.secondaryReasonId.length;i++){
                            rid = $scope.serverData.reasonForLeavingNew.secondaryReasonId[i]
                            
                            rname = $scope.getReasonName(rid)
                            for(var j =0;j< $("#secondaryResList")[0].options.length;j++){
                                if (rname == $("#secondaryResList")[0].options[j].text){
                                    elem.options[j].selected = true
                                }
                            }
                        }
                        $ionicLoading.hide()
                        },3000)
                        
                        },1500)
                },
                        error : function(res){
                        $ionicLoading.hide()
                        showAlert("Something went wrong while fetching the file.");
                }
                    });
        
                }        


                $scope.getReasonId = function(reasonNmae){
                    for(var i=0;i<$scope.serverData.listReasonForLeaving.length;i++){
                            if($scope.serverData.listReasonForLeaving[i].reasonForLeavingName==reasonNmae){
                                return $scope.serverData.listReasonForLeaving[i].reasonForLeavingId;
                            }
                        }
                    }            

                    $scope.getReasonName = function(rid){
                        for(var i=0;i<$scope.serverData.listReasonForLeaving.length;i++){
                                if($scope.serverData.listReasonForLeaving[i].reasonForLeavingId ==rid){
                                    return $scope.serverData.listReasonForLeaving[i].reasonForLeavingName;
                                }
                            }
                        }                                

                
    $scope.getReasonforLeaving = function() {
                
                    $("#secondaryResList").empty();
                    var select = $("#secondaryResList")[0];
                    $scope.srList = $scope.serverData.listReasonForLeaving
                    
                    
                    var prName = $("#primaryReason")[0].options[$("#primaryReason")[0].options.selectedIndex].text
                    var primaryReasonSelectedID = $scope.getReasonId(prName)


                    
                    // for(var k=0;$("#secondaryResList")[0].options.length;k++){
                    //     if ($("#secondaryResList")[0].options[k].text == prName){
                    //         $("#secondaryResList")[0].remove(k)
                    //         break;
                    //     }
                    // }

                    //   return  

                    if (primaryReasonSelectedID != "-1") {
                        $
                                .ajax({
                                    url : baseURL + "/transaction/exitInterview/reasonForLeaving.spr",
                                    data : {
                                        'primaryReason' : primaryReasonSelectedID
                                    },
                                    type : 'POST',
                                    dataType : 'json',
                                    async : false,
                                    headers: {
                                        'Authorization': 'Bearer ' + jwtByHRAPI
                                     },
                                    success : function(result) {
                                        if (result != '') {
                                            $
                                                       .each(
                                                            result,
                                                            function(index) {
                                                                var reasonForLeavingId = result[index].reasonForLeavingId
                                                                var reasonForLeavingName = result[index].reasonForLeavingName;
                                                                $("#secondaryResList")
                                                                        .append(
                                                                                $(
                                                                                        '<option></option>')
                                                                                        .val(
                                                                                                reasonForLeavingId)
                                                                                        .html(
                                                                                                reasonForLeavingName));
                                                            });
                                            $("#secondaryResList")
                                                    .html(
                                                            $("#secondaryResList option")
                                                                    .sort(
                                                                            function(a, b) {
                                                                                return a.text
                                                                                        .toLowerCase() > b.text
                                                                                        .toLowerCase() ? 1
                                                                                        : -1
                                                                            }))
                                            $("select#secondaryResList").val('-1');
                                        }
                                        $('#secondaryResList').trigger('chosen:updated');
                                    }
                                });
                    }
                }


    $scope.sentMail  = function(value){
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure',
        template: 'Do you want to send the form?', //Message
        });
        confirmPopup.then(function (res) {
            if (res) {
                $ionicLoading.show()
                $scope.submitForm(value)            
            } else {
                
            return;
        }
        });
    }
    $scope.submitForm = function(value) {
            var text = "";
            document.getElementById("empId").value = $scope.empId
            document.getElementById("companyId").value = $scope.companyId
            document.getElementById("buttonRights").value = "Y-Y-Y-Y"
            document.getElementById("menuId").value =  1006

            
            

            form = document.getElementById( "form1" );

            text = $scope.validation();

            if (text == "") {
                //alert("validation succ")

            fd = new FormData(form);
            fd.append("menuId","1006")
            fd.append("companyId",$scope.companyId)
            fd.append("buttonRights","Y-Y-Y-Y")
            fd.append("empId",$scope.empId)
            fd.append("radioLabelName",$scope.serverData.radioLabelName)

            var prName = $("#primaryReason")[0].options[$("#primaryReason")[0].options.selectedIndex].text
            var primaryReasonSelectedID = $scope.getReasonId(prName)
            //document.getElementById("primaryReason").value = primaryReasonSelectedID
            fd.append("primaryReason",primaryReasonSelectedID)
            

            for(var i =0;i< $("#secondaryResList")[0].options.length;i++){
                if ($("#secondaryResList")[0].options[i].selected == true){
                    srId = $scope.getReasonId($("#secondaryResList")[0].options[i].text)
                    fd.append("secondaryResList",srId)
                }
            }
            
            
            
            
            



            var sprToCall =  ""
            if (value == "SENDTOHR"){
                sprToCall = "sentExitInterviewEmail.spr"
            }else if (value == "SAVE"){
                sprToCall = "save.spr"
            }else if (value == "UPDATE"){
                sprToCall = "save.spr"
            }
            $ionicLoading.show()

                $.ajax({
                            url: baseURL + '/transaction/exitInterview/'+sprToCall,
                            data: fd,
                            type: 'POST',
                            timeout: commonRequestTimeout,
                            contentType: false,// NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                            processData: false, // NEEDED, DON'T OMIT THIS
                            headers: {
                                'Authorization': 'Bearer ' + jwtByHRAPI
                             },
                            success : function(result) {
                                if (!(result.clientResponseMsg=="OK")){
                                    console.log(result.clientResponseMsg)
                                    handleClientResponse(result.clientResponseMsg + "  " + sprToCall)
                                    $ionicLoading.hide()
                                    showAlert("Something went wrong. Please try later.")
                                    return
                                }
                                $ionicLoading.hide()
                                if (value == "SENDTOHR"){
                                    if (result.msg =="SENT"){
                                        showAlert("Successfully sent to Hr")
                                        $scope.redirectOnBack()
                                    }else{
                                        showAlert("Something went wrong. Please try later.")
                                        $scope.redirectOnBack()
                                    }
                                }else if (value == "SAVE"){
                                    showAlert("Saved Successfully.")
                                    $scope.redirectOnBack()
                                }else if (value == "UPDATE"){
                                    showAlert("Updated Successfully.")
                                    $scope.redirectOnBack()
                                }
                            },
                            error : function(res){
                                $ionicLoading.hide()
                                showAlert("Something went wrong. Please try later.");
                                $scope.redirectOnBack()
                            }
                            });
                        // text = "Do you want to send to HR.";
                        // confirmInfoAlert("${alertHeader}", text, "NO", "YES", function(r) {
                        //     if (r) {
                        //         document.form1.action = "sentExitInterviewEmail.spr";
                        //         document.form1.submit();
                        //         tb_open_new();
                        //     }
                        // });
                    } else {
                        showAlert("All questionaries are mandatory. Please fill-up the form to continue");
                    }
                }


    
    $scope.validation = function() {
                    var text = "";
                    // var priReasn = $("#primaryReason").val();
                    // var secReasn = $("#secondaryResList").val();
                    // if (priReasn == "-1" || priReasn == "") {
                    //     text = "\n Please select primary reason.";
                    //     document.getElementById("FisReasonErr").innerHTML = text;
                    // } else {
                    //     document.getElementById("FisReasonErr").innerHTML = "";
                    // }
                    // if (secReasn == "-1" || secReasn == "" || secReasn == null) {
                    //     text = "\n Please select Secondary reason.";
                    //     //document.getElementById("SecReasonErr").innerHTML = text;
                    // } else {
                    //     //document.getElementById("SecReasonErr").innerHTML = "";
                    // }

                     var counting = 0;
                     var countingCheck = 0;
                     var oneChecked = false;
                    $(":input[id^=chkAnsType]")
                            .each(
                                    function(outerLoop) {
                                        var chkAnsType = $('#chkAnsType' + outerLoop).val();
                                        counting++;
                                        if (chkAnsType != undefined) {
                                            if (chkAnsType == "text") {
                                                var textDescAnsVal = $(
                                                        "#textDescAns" + outerLoop).val();
                                                if (textDescAnsVal == "") {
                                                    var chkAnsType1 = $(
                                                            '#chkAnsType' + (outerLoop + 1))
                                                            .val();
                                                    text = "\n Please provide description";
                                                    if (chkAnsType1 != "text") {
                                                        document.getElementById("errId"
                                                                + outerLoop).innerHTML = text;
                                                    }
                                                } else {
                                                    document.getElementById("errId"
                                                            + outerLoop).innerHTML = "";
                                                }
                                            }
                                            if (chkAnsType == "radio") {
                                                countingCheck++;
                                                var cntChk = false;
                                                var chkId = $(":input[id^=rdAns]").eq(
                                                        outerLoop).val();
                                                var isChecked = $('#rdAns' + outerLoop).is(
                                                        ':checked');
                                                var chkAnsType1 = $(
                                                        '#chkAnsType' + (outerLoop + 1))
                                                        .val();
                                                if (isChecked == false) {
                                                    cntChk = false;
                                                } else {
                                                    cntChk = true;
                                                    oneChecked = true;
                                                }
                                                if (chkAnsType1 != "radio") {
                                                    if (oneChecked == false) {
                                                        if (cntChk == false) {
                                                            text = "\n Please Select appropriate radio button";
                                                            document
                                                                    .getElementById("errId"
                                                                            + (counting - countingCheck)).innerHTML = text;
                                                            countingCheck = 0;
                                                        }
                                                    } else {
                                                        document
                                                                .getElementById("errId"
                                                                        + (counting - countingCheck)).innerHTML = "";
                                                        countingCheck = 0;
                                                    }
                                                    if (oneChecked == true) {
                                                        oneChecked = false;
                                                    }
                                                }
                                            }
            
                                            if (chkAnsType == "checkbox") {
                                                countingCheck++;
                                                var cntChk = false;
                                                var chkId = $(":input[id^=chkAns]").eq(
                                                        outerLoop).val();
                                                var isChecked = $('#chkAns' + outerLoop)
                                                        .is(':checked');
                                                var chkAnsType1 = $(
                                                        '#chkAnsType' + (outerLoop + 1))
                                                        .val();
                                                if (isChecked == false) {
                                                    cntChk = false;
                                                } else {
                                                    cntChk = true;
                                                    oneChecked = true;
                                                }
                                                if (chkAnsType1 != "checkbox") {
                                                    if (oneChecked == false) {
                                                        if (cntChk == false) {
                                                            text = "\n Please Select appropriate checkbox";
                                                            document
                                                                    .getElementById("errId"
                                                                            + (counting - countingCheck)).innerHTML = text;
                                                            countingCheck = 0;
                                                        }
                                                    } else {
                                                        document
                                                                .getElementById("errId"
                                                                        + (counting - countingCheck)).innerHTML = "";
                                                        countingCheck = 0;
                                                    }
                                                    if (oneChecked == true) {
                                                        oneChecked = false;
                                                    }
                                                }
                                            }
                                        }
                                    });
                    return text;
                }



    $scope.redirectOnBack = function () {
        $state.go('showExitInterview')
        //$ionicNavBarDelegate.back();

    }                


$scope.init();

});