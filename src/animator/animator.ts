import { Deferred } from '../deferred';
import { Animator, autoinject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'

export interface AnimatorEntry { instance: Deferred, element: HTMLElement}

@autoinject
export class CustomAnimator
{
	animationMap = new Map<string, Deferred>();


	constructor( private eventAggregator: EventAggregator )
	{}

	leave( element: HTMLElement ): Promise<boolean>
	{
		element.querySelector( '.animator-state' ).textContent = 'Animator: Leave';
		element.querySelector( '.promise-state' ).textContent = 'Promise: pending';

		const instance = new Deferred();
		this.eventAggregator.publish( '@animator/leave', { instance, element } as AnimatorEntry );

		return instance.promise;
	}


	// Rest just to match interface

	enter(element: HTMLElement): Promise<boolean>
	{
		return Promise.resolve( true );
	}

	removeClass(element: HTMLElement, className: string): Promise<boolean>
	{
		return Promise.resolve( true );
	}
	
	
	addClass(element: HTMLElement, className: string): Promise<boolean>
	{
		return Promise.resolve( true );
	}

	animate(element: HTMLElement | Array<HTMLElement>, className: string): Promise<boolean>
	{
		return Promise.resolve( true );
	}

	runSequence(animations: Array<any>): Promise<boolean>
	{
		return Promise.resolve( true );
	}

	registerEffect(effectName: string, properties: Object)
	{}

	unregisterEffect(effectName: string)
	{}
}