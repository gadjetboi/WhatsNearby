angular.module('starter.controllers', [])

.controller('IntroCtrl', function ($scope, $location, $ionicLoading, Geolocation) {

    $scope.getCurrentPosition = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });

        Geolocation.getCurrentPosition(function (position) {
            Geolocation.setPosition(position);

            $ionicLoading.hide();

            $location.path('tab/dashboard');
        });
    }
})

.controller('DashCtrl', function ($scope, $state, $location, $ionicLoading, YelpApi, Geolocation) {

    $scope.loadList = function (term) {

        //if (!YelpApi.getResult())
        //{

        $ionicLoading.show({
            template: 'Loading...'
        });

        var currPosition = Geolocation.getPosition();

        var lat = currPosition.coords.latitude;
        var lng = currPosition.coords.longitude;

        YelpApi.search(lat, lng, term, function (data, status, headers, config) {

            if (status != "200") {
                $scope.dataResult = null;
            }

            YelpApi.setResult(data);

            $ionicLoading.hide();

            $location.path('tab/nearby-list');

        });
        //} 
        //else{
        //    $scope.dataResult = YelpApi.getResult();
        //}
    }
})

.controller('DealCtrl', function ($scope, $ionicLoading, Geolocation, GrouponApi) {

    $ionicLoading.show({
        template: 'Loading...'
    });

    var currPosition = Geolocation.getPosition();

    var lat = currPosition.coords.latitude;
    var lng = currPosition.coords.longitude;

    GrouponApi.search(lat, lng, function (data, status, headers, config) {

        if (status != "200") {
            $scope.dataResult = null;
        }

        GrouponApi.setResult(data);

        $scope.deals = data.deals;

        $ionicLoading.hide();
    })

    $scope.doRefresh = function () {
        //Implement refresh here... call api.. observe location then call api
        $scope.$broadcast('scroll.refreshComplete');
    };
})

.controller('DealDetailCtrl', function ($scope, $stateParams, GrouponApi) {

    var data = GrouponApi.getResult() || null;

    if (!data) {
        alert('Unable to Display Detail');
        return;
    }

    var selectedData = null;

    for (i = 0; i <= data.deals.length; i++) {
        if (data.deals[i].id == $stateParams.id) {
            selectedData = data.deals[i];
            break;
        }
    }
   
    $scope.dealDetail = selectedData;

    $scope.buyInGroupon = function () {

        window.open($scope.dealDetail.options[0].buyUrl, '_blank', 'location=yes,clearcache=yes,clearsessioncache=yes');

    }
})

.controller('NearbyListCtrl', function ($scope, $stateParams, YelpApi) {
    
    var data = YelpApi.getResult();

    $scope.dataResult = data;

    $scope.doRefresh = function () {
        //Implement refresh here... call api.. observe location then call api
        $scope.$broadcast('scroll.refreshComplete');
    };
})

.controller('NearbyDetailCtrl', function ($scope, $stateParams, $location, YelpApi, Map, Geolocation, $state) {

    var data = YelpApi.getResult() || null;

    if (!data)
    {
        alert('Unable to Display Detail');
        return;
    }

    var selectedData = null;

    for (i = 0; i <= data.businesses.length; i++)
    {
        if (data.businesses[i].id == $stateParams.id)
        {   
            selectedData = data.businesses[i];
            break;
        }
    }

    $scope.businessDetail = selectedData;

    var lat_position = $scope.businessDetail.location.coordinate.latitude;
    var lng_position = $scope.businessDetail.location.coordinate.longitude;

    Map.displayGoogleMap(lat_position, lng_position);
    
    $scope.getDirection = function () {

        var currPosition = Geolocation.getPosition();

        var directionObj = {
            'fromLat': currPosition.coords.latitude,
            'fromLng': currPosition.coords.longitude,
            'toLat': $scope.businessDetail.location.coordinate.latitude,
            'toLng': $scope.businessDetail.location.coordinate.longitude
        }

        var googleMapDirectionUrl = "https://www.google.com/maps/dir/" + directionObj.fromLat + "," + directionObj.fromLng + "/" + directionObj.toLat + "," + directionObj.toLng;

        window.open(googleMapDirectionUrl, '_blank', 'location=yes,clearcache=yes,clearsessioncache=yes');
    }
})

.controller('ContactCtrl', function ($scope) {

})


