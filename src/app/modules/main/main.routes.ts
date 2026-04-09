import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { Layout } from "./layout/layout";

const routes: Routes = [
	{
		path: "",
		component: Layout,
		children: [
			{
				path: "",
				redirectTo: "home",
				pathMatch: "full"
			},
			{
				path: "home",
				loadChildren: () =>
					import("../home/home.module").then((m) => m.HomeModule)
			},
			{
				path: "cep",
				loadChildren: () =>
					import("../cep/cep.module").then((m) => m.CepModule)
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MainRoutingModule {}
