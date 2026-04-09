import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { HomeRoutingModule } from "./home.routes";
import { Home } from "./pages/home/home";

@NgModule({
	imports: [CommonModule, Home, HomeRoutingModule]
})
export class HomeModule {}
