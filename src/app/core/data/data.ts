export interface BreadcrumbItem {
	label: string;
	url?: string;
}

export interface NavChildItem {
	label: string;
	url: string;
}

export interface NavMenuItem {
	label: string;
	url?: string;
	activePrefix?: string;
	children?: NavChildItem[];
}

export const ROUTE_BREADCRUMBS: Record<string, BreadcrumbItem[]> = {
	"/home": [{ label: "Home" }],
	"/cep": [
		{ label: "Home", url: "/home" },
		{ label: "Endereços" },
		{ label: "Buscar Endereços" }
	]
};

export const MENU_ITEMS: NavMenuItem[] = [
	{ label: "Home", url: "/home" },
	{
		label: "Endereços",
		activePrefix: "/cep",
		children: [{ label: "Buscar Endereços", url: "/cep" }]
	}
];
