# Skip Selection Redesign

Redesigned skip selection page for We Want Waste technical assessment.

## Run the app

```bash
npm install
npm run dev
```

Open http://localhost:5173

## What I changed

**Design**
- Dark theme with gradient backgrounds
- Card layout instead of list
- Each skip size has unique color
- Hover effects and animations
- Selection shows blue ring and check mark

**Responsive** 
- Mobile: 1 column
- Tablet: 2 columns  
- Desktop: 3 columns
- Bottom bar stacks on mobile
- Text sizes adjust

**Functionality**
- Click card to select
- Click again to deselect
- Bottom bar appears with selection
- Shows price with VAT calculated
- Uses real API data

**Tech**
- React with Vite
- Tailwind CSS
- Fetches from We Want Waste API

That's it. The app maintains all original functionality with a completely new look.