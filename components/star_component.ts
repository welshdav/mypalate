import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
    selector: 'star-rating',
    templateUrl: 'star-rating.component.html'
})
export class StarRatingComponent implements OnInit {
    @Input() rating: Number;
    @Output() rate = new EventEmitter(); 
    constructor() {
         
    }

    ngOnInit() { 
    }
    
    ratePost(rating){
        this.rate.emit(rating);
    }
}
