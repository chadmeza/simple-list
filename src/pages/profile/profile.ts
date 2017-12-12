import { Component } from '@angular/core';
import {AlertController, LoadingController, NavParams} from "ionic-angular";
import {User} from "../../models/user";
import {AuthService} from "../../services/auth";
import {Item} from "../../models/item";
import {UserService} from "../../services/user";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: User;
  loggedInUID: any;
  profileImageSet: boolean = false;

  constructor(private navParams: NavParams, private authService: AuthService, private loadingCtrl: LoadingController,
              private userService: UserService, private alertCtrl: AlertController) {
    this.user = this.navParams.get("user");

    if (this.user.image) {
      this.profileImageSet = true;
    }
  }

  ionViewWillEnter() {
    this.loggedInUID = this.authService.getActiveUser().uid;
  }

  onMarkAsPurchased(item: Item, index: number) {
    // Creates the loading spinner.
    const loading = this.loadingCtrl.create({
      content: 'Marking item as purchased ...'
    });
    loading.present();

    if (item.purchased) {
      item.purchased = false;
      item.purchasedBy = null;
    } else {
      item.purchased = true;
      item.purchasedBy = this.authService.getActiveUser().uid;
    }

    this.user.items[index] = item;

    // Gets the new user's token, used for database operations.
    this.authService.getActiveUser().getToken()
      .then(
        (token: string) => {
          // Adds a new user to the database.
          this.userService.updateItemData(token, item, index)
            .subscribe(
              () => {
                loading.dismiss();
              },
              error => {
                loading.dismiss();
                this.handlerError(error.json().error);
              }
            );
        }
      );
  }

  handlerError(errorMessage: string) {
    // Creates an alert displaying an error message.
    const alert = this.alertCtrl.create({
      title: "An error has occurred!",
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }
}
