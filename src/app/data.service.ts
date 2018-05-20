import { Location } from './location';
import { Family } from './family';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product';
import { Transaction } from './transaction';

// http://blog.danieleghidoli.it/2016/10/22/http-rxjs-observables-angular/
// https://coryrylan.com/blog/angular-multiple-http-requests-with-rxjs
// https://codecraft.tv/courses/angular/http/http-with-observables/



@Injectable()
export class DataService {
  baseUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {  }

  getProducts() {
    return this.httpClient.get<Product[]>(this.baseUrl + '/products');
  }
  getFamilies() {
    return this.httpClient.get<Family[]>(this.baseUrl + '/families');
  }
  getLocations() {
    return this.httpClient.get<Location[]>(this.baseUrl + '/locations');
  }
  getTransactions() {
    return this.httpClient.get<Transaction[]>(this.baseUrl + '/families');
  }


  getProductById(id: number) {
    return this.httpClient.get<Product>(this.baseUrl + `/products/${id}`);
  }

}
