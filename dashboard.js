Funbit.Ets.Telemetry.Dashboard.prototype.initialize = function (skinConfig, utils) {
    //
    // skinConfig - a copy of the skin configuration from config.json
    // utils - an object containing several utility functions (see skin tutorial for more information)
    //

    // this function is called before everything else, 
    // so you may perform any DOM or resource initializations / image preloading here

    utils.preloadImages([
        'images/bg-off.png', 'images/bg-on.png', 'images/rpmbar.png'
    ]);

    // return to menu by a click
    //$(document).add('body').on('click', function () {
    //    window.history.back();
    //});
}

Funbit.Ets.Telemetry.Dashboard.prototype.filter = function (data, utils) {
    //
    // data - telemetry data JSON object
    // utils - an object containing several utility functions (see skin tutorial for more information)
    //

    // This filter is used to change telemetry data 
    // before it is displayed on the dashboard.
    // You may convert km/h to mph, kilograms to tons, etc.

    // round truck speed
    data.truck.speed = Math.abs(data.truck.speed > 0
        ? Math.floor(data.truck.speed)
        : Math.round(data.truck.speed));

    // other examples:
	data.truck.rpm = data.truck.engineRpm/data.truck.engineRpmMax;
	data.truck.rpm > 1?data.truck.rpm=1:data.truck.rpm=data.truck.rpm;
	var nextRestStopTimeDate = new Date(data.game.nextRestStopTime);
	data.game.restHours = nextRestStopTimeDate.getUTCHours();
	data.game.restMinutes = nextRestStopTimeDate.getUTCMinutes();
    // convert kg to t
    data.trailer.mass = (data.trailer.mass / 1000.0) + 't';
    // format odometer data as: 00000.0
    data.truck.odometer = utils.formatFloat(data.truck.odometer, 1);
    // convert displayedGear to readable format
    data.truck.displayedGear = data.truck.displayedGear > 0 ? " "+data.truck.displayedGear : (data.truck.displayedGear < 0 ? " R" : " N");
    // return changed data to the core for rendering
    return data;
};

Funbit.Ets.Telemetry.Dashboard.prototype.render = function (data, utils) {
	$('._rpm').width(data.truck.rpm * 430);
	$('._fuel').width(data.truck.fuel/data.truck.fuelCapacity * 190);
	$('._stamina').width(staper(data.game.restHours,data.game.restMinutes) * 190);
	$('._clutch').height(data.truck.gameClutch * 110);
	$('._brake').height(data.truck.gameBrake * 110);
	$('._throttle').height(data.truck.gameThrottle * 110);
	data.truck.rpm>=0.9?$('._shift').show():$('._shift').hide();
    //
    // data - same data object as in the filter function
    // utils - an object containing several utility functions (see skin tutorial for more information)
    //

    // we don't have anything custom to render in this skin,
    // but you may use jQuery here to update DOM or CSS
}

function staper(hourRest,minuteRest){
	var maxRest=11*60*60*1000;
	var hourMili=hourRest*60*60*1000;
	var minuteMili=minuteRest*60*1000;
	return ((hourMili+minuteMili)/maxRest);
}