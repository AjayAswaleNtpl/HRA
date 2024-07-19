/*
 1.This controller is used for Check-In/Check-Out functionality.
 2.Data is stored offline with the help of SqLite plugin.
 */

mainModule.factory("getSignInValidateService", function ($resource) {
    return $resource((baseURL + '/api/signin/isTodaySignIn.spr'), {},
        {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                }
            }
        }, {});
});
mainModule.factory("getSignInService", function ($resource) {
    return $resource((baseURL + '/api/signin/signInSignOut.spr'), {},
        {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                }
            }
        }, {});
});
mainModule.factory("getSignInServiceWitSelfie", function ($resource) {
    return $resource((baseURL + '/api/signin/signInSignOutWithSelfie.spr'), {},
        {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                }
            }
        }, {});
});
mainModule.factory("getSignOutValidateService", function ($resource) {
    return $resource((baseURL + '/api/signin/isTodaySignOut.spr'), {},
        {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                }
            }
        }, {});
});
mainModule.factory("getGeoFenceParams", function ($resource) {
    return $resource((baseURL + '/api/signin/getGeoFence.spr'), {},
        {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                }
            }
        }, {});
});
mainModule.factory("getClockInOutData", function ($resource) {
    return $resource((baseURL + '/api/signin/clockInOutData.spr'), {},
        {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                }
            }
        }, {});
});

mainModule.controller('checkInCtrl', function ($ionicPopup, $scope, $rootScope, getSignInService, getSignInServiceWitSelfie, commonService, getSignOutValidateService, $filter, $ionicLoading, getSignInValidateService, homeService, $state, getGeoFenceParams, getClockInOutData,
    $timeout, $http) {
    $scope.hideCheckOut = false;
    $scope.hideCheckIn = false;
    $scope.syncButton = false;
    $scope.lengthvalue = {};
    $scope.onlineInSyncClick = false;
    $scope.checkSync = {};
    $scope.clockInLocFlag = false;
    $scope.clockOutLocFlag = false;

    $scope.lastPosition = null

    $scope.userDisallowedLocation = 'false'
    $scope.pleaseEnablePrompted = 'false'
    $scope.todaysRecordCount = 0
    $scope.addNogpsRemarks = "false"
    $scope.userComment = "";
    $scope.hideCheckIn = 1
    $scope.locRetryCount = 0

    $scope.mapsLoaded = "false"
    $scope.mapLoadingTryCtr = 0

    $scope.GPSAccuracyLow = 'false'
    $scope.android_12 = 'true'

    $scope.googleMapAppApiKey = sessionStorage.getItem('googleMapAppApiKey');
    //$scope.googleMapAppApiKey = "AIzaSyBIzUXnWwSZq3SQgwUpjf58Rilj7tqP_Gs";
    //$scope.googleMapAppApiKey = "AIzaSyAqkXSqNArZxNFRDZugr-W0E7lUZWTtkd4" //pnb
    if (localStorage.getItem('GoogleKeyAdded') == null) {
        localStorage.setItem("GoogleKeyAdded", "true")

        $scope.mapSrc = "https://maps.google.com/maps/api/js?key=" + $scope.googleMapAppApiKey + "&sensor=true"
        var my_script = document.createElement('script');
        my_script.setAttribute('src', $scope.mapSrc);
        document.head.appendChild(my_script);
    }


    var pageOpenedTime = new Date();
    var callClockInClickAfterInit = "false"
    var callClockOutClickAfterInit = "false"


    if ($rootScope.ifOutOfFencePunchValid) {
        $scope.ifOutOfFencePunchValidLocalVar = $rootScope.ifOutOfFencePunchValid
    } else {
        $scope.ifOutOfFencePunchValidLocalVar = 'N'
    }
    if (getMyHrapiVersionNumber() >= 20) {
        $scope.selfieFeatureAdded = 'true'
    } else {
        $scope.selfieFeatureAdded = 'false'
    }

    if ($rootScope.myAppVersion >= 25) {
        $scope.selfieInPunchesFeature = 'true'
    } else {
        $scope.selfieInPunchesFeature = 'false'
    }

    // if (getMyHrapiVersionNumber() >= 29){
    //     $scope.utf8Feature  = "true"
    // }else{
    //     $scope.utf8Feature  = "false"
    // }


    if (getMyHrapiVersionNumber() >= 29) {
        $scope.utf8Enabled = 'true'
    } else {
        $scope.utf8Enabled = 'false'
    }

    // check for my attendance record enablement
    var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");
    if (attendanceMenuInfo.menuId === undefined) {
        //showAlert("My Attendance is not enabled. Please contact HR.")
        $scope.stopClockiInOut = 'true'
        //return
    } else {
        $scope.stopClockiInOut = 'false'
    }

    $timeout(function () {
        //alert("timer " + $scope.todaysRecordCount)
        if (document.getElementById("divOut")) {

        } else {
            return
        }
        if ($scope.todaysRecordCount % 2 == 0) {
            //$scope.hideCheckIn = '1';
            document.getElementById("divOut").innerHTML = "Clock In"
        } else {
            //$scope.hideCheckIn = '0';
            document.getElementById("divOut").innerHTML = "Clock Out"
        }
        //$ionicLoading.hide()
        if (GeoTrackingFeatureEnabledForClient == "true") {
            $scope.geoTrackMsg = "GT:" + GeoTrackingON_OFF
        }
    }, 800)


    if ($rootScope.app_product_name == "HRAlign" && $rootScope.myAppVersion >= 14) {
        //checking workflow if set or not this feature introduced in v14 onwards
        $scope.workFlowCheckFeature = 'true'
    } else {
        $scope.workFlowCheckFeature = 'false'
    }


    $scope.punchOutHideShow = function () {
        homeService.getResult("SIGNOUT", function (length, data) {
            if (document.getElementById("divOut")) {

            } else {
                return
            }
            $scope.lengthvalue = length

            if (length > 0) {
                $scope.hideCheckOut = '1';
            } else {
                $scope.hideCheckOut = '0';
            }

            if ($scope.todaysRecordCount % 2 == 0) {
                //$scope.hideCheckIn = '1';
                document.getElementById("divOut").innerHTML = "Clock In "
            } else {
                //$scope.hideCheckIn = '0';
                document.getElementById("divOut").innerHTML = "Clock Out"
            }
            if ($scope.loadingHideFlag != 1) {
                $ionicLoading.hide();
            }
            if (!$scope.$$phase)
                $scope.$apply()
        }, function (data) {
            $ionicLoading.hide();
            if (!$scope.$$phase)
                $scope.$apply()
        })
    }
    $scope.punchInHideShow = function () {
        homeService.getResult("SIGNIN", function (length, data) {
            //alert("in " + length)
            if (document.getElementById("divOut")) {

            } else {
                return
            }
            $scope.todaysRecordCount = length
            if (length > 0) {
                $scope.hideCheckIn = '1';
            } else {
                $scope.hideCheckIn = '0';
            }

            if (length % 2 == 0) {
                //$scope.hideCheckIn = '1';
                document.getElementById("divOut").innerHTML = "Clock In"
            } else {
                //$scope.hideCheckIn = '0';
                document.getElementById("divOut").innerHTML = "Clock Out"
            }
            if (!$scope.$$phase) {
                $scope.$apply()
            }
            $scope.punchOutHideShow();
        }, function (data) {
            $ionicLoading.hide();
            if (!$scope.$$phase)
                $scope.$apply()
        })
    }
    $scope.getRemainingSync = function (type) {
        homeService.getRemSync(type, function (length, punchInCnt, punchOutCnt) {
            $scope.offAttCount = length
            $scope.punchInCnt = punchInCnt
            $scope.punchOutCnt = punchOutCnt
            if (!$scope.$$phase) {
                $scope.$apply()
            }
            $scope.punchInHideShow()
        }, function (data) {
            $ionicLoading.hide();
            if (!$scope.$$phase)
                $scope.$apply()
        })
    }
    var currentLocSuccess = function (position) {
        //alert("crrentlocsuccess")

        $scope.lastPosition = position
        $scope.locRetryCount = 0
        if (typeof google.maps === 'object') {
            //  alert("google map is object")
            initMap(position.coords.latitude, position.coords.longitude);

        } else {
            //alert("not an object")
        }


        if (callClockInClickAfterInit == "true") {
            callClockInClickAfterInit = "false"
            if ($scope.workFlowCheckFeature = 'true') {
                $scope.checkWorkflow("PUNCH_IN")
            } else {
                $scope.postPunchIn()
            }
        }
        if (callClockOutClickAfterInit == "true") {
            callClockOutClickAfterInit = "false"
            if ($scope.workFlowCheckFeature = 'true') {
                $scope.checkWorkflow("PUNCH_OUT")
            } else {
                $scope.postPunchOut()
            }
        }
        $timeout(function () {
            $scope.setCompGeoParams();
            $scope.showTodaysClockInOutData()
        }, 500);
    }



    var currentLocError = function (error) {
        // alert("current loc error " + error.code + "   " + error.message)
        //alert("prompted " + $scope.pleaseEnablePrompted)
        //alert("retry  count " + $scope.locRetryCount)
        if ($scope.locRetryCount > 2) {
            $ionicLoading.hide()
            if (typeof google.maps === 'object') {
                //alert("defult map 1")
                defaultInitMap();
                $scope.pleaseEnablePrompted = 'true'
                showAlert("Please enable your location/gps and try again!");
                //$scope.locRetryCount = 0
            }
            return
        } else {
            $scope.locRetryCount++;
            init();
            return
        }
        if (!$scope.$$phase) {
            $scope.$apply()
        }
        $ionicLoading.hide({});
        if ($scope.pleaseEnablePrompted == 'false') {
            if ($scope.locRetryCount == 0) {
                $scope.locRetryCount++;
                $scope.refreshpage()
            } else {
                $scope.pleaseEnablePrompted = 'true'
                showAlert("Please enable your location/gps and try again!");
            }
        }


        if (typeof google.maps === 'object') {
            alert("defult map 1")
            defaultInitMap();
        }
    }

    var currentLocErrorOnClockInClockOut = function (error) {
        $ionicLoading.hide();
        if (!$scope.$$phase) {
            $scope.$apply()
        }
        var confirmPopup = $ionicPopup.confirm({
            title: 'Continue without GPS?',
        });
        confirmPopup.then(function (res) {
            if (res) {
                $ionicLoading.show({});

                //$scope.addNogpsRemarks = "true"
                $scope.formatted_address = null
                var position = {};
                position.coords = {};
                position.coords.latitude = null;
                position.coords.longitude = null;
                position.coords.accuracy = null;
                position.timestamp = new Date().getTime();
                $scope.clockInLocFlag == true ? punchInSuccess(position) : punchOutSuccess(position);
            }
            else {
                // Nothing to do.
                //enable clock in out button
                $scope.refreshpage()
                $scope.formatted_address = ''
                $scope.enableClockInOutButtons("true")
            }
        });
    }
    $scope.getRemainingSync('NOTDONE');
    $scope.punchInCnt = 0;
    $scope.punchOutCnt = 0;
    $scope.punchIn = {}
    $scope.punchOut = {}
    $scope.resultObj = {}
    $scope.loadingHideFlag = 1;
    function checkLocationSetting(data) {
        if (data.code == 1) {
            $ionicLoading.hide();
            //nothing to do
        }
        else if (data.code == 3) {
            cordova.plugins.locationAccuracy.request(function (success) {
                //                console.log("Successfully requested accuracy: " + success.message);
                if (device.platform === 'Android') {
                    LocationServices.getCurrentPosition(currentLocSuccess, currentLocError, {
                        maximumAge: 3000,
                        timeout: 5000,
                        enableHighAccuracy: true
                    });
                } else {
                    navigator.geolocation.getCurrentPosition(currentLocSuccess, currentLocError, {
                        maximumAge: 3000,
                        timeout: 5000,
                        enableHighAccuracy: true
                    });
                }
            }, function (error) {
                //                console.log("Accuracy request failed: error code=" + error.code + "; error message=" + error.message);
                if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                    if (window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")) {
                        cordova.plugins.diagnostic.switchToLocationSettings();
                    }
                }
                currentLocError();
            }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
        }
        else {
            if (device.platform === 'Android') {
                LocationServices.getCurrentPosition(currentLocSuccess, currentLocError, {
                    maximumAge: 3000,
                    timeout: 5000,
                    enableHighAccuracy: true
                });
            } else {
                navigator.geolocation.getCurrentPosition(currentLocSuccess, currentLocError, {
                    maximumAge: 3000,
                    timeout: 5000,
                    enableHighAccuracy: true
                });
            }
        }
    }


    $scope.checkWorkflow = function (punchType) {
        $ionicLoading.show()
        $scope.sendForApproveRequestObject = {}
        $scope.sendForApproveRequestObject.missedPunchVOList = []
        var attendanceMenuInfo = getMenuInformation("Attendance Management", "My Attendance Record");
        $scope.sendForApproveRequestObject.menuId = attendanceMenuInfo.menuId;
        $scope.sendForApproveRequestObject.buttonRights = "Y-Y-Y-Y"

        $http({
            url: (baseURL + '/api/attendance/missPunch/isAttWorkflowSet.spr'),
            method: 'POST',
            timeout: commonRequestTimeout,
            transformRequest: jsonTransformRequest,
            data: $scope.sendForApproveRequestObject,
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).
            success(function (data) {

                $scope.wfset = data.isWorkflowSet
                if (punchType == "PUNCH_IN") {
                    $scope.postPunchIn()
                } else if (punchType == "PUNCH_OUT") {
                    $scope.postPunchOut()
                } else {
                    return;
                }

                $ionicLoading.hide()

            }).error(function (data, status) {
                $scope.data = { status: status };
                commonService.getErrorMessage($scope.data);
                $ionicLoading.hide()
            })
    }


    function init_12() {
        $ionicLoading.show();
        $scope.formatted_address = '';


        $timeout(function () {

            var permissions = cordova.plugins.permissions;
            /*
            var list = [
                permissions.ACCESS_COARSE_LOCATION,
                permissions.ACCESS_FIN_LOCATION
              ];

            permissions.requestPermissions(
                list,
                function(status) {
                  if( !status.hasPermission ) error();
                },
                error);
*/
            permissions.requestPermission(permissions.ACCESS_FINE_LOCATION, success, error);

            function error() {
                //alert("NO PERMISIONN")
                return
                //console.warn('Camera permission is not turned on');
            }

            function success(status) {
                if (!status.hasPermission) error();
                // alert("has permission")
            }


            if ($scope.locRetryCount == 2) {
                console.log("Maps accuracy is low, your location may not be captured as exact")
                showAlert("Maps accuracy is low, your location may not be captured as exact.")
                $scope.GPSAccuracyLow = 'true'
                if (device.platform === 'Android') {
                    LocationServices.getCurrentPosition(currentLocSuccess, currentLocError, {
                        maximumAge: 3000,
                        timeout: 5000,
                        enableHighAccuracy: false
                    });
                } else {
                    navigator.geolocation.getCurrentPosition(currentLocSuccess, currentLocError, {
                        maximumAge: 3000,
                        timeout: 5000,
                        enableHighAccuracy: false
                    });
                }
            } else {
                if (device.platform === 'Android') {
                    LocationServices.getCurrentPosition(currentLocSuccess, currentLocError, {
                        maximumAge: 3000,
                        timeout: 5000,
                        enableHighAccuracy: true
                    });
                } else {
                    navigator.geolocation.getCurrentPosition(currentLocSuccess, currentLocError, {
                        maximumAge: 3000,
                        timeout: 5000,
                        enableHighAccuracy: true
                    });
                }
            }




        }, 1000);




        if (!$scope.$$phase)
            $scope.$apply()

    }

    function init() {
        pageOpenedTime = new Date();

        if (device.platform == "Android") {
            if ($scope.android_12 == 'true') {
                init_12()
                return
            }
        }

        $ionicLoading.show();
        $scope.formatted_address = '';
        //alert($scope.googleMapAppApiKey)
        //$scope.googleMapAppApiKey = "AIzaSyDL3DajTpLdJsrwwOsJtLMIe5zRJU2KssQ"
        //$scope.googleMapAppApiKey="AIzaSyDf9OzCksD51crdllUgX9Pt5J0kmDkcOw4"
        //$scope.googleMapAppApiKey="AIzaSyDgf05BKeGM7ekIQnbJ1G6vrRx7zdOcnHk"
        //$scope.googleMapAppApiKey="AIzaSyDgf05BKeGM7ekIQnbJ1G6vrR"
        //$scope.googleMapAppApiKey = "AIzaSyDf9OzCksD51crdllUgX9Pt5J0kmDkcOw4"
        //$scope.googleMapAppApiKey="AIzaSyCqXbN2oI5CnbLxto308EMV0KBCOybU-Xs"


        $timeout(function () {
            cordova.plugins.locationAccuracy.canRequest(function (canRequest) {
                if (canRequest) {
                    // alert("can request")
                    // alert(cordova.plugins.locationAccuracy)
                    cordova.plugins.locationAccuracy.request(function (success) {
                        console.log("Successfully requested accuracy: " + success.message);
                        //alert("request for accuracy - successful")
                        if ($scope.locRetryCount == 2) {
                            console.log("Maps accuracy is low, your location may not be captured as exact")
                            //showAlert("Maps accuracy is low, your location may not be captured as exact.")
                            $scope.GPSAccuracyLow = 'true'
                            if (device.platform === 'Android') {
                                LocationServices.getCurrentPosition(currentLocSuccess, currentLocError, {
                                    maximumAge: 3000,
                                    timeout: 5000,
                                    enableHighAccuracy: false
                                });
                            } else {
                                navigator.geolocation.getCurrentPosition(currentLocSuccess, currentLocError, {
                                    maximumAge: 3000,
                                    timeout: 5000,
                                    enableHighAccuracy: false
                                });
                            }

                        } else {
                            if (device.platform === 'Android') {
                                LocationServices.getCurrentPosition(currentLocSuccess, currentLocError, {
                                    maximumAge: 3000,

                                    timeout: 5000,
                                    enableHighAccuracy: true
                                });
                            } else {
                                navigator.geolocation.getCurrentPosition(currentLocSuccess, currentLocError, {
                                    maximumAge: 3000,

                                    timeout: 5000,
                                    enableHighAccuracy: true
                                });
                            }
                        }

                        //$scope.setCompGeoParams();
                        //$scope.showTodaysClockInOutData();
                    }, function (error) {
                        //                console.log("Accuracy request failed: error code=" + error.code + "; error message=" + error.message);
                        alert("error in requesting location accuracy " + error.code)
                        if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                            if (window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")) {
                                cordova.plugins.diagnostic.switchToLocationSettings();
                            }
                        } else {
                            //user disagreed
                            //alert("in user disalloweds")
                            $scope.userDisallowedLocation = 'true'
                            //alert("user denied")
                            $scope.formatted_address = null
                        }
                        currentLocError();
                    }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
                }
                else {

                    $scope.mapLoadingTryCtr++;
                    //alert("not can request" + $scope.mapLoadingTryCtr)
                    if ($scope.mapLoadingTryCtr >= 2) {
                        $scope.userDisallowedLocation = "true"
                        //alert($scope.userDisallowedLocation)
                    }
                    //$scope.formatted_address = null;	
                    if (device.platform === 'Android') {
                        LocationServices.getCurrentPosition(checkLocationSetting, checkLocationSetting, {
                            maximumAge: 3000,
                            timeout: 1000,
                            enableHighAccuracy: true
                        });
                    } else {
                        navigator.geolocation.getCurrentPosition(checkLocationSetting, checkLocationSetting, {
                            maximumAge: 3000,
                            timeout: 1000,
                            enableHighAccuracy: true
                        });
                    }
                    //alert("got location - 2")
                    $scope.setCompGeoParams();
                    $scope.showTodaysClockInOutData();
                }
            });


        }, 1000);




        if (!$scope.$$phase)
            $scope.$apply()

    }



    function reqAccuracy() {
        $timeout(function () {
            cordova.plugins.locationAccuracy.canRequest(function (canRequest) {
                if (canRequest) {
                    //alert(" requesting accuracy")
                    cordova.plugins.locationAccuracy.request(function (success) {
                        console.log("Successfulllogiy requested accuracy: " + success.message);
                        //alert("request for accuracy - successful")
                        if (device.platform === 'Android') {
                            LocationServices.getCurrentPosition(currentLocSuccess, currentLocError, {
                                maximumAge: 3000,
                                timeout: 5000,
                                enableHighAccuracy: true
                            });
                        } else {
                            navigator.geolocation.getCurrentPosition(currentLocSuccess, currentLocError, {
                                maximumAge: 3000,
                                timeout: 5000,
                                enableHighAccuracy: true
                            });
                        }

                        //alert("got location")
                        //$scope.setCompGeoParams();
                        //$scope.showTodaysClockInOutData();
                    }, function (error) {
                        //                console.log("Accuracy request failed: error code=" + error.code + "; error message=" + error.message);
                        alert("error in getting location " + error.code)
                        if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                            if (window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")) {
                                cordova.plugins.diagnostic.switchToLocationSettings();
                            }
                        } else {
                            //$scope.userDisallowedLocation = 'true'
                            $scope.formatted_address = null
                        }
                        currentLocError();
                    }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
                }
                else {

                    $scope.mapLoadingTryCtr++;
                    //alert("not can request" + $scope.mapLoadingTryCtr)
                    if ($scope.mapLoadingTryCtr >= 2) {
                        $scope.userDisallowedLocation = "true"
                        //alert($scope.userDisallowedLocation)
                    }
                    //$scope.formatted_address = null;	
                    if (device.platform === 'Android') {
                        LocationServices.getCurrentPosition(checkLocationSetting, checkLocationSetting, {
                            maximumAge: 3000,
                            timeout: 1000,
                            enableHighAccuracy: true
                        });
                    } else {
                        navigator.geolocation.getCurrentPosition(checkLocationSetting, checkLocationSetting, {
                            maximumAge: 3000,
                            timeout: 1000,
                            enableHighAccuracy: true
                        });
                    }
                    //alert("got location - 2")
                    $scope.setCompGeoParams();
                    $scope.showTodaysClockInOutData();
                }
            });


        }, 1000);

    }

    function initMapnew(lat, lng) {
        $ionicLoading.show()
        var myLatLng = { lat: lat, lng: lng };
        
        
        var strsrc = "https://maps.googleapis.com/maps/api/staticmap?center="+lat+","+lng+"&zoom=16&size=200x200&markers=color:red%7Clabel:S%7C62.107733,-145.541936&markers=size:tiny%7Ccolor:green%7CDelta+Junction,AK&markers=size:mid%7Ccolor:0xFFFF00%7Clabel:C%7CTok,AK%22&key=AIzaSyBIzUXnWwSZq3SQgwUpjf58Rilj7tqP_Gs"
        document.getElementById('staticmap').src = strsrc
        var geocoder = new google.maps.Geocoder;
        var input = lat + "," + lng
        var latlngStr = input.split(',', 2);
        var latlng = { lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1]) };
        geocoder.geocode({ 'location': latlng }, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    $scope.formatted_address = results[0].formatted_address;
                } else {
                    //showAlert(alert_header, 'No results found');
                    $scope.formatted_address = null
                }
            } else {
                // showAlert(alert_header, 'Failed Status :' +status);
                $scope.formatted_address = null
            }
        });
        
        /*var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 25,
            center: myLatLng
        });
        
        map.addListener('tilesloaded', function () {
            $ionicLoading.hide()
            $scope.mapsLoaded = "true"
        });

        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Hello World!'
        });
        
        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;
        infowindow.open(map, marker);
        $scope.geocodeLatLng(geocoder, map, infowindow, lat, lng);


        var compLatLng = { lat: parseFloat(localStorage.getItem("compLat")), lng: parseFloat(localStorage.getItem("compLong")) };
        tmpCompRadius = parseFloat(localStorage.getItem("compRadius"));

        var geoFence = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.4,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: compLatLng,
            radius: tmpCompRadius
        });
*/
    }


    function initMap(lat, lng) {
        $ionicLoading.show()
        var myLatLng = { lat: lat, lng: lng };
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 25,
            center: myLatLng
        });
        
        map.addListener('tilesloaded', function () {
            $ionicLoading.hide()
            $scope.mapsLoaded = "true"
        });

        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Hello World!'
        });

        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;
        infowindow.open(map, marker);
        $scope.geocodeLatLng(geocoder, map, infowindow, lat, lng);


        var compLatLng = { lat: parseFloat(localStorage.getItem("compLat")), lng: parseFloat(localStorage.getItem("compLong")) };
        tmpCompRadius = parseFloat(localStorage.getItem("compRadius"));

        var geoFence = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.4,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: compLatLng,
            radius: tmpCompRadius
        });

    }


    function defaultInitMap() {
        var myLatLng = { lat: 20.5937, lng: 78.9629 };
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 5,
            center: myLatLng
        });
    }


    var date = new Date();
    $scope.currentDate = $filter('date')(date, 'dd MMMM yyyy');


    var onSuccess = function (id) {

        if ($scope.selfieFeatureAdded == 'true') {
            var fd = new FormData();
            fd.append("type", $scope.punchIn.type)
            if ($scope.utf8Enabled == 'true' && $scope.punchIn) {
                if ($scope.punchIn.userComment) {
                    $scope.punchIn.userComment = encodeURI($scope.punchIn.userComment)
                }
            }
            fd.append("userComment", $scope.punchIn.userComment)
            //$scope.punchIn.geoLocationAddress = 'शिवाय'
            if ($scope.utf8Enabled == "true") {
                $scope.punchIn.geoLocationAddress = encodeURI($scope.punchIn.geoLocationAddress)
            }
            //$scope.punchIn.geoLocationAddress = 'rrrrr'
            fd.append("geoLocationAddress", $scope.punchIn.geoLocationAddress)

            fd.append("outOfFance", $scope.punchIn.outOfFance)
            fd.append("Latitude", $scope.punchIn.Latitude)
            fd.append("Longitude", $scope.punchIn.Longitude)
            fd.append("Accuracy", $scope.punchIn.Accuracy)


            fd.append("simSrNo1", 'NA')
            fd.append("simSrNo2", 'NA')
            fd.append("uuid", $rootScope.uuid)
            fd.append("imei", 'NA')
            fd.append("mfg", 'NA')
            fd.append("model", 'NA')
            fd.append("phoneNumber", 'NA')
            fd.append("simDeviceId", $rootScope.simDeviceId)

            if (document.getElementById('showImg').src.indexOf("data:image") > -1) {
                //scope.imageData is the src of camera image 
                var base64result = $scope.imageData.split(',')[1];

                var ts = new Date();
                ts = ts.getFullYear() + "" + ts.getMonth() + "" + ts.getDate() + "" + ts.getHours() + "" + ts.getMinutes() + "" + ts.getSeconds()

                $scope.fileUploadName = "selfie_" + ts + ".jpeg"
                $scope.fileUploadType = "image/jpeg"

                var blob = base64toBlob(base64result, $scope.fileUploadType, $scope.fileUploadName)
                //alert(blob)
                //alert($scope.fileUploadName)

                fd.append("contentType", $scope.fileUploadType)
                fd.append("fileName", $scope.fileUploadName)
                fd.append('selfieFile', blob, $scope.fileUploadName)
            }

            $.ajax({
                url: baseURL + '/api/signin/signInSignOutWithSelfie.spr',
                data: fd,
                processData: false,
                contentType: false,
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                },
                success: function (success) {
                    /*
             $scope.getSignInServiceWitSelfie = new getSignInServiceWitSelfie();
            $scope.getSignInServiceWitSelfie.$save(fd, function (success) {
                */
                    if (!(success.clientResponseMsg == "OK")) {
                        console.log(success.clientResponseMsg)
                        //alert(success.clientResponseMsg)
                        handleClientResponse(success.clientResponseMsg, "getSignInServiceWitSelfie")
                        showAlert("Something went wrong. Please try after some time.  ")
                        $scope.enableClockInOutButtons("true")
                        deleteLocalPunches(id)
                        return
                    }


                    $scope.enableClockInOutButtons("true")
                    var imgcontrolName = "showImg"
                    var image = document.getElementById(imgcontrolName);
                    image.src = ""
                    image.style.visibility = "hidden"
                    // here signin punch not to be deleted as it uses
                    // 	to determine if signin done or not.
                    // let it get updated.

                    homeService.updateStatus(id, function (data) {
                        $scope.getRemainingSync('NOTDONE');
                        $ionicLoading.hide()
                        $scope.punchIn.userComment = "";
                        $rootScope.punchDataAvlblAtMobile_yyyymm = ""
                        if ($scope.ifOutOfFencePunchValidLocalVar) {


                            if ($scope.todaysRecordCount % 2 == 0) {
                                if (($scope.amIOutOfFence == "OUT" || $scope.amIOutOfFence == "NOGPS") && $scope.ifOutOfFencePunchValidLocalVar == 'N') {
                                    showAlert("Your clock-in is registered successfully and sent for approval. It will reflect on calendar after approval.")
                                } else {
                                    showAlert("Clock-in done successfully")
                                }
                            } else {
                                if (($scope.amIOutOfFence == "OUT" || $scope.amIOutOfFence == "NOGPS") && $scope.ifOutOfFencePunchValidLocalVar == 'N') {
                                    showAlert("Your clock-out is registered successfully and sent for approval. It will reflect on calendar after approval.")
                                } else {
                                    showAlert("Clock-out done successfully")
                                }
                            }
                        }/*
			else{
				if ($scope.todaysRecordCount % 2 ==0){
					if ($scope.amIOutOfFence == "OUT" || $scope.amIOutOfFence == "NOGPS" )	{
						showAlert("Your clock-in is registered successfully and sent for approval. It will reflect on calendar after approval.")
					}else{
						showAlert("Clock-in done successfully")
					}
				}else{
					if ($scope.amIOutOfFence == "OUT"  || $scope.amIOutOfFence == "NOGPS")	{
						showAlert("Your clock-out is registered successfully and sent for approval. It will reflect on calendar after approval.")
					}else{
						showAlert("Clock-out done successfully")
					}
				}
			}*/
                        //showAlert("Clock-in done successfully")
                        $timeout(function () {
                            $scope.showTodaysClockInOutData()
                        }, 1000)

                    }, function (data) {
                        $ionicLoading.hide()
                        showAlert("Please try again")
                        if (!$scope.$$phase)
                            $scope.$apply()
                    });
                }, error(err) {
                    $ionicLoading.hide()
                    showAlert("Failed to clock-in")
                }
            });

        } else {
            $scope.getSignInService = new getSignInService();
            $scope.getSignInService.$save($scope.punchIn, function (success) {
                if (!(success.clientResponseMsg == "OK")) {
                    console.log(success.clientResponseMsg)
                    handleClientResponse(success.clientResponseMsg, "getSignInService")
                    showAlert("Something went wrong. Please try after some time.")
                    $scope.enableClockInOutButtons("true")
                    deleteLocalPunches(id)
                    return
                }
                $scope.enableClockInOutButtons("true")
                var imgcontrolName = "showImg"
                var image = document.getElementById(imgcontrolName);
                image.src = ""
                image.style.visibility = "hidden"
                // here signin punch not to be deleted as it uses
                // 	to determine if signin done or not.
                // let it get updated.

                homeService.updateStatus(id, function (data) {
                    $scope.getRemainingSync('NOTDONE');
                    $ionicLoading.hide()
                    $scope.punchIn.userComment = "";
                    $rootScope.punchDataAvlblAtMobile_yyyymm = ""
                    if ($scope.ifOutOfFencePunchValidLocalVar) {
                        if ($scope.todaysRecordCount % 2 == 0) {
                            if (($scope.amIOutOfFence == "OUT" || $scope.amIOutOfFence == "NOGPS") && $scope.ifOutOfFencePunchValidLocalVar == 'N') {
                                showAlert("Your clock-in is registered successfully and sent for approval. It will reflect on calendar after approval.")
                            } else {
                                showAlert("Clock-in done successfully")
                            }
                        } else {
                            if (($scope.amIOutOfFence == "OUT" || $scope.amIOutOfFence == "NOGPS") && $scope.ifOutOfFencePunchValidLocalVar == 'N') {
                                showAlert("Your clock-out is registered successfully and sent for approval. It will reflect on calendar after approval.")
                            } else {
                                showAlert("Clock-out done successfully")
                            }
                        }
                    }/*
			else{
				if ($scope.todaysRecordCount % 2 ==0){
					if ($scope.amIOutOfFence == "OUT" || $scope.amIOutOfFence == "NOGPS" )	{
						showAlert("Your clock-in is registered successfully and sent for approval. It will reflect on calendar after approval.")
					}else{
						showAlert("Clock-in done successfully")
					}
				}else{
					if ($scope.amIOutOfFence == "OUT"  || $scope.amIOutOfFence == "NOGPS")	{
						showAlert("Your clock-out is registered successfully and sent for approval. It will reflect on calendar after approval.")
					}else{
						showAlert("Clock-out done successfully")
					}
				}
			}*/

                    /*if ($scope.todaysRecordCount % 2 ==0){
                        if ($scope.amIOutOfFence == "OUT"  || $scope.amIOutOfFence == "NOGPS")	{
                            showAlert("Your clock-in is registered successfully and sent for approval. It will reflect on calendar after approval.")
                        }else{
                            showAlert("Clock-in done successfully")
                        }
                    }else{
                        if ($scope.amIOutOfFence == "OUT"  || $scope.amIOutOfFence == "NOGPS")	{
                            showAlert("Your clock-out is registered successfully and sent for approval. It will reflect on calendar after approval.")
                        }else{
                            showAlert("Clock-out done successfully")
                        }
                    	
                    }
                    */

                    //showAlert("Clock-in done successfully")
                    $timeout(function () {
                        $scope.showTodaysClockInOutData()
                    }, 1000)

                }, function (data) {
                    $ionicLoading.hide()
                    showAlert("Please try again")
                    if (!$scope.$$phase)
                        $scope.$apply()
                });
            }, function (error) {
                $ionicLoading.hide()
                showAlert("Failed to clock-in")
            });
        }
    }


    var onSuccess1 = function (id) {
        //        $ionicLoading.hide()
        //        $ionicLoading.show({});

        if ($scope.selfieFeatureAdded == 'true') {
            var fd = new FormData();
            fd.append("type", $scope.punchOut.type)

            if ($scope.utf8Enabled == 'true' && $scope.punchOut) {
                if ($scope.punchOut.userComment) {
                    $scope.punchOut.userComment = encodeURI($scope.punchOut.userComment)
                }
            }

            fd.append("userComment", $scope.punchOut.userComment)
            //$scope.punchOut.geoLocationAddress = 'शिवाय rajesh test शिवाय ok'
            if ($scope.utf8Enabled == "true") {
                $scope.punchOut.geoLocationAddress = encodeURI($scope.punchOut.geoLocationAddress)
            }
            fd.append("geoLocationAddress", $scope.punchOut.geoLocationAddress)
            fd.append("outOfFance", $scope.punchOut.outOfFance)
            fd.append("Latitude", $scope.punchOut.Latitude)
            fd.append("Longitude", $scope.punchOut.Longitude)
            fd.append("Accuracy", $scope.punchOut.Accuracy)


            fd.append("simSrNo1", 'NA')
            fd.append("simSrNo2", 'NA')
            fd.append("uuid", $rootScope.uuid)
            fd.append("imei", 'NA')
            fd.append("mfg", 'NA')
            fd.append("model", 'NA')
            fd.append("phoneNumber", 'NA')
            fd.append("simDeviceId", $rootScope.simDeviceId)

            if (document.getElementById('showImg').src.indexOf("data:image") > -1) {
                //scope.imageData is the src of camera image 
                var base64result = $scope.imageData.split(',')[1];

                var ts = new Date();
                ts = ts.getFullYear() + "" + ts.getMonth() + "" + ts.getDate() + "" + ts.getHours() + "" + ts.getMinutes() + "" + ts.getSeconds()

                $scope.fileUploadName = "selfie_" + ts + ".jpeg"
                $scope.fileUploadType = "image/jpeg"

                var blob = base64toBlob(base64result, $scope.fileUploadType, $scope.fileUploadName)
                //alert(blob)
                //alert($scope.fileUploadName)

                fd.append("contentType", $scope.fileUploadType)
                fd.append("fileName", $scope.fileUploadName)
                fd.append('selfieFile', blob, $scope.fileUploadName)
            }
            /*
            $scope.getSignInServiceWitSelfie = new getSignInServiceWitSelfie();
            $scope.getSignInServiceWitSelfie.$save(fd, function (success) {*/
            //contentType: 'application/json; charset=utf-8', // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)

            //enctype: 'text/html;charset=utf-8',
            //      dataType: 'text',
            $.ajax({
                url: baseURL + '/api/signin/signInSignOutWithSelfie.spr',
                data: fd,
                processData: false,
                contentType: false,
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + jwtByHRAPI
                },
                success: function (success) {
                    if (!(success.clientResponseMsg == "OK")) {
                        //alert(success.clientResponseMsg)
                        console.log(success.clientResponseMsg)
                        handleClientResponse(success.clientResponseMsg, "getSignInServiceWitSelfie")
                        showAlert("Something went wrong. Please try after some time.")
                        $scope.enableClockInOutButtons("true")
                        deleteLocalPunches(id)
                        return
                    }
                    //call for geotracking




                    $scope.enableClockInOutButtons("true")
                    var imgcontrolName = "showImg"
                    var image = document.getElementById(imgcontrolName);
                    image.src = ""
                    image.style.visibility = "hidden"
                    //homeService.updateStatus(id, function (data) {
                    homeService.deleteOffLineData(id, function (data) {
                        $scope.getRemainingSync('NOTDONE')
                        $ionicLoading.hide();
                        $scope.punchIn.userComment = "";
                        $rootScope.punchDataAvlblAtMobile_yyyymm = ""
                        //alert($scope.todaysRecordCount)
                        if ($scope.ifOutOfFencePunchValidLocalVar) {
                            if ($scope.todaysRecordCount % 2 == 0) {
                                if (($scope.amIOutOfFence == "OUT" || $scope.amIOutOfFence == "NOGPS") && $scope.ifOutOfFencePunchValidLocalVar == 'N') {
                                    showAlert("Your clock-in is registered successfully and sent for approval. It will reflect on calendar after approval.")
                                } else {
                                    showAlert("Clock-in done successfully")
                                }
                            } else {
                                if (($scope.amIOutOfFence == "OUT" || $scope.amIOutOfFence == "NOGPS") && $scope.ifOutOfFencePunchValidLocalVar == 'N') {
                                    showAlert("Your clock-out is registered successfully and sent for approval. It will reflect on calendar after approval.")
                                } else {
                                    showAlert("Clock-out done successfully")
                                }
                            }
                        }
                        /*
                     if ($scope.todaysRecordCount % 2 ==0){
                         if ($scope.amIOutOfFence == "OUT"  || $scope.amIOutOfFence == "NOGPS")	{
                             showAlert("Your clock-in is registered successfully and sent for approval. It will reflect on calendar after approval.")
                         }else{
                             showAlert("Clock-in done successfully")
                         }
                     }else{
                         if ($scope.amIOutOfFence == "OUT"  || $scope.amIOutOfFence == "NOGPS")	{
                             showAlert("Your clock-out is registered successfully and sent for approval. It will reflect on calendar after approval.")
                         }else{
                             showAlert("Clock-out done successfully")
                         }
                     }*/
                        $timeout(function () {
                            $scope.showTodaysClockInOutData()
                        }, 1000)

                    }, function (data) {
                        $ionicLoading.hide()
                        showAlert("Please try again");
                        if (!$scope.$$phase)
                            $scope.$apply()
                    });
                    $ionicLoading.hide()
                }, error(err, data) {
                    $ionicLoading.hide()
                    showAlert("Failed to clock-out data")
                }
            });
        } else {
            $scope.getSignInService = new getSignInService();
            $scope.getSignInService.$save($scope.punchOut, function (success) {
                if (!(success.clientResponseMsg == "OK")) {
                    console.log(success.clientResponseMsg)
                    handleClientResponse(success.clientResponseMsg, "getSignInService")
                    showAlert("Something went wrong. Please try after some time.")
                    $scope.enableClockInOutButtons("true")
                    deleteLocalPunches(id)
                    return
                }
                $scope.enableClockInOutButtons("true")
                var imgcontrolName = "showImg"
                var image = document.getElementById(imgcontrolName);
                image.src = ""
                image.style.visibility = "hidden"
                //homeService.updateStatus(id, function (data) {
                homeService.deleteOffLineData(id, function (data) {
                    $scope.getRemainingSync('NOTDONE')
                    $ionicLoading.hide();
                    $scope.punchIn.userComment = "";
                    $rootScope.punchDataAvlblAtMobile_yyyymm = ""
                    //alert($scope.todaysRecordCount)
                    if ($scope.ifOutOfFencePunchValidLocalVar) {
                        if ($scope.todaysRecordCount % 2 == 0) {
                            if (($scope.amIOutOfFence == "OUT" || $scope.amIOutOfFence == "NOGPS") && $scope.ifOutOfFencePunchValidLocalVar == 'N') {
                                showAlert("Your clock-in is registered successfully and sent for approval. It will reflect on calendar after approval.")
                            } else {
                                showAlert("Clock-in done successfully")
                            }
                        } else {
                            if (($scope.amIOutOfFence == "OUT" || $scope.amIOutOfFence == "NOGPS") && $scope.ifOutOfFencePunchValidLocalVar == 'N') {
                                showAlert("Your clock-out is registered successfully and sent for approval. It will reflect on calendar after approval.")
                            } else {
                                showAlert("Clock-out done successfully")
                            }
                        }
                    }
                    /*
                    if ($scope.todaysRecordCount % 2 ==0){
                        if ($scope.amIOutOfFence == "OUT"  || $scope.amIOutOfFence == "NOGPS")	{
                            showAlert("Your clock-in is registered successfully and sent for approval. It will reflect on calendar after approval.")
                        }else{
                            showAlert("Clock-in done successfully")
                        }
                    }else{
                        if ($scope.amIOutOfFence == "OUT"  || $scope.amIOutOfFence == "NOGPS")	{
                            showAlert("Your clock-out is registered successfully and sent for approval. It will reflect on calendar after approval.")
                        }else{
                            showAlert("Clock-out done successfully")
                        }
                    }*/
                    $timeout(function () {
                        $scope.showTodaysClockInOutData()
                    }, 1000)

                }, function (data) {
                    $ionicLoading.hide()
                    showAlert("Please try again");
                    if (!$scope.$$phase)
                        $scope.$apply()
                });
                $ionicLoading.hide()
            }, function (error, data) {
                $ionicLoading.hide()
                showAlert("Failed to clock-out data")
            });
        }
    }
    $scope.SignIn = function (id, latLongObj) {
        $ionicLoading.show({});
        $scope.getSignInValidateService = new getSignInValidateService();
        $scope.getSignInValidateService.$save(latLongObj, function (success) {

            if (!(success.clientResponseMsg == "OK")) {
                console.log(success.clientResponseMsg)
                handleClientResponse(success.clientResponseMsg, "getSignInValidateService")
            }

            if (success.outOfFanceInOut) {

                $scope.amIOutOfFence = success.outOfFanceInOut
            }

            if (success.isSign == 'MOBILEOFF') {
                $ionicLoading.hide()
                //showAlert(alert_header, "Sorry cannot mark attendance through Mobile as Clock-In/Out is off.");
                showAlert("Sorry cannot mark attendance through Mobile as Clock-In/Out is off.");
                deleteLocalPunches(id)
                return;
            }


            if (success.outOfFanceInOut != undefined && success.outOfFanceInOut == 'OUT' && $scope.wfset == "N") {
                $ionicLoading.hide()
                deleteLocalPunches(id)
                showAlert("Workflow not defined, Please contact HR")
                return;
            }

            if (success.outOfFanceInOut != undefined && success.outOfFanceInOut == 'OUT' && success.outOfFanceAllow == 'N') {
                $ionicLoading.hide()
                deleteLocalPunches(id)
                showAlert("Sorry, Can't mark attendance as you are out of Geo-Fence.");
                return;
            }
            if ((success.isSign == 'No') && ($scope.onlineInSyncClick == true)) {

                $scope.punchIn.outOfFance = success.outOfFanceInOut;
                OnSyncSuccess(id);
            }
            else if ((success.isSign == 'No') && ($scope.onlineInSyncClick == false)) {
                $scope.punchIn.outOfFance = success.outOfFanceInOut;
                onSuccess(id);

            }

            else if (success.isSign == 'NOSHIFT') {
                $ionicLoading.hide()
                deleteLocalPunches(id)
                showAlert("Shift not assigned");
            } else if (success.isSign == 'OUTOFBRANCH') {
                $ionicLoading.hide()
                deleteLocalPunches(id)
                showAlert("Sorry cannot mark attendance as you are out of branch network");
            } else if (success.isSign == 'BIOMATRIXON') {
                $ionicLoading.hide()
                deleteLocalPunches(id)
                showAlert("Sorry cannot mark attendance through system as bio matrix is on");
            } else if (success.isSign == 'Yes') {

                showAlert("Punch-in already done! offline updated");
                deleteLocalPunches(id)
                /*homeService.updateStatus(id, function (data) {
                    $scope.getRemainingSync('NOTDONE');
                    $ionicLoading.hide()
                    if (!$scope.$$phase)
                        $scope.$apply()
                }, function (data) {
                    showAlert("Please try again")
                    $ionicLoading.hide()
                    if (!$scope.$$phase)
                        $scope.$apply()
                });
                */
            }
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    };
    $scope.SignOut = function (id, dataObj) {
        $ionicLoading.show({});
        $scope.getSignOutValidateService = new getSignOutValidateService();
        $scope.getSignOutValidateService.$save(dataObj, function (success) {
            if (!(success.clientResponseMsg == "OK")) {
                console.log(success.clientResponseMsg)
                handleClientResponse(success.clientResponseMsg, "getSignOutValidateService")
            }
            if (success.outOfFanceInOut) {
                $scope.amIOutOfFence = success.outOfFanceInOut
            }

            if (success.isSignOut == 'MOBILEOFF') {
                $ionicLoading.hide()
                deleteLocalPunches(id)
                showAlert("Sorry cannot mark attendance through Mobile as Clock-In/Out is off");
                return;
            }



            if (success.outOfFanceInOut != undefined && success.outOfFanceInOut == 'OUT' && $scope.wfset == "N") {
                $ionicLoading.hide()
                deleteLocalPunches(id)
                showAlert("Workflow not defined, Please contact HR")
                return;
            }

            else if (success.outOfFanceInOut != undefined && success.outOfFanceInOut == 'OUT' && success.outOfFanceAllow == 'N') {
                $ionicLoading.hide()
                deleteLocalPunches(id)
                showAlert("Sorry, Can't mark attendance as you are out of Geo-Fence");
                return;
            }
            if ((success.isSignOut == 'SIGNIN' || success.isSignOut == 'DA' ||
                success.isSignOut == 'Swipe Card' || success.isSignOut == 'WEB') && ($scope.onlineInSyncClick == false)) {
                $scope.punchOut.outOfFance = success.outOfFanceInOut;
                onSuccess1(id);
            }
            else if ((success.isSignOut == 'SIGNIN') && ($scope.onlineInSyncClick == true)) {
                $scope.punchOut.outOfFance = success.outOfFanceInOut;
                OnSyncSuccess1(id);
            }
            else if (success.isSignOut == 'SIGNOUT' || success.isSignOut == 'OD') {
                $scope.punchOut.outOfFance = success.outOfFanceInOut;
                $ionicLoading.hide()
                onSuccess1(id);

            } else if (success.isSignOut == 'OUTOFBRANCH') {
                $ionicLoading.hide()
                showAlert('Sorry cannot mark attendance as you are out of branch network');
            } else if (success.isSignOut == 'BIOMATRIXON') {
                $ionicLoading.hide()
                deleteLocalPunches(id)
                showAlert("Sorry cannot mark attendance through system as bio matrix is on");
            } else {
                if ($scope.todaysRecordCount > 0) {
                    $scope.punchOut.outOfFance = success.outOfFanceInOut;
                    $ionicLoading.hide()
                    onSuccess1(id);
                } else {
                    deleteLocalPunches(id)
                    showAlert('Clock-in not done' + ' Reason ' + success.isSignOut);
                }
                $ionicLoading.hide()
            }
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    };

    var punchInSuccess = function (position) {
        $scope.clockInLocFlag = false;
        $scope.punchIn.Latitude = position.coords.latitude;
        $scope.punchIn.Longitude = position.coords.longitude;
        $scope.punchIn.Accuracy = position.coords.accuracy;
        $scope.punchIn.type = 'SIGNIN'
        $scope.punchIn.syncStatus = "Created"

        //if  (position.coords.accuracy){
        if ($scope.formatted_address != '' && $scope.formatted_address != undefined
            && $scope.formatted_address != null) {
            if ($scope.punchIn.userComment === undefined) $scope.punchIn.userComment = ""
            if ($scope.punchIn.userComment == 'undefined') $scope.punchIn.userComment = ""

            $scope.punchIn.geoLocationAddress = $scope.formatted_address
        } else {
            if ($scope.punchIn.userComment === undefined) $scope.punchIn.userComment = ""
            if ($scope.punchIn.userComment == 'undefined') $scope.punchIn.userComment = ""

            $scope.punchIn.geoLocationAddress = ''
            $scope.punchIn.userComment = $scope.punchIn.userComment + "\n(GPS turned off)";
        }


        homeService.getResult("SIGNIN", function (length, data) {
            if (length == 0) {
                homeService.insertData($scope.punchIn, function (data) {
                    if (navigator.connection.type == Connection.NONE) {
                        showAlert("Error", "No network connection clock-in done offline")
                        $scope.getRemainingSync('NOTDONE')
                        $ionicLoading.hide();
                        return;
                    }
                    $scope.SignIn(data.insertId, $scope.punchIn);
                    if (typeof google.maps === 'object') {
                        if (position.coords.latitude == null) {
                            defaultInitMap();
                        }
                        else {
                            initMap(position.coords.latitude, position.coords.longitude);
                        }
                    } else {
                        $ionicLoading.hide();
                    }
                }, function (data) {
                    showAlert("Please try again");
                    $ionicLoading.hide()
                    if (!$scope.$$phase)
                        $scope.$apply()
                })
            } else if (length == 1) {
                //this case should not arise.
                if (data.syncStatus == 'DONE') {
                    $ionicLoading.hide()
                    if (!$scope.$$phase)
                        $scope.$apply()
                    showAlert("Once punch-in cannot clock-in again")
                } else {
                    $ionicLoading.hide();
                    $scope.SignIn(data.id, $scope.punchIn);
                }
            }
        }, function (data) {
            showAlert("Please try again")
            $ionicLoading.hide();
            if (!$scope.$$phase)
                $scope.$apply()
        })
    }

    $scope.clockInClicked = function () {
        //  alert("click clock in")
        if ($scope.userDisallowedLocation == 'false') {
            if ($scope.formatted_address == '') {
                if ($scope.pleaseEnablePrompted == 'true') {
                    //$scope.refreshpage();
                }
                //alert("calling init clockin")
                init()
                window.plugins.toast.showWithOptions(
                    {
                        message: "Your location address is being accessed. Please wait...",
                        duration: "long",
                        position: "center",
                        addPixelsY: -80
                    }
                )

                return
            }
        }

        if ($scope.stopClockiInOut == 'true') {
            showAlert("My Attendance is not enabled. Please contact HR.")
            return;
        }
        //check time elapsed bnetween page opened and now- button clicked
        if (new Date() - pageOpenedTime > 30000) {
            //30 seconds have elapsed
            //refresh the page 
            callClockInClickAfterInit = "true"
            init()
            return

        }
        if ($scope.workFlowCheckFeature = 'true') {
            $scope.checkWorkflow("PUNCH_IN")
        } else {
            $scope.postPunchIn()
        }
    }

    $scope.clockOutClicked = function () {
        //alert("click clock out")
        //check if we hav punches if no, then call clockinclicked,
        //as other wise we will get error clock-in not done.
        if ($scope.listOfClockInOut) {
            if ($scope.listOfClockInOut.length == 0) {
                $scope.clockInClicked()
                return
            }
        }

        if ($scope.userDisallowedLocation == 'false') {
            if ($scope.formatted_address == '') {
                if ($scope.pleaseEnablePrompted == 'true') {

                    //$scope.refreshpage();
                }
                //alert("calling init clock out")
                init()

                window.plugins.toast.showWithOptions(
                    {
                        message: "Your location address is being accessed. Please wait...",
                        duration: "long",
                        position: "center",
                        addPixelsY: -80
                    }
                )
                return
            }
        }

        if (new Date() - pageOpenedTime > 30000) {
            //30 seconds have elapsed
            //refresh the page 
            callClockOutClickAfterInit = "true"
            init()
            return

        }

        if ($scope.workFlowCheckFeature = 'true') {
            $scope.checkWorkflow("PUNCH_OUT")
        } else {
            $scope.postPunchOut()
        }
    }


    $scope.postPunchIn = function () {
        //alert($scope.todaysRecordCount)

        if ($scope.todaysRecordCount % 2 == 0) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Do you want to Clock-in?',
            });
        } else {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Do you want to Clock-out?',
            });
        }

        confirmPopup.then(function (res) {
            if (res) {
                $scope.enableClockInOutButtons("false")
                $ionicLoading.show({});
                $scope.checkSync.checkIn = true;
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
                //$scope.clockInLocFlag = true;
                punchInSuccess($scope.lastPosition)
                return

                if ($scope.GPSAccuracyLow == 'true') {
                    if (device.platform === 'Android') {
                        LocationServices.getCurrentPosition(punchInSuccess, currentLocErrorOnClockInClockOut, {
                            maximumAge: 3000,
                            timeout: 5000,
                            enableHighAccuracy: false
                        });
                    } else {
                        navigator.geolocation.getCurrentPosition(punchInSuccess, currentLocErrorOnClockInClockOut, {
                            maximumAge: 3000,
                            timeout: 5000,
                            enableHighAccuracy: false
                        });
                    }
                } else {
                    if (device.platform === 'Android') {
                        LocationServices.getCurrentPosition(punchInSuccess, currentLocErrorOnClockInClockOut, {
                            maximumAge: 3000,
                            timeout: 5000,
                            enableHighAccuracy: true
                        });
                    } else {
                        navigator.geolocation.getCurrentPosition(punchInSuccess, currentLocErrorOnClockInClockOut, {
                            maximumAge: 3000,
                            timeout: 5000,
                            enableHighAccuracy: true
                        });
                    }
                }
            }
            else {
                // Nothing to do.
            }
        });
    }
    var punchOutSuccess = function (position) {
        $scope.clockOutLocFlag = false;
        $scope.punchOut.Latitude = position.coords.latitude;
        $scope.punchOut.Longitude = position.coords.longitude;
        $scope.punchOut.Accuracy = position.coords.accuracy;
        $scope.punchOut.type = 'SIGNOUT'
        $scope.punchOut.syncStatus = "Created"
        //$scope.punchOut.userComment = $scope.punchIn.userComment;
        //if  (position.coords.accuracy){
        //if (position.coords.accuracy > 0 ){
        if ($scope.formatted_address != '' && $scope.formatted_address != undefined
            && $scope.formatted_address != null) {
            if ($scope.punchIn.userComment === undefined) $scope.punchIn.userComment = ""
            if ($scope.punchIn.userComment == 'undefined') $scope.punchIn.userComment = ""
            $scope.punchOut.userComment = $scope.punchIn.userComment;
            $scope.punchOut.geoLocationAddress = $scope.formatted_address

        } else {
            if ($scope.punchIn.userComment === undefined) $scope.punchIn.userComment = ""
            if ($scope.punchIn.userComment == 'undefined') $scope.punchIn.userComment = ""
            $scope.punchOut.geoLocationAddress = ''
            $scope.punchOut.userComment = $scope.punchIn.userComment + "\n(GPS turned off)";

        }

        homeService.getResult("SIGNIN", function (length, data) {
            if (length == 0) {
                $ionicLoading.hide();
                showAlert("Please clock-in before clock-out")
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
                return;
            } else {
                homeService.getResult("SIGNOUT", function (length, data) {
                    if (length == 0) {
                        homeService.insertData($scope.punchOut, function (data) {
                            if (navigator.connection.type == Connection.NONE) {
                                showAlert("Error", 'No network connection clock-out done offline')
                                $ionicLoading.hide();
                                $scope.getRemainingSync('NOTDONE');
                                return;
                            }
                            $scope.SignOut(data.insertId, $scope.punchOut);
                            if (typeof google.maps === 'object') {
                                if (position.coords.latitude == null) {
                                    defaultInitMap();
                                }
                                else {
                                    initMap(position.coords.latitude, position.coords.longitude);
                                }
                            }
                            $ionicLoading.hide();
                        }, function (data) {
                            $ionicLoading.hide()
                            showAlert("Please try again");
                            if (!$scope.$$phase)
                                $scope.$apply()
                        })
                    } else if (length == 1) {
                        ///rajesh
                        if (data === undefined) {
                            $ionicLoading.hide()
                            if (!$scope.$$phase)
                                $scope.$apply()
                            $scope.SignOut("", $scope.punchOut)
                        }
                        else if (data.syncStatus == 'DONE') {
                            $ionicLoading.hide()
                            if (!$scope.$$phase)
                                $scope.$apply()
                            //     showAlert("Once clock-out cannot clock-out again")
                            $scope.SignOut(data.id, $scope.punchOut)
                        } else {
                            $ionicLoading.hide();
                            $scope.SignOut(data.id, $scope.punchOut)
                        }
                    }
                }, function (data) {
                    $ionicLoading.hide();
                    showAlert("Please try again");
                    if (!$scope.$$phase)
                        $scope.$apply()
                })
            }
        }, function (data) {
            $ionicLoading.hide();
            showAlert("Please try again");
            if (!$scope.$$phase)
                $scope.$apply()
        })
    }
    $scope.postPunchOut = function () {
        if ($scope.todaysRecordCount % 2 == 0) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Do you want to Clock-in?',
            });
        } else {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Do you want to Clock-out?',
            });
        }


        confirmPopup.then(function (res) {
            if (res) {
                $scope.enableClockInOutButtons("false")
                $ionicLoading.show({});
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
                $scope.checkSync.checkOut = true;
                $scope.clockOutLocFlag = true;
                punchOutSuccess($scope.lastPosition)
                return

                if ($scope.GPSAccuracyLow == 'true') {
                    if (device.platform === 'Android') {
                        LocationServices.getCurrentPosition(punchOutSuccess, currentLocErrorOnClockInClockOut, {
                            maximumAge: 3000,
                            timeout: 5000,
                            enableHighAccuracy: false
                        });
                    } else {
                        navigator.geolocation.getCurrentPosition(punchOutSuccess, currentLocErrorOnClockInClockOut, {
                            maximumAge: 3000,
                            timeout: 5000,
                            enableHighAccuracy: false
                        });
                    }
                } else {
                    if (device.platform === 'Android') {
                        LocationServices.getCurrentPosition(punchOutSuccess, currentLocErrorOnClockInClockOut, {
                            maximumAge: 3000,
                            timeout: 5000,
                            enableHighAccuracy: true
                        });
                    } else {
                        navigator.geolocation.getCurrentPosition(punchOutSuccess, currentLocErrorOnClockInClockOut, {
                            maximumAge: 3000,
                            timeout: 5000,
                            enableHighAccuracy: true
                        });
                    }
                }
            }
            else {
                // nothing to do.
            }
        });
    }
    var OnSyncSuccess = function (id) {
        $ionicLoading.show({});
        $scope.getSignInService = new getSignInService();
        $scope.getSignInService.$save($scope.punchIn, function (success) {
            if (!(success.clientResponseMsg == "OK")) {
                console.log(success.clientResponseMsg)
                handleClientResponse(success.clientResponseMsg, "getSignInService")
            }

            //homeService.updateStatus(id, function (data) {
            homeService.deleteOffLineData(id, function (data) {
                $scope.getRemainingSync('NOTDONE');
                $scope.punchIn.userComment = "";
                $ionicLoading.hide();
            }, function (data) {
                $ionicLoading.hide()
                showAlert("Please try again")
                if (!$scope.$$phase)
                    $scope.$apply()
            });
        }, function (error) {
            $ionicLoading.hide()
            showAlert("Alert", "Failed to clock-in")
        });
    }

    var OnSyncSuccess1 = function (id) {
        $ionicLoading.show({});
        $scope.getSignInService = new getSignInService();
        $scope.getSignInService.$save($scope.punchOut, function (success) {
            if (!(success.clientResponseMsg == "OK")) {
                console.log(success.clientResponseMsg)
                handleClientResponse(success.clientResponseMsg, "getSignInService")
            }

            //homeService.updateStatus(id, function (data) {
            homeService.deleteOffLineData(id, function (data) {
                $scope.getRemainingSync('NOTDONE');
                $scope.punchIn.userComment = "";
                $ionicLoading.hide();
            }, function (data) {
                $ionicLoading.hide()
                showAlert("Please try again")
                if (!$scope.$$phase)
                    $scope.$apply()
            });
        }, function (error) {
            $ionicLoading.hide()
            showAlert("Alert", "Failed to clock-in")
        });
    }

    $scope.syncCheckIn = function () {

        if (navigator.connection.type == Connection.NONE) {
            showAlert("Error", "No network connection");
            return;
        }
        else
            $ionicLoading.show({});
        $scope.checkInType = {}
        $scope.onlineInSyncClick = true;
        if ($scope.punchInCnt >= 1) {
            $scope.checkInType = 'SIGNIN';
        } else if ($scope.punchOutCnt >= 1) {
            $scope.checkInType = 'SIGNOUT';
        }
        $scope.getRemainingSync('NOTDONE');

        homeService.getRemData('NOTDONE', $scope.checkInType, function (data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    $scope.punchIn = data[i];
                    if ($scope.punchIn.type == 'SIGNIN')
                        $scope.SignIn(data[i].id, data[i]);
                    else {
                        $scope.SignOut(data[i].id, data[i]);
                        $scope.syncButton = true;
                    }
                }
                if (!$scope.$$phase)
                    $scope.$apply()
            } else {
                $ionicLoading.hide();
                if (!$scope.$$phase)
                    $scope.$apply()
            }
        }, function (data) {
            $ionicLoading.hide();
            if (!$scope.$$phase)
                $scope.$apply()
        })
    }


    $scope.setCompGeoParams = function () {
        $ionicLoading.show();
        var dataObj;
        $scope.getGeoFenceParams = new getGeoFenceParams();
        $scope.getGeoFenceParams.$save(dataObj, function (success) {
            if (!(success.clientResponseMsg == "OK")) {
                console.log(success.clientResponseMsg)
                handleClientResponse(success.clientResponseMsg, "getGeoFenceParams")
            }

            if (success.msg == "ERROR") {
                $ionicLoading.hide()
            } else {
                localStorage.setItem("compLat", success.compLat);
                localStorage.setItem("compLong", success.compLong);
                localStorage.setItem("compRadius", success.compRadius);
            }
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });

        $ionicLoading.hide()
    }


    $scope.showTodaysClockInOutData = function () {
        $ionicLoading.show()
        $scope.getClockInOutData = new getClockInOutData();
        $scope.nothing = "";
        $scope.getClockInOutData.$save($scope.nothing, function (success) {
            $ionicLoading.hide()
            if (!(success.clientResponseMsg == "OK")) {
                console.log(success.clientResponseMsg)
                handleClientResponse(success.clientResponseMsg, "getClockInOutData")
            }

            $scope.responseList = []
            $scope.listOfClockInOut = []

            if (success.listOfClockInOut.length > 0) {
                $scope.todaysRecordCount = success.listOfClockInOut.length

                //for buttons
                $scope.todaysRecordCount = 0;
                for (var abc = 0; abc < success.listOfClockInOut.length; abc++) {
                    if (success.listOfClockInOut[abc].capturingMode != "OD") {
                        $scope.todaysRecordCount++
                    }
                    //success.listOfClockInOut[abc].geoLocationAddress = decodeURI(success.listOfClockInOut[abc].geoLocationAddress);
                }
                if (document.getElementById("divOut")) {
                    if ($scope.todaysRecordCount % 2 == 0) {
                        //$scope.hideCheckIn = '1';
                        document.getElementById("divOut").innerHTML = "Clock In "
                    } else {
                        //$scope.hideCheckIn = '0';
                        document.getElementById("divOut").innerHTML = "Clock Out"
                    }
                }
                /////////////////

                $scope.responseList = success.listOfClockInOut
                //////////
                $scope.displayLegentPending = 'false'
                for (var i = 0; i < $scope.responseList.length; i++) {
                    if ($scope.responseList[i].inTimeHourStr.length == 1) {
                        $scope.responseList[i].inTimeHourStr = '0' + $scope.responseList[i].inTimeHourStr
                    }
                    if ($scope.responseList[i].inTimeMinStr.length == 1) {
                        $scope.responseList[i].inTimeMinStr = '0' + $scope.responseList[i].inTimeMinStr
                    }

                    if ($scope.responseList[i].fenceType == "OUT" && $scope.ifOutOfFencePunchValidLocalVar == 'N') {
                        $scope.responseList[i].inTimeMinStr = $scope.responseList[i].inTimeMinStr + "(P)"
                        $scope.displayLegentPending = 'true'
                    }
                    if ($scope.selfieInPunchesFeature == "true") {
                        $scope.responseList[i].selfieSrc = baseURL + "/api/attendance/missPunch/viewPhoto.spr?apdAppId=" + $scope.responseList[i].apdAppId
                    }
                }
                var noOfMobilePunches = 0
                var punchHrs = 0
                var punchMins = 0
                for (var i = 0; i < $scope.responseList.length; i++) {

                    if ($scope.responseList[i].comments.substring(0, 4) == "null") {
                        $scope.responseList[i].comments = ''
                    }

                    if ($scope.responseList[i].capturingMode == "OD") {
                        //dont need to include in new list
                    } else {
                        $scope.listOfClockInOut[$scope.listOfClockInOut.length] = $scope.responseList[i]
                        if (GeoTrackingEnabledForUser == "true" && GeoTrackingFeatureEnabledForClient == "true") {
                            if ($scope.listOfClockInOut[$scope.listOfClockInOut.length - 1].source == "MOBILE") {
                                noOfMobilePunches++;
                                punchHrs = $scope.listOfClockInOut[$scope.listOfClockInOut.length - 1].inTimeHourStr
                                punchMins = $scope.listOfClockInOut[$scope.listOfClockInOut.length - 1].inTimeMinStr

                            }
                        }
                    }


                }

                if (GeoTrackingEnabledForUser == "true" && GeoTrackingFeatureEnabledForClient == "true") {
                    if (noOfMobilePunches % 2 == 0) {
                        gstr_odd_even_punches = "EVEN"
                        GeoTrackingON_OFF = "OFF"
                        makeGeoTrackingLocCaptureON_OFF("OFF")
                    } else {
                        gstr_odd_even_punches = "ODD"
                        GeoTrackingON_OFF = "ON"
                        makeGeoTrackingLocCaptureON_OFF("ON")
                        $timeout(function () {
                            if (GeoTrackingEnabledForUser == "true" && GeoTrackingFeatureEnabledForClient == "true") {
                                // alert("getting location")
                                getManualLocation($scope.lastPosition)
                            }

                        }, 2000)

                        //check if noOfMobilePunches is 1 and 
                        // time of this mobile punch is less than 1 minutes from now
                        // user has just made first mobile punch
                        // register lastdt as now.
                        //call for manual locaion

                        // if (noOfMobilePunches == 1) {
                        //     var dtTmp = new Date()
                        //     dtTmp.setHours(punchHrs)
                        //     dtTmp.setMinutes(punchMins)
                        //     dtNow = new Date()
                        //     if (dtNow.getTime() - dtTmp.getTime() < 60 * 1000) {
                        //         // this is the first punched and done now
                        //         localStorage.setItem("lastLocSavedDtt", dtNow)
                        //     }
                        // }
                    }
                }

                if (GeoTrackingEnabledForUser == "true" && GeoTrackingFeatureEnabledForClient == "true") {
                    $scope.geoTrackMsg = "GT:" + GeoTrackingON_OFF
                }


                if ($scope.listOfClockInOut.length == 0)
                    $("#todaysClockInOutDataDiv").hide();
                else
                    $("#todaysClockInOutDataDiv").show();


                //////////
                if (!$scope.$$phase)
                    $scope.$apply()
            }
            else if (success.listOfClockInOut.length == 0) {
                $("#todaysClockInOutDataDiv").hide();
                if (GeoTrackingEnabledForUser == "true" && GeoTrackingFeatureEnabledForClient == "true") {
                    makeGeoTrackingLocCaptureON_OFF("OFF")
                    $scope.geoTrackMsg = "GT:" + GeoTrackingON_OFF
                }

            }
            $ionicLoading.hide()
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            $("#todaysClockInOutDataDiv").hide();
            commonService.getErrorMessage(data);
        })
    }

    $scope.geocodeLatLng = function (geocoder, map, infowindow, lat, lng) {
        var input = lat + "," + lng
        var latlngStr = input.split(',', 2);
        var latlng = { lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1]) };
        geocoder.geocode({ 'location': latlng }, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    map.setZoom(14);
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: map
                    });
                    infowindow.setContent(results[0].formatted_address);
                    $scope.formatted_address = results[0].formatted_address;
                    infowindow.open(map, marker);
                } else {
                    //showAlert(alert_header, 'No results found');
                    infowindow.setContent("Address Not Available");
                    $scope.formatted_address = null
                }
            } else {
                // showAlert(alert_header, 'Failed Status :' +status);
                infowindow.setContent("Address Not Available");
                $scope.formatted_address = null
            }
        });
    }



    // $timeout(function () {
    //     init();
    // },1000)

    init();

    $timeout(function () {
        if ($scope.mapsLoaded == "false") {
            if (window.device.platform != "Android") {
                init();
            }
        }
    }, 4000)


    $scope.refreshpage = function () {
        //$state.go($state.current, {}, {reload: true});
        //$state.reload()
        $scope.locRetryCount = 0
        init()
    }



    var deleteLocalPunches = function (id) {
        homeService.deleteOffLineData(id, function (data) {
            $ionicLoading.hide()
            $scope.punchIn.userComment = "";
            $rootScope.punchDataAvlblAtMobile_yyyymm = ""

            $timeout(function () {
                $scope.showTodaysClockInOutData()
            }, 1000)

        }, function (data) {
            $ionicLoading.hide()
            showAlert("Please try again")
            if (!$scope.$$phase)
                $scope.$apply()
        });
    }



    $scope.cameraTakePicture = function (mode) {
        var imgcontrolName = "showImg"

        if (mode == "camera") {

            navigator.camera.getPicture(onSuccessOfCamera, onFailOfCamera, {
                quality: 25,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                cameraDirection: Camera.Direction.FRONT,
                correctOrientation: true

            });
            function onSuccessOfCamera(imageData) {
                var image = document.getElementById(imgcontrolName);
                image.style.visibility = "visible"
                image.style.display = "inline-block"
                //document.getElementById('camIcon').style.marginTop = '50px';
                if (window.device.platform != "Android") {
                    image.src = "data:image/jpeg;base64," + imageData;
                    $scope.imageData = "data:image/jpeg;base64," + imageData;
                } else {
                    var thisResult = JSON.parse(imageData);
                    // convert json_metadata JSON string to JSON Object 
                    //var metadata = JSON.parse(thisResult.json_metadata);
                    image.src = "data:image/jpeg;base64," + thisResult.filename;
                    $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;
                }
                // convert JSON string to JSON Object
                //var thisResult = JSON.parse(imageData);
                // convert json_metadata JSON string to JSON Object 
                //var metadata = JSON.parse(thisResult.json_metadata);
                //image.src = "data:image/jpeg;base64," + thisResult.filename;
                //$scope.imageData = "data:image/jpeg;base64," + thisResult.filename;

                if (!$scope.$$phase)
                    $scope.$apply()
            }

            function onFailOfCamera(message) {
                showAlert(message);
            }
        }

    }

    $scope.removeAttachment = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '',
            template: 'Do you want to remove image?', //Message
        });
        confirmPopup.then(function (res) {
            if (res) {
                var imgcontrolName = "showImg"
                var image = document.getElementById(imgcontrolName);
                image.src = ""
                image.style.visibility = "hidden"
            }
        });
    }

    $scope.enableClockInOutButtons = function (enable) {
        if (enable == "true") {
            if (document.getElementById("divOut"))
                document.getElementById("divOut").disabled = false

            if (document.getElementById("divIn"))
                document.getElementById("divIn").disabled = false

        } else {
            if (document.getElementById("divOut"))
                document.getElementById("divOut").disabled = true

            if (document.getElementById("divIn"))
                document.getElementById("divIn").disabled = true
        }
    }


});
