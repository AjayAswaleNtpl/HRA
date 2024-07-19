mainModule.factory("getReporteeEmployeeDirectoryList", function ($resource) {
    return $resource((baseURL + '/api/homeDashboard/getReporteeEmployeeDirectoryList.spr'), {}, { 'save': { method: 'POST', timeout: 60000 } }, {});
  });
  
  
  mainModule.controller('showDebugLogCtrl', function ($scope, $ionicPopup,
    $ionicLoading, $timeout, $filter) {
  
    $scope.googleMapAppApiKey = sessionStorage.getItem('googleMapAppApiKey');
    
    //$scope.googleMapAppApiKey = "AIzaSyBIzUXnWwSZq3SQgwUpjf58Rilj7tqP_Gs";
    //alert("AIzaSyBIzUXnWwSZq3SQgwUpjf58Rilj7tqP_Gs\n"+$scope.googleMapAppApiKey)
  
    //$scope.googleMapAppApiKey = "AIzaSyBIzUXnWwSZq3SQgwUpjf58Rilj7tqP_Gs"
  
    $scope.mapSrc = "https://maps.google.com/maps/api/js?key=" + $scope.googleMapAppApiKey
  
  
    var my_script = document.createElement('script');
    my_script.setAttribute('src', $scope.mapSrc);
    $ionicLoading.show()
    document.head.appendChild(my_script);
    $timeout(function () {
      document.getElementById("jwtt").value = jwtByHRAPI
  
      
     
    },500)
  
     
    $timeout(function () {
      $ionicLoading.hide()
    },50)
  
    
  
    $scope.selectedValues = {}
    $scope.locs = []
    var appKillList = []
    var cntLocs = -1;
    var cntAKL = -1;
    $scope.selectedEmpIdForTrack = ""
    $scope.selectedDate = ""
    $scope.selectedEmpIdForTrack = sessionStorage.getItem("empId")
    var todayDt = new Date()
    tmpdd = todayDt.getDate()
    tmpmm = todayDt.getMonth()+ 1
    tmpyyyy = todayDt.getFullYear()
    if (tmpdd<10) tmpdd= "0"+tmpdd
    if (tmpmm<10) tmpmm= "0"+tmpmm
    
    $scope.selectedDate = tmpdd+"/"+tmpmm+"/"+tmpyyyy
  
    document.getElementById("search_emp_track").value = sessionStorage.getItem("empName") +" (" + sessionStorage.getItem("empCode") +")"
    document.getElementById("fromDate").value =  $scope.selectedDate
   
    $scope.lastHB = "Last HB: "+ localStorage.getItem("HEARTBEAT");
    $scope.lastHB += "\n    Last LOC: "+ getLastLocDatetime()
    $scope.lastHB = ""
    /////////////////////////// for geoTracking //
    // onSuccess Callback
    //   This method accepts a `Position` object, which contains
    //   the current GPS coordinates
    //
    // function onSuccessGL(position) {
    //     var element = document.getElementById('geolocation');
    //     element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
    //                         'Longitude: ' + position.coords.longitude     + '<br />' +
    //                         '<hr />'      + element.innerHTML;
    // }
  
    // // onError Callback receives a PositionError object
    // //
    // function onErrorGL(error) {
    //     var element = document.getElementById('geolocation');
    //     element.innerHTML = 'err code: '  + error.code     + '<br />' +
    //                         'err msg : ' + error.message     + '<br />' 
  
    //    // alert('code: '    + error.code    + '\n' +
    //      //     'message: ' + error.message + '\n');
    // }
  
    // // Options: throw an error if no update is received every 30 seconds.
    // //
    // $scope.watchID = navigator.geolocation.watchPosition(onSuccessGL, onErrorGL, { timeout: 30000 });
  
  
    
  
    $scope.initMap = function (locsArr) {
  
     
      var trackLocs = locsArr;
  
      var myLatLng = { lat: 19.718, lng: 73.220 };
      var map = new google.maps.Map(document.getElementById('mapp'), {
        zoom: 13,
        center: myLatLng
      });
  
  
      var flightPath = new google.maps.Polyline({
        path: trackLocs,
        geodesic: true,
        strokeColor: "#4c9aff",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
  
      flightPath.setMap(map);
  
      var markers = [];
  
      var infoWindows = [];
      for (var i = 0; i < trackLocs.length; i++) {
  
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(trackLocs[i].lat, trackLocs[i].lng),
          map: map,
          title: i + 1 + ""
  
        });
  
        var cnt = i + 1 + "  "
        var contentString = ''
  
        if (trackLocs[i].comments == "MANUAL_PUNCH") {
          contentString = '<div id="content" style="whiteSpace:pre-wrap;">' +
            '<center><h1 id="firstHeading" class="firstHeading" style="margin-right:15px;whiteSpace:pre-wrap;">' + cnt + ' (MP) </h1></center>' +
            '<div id="bodyContent" style="whiteSpace:pre-wrap !important;margin-right:12px;margin-top:-8px;"><p style="whiteSpace:pre-wrap !important;"><b>' +
            trackLocs[i].tm + '</p><div>' +
            '</div>'
        } else {
          contentString = '<div id="content" style="whiteSpace:pre-wrap;">' +
            '<center><h1 id="firstHeading" class="firstHeading" style="margin-right:15px;whiteSpace:pre-wrap;">' + cnt + '  </h1></center>' +
            '<div id="bodyContent" style="whiteSpace:pre-wrap !important;margin-right:12px;margin-top:-8px;"><p style="whiteSpace:pre-wrap !important;"><b>' +
            trackLocs[i].tm + '</p><div>' +
            '</div>'
        }
  
        var infowindow = new google.maps.InfoWindow();
  
  
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
        infoWindows.push(infowindow);
        markers.push(marker)
  
        marker.addListener("click", () => {
          infowindow.open({
            anchor: marker,
            map,
            shouldFocus: false
          });
        });
  
      }
  
      $scope.makeProperZoom(markers,map)
    }
  
  
    $scope.getdata =  function () {
        var logdata = localStorage.getItem("DEBUG_LOG")

        document.getElementById("tl").innerHTML = logdata
        
        return
      /*
      dt = new Date()
      loc = {"latitude":40,"longitude":73.5}
      saveUnsavedGeoDataLocally(dt,loc)
  
      dt = new Date(dt.getTime() + 15000)
      loc = {"latitude":41,"longitude":73.5}
      saveUnsavedGeoDataLocally(dt,loc)
  
      dt = new Date(dt.getTime() + 15000)
      loc = {"latitude":42,"longitude":73.5}
      saveUnsavedGeoDataLocally(dt,loc)
  
      dt = new Date(dt.getTime() + 15000)
      loc = {"latitude":43,"longitude":73.5}
      saveUnsavedGeoDataLocally(dt,loc)
      return
  */
  
      $ionicLoading.hide()
      if ($scope.selectedEmpIdForTrack == "" || 
          $scope.selectedDate == ""){
            showAlert("Please select the employee and date.")
            return
          }
  
      $ionicLoading.show()
  
      $scope.locs = []
      appKillList = []
      cntLocs = -1;
      cntAKL = -1;
      $scope.cntUpdateGeoAddress = 0
      var geocoder = new google.maps.Geocoder;
  
  
      var fd = new FormData();
       fd.append("empId",$scope.selectedEmpIdForTrack)
       fd.append("fromDate",$scope.selectedDate)
       fd.append("toDate",$scope.selectedDate)
  
      //fd.append("empId", 43)
      //fd.append("fromDate", "10/08/2022")
      //fd.append("toDate", "10/08/2022")
  
      $.ajax({
        url: baseURL + '/api/signin/getGeoTrackingLocations.spr',
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        headers: {
          'Authorization': 'Bearer ' + jwtByHRAPI
       },
        success: function (success) {
          if (success.clientResponseMsg != "OK") {
            //console.log(ptime + " Location Saving error : " + success.clientResponseMsg)
          } else {
            //console.log(ptime + " Location saved")
            //alert("data got: " + success.listGTPojo.length)
          }
          $scope.listGTPojo = [];
          $scope.tmpListLocs = []
          var tmpCntrLocs = -1
          
  
          if (success.listGTPojo.length == 0) {
            $ionicLoading.hide()
            showAlert("No Geo Tracking Data for this day")
            return
          }
          $scope.listGTPojo = success.listGTPojo
          
  
            
           for (var i = 0; i < $scope.listGTPojo.length; i++) {
             if (($scope.listGTPojo[i].geoLocationAddress == null || $scope.listGTPojo[i].geoLocationAddress == 'null') && $scope.listGTPojo[i].latitude != "0") {
                if ($scope.listGTPojo[i].comments != "MANUAL_PUNCH"){
                  tmpCntrLocs++;
                  $scope.tmpListLocs[tmpCntrLocs] = $scope.listGTPojo[i]
                  $scope.cntUpdateGeoAddress++;
              }
  
             }
           }
  
  
           //get missing geoLocationAddress
           
           if ($scope.cntUpdateGeoAddress == 0){
            //all have addressses
            $scope.tmpListLocs = $scope.listGTPojo
            $scope.allGeoCodeOver()
           }else{
            $scope.getAddressByGeoCoder(geocoder,$scope.tmpListLocs,0,$scope.cntUpdateGeoAddress)
           }
           
          
    
          return
          
        },
        error(err) {
          $ionicLoading.hide()
          console.log("GTL saving error")
        }
      });
  
    }
  
  
    $scope.allGeoCodeOver = function(){
      
  
      for (var i = 0; i < $scope.listGTPojo.length; i++) {
        if ($scope.listGTPojo[i].latitude == "0") {
          cntAKL++;
          appKillList[cntAKL] = {}
          appKillList[cntAKL].tm = $scope.listGTPojo[i].punchTime
          appKillList[cntAKL].comments = $scope.listGTPojo[i].comments
          continue
        }
        cntLocs++;
        $scope.locs[cntLocs] = {}
        if ($scope.listGTPojo[i].comments == "MANUAL_PUNCH") {
          $scope.locs[cntLocs].tmSuffix = "\n(MP)"
          $scope.locs[cntLocs].gtlId = parseFloat($scope.listGTPojo[i].gtlId)
          $scope.locs[cntLocs].lat = parseFloat($scope.listGTPojo[i].latitude)
          $scope.locs[cntLocs].lng = parseFloat($scope.listGTPojo[i].longitude)
          $scope.locs[cntLocs].tm = $scope.listGTPojo[i].punchTime
          $scope.locs[cntLocs].comments = $scope.listGTPojo[i].comments
          $scope.locs[cntLocs].geoLocationAddress = $scope.listGTPojo[i].geoLocationAddress
        }else{
          $scope.locs[cntLocs].gtlId = parseFloat($scope.listGTPojo[i].gtlId)
          $scope.locs[cntLocs].lat = parseFloat($scope.listGTPojo[i].latitude)
          $scope.locs[cntLocs].lng = parseFloat($scope.listGTPojo[i].longitude)
          $scope.locs[cntLocs].tm = $scope.listGTPojo[i].punchTime
          $scope.locs[cntLocs].comments = $scope.listGTPojo[i].comments
          $scope.locs[cntLocs].geoLocationAddress = $scope.listGTPojo[i].geoLocationAddress
          for (var j=0; j<$scope.tmpListLocs.length; j++){
            if (parseFloat($scope.tmpListLocs[j].gtlId) == parseFloat($scope.locs[cntLocs].gtlId)){
              $scope.locs[cntLocs].geoLocationAddress = $scope.tmpListLocs[j].geoLocationAddress
              $scope.listGTPojo[i].geoLocationAddress = $scope.tmpListLocs[j].geoLocationAddress
              break;
            }
          }
      }
    }
  
  
      $scope.initMap($scope.locs)
  
      var str = ''
      for (var i = 0; i < appKillList.length; i = i + 2) {
        if (appKillList[i] && appKillList[i+1]){
          str = str + "App was killed between " + appKillList[i].tm + ' and ' + appKillList[i + 1].tm + "<br>"
          
        }
      }
        
      //document.getElementById('appKillDiv').innerHTML = str;
      if ($scope.cntUpdateGeoAddress > 0){
        $scope.updateAddressesAtServer($scope.listGTPojo)      
      }
      document.getElementById("mpdiv").style.visibility="visible"
  
        $timeout(function () {
          if (!$scope.$$phase)
          $scope.$apply()	
          $ionicLoading.hide()
        },2000)
  
    }
  
  
  
      
    $scope.getAddressByGeoCoder = function (geocoder,objList,cntr,totCntr) {
      var input = objList[cntr].latitude + "," + objList[cntr].longitude
      var latlngStr = input.split(',', 2);
      var latlng = { lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1]) };
          geocoder.geocode({ 'location': latlng }, function (results, status) {
        if (status === 'OK') {
          if (results[0]) {
            objList[cntr].geoLocationAddress = results[0].formatted_address
            if (cntr == totCntr - 1){
              $scope.allGeoCodeOver()
            }else{
              
              $timeout(function () {
                cntr++
                //document.getElementById("fromDate").value = "LOC NO " + cntr;
                $scope.getAddressByGeoCoder(geocoder, objList,cntr,totCntr)            
                return true
              }, 250)
          }
            }  
          } else{
            if (status === 'OVER_QUERY_LIMIT'){
              $timeout(function () {
                //document.getElementById("fromDate").value = "LOC NO " + cntr;
                $scope.getAddressByGeoCoder(geocoder, objList,cntr,totCntr)            
                return true
              }, 250)
            }
          }    
    });
    }
  
  
    $scope.updateAddressesAtServer = function (locsList) {
      var fd = new FormData();
    
      for (var m=0;m<locsList.length;m++){
        locsList[m].geoLocationAddress =  encodeURI(locsList[m].geoLocationAddress)
      }
  
      fd.append("gtlJsonList", JSON.stringify(locsList))
  
      $.ajax({
        url: baseURL + '/api/signin/updateGeoLocationAddress.spr',
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        headers: {
          'Authorization': 'Bearer ' + jwtByHRAPI
       },
        success: function (success) {
          //alert("updated addresss " + success.clientResponseMsg)
        },
        error(err) {
          $ionicLoading.hide()
          console.log("GTL update address error")
        }
      });
  
    }
  
  
  
    $scope.empChangedByPopUpSelection = function () {
      if (document.getElementById("search_emp_track").value == "") {
        $scope.selectedEmpIdForTrack = -1
      }
      $scope.selectedEmpIdForTrack = document.getElementById("selectedEmpIdFromPopUp").value
    }
  
    $scope.setDate = function () {
      var date;
      date = date = new Date();
  
      var options = { date: date, mode: 'date', titleText: 'From Date', androidTheme: 4 };
      datePicker.show(options, function (date) {
        if (date == undefined) {
  
        }
        else {
          $scope.fDate = date
          $scope.selectedDate = $filter('date')(date, 'dd/MM/yyyy');
          document.getElementById("fromDate").value = $scope.selectedDate
        }
      }, function (error) {
      });
    }
  
    //   $scope.filterEmp = function () {
    //     var searchEmpText = document.getElementById("search_emp_track").value
    //     if (searchEmpText.length < 3) {
    //         return
    //     }
    //     searchEmpText = searchEmpText.toLowerCase()
    //     $scope.pmsEmployeeStatusList = $scope.allEmps.filter(function (el) {
    //         return el.name.toLowerCase().indexOf(searchEmpText) >= 0;
    //     });
  
    //     if (!$scope.$$phase)
    //         $scope.$apply()
  
    // }
  
  
  
  
    // $scope.getReporteeList = function(){
  
    //   $ionicLoading.show();
    //     $scope.tmp = {}
    //           $scope.getReporteeEmployeeDirectoryList = new getReporteeEmployeeDirectoryList();
    //           $scope.getReporteeEmployeeDirectoryList.$save($scope.tmp, function (success) {
    //       if (!(success.clientResponseMsg=="OK")){
    //           console.log(success.clientResponseMsg)
    //           handleClientResponse(success.clientResponseMsg,"getReporteeEmployeeDirectoryList")
    //       }	
  
    //       if (success.empList === undefined || success.empList== null){
    //         $scope.empList = []
    //         return;
    //       }else{
  
    //         $scope.empList = success.empList;
  
    //         //alert($scope.myEmpId)
    //         var mempid = $scope.myEmpId
    //         //$scope.empList.unshift({"empId": "-1","name":"-- Self --","empCode":""})	
  
    //         $scope.fullEmpList=[]
    //         $scope.allEmps = []
  
    //         $scope.empList.forEach((v, i) => {
    //           const val = (typeof v === 'object') ? Object.assign({}, v) : v;
    //          // $scope.fullEmpList.push(val);
    //          $scope.allEmps.push(val);
    //         });
    //         $ionicLoading.hide()
    //         // for (var k=0;k<$scope.empList.length;k++){
    //         //   if ($scope.empList[k].name == sessionStorage.getItem('empName')){
    //         //     $scope.myNameIndexInDropdown = k;
    //         //     break;
    //         //   }
    //         // }
  
    //       }
  
    //     }, function (data) {
    //               autoRetryCounter = 0
    //               $ionicLoading.hide()
    //               commonService.getErrorMessage(data, "app.homeDashboard");
    //           });
    // }
  
    // $scope.f_change = function ( empid,empName) {
  
    //   var periodId = ""
    //   var companyId = ""
    //   var empId = ""
  
    //   if (empid != '') {
    //       empId = empid
    //       $scope.empId = empid
  
    //       $timeout(function () {
    //           document.getElementById("search_emp_track").value = empName
    //           if (!$scope.$$phase)
    //               $scope.$apply()
    //       }, 50)
    //   }else{
    //       //may be it is from period change
    //       if ($scope.empId){
    //           empId = $scope.empId
    //       }
    //   }
    // }
  
  
  
    // $scope.getSelectedEmpid = function(){
    //   elem = document.getElementById("empId")
    //         for (var i = 0; i < elem.options.length; i++) {
    //             if (elem.options[i].selected) {
    //                 if (i > 0) {
    //                     empId = $scope.allEmps[i - 1].applicantId
    //                     break
    //                 } else {
    //                     break
    //                 }
    //             }
    //         }
    // }
  
  
  
  
    $timeout(function () {
      //$scope.initMap()
      //$scope.getdata()
      //$scope.getReporteeList()
  
    }, 1000)
  
  
  
    // $scope.saveKIllTIme = function(){
    //   var fd = new FormData();
    //   fd.append("empId",156)
    //   fd.append("empCode","P0156")
    //   fd.append("frmDt","22/07/2022")
    //   fd.append("toDt","22/07/2022")
    //   fd.append("frmTm","15:45:22")
    //   fd.append("toTm","18:49:47")
  
    //   $.ajax({
    //   url: baseURL + '/api/signin/saveHeartBeatRecords.spr',
    //   data: fd,
    //   processData: false,
    //   contentType: false,
    //   type: 'POST',
    //   success: function (success) {
    //     $ionicLoading.hide()
    //     if (success.clientResponseMsg != "OK") {
    //       console.log(ptime + " Kill time Saving error : " + success.clientResponseMsg)
    //     } else {
    //       console.log(ptime + " kill time  saved")
    //     }
    //     alert("kill tim esaved")
  
    //   },
    //   error(err) {
    //     $ionicLoading.hide()
    //     console.log("GTL saving error")
    //   }
    // });
  
    // }
  
  
    $scope.getConsent = function () {
      alert(getGeoTrackingConsent(43))
    }
  
  
    $scope.saveConsent = function () {
      alert(saveGeoTrackingConsent(43,'P0043','Y'))
    }
  
    $scope.registerMyCurrentLocaion = function(){
      if (GeoTrackingON_OFF == "ON"){
        doLocationRegisterManual()
      }else{
        showAlert("Geo Tracking is OFF. Kindly do a mobiule punch to make it ON")
      }
      
    }
  
    $scope.stopeTR = function () {
  
      //  navigator.geolocation.clearWatch($scope.watchID);
      var element = document.getElementById('geolocation');
      element.innerHTML = ""
      var locsPts = localStorage.getItem("TRACKING");
      if (locsPts != null) {
  
        locsPts = locsPts.split(',');
      } else {
        element.innerHTML = "no locaiton"
        return
      }
      var ih = ""
      var dist = ""
      for (var i = 0; i < locsPts.length; i = i + 4) {
        if (i > 0) {
          dist = parseFloat(getDistanceFromLatLonInKm(locsPts[1], locsPts[2], locsPts[i - 3], locsPts[i - 2])).toFixed(2)
        }
        ih += locsPts[i] + "," + locsPts[i + 1] + "," + locsPts[i + 2] + "<br>Acc. " + Math.round(locsPts[i + 3]) + ", Dist: " + dist + "<br>"
      }
      element.innerHTML = ih
  
    }
  
  
    $scope.mySleep = function(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    }
  
  
    $scope.makeProperZoom = function(markers,map){
      
  var bounds = new google.maps.LatLngBounds();
  for(i=0;i<markers.length;i++) {
     bounds.extend(markers[i].getPosition());
  }
  
  //center the map to a specific spot (city)
  //map.setCenter(center); 
  
  //center the map to the geometric center of all markers
  map.setCenter(bounds.getCenter());
  
  map.fitBounds(bounds);
  
  //remove one zoom level to ensure no marker is on the edge.
  map.setZoom(map.getZoom()-1); 
  
  // set a minimum zoom 
  // if you got only 1 marker or all markers are on the same address map will be zoomed too much.
  if(map.getZoom()> 15){
    map.setZoom(15);
  }
    }
  
  
  });
  