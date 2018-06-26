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

  icons: string[];
  items: Array<{ title: string, note: string, icon: string }>;


  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient) {
    console.log("populating list page");
    this.selectedProject = navParams.get('project');
    this.getProjectsList();
  }

  getProjectsList() {

    if (global.ver == 1) {
      this.url = global.resourceUrl2 + "/v1.0/sites/root/lists/" + global.projectsListID + "/items?expand=fields";
    } else {
      this.url = global.resourceUrl2 + "/v1.0/sites/root/lists/" + global.projectsListID + "/items?expand=fields";
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
      console.log("Mock:" + global.mock);

      if (global.mock == 1) {
        // Let's populate this page with some filler content for funzies
        this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
          'american-football', 'boat', 'bluetooth', 'build'];

        this.projects = new Array<{ fields: {} }>();
        let fields: Array<{ id: string, Title: string, Status: string, Project_x0020_Manager: string, Created: string, Modified: string }>;

        fields = [];
        fields['id']= '1';
        fields['Title']= 'Project 1';
        fields['Status']= 'Active';
        fields['Project_x0020_Manager']= 'Manager 1';
        fields['Created']= '2018-06-07T16:11:57Z';
        fields['Modified']= '2018-06-08T17:12:50Z';

        this.items = [];
        for (let i = 1; i < 11; i++) {
          this.items.push({
            title: 'Item ' + i,
            note: 'This is item #' + i,
            icon: this.icons[Math.floor(Math.random() * this.icons.length)]
          });
        }

        for (var i = 0; i < fields.length; i++) {
          var key = Object.keys(fields[i])[0];
          console.log("fields[" + i + "]=" + key + ":" + fields[i][key]);
        }
        for (i = 0; i < this.items.length; i++) {
          key = Object.keys(this.items[i])[0];
          console.log("items[" + i + "]=" + key + ":" + this.items[i][key]);
        }

        this.projects.push({ fields: fields });
        console.log("Mocking projects:" + this.projects);
      } else {
        this.projects = null;
      }
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
