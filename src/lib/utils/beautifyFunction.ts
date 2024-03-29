export const beautifyFunction = (funcArr: string[]): string => {
	const normalize: string[] = [];
	const identTab = '\t';
	let countScope = 0;

	funcArr
	.filter((a) => a)
	.map((a) => a.replace(/\t/g, '')
	.trim())
	.forEach((line) => {
		if ( /\)\s{0,}{/g.test(line) || line.includes('promises.push(') ) {
			normalize.push(`${identTab.repeat(countScope)}${line}`);
			countScope += 1;
			return;
		} 
		else if ( /}(?!])/.test(line) || /^\);$/g.test(line) ) {
			countScope -= 1;
		} 
		normalize.push(`${identTab.repeat(countScope)}${line}`);
	});

	return normalize.join('\n');
};
