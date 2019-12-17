'use strict';


var app = angular.module('myApp', ['myApp.controllers', 'myApp.services', 'ngRoute', 'AngularPrint', 'ngSanitize'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
      when("/login", { templateUrl: "partials/login.html", controller: "loginUser" }).
      when("/pos", { templateUrl: "partials/POS.html", controller: "pointOfSale" }).
      when("/Stock", { templateUrl: "partials/Stock.html", controller: "myStock" }).
      when("/soldItem", { templateUrl: "partials/logout.html", controller: "LogoutController" }).
      when("/dataEntry", { templateUrl: "partials/dataentry.html", controller: "dataEntry" }).
      when("/dailyReport", { templateUrl: "partials/dailyreport.html", controller: "dailyReport" }).
      when("/salesReport", { templateUrl: "partials/monthlyReport.html", controller: "monthlyReport" }).
      when("/lastSale", { templateUrl: "partials/lastSale.html", controller: "lastSale" }).
      when("/userGuide", { templateUrl: "partials/editName.html", controller: "editName" }).
      when("/supplierDetail", { templateUrl: "partials/supplierDetail.html", controller: "supplierDetail" }).
      when("/supplierLedger", { templateUrl: "partials/supplierLedger.html", controller: "supplierLedger" }).
      when("/newBill", { templateUrl: "partials/newBill.html", controller: "newBill" }).
      when("/addSalesman", { templateUrl: "partials/addSalesman.html", controller: "addSalesman" }).
      when("/SmanReport", { templateUrl: "partials/SmanReport.html", controller: "SmanReport" }).
      when("/customSalesReport", { templateUrl: "partials/customSalesReport.html", controller: "customSalesReport" }).





      otherwise({ redirectTo: '/login' });



  }]).directive('contenteditable', function () {
    return {
      restrict: 'A', // only activate on element attribute
      require: '?ngModel', // get a hold of NgModelController
      link: function (scope, element, attrs, ngModel) {
        if (!ngModel) return; // do nothing if no ng-model

        // Specify how UI should be updated
        ngModel.$render = function () {
          element.html(ngModel.$viewValue || '');
        };

        // Listen for change events to enable binding
        element.on('blur keyup change', function () {
          scope.$apply(read);
        });
        read(); // initialize

        // Write data to the model
        function read() {
          var html = element.html();
          // When we clear the content editable the browser leaves a <br> behind
          // If strip-br attribute is provided then we strip this out
          if (attrs.stripBr && html == '<br>') {
            html = '';
          }
          ngModel.$setViewValue(html);
        }
      }
    };
  }).directive('modal', function () {
    return {
      template: '<div class="modal fade">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
        '<h4 class="modal-title">{{ title }}</h4>' +
        '</div>' +
        '<div class="modal-body" ng-transclude></div>' +
        '</div>' +
        '</div>' +
        '</div>',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function (value) {
          if (value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function () {
          scope.$apply(function () {
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function () {
          scope.$apply(function () {
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });
app.directive('barcode', function () {
  return {
    restrict: 'AE',
    template: '<img id="barcodeImage" align="middle" src="{{src}}"/>',
    scope: {
      food: '='
    },
    link: function ($scope) {
      $scope.$watch('food', function (food) {
        console.log($scope.myInput);
        var barcode = new bytescoutbarcode128();
        var space = "  ";

        barcode.valueSet($scope.myInput);
        barcode.setMargins(5, 5, 5, 5);
        barcode.setBarWidth(2);

        var width = barcode.getMinWidth();

        barcode.setSize(width, 800);

        $scope.src = barcode.exportToBase64(width, 800, 0);
      }, true);
    }
  }
});

