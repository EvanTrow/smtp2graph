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
	cc?: AddressValue;
	bcc?: AddressValue;
	from: AddressValue;
	messageID: string;
	attachments?: Array<any>;
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
	cc?: string[];
	bcc?: string[];
	subject: string;
	body: string;
	text: string;
	attachments?: Array<any>;
}
