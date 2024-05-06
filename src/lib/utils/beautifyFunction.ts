function countOccurrences(str: string, char: string): number {
	let count = 0;
	for (let i = 0; i < str.length; i++) {
		if (str[i] === char) {
			count++;
		}
	}
	return count;
}

export const beautifyFunction = (funcArr: string[]): string => {
	const normalize: string[] = [];
	const identTab = '\t';
	let countScope = 0;

	funcArr
	.forEach((line) => {
		if ( line.includes('{') ) {
			normalize.push(`${identTab.repeat(countScope < 0 ? 0 : countScope)}${line}`);
			countScope += countOccurrences(line, '{');
			return;
		} 
		if ( line.includes('}') ) {
			countScope -= countOccurrences(line, '}');
		} 
		normalize.push(`${identTab.repeat(countScope < 0 ? 0 : countScope)}${line}`);
	});

	return normalize.join('\n');
};
