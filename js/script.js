const App = angular.module('App', []);

App.controller('AppCtrl', ['$scope', function($scope){

  $(document).ready(function(){
    // $('select').formSelect();
  });

  //

  $scope.reviewsList = {
    "March 2018": { name: "March 2018", href: "reviews/march_2018.csv" }
  };

  $scope.currentReview = {};

  // Functions

  function fetch_review_csv(href) {
    return fetch(href).then(function(r){ return r.text() })
  }

  function add_reviews_option(review) {
    return new Promise(function(resolve, reject){
      fetch_review_csv(review.href)
      .then(function(csvText){
        $scope.reviewsList[review.name].csvText = csvText;
        $scope.reviewsList[review.name].reviews = $.csv.toObjects(csvText);;
        $('#review-select').append('<option value="' + review.name + '">' + review.name + '</option>');
        return resolve();
      })
    });
  }

  function add_all_reviews_options() {
    return new Promise(function(resolve, reject){
      let promises = [];
      Object.keys($scope.reviewsList).forEach(function(key){
        let review = $scope.reviewsList[key];
        promises.push(add_reviews_option(review));
      });
      Promise.all(promises)
      .then(function(values){
        return resolve();
      })
    });
  }

  function init_select_listener() {
    $('#review-select').change(function(){
      let opt = $(this).val();
      if($scope.reviewsList[opt]) {
        $scope.currentReview = $scope.reviewsList[opt];
        $scope.$apply();
      }
    });
  }

  add_all_reviews_options()
  .then(function(){
    console.log('done loading all reviews');
    console.log( $scope);
    $('select').formSelect();
    init_select_listener();
  })

}]);
