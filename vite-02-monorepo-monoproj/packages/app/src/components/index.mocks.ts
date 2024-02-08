import { vi } from 'vitest';
import type { Calculator } from './index.types';

export function mockCalculator(): Calculator {
	return {
		add: vi.fn(() => 7),
		sub: vi.fn(() => 7),
	};
}
