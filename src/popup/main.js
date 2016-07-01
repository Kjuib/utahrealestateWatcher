chrome.browserAction.setIcon({
    path: {
        "32": '../../images/icon-new.png'
    }
});

var mainApp = angular.module('mainApp', []);

mainApp.config(function($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
});

mainApp.controller('mainCtrl', function($scope) {
    $scope.listings = ['taco'];
    chrome.storage.sync.get('listings', function(listingsData) {
        if (listingsData.listings) {
            $scope.$apply(function() {
                $scope.listings = listingsData.listings;
            });
        }
    });
    chrome.storage.onChanged.addListener(function(changes) {
        if (changes.listings) {
            var storageChange = changes.listings;
            $scope.$apply(function() {
                $scope.listings = storageChange.newValue;
            });
        }
    });
});
