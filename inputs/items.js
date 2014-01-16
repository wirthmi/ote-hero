function defineItems( Q ) {
	var items = [

		// item 1
		{
			id: "bsme",
			name: "Small Energy Storage",
			description: "Additional auto-battery. Enough for recharging you cell phone.",
			price: 1,
			usage: Q.const.USAGE_BODY,
			asset: "item-bsme.png",

			goodHeroes: [  ],
			badHeroes: [  ],

				bonusCapabilities: {
				speed: 0,
				damage: 0,
				reload: 0,
				range: 0,
				sight: 0,
				armor: 0,
				health: 0,
				energy: 1,
				repair: 0,
				charge: 0
			}

		},
		// item 2
		{
			id: "hgls",
			name: "Googol Glass",
			description: "Superexpensive long range scope which allows you to see tiny bunny in mouth of angry Spacebug for 50 miles.",
			price: 7,
			usage: Q.const.USAGE_HEAD,
			asset: "item-hgls.png",

			goodHeroes: [  ],
			badHeroes: [ "doc" ],

				bonusCapabilities: {
				speed: 0,
				damage: 0,
				reload: 0,
				range: 0,
				sight: 7,
				armor: 0,
				health: 0,
				energy: 0,
				repair: 0,
				charge: 0
			}

		},
		// item 3
		{
			id: "wdam",
			name: "Duranthium Ammo",
			description: "Anti-armor shells - weaker a bit but same amount of dmg to armored enemies.",
			price: 3,
			usage: Q.const.USAGE_HAND,
			asset: "item-wdam.png",

			goodHeroes: [  ],
			badHeroes: [ "bug" ],

				bonusCapabilities: {
				speed: 0,
				damage: -1,
				reload: 0,
				range: 0,
				sight: 0,
				armor: 0,
				health: 0,
				energy: 0,
				repair: 0,
				charge: 0
			}

		},
		// item 4
		{
			id: "hlls",
			name: "Single Scope",
			description: "Slightly increase Line Of Sight (LOS) of Hero.",
			price: 1,
			usage: Q.const.USAGE_HEAD,
			asset: "item-hlls.png",

			goodHeroes: [  ],
			badHeroes: [  ],

				bonusCapabilities: {
				speed: 0,
				damage: 0,
				reload: 0,
				range: 0,
				sight: 1,
				armor: 0,
				health: 0,
				energy: 0,
				repair: 0,
				charge: 0
			}

		},
		// item 5
		{
			id: "bfpz",
			name: "Light front panzer",
			description: "Panzer which increase armor of hero for direct attacks but decrease his speed a bit in exchange.",
			price: 3,
			usage: Q.const.USAGE_BODY,
			asset: "item-bfpz.png",

			goodHeroes: [  ],
			badHeroes: [ "cam" ],

				bonusCapabilities: {
				speed: -1,
				damage: 0,
				reload: 0,
				range: 0,
				sight: 0,
				armor: 3,
				health: 0,
				energy: 0,
				repair: 0,
				charge: 0
			}

		},
		// item 6
		{
			id: "bpsh",
			name: "Plasma Shield Emitor",
			description: "Ultimate solution for annonying plasma around your head.",
			price: 7,
			usage: Q.const.USAGE_BODY,
			asset: "item-bpsh.png",

			goodHeroes: [  ],
			badHeroes: [ "bulk", "bug" ],

				bonusCapabilities: {
				speed: 0,
				damage: 0,
				reload: 0,
				range: 0,
				sight: 0,
				armor: 0,
				health: 0,
				energy: 0,
				repair: 0,
				charge: 0
			}

		},
		// item 7
		{
			id: "bejm",
			name: "Jammer Emitor",
			description: "Hide hero and all around him aside hungry enemy radar eyes. Cost huge amount of energy.",
			price: 7,
			usage: Q.const.USAGE_BODY,
			asset: "item-bejm.png",

			goodHeroes: [  ],
			badHeroes: [  ],

				bonusCapabilities: {
				speed: 0,
				damage: 0,
				reload: 0,
				range: 0,
				sight: 0,
				armor: 0,
				health: 0,
				energy: 0,
				repair: 0,
				charge: -7
			}

		},
		// item 8
		{
			id: "wgsh",
			name: "Graviton Shells",
			description: "Hit by shell add motion to target. Need some energy upkeep.",
			price: 7,
			usage: Q.const.USAGE_HAND,
			asset: "item-wgsh.png",

			goodHeroes: [ "bulk" ],
			badHeroes: [  ],

				bonusCapabilities: {
				speed: 0,
				damage: 0,
				reload: 7,
				range: 0,
				sight: 0,
				armor: 0,
				health: 0,
				energy: 0,
				repair: 0,
				charge: -1
			}

		},
		// item 9
		{
			id: "bemr",
			name: "Standard Radar Emitor",
			description: "RADAR! Powerfull scan device you!",
			price: 5,
			usage: Q.const.USAGE_BODY,
			asset: "item-bemr.png",

			goodHeroes: [  ],
			badHeroes: [  ],

				bonusCapabilities: {
				speed: 0,
				damage: 0,
				reload: 0,
				range: 0,
				sight: 0,
				armor: 0,
				health: 0,
				energy: 0,
				repair: 0,
				charge: 0
			}

		},
		// item 10
		{
			id: "hetr",
			name: "Tiny Radar Emitor",
			description: "RADAR! Small distance radar emitor in nice metal helm. Nothing more, nothing less.",
			price: 3,
			usage: Q.const.USAGE_HEAD,
			asset: "item-hetr.png",

			goodHeroes: [  ],
			badHeroes: [  ],

				bonusCapabilities: {
				speed: 0,
				damage: 0,
				reload: 0,
				range: 0,
				sight: 0,
				armor: 0,
				health: 0,
				energy: 0,
				repair: 0,
				charge: 0
			}

		},
		// item 11
		{
			id: "hspw",
			name: "Back-up Unit",
			description: "Memory cloud decrease spawn time of Hero.",
			price: 5,
			usage: Q.const.USAGE_HEAD,
			asset: "item-hspw.png",

			goodHeroes: [  ],
			badHeroes: [  ],

				bonusCapabilities: {
				speed: 0,
				damage: 0,
				reload: 0,
				range: 0,
				sight: 0,
				armor: 0,
				health: 0,
				energy: 0,
				repair: 0,
				charge: 0
			}

		},
		// item 12
		{
			id: "wdrl",
			name: "Dual realoder",
			description: "Upgrade which allows you to fire two times faster with worse aim.",
			price: 5,
			usage: Q.const.USAGE_HAND,
			asset: "item-wdrl.png",

			goodHeroes: [  ],
			badHeroes: [ "bug" ],

				bonusCapabilities: {
				speed: 0,
				damage: -1,
				reload: 5,
				range: 0,
				sight: 0,
				armor: 0,
				health: 0,
				energy: 0,
				repair: 0,
				charge: 0
			}

		},
		// item 13
		{
			id: "bbge",
			name: "Big Energy Storage",
			description: "Where others stop, we start. Bentoi battery for profi users.",
			price: 5,
			usage: Q.const.USAGE_BODY,
			asset: "item-bbge.png",

			goodHeroes: [  ],
			badHeroes: [ "bug" ],

				bonusCapabilities: {
				speed: 0,
				damage: 0,
				reload: 0,
				range: 0,
				sight: 0,
				armor: 0,
				health: 0,
				energy: 5,
				repair: 0,
				charge: 0
			}

		},
		// item 14
		{
			id: "bspd",
			name: "Pathing Unit",
			description: "Generaly improve speed, especially in steep places.",
			price: 3,
			usage: Q.const.USAGE_BODY,
			asset: "item-bspd.png",

			goodHeroes: [  ],
			badHeroes: [  ],

				bonusCapabilities: {
				speed: 1,
				damage: 0,
				reload: 0,
				range: 0,
				sight: 0,
				armor: 0,
				health: 0,
				energy: 0,
				repair: 0,
				charge: 0
			}


		},
		// item 15
		{
			id: "becl",
			name: "Cloak Emitor",
			description: "PREADOTOR mode! Mu ha ha ha ha!!!",
			price: 5,
			usage: Q.const.USAGE_BODY,
			asset: "item-becl.png",

			goodHeroes: [  ],
			badHeroes: [ "bulk" ],

				bonusCapabilities: {
				speed: 0,
				damage: 0,
				reload: 0,
				range: 0,
				sight: 0,
				armor: 0,
				health: 0,
				energy: 0,
				repair: 0,
				charge: -5
			}


		}


	];
	return items;
}
