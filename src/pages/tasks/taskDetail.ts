import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-list',
  templateUrl: 'taskDetail.html'
})
export class TaskDetailPage {
  url: string;

  selectedTask: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log("populating taskDetail page");
    // TODO: get the original task from the tasks array, because the task passed into this method doesn't
    // contain the array of objects in task.fields.Predecessors
    this.selectedTask = navParams.get('task');
    this.selectedTask.fields.Predecessors.forEach(function(task) {
      console.log("depended task: " + task.LookupValue);
    }); 
    
  }
}
