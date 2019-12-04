

var app = angular.module('myApp.controllers', []);
var meLogin = false;
var mepOs = false;
var entryUser = false;

app.controller('registerUser', function ($scope, myService, $location, $rootScope) {


});
app.controller("dataEntry", function ($scope, myService, $routeParams, $location, $rootScope, $route, $window, $timeout) {
  console.clear();

  $scope.NewEntry = false;
  $scope.oldEntry = false;
  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    mepOs = false;
    entryUser = false;
    $rootScope.entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login')
  }
  $scope.showModal = false;
  $scope.showOld = false;
  var array = [];
  getCat();
  getSup();
  $scope.stockShow = false;
  $scope.checkStock = function ($event) {

    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {

      var abc = { myid: $scope.barcodeCheck };
      myService.getItem(abc).success(function (res) {
        //console.log(res);
        if (res == false) {

          alert('Invalid Barcode');
        }
        else {
          $scope.stockShow = true;
          var total = res.itemQty * res.itemRetail;
          $scope.totalLeft = total;
          $scope.sale = res;
        }
      });
    }
  };
  $scope.newEntry = function () {
    $scope.oldEntry = false;
    $scope.NewEntry = true;
  }
  $scope.OldEntry = function () {
    $scope.NewEntry = false;
    $scope.oldEntry = true;
  }

  $scope.showDiscount = function () {
    $scope.showdiscount = true;
  }

  $scope.addCateogry = function () {
    var abc = { categoryName: $scope.catName };
    //console.log('adding', abc);
    myService.addCategory(abc).success(function (res) {
      if (res == true) {
        alert('Success');
        $scope.catName = "";
        getCat();
      }
      else {
        alert('Category already Added!');
      }
    });
  }
  $scope.addSupp = function () {
    var abc = { supplierName: $scope.supName };
    //console.log('adding', abc);
    myService.addPurchaser(abc).success(function (res) {
      if (res == true) {
        alert('Success');
        $scope.supName = "";
        // getSup();
      }
      else {
        alert('Category already Added!');
      }
    });




  }
  $scope.Reload = function () {
    $route.reload();
  }
  function getCat() {
    myService.getCategory().success(function (res) {
      if (res) {
        for (var i = 0; i < array.length; i++) {
          array.pop();
        }
        //console.log(res);
        for (var i in res) {
          var obj = { categoryId: i, name: "" + res[i].categoryName };
          array.push(obj);
        }
        $scope.chooseCategories = array;

      }
    });
  }

  function cipher(number) {
    //console.log("number before " + number);
    var digits = number.toString().split('');
    var realDigits = digits.map(Number)
    //console.log('realDigits ' + realDigits);
    var convert = '';
    for (var i = 0; i < digits.length; i++) {

      switch (realDigits[i]) {
        case 1:
          convert = convert + 'B';
          break;
        case 2:
          convert = convert + 'L';
          break;
        case 3:
          convert = convert + 'A';
          break;
        case 4:
          convert = convert + 'C';
          break;
        case 5:
          convert = convert + 'K';
          break;
        case 6:
          convert = convert + 'H';
          break;
        case 7:
          convert = convert + 'O';
          break;
        case 8:
          convert = convert + 'R';
          break;
        case 9:
          convert = convert + 'S';
          break;
        case 0:
          convert = convert + 'E';
          break;
      }
    }
    //console.log("encripted " + convert);
    return convert;
  }

  $scope.generateOld = function () {
    $scope.showOld = !$scope.showOld;
    $("#myModal").modal()
    var arrayy = [];
    var obj = { id: $scope.sale.barcode, itemCategory: $scope.sale.itemCategory, itemQty: $scope.myQty };
    //console.log(obj);
    myService.updateEntry(obj).success(function (res) {
      if (res == false) {
        alert("Problem in adding your item");
      }
      else {

        var barcode = new bytescoutbarcode128();
        zeroAppend = ""
        if ($scope.barcodeCheck <= 100) {
          zeroAppend += "0000"
        } else if ($scope.barcodeCheck <= 1000) {
          zeroAppend += "000"
        }
        else if ($scope.barcodeCheck <= 10000) {
          zeroAppend += "00"
        } else if ($scope.barcodeCheck <= 100000) {
          zeroAppend += "0"
        }
        barcode.valueSet(zeroAppend + $scope.barcodeCheck);
        barcode.setMargins(5, 5, 5, 5);
        barcode.setBarWidth(2);
        var width = barcode.getMinWidth();
        barcode.private_fontSize = 20;
        barcode.setSize(width, 120);
        var barcodeImage = document.getElementById('barcodeImage');
        barcodeImage.src = barcode.exportToBase64(width, 120, 0);

        //console.log($scope.sale.itemWholesale);
        var convert = cipher($scope.sale.itemWholesale);
        var name = $scope.sale.itemName
        if ($scope.sale.itemName && $scope.sale.itemName.length > 25) {
          name = name.substring(0, 25);
        }
        var MYS = '<div print-section style="font-size:16px; FONT-FAMILY: MONOSPACE; letter-spacing: 1px; position:absolute; top:26px;"><div style="display:inline; float:left; margin-left:25px; min-height:150px;"><p style="margin:0; padding:0;"><strong style="font-size:19px;" >Dress Up</strong><br><strong>'
          + $scope.sale.type
          + '</strong><br><strong>' + $scope.sale.code + '</strong><br/><strong>' + convert + '</strong><p style="font-size:18px; margin:0; padding:0;"><strong>RS: '
          + $scope.sale.itemRetail + '</p></strong></div>'
          + '<div style="display:inline; float:right;"><img id="barcodeImage" width="100%" height="100%" src="'
          + barcodeImage.src + '"><strong style="padding:0 0 0 1px;">'
          + $scope.sale.size + '</strong></div><div style="text-align:left;"><p style=" margin:0; padding:0 0 0 1px;"><strong>'
          + name + '</strong></p></div></div>';
        var arrays = [];
        var myVal = { text: MYS };
        for (var i = 1; i <= $scope.myQty; i++) {
          arrays.push(myVal);
        }
        //console.log(arrays);
        $scope.sa = arrays;
        //console.log($scope.sa);


        $timeout(function () {
          $scope.showModal = false;
          //$window.print();
          var mywindow = window.open('', 'PRINT', 'height=400,width=600');
          mywindow.document.write('<html><head>');
          mywindow.document.write('</head><body>');
          mywindow.document.write('<div style="margin:0; padding:0">');
          for (var i = 0; i < $scope.sa.length; i++) {
            if (i % 2 == 0)
              mywindow.document.write('<div style="margin:0; padding-top:23px; padding-left:0px; padding-bottom:0; padding-right:0;width:50%; float: left;">');
            else
              mywindow.document.write('<div style="margin:0; padding-top:23px; padding-left:0px; padding-bottom:0; padding-right:0; width:50%; float: right;">');
            mywindow.document.write($scope.sa[i].text);
            mywindow.document.write('</div>');
          }
          mywindow.document.write('</div>');
          mywindow.document.write('</body></html>');
          mywindow.print();
          mywindow.close();
        }, 1000);
      }
    });
  }

  var array1 = [];
  function getSup() {
    myService.getSupplier().success(function (res) {
      if (res) {
        for (var i = 0; i < array1.length; i++) {
          array1.pop();
        }
        //console.log(res);
        for (var i in res) {
          var obj = { categoryId: i, name: "" + res[i].supplierName };
          array1.push(obj);
        }
        $scope.chooseSupplier = array1;
      }
    });
  }

  $rootScope.location = $location.path();
  $scope.printFunc = function () {
  }

  $scope.generateBarcode = function (id, id2) {
    //console.log('print in generate');

    $scope.showModal = !$scope.showModal;
    var obj = { itemName: $scope.itemName, itemDesc: $scope.itemDesc, itemQty: $scope.itemQty, itemWholesale: $scope.itemWholesale, itemRetail: $scope.itemRetail, itemCategory: $scope.chooseCategories[id].name, type: $scope.type, size: $scope.size, code: $scope.code, itemSupplier: $scope.chooseSupplier[id2].name };
    //console.log(obj);
    var arrayy = [];

    myService.addItem(obj).success(function (res) {
      if (res.itemName) {
        alert("item is already in");
      }
      else if (res == false) {
        alert("Problem in adding your item");
      }
      else {
        //console.log('in else generate');
        var barcode = new bytescoutbarcode128();
        zeroAppend = ""
        $scope.barcodeCheck = res.barcode;
        if ($scope.barcodeCheck <= 100) {
          zeroAppend += "0000"
        } else if ($scope.barcodeCheck <= 1000) {
          zeroAppend += "000"
        }
        else if ($scope.barcodeCheck <= 10000) {
          zeroAppend += "00"
        } else if ($scope.barcodeCheck <= 100000) {
          zeroAppend += "0"
        }
        barcode.valueSet(zeroAppend + $scope.barcodeCheck);
        barcode.setMargins(5, 5, 5, 5);
        barcode.setBarWidth(2);
        var width = barcode.getMinWidth();
        barcode.private_fontSize = 20;
        barcode.setSize(width, 120);
        var barcodeImage = document.getElementById('barcodeImage');
        barcodeImage.src = barcode.exportToBase64(width, 120, 0);

        //console.log($scope.itemWholesale);
        var convert = cipher($scope.itemWholesale);
        var name = $scope.itemName
        if ($scope.itemName && $scope.itemName.length > 25) {
          name = name.substring(0, 25);
        }
        var MYS = '<div print-section style="font-size:16px; FONT-FAMILY: MONOSPACE; letter-spacing: 1px; position:absolute; top:26px;"><div style="display:inline; float:left; margin-left:25px; min-height:150px;"><p style="margin:0; padding:0;"><strong style="font-size:19px;" >Dress Up</strong><br><strong>'
          + $scope.type
          + '</strong><br><strong>' + $scope.code + '</strong><br/><strong>' + convert + '</strong><p style="font-size:18px; margin:0; padding:0;"><strong>RS: '
          + $scope.itemRetail + '</p></strong></div>'
          + '<div style="display:inline; float:right;"><img id="barcodeImage" width="100%" height="100%" src="'
          + barcodeImage.src + '"><strong style="padding:0 0 0 1px;">'
          + $scope.size + '</strong></div><div style="text-align:left;"><p style=" margin:0; padding:0 0 0 1px;"><strong>'
          + name + '</strong></p></div></div>';
        var arrays = [];
        var myVal = { text: MYS };
        //console.log($scope.itemQty);
        for (var i = 1; i <= $scope.itemQty; i++) {
          arrays.push(myVal);
        }
        $scope.sa = arrays;
        // $scope.showModal = true;


        $timeout(function () {
          $scope.showOld = false;
          //$window.print();
          var mywindow = window.open('', 'PRINT', 'height=400,width=600');
          mywindow.document.write('<html><head>');
          mywindow.document.write('</head><body>');
          mywindow.document.write('<div style="margin:0; padding:0">');
          for (var i = 0; i < $scope.sa.length; i++) {
            if (i % 2 == 0)
              mywindow.document.write('<div style="margin:0; padding-top:23px; padding-left:0px; padding-bottom:0; padding-right:0;width:50%; float: left;">');
            else
              mywindow.document.write('<div style="margin:0; padding-top:23px; padding-left:0px; padding-bottom:0; padding-right:0; width:50%; float: right;">');
            mywindow.document.write($scope.sa[i].text);
            mywindow.document.write('</div>');
          }
          mywindow.document.write('</div>');
          mywindow.document.write('</body></html>');
          mywindow.print();
          mywindow.close();
        }, 1000);
      }

    });

  }


});

app.controller("editName", function ($scope, myService, $routeParams, $location, $rootScope) {

  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    mepOs = false;
    entryUser = false;
    $rootScope.entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login');

  }

});

app.controller("supplierDetail", function ($scope, myService, $routeParams, $location, $rootScope) {

  $scope.whenTable = false;
  //console.log('here');

  getSup();
  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    mepOs = false;
    entryUser = false;
    $rootScope.entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login');

  }
  var array1 = [];
  var qty = 0;

  var retail = 0;
  var profit = 0;
  var wholesale = 0;
  $scope.callIt = function (id) {
    qty = 0;
    retail = 0;
    profit = 0;
    wholesale = 0;
    //console.log(id);
    var obj = { name: $scope.chooseSupplier[id].name };
    //console.log(obj);
    myService.getSupDetail(obj).success(function (res) {
      //console.log('res', res);
      $scope.whenTable = true;
      $scope.sale = res;
      for (var i in res) {
        qty = qty + res[i].itemQty;
        var totalItemRetail = res[i].itemQty * res[i].itemRetail;
        retail = retail + totalItemRetail;
        var totalItemWohleSale = res[i].itemQty * res[i].itemWholesale;
        wholesale = wholesale + totalItemWohleSale;
      }
      $scope.whole = wholesale;
      profit = retail - wholesale;
      $scope.totalit = qty;
      $scope.myProfit = profit;
      $scope.mysale = retail;

    });
  }
  $scope.showReturnModal = false;
  $scope.print = function () {
    $scope.showReturnModal = true;
  }
  function getSup() {
    myService.getSupplier().success(function (res) {
      if (res) {
        var da = new Date();
        $scope.date = da.toDateString();
        for (var i = 0; i < array1.length; i++) {
          array1.pop();
        }
        //console.log(res);
        for (var i in res) {
          var obj = { categoryId: i, name: "" + res[i].supplierName };
          array1.push(obj);
        }
        $scope.chooseSupplier = array1;

      }
    });
  }


});
app.controller("loginUser", function ($scope, myService, $routeParams, $location, $rootScope, $window) {
  $rootScope.location = $location.path();

  $scope.login = function (username, password) {
    //console.log(username, password)
    if (username === "admin" && password === "515253") {
      meLogin = true;
      $rootScope.menu = true;
      $rootScope.loggedIn = true;
      $rootScope.entryUser = false;
      $rootScope.posUser = false;
      $location.path('pos');
    }
    else if (username === "posuser" && password === "12345") {
      meLogin = false;
      $rootScope.menu = false;
      $rootScope.posUser = true;
      $rootScope.entryUser = false;
      $rootScope.loggedIn = true;
      mepOs = true;
      $location.path('pos');
    }
    else if (username === "entryuser" && password === "12345") {
      meLogin = false;
      $rootScope.menu = false;
      $rootScope.posUser = false;
      $rootScope.entryUser = true;
      $rootScope.loggedIn = true;
      entryUser = true;
      $location.path('dataEntry');
    }
    else {
      $rootScope.menu = false;
      $rootScope.posUser = false;
      $rootScope.entryUser = false;
      $rootScope.loggedIn = false;
      entryUser = false;
      meLogin = false;
      mepOs = false;
      alert('Username or Password is incorrect');
    }

  }

});

app.controller("myStock", function ($scope, myService, $routeParams, $location, $rootScope) {


  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    mepOs = false;
    entryUser = false;
    $rootScope.entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login');

  }
  $scope.stockShow = false;
  $scope.checkStock = function ($event) {

    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {

      var abc = { myid: $scope.barcodeCheck };
      myService.getItem(abc).success(function (res) {
        //console.log(res);
        if (res == false) {
          alert('Invalid Barcode');
        }
        else {
          $scope.stockShow = true;
          var total = res.itemQty * res.itemWholesale;
          $scope.totalLeft = total;
          $scope.sale = res;
        }
      });
    }
  };


});
app.controller("supplierLedger", function ($scope, myService, $routeParams, $location, $rootScope) {


  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    mepOs = false;
    entryUser = false;
    $rootScope.entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login');

  }
  getSup();
  var array1 = [];

  function getSup() {
    myService.getSupplier().success(function (res) {
      if (res) {
        var da = new Date();
        $scope.date = da.toDateString();
        for (var i = 0; i < array1.length; i++) {
          array1.pop();
        }
        //console.log(res);
        for (var i in res) {
          var obj = { categoryId: i, name: "" + res[i].supplierName };
          array1.push(obj);
        }
        $scope.chooseSupplier = array1;

      }
    });

  }
  $scope.showReturnModal = false;
  $scope.print = function () {
    $scope.showReturnModal = true;
  }
  $scope.whenTable = false;
  $scope.getSup = function (id) {
    var obj = { Supplier: $scope.chooseSupplier[id].name };
    myService.getBill(obj).success(function (res) {
      if (res === false) {
        alert("You Don't have any bill");
      }
      else {
        $scope.whenTable = true;
        //console.log(res);
        $scope.sale = res;
      }
    });
  }


});

app.controller("newBill", function ($scope, myService, $routeParams, $location, $rootScope, $route) {


  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    mepOs = false;
    entryUser = false;
    $rootScope.entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login');

  }
  getSup();
  var array1 = [];
  function getSup() {
    myService.getSupplier().success(function (res) {
      if (res) {
        var da = new Date();
        $scope.date = da.toDateString();
        for (var i = 0; i < array1.length; i++) {
          array1.pop();
        }
        //console.log(res);
        for (var i in res) {
          var obj = { categoryId: i, name: "" + res[i].supplierName };
          array1.push(obj);
        }
        $scope.chooseSupplier = array1;

      }
    });

  }
  $scope.showbill = false;
  $scope.select1 = false;
  $scope.showpay = false;
  $scope.selected = false;
  $scope.callIt = function () {
    $scope.selected = true;
  }
  var myS = 0;
  $scope.showBill = function () {
    $scope.select1 = true;
    $scope.showbill = true;
    $scope.showpay = false;
    myS = 1;
  }

  $scope.showPay = function () {
    $scope.select1 = true;
    $scope.showbill = false;
    $scope.showpay = true;
    myS = 2;
  }

  $scope.Reload = function () {
    $route.reload();
  }
  $scope.addBill = function (id) {
    if ($scope.debit == null || $scope.credit == null) {
      alert("You can't leave any field empty, Please put 0");
    }
    else {
      var da = new Date();
      var mdate = da.toDateString();
      var balance = $scope.credit - $scope.debit;
      if (myS === 1) {
        var matching = "" + $scope.billNo + "_" + $scope.chooseSupplier[id].name;
        var obj = { date: mdate, billNo: $scope.billNo, particular: '-', credit: $scope.credit, debit: $scope.debit, balance: balance, Supplier: $scope.chooseSupplier[id].name, matchId: matching, bool: 0 };
        //console.log(obj);
      }
      else if (myS === 2) {
        var obj = { date: mdate, billNo: '-', particular: $scope.payment, credit: $scope.credit, debit: $scope.debit, balance: balance, Supplier: $scope.chooseSupplier[id].name, bool: 1 };
        //console.log(obj);
      }
      myService.addBill(obj).success(function (res) {
        if (res) {
          alert("New Bill Added");
          // $route.reload();
        }
        else if (res == 'exist') {
          alert('This Bill already Exist');
        }
        else {
          alert('Error in adding this bill');
          // $route.reload();
        }
      });
    }
  }






});


app.controller("lastSale", function ($scope, myService, $routeParams, $location, $rootScope, $route) {

  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    mepOs = false;
    entryUser = false;
    $rootScope.entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login')
  }
  myService.getSoldItems().success(function (res) {
    if (res) {
      $scope.sales = res;
    }
  });

  $scope.deleteSale = function (id) {
    //console.log(id);
    myService.deleteSale(id).success(function (res) {
      if (res) {
        //console.log(res);
        $route.reload();
      } else {
        alert('cant delete sale item');
      }
    });
  }

});



app.controller("monthlyReport", function ($scope, myService, $routeParams, $location, $rootScope) {

  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    mepOs = false;
    entryUser = false;
    $rootScope.entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login')
  }
  $scope.whenTable = false;
  var da = new Date();
  $scope.mdate = da.toDateString();
  $scope.chooseCategories = [
    { categoryId: 0, name: "Choose Month", slug: "Choose Category" },
    { categoryId: 1, name: "January", slug: "Jan" },
    { categoryId: 2, name: "February", slug: "Feb" },
    { categoryId: 3, name: "March", slug: "Mar" },
    { categoryId: 4, name: "April", slug: "Apr" },
    { categoryId: 5, name: "May", slug: "May" },
    { categoryId: 6, name: "June", slug: "Jun" },
    { categoryId: 7, name: "July", slug: "Jul" },
    { categoryId: 8, name: "August", slug: "Aug" },
    { categoryId: 9, name: "September", slug: "Sep" },
    { categoryId: 10, name: "October", slug: "Oct" },
    { categoryId: 11, name: "November", slug: "Nov" },
    { categoryId: 12, name: "December", slug: "Dec" }];

  $scope.selectedCategories = angular.copy($scope.chooseCategories[0]);

  var qty = 0;

  var retail = 0;
  var profit = 0;
  $scope.generateReport = function (index) {
    $scope.whenTable = true;

    //console.log($scope.chooseCategories[index].slug);
    var obj = { date: $scope.chooseCategories[index].slug };


    $scope.chosed = $scope.chooseCategories[index].name;
    //console.log($scope.chosed);



    myService.getMonthlySlip(obj).success(function (res) {
      if (res) {
        for (var i in res) {
          qty = qty + res[i].totalQty;
          retail = retail + res[i].totalPrice;
          profit = profit + res[i].profit;
        }
        $scope.totalit = qty;
        $scope.myProfit = profit;
        $scope.mysale = retail;
        $scope.sale = res;
      }
    });
  }



});

app.controller("dailyReport", function ($scope, myService, $routeParams, $route, $location, $rootScope) {

  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    mepOs = false;
    entryUser = false;
    $rootScope.entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login');
  }
  var da = new Date();
  $scope.mdate = da.toDateString();
  var qty = 0;
  var whole = 0;
  var retail = 0;
  var profit = 0;
  var money = 0;
  var undefined;


  var obj = { date: $scope.mdate };

  myService.refreshStartday(obj).success(function (res) {
    if (res) {
      if ($scope.cash == null) {
        $scope.cash = res.start
        money = res.start
      } else {
        money = res.start
      }
    }
  });


  myService.getDailySlip(obj).success(function (res) {
    if (res) {
      for (var i in res) {
        qty = qty + res[i].totalQty;
        if (res[i].totalDiscount == undefined) {
          res[i].totalDiscount = 0;
        }
        whole = whole + res[i].totalDiscount;
        retail = retail + res[i].totalPrice;
        profit = profit + res[i].profit;
      }
      $scope.totalit = qty;
      $scope.mydiscount = whole;
      $scope.mysale = retail;
      $scope.myProfit = profit;
      $scope.sold = res;

      $scope.cash = retail + money;

    }
  });

  $scope.start = function ($event) {
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
      //console.log($scope.todaycash);
      if ($scope.todaycash !== '') {
        var obj = { date: $scope.mdate, amount: $scope.todaycash };
        //console.log($scope.todaycash);
        myService.startday(obj).success(function (res) {
          if (res.start!=null) {
            alert('Already started your day');
          }else if(res==true){
            alert($scope.todaycash + ' Cash is added');
          }
        });
      }
    }
  }

  $scope.Reload = function () {
    $route.reload();
  }

  $scope.dayexpense = function ($event) {
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
      if ($scope.todayexpense !== '') {
        var obj = { date: $scope.mdate, todayexpense: $scope.todayexpense }
        myService.dayExpense(obj).success(function (res) {
          if (res) {
            alert($scope.todayexpense + " cash is taken!!");
            money = res.sub;
          }else{
            alert("Haven't Entered start day ");
          }
        });
      }
    }
  }


});

app.controller('addSalesman', function ($scope, myService, $routeParams, $location, $rootScope, $route) {

  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    mepOs = false;
    entryUser = false;
    $rootScope.entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login');
  }
  $scope.Reload = function () {
    $route.reload();
  }

  $scope.SalesmanAdd = function () {
    var obj = { Name: $scope.name, Fname: $scope.fName, Address: $scope.address, Phone: $scope.phone, CNIC: $scope.CNIC };
    //console.log('in SalesmanAdd');
    myService.Salesman(obj).success(function (res) {
      if (res.name) {
        alert('Salesman Already added');
      } else
        if (res == false) {
          alert("Problem in adding your item");
        }
        else {
          alert("Salesman Added!");
        }
    });
  }

});

app.controller("SmanReport", function ($scope, myService, $routeParams, $location, $rootScope, $route) {

  $scope.whenTable = false;
  $scope.whenmonth = false;
  //console.log('here');
  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    mepOs = false;
    entryUser = false;
    $rootScope.entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login');

  }
  var array1 = [];

  getSman();
  var da = new Date();
  $scope.mdate = da.toDateString();
  $scope.date = da.toDateString();
  var wholesale = 0;
  // $scope.mdate = da.toDateString();
  $scope.chooseMonth = [
    { monthId: 0, name: "Select Month", slug: "Choose Month" },
    { monthId: 1, name: "January", slug: "Jan" },
    { monthId: 2, name: "February", slug: "Feb" },
    { monthId: 3, name: "March", slug: "Mar" },
    { monthId: 4, name: "April", slug: "Apr" },
    { monthId: 5, name: "May", slug: "May" },
    { monthId: 6, name: "June", slug: "Jun" },
    { monthId: 7, name: "July", slug: "Jul" },
    { monthId: 8, name: "August", slug: "Aug" },
    { monthId: 9, name: "September", slug: "Sep" },
    { monthId: 10, name: "October", slug: "Oct" },
    { monthId: 11, name: "November", slug: "Nov" },
    { monthId: 12, name: "December", slug: "Dec" }];

  $scope.selectedMonth = angular.copy($scope.chooseMonth[0]);

  $scope.openMonth = function () {
    $scope.whenmonth = true;
  }

  $scope.callIt = function (id, id2) {
    var qty = 0;
    var retail = 0;
    var profit = 0;

    var obj = { name: $scope.chooseSalesman[id].name, date: $scope.chooseMonth[id2].slug };
    myService.getSalemanReport(obj).success(function (res) {
      if (res) {
        //console.log('res', res);
        $scope.whenTable = true;
        for (var i in res) {
          qty = qty + res[i].totalQty;
          //console.log(qty);
          retail = retail + res[i].totalPrice;
          profit = profit + res[i].profit;
        }
        $scope.totalit = qty;
        $scope.myProfit = profit;
        $scope.mysale = retail;
        //console.log(res);
        $scope.sale = res;
        $scope.d = res.len.length;
      }

    });
  }
  $scope.showReturnModal = false;
  $scope.print = function () {
    $scope.showReturnModal = true;
  }

  $scope.Reload = function () {
    $route.reload();
  }

  function getSman() {
    myService.getSaleman().success(function (res) {
      if (res) {
        for (var i = 0; i < array1.length; i++) {
          array1.pop();
        }
        //console.log(res);
        for (var i in res) {
          var obj = { salesmanId: i, name: "" + res[i].name };
          array1.push(obj);
        }
        $scope.chooseSalesman = array1;
      }
    });
  }
});

app.controller('customSalesReport', function ($scope, myService, $routeParams, $location, $rootScope, $route) {

  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    $rootScope.entryUser = false;
    mepOs = false;
    entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login')
  }

  $scope.changeMin = function () {
    $scope.month = Number($scope.startDate.getMonth()) + 1
    $scope.minDate = $scope.startDate.getFullYear() + "-" + $scope.month + "-" + $scope.startDate.getDate()
    document.getElementById("listingDateClose").setAttribute("min", $scope.minDate);
  }


  var qty = 0;
  var arr = [];
  var retail = 0;
  var profit = 0;

  $scope.call = function (startDate, endDate) {
    $scope.whenTable = true;

    while (startDate <= endDate) {
      var sDate = startDate.toDateString();
      arr.push(sDate);
      startDate.setDate(startDate.getDate() + 1);

    }

    var obj = { array: arr }
    myService.weeklyReport(obj).success(function (res) {
      if (res) {
        for (var i in res) {
          qty = qty + res[i].totalQty;
          retail = retail + res[i].totalPrice;
          profit = profit + res[i].profit;
        }
        //console.log(qty);
        $scope.totalit = qty;
        $scope.myProfit = profit;
        $scope.mysale = retail;
        $scope.sale = res;
      }
    });
  }

});

app.controller("pointOfSale", function ($scope, myService, $routeParams, $location, $rootScope, $interval, $route) {

  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    $rootScope.entryUser = false;
    mepOs = false;
    entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login')
  }
  var array = [];
  getSman();
  $scope.showModal = false;
  $scope.showMe = false;
  $scope.sync = function () {

    myService.sync().success(function (res) {
      if (res == true) {
        //console.log('synced1');
      }
      else {
        //console.log(false);
      }
    });
  }
  $interval(function () {
    var d = new Date();
    var timei = d.toLocaleTimeString();
    $scope.mytime = timei;

  }, 1000);
  var flag = true;
  var da = new Date();
  $scope.date = da.toDateString();
  var row;

  var orginalsale = 0;
  $rootScope.location = $location.path();

  $scope.Showed = function () {
    if ($scope.showMe == true) {
      $scope.showMe = false;
    } else {
      $scope.showMe = true;

    }
  }

  var price = [];
  var sum = 0;
  var sold = [];
  $scope.showReturnModal = false;
  $scope.returnItem = function () {

    if (($scope.cash === orginalsale) && ($scope.cash !== '')) {

      var myid = [];
      var name = [];
      var desc = [];
      var retail = [];
      var totalWhole = 0;
      var totalRe = 0;
      for (var i = 0; i < wholesaleArray.length; i++) {
        totalWhole = totalWhole + wholesaleArray[i];
      }
      for (var i = 0; i < retailArray.length; i++) {
        totalRe = totalRe + retailArray[i];
      }
      orginalsale = totalRe - discountedAmount;
      var profit = orginalsale - totalWhole;
      //console.log(profit, totalWhole);
      var obj = { date: $scope.date, time: $scope.mytime, sold: sold, sale: -orginalsale, totalQty: $scope.totalQty, discount: $scope.discount, profit: -profit };
      //console.log(obj);
      myService.returnSale(obj).success(function (res) {
        if (res == false) {

        }
        else {
          for (var i in sold) {
            myid.push('0000' + sold[i].barcode);
            name.push(sold[i].itemName);
            desc.push(sold[i].itemDesc);
            retail.push(sold[i].itemRetail);

          }
          var myData = myid.map(function (value, index) {
            return {

              id: value,
              name: name[index],
              desc: desc[index],
              retail: retail[index]

            }
          });
          $scope.mdate = obj.date;
          $scope.sold = myData;
          $scope.mysale = orginalsale;

          $scope.totalit = $scope.totalQty;
          $scope.mydiscount = $scope.discount;

          //console.log(myData);
          $scope.mtime = obj.time;

          $scope.showReturnModal = !$scope.showReturnModal;
          $scope.slipId = res;


        }

      });
    }
    else {
      alert('Please input Valid Amount');
    }
  }

  $scope.checkOut = function (id) {
    if (($scope.cash >= orginalsale) && ($scope.cash !== '')) {
      var myid = [];
      var name = [];
      var desc = [];
      var retail = [];
      var totalWhole = 0;
      var totalRe = 0;
      var undefined;
      if ($scope.discount == undefined) { $scope.discount = 0; }
      for (var i = 0; i < wholesaleArray.length; i++) {
        totalWhole = totalWhole + wholesaleArray[i];
      }
      for (var i = 0; i < retailArray.length; i++) {
        totalRe = totalRe + retailArray[i];
      }
      orginalsale = totalRe - discountedAmount;
      var profit = orginalsale - totalWhole;
      $scope.SmanChoose = $scope.chooseSalesman[id].name;
      var obj = { date: $scope.date, time: $scope.mytime, sold: sold, sale: orginalsale, totalQty: $scope.totalQty, discount: $scope.discount, profit: profit, salesman: $scope.chooseSalesman[id].name };
      myService.sendSale(obj).success(function (res) {
        if (res == false) {
        }
        else {
          for (var i in sold) {
            myid.push('0000' + sold[i].barcode);
            name.push(sold[i].itemName);
            desc.push(sold[i].itemDesc);
            retail.push(sold[i].itemRetail);

          }
          var myData = myid.map(function (value, index) {
            return {
              id: value,
              name: name[index],
              desc: desc[index],
              retail: retail[index]
            }
          });
          $scope.mdate = obj.date;
          $scope.sold = myData;
          $scope.mysale = orginalsale;

          $scope.totalit = $scope.totalQty;
          $scope.mydiscount = $scope.discount;

          $scope.mtime = obj.time;
          $scope.showModal = !$scope.showModal;
          $scope.slipId = res;

          $scope.return = $scope.cash - $scope.mysale;

        }
      });
    }
    else {
      // alert('Please input Valid Amount');
      alert('inValid Amount');

    }
  }
  $scope.Reload = function () {
    $route.reload();
  }
  var wholesaleArray = [];
  var mySum = 0;

  $scope.addCash = function ($event, amount) {
    var temp;
    var ano;
    var totalRe = 0;
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
      for (var i = 0; i < retailArray.length; i++) {
        totalRe = totalRe + retailArray[i];
      }
      totalRe = totalRe - discountedAmount;
      sum = totalRe;

      if (amount !== '') {
        //console.log(amount);
        if (d === false) {

          //console.log('Discount false');
          temp = sum;
          orginalsale = sum;
          temp = temp - amount;
          $scope.priceSum = temp;
          sum = temp;
          //console.log(sum, temp, mynew);
        }
        else {
          temp = mynew;
          sum = mynew;
          orginalsale = sum;
          //console.log('Discount true');
          temp = temp - amount;
          $scope.priceSum = temp;
          sum = temp;
          //console.log(sum, temp, mynew);
        }
      }
      else {
        if (d === false) {
          for (var i = 0; i < retailArray.length; i++) {
            totalRe = totalRe + retailArray[i];
          }
          sum = totalRe;

          $scope.priceSum = totalRe;
          //console.log(sum, temp, totalRe);
        }
        else {
          $scope.priceSum = sum;
        }
      }

    };
  }

  /* make Select Query fro AddDiscount*/
  /** Add Discount by % */
  $scope.addDiscountpercent = function ($event, amount) {
    var temp;
    sum = mynew;
    var done = false;
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 8) { if (amount === null) { done = true; } else done = false; }
    if (keyCode === 13 || done) {
      if (bool === true) {
        if (amount !== null) {
          d = false;
          temp = sum;
          amount = amount / 100;
          amount = temp * amount;
          amount = Math.round(amount);
          discountedAmount = amount;
          temp = temp - amount;
          $scope.priceSum = temp;
          sum = temp;
          $scope.discount = amount;
        }
        else {
          d = true;
          sum = mynew;
          $scope.priceSum = mynew;
        }
      }
      else {
        alert('Please Do Some Sale');
      }
    }
  }
  var discountedAmount = 0;

  /* dISCOUNT  by rupees function */
  $scope.addDiscount = function ($event, amount) {
    var temp;
    sum = mynew;
    var done = false;
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 8) { if (amount === null) { done = true; } else done = false; }
    if (keyCode === 13 || done) {
      if (bool === true) {
        if (amount !== null) {
          d = false;
          temp = sum;
          discountedAmount = amount;
          temp = temp - amount;
          $scope.priceSum = temp;
          sum = temp;
        }
        else {
          d = true;
          sum = mynew;
          $scope.priceSum = mynew;
        }
      }
      else {
        alert('Please Do Some Sale');
      }
    }
  }

  function ref() {
    var totalRe = 0;
    $scope.cash = 0;
    for (var i = 0; i < retailArray.length; i++) {
      totalRe = totalRe + retailArray[i];
    }
    //console.log('Refreshing', totalRe);
    mynew = totalRe;
    sum = totalRe;
    $scope.priceSum = totalRe;
  }
  $scope.refreshCash = function () {
    ref();
  }



  var qty = [];
  var retailArray = [];
  var myqty = 0;
  var i;
  var bool = false;
  $scope.changedKey = function ($event, row, id) {
    var done = false;
    //console.log(id);
    var keyCode = $event.which || $event.keyCode;
    if (row) {
      if (keyCode === 8) {  //this condtion allow user to remove item by backspace
        if (row.id === '' && retailArray[id - 1] != null) {
          done = true;
        }
        else {
          done = false;
        }
      }
      if (keyCode === 13 || done) {
        //console.log(row);

        if (row.id !== '') {
          if (retailArray[id - 1] == null || retailArray[id - 1] == 0) {
            var abc = { myid: row.id };
            myService.getItem(abc).success(function (res) {
              //console.log(res);
              var totalRe = 0;
              if (res == false) {
                for (var i = 0; i < retailArray.length; i++) {
                  totalRe = totalRe + retailArray[i];
                }
                //console.log('Refreshing', totalRe);
                mynew = totalRe;
                sum = totalRe;
                $scope.priceSum = totalRe;
                DoNull(id);
                alert('Invalid Barcode');
              }
              else if (res.itemQty > 0) {
                var obj = { id: res.barcode, qty: res.itemQty };
                var j = 0;
                //console.log(qty);
                if (qty === []) {
                  //console.log('push', obj);
                  qty.push(obj);
                }
                else {
                  for (i = 0; i < qty.length; i++) {
                    //console.log(qty[i].id, row.id, 'this is length', qty.length, i);
                    if (qty[i].id === res.barcode) {
                      //console.log('checking', qty[i].qty);
                      if (qty[i].qty === 0) {

                        flag = false;
                        //console.log(id, "checkQTY");
                        mySum = sum;

                        alert("Item out of stock");
                      }
                      else {
                        flag = true;

                        qty[i].qty = qty[i].qty - 1;
                        //console.log('Qty', qty[i].qty);
                      }
                      break;
                    }
                    j = i;
                  }
                  if (i === qty.length) {
                    //console.log('push', obj);
                    qty.push(obj);
                  }
                }
                if (j == qty.length) {
                  //console.log('push', obj);
                  flag = true;
                  qty.push(obj);
                }
                if (flag == true) {
                  bool = true;
                  //console.log(flag);
                  myqty++;
                  $scope.totalQty = myqty;
                  mySum = sum;
                  sum = sum + res.itemRetail;
                  //console.log(sum);
                  sold.push(res);
                  mynew = sum;
                  $scope.priceSum = sum;
                  //Vriable foe back value of retailArray


                  function dist() {
                    if (id == 1) {
                      retailArray[0] = res.itemRetail;
                      wholesaleArray[0] = res.itemWholesale;
                      $scope.row1 = res;
                      $scope.row1.id = '000000' + res.barcode;
                    }
                    else if (id == 2) {
                      retailArray[1] = res.itemRetail;
                      wholesaleArray[1] = res.itemWholesale;
                      $scope.row2 = res;
                      $scope.row2.id = '000000' + res.barcode;
                    }
                    else if (id == 3) {
                      retailArray[2] = res.itemRetail;
                      wholesaleArray[2] = res.itemWholesale;
                      $scope.row3 = res;
                      $scope.row3.id = '00000' + res.barcode;
                    }
                    else if (id == 4) {
                      retailArray[3] = res.itemRetail; wholesaleArray[3] = res.itemWholesale;
                      $scope.row4 = res;
                      $scope.row4.id = '00000' + res.barcode;
                    }
                    else if (id == 5) {
                      retailArray[4] = res.itemRetail; wholesaleArray[4] = res.itemWholesale;
                      $scope.row5 = res;
                      $scope.row5.id = '00000' + res.barcode;
                    }
                    else if (id == 6) {
                      retailArray[5] = res.itemRetail; wholesaleArray[5] = res.itemWholesale;
                      $scope.row6 = res;
                      $scope.row6.id = '00000' + res.barcode;
                    }
                    else if (id == 7) {
                      retailArray[6] = res.itemRetail; wholesaleArray[6] = res.itemWholesale;
                      $scope.row7 = res;
                      $scope.row7.id = '00000' + res.barcode;
                    }
                    else if (id == 8) {
                      retailArray[7] = res.itemRetail; wholesaleArray[7] = res.itemWholesale;
                      $scope.row8 = res;
                      $scope.row8.id = '00000' + res.barcode;
                    }
                    else if (id == 9) {
                      retailArray[8] = res.itemRetail; wholesaleArray[8] = res.itemWholesale;
                      $scope.row9 = res;
                      $scope.row9.id = '00000' + res.barcode;
                    }
                    else if (id == 10) {
                      retailArray[9] = res.itemRetail; wholesaleArray[9] = res.itemWholesale;
                      $scope.row10 = res;
                      $scope.row10.id = '00000' + res.barcode;
                    }
                    else if (id == 11) {
                      retailArray[10] = res.itemRetail; wholesaleArray[10] = res.itemWholesale;
                      $scope.row11 = res;
                      $scope.row11.id = '00000' + res.barcode;
                    }
                    else if (id == 12) {
                      retailArray[11] = res.itemRetail; wholesaleArray[11] = res.itemWholesale;
                      $scope.row12 = res;
                      $scope.row12.id = '00000' + res.barcode;
                    }
                    else if (id == 13) {
                      retailArray[12] = res.itemRetail; wholesaleArray[12] = res.itemWholesale;
                      $scope.row13 = res;
                      $scope.row13.id = '00000' + res.barcode;
                    }
                    else if (id == 14) {
                      retailArray[13] = res.itemRetail; wholesaleArray[13] = res.itemWholesale;
                      $scope.row14 = res;
                      $scope.row14.id = '00000' + res.barcode;
                    }
                    else if (id == 15) {
                      retailArray[14] = res.itemRetail; wholesaleArray[14] = res.itemWholesale;
                      $scope.row15 = res;
                      $scope.row15.id = '00000' + res.barcode;
                    }
                    else if (id == 16) {
                      retailArray[15] = res.itemRetail; wholesaleArray[15] = res.itemWholesale;
                      $scope.row16 = res;
                      $scope.row16.id = '00000' + res.barcode;
                    }
                    else if (id == 17) {
                      retailArray[16] = res.itemRetail; wholesaleArray[16] = res.itemWholesale;
                      $scope.row17 = res;
                      $scope.row17.id = '00000' + res.barcode;
                    }
                    else if (id == 18) {
                      retailArray[17] = res.itemRetail; wholesaleArray[17] = res.itemWholesale;
                      $scope.row18 = res;
                      $scope.row18.id = '00000' + res.barcode;
                    }
                    else if (id == 19) {
                      retailArray[18] = res.itemRetail; wholesaleArray[18] = res.itemWholesale;
                      $scope.row19 = res;
                      $scope.row19.id = '00000' + res.barcode;
                    }
                    else if (id == 20) {
                      retailArray[19] = res.itemRetail; wholesaleArray[19] = res.itemWholesale;
                      $scope.row20 = res;
                      $scope.row20.id = '00000' + res.barcode;
                    }

                  }//dist function END

                  dist(); //Function Call

                  //COMIT Item Discount
                }
              } else if (res.itemQty == 0) {
                alert('This item is out of stock');
              }
            });
          }
        }
        else {
          //console.log('yaha');
          if (myqty > 0) {
            myqty--;
          }
          $scope.totalQty = myqty;
          //console.log($scope.totalQty);
          mynew = sum;
          //console.log(sum);
          $scope.priceSum = sum;
          mySum = sum;
          sold.pop(row);

          if (id == 1) {
            sum = sum - $scope.row1.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            retailArray[0] = 0; wholesaleArray[0] = 0;
            $scope.row1 = '';

          }
          else if (id == 2) {

            retailArray[1] = 0; wholesaleArray[1] = 0;
            sum = sum - $scope.row2.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row2 = '';

          }
          else if (id == 3) {
            retailArray[2] = 0; wholesaleArray[2] = 0;
            sum = sum - $scope.row3.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row3 = '';

          }
          else if (id == 4) {
            retailArray[3] = 0; wholesaleArray[3] = 0;
            sum = sum - $scope.row4.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row4 = '';

          }
          else if (id == 5) {
            retailArray[4] = 0; wholesaleArray[4] = 0;
            sum = sum - $scope.row5.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row5 = '';

          }
          else if (id == 6) {
            retailArray[5] = 0; wholesaleArray[5] = 0;
            sum = sum - $scope.row6.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row6 = '';

          }
          else if (id == 7) {
            retailArray[6] = 0; wholesaleArray[6] = 0;
            sum = sum - $scope.row7.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row7 = '';

          }
          else if (id == 8) {
            retailArray[7] = 0; wholesaleArray[7] = 0;
            sum = sum - $scope.row6.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row8 = '';

          }
          else if (id == 9) {
            retailArray[8] = 0; wholesaleArray[8] = 0;

            sum = sum - $scope.row9.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row9 = '';

          }
          else if (id == 10) {
            retailArray[9] = 0; wholesaleArray[9] = 0;

            sum = sum - $scope.row10.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row10 = '';

          }
          else if (id == 11) {
            retailArray[10] = 0; wholesaleArray[10] = 0;

            sum = sum - $scope.row11.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row11 = '';

          }
          else if (id == 12) {
            retailArray[11] = 0; wholesaleArray[11] = 0;

            sum = sum - $scope.row12.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row12 = '';

          }
          else if (id == 13) {
            retailArray[12] = 0; wholesaleArray[12] = 0;

            sum = sum - $scope.row13.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row13 = '';

          }
          else if (id == 14) {
            retailArray[13] = 0; wholesaleArray[13] = 0;

            sum = sum - $scope.row14.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row14 = '';
          }
          else if (id == 15) {
            retailArray[14] = 0; wholesaleArray[14] = 0;

            sum = sum - $scope.row15.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row15 = '';
          }
          else if (id == 16) {

            retailArray[15] = 0; wholesaleArray[15] = 0;

            sum = sum - $scope.row16.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row16 = '';

          }
          else if (id == 17) {
            retailArray[16] = 0; wholesaleArray[16] = 0;

            sum = sum - $scope.row17.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row17 = '';

          }
          else if (id == 18) {
            retailArray[17] = 0; wholesaleArray[17] = 0;

            sum = sum - $scope.row18.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row18 = '';

          }
          else if (id == 19) {
            retailArray[18] = 0; wholesaleArray[18] = 0;

            sum = sum - $scope.row19.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row19 = '';

          }
          else if (id == 20) {
            retailArray[19] = 0; wholesaleArray[19] = 0;

            sum = sum - $scope.row20.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row20 = '';

          }

        }
      }
    }
  }
  function DoNull(id) {
    if (id == 1) {
      retailArray[0] = 0; wholesaleArray[0] = 0;

      $scope.row1 = '';

    }
    else if (id == 2) {
      retailArray[1] = 0; wholesaleArray[1] = 0;

      $scope.row2 = '';

    }
    else if (id == 3) {
      retailArray[2] = 0; wholesaleArray[2] = 0;

      $scope.row3 = '';

    }
    else if (id == 4) {
      retailArray[3] = 0; wholesaleArray[3] = 0;

      $scope.row4 = '';

    }
    else if (id == 5) {
      retailArray[4] = 0; wholesaleArray[4] = 0;

      $scope.row5 = '';

    }
    else if (id == 6) {
      retailArray[5] = 0; wholesaleArray[5] = 0;

      $scope.row6 = '';

    }
    else if (id == 7) {
      retailArray[6] = 0; wholesaleArray[6] = 0;

      $scope.row7 = '';

    }
    else if (id == 8) {
      retailArray[7] = 0; wholesaleArray[7] = 0;

      $scope.row8 = '';

    }
    else if (id == 9) {
      retailArray[8] = 0; wholesaleArray[8] = 0;

      $scope.row9 = '';

    }
    else if (id == 10) {
      $scope.row10 = '';
      retailArray[9] = 0; wholesaleArray[9] = 0;

    }
    else if (id == 11) {
      retailArray[10] = 0; wholesaleArray[10] = 0;

      $scope.row11 = '';

    }
    else if (id == 12) {
      retailArray[11] = 0; wholesaleArray[11] = 0;

      $scope.row12 = '';

    }
    else if (id == 13) {

      retailArray[12] = 0; wholesaleArray[12] = 0;
      $scope.row13 = '';

    }
    else if (id == 14) {
      retailArray[13] = 0; wholesaleArray[13] = 0;

      $scope.row14 = '';
    }
    else if (id == 15) {
      retailArray[14] = 0; wholesaleArray[14] = 0;

      $scope.row15 = '';
    }
    else if (id == 16) {
      retailArray[15] = 0; wholesaleArray[15] = 0;

      $scope.row16 = '';

    }
    else if (id == 17) {
      retailArray[16] = 0; wholesaleArray[16] = 0;

      $scope.row17 = '';

    }
    else if (id == 18) {
      retailArray[17] = 0; wholesaleArray[17] = 0;

      $scope.row18 = '';

    }
    else if (id == 19) {
      retailArray[18] = 0; wholesaleArray[18] = 0;

      $scope.row19 = '';

    }
    else if (id == 20) {
      retailArray[19] = 0; wholesaleArray[19] = 0;

      $scope.row20 = '';

    }
  }

  $scope.print = function () {
    window.print()

  }
  function getSman() {
    myService.getSaleman().success(function (res) {
      if (res) {
        for (var i = 0; i < array.length; i++) {
          array.pop();
        }
        //console.log(res);
        for (var i in res) {
          var obj = { salesmanId: i, name: "" + res[i].name };
          array.push(obj);
        }
        $scope.chooseSalesman = array;
      }
    });
  }

});


/* Discount per item in CHanedkey after retailArray[id] initilize*/

//discount[id-1] = res.itemDiscount;   /* COMIT Dist make the list of item prizes function */

// $scope.itemDiscount = function ($event, amount, para) {
//   var done;
//   var keyCode = $event.which || $event.keyCode ;
//   //console.log('Key: '+keyCode);
//   if (keyCode === 8){ if(amount==null) done = true; else done =false;}
//   if (keyCode === 13 ||done) {
//     if (bool === true) {
//       if (amount == null) { 
//           amount = 0;
//       } /*if passed amount value is null the amount will be 0*/
//       if (amount > discount[para]){  /* if Discount is greater than availabel discount on item show error*/
//         $scope.error[para] = 'max discount on item ' + discount[para];
//       } else{
//         d = false;
//         sum = sum - retailArray[para]  /*subtract previous added prize*/
//         money = tempRetail[para] - amount;  /*Discount save to use Comment*/
//         sum = sum + money; /* Do Discount comment*/
//         mynew = sum;
//         retailArray[para] = money; /*save money for the recipt comment*/
//         $scope.priceSum = sum;
//         $scope.error[para] = ''; /* NULL error*/
//       }
//     }
//     else {
//       //console.log('Nothing happend on line 1176');
//     }
//   }
// }
///* Item DIscount END*/    

/* add discount percent that by drop down   ((in CHanedkey)) */
// $scope.PERCENT = [
//   { 'name': '0%', 'value': '0' },
//   { 'name': '1%', 'value': '1' },
//   { 'name': '2%', 'value': '2' },
//   { 'name': '3%', 'value': '3' },
//   { 'name': '4%', 'value': '4' },
//   { 'name': '5%', 'value': '5' },
//   { 'name': '6%', 'value': '6' },
//   { 'name': '7%', 'value': '7' },
//   { 'name': '8%', 'value': '8' },
//   { 'name': '9%', 'value': '9' },
//   { 'name': '10%', 'value': '10' },
//   { 'name': '11%', 'value': '11' },
//   { 'name': '12%', 'value': '12' },
//   { 'name': '13%', 'value': '13' },
//   { 'name': '14%', 'value': '14' },
//   { 'name': '15%', 'value': '15' },
// ];

// $scope.disco = {
//   'discount': $scope.PERCENT
// };
// var d = true;
// var mynew;
// var discountedAmount = 0;
// $scope.addDiscountpercent = function (amount) {
//   var temp;
//   amount = Number(amount.value);
//   if (bool === true) {
//     sum = mynew;
//     if (sum > 0) {
//       //console.log(amount);
//       d = false;
//       temp = sum;
//       amount = amount / 100;
//       amount = temp * amount;
//       amount = Math.round(amount);
//       discountedAmount = amount;
//       temp = temp - amount;
//       $scope.priceSum = temp;
//       sum = temp;
//       $scope.discount = amount;
//       //console.log(sum, temp, mynew);
//     }
//   }
//   else {
//     $scope.disco = '';
//     alert('Please Do Some Sale');
//   }
// }
