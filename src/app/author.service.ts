import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { Author } from './Models/author';
import { Book } from './Models/book';

// http://blog.danieleghidoli.it/2016/10/22/http-rxjs-observables-angular/
/**
 * A best practice is keeping all the stream manipulation logic
 * inside our service and return the Observable,
 * that can be subscribed by the controller.
 */
@Injectable()
export class AuthorService {
  baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {  }

  // basic example of service with an Http call
  get(id: number): Observable<any> {
    return this.http.get(this.baseUrl + '/authors/' + id);
  }

  getBooks(id: number): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseUrl + '/books/' + id);
  }
  getAuthors(id: number): Observable<Author[]> {
    return this.http.get<Author[]>(this.baseUrl + '/authors/' + id);
  }

  // Imagine that you want to get the data of an author and his books,
  //    but in order to get the books you need to call a different endpoint,
  //    such as /authors/1/books
  // Combining Observables in parallel
  // forkJoin: execute two or more Observables in parallel
  // forkJoin returns an Array with the results of the joined Observables.
  // We can compose them as we need, in order to return just one object.
  getAuthorWithBooks(id: number): Observable<any> {
    return forkJoin([
      this.http.get<Author>(this.baseUrl + '/authors/' + id),
      this.http.get<Book>(this.baseUrl + '/authors/' + id + '/books')
    ]).pipe(
        map((data: any[]) => {
            const author: any = data[0];
            const books: any[] = data[1];
            return author.books = books;
          })
    );
  }

  // Combining Observables in series
  // to get the author info from a book?
  // We should get the book data first and,
  // only when we get it,
  // we can call the authors endpoint with the author id.
  // In this case we’ll have to use the flatMap RxJS operator,
  // which is similar to the usual map RxJS operator.
  // The difference is that lets you chain two Observables, returning a new Observable:
  getBookAuthor(id: number): Observable<Author> {
    return this.http.get<Book>(this.baseUrl + '/books/' + id).pipe(
        flatMap((book: Book) => {
            return this.http.get<Author>(this.baseUrl + '/authors/' + book.author_id);
        })
    );
  }
  // In this case, what we will get is just the author info.
  // What if we want also the book object? As before,
  // we have to compose our objects
  getBookWithAuthor(id: number): Observable<any> {
    return this.http.get<Book>(this.baseUrl + '/books/' + id).pipe(
        flatMap((book: any) => {
            return this.http.get(this.baseUrl + '/authors/' + book.author_id).pipe(
                map((author: any) => {
                    book.author = author;
                    return book;
                  })
            );
          })
    );
  }

  // Combining Observables in series and in parallel
    // What if we would like to do the same (getting the book with its author),
    // but for multiple books at once?
    // We can combine forkJoin and flatMap:
  getBooksWithAuthor(): Observable<any[]> {
    return this.http.get(this.baseUrl + '/books/').pipe(
        flatMap((books: any[]) => {
            if (books.length > 0) {
              return forkJoin(
                books.map((book: any) => {
                  return this.http.get(this.baseUrl + '/authors/' + book.author_id).pipe(
                    map((author: any) => {
                        book.author = author;
                        return book;
                      })
                  );
                }) // end of forkJoin
              );
            }
            return of([]);
          }) // End of flatMap
    );
  }

  // Another Combining Observables in series and in parallel
  /**
   * It seems complicated, but it’s quite easy: after getting the list of books,
   * we use the flatMap, in order to merge the previous call with the result of the forkJoin,
   * that is called only if we have some books,
   * otherwise we just return an Observable containing an empty array (line 17).
   * Maybe you are wondering why we are using the forkJoin here, since there is just a call.
   * But, if you look better, there will be as much calls as many books we get.
   * In fact, at line 7 we are looping on the books array with the Array.map function,
   * which is not the same as the map RxJS Operator!
   * Then, for each author call we combine our objects and we return the book, which is what we want.
   * Another example can be getting author and editor info for a single book:
   */
    getBookWithDetails(id: number): Observable<any> {
    return this.http.get(this.baseUrl + '/books/' + id).pipe(
        flatMap((book: any) => {
            return forkJoin(
               of(book),
               this.http.get(this.baseUrl + '/authors/' + book.author_id),
               this.http.get(this.baseUrl + '/editors/' + book.editor_id)
            ).pipe(
                map((data: any[]) => {
                    const abook = data[0];
                    const author = data[1];
                    const editor = data[2];
                    abook.author = author;
                    abook.editor = editor;
                    return book;
                  })
            );
          })
    );
    /** As we can see, the forkJoin return an array with the result of each Observable,
     * that we can compose in order to return the final object.
     * Note that we are forkJoining the book object itself,
     * converting it in an Observable thanks to the of RxJS operator,
     * so that we can access it in the following map.
     */
  }
}
