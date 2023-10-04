import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

@Injectable({
  providedIn: 'root',
})
export class CharityPageService {
  private apiUrl = '/api/charity-users';

  constructor(private http: HttpClient, private auth: AuthServerProvider) {}

  getCharityUsers(): Observable<any> {
    const authToken = this.auth.getToken();
    const headers = new HttpHeaders({
      Accept: '*/*',
      Authorization: `Bearer ${authToken}`,
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }
}
