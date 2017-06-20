//modal for istanbul's top sites
var topPicks = [{
        pickName: "Galata Tower", //name of place
        pickLoc: { //lat-longs
                lat: 41.025657,
                lng: 28.974156
        },
        pickAddress: "Bereketzade Mahallesi, Galata Kulesi, 34421 Beyoğlu/İstanbul, Turkey", //address of place
        pickId: '4b732d5bf964a52011a02de3' //id of place
}, {
        pickName: "Hagia Sophia", //name of place
        pickLoc: { //lat-longs
                lat: 41.0089,
                lng: 28.977548
        },
        pickAddress: "Sultan Ahmet Mahallesi, Ayasofya Meydanı, 34122 Fatih/İstanbul, Turkey", //address of place
        pickId: '4bc8088f15a7ef3b6b857ada' //id of place
}, {
        pickName: "Rahmi M. Koç Museum", //name of place
        pickLoc: { //lat-longs
                lat: 41.042273,
                lng: 28.948547
        },
        pickAddress: "Keçeci Piri Mahallesi, Rahmi M Koç Museum Hasköy Cad. No:5, 34445 Beyoğlu/İstanbul, Turkey", //address of place
        pickId: '4bae0155f964a5202a7a3be3' //id of place
}, {
        pickName: "Topkapı Palace", //name of place
        pickLoc: { //lat-longs
                lat: 41.01152,
                lng: 28.983379
        },
        pickAddress: "Cankurtaran Mahallesi, 34122 Fatih/İstanbul, Turkey", //address of place
        pickId: '4b824a4bf964a5202dcf30e3' //id of place
}, {
        pickName: "Dolmabahçe Palace", //name of place
        pickLoc: { //lat-longs
                lat: 41.039164,
                lng: 29.000459
        },
        pickAddress: "Vişnezade Mahallesi, Dolmabahçe Cd., 34357 Beşiktaş/İstanbul, Turkey", //address of place
        pickId: '4c3220f8ac0ab713a5671c1e' //id of place
}, {
        pickName: "Belgrad Ormanı", //name of place
        pickLoc: { //lat-longs
                lat: 41.130647,
                lng: 29.041425
        },
        pickAddress: "Ferahevler Mahallesi, Adnan Kahveci Cad. 61/A, 34457 Sarıyer/İstanbul, Turkey", //address of place
        pickId: '4ba61d6cf964a520ae3439e3' //id of place
}, {
        pickName: "Sakıp Sabancı Museum", //name of place
        pickLoc: { //lat-longs
                lat: 41.106082,
                lng: 29.055652
        },
        pickAddress: "Emirgan Mahallesi, 34467 Sarıyer/İstanbul, Turkey", //address of place
        pickId: '4bffb9b192a6c928b4f542e2' //id of place
}];
//istanbul Modal
var istanbul = [];
var map;
// initialization of map
function initialMap() {
    //assigning div map to this variable
    map = new google.maps.Map(document.getElementById('map'), {
        //start the map with the given center
        center: {  //lat-longs
            lat: 41.0082,
            lng: 28.9784
        },
        //zoom value
        zoom: 10,
     mapTypeControl: false
    });
    //knockout js is used for binding
    ko.applyBindings(new istanbulViewModel());
};
function error(){
  document.getElementById('map').innerHTML="Error in the map";
}



//modal for all the top sites start here
var istanbulViewModel = function() {
        //variable for the infowindow
        var istanbulInfoWindow = new google.maps.InfoWindow();
        //loop for all the different top sites in istanbul
        for (var y = 0; y < topPicks.length; y++) {
                var defaultPickIcon = makePickIcon('0091ff'); //normal marker of the map
                var pickSelect = false; //to select the sites
                var highlightedPickIcon = makePickIcon('FFFF24'); //highlited icom of marker
                var pickName = topPicks[y].pickName;
                var showPick = true; //to show sites
                var pickAddress = topPicks[y].pickAddress; //get location through address
                // site variable to be declared here
                var picks = new google.maps.Marker({
                        map: map,
                        pickName: pickName, //giving name to the location
                        pickAddress: pickAddress, //passing address
                        position: topPicks[y].pickLoc, //giving lat-longs to them
                        animation: google.maps.Animation.DROP, //i want them to drop
                        icon: defaultPickIcon, //to give icon to the places
                        show: ko.observable(showPick), //show the top sites
                        selected: ko.observable(pickSelect), //select site
                        venue: topPicks[y].pickId //through iD of location
                });

                topPicks[y].picks = picks;
                //insert all the sites into the array
                istanbul.push(picks);
                //mouseover event handler
                picks.addListener('mouseover', function() {
                        this.setIcon(highlightedPickIcon);
                });
                //mouseout event handler
                picks.addListener('mouseout', function() {
                        this.setIcon(defaultPickIcon);
                });
                //click event handler
                picks.addListener('click', function() {
                        topPicksInfoWindow(this, istanbulInfoWindow);
                        iconDrop(this);
                });
        }
        //function to display info from wiki using api
        function topPicksInfoWindow(picks, topPickInfo) {
                //get search by place name
                var picksWikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + picks.pickName + '&format=json&callback=wikiCallback';
                //set timout to display error
                var picksWikiTimeout = setTimeout(function() {
                        alert("errorrr");
                }, 5000);
                //getting response through wiki
                $.ajax({
                        url: picksWikiUrl, //search url
                        dataType: "jsonp", //datatype of response
                        success: function(response) { //success function of response
                                var picksWikiList = response[0];
                                //get wiki link for the pick
                                var picksUrl = 'http://en.wikipedia.org/wiki/' + picksWikiList;
                                if (topPickInfo.picks != picks) {
                                        topPickInfo.setContent('');
                                        topPickInfo.picks = picks;
                                        topPickInfo.addListener('closeclick', function() {
                                                topPickInfo.picks = null;
                                        });
                                        //code for streetview
                                        var picksStreetViewService = new google.maps.StreetViewService();
                                        var picksRadius = 50;

                                        function picksGetStreetView(pickData, pickStatus) {
                                                if (pickStatus == google.maps.StreetViewStatus.OK) {
                                                        var pickNearStreetViewLocation = pickData.location.latLng;
                                                        var pickHeading = google.maps.geometry.spherical.computeHeading(pickNearStreetViewLocation, picks.position);
                                                        topPickInfo.setContent("<div class='window'>" + '<b>' + picks.pickName + '</b>' + '<br>' + picks.pickAddress + '<br>' + picks.rating + '<br>' + picks.likes + "</div><br /><br /><a href='" + picksUrl + "'>" + picksUrl + "</a></p>" + '</div><div id="pano">+</div>');
                                                        var pickPanoramaOptions = {
                                                                position: pickNearStreetViewLocation,
                                                                pov: {
                                                                        heading: pickHeading,
                                                                        pitch: 50
                                                                }
                                                        };
                                                        var pickPanorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), pickPanoramaOptions);
                                                } else {
                                                        topPickInfo.setContent("<div class='window'>" + picks.pickName + '<br>' + picks.pickAddress + '<br>' + picks.rating + '<br>' + picks.likes + "</div><br /><br /><a href='" + picksUrl + "'>" + picksUrl + "</a></p>" + '<div>No Street View Found</div>');
                                                }
                                        }
                                        picksStreetViewService.getPanoramaByLocation(picks.position, picksRadius, picksGetStreetView);

                                        topPickInfo.open(map, picks); //giving all locations to map
                                }
                                clearTimeout(picksWikiTimeout); //if locations are found clear the timeout
                        }
                });
        }
        //function for each foursquare api likes and ratings
        istanbul.forEach(function(picks) {
                $.ajax({
                        method: 'GET', //method of getting response
                        dataType: 'json', //type of getting response
                        url: 'https://api.foursquare.com/v2/venues/' + picks.venue + '?client_id=IO0VNRSHKPUW4SQUHO122CBNO2LRVSF5LOWYGC1EIVTZOY2P&client_secret=U1JEAIOOKOISD3ETD2PSVBSMLOW5MSZ44433STU1RGPCZUAU&v=20170305', //user client key and passkey
                        error: function(err) { //error function if invalid response
                                alert("errorr");
                        },
                        success: function(pickData) {
                                //get venue of pick
                                var picksRequest = pickData.response.venue;
                                picks.rating = picksRequest.rating;
								picks.likes= picksRequest.likes;
                                //get rating of the pick(place)
                                if (picksRequest.hasOwnProperty('rating')) {} else {
                                        picks.rating = "0";
                                } //get likes of the pick(place)
                                if (picksRequest.hasOwnProperty('likes')) {
                                        picks.likes = picksRequest.likes.summary;
                                } else {
                                        picks.likes = '0';
                                }
                        }
                });
        });
        //function for animating markers
        function iconDrop(picks) {
                picks.setAnimation(google.maps.Animation.DROP);
                picks.setIcon(highlightedPickIcon);
                setTimeout(function() {
                        picks.setAnimation(null);
                        picks.setIcon(defaultPickIcon);
                }, 930);
                topPicksInfoWindow(picks, istanbulInfoWindow);
        }


        //filtering func
        this.pickFilter = function() {
                var pickText = this.search();
                istanbulInfoWindow.close();
                //show picks according to search
                if (pickText.length === 0) {
                        for (var i = 0; i < istanbul.length; i++) {
                                istanbul[i].show(true);
                                istanbul[i].setVisible(true);
                        }
                } else {
                        //to display picks according to search
                        for (var k = 0; k < istanbul.length; k++) {
                                if (istanbul[k].pickName.toUpperCase().indexOf(pickText.toUpperCase()) > -1) {
                                        istanbul[k].show(true);
                                        istanbul[k].setVisible(true);
                                } else {
                                        istanbul[k].show(false);
                                        istanbul[k].setVisible(false);
                                }
                        }
                }
                istanbulInfoWindow.close();
        };

        //marker image
        function makePickIcon(picksColor) {
                var picksImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + picksColor + '|40|_|%E2%80%A2', new google.maps.Size(21, 34), new google.maps.Point(0, 0), new google.maps.Point(10, 34), new google.maps.Size(22, 33));
                return picksImage;
        }
        //make them Bounce
        this.iconBounce = function(picks) {
                picks.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                        picks.setAnimation(null);
                }, 930);
                topPicksInfoWindow(picks, istanbulInfoWindow);
        };
        this.search = ko.observable('');
};
