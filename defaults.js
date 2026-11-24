// CakeCart built-in data (from the original spreadsheet). Your own edits are saved on your device.
const DEFAULTS = {
 "version": 3,
 "ingredients": {
  "Graham cracker crumbs": {
   "name": "Graham crackers",
   "unit": "g",
   "aisle": "Baking aisle",
   "pantry": false,
   "pkg": {
    "size": 408,
    "price": 4.72,
    "label": "Honey Maid graham crackers, 14.4 oz",
    "note": "Walmart Ponce, PR · Nov 22, 2026",
    "shown": "oz"
   }
  },
  "Sugar (white)": {
   "name": "Sugar (white)",
   "unit": "g",
   "aisle": "Baking aisle",
   "pantry": true,
   "pkg": {
    "size": 907,
    "price": 2.38,
    "label": "Dulce Caña cane sugar, 2 lb",
    "note": "Walmart Ponce, PR · Nov 22, 2026",
    "shown": "lb"
   }
  },
  "Brown sugar": {
   "name": "Brown sugar",
   "unit": "g",
   "aisle": "Baking aisle",
   "pantry": false,
   "pkg": {
    "size": 454,
    "price": 1.34,
    "label": "Great Value brown sugar, 1 lb",
    "note": "Walmart Ponce, PR · Nov 22, 2026",
    "shown": "oz"
   }
  },
  "Butter": {
   "name": "Butter",
   "unit": "g",
   "aisle": "Dairy & eggs",
   "pantry": false,
   "pkg": {
    "size": 227,
    "price": 5.94,
    "label": "Kerrygold 8 oz (2 sticks)",
    "note": "Walmart Ponce, PR · Nov 22, 2026",
    "shown": "oz"
   }
  },
  "Cream cheese (brick)": {
   "name": "Cream cheese (brick)",
   "unit": "g",
   "aisle": "Dairy & eggs",
   "pantry": false,
   "pkg": {
    "size": 2722,
    "price": 26.23,
    "label": "box of 12 × 8 oz bricks",
    "note": "Nov 22, 2026",
    "shown": "lb"
   }
  },
  "Sour cream": {
   "name": "Sour cream",
   "unit": "g",
   "aisle": "Dairy & eggs",
   "pantry": false,
   "pkg": {
    "size": 454,
    "price": 3.52,
    "label": "Daisy 16 oz tub",
    "note": "Walmart Ponce, PR · Nov 22, 2026",
    "shown": "oz"
   }
  },
  "Vanilla extract": {
   "name": "Vanilla extract",
   "unit": "ml",
   "aisle": "Baking aisle",
   "pantry": true,
   "pkg": {
    "size": 59,
    "price": 3.38,
    "label": "Especias Montero vanilla, 2 fl oz",
    "note": "Walmart Ponce, PR · Nov 22, 2026",
    "shown": "fl oz"
   }
  },
  "Salt": {
   "name": "Salt",
   "unit": "g",
   "aisle": "Spices",
   "pantry": true,
   "pkg": {
    "size": 737,
    "price": 1.26,
    "label": "26 oz container",
    "note": "Nov 22, 2026",
    "shown": "oz"
   },
   "tsp": 6
  },
  "Eggs (large)": {
   "name": "Eggs, large",
   "unit": "each",
   "aisle": "Dairy & eggs",
   "pantry": false,
   "pkg": {
    "size": 18,
    "price": 3,
    "label": "Great Value 18-count case",
    "note": "Walmart Ponce, PR · Nov 22, 2026",
    "shown": "each"
   }
  },
  "Pumpkin puree": {
   "name": "Pumpkin puree",
   "unit": "g",
   "aisle": "Baking aisle",
   "pantry": false,
   "pkg": {
    "size": 425,
    "price": 2.37,
    "label": "15 oz can",
    "note": "Nov 22, 2026",
    "shown": "oz"
   }
  },
  "Pumpkin pie spice": {
   "name": "Pumpkin pie spice",
   "unit": "g",
   "aisle": "Spices",
   "pantry": true,
   "pkg": {
    "size": 56.7,
    "price": 2.94,
    "label": "2 oz jar",
    "note": "Nov 22, 2026",
    "shown": "oz"
   },
   "tsp": 2.6
  },
  "Heavy cream": {
   "name": "Heavy cream",
   "unit": "ml",
   "aisle": "Dairy & eggs",
   "pantry": false,
   "pkg": {
    "size": 946,
    "price": 4.57,
    "label": "Country Crock dairy-free whipping, 32 fl oz",
    "note": "Walmart Ponce, PR · Nov 22, 2026",
    "hint": "Carton size assumed 32 fl oz; check the carton.",
    "shown": "fl oz"
   }
  },
  "Powdered sugar": {
   "name": "Powdered sugar",
   "unit": "g",
   "aisle": "Baking aisle",
   "pantry": false,
   "pkg": {
    "size": 454,
    "price": 2.28,
    "label": "Domino powdered sugar, 1 lb",
    "note": "Walmart Ponce, PR · Nov 22, 2026",
    "shown": "oz"
   }
  },
  "Ground cinnamon": {
   "name": "Ground cinnamon",
   "unit": "g",
   "aisle": "Spices",
   "pantry": true,
   "pkg": {
    "size": 70.9,
    "price": 1.54,
    "label": "2.5 oz jar",
    "note": "Nov 22, 2026",
    "shown": "oz"
   },
   "tsp": 2.6
  },
  "Strawberries": {
   "name": "Strawberries",
   "unit": "g",
   "aisle": "Produce",
   "pantry": false,
   "pkg": {
    "size": 454,
    "price": 2.66,
    "label": "Great Value frozen strawberries, 16 oz",
    "note": "Walmart Ponce, PR · Nov 22, 2026",
    "shown": "oz"
   }
  },
  "Cornstarch": {
   "name": "Cornstarch",
   "unit": "g",
   "aisle": "Baking aisle",
   "pantry": true,
   "pkg": {
    "size": 454,
    "price": 2.38,
    "label": "16 oz box",
    "note": "Nov 22, 2026",
    "shown": "oz"
   },
   "tsp": 2.7
  },
  "Lemon juice": {
   "name": "Lemons (juice)",
   "unit": "ml",
   "aisle": "Produce",
   "pantry": false,
   "pkg": {
    "size": 240,
    "price": 3.97,
    "label": "2 lb bag of lemons",
    "note": "Nov 22, 2026",
    "hint": "Bag of lemons ≈ 240 ml juice (about 7 lemons). Juice a bag once and update.",
    "shown": "ml"
   }
  },
  "Oreo cookies": {
   "name": "Oreo cookies",
   "unit": "each",
   "aisle": "Cookies, spreads & coffee",
   "pantry": false,
   "hint": "count the cookies in the pack"
  },
  "Peanut butter (creamy)": {
   "name": "Peanut butter (creamy)",
   "unit": "g",
   "aisle": "Cookies, spreads & coffee",
   "pantry": false
  },
  "Semisweet/dark chocolate": {
   "name": "Semisweet/dark chocolate",
   "unit": "g",
   "aisle": "Baking aisle",
   "pantry": false,
   "hint": "bar weight"
  },
  "Flour (all-purpose)": {
   "name": "Flour (all-purpose)",
   "unit": "g",
   "aisle": "Baking aisle",
   "pantry": true,
   "pkg": {
    "size": 2268,
    "price": 2.38,
    "label": "5 lb bag of flour",
    "note": "Nov 22, 2026",
    "shown": "lb"
   }
  },
  "Milk": {
   "name": "Milk",
   "unit": "ml",
   "aisle": "Dairy & eggs",
   "pantry": true,
   "pkg": {
    "size": 1890,
    "price": 6.86,
    "label": "½ gallon",
    "note": "Nov 22, 2026",
    "shown": "ml"
   }
  },
  "Raspberries": {
   "name": "Raspberries",
   "unit": "g",
   "aisle": "Produce",
   "pantry": false
  },
  "Key lime juice": {
   "name": "Key lime juice",
   "unit": "ml",
   "aisle": "Produce",
   "pantry": false
  },
  "Pecans": {
   "name": "Pecans",
   "unit": "g",
   "aisle": "Baking aisle",
   "pantry": false
  },
  "Caramel sauce": {
   "name": "Caramel sauce",
   "unit": "ml",
   "aisle": "Homemade",
   "pantry": false,
   "madeFrom": "Caramel Sauce"
  },
  "Flaky sea salt": {
   "name": "Flaky sea salt",
   "unit": "g",
   "aisle": "Spices",
   "pantry": true,
   "tsp": 2
  },
  "Light corn syrup": {
   "name": "Light corn syrup",
   "unit": "ml",
   "aisle": "Baking aisle",
   "pantry": false
  },
  "Apples": {
   "name": "Apples",
   "unit": "g",
   "aisle": "Produce",
   "pantry": false
  },
  "Old fashioned oats": {
   "name": "Old fashioned oats",
   "unit": "g",
   "aisle": "Baking aisle",
   "pantry": false
  },
  "Baking soda": {
   "name": "Baking soda",
   "unit": "g",
   "aisle": "Baking aisle",
   "pantry": true,
   "tsp": 4.8
  },
  "Walnuts": {
   "name": "Walnuts",
   "unit": "g",
   "aisle": "Baking aisle",
   "pantry": false
  },
  "Blueberries": {
   "name": "Blueberries",
   "unit": "g",
   "aisle": "Produce",
   "pantry": false
  },
  "Cocoa powder (unsweetened)": {
   "name": "Cocoa powder (unsweetened)",
   "unit": "g",
   "aisle": "Baking aisle",
   "pantry": false
  },
  "Instant coffee": {
   "name": "Instant coffee",
   "unit": "g",
   "aisle": "Cookies, spreads & coffee",
   "pantry": true,
   "tsp": 2
  },
  "Chocolate chips (semisweet)": {
   "name": "Chocolate chips (semisweet)",
   "unit": "g",
   "aisle": "Baking aisle",
   "pantry": false
  }
 },
 "recipes": {
  "Apple Pie Cheesecake": {
   "name": "Apple Pie Cheesecake",
   "desc": "Spiced apples and an oat crumble",
   "cat": "Cheesecakes",
   "look": [
    "#FBEBD9",
    "#C98A4B",
    "#F5DFA9",
    "#B9783F"
   ],
   "sections": [
    {
     "title": "Apple Filling",
     "items": [
      {
       "ing": "Apples",
       "amt": 907,
       "note": "2 lbs (907 g), peeled, cored, chopped"
      },
      {
       "ing": "Brown sugar",
       "amt": 133,
       "note": "⅔ cup (133 g) light brown, packed"
      },
      {
       "ing": "Butter",
       "amt": 30,
       "note": "2 Tablespoons (30 g), unsalted"
      },
      {
       "ing": "Cornstarch",
       "amt": 5.3,
       "note": "2 teaspoons"
      },
      {
       "ing": "Ground cinnamon",
       "amt": 1.3,
       "note": "½ teaspoon"
      },
      {
       "ing": "Salt",
       "amt": 0.7,
       "note": "⅛ teaspoon"
      },
      {
       "ing": "Vanilla extract",
       "amt": 2.5,
       "note": "½ teaspoon"
      }
     ]
    },
    {
     "title": "Crumble Topping",
     "items": [
      {
       "ing": "Old fashioned oats",
       "amt": 40,
       "note": "½ cup (40 g)"
      },
      {
       "ing": "Flour (all-purpose)",
       "amt": 41,
       "note": "⅓ cup (41 g)"
      },
      {
       "ing": "Brown sugar",
       "amt": 50,
       "note": "¼ cup (50 g) light brown"
      },
      {
       "ing": "Baking soda",
       "amt": 1.2,
       "note": "¼ teaspoon"
      },
      {
       "ing": "Ground cinnamon",
       "amt": 0.65,
       "note": "¼ teaspoon"
      },
      {
       "ing": "Salt",
       "amt": 1.5,
       "note": "¼ teaspoon"
      },
      {
       "ing": "Butter",
       "amt": 57,
       "note": "4 Tablespoons (57 g), unsalted, melted"
      }
     ]
    },
    {
     "title": "Graham Walnut Crust",
     "items": [
      {
       "ing": "Graham cracker crumbs",
       "amt": 170,
       "note": "1 ½ cups (170 g)"
      },
      {
       "ing": "Walnuts",
       "amt": 40,
       "note": "⅓ cup (40 g), finely chopped (optional)"
      },
      {
       "ing": "Sugar (white)",
       "amt": 25,
       "note": "2 Tablespoons granulated"
      },
      {
       "ing": "Brown sugar",
       "amt": 13,
       "note": "1 Tablespoon light brown, packed"
      },
      {
       "ing": "Butter",
       "amt": 98,
       "note": "7 Tablespoons (98 g), salted, melted"
      }
     ]
    },
    {
     "title": "Cheesecake Batter",
     "items": [
      {
       "ing": "Cream cheese (brick)",
       "amt": 680,
       "note": "24 oz (680 g), brick-style full-fat"
      },
      {
       "ing": "Sugar (white)",
       "amt": 200,
       "note": "1 cup (200 g)"
      },
      {
       "ing": "Sour cream",
       "amt": 120,
       "note": "½ cup (120 g)"
      },
      {
       "ing": "Vanilla extract",
       "amt": 5,
       "note": "1 teaspoon"
      },
      {
       "ing": "Eggs (large)",
       "amt": 3,
       "note": "3 large, room temp"
      }
     ]
    }
   ],
   "per": "cheesecake",
   "size": "9\" cheesecake",
   "pieces": 12,
   "piece": "slice",
   "markup": 3,
   "packaging": 0,
   "source": "https://sugarspunrun.com/apple-pie-cheesecake/",
   "steps": [
    {
     "t": "Apple filling: put the chopped apples, brown sugar, butter, cornstarch, cinnamon and salt in a saucepan over medium-low and stir until the butter melts."
    },
    {
     "t": "Turn up to medium, bring to a simmer and cook until slightly thick and the apples are fork-tender.",
     "min": 5
    },
    {
     "t": "Off the heat, stir in the vanilla. Move to a heatproof bowl to cool (the fridge speeds it up; stir now and then)."
    },
    {
     "t": "Crumble: mix the oats, flour, brown sugar, baking soda, cinnamon and salt, then fork in the melted butter. Leave it clumpy and set aside."
    },
    {
     "t": "Heat the oven to 325°F (160°C). Crust: mix the graham crumbs, walnuts and both sugars, stir in the melted butter, and press over the bottom and up the sides of a 9\" springform pan."
    },
    {
     "t": "Batter: beat the cream cheese and sugar on medium-low until completely smooth, scraping the bowl."
    },
    {
     "t": "On low, mix in the sour cream and vanilla. Then add the lightly beaten eggs one at a time, mixing just until each disappears. Scrape well."
    },
    {
     "t": "Assemble: half the batter in the crust, then half the apples (lifted out with a slotted spoon so the juice stays behind), the rest of the batter, the rest of the apples, and the crumble scattered on top."
    },
    {
     "t": "Set the pan on a foil-lined baking sheet, center rack. Bake until the edges are mostly set and the center jiggles like gelatin (60–70 min; dark pans bake faster).",
     "min": 60
    },
    {
     "t": "Cool to room temperature somewhere warm and draft-free, or turn the oven off, prop the door open a few inches and leave it about an hour.",
     "min": 60
    },
    {
     "t": "Chill at least 6 hours, ideally overnight, before slicing.",
     "min": 360
    }
   ]
  },
  "Blueberry Cheesecake": {
   "name": "Blueberry Cheesecake",
   "desc": "Blueberries baked in, blueberry topping",
   "cat": "Cheesecakes",
   "look": [
    "#ECE8F7",
    "#4A3A8C",
    "#F8E8C4",
    "#C08548",
    "#6A59B8"
   ],
   "sections": [
    {
     "title": "Graham Cracker Crust",
     "items": [
      {
       "ing": "Graham cracker crumbs",
       "amt": 170,
       "note": "1 ½ cups (170 g)"
      },
      {
       "ing": "Sugar (white)",
       "amt": 25,
       "note": "2 Tablespoons granulated"
      },
      {
       "ing": "Brown sugar",
       "amt": 13,
       "note": "1 Tablespoon light brown, packed"
      },
      {
       "ing": "Butter",
       "amt": 74,
       "note": "5 Tablespoons (74 g), unsalted, melted"
      }
     ]
    },
    {
     "title": "Blueberry Cheesecake Filling",
     "items": [
      {
       "ing": "Cream cheese (brick)",
       "amt": 680,
       "note": "24 oz (680 g), full-fat brick-style"
      },
      {
       "ing": "Sugar (white)",
       "amt": 150,
       "note": "¾ cup (150 g)"
      },
      {
       "ing": "Sour cream",
       "amt": 120,
       "note": "½ cup (120 g)"
      },
      {
       "ing": "Vanilla extract",
       "amt": 5,
       "note": "1 teaspoon"
      },
      {
       "ing": "Eggs (large)",
       "amt": 3,
       "note": "3 large, lightly beaten"
      },
      {
       "ing": "Blueberries",
       "amt": 311,
       "note": "2 cups (311 g), fresh"
      }
     ]
    },
    {
     "title": "Blueberry Topping",
     "items": [
      {
       "ing": "Sugar (white)",
       "amt": 50,
       "note": "¼ cup (50 g) granulated"
      },
      {
       "ing": "Cornstarch",
       "amt": 8,
       "note": "1 Tablespoon"
      },
      {
       "ing": "Blueberries",
       "amt": 465,
       "note": "3 cups (465 g), fresh, divided"
      },
      {
       "ing": "Lemon juice",
       "amt": 15,
       "note": "1 Tablespoon"
      },
      {
       "ing": "Butter",
       "amt": 14,
       "note": "1 Tablespoon, salted or unsalted"
      }
     ]
    }
   ],
   "per": "cheesecake",
   "size": "9\" cheesecake",
   "pieces": 12,
   "piece": "slice",
   "markup": 3,
   "packaging": 0,
   "source": "https://sugarspunrun.com/?p=40001",
   "steps": [
    {
     "t": "Heat the oven to 325°F (160°C). Crust: mix the graham crumbs with both sugars, stir in the melted butter, and press over the bottom and up the sides of a 9\" springform pan."
    },
    {
     "t": "Beat the cream cheese and sugar on medium-low until smooth."
    },
    {
     "t": "Stir in the sour cream and vanilla, then the lightly beaten eggs one at a time, mixing just until each is combined."
    },
    {
     "t": "Last, gently fold in the 2 cups of fresh blueberries with a spatula, then pour into the crust."
    },
    {
     "t": "Bake until the center is set but still slightly jiggly (45–50 min).",
     "min": 45
    },
    {
     "t": "Cool until no longer warm, then chill at least 6 hours.",
     "min": 360
    },
    {
     "t": "Topping (any time up to an hour before serving): whisk the sugar and cornstarch in a saucepan, add 1½ cups of the blueberries, the cold water and lemon juice, and cook on medium-low, stirring, until the berries release their juice."
    },
    {
     "t": "Off the heat, stir in the remaining blueberries and the butter. Cover and refrigerate until completely cool."
    },
    {
     "t": "Spoon the cooled topping over the set cheesecake, slice and serve."
    }
   ]
  },
  "Caramel Sauce": {
   "name": "Caramel Sauce",
   "desc": "Homemade caramel for Turtle and Salted Caramel",
   "cat": "Homemade",
   "look": [
    "#FBEAD6",
    "#C77B30",
    "#E9A65A",
    "#C77B30"
   ],
   "sections": [
    {
     "title": "Caramel",
     "items": [
      {
       "ing": "Sugar (white)",
       "amt": 200,
       "note": "1 cup (200 g) granulated"
      },
      {
       "ing": "Light corn syrup",
       "amt": 30,
       "note": "2 Tablespoons"
      },
      {
       "ing": "Salt",
       "amt": 3,
       "note": "½ teaspoon (salted version)"
      },
      {
       "ing": "Heavy cream",
       "amt": 120,
       "note": "½ cup (120 ml)"
      },
      {
       "ing": "Butter",
       "amt": 42,
       "note": "3 Tablespoons (42 g), unsalted"
      },
      {
       "ing": "Vanilla extract",
       "amt": 7.5,
       "note": "1 ½ teaspoons"
      }
     ]
    }
   ],
   "sub": true,
   "yield": 236,
   "yieldUnit": "ml",
   "source": "https://sugarspunrun.com/how-to-make-caramel-sauce/",
   "steps": [
    {
     "t": "Put the sugar, water, corn syrup and salt in a small saucepan on medium-low and stir now and then until the sugar dissolves. Brush any crystals off the sides with a wet pastry brush."
    },
    {
     "t": "Once dissolved, stop stirring. Let it cook (swirl the pan if it browns unevenly) until it turns amber, about 15 minutes. Go by color, not a thermometer.",
     "min": 15
    },
    {
     "t": "Off the heat, slowly pour in the cream while stirring. Careful: it bubbles up hard."
    },
    {
     "t": "Stir in the butter one piece at a time until smooth, then the vanilla."
    },
    {
     "t": "Let it cool before using. Don't touch it until it has cooled; melted sugar is very hot."
    }
   ]
  },
  "Cheesecake Brownies": {
   "name": "Cheesecake Brownies",
   "desc": "Fudgy brownies with a cheesecake layer",
   "cat": "Brownies",
   "look": [
    "#F3E6DE",
    "#F8EBCF",
    "#5A3424",
    "#3D2117"
   ],
   "sections": [
    {
     "title": "Brownies",
     "items": [
      {
       "ing": "Butter",
       "amt": 170,
       "note": "12 Tablespoons (170 g), unsalted"
      },
      {
       "ing": "Semisweet/dark chocolate",
       "amt": 113,
       "note": "4 oz (113 g) baking bar, chopped"
      },
      {
       "ing": "Cocoa powder (unsweetened)",
       "amt": 50,
       "note": "½ cup (50 g) natural"
      },
      {
       "ing": "Instant coffee",
       "amt": 1,
       "note": "½ teaspoon (optional)"
      },
      {
       "ing": "Sugar (white)",
       "amt": 200,
       "note": "1 cup (200 g) granulated"
      },
      {
       "ing": "Brown sugar",
       "amt": 100,
       "note": "½ cup (100 g) light brown, packed"
      },
      {
       "ing": "Eggs (large)",
       "amt": 2,
       "note": "2 large, room temp"
      },
      {
       "ing": "Vanilla extract",
       "amt": 5,
       "note": "1 teaspoon"
      },
      {
       "ing": "Salt",
       "amt": 3,
       "note": "½ teaspoon"
      },
      {
       "ing": "Flour (all-purpose)",
       "amt": 125,
       "note": "1 cup (125 g)"
      },
      {
       "ing": "Chocolate chips (semisweet)",
       "amt": 150,
       "note": "¾ cup (150 g) (optional)"
      }
     ]
    },
    {
     "title": "Cheesecake Layer",
     "items": [
      {
       "ing": "Cream cheese (brick)",
       "amt": 453,
       "note": "16 oz (453 g), brick-style full-fat"
      },
      {
       "ing": "Sugar (white)",
       "amt": 100,
       "note": "½ cup (100 g)"
      },
      {
       "ing": "Sour cream",
       "amt": 65,
       "note": "¼ cup (65 g) full-fat"
      },
      {
       "ing": "Eggs (large)",
       "amt": 2,
       "note": "2 large, lightly beaten"
      },
      {
       "ing": "Vanilla extract",
       "amt": 2.5,
       "note": "½ teaspoon"
      }
     ]
    }
   ],
   "per": "pan",
   "size": "9×13 pan",
   "pieces": 24,
   "piece": "brownie",
   "markup": 3,
   "packaging": 0,
   "source": "https://sugarspunrun.com/cheesecake-brownies/",
   "steps": [
    {
     "t": "Heat the oven to 350°F (175°C). Line the pan with parchment, leaving some hanging over two sides. (The original recipe uses a 9×9\" pan.)"
    },
    {
     "t": "Melt the chopped chocolate and butter together in the microwave in short bursts (about 25 seconds), stirring until smooth."
    },
    {
     "t": "Right away, stir in the cocoa powder and the instant coffee if using. Then stir in both sugars."
    },
    {
     "t": "Stir in the eggs and vanilla well, then the salt and flour just until combined. Add chocolate chips if using."
    },
    {
     "t": "Spread in the pan and bake just until the top starts to set. They won't be done yet.",
     "min": 14
    },
    {
     "t": "While they bake: beat the cream cheese and sugar until completely smooth, then mix in the sour cream, then the eggs and vanilla."
    },
    {
     "t": "Pour the cheesecake layer evenly over the hot brownies and bake again until set with a slightly jiggly center (25–28 min; edges may puff or turn lightly golden).",
     "min": 25
    },
    {
     "t": "Cool at room temperature until no longer warm."
    },
    {
     "t": "Chill 3–4 hours, then lift out with the parchment and slice.",
     "min": 180
    }
   ]
  },
  "Chocolate Cheesecake": {
   "name": "Chocolate Cheesecake",
   "desc": "Dark chocolate on an Oreo crust",
   "cat": "Cheesecakes",
   "look": [
    "#F1E4DE",
    "#4A2A1F",
    "#7A4A35",
    "#2B1B16"
   ],
   "sections": [
    {
     "title": "Oreo Crust",
     "items": [
      {
       "ing": "Butter",
       "amt": 57,
       "note": "4 Tablespoons, melted"
      },
      {
       "ing": "Oreo cookies",
       "amt": 25,
       "note": "25 Oreos"
      }
     ]
    },
    {
     "title": "Chocolate Cheesecake Filling",
     "items": [
      {
       "ing": "Semisweet/dark chocolate",
       "amt": 285,
       "note": "10 oz (285 g) dark chocolate"
      },
      {
       "ing": "Cream cheese (brick)",
       "amt": 907,
       "note": "32 oz (907 g), room temp"
      },
      {
       "ing": "Sugar (white)",
       "amt": 266,
       "note": "1 ⅓ cup (266 g) granulated"
      },
      {
       "ing": "Vanilla extract",
       "amt": 7.5,
       "note": "1 ½ teaspoons"
      },
      {
       "ing": "Sour cream",
       "amt": 160,
       "note": "⅔ cup (160 g), room temp"
      },
      {
       "ing": "Eggs (large)",
       "amt": 4,
       "note": "4 large, lightly beaten"
      }
     ]
    }
   ],
   "per": "cheesecake",
   "size": "9\" cheesecake",
   "pieces": 12,
   "piece": "slice",
   "markup": 3,
   "packaging": 0,
   "source": "https://sugarspunrun.com/chocolate-cheesecake/",
   "steps": [
    {
     "t": "Heat the oven to 325°F (160°C) and wrap the outside of a 9\" springform pan in foil."
    },
    {
     "t": "Crust: grind the 25 Oreos (filling and all) to fine crumbs, stir in the melted butter, and press over the bottom and partway up the sides."
    },
    {
     "t": "Melt the chopped dark chocolate in the microwave (30 seconds, then 15-second bursts), stirring until smooth. Let it cool."
    },
    {
     "t": "Beat the cream cheese and sugar until smooth, then on low mix in the sour cream and vanilla."
    },
    {
     "t": "Check the chocolate is about room temperature (not hot, not setting up again) and drizzle it in on low until blended."
    },
    {
     "t": "Add the eggs one at a time, mixing only until each is combined. Scrape the bowl and give it a final slow stir."
    },
    {
     "t": "Spread the batter over the crust and set the pan on a baking sheet."
    },
    {
     "t": "Bake until the edges are set and the center is slightly jiggly but springs back when touched lightly (70–75 min). Don't overbake.",
     "min": 70
    },
    {
     "t": "Cool to room temperature, then chill at least 6 hours. Top with whipped cream if you like.",
     "min": 360
    }
   ]
  },
  "Cinnamon Roll Cheesecake": {
   "name": "Cinnamon Roll Cheesecake",
   "desc": "Cinnamon swirl, glaze and whipped cream",
   "cat": "Cheesecakes",
   "look": [
    "#FBEBD9",
    "#FFF6E8",
    "#F4D8A8",
    "#B9783F",
    "#A0612F"
   ],
   "sections": [
    {
     "title": "Graham Cracker Crust",
     "items": [
      {
       "ing": "Graham cracker crumbs",
       "amt": 170,
       "note": "1 ½ cups (170 g)"
      },
      {
       "ing": "Sugar (white)",
       "amt": 25,
       "note": "2 Tablespoons granulated"
      },
      {
       "ing": "Brown sugar",
       "amt": 13,
       "note": "1 Tablespoon light or dark"
      },
      {
       "ing": "Ground cinnamon",
       "amt": 1.3,
       "note": "½ teaspoon"
      },
      {
       "ing": "Butter",
       "amt": 100,
       "note": "7 Tablespoons (100 g), salted, melted"
      }
     ]
    },
    {
     "title": "Cheesecake Filling",
     "items": [
      {
       "ing": "Cream cheese (brick)",
       "amt": 678,
       "note": "24 oz (678 g), full-fat"
      },
      {
       "ing": "Sugar (white)",
       "amt": 150,
       "note": "¾ cup (150 g)"
      },
      {
       "ing": "Sour cream",
       "amt": 120,
       "note": "½ cup (120 g)"
      },
      {
       "ing": "Vanilla extract",
       "amt": 5,
       "note": "1 teaspoon"
      },
      {
       "ing": "Salt",
       "amt": 1.5,
       "note": "¼ teaspoon table salt"
      },
      {
       "ing": "Eggs (large)",
       "amt": 3,
       "note": "3 large, lightly beaten"
      }
     ]
    },
    {
     "title": "Cinnamon Swirl",
     "items": [
      {
       "ing": "Brown sugar",
       "amt": 200,
       "note": "1 cup (200 g), light or dark"
      },
      {
       "ing": "Flour (all-purpose)",
       "amt": 42,
       "note": "⅓ cup (42 g)"
      },
      {
       "ing": "Ground cinnamon",
       "amt": 10.4,
       "note": "4 teaspoons"
      },
      {
       "ing": "Butter",
       "amt": 70,
       "note": "5 Tablespoons (70 g), salted, melted"
      }
     ]
    },
    {
     "title": "Glaze",
     "items": [
      {
       "ing": "Powdered sugar",
       "amt": 62,
       "note": "½ cup (62 g)"
      },
      {
       "ing": "Vanilla extract",
       "amt": 0.6,
       "note": "⅛ teaspoon"
      },
      {
       "ing": "Milk",
       "amt": 12.5,
       "note": "2–3 teaspoons"
      }
     ]
    },
    {
     "title": "Whipped Cream",
     "items": [
      {
       "ing": "Heavy cream",
       "amt": 180,
       "note": "¾ cup (180 ml)"
      },
      {
       "ing": "Powdered sugar",
       "amt": 30,
       "note": "¼ cup (30 g)"
      },
      {
       "ing": "Vanilla extract",
       "amt": 2.5,
       "note": "½ teaspoon"
      }
     ]
    },
    {
     "title": "Cinnamon Sugar",
     "items": [
      {
       "ing": "Sugar (white)",
       "amt": 6,
       "note": "1 ½ teaspoons granulated"
      },
      {
       "ing": "Ground cinnamon",
       "amt": 0.65,
       "note": "¼ teaspoon"
      }
     ]
    }
   ],
   "per": "cheesecake",
   "size": "9\" cheesecake",
   "pieces": 12,
   "piece": "slice",
   "markup": 3,
   "packaging": 0,
   "source": "https://sugarspunrun.com/cinnamon-roll-cheesecake/",
   "steps": [
    {
     "t": "Heat the oven to 325°F (160°C). Crust: mix the graham crumbs, sugars and cinnamon, stir in the melted butter, and press over the bottom and up the sides of a 9\" springform pan."
    },
    {
     "t": "Cinnamon swirl: mix the flour, brown sugar, cinnamon and melted butter. Set aside ½ cup of it for the top."
    },
    {
     "t": "Batter: beat the cream cheese and sugar until smooth, stir in the sour cream, vanilla and salt, then add the eggs one at a time on low."
    },
    {
     "t": "Stir 2–3 Tbsp of the batter into the ½ cup of reserved cinnamon mixture until smooth and put it in a piping bag (or a bag with the corner snipped)."
    },
    {
     "t": "Assemble: half the plain batter in the crust, the cinnamon crumble sprinkled over it, the rest of the batter on top, then pipe the reserved cinnamon mixture over the surface in a spiral."
    },
    {
     "t": "Set on a foil-lined baking sheet and bake until the edges are set and the center still jiggles slightly (40–50 min).",
     "min": 40
    },
    {
     "t": "Turn the oven off, crack the door and leave it inside 1 hour. Then cool on the counter until mostly cool.",
     "min": 60
    },
    {
     "t": "Chill at least 6 hours, ideally overnight.",
     "min": 360
    },
    {
     "t": "Glaze: whisk the powdered sugar, vanilla and milk until it falls off the whisk in ribbons, and drizzle over the chilled cheesecake."
    },
    {
     "t": "Whipped cream: beat the cream, powdered sugar and vanilla to stiff peaks and pipe dollops around the edge with a star tip."
    },
    {
     "t": "Mix the 1½ tsp sugar with ¼ tsp cinnamon, sprinkle over the whipped cream, take off the ring and slice."
    }
   ]
  },
  "Key Lime Cheesecake": {
   "name": "Key Lime Cheesecake",
   "desc": "Tangy key lime curd on top",
   "cat": "Cheesecakes",
   "look": [
    "#EEF5DC",
    "#C9E08A",
    "#F3F0C4",
    "#C08548",
    "#7FB13A"
   ],
   "sections": [
    {
     "title": "Key Lime Curd",
     "items": [
      {
       "ing": "Key lime juice",
       "amt": 118,
       "note": "½ cup (118 ml)"
      },
      {
       "ing": "Eggs (large)",
       "amt": 3,
       "note": "3 large egg yolks (counted as 3 eggs)"
      },
      {
       "ing": "Sugar (white)",
       "amt": 50,
       "note": "¼ cup (50 g) granulated"
      },
      {
       "ing": "Salt",
       "amt": 1.5,
       "note": "¼ teaspoon table salt"
      },
      {
       "ing": "Butter",
       "amt": 28,
       "note": "2 Tablespoons, unsalted"
      }
     ]
    },
    {
     "title": "Graham Cracker Crust",
     "items": [
      {
       "ing": "Graham cracker crumbs",
       "amt": 170,
       "note": "1 ½ cups (170 g)"
      },
      {
       "ing": "Sugar (white)",
       "amt": 25,
       "note": "2 Tablespoons granulated"
      },
      {
       "ing": "Brown sugar",
       "amt": 13,
       "note": "1 Tablespoon light brown, packed"
      },
      {
       "ing": "Butter",
       "amt": 71,
       "note": "5 Tablespoons (71 g), unsalted, melted"
      }
     ]
    },
    {
     "title": "Cheesecake Filling",
     "items": [
      {
       "ing": "Cream cheese (brick)",
       "amt": 680,
       "note": "24 oz (680 g), room temp"
      },
      {
       "ing": "Sugar (white)",
       "amt": 200,
       "note": "1 cup (200 g)"
      },
      {
       "ing": "Sour cream",
       "amt": 60,
       "note": "¼ cup"
      },
      {
       "ing": "Eggs (large)",
       "amt": 2,
       "note": "2 large, lightly beaten"
      }
     ]
    }
   ],
   "per": "cheesecake",
   "size": "9\" cheesecake",
   "pieces": 12,
   "piece": "slice",
   "markup": 3,
   "packaging": 0,
   "source": "https://sugarspunrun.com/key-lime-cheesecake/",
   "steps": [
    {
     "t": "Curd: whisk the key lime juice, egg yolks, sugar and salt in a saucepan, add the butter, and set it on medium-low."
    },
    {
     "t": "Whisk constantly until slightly thicker and more opaque, just as it starts to bubble at the edges. Take it off the heat right away."
    },
    {
     "t": "Strain through a fine sieve into a heatproof bowl. Press paper onto the surface and cool completely (about 30 min in the fridge).",
     "min": 30
    },
    {
     "t": "Meanwhile, heat the oven to 325°F (160°C). Crust: mix the graham crumbs with both sugars, stir in the melted butter, and press over the bottom and up the sides of an ungreased 9\" springform pan."
    },
    {
     "t": "Batter: beat the cream cheese and sugar on medium-low until smooth, then mix in the sour cream and scrape the bowl."
    },
    {
     "t": "On low, mix in the cooled curd, then the eggs one at a time, mixing just until each is combined. Pour into the crust."
    },
    {
     "t": "Bake on the center rack until mostly set with a slight jiggle in the center (50–60 min).",
     "min": 50
    },
    {
     "t": "Cool to room temperature, about 1 hour.",
     "min": 60
    },
    {
     "t": "Chill at least 6 hours or overnight. Keep it in the pan until serving.",
     "min": 360
    }
   ]
  },
  "New York Cheesecake": {
   "name": "New York Cheesecake",
   "desc": "Tall and classic, sour cream topping",
   "cat": "Cheesecakes",
   "look": [
    "#FBF0DC",
    "#FFF8EC",
    "#F8E7B9",
    "#C08548"
   ],
   "sections": [
    {
     "title": "Graham Cracker Crust",
     "items": [
      {
       "ing": "Graham cracker crumbs",
       "amt": 170,
       "note": "1 ½ cups (170 g)"
      },
      {
       "ing": "Sugar (white)",
       "amt": 12.5,
       "note": "1 Tablespoon granulated"
      },
      {
       "ing": "Butter",
       "amt": 55,
       "note": "4 Tablespoons (55 g), unsalted, melted"
      }
     ]
    },
    {
     "title": "Cheesecake Filling",
     "items": [
      {
       "ing": "Cream cheese (brick)",
       "amt": 680,
       "note": "24 oz (recipe says 630 g; 24 oz = 680 g)"
      },
      {
       "ing": "Sugar (white)",
       "amt": 200,
       "note": "1 cup (200 g)"
      },
      {
       "ing": "Vanilla extract",
       "amt": 7.5,
       "note": "1 ½ teaspoons"
      },
      {
       "ing": "Salt",
       "amt": 0.7,
       "note": "⅛ teaspoon table salt"
      },
      {
       "ing": "Eggs (large)",
       "amt": 5,
       "note": "5 eggs, room temp"
      }
     ]
    },
    {
     "title": "Sour Cream Topping",
     "items": [
      {
       "ing": "Sour cream",
       "amt": 454,
       "note": "2 cups (454 g), 1 pint"
      },
      {
       "ing": "Sugar (white)",
       "amt": 200,
       "note": "1 cup (200 g)"
      },
      {
       "ing": "Vanilla extract",
       "amt": 7.5,
       "note": "1 ½ teaspoons"
      }
     ]
    }
   ],
   "per": "cheesecake",
   "size": "9\" cheesecake",
   "pieces": 12,
   "piece": "slice",
   "markup": 3,
   "packaging": 0,
   "source": "https://sugarspunrun.com/new-york-cheesecake-recipe/",
   "steps": [
    {
     "t": "Heat the oven to 300°F (150°C), lower than the others."
    },
    {
     "t": "Crust: mix the graham crumbs and sugar, fork in the melted butter, and press firmly over the bottom (and up the sides if you can) of a 9\" springform pan."
    },
    {
     "t": "Beat the cream cheese and sugar until smooth without overbeating. Scrape the bowl."
    },
    {
     "t": "Mix in the vanilla and salt, then on low add the 5 lightly beaten eggs one at a time, just until each disappears. Scrape again."
    },
    {
     "t": "Pour into the crust and set on a lined baking sheet on the center rack. Bake until the edges are set and the center still jiggles (60–70 min).",
     "min": 60
    },
    {
     "t": "Take it out but leave the oven on. Let it rest on the counter for 5 minutes.",
     "min": 5
    },
    {
     "t": "Topping: beat the sour cream, sugar and vanilla until smooth and pour evenly over the cheesecake."
    },
    {
     "t": "Back into the 300°F oven briefly.",
     "min": 5
    },
    {
     "t": "Cool at room temperature at least 1 hour.",
     "min": 60
    },
    {
     "t": "Chill overnight, or at least 6 hours.",
     "min": 360
    }
   ]
  },
  "Oreo Cheesecake": {
   "name": "Oreo Cheesecake",
   "desc": "Cookies and cream with ganache",
   "cat": "Cheesecakes",
   "look": [
    "#EFEDEB",
    "#3A2B2B",
    "#F2EFEA",
    "#2B2222",
    "#3A2B2B"
   ],
   "sections": [
    {
     "title": "Oreo Crust",
     "items": [
      {
       "ing": "Oreo cookies",
       "amt": 35,
       "note": "35 cookies"
      },
      {
       "ing": "Butter",
       "amt": 75,
       "note": "5 Tablespoons (75 g), unsalted, melted"
      }
     ]
    },
    {
     "title": "Cheesecake Filling",
     "items": [
      {
       "ing": "Oreo cookies",
       "amt": 15,
       "note": "15 cookies"
      },
      {
       "ing": "Cream cheese (brick)",
       "amt": 907,
       "note": "32 oz (907 g), full-fat brick-style"
      },
      {
       "ing": "Sugar (white)",
       "amt": 200,
       "note": "1 cup (200 g)"
      },
      {
       "ing": "Sour cream",
       "amt": 180,
       "note": "¾ cup (180 g)"
      },
      {
       "ing": "Vanilla extract",
       "amt": 5,
       "note": "1 teaspoon"
      },
      {
       "ing": "Eggs (large)",
       "amt": 4,
       "note": "4 large, lightly beaten"
      }
     ]
    },
    {
     "title": "Ganache (optional)",
     "items": [
      {
       "ing": "Semisweet/dark chocolate",
       "amt": 85,
       "note": "3 oz (85 g), chips or chopped bar"
      },
      {
       "ing": "Heavy cream",
       "amt": 118,
       "note": "½ cup (118 ml)"
      }
     ]
    }
   ],
   "per": "cheesecake",
   "size": "9\" cheesecake",
   "pieces": 12,
   "piece": "slice",
   "markup": 3,
   "packaging": 0,
   "source": "https://sugarspunrun.com/oreo-cheesecake/",
   "steps": [
    {
     "t": "Heat the oven to 325°F (160°C)."
    },
    {
     "t": "Crust: twist apart the 35 Oreos and scrape out the filling. Grind the cookies to fine crumbs, mix with the melted butter, and press over the bottom and as high up the sides of a 9\" springform pan as you can."
    },
    {
     "t": "Crush the other 15 Oreos into rough pieces in a zip bag and set aside."
    },
    {
     "t": "Beat the cream cheese and sugar on medium-low until smooth, then on low stir in the sour cream and vanilla."
    },
    {
     "t": "Add the eggs one at a time, just until combined. Fold in the Oreo pieces and smooth into the crust."
    },
    {
     "t": "Set on a foil-lined baking sheet, center rack. Bake until set, lightly springy, with only a slight gelatin-like jiggle (50–60 min).",
     "min": 50
    },
    {
     "t": "Loosen any filling stuck to the pan sides above the crust. Cool about 1 hour at room temperature.",
     "min": 60
    },
    {
     "t": "Chill at least 6 hours, ideally overnight.",
     "min": 360
    },
    {
     "t": "Ganache (optional): heat the cream to a bare simmer, pour over the chopped chocolate, cover and wait 5 minutes.",
     "min": 5
    },
    {
     "t": "Whisk smooth, pour over the cheesecake and chill until set. Add whipped cream if you like.",
     "min": 20
    }
   ]
  },
  "Peanut Butter Cheesecake": {
   "name": "Peanut Butter Cheesecake",
   "desc": "Peanut butter, Oreo crust, ganache",
   "cat": "Cheesecakes",
   "look": [
    "#F7E8D5",
    "#4A2A1F",
    "#E7B979",
    "#2B2222"
   ],
   "sections": [
    {
     "title": "Oreo Crust",
     "items": [
      {
       "ing": "Oreo cookies",
       "amt": 35,
       "note": "35 cookies"
      },
      {
       "ing": "Butter",
       "amt": 75,
       "note": "5 Tablespoons (75 g), unsalted, melted"
      }
     ]
    },
    {
     "title": "Cheesecake Filling",
     "items": [
      {
       "ing": "Cream cheese (brick)",
       "amt": 678,
       "note": "24 oz (678 g), room temp"
      },
      {
       "ing": "Peanut butter (creamy)",
       "amt": 280,
       "note": "1 cup (280 g)"
      },
      {
       "ing": "Sugar (white)",
       "amt": 250,
       "note": "1 ¼ cups (250 g)"
      },
      {
       "ing": "Sour cream",
       "amt": 120,
       "note": "½ cup (120 g)"
      },
      {
       "ing": "Vanilla extract",
       "amt": 10,
       "note": "2 teaspoons"
      },
      {
       "ing": "Eggs (large)",
       "amt": 3,
       "note": "3 large, lightly beaten"
      },
      {
       "ing": "Heavy cream",
       "amt": 30,
       "note": "2 Tablespoons"
      }
     ]
    },
    {
     "title": "Ganache",
     "items": [
      {
       "ing": "Semisweet/dark chocolate",
       "amt": 85,
       "note": "3 oz (85 g), finely chopped"
      },
      {
       "ing": "Heavy cream",
       "amt": 118,
       "note": "½ cup (118 ml)"
      }
     ]
    }
   ],
   "per": "cheesecake",
   "size": "9\" cheesecake",
   "pieces": 12,
   "piece": "slice",
   "markup": 3,
   "packaging": 0,
   "source": "https://sugarspunrun.com/peanut-butter-cheesecake/",
   "steps": [
    {
     "t": "Heat the oven to 325°F (160°C)."
    },
    {
     "t": "Crust: scrape the filling out of the 35 Oreos, grind the cookies fine, mix with the melted butter, and press over the bottom and up the sides of a 9\" springform pan."
    },
    {
     "t": "Beat the cream cheese until smooth. Add the peanut butter and sugar and beat on low until smooth."
    },
    {
     "t": "Stir in the sour cream and vanilla, then the lightly beaten eggs one at a time, briefly after each."
    },
    {
     "t": "Add the 2 Tbsp heavy cream and stir until smooth. Scrape the bottom and sides of the bowl."
    },
    {
     "t": "Pour into the crust and bake on the center rack until the edges are set (maybe a little puffed) and the center jiggles like gelatin.",
     "min": 50
    },
    {
     "t": "Cool until no longer warm, then chill at least 6 hours, ideally overnight.",
     "min": 360
    },
    {
     "t": "Ganache: microwave the chopped chocolate with the ½ cup cream for 25 seconds, stir, 25 more, and stir until smooth. Pour over the set cheesecake."
    },
    {
     "t": "Chill until the ganache sets, then take off the ring and slice. Top with whipped cream if you like.",
     "min": 20
    }
   ]
  },
  "Pumpkin Cheesecake": {
   "name": "Pumpkin Cheesecake",
   "desc": "Pumpkin spice with cinnamon cream",
   "cat": "Cheesecakes",
   "look": [
    "#FCE6D5",
    "#FFF6E8",
    "#E9944A",
    "#C08548"
   ],
   "sections": [
    {
     "title": "Graham Cracker Crust",
     "items": [
      {
       "ing": "Graham cracker crumbs",
       "amt": 170,
       "note": "1 ½ cups (170 g)"
      },
      {
       "ing": "Sugar (white)",
       "amt": 25,
       "note": "2 Tablespoons"
      },
      {
       "ing": "Brown sugar",
       "amt": 13,
       "note": "1 Tablespoon"
      },
      {
       "ing": "Butter",
       "amt": 99,
       "note": "7 Tablespoons, melted"
      }
     ]
    },
    {
     "title": "Pumpkin Filling",
     "items": [
      {
       "ing": "Cream cheese (brick)",
       "amt": 680,
       "note": "24 oz (680 g), brick-style"
      },
      {
       "ing": "Brown sugar",
       "amt": 150,
       "note": "¾ cup (150 g), packed"
      },
      {
       "ing": "Sugar (white)",
       "amt": 100,
       "note": "½ cup (100 g)"
      },
      {
       "ing": "Sour cream",
       "amt": 80,
       "note": "⅓ cup (80 g)"
      },
      {
       "ing": "Vanilla extract",
       "amt": 7.5,
       "note": "1 ½ teaspoons"
      },
      {
       "ing": "Pumpkin puree",
       "amt": 244,
       "note": "1 cup (244 g)"
      },
      {
       "ing": "Pumpkin pie spice",
       "amt": 6.5,
       "note": "2 ½ teaspoons"
      },
      {
       "ing": "Eggs (large)",
       "amt": 3,
       "note": "3 large, lightly beaten"
      }
     ]
    },
    {
     "title": "Cinnamon Whipped Cream",
     "items": [
      {
       "ing": "Heavy cream",
       "amt": 175,
       "note": "¾ cup (175 ml)"
      },
      {
       "ing": "Powdered sugar",
       "amt": 30,
       "note": "¼ cup (30 g)"
      },
      {
       "ing": "Vanilla extract",
       "amt": 2.5,
       "note": "½ teaspoon"
      },
      {
       "ing": "Ground cinnamon",
       "amt": 0.3,
       "note": "⅛ teaspoon"
      }
     ]
    }
   ],
   "per": "cheesecake",
   "size": "9\" cheesecake",
   "pieces": 12,
   "piece": "slice",
   "markup": 3,
   "packaging": 0,
   "source": "https://sugarspunrun.com/pumpkin-cheesecake/",
   "steps": [
    {
     "t": "Heat the oven to 350°F (175°C), hotter than the others."
    },
    {
     "t": "Press the graham cracker crust into a 9\" springform pan. Don't bake it; chill it while you make the filling."
    },
    {
     "t": "Beat the cream cheese with the brown and white sugar on medium for 1–2 minutes, scraping the sides."
    },
    {
     "t": "Mix in the sour cream, scraping the bottom and sides. Then add the vanilla, pumpkin puree and pumpkin pie spice and stir until even."
    },
    {
     "t": "Add the eggs one at a time, just until combined, scraping after each. Spread over the chilled crust."
    },
    {
     "t": "Bake until the center is set and springs back when touched.",
     "min": 40
    },
    {
     "t": "Cool to room temperature, then chill at least 6 hours or overnight.",
     "min": 360
    },
    {
     "t": "Just before serving, whip the cream, powdered sugar, vanilla and cinnamon (start slow, then high) to stiff peaks. Pipe or spoon onto the cheesecake and slice."
    }
   ]
  },
  "Raspberry Cheesecake": {
   "name": "Raspberry Cheesecake",
   "desc": "Swirled with raspberry sauce",
   "cat": "Cheesecakes",
   "look": [
    "#FBE3EA",
    "#D23C64",
    "#F8E7C8",
    "#C08548",
    "#C8324F"
   ],
   "sections": [
    {
     "title": "Raspberry Sauce",
     "items": [
      {
       "ing": "Raspberries",
       "amt": 340,
       "note": "12 oz (340 g), fresh or frozen"
      },
      {
       "ing": "Sugar (white)",
       "amt": 50,
       "note": "¼ cup (50 g) granulated"
      },
      {
       "ing": "Lemon juice",
       "amt": 15,
       "note": "1 Tablespoon"
      }
     ]
    },
    {
     "title": "Graham Cracker Crust",
     "items": [
      {
       "ing": "Graham cracker crumbs",
       "amt": 170,
       "note": "1 ½ cups (170 g)"
      },
      {
       "ing": "Sugar (white)",
       "amt": 25,
       "note": "2 Tablespoons (25 g) granulated"
      },
      {
       "ing": "Brown sugar",
       "amt": 13,
       "note": "1 Tablespoon light brown, packed"
      },
      {
       "ing": "Butter",
       "amt": 100,
       "note": "7 Tablespoons (100 g), unsalted, melted"
      }
     ]
    },
    {
     "title": "Cheesecake Filling",
     "items": [
      {
       "ing": "Cream cheese (brick)",
       "amt": 680,
       "note": "24 oz (680 g), brick-style full-fat"
      },
      {
       "ing": "Sugar (white)",
       "amt": 200,
       "note": "1 cup (200 g)"
      },
      {
       "ing": "Sour cream",
       "amt": 120,
       "note": "½ cup (120 g)"
      },
      {
       "ing": "Vanilla extract",
       "amt": 5,
       "note": "1 teaspoon"
      },
      {
       "ing": "Eggs (large)",
       "amt": 3,
       "note": "3 large, room temp"
      }
     ]
    }
   ],
   "per": "cheesecake",
   "size": "9\" cheesecake",
   "pieces": 12,
   "piece": "slice",
   "markup": 3,
   "packaging": 0,
   "source": "https://sugarspunrun.com/raspberry-cheesecake/",
   "steps": [
    {
     "t": "Sauce (up to 3 days ahead): simmer the raspberries, sugar, water and lemon juice on medium-low until the berries release their juice, then on medium until they break down and it thickens a little."
    },
    {
     "t": "Strain into a heatproof bowl, stir about 2 Tbsp of the seeds back in, and let it cool."
    },
    {
     "t": "Heat the oven to 325°F (160°C). Crust: mix the graham crumbs with both sugars and the melted butter and press over the bottom and up the sides of a 9\" springform pan."
    },
    {
     "t": "Beat the cream cheese and sugar until smooth, then on low mix in the sour cream and vanilla, then the lightly beaten eggs one at a time. Scrape the bowl."
    },
    {
     "t": "Layer: half the batter in the crust, about ⅓ cup sauce spread over it, the rest of the batter dolloped and smoothed on top, then another ⅓ cup sauce drizzled and swirled with a knife. Save the rest of the sauce."
    },
    {
     "t": "Bake on the center rack until mostly set with a jiggly center (45–55 min).",
     "min": 45
    },
    {
     "t": "Turn the oven off, crack the door a few inches and leave it inside 1 hour.",
     "min": 60
    },
    {
     "t": "Cool on the counter about 1 hour, until no longer warm.",
     "min": 60
    },
    {
     "t": "Chill at least 6 hours, ideally overnight. Serve with the saved sauce on top or on the side.",
     "min": 360
    }
   ]
  },
  "Regular Cheesecake": {
   "name": "Regular Cheesecake",
   "desc": "The classic, graham cracker crust",
   "cat": "Cheesecakes",
   "look": [
    "#FBF0DC",
    "#FFF8EC",
    "#F8E7B0",
    "#C08548"
   ],
   "sections": [
    {
     "title": "Graham Cracker Crust",
     "items": [
      {
       "ing": "Graham cracker crumbs",
       "amt": 170,
       "note": "1 ½ cups (170 g)"
      },
      {
       "ing": "Sugar (white)",
       "amt": 25,
       "note": "2 Tablespoons"
      },
      {
       "ing": "Brown sugar",
       "amt": 13,
       "note": "1 Tablespoon"
      },
      {
       "ing": "Butter",
       "amt": 99,
       "note": "7 Tablespoons, melted"
      }
     ]
    },
    {
     "title": "Cheesecake Filling",
     "items": [
      {
       "ing": "Cream cheese (brick)",
       "amt": 910,
       "note": "32 oz (910 g), room temp"
      },
      {
       "ing": "Sugar (white)",
       "amt": 200,
       "note": "1 cup (200 g)"
      },
      {
       "ing": "Sour cream",
       "amt": 160,
       "note": "⅔ cup (160 g)"
      },
      {
       "ing": "Vanilla extract",
       "amt": 7.5,
       "note": "1 ½ teaspoons"
      },
      {
       "ing": "Salt",
       "amt": 0.7,
       "note": "⅛ teaspoon"
      },
      {
       "ing": "Eggs (large)",
       "amt": 4,
       "note": "4 large, room temp"
      }
     ]
    }
   ],
   "per": "cheesecake",
   "size": "9\" cheesecake",
   "pieces": 12,
   "piece": "slice",
   "markup": 3,
   "packaging": 0,
   "source": "https://sugarspunrun.com/best-cheesecake-recipe/",
   "steps": [
    {
     "t": "Heat the oven to 325°F (160°C). Set the cream cheese, sour cream and eggs out so they're at room temperature."
    },
    {
     "t": "Crust: stir the graham cracker crumbs with both sugars, then mix in the melted butter with a fork."
    },
    {
     "t": "Press the crumbs firmly over the bottom and up the sides of a 9\" springform pan."
    },
    {
     "t": "Beat the cream cheese until smooth and creamy. Keep the mixer slow so you don't whip in air."
    },
    {
     "t": "Add the sugar and mix until creamy again."
    },
    {
     "t": "Add the sour cream, vanilla and salt. Mix, then scrape the bottom and sides of the bowl."
    },
    {
     "t": "On low speed, add the lightly beaten eggs one at a time, mixing only until each one disappears. Scrape the bowl once more."
    },
    {
     "t": "Pour the filling into the crust and set the pan on a foil-lined baking sheet to catch any leaks."
    },
    {
     "t": "Bake on the center rack. Don't open the oven before the first check at 50 minutes.",
     "min": 50
    },
    {
     "t": "Check: edges puffed (maybe lightly golden), center springs back but still jiggles like gelatin. Not there yet? Bake on, checking every 5–10 minutes (up to about 75 minutes total).",
     "min": 10
    },
    {
     "t": "Let it rest on the stovetop 10 minutes, then run a knife around the edge to free the crust. Leave the ring on.",
     "min": 10
    },
    {
     "t": "Cool until it's about room temperature, 1–2 hours.",
     "min": 90
    },
    {
     "t": "Chill at least 6 hours, ideally overnight. Take the ring off just before serving.",
     "min": 360
    }
   ]
  },
  "Salted Caramel Cheesecake": {
   "name": "Salted Caramel Cheesecake",
   "desc": "Caramel swirl and flaky sea salt",
   "cat": "Cheesecakes",
   "look": [
    "#FBEAD6",
    "#C77B30",
    "#F6E2B3",
    "#B9783F"
   ],
   "sections": [
    {
     "title": "Graham Pecan Crust",
     "items": [
      {
       "ing": "Graham cracker crumbs",
       "amt": 170,
       "note": "1 ½ cups (170 g)"
      },
      {
       "ing": "Pecans",
       "amt": 40,
       "note": "⅓ cup (40 g), finely chopped"
      },
      {
       "ing": "Sugar (white)",
       "amt": 25,
       "note": "2 tablespoons granulated"
      },
      {
       "ing": "Brown sugar",
       "amt": 13,
       "note": "1 tablespoon light brown, packed"
      },
      {
       "ing": "Butter",
       "amt": 99,
       "note": "7 tablespoons, salted, melted"
      }
     ]
    },
    {
     "title": "Cheesecake Filling",
     "items": [
      {
       "ing": "Cream cheese (brick)",
       "amt": 680,
       "note": "24 oz (680 g), brick-style full-fat"
      },
      {
       "ing": "Sugar (white)",
       "amt": 200,
       "note": "1 cup (200 g)"
      },
      {
       "ing": "Sour cream",
       "amt": 120,
       "note": "½ cup (120 g)"
      },
      {
       "ing": "Vanilla extract",
       "amt": 5,
       "note": "1 teaspoon"
      },
      {
       "ing": "Eggs (large)",
       "amt": 3,
       "note": "3 large, room temp"
      },
      {
       "ing": "Caramel sauce",
       "amt": 236,
       "note": "1 cup (236 ml), divided"
      },
      {
       "ing": "Flaky sea salt",
       "amt": 1,
       "note": "for sprinkling (optional)"
      }
     ]
    }
   ],
   "per": "cheesecake",
   "size": "9\" cheesecake",
   "pieces": 12,
   "piece": "slice",
   "markup": 3,
   "packaging": 0,
   "source": "https://sugarspunrun.com/salted-caramel-cheesecake/",
   "steps": [
    {
     "t": "Have the caramel sauce at room temperature. Heat the oven to 325°F (160°C)."
    },
    {
     "t": "Crust: mix the graham crumbs, chopped pecans and sugars, stir in the melted butter, and press over the bottom and up the sides of a 9\" springform pan."
    },
    {
     "t": "Beat the cream cheese and sugar on medium until smooth and lump-free."
    },
    {
     "t": "On low, mix in the sour cream and vanilla, then the lightly beaten eggs one at a time, just until combined. Scrape the bowl."
    },
    {
     "t": "Spread half the batter in the crust, drizzle ¼ cup caramel over it, then add the rest of the batter."
    },
    {
     "t": "Bake on the center rack until almost set: center jiggles like gelatin, edges maybe a little puffed (50–55 min).",
     "min": 50
    },
    {
     "t": "Turn the oven off, crack the door several inches and leave it inside 1 hour, then cool completely on the counter.",
     "min": 60
    },
    {
     "t": "Pour the remaining caramel (about ¾ cup) over the top and chill 6 hours or overnight.",
     "min": 360
    },
    {
     "t": "Take off the ring, sprinkle with flaky sea salt and slice."
    }
   ]
  },
  "Strawberry Cheesecake": {
   "name": "Strawberry Cheesecake",
   "desc": "Fresh strawberry sauce on top",
   "cat": "Cheesecakes",
   "look": [
    "#FCE4E6",
    "#E0485F",
    "#F8E7C8",
    "#C08548",
    "#E0485F"
   ],
   "sections": [
    {
     "title": "Graham Cracker Crust",
     "items": [
      {
       "ing": "Graham cracker crumbs",
       "amt": 170,
       "note": "1 ½ cups (170 g)"
      },
      {
       "ing": "Sugar (white)",
       "amt": 25,
       "note": "2 Tablespoons granulated"
      },
      {
       "ing": "Brown sugar",
       "amt": 13,
       "note": "1 Tablespoon light brown, packed"
      },
      {
       "ing": "Butter",
       "amt": 74,
       "note": "5 Tablespoons (74 g), unsalted, melted"
      }
     ]
    },
    {
     "title": "Cheesecake Filling",
     "items": [
      {
       "ing": "Cream cheese (brick)",
       "amt": 680,
       "note": "24 oz (680 g), full-fat"
      },
      {
       "ing": "Sugar (white)",
       "amt": 200,
       "note": "1 cup (200 g)"
      },
      {
       "ing": "Sour cream",
       "amt": 120,
       "note": "½ cup"
      },
      {
       "ing": "Vanilla extract",
       "amt": 5,
       "note": "1 teaspoon"
      },
      {
       "ing": "Eggs (large)",
       "amt": 3,
       "note": "3 large, lightly beaten"
      }
     ]
    },
    {
     "title": "Strawberry Topping",
     "items": [
      {
       "ing": "Strawberries",
       "amt": 680,
       "note": "1 ½ lb, fresh or frozen"
      },
      {
       "ing": "Sugar (white)",
       "amt": 50,
       "note": "¼ cup (50 g)"
      },
      {
       "ing": "Cornstarch",
       "amt": 12,
       "note": "1 ½ Tablespoons"
      },
      {
       "ing": "Lemon juice",
       "amt": 15,
       "note": "1 Tablespoon"
      },
      {
       "ing": "Butter",
       "amt": 14,
       "note": "1 Tablespoon, salted or unsalted"
      }
     ]
    }
   ],
   "per": "cheesecake",
   "size": "9\" cheesecake",
   "pieces": 12,
   "piece": "slice",
   "markup": 3,
   "packaging": 0,
   "source": "https://sugarspunrun.com/strawberry-cheesecake-recipe/",
   "steps": [
    {
     "t": "Heat the oven to 325°F (160°C). Crust: mix the graham crumbs with both sugars, stir in the melted butter, and press over the bottom and up the sides of a 9\" springform pan (the bottom of a glass helps)."
    },
    {
     "t": "Beat the cream cheese and sugar on medium-low until smooth, scraping the bowl."
    },
    {
     "t": "Stir in the sour cream and vanilla just until combined, then the eggs one at a time, mixing only until each is combined. Pour into the crust."
    },
    {
     "t": "Bake until mostly set with a slightly jiggly center (45–50 min).",
     "min": 45
    },
    {
     "t": "Cool until no longer warm, then chill at least 6 hours, ideally overnight. Leave the ring on.",
     "min": 360
    },
    {
     "t": "Topping: whisk the sugar and cornstarch in a small saucepan, add half the strawberries, the water and lemon juice, and cook on medium-low, stirring constantly, until the berries break down and it thickens."
    },
    {
     "t": "Off the heat, stir in the rest of the strawberries and the butter. Cool in a heatproof bowl until no longer warm (the fridge speeds it up)."
    },
    {
     "t": "Pour over the set cheesecake. For clean slices, chill about an hour more before cutting.",
     "min": 60
    }
   ]
  },
  "Turtle Cheesecake": {
   "name": "Turtle Cheesecake",
   "desc": "Caramel, chocolate and pecans",
   "cat": "Cheesecakes",
   "look": [
    "#F5E6D8",
    "#8A4F22",
    "#F4DDB0",
    "#3D2117",
    "#6B3F1E"
   ],
   "sections": [
    {
     "title": "Chocolate Ripple (ganache)",
     "items": [
      {
       "ing": "Heavy cream",
       "amt": 60,
       "note": "¼ cup (60 ml)"
      },
      {
       "ing": "Semisweet/dark chocolate",
       "amt": 57,
       "note": "2 oz (57 g), chopped"
      }
     ]
    },
    {
     "title": "Graham Pecan Crust",
     "items": [
      {
       "ing": "Graham cracker crumbs",
       "amt": 170,
       "note": "1 ½ cups (170 g)"
      },
      {
       "ing": "Pecans",
       "amt": 40,
       "note": "⅓ cup (40 g), finely chopped"
      },
      {
       "ing": "Brown sugar",
       "amt": 39,
       "note": "3 Tablespoons light brown, packed"
      },
      {
       "ing": "Butter",
       "amt": 98,
       "note": "7 Tablespoons (98 g), salted, melted"
      }
     ]
    },
    {
     "title": "Cheesecake Filling",
     "items": [
      {
       "ing": "Cream cheese (brick)",
       "amt": 680,
       "note": "24 oz (680 g), full-fat"
      },
      {
       "ing": "Sugar (white)",
       "amt": 150,
       "note": "¾ cup (150 g)"
      },
      {
       "ing": "Brown sugar",
       "amt": 50,
       "note": "¼ cup (50 g) light brown, packed"
      },
      {
       "ing": "Sour cream",
       "amt": 120,
       "note": "½ cup (120 g)"
      },
      {
       "ing": "Vanilla extract",
       "amt": 3.75,
       "note": "¾ teaspoon"
      },
      {
       "ing": "Eggs (large)",
       "amt": 3,
       "note": "3 large, room temp"
      },
      {
       "ing": "Caramel sauce",
       "amt": 60,
       "note": "¼ cup"
      }
     ]
    },
    {
     "title": "Topping",
     "items": [
      {
       "ing": "Caramel sauce",
       "amt": 80,
       "note": "⅓ cup"
      },
      {
       "ing": "Semisweet/dark chocolate",
       "amt": 28,
       "note": "1 oz, chopped"
      },
      {
       "ing": "Heavy cream",
       "amt": 30,
       "note": "2 Tablespoons"
      },
      {
       "ing": "Pecans",
       "amt": 90,
       "note": "¾ cup (90 g), chopped and halved"
      }
     ]
    }
   ],
   "per": "cheesecake",
   "size": "9\" cheesecake",
   "pieces": 12,
   "piece": "slice",
   "markup": 3,
   "packaging": 0,
   "source": "https://sugarspunrun.com/?p=56070",
   "steps": [
    {
     "t": "Chocolate ripple: microwave the ¼ cup cream with the 2 oz chopped chocolate for 25 seconds, stir, 25 more, and whisk smooth. Set aside to cool."
    },
    {
     "t": "Crust: mix the graham crumbs, finely chopped pecans and brown sugar, stir in the melted butter, and press firmly over the bottom and up the sides of a 9\" springform pan."
    },
    {
     "t": "Heat the oven to 325°F (160°C)."
    },
    {
     "t": "Beat the cream cheese and both sugars on medium until smooth. On low, mix in the sour cream and vanilla, then the lightly beaten eggs one at a time, briefly after each."
    },
    {
     "t": "Layer: a third of the batter, half the ¼ cup caramel, half the chocolate ripple, another third of the batter, the rest of the caramel and ripple, then the last of the batter."
    },
    {
     "t": "Bake on the center rack until almost set: edges set and maybe puffed, center still jiggles (50–55 min).",
     "min": 50
    },
    {
     "t": "Cool until nearly room temperature, or turn the oven off, crack the door and leave it 1 hour.",
     "min": 60
    },
    {
     "t": "Chill at least 6 hours, ideally overnight.",
     "min": 360
    },
    {
     "t": "Topping: microwave the 1 oz chocolate with the 2 Tbsp cream for 25 seconds and whisk smooth. Drizzle the ⅓ cup caramel and the chocolate over the top and scatter the pecans."
    },
    {
     "t": "Chill until set, then take off the ring and slice.",
     "min": 15
    }
   ]
  }
 }
};

// Photos for the built-in cakes: slice (Cakes and Recipes lists), hero (full cake at the top of a recipe)
const PHOTOS = {
 "Apple Pie Cheesecake": {
  "slice": "icons/cakes/apple-pie-slice.webp",
  "hero": "icons/cakes/apple-pie-hero.webp"
 },
 "Blueberry Cheesecake": {
  "slice": "icons/cakes/blueberry-slice.webp",
  "hero": "icons/cakes/blueberry-hero.webp"
 },
 "Cheesecake Brownies": {
  "slice": "icons/cakes/brownies-slice.webp",
  "hero": "icons/cakes/brownies-hero.webp"
 },
 "Chocolate Cheesecake": {
  "slice": "icons/cakes/chocolate-slice.webp",
  "hero": "icons/cakes/chocolate-hero.webp"
 },
 "Cinnamon Roll Cheesecake": {
  "slice": "icons/cakes/cinnamon-roll-slice.webp",
  "hero": "icons/cakes/cinnamon-roll-hero.webp"
 },
 "Key Lime Cheesecake": {
  "slice": "icons/cakes/key-lime-slice.webp",
  "hero": "icons/cakes/key-lime-hero.webp"
 },
 "New York Cheesecake": {
  "slice": "icons/cakes/new-york-slice.webp",
  "hero": "icons/cakes/new-york-hero.webp"
 },
 "Oreo Cheesecake": {
  "slice": "icons/cakes/oreo-slice.webp",
  "hero": "icons/cakes/oreo-hero.webp"
 },
 "Peanut Butter Cheesecake": {
  "slice": "icons/cakes/peanut-butter-slice.webp",
  "hero": "icons/cakes/peanut-butter-hero.webp"
 },
 "Pumpkin Cheesecake": {
  "slice": "icons/cakes/pumpkin-slice.webp",
  "hero": "icons/cakes/pumpkin-hero.webp"
 },
 "Raspberry Cheesecake": {
  "slice": "icons/cakes/raspberry-slice.webp",
  "hero": "icons/cakes/raspberry-hero.webp"
 },
 "Regular Cheesecake": {
  "slice": "icons/cakes/regular-slice.webp",
  "hero": "icons/cakes/regular-hero.webp"
 },
 "Salted Caramel Cheesecake": {
  "slice": "icons/cakes/salted-caramel-slice.webp",
  "hero": "icons/cakes/salted-caramel-hero.webp"
 },
 "Strawberry Cheesecake": {
  "slice": "icons/cakes/strawberry-slice.webp",
  "hero": "icons/cakes/strawberry-hero.webp"
 },
 "Turtle Cheesecake": {
  "slice": "icons/cakes/turtle-slice.webp",
  "hero": "icons/cakes/turtle-hero.webp"
 }
};
