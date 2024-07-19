/*
 1.This controller is used to show the list of Birthdays / Anniversaries.
 */

mainModule.factory("getBirthdaysAndAnniversareisService", function ($resource) {
    return $resource((baseURL + '/api/SelfService/birthdays_Anniversaries.spr'), {}, 
    {'save': {method: 'POST', timeout: commonRequestTimeout,
    headers: {
        'Authorization': 'Bearer ' + jwtByHRAPI
     }
    }}, {});
});
mainModule.factory("getPhotoService", function ($resource) {
    return $resource((baseURL + '/api/eisCompany/checkProfilePhoto.spr'), {}, 
    {'save': {method: 'POST', timeout: commonRequestTimeout,
    headers: {
        'Authorization': 'Bearer ' + jwtByHRAPI
     }
    }}, {});
});
mainModule.factory("getWorkAniversaryData", function ($resource) {
    return $resource((baseURL + '/api/homeDashboard/getEmpDashboardData.spr'), {}, 
    {'save': {method: 'POST', timeout: commonRequestTimeout,
    headers: {
        'Authorization': 'Bearer ' + jwtByHRAPI
     }
    }}, {});
});
mainModule.controller('BirthDayAndAnniversaryCtrl', function ($scope, getPhotoService, commonService, getBirthdaysAndAnniversareisService, $ionicLoading,getWorkAniversaryData ) {
    $scope.bdayList = []
    $scope.anniversaryList = []
	$scope.workaniList = []
	
    $scope.searchText  = true;
    $scope.isLoadMore = true;
	$scope.isLoadMoreAnn = true;
	$scope.isLoadMoreWorkAnn = true;
    if (sessionStorage.getItem('department') && (sessionStorage.getItem('displayDeptName') == '"Department"')) {
        $scope.resultobj.department = sessionStorage.getItem('department');
    }

    function sortListByNameAndDate(dataList)
    {
        for(var i=0;i < dataList.length;i++){
            dataList[i].filterDate = new Date(dataList[i].filterDate);

        }
        for(var i=0;i < dataList.length;i++){
            for(var j=1 ;j<(dataList.length-i); j++){
                
            if( parseInt(dataList[j-1].filterDate.getDate()+dataList[j-1].filterDate.getMonth()*30) >  parseInt(dataList[j].filterDate.getDate()+dataList[j].filterDate.getMonth()*30) ){
                
                $scope.temp = dataList[j-1];
                dataList[j-1] = dataList[j];
                dataList[j] = $scope.temp;
           }
        }
        }
        
        for(var i=0;i < dataList.length;i++){
            for(var j=1 ;j<(dataList.length-i); j++){
                if( parseInt(dataList[j-1].filterDate.getMonth()) ==  parseInt(dataList[j].filterDate.getMonth()) ){
            if( parseInt(dataList[j-1].filterDate.getDate()) ==  parseInt(dataList[j].filterDate.getDate()) ){
                
                if(dataList[j-1].empName.toUpperCase() > dataList[j].empName.toUpperCase()){
                
                $scope.temp = dataList[j-1];
                dataList[j-1] = dataList[j];
                dataList[j] = $scope.temp;
                    }
                 }
            }
         }
        }

        return dataList;
    }

function sortListByNameAndDateForWorkAni(dataList)
    {
        for(var i=0;i < dataList.length;i++){
            dataList[i].workDate = new Date(dataList[i].workDate);

        }
        for(var i=0;i < dataList.length;i++){
            for(var j=1 ;j<(dataList.length-i); j++){
                
            if( parseInt(dataList[j-1].workDate.getDate()+dataList[j-1].workDate.getMonth()*30) >  parseInt(dataList[j].workDate.getDate()+dataList[j].workDate.getMonth()*30) ){
                
                $scope.temp = dataList[j-1];
                dataList[j-1] = dataList[j];
                dataList[j] = $scope.temp;
           }
        }
        }
        
        for(var i=0;i < dataList.length;i++){
            for(var j=1 ;j<(dataList.length-i); j++){
                if( parseInt(dataList[j-1].workDate.getMonth()) ==  parseInt(dataList[j].workDate.getMonth()) ){
            if( parseInt(dataList[j-1].workDate.getDate()) ==  parseInt(dataList[j].workDate.getDate()) ){
                
                if(dataList[j-1].empName.toUpperCase() > dataList[j].empName.toUpperCase()){
                
                $scope.temp = dataList[j-1];
                dataList[j-1] = dataList[j];
                dataList[j] = $scope.temp;
                    }
                 }
            }
         }
        }

        return dataList;
    }
	
    $scope.getPhotos = function (index) {
        $scope.resultObject = {}
        $scope.resultObject.empId = $scope.bdayList[index].empId

        $scope.getPhotoService = new getPhotoService();
        $scope.getPhotoService.$save($scope.resultObject, function (success) {
			
			if (!(success.clientResponseMsg=="OK")){
				console.log(success.clientResponseMsg)
				handleClientResponse(success.clientResponseMsg,"getPhotoService")
			}	
			
            if (success.profilePhoto != null && success.profilePhoto != "")
            {
                $scope.bdayList[index].imageFlag = "0"
                $scope.bdayList[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=';
            }

            else
            {
                $scope.bdayList[index].imageFlag = "1"
                $scope.bdayList[index].profilePhoto = ""
            }
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }

    $scope.getAnniversaryPhotos = function (indexOfAnniversary) {
        $scope.resultAnniversaryObject = {}
        $scope.resultAnniversaryObject.empId = $scope.anniversaryList[indexOfAnniversary].empId

        $scope.getPhotoService = new getPhotoService();
        $scope.getPhotoService.$save($scope.resultAnniversaryObject, function (success) {
            if (success.profilePhoto != null && success.profilePhoto != "")
            {
                $scope.anniversaryList[indexOfAnniversary].imageFlag = "0"
                $scope.anniversaryList[indexOfAnniversary].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=';
            }

            else
            {
                $scope.anniversaryList[indexOfAnniversary].imageFlag = "1"
                $scope.anniversaryList[indexOfAnniversary].profilePhoto = ""
            }
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
	
	$scope.getWorkAnniversaryPhotos = function (indexOfWorkAnniversary) {
        $scope.resultWorkAnniversaryObject = {}
        $scope.resultWorkAnniversaryObject.empId = $scope.workaniList[indexOfWorkAnniversary].empId

        $scope.getPhotoService = new getPhotoService();
        $scope.getPhotoService.$save($scope.resultWorkAnniversaryObject, function (success) {
            if (success.profilePhoto != null && success.profilePhoto != "")
            {
                $scope.workaniList[indexOfWorkAnniversary].imageFlag = "0"
                $scope.workaniList[indexOfWorkAnniversary].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=';
            }

            else
            {
                $scope.workaniList[indexOfWorkAnniversary].imageFlag = "1"
                $scope.workaniList[indexOfWorkAnniversary].profilePhoto = ""
            }
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }	
	
	
	
    $scope.getBirthAniDataOnLoad = function () {
        $ionicLoading.show({});
//        $scope.companyId = sessionStorage.getItem('companyId')
        $scope.getBirthdaysAndAnniversareisService = new getBirthdaysAndAnniversareisService();
        $scope.getBirthdaysAndAnniversareisService.$save({}, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"getBirthdaysAndAnniversareisService")
			}				

            autoRetryCounter = 0;
            if (!data.anniList && !data.bdayList)
            {
                $ionicLoading.hide()
                return;
            }
          
            
            $scope.bdayList = sortListByNameAndDate(data.bdayList);
            $scope.anniversaryList = sortListByNameAndDate(data.anniList);
            $scope.dirctLimit = 50;
            $scope.anniverLimit = 50;
			
            
            
            var index = 0
            //while (index != $scope.bdayList.length) {
			while (index != $scope.dirctLimit) {
				
                $scope.getPhotos(index)
                index++
            }
			

            var indexOfAnniversary = 0
            //while (indexOfAnniversary != $scope.anniversaryList.length) {
			while (indexOfAnniversary != $scope.anniverLimit) {
                $scope.getAnniversaryPhotos(indexOfAnniversary)
                indexOfAnniversary++
            }
			 $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        })
    }
	
    $scope.getWorkAniDataOnLoad = function () {
        $ionicLoading.show({});
        $scope.companyId = sessionStorage.getItem('companyId')
        $scope.getWorkAniversaryData = new getWorkAniversaryData();
        $scope.getWorkAniversaryData.$save($scope.companyId, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"getBirthdaysAndAnniversareisService")
			}				

            autoRetryCounter = 0;
            if (!data.bdayList)
            {
                $ionicLoading.hide()
                return;
            }
            $ionicLoading.hide()
            
			$scope.tempWAlist = []
            $scope.tempWAlist = sortListByNameAndDateForWorkAni(data.bdayList);
            $scope.workanniverLimit = 50;
			
			
			for(var i=0;i<$scope.tempWAlist.length;i++){
				if ($scope.tempWAlist[i].type=="J"){
					$scope.workaniList.push($scope.tempWAlist[i])
				}
				else{
					continue
				}
			}
			

            
            var indexOfWorkAnniversary = 0
            //while (indexOfWorkAnniversary != $scope.workaniList.length) {
			while (indexOfWorkAnniversary != $scope.workanniverLimit) {
                $scope.getWorkAnniversaryPhotos(indexOfWorkAnniversary)
                indexOfWorkAnniversary++
            }
			
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }	
    

    

    $scope.loadMore = function() {
		
        $scope.dirctLimit = $scope.dirctLimit + 50;
    if($scope.dirctLimit === $scope.bdayList.length || $scope.dirctLimit > $scope.bdayList.length )
        {
			$scope.isLoadMore = false;
        }
		var index = $scope.dirctLimit - 50
            //while (index != $scope.bdayList.length) {
			while (index != $scope.dirctLimit) {
				
                $scope.getPhotos(index)
                index++
            }
		
        if(!$scope.$$phase) {
              $scope.$apply();
            }
    };
    $scope.loadMoreAnn = function() {
		
        $scope.anniverLimit = $scope.anniverLimit + 50;
    if($scope.anniverLimit === $scope.anniversaryList.length || $scope.anniverLimit > $scope.anniversaryList.length )
        {
        $scope.isLoadMoreAnn = false;
        }
		var indexOfAnniversary = $scope.anniverLimit + 50
            //while (indexOfAnniversary != $scope.anniversaryList.length) {
			while (indexOfAnniversary != $scope.anniverLimit) {
                $scope.getAnniversaryPhotos(indexOfAnniversary)
                indexOfAnniversary++
            }
        if(!$scope.$$phase) {
              $scope.$apply();
            }
    };

	$scope.loadMoreWorkAnn = function() {
		
        $scope.workanniverLimit = $scope.workanniverLimit + 50;
    if($scope.workanniverLimit === $scope.workaniList.length || $scope.workanniverLimit > $scope.workaniList.length )
        {
        $scope.isLoadMoreWorkAnn = false;
        }
		var indexOfWorkAnniversary = $scope.workanniverLimit - 50
            //while (indexOfWorkAnniversary != $scope.workaniList.length) {
			while (indexOfWorkAnniversary != $scope.workanniverLimit) {
                $scope.getWorkAnniversaryPhotos(indexOfWorkAnniversary)
                indexOfWorkAnniversary++
            }
			
        if(!$scope.$$phase) {
              $scope.$apply();
            }
    };	

    $scope.showBirthDay = function()
    {
		$("#birthDayList").show();
        $("#anniversayList").hide();
		$("#workaniList").hide();
		
        $("#tabBirthdays").addClass("active");
        $("#tabAnniversaries").removeClass("active");
		$("#tabAnniversaries").removeClass("active");
    }
    $scope.showAnniversay = function()
    {
        $("#anniversayList").show();
        $("#birthDayList").hide();
		$("#workaniList").hide();
		
		$("#tabAnniversaries").addClass("active");
        $("#tabBirthdays").removeClass("active");
		$("#tabWorkAni").removeClass("active");
        
		
    }
	$scope.showWorkAni = function()
    {
		
		$("#workaniList").show();
        $("#anniversayList").hide();
        $("#birthDayList").hide();
		
        $("#tabWorkAni").addClass("active");
        $("#tabAnniversaries").removeClass("active");
		$("#tabBirthdays").removeClass("active");
		
    }
    $scope.initilize = function()
    {
		$scope.showBirthDay()
        /*$("#birthDayList").show();
        $("#anniversayList").hide();
		$("#workaniList").hide();
		
        $("#tabBirthdays").addClass("active");
        $("#tabAnniversaries").removeClass("active");
		$("#tabWorkAni").removeClass("active");
		*/
    }
    $scope.initilize();
	$scope.getBirthAniDataOnLoad();
	$scope.getWorkAniDataOnLoad();
	
	


});