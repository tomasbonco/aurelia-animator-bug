import { Deferred } from './deferred';
import { AnimatorEntry } from './animator/animator';
import { autoinject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import * as animejs from 'animejs';

const socialNetworks: string[] = [ 'facebook', 'twitter', 'linkedin', 'reddit', 'gplus' ]

interface Channel
{
	name: string;
	state: 'open' | 'publishing' | 'to-remove';
	selected: boolean;
}

@autoinject
export class App
{
	channels: Channel[] = [];

	waitingRoom: AnimatorEntry[] = [];
	waitingRoomMaxSize: number = 0;

	isPublishing: boolean = false;


	constructor( private eventAggregator: EventAggregator )
	{
		this.eventAggregator.subscribe( '@animator/leave', ( data: AnimatorEntry ) =>  this.addToWaitingRoom( data ) );

		this.channels = socialNetworks.map( network => { return { name: network, state: 'open', selected: false } as Channel } )
	}


	/**
	 * Reaction to button press.
	 */
	publishPost()
	{
		// filter selected networks
		const selectedChannels = this.channels.filter( c => c.selected );
		
		// simulate publishing for selected networks, then remove netowkr from the list of available networks
		for ( const selectedChannel of selectedChannels )
		{
			selectedChannel.state = 'publishing';

			this.performAsyncTask().then( ()=>
			{
				this.channels.splice( this.channels.indexOf( selectedChannel ), 1 )
				selectedChannel.state = 'to-remove';
			});
		}

		// save count of selected networks, and lock UI
		this.waitingRoomMaxSize = selectedChannels.length;
		this.isPublishing = true;
	}


	/**
	 * Once post was published to network, such network enters waiting room,
	 * where it waits for all other networks, so they can perform animation together.
	 * This is usually invoked by EventAggregator (check constructor).
	 * 
	 * @param {AnimatorEntry} entry - network that sucessfully finished publishing
	 */
	addToWaitingRoom( entry: AnimatorEntry )
	{
		entry.element.classList.add( 'published' );
		
		// add channel into waiting room
		this.waitingRoom.push( entry );

		// if this is the last one, run animation
		if ( this.waitingRoom.length === this.waitingRoomMaxSize )
		{
			this.releaseWaitingRoom();
		}
	}
	

	/**
	 * Remove all network from waiting room.
	 */
	releaseWaitingRoom()
	{
		while ( this.waitingRoom.length > 0 )
		{
			// remove network from waiting room
			const entry = this.waitingRoom.pop();

			// play animation, once it's finished, remove from DOM (resolve promise)
			const animation = animejs({ targets: entry.element, opacity: 0, duration: 1500, easing: 'linear' })
			animation.finished.then( () =>
			{
				entry.element.querySelector( '.promise-state' ).textContent = 'Promise state: resolved';
				entry.instance.resolve();
			});
		}

		// once all networks are removed ffrom waiting room, unlock UI
		this.isPublishing = false;
	}


	/**
	 * Simulates some async task, like publishing to social network. 
	 */
	performAsyncTask(): Promise<any>
	{
		const deferred = new Deferred();
		const randomTime = ( min, max ) => Math.floor( Math.random() * (max - min + 1) ) + min;

		setTimeout( deferred.resolve, randomTime( 1000, 3500 ) );

		return deferred.promise;
	}
}
