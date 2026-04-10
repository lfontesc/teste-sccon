import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideNoopAnimations } from "@angular/platform-browser/animations";

import { Layout } from "./layout";

describe("Layout", () => {
	let component: Layout;
	let fixture: ComponentFixture<Layout>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Layout],
			providers: [provideRouter([]), provideNoopAnimations()]
		}).compileComponents();

		fixture = TestBed.createComponent(Layout);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("deve criar o componente", () => {
		expect(component).toBeTruthy();
	});

	it("deve renderizar o header", () => {
		const header = fixture.nativeElement.querySelector("app-header");
		expect(header).toBeTruthy();
	});

	it("deve renderizar o breadcrumb", () => {
		const breadcrumb = fixture.nativeElement.querySelector("app-breadcrumb");
		expect(breadcrumb).toBeTruthy();
	});

	it("deve renderizar o router outlet", () => {
		const outlet = fixture.nativeElement.querySelector("router-outlet");
		expect(outlet).toBeTruthy();
	});
});
