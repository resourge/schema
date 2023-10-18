import { type SchemaError } from 'src/lib/types/types';

import { array } from '../ArraySchema';
import { boolean } from '../BooleanSchema';
import { number } from '../NumberSchema';
import { object } from '../ObjectSchema';
import { string } from '../StringSchema';

const isFilePathValid = (path: string) => {
	return /^((\/)?[\w-])+$/i.test(path);
};

const validateIfPathIsValidResourge = {
	message: 'utils.validation.file_path_is_not_valid',
	test: (value: string) => !(value && !isFilePathValid(value))
};

const validateValueCantHaveSpecialCharactersButCanHaveSlashAndMinusResourge = {
	message: 'utils.validation.the_field_cant_have_special_characters',
	test: (value: string) => !/[^\w\\/-]+/g.test(value)
};

describe('Nested Schemas', () => {
	it('deep nested', () => {
		const schemaFinalTableResourge = object({
			name: string()
			.required(),
			sqlFrom: string()
			.notRequired(),
			file: object({
				path: object({
					folderPath: string()
					.notRequired()
					.test(validateIfPathIsValidResourge)
					.test(validateValueCantHaveSpecialCharactersButCanHaveSlashAndMinusResourge)
					.when('fileName', {
						is: (value) => value,
						then: (schema) => schema.required('file_path.messages.folder_path_is_required')
					}),
					fileName: string()
					.notRequired()
					.test(validateIfPathIsValidResourge)
					.test(validateValueCantHaveSpecialCharactersButCanHaveSlashAndMinusResourge)
					.when('folderPath', {
						is: (value) => value,
						then: (schema) => schema.required('file_path.messages.file_name_is_required')
					})
				}),
				type: object({
					fileType: object({
						label: string(),
						value: string()
					})
					.notRequired(),
					contentType: object({
						label: string(),
						value: string()
					})
					.notRequired()
					.when('isContentTypeDisabled', {
						is: (isContentTypeDisabled: boolean) => isContentTypeDisabled,
						then: (schema) => schema.required()
					}),
					otherSeparator: string()
					.notRequired()
					.when('isSeparatorOtherDisabled', {
						is: (isSeparatorOtherDisabled: boolean) => isSeparatorOtherDisabled,
						then: (schema) => schema.required()
					}),
					textQualifier: object({
						label: string(),
						value: string()
					})
					.notRequired()
					.when('isTextQualifierDisabled', {
						is: (isTextQualifierDisabled: boolean) => isTextQualifierDisabled,
						then: (schema) => schema.required()
					})
				})
				.extend<any>({
					separator: object({
						label: string(),
						value: string()
					})
					.notRequired()
					.when('isSeparatorDisabled', {
						is: (isSeparatorDisabled) => isSeparatorDisabled,
						then: (schema) => schema.required()
					})
				}) 
				.extend({
					fileType: object({
						label: string(),
						value: string()
					})
					.notRequired()
					.test({
						message: 'file_type_is_required',
						test: (value, form) => Boolean(!form.path.example || value)
					})
				})
			}),
			sources: array(
				object({
					sourceId: number()
					.notRequired(),
					name: string()
					.required(),
					sourceType: number()
					.required(),
					selected: boolean()
					.notRequired(),
					fields: array(
						object({
							finalTableFieldId: number()
							.notRequired(),
							finalTableId: number()
							.notRequired(),
							finalField: string()
							.required(),
							description: string()
							.required(),
							initialField: string()
							.required(),
							dataType: string()
							.notRequired(),
							precision: number()
							.notRequired(),
							scale: number()
							.notRequired(),
							length: string()
							.notRequired(),
							active: boolean()
							.notRequired(),
							index: number(),
							fieldType: string(),
							_isAlreadyTransformed: boolean(),
							fieldIdentifier: boolean()
						})
					)
					.min(1)
				})
			)
			.min(1)
			.test((value: any[], finalField) => {
				const errors: SchemaError[] = [];

				if ( value && value.length > 1 ) {
					const [firstSource, ...sources] = value;
					const fieldsIndex: number[] = [];

					firstSource.fields?.forEach((field: any, fieldIndex: number) => {
						sources.forEach((source) => {
							const sourceField = source.fields ? source.fields[fieldIndex] : undefined;
							if ( sourceField && sourceField.dataType !== field.dataType ) {
								fieldsIndex.push(fieldIndex);
							}
						});
					});

					fieldsIndex.forEach((fieldIndex) => {
						value.forEach((_, sourceIndex) => {
							errors.push({
								error: 'final_table_page.messages.different_data_type',
								path: `finalTables[${finalField.index as number}].sources[${sourceIndex}].fields[${fieldIndex}].dataType`
							});
						});
					});
				}

				if ( errors.length ) {
					return errors;
				}

				return true;
			})
		});

		const schema = object({
			finalTables: array(
				schemaFinalTableResourge
			)
			.min(1)
		})
		.compile();

		expect(
			schema.isValid({
				finalTables: [
					{
						index: 0,
						finalTableId: 18314,
						name: 'fact_',
						sqlFrom: '',
						displayedTable: {
							label: 'btn.yes',
							value: true
						},
						active: true,
						sources: [
							{
								sourceId: 51320,
								name: 'Acc_area1_area2',
								// @ts-expect-error // Private value
								sourceIndex: 0,
								sourceType: 1,
								isReadonly: false,
								fields: [
									{
										active: true,
										index: 0,
										finalTableFieldId: 162242,
										finalTableId: 18314,
										finalField: 'Column_A',
										description: 'Column A',
										initialField: 'Column_A',
										dataType: 'Text',
										length: '1',
										fieldType: 'SOURCE_FIELD',
										_isAlreadyTransformed: false,
										fieldIdentifier: false,
										precision: 0,
										scale: 0
									}
								]
							}
						],
						file: {
							path: {
								folderPath: '',
								fileName: ''
							},
							type: {
								// @ts-expect-error // Private value
								contentTypes: [
									{
										label: 'Delimited',
										value: 'Delimited'
									},
									{
										label: 'Fix',
										value: 'Fixed'
									}
								],
								separatorsOptions: [
									{
										label: 'Tab',
										value: 'Tab'
									},
									{
										label: 'Semicolon',
										value: 'Semicolon'
									},
									{
										label: 'Comma',
										value: 'Comma'
									},
									{
										label: 'Space',
										value: 'Space'
									},
									{
										label: 'Other',
										value: 'Other'
									}
								],
								textQualifiers: [
									{
										label: '"',
										value: '"'
									},
									{
										label: "'",
										value: "'"
									},
									{
										label: 'None',
										value: 'None'
									}
								],
								fileTypes: [
									{
										label: 'xlsx',
										value: 'xlsx'
									},
									{
										label: 'csv',
										value: 'csv'
									},
									{
										label: 'txt',
										value: 'txt'
									}
								],
								_separators: [],
								otherSeparator: ''
							}
						}
					}
				],
				sourceOptions: [
					{
						sourceId: 51320,
						name: 'ALL_Acc_area1_area2',
						sourceIndex: 0,
						sourceType: 1,
						isReadonly: false,
						fields: [
							{
								active: false,
								index: 0,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Column A',
								initialField: 'Column_A',
								dataType: 'Text',
								length: '1',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 1,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Column B',
								initialField: 'Column_B',
								dataType: 'Text',
								length: '2',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 2,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Column C',
								initialField: 'Column_C',
								dataType: 'Text',
								length: '3',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 3,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Column D',
								initialField: 'Column_D',
								dataType: 'Text',
								length: '10',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 4,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Column E',
								initialField: 'Column_E',
								dataType: 'Text',
								length: '5',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 5,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Column F',
								initialField: 'Column_F',
								dataType: 'Text',
								length: '7',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							}
						]
					},
					{
						sourceId: 51321,
						name: 'ALL_Acc_area1_area1',
						sourceIndex: 1,
						sourceType: 1,
						isReadonly: true,
						fields: [
							{
								active: false,
								index: 0,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Column A',
								initialField: 'Column_A',
								dataType: '',
								length: '1',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 1,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Column B',
								initialField: 'Column_B',
								dataType: '',
								length: '2',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 2,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Column C',
								initialField: 'Column_C',
								dataType: '',
								length: '3',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 3,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Column D',
								initialField: 'Column_D',
								dataType: '',
								length: '10',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 4,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Column E',
								initialField: 'Column_E',
								dataType: '',
								length: '5',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 5,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Column F',
								initialField: 'Column_F',
								dataType: '',
								length: '7',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							}
						]
					},
					{
						sourceId: 51326,
						name: 'Checko_Fix_Fix',
						sourceIndex: 2,
						sourceType: 1,
						isReadonly: true,
						fields: [
							{
								active: false,
								index: 0,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Hours',
								initialField: 'Hours',
								dataType: 'Date',
								length: '5',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 1,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'P',
								initialField: 'P',
								dataType: 'Text',
								length: '2',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 2,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'ric',
								initialField: 'ric',
								dataType: 'Date',
								length: '3',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 3,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'e\tTotal\tLa',
								initialField: 'e_Total_La',
								dataType: 'Text',
								length: '10',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							}
						]
					},
					{
						sourceId: 51327,
						name: 'dheck_Fix_Fix',
						sourceIndex: 3,
						sourceType: 1,
						isReadonly: true,
						fields: [
							{
								active: false,
								index: 0,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Hours',
								initialField: 'Hours',
								dataType: 'Date',
								length: '5',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 1,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'P',
								initialField: 'P',
								dataType: 'Text',
								length: '2',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 2,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'ric',
								initialField: 'ric',
								dataType: 'Date',
								length: '3',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 3,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'e\tTotal\tLa',
								initialField: 'e_Total_La',
								dataType: 'Text',
								length: '10',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							}
						]
					},
					{
						sourceId: 51361,
						name: 'dheck_Fix_Fix',
						sourceIndex: 4,
						sourceType: 1,
						isReadonly: true,
						fields: [
							{
								active: false,
								index: 0,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Hours',
								initialField: 'Hours',
								dataType: 'Date',
								length: '5',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 1,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'P',
								initialField: 'P',
								dataType: 'Text',
								length: '2',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 2,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'ric',
								initialField: 'ric',
								dataType: 'Date',
								length: '3',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 3,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'e\tTotal\tLa',
								initialField: 'e_Total_La',
								dataType: 'Text',
								length: '10',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							}
						]
					},
					{
						sourceId: 51486,
						name: 'dheck_Fix_Fix',
						sourceIndex: 5,
						sourceType: 1,
						isReadonly: true,
						fields: [
							{
								active: false,
								index: 0,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Hours',
								initialField: 'Hours',
								dataType: 'Date',
								length: '5',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 1,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'P',
								initialField: 'P',
								dataType: 'Text',
								length: '2',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 2,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'ric',
								initialField: 'ric',
								dataType: 'Date',
								length: '3',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 3,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'e\tTotal\tLa',
								initialField: 'e_Total_La',
								dataType: 'Text',
								length: '10',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							}
						]
					},
					{
						sourceId: 51487,
						name: 'dheck_Fix_Fix',
						sourceIndex: 6,
						sourceType: 1,
						isReadonly: true,
						fields: [
							{
								active: false,
								index: 0,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Hours',
								initialField: 'Hours',
								dataType: 'Date',
								length: '5',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 1,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'P',
								initialField: 'P',
								dataType: 'Text',
								length: '2',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 2,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'ric',
								initialField: 'ric',
								dataType: 'Date',
								length: '3',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 3,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'e\tTotal\tLa',
								initialField: 'e_Total_La',
								dataType: 'Text',
								length: '10',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							}
						]
					},
					{
						sourceId: 52974,
						name: 'dheck_Fix_Fix',
						sourceIndex: 7,
						sourceType: 1,
						isReadonly: true,
						fields: [
							{
								active: false,
								index: 0,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Hours',
								initialField: 'Hours',
								dataType: 'Text',
								length: '',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 1,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Price',
								initialField: 'Price',
								dataType: 'Text',
								length: '',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 2,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Total',
								initialField: 'Total',
								dataType: 'Text',
								length: '',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 3,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Label',
								initialField: 'Label',
								dataType: 'Text',
								length: '',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							}
						]
					},
					{
						sourceId: 53037,
						name: '2-3',
						sourceIndex: 8,
						sourceType: 1,
						isReadonly: true,
						fields: []
					},
					{
						sourceId: 53055,
						name: 'dheck_Fix_Fix',
						sourceIndex: 9,
						sourceType: 1,
						isReadonly: true,
						fields: [
							{
								active: false,
								index: 0,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Column A',
								initialField: 'Column_A',
								dataType: 'Date',
								length: '2d',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 1,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Column B',
								initialField: 'Column_B',
								dataType: 'Datetime',
								length: 'dd',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 2,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Column C',
								initialField: 'Column_C',
								dataType: 'Text',
								length: 'ddd',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							}
						]
					},
					{
						sourceId: 53061,
						name: 'Test_Marks_Hours',
						sourceIndex: 10,
						sourceType: 1,
						isReadonly: true,
						fields: [
							{
								active: false,
								index: 0,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Hours',
								initialField: 'Hours',
								dataType: 'Text',
								length: '10',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 1,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Price',
								initialField: 'Price',
								dataType: 'Text',
								length: '20',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 2,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Total',
								initialField: 'Total',
								dataType: 'Text',
								length: '',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 3,
								finalTableFieldId: 0,
								finalTableId: 0,
								description: 'Label',
								initialField: 'Label',
								dataType: 'DateYYYYMMDD',
								length: '',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							}
						]
					},
					{
						sourceId: 53075,
						name: 'Table1-Area1',
						sourceIndex: 11,
						sourceType: 1,
						isReadonly: true,
						fields: []
					},
					{
						sourceId: 18314,
						name: 'fact_',
						sourceIndex: 12,
						sourceType: 2,
						isReadonly: true,
						fields: [
							{
								active: false,
								index: 0,
								finalTableFieldId: 0,
								finalTableId: 0,
								finalField: 'Column_A',
								description: 'Column A',
								initialField: 'Column_A',
								dataType: 'Text',
								length: '1',
								fieldType: 'SOURCE_FIELD',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 1,
								finalTableFieldId: 0,
								finalTableId: 0,
								finalField: 'Column_B',
								description: 'Column B',
								initialField: 'Column_B',
								dataType: 'Text',
								length: '2',
								fieldType: 'SOURCE_FIELD',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 2,
								finalTableFieldId: 0,
								finalTableId: 0,
								finalField: 'Column_C',
								description: 'Column C',
								initialField: 'Column_C',
								dataType: 'Text',
								length: '3',
								fieldType: 'SOURCE_FIELD',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 3,
								finalTableFieldId: 0,
								finalTableId: 0,
								finalField: 'Column_D',
								description: 'Column D',
								initialField: 'Column_D',
								dataType: 'Text',
								length: '10',
								fieldType: 'SOURCE_FIELD',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 4,
								finalTableFieldId: 0,
								finalTableId: 0,
								finalField: 'Column_E',
								description: 'Column E',
								initialField: 'Column_E',
								dataType: 'Text',
								length: '5',
								fieldType: 'SOURCE_FIELD',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							},
							{
								active: false,
								index: 5,
								finalTableFieldId: 0,
								finalTableId: 0,
								finalField: 'Column_F',
								description: 'Column F',
								initialField: 'Column_F',
								dataType: 'Text',
								length: '7',
								fieldType: 'SOURCE_FIELD',
								_isAlreadyTransformed: false,
								fieldIdentifier: false
							}
						]
					}
				],
				dataTypesOptions: [
					{
						label: 'Date',
						value: 'Date'
					},
					{
						label: 'Datetime',
						value: 'Datetime'
					},
					{
						label: 'Dateyyyy/mm/dd',
						value: 'Dateyyyy/mm/dd'
					},
					{
						label: 'DateYYYYMMDD',
						value: 'DateYYYYMMDD'
					},
					{
						label: 'Decimal',
						value: 'Decimal'
					},
					{
						label: 'Float',
						value: 'Float'
					},
					{
						label: 'Int',
						value: 'Int'
					},
					{
						label: 'Text',
						value: 'Text'
					}
				],
				selectedFinalTable: {
					index: 0,
					finalTableId: 18314,
					name: 'fact_',
					sqlFrom: '',
					displayedTable: {
						label: 'btn.yes',
						value: true
					},
					active: true,
					sources: [
						{
							sourceId: 51320,
							name: 'dwh_ALL_Acc_area1_area2',
							sourceIndex: 0,
							sourceType: 1,
							isReadonly: false,
							fields: [
								{
									active: true,
									index: 0,
									finalTableFieldId: 162242,
									finalTableId: 18314,
									finalField: 'Column_A',
									description: 'Column A',
									initialField: 'Column_A',
									dataType: 'Text',
									length: '1',
									fieldType: 'SOURCE_FIELD',
									_isAlreadyTransformed: false,
									fieldIdentifier: false
								},
								{
									active: true,
									index: 1,
									finalTableFieldId: 162243,
									finalTableId: 18314,
									finalField: 'Column_B',
									description: 'Column B',
									initialField: 'Column_B',
									dataType: 'Text',
									length: '2',
									fieldType: 'SOURCE_FIELD',
									_isAlreadyTransformed: false,
									fieldIdentifier: false
								},
								{
									active: true,
									index: 2,
									finalTableFieldId: 162244,
									finalTableId: 18314,
									finalField: 'Column_C',
									description: 'Column C',
									initialField: 'Column_C',
									dataType: 'Text',
									length: '3',
									fieldType: 'SOURCE_FIELD',
									_isAlreadyTransformed: false,
									fieldIdentifier: false
								},
								{
									active: true,
									index: 3,
									finalTableFieldId: 162245,
									finalTableId: 18314,
									finalField: 'Column_D',
									description: 'Column D',
									initialField: 'Column_D',
									dataType: 'Text',
									length: '10',
									fieldType: 'SOURCE_FIELD',
									_isAlreadyTransformed: false,
									fieldIdentifier: false
								},
								{
									active: true,
									index: 4,
									finalTableFieldId: 162246,
									finalTableId: 18314,
									finalField: 'Column_E',
									description: 'Column E',
									initialField: 'Column_E',
									dataType: 'Text',
									length: '5',
									fieldType: 'SOURCE_FIELD',
									_isAlreadyTransformed: false,
									fieldIdentifier: false
								},
								{
									active: true,
									index: 5,
									finalTableFieldId: 162247,
									finalTableId: 18314,
									finalField: 'Column_F',
									description: 'Column F',
									initialField: 'Column_F',
									dataType: 'Text',
									length: '7',
									fieldType: 'SOURCE_FIELD',
									_isAlreadyTransformed: false,
									fieldIdentifier: false
								}
							]
						}
					],
					file: {
						path: {
							folderPath: '',
							fileName: ''
						},
						type: {
							contentTypes: [
								{
									label: 'Delimited',
									value: 'Delimited'
								},
								{
									label: 'Fix',
									value: 'Fixed'
								}
							],
							separatorsOptions: [
								{
									label: 'Tab',
									value: 'Tab'
								},
								{
									label: 'Semicolon',
									value: 'Semicolon'
								},
								{
									label: 'Comma',
									value: 'Comma'
								},
								{
									label: 'Space',
									value: 'Space'
								},
								{
									label: 'Other',
									value: 'Other'
								}
							],
							textQualifiers: [
								{
									label: '"',
									value: '"'
								},
								{
									label: "'",
									value: "'"
								},
								{
									label: 'None',
									value: 'None'
								}
							],
							fileTypes: [
								{
									label: 'xlsx',
									value: 'xlsx'
								},
								{
									label: 'csv',
									value: 'csv'
								},
								{
									label: 'txt',
									value: 'txt'
								}
							],
							_separators: [],
							otherSeparator: ''
						}
					}
				}
			})
		)
		.toBeTruthy();
	});
});
