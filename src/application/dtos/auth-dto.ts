import { User } from '@/domain/entities/user.js';

export type AuthMethod = 'CREDENTIALS' | 'GOOGLE';

export type CredentialAuthDTO = {
	credentials: {
		method: AuthMethod;
		name: string;
		email: string;
		password: string;
	};
	user: User;
};

export type GoogleAuthDTO = {
	credentials: {
		method: AuthMethod;
		email: string;
		authToken: string;
	};
	user: User;
};

export type AuthDTO = CredentialAuthDTO | GoogleAuthDTO;
