import {
  Component
} from '@angular/core';
import {
  NavController
} from 'ionic-angular';
import { global } from "../../app/global";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  // set by innerHTML for method changes to work and by field to keep of page refreshes.
  dateNow = new Date().toLocaleString();
  logStatus = "home msg";
  authStatus = "";
  timeNow = "now";


  constructor(public navCtrl: NavController) {
    this.init();
  }

  public init() {
    console.log("populating home page");
    this.timeNow = this.setHtml("timeNow", new Date().toLocaleString());
    if (global.authResult) {
      this.logStatus = this.setHtml("logStatus", "Status: Logged in v" + global.ver);
      this.authStatus = this.setHtml("authStatus", "Name: " + global.authResult.userInfo.givenName + "<br>Access Token: " + global.authResult.accessToken + "<br>Expires: " + global.authResult.expiresOn);
    } else {
      this.logStatus = this.setHtml("logStatus", "Status: Not logged in");
    }
    return new Date().toDateString();
  }
  public setHtml(elementName, html) {
    var element = document.getElementById(elementName);
    if (element) {
      element.innerHTML = html;
      console.log("Set " + elementName + ":" + html);
    } else {
      console.log("unable to set " + elementName + ":" + html);
    }
    return html;
  }

}
