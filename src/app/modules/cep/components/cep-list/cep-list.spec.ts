import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CepList } from "./cep-list";

describe("CepList", () => {
	let component: CepList;
	let fixture: ComponentFixture<CepList>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CepList]
		}).compileComponents();

		fixture = TestBed.createComponent(CepList);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
