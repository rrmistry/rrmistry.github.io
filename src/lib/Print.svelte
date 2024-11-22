<script>
	// A simple function to handle the print action
	function handlePrint(event) {
		event.preventDefault();
		window.print();
	}
</script>

<div class="grid-item grid-item-right">
	<div class="no-print">
		<button
			class="print-btn cursor-pointer rounded-md border-none bg-primary px-5 py-2 text-lg text-white outline-none transition-colors duration-300 hover:bg-blue-700 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 active:bg-blue-800"
			on:click={handlePrint}
		>
			<div class="flex flex-wrap">
				<svg xmlns="http://www.w3.org/2000/svg" width="30" height="24" viewBox="5 -2 24 24">
					<path fill="currentColor" d="M19 8H5c-1.66 0-3 1.34-3 3v4c0 1.1.9 2 2 2h2v2c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-2h2c1.1 0 2-.9 2-2v-4c0-1.66-1.34-3-3-3zm-4 11H9c-.55 0-1-.45-1-1v-4h8v4c0 .55-.45 1-1 1zm4-7c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1zm-2-9H7c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1z"/>
				</svg>
				Print PDF
			</div>
		</button>
	</div>
</div>
