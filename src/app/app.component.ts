import {Component, ViewChild} from '@angular/core';
import {MenuController, NavController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';

import {SigninPage} from "../pages/signin/signin";
import {HomePage} from "../pages/home/home";
import {AuthService} from "../services/auth";
import {SearchPage} from "../pages/search/search";
import {SocialSharing} from "@ionic-native/social-sharing";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = SigninPage;
  signinPage:any = SigninPage;
  homePage:any = HomePage;
  searchPage:any = SearchPage;

  isAuthenticated = false;

  @ViewChild('nav') nav: NavController;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menuCtrl: MenuController,
            private authService: AuthService, private socialSharing: SocialSharing, private plt: Platform) {
    firebase.initializeApp({
      apiKey: "AIzaSyC1gaCbcWHP9VXaaAJ3RcEfOnHmI3TIYY8",
      authDomain: "simple-list-afb0a.firebaseapp.com",
      databaseURL: "https://simple-list-afb0a.firebaseio.com",
      storageBucket: "simple-list-afb0a.appspot.com"
    });

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.isAuthenticated = true;
        this.rootPage = HomePage;
      } else {
        this.isAuthenticated = false;
        this.rootPage = SigninPage;
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  onShare() {
    var shareUrl: string = "";

    if (this.plt.is('android')) {
      shareUrl = "https://play.google.com/store/apps/details?id=com.chadmeza.simplelist";
    }

    if (this.plt.is('ios')) {
      shareUrl = "https://itunes.apple.com/us/app/simple-list-registry/id1281434820?mt=8";
    }

    this.socialSharing.share("Join the millions of people who are using Simple List to create and view wish lists.", "Install Simple List",
                              null, shareUrl)
      .then(() => {
        this.menuCtrl.close();
      })
      .catch(() => {
        this.menuCtrl.close();
      });
  }

  onLogout() {
    this.authService.logout();
    this.menuCtrl.close();
  }
}

