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
    var loginButton = new Ext.Button({
      text: 'Login',
      ui: 'action',
      handler: function() {
	window.location = loginUrl;
      }
    });
    var makeAjaxRequest = function() {
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
        tabPanel.setCard(mapPanel, 'flip');
        backToMapButton.setVisible(false);
      }
    });
    var searchResultsPanel = new Ext.Panel({
      items: [{contentEl: 'search-div'}]
    });
    var searchButton = new Ext.Button({
      text: 'Search',
      ui: 'action',
      handler: function() {
        tabPanel.setCard(searchResultsPanel, 'flip');
        backToMapButton.setVisible(true);
      }
    });
    var mapPanel = new Ext.Panel({
      iconCls: 'search',
      title: 'Search',
      cls: 'search',
      dockedItems: [{
        dock: 'top',
        xtype: 'toolbar',
        items: [
          {
            xtype: 'field',
            xtype: 'textfield',
            name: 'search',
            placeHolder: 'Search...'
          },
          searchButton
        ]
      },{
        dock: 'bottom',
        xtype: 'toolbar',
        items: [/*{
          xtype: 'field',
          xtype: 'textfield',
          name: 'post',
          placeHolder: 'Post...'
        },*/ textFieldPost,postButton]
      }],
      //html: '<h1>Map</h1>',
      items: [
      {
      	xtype: 'button',
      	text: 'Company Info Placeholder', 
     	handler: function() {
        tabPanel.setCard(companyPanel, 'flip');
        backToMapButton.setVisible(true);
      	}
      	},
      	{contentEl: 'map-div'}],
    });
    /*
    var searchPanel = new Ext.Carousel({
      indicator: false,
      iconCls: 'search',
      title: 'Search',
      cls: 'search',
      items: [mapPanel, searchResultsPanel]
    });
    */
    var companyPanel = new Ext.Panel({
    	title: 'Company X',
    	items: [{contentEl: 'company-div'}]
    });
    var tweetsPanel = new Ext.Panel({
      title: 'Tweets',
      badgeText: '4',
      html: '<h1>Tweets Tab</h1>',
      cls: 'buzz',
      iconCls: 'team'
    });
    var tabPanel = new Ext.TabPanel({
      tabBar: {
        dock: 'bottom',
        layout: {
          pack: 'center'
        }
      },
      fullscreen: true,
      ui: 'light',
      animation: 'cube',
      defaults: {
        scroll: 'vertical'
      },
      dockedItems: [{
        dock: 'top',
        xtype: 'toolbar',
        title: 'Fairly Guided',
        items: [backToMapButton, {xtype: 'spacer'}, loginButton]
      }],
      items: [
        {
          title: 'Home',
          //html: '<h1>Home</h1><p>Docking tabs to the bottom will automatically change their style. The tabs below are type="light", though the standard type is dark. Badges (like the 4 &amp; Long title below) can be added by setting <code>badgeText</code> when creating a tab/card or by using <code>setBadge()</code> on the tab later.</p>',
          iconCls: 'user',
          cls: 'home',
          items: [{
            xtype: 'field',
            xtype: 'textfield',
            name: 'foobar',
            placeHolder: 'Foobar...'
          },{contentEl: "home-div"}]
        },
        mapPanel,
        tweetsPanel
      ]
    });
  }
});
