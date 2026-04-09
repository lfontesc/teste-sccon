import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { CepRoutingModule } from "./cep.routes";
import { Cep } from "./pages/cep/cep";

@NgModule({
	imports: [CommonModule, Cep, CepRoutingModule]
})
export class CepModule {}
