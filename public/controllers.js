// import { Router } from "express";

var app = angular.module('myApp.controllers', []);
var meLogin = false;
var mepOs = false;
var entryUser = false;

app.controller('registerUser', function ($scope, myService, $location, $rootScope) {
  $rootScope.loggedOut = true;
});

app.controller("dataEntry", function ($scope, myService, $routeParams, $location, $rootScope, $route, $window, $timeout) {
  console.clear();
  $rootScope.loggedOut = true;
  $scope.NewEntry = false;
  $scope.oldEntry = false;
  $scope.deletepage = false;
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
    $scope.deletepage = false;
  }

  $scope.OldEntry = function () {
    $scope.NewEntry = false;
    $scope.oldEntry = true;
    $scope.deletepage = false;

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



  $scope.deleteItems = function () {
    $scope.deletepage = true;
    var obj = { barcode: $scope.sale.barcode, qty: $scope.delQty }
    myService.deleteItems(obj).success(function (res) {
      if (res) {
        alert('Items Deleted')
        getItem($scope.sale.barcode);
      }
    });
  }

  function getItem(sale) {
    var abc = { barcode: sale }
    myService.getProduct(abc).success(function (res) {
      console.log(res);
      if (res) {
        $scope.stockShow = true;
        var total = res.itemQty * res.itemWholesale;
        $scope.totalLeft = total;
        $scope.sale = res;
      }
    });
  }


  $scope.deleteshow = function () {
    $scope.deletepage = true;
    $scope.oldEntry = false;
    $scope.NewEntry = false;
    $scope.barcodeCheck = "";
    $scope.stockShow = false;
  }

  $scope.deleteProduct = function (sale) {
    //console.log(id);
    myService.deleteProduct(sale).success(function (res) {
      if (res) {
        //console.log(res);
        $scope.stockShow = false;
      } else {
        alert("can't delete sale item");
      }
    });
  }

  $scope.generateOld = function () {
    $scope.showOld = !$scope.showOld;
    var arrayy = [];
    var obj = { id: $scope.sale.barcode, itemCategory: $scope.sale.itemCategory, itemQty: $scope.myQty };
    //console.log(obj);
    // myService.updateEntry(obj).success(function (res) {
    //   if (res == false) {
    //     alert("Problem in adding your item");
    //   }
    // else {

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

    var convert = cipher($scope.sale.itemWholesale);
    var name = $scope.sale.itemName
    if ($scope.sale.itemName && $scope.sale.itemName.length > 25) {
      name = name.substring(0, 25);
    }

    //+'<div class="row">'
    var dressUpFontSize = 120;
    var criticalFontSize = 100;
    var uselessFontSize = 100;

    /**HAssan */
    var MYS = '<div style=" width:50% ;float:left">'
      + '<div style="padding-left:10%;line-height:150px;">'
      + '<div><span style="font-size:' + dressUpFontSize + 'px;">Dress Up</span></div>'
      + '<div><span>' + $scope.sale.type + '</span>'
      + '<span style="float:right; padding-right:20%; font-size:' + criticalFontSize + 'px;">' + $scope.sale.size + '</span></div>'
      + '<div>' + $scope.sale.code + '</div>'
      + '<div>' + convert + '</div>'
      + '</div> </div>'

      + '<div style="width:50% ;float:right;">'
      + '<div><img id="barcodeImage" style="width:90%" class="barImg" src="' + barcodeImage.src + '" /></div>'
      + '<div> '//<div style="font-size:18px;">' + $scope.sale.size + '</div>
      + '<div style="font-size:' + criticalFontSize + 'px;">' + name + '</div> '
      + '<div><span>Rs: ' + $scope.sale.itemRetail + '</span></div>  </div>'
      + '</div>';



    // var MYS = '<div style="max-width: 33.333333%;position: relative; width: 30%; padding-right: 15px; padding-left: 15px;">'
    //   + '<div style="line-height:100px;">'
    //   + '<div><span style="font-size:' + dressUpFontSize + 'px;">Dress Up</span></div>'
    //   + '<div><span>' + $scope.sale.type + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:' + criticalFontSize + 'px;">' + $scope.sale.size + '</span></div>'
    //   + '<div>' + $scope.sale.code + '</div>'
    //   + '<div>' + convert + '</div>'
    //   + '</div> </div>'

    //   + '<div style=" max-width: 66.666667%;position: relative; width: 70%; padding-right: 15px; padding-left: 15px;">'
    //   + '<div><img id="barcodeImage" class="barImg" src="' + barcodeImage.src + '" /></div>'
    //   + '<div style="font-size:' + criticalFontSize + 'px;"> '//<div style="font-size:18px;">' + $scope.sale.size + '</div>
    //   + '<div>' + name + '</div> </div>'
    //   + '<div><span>Rs: ' + $scope.sale.itemRetail + '</span></div>'
    //   + '</div>';

    /**Tahir bhai */
    // var MYS = '<div  style=" width:50% ;float:left ">'
    // + '<div style="font-size:16px; margin-left:0px;line-height: 36px; margin-bottom:20px">'
    // + '<div><span style="font-size:20px;">Dress Up</span></div>'
    // + '<div><span>' + $scope.sale.type + '</span><span style="float:right;font-size:18px;">' + $scope.sale.size + '</span></div>'
    // + '<div>' + $scope.sale.code + '</div><div>' + convert + '</div>'
    // + '</div> </div>'
    // + '<div style="width:50% ;float:right;margin-top:5px">'
    // + '<div><img id="barcodeImage" class="barImg" width="150px" src="' + barcodeImage.src + '" /></div>'
    // + '<div>'
    // + '<div style="font-size:20px;">' + name + '</div> </div>'
    // + '<div><span style="font-size:20px;">Rs: ' + $scope.sale.itemRetail + '</span></div>'
    // + '</div>';

    var arrays = [];
    var myVal = { text: MYS };
    for (var i = 1; i <= $scope.myQty; i++) {
      arrays.push(myVal);
    }
    console.log($scope.myQty);
    console.log(arrays);
    $scope.sa = arrays;
    $timeout(function () {
      $scope.showOld = false;
      var mywindow = window.open('', 'PRINT', 'height=2000,width=1500');
      mywindow.document.write('<html><head>');
      mywindow.document.write('<style>');
      mywindow.document.write('.nameClass{ font-weight:bold; text-transform:uppercase; font-family:MONOSPACE; letter-spacing: 5px;}');
      mywindow.document.write('</style>');
      mywindow.document.write('</head><body style="margin:0; padding: 0;">');
      for (var i = 0; i < arrays.length; i++) {
        mywindow.document.write('<div class= "nameClass" style="width:1900px; margin-bottom:40px;height:900px; font-size: ' + uselessFontSize + 'px;">');
        mywindow.document.write(arrays[i].text);
        mywindow.document.write('</div>');
      }
      mywindow.document.write('</body></html>');
      mywindow.print();
      mywindow.close();
    }, 1000);
    // }
    // });
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

        var convert = cipher($scope.itemWholesale);
        var name = $scope.itemName
        if ($scope.itemName && $scope.itemName.length > 25) {
          name = name.substring(0, 25);
        }

        var dressUpFontSize = 120;
        var criticalFontSize = 100;
        var uselessFontSize = 100;

        var MYS = '<div style=" width:50% ;float:left">'
          + '<div style="padding-left:10%;line-height:150px;">'
          + '<div><span style="font-size:' + dressUpFontSize + 'px;">Dress Up</span></div>'
          + '<div><span>' + $scope.type + '</span>'
          + '<span style="float:right; padding-right:20%; font-size:' + criticalFontSize + 'px;">' + $scope.size + '</span></div>'
          + '<div>' + $scope.code + '</div>'
          + '<div>' + convert + '</div>'
          + '</div> </div>'

          + '<div style="width:50% ;float:right;">'
          + '<div><img id="barcodeImage" style="width:90%" class="barImg" src="' + barcodeImage.src + '" /></div>'
          + '<div> '//<div style="font-size:18px;">' + $scope.sale.size + '</div>
          + '<div style="font-size:' + criticalFontSize + 'px;">' + name + '</div> '
          + '<div><span>Rs: ' + $scope.itemRetail + '</span></div>  </div>'
          + '</div>';



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
          var mywindow = window.open('', 'PRINT', 'height=2000,width=1500');
          mywindow.document.write('<html><head>');
          mywindow.document.write('<style>');
          mywindow.document.write('.nameClass{ font-weight:bold; text-transform:uppercase; font-family:MONOSPACE; letter-spacing: 5px;}');
          mywindow.document.write('</style>');
          mywindow.document.write('</head><body style="margin:0; padding: 0;">');
          for (var i = 0; i < arrays.length; i++) {
            mywindow.document.write('<div class= "nameClass" style="width:1900px; margin-bottom:40px;height:900px; font-size: ' + uselessFontSize + 'px;">');
            mywindow.document.write(arrays[i].text);
            mywindow.document.write('</div>');
          }
          mywindow.document.write('</body></html>');
          mywindow.print();
          mywindow.close();
        }, 1000);
      }

    });

  }

  $scope.go = function () {
    $location.path('editItem');
  }

});

app.controller("editName", function ($scope, myService, $routeParams, $location, $rootScope) {
  $rootScope.loggedOut = true;
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
  $rootScope.loggedOut = true;
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
  $rootScope.loggedOut = false;
  $scope.login = function (username, password) {
    //console.log(username, password)
    if (username === "admin" && password === "515253") {
      meLogin = true;
      $rootScope.menu = true;
      $rootScope.loggedIn = true;
      $rootScope.entryUser = false;
      $rootScope.posUser = false;
      $rootScope.loggedOut = true;
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

  $rootScope.loggedOut = true;
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

app.controller("supplierLedger", function ($scope, $timeout, myService, $window, $route, $routeParams, $location, $rootScope) {

  $rootScope.loggedOut = true;
  $scope.showbill = false;
  $scope.showpay = false;
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
  $scope.showPurchase = false;

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
  var suppId = undefined
  $scope.getSup = function (id) {
    suppId = id;
    $scope.supplierChoose = $scope.chooseSupplier[id].name
    var obj = { Supplier: $scope.chooseSupplier[id].name };
    myService.getBill(obj).success(function (res) {
      if (res === false) {
        alert("You Don't have any bill");
      }
      else {
        $scope.totalDebit = 0;
        $scope.totalCredit = 0;
        $scope.whenTable = true;
        $scope.sales = res;
        for (i in res) {
          $scope.totalDebit = $scope.totalDebit + res[i].debit;
          $scope.totalCredit = $scope.totalCredit + res[i].credit;
        }
      }
    });
  }

  $scope.getByBillNo = function (sale) {
    $scope.totalit = 0;
    var barcode = [];
    console.log(sale.purchaseItems)
    for (i in sale.purchaseItems) {
      barcode.push(sale.purchaseItems[i].barcode)
    }

    var getItemObj = { barcode: barcode }
    myService.getItems(getItemObj).success(function (res) {
      for (i in sale.purchaseItems) {
        res[i]['additem'] = sale.purchaseItems[i].purchaseQty
        $scope.totalit = $scope.totalit + sale.purchaseItems[i].purchaseQty;
      }
      $scope.showItems = res;
      $scope.showPurchase = true;
    });
  }
  /**add bill or payment */
  var myS = 0;
  $scope.showBill = function () {
    $scope.showbill = true;
    myS = 1;
  }

  $scope.showPay = function () {

    $scope.showpay = true;
    myS = 2;
  }

  $scope.addBill = function (bill_No, debit, credit) {
    if (debit == null || credit == null) {
      alert("You can't leave any field empty, Please put 0");
    }
    else {
      var payObj = { supplierName: $scope.supplierChoose, date: $scope.date, bill_No: bill_No, debit: debit, credit: credit, select: myS }
      myService.paymentOrBill(payObj).success(function (res) {
        console.log(res)
        if (res == false) {
          alert('Bill No for this Supplier is already added');
        } else {
          // $route.reload();
          $scope.getSup(suppId)
          $scope.showpay = false;
          $scope.showbill = false;
          $scope.bill_No = '';
          $scope.debit = '';
          $scope.credit = '';
          
          // angular.copy($scope.billForm);
        }


      });
    }
  }
  $scope.printSlip = function () {
    window.print();
  }
  $scope.printBarcode = function (item) {
    arrays = [];
    var arr;
    for (i in item) {
      arr = printBarcodefunc(item[i].additem, item[i]);
    }
    printwindow(arr, 1);
  }

  /** Barcode function brokr into two so it can print more than one item barcode at a time */
  var arrays = [];
  function printBarcodefunc(printQty, PitemBar) { // make barcode for the barcode or barcodes

    var barcode = new bytescoutbarcode128();
    zeroAppend = ""
    if (PitemBar.barcode <= 100) {
      zeroAppend += "0000"
    } else if (PitemBar.barcode <= 1000) {
      zeroAppend += "000"
    }
    else if (PitemBar.barcode <= 10000) {
      zeroAppend += "00"
    } else if (PitemBar.barcode <= 100000) {
      zeroAppend += "0"
    }

    barcode.valueSet(zeroAppend + PitemBar.barcode);
    barcode.setMargins(5, 5, 5, 5);
    barcode.setBarWidth(2);
    var width = barcode.getMinWidth();
    barcode.private_fontSize = 20;
    barcode.setSize(width, 120);
    var barcodeImage = document.getElementById('barcodeImage');
    barcodeImage.src = barcode.exportToBase64(width, 120, 0);

    var convert = cipher(PitemBar.itemWholesale);
    var name = PitemBar.itemName;
    if (PitemBar.itemName && PitemBar.itemName.length > 25) {
      name = name.substring(0, 25);
    }

    var dressUpFontSize = 120;
    var criticalFontSize = 100;


    /**HAssan- Ali*/
    var MYS = '<div style=" width:50% ;float:left">'
      + '<div style="padding-left:10%;line-height:150px;">'
      + '<div><span style="font-size:' + dressUpFontSize + 'px;">Dress Up</span></div>'
      + '<div><span>' + PitemBar.type + '</span>'
      + '<span style="float:right; padding-right:20%; font-size:' + criticalFontSize + 'px;">' + PitemBar.size + '</span></div>'
      + '<div>' + PitemBar.code + '</div>'
      + '<div>' + convert + '</div>'
      + '</div> </div>'

      + '<div style="width:50% ;float:right;">'
      + '<div><img id="barcodeImage" style="width:90%" class="barImg" src="' + barcodeImage.src + '" /></div>'
      + '<div> '//<div style="font-size:18px;">' + PitemBar.size + '</div>
      + '<div style="font-size:' + criticalFontSize + 'px;">' + name + '</div> '
      + '<div><span>Rs: ' + PitemBar.itemRetail + '</span></div>  </div>'
      + '</div>';


    var myVal = { text: MYS };
    for (var i = 1; i <= printQty; i++) {
      arrays.push(myVal);
    }
    return arrays;
  }

  function printwindow(arrays, ref) { // print barcode that saves in PrintBarcodefunc function
    var uselessFontSize = 100;
    $timeout(function () {
      $scope.showOld = false;
      var mywindow = window.open('', 'PRINT', 'height=2000,width=1500');
      mywindow.document.write('<html><head>');
      mywindow.document.write('<style>');
      mywindow.document.write('.nameClass{ font-weight:bold; text-transform:uppercase; font-family:MONOSPACE; letter-spacing: 5px;}');
      mywindow.document.write('</style>');
      mywindow.document.write('</head><body style=" margin:0; padding: 0;">');
      for (var i = 0; i < arrays.length; i++) {
        mywindow.document.write('<div class= "nameClass" style="width:1900px; margin-bottom:10px;height:937px; font-size: ' + uselessFontSize + 'px;">');
        mywindow.document.write(arrays[i].text);
        mywindow.document.write('</div>');
      }
      mywindow.document.write('</body></html>');
      setTimeout(() => {
        mywindow.print();
        mywindow.close();
      }, 1000)

      // mywindow.close();
    }, 1000);
  }
  /** END of two part barcode*/

});

app.controller("newBill", function ($scope, myService, $routeParams, $location, $rootScope, $route) {
  $rootScope.loggedOut = true;

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
  $scope.date = da.toDateString();

  getSup();
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
      var payObj = { supplierName: $scope.chooseSupplier[id].name, date: $scope.date, bill_No: $scope.billNo, debit: $scope.debit, credit: $scope.credit, select: myS }
      myService.paymentOrBill(payObj).success(function (res) {
      });
    }
  }
});

app.controller("lastSale", function ($scope, myService, $routeParams, $location, $rootScope, $route) {
  $rootScope.loggedOut = true;
  $scope.showModal = false;
  
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

  $scope.printSlip = function () {
    $window.print();
  }

  $scope.showBill = function (sale) {
    console.log(sale)
    $scope.bill = sale;
    var obj = { soldItems: sale.soldItems }

    myService.showBill(obj).success(function (res) {
      if (res != 0) {
        $scope.sold = res;
        $scope.showModal = true;
      }
    });
  };

  $scope.return = function (thisItem, bill) {

    if (bill.soldItems.length != 1) {
      /**Find Item On a Dixcount and Evaluate discout and total price*/
      orignal = bill.totalDiscount + bill.totalPrice;
      eachDisPer = (bill.totalDiscount / orignal);
      discountOnItem = Math.round(thisItem.itemRetail * eachDisPer);
      discountNow = bill.totalDiscount - discountOnItem;
      orignalNow = orignal - thisItem.itemRetail;
      totalNow = orignalNow - discountNow;

      var thisObj = { barcode: thisItem.barcode, date: bill.date, time: bill.time, totalPrice: totalNow, totalDiscount: discountNow }
      myService.returnSale(thisObj).success(function (res) {
        if (res) {
          var index = bill.soldItems.indexOf(thisItem.barcode);
          bill.soldItems.splice(index,1);
          $scope.sold.splice(index, 1);
          $scope.bill.totalPrice = totalNow;
          $scope.bill.totalDiscount = discountNow;
          $scope.bill.totalQty--; 
        }
      });
    }
  }

  $scope.Done= function (){
    $scope.showModal=false;
  }
});

app.controller("monthlyReport", function ($scope, myService, $routeParams, $location, $rootScope) {
  $rootScope.loggedOut = true;
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


  var qty = 0;

  var retail = 0;
  var profit = 0;
  $scope.generateReport = function (monthYear) {

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    $scope.varaible = monthNames[monthYear.getMonth()] + " " + monthYear.getFullYear()
    monthYear = [monthNames[monthYear.getMonth()], monthYear.getFullYear()];

    var obj = { monthYear: monthYear }
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
        $scope.whenTable = true;
      }
    });
  }


});

app.controller("dailyReport", function ($scope, myService, $routeParams, $route, $location, $rootScope) {
  $rootScope.loggedOut = true;
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
  var time = da.toLocaleTimeString();
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
          if (res.start != null) {
            alert('Already started your day');
          } else if (res == true) {
            alert($scope.todaycash + ' Cash is added');
          }
        });
        $route.reload();
      }
    }
  }

  $scope.Reload = function () {
    $route.reload();
  }

  $scope.dayexpense = function ($event, title) {
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
      if ($scope.todayexpense !== '') {
        var obj = { date: $scope.mdate, todayexpense: $scope.todayexpense }
        myService.dayExpense(obj).success(function (res) {
          if (res) {
            money = res.sub;
          } else {
            alert("Haven't Entered start day ");
          }
        });
        var obj2 = { date: $scope.mdate, time: time, eTitle: title, expense: $scope.todayexpense }
        myService.expenseLedger(obj2).success(function (res) {
          if (res) {
            alert($scope.todayexpense + " cash is taken for " + title);
          }
        });
        $route.reload();
      }
    }
  }

  $scope.showexpense = function (eDate) {
    $scope.texpense = 0;
    var obj = { date: eDate.toDateString() }
    myService.dailyexpense(obj).success(function (res) {
      if (res) {
        console.log('controller 902')
        for (i in res) {
          $scope.texpense += res[i].expense;
        }
        $scope.expenses = res;
      } else {
        alert('no expense this day');
      }
    });
    $scope.showthis = true;
  }

  $scope.showExpenseLedger = function () {
    $scope.expenseReport = true;
  }

  $scope.print = function () { //print only expanse model/ledger
    $('#dontWanttoPrint').addClass("hidden-print")
    window.print()
  }
  $scope.printfun = function () { // print dailysales ledeger
    window.print()
  }
});

app.controller('addSalesman', function ($scope, myService, $routeParams, $location, $rootScope, $route) {
  $rootScope.loggedOut = true;
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
  $rootScope.loggedOut = true;
  $scope.whenTable = false;
  $scope.whenmonth = false;
  //console.log('here');


  getSman();
  var da = new Date();
  $scope.mdate = da.toDateString();
  $scope.date = da.toDateString();
  var wholesale = 0;


  $scope.openMonth = function () {
    $scope.whenmonth = true;
  }

  $scope.callIt = function (id, monthYear) {
    var qty = 0;
    var retail = 0;
    var profit = 0;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    monthYear = [monthNames[monthYear.getMonth()], monthYear.getFullYear()];

    var obj = { name: $scope.chooseSalesman[id].name, monthYear: monthYear };
    myService.getSalemanReport(obj).success(function (res) {
      if (res) {
        $scope.whenTable = true;
        for (var i in res) {
          qty = qty + res[i].totalQty;
          retail = retail + res[i].totalPrice;
          profit = profit + res[i].profit;
        }
        $scope.totalit = qty;
        $scope.myProfit = profit;
        $scope.mysale = retail;
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
  var array1 = [];

  function getSman() {
    myService.getSaleman().success(function (res) {
      array1 = [];
      if (res) {
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
  $rootScope.loggedOut = true;
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
  $rootScope.loggedOut = true;
  $scope.loggedOut = true;
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

  var d = false;
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
      if (select) {
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
        alert('Salesman is not selected');

      }
    } else {
      alert('inValid amount');
    }
  }

  $scope.goto = function ($event) {
    var that = document.activeElement; //this is used to get focus function$('[tabIndex=' + (+that.tabIndex + 1) + ']')[0].focus(); // changed the key focus to Next tabIndex
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
      $('[tabIndex=' + (+that.tabIndex + 1) + ']')[0].focus(); // changed the key focus to Next tabIndex

    }
  }
  $scope.Reload = function () {
    $route.reload();
  }
  var wholesaleArray = [];
  var mySum = 0;

  $scope.addCash = function ($event, amount) {
    console.log('addcash');
    var temp;
    var ano;
    var totalRe = 0;
    var done = false;
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 8) { if (amount === null) { done = true; } else done = false; }
    if (keyCode === 13 || done) {

      if ($scope.soldIn != undefined && $scope.soldIn != "") { // this gives soldIn price here
        var getDiscount = $scope.priceSum - $scope.soldIn;
        discountedAmount += getDiscount;
        $scope.discount = discountedAmount;
      }

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

    var that = document.activeElement; //this is used to get focus function
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
    if (keyCode === 13) { //this condition also implied cos backspace keycode* is also entring
      $('[tabIndex=' + (+that.tabIndex + 1) + ']')[0].focus(); // changed the key focus to Next tabIndex
    }
  }
  var discountedAmount = 0;

  /* dISCOUNT  by rupees function */
  $scope.addDiscount = function ($event, amount) {

    var temp;
    sum = mynew;
    var that = document.activeElement; //this is used to get focus function
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
      if (keyCode === 13) { //this condition also implied cos backspace keycode* is also entring
        $('[tabIndex=' + (+that.tabIndex + 1) + ']')[0].focus(); // changed the key focus to Next tabIndex
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
    var that = document.activeElement; //this is used to get focus function
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
        if (keyCode === 13) { //this condition also implied cos backspace keycode* is also entring
          $('[tabIndex=' + (+that.tabIndex + 1) + ']')[0].focus(); // changed the key focus to Next tabIndex
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

  var select = false; //this is the variable to check if the salesman is choosed or not
  $scope.choosefunction = function () { // this function is check if the salesman is chosed to give the alert
    var that = document.activeElement; //this is used to get focus function
    select = true;
    $('[tabIndex=' + (+that.tabIndex + 1) + ']')[0].focus(); // changed the key focus to Next tabIndex

  }

});

app.controller("stockInventory", function ($scope, myService, $routeParams, $rootScope, $location, $timeout, $window, $interval, $route) {
  $rootScope.loggedOut = true;
  $scope.add = {};
  getAllItem(); // call all catgeory
  getSup();  /**call all supplier */
  getCat(); /** call all category */

  $interval(function () {
    var d = new Date();
    $scope.mtime = d.toLocaleTimeString();
    $scope.mdate = d.toDateString();
  }, 1000);

  $scope.addTrue = false;
  $scope.per = true;
  $scope.Rs = false;
  $scope.showRetail = 'Retail'
  $scope.showMRP = 'MRP'
  $scope.showAddSupplier = false;
  $scope.balance = 0;

  /**Buttons */
  $scope.showSAdd = function () { //show add supplier fields
    $scope.showAddSupplier = true;
  }

  $scope.showbill = function () {
    if ($scope.selectedSupplier) {  //check if supplier is selected
      if ($scope.bill_No != null) {
        $scope.balance = 0;
        // $scope.balanceModal = true; //Debit or credit Modal
        for (i in purchase) {
          $scope.balance = $scope.balance + (purchase[i].additem * purchase[i].itemWholesale); // calculate Balance
        }
        setTimeout(() => { // delay to open showPurcahse modal to get focus
          $scope.purchased = purchase;
          $scope.showPurchase = true;
        }, 400)
      } else {
        alert('Enter Bill No')
      }
    } else {
      alert('Supplier is not selected')
    }

  }

  $scope.inRs = function () { //show if retail is in % or Rs
    $scope.per = !$scope.per;
    $scope.Rs = !$scope.Rs;
    $scope.add.MRP = "";
    $scope.add.retailRs = "";
  }

  $scope.conversion = function ($event) { // just to show retail price in the field it wasn't needed
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
      if ($scope.add.MRP != "") { // convert percentage  to retail price
        var retailPer = $scope.add.WholeRs * $scope.add.MRP / 100;
        var retailPrice = $scope.add.WholeRs + retailPer;
        $scope.showRetail = Math.round(retailPrice);
      } else if ($scope.add.showRetail != "") {  // convert retail price  to  percentage
        var retailPrice = $scope.add.retailRs - $scope.add.WholeRs;
        var retailPer = retailPrice / $scope.add.WholeRs * 100
        $scope.showMRP = Math.round(retailPer);
      }
    }
  }

  $scope.enter = function ($event) { // this function only to make input to go next line when Enter
    var that = document.activeElement; //this is used to get focus function
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
      $('[tabIndex=' + (+that.tabIndex + 1) + ']')[0].focus(); // changed the key focus to Next tabIndex
    }
  }
  /**Buttons end */
  /** Working function */
  var spare = [];
  $scope.getCate = function (id) { //get category according to the suplier
    $scope.supplierChoose = $scope.chooseSupplier[id].name; //make agnular variable to show supplier name on the slip
    $scope._id = id;
    var obj = { supplier: $scope.supplierChoose }
    var array = [];
    var catid = 1;
    var MT = { categoryId: 0, name: "" + " " }
    array.push(MT);
    myService.getCategoryBySupplier(obj).success(function (res) { // check all items for supplier
      if (res) {
        for (var i in res) {
          var count = 0;
          for (var j in array) { // check uniqu category
            if (array[j].name == res[i].itemCategory) { // get item from category
              count++;
              break;
            }
          }
          if (count == 0) { // push unique category
            var obj = { categoryId: catid, name: "" + res[i].itemCategory };
            array.push(obj);
            catid++;
          }
        }
        $scope.chooseCategories = array; // give category to select query
        $scope.selectedCategories = $scope.chooseCategories[0]; // reload category select option
        spare = res; // save items to call them into category
        $scope.items = spare; // to show in table
        $scope.purchased = []; // null $scope array to show in modal 
        purchase = []; // null array that give scope to array 
        $scope.addTrue = true;
      }
    });
  }

  $scope.getItem = function (id) { // get item to show into the table according to category
    var catitem = [];
    for (i in spare) {
      if (spare[i].itemCategory == $scope.chooseCategories[id].name) {
        catitem.push(spare[i]);
      }
    }
    $scope.items = catitem;
  };

  var purchase = [];
  $scope.addinStock = function ($event, item, additem) { // add added item in supplier function

    // var done;
    var keyCode = $event.which || $event.keyCode;
    // if (keyCode === 8) { if (additem == null) done = true; else done = false; }
    if (keyCode === 13) {       //|| done
      if (additem != null && additem != "") {
        item['additem'] = additem // push into object (push add item qty in array)
        purchase.push(item);
        alert(additem + ' item of ' + item.itemName + ' is added in the list');
        $scope.balance = 0;
        $scope.totalit = 0;
        for (i in purchase) {
          $scope.balance = $scope.balance + (purchase[i].additem * purchase[i].itemWholesale); // calculate Balance
          $scope.totalit = $scope.totalit + purchase[i].additem;
        }
      }
    }
  }

  $scope.printSlip = function () { // this function changes data and print function
    var obj = { purchase: purchase };
    var barcode = [];
    var additem = [];
    var purchaseItems = [];
    for (i in purchase) {
      barcode[i] = purchase[i].barcode; // Don't neeed these two anymore will remove it and chang it in updateData nodejs when git time
      additem[i] = purchase[i].additem;
      purchaseItems[i] = { barcode: purchase[i].barcode, purchaseQty: purchase[i].additem }
    }
    var obj = { barcode: barcode, additem: additem }
    myService.updateData(obj).success(function (res) {
      // console.log(res)
    });

    var billObj = {
      date: $scope.mdate, credit: $scope.credit, debit: $scope.debit, bill_No: $scope.bill_No,
      supplierName: $scope.supplierChoose, purchaseItems: purchaseItems
    }

    myService.addBill(billObj).success(function (res) {
      if (res == false) {
        alert('Bill No for this Supplier is already added');
      } else {
        $window.print();
        arrays = [];
        var arr;
        for (i in purchase) {
          arr = printBarcodefunc(purchase[i].additem, purchase[i]);
        }
        printwindow(arr, 1);
        $scope.barcodemodal = false
        setTimeout(function(){  $window.location.reload(); }, 3000);
        
      }
    });
    // $window.location.reload()

    // $scope.reload() //This wasn't working here so use widnow reload

  }

  $scope.barcode = function (item) { // appear modal to ask for quantity
    $scope.barcodemodal = true;
    $scope.PitemBar = item;
   
  }

  $scope.addNewItem = function () {

    if ($scope.add.MRP != "") { // change wohalse to mrp
      var retailPer = Number($scope.add.WholeRs) * Number($scope.add.MRP) / 100;
      $scope.add.retailRs = Number($scope.add.WholeRs) + retailPer;
      $scope.add.retailRs = Math.round($scope.add.retailRs);
    }
    if ($scope.add.name != "" && $scope.add.decs != "" && $scope.add.additem != "" && $scope.add.WholeRs != "" && $scope.add.retailRs != "" && $scope.add.type != "" && $scope.add.category != "" && $scope.add.size != "" && $scope.add.code != "") {
      var addObj = {
        itemName: $scope.add.name, itemDesc: $scope.add.decs, itemQty: $scope.add.additem, itemWholesale: $scope.add.WholeRs, additem: $scope.add.additem,
        itemRetail: $scope.add.retailRs, itemCategory: $scope.add.category, type: $scope.add.type, size: $scope.add.size, code: $scope.add.code, itemSupplier: $scope.supplierChoose
      };
      var barcode;
      myService.addItem(addObj).success(function (res) {
        if (res.itemName) {
          alert("item is already in");
        }
        else if (res == false) {
          alert("Problem in adding your item");
          check = false;
        } else {
          barcode = res.barcode;
          addObj['barcode'] = barcode
          purchase.push(addObj);
          $scope.items.push(addObj);
        }
      });
      $scope.add.name = ""; $scope.add.decs = ""; $scope.add.additem = ""; $scope.add.WholeRs = ""; $scope.add.MRP = ""; $scope.add.retailRs = "";
      $scope.add.type = ""; $scope.add.category = ""; $scope.add.size = ""; $scope.add.code = "";

      // $scope.selectedSupplier = $scope.chooseSupplier[$scope._id];
    } else {
      alert('filed is empty')
    }
  }

  $scope.addSupp = function (supName) {
    var abc = { supplierName: supName };
    //console.log('adding', abc);
    myService.addPurchaser(abc).success(function (res) {
      if (res == true) {
        alert('New supplier ' + supName);
        $scope.supName = "";
        $scope.showAddSupplier = false;
        // $scope.reload() //This wasn't working here so use widnow reload
        $window.location.reload()
      }
      else {
        alert('Supplier is already Added!');
      }
    });
  }

  $scope.printOldBarcode = function (printQty, PitemBar) { // modal btn function to print barcode only print barcode nothing much
    arrays = [];
    var arr = printBarcodefunc(printQty, PitemBar);

    printwindow(arr, 0);

    $("#pqty").val(''); // do null to the modal field
    $scope.barcodemodal = false; // close modal
  }

  /** call functions */
  /** Barcode function brokr into two so it can print more than one item barcode at a time */
  var arrays = [];
  function printBarcodefunc(printQty, PitemBar) { // make barcode for the barcode or barcodes

    var barcode = new bytescoutbarcode128();
    zeroAppend = ""
    if (PitemBar.barcode <= 100) {
      zeroAppend += "0000"
    } else if (PitemBar.barcode <= 1000) {
      zeroAppend += "000"
    }
    else if (PitemBar.barcode <= 10000) {
      zeroAppend += "00"
    } else if (PitemBar.barcode <= 100000) {
      zeroAppend += "0"
    }

    barcode.valueSet(zeroAppend + PitemBar.barcode);
    barcode.setMargins(5, 5, 5, 5);
    barcode.setBarWidth(2);
    var width = barcode.getMinWidth();
    barcode.private_fontSize = 20;
    barcode.setSize(width, 120);
    var barcodeImage = document.getElementById('barcodeImage');
    barcodeImage.src = barcode.exportToBase64(width, 120, 0);

    var convert = cipher(PitemBar.itemWholesale);
    var name = PitemBar.itemName;
    if (PitemBar.itemName && PitemBar.itemName.length > 25) {
      name = name.substring(0, 25);
    }

    var dressUpFontSize = 120;
    var criticalFontSize = 100;


    /**HAssan- Ali*/
    var MYS = '<div style=" width:50% ;float:left">'
      + '<div style="padding-left:10%;line-height:150px;">'
      + '<div><span style="font-size:' + dressUpFontSize + 'px;">Dress Up</span></div>'
      + '<div><span>' + PitemBar.type + '</span>'
      + '<span style="float:right; padding-right:20%; font-size:' + criticalFontSize + 'px;">' + PitemBar.size + '</span></div>'
      + '<div>' + PitemBar.code + '</div>'
      + '<div>' + convert + '</div>'
      + '</div> </div>'

      + '<div style="width:50% ;float:right;">'
      + '<div><img id="barcodeImage" style="width:90%" class="barImg" src="' + barcodeImage.src + '" /></div>'
      + '<div> '//<div style="font-size:18px;">' + PitemBar.size + '</div>
      + '<div style="font-size:' + criticalFontSize + 'px;">' + name + '</div> '
      + '<div><span>Rs: ' + PitemBar.itemRetail + '</span></div>  </div>'
      + '</div>';


    var myVal = { text: MYS };
    for (var i = 1; i <= printQty; i++) {
      arrays.push(myVal);
    }
    return arrays;
  }

  function printwindow(arrays, ref) { // print barcode that saves in PrintBarcodefunc function
    var uselessFontSize = 100;
    $timeout(function () {
      $scope.showOld = false;
      var mywindow = window.open('', 'PRINT', 'height=2000,width=1500');
      mywindow.document.write('<html><head>');
      mywindow.document.write('<style>');
      mywindow.document.write('.nameClass{ font-weight:bold; text-transform:uppercase; font-family:MONOSPACE; letter-spacing: 5px;}');
      mywindow.document.write('</style>');
      mywindow.document.write('</head><body style=" margin:0; padding: 0;">');
      for (var i = 0; i < arrays.length; i++) {
        mywindow.document.write('<div class= "nameClass" style="width:1900px; margin-bottom:10px;height:937px; font-size: ' + uselessFontSize + 'px;">');
        mywindow.document.write(arrays[i].text);
        mywindow.document.write('</div>');
      }
      mywindow.document.write('</body></html>');
      setTimeout(() => {
        mywindow.print();
        mywindow.close();
      }, 1000)

      // mywindow.close();
    }, 1000);
  }
  /** END of two part barcode*/



  function getSup() { //get suplier in select box
    var array1 = [];
    myService.getSupplier().success(function (res) {
      if (res) {
        //console.log(res);
        for (var i in res) {
          var obj = { supplierId: i, name: "" + res[i].supplierName };
          array1.push(obj);
        }
        $scope.chooseSupplier = array1;
      }
    });
  };

  function getAllItem() { // call all item to show
    var itemsarray = [];
    myService.getAllItem().success(function (res) {
      if (res) {
        $scope.items = res;
        spare = res;
      }
    });
  }

  function getCat() { // call all category before the supplier is selected 
    var array = [];
    myService.getCategory().success(function (res) {
      if (res) {
        //console.log(res);
        for (var i in res) {
          var obj = { categoryId: i, name: "" + res[i].categoryName };
          array.push(obj);
        }
        $scope.chooseCategories = array;
      }
    });
  }
  /** call functions END */
});

app.controller("editItem", function ($scope, myService, $interval, $routeParams, $location, $route, $rootScope) {
  $rootScope.loggedOut = true;
  $scope.deletepage = false;
  $scope.edit = [{}];
  getAllItem(); // call all catgeory
  getSup();  /**call all supplier */
  getCat(); /** call all category */

  $interval(function () {
    var d = new Date();
    $scope.mtime = d.toLocaleTimeString();
    $scope.mdate = d.toDateString();
  }, 1000);

  $scope.conversion = function ($event, id) { // just to show retail price in the field it wasn't needed
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
      if ($scope.edit[id].MRP != "") { // convert percentage  to retail price
        var retailPer = $scope.edit[id].ItemWholesale * $scope.edit[id].MRP / 100;
        var retailPrice = $scope.edit[id].ItemWholesale + retailPer;
        $scope.edit[id].ItemRetail = Math.round(retailPrice);
      }
    }
  }

  /**Buttons end */
  /** Working function */
  var spare = [];
  $scope.getCate = function (id) { //get category according to the suplier
    $scope.supplierChoose = $scope.chooseSupplier[id].name; //make agnular variable to show supplier name on the slip
    $scope._id = id;
    var obj = { supplier: $scope.supplierChoose }
    var array = [];
    var catid = 1;
    var MT = { categoryId: 0, name: "" + " " }
    array.push(MT);
    myService.getCategoryBySupplier(obj).success(function (res) { // check all items for supplier
      if (res) {
        for (var i in res) {
          var count = 0;
          for (var j in array) { // check uniqu category
            if (array[j].name == res[i].itemCategory) { // get item from category
              count++;
              break;
            }
          }
          if (count == 0) { // push unique category
            var obj = { categoryId: catid, name: "" + res[i].itemCategory };
            array.push(obj);
            catid++;
          }
        }
        $scope.chooseCategories = array; // give category to select query
        $scope.selectedCategories = $scope.chooseCategories[0]; // reload category select option
        spare = res; // save items to call them into category
        $scope.items = spare; // to show in table
        $scope.purchased = []; // null $scope array to show in modal 
        purchase = []; // null array that give scope to array 
        $scope.addTrue = true;
      }
    });
  }

  $scope.getItem = function (id) { // get item to show into the table according to category
    var catitem = [];
    for (i in spare) {
      if (spare[i].itemCategory == $scope.chooseCategories[id].name) {
        catitem.push(spare[i]);
      }
    }
    $scope.items = catitem;
  };

  $scope.deleteProduct = function (item) {
    myService.deleteProduct(item).success(function (res) {
      if (res) {
        //console.log(res);
        // $scope.stockShow = false;
        alert("Item Deleted");
      } else {
        alert("can't delete sale item");
      }
    });
  }

  $scope.updateItem = function (item, id) {

    var updateObj = {
      barcode: item.barcode, itemName: $scope.edit[id].ItemName, itemDesc: $scope.edit[id].ItemDesc, type: $scope.edit[id].Type,
      size: $scope.edit[id].Size, code: $scope.edit[id].Code, itemSupplier: $scope.edit[id].ItemSupplier, itemCategory: $scope.edit[id].ItemCategory,
      itemWholesale: $scope.edit[id].ItemWholesale, itemRetail: $scope.edit[id].ItemRetail, itemQty: $scope.edit[id].ItemQty
    }
    myService.updateItem(updateObj).success(function (res) {
      if (res == true) {
        alert('updated');
        $route.reload();
      } else {
        alert('Not update');
      }
    });

  }
  /** call functions */

  /** Barcode function brokr into two so it can print more than one item barcode at a time */


  /** END of two part barcode*/


  function getSup() { //get suplier in select box
    var array1 = [];
    myService.getSupplier().success(function (res) {
      if (res) {
        //console.log(res);
        for (var i in res) {
          var obj = { supplierId: i, name: "" + res[i].supplierName };
          array1.push(obj);
        }
        $scope.chooseSupplier = array1;
      }
    });
  };

  function getAllItem() { // call all item to show
    var itemsarray = [];
    myService.getAllItem().success(function (res) {
      if (res) {
        $scope.items = res;
        spare = res;
      }
    });
  }

  function getCat() { // call all category before the supplier is selected 
    var array = [];
    myService.getCategory().success(function (res) {
      if (res) {
        //console.log(res);
        for (var i in res) {
          var obj = { categoryId: i, name: "" + res[i].categoryName };
          array.push(obj);
        }
        $scope.chooseCategories = array;
      }
    });
  }
  /** call functions END */


});

app.controller("monthlyExpense", async function ($scope, myService, $interval, $route, $rootScope, $window) {
  $rootScope.loggedOut = true;
  $scope.shoModal = false;
  $scope.showthis = false;

  $interval(function () {
    var d = new Date();
    $scope.mtime = d.toLocaleTimeString();
    $scope.mdate = d.toDateString();
  }, 1000)

  $scope.showExpense = function (monthYear) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    $scope.varaible = monthNames[monthYear.getMonth()] + " " + monthYear.getFullYear()
    monthYear = [monthNames[monthYear.getMonth()], monthYear.getFullYear()];

    var obj = { monthYear: monthYear }
    myService.monthExpense(obj).success(function (res) {
      console.log(res)
      if (res) {
        $scope.texpense = 0;
        for (i in res) {
          $scope.texpense = $scope.texpense + res[i].expense;
        }
        $scope.expenses = res;
        $scope.showthis = true;
      }
    });
  }

  $scope.addExpense = function (title, amount) {
    var obj = { date: $scope.mdate, time: $scope.mtime, expenseTitle: title, expense: amount }
    myService.addExpense(obj).success(function (res) {
      if (res) {
        alert('Expense added "~"');
        $route.reload();
      }
    });
  }
  $scope.print = function () {
    $window.print();
  }
});


/** Global Varaible */
function cipher(number) { // change wholesale price to code
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
