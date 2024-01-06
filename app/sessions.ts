
export const SessionIcons = {
	"awesome": "./sessions/awesome.png",
	"bspwm": "./sessions/bspwm.png",
	"budgie": "./sessions/budgie.png",
	"cinnamon": "./sessions/cinnamon.png",
	"deepin": "./sessions/deepin.png",
	"elementary": "./sessions/elementary.png",
	"enlightenment": "./sessions/enlightenment.png",
	"gnome": "./sessions/gnome.png",
	"i3": "./sessions/i3.png",
	"i3-with-shmlog": "./sessions/i3-with-shmlog.png",
	"liri": "./sessions/liri.png",
	"lxde": "./sessions/lxde.png",
	"mate": "./sessions/mate.png",
	"plasma": "./sessions/plasma.png",
	"qtile": "./sessions/qtile.png",
	"session-default": "./sessions/session-default.png",
	"sway": "./sessions/sway.png",
	"ubuntu": "./sessions/ubuntu.png",

	find(key: string){
		if(key in SessionIcons){
			return SessionIcons[key];
		} else {
			return SessionIcons['session-default'];
		}
	}
}

export function getFirstSession(){
	return lightdm.sessions[0];
}

export function getCurrentSesssion(){
	return localStorage.getItem('current_session') || getFirstSession().key;
}

export function setCurrentSession(session: string){
	localStorage.setItem('current_session', session);
}

export function isCurrentSession(session: string){
	return getCurrentSesssion() == session;
}
