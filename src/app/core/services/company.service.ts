import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { ShareCapital } from '../../pages/summary/summary.component';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor() { }

  private http = inject(HttpClient);
  private baseUrl: string = environment.baseURL;
  private payloadSubject = new BehaviorSubject<any>(null);

  submitCompanyInfo(payload: any) {
    console.log("sendign req to",this.baseUrl);
    
    return this.http.post<{ message: string, companyId: string }>(`${this.baseUrl}company/submitCompanyInfo`, payload).pipe(
      
      
      catchError((error) => {
        console.error("Error occurred:", error);
        return throwError(() => new Error(error.error?.error || "Failed to submit the company information."));
      })
    );
  }

  shareCreation(data: any) {  
    console.log("creationOfShare",data);
    
    return this.http.post<{ message: string }>(`${this.baseUrl}company/creationOfShare`, data).pipe(
      catchError((error) => {
        console.error("Share creation error:", error);
        const errorMessage = error.error?.message || "Failed to create shares.";
        return throwError(() => new Error(errorMessage));
      })
    );
  }


  shareHoldersCreation(data: any): Observable<{ message: string }> {
    console.log('data',data);
    
    return this.http.post<{ message: string }>(`${this.baseUrl}company/shareHoldersInfo`, data).pipe(
      catchError((error) => {
        console.error("Share creation error:", error);
        const errorMessage = error.error?.message || "Failed to create shares.";
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getShareCapitalList(companyId: string, userId: string): Observable<{ message: string; data: any }> {
    const params = new HttpParams()
      .set('companyId', companyId)
      .set('userId', userId);

    return this.http.get<{ message: string; data: any }>(`${this.baseUrl}company/getShareCapitalList`, { params })
      .pipe(
        catchError((error) => {
          console.error("Shares capital list getting has an error", error);
          const errorMessage = error.error?.message || "Failed to get shares.";
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getShareHoldersList(companyId: string, userId: string): Observable<{ message: string; data: any }> {
    const params = new HttpParams()
      .set('companyId', companyId)
      .set('userId', userId);

    return this.http.get<{ message: string; data: any }>(`${this.baseUrl}company/getShareHoldersList`, { params })
      .pipe(
        catchError((error) => {
          console.error("Shares Holders list getting has an error", error);
          const errorMessage = error.error?.message || "Failed to get shares holders.";
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  InvateshareHoldersCreation(data: any): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}company/invateShare`, data).pipe(
      catchError((error) => {
        console.error("Share creation error:", error);
        const errorMessage = error.error?.message || "Failed to create shares.";
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  deleteShareCapital(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}company/deleteShareCapital`,
      { params: { id } }
    ).pipe(
      catchError((error) => {
        console.error("Error deleting share capital:", error);
        const errorMessage = error.error?.message || "Failed to delete share capital.";
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  DirectorInfoCreation(data: any): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}company/directorInfoCreation`, data).pipe(
      catchError((error) => {
        console.error("Direct Information creation error:", error);
        const errorMessage = error.error?.message || "Failed to create directors.";
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getDirectorsInfo(companyId: string, userId: string): Observable<{ message: string; data: any[] }> {
    const params = new HttpParams()
      .set('companyId', companyId)
      .set('userId', userId);

    return this.http
      .get<{ message: string; data: any[] }>(`${this.baseUrl}company/getDirectorsInfo`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error fetching directors info', error);
          const errorMessage = error.error?.message || 'Failed to get directors info.';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  deleteDirector(directorId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}company/deleteDirector/${directorId}`).pipe(
      catchError((error) => {
        console.error("Error deleting Director information:", error);
        const errorMessage = error.error?.message || "Failed to delete Director Information.";
        return throwError(() => new Error(errorMessage));
      })
    )
  }


  directorInviteCreation(data: any): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}company/inviteDirector`, data).pipe(
      catchError((error) => {
        console.error("Director Invite error:", error);
        const errorMessage = error.error?.message || "Failed to Invite Director.";
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  companySecretaryCreation(data: any): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}company/companySecretary`, data).pipe(
      catchError((error) => {
        console.error("comapany Secretry creation error:", error);
        const errorMessage = error.error?.message || "Failed to create company secretary.";
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getComapnyInfo(companyId: string) {
    return this.http.get(`${this.baseUrl}company/getCompanyInfo`, {
      params: { companyId }
    }).pipe(
      catchError((error) => {
        console.error("company information loading error", error);
        const errorMessage = "Failed to loading company Information.";
        return throwError(() => new Error(errorMessage));
      })
    )
  }

  getShareCapitalInfo(companyId: string): Observable<ShareCapital[]> {
    return this.http.get<ShareCapital[]>(`${this.baseUrl}company/getShareCapitalInfo`, {
      params: { companyId }
    }).pipe(
      catchError((error) => {
        console.error("company information loading error", error);
        const errorMessage = "Failed to loading company Information.";
        return throwError(() => new Error(errorMessage));
      })
    )
  }

  getShareHoldersListSummery(companyId: string): Observable<{ message: string; data: any }> {
    const params = new HttpParams()
      .set('companyId', companyId)

    return this.http.get<{ message: string; data: any }>(`${this.baseUrl}company/getShareHoldersListSummery`, { params })
      .pipe(
        catchError((error) => {
          console.error("Shares Holders list getting has an error", error);
          const errorMessage = error.error?.message || "Failed to get shares holders.";
          return throwError(() => new Error(errorMessage));
        })
      );
  }


  getDirectorInformation(companyId: string): Observable<{ message: string; data: any }> {
    const params = new HttpParams().set('companyId', companyId);

    return this.http.get<{ message: string; data: any }>(`${this.baseUrl}company/getDirectorInformation`, { params })
      .pipe(
        catchError((error) => {
          console.error("Directors Holders list getting has an error", error);
          const errorMessage = error.error?.message || "Failed to get shares holders.";
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getCompanySecretaryInformation(companyId: string): Observable<{ message: string; data: any }> {
    const params = new HttpParams().set('companyId', companyId);

    return this.http.get<{ message: string; data: any }>(`${this.baseUrl}company/getCompanySecretaryInformation`, { params })
      .pipe(
        catchError((error) => {
          console.error("company secretary list getting has an error", error);
          const errorMessage = error.error?.message || "Failed to get comapnay Secretary.";
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  setPayload(payload: any): void {
    this.payloadSubject.next(payload);
  }

  getPayload(): any {
    return this.payloadSubject.asObservable();
  }
}
