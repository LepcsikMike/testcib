(function () {
	"use strict";

	axios.interceptors.response.use(function (res) { return res.data; }, function (error) { return Promise.reject(error); });

	var i18n;

	if ((localStorage.getItem('language') == null) && (navigator.language == 'en')) {		
		i18n = new VueI18n({
			locale: localStorage.getItem('language') || 'en',
		});		
	} else {		
		i18n = new VueI18n({
			locale: localStorage.getItem('language') || 'de',
		});
	}

	var loadedLanguages = [];

	function fetchTranslation(lang) { // http://kazupon.github.io/vue-i18n/guide/lazy-loading.html
		return loadedLanguages.includes(lang) ? Promise.resolve() : axios.get('resources/locale-' + lang + '.json').then(function (res) {
			i18n.setLocaleMessage(lang, res);
			loadedLanguages.push(lang);
		});
	}

	fetchTranslation(i18n.locale);

	new Vue({
		el: '#app',
		i18n: i18n,
		data: {
			languages: ['de', 'en'],
		},
		methods: {
			currentLanguage: function (lang) {
				if (!lang) return i18n.locale;
				if (lang == this.languages[0]) {
					document.title = 'CIB pdf brewer: kostenlos PDFs erstellen, bearbeiten und vieles mehr';
				}
				else {
				document.title = 'CIB pdf brewer: create PDFs for free, edit and much more';
				}
				return fetchTranslation(lang).then(function () {
					i18n.locale = lang;
					axios.defaults.headers.common['Accept-Language'] = lang;
					localStorage.setItem('language', lang);
					window.location.href = '#' + lang;
				})
			},
		}
	});
})();