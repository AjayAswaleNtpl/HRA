/*
 1.This controller is used to show payslip and tax slip.
 2.Payslip and tax slip are downloaded and opened.
 */

mainModule.factory("myPaySlipService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/ctc/paySlip/myPaySlip.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);

mainModule.factory("paySlipService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/ctc/paySlip/exportPaySlip.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);

mainModule.controller("paySlipCtrl", function ($scope, myPaySlipService, commonService, validateService, $ionicModal, $ionicLoading,
$timeout) {

    $scope.paySlipObj = {};
    $scope.paySlipObj.selMonth = '';
    $scope.paySlipObj.selYear = '';

    $scope.taxSlipObj = {};
    $scope.taxSlipObj.selMonth = '';
    $scope.taxSlipObj.selYear = '';

    $scope.f_year = '';
    $scope.month = '';
    $scope.currYear = new Date().getFullYear();
    $scope.currMonth = new Date().getMonth() + 1;
    $scope.empId = sessionStorage.getItem('empId');
	$timeout(function () {	
		document.getElementById("btnViewPayslip").click();
		},200)
	
    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    $scope.$on('modal.hidden', function () {
    });
    $scope.$on('modal.removed', function () {
    });

    $ionicModal.fromTemplateUrl('my-tax-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (taxModal) {
        $scope.taxModal = taxModal;
    });
    $scope.openTaxModal = function () {
        $scope.taxModal.show();
    };
    $scope.closeTaxModal = function () {
        $scope.taxModal.hide();
    };
    $scope.$on('$destroy', function () {
        $scope.taxModal.remove();
    });
    $scope.$on('taxModal.hidden', function () {
    });
    $scope.$on('taxModal.removed', function () {
    });


    $scope.myPaySlip = function () {
        $scope.myPaySlipService = new myPaySlipService();
        $scope.myPaySlipService.$save($scope.resultShiftObj, function (data) {
			
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"myPaySlipService")
			}

            //$scope.f_yearList = data.listYear;
			var dojYr = new Date(parseInt(sessionStorage.getItem('dateOfJoining')));
			$scope.f_yearList =[]
			todayYr = new Date()
			
			
			
			if (dojYr.getFullYear() == todayYr.getFullYear()){
				$scope.f_yearList.push(todayYr.getFullYear());
			}
			else{
				for(var i = dojYr.getFullYear() ; i <= todayYr.getFullYear();i++){
					$scope.f_yearList.push(i)
				}
			}
            $scope.monthList = data.listMonth;
        }
        , function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
    $scope.myPaySlip();

    $scope.myTaxSlip = function () {
        $scope.myPaySlipService = new myPaySlipService();
        $scope.myPaySlipService.$save($scope.resultShiftObj, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"myPaySlipService")
			}
            $scope.f_yearList = data.listYear;
            $scope.monthList = data.listMonth;
        }
        , function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
    //$scope.myTaxSlip();

    $scope.downloadPaySlip = function (type) {
        if ($scope.paySlipObj.selYear == '' || $scope.paySlipObj.selMonth == '') {
            showAlert("", "Please select month & year");
        }
        else
        {
            if ($scope.paySlipObj.selYear > $scope.currYear)
            {
                showAlert("", "You cannot select future year.");
                return;
            }

            if ($scope.paySlipObj.selYear == $scope.currYear && $scope.paySlipObj.selMonth > $scope.currMonth)
            {
                showAlert("", "You cannot select future month.");
                return;
            }

            $ionicLoading.show({
            });
            var uri;
            var fileURL;
            if (ionic.Platform.isAndroid()) {
                if (type == 1) {
                    uri = baseURL + "/api/ctc/paySlip/exportPaySlip.spr?empId=" + $scope.empId + "&f_year=" + $scope.paySlipObj.selYear + "&month=" + $scope.paySlipObj.selMonth;
                    //  fileURL = "///storage/emulated/0/Download/payslip" + $scope.paySlipObj.selMonth + $scope.paySlipObj.selYear + ".pdf";
                    fileURL = cordova.file.externalDataDirectory + "payslip" + $scope.paySlipObj.selMonth + $scope.paySlipObj.selYear + ".pdf";
                }

                var fileTransfer = new FileTransfer();
                fileTransfer.download(
                        uri,
                        fileURL,
                        function (success) {
                            $ionicLoading.show({
                            });
                            $ionicLoading.hide();
                            showAlert("", "Your payslip is downloaded successfully and is password protected. Please use your DOB(ddmmyyyy) to open the file")
                            $scope.paySlipObj.selMonth = ''
                            $scope.paySlipObj.selYear = ''
                            cordova.plugins.fileOpener2.open(
                                    fileURL,
                                    'application/pdf',
                                    {
                                        error: function (e) {
                                            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                                        },
                                        success: function () {
                                            console.log('File opened successfully');
                                        }
                                    }
                            );
                        },
                        function (error) {
                            if (error.http_status == 406)
                            {
                                showAlert("", "Payslip is not available");
                            }
                            else if (error.code == 1)
                            {
                                showAlert("", "Please give storage permission");
                            }
                            else if (error.code == 3)
                            {
                                autoRetryCounter = 0
                                $ionicLoading.hide()
                                commonService.getErrorMessage(error);
                            }
                            $scope.paySlipObj.selMonth = ''
                            $scope.paySlipObj.selYear = ''
                            $ionicLoading.hide()
                        });
            }
            else
            {
                $ionicLoading.hide()
                uri = baseURL + "/api/ctc/paySlip/exportPaySlip.spr?empId=" + $scope.empId + "&f_year=" + $scope.paySlipObj.selYear + "&month=" + $scope.paySlipObj.selMonth;
                if (window.XMLHttpRequest)
                {
                    var oReq = new XMLHttpRequest();
                    oReq.open("GET", uri);
                    oReq.send();
                    oReq.onload = function () {
                        if (oReq.status == "406" || oReq.status != "200") {
                            showAlert("", "Payslip is not available");
                        }
                        else {
                            var ref = cordova.InAppBrowser.open(uri, '_blank', 'location=yes,toolbarposition=top');
                        }
                    };
                }
                $scope.paySlipObj.selMonth = ''
                $scope.paySlipObj.selYear = ''
            }
        }
    };



    $scope.downloadTaxSlip = function (type) {
        if ($scope.taxSlipObj.selYear == '' || $scope.taxSlipObj.selMonth == '') {
            showAlert("", "Please select month & year");
        }
        else
        {
            if ($scope.taxSlipObj.selYear > $scope.currYear)
            {
                showAlert("", "You cannot select future year.");
                return;
            }

            if ($scope.taxSlipObj.selYear == $scope.currYear && $scope.taxSlipObj.selMonth > $scope.currMonth)
            {
                showAlert("", "You cannot select future month.");
                return;
            }

            $ionicLoading.show({
            });
            var uri;
            var fileURL;
            if (ionic.Platform.isAndroid()) {
                if (type == 2)
                {
                    uri = baseURL + "/api/ctc/taxSlip/exportTaxForecast.spr?empId=" + $scope.empId + "&f_year=" + $scope.taxSlipObj.selYear + "&month=" + $scope.taxSlipObj.selMonth;
                    // fileURL = "///storage/emulated/0/Download/taxforecast" + $scope.taxSlipObj.selYear + ".pdf";
                    fileURL = cordova.file.externalDataDirectory + "taxforecast" + $scope.taxSlipObj.selYear + ".pdf";
                }
                var fileTransfer = new FileTransfer();
                fileTransfer.download(
                        uri,
                        fileURL,
                        function (success) {
                            $ionicLoading.show({
                            });
                            $ionicLoading.hide();
                            showAlert("", "File downloaded successfully.")
                            $scope.taxSlipObj.selMonth = ''
                            $scope.taxSlipObj.selYear = ''
                            cordova.plugins.fileOpener2.open(
                                    fileURL,
                                    'application/pdf',
                                    {
                                        error: function (e) {
                                            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                                        },
                                        success: function () {
                                            console.log('File opened successfully');
                                        }
                                    }
                            );
                        },
                        function (error) {

                            if (error.http_status == 406)
                            {
                                showAlert("", "Taxslip is not available");
                            }
                            else if (error.code == 1)
                            {
                                showAlert("", "Please give storage permission");
                            }
                            else if (error.code == 3)
                            {
                                autoRetryCounter = 0
                                $ionicLoading.hide()
                                commonService.getErrorMessage(error);
                            }
                            $scope.taxSlipObj.selMonth = ''
                            $scope.taxSlipObj.selYear = ''
                            $ionicLoading.hide()
                        });
            }
            else
            {
                $ionicLoading.hide()
                uri = baseURL + "/api/ctc/taxSlip/exportTaxForecast.spr?empId=" + $scope.empId + "&f_year=" + $scope.taxSlipObj.selYear + "&month=" + $scope.taxSlipObj.selMonth;
                if (window.XMLHttpRequest)
                {
                    var oReq = new XMLHttpRequest();
                    oReq.open("GET", uri);
                    oReq.send();
                    oReq.onload = function () {
                        if (oReq.status == "406" || oReq.status != "200") {
                            showAlert("", "Taxslip is not available");
                        }
                        else {
                            var ref = cordova.InAppBrowser.open(uri, '_blank', 'location=yes,toolbarposition=top');
                        }
                    };
                }
                $scope.taxSlipObj.selMonth = ''
                $scope.taxSlipObj.selYear = ''
            }
        }
    };
});

