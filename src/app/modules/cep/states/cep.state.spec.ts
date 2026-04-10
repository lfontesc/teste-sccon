import { TestBed } from "@angular/core/testing";

import { CepState } from "./cep.state";


describe("CepState", () => {
	let state: CepState;

	beforeEach(() => {
		TestBed.configureTestingModule({ providers: [CepState] });
		state = TestBed.inject(CepState);
	});

	it("deve ser criado", () => {
		expect(state).toBeTruthy();
	});

	it("deve iniciar com loading como false", () => {
		expect(state.loading()).toBe(false);
	});

	it("deve definir loading como true ao chamar setLoading(true)", () => {
		state.setLoading(true);
		expect(state.loading()).toBe(true);
	});

	it("deve voltar loading para false após chamar setLoading(false)", () => {
		state.setLoading(true);
		state.setLoading(false);
		expect(state.loading()).toBe(false);
	});
});
