import { Injectable } from '@angular/core';
import {TodoListData} from './dataTypes/TodoListData';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TodoItemData} from './dataTypes/TodoItemData';

@Injectable()
export class TodoService {
  private todoListSubject = new BehaviorSubject<TodoListData>( {label: 'TodoList', items: []} );

  undoRedo :[TodoItemData[]] = [[]];
  indexUndoRedo = 0;

  constructor() {
    this.todoListSubject.value.items = this.getItemsLocalStorage();
    this.undoRedo[0] = this.todoListSubject.value.items ;
  }

  getTodoListDataObserver(): Observable<TodoListData> {
    return this.todoListSubject.asObservable();
  }

  setItemsLabel(label: string, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label, isDone: I.isDone}) )
    });
    this.setItemsLocalStorage(this.todoListSubject.value.items);
    this.addUndoRedoAction(this.todoListSubject.value.items);
  }

  setItemsDone(isDone: boolean, undoRedo: boolean, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label: I.label, isDone}) )
    });

    if (undoRedo){
      this.setItemsLocalStorage(this.todoListSubject.value.items);
      this.addUndoRedoAction(this.todoListSubject.value.items);
    }
  }

  appendItems( ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      ...tdl,
      items: [...tdl.items, ...items]
    });
    this.setItemsLocalStorage(this.todoListSubject.value.items);
    this.addUndoRedoAction(this.todoListSubject.value.items);

  }

  removeItems(undoRedo: boolean, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      ...tdl,
      items: tdl.items.filter( I => items.indexOf(I) === -1 )
    });

    if (undoRedo){
      this.setItemsLocalStorage(this.todoListSubject.value.items);
      this.addUndoRedoAction(this.todoListSubject.value.items);
    }
  }


  setItemsLocalStorage(items: TodoItemData[] ): void {
    localStorage.setItem('items',JSON.stringify({ items: items }));
  }

  getItemsLocalStorage():TodoItemData[] {
    let localStorageItem = JSON.parse(localStorage.getItem('items'));
    return localStorageItem == null ? [] : localStorageItem.items;
  }

  addUndoRedoAction(items: TodoItemData[] ){

    if( typeof items !== 'undefined'){

      if (this.indexUndoRedo +1 < this.undoRedo.length ){

        let buffer: [TodoItemData[]] = [[]];
        for(var i = 0; i <= this.indexUndoRedo ; i++){
            buffer[i] = this.undoRedo[i];
        }
        this.undoRedo = buffer;
      }

      this.undoRedo.push(this.todoListSubject.value.items);
      this.indexUndoRedo++;
    }

  }

  undoAction(): void {
    console.log("Ctrl-Z " + this.indexUndoRedo );
    if (this.indexUndoRedo > 0){
      this.indexUndoRedo--;
      this.todoListSubject.value.items = this.undoRedo[this.indexUndoRedo];
      this.setItemsLocalStorage(this.todoListSubject.value.items);
    }

  }

  redoAction(): void {
    console.log("Ctrl-Y " + this.indexUndoRedo );
    if (this.undoRedo.length > this.indexUndoRedo + 1){
      this.indexUndoRedo++;
      this.todoListSubject.value.items = this.undoRedo[this.indexUndoRedo];
      this.setItemsLocalStorage(this.todoListSubject.value.items);
    }
  }

  loadDataItems(res: string){
    let items: TodoItemData[] = [];
    if (res.indexOf('|') >= 0 ) {
       
      res.split('|').forEach( function (val: string) {
        let item: TodoItemData = {label:val.split(":")[0], isDone:val.split(":")[1] == "T" ? true : false};
        items.push(item);
      });

      this.todoListSubject.value.items = items;
      this.setItemsLocalStorage(this.todoListSubject.value.items);
      this.addUndoRedoAction(this.todoListSubject.value.items);
    }
  }

}
