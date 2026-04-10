import { ViaCepResponse } from "../interfaces/cep";
import { CepEntry } from "../services/cep-storage.service";


export const mockDetalhes: ViaCepResponse = {
	cep: "01001-000",
	logradouro: "Praça da Sé",
	complemento: "lado ímpar",
	unidade: "",
	bairro: "Sé",
	localidade: "São Paulo",
	uf: "SP",
	estado: "São Paulo",
	regiao: "Sudeste",
	ibge: "3550308",
	gia: "1004",
	ddd: "11",
	siafi: "7107"
};


export const mockEntries: CepEntry[] = [
	{
		id: 1,
		cep: "01001-000",
		endereco: "Praça da Sé, Sé, São Paulo, SP",
		data: "01/01/2025",
		detalhes: mockDetalhes
	},
	{
		id: 2,
		cep: "20040-020",
		endereco: "Av. Rio Branco, Centro, Rio de Janeiro, RJ",
		data: "02/01/2025",
		detalhes: { ...mockDetalhes, cep: "20040-020", localidade: "Rio de Janeiro", uf: "RJ" }
	}
];