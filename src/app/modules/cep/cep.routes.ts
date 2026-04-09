import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { Cep } from "./pages/cep/cep";

const routes: Routes = [
	{
		path: "",
		component: Cep
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CepRoutingModule {}
