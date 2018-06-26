import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { global, CommonMethods } from "../../app/global";
import { TaskDetailPage } from './taskDetail';

@Component({
  selector: 'page-list',
  templateUrl: 'tasks.html'
})
export class TasksPage {
  tasks: Object[];
  url: string;

  //selectedTask: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient) {
    console.log("populating list page");
    //this.selectedTask = navParams.get('task');
    this.getTasksList();
  }

  getTasksList() {

    if (global.ver == 1) {
      this.url = global.resourceUrl2 + "/v1.0/sites/root/lists/" + global.tasksListID + "/items?expand=fields";
    } else {
      this.url = global.resourceUrl2 + "/v1.0/sites/root/lists/" + global.tasksListID + "/items?expand=fields";
    }
    this.getList(this.url);

  }
  getList(url) {

    if (global.authResult) {
      console.log("Calling:" + url);
      let resp = this.http.get(url, { headers: { "Authorization": "Bearer " + global.authResult.accessToken } });
      resp.subscribe(
        res => {
          this.tasks = res['value'];
        CommonMethods.setHtml("queryStatus", "Found " + this.tasks.length + " tasks");
        },
        err => {
          CommonMethods.setHtml("queryStatus", "Error Fetching data... " + err.message);
        }
      );
    } else {
      this.tasks = null;
      CommonMethods.setHtml("queryStatus", "You are not logged in ");
    }
  }

  taskTapped(event, task) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(TaskDetailPage, {
      task: task
    });
  }
}
