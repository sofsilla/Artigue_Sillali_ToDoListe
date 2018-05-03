import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-dialog-qr',
  templateUrl: './dialog-qr.component.html',
  styleUrls: ['./dialog-qr.component.css']
})
export class DialogQrComponent implements OnInit {
  private qrCodeData;

  constructor(public dialogRef: MatDialogRef<DialogQrComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

 
  ngOnInit() {

    this.qrCodeData = "";
    // Stocker directement le JSON fonctionne mais seulement pour quelques élements, il faut gagner un maximum de place dans la chaîne de charactère à encoder
  	//this.qrCodeData = JSON.stringify(this.data.items); 
    
    this.data.items.forEach(element => {
        this.qrCodeData += element['label'].toString() + ":" + (element['isDone'] ? "T": "F") + "|"; 
    });

    // On retire le dernier caractère
    this.qrCodeData = this.qrCodeData.substring(0, this.qrCodeData.length - 1);
  }

  confirmSelection() {
    this.dialogRef.close();
  }

}


