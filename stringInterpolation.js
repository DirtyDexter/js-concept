String.prototype.interpolation = function (obj) {
	var regex = /\{(\w+((-\w+)+)?)\}/g
	return this.replace(regex, function (match, key) {
		//console.log('match : '+ match)
		//console.log('key : '+ key)
		return obj[key] || match
	})
}
