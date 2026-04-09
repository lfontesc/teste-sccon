import { Component, OnInit, inject, signal } from "@angular/core";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { filter } from "rxjs/operators";

import { BreadcrumbItem, ROUTE_BREADCRUMBS } from "@app/core/data/data";

@Component({
	selector: "app-breadcrumb",
	imports: [RouterLink],
	templateUrl: "./breadcrumb.html",
	styleUrl: "./breadcrumb.scss"
})
export class Breadcrumb implements OnInit {
	private router = inject(Router);

	items = signal<BreadcrumbItem[]>([]);

	ngOnInit(): void {
		this.updateBreadcrumb(this.router.url);

		this.router.events
			.pipe(
				filter(
					(event): event is NavigationEnd =>
						event instanceof NavigationEnd
				)
			)
			.subscribe((event) => {
				this.updateBreadcrumb(event.urlAfterRedirects);
			});
	}

	private updateBreadcrumb(url: string): void {
		const path = url.split("?")[0];
		this.items.set(ROUTE_BREADCRUMBS[path] ?? []);
	}
}
