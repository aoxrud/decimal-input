/**
Restrict an input field to only accept numerical values including decimals.

@class DecimalInputManipulator
@param input - The input field from the DOM, event listeners bind to this element.
@param {String} [format=0000.00] - A format to express how many digits are allowed in each part. Separate the integer part from fractional part by a decimal point. The default value will allow up to 4-digit integers from 0-9999 and the fractional part allows up to 2-digits (0-99)
*/
var DecimalInputManipulator = function(input, format){
	
	var maxIntegerLength;
	var maxFractionalLength;
	var DEFAULT_FORMAT = '0000.00';

	var KEYCODE = {
		UNKNOWN: 0,
		BACKSPACE: 8,
		DELETE: 46,
		ARROW_LEFT: 37,
		ARROW_RIGHT: 39,
		DECIMAL_POINT: 110,
		KEYPAD_NUMERIC_0: 48,
		KEYPAD_NUMERIC_9: 57
	};

	var onKeyPress = function(e) {
	    var charCode = e.which;
	    var value = input.value;
	    var hasDecimal = (value.indexOf(".") !== -1);

	    //period value changes depending on the numlock status, its either 46 (delete) or 110 (period)
	    var isPeriod = (charCode === KEYCODE.DECIMAL_POINT || charCode === KEYCODE.DELETE);
	    var isSpecialKey = (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);

	    //ignore decimal point if already set
		if(hasDecimal && isPeriod) {
	    	return false;
	    }

	    //allow deletion,  moving cursor left/right and decimal point
	    if([KEYCODE.BACKSPACE, KEYCODE.DELETE, KEYCODE.ARROW_LEFT, KEYCODE.ARROW_RIGHT, KEYCODE.DECIMAL_POINT, KEYCODE.UNKNOWN].indexOf(charCode) !== -1) {
	    	//disallow decimal point if no decimals expected
	    	if(isPeriod && maxFractionalLength === 0) {
	    		return false;
	    	}
	    	return true;
	    }

	    //sanitize input when special keys are pressed (Select All, Cut, Copy, Paste)
	    if(isSpecialKey) {
	    	setTimeout(function(){
	    		input.value = sanitizeAndTruncateInput(input.value);
	    	}, 100);
	    	return true;
	    }

	    //disallow anything that is not a number
	    if(charCode > 31 && (charCode < KEYCODE.KEYPAD_NUMERIC_0 || charCode > KEYCODE.KEYPAD_NUMERIC_9)) {
	        return false;
	    }

	    //allow the rest
	    return true;
	};

	var onKeyUp = function() {
		var currentValue = input.value;
		var data = analyzeNumber(currentValue);

		//ignore cleansing input when decimal point is set and fractional part is expected
		if(maxFractionalLength > 0 && data.hasDecimal && !data.hasFraction) {

			//verify that integer length is still within bounds
			if(data.hasInteger && data.integer.digits <= maxIntegerLength) {
				return;
			}
		}

		//update value only when it changes (value changes or length is different)
		var newValue = sanitizeAndTruncateInput(input.value);
		if(newValue != currentValue || currentValue.length != String(newValue).length) {
			input.value = newValue;
		}
	};


	var analyzeNumber = function(value) {
		var numericalValues = String(value).replace(/[^0-9.]/g, ''); 

		//get first decimal point
		var decimalPlacement = numericalValues.indexOf('.');
		var hasDecimal = (decimalPlacement > -1);

		//get number before decimal point and get subsequent numbers after decimal point
		var integerPart = (hasDecimal ? numericalValues.substr(0, decimalPlacement) : numericalValues);
		var fractionalPart = (hasDecimal ? numericalValues.substr(decimalPlacement) : '');

		//strip decimal places into only numbers (in case if they passed 10.23.234.53 => 10.2323453)
		fractionalPart = String(fractionalPart).replace(/[^0-9]/g, '');

		return {
			integer: {
				raw: integerPart,
				value: Number(integerPart),
				digits: integerPart.length
			},
			fractional: {
				raw: fractionalPart,
				value: Number(fractionalPart),
				digits: fractionalPart.length
			},
			hasDecimal: hasDecimal,
			hasInteger: (integerPart.length > 0),
			hasFraction: (fractionalPart.length > 0),
		};
	};

	var sanitizeAndTruncateInput = function(value) {
		var data = analyzeNumber(value);

		//check length of wholenumber and decimal number
		var outputInteger = (data.integer.digits <= maxIntegerLength ? data.integer.raw : data.integer.raw.substr(0, maxIntegerLength));
		var outputFractional = (data.fractional.digits <= maxFractionalLength ? data.fractional.raw : data.fractional.raw.substr(0, maxFractionalLength));

		//remove insignificant zeros
		outputInteger = Number(outputInteger);

		//pretty print
		var output = '';
		if(data.hasInteger && data.hasFraction) {
			output = outputInteger+'.'+outputFractional;
		} else if(data.hasInteger && !data.hasFraction) {
			output = outputInteger;
		} else if(!data.hasInteger && data.hasFraction) {
			output = "0."+outputFractional;
		}

		return output;
	};

	var init = function() {
		var parsedFormat = String(format || DEFAULT_FORMAT).split('.');
		maxIntegerLength = parsedFormat[0].length;
		maxFractionalLength = (parsedFormat.length == 2 ? parsedFormat[1].length : 0);

		input.addEventListener('keyup', onKeyUp);
		input.addEventListener('keypress', function(e){
			if(!onKeyPress(e)) {
				e.preventDefault();
			}
		});
	};

	init();
};