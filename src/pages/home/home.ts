import {
  Component
} from '@angular/core';
import {
  NavController
} from 'ionic-angular';
import { global, CommonMethods } from "../../app/global";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  // set by innerHTML for method changes to work and by field to keep of page refreshes.
  // TODO: may just need one msg to display regarding user login
  logStatus = "";
  authStatus = "";


  constructor(public navCtrl: NavController) {
    this.init();
  }

  public init() {
    console.log("populating home page");
    if (global.authResult) {
      this.authStatus = "Welcome, "+ global.authResult.userInfo.givenName + "!";

      //this.logStatus = CommonMethods.setHtml("logStatus", "Status: Logged in v" + global.ver);
      //this.authStatus = CommonMethods.setHtml("authStatus", "Name: " + global.authResult.userInfo.givenName + "<br>Access Token: " + global.authResult.accessToken + "<br>Expires: " + global.authResult.expiresOn);
    } else {
      this.authStatus = "Please login with your Citizant account!";

      //his.logStatus = CommonMethods.setHtml("logStatus", "Status: Not logged in");
    }
    return new Date().toDateString();
  }

}
