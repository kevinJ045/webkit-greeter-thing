/*
    Mock data for testing your LightDM theme in the browser
*/
if (!('lightdm' in window)) {
	const lightdm: any = {};

	lightdm.hostname ="Host";
	lightdm.languages = [
			{
					code: "en_US",
					name: "English(US)",
					territory: "USA"
			},
			{
					code: "en_UK",
					name: "English(UK)",
					territory: "UK"
			}
	];
	lightdm.default_language = lightdm.languages[0];
	lightdm.layouts = [
			{
					name: "test",
					short_description: "test description"
			}
	];
	lightdm.default_layout = lightdm.layouts[0];
	lightdm.layout = lightdm.layouts[0];
	lightdm.sessions = [
			{
					key: "i3",
					name: "i3 session",
					comment: "no comment"
			},
			{
					key: "gnome",
					name: "Gnome",
					comment: "no comment"
			},
			{
					key: "xfce",
					name: "Xfce Session",
					comment: "no comment"
			}
	];

	lightdm.default_session = lightdm.sessions[0];
	lightdm.authentication_user = null;
	lightdm.is_authenticated = false;
	lightdm.can_suspend = true;
	lightdm.can_hibernate = true;
	lightdm.can_restart = true;
	lightdm.can_shutdown = true;

	lightdm.users = [
			{
					name: "sexmachine",
					real_name: "superman",
					display_name: "Magic Wave",
					image: "static/profile.png",
					language: "en_US",
					layout: null,
					session: null,
					logged_in: false
			},
			{
					name: "brucew",
					real_name: "Batman",
					display_name: "Bruce Wayne",
					image: "http://uk.omg.li/VDHr/OW-blog-Batman.jpg",
					language: "en_US",
					layout: null,
					session: null,
					logged_in: false
			},
			{
					name: "peterp",
					real_name:"Spiderman",
					display_name: "Peter Parker",
					image: "",
					language: "en_US",
					layout: null,
					session: null,
					logged_in: true
			},
{
		name: "zerotwo",
		realname: "ZeroTwo",
		display_name: "Zero Two",
		image: "static/zerotwo.png",
		layout: null,
		session: "bspwm",
		logged_in: false
}
	];

	lightdm.num_users = lightdm.users.length;
	lightdm.timed_login_delay = 0; // increase to simulate timed_login_delay
	lightdm.timed_login_user =
			lightdm.timed_login_delay > 0 ? lightdm.users[0] : null;

	lightdm.get_string_property = function () {};
	lightdm.get_integer_property = function () {};
	lightdm.get_boolean_property = function () {};
	lightdm.cancel_timed_login = function () {
			_lightdm_mock_check_argument_length(arguments, 0);

			lightdm._timed_login_cancelled= true;
	};

	lightdm.provide_secret = function (secret) {
			if (typeof lightdm._username == 'undefined' || !lightdm._username) {
					throw "must call start_authentication first"
			}
			_lightdm_mock_check_argument_length(arguments, 1);

			var user = _lightdm_mock_get_user(lightdm.username);

			// That's right, passwords are the same as the username's!
			if (!user && secret == lightdm._username) {
					lightdm.is_authenticated = true;
					lightdm.authentication_user = user;
			} else {
					lightdm.is_authenticated = false;
					lightdm.authentication_user = null;
					lightdm._username = null;
			}

			// lightdm.authentication_complete();
	};

	lightdm.start_authentication = function (username) {
			_lightdm_mock_check_argument_length(arguments, 1);

			if (lightdm._username) {
					throw "Already authenticating!";
			}
			var user = _lightdm_mock_get_user(username);
			if (!user) {
				lightdm.show_error(username + " is an invalid user");
			}
			//show_prompt("Password: ");
			lightdm._username = username;
	};

	lightdm.cancel_authentication = function () {
			_lightdm_mock_check_argument_length(arguments, 0);

			if (!lightdm._username) {
					throw "we are not authenticating";
			}
			lightdm._username = null;
	};

	lightdm.suspend = function () {
			alert("System Suspended. Bye Bye");
			document.location.reload();
	};

	lightdm.hibernate = function () {
			alert("System Hibernated. Bye Bye");
			document.location.reload();
	};

	lightdm.restart = function () {
			alert("System restart. Bye Bye");
			document.location.reload();
	};

	lightdm.shutdown = function () {
			alert("System Shutdown. Bye Bye");
			document.location.reload();
	};

	lightdm.login = function (user, session) {
			_lightdm_mock_check_argument_length(arguments, 2);

			if (!lightdm.is_authenticated) {
					throw "The system is not authenticated";
			}
			if (user !== lightdm.authentication_user) {
					throw "this user is not authenticated";
			}

			alert("logged in successfully!!");
			document.location.reload();
	};

	if (lightdm.timed_login_delay > 0) {
			setTimeout(
					function () {
							if (!lightdm._timed_login_cancelled()) lightdm.timed_login();
					},
					lightdm.timed_login_delay
			);
	}

	// @ts-ignore 
	window.lightdm = lightdm;
}
// Helper functions
var _lightdm_mock_check_argument_length = function (args, length) {
	if (args.length != length) {
			throw "incorrect number of arguments in function call";
	}
}

var _lightdm_mock_get_user = function (username) {
	var user = null;
	// @ts-ignore
	for (var i = 0; i < window.lightdm.users.length; ++i) {
		// @ts-ignore
			if (window.lightdm.users[i].name == username) {
				// @ts-ignore
					user= window.lightdm.users[i];
					break;
			}
	}
	return user;
}

// @ts-ignore
const lightdm = window.lightdm;
export { lightdm };
