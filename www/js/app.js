var firebaseurl = "https://test-project-3222e.firebaseio.com";

angular.module('apptronize', ['ionic', 'ngCordova', 'firebase', 'apptronize.controllers', 'apptronize.services', 'angularMoment'])
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $provide, $compileProvider) {
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
  $provide.decorator('$state', function($delegate, $stateParams) {
        $delegate.forceReload = function() {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    });
  $stateProvider
  .state('signup', {
    url: '/signup',
    templateUrl: 'pages/signup.html',
    controller: 'signupCtrl'
  })
  .state('signupsecond', {
    url: '/signupsecond',
    templateUrl: 'pages/signupsecond.html',
    controller: 'signupsecondCtrl'
  })
  .state('home', {
    url: '/home',
    templateUrl: 'pages/home.html',
    controller: 'homeCtrl'
  })
  .state('termscondition', {
    url: '/termscondition',
    templateUrl: 'pages/termscondition.html',
    controller: 'termsconditionCtrl'
  })
  .state('menu', {
    url: "/menu",
    abstract: true,
    templateUrl: "pages/menu.html",
    controller: 'menuCtrl'
    })
  .state('menu.dashboard', {
    url: "/dashboard",
    views: {
      'menuContent': {
        templateUrl: 'pages/dashboard.html',
        controller: 'dashboardCtrl'
        }
    }
  })
  .state('menu.viewprofile', {
    url: "/viewprofile",
    views: {
    'menuContent': {
        templateUrl: 'pages/viewprofile.html',
        controller: 'viewprofileCtrl'
      }
    }   
  })
  // .state('editprofile', {
  //   url: "/editprofile",
  //   templateUrl: 'pages/editprofile.html',
  //   controller: 'editprofileCtrl'
  // })
  .state('menu.contacts', {
    url: "/contacts",
    views: {
      'menuContent': {
        templateUrl: 'pages/contacts.html',
        controller: 'contactsCtrl'
        }
    }
  })
  ;  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('termscondition');  
})
.run(function($ionicPlatform, $rootScope, $state, $ionicLoading, $timeout, $cordovaDevice, $state, $ionicPopup) {   
  /*$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {       
     if (toState.authenticate && !members.check_login()) {
          $rootScope.returnToState = toState.url;
          $rootScope.returnToStateParams = toParams.Id;
          event.preventDefault();
          $state.go('login');
      }
  });*/

  $ionicPlatform.registerBackButtonAction(function(){
    // disabled back button
  }, 100);

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);

          
      }

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    $rootScope.deviceid = $cordovaDevice.getUUID();
    //window.localStorage.setItem('deviceid', $cordovaDevice.getUUID());
  });

  $rootScope.deviceid = window.localStorage.getItem('deviceid'); // remove this temporary only
  $rootScope.show = function(text) {
    $ionicLoading.show({template: text ? text : 'Loading..', showBackdrop: true});
  };

  $rootScope.hide = function() {
    $ionicLoading.hide();
  };
  
  $rootScope.loadingicon = ionic.Platform.isIOS() ? 'ios' : 'android';

  $rootScope.loadingtime = 1000;

  $rootScope.contentloaded = false;

  $rootScope.photourl = 'http://web.proweaverlinks.com/tech/apptronize/';

  $rootScope.notify = function(text) {
    $rootScope.show(text);
    $timeout(function(){
      $rootScope.hide();        
    }, $rootScope.loadingtime);     
  };

  $rootScope.alertbox = function(title, template, button){
    return $ionicPopup.alert({
              title: '<b class="assertive">' + title + '</b>',
              template: '<center>' + template + '</center>',
              buttons: [
                {
                  text: button,
                  type: 'button-dark'
                }
              ]
            });
  }

  
});
