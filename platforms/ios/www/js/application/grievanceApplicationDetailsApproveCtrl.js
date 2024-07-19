/*
 1.This controller is used for applying leaves.
 */


 mainModule.factory("viewGrievanceSuggestionAppApprove", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/adminHelpDesk/grievanceSuggestion/viewGrievanceSuggestionAppApprove.spr'), {}, {
      'save': {
        method: 'POST',
        timeout: commonRequestTimeout,
	headers: {
		'Authorization': 'Bearer ' + jwtByHRAPI
	 }
      }
    }, {});
  }]);

mainModule.controller('grievanceApplicationDetailsApproveCtrl', function ($scope,$rootScope, viewGrievanceSuggestionAppApprove,
    commonService, $rootScope,  $timeout,   $state, $http, $q, $filter, $ionicLoading  ) {
	$rootScope.navHistoryPrevPage="approvalGrievanceList"

	$rootScope.reqestPageLastTab = "GRIEVANCE"

    $ionicLoading.show();
    $scope.selectedFileName = ''
    $scope.selectedValues = {}
    $scope.fd = new FormData
    
    
    $scope.resultObj = {}
    $scope.resultObj.empId = sessionStorage.getItem('empId');
    $rootScope.reqestPageLastTab = "GRIEVANCE"

	
    /// calling addservice
    $scope.init = function(){
        
            $scope.searchObj = '';
            $scope.selectedValues = {}
            $ionicLoading.show();
            $scope.selectedValues.applType = "SUGGESTION"
            
            
            $scope.requesObject = {}
            $scope.requesObject.applicationType=$rootScope.grievanceObject.applicationType
            $scope.requesObject.menuId = 3412
            $scope.requesObject.buttonRights = "Y-Y-Y-Y"
            $scope.requesObject.grievanceSuggestionApplicationId=$rootScope.grievanceObject.grievanceSuggestionApplicationId
            $scope.requesObject.empId=sessionStorage.getItem('empId')
            $scope.requesObject.status=$rootScope.grievanceObject.status
            $scope.requesObject.applicationType=$rootScope.grievanceObject.applicationType
            
            $ionicLoading.show();
            $scope.viewGrievanceSuggestionAppApprove = new viewGrievanceSuggestionAppApprove();
            $scope.viewGrievanceSuggestionAppApprove.$save($scope.requesObject, function (data) {
              if (!(data.clientResponseMsg == "OK")) {
                handleClientResponse(data.clientResponseMsg, "viewGrievanceSuggestionAppApprove")
                $ionicLoading.hide()
                showAlert("Something went wrong. Please try later.")
                $scope.redirectOnBack();
                return;
              }
              $ionicLoading.hide()
              $scope.grievanceObject = data.GrievanceObject
              $timeout(function () {
                $scope.getPanelMembers($scope.grievanceObject.applicationType,$scope.grievanceObject.categoryId)  
                document.getElementById("remarks").value = $scope.grievanceObject.remarks
                
                document.getElementById("minutesOfDiscussion").value = $scope.grievanceObject.minutesOfDiscussion
                document.getElementById("at").value = $scope.grievanceObject.actionTaken

                if ($scope.requesObject.status == "CLOSED"){
                      document.getElementById("optOpen").disabled = true
                      document.getElementById("optClosed").disabled = true
                }

                $ionicLoading.hide()
            },1000)
              
              
              
            }, function (data, status) {
              autoRetryCounter = 0
              $ionicLoading.hide()
              commonService.getErrorMessage(data);
        
            });
    }
    $scope.init();
    
    $scope.redirectOnBack = function () {
        $state.go('approvalGrievanceList')
   }
   
   $scope.getPanelMembers = function(applicationType,categoryId)
   {
       $scope.fd = new FormData

          
           var menuId            = 3412
           var buttonRights      = "Y-Y-Y-Y"
           var grievanceSuggestionId=" ";
           var grievanceCaegoryId= " ";
           
              
                   if(applicationType == 'GRIEVANCE')
                   {
                       grievanceSuggestionId="1";
                       
                                   
                   }
                   if(applicationType == 'SUGGESTION'){
                       grievanceSuggestionId="2";
                       
                   }
                   
                      $.ajax({
                             url: baseURL + "/api/adminHelpDesk/grievanceSuggestion/getReporteeEmployees.spr",
                             data: {'grievanceSuggestionId':grievanceSuggestionId,'categoryId': categoryId,'buttonRights': buttonRights,'menuId': menuId},
                          type: 'POST',
                          dataType: 'json',
                          headers: {
                            'Authorization': 'Bearer ' + jwtByHRAPI
                         },
                          success:function(result){							            	
                              if(result != ''){
                                  console.log("PMS" + result);
                                  $("#panelMemberDD").empty();
                                  $.each(result, function(val, text) {
                                   $("#panelMemberDD").append($('<option></option>').val(val).html(text));
                               });
                               
                               var elem = document.getElementById("panelMemberDD")
                               $scope.panleMemberArr = new Array(elem.options.length)
                               var panleMembersToshow = ""
                               var ctr = -1
                               for (var i =0;i<elem.options.length;i++)   {
                                   
                                   if (elem.options[i].value  === undefined){
                                       continue
                                   }
                                   ctr++;
                                   if (i == elem.options.length-1){
                                       panleMembersToshow = panleMembersToshow + elem.options[i].text
                                   }else{
                                       panleMembersToshow = panleMembersToshow + elem.options[i].text + ", "
                                   }
                               }
                               
                               //alert("rajesh\n" + $scope.panleMemberArr)
                               document.getElementById("panelMemberNames").innerHTML = panleMembersToshow
                               
                           }
                            }
                   });
                                  
           }     
           
	
      $scope.goResolve = function(){
            
            
          if ($("#minutesOfDiscussion").val() == '') {
            showAlert("Please enter Minutes Of Discussion!");
            return;
          }
        
          if ($("#at").val() == '') {
            showAlert("Please enter Action taken!");
            return;
          }

          if (document.getElementById("optOpen").checked )
          $scope.requesObject.status = "OPEN"

        if (document.getElementById("optClosed").checked )
        $scope.requesObject.status = "CLOSED"

            
            $scope.requesObject.minutesOfDiscussion = document.getElementById("minutesOfDiscussion").value 
            $scope.requesObject.actionTaken = document.getElementById("at").value 
        
          $.ajax({
            url: baseURL + "/api/adminHelpDesk/grievanceSuggestion/submitAction.spr",
            data: $scope.requesObject,
         type: 'POST',
         dataType: 'json',
         headers: {
          'Authorization': 'Bearer ' + jwtByHRAPI
       },
         success:function(result){							            	
          if (!(result.clientResponseMsg == "OK")) {
            handleClientResponse(data.clientResponseMsg, "viewLeaveApp/api/adminHelpDesk/grievanceSuggestion/submitAction.spr")
            showAlert("Something went wrong. Please try later.")
            return;
          }
            showAlert(result.msg)
            $scope.redirectOnBack();
          }

            });

          }

          
          $scope.toggleOpenClosed = function(strVal){
            if (strVal=="O"){
              document.getElementById("optOpen").checked=true
              document.getElementById("optClosed").checked=false
            }else{
              document.getElementById("optOpen").checked=false
              document.getElementById("optClosed").checked=true
            } 
          }         


          $scope.openFile = function(event){
		
            
            
            var fileId = $scope.grievanceObject.fileList[0].fileId
            
            event.stopPropagation();
            
            //alert(fileId)
            var fd = new FormData();
            fd.append("grievanceSuggestionApplicationFileId",fileId)
            
            
            $.ajax({
                url: baseURL + '/api/adminHelpDesk/grievanceSuggestion/openFile.spr',
                data: fd,
                type: 'POST',
                timeout: commonRequestTimeout,
                contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                processData: false, // NEEDED, DON'T OMIT THIS
                headers: {
                  'Authorization': 'Bearer ' + jwtByHRAPI
               },
                success : function(result) {
                  if (!(result.clientResponseMsg=="OK")){
                        console.log(result.clientResponseMsg)
                        handleClientResponse(result.clientResponseMsg,"/api/adminHelpDesk/grievanceSuggestion/openFile.spr")
                        $ionicLoading.hide()
                        showAlert("Something went wrong. Please try later.")
                        return
                      }	
                      $scope.FileParmsObject = {}
                      $scope.FileParmsObject.uploadFile = result.uploadFile
                      $scope.FileParmsObject.uploadContentType = result.uploadContentType
                      $scope.FileParmsObject.uploadFileName = result.uploadFileName
                      
                      
                      $scope.downloadAttachmnent($scope.FileParmsObject)
                      $ionicLoading.hide()
                },
                error : function(res){
                      $ionicLoading.hide()
                      showAlert("Something went wrong while fetching the file.");
                }
                
                });
          }           



          $scope.downloadAttachmnent = function (travel){
		
            var strData=travel.uploadFile
            //var strUrlPrefix='data:"application/pdf;base64,'
            var strUrlPrefix='data:'+ travel.uploadContentType +";base64,"
            var url=strUrlPrefix + strData
            var blob = base64toBlob(strData,travel.uploadContentType)
            downloadFileFromData(travel.uploadFileName,blob,travel.uploadContentType)
            event.stopPropagation();
          }		

          
});


