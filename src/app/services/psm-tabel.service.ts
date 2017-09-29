import { Injectable } from "@angular/core";
import { Psm } from "../models/psm";
import { Headers, Http } from "@angular/http";

import 'rxjs/add/operator/toPromise'

@Injectable()

export class PsmTableService{

  private psmsUrl = 'api/psms';
  private psmTitleListUrl = 'api/psmTitleList';
  private headers = new Headers({'Content-type': 'application/json'});

  constructor(private http: Http){}

	getPsms(): Promise<Psm[]>{
    return this.http.get(this.psmsUrl)
      .toPromise()
      .then(response => response.json().data as Psm[])
      .catch(this.handleError);
	}

    getPsmTitleList(listLen:number): Promise<string[]>{
    return this.http.get(this.psmTitleListUrl)
      .toPromise()
      .then(response => {let strs:string[] = response.json().data as string[]; return strs.slice(0, listLen)})
      .catch(this.handleError);
	}
	// getPsm(id: number): Promise<Psm>{
    // const url = `${this.psmsUrl}/${id}`;
    // return this.http.get(url)
    //   .toPromise()
    //   .then(response => response.json().data as Psm)
    //   .catch(this.handleError);
    // }

  private handleError(error: any): Promise<any> {
    console.log('A error occurred', error);
    return Promise.reject(error.message || error);
  }


}
