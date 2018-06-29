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
  tasks: Object[] = [];
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
          //this.tasks = res['value'];
          let taskList = res['value'];
          this.tasks = []; // initialzed to empty in case of refresh
          taskList.forEach(task => {
            task.fields.AssignedTo.forEach(assignedTo => {
              // Note: use Email field as filter. Note the assignedTo.Email is the alias of the principal email of the user
              // The principal email is returned in the authResult.userInfo.uniqueId, can't use it as filter. Have to use
              // the Email from the user profile for this purpose
              // e.g. dtrump@citizant.com vs donald.trump@citizant.com
              if(assignedTo.Email.toLowerCase()===global.profile.mail.toLowerCase()) {
                this.tasks.push(task);
              }
            });
          });
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
