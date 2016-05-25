
// JavaScript Document
 'use strict';

var app = angular.module('appTwTv', []);
  
  //aqui crio o objeto que ira fazer a conexão e trazer o json com as infos para mostrar
  app.factory('twTvApi', function($http) {
	  var obj = {};
	  
 	  //aqui crio o objeto que vai retornar os dados pra consulta
	    obj.getChannels = function(queryText) {
		var api = 'https://api.twitch.tv/kraken/search/channels?q=' + queryText;	
	    var cb = "&callback=JSON_CALLBACK";
		console.log(api + cb);
		
		return $http.jsonp(api + cb);
	 
	  };
	
	obj.getStream= function(queryStream) {
		var api = 'https://api.twitch.tv/kraken/streams/'+ queryStream;
		console.log("query: " + queryStream);
	    var cb = "&callback=JSON_CALLBACK";
		console.log(api + cb);
		
		return $http.jsonp(api );
	 
	  };
	
		return obj;
  });
  
  
app.controller('MainCtrl', function($scope, twTvApi) {
	$scope.Data = {};
 //
 });
  
  
app.filter('unsafe', function($sce) {

    return function(val) {

        return $sce.trustAsHtml(val);
    };

});

//["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"]
 
 //aqui eu crio o bind do "enter" que vai ser usado no text box
app.directive('myEnter', function (twTvApi) {
    return function ($scope, element, attrs) {
        element.bind("keydown", function (event) {
            if(event.which === 13) {
                $scope.$apply(function (){
                    $scope.$eval(attrs.myEnter);
					//alert($scope.queryText);
					//aqui quando da enter carrego a query com a lista pesquisada
					 twTvApi.getChannels($scope.queryText).success(function(data) {
						$scope.channels = data.channels;
						$scope.name = data.name;						
						$scope.hasChannels = true;
						
						
					});
					
                });
						
                event.preventDefault();
            }
        });
    };
});
  

 
  