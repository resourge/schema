import { SchemaError } from '../../core/schema';
import { date, DateSchema } from '../DateSchema'

describe('date', () => {
	it('should be today', () => {
		const schema = date((schema) => schema.today()).compile();

		expect(schema.isValid(new Date('2001-01-01'))).toBeFalsy()
		expect(schema.isValid(new Date())).toBeTruthy()
		expect(schema.isValid(new Date('test'))).toBeFalsy()

		const _date = new Date();

		_date.setHours(10);

		expect(schema.isValid(_date)).toBeTruthy()

		const newMessage = 'New Message'
		const schemaMessage = new DateSchema().today(newMessage);

		const errors: SchemaError[] = [{
			key: '',
			error: newMessage
		}]

		expect(
			schemaMessage.validate(new Date('2001-01-01'))
		)
		.toEqual(errors)
	})
})
