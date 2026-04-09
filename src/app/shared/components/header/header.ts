import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";

import { MENU_ITEMS, NavMenuItem } from "@app/core/data/data";

@Component({
	selector: "app-header",
	imports: [
		RouterLink,
		RouterLinkActive,
		MatMenuModule,
		MatButtonModule,
		MatToolbarModule
	],
	templateUrl: "./header.html",
	styleUrl: "./header.scss"
})
export class Header {
	private router = inject(Router);

	readonly menuItems = MENU_ITEMS;

	isMenuItemActive(item: NavMenuItem): boolean {
		return item.activePrefix
			? this.router.url.startsWith(item.activePrefix)
			: false;
	}
}
