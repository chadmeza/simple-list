import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import 'rxjs/add/operator/map';
import {Camera, CameraOptions} from "@ionic-native/camera";

@Injectable()
export class UploadService {
  public cameraImage: string;

  constructor(public http: Http, private camera: Camera) {}

  selectImage(): Promise<any> {
    return new Promise(resolve => {
      let cameraOptions : CameraOptions = {
        sourceType         : this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType    : this.camera.DestinationType.DATA_URL,
        quality            : 80,
        targetWidth        : 300,
        targetHeight       : 300,
        allowEdit          : true,
        encodingType       : this.camera.EncodingType.JPEG,
        mediaType          : this.camera.MediaType.PICTURE,
        correctOrientation : true
      };

      this.camera.getPicture(cameraOptions)
        .then((imageData) => {
          this.cameraImage 	= "data:image/jpeg;base64," + imageData;
          resolve(this.cameraImage);
        });
    });
  }
}
