import { describe, expect, it } from 'vitest';

import { type SchemaError } from '../../types/types';
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
			file: object({
				path: object({
					fileName: string()
					.notRequired()
					.test(validateIfPathIsValidResourge)
					.test(validateValueCantHaveSpecialCharactersButCanHaveSlashAndMinusResourge)
					.when('folderPath', {
						is: (value) => value,
						then: (schema) => schema.required('file_path.messages.file_name_is_required')
					}),
					folderPath: string()
					.notRequired()
					.test(validateIfPathIsValidResourge)
					.test(validateValueCantHaveSpecialCharactersButCanHaveSlashAndMinusResourge)
					.when('fileName', {
						is: (value) => value,
						then: (schema) => schema.required('file_path.messages.folder_path_is_required')
					})
				}),
				type: object({
					contentType: object({
						label: string(),
						value: string()
					})
					.notRequired()
					.when('isContentTypeDisabled', {
						is: (isContentTypeDisabled: boolean) => isContentTypeDisabled,
						then: (schema) => schema.required()
					}),
					fileType: object({
						label: string(),
						value: string()
					})
					.notRequired(),
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
			name: string()
			.required(),
			sources: array(
				object({
					fields: array(
						object({
							_isAlreadyTransformed: boolean(),
							active: boolean()
							.notRequired(),
							dataType: string()
							.notRequired(),
							description: string()
							.required(),
							fieldIdentifier: boolean(),
							fieldType: string(),
							finalField: string()
							.required(),
							finalTableFieldId: number()
							.notRequired(),
							finalTableId: number()
							.notRequired(),
							index: number(),
							initialField: string()
							.required(),
							length: string()
							.notRequired(),
							precision: number()
							.notRequired(),
							scale: number()
							.notRequired()
						})
					)
					.min(1),
					name: string()
					.required(),
					selected: boolean()
					.notRequired(),
					sourceId: number()
					.notRequired(),
					sourceType: number()
					.required()
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
							const sourceField = source.fields
								? source.fields[fieldIndex]
								: undefined;
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

				if ( errors.length > 0 ) {
					return errors;
				}

				return true;
			}),
			sqlFrom: string()
			.notRequired()
		});

		const schema = object({
			finalTables: array(
				schemaFinalTableResourge
			)
			.min(1)
		})
		.compile();

		const errors = schema.validate({
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
			finalTables: [
				{
					active: true,
					displayedTable: {
						label: 'btn.yes',
						value: true
					},
					file: {
						path: {
							fileName: '',
							folderPath: ''
						},
						type: {
							// @ts-expect-error // Private value
							_separators: [],
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
							otherSeparator: '',
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
									label: '\'',
									value: '\''
								},
								{
									label: 'None',
									value: 'None'
								}
							]
						}
					},
					finalTableId: 18_314,
					index: 0,
					name: 'fact_',
					sources: [
						{
							fields: [
								{
									_isAlreadyTransformed: false,
									active: true,
									dataType: 'Text',
									description: 'Column A',
									fieldIdentifier: false,
									fieldType: 'SOURCE_FIELD',
									finalField: 'Column_A',
									finalTableFieldId: 162_242,
									finalTableId: 18_314,
									index: 0,
									initialField: 'Column_A',
									length: '1',
									precision: 0,
									scale: 0
								}
							],
							// @ts-expect-error // Private value
							isReadonly: false,
							name: 'Acc_area1_area2',
							sourceId: 51_320,
							sourceIndex: 0,
							sourceType: 1
						}
					],
					sqlFrom: ''
				}
			],
			selectedFinalTable: {
				active: true,
				displayedTable: {
					label: 'btn.yes',
					value: true
				},
				file: {
					path: {
						fileName: '',
						folderPath: ''
					},
					type: {
						_separators: [],
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
						otherSeparator: '',
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
								label: '\'',
								value: '\''
							},
							{
								label: 'None',
								value: 'None'
							}
						]
					}
				},
				finalTableId: 18_314,
				index: 0,
				name: 'fact_',
				sources: [
					{
						fields: [
							{
								_isAlreadyTransformed: false,
								active: true,
								dataType: 'Text',
								description: 'Column A',
								fieldIdentifier: false,
								fieldType: 'SOURCE_FIELD',
								finalField: 'Column_A',
								finalTableFieldId: 162_242,
								finalTableId: 18_314,
								index: 0,
								initialField: 'Column_A',
								length: '1'
							},
							{
								_isAlreadyTransformed: false,
								active: true,
								dataType: 'Text',
								description: 'Column B',
								fieldIdentifier: false,
								fieldType: 'SOURCE_FIELD',
								finalField: 'Column_B',
								finalTableFieldId: 162_243,
								finalTableId: 18_314,
								index: 1,
								initialField: 'Column_B',
								length: '2'
							},
							{
								_isAlreadyTransformed: false,
								active: true,
								dataType: 'Text',
								description: 'Column C',
								fieldIdentifier: false,
								fieldType: 'SOURCE_FIELD',
								finalField: 'Column_C',
								finalTableFieldId: 162_244,
								finalTableId: 18_314,
								index: 2,
								initialField: 'Column_C',
								length: '3'
							},
							{
								_isAlreadyTransformed: false,
								active: true,
								dataType: 'Text',
								description: 'Column D',
								fieldIdentifier: false,
								fieldType: 'SOURCE_FIELD',
								finalField: 'Column_D',
								finalTableFieldId: 162_245,
								finalTableId: 18_314,
								index: 3,
								initialField: 'Column_D',
								length: '10'
							},
							{
								_isAlreadyTransformed: false,
								active: true,
								dataType: 'Text',
								description: 'Column E',
								fieldIdentifier: false,
								fieldType: 'SOURCE_FIELD',
								finalField: 'Column_E',
								finalTableFieldId: 162_246,
								finalTableId: 18_314,
								index: 4,
								initialField: 'Column_E',
								length: '5'
							},
							{
								_isAlreadyTransformed: false,
								active: true,
								dataType: 'Text',
								description: 'Column F',
								fieldIdentifier: false,
								fieldType: 'SOURCE_FIELD',
								finalField: 'Column_F',
								finalTableFieldId: 162_247,
								finalTableId: 18_314,
								index: 5,
								initialField: 'Column_F',
								length: '7'
							}
						],
						isReadonly: false,
						name: 'dwh_ALL_Acc_area1_area2',
						sourceId: 51_320,
						sourceIndex: 0,
						sourceType: 1
					}
				],
				sqlFrom: ''
			},
			sourceOptions: [
				{
					fields: [
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Column A',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 0,
							initialField: 'Column_A',
							length: '1'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Column B',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 1,
							initialField: 'Column_B',
							length: '2'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Column C',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 2,
							initialField: 'Column_C',
							length: '3'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Column D',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 3,
							initialField: 'Column_D',
							length: '10'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Column E',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 4,
							initialField: 'Column_E',
							length: '5'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Column F',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 5,
							initialField: 'Column_F',
							length: '7'
						}
					],
					isReadonly: false,
					name: 'ALL_Acc_area1_area2',
					sourceId: 51_320,
					sourceIndex: 0,
					sourceType: 1
				},
				{
					fields: [
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: '',
							description: 'Column A',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 0,
							initialField: 'Column_A',
							length: '1'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: '',
							description: 'Column B',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 1,
							initialField: 'Column_B',
							length: '2'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: '',
							description: 'Column C',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 2,
							initialField: 'Column_C',
							length: '3'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: '',
							description: 'Column D',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 3,
							initialField: 'Column_D',
							length: '10'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: '',
							description: 'Column E',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 4,
							initialField: 'Column_E',
							length: '5'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: '',
							description: 'Column F',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 5,
							initialField: 'Column_F',
							length: '7'
						}
					],
					isReadonly: true,
					name: 'ALL_Acc_area1_area1',
					sourceId: 51_321,
					sourceIndex: 1,
					sourceType: 1
				},
				{
					fields: [
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Date',
							description: 'Hours',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 0,
							initialField: 'Hours',
							length: '5'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'P',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 1,
							initialField: 'P',
							length: '2'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Date',
							description: 'ric',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 2,
							initialField: 'ric',
							length: '3'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'e\tTotal\tLa',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 3,
							initialField: 'e_Total_La',
							length: '10'
						}
					],
					isReadonly: true,
					name: 'Checko_Fix_Fix',
					sourceId: 51_326,
					sourceIndex: 2,
					sourceType: 1
				},
				{
					fields: [
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Date',
							description: 'Hours',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 0,
							initialField: 'Hours',
							length: '5'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'P',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 1,
							initialField: 'P',
							length: '2'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Date',
							description: 'ric',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 2,
							initialField: 'ric',
							length: '3'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'e\tTotal\tLa',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 3,
							initialField: 'e_Total_La',
							length: '10'
						}
					],
					isReadonly: true,
					name: 'dheck_Fix_Fix',
					sourceId: 51_327,
					sourceIndex: 3,
					sourceType: 1
				},
				{
					fields: [
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Date',
							description: 'Hours',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 0,
							initialField: 'Hours',
							length: '5'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'P',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 1,
							initialField: 'P',
							length: '2'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Date',
							description: 'ric',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 2,
							initialField: 'ric',
							length: '3'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'e\tTotal\tLa',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 3,
							initialField: 'e_Total_La',
							length: '10'
						}
					],
					isReadonly: true,
					name: 'dheck_Fix_Fix',
					sourceId: 51_361,
					sourceIndex: 4,
					sourceType: 1
				},
				{
					fields: [
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Date',
							description: 'Hours',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 0,
							initialField: 'Hours',
							length: '5'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'P',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 1,
							initialField: 'P',
							length: '2'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Date',
							description: 'ric',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 2,
							initialField: 'ric',
							length: '3'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'e\tTotal\tLa',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 3,
							initialField: 'e_Total_La',
							length: '10'
						}
					],
					isReadonly: true,
					name: 'dheck_Fix_Fix',
					sourceId: 51_486,
					sourceIndex: 5,
					sourceType: 1
				},
				{
					fields: [
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Date',
							description: 'Hours',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 0,
							initialField: 'Hours',
							length: '5'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'P',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 1,
							initialField: 'P',
							length: '2'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Date',
							description: 'ric',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 2,
							initialField: 'ric',
							length: '3'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'e\tTotal\tLa',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 3,
							initialField: 'e_Total_La',
							length: '10'
						}
					],
					isReadonly: true,
					name: 'dheck_Fix_Fix',
					sourceId: 51_487,
					sourceIndex: 6,
					sourceType: 1
				},
				{
					fields: [
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Hours',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 0,
							initialField: 'Hours',
							length: ''
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Price',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 1,
							initialField: 'Price',
							length: ''
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Total',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 2,
							initialField: 'Total',
							length: ''
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Label',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 3,
							initialField: 'Label',
							length: ''
						}
					],
					isReadonly: true,
					name: 'dheck_Fix_Fix',
					sourceId: 52_974,
					sourceIndex: 7,
					sourceType: 1
				},
				{
					fields: [],
					isReadonly: true,
					name: '2-3',
					sourceId: 53_037,
					sourceIndex: 8,
					sourceType: 1
				},
				{
					fields: [
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Date',
							description: 'Column A',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 0,
							initialField: 'Column_A',
							length: '2d'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Datetime',
							description: 'Column B',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 1,
							initialField: 'Column_B',
							length: 'dd'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Column C',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 2,
							initialField: 'Column_C',
							length: 'ddd'
						}
					],
					isReadonly: true,
					name: 'dheck_Fix_Fix',
					sourceId: 53_055,
					sourceIndex: 9,
					sourceType: 1
				},
				{
					fields: [
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Hours',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 0,
							initialField: 'Hours',
							length: '10'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Price',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 1,
							initialField: 'Price',
							length: '20'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Total',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 2,
							initialField: 'Total',
							length: ''
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'DateYYYYMMDD',
							description: 'Label',
							fieldIdentifier: false,
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 3,
							initialField: 'Label',
							length: ''
						}
					],
					isReadonly: true,
					name: 'Test_Marks_Hours',
					sourceId: 53_061,
					sourceIndex: 10,
					sourceType: 1
				},
				{
					fields: [],
					isReadonly: true,
					name: 'Table1-Area1',
					sourceId: 53_075,
					sourceIndex: 11,
					sourceType: 1
				},
				{
					fields: [
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Column A',
							fieldIdentifier: false,
							fieldType: 'SOURCE_FIELD',
							finalField: 'Column_A',
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 0,
							initialField: 'Column_A',
							length: '1'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Column B',
							fieldIdentifier: false,
							fieldType: 'SOURCE_FIELD',
							finalField: 'Column_B',
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 1,
							initialField: 'Column_B',
							length: '2'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Column C',
							fieldIdentifier: false,
							fieldType: 'SOURCE_FIELD',
							finalField: 'Column_C',
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 2,
							initialField: 'Column_C',
							length: '3'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Column D',
							fieldIdentifier: false,
							fieldType: 'SOURCE_FIELD',
							finalField: 'Column_D',
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 3,
							initialField: 'Column_D',
							length: '10'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Column E',
							fieldIdentifier: false,
							fieldType: 'SOURCE_FIELD',
							finalField: 'Column_E',
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 4,
							initialField: 'Column_E',
							length: '5'
						},
						{
							_isAlreadyTransformed: false,
							active: false,
							dataType: 'Text',
							description: 'Column F',
							fieldIdentifier: false,
							fieldType: 'SOURCE_FIELD',
							finalField: 'Column_F',
							finalTableFieldId: 0,
							finalTableId: 0,
							index: 5,
							initialField: 'Column_F',
							length: '7'
						}
					],
					isReadonly: true,
					name: 'fact_',
					sourceId: 18_314,
					sourceIndex: 12,
					sourceType: 2
				}
			]
		}) as SchemaError[];

		expect(
			errors.length === 0
		)
		.toBeTruthy();
	});
});
