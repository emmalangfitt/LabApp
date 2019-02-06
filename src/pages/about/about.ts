import { Component } from "@angular/core";
import {
  Alert,
  AlertController,
  NavController
} from "ionic-angular";
import { ProfileProvider } from "../../providers/profile/profile";
import { AuthProvider } from "../../providers/auth/auth";
import { LoginPage } from '../login/login';
import { Events } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';

@Component({
  selector: "page-about",
  templateUrl: "about.html"
})

export class AboutPage {
  public userProfile: any;
  public rating: number;
  public currentImage: any;
  public num: number;
  public captureDataUrl: string;
  public photo: string;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public profileProvider: ProfileProvider,
    public events: Events,
    private camera: Camera
  ) {
    events.subscribe('star-rating:changed', (starRating) => {
      //this.profileProvider.updateRating((starRating + this.rating )/ 2);
    });
  }

  ionViewDidLoad() {
    this.profileProvider.getUserProfile().on("value", userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      this.rating = userProfileSnapshot.val().rating;
      this.num = userProfileSnapshot.val().num;
      this.photo = userProfileSnapshot.val().photo;
    });
  }

  logOut(): void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot(LoginPage);
    });
  }

  updateEmail(): void {
    let alert: Alert = this.alertCtrl.create({
      inputs: [{ name: 'newEmail', placeholder: 'Your new email' },
      { name: 'password', placeholder: 'Your password', type: 'password' }],
      buttons: [
        { text: 'Cancel' },
        { text: 'Save',
          handler: data => {
            this.profileProvider
              .updateEmail(data.newEmail, data.password)
              .then(() => { console.log('Email Changed Successfully'); })
              .catch(error => { console.log('ERROR: ' + error.message); });
        }}]
    });
    alert.present();
  }

  updatePassword(): void {
    let alert: Alert = this.alertCtrl.create({
      inputs: [
        { name: 'newPassword', placeholder: 'New password', type: 'password' },
        { name: 'oldPassword', placeholder: 'Old password', type: 'password' }],
      buttons: [
        { text: 'Cancel' },
        { text: 'Save',
          handler: data => {
            this.profileProvider.updatePassword(
              data.newPassword,
              data.oldPassword
            );
          }
        }
      ]
    });
    alert.present();
  }

  updateName(): void {
    const alert: Alert = this.alertCtrl.create({
      message: "Your first name & last name",
      inputs: [
        {
          name: "firstName",
          placeholder: "Your first name",
          value: this.userProfile.firstName
        },
        {
          name: "lastName",
          placeholder: "Your last name",
          value: this.userProfile.lastName
        }
      ],
      buttons: [
        { text: "Cancel" },
        {
          text: "Save",
          handler: data => {
            this.profileProvider.updateName(data.firstName, data.lastName);
          }
        }
      ]
    });
    alert.present();
  }

  takePicture() {
    const options: CameraOptions = {
      quality : 50,
      destinationType : this.camera.DestinationType.DATA_URL,
      sourceType : this.camera.PictureSourceType.CAMERA,
      encodingType : this.camera.EncodingType.JPEG,
      targetHeight : 500,
      targetWidth : 500,
      allowEdit : true,
      cameraDirection: 1
    }

    this.camera.getPicture(options).then((imageData) => {
      var captureDataUrl = 'data:image/jpeg;base64,' + imageData;
      let storageRef = firebase.storage().ref();
      // Create a timestamp as filename
      const filename = Math.floor(Date.now() / 1000);
      // Create a reference to 'images/todays-date.jpg'
      const imageRef = storageRef.child(`images/${filename}.jpg`);

      imageRef.putString(captureDataUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
        // Do something here when the data is succesfully uploaded!
        this.profileProvider.getUserPhoto().set(captureDataUrl);
      });
    }, (err) => {
      // Handle error
    });

  }

}
