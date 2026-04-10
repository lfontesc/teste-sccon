import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";

import { CepList } from "../../components/cep-list/cep-list";
import { CepSearch } from "../../components/cep-search/cep-search";
import { CepFacade } from "../../facades/cep.facade";
import { CepState } from "../../states/cep.state";


@Component({
	selector: "app-cep",
	imports: [CepSearch, CepList],
	templateUrl: "./cep.html",
	styleUrl: "./cep.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [CepFacade, CepState]
})
export class Cep {
	title = signal<string>("Busca de Endereços");
	facade = inject(CepFacade);
	enderecos = toSignal(this.facade.enderecos$, { initialValue: [] });
}
