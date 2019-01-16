import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public profs;

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {

    this.profs = [
      {first: 'name1', last: 'name1last', rate: '3.3', image: '../assets/imgs/logo.png'},
      {first: 'name2', last: 'name2last', rate: '4.5', image: '../assets/imgs/logo.png'},
      {first: 'name3', last: 'name3last', rate: '2.9', image: '../assets/imgs/logo.png'},
      {first: 'name4', last: 'name4last', rate: '2.2', image: '../assets/imgs/logo.png'},
      {first: 'name5', last: 'name5last', rate: '3.9', image: '../assets/imgs/logo.png'},
      {first: 'name6', last: 'name6last', rate: '4.8', image: '../assets/imgs/logo.png'},
    ];

  }

  addProf(){

  }

  viewProf(){

  }

}
