import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {
  MSAdal,
  AuthenticationContext,
  AuthenticationResult
} from '@ionic-native/ms-adal';

import { global, CommonMethods } from "./global";
import { HomePage } from '../pages/home/home';
import { ProjectsPage } from '../pages/projects/projects';
import { TasksPage } from '../pages/tasks/tasks';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // for testing though we might want to store for user at some point too.
  //testUser: string = "david.abigt@citizant.com";
  // set to blank for non test build
  testUser: string = "";

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;

  isAuthenticated = false;

  constructor(public platform: Platform, private msAdal: MSAdal, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Projects', component: ProjectsPage },
      { title: 'Tasks', component: TasksPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
    console.log('Opening page: ', page.title);
  }

  acquireToken(ver) {
    global.ver = ver;
    // v1 has not calls for lists see https://msdn.microsoft.com/en-us/Library/Azure/Ad/Graph/api/api-catalog?f=255&MSPPError=-2147217396
    // so always use global.resourceUrl2 
    let authUrl = global.resourceUrl2;
    let authority = global.authority1;

    if (global.ver == 2) {
      authority = global.authority2;
      authUrl = global.resourceUrl2;
    }
    console.log('Getting context from: ', authority);
    let authContext: AuthenticationContext = this.msAdal.createAuthenticationContext(authority);

    authContext.acquireTokenAsync(authUrl, global.clientId, global.redirectUrl, this.testUser, '')
      .then((authResponse: AuthenticationResult) => {
        global.authResult = authResponse;
        this.isAuthenticated = true;
        CommonMethods.setHtml("logStatus", "Logged in");
        CommonMethods.setHtml("authStatus", "Name: " + authResponse.userInfo.givenName + "<br>Access Token: " + authResponse.accessToken + "<br>Expires: " + authResponse.expiresOn);

        console.log('AuthResponse: ', authResponse);
        console.log('ID Token is', authResponse.idToken);
        console.log('Access Token is', authResponse.accessToken);
        console.log('UserInfo: ', authResponse.userInfo.givenName);
        console.log('Token will expire on', authResponse.expiresOn);
      })
      .catch((e: any) => {
        CommonMethods.setHtml("logStatus", "Failed: " + e);
        CommonMethods.setHtml("authStatus", "");
        authContext.tokenCache.clear();
        global.authResult = null;
        this.isAuthenticated = false;
        console.log('Authentication failed', e)
      });
    this.openPage(this.pages[0]);
  }

  logout() {
    let authority = global.authority1;
    if (global.ver == 2) {
      authority = global.authority2;
    }
    let authContext: AuthenticationContext = this.msAdal.createAuthenticationContext(authority);

    authContext.tokenCache.clear();
    global.authResult = null;
    this.isAuthenticated = false;

    CommonMethods.setHtml("logStatus", "Logged out");
    CommonMethods.setHtml("authStatus", "");
    this.openPage(this.pages[0]);
  }
}

