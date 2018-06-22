import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { global } from "../../app/global";
import { ProjectDetailPage } from './projectDetail';
@Component({
  selector: 'page-list',
  templateUrl: 'projects.html'
})
export class ProjectsPage {
  projects: Object[];
  url: string;

  selectedProject: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient) {
    console.log("populating list page");
    this.selectedProject = navParams.get('project');
    this.getProjectsList();
  }

  getProjectsList() {

    if (global.ver == 1) {
      this.url = global.resourceUrl2 + "/v1.0/sites/root/lists/" + global.activitesListID + "/items?expand=fields";
    } else {
      this.url = global.resourceUrl2 + "/v1.0/sites/root/lists/" + global.activitesListID + "/items?expand=fields";
    }
    this.getList(this.url);

  }
  getList(url) {

    if (global.authResult) {
      console.log("Calling:" + url);
      let resp = this.http.get(url, { headers: { "Authorization": "Bearer " + global.authResult.accessToken } });
      resp.subscribe(
        res => {
          this.projects = res['value'];
          this.setHtml("queryStatus", "Found " + this.projects.length + " projects");
        },
        err => {
          this.setHtml("queryStatus", "Error Fetching data... " + err.message);
        }
      );
    } else {
      this.projects = null;
      this.setHtml("queryStatus", "You are not logged in ");
    }
  }

  projectTapped(event, project) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ProjectDetailPage, {
      project: project
    });
  }
  public setHtml(elementName, html) {
    var element = document.getElementById(elementName);
    if (element) {
      element.innerHTML = html;
      console.log("Set " + elementName + ":" + html);
    } else {
      console.log("unable to set " + elementName + ":" + html);
    }
  }

}
