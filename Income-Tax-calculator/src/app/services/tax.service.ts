import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  baseUrl = 'http://localhost:3000/api';
  constructor(private http:HttpClient) { }
  calculateTax(income: number) {
    return this.http.post<{ tax: number }>(`${this.baseUrl}/calculate-tax`, { income });
  }

  calculateTaxWithDeductions(income: number, deductions: number) {
    return this.http.post<{ tax: number, taxableIncome: number }>(
      `${this.baseUrl}/calculate-tax-with-deductions`,
      { income, deductions }
    );
  }
}
