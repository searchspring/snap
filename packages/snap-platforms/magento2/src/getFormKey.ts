import { cookies } from '@searchspring/snap-toolbox';

export const getFormKey = () => {
	const formKey = cookies.get('form_key') ? cookies.get('form_key') : '';
	return formKey;
};
