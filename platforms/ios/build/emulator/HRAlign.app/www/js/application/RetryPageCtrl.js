/*
 1.This controller is used to show the retry option when connection is lost or not there.
 */

mainModule.controller('RetryPageCtrl', function ($scope, $state) {
    autoRetryCounter = 0;
    $scope.retry = function ()
    {
        $scope.retryToPage = sessionStorage.getItem('currentstatename');
        if (navigator.connection.type != Connection.NONE) {
            $state.go($scope.retryToPage);
        } else {
            showAlert("Connection error", "Connection could not be established.");
        }
    }
    $scope.redirectToHomePage = function ()
    {
        $state.go('app.home.dashboard');
    }
});

