const fs = require('fs');
const path = require('path');

const fixTypes = (typePath) => {
	const typesFilePath = path.resolve(__dirname, typePath);

	let content = fs.readFileSync(typesFilePath, 'utf-8');
	
	// Change declare to export
	content = content.replace(/declare/g, 'export declare');
	
	// Remover last export
	const lastExport = content.lastIndexOf('export {');
	content = content.substring(0, lastExport);
	
	// Remove last line break
	const lastLine = content.lastIndexOf('\n');
	content = content.substring(0, lastLine);
	
	// Write File
	fs.writeFileSync(typesFilePath, content);
}

fixTypes('../dist/index.d.ts')
fixTypes('../dist/postalCodes/index.d.ts')
fixTypes('../dist/phoneNumbers/index.d.ts')