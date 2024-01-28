import { someUtilityFunction } from '@acme/ui/utils';
import './App.css';

import { Foo } from '@acme/app/components';
import { Counter, Counter2 } from '@acme/ui';

function App() {
	return (
		<>
			<Counter />
			<Counter2 />
			<Foo />
			<p className="read-the-docs">{someUtilityFunction()}</p>
		</>
	);
}

export default App;
