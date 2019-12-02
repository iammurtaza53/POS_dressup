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
            console.log("get cat")
            var abc = { asd: 'asd' };
            console.log("Getting")
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

        

        return ergastAPI;
    });