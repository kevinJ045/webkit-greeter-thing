
const currentUser = {
	name: lightdm.users[0].name
}

export function selectUser(index = 0){
	if(index > lightdm.users) index = 0;
	return lightdm.users[index];
}

export function getCurrentUser(){
	return currentUser.name;
}

export function setCurrentUser(username: string){
	return currentUser.name = username;
}

export function isCurrentUser(username: string){
	return currentUser.name == username;
}
