
mainModule.controller("introCtrl", function ($scope, $state, $rootScope, $window, $ionicPopup, $location, $filter, $ionicLoading, $ionicModal,$timeout) {
    $scope.regex = /(?:http(s)?\:\/\/)/i;
			StatusBar.hide()
				$timeout(function () {$scope.gotologin()},1800)
    $scope.gotologin = function()
	{
		$state.go('startUpPage');
		
		StatusBar.show()
	}		
 });
