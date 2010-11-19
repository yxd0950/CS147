var postField = undefined,
    postBubbleField = undefined,
    loginButton = undefined,
    postAjaxRequest = undefined,
    postButton = undefined,
    postBubbleButton = undefined,
    backToMapButton = undefined,
    backToTweetsButton = undefined,
    searchResultsPanel = undefined,
    searchHandler = undefined,
    markerClickHandler = undefined,
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
    serachToggleButton = undefined,
    searchToggleHandler = undefined,
    postToggleButton = undefined,
    postToggleHandler = undefined,
    buttonGroup = undefined,
    companyPanel = undefined,
    tweetsPanel = undefined,
    toolbar = undefined,
    homePanel = undefined,
    externalLinks = undefined,
    labels = undefined,
    markers = undefined,
    tabPanel = undefined,
    AnonymousPosting = "AP",
    RegularPosting = "RP",
    MapZoom = "MZ",
    SearchCompany = "SC",
    BirdIcon = "BI",
    BottomTweetButton = "BTB",
    CompanyList = "CL";

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
      width: '90%',
      maxLength: '132',
      placeHolder: $isLoggedIn ? 'Tweet something...' : 'Tweet anonymously...'
    });

       loginButton = new Ext.Button({
      text: $loginOrOut,
      ui: 'action',
      handler: function() {
        if ($loginOrOut == "Login with Twitter") window.location = $loginUrl;
        else window.location = $logoutUrl;
      }
    });

    trackingAjaxRequest = function(data){
	Ext.Ajax.request({
	url: 'tracking.php?data=' + data,
        method: 'GET'
	})
    }
    postAjaxRequest = function() {
      Ext.getBody().mask(false, '<div class="demos-loading">Loading&hellip;</div>');
      var postValue = undefined;
      if (tabPanel.getActiveItem() == tweetsPanel) {
        postValue = postField.getValue();
      } else {
        postValue = postBubbleField.getValue();
      }
      if ($loginOrOut == "Login with Twitter")
      _gaq.push(['_trackEvent', 'Post', AnonymousPosting]);
      else 
      _gaq.push(['_trackEvent', 'Post', RegularPosting]);

      Ext.Ajax.request({
        url: 'postTweet.php?tweet=' + postValue + '&oauth_token=' + $oauthToken,
        method: 'GET',
        success: function(response, opts) {
          alert(response.responseText);
          postField.setValue('');
          postBubbleField.setValue('');
          Ext.getBody().unmask();
        }
      });
    };
 postAjaxRequestBubble = function() {
//CS company search
   _gaq.push(['_trackEvent', 'Buttons', BirdIcon]);
   trackingAjaxRequest(BirdIcon);
   postAjaxRequest();
} 

 postBubbleField = new Ext.form.Text({
      name:'postBubbleField',
      width: '90%',
      maxLength: '132',
      placeHolder: $isLoggedIn ? 'Tweet something...' : 'Tweet anonymously...',
      listeners:{
	change:postAjaxRequestBubble
	}	
    });


  
    postButton = new Ext.Button({
      text: 'Post',
      ui: 'action',
      iconMask: true,
      iconCls: 'twitterbird',
      iconAlign: 'right',
      handler: postAjaxRequest
    });

    postAjaxRequestBubble = function() {
    postAjaxRequest();
}
    postBubbleButton = new Ext.Button({
      text: 'Post',
      handler: postAjaxRequestBubble
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
        //tabPanel.setActiveItem(tweetsPanel, 'slide');
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
      if (tabPanel.getActiveItem() == map || tabPanel.getActiveItem() == homePanel) {
	trackingAjaxRequest(SearchCompany);
        tabPanel.setActiveItem(map, 'slide');
        Ext.getBody().mask(false, '<div class="demos-loading">Loading&hellip;</div>');
        initMarkers(companySearchField.getValue());
        Ext.getBody().unmask();
      } else {
	trackingAjaxRequest(SearchCompany);
        searchAjaxRequest();
        tabPanel.setActiveItem(tweetsPanel, 'slide');
        //tweetSearchField.setValue('');
      }
    };

    searchButton = new Ext.Button({
      text: 'Go',
      handler: searchHandler
    });

    searchBubbleButton = new Ext.Button({
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
      },
      listeners:{
	zoomchange:function(){
        if (tabPanel.getActiveItem() == map)
	{ 
	_gaq.push(['_trackEvent', 'Search Company', MapZoom]);
        trackingAjaxRequest(MapZoom);
	}
	}
      }
    });

    companySearchField = new Ext.form.Text({
      name:'searchField',
      width: '90%',
      placeHolder:'Search companies...',
      listeners: {
        change: searchHandler
      }
    });

    tweetSearchField = new Ext.form.Text({
      name:'searchField',
      placeHolder:'Search tweets...',
      width: '90%',
      /*
      margin: 2,
      */
      listeners: {
        change: searchHandler
      }
    });

    searchBar = new Ext.Toolbar({
      dock: 'bottom',
      cls: 'search',
      items: [
        {xtype:'spacer'},
        companySearchField,
        tweetSearchField,
        //searchButton,
        {xtype:'spacer'}
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
            {xtype:'spacer'},
            backToTweetsButton,
            tweetSearchField,
            searchBubbleButton,
            {xtype:'spacer'}
          ]
        }
      ],
      listeners: {
        hide: function(component) {
          searchToggleButton.setPressed(0, false);
          postToggleButton.setPressed(0, false);
          /*
          buttonGroup.setPressed(0, false);
          buttonGroup.setPressed(1, false);
          */
        }
      }
    });

    postBar = new Ext.Toolbar({
      dock: 'bottom',
      cls:'post',
      items: [
        {xtype: 'spacer'},
        postField,
        {xtype: 'spacer'}
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
            {xtype: 'spacer'},
            postBubbleField,
            {xtype: 'spacer'}
          ]
        }
      ],
      listeners: {
        hide: function(component) {
          searchToggleButton.setPressed(0, false);
          postToggleButton.setPressed(0, false);
          /*
          buttonGroup.setPressed(0, false);
          buttonGroup.setPressed(1, false);
          */
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
        searchBubble.showBy(searchToggleButton);
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
      postBubble.showBy(postToggleButton);
      trackingAjaxRequest(BirdIcon);  
      _gaq.push(['_trackEvent', 'Buttons', BirdIcon]);
    };

    searchToggleButton = new Ext.SegmentedButton({
      allowDepress: true,
      items: [{
        iconMask: true,
        iconCls: 'search',
        hidden: false,
        handler:searchToggleHandler
      }]
    });

    postToggleButton = new Ext.SegmentedButton({
      allowDepress: true,
      items: [{
        ui: 'action',
        iconMask: true,
        iconCls: 'twitterbird',
        handler:postToggleHandler
      }]
    });

    buttonGroup = new Ext.SegmentedButton({
      allowDepress: true,
      //items:[searchToggleButton,postToggleButton]
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

    tweetsPanel = new Ext.Component({
      title: 'Tweets',
      cls: 'buzz',
      iconCls: 'team',
      contentEl: 'tweet-div'
    });

    toolbar = new Ext.Toolbar({
      dock: 'top',
      items: [
        //buttonGroup,
        searchToggleButton,
        postToggleButton,
        backToMapButton,
        {xtype: 'spacer'},
        loginButton
      ]
    });

    externalLinks = new Ext.Button({
      width: '80%',
      ui: 'forward',
      cls: 'confirm',
      text: 'Get directions to the fair...',
      handler: function() {
        navigator.geolocation.getCurrentPosition(function(pos) {
          externalLinks.setPressed(0, false);
          externalLinks.setPressed(1, false);
          window.location = 'http://maps.google.com/maps?saddr=' + pos.coords.latitude + ',' + pos.coords.longitude + '&daddr=37.42955,-122.17269';
        });
      }
    });

    homePanel = new Ext.Panel({
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
          dock: 'top',
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
      cardSwitchAnimation: 'slide',
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
        afterrender: function(comp) {
          searchToggleButton.setVisible(false);
        },
        beforecardswitch: function(container, newCard, oldCard, index, animated) {
          if (newCard == tweetsPanel) {
            searchAjaxRequest();
            postToggleButton.setVisible(false);
            searchToggleButton.setVisible(true);
            tabPanel.removeDocked(searchBar, false);
            tabPanel.insertDocked(2, postBar);
          } else {
            postToggleButton.setVisible(true);
            searchToggleButton.setVisible(false);
            tabPanel.removeDocked(postBar, false);
            tabPanel.insertDocked(2, searchBar);
          }
          searchToggleButton.setPressed(0, false);
          postToggleButton.setPressed(0, false);
          /*
          buttonGroup.setPressed(0, false);
          buttonGroup.setPressed(1, false);
          tabPanel.removeDocked(searchBar, false);
          tabPanel.removeDocked(postBar, false);

          */
        }
      }
    });

    tabPanel.addDocked(searchBar);

    var minLat = 37.429112,
        maxLat = 37.429515,
        minLng = -122.173227,
        maxLng = -122.172109;

    var lat = pv.Scale.linear(0, 1).range(minLat, maxLat),
        lng = pv.Scale.linear(0, 1).range(minLng, maxLng);

    labels = [];
    markers = [];
    var initMarkers = function(search_terms) {
      markers.forEach(function(m) {
        m.setMap(null);
      });
      markers = [];
      labels.forEach(function(l) {
        l.close();
      });
      labels = [];
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
      labelClickHandler = function(company_name) {
        $('#company-name').text(company_name);
        var company = $.grep(companies, function(c) { return c.name == company_name; })[0]
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
      };
      active_companies.forEach(function(c) {
        var newLatLng = new google.maps.LatLng(lat(Math.random()), lng(Math.random()));
        var marker = new google.maps.Marker({
          position: newLatLng,
          map: map.map,
          //icon: new google.maps.MarkerImage("company_images/" + c.logo_url),
          title: c.name
        });
        markers.push(marker);
        var label = new InfoBox({
          content: '<a style="text-decoration:none;color:white;" href="" onclick="labelClickHandler(\'' + marker.title + '\');return false;">' + marker.title + '</a>',
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
      companySearchField.setVisible(true);
      if (!tweetSearchField.getValue()) {
        backToTweetsButton.setVisible(false);
      } else if (tweetSearchField.getValue().length > 0) {
        backToTweetsButton.setVisible(true);
      }
      if (!$isLoggedIn) loginButton.setText("Login with Twitter");
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

    tweetsPanel.addListener('beforeactivate', function() {
      companySearchField.setVisible(false);
      tweetSearchField.setVisible(true);
      //if (!$isLoggedIn) loginButton.setText("Login");
      if (!tweetSearchField.getValue()) {
        backToTweetsButton.setVisible(false);
      } else if (tweetSearchField.getValue().length > 0) {
        backToTweetsButton.setVisible(true);
        //tabPanel.addDocked(searchBar);
        searchBubble.showBy(searchToggleButton);
      }
    });
  }
});
