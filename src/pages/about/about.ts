import { Component } from "@angular/core";
import {
  Alert,
  AlertController,
  NavController,
  App
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
  public userProfile: any; // firebase ref of self
  public rating: number; // user's own rating
  public num: number; // user's number
  public captureDataUrl: string; // reads image data before saving
  public photo: string; // stores user's photo data
  public once: boolean = true; // makes sure to only load user data on load

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public profileProvider: ProfileProvider,
    public events: Events,
    private camera: Camera,
    public app: App
  ) {
    // once profile provider has loaded data, run page's data initialization
    this.profileProvider.loaded.subscribe((value) => {
      if (value && this.once) {
          this.initStuff();
          this.once = false;
      }
    });
  }

  /*
    Function to initialize user's data. Also restricts user to
    only access the admin page if the user is logged into the
    admin account
  */
  initStuff() {
    this.profileProvider.getUserProfile().on("value", userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      this.rating = userProfileSnapshot.val().rating;
      this.num = userProfileSnapshot.val().num;
      this.photo = userProfileSnapshot.val().photo;
    });

    var roleRef = this.profileProvider.getUserRole();
    var admin;

    roleRef.once('value').then((snapshot) => {
      admin = snapshot.val();

      if (admin == true) {
        this.app.getRootNav().setRoot('AdminPage');
      }
    });
  }

  /*
    Logs user out and pushes them to the login page
  */
  logOut(): void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot(LoginPage);
    });
  }

  /*
    Allows user to update their email value and save the new
    input to firebase through an alert
  */
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

  /*
    Allows user to update their password value and save the new
    input to firebase through an alert
  */
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

  /*
    Allows user to update their first and last name values
    and save the new input to firebase through an alert
  */
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

  /*
    adds pre-survey to navigation on button press
  */
  goToPreSurvey():void {
    this.navCtrl.push('PreSurveyPage');
  }

  /*
    adds post-survey to navigation on button press
  */
  goToPostSurvey():void {
    this.navCtrl.push('PostSurveyPage');
  }

  /*
    uses user's phone camera to allow them to take a picture,
    save it to firebase, and store it for future display
  */
  takePicture() {
    const options: CameraOptions = {
      quality : 50,
      destinationType : this.camera.DestinationType.DATA_URL,
      sourceType : this.camera.PictureSourceType.CAMERA,
      encodingType : this.camera.EncodingType.JPEG,
      targetHeight : 500, // square photo
      targetWidth : 500, // square photo
      allowEdit : true,
      cameraDirection: 1 // 1 for front-facing, 0 for back-facing
    }

    this.camera.getPicture(options).then((imageData) => {
      var captureDataUrl = 'data:image/jpeg;base64,' + imageData;
      let storageRef = firebase.storage().ref();
      // Create a timestamp as filename
      const filename = Math.floor(Date.now() / 1000);
      // Create a reference to 'images/todays-date.jpg'
      const imageRef = storageRef.child(`images/${filename}.jpg`);

      imageRef.putString(captureDataUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
        // Set users photo to picture just taken
        this.profileProvider.getUserPhoto().set(captureDataUrl);
      });
    }, (err) => {
      console.log("Photo capture failed.")
    });
  }

}
