import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideNoopAnimations } from "@angular/platform-browser/animations";
import { CepEntry } from "@app/core/services/cep-storage.service";
import { provideNgxMask } from "ngx-mask";
import { BehaviorSubject } from "rxjs";

import { CepFacade } from "../../facades/cep.facade";
import { CepState } from "../../states/cep.state";
import { Cep } from "./cep";


class MockCepFacade {
	private subject = new BehaviorSubject<CepEntry[]>([]);
	enderecos$ = this.subject.asObservable();
	buscar(_cep: string) {}
	remover(_cep: string) {}
	abrirDetalhes(_entry: CepEntry) {}
}

describe("Cep", () => {
	let component: Cep;
	let fixture: ComponentFixture<Cep>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Cep],
			providers: [
				provideNgxMask(),
				provideNoopAnimations()
			]
		})
			.overrideComponent(Cep, {
				set: { providers: [
					{ provide: CepFacade, useValue: new MockCepFacade() },
					CepState
				]}
			})
			.compileComponents();

		fixture = TestBed.createComponent(Cep);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("deve criar o componente", () => {
		expect(component).toBeTruthy();
	});

	it("deve ter o signal title definido como 'Busca de Endereços'", () => {
		expect(component.title()).toBe("Busca de Endereços");
	});

	it("deve renderizar o título da página no template", () => {
		const h1: HTMLHeadingElement = fixture.nativeElement.querySelector("h1");
		expect(h1.textContent?.trim()).toBe("Busca de Endereços");
	});

	it("deve renderizar o componente cep-search", () => {
		const search = fixture.nativeElement.querySelector("app-cep-search");
		expect(search).toBeTruthy();
	});

	it("deve renderizar o componente cep-list", () => {
		const list = fixture.nativeElement.querySelector("app-cep-list");
		expect(list).toBeTruthy();
	});
});
