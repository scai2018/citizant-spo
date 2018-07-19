import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { global, CommonMethods } from "../../app/global";
import { HttpClient } from '@angular/common/http';
import { TasksPage } from "./tasks";

@Component({
  selector: 'page-list',
  templateUrl: 'taskDetail.html'
})
export class TaskDetailPage {
  url: string;

  selectedTask: any;
  // Comment
  comment: string;
  // Percentage complete: [0, 100]
  percentComplete: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient, private toastCtrl: ToastController) {
    console.log("populating taskDetail page");
    this.selectedTask = navParams.get('task');
    this.comment = this.selectedTask.fields.Comment;
    this.percentComplete = 100*this.selectedTask.fields.PercentComplete;
    
  }

  // Save the Task with updated fields: comment and percentComplete
  // PATCH https://graph.microsoft.com/beta/sites/{site-id}/lists/{list-id}/items/{item-id}/fields
  saveTask() {
    console.log("saveTask()");
    // validate percentage: 0-100
    if(isNaN(this.percentComplete) || this.percentComplete>100 || this.percentComplete < 0) {
      CommonMethods.presentToast("Invalid Percentage Complete", this.toastCtrl);
      return;
    }
    let itemId = this.selectedTask.fields.id;
    if (global.ver == 1) {
      this.url = global.resourceUrl2 + "/v1.0/sites/root/lists/" + global.tasksListID + "/items/" + itemId + "/fields";
    } else {
      this.url = global.resourceUrl2 + "/v1.0/sites/root/lists/" + global.tasksListID + "/items/" + itemId + "/fields";
    }
    console.log(this.url);
    let body = {"Comment": this.comment, 
                "PercentComplete": 0.01*this.percentComplete
              }
    // Save changes via PATCH command
    let resp = this.http.patch(this.url, body, { headers: { "Authorization": "Bearer " + global.authResult.accessToken } });
    resp.subscribe(
      res => {
        CommonMethods.presentToast("Saved Task successfully", this.toastCtrl);
        // return to Tasks page and refresh the Tasks list
        this.navCtrl.setRoot(TasksPage);
      },
      err => {
        CommonMethods.presentToast("Error Saving Task", this.toastCtrl);
      }
    );
  }  

  // Cancel the changes and return to the prvious page
  cancel() {
    console.log("cancel()");
    this.navCtrl.pop();
  }


  // Validate the key pressed is a number key
  onKeyPress($event:any){
    const keyCode = $event.keyCode ? $event.keyCode : $event.which;
    let keyCode0=47;
    let keyCode9=57;
    if (keyCode < keyCode0 || keyCode>keyCode9) return false;
    else  return true;
  }
}
