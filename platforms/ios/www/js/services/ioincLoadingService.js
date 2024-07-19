

mainModule.factory("ionicLoadingService", function ($ionicLoading) {

// pass integer 1 as a parameter for hideLoading function from all error blocks and the last success block of the execution cycle.
    var object = {};
    var showLoadingCount = 0;
    var hideLoadingCount = 0;
    object.showLoading = function () {
        $ionicLoading.show();
        showLoadingCount++;
//        console.log("showLoadingCount   : " + showLoadingCount);
    }
    object.hideLoading = function (last) {
        hideLoadingCount++;
        if (last == 1 && (showLoadingCount == hideLoadingCount)) {
            $ionicLoading.hide();
            showLoadingCount = 0;
            hideLoadingCount = 0;
        }
//        console.log("hideLoadingCount   : " + hideLoadingCount);
    }

//    object.displayLoadingCount = function () {
//        console.log("showLoadingCount   : "+showLoadingCount);
//        console.log("hideLoadingCount   : "+hideLoadingCount);
//    }

    return object;
});
