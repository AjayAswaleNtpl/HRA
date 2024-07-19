/*
 1.This controller is used to show the list of emails.
 */

mainModule.factory("viewInboxService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/email/viewInbox.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);

mainModule.factory("getMenuInfoService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/eisCompany/viewEisCompany.spr'), {}, {
            'save': {
                method: 'POST',
                timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);
mainModule.factory("viewEmailContentService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/email/viewEmailContent.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);

mainModule.controller('InboxCtrl', function ($scope, $filter, $rootScope, $http, $timeout, commonService, $ionicLoading, getMenuInfoService, generateColorService, $ionicModal, viewInboxService, viewEmailContentService) {
    $scope.requesObject = {}
    $scope.hidebutton = 0;
    $scope.hidebutton1 = 0;
    $scope.hideShowMoreButton = 0;
    $scope.myDate = []
    $scope.createdDate = []
    var leaveMenuInfo = getMenuInformation("Leave Management", "Leave Application");
    $scope.requesObject.menuId = leaveMenuInfo.menuId;
    $scope.requesObject.buttonRights = "Y-Y-Y-Y"
    $scope.requesObject.formName = "Leave"
    $scope.msg = false
    $scope.searchObj = {}
    $scope.searchObj.searchQuery = '';
    $scope.image1 = sessionStorage.getItem('profilePhoto');
    $scope.photoFileName = sessionStorage.getItem('photoFileName')
    $rootScope.viewInboxService = new viewInboxService();
    $rootScope.viewInboxService.$save($rootScope.requesObject, function (data) {
        var DEFAULT_PAGE_SIZE_STEP = 50;
        $scope.currentPage = 1;
        $scope.pageSize = $scope.currentPage * DEFAULT_PAGE_SIZE_STEP;

        if (data.emailList.length == 0) {
            $scope.hidebutton = 1;
            $scope.hidebutton1 = 0;
            $scope.hideShowMoreButton = 0;
        }
        if ($scope.pageSize == 50 && data.emailList.length > 50) {
            $scope.hidebutton1 = 1;
            $scope.hidebutton = 0;
            $scope.hideShowMoreButton = 0;
        }

        $scope.loadNextPage = function () {
            $scope.currentPage++;
            $scope.pageSize = $scope.currentPage * DEFAULT_PAGE_SIZE_STEP;
        }
        $rootScope.inboxList = []
        if (data.emailList) {
            $rootScope.inboxList = data.emailList
            $rootScope.UnreadMessages = 0;
            for (var i = 0; i < $rootScope.inboxList.length; i++) {
                if ($rootScope.inboxList[i].status == 'N') {
                    $rootScope.UnreadMessages++;
                }
            }
        }
    }, function (data) {
        autoRetryCounter = 0
        $ionicLoading.hide();
        commonService.getErrorMessage(data);
    });

    $scope.ManagerRequestList = function ()
    {
        $ionicLoading.show();
        $scope.viewInboxService = new viewInboxService();
        $scope.viewInboxService.$save($scope.requesObject, function (data) {
            $scope.inboxList = []
            $rootScope.UnreadMessages = 0;
            if (data.emailList)
            {
                $scope.inboxList = data.emailList
                for (var i = 0; i < $scope.inboxList.length; i++) {
                    if ($scope.inboxList[i].status == 'N') {
                        $rootScope.UnreadMessages++;
                    }
                }
                for (var i = 0; i < $scope.inboxList.length; i++)
                {
                    if ($scope.inboxList[i].senderEmpFullName)
                    {
                        $scope.inboxList[i].initial = $scope.inboxList[i].senderEmpFullName[0].toUpperCase()
                    }
                    else if (!$scope.inboxList[i].senderEmpId)
                    {
                        $scope.inboxList[i].initial = 'AD'
                        $scope.inboxList[i].Role = 'ADMIN'
                        $scope.inboxList[i].senderEmpFullName = 'ADMIN'
                    }
                }
            }
            else if (!data.emailList)
            {
                $scope.msg = true
            }
            for (var i = 0; i < $scope.inboxList.length; i++) {
                var tempDate = new Date($scope.inboxList[i].createdDate);
                $scope.inboxList[i].createdDate = $filter('date')(tempDate, 'dd/MM/yyyy');
            }
            $scope.inboxList = generateColorService.addColors($scope.inboxList)
            $timeout(function () {
                $ionicLoading.hide();
            }, 5000);
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
    $scope.ManagerRequestList()
// -------------ionic modal start--------------
    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.ManagerRequestList();
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });
    $scope.rejectLeave = function (leaveTransId) {
        $scope.rejectResObject = {}
        $scope.rejectLeaveService = new rejectLeaveService();
        $scope.rejectLeaveService.$save($scope.rejectResObject, function (data) {
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        })
    }

    $scope.viewEmailContent = function (inboxObj) {
        $ionicLoading.show({
        });
        $scope.detailResObject = {}
        $scope.detailResObject.emailId = inboxObj.emailId
        if (inboxObj.Role)
        {
            $scope.detailResObject.Role = inboxObj.Role
        }

        var parts = inboxObj.createdDate.split('/');
        $scope.createDate = new Date(parts[2], parts[1] - 1, parts[0]);

        $scope.openModal();
        $scope.viewEmailContentService = new viewEmailContentService();
        $scope.viewEmailContentService.$save($scope.detailResObject, function (data) {
            $scope.senderFullName = ''
            $scope.modal1 = {}
            $scope.modal1.subject = data.subject
            $scope.modal1.senderEmpFullName = data.senderEmpFullName
            $scope.modal1.message = data.message
            $scope.modal1.empID = data.empID

            if (data.subject == 'Shift Change-APPROVER') {
                document.getElementById("purpose").innerHTML = data.message.replace(/,<a\b[^>]*>(.*?)<br>/i, "")
            }else{
                document.getElementById("purpose").innerHTML = data.message.replace(/<a\b[^>]*>(.*?)<\/a>/i, "").replace(", to view",".");
            }

            if ($scope.modal1.senderEmpFullName == undefined) {
                $scope.senderFullName = "Admin"
            }
            if (data.empID)
            {
                $scope.resultObject = {}
                $scope.resultObject.empId = data.empID
                $scope.resultObject.companyId = sessionStorage.getItem('companyId');
                $scope.getMenuInfoService = new getMenuInfoService();
                $scope.getMenuInfoService.$save($scope.resultObject, function (success) {
                    $scope.gender = success.gender;
                    if (success.photoFileName)
                    {
                        $scope.profilePhoto = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + data.empID + '';
                        $ionicLoading.hide();
                    }
                    else
                    {
                        if (success.gender == 'M')
                        {
                            $scope.gender = ('profilePhoto', "./img/Male.png");
                        }
                        else
                        {
                            $scope.gender = ('profilePhoto', "./img/Female.png");
                        }

                        $scope.profilePhoto = ''
                        $ionicLoading.hide();
                    }
                    $scope.ManagerRequestList();
                    $ionicLoading.hide();
                }, function (data) {
                    $scope.closeModal();
                    $ionicLoading.hide()
                    commonService.getErrorMessage(data);
                });
            }
            else
            {
                $scope.gender = ('profilePhoto', "./img/Male.png");
                $scope.profilePhoto = ''
                $ionicLoading.hide();
                $scope.ManagerRequestList();
            }
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
    }
});
