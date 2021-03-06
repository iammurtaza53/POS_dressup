var urls = "http://127.0.0.1:8100"
angular.module('myApp.services', []).
    factory('myService', function ($http) {

        var ergastAPI = {};

        ergastAPI.registerUser = function (data) {
            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/register',
                url: urls + '/register',

                data: data
            };
            return $http(req);

        }

        ergastAPI.login = function (abc) {
            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/login',
                url: urls + '/login',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.addCategory = function (abc) {
            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/addCategory',
                url: urls + '/addCategory',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.updateEntry = function (abc) {
            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/updateEntry',
                url: urls + '/updateEntry',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.addBill = function (abc) {
            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/addBill',
                url: urls + '/addBill',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.getBill = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/getBill',
                //  url: 'http://burhanisystem.herokuapp.com/getBill',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.returnSale = function (abc) {
            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/returnSale',
                url: urls + '/returnSale',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.getCategory = function () {
            var abc = { asd: 'asd' };
            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/getCategory',
    
                url: urls + '/getCategory',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.addPurchaser = function (abc) {
            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/addPurchaser',
                url: urls + '/addPurchaser',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.getSupplier = function () {
            var abc = { asd: 'asd' };
            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/getSupplier',
                url: urls + '/getSupplier',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.getDailySlip = function (abc) {

            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/getDailySlip',
                url: urls + '/getDailySlip',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.getSupDetail = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/getSupDetail',
                //  url: 'http://burhanisystem.herokuapp.com/getSupDetail',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.getMonthlySlip = function (abc) {

            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/getMonthlySlip',
                url: urls + '/getMonthlySlip',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.addItem = function (abc) {

            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/addItem',
                url: urls + '/addItem',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.deleteSale = function (abc) {

            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/deleteSale',
                url: urls + '/deleteSale',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.getItem = function (abc) {

            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/getItem',
                url: urls + '/getItem',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.sync1 = function (abc) {

            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/sync1',
                url: urls + '/sync1',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.getSoldItems = function () {
            var abc = { this: 'asd' };

            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/getSoldItems',
                url: urls + '/getSoldItems',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.sync = function () {
            var abc = { this: 'asd' };

            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/sync',
                url: urls + '/sync',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.sendSale = function (abc) {

            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/sendSale',
                url: urls + '/sendSale',

                data: abc
            };
            return $http(req);
        }
        ergastAPI.Salesman = function (abc) {

            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/Salesman',
                url: urls + '/Salesman',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.getSaleman = function () {
            var abc = { asd: 'asd' };
            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/getCategory',
    
                url: urls + '/getSaleman',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.getSalemanReport = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/getSalemanReport',
                //  url: 'http://burhanisystem.herokuapp.com/getSalemanReport',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.startday = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/startday',
                //  url: 'http://burhanisystem.herokuapp.com/startday',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.dayExpense = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/dayExpense',
                //  url: 'http://burhanisystem.herokuapp.com/dayExpense',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.weeklyReport = function (abc) {

            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/weeklyReport',
                url: urls + '/weeklyReport',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.refreshStartday = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/refreshStartday',
                //  url: 'http://burhanisystem.herokuapp.com/refreshStartday',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.expenseLedger = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/expenseLedger',
                //  url: 'http://burhanisystem.herokuapp.com/expenseLedger',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.dailyexpense = function (abc) {

            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/dailyexpense',
                url: urls + '/dailyexpense',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.deleteItems = function (abc) {

            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/deleteItems',
                url: urls + '/deleteItems',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.deleteProduct = function (abc) {

            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/deleteProduct',
                url: urls + '/deleteProduct',
                data: abc
            };
            return $http(req);
        }
        ergastAPI.getProduct = function (abc) {

            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/getProduct',
                url: urls + '/getProduct',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.getCategoryBySupplier = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/getCategoryBySupplier',
                //  url: 'http://burhanisystem.herokuapp.com/getCategoryBySupplier',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.updateData = function (abc) {
            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/updateData',
                url: urls + '/updateData',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.getItems = function (abc) {

            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/getItems',
                url: urls + '/getItems',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.getAllItem = function () {
            var abc = { asd: 'asd' };
            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/getAllItem',
                url: urls + '/getAllItem',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.paymentOrBill = function (abc) {
            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/paymentOrBill',
                url: urls + '/paymentOrBill',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.updateItem = function (abc) {
            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/updateItem',
                url: urls + '/updateItem',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.addExpense = function (abc) {
            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/addExpense',
                url: urls + '/addExpense',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.monthExpense = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/monthExpense',
                //  url: 'http://burhanisystem.herokuapp.com/monthExpense',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.showBill = function (abc) {
            var req = {
                method: 'POST',
                //  url: 'http://burhanisystem.herokuapp.com/showBill',
                url: urls + '/showBill',

                data: abc
            };
            return $http(req);
        }

        return ergastAPI;
    });