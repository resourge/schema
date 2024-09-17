export function minifyJavaScript(jsCode: string) {
	// Remove single-line comments (//...)
	return jsCode
	.replace(/\/\/.*$/gm, '')
	// Remove multi-line comments (/* ... */)
	.replace(/\/\*[\s\S]*?\*\//g, '')
	// Remove unnecessary whitespace and line breaks
	.replace(/\s*([{};:,])\s*/g, '$1') // Remove spaces around {}, ;, :, and ,
	.replace(/\s+/g, ' ') // Collapse whitespace to a single space
	.trim(); // Remove leading and trailing whitespace
}
