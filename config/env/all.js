'use strict';

module.exports = {
	app: {
		title: 'U2ME',
		description: 'Y',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				/*'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/bootstrap/dist/css/style.css'*/
                'public/lib/mtek-theme/global/vendors/font-awesome/css/font-awesome.min.css',
                'public/lib/mtek-theme/global/vendors/simple-line-icons/simple-line-icons.css',
                'public/lib/mtek-theme/global/vendors/bootstrap/css/bootstrap.min.css',
                'public/lib/mtek-theme/global/vendors/animate.css/animate.css',
                'public/lib/mtek-theme/global/vendors/iCheck/skins/all.css',
                'public/lib/mtek-theme/assets/vendors/bootstrap-switch/css/bootstrap-switch.css',
                'public/lib/mtek-theme/assets/vendors/jquery-lightbox/css/lightbox.css',
                'public/lib/mtek-theme/assets/vendors/owl-carousel/owl-carousel/owl.carousel.css',
                'public/lib/mtek-theme/assets/vendors/owl-carousel/owl-carousel/owl.theme.css',
                'public/lib/mtek-theme/global/css/core.css',
                'public/lib/mtek-theme/assets/css/themes/blue.css',
                'public/lib/bootstrap/dist/css/style.css'
			],
			js: [
                'public/lib/mtek-theme/global/js/jquery-1.10.2.min.js',
                'public/lib/mtek-theme/global/js/jquery-migrate-1.2.1.min.js',
                'public/lib/mtek-theme/global/js/jquery-ui.js',
                'public/lib/mtek-theme/global/vendors/bootstrap/js/bootstrap.min.js',
                'public/lib/mtek-theme/global/vendors/bootstrap-hover-dropdown/bootstrap-hover-dropdown.js',
                'public/lib/mtek-theme/global/js/html5shiv.js',
                'public/lib/mtek-theme/global/js/respond.min.js',
                'public/lib/mtek-theme/global/vendors/metisMenu/jquery.metisMenu.js',
                'public/lib/mtek-theme/global/vendors/slimScroll/jquery.slimscroll.js',
                'public/lib/mtek-theme/global/vendors/iCheck/icheck.min.js',
                'public/lib/mtek-theme/global/vendors/iCheck/custom.min.js',
                'public/lib/mtek-theme/assets/vendors/bootstrap-switch/js/bootstrap-switch.min.js',
                'public/lib/mtek-theme/assets/vendors/google-code-prettify/prettify.js',
                'public/lib/mtek-theme/assets/vendors/jquery-cookie/jquery.cookie.js',
                'public/lib/mtek-theme/assets/vendors/jquery.pulsate.js',
                'public/lib/mtek-theme/assets/vendors/jquery-toastr/toastr.js',
                'public/lib/mtek-theme/assets/vendors/mixitup/src/jquery.mixitup.js',
                'public/lib/mtek-theme/assets/vendors/lightbox/js/lightbox.min.js',
                'public/lib/mtek-theme/assets/js/page-gallery.js',
                'public/lib/mtek-theme/global/js/core.js    ',
                'public/lib/mtek-theme/assets/js/system-layout.js',
                'public/lib/mtek-theme/assets/js/jquery-responsive.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/angular-socket-io/socket.min.js',
                'public/lib/adapter.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};