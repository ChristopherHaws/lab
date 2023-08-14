import { someUtilityFunction } from '@acme/ui/utils';
import './App.css';

import { Counter, Counter2 } from '@acme/ui';

function App() {
	return (
		<>
			<Counter />
			<Counter2 />
			<p className="read-the-docs">{someUtilityFunction()}</p>
		</>
	);
}

export default App;
