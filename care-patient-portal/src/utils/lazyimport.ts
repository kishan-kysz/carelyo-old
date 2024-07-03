import { ComponentType, lazy } from 'react';

/**
 * @template T
 * @template I
 * @template K
 * @param {() => Promise<I>} factory
 * @param {K} name
 * @url Named imports for React.lazy: https://github.com/facebook/react/issues/14603#issuecomment-726551598
 * @usage  const { Home } = lazyImport(() => import("./Home"), "Home");
 * @returns {I}
 */
export function lazyImport<
	T extends ComponentType<unknown>,
	I extends { [K2 in K]: T },
	K extends keyof I
>(factory: () => Promise<I>, name: K): I {
	return Object.create({
		[name]: lazy(() => factory().then((module) => ({ default: module[name] }))),
	});
}
