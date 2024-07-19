

mainModule.controller('restoreParamsCtrl', function ($scope, $ionicPopup, $ionicLoading) {


    $scope.restoreParams = function () {
        console.log("restoreing")

        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure',
            template: 'Do you want to Reload Context?', //Message
        });

        confirmPopup.then(function (res) {
            if (res) {
                $ionicLoading.show();
                var fd = new FormData();
                fd.append("menuId", 2903)
                fd.append("buttonRights", "Y-Y-Y-Y")
                fd.append("settingCurrentTab", "0")


                $.ajax({
                    url: baseURL + '/settingConfiguration/reloadProjectContext.spr',
                    data: fd,
                    type: 'POST',
                    timeout: commonRequestTimeout,
                    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                    processData: false, // NEEDED, DON'T OMIT THIS
                    headers: {
                        'Authorization': 'Bearer ' + jwtByHRAPI
                     },
                    success: function (result) {
                        if (!(result == "OK")) {
                            console.log(result.clientResponseMsg)
                            handleClientResponse(result.clientResponseMsg, "reloadProjectContext")
                            $ionicLoading.hide()
                            showAlert("Something went wrong. Please try later.\n" + result)
                            return
                        }

                        showAlert("Reloading of Context done.")
                        $ionicLoading.hide()
                    },
                    error: function (res) {
                        $ionicLoading.hide()
                        showAlert("Something went wrong while fetching the file.");
                    }

                });
            } else {
                return
            }
        });

    }
});