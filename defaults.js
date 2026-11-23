// CakeCart built-in data (from the original spreadsheet). Your own edits are saved on your device.
const DEFAULTS = {
 "version": 1,
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
   "packaging": 0
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
   "packaging": 0
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
   "yieldUnit": "ml"
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
   "packaging": 0
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
   "packaging": 0
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
   "packaging": 0
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
   "packaging": 0
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
   "packaging": 0
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
   "packaging": 0
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
   "packaging": 0
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
   "packaging": 0
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
   "packaging": 0
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
   "packaging": 0
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
   "packaging": 0
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
   "packaging": 0
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
   "packaging": 0
  }
 }
};
