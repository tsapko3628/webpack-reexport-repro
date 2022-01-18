import { isArray } from 'lodash';

export function checkIsArray(array: unknown[]): boolean {
	return isArray(array);
}
