export class Deferred
{
	promise: Promise<any>;
	resolve;
	reject;

	constructor()
	{
		this.promise = new Promise(( resolve, reject ) =>
		{
			this.reject = reject
			this.resolve = resolve
		})
	}
}