// make it run on both platforms
(function (global) {

	const _LocaleId = 'fr-CA';
	const _Language = 'fr';

	if (window != null) {
		// in browser platform
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.defer = true;
		script.src = `locale/${_LocaleId}.js`;
		document.head.appendChild(script);

	} else {
		// in server platform
		require(`./${_LocaleId}.js`);
	}

	const keys = {
		NoRes: '',
		 
		 
   // inject:translations 
   // endinject
	};

	global.cr = global.cr || {};
	global.cr.resources = {
		language: _Language,
		keys,
		localeId: _LocaleId
	}

	// for nodejs
	global.cr[_Language] = global.cr.resources;



})(typeof globalThis !== 'undefined' && globalThis || typeof global !== 'undefined' && global ||
	typeof window !== 'undefined' && window);

