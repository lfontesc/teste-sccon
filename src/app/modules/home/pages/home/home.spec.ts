import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Home } from "./home";

describe("Home", () => {
	let component: Home;
	let fixture: ComponentFixture<Home>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Home]
		}).compileComponents();

		fixture = TestBed.createComponent(Home);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("deve criar o componente", () => {
		expect(component).toBeTruthy();
	});

	it("deve renderizar o cabeçalho de boas-vindas", () => {
		const h1: HTMLHeadingElement = fixture.nativeElement.querySelector("h1");
		expect(h1.textContent).toContain("Bem-vindo");
	});

	it("deve renderizar um link para o perfil LinkedIn do autor", () => {
		const link: HTMLAnchorElement = fixture.nativeElement.querySelector("a[href*='linkedin']");
		expect(link).toBeTruthy();
		expect(link.textContent).toContain("Lucas Fontes Cartaxo");
	});
});
