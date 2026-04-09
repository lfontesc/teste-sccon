import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { MainRoutingModule } from "./main.routes";

@NgModule({
	imports: [CommonModule, MainRoutingModule]
})
export class MainModule {}
