import { HttpErrorResponse } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { ViaCepResponse } from "@app/core/interfaces/cep";
import { CepEntry, CepStorageService } from "@app/core/services/cep-storage.service";
import { CepService } from "@app/core/services/cep.service";
import { ToastService } from "@app/core/services/toast.service";
import { BehaviorSubject, EMPTY, Observable, of, throwError, TimeoutError } from "rxjs";
import { vi } from "vitest";

import { CepDetailModal } from "../components/cep-detail-modal/cep-detail-modal";
import { CepState } from "../states/cep.state";
import { CepFacade } from "./cep.facade";


const mockViaCepResponse: ViaCepResponse = {
	cep: "01001-000",
	logradouro: "Praça da Sé",
	complemento: "lado ímpar",
	unidade: "",
	bairro: "Sé",
	localidade: "São Paulo",
	uf: "SP",
	estado: "São Paulo",
	regiao: "Sudeste",
	ibge: "3550308",
	gia: "1004",
	ddd: "11",
	siafi: "7107"
};

const mockEntry: CepEntry = {
	id: 1,
	cep: "01001-000",
	endereco: "Praça da Sé, Sé, São Paulo, SP",
	data: "01/01/2025",
	detalhes: mockViaCepResponse
};

class MockCepService {
	result: Observable<ViaCepResponse> = of(mockViaCepResponse);
	calledWithCep: string | null = null;

	buscar(cep: string) {
		this.calledWithCep = cep;
		return this.result;
	}
}

class MockCepStorageService {
	private subject = new BehaviorSubject<CepEntry[]>([]);
	enderecos$ = this.subject.asObservable();
	adicionarResult: Observable<void> = of(void 0);
	removerResult: Observable<void> = of(void 0);
	adicionarCalls: CepEntry[] = [];
	removerCalls: string[] = [];

	adicionar(entry: CepEntry) {
		this.adicionarCalls.push(entry);
		return this.adicionarResult;
	}

	remover(cep: string) {
		this.removerCalls.push(cep);
		return this.removerResult;
	}
}

class MockToastService {
	calls: { method: string; message: string; title?: string }[] = [];
	success(m: string, t?: string) { this.calls.push({ method: "success", message: m, title: t }); }
	error(m: string, t?: string) { this.calls.push({ method: "error", message: m, title: t }); }
	warning(m: string, t?: string) { this.calls.push({ method: "warning", message: m, title: t }); }
	info(m: string, t?: string) { this.calls.push({ method: "info", message: m, title: t }); }
}

class MockMatDialog {
	lastOpenedComponent: unknown = null;
	lastOpenedConfig: unknown = null;

	open(component: unknown, config: unknown) {
		this.lastOpenedComponent = component;
		this.lastOpenedConfig = config;
		return { afterClosed: () => EMPTY };
	}
}

describe("CepFacade", () => {
	let facade: CepFacade;
	let mockCepService: MockCepService;
	let mockStorage: MockCepStorageService;
	let mockToast: MockToastService;
	let mockDialog: MockMatDialog;
	let state: CepState;

	beforeEach(() => {
		mockCepService = new MockCepService();
		mockStorage = new MockCepStorageService();
		mockToast = new MockToastService();
		mockDialog = new MockMatDialog();

		TestBed.configureTestingModule({
			providers: [
				CepFacade,
				CepState,
				{ provide: CepService, useValue: mockCepService },
				{ provide: CepStorageService, useValue: mockStorage },
				{ provide: ToastService, useValue: mockToast },
				{ provide: MatDialog, useValue: mockDialog }
			]
		});

		facade = TestBed.inject(CepFacade);
		state = TestBed.inject(CepState);
	});

	it("deve ser criado", () => {
		expect(facade).toBeTruthy();
	});

	describe("buscar()", () => {
		beforeEach(() => vi.useFakeTimers());
		afterEach(() => vi.useRealTimers());

		it("deve chamar cepService.buscar, storage.adicionar e toast.success", () => {
			facade.buscar("01001-000");
			vi.runAllTimers();

			expect(mockCepService.calledWithCep).toBe("01001-000");
			expect(mockStorage.adicionarCalls.length).toBe(1);
			expect(mockToast.calls[0]?.method).toBe("success");
		});

		it("deve definir loading como true durante a execução e false após concluir", () => {
			facade.buscar("01001-000");
			expect(state.loading()).toBe(true);

			vi.runAllTimers();
			expect(state.loading()).toBe(false);
		});

		it("deve exibir toast.error em caso de erro HTTP genérico", () => {
			mockCepService.result = throwError(() => new Error("HTTP Error"));

			facade.buscar("01001-000");

			expect(mockToast.calls[0]?.method).toBe("error");
			expect(mockToast.calls[0]?.message).toContain("Não foi possível consultar");
		});

		it("deve exibir toast de tempo esgotado quando a requisição expirar", () => {
			mockCepService.result = throwError(() => new TimeoutError());

			facade.buscar("01001-000");

			expect(mockToast.calls[0]?.method).toBe("error");
			expect(mockToast.calls[0]?.message).toContain("demorando para responder");
		});

		it("deve exibir toast de serviço indisponível quando o backend não responde (status 0)", () => {
			mockCepService.result = throwError(() => new HttpErrorResponse({ status: 0, statusText: "Unknown Error" }));

			facade.buscar("01001-000");

			expect(mockToast.calls[0]?.method).toBe("error");
			expect(mockToast.calls[0]?.message).toContain("indisponível");
		});

		it("deve exibir toast.warning quando resultado.erro estiver definido", () => {
			mockCepService.result = of({ ...mockViaCepResponse, erro: "true" as const });

			facade.buscar("99999999");
			vi.runAllTimers();

			expect(mockToast.calls[0]?.method).toBe("warning");
		});

		it("deve exibir toast.error quando storage.adicionar falhar", () => {
			mockStorage.adicionarResult = throwError(() => new Error("Save error"));

			facade.buscar("01001-000");
			vi.runAllTimers();

			expect(mockToast.calls[0]?.method).toBe("error");
		});
	});

	describe("remover()", () => {
		it("deve chamar storage.remover e toast.info", () => {
			facade.remover("01001-000");

			expect(mockStorage.removerCalls).toContain("01001-000");
			expect(mockToast.calls[0]?.method).toBe("info");
		});

		it("deve exibir toast.error quando remover falhar", () => {
			mockStorage.removerResult = throwError(() => new Error("Delete error"));

			facade.remover("01001-000");

			expect(mockToast.calls[0]?.method).toBe("error");
		});
	});

	describe("abrirDetalhes()", () => {
		it("deve abrir o CepDetailModal com os detalhes da entrada", () => {
			facade.abrirDetalhes(mockEntry);

			expect(mockDialog.lastOpenedComponent).toBe(CepDetailModal);
		});
	});
});
