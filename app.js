angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective);

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrowCtrl = this;
  narrowCtrl.searchTerm = '';
  narrowCtrl.found = [];

  narrowCtrl.search = function() {
    if (narrowCtrl.searchTerm.trim() === '') {
      narrowCtrl.found = [];
      return;
    }

    var promise = MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm);
    promise.then(function(foundItems) {
      narrowCtrl.found = foundItems;
    });
  };

  narrowCtrl.removeItem = function(index) {
    narrowCtrl.found.splice(index, 1);
  };
}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
  var service = this;

  service.getMatchedMenuItems = function(searchTerm) {
    return $http({
      method: 'GET',
      url: 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json'
    }).then(function(response) {
      var foundItems = [];

      for (var key in response.data) {
        if (response.data.hasOwnProperty(key)) {
          var item = response.data[key];
          if (item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
            foundItems.push(item);
          }
        }
      }

      return foundItems;
    });
  };
}

function FoundItemsDirective() {
  var directive = {
    restrict: 'E',
    templateUrl: 'foundItems.html',
    scope: {
      foundItems: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'foundCtrl',
    bindToController: true
  };

  return directive;
}

function FoundItemsDirectiveController() {
  var foundCtrl = this;
}