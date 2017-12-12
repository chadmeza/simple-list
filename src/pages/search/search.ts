import { Component } from '@angular/core';
import {User} from "../../models/user";
import {AuthService} from "../../services/auth";
import {UserService} from "../../services/user";
import {AlertController, LoadingController, NavController} from "ionic-angular";
import {ProfilePage} from "../profile/profile";

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  public users: User[] = [];
  selfie = "http://www.chadmeza.com/downloads/avatar.jpg";

  constructor(private authService: AuthService, private userService: UserService,
              private loadingCtrl: LoadingController, private alertCtrl: AlertController,
              private navCtrl: NavController) {

  }

  onSelectUser(user: User) {
    this.navCtrl.push(ProfilePage, {user: user});
  }

  onSearch(event: any) {
    const loading = this.loadingCtrl.create({
      content: 'Please wait ...'
    });
    loading.present();

    if (event.target.value && event.target.value != '') {
      // Gets the new user's token, used for database operations.
      this.authService.getActiveUser().getToken()
        .then(
          (token: string) => {
            // Adds a new user to the database.
            this.userService.searchUsers(token, event.target.value)
              .subscribe(
                (users: any) => {
                  loading.dismiss();

                  if (users) {
                    this.users = users;
                  }
                },
                error => {
                  loading.dismiss();
                  this.handlerError(error.message);
                }
              );
          }
        );
    } else {
      loading.dismiss();
      this.users = [];
    }
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
