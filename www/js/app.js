
var mainModule = angular.module('starter', ['ionic', 'ngResource'])
var db;

mainModule.run(function ($ionicPlatform, $timeout, $ionicPopup, $ionicHistory, $rootScope,
    $window, $ionicLoading, $state, $timeout) {
    $ionicLoading.hide();


    var getDateinDDMMYYYYApp = function (dt) {
        var dd, mm, yyyy

        dd = dt.getDate()
        if (dd < 10) dd = '0' + dd.toString()

        mm = dt.getMonth()
        mm = mm + 1
        if (mm < 10) mm = '0' + mm.toString()

        yyyy = dt.getFullYear()

        return dd + "/" + mm + "/" + yyyy
    }

    var getTimeinHHMMSSApp = function (dt) {
        var hh, mm, ss

        hh = dt.getHours()
        if (hh < 10) hh = '0' + hh.toString()

        mm = dt.getMinutes()
        if (mm < 10) mm = '0' + mm.toString()

        ss = dt.getSeconds()
        if (ss < 10) ss = '0' + ss.toString()

        return hh + ":" + mm + ":" + ss
    }

    $ionicPlatform.ready(function () {


        var dbglog = localStorage.getItem("DEBUG_LOG")
        if (dbglog == null) {
            localStorage.setItem("DEBUG_LOG", "AppStart: " + new Date())

        } else {
            localStorage.setItem("DEBUG_LOG", dbglog + "<br>AppStart: " + new Date())
        }
        localStorage.setItem("AppStartTime", new Date())
        if (localStorage.getItem("AppPauseTime") != null) {
            var lastPauseDtt = new Date(localStorage.getItem("AppPauseTime"))
            if (new Date() - lastPauseDtt > 300000) {
                var appKillTime = "App was killed between " + new Date(localStorage.getItem("AppPauseTime")) + " and " + new Date()
                fdt = new Date(localStorage.getItem("AppPauseTime"))
                tdt = new Date()
                frmDt = getDateinDDMMYYYYApp(fdt)
                frmTm = getTimeinHHMMSSApp(fdt)
                toDt = getDateinDDMMYYYYApp(tdt)
                toTm = getTimeinHHMMSSApp(tdt)
                saveUnsavedAppKilledDataLocally(frmDt, toDt, frmTm, toTm)
            }
        }

        localStorage.setItem("DEBUG_LOG", dbglog + "<br><br>" + appKillTime + "<br>")

        $rootScope.helpModalOpened = false
        // alert("ready")
        // var rm = localStorage.getItem("rememberMeFlag")
        // alert(rm)
        //alert(navigator.camera)



    //////////// permissions for android 12  ///////////////
    if (window.device.platform == "Android") {
        $rootScope.getPermissions = function () {
            var permissions = cordova.plugins.permissions;
            // alert("list")
            var list = [
                permissions.ACCESS_FINE_LOCATION,
                permissions.ACCESS_COARSE_LOCATION,
                permissions.ACCESS_LOCATION_EXTRA_COMMANDS,
                permissions.READ_EXTERNAL_STORAGE,
                permissions.CAMERA,
                permissions.READ_PHONE_STATE,
                permissions.ACCESS_NETWORK_STATE,
                permissions.AUTHENTICATE_ACCOUNTS,
                permissions.WRITE_EXTERNAL_STORAGE
            ];

            permissions.requestPermissions(
                list,
                function (status) {
                    if (!status.hasPermission) error(); else {
                        //alert("all prmissions")
                    }
                },
                error);

            //      permissions.requestPermission( permissions.ACCESS_FINE_LOCATION, success, error);

            function error() {
                // alert("NO PERMISIONN")
                return
                //console.warn('Camera permission is not turned on');
            }

            function success(status) {
                if (!status.hasPermission) error();
                alert("has permission")
            }
        }

    }      
    
    
        if (window.device.platform == "Android") {
            $rootScope.getPermissions();
        }
        document.addEventListener("offline", onOffline, false);
        function onOffline() {
            window.plugins.toast.showWithOptions(
                {
                    message: "No network connection.",
                    duration: "long",
                    position: "center",
                    addPixelsY: -40
                }
            )
            $ionicLoading.hide()
        }

        document.addEventListener("pause", onPause, false);
        function onPause() {
            // Handle the pause event  
            localStorage.setItem("AppPauseTime", new Date())
            var dbglog = localStorage.getItem("DEBUG_LOG")
            pauseDate = new Date()
            if (dbglog == null) {
                localStorage.setItem("DEBUG_LOG", "AppPause: " + pauseDate)
            } else {
                localStorage.setItem("DEBUG_LOG", dbglog + "<br>AppPause: " + pauseDate)
            }
        }

        document.addEventListener("resume", onResume, false);
        function onResume() {
            // Handle the resume event 
            var dbglog = localStorage.getItem("DEBUG_LOG")
            resDate = new Date()
            if (dbglog == null) {
                localStorage.setItem("DEBUG_LOG", "AppResume: " + resDate)
            } else {
                localStorage.setItem("DEBUG_LOG", dbglog + "<br>AppResume: " + resDate)
            }
        }
        // document.addEventListener("online", onOnline, false);
        // function onOnline() {
        //     window.plugins.toast.showWithOptions(
        //             {
        //                 message: "You are now online.",
        //                 duration: "long",
        //                 position: "center",
        //                 addPixelsY: -40
        //             }
        //     )
        // }


        ///////////
        if (window.device.platform == "iOSaa") {
            window.FirebasePlugin.onNotificationOpen(function (notification) {
                console.log("notification");
                $rootScope.pushNotiMessage = notification.body
                $rootScope.pushNotiTitle = notification.title
                $rootScope.pushNotiTap = notification.tap

                $rootScope.showPushNotiPopup()

            }, function (error) {
                console.log(error);
            });
        }

        //////////
        ///////////////////// new cordova's methods start ////////

        if (window.device.platform == "Android") {
            cordova.plugins.firebase.messaging.onMessage(function (payload) {
                console.log("New foreground FCM message: ", payload);

                console.log("notification");
                //alert("pn")
                $rootScope.pushNotiMessage = payload.gcm.body
                $rootScope.pushNotiTitle = payload.gcm.title
                $rootScope.pushNotiTap = false

                $rootScope.showPushNotiPopup()

            });

            cordova.plugins.firebase.messaging.onBackgroundMessage(function (payload) {
                console.log("New background FCM message: ", payload);

                //alert("pn BACKGROUND")
                $rootScope.pushNotiMessage = payload.body
                $rootScope.pushNotiTitle = payload.title
                $rootScope.pushNotiTap = true


                $rootScope.showPushNotiPopup()
            });

            cordova.plugins.firebase.messaging.requestPermission().then(function () {
                console.log("Push messaging is allowed");
                //alert("PN ALLOW")
            });

            cordova.plugins.firebase.messaging.requestPermission({ forceShow: true }).then(function () {
                console.log("You'll get foreground notifications when a push message arrives");
            });

            cordova.plugins.firebase.messaging.getToken().then(function (token) {
                console.log("Got device token: ", token);
                //alert("device token"+ token)
            });
            // cordova.plugins.firebase.messaging.getInstanceId().then(function(instanceId) {
            //     console.log("Got instanceId: ", instanceId);
            // });


        }

        //////////////////// new cordova's methos over  ////////////
        ///////////
        /*
        window.FirebasePlugin.onNotificationOpen(function(notification) {
             console.log("notification ");
             alert("old style  onNotificationOpen")  
            $rootScope.pushNotiMessage = notification.body
            $rootScope.pushNotiTitle = notification.title
            $rootScope.pushNotiTap = notification.tap

            $rootScope.showPushNotiPopup()

        }, function(error) {
        console.log(error);
        });
        */
        ////////////////////////

        $rootScope.model = window.device.model
        $rootScope.manufacturer = window.device.manufacturer
        $rootScope.uuid = window.device.uuid

        if (window.device.platform == "Android") {
            window.plugins.sim.hasReadPermission(function (succ) {
                $rootScope.getDeviceData();
                ///////////////////
                if (succ == false) {
                    window.plugins.sim.requestReadPermission(function (succ1) {
                        $rootScope.getDeviceData();
                    }, function (err1) {
                        //	alert("req per err1" + err1)		
                    });
                }
            }, function (err) {
                //alert("has per err" + err)		

            });
        }

        console.log("$rootScope.model " + $rootScope.model);
        console.log("$rootScope.manufacturer " + $rootScope.manufacturer);
        console.log("$rootScope.uuid " + $rootScope.uuid);

        //////////////////////////////	

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            cordova.plugins.Keyboard.disableScroll(false);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.overlaysWebView(false)
            //StatusBar.styleDefault();
            StatusBar.backgroundColorByHexString('#000000');
            StatusBar.hide()
            //$timeout(function () {StatusBar.show()},500)


            //StatusBar.backgroundColorByHexString('#000000');
            //            StatusBar.styleBlackTranslucent()
            //StatusBar.backgroundColorByHexString('#FFFFFF');


        }



        // alert("till sqlite")
        db = window.sqlitePlugin.openDatabase({
            name: 'HRAlignApp.db',
            iosDatabaseLocation: 'default'
        }, function () {
            //ssalert("opened db")
            db.transaction(function (tx) {
                //alert("creating table")
                tx.executeSql('CREATE TABLE IF NOT EXISTS PunchInPunchOut (id integer primary key AUTOINCREMENT,empId integer,Latitude text,Longitude text,Accuracy text,Date_Time integer,type text,syncStatus text,createdDate Date)');

            }, function (e) {

                console.log("Internal Server Error ....!", e);
            });
        },
            function (data) {
                alert("db not opened" + data)
            });


        $rootScope.gIntLeaveRequestCount = -15
        $rootScope.gIntODRequestCount = -1
        $rootScope.gIntAttRequestCount = -1
        $rootScope.gIntSCRequestCount = -1
        $rootScope.gIntTransactionRequestCount = -1
        $rootScope.gIntVacancyRequestCount = -1
        $rootScope.gIntTravelRequestCount = -1
        $rootScope.gIntTravelClaimRequestCount = -1
        $rootScope.gIntCTCRequestCount = -1
        $rootScope.gIntNonCTCRequestCount = -1
        $rootScope.gIntLTARequestCount = -1

        $rootScope.gIntLeaveApproveCount = -1
        $rootScope.gIntODApproveCount = -1
        $rootScope.gIntAttApproveCount = -1
        $rootScope.gIntSCApproveCount = -1
        $rootScope.gIntTransactionApproveCount = -1
        $rootScope.gIntVacancyApproveCount = -1
        $rootScope.gIntTravelApproveCount = -1
        $rootScope.gIntTravelClaimApproveCount = -1
        $rootScope.gIntCTCApproveCount = -1
        $rootScope.gIntNonCTCApproveCount = -1
        $rootScope.gIntLTAApproveCount = -1


        //////////////////////////////// cofrdova background location plugin

    }); //on ready

    $rootScope.themes = [
        {
            name: "Navy Blue",
            url: "navyTheme.css"
        },
        {
            name: "Green",
            url: "greenTheme.css"
        },
        {
            name: "Coral",
            url: "coral.css"
        },
        {
            name: "Teal",
            url: "tealTheme.css"
        },
        {
            name: "Orange",
            url: "Orange.css"
        }
    ];

    var selectedTheme = $window.localStorage.theme;

    if (selectedTheme) {
        $rootScope.theme = selectedTheme;

    } else {
        $rootScope.theme = "navyTheme.css";

    }

    var flag = 0;
    $ionicPlatform.registerBackButtonAction(function () {
        if ($state.current.name == 'app.home.selfService' 
        || $state.current.name == 'app.home' || $state.current.name == 'app.home.dashboard'
        || $state.current.name == 'changePassword'
        ) {
            window.plugins.toast.showWithOptions(
                {
                    message: "Press again to Exit",
                    duration: 1000,
                    position: "bottom",
                }
            )

            if (flag == 1) {
                navigator.app.exitApp();
            } else {
                flag = 1
                $timeout(function () {
                    flag = 0
                }, 2000)
            }
        } else if ($state.current.name == 'login') {
            //check if forgot help modal is open
            if ($rootScope.helpModalOpened == false) {
                navigator.app.exitApp();
            }
        } else if ($state.current.name == 'intro') {
            navigator.app.exitApp();
        } else {
            //$ionicHistory.nextViewOptions({disableBack: true});
            //here history wise back button to be handeled
            //alert($rootScope.navHistoryPrevPage)
            switch ($rootScope.navHistoryPrevPage) {
                case undefined:
                    window.plugins.toast.showWithOptions(
                        {
                            message: "Please input Connection Settings",
                            duration: 1000,
                            position: "bottom",
                        }
                    )
                    break;
                case "dashboard":
                    if ($rootScope.navHistoryCurrPage == "selfservices") {
                        $state.go('app.home.selfService')
                    } else {
                        $state.go('app.home.dashboard')
                    }
                    break;
                case "selfservices":
                    $state.go('app.home.selfService')
                    break;
                case "requisition":
                    $state.go('app.RequestListCombined')
                    break;
                case "approvals":
                    $state.go('app.MyApprovalsCombined')
                    break;
                case "requisitionNew":
                    $state.go('app.requestMenu')
                    break;
                case "approvalsNew":
                    $state.go('app.approvalsMenu')
                    break;
                case "my_team_detail":
                    $state.go('app.myTeamDetail')
                    break;
                case "ReqTrCl":
                    $state.go('app.RequestListCombined')
                    break;
                case "ClaimTravelDetails":
                    $state.go('claimTravelDetails')
                    break;
                case "GET_NEW_APP_PAGE":
                    navigator.app.exitApp();
                    break;
                case "UNINSTALL_OLD_APP":
                    navigator.app.exitApp();
                    break;
                case "approveClaimList":
                    $state.go('approvalClaimList')
                    break;
                case "requestTransactionList":
                    $state.go('requestTransactionList')
                    break;
                case "approvalsTransactionList":
                    $state.go('approvalTransactionList')
                    break;
                case "approvalsTrainingRequestList":
                    if ($rootScope.FromTrainingRequestList == 'true') {
                        $state.go('requestTrainingRequestList')
                    } else {
                        $state.go('approvalsTrainingRequestList')
                    }
                    break;
                default:
                    $state.go($rootScope.navHistoryPrevPage)
                /*if($rootScope.lastPageBeforeMenu=="selfservices")
                    $state.go('app.home.selfService')
                else
                    $state.go('app.home.dashboard')
                    */
            }
        }
    }, 5000);

    $rootScope.getDeviceData = function () {
        /////////////////////
        window.plugins.sim.getSimInfo(function (siminfo) {
            //alert(siminfo.cards[0].simSerialNumber)	
            //alert(siminfo.cards[1].simSerialNumber)	
            // if (siminfo.cards[0])
            //     $rootScope.simSerialNumber1 = siminfo.cards[0].simSerialNumber
            // else
            //     $rootScope.simSerialNumber1 = ""


            // if (siminfo.cards[1] && siminfo.cards[1].simSerialNumber != "undefined")
            //     $rootScope.simSerialNumber1 = siminfo.cards[0].simSerialNumber
            // else
            //     $rootScope.simSerialNumber1 = ""
            // if (siminfo.phoneNumber)
            //     $rootScope.phoneNumber = siminfo.phoneNumber
            
            if (siminfo.deviceId)
                $rootScope.simDeviceId = siminfo.deviceId

            $rootScope.model = window.device.model
            $rootScope.manufacturer = window.device.manufacturer
            $rootScope.uuid = window.device.uuid
        }, function (err3) {

        });



        window.plugins.imei.get(
            function (imei) {
                $rootScope.imei = imei
                console.log("$rootScope.simSerialNumber1 " + $rootScope.simSerialNumber1);
                console.log("$rootScope.simSerialNumber2 " + $rootScope.simSerialNumber2);
                console.log("$rootScope.phoneNumber " + $rootScope.phoneNumber);
                console.log("$rootScope.simDeviceId " + $rootScope.simDeviceId);
                console.log("$rootScope.model " + $rootScope.model);
                console.log("$rootScope.manufacturer " + $rootScope.manufacturer);
                console.log("$rootScope.imei " + $rootScope.imei);
                console.log("$rootScope.uuid " + $rootScope.uuid);
            },
            function () {
                $rootScope.imei = ""
            }
        );

    }

    $rootScope.goBack = function () {
        $ionicHistory.goBack();
    };
    $rootScope.logout = function (sessionTimeoutVar2) {
        if (sessionTimeoutVar2 != 1) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Do you want to logout?',
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $rootScope.DonutDataDate = ""
                    $rootScope.punchDataAvlblAtMobile_yyyymm = ""
                    $rootScope.navHistoryPrevPage = "dashboard"
                    $rootScope.navHistoryCurrPage = "dashboard"

                    localStorage.setItem('rememberMeFlag', 0);
                    sessionStorage.clear()
                    navigator.app.exitApp();
                    // $state.go('login') //Sent to login page
                } else {
                    return;
                }
            });
        } else {
            //sessionStorage.clear()

            //$state.go('intro')
            $state.go('startUpPage')
        }
    }

    //////////// push notification pop up  ///////////////
    $rootScope.showPushNotiPopup = function () {

        var pushPopUp = $ionicPopup.show({
            template:
                '<p style="white-space: pre-wrap !important;word-wrap: break-word;padding:3px;" ><strong>{{pushNotiTitle}}</strong></p><p style="white-space: pre-wrap !important;word-wrap: break-word;">{{pushNotiMessage}}</p>',
            title: 'Push Notification',
            scope: $rootScope,
            buttons: [
                {
                    text: '<b>Close</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if ($rootScope.pushNotiTap == true) {
                            $rootScope.pushNotiTap = false
                            navigator.app.exitApp();
                        } else {
                            $rootScope.closeModal();
                        }
                    }
                }
            ]
        });
    }
    $rootScope.closeModal = function (index) {
        if (index == 1)
            $rootScope.pushPopUp.hide();
    };
    /////////////////////////////////////////////////




})



mainModule.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.views.swipeBackEnabled(false);
    $ionicConfigProvider.tabs.position("top");
    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            cache: false,
            templateUrl: 'templates/menu.html',
            controller: 'menuCtrl'
        })
        .state('app.MyApprovals', {
            url: '/MyApprovals',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/MyApprovals.html',
                    controller: 'MyApprovalsCtrl'
                }
            }
        })
        .state('app.approvalsMenu', {
            url: '/approvalsMenu',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/approvalsMenu.html',
                    controller: 'approvalsMenuCtrl'
                }
            }
        })
        .state('app.requestMenu', {
            url: '/requestMenu',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/requestMenu.html',
                    controller: 'requestMenuCtrl'
                }
            }
        })

        .state('app.approvalsTC', {
            url: '/approvalsTC',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/approvalsTC.html',
                    controller: 'approvalsTCCtrl'
                }
            }
        })
        // .state('app.teamCalendar', {
        //     url: '/teamCalendar',
        //     cache: false,
        //     views: {
        //         'menuContent': {
        //             templateUrl: 'templates/teamCalendar.html',
        //             controller: 'teamCalendarCtrl'
        //         }
        //     }
        // })

        .state('attendanceRegularisation', {
            url: '/attendanceRegularisation',
            cache: false,
            templateUrl: 'templates/attendanceRegularisation.html',
            controller: 'attendanceRegularCtrl'
        })
        .state('odApplication', {
            url: '/odApplication',
            cache: false,
            templateUrl: 'templates/ODApplication.html',
            controller: 'odApplicationCtrl'
        })
        .state('leaveApplication', {
            url: '/leaveApplication',
            cache: false,
            templateUrl: 'templates/leaveApplication.html',
            controller: 'leaveApplicationCtrl'
        })
        .state('changePassword', {
            url: '/changePassword',
            cache: false,
            templateUrl: 'templates/changePassword.html',
            controller: 'changePasswordCtrl'
        })

        .state('perfDiaryCtrl', {
            url: '/perfDiaryCtrl',
            cache: false,
            templateUrl: 'templates/perfDiary.html',
            controller: 'perfDiaryCtrl'
        })
        .state('projectConfigDetailsPage', {
            url: '/projectConfigDetailsPage',
            cache: false,
            templateUrl: 'templates/projectConfigDetailsPage.html',
            controller: 'projectConfigDetailsPageCtrl'
        })
        .state('timesheetAdd', {
            url: '/timesheetAdd',
            cache: false,
            templateUrl: 'templates/timesheetAdd.html',
            controller: 'timesheetAddCtrl'
        })
        .state('requestLeaveList', {
            url: '/requestLeaveList',
            cache: false,
            templateUrl: 'templates/requestLeaveList.html',
            controller: 'requestLeaveListCtrl'
        })
        .state('requestGrievanceList', {
            url: '/requestGrievanceList',
            cache: false,
            templateUrl: 'templates/requestGrievanceList.html',
            controller: 'requestGrievanceListCtrl'
        })
        .state('exitInterviewApplication', {
            url: '/exitInterviewApplication',
            cache: false,
            templateUrl: 'templates/exitInterviewApplication.html',
            controller: 'exitInterviewApplicationCtrl'
        })
        .state('showExitInterview', {
            url: '/showExitInterview',
            cache: false,
            templateUrl: 'templates/showExitInterview.html',
            controller: 'showExitInterviewCtrl'
        })

        .state('approvalGrievanceList', {
            url: '/approvalGrievanceList',
            cache: false,
            templateUrl: 'templates/approvalGrievanceList.html',
            controller: 'approvalGrievanceListCtrl'
        })
        .state('grievanceApplication', {
            url: '/grievanceApplication',
            cache: false,
            templateUrl: 'templates/grievanceApplication.html',
            controller: 'grievanceApplicationCtrl'
        })
        .state('grievanceApplicationDetails', {
            url: '/grievanceApplicationDetails',
            cache: false,
            templateUrl: 'templates/grievanceApplicationDetails.html',
            controller: 'grievanceApplicationDetailsCtrl'
        })
        .state('grievanceApplicationDetailsApprove', {
            url: '/grievanceApplicationDetailsApprove',
            cache: false,
            templateUrl: 'templates/grievanceApplicationDetailsApprove.html',
            controller: 'grievanceApplicationDetailsApproveCtrl'
        })
        .state('requestODList', {
            url: '/requestODList',
            cache: false,
            templateUrl: 'templates/requestODList.html',
            controller: 'requestODListCtrl'
        })
        .state('requestRegularizationList', {
            url: '/requestRegularizationList',
            cache: false,
            templateUrl: 'templates/requestRegularizationList.html',
            controller: 'requestRegularizationListCtrl'
        })
        .state('requestShiftChangeList', {
            url: '/requestShiftChangeList',
            cache: false,
            templateUrl: 'templates/requestShiftChangeList.html',
            controller: 'requestShiftChangeListCtrl'
        })
        .state('requestTravelApplicationID', {
            url: '/requestTravelApplicationID',
            cache: false,
            templateUrl: 'templates/requestTravelApplicationID.html',
            controller: 'requestTravelApplicationIDCtrl'
        })
        .state('requestClaimList', {
            url: '/requestClaimList',
            cache: false,
            templateUrl: 'templates/requestClaimList.html',
            controller: 'requestClaimListCtrl'
        })
        .state('requestTimesheetEmployeeDailyList', {
            url: '/requestTimesheetEmployeeDailyList',
            cache: false,
            templateUrl: 'templates/requestTimesheetEmployeeDailyList.html',
            controller: 'requestTimesheetEmployeeDailyListCtrl'
        })
        .state('addInvestment', {
            url: '/addInvestment',
            cache: false,
            templateUrl: 'templates/addInvestment.html',
            controller: 'addInvestmentCtrl'
        })
        .state('requestInvestmentList', {
            url: '/requestInvestmentList',
            cache: false,
            templateUrl: 'templates/requestInvestmentList.html',
            controller: 'requestInvestmentListCtrl'
        })
        .state('approvalTimesheetEmployeeDailyList', {
            url: '/approvalTimesheetEmployeeDailyList',
            cache: false,
            templateUrl: 'templates/approvalTimesheetEmployeeDailyList.html',
            controller: 'approvalTimesheetEmployeeDailyListCtrl'
        })

        .state('approvalLeaveList', {
            url: '/approvalLeaveList',
            cache: false,
            templateUrl: 'templates/approvalLeaveList.html',
            controller: 'approvalLeaveListCtrl'
        })
        .state('approvalODList', {
            url: '/approvalODList',
            cache: false,
            templateUrl: 'templates/approvalODList.html',
            controller: 'approvalODListCtrl'
        })
        .state('approvalAttendanceList', {
            url: '/approvalAttendanceList',
            cache: false,
            templateUrl: 'templates/approvalAttendanceList.html',
            controller: 'approvalAttendanceListCtrl'
        })
        .state('approvalShiftChangeList', {
            url: '/approvalShiftChangeList',
            cache: false,
            templateUrl: 'templates/approvalShiftChangeList.html',
            controller: 'approvalShiftChangeListCtrl'
        })
        .state('approvalTravelList', {
            url: '/approvalTravelList',
            cache: false,
            templateUrl: 'templates/approvalTravelList.html',
            controller: 'approvalTravelListCtrl'
        })
        .state('approvalClaimList', {
            url: '/approvalClaimList',
            cache: false,
            templateUrl: 'templates/approvalClaimList.html',
            controller: 'approvalClaimListCtrl'
        })

        .state('projectConfigList', {
            url: '/projectConfigList',
            cache: false,
            templateUrl: 'templates/projectConfigList.html',
            controller: 'projectConfigListCtrl'
        })
        .state('projectConfigListApprovals', {
            url: '/projectConfigListApprovals',
            cache: false,
            templateUrl: 'templates/projectConfigListApprovals.html',
            controller: 'projectConfigListApprovalsCtrl'
        })

        .state('projectConfigApplication', {
            url: '/projectConfigApplication',
            cache: false,
            templateUrl: 'templates/projectConfigApplication.html',
            controller: 'projectConfigApplicationCtrl'
        })
        .state('newCTCClaimApplication', {
            url: '/newCTCClaimApplication',
            cache: false,
            templateUrl: 'templates/newCTCClaimApplication.html',
            controller: 'newCTCClaimApplicationCtrl'
        })
        .state('approvalCTCdetails', {
            url: '/approvalCTCdetails',
            cache: false,
            templateUrl: 'templates/approvalCTCdetails.html',
            controller: 'approvalCTCdetailsCtrl'
        })
        .state('newNonCTCClaimApplication', {
            url: '/newNonCTCClaimApplication',
            cache: false,
            templateUrl: 'templates/newNonCTCClaimApplication.html',
            controller: 'newNonCTCClaimApplicationCtrl'
        })
        .state('newLTAClaimApplication', {
            url: '/newLTAClaimApplication',
            cache: false,
            templateUrl: 'templates/newLTAClaimApplication.html',
            controller: 'newLTAClaimApplicationCtrl'
        })
        .state('getNewAppVersion', {
            url: '/getNewAppVersion',
            cache: false,
            templateUrl: 'templates/getNewAppVersion.html',
            controller: 'getNewAppVersionCtrl'
        })
        .state('uninstallOldAppVersion', {
            url: '/uninstallOldAppVersion',
            cache: false,
            templateUrl: 'templates/uninstallOldAppVersion.html',
            controller: 'uninstallOldAppVersionCtrl'
        })

        .state('app.notifications', {
            url: '/notifications',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/notifications.html',
                    controller: 'notificationsCtrl'
                }
            }
        })
        .state('app.setting', {
            url: '/settings',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/settings.html'
                }
            }
        })
        .state('app.checkIn', {
            url: '/checkIn',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/checkIn.html',
                    controller: 'checkInCtrl'
                }
            }
        })
        .state('app.Inbox', {
            url: '/Inbox',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/Inbox.html',
                    controller: 'InboxCtrl'
                }
            }
        })
        .state('app.NotiInbox', {
            url: '/NotiInbox',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/NotiInbox.html',
                    controller: 'NotiInboxCtrl'
                }
            }
        })


        .state('app.expenseClaim', {
            url: '/expenseClaim',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/expenseClaim.html',
                    controller: 'expenseClaimCtrl'
                }
            }

        })
        .state('app.approvalClaim', {
            url: '/approvalClaim',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/approvalClaim.html',
                    controller: 'approvalClaimCtrl'
                }
            }
        })

        .state('app.payslip', {
            url: '/payslip',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/Payslip.html',
                    controller: 'paySlipCtrl'
                }
            }
        })
        .state('app.myRemu', {
            url: '/myRemu',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/myRemu.html',
                    controller: 'myRemuCtrl'
                }
            }
        })
        .state('app.faceRecog', {
            url: '/faceRecog',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/faceRecog.html',
                    controller: 'faceRecogCtrl'
                }
            }
        })
        .state('app.Holidays', {
            url: '/Holidays',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/Holidays.html',
                    controller: 'HolidaysCtrl'
                }
            }
        })
        .state('app.reportIssue', {
            url: '/reportIssue',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/reportIssue.html',
                    controller: 'reportIssueCtrl'
                }
            }
        })
        .state('app.restoreParams', {
            url: '/restoreParams',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/restoreParams.html',
                    controller: 'restoreParamsCtrl'
                }
            }
        })

        .state('app.showTracking', {
            url: '/showTracking',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/showTracking.html',
                    controller: 'showTrackingCtrl'
                }
            }
        })

        .state('app.showDebugLog', {
            url: '/showDebugLog',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/showDebugLog.html',
                    controller: 'showDebugLogCtrl'
                }
            }
        })

        .state('app.BirthDayAndAnniversary', {
            url: '/BirthDayAndAnniversary',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/BirthDayAndAnniversary.html',
                    controller: 'BirthDayAndAnniversaryCtrl'
                }
            }
        })
        .state('app.employeeDirectory', {
            url: '/employeeDirectory',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/employeeDirectory.html',
                    controller: 'employeeDirectoryCtrl'
                }
            }
        })

        .state('app.pushNotification', {
            url: '/pushNotification',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/pushNotification.html',
                    controller: 'pushNotificationCtrl'
                }
            }
        })
        .state('shiftChange', {
            url: '/shiftChange',
            cache: false,
            templateUrl: 'templates/shiftChangeApplication.html',
            controller: 'shiftChangeCtrl'
        })

        .state('app.logout', {
            url: '/logout',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/logout.html'
                }
            }
        })
        .state('login', {
            url: '/login',
            cache: false,
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
        })
        .state('intro', {
            url: '/intro',
            cache: false,
            templateUrl: 'templates/intro.html',
            controller: 'introCtrl'
        })
        .state('startUpPage', {
            url: '/startUpPage',
            cache: false,
            templateUrl: 'templates/startUpPage.html',
            controller: 'startUpPageCtrl'
        })
        .state('app.homeDashboard', {
            url: '/homeDashboard',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/homeDashboard.html',
                    controller: 'homeDashboardCtrl'
                }
            }
        })
        .state('app.Profile', {
            url: '/Profile',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/Profile.html',
                    controller: 'profileCtrl'
                }
            }
        })
        .state('app.RequestList', {
            url: '/RequestList',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/RequestList.html',
                    controller: 'RequestListCtrl'
                }
            }
        })
        .state('addEmployeeRent', {
            url: '/addEmployeeRent',
            cache: false,
            templateUrl: 'templates/addEmployeeRent.html',
            controller: 'addEmployeeRentCtrl'
        })
        .state('app.RequestListCombined', {
            url: '/RequestListCombined',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/RequestListCombined.html',
                    controller: 'RequestListCombinedCtrl'
                }
            }
        })
        .state('app.RequisitionTravelAndClaim', {
            url: '/RequisitionTravelAndClaim',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/RequisitionTravelAndClaim.html',
                    controller: 'RequisitionTravelAndClaimCtrl'
                }
            }
        })
        .state('travelApplication', {
            url: '/travelApplication',
            cache: false,
            templateUrl: 'templates/travelApplication.html',
            controller: 'travelApplicationCtrl'
        })
        .state('claimTravelDetails', {
            url: '/claimTravelDetails',
            cache: false,
            templateUrl: 'templates/claimTravelDetails.html',
            controller: 'claimTravelDetailsCtrl'
        })
        .state('claimApplication', {
            url: '/claimApplication',
            cache: false,
            templateUrl: 'templates/claimApplication.html',
            controller: 'claimApplicationCtrl'
        })
        .state('claimApplicationDetails', {
            url: '/claimApplicationDetails',
            cache: false,
            templateUrl: 'templates/claimApplicationDetails.html',
            controller: 'claimApplicationDetailsCtrl'
        })
        .state('claimApplicationDetailsApprove', {
            url: '/claimApplicationDetails',
            cache: false,
            templateUrl: 'templates/claimApplicationDetailsApprove.html',
            controller: 'claimApplicationDetailsApproveCtrl'
        })


        .state('nonCTCClaimApproval', {
            url: '/nonCTCClaimApproval',
            cache: false,
            templateUrl: 'templates/nonCTCClaimApproval.html',
            controller: 'nonCTCClaimApprovalCtrl'
        })
        .state('ltaClaimApproval', {
            url: '/ltaClaimApproval',
            cache: false,
            templateUrl: 'templates/ltaClaimApproval.html',
            controller: 'ltaClaimApprovalCtrl'
        })
        .state('individualCal', {
            url: '/individualCal',
            cache: false,
            templateUrl: 'templates/individualCalenderView.html',
            controller: 'individualCalenderViewCtrl'
        })
        //            .state('myTeamDetail', {
        //                url: '/myTeamDetail',
        //                cache: false,
        //                templateUrl: 'templates/myTeamDetail.html',
        //                controller: 'myTeamDetailCtrl'
        //            })
        .state('app.myTeamDetail', {
            url: '/myTeamDetail',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/myTeamDetail.html',
                    controller: 'myTeamDetailCtrl'
                }
            }
        })
        .state('RetryPage', {
            url: '/RetryPage',
            cache: false,
            templateUrl: 'templates/RetryPage.html',
            controller: 'RetryPageCtrl'
        })
        .state('LeaveDetailPage', {
            url: '/LeaveDetailPage',
            cache: false,
            templateUrl: 'templates/LeaveApplicationDetail.html',
            controller: 'LeaveApplicationDetailCtrl'

        })
        .state('app.teamCalendar', {
            url: '/teamCalendar',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/teamCalendar.html',
                    controller: 'teamCalendarCtrl'
                }
            }
        })
        //Request Tab
        .state('app.RequestListNew', {
            url: '/RequestListNew',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/RequestListNew.html',
                    controller: 'RequestListNewCtrl'
                }
            }
        })
        .state('app.home', {
            url: '/home',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/home.html',
                    controller: 'homeCtrl'
                }
            }
        })
        .state('app.home.dashboard', {
            url: '/dashboard',
            cache: false,
            views: {
                'dashboard': {
                    templateUrl: 'templates/dashboard.html',
                    controller: 'dashboardCtrl'
                }
            }
        })
        .state('app.home.selfService', {
            url: '/selfService',
            cache: false,
            views: {
                'selfService': {
                    templateUrl: 'templates/selfService.html',
                    controller: 'selfServiceCtrl'
                }
            }
        })
        .state('app.RequestListNew.leaveReqList', {
            url: '/leaveReqList',
            cache: false,
            views: {
                'leaveReqList': {
                    templateUrl: 'templates/leaveReqList.html',
                    controller: 'leaveReqListCtrl'
                }
            }
        })
        .state('app.RequestListNew.ODReqList', {
            url: '/ODReqList',
            cache: false,
            views: {
                'ODReqList': {
                    templateUrl: 'templates/ODReqList.html',
                    controller: 'ODReqListCtrl'
                }
            }
        })
        .state('app.RequestListNew.attendanceReqList', {
            url: '/attendanceReqList',
            cache: false,
            views: {
                'attendanceReqList': {
                    templateUrl: 'templates/attendanceReqList.html',
                    controller: 'attendanceReqListCtrl'
                }
            }
        })
        .state('app.RequestListNew.shiftChangeReqList', {
            url: '/shiftChangeReqList',
            cache: false,
            views: {
                'shiftChangeReqList': {
                    templateUrl: 'templates/shiftChangeReqList.html',
                    controller: 'shiftChangeReqListCtrl'
                }
            }
        })
        //Approvals tabs
        .state('app.MyApprovalsNew', {
            url: '/MyApprovalsNew',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/MyApprovalsNew.html',
                    controller: 'MyApprovalsNewCtrl'
                }
            }
        })

        .state('app.MyApprovalsCombined', {
            url: '/MyApprovalsCombined',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/MyApprovalsCombined.html',
                    controller: 'MyApprovalsCombinedCtrl'
                }
            }
        })
        .state('app.MyApprovalsNew.leaveApprovalsList', {
            url: '/leaveApprovalsList',
            cache: false,
            views: {
                'leaveApprovalsList': {
                    templateUrl: 'templates/leaveApprovalsList.html',
                    controller: 'leaveApprovalsListCtrl'
                }
            }
        })
        .state('app.MyApprovalsNew.ODApprovalsList', {
            url: '/ODApprovalsList',
            cache: false,
            views: {
                'ODApprovalsList': {
                    templateUrl: 'templates/ODApprovalsList.html',
                    controller: 'ODApprovalsListCtrl'
                }
            }
        })
        // .state('app.MyApprovalsNew.attendanceApprovalsList', {
        //     url: '/attendanceApprovalsList',
        //     cache: false,
        //     views: {
        //         'attendanceApprovalsList': {
        //             templateUrl: 'templates/attendanceApprovalsList.html',
        //             controller: 'attendanceApprovalsListCtrl'
        //         }
        //     }
        // })
        .state('approvalTransactionList', {
            url: '/approvalTransactionList',
            cache: false,
            templateUrl: 'templates/approvalTransactionList.html',
            controller: 'approvalTransactionListNewCtrl'
        })
        .state('approvalTransactionDetails', {
            url: '/approvalTransactionDetails',
            cache: false,
            templateUrl: 'templates/approvalTransactionDetails.html',
            controller: 'approvalTransactionDetailsCtrl'
        })
        .state('transactionDetailsViewTransEmailConfirmation', {
            url: '/transactionDetailsViewTransEmailConfirmation',
            cache: false,
            templateUrl: 'templates/transactionDetailsViewTransEmailConfirmation.html',
            controller: 'transactionDetailsViewTransEmailConfirmationCtrl'
        })
        .state('transactionDetailsViewTransEmailResignation', {
            url: '/transactionDetailsViewTransEmailResignation',
            cache: false,
            templateUrl: 'templates/transactionDetailsViewTransEmailResignation.html',
            controller: 'transactionDetailsViewTransEmailResignationCtrl'
        })
        .state('transactionDetailsViewTransEmailSalaryRevisionDetails', {
            url: '/transactionDetailsViewTransEmailSalaryRevisionDetails',
            cache: false,
            templateUrl: 'templates/transactionDetailsViewTransEmailSalaryRevisionDetails.html',
            controller: 'transactionDetailsViewTransEmailSalaryRevisionDetailsCtrl'
        })
        .state('transactionDetailsViewTransEmailExtensionOfProbation', {
            url: '/transactionDetailsViewTransEmailExtensionOfProbation',
            cache: false,
            templateUrl: 'templates/transactionDetailsViewTransEmailExtensionOfProbation.html',
            controller: 'transactionDetailsViewTransEmailExtensionOfProbationCtrl'
        })
        .state('transactionDetailsViewTransEmailAbsconding', {
            url: '/transactionDetailsViewTransEmailAbsconding',
            cache: false,
            templateUrl: 'templates/transactionDetailsViewTransEmailAbsconding.html',
            controller: 'transactionDetailsViewTransEmailAbscondingCtrl'
        })
        .state('transactionDetailsViewTransEmailRedesignation', {
            url: '/transactionDetailsViewTransEmailRedesignation',
            cache: false,
            templateUrl: 'templates/transactionDetailsViewTransEmailRedesignation.html',
            controller: 'transactionDetailsViewTransEmailRedesignationCtrl'
        })
        .state('approvalsVacancyRequisitionList', {
            url: '/approvalsVacancyRequisitionList',
            cache: false,
            templateUrl: 'templates/approvalsVacancyRequisitionList.html',
            controller: 'approvalsVacancyRequisitionListCtrl'
        })
        .state('approvalsViewVacancyRequisitionDetails', {
            url: '/approvalsViewVacancyRequisitionDetails',
            cache: false,
            templateUrl: 'templates/approvalsViewVacancyRequisitionDetails.html',
            controller: 'approvalsViewVacancyRequisitionDetailsCtrl'
        })
        .state('approvalsOfferGenerationList', {
            url: '/approvalsOfferGenerationList',
            cache: false,
            templateUrl: 'templates/approvalsOfferGenerationList.html',
            controller: 'approvalsOfferGenerationListCtrl'
        })
        .state('approvalsViewOfferGenerationDetails', {
            url: '/approvalsViewOfferGenerationDetails',
            cache: false,
            templateUrl: 'templates/approvalsViewOfferGenerationDetails.html',
            controller: 'approvalsViewOfferGenerationDetailsCtrl'
        })
        .state('approvalsTrainingRequestList', {
            url: '/approvalsTrainingRequestList',
            cache: false,
            templateUrl: 'templates/approvalsTrainingRequestList.html',
            controller: 'approvalsTrainingRequestListCtrl'
        })
        .state('addTrainingRequest', {
            url: '/addTrainingRequest',
            cache: false,
            templateUrl: 'templates/addTrainingRequest.html',
            controller: 'addTrainingRequestCtrl'
        })
        .state('requestTrainingRequestList', {
            url: '/requestTrainingRequestList',
            cache: false,
            templateUrl: 'templates/requestTrainingRequestList.html',
            controller: 'requestTrainingRequestListCtrl'
        })
        .state('approvalsViewTrainingRequestDetails', {
            url: '/approvalsViewTrainingRequestDetails',
            cache: false,
            templateUrl: 'templates/approvalsViewTrainingRequestDetails.html',
            controller: 'approvalsViewTrainingRequestDetailsCtrl'
        })
        .state('approvalsStationaryRequisitionList', {
            url: '/approvalsStationaryRequisitionList',
            cache: false,
            templateUrl: 'templates/approvalsStationaryRequisitionList.html',
            controller: 'approvalsStationaryRequisitionListCtrl'
        })
        .state('approvalsViewStationaryRequisitionDetails', {
            url: '/approvalsViewStationaryRequisitionDetails',
            cache: false,
            templateUrl: 'templates/approvalsViewStationaryRequisitionDetails.html',
            controller: 'approvalsViewStationaryRequisitionDetailsCtrl'
        })
        .state('requestTransactionList', {
            url: '/requestTransactionList',
            cache: false,
            templateUrl: 'templates/requestTransactionList.html',
            controller: 'requestTransactionListCtrl'
        })
        .state('requestTransactionDetailsResignation', {
            url: '/requestTransactionDetailsResignation',
            cache: false,
            templateUrl: 'templates/requestTransactionDetailsResignation.html',
            controller: 'requestTransactionDetailsResignationCtrl'
        })
        .state('requestTransactionResignationForm', {
            url: '/requestTransactionResignationForm',
            cache: false,
            templateUrl: 'templates/requestTransactionResignationForm.html',
            controller: 'requestTransactionResignationFormCtrl'
        })
        .state('requestTransactionWithdrawlResignationForm', {
            url: '/requestTransactionWithdrawlResignationForm',
            cache: false,
            templateUrl: 'templates/requestTransactionWithdrawlResignationForm.html',
            controller: 'requestTransactionWithdrawlResignationFormCtrl'
        })
        .state('requestTransactionWithdrawlResignationDetails', {
            url: '/requestTransactionWithdrawlResignationDetails',
            cache: false,
            templateUrl: 'templates/requestTransactionWithdrawlResignationDetails.html',
            controller: 'requestTransactionWithdrawlResignationDetailsCtrl'
        })
        .state('app.MyApprovalsNew.shiftChangeApprovalsList', {
            url: '/shiftChangeApprovalsList',
            cache: false,
            views: {
                'shiftChangeApprovalsList': {
                    templateUrl: 'templates/shiftChangeApprovalsList.html',
                    controller: 'shiftChangeApprovalsListCtrl'
                }
            }
        })
    //$urlRouterProvider.otherwise('intro');
    $urlRouterProvider.otherwise('startUpPage');
});


mainModule.service("getSetService", function () {
    var object = {};

    return {
        get: function () {
            return object;
        },
        set: function (value) {
            object = value;
        }
    };
})

mainModule.service("generateColorService", function () {
    var object = {}

    object.addColors = function (list) {
        for (var i = 0; i < list.length; i++) {
            list[i].iconColor = 'rgb(' + (Math.floor((150 - 250) * Math.random()) + 150) + ',' +
                (Math.floor((150 - 250) * Math.random()) + 150) + ',' +
                (Math.floor((150 - 250) * Math.random()) + 150) + ')';
        }
        return list
    }

    return object

})
