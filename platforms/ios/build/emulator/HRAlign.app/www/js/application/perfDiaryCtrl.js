/*
 1.This controller is used for applying leaves.
 */
mainModule.controller('perfDiaryCtrl', function ($scope, $rootScope, commonService,
    $rootScope, $ionicPopup, getSetService,
    $state, $http, $ionicLoading, $timeout
) {
    $rootScope.navHistoryPrevPage = "requisitionNew"
    $scope.resultObj = {}
    $scope.baseURL = baseURL;
    $scope.selectedValues = {}



    $scope.init = function () {

        var formData = new FormData();
        if ($scope.companyChange) {
            if ($scope.companyChange == "true") {
                formData.append("empId", sessionStorage.getItem("empId"))
                formData.append("companyId", $scope.companyId)
            } else {
                //emp changed
                formData.append("empId", $scope.empId)
                formData.append("companyId", $scope.companyId)
                formData.append("periodId", $scope.periodId)
            }
        } else {
            //this is the first time this page has loaded
            //formData.append("empId", sessionStorage.getItem("empId"))
            formData.append("companyId", sessionStorage.getItem("companyId"))
        }


        formData.append("buttonRights", "Y-Y-Y-Y")
        formData.append("menuId", "1923")
        $ionicLoading.show()

        $.ajax({
            url: baseURL + '/pms/pmskra/viewPmsKra.spr',
            data: formData,
            type: 'POST',
            timeout: commonRequestTimeout,
            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
             },
            success: function (success) {
                //alert(success.clientResponseMsg)
                console.log(success)
                if (success.clientResponseMsg) {
                    if (!(success.clientResponseMsg == "OK")) {
                        console.log(success.clientResponseMsg)
                        handleClientResponse(success.clientResponseMsg, "viewPmsKra")
                        $ionicLoading.hide()
                        //showAlert("Something went wrong. Please try later.")
                        //$scope.redirectOnBack()
                        //$ionicNavBarDelegate.back();
                        $scope.pmsQuestionHeaderList = null
                        $scope.pmsEmployeeStatusList = null
                        $scope.allEmps = null
                        $scope.pmsPeriodList = null
                        $scope.empId = null
                        document.getElementById("periodId").options[0].selected = true
                        //document.getElementById("empId").options[0].selected = true
                        //document.getElementById("txtSearchEmp").value = ""

                        return
                    }
                }

                $scope.pmsQuestionHeaderList = null;
                $scope.pmsQuestionHeaderList = success.headerList;

                if ($scope.empId != null && $scope.empId) {
                    //this is user selected emp id and init is aleready run initialyy
                } else {
                    $scope.allEmps = success.pmsEmployeeStatusList;
                    $scope.mobCompanyList = success.companyList
                    //$scope.pmsEmployeeStatusList = success.pmsEmployeeStatusList;

                    $scope.pmsPeriodList = success.pmsPeriodList
                    for (var i = 0; i < $scope.pmsPeriodList.length; i++) {
                        // as date comes as yyyy-mm-dd
                        var newStr = getDateinDDMMYYYY(new Date($scope.pmsPeriodList[i].fromDate))
                        newStr += " - "
                        newStr += getDateinDDMMYYYY(new Date($scope.pmsPeriodList[i].toDate))
                        $scope.pmsPeriodList[i].ddString = newStr
                    }

                }

                if (!$scope.$$phase)
                    $scope.$apply()

                $timeout(function () {

                    if ($scope.empId != null && $scope.empId) {
                        $scope.afterInit();
                        //this is present meains user has selected the meployee from dropdown
                    } else {
                        sel = document.getElementById("companyId")
                        if (sel != null) {

                            for (var i = 0; i < sel.options.length; i++) {
                                if (sel.options[i].text == success.companyName) {
                                    if (i > 0) {
                                        companyId = $scope.mobCompanyList[i - 1].companyId
                                        sel.options[i].selected = true
                                        break
                                    } else {
                                        break
                                    }
                                }
                            }
                            //pupulate dd with server company name
                            //sel.options[0].selected = true
                        }

                        //sel = document.getElementById("empId")
                        //if (sel != null) {
                        //sel.options[0].selected = true
                        strFullnameCode = sessionStorage.getItem("empName");

                        //document.getElementById("txtSearchEmp").value = strFullnameCode
                        document.getElementById("search_emp").value = strFullnameCode
                        $scope.filterEmp()

                        //}

                        sel = document.getElementById("periodId")
                        if (sel != null) {
                            //change here to 0
                            if (!$scope.empId) {
                                sel.options[sel.options.length - 1].selected = true
                            } else {
                                sel.options[0].selected = true
                            }
                        }
                    }


                    if (document.getElementById("pmsQuestionHeaderChildSize") != null) {
                        document.getElementById("pmsQuestionHeaderChildSize").value = $scope.pmsQuestionHeaderList[0].pmsQuestionHeaderChildList.length
                    }
                    //change here remove 3 line below    
                    if (!$scope.empId) {
                        //sel = document.getElementById("empId")
                        //sel.options[1].selected = true
                        $scope.empId = $scope.pmsEmployeeStatusList[0].applicantId
                        $scope.afterInit()
                    }
                    $ionicLoading.hide()

                }, 1000)
            },
            error(res) {
                $ionicLoading.hide()
                showAlert("Error", res.status)
                $scope.redirectOnBack()

            }

        });
    }

    $scope.filterEmp = function () {
        var searchEmpText = document.getElementById("search_emp").value
        if (searchEmpText.length < 3) {
            return
        }
        searchEmpText = searchEmpText.toLowerCase()
        $scope.pmsEmployeeStatusList = $scope.allEmps.filter(function (el) {
            return el.empName.toLowerCase().indexOf(searchEmpText) >= 0;
        });

        if (!$scope.$$phase)
            $scope.$apply()

    }


    $scope.f_change = function (changeFromCompanyDD, empid, empName) {

        var periodId = ""
        var companyId = ""
        var empId = ""

        if (empid != '') {
            empId = empid
            $scope.empId = empid

            $timeout(function () {
                document.getElementById("search_emp").value = empName
                if (!$scope.$$phase)
                    $scope.$apply()
            }, 50)
        }else{
            //may be it is from period change
            if ($scope.empId){
                empId = $scope.empId
            }
        }


        $scope.companyChange = changeFromCompanyDD


        elem = document.getElementById("companyId")
        for (var i = 0; i < elem.options.length; i++) {

            if (elem.options[i].selected) {
                if (i > 0) {
                    companyId = $scope.mobCompanyList[i - 1].companyId
                    break
                } else {
                    break
                }
            }
        }

        if ($scope.companyChange != "true") {
            elem = document.getElementById("periodId")
            for (var i = 0; i < elem.options.length; i++) {
                if (elem.options[i].selected) {
                    periodId = $scope.pmsPeriodList[i - 1].periodId
                    break
                }
            }


            // elem = document.getElementById("empId")
            // for (var i = 0; i < elem.options.length; i++) {
            //     if (elem.options[i].selected) {
            //         if (i > 0) {
            //             empId = $scope.pmsEmployeeStatusList[i - 1].applicantId
            //             break
            //         } else {
            //             break
            //         }
            //     }
            // }
        } else {
            //change of company dd
            if (companyId == "") {
                //showAlert("select Company ");
                return;
            }
            $scope.companyId = companyId
            $scope.empId = null
            $scope.periodId = null
            $scope.init();
            return
        }


        if (periodId != "" && empId != "" && companyId != "") {
            $scope.companyId = companyId
            $scope.empId = empId
            $scope.periodId = periodId

            $scope.init();
            //$scope.fetchData(companyId,periodId,empId)


        } else {
            if (periodId == "") {
                showAlert("select Period ");
                return;
            }

            if (empId == "") {
                showAlert("select Employee ");
                return;
            }
            if (companyId == "") {
                showAlert("select Company ");
                return;
            }

        }
    }





    $scope.SelectedFile = function () {

        var imgcontrolName = "showImg"
        var image = document.getElementById(imgcontrolName);
        image.src = ""
        image.style.display = "none"
        $scope.imageData = $scope.fileChange()

    }




    $scope.removeAttachment = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '',
            template: 'Do you want to remove image?', //Message
        });
        confirmPopup.then(function (res) {
            if (res) {
                var imgcontrolName = "showImg"
                var image = document.getElementById(imgcontrolName);
                image.src = ""
                image.style.visibility = "hidden"
            }
        });
    }


    $scope.fileChange = function () {
        var reader = new FileReader();

        // Closure to capture the file information.
        var fileData;
        reader.onload = (function (theFile) {
            return function (e) {

                $scope.imageData = e.target.result;
            };
        })(f);

        $ionicLoading.hide()

        // Read in the image file as a data URL.
        if (document.getElementById('inputFileUpload').files[0]) {
            var f = document.getElementById('inputFileUpload').files[0]
            $scope.selectedFileNameFromDevice = document.getElementById('inputFileUpload').files[0].name

            reader.readAsDataURL(f);
        } else {
            $scope.selectedFileNameFromDevice = ""
        }
    }









    $scope.SelectedFile = function () {

        var imgcontrolName = "showImg"
        var image = document.getElementById(imgcontrolName);
        image.src = ""
        image.style.display = "none"
        $scope.imageData = $scope.fileChange()

    }


    $scope.cameraTakePicture = function (mode) {
        var imgcontrolName = "showImg"


        if (mode == "camera") {

            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 25,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                correctOrientation: true

            });
            function onSuccess(imageData) {
                var image = document.getElementById(imgcontrolName);
                image.style.visibility = "visible"
                image.style.display = "inline-block"
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
               // var thisResult = JSON.parse(imageData);
                // convert json_metadata JSON string to JSON Object 
                //var metadata = JSON.parse(thisResult.json_metadata);
                //image.src = "data:image/jpeg;base64," + thisResult.filename;
                //$scope.imageData = "data:image/jpeg;base64," + thisResult.filename;
    
               // image.src = "data:image/jpeg;base64," + imageData;
               // $scope.imageData = "data:image/jpeg;base64," + imageData;
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





    $scope.redirectOnBack = function () {

        $state.go('app.requestMenu');
    }






    $scope.init();

    $scope.afterInit = function () {
        if (!$scope.empId) {
            $scope.empId = sessionStorage.getItem("empId")
        }

        if (document
            .getElementById("pmsQuestionHeaderChildSize") != null) {
            var QuestionsCount = document
                .getElementById("pmsQuestionHeaderChildSize").value;
            var numItems = $('.item').length;
            K = ($('.commentsQuestionHeader').length == 0 ? 10
                : $('.commentsQuestionHeader').length);
            var inputs = new Array();
            var temp = [];
            inputs = $(".questionHeaderChildId");

            for (var i = 0; i < inputs.length; i++) {
                temp.push($(inputs[i]).val());
            }
            $
                .each(
                    temp,
                    function (index, value) {
                        var tempEmpId = $scope.empId
                        var tempUserId = sessionStorage.getItem("empId")
                        var tempUserName = sessionStorage.getItem("empName")
                        if (!document
                            .getElementById("questionHeaderChildId"
                                + value)) {
                            console
                                .log('returning null Question');
                            return;
                        }
                        var tempQuestionId = parseInt(document
                            .getElementById("questionHeaderChildId"
                                + value).value);

                        console
                            .log('logged in User Id :'
                                + tempUserId
                                + ' Logged in User Name '
                                + tempUserName
                                + ' empid : '
                                + tempEmpId
                                + ' kra Id '
                                + tempQuestionId);

                        $(
                            '#commentsQuestionHeader'
                            + value)
                            .comments(
                                {
                                    profilePictureURL: baseURL + '/api/eisCompany/viewPhoto.spr?empId='
                                        + tempUserId,
                                    fullname: tempUserName,
                                    currentUserId: tempEmpId,
                                    roundProfilePictures: true,
                                    enableEditing: false,
                                    enableNavigation: false,
                                    saveText: 'Update',
                                    replyText: 'Reply',
                                    postCommentOnEnter: true,
                                    sendText: 'Comment',
                                    enableUpvoting: false,
                                    enableDeleting: false,
                                    enableDeletingCommentWithReplies: false,
                                    enableAttachments: false,
                                    enableHashtags: false,
                                    enablePinging: false,
                                    createdByCurrentUser: false,
                                    textareaRows: 1,
                                    timeFormatter: function (
                                        time) {

                                        return new Date(
                                            time)
                                            .toLocaleDateString(
                                                "en-US",
                                                {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    second: 'numeric'
                                                })
                                            + ' '
                                        // + moment(
                                        //         time)
                                        //         .fromNow();
                                    },
                                    postComment: function (
                                        commentJSON,
                                        success,
                                        error) {
                                        $
                                            .ajax({
                                                url: baseURL + "/pms/pmskra/saveQuestionComment.spr",
                                                data: {
                                                    'comment': JSON
                                                        .stringify(commentJSON),
                                                    "questionId": tempQuestionId,
                                                    "empId": tempEmpId
                                                },
                                                type: 'POST',
                                                async: false,
                                                cache: false,
                                                headers: {
                                                    'Authorization': 'Bearer ' + jwtByHRAPI
                                                 },
                                                success: function (
                                                    resultArray) {
                                                    success(resultArray)
                                                },
                                                error: function (
                                                    xhr,
                                                    status,
                                                    error) {
                                                    if (status === "timeout") {
                                                        $(
                                                            location)
                                                            .attr(
                                                                'href',
                                                                url);
                                                    }
                                                    console
                                                        .log('Error '
                                                            + xhr.responseText);
                                                }
                                            });
                                    },
                                    getComments: function (
                                        success,
                                        error) {
                                        $
                                            .ajax({
                                                url: baseURL + "/pms/pmskra/getQuestionComment.spr",
                                                data: {
                                                    'questionId': tempQuestionId,
                                                    "empId": tempEmpId
                                                },
                                                type: 'GET',
                                                async: false,
                                                cache: false,
                                                headers: {
                                                    'Authorization': 'Bearer ' + jwtByHRAPI
                                                 },
                                                success: function (
                                                    resultArray) {
                                                    success(resultArray)
                                                },
                                                error: function (
                                                    xhr,
                                                    status,
                                                    error) {
                                                    console
                                                        .log('Error '
                                                            + xhr.responseText);
                                                }
                                            });
                                    },
                                    refresh: function () {
                                        $("img")
                                            .error(
                                                function () {
                                                    $(
                                                        this)
                                                        .unbind(
                                                            "error")
                                                        .attr(
                                                            "src",
                                                            "../../resources/blank.jpg");
                                                });
                                    }
                                });
                    });
        }

        $scope.afterInitForNotes()
    }


    $scope.afterInitForNotes = function () {

        periodId = ""
        if (!$scope.empId) {
            //$scope.empId = sessionStorage.getItem("empId")
        }
        if ($scope.companyChange != "true") {
            elem = document.getElementById("periodId")
            for (var i = 0; i < elem.options.length; i++) {
                if (elem.options[i].selected) {
                    periodId = $scope.pmsPeriodList[i - 1].periodId
                    break
                }
            }
        }
        if (periodId == "") {
            return
        }

        var tempEmpId = $scope.empId
        var tempUserId = sessionStorage.getItem("empId")
        var tempUserName = sessionStorage.getItem("empName")

        $('#overAllKraComments')
            .comments(
                {
                    profilePictureURL: baseURL + '/api/eisCompany/viewPhoto.spr?empId='
                        + tempUserId,
                    fullname: tempUserName,
                    currentUserId: tempEmpId,
                    roundProfilePictures: true,
                    enableEditing: false,
                    enableNavigation: false,
                    saveText: 'Update',
                    replyText: 'Reply',
                    postCommentOnEnter: true,
                    sendText: 'Comment',
                    enableUpvoting: false,
                    enableDeleting: false,
                    enableDeletingCommentWithReplies: false,
                    enableAttachments: false,
                    enableHashtags: false,
                    enablePinging: false,
                    createdByCurrentUser: false,
                    textareaRows: 1,
                    timeFormatter: function (time) {

                        return new Date(time)
                            .toLocaleDateString(
                                "en-US",
                                {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    second: 'numeric'
                                });
                    },
                    postComment: function (commentJSON,
                        success, error) {
                        $
                            .ajax({
                                url: baseURL + "/pms/pmskra/saveOverAllKraComment.spr",
                                data: {
                                    'comment': JSON
                                        .stringify(commentJSON),
                                    "kraUser": tempEmpId,
                                    "periodId": periodId
                                },
                                type: 'POST',
                                async: false,
                                cache: false,
                                headers: {
                                    'Authorization': 'Bearer ' + jwtByHRAPI
                                 },
                                success: function (
                                    resultArray) {
                                    success(resultArray)
                                },
                                error: function (
                                    xhr,
                                    status,
                                    error) {
                                    if (status === "timeout") {
                                        // $(location)
                                        //         .attr(
                                        //                 'href',
                                        //                 url);
                                        showAlert("Some error while fetching Notes.")
                                    }
                                    console
                                        .log('Error '
                                            + xhr.responseText);
                                }
                            });
                    },
                    getComments: function (success,
                        error) {
                        $
                            .ajax({
                                url: baseURL + "/pms/pmskra/getOverAllKraComment.spr",
                                data: {
                                    "periodId": periodId,
                                    "kraUser": tempEmpId
                                },
                                type: 'GET',
                                async: false,
                                cache: false,
                                headers: {
                                    'Authorization': 'Bearer ' + jwtByHRAPI
                                 },
                                success: function (
                                    resultArray) {
                                    success(resultArray)
                                },
                                error: function (
                                    xhr,
                                    status,
                                    error) {
                                    console
                                        .log('Error '
                                            + xhr.responseText);
                                }
                            });
                    },
                    refresh: function () {
                        $("img")
                            .error(
                                function () {
                                    $(this)
                                        .unbind(
                                            "error")
                                        .attr(
                                            "src",
                                            "../../resources/blank.jpg");
                                });
                    }

                });

        $ionicLoading.hide()
    }





    $scope.downloadAttachmnent = function (travel) {

        var strData = travel.uploadFile

        var strUrlPrefix = 'data:' + travel.uploadContentType + ";base64,"
        var url = strUrlPrefix + strData
        var blob = base64toBlob(strData, travel.uploadContentType)
        downloadFileFromData(travel.uploadFileName, blob, travel.uploadContentType)
        event.stopPropagation();
    }


    $scope.openFile = function (obj) {


        event.stopPropagation();


        var fd = new FormData();
        fd.append("id", 74)


        $.ajax({
            url: baseURL + '/api//pms/pmskra/openFileQuestion.spr',
            data: fd,
            type: 'POST',
            timeout: commonRequestTimeout,
            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
             },
            success: function (result) {
                if (!(result.clientResponseMsg == "OK")) {
                    console.log(result.clientResponseMsg)
                    handleClientResponse(result.clientResponseMsg, "openFileByCtcClaimId")
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
            error: function (res) {
                $ionicLoading.hide()
                showAlert("Something went wrong while fetching the file.");
            }

        });
    }




    $scope.goSaveAssessment = function () {
        $scope.childList = new Array($scope.pmsQuestionHeaderList[0].pmsQuestionHeaderChildList.length)

        for (var i = 0; i < $scope.pmsQuestionHeaderList[0].pmsQuestionHeaderChildList.length; i++) {
            ans = document.getElementById("answer" + i).value
            kraQuestionId = $scope.pmsQuestionHeaderList[0].pmsQuestionHeaderChildList[i].kraQuestionId
            $scope.childObj = {}
            $scope.childObj.kraQuestionId = kraQuestionId
            $scope.childObj.answer = ans
            // add file details also
            $scope.childList[i] = $scope.childObj
        }

        var periodId = ""
        var companyId = ""
        var empId = ""


        elem = document.getElementById("companyId")
        for (var i = 0; i < elem.options.length; i++) {

            if (elem.options[i].selected) {
                if (i > 0) {
                    companyId = $scope.mobCompanyList[i - 1].companyId
                    break
                } else {
                    break
                }
            }
        }

        if ($scope.companyChange != "true") {
            elem = document.getElementById("periodId")
            for (var i = 0; i < elem.options.length; i++) {
                if (elem.options[i].selected) {
                    periodId = $scope.pmsPeriodList[i - 1].periodId
                    break
                }
            }
        }

        elem = document.getElementById("empId")
        for (var i = 0; i < elem.options.length; i++) {
            if (elem.options[i].selected) {
                if (i > 0) {
                    empId = $scope.pmsEmployeeStatusList[i - 1].applicantId
                    break
                } else {
                    break
                }
            }
        }


        formData = new FormData()
        formData.append("empId", empId)
        formData.append("companyId", companyId)
        formData.append("periodId", periodId)
        formData.append("childList", JSON.stringify($scope.childList))

        if (document.getElementById('inputFileUpload').files[0]) {

            var base64result = $scope.imageData.split(',')[1];
            $scope.fileUploadName = document.getElementById('inputFileUpload').files[0].name
            $scope.fileUploadType = document.getElementById('inputFileUpload').files[0].type

            var blob = base64toBlob(base64result, $scope.fileUploadType, $scope.fileUploadName)
            formData.append('file', blob, $scope.fileUploadName)

            if (document.getElementById('inputFileUpload').files[0].size / (1024 * 1024) > 1) {
                showAlert("Maximum file size is limited to  1 Mb, Please try another file of lesser size. ")
                $ionicLoading.hide()
                //return
            }

        } else if (document.getElementById('showImg').src.indexOf("data:image") > -1) {
            //scope.imageData is the src of camera image 
            var base64result = $scope.imageData.split(',')[1];

            var ts = new Date();
            ts = ts.getFullYear() + "" + (ts.getMonth() + 1) + "" + ts.getDate() + "" + ts.getHours() + "" + ts.getMinutes() + "" + ts.getSeconds()

            $scope.fileUploadName = "camPic" + ts + ".jpeg"
            $scope.fileUploadType = "image/jpeg"

            var blob = base64toBlob(base64result, $scope.fileUploadType, $scope.fileUploadName)
            formData.append('file', blob, $scope.fileUploadName)

        }
        $.ajax({
            url: baseURL + '/pms/pmskra/saveAssessmentMobile.spr',
            data: formData,
            type: 'POST',
            timeout: commonRequestTimeout,
            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
             },
            success: function (success) {
                //alert(success.clientResponseMsg)
                console.log(success)
                if (success.clientResponseMsg) {
                    if (!(success.clientResponseMsg == "OK")) {
                        console.log(success.clientResponseMsg)
                        handleClientResponse(success.clientResponseMsg, "sendForApproveWithFile")
                        $ionicLoading.hide()
                        showAlert("Something went wrong. Please try later.")
                        //$scope.redirectOnBack()

                        return
                    }
                    if (success.msg == "") {
                        showAlert("Data saved successfully.")
                        //$scope.empId = null
                        //$scope.companyChange = null
                        $scope.init()
                        //$scope.redirectOnBack()
                    } else {
                        showAlert(success.msg)
                    }
                }
            },
            error(res) {
                $ionicLoading.hide()
                showAlert("Error in saving", res.status)
                //$scope.redirectOnBack()

            }

        });


    }

    $scope.f_changeCompany = function (event) {

        document.getElementById("periodId").options[0].selected = true
        $scope.f_change("true", '', '')
    }


    $scope.openFile = function () {
        $scope.reqObj = {}
        $scope.reqObj.kraQuestionId =
            kraQuestionId = $scope.pmsQuestionHeaderList[0].pmsQuestionHeaderChildList[0].kraQuestionId;

        //alert(fileId)
        var fd = new FormData();
        fd.append("kraQuestionId", kraQuestionId)

        $.ajax({
            url: baseURL + '/pms/pmskra/getKraQuestionFile.spr',
            data: fd,
            type: 'POST',
            timeout: commonRequestTimeout,
            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
             },
            success: function (result) {
                if (!(result.clientResponseMsg == "OK")) {
                    console.log(result.clientResponseMsg)
                    handleClientResponse(result.clientResponseMsg, "openFileMobile")
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
            error: function (res) {
                $ionicLoading.hide()
                showAlert("Something went wrong while fetching the file.");
            }

        });
    }



    $scope.divRadioClicked = function () {

        if (document.getElementById("efRadio").checked) {
            document.getElementById("efDiv").style.display = 'block'
            document.getElementById("notesDiv").style.display = 'none'
        } else {
            document.getElementById("efDiv").style.display = 'none'
            document.getElementById("notesDiv").style.display = 'block'
        }

    }


    $scope.searchEmpChange = function () {

        //apply time logic
        $scope.nowTimeEmpChange = new Date()
        $timeout(function () {
            $scope.empDdChangeEnable = "NO"
            if ((new Date() - $scope.nowTimeEmpChange) / 1000 > 0.8) {

                var searchTxt = document.getElementById("searchEmpTxt").value.trim()

                if (!$scope.$$phase)
                    $scope.$apply()

                if (searchTxt == "") {
                    //alert("empty")

                } else {
                    //filter list according to search text 
                    //alert("text")


                }
            } else {
                //typing not over
            }
            $ionicLoading.hide()
            $scope.empDdChangeEnable = "YES"
        }, 1000)
    }


    //    $scope.onTyping =  function() {
    //         $("#search_emp").autocomplete({
    //         minLength : 3,
    //         selectfirst : true,
    //         minChars : 1,
    //         matchSubset : 1,
    //         matchContains : 1,
    //         cacheLength : 10,
    //         autoFill : false,
    //         search : function(e, u) {
    //         console.log("fetched emp list")
    //     },
    //     source : function(request,response) {
    //          alert("in abc")  
    //          $scope.filterEmp()  

    //             var result = [ {
    //             label : "No matches found rajesh",
    //             value : ''
    //             } ];
    //             response(result);


    //     //   if (!data.length) {
    //     //         var result = [ {
    //     //         label : "No matches found",
    //     //         value : ''
    //     //         } ];
    //     //         response(result);
    //     //         } else {
    //     //         response(jQuery
    //     //         .map(data,function(item) {
    //     //             return {
    //     //         label : (item.name).split("@@")[1],
    //     //         value : (item.name).split("@@")[1],
    //     //     comId : (item.name).split("@@")[0],
    //     //     };

    //     //     }));

    //     //                                                 }
    //                                                   },
    //                                                     select : function(event, ui) {
    //                                                         var val = "";
    //                                                         var lable = "";
    //                                                         var comId = "";
    //                                                         var hCatId = "";
    //                                                         alert("selected")
    //                               // this.value = ui.item.label;
    //                               // //alert(ui.item.comId + "   -   "+ ui.item.label)
    //                               // document.getElementById('selectedEmpIdFromPopUp').value = ui.item.comId;
    //                               // document.getElementById('searchEmpTxt').value = ui.item.comId;
    //                               // angular.element(document.getElementById('selectedEmpIdFromPopUp')).scope().empChangedByPopUpSelection();


    //                                                         return true;
    //                                                     }
    //                                                 });

    //               }    

});
