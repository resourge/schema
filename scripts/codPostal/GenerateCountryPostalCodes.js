const fs = require('fs');
const path = require('path');

const pluginutils = require('@rollup/pluginutils');

const getJson = (filePath) => JSON.parse(
	fs.readFileSync(path.resolve(__dirname, filePath), 'utf-8')
)

// Get Country list
const countries = getJson('./format/postal-codes-alpha2.json');

const getAllCountryRegex = () => {
	const files = fs.readdirSync(path.resolve(__dirname, './country'));

	return files
	.reduce((obj, key) => {
		obj[key] = getJson(`./country/${key}`)
		return obj
	}, {})
}

const countryRegexs = getAllCountryRegex();

const manuallyCountryFormat = {
	DK: 'DK####',
	LU: 'L####',
	GG: 'GY#####',
	IE: '### ####, #######, ###-####',
	IM: 'IM# ###, IM#####',
	JE: 'JE# ###, JE#####',
	GB: '#####, ######, #######, ### ###, ## ###, ######, #### ###'
}

const postalCodesExamples = {};

const postalCodes = Object.entries(countries)
.reduce((postalCodes, [key, { countryName, postalCodeFormat }]) => {
	if ( postalCodeFormat ) {
		const countryRegex = countryRegexs[postalCodeFormat];

		if ( countryRegex ) {
			let format = countryRegex.Description.split(' : ')[1] ?? countryRegex.Description.split(' - ')[1]
			
			if ( !format ) {
				// replace N for #
				format = manuallyCountryFormat[key]
			}

			if ( format ) {
				// replace N for #
				format = format.replace(/N/g, '#');
				// replace CC for country
				format = format.replace(/CC/g, key);
			}
			else {
				console.log("Country", countryName, "doesn't have format", key)
			}

			postalCodesExamples[key] = {
				valid: countryRegex.TestData.Valid[0],
				invalid: countryRegex.TestData.Invalid[0],
			}

			postalCodes[key] = {
				country: countryName,
				format: format,
				regex: new RegExp(countryRegex.ValidationRegex, 'i')
			}
		
		}
	}

	return postalCodes;
}, {})

console.log("postalCodesExamples", postalCodesExamples)

let code = pluginutils.dataToEsm(postalCodes, {
	preferConst: true,
	namedExports: true
})

// Add types to every country
code = code.replace(new RegExp(` = {
	country`, 'g'), `: PostalCodeInfo = {
	country`)

// Add type in the begin
code = `export type PostalCodeInfo = {
	country: string
	format: string
	regex: RegExp
};
` + code

// Replace export default with export const PostalCodes
code = code.replace(
	new RegExp(`export default {`, 'g'), 
	`export const PostalCodes = {`
)


// Create Type for PostalCodes
code = code.replace(
	new RegExp(`	ZM: ZM
}`, 'g'), 
	`	ZM: ZM
} as const;

export type PostalCode = typeof PostalCodes`
)

fs.writeFileSync(path.resolve(__dirname, '../../src/lib/postalCodes/index.ts'), code)
