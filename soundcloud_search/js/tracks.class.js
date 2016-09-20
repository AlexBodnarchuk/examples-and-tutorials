class Tracks extends Matreshka.Array {
	get Model() {
		return Track;
	}

	get itemRenderer() {
		return '#track_template';
	}

	constructor() {
		super()
			.set({
				query: localStorage.matreshkaTracksQuery || ''
			})
			.bindNode({
				sandbox: 'main',
				container: ':sandbox .tracks',
				form: ':sandbox .search',
				query: ':bound(form) .query'
			})
			.on({
				'submit::form': evt => {
					evt.preventDefault();
					this.loadTracks().then(data => this.recreate(data));
					localStorage.matreshkaTracksQuery = this.query;
				},
				'*@ended::stream': evt => {
					const track = evt.self;
					this[(this.indexOf(track) + 1) % this.length].play();
				},
				'*@play::stream': evt => {
					const track = evt.self;
					if (this.lastPlayed && this.lastPlayed !== track) {
						this.lastPlayed.stop();
					}

					this.lastPlayed = track;
				}
			});

		if (this.query) {
			this.loadTracks().then(data => this.recreate(data));
		}
	}

	loadTracks() {
		const params = {
			q: this.query,
			client_id: client_id,
			limit: 20,
			offset: 0,
			filter: 'streamable',
			order: 'hotness'
		};

		const paramsStr = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');

		return fetch(`//api.soundcloud.com/tracks.json?${paramsStr}`).then(resp => resp.json());
	}
}
