const fs = require('fs');
const path = require('path');

const removePostalCode = (typePath) => {
	const typesFilePath = path.resolve(__dirname, typePath);

	let content = fs.readFileSync(typesFilePath, 'utf-8');
	
	// Remove import
	content = content.replace(/import .* from '\.\/postalCodes\/index\.js';/g, '');
	// Remove export
	content = content.replace(/export .* from '\.\/postalCodes\/index\.js';/g, '');
	// Remove import
	content = content.replace(` */



export `, ` */
export `);
	
	// Write File
	fs.writeFileSync(typesFilePath, content);
}

removePostalCode('../dist/index.d.ts')