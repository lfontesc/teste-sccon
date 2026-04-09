import { Component, signal } from "@angular/core";

import { CepList } from "../../components/cep-list/cep-list";
import { CepSearch } from "../../components/cep-search/cep-search";

@Component({
	selector: "app-cep",
	imports: [CepSearch, CepList],
	templateUrl: "./cep.html",
	styleUrl: "./cep.scss"
})
export class Cep {
	title = signal<string>("Busca de Endereços");
}
