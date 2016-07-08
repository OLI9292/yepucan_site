/**
 * AngularJS module to process a form.
 */
angular.module('yepUcan', ['ajoslin.promise-tracker'])
  .controller('help', function ($scope, $http, $log, promiseTracker, $timeout) {
    $scope.categoryOptions = {
      'category1': 'Apparel',
      'category2': 'Car Service',
      'category3': 'Clothing',
      'category4': 'Technology',
      'category5': 'Other'
    };

    $scope.progress = promiseTracker();


    $scope.submit = function(form) {

      $scope.submitted = true;

      if (form.$invalid) {
        return;
      }

      var config = {
        params : {
          'callback' : 'JSON_CALLBACK',
          'email' : $scope.email,
          'category' : $scope.category,
        },
      };

      var $promise = $http.jsonp('form.json', config)
        .success(function(data, status, headers, config) {
          if (data.status == 'OK') {
            $scope.email = null;
            $scope.category = null;
            $scope.messages = 'Your form has been sent!';
            $scope.submitted = false;
          } else {
            $scope.messages = 'Oops, we received your request, but there was an error processing it.';
            $log.error(data);
          }
        })
        .error(function(data, status, headers, config) {
          $scope.progress = data;
          $scope.messages = 'There was a network error. Try again later.';
          $log.error(data);
        })
        .finally(function() {
          $timeout(function() {
            $scope.messages = null;
          }, 3000);
        });

      $scope.progress.addPromise($promise);
    };
  });
  