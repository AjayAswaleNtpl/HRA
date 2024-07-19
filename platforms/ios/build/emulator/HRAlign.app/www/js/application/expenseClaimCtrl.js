mainModule.factory("viewClaimFormService", ['$resource', function ($resource) {
  return $resource((baseURL + '/api/claimForm/viewClaimForm.spr'), {}, {
      'save': {
          method: 'POST',
          timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
      }
  }, {});
}]);

mainModule.controller('expenseClaimCtrl', function ($scope, $rootScope, $ionicHistory,$window,
	$rootScope, $ionicPopup, $state, $http,viewClaimFormService, commonService, $q, $filter, $ionicLoading ,$timeout ,
	$ionicNavBarDelegate,$window) {
    $scope.requesObject = {}
    $scope.selectedValues = {}
    $scope.selectedValues.claimType = '';
    $scope.claimListFetched = false
	  $scope.init = function(){
    $scope.getCtcClaimApplicationList();
    $("#ctcClaimListCard").show();
    $("#nonCtcClaimListCard").hide();
    $("#ltaClaimListCard").hide();
    $("#claimApproval").removeClass("active");
    $("#claimApplication").addClass("active");
  }

  $scope.redirectOnDashboard = function () {
		$state.go('app.homeDashboard');
  }

  $scope.getNonCtcClaimApplicationList = function(){
    $("#claimApplicationIDReq").show();
    $("#noData").show();
    $("#applyClaim").show();
    $("#claimApproval").removeClass("active");
    $("#claimApplication").addClass("active");
    $scope.claimListFetched=true
    //For NON CTC
    $scope.requesObject.ctcPayHeadId = '2';
    $scope.requesObject.reqApp = 'false';
    $scope.requesObject.reqRequest = 'false';
    $scope.requesObject.fYearId = '1';
    $scope.requesObject.SelfRequestListFlag = 1;
    $scope.requesObject.menuId = '2004';
    $scope.requesObject.buttonRights = 'Y-Y-Y-Y';
    $scope.requesObject.claimFlags = 'NONCTC';

    $ionicLoading.show();
    $scope.viewClaimFormService = new viewClaimFormService();
    $scope.viewClaimFormService.$save($scope.requesObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewClaimFormService")
			}
        $scope.nonCTCClaimApplList = []
        if (data.selfClaimList === undefined)
          {
            $ionicLoading.hide();
          }else if (data.selfClaimList.length == 0 ){
				  $ionicLoading.hide();
			  }else{
          $scope.nonCTCClaimApplList = data.selfClaimList;
          for (var i = 0; i < $scope.nonCTCClaimApplList.length; i++)
          {
            if ($scope.nonCTCClaimApplList[i].fileName.length == 0){
              $scope.nonCTCClaimApplList[i].fileName == "NA"
            }
          }
          $ionicLoading.hide();
        return;

				$scope.createDate = data.selfClaimList[0].createDate;
			}
      for (var i = 0; i < $scope.nonCTCClaimApplList.length; i++)
        {
          $scope.nonCTCClaimApplList[i].designation = sessionStorage.getItem('designation')
          $scope.nonCTCClaimApplList[i].department = sessionStorage.getItem('department');
          $scope.nonCTCClaimApplList[i].empName = sessionStorage.getItem('empName');
          $scope.nonCTCClaimApplList[i].name = sessionStorage.getItem('empName');
          if (sessionStorage.getItem('photoFileName'))
            {
              $scope.nonCTCClaimApplList[i].photoFileName = sessionStorage.getItem('photoFileName')
              $scope.nonCTCClaimApplList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
            }
          else
           {
              $scope.nonCTCClaimApplList[i].photoFileName = ''
              $scope.nonCTCClaimApplList[i].profilePhoto = ''
           }
				}
			  // $scope.getRequestCounts()
           $ionicLoading.hide()
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
  }

  $scope.getLtaClaimApplicationList = function(){
    $("#claimApplicationIDReq").show();
    $("#noData").show();
    $("#applyClaim").show();
    $("#claimApproval").removeClass("active");
    $("#claimApplication").addClass("active");
    $scope.claimListFetched=true
    //For LTA
    $scope.requesObject.ctcPayHeadId = '3';
    $scope.requesObject.reqApp = 'false';
    $scope.requesObject.reqRequest = 'false';
    $scope.requesObject.fYearId = '1';
    $scope.requesObject.SelfRequestListFlag = 1;
    $scope.requesObject.menuId = '2009';
    $scope.requesObject.buttonRights = 'Y-Y-Y-Y';
    $scope.requesObject.claimFlags = 'LTACLAIM';

    $ionicLoading.show();
    $scope.viewClaimFormService = new viewClaimFormService();
    $scope.viewClaimFormService.$save($scope.requesObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewClaimFormService")
			}
        $scope.ltaClaimApplList = []
        if (data.selfClaimList === undefined)
          {
            $ionicLoading.hide();
          }else if (data.selfClaimList.length == 0 ){
				  $ionicLoading.hide();
			  }else{
          $scope.ltaClaimApplList = data.selfClaimList;
          for (var i = 0; i < $scope.ltaClaimApplList.length; i++)
          {
            if ($scope.ltaClaimApplList[i].fileName.length == 0){
              $scope.ltaClaimApplList[i].fileName == "NA"
            }
          }
          $ionicLoading.hide();
        return;

				$scope.createDate = data.selfClaimList[0].createDate;
			}
      for (var i = 0; i < $scope.ltaClaimApplList.length; i++)
        {
          $scope.ltaClaimApplList[i].designation = sessionStorage.getItem('designation')
          $scope.ltaClaimApplList[i].department = sessionStorage.getItem('department');
          $scope.ltaClaimApplList[i].empName = sessionStorage.getItem('empName');
          $scope.ltaClaimApplList[i].name = sessionStorage.getItem('empName');
          if (sessionStorage.getItem('photoFileName'))
            {
              $scope.ltaClaimApplList[i].photoFileName = sessionStorage.getItem('photoFileName')
              $scope.ltaClaimApplList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
            }
          else
           {
              $scope.ltaClaimApplList[i].photoFileName = ''
              $scope.ltaClaimApplList[i].profilePhoto = ''
           }
				}
			  // $scope.getRequestCounts()
           $ionicLoading.hide()
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
  }

  $scope.getCtcClaimApplicationList = function(){
    $("#claimApplicationIDReq").show();
    $("#noData").show();
    $("#applyClaim").show();
    $("#ctcClaimListCard").show();
    $("#nonCtcClaimListCard").hide();
    $("#ltaClaimListCard").hide();
    $("#claimApproval").removeClass("active");
    $("#claimApplication").addClass("active");
    $scope.claimListFetched=true
    $scope.requesObject.SelfRequestListFlag = 1;
    $scope.requesObject.reqRequest = 'false';
    //For CTC
    $scope.requesObject.ctcPayHeadId = '1';
    $scope.requesObject.reqApp = 'false';
    $scope.requesObject.fYearId = '1';
    $scope.requesObject.menuId = '2009';
    $scope.requesObject.buttonRights = 'Y-Y-Y-Y';
    $scope.requesObject.claimFlags = 'CTC';

    $ionicLoading.show();
    $scope.viewClaimFormService = new viewClaimFormService();
    $scope.viewClaimFormService.$save($scope.requesObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewClaimFormService")
			}
        $scope.ctcClaimApplList = []
        if (data.selfClaimList === undefined)
          {
            $ionicLoading.hide();
          }else if (data.selfClaimList.length == 0 ){
				  $ionicLoading.hide();
			  }else{
          $scope.ctcClaimApplList = data.selfClaimList;
          for (var i = 0; i < $scope.ctcClaimApplList.length; i++)
          {
            if ($scope.ctcClaimApplList[i].fileName.length == 0){
              $scope.ctcClaimApplList[i].fileName == "NA"
            }
          }
          $ionicLoading.hide();
        return;

				$scope.createDate = data.selfClaimList[0].createDate;
			}
      for (var i = 0; i < $scope.ctcClaimApplList.length; i++)
        {
          $scope.ctcClaimApplList[i].designation = sessionStorage.getItem('designation')
          $scope.ctcClaimApplList[i].department = sessionStorage.getItem('department');
          $scope.ctcClaimApplList[i].empName = sessionStorage.getItem('empName');
          $scope.ctcClaimApplList[i].name = sessionStorage.getItem('empName');
          if (sessionStorage.getItem('photoFileName'))
            {
              $scope.ctcClaimApplList[i].photoFileName = sessionStorage.getItem('photoFileName')
              $scope.ctcClaimApplList[i].profilePhoto = sessionStorage.getItem('profilePhoto');
            }
          else
           {
              $scope.ctcClaimApplList[i].photoFileName = ''
              $scope.ctcClaimApplList[i].profilePhoto = ''
           }
				}
			  // $scope.getRequestCounts()
           $ionicLoading.hide()
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
  }
  $scope.getCClaimList = function(){
    $scope.getCtcClaimApplicationList();
    $("#ctcClaimListCard").show();
    $("#nonCtcClaimListCard").hide();
    $("#ltaClaimListCard").hide();
  }
  $scope.getNClaimList = function(){
    $scope.getNonCtcClaimApplicationList();

    $("#ctcClaimListCard").hide();
    $("#nonCtcClaimListCard").show();
    $("#ltaClaimListCard").hide();
  }
  $scope.getLClaimList = function(){
    $scope.getLtaClaimApplicationList();

      $("#ctcClaimListCard").hide();
      $("#nonCtcClaimListCard").hide();
      $("#ltaClaimListCard").show();
  }


  $scope.getClaimList = function(){

    if ($scope.selectedValues.claimType =="ctcSelect"){
      $scope.getCtcClaimApplicationList();
      $("#ctcClaimListCard").show();
      $("#nonCtcClaimListCard").hide();
      $("#ltaClaimListCard").hide();
    } else if($scope.selectedValues.claimType =="nonCtcSelect"){
      $scope.getNonCtcClaimApplicationList();

      $("#ctcClaimListCard").hide();
      $("#nonCtcClaimListCard").show();
      $("#ltaClaimListCard").hide();
    }
    else if($scope.selectedValues.claimType =="ltaSelect"){
      $scope.getLtaClaimApplicationList();

      $("#ctcClaimListCard").hide();
      $("#nonCtcClaimListCard").hide();
      $("#ltaClaimListCard").show();
  } else{
    }
  }

  $scope.getClaimApproval = function(){
    $("#noData").hide();
    $("#applyClaim").hide();
    $("#claimApplication").removeClass("active");
    $("#claimApproval").addClass("active");
  }

  $scope.reDirectToNewCTCClaimPage = function ()
  {
    $state.go('newCTCClaimApplication')
  }

  $scope.reDirectToNewNonCTCClaimPage = function ()
  {
    $state.go('newNonCTCClaimApplication')
  }

  $scope.reDirectToNewLTAClaimPage = function ()
  {
    $state.go('newLTAClaimApplication')
  }

  $scope.refreshClaimList = function(){
    $scope.claimListFetched = false
		$scope.getClaimList()
	}
	$scope.init();
});
