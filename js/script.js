function creditCard() {
	return {
		// Runs when the component is initialized to format any existing values:
		init() {
			this.formatExpirySpacing();
			this.formatCreditCard();
		},
		/**
		 * Start Credit Card Number Formatting
		 */
		ccNum: "",
		ccType: null,
		ccSecurity: 3,
		ccLength: "",
		// Formats the credit card number any time a key is pressed:
		formatCreditCard() {
			// Remove the spaces from the displayed formatted number
			const spacelessCc = this.ccNum.replace(/\D/g, "");
			// Find out what type of credit card we're dealing with
			this.getCcType(spacelessCc);
			// Format the string for display
			this.ccNum = this.formatCcNumber(spacelessCc);
		},
		// Find out what type of credit card we're dealing with
		getCcType(ccNum) {
			// Loop through the card type available
			for (var i in this.cardTypes) {
				const cardType = this.cardTypes[i];

				// Check if the current CC number matches this card type regex
				if (ccNum.match(cardType.pattern)) {
					// Set credit card variables in Alpine
					this.ccType = cardType;
					this.ccLength = cardType.format.length;
					this.ccSecurity = cardType.security;
					return cardType;
				} else {
					// Clear Alpine variables
					this.ccType = null;
					this.ccLength = null;
					this.ccSecurity = 3;
				}
			}
		},
		// Format the credit card number based on the card type pattern
		formatCcNumber(ccNum) {
			let numAppendedChars = 0;
			let formattedNumber = "";
			let cardFormatIndex = "";

			// Just return the provided number if we don't know the card type
			if (!this.ccType) {
				return ccNum;
			}

			const cardFormatString = this.ccType.format;

			// Loop through the characters in the CC number
			for (var i = 0; i < ccNum.length; i++) {
				cardFormatIndex = i + numAppendedChars;

				if (!cardFormatString || cardFormatIndex >= cardFormatString.length) {
					// Return the provided CC number if we don't have a card format string or the index is longer than the format length
					return ccNum;
				}

				if (cardFormatString.charAt(cardFormatIndex) !== "x") {
					// If we encounter a space in the format string, increment the number of added characters
					numAppendedChars++;
					// Add the whitespace character to our formatted number string
					formattedNumber += cardFormatString.charAt(cardFormatIndex) + ccNum.charAt(i);
				} else {
					// If we encounter an 'x', just add the current digit of the CC number to our formatted number string
					formattedNumber += ccNum.charAt(i);
				}
			}

			return formattedNumber;
		},
		// Types of credit cards and their formatting:
		cardTypes: {
			"American Express": {
				name: "American Express",
				code: "ax",
				security: 4,
				pattern: /^3[47]/, // Starts with 34 or 37
				format: "xxxx xxxxxxx xxxx",
			},
			Visa: {
				name: "Visa",
				code: "vs",
				security: 3,
				pattern: /^4/, // Starts with 4
				format: "xxxx xxxx xxxx xxxx",
			},
			Discover: {
				name: "Discover",
				code: "ds",
				security: 3,
				pattern: /^6(?:011|5)/, // Starts with 6011 or 65
				format: "xxxx xxxx xxxx xxxx",
			},
			Mastercard: {
				name: "Mastercard",
				code: "mc",
				security: 3,
				pattern: /^5[1-5]/, // Starts with 51, 52, 53, 53, or 55
				format: "xxxx xxxx xxxx xxxx",
			},
		},
		/**
		 * Start Expiration Date Formatting
		 */
		expiry: "",
		expiryMonthRegex: /^\d{2}$/, // matches "MM"
		expiryMonthSlashRegex: /^\d{2} \/$/, // matches "MM /"
		expirySpacelessRegex: /^\d{2}\/\d+$/, // matches "MM/YYYY"
		// Inserts a space on either side of slash if none exists:
		formatExpirySpacing() {
			// Test expiration date with regex for spaceless dates
			const isExpirySpaceless = this.expirySpacelessRegex.exec(this.expiry);

			if (isExpirySpaceless) {
				// split the date at the slash
				const parts = this.expiry.split("/");
				// reformat expiry with a slash with space around
				this.expiry = parts[0] + " / " + parts[1];
			}
		},
		// Format the expiration date as user types:
		formatExpiryInput(e) {
			// Test expiration date with regexes for only month entered and month with slash
			const isMonthEntered = this.expiryMonthRegex.exec(this.expiry);
			const isMonthSlashEntered = this.expiryMonthSlashRegex.exec(this.expiry);

			if (isMonthSlashEntered && e.key === "Backspace") {
				// If the month and slash already exist and no year entered and user has hit backspace, delete the slash and the 2nd month digit

				this.expiry = this.expiry.slice(0, -3);
			} else if (isMonthEntered && e.key >= 0 && e.key <= 9) {
				// If user has entered 2 digits for month, reformat to insert slash with spaces around
				this.expiry = this.expiry + " / ";
			}

			// clean up expiration date spacing, just in case
			this.formatExpirySpacing();
		},
	};
}
