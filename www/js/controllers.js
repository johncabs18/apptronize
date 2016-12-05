angular.module('apptronize.controllers', [])
.controller('homeCtrl',['$scope', '$state', '$ionicModal', function($scope, $state, $ionicModal)
{
	//$state.go('termscondition');
	$scope.screenhieght = window.screen.height;
	$scope.screenwidth = window.innerWidth - 60;

    $scope.gototerms = function(){
    	$state.go('termscondition');
    };
}])
.controller('menuCtrl',['$scope', '$rootScope', '$state', 'members', '$location', function($scope, $rootScope, $state, members, $location)
{
	var memberdata = members.getmemberdata($rootScope.deviceid);
    memberdata.$loaded().then(function(data){
		$scope.menudata = data;
		if(!$scope.menudata.photo){
			$scope.menudata.photo = 'img/defaultimg.jpg';
		}					
	});	

	$scope.isActive = function(route) {
        return route === $location.path();
    };
}])
.controller('signupCtrl',['$scope', '$rootScope', '$timeout', '$ionicModal', '$state', '$ionicPopup', '$cordovaGeolocation', function($scope, $rootScope, $timeout, $ionicModal, $state, $ionicPopup, $cordovaGeolocation)
{
	$scope.signup = [];
	 var posOptions = {timeout: 10000, enableHighAccuracy: false};
	  $cordovaGeolocation
	    .getCurrentPosition(posOptions)
	    .then(function (position) {
	      $scope.lat  = position.coords.latitude;
	      $scope.long = position.coords.longitude;	      
	    }, function(err) {
	      console.log('Error: ' + err);
	    });	 

	$scope.signupsubmit = function(signupdata){
		if(signupdata.$valid) {
			$rootScope.show('Submitting form...<br/><ion-spinner class="spinner-calm" icon="'+ $rootScope.loadingicon +'"></ion-spinner>');
			$timeout(function(){
				$rootScope.profiledata = {'userid': $scope.signup.userid, 'fullname': $scope.signup.fullname, 'email': $scope.signup.email, 'deviceid': $rootScope.deviceid, 'lat': $scope.lat, 'long': $scope.long};				
				$rootScope.hide();
				$state.go('signupsecond');
			},1000);
		}
	};

	$scope.useridshowloading = false;
	$scope.useridshowerror = false;
	$scope.useridshowsuccess = false;
	$scope.emailshowloading = false;
	$scope.emailshowerror = false;
	$scope.emailshowsuccess = false;
	$scope.fullnameshowloading = false;
	$scope.fullnameshowerror = false;
	$scope.fullnameshowsuccess = false;
	$scope.formvalid = false;
	$scope.checkuserid = function(){
		$scope.useridshowloading = true;
		$scope.useridshowerror = false;
		$scope.useridshowsuccess = false;
		if($scope.signup.userid){
			if($scope.signup.userid != 'Found'){
				$timeout(function(){
					$scope.useridshowloading = false;
					$scope.useridshowerror = false;
					$scope.useridshowsuccess = true;
					if($scope.emailshowsuccess && $scope.fullnameshowsuccess){
						$scope.formvalid = true;
					}
				},1000);
			}else{
				$timeout(function(){
					$scope.useridshowloading = false;
					$scope.useridshowsuccess = false;
					$scope.useridshowerror = true;
					$scope.formvalid = false;
				},1000);
			}			
		}else{
			$timeout(function(){
				$scope.useridshowloading = false;
				$scope.useridshowsuccess = false;
				$scope.useridshowerror = true;
				$scope.formvalid = false;
			},1000);
		}
	}

	$scope.checkfullname = function(){
		$scope.fullnameshowloading = true;
		$scope.fullnameshowerror = false;
		$scope.fullnameshowsuccess = false;
		if($scope.signup.fullname){
			$timeout(function(){
				$scope.fullnameshowloading = false;
				$scope.fullnameshowsuccess = true;
				if($scope.useridshowsuccess && $scope.emailshowsuccess){
					$scope.formvalid = true;
				}
			},1000);		
		}else{
			$timeout(function(){
				$scope.fullnameshowloading = false;
				$scope.fullnameshowerror = true;
				$scope.formvalid = false;
			},1000);
		}
	}

	$scope.checkemail = function(){
		$scope.emailshowloading = true;
		$scope.emailshowerror = false;
		$scope.emailshowsuccess = false;
		if($scope.signup.email){
			if($scope.checkemailinput($scope.signup.email)){
				if($scope.signup.email != 'Found@found.com'){
					$timeout(function(){
						$scope.emailshowloading = false;
						$scope.emailshowerror = false;
						$scope.emailshowsuccess = true;
						if($scope.useridshowsuccess && $scope.fullnameshowsuccess){
							$scope.formvalid = true;
						}	
					},1000);
				}else{
					$timeout(function(){
						$scope.emailshowloading = false;
						$scope.emailshowsuccess = false;
						$scope.emailshowerror = true;
						$scope.formvalid = false;
					},1000);
				}			
			}else{
				$timeout(function(){
					$scope.emailshowloading = false;
					$scope.emailshowerror = true;
					$scope.formvalid = false;
				},1000);
			}			
		}else{
			$timeout(function(){
				$scope.emailshowloading = false;
				$scope.emailnotempty = false;
			},1000);
		}
	}

	if($rootScope.profiledata){	 	
	 	$scope.signup.userid = $rootScope.profiledata.userid;
	 	$scope.signup.fullname = $rootScope.profiledata.fullname;
	 	$scope.signup.email = $rootScope.profiledata.email;

	 	$scope.formvalid = true;
	 	$scope.useridshowsuccess = true;
		$scope.emailshowsuccess = true;
		$scope.fullnameshowsuccess = true;
	}

	$scope.checkemailinput = function check_email(val){
	    if(!val.match(/\S+@\S+\.\S+/)){ // Jaymon's / Squirtle's solution
	        // Do something
	        return false;
	    }
	    if( val.indexOf(' ')!=-1 || val.indexOf('..')!=-1){
	        // Do something
	        return false;
	    }
	    return true;
	}
}])
.controller('signupsecondCtrl',['$scope', '$rootScope', '$timeout', '$ionicModal', '$state', 'members', function($scope, $rootScope, $timeout, $ionicModal, $state, members)
{
	if($rootScope.profiledata == '' || $rootScope.profiledata == undefined){
		$state.go('signup');
	}

	$scope.businessnameshowloading = false;
	$scope.businessnameshowerror = false;
	$scope.businessnameshowsuccess = false;
	$scope.businessprofessionshowloading = false;
	$scope.businessprofessionshowerror = false;
	$scope.businessprofessionshowsuccess = false;
	$scope.businessaddressshowloading = false;
	$scope.businessaddressshowerror = false;
	$scope.businessaddressshowsuccess = false;
	$scope.formvalid = false;
	$scope.signup2 = [];
	$scope.checkbusinessname = function(){
		$scope.businessnameshowloading = true;
		$scope.businessnameshowerror = false;
		$scope.businessnameshowsuccess = false;
		if($scope.signup2.businessname){
			$timeout(function(){
				$scope.businessnameshowloading = false;
				$scope.businessnameshowerror = false;
				$scope.businessnameshowsuccess = true;
				if($scope.businessprofessionshowsuccess && $scope.businessaddressshowsuccess){
					$scope.formvalid = true;
				}
			},1000);			
		}else{
			$timeout(function(){
				$scope.businessnameshowloading = false;
				$scope.businessnameshowsuccess = false;
				$scope.businessnameshowerror = true;
				$scope.formvalid = false;
			},1000);	
		}
	}

	$scope.checkbusinessaddress = function(){
		$scope.businessaddressshowloading = true;
		$scope.businessaddressshowerror = false;
		$scope.businessaddressshowsuccess = false;
		if($scope.signup2.businessaddress){
			$timeout(function(){
				$scope.businessaddressshowloading = false;
				$scope.businessaddressshowsuccess = true;
				if($scope.businessnameshowsuccess && $scope.businessprofessionshowsuccess){
					$scope.formvalid = true;
				}
			},1000);		
		}else{
			$timeout(function(){
				$scope.businessaddressshowloading = false;
				$scope.businessaddressshowsuccess = false;
				$scope.businessaddressshowerror = true;
				$scope.formvalid = false;
			},1000);	
		}
	}

	$scope.checkbusinessprofession = function(){
		$scope.businessprofessionshowloading = true;
		$scope.businessprofessionshowerror = false;
		$scope.businessprofessionshowsuccess = false;
		if($scope.signup2.businessprofession){
			$timeout(function(){
				$scope.businessprofessionshowloading = false;
				$scope.businessprofessionshowsuccess = true;
				if($scope.businessnameshowsuccess && $scope.businessaddressshowsuccess){
					$scope.formvalid = true;
				}	
			},1000);					
		}else{
			$timeout(function(){
				$scope.businessprofessionshowloading = false;
				$scope.businessprofessionshowsuccess = false;
				$scope.businessprofessionshowerror = true;
				$scope.formvalid = false;
			},1000);	
		}
	}

	var newprofile = {};

	$scope.signup2 = function(signup2data){
		if(signup2data.$valid) {
			$rootScope.show('Saving profile...<br/><ion-spinner class="spinner-calm" icon="'+ $rootScope.loadingicon +'"></ion-spinner>');
			$timeout(function(){		
				$rootScope.hide();				
				newprofile.userid = $rootScope.profiledata.userid;
				newprofile.fullname = $rootScope.profiledata.fullname;
				newprofile.email = $rootScope.profiledata.email;
				newprofile.latitude = $rootScope.profiledata.lat;
				newprofile.longitude = $rootScope.profiledata.long;
				newprofile.businessname = $scope.signup2.businessname;
				newprofile.businessprofession = $scope.signup2.businessprofession;
				newprofile.businessaddress = $scope.signup2.businessaddress;
				if(members.savenewmember(newprofile, $rootScope.profiledata.deviceid)){
					$state.go('termscondition');
				}else{
					alert('Error');
				}
			},1000);
		}
	};

	$scope.signupback = function(){
		$rootScope.profiledata = $rootScope.profiledata;
		$state.go('signup');
	};
}])
.controller('dashboardCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$ionicPopup', '$ionicModal', '$ionicScrollDelegate', 'members', '$cordovaCamera', '$cordovaFileTransfer', '$ionicHistory', '$cordovaToast', 'transactions', function($scope, $rootScope, $timeout, $state, $ionicPopup, $ionicModal, $ionicScrollDelegate, members, $cordovaCamera, $cordovaFileTransfer, $ionicHistory, $cordovaToast, transactions){	
	//$rootScope.show('Loading profile...<br/><ion-spinner class="spinner-calm" icon="'+ $rootScope.loadingicon +'"></ion-spinner>');
	$scope.lists = [];		
	//console.log(JSON.stringify(transactions.getTransactions($rootScope.deviceid)));
	/*$scope.$on('$ionicView.enter', function(){		
		$timeout(function(){				
			transactions.getTransactions($rootScope.deviceid).then(function(transactionlists){
				$scope.lists = transactionlists;			
			});	
			$rootScope.hide();	    		
			$rootScope.contentloaded = true;
		}, 2000);
	});*/
	$timeout(function(){						
		$scope.refreshList();				
	}, 1000);
	
 	$scope.doneuserid = false;
    $scope.hidecameraicon = false;
    $scope.sellerid = '';

	$scope.infoApp = function() {
		var alertPopup = $ionicPopup.alert({
			title: '<b class="assertive">Actions</b>',
			template: '<center>This content is coming soon...</center>',
			buttons: [
				{
					text: 'OK',
					type: 'button-dark'
				}
			]
		});
		alertPopup.then(function(res) {
			console.log('Thank you!!');
		});
	};

	$ionicModal.fromTemplateUrl('pages/addtransactions.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.addtransactions = modal;
    });

    $scope.addtransactionshow = function(){
    	$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
    	$scope.data.userid = '';
    	$scope.data.transactionphoto = '';
    	$scope.data.transdescription = '';
    	$scope.addtransactions.show();
    };

    $scope.closeModal = function(){
    	$scope.addtransactions.hide();
    	$scope.doneuserid = false;
    	$scope.hidecameraicon = false;
    };

    $scope.data = {};

    $scope.addnonmember = function(){				
	  	var myPopup = $ionicPopup.show({
	    template: '<input type="text" ng-model="data.userid" placeholder="Name/Business Name">',
	    title: 'Create New Account<br />for Non-Member',
	    subTitle: '',
	    scope: $scope,
	    buttons: [	      
	      {
	        text: 'ADD',
	        type: 'button-dark',
	        onTap: function(e) {
	          if (!$scope.data.userid) {
	            //don't allow the user to close unless he enters wifi password
	            e.preventDefault();
	          } else {
	            return $scope.data.userid;
	          }
	        }
	      }
	    ]
	  });

	  myPopup.then(function(res) {
	    members.addnonmember(res, $rootScope.deviceid).then(function(){
	    	$rootScope.show('Successfully added Non-Member');
	    	$timeout(function(){
				$rootScope.hide();
			}, $rootScope.loadingtime);
	    });
	  });
    };
   
    $scope.checkuserid = function(addtransaction){    	
    	if(addtransaction.$valid) {    		
			$rootScope.show('Checking USERID...<br/><ion-spinner class="spinner-calm" icon="'+ $rootScope.loadingicon +'"></ion-spinner>');
			var allmembers = members.getallmembers();
			$scope.found = false;
			$scope.ownuserid = false;
			allmembers.$loaded(
              function(data) {                                
                angular.forEach(allmembers, function(value, key) {                    
                    if(!$scope.found){
                      if(value['userid'] === $scope.data.userid){                                            
                        $scope.found = true;
                        $scope.sellerid = key;
                        if(key === $rootScope.deviceid){
                            $scope.ownuserid = true;
                        }
                      } 
                    }                  
                });                
              },
              function(error) {
                console.log('Error ' + error);
              }
            );			
			$timeout(function(){		
				$rootScope.hide();												
	            if($scope.found){
	            	if($scope.ownuserid){
	            		$rootScope.alertbox('ERROR','You cannot use your own USERID', 'OK');						
	            	}else{	            		
	            		$scope.doneuserid = true;
	            	}            	
	            }else{
	            	$rootScope.alertbox('','User does not exist, do you want to add new account for Non-Member transaction?', 'ADD NEW').then(function(){
	            		$scope.addnonmember();
	            	});
	            }
			},1000);
		}
    };

    $scope.transactionphoto = function() {
	    var options = {
	        quality: 50,
	        destinationType: Camera.DestinationType.FILE_URI,
	        sourceType: Camera.PictureSourceType.CAMERA,
	        allowEdit: false,
	        encodingType: Camera.EncodingType.JPEG,
	        popoverOptions: CameraPopoverOptions,
	        targetWidth: 800,
	      	targetHeight: 500,
	      	//correctOrientation: true
	    };

	   	$cordovaCamera.getPicture(options).then(function(imageData) {
	    	$scope.hidecameraicon = true;	    
		    $scope.data.transactionphoto = imageData;
		}, function(err) {
		      console.log("ERROR: " + JSON.stringify(err));
		});
  	};

  	$scope.submittransaction = function(addtransaction){    	
    	if(addtransaction.$valid) {
    		$rootScope.show('Submitting transactions...<br/><ion-spinner class="spinner-calm" icon="'+ $rootScope.loadingicon +'"></ion-spinner>');
    		if($scope.data.transactionphoto){    			
    			var options2 = {
			        fileKey: "file",
			        fileName: $scope.data.transactionphoto.substr($scope.data.transactionphoto.lastIndexOf('/') + 1),
			        chunkedMode: false,
			        mimeType: "image/jpg"
			    };
    			var server = $rootScope.photourl + "uploadphoto.php"; 
	    		$cordovaFileTransfer.upload(server, $scope.data.transactionphoto, options2).then(function(result) {	      
	    			$scope.data.transactionphoto = result.response;
			        if(result.responseCode == 200){
			        	$scope.savetransaction($rootScope.deviceid, $scope.sellerid, $scope.data);
				        $timeout(function(){
			               $rootScope.hide();			               
			               $ionicHistory.clearCache();			               
			               $scope.closeModal();
			               $cordovaToast.show('Transaction successfully added.', 'long', 'top');
			               $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
			               $scope.refreshList();
			            },2000);			           
			        }			        
			    }, function(err) {
			        $ionicLoading.hide();            
			        $ionicHistory.clearCache();
			        console.log("ERROR: " + JSON.stringify(err));
			    }, function (progress) {
			    	$rootScope.hide();
			        $scope.responseCode = 'inprogress';
			        $rootScope.show('Uploading photo...<br/><ion-spinner class="spinner-calm" icon="'+ $rootScope.loadingicon +'"></ion-spinner>');  
			    });  
		    }else{
		    	$scope.savetransaction($rootScope.deviceid, $scope.sellerid, $scope.data);
		    	$timeout(function(){		    		
	               $rootScope.hide();			               
	               $ionicHistory.clearCache();			               
	               $scope.closeModal();
	               $cordovaToast.show('Transaction successfully added.', 'long', 'top');		    				    	
			    	$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
			    	$scope.refreshList();
	            },2000);		    			    	
		    }		     		    				          						
		}
    };

    $scope.savetransaction = function(userid, sellerid, data){
    	transactions.savetransaction(userid, sellerid, data);
    }

    $scope.refreshList = function() {    	
    	$rootScope.show('loading content...<br/><ion-spinner class="spinner-calm" icon="'+ $rootScope.loadingicon +'"></ion-spinner>');    	
    	transactions.getTransactions($rootScope.deviceid).then(function(transactionlists){
			$scope.lists = transactionlists;				
		});
		$rootScope.contentloaded = 'animated fadeOut';
		$timeout(function(){			
			$rootScope.contentloaded = 'animated fadeIn';
			$scope.$broadcast('scroll.refreshComplete');		
			$rootScope.hide();
		},2000);		
	};
}])
.controller('termsconditionCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$ionicPopup', '$ionicPlatform', 'members', '$ionicPlatform', '$firebaseObject', function($scope, $rootScope, $timeout, $state, $ionicPopup, $ionicPlatform, members, $ionicPlatform, $firebaseObject){	
	$rootScope.show('Loading...<br/><ion-spinner class="spinner-calm" icon="'+ $rootScope.loadingicon +'"></ion-spinner>');	
	$scope.registered = false;
	var ref = new Firebase(firebaseurl); 	  
    var allmembers = $firebaseObject(ref.child('members'));       
    allmembers.$loaded().then(function() {	       
       angular.forEach(allmembers, function(value, key) {
          if(key == $rootScope.deviceid){	          	
          	$scope.registered = true;          	
          	return;
          }
       });
       $rootScope.hide();
       if($scope.registered){
       		$state.go('menu.dashboard');
       }else{
       		$rootScope.contentloaded = true;
       }
     }, function(){
     	console.log('error');
     }); 
	
	$scope.gotosignup = function(){
		if(ionic.Platform.platform() == 'android'){
	      cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
	          if(enabled == false){
			    var gps = $ionicPopup.alert({
					title: '<i class="icon ion-location gpsicon"></i>',
					template: '<div class="gpscontent"><h3>ENABLE LOCATION</h3><p>This app wants to change your device settings:<br />Use GPS, Wi-Fi, and cell networks for location.</p></div>',
					buttons: [
						{
							text: 'OK',
							type: 'button-dark'
						}
					]
				});
				gps.then(function(res) {			
					$scope.checkDeviceSetting();
				});					
	          }
	          else{
	            $state.go('signup'); 
	          }
	        }, function(error){
	            console.log("Error: " + error);
	        });   
	    }else if(ionic.Platform.platform() == 'ios'){
	    	cordova.plugins.diagnostic.isLocationEnabledSetting(function(enabled){
	          if(enabled == false){
	            var gps = $ionicPopup.alert({
					title: '<i class="icon ion-location gpsicon"></i>',
					template: '<div class="gpscontent"><h3>ENABLE LOCATION</h3><p>This app wants to change your device settings:<br />Use GPS, Wi-Fi, and cell networks for location.</p></div>',
					buttons: [
						{
							text: 'OK',
							type: 'button-dark'
						}
					]
				});
				gps.then(function(res) {			
					$scope.checkDeviceSetting();
				});
	          }
	          else{
	            $state.go('signup'); 
	          }
	        }, function(error){
	            console.log("Error: " + error);
	        });   
	    }
	}

	$scope.checkDeviceSetting = function(){
	    cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
	        console.log("GPS location setting is " + (enabled ? "enabled" : "disabled"));
	        if(!enabled){
	            cordova.plugins.locationAccuracy.request(function (success){
	                console.log("Successfully requested high accuracy location mode: "+success.message);
	                $state.go('signup');
	            }, function onRequestFailure(error){
	                console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
	                if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
	                    if(confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
	                        cordova.plugins.diagnostic.switchToLocationSettings();
	                    }
	                }
	            }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
	        }
	    }, function(error){
	        console.error("The following error occurred: "+error);
	    });
	}
}])
.controller('viewprofileCtrl', ['$scope', '$rootScope', '$location', '$timeout', 'members', '$ionicModal', '$cordovaCamera', '$cordovaFileTransfer', '$ionicHistory', '$cordovaToast', '$ionicScrollDelegate', function($scope, $rootScope, $location, $timeout, members, $ionicModal, $cordovaCamera, $cordovaFileTransfer, $ionicHistory, $cordovaToast, $ionicScrollDelegate){
	$rootScope.show('Loading profile...<br/><ion-spinner class="spinner-calm" icon="'+ $rootScope.loadingicon +'"></ion-spinner>');	
	var memberdata = members.getmemberdata($rootScope.deviceid);
	memberdata.$loaded().then(function(data){
		$scope.data = data;
		if(!$scope.data.photo){
			$scope.data.photo = 'img/defaultimg.jpg';
		}	
		$rootScope.contentloaded = true;
		$rootScope.hide();		
	});	

	$ionicModal.fromTemplateUrl('pages/editprofile.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.editprofile = modal;
    });

    $scope.editprofileshow = function(){
    	$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
    	$scope.editprofile.show();
    };

    $scope.closeModal = function(){
    	$scope.editprofile.hide();
    };
    
    $scope.updateProfilePhoto = function() {
    var options = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        targetWidth: 500,
      	targetHeight: 500,
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
        var server = $rootScope.photourl + "uploadphoto.php";        
        var filePath = imageData;
        $scope.data.photo = filePath;
        var options2 = {
            fileKey: "file",
            fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
            chunkedMode: false,
            mimeType: "image/jpg"
        };

        console.log('Get Photo: ' + $scope.data.photo);

        $cordovaFileTransfer.upload(server, filePath, options2).then(function(result) {
          
            $scope.data.photo = result.response;
            $scope.responseCode = result.responseCode;
            console.log('Recieve Photo: ' + $scope.data.photo);
            if($scope.responseCode == 200){
            memberdata.photo = $scope.data.photo;
            memberdata.$save().then(function(){ console.log('Success'); }, function(){ console.log("Error:", error); });
               $timeout(function(){
                   $rootScope.hide();
                   $ionicHistory.clearCache();
                  console.log("Success: " + JSON.stringify(result));
               },1000); 
            }
            
        }, function(err) {
            $ionicLoading.hide();            
            $ionicHistory.clearCache();
            console.log("ERROR: " + JSON.stringify(err));
        }, function (progress) {
            $scope.responseCode = 'inprogress';
            $rootScope.show('Loading...<br/><ion-spinner class="spinner-calm" icon="'+ $rootScope.loadingicon +'"></ion-spinner>');  
        });

      }, function(err) {
          console.log("ERROR: " + JSON.stringify(err));
      });
  };

  $scope.updateProfile = function(updateprofile){
  	$rootScope.show('Updating profile...<br/><ion-spinner class="spinner-calm" icon="'+ $rootScope.loadingicon +'"></ion-spinner>');  
  	if(updateprofile.$valid){  
  		memberdata = $scope.data;		
        memberdata.$save().then(function(){ 
        	$timeout(function(){
                $rootScope.hide(); 
        		$scope.closeModal();
        		$cordovaToast.show('Profile successfully updated.', 'long', 'top');
            },1000);        	
        }, function(){ 
        	console.log("Error:", error); 
       });            
  	}  	
  }
}])
.controller('contactsCtrl', ['$scope', '$location', '$timeout', function($scope, $location, $timeout){
	
}])
;