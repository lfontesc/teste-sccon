import { HttpErrorResponse } from "@angular/common/http";
import { DestroyRef, inject, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog } from "@angular/material/dialog";
import { CepEntry, CepStorageService } from "@app/core/services/cep-storage.service";
import { CepService } from "@app/core/services/cep.service";
import { ToastService } from "@app/core/services/toast.service";
import { catchError, EMPTY, finalize, map, switchMap, timeout, TimeoutError, timer, zip } from "rxjs";

import { CepDetailModal } from "../components/cep-detail-modal/cep-detail-modal";
import { CepState } from "../states/cep.state";


@Injectable()
export class CepFacade {
	private cepService = inject(CepService);
	private storage = inject(CepStorageService);
	private toast = inject(ToastService);
	private dialog = inject(MatDialog);
	private destroyRef = inject(DestroyRef);
	private state = inject(CepState);

	enderecos$ = this.storage.enderecos$;

	buscar(cep: string): void {
		this.state.setLoading(true);

		zip(
			this.cepService.buscar(cep).pipe(timeout(10_000)),
			timer(1200)
		).pipe(
			takeUntilDestroyed(this.destroyRef),
			map(([resultado]) => resultado),
			catchError((err) => {
				if (err instanceof TimeoutError) {
					this.toast.error("O serviço está demorando para responder. Tente novamente mais tarde.", "Tempo esgotado");
				} else if (err instanceof HttpErrorResponse && err.status === 0) {
					this.toast.error("Serviço indisponível ou sem conexão com a internet.", "Serviço indisponível");
				} else {
					this.toast.error("Não foi possível consultar o CEP. Tente novamente.", "Erro na consulta");
				}
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

				return this.storage
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
			}),
			finalize(() => this.state.setLoading(false))
		).subscribe((savedCep) => {
			this.toast.success(`${savedCep} adicionado ao topo da lista de endereços.`, "CEP encontrado!");
		});
	}

	remover(cep: string): void {
		this.storage
			.remover(cep)
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				catchError(() => {
					this.toast.error("Não foi possível remover o endereço.", "Erro ao remover");
					return EMPTY;
				})
			)
			.subscribe(() => {
				this.toast.info(`O endereço com CEP ${cep} foi removido.`, "Endereço removido");
			});
	}

	abrirDetalhes(entry: CepEntry): void {
		this.dialog.open(CepDetailModal, {
			data: { detalhes: entry.detalhes }
		});
	}
}
