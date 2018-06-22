import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { global } from "../../app/global";
@Component({
  selector: 'page-list',
  templateUrl: 'taskDetail.html'
})
export class TaskDetailPage {
  tasks: Object[];
  url: string;

  selectedTask: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient) {
    console.log("populating taskDetail page");
    this.selectedTask = navParams.get('task');
  }
}
