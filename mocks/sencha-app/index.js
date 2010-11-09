Ext.setup({
  icon: 'icon.png',
  tabletStartupScreen: 'tablet_startup.png',
  phoneStartupScreen: 'phone_startup.png',
  glossOnIcon: false,

  onReady: function() {
    var postField = new Ext.form.TextField({
      name:'postField',
      //showClear: true,
      placeHolder:'Say something...'
    });

    var textFieldSearch = new Ext.form.TextField({
      name:'textFieldSearch',
      placeHolder:'Search Tweets'
    });
    var loginButton = new Ext.Button({
      text: $loginOrOut,
      //ui: 'action',
      handler: function() {
        if ($loginOrOut == "Login") window.location = $loginUrl;
        else window.location = $logoutUrl;
      }
    });

    var postAjaxRequest = function() {
      if ($loginOrOut == "Login") {
        alert("Sorry, anonymous posting coming soon (waiting on twitter...). For now, please login before posting.");
      } else {
        Ext.getBody().mask(false, '<div class="demos-loading">Loading&hellip;</div>');
        Ext.Ajax.request({
          url: 'postTweet.php?tweet=' + postField.getValue() + '&oauth_token=' + $oauthToken,
          method: 'GET',
          success: function(response, opts) {
            alert(response.responseText);
            Ext.getBody().unmask();
          }
        });
      }
    };

    var postButton = new Ext.Button({
      text: 'Post',
      //ui: 'action',
      handler:postAjaxRequest
    });

    var backToMapButton = new Ext.Button({
      text: 'Map',
      ui: 'back',
      hidden: true,
      handler: function() {
        tabPanel.setActiveItem(map, 'flip');
        backToMapButton.setVisible(false);
      }
    });

    var backToTweetsButton = new Ext.Button({
      text: 'Back',
      ui: 'back',
      hidden: true,
      handler: function() {
        searchAjaxRequest();
        tabPanel.setActiveItem(tweetsPanel, 'cube');
        backToTweetsButton.setVisible(false);
      }
    });

    var searchResultsPanel = new Ext.Panel({
      items: [{contentEl: 'search-div'}]
    });

    var searchAjaxRequest = function() {
      Ext.getBody().mask(false, '<div class="demos-loading">Loading&hellip;</div>');
      if (!searchField.getValue()) {
        backToTweetsButton.setVisible(false);
      } else if (searchField.getValue().length > 0) {
        backToTweetsButton.setVisible(true);
      }
      Ext.Ajax.request({
        url: 'searchTweets.php?search=' + searchField.getValue(), method: 'GET',
        success:function(response, opts) {
          document.getElementById('tweet-div').innerHTML = response.responseText;
          Ext.getBody().unmask();
        }
      });
    }

    var searchHandler = function() {
      if (tabPanel.getActiveItem() == map) {
        Ext.getBody().mask(false, '<div class="demos-loading">Loading&hellip;</div>');
        initMarkers(searchField.getValue());
        Ext.getBody().unmask();
      } else {
        searchAjaxRequest();
        tabPanel.setActiveItem(tweetsPanel, 'cube');
        searchField.setValue('');
      }
    };

    var searchButton = new Ext.Button({
      text: 'Go',
      //ui: 'action',
      handler: searchHandler
    });

    var centerLat = 37.429440;
    var centerLng = -122.172783;
    var defaultZoom = 18;

    var map = new Ext.Map({
      iconCls: 'maps',
      title: 'Map',
      mapOptions: {
        center: new google.maps.LatLng(centerLat, centerLng),
        zoom: defaultZoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        navigationControl: false,
        disableDefaultUI: true
      }
    });

    var searchField = new Ext.form.TextField({
      name:'searchField',
      placeHolder:'Search...',
      //showClear: true,
      listeners: {
        change: searchHandler
      }
    });

    var searchBar = new Ext.Toolbar({
      dock: 'top',
      title: 'Search',
      cls: 'search',
      items: [
        searchField,
        searchButton
      ]
    });

    var postBar = new Ext.Toolbar({
      dock: 'bottom',
      items: [
        postField,
        postButton
      ]
    });

    var searchToggle = new Ext.Button({
      text: 'Search...',
      //ui: 'action',
      handler: function() {
        if (tabPanel.getDockedItems().indexOf(searchBar) > -1) {
          tabPanel.removeDocked(searchBar, false);
          searchToggle.setText('Search...');
        } else {
          tabPanel.addDocked(searchBar);
          searchToggle.setText('Hide Search');
        }
      }
    });

    var companyPanel = new Ext.Panel({
      floating: true,
      modal: true,
      centered: true,
      width: Ext.is.Phone ? 260 : 400,
      height: Ext.is.Phone ? 260 : 400,
      styleHtmlContent: true,
      scroll: 'vertical',
      cls: 'htmlcontent',
      title: 'Company X',
      contentEl: 'company-div'
    });

    var tweetsPanel = new Ext.Panel({
      title: 'Tweets',
      cls: 'buzz',
      iconCls: 'team',
      items: [{contentEl: 'tweet-div'}]
    });

    var toolbar = new Ext.Toolbar({
      dock: 'top',
      items: [
        backToMapButton,
        backToTweetsButton,
        searchToggle,
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
      cardSwitchAnimation: 'cube',
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
          styleHtmlContent: true,
          cls: 'htmlcontent',
          contentEl: 'home-div'
        },
        map,
        tweetsPanel
      ],
      listeners: {
        beforecardswitch: function(container, newCard, oldCard, index, animated) {
          if (newCard == tweetsPanel) {
            searchAjaxRequest();
          }
          tabPanel.removeDocked(searchBar, false);
          searchToggle.setText('Search...');
        }
      }
    });

    tabPanel.addDocked(postBar);

    var minLat = 37.429112,
        maxLat = 37.429515,
        minLng = -122.173227,
        maxLng = -122.172109;

    var lat = pv.Scale.linear(0, 1).range(minLat, maxLat),
        lng = pv.Scale.linear(0, 1).range(minLng, maxLng);

    var labels = [];
    var markers = [];
    var initMarkers = function(search_terms) {
      markers.forEach(function(m) {
        m.setMap(null);
      });
      markers = [];
      /*
      labels.forEach(function(l) {
        l.close();
      });
      */
      var active_companies = [];
      if (search_terms && (search_terms = search_terms.trim()).length > 0) {
        search_terms = search_terms.split(/ +/);
        active_companies = $.grep(companies, function(company, index) {
          var matches = false;
          search_terms.forEach(function(t) {
            var regex = new RegExp(t, 'i');
            if (!matches && company.name.match(regex)) matches = true;
            if (!matches) {
              company.majors.forEach(function(m) {
                if (m.match(regex)) matches = true;
              });
            }
          });
          if (matches && company.logo_url) return true;
          return false;
        });
      } else {
        active_companies = $.grep(companies, function(company, index) {
          if (company.logo_url) return true;
          return false;
        });
      }
      active_companies.forEach(function(c) {
        var newLatLng = new google.maps.LatLng(lat(Math.random()), lng(Math.random()));
        var marker = new google.maps.Marker({
          position: newLatLng,
          map: map.map,
          icon: new google.maps.MarkerImage("company_images/" + c.logo_url),
          title: c.name
        });
        markers.push(marker);
        /*
        var label = new InfoBox({
          content: c.name,
          boxStyle: {
            border: "1px solid #333",
            backgroundColor: "black",
            color: "white",
            padding: "3px",
            textAlign: "center",
            fontSize: "10px",
            width: "56px"
          },
          disableAutoPan: true,
          pixelOffset: new google.maps.Size(-28, 0),
          position: newLatLng,
          closeBoxURL: "",
          isHidden: tabPanel.getActiveItem() != map ? true : false,
          pane: "mapPane",
          enableEventPropagation: true
        });
        label.open(map.map);
        labels.push(label);
        */
        google.maps.event.addListener(marker, 'click', function() {
          $('#company-name').text(marker.title);
          var company = $.grep(companies, function(c) { return c.name == marker.title; })[0]
          $('#company-majors').empty();
          company.majors.forEach(function(m) {
            $('#company-majors').append('<li>' + m + '</li>');
          });
          $('#company-positions').empty();
          company.position_types.forEach(function(p) {
            $('#company-positions').append('<li>' + p + '</li>');
          });
          $('#company-degrees').empty();
          company.degree_level.forEach(function(d) {
            $('#company-degrees').append('<li>' + d + '</li>');
          });
          //tabPanel.setActiveItem(companyPanel, 'flip');
          companyPanel.show();
        });
      });
      map.map.setCenter(new google.maps.LatLng(centerLat, centerLng));
      map.map.setZoom(defaultZoom);
    };
    initMarkers();

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
