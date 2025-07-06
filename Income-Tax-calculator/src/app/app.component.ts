import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaxService } from './services/tax.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
    FormsModule,
    HttpClientModule,
  NgIf,
CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
   income: number = 0;
  deductions = { '80C': 0, '80D': 0, '80E': 0 };
  result: any;

  constructor(private http: HttpClient) {}

  calculateTax() {
    const payload = {
      income: this.income,
      deductions: this.deductions
    };

    this.http.post<any>('http://localhost:3000/api/calculate-tax', payload)
      .subscribe({
        next: (res) => this.result = res,
        error: (err) => alert('Error: ' + err.error.error)
      });
  }
}
