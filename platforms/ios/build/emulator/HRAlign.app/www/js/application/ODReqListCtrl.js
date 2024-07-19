mainModule.factory("getYearListService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/odApplication/getYearList.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("viewODApplicationService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/odApplication/getODApplication.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.controller('ODReqListCtrl', function ($scope, $state, commonService, getYearListService, getYearListService, viewODApplicationService, viewLeaveApplicationService, detailsService, $ionicPopup, getSetService, $ionicLoading) {
    $scope.requesObject1 = {};
    var odMenuInfo = getMenuInformation("Attendance Management", "OD Application");
    $scope.requesObject1.menuId = odMenuInfo.menuId;
    $scope.requesObject1.year = "" + new Date().getFullYear();
    $scope.requesObject1.level = 1
    $scope.getODApplicationList = function () {
        $scope.searchObj = '';
        $("#ShiftChangeRequestID").hide();
        $("#leaveApplicationID").hide();
        $("#RegularizationApplicationID").hide();
        $("#ODApplicationID").show();
        $("#tabOD").addClass("active");
        $("#tabLeave").removeClass("active");
        $("#tabRegularization").removeClass("active");
        $("#tabShiftApplication").removeClass("active");
        $ionicLoading.show({template: 'Loading'});

        $scope.getYearListService = new getYearListService();
        $scope.getYearListService.$save(function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"getYearListService")
			}

			$scope.yearList = []			
			if(data.yearList===undefined){
				//do nothing
			}else{
				$scope.yearList = data.yearList
			}
            
            
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
        $scope.viewODApplicationService = new viewODApplicationService();
        $scope.viewODApplicationService.$save($scope.requesObject1, function (data) {
			
			$scope.ODApplList = []
			if(data.odApplicationVoList===undefined){
				//do nothing
			}else{
				$scope.ODlList = data.odApplicationVoList
			}
            $("#ODApplicationID").show();
            
            for (var i = 0; i < $scope.ODlList.length; i++)
            {
                $scope.ODlList[i].designation = sessionStorage.getItem('designation')
                $scope.ODlList[i].department = sessionStorage.getItem('department');
                $scope.ODlList[i].empName = sessionStorage.getItem('empName');
                $scope.ODlList[i].name = sessionStorage.getItem('empName');
                if (sessionStorage.getItem('photoFileName'))
                {
                    $scope.ODlList[i].photoFileName = sessionStorage.getItem('photoFileName')
                    $scope.ODlList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
                }
                else
                {
                    $scope.ODlList[i].photoFileName = ''
                    $scope.ODlList[i].profilePhoto = ''
                }
            }
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    };
    $scope.getODApplicationList();
    $scope.reDirectToODApplictaionPage = function ()
    {
        $state.go('odApplication')
    }
    $scope.redirectOnTabOd = function () {
//        $scope.resultSaveObj.check = "OD";
//        getSetService.set($scope.resultSaveObj)
        $state.go('app.RequestListNew')
    }
});