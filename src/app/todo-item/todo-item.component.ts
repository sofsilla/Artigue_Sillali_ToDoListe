import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {TodoService} from '../todo.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements OnInit {
  @Input() private data: TodoItemData;
  @ViewChild("newTextInput") newTextInput: ElementRef;

  private isEditing = false;

  constructor(private todoService: TodoService) { }

  ngOnInit() {
  }

  getLabel(): string {
  	return this.data.label;
  }

  setLabel(label: string) {
  	this.todoService.setItemsLabel(label, this.data);
  }

  getIsDone(): boolean {
  	return this.data.isDone;
  }

  setIsDone(isDone: boolean) {
  	this.todoService.setItemsDone(isDone, true, this.data);
  }

  remove() {
  	this.todoService.removeItems(true, this.data);
  }

  getIsEditing(): boolean {
    return this.isEditing;
  }

  setIsEditing(value: boolean) {
    this.isEditing = value ;
    if (value){
      requestAnimationFrame(
        () => this.newTextInput.nativeElement.focus())
    }
  }

  editItem(value: string){
    this.setLabel(value);
    this.isEditing = false;
  }

}
