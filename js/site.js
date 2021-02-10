var loadInProgress = true;

function openPage(address) {
	if (loadInProgress)
		return;
	loadInProgress = true;
	$('#section-content').animate({opacity: 0.0}, 300, function() {
		loadPage(address);
	});
}

function completeLoad() {
	loadInProgress = false;
}

function loadPage(address) {
	let displayAddress = address;
	while (displayAddress.startsWith('/'))
		displayAddress = displayAddress.substring(1);
	if (displayAddress.toLowerCase().endsWith('.html'))
		displayAddress = displayAddress.substring(0, displayAddress.length - 5);
	if (displayAddress.toLowerCase() == 'home')
		window.history.replaceState('', '', '/');
	else
		window.history.replaceState('', '', '/?view=' + encodeURI(displayAddress));
	$('#section-content').html('');
	$('#section-content').css({opacity: 0.0});
	$('#section-content').load(address, function(responseText, textStatus) {
		if ((textStatus == 'success') || (textStatus == 'notmodified')) {
			$('#section-content').animate({opacity: 1.0}, 300, function() {
				if ($('#manual-complete-load').length == 0)
					completeLoad();
			});
		} else {
			$('#section-content').html('<h1>Page not found</h1>\n<p>The page you were looking for does not exist.</p>');
			$('#section-content').animate({opacity: 1.0}, 300, function() {
				completeLoad();
			});
		}
	});
}

$(window).ready(function() {
	$('#section-sidebar').animate({opacity: 1.0}, 600, function() {
		let address = (new URLSearchParams(window.location.search)).get('view');
		if (address) {
			if (!address.startsWith('/'))
				address = '/' + address;
			if (!address.toLowerCase().endsWith('.html'))
				address += '.html';
		} else
			address = '/home.html';
		loadPage(address);
	});
});
