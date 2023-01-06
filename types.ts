// export interface EmailRequest {
// 	id: number;
// 	date: string;
// 	from: string | undefined;
// 	fromName: string | undefined;
// 	to: AddressObject[] | undefined;
// 	subject: string | undefined;
// 	body: string | undefined;
// }

export interface EmailRequest {
	html: string;
	text: string;
	subject: string;
	date: Date;
	to: AddressValue;
	from: AddressValue;
	messageID: string;
}

interface AddressValue {
	value: AddressObject[];
	html: string;
	text: string;
}
interface AddressObject {
	address: string;
	name: string;
}

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
