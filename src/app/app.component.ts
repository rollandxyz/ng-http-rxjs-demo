import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from './data.service';
import { Product } from './product';
import { Family } from './family';
import { Location } from './location';
import { Transaction } from './transaction';
import { AuthorService } from './author.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  private products: Product[] = [];
  private prodLocation: Product;

  private families: Family[] = [];
  private locations: Location[] = [];
  private transactions: Transaction[] = [];
  private productsObservable: Observable<Product[]> ;

  rData: any;
  // constructor
  constructor(private dataService: DataService,
  private authorService: AuthorService ) {

    this.productsObservable = this.dataService.getProducts();

    this.dataService.getFamilies().subscribe((res: Family[]) => {
      this.families = res;
    });
    this.dataService.getLocations().subscribe((res: Location[]) => {
      console.log(res);
      this.locations = res;
    });
    this.dataService.getTransactions().subscribe((res: Transaction[]) => {
      console.log(res);
      this.transactions = res;
    });

    this.dataService.getProductById(1).subscribe((res: Product) => {
      console.log('prodLocations', res);
      this.prodLocation = res;
    });

  }

  ngOnInit(): void {
    // this.authorService.get(1).subscribe((data: any) => {
    //  this.rData = data;
    // });
  }
  onClicked() {
    // The controller should call the service
    // this.authorService.getBooks(11).subscribe((data: any) => {this.rData = JSON.stringify(data); });
    // this.authorService.getAuthorWithBooks(2).subscribe((data: any) => {this.rData = JSON.stringify(data); });
    // this.authorService.getBookAuthor(11).subscribe((data: any) => {this.rData = JSON.stringify(data); });
    // this.authorService.getBookWithAuthor(11).subscribe((data: any) => {this.rData = JSON.stringify(data); });
    // this.authorService.getBooksWithAuthor().subscribe((data: any) => {this.rData = JSON.stringify(data); });
    this.authorService.getBookWithDetails(11).subscribe((data: any) => {this.rData = JSON.stringify(data); });

  }
}

