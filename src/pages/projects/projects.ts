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
  sortField: string;
  sortAsc: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient) {
    console.log("populating list page");
    this.selectedProject = navParams.get('project');
    let sortField = navParams.get('sortField');
    if (sortField) {
      this.sortField = sortField;
    } else {
      this.sortField = 'Title';
    }
    let sortAsc = navParams.get('sortAsc');
    if (sortAsc) {
      this.sortAsc = sortAsc;
    } else {
      this.sortAsc = 'A';
    }

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
      let sortField = this.sortField;
      let sortAsc = this.sortAsc;

      console.log("Calling:" + url);
      let resp = this.http.get(url, { headers: { "Authorization": "Bearer " + global.authResult.accessToken } });
      resp.subscribe(
        res => {
          this.projects = res['value'];
          this.sortProjects(sortField, sortAsc);
          CommonMethods.setHtml("queryStatus", "Found " + this.projects.length + " projects");
        },
        err => {
          CommonMethods.setHtml("queryStatus", "Error Fetching data... " + err.message);
        }
      );
    } else {
      this.projects = null;
      this.genMockData();
      CommonMethods.setHtml("queryStatus", "You are not logged in ");
    }
  }

  projectTapped(event, project) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ProjectDetailPage, {
      project: project
    });
  }

  setSort(event, sortField) {
    // if same as last time 
    if (sortField == this.sortField) {
      if (this.sortAsc == 'A')
        this.sortAsc = 'D';
      else
        this.sortAsc = 'A';
    } else {
      this.sortField = sortField;
      this.sortAsc = 'A';
    }
    console.log("Sort set to " + sortField + " Asc:" + this.sortAsc);
    // open new page
    // this.navCtrl.push(ProjectsPage, {
    //   sortField: sortField,
    //   sortAsc: this.sortAsc
    // });
    // refresh current page
    this.getProjectsList();
  }

  sortProjects(sortBy, sortAsc) {
    if (this.projects) {
      if (sortAsc == 'A') {
        this.projects.sort(function (a, b) {
          //console.log("comapringt:" + a['fields'][sortBy] + " to " + b['fields'][sortBy]);
          if (a['fields'][sortBy] < b['fields'][sortBy]) {
            return -1;
          }
          if (a['fields'][sortBy] > b['fields'][sortBy]) {
            return 1;
          }
          return 0;
        });
      } else {
        this.projects.sort(function (a, b) {
          //console.log("comapringt:" + a['fields'][sortBy] + " to " + b['fields'][sortBy]);
          if (a['fields'][sortBy] < b['fields'][sortBy]) {
            return 1;
          }
          if (a['fields'][sortBy] > b['fields'][sortBy]) {
            return -1;
          }
          return 0;
        });
      }
      console.log("Mocked projects after sort:" + sortBy + ":" + sortAsc);
      for (var p = 0; p < this.projects.length; p++) {
        this.printProject(p);
      }
    }
  }

  printProject(p) {
    let fields = this.projects[p]['fields'];
    let str = "" + p + ":";
    Object.keys(fields).forEach(function (key, index) {
      str += key + " : " + fields[key] + ",";
    });
    console.log(str);
  }
  // create mock data for quick browser testing of layouts
  genMockData() {
    console.log("Mock:" + global.mock);

    if (global.mock == 1) {
      this.projects = new Array<{ fields: {} }>();
      let fields: Array<{ id: string, Title: string, Status: string, Project_x0020_Manager: string, Created: string, Modified: string }>;
      let max = 10;
      for (var p = 0; p < max; p++) {
        fields = [];
        fields['id'] = '' + p;
        fields['Title'] = 'Project ' + p;
        if (Math.floor(Math.random() * 2) == 1) {
          fields['Status'] = 'Active';
        } else {
          fields['Status'] = 'In Active';
        }
        fields['Project_x0020_Manager'] = 'Manager ' + Math.floor(Math.random() * max);

        let p2 = '0' + Math.floor(Math.random() * 30);
        p2 = p2.substr(p2.length - 2);
        fields['Created'] = '2018-06-' + p2 + 'T16:11:57Z';
        fields['Modified'] = '2018-06-' + p2 + 'T17:12:50Z';

        this.projects.push({ fields: fields });
        this.printProject(p);
      }
      this.sortProjects(this.sortField, this.sortAsc);
    }
  }
}
