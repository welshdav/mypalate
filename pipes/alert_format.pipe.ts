import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'alertFormat'
})

export class AlertFormatPipe implements PipeTransform {
    transform(alerts: any, args: any[]): any {
        if (alerts != undefined) {
            for (var index = 0; index < alerts.length; index++) {
                var element = alerts[index];
                if (element.category === "rate") {
                    element.icon = "star";
                    element.message = " rated your post";
                }
                else if (element.category === "comment") {
                    element.icon = "mail";
                    element.message = " commented on your post";
                }
                else if (element.category === "new_follower") {
                    element.icon = "person";
                    element.message = " is now following you";
                }
            }
        }
        return alerts
    }
}
