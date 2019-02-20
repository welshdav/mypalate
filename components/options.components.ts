import { Component, OnInit } from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';

@Component({
    template: `
    
            <button ion-item (click)="reportAbuse()">Report Abuse</button>
            <button ion-item [hidden]="!isOwner" (click)="delete()">Delete</button>
    `
})
export class OptionsPopover implements OnInit {
    data: any;
    userId: any;
    constructor(public viewCtrl: ViewController, public params: NavParams) { 
        this.data = this.params.get('data');
        this.userId = this.params.get('userId');
    }

    ngOnInit() { }

    reportAbuse(){
        this.viewCtrl.dismiss("report");
    }
    delete(){
        this.viewCtrl.dismiss("delete");  
    }
    get isOwner(){
        if (!this.data) return false;
        if (!this.userId) return false;
        if (this.data.user){
            return this.data.user.id == this.userId;
        }
        if (this.data.from){
            return this.data.from.id == this.userId;
        }
        
    }

}
