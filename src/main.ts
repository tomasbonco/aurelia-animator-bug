import { Aurelia, TemplatingEngine } from 'aurelia-framework'

export function configure( aurelia: Aurelia )
{
	aurelia.use.standardConfiguration()
	.plugin( 'animator/index' );

	aurelia.start().then(() => aurelia.setRoot());
}
