import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Breadcrumb } from "@app/shared/components/breadcrumb/breadcrumb";
import { Header } from "@app/shared/components/header/header";

@Component({
	selector: "app-layout",
	imports: [RouterOutlet, Header, Breadcrumb],
	templateUrl: "./layout.html",
	styleUrl: "./layout.scss",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class Layout {}
