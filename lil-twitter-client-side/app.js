(function(){
  var app = angular.module('lil-twitter', ['angularMoment']).constant('angularMomentConfig', {});

  app.controller('TweetController', ['$scope', '$http', '$interval', function($scope, $http, $interval) {

    getRecentTweets()
    $interval(getRecentTweets,5000)

    function parseDate(text) {
      return new Date(Date.parse(text.replace(/( +)/, ' UTC$1')));
    }

    function parseAllDates(data) {
      angular.forEach(data, function(element) {element.time = parseDate(element.created_at)})
    }

    function getRecentTweets() {
      console.log("Running.")
      $http.get('http://localhost:3000/tweets/recent').
      success(function(data, status, headers, config) {
        parseAllDates(data)
        $scope.recentTweets = data
      }).
      error(function(data, status, headers, config) {
      });
    }

    $http.get('http://localhost:3000/hashtags/popular').
    success(function(data, status, headers, config) {
      $scope.popularHashtags = data
    }).
    error(function(data, status, headers, config) {
    });

    $scope.getByTweetsByHashTag = function() {
      $http.get('http://localhost:3000/tweets/search/' + this.hashtag).success(function(data){
        $scope.errorClass=''
        parseAllDates(data)
        $scope.recentTweets = data;
      }).error(function(){
        $scope.errorClass = 'red'
      });
    };

    $scope.save = function() {
      $http.post('http://localhost:3000/tweets', {tweet: {content: $scope.tweet.content}}).success(function(data){
        $scope.recentTweet = data
        $scope.recentTweet.time = parseDate($scope.recentTweet.created_at)
        $scope.recentTweets.unshift($scope.recentTweet)
        $scope.tweet.content = ''
      })
    }
  }]);
})();
