import { TestBed } from "@angular/core/testing";
import { ToastrService } from "ngx-toastr";

import { ToastService } from "./toast.service";


class MockToastrService {
	calls: { method: string; message: string; title: string | undefined }[] = [];

	success(message: string, title?: string) {
		this.calls.push({ method: "success", message, title });
	}
	error(message: string, title?: string) {
		this.calls.push({ method: "error", message, title });
	}
	warning(message: string, title?: string) {
		this.calls.push({ method: "warning", message, title });
	}
	info(message: string, title?: string) {
		this.calls.push({ method: "info", message, title });
	}
}

describe("ToastService", () => {
	let service: ToastService;
	let toastrMock: MockToastrService;

	beforeEach(() => {
		toastrMock = new MockToastrService();

		TestBed.configureTestingModule({
			providers: [
				ToastService,
				{ provide: ToastrService, useValue: toastrMock }
			]
		});

		service = TestBed.inject(ToastService);
	});

	it("deve ser criado", () => {
		expect(service).toBeTruthy();
	});

	it("deve delegar success ao ToastrService com mensagem e título", () => {
		service.success("Operação concluída", "Sucesso");
		expect(toastrMock.calls[0]).toEqual({
			method: "success",
			message: "Operação concluída",
			title: "Sucesso"
		});
	});

	it("deve delegar success ao ToastrService somente com mensagem", () => {
		service.success("Operação concluída");
		expect(toastrMock.calls[0]).toEqual({
			method: "success",
			message: "Operação concluída",
			title: undefined
		});
	});

	it("deve delegar error ao ToastrService com mensagem e título", () => {
		service.error("Falha na operação", "Erro");
		expect(toastrMock.calls[0]).toEqual({
			method: "error",
			message: "Falha na operação",
			title: "Erro"
		});
	});

	it("deve delegar warning ao ToastrService com mensagem e título", () => {
		service.warning("Atenção ao preenchimento", "Aviso");
		expect(toastrMock.calls[0]).toEqual({
			method: "warning",
			message: "Atenção ao preenchimento",
			title: "Aviso"
		});
	});

	it("deve delegar info ao ToastrService com mensagem e título", () => {
		service.info("Registro atualizado", "Informação");
		expect(toastrMock.calls[0]).toEqual({
			method: "info",
			message: "Registro atualizado",
			title: "Informação"
		});
	});
});
