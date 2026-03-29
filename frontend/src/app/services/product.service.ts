import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private API_URL = 'http://127.0.0.1:8000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get<any>(this.API_URL);
  }

  createProduct(productData: FormData): Observable<any> {
    return this.http.post<any>(this.API_URL, productData);
  }

  updateProduct(id: number | string, productData: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, productData);
  }

  deleteProduct(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}
