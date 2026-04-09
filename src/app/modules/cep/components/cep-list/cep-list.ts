import { Component, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import {
	CepEntry,
	CepStorageService
} from "@app/core/services/cep-storage.service";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { featherEye, featherTrash } from "@ng-icons/feather-icons";
import { ToastService } from "@app/core/services/toast.service";
import { catchError, EMPTY } from "rxjs";

import { CepDetailModal } from "../cep-detail-modal/cep-detail-modal";

@Component({
	selector: "app-cep-list",
	imports: [MatTableModule, MatButtonModule, NgIcon],
	providers: [provideIcons({ featherTrash, featherEye })],
	templateUrl: "./cep-list.html",
	styleUrl: "./cep-list.scss"
})
export class CepList {
	displayedColumns = ["cep", "endereco", "data", "acoes"];
	dataSource = signal<CepEntry[]>([]);

	private cepStorageService = inject(CepStorageService);
	private dialog = inject(MatDialog);
	private toast = inject(ToastService);

	constructor() {
		this.cepStorageService.enderecos$
			.pipe(takeUntilDestroyed())
			.subscribe((enderecos) => {
				this.dataSource.set(enderecos);
			});
	}

	excluir(cep: string) {
		this.cepStorageService
			.remover(cep)
			.pipe(
				catchError(() => {
					this.toast.error("Não foi possível remover o endereço.", "Erro ao remover");
					return EMPTY;
				})
			)
			.subscribe(() => {
				this.toast.info(`O endereço com CEP ${cep} foi removido.`, "Endereço removido");
			});
	}

	verDetalhes(entry: CepEntry) {
		this.dialog.open(CepDetailModal, {
			data: { detalhes: entry.detalhes }
		});
	}
}
