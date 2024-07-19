/*
 1.This controller is used to show the list of Holidays.
 */

mainModule.factory("getHolidayService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/holiday/getAssignedHoliday.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);

mainModule.controller('HolidaysCtrl', function ($scope, commonService, getHolidayService, $ionicLoading,$timeout) {
    $scope.requestObject = {}
    var holidayMenuInfo = getMenuInformation("Leave Management", "Assign Holiday");
    $scope.requestObject.menuId = holidayMenuInfo.menuId;
    $scope.requestObject.buttonRights = "Y-N-N-N"
    $scope.requestObject.year = "" + new Date().getFullYear();
    $scope.requestObject.companyId = sessionStorage.getItem('companyId');
    $scope.requestObject.holidayCategoryId = sessionStorage.getItem('holidayCategoryId');
	$scope.requestObject.empId = sessionStorage.getItem('empId');
    $ionicLoading.show();
    $scope.getHolidayService = new getHolidayService();
    $scope.getHolidayService.$save($scope.requestObject, function (data) {
		
		if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"getHolidayService")
		}
        $scope.holidayList = []
		if (data.list ===undefined){
			//do nothing
		}else{
            $scope.holidayList = data.list;
            var todayDate = new Date();
            $timeout(function () {
                for(i=0;i<$scope.holidayList.length;i++){
                    var dt = $scope.holidayList[i].frmtDate.split("/")
                    var date = new Date(dt[2],dt[1]-1,dt[0])
                    console.log(date)
                    console.log(todayDate)
                    if(date>todayDate){
                        document.getElementById("holidayCard__"+i).style.backgroundColor="#b3e6ff"
                        document.getElementById("holidayCard2__"+i).style.backgroundColor="#b3e6ff"
                        return;
                    }
                }          
                
                
            }, 500)
            

        
        
        }
        
        $ionicLoading.hide()
    }, function (data) {
        autoRetryCounter = 0
        $ionicLoading.hide()
        commonService.getErrorMessage(data);
    });
});


