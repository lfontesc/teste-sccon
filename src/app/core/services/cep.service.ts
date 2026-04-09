import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { ViaCepResponse } from "@app/core/interfaces/cep";

@Injectable({ providedIn: "root" })
export class CepService {
	private http = inject(HttpClient);

	buscar(cep: string): Observable<ViaCepResponse> {
		const cepLimpo = cep.replace(/\D/g, "");
		return this.http.get<ViaCepResponse>(
			`${environment.viaCepUrl}/${cepLimpo}/json/`
		);
	}
}
