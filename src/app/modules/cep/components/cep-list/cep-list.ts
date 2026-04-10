import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { CepEntry } from "@app/core/services/cep-storage.service";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { featherEye, featherTrash } from "@ng-icons/feather-icons";

@Component({
	selector: "app-cep-list",
	imports: [MatTableModule, MatButtonModule, NgIcon],
	providers: [provideIcons({ featherTrash, featherEye })],
	templateUrl: "./cep-list.html",
	styleUrl: "./cep-list.scss",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CepList {
	displayedColumns = ["cep", "endereco", "data", "acoes"];
	enderecos = input<CepEntry[]>([]);
	excluir = output<string>();
	verDetalhes = output<CepEntry>();
}
