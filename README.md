# Decimal Input Manipulator
Restrict an input field to only accept positive numerical with including decimals.

## Features
* The input should only allow XXX.XX (ie. 100, 123.45, 2.3, 0.44)
* You should be able to use left/right-arrows to move the cursor
* You should be able to Select All, Cut, Copy, Paste
* You should be able to use Delete/Backspace
* Pasting non-numeric characters should be stripped out
* Multiple periods should not be allowed
* You should be able to enter a decimal without leading 0. (ie. .45)

## Example
```
var myInputField = document.getElementById('decimals-only');
var digitsFormat = "00.00"
new DecimalInputManipulator(myInputField, digitsFormat);
```

### @param myInputField
Should be a DOM textfield element. You can also use jquery selectors and extract the DOM element by using `$('.myInput')[0]`

### @param {optional} digitsFormat
Should be a string that expresses how many digits you want for the integer part and how many digits you want for the fractional part delimeted by a decimal point (.)
The **default value is** `0000.00`
> Example: `000.0` will allow up to 3-digits in the integer part and 1-digit in the fractional part. 
Allowed: `123.4`, `2.1`, '0.3`, etc.. 

> Example: `0.000` will allow up to 1-digit in the integer part and 3-digit in the fractional part. 
Allowed: `0.4`, `0.33`, '0.345`, `1.345`, `9.999`, `9` etc.. 

