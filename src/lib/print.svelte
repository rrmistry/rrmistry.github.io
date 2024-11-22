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
			class="print-btn cursor-pointer rounded-md border-none bg-blue-600 px-5 py-2 text-lg text-white outline-none transition-colors duration-300 hover:bg-blue-700 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 active:bg-blue-800"
			on:click={handlePrint}
		>
			Print PDF
		</button>
	</div>
</div>

<style>
	@media print {
		.no-print {
			display: none;
		}
		/*
		.element-to-print {
			display: block;
		}
		*/
	}
</style>
