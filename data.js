// CakeCart data: recipes (amount per cake), pricing units, store packages [size, price, label]
const D = {
 "recipes": {
  "Apple Pie Cheesecake": [
   [
    "Apples",
    907
   ],
   [
    "Brown sugar",
    133
   ],
   [
    "Butter",
    30
   ],
   [
    "Cornstarch",
    5.3
   ],
   [
    "Ground cinnamon",
    1.3
   ],
   [
    "Salt",
    0.7
   ],
   [
    "Vanilla extract",
    2.5
   ],
   [
    "Old fashioned oats",
    40
   ],
   [
    "Flour (all-purpose)",
    41
   ],
   [
    "Brown sugar",
    50
   ],
   [
    "Baking soda",
    1.2
   ],
   [
    "Ground cinnamon",
    0.65
   ],
   [
    "Salt",
    1.5
   ],
   [
    "Butter",
    57
   ],
   [
    "Graham cracker crumbs",
    170
   ],
   [
    "Walnuts",
    40
   ],
   [
    "Sugar (white)",
    25
   ],
   [
    "Brown sugar",
    13
   ],
   [
    "Butter",
    98
   ],
   [
    "Cream cheese (brick)",
    680
   ],
   [
    "Sugar (white)",
    200
   ],
   [
    "Sour cream",
    120
   ],
   [
    "Vanilla extract",
    5
   ],
   [
    "Eggs (large)",
    3
   ]
  ],
  "Blueberry Cheesecake": [
   [
    "Graham cracker crumbs",
    170
   ],
   [
    "Sugar (white)",
    25
   ],
   [
    "Brown sugar",
    13
   ],
   [
    "Butter",
    74
   ],
   [
    "Cream cheese (brick)",
    680
   ],
   [
    "Sugar (white)",
    150
   ],
   [
    "Sour cream",
    120
   ],
   [
    "Vanilla extract",
    5
   ],
   [
    "Eggs (large)",
    3
   ],
   [
    "Blueberries",
    311
   ],
   [
    "Sugar (white)",
    50
   ],
   [
    "Cornstarch",
    8
   ],
   [
    "Blueberries",
    465
   ],
   [
    "Lemon juice",
    15
   ],
   [
    "Butter",
    14
   ]
  ],
  "Caramel Sauce": [
   [
    "Sugar (white)",
    200
   ],
   [
    "Light corn syrup",
    30
   ],
   [
    "Salt",
    3
   ],
   [
    "Heavy cream",
    120
   ],
   [
    "Butter",
    42
   ],
   [
    "Vanilla extract",
    7.5
   ]
  ],
  "Cheesecake Brownies": [
   [
    "Butter",
    170
   ],
   [
    "Semisweet/dark chocolate",
    113
   ],
   [
    "Cocoa powder (unsweetened)",
    50
   ],
   [
    "Instant coffee",
    1
   ],
   [
    "Sugar (white)",
    200
   ],
   [
    "Brown sugar",
    100
   ],
   [
    "Eggs (large)",
    2
   ],
   [
    "Vanilla extract",
    5
   ],
   [
    "Salt",
    3
   ],
   [
    "Flour (all-purpose)",
    125
   ],
   [
    "Chocolate chips (semisweet)",
    150
   ],
   [
    "Cream cheese (brick)",
    453
   ],
   [
    "Sugar (white)",
    100
   ],
   [
    "Sour cream",
    65
   ],
   [
    "Eggs (large)",
    2
   ],
   [
    "Vanilla extract",
    2.5
   ]
  ],
  "Chocolate Cheesecake": [
   [
    "Butter",
    57
   ],
   [
    "Oreo cookies",
    25
   ],
   [
    "Semisweet/dark chocolate",
    285
   ],
   [
    "Cream cheese (brick)",
    907
   ],
   [
    "Sugar (white)",
    266
   ],
   [
    "Vanilla extract",
    7.5
   ],
   [
    "Sour cream",
    160
   ],
   [
    "Eggs (large)",
    4
   ]
  ],
  "Cinnamon Roll Cheesecake": [
   [
    "Graham cracker crumbs",
    170
   ],
   [
    "Sugar (white)",
    25
   ],
   [
    "Brown sugar",
    13
   ],
   [
    "Ground cinnamon",
    1.3
   ],
   [
    "Butter",
    100
   ],
   [
    "Cream cheese (brick)",
    678
   ],
   [
    "Sugar (white)",
    150
   ],
   [
    "Sour cream",
    120
   ],
   [
    "Vanilla extract",
    5
   ],
   [
    "Salt",
    1.5
   ],
   [
    "Eggs (large)",
    3
   ],
   [
    "Brown sugar",
    200
   ],
   [
    "Flour (all-purpose)",
    42
   ],
   [
    "Ground cinnamon",
    10.4
   ],
   [
    "Butter",
    70
   ],
   [
    "Powdered sugar",
    62
   ],
   [
    "Vanilla extract",
    0.6
   ],
   [
    "Milk",
    12.5
   ],
   [
    "Heavy cream",
    180
   ],
   [
    "Powdered sugar",
    30
   ],
   [
    "Vanilla extract",
    2.5
   ],
   [
    "Sugar (white)",
    6
   ],
   [
    "Ground cinnamon",
    0.65
   ]
  ],
  "Key Lime Cheesecake": [
   [
    "Key lime juice",
    118
   ],
   [
    "Eggs (large)",
    3
   ],
   [
    "Sugar (white)",
    50
   ],
   [
    "Salt",
    1.5
   ],
   [
    "Butter",
    28
   ],
   [
    "Graham cracker crumbs",
    170
   ],
   [
    "Sugar (white)",
    25
   ],
   [
    "Brown sugar",
    13
   ],
   [
    "Butter",
    71
   ],
   [
    "Cream cheese (brick)",
    680
   ],
   [
    "Sugar (white)",
    200
   ],
   [
    "Sour cream",
    60
   ],
   [
    "Eggs (large)",
    2
   ]
  ],
  "New York Cheesecake": [
   [
    "Graham cracker crumbs",
    170
   ],
   [
    "Sugar (white)",
    12.5
   ],
   [
    "Butter",
    55
   ],
   [
    "Cream cheese (brick)",
    680
   ],
   [
    "Sugar (white)",
    200
   ],
   [
    "Vanilla extract",
    7.5
   ],
   [
    "Salt",
    0.7
   ],
   [
    "Eggs (large)",
    5
   ],
   [
    "Sour cream",
    454
   ],
   [
    "Sugar (white)",
    200
   ],
   [
    "Vanilla extract",
    7.5
   ]
  ],
  "Oreo Cheesecake": [
   [
    "Oreo cookies",
    35
   ],
   [
    "Butter",
    75
   ],
   [
    "Oreo cookies",
    15
   ],
   [
    "Cream cheese (brick)",
    907
   ],
   [
    "Sugar (white)",
    200
   ],
   [
    "Sour cream",
    180
   ],
   [
    "Vanilla extract",
    5
   ],
   [
    "Eggs (large)",
    4
   ],
   [
    "Semisweet/dark chocolate",
    85
   ],
   [
    "Heavy cream",
    118
   ]
  ],
  "Peanut Butter Cheesecake": [
   [
    "Oreo cookies",
    35
   ],
   [
    "Butter",
    75
   ],
   [
    "Cream cheese (brick)",
    678
   ],
   [
    "Peanut butter (creamy)",
    280
   ],
   [
    "Sugar (white)",
    250
   ],
   [
    "Sour cream",
    120
   ],
   [
    "Vanilla extract",
    10
   ],
   [
    "Eggs (large)",
    3
   ],
   [
    "Heavy cream",
    30
   ],
   [
    "Semisweet/dark chocolate",
    85
   ],
   [
    "Heavy cream",
    118
   ]
  ],
  "Pumpkin Cheesecake": [
   [
    "Graham cracker crumbs",
    170
   ],
   [
    "Sugar (white)",
    25
   ],
   [
    "Brown sugar",
    13
   ],
   [
    "Butter",
    99
   ],
   [
    "Cream cheese (brick)",
    680
   ],
   [
    "Brown sugar",
    150
   ],
   [
    "Sugar (white)",
    100
   ],
   [
    "Sour cream",
    80
   ],
   [
    "Vanilla extract",
    7.5
   ],
   [
    "Pumpkin puree",
    244
   ],
   [
    "Pumpkin pie spice",
    6.5
   ],
   [
    "Eggs (large)",
    3
   ],
   [
    "Heavy cream",
    175
   ],
   [
    "Powdered sugar",
    30
   ],
   [
    "Vanilla extract",
    2.5
   ],
   [
    "Ground cinnamon",
    0.3
   ]
  ],
  "Raspberry Cheesecake": [
   [
    "Raspberries",
    340
   ],
   [
    "Sugar (white)",
    50
   ],
   [
    "Lemon juice",
    15
   ],
   [
    "Graham cracker crumbs",
    170
   ],
   [
    "Sugar (white)",
    25
   ],
   [
    "Brown sugar",
    13
   ],
   [
    "Butter",
    100
   ],
   [
    "Cream cheese (brick)",
    680
   ],
   [
    "Sugar (white)",
    200
   ],
   [
    "Sour cream",
    120
   ],
   [
    "Vanilla extract",
    5
   ],
   [
    "Eggs (large)",
    3
   ]
  ],
  "Regular Cheesecake": [
   [
    "Graham cracker crumbs",
    170
   ],
   [
    "Sugar (white)",
    25
   ],
   [
    "Brown sugar",
    13
   ],
   [
    "Butter",
    99
   ],
   [
    "Cream cheese (brick)",
    910
   ],
   [
    "Sugar (white)",
    200
   ],
   [
    "Sour cream",
    160
   ],
   [
    "Vanilla extract",
    7.5
   ],
   [
    "Salt",
    0.7
   ],
   [
    "Eggs (large)",
    4
   ]
  ],
  "Salted Caramel Cheesecake": [
   [
    "Graham cracker crumbs",
    170
   ],
   [
    "Pecans",
    40
   ],
   [
    "Sugar (white)",
    25
   ],
   [
    "Brown sugar",
    13
   ],
   [
    "Butter",
    99
   ],
   [
    "Cream cheese (brick)",
    680
   ],
   [
    "Sugar (white)",
    200
   ],
   [
    "Sour cream",
    120
   ],
   [
    "Vanilla extract",
    5
   ],
   [
    "Eggs (large)",
    3
   ],
   [
    "Caramel sauce",
    236
   ],
   [
    "Flaky sea salt",
    1
   ]
  ],
  "Strawberry Cheesecake": [
   [
    "Graham cracker crumbs",
    170
   ],
   [
    "Sugar (white)",
    25
   ],
   [
    "Brown sugar",
    13
   ],
   [
    "Butter",
    74
   ],
   [
    "Cream cheese (brick)",
    680
   ],
   [
    "Sugar (white)",
    200
   ],
   [
    "Sour cream",
    120
   ],
   [
    "Vanilla extract",
    5
   ],
   [
    "Eggs (large)",
    3
   ],
   [
    "Strawberries",
    680
   ],
   [
    "Sugar (white)",
    50
   ],
   [
    "Cornstarch",
    12
   ],
   [
    "Lemon juice",
    15
   ],
   [
    "Butter",
    14
   ]
  ],
  "Turtle Cheesecake": [
   [
    "Heavy cream",
    60
   ],
   [
    "Semisweet/dark chocolate",
    57
   ],
   [
    "Graham cracker crumbs",
    170
   ],
   [
    "Pecans",
    40
   ],
   [
    "Brown sugar",
    39
   ],
   [
    "Butter",
    98
   ],
   [
    "Cream cheese (brick)",
    680
   ],
   [
    "Sugar (white)",
    150
   ],
   [
    "Brown sugar",
    50
   ],
   [
    "Sour cream",
    120
   ],
   [
    "Vanilla extract",
    3.75
   ],
   [
    "Eggs (large)",
    3
   ],
   [
    "Caramel sauce",
    60
   ],
   [
    "Caramel sauce",
    80
   ],
   [
    "Semisweet/dark chocolate",
    28
   ],
   [
    "Heavy cream",
    30
   ],
   [
    "Pecans",
    90
   ]
  ]
 },
 "units": {
  "Graham cracker crumbs": "g",
  "Sugar (white)": "g",
  "Brown sugar": "g",
  "Butter": "g",
  "Cream cheese (brick)": "g",
  "Sour cream": "g",
  "Vanilla extract": "ml",
  "Salt": "g",
  "Eggs (large)": "each",
  "Pumpkin puree": "g",
  "Pumpkin pie spice": "g",
  "Heavy cream": "ml",
  "Powdered sugar": "g",
  "Ground cinnamon": "g",
  "Strawberries": "g",
  "Cornstarch": "g",
  "Lemon juice": "ml",
  "Oreo cookies": "each",
  "Peanut butter (creamy)": "g",
  "Semisweet/dark chocolate": "g",
  "Flour (all-purpose)": "g",
  "Milk": "ml",
  "Raspberries": "g",
  "Key lime juice": "ml",
  "Pecans": "g",
  "Caramel sauce": "ml",
  "Flaky sea salt": "g",
  "Light corn syrup": "ml",
  "Apples": "g",
  "Old fashioned oats": "g",
  "Baking soda": "g",
  "Walnuts": "g",
  "Blueberries": "g",
  "Cocoa powder (unsweetened)": "g",
  "Instant coffee": "g",
  "Chocolate chips (semisweet)": "g"
 },
 "pkgs": {
  "Graham cracker crumbs": [
   408,
   4.72,
   "Honey Maid graham crackers, 14.4 oz"
  ],
  "Sugar (white)": [
   907,
   2.38,
   "Dulce Caña cane sugar, 2 lb"
  ],
  "Brown sugar": [
   454,
   1.34,
   "Great Value brown sugar, 1 lb"
  ],
  "Butter": [
   227,
   5.94,
   "Kerrygold 8 oz (2 sticks)"
  ],
  "Cream cheese (brick)": [
   2722,
   26.23,
   "box of 12 × 8 oz bricks"
  ],
  "Sour cream": [
   454,
   3.52,
   "Daisy 16 oz tub"
  ],
  "Vanilla extract": [
   59,
   3.38,
   "Especias Montero vanilla, 2 fl oz"
  ],
  "Salt": [
   737,
   1.26,
   "26 oz container"
  ],
  "Eggs (large)": [
   18,
   3,
   "Great Value 18-count case"
  ],
  "Pumpkin puree": [
   425,
   2.37,
   "15 oz can"
  ],
  "Pumpkin pie spice": [
   56.7,
   2.94,
   "2 oz jar"
  ],
  "Heavy cream": [
   946,
   4.57,
   "Country Crock dairy-free whipping, 32 fl oz"
  ],
  "Powdered sugar": [
   454,
   2.28,
   "Domino powdered sugar, 1 lb"
  ],
  "Ground cinnamon": [
   70.9,
   1.54,
   "2.5 oz jar"
  ],
  "Strawberries": [
   454,
   2.66,
   "Great Value frozen strawberries, 16 oz"
  ],
  "Cornstarch": [
   454,
   2.38,
   "16 oz box"
  ],
  "Lemon juice": [
   240,
   3.97,
   "2 lb bag of lemons"
  ],
  "Flour (all-purpose)": [
   2268,
   2.38,
   "5 lb bag of flour"
  ],
  "Milk": [
   1890,
   6.86,
   "½ gallon"
  ]
 },
 "priceDate": "Nov 22, 2026"
};
