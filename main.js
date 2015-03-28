$( function(){

  var menuContens = [
    [ "MAIN",       "main" ],
    [ "PAPER",      "paper" ],
    [ "INTERESTS",  "interest" ],
    [ "CONTACT",    "contact" ],
  ];

  var myTags = [
    "1_長岡高専", "1_電子回路", "1_ロボット制御", "1_旋盤", "1_Androidアプリ",
    "2_筑波大学", "2_論理回路設計", "2_マンガビデオ",
    "3_研究", "3_情報可視化", "3_グラフレイアウト", "3_時刻付きデータ", "3_分析ツール開発",
    "4_プログラミング", "4_JavaScript", "4_d3js", "4_C言語", "4_verilog", "4_ruby", "4_rails", "4_Java", "4_PHP", "4_laravel", "4_HTML", "4_CSS",
    "5_開発", "5_自動選曲システム", "5_VinoMap", "5_プレゼント推薦システム"
  ];

  setScroll();
  drawCloud( myTags );
  setGoogleMap();

  function setScroll(){
    $( "#contents" ).onepage_scroll({
      sectionContainer: "section",
      easing:           "ease",
      animationTime:    1000,
      pagination:       true,
      updateURL:        false
    });

    d3.select( ".onepage-pagination" )
      .selectAll( "li" )
      .data( menuContens )
      .select( "a" )
      .text( function( d ){ return d[0]; } )
      .attr( "id", function( d ){ return "menu_"+d[1]; } );

    d3.selectAll( ".content" )
      .data( menuContens )
      .attr( "id", function( d ){ return d[1]; } );

  }


  function setGoogleMap(){
    var latlng = new google.maps.LatLng( 36.110414, 140.100208 );
 
    /*----- ベースマップのオプション定義 -----*/
    var myOptions = {
        zoom: 15,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    /*----- マップの描画 -----*/
    var map = new google.maps.Map( document.getElementById('map'), myOptions );

    setMapStyle();

    setMarker();



    function setMapStyle(){
      var styles = [
        {
          "featureType": "water",
          "stylers": [
            { "color": "#F5F5F5" }
          ]
        },{
          "featureType": "landscape",
          "stylers": [
            { "color": "#808080" }
          ]
        },{
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            { "color": "#F5F5F5" }
          ]
        },{
          "featureType": "poi.school",
          "elementType": "geometry",
          "stylers": [
            { "color": "#383838" }
          ]
        }
      ];

      var styleName = 'MyStyle';

      map.mapTypes.set( styleName, new google.maps.StyledMapType(styles, { name: styleName }));
      map.setMapTypeId( styleName );
    }


    function setMarker(){
      var markerOptions = {
          position: latlng,
          map: map,
          icon: "marker.png",
          title: '筑波大学 3C棟 316号室'
      };

      var marker = new google.maps.Marker( markerOptions );
    }
  }

  function drawCloud( tags ){
    var svgWidth = 800;
    var svgHeight = 600;

    d3.layout.cloud().size( [ svgWidth, svgHeight ] )
      .words( tags.map( function(d) {
        var tagInfo = d.split( "_" );
        return { text: tagInfo[1], size: 20 + Math.random() * 10, color: tagInfo[0] };
      }))
      .rotate( function() { return ( Math.random() * 20 ) - 10; })　//表示する文字の角度を指定。ここでは、ランダムで　0℃　or 90℃
      .fontSize( function(d) { return d.size; })
      .on( "end", draw )
      .start();

    function draw( words ) {
      var color = d3.scale.category10();
      var count = 0;

      d3.select( "svg" )
          .attr( "width", svgWidth )
          .attr( "height", svgHeight )
        .append( "g" )
          .attr( "transform", "translate(" + ( svgWidth/2 ) + "," + ( svgHeight/2 ) + ")" )
        .selectAll("text")
          .data(words)
        .enter().append( "text")
          .style( "font-size", function(d) { return d.size + "px"; } )
          .style( "fill", function(d){ return color(d.color);} )
          .attr( "id" , function(d){
            count++;
            return "tagID_" + d.text;
          })
          .attr( "text-anchor", "middle" )
          .attr( "transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; //ここで、実際の文字の角度を指定している
          })
          .text(function(d) { return d.text; });
      }

      $("#tagID_マンガビデオ").click(function( event ){
        document.location = "https://www.youtube.com/watch?v=R6EtG7UaVgo";
      });

      $("#tagID_VinoMap").click(function( event ){
        document.location = "https://vinomap.herokuapp.com";
      });
    }
});