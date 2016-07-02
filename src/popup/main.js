var mainApp = angular.module('mainApp', []);

mainApp.config(function($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
});

mainApp.controller('mainCtrl', function($scope) {
    $scope.listings = [];
    chrome.storage.local.get('listings', function(listingsData) {
        if (listingsData.listings) {
            $scope.$apply(function() {
                $scope.listings = listingsData.listings;
                $scope.checkStatus();
            });
        }
    });
    chrome.storage.onChanged.addListener(function(changes) {
        if (changes.listings) {
            var storageChange = changes.listings;
            $scope.$apply(function() {
                $scope.listings = storageChange.newValue;
                $scope.checkStatus();
            });
        }
    });

    $scope.checkStatus = function() {
        if (_.find($scope.listings, {status: 'new'}) || _.find($scope.listings, {status: 'new price'})) {
            chrome.browserAction.setIcon({
                path: {
                    "32": '../../images/icon-new.png'
                }
            });
        } else {
            chrome.browserAction.setIcon({
                path: {
                    "32": '../../images/icon.png'
                }
            });
        }
    };

    $scope.view = function(listing) {
        listing.status = 'old';
        chrome.storage.local.set({
            listings: $scope.listings
        });
        chrome.tabs.create({url: 'http://www.utahrealestate.com/' + listing.id});

        $scope.checkStatus();
    };
});
