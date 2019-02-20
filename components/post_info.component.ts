import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {PopoverController, ModalController, NavController} from 'ionic-angular';
import {Angular2Apollo} from 'angular2-apollo';
import gql from 'graphql-tag';
import {DateFormatPipe} from '../pipes/date-format.pipe';
import {OptionsPopover} from './options.component';
import {ReportPage} from '../pages/report/report';
import {FeathersService} from '../services/feathers.service';
@Component({
    selector: 'post-info',
    templateUrl: 'post-info.component.html'
})
export class PostInfoComponent implements OnInit {
    @Input() post;
    @Output() view = new EventEmitter();
    @Output() delete = new EventEmitter();
    constructor(public nav: NavController, public apollo: Angular2Apollo, public popoverCtrl: PopoverController, public modalCtrl: ModalController, public feathers: FeathersService) { }

    ngOnInit() { }
    
    emitView(){
        this.view.emit(this.post.user.id);
    }
    showOptions(event) {
        let popover = this.popoverCtrl.create(OptionsPopover, {
            data: this.post,
            userId: this.feathers.getUser()
        })
        
        popover.onDidDismiss((data) => {
            if (data){
                if(data == "delete"){
                    this.deletePost();
                }
                else if (data == "report"){
                    this.showReport()
                }
            }
        })
        
        popover.present({
            ev: event
        })
    }
    deletePost(){
        this.delete.emit(this.post);
    }
    showReport(){
        let reportModal = this.modalCtrl.create(ReportPage);
        reportModal.onDidDismiss(data => {
            if(data){
                this.sendReport(data);
            }
        });
        reportModal.present();
    }
    
    sendReport(report){
        this.apollo.mutate({
            mutation: gql`
                mutation sendReport(
                        $contentType: String!, 
                        $contentId: Int!, 
                        $reason: String!, 
                        $description: String){
                            reportAbuse(
                            contentType: $contentType, 
                            contentId: $contentId, 
                            reason: $reason, 
                            description: $description){
                                id
                            }
                }
            `,
            variables: {
                contentType: "post",
                contentId: this.post.id,
                reason: report.reason,
                description: report.description
            }
        })
    }

}
