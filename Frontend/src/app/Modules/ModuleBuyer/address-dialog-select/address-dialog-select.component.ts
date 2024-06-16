import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-address-dialog-select',
  templateUrl: './address-dialog-select.component.html',
  styleUrls: ['./address-dialog-select.component.css']
})
export class AddressDialogSelectComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddressDialogSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public addresses: any[]
  ) {}
  ngOnInit(): void {
   console.log(this.addresses)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectAddress(address: any): void {
    this.dialogRef.close(address);
  }
}
