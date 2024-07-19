mainModule.factory("addClaimFormService", function ($resource) {
	return $resource((baseURL + '/api/claimForm/addClaimForm.spr'), {}, { 'save': { method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 } } }, {});
});

mainModule.controller('newNonCTCClaimApplicationCtrl', function ($scope, $rootScope, commonService, $ionicHistory, $rootScope, $ionicPopup, getValidateLeaveService, $state, $http, $q, $filter, $ionicLoading, addClaimFormService, getLeaveMasterService,
	$ionicNavBarDelegate, $timeout) {
	$rootScope.navHistoryPrevPage = "requestClaimList"
	//$rootScope.navHistoryCurrPage="leave_application"
	$rootScope.navHistoryPrevTab = "CLAIM_NONCTC"
	//alert($rootScope.navHistoryPrevPage)

	// $ionicLoading.show();
	$scope.resultObj = {}
	$scope.selectedFileName = ''


	$scope.countGrid1 = 1
	$scope.FileNames = new Array(10)
	$scope.FileTypes = new Array(10)
	$scope.FileContents = new Array(10)

	if (getMyHrapiVersionNumber() >= 32) {
		$scope.utf8Enabled = 'true'
	} else {
		$scope.utf8Enabled = 'false'
	}


	$scope.init = function () {
		$scope.resultObj.menuId = '2004'
		$scope.resultObj.buttonRights = 'Y-Y-Y-Y'
		$scope.resultObj.claimFlag = 'NONCTC';
		$scope.resultObj.fYearId = $rootScope.claimPeriodSelected
		//$scope.resultObj.fYearId='1'
		// $scope.resultObj.empId = parseInt(sessionStorage.getItem('empId'))

		$scope.claimListApplicationForm = {}
		$scope.selectedValues = {}
		$scope.addClaimFormService = new addClaimFormService();
		$scope.addClaimFormService.$save($scope.resultObj, function (data) {
			if (!(data.clientResponseMsg == "OK")) {
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg, "addClaimFormService")

			}
			$scope.NonCTCClaimList = []
			var nonctc = JSON.parse(data.form);
			$scope.nonctc = nonctc
			// if (data.form.claimFormVOList!=null){
			// $scope.claimFormVOList = data.form.claimFormVOList
			// $scope.resultObj.empId=$scope.claimFormVOList[0].empId
			$scope.listNonCtcPayHeadList = nonctc.listCtcPayHead
			$scope.listClaimPayhead = nonctc.listCtcPayHead.ctcPayHeadName
			// $scope.listClaimFormId = $scope.claimFormVOList[0].claimFormId
			$scope.listMonth = nonctc.monthList
			$scope.listYear = nonctc.yearList
			$scope.periodfromDt = data.ctcPeriodVO.fromDt
			$scope.periodtoDt = data.ctcPeriodVO.toDt
			$scope.claimFormVOList = nonctc.claimFormVOList
			// }

			$ionicLoading.hide()
		}, function (data, status) {
			autoRetryCounter = 0
			$ionicLoading.hide()
			commonService.getErrorMessage(data);
		});
	}


	$scope.setDate = function (object) {
		var date;
		var selIndex = $scope.nonctc.claimFormVOList.indexOf(object)
		if ($scope.fDate == null) {
			date = new Date();
		}
		else {
			date = $scope.fDate;
		}

		var options = { date: date, mode: 'date', titleText: 'From Date', androidTheme: 4 };
		datePicker.show(options, function (date) {
			if (date == undefined) {

			}
			else {
				$scope.fDate = date
				$scope.nonctc.claimFormVOList[selIndex].claimDate = date
				document.getElementById('claimDate' + selIndex).value = $filter('date')(date, 'dd/MM/yyyy');

			}

		}, function (error) {
		});
	}




	$scope.redirectOnBack = function () {
		//$ionicNavBarDelegate.back();
		$state.go('requestClaimList');

	}


	$scope.addRowGrid1 = function () {
		if ($scope.countGrid1 < 10) {
			$timeout(function () { $scope.countGrid1++ }, 250)


		}

	}
	$scope.remRowGrid1 = function () {
		if ($scope.countGrid1 > 1)
			$scope.countGrid1--

	}

	$scope.removeAttachment = function (rowno) {
		var confirmPopup = $ionicPopup.confirm({
			title: '',
			template: 'Do you want to remove image?', //Message
		});
		confirmPopup.then(function (res) {
			if (res) {
				var imgcontrolName = "showImg_" + rowno
				var image = document.getElementById(imgcontrolName);
				image.src = ""
				image.style.visibility = "hidden"
			}
		});
	}

	$scope.cameraTakePicture = function (mode, rowno) {

		//alert($selectedValues.elem.id)
		var imgcontrolName = "showImg_" + rowno

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
				//image.src = "data:image/jpeg;base64," + thisResult.filename;
				//$scope.imageData = "data:image/jpeg;base64," + thisResult.filename;
	
				//image.src = "data:image/jpeg;base64," + imageData;
				//$scope.imageData = "data:image/jpeg;base64," + imageData;
				document.getElementById("inputFileUpload_" + rowno).value = ""
				$scope.FileNames[rowNo] = ""
				if (!$scope.$$phase)
					$scope.$apply()
			}

			function onFail(message) {
				//alert('Failed because: ' + message);

			}
		}

	}



	$scope.SelectedFile = function (e) {

		var f
		var rowNo
		var reader = new FileReader();

		// Closure to capture the file information.
		var fileData;
		reader.onload = (function (theFile) {
			return function (e) {
				$scope.FileContents[rowNo] = e.target.result;
			};
		})(f);
		var lastUnderScorePlace = $scope.selectedValues.elem.id.lastIndexOf('_')
		rowNo = $scope.selectedValues.elem.id.substring(lastUnderScorePlace + 1, $scope.selectedValues.elem.id.length)

		var lbFoundSpace = false;
		f = $scope.selectedValues.elem.files[0]
		$scope.FileNames[rowNo] = e.target.files[0].name
		$scope.FileTypes[rowNo] = e.target.files[0].type
		reader.readAsDataURL(f);


		var imgcontrolName = "showImg_" + rowNo
		var image = document.getElementById(imgcontrolName);
		image.src = ""
		image.style.visibility = "hidden"
		if (!$scope.$$phase)
			$scope.$apply()

	}


	$scope.sendNonNONCTCForm = function () {

		text = $scope.validate()
		if (text != "") {
			showAlert(text)
			return
		}

		var count = $scope.countGrid1
		var num = 0;
		for (var i = 0; i <= count - 1; i++) {
			if (document.getElementById("claimType" + i).value != "") {
				num++;
			}
		}

		if (num != 0) {
			var payHeadMessage = '';
			var message = '';
			for (var i = 0; i <= num - 1; i++) {
				var j = i + 1;

				if ($('#ctcConfigurationExistFlag' + i).val() == 'false') {
					payHeadMessage = '';
				} else if ($('#ctcConfigurationExistFlag' + i).val() == 'Kindly add Non-Ctc Payhead in Ctc Structure Configuration') {
					payHeadMessage += 'Kindly add ' + $("#ctcPayHeadId" + i + " option:selected").text() + ' in Ctc Structure Configuration';
					showAlert(payHeadMessage);
					return
				} else if ($('#ctcConfigurationExistFlag' + i).val() == 'Kindly add Employee Ctc') {
					payHeadMessage += 'Kindly add Employee Ctc';
					showAlert(payHeadMessage);
					return
				}
				if ($('#ctcConfigurationExistFlag' + i).val() != 'false' && $('#ctcConfigurationExistFlag' + i).val() != '') {
					var claimAmount = parseInt($("#claimAmount" + i).val());
					var yearlyClaim = parseInt($("#yearlyClaim" + i).val());
					if (yearlyClaim < 0 && claimAmount > 0) {
						message = "Invalid Claim Amount \n ";
					} else if (claimAmount > yearlyClaim) {
						message += "" + $("#ctcPayHeadId" + i + " option:selected").text() + " Claim Limit Exeeding " + yearlyClaim + '\n';
					}

					if (payHeadMessage != '') {
						showAlert(payHeadMessage);
						return

					}
					if (message != '') {
						//showAlert(message);
					}

					// populate values of form rows to list
					payheadElem = document.getElementById("claimType" + i)
					payHeadName = payheadElem.options[payheadElem.selectedIndex].text
					payHeadId = $scope.listNonCtcPayHeadList[payheadElem.selectedIndex - 1].ctcPayHeadId
					$scope.nonctc.claimFormVOList[i].ctcPayHeadId = payHeadId

					monthElem = document.getElementById("claimMonth" + i)
					monthId = monthElem.options[monthElem.selectedIndex].value
					$scope.nonctc.claimFormVOList[i].monthId = monthId


					yearElem = document.getElementById("claimYear" + i)
					yearName = yearElem.options[yearElem.selectedIndex].text
					for (var k = 0; k < 10000; k++) {
						if ($scope.listYear[k] == yearName) {
							yearId = k
							break;
						}
					}
					$scope.nonctc.claimFormVOList[i].yearId = yearId

					claimDateElem = document.getElementById("claimDate" + i)
					claimDate = claimDateElem.value
					$scope.nonctc.claimFormVOList[i].claimDate = claimDate

					claimAmtElem = document.getElementById("claimAmount" + i)
					claimAmt = claimAmtElem.value
					$scope.nonctc.claimFormVOList[i].claimAmount = claimAmt

					billAmtElem = document.getElementById("billAmount" + i)
					billAmt = billAmtElem.value
					$scope.nonctc.claimFormVOList[i].billAmount = billAmt

					remElem = document.getElementById("remarks" + i)
					rem = remElem.value
					if ($scope.utf8Enabled == 'true') {
						if (rem) {
							rem = encodeURI(rem)
						}
					}
					$scope.nonctc.claimFormVOList[i].remarks = rem
					///////////

				}
			}	//for

			$scope.sendForm(message)

		}//if num != 0


	}




	$scope.sendForm = function (msg) {



		$scope.nonCTCList = {};

		$scope.requestState = 'Send for Approval'

		var confirmPopup = $ionicPopup.confirm({
			title: 'Are you sure',
			template: msg + '\nDo you want to ' + $scope.requestState + ' ?', //Message
		});
		confirmPopup.then(function (res) {
			if (res) {
				$ionicLoading.show()
				var formData = new FormData();
				var base64result;
				var fileType;
				var blob;


				//appending files
				var elemFile
				var fileData
				var fileType
				var fileName
				var j = 0
				var fileCtr = -1
				for (var i = 1; i <= 10; i++) {
					j = i - 1
					elemFile = document.getElementById("inputFileUpload_" + j)
					if (elemFile.value != "") {
						//file is there
						fileData = $scope.FileContents[j];
						fileName = $scope.FileNames[j]
						base64result = fileData.split(',')[1];
						fileType = fileData.split(',')[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0]
						blob = base64toBlob(base64result, fileType, fileName)
						//$scope.nonctc.claimFormVOList[j].file[0]=elemFile.files[0]
						fileCtr++;
						$scope.nonctc.claimFormVOList[j].filesNum = fileCtr;
						formData.append("mobileFiles", blob, fileName)
					} else {
						//$scope.nonctc.claimFormVOList[j].filePresent='N'
					}
				}

				//appending images

				var elemImage
				var imgSrc
				for (var i = 1; i <= 10; i++) {
					j = i - 1
					elemImage = document.getElementById("showImg_" + j)
					if (elemImage.style.visibility == "visible") {
						//image is there
						imgSrc = elemImage.src
						var fileData = imgSrc
						var ts = new Date();
						ts = ts.getFullYear() + "" + ts.getMonth() + "" + ts.getDate() + " " + ts.getHours() + "" + ts.getMinutes() + "" + ts.getSeconds()


						fileName = "camPic" + ts + ".jpeg"
						base64result = fileData.split(',')[1];
						fileType = fileData.split(',')[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0]
						blob = base64toBlob(base64result, fileType, fileName)
						//$scope.nonctc.claimFormVOList[j].mobileFiles[0]=base64result
						fileCtr++;
						$scope.nonctc.claimFormVOList[j].filesNum = fileCtr;
						formData.append("mobileFiles", blob, fileName)
					} else {
						//$scope.nonctc.claimFormVOList[j].filePresent='N'
					}
				}
				/////// file attaching over

				$scope.jsonList = JSON.stringify($scope.nonctc.claimFormVOList);

				formData.append('empId', parseInt(sessionStorage.getItem('empId')));
				formData.append('menuId', parseInt($scope.resultObj.menuId));
				formData.append('status', '');
				//formData.append('status', status);
				//formData.append('status', "SENT FOR APPROVAL");
				formData.append('level', 1);
				formData.append('claimFlag', $scope.resultObj.claimFlag);
				formData.append('fYearId', $scope.resultObj.fYearId);
				formData.append('periodId', $scope.resultObj.fYearId);
				//formData.append('claimAmount', $scope.nonCTCList.claimAmount);
				//formData.append('billAmount', $scope.nonCTCList.billAmount);
				if ($scope.utf8Enabled == 'true') {
					if ($scope.nonCTCList.remarks) {
						$scope.nonCTCList.remarks = encodeURI($scope.nonCTCList.remarks)
					}
				}
				formData.append('remarks', $scope.nonCTCList.remarks);
				//formData.append('ctcPayHeadName', $scope.nonCTCList.ctcPayHeadName);
				//formData.append('ctcPayHeadId', $scope.nonCTCList.ctcPayHeadId);
				//formData.append('month', $scope.nonCTCList.monthId);
				//formData.append('monthId', $scope.nonCTCList.monthId);





				formData.append('buttonRights', $scope.resultObj.buttonRights);
				formData.append('claimFormVOList', $scope.jsonList);

				$ionicLoading.show()
				$scope.resultObj.fYearId = $scope.resultObj.fYearId //'1'

				$scope.resultObj.ctcPayHeadId = undefined
				$scope.resultObj.empId = parseInt(sessionStorage.getItem('empId'))
				$scope.resultObj.claimAmount = undefined

				$.ajax({
					url: (baseURL + '/api/claimForm/isValidClaimAmount.spr'),
					method: 'POST',
					timeout: commonRequestTimeout,
					transformRequest: jsonTransformRequest,
					data: {
						'fYearId': $scope.resultObj.fYearId, 'ctcPayHeadId': $scope.resultObj.ctcPayHeadId,
						'claimAmount': $scope.resultObj.claimAmount, 'empId': $scope.resultObj.empId
					},
					headers: {
						'Authorization': 'Bearer ' + jwtByHRAPI,
						 'Content-Type': 'application/x-www-form-urlencoded'
					},
					async: false,
					success: function (result) {

						// if(result.msg){
						//   // alert("Result"+result.msg);
						// }
						if (result.msg == "") {

							$.ajax({
								url: (baseURL + '/masters/groupMaster/findWorkFlowIsDefined.spr'),
								method: 'POST',
								timeout: commonRequestTimeout,
								transformRequest: jsonTransformRequest,
								data: { 'empId': $scope.resultObj.empId, 'menuId': $scope.resultObj.menuId },
								headers: {
									'Authorization': 'Bearer ' + jwtByHRAPI,
									 'Content-Type': 'application/x-www-form-urlencoded'
								},
								success: function (result1) {
									if (result1.str == "") {
										$.ajax({
											url: (baseURL + '/api/claimForm/sendForApprove.spr'),
											data: formData,
											timeout: commonRequestTimeout,
											type: 'POST',
											contentType: false,
											processData: false,
											headers: {
												'Authorization': 'Bearer ' + jwtByHRAPI
											},
											success: function (result2) {
												$ionicLoading.hide()
												if (result2.clientResponseMsg == "OK") {
													showAlert("Application sent successfully.")
													$scope.redirectOnBack()

													return
												} else {
													$ionicLoading.hide()
													showAlert("Something went wrong. Please try later.")
													return
												}


											},

											error: function (error) {
												$ionicLoading.hide()
												showAlert(result1.str)
											}
										});
									} else {
										$ionicLoading.hide()
										showAlert(result1.str)
										return
									}
								},
								error: function (result) {
									$ionicLoading.hide()
									showAlert("Something went wrong. Please try later.")
								}
								// }
							});
						} else {
							$ionicLoading.hide()
							shhowAlert(result.msg);
						}
					}

				});
			}

		});

	}



	$scope.getBalanceOfPayHeadForNonCtc = function (ctcPayHeadId, index, fyearid) {

		//alert("PH  "+ctcPayHeadId)
		//alert("index"+index)

		var empId = parseInt(sessionStorage.getItem('empId'))
		//fyearid = 1
		fyearid = $scope.resultObj.fYearId

		$.ajax({
			url: (baseURL + '/api/ctcConfiguration/isCtcConfigurationExist.spr'),
			method: 'POST',
			timeout: commonRequestTimeout,
			transformRequest: jsonTransformRequest,
			data: { 'ctcPayHeadId': ctcPayHeadId, 'fYearId': fyearid, 'empId': empId, 'claimFlag': 'NONCTC' },
			headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI,
             	'Content-Type': 'application/x-www-form-urlencoded'
			},
			async: false,
			success: function (result) {
				if (result == 'Y') {
					$.ajax({
						url: (baseURL + '/api/claimForm/getBalanceOfPayHead.spr'),
						method: 'POST',
						timeout: commonRequestTimeout,
						transformRequest: jsonTransformRequest,
						data: { 'ctcPayHeadId': ctcPayHeadId, 'fYearId': fyearid, 'empId': empId, 'claimFlag': 'NONCTC' },
						headers: {
							'Authorization': 'Bearer ' + jwtByHRAPI,
							 'Content-Type': 'application/x-www-form-urlencoded'
						},
						async: false,
						success: function (result1) {
							$("#yearlyClaim" + index).val(result1.balanceList[0]);
							$("#ctcConfigurationExistFlag" + index).val('true');
						},
						error: function (result2) {
							showAlert("Error in getting balance.")
							return
						}


					});



				} else if (result == 'N') {
					//$("#expenseSummary").show();
					$("#ctcConfigurationExistFlag" + index).val('false');
				} else if (result == 'Kindly add Non-Ctc Payhead in Ctc Structure Configuration') {
					showAlert(result)
					$("#ctcConfigurationExistFlag" + index).val('Kindly add Non-Ctc Payhead in Ctc Structure Configuration');
				} else if ($('#ctcConfigurationExistFlag' + i).val() == 'Kindly add Employee Ctc') {
					$("#ctcConfigurationExistFlag" + index).val('Kindly add Employee Ctc');
				}
			},
			error: function (result3) {
				showAlert("Error in getting balance.")
				return
			}

		});
		/*
		$.ajax({
			url: "${pageContext.request.contextPath}/ctc/ctcConfiguration/isCtcConfigurationExist.spr",
			data: {'ctcPayHeadId': ctcPayHeadId, 'fYearId': '${fYearId}','empId': $("#empId").val(),'claimFlag':'${claimForm_Form.claimflag}'},
			type: 'POST',
			datatype: 'json',
			success:function(result1){
				if(result1 == 'Y'){
					$.ajax({
								  url: "${pageContext.request.contextPath}/claim/claimForm/getBalanceOfPayHead.spr",
							data: {'ctcPayHeadId': ctcPayHeadId, 'fYearId': '${fYearId}','empId': $("#empId").val(),'claimFlag':'${claimForm_Form.claimflag}'},
								type: 'POST',
								dataType: 'json',
								success:function(result){
									$("#expenseSummary").show();
									$("#yearlyClaims").text(result[0]);
									$("#yearlyClaim"+index).val(result[0]);
									$("#inprocessClaims").text(result[1]);
									$("#inprocessClaim"+index).val(result[1]);
									$("#approvedClaims").text(result[2]);
									$("#approvedClaim"+index).val(result[2]);
									$("#reimbursments").text(result[3]);
									$("#reimbursment"+index).val(result[3]);
									$("#accumulatedAmounts").text(parseFloat(result[4]).toFixed(2));
									$("#accumulatedAmount"+index).val(parseFloat(result[4]).toFixed(2));
									$("#balanceAmounts").text(result[5]);
									$("#balanceAmount"+index).val(result[5]);
									$("#ctcConfigurationExistFlag"+index).val('true');
									}
						});
				}else if(result1 == 'N'){
					$("#expenseSummary").show();
					$("#ctcConfigurationExistFlag"+index).val('false');
				}else if(result1=='Kindly add Non-Ctc Payhead in Ctc Structure Configuration'){
					warningMessageAlert(result1, '${alertHeader}');
					$("#ctcConfigurationExistFlag"+index).val('Kindly add Non-Ctc Payhead in Ctc Structure Configuration');
				}else if($('#ctcConfigurationExistFlag'+i).val() ==  'Kindly add Employee Ctc'){
					$("#ctcConfigurationExistFlag"+index).val('Kindly add Employee Ctc');
						}
			}
		});
		*/
	}


	$scope.checkValidClaimDate = function (claimD, periodF, periodT, id, text) {
		var textCust = '';
		var textCust = text;
		var periodFrom = stringToDate(periodF);
		var periodTo = stringToDate(periodT);
		var claimDate = stringToDate(claimD);
		if (claimDate >= periodFrom && claimDate <= periodTo) {
		}
		else {
			textCust += "\n Entered Claim Date is not Lies in Selected Period at row" + id;
		}
		return textCust;
	}



	$scope.validate = function () {

		var count = $scope.countGrid1
		var num = 0;
		text = ""
		for (var i = 0; i <= count - 1; i++) {
			if (document.getElementById("claimType" + i).value != "") {
				num++;
			}
		}
		if (num != 0) {
			for (var i = 0; i <= num - 1; i++) {
				var j = i + 1;
				if (document.getElementById("claimType" + i).value == "") {
					text += "\nPlease Select Claim Type at row " + j;
					return text
				}

				if (document.getElementById("claimMonth" + i).value == "") {
					text += "\nPlease Select Month at row " + j;
					return text

				}
				if (document.getElementById("claimYear" + i).value == "") {
					text += "\nPlease Select Year at row " + j;
					return text

				}
				if (document.getElementById("claimDate" + i).value == '') {
					text += "\n Please Select Claim Date at row " + j;
					return text

				}
				if (document.getElementById("claimAmount" + i).value == 0.0) {
					text += "\nPlease enter Claim Amount at row " + j;
					return text

				}
				else if (isNaN(document.getElementById("claimAmount" + i).value)) {
					text += "<br>Please enter Claim Amount greater than zero at row " + j;
					return text
				}
				else if (document.getElementById("claimAmount" + i).value < 0) {
					text += "\n Please enter Claim Amount greater than zero at row " + j;
					return text
				}
				else if (document.getElementById("claimAmount" + i).value == 0) {
					text += "\n Please enter Claim Amount greater than zero at row " + j;
					return text

				}

				if (document.getElementById("billAmount" + i).value == 0.0) {
					text += "\n Please enter Bill Amount at row " + j;
					return text

				}
				else if (isNaN(document.getElementById("billAmount" + i).value)) {
					text += "\n Please enter Bill Amount greater than zero at row " + j;
					return text
				}
				else if (document.getElementById("billAmount" + i).value < 0) {
					text += "\n Please enter Bill Amount greater than zero at row " + j;
					return text
				}
				else if (document.getElementById("billAmount" + i).value == 0) {
					text += "\n Please enter Bill Amount greater than zero at row " + j;
					return text

				}

				if (Number(document.getElementById("billAmount" + i).value) > 0 && Number(document.getElementById("claimAmount" + i).value) > 0
					&& Number(document.getElementById("claimAmount" + i).value) > Number(document.getElementById("billAmount" + i).value)) {
					text += "\n Claim amount can not be greater than Bill Amount";
					return text
				}
				var claimD = $("#claimDate" + i).val();


				if (claimD != "") {
					text = $scope.checkValidClaimDate(claimD, $scope.periodfromDt, $scope.periodtoDt, j, text);
					if (text != "") {
						return text
					}
				}

			}
		}
		if (num == 0) {
			text += "\n Please Fill at least one record";
			return text
		}

		return text
	}


	$scope.selectFromDeviceClicked = function (event) {
		var lastUnderScorePlace = $scope.selectedValues.elem.id.lastIndexOf('_')
		rowNo = $scope.selectedValues.elem.id.substring(lastUnderScorePlace + 1, $scope.selectedValues.elem.id.length)
		document.getElementById('inputFileUpload_' + rowNo).click()
	}

	$scope.init();
});
