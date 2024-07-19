mainModule.controller('RequestListNewCtrl', function ($scope) {
    $scope.IsLeaveAccessible = sessionStorage.getItem('IsLeaveAccessible');
    $scope.IsODAccessible = sessionStorage.getItem('IsODAccessible');
    $scope.IsRegularizationAccessible = sessionStorage.getItem('IsRegularizationAccessible');
    $scope.IsShiftChangeAccessible = sessionStorage.getItem('IsShiftChangeAccessible');
});