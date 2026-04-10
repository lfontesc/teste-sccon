import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideNoopAnimations } from "@angular/platform-browser/animations";
import { provideNgxMask } from "ngx-mask";

import { CepState } from "../../states/cep.state";
import { CepSearch } from "./cep-search";

describe("CepSearch", () => {
	let component: CepSearch;
	let fixture: ComponentFixture<CepSearch>;
	let state: CepState;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CepSearch],
			providers: [
				provideNgxMask(),
				provideNoopAnimations(),
				CepState
			]
		}).compileComponents();

		fixture = TestBed.createComponent(CepSearch);
		component = fixture.componentInstance;
		state = TestBed.inject(CepState);
		fixture.detectChanges();
	});

	it("deve criar o componente", () => {
		expect(component).toBeTruthy();
	});

	describe("cepControl validation", () => {
		it("deve ser inválido quando vazio", () => {
			expect(component.cepControl.invalid).toBeTruthy();
		});

		it("deve ser inválido quando o CEP tem menos de 8 dígitos", () => {
			component.cepControl.setValue("1234");
			expect(component.cepControl.hasError("cepInvalido")).toBeTruthy();
		});

		it("deve ser válido quando o CEP tem exatamente 8 dígitos", () => {
			component.cepControl.setValue("01001000");
			expect(component.cepControl.valid).toBeTruthy();
		});

		it("deve ser válido quando o CEP está no formato com máscara", () => {
			component.cepControl.setValue("01001-000");
			expect(component.cepControl.valid).toBeTruthy();
		});
	});

	describe("submit()", () => {
		it("não deve emitir buscar quando o formulário é inválido", () => {
			const emitted: string[] = [];
			const sub = component.buscar.subscribe((v) => emitted.push(v));

			component.submit();

			expect(emitted).toHaveLength(0);
			sub.unsubscribe();
		});

		it("deve emitir buscar com o valor do CEP quando o formulário é válido", () => {
			const emitted: string[] = [];
			const sub = component.buscar.subscribe((v) => emitted.push(v));

			component.cepControl.setValue("01001000");
			component.submit();

			expect(emitted).toEqual(["01001000"]);
			sub.unsubscribe();
		});

		it("deve resetar o formulário após um envio válido", () => {
			component.cepControl.setValue("01001000");
			component.submit();

			expect(component.cepControl.value).toBeNull();
		});
	});

	describe("loading state", () => {
		it("deve desabilitar o botão quando state.loading for true", () => {
			state.setLoading(true);
			fixture.detectChanges();

			const button: HTMLButtonElement = fixture.nativeElement.querySelector("button");
			expect(button.disabled).toBe(true);
		});

		it("não deve emitir buscar quando loading for true", () => {
			state.setLoading(true);
			fixture.detectChanges();

			const emitted: string[] = [];
			const sub = component.buscar.subscribe((v) => emitted.push(v));

			component.cepControl.setValue("01001000");
			component.submit();

			expect(emitted).toHaveLength(0);
			sub.unsubscribe();
		});
	});
});
