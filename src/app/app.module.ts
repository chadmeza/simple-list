import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {AddItemPage} from "../pages/add-item/add-item";
import {ForgotPasswordPage} from "../pages/forgot-password/forgot-password";
import {ProfilePage} from "../pages/profile/profile";
import {RegisterPage} from "../pages/register/register";
import {SearchPage} from "../pages/search/search";
import {SigninPage} from "../pages/signin/signin";
import {AuthService} from "../services/auth";
import {UserService} from "../services/user";
import {HttpModule} from "@angular/http";
import {UploadService} from "../services/upload";
import {Camera} from "@ionic-native/camera";
import {SocialSharing} from "@ionic-native/social-sharing";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddItemPage,
    ForgotPasswordPage,
    ProfilePage,
    RegisterPage,
    SearchPage,
    SigninPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AddItemPage,
    ForgotPasswordPage,
    ProfilePage,
    RegisterPage,
    SearchPage,
    SigninPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    UserService,
    UploadService,
    Camera,
    SocialSharing
  ]
})
export class AppModule {}
