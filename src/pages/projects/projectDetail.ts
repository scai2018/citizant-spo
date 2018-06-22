import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { global } from "../../app/global";
@Component({
  selector: 'page-list',
  templateUrl: 'projectDetail.html'
})
export class ProjectDetailPage {
  projects: Object[];
  url: string;

  selectedProject: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient) {
    console.log("populating projectDetail page");
    this.selectedProject = navParams.get('project');
  }
}
