﻿/*!
app.js
(c) 2018 IG PROG, www.igprog.hr
*/
angular.module('app', ['ngMaterial'])

.config(['$httpProvider', function ($httpProvider) {
    //--------------disable catche---------------------
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    //-------------------------------------------------
}])

.controller('appCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    var getConfig = function () {
        $http.get('./config/config.json')
          .then(function (response) {
              $rootScope.config = response.data;
          });
    };
    getConfig();

    var d = new Date();
    $scope.year = d.getFullYear();

    $scope.sendicon = 'fa fa-angle-double-right';
    $scope.sendicontitle = 'Next';

    $scope.hashId = function (id) {
        window.location.hash = id;
    }

    $scope.href = function (x) {
        window.open(x,'_blank');
    }
    
    $scope.today = new Date;
    $scope.send = function (g) {
        $scope.sendicon = 'fa fa-spinner fa-spin';
        $scope.sendicontitle = 'Sending';
        $http({
            url: $rootScope.config.backend + 'Mail.asmx/Send',
            method: 'POST',
            data: { name: g.name, email: g.email, phone: g.phone, address: g.address, type: g.type, message: g.message, lang: $rootScope.config.language }
        })
     .then(function (response) {
         $scope.sendicon = 'fa fa-check';
         $scope.sendicontitle = 'Sent';
     },
     function (response) {
         $scope.sendicon = 'fa fa-exclamation-triangle';
         $scope.sendicontitle = 'Error';
         alert(response.data.d);
     });
    }

}])

.controller('webAppCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $rootScope.application = 'Nutri Prog';
    $rootScope.version = 'STANDARD';
}])

.controller('signupCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.accept = false;
    $scope.msg = { title: null, css: null, icon: null }
    $scope.hidebutton = false;
    $scope.signupok = false;

    var init = function () {
        $http({
            url: $rootScope.config.backend + 'Users.asmx/Init',
            method: 'POST',
            data: ''
        })
     .then(function (response) {
         $scope.user = JSON.parse(response.data.d);
         $scope.passwordConfirm = '';
         $scope.emailConfirm = '';

     },
     function (response) {
         alert(response.data.d);
     });
    }

    var getConfig = function () {
        $http.get('./config/config.json')
          .then(function (response) {
              $rootScope.config = response.data;
              init();
          });
    };
    if ($rootScope.config == undefined) {
        getConfig();
    } else {
        init();
    }

    $scope.signup = function (user) {
        $scope.msg = { title: null, css: null, icon: null }
        user.userName = user.email;
        if (user.firstName == "" || user.lastName == "" || user.email == "" || user.password == "" || $scope.passwordConfirm == "" || $scope.emailConfirm == "") {
            $scope.msg.title = 'All fields are required';
            $scope.msg.css = 'danger';
            $scope.msg.icon = 'exclamation';
            return false;
        }
        if (user.email != $scope.emailConfirm) {
            $scope.msg.title = 'Email addresses must be equal';
            $scope.msg.css = 'danger';
            $scope.msg.icon = 'exclamation';
            return false;
        }
        if (user.password != $scope.passwordConfirm) {
            $scope.msg.title = 'The passwords must be equal';
            $scope.msg.css = 'danger';
            $scope.msg.icon = 'exclamation';
            return false;
        }
        if ($scope.accept == false) {
            $scope.msg.title = 'You must accept the terms of use';
            $scope.msg.css = 'danger';
            $scope.msg.icon = 'exclamation';
            return false;
        }
        $scope.hidebutton = true;
        $scope.signupok = false;
        $http({
            url: $rootScope.config.backend + 'Users.asmx/Signup',
            method: 'POST',
            data: { x: user, lang: $rootScope.config.language }
        })
       .then(function (response) {
           if (response.data.d == 'the email address you have entered is already registered') {
               $scope.msg.title = 'The email address you have entered is already registered';
               $scope.msg.css = 'danger';
               $scope.msg.icon = 'exclamation';
               $scope.hidebutton = false;
               $scope.signupok = false;
           }
           if (response.data.d == 'registration completed successfully') {
               $scope.msg.title = 'Registration completed successfully';
               $scope.msg.css = 'success';
               $scope.msg.icon = 'check';
               $scope.hidebutton = true;
               $scope.signupok = true;
               window.location.hash = 'registration';
           }
       },
       function (response) {
           alert(response.data.d);
           $scope.hidebutton = false;
           $scope.signupok = false;
       });
    }
   
}])

.controller('orderCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.application = $rootScope.application;
    $scope.version = $rootScope.version;
    $scope.userType = 1;
    $scope.showAlert = false;
    $scope.sendicon = 'fa fa-angle-double-right';
    $scope.sendicontitle = 'Dalje';
    $scope.showUserDetails = false;
    $scope.showErrorAlert = false;
    $scope.showPaymentDetails = false;

    var init = function () {
        $http({
            url: $rootScope.config.backend + 'Orders.asmx/Init',
            method: 'POST',
            data: ''
        })
     .then(function (response) {
         $scope.user = JSON.parse(response.data.d);
         $scope.user.application = $scope.application;
         $scope.user.version = $scope.version;
         $scope.user.licence = 1;
         $scope.user.licenceNumber = 1;
         $scope.user.userType = $scope.userType;
         $scope.calculatePrice();
     },
     function (response) {
         alert(response.data.d);
     });
    }

    var getConfig = function () {
        $http.get('./config/config.json')
          .then(function (response) {
              $rootScope.config = response.data;
              init();
          });
    };
    if ($rootScope.config == undefined) {
        getConfig();
    } else {
        init();
    }

    $scope.changeUserType = function (x) {
        $scope.userType = x;
    }

    $scope.calculatePrice = function () {
        var unitprice = 0;
        var totalprice = 0;

            if ($scope.user.userType == 0) { unitprice = 550; $scope.user.version = 'START'; }
            if ($scope.user.userType == 1) { unitprice = 950; $scope.user.version = 'STANDARD'; }
            if ($scope.user.userType == 2) { unitprice = 1850; $scope.user.version = 'PREMIUM'; }

            if ($scope.user.licence > 1) {
                unitprice = unitprice * $scope.user.licence - ((unitprice * $scope.user.licence) * ($scope.user.licence / 10))
            }

            $scope.user.licenceNumber = 1;

        totalprice = $scope.user.licenceNumber > 1 ? unitprice * $scope.user.licenceNumber - (unitprice * $scope.user.licenceNumber * 0.1) : unitprice;
        $scope.user.price = totalprice;
        $scope.user.priceEur = totalprice / $rootScope.config.eur;
    }

    $scope.order = function (application, version) {
        init();
        window.location.hash = 'order';
        $scope.user.application = application;
        $scope.user.version = version;
        $scope.calculatePrice();
    }

    $scope.setApplication = function (x) {
        $scope.user.application = x;
        $scope.calculatePrice();
    }

    $scope.sendOrder = function (user) {
        $scope.showErrorAlert = false;
        if (user.email == '' || user.firstName == '' || user.lastName == '' || user.address == '' || user.postalCode == '' || user.city == '' || user.country == '') {
            $scope.showErrorAlert = true;
            $scope.errorMessage = 'All fields are required';
            return false;
        }
        if ($scope.userType == 1) {
            if (user.companyName == '' || user.pin == '') {
                $scope.showErrorAlert = true;
                $scope.errorMessage = 'All fields are required';
                return false;
            }
        }

        $scope.sendicon = 'fa fa-spinner fa-spin';
        $scope.sendicontitle = 'Sending';
        $scope.isSendButtonDisabled = true;
        $http({
            url: $rootScope.config.backend + 'Orders.asmx/SendOrder',
            method: 'POST',
            data: { x: user, lang: $rootScope.config.language }
        })
       .then(function (response) {
           $scope.showAlert = true;
           $scope.showPaymentDetails = true;
           window.location.hash = 'orderform';
       },
       function (response) {
           $scope.showAlert = false;
           $scope.showPaymentDetails = false;
           $scope.sendicon = 'fa fa-paper-plane-o';
           $scope.sendicontitle = 'Send';
           alert(response.data.d);
       });
    }

    $scope.login = function (u, p) {
        $http({
            url: $rootScope.config.backend + 'Users.asmx/Login',
            method: "POST",
            data: {
                userName: u,
                password: p
            }
        })
        .then(function (response) {
            var user = JSON.parse(response.data.d);
            if (user.userName == u) {
                $scope.user.firstName = user.firstName;
                $scope.user.lastName = user.lastName;
                $scope.user.companyName = user.companyName;
                $scope.user.address = user.address;
                $scope.user.postalCode = user.postalCode;
                $scope.user.city = user.city;
                $scope.user.country = user.country;
                $scope.user.pin = user.pin;
                $scope.user.email = user.email;
                $scope.showUserDetails = true;
                $scope.showErrorAlert = false;
            } else {
                $scope.showErrorAlert = true;
                $scope.errorMessage = 'Error login'
            }
        },
        function (response) {
            $scope.errorLogin = true;
            $scope.showErrorAlert = true;
            $scope.errorMessage = 'Error login'
            $scope.showUserDetails = false;
        });
    }

    $scope.registration = function () {
        window.location.hash = 'registration';
    }

    $scope.gotoForm = function () {
        $scope.showUserDetails = true;
    }

    $scope.forgotPassword = function (x) {
        $scope.showErrorAlert = false;
        $scope.showSuccessAlert = false;
        if (x == null || x == '') {
            $scope.showErrorAlert = true;
            $scope.errorMessage = 'Enter E-mail'
        } else {
            $http({
                url: $rootScope.config.backend + 'Users.asmx/ForgotPassword',
                method: "POST",
                data: { email: x, lang: $rootScope.config.language }
            })
          .then(function (response) {
              $scope.showSuccessAlert = true;
              $scope.successMessage = JSON.parse(response.data.d);
          },
          function (response) {
              $scope.showErrorAlert = true;
              $scope.errorMessage = JSON.parse(response.data.d);
          });
        }
    }

    $scope.showAppLink = false;
    $scope.alertclass = 'success';
    $scope.confirmPayPal = function (u, p) {
        $scope.showErrorAlert = false;
        $scope.showSuccessAlert = false;
        $scope.showAppLink = false;
        if (u === undefined || p === undefined) {
            $scope.showErrorAlert = true;
            $scope.errorMessage = 'Enter E-mail and password';
            return false;
        }
        $http({
            url: $rootScope.config.backend + 'Users.asmx/ConfirmPayPal',
            method: "POST",
            data: { userName: u, password: p, lang: $rootScope.config.language }
        })
        .then(function (response) {
            $scope.showSuccessAlert = true;
            $scope.successMessage = JSON.parse(response.data.d);
            if ($scope.successMessage == 'your account has been successfully activated') {
                $scope.alertclass = 'success';
                $scope.showAppLink = true;
            } else {
                $scope.alertclass = 'danger';
            }
        },
        function (response) {
            $scope.showErrorAlert = true;
            $scope.errorMessage = JSON.parse(response.data.d);
        });
    }

}])

.controller('contactCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.showAlert = false;
    $scope.sendicon = 'fa fa-paper-plane-o';
    $scope.sendicontitle = 'Send';

    $scope.d = {
        name: '',
        email: '',
        message: ''
    }

    $scope.send = function (d) {
        if ($rootScope.config.backend == undefined) { $rootScope.getConfig(); }
        $scope.isSendButtonDisabled = true;
        $scope.sendicon = 'fa fa-spinner fa-spin';
        $scope.sendicontitle = 'Sending';
        $http({
            url: $rootScope.config.backend + 'Mail.asmx/Send',
            method: 'POST',
            data: { name: d.name, email: d.email, messageSubject: 'NutriProg.com - Inquiry', message: d.message, lang: $rootScope.config.language }
        })
       .then(function (response) {
           $scope.showAlert = true;
           $scope.sendicon = 'fa fa-paper-plane-o';
           $scope.sendicontitle = 'Send';
           window.location.hash = 'contact';
       },
       function (response) {
           $scope.showAlert = false;
           $scope.sendicon = 'fa fa-paper-plane-o';
           $scope.sendicontitle = 'Send';
           alert(response.data.d);
       });
    }

}])

;