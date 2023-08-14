import { addOne } from '@acme/ui/utils'; // Testing using alias paths
import { useState } from 'react';

export function Counter2() {
	const [count, setCount] = useState(0);
	return <button onClick={() => setCount(addOne)}>count is {count}!</button>;
}
