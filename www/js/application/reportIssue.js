
mainModule.factory("sendIssueToServer", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/email/reportIssue.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.controller('reportIssueCtrl', function ($scope, commonService, $ionicPopup, $ionicLoading,  sendIssueToServer) {
	$scope.requestObject = {}
	$scope.requestObject.issue_message="";
	$scope.requestObject.issue_message_entered=""
	$scope.requestObject.domainVersion=  sessionStorage.getItem('appVersion')
	$scope.requestObject.appVersion=  appVersion
	$scope.requestObject.fullName=	sessionStorage.getItem('empName')
	$scope.requestObject.empId=   sessionStorage.getItem('empId')
	$scope.requestObject.connectionURL= localStorage.getItem("BaseUrl")
	//$scope.requestObject.companyName
	
		
    $scope.sendIssue = function () {
		console.log("Sending Issue")
		if ($scope.requestObject.issue_message_entered =="")
		{
			showAlert("","Please type in your issue/feedback");
			return;
		}		
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure',
            template: 'Do you want to send?', //Message
        });
		
        confirmPopup.then(function (res) {
            if (res) {
				$scope.requestObject.issue_message =  $scope.requestObject.issue_message_entered.replace(/\r?\n/g, '<br />');
                $ionicLoading.show();
                $scope.sendIssueToServer = new sendIssueToServer();
                $scope.sendIssueToServer.$save($scope.requestObject, function (data) {
					
                    $ionicLoading.hide()
					if (!(data.clientResponseMsg=="OK")){
						$scope.requestObject.issue_message_entered = ""
						showAlert("", "Issue / Feedback could NOT be reported, Please contact admin.")
					}else{
						$scope.requestObject.issue_message_entered = ""
						showAlert("", data.msg)
						
					}

					$scope.requestObject.issue_message_entered = ""
					document.getElementById("txtIssue").value = ""
					
                }, function (data) {
					//showAlert("Report Issue/Feedback", data.msg)
					showAlert("", data.msg)
                    autoRetryCounter = 0
                    $ionicLoading.hide()
                    commonService.getErrorMessage(data);
                });
                
            } else {
                //showAlert("Report Issue/Feedback", "Issue/Feedback couldn't be sent");
                return;
            }
        });
    }
});