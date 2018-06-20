import {
  Component
} from '@angular/core';
import {
  NavController
} from 'ionic-angular';
import {
  MSAdal,
  AuthenticationContext,
  AuthenticationResult
} from '@ionic-native/ms-adal';

import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  isAuthenticated: boolean = false;
  message = '';
  authResult: AuthenticationResult;
  projects: Object[];

  /*
      SCAI NOTE: 
      1) Able to see the login page on AAD, but the tenant was wrong. Change to use :
        authority: https://login.windows.net/citizant.onmicrosoft.com
        resource: https://graph.windows.net
        client ID: a0ac5fdd-442b-416c-9c4b-aefe509de5c7
        reply URL: http://localhost:8100
        tenant: citizant.onmicrosoft.com, 

  */
  /* Ver 1.0:   */
  authority = 'https://login.windows.net/common';
  //resourceUrl = 'https://graph.windows.net';
  // use v2.0 Graph API with v1.0 Authority :
  resourceUrl = 'https://graph.microsoft.com';

  /* Ver 2.0: 
    authority = 'https://login.microsoft.com/common';
    resourceUrl = 'https://graph.microsoft.com';
   */
  clientId = 'a0ac5fdd-442b-416c-9c4b-aefe509de5c7';
  redirectUrl = 'http://localhost:8100';
  constructor(public navCtrl: NavController, private msAdal: MSAdal, private http: HttpClient) {

  }

  acquireToken() {
    let authContext: AuthenticationContext = this.msAdal.createAuthenticationContext(this.authority);


    authContext.acquireTokenAsync(this.resourceUrl, this.clientId, this.redirectUrl, '', '')
      .then((authResponse: AuthenticationResult) => {
        this.isAuthenticated = true;
        this.message = "success";
        this.authResult = authResponse;
        console.log('AuthResponse: ', authResponse);
        console.log('ID Token is', authResponse.idToken);
        console.log('Access Token is', authResponse.accessToken);
        console.log('UserInfo: ', authResponse.userInfo.givenName);
        console.log('Token will expire on', authResponse.expiresOn);
      })
      .catch((e: any) => { this.message = "Failed" + e; console.log('Authentication failed', e) });
  }

  getProjectsList() {
    let url = "https://graph.microsoft.com/v1.0/sites/root/lists/da7cd400-0cd9-4dde-9167-3049747f195a/items?expand=fields";
    let resp = this.http.get(url, { headers: { "Authorization": "Bearer " + this.authResult.accessToken } });
    resp.subscribe(
      res => {
        this.projects = res['value'];
        console.log("Found projects : " + this.projects.length + ": ", this.projects);
      },
      err => {
        console.log("Error Fetching data...", err);
      }
    );
  }



}
