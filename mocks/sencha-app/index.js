Ext.setup({
  icon: 'icon.png',
  tabletStartupScreen: 'tablet_startup.png',
  phoneStartupScreen: 'phone_startup.png',
  glossOnIcon: false,

  onReady: function() {
    var textFieldPost = new Ext.form.TextField({
	name:'textFieldPost',
	placeHolder:'textFieldPost',
	maxLength:'133'
	});
    var loginButton = new Ext.Button({
      text: loginOrOut,
      ui: 'action',
      handler: function() {
	if (loginOrOut == "Login")
	window.location = loginUrl;
	else 
	window.location = logoutUrl;
      }
    });

    var makeAjaxRequest = function() {
      var hashtag = "#SFJF10"
      Ext.getBody().mask(false, '<div class="demos-loading">Loading&hellip;</div>');
      Ext.Ajax.request({
         url: 'postTweet.php?tweet='+textFieldPost.getValue()+'&oauth_token='+oauth_token,
	 method: 'GET',
         success: function(response, opts) {
	 alert(response.responseText); 
         Ext.getBody().unmask();
      }
    });
    };

    var postButton = new Ext.Button({
      text: 'Post',
      ui: 'action',
      handler:makeAjaxRequest
    });

    var backToMapButton = new Ext.Button({
      text: 'Map',
      ui: 'back',
      hidden: true,
      handler: function() {
        tabPanel.setCard(map, 'flip');
        backToMapButton.setVisible(false);
      }
    });

    var searchResultsPanel = new Ext.Panel({
      items: [{contentEl: 'search-div'}]
    });

    var searchButton = new Ext.Button({
      text: 'Go',
      ui: 'action',
      handler: function() {
        tabPanel.setCard(searchResultsPanel, 'flip');
        backToMapButton.setVisible(true);
      }
    });

    var centerLat = 37.429440;
    var centerLng = -122.172783;

    var map = new Ext.Map({
      iconCls: 'search',
      title: 'Map',
      mapOptions: {
        center: new google.maps.LatLng(centerLat, centerLng),
        zoom: 19,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        navigationControl: false,
        disableDefaultUI: true
      }
    });

    var searchBar = new Ext.Toolbar({
      dock: 'top',
      items: [
        {
          xtype: 'field',
          xtype: 'textfield',
          name: 'search',
          placeHolder: 'Search...'
        },
        searchButton
      ]
    });

    var postBar = new Ext.Toolbar({
      dock: 'bottom',
      items: [
        textFieldPost,
        postButton
      ]
    });

    var mapSearchToggle = new Ext.Button({
      text: 'Search...',
      ui: 'action',
      handler: function() {
        if (tabPanel.getDockedItems().indexOf(searchBar) > -1) {
          tabPanel.removeDocked(searchBar, false);
          mapSearchToggle.setText('Search...');
        } else {
          tabPanel.addDocked(searchBar);
          mapSearchToggle.setText('Hide Search');
        }
      }
    });

    var companyPanel = new Ext.Panel({
      title: 'Company X',
      items: [{contentEl: 'company-div'}]
    });

    var tweetsPanel = new Ext.Panel({
      title: 'Tweets',
      html: '<h1>Tweets Tab</h1>',
      cls: 'buzz',
      iconCls: 'team'
    });

    var toolbar = new Ext.Toolbar({
      dock: 'top',
      items: [
        backToMapButton,
        mapSearchToggle,
        {xtype: 'spacer'},
        loginButton
      ]
    });

    var tabPanel = new Ext.TabPanel({
      tabBar: {
        dock: 'bottom',
        layout: {pack: 'center'}
      },
      fullscreen: true,
      ui: 'light',
      animation: 'cube',
      defaults: {
        scroll: 'vertical'
      },
      dockedItems: [
        toolbar
      ],
      items: [
        {
          title: 'Home',
          iconCls: 'user',
          cls: 'home',
          items: [{contentEl: "home-div"}]
        },
        map,
        tweetsPanel
      ]
    });

    tabPanel.addDocked(postBar);

    var minLat = 37.429112,
        maxLat = 37.429515,
        minLng = -122.173227,
        maxLng = -122.172109;

    var lat = pv.Scale.linear(0, 1).range(minLat, maxLat),
        lng = pv.Scale.linear(0, 1).range(minLng, maxLng);

    var labels = [];
    companies.slice(0, 20).forEach(function(c) {
      var newLatLng = new google.maps.LatLng(lat(Math.random()), lng(Math.random()));
      var marker = new google.maps.Marker({
        position: newLatLng,
        map: map.map,
        title: c.name
      });
      var label = new InfoBox({
        content: c.name,
        boxStyle: {
          border: "1px solid black",
          backgroundColor: "white",
          padding: "3px",
          textAlign: "center",
          fontSize: "10px",
          width: "56px"
        },
        disableAutoPan: true,
        pixelOffset: new google.maps.Size(-28, 0),
        position: newLatLng,
        closeBoxURL: "",
        isHidden: true,
        pane: "mapPane",
        enableEventPropagation: true
      });
      label.open(map.map);
      labels.push(label);
      var info = new google.maps.InfoWindow({
        content: c.name + ' details...'
      });
      google.maps.event.addListener(marker, 'click', function() {
        info.open(map.map, marker);
      });
    });

    map.addListener('activate', function() {
      labels.forEach(function(l) {
        l.show();
      });
    });
    map.addListener('deactivate', function() {
      labels.forEach(function(l) {
        l.hide();
      });
    });
  }
});
