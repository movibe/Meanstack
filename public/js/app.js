var app = angular.module("myApp", []);

app.controller("AppCtrl", function ($http) {
    var app = this;
    var url = "http://localhost:3000/api/product/";

    app.saveProduct = function (product) {

        $http.post(url, { name:product.name , description: product.description }).success(function () {
            loadProducts();
        });
    };

    app.editProduct = function (product) {
        product.edit = !product.edit;

        if (product.edit == false){
            $http.put(url,{id: product._id, name: product.name, description: product.description}).success(function () {
                loadProducts();
            });
        }
    };

    app.deleteProduct = function (product) {
        $http.delete(url  + product._id ).success(function () {
           loadProducts();
        });
    };

    function loadProducts() {
        $http.get(url).success(function (products) {
            app.products = products;
        });
    }

    loadProducts();
});
