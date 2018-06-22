import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { global, CommonMethods } from "../../app/global";
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
          CommonMethods.setHtml("queryStatus", "Found " + this.projects.length + " projects");
        },
        err => {
          CommonMethods.setHtml("queryStatus", "Error Fetching data... " + err.message);
        }
      );
    } else {
      this.projects = null;
      CommonMethods.setHtml("queryStatus", "You are not logged in ");
    }
  }

  projectTapped(event, project) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ProjectDetailPage, {
      project: project
    });
  }
}
