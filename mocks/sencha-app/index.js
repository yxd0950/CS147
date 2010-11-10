var postField = undefined,
    loginButton = undefined,
    postAjaxRequest = undefined,
    postButton = undefined,
    backToMapButton = undefined,
    backToTweetsButton = undefined,
    searchResultsPanel = undefined,
    searchHandler = undefined,
    searchAjaxRequest = undefined,
    searchButton = undefined,
    centerLat = undefined,
    centerLng = undefined,
    defaultZoom = undefined,
    map = undefined,
    companySearchField = undefined,
    tweetSearchField = undefined,
    searchBar = undefined,
    postBar = undefined,
    searchToggleHandler = undefined,
    postToggleHandler = undefined,
    buttonGroup = undefined,
    companyPanel = undefined,
    tweetsPanel = undefined,
    toolbar = undefined,
    homePanel = undefined,
    externalLinks = undefined,
    tabPanel = undefined;

Ext.setup({
  icon: 'icon.png',
  /*
  tabletStartupScreen: 'tablet_startup.png',
  phoneStartupScreen: 'phone_startup.png',
  */
  glossOnIcon: false,

  onReady: function() {
    postField = new Ext.form.Text({
      name:'postField',
      width: 200,
      margin: 2,
      placeHolder:'Tweet something...'
    });

    loginButton = new Ext.Button({
      text: $loginOrOut,
      ui: 'action',
      handler: function() {
        if ($loginOrOut == "Login with Twitter") window.location = $loginUrl;
        else window.location = $logoutUrl;
      }
    });

    postAjaxRequest = function() {
      Ext.getBody().mask(false, '<div class="demos-loading">Loading&hellip;</div>');
      Ext.Ajax.request({
        url: 'postTweet.php?tweet=' + postField.getValue() + '&oauth_token=' + $oauthToken,
        method: 'GET',
        success: function(response, opts) {
          alert(response.responseText);
          Ext.getBody().unmask();
        }
      });
    };

    postButton = new Ext.Button({
      text: 'Post',
      handler:postAjaxRequest
    });

    backToMapButton = new Ext.Button({
      text: 'Map',
      ui: 'back',
      hidden: true,
      handler: function() {
        tabPanel.setActiveItem(map, 'flip');
        backToMapButton.setVisible(false);
      }
    });

    backToTweetsButton = new Ext.Button({
      ui: 'decline',
      iconMask: true,
      iconCls: 'delete',
      hidden: true,
      handler: function() {
        tweetSearchField.setValue('');
        searchAjaxRequest();
        tabPanel.setActiveItem(tweetsPanel, 'cube');
        backToTweetsButton.setVisible(false);
        //tabPanel.removeDocked(searchBar, false);
      }
    });

    searchResultsPanel = new Ext.Panel({
      items: [{contentEl: 'search-div'}]
    });

    searchAjaxRequest = function() {
      Ext.getBody().mask(false, '<div class="demos-loading">Loading&hellip;</div>');
      Ext.Ajax.request({
        url: 'searchTweets.php?search=' + tweetSearchField.getValue(), method: 'GET',
        success:function(response, opts) {
          document.getElementById('tweet-div').innerHTML = response.responseText;
          Ext.getBody().unmask();
          if (!tweetSearchField.getValue()) {
            backToTweetsButton.setVisible(false);
          } else if (tweetSearchField.getValue().length > 0) {
            backToTweetsButton.setVisible(true);
          }
        }
      });
    }

    searchHandler = function() {
      if (tabPanel.getActiveItem() == map) {
        Ext.getBody().mask(false, '<div class="demos-loading">Loading&hellip;</div>');
        initMarkers(companySearchField.getValue());
        Ext.getBody().unmask();
      } else {
        searchAjaxRequest();
        tabPanel.setActiveItem(tweetsPanel, 'cube');
        //tweetSearchField.setValue('');
      }
    };

    searchButton = new Ext.Button({
      text: 'Go',
      handler: searchHandler
    });

    centerLat = 37.429440;
    centerLng = -122.172783;
    defaultZoom = 18;

    map = new Ext.Map({
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

    companySearchField = new Ext.form.Text({
      name:'searchField',
      placeHolder:'Search companies...',
      hidden: true,
      width: 165,
      margin: 2,
      listeners: {
        change: searchHandler
      }
    });

    tweetSearchField = new Ext.form.Text({
      name:'searchField',
      placeHolder:'Search tweets...',
      width: 165,
      margin: 2,
      listeners: {
        change: searchHandler
      }
    });

    searchBar = new Ext.Toolbar({
      dock: 'top',
      cls: 'search',
      items: [
        companySearchField,
        backToTweetsButton,
        tweetSearchField,
        searchButton
      ]
    });

    searchBubble = new Ext.Panel({
      floating: true,
      modal: true,
      width: '90%',
      dockedItems: [
        {
          xtype: 'toolbar',
          items: [
            companySearchField,
            backToTweetsButton,
            tweetSearchField,
            searchButton
          ]
        }
      ],
      listeners: {
        hide: function(component) {
          buttonGroup.setPressed(0, false);
          buttonGroup.setPressed(1, false);
        }
      }
    });

    postBar = new Ext.Toolbar({
      dock: 'top',
      cls:'post',
      items: [
      ]
    });

    postBubble = new Ext.Panel({
      floating: true,
      modal: true,
      width: '90%',
      dockedItems: [
        {
          xtype: 'toolbar',
          items: [
            postField,
            postButton
          ]
        }
      ],
      listeners: {
        hide: function(component) {
          buttonGroup.setPressed(0, false);
          buttonGroup.setPressed(1, false);
        }
      }
    });

    searchToggleHandler = function() {
      /*
      if (tabPanel.getDockedItems().indexOf(searchBar) > -1) {
        //tabPanel.removeDocked(searchBar, false);
      } else {
        //tabPanel.removeDocked(postBar, false);
        //tabPanel.addDocked(searchBar);
      */
        searchBubble.showBy(buttonGroup);
      //}
    };

    postToggleHandler = function() {
      /*
      if (tabPanel.getDockedItems().indexOf(postBar) > -1) {
        tabPanel.removeDocked(postBar, false);
      } else {
        tabPanel.removeDocked(searchBar, false);
        tabPanel.addDocked(postBar);
      }
      */
      postBubble.showBy(buttonGroup);
    };

    searchToggleButton = {
      iconMask: true,
      iconCls: 'search',
      handler:searchToggleHandler
    };

    postToggleButton = {
      iconMask: true,
      iconCls: 'compose',
      handler:postToggleHandler
    };

    buttonGroup = new Ext.SegmentedButton({
      allowDepress: true,
      items:[searchToggleButton,postToggleButton]
    });

    companyPanel = new Ext.Panel({
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

    tweetsPanel = new Ext.Panel({
      title: 'Tweets',
      cls: 'buzz',
      iconCls: 'team',
      items: [{contentEl: 'tweet-div'}]
    });

    toolbar = new Ext.Toolbar({
      dock: 'top',
      items: [
        buttonGroup,
        backToMapButton,
        {xtype: 'spacer'},
        loginButton
      ]
    });

    externalLinks = new Ext.SegmentedButton({
      allowDepress: true,
      items: [
        {
          xtype: 'button',
          iconMask: true,
          iconCls: 'action',
          iconAlign: 'right',
          padding: 5,
          text: 'Get directions&nbsp;',
          handler: function() {
            navigator.geolocation.getCurrentPosition(function(pos) {
              externalLinks.setPressed(0, false);
              externalLinks.setPressed(1, false);
              window.location = 'http://maps.google.com/maps?saddr=' + pos.coords.latitude + ',' + pos.coords.longitude + '&daddr=37.42955,-122.17269';
            });
          }
        },
        {
          xtype: 'button',
          iconMask: true,
          iconCls: 'action',
          iconAlign: 'right',
          padding: 5,
          text: 'More details @ CDC&nbsp;',
          handler: function() {
            externalLinks.setPressed(0, false);
            externalLinks.setPressed(1, false);
            window.location = 'http://cdc.stanford.edu/';
          }
        }
      ]
    });

    homePanel = new Ext.Panel({
        //floating: true,
        centered: true,
        width: Ext.is.Phone ? 260 : 400,
        height: Ext.is.Phone ? 260 : 400,
        styleHtmlContent: true,
        cls: 'htmlcontent',
        title: 'Home',
        iconCls: 'user',
        bodyPadding: 0,
        bodyMargin: 0,
        margin: 0,
        padding: 0,
        contentEl: 'home-div',
        dockedItems: [
          {
            xtype: 'toolbar',
            dock: 'bottom',
            items: [
              {xtype: 'spacer'},
              externalLinks,
              {xtype: 'spacer'}
            ]
          }
        ]
    });

    tabPanel = new Ext.TabPanel({
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
        homePanel,
        map,
        tweetsPanel
      ],
      listeners: {
        beforecardswitch: function(container, newCard, oldCard, index, animated) {
          if (newCard == tweetsPanel) searchAjaxRequest();
          buttonGroup.setPressed(0, false);
          buttonGroup.setPressed(1, false);
          /*
          tabPanel.removeDocked(searchBar, false);
          tabPanel.removeDocked(postBar, false);
          */
        }
      }
    });

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
          companyPanel.show();
        });
      });
      map.map.setCenter(new google.maps.LatLng(centerLat, centerLng));
      map.map.setZoom(defaultZoom);
    };
    initMarkers();

    homePanel.addListener('beforeactivate', function() {
      backToTweetsButton.setVisible(false);
      if (!$isLoggedIn) loginButton.setText("Login with Twitter");
    });

    tweetsPanel.addListener('beforeactivate', function() {
      companySearchField.setVisible(false);
      tweetSearchField.setVisible(true);
      //if (!$isLoggedIn) loginButton.setText("Login");
      if (!tweetSearchField.getValue()) {
        backToTweetsButton.setVisible(false);
      } else if (tweetSearchField.getValue().length > 0) {
        backToTweetsButton.setVisible(true);
        //tabPanel.addDocked(searchBar);
        searchBubble.showBy(buttonGroup);
      }
    });

    map.addListener('beforeactivate', function() {
      backToTweetsButton.setVisible(false);
      tweetSearchField.setVisible(false);
      companySearchField.setVisible(true);
      if (!$isLoggedIn) loginButton.setText("Login with Twitter");
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
