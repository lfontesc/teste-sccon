import { Injectable, signal } from "@angular/core";


@Injectable()
export class CepState {
	private _loading = signal<boolean>(false);
	readonly loading = this._loading.asReadonly();

	setLoading(value: boolean): void {
		this._loading.set(value);
	}
}
