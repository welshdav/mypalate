import {PopoverController, ModalController, NavController} from 'ionic-angular';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {DateFormatPipe} from '../pipes/date-format.pipe';
import {Angular2Apollo} from 'angular2-apollo';
import gql from 'graphql-tag';
import {OptionsPopover} from './options.component';
import {ReportPage} from '../pages/report/report';
import {FeathersService} from '../services/feathers.service';
@Component({
    selector: 'comment',
    templateUrl: 'comment.component.html'
})
export class CommentComponent implements OnInit {
    @Input() comment;
    @Output() delete = new EventEmitter();
    @Output() view = new EventEmitter();
    constructor(public nav: NavController, public apollo: Angular2Apollo, public feathers: FeathersService, public modalCtrl: ModalController, public popoverCtrl: PopoverController) { }

    ngOnInit() { }

    emitView(userId){
        this.view.emit(userId);
    }
    showOptions(event) {
        let popover = this.popoverCtrl.create(OptionsPopover, {
            data: this.comment,
            userId: this.feathers.getUser()
        })
        
        popover.onDidDismiss((data) => {
            if(data){
                if(data == "delete"){
                    this.deleteComment();
                }
                else if (data == "report"){
                    this.showReport()
                }
            }
        })
        
    popover.present({
            ev: event,
        })
    }
    
    deleteComment(){
        this.delete.emit(this.comment);
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
                contentType: "comment",
                contentId: this.comment.id,
                reason: report.reason,
                description: report.description
            }
        })
    }

}
