mainModule.factory("odErrorHandlerService", function ($rootScope, $ionicPopup, $state) {

    var object = {};
    object.showErrPopup = function (handler, callback) {
        return $ionicPopup.show({
            title: 'Connection could not be established!!',
            buttons: [
                {
                    text: '<b>Retry</b>',
                    type: 'button-positive',
                    onTap: function () {
                        handler(callback);
                    }
                }
            ]
        });
    };
    object.myPopupHandler = function (callback) {
        if ($rootScope.connectionErrorCounter < 2) {
            $rootScope.connectionErrorCounter++;
            if (navigator.connection.type != Connection.NONE) {
                callback();
                //$state.reload();
                //$rootScope.connectionErrorCounter = 0;
            }
            else {
                object.showErrPopup(object.myPopupHandler, callback);
            }
        }
        else {
            $rootScope.logout(1);
        }
    };
    object.getErrorMessage = function (data, callback) {
        if ((data.status == -1) || (data.status == 0)) {
            if ($rootScope.connectionErrorCounter >= 2) {
                $rootScope.logout(1);
            }
            else {
                object.showErrPopup(object.myPopupHandler, callback);
            }
        }
        else if (data.status == 401) {
            showAlert("Session time-out!!!", "Please login again");
            $rootScope.logout(1);
        }
        else if (data.status == 500) {
            showAlert("ERROR!!!", "Something went wrong, please try again");
        }
        else {
            showAlert("Error", "Please try again..!");
        }
    }
    return object;
});
