/*
 1.This controller is used to show the list of Holidays.
 */

mainModule.factory("getEmpDirService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/homeDashboard/getReporteeEmployeeDirectoryList.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);

mainModule.factory("getPhotoService", function ($resource) {
    return $resource((baseURL + '/api/eisCompany/checkProfilePhoto.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});	

mainModule.factory("viewPhotoService", function ($resource) {
    return $resource((baseURL + '/api/eisPersonal/viewPhoto.spr'), {}, {'save': {method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }}}, {});
});	
mainModule.controller('employeeDirectoryCtrl', function ($scope, commonService, getEmpDirService, $ionicLoading,getPhotoService,$ionicPopup,$http,viewPhotoService ) {
    
    $scope.dirctLimit = 50;	
	$scope.searchText  = true;
    $scope.isLoadMore = true;
	$scope.searchObj = {}
	$scope.searchObj.searchEmp=""
	
	$scope.init = function () {	
    $scope.base_url= baseURL
    $ionicLoading.show();
    $scope.getEmpDirService = new getEmpDirService();
    $scope.getEmpDirService.$save("", function (data) {
		if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"getEmpDirService")
			}
			
		$scope.empList =  JSON.parse(data.jsonStr)
		$scope.searchText=true
		var index = $scope.dirctLimit - 50
		var ctr =0//max 50
		while (index != $scope.empList.length) {
                $scope.getPhotos(index)
                index++
				ctr++
				if (ctr == 51){
					index = $scope.empList.length
				}
        }
        $ionicLoading.hide()
    }, function (data) {
        autoRetryCounter = 0
        $ionicLoading.hide()
        commonService.getErrorMessage(data);
    });
	
	}
	
	$scope.loadMore = function() {
		
        $scope.dirctLimit = $scope.dirctLimit + 50;
    if($scope.dirctLimit == $scope.empList.length || $scope.dirctLimit > $scope.empList.length )
        {
			$scope.searchText = false;
        }

		var index = $scope.dirctLimit - 50
		var ctr =0//max 50
		while (index != $scope.empList.length) {
                $scope.getPhotos(index)
                index++
				ctr++
				if (ctr == 51){
					index = $scope.empList.length
				}
        }
        $ionicLoading.hide()
		
        if(!$scope.$$phase) {
              $scope.$apply();
            }
    };	
	
    $scope.getPhotos = function (index) {
        $scope.resultObject = {}
		if ($scope.empList[index] === undefined)
		{
			return
		}
		if ($scope.empList[index].photoFileName==null){
			return
		}
        $scope.resultObject.empId = $scope.empList[index].empId
		$scope.empList[index].photoFileName=baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + $scope.resultObject.empId  + ''
		return
		/*
        $scope.getPhotoService = new getPhotoService();
        $scope.getPhotoService.$save($scope.resultObject, function (success) {
			
			if (!(success.clientResponseMsg=="OK")){
				console.log(success.clientResponseMsg)
				handleClientResponse(success.clientResponseMsg,"getPhotoService")
			}	
			
            if (success.profilePhoto != null && success.profilePhoto != "")
            {
                $scope.empList[index].imageFlag = "0"
                $scope.empList[index].profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + $scope.resultObject.empId;
            }

            else
            {
                $scope.empList[index].imageFlag = "1"
                $scope.empList[index].profilePhoto = ""
            }
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });*/
    }
	
      //////////// Contact  info pop up  ///////////////
		$scope.showContactInfoPopup = function (emp) {
			
			$scope.popupTitle = emp.name + " ("+ emp.empCode + ")"
			$scope.email = emp.companyEmailId
			$scope.mobileNumber = emp.residencePhone
			if ($scope.email=="") $scope.email=" - "
			if ($scope.mobileNumber=="") $scope.mobileNumber=" "
			
			var myPopUp = $ionicPopup.show({
			template: 
			'<div style="text-align:left;"><i class="icon ion-ios-email-outline"  style="font-size: 193%;margin-top:5%;">&nbsp;</i><p style="margin-top: -13%;margin-left: 15%;">{{email}}</p><i class="icon ion-ios-telephone-outline" align="center" style="font-size: 193%;" >&nbsp;</i><p style="margin-top: -13%;margin-left: 15%;margin-bottom: 10%">{{mobileNumber}} </p></div>',
				title: $scope.popupTitle,
                scope: $scope,
                buttons: [
                    {
                        text: '<b>Close</b>',
                        type: 'button-positive',
                        onTap: function (e) {
							$scope.closeModal();
                        }
                    }
                ]
            });	
		}
		$scope.closeModal = function (index) {
        if (index == 1)
            $scope.myPopUp.hide();
		};	
	//////////////////////////
	
	
	//search
	$scope.employee = function(input) {
		$http({
	        method : "POST",
	        url : (baseURL +"/api/homeDashboard/getEmployeeDefaultList.spr?input="+input),
	        timeout: commonRequestTimeout,
            transformRequest: jsonTransformRequest,
            data: input,
            headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Bearer ' + jwtByHRAPI
				}



				
	        
	    }).success(function (data) {
	    	 //$('#employeeDirectoryId').hide();
	    	 $scope.searchText = false;
			 $scope.robjectList=[]
	    	 $scope.robjectList=data;
			 $scope.empList = $scope.robjectList
			 
			var index = 0
				while (index != $scope.empList.length) {
                $scope.getPhotos(index)
                index++
			}
		
	    	 if(!$scope.$$phase) 
				  $scope.$apply();
	    	
	    }).error(function (data, status) {
                        $scope.data = {status: status};
                        commonService.getErrorMessage($scope.data);
                        $ionicLoading.hide()
	    });
	
	    
	  };	
	  
	  
	$scope.$watch('searchObj.searchEmp', function(value) {
	 if(value)
		 {
		 if(value.length>2){
			  //$('#employeeDirectoryId').show();
			  $scope.employee(value);
		  }
		  if(value.length<1){
			  $scope.dirctLimit = 50;
			  $scope.searchText = true;
			  //$scope.robjectList = angular.copy($scope.reporteeList);
			  $scope.init()
				if(!$scope.$$phase) {
					  $scope.$apply();
					}
		  }
		 }
	 else
		 {
		 $scope.init()
		 $scope.dirctLimit = 50;
		 $scope.searchText = true;
		 //$scope.robjectList =angular.copy($scope.reporteeList);
			if(!$scope.$$phase) {
				  $scope.$apply();
				}
		 }
	  });	  
	  
	  
	$scope.init()	
	
	

});


