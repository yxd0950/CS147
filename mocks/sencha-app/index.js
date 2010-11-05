Ext.setup({
  icon: 'icon.png',
  tabletStartupScreen: 'tablet_startup.png',
  phoneStartupScreen: 'phone_startup.png',
  glossOnIcon: false,

  onReady: function() {
    var textFieldPost = new Ext.form.TextField({
      name:'textFieldPost',
      placeHolder:'textFieldPost'
    });
	var textFieldSearch = new Ext.form.TextField({
	name:'textFieldSearch',
	placeHolder:'Search Tweets'
	});
    var loginButton = new Ext.Button({
      text: 'Login',
      ui: 'action',
      handler: function() {
        window.location = $loginUrl; // $loginUrl available from html/php page
      }
    });

    var makeAjaxRequest = function() {
      console.log("enteredAjax");
      Ext.getBody().mask(false, '<div class="demos-loading">Loading&hellip;</div>');
      Ext.Ajax.request({
        url: 'postTweet.php?tweet=' + textFieldPost.getValue() + '&oauth_token=' + $oauthToken,
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
        tabPanel.setCard(mapPanel, 'flip');
        backToMapButton.setVisible(false);
      }
    });
    
    var backToTweetsButton = new Ext.Button({
      text: 'Back',
      ui: 'back',
      hidden: true,
      handler: function() {
      	makeAjaxSearchRequest();
        tabPanel.setCard(tweetsPanel, 'flip');
        backToTweetsButton.setVisible(false);
      }
    });

    var searchResultsPanel = new Ext.Panel({
      items: [{contentEl: 'search-div'}]
    });
	var makeAjaxSearchRequest = function() {
		Ext.getBody().mask(false, '<div class="demos-loading">Loading&hellip;</div>');
		if (!textFieldSearch.getValue()) {
			backToTweetsButton.setVisible(false);
			console.log("invalid search value");
		} else if (textFieldSearch.getValue().length > 0) {
			backToTweetsButton.setVisible(true);
			console.log("valid search value");
		}
		Ext.Ajax.request({
			url: 'searchTweets.php?search='+textFieldSearch.getValue(), method: 'GET',
			success:function(response, opts) {
				console.log(response.responseText);
				document.getElementById('tweet-div').innerHTML = response.responseText;
				Ext.getBody().unmask();
			}
		});
	};
    var searchButton = new Ext.Button({
      text: 'Search',
      ui: 'action',
      handler: function() {
      	makeAjaxSearchRequest();
        tabPanel.setCard(tweetsPanel, 'flip');
   		textFieldSearch.setValue('');
      }
    });

    var mapPanel = new Ext.Panel({
      iconCls: 'search',
      title: 'Search',
      cls: 'search',
      dockedItems: [
        {
          dock: 'top',
          xtype: 'toolbar',
          items: [textFieldSearch, searchButton]
        },
        {
          dock: 'bottom',
          xtype: 'toolbar',
          items: [textFieldPost, postButton]
        }
      ],
      items: [
        {
          xtype: 'button',
          text: 'Company Info Placeholder', 
          handler: function() {
            tabPanel.setCard(companyPanel, 'flip');
            backToMapButton.setVisible(true);
          }
        },
        {contentEl: 'map-div'}
      ]
    });

    var companyPanel = new Ext.Panel({
      title: 'Company X',
      items: [{contentEl: 'company-div'}]
    });

    var tweetsPanel = new Ext.Panel({
      title: 'Tweets',
      badgeText: '4',
      cls: 'buzz',
      iconCls: 'team',
	  items: [{contentEl: 'tweet-div'}]
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
        {
          dock: 'top',
          xtype: 'toolbar',
          title: 'Fairly Guided',
          items: [
            backToMapButton,
            backToTweetsButton,
            {xtype: 'spacer'},
            loginButton
          ]
        }
      ],
      items: [
        {
          title: 'Home',
          iconCls: 'user',
          cls: 'home',
          items: [
            {
              xtype: 'field',
              xtype: 'textfield',
              name: 'foobar',
              placeHolder: 'Foobar...'
            },
            {contentEl: "home-div"}
          ]
        },
        mapPanel,
        tweetsPanel
      ], 
      listeners: {
      	beforecardswitch: function(container, newCard, oldCard, index, animated) {
      		if (newCard == tweetsPanel) {
      			console.log('hi');
      			makeAjaxSearchRequest();
      		}
      	}
      	
      }
    });
  }
});
