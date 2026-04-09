import { Component, inject } from "@angular/core";
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CepStorageService } from "@app/core/services/cep-storage.service";
import { CepService } from "@app/core/services/cep.service";
import { ToastService } from "@app/core/services/toast.service";
import { NgxMaskDirective } from "ngx-mask";
import { catchError, EMPTY, map, switchMap } from "rxjs";

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
		NgxMaskDirective
	],
	templateUrl: "./cep-search.html",
	styleUrl: "./cep-search.scss"
})
export class CepSearch {
	cepControl = new FormControl("", [Validators.required, cepValidator]);

	private cepService = inject(CepService);
	private cepStorageService = inject(CepStorageService);
	private toast = inject(ToastService);

	buscar() {
		this.cepControl.markAsTouched();
		if (this.cepControl.invalid) {
			this.toast.warning("Por favor, digite um CEP válido antes de buscar.", "CEP inválido");
			return;
		}

		const cep = this.cepControl.value!;

		this.cepService
			.buscar(cep)
			.pipe(
				catchError(() => {
					this.toast.error("Não foi possível consultar o CEP. Tente novamente.", "Erro na consulta");
					return EMPTY;
				}),
				switchMap((resultado) => {
					if (resultado.erro) {
						this.toast.warning("CEP não encontrado. Verifique o número e tente novamente.", "CEP inválido");
						return EMPTY;
					}

					const partes = [
						resultado.logradouro,
						resultado.bairro,
						resultado.localidade,
						resultado.uf
					]
						.filter(Boolean)
						.join(", ");

					return this.cepStorageService
						.adicionar({
							cep: resultado.cep,
							endereco: partes,
							data: new Date().toLocaleDateString("pt-BR"),
							detalhes: resultado
						})
						.pipe(
							map(() => resultado.cep),
							catchError(() => {
								this.toast.error("Não foi possível salvar o endereço.", "Erro ao salvar");
								return EMPTY;
							})
						);
				})
			)
			.subscribe((cep) => {
				this.cepControl.reset();
				this.toast.success(`${cep} adicionado ao topo da lista de endereços.`, "CEP encontrado!");
			});
	}
}
