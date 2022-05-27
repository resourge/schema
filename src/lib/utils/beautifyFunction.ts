export const beautifyFunction = (funcArr: string[]): string => {
	const normalize: string[] = []
	const identTab = '\t'
	let countScope = 0

	funcArr
	.map((a) => a.replace(/\t/g, ''))
	.forEach((line) => {
		if ( line.includes('{') ) {
			normalize.push(`${identTab.repeat(countScope)}${line}`)
			countScope += 1
			return;
		} 
		else if ( line.includes('}') ) {
			countScope -= 1
		} 
		normalize.push(`${identTab.repeat(countScope)}${line}`)
	})
	return normalize.join('\n')
}
