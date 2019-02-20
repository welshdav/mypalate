import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {NavController} from 'ionic-angular';
import {StarRatingComponent} from '../components/star-rating.component';

@Component({
    selector: 'post',
    templateUrl: 'post.component.html'
})
export class PostComponent implements OnInit {
    @Input() post;
    @Output() view = new EventEmitter();
    @Output() rate = new EventEmitter();
    constructor(public nav: NavController) { }

    ngOnInit() {
     }
    
    emitView(){
        this.view.emit(this.post);
    }
    ratePost(rating){
        this.rate.emit({postId: this.post.id, rating});
  }

}
