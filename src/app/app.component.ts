import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
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
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  testUser: string = "";

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;

  isAuthenticated = false;

  constructor(public platform: Platform, private msAdal: MSAdal, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private toastCtrl: ToastController, private http: HttpClient) {
    this.initializeApp();
    if (global.mock == 1) {
      // for testing though we might want to store for user at some point too.
      this.testUser = "david.abigt@citizant.com";
    }

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Projects', component: ProjectsPage },
      { title: 'Tasks', component: TasksPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Don't allow the Back button on Andriod to exit the app
      this.platform.registerBackButtonAction(() => {
        // if this page can go back, just do it as normal
        if(this.nav.canGoBack()) {
          this.nav.pop({});
        } else {
          // if this page can NOT go back, alert user to double click BACK button to exit
          if (new Date().getTime() - global.lastTimeBackPress < global.timePeriodToExit) {
            this.platform.exitApp();
          } else {
            this.presentToast("Press again to exit.");
            global.lastTimeBackPress = new Date().getTime();
          }
        }
        
        //sometimes the best thing you can do is not think, not wonder, not imagine, not obsess. 
        //just breathe, and have faith that everything will work out for the best.
      }, 1);
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
        //CommonMethods.setHtml("logStatus", "Logged in");
        let authStatus = "Welcome, " + authResponse.userInfo.givenName + "!";
        CommonMethods.setHtml("authStatus", authStatus);
        //CommonMethods.setHtml("authStatus", "Name: " + authResponse.userInfo.givenName + "<br>Access Token: " + authResponse.accessToken + "<br>Expires: " + authResponse.expiresOn);
        this.presentToast(authResponse.userInfo.givenName + " login successfully");
        console.log('AuthResponse: ', authResponse);
        console.log('ID Token is', authResponse.idToken);
        console.log('Access Token is', authResponse.accessToken);
        console.log('UserInfo: ', authResponse.userInfo.givenName);
        console.log('Token will expire on', authResponse.expiresOn);
        // Fetch the user profile to get the principal email of the user
        // https://graph.microsoft.com/v1.0/me/
        let url = global.resourceUrl2 + '/v1.0/me/';
        let resp = this.http.get(url, { headers: { "Authorization": "Bearer " + global.authResult.accessToken } });
        resp.subscribe(
          res => {
            global.profile = res;
            console.log("Found profile: " + global.profile.mail);
          },
          err => {
            CommonMethods.setHtml("authStatus", "Failed to login. Please try it later.");
          }
        );

      })
      .catch((e: any) => {
        let authStatus = "Failed to login. Please try it later.";
        CommonMethods.setHtml("authStatus", authStatus);
        //CommonMethods.setHtml("logStatus", "Failed: " + e);
        //CommonMethods.setHtml("authStatus", "");
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
    // add toast msg 
    this.presentToast("User logout successfully");
    this.openPage(this.pages[0]);
  }

  // Helper method
  presentToast(msg: string) {
    CommonMethods.presentToast(msg, this.toastCtrl);

  }
}

