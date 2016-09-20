const app = new class Application extends Matreshka.Object {
	constructor() {
		super()
			.set({
				phones: JSON.parse(localStorage.phoneBook || 'null') || fakeData
			})
			.addDataKeys('first_name', 'last_name', 'birth_date', 'phone_number')
			.bindNode({
				sandbox: 'body',
				form: ':sandbox .new-phone'
			})
			.instantiate('phones', Phones)
			.on({
				'phones@modify phones.*@modify': evt => {
					localStorage.phoneBook = JSON.stringify(this.phones);
				},
				'submit::form': evt => {
					evt.preventDefault();
					this.phones.push(this.toJSON());

					for(const key of this.keys()) {
						this[key] = '';
					}
				}
			})
			.parseForm();
	}

	parseForm() {
		for(const key of this.keys()) {
			this.bindNode(key, this.nodes.form[key]);
		}

		return this;
	}
}
