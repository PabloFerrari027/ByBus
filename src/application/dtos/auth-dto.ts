export type AuthMethod = 'CREDENTIALS' | 'GOOGLE';

export type CredentialAuthDTO = {
	method: AuthMethod;
	name: string;
	email: string;
	password: string;
};

export type GoogleAuthDTO = {
	name: string;
	email: string;
	method: AuthMethod;
	authToken: string;
};

export type AuthDTO = CredentialAuthDTO | GoogleAuthDTO;
