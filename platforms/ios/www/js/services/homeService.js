
mainModule.factory("homeService", function ($http, $rootScope, $location) {
    var object = {};
    object.getResult = function (type, successCallback, errorCallback) {
        var stDate = new Date()
        var enDate = new Date()
        stDate.setHours(00, 00, 00)
        enDate.setHours(23, 59, 59)
        
        
        
        //return
        if (!db){
            successCallback(0, null)
            //alert("returning as no db ")
            return
        }
        db.transaction(function (tx) {
            
            tx.executeSql("SELECT * FROM PunchInPunchOut WHERE empId=? AND type=? AND createdDate BETWEEN ? AND ?;", [sessionStorage.getItem('empId'), type, stDate, enDate], function (tx, res) {
			/////////////////////////////
				$http({
                        url: (baseURL + '/api/signin/clockInOutData.spr'),
                        method: 'POST',
                        timeout: commonRequestTimeout,
                        transformRequest: jsonTransformRequest,
                        data: "",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Bearer ' + jwtByHRAPI
                        }
                    }).
                            success(function (data_return) {
								var lbFoundClockInOutData = false
								var lbcount = 0
								if (type=='SIGNOUT')
								{
									successCallback(res.rows.length, res.rows.item(0))
								}									
								else if (data_return.listOfClockInOut.length > 0 ||  res.rows.length)
								{
									for(var i=0;i<data_return.listOfClockInOut.length;i++){
											if (data_return.listOfClockInOut[i].capturingMode!="OD"){
												lbFoundClockInOutData = true
												lbcount++;
												//break;
											}
									}
									if (lbFoundClockInOutData == false){
										successCallback(0, res.rows.item(0))
									}else{
										successCallback(lbcount, res.rows.item(0))
									}
									
								}
								else if (data_return.listOfClockInOut.length == 0 && res.rows.length==0)
								{
									for(var i=0;i<data_return.listOfClockInOut.length;i++){
											if (data_return.listOfClockInOut[i].capturingMode!="OD"){
												successCallback(0, res.rows.item(0))
												lbFoundClockInOutData = true
												lbcount++;
												//break;
											}
									}
									if (lbFoundClockInOutData == false){
										successCallback(0,res.rows.item(0) )
									}else{
										successCallback(lbcount, res.rows.item(0))
									}
									
									
								}
                                
                            }).error(function (data_return, status) {
                        //data_return = {status: status};
                        commonService.getErrorMessage(data_return);
                        $ionicLoading.hide()
                    })

				/////////////////////////////
				
             //successCallback(res.rows.length, res.rows.item(0))
            }, function (tx, err) {
                console.log(" tx:" + JSON.stringify(err));
                errorCallback(err)
            })
        },function(er){
            //alert("Error in sqlite transaction")
        })
    }
    object.insertData = function (data, successCallback, errorCallback) {
        db.transaction(function (tx) {
            tx.executeSql("INSERT INTO PunchInPunchOut(empId,Latitude,Longitude,Accuracy,Date_Time,type,syncStatus,createdDate) VALUES (?,?,?,?,?,?,?,?)", [sessionStorage.getItem('empId'), data.Latitude, data.Longitude, data.Accuracy, data.DateTime,data.type, 'NOTDONE', new Date()], function (tx, rs) {
                tx.executeSql("SELECT * FROM PunchInPunchOut WHERE empId=? AND syncStatus=? AND type=?;", [sessionStorage.getItem('empId'), 'NOTDONE', 'SIGNIN'], function (tx, res1) {});
                successCallback(rs)
            }, function (tx, e) {
                console.log(" tx:" + JSON.stringify(err));
                errorCallback(e)
            });
        })
    }
    object.updateStatus = function (id, successCallback, errorCallback) {
        db.transaction(function (tx) {
            tx.executeSql("UPDATE PunchInPunchOut SET syncStatus ='DONE' WHERE id=? ;", [id], function (tx, res) {
                successCallback(res)
            }, function (tx, err) {
                console.log("insert data tx:" + JSON.stringify(err));
                errorCallback(err)
            })
        })
    }
    object.getRemSync = function (syncStatus, successCallback, errorCallback) {
        db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM PunchInPunchOut WHERE empId=? AND syncStatus=?;", [sessionStorage.getItem('empId'), syncStatus], function (tx, res) {
                var punchInCnt = 0
                var punchOutCnt = 0
                if (res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        if (res.rows.item(i).type == 'SIGNIN') {
                            punchInCnt++
                        } else {
                            punchOutCnt++
                        }
                    }
                }
                successCallback(res.rows.length, punchInCnt, punchOutCnt)
            }, function (tx, err) {
                console.log(" tx:" + JSON.stringify(err));
                errorCallback(err)
            })
        })
    }
    object.getRemData = function (syncStatus, type, successCallback, errorCallback) {
        db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM PunchInPunchOut WHERE empId=? AND syncStatus=? AND type=?;", [sessionStorage.getItem('empId'), syncStatus, type], function (tx, res) {
                var offlineAttList = []
                if (res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        var temp = {}
                        temp.Latitude = res.rows.item(i).Latitude;
                        temp.Longitude = res.rows.item(i).Longitude;
                        temp.Accuracy = res.rows.item(i).Accuracy;
                        temp.DateTime = res.rows.item(i).Date_Time;
                        temp.type = res.rows.item(i).type;
                        temp.id = res.rows.item(i).id
                        temp.status = "Created";                       
                        offlineAttList.push(temp);
                    }
                }
                successCallback(offlineAttList)
            }, function (tx, err) {
                console.log(" tx:" + JSON.stringify(err));
                errorCallback(err)
            })
        })
    }
    object.deleteOffLineData = function (id, successCallback, errorCallback) {
        db.transaction(function (tx) {
            tx.executeSql("DELETE  FROM PunchInPunchOut WHERE id=? AND syncStatus=?;", [id, 'NOTDONE'], function (tx, res) {
                successCallback(res)
            }, function (tx, err) {
                console.log(" tx:" + JSON.stringify(err));
                errorCallback(err)
            })
        })
    }
    object.updateInboxEmailList = function (id, successCallback, errorCallback) {
			/////////////////////////////
				$http({
                        url: (baseURL + '/api/eisCompany/getInboxOnly.spr'),
                        method: 'POST',
                        timeout: commonRequestTimeout,
                        transformRequest: jsonTransformRequest,
                        data: "",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Bearer ' + jwtByHRAPI
                        }
                    }).
                        success(function (data) {
						if (!(data.clientResponseMsg=="OK")){
								console.log(data.clientResponseMsg)
								handleClientResponse(data.clientResponseMsg,"getHolidayService")
						}
						
						if (data.emailList ===undefined){
							//do nothing
						}else{
							$rootScope.UnreadMessages= 0;
							for (var i = 0; i < data.emailList.length; i++) {
									if (data.emailList[i].status == 'N') {
										$rootScope.UnreadMessages++;
									}
								}			
						}
						successCallback("")
                                
                            }).error(function (data_return, status) {
                        data_return = {status: status};
                        commonService.getErrorMessage(data_return);
						errorCallback("")
                     })
				/////////////////////////////        
    }
	
    return object;
});
