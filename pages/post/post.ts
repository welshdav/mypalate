import {NavController, LoadingController} from 'ionic-angular';
import {Component} from '@angular/core';
import {Camera, ImagePicker} from 'ionic-native';
import {Angular2Apollo} from 'angular2-apollo';
import {Observable} from 'rxjs/Observable';
import gql from 'graphql-tag';

@Component({
  templateUrl: 'post.html'
})
export class PostPage {
  public post: any = {};
  public defaultImage = "https://upload.wikimedia.org/wikipedia/commons/f/f5/Image_manquante_2.svg";
  constructor(public nav: NavController,
    public apollo: Angular2Apollo,
    public loadingCtrl: LoadingController) {
    this.post = {
      title: "",
      description: "",
      recipe: "",
      image: this.defaultImage
    }
  }
  createPost() {
    // create post mutation
    if (this.post.image == this.defaultImage) { return; }
    if (!this.post.description.trim()) { return; }
    let loading = this.loadingCtrl.create({
      content: "Please wait while image is being uploaded...",
      dismissOnPageChange: true
    })
    loading.present();
    this.apollo.mutate({
      mutation: gql`mutation post($title: String, 
                                  $description: String!, 
                                  $recipe: String!, 
                                  $image: String!){
                      createPost(title: $title, 
                                 description: $description, 
                                 recipe: $recipe, 
                                 image: $image){
                        id
                        user{
                          id
                          firstName
                          lastName
                          username
                          avatar_url
                          rank
                        }
                        title
                        description
                        recipe
                        image_url
                      }
                    }`,
      variables: {
        title: this.post.title,
        description: this.post.description,
        recipe: this.post.recipe,
        image: this.post.image
      }
    }).subscribe(({data}) => {
      if (data) {
        this.post = {
          title: "",
          description: "",
          recipe: "",
          image: this.defaultImage
        };
        loading.dismiss();
        this.nav.parent.select(0);
      }

    }, (errors) =>{
        console.log('got some GraphQL execution errors', errors);
    })
  }

  getPhoto() {
    let options = {
      targetWidth: 500,
      targetHeight: 500,
      correctOrientation: true,
      destinationType: 0,
      sourceType: 0
    };
    Camera.getPicture(options).then((ImageData) => {
      let base64Image = "data:image/jpeg;base64," + ImageData;
      this.post.image = base64Image;
    })
  }

  takePhoto() {
    let options = {
      targetWidth: 500,
      targetHeight: 500,
      correctOrientation: true,
      destinationType: 0
    };
    Camera.getPicture(options).then((ImageData) => {
      let base64Image = "data:image/jpeg;base64," + ImageData;
      this.post.image = base64Image;
    }, (err) => {

    });
  }

  resetPhoto() {
    this.post.image = this.defaultImage;
  }
}
