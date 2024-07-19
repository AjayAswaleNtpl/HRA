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

mainModule.factory("viewNotiCountService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/email/viewNotiListCount.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);

mainModule.factory("viewNotiListService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/email/viewNotiList.spr'), {}, {
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

mainModule.factory("viewNotiContentService", ['$resource', function ($resource) {
        return $resource((baseURL + '/api/email/viewNotiContent.spr'), {}, {
            'save': {
                method: 'POST', timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
            }
        }, {});
    }]);

	mainModule.controller('NotiInboxCtrl', function ($scope, $filter, $rootScope, $http, $timeout, commonService, $ionicLoading, getMenuInfoService, generateColorService,  viewInboxService, viewEmailContentService,viewNotiListService,viewNotiContentService,$ionicModal,$q,viewNotiCountService) {


	
	$scope.onApprovalClick =  function (){
		alert("aaaa")
		$('#inboxID').modal('hide');
		//$state.go('app.MyApprovalsCombined')
	}

	
	$scope.checkForGoToApproveButton = function (tmsg) {

			//for leave
			if (tmsg.indexOf('../leave/leaveApplication/viewLeaveApprove.spr')>0 && tmsg.indexOf('mailType=APPROVER')>0)
			{
				$scope.viewApprovalsLink = true
				$rootScope.redirectApprovalTabName = "LEAVE"
			}
			//for OD
			if (tmsg.indexOf('../attendance/odApplication/viewODApplicationMail.spr')>0 && tmsg.indexOf('mailType=APPROVER')>0)
			{
				$scope.viewApprovalsLink = true
				$rootScope.redirectApprovalTabName = "OD"
			}
			//for Att. Regularisation
			if (tmsg.indexOf('../attendance/missPunch/viewMissedPunchApprove.spr')>0 &&
			   (tmsg.indexOf('status=SENT FOR APPROVAL')>0 || tmsg.indexOf('status=SENT FOR CANCELLATION'))>0)
			{
				$scope.viewApprovalsLink = true
				$rootScope.redirectApprovalTabName = "ATT_REG"
			}
			//for shift change
			if (tmsg.indexOf('../attendance/shiftChange/viewShiftChangeApprove.spr')>0 &&
			   (tmsg.indexOf('status=SENT FOR APPROVAL')>0 || tmsg.indexOf('status=SENT FOR CANCELLATION'))>0)
			{
				$scope.viewApprovalsLink = true
				$rootScope.redirectApprovalTabName = "SHIFT_CH"
			}



	}

	//// for inbox //////////////
    $scope.ManagerRequestList = function ()
    {
		$scope.RequestListManaged=true;
        $ionicLoading.show();
        $scope.viewInboxService = new viewInboxService();
        $scope.viewInboxService.$save($scope.requesObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				handleClientResponse(data.clientResponseMsg,"viewInboxService")
			}
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
	//// for inbox over

	//// for noti


	$scope.getNotiCount = function (){
		$scope.viewNotiCountService = new viewNotiCountService();
        $scope.viewNotiCountService.$save($scope.requesObjectNoti, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewNotiCountService")
			}

			$scope.notiCount = data.notiCount
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });
	}
    $scope.ManagerNotiList = function ()
    {
		$scope.NotitListManaged=true;
        $ionicLoading.show();
        $scope.viewNotiListService = new viewNotiListService();
        $scope.viewNotiListService.$save($scope.requesObjectNoti, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewNotiListService")
			}

            $scope.notiList = []
			$rootScope.UnreadMessagesNoti = 0;
            if (data.listOfNotications)
            {
                $scope.notiList = data.listOfNotications
                for (var i = 0; i < $scope.notiList.length; i++) {
                    if ($scope.notiList[i].status == 'N') {
                        $rootScope.UnreadMessagesNoti++;
                    }
                }
                for (var i = 0; i < $scope.notiList.length; i++)
                {
                    if ($scope.notiList[i].senderEmpFullName)
                    {
                        $scope.notiList[i].initial = $scope.notiList[i].senderEmpFullName[0].toUpperCase()
                    }
                    else if (!$scope.notiList[i].senderEmpId)
                    {
                        $scope.notiList[i].initial = 'AD'
                        $scope.notiList[i].Role = 'ADMIN'
                        $scope.notiList[i].senderEmpFullName = 'ADMIN'
                    }
                }
            }
            else if (!data.listOfNotications)
            {
                $scope.msgNoti = true
            }
            for (var i = 0; i < $scope.notiList.length; i++) {
                var tempDateNoti = new Date($scope.notiList[i].createdDate);
                $scope.notiList[i].createdDate = $filter('date')(tempDateNoti, 'dd/MM/yyyy');
            }
            $scope.notiList = generateColorService.addColors($scope.notiList)
            $timeout(function () {
                $ionicLoading.hide();
            }, 5000);
        }, function (data) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });

	}

//////  for noti over

//////////// for inbox
	$scope.getInbox = function (){
		$("#inboxTab").addClass("active");
		$("#inboxDiv").show();
		$("#notificationsTab").removeClass("active");
		$("#notificationsDiv").hide();

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
		if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"  ")
		}

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

		if ($scope.RequestListManaged!=true){
			$scope.ManagerRequestList()
		}
	}
///// for inbox over


//////////// for noti

	$scope.getNotifications = function (){
		$("#notificationsTab").addClass("active");
		$("#notificationsDiv").show();
		$("#inboxTab").removeClass("active");
		$("#inboxDiv").hide();


    $scope.requesObjectNoti = {}

	if ($scope.NotitListManaged!=true){
		$scope.ManagerNotiList()
	}

    $scope.hidebuttonNoti = 0;
    $scope.hidebutton1Noti = 0;
    $scope.hideShowMoreButtonNoti = 0;
    $scope.myDateNoti = []
    $scope.createdDateNoti = []
    var leaveMenuInfoNoti = getMenuInformation("Leave Management", "Leave Application");
    $scope.requesObjectNoti.menuId = leaveMenuInfoNoti.menuId;
    $scope.requesObjectNoti.buttonRights = "Y-Y-Y-Y"
    $scope.requesObjectNoti.formName = "Leave"
    $scope.msgNoti = false
    $scope.searchObjNoti = {}
    $scope.searchObjNoti.searchQuery = '';
    $scope.image1Noti = sessionStorage.getItem('profilePhotoNoti');
    $scope.photoFileName = sessionStorage.getItem('photoFileNameNoti')
    $rootScope.viewNotiListService = new viewNotiListService();
    $rootScope.viewNotiListService.$save($rootScope.requesObjectNoti, function (data) {
		if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewNotiListService")
		}

        var DEFAULT_PAGE_SIZE_STEP = 50;
        $scope.currentPageNoti = 1;
        $scope.pageSizeNoti = $scope.currentPageNoti * DEFAULT_PAGE_SIZE_STEP;

        if (data.listOfNotications.length == 0) {
            $scope.hidebuttonNoti = 1;
            $scope.hidebutton1Noti = 0;
            $scope.hideShowMoreButtonNoti = 0;
        }
        if ($scope.pageSizeNoti == 50 && data.listOfNotications.length > 50) {
            $scope.hidebutton1Noti = 1;
            $scope.hidebuttonNoti = 0;
            $scope.hideShowMoreButtonNoti = 0;
        }

        $scope.loadNextPageNoti = function () {
            $scope.currentPageNoti++;
            $scope.pageSizeNoti = $scope.currentPageNoti * DEFAULT_PAGE_SIZE_STEP;
        }
        $rootScope.notiList = []

        if (data.listOfNotications) {
            $rootScope.notiList = data.listOfNotications
            $rootScope.UnreadMessagesNoti = 0;
            for (var i = 0; i < $rootScope.notiList.length; i++) {
                if ($rootScope.notiList[i].status == 'N') {
                    $rootScope.UnreadMessagesNoti++;
                }
            }
        }
    }, function (data) {
        autoRetryCounter = 0
        $ionicLoading.hide();
        commonService.getErrorMessage(data);
    });
		//if ($scope.NotitListManaged!=true){
			//$scope.ManagerNotiList()
		//}

	}

///// for noti over




	if ($rootScope.viewNotifications==true){
		$("#notificationsTab").addClass("active");
		$("#notificatinsDiv").show();
		$("#inboxTab").removeClass("active");
		$("#inboxDiv").hide();
		$rootScope.viewNotifications=false;
		$scope.getNotifications()
	}else{
		$("#inboxTab").addClass("active");
		$("#inboxDiv").show();
		$("#notificationsTab").removeClass("active");
		$("#notificatinsDiv").hide();
		$scope.getInbox()
	}
		$scope.getNotiCount()


    //$scope.ManagerRequestList()
// -------------ionic modal start for inbox    --------------

  /*  $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;

    }); */
	var initInboxModal = function() {


	 if($scope.modal) {
      return $q.when();
    }
    else {
      return $ionicModal.fromTemplateUrl('my-modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        })
      .then(function(modal) {
        $scope.modal = modal;
      })
    }
  };

    $scope.openModal = function () {
		initInboxModal().then(function() {
				$scope.modal.show();
        });
    };

    $scope.closeModal = function () {
	
	$('#exampleModal').modal('hide');
	$state.go('app.MyApprovalsCombined')
		/*$scope.modal.remove()
			.then(function() {
			$scope.modal = null;
			});*/
    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        //$scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
		$scope.closeModal();

    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });
	// ionic modal for inbox over  ////////////


// -------------ionic modal start for noti    --------------
    $ionicModal.fromTemplateUrl('my-modal-noti.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalNoti = modal;
    });
    $scope.openModalNoti = function () {
        $scope.modalNoti.show();
    };
    $scope.closeModalNoti = function () {
        //$scope.ManagerNotiList();
        $scope.modalNoti.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modalNoti.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });
	// ionic modal for noti over  ////////////


//////// for inbox
    $scope.viewEmailContent = function (inboxObj) {
		
		$scope.viewApprovalsLink = false
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

        //$scope.openModal();
        $scope.viewEmailContentService = new viewEmailContentService();
        $scope.viewEmailContentService.$save($scope.detailResObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewEmailContentService")
			}

            $scope.senderFullName = ''
            $scope.modal1 = {}
            $scope.modal1.subject = data.subject
            $scope.modal1.senderEmpFullName = data.senderEmpFullName
            $scope.modal1.message = data.message
            $scope.modal1.empID = data.empID

			var tmpMsg = data.message

            if (data.subject == 'Shift Change-APPROVER') {
                document.getElementById("purpose").innerHTML = data.message.replace(/,<a\b[^>]*>(.*?)<br>/i, "")
            }else{
                document.getElementById("purpose").innerHTML = data.message.replace(/<a\b[^>]*>(.*?)<\/a>/i, "").replace(", to view",".");
            }

			$scope.checkForGoToApproveButton(tmpMsg);

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
					if (!(success.clientResponseMsg=="OK")){
						console.log(success.clientResponseMsg)
						handleClientResponse(success.clientResponseMsg,"getMenuInfoService")
					}

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
	////////////////// for inbox over
	
	$scope.viewEmailContentLocally = function (inboxObj) {
		
		$scope.viewApprovalsLink = false
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

        //$scope.openModal();
        $scope.viewEmailContentService = new viewEmailContentService();
        $scope.viewEmailContentService.$save($scope.detailResObject, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewEmailContentService")
			}

            $scope.senderFullName = ''
            $scope.modal1 = {}
            $scope.modal1.subject = data.subject
            $scope.modal1.senderEmpFullName = data.senderEmpFullName
            $scope.modal1.message = data.message
            $scope.modal1.empID = data.empID

			var tmpMsg = data.message

            if (data.subject == 'Shift Change-APPROVER') {
                document.getElementById("purpose").innerHTML = data.message.replace(/,<a\b[^>]*>(.*?)<br>/i, "")
            }else{
                document.getElementById("purpose").innerHTML = data.message.replace(/<a\b[^>]*>(.*?)<\/a>/i, "").replace(", to view",".");
            }

			$scope.checkForGoToApproveButton(tmpMsg);

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
					if (!(success.clientResponseMsg=="OK")){
						console.log(success.clientResponseMsg)
						handleClientResponse(success.clientResponseMsg,"getMenuInfoService")
					}

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
        
        });
    }

//////// for noti
    $scope.viewNotiContent = function (notiObj) {

        $ionicLoading.show();
        $scope.detailResObjectNoti = {}


        var parts = notiObj.createdDate.split('/');
        $scope.createDateNoti = new Date(parts[2], parts[1] - 1, parts[0]);

        $scope.openModalNoti();
        $scope.viewNotiContentService = new viewNotiContentService();
        $scope.viewNotiContentService.$save($scope.detailResObjectNoti, function (data) {
			if (!(data.clientResponseMsg=="OK")){
				console.log(data.clientResponseMsg)
				handleClientResponse(data.clientResponseMsg,"viewNotiContentService")
			}

            $scope.senderFullName = ''
            $scope.modal1Noti = {}
            $scope.modal1Noti.title = data.title
            $scope.modal1Noti.senderEmpFullName = data.senderEmpFullName
            $scope.modal1Noti.message = data.message
            $scope.modal1Noti.empID = data.empID

            if (data.subject == 'Shift Change-APPROVER') {
                document.getElementById("purposeNoti").innerHTML = data.message.replace(/,<a\b[^>]*>(.*?)<br>/i, "")
            }else{
                document.getElementById("purposeNoti").innerHTML = data.message.replace(/<a\b[^>]*>(.*?)<\/a>/i, "").replace(", to view",".");
            }

            if ($scope.modal1Noti.senderEmpFullName == undefined) {
                $scope.senderFullNameNoti = "Admin"
            }
            if (data.empID)
            {
                $scope.resultObjectNoti = {}
                $scope.resultObjectNoti.empId = data.empID
                $scope.resultObjectNoti.companyId = sessionStorage.getItem('companyId');
                $scope.getMenuInfoService = new getMenuInfoService();
                $scope.getMenuInfoService.$save($scope.resultObjectNoti, function (success) {
					if (!(success.clientResponseMsg=="OK")){
						console.log(success.clientResponseMsg)
						handleClientResponse(success.clientResponseMsg,"getMenuInfoService")
					}

                    $scope.genderNoti = success.gender;
                    if (success.photoFileName)
                    {
                        $scope.profilePhotoNoti = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + data.empID + '';
                        $ionicLoading.hide();
                    }
                    else
                    {
                        if (success.gender == 'M')
                        {
                            $scope.genderNoti = ('profilePhotoNoti', "./img/Male.png");
                        }
                        else
                        {
                            $scope.genderNoti = ('profilePhotoNoti', "./img/Female.png");
                        }

                        $scope.profilePhotoNoti = ''
                        $ionicLoading.hide();
                    }
                    $scope.ManagerNotiList();
                    $ionicLoading.hide();
                }, function (data) {
                    $scope.closeModal();
                    $ionicLoading.hide()
                    commonService.getErrorMessage(data);
                });
            }
            else
            {
                $scope.genderNoti = ('profilePhoto', "./img/Male.png");
                $scope.profilePhotoNoti = ''
                $ionicLoading.hide();
                $scope.ManagerNotiList();
            }
        }, function (data, status) {
            autoRetryCounter = 0
            $ionicLoading.hide()
            commonService.getErrorMessage(data);
        });

    }
		////////////////// for noti over

//////// for noti
    $scope.viewNotiContentLocally = function (notiObj) {

        //$ionicLoading.show({
        //});
        $scope.detailResObjectNoti = {}


        var parts = notiObj.createdDate.split('/');
        $scope.createDateNoti = new Date(parts[2], parts[1] - 1, parts[0]);



			$scope.senderFullName = ''
            $scope.modal1Noti = {}
            $scope.modal1Noti.title = notiObj.title
            $scope.modal1Noti.senderEmpFullName = notiObj.senderEmpFullName
            $scope.modal1Noti.message = notiObj.message
            $scope.modal1Noti.empID = notiObj.empID

            $scope.openModalNoti();

            if (notiObj.subject == 'Shift Change-APPROVER') {
                document.getElementById("purposeNoti").innerHTML = notiObj.message.replace(/,<a\b[^>]*>(.*?)<br>/i, "")
            }else{
                document.getElementById("purposeNoti").innerHTML = notiObj.message.replace(/<a\b[^>]*>(.*?)<\/a>/i, "").replace(", to view",".");
            }

            if ($scope.modal1Noti.senderEmpFullName == undefined) {
                $scope.senderFullNameNoti = "Admin"
            }
            if (notiObj.empID)
            {
                $scope.resultObjectNoti = {}
                $scope.resultObjectNoti.empId = notiObj.senderEmpId
                $scope.resultObjectNoti.companyId = sessionStorage.getItem('companyId');
                $scope.getMenuInfoService = new getMenuInfoService();
                $scope.getMenuInfoService.$save($scope.resultObjectNoti, function (success) {
					if (!(success.clientResponseMsg=="OK")){
						console.log(success.clientResponseMsg)
						handleClientResponse(success.clientResponseMsg,"getMenuInfoService")
					}

                    $scope.genderNoti = success.gender;
                    if (success.photoFileName)
                    {
                        $scope.profilePhotoNoti = baseURL + '/api/eisCompany/viewPhoto.spr?empId=' + notiObj.senderEmpId + '';
                        $ionicLoading.hide();
                    }
                    else
                    {
                        if (success.gender == 'M')
                        {
                            $scope.genderNoti = ('profilePhotoNoti', "./img/Male.png");
                        }
                        else
                        {
                            $scope.genderNoti = ('profilePhotoNoti', "./img/Female.png");
                        }

                        $scope.profilePhotoNoti = ''
                        $ionicLoading.hide();
                    }
                    $scope.ManagerNotiList();
                    $ionicLoading.hide();
                }, function (data) {
                    $scope.closeModal();
                    $ionicLoading.hide()
                    commonService.getErrorMessage(data);
                });
            }
            else
            {
                $scope.genderNoti = ('profilePhoto', "./img/Male.png");
                $scope.profilePhotoNoti = ''
                $ionicLoading.hide();
                $scope.ManagerNotiList();
            }

			$ionicLoading.hide();

    }
	
	
		
	

		////////////////// for noti over
});
