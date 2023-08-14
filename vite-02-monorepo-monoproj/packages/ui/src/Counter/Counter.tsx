import { useState } from 'react';
import { addOne } from '.'; // Testing a circular import (index.ts exports the current file)

export function Counter() {
	const [count, setCount] = useState(0);
	return <button onClick={() => setCount(addOne)}>count is {count}!</button>;
}
