# How to Add Stall Menus

## Method 1: Using the Script (Recommended)

1. Make sure your backend server is **NOT running**
2. Open terminal in the `backend` directory
3. Run:
   ```bash
   node scripts/addStallMenus.js
   ```

This will directly add all menu items to the database.

## Method 2: Using API Endpoint

1. Make sure your backend server **IS running** (on port 4000)
2. Use Postman, curl, or any HTTP client to POST to:
   ```
   POST http://localhost:4000/api/food/add-stall-menus
   Content-Type: application/json
   
   {
     "stallName": "Kathi Junction",
     "items": [
       {
         "name": "Aalu Roll",
         "price": 80,
         "category": "Rolls",
         "description": "Delicious potato roll with spices",
         "image": "1721329323168food_1.png"
       },
       // ... more items
     ]
   }
   ```

## Menu Items Included

### Kathi Junction (8 items)
- Aalu Roll, Chicken Roll, Soya Chaap Roll, Egg Roll, Double Egg Roll, Peri Peri Chicken Roll, Dbl Soya Chaap Roll, Mutton Roll

### Old Rao Hotel (47 items)
- Hot Beverages: 13 items
- Cold Beverages: 8 items  
- Paranthas: 12 items (6 regular + 6 with dahi)
- Snacks: 12 items
- Pakoras: 2 items

## Note
All items use placeholder images initially. Update images through the admin panel later.

