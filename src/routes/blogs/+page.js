export function load() {
	// For static sites, we can't access URL params during prerendering
	// The BlogList component will handle URL params on the client side
	return {};
}