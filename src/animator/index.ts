import {TemplatingEngine} from 'aurelia-templating';
import {CustomAnimator} from './animator';

export function configure( config, callback?: (animator: CustomAnimator) => void ): void
{
	let animator = config.container.get( CustomAnimator );
	config.container.get( TemplatingEngine ).configureAnimator( animator );

	if ( typeof callback === 'function' )
	{
		callback(animator);
	}
}