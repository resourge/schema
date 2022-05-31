
import { setDefaultOnError } from '@resourge/react-form'

setDefaultOnError((errors: any) => {
	// Customize errors to fit the model 
	// [{ path, errors }]
	console.log('errors', errors)
	return []
});

function App() {
	return (
		<div className="App">
			<div>TESTE</div>
		</div>
	)
}

export default App
