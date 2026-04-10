import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideNoopAnimations } from "@angular/platform-browser/animations";

import { CepEntry } from "@app/core/services/cep-storage.service";
import { CepList } from "./cep-list";

const mockEntry: CepEntry = {
	id: 1,
	cep: "01001-000",
	endereco: "Praça da Sé, Sé, São Paulo, SP",
	data: "01/01/2025",
	detalhes: {
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
	}
};

describe("CepList", () => {
	let component: CepList;
	let fixture: ComponentFixture<CepList>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CepList],
			providers: [provideNoopAnimations()]
		}).compileComponents();

		fixture = TestBed.createComponent(CepList);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("deve criar o componente", () => {
		expect(component).toBeTruthy();
	});

	it("deve exibir enderecos vindos do input()", () => {
		fixture.componentRef.setInput("enderecos", [mockEntry]);
		fixture.detectChanges();

		const rows = fixture.nativeElement.querySelectorAll("tr[mat-row]");
		expect(rows.length).toBe(1);
	});

	it("deve emitir excluir com o CEP ao clicar no botão", () => {
		const emitted: string[] = [];
		const sub = component.excluir.subscribe((v) => emitted.push(v));

		fixture.componentRef.setInput("enderecos", [mockEntry]);
		fixture.detectChanges();

		const btn: HTMLButtonElement = fixture.nativeElement.querySelector("[aria-label='Excluir CEP 01001-000']");
		btn.click();

		expect(emitted).toEqual(["01001-000"]);
		sub.unsubscribe();
	});

	it("deve emitir verDetalhes com a entry ao clicar no botão", () => {
		const emitted: CepEntry[] = [];
		const sub = component.verDetalhes.subscribe((v) => emitted.push(v));

		fixture.componentRef.setInput("enderecos", [mockEntry]);
		fixture.detectChanges();

		const btn: HTMLButtonElement = fixture.nativeElement.querySelector("[aria-label='Ver detalhes do CEP 01001-000']");
		btn.click();

		expect(emitted).toEqual([mockEntry]);
		sub.unsubscribe();
	});
});
