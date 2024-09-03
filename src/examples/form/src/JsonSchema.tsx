import { JsonSchema } from "../../../lib";

const schema = JsonSchema({
	type: 'object',
	properties: {
		productId: {
			type: 'string',
			validation: {
				required: 'Custom required'
			}
		},
		productName: {
			type: 'string',
			validation: {
				min: {
					minValue: 5,
					message: 'Requires more than 5 characters'
				}
			}
		},
		category: {
			type: 'object',
			properties: {
				categoryId: {
					type: 'string',
					validation: {
						required: 'Custom required'
					}
				},
				categoryName: {
					type: 'string',
					validation: {
						min: {
							minValue: 5,
							message: 'Requires more than 5 characters'
						}
					}
				}
			}
		}
	}
});

console.log('schema', schema);
console.log(
	'errors 4', 
	schema.validate({
		productId: '',
		productName: '',
		category: {
			categoryId: '',
			categoryName: ''
		}
	})
);
console.log(
	'errors 3', 
	schema.validate({
		productId: 'Test',
		productName: '',
		category: {
			categoryId: '',
			categoryName: ''
		}
	})
);
console.log(
	'errors 2', 
	schema.validate({
		productId: 'Test',
		productName: '12345',
		category: {
			categoryId: '',
			categoryName: ''
		}
	})
);
console.log(
	'errors 0', 
	schema.validate({
		productId: 'Test',
		productName: '12345',
		category: {
			categoryId: 'Test',
			categoryName: '12345'
		}
	})
);

function App() {
	return (
		<div className="App">
			App
		</div>
	);
}

export default App;
