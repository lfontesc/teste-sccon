import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { ViaCepResponse } from "@app/core/interfaces/cep";

interface DialogData {
	detalhes: ViaCepResponse;
}

const LABELS: Record<string, string> = {
	cep: "CEP",
	logradouro: "Logradouro",
	complemento: "Complemento",
	unidade: "Unidade",
	bairro: "Bairro",
	localidade: "Cidade",
	uf: "UF",
	estado: "Estado",
	regiao: "Região",
	ibge: "IBGE",
	gia: "GIA",
	ddd: "DDD",
	siafi: "SIAFI"
};

@Component({
	selector: "app-cep-detail-modal",
	imports: [MatDialogModule, MatButtonModule],
	templateUrl: "./cep-detail-modal.html",
	styleUrl: "./cep-detail-modal.scss"
})
export class CepDetailModal {
	data = inject<DialogData>(MAT_DIALOG_DATA);

	campos = Object.entries(this.data.detalhes)
		.filter(([key]) => key !== "erro" && LABELS[key])
		.map(([key, value]) => ({ label: LABELS[key], valor: value || "—" }));
}
