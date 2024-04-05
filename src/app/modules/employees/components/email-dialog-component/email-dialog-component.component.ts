import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-email-dialog-component',
  templateUrl: './email-dialog-component.component.html',
  styleUrls: ['./email-dialog-component.component.scss']
})

export class EmailDialogComponentComponent {
  @Output() 
  sendEmailEvent: EventEmitter<{ content: string, subject: string }>
   = new EventEmitter<{ content: string, subject: string }>();

  emailContent: string = '';
  emailSubject: string = ''
  constructor(public dialogRef: MatDialogRef<EmailDialogComponentComponent>) {}

  sendEmail() {
    const emailData = { content: this.emailContent, subject: this.emailSubject };
    this.sendEmailEvent.emit(emailData);
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
