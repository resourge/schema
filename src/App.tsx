import { array, object, string } from './lib';

type Test = {
	test23: string
	fn: () => {}
	object12: {
		testObject1: string
		products?: {
			testObject: string
		}
	}
	object1: Array<{
		testObject123: string
		object123: Array<{
			testObject12: string
		}>
	}>
}

const schema = object<Test>({
	test23: string().min(3).required(),
	object12: object({
		testObject1: string().min(3).required(),
		products: object({
			testObject: string().min(3).required()
		})
	}).required(),
	object1: array(
		object({
			testObject123: string().min(3).required()
			.test<Test>((a, b) => {
				return [
					{
						key: 'an',
						error: 'masdas'
					}
				]
			}),
			object123: array(
				object({
					testObject12: string().min(3).required()
				})
				.required()
				.test<Test>((a, form) => {
					return [
						{
							key: 'an',
							error: 'masdas'
						}
					]
				})
				.test((a, b) => {
					return [
						{
							key: 'an',
							error: 'masdas'
						}
					]
				})
			).required()
		}).required()
	)
}).compile();

function App() {
	return (
		<div className="App">
			App
		</div>
	)
}

export default App
