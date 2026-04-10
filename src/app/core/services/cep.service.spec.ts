import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ViaCepResponse } from "@app/core/interfaces/cep";
import { mockDetalhes } from "@app/core/mocks/cep.mock";

import { environment } from "../../../environments/environment";
import { CepService } from "./cep.service";


describe("CepService", () => {
	let service: CepService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CepService, provideHttpClient(), provideHttpClientTesting()]
		});

		service = TestBed.inject(CepService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it("deve ser criado", () => {
		expect(service).toBeTruthy();
	});

	it("deve chamar a API ViaCEP com o CEP sem máscara", () => {
		service.buscar("01001000").subscribe();

		const req = httpMock.expectOne(`${environment.viaCepUrl}/01001000/json/`);
		expect(req.request.method).toBe("GET");
		req.flush(mockDetalhes);
	});

	it("deve remover caracteres não numéricos do CEP com máscara antes de chamar a API", () => {
		service.buscar("01001-000").subscribe();

		const req = httpMock.expectOne(`${environment.viaCepUrl}/01001000/json/`);
		expect(req.request.method).toBe("GET");
		req.flush(mockDetalhes);
	});

	it("deve retornar o ViaCepResponse em caso de sucesso", () => {
		let result: ViaCepResponse | undefined;

		service.buscar("01001-000").subscribe((res) => (result = res));

		const req = httpMock.expectOne(`${environment.viaCepUrl}/01001000/json/`);
		req.flush(mockDetalhes);

		expect(result).toEqual(mockDetalhes);
	});

	it("deve retornar uma resposta com o campo erro quando o CEP não for encontrado", () => {
		let result: ViaCepResponse | undefined;

		service.buscar("99999999").subscribe((res) => (result = res));

		const req = httpMock.expectOne(`${environment.viaCepUrl}/99999999/json/`);
		req.flush({ erro: "true" });

		expect(result?.erro).toBe("true");
	});

	it("deve propagar erros HTTP para o assinante", () => {
		let errorOccurred = false;

		service.buscar("00000000").subscribe({
			error: () => (errorOccurred = true)
		});

		const req = httpMock.expectOne(`${environment.viaCepUrl}/00000000/json/`);
		req.flush("Server error", { status: 500, statusText: "Internal Server Error" });

		expect(errorOccurred).toBeTruthy();
	});
});
