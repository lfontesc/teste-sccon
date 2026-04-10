import { ChangeDetectionStrategy, Component, inject, output } from "@angular/core";
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { NgxMaskDirective } from "ngx-mask";

import { CepState } from "../../states/cep.state";


function cepValidator(control: AbstractControl): ValidationErrors | null {
	const digits = (control.value ?? "").replace(/\D/g, "");
	return digits.length > 0 && digits.length < 8 ? { cepInvalido: true } : null;
}

@Component({
	selector: "app-cep-search",
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatProgressSpinner,
		NgxMaskDirective
	],
	templateUrl: "./cep-search.html",
	styleUrl: "./cep-search.scss",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CepSearch {
	private state = inject(CepState);

	cepControl = new FormControl("", [Validators.required, cepValidator]);
	buscar = output<string>();
	loading = this.state.loading;

	submit(): void {
		if (this.loading()) return;
		this.cepControl.markAsTouched();
		if (this.cepControl.invalid) return;

		this.buscar.emit(this.cepControl.value!);
		this.cepControl.reset();
	}
}
