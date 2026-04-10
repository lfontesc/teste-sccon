import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { ViaCepResponse } from "@app/core/interfaces/cep";

export interface CepEntry {
	id?: number;
	cep: string;
	endereco: string;
	data: string;
	detalhes: ViaCepResponse;
}

@Injectable({ providedIn: "root" })
export class CepStorageService {
	private http = inject(HttpClient);
	private baseUrl = `${environment.jsonServerUrl}/enderecos`;

	private _enderecos = new BehaviorSubject<CepEntry[]>([]);
	enderecos$ = this._enderecos.asObservable();

	constructor() {
		this.carregar().subscribe();
	}

	adicionar(entry: CepEntry): Observable<void> {
		const { id: _id, ...payload } = entry;
		const existente = this._enderecos.getValue().find((e) => e.cep === entry.cep);

		const post$ = this.http.post<CepEntry>(this.baseUrl, payload).pipe(
			tap((saved) => {
				const sem = this._enderecos.getValue().filter((e) => e.cep !== entry.cep);
				this._enderecos.next([saved, ...sem]);
			}),
			map(() => void 0)
		);

		if (existente?.id) {
			return this.http
				.delete(`${this.baseUrl}/${existente.id}`)
				.pipe(switchMap(() => post$));
		}

		return post$;
	}

	remover(cep: string): Observable<void> {
		const entry = this._enderecos.getValue().find((e) => e.cep === cep);
		if (!entry?.id) return of(void 0);

		return this.http.delete(`${this.baseUrl}/${entry.id}`).pipe(
			tap(() => {
				const sem = this._enderecos.getValue().filter((e) => e.cep !== cep);
				this._enderecos.next(sem);
			}),
			map(() => void 0)
		);
	}

	private carregar(): Observable<void> {
		return this.http.get<CepEntry[]>(this.baseUrl).pipe(
			tap((data) => this._enderecos.next([...data].reverse())),
			map(() => void 0)
		);
	}
}
