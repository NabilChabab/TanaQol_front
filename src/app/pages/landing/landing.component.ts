import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ToastModule } from 'primeng/toast';
import { FooterComponent } from '../../components/footers/footer/footer.component';



@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FooterComponent,
    ToastModule,

  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class IndexComponent  {

}
