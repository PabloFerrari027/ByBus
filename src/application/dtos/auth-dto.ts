export type AuthMethod = 'CREDENTIALS' | 'GOOGLE';

export type CredentialAuthDTO = {
	method: AuthMethod;
	name: string;
	email: string;
	password: string;
};

export type GoogleAuthDTO = {
	method: AuthMethod;
	email: string;
	authToken: string;
};

export type AuthDTO = CredentialAuthDTO | GoogleAuthDTO;
