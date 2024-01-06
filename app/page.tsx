import { Button, Component, Container, List, Span, Text, Widget } from "rayous";
import { ArrayController, WidgetEvent, buildProps } from "rayous/extra";
import { React } from "rayous/react";
import { SessionIcons, getCurrentSesssion, isCurrentSession, setCurrentSession } from "./sessions";
import { getCurrentUser, isCurrentUser, setCurrentUser } from "./user";

export default class extends Component {
	static updateMode: "reinit" | "refresh" = "refresh";

	build(props: buildProps) {
		return new Widget({
			class: 'page',
			children: [
				<Container class="header">
					{
						new List({
							class: 'users',
							items: lightdm.users,
							template(user){
								return <Container onClick={function(){
									const that = this as Container;
									const name = that.options.uname;
									const index = lightdm.users.indexOf(lightdm.users.find(i => i.name == name));
									that.removeClass('active');
									const active = lightdm.users[index+1] || lightdm.users[0];
									
									that.closest('.page')
									.find('#user-'+active.name)?.addClass('active');

									setCurrentUser(active.name);

								}} id={"user-"+user.name} uname={user.name} class={`user user-${user.name} ${isCurrentUser(user.name) ? 'active' : ''}`}>
									<Text class="name">{user.name}</Text>
								</Container>
							}
						})
					}
					{
						new List({
							class: 'sessions',
							items: lightdm.sessions,
							template(session){
								return <Container onClick={function(){
									const that = this as Container;
									const key = that.options.key;
									const index = lightdm.sessions.indexOf(lightdm.sessions.find(i => i.key == key));
									that.removeClass('active');
									const active = lightdm.sessions[index+1] || lightdm.sessions[0];
									
									that.closest('.page')
									.find('#session-'+active.key)?.addClass('active');

									setCurrentSession(active.key);

								}} id={"session-"+session.key} key={session.key} attr={{'style':'--icon: url('+SessionIcons.find(session.key)+')'}} class={`session session-${session.key} ${isCurrentSession(session.key) ? 'active' : ''}`}>
									<Text class="name">{session.name}</Text>
								</Container>
							}
						})
					}
					<Container class="clock">
						<Text>00:00 Am</Text>
					</Container>
				</Container>,
				<Container id="password" class="password">
					<Span class="cursor"></Span>
				</Container>,
				<Container class="footer">
					<Container class="info-group">
						<Text class="label">HOSTNAME</Text>
						<Text class="value">{lightdm.hostname}</Text>
					</Container>
					<Span class="sep" />
					<Container class="info-group">
						<Text class="label">USERS</Text>
						<Text class="value">{lightdm.num_users.toString()}</Text>
					</Container>

					<Button class="off-button" onClick={() => lightdm.suspend()} onContextmenu={() => lightdm.shutdown()} />
				</Container>
			]
		});
	}

	afterBuild(props: buildProps): void {
		// lightdm.cancel_timed_login ();

		const passwdW = props.page.find('#password');
		const cursor = passwdW.find('.cursor');
		const passwordChars = new ArrayController([]);
		let lastValue = "";

		window.authentication_complete = function(){
			if (lightdm.is_authenticated) lightdm.login (lightdm.authentication_user, getCurrentSesssion());
			else passwdW.addClass('error');
		}

		Widget.from(document.body).on('keyup', (e: WidgetEvent) => {

			if(e.key.output == 'Backspace'){
				if(e.key.ctrl){
					passwordChars.set([]);
				} else if(passwordChars.get().length) passwordChars.pop();
			} else if(e.key.output == 'Enter'){
				try{
					lightdm.start_authentication(getCurrentUser());
					lightdm.provide_secret(passwordChars.get().join(""));
				} catch(e){
					alert(e.toString());
				}
			} else if(e.key.output.length == 1) {
				passwordChars.push(e.key.output);
			}
			
		});

		passwordChars.onChange((a: string[]) => {
			const value = a.join('');
			
			if(passwdW.hasClass('error') && value.length){
				passwdW.removeClass('error');
			}

			const addChar = () => {
				let newValue = value.replace(lastValue, "");
				passwdW.add(new Span({ char: newValue, id: "char_"+a.length, class: 'char' }));
				lastValue += newValue;
			}

			if(a.length == 0){
				(passwdW.findAll('.char') as any).remove();
				lastValue = "";
			} else if(value.length > lastValue.length){
				addChar();
			} else if(value.length < lastValue.length) {
				if(lastValue == ""){
					addChar();
				} else {
					lastValue = value;
					passwdW.find('#char_'+(a.length+1))?.remove();
				}
			}

			cursor.style = {
				left: value.length * 40
			}
		});

		this.updateTime(props.page!);

		setInterval(() => {
			this.updateTime(props.page!);
		}, 1000);
	}

	updateTime(page: Widget){
		page.find('.clock').find('div').text(new Date().toLocaleTimeString())
	}
}
