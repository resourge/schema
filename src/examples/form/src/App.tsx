
import { setDefaultOnError } from '@resourge/react-form'

import { locationCitiesOptions, locationOptions, UserModel, useUserModel } from './interfaces/UserModel';

setDefaultOnError((errors: any) => {
	// Customize errors to fit the model 
	// [{ path, errors }]
	console.log('errors', errors)
	return []
});

function App() {
	const { form, field, formState, handleSubmit } = useUserModel()

	const onSubmit = handleSubmit((form: UserModel) => {
		console.log('onSubmit', form)
	})
	console.log('form', form)

	return (
		<div className="App">
			<h4>User Form</h4>
			<div>
				<div className='formControl'>
					<div className='formLabel'>Name:</div>
					<div>
						<input {...field('name', { onChange: (e) => e.target.value })}></input>
						{!formState.name.isValid ? <span className='formErrorMessage'>{formState.name.errors[0]}</span> : null}
					</div>
				</div>
				<div className='formControl'>
					<div className='formLabel'>Age:</div>
					<div>
						<input type={'number'}{...field('age', { onChange: (e) => Number(e.target.value) })}></input>
						{!formState.age.isValid ? <span className='formErrorMessage'>{formState.age.errors[0]}</span> : null}
					</div>
				</div>
				<div className='formControl'>
					<div className='formLabel'>Location:</div>
					<div>
						<span className='formLabelSelect'>City:</span>
						<select {...field('location.city', { onChange: (e) => e.target.value })}>
							<option value={''} />
							{locationCitiesOptions.map((option) => <option key={option.value} value={option.value} selected={option.value === field('location.city').value}>{option.label}</option>)}
						</select> 
						{!formState.location.city.isValid ? <span className='formErrorMessage'>{formState.location.city.errors[0]}</span> : null}
						<br/>
						<span className='formLabelSelect'>Address:</span>
						<input {...field('location.address', { onChange: (e) => e.target.value })} />
						{!formState.location.address.isValid ? <span className='formErrorMessage'>{formState.location.postalCode.errors[0]}</span> : null}
						<br/>
						<span className='formLabelSelect'>PostalCode:</span>
						<input {...field('location.postalCode', { onChange: (e) => e.target.value })} />
						{!formState.location.postalCode.isValid ? <span className='formErrorMessage'>{formState.location.postalCode.errors[0]}</span> : null}
					</div>
				</div>
			</div>
			<div className='formLabel'>Form State:</div>
			<div className='formState'>
				{JSON.stringify(form, null, '\t')}
			</div>
			<div className='formSubmit'>
				<button className='formSubmitBtn' type='button' onClick={onSubmit}>Submit</button>
			</div>
		</div>
	)
}

export default App
