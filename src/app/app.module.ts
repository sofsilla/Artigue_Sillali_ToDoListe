import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoService} from './todo.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { QRCodeModule } from 'angularx-qrcode';
import { MatCardModule} from '@angular/material';
import { MatButtonModule} from '@angular/material';
import { MatDialogModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogQrComponent } from './dialog-qr/dialog-qr.component';
import { MatSelectModule } from '@angular/material';
import { QrCodeReader } from './qr.service';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  exports: [
    MatButtonModule,
    MatDialogModule,
  ]
})
export class MaterialModule { }

@NgModule({
  imports: [
    FormsModule, 
    QRCodeModule, 
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    environment.production ? ServiceWorkerModule.register('ngsw-worker.js') : []
  ],
  entryComponents: [
    DialogQrComponent
  ],
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    DialogQrComponent
  ],
  providers: [TodoService, QrCodeReader],
  bootstrap: [AppComponent]
})
export class AppModule { }
