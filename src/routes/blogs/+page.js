export function load({ url }) {
	const query = url.searchParams.get('q') || '';
	const tag = url.searchParams.get('tag') || '';
	
	return {
		query,
		tag
	};
}