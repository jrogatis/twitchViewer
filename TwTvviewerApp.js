
// JavaScript Document
 'use strict';

var app = angular.module('appTwTv', []);

  //aqui crio o objeto que ira fazer a conexão e trazer o json com as infos para mostrar
  app.factory('twTvApi' ,function($http) {
	  var obj = [];
	  
	
	  	  
	  //funcao que busca  o json com as inf adionais do canal
	obj.getStream = function(channelName) {
		var apiStream = 'https://api.twitch.tv/kraken/streams/'+ channelName;
	    var cbStream = "?callback=JSON_CALLBACK";
		//console.log("stream: " +apiStream + cbStream);
		
		var streamRet = $http.jsonp(apiStream + cbStream);
			//channel.stream = JSON.stringify(stream);	
			//console.log("stream no get : " + 	JSON.stringify(stream))	;
		return streamRet;
	 
	  };
	  
	  //funcao que busca  o json do canal	  
	  obj.getChannel = function(queryChannel)  {
		  var api = 'https://api.twitch.tv/kraken/channels/' + queryChannel;	
		  var cb = "?callback=JSON_CALLBACK";
		 
		 // console.log("getChannel : " + api + cb);
		  var channelRet =  $http.jsonp(api + cb); 
		  return  channelRet;
			
 	 };
	  
 	  //aqui crio o objeto que vai retornar os dados pra consulta
	 obj.getChannels = function(queryText) {
		var api = 'https://api.twitch.tv/kraken/search/channels?q=' + queryText;	
	    var cb = "&callback=JSON_CALLBACK";
		
		var channels = $http.jsonp(api + cb);
		
			
		return channels;
	 
	  };
	  
		return obj;
  });
  
  
app.controller('MainCtrl',  function($q, $scope, twTvApi) {
var channels = [];
	var init = function () {
		
  		var preLoad = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
			//pre carrega a lista de canais no load da página
	
	
		for (var i=0; i < preLoad.length; i++) {
			//console.log("no init " + preLoad[i]);					 
			 
		  var promises = [];
		 
		  promises.push(twTvApi.getChannel(preLoad[i]));
		  promises.push(twTvApi.getStream(preLoad[i]));
		   
		   
		  $q.all(promises).then(function(results) {
	
			  var channelRet = results[0];
			  var streamRet = results[1];
			  
				//console.log("Channel leng"  + results[0].display_name) ;
				//console.log("stream leng"  + streamRet.display_name) ;	
			
				if (streamRet.data.stream === null){
						channelRet.data.onLine = false;
						channelRet.data.stream = "null";
						//console.log("porra sem sinal");
					} else {
						channelRet.data.onLine = true;
						channelRet.data.stream = streamRet.data.stream.channel.status;
						//console.log("porra COM sinal" +  channelRet.data.display_name );
						//console.log("stream json "  + JSON.stringify(streamRet.data)) ;
						//console.log("channel json "  + JSON.stringify(channelRet.data)) ;
								
						}
		
			channels.push( channelRet.data);
			//console.log("Channel "  + channelRet.data.display_name) ;
			//console.log("channel stream "  + channelRet.data.stream) ;
			//console.log("channel json "  + JSON.stringify(channelRet.data)) ;
			  
		  }); //fim do q
				
		 }//fim do for
		 $scope.channels = channels;
    	 $scope.hasChannels = true;
		
	}; //FIM DO INIT
	
	init();
	
 }); //FIM DO CONTROLER
  
  
	
app.filter('unsafe', function($sce) {

    return function(val) {

        return $sce.trustAsHtml(val);
    };

});


 
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
						//console.log("no enter " + $scope.channels.length);				
						$scope.hasChannels = true;
						/*for (var i = 0; i < $scope.channels.length; i++) {
							twTvApi.getStream($scope.channels[i].name).success(function(dataStream){
								
								
									if (dataStream.stream == null) {
										console.log("nulo " + dataStream.stream);
										$scope.onLine = false;
									
									} else {
										//console.log(" não nulo " + $scope.channels[i].name);
										console.log(" não nulo " + dataStream.stream._id);
										$scope.onLine = true;
										} 
							

								
							});
								
						} */
					
						
						
					});
					
                });
						
                event.preventDefault();
            }
        });
    };
});
  

 
  