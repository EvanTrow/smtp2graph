export interface Email {
	id: number;
	date: string;
	from: string;
	fromName: string;
	to: string[];
	subject: string;
	body: string;
	text: string;
}
