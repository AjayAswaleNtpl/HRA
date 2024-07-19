/*var appAvailability = {
    
    check: function(urlScheme, successCallback, errorCallback) {
        cordova.exec(
            successCallback,
            errorCallback,
            "AppAvailability",
            "checkAvailability",
            [urlScheme]
        );
    },
    
    checkBool: function(urlScheme, callback) {
        cordova.exec(
            function(success) { callback(success); },
            function(error) { callback(error); },
            "AppAvailability",
            "checkAvailability",
            [urlScheme]
        );
    }
    
};



var chcekVersionCompatibility = function (acvList, domainVersion) {
    var foundCompatibility = false;
    for (var i = 0; i < acvList.length; i++) {
        if (acvList[i].mobileVersion == appVersion &&
            acvList[i].domainVersion == domainVersion) {
            foundCompatibility = true
            return "COMPATIBLE"
        }
    }

    //control comes here means app is not compatible with domain
    //find ltest appversion for the domain
    domainVersion="3.0.91"
    compatipleMobileAppVersions = []
    for (var i = 0; i < acvList.length; i++) {


        if (device.platform === 'iOS') {
            if (domainVersion == acvList[i].domainVersion &&
                acvList[i].appStoreBuildId != null) {
                compatipleMobileAppVersions.push(acvList[i])
            }
        }
        if (device.platform === 'Android') {
            if (domainVersion == acvList[i].domainVersion &&
                acvList[i].playStoreBuildId != null) {
                compatipleMobileAppVersions.push(acvList[i])
            }
        }
    }

    if (compatipleMobileAppVersions.length==0){
        return "NO_NEW_VERSION_AVAILABLE"
    }

    //sort to get the latest app for domain
    compatipleMobileAppVersions.sort(dynamicSort("releaseDate"));

    if (device.platform === 'Android') {
        if (compatipleMobileAppVersions[compatipleMobileAppVersions.length - 1].playStoreUrl === undefined) {
            showAlert(alert_header,"This version of app is not supported,\r\nPlease contact app admin.")
            return "NO_NEW_VERSION_AVAILABLE"
        } else {
            sessionStorage.setItem("NEWAPPURL",
                compatipleMobileAppVersions[compatipleMobileAppVersions.length - 1].playStoreUrl)
        }
    }
    if (device.platform === 'iOS') {
        if (compatipleMobileAppVersions[compatipleMobileAppVersions.length - 1].appStoreUrl === undefined) {
            showAlert(alert_header,"This version of app is not supported,\r\nPlease contact app admin.")
            return "NO_NEW_VERSION_AVAILABLE"
        } else {
            sessionStorage.setItem("NEWAPPURL",
                compatipleMobileAppVersions[compatipleMobileAppVersions.length - 1].appStoreUrl)
        }
    }

    // open new screen stating to download new app, 
    // that is last record in compatipleMobileAppVersions
    return ("INCOMPATIBLE")
}




var checkPrevVerAppAvailable = function (data,i) {
	var avcList=[]
	avcList = data.avcList
		if (avcList[i].mobileVersion != appVersion) {
            if (device.platform === "Android"){
				//avcList[i].playStoreBuildId
                appAvailability.check(avcList[i].playStoreBuildId, function () {
                    // is available
                    sessionStorage.setItem("old_version_build_url", avcList[i].playStoreUrl)
						alert("found " + i)
                        $state.go('uninstallOldAppVersion')
                    return "AVAILABLE"
                }, function () {
                    // not available
					if (i<avcList.length){
						alert("not found " + i)
						i++;
						return checkPrevVerAppAvailable(data,i)
					}
                });
            }else if (device.platform==="iOS"){
                appAvailability.check(avcList[i].appStoreBuildId, function () {
                    // is available
                    sessionStorage.setItem("old_version_build_url", avcList[i].appStoreUrl)
                    return "AVAILABLE"
                }, function () {
                    // not available
					i++;
					return checkPrevVerAppAvailable(data,i)
                });
            }
        }else{
					if (i<avcList.length){
						alert("qual" +i)
						i++;
						return checkPrevVerAppAvailable(data,i)
					}			
		}




    for (var i = 0; i < avcList.length; i++) {
		
        if (avcList[i].mobileVersion != appVersion) {

            if (device.platform === "Android"){
				//avcList[i].playStoreBuildId
                appAvailability.check('com.neterson.hralign91_6', function () {
                    // is available
					alert("111")
                    sessionStorage.setItem("old_version_build_url", avcList[i].playStoreUrl)
                    return "AVAILABLE"
                }, function () {
                    // not available
                });
            }else if (device.platform==="iOS"){
                appAvailability.check(avcList[i].appStoreBuildId, function () {
                    // is available
                    sessionStorage.setItem("old_version_build_url", avcList[i].appStoreUrl)
                    return "AVAILABLE"
                }, function () {
                    // not available
                });
            }
        }
    }
	onLoginData(data.presonalInfo.Gender);
    return "NOTAVAILABLE"
}




function dynamicSort(property) {
    var sortOrder = 1;

    if (property[0].toString() === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a, b) {
        if (sortOrder == -1) {
            return b[property].toString().localeCompare(a[property]).toString();
        } else {
            return a[property].toString().localeCompare(b[property].toString());
        }
    }
}


*/
var handleClientResponse = function (err, cntrl) {

}
