import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../env'

@Injectable({
  providedIn: 'root',
})
export class RefenceService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  FindAll(code: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiAuthToken}`,
    })
    return this.http.post(
      `${this.baseUrl}reference-data/find`,
      { typeId: code },
      { headers },
    )
  }
}
