
mainModule.factory("getPhotoService", function ($resource) {
    return $resource((baseURL + '/api/eisCompany/checkProfilePhoto.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}},
      {});
});

/*
mainModule.factory("getDonutDataService", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/homeDashboard/getDoughnutChartData.spr'), {}, {
        'save': {
            method: 'POST',
            timeout: commonRequestTimeout,
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
            }

        }
    }, {});
}]);
*/
mainModule.factory("getDonutDataService", function ($resource) {
    return $resource((baseURL + '/api/eisCompany/getDoughnutChartData.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}},
      {});
});

/*
mainModule.factory("getDonutDataService", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/homeDashboard/getDoughnutChartData.spr'), {}, {
        'save': {
        
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
            }

        }
    }, {});
}]);
*/
mainModule.controller('myTeamDetailCtrl', function ($scope, commonService,$http, $q, $stateParams, getPhotoService, $ionicModal, getMenuInfoService, $ionicPopover, $state, $rootScope, $filter, loginCommService, $ionicLoading, getDonutDataService) {

	$rootScope.navHistoryPrevPage=$rootScope.navHistoryCurrPage
	$rootScope.navHistoryCurrPage="my_team_detail"						
			
    $scope.resultobj = {}
    $scope.retryCount = 0;
    $scope.maxData = 50;
    
    $scope.isLoadMore  = true;
    $scope.offset = 1;
    $scope.ReporteeList = [];
    $scope.searchObj = {};
    if (sessionStorage.getItem('department') && (sessionStorage.getItem('displayDeptName') == '"Department"')) {
        $scope.resultobj.department = sessionStorage.getItem('department');
    }

    $scope.getPhotos = function (index) {
        $scope.resultObject = {}
        $scope.resultObject.empId = $scope.ReporteeList[index].EmpId
        $scope.getPhotoService = new getPhotoService();
        $scope.getPhotoService.$save($scope.resultObject, function (success) {
			if (!(success.clientResponseMsg=="OK")){
				console.log(success.clientResponseMsg)
				handleClientResponse(success.clientResponseMsg,"getPhotoService")
			}	
			
            if (success.profilePhoto != null && success.profilePhoto != "")
            {
                $scope.ReporteeList[index].imageFlag = "0"
                $scope.ReporteeList[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=';
            }
            else
            {
                $scope.ReporteeList[index].imageFlag = "1"
                $scope.ReporteeList[index].profilePhoto = ""
            }
            if (!$scope.$$phase)
            {
                $scope.$apply();
            }
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

    $scope.getReporteeOnload = function () {
        $scope.reportee = {};
        
        $scope.reportee.presentDayFlag = sessionStorage.getItem('PresentDayFlag');
        if ($scope.reportee.presentDayFlag == 0) {
            $scope.reportee.fromDate = sessionStorage.getItem('DateForDoughnutList');
            var parts = $scope.reportee.fromDate.split('/');
            $scope.tDate = new Date(parts[2], parts[1] - 1, parts[0]);
            $scope.presentDate = $filter('date')($scope.tDate, 'dd-MMM-yyyy');
        }
        else {
            $scope.presentDate = $filter('date')(new Date(), 'dd-MMM-yyyy');
        }
        $scope.reportee.doughnutChartCountOrListFlag = 1;
        $scope.reportee.offset = $scope.offset;
        $scope.reportee.maxData = $scope.maxData;
        $scope.reportee.searchData = $scope.searchObj.searchLeave == null?"":$scope.searchObj.searchLeave;
		$scope.reportee.SelectedPiePieceFromDoughnut = sessionStorage.getItem("SelectedPiePieceFromDoughnut")
        $ionicLoading.show();
        var fd = new FormData();
        fd.append("presentDayFlag", $scope.reportee.presentDayFlag)
        fd.append("fromDate", $scope.reportee.fromDate)
        fd.append("maxData", 0)
        fd.append("offset", $scope.reportee.offset)
        fd.append("searchData", $scope.reportee.searchData)
        fd.append("SelectedPiePieceFromDoughnut", $scope.reportee.SelectedPiePieceFromDoughnut)
        fd.append("doughnutChartCountOrListFlag", $scope.reportee.doughnutChartCountOrListFlag)


 $scope.getDonutDataService = new getDonutDataService();
        $scope.getDonutDataService.$save($scope.reportee).then(function (data) {
           
            for (var key in data) {
                if (data[key] && data[key].Designation)
                {
                    $scope.ReporteeList.push(data[key])
                }
            }
            for (var i = 0; i < $scope.ReporteeList.length; i++) {
                $scope.getPhotos(i);
            }
            $scope.ReporteeListTotalCount  =sessionStorage.getItem('totalNoOfEmployees');
            if($scope.ReporteeListTotalCount == $scope.ReporteeList.length )
            {
                 $scope.isLoadMore = false;
            }
            $scope.isLoadMore = $scope.ReporteeList.length< $scope.maxData ? false : $scope.isLoadMore ;
            $ionicLoading.hide()
       
        }).catch(function (data) {
            if ($scope.retryCount == 0) {
                $scope.retryCount = 1;
                window.plugins.toast.showWithOptions(
                        {
                            message: "Looks like some connection problem, trying again.",
                            duration: "long",
                            position: "center",
                            addPixelsY: -40
                        }
                )
                $scope.getReporteeOnload();
            } else {
                autoRetryCounter = 0
                $ionicLoading.hide()
                commonService.getErrorMessage(data);
            }
        });



        /*
        //$scope.getDonutDataService = new getDonutDataService();
        //$scope.getDonutDataService.$save($scope.reportee).then(function (data) {
            $.ajax({
                url: baseURL + '/api/homeDashboard/getDoughnutChartData.spr',
                data: fd,
                processData: false,
                contentType: false,
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                },
                success: function (data) {
            for (var key in data) {
                if (data[key] && data[key].Designation)
                {
                    $scope.ReporteeList.push(data[key])
                }
            }
            for (var i = 0; i < $scope.ReporteeList.length; i++) {
                $scope.getPhotos(i);
            }
            $scope.ReporteeListTotalCount  =sessionStorage.getItem('totalNoOfEmployees');
            if($scope.ReporteeListTotalCount == $scope.ReporteeList.length )
            {
                 $scope.isLoadMore = false;
            }
            $scope.isLoadMore = $scope.ReporteeList.length< $scope.maxData ? false : $scope.isLoadMore ;
            $ionicLoading.hide()
        },error(err) {
			$ionicLoading.hide()
            if ($scope.retryCount == 0) {
                        $scope.retryCount = 1;
                        window.plugins.toast.showWithOptions(
                                {
                                    message: "Looks like some connection problem, trying again.",
                                    duration: "long",
                                    position: "center",
                                    addPixelsY: -40
                                }
                        )
                        $scope.getReporteeOnload();
                    } else {
                        autoRetryCounter = 0
                        $ionicLoading.hide()
                        commonService.getErrorMessage(err);
                    }
		}
	});*/
        // }).catch(function (data) {
        //     if ($scope.retryCount == 0) {
        //         $scope.retryCount = 1;
        //         window.plugins.toast.showWithOptions(
        //                 {
        //                     message: "Looks like some connection problem, trying again.",
        //                     duration: "long",
        //                     position: "center",
        //                     addPixelsY: -40
        //                 }
        //         )
        //         $scope.getReporteeOnload();
        //     } else {
        //         autoRetryCounter = 0
        //         $ionicLoading.hide()
        //         commonService.getErrorMessage(data);
        //     }
        // });
        
    };
    $scope.getReporteeOnload();
    $scope.viewEmployeeInfo = function (EmpMap)
    {
        console.log(EmpMap)
        sessionStorage.setItem('individualempId', EmpMap.EmpId)
        sessionStorage.setItem('calendarEmpName', EmpMap.EmpName);
        sessionStorage.setItem('calendarEmpCode', EmpMap.EmpCode);
        sessionStorage.setItem('isManager', 0);
        $state.go('individualCal')
    }
    $scope.redirectOnHomeDashBoard = function () {
        if ($scope.IsARTorFRT = sessionStorage.getItem('IsARTorFRT') == 'true') {
            $state.go('app.home.dashboard')
        }
        else {
            $state.go('app.home.selfService')
        }
    };

    $scope.resetData = function()
    {
       $scope.ReporteeList = [];
       $scope.offset = 1;   
       $scope.isLoadMore = true;
      if(!$scope.$$phase) {
            $scope.$apply();
          }
          $scope.getReporteeOnload();  
    }

    $scope.loadMore = function() {
        $scope.offset = $scope.offset + 1;
        $scope.reportee.offset = $scope.offset;
    
    if($scope.ReporteeListTotalCount == $scope.ReporteeList.length || $scope.maxData > $scope.ReporteeList.length )
        {
        $scope.isLoadMore = false;
        }
        if(!$scope.$$phase) {
              $scope.$apply();
            }
        $scope.getReporteeOnload();    
    };
	
/*
    $scope.$watch('searchObj.searchLeave', function(value) {
        if(value)
            {
            if(value.length>2){
                $scope.ReporteeList = []
                $scope.offset = 1;   
                $scope.isLoadMore = true;
                $scope.searchObj.searchLeave = value;
                   if(!$scope.$$phase) {
                         $scope.$apply();
                       }
                $scope.getReporteeOnload();         
             }
            //  if(value.length<2){
            //     $scope.resetData() ;
            //  }
            }
        else if(value == "")
            {
                $scope.resetData(); 
            }
         });
*/
       
});
de