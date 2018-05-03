import {ChangeDetectionStrategy, Component,HostListener} from '@angular/core';
import {TodoService} from './todo.service';
import {TodoListData} from './dataTypes/TodoListData';
import {TodoItemData} from './dataTypes/TodoItemData';

import * as $ from 'jquery';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
	private td1: TodoListData;
    private animal;

	constructor(private todoService: TodoService){
		todoService.getTodoListDataObserver().subscribe(
			L => this.td1 = L
		);
	}

	@HostListener('document:keydown', ['$event'])
	documentClick(event: KeyboardEvent) {

		/*if((event.ctrlKey || event.metaKey) && event.keyCode == 90)
			this.undo();*/

		if((event.ctrlKey || event.metaKey) && event.keyCode == 89)
			event.preventDefault();
			//this.todoService.redoAction();
	}

	getCurrentTodoList(): TodoListData {
		return this.td1;
	}

	undo(): void{
		this.todoService.undoAction();
	}
	redo(): void{
		this.todoService.redoAction();
	}


}
