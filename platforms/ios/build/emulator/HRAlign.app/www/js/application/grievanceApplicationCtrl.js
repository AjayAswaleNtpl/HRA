/*
 1.This controller is used for applying leaves.
 */


 mainModule.factory("addGrievanceSuggestion", ['$resource', function ($resource) {
    return $resource((baseURL + '/api/adminHelpDesk/grievanceSuggestion/addGrievanceSuggestion.spr'), {}, {
      'save': {
        method: 'POST',
        timeout: commonRequestTimeout
      }
    }, {});
  }]);

mainModule.controller('grievanceApplicationCtrl', function ($scope,$rootScope, addGrievanceSuggestion,
    commonService, $rootScope, $ionicPopup,  $timeout,   $state, $http, $q, $filter, $ionicLoading  ) {
	$rootScope.navHistoryPrevPage="requestGrievanceList"

	$rootScope.reqestPageLastTab = "GRIEVANCE"

    $ionicLoading.show();
    $scope.selectedFileName = ''
    $scope.fd = new FormData
    
    
    $scope.resultObj = {}
    $scope.resultObj.empId = sessionStorage.getItem('empId');
    $rootScope.reqestPageLastTab = "GRIEVANCE"
	
    /// calling addservice
    $scope.init = function(){
        
            $scope.searchObj = '';
            $scope.selectedValues = {}
            $ionicLoading.show();
            $scope.selectedValues.applType = "GRIEVANCE"
            
            
            $scope.requesObject = {}
            $scope.requesObject.applicationType="GRIEVANCE"
            $scope.requesObject.menuId = 2715
            $scope.requesObject.buttonRights = "Y-Y-Y-Y"
            $ionicLoading.show();
            
            var fd = new FormData()
			fd.append('menuId',2715)
			fd.append('buttonRights',"Y-Y-Y-Y")
			fd.append('applicationType',"SUGGESTION")
			
			$.ajax({
					url: (baseURL + '/api/adminHelpDesk/grievanceSuggestion/addGrievanceSuggestion.spr'),
					data: fd,
					type: 'POST',
					async:false,
					timeout:40000,
					contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
					processData: false, // NEEDED, DON'T OMIT THIS
					headers: {
						'Authorization': 'Bearer ' + jwtByHRAPI
					 },
					success : function(data) {

              if (!(data.clientResponseMsg == "OK")) {
                handleClientResponse(data.clientResponseMsg, "addGrievanceSuggestion")
                showAlert("Something went wrong. Please try later.")
                return;
              }
              
              $scope.doChangeCategory()
              
              $ionicLoading.hide()
            },
            error: function (e) { //alert("Server error - " + e);
                //showAlert(e.status)
                $ionicLoading.hide()
                   $scope.data_return = {status: e};
                commonService.getErrorMessage($scope.data_return);
                $ionicLoading.hide()
                   }				
            });			
            
    }

    

    $scope.goApprove = function(){
        
        $ionicLoading.show()
        
		var status = 'SendForApproval'				 
        var menuId     = 2715
        var buttonRights   = "Y-Y-Y-Y"
        var categoryId= document.getElementById("suggestionCategoryId").value;
        var applicationType= document.getElementById("applicationType").value;

        
     console.log("CATEGORY " +categoryId);
        if($('#remarks').val() == null || $('#remarks').val() == ''){
            if($('#applicationType').val() == 'GRIEVANCE'){
                $ionicLoading.hide()
                showAlert("Enter your grievance");
                return false;
            }
            if($('#applicationType').val() == 'SUGGESTION'){
                $ionicLoading.hide()
                showAlert("Enter your suggestion");
                return false;
            }
        }

        ///////////////////// attathment start
        if (document.getElementById('inputFileUpload').files[0] ){

			var base64result = $scope.imageData.split(',')[1];
			$scope.fileUploadName = document.getElementById('inputFileUpload').files[0].name
			$scope.fileUploadType = document.getElementById('inputFileUpload').files[0].type

			var blob = base64toBlob(base64result, $scope.fileUploadType,$scope.fileUploadName)
			$scope.fd.append('grievanceSuggestionFileVOList[0].multiUploadedFileList', blob,$scope.fileUploadName)

			if (document.getElementById('inputFileUpload').files[0].size/(1024*1024)>1)
			{
				showAlert("Maximum file size is limited to  1 Mb, Please try another file of lesser size. ")
				$ionicLoading.hide()
				//return
			}

			//}else if (document.getElementById('showImg').src.indexOf("data:image") > -1 &&  $scope.radioTypeSelected == "camera"){
      }else if (document.getElementById('showImg').src.indexOf("data:image") > -1 ){
			//scope.imageData is the src of camera image
			var base64result = $scope.imageData.split(',')[1];

			var ts = new Date();
			ts = ts.getFullYear() +""+ ts.getMonth() +""+ ts.getDate() + "" + ts.getHours() +""+ ts.getMinutes() +""+ ts.getSeconds()

			$scope.fileUploadName = "camPic"+ts+".jpeg"
			$scope.fileUploadType = "image/jpeg"

			var blob = base64toBlob(base64result, $scope.fileUploadType,$scope.fileUploadName)
			fileData.append('grievanceSuggestionFileVOList[0].multiUploadedFileList', blob,$scope.fileUploadName)
			
			}
        ////////////////////// attachment over

        
        
        $scope.fd.append("applicationType",applicationType)
        $scope.fd.append("remarks",$('#remarks').val())

        if (document.getElementById("yes").checked )
            $scope.fd.append("isConfidencial","Yes")

        if (document.getElementById("no").checked )
            $scope.fd.append("isConfidencial","No")            
        //$scope.fd.append("panelMemberId",$scope.panleMemberArr)

        
        $ionicLoading.show()
        $.ajax({
            url: baseURL + "/api/adminHelpDesk/grievanceSuggestion/sendForApprove.spr?status="+status+"&menuId="+menuId+"&buttonRights="+buttonRights+"&categoryId="+categoryId,            
            data: $scope.fd,
            type: 'POST',
            async:false,
            timeout: commonRequestTimeout,
            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            headers: {
                'Authorization': 'Bearer ' + jwtByHRAPI
             },
            success : function(success) {
                if (!(success.clientResponseMsg=="OK")){
                            console.log(success.clientResponseMsg)
                            handleClientResponse(success.clientResponseMsg,"/api/adminHelpDesk/grievanceSuggestion/sendForApprove.spr")
                            $ionicLoading.hide()
                            showAlert("Something went wrong. Please try later.")
                            //$scope.redirectOnBack();
                            return
                        }	
                        showAlert( success.msg)
                        $scope.redirectOnBack()
                        $ionicLoading.hide()
                    },
                    error: function (e) { //alert("Server error - " + e);
                        $scope.data_return = {status: e};
                        commonService.getErrorMessage($scope.data_return);
                        $ionicLoading.hide()
                           }				
                    });			
    }   
   

	
	$scope.fileChange  = function (){
		var reader = new FileReader();

      // Closure to capture the file information.
	  var fileData ;
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
		  
		  $scope.imageData = e.target.result;
		  //$scope.fileToUpload = (<HTMLInputElement>e.target.files[0])
          //alert($scope.imageData)
        };
      })(f);
	  
		$ionicLoading.hide()
		
      // Read in the image file as a data URL.
	  if (document.getElementById('inputFileUpload').files[0]){	
		var f = document.getElementById('inputFileUpload').files[0]
		$scope.selectedFileNameFromDevice = document.getElementById('inputFileUpload').files[0].name
	  
		reader.readAsDataURL(f);
	  }else{
		  $scope.selectedFileNameFromDevice = ""
	  }
	  
	  
	}
	
    
    
	$scope.SelectedFile = function(){
	
		var imgcontrolName= "showImg"
		var image = document.getElementById(imgcontrolName);
		image.src=""
		image.style.display="none"
		$scope.imageData = $scope.fileChange()

	}


	$scope.removeAttachment = function (){
		var confirmPopup = $ionicPopup.confirm({
						title: '',
					template: 'Do you want to remove image?', //Message
					});
					confirmPopup.then(function (res) {
						if (res) {
							var imgcontrolName= "showImg"
							var image = document.getElementById(imgcontrolName);
							image.src=""
							image.style.visibility="hidden"
				}
					});	
	}
	
	
	
	$scope.cameraTakePicture = 	function (mode) { 
		var imgcontrolName= "showImg"
		

		if (mode=="camera"){

			navigator.camera.getPicture(onSuccess, onFail, { quality: 25,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				correctOrientation: true
				
				});
			function onSuccess(imageData) {
			var image = document.getElementById(imgcontrolName);
			image.style.visibility="visible"
			image.style.display = "inline-block"
            if (window.device.platform != "Android"){
                image.src = "data:image/jpeg;base64," + imageData;
                $scope.imageData = "data:image/jpeg;base64," + imageData;
            }else{
                var thisResult = JSON.parse(imageData);
                // convert json_metadata JSON string to JSON Object 
                //var metadata = JSON.parse(thisResult.json_metadata);
                image.src = "data:image/jpeg;base64," + thisResult.filename;
                $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;
            }
            //var thisResult = JSON.parse(imageData);
            // convert json_metadata JSON string to JSON Object 
            //var metadata = JSON.parse(thisResult.json_metadata);
           // image.src = "data:image/jpeg;base64," + thisResult.filename;
           // $scope.imageData = "data:image/jpeg;base64," + thisResult.filename;

			//image.src = "data:image/jpeg;base64," + imageData;
			//$scope.imageData = "data:image/jpeg;base64," + imageData;
			document.getElementById("inputFileUpload").value = ""			
			$scope.selectedFileNameFromDevice = ""
			if (!$scope.$$phase)
                $scope.$apply()
			
			
			
			
		}

		function onFail(message) {
			showAlert(message);
		}
	}
	
	}
	


	
  $scope.redirectOnBack = function () {
         $state.go('requestGrievanceList')
    }


    $scope.doChangeCategory = function() {
		
        $scope.requesObject.applicationType= $('#applicationType').val()                         
        
                if($('#applicationType').val() == 'GRIEVANCE')
                {
                    /* $("#grievanceCategoryId").empty(); */
                    $("#suggestionCategoryId").empty();
                       $.ajax({
                              url: baseURL + "/api/adminHelpDesk/grievanceSuggestion/getGrievanceSuggestionCategory.spr",
                              data: $scope.requesObject,
                           type: 'POST',
                           dataType: 'json',
                           headers: {
                            'Authorization': 'Bearer ' + jwtByHRAPI
                         },
                           success:function(result){
                               if(result != ''){
                                   console.log(result);
                                   var catElement = document.getElementById("suggestionCategoryId");
                                   //Object.keys(result).map((key) => catElement.add(new Option(result[key].name, JSON.stringify(result[key]))));
                                   $.each(result, function(val, text) {
                                    $("#suggestionCategoryId").append($('<option></option>').val(val).html(text));
                                });
                                      var my_options = $("#suggestionCategoryId option");
                                       my_options.sort(function(a,b) {
                                           if (a.text > b.text) return 1;
                                           else if (a.text < b.text) return -1;
                                           else return 0
                                       })
                                       $("#suggestionCategoryId").empty().append(my_options)
                                }
                                if (!$scope.$$phase)
                                $scope.$apply()				
                                if ( document.getElementById("suggestionCategoryId").options.length > 0){
                                    document.getElementById("suggestionCategoryId").options[0].selected = true
                                }
                                $timeout(function () {
                                    $scope.getPanelMembers()
                                },500)
                               //$("select#suggestionCategoryId").val('-1');
                               //$('#suggestionCategoryId').trigger('chosen:updated');

                             }
                    });
                    
                    
                }
                if($('#applicationType').val() == 'SUGGESTION'){
                    $("#suggestionCategoryId").empty();
                       $.ajax({
                        url: baseURL + "/api/adminHelpDesk/grievanceSuggestion/getGrievanceSuggestionCategory.spr",
                        data: $scope.requesObject,
                           type: 'POST',
                           dataType: 'json',
                           headers: {
                            'Authorization': 'Bearer ' + jwtByHRAPI
                         },
                           success:function(result){
                               if(result != ''){
                                   console.log(result);
                                   $.each(result, function(val, text) {
                                       $("#suggestionCategoryId").append($('<option></option>').val(val).html(text));
                                   });
                                      var my_options = $("#suggestionCategoryId option");
                                       my_options.sort(function(a,b) {
                                           if (a.text > b.text) return 1;
                                           else if (a.text < b.text) return -1;
                                           else return 0
                                       })
                                       $("#suggestionCategoryId").empty().append(my_options)
                                }
                                if (!$scope.$$phase)
                                    $scope.$apply()				
                                    if ( document.getElementById("suggestionCategoryId").options.length > 0){
                                        document.getElementById("suggestionCategoryId").options[0].selected = true
                                    }
    
                                $timeout(function () {
                                    $scope.getPanelMembers()
                                },500)
                               //$("select#suggestionCategoryId").val('-1');
                               //$('#suggestionCategoryId').trigger('chosen:updated');	
                             }
                    });
                    
                }
    }    

    $scope.toggleYesNo = function(strVal){
		if (strVal=="Y"){
			document.getElementById("yes").checked=true
			document.getElementById("no").checked=false

			

		}else{
			document.getElementById("yes").checked=false
			document.getElementById("no").checked=true

			
		}
	}    


     $scope.getPanelMembers = function()
    {
        $scope.fd = new FormData

           $("#panelMemberId").empty();
            var menuId            = 2715
            var buttonRights      = "Y-Y-Y-Y"
            var grievanceSuggestionId=" ";
            var grievanceCaegoryId= " ";
            var categoryId= " ";
               
                    if($('#applicationType').val() == 'GRIEVANCE')
                    {
                        grievanceSuggestionId="1";
                        categoryId=document.getElementById("suggestionCategoryId").value;
                                    
                    }
                    if($('#applicationType').val() == 'SUGGESTION'){
                        grievanceSuggestionId="2";
                        categoryId=document.getElementById("suggestionCategoryId").value;
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
                                        $scope.panleMemberArr[ctr] = elem.options[i].value 
                                        $scope.fd.append("panelMemberId",elem.options[i].value )
                                        panleMembersToshow = panleMembersToshow + elem.options[i].text
                                    }else{
                                        $scope.panleMemberArr[ctr] = elem.options[i].value 
                                        $scope.fd.append("panelMemberId",elem.options[i].value )
                                        panleMembersToshow = panleMembersToshow + elem.options[i].text + ", "
                                    }
                                }
                                
                                //alert("rajesh\n" + $scope.panleMemberArr)
                                document.getElementById("panelMemberNames").innerHTML = panleMembersToshow
                                
                            }
                             }
                    });
                                   
            }     
    $scope.init();
});


