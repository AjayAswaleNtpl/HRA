
var baseURL = localStorage.getItem("BaseUrl");
var myServerCookie = ""
var jwtByHRAPI = ""

var appVersion = '5.0.20.9';

var alert_header = ""

var autoRetryCounter = 0;
var commonRequestTimeout = 120000;
var gb_processTimeRec = "true";

//var commonRequestTimeout = 1200000;
var applyAppVersionCompatibiliyModule = "N";
var myHrapiVersion = "-1";

var app_product_name = "HRAlign"
//var app_product_name = "QUBE"
var demoOnboarding = 'false'

var gstrFname = ""
var gblobFiledata

var gstrVerionCheckAtStoreAndroid = 'Y'
// geot tranking vars
var GeoTrackingFeatureEnabledForClient
	= "false"
var GeoTrackingEnabledForUser = "false"
var GeoTrackingEnabled = "false"

var GeoTrackingON_OFF = "OFF"

var GeoTrackingTimerStarted = "false"
var GeoTrackingCounter = 0;
var GeoTrackingIntervalInMinutes = 15;
var gi_heartBeatIntervalInMinutes = 2
var GeoTrackingEndTime = "18:25"


var garr_GT_Slots = []

var BG_SERVICE_STARTED = "false"
var serviceEnabledNow = "false"

var globalAppStartTime = new Date();
var globalResumeTime = ""
var globalPauseTime = ""

var gstr_odd_even_punches = "EVEN"


var jsonTransformRequest = function (data) {
	var param = function (obj) {
		var query = '';
		var name, value, fullSubName, subValue, innerObj, i;

		for (name in obj) {
			value = obj[name];

			if (value instanceof Array) {
				for (i = 0; i < value.length; ++i) {
					subValue = value[i];
					fullSubName = name + '[' + i + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if (value instanceof Object) {
				for (subName in value) {
					subValue = value[subName];
					fullSubName = name + '.' + subName;
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if (value !== undefined && value !== null) {
				query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
			}
		}
		return query.length ? query.substr(0, query.length - 1) : query;
	};
	var ret = angular.isObject(data) ? param(data) : data;
	return ret;
};

var getMenuInformation = function (moduleName, menuName) {
	var portalModule = JSON.parse(sessionStorage.getItem("portalModule"));
	var modules = $.grep(portalModule, function (v) {
		return v.moduleName === moduleName;
	});
	//modules=[];

	if (modules.length <= 0) {
		return false;
	}
	var menus = $.grep(modules[0].masterMenuBeanList, function (v) {
		return v.menuName === menuName;
	});
	if (menus.length > 0) {
		return menus[0];
	}
	else {
		return false;
	}
}

var stringToDate = function (customDate) {
	var partsDates = customDate.split("#");
	var afterParse = partsDates[0].split("/");
	var parts = afterParse;
	var convertedDate = new Date(parseInt(parts[2], 10),
		parseInt(parts[1], 10) - 1,
		parseInt(parts[0], 10));

	return convertedDate;
}

var compareDate = function (frstDt, sndDt, fmt) {
	var firstDay;
	var secondDay;
	var firstMon;
	var secondMon;
	var firstYear;
	var secondYear;
	//	alert("hi")
	if (fmt == "dd/MM/yyyy" || fmt == "dd-MM-yyyy" || fmt == "dd.MM.yyyy") {
		firstDay = frstDt.substring(0, 2);
		secondDay = sndDt.substring(0, 2);
		firstMon = frstDt.substring(3, 5);
		secondMon = sndDt.substring(3, 5);
		firstYear = frstDt.substring(6, 10);
		secondYear = sndDt.substring(6, 10);

	} else if (fmt == "MM/dd/yyyy" || fmt == "MM-dd-yyyy" || fmt == "MM.dd.yyyy") {
		firstMon = frstDt.substring(0, 2);
		secondMon = sndDt.substring(0, 2);
		firstDay = frstDt.substring(3, 5);
		secondDay = sndDt.substring(3, 5);
		firstYear = frstDt.substring(6, 10);
		secondYear = sndDt.substring(6, 10);
	} else if (fmt == "yyyy/MM/dd" || fmt == "yyyy-MM-dd" || fmt == "yyyy.MM.dd") {

		firstYear = frstDt.substring(0, 4);
		secondYear = sndDt.substring(0, 4);
		firstMon = frstDt.substring(5, 7);
		secondMon = sndDt.substring(5, 7);
		firstDay = frstDt.substring(8, 10);
		secondDay = sndDt.substring(8, 10);
	}

	var firstDate = new Date(firstYear, eval(firstMon - 1), firstDay);
	var secondDate = new Date(secondYear, eval(secondMon - 1), secondDay);

	if (secondDate.getTime() > firstDate.getTime()) {
		return 1;
	} else if (secondDate.getTime() < firstDate.getTime()) {
		return -1;
	} else {
		return 0;
	}
}



var caldays = function (dt1, dt2) {

	var date1 = 0;
	var date2 = 0;
	var v = dt1;
	var v2 = dt2;

	dd1 = v.substring(0, 2)
	mm1 = v.substring(3, 5)
	yy1 = v.substring(6, 10)


	dd2 = v2.substring(0, 2)
	mm2 = v2.substring(3, 5)
	yy2 = v2.substring(6, 10)

	date1 = new Date(mm1 + "/" + dd1 + "/" + yy1)
	date2 = new Date(mm2 + "/" + dd2 + "/" + yy2)

	var nodays = Math.abs((date2 - date1) / 86400000) + 1

	return nodays;
}



var getTodaysDate = function () {
	var today = new Date()
	var dd, mm, yyyy
	if (today.getDate() < 10) {
		dd = "0" + today.getDate()
	} else {
		dd = today.getDate()
	}

	if (today.getMonth() + 1 < 10) {
		mm = "0" + (today.getMonth() + 1)
	} else {
		mm = today.getMonth() + 1
	}

	yyyy = today.getFullYear()

	return dd + "/" + mm + "/" + yyyy

}


var copyFile = function (baseFileURI, destPathName, fileSystem) {
	window.resolveLocalFileSystemURL(baseFileURI,
		function (file) {
			window.requestFileSystem(fileSystem, 0,
				function (fileSystem) {
					var documentsPath = fileSystem.root + "Download";
					console.log(documentsPath);
					console.log(destPathName);
					file.copyTo(documentsPath, destPathName,

						function (res) {

							console.log('copying was successful to: ' + res.nativeURL)
						},
						function (err) {

							console.log('unsuccessful copying ' + err.code)
						});


					/*
					documentsPath.getDirectory('Download', { create: false, exclusive: false },function (dirEntry) {
						console.log('dir entry: ' + dirEntry)
						file.copyTo(dirEntry, destPathName,

							function(res){

								console.log('copying was successful to: ' + res.nativeURL)
							},
							function(err){

								console.log('unsuccessful copying ' + err.code)
							});
					},
					function(err){
						alert("direcftory getdire error")
						console.log('failure! DIRECTORY was not found' + err.code )
					});*/
					//var parentEntry = new DirectoryEntry({fullPath: "/"});
					// file.copyTo(documentsPath+"Download", destPathName,


				});
		},
		function () {
			alert("copy failed")
			console.log('failure! file was not found')
		});
}

function successMoveFile(entry) {
	alert("file moved ")
	alert(FileError.NOT_FOUND_ERR)
	console.log("New Path: " + entry.fullPath);
}

function failMoveFile(error) {
	alert(FileError.NOT_FOUND_ERR)
	alert("File move  fial " + error.code);
}

function moveFile(entry, filename) {
	var parent = cordova.file.externalRootDirectory,

		parentName = parent.substring(parent.lastIndexOf('/') + 1),
		parentEntry = new DirectoryEntry(parentName, parent);

	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
		fs.root.getDirectory(
			"Download",
			{
				create: false
			},
			function (dirEntry) {
				//alert(dirEntry)
				entry.moveTo(dirEntry, filename, successMoveFile, failMoveFile);
			}
		)
	});

	//parentEntry = new DirectoryEntry({fullPath: parent});


	// move the file to a new directory and rename it


}



// Checking for permissions
function checkPermissionCallback(status) {
	let permissions = cordova.plugins.permissions

	console.log('checking permissions')
	console.log("statu:" + status)
	if (!status.hasPermission) {
		var errorCallback = function () {
			console.warn('Storage permission is not turned on')
			showAlert("Please provide storage permissions to " + alert_header + " App.")
		}
		// Asking permission to the user
		permissions.requestPermission(
			permissions.WRITE_EXTERNAL_STORAGE,
			function (status) {
				if (!status.hasPermission) {
					errorCallback(showAlert("Permissions for storage are not allowed."))
				} else {
					// proceed with downloading
					saveFileFromData(gstrFname, gblobFiledata)

				}
			},
			errorCallback)
	} else {
		saveFileFromData(gstrFname, gblobFiledata)

	}
}
var saveFileFromData = function (filename, blob) {


	if (window.cordova && cordova.platformId !== "browser") {
		document.addEventListener("deviceready", function () {

			var storageLocation = "";

			switch (device.platform) {
				case "Android":
					storageLocation = cordova.file.externalDataDirectory;
					storageLocation = cordova.file.externalRootDirectory + 'download/'

					//storageLocation = cordova.file.dataDirectory  ;
					//storageLocation = "/Download/"
					break;

				case "iOS":
					storageLocation = cordova.file.documentsDirectory;
					break;
			}


			var folderPath = storageLocation  //dirObject.nativeURL;

			window.resolveLocalFileSystemURL(
				folderPath,
				function (dir) {
					dir.getFile(
						filename,
						{
							create: true
						},
						function (file) {
							file.createWriter(
								function (fileWriter) {
									fileWriter.seek(0)
									fileWriter.write(blob);

									fileWriter.onwriteend = function () {
										var url = file.toURL();

										showAlert("File Saved in download folder", filename)



										//move file
										//moveFile(file,filename)

										/*window.setTimeout(function () {
											//alert("copying")
											copyFile(url,'z'+filename,LocalFileSystem.PERSISTENT);
										},3000)
										*/

										//////////////////////



										/*cordova.plugins.fileOpener2.open(url, mimeType, {
										  error: function error(err) {
											console.error(err);
											alert("Unable to download");
										  },
										  success: function success() {
			
											console.log("success with opening the file");
										  }
										});*/
									};

									fileWriter.onerror = function (err) {
										//showAlert("Unable to download. Please try later. Code=1");
										console.error("FILE DOWNLOAD ERROR: " + err);
									};
								},
								function (err) {
									// failed
									showAlert("Unable to download. Please try later. Code=2");
									console.error(err);
								}
							);
						},
						function (err) {
							showAlert("Unable to download. Please try later. Code=3" + err);
							console.log("code3error:" + err);
						}
					);
				},
				function (err) {
					showAlert("Unable to download. Please try later. Code=4");
					console.error(err);
				}
			);
		});
	}
}





var getDonloadDirectoryObject = function (filename, blob) {
	if (device.platform == "Android") {
		gstrFname = filename
		gblobFiledata = blob
		let permissions = cordova.plugins.permissions
		permissions.checkPermission(permissions.WRITE_EXTERNAL_STORAGE, checkPermissionCallback, null)
	} else {
		saveFileFromData(filename, blob)
	}


	return;

	switch (device.platform) {
		case "Android":
			dnldDir = cordova.file.externalDataDirectory;
			//dnldDir = "file:///storage/emulated/0/"
			break;

		case "iOS":
			dnldDir = cordova.file.documentsDirectory;
			break;
	}
	window.resolveLocalFileSystemURL(dnldDir,
		function (fileSystem) {

			fileSystem.getDirectory('Download', {
				create: false,
				exclusive: false
			},
				function (directory) {

					saveFileFromData(filename, blob)
					return;

				}, function err(aa) { alert("1") });
		}, function err1(aa) { alert("2") });

}




var downloadFileFromData = function download(filename, data, mimeType) {
	var savingPath;
	var blob = new Blob([data], {
		type: mimeType
	});
	getDonloadDirectoryObject(filename, blob)
	/*
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
						//alert('1');
						fileSystem.root.getDirectory("Download", {create: true, exclusive: false}, function(dirEntry) {
							 dirEntry.getFile(filename, {create: true, exclusive: false},function(fileEntry) {
							var localPath = fileEntry.fullPath;
							alert(localPath)
							if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
								localPath = localPath.substring(7);
								alert(localPath)
							}
							//alert(remoteFile);
							//alert(localPath);
	
	
								}, /*fail);
						}, /*fail);
					}, /*fail);
	
	*/


}



/**
 * Convert a base64 string in a Blob according to the data and contentType.
 *
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
/*
var b64toBlob = function (b64Data, contentType, sliceSize) {
	   contentType = contentType || '';
	   sliceSize = sliceSize || 512;

	   var byteCharacters = atob(b64Data);
	   var byteArrays = [];

	   for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		   var slice = byteCharacters.slice(offset, offset + sliceSize);

		   var byteNumbers = new Array(slice.length);
		   for (var i = 0; i < slice.length; i++) {
			   byteNumbers[i] = slice.charCodeAt(i);
		   }

		   var byteArray = new Uint8Array(byteNumbers);

		   byteArrays.push(byteArray);
	   }

	 var blob = new Blob(byteArrays, {type: contentType});
	 return blob;
}
*/

/**
 * use this to make a Base64 encoded string URL friendly,
 * i.e. '+' and '/' are replaced with '-' and '_' also any trailing '='
 * characters are removed
 *
 * @param {String} str the encoded string
 * @returns {String} the URL friendly encoded String
 */
var Base64EncodeUrl = function (str) {
	return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

/**
 * Use this to recreate a Base64 encoded string that was made URL friendly
 * using Base64EncodeurlFriendly.
 * '-' and '_' are replaced with '+' and '/' and also it is padded with '+'
 *
 * @param {String} str the encoded string
 * @returns {String} the URL friendly encoded String
 */
var Base64DecodeUrl = function (str) {
	str = (str + '===').slice(0, str.length + (str.length % 4));
	return str.replace(/-/g, '+').replace(/_/g, '/');
}


var base64toBlob = function (base64Data, contentType) {
	contentType = contentType || '';
	var sliceSize = 1024;
	var byteCharacters = atob(base64Data);
	var bytesLength = byteCharacters.length;
	var slicesCount = Math.ceil(bytesLength / sliceSize);
	var byteArrays = new Array(slicesCount);

	for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
		var begin = sliceIndex * sliceSize;
		var end = Math.min(begin + sliceSize, bytesLength);

		var bytes = new Array(end - begin);
		for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
			bytes[i] = byteCharacters[offset].charCodeAt(0);
		}
		byteArrays[sliceIndex] = new Uint8Array(bytes);
	}
	return new Blob(byteArrays, { type: contentType });
}


var saveBaseUrlToFile = function (filename, BaseUrl) {


	if (window.cordova && cordova.platformId !== "browser") {
		document.addEventListener("deviceready", function () {

			var storageLocation = "";

			switch (device.platform) {
				case "Android":
					storageLocation = cordova.file.externalDataDirectory;
					storageLocation = cordova.file.externalRootDirectory + 'download/'

					//storageLocation = cordova.file.dataDirectory  ;
					//storageLocation = "/Download/"
					break;

				case "iOS":
					storageLocation = cordova.file.documentsDirectory;
					break;
			}


			var folderPath = storageLocation  //dirObject.nativeURL;


			window.resolveLocalFileSystemURL(
				folderPath,
				function (dir) {
					dir.getFile(
						filename,
						{
							create: true
						},
						function (file) {
							file.createWriter(
								function (fileWriter) {
									fileWriter.seek(0)
									alert(BaseUrl)
									fileWriter.write(BaseUrl);

									fileWriter.onwriteend = function () {
										var url = file.toURL();

										showAlert("File Saved in download folder", filename)

									};

									fileWriter.onerror = function (err) {
										showAlert("Unable to download. Please try later. Code=1");
										// console.error(err);
									};
								},
								function (err) {
									// failed
									showAlert("Unable to download. Please try later. Code=2");
									// console.error(err);
								}
							);
						},
						function (err) {
							showAlert("Unable to download. Please try later. Code=3");
							// console.log(err);
						}
					);
				},
				function (err) {
					showAlert("Unable to download. Please try later. Code=4");
					// console.error(err);
				}
			);
		});
	}
}



function getKyByValueFromJSMap(map, searchValue) {
	for (let [key, value] of map.entries()) {
		if (value === searchValue)
			return key;
	}
}
// maintaining hrapi versions mapping arrays
hrapiVersionsText = new Array(15)
hrapiVersionsNumber = new Array(15)

hrapiVersionsText[0] = "4.0.0.6"
hrapiVersionsNumber[0] = 1

hrapiVersionsText[1] = "4.0.1.2"
hrapiVersionsNumber[1] = 2

hrapiVersionsText[2] = "4.0.2.0"
hrapiVersionsNumber[2] = 3

hrapiVersionsText[3] = "4.0.2.3"
hrapiVersionsNumber[3] = 4

hrapiVersionsText[4] = "4.0.3.3"
hrapiVersionsNumber[4] = 5

hrapiVersionsText[5] = "4.0.3.3.1"
hrapiVersionsNumber[5] = 6

hrapiVersionsText[6] = "4.0.4.0"
hrapiVersionsNumber[6] = 7

hrapiVersionsText[7] = "4.0.4.1"
hrapiVersionsNumber[7] = 8

hrapiVersionsText[8] = "4.0.4.3"
hrapiVersionsNumber[8] = 9

hrapiVersionsText[9] = "4.0.4.3.2"
hrapiVersionsNumber[9] = 10

hrapiVersionsText[10] = "4.0.4.4"
hrapiVersionsNumber[10] = 11

hrapiVersionsText[11] = "4.0.4.6"
hrapiVersionsNumber[11] = 12

hrapiVersionsText[12] = "4.0.4.7"
hrapiVersionsNumber[12] = 13

hrapiVersionsText[13] = "4.0.5.3"
hrapiVersionsNumber[13] = 14

hrapiVersionsText[14] = "4.0.5.6"
hrapiVersionsNumber[14] = 14 // purposely repeated version 14 , because some build has to be given but not the features.

// from this point version will come from hrapi


var getHrapiVersionNumber = function (verText) {
	/*for(i=0;i<hrapiVersionsText.length;i++){
		if (hrapiVersionsText[i]==verText) {
			return hrapiVersionsNumber[i]
		}
	}
	return -1;
	*/
	return getMyHrapiVersionNumber()
}

var getMyHrapiVersionNumber = function () {

	if (sessionStorage.getItem('product_version') == "-1") {
		//do nothing
	}
	else {
		return sessionStorage.getItem('product_version')
	}


	var verText = sessionStorage.getItem("domainVersion")
	for (i = 0; i < hrapiVersionsText.length; i++) {
		if (hrapiVersionsText[i] == verText) {
			return hrapiVersionsNumber[i]
		}
	}
	return -1;
}



var getDateinDDMMYYYY = function (dt) {
	var dd, mm, yyyy

	dd = dt.getDate()
	if (dd < 10) dd = '0' + dd.toString()

	mm = dt.getMonth()
	mm = mm + 1
	if (mm < 10) mm = '0' + mm.toString()

	yyyy = dt.getFullYear()

	return dd + "/" + mm + "/" + yyyy
}

var getDateinYYYYMMDD = function (dt) {
	var dd, mm, yyyy

	dd = dt.getDate()
	if (dd < 10) dd = '0' + dd.toString()

	mm = dt.getMonth()
	mm = mm + 1
	if (mm < 10) mm = '0' + mm.toString()

	yyyy = dt.getFullYear()

	return yyyy + "" + mm + "" + dd
}


var getTimeinHHMMSS = function (dt) {
	var hh, mm, ss

	hh = dt.getHours()
	if (hh < 10) hh = '0' + hh.toString()

	mm = dt.getMinutes()
	if (mm < 10) mm = '0' + mm.toString()

	ss = dt.getSeconds()
	if (ss < 10) ss = '0' + ss.toString()

	return hh + ":" + mm + ":" + ss
}



var deg2rad = function (deg) {
	return deg * (Math.PI / 180)
}

var getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2 - lat1);  // deg2rad below
	var dLon = deg2rad(lon2 - lon1);
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2)
		;
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Distance in km
	return d;
}


var getLastLocDatetime = function () {
	if (localStorage.getItem("lastLocSavedDtt") != null) {
		return new Date(localStorage.getItem("lastLocSavedDtt"))
	} else {
		return 0
	}

	var locs = localStorage.getItem("TRACKING");
	if (locs != null) {
		locs = locs.split(',');
	} else {
		return 0;
	}
	return lastRecDt = new Date(locs[locs.length - 4])
}



// var getLastLocLocation = function(){

// 	var locs = localStorage.getItem("TRACKING");
// 	if (locs != null) {
// 		locs = locs.split(',');
// 	} else {
// 		return 0;
// 	}
// 	var lstLOC = {}
// 	lstLOC.latitude = locs[locs.length - 3]
// 	lstLOC.longitude = locs[locs.length - 2]
// 	lstLOC.accuracy = locs[locs.length - 1]
// 	return lstLOC
// }



var checkElapsedTimeFromLastGeoTracking = function (dt) {
	if (localStorage.getItem("lastLocSavedDtt") != null) {
		var ldtt = new Date(localStorage.getItem("lastLocSavedDtt"))

		var diff = dt.getTime() - ldtt.getTime();
		return diff / 1000;;
	}
	else {
		return 0;
	}



	// var locs = localStorage.getItem("TRACKING");
	// if (locs != null) {
	// 	locs = locs.split(',');
	// } else {
	// 	return 0;
	// }
	// var lastRecDt = new Date(locs[locs.length - 4])
	// var diff = dt.getTime() - lastRecDt.getTime();

	// //returning  in seconds
	// return diff / 1000;
}

var delLocalTrackingData = function () {


}


var checkDateIfEarlierThanTodayFromLastGeoTracking = function (dt) {
	var _MS_PER_DAY = 1000 * 60 * 60 * 24;

	var locs = localStorage.getItem("TRACKING");
	if (locs != null) {
		locs = locs.split(',');
	} else {
		return "false";
	}
	var lastRecDt = new Date(locs[locs.length - 4])


	if (getDateinYYYYMMDD(dt) > getDateinYYYYMMDD(lastRecDt)) {
		return 'true'
	} else {
		return 'false'
	}

	diffTime = Math.abs(lastRecDt - dt);

	diffDays = Math.ceil(diffTime / _MS_PER_DAY);

	if (diffDays >= 1) {
		//last punch more than 1 day old
		return "true"
	} else {
		//last punch less than 1 day old (24hrs), but
		// it could be earler date say of late night and today morning
		if (lastRecDt.getDate() != dt.getDate()) {
			return "true"
		} else {
			//last punch is of today only
			return "false"
		}
	}

}



var checkElapsedTimeFromLastHB = function (dt) {
	var lastHB = localStorage.getItem("HEARTBEAT");
	if (lastHB == null) {
		return 0;
	}
	var lastHBDt = new Date(lastHB)
	var diff = dt.getTime() - lastHBDt.getTime();

	//returning  in seconds
	return diff / 1000;
}



var saveKIllTIme = function (frmDt, frmTm, toDt, toTm, arrObj) {
	var fd = new FormData();

	fd.append("empId", sessionStorage.getItem("empId"))
	fd.append("empCode", sessionStorage.getItem("empCode"))
	fd.append("frmDt", frmDt)
	fd.append("toDt", toDt)
	fd.append("frmTm", frmTm)
	fd.append("toTm", toTm)

	$.ajax({
		url: baseURL + '/api/signin/saveHeartBeatRecords.spr',
		data: fd,
		processData: false,
		contentType: false,
		type: 'POST',
		headers: {
			'Authorization': 'Bearer ' + jwtByHRAPI
		},
		success: function (success) {

			if (success.clientResponseMsg != "OK") {
				console.log("Kill time Saving error : " + success.clientResponseMsg)
			} else {
				console.log(" kill time  saved")
				if (arrObj === "false") {
					//do nothing
				} else {
					//remove object from arrqay
					removeAppKillObjectFromUnsavedData(arrObj)
				}
			}
			//alert("kill tim esaved")

		},
		error(err) {
			// save this data in localstroage for later saving
			//
			if (arrObj === "false") {
				saveUnsavedAppKilledDataLocally(frmDt, toDt, frmTm, toTm)
			} else {
				//it is from retry so already in the unsaaveddata array
			}

			console.log("killdata saving error " + frmDt + "  " + frmTm)
		}
	});

}


var saveGeoTrackingLocation = function (dt, loc, arrObj) {
	var fd = new FormData();
	var pdate = getDateinDDMMYYYY(dt)
	var ptime = getTimeinHHMMSS(dt)


	if (loc === undefined || loc.latitude === undefined || loc.longitude === undefined) {
		logDebug("Location is underfined for slot " + pdate + " " + ptime + "<br>")
		retrun
	}


	fd.append("gtlId", 0);
	fd.append("empId", sessionStorage.getItem("empId"));
	fd.append("empCode", sessionStorage.getItem("empCode"));
	fd.append("punchTime", ptime);
	fd.append("punchDate", pdate);
	fd.append("latitude", loc.latitude);
	fd.append("longitude", loc.longitude);
	fd.append("accuracy", loc.accuracy);

	$.ajax({
		url: baseURL + '/api/signin/saveGeoTrackingLocations.spr',
		data: fd,
		processData: false,
		contentType: false,
		type: 'POST',
		headers: {
			'Authorization': 'Bearer ' + jwtByHRAPI
		},
		success: function (success) {
			if (success.clientResponseMsg != "OK") {
				console.log(" Location Saving error : " + success.clientResponseMsg)
				logDebug("Location saving error " + pdate + " " + ptime)

			} else {
				console.log(" Location saved for slot " + pdate + " " + ptime)
				if (arrObj === "false") {
					//do nothing
				} else {
					//remove object from arrqay
					logDebug("removing arrobj from unsaved loc data " + pdate + " " + ptime)
					removeObjectFromUnsavedData(arrObj)
				}
			}
		},
		error(err) {
			//save data if failed to unsaveddatalocally
			// but only if it was not a retry i.e arrObj == false
			if (arrObj === "false") {
				saveUnsavedGeoDataLocally(dt, loc)
				logDebug("Saving unsaved loc data for " + pdate + " " + ptime)
			} else {
				//it is from retry so already in the unsaaveddata array
			}
			console.log("GTL saving error " + pdate + "  " + ptime)
			logDebug("Location saving error to hrapi " + pdate + " " + ptime)

		}
	});

}

var doLocationRegisterManual = function () {
	cordova.plugins.locationAccuracy.request(function (success) {
		//                console.log("Successfully requested accuracy: " + success.message);
		navigator.geolocation.getCurrentPosition(currentLocSuccess, currentLocError, {
			maximumAge: 3000,
			timeout: 5000,
			enableHighAccuracy: true
		});
	}, function (error) {
		//                console.log("Accuracy request failed: error code=" + error.code + "; error message=" + error.message);
		if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
			if (window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")) {
				cordova.plugins.diagnostic.switchToLocationSettings();
			}
		}
		console.log("err " + error.code)
		currentLocError();
	}, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);

	var currentLocSuccess = function (position) {
		lat = position.coords.latitude
		lon = position.coords.longitude
		console.log("manual call for locaiton :" + lat + "  " + lon)
		var location = {}
		location.latitude = position.coords.latitude
		location.longitude = position.coords.longitude
		location.accuracy = 1

		doLocationRegister(location, "true")
		showAlert("Current Location saved.")
		return

	}

	var currentLocError = function (position) {

		console.log("curr loc error " + position.code)
		return "false"

	}

}

function myEventCallback() {
	// timer event fired\
	//keepSessionAlive('12/12/2001', '12/12/2001', 3) 



	dt = new Date()
	if (GeoTrackingON_OFF == "OFF") {
		window.BackgroundTimer.stop(successCallback, errorCallback);
		GeoTrackingTimerStarted = "false"
		return
	}

	if (dt.getHours() == 23 && dt.getMinutes() >= 30) {
		// 			//time is over 11:30 pm, stop geo trackking
		// 			// last location was not today, it may be of yesterday or earlier -  no need to check this as 
		//			dashborad and selfservice page they do if no clock in they makeit off
		// 			//then also stop tracking
		// makeGeoTrackingLocCaptureON_OFF("OFF")
	}



	GeoTrackingCounter++;

	console.log("HB " + dt)

	//  if ((dt.getHours()=23 && dt.getMinutes() >=30)
	// 			|| checkDateIfEarlierThanTodayFromLastGeoTracking(dt) ){
	// 			//time is over 11:30 pm, stop geo trackking
	// 			// last location was not today, it may be of yesterday or earlier
	// 			//then also stop tracking
	// 			makeGeoTrackingLocCaptureON_OFF("OFF")

	// }

	//check if last stored heartbeat is more than heartBeatIntervalInMinutes
	//then save kill app data
	diffHb = checkElapsedTimeFromLastHB(dt)

	if (diffHb > gi_heartBeatIntervalInMinutes * 60) {
		lastHB = localStorage.getItem("HEARTBEAT")
		var lastHBDt = new Date(lastHB)
		frmdt = getDateinDDMMYYYY(lastHBDt)
		frmtm = getTimeinHHMMSS(lastHBDt)
		todt = getDateinDDMMYYYY(dt)
		totm = getTimeinHHMMSS(dt)
		saveKIllTIme(frmdt, frmtm, todt, totm, "false")

	}

	localStorage.setItem("HEARTBEAT", dt)

	hbs = localStorage.getItem("HEARTBEAT_LOG")
	if (hbs == null) {
		localStorage.setItem("HEARTBEAT_LOG", dt)
	} else {
		localStorage.setItem("HEARTBEAT_LOG", hbs + " *** " + dt)
	}

}

function mySuccessCallback() {
	// timer plugin configured successfully
	console.log("TIMER STARTED")
}

function myErrorCallback(e) {
	// an error occurred
	console.log("TIMER NOT STARTED")
}


function getGeoTrackingEndTimeHours() {
	return eval(GeoTrackingEndTime.substring(0, 2))
}

function getGeoTrackingEndTimeMinutes() {
	return eval(GeoTrackingEndTime.substring(3, 5))
}

function heartBeatFunction() {

	if (GeoTrackingON_OFF == "OFF") {
		return
	}



	GeoTrackingCounter++;
	dt = new Date()
	console.log("HB " + dt)

	if ((dt.getHours() == getGeoTrackingEndTimeHours() && dt.getMinutes() >= getGeoTrackingEndTimeMinutes())
		|| checkDateIfEarlierThanTodayFromLastGeoTracking(dt) == "true") {
		// 			//time is over 11:30 pm, stop geo trackking
		// 			// last location was not today, it may be of yesterday or earlier
		// 			//then also stop tracking
		if (gstr_odd_even_punches == "EVEN") {
			makeGeoTrackingLocCaptureON_OFF("OFF")
		}

	}

	//check if last stored heartbeat is more than heartBeatIntervalInMinutes
	//then save kill app data
	diffHBtemp = checkElapsedTimeFromLastHB(dt)

	if (diffHBtemp > gi_heartBeatIntervalInMinutes * 60 * 1000) {
		lastHB = localStorage.getItem("HEARTBEAT")
		var lastHBDt = new Date(lastHB)
		frmdt = getDateinDDMMYYYY(lastHBDt)
		frmtm = getTimeinHHMMSS(lastHBDt)
		todt = getDateinDDMMYYYY(dt)
		totm = getTimeinHHMMSS(dt)
		saveKIllTIme(frmdt, frmtm, todt, totm, "false")

	}

	localStorage.setItem("HEARTBEAT", dt)
	setTimeout(heartBeatFunction, gi_heartBeatIntervalInMinutes * 60 * 1000);
}


var makeGeoTrackingLocCaptureON_OFF = function (on_off) {

	GeoTrackingON_OFF = on_off

	dt = new Date()
	if (dt.getHours() >= getGeoTrackingEndTimeHours() + 1) {
		if (gstr_odd_even_punches == "EVEN") {
			GeoTrackingON_OFF = "OFF"
		}

	}
	if ((dt.getHours() == getGeoTrackingEndTimeHours() && dt.getMinutes() >= getGeoTrackingEndTimeMinutes())
		|| checkDateIfEarlierThanTodayFromLastGeoTracking(dt) == "true") {
		if (gstr_odd_even_punches == "EVEN") {
			GeoTrackingON_OFF = "OFF"
		}
	}



	if (GeoTrackingON_OFF == "OFF") {
		localStorage.removeItem("TRACKING")
		localStorage.removeItem("HEARTBEAT")
		localStorage.removeItem("HEARTBEAT_LOG")
		localStorage.removeItem("lastLocSavedDtt")
		//localStorage.removeItem("DEBUG_LOG")

		//makeBGGEOPluginStop()

	}
	// else{
	// 	// lets get manula locaion
	// 	if (BG_SERVICE_STARTED == "true"){
	// 		getManualLocation()
	// 	}else{
	// 		enableGeoTrackingInBackground()
	// 	}
	// }
}




var enableGeoTrackingInBackground = function () {

	if (GeoTrackingON_OFF == "OFF") {
		//makeGeoTrackingLocCaptureON_OFF("OFF")		
		//return
	}
	// 1.  Listen to events
	var bgGeo = window.BackgroundGeolocation;

	bgGeo.onLocation(function (location) {
		console.log('[location] -', location);

		doLocationRegister(location.coords, "false")

	});

	bgGeo.onMotionChange(function (event) {
		//getManualLocation()
		logDebug("MOTION CHANGE " + new Date())

		///doLocationRegister(event.location.coords,"false")

		//console.log('[motionchange] -', event.isMoving, event.location);
	});

	bgGeo.onHeartbeat(heartbeatEvent => {
		//getManualLocation()
		//doLocationRegister(heartbeatEvent.location.coords,"false")
		saveHBLOG()
		console.log("[heartbeat] ", heartbeatEvent);
	});

	bgGeo.onHttp(function (response) {
		//console.log('[http] - ', response.success, response.status, response.responseText);
	});

	bgGeo.onProviderChange(function (event) {
		//getManualLocation()
		//console.log('[providerchange] -', event.status, event.enabled, event.gps, event.network);
	});

	if (BG_SERVICE_STARTED == "false") {
		// 2. Execute #ready method:
		bgGeo.ready({
			reset: true,
			debug: false,
			logLevel: bgGeo.LOG_LEVEL_VERBOSE,
			desiredAccuracy: bgGeo.DESIRED_ACCURACY_HIGH,
			distanceFilter: 10,
			foregroundService: true,// Prevent Android from terminating service due to memory pressure from other apps.
			heartbeatInterval: 60,  // <-- heartbeat event every 120s
			autoSync: false,
			stopOnTerminate: false,
			startOnBoot: true,
			backgroundPermissionRationale: {
				title: "Allow {applicationName} to access to this device's location in the background?",
				message: "In order to track your activity in the background, please enable {backgroundPermissionOptionLabel} location permission",
				positiveAction: "Change to {backgroundPermissionOptionLabel}",
				negativeAction: "Cancel"
			}
		}, function (state) {    // <-- Current state provided to #configure callback
			// 3.  Start tracking
			console.log('BackgroundGeolocation is configured and ready to use');
			BG_SERVICE_STARTED = "true"
			serviceEnabledNow = "true"

			if (!state.enabled) {
				bgGeo.start().then(function () {

					console.log('- BackgroundGeolocation tracking started');
				});
			}
		});

	}
	// if (serviceEnabledNow == "true"){
	// 		setTimeout(
	// 			getManualLocation()
	// 		,1000);
	// 		serviceEnabledNow  = "false"
	// }



	// NOTE:  Do NOT execute any API methods which will access location-services
	// until the callback to #ready executes!
	//
	// For example, DO NOT do this here:
	//
	// bgGeo.getCurrentPosition();   // <-- NO!
	// bgGeo.start();                // <-- NO!

}

var makeBGGEOPluginStop = function () {
	var bgGeo = window.BackgroundGeolocation;
	bgGeo.stop().then(function () {
		//alert("BGGEO STOPPED")
		BG_SERVICE_STARTED = "false"
		console.log('- BackgroundGeolocation tracking STOPPED');
	});
}


var saveHBLOG = function () {
	dt = new Date()
	hbs = localStorage.getItem("HEARTBEAT_LOG")
	if (hbs == null) {
		localStorage.setItem("HEARTBEAT_LOG", dt)
	} else {
		localStorage.setItem("HEARTBEAT_LOG", hbs + " *** " + dt)
	}
}



var manualLocSucc = function (position) {
	console.log("Manual Location success " + new Date())
	logDebug("MANUAL LOCATTON " + new Date())

	doLocationRegister(position.coords)

}

var manualLocErr = function () {
	console.log("Manual Location error " + new Date())
}


var getManualLocation = function (loc) {
	// if (GeoTrackingON_OFF == "OFF"){
	// 	return
	// }

	if (loc) {
		manualLocSucc(loc)
		return
	}
	if (device.platform === 'Android') {
		LocationServices.getCurrentPosition(manualLocSucc, manualLocErr, {
			maximumAge: 3000,
			timeout: 5000,
			enableHighAccuracy: true
		});
	} else {
		navigator.geolocation.getCurrentPosition(manualLocSucc, manualLocErr, {
			maximumAge: 3000,
			timeout: 5000,
			enableHighAccuracy: true
		});
	}

	//window.BackgroundGeolocation.getCurrentPosition()

	// bgGeo.getCurrentPosition({
	// 	maximumAge: 3000,
	// 	timeout: 5000,
	// 	enableHighAccuracy: true
	// },locsucc, locerr);


	// 	var locsucc = function (position) {
	// 		console.log("MANULA LOC SUCC")
	// 	}

	// 	var locerr = function (err) {
	// 		console.log("MANULA LOC ERR")


	// 	}

}





var enableGeoTrackingInBackground_OLD = function () {

	if (GeoTrackingEnabled != "false") {
		//alert("already background started")
		return
	}

	GeoTrackingEnabled = "true"

	BackgroundGeolocation.configure({
		locationProvider: BackgroundGeolocation.RAW_PROVIDER,
		desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
		stationaryRadius: 0,
		distanceFilter: 0,
		notificationTitle: 'Geo Tracking',
		notificationText: 'enabled',
		startOnBoot: true,
		debug: true,
		interval: 120000,
		fastestInterval: 60000,
		activitiesInterval: 30000,
		stopOnStillActivity: false,

	});



	// url: 'http://192.168.81.15:3000/location',
	// 	httpHeaders: {
	// 		'X-FOO': 'bar'
	// 	},
	// 	// customize post properties
	// 	postTemplate: {
	// 		lat: '@latitude',
	// 		lon: '@longitude',
	// 		foo: 'bar' // you can also add your own properties
	// 	}


	BackgroundGeolocation.on('location', function (location) {
		return
		// handle your locations here
		// to perform long running operation on iOS
		// you need to create background task

		//const myTimeout = setTimeout(myGreeting, 5000);
		if (GeoTrackingON_OFF == "OFF") {
			localStorage.removeItem("TRACKING")
			return;
		}

		if (GeoTrackingTimerStarted == 'false') {

			startBackgroundTimer()

			//setTimeout(heartBeatFunction, gi_heartBeatIntervalInMinutes * 60 * 1000);

			GeoTrackingTimerStarted = 'true'
		}



		BackgroundGeolocation.startTask(function (taskKey) {

			// execute long running task
			// eg. ajax post location
			// IMPORTANT: task has to be ended by endTask
			doLocationRegister(location, "false")

			BackgroundGeolocation.endTask(taskKey);

		});
	});

	BackgroundGeolocation.on('stationary', function (stationaryLocation) {
		// handle stationary locations here
	});

	BackgroundGeolocation.on('error', function (error) {
		console.log('[ERROR] BackgroundGeolocation error:', error.code, error.message);
		localStorage.setItem("gterror", error.code + "  " + error.mesage)
	});

	BackgroundGeolocation.on('start', function () {
		console.log('[INFO] BackgroundGeolocation service has been started');
	});

	BackgroundGeolocation.on('stop', function () {
		console.log('[INFO] BackgroundGeolocation service has been stopped');
	});

	BackgroundGeolocation.on('authorization', function (status) {
		console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
		if (status !== BackgroundGeolocation.AUTHORIZED) {
			// we need to set delay or otherwise alert may not be shown
			setTimeout(function () {
				var showSettings = confirm('App requires location tracking permission. Would you like to open app settings?');
				if (showSettings) {
					return BackgroundGeolocation.showAppSettings();
				}
			}, 1000);
		}
	});

	BackgroundGeolocation.on('background', function () {
		console.log('[INFO] App is in background');
		// you can also reconfigure service (changes will be applied immediately)
		BackgroundGeolocation.configure({ debug: false });
	});

	BackgroundGeolocation.on('foreground', function () {
		console.log('[INFO] App is in foreground');
		BackgroundGeolocation.configure({ debug: false });
	});

	BackgroundGeolocation.on('abort_requested', function () {
		console.log('[INFO] Server responded with 285 Updates Not Required');

		// Here we can decide whether we want stop the updates or not.
		// If you've configured the server to return 285, then it means the server does not require further update.
		// So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
		// But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
	});

	BackgroundGeolocation.on('http_authorization', () => {
		console.log('[INFO] App needs to authorize the http requests');
	});

	BackgroundGeolocation.checkStatus(function (status) {

		console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
		console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
		console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

		// y ou don't need to check status before start (this is just the example)
		if (!status.isRunning) {
			BackgroundGeolocation.start(); //triggers start on start event
		}
	});

	// you can also just start without checking for status
	// BackgroundGeolocation.start();

	// Don't forget to remove listeners at some point!
	// BackgroundGeolocation.removeAllListeners();
}

geocodeLatLng = function (geocoder, map, infowindow, lat, lng) {
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
				
				infowindow.setContent("Address Not Available");
				$scope.formatted_address = null
			}
		} else {
			
			infowindow.setContent("Address Not Available");
			$scope.formatted_address = null
		}
	});
}


function startBackgroundTimer() {

	var timerSettings = {
		timerInterval: gi_heartBeatIntervalInMinutes * 60 * 1000, // interval between ticks of the timer in milliseconds (Default: 60000)
		startOnBoot: true, // enable this to start timer after the device was restarted (Default: false)
		stopOnTerminate: true, // set to true to force stop timer in case the app is terminated (User closed the app and etc.) (Default: true)

		hours: -1, // delay timer to start at certain time (Default: -1)
		minutes: -1, // delay timer to start at certain time (Default: -1)
	}

	window.BackgroundTimer.onTimerEvent(myEventCallback); // subscribe on timer event
	// timer will start at 12:00
	window.BackgroundTimer.start(mySuccessCallback, myErrorCallback, timerSettings);

}



var createSlotsOfMinutes = function (slotMin) {
	garr_GT_Slots.length = 0
	var stTm = "12:00"
	var vhileRun = true
	var dttemp = new Date()
	var dtNow = new Date()

	dttemp.setHours(0)
	dttemp.setMinutes(0)
	dttemp.setSeconds(0)

	// dtNow.setHours(23)
	// dtNow.setMinutes(59)
	// dtNow.setSeconds(59)

	dtNow.setHours(getGeoTrackingEndTimeHours())
	dtNow.setMinutes(getGeoTrackingEndTimeMinutes() + 1)
	dtNow.setSeconds(0)
	var ctrSlots = 0

	garr_GT_Slots[0] = dttemp
	//vhileRun = false
	while (vhileRun) {
		ctrSlots++
		dttemp = new Date(dttemp.getTime() + slotMin * 60 * 1000)
		if (dttemp > dtNow) {
			vhileRun = false
		} else {
			garr_GT_Slots[ctrSlots] = dttemp
		}


	}
}


var getUnsavedGeoDataLocally = function () {
	var unSavedGeoData = localStorage.getItem("UNSAVED_GEO_DATA");
	if (unSavedGeoData != null) {
		jsonArr = JSON.parse(localStorage.getItem("UNSAVED_GEO_DATA"))
		return jsonArr;
	} else {
		return 0
	}
}


var getUnsavedaPPkILLDataLocally = function () {
	var unSavedGaPPkILLData = localStorage.getItem("UNSAVED_APPKILL_DATA");
	if (unSavedGaPPkILLData != null) {
		jsonArr = JSON.parse(localStorage.getItem("UNSAVED_APPKILL_DATA"))
		return jsonArr;
	} else {
		return 0
	}
}

var saveUnsavedGeoDataLocally = function (dt, loc) {

	var unSavedGeoData = localStorage.getItem("UNSAVED_GEO_DATA");
	var usLog = localStorage.getItem("UNSAVED_LOG");

	var obj = {}

	obj.dt = dt
	obj.loc = loc

	if (unSavedGeoData == null) {
		jsonArr = []
		jsonArr[0] = obj
		localStorage.setItem("UNSAVED_GEO_DATA", JSON.stringify(jsonArr))
	} else {
		jsonArr = JSON.parse(localStorage.getItem("UNSAVED_GEO_DATA"))
		jsonArr[jsonArr.length] = obj
		localStorage.setItem("UNSAVED_GEO_DATA", JSON.stringify(jsonArr))
		//localStorage.setItem("UNSAVED_GEO_DATA", unSavedGeoData + ',' + empid + ',' + empcode + ',' + tm + ',' + dt + ',' + lat + ',' + lng + ',' + acc  )
	}

	if (usLog == null) {
		localStorage.setItem("UNSAVED_LOG", "**" + dt)
	} else {
		localStorage.setItem("UNSAVED_LOG", usLog + "**" + dt)
	}


}




var saveUnsavedAppKilledDataLocally = function (frmDt, toDt, frmTm, toTm) {

	var unSavedAKData = localStorage.getItem("UNSAVED_APPKILL_DATA");


	var obj = {}

	obj.frmDt = frmDt
	obj.toDt = toDt
	obj.frmTm = frmTm
	obj.toTm = toTm

	if (unSavedAKData == null) {
		jsonArr = []
		jsonArr[0] = obj
		localStorage.setItem("UNSAVED_APPKILL_DATA", JSON.stringify(jsonArr))
	} else {
		jsonArr = JSON.parse(localStorage.getItem("UNSAVED_APPKILL_DATA"))
		jsonArr[jsonArr.length] = obj
		localStorage.setItem("UNSAVED_APPKILL_DATA", JSON.stringify(jsonArr))
	}
}


var RetryToCloudUnsavedGeoData = function () {

	// if (checkConnection() == "false"){
	// 	return
	// }


	jsonArr = getUnsavedGeoDataLocally()
	if (jsonArr == 0 || jsonArr.length == 0) {
		// do nothing
	} else {

		for (i = 0; i < jsonArr.length; i++) {

			obj = jsonArr[i]
			if (obj === undefined) {
				continue
			}
			setTimeout(saveGeoTrackingLocation(new Date(obj.dt), obj.loc, obj),
				(i + 1) * 0.5 * 1000);

		}
	}



	jsonArrkLL = getUnsavedaPPkILLDataLocally()
	if (jsonArrkLL == 0 || jsonArrkLL.length == 0) {
		//do nothing
	} else {

		for (i = 0; i < jsonArrkLL.length; i++) {

			obj = jsonArrkLL[i]
			if (obj === undefined) {
				continue
			}
			setTimeout(saveKIllTIme(obj.frmDt, obj.frmTm, obj.toDt, obj.toTm, obj),
				(jsonArr.length + i + 1) * 2 * 1000);
			//saveKIllTIme(obj.frmDt,obj.frmTm,obj.toDt,obj.toTm,obj)
		}
	}
}



var removeObjectFromUnsavedData = function (arroObj) {

	
	jsonArr = getUnsavedGeoDataLocally()
	for (var k = 0; k < jsonArr.length; k++) {
		if (jsonArr[k].dt == arroObj.dt &&
			jsonArr[k].loc.latitude == arroObj.loc.latitude &&
			jsonArr[k].loc.longitude == arroObj.loc.longitude) {

			jsonArr.splice(k, 1)
		}
	}

	localStorage.setItem("UNSAVED_GEO_DATA", JSON.stringify(jsonArr))
}



var removeAppKillObjectFromUnsavedData = function (arroObj) {

	jsonArr = getUnsavedaPPkILLDataLocally()
	for (var k = 0; k < jsonArr.length; k++) {
		if (jsonArr[k].frmDt == arroObj.frmDt &&
			jsonArr[k].toDt == arroObj.toDt &&
			jsonArr[k].frmTm == arroObj.frmTm &&
			jsonArr[k].toTm == arroObj.toTm) {

			jsonArr.splice(k, 1)
		}
	}

	localStorage.setItem("UNSAVED_APPKILL_DATA", JSON.stringify(jsonArr))
}



var checkConnection = function () {
	var networkState = navigator.connection.type;

	var states = {};
	states[Connection.UNKNOWN] = 'Unknown connection';
	states[Connection.ETHERNET] = 'Ethernet connection';
	states[Connection.WIFI] = 'WiFi connection';
	states[Connection.CELL_2G] = 'Cell 2G connection';
	states[Connection.CELL_3G] = 'Cell 3G connection';
	states[Connection.CELL_4G] = 'Cell 4G connection';
	states[Connection.CELL] = 'Cell generic connection';
	states[Connection.NONE] = 'No network connection';

	if (networkState == states[Connection.CELL] ||
		networkState == states[Connection.CELL_4G] ||
		networkState == states[Connection.WIFI]) {
		return "true"
	} else {
		return "false"
	}
}


var logDebug = function (msg) {
	var debugLog = localStorage.getItem("DEBUG_LOG")
	if (debugLog == null) {
		localStorage.setItem("DEBUG_LOG", msg)
	} else {
		localStorage.setItem("DEBUG_LOG", debugLog + "<br>" + msg)
	}

}



var doLocationRegister = function (location, isManual) {


	dt = new Date();

	if (dt.getHours() >= getGeoTrackingEndTimeHours() + 1) {
		if (gstr_odd_even_punches == "EVEN") {
			makeGeoTrackingLocCaptureON_OFF("OFF")
			return
		}

	}
	if ((dt.getHours() == getGeoTrackingEndTimeHours() && dt.getMinutes() >= getGeoTrackingEndTimeMinutes())
		|| checkDateIfEarlierThanTodayFromLastGeoTracking(dt) == "true") {
		// 			//time is over  06:30 pm, stop geo trackking
		// 			// last location was not today, it may be of yesterday or earlier
		// 			//then also stop tracking
		if (gstr_odd_even_punches == "EVEN") {
			makeGeoTrackingLocCaptureON_OFF("OFF")
			return
		}
	}

	var lastLocLocation = {}
	var lastLocDt = 0
	var strtm = getDateinDDMMYYYY(dt) + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds()

	if (GeoTrackingON_OFF == "OFF") {
		console.log("GT is OFF")
		return
	}


	if (localStorage.getItem("lastLocSavedDtt") != null) {
		var lastLocDt = new Date(localStorage.getItem("lastLocSavedDtt"))
		if ((dt - lastLocDt) / 1000 < 90) {
			return
		}

		lastLocLocation.latitude = localStorage.getItem("LastKnownLat")
		lastLocLocation.longitude = localStorage.getItem("LastKnownLng")
		lastLocLocation.accuracy = localStorage.getItem("LastKnownAcc")
	} else {
		//as GeoTrackingON_OFF is ON, here it should take first punch time as lastLocSavedDtt
		localStorage.setItem("lastLocSavedDtt", dt)
		localStorage.setItem("LastKnownLat", location.latitude)
		localStorage.setItem("LastKnownLng", location.longitude)
		localStorage.setItem("LastKnownAcc", location.accuracy)

		locs = localStorage.getItem("TRACKING")
		if (locs == null) {
			localStorage.setItem("TRACKING", dt + ',' + + location.latitude + ',' + location.longitude + "," + location.accuracy)
		} else {
			localStorage.setItem("TRACKING", locs + "," + dt + ',' + + location.latitude + ',' + location.longitude + "," + location.accuracy)
		}
		return
	}

	console.log("Step1 GotLocaton " + strtm + "  fnstart ")
	logDebug("Step1 GotLocaton " + strtm + "  fnstart ")
	// save location of slots available froom now to lastsaved datetime
	var LastLocstrtm = getDateinDDMMYYYY(lastLocDt) + " " + lastLocDt.getHours() + ":" + lastLocDt.getMinutes() + ":" + lastLocDt.getSeconds()
	console.log("Step2 lastLocDt = " + LastLocstrtm)
	logDebug("Step2 lastLocDt = " + LastLocstrtm)

	var slotStrtm
	for (var i = 0; i < garr_GT_Slots.length; i++) {
		tmpSlot = new Date(garr_GT_Slots[i].getTime() - (1.5 * 1000)) // as there is mililsecionds error in > comparision
		if (tmpSlot > lastLocDt && garr_GT_Slots[i] <= dt) {
			slotStrtm = getDateinDDMMYYYY(garr_GT_Slots[i]) + " " + garr_GT_Slots[i].getHours() + ":" + garr_GT_Slots[i].getMinutes() + ":" + garr_GT_Slots[i].getSeconds()

			console.log("Step3  saving location of slot " + slotStrtm)
			logDebug("Step3  saving location of slot " + slotStrtm + "<br>")

			localStorage.setItem("lastLocSavedDtt", dt)
			localStorage.setItem("LastKnownLat", location.latitude)
			localStorage.setItem("LastKnownLng", location.longitude)
			localStorage.setItem("LastKnownAcc", location.accuracy)

			saveGeoTrackingLocation(garr_GT_Slots[i], lastLocLocation, "false")

			if (new Date(garr_GT_Slots[i].getTime() > dt)) {
				//break;
			}
		}
	}

	if (dt > new Date(garr_GT_Slots[garr_GT_Slots.length - 1])) {
		// all slots filed
		//makeBGGEOPluginStop()
	}


	/*
	 localStorage.setItem("lastLocSavedDtt",dt)
	 localStorage.setItem("LastKnownLat",location.latitude)
	 localStorage.setItem("LastKnownLng",location.longitude)
	 localStorage.setItem("LastKnownAcc",location.accuracy)
	 */
	//console.log( '[GOT LOCATION]   ' + dt+ " " + location.latitude + ' ' + location.longitude);
	locs = localStorage.getItem("TRACKING")
	if (locs == null) {
		localStorage.setItem("TRACKING", dt + ',' + + location.latitude + ',' + location.longitude + "," + location.accuracy)
	} else {
		localStorage.setItem("TRACKING", locs + "," + dt + ',' + + location.latitude + ',' + location.longitude + "," + location.accuracy)
	}

	RetryToCloudUnsavedGeoData()
}




// var doLocationRegisterOLDBEFOREAJAYLOGIC = function(location,isManual){

// 	dt = new Date();
// 	localStorage.setItem("HEARTBEAT", dt)

// 	var strtm = dt.getHours() + ":" +  dt.getMinutes() + ":" + dt.getSeconds()

// 	console.log( '[GOT LOCATION]   ' + dt+ " " + location.latitude + ' ' + location.longitude);
// 	locs = localStorage.getItem("TRACKING")

// 	var lastLocDt = getLastLocDatetime();
// 	var lastLocLocation = getLastLocLocation();
// 	var diffLoc = checkElapsedTimeFromLastGeoTracking(dt)


// 	if (locs == null) {
// 		localStorage.setItem("TRACKING", dt + ',' + + location.latitude + ',' + location.longitude +"," + location.accuracy)
// 	} else {
// 		localStorage.setItem("TRACKING", locs + "," + dt + ',' + + location.latitude + ',' + location.longitude + "," + location.accuracy)
// 	}



// 	// if (diffLoc < (GeoTrackingIntervalInMinutes*60) && diffLoc > 0 ){
// 	// 	BackgroundGeolocation.endTask(taskKey);
// 	// 	return
// 	// }

// 	if (lastLocDt == 0){
// 		//there is no saved location in cloud db
// 		lastLocDt = dt
// 		localStorage.setItem("lastLocSavedDtt",dt)
// 	}


// 	//find from slotsMin, how many slots fall in and save locaiton for 
// 	// those many slots

// 	var missingSlotsCtr = 0
// 	var missingSlotsCtrDone = 0
// 	if (lastLocDt != 0){
// 		for (var i=0;i< garr_GT_Slots.length;i++ ){
// 			tmpSlot = new Date(garr_GT_Slots[i].getTime() - (60 * 1000)) // as there is mililsecionds error in > comparision
// 			if ( tmpSlot > lastLocDt && garr_GT_Slots[i] <= dt){
// 				missingSlotsCtr++
// 			}				
// 		}

// 		if (missingSlotsCtr == 0 && isManual == "true"){
// 			saveGeoTrackingLocation(dt,location,"false")
// 			localStorage.setItem("lastLocSavedDtt",dt)
// 			RetryToCloudUnsavedGeoData()
// 			return
// 		}

// 		for (var i=0;i< garr_GT_Slots.length;i++ ){
// 			tmpSlot = new Date(garr_GT_Slots[i].getTime() - (60 * 1000)) // as there is mililsecionds error in > comparision
// 			if ( tmpSlot > lastLocDt && garr_GT_Slots[i] <= dt){
// 				missingSlotsCtrDone++
// 				if (missingSlotsCtr == missingSlotsCtrDone){
// 					saveGeoTrackingLocation(garr_GT_Slots[i],location,"false")
// 					localStorage.setItem("lastLocSavedDtt",garr_GT_Slots[i])
// 					RetryToCloudUnsavedGeoData()
// 					break;
// 				}else{
// 					saveGeoTrackingLocation(garr_GT_Slots[i],lastLocLocation,"false")
// 				}
// 			}				
// 		}

// 		// if (missingSlotsCtr > 0){
// 		// 	localStorage.setItem("lastLocSavedDtt",dt)
// 		// }
// 	}

// }


var keepSessionAlive = function (fromDate, toDate, empId) {


	var tmfd = new FormData();
	tmfd.append('fromDate', fromDate)
	tmfd.append('empId', empId)
	tmfd.append('toDate', toDate)
	//url: "${pageContext.request.contextPath}/attendance/odApplication/getAppliedOdDetails.spr",
	$.ajax({
		url: baseURL + '/api/signin/getPunchDetails.spr',
		data: tmfd,
		type: 'POST',
		dataType: 'json',
		timeout: commonRequestTimeout,
		contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
		processData: false, // NEEDED, DON'T OMIT THIS
		headers: {
			'Authorization': 'Bearer ' + jwtByHRAPI
		},
		success: function (result1) {

			result1.htmlPunchesStr = result1.htmlPunchesStr.replace("<br>", "")
			console.log("SESSIONTIMER " + result1.htmlPunchesStr + "   " + dt)


		},
		error: function (res) {

			console.log(res.status);

		}
	});

}







