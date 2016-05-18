/*eslint "no-unused-vars": "off"*/
/*global Gun*/
import React from 'react';
import Game from './Game.jsx';
import gun from './gun.jsx';

const games = gun.get('games');

export default class GameList extends React.Component {
	constructor() {
		super();
		this.state = {
			gameList: []
		};
	}

	render() {
		return <div>
			<h1>Active Games</h1>
			<ul>{this.state.gameList}</ul>
		</div>;
	}

	componentDidMount() {
		const list = this;
		this.setState(() => {
			return {
				unmounted: false
			};
		});
		games.map().val((game, field) => {
			if (this.state.unmounted || game === null) {
				return;
			}
			const age = Gun.is.node.state(game, 'key');
			const now = new Date().getTime();
			if (age < now - 1000 * 60 * 60) {
				return games.path(field).put(null);
			}
			list.setState(state => {
				const games = state.gameList;
				return {
					gameList: games.concat(<Game key={game.key} game={game} />)
				};
			});
		});
	}

	componentWillUnmount() {
		this.setState(function () {
			return {
				unmounted: true
			};
		});
	}
}
