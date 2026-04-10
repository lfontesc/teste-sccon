import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { mockDetalhes, mockEntries } from "@app/core/mocks/cep.mock";

import { environment } from "../../../environments/environment";
import { CepEntry, CepStorageService } from "./cep-storage.service";


const baseUrl = `${environment.jsonServerUrl}/enderecos`;

describe("CepStorageService", () => {
	let service: CepStorageService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				CepStorageService,
				provideHttpClient(),
				provideHttpClientTesting()
			]
		});

		service = TestBed.inject(CepStorageService);
		httpMock = TestBed.inject(HttpTestingController);

		// Handle the initial carregar() call triggered in the constructor
		const initReq = httpMock.expectOne(baseUrl);
		expect(initReq.request.method).toBe("GET");
		initReq.flush(mockEntries);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it("deve ser criado", () => {
		expect(service).toBeTruthy();
	});

	it("deve carregar os endereços em ordem inversa na inicialização", () => {
		let enderecos: CepEntry[] = [];
		service.enderecos$.subscribe((e) => (enderecos = e));

		expect(enderecos).toEqual([...mockEntries].reverse());
	});

	describe("adicionar", () => {
		it("deve fazer POST de uma nova entrada e concluir sem recarregar", () => {
			const newEntry: CepEntry = {
				cep: "30130-110",
				endereco: "Av. Afonso Pena, Centro, Belo Horizonte, MG",
				data: "03/01/2025",
				detalhes: { ...mockDetalhes, cep: "30130-110", localidade: "Belo Horizonte", uf: "MG" }
			};

			let completed = false;
			service.adicionar(newEntry).subscribe(() => (completed = true));

			const postReq = httpMock.expectOne(baseUrl);
			expect(postReq.request.method).toBe("POST");
			expect(postReq.request.body).not.toHaveProperty("id");
			postReq.flush({ id: 3, ...newEntry });

			expect(completed).toBeTruthy();
		});

		it("deve fazer DELETE da entrada existente antes do POST quando o CEP já existe", () => {
			const updatedEntry: CepEntry = {
				cep: "01001-000",
				endereco: "Praça da Sé, Sé, São Paulo, SP",
				data: "05/01/2025",
				detalhes: mockDetalhes
			};

			service.adicionar(updatedEntry).subscribe();

			const deleteReq = httpMock.expectOne(`${baseUrl}/1`);
			expect(deleteReq.request.method).toBe("DELETE");
			deleteReq.flush({});

			const postReq = httpMock.expectOne(baseUrl);
			expect(postReq.request.method).toBe("POST");
			postReq.flush({ id: 3, ...updatedEntry });
		});

		it("deve atualizar enderecos$ com a entrada salva no topo", () => {
			const newEntry: CepEntry = {
				cep: "30130-110",
				endereco: "Av. Afonso Pena, Centro, Belo Horizonte, MG",
				data: "03/01/2025",
				detalhes: { ...mockDetalhes, cep: "30130-110", localidade: "Belo Horizonte", uf: "MG" }
			};
			const saved = { id: 3, ...newEntry };
			let enderecos: CepEntry[] = [];
			service.enderecos$.subscribe((e) => (enderecos = e));

			service.adicionar(newEntry).subscribe();

			httpMock.expectOne(baseUrl).flush(saved);

			expect(enderecos[0]).toEqual(saved);
			expect(enderecos).toHaveLength(3);
		});
	});

	describe("remover", () => {
		it("deve fazer DELETE da entrada pelo id e concluir sem recarregar", () => {
			let completed = false;
			service.remover("01001-000").subscribe(() => (completed = true));

			const deleteReq = httpMock.expectOne(`${baseUrl}/1`);
			expect(deleteReq.request.method).toBe("DELETE");
			deleteReq.flush({});

			expect(completed).toBeTruthy();
		});

		it("deve atualizar enderecos$ após remover uma entrada", () => {
			let enderecos: CepEntry[] = [];
			service.enderecos$.subscribe((e) => (enderecos = e));

			service.remover("01001-000").subscribe();

			httpMock.expectOne(`${baseUrl}/1`).flush({});

			expect(enderecos).toEqual([mockEntries[1]]);
		});

		it("deve concluir imediatamente sem chamadas HTTP quando o CEP não existir", () => {
			let completed = false;
			service.remover("99999-999").subscribe({ complete: () => (completed = true) });

			httpMock.expectNone(`${baseUrl}/undefined`);
			expect(completed).toBeTruthy();
		});
	});
});
