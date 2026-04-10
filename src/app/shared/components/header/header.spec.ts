import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideNoopAnimations } from "@angular/platform-browser/animations";
import { provideRouter, Router } from "@angular/router";
import { MENU_ITEMS, NavMenuItem } from "@app/core/data/data";

import { Header } from "./header";


describe("Header", () => {
	let component: Header;
	let fixture: ComponentFixture<Header>;
	let router: Router;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Header],
			providers: [provideRouter([]), provideNoopAnimations()]
		}).compileComponents();

		fixture = TestBed.createComponent(Header);
		component = fixture.componentInstance;
		router = TestBed.inject(Router);
		fixture.detectChanges();
	});

	it("deve criar o componente", () => {
		expect(component).toBeTruthy();
	});

	it("deve expor MENU_ITEMS", () => {
		expect(component.menuItems).toBe(MENU_ITEMS);
	});

	it("deve retornar false para itens sem activePrefix", () => {
		const homeItem: NavMenuItem = { label: "Home", url: "/home" };
		expect(component.isMenuItemActive(homeItem)).toBeFalsy();
	});

	it("deve retornar false quando a URL não começa com activePrefix", () => {
		const enderecoItem = MENU_ITEMS.find((i) => i.activePrefix)!;
		expect(component.isMenuItemActive(enderecoItem)).toBeFalsy();
	});

	it("deve retornar true quando a URL do router começa com activePrefix", () => {
		const enderecoItem = MENU_ITEMS.find((i) => i.activePrefix === "/cep")!;
		Object.defineProperty(router, "url", { get: () => "/cep", configurable: true });
		expect(component.isMenuItemActive(enderecoItem)).toBeTruthy();
	});

	it("deve retornar false quando activePrefix está definido mas a URL é diferente", () => {
		const enderecoItem = MENU_ITEMS.find((i) => i.activePrefix === "/cep")!;
		Object.defineProperty(router, "url", { get: () => "/home", configurable: true });
		expect(component.isMenuItemActive(enderecoItem)).toBeFalsy();
	});
});
