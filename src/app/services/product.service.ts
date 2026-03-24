import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private API_URL = 'http://127.0.0.1:8000/api/products';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (!token) {
      console.warn('ProductService: token no encontrado en localStorage');
    }
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.API_URL, { headers: this.getHeaders() });
  }

  createProduct(productData: FormData): Observable<any> {
    return this.http.post<any>(this.API_URL, productData, { headers: this.getHeaders() });
  }

  updateProduct(id: number | string, productData: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, productData, { headers: this.getHeaders() });
  }

  deleteProduct(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }
}
