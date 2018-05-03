import {ChangeDetectionStrategy, Component, Input, OnInit, SimpleChange, ChangeDetectorRef} from '@angular/core';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {TodoService} from '../todo.service';
import { MatDialog } from '@angular/material';
import { DialogQrComponent }  from '../dialog-qr/dialog-qr.component';
import { QrCodeReader }  from '../qr.service';
import { Subscription } from 'rxjs/Subscription';

type FCT_FILTER_ITEMS = (item: TodoItemData) => boolean;
declare const qrcode: any;

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {
  @Input() private data: TodoListData;

  constructor(private todoService: TodoService, public dialog: MatDialog, private qrReader: QrCodeReader, private chRef: ChangeDetectorRef) { }

  filterAll: FCT_FILTER_ITEMS = ()=> true;
  filterDone: FCT_FILTER_ITEMS = item=> item.isDone;
  filterUndone: FCT_FILTER_ITEMS = item=> !item.isDone;
  currentFilter :FCT_FILTER_ITEMS = this.filterAll;
  subscription: Subscription;
  file_text: string;

  ngOnInit() {
  }

  getLabel(): string {
    return this.data ? this.data.label : '';
  }

  getItems(): TodoItemData[] {
    return this.data ? this.data.items : [];
  }

  appendItem(itemLabel: string) {
    if (itemLabel ){
      this.todoService.appendItems( {
        label: itemLabel,
        isDone: false
      })
    }
  }
  

  removeItem(item: TodoItemData, undoRedo: boolean) {
    this.todoService.removeItems(undoRedo, item);
  }


  setItemDone(item: TodoItemData, isDone: boolean) {
    this.todoService.setItemsDone(isDone, true, item);
  }

  isAllDone() : boolean{
    return this.getItems().reduce(
      (acc,item) => acc && item.isDone,true)
  }

  changeToggleAll() {
    const done = !this.isAllDone();
    var undoRedo = false;
    for(var i = 0; i < this.data.items.length; i++ ){

      if (i === this.data.items.length - 1)
        undoRedo = true;
       
      this.todoService.setItemsDone(done,undoRedo, this.data.items[i] ); 
    }
  }

  nbItemunchecked() : number {
    return this.data.items.reduce(
      (acc,item)=>acc+(item.isDone?0:1),0)
  }

  nbItemChecked() : number {
    return this.data.items.reduce(
      (acc,item)=>acc+(item.isDone?1:0),0)
  }

  getFilteredItems(): TodoItemData[] {
   return this.getItems().filter(this.currentFilter);
 }

  removeDoneItems() {
    var undoRedo = false;
    for(var i = 0; i < this.getItems().filter(this.filterDone).length; i++ ){

      if (i === this.getItems().filter(this.filterDone).length - 1)
        undoRedo = true;
       
      this.removeItem(this.getItems().filter(this.filterDone)[i], undoRedo); 
    }
   }

   isEmpty(){
     return this.getItems().length === 0;
   }

   getLabelLeft() : string{
     if(this.nbItemunchecked() > 1){
       return "tâches restantes";
     }
     return "tâche restante";
   }

  undo(): void {
    this.todoService.undoAction();
  }

  redo(): void {
    this.todoService.redoAction();
  }


  openQrDialog() {
    console.log(this.getItems());
    let dialog = this.dialog.open(DialogQrComponent, {
       data: {
        items: this.getItems()
      }
    });
  }

   onFileChange(event) {
    const file = event.target.files[0];
    this.subscription = this.qrReader.decode(file)
      .subscribe(decodedString => this.readQrCode(decodedString));
      this.file_text = "";
  }

  readQrCode(res: string){
    this.todoService.loadDataItems(res);
    this.chRef.detectChanges();
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



}
