export const beautifyFunction = (funcArr: string[]): string => {
	const normalize: string[] = []
	const identTab = '\t'
	let countScope = 0

	funcArr
	.filter((a) => a)
	.map((a) => a.replace(/\t/g, '').trim())
	.forEach((line) => {
		if ( /{$/g.test(line) || line.includes('promises.push(') ) {
			normalize.push(`${identTab.repeat(countScope > 0 ? countScope : 0)}${line}`)
			countScope += 1
			return;
		} 
		else if ( /}$|}\)/.test(line) || /^\);$/g.test(line) ) {
			countScope -= 1
		} 
		normalize.push(`${identTab.repeat(countScope > 0 ? countScope : 0)}${line}`)
	})

	return normalize.join('\n')
}
