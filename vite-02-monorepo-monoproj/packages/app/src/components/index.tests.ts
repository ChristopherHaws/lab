import { mockCalculator } from './index.mocks';

describe('index', () => {
	const calculator = mockCalculator();

	it('should work', () => {
		expect(calculator.add(1, 6)).toBe(7);
	});
});
